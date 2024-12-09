import * as THREE from "three";

const defaultFragmentShader = `
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;

void main() {
  gl_FragColor = vec4(gl_FragCoord.xy / u_resolution, 0.0, 1.0);
}`;

const defaultVertexShader = `
#ifdef GL_ES
precision highp float;
#endif

varying vec2 v_uv;

void main() {
  v_uv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

type UniformRecord = Record<string, THREE.IUniform<any>>;

export interface ShaderPlaygroundProps {
  /**
   * Where the canvas should be appended to the DOM
   */
  container: HTMLElement;

  /**
   * Any additional uniforms that should be added
   */
  uniforms: UniformRecord;

  /**
   * Fragment shader (controls colors)
   */
  fragmentShader: string;

  /**
   * Vertex shader (controls vertices)
   */
  vertexShader: string;

  /**
   * Number of width segments plane should have
   * Defaults to 1
   */
  widthSegments?: number;

  /**
   * Number of height segments plane should have
   * Defaults to 1
   */
  heightSegments?: number;
}

export class ShaderPlayground {
  // threejs specific stuff
  protected clock: THREE.Clock;
  protected scene: THREE.Scene;
  protected camera: THREE.PerspectiveCamera;
  protected renderer: THREE.WebGLRenderer;

  // internal state
  protected container: HTMLElement;
  protected animationId: number = 0;
  protected mouseX: number = 0;
  protected mouseY: number = 0;

  // shader uniforms
  protected uniforms: UniformRecord = {};

  // shaders
  protected fragmentShader: string;
  protected vertexShader: string;

  // plane geometry
  protected widthSegments: number;
  protected heightSegments: number;

  /**
   * Create a new shader playground
   * @param props Shader Playground configuration
   */
  constructor({
    container = document.body,
    uniforms = {},
    fragmentShader = defaultFragmentShader,
    vertexShader = defaultVertexShader,
    widthSegments = 1,
    heightSegments = 1,
  }: Partial<ShaderPlaygroundProps> = {}) {
    // assign configuration options
    this.container = container;
    this.fragmentShader = fragmentShader;
    this.vertexShader = vertexShader;
    this.widthSegments = widthSegments;
    this.heightSegments = heightSegments;

    // asign uniforms
    Object.assign(
      this.uniforms,
      {
        u_time: { value: 0.0 },
        u_mouse: { value: new THREE.Vector2(0.0, 0.0) },
        u_resolution: { value: new THREE.Vector2(0.0, 0.0) },
      },
      uniforms,
    );

    // setup all important properties
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.camera = this.createCamera();

    // resize the canvas
    this.onResize();
    this.setup();
    this.mount();
  }

  /**
   * Aspect ratio of the container (and the renderer)
   */
  get aspect() {
    return this.width / this.height;
  }

  /**
   * Width of the container (and the renderer)
   */
  get width() {
    return this.container.offsetWidth;
  }

  /**
   * Height of the container (and the renderer)
   */
  get height() {
    return this.container.offsetHeight;
  }

  /**
   * Internal resize event listener
   */
  private onResize() {
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.width, this.height);

    this.camera.aspect = this.aspect;
    this.camera.lookAt(new THREE.Vector3());
    this.camera.updateProjectionMatrix();

    // update uniforms
    this.uniforms.u_resolution.value.x = this.width * devicePixelRatio;
    this.uniforms.u_resolution.value.y = this.height * devicePixelRatio;
  }

  /**
   * Internal mouse event listener
   */
  private onMouseMove(e: MouseEvent) {
    const canvasBBox = this.renderer.domElement.getBoundingClientRect();
    this.mouseX = e.clientX - canvasBBox.left - this.width / 2;
    this.mouseY = e.clientY - canvasBBox.top - this.height / 2;
  }

  /**
   * Create a new perspecive camera & position it such that the default plane fills the container
   * @returns Three.js perspective camera
   */
  createCamera() {
    // position the camera such that 1px in 3D = 1px on the screen
    const distance = Math.max(this.width, this.height);
    const fov = (2 * Math.atan(this.height / (2 * distance)) * 180) / Math.PI;

    const camera = new THREE.PerspectiveCamera(
      fov,
      this.aspect,
      0.01,
      distance * 2,
    );
    camera.position.z = distance;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    return camera;
  }

  /**
   * Add event listeners & the renderer to the DOM
   */
  mount() {
    this.container.appendChild(this.renderer.domElement);
    this.container.addEventListener("resize", this.onResize.bind(this));
    this.container.addEventListener("mousemove", this.onMouseMove.bind(this));

    this.onResize();
  }

  /**
   * Add a plane to the scene
   */
  setup() {
    this.scene.add(
      new THREE.Mesh(
        new THREE.PlaneGeometry(
          this.width,
          this.height,
          this.widthSegments,
          this.heightSegments,
        ),
        new THREE.ShaderMaterial({
          uniforms: this.uniforms,
          vertexShader: this.vertexShader,
          fragmentShader: this.fragmentShader,
        }),
      ),
    );
  }

  animate() {
    this.animationId = requestAnimationFrame(this.animate.bind(this));

    // update uniforms
    this.uniforms.u_time.value = this.clock.getElapsedTime();

    // https://thebookofshaders.com/03/
    // in the book of shaders the mouse position is given as a pixel coordinate
    this.uniforms.u_mouse.value.x = this.mouseX;
    this.uniforms.u_mouse.value.y = this.mouseY;

    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Start the renderer & update loop (updates uniforms)
   */
  start() {
    this.clock.start();
    this.animationId = requestAnimationFrame(this.animate.bind(this));
  }

  /**
   * Stop everything & dispose of the renderer (including removing it from the DOM)
   */
  dispose() {
    cancelAnimationFrame(this.animationId);
    this.clock.stop();
    this.renderer.domElement.remove();
    this.renderer.dispose();
  }
}
