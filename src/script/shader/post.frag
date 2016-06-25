#define V vec2(0.,1.)
#define lofi(i,j) (floor(i/j)*j)

precision highp float;

uniform vec2 resolution;
uniform vec2 window;
uniform sampler2D texture;

uniform float intensity;

void main() {
  vec3 ret = vec3( 0.0 );

  float aspect = window.x / window.y;
  vec2 stretch = max( V.yy, vec2( 1.0 / aspect, aspect ) );
  vec2 uv = ( ( gl_FragCoord.xy - resolution / 2.0 ) / stretch + resolution / 2.0 ) / resolution;

  vec2 region = vec2( 8.0 );
  vec2 glitchPos = floor( gl_FragCoord.xy / region ) * region / resolution;

  vec3 glitchTex = texture2D( texture, glitchPos ).xyz;
  ret = vec3(
    texture2D( texture, uv + lofi( vec2( 0.0, glitchTex.x ) * resolution.y * intensity, 8.0 ) / resolution.y ).x,
    texture2D( texture, uv + lofi( vec2( 0.0, glitchTex.y ) * resolution.y * intensity, 8.0 ) / resolution.y ).y,
    texture2D( texture, uv + lofi( vec2( 0.0, glitchTex.z ) * resolution.y * intensity, 8.0 ) / resolution.y ).z
  );

  if ( mod( gl_FragCoord.y + gl_FragCoord.x, 3.0 ) == 0.0 ) { ret *= V.yxx; }
  if ( mod( gl_FragCoord.y + gl_FragCoord.x, 3.0 ) == 1.0 ) { ret *= V.xyx; }
  if ( mod( gl_FragCoord.y + gl_FragCoord.x, 3.0 ) == 2.0 ) { ret *= V.xxy; }

  ret *= 0.7 + abs( intensity );

  gl_FragColor = vec4( ret, 1.0 );
}
