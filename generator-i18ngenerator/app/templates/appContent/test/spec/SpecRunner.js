(function() {
    'use strict';

    require.config({
        baseUrl: '',
        paths: {
            'jquery': 'http://static.mindtap.cengage.com/thirdparty/jquery/2.0.3/jquery.min',
            'jasmine': 'lib/jasmine-2.0.1/jasmine',
            'jasmine-html': 'lib/jasmine-2.0.1/jasmine-html',
            'boot': 'lib/jasmine-2.0.1/boot',
            'spec': 'spec',
            'jasmine-jquery': 'http://static.mindtap.cengage.com/thirdparty/jasmine-jquery/1.5.91/jasmine-jquery'
        },
        shim: {
            'jasmine': {
                exports: 'window.jasmineRequire'
            },
            'jasmine-html': {
                deps: ['jasmine'],
                exports: 'window.jasmineRequire'
            },
            'boot': {
                deps: ['jasmine', 'jasmine-html'],
                exports: 'window.jasmineRequire'
            }
        }
    });

    require(['boot'], function(boot) {

        var specs = [];

        specs.push('spec/labels_spec');

        require(specs, function(spec) {

            window.onload();

        });

    });
})();
