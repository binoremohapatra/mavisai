import { MascotAction, Emotion } from './api-client';

// Screen Service for managing UI states and transitions
export class ScreenService {
  private currentScreen: string = 'dashboard';
  private screenHistory: string[] = [];
  private screenStates: Record<string, any> = {};

  constructor() {
    this.initializeEventListeners();
  }

  /**
   * Initialize event listeners for UI hints and navigation
   */
  private initializeEventListeners(): void {
    // Listen for UI hints from emotion chat service
    window.addEventListener('uiHint', this.handleUIHint as EventListener);
    
    // Listen for navigation events
    window.addEventListener('navigateToSection', this.handleNavigation as EventListener);
    
    // Listen for screen transitions
    window.addEventListener('screenTransition', this.handleScreenTransition as EventListener);
  }

  /**
   * Handle UI hints and trigger appropriate screen actions
   */
  private handleUIHint = (event: Event): void => {
    const customEvent = event as CustomEvent;
    const { hint } = customEvent.detail;
    console.log('🎯 ScreenService handling UI hint:', hint);

    // Parse UI hint and take action
    this.processUIHint(hint);
  };

  /**
   * Process UI hint and execute corresponding action
   */
  private processUIHint(hint: string): void {
    const hintLower = hint.toLowerCase();

    // Study-related hints
    if (hintLower.includes('study') || hintLower.includes('academic')) {
      this.navigateToScreen('academic');
      if (hintLower.includes('planner')) {
        this.highlightSection('study-planner');
      } else if (hintLower.includes('schedule')) {
        this.highlightSection('study-schedule');
      }
    }

    // Wellness-related hints
    else if (hintLower.includes('wellness') || hintLower.includes('mood')) {
      this.navigateToScreen('wellness');
      if (hintLower.includes('tracker')) {
        this.highlightSection('mood-tracker');
      } else if (hintLower.includes('tips')) {
        this.highlightSection('wellness-tips');
      }
    }

    // Career-related hints
    else if (hintLower.includes('career') || hintLower.includes('resume')) {
      this.navigateToScreen('career');
      if (hintLower.includes('resume')) {
        this.highlightSection('resume-builder');
      } else if (hintLower.includes('recommendations')) {
        this.highlightSection('career-recommendations');
      }
    }

    // Attendance-related hints
    else if (hintLower.includes('attendance')) {
      this.navigateToScreen('attendance');
      if (hintLower.includes('tracker')) {
        this.highlightSection('attendance-tracker');
      } else if (hintLower.includes('statistics')) {
        this.highlightSection('attendance-stats');
      }
    }

    // Coding-related hints
    else if (hintLower.includes('coding') || hintLower.includes('code')) {
      this.navigateToScreen('coding');
      if (hintLower.includes('assistant')) {
        this.highlightSection('coding-assistant');
      } else if (hintLower.includes('editor')) {
        this.highlightSection('code-editor');
      }
    }

    // Chat-related hints
    else if (hintLower.includes('chat') || hintLower.includes('message')) {
      this.highlightSection('chat-interface');
    }

    // Generic highlighting
    else if (hintLower.includes('highlight')) {
      const match = hint.match(/highlight\s+(.+)/i);
      if (match) {
        this.highlightElement(match[1]);
      }
    }

    // Generic showing
    else if (hintLower.includes('show')) {
      const match = hint.match(/show\s+(.+)/i);
      if (match) {
        this.showElement(match[1]);
      }
    }
  }

  /**
   * Navigate to specific screen with animation
   */
  public navigateToScreen(screenName: string, animation?: string): void {
    if (this.currentScreen === screenName) {
      console.log('📍 Already on screen:', screenName);
      return;
    }

    console.log('🔄 Navigating to screen:', screenName, 'from:', this.currentScreen);

    // Add to history
    this.screenHistory.push(this.currentScreen);

    // Trigger screen transition animation
    this.triggerScreenTransition(this.currentScreen, screenName, animation);

    // Update current screen
    this.currentScreen = screenName;

    // Emit navigation event
    window.dispatchEvent(new CustomEvent('screenChanged', {
      detail: { 
        from: this.screenHistory[this.screenHistory.length - 2],
        to: screenName,
        animation: animation || 'slide-left'
      }
    }));
  }

  /**
   * Trigger screen transition with mascot animation
   */
  private triggerScreenTransition(fromScreen: string, toScreen: string, animation?: string): void {
    console.log('🎬 Screen transition:', { fromScreen, toScreen, animation });

    // Add transition classes to body
    document.body.classList.add('screen-transitioning');
    document.body.classList.add(`transition-${animation || 'slide-left'}`);

    // Trigger mascot animation based on screen
    this.triggerScreenMascotAnimation(toScreen);

    // Remove transition classes after animation
    setTimeout(() => {
      document.body.classList.remove('screen-transitioning');
      document.body.classList.remove(`transition-${animation || 'slide-left'}`);
    }, 500);
  }

  /**
   * Trigger mascot animation for screen transitions
   */
  private triggerScreenMascotAnimation(screenName: string): void {
    const screenAnimations: Record<string, { action: MascotAction; emotion: Emotion }> = {
      'academic': { action: MascotAction.THINKING, emotion: Emotion.HELPFUL },
      'wellness': { action: MascotAction.BREATHING, emotion: Emotion.CALM },
      'career': { action: MascotAction.THINKING, emotion: Emotion.SERIOUS },
      'attendance': { action: MascotAction.WAVE, emotion: Emotion.FRIENDLY },
      'coding': { action: MascotAction.THINKING, emotion: Emotion.EXCITED },
      'dashboard': { action: MascotAction.WAVE, emotion: Emotion.FRIENDLY }
    };

    const config = screenAnimations[screenName];
    if (config) {
      // 🚫 DEPRECATED: Direct animation triggering removed
      // Screen animations should be handled by backend responses
      console.warn(`ScreenService: Direct animation triggering deprecated for screen: ${screenName}. Use backend API instead.`);
    } else {
      console.warn(`⚠️ No animation configuration found for screen: ${screenName}`);
    }
  }

  /**
   * Highlight specific section within current screen
   */
  public highlightSection(sectionId: string): void {
    console.log('✨ Highlighting section:', sectionId);

    // Remove existing highlights
    document.querySelectorAll('.highlight-pulse, .highlight-glow').forEach(el => {
      el.classList.remove('highlight-pulse', 'highlight-glow');
    });

    // Add highlight to target section
    const element = document.getElementById(sectionId) || document.querySelector(`[data-section="${sectionId}"]`);
    
    if (element) {
      element.classList.add('highlight-pulse');
      
      // Scroll into view if needed
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Remove highlight after animation
      setTimeout(() => {
        element.classList.remove('highlight-pulse');
      }, 3000);

      // 🚫 DEPRECATED: Direct mascot pointing removed
      // Pointing should be handled by backend responses
      console.warn('ScreenService: Direct mascot pointing deprecated. Use backend API instead.');
    } else {
      console.warn('⚠️ Section not found:', sectionId);
    }
  }

  /**
   * Highlight specific element by selector
   */
  private highlightElement(selector: string): void {
    console.log('✨ Highlighting element:', selector);
    
    const element = document.querySelector(selector);
    if (element) {
      element.classList.add('highlight-glow');
      
      setTimeout(() => {
        element.classList.remove('highlight-glow');
      }, 3000);
    }
  }

  /**
   * Show specific element
   */
  private showElement(selector: string): void {
    console.log('👁️ Showing element:', selector);
    
    const element = document.querySelector(selector);
    if (element) {
      element.classList.remove('hidden');
      element.classList.add('visible');
    }
  }

  /**
   * Handle navigation events
   */
  private handleNavigation = (event: Event): void => {
    const customEvent = event as CustomEvent;
    const { section } = customEvent.detail;
    this.navigateToScreen(section);
  };

  /**
   * Handle screen transition events
   */
  private handleScreenTransition = (event: Event): void => {
    const customEvent = event as CustomEvent;
    const { from, to, animation } = customEvent.detail;
    this.triggerScreenTransition(from, to, animation);
  };

  /**
   * Go back to previous screen
   */
  public goBack(): void {
    if (this.screenHistory.length > 0) {
      const previousScreen = this.screenHistory.pop();
      if (previousScreen) {
        this.navigateToScreen(previousScreen, 'slide-right');
      }
    }
  }

  /**
   * Get current screen
   */
  public getCurrentScreen(): string {
    return this.currentScreen;
  }

  /**
   * Get screen history
   */
  public getScreenHistory(): string[] {
    return [...this.screenHistory];
  }

  /**
   * Save screen state
   */
  public saveScreenState(screenName: string, state: any): void {
    this.screenStates[screenName] = state;
  }

  /**
   * Get saved screen state
   */
  public getScreenState(screenName: string): any {
    return this.screenStates[screenName];
  }

  /**
   * Clear screen history
   */
  public clearHistory(): void {
    this.screenHistory = [];
  }

  /**
   * Show loading state for current screen
   */
  public showLoading(message?: string): void {
    window.dispatchEvent(new CustomEvent('showLoading', {
      detail: { message: message || 'Loading...' }
    }));
  }

  /**
   * Hide loading state
   */
  public hideLoading(): void {
    window.dispatchEvent(new CustomEvent('hideLoading'));
  }

  /**
   * Show error message
   */
  public showError(message: string, duration?: number): void {
    window.dispatchEvent(new CustomEvent('showError', {
      detail: { message, duration: duration || 5000 }
    }));
  }

  /**
   * Show success message
   */
  public showSuccess(message: string, duration?: number): void {
    window.dispatchEvent(new CustomEvent('showSuccess', {
      detail: { message, duration: duration || 3000 }
    }));
  }

  /**
   * Show notification
   */
  public showNotification(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info'): void {
    window.dispatchEvent(new CustomEvent('showNotification', {
      detail: { message, type }
    }));
  }
}

// Export singleton instance
export const screenService = new ScreenService();
