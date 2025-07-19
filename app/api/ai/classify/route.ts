import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// Define type for OpenRouter model
interface OpenRouterModel {
  id: string;
  name: string;
  description: string;
}

const VALID_MODELS: string[] = [
  "anthropic/claude-3-haiku",
  "anthropic/claude-3-sonnet",
  "google/gemini-pro",
  "meta-llama/llama-3-70b-instruct",
  "openchat/openchat-7b",
  "gpt-3.5-turbo"
];

const VALID_DEPARTMENTS: string[] = [
  "Fire",
  "Medical", 
  "Police",
  "Traffic",
  "Crime",
  "Disaster",
  "Other"
];

export async function POST(req: NextRequest) {
  try {
    // Check if required environment variables are present
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { 
          department: "Other",
          error: "Classification service not configured"
        },
        { status: 503 }
      );
    }

    const { description } = await req.json();

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid description" },
        { status: 400 }
      );
    }

    // Get available models with proper error handling
    let availableModels: string[] = [];
    try {
      const modelsResponse = await fetch("https://openrouter.ai/api/v1/models", {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
        }
      });
      
      if (modelsResponse.ok) {
        const modelsData: { data: OpenRouterModel[] } = await modelsResponse.json();
        availableModels = modelsData.data.map((model: OpenRouterModel) => model.id);
      }
    } catch (modelError) {
      console.log("Could not fetch available models, using fallback");
    }

    // Select the best available model
    const model = VALID_MODELS.find((m: string) => availableModels.includes(m)) || 
                 availableModels.find((m: string) => m.includes('claude') || m.includes('gpt')) || 
                 "anthropic/claude-3-haiku"; // fallback

    // Enhanced prompt for better classification
    const classificationPrompt = `You are an emergency dispatch classifier for Bangladesh's 999 service. 

Analyze this incident report and classify it into the most appropriate department. Respond with ONLY ONE of these exact department names:

- Fire: Fire emergencies, building fires, forest fires, gas leaks, explosions
- Medical: Medical emergencies, accidents with injuries, health crises, ambulance needed
- Police: Criminal activities, theft, violence, domestic disputes, suspicious activities
- Traffic: Road accidents, traffic violations, vehicle incidents, road blockages
- Crime: Serious criminal activities, ongoing crimes, security threats
- Disaster: Natural disasters, floods, earthquakes, severe weather emergencies
- Other: Non-emergency issues, general complaints, unclear situations

Incident Description: "${description.trim()}"

Respond with ONLY the department name (Fire, Medical, Police, Traffic, Crime, Disaster, or Other). No explanation needed.`;

    // Make classification request with retry logic
    let attempts = 0;
    const maxAttempts = 2;
    
    while (attempts < maxAttempts) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": `${process.env.NEXT_PUBLIC_SITE_URL || ""}`,
            "X-Title": `${process.env.NEXT_PUBLIC_SITE_NAME || "CivicSafe"}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model,
            messages: [{
              role: "user",
              content: classificationPrompt
            }],
            temperature: 0.1,
            max_tokens: 50
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        
        // Validate response structure
        const aiResponse = data.choices?.[0]?.message?.content?.trim();
        
        if (!aiResponse) {
          throw new Error("Empty response from AI model");
        }

        // Clean and validate department response
        const cleanResponse = aiResponse.replace(/[^a-zA-Z\s]/g, '').trim();
        
        // Try exact match first
        let matchedDepartment = VALID_DEPARTMENTS.find(dept => 
          dept.toLowerCase() === cleanResponse.toLowerCase()
        );

        // If no exact match, try partial matching
        if (!matchedDepartment) {
          matchedDepartment = VALID_DEPARTMENTS.find(dept => 
            cleanResponse.toLowerCase().includes(dept.toLowerCase()) ||
            dept.toLowerCase().includes(cleanResponse.toLowerCase())
          );
        }

        // Fallback classification based on keywords if AI fails
        if (!matchedDepartment) {
          const descLower = description.toLowerCase();
          
          if (descLower.includes('fire') || descLower.includes('burn') || descLower.includes('smoke') || descLower.includes('explosion')) {
            matchedDepartment = 'Fire';
          } else if (descLower.includes('medical') || descLower.includes('ambulance') || descLower.includes('injury') || descLower.includes('accident')) {
            matchedDepartment = 'Medical';
          } else if (descLower.includes('theft') || descLower.includes('robbery') || descLower.includes('crime') || descLower.includes('violence')) {
            matchedDepartment = 'Police';
          } else if (descLower.includes('traffic') || descLower.includes('road') || descLower.includes('vehicle') || descLower.includes('car')) {
            matchedDepartment = 'Traffic';
          } else if (descLower.includes('flood') || descLower.includes('earthquake') || descLower.includes('disaster') || descLower.includes('storm')) {
            matchedDepartment = 'Disaster';
          } else {
            matchedDepartment = 'Other';
          }
        }

        return NextResponse.json({ 
          department: matchedDepartment,
          confidence: matchedDepartment !== 'Other' ? 'high' : 'low'
        });

      } catch (error) {
        attempts++;
        console.error(`Classification attempt ${attempts} failed:`, error);
        
        if (attempts >= maxAttempts) {
          // Final fallback - keyword-based classification
          const descLower = description.toLowerCase();
          let fallbackDepartment = 'Other';
          
          if (descLower.includes('fire') || descLower.includes('burn') || descLower.includes('smoke')) {
            fallbackDepartment = 'Fire';
          } else if (descLower.includes('medical') || descLower.includes('ambulance') || descLower.includes('injury')) {
            fallbackDepartment = 'Medical';
          } else if (descLower.includes('theft') || descLower.includes('robbery') || descLower.includes('crime')) {
            fallbackDepartment = 'Police';
          } else if (descLower.includes('traffic') || descLower.includes('road') || descLower.includes('accident')) {
            fallbackDepartment = 'Traffic';
          } else if (descLower.includes('flood') || descLower.includes('disaster')) {
            fallbackDepartment = 'Disaster';
          }

          return NextResponse.json(
            { 
              department: fallbackDepartment,
              error: "AI classification failed, used keyword matching",
              confidence: 'low'
            },
            { status: 200 }
          );
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

  } catch (error) {
    console.error("Classification error:", error);
    
    // Emergency fallback
    return NextResponse.json(
      { 
        department: "Other",
        error: "Classification service temporarily unavailable",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}