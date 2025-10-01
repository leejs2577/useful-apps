
import React from 'react';
import type { TravelPlan, ItineraryDay, Activity, RestaurantSuggestion } from '../types';
import { PlaneIcon } from './icons/PlaneIcon';
import { WalletIcon } from './icons/WalletIcon';
import { UtensilsIcon } from './icons/UtensilsIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface ItineraryDisplayProps {
  plan: TravelPlan;
}

const ActivityCard = ({ activity }: { activity: Activity }): React.ReactNode => {
    const isMeal = activity.time.includes('식사');

    const getTimeDisplayClass = (time: string): string => {
      if (isMeal) return 'text-green-600';
      if (time.startsWith('오전')) return 'text-sky-600';
      if (time.startsWith('오후')) return 'text-amber-600';
      if (time.startsWith('야간')) return 'text-indigo-600';
      return 'text-gray-700';
    };

    return (
        <div className="relative pl-8 mb-6 last:mb-0 border-l-2 border-blue-100">
            <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center">
                {isMeal ? (
                    <UtensilsIcon className="w-5 h-5 text-blue-600" />
                ) : (
                    <SparklesIcon className="w-5 h-5 text-yellow-500" />
                )}
            </div>
            <div className="ml-4">
                 <p className={`font-semibold ${getTimeDisplayClass(activity.time)}`}>{activity.time}</p>
                 <h4 className="text-lg font-bold text-gray-800 mt-1">{activity.title}</h4>
                 <p className="text-gray-600 mt-1">{activity.description}</p>
                 {activity.transportation && <p className="text-sm text-gray-500 mt-2">🚗 <span className="font-medium">교통:</span> {activity.transportation}</p>}
            </div>
        </div>
    );
};

const RestaurantCard = ({ restaurant }: { restaurant: RestaurantSuggestion }): React.ReactNode => (
    <div className="bg-white p-4 rounded-lg border">
        <h5 className="font-bold text-gray-800">{restaurant.name}</h5>
        <p className="text-sm font-semibold text-blue-600 my-1">{restaurant.cuisine}</p>
        <p className="text-sm text-gray-600">{restaurant.reason}</p>
    </div>
);

const DayCard = ({ dayData }: { dayData: ItineraryDay }): React.ReactNode => (
  <div className="mb-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b">
        <div className="mb-2 sm:mb-0">
            <p className="text-sm font-semibold text-blue-600">DAY {dayData.day}</p>
            <h3 className="text-2xl font-bold text-gray-900">{dayData.theme}</h3>
        </div>
        <span className="text-gray-500 font-medium text-sm sm:text-base">{dayData.date}</span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <h4 className="text-xl font-semibold mb-6 text-gray-700">하루 일정</h4>
            {dayData.activities.map((activity, index) => (
                <ActivityCard key={index} activity={activity} />
            ))}
        </div>
        <div>
            <h4 className="text-xl font-semibold mb-6 text-gray-700">⭐ 추가 추천 맛집</h4>
            <div className="space-y-4">
                {dayData.restaurantSuggestions.map((resto, index) => (
                    <RestaurantCard key={index} restaurant={resto} />
                ))}
            </div>
        </div>
    </div>
  </div>
);

export function ItineraryDisplay({ plan }: ItineraryDisplayProps): React.ReactNode {
  return (
    <div className="animate-fade-in">
      <header className="mb-10 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">{plan.title}</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">{plan.summary}</p>
      </header>
      
      <div className="mb-10 p-6 bg-blue-600 text-white rounded-xl shadow-2xl">
        <div className="flex items-center gap-3">
            <div className="flex-shrink-0 bg-blue-500 text-white p-3 rounded-full">
                <PlaneIcon className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold">추천 숙소</h3>
        </div>
        <p className="text-lg font-semibold mt-4">{plan.accommodation.name} ({plan.accommodation.type})</p>
        <p className="mt-2 text-blue-100">{plan.accommodation.reason}</p>
      </div>
      
      <div>
        {plan.days.map((dayData) => (
          <DayCard key={dayData.day} dayData={dayData} />
        ))}
      </div>

      {plan.estimatedBudget && (
        <div className="mt-10 p-6 bg-gray-800 text-white rounded-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 bg-gray-700 text-white p-3 rounded-full">
              <WalletIcon className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold">예상 경비 (1인 기준)</h3>
          </div>
          <div className="mt-4 flex items-baseline gap-x-2">
            <p className="text-4xl font-extrabold">
              {plan.estimatedBudget.totalPerPerson.toLocaleString()}
            </p>
            <span className="text-lg font-medium text-gray-300">{plan.estimatedBudget.currency}</span>
          </div>
          <p className="mt-2 text-sm text-gray-400">{plan.estimatedBudget.details}</p>
          <div className="mt-4 pt-4 border-t border-gray-600 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-300">숙소</p>
              <p className="font-semibold">{plan.estimatedBudget.breakdown.accommodation.toLocaleString()}원</p>
            </div>
            <div>
              <p className="text-gray-300">식비</p>
              <p className="font-semibold">{plan.estimatedBudget.breakdown.food.toLocaleString()}원</p>
            </div>
            <div>
              <p className="text-gray-300">교통</p>
              <p className="font-semibold">{plan.estimatedBudget.breakdown.transportation.toLocaleString()}원</p>
            </div>
            <div>
              <p className="text-gray-300">액티비티</p>
              <p className="font-semibold">{plan.estimatedBudget.breakdown.activities.toLocaleString()}원</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Add keyframes for animation in a style tag or via JS if needed, for simplicity here we rely on a utility class.
// In a real project, this would be in tailwind.config.js
const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
}
`;
document.head.appendChild(style);
