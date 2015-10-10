requirejs.config({
  baseUrl: 'js/lib',
  paths: {
     jquery: 'jquery-1.11.3.min',
     bootstrap: 'bootstrap.min',
     text: 'text.min'
  }
});

requirejs(['jquery'], function($) {
    console.log($);
    console.log(Regular);
});