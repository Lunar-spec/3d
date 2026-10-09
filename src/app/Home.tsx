import { Environment, Sparkles, Stars, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function OrganicObject({
  progress,
}: {
  progress: React.MutableRefObject<number>;
}) {
  const model = useRef<THREE.Group>(null);

  const cameraPosition = useRef(new THREE.Vector3(0, 0, 9));
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0));
  const cameraPositionTarget = useRef(new THREE.Vector3());
  const cameraLookTarget = useRef(new THREE.Vector3());
  const bodyTargets = useRef({
    head: new THREE.Vector3(),
    chest: new THREE.Vector3(),
    waist: new THREE.Vector3(),
    lowerBody: new THREE.Vector3(),
  });

  const { scene } = useGLTF("/venus.glb");

  // const cameraStops = [
  //   // 0% — Full body
  //   {
  //     at: 0,
  //     position: [0, 0, 9],
  //     target: [0, 0, 0],
  //   },

  //   // 15% — Upper body
  //   {
  //     at: 0.15,
  //     position: [2.8, 0.5, 5.2],
  //     target: [0, 0.8, 0],
  //   },

  //   // 30% — Chest
  //   {
  //     at: 0.3,
  //     position: [1.5, 0.6, 2.8],
  //     target: [0, 0.5, 0],
  //   },

  //   // 45% — Torso close-up
  //   {
  //     at: 0.45,
  //     position: [0.8, 0.2, 1.6],
  //     target: [0, 0.2, 0],
  //   },

  //   // 60% — Waist / lower body
  //   {
  //     at: 0.6,
  //     position: [-2.4, -0.4, 3.2],
  //     target: [0, -0.5, 0],
  //   },

  //   // 75% — Move back toward upper body
  //   {
  //     at: 0.75,
  //     position: [-1.4, 0.8, 2.2],
  //     target: [0, 0.7, 0],
  //   },

  //   // 88% — Face / head close-up
  //   {
  //     at: 0.88,
  //     position: [0.4, 0.9, 0.9],
  //     target: [0, 1.1, 0],
  //   },

  //   // 100% — Pull back
  //   {
  //     at: 1,
  //     position: [0, 1, 6],
  //     target: [0, 0, 0],
  //   },
  // ];
  const cameraStops = [
    // 0 — UPPER BODY WITH FACE
    {
      at: 0,
      position: [0.1, 1.25, 2],
      target: [0.25, 1.8, 0],
    },

    // 1 — CLOSE UP ON FACE RIGHT SIDE
    {
      at: 0.25,
      position: [2.15, 2.25, 0.2],
      target: [0, 1.95, 0.8],
    },

    // 2 — UPPER BODY
    {
      at: 0.5,
      position: [1.4, 0.2, 1.5],
      target: [0, 0.1, 0],
    },

    // 3 — FULL BODY FAR
    {
      at: 0.75,
      position: [1.2, 0.2, 2.5],
      target: [0, 0.5, 0.6],
    },

    // 4 — FACE FROM LEFT SIDE TILTED VENUS ON LEFT
    {
      at: 1,
      position: [-1.9, 1.25, 2.35],
      target: [1.25, 1.5, 0.5],
    },
  ];
  useEffect(() => {
    // Get actual GLB bounds
    const bounds = new THREE.Box3().setFromObject(scene);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());

    // Normalize the model
    const maxDimension = Math.max(size.x, size.y, size.z);
    const scale = 5 / maxDimension;

    const normalizedHeight = size.y * scale;

    bodyTargets.current.head.set(0, normalizedHeight * 0.3, 0);

    bodyTargets.current.chest.set(0, normalizedHeight * 0.1, 0);

    bodyTargets.current.waist.set(0, normalizedHeight * -0.1, 0);

    bodyTargets.current.lowerBody.set(0, normalizedHeight * -0.3, 0);

    // Transform wrapper, NOT the GLB
    if (model.current) {
      model.current.scale.setScalar(scale);

      model.current.position.set(
        -center.x * scale,
        -center.y * scale,
        -center.z * scale,
      );
    }

    // Model material
    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      child.visible = true;
      child.frustumCulled = false;
      child.castShadow = true;
      child.receiveShadow = true;

      child.material = new THREE.MeshStandardMaterial({
        color: "#131313",
        emissive: "#020202",
        emissiveIntensity: 0.8,
        roughness: 0.35,
        metalness: 0.04,
        side: THREE.DoubleSide,
      });
    });

    console.log("NORMALIZED HEIGHT:", size.y * scale);

    console.log(
      "NORMALIZED CENTER:",
      center.clone().multiplyScalar(scale).toArray(),
    );

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const box = new THREE.Box3().setFromObject(child);
      const childCenter = box.getCenter(new THREE.Vector3());
      const childSize = box.getSize(new THREE.Vector3());

      console.log("MESH:", child.name);
      console.log("CENTER:", childCenter.toArray());
      console.log("SIZE:", childSize.toArray());
    });
  }, [scene]);

  useFrame(({ camera }) => {
    const scroll = progress.current;

    // const segment = Math.min(
    //   cameraStops.length - 2,
    //   Math.floor(scroll * (cameraStops.length - 1)),
    // );

    // const from = cameraStops[segment];
    // const to = cameraStops[segment + 1];

    // let localProgress = scroll * (cameraStops.length - 1) - segment;

    let segment = 0;

    for (let i = 0; i < cameraStops.length - 1; i++) {
      if (scroll >= cameraStops[i].at && scroll <= cameraStops[i + 1].at) {
        segment = i;
        break;
      }
    }

    const from = cameraStops[segment];
    const to = cameraStops[segment + 1];

    let localProgress = (scroll - from.at) / (to.at - from.at);

    localProgress = THREE.MathUtils.clamp(localProgress, 0, 1);

    localProgress = THREE.MathUtils.smootherstep(localProgress, 0, 1);

    cameraPositionTarget.current.set(
      THREE.MathUtils.lerp(from.position[0], to.position[0], localProgress),
      THREE.MathUtils.lerp(from.position[1], to.position[1], localProgress),
      THREE.MathUtils.lerp(from.position[2], to.position[2], localProgress),
    );

    cameraLookTarget.current.set(
      THREE.MathUtils.lerp(from.target[0], to.target[0], localProgress),
      THREE.MathUtils.lerp(from.target[1], to.target[1], localProgress),
      THREE.MathUtils.lerp(from.target[2], to.target[2], localProgress),
    );

    cameraPosition.current.lerp(cameraPositionTarget.current, 0.08);

    cameraTarget.current.lerp(cameraLookTarget.current, 0.08);

    camera.position.copy(cameraPosition.current);

    camera.lookAt(cameraTarget.current);
  });

  const ringPosition: [number, number, number] = [0, 1.3, -1.2];

  return (
    <>
      <group ref={model}>
        <primitive object={scene} />
      </group>
      {/* VERY SOFT BASE LIGHT */}
      <ambientLight intensity={0.28} />

      {/* FRONT KEY — illuminates face/chest */}
      <pointLight
        color="#ffffff"
        intensity={12}
        distance={8}
        decay={2}
        position={[0, 2.2, 4]}
      />

      {/* FRONT LEFT — face + left shoulder */}
      <pointLight
        color="#ffffff"
        intensity={10}
        distance={7}
        decay={2}
        position={[-3, 2.5, 2]}
      />

      {/* FRONT RIGHT — face + right shoulder */}
      <pointLight
        color="#ffffff"
        intensity={10}
        distance={7}
        decay={2}
        position={[3, 2.2, 2]}
      />

      {/* TOP FRONT — forehead + hair */}
      <pointLight
        color="#ffffff"
        intensity={13}
        distance={8}
        decay={2}
        position={[0, 5, 2]}
      />

      {/* LEFT SIDE — silhouette + hair */}
      <pointLight
        color="#ffffff"
        intensity={9}
        distance={7}
        decay={2}
        position={[-4, 2, 0]}
      />

      {/* RIGHT SIDE — silhouette + shoulder */}
      <pointLight
        color="#ffffff"
        intensity={9}
        distance={7}
        decay={2}
        position={[4, 2, 0]}
      />

      {/* BACK LEFT RIM */}
      <pointLight
        color="#ffffff"
        intensity={12}
        distance={8}
        decay={2}
        position={[-3, 3, -3]}
      />

      {/* BACK RIGHT RIM */}
      <pointLight
        color="#ffffff"
        intensity={12}
        distance={8}
        decay={2}
        position={[3, 3, -3]}
      />

      {/* TOP BACK — hair/shoulder separation */}
      <pointLight
        color="#ffffff"
        intensity={10}
        distance={8}
        decay={2}
        position={[0, 5, -2]}
      />

      {/* BRIGHT RING */}
      <mesh position={ringPosition}>
        <torusGeometry args={[1.5, 0.075, 32, 128]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={1}
          toneMapped={false}
        />
      </mesh>

      {/* RING HALO */}
      <mesh position={ringPosition}>
        <torusGeometry args={[1.5, 0.12, 32, 128]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}

function Scene({ progress }: { progress: React.MutableRefObject<number> }) {
  return (
    <Canvas
      className="webgl-canvas"
      camera={{
        position: [0, 1.1, 0.7],
        fov: 38,
        near: 0.1,
        far: 1000,
      }}
      dpr={[1, 1.6]}
      gl={{
        antialias: true,
        alpha: true,
        toneMappingExposure: 1.15,
      }}
    >
      <OrganicObject progress={progress} />
    </Canvas>
  );
}

function ContentLayer({
  activeScene,
}: {
  activeScene: number;
}) {
  const content = [
    {
      number: "01",
      title: "VENUS",
      description: "The beginning.",
    },
    {
      number: "02",
      title: "FORM",
      description: "Shape, movement and silence.",
    },
    {
      number: "03",
      title: "DETAIL",
      description: "A closer look.",
    },
    {
      number: "04",
      title: "THE BODY",
      description: "Every curve tells a story.",
    },
    {
      number: "05",
      title: "VENUS",
      description: "Seen from another angle.",
    },
  ];

  const item = content[activeScene];

  return (
    <div className="content-layer">
      <div
        key={activeScene}
        className={`content content-${activeScene + 1} is-active`}
      >
        <span className="eyebrow">{item.number}</span>

        {activeScene === 0 ? (
          <h1>{item.title}</h1>
        ) : (
          <h2>{item.title}</h2>
        )}

        <p>{item.description}</p>
      </div>
    </div>
  );
}

function PageIndicator({
  activeScene,
}: {
  activeScene: number;
}) {
  return (
    <div className="page-indicator" aria-hidden="true">
      <div className="page-indicator-items">
        {[0, 1, 2, 3, 4].map((index) => (
          <span
            key={index}
            className={`page-indicator-item ${
              activeScene === index ? "active" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}

const Home = () => {
  const progress = useRef(0);

  const currentScene = useRef(0);
  const isSnapping = useRef(false);

  const [activeScene, setActiveScene] = useState(0);

  const sceneProgress = [0, 0.25, 0.5, 0.75, 1];

  useEffect(() => {
    const updateProgress = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      const scrollProgress =
        maxScroll > 0 ? window.scrollY / maxScroll : 0;

      progress.current = THREE.MathUtils.clamp(
        scrollProgress,
        0,
        1
      );
    };

    window.addEventListener("scroll", updateProgress, {
      passive: true,
    });

    updateProgress();

    return () => {
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  useEffect(() => {
    let settleFrame = 0;

    const snapToScene = (sceneIndex: number) => {
      if (isSnapping.current) return;

      const clampedScene = THREE.MathUtils.clamp(
        sceneIndex,
        0,
        sceneProgress.length - 1
      );

      if (clampedScene === currentScene.current) {
        return;
      }

      currentScene.current = clampedScene;
      isSnapping.current = true;

      const maxScroll =
        document.documentElement.scrollHeight -
        window.innerHeight;

      const targetScroll =
        maxScroll * sceneProgress[clampedScene];

      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });

      const checkSettled = () => {
        const distance = Math.abs(
          window.scrollY - targetScroll
        );

        if (distance < 2) {
          progress.current = sceneProgress[clampedScene];

          isSnapping.current = false;

          // Text appears only after camera has reached
          // the new scene.
          setActiveScene(clampedScene);

          return;
        }

        settleFrame = requestAnimationFrame(checkSettled);
      };

      settleFrame = requestAnimationFrame(checkSettled);
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      if (isSnapping.current) {
        return;
      }

      if (Math.abs(event.deltaY) < 5) {
        return;
      }

      if (event.deltaY > 0) {
        snapToScene(currentScene.current + 1);
      } else {
        snapToScene(currentScene.current - 1);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        event.key === " "
      ) {
        event.preventDefault();

        snapToScene(currentScene.current + 1);
      }

      if (
        event.key === "ArrowUp" ||
        event.key === "PageUp"
      ) {
        event.preventDefault();

        snapToScene(currentScene.current - 1);
      }
    };

    window.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(settleFrame);

      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <main className="experience">
      <div className="scene-layer">
        <Scene progress={progress} />
      </div>

      <div className="grid-layer" aria-hidden="true">
        <span className="grid-line grid-line-1" />
        <span className="grid-line grid-line-2" />
        <span className="grid-line grid-line-3" />
        <span className="grid-line grid-line-4" />
        <span className="grid-line grid-line-5" />
      </div>

      <PageIndicator activeScene={activeScene} />

      <ContentLayer activeScene={activeScene} />

      <div className="scroll-spacer" />
    </main>
  );
};

export default Home;
