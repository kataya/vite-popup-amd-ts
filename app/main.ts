/*********************************
* はじめてのWebマッピングアプリケーション開発；最新化とポップアッツの設定編その２を
* typescript で書き換えしてみる
* https://github.com/EsriJapan/arcgis-samples-4.0-js/blob/gh-pages/samples/startup_api/popup/popup_plus.html
* 
* typescript & amd は次を参考にした
* https://github.com/RalucaNicola/get-started-arcgis-js-api
* 
* typescript & amd & calcite-component
* https://github.com/ekenes/feature-sorting
*********************************/
/* 
tsconfig.json で
  "compilerOptions"
    {"esModuleInterop": true} を設定している場合には
    import Map from "esri/Map"; の書き方が可能
    
    設定していない場合は
    import Map = require("esri/Map"); の書き方になる
*/
import Map from "esri/Map";
import Basemap from "esri/Basemap";
import MapView from "esri/views/MapView";
import WebTileLayer from "esri/layers/WebTileLayer";
import FeatureLayer from "esri/layers/FeatureLayer";
import PopupTemplate from "esri/PopupTemplate";
import SimpleMarkerSymbol from "esri/symbols/SimpleMarkerSymbol";
import SimpleRenderer from "esri/renderers/SimpleRenderer";
import Expand from "esri/widgets/Expand";
import FeatureLayerView from "esri/views/layers/FeatureLayerView";

import esri = __esri;

import {streetsVMapPortalItem} from "./config";
import {cityPopupTemplate, chikakojiPopupTemplate} from "./popup";
import {zoomToLayer, createDefinitionExpression} from "./util";
import {initBasemapGallery} from "./basemapGallery"
import FeatureSet = require("esri/rest/support/FeatureSet");
import SimpleFillSymbol = require("esri/symbols/SimpleFillSymbol");
import Graphic = require("esri/Graphic");
import LayerView = require("esri/views/layers/LayerView");


/**********************************************************************************
*
* シンボルを作成
*
**********************************************************************************/
//地価公示レイヤーのシンボルを定義
//typescript ではautocast は使えない。type を指定するとエラーになるよう
const chikakojiLyrSymbol  = new SimpleMarkerSymbol({
    //type: "simple-marker",
    size: 8,
    color: "#0000ff", //new Color("#0000ff"),
    outline: {
        color: "white",
        width: 1
    }
})

/**********************************************************************************
*
* レンダラーを作成
*
**********************************************************************************/     
//シンプルレンダラーを定義
//typescript ではautocast は使えない。type を指定するとエラーになるよう
const renderer = new SimpleRenderer({
    //type: "simple",
    symbol: chikakojiLyrSymbol,
})

/**********************************************************************************
 * 2つのFeatureLayer のインスタンスを作成
 * 2) FeatureLayer:公示地価(令和3年1月1日) Living Atlas
 * 3) FeatureLayer:全国市区町村界データ（簡易版） Living Atlas
 **********************************************************************************/  
// FeatureLayer：公示地価(令和3年1月1日)：Living Atlas
const chikakojiLyr = new FeatureLayer({
    url:"https://services.arcgis.com/wlVTGRSYTzAbjjiC/arcgis/rest/services/LandPrice/FeatureServer",
    id:"chikakoji",
    //上で作成したレンダラーを適用する
    renderer: renderer,
    // 2021にデータを変更したことに伴いレイヤーが愛知県のみとなるようフィルタ定義を追加
    // 2022.3.28更新の令和4年版に対応（国土数値情報の製品仕様書第3.1版）
    definitionExpression: "L01_022 LIKE '23%'" // 行政区域コード L01_021 => L01_022 に
});

// FeatureLayer：全国市区町村界データ 2021： Living Atlas
const cityareaLyr = new FeatureLayer({
    url:"https://services.arcgis.com/wlVTGRSYTzAbjjiC/arcgis/rest/services/municipalityboundaries2021/FeatureServer",
    id:"cityarea",
    opacity:0.5,
    minScale:5000000, //1500000,　
    maxScale:50000,
    visible: false,
    // 上記と同様にこちらも愛知県のみになるようフィルタ定義を追加
    definitionExpression: "JCODE LIKE '23%'"
});

/**********************************************************************************
 * 
 * Map の作成と レイヤー の追加
 * ※2021に変更:
 *     ラスターベースマップが更新されなくなるので、ベクターベースマップ（日本語）に切り替え
 *     単純に well known id "streets-vector" でbasemap を指定すると英語地図になってしまうのでbasemapのid を指定して追加
 *         道路地図（vector）のidは "accf3eff22254ed69e23afeb094a4881"
 *         以下でクエリした一覧に日本語ベクタータイルが含まれる：
 *         https://www.arcgis.com/home/user.html?user=Esri_cy_JP
 **********************************************************************************/  
// Map を作成
// コンストラクター内でレイヤーを追加
const map = new Map({
    basemap: new Basemap(
        {portalItem: {id: streetsVMapPortalItem}} //"accf3eff22254ed69e23afeb094a4881"}}
    ),//"streets-vector"
    layers:[chikakojiLyr]
});

// もしくは map.add() を使って map にレイヤーを追加することも可能
// レイヤー描画の順番が変更された模様
map.add(cityareaLyr,0);

// MapView を作成し map インスタンスを追加
const view = new MapView({
    container: "viewDiv",
    map: map
});



/**********************************************************************************
* ロードされた時 もしくは すべてのプロパティにアクセスできるようになったとき
* layer.when('callback') で指定されるコールバック関数が実行される
*
* 地価公示レイヤーがロードされると、view が初期表示範囲として
* レイヤーの表示範囲にズームしながら移動していく処理
* ※2021に変更:
*     地価公示を愛知県だけのものから全国のレイヤーに変更したが、アプリでは愛知県のみに絞り込むため、
*     definitionExpression　を定義した。そのため、view.goTo の書き方も以下のHelpにあるように変更した。
*     https://developers.arcgis.com/javascript/latest/sample-code/featurelayer-queryextent/
**********************************************************************************/
let chikakojiLyrView : FeatureLayerView; // 2022.07.08 ハイライト表示用に追加
view.when(() => {
    chikakojiLyr.when(() => {
        zoomToLayer(chikakojiLyr, view);
    });
    // 2022.6.26 追加
    cityareaLyr.when(() => {
        updateCitySelect(cityareaLyr, cityareaLyr.definitionExpression);
    });
    view.whenLayerView(chikakojiLyr).then(layerView => {
        chikakojiLyrView = layerView;
    });
});


/**********************************************************************************
 * レイヤーの visible プロパティで view 内でのレイヤーの表示/非表示を切り替えを行う
 * なお、レイヤーが非表示状態であっても、そのレイヤーのプロパティにアクセスしたり、
 * そのレイヤーに対して解析を実行することは可能
 * * ※2021に変更:
 *     dojo/on を使っていたものから書き換え、ついでにアロー関数で書き換え、レイヤーのvisible 状態を反転に書き換え
 **********************************************************************************/
/* typescript でのイベントは次を参考にした
//https://medium.com/geekculture/html-event-handling-in-typescript-b9ca7178d912
//
cityareaToggle.addEventListener("click", cityareaLyrToggleFunction);
function cityareaLyrToggleFunction(this: HTMLElement, ev: Event){
    cityareaLyr.visible = !(cityareaLyr.visible);
}
*/
const chikakojiToggle = document.getElementById("chikakojiLyr") as HTMLCalciteCheckboxElement;
const cityareaToggle = document.getElementById("cityareaLyr") as HTMLCalciteCheckboxElement;

chikakojiToggle.addEventListener("calciteCheckboxChange", (ev: Event) => {
    chikakojiLyr.visible = !(chikakojiLyr.visible);
});

cityareaToggle.addEventListener("calciteCheckboxChange", (ev: Event) => {
    cityareaLyr.visible = !(cityareaLyr.visible);
});


/**********************************************************************************
*
* 操作パネル制御
* ※2021に追加:
*     calcite-panel を使った次のサンプルを参考にアレンジ：
*     https://developers.arcgis.com/javascript/latest/sample-code/sandbox/?sample=featurelayer-query-pagination
**********************************************************************************/
const resultPanel = document.getElementById("controlsDiv");
const toggleButton = document.getElementById("toggle-button");
view.ui.add(toggleButton, "top-left");

toggleButton.addEventListener("click", () => {
    if (resultPanel.clientWidth == 390) {
        resultPanel.style.width = "0px";
        //toggleButton.icon = "chevrons-right";
        toggleButton.title = "パネルを展開";
    } else {
        resultPanel.style.width = "390px";
        //toggleButton.icon = "chevrons-left";
        toggleButton.title = "パネルを畳む";
    }
});



/**********************************************************************************
*
* ポップアップの設定
* ※2021に変更:
*     設定方法１は以前の記事で解説しているもの
*     設定方法２は、PopupTemplate のcontent にfunction を使った次のサンプルを参考にアレンジ:
*     (function で平成29年～令和3年の価格変動率と5年間の平均変動率を計算)
*     https://developers.arcgis.com/javascript/latest/sample-code/sandbox/?sample=popuptemplate-function
* 
* typescript のバージョンでは、popupTemplate の定義をそれぞれモジュール化
**********************************************************************************/
// ポップアップ設定の方法ー１
// 市区町村用のPopupTemplate の作成
cityareaLyr.popupTemplate = cityPopupTemplate;

// ポップアップ設定の方法ー２
// 公示地価用のPopupTemplate の作成
// 地価公示レイヤーに PopupTemplate を設定する
chikakojiLyr.popupTemplate = chikakojiPopupTemplate;

/**********************************************************************************
* 
* 背景地図の切り替えを Custom BasemapGallery で切り替え可能なように変更
* 2022.07.19 追加
* 
* typescript のバージョンでは、basemapGallery をモジュール化
**********************************************************************************/
const basemapGalleryExpand = new Expand({
    view: view,
    content: initBasemapGallery(document.createElement("div"), view),
    expandIconClass: "esri-icon-basemap",
    autoCollapse: true
});

view.ui.add(basemapGalleryExpand, "bottom-right");


/**********************************************************************************
* 
* 都道府県の切り替え機能をtypescript のバージョン で入れてみた
**********************************************************************************/
const prefExpand = new Expand({
    view: view,
    content: document.getElementById("prefcontrolsDiv"),
    expandIconClass: "esri-icon-swap",
    autoCollapse: true
});
view.ui.add(prefExpand,"bottom-left");


// util へ移植
// function createDefinitionExpression(subExpression :string) {
// }


// 選択した都道府県をもとに市区町村名の一覧を更新
// <calcite-select id="citySelect"></calcite-select> 
async function updateCitySelect(cityareaLyr :FeatureLayer, expression :string){

    // Selectをクリア
    document.getElementById("citySelect").innerText = null;

    // 都道府県切り替え時に残ってしまうようなのでここでクリア
    const citySelectElement = document.getElementById("citySelect") as HTMLCalciteSelectElement;
    citySelectElement.selectedOption = null;

    // 検索結果をクリア
    doClear();

    const query = cityareaLyr.createQuery();
    query.where = expression;
    query.outFields = ["JCODE","KEN","SEIREI","SIKUCHOSON"]
    query.returnGeometry = false;

    cityareaLyr.queryFeatures(query).then(function (response) {
        const citySelectElement = document.getElementById("citySelect") as HTMLCalciteSelectElement;
        for (let i = 0; i < response.features.length; i++){
            let cityname : string = response.features[i].attributes["SEIREI"] + response.features[i].attributes["SIKUCHOSON"];
            let citycode: string = response.features[i].attributes["JCODE"];
            //console.log(i, cityname.trim());
            //citynames.push(cityname.trim());
            // calcite-option を作成し、calcite-select の子要素として追加
            // <calcite-option value="citycode">cityname</calcite-option>
            let cityOptionElement = document.createElement("calcite-option") as HTMLCalciteOptionElement;
            cityOptionElement.value = citycode;
            cityOptionElement.label = cityname;
            if (i == 0){cityOptionElement.selected = true;}
            citySelectElement.appendChild(cityOptionElement);
        }
    }).catch(function (error) {
        console.error(error);
    })

}

//<calcite-input id="attrTxt" prefix-text="市区町村名" type="text"
//placeholder="例:豊田市" max-length="10"></calcite-input>
let citynames :string[] = []
async function updatePlaceholder(cityareaLyr :FeatureLayer, expression :string){

    if (citynames.length > 0) {citynames.length = 0;}

    const query = cityareaLyr.createQuery();
    query.where = expression;
    query.outFields = ["KEN","SEIREI","SIKUCHOSON"]
    query.returnGeometry = false;

    //const citySel = document.getElementById("citySelect");
    cityareaLyr.queryFeatures(query).then(function (response) {
        for (let i = 0; i < response.features.length; i++){
            let cityname : string = response.features[i].attributes["SEIREI"] + response.features[i].attributes["SIKUCHOSON"];
            //console.log(i, cityname.trim());
            citynames.push(cityname.trim());
        }
        //console.log(citynames);

        //document.getElementById("attrTxt").placeholder = citynames[0];
        
    }).catch(function (error) {
        console.error(error);
    })
}


const pref = document.getElementById("prefSelect");
pref.addEventListener("calciteSelectChange", (event :any) => {
    //console.log(event.srcElement.value);
    let prefcode = event.srcElement.value;
    let {chikaExp, cityExp} = createDefinitionExpression(prefcode);
    //console.log(chikaExp, cityExp);
    chikakojiLyr.definitionExpression = chikaExp;
    cityareaLyr.definitionExpression = cityExp;
    //zoomToLayer(chikakojiLyr);
    updateCitySelect(cityareaLyr, cityExp);
    zoomToLayer(chikakojiLyr, view);
});

/**********************************************************************************
*
* 今後のクエリの移植・拡張用に定義だけしておく
* ※2021に追加:
* ※2022年07月にクエリの拡張をMr.Hiramatsu が実装したものから移植
* 参考：
* https://developers.arcgis.com/javascript/latest/sample-code/sandbox/?sample=featurelayer-query-pagination
**********************************************************************************/
// 実行/クリアボタン定義
const queryButton = document.getElementById("queryButton");
const clearButton = document.getElementById("clearButton");

// 実行ボタン処理
queryButton.addEventListener("click", doQuery);

// クリアボタン処理
clearButton.addEventListener("click", doClear);

// クリアの実行
function doClear(){
    view.graphics.removeAll();
    document.getElementById("resultText").innerHTML = "";
    document.getElementById("controlsDiv").style.height = "30%";
    document.getElementById("resultsList").innerHTML = "";
    document.getElementById("resultsListDiv").style.display = "none";
}

// クエリの実行
async function doQuery(){

    // 前回のクエリ結果を削除
    doClear();

    // 選択している市区町村の情報を取得
    const citySelectElement = document.getElementById("citySelect") as HTMLCalciteSelectElement;
    let cityOptionElement = citySelectElement.selectedOption;
    // code で初期化時、selected が正しく動作していないので回避(null か undefined の場合、強制的に先頭の値を使う)
    if (cityOptionElement == null) {
        console.log(citySelectElement.selectedOption);
        cityOptionElement = citySelectElement.firstChild as HTMLCalciteOptionElement
    }
    const citycode = cityOptionElement.value;
    const cityname = cityOptionElement.label;
    console.log(citycode, cityname);

    //クエリパラメータの作成
    const queryParams = cityareaLyr.createQuery();
    queryParams.where = "JCODE LIKE '" + citycode + "'";
    queryParams.returnGeometry = true;
    queryParams.outSpatialReference = view.spatialReference;

    await cityareaLyr.queryFeatures(queryParams)
        .then(showCityArea)
        .then(queryChikakoji)
        .then(showChikakoji)
        .catch(showErr);
}

// 市区町村の表示
function showCityArea(results :FeatureSet) {
    if (results.features.length > 0){
        const graphics = results.features.map(feature => {
            const graphic = feature.clone();
            graphic.symbol = new SimpleFillSymbol({
                //type: "simple-fill",
                style: "none",
                outline: {
                    color: "#00ffff",
                    width: "5px"
                }
            });
            return graphic;
        });
        
        view.graphics.addMany(graphics);
        view.goTo(graphics);

        return results.features;
    } 
}

// 空間検索して地価公示を取得
async function queryChikakoji(features :Graphic[]) {
    const queryParams = chikakojiLyr.createQuery();
    queryParams.geometry = features[0].geometry;
    queryParams.spatialRelationship = "contains";
    queryParams.where = "1 = 1";
    queryParams.returnGeometry = true;

    // クエリの実行
    return chikakojiLyr.queryFeatures(queryParams);
}

// クエリの結果を表示
let graphics : esri.Graphic[] = null;
function showChikakoji(results :FeatureSet) {
    if (results.features.length > 0){
        graphics = results.features.map(feature => {
            const graphic = feature.clone();
            graphic.symbol = new SimpleMarkerSymbol({
                //type: "simple-marker",
                color: "#ffb700", //"#00ff80",
                size: "12px"
            });
            return graphic;
        });

        // グラフィックを表示
        view.graphics.addMany(graphics);
        // グラフィックへズーム
        //view.goTo(graphics);

        // フィーチャ数の表示
        const count = results.features.length;
        document.getElementById("resultText").innerHTML = "地価公示地点: " + count + " 箇所";

        // 取得した結果を"calcite-pick-list-item"のアイテムとしてリスト表示
        document.getElementById("resultsList").innerHTML = "";
        graphics.forEach((result, index) => {
            const attributes = result.attributes;
            const item = document.createElement("calcite-pick-list-item") as HTMLCalcitePickListItemElement;
            //item.setAttribute("label", attributes.L01_024);
            //item.setAttribute("value", index);
            item.label = attributes.L01_024;
            item.value = index;

            const usage = `利用状況: ${attributes.L01_027}`;
            //item.setAttribute("description", usage);
            item.description = usage;
            //item.addEventListener("click", resultClickHandler);
            item.addEventListener("calciteListItemChange", resultClickHandler);
            
            document.getElementById("resultsList").appendChild(item);
        });

        document.getElementById("resultsListDiv").style.display = "block";
        document.getElementById("controlsDiv").style.height = "76%";
    }
    else { //地価公示が地点がない市町村
        document.getElementById("resultText").innerHTML = "地価公示地点: 0 箇所";
        document.getElementById("resultsListDiv").style.display = "block";
        document.getElementById("controlsDiv").style.height = "32%";
    }
}

let highlightSelect :esri.Handle;
// 結果リスト用のクリック処理
function resultClickHandler(event: any) {
    const target = event.target;
    const resultId = target.value;
    const result = resultId && graphics && graphics[parseInt(resultId, 10)];
    // popup
    if (result) {
        // 対象のポイントのポップアップを表示
        view.popup.open({
          features: [result],
          location: result.geometry
        });
        // 対象のポイントへ移動
        //view.goTo(result);
    }
    
    // ハイライト表示
    if (highlightSelect){
        highlightSelect.remove();
    }
    highlightSelect = chikakojiLyrView.highlight(result);
}

// エラーの表示
function showErr(err: string) {
    console.log("err:", err);
    // 前回のクエリ結果を削除
    doClear();
}

