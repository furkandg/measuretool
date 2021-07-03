<template>   
    <v-btn small fab dark v-bind:color="state=='draw-area'?'success':'primary'" v-on:click="startAreaMeasureDraw">
        <v-icon>mdi-shape-polygon-plus</v-icon>
    </v-btn>
    <!--<button class="btn btn-success btn-sm" v-on:click="startAreaMeasureDraw">asd</button>-->
</template>
<script>
  
    export default {
        props: ["map", "sourceMeasure", "state","measureLayer"],
        data: function () {
            return {
                helpMessage: "Çizime Başlayabilirsiniz",
                helpTooltipElement: "",
                helpTooltip: "",
                measureTooltipElement: null,
                measureTooltip: "",
                continuePolygonMsg: 'Click to continue drawing the polygon',
                continueLineMsg: 'Çizime Devam Edebilirsiniz',
                sketch: ""
            }
        },
        mounted: function () {

        },
        methods: {
            startAreaMeasureDraw() {
                this.map.removeInteractionByType(ol.interaction.Draw);
                var _self = this
                this.map.removeInteractionByType(ol.interaction.Select);
                this.map.removeInteractionByType(ol.interaction.Modify);
                this.createHelpTooltip()
                this.map.on('pointermove', this.noktaHareket);
                this.map.getViewport().addEventListener('mouseout', () => {
                    this.helpTooltipElement.classList.add('hidden');
                });
                this.measuringTool = new ol.interaction.Draw({
                    type: "Polygon",
                    source: this.sourceMeasure,
                    style: new ol.style.Style(
                        {
                            stroke: new ol.style.Stroke({
                                color: 'red',
                                width: 2,
                                lineDash: [10, 10]
                            }),
                            image: new ol.style.Circle({
                                radius: 5,
                                stroke: new ol.style.Stroke({
                                    color: 'rgba(0, 0, 0, 0.7)',
                                }),
                                fill: new ol.style.Fill({
                                    color: 'rgba(255, 255, 255, 0.2)',
                                }),
                            }),
                        })
                })
                this.map.addInteraction(this.measuringTool);
                this.createMeasureTooltip()
                this.measuringTool.on('drawstart', (event) => {

                    this.sketch = event.feature
                    event.feature.on('change', (evt) => {                       
                        this.sonuc = evt.target.getGeometry().getArea().toFixed(2) + " m2";
                        var tooltipCoord = evt.coordinate;
                        var geom = evt.target.getGeometry().getInteriorPoint().getCoordinates();
                        tooltipCoord = geom;
                        this.measureTooltipElement.innerHTML = this.sonuc;
                        this.measureTooltip.setPosition(tooltipCoord);
                    })
                })
                this.measuringTool.on('drawend', (event) => {
                    this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
                    this.measureTooltip.setOffset([0, -7]);
                    var style = new ol.style.Style(
                        {
                            fill: new ol.style.Fill ({
                                color: 'rgba(0, 0, 0, 0.35)'
                            }),
                            stroke: new ol.style.Stroke({
                                color: 'rgba(0, 0, 0, 0.9)',
                                width: 3
                            })
                        }
                    )
                    this.map.removeInteractionByType(ol.interaction.Draw);
                    this.map.removeInteractionByType(ol.interaction.Modify);
                    $(".deneme").remove()
                });
            },

            noktaHareket: function (evt) {

                if (evt.dragging) {
                    return;
                }
                var helpMsg = 'Çizime Başlayabilirsiniz';

                if (this.sketch != "") {
                    helpMsg = this.continueLineMsg;
                }
                this.helpTooltipElement.innerHTML = helpMsg;
                this.helpTooltip.setPosition(evt.coordinate);

                this.helpTooltipElement.classList.remove('hidden');
            },
            createHelpTooltip: function () {
                //if (this.helpTooltipElement) {
                //    this.helpTooltipElement.parentNode.removeChild(helpTooltipElement);
                //}
                this.helpTooltipElement = document.createElement('div');
                this.helpTooltipElement.className = 'ol-tooltip hidden deneme';
                this.helpTooltip = new ol.Overlay({
                    element: this.helpTooltipElement,
                    offset: [15, 0],
                    positioning: 'center-left',
                });
                this.map.addOverlay(this.helpTooltip);

            },

            createMeasureTooltip() {

                //if (this.measureTooltipElement) {
                //    this.measureTooltipElement.parentNode.removeChild(measureTooltipElement);
                //}
                this.measureTooltipElement = document.createElement('div');
                this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
                this.measureTooltip = new ol.Overlay({
                    element: this.measureTooltipElement,
                    offset: [0, 15],
                    positioning: 'bottom-center',
                });
                this.map.addOverlay(this.measureTooltip);


            }
        }
    }
</script>
<style scoped>
</style>
