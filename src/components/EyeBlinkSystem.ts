import { useEffect, useRef } from 'react';
import { VRM } from '@pixiv/three-vrm';

export interface EyeBlinkSystemProps {
  vrm: VRM | null;
  enabled?: boolean;
}

/**
 * Eye Blink System - Uses randomized intervals (3-6s) to drive 'blink' expressions
 */
export const EyeBlinkSystem: React.FC<EyeBlinkSystemProps> = ({ 
  vrm, 
  enabled = true 
}) => {
  const blinkTimeoutRef = useRef<number | null>(null);
  const isBlinkingRef = useRef(false);

  useEffect(() => {
    if (!vrm?.expressionManager || !enabled) return;

    const scheduleNextBlink = () => {
      // Random interval between 3-6 seconds
      const interval = 3000 + Math.random() * 3000;
      
      blinkTimeoutRef.current = window.setTimeout(() => {
        performBlink();
      }, interval);
    };

    const performBlink = () => {
      if (!vrm.expressionManager || isBlinkingRef.current) return;

      isBlinkingRef.current = true;

      // Blink animation (down -> up)
      const blinkDown = () => {
        if (vrm.expressionManager) {
          try {
            vrm.expressionManager.setValue('blink', 1.0);
            vrm.expressionManager.setValue('blinkLeft', 1.0);
            vrm.expressionManager.setValue('blinkRight', 1.0);
          } catch (error) {
            // Expression might not exist
          }
        }

        // Hold blink for 100ms
        setTimeout(blinkUp, 100);
      };

      const blinkUp = () => {
        if (vrm.expressionManager) {
          try {
            vrm.expressionManager.setValue('blink', 0.0);
            vrm.expressionManager.setValue('blinkLeft', 0.0);
            vrm.expressionManager.setValue('blinkRight', 0.0);
          } catch (error) {
            // Expression might not exist
          }
        }

        isBlinkingRef.current = false;
        
        // Schedule next blink
        scheduleNextBlink();
      };

      blinkDown();
    };

    // Start blinking
    scheduleNextBlink();

    // Cleanup
    return () => {
      if (blinkTimeoutRef.current) {
        clearTimeout(blinkTimeoutRef.current);
      }
      
      // Reset blink expressions
      if (vrm.expressionManager) {
        try {
          vrm.expressionManager.setValue('blink', 0.0);
          vrm.expressionManager.setValue('blinkLeft', 0.0);
          vrm.expressionManager.setValue('blinkRight', 0.0);
        } catch (error) {
          // Expression might not exist
        }
      }
    };
  }, [vrm, enabled]);

  return null;
};
