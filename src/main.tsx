import * as THREE from "three";
import fragmentShader from "./shaders/fragment.glsl";
import { baseScale } from "./Globals";
import { conf } from "./Conf";
import { requestRerender, rerender } from "./Rerender";
import { Point2D } from "./Types";
import { clientCordConv } from "./Helpers";
import { initTooltip } from "./Tooltip";
import { initMenu } from "./Menu";

const init = async () => {
  const scene = new THREE.Scene();
  const camera = new THREE.Camera();
  const renderer = new THREE.WebGLRenderer();
  document.body.appendChild(renderer.domElement);

  // Fullscreen plane geometry
  const geometry = new THREE.PlaneGeometry(2, 2);

  // Simple fragment shader
  const material = new THREE.ShaderMaterial({
    fragmentShader: fragmentShader,
    uniforms: {
      iResolution: { value: [window.innerWidth, window.innerHeight] },
      conf: { value: conf },
    },
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // const animate = (time) => {
  //   // material.uniforms.uTime.value = time * 0.001;
  //   requestAnimationFrame(animate);
  // };

  rerender.fn = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  };

  window.addEventListener("resize", () => {
    requestRerender();
  });
  rerender.fn();

  // allow moving the plane
  var anchorPoint: null | Point2D = null;
  var anchorPointUV: null | Point2D = null;
  window.addEventListener(
    "mousedown",
    (event) => {
      if ((event.target as any).tagName.toLowerCase() === "canvas") {
        anchorPoint = [event.clientX, event.clientY];
        anchorPointUV = clientCordConv(event.clientX, event.clientY, conf);
      }
    },
    false,
  );
  window.addEventListener("mousemove", (event) => {
    if (anchorPoint !== null && anchorPointUV !== null) {
      const eventPos = clientCordConv(event.clientX, event.clientY, conf);

      conf.offset = [
        conf.offset[0] + anchorPointUV[0] - eventPos[0],
        conf.offset[1] + anchorPointUV[1] - eventPos[1],
      ];
      requestRerender();
    }
  });
  window.addEventListener("mouseup", () => (anchorPoint = null), false);

  // allow zooming in/out of the plane
  let currentScale = 0;
  window.addEventListener("wheel", (event) => {
    if ((event.target as any).tagName.toLowerCase() === "canvas") {
      event.preventDefault(); // Prevent default scroll

      const delta = Math.sign(event.deltaY);
      currentScale += delta === 1 ? 1 : -1;
      conf.scale = baseScale * Math.pow(2, currentScale / 20);
      requestRerender();
    }
  });

  // animate();
  initTooltip();
  initMenu();
};

window.addEventListener("load", () => {
  init();
});
