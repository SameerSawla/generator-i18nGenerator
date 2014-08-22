'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var I18ngeneratorGenerator = yeoman.generators.Base.extend({
  init: function () {

  },

  askFor: function () {


    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the perfect I18ngenerator generator!'
    ));   

  },

  app: function () {
    
      this.mkdir("js");
      this.mkdir("test");

      this.directory("appContent/js/","js/");
      this.directory("appContent/test","test");
  },

  projectfiles: function () {
      this.copy('editorconfig', '.editorconfig');
      this.copy('jshintrc', '.jshintrc');
  }
});

module.exports = I18ngeneratorGenerator;
