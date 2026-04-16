import { IntentType, Emotion, MascotAction } from '../services/api-client';

// Intent event interface
export interface IntentEvent {
  type: 'intent_detected';
  intent: IntentType;
  emotion?: Emotion;
  mascotAction?: MascotAction;
  timestamp: number;
}

// Action event interface
export interface ActionEvent {
  type: 'action_trigger';
  action: MascotAction;
  timestamp: number;
}

// Emotion event interface (legacy support)
export interface EmotionEvent {
  type: 'emotion_detected';
  emotion: Emotion;
  mascotAction?: MascotAction;
  intent?: IntentType;
  timestamp: number;
}

// Event dispatcher for intent-based animations
export class IntentEventDispatcher {
  private static instance: IntentEventDispatcher;
  private listeners: Array<(event: IntentEvent | ActionEvent | EmotionEvent) => void> = [];

  static getInstance(): IntentEventDispatcher {
    if (!IntentEventDispatcher.instance) {
      IntentEventDispatcher.instance = new IntentEventDispatcher();
    }
    return IntentEventDispatcher.instance;
  }

  addEventListener(listener: (event: IntentEvent | ActionEvent | EmotionEvent) => void) {
    this.listeners.push(listener);
  }

  removeEventListener(listener: (event: IntentEvent | ActionEvent | EmotionEvent) => void) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  private dispatch(event: IntentEvent | ActionEvent | EmotionEvent) {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });
  }

  // Dispatch intent-based event
  dispatchIntent(intent: IntentType, emotion?: Emotion, mascotAction?: MascotAction) {
    const event: IntentEvent = {
      type: 'intent_detected',
      intent,
      emotion,
      mascotAction,
      timestamp: Date.now()
    };
    this.dispatch(event);
  }

  // Dispatch direct action event
  dispatchAction(action: MascotAction) {
    const event: ActionEvent = {
      type: 'action_trigger',
      action,
      timestamp: Date.now()
    };
    this.dispatch(event);
  }

  // Dispatch emotion event (legacy support)
  dispatchEmotion(emotion: Emotion, mascotAction?: MascotAction, intent?: IntentType) {
    const event: EmotionEvent = {
      type: 'emotion_detected',
      emotion,
      mascotAction,
      intent,
      timestamp: Date.now()
    };
    this.dispatch(event);
  }
}

// Convenience functions for common intent scenarios
export const triggerGreeting = () => {
  IntentEventDispatcher.getInstance().dispatchIntent(
    IntentType.GREETING,
    Emotion.FRIENDLY,
    MascotAction.WAVE_HELLO
  );
};

export const triggerAttendanceQuery = () => {
  IntentEventDispatcher.getInstance().dispatchIntent(
    IntentType.ATTENDANCE_QUERY,
    Emotion.CALM,
    MascotAction.THINKING
  );
};

export const triggerExamQuery = () => {
  IntentEventDispatcher.getInstance().dispatchIntent(
    IntentType.EXAM_QUERY,
    Emotion.SERIOUS,
    MascotAction.THINKING
  );
};

export const triggerStudyPlanning = () => {
  IntentEventDispatcher.getInstance().dispatchIntent(
    IntentType.STUDY_PLANNING,
    Emotion.HELPFUL,
    MascotAction.POINT_TO_BUTTON
  );
};

export const triggerCareerQuery = () => {
  IntentEventDispatcher.getInstance().dispatchIntent(
    IntentType.CAREER_QUERY,
    Emotion.SUPPORTIVE,
    MascotAction.SPEAKING
  );
};

export const triggerWellnessCheckin = () => {
  IntentEventDispatcher.getInstance().dispatchIntent(
    IntentType.WELLNESS_CHECKIN,
    Emotion.CALM,
    MascotAction.BREATHING_ANIMATION
  );
};

export const triggerCodingAssistance = () => {
  IntentEventDispatcher.getInstance().dispatchIntent(
    IntentType.CODING_ASSISTANCE,
    Emotion.HELPFUL,
    MascotAction.SPEAKING
  );
};

export const triggerGeneralChat = () => {
  IntentEventDispatcher.getInstance().dispatchIntent(
    IntentType.GENERAL_CHAT,
    Emotion.FRIENDLY,
    MascotAction.SPEAKING
  );
};

export const triggerUnknownIntent = () => {
  IntentEventDispatcher.getInstance().dispatchIntent(
    IntentType.UNKNOWN,
    Emotion.CONFUSED,
    MascotAction.IDLE
  );
};

// Global instance for easy access
export const intentDispatcher = IntentEventDispatcher.getInstance();
