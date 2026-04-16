import axios, { AxiosInstance, AxiosResponse } from 'axios';

// ✅ Ensure this matches your Backend Port (8081)
const API_BASE_URL = 'https://mavisai-core.onrender.com';

export enum IntentType {
  GREETING = 'GREETING',
  ATTENDANCE_QUERY = 'ATTENDANCE_QUERY',
  EXAM_QUERY = 'EXAM_QUERY',
  STUDY_PLANNING = 'STUDY_PLANNING',
  CAREER_QUERY = 'CAREER_QUERY',
  WELLNESS_CHECKIN = 'WELLNESS_CHECKIN',
  CODING_ASSISTANCE = 'CODING_ASSISTANCE',
  GENERAL_CHAT = 'GENERAL_CHAT',
  UNKNOWN = 'UNKNOWN'
}

export enum Emotion {
  FRIENDLY = 'FRIENDLY',
  HAPPY = 'HAPPY',
  SAD = 'SAD',
  ANGRY = 'ANGRY',
  CONFUSED = 'CONFUSED',
  THINKING = 'THINKING',
  SURPRISED = 'SURPRISED',
  EXCITED = 'EXCITED',
  CALM = 'CALM',
  SERIOUS = 'SERIOUS',
  SUPPORTIVE = 'SUPPORTIVE',
  CELEBRATORY = 'CELEBRATORY',
  HELPFUL = 'HELPFUL'
}

export enum MascotAction {
  IDLE = 'IDLE',
  THINKING = 'THINKING',
  SPEAKING = 'SPEAKING',
  BREATHING = 'BREATHING',
  WAVE = 'WAVE',
  VICTORY = 'VICTORY',
  SAD = 'SAD',
  ANGRY = 'ANGRY',
  DEFEAT = 'DEFEAT',
  THANKFUL = 'THANKFUL',
  WALKING = 'WALKING',
  
  // Aliases
  WAVE_HELLO = 'WAVE',
  POINT_TO_BUTTON = 'WAVE',
  SERIOUS_WARNING = 'ANGRY',
  CELEBRATE = 'VICTORY',
  BREATHING_ANIMATION = 'BREATHING',
  ERROR_STATE = 'DEFEAT'
}

// Interfaces
export interface VoiceMeta {
  speakable: boolean;
  tone: string;
  speechRate: number;
  speed?: number; 
  interruptible: boolean;
}

export interface ApiResponse<T = any> {
  replyText: string;
  detectedIntent: IntentType;
  mascotAction: MascotAction;
  emotion: Emotion;
  uiHint: string;
  voiceMeta: VoiceMeta;
  data: T;
  audioBase64?: string;
}

export interface ChatRequest {
  userId: number;
  message: string;
  sessionId?: string;
}

export interface CodingAssistanceRequest {
  userId: string;
  deviceId: string;
  sessionId: string;
  codeContext: string;
  language: string;
  assistanceType: 'EXPLANATION' | 'DEBUG' | 'OPTIMIZATION';
}

export interface CodingAssistanceResponse {
  explanation: string;
  suggestions: string[];
  optimizedCode?: string;
  debugInfo?: any;
}

export interface AttendanceConfig {
  userId: number; // Added userId to config
  totalClasses: number;
  attendedClasses: number;
  requiredAttendance: number;
}

export interface StudyPlanRequest {
  userId: number;
  focusArea: string; // The backend needs this specific name
}

export interface ResumeAnalysisRequest {
  userId: number;
  resumeText: string;
}

export interface WellnessCheckinRequest {
  userId: number;
  moodNote: string;
  stressLevel?: number; // Added stressLevel
}

export interface DevicePairingRequest {
  userId: string;
  pairingCode: string;
  deviceName: string;
}

export interface DevicePairResponse {
  success: boolean;
  message: string;
  deviceId?: string;
  deviceName?: string;
}

export interface DevicePairSuccessResponse {
  success: boolean;
  message: string;
  deviceId: string;
  deviceName: string;
  pairedAt: string;
}

export class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Logging Interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} [${response.status}]`);
        return response;
      },
      (error) => {
        console.error(`❌ API Response Error [${error.response?.status}]: ${error.config?.url}`, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  // ==========================================
  // 🤖 AI Chat & Voice (Matched)
  // ==========================================
  
  public async chat(userId: number, message: string): Promise<ApiResponse> {
    // ✅ Matches POST /api/ai/chat
    const response = await this.axiosInstance.post<ApiResponse>('/api/ai/chat', { userId, message });
    return response.data;
  }

  // ==========================================
  // 📚 Academic & Study (Matched: /api/v1/academic/...)
  // ==========================================

  public async createStudyPlan(request: StudyPlanRequest): Promise<ApiResponse> {
    // ✅ Matches POST /api/v1/academic/study-plan
    const response = await this.axiosInstance.post<ApiResponse>('/api/v1/academic/study-plan', request);
    return response.data;
  }

  public async getTodayPlan(userId: number): Promise<ApiResponse> {
    // ✅ Matches GET /api/v1/academic/today-plan
    // Assuming backend takes userId as query param or path. 
    // If backend is strictly `GET /api/v1/academic/today-plan` (without ID in path), 
    // we usually pass it as query param `?userId=1`.
    // Adjust based on your Controller logic. 
    // I will assume Query Param for now based on typical REST design for this path structure.
    const response = await this.axiosInstance.get<ApiResponse>(`/api/v1/academic/today-plan?userId=${userId}`);
    return response.data;
  }

  public async getExams(userId: number): Promise<ApiResponse> {
    // No explicit endpoint in your list, assuming generic academic endpoint or handled via Chat
    // Fallback to chat if specific endpoint missing, or assume similar pattern
    console.warn("⚠️ getExams endpoint not explicitly listed in backend routes. Using chat fallback.");
    return this.chat(userId, "What are my upcoming exams?");
  }

  // ==========================================
  // 📝 Attendance (Matched: /api/v1/attendance/...)
  // ==========================================

  public async getAttendanceStatus(userId: number): Promise<ApiResponse> {
    // ✅ Matches GET /api/v1/attendance/status
    const response = await this.axiosInstance.get<ApiResponse>(`/api/v1/attendance/status?userId=${userId}`);
    return response.data;
  }

  public async saveAttendanceConfig(config: AttendanceConfig): Promise<ApiResponse> {
    // ✅ Matches POST /api/v1/attendance/config
    const response = await this.axiosInstance.post<ApiResponse>('/api/v1/attendance/config', config);
    return response.data;
  }

  // ==========================================
  // 💼 Career (Matched: /api/v1/career/...)
  // ==========================================

  public async analyzeResume(request: ResumeAnalysisRequest): Promise<ApiResponse> {
    // ✅ Matches POST /api/v1/career/resume/analyze
    const response = await this.axiosInstance.post<ApiResponse>('/api/v1/career/resume/analyze', request);
    return response.data;
  }

  public async getCareerAnalysis(userId: number): Promise<ApiResponse> {
    // ✅ Matches GET /api/v1/career/path/recommendations
    const response = await this.axiosInstance.get<ApiResponse>(`/api/v1/career/path/recommendations?userId=${userId}`);
    return response.data;
  }

  // ==========================================
  // 🏥 Wellness (Matched: /api/v1/wellness/...)
  // ==========================================

  public async wellnessCheckin(request: WellnessCheckinRequest): Promise<ApiResponse> {
    // ✅ Matches POST /api/v1/wellness/checkin
    const response = await this.axiosInstance.post<ApiResponse>('/api/v1/wellness/checkin', request);
    return response.data;
  }

  public async getWellnessData(userId: number): Promise<ApiResponse> {
    // ✅ Matches GET /api/v1/wellness/health (Assuming this returns history/stats)
    const response = await this.axiosInstance.get<ApiResponse>(`/api/v1/wellness/health?userId=${userId}`);
    return response.data;
  }

  // ==========================================
  // 💻 Coding (Matched: /api/v1/coding/...)
  // ==========================================

  public async getCodingAssistance(request: CodingAssistanceRequest): Promise<ApiResponse<CodingAssistanceResponse>> {
    // ✅ Matches POST /api/v1/coding/assist
    const response = await this.axiosInstance.post<ApiResponse<CodingAssistanceResponse>>('/api/v1/coding/assist', request);
    return response.data;
  }

  public async generatePairingCode(userId: string): Promise<ApiResponse> {
    // ✅ Matches GET /api/v1/coding/pairing-code
    const response = await this.axiosInstance.get<ApiResponse>(`/api/v1/coding/pairing-code?userId=${userId}`);
    return response.data;
  }

  public async pairDevice(request: DevicePairingRequest): Promise<ApiResponse> {
    // ✅ Matches POST /api/v1/coding/pair
    const response = await this.axiosInstance.post<ApiResponse>('/api/v1/coding/pair', request);
    return response.data;
  }

  public async unpairDevice(deviceId: string, userId: string): Promise<AxiosResponse<void>> {
    // ✅ Matches DELETE /api/v1/coding/unpair/{deviceId}
    return await this.axiosInstance.delete(`/api/v1/coding/unpair/${deviceId}?userId=${userId}`);
  }

  // ==========================================
  // 📚 Subjects Integration (Neon PostgreSQL)
  // ==========================================

  public async getSubjects(userId: number): Promise<any[]> {
    const res = await this.axiosInstance.get(`/api/v1/academic/subjects?userId=${userId}`);
    return res.data;
  }

  public async saveSubject(subject: any): Promise<any> {
    const res = await this.axiosInstance.post('/api/v1/academic/subjects/save', subject);
    return res.data;
  }

  public async deleteSubject(id: number): Promise<void> {
    await this.axiosInstance.delete(`/api/v1/academic/subjects/${id}`);
  }
}

export const apiClient = new ApiClient();
