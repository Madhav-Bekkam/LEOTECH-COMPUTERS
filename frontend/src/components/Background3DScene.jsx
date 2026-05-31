import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const RotatingWireframe = ({ position, color, scale, speed }) => {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.rotation.x = state.clock.elapsedTime * speed;
    meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.8;
  });
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2} position={position}>
      <mesh ref={meshRef} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color={color} wireframe wireframeLinewidth={2} transparent opacity={0.3} />
      </mesh>
    </Float>
  );
};

const CursorTracker = ({ children }) => {
  const groupRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Smooth parallax position shift
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, mouse.current.x * 3, 0.05);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, mouse.current.y * 3, 0.05);
      
      // Slight 3D rotation based on cursor
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.current.y * 0.2, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, -mouse.current.x * 0.2, 0.05);
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

export const Background3DScene = () => {
  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        {/* Cinematic Colored Lighting */}
        <pointLight position={[-10, -10, -10]} intensity={2} color="#00C2FF" />
        <pointLight position={[10, 10, 10]} intensity={2} color="#8B5CF6" />

        {/* Deep Space Starfield tracking the cursor - OPTIMIZED */}
        <CursorTracker>
          <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
        </CursorTracker>

        {/* Floating Abstract Tech Geometries (Stationary) */}
        <RotatingWireframe position={[-6, 3, -5]} color="#00C2FF" scale={2} speed={0.2} />
        <RotatingWireframe position={[6, -3, -8]} color="#8B5CF6" scale={2.5} speed={0.15} />
        <RotatingWireframe position={[0, -6, -12]} color="#10B981" scale={3} speed={0.1} />

        {/* Central Morphing Liquid Core (Stationary) - OPTIMIZED GEOMETRY */}
        <Float speed={2} rotationIntensity={1} floatIntensity={1} position={[0, 0, -15]}>
          <Sphere args={[5, 32, 32]}>
            <MeshDistortMaterial 
              color="#0A0F1E" 
              envMapIntensity={0.5} 
              clearcoat={1} 
              clearcoatRoughness={0} 
              metalness={0.9} 
              roughness={0.1} 
              distort={0.4} 
              speed={2} 
              emissive="#00C2FF" 
              emissiveIntensity={0.15} 
            />
          </Sphere>
        </Float>
      </Canvas>
    </div>
  );
};
