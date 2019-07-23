---
title: "Tutorial: Build a single-page Bing Video Search app"
titlesuffix: Azure Cognitive Services
description: Explains how to use the Bing Video Search API in a single-page Web application.
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-video-search
ms.topic: tutorial
ms.date: 07/12/2019
ms.author: aahi
---
# Tutorial: Single-page Video Search app
The Bing Video Search API lets you search the Web and get video results relevant to a search query. In this tutorial, we build a single-page Web application that uses the Bing search API to display search results on the page. The application includes HTML, CSS, and JavaScript components.

<!-- Remove until it can be replaced with a sanitized version.
![Single-page Bing Video Search app](./media/video-search-singlepage.png)
-->

> [!NOTE]
> The JSON and HTTP headings at the bottom of the page when clicked show the JSON response and HTTP request information. These details can be useful when exploring the service.

![JSON, HTTP raw results](./media/json-http-raw-results.png)

This tutorial app illustrates how to:
> [!div class="checklist"]
> * Perform a Bing Video Search API call in JavaScript
> * Pass search options to the Bing Search API
> * Display video search results or to optionally include Web pages, news, or images
> * Search time-frames of 24 hours, the past week, month, or all available time
> * Page through search results
> * Handle the Bing client ID and API subscription key
> * Handle errors that might occur

The tutorial page is entirely self-contained; it does not use any external frameworks, style sheets, or image files. It uses only widely supported JavaScript language features and works with current versions of all major Web browsers.

In this tutorial, we discuss selected portions of the source code. The complete [source code](tutorial-bing-video-search-single-page-app-source.md) is available. To run the example, copy and paste the source code into a text editor and save it as `bing.html`.

## App components
Like any single-page Web app, this tutorial application includes three parts:

> [!div class="checklist"]
> * HTML - Defines the structure and content of the page
> * CSS - Defines the appearance of the page
> * JavaScript - Defines the behavior of the page

Most of the HTML and CSS is conventional, so the tutorial doesn't discuss it. The HTML contains the search form in which the user enters a query and chooses search options. The form is connected to JavaScript that does the search using the `onsubmit` attribute of the `<form>` tag:

```html
<form name="bing" onsubmit="return bingWebSearch(this)">
```
The `onsubmit` handler returns `false`, which keeps the form from being submitted to a server. The JavaScript code does the work of collecting the necessary information from the form and performing the search.

The HTML also contains the divisions (HTML `<div>` tags) where the search results appear.

## Managing subscription key

To avoid having to include the Bing Search API subscription key in the code, we use the browser's persistent storage to store the key. Before the key is stored, we prompt for the user's key. If the key is later rejected by the API, we invalidate the stored key so the user will be prompted again.

We define `storeValue` and `retrieveValue` functions that use either the `localStorage` object (not all browsers support it) or a cookie. The `getSubscriptionKey()` function uses these functions to store and retrieve the user's key.

``` javascript
// Cookie names for data we store
API_KEY_COOKIE   = "bing-search-api-key";
CLIENT_ID_COOKIE = "bing-search-client-id";

// ... omitted definitions of store value and retrieve value
// Browsers differ in their support for persistent storage by 
// local HTML files. See the source code for browser-specific
// options.

// Get stored API subscription key, or prompt if it's not found.
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
The HTML `<form>` tag `onsubmit` calls the `bingWebSearch` function to return search results. `bingWebSearch` uses `getSubscriptionKey()` to authenticate each query. As shown in the previous definition, `getSubscriptionKey` prompts the user for the key if the key hasn't been entered. The key is then stored for continuing use by the application.

```html
<form name="bing" onsubmit="this.offset.value = 0; return bingWebSearch(this.query.value, 
    bingSearchOptions(this), getSubscriptionKey())">
```
## Selecting search options
The following figure shows the query text box and options that define a search.

![Bing News Search options](media/video-search-options.png)

The HTML form includes elements with the following names:

|Element|Description|
|-|-|
| `where` | A drop-down menu for selecting the market (location and language) used for the search. |
| `query` | The text field to enter the search terms. |
| `modules` | Checkboxes for promoting particular modules of results, all results or related videos. |
| `when` | Drop-down menu for optionally limiting the search to the most recent day, week, or month. |
| `safe` | A checkbox indicating whether to use the Bing SafeSearch feature to filter out "adult" results. |
| `count` | Hidden field. The number of search results to return on each request. Change to display fewer or more results per page. |
| `offset`|  Hidden field. The offset of the first search result in the request; used for paging. It's reset to `0` on a new request. |

> [!NOTE]
> Bing Web Search offers other query parameters. We're using only a few of them.

``` javascript
// build query options from the HTML form
// build query options from the HTML form
function bingSearchOptions(form) {

    var options = [];
    options.push("mkt=" + form.where.value);
    options.push("SafeSearch=" + (form.safe.checked ? "strict" : "off"));

    if (form.when.value.length) options.push("freshness=" + form.when.value);
    var what = [];
    for (var i = 0; i < form.what.length; i++) 
        if (form.what[i].checked) what.push(form.what[i].value);
    if (what.length) {
        options.push("modules=" + what.join(","));
        options.push("answerCount=9");
    }
    options.push("count=" + form.count.value);
    options.push("offset=" + form.offset.value);
    options.push("textDecorations=true");
    options.push("textFormat=HTML");
    return options.join("&");
}
```

For example, the `SafeSearch` parameter in an actual API call can be `strict`, `moderate`, or `off`, with `moderate` being the default. Our form, however, uses a checkbox, which has only two states. The JavaScript code converts this setting to either `strict` or `off` (`moderate` is not used).

## Performing the request
Given the query, the options string, and the API key, the `BingWebSearch` function uses an `XMLHttpRequest` object to make the request to the Bing Search endpoint.

```javascript
// Search on the query, using search options, authenticated by the key.
function bingWebSearch(query, options, key) {

    // scroll to top of window
    window.scrollTo(0, 0);
    if (!query.trim().length) return false;     // empty query, do nothing

    showDiv("noresults", "Working. Please wait.");
    hideDivs("pole", "mainline", "sidebar", "_json", "_headers", "paging1", "paging2", "error");

    var endpoint = "https://api.cognitive.microsoft.com/bing/v7.0/videos/search";
    var request = new XMLHttpRequest();
    var queryurl = endpoint + "?q=" + encodeURIComponent(query) + "&" + options;

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
    request.addEventListener("load", handleOnLoad);

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
On successful completion of the HTTP request, JavaScript calls the `load` event handler, `handleOnLoad()`, to handle a successful HTTP GET request to the API. 

```javascript
// handle Bing search request results
function handleOnLoad() {
    hideDivs("noresults");

    var json = this.responseText.trim();
    var jsobj = {};

    // try to parse JSON results
    try {
        if (json.length) jsobj = JSON.parse(json);
    } catch(e) {
        renderErrorMessage("Invalid JSON response");
    }

    // show raw JSON and headers
    showDiv("json", preFormat(JSON.stringify(jsobj, null, 2)));
    showDiv("http", preFormat("GET " + this.responseURL + "\n\nStatus: " + this.status + " " + 
        this.statusText + "\n" + this.getAllResponseHeaders()));

    // if HTTP response is 200 OK, try to render search results
    if (this.status === 200) {
        var clientid = this.getResponseHeader("X-MSEdge-ClientID");
        if (clientid) retrieveValue(CLIENT_ID_COOKIE, clientid);
        if (json.length) {
            if (jsobj._type === "Videos") {//"SearchResponse" && "rankingResponse" in jsobj) {
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
> If an error occurs in the search operation, the Bing News Search API returns a non-200 HTTP status code and includes error information in the JSON response. Additionally, if the request was rate-limited, the API returns an empty response.
A successful HTTP request does *not* necessarily mean that the search itself succeeded. 

Much of the code in both of the preceding functions is dedicated to error handling. Errors may occur at the following stages:

|Stage|Potential error(s)|Handled by|
|-|-|-|
|Building the JavaScript request object|Invalid URL|`try`/`catch` block|
|Making the request|Network errors, aborted connections|`error` and `abort` event handlers|
|Performing the search|Invalid request, invalid JSON, rate limits|tests in `load` event handler|

Errors are handled by calling `renderErrorMessage()` with any details known about the error. If the response passes the full gauntlet of error tests, we call `renderSearchResults()` to display the search results in the page.

## Displaying search results
The main function for displaying the search results is `renderSearchResults()`. This function takes the JSON returned by the Bing News Search service and renders the news results and the related searches, if any.

```javascript
// render the search results given the parsed JSON response
function renderSearchResults(results) {

    // add Prev / Next links with result count
    var pagingLinks = renderPagingLinks(results);
    showDiv("paging1", pagingLinks);
    showDiv("paging2", pagingLinks);

    // Render the results to the mainline section
    for (section in { mainline: 0 }) {
         showDiv(section, renderResultsItems(section, results));
    }
}
```
The search results are returned as the top-level `value` object in the JSON response. We pass them to our function `renderResultsItems()`, which iterates through them and calls a function to render each item into HTML. 
The resulting HTML is returned to `renderSearchResults()`, where it is inserted into the `results` division in the page.

```javascript
// render search results
    function renderResultsItems(section, results) {   

        var items = results.value;
        var html = [];
        for (var i = 0; i < items.length; i++) { 
            var item = items[i];
            // collection name has lowercase first letter
            var type = "videos";
            var render = searchItemRenderers[type];
            html.push(render(item, section));  
        }
    return html.join("\n\n");
}
```

The Bing News Search API returns up to four different kinds of related results, each in its own top-level object. They are:

|Relation|Description|
|-|-|
|`pivotSuggestions`|Queries that replace a pivot word in original search with a different one. For example, if you search for "red flowers," a pivot word might be "red," and a pivot suggestion might be "yellow flowers."|
|`queryExpansions`|Queries that narrow the original search by adding more terms. For example, if you search for "Microsoft Surface," a query expansion might be "Microsoft Surface Pro."|
|`relatedSearches`|Queries that have also been entered by other users who entered the original search. For example, if you search for "Mount Rainier," a related search might be "Mt. Saint Helens."|
|`similarTerms`|Queries that are similar in meaning to the original search. For example, if you search for "schools," a similar term might be "education."|

As previously seen in `renderSearchResults()`, we render only the `relatedItems` suggestions and place the resulting links in the page's sidebar.

## Rendering result items

In the JavaScript code the object, `searchItemRenderers`, can contains *renderers:* functions that generate HTML for each kind of search result. The video search page only uses `videos`. See other tutorials for various types of renderers.

```javascript
searchItemRenderers = {
	news: function(item) { ... },
	webPages: function (item) { ... }, 
    images: function(item, index, count) { ... },
    videos: function (item, section, index, count) { ... },
    relatedSearches: function(item) { ... }
}
```
A renderer function can accept the following parameters:

|Parameter|Description|
|-|-|
|`item`| The JavaScript object containing the item's properties, such as its URL and its description.|
|`index`| The index of the result item within its collection.|
|`count`| The number of items in the search result item's collection.|

The `index` and `count` parameters can be used to number results, to generate special HTML for the beginning or end of a collection, to insert line breaks after a certain number of items, and so on. If a renderer does not need this functionality, it does not need to accept these two parameters.

The `video` renderer is shown in the following javascript excerpt. Using the Videos endpoint, all results are of type `Videos`. The `searchItemRenderers` are shown in the following code segment.

```javascript
// render functions for various types of search results
    searchItemRenderers = {

    videos: function (item, section, index, count) {
        var height = 60;
        var width = Math.round(height * item.thumbnail.width / item.thumbnail.height);
        var html = [];

        html.push("<p class='images'>");
        html.push("<a href='" + item.hostPageUrl + "'>");
        var title = escapeQuotes(item.name) + "\n" + getHost(item.hostPageDisplayUrl);
        html.push("<img src='" + item.thumbnailUrl + "&h=" + height + "&w=" + width +
            "' height=" + height + " width=" + width + " title='" + title + "' alt='" + title + "'>");
        html.push("</a>");
        html.push("<br>");
        html.push("<nobr><a href='" + item.contentUrl + "'>Video page source</a> - ");
        html.push(title.replace("\n", " (").replace(/([a-z0-9])\.([a-z0-9])/g, "$1.<wbr>$2") + ")</p>");
        return html.join("");
    }
}
```

The renderer function:
> [!div class="checklist"]
> * Creates a paragraph tag, assigns it to the `images` class, and pushes it to the html array.
> * Calculates image thumbnail size (width is fixed at 60 pixels, height calculated proportionately).
> * Builds the HTML `<img>` tag to display the image thumbnail. 
> * Builds the HTML `<a>` tags that link to the image and the page that contains it.
> * Builds the description that displays information about the image and the site it's on.

The thumbnail size is used in both the `<img>` tag and the `h` and `w` fields in the thumbnail's URL. Bing will return a [thumbnail](../bing-web-search/resize-and-crop-thumbnails.md) of exactly that size.

## Persisting client ID
Responses from the Bing search APIs may include an `X-MSEdge-ClientID` header that should be sent back to the API with successive requests. If multiple Bing Search APIs are being used, the same client ID should be used with all of them, if possible.

Providing the `X-MSEdge-ClientID` header allows the Bing APIs to associate all of a user's searches, which has two important benefits.

First, it allows the Bing search engine to apply past context to searches to find results that better satisfy the user. If a user has previously searched for terms related to sailing, for example, a later search for "knots" might preferentially return information about knots used in sailing.

Second, Bing may randomly select users to experience new features before they are made widely available. Providing the same client ID with each request ensures that users who see the feature always see it. Without the client ID, the user might see a feature appear and disappear, seemingly at random, in their search results.

Browser security policies (CORS) may prevent the `X-MSEdge-ClientID` header from being available to JavaScript. This limitation occurs when the search response has a different origin from the page that requested it. In a production environment, you should address this policy by hosting a server-side script that does the API call on the same domain as the Web page. Since the script has the same origin as the Web page, the `X-MSEdge-ClientID` header is then available to JavaScript.

> [!NOTE]
> In a production Web application, you should perform the request server-side. Otherwise, your Bing Search API key must be included in the Web page, where it is available to anyone who views source. You are billed for all usage under your API subscription key, even requests made by unauthorized parties, so it is important not to expose your key.

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
> [Bing Video Search API reference](//docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference)
