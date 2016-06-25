import marked from './lib/marked';

let loadContent = ( _path ) => {
  fetch( _path )
  .then( ( _res ) => {
    return _res.text();
  } ).then( ( _text ) => {
    markdown.innerHTML = ( marked( _text ) );
  } );
};

export default loadContent;
