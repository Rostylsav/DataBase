require.config({
    paths: {
        "jquery" : 'bower_components/jquery/dist/jquery',
        "jquery.validate" : 'bower_components/jquery-validate/dist/jquery.validate',
    },
    shim: {
        'jquery.validate' : ['jquery'],
    }
});