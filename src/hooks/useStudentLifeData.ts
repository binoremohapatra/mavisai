import { useState, useCallback } from 'react';
import { backendService } from '../services/backend-service';
import { screenService } from '../services/screen-service';
import { useAppStore } from '../store';
import { 
  StudyPlanRequest, 
  CodingAssistanceResponse 
} from '../services/api-client';

export const useStudentLifeData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Connect to global store
  const { 
    updateCache, 
    cache,
    lockAnimation,
    unlockAnimation 
  } = useAppStore();

  // Helper to handle async actions with UI feedback
  const executeAction = useCallback(async <T>(
    actionName: string,
    actionFn: () => Promise<T>,
    onSuccess?: (data: T) => void
  ) => {
    setLoading(true);
    setError(null);
    try {
      // Lock animation during heavy data fetches to prevent idle overrides
      lockAnimation(); 
      
      console.log(`🚀 Executing Action: ${actionName}`);
      const result = await actionFn();
      
      console.log(`✅ Action Success: ${actionName}`, result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      return result;
    } catch (err: any) {
      console.error(`❌ Action Failed: ${actionName}`, err);
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      screenService.showError(errorMessage);
      return null;
    } finally {
      setLoading(false);
      unlockAnimation();
    }
  }, [lockAnimation, unlockAnimation]);

  // ==========================================
  // � ACADEMIC ACTIONS
  // ==========================================

  const fetchTodayPlan = useCallback(async () => {
    // Return cached data if available for instant UI
    if (cache.studyPlan) return cache.studyPlan;

    return executeAction(
      'fetchTodayPlan',
      () => backendService.getTodayPlan(),
      (data) => updateCache('studyPlan', data)
    );
  }, [executeAction, cache.studyPlan, updateCache]);

  const createStudyPlan = useCallback(async (focusArea: string) => {
    return executeAction(
      'createStudyPlan',
      () => backendService.createStudyPlan(focusArea),
      (data) => updateCache('studyPlan', data)
    );
  }, [executeAction, updateCache]);

  // ==========================================
  // � ATTENDANCE ACTIONS
  // ==========================================

  const fetchAttendanceStatus = useCallback(async () => {
    return executeAction(
      'fetchAttendance',
      () => backendService.getAttendanceStatus(),
      (data) => updateCache('attendanceStatus', data)
    );
  }, [executeAction, updateCache]);

  const updateAttendance = useCallback(async (total: number, attended: number) => {
    return executeAction(
      'updateAttendance',
      () => backendService.saveAttendanceConfig(total, attended),
      (data) => updateCache('attendanceStatus', data)
    );
  }, [executeAction, updateCache]);

  // ==========================================
  // 🏥 WELLNESS ACTIONS
  // ==========================================

  const checkInWellness = useCallback(async (moodNote: string) => {
    return executeAction(
      'wellnessCheckin',
      () => backendService.wellnessCheckin(moodNote),
      (data) => updateCache('wellnessData', data)
    );
  }, [executeAction, updateCache]);

  // ==========================================
  // 💻 CODING ACTIONS
  // ==========================================

  const getCodingAssistance = useCallback(async (context: string) => {
    return executeAction(
      'codingAssist',
      () => backendService.getCodingAssistance(context),
      (data: CodingAssistanceResponse) => updateCache('codingStatus', data)
    );
  }, [executeAction, updateCache]);

  // ==========================================
  // � CAREER ACTIONS
  // ==========================================

  const analyzeResume = useCallback(async (resumeText: string) => {
    return executeAction(
      'analyzeResume',
      () => backendService.analyzeResume(resumeText),
      (data) => updateCache('careerAnalysis', data)
    );
  }, [executeAction, updateCache]);

  return {
    loading,
    error,
    // Data (from Cache for instant access)
    studyPlan: cache.studyPlan,
    attendance: cache.attendanceStatus,
    wellness: cache.wellnessData,
    codingData: cache.codingStatus,
    careerData: cache.careerAnalysis,
    // Actions
    fetchTodayPlan,
    createStudyPlan,
    fetchAttendanceStatus,
    updateAttendance,
    checkInWellness,
    getCodingAssistance,
    analyzeResume
  };
};
