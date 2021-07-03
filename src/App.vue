<template>
    <div id="map" class="map" >
        <div style="position:absolute;z-index:1000;left:50px;top:150px;">
            <maindraw v-bind:map="map"/>
        </div>

    </div>
 
</template>



<script>
    import maindraw from './components/maindraw.vue'
    export default {
        name: 'App',

        components: {
            maindraw
        },
        data() {

            return {
                map: ""
            }
        },
        mounted() {
            this.map = new ol.Map({
                target: 'map',
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    })
                ],
                view: new ol.View({
                    center: ol.proj.fromLonLat([29.41, 40.82]),
                    zoom: 9
                })
            });


            var style = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'blue',
                    width: 1
                }),
                fill: new ol.style.Fill({
                    color: "red"
                })
            });


        },
        computed: {
         


        },
        methods: {
           
        },

    };
</script>
