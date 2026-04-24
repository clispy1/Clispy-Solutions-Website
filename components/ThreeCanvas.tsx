'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeCanvas({ speedMult = 1, geomType = 'torus' }: { speedMult?: number, geomType?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
    camera.position.set(0, 0, 6);

    let solidMesh: THREE.Mesh;
    let wireMesh: THREE.Mesh;

    function makeGeometry(t: string) {
      switch (t) {
        case 'icosahedron': return new THREE.IcosahedronGeometry(1.8, 1);
        case 'octahedron': return new THREE.OctahedronGeometry(2.0, 0);
        case 'sphere': return new THREE.IcosahedronGeometry(1.8, 4);
        default: return new THREE.TorusKnotGeometry(1.5, 0.55, 150, 24, 2, 3);
      }
    }

    const geo = makeGeometry(geomType);
    const solidMat = new THREE.MeshPhongMaterial({ color: 0x818cf8, emissive: 0x4f46e5, specular: 0xffffff, shininess: 150, transparent: false });
    const wireMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.3 });
    solidMesh = new THREE.Mesh(geo, solidMat);
    wireMesh = new THREE.Mesh(geo, wireMat);
    solidMesh.add(wireMesh);
    solidMesh.position.set(2.5, 0, 1); // moved forward and slightly more left
    scene.add(solidMesh);

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const pl1 = new THREE.PointLight(0xa855f7, 10, 40);
    pl1.position.set(5, 3, 5);
    scene.add(pl1);
    const pl2 = new THREE.PointLight(0x06b6d4, 8, 40);
    pl2.position.set(-5, -3, 3);
    scene.add(pl2);

    const pgeo = new THREE.BufferGeometry();
    const pts = new Float32Array(200 * 3);
    const clrs = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      pts[i * 3] = (Math.random() - 0.5) * 30;
      pts[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pts[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
      const a = Math.random() > 0.7;
      clrs[i * 3] = a ? 0.85 : 0.15;
      clrs[i * 3 + 1] = a ? 0.48 : 0.22;
      clrs[i * 3 + 2] = a ? 0.18 : 0.35;
    }
    pgeo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
    pgeo.setAttribute('color', new THREE.BufferAttribute(clrs, 3));
    const particles = new THREE.Points(pgeo, new THREE.PointsMaterial({ size: 0.04, vertexColors: true, transparent: true, opacity: 0.7 }));
    scene.add(particles);

    const grid = new THREE.GridHelper(40, 40, 0x1a2a3a, 0x0e1820);
    grid.position.y = -3;
    scene.add(grid);

    let time = 0;
    let mox = 0;
    let moy = 0;

    const onMouseMove = (e: MouseEvent) => {
      mox = (e.clientX / innerWidth - 0.5) * 2;
      moy = (e.clientY / innerHeight - 0.5) * 2;
    };
    document.addEventListener('mousemove', onMouseMove);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.005 * speedMult;
      
      if (solidMesh) {
        solidMesh.rotation.x = time * 0.4;
        solidMesh.rotation.y = time * 0.6 + mox * 0.3;
        solidMesh.rotation.z = time * 0.2;
        solidMesh.position.x = 3 + Math.sin(time * 0.5) * 0.3;
        solidMesh.position.y = Math.sin(time * 0.7) * 0.4;
      }

      particles.rotation.y = time * 0.05;
      particles.rotation.x = time * 0.02;

      pl1.position.x = Math.sin(time * 0.8) * 5;
      pl1.position.y = Math.cos(time * 0.6) * 3;

      camera.position.x += (-mox * 0.6 - camera.position.x) * 0.02;
      camera.position.y += (moy * 0.4 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      grid.position.z = ((time * 0.3) % 1) - 1;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
      
      if (solidMesh) {
        solidMesh.geometry.dispose();
        (solidMat as THREE.Material).dispose();
        (wireMat as THREE.Material).dispose();
      }
      pgeo.dispose();
      (particles.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, [speedMult, geomType]);

  return <canvas id="three-canvas" ref={canvasRef}></canvas>;
}
