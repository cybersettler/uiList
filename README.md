# uiList
>List websemble component

## Getting started

Include UI List in your project dependencies
(see [websemble generator]
  (https://github.com/cybersettler/generator-websemble/wiki)).
In your project's bower.json:

```json
{
  "dependencies": {
    "uiForm": "cybersettler/uiList"
  }
}
```

The simplest way to use the ui list is to specify the
items as the tag content, like so:

```html
<ui-list>
    <div>Apple</div>
    <div>Banana</div>
    <div>Orange</div>
</ui-list>
```
Alternative ways to specify items are links and buttons:

```html
<ui-list>
    <a href="view/index">Home</a>
    <a href="view/catalog">Catalog</a>
    <a href="view/contact">Contact</a>
</ui-list>
```
If the data comes from a model, you may specify a template:

```html
<ui-list data-model="/contacts">
    <div data-role="template">
        <h2>{{model.firstname}} {{model.lastname}}</h2>
    </div>
</ui-list>
```

In this case the model must be an array, and the model variable
will be set to the current item.

## API

### data-model

Contains data to be displayed in the list items.

### data-display

Configuration object to control the display of the list items.
Supported parameters are:

* __type__ (enum: default | link | button): List type. Defaults to _default_.
* __items__ ([string] | object): Array of list item templates.
    * __model__(string): Path to the item model data source.
    * __template__(string): Template to render each item.

### data-type

List type. Possible values are: _default_ | _link_ | _button_,
defaults to _default_.