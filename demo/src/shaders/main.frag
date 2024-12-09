#ifdef GL_ES
precision highp float;
#endif

varying vec2 v_uv;
uniform vec2 u_resolution;
uniform sampler2D u_flag;

void main() {
  vec3 color = texture2D(u_flag, v_uv).rgb;
  gl_FragColor = vec4(color, 1.0);
}