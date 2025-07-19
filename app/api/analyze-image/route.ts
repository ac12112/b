import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log("=== IMAGE ANALYSIS API CALLED ===");
    
    // Check if required environment variables are present
    if (!process.env.OPENROUTER_API_KEY) {
      console.log("OpenRouter API key not found, returning fallback response");
      return NextResponse.json({
        title: "Emergency Report - Manual Entry Required",
        reportType: "Other",
        description: "Image analysis service is not configured. Please provide details manually."
      });
    }

    const { image } = await request.json();
    console.log("Received image data length:", image?.length || 0);
    
    if (!image) {
      console.log("No image provided in request");
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Handle different image formats
    let base64Data;
    let mimeType = "image/jpeg"; // default
    
    if (image.startsWith('data:')) {
      console.log("Processing data URL format");
      const parts = image.split(',');
      if (parts.length !== 2) {
        throw new Error("Invalid data URL format");
      }
      
      // Extract mime type
      const mimeMatch = parts[0].match(/data:([^;]+)/);
      if (mimeMatch) {
        mimeType = mimeMatch[1];
      }
      
      base64Data = parts[1];
    } else {
      console.log("Processing raw base64 format");
      base64Data = image;
    }

    // Validate base64 data
    if (!base64Data || base64Data.length < 100) {
      throw new Error("Invalid or too small image data");
    }

    console.log("Base64 data length:", base64Data.length);
    console.log("MIME type:", mimeType);

    const prompt = `Analyze this emergency incident image and respond with ONLY a JSON object in this exact format:

{
  "title": "Brief incident title (max 60 characters)",
  "reportType": "One of: Theft, Fire Outbreak, Medical Emergency, Natural Disaster, Violence, Other",
  "description": "Detailed description of what you see (2-3 sentences, max 200 characters)"
}

IMPORTANT RULES:
- Respond ONLY with valid JSON, no other text
- Use exactly one of the reportType options listed
- Be specific and factual about what you observe
- If unsure about incident type, use "Other"
- No markdown formatting or code blocks`;

    const requestBody = {
      model: "anthropic/claude-3-haiku", // Using faster model
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Data}`
              }
            }
          ]
        }
      ],
      max_tokens: 300,
      temperature: 0.1
    };

    console.log("Making request to OpenRouter API with model:", requestBody.model);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "CivicSafe",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    console.log("OpenRouter response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API Error:', errorText);
      
      // Return fallback instead of throwing error
      return NextResponse.json({
        title: "Incident Report",
        reportType: "Other", 
        description: "Unable to analyze image. Please provide details manually."
      });
    }

    const data = await response.json();
    console.log("OpenRouter full response:", JSON.stringify(data, null, 2));
    
    if (!data.choices?.[0]?.message?.content) {
      console.error("Invalid response structure from OpenRouter");
      return NextResponse.json({
        title: "Incident Report",
        reportType: "Other",
        description: "Image analysis failed. Please provide details manually."
      });
    }

    let content = data.choices[0].message.content.trim();
    console.log("Raw AI response content:", content);
    
    // Valid report types
    const validTypes = ["Theft", "Fire Outbreak", "Medical Emergency", "Natural Disaster", "Violence", "Other"];
    
    try {
      // Clean the content - remove any markdown formatting
      let cleanContent = content;
      
      // Remove code block markers
      if (cleanContent.includes('```')) {
        cleanContent = cleanContent.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      }
      
      // Remove any leading/trailing whitespace and newlines
      cleanContent = cleanContent.trim();
      
      // Find JSON object in the response
      let jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanContent = jsonMatch[0];
      }
      
      console.log("Cleaned content for JSON parsing:", cleanContent);
      
      const jsonResponse = JSON.parse(cleanContent);
      console.log("Successfully parsed JSON:", jsonResponse);
      
      // Validate required fields
      if (!jsonResponse.title || !jsonResponse.reportType || !jsonResponse.description) {
        throw new Error("Missing required fields in JSON response");
      }
      
      // Validate and clean the report type
      const reportType = validTypes.find(type => 
        type.toLowerCase() === jsonResponse.reportType.toLowerCase()
      ) || "Other";
      
      const result = {
        title: String(jsonResponse.title).substring(0, 100).trim(),
        reportType: reportType,
        description: String(jsonResponse.description).substring(0, 500).trim()
      };
      
      console.log("=== SUCCESSFUL ANALYSIS RESULT ===");
      console.log("Title:", result.title);
      console.log("Report Type:", result.reportType);
      console.log("Description:", result.description);
      
      return NextResponse.json(result);
      
    } catch (jsonError) {
      console.log("JSON parsing failed, attempting text extraction:", jsonError);
      console.log("Attempting to extract from raw content:", content);
      
      // Enhanced text extraction fallback
      let title = "";
      let reportType = "Other";
      let description = "";

      // Try multiple extraction patterns
      const titlePatterns = [
        /(?:title|incident)["\s]*:[\s]*["']([^"'\n]+)["']/i,
        /(?:title|incident)["\s]*:[\s]*([^,\n]+)/i,
        /"title":\s*"([^"]+)"/i
      ];
      
      const typePatterns = [
        /(?:reporttype|type|incident_type)["\s]*:[\s]*["']([^"'\n]+)["']/i,
        /(?:reporttype|type|incident_type)["\s]*:[\s]*([^,\n]+)/i,
        /"reportType":\s*"([^"]+)"/i
      ];
      
      const descPatterns = [
        /(?:description|desc)["\s]*:[\s]*["']([^"'\n]+)["']/i,
        /(?:description|desc)["\s]*:[\s]*([^,\n}]+)/i,
        /"description":\s*"([^"]+)"/i
      ];

      // Extract title
      for (const pattern of titlePatterns) {
        const match = content.match(pattern);
        if (match && match[1]) {
          title = match[1].trim();
          break;
        }
      }

      // Extract report type
      for (const pattern of typePatterns) {
        const match = content.match(pattern);
        if (match && match[1]) {
          const extractedType = match[1].trim();
          reportType = validTypes.find(type => 
            type.toLowerCase() === extractedType.toLowerCase()
          ) || "Other";
          break;
        }
      }

      // Extract description
      for (const pattern of descPatterns) {
        const match = content.match(pattern);
        if (match && match[1]) {
          description = match[1].trim();
          break;
        }
      }

      // If extraction failed, generate basic content
      if (!title) {
        title = "Emergency Incident Report";
      }
      if (!description) {
        description = "Incident detected in uploaded image. Please provide additional details.";
      }

      const result = {
        title: title.substring(0, 100),
        reportType: reportType,
        description: description.substring(0, 500)
      };
      
      console.log("=== FALLBACK EXTRACTION RESULT ===");
      console.log("Title:", result.title);
      console.log("Report Type:", result.reportType);
      console.log("Description:", result.description);
      
      return NextResponse.json(result);
    }

  } catch (error) {
    console.error("=== IMAGE ANALYSIS ERROR ===");
    console.error("Error details:", error);
    
    // Always return a valid response
    const fallbackResult = {
      title: "Emergency Report - " + new Date().toLocaleDateString(),
      reportType: "Other",
      description: "Unable to analyze image automatically. Please provide incident details manually."
    };
    
    console.log("=== RETURNING FALLBACK RESULT ===");
    console.log(fallbackResult);
    
    return NextResponse.json(fallbackResult);
  }
}