import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

function WatchModel({ rotation }) {
  const group = useRef();
  const { nodes, materials } = useGLTF('/watch.glb');

  // Smooth rotation blending
  useFrame(() => {
    if (group.current) {
      if (rotation.x === 0 && rotation.y === 0) {
        group.current.rotation.y += 0.002;
      } else {
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, rotation.x * 0.03, 0.1);
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, rotation.y * 0.03, 0.1);
      }
    }
  });

  return (
    <group ref={group} dispose={null} scale={[0.6, 0.6, 0.6]} position={[0, -0.5, 0]}>
      <primitive object={nodes.Scene || nodes.root} />
    </group>
  );
}

export default function Watch3DModel({ rotation, setRotation }) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
        className="rounded-2xl"
      >
        {/* Lighting setup */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <pointLight position={[-3, -3, -2]} intensity={0.4} color="#6366f1" />
        <pointLight position={[3, -3, -2]} intensity={0.4} color="#ec4899" />
        <Environment preset="city" />

        {/* Model */}
        <Suspense fallback={null}>
          <WatchModel rotation={rotation} />
        </Suspense>
      </Canvas>

      {/* Decorative particle overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[25%] left-[30%] w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-[35%] right-[35%] w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-[20%] left-[35%] w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute top-[50%] right-[25%] w-1 h-1 bg-indigo-400 rounded-full animate-pulse opacity-30"></div>

        {/* Tooltip */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 bg-white/70 px-2 py-1 rounded-full opacity-0 hover:opacity-100 transition-opacity">
          Drag to rotate • Scroll to zoom
        </div>
      </div>
    </div>
  );
}

// Preload GLB
useGLTF.preload('/watch.glb');
