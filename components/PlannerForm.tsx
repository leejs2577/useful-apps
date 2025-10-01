
import React, { useState } from 'react';
import type { TravelPlanRequest, TravelTheme } from '../types';
import { UsersIcon } from './icons/UsersIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { PlaneIcon } from './icons/PlaneIcon';
import { TransportIcon } from './icons/TransportIcon';
import { TagIcon } from './icons/TagIcon';

interface PlannerFormProps {
  onSubmit: (request: TravelPlanRequest) => void;
  isLoading: boolean;
}

export function PlannerForm({ onSubmit, isLoading }: PlannerFormProps): React.ReactNode {
  const [destination, setDestination] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 3);
    return tomorrow.toISOString().split('T')[0];
  });
  const [travelers, setTravelers] = useState<number>(2);
  const [departure, setDeparture] = useState<string>('');
  const [transportationMode, setTransportationMode] = useState<'public' | 'car' | 'airplane'>('public');
  const [travelTheme, setTravelTheme] = useState<TravelTheme>('default');
  const [customTheme, setCustomTheme] = useState<string>('');


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (new Date(startDate) > new Date(endDate)) {
        alert("도착일은 출발일보다 빠를 수 없습니다.");
        return;
    }
    
    // Normalize destinations: split by comma or space, filter empty, join with comma.
    const normalizedDestination = destination
      .split(/[\s,]+/)
      .filter(Boolean)
      .join(', ');

    onSubmit({ 
        destination: normalizedDestination, 
        startDate, 
        endDate, 
        travelers, 
        departure, 
        transportationMode, 
        travelTheme,
        customThemeText: travelTheme === 'custom' ? customTheme : undefined
    });
  };
  
  const themeOptions: { value: TravelTheme; label: string }[] = [
    { value: 'default', label: '기본' },
    { value: 'kids', label: '아이동반' },
    { value: 'parents', label: '효도관광' },
    { value: 'healing', label: '힐링' },
    { value: 'activity', label: '액티비티' },
    { value: 'gourmet', label: '미식여행' },
    { value: 'art', label: '예술/공연' },
    { value: 'dog', label: '반려견과 함께'},
    { value: 'custom', label: '(직접입력)'}
  ];

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-6 gap-4">
      
      <div className="lg:col-span-3">
        <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">여행지 (복수 선택 가능)</label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MapPinIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
            placeholder="예: 서울 부산 제주도"
            required
          />
        </div>
      </div>

       <div className="lg:col-span-3">
        <label htmlFor="departure" className="block text-sm font-medium text-gray-700 mb-1">출발 장소</label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <PlaneIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="departure"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
            placeholder="예: 김포공항"
            required
          />
        </div>
      </div>

      <div className="lg:col-span-3">
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">출발일</label>
         <div className="relative">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
                style={{ colorScheme: 'light' }}
                required
            />
        </div>
      </div>
      
      <div className="lg:col-span-3">
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">도착일</label>
        <div className="relative">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
                style={{ colorScheme: 'light' }}
                required
            />
        </div>
      </div>

      <div className="lg:col-span-2">
        <label htmlFor="travelers" className="block text-sm font-medium text-gray-700 mb-1">여행 인원</label>
        <div className="relative">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <UsersIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
                id="travelers"
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition appearance-none bg-white text-gray-900"
                required
            >
                {Array.from({ length: 8 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>{num}명</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
      </div>
      
      <div className="lg:col-span-2">
        <label htmlFor="transportationMode" className="block text-sm font-medium text-gray-700 mb-1">주요 이동 수단</label>
        <div className="relative">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <TransportIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
                id="transportationMode"
                value={transportationMode}
                onChange={(e) => setTransportationMode(e.target.value as 'public' | 'car' | 'airplane')}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition appearance-none bg-white text-gray-900"
                required
            >
                <option value="public">대중교통</option>
                <option value="car">자동차</option>
                <option value="airplane">비행기</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
      </div>
      
      <div className="lg:col-span-2">
        <label htmlFor="travelTheme" className="block text-sm font-medium text-gray-700 mb-1">여행 테마 (필요시 선택)</label>
        <div className="relative">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <TagIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
                id="travelTheme"
                value={travelTheme}
                onChange={(e) => setTravelTheme(e.target.value as TravelTheme)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition appearance-none bg-white text-gray-900"
            >
                {themeOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
      </div>
      
      {travelTheme === 'custom' && (
        <div className="lg:col-span-6">
          <label htmlFor="customTheme" className="block text-sm font-medium text-gray-700 mb-1">
            원하는 테마를 입력하세요
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <TagIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="customTheme"
              value={customTheme}
              onChange={(e) => setCustomTheme(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
              placeholder="예: K-POP 성지순례, 역사 탐방"
              required
            />
          </div>
        </div>
      )}

      <div className="lg:col-span-6 flex items-end mt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isLoading ? '생성 중...' : '여행 계획 Start'}
        </button>
      </div>
    </form>
  );
}