const Handlebars = require('Handlebars');
const d3 = require('d3');

function ListRenderer(widget) {
    var hasViewContentTemplate = hasHtmlTemplate(widget);
    var hasItemsAsHtmlContent, renderItem;
    var listItems = [];
    var nodes = {};


    if (!hasViewContentTemplate) {
        nodes = getItemNodesFromView(widget);
        hasItemsAsHtmlContent = nodes.items.length > 0 ||
            nodes.links.length > 0 || nodes.buttons.length > 0;
    }

    if (hasViewContentTemplate || !hasItemsAsHtmlContent) {
        listItems = getItemsFromModelOrDisplay(widget);
    } else if (hasItemsAsHtmlContent) {
        widget.display.type = getTypeFromViewNodes(nodes);
        listItems = getItemsFromViewNodes(nodes);
    }

    if (!widget.display.type) {
        widget.display.type = getTypeFromAttributeOrDisplay(widget);
    }

    this.groupSelector = getGroupSelector(widget);
    widget.view.shadowRoot.appendChild(this.groupSelector);
    this.itemSelector =  getItemSelector(widget);


    if (hasViewContentTemplate) {
        let template = getTemplateFromViewContent(widget);
        renderItem = Handlebars.compile(template);
    } else if (hasDisplayTemplate(widget)) {
        let template = getDisplayTemplate(widget);
        renderItem = Handlebars.compile(template);
    }

    this.data = getListData(listItems, widget, renderItem);
}

ListRenderer.prototype.render = function() {

    // Update…
    var i = d3.select(this.groupSelector)
        .selectAll(this.itemSelector)
        .data(this.data)
        .html(function(d) { return d; });

    // Enter…
    i.enter()
        .append(this.itemSelector)
        .classed('list-group-item', true)
        .html(function(d) {
            return d.content;
        });

    // Exit…
    i.exit().remove();
};

function getListData(items, widget, renderItem) {

    return items.map(generateData);
    function generateData(item) {
        var result = { content: '' };
        if (typeof item === 'string' && renderItem) {
            result.content = renderItem(widget);
        } else if (typeof item === 'string') {
            // item is a string and there is no template
            // model is an array of strings
            result.content = item;
        } else if (typeof item === 'object' && renderItem) {
            // template
            result.content = renderItem({model: item});
        } else {
            // no template
            // display items is an array of templates
            let render = Handlebars.compile(item.content);
            result.content = render(widget);
        }

        return result;
    }

    function isItemATemplate(item) {}
}

function getItemsFromModelOrDisplay(widget) {
    var result = [];
    if (widget.display && widget.display.items) {
        result = getItemsFromDisplay(widget);
    } else if (Array.isArray(widget.model)) {
        result = widget.model;
    }

    return result;
}

function getItemsFromDisplay(widget) {
    var result = [];
    var items = widget.display.items;
    if (Array.isArray(items)) {
        result = items.map(function (item) {
            return {
                content: item
            };
        });
    } else if (items && items.model) {
        result = getItemsModel(item.model, widget.model);
    } else if (Array.isArray(widget.model)) {
        result = widget.model;
    }

    return result;
}

function getItemsModel(path, model) {
    return path.split('.')
        .reduce(getProperty, model);
    function getProperty(acc, property) {
        let result;
        if (arrayPattern.test(property)) {
            let match = arrayPattern.exec(property);
            property = match[1];
            let index = match[2];
            result = acc[property][index];
        } else {
            result = acc[property];
        }
        return result;
    }
}

function hasHtmlTemplate(widget) {
    return widget.view.querySelector('[data-role=template]') !== null;
}

function getTemplateFromViewContent(widget) {
    return widget.view.querySelector('[data-role=template]').innerHTML;
}

function getTypeFromAttributeOrDisplay(widget) {
    var result = 'default'; // posible values are: default | link | button

    if (widget.view.hasAttribute('data-type')) {
        result = widget.dataset.type;
    } else if (widget.display && widget.display.type) {
        result = widget.display.type;
    }

    return result;
}

function getGroupSelector(widget) {
    var listGroup;
    if (widget.type === 'default') {
        listGroup = document.createElement('ul');
    } else {
        listGroup = document.createElement('div');
    }
    listGroup.classList.add('list-group');
    return listGroup;
}

function getItemSelector(type) {
    var result = 'li';
    if (type === 'link') {
        result = 'a';
    } else if (type === 'button') {
        result = 'button';
    }
    return result;
}

function getItemNodesFromView(widget) {
    const children = Array.from(widget.view.children);
    var items = children.filter(isDiv);
    var links = children.filter(isLink);
    var buttons = children.filter(isButton);

    return {
        items: items,
        links: links,
        buttons: buttons
    };

    function isDiv(item) {
        return item.tagName.toLowerCase() === 'div';
    }

    function isLink(item) {
        return item.tagName.toLowerCase() === 'a';
    }

    function isButton(item) {
        return item.tagName.toLowerCase() === 'button';
    }
}

function getTypeFromViewNodes(nodes) {
    var result;

    if (nodes.items) {
        result = 'default';
    } else if (nodes.links) {
        result = 'link';
    } else if (nodes.buttons) {
        result = 'button';
    }

    return result;
}

function getItemsFromViewNodes(nodes) {

    var result = [];
    var items = nodes.items || nodes.links || nodes.buttons;
    if (items) {
        result = Array.from(items)
            .map(function(item) {
                var type = getTypeFromViewNodes(nodes);
                return {
                    href: type === 'link' ? item.getAttribute('href') : null,
                    content: item.innerHTML
                };
            });
    }
    return result;
}

function hasDisplayTemplate(widget) {

    return widget.display &&
        widget.display.items &&
        typeof widget.display.items === 'object' &&
        widget.display.items.template;
}

function getDisplayTemplate(widget) {

    return widget.display.items.template;
}

module.exports = ListRenderer;