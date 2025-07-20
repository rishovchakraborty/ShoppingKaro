import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

function WatchModel({ rotation, setRotation }) {
  const group = useRef();
  const { nodes, materials } = useGLTF('/watch.glb');

  // Error handling for model loading
  if (!nodes) {
    return null; // Return nothing instead of a visible fallback
  }

  // Direct rotation based on mouse position
  useFrame((state) => {
    if (group.current) {
      // Only auto-rotate when no mouse interaction
      if (rotation.x === 0 && rotation.y === 0) {
        group.current.rotation.y += 0.002;
      } else {
        // Direct rotation without lerp for immediate response
        group.current.rotation.x = rotation.x * 0.03;
        group.current.rotation.y = rotation.y * 0.03;
      }
    }
  });

  return (
    <group ref={group} dispose={null}>
      {/* Apply the model */}
      <primitive object={nodes.Scene || nodes.root} />
    </group>
  );
}

export default function Watch3DModel({ rotation, setRotation }) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
        className="rounded-2xl"
      >
        {/* Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[8, 8, 4]} intensity={1.2} castShadow />
        <pointLight position={[-8, -8, -4]} intensity={0.6} color="#6366f1" />
        <pointLight position={[8, -8, -4]} intensity={0.6} color="#ec4899" />
        <pointLight position={[0, 8, 2]} intensity={0.4} color="#ffffff" />
        
        {/* Environment for reflections */}
        <Environment preset="city" />
        
        {/* 3D Model */}
        <Suspense fallback={null}>
          <WatchModel rotation={rotation} setRotation={setRotation} />
        </Suspense>
        
        {/* No controls - we handle rotation manually */}
      </Canvas>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-indigo-400 rounded-full animate-pulse opacity-30"></div>
        
        {/* Interactive hint */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-full opacity-0 hover:opacity-100 transition-opacity">
          Drag to rotate • Scroll to zoom
        </div>
      </div>
    </div>
  );
}

// Preload the model
useGLTF.preload('/watch.glb'); 