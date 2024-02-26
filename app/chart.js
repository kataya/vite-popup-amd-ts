// Chart.js はいろいろ試して
//import {Chart} from 'chart.js'; 
//"https://cdnjs.com/libraries/Chart.js"
//import { Chart, registerables } from 'chart.js';
// https://www.chartjs.org/docs/latest/getting-started/integration.html
define(["require", "exports", "../node_modules/chart.js/dist/chart.js"], function (require, exports, chart_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createHorizontalBarChart = void 0;
    chart_js_1.Chart.register.apply(chart_js_1.Chart, chart_js_1.registerables);
    // Chart.js 3.x で横棒グラフを作成
    function createHorizontalBarChart(diff1, diff2, diff3, diff4, geoMean) {
        var canvas = document.createElement("canvas");
        var data = {
            labels: [
                'H29～H30', 'H30～R01', 'R01～R02', 'R02～R03', '5年平均'
            ],
            datasets: [{
                    data: [diff1, diff2, diff3, diff4, geoMean],
                    backgroundColor: [
                        (diff1 < 0 ? "red" : "green"),
                        (diff2 < 0 ? "red" : "green"),
                        (diff3 < 0 ? "red" : "green"),
                        (diff4 < 0 ? "red" : "green"),
                        (geoMean < 0 ? "red" : "green")
                    ]
                }]
        };
        // 横棒グラフを作成
        var myChart = new chart_js_1.Chart(canvas.getContext("2d"), {
            type: 'bar',
            data: data,
            options: {
                responsive: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                indexAxis: 'y',
                scales: {
                    x: {
                        suggestedMin: -1,
                        suggestedMax: 1,
                    }
                }
            }
        });
        return canvas;
    }
    exports.createHorizontalBarChart = createHorizontalBarChart;
});
//# sourceMappingURL=chart.js.map