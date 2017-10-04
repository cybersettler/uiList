const ListWidget = require('./ListWidget.js');

function ListController(view, scope){

  this.super(view, scope);
  const controller = this;

  scope.onAttached.then(function() {

    var bindingAttributes = [];
    if (view.hasAttribute('data-model')) {
      bindingAttributes.push('model');
    }

    if (view.hasAttribute('data-display')) {
      bindingAttributes.push('display');
    }

    scope.bindAttributes(bindingAttributes);
    controller.listWidget = new ListWidget(view, scope);
    controller.listWidget.render();
  });

  this.render = function() {
    this.listWidget.render();
  };
}

module.exports = ListController;
