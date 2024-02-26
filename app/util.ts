import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");

// 汎用的に使うため関数化
// さらにquery の出力座標系を設定しないとエラーが発生する場合があるため修正
export const zoomToLayer = (layer :FeatureLayer, view :MapView) =>{
    const query = layer.createQuery();
    query.outSpatialReference = view.spatialReference;
    return layer.queryExtent(query).then
      ((response) => {
          view.goTo(response.extent, {"duration":1000}).catch
          ((error) => {
              console.error(error);
          });
      });
};

export const createDefinitionExpression = (subExpression :string) => {
    const chikakojiExpression = "L01_022 LIKE '" + subExpression + "%'";
    const cityareaExpression = "JCODE LIKE '" + subExpression + "%'";
    return {chikaExp: chikakojiExpression, cityExp:cityareaExpression}
};

