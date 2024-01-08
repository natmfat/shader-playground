# Shader Playground

A tiny wrapper around Three.js that provides you sensible uniforms and defaults to get started with fragment shaders.

## Installation

```ts
pnpm install shader-playground
```

## Usage

```ts
import { ShaderPlayground } from "shader-playground";

const playground = new ShaderPlayground({
  fragmentShader: `
    #ifdef GL_ES
    precision mediump float;
    #endif

    void main() {
      gl_FragColor = vec4(1.0, 0., 0., 1.);
    }`,
});

playground.start();

// when you're done, playground.dispose();
```
