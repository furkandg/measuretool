<template>
    <div class="widget-measure">
        <div class="widget-body">
            <div v-if="fab" class="measure-left-container">
                <areadraw v-bind:map="map" v-bind:state="state"  v-bind:sourceMeasure="sourceMeasure"/> 
                <linedraw v-bind:map="map" v-bind:state="state"  v-bind:sourceMeasure="sourceMeasure"/>
                <v-btn fab dark small color="warning" v-on:click="clear()">
                    <v-icon>mdi-broom</v-icon>
                </v-btn>
            </div>
            <v-btn v-on:click="fab=!fab" class="btn-icon m-btn" fab dark v-bind:color="fab?'success':'primary'">
                <v-icon v-if="fab" style="color:white;">mdi-drag-horizontal</v-icon>
                <v-icon v-else style="color:white;">mdi-ruler-square</v-icon>
            </v-btn>
        </div>
    </div>
</template>
<script>

    import areadraw from './areadraw.vue'
    import linedraw from './linedraw.vue'
    export default {
        props: ["map"],
        data: function () {
            return {
                state: "select",
                direction: 'left',
                fab: false
            }
        },
        components: {
            areadraw,
            linedraw
        },
        methods: {
            clear() {
                this.measureLayer.getSource().clear();
                try {
                    $('.ol-tooltip-static').remove();
                } catch (e) {

                }
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                this.sourceMeasure = new ol.source.Vector();

                this.measureLayer = new ol.layer.Vector({
                    className: "measure-draw-comp",
                    source: this.sourceMeasure
                });
     
                this.map.addLayer(this.measureLayer);

            })
        },
        watch: {
            state: {
                deep: true,
                handler: function (n, old) {
                    if (n == "select") {
                        this.map.removeInteractionByType(ol.interaction.Draw);
                        this.map.removeInteractionByType(ol.interaction.Modify);
                      /*  this.map.enablePan();*/
                    }
                    else if (n == "draw-line" || n == "draw-area") {
                        this.map.removeInteractionByType(ol.interaction.Select);
                        this.map.removeInteractionByType(ol.interaction.Modify);
                       /* this.map.disablePan();*/
                    }
                }
            },
            fab: function (n, o) {
                if (!n) {
                    this.state = "select";
                }
                else if (n) { }
            }
        }
    }
</script>
<style scoped>
    .widget-measure {
        display: block;
    }

        .widget-measure .widget-body {
            display: flex;
            align-items: center;
        }
</style>
