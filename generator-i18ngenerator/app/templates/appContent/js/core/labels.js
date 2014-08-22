define(["/static/mindtap/util/userPreferencesManager.js", 
        "/static/nb/ui/userpreferences/bower_components/messageformat/messageformat.js",
        "/static/nb/ui/userpreferences/bower_components/q/q.js"
        ], 

    function(userPreferencesManager, MessageFormat, Q) {

    requirejs.onError = function(err) {

        console.log('Attention, we got an error!', err);

    };

    var translation_engine = {},
        defaultOptions = {
            plural: "",
            gender: "other"
        },
        plural_quantity_string,
        languageIsDirty = true,
        user_settings,
        pluralPrevious,

        initializeTranslationEngine = function(locale, app_context, user_language) {

            var selected_locale = new MessageFormat();
            var messageformat_data = userPreferencesManager.getLanguageData(locale, app_context, user_language);
            translation_engine = {

                selected_locale_object: selected_locale,
                fetched_data: messageformat_data

            };

        },

        resolve = function(to_be_translated_data, app_context, object_translation_options) {
            var value;

            switch (arguments.length) {
                case 1:
                    value = resolveKeys(to_be_translated_data);
                    break;
                case 2:
                    value = resolveKeysAndContext(to_be_translated_data, app_context);
                    break;
                case 3:
                    value = fetchPluralRules(to_be_translated_data, app_context, object_translation_options);
                    break;
                default:
                    throw new Error("Please pass either 1, 2, or 3 arguments into resolve().");
            }
            return value;

        },

        resolvePromise = function(userCountry, object_translation_options, args, fulfill, plural) {

            plural_quantity_string = plural[userCountry](object_translation_options.plural);
            args.push(plural_quantity_string);
            fulfill(doTranslate.apply(null, args));

        },

        fetchPluralRules = function(translate_me, app_context, object_translation_options) {

            var userLanguage = userPreferencesManager.getUserSetting('userLanguage').toLowerCase();
            var current_pluralization_path = "../../../static/browsercheck-mobile/bower_components/messageformat/locale/" + userLanguage + ".js";
            var args = [].slice.call(arguments);

            // console.log("translate_me",translate_me);

            // console.log("app_context",app_context);

            // console.log("object_translation_options",object_translation_options);

            // console.log("userLanguage",userLanguage);

            // console.log("current_pluralization_path",current_pluralization_path);

            // console.log("arguments",arguments);

            // console.log("args",args);


            return new Q.Promise(function(fulfill, reject) {

                if (object_translation_options.plural || object_translation_options.plural.length !== 0) {

                    if (languageIsDirty) {

                        require([current_pluralization_path], function(plural) {
                                pluralPrevious = plural;
                                languageIsDirty = false;
                                resolvePromise(userLanguage, object_translation_options, args, fulfill, plural);

                            },

                            function(error) {

                                reject(error);

                            });

                    } else {

                        resolvePromise(userLanguage, object_translation_options, args, fulfill, pluralPrevious);

                    }

                } else {

                    fulfill(doTranslate.apply(null, args));

                }

            });

        },

        doTranslate = function(translate_me, app_context, object_translation_options, plural_quantity_string) {

            var gender_info;
            var selected_locale_object = translation_engine["selected_locale_object"];
            var fetched_data = translation_engine["fetched_data"];
            var messageFunction, value;
            var actual_plural_number = object_translation_options.plural;

            if (!actual_plural_number) {

                actual_plural_number = "";

            }

            if (object_translation_options.gender) {

                gender_info = object_translation_options.gender;

            }

            try {

                messageFunction = selected_locale_object.compile(fetched_data[translate_me]);
                value = messageFunction({

                    "GENDER": gender_info,
                    "PLURAL": plural_quantity_string,
                    "NUMBER": actual_plural_number

                });
            } catch (err) {
                throw new Error('The key "' + translate_me + '" does not exist in ' + userPreferencesManager.getUserSetting("userLocale") + '.json');

            }

            return value;

        },

        resolveKeys = function(data) {

            if (typeof(data) === 'object') {
                return new Q.Promise(function(fulfill, reject) {

                    var promises = [],
                        translated = [];
                    var total = data.length;


                    for (var i = 0; i < total; i++) {

                        var translate_me = data[i].string;
                        var app_context = data[i].context;
                        var object_translation_options = data[i].options;

                        if (translate_me !== undefined) {

                            if (app_context === "" || app_context === undefined) {
                                app_context = userPreferencesManager.getUserSetting('userContext');

                            }

                            if (object_translation_options === undefined) {
                                object_translation_options = defaultOptions;
                            }

                            promises.push(fetchPluralRules(translate_me, app_context, object_translation_options));

                        }

                    }

                    Q.all(promises).done(function(resultArray) {
                        fulfill(resultArray);
                        //An error return if something goes wrong
                    });

                });

            } else {
                return fetchPluralRules(data, userPreferencesManager.getUserSetting('userContext'), defaultOptions);

            }

        },

        resolveKeysAndContext = function(to_be_translated_data, context_or_options) {

            if (typeof(context_or_options) === 'object') {

                var options = context_or_options;
                return fetchPluralRules(to_be_translated_data, userPreferencesManager.getUserSetting('userContext'), options);

            } else {

                var context = context_or_options;
                return fetchPluralRules(to_be_translated_data, context, defaultOptions);

            }

        },

        prepareMessageFormatObject = function(context) {

            languageIsDirty = true;
            user_settings = JSON.parse(localStorage.getItem('userSettings'));

            var userLocale = user_settings['userLocale'];
            var userLanguage = user_settings['userLanguage'];
            var appContext = context || user_settings['userContext'];

            initializeTranslationEngine(userLocale, appContext, userLanguage);

        };


    return {
        resolve: resolve,
        prepareMessageFormatObject: prepareMessageFormatObject,
    };

});
