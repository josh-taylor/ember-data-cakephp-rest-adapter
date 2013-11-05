DS.CakeRESTSerializer = DS.RESTSerializer.extend({
    getCakeKey: function(type) {
        return type.typeKey.classify();
    },

    extractArray: function(store, primaryType, payload) {
        payload = this.normalizePayload(primaryType, payload);
        for (var i = 0; i < payload.length; ++i) {
            var key = this.getCakeKey(primaryType);
            payload[i] = this.normalize(primaryType, payload[i][key]);
        }
        return payload;
    }
});
