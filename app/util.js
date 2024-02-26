define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createDefinitionExpression = exports.zoomToLayer = void 0;
    // 汎用的に使うため関数化
    // さらにquery の出力座標系を設定しないとエラーが発生する場合があるため修正
    var zoomToLayer = function (layer, view) {
        var query = layer.createQuery();
        query.outSpatialReference = view.spatialReference;
        return layer.queryExtent(query).then(function (response) {
            view.goTo(response.extent, { "duration": 1000 }).catch(function (error) {
                console.error(error);
            });
        });
    };
    exports.zoomToLayer = zoomToLayer;
    var createDefinitionExpression = function (subExpression) {
        var chikakojiExpression = "L01_022 LIKE '" + subExpression + "%'";
        var cityareaExpression = "JCODE LIKE '" + subExpression + "%'";
        return { chikaExp: chikakojiExpression, cityExp: cityareaExpression };
    };
    exports.createDefinitionExpression = createDefinitionExpression;
});
//# sourceMappingURL=util.js.map