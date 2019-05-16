'use strict';

class WarningsToErrorsPlugin {
  constructor(options) {
    this.options = options  
  }
  
  apply(compiler) {
    if ('hooks' in compiler) {
      compiler.hooks.shouldEmit.tap('WarningsToErrorsPlugin', this.handleHook);
    } else {
      compiler.plugin('should-emit', this.handleHook);
    }
  }

  handleHook(compilation) {
    if (compilation.warnings.length > 0) {
      compilation.errors = compilation.errors.concat(this.filterWarnings(compilation.warnings));
      compilation.warnings = [];
    }

    compilation.children.forEach((child) => {
      if (child.warnings.length > 0) {
        child.errors = child.errors.concat(this.filterWarnings(child.warnings));
        child.warnings = [];
      }
    });
  }
  
  filterWarnings(warnings) {
    return warnings.filter((warning) => this.options.filterRegexp.test(warning)) 
  }
}

module.exports = WarningsToErrorsPlugin;
