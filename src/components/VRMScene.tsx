import React, { useRef, useState, useEffect, Suspense } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRM, VRMLoaderPlugin } from '@pixiv/three-vrm';
import { HumanAnimationController } from '../controllers/HumanAnimationController';
import { backendService } from '../services/backend-service';
import { useAppStore } from '../store';
import { initializeLipSync, playLipSync, stopLipSync } from '../utils/LipSyncEngine';

interface VRMSceneProps {
  vrmUrl: string;
  mode?: 'dashboard' | 'screen'; // ✅ NEW: To isolate logic
  onControllerReady?: (c: any) => void;
}

function VRMLoaderComponent({ vrmUrl, mode = 'dashboard', onControllerReady }: VRMSceneProps) {
  const { setMascotResponse } = useAppStore();
  const { camera, scene } = useThree();
  const [vrm, setVrm] = useState<VRM | null>(null);
  const controllerRef = useRef<HumanAnimationController | null>(null);

  // 🔥 DIRECT REF FOR INSTANT ACCESS (No React Lag)
  const latestActionRef = useRef<string>('IDLE'); 
  const latestEmotionRef = useRef<string>('NEUTRAL');

  const isSpeaking = useAppStore((state) => state.mascot.speaking);
  const replyText = useAppStore((state) => state.mascot.replyText);
  const isChatLoading = useAppStore((state) => state.mascot.loading);

  useEffect(() => {
    camera.position.set(0, 1.3, 4); 
    camera.lookAt(0, 1.3, 0); 
  }, [camera]);

  const gltf = useLoader(GLTFLoader, vrmUrl, (loader) => {
    loader.register((parser: any) => new VRMLoaderPlugin(parser));
  });

  useEffect(() => {
    if (!gltf) return;
    const vrmInstance = (gltf as any).userData.vrm;
    const controller = new HumanAnimationController(vrmInstance);
    controllerRef.current = controller;
    
    (window as any).humanAnimationController = controller; 
    initializeLipSync(vrmInstance);
    
    // ✅ STORE FUNCTIONS: Store data in Ref immediately
    backendService.setStoreFunctions(
        (action: any) => {
            console.log("⚡ Instant Action Update:", action);
            latestActionRef.current = action; // Turant update
            controller.play(action); // Turant play
        },
        (emotion: any) => {
            console.log("⚡ Instant Emotion Update:", emotion);
            latestEmotionRef.current = emotion; // Turant update
            controller.applyEmotion(emotion); // Turant apply
        },
        (response: any) => {
            // State update for UI (Slow but fine for text)
            setMascotResponse(response);
            // Ensure refs are synced just in case
            if(response.mascotAction) latestActionRef.current = response.mascotAction;
            if(response.emotion) latestEmotionRef.current = response.emotion;
        }
    );
    
    setVrm(vrmInstance);
    return () => { scene.remove(vrmInstance.scene); };
  }, [gltf]);

  // ✅ ISOLATED LOGIC ENGINE
  useEffect(() => {
    if (!controllerRef.current) return;

    // 🛑 DASHBOARD MODE: Purana saara logic (Backend + Idle + Speaking)
    if (mode === 'dashboard') {
      if (isChatLoading) {
        controllerRef.current.play('THINKING', true);
        controllerRef.current.applyEmotion('THINKING');
      } 
      else if (isSpeaking && replyText) {
        playLipSync(replyText);
        const backendAction = latestActionRef.current || 'IDLE';
        const backendEmotion = latestEmotionRef.current || 'NEUTRAL';

        controllerRef.current.applyEmotion(backendEmotion);

        // Standard Backend Animation Rules
        const specialActions = ['WAVE', 'VICTORY', 'SAD', 'ANGRY', 'THANKFUL'];
        if (specialActions.includes(backendAction)) {
          controllerRef.current.play(backendAction, true);
        } else if (replyText.length > 40) {
          controllerRef.current.play('SPEAKING', true);
        } else {
          controllerRef.current.play('IDLE'); // ✅ IDLE always works here
        }
      } 
      else {
        stopLipSync();
        controllerRef.current.play('IDLE'); // ✅ Normal IDLE for Chat
      }
    } 
    
    // 🛑 SCREEN MODE: No automatic IDLE, let the screen control it
    else if (mode === 'screen') {
      if (isSpeaking && replyText) {
        playLipSync(replyText);
        // Sirf Lipsync chalao, body ko manual controller sambhalega
      } else {
        stopLipSync();
      }
    }
  }, [isSpeaking, replyText, isChatLoading, mode]); // ✅ Mode added to deps

  useFrame((state, delta) => {
    if (vrm && controllerRef.current) {
      controllerRef.current.update(Math.min(delta, 0.033));
      vrm.update(2);
    }
  });

  return vrm ? <primitive object={vrm.scene} /> : null;
}

export function VRMScene(props: any) {
  return (
    <Suspense fallback={null}>
      <VRMLoaderComponent {...props} />
    </Suspense>
  );
}
