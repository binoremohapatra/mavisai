import { VRMCharacter } from './VRMCharacter';

type MascotEmotion = 
  | "friendly" 
  | "thinking"
  | "happy"
  | "excited"
  | "confused"
  | "sad";

interface CenteredMascotProps {
  emotion?: MascotEmotion;
  size?: "small" | "medium" | "large";
  showSpeech?: boolean;
  speechText?: string;
  subtitle?: string;
  speaking?: boolean;
}

export function CenteredMascot({ 
  emotion = "friendly", 
  subtitle,
  speaking = false 
}: CenteredMascotProps) {
  return (
    // FIX: Added w-full h-full to fill the parent container
    <div className="relative flex flex-col items-center w-full h-full">
      <div className="relative z-0 w-full h-full">
        <VRMCharacter 
          vrmUrl="/vroid/character.vrm"
        />
      </div>
    </div>
  );
}
