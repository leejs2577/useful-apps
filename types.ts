
export type TravelTheme = 'default' | 'kids' | 'parents' | 'healing' | 'activity' | 'gourmet' | 'art' | 'dog' | 'custom';

export interface TravelPlanRequest {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  departure: string;
  transportationMode: 'public' | 'car' | 'airplane';
  travelTheme: TravelTheme;
  customThemeText?: string;
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  transportation?: string;
}

export interface RestaurantSuggestion {
    name: string;
    cuisine: string;
    reason: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  theme: string;
  activities: Activity[];
  restaurantSuggestions: RestaurantSuggestion[];
}

export interface AccommodationSuggestion {
    type: string;
    name: string;
    reason: string;
}

export interface EstimatedBudget {
  totalPerPerson: number;
  currency: string;
  breakdown: {
    accommodation: number;
    food: number;
    transportation: number;
    activities: number;
  };
  details: string;
}

export interface TravelPlan {
  title: string;
  summary: string;
  accommodation: AccommodationSuggestion;
  estimatedBudget: EstimatedBudget;
  days: ItineraryDay[];
}

export interface PlanError {
    title: string;
    message: string;
}