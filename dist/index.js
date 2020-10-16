"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderNode = exports.getImageUrl = exports.defaultSerializers = void 0;
var hyperscript_1 = __importDefault(require("hyperscript"));
var object_assign_1 = __importDefault(require("object-assign"));
var getImageUrl_1 = __importDefault(require("./getImageUrl"));
exports.getImageUrl = getImageUrl_1.default;
var blocksToNodes_1 = __importDefault(require("./blocksToNodes"));
var serializers_1 = __importDefault(require("./serializers"));
var renderNode = function (serializer, properties, children) {
    var props = properties || {};
    if (typeof serializer === 'function') {
        return serializer(object_assign_1.default({}, props, { children: children }));
    }
    var tag = serializer;
    var childNodes = props.children || children;
    return hyperscript_1.default(tag, props, childNodes);
};
exports.renderNode = renderNode;
var _a = serializers_1.default(renderNode, { useDashedStyles: true }), defaultSerializers = _a.defaultSerializers, serializeSpan = _a.serializeSpan;
exports.defaultSerializers = defaultSerializers;
var blockContentToHyperscript = function (options) {
    return blocksToNodes_1.default(renderNode, options, defaultSerializers, serializeSpan);
};
exports.default = blockContentToHyperscript;
