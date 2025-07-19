import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Check if required environment variables are present
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({
        response: "⚠️ চ্যাট সেবা অস্থায়ীভাবে অনুপলব্ধ। জরুরি প্রয়োজনে ৯৯৯-এ সরাসরি কল করুন।"
      });
    }

    const { message, reportType, location } = await request.json();

    if (!message) {
      return NextResponse.json({
        response: "দুঃখিত, আপনার বার্তা পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।"
      });
    }

    const systemPrompt = `You are CivicGuard BD, the official AI assistant for Bangladesh's 999 emergency service extension. 
    Your capabilities:
    1. Explain 999 emergency protocols 
    2. Guide through verified (NID-based) or anonymous reporting
    3. Categorize incidents per Bangladesh context (road accidents, medical emergencies, etc.)
    4. Process media attachments for evidence analysis
    5. Provide real-time tracking of filed reports
    6. Detect and handle hate speech content
    7. Offer safety tips specific to Bangladeshi context
    8. Initiate emergency video calls with 999 operators
    Always:
    - Use Bengali numerals (৯৯৯) when mentioning emergency numbers
    - Refer to NID as জাতীয় পরিচয়পত্র
    - Prioritize connecting to live 999 operators for immediate emergencies
    - Use Dhaka time (BST) for timestamps
    - Mention Bangladesh Police, RAB, and other local authorities`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "",
        "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "CivicSafe",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Location: ${location || "Bangladesh"}, Report Type: ${reportType || "general"}, Message: ${message}`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "দুঃখিত, এই মুহূর্তে উত্তর দিতে পারছি না। জরুরি প্রয়োজনে ৯৯৯-এ কল করুন।";

    return NextResponse.json({
      response: aiResponse
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      response: "⚠️ সেবা অস্থায়ীভাবে অনুপলব্ধ। অনুগ্রহ করে ৯৯৯-এ সরাসরি কল করুন।"
    });
  }
}