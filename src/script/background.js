import { xorshift } from './xorshift';
import { GLCat } from './glcat';

let glslify = require( 'glslify' );

// ---

let clamp = ( _value, _min, _max ) => {
  return Math.min( Math.max( _value, _min ), _max );
};

let saturate = ( _value ) => {
  return clamp( _value, 0.0, 1.0 );
};

// ---

let background = () => {
  let width = canvas.width = 300;
  let height = canvas.height = 300;

  let gl = canvas.getContext( 'webgl' );
  let glCat = new GLCat( gl );

  let frame = 0;
  let frameRate = 60;
  let time = 0.0;
  let beginDate = 0;

  let scroll = 0;
  let intensity = 0.0;

  // ---

  let vboQuad = glCat.createVertexbuffer( [ -1, -1, 1, -1, -1, 1, 1, 1 ] );

  // ---

  let vertQuad = glslify( './shader/quad.vert' );

  let programPost = glCat.createProgram(
    vertQuad,
    glslify( './shader/post.frag' )
  );

  // ---

  let videoLoaded = false;
  let textureVideo = glCat.createTexture();

  let video = document.createElement( 'video' );
  video.src = 'image/background.mp4';
  video.loop = true;
  video.addEventListener( 'canplaythrough', () => {
    videoLoaded = true;
    video.play();
  } );

  elVideoPlay.onclick = () => {
    video.play();
  };

  // ---

  let render = () => {
    gl.viewport( 0, 0, width, height );
    glCat.useProgram( programPost );
    gl.bindFramebuffer( gl.FRAMEBUFFER, null );
    glCat.clear();

    glCat.attribute( 'p', vboQuad, 2 );

    glCat.uniform1f( 'time', time );
    glCat.uniform2fv( 'resolution', [ width, height ] );
    glCat.uniform2fv( 'window', [ window.innerWidth, window.innerHeight ] );
    glCat.uniform1f( 'intensity', intensity );

    glCat.uniformTexture( 'texture', textureVideo, 0 );

    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
  };

  // ---

  let update = () => {
    let timePrev = time;
    time = ( +new Date() - beginDate ) * 0.001;
    let deltaTime = time - timePrev;

    let scrollPrev = scroll;
    scroll = content.scrollTop;
    intensity -= ( scroll - scrollPrev ) * 0.01;

    intensity *= Math.exp( -deltaTime * 20.0 );

    if ( video.paused ) {
      elVideoPlay.style.display = 'block';
    } else {
      elVideoPlay.style.display = 'none';
    }

    if ( videoLoaded ) { glCat.setTexture( textureVideo, video ); }

    render();
    frame ++;

    requestAnimationFrame( update );
  };

  beginDate = +new Date();
  update();
};

export default background;
