import { ShaderPlayground } from "shader-playground";
import fragmentShader from "./shaders/main.frag";
import vertexShader from "./shaders/main.vert";
import "./style.css";
import flag from "./us_flag.png";
import { TextureLoader } from "three";

const playground = new ShaderPlayground({
  container: document.querySelector<HTMLDivElement>(".shader")!,
  fragmentShader,
  vertexShader,
  widthSegments: 50,
  heightSegments: 1,
  uniforms: {
    u_flag: {
      value: new TextureLoader().load(flag),
    },
  },
});

playground.start();
