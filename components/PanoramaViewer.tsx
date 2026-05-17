"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Props {
  imageUrl: string;
}

export default function PanoramaViewer({ imageUrl }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    animId: number;
    isDragging: boolean;
    prevMouse: { x: number; y: number };
    lon: number;
    lat: number;
  } | null>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const width = el.clientWidth;
    const height = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0.01);

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const texture = new THREE.TextureLoader().load(imageUrl);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let lon = 0;
    let lat = 0;
    let autoRotate = true;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      autoRotate = false;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      lon -= (e.clientX - prevMouse.x) * 0.3;
      lat += (e.clientY - prevMouse.y) * 0.3;
      lat = Math.max(-85, Math.min(85, lat));
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => { isDragging = false; };

    renderer.domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    const onResize = () => {
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    const animate = () => {
      const animId = requestAnimationFrame(animate);
      stateRef.current!.animId = animId;

      if (autoRotate) lon += 0.05;

      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(lon);
      camera.lookAt(
        500 * Math.sin(phi) * Math.cos(theta),
        500 * Math.cos(phi),
        500 * Math.sin(phi) * Math.sin(theta)
      );
      renderer.render(scene, camera);
    };

    stateRef.current = {
      renderer,
      scene,
      camera,
      animId: 0,
      isDragging,
      prevMouse,
      lon,
      lat,
    };

    animate();

    return () => {
      cancelAnimationFrame(stateRef.current?.animId ?? 0);
      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [imageUrl]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      style={{ touchAction: "none" }}
    />
  );
}
