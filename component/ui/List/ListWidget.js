const ListRenderer = require('./ListRenderer.js');

function ListWidget(view, scope) {
    this.view = view;
    this.scope = scope;
    this.display = {};
}

ListWidget.prototype.render = function() {
    return this.fetchData()
        .then(function(widget) {
            var renderer = new ListRenderer(widget);
            renderer.render();
        });
};

ListWidget.prototype.fetchData = function() {
    var promises = [];
    var widget = this;

    promises.push(widget.scope.onAppReady);

    if (this.view.hasAttribute('data-model')) {
        promises.push(
            this.scope.getModel().then(function(result) {
                widget.model = result;
            })
        );
    }

    if (this.view.hasAttribute('data-display')) {
        promises.push(
            this.scope.getDisplay().then(function(result) {
                widget.display = result;
            })
        );
    }

    return Promise.all(promises).then(function() {
        return widget;
    });
};


module.exports = ListWidget;