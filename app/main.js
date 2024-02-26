var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "esri/Map", "esri/Basemap", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/symbols/SimpleMarkerSymbol", "esri/renderers/SimpleRenderer", "esri/widgets/Expand", "./config", "./popup", "./util", "./basemapGallery", "esri/symbols/SimpleFillSymbol"], function (require, exports, Map_1, Basemap_1, MapView_1, FeatureLayer_1, SimpleMarkerSymbol_1, SimpleRenderer_1, Expand_1, config_1, popup_1, util_1, basemapGallery_1, SimpleFillSymbol) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Map_1 = __importDefault(Map_1);
    Basemap_1 = __importDefault(Basemap_1);
    MapView_1 = __importDefault(MapView_1);
    FeatureLayer_1 = __importDefault(FeatureLayer_1);
    SimpleMarkerSymbol_1 = __importDefault(SimpleMarkerSymbol_1);
    SimpleRenderer_1 = __importDefault(SimpleRenderer_1);
    Expand_1 = __importDefault(Expand_1);
    /**********************************************************************************
    *
    * シンボルを作成
    *
    **********************************************************************************/
    //地価公示レイヤーのシンボルを定義
    //typescript ではautocast は使えない。type を指定するとエラーになるよう
    var chikakojiLyrSymbol = new SimpleMarkerSymbol_1.default({
        //type: "simple-marker",
        size: 8,
        color: "#0000ff",
        outline: {
            color: "white",
            width: 1
        }
    });
    /**********************************************************************************
    *
    * レンダラーを作成
    *
    **********************************************************************************/
    //シンプルレンダラーを定義
    //typescript ではautocast は使えない。type を指定するとエラーになるよう
    var renderer = new SimpleRenderer_1.default({
        //type: "simple",
        symbol: chikakojiLyrSymbol,
    });
    /**********************************************************************************
     * 2つのFeatureLayer のインスタンスを作成
     * 2) FeatureLayer:公示地価(令和3年1月1日) Living Atlas
     * 3) FeatureLayer:全国市区町村界データ（簡易版） Living Atlas
     **********************************************************************************/
    // FeatureLayer：公示地価(令和3年1月1日)：Living Atlas
    var chikakojiLyr = new FeatureLayer_1.default({
        url: "https://services.arcgis.com/wlVTGRSYTzAbjjiC/arcgis/rest/services/LandPrice/FeatureServer",
        id: "chikakoji",
        //上で作成したレンダラーを適用する
        renderer: renderer,
        // 2021にデータを変更したことに伴いレイヤーが愛知県のみとなるようフィルタ定義を追加
        // 2022.3.28更新の令和4年版に対応（国土数値情報の製品仕様書第3.1版）
        definitionExpression: "L01_022 LIKE '23%'" // 行政区域コード L01_021 => L01_022 に
    });
    // FeatureLayer：全国市区町村界データ 2021： Living Atlas
    var cityareaLyr = new FeatureLayer_1.default({
        url: "https://services.arcgis.com/wlVTGRSYTzAbjjiC/arcgis/rest/services/municipalityboundaries2021/FeatureServer",
        id: "cityarea",
        opacity: 0.5,
        minScale: 5000000,
        maxScale: 50000,
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
    var map = new Map_1.default({
        basemap: new Basemap_1.default({ portalItem: { id: config_1.streetsVMapPortalItem } } //"accf3eff22254ed69e23afeb094a4881"}}
        ),
        layers: [chikakojiLyr]
    });
    // もしくは map.add() を使って map にレイヤーを追加することも可能
    // レイヤー描画の順番が変更された模様
    map.add(cityareaLyr, 0);
    // MapView を作成し map インスタンスを追加
    var view = new MapView_1.default({
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
    var chikakojiLyrView; // 2022.07.08 ハイライト表示用に追加
    view.when(function () {
        chikakojiLyr.when(function () {
            (0, util_1.zoomToLayer)(chikakojiLyr, view);
        });
        // 2022.6.26 追加
        cityareaLyr.when(function () {
            updateCitySelect(cityareaLyr, cityareaLyr.definitionExpression);
        });
        view.whenLayerView(chikakojiLyr).then(function (layerView) {
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
    var chikakojiToggle = document.getElementById("chikakojiLyr");
    var cityareaToggle = document.getElementById("cityareaLyr");
    chikakojiToggle.addEventListener("calciteCheckboxChange", function (ev) {
        chikakojiLyr.visible = !(chikakojiLyr.visible);
    });
    cityareaToggle.addEventListener("calciteCheckboxChange", function (ev) {
        cityareaLyr.visible = !(cityareaLyr.visible);
    });
    /**********************************************************************************
    *
    * 操作パネル制御
    * ※2021に追加:
    *     calcite-panel を使った次のサンプルを参考にアレンジ：
    *     https://developers.arcgis.com/javascript/latest/sample-code/sandbox/?sample=featurelayer-query-pagination
    **********************************************************************************/
    var resultPanel = document.getElementById("controlsDiv");
    var toggleButton = document.getElementById("toggle-button");
    view.ui.add(toggleButton, "top-left");
    toggleButton.addEventListener("click", function () {
        if (resultPanel.clientWidth == 390) {
            resultPanel.style.width = "0px";
            //toggleButton.icon = "chevrons-right";
            toggleButton.title = "パネルを展開";
        }
        else {
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
    cityareaLyr.popupTemplate = popup_1.cityPopupTemplate;
    // ポップアップ設定の方法ー２
    // 公示地価用のPopupTemplate の作成
    // 地価公示レイヤーに PopupTemplate を設定する
    chikakojiLyr.popupTemplate = popup_1.chikakojiPopupTemplate;
    /**********************************************************************************
    *
    * 背景地図の切り替えを Custom BasemapGallery で切り替え可能なように変更
    * 2022.07.19 追加
    *
    * typescript のバージョンでは、basemapGallery をモジュール化
    **********************************************************************************/
    var basemapGalleryExpand = new Expand_1.default({
        view: view,
        content: (0, basemapGallery_1.initBasemapGallery)(document.createElement("div"), view),
        expandIconClass: "esri-icon-basemap",
        autoCollapse: true
    });
    view.ui.add(basemapGalleryExpand, "bottom-right");
    /**********************************************************************************
    *
    * 都道府県の切り替え機能をtypescript のバージョン で入れてみた
    **********************************************************************************/
    var prefExpand = new Expand_1.default({
        view: view,
        content: document.getElementById("prefcontrolsDiv"),
        expandIconClass: "esri-icon-swap",
        autoCollapse: true
    });
    view.ui.add(prefExpand, "bottom-left");
    // util へ移植
    // function createDefinitionExpression(subExpression :string) {
    // }
    // 選択した都道府県をもとに市区町村名の一覧を更新
    // <calcite-select id="citySelect"></calcite-select> 
    function updateCitySelect(cityareaLyr, expression) {
        return __awaiter(this, void 0, void 0, function () {
            var citySelectElement, query;
            return __generator(this, function (_a) {
                // Selectをクリア
                document.getElementById("citySelect").innerText = null;
                citySelectElement = document.getElementById("citySelect");
                citySelectElement.selectedOption = null;
                // 検索結果をクリア
                doClear();
                query = cityareaLyr.createQuery();
                query.where = expression;
                query.outFields = ["JCODE", "KEN", "SEIREI", "SIKUCHOSON"];
                query.returnGeometry = false;
                cityareaLyr.queryFeatures(query).then(function (response) {
                    var citySelectElement = document.getElementById("citySelect");
                    for (var i = 0; i < response.features.length; i++) {
                        var cityname = response.features[i].attributes["SEIREI"] + response.features[i].attributes["SIKUCHOSON"];
                        var citycode = response.features[i].attributes["JCODE"];
                        //console.log(i, cityname.trim());
                        //citynames.push(cityname.trim());
                        // calcite-option を作成し、calcite-select の子要素として追加
                        // <calcite-option value="citycode">cityname</calcite-option>
                        var cityOptionElement = document.createElement("calcite-option");
                        cityOptionElement.value = citycode;
                        cityOptionElement.label = cityname;
                        if (i == 0) {
                            cityOptionElement.selected = true;
                        }
                        citySelectElement.appendChild(cityOptionElement);
                    }
                }).catch(function (error) {
                    console.error(error);
                });
                return [2 /*return*/];
            });
        });
    }
    //<calcite-input id="attrTxt" prefix-text="市区町村名" type="text"
    //placeholder="例:豊田市" max-length="10"></calcite-input>
    var citynames = [];
    function updatePlaceholder(cityareaLyr, expression) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                if (citynames.length > 0) {
                    citynames.length = 0;
                }
                query = cityareaLyr.createQuery();
                query.where = expression;
                query.outFields = ["KEN", "SEIREI", "SIKUCHOSON"];
                query.returnGeometry = false;
                //const citySel = document.getElementById("citySelect");
                cityareaLyr.queryFeatures(query).then(function (response) {
                    for (var i = 0; i < response.features.length; i++) {
                        var cityname = response.features[i].attributes["SEIREI"] + response.features[i].attributes["SIKUCHOSON"];
                        //console.log(i, cityname.trim());
                        citynames.push(cityname.trim());
                    }
                    //console.log(citynames);
                    //document.getElementById("attrTxt").placeholder = citynames[0];
                }).catch(function (error) {
                    console.error(error);
                });
                return [2 /*return*/];
            });
        });
    }
    var pref = document.getElementById("prefSelect");
    pref.addEventListener("calciteSelectChange", function (event) {
        //console.log(event.srcElement.value);
        var prefcode = event.srcElement.value;
        var _a = (0, util_1.createDefinitionExpression)(prefcode), chikaExp = _a.chikaExp, cityExp = _a.cityExp;
        //console.log(chikaExp, cityExp);
        chikakojiLyr.definitionExpression = chikaExp;
        cityareaLyr.definitionExpression = cityExp;
        //zoomToLayer(chikakojiLyr);
        updateCitySelect(cityareaLyr, cityExp);
        (0, util_1.zoomToLayer)(chikakojiLyr, view);
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
    var queryButton = document.getElementById("queryButton");
    var clearButton = document.getElementById("clearButton");
    // 実行ボタン処理
    queryButton.addEventListener("click", doQuery);
    // クリアボタン処理
    clearButton.addEventListener("click", doClear);
    // クリアの実行
    function doClear() {
        view.graphics.removeAll();
        document.getElementById("resultText").innerHTML = "";
        document.getElementById("controlsDiv").style.height = "30%";
        document.getElementById("resultsList").innerHTML = "";
        document.getElementById("resultsListDiv").style.display = "none";
    }
    // クエリの実行
    function doQuery() {
        return __awaiter(this, void 0, void 0, function () {
            var citySelectElement, cityOptionElement, citycode, cityname, queryParams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // 前回のクエリ結果を削除
                        doClear();
                        citySelectElement = document.getElementById("citySelect");
                        cityOptionElement = citySelectElement.selectedOption;
                        // code で初期化時、selected が正しく動作していないので回避(null か undefined の場合、強制的に先頭の値を使う)
                        if (cityOptionElement == null) {
                            console.log(citySelectElement.selectedOption);
                            cityOptionElement = citySelectElement.firstChild;
                        }
                        citycode = cityOptionElement.value;
                        cityname = cityOptionElement.label;
                        console.log(citycode, cityname);
                        queryParams = cityareaLyr.createQuery();
                        queryParams.where = "JCODE LIKE '" + citycode + "'";
                        queryParams.returnGeometry = true;
                        queryParams.outSpatialReference = view.spatialReference;
                        return [4 /*yield*/, cityareaLyr.queryFeatures(queryParams)
                                .then(showCityArea)
                                .then(queryChikakoji)
                                .then(showChikakoji)
                                .catch(showErr)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    // 市区町村の表示
    function showCityArea(results) {
        if (results.features.length > 0) {
            var graphics_1 = results.features.map(function (feature) {
                var graphic = feature.clone();
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
            view.graphics.addMany(graphics_1);
            view.goTo(graphics_1);
            return results.features;
        }
    }
    // 空間検索して地価公示を取得
    function queryChikakoji(features) {
        return __awaiter(this, void 0, void 0, function () {
            var queryParams;
            return __generator(this, function (_a) {
                queryParams = chikakojiLyr.createQuery();
                queryParams.geometry = features[0].geometry;
                queryParams.spatialRelationship = "contains";
                queryParams.where = "1 = 1";
                queryParams.returnGeometry = true;
                // クエリの実行
                return [2 /*return*/, chikakojiLyr.queryFeatures(queryParams)];
            });
        });
    }
    // クエリの結果を表示
    var graphics = null;
    function showChikakoji(results) {
        if (results.features.length > 0) {
            graphics = results.features.map(function (feature) {
                var graphic = feature.clone();
                graphic.symbol = new SimpleMarkerSymbol_1.default({
                    //type: "simple-marker",
                    color: "#ffb700",
                    size: "12px"
                });
                return graphic;
            });
            // グラフィックを表示
            view.graphics.addMany(graphics);
            // グラフィックへズーム
            //view.goTo(graphics);
            // フィーチャ数の表示
            var count = results.features.length;
            document.getElementById("resultText").innerHTML = "地価公示地点: " + count + " 箇所";
            // 取得した結果を"calcite-pick-list-item"のアイテムとしてリスト表示
            document.getElementById("resultsList").innerHTML = "";
            graphics.forEach(function (result, index) {
                var attributes = result.attributes;
                var item = document.createElement("calcite-pick-list-item");
                //item.setAttribute("label", attributes.L01_024);
                //item.setAttribute("value", index);
                item.label = attributes.L01_024;
                item.value = index;
                var usage = "\u5229\u7528\u72B6\u6CC1: ".concat(attributes.L01_027);
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
    var highlightSelect;
    // 結果リスト用のクリック処理
    function resultClickHandler(event) {
        var target = event.target;
        var resultId = target.value;
        var result = resultId && graphics && graphics[parseInt(resultId, 10)];
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
        if (highlightSelect) {
            highlightSelect.remove();
        }
        highlightSelect = chikakojiLyrView.highlight(result);
    }
    // エラーの表示
    function showErr(err) {
        console.log("err:", err);
        // 前回のクエリ結果を削除
        doClear();
    }
});
//# sourceMappingURL=main.js.map