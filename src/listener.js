"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
exports.newListener = function (listenerCallback) {
    let listeners = [];
    const listener = function (listeners) {
        return function (e) {
            e.preventDefault();
            listenerCallback()(e);
            for (const listener of listeners) {
                listener(e);
            }
        };
    };
    const self = {
        then: function (nextListener) {
            if (utils_1.isFunction(nextListener)) {
                listeners.push(nextListener);
            }
            return this;
        },
        attachTo: function (target, type) {
            target.addEventListener(type, listener(listeners));
            listeners = [];
            return target;
        },
        click: function (target) {
            return self.attachTo(target, "click");
        },
    };
    return self;
};
