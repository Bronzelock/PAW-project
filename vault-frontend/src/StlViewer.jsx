import { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stage, Center } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

function ModelMesh({ url }) {
  const geometry = useLoader(STLLoader, url);

  return (
    <Center>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial color="#38bdf8" roughness={0.4} metalness={0.2} />
      </mesh>
    </Center>
  );
}

export default function StlViewer({ fileUrl }) {
  if (!fileUrl) return null;

  return (
    <div className="w-full h-96 bg-base-300 rounded-lg overflow-hidden relative border border-base-content/10">
      <Canvas shadows camera={{ position: [0, 0, 100], fov: 50 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6} adjustCamera={1.2}>
            <ModelMesh url={fileUrl} />
          </Stage>
        </Suspense>
        <OrbitControls makeDefault autoRotate autoRotateSpeed={1.5} />
      </Canvas>
      
      <div className="absolute bottom-2 left-3 text-xs opacity-60 pointer-events-none">
        LPM: Obracanie | Scroll: Zoom | PPM: Przesuwanie
      </div>
    </div>
  );
}