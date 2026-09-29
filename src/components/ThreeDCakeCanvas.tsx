import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sound } from '../utils/audio';

export interface ThreeDCakeCanvasProps {
  currentStep?: 1 | 2 | 3 | 4 | 5;
  candlesLit: boolean;
  sparklersActive: boolean;
  isKnifeDrawn: boolean;
  isCutsceneActive: boolean;
  isSliced: boolean;
  bitesTaken: number;
  cameraPreset?: 'orbit' | 'front' | 'close' | 'top';
  selectedToppings?: string[];
  onSliceFinished?: () => void;
  onCandleTapped?: () => void;
  // Legacy compatibility props
  stage?: 'intact' | 'blade-drawn' | 'slicing' | 'sliced';
  candles?: [boolean, boolean, boolean];
  onSliceComplete?: () => void;
  onBlowCandle?: (index: number) => void;
}

export const ThreeDCakeCanvas: React.FC<ThreeDCakeCanvasProps> = (props) => {
  // Normalize props for unified workflow
  const candlesLit = props.candlesLit ?? (props.candles ? props.candles.some(Boolean) : true);
  const sparklersActive = props.sparklersActive ?? false;
  const isKnifeDrawn = props.isKnifeDrawn ?? (props.stage === 'blade-drawn' || props.stage === 'slicing');
  const isCutsceneActive = props.isCutsceneActive ?? (props.stage === 'slicing');
  const isSliced = props.isSliced ?? (props.stage === 'sliced');
  const bitesTaken = props.bitesTaken ?? 0;
  const cameraPreset = props.cameraPreset ?? 'orbit';
  const selectedToppings = props.selectedToppings ?? [];
  const onSliceFinished = props.onSliceFinished ?? props.onSliceComplete;
  const onCandleTapped = props.onCandleTapped ?? (() => props.onBlowCandle?.(0));

  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameIdRef = useRef<number | null>(null);

  // Scene Groups
  const masterGroupRef = useRef<THREE.Group | null>(null);
  const intactCakeGroupRef = useRef<THREE.Group | null>(null);
  const cutBodyGroupRef = useRef<THREE.Group | null>(null);  // 315° main body
  const sliceWedgeGroupRef = useRef<THREE.Group | null>(null); // 45° wedge
  const knifeGroupRef = useRef<THREE.Group | null>(null);
  const dessertPlateGroupRef = useRef<THREE.Group | null>(null);
  const candleGroupRef = useRef<THREE.Group | null>(null);
  const toppingsGroupRef = useRef<THREE.Group | null>(null);
  const fairyLightsGroupRef = useRef<THREE.Group | null>(null);
  const sparklerGroupRef = useRef<THREE.Group | null>(null);

  // Lights & Dynamic Objects
  const candlePointLightsRef = useRef<THREE.PointLight[]>([]);
  const flameMeshesRef = useRef<THREE.Mesh[]>([]);
  const sparklerParticlesRef = useRef<THREE.Points | null>(null);
  const sparklerCountRef = useRef(200);

  // Interaction & Camera Controls
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const pointerStartPosRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.3, y: -0.3 });
  const currentRotationRef = useRef({ x: 0.3, y: -0.3 });
  const targetCameraPosRef = useRef(new THREE.Vector3(0, 1.4, 5.0));
  const currentCameraPosRef = useRef(new THREE.Vector3(0, 1.4, 5.0));
  const isAutoOrbitRef = useRef(true);
  const [isAutoOrbit, setIsAutoOrbit] = useState(true);

  // Slicing animation
  const sliceProgressRef = useRef(0);
  const sliceAnimActiveRef = useRef(false);

  // ==========================================================
  // TEXTURES
  // ==========================================================
  const createVelvetTexture = (baseHex: string, grainHex: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 28000; i++) {
      const x = Math.random() * 512, y = Math.random() * 512;
      ctx.fillStyle = Math.random() > 0.5 ? grainHex : 'rgba(255,255,255,0.06)';
      ctx.fillRect(x, y, 1.2, 1.2);
    }
    for (let i = 0; i < 280; i++) {
      const x = Math.random() * 512, y = Math.random() * 512;
      ctx.fillStyle = 'rgba(255,215,0,0.65)';
      ctx.beginPath(); ctx.arc(x, y, Math.random() * 1.5, 0, Math.PI * 2); ctx.fill();
    }
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  };

  const createCreamTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);
    const g = ctx.createLinearGradient(0, 0, 512, 512);
    g.addColorStop(0, '#fff8ef'); g.addColorStop(0.5, '#fef0dc'); g.addColorStop(1, '#f5e0c0');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 8000; i++) {
      const x = Math.random() * 512, y = Math.random() * 512;
      ctx.fillStyle = 'rgba(240,220,190,0.3)'; ctx.fillRect(x, y, 1, 1);
    }
    return new THREE.CanvasTexture(canvas);
  };

  const createInteriorTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);
    ctx.fillStyle = '#7a1525'; ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 40000; i++) {
      const x = Math.random() * 512, y = Math.random() * 512;
      ctx.fillStyle = Math.random() > 0.4 ? '#5c0f1c' : '#9a1f34';
      ctx.fillRect(x, y, 1.4, 1.4);
    }
    // Cream layers
    [95, 200, 310, 420].forEach(y => {
      const cg = ctx.createLinearGradient(0, y - 14, 0, y + 14);
      cg.addColorStop(0, '#fffbf2'); cg.addColorStop(0.5, '#fff5e0'); cg.addColorStop(1, '#f0dfc0');
      ctx.fillStyle = cg; ctx.fillRect(0, y - 13, 512, 26);
      ctx.fillStyle = 'rgba(188,14,40,0.9)'; ctx.fillRect(0, y - 3, 512, 6);
    });
    return new THREE.CanvasTexture(canvas);
  };

  const createInscriptionTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);
    ctx.fillStyle = '#4a0e1a'; ctx.fillRect(0, 0, 1024, 256);
    const gld = ctx.createLinearGradient(0, 0, 1024, 0);
    gld.addColorStop(0, '#ffd700'); gld.addColorStop(0.3, '#ffe888');
    gld.addColorStop(0.7, '#ffb000'); gld.addColorStop(1, '#ffd700');
    ctx.strokeStyle = gld; ctx.lineWidth = 6; ctx.strokeRect(16, 16, 992, 224);
    ctx.lineWidth = 2; ctx.strokeRect(26, 26, 972, 204);
    ctx.fillStyle = gld;
    ctx.font = 'bold 46px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 12;
    ctx.fillText('Doctor Paapa 🩺✨', 512, 128);
    return new THREE.CanvasTexture(canvas);
  };

  // ==========================================================
  // SCENE SETUP
  // ==========================================================
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const W = container.clientWidth || 640;
    const H = container.clientHeight || 420;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(0, 1.4, 5.0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights — warm bakery studio rig
    scene.add(new THREE.AmbientLight(0xffecd6, 2.2));

    const key = new THREE.SpotLight(0xfff8ec, 4.5);
    key.position.set(2, 7, 3.5); key.angle = Math.PI / 4.5;
    key.penumbra = 0.55; key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xffe0f5, 2.0);
    rim.position.set(-3, 3, -2); scene.add(rim);

    const fill = new THREE.DirectionalLight(0xffdab0, 1.2);
    fill.position.set(0, -1, 3); scene.add(fill);

    const bounce = new THREE.PointLight(0xff9966, 1.4, 7);
    bounce.position.set(0, -1.5, 2); scene.add(bounce);

    // Master Group (orbits with user drag)
    const masterGroup = new THREE.Group();
    masterGroupRef.current = masterGroup;
    scene.add(masterGroup);

    // Fairy Lights Background
    const fairyGroup = new THREE.Group();
    fairyLightsGroupRef.current = fairyGroup;
    scene.add(fairyGroup);
    const fGeo = new THREE.BufferGeometry();
    const fPos = new Float32Array(80 * 3);
    for (let i = 0; i < 80 * 3; i += 3) {
      fPos[i] = (Math.random() - 0.5) * 9;
      fPos[i + 1] = Math.random() * 4 - 0.8;
      fPos[i + 2] = -2.5 - Math.random() * 3;
    }
    fGeo.setAttribute('position', new THREE.BufferAttribute(fPos, 3));
    const fMat = new THREE.PointsMaterial({ color: 0xffd9a0, size: 0.09, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending });
    fairyGroup.add(new THREE.Points(fGeo, fMat));

    // Tabletop
    const tableGeo = new THREE.CylinderGeometry(3.5, 3.5, 0.06, 48);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x1c0816, roughness: 0.55, metalness: 0.15 });
    const tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.position.y = -1.2; tableMesh.receiveShadow = true;
    masterGroup.add(tableMesh);

    // Contact shadow
    const shGeo = new THREE.CircleGeometry(1.7, 32);
    const shMat = new THREE.MeshBasicMaterial({ color: 0x06020a, transparent: true, opacity: 0.5 });
    const shMesh = new THREE.Mesh(shGeo, shMat);
    shMesh.rotation.x = -Math.PI / 2; shMesh.position.y = -1.17;
    masterGroup.add(shMesh);

    // ── MATERIALS ──────────────────────────────────────────────
    const baseTex = createVelvetTexture('#5c1422', '#3a0912');
    const midTex  = createVelvetTexture('#8c2b42', '#541322');
    const topTex  = createCreamTexture();
    const intTex  = createInteriorTexture();
    const inscTex = createInscriptionTexture();

    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.16 });
    const creamMat = new THREE.MeshStandardMaterial({ color: 0xfffaf2, roughness: 0.28, metalness: 0.04 });
    const intMat = new THREE.MeshStandardMaterial({ map: intTex, roughness: 0.5, metalness: 0.05 });

    // ── PEDESTAL ───────────────────────────────────────────────
    const makePedestal = (parent: THREE.Group) => {
      const top = new THREE.Mesh(new THREE.CylinderGeometry(1.62, 1.62, 0.08, 48), goldMat);
      top.position.y = -0.63; top.receiveShadow = true; parent.add(top);
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.52, 0.38, 32), goldMat);
      stem.position.y = -0.85; parent.add(stem);
      const base = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.22, 0.1, 48), goldMat);
      base.position.y = -1.08; parent.add(base);
    };

    // ── ROSETTES around tier rim ───────────────────────────────
    const addRosettes = (parent: THREE.Group, radius: number, yPos: number, skipMin: number, skipMax: number) => {
      const count = Math.floor(radius * 24);
      for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 2;
        const normTheta = ((theta % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const inSkip = normTheta >= skipMin && normTheta <= skipMax;
        if (inSkip) continue;
        const sg = new THREE.SphereGeometry(0.038, 12, 12);
        const m = new THREE.Mesh(sg, i % 2 === 0 ? creamMat : goldMat);
        m.position.set(Math.sin(theta) * (radius - 0.02), yPos + 0.02, Math.cos(theta) * (radius - 0.02));
        parent.add(m);
      }
    };

    // ── STRAWBERRIES ───────────────────────────────────────────
    const berryMat = new THREE.MeshStandardMaterial({ color: 0xcc1530, roughness: 0.2, metalness: 0.08 });
    const leafMat2 = new THREE.MeshStandardMaterial({ color: 0x2d8b50, roughness: 0.55 });

    const makeBerry = (parent: THREE.Group, x: number, y: number, z: number, scale = 1) => {
      const bg = new THREE.Group(); bg.position.set(x, y, z); bg.scale.setScalar(scale);
      const body = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.14, 16), berryMat);
      body.rotation.x = Math.PI; bg.add(body);
      for (let l = 0; l < 4; l++) {
        const lf = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.012, 0.018), leafMat2);
        lf.position.y = 0.07; lf.rotation.y = (l * Math.PI) / 2; bg.add(lf);
      }
      // White seed dots
      for (let s = 0; s < 10; s++) {
        const sd = new THREE.Mesh(new THREE.SphereGeometry(0.008, 6, 6), new THREE.MeshBasicMaterial({ color: 0xfffce0 }));
        const ang = (s / 10) * Math.PI * 2;
        sd.position.set(Math.sin(ang) * 0.05, -0.03 - Math.random() * 0.05, Math.cos(ang) * 0.05);
        bg.add(sd);
      }
      parent.add(bg);
    };

    // ── INTACT CAKE GROUP ──────────────────────────────────────
    const intactGroup = new THREE.Group();
    intactCakeGroupRef.current = intactGroup;
    masterGroup.add(intactGroup);
    makePedestal(intactGroup);

    const buildIntact = (radius: number, h: number, y: number, tex: THREE.CanvasTexture, hasPlaque = false) => {
      const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.34, metalness: 0.07 });
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, h, 48), mat);
      mesh.position.y = y; mesh.castShadow = true; mesh.receiveShadow = true;
      intactGroup.add(mesh);

      // Gold base ring
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius + 0.01, 0.017, 12, 48), goldMat);
      ring.rotation.x = Math.PI / 2; ring.position.y = y - h / 2 + 0.015;
      intactGroup.add(ring);

      // Gold top ring
      const topRing = new THREE.Mesh(new THREE.TorusGeometry(radius + 0.01, 0.017, 12, 48), goldMat);
      topRing.rotation.x = Math.PI / 2; topRing.position.y = y + h / 2 - 0.015;
      intactGroup.add(topRing);

      if (hasPlaque) {
        const pMat = new THREE.MeshStandardMaterial({ map: inscTex, roughness: 0.22, metalness: 0.45 });
        const pGeo = new THREE.CylinderGeometry(radius + 0.007, radius + 0.007, h * 0.6, 48, 1, true, -Math.PI / 3.5, (2 * Math.PI) / 3);
        const pm = new THREE.Mesh(pGeo, pMat); pm.position.y = y; intactGroup.add(pm);
      }
      addRosettes(intactGroup, radius, y + h / 2, -1, -1); // no skip
    };

    buildIntact(1.42, 0.65, -0.28, baseTex, true);
    buildIntact(1.05, 0.55, 0.32, midTex);
    buildIntact(0.72, 0.48, 0.84, topTex);
    makeBerry(intactGroup, -0.28, 1.1, -0.12);
    makeBerry(intactGroup, -0.10, 1.1, 0.28, 0.9);
    makeBerry(intactGroup, 0.20, 1.1, -0.3, 0.95);
    makeBerry(intactGroup, -0.35, 1.1, 0.12, 0.85);

    // ── CUT CAKE GROUP (Body 315° + Wedge 45°) ────────────────
    // CRITICAL: sliceAngle defines the 45° wedge
    const SA = Math.PI * 0.25; // 45 degrees
    const MAIN_START = SA / 2;       // start of 315° arc
    const MAIN_SWEEP = Math.PI * 2 - SA; // 315°
    // Wedge: centered at 0, from -SA/2 to +SA/2

    const cutBodyGroup = new THREE.Group();
    cutBodyGroupRef.current = cutBodyGroup;
    cutBodyGroup.visible = false;
    masterGroup.add(cutBodyGroup);
    makePedestal(cutBodyGroup);

    const sliceWedgeGroup = new THREE.Group();
    sliceWedgeGroupRef.current = sliceWedgeGroup;
    // sliceWedgeGroup is a child of cutBodyGroup so positions are relative
    cutBodyGroup.add(sliceWedgeGroup);

    const buildCutTier = (radius: number, h: number, y: number, tex: THREE.CanvasTexture) => {
      const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.34, metalness: 0.07, side: THREE.FrontSide });

      // ─ Main Body (315° arc) ─
      const bodyGeo = new THREE.CylinderGeometry(radius, radius, h, 64, 1, false, MAIN_START, MAIN_SWEEP);
      const body = new THREE.Mesh(bodyGeo, mat);
      body.position.y = y; body.castShadow = true; body.receiveShadow = true;
      cutBodyGroup.add(body);

      // Body cut face cap 1 — flat interior crumb visible at the cut gap
      const capPlane1 = new THREE.Mesh(
        new THREE.PlaneGeometry(radius, h),
        intMat
      );
      const ang1 = MAIN_START;
      capPlane1.position.set((radius / 2) * Math.cos(ang1 + Math.PI), y, (radius / 2) * Math.sin(ang1 + Math.PI));
      capPlane1.rotation.y = ang1;
      cutBodyGroup.add(capPlane1);

      // Face 2: at angle MAIN_START + MAIN_SWEEP = MAIN_START + (2π - SA) = 2π + MAIN_START - SA = -SA/2 + 2π
      const ang2 = MAIN_START + MAIN_SWEEP; // same as -SA/2 + 2π
      const capPlane2 = new THREE.Mesh(new THREE.PlaneGeometry(radius, h), intMat);
      capPlane2.position.set(
        (radius / 2) * Math.sin(ang2),
        y,
        (radius / 2) * Math.cos(ang2)
      );
      capPlane2.rotation.y = -ang2 + Math.PI;
      cutBodyGroup.add(capPlane2);

      // Gold base ring (315° partial)
      const ringGeo = new THREE.TorusGeometry(radius + 0.01, 0.017, 12, 48, MAIN_SWEEP);
      const ring = new THREE.Mesh(ringGeo, goldMat);
      ring.rotation.x = Math.PI / 2; ring.rotation.z = -MAIN_START;
      ring.position.y = y - h / 2 + 0.015;
      cutBodyGroup.add(ring);

      // Rosettes on body only (skip wedge section)
      const skipMin = (((-SA / 2) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const skipMax = ((SA / 2 + Math.PI * 2) % (Math.PI * 2));
      const rCount = Math.floor(radius * 24);
      for (let i = 0; i < rCount; i++) {
        const theta = (i / rCount) * Math.PI * 2;
        let normT = ((theta % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        // Skip wedge region (near 0 radians)
        if (normT < SA / 2 || normT > Math.PI * 2 - SA / 2) continue;
        const sg = new THREE.SphereGeometry(0.038, 12, 12);
        const pearl = new THREE.Mesh(sg, i % 2 === 0 ? creamMat : goldMat);
        pearl.position.set(Math.sin(theta) * (radius - 0.02), y + h / 2 + 0.02, Math.cos(theta) * (radius - 0.02));
        cutBodyGroup.add(pearl);
      }

      // ─ Slice Wedge (45° arc) ─
      const wedgeGeo = new THREE.CylinderGeometry(radius, radius, h, 16, 1, false, -SA / 2, SA);
      const wedge = new THREE.Mesh(wedgeGeo, mat);
      wedge.position.y = y; wedge.castShadow = true;
      sliceWedgeGroup.add(wedge);

      // Wedge cut face caps — use proper fan-shaped geometry
      // Cap at angle -SA/2
      const capW1 = new THREE.Mesh(new THREE.PlaneGeometry(radius, h), intMat);
      capW1.position.set((radius / 2) * Math.sin(-SA / 2), y, (radius / 2) * Math.cos(-SA / 2));
      capW1.rotation.y = -(-SA / 2) - Math.PI / 2;
      sliceWedgeGroup.add(capW1);

      // Cap at angle SA/2
      const capW2 = new THREE.Mesh(new THREE.PlaneGeometry(radius, h), intMat);
      capW2.position.set((radius / 2) * Math.sin(SA / 2), y, (radius / 2) * Math.cos(SA / 2));
      capW2.rotation.y = -(SA / 2) + Math.PI / 2;
      sliceWedgeGroup.add(capW2);

      // Rosettes on wedge only
      for (let i = 0; i < rCount; i++) {
        const theta = (i / rCount) * Math.PI * 2;
        let normT = ((theta % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        if (normT > SA / 2 && normT < Math.PI * 2 - SA / 2) continue;
        const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 12), i % 2 === 0 ? creamMat : goldMat);
        pearl.position.set(Math.sin(theta) * (radius - 0.02), y + h / 2 + 0.02, Math.cos(theta) * (radius - 0.02));
        sliceWedgeGroup.add(pearl);
      }
    };

    buildCutTier(1.42, 0.65, -0.28, baseTex);
    buildCutTier(1.05, 0.55,  0.32, midTex);
    buildCutTier(0.72, 0.48,  0.84, topTex);
    makeBerry(sliceWedgeGroup, 0.0, 0.88, 0.1); // on top of wedge

    // Inscription on cut body (same front arc)
    const inscMat = new THREE.MeshStandardMaterial({ map: inscTex, roughness: 0.22, metalness: 0.48 });
    const inscGeo = new THREE.CylinderGeometry(1.43, 1.43, 0.38, 64, 1, true, MAIN_START, MAIN_SWEEP * 0.42);
    const inscMesh = new THREE.Mesh(inscGeo, inscMat);
    inscMesh.position.y = -0.28; cutBodyGroup.add(inscMesh);

    // ── DESSERT PLATE ──────────────────────────────────────────
    // Plate is a separate world-space group attached to scene (not masterGroup)
    // so it doesn't rotate with the cake
    const dessertPlateGroup = new THREE.Group();
    dessertPlateGroupRef.current = dessertPlateGroup;
    dessertPlateGroup.scale.set(0, 0, 0);
    // Will be positioned in world space during animation
    scene.add(dessertPlateGroup);

    const plateBase = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 0.72, 0.04, 32), goldMat);
    plateBase.receiveShadow = true; dessertPlateGroup.add(plateBase);
    const plateRim = new THREE.Mesh(new THREE.TorusGeometry(0.87, 0.016, 12, 32), goldMat);
    plateRim.rotation.x = Math.PI / 2; dessertPlateGroup.add(plateRim);

    const forkG = new THREE.Group(); forkG.position.set(1.0, 0.04, 0); forkG.rotation.y = -Math.PI / 9;
    dessertPlateGroup.add(forkG);
    const fHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.012, 0.72, 12), goldMat);
    fHandle.rotation.x = Math.PI / 2; forkG.add(fHandle);
    for (let t = -1; t <= 1; t++) {
      const tine = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.24, 8), goldMat);
      tine.position.set(t * 0.034, 0, -0.44); tine.rotation.x = Math.PI / 2; forkG.add(tine);
    }

    // ── TOPPINGS GROUP (scene-space, synced to slice position) ─
    const toppingsGroup = new THREE.Group();
    toppingsGroupRef.current = toppingsGroup;
    scene.add(toppingsGroup);

    // ── CANDLES ────────────────────────────────────────────────
    const candleGroup = new THREE.Group();
    candleGroupRef.current = candleGroup;
    masterGroup.add(candleGroup);

    const candleCoords = [
      { x: -0.25, z: -0.05, h: 0.38 },
      { x:  0.00, z:  0.14, h: 0.46 },
      { x:  0.25, z: -0.05, h: 0.38 },
    ];
    flameMeshesRef.current = []; candlePointLightsRef.current = [];
    const waxMat = new THREE.MeshStandardMaterial({ color: 0xfff5e6, roughness: 0.38 });

    candleCoords.forEach((c) => {
      const cg = new THREE.Group(); cg.position.set(c.x, 1.08, c.z);
      const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, c.h, 24), waxMat);
      wax.position.y = c.h / 2; wax.castShadow = true; cg.add(wax);
      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.048, 0.012, 12, 24), goldMat);
      collar.rotation.x = Math.PI / 2; collar.position.y = 0.02; cg.add(collar);
      const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.05, 8), new THREE.MeshBasicMaterial({ color: 0x222222 }));
      wick.position.y = c.h + 0.025; cg.add(wick);
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.14, 16), new THREE.MeshBasicMaterial({ color: 0xffaa22 }));
      flame.position.y = c.h + 0.1; cg.add(flame);
      flameMeshesRef.current.push(flame);
      const light = new THREE.PointLight(0xff9900, 2.2, 3.5);
      light.position.set(0, c.h + 0.12, 0); cg.add(light);
      candlePointLightsRef.current.push(light);
      candleGroup.add(cg);
    });

    // ── KNIFE ──────────────────────────────────────────────────
    const knifeGroup = new THREE.Group();
    knifeGroupRef.current = knifeGroup;
    knifeGroup.position.set(0, 4.0, 0); // hidden above
    knifeGroup.rotation.z = -Math.PI / 7;
    scene.add(knifeGroup);

    const bladeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.038, 1.05, 0.12),
      new THREE.MeshStandardMaterial({ color: 0xedf2f7, metalness: 0.95, roughness: 0.12 }));
    bladeMesh.position.y = -0.5; bladeMesh.castShadow = true; knifeGroup.add(bladeMesh);
    const guardMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.18), goldMat);
    knifeGroup.add(guardMesh);
    const kHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.42, 16),
      new THREE.MeshStandardMaterial({ color: 0x361618, roughness: 0.35 }));
    kHandle.position.y = 0.22; knifeGroup.add(kHandle);
    const kPommel = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xd91632, metalness: 0.8, roughness: 0.15 }));
    kPommel.position.y = 0.46; knifeGroup.add(kPommel);

    // ── SPARKLERS ──────────────────────────────────────────────
    const sparkCount = 200;
    sparklerCountRef.current = sparkCount;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount * 3; i += 3) {
      sparkPos[i] = (Math.random() - 0.5) * 0.8;
      sparkPos[i + 1] = Math.random() * 1.1;
      sparkPos[i + 2] = (Math.random() - 0.5) * 0.8;
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const sparkMat = new THREE.PointsMaterial({ color: 0xffe880, size: 0.05, transparent: true, opacity: 0, blending: THREE.AdditiveBlending });
    const sparkler = new THREE.Points(sparkGeo, sparkMat);
    sparkler.position.set(0, 1.0, 0);
    sparklerParticlesRef.current = sparkler;
    scene.add(sparkler);

    // ── RENDER LOOP ────────────────────────────────────────────
    const clock = new THREE.Clock();
    const sparkCount3 = sparkCount;

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth orbit damping
      if (isAutoOrbitRef.current && !isDraggingRef.current) {
        targetRotationRef.current.y += 0.0038;
      }
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.08;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.08;
      if (masterGroupRef.current) {
        masterGroupRef.current.rotation.x = currentRotationRef.current.x;
        masterGroupRef.current.rotation.y = currentRotationRef.current.y;
      }

      // Camera smooth lerp
      currentCameraPosRef.current.lerp(targetCameraPosRef.current, 0.06);
      if (cameraRef.current) {
        cameraRef.current.position.copy(currentCameraPosRef.current);
        cameraRef.current.lookAt(0, 0.1, 0);
      }

      // Candle flame flicker
      flameMeshesRef.current.forEach((mesh, idx) => {
        const f = Math.sin(elapsed * 12 + idx * 2.2) * 0.12 + Math.cos(elapsed * 18 + idx) * 0.07;
        mesh.scale.set(1 + f * 0.4, 1 + f, 1 + f * 0.4);
      });
      candlePointLightsRef.current.forEach((light, idx) => {
        const noise = Math.sin(elapsed * 14 + idx * 2.8) * 0.3;
        light.intensity = Math.max(0.2, 2.2 + noise);
      });

      // Sparklers
      const spk = sparklerParticlesRef.current;
      if (spk) {
        spk.rotation.y += 0.04;
        const pos = spk.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < sparkCount3 * 3; i += 3) {
          pos[i] += 0.018;
          if (pos[i] > 1.4) pos[i] = 0.1;
        }
        spk.geometry.attributes.position.needsUpdate = true;
      }

      // Fairy lights twinkle
      if (fairyLightsGroupRef.current) {
        fairyLightsGroupRef.current.rotation.y = Math.sin(elapsed * 0.08) * 0.06;
      }

      // ─ SLICING CUTSCENE ─────────────────────────────────────
      if (sliceAnimActiveRef.current && knifeGroupRef.current && sliceWedgeGroupRef.current && dessertPlateGroupRef.current) {
        sliceProgressRef.current = Math.min(1, sliceProgressRef.current + 0.014);
        const p = sliceProgressRef.current;
        const rotY = currentRotationRef.current.y;
        const rotX = currentRotationRef.current.x;

        if (p <= 0.45) {
          // Stage 1: Knife descends through cake
          const t = p / 0.45;
          knifeGroupRef.current.position.set(0.3, 1.5 - t * 2.1, 0.4);
          knifeGroupRef.current.rotation.z = -Math.PI / 7;
        } else if (p <= 1.0) {
          // Stage 2: Knife pulls away, wedge slides to plate
          const sepT = (p - 0.45) / 0.55;
          const ease = 1 - Math.pow(1 - sepT, 3);

          // Knife pulls off to the side
          knifeGroupRef.current.position.set(0.3 + ease * 1.4, -0.5 - ease * 0.5, 0.4 + ease * 0.8);
          knifeGroupRef.current.rotation.z = -Math.PI / 7 + ease * (Math.PI / 3.5);

          // Wedge glides to the right of the cake (in local masterGroup coords)
          // Target: offset from cake center ~1.8 units right and slightly forward
          sliceWedgeGroupRef.current.position.set(ease * 1.6, -ease * 0.28, ease * 0.5);
          sliceWedgeGroupRef.current.rotation.y = ease * 0.12;

          // Position dessert plate in world space aligned with wedge
          dessertPlateGroupRef.current.scale.set(ease, ease, ease);
          // Estimate world position of wedge tip
          dessertPlateGroupRef.current.position.set(1.6 * Math.cos(rotY) + 0.5 * Math.sin(rotY), -0.28 - rotX * 0.5, -1.6 * Math.sin(rotY) + 0.5 * Math.cos(rotY));

          if (p >= 1.0) {
            sliceAnimActiveRef.current = false;
            if (onSliceFinished) onSliceFinished();
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!container || !renderer || !cameraRef.current) return;
      const w = container.clientWidth || 640, h = container.clientHeight || 420;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  // ── CAMERA PRESETS ───────────────────────────────────────────
  useEffect(() => {
    if (cameraPreset === 'orbit') {
      setIsAutoOrbit(true); isAutoOrbitRef.current = true;
      targetRotationRef.current = { x: 0.3, y: -0.3 };
      targetCameraPosRef.current.set(0, 1.4, 5.0);
    } else if (cameraPreset === 'front') {
      setIsAutoOrbit(false); isAutoOrbitRef.current = false;
      targetRotationRef.current = { x: 0.08, y: 0 };
      targetCameraPosRef.current.set(0, 0.9, 4.6);
    } else if (cameraPreset === 'close') {
      setIsAutoOrbit(false); isAutoOrbitRef.current = false;
      targetRotationRef.current = { x: 0.25, y: 0.22 };
      targetCameraPosRef.current.set(0, 1.0, 3.8);
    } else if (cameraPreset === 'top') {
      setIsAutoOrbit(false); isAutoOrbitRef.current = false;
      targetRotationRef.current = { x: 0.68, y: -0.1 };
      targetCameraPosRef.current.set(0, 2.5, 4.0);
    }
  }, [cameraPreset]);

  // ── CANDLES & SPARKLERS ──────────────────────────────────────
  useEffect(() => {
    flameMeshesRef.current.forEach(m => { m.visible = candlesLit; });
    candlePointLightsRef.current.forEach(l => { l.intensity = candlesLit ? 2.2 : 0; });
    if (sparklerParticlesRef.current) {
      (sparklerParticlesRef.current.material as THREE.PointsMaterial).opacity = sparklersActive ? 0.95 : 0;
    }
    // Move sparkler emitter to above intact/cut cake
    if (sparklerParticlesRef.current) {
      sparklerParticlesRef.current.position.y = isSliced ? -9999 : 1.0;
    }
  }, [candlesLit, sparklersActive, isSliced]);

  // ── STAGE TRANSITIONS ────────────────────────────────────────
  useEffect(() => {
    const knife = knifeGroupRef.current;
    const intactGrp = intactCakeGroupRef.current;
    const cutBody = cutBodyGroupRef.current;
    const sliceWedge = sliceWedgeGroupRef.current;
    const plate = dessertPlateGroupRef.current;

    if (!isSliced && !isCutsceneActive) {
      // ─ Intact or Knife hover ─
      sliceAnimActiveRef.current = false;
      sliceProgressRef.current = 0;
      if (intactGrp) intactGrp.visible = true;
      if (cutBody) cutBody.visible = false;
      if (sliceWedge) { sliceWedge.position.set(0, 0, 0); sliceWedge.rotation.set(0, 0, 0); }
      if (plate) plate.scale.set(0, 0, 0);
      if (knife) {
        knife.position.set(isKnifeDrawn ? 0.3 : 0, isKnifeDrawn ? 1.4 : 4.0, isKnifeDrawn ? 0.4 : 0);
        knife.rotation.set(0, 0, isKnifeDrawn ? -Math.PI / 9 : -Math.PI / 7);
      }
    } else if (isCutsceneActive && !sliceAnimActiveRef.current) {
      // ─ Start slice animation ─
      if (intactGrp) intactGrp.visible = false;
      if (cutBody) cutBody.visible = true;
      if (sliceWedge) { sliceWedge.position.set(0, 0, 0); sliceWedge.rotation.set(0, 0, 0); }
      sliceProgressRef.current = 0;
      sliceAnimActiveRef.current = true;
    } else if (isSliced && !sliceAnimActiveRef.current) {
      // ─ Final sliced state (also triggered after animation finishes) ─
      if (intactGrp) intactGrp.visible = false;
      if (cutBody) cutBody.visible = true;
      if (sliceWedge) { sliceWedge.position.set(1.6, -0.28, 0.5); sliceWedge.rotation.y = 0.12; }
      if (plate) { plate.scale.set(1, 1, 1); }
      if (knife) knife.position.set(2.5, -0.8, 1.4);
    }
  }, [isKnifeDrawn, isCutsceneActive, isSliced]);

  // ── 3D TOPPINGS ──────────────────────────────────────────────
  useEffect(() => {
    const tg = toppingsGroupRef.current;
    if (!tg) return;
    while (tg.children.length > 0) tg.remove(tg.children[0]);
    // Toppings appear above slice wedge (approx world position)
    selectedToppings.forEach((id) => {
      if (id === 'strawberry') {
        const bg = new THREE.Group(); bg.position.set(1.7, 0.2, 0.55);
        const c = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.14, 16), new THREE.MeshStandardMaterial({ color: 0xcc1530, roughness: 0.2 }));
        c.rotation.x = Math.PI; bg.add(c); tg.add(bg);
      } else if (id === 'gold') {
        const gMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.95, roughness: 0.15 });
        for (let i = 0; i < 6; i++) {
          const f = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.05), gMat);
          f.position.set(1.6 + i * 0.06, 0.15, 0.55 + (i % 2) * 0.06);
          f.rotation.x = -Math.PI / 2; tg.add(f);
        }
      } else if (id === 'choco') {
        const tr = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), new THREE.MeshStandardMaterial({ color: 0x240f07, roughness: 0.45 }));
        tr.position.set(1.65, 0.2, 0.6); tg.add(tr);
      } else if (id === 'cherry') {
        const ch = new THREE.Group(); ch.position.set(1.62, 0.2, 0.52);
        ch.add(Object.assign(new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.1, metalness: 0.2 }))));
        tg.add(ch);
      }
    });
  }, [selectedToppings]);

  // ── BITE PROGRESS ────────────────────────────────────────────
  useEffect(() => {
    const sw = sliceWedgeGroupRef.current;
    if (!sw) return;
    const scales = [[1, 1, 1], [0.94, 0.96, 0.94], [0.86, 0.90, 0.86], [0.76, 0.80, 0.76]];
    const s = scales[Math.min(bitesTaken, 3)];
    sw.scale.set(s[0], s[1], s[2]);
  }, [bitesTaken]);

  // ── POINTER EVENTS ───────────────────────────────────────────
  const onPointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    pointerStartPosRef.current = { x: e.clientX, y: e.clientY };
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - previousMousePositionRef.current.x;
    const dy = e.clientY - previousMousePositionRef.current.y;
    targetRotationRef.current.y += dx * 0.008;
    targetRotationRef.current.x = Math.max(-0.15, Math.min(0.65, targetRotationRef.current.x + dy * 0.008));
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    const dist = Math.hypot(e.clientX - pointerStartPosRef.current.x, e.clientY - pointerStartPosRef.current.y);
    if (dist < 6 && onCandleTapped && candlesLit) onCandleTapped();
  };

  const toggleOrbit = () => {
    sound.playNavClick();
    const next = !isAutoOrbit;
    setIsAutoOrbit(next);
    isAutoOrbitRef.current = next;
  };

  return (
    <div className="relative w-full h-[380px] sm:h-[430px] select-none overflow-hidden rounded-3xl border border-[#ffdab9]/30 shadow-2xl bg-[#0f0115]">
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        title="Drag to rotate · Tap candles to blow"
      />

      {/* HUD Overlay */}
      <div className="absolute bottom-3 inset-x-4 flex items-center justify-between pointer-events-none">
        <button
          type="button"
          onClick={toggleOrbit}
          className="pointer-events-auto px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-black/90 text-[#ffdab9] border border-[#ffdab9]/40 text-[11px] font-serif-display font-semibold transition-all cursor-pointer backdrop-blur-md shadow-lg flex items-center gap-1.5 active:scale-95"
        >
          {isAutoOrbit ? '⏸️ Pause Orbit' : '▶️ Auto Orbit'}
        </button>
        <span className="hidden sm:inline text-[11px] text-[#f7e7ce]/85 font-serif-display bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
          {candlesLit ? '🕯️ Tap candles to blow · Drag to rotate' : '🔄 Drag to inspect 360°'}
        </span>
      </div>
    </div>
  );
};
