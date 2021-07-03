ol.Map.prototype.removeInteractionByType = function (ins) {
    var interactions = this.interactions.array_.filter(a => a instanceof ins);
    for (var i = 0; i < interactions.length; i++) {
        this.removeInteraction(interactions[i]);
    }
}