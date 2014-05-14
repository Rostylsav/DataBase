require.config({
    paths: {
        "jquery" : 'bower_components/jquery/dist/jquery',
        "underscore" : 'bower_components/underscore/underscore',
        "backbone" : 'bower_components/backbone/backbone',
        "backbone.localStorage" : 'bower_components/backbone.localStorage/backbone.localStorage',
    },
    shim: {
        'underscore' : ['jquery'],
        'backbone' : ['jquery', 'underscore'],
        'backbone.localStorage' : ['jquery', 'underscore','backbone'],
    }
});