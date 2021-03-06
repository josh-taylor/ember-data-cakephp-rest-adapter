DS.CakeRESTSerializer = DS.RESTSerializer.extend({
    init: function() {
        this._super.apply(this, arguments);
    },

    removeCakePayloadKey: function(type, payload) {
        var typeKey = type.typeKey.classify();
        if (payload.hasOwnProperty(typeKey)) {
            return payload[typeKey];
        }
        return payload;
    },

    extractCakePayload: function(store, type, payload) {
        type.eachRelationship(function(key, relationship){
            // TODO should we check if relationship is marked as embedded?
            if (!Ember.isNone(payload[key]) && typeof(payload[key][0]) !== 'number' && relationship.kind ==='hasMany') {
                if (payload[key].constructor.name === 'Array' && payload[key].length > 0) {
                    var ids = payload[key].mapBy('id'); //todo find pk (not always id)
                    this.pushArrayPayload(store, relationship.type, payload[key]);
                    payload[key] = ids;
                }
            }
            else if (!Ember.isNone(payload[key]) && typeof(payload[key]) === 'object' && relationship.kind ==='belongsTo') {
                var id=payload[key].id;
                this.pushSinglePayload(store,relationship.type,payload[key]);
                payload[key]=id;
            }
        }, this);
    },

    removeWrappingCakePayloadKey: function(type, payload, isArray) {
        var typeKey = type.typeKey.underscore();

        if (isArray) {
            typeKey = typeKey.pluralize();
        }
        return payload[typeKey];
    },

    extractSingle: function(store, type, payload) {
        payload = this.removeWrappingCakePayloadKey(type, payload, false);
        payload = this.removeCakePayloadKey(type, payload);
        // using normalize from RESTSerializer applies transforms and allows
        // us to define keyForAttribute and keyForRelationship to handle
        // camelization correctly.
        this.normalize(type, payload);
        this.extractCakePayload(store, type, payload);
        return payload;
    },

    extractArray: function(store, type, payload) {
        var self = this;

        if (Ember.isNone(payload) || Ember.isEmpty(payload)) {
            return payload;
        }
        payload = this.removeWrappingCakePayloadKey(type, payload, true);
        for (var j = 0; j < payload.length; j++) {
            payload[j] = this.removeCakePayloadKey(type, payload[j]);
            // using normalize from RESTSerializer applies transforms and allows
            // us to define keyForAttribute and keyForRelationship to handle
            // camelization correctly.
            this.normalize(type, payload[j]);
            self.extractCakePayload(store, type, payload[j]);
        }
        return payload;
    },

    /**
     This method allows you to push a single object payload.

     It will first normalize the payload, so you can use this to push
     in data streaming in from your server structured the same way
     that fetches and saves are structured.

     @param {DS.Store} store
     @param {String} type
     @param {Object} payload
     */
    pushSinglePayload: function(store, type, payload) {
        type = store.modelFor(type);
        payload = this.extract(store, type, payload, null, "find");
        store.push(type, payload);
    },

    /**
     This method allows you to push an array of object payloads.

     It will first normalize the payload, so you can use this to push
     in data streaming in from your server structured the same way
     that fetches and saves are structured.

     @param {DS.Store} store
     @param {String} type
     @param {Object} payload
     */
    pushArrayPayload: function(store, type, payload) {
        type = store.modelFor(type);
        payload = this.extract(store, type, payload, null, "findAll");
        store.pushMany(type, payload);
    },

    /**
     Converts camelcased attributes to underscored when serializing.

     Stolen from DS.ActiveModelSerializer.

     @method keyForAttribute
     @param {String} attribute
     @returns String
     */
    keyForAttribute: function(attr) {
        return Ember.String.decamelize(attr);
    },

    /**
     Underscores relationship names when serializing relationship keys.

     Stolen from DS.ActiveModelSerializer.

     @method keyForRelationship
     @param {String} key
     @param {String} kind
     @returns String
     */
    keyForRelationship: function(key, kind) {
        return Ember.String.decamelize(key);
    }
});
