/*==============================================================================
* File:   omdb.js
* Author: Kory Hutchison
* Date:   Winter 2018
*
* Description: JavaScript library for the OMDb API
*              IS 542, Winter 2018, BYU.
*/


const Omdb = (function () {
    "use strict";
    /*----------------------------------------------------------------------------
    *                             Private Variables
    */
    let apiKey;

    /*------------------------------------------------------------------------
     *                      PRIVATE METHOD DECLARATIONS
     */
    let buildUrl;
    let findBySearch;
    let getByImdbId;
    let getByTitle;
    let getJSON;
    let getPages;
    let searchByPageCount;
    let makeRequest;
    let setApiKey;

    /*----------------------------------------------------------------------------
    *                             Private Methods
    */
    buildUrl = function (apiType, parameters) {
        let url = "https://www.omdbapi.com/?";

        if (apiType === "title") {
            url += "t=" + parameters.title;

            if (parameters.season != undefined) {
                url += "&Season=" + parameters.season;
            }

            if (parameters.episode != undefined) {
                url += "&Episode=" + parameters.episode;
            }

            if (parameters.plot != undefined) {
                url += "&plot=" + parameters.plot;
            }

            // If provided, add the type (movie, series, episode)
            if (parameters.type != undefined) {
                url += "&type=" + parameters.type;
            }

        } else if (apiType === "id") {
            url += "i=" + parameters.imdbid;

            if (parameters.season != undefined) {
                url += "&Season=" + parameters.season;
            }

            if (parameters.episode != undefined) {
                url += "&Episode=" + parameters.episode;
            }

            if (parameters.plot != undefined) {
                url += "&plot=" + parameters.plot;
            }
        } else if (apiType === "search") {
            url += "s=" + parameters.searchText;

            if (parameters.page != undefined) {
                url += "&page=" + parameters.page;
            }

            // If provided, add the type (movie, series, episode)
            if (parameters.type != undefined) {
                url += "&type=" + parameters.type;
            }
        }

        // If provided, add the year
        if (parameters.year != undefined) {
            url += "&y=" + parameters.year;
        }

        // If provided, add the return datatype
        if (parameters.returnType != undefined) {
            url += "&r=" + parameters.returnType;
        }

        // If provided, add the version number, the default right now with the API is 1
        if (parameters.version != undefined) {
            url += "&v=" + parameters.version;
        }

        return url += "&apikey=" + apiKey;
    };

    findBySearch = function (options) {
        let returnJSON = true;

        if (options.searchText === false) {
            return Error("Didn't specify searchText name in options object.");
        }
        options.searchText = options.searchText.toLowerCase();

        options.searchText = options.searchText.replace(" ", "+");

        let url = buildUrl("search", options);

        if (options.returnType === "xml") {
            returnJSON = false;
        }

        return makeRequest(url, returnJSON);
    };

    getByImdbId = function (options) {
        let returnJSON = true;

        if (options.imdbid === undefined) {
            return Error("Didn't specify imdbid name in options object.");
        }

        let url = buildUrl("id", options);

        if (options.returnType === "xml") {
            returnJSON = false;
        }

        return makeRequest(url, returnJSON);
    };

    getByTitle = function (options) {
        let returnJSON = true;

        if (options.title === undefined) {
            return Error("Didn't specify title name in options object.");
        }

        let url = buildUrl("title", options);

        if (options.returnType === "xml") {
            returnJSON = false;
        }

        return makeRequest(url, returnJSON);
    };

    // Returns a promise in JSON form
    getJSON = function (promise) {
        return promise.then(JSON.parse);
    };

    // Returns the number of pages from a search result to be used in searchByPageCount
    getPages = function (options) {
        return findBySearch(options).then(function (response) {
                return Math.trunc(response.totalResults / 10);
            });
    };

    makeRequest = function (url, returnJSON) {
        let promiseObject = new Promise(function(resolve, reject) {
                let req = new XMLHttpRequest();
                req.open('GET', url);

                req.onload = function() {
                  // Check status to see if it's a success
                  if (req.status == 200) {
                    // Resolve the promise with the response text
                    resolve(req.response);
                  }
                  else {
                    // Reject and return the error
                    reject(Error(req.statusText));
                  }
                };

                // Handle network errors
                req.onerror = function() {
                  reject(Error("Network Error"));
                };

                // Make the request
                req.send();
                });

        // If they want JSON, convert it, otherwise just return the xml
        if (returnJSON === true) {
            return getJSON(promiseObject);
        } else {
            return promiseObject;
        }
    };

    // This returns an Array of promises with 10 results per page. I wouldn't suggest
    // doing more than 5 pages at a time. The API won't be able to handle it,
    // and 50 results is pretty sufficient.
    searchByPageCount = function (numPages, options) {
        let promiseArray = [];
        for (let i = 1; i <= numPages; i++) {
            options.page = i.toString();
            promiseArray.push(findBySearch(options));
        }
        return promiseArray;
    };

    // Sets the API key. Can only be set once.
    setApiKey = function (key) {
        if (apiKey != undefined) {
            return Error("API Key has already been set.");
        }
        apiKey = key;
    };

    /*----------------------------------------------------------------------------
    *                             Public API
    */
    return {
        findBySearch: findBySearch,
        getByImdbId: getByImdbId,
        getByTitle: getByTitle,
        getPages: getPages,
        searchByPageCount: searchByPageCount,
        setApiKey: setApiKey
    };
}());
