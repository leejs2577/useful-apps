
import React, { useState, useCallback } from 'react';
import { PlannerForm } from './components/PlannerForm';
import { ItineraryDisplay } from './components/ItineraryDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { generateTravelPlan } from './services/geminiService';
import type { TravelPlan, TravelPlanRequest, PlanError } from './types';
import { PlaneIcon } from './components/icons/PlaneIcon';

function App(): React.ReactNode {
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<PlanError | null>(null);

  const handlePlanRequest = useCallback(async (request: TravelPlanRequest) => {
    setIsLoading(true);
    setTravelPlan(null);
    setError(null);
    try {
      const plan = await generateTravelPlan(request);
      setTravelPlan(plan);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        setError({
          title: "Failed to Generate Plan",
          message: e.message || "An unexpected error occurred. Please check your inputs or try again later.",
        });
      } else {
         setError({
          title: "Unexpected Error",
          message: "An unknown error occurred.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-800">
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <PlaneIcon className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                K-Trip Planner
              </h1>
            </div>
            <p className="hidden md:block text-sm text-gray-600">당신의 완벽한 한국 여행을 계획하세요</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <section id="planner-form" className="mb-12">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">여행 정보 입력</h2>
              <p className="text-gray-500 mb-6">당신을 위한 최고의 여행을 준비하겠습니다.</p>
              <PlannerForm onSubmit={handlePlanRequest} isLoading={isLoading} />
            </div>
          </section>

          <section id="itinerary">
            {isLoading && <LoadingSpinner />}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-red-800">{error.title}</h3>
                <p className="mt-2 text-red-700">{error.message}</p>
              </div>
            )}
            {travelPlan && !isLoading && <ItineraryDisplay plan={travelPlan} />}
            {!travelPlan && !isLoading && !error && (
               <div className="text-center py-16 px-6 bg-white rounded-2xl shadow-md border border-gray-200">
                    <div className="mx-auto w-20 h-20 flex items-center justify-center bg-blue-100 rounded-full text-blue-600">
                        <PlaneIcon className="w-10 h-10" />
                    </div>
                    <h2 className="mt-6 text-2xl font-semibold text-gray-700">지금 여행계획을 시작하세요!</h2>
                    <p className="mt-2 text-gray-500">'여행 계획 Start' 버튼을 누르면 멋진 여행을 설계해 드립니다.</p>
                </div>
            )}
          </section>
        </div>
      </main>
      
      <footer className="text-center py-6 mt-12 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          K-Trip Planner &copy; 2025 LeeJS
        </p>
      </footer>
    </div>
  );
}

export default App;
