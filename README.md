# OMDb JS

The OMDb JS library/wrapper is meant to make communication with the OMDb API much easier. The library isn't intended to be used with a large production site because the API key is stored in JavaScript, and nothing can be hidden in client side JavaScript. So keep that in mind, but do have some fun with it using the free API keys you can get on the OMDb website. This also doesn't incorporate the poster api, because I figured that was out of scope of the project. Down below are some instructions to get started!

## Getting Started

These instructions will give you everything you need to start making calls to the API in no time!

### Prerequisites

You need to download the omdb.js file, which is available for download on http://www.omdbjs.com. Then set up a script tag for it in your html file above your other JavaScript files like so:

```html
<script type="text/javascript" src="omdb.js"></script>
<script type="text/javascript" src="main.js"></script>
```

### Installing

Then at the top of the JavaScript file where you will use OMDb JS, call the setApiKey function and pass in your API key.

```javascript
Omdb.setApiKey("<API KEY>");
```

## Options Object

Down below is a table that helps clarify which parameters you can pass into the different functions. The functions getPages and searchByPageCount take the same parameters as findBySearch. You may also want to check out the OMDb [website](http://www.omdbapi.com) to know the different values for each parameter.

|     Key    | getByTitle           | getByImdbId            | findBySearch        |
| :---:      | :---:                | :---:                  | :---:               |
| title      |  :heavy_check_mark:  |                        |                     |
| imdbId     |                      |   :heavy_check_mark:   |                     |
| searchText |                      |                        |  :heavy_check_mark: |
| season     |  :heavy_check_mark:  |   :heavy_check_mark:   |                     |
| episode    |  :heavy_check_mark:  |   :heavy_check_mark:   |                     |
| plot       |  :heavy_check_mark:  |   :heavy_check_mark:   |                     |
| page       |                      |                        |  :heavy_check_mark: |
| type       |  :heavy_check_mark:  |                        |  :heavy_check_mark: |
| year       |  :heavy_check_mark:  |   :heavy_check_mark:   |  :heavy_check_mark: |
| returnType |  :heavy_check_mark:  |   :heavy_check_mark:   |  :heavy_check_mark: |
| version    |  :heavy_check_mark:  |   :heavy_check_mark:   |  :heavy_check_mark: |

## Examples

There are 3 main functions that you can use to query the API and they are described below:

### getByTitle and getByImdbId

The getByTitle and getByImdbId functions are pretty self explanatory based off of the names, but they are probably one of the more useful functions in the library. Use these functions to find a specific movie/show/episode like so:

```javascript
Omdb.getByTitle(options).then(function (response) {
    console.log(response);
}).catch(function(error) {
    console.log("Failed!", error);
});
```

The getByImdbId function is exactly the same, but make sure you pass a "imdbId" parameter instead of "title"!

### findBySearch

Once again, this function is very similar to the getByTitle and getByImdbId functions, however this one returns a JSON object that has an array of results. Usually about 10.

```javascript
Omdb.findBySearch(options).then(function (response) {
    console.log(response);
}).catch(function(error) {
    console.log("Failed!", error);
});
```

## Extra Functions

These are the additional functions that come with the OMDb JS library. They are meant to do some more specific tasks that may not be used as often.

### getPages

The getPages function is used to return to you the number of pages that is associated with that search. When you call the API, the API returns the number of results for your search, and along with that gives 10 results per page. So what this function will help you do is quickly determine how many pages are associated with that specific search. So note: this does not use promises, it returns a number.

```javascript
let numPages = Omdb.getPages({ searchText: "Batman" });
```

### searchByPageCount

The searchByPageCount function is useful if you want to query the API to get more than 10 results at a time. The function returns an array of Promise objects that can then be used to display all the results. I wouldn't suggest you do more than 5 pages at a time because the API may not be able to handle that many requests.

```javascript
let promiseArray = Omdb.searchByPageCount(numPages, options);
```

If you happen to go more pages then the search has, then the remaining Promise objects will just have a false result from the API.

## Conclusion

And there you have it! Pretty simple, huh? I wanted to make it easy for anyone wanting to mess around with the API to use it, and it also give some good practice using Promises. So have fun, and make some great stuff!

## Authors

* **Kory Hutchison** - *Initial work*

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
