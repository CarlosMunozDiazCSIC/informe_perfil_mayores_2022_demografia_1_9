//Desarrollo de las visualizaciones
import * as d3 from 'd3';
import { numberWithCommas2 } from '../helpers';
import { getInTooltip, getOutTooltip, positionTooltip } from '../modules/tooltip';
import { setChartHeight } from '../modules/height';
import { setChartCanvas, setChartCanvasImage } from '../modules/canvas-image';
import { setRRSSLinks } from '../modules/rrss';
import { setFixedIframeUrl } from './chart_helpers';

//Colores fijos
const COLOR_PRIMARY_1 = '#F8B05C', 
COLOR_PRIMARY_2 = '#E37A42',
COLOR_COMP_1 = '#528FAD', 
COLOR_COMP_2 = '#AADCE0',
COLOR_GREY_1 = '#D6D6D6', 
COLOR_GREY_2 = '#A3A3A3',
COLOR_ANAG__PRIM_1 = '#BA9D5F', 
COLOR_ANAG_PRIM_2 = '#9E6C51',
COLOR_ANAG_PRIM_3 = '#9E3515',
COLOR_ANAG_COMP_1 = '#1C5A5E';

export function initChart(iframe) {
    //Desarrollo del gráfico
    d3.csv('https://raw.githubusercontent.com/CarlosMunozDiazCSIC/informe_perfil_mayores_2022_demografia_1_9/main/data/distribucion_poblacion_extranjeros_v2.csv', function(error,data) {
        if (error) throw error;
        
        //Declaramos fuera las variables genéricas
        let margin = {top: 20, right: 20, bottom: 20, left: 85},
            width = document.getElementById('chart').clientWidth - margin.left - margin.right,
            height = document.getElementById('chart').clientHeight - margin.top - margin.bottom;

        let svg = d3.select("#chart")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        let gruposContinentes = ['UE27_2020','EU_NO_UE27','AF','AN','SUD','AS','OT_2'];

        //Ejes X
        let x = d3.scaleLinear()
            .domain([0,100])
            .range([0,width]);

        let xAxis = d3.axisBottom(x).ticks(5);
        
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        //Eje Y
        let y = d3.scaleBand()
            .domain(['todas','mas65'])
            .range([0, height]);
        
        let tickLabels = ['Total', '65 y más años'];

        let yAxis = function(g) {
            g.call(d3.axisLeft(y).tickFormat((d,i) => tickLabels[i]))
        }
        
        svg.append("g")
            .attr("class", "yaxis")
            .call(yAxis);

        let color = d3.scaleOrdinal()
            .domain(gruposContinentes)
            .range([COLOR_PRIMARY_1, COLOR_COMP_2, COLOR_COMP_1, COLOR_GREY_1, COLOR_OTHER_1, COLOR_OTHER_2]);

        let stackedDataContinentes = d3.stack()
            .keys(gruposContinentes)
            (data);
        
        function init() {
            svg.append("g")
                .attr('class','chart-g')
                .selectAll("g")
                .data(stackedDataContinentes)
                .enter()
                .append("g")
                .attr("fill", function(d) { return color(d.key); })
                .selectAll("rect")
                .data(function(d) { return d; })
                .enter()
                .append("rect")
                .attr('class','rect')
                .attr("y", function(d) { return y(d.data.grupo) + y.bandwidth() / 4; })
                .attr("x", function(d) { return 0; })
                .attr("width", function(d) { return x(0); })
                .attr("height", y.bandwidth() / 2)
                .transition()
                .duration(2000)
                .attr("x", function(d) { return x(d[0]); })
                .attr("width", function(d) { return x(d[1]) - x(d[0]); });
        }

        function animateChart() {
            svg.selectAll('.rect')
                .attr("y", function(d) { return y(d.data.grupo) + y.bandwidth() / 4; })
                .attr("x", function(d) { return 0; })
                .attr("width", function(d) { return x(0); })
                .attr("height", y.bandwidth() / 2)
                .transition()
                .duration(2000)
                .attr("x", function(d) { return x(d[0]); })
                .attr("width", function(d) { return x(d[1]) - x(d[0]); });
        }

        /////
        /////
        // Resto - Chart
        /////
        /////
        init();

        //Animación del gráfico
        document.getElementById('replay').addEventListener('click', function() {
            animateChart();
        });

        /////
        /////
        // Resto
        /////
        /////

        //Iframe
        setFixedIframeUrl('informe_perfil_mayores_2022_demografia_1_9','distribucion_poblacion_mayor_extranjera');

        //Redes sociales > Antes tenemos que indicar cuál sería el texto a enviar
        setRRSSLinks('distribucion_poblacion_mayor_extranjera');

        //Captura de pantalla de la visualización
        setChartCanvas();

        let pngDownload = document.getElementById('pngImage');

        pngDownload.addEventListener('click', function(){
            setChartCanvasImage('distribucion_poblacion_mayor_extranjera');
        });

        //Altura del frame
        setChartHeight(iframe);
    });    
}