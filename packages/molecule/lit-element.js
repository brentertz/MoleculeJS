import { html, render as litRender } from '../node_modules/lit-html/lit-html.js';
export const LitElement = (superclass) => class extends superclass {
    constructor() {
        super();
        this.__data = {};
        this._methodsToCall = {};
        this.attachShadow({ mode: 'open' });
    }
    static observedAttributes() {
        let attrs = [];
        for (const prop in this.properties) {
            if (this.properties[prop].reflectToAttribute) {
                attrs.push(prop);
            }
        }
        return attrs;
    }
    connectedCallback() {
        const props = this.constructor.properties;
        this._wait = true;
        for (let prop in props) {
            this._makeGetterSetter(prop, props[prop]);
        }
        delete this._wait;
        litRender(this.render(), this.shadowRoot);
        if (this.afterFirstRender)
            this.afterFirstRender();
    }
    /**
     * Creates the Propertyaccessors for the defined properties of the Element.
     * @param {string} prop
     * @param {propConfig} info
     */
    _makeGetterSetter(prop, info) {
        const element = this;
        Object.defineProperty(this, prop, {
            get() {
                return element.__data[prop];
            },
            set(val) {
                if (info.reflectToAttribute) {
                    if (info.type === Object || info.type === Array) {
                        console.warn('Rich Data shouldn\'t be set as attribte!');
                    }
                    element.setAttribute(prop, val);
                }
                else
                    element.__data[prop] = val;
                element._propertiesChanged(prop, val);
            }
        });
        if (info.observer) {
            if (this[info.observer]) {
                this._methodsToCall[prop] = this[info.observer].bind(this);
            }
            else {
                console.warn(`Method ${info.observer} not defined!`);
            }
        }
        if (info.value) {
            this.__data[prop] = info.value;
        }
        this.__data[prop] = this.getAttribute(prop) || this.__data[prop];
    }
    /**
     * Gets called when the properties change and the Element should rerender.
     *
     * @param {string} prop
     * @param {any} val
     */
    _propertiesChanged(prop, val) {
        if (this._methodsToCall[prop]) {
            this._methodsToCall[prop](val);
        }
        if (!this._wait) {
            litRender(this.render(), this.shadowRoot);
        }
    }
    /**
     * Gets called when an observed attribute changes. Calls `_propertiesChanged`
     *
     * @param {string} prop
     * @param {any} old
     * @param {any} val
     */
    attributeChangedCallback(prop, old, val) {
        if (old === val)
            return;
        if (this.__data[prop] !== val) {
            const { type } = this.constructor.properties[prop];
            if (type.name === 'Boolean') {
                if (val !== 'false') {
                    this.__data[prop] = this.hasAttribute(prop);
                }
                else {
                    this.__data[prop] = false;
                }
            }
            else
                this.__data[prop] = type(val);
            this._propertiesChanged(prop, val);
        }
    }
    /**
     * Returns what lit-html should render.
     *
     * @returns
     */
    render() {
        return html ``;
    }
    /**
     * Gets all children with ids.
     *
     * @readonly
     */
    get $() {
        const arr = this.shadowRoot.querySelectorAll('[id]');
        const obj = {};
        for (const el of arr) {
            obj[el.id] = el;
        }
        return obj;
    }
};
//# sourceMappingURL=lit-element.js.map