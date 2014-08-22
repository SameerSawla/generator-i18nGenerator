define([], function() {

    var user_settings,
        languageData = null,

        getLanguageData = function(selected_locale, app_context, user_language, path) {

            var filePath;

            if (!path) {

                filePath = '/static/locales/' + app_context + '/' + user_language + '/' + selected_locale + '.json';


            } else {

                filePath = path;
            }

            var xobj = new XMLHttpRequest();


            xobj.overrideMimeType("application/json");
            xobj.open('GET', filePath, false);

            xobj.onreadystatechange = function() {

                _handleReadyState(xobj, app_context);

            };

            xobj.send(null);

            return languageData;

        },

        _handleReadyState = function(xobj, app_context) {

            if (xobj.readyState == 4 && xobj.status == "200") {

                languageData = JSON.parse(xobj.responseText);

            } else if (xobj.readyState == 4 && xobj.status == "404") {

                updateUserSetting("userLocale", "en-US");
                updateUserSetting("userLanguage", "en");
                updateUserSetting("userCountry", "US");

                $("#language-selector").val("English / US");
                languageData = getLanguageData(getUserSetting("userLocale"), app_context, getUserSetting("userLanguage"));

            }
        },

        getUserSetting = function(key) {

            user_settings = JSON.parse(localStorage.getItem('userSettings'));
            return user_settings[key];

        },

        updateUserSetting = function(key, value) {

            user_settings = JSON.parse(localStorage.getItem('userSettings'));

            if (key === "userLocale") {

                var split_string = value.split("-");

                if (split_string[1] !== undefined) {

                    var language = split_string[0].toLowerCase();
                    var country = split_string[1].toUpperCase();

                    user_settings["userLanguage"] = language;
                    user_settings["userCountry"] = country;

                }

            }

            user_settings[key] = value;
            localStorage.setItem("userSettings", JSON.stringify(user_settings));

        };

    return {

        getLanguageData: getLanguageData,
        getUserSetting: getUserSetting,
        updateUserSetting: updateUserSetting,
        _handleReadyState: _handleReadyState

    };

});
