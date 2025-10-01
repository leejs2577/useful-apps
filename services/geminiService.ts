
import { GoogleGenAI, Type } from "@google/genai";
import type { TravelPlan, TravelPlanRequest, TravelTheme } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const travelPlanSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A creative title for the trip in Korean" },
    summary: { type: Type.STRING, description: "A brief summary of the trip in Korean" },
    accommodation: {
      type: Type.OBJECT,
      properties: {
        type: { type: Type.STRING, description: "e.g., 럭셔리 호텔" },
        name: { type: Type.STRING, description: "e.g., 롯데호텔 서울" },
        reason: { type: Type.STRING, description: "Reason for recommendation in Korean" },
      },
      required: ['type', 'name', 'reason'],
    },
    estimatedBudget: {
      type: Type.OBJECT,
      properties: {
        totalPerPerson: { type: Type.NUMBER },
        currency: { type: Type.STRING, description: "Should be KRW" },
        breakdown: {
          type: Type.OBJECT,
          properties: {
            accommodation: { type: Type.NUMBER },
            food: { type: Type.NUMBER },
            transportation: { type: Type.NUMBER },
            activities: { type: Type.NUMBER },
          },
          required: ['accommodation', 'food', 'transportation', 'activities'],
        },
        details: { type: Type.STRING },
      },
      required: ['totalPerPerson', 'currency', 'breakdown', 'details'],
    },
    days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER },
          date: { type: Type.STRING },
          theme: { type: Type.STRING, description: "Daily theme in Korean" },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                transportation: { type: Type.STRING, description: "Transportation details. This is optional." },
              },
              required: ['time', 'title', 'description'],
            },
          },
          restaurantSuggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                cuisine: { type: Type.STRING },
                reason: { type: Type.STRING },
              },
              required: ['name', 'cuisine', 'reason'],
            },
          },
        },
        required: ['day', 'date', 'theme', 'activities', 'restaurantSuggestions'],
      },
    },
  },
  required: ['title', 'summary', 'accommodation', 'estimatedBudget', 'days'],
};

const buildPrompt = (request: TravelPlanRequest): string => {
  let transportationInstruction: string;
  let transportationModeDisplay: string;
  let transportationAdviceDetail: string;

  switch (request.transportationMode) {
    case 'public':
      transportationModeDisplay = '대중교통 (Public Transport)';
      transportationInstruction = 'All transportation advice must be based on public transport (subway, bus, train). Transportation costs should reflect fares.';
      transportationAdviceDetail = `        - If 'Public Transport': Suggest specific subway lines, bus numbers, or train routes.`;
      break;
    case 'car':
      transportationModeDisplay = '자동차 (Car)';
      transportationInstruction = 'All transportation advice must be based on driving a car. Suggest driving routes, mention parking, and base transportation costs on fuel and tolls.';
      transportationAdviceDetail = `        - If 'Car': Suggest driving routes, mention estimated driving times, and provide parking information where relevant.`;
      break;
    case 'airplane':
      transportationModeDisplay = '비행기 (Airplane)';
      transportationInstruction = `The travel plan involves flying. Assume travelers drive to the departure airport from "${request.departure}", park their car for the trip's duration, and then use public transport or a rental car at the destination. The budget must include airport parking fees, flight tickets, and local transport costs at the destination (rental car or public transport fares).`;
      transportationAdviceDetail = `For travel to the airport, assume driving. At the destination, choose either a rental car (suggesting routes, times, parking) OR public transport (suggesting lines, numbers) based on what's logical for the itinerary. Be specific.`;
      break;
  }

  const themeMap: Record<TravelTheme, string> = {
    default: '기본 (Default)',
    kids: '아이동반 (With Kids)',
    parents: '효도관광 (For Parents)',
    healing: '힐링 (Healing/Relaxing)',
    activity: '액티비티 (Activity-focused)',
    gourmet: '미식여행 (Gourmet Trip)',
    art: '예술/공연 (Art & Performance)',
    dog: '반려견 동반 (With Pet Dog)',
    custom: '(직접입력)',
  };
  
  let themeInstruction = '';
  const selectedTheme = request.travelTheme;

  if (selectedTheme && selectedTheme !== 'default') {
    let themeDescription: string;
    if (selectedTheme === 'custom' && request.customThemeText) {
      themeDescription = `사용자 지정 테마: "${request.customThemeText}"`;
    } else {
      themeDescription = `사전 정의된 테마: "${themeMap[selectedTheme]}"`;
    }

    themeInstruction = `
    13. **Travel Theme:** The user has specified a travel theme: ${themeDescription}. All recommendations—including activities, restaurants, and accommodation—must align with this theme.
       - For "아이동반 (With Kids)": Focus on family-friendly attractions, restaurants with kids' menus or space, and hotels with family rooms or pools. Avoid places that are not suitable for children.
       - For "효도관광 (For Parents)": Choose comfortable and accessible locations, restaurants with traditional and healthy food, and relaxing accommodations. Avoid strenuous activities.
       - For "힐링 (Healing/Relaxing)": Suggest quiet, scenic spots like temples, forests, spas, and tranquil cafes. The itinerary should be leisurely.
       - For "액티비티 (Activity-focused)": Include hiking, water sports, cycling, zip-lining, or other dynamic experiences.
       - For "미식여행 (Gourmet Trip)": The plan must revolve around food. Recommend famous local specialties, Michelin-starred restaurants, unique cafes, and local markets. The "reason" for restaurant suggestions should be very detailed.
       - For "예술/공연 (Art & Performance)": Focus on museums, art galleries, theater districts, live music venues, and architectural landmarks. Check for current exhibitions or performances if possible.
       - For "반려견 동반 (With Pet Dog)": Focus on pet-friendly options. Suggest accommodations that explicitly allow dogs. Recommend restaurants with outdoor seating or that are known to be dog-friendly. Plan activities in parks, on trails, or at beaches where dogs are welcome. Avoid indoor attractions where pets are prohibited.
       - For a custom theme, interpret the user's input ("${request.customThemeText || ''}") and tailor all suggestions accordingly. Be creative and ensure the plan reflects the custom theme's spirit.
    `;
  }

  const budgetSharingInstruction = `For accommodation and transportation costs, which are shareable (like accommodation, airport parking, car rental), calculate the total cost for the entire group first, and then divide that total cost by the actual number of travelers (${request.travelers}) to get the final per-person cost. For example, if 8 travelers are going, you must calculate the cost for two 4-person rooms or two cars, and then divide that total by 8. The 'details' field in the JSON should explain this calculation method.`;

  return `
    You are an expert travel planner for South Korea. Your name is "K-Trip Planner".
    A user wants to plan a trip with the following details:
    - Destinations: ${request.destination}
    - Travel Period: From ${request.startDate} to ${request.endDate}
    - Number of Travelers: ${request.travelers}
    - Departure Location: ${request.departure}
    - Main Transportation Mode: ${transportationModeDisplay}
    - Travel Theme: ${themeMap[request.travelTheme]} ${request.travelTheme === 'custom' ? `- ${request.customThemeText}`: ''}

    Your task is to create a detailed, day-by-day travel itinerary. Follow these instructions carefully:
    1.  **Route Planning:** If multiple destinations are provided (comma-separated), create a logical travel route and itinerary that covers them. Allocate appropriate time for travel between cities.
    2.  **Overall Plan:** Create a compelling title and a short summary for the entire trip.
    3.  **Daily Structure:** For each day, provide a theme (e.g., "Historic Seoul Exploration", "Busan Coastal Adventure").
    4.  **Activities & Meals:** You must create a detailed schedule with 8 distinct items for each day within the 'activities' array. The schedule must include meals and provide specific, flexible time estimates for each item.
        - The structure for each day must be: Breakfast, two Morning activities, Lunch, two Afternoon activities, Dinner, and a Night Activity.
        - For each item, provide a time slot in the 'time' field. For meals, use format like "아침 식사 (08:00~09:00)". For activities, use format like "오전 (09:30~12:00)", "오후 (14:30~16:30)", or "야간 (20:00~21:30)". Do not number the activities (e.g., use "오전" not "오전 활동 1").
    5.  **Transportation Advice:** For each activity and meal, provide practical transportation advice based on the selected mode:
${transportationAdviceDetail}
    6.  **Additional Restaurant Suggestions:** In addition to the meals planned in the daily schedule, recommend TWO EXTRA well-known or unique local restaurants or cafes for each day in the 'restaurantSuggestions' array. These are for the user to have as alternative options.
    7.  **Accommodation:** Suggest one specific, real accommodation (e.g., a hotel, guesthouse, or Hanok stay). Provide its actual name (e.g., "The Shilla Seoul", "Bukchon Hanok Village Guesthouse") and a reason why it fits the overall trip. Avoid generic types.
    8.  **Budget Estimation:** Calculate a rough estimated budget PER PERSON for the entire trip in Korean Won (KRW). Provide a total amount and a breakdown for accommodation, food, transportation, and activities. ${transportationInstruction} ${budgetSharingInstruction}
    9.  **Realism:** Consider realistic travel times between locations.
    10. **Tone:** Be enthusiastic, helpful, and creative. Offer a mix of famous spots and hidden gems.
    11. **Language:** The entire output must be in Korean.
    12. **Format:** Your response MUST be a single, valid JSON object that conforms to the provided schema. Do not add any text, markdown formatting like \`\`\`json, or comments before or after the JSON object. All keys and string values inside the JSON must be enclosed in double quotes. Do not use trailing commas.
    ${themeInstruction}
    `;
};


export const generateTravelPlan = async (request: TravelPlanRequest): Promise<TravelPlan> => {
    const prompt = buildPrompt(request);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: travelPlanSchema,
                temperature: 0.7, 
                topP: 0.95,
            },
        });
        
        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }

        const parsedData: TravelPlan = JSON.parse(jsonStr);
        return parsedData;

    } catch (error) {
        console.error("Error generating travel plan from Gemini:", error);
        if (error instanceof SyntaxError) {
             console.error("Failed to parse JSON response from AI.");
        }
        if (error instanceof Error && error.message.includes("429")) {
             throw new Error("The request was blocked due to safety settings. Please modify your inputs.");
        }
        throw new Error("Failed to generate the travel plan. The AI may have returned an error or an invalid format. Please try again.");
    }
};
