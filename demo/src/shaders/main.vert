varying vec2 v_uv;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
  vec4 next_pos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  // dimensions of flag are 5 x 3, so we scale to 5 then reduce to 15% of its size to fit in view
  next_pos.x = (next_pos.x * 5.) * .15; 

  // sin gives the wave, * 20 to make the effect more apparent
  // again, we multiply by 3 (expected height) & reduce down to to 15%
  next_pos.y = ((sin(next_pos.x / 100. + u_time * 3.) * 20. + next_pos.y) * 3.) * .15;
  gl_Position = vec4(next_pos);

  v_uv = uv;
}