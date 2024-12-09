#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;

void main() {
  gl_FragColor = vec4(gl_FragCoord.xy / u_resolution, 0.0, 1.0);
}