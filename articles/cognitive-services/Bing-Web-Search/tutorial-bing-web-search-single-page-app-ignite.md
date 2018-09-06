---
title: "Tutorial: Create a Bing Web Search single-page app"
titleSuffix: Azure Cognitive Services
description: This single-page app demonstrates how the Bing Web Search API can be used to retrieve, parse, and display relevant search results in a single-page app.
services: cognitive-services
author: erhopf
manager: cgronlun
ms.service: cognitive-services
ms.component: bing-web-search
ms.topic: tutorial
ms.date: 09/06/2018
ms.author: erhopf
---

# Tutorial: Create a single-page app using the Bing Web Search API

This single-page app demonstrates how the Bing Web Search API can be used to retrieve, parse, and display relevant search results based on a user's query. The tutorial uses boilerplate HTML and CSS, and focuses on the JavaScript logic required to call the Bing Web Search API, handle the response, and display the results. HTML, CSS, and JS files are available on [GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples) with quickstart instructions.  

This sample app can:

> [!div class="checklist"]
> * Call the Bing Web Search API with search options
> * Display web, image, news, and video results
> * Paginate results
> * Manage subscription keys
> * Handle errors

To use this app, an [Azure Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with Bing Search APIs is required. If you don't have an account, you can use the [free trial](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api) to get a subscription key.

## Prerequisites

Here are a few things that you'll need to run the app:

* Node.js 8 or later
* A subscription key

## Get the source code and install dependencies

The first step is to clone the repository with the sample app's source code.

```console
git clone https://github.com/Azure-Samples/cognitive-services-REST-api-samples.git
```

Then run `npm install`. For this project, Express.js is the only dependency.

```console
cd <path-to-repo>/cognitive-services-REST-api-samples/Tutorials/Bing-Web-Search
npm install
```

## App components

The sample app we're building is made up of 4 parts:

* `app.js` - Our Express.js app. It handles request/response logic and routing.
* `public/index.html` - The skeleton of our app; it defines how data is presented to the user.
* `public/css/styles.css` - Defines page styles, such as fonts, colors, text size.
* `public/js/scripts.js` - Contains the logic to make requests to the Bing Web Search API, manage subscription keys, handle and parse responses, and display results.

This tutorial focuses on `scripts.js` and the logic required to call the Bing Web Search API and handle the response.

## HTML form

The `index.html` includes a form that enables users to search and select search options. The `onsubmit` attribute fires when the form is submitted, calling the `bingWebSearch()` method defined in `scripts.js`. It takes three arguments:

* Search query
* Selected options
* Subscription key

```html
<form name="bing" onsubmit="return bingWebSearch(this.query.value,
    bingSearchOptions(this), getSubscriptionKey())">
```

## Query options

The HTML form includes options that map to query parameters in the [Bing Web Search API v7](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-web-api-v7-reference#query-parameters). This table provides a breakdown of how users can filter search results using the sample app:

| Parameter | Description |
|-----------|-------------|
| `query` | A text field to enter a query string. |
| `where` | A drop-down menu to select the market (location and language). |
| `what` | Checkboxes to promote specific result types. Promoting images, for example, increases the ranking of images in search results. |
| `when` | A drop-down menu that allows the user to limit limiting the search results to today, this week, or this month. |
| `safe` | A checkbox to enable Bing SafeSearch, which filters out adult content. |
| `count` | Hidden field. The number of search results to return on each request. Change this value to display fewer or more results per page. |
| `offset` | Hidden field. The offset of the first search result in the request, which is used for paging. It's reset to `0` with each new request. |

> [!NOTE]
> The Bing Web Search API offers additional query parameters to help refine search results. This sample only uses a few. For a complete list of available parameters, see [Bing Web Search API v7 reference](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-web-api-v7-reference#query-parameters).

The `bingSearchOptions()` function converts these options to the format required by the Bing Search API.

```javascript
// Build query options from selections in the HTML form.
function bingSearchOptions(form) {

    var options = [];
    options.push("mkt=" + form.where.value);
    options.push("SafeSearch=" + (form.safe.checked ? "strict" : "off"));
    if (form.when.value.length) options.push("freshness=" + form.when.value);
    var what = [];
    for (var i = 0; i < form.what.length; i++)
        if (form.what[i].checked) what.push(form.what[i].value);
    if (what.length) {
        options.push("promote=" + what.join(","));
        options.push("answerCount=9");
    }
    options.push("count=" + form.count.value);
    options.push("offset=" + form.offset.value);
    options.push("textDecorations=true");
    options.push("textFormat=HTML");
    return options.join("&");
}
```

For example, `SafeSearch` can be set to `strict`, `moderate`, or `off`, with `moderate` being the default. However, this form uses a checkbox, which has only two states. This code sample converts this setting to either `strict` or `off`, `moderate` is not used.

If any of the **Promote** checkboxes are selected, the `answerCount` parameter is added to the query. `answerCount` is required when using the `promote` parameter. We simply set it to `9` (the number of result types supported by the Bing Web Search API) to make sure we get the maximum number of result types.

> [!NOTE]
> Promoting a result type does not *guarantee* that it will be included in the search results. Rather, promotion increases the ranking of those kinds of results relative to their usual ranking. To limit searches to particular kinds of results, use the `responseFilter` query parameter, or call a more specific endpoint such as Bing Image Search or Bing News Search.

In this tutorial, the `textDecoration` and `textFormat` query parameters are hardcoded into the script, and cause the search term to be boldfaced in the search results.

## Manage subscription keys

To avoid hardcoding the Bing Search API subscription key, this sample app uses a browser's persistent storage to store the subscription key. If no subscription key is stored, the user is prompted to enter one. If the subscription key is rejected by the API, the user is prompted to re-enter a subscription key.

The `getSubscriptionKey()` function uses the `storeValue` and `retrieveValue` functions to store and retrieve a user's subscription key. These functions use the `localStorage` object, if supported, or cookies.

```javascript
// Cookie names for stored data.
API_KEY_COOKIE   = "bing-search-api-key";
CLIENT_ID_COOKIE = "bing-search-client-id";

BING_ENDPOINT = "https://api.cognitive.microsoft.com/bing/v7.0/search";

// See source code for storeValue and retrieveValue definitions.

// Get stored subscription key, or prompt if it's not found.
function getSubscriptionKey() {
    var key = retrieveValue(API_KEY_COOKIE);
    while (key.length !== 32) {
        key = prompt("Enter Bing Search API subscription key:", "").trim();
    }
    // Always set the cookie in order to update the expiration date.
    storeValue(API_KEY_COOKIE, key);
    return key;
}
```

As we saw earlier, when the form is submitted, `onsubmit` fires, calling `bingWebSearch`. This function constructs the query and returns a response with applicable search results based on the options selected by the user. `getSubscriptionKey` is called on each submission to authenticate the request.

## Performing the request

Given the query, the options string, and the API key, the `BingWebSearch` function uses an `XMLHttpRequest` object to make the request to the Bing Web Search endpoint.

```javascript
// perform a search given query, options string, and API key
function bingWebSearch(query, options, key) {

    // scroll to top of window
    window.scrollTo(0, 0);
    if (!query.trim().length) return false;     // empty query, do nothing

    showDiv("noresults", "Working. Please wait.");
    hideDivs("pole", "mainline", "sidebar", "_json", "_http", "paging1", "paging2", "error");

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

Upon successful completion of the HTTP request, JavaScript calls our `load` event handler, the `handleBingResponse()` function, to handle a successful HTTP GET request to the API.

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
        return;
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
            if (jsobj._type === "SearchResponse" && "rankingResponse" in jsobj) {
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
> A successful HTTP request does *not* necessarily mean that the search itself succeeded. If an error occurs in the search operation, the Bing Web Search API returns a non-200 HTTP status code and includes error information in the JSON response. Additionally, if the request was rate-limited, the API returns an empty response.

Much of the code in both of the preceding functions is dedicated to error handling. Errors may occur at the following stages:

|Stage|Potential error(s)|Handled by|
|-|-|-|
|Building JavaScript request object|Invalid URL|`try`/`catch` block|
|Making the request|Network errors, aborted connections|`error` and `abort` event handlers|
|Performing the search|Invalid request, invalid JSON, rate limits|tests in `load` event handler|

Errors are handled by calling `renderErrorMessage()` with any details known about the error. If the response passes the full gauntlet of error tests, we call `renderSearchResults()` to display the search results in the page.

## Displaying search results

The Bing Web Search API [requires you to display results in a specified order](useanddisplayrequirements.md). Since the API may return different kinds of responses, it is not enough to iterate through the top-level `WebPages` collection in the JSON response and display those results. (If you want only one kind of results, use the `responseFilter` query parameter or another Bing Search endpoint.)

Instead, we use the `rankingResponse` in the search results to order the results for display. This object refers to items in the `WebPages` `News`, `Images`, and/or `Videos` collections, or in other top-level answer collections in the JSON response.

`rankingResponse` may contain up to three collections of search results, designated `pole`, `mainline`, and `sidebar`.

`pole`, if present, is the most relevant search result and should be displayed prominently. `mainline` refers to the bulk of the search results. Mainline results should be displayed immediately after `pole` (or first, if `pole` is not present).

Finally. `sidebar` refers to auxiliary search results. Often, these results are related searches or images. If possible, these results should be displayed in an actual sidebar. If screen limits make a sidebar impractical (for example, on a mobile device), they should appear after the `mainline` results.

Each item in a `rankingResponse` collection refers to the actual search result items in two different, but equivalent, ways.

| | |
|-|-|
|`id`|The `id` looks like a URL, but should not be used for links. The `id` type of a ranking result matches the `id` of either a search result item in an answer collection, *or* an entire answer collection (such as `Images`).
|`answerType`, `resultIndex`|The `answerType` refers to the top-level answer collection that contains the result (for example, `WebPages`). The `resultIndex` refers to the result's index within that collection. If `resultIndex` is omitted, the ranking result refers to the entire collection.

> [!NOTE]
> For more information on this part of the search response, see [Rank Results](rank-results.md).

You may use whichever method of locating the referenced search result item is most convenient for your application. In our tutorial code, we use the `answerType` and `resultIndex` to locate each search result.

Finally, it's time to look at our function `renderSearchResults()`. This function iterates over the three `rankingResponse` collections that represent the three sections of the search results. For each section, we call `renderResultsItems()` to render the results for that section.

```javascript
// render the search results given the parsed JSON response
function renderSearchResults(results) {

    // if spelling was corrected, update search field
    if (results.queryContext.alteredQuery)
        document.forms.bing.query.value = results.queryContext.alteredQuery;

    // add Prev / Next links with result count
    var pagingLinks = renderPagingLinks(results);
    showDiv("paging1", pagingLinks);
    showDiv("paging2", pagingLinks);

    // for each possible section, render the resuts from that section
    for (section in {pole: 0, mainline: 0, sidebar: 0}) {
        if (results.rankingResponse[section])
            showDiv(section, renderResultsItems(section, results));
    }
}
```

`renderResultsItems()` in turn iterates over the items in each `rankingResponse` section, maps each ranking result to a search result using the `answerType` and `resultIndex` fields, and calls the appropriate rendering function to generate the result's HTML.

If `resultIndex` is not specified for a given ranking item, `renderResultsItems()` iterates over all results of that type and calls the rendering function for each item.

Either way, the resulting HTML is inserted into the appropriate `<div>` element in the page.

```javascript
// render search results from rankingResponse object in specified order
function renderResultsItems(section, results) {

    var items = results.rankingResponse[section].items;
    var html = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        // collection name has lowercase first letter while answerType has uppercase
        // e.g. `WebPages` rankingResult type is in the `webPages` top-level collection
        var type = item.answerType[0].toLowerCase() + item.answerType.slice(1);
        // must have results of the given type AND a renderer for it
        if (type in results && type in searchItemRenderers) {
            var render = searchItemRenderers[type];
            // this ranking item refers to ONE result of the specified type
            if ("resultIndex" in item) {
                html.push(render(results[type].value[item.resultIndex], section));
            // this ranking item refers to ALL results of the specified type
            } else {
                var len = results[type].value.length;
                for (var j = 0; j < len; j++) {
                    html.push(render(results[type].value[j], section, j, len));
                }
            }
        }
    }
    return html.join("\n\n");
}
```

## Rendering result items

In our JavaScript code is an object, `searchItemRenderers`, that contains *renderers:* functions that generate HTML for each kind of search result.

```javascript
// render functions for various types of search results
searchItemRenderers = {
    webPages: function(item) { ... },
    news: function(item) { ... },
    images: function(item, section, index, count) { ... },
    videos: function(item, section, index, count) { ... },
    relatedSearches: function(item, section, index, count) { ... }
}
```

> [!NOTE]
> Our tutorial app has renderers for Web pages, news items, images, videos, and related searches. Your own application needs renderers for any kinds of results you might receive, which could include computations, spelling suggestions, entities, time zones, and definitions.

Some of our rendering functions accept only the `item` parameter: a JavaScript object that represents a single search result. Others accept additional parameters, which can be used to render items differently in different contexts. (A renderer that does not use this information does not need to accept these parameters.)

The context arguments are:

| | |
|-|-|
|`section`|The results section (`pole`, `mainline`, or `sidebar`) in which the item appears.
|`index`<br>`count`|Available when the `rankingResponse` item specifies that all results in a given collection are to be displayed; `undefined` otherwise. These parameters receive the index of the item within its collection and the total number of items in that collection. You can this information to number the results, to generate different HTML for the first or last result, and so on.|

In our tutorial app, both the `images` and `relatedSearches` renderers use the context arguments to customize the HTML they generate. Let's take a closer look at the `images` renderer:

```javascript
searchItemRenderers = {
    // render image result using thumbnail
    images: function(item, section, index, count) {
        var height = 60;
        var width = Math.round(height * item.thumbnail.width / item.thumbnail.height);
        var html = [];
        if (section === "sidebar") {
            if (index) html.push("<br>");
        } else {
            if (!index) html.push("<p class='images'>");
        }
        html.push("<a href='" + item.hostPageUrl + "'>");
        var title = escape(item.name) + "\n" + getHost(item.hostPageDisplayUrl);
        html.push("<img src='"+ item.thumbnailUrl + "&h=" + height + "&w=" + width +
            "' height=" + height + " width=" + width + " title='" + title + "' alt='" + title + "'>");
        html.push("</a>");
        return html.join("");
    }, // other renderers omitted
}
```

Our image renderer function:

> [!div class="checklist"]
> * Calculates the image thumbnail size (width varies, while height is fixed at 60 pixels).
> * Inserts the HTML that precedes the image result depending on context.
> * Builds the HTML `<a>` tag that links to the page containing the image.
> * Builds the HTML `<img>` tag to display the image thumbnail.

The image renderer uses the `section` and `index` variables to display results differently depending on where they appear. A line break (`<br>` tag) is inserted between image results in the sidebar, so that the sidebar displays a column of images. In other sections, the first image result `(index === 0)` is preceded by a `<p>` tag. The thumbnails otherwise butt up against each other and wrap as needed in the browser window.

The thumbnail size is used in both the `<img>` tag and the `h` and `w` fields in the thumbnail's URL. The [Bing thumbnail service](resize-and-crop-thumbnails.md) then delivers a thumbnail of exactly that size. The `title` and `alt` attributes (a textual description of the image) are constructed from the image's name and the hostname in the URL.

Images appear as shown here in the mainline search results.

![[Bing image results]](media/cognitive-services-bing-web-api/web-search-spa-images.png)

## Persisting client ID

Responses from the Bing search APIs may include a `X-MSEdge-ClientID` header that should be sent back to the API with successive requests. If multiple Bing Search APIs are being used, the same client ID should be used with all of them, if possible.

Providing the `X-MSEdge-ClientID` header allows the Bing APIs to associate all of a user's searches, which has two important benefits.

First, it allows the Bing search engine to apply past context to searches to find results that better satisfy the user. If a user has previously searched for terms related to sailing, for example, a later search for "knots" might preferentially return information about knots used in sailing.

Second, Bing may randomly select users to experience new features before they are made widely available. Providing the same client ID with each request ensures that users who have been chosen to see a feature always see it. Without the client ID, the user might see a feature appear and disappear, seemingly at random, in their search results.

Browser security policies (CORS) may prevent the `X-MSEdge-ClientID` header from being available to JavaScript. This limitation occurs when the search response has a different origin from the page that requested it. In a production environment, you should address this policy by hosting a server-side script that does the API call on the same domain as the Web page. Since the script has the same origin as the Web page, the `X-MSEdge-ClientID` header is then available to JavaScript.

> [!NOTE]
> In a production Web application, you should perform the request server-side anyway. Otherwise, your Bing Search API key must be included in the Web page, where it is available to anyone who views source. You are billed for all usage under your API subscription key, even requests made by unauthorized parties, so it is important not to expose your key.

For development purposes, you can make the Bing Web Search API request through a CORS proxy. The response from such a proxy has an `Access-Control-Expose-Headers` header that whitelists response headers and makes them available to JavaScript.

It's easy to install a CORS proxy to allow our tutorial app to access the client ID header. First, if you don't already have it, [install Node.js](https://nodejs.org/en/download/). Then issue the following command in a command window:

    npm install -g cors-proxy-server

Next, change the Bing Web Search endpoint in the HTML file to:

    http://localhost:9090/https://api.cognitive.microsoft.com/bing/v7.0/search

Finally, start the CORS proxy with the following command:

    cors-proxy-server

Leave the command window open while you use the tutorial app; closing the window stops the proxy. In the expandable HTTP Headers section below the search results, you can now see the `X-MSEdge-ClientID` header (among others) and verify that it is the same for each request.

## Next steps

> [!div class="nextstepaction"]
> [Visual Search mobile app tutorial](computer-vision-web-search-tutorial.md)

> [!div class="nextstepaction"]
> [Bing Web Search API reference](//docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v7-reference)
