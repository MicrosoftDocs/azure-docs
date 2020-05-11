---
title: "Tutorial: Create a single-page web app - Bing Image Search API"
titleSuffix: Azure cognitive services
description: The Bing Image Search API enables you to search the web for high-quality, relevant images. Use this tutorial to build a single-page web application that can send search queries to the API, and display the results within the webpage.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-image-search
ms.topic: tutorial
ms.date: 03/05/2020
ms.author: aahi
---

# Tutorial: Create a single-page app using the Bing Image Search API

The Bing Image Search API enables you to search the web for high-quality, relevant images. Use this tutorial to build a single-page web application that can send search queries to the API, and display the results within the webpage. This tutorial is similar to the [corresponding tutorial](../Bing-Web-Search/tutorial-bing-web-search-single-page-app.md) for Bing Web Search.

The tutorial app illustrates how to:

> [!div class="checklist"]
> * Perform a Bing Image Search API call in JavaScript
> * Improve search results using search options
> * Display and page through search results
> * Request and handle an API subscription key, and Bing client ID.

The full source code for this tutorial is available on [GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/tree/master/Tutorials/Bing-Image-Search).

## Prerequisites

* The latest version of [Node.js](https://nodejs.org/).
* The [Express.js](https://expressjs.com/) framework for Node.js. Installation instructions for the source code are available in the GitHub sample readme file.

[!INCLUDE [cognitive-services-bing-image-search-signup-requirements](../../../includes/cognitive-services-bing-image-search-signup-requirements.md)]

## Manage and store user subscription keys

This application uses web browsers' persistent storage to store API subscription keys. If no key is stored, the webpage will prompt the user for their key and store it for later use. If the key is later rejected by the API, The app will remove it from storage. This sample uses the global endpoint. You can also use the [custom subdomain](../../cognitive-services/cognitive-services-custom-subdomains.md) endpoint displayed in the Azure portal for your resource.


Define `storeValue` and `retrieveValue` functions to use either the `localStorage` object (if the browser supports it) or a cookie.

```javascript
// Cookie names for data being stored
API_KEY_COOKIE   = "bing-search-api-key";
CLIENT_ID_COOKIE = "bing-search-client-id";
// The Bing Image Search API endpoint
BING_ENDPOINT = "https://api.cognitive.microsoft.com/bing/v7.0/images/search";

try { //Try to use localStorage first
    localStorage.getItem;   

    window.retrieveValue = function (name) {
        return localStorage.getItem(name) || "";
    }
    window.storeValue = function(name, value) {
        localStorage.setItem(name, value);
    }
} catch (e) {
    //If the browser doesn't support localStorage, try a cookie
    window.retrieveValue = function (name) {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var keyvalue = cookies[i].split("=");
            if (keyvalue[0].trim() === name) return keyvalue[1];
        }
        return "";
    }
    window.storeValue = function (name, value) {
        var expiry = new Date();
        expiry.setFullYear(expiry.getFullYear() + 1);
        document.cookie = name + "=" + value.trim() + "; expires=" + expiry.toUTCString();
    }
}
```

The `getSubscriptionKey()` function attempts to retrieve a previously stored key using `retrieveValue`. If one isn't found, it will prompt the user for their key, and store it using `storeValue`.

```javascript

// Get the stored API subscription key, or prompt if it's not found
function getSubscriptionKey() {
    var key = retrieveValue(API_KEY_COOKIE);
    while (key.length !== 32) {
        key = prompt("Enter Bing Search API subscription key:", "").trim();
    }
    // always set the cookie in order to update the expiration date
    storeValue(API_KEY_COOKIE, key);
    return key;
}
```

The HTML `<form>` tag `onsubmit` calls the `bingWebSearch` function to return search results. `bingWebSearch` uses `getSubscriptionKey` to authenticate each query. As shown in the previous definition, `getSubscriptionKey` prompts the user for the key if the key hasn't been entered. The key is then stored for continuing use by the application.

```html
<form name="bing" onsubmit="this.offset.value = 0; return bingWebSearch(this.query.value,
bingSearchOptions(this), getSubscriptionKey())">
```

## Send search requests

This application uses an HTML `<form>` to initially send user search requests, using the `onsubmit` attribute to call `newBingImageSearch()`.

```html
<form name="bing" onsubmit="return newBingImageSearch(this)">
```

By default, the `onsubmit` handler returns `false`, keeping the form from being submitted.

## Select search options

![[Bing Image Search form]](media/cognitive-services-bing-images-api/image-search-spa-form.png)

The Bing Image Search API offers several [filter query parameters](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#filter-query-parameters) to narrow and filter search results. The HTML form in this application uses and displays the following parameter options:

|              |                                                                                                                                                                                    |
|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `where`      | A drop-down menu for selecting the market (location and language) used for the search.                                                                                             |
| `query`      | The text field in which to enter the search terms.                                                                                                                                 |
| `aspect`     | Radio buttons for choosing the proportions of the found images: roughly square, wide, or tall.                                                                                     |
| `color`      |                                                                                                                                                                                    |
| `when`       | Drop-down menu for optionally limiting the search to the most recent day, week, or month.                                                                                          |
| `safe`       | A checkbox indicating whether to use Bing's SafeSearch feature to filter out "adult" results.                                                                                      |
| `count`      | Hidden field. The number of search results to return on each request. Change to display fewer or more results per page.                                                            |
| `offset`     | Hidden field. The offset of the first search result in the request; used for paging. It's reset to `0` on a new request.                                                           |
| `nextoffset` | Hidden field. Upon receiving a search result, this field is set to the value of the `nextOffset` in the response. Using this field avoids overlapping results on successive pages. |
| `stack`      | Hidden field. A JSON-encoded list of the offsets of preceding pages of search results, for navigating back to previous pages.                                                      |

The `bingSearchOptions()` function formats these options into a partial query string, which can be used in the app's API requests.  

```javascript
// Build query options from the HTML form
function bingSearchOptions(form) {

    var options = [];
    options.push("mkt=" + form.where.value);
    options.push("SafeSearch=" + (form.safe.checked ? "strict" : "off"));
    if (form.when.value.length) options.push("freshness=" + form.when.value);
    var aspect = "all";
    for (var i = 0; i < form.aspect.length; i++) {
        if (form.aspect[i].checked) {
            aspect = form.aspect[i].value;
            break;
        }
    }
    options.push("aspect=" + aspect);
    if (form.color.value) options.push("color=" + form.color.value);
    options.push("count=" + form.count.value);
    options.push("offset=" + form.offset.value);
    return options.join("&");
}
```

## Performing the request

Using the search query, options string, and API key, the `BingImageSearch()` function uses an XMLHttpRequest object to make the request to the Bing Image Search endpoint.


```javascript
// perform a search given query, options string, and API key
function bingImageSearch(query, options, key) {

    // scroll to top of window
    window.scrollTo(0, 0);
    if (!query.trim().length) return false;     // empty query, do nothing

    showDiv("noresults", "Working. Please wait.");
    hideDivs("results", "related", "_json", "_http", "paging1", "paging2", "error");

    var request = new XMLHttpRequest();
    var queryurl = BING_ENDPOINT + "?q=" + encodeURIComponent(query) + "&" + options;

    // open the request
    try {
        request.open("GET", queryurl);
    }
    catch (e) {
        renderErrorMessage("Bad request (invalid URL)\n" + queryurl);
        return false;
    }

    // add request headers
    request.setRequestHeader("Ocp-Apim-Subscription-Key", key);
    request.setRequestHeader("Accept", "application/json");
    var clientid = retrieveValue(CLIENT_ID_COOKIE);
    if (clientid) request.setRequestHeader("X-MSEdge-ClientID", clientid);

    // event handler for successful response
    request.addEventListener("load", handleBingResponse);

    // event handler for erorrs
    request.addEventListener("error", function() {
        renderErrorMessage("Error completing request");
    });

    // event handler for aborted request
    request.addEventListener("abort", function() {
        renderErrorMessage("Request aborted");
    });

    // send the request
    request.send();
    return false;
}
```

Upon successful completion of the HTTP request, JavaScript calls the "load" event handler `handleBingResponse()` to handle a successful HTTP GET request.

```javascript
// handle Bing search request results
function handleBingResponse() {
    hideDivs("noresults");

    var json = this.responseText.trim();
    var jsobj = {};

    // try to parse JSON results
    try {
        if (json.length) jsobj = JSON.parse(json);
    } catch(e) {
        renderErrorMessage("Invalid JSON response");
    }

    // show raw JSON and HTTP request
    showDiv("json", preFormat(JSON.stringify(jsobj, null, 2)));
    showDiv("http", preFormat("GET " + this.responseURL + "\n\nStatus: " + this.status + " " +
        this.statusText + "\n" + this.getAllResponseHeaders()));

    // if HTTP response is 200 OK, try to render search results
    if (this.status === 200) {
        var clientid = this.getResponseHeader("X-MSEdge-ClientID");
        if (clientid) retrieveValue(CLIENT_ID_COOKIE, clientid);
        if (json.length) {
            if (jsobj._type === "Images") {
                if (jsobj.nextOffset) document.forms.bing.nextoffset.value = jsobj.nextOffset;
                renderSearchResults(jsobj);
            } else {
                renderErrorMessage("No search results in JSON response");
            }
        } else {
            renderErrorMessage("Empty response (are you sending too many requests too quickly?)");
        }
    }

    // Any other HTTP response is an error
    else {
        // 401 is unauthorized; force re-prompt for API key for next request
        if (this.status === 401) invalidateSubscriptionKey();

        // some error responses don't have a top-level errors object, so gin one up
        var errors = jsobj.errors || [jsobj];
        var errmsg = [];

        // display HTTP status code
        errmsg.push("HTTP Status " + this.status + " " + this.statusText + "\n");

        // add all fields from all error responses
        for (var i = 0; i < errors.length; i++) {
            if (i) errmsg.push("\n");
            for (var k in errors[i]) errmsg.push(k + ": " + errors[i][k]);
        }

        // also display Bing Trace ID if it isn't blocked by CORS
        var traceid = this.getResponseHeader("BingAPIs-TraceId");
        if (traceid) errmsg.push("\nTrace ID " + traceid);

        // and display the error message
        renderErrorMessage(errmsg.join("\n"));
    }
}
```

> [!IMPORTANT]
> Successful HTTP requests may contain failed search information. If an error occurs during the search operation, the Bing Image Search API will return a non-200 HTTP status code and error information in the JSON response. Additionally, if the request was rate-limited, the API will return an empty response.

## Display the search results

Search results are displayed by the `renderSearchResults()` function, which takes the JSON returned by the Bing Image Search service and calls an appropriate renderer function on any returned images and related searches.

```javascript
function renderSearchResults(results) {

    // add Prev / Next links with result count
    var pagingLinks = renderPagingLinks(results);
    showDiv("paging1", pagingLinks);
    showDiv("paging2", pagingLinks);

    showDiv("results", renderImageResults(results.value));
    if (results.relatedSearches)
        showDiv("sidebar", renderRelatedItems(results.relatedSearches));
}
```

Image search results are contained in the top-level `value` object within the JSON response. These are passed to `renderImageResults()`, which iterates through the results and converts each item into HTML.

```javascript
function renderImageResults(items) {
    var len = items.length;
    var html = [];
    if (!len) {
        showDiv("noresults", "No results.");
        hideDivs("paging1", "paging2");
        return "";
    }
    for (var i = 0; i < len; i++) {
        html.push(searchItemRenderers.images(items[i], i, len));
    }
    return html.join("\n\n");
}
```

The Bing Image Search API can return four types of search suggestions to help guide users' search experiences, each in its own top-level object:

| Suggestion         | Description                                                                                                                                                                                                         |
|--------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `pivotSuggestions` | Queries that replace a pivot word in original search with a different one. For example, if you search for "red flowers," a pivot word might be "red," and a pivot suggestion might be "yellow flowers." |
| `queryExpansions`  | Queries that narrow the original search by adding more terms. For example, if you search for "Microsoft Surface," a query expansion might be "Microsoft Surface Pro."                                   |
| `relatedSearches`  | Queries that have also been entered by other users who entered the original search. For example, if you search for "Mount Rainier," a related search might be "Mt. Saint Helens."                       |
| `similarTerms`     | Queries that are similar in meaning to the original search. For example, if you search for "kittens," a similar term might be "cute."                                                                   |

This application only renders the `relatedItems` suggestions, and places the resulting links in the page's sidebar.

## Rendering search results

In this application, the `searchItemRenderers` object contains renderer functions that generate HTML for each kind of search result.

```javascript
searchItemRenderers = {
    images: function(item, index, count) { ... },
    relatedSearches: function(item) { ... }
}
```

These renderer functions accept the following parameters:

| Parameter         | Description                                                                                              |
|---------|----------------------------------------------------------------------------------------------|
| `item`  | The JavaScript object containing the item's properties, such as its URL and its description. |
| `index` | The index of the result item within its collection.                                          |
| `count` | The number of items in the search result item's collection.                                  |

The `index` and `count` parameters are used to number results, generate HTML for collections, and organize the content. Specifically, it:

* Calculates the image thumbnail size (width varies, with a minimum of 120 pixels, while height is fixed at 90 pixels).
* Builds the HTML `<img>` tag to display the image thumbnail.
* Builds the HTML `<a>` tags that link to the image and the page that contains it.
* Builds the description that displays information about the image and the site it's on.

```javascript
    images: function (item, index, count) {
        var height = 120;
        var width = Math.max(Math.round(height * item.thumbnail.width / item.thumbnail.height), 120);
        var html = [];
        if (index === 0) html.push("<p class='images'>");
        var title = escape(item.name) + "\n" + getHost(item.hostPageDisplayUrl);
        html.push("<p class='images' style='max-width: " + width + "px'>");
        html.push("<img src='"+ item.thumbnailUrl + "&h=" + height + "&w=" + width +
            "' height=" + height + " width=" + width + "'>");
        html.push("<br>");
        html.push("<nobr><a href='" + item.contentUrl + "'>Image</a> - ");
        html.push("<a href='" + item.hostPageUrl + "'>Page</a></nobr><br>");
        html.push(title.replace("\n", " (").replace(/([a-z0-9])\.([a-z0-9])/g, "$1.<wbr>$2") + ")</p>");
        return html.join("");
    }, // relatedSearches renderer omitted
```

The thumbnail image's `height` and `width` are used in both the `<img>` tag and the `h` and `w` fields in the thumbnail's URL. This enables Bing to return [a thumbnail](../bing-web-search/resize-and-crop-thumbnails.md) of exactly that size.

## Persisting client ID

Responses from the Bing search APIs may include a `X-MSEdge-ClientID` header that should be sent back to the API with successive requests. If multiple Bing Search APIs are being used, the same client ID should be used with all of them, if possible.

Providing the `X-MSEdge-ClientID` header allows the Bing APIs to associate all of a user's searches, which is useful in

First, it allows the Bing search engine to apply past context to searches to find results that better satisfy the user. If a user has previously searched for terms related to sailing, for example, a later search for "knots" might preferentially return information about knots used in sailing.

Second, Bing may randomly select users to experience new features before they are made widely available. Providing the same client ID with each request ensures that users that have been chosen to see a feature always see it. Without the client ID, the user might see a feature appear and disappear, seemingly at random, in their search results.

Browser security policies (CORS) may prevent the `X-MSEdge-ClientID` header from being available to JavaScript. This limitation occurs when the search response has a different origin from the page that requested it. In a production environment, you should address this policy by hosting a server-side script that does the API call on the same domain as the Web page. Since the script has the same origin as the Web page, the `X-MSEdge-ClientID` header is then available to JavaScript.

> [!NOTE]
> In a production Web application, you should perform the request server-side anyway. Otherwise, your Bing Search API key must be included in the Web page, where it is available to anyone who views source. You are billed for all usage under your API subscription key, even requests made by unauthorized parties, so it is important not to expose your key.

For development purposes, you can make the Bing Web Search API request through a CORS proxy. The response from such a proxy has an `Access-Control-Expose-Headers` header that allows response headers and makes them available to JavaScript.

It's easy to install a CORS proxy to allow our tutorial app to access the client ID header. First, if you don't already have it, [install Node.js](https://nodejs.org/en/download/). Then issue the following command in a command window:

    npm install -g cors-proxy-server

Next, change the Bing Web Search endpoint in the HTML file to:

    http://localhost:9090/https://api.cognitive.microsoft.com/bing/v7.0/search

Finally, start the CORS proxy with the following command:

    cors-proxy-server

Leave the command window open while you use the tutorial app; closing the window stops the proxy. In the expandable HTTP Headers section below the search results, you can now see the `X-MSEdge-ClientID` header (among others) and verify that it is the same for each request.

## Next steps

> [!div class="nextstepaction"]
> [Extract Image details using the Bing Image Search API](tutorial-image-post.md)

## See also

* [Bing Image Search API reference](//docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference)
