// 🧪 EMOTION TEST SCRIPT
// Copy and paste this into your browser console to test emotions

// Test all emotions
console.log('🧪 Testing Emotions...');

// Get the animation controller
const controller = window.__animationController;

if (!controller) {
  console.error('❌ Animation controller not found. Make sure the mascot is loaded first.');
} else {
  console.log('✅ Animation controller found! Testing emotions...');
  
  // Test each emotion
  const emotions = [
    { name: 'Neutral', value: 'Neutral' },
    { name: 'Happy', value: 'Happy' },
    { name: 'Sad', value: 'Sad' },
    { name: 'Angry', value: 'Angry' },
    { name: 'Relaxed', value: 'Relaxed' },
    { name: 'Surprised', value: 'Surprised' }
  ];
  
  emotions.forEach((emotion, index) => {
    setTimeout(() => {
      console.log(`🎭 Testing ${emotion.name}...`);
      controller.debugEmotion(emotion.value);
    }, index * 2000);
  });
  
  // Test talking emotion (Relaxed + subtle Happy)
  setTimeout(() => {
    console.log('🗣️ Testing perfect talking emotion...');
    controller.triggerAction('SPEAKING');
  }, emotions.length * 2000);
  
  // Return to idle
  setTimeout(() => {
    console.log('😌 Returning to idle...');
    controller.triggerAction('IDLE');
  }, (emotions.length + 1) * 2000);
}

// Individual emotion tests (you can run these manually)
console.log(`
🎯 Manual Emotion Tests:
controller.debugEmotion('Neutral');
controller.debugEmotion('Happy');
controller.debugEmotion('Sad');
controller.debugEmotion('Angry');
controller.debugEmotion('Relaxed');
controller.debugEmotion('Surprised');

🗣️ Talking Test:
controller.triggerAction('SPEAKING');

😌 Idle Test:
controller.triggerAction('IDLE');
`);
