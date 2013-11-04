DS.CakeRESTAdapter = DS.RESTAdapter.extend({
    defaultSerializer: 'DS/cakeREST',

    /**
     Builds a URL for a given type and optional ID.

     We will prefix the generated URL with .json to stick with Cake standards

     @method buildURL
     @param {String} type
     @param {String} id
     @returns String
     */
    buildURL: function(type, id) {
        var url = this._super(type, id);
        return url + '.json';
    }
});
