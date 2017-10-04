var model, view, display;

const scope = {
    getModel: function () {
        return Promise.resolve(model);
    },
    getDisplay: function () {
        return Promise.resolve(display);
    }
};

const stringArrayModel = [
    'Banner, Bruce',
    'Parker, Peter',
    'Wayne, Bruce'
];

const arrayModel = [{
    firstname: 'Peter',
    lastname: 'Parker',
    gender: 'male',
    description: 'Spidei',
    roles: [{
        name: 'standard',
        privileges: ['user.profile']
    }]
}, {
    firstname: 'Bruce',
    lastname: 'Wayne',
    gender: 'male',
    description: 'The Batman',
    roles: [{
        name: 'standard',
        privileges: ['user.profile']
    }, {
        name: 'admin',
        privileges: [
            'user.profile',
            'system.option.settings'
        ]
    }]
}];


const translation = {
    lng: 'en',
    resources: {
        en: {
            translation: {
                user: {
                    firstname: 'First name',
                    lastname: 'Last name',
                    profile: 'Profile'
                },
                login: {
                    option: {
                        login: 'Log in',
                        logout: 'Log out'
                    },
                    status: {
                        anonymous: 'anonymous'
                    }
                },
                system: {
                    option: {
                        settings: 'Settings'
                    }
                }
            }
        }
    }
};

function setEmptyView() {
    view = document.createElement('div');
    var container = document.createElement('div');
    view.shadowRoot = createShadowRoot();
    view.shadowRoot.appendChild(container);
    view.dataset = {};
    return view;
}

function createShadowRoot() {
    return document.createElement('div');
}

function initDisplay() {
    display = {
        type: 'default'
    };
}

function bindModelAttribute() {
    var modelValue = '->f()';
    view.setAttribute('data-model', modelValue);
    view.dataset.model = modelValue;
}

function bindDisplayAttribute() {
    var displayValue = '->f()';
    view.setAttribute('data-display', displayValue);
    view.dataset.display = displayValue;
}

module.exports = {
    objectModel: function () {
        model = arrayModel[1];
        bindModelAttribute();
    },
    stringArrayModel: function () {
        model = stringArrayModel;
        bindModelAttribute();
    },
    arrayModel: function() {
        model = arrayModel;
        bindModelAttribute();
    },
    displayWithItems: function () {
        initDisplay();
        display.items = [
            "{{i18n 'user.profile'}}",
            "{{i18n 'system.option.settings'}}",
            "{{i18n 'login.option.logout'}}"
        ];
        bindDisplayAttribute();
        return display;
    },
    displayWithTemplate: function () {
        initDisplay();
        display.items = {
            template: '{{model.lastname}}, {{model.firstname}}'
        };
        bindDisplayAttribute();
        return display;
    },
    emptyView: setEmptyView,
    itemsView: function () {
        setEmptyView();
        var item1 = document.createElement('div');
        item1.textContent = "{{i18n 'user.profile'}}";
        var item2 = document.createElement('div');
        item2.textContent = "{{i18n 'system.option.settings'}}";
        var item3 = document.createElement('div');
        item3.textContent = "{{i18n 'login.option.logout'}}";
        console.log("view", view);

        view.appendChild(item1);
        view.appendChild(item2);
        view.appendChild(item3);

        return view;
    },
    templateView: function () {
        setEmptyView();
        var template = document.createElement('div');
        template.dataset.role = 'template';
        template.textContent = '{{model.lastname}}, {{model.firstname}}';
        view.appendChild(template);
        console.log("view", view);
        return view;
    },
    translation: function () {
        return translation;
    },
    scope: function () {
        return scope;
    }
};