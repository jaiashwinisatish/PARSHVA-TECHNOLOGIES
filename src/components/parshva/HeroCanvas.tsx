import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, OrbitControls } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// Vertices for the outer system topology cube
const vertices: [number, number, number][] = [
  [-0.8, -0.8, -0.8],
  [0.8, -0.8, -0.8],
  [0.8, 0.8, -0.8],
  [-0.8, 0.8, -0.8],
  [-0.8, -0.8, 0.8],
  [0.8, -0.8, 0.8],
  [0.8, 0.8, 0.8],
  [-0.8, 0.8, 0.8],
];

function SoftwareEngine() {
  const outerGroupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  // References for orbiting data packets
  const p1Ref = useRef<THREE.Mesh>(null);
  const p2Ref = useRef<THREE.Mesh>(null);
  const p3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Slow engine spin & mouse follow parallax
    if (outerGroupRef.current) {
      outerGroupRef.current.rotation.y = time * 0.1;
      outerGroupRef.current.rotation.x = time * 0.05;

      outerGroupRef.current.rotation.y +=
        (state.pointer.x * 0.3 - outerGroupRef.current.rotation.y) * 0.05;
      outerGroupRef.current.rotation.x +=
        (-state.pointer.y * 0.3 - outerGroupRef.current.rotation.x) * 0.05;
    }

    // Core glass pulsation
    if (coreRef.current) {
      const scale = 1 + Math.sin(time * 1.5) * 0.04;
      coreRef.current.scale.set(scale, scale, scale);
      coreRef.current.rotation.y = -time * 0.15;
    }

    // Inner gold logic box counter rotation
    if (innerRef.current) {
      innerRef.current.rotation.x = -time * 0.4;
      innerRef.current.rotation.y = time * 0.3;
    }

    // Orbiting data packets calculation
    const orbitRadius = 1.35;
    if (p1Ref.current) {
      const a = time * 0.6;
      p1Ref.current.position.set(
        Math.cos(a) * orbitRadius,
        Math.sin(a * 0.5) * 0.3,
        Math.sin(a) * orbitRadius,
      );
    }
    if (p2Ref.current) {
      const a = time * 0.6 + (Math.PI * 2) / 3;
      p2Ref.current.position.set(
        Math.cos(a) * orbitRadius,
        Math.sin(a * 0.5) * 0.3,
        Math.sin(a) * orbitRadius,
      );
    }
    if (p3Ref.current) {
      const a = time * 0.6 + (Math.PI * 4) / 3;
      p3Ref.current.position.set(
        Math.cos(a) * orbitRadius,
        Math.sin(a * 0.5) * 0.3,
        Math.sin(a) * orbitRadius,
      );
    }
  });

  return (
    <group ref={outerGroupRef}>
      {/* 1. Outer Network Cube Structure */}
      <mesh>
        <boxGeometry args={[1.6, 1.6, 1.6]} />
        <meshBasicMaterial wireframe color="oklch(0.72 0.08 80 / 12%)" transparent opacity={0.3} />
      </mesh>

      {/* 2. System Nodes (Vertices) */}
      {vertices.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#C8A46A" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* 3. Central Core Glass sphere (Data Core) */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.55, 64, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.4}
          chromaticAberration={0.06}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.1}
          temporalDistortion={0.04}
          roughness={0.05}
          transmission={0.95}
          ior={1.15}
          color="oklch(0.99 0.005 80)"
        />
      </mesh>

      {/* 4. Glowing Gold System Core (Core Engine) */}
      <mesh ref={innerRef}>
        <boxGeometry args={[0.22, 0.22, 0.22]} />
        <meshStandardMaterial
          color="#C8A46A"
          metalness={0.95}
          roughness={0.1}
          emissive="#C8A46A"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* 5. Orbiting Data Packets */}
      <mesh ref={p1Ref}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshBasicMaterial color="#C8A46A" />
      </mesh>
      <mesh ref={p2Ref}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshBasicMaterial color="oklch(0.55 0.05 80)" />
      </mesh>
      <mesh ref={p3Ref}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshBasicMaterial color="oklch(0.19 0 0 / 60%)" />
      </mesh>
    </group>
  );
}

export default function HeroCanvas() {
  return (
    <div className="h-full w-full select-none cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 3.8], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1.1} />
        <directionalLight position={[6, 8, 6]} intensity={1.4} />
        <pointLight position={[-6, -8, -6]} intensity={0.6} color="#C8A46A" />
        <spotLight position={[3, 6, 3]} angle={0.3} penumbra={1} intensity={1.2} />

        <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
          <SoftwareEngine />
        </Float>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
