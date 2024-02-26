import BasemapGallery = require("esri/widgets/BasemapGallery");
import LocalBasemapsSource = require("esri/widgets/BasemapGallery/support/LocalBasemapsSource");
import Basemap = require("esri/Basemap");
import MapView = require("esri/views/MapView");
import WebTileLayer = require("esri/layers/WebTileLayer");
//import VectorTileLayer = require("esri/layers/VectorTileLayer");

import {streetsVMapPortalItem, streetsNVMapPortalItem, topoVMapPortalItem, canvasLVMapPortalItem} from "./config";

export const initBasemapGallery = (div: HTMLDivElement, view: MapView) => {

    // 道路地図（vector）
    const streetsVMap = new Basemap(
        {portalItem: {id: streetsVMapPortalItem}}
    );
    // 道路（夜）（streets-night-vector）
    const streetsNVMap = new Basemap(
        {portalItem: {id: streetsNVMapPortalItem}}
    );
    // 地形図
    const topoVMap = new Basemap(
        {portalItem: {id: topoVMapPortalItem}}
    );
    // キャンバス（ライトグレー）
    const canvasLVMap = new Basemap(
        {portalItem: {id: canvasLVMapPortalItem}}
    );
    
    // 地理院タイル
    const stdMap = new Basemap({
        baseLayers:[new WebTileLayer({
          urlTemplate: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
          copyright: "地理院タイル （https://maps.gsi.go.jp/development/ichiran.html）"
        })],
        title: "地理院タイル - 標準地図",
        //id: "stdmap",
        id:"gsistd",
        thumbnailUrl: "https://cyberjapandata.gsi.go.jp/xyz/std/12/3637/1612.png"
    });      

    // WebTileLayer:地理院タイル（淡色地図）
    // 地理院タイルの形式から WebTileLayer への読み換え
    // 【読み換え前】https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png
    // 【読み換え後】https://cyberjapandata.gsi.go.jp/xyz/pale/{level}/{col}/{row}.png
    const paleMap = new Basemap({
        baseLayers:[new WebTileLayer({
            urlTemplate: "https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png",
            copyright: "地理院タイル （https://maps.gsi.go.jp/development/ichiran.html）"
        })],
        title: "地理院タイル - 淡色地図",
        //id: "palemap",
        id:"gsipale",
        //opacity:0.9,
        thumbnailUrl: "https://cyberjapandata.gsi.go.jp/xyz/pale/12/3637/1612.png"
    });    
    
    const seamlessPhoto = new Basemap({
        baseLayers:[new WebTileLayer({
            urlTemplate: "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.png",
            copyright: "地理院タイル （https://maps.gsi.go.jp/development/ichiran.html）"
        })],
        title: "地理院タイル - 写真",
        id: "seamlessphoto",
        thumbnailUrl:"https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/16/58274/25716.jpg"
    });

    const localSource = new LocalBasemapsSource({
        basemaps:[streetsVMap, streetsNVMap, topoVMap, canvasLVMap, stdMap, paleMap, seamlessPhoto]
    });

    return new BasemapGallery({
        view: view,
        container: div,
        source: localSource
    });
};