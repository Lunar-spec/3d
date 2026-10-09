"use client";
import HomePage from "./Home";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { Environment, Sparkles, Stars, useGLTF } from "@react-three/drei";
// import { ArrowDown, ArrowUpRight, Menu } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import * as THREE from "three";

// function OrganicObject({
//   progress,
// }: {
//   progress: React.MutableRefObject<number>;
// }) {
//   const object = useRef<THREE.Group>(null);
//   const ring = useRef<THREE.Group>(null);
//   const light = useRef<THREE.PointLight>(null);
//   const modelScale = useRef(1);
//   const modelOffset = useRef(new THREE.Vector3());
//   const { scene } = useGLTF("/venus.glb");
//   const focusStops = [
//     { at: 0, cameraZ: 7.2, lookY: 0.15, x: 0, y: 0, scale: 1 },
//     { at: 0.25, cameraZ: 7.4, lookY: 0, x: 0.45, y: 0.05, scale: 0.84 },
//     { at: 0.5, cameraZ: 5.4, lookY: 0.7, x: 0, y: -0.3, scale: 1.35 },
//     { at: 0.75, cameraZ: 7.6, lookY: -0.1, x: -0.5, y: 0.2, scale: 0.78 },
//     { at: 1, cameraZ: 5.7, lookY: 0.8, x: 0, y: 0.1, scale: 1.25 },
//   ];

//   useEffect(() => {
//     const bounds = new THREE.Box3().setFromObject(scene);
//     const size = bounds.getSize(new THREE.Vector3());
//     const normalizedScale = 8.5 / Math.max(size.x, size.y, size.z);
//     modelScale.current = normalizedScale;
//     modelOffset.current
//       .copy(bounds.getCenter(new THREE.Vector3()))
//       .multiplyScalar(-normalizedScale);
//     modelOffset.current.x -= 1;
//     modelOffset.current.y -= 2.3;
//     scene.traverse((child) => {
//       if (!(child instanceof THREE.Mesh)) return;
//       child.castShadow = true;
//       child.receiveShadow = false;
//       child.frustumCulled = false;
//       child.visible = true;
//       child.material = new THREE.MeshStandardMaterial({
//         color: "#45453f",
//         emissive: "#070706",
//         emissiveIntensity: 0.1,
//         roughness: 0.78,
//         metalness: 0.08,
//         side: THREE.DoubleSide,
//       });
//     });
//   }, [scene]);

//   useFrame(({ clock, camera }) => {
//     const time = clock.getElapsedTime();
//     const scroll = progress.current;
//     const idleDrift = Math.sin(time * 0.42) * 0.22;
//     const stopIndex = Math.min(
//       focusStops.length - 2,
//       Math.floor(scroll * (focusStops.length - 1)),
//     );
//     const from = focusStops[stopIndex];
//     const to = focusStops[stopIndex + 1];
//     const localProgress = scroll * (focusStops.length - 1) - stopIndex;
//     const focus = {
//       cameraZ: THREE.MathUtils.lerp(from.cameraZ, to.cameraZ, localProgress),
//       lookY: THREE.MathUtils.lerp(from.lookY, to.lookY, localProgress),
//       x: THREE.MathUtils.lerp(from.x, to.x, localProgress),
//       y: THREE.MathUtils.lerp(from.y, to.y, localProgress),
//       scale: THREE.MathUtils.lerp(from.scale, to.scale, localProgress),
//     };
//     if (object.current) {
//       object.current.rotation.x =
//         0.18 + Math.sin(time * 0.3) * 0.05 + scroll * 0.08;
//       object.current.rotation.y =
//         -0.55 + Math.sin(time * 0.34) * 0.08 + scroll * 0.18;
//       object.current.rotation.z =
//         -0.04 + Math.sin(time * 0.2) * 0.04 + scroll * 0.08;
//       object.current.position.y =
//         modelOffset.current.y + focus.y + Math.sin(time * 0.55) * 0.18;
//       object.current.position.x = modelOffset.current.x + focus.x + idleDrift;
//       object.current.position.z =
//         modelOffset.current.z + Math.cos(time * 0.28) * 0.12;
//       object.current.scale.setScalar(
//         modelScale.current * focus.scale * (1.2 + Math.sin(time * 0.7) * 0.035),
//       );
//     }
//     if (ring.current && object.current) {
//       ring.current.position.set(
//         object.current.position.x,
//         object.current.position.y + 0.1,
//         object.current.position.z - 0.28,
//       );
//       ring.current.rotation.z = -time * 0.08 + Math.sin(time * 0.3) * 0.12;
//       ring.current.scale.setScalar(1 + Math.sin(time * 0.4) * 0.025);
//     }
//     if (light.current && ring.current) {
//       light.current.position.set(
//         ring.current.position.x,
//         ring.current.position.y + 0.05,
//         ring.current.position.z - 0.5,
//       );
//     }
//     camera.position.x = THREE.MathUtils.lerp(
//       camera.position.x,
//       focus.x * 0.35,
//       0.035,
//     );
//     camera.position.y = THREE.MathUtils.lerp(
//       camera.position.y,
//       focus.lookY * 0.18,
//       0.035,
//     );
//     camera.position.z = THREE.MathUtils.lerp(
//       camera.position.z,
//       focus.cameraZ,
//       0.035,
//     );
//     camera.lookAt(0, focus.lookY, 0);
//   });

//   return (
//     <group>
//       <group ref={object}>
//         <primitive object={scene} />
//       </group>
//       <group ref={ring}>
//         <mesh>
//           <torusGeometry args={[2.25, 0.07, 16, 160]} />
//           <meshBasicMaterial color="#fffef4" toneMapped={false} />
//         </mesh>
//         <mesh>
//           <torusGeometry args={[2.25, 0.16, 16, 160]} />
//           <meshBasicMaterial
//             color="#fffef4"
//             transparent
//             opacity={0.12}
//             toneMapped={false}
//           />
//         </mesh>
//       </group>
//       <pointLight
//         ref={light}
//         castShadow
//         color="#fffef4"
//         intensity={30}
//         distance={8}
//         shadow-bias={-0.0001}
//       />
//       <pointLight
//         color="#5f71ff"
//         intensity={2.2}
//         distance={7}
//         position={[1.5, 0.8, 4]}
//       />
//       <pointLight
//         color="#6c74b0"
//         intensity={2.5}
//         distance={9}
//         position={[-3, -2, 2]}
//       />
//     </group>
//   );
// }

// useGLTF.preload("/venus.glb");

// function Scene({ progress }: { progress: React.MutableRefObject<number> }) {
//   return (
//     <Canvas
//       shadows="basic"
//       className="webgl-canvas"
//       dpr={[1, 1.6]}
//       camera={{ position: [0, 0, 7.2], fov: 42 }}
//       gl={{ antialias: true, alpha: true }}
//     >
//       <color attach="background" args={["#111217"]} />
//       <fog attach="fog" args={["#111217", 6, 15]} />
//       <ambientLight intensity={0.18} />
//       <OrganicObject progress={progress} />
//       <Sparkles
//         count={90}
//         scale={[12, 9, 9]}
//         size={1.3}
//         speed={0.22}
//         color="#eaffbf"
//         noise={1.8}
//       />
//       <Stars
//         radius={15}
//         depth={10}
//         count={800}
//         factor={1.2}
//         saturation={0.2}
//         fade
//         speed={0.3}
//       />
//       <Environment preset="night" />
//     </Canvas>
//   );
// }

// const projects = [
//   ["01", "Morrow House", "Identity / digital experience"],
//   ["02", "Noma Objects", "E-commerce / 3D direction"],
//   ["03", "Aperture Studies", "WebGL / experiment"],
// ];

// const sectionIds = ["top", "work", "about", "contact"];

// export default function Home() {
//   const progress = useRef(0);
//   const snapTimer = useRef<number | null>(null);
//   const isSnapping = useRef(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [activeSection, setActiveSection] = useState(0);

//   useEffect(() => {
//     const updateScroll = () => {
//       const max = document.documentElement.scrollHeight - window.innerHeight;
//       progress.current = max > 0 ? window.scrollY / max : 0;
//       const activeIndex = sectionIds.reduce((closestIndex, id, index) => {
//         const element = document.getElementById(id);
//         const closest = document.getElementById(sectionIds[closestIndex]);
//         if (!element || !closest) return closestIndex;
//         return Math.abs(element.getBoundingClientRect().top) <
//           Math.abs(closest.getBoundingClientRect().top)
//           ? index
//           : closestIndex;
//       }, 0);
//       setActiveSection(activeIndex);
//     };
//     updateScroll();
//     const handleScroll = () => {
//       updateScroll();
//       if (isSnapping.current) return;
//       if (snapTimer.current) window.clearTimeout(snapTimer.current);
//       snapTimer.current = window.setTimeout(() => {
//         const targets = [
//           ...document.querySelectorAll<HTMLElement>("[data-snap-section]"),
//         ];
//         const nearest = targets.reduce(
//           (closest, element) =>
//             Math.abs(element.offsetTop - window.scrollY) <
//             Math.abs(closest - window.scrollY)
//               ? element.offsetTop
//               : closest,
//           0,
//         );
//         if (Math.abs(nearest - window.scrollY) > 2) {
//           isSnapping.current = true;
//           window.scrollTo({ top: nearest, behavior: "smooth" });
//           window.setTimeout(() => {
//             isSnapping.current = false;
//             updateScroll();
//           }, 700);
//         }
//       }, 180);
//     };
//     window.addEventListener("scroll", handleScroll, { passive: true });
//     window.addEventListener("resize", updateScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       window.removeEventListener("resize", updateScroll);
//       if (snapTimer.current) window.clearTimeout(snapTimer.current);
//     };
//   }, []);

//   return (
//     <main className="portfolio-shell">
//       <div className="scene-layer" aria-hidden="true">
//         <Scene progress={progress} />
//       </div>
//       <div className="grid-lines" aria-hidden="true">
//         {Array.from({ length: 6 }, (_, index) => (
//           <span key={index} />
//         ))}
//       </div>
//       <header className="site-header">
//         <a className="brand" href="#top" aria-label="Sol Studio home">
//           <span>sol</span>
//           <i>.</i>
//           <small>studio</small>
//         </a>
//         <nav className={menuOpen ? "site-nav is-open" : "site-nav"}>
//           <a href="#work" onClick={() => setMenuOpen(false)}>
//             Work
//           </a>
//           <a href="#about" onClick={() => setMenuOpen(false)}>
//             About
//           </a>
//           <a href="#contact" onClick={() => setMenuOpen(false)}>
//             Contact
//           </a>
//         </nav>
//         <button
//           className="menu-toggle"
//           onClick={() => setMenuOpen(!menuOpen)}
//           aria-label="Toggle navigation"
//         >
//           <Menu size={19} />
//         </button>
//       </header>

//       <aside className="section-rail" aria-label="Page position">
//         <div className="position-readout">
//           <strong>0{activeSection + 1}</strong>
//           <span>/ 04</span>
//         </div>
//         <nav>
//           {sectionIds.map((id, index) => (
//             <a
//               className={activeSection === index ? "is-active" : ""}
//               href={`#${id}`}
//               key={id}
//               aria-label={`Go to section ${index + 1}`}
//             >
//               <span />
//             </a>
//           ))}
//         </nav>
//       </aside>

//       <div className="scroll-mark">
//         <span /> <span>Scroll to explore</span>
//       </div>
//       <section id="top" data-snap-section className="hero-screen">
//         <div className="hero-content">
//           <p className="eyebrow">
//             <span className="eyebrow-dot" /> Independent digital studio / 2026
//           </p>
//           <h1>
//             Make it
//             <br />
//             <em>feel</em> alive.
//           </h1>
//           <p className="hero-summary">
//             We create identities and digital worlds for people shaping what
//             comes next.
//           </p>
//           <a
//             className="round-link"
//             href="#work"
//             aria-label="Explore selected work"
//           >
//             <ArrowDown size={18} />
//           </a>
//         </div>
//         <div className="hero-meta">
//           <span>Selected work</span>
//           <span>01 — 03</span>
//         </div>
//       </section>

//       <section
//         id="work"
//         data-snap-section
//         className="content-section work-section"
//       >
//         <div className="section-intro">
//           <span className="section-number">( 01 )</span>
//           <p>
//             Selected
//             <br />
//             <em>work</em>
//           </p>
//           <span className="section-note">
//             The object changes
//             <br />
//             as you move through it.
//           </span>
//         </div>
//         <div className="project-list">
//           {projects.map(([number, title, type]) => (
//             <a className="project-item" href="#contact" key={number}>
//               <span>{number}</span>
//               <strong>{title}</strong>
//               <small>{type}</small>
//               <ArrowUpRight size={18} />
//             </a>
//           ))}
//         </div>
//       </section>

//       <section
//         id="about"
//         data-snap-section
//         className="content-section statement-section"
//       >
//         <span className="section-number">( 02 )</span>
//         <div>
//           <p>
//             Digital work with a pulse. <em>Less noise, more feeling.</em>
//           </p>
//           <span className="section-note">
//             Strategy, art direction, design
//             <br />
//             and technology in one studio.
//           </span>
//         </div>
//       </section>

//       <section data-snap-section className="closing-section">
//         <span className="section-number">
//           ( 03 ) / Let&apos;s work together
//         </span>
//         <h2>
//           Something
//           <br />
//           <em>alive.</em>
//         </h2>
//         <a className="contact-link" href="mailto:hello@sol.studio">
//           hello@sol.studio <ArrowUpRight size={18} />
//         </a>
//       </section>
//       <footer id="contact" data-snap-section className="site-footer">
//         <span>Sol studio / digital matter</span>
//         <span>© 2026 / Made with intent</span>
//       </footer>
//     </main>
//   );
// }

export default function Home() {
  return <HomePage />;
}
