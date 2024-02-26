define(["require", "exports", "esri/widgets/BasemapGallery", "esri/widgets/BasemapGallery/support/LocalBasemapsSource", "esri/Basemap", "esri/layers/WebTileLayer", "./config"], function (require, exports, BasemapGallery, LocalBasemapsSource, Basemap, WebTileLayer, config_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initBasemapGallery = void 0;
    var initBasemapGallery = function (div, view) {
        // 道路地図（vector）
        var streetsVMap = new Basemap({ portalItem: { id: config_1.streetsVMapPortalItem } });
        // 道路（夜）（streets-night-vector）
        var streetsNVMap = new Basemap({ portalItem: { id: config_1.streetsNVMapPortalItem } });
        // 地形図
        var topoVMap = new Basemap({ portalItem: { id: config_1.topoVMapPortalItem } });
        // キャンバス（ライトグレー）
        var canvasLVMap = new Basemap({ portalItem: { id: config_1.canvasLVMapPortalItem } });
        // 地理院タイル
        var stdMap = new Basemap({
            baseLayers: [new WebTileLayer({
                    urlTemplate: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
                    copyright: "地理院タイル （https://maps.gsi.go.jp/development/ichiran.html）"
                })],
            title: "地理院タイル - 標準地図",
            //id: "stdmap",
            id: "gsistd",
            thumbnailUrl: "https://cyberjapandata.gsi.go.jp/xyz/std/12/3637/1612.png"
        });
        // WebTileLayer:地理院タイル（淡色地図）
        // 地理院タイルの形式から WebTileLayer への読み換え
        // 【読み換え前】https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png
        // 【読み換え後】https://cyberjapandata.gsi.go.jp/xyz/pale/{level}/{col}/{row}.png
        var paleMap = new Basemap({
            baseLayers: [new WebTileLayer({
                    urlTemplate: "https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png",
                    copyright: "地理院タイル （https://maps.gsi.go.jp/development/ichiran.html）"
                })],
            title: "地理院タイル - 淡色地図",
            //id: "palemap",
            id: "gsipale",
            //opacity:0.9,
            thumbnailUrl: "https://cyberjapandata.gsi.go.jp/xyz/pale/12/3637/1612.png"
        });
        var seamlessPhoto = new Basemap({
            baseLayers: [new WebTileLayer({
                    urlTemplate: "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.png",
                    copyright: "地理院タイル （https://maps.gsi.go.jp/development/ichiran.html）"
                })],
            title: "地理院タイル - 写真",
            id: "seamlessphoto",
            thumbnailUrl: "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/16/58274/25716.jpg"
        });
        var localSource = new LocalBasemapsSource({
            basemaps: [streetsVMap, streetsNVMap, topoVMap, canvasLVMap, stdMap, paleMap, seamlessPhoto]
        });
        return new BasemapGallery({
            view: view,
            container: div,
            source: localSource
        });
    };
    exports.initBasemapGallery = initBasemapGallery;
});
//# sourceMappingURL=basemapGallery.js.map