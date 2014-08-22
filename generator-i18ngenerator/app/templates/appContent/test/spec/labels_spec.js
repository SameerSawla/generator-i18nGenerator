var user_settings_json = {
    "userContext": "",
    "userLocale": "fr-FR",
    "userLanguage": "fr",
    "userCountry": "FR"
};
localStorage.setItem('userSettings', JSON.stringify(user_settings_json));

define(['../labels'], function(labels) {

    labels.prepareMessageFormatObject("browsercheck");

    describe('The API should return', function() {

        var result1 = "System Check";
        var result2 = "System Check in French";
        var result, message;

        beforeEach(function(done) {


            labels.resolve(result1).then(function(message) {
                result = message;
                done();
            });


        });

        it('test promise', function(done) {

            expect(result).toEqual(result2);
            done();

        });

    });
    describe('Object testing in real', function() {

    	var result;
        var result1 = "Cookies";
        var result2Arr = ["Cookies in French"];

        var object = [{
            string: "Cookies",
            context: "browsercheck",
            options: {
                plural: 1,
                gender: "neutral"
            }
        }];


        beforeEach(function(done) {
            labels.resolve(object).then(function(message) {
                result = message;
                done();
            });
        });

        it("testing object", function(done) {

            expect(result).toEqual(result2Arr);
            done();
        });

    });



    describe('Array of promises testing in real', function() {

        var result;
        var result1 = "Name";
        var result2Arr = ["Name in French", 'Version:  in French'];

        var object = [{
            string: "Name",
            context: "browsercheck",
            options: {
                plural: 1,
                gender: "neutral"
            }
        }, {
            string: "Version: "
        }];


        beforeEach(function(done) {
            labels.resolve(object).then(function(message) {

                result = message;
                done();
            });
        });

        it("testing arry of promises", function(done) {

            expect(result).toEqual(result2Arr);
            done();
        });


        // var addToResultFromPromise = function(promiseEx) {
        // 			promiseEx.done(function(value) {
        // 	var consumedTime = new Date().getSeconds() - timer;  	
        //   		console.log("added result " + value);
        //   		return value;
        // 		});
        // 	 console.log("I will add the result when the promise is done");
        // };


        // var user_settings_json = 
        //       {
        //           "userContext" : "progress-app",
        //           "userLocale" : "fr-FR",
        //           "userLanguage" : "fr",
        //           "userCountry" : "FR"
        //       };
        //       localStorage.setItem('userSettingsJSON', JSON.stringify(user_settings_json));

        // var translated_value = "System Check in french";
        // var key_to_be_translated = "System Check";
        // var timer = new Date().getSeconds();

        // // var promiseSpy = SpecHelper.SpyReturningPromise(labels, "resolve");
        // labels.prepareMessageFormatObject();
        // var promiseEx = labels.resolve(key_to_be_translated);
        // var result = addToResultFromPromise(promiseEx);
        // mockPromises.executeForPromise(promiseEx);
        // expect(result).toEqual(translated_value);

        // // SpecHelper.AssertAsyncToHaveBeenCalled(promiseSpy, labels.resolve(key_to_be_translated));

        // //	labels.resolve(key_to_be_translated).then(function(){});


        //});

        xit('return translated array of strings for an object array of to be translated strings', function() {
            var result1 = {
                "System Check": "System Check in french"
            };
            var result2 = {
                "System Check": "System Check in french"
            };

            var obj1 = [{
                string: "System Check",
                context: "progress-app",
                options: {
                    plural: 1,
                    gender: "neutral"
                }
            }, {
                string: "System Check",
                context: "progress-app",
                options: {
                    plural: 1,
                    gender: "neutral"
                }
            }];
            labels.prepareJedObject();
            expect(labels.resolve(obj1)[0]).toEqual(result1);
            expect(labels.resolve(obj1)[1]).toEqual(result2);
        });


        xit('should throw an error for invalid input', function() {
            labels.prepareJedObject();
            expect(labels.resolve(objects_to_be_translated)).toThrowError("missing key");
        });


    });
});
