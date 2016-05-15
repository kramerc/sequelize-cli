'use strict';

var _        = require('lodash');
var beautify = require('js-beautify');
var helpers  = require(__dirname);

module.exports = {
  getCoffeeConverter: function () {
    return helpers.path.resolve('js2coffee') || (function () {
      console.log('Unable to find \'js2coffee\'. Please add it to your project.');
      process.exit(1);
    })();
  },

  getEs6Converter: function () {
    return helpers.path.resolve('lebab') || (function () {
      console.log('Unable to find \'lebab\'. Please add it to your project.');
      process.exit(1);
    })();
  },

  render: function (path, locals, options) {
    options = _.assign({
      beautify: true,
      indent_size: 2,
      preserve_newlines: false
    }, options || {});

    var template = helpers.asset.read(path);
    var content  = _.template(template)(locals || {});

    if (options.beautify) {
      content = beautify(content, options);
    }

    if (helpers.config.supportsCoffee()) {
      content = this.getCoffeeConverter().build(content);
      content = content.code || content;
    }

    if (helpers.config.supportsEs6()) {
      var Lebab = this.getEs6Converter();
      var transformer = new Lebab.Transformer({
        'class': true,
        'template': true,
        'arrow': true,
        'let': true,
        'default-param': true,
        'obj-method': true,
        'obj-shorthand': true,
        'no-strict': true,
        'commonjs': true
      });

      content = transformer.run(content);
    }

    return content;
  }
};
