"use client";

import { useEffect, useRef } from "react";

/**
 * StarryNightScrollMelt
 * ----------------------
 * La VRAIE toile de « La Nuit étoilée » (Van Gogh, 1889, domaine public) rendue
 * en WebGL, avec un effet de fonte/coulure PILOTÉ PAR LE SCROLL : au fur et à
 * mesure que le bloc sort du haut de l'écran, l'image se liquéfie (les pixels du
 * tableau lui-même coulent en conservant les vraies couleurs) ; en remontant,
 * elle se reforme à l'identique.
 *
 * Version « plain CSS » (sans Tailwind) pour ce projet : les classes
 * `.starry-melt__*` sont définies dans app/globals.css.
 */

const IMAGE_URL = "/starry-night.jpg";

const VERTEX_SRC = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SRC = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_texture;
uniform float u_progress;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_imageSize;

float hash(float n) { return fract(sin(n) * 43758.5453123); }

float noise(float x) {
  float i = floor(x);
  float f = fract(x);
  float a = hash(i);
  float b = hash(i + 1.0);
  return mix(a, b, smoothstep(0.0, 1.0, f));
}

void main() {
  vec2 s = u_resolution / u_imageSize;
  float scaleFactor = max(s.x, s.y);
  vec2 scaledSize = u_imageSize * scaleFactor;
  vec2 offset = (u_resolution - scaledSize) * 0.5;
  vec2 st = (v_uv * u_resolution - offset) / scaledSize;

  float n = noise(st.x * 6.0) * 0.55
          + noise(st.x * 17.0 + 3.1) * 0.30
          + noise(st.x * 41.0 + 7.7) * 0.15;
  float dripFactor = 0.55 + n * 0.75;

  float meltStart = clamp(1.0 - u_progress * dripFactor, -0.2, 1.0);
  float meltZone = smoothstep(meltStart - 0.04, meltStart + 0.20, st.y);

  float wob = sin(st.x * 50.0 + u_time * 0.6) * 0.006
            + sin(st.x * 13.0 - u_time * 0.3) * 0.01;
  float sourceY = mix(st.y, meltStart + (st.y - meltStart) * 0.06 + wob * meltZone, meltZone);
  float sourceX = st.x + sin(st.y * 30.0 + st.x * 6.0 + u_time * 0.4) * 0.006 * meltZone * u_progress;

  vec2 sampleUV = clamp(vec2(sourceX, sourceY), 0.0, 1.0);
  vec3 col = texture2D(u_texture, sampleUV).rgb;

  if (meltZone > 0.04) {
    vec3 c1 = texture2D(u_texture, clamp(sampleUV + vec2(0.0, 0.005), 0.0, 1.0)).rgb;
    vec3 c2 = texture2D(u_texture, clamp(sampleUV - vec2(0.0, 0.005), 0.0, 1.0)).rgb;
    vec3 c3 = texture2D(u_texture, clamp(sampleUV + vec2(0.003, 0.009), 0.0, 1.0)).rgb;
    col = mix(col, (col + c1 + c2 + c3) / 4.0, meltZone * 0.75);
  }

  col *= mix(1.0, 0.92, meltZone * 0.35);

  gl_FragColor = vec4(col, 1.0);
}
`;

type Props = {
  className?: string;
  overlay?: number;
};

export default function StarryNightScrollMelt({
  className = "",
  overlay = 0.1,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const gl = (canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function compile(type: number, source: string) {
      const shader = gl!.createShader(type)!;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error(gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertShader = compile(gl.VERTEX_SHADER, VERTEX_SRC);
    const fragShader = compile(gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const u_texture = gl.getUniformLocation(program, "u_texture");
    const u_progress = gl.getUniformLocation(program, "u_progress");
    const u_time = gl.getUniformLocation(program, "u_time");
    const u_resolution = gl.getUniformLocation(program, "u_resolution");
    const u_imageSize = gl.getUniformLocation(program, "u_imageSize");

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([11, 26, 61, 255])
    );

    let imageSize = { w: 1, h: 1 };

    const img = new Image();
    img.onload = () => {
      gl!.bindTexture(gl!.TEXTURE_2D, texture);
      gl!.texImage2D(
        gl!.TEXTURE_2D,
        0,
        gl!.RGBA,
        gl!.RGBA,
        gl!.UNSIGNED_BYTE,
        img
      );
      imageSize = { w: img.naturalWidth, h: img.naturalHeight };
      draw(true);
    };
    img.onerror = () => {
      console.warn("StarryNightScrollMelt: impossible de charger l’image.");
    };
    img.src = IMAGE_URL;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let currentProgress = 0;
    let targetProgress = 0;
    let raf = 0;
    const startTime = performance.now();

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = container!.clientWidth;
      const h = container!.clientHeight;
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = w + "px";
      canvas!.style.height = h + "px";
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      draw(true);
    }

    function computeTargetProgress() {
      const rect = container!.getBoundingClientRect();
      const p = -rect.top / rect.height;
      targetProgress = Math.max(0, Math.min(1, p));
    }

    function draw(force = false) {
      const now = performance.now();
      const t = (now - startTime) / 1000;

      if (!force && Math.abs(targetProgress - currentProgress) < 0.0005) {
        return;
      }

      currentProgress += (targetProgress - currentProgress) * 0.09;

      gl!.uniform1i(u_texture, 0);
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, texture);
      gl!.uniform1f(u_progress, currentProgress);
      gl!.uniform1f(u_time, prefersReducedMotion ? 0 : t);
      gl!.uniform2f(u_resolution, canvas!.width, canvas!.height);
      gl!.uniform2f(u_imageSize, imageSize.w, imageSize.h);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
    }

    function loop() {
      computeTargetProgress();
      draw();
      raf = requestAnimationFrame(loop);
    }

    resize();
    computeTargetProgress();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      gl!.deleteTexture(texture);
      gl!.deleteBuffer(buffer);
      gl!.deleteProgram(program);
      gl!.deleteShader(vertShader);
      gl!.deleteShader(fragShader);
    };
  }, []);

  return (
    <div ref={containerRef} className={`starry-melt__bg ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={IMAGE_URL}
        alt="La Nuit étoilée, Vincent van Gogh, 1889"
        className="starry-melt__img"
        style={{ objectPosition: "center 35%" }}
        draggable={false}
      />
      <canvas ref={canvasRef} className="starry-melt__canvas" />
      {overlay > 0 && (
        <div
          className="starry-melt__overlay"
          style={{ background: `rgba(5, 10, 25, ${overlay})` }}
        />
      )}
    </div>
  );
}
