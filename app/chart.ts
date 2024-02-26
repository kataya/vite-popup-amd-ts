// Chart.js はいろいろ試して
//import {Chart} from 'chart.js'; 
//"https://cdnjs.com/libraries/Chart.js"
//import { Chart, registerables } from 'chart.js';
// https://www.chartjs.org/docs/latest/getting-started/integration.html

// Chart.js はいろいろ試してRequireJS での記述がある内容が関係しているので、module へのパスを設定するようにした
// RequireJS can not load CommonJS module as is , so be sure to require one of the UMD builds instead (i.e. dist/chart.js, dist/chart.min.js, etc.).
//@ts-ignore // 警告を無視
import { Chart, registerables } from '../node_modules/chart.js/dist/chart.js';
Chart.register(...registerables);

// Chart.js 3.x で横棒グラフを作成
export function createHorizontalBarChart(diff1 :number, diff2 :number, diff3 :number, diff4 :number, geoMean :number){
    
    const canvas = document.createElement("canvas");

    const data = {
                labels: [
                    'H29～H30','H30～R01','R01～R02','R02～R03','5年平均'
                ],
                datasets:[{
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
    const myChart :Chart = new Chart(canvas.getContext("2d"),{
        type: 'bar', 
        data: data,
        options: {
            responsive: false, //canvasサイズの自動設定を使わない
            plugins: {
                legend:{ // グラフ凡例を非表示に設定
                    display: false
                }
            },
            indexAxis: 'y', //Chart.js 3.x系では横棒グラフの場合に設定
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

