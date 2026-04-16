// Test Intent System - Paste this in browser console

// Access the animation controller
const controller = window.motionController;

if (controller) {
  console.log('🧪 Testing Intent System...');
  
  // Test 1: Trigger different actions
  console.log('📋 Testing Actions...');
  controller.triggerAction('WAVE_HELLO');
  setTimeout(() => controller.triggerAction('THINKING'), 2000);
  setTimeout(() => controller.triggerAction('SPEAKING'), 4000);
  setTimeout(() => controller.triggerAction('CELEBRATE'), 6000);
  setTimeout(() => controller.triggerAction('IDLE'), 8000);
  
  // Test 2: Test emotions
  console.log('😊 Testing Emotions...');
  setTimeout(() => controller.setEmotion('HAPPY'), 10000);
  setTimeout(() => controller.setEmotion('SERIOUS'), 12000);
  setTimeout(() => controller.setEmotion('CONFUSED'), 14000);
  setTimeout(() => controller.setEmotion('FRIENDLY'), 16000);
  
  // Test 3: Test new animations
  console.log('⚠️ Testing New Animations...');
  setTimeout(() => controller.triggerAction('SERIOUS_WARNING'), 18000);
  setTimeout(() => controller.triggerAction('ERROR_STATE'), 20000);
  
  console.log('✅ Intent test sequence started!');
} else {
  console.error('❌ Animation controller not found. Make sure VRM is loaded.');
}

// Manual testing functions
window.testIntent = {
  wave: () => controller?.triggerAction('WAVE_HELLO'),
  think: () => controller?.triggerAction('THINKING'),
  talk: () => controller?.triggerAction('SPEAKING'),
  celebrate: () => controller?.triggerAction('CELEBRATE'),
  warn: () => controller?.triggerAction('SERIOUS_WARNING'),
  error: () => controller?.triggerAction('ERROR_STATE'),
  
  emotions: {
    happy: () => controller?.setEmotion('HAPPY'),
    serious: () => controller?.setEmotion('SERIOUS'),
    confused: () => controller?.setEmotion('CONFUSED'),
    friendly: () => controller?.setEmotion('FRIENDLY')
  }
};

console.log('🎮 Manual testing available via window.testIntent');
