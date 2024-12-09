import { ShaderPlayground } from "shader-playground";
import fragmentShader from "./shaders/main.frag";
import vertexShader from "./shaders/main.vert";
import "./style.css";

const playground = new ShaderPlayground({
  container: document.querySelector<HTMLDivElement>(".shader")!,
  fragmentShader,
  vertexShader,
});

playground.start();
