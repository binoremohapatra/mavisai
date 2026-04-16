import { apiClient } from './api-client';
import { MascotAction, Emotion } from '../types/animations';
import { VoiceService } from './VoiceService'; 
import { screenService } from './screen-service';
import { useAppStore } from '../store';

export class BackendService {
  private userId: number = 1;
  private setMascotAction: ((action: MascotAction) => void) | null = null;
  private setMascotEmotion: ((emotion: Emotion) => void) | null = null;
  private setMascotResponse: ((response: any) => void) | null = null;

  private async trackIntent<T>(intentName: string, action: () => Promise<T>): Promise<T> {
    console.log(`🚀 Intent: ${intentName}`);
    try { return await action(); } 
    catch (e) { console.error(`❌ Failed: ${intentName}`, e); throw e; }
  }

  public setStoreFunctions(setAction: any, setEmotion: any, setResponse: any) {
    this.setMascotAction = setAction;
    this.setMascotEmotion = setEmotion;
    this.setMascotResponse = setResponse;
  }

  public async sendMessage(message: string) {
      return this.trackIntent('SEND_MESSAGE', async () => {
        if (this.setMascotAction) this.setMascotAction(MascotAction.THINKING);
        
        try {
          const response = await apiClient.chat(this.userId, message);
          
          if (!response) throw new Error("Empty response from backend");

          if (this.setMascotResponse) {
            this.setMascotResponse({ 
              replyText: response.replyText || "I am listening.", 
              voiceMeta: response.voiceMeta 
            });
          }

          let actionToPlay = response.mascotAction || MascotAction.IDLE;
          const textLength = response.replyText ? response.replyText.length : 0;

          if (actionToPlay === MascotAction.IDLE && textLength > 100) {
             actionToPlay = MascotAction.SPEAKING; 
          }

          if (this.setMascotAction) this.setMascotAction(actionToPlay);
          if (this.setMascotEmotion) this.setMascotEmotion(response.emotion || Emotion.HAPPY);

          if (response.audioBase64) {
            VoiceService.getInstance().playBase64(response.audioBase64);
          } else if (response.replyText) {
            VoiceService.getInstance().speak(response.replyText);
          }

          return response;
        } catch (e) {
          console.error("❌ API Error:", e);
          if (this.setMascotAction) this.setMascotAction(MascotAction.ERROR_STATE);
          return null;
        }
      });
  }

  // ✅ REFINED VERSION: Sends the exact payload the backend expects
  public async createStudyPlan(focusArea: string) {
    return this.trackIntent('CREATE_STUDY_PLAN', async () => {
      screenService.showLoading("Transmitting to AI Brain...");
      const { setMascotAction, setMascotResponse } = useAppStore.getState();
      
      if (setMascotAction) setMascotAction(MascotAction.THINKING);

      try {
        // 1. Call API with correct field names
        const res = await apiClient.createStudyPlan({
          userId: this.userId,
          focusArea: focusArea // Backend uses focusArea, not goal/subjects
        });

        screenService.hideLoading();
        
        // 2. Unpack the standard ApiResponse<T> envelope
        const aiPlan = res.data; 

        // 3. Handle Voice and Mascot
        if (setMascotResponse) {
          setMascotResponse({ 
            replyText: aiPlan.todayPlan, 
            voiceMeta: res.voiceMeta 
          });
        }
        
        VoiceService.getInstance().speak(aiPlan.todayPlan);
        
        if (setMascotAction) {
            setMascotAction(MascotAction.SPEAKING);
            setTimeout(() => { if (this.setMascotAction) this.setMascotAction(MascotAction.IDLE); }, 5000);
        }

        return aiPlan; 

      } catch(e: any) { 
        screenService.hideLoading(); 
        console.error("❌ Study Plan Failed:", e);
        if (setMascotAction) setMascotAction(MascotAction.ERROR_STATE);
        throw e; 
      }
    });
  }

  // ✅ CODING: Automated Editor Integration
  public async getCodingAssistance(codeContext: string, voiceCommand: string = "Review this code") {
    screenService.showLoading("AI Logical Analysis...");
    try {
      const res = await apiClient.getCodingAssistance({
        userId: this.userId.toString(),
        deviceId: 'web-client',
        sessionId: `session-${Date.now()}`,
        codeContext,
        language: 'javascript',
        assistanceType: 'EXPLANATION' // Adjusted to match your Enum
      });

      const data = res.data; // This is CodingAssistanceResponse
      
      // Auto-speak the AI explanation
      VoiceService.getInstance().speak(data.explanation || "Code analysis complete.");
      
      return data; 
    } catch(e) { 
      screenService.hideLoading(); 
      throw e; 
    }
  }

  public async analyzeResume(resumeText: string) {
    screenService.showLoading("Analyzing Resume...");
    try {
      const res = await apiClient.analyzeResume({
        userId: this.userId,
        resumeText
      });
      screenService.hideLoading();
      return res.data; // ✅ FIX: No double unwrap
    } catch(e) { screenService.hideLoading(); throw e; }
  }

  public async wellnessCheckin(moodNote: string) {
    screenService.showLoading("Processing Wellness...");
    try {
      const res = await apiClient.wellnessCheckin({
        userId: this.userId,
        moodNote
      });
      screenService.hideLoading();
      return res.data; // ✅ FIX: No double unwrap
    } catch(e) { screenService.hideLoading(); throw e; }
  }

  public async saveAttendanceConfig(totalClasses: number, attendedClasses: number) {
    screenService.showLoading("Updating Attendance...");
    try {
      const res = await apiClient.saveAttendanceConfig({
        userId: this.userId, // Ensure userId is passed
        totalClasses,
        attendedClasses,
        requiredAttendance: 75
      });
      screenService.hideLoading();
      return res.data; // ✅ FIX: No double unwrap
    } catch(e) { 
      screenService.hideLoading(); 
      throw e; 
    }
  }

  public async getTodayPlan() {
    try {
      const res = await apiClient.getTodayPlan(this.userId);
      return res.data; // ✅ FIX: No double unwrap
    } catch(e) { throw e; }
  }

  public async getAttendanceStatus() {
    try {
      const res = await apiClient.getAttendanceStatus(this.userId);
      return res.data; // ✅ FIX: No double unwrap
    } catch(e) { throw e; }
  }

  // Device Pairing Methods
  public async generatePairingCode(userId: string) {
    screenService.showLoading("Generating pairing code...");
    try {
      const res = await apiClient.generatePairingCode(userId);
      screenService.hideLoading();
      return res.data; // ✅ FIX: No double unwrap
    } catch(e) { screenService.hideLoading(); throw e; }
  }

  public async pairDevice(request: { userId: string; pairingCode: string; deviceName: string }) {
    screenService.showLoading("Pairing device...");
    try {
      const res = await apiClient.pairDevice(request);
      screenService.hideLoading();
      return res.data; // ✅ FIX: No double unwrap
    } catch(e) { screenService.hideLoading(); throw e; }
  }

  public async unpairDevice(deviceId: string, userId: string) {
    try {
      await apiClient.unpairDevice(deviceId, userId);
    } catch(e) { throw e; }
  }
}

export const backendService = new BackendService();
export default backendService;
