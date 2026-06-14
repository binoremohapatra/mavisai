# 🤖 Mavis AI — Frontend (Student Life OS)

> A TypeScript + React + Three.js frontend featuring a live VRM 3D avatar, real-time emotion-driven animations, speech recognition, and a full student life assistant dashboard.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-VRM-black?logo=threedotjs)](https://threejs.org)
[![Deployed](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://mavisai.vercel.app)

---

## ✨ Features

- **VRM 3D Avatar** — Loads a VRM character model, driven by live emotion states from the AI backend
- **Emotion System** — Avatar switches between 10+ named animations (`idle`, `talking`, `thinking`, `victory`, `defeat`, `wave`, etc.) based on LLM response emotion tags
- **Lip Sync Engine** — Real-time lip sync driven by TTS audio analysis
- **Eye Blink System** — Procedural eye blinking for lifelike avatar
- **Speech Recognition** — Browser Web Speech API for voice input
- **Chat Interface** — Full conversation history panel with emotion-aware chat bubbles
- **Student Life Dashboard** — Modules for Attendance, Wellness, Career, Coding Assistance, Study Plans, Academic Planning
- **Radial Navigation** — Character-centered radial menu for module switching
- **Device Pairing** — Pair mobile device for extended features

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Three.js + @react-three/fiber | 3D rendering |
| @pixiv/three-vrm | VRM avatar loading & morph targets |
| Zustand | Global state management |
| Framer Motion | UI animations |
| Axios | API communication |
| Tailwind CSS + Radix UI | Styling & components |
| Vite | Build tool |

## 🚀 Run Locally

```bash
git clone https://github.com/binoremohapatra/mavisai.git
cd mavisai
npm install

# Point to backend
echo "VITE_API_URL=http://localhost:8081" > .env

npm run dev
```

## 📁 Key Files

```
src/
├── components/
│   ├── VRMScene.tsx          3D scene with VRM avatar
│   ├── VRMCharacter.tsx      Avatar loader + morph target control
│   ├── MavisDashboard.tsx    Main dashboard shell
│   ├── EmotionChatInterface.tsx  Emotion-aware chat
│   └── MascotAttendance/Career/Wellness/Coding Screens
├── controllers/
│   └── HumanAnimationController.ts  FBX animation mixer
├── services/
│   ├── VoiceService.ts       TTS + lip sync
│   └── backend-service.ts    API client
├── utils/
│   ├── LipSyncEngine.ts      Audio → viseme mapping
│   └── IntentHandlers.ts     Intent routing
└── state/
    └── avatarState.ts        Zustand avatar state
```

## 🔗 Backend

[mavisai-core (Spring Boot + Python AI) →](https://github.com/binoremohapatra/mavisai-core)

---

**Built by [Binore Mohapatra](https://github.com/binoremohapatra)**
