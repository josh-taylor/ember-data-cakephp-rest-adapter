var get = Ember.get;

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
        var url = [],
            host = get(this, 'host'),
            prefix = this.urlPrefix();

        if (type) {
            url.push(this.pathForType(type).underscore());
        }
        if (id) {
            url.push(id);
        }
        if (prefix) {
            url.unshift(prefix);
        }

        url = url.join('/');
        if (!host && url) {
            url = '/' + url;
        }
        url = url + '.json';
        return url;
    }
});
