export interface AirQualityData {
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
  aqi: number;
}

export interface MonitoringStation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: "industrial" | "urban" | "suburban" | "rural" | "traffic";
  address: string;
  active: boolean;
}

export interface Measurement {
  id: string;
  stationId: string;
  date: string;
  time: string;
  airQuality: AirQualityData;
}

export interface StationsRequest {
  type?: MonitoringStation["type"];
  active?: boolean;
}

export interface MeasurementsRequest {
  stationId: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof AirQualityData;
  sortOrder?: "asc" | "desc";
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
  timestamp: string;
}
