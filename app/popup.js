define(["require", "exports", "esri/PopupTemplate", "./chart"], function (require, exports, PopupTemplate, chart_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.chikakojiPopupTemplate = exports.cityPopupTemplate = void 0;
    // ポップアップ設定の方法ー１
    // 市区町村用のPopupTemplate の作成
    var cityPopupTemplate = new PopupTemplate({
        title: "全国市区町村界",
        content: [
            {
                type: "text",
                text: "自治体コード: {JCODE}" + "</br>" + "都道府県名: {KEN}" + "</br>" + "市区町村名: {SEIREI}{SIKUCHOSON}"
            }
        ]
    });
    exports.cityPopupTemplate = cityPopupTemplate;
    // ポップアップ設定の方法ー２
    // 変動率の計算
    function calChange(year_val, last_year_val) {
        return (year_val - last_year_val) / last_year_val;
    }
    // 平均変動率を幾何平均で計算(以下を参考にしてオーバフローしないようにlogを使って計算)
    // https://www.geeksforgeeks.org/geometric-mean-two-methods/?ref=gcse
    // n年間の平均変動率
    function geometricMean(arr, n) {
        var sum = 0;
        for (var i = 0; i < n; i++)
            sum = sum + Math.log(arr[i]);
        sum = sum / n;
        return Math.exp(sum);
    }
    // 公示地価用のPopupTemplate の作成
    var chikakojiPopupTemplate = new PopupTemplate({
        title: "公示地価: {L01_001}",
        outFields: ["*"],
        content: landpriceChange,
        fieldInfos: [
            {
                fieldName: "L01_096",
                format: {
                    digitSeparator: true,
                    places: 0 // 整数で表示する
                }
            },
            {
                fieldName: "L01_097",
                label: "令和元年価格(円/m2)",
                format: {
                    digitSeparator: true,
                    places: 0
                }
            },
            {
                fieldName: "L01_098",
                format: {
                    digitSeparator: true,
                    places: 0
                }
            },
            {
                fieldName: "L01_099",
                format: {
                    digitSeparator: true,
                    places: 0
                }
            },
            {
                fieldName: "L01_100",
                format: {
                    digitSeparator: true,
                    places: 0
                }
            }
        ]
    });
    exports.chikakojiPopupTemplate = chikakojiPopupTemplate;
    // content で指定するfunction の定義
    function landpriceChange(feature) {
        var div = document.createElement("div");
        // 上昇/下降の矢印をSVGで定義
        var upArrow = '<svg width="16" height="16" ><polygon points="14.14 7.07 7.07 0 0 7.07 4.07 7.07 4.07 16 10.07 16 10.07 7.07 14.14 7.07" style="fill:green"/></svg>';
        var downArrow = '<svg width="16" height="16"><polygon points="0 8.93 7.07 16 14.14 8.93 10.07 8.93 10.07 0 4.07 0 4.07 8.93 0 8.93" style="fill:red"/></svg>';
        // 住所
        //const address = feature.graphic.attributes.L01_025; //住居表示 R4版でL01_023 => L01_025 
        var address = feature.graphic.attributes.L01_024; // 2022.3.31 住居表示から所在および地番に変更
        // 5年間の平均変動率の計算
        var yearH30 = feature.graphic.attributes.L01_096;
        var yearR1 = feature.graphic.attributes.L01_097;
        var yearR2 = feature.graphic.attributes.L01_098;
        var yearR3 = feature.graphic.attributes.L01_099;
        var yearR4 = feature.graphic.attributes.L01_100;
        var diff1 = calChange(yearR1, yearH30) + 1;
        var diff2 = calChange(yearR2, yearR1) + 1;
        var diff3 = calChange(yearR3, yearR2) + 1;
        var diff4 = calChange(yearR4, yearR3) + 1;
        //const arr = [diff1, diff2, diff3, diff4];
        var arr = [];
        // NaN か Infinity でない場合計算対象
        if (isFinite(diff1)) {
            arr.push(diff1);
        }
        ;
        if (isFinite(diff2)) {
            arr.push(diff2);
        }
        ;
        if (isFinite(diff3)) {
            arr.push(diff3);
        }
        ;
        if (isFinite(diff4)) {
            arr.push(diff4);
        }
        ;
        var n = arr.length;
        var geoMean = geometricMean(arr, n);
        // % に変更
        diff1 = (diff1 - 1) * 100;
        diff2 = (diff2 - 1) * 100;
        diff3 = (diff3 - 1) * 100;
        diff4 = (diff4 - 1) * 100;
        geoMean = (geoMean - 1) * 100;
        var arrow = geoMean >= 0 ? upArrow : downArrow;
        div.innerHTML = "住所:" + (address ? address : "") + "</br>" + // 2022.3.31 変更 "住居表示:" + (address ? address : "") + "</br>" + 
            "公示価格(円/m2): " + (yearR4 ? yearR4.toLocaleString() : "") + "</br>" +
            "<ul>" +
            "<li>平成30年価格(円/m2): " + (yearH30 ? yearH30.toLocaleString() : "") + "</li>" +
            "<li>令和元年価格(円/m2): " + (yearR1 ? yearR1.toLocaleString() : "") + " 変動率: " + (isFinite(diff1) ? diff1.toFixed(2) : "---") + "%</li>" +
            "<li>令和02年価格(円/m2): " + (yearR2 ? yearR2.toLocaleString() : "") + " 変動率: " + (isFinite(diff2) ? diff2.toFixed(2) : "---") + "%</li>" +
            "<li>令和03年価格(円/m2): " + (yearR3 ? yearR3.toLocaleString() : "") + " 変動率: " + (isFinite(diff3) ? diff3.toFixed(2) : "---") + "%</li>" +
            "<li>令和04年価格(円/m2): " + (yearR4 ? yearR4.toLocaleString() : "") + " 変動率: " + (isFinite(diff4) ? diff4.toFixed(2) : "---") + "%</li>" +
            "<li>" + (n + 1) + "年間の平均変動率: " + arrow +
            "<span style='color: " +
            (geoMean < 0 ? "red" : "green") + ";'>" +
            "<b>" + geoMean.toFixed(2) + "</b>" +
            "</span></li>" +
            "</ul>";
        // チャート作成して追加
        var chartCanvas = (0, chart_1.createHorizontalBarChart)(diff1, diff2, diff3, diff4, geoMean);
        div.appendChild(chartCanvas);
        return div;
    }
    ;
});
//# sourceMappingURL=popup.js.map