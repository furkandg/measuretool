<template>
    <v-btn small fab dark v-bind:color="state=='draw-line'?'success':'primary'" v-on:click="startLineMeasureDraw">
        <v-icon>mdi-chart-line-variant</v-icon>
    </v-btn>
</template>
<script>


    export default {
        props: ["map", "sourceMeasure", "state", "measureLayer"],
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
            startLineMeasureDraw() {
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
                    type: 'LineString',
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

                        var sonuc = evt.target.getGeometry().getLength();
                        this.sonuc = sonuc > 100 ? (sonuc / 1000).toFixed(2) + 'km' : sonuc.toFixed(2) + 'm';
                        var tooltipCoord = evt.coordinate;

                        var geom = evt.target.getGeometry().getLastCoordinate();
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

                            stroke: new ol.style.Stroke({
                                color: 'rgba(0, 0, 0, 0.7)',
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

              
                this.measureTooltipElement = document.createElement('div');
                this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
                this.measureTooltip = new ol.Overlay({
                    element: this.measureTooltipElement,
                    offset: [0, -15],
                    positioning: 'bottom-center',
                });
                this.map.addOverlay(this.measureTooltip);
            }

        }

    }

</script>

<style scoped>
</style>
<style>
    .ol-tooltip {
        position: relative;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 4px;
        color: white;
        padding: 4px 8px;
        opacity: 0.7;
        white-space: nowrap;
        font-size: 12px;
    }

    .ol-tooltip-measure {
        opacity: 1;
        font-weight: bold;
    }

    .ol-tooltip-static {
        background-color: #ffcc33;
        color: black;
        border: 1px solid white;
    }

        .ol-tooltip-measure:before,
        .ol-tooltip-static:before {
            border-top: 6px solid rgba(0, 0, 0, 0.5);
            border-right: 6px solid transparent;
            border-left: 6px solid transparent;
            content: "";
            position: absolute;
            bottom: -6px;
            margin-left: -7px;
            left: 50%;
        }

        .ol-tooltip-static:before {
            border-top-color: #ffcc33;
        }
</style>