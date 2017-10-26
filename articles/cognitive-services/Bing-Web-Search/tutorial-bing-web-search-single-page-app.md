---
title: Bing Web Search single-page Web app | Microsoft Docs
description: Shows how to use the Bing Web Search API in a single-page Web application.
services: cognitive-services
author: jerrykindall
manager: ehansen

ms.service: cognitive-services
ms.technology: bing-web-search
ms.topic: article
ms.date: 10/04/2017
ms.author: v-jerkin
---
# Tutorial: Single-page Web app

The Bing Web Search API lets you search the Web and obtain results of varying types relevant to a search query. In this tutorial, we build a single-page Web application that uses the Bing Web Search API to display search results right in the page. The application includes HTML, CSS, and JavaScript components.

![[Single-page Bing Web Search app]](media/cognitive-services-bing-web-api/web-search-spa-demo.png)

> [!NOTE]
> The JSON and HTTP headings at the bottom of the page reveal the JSON response and HTTP request information when clicked. These details are useful when exploring the service.

The tutorial app illustrates how to:

> [!div class="checklist"]
> * Perform a Bing Web Search API call in JavaScript
> * Pass search options to the Bing Web Search API
> * Display Web, news, image, and video search results
> * Page through search results
> * Handle the Bing client ID and API subscription key
> * Handle errors that might occur

The tutorial page is entirely self-contained; it does not use any external frameworks, style sheets, or even image files. It uses only widely supported JavaScript language features and works with current versions of all major Web browsers.

In this tutorial, we discuss only selected portions of the source code. The full source code is available [on a separate page](tutorial-bing-web-search-single-page-app-source.md). Copy and paste this code into a text editor and save it as `bing.html`.

## App components

Like any single-page Web app, the tutorial application includes three parts:

> [!div class="checklist"]
> * HTML - Defines the structure and content of the page
> * CSS - Defines the appearance of the page
> * JavaScript - Defines the behavior of the page

This tutorial doesn't cover most of the HTML or CSS in detail, as they are straightforward.

The HTML contains the search form in which the user enters a query and chooses search options. The form is connected to the JavaScript that actually performs the search by the `<form>` tag's `onsubmit` attribute:

```html
<form name="bing" onsubmit="return newBingWebSearch(this)">
```

The `onsubmit` handler returns `false`, which keeps the form from being submitted to a server. The JavaScript code actually does the work of collecting the necessary information from the form and performing the search.

The HTML also contains the divisions (HTML `<div>` tags) where the search results appear.

## Managing subscription key

To avoid having to include the Bing Search API subscription key in the code, we use the browser's persistent storage to store the key. If no key is stored, we prompt for the user's key and store it for later use. If the key is later rejected by the API, we invalidate the stored key so the user will be prompted again.

We define `storeValue` and `retrieveValue` functions that use either the `localStorage` object (if the browser supports it) or a cookie. Our `getSubscriptionKey()` function uses these functions to store and retrieve the user's key.

```javascript
// cookie names for data we store
API_KEY_COOKIE   = "bing-search-api-key";
CLIENT_ID_COOKIE = "bing-search-client-id";

BING_ENDPOINT = "https://api.cognitive.microsoft.com/bing/v7.0/search";

// ... omitted definitions of storeValue() and retrieveValue()

// get stored API subscription key, or prompt if it's not found
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

The HTML `<body>` tag includes an `onload` attribute that calls `getSubscriptionKey()` when the page has finished loading. This call serves to immediately prompt the user for their key if they haven't yet entered one.

```html
<body onload="document.forms.bing.query.focus(); getSubscriptionKey();">
```

## Selecting search options

![[Bing Web Search form]](media/cognitive-services-bing-web-api/web-search-spa-form.png)

The HTML form includes elements with the following names:

| | |
|-|-|
| `where` | A drop-down menu for selecting the market (location and language) used for the search. |
| `query` | The text field in which to enter the search terms. |
| `what` | Checkboxes for promoting particular kinds of results. Promoting images, for example, increases the ranking of images. |
| `when` | Drop-down menu for optionally limiting the search to the most recent day, week, or month. |
| `safe` | A checkbox indicating whether to use Bing's SafeSearch feature to filter out "adult" results. |
| `count` | Hidden field. The number of search results to return on each request. Change to display fewer or more results per page. |
| `offset` | Hidden field. The offset of the first search result in the request; used for paging. It's reset to `0` on a new request. |

> [!NOTE]
> Bing Web Search offers many more query parameters. We're using only a few of them here.

The JavaScript function `bingSearchOptions()` converts these fields to the format required by the Bing Search API.

```javascript
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

For example, the `SafeSearch` parameter in an actual API call can be `strict`, `moderate`, or `off`, with `moderate` being the default. Our form, however, uses a checkbox, which has only two states. The JavaScript code converts this setting to either `strict` or `off` (`moderate` is not used).

If any of the **Promote** checkboxes are marked, we also add an `answerCount` parameter to the query. `answerCount` is required when using the `promote` parameter. We simply set it to `9` (the number of result types supported by the Bing Web Search API) to make sure we get the maximum possible number of result types.

> [!NOTE]
> Promoting a result type does not *guarantee* that the search results include that kind of result. Rather, promotion increases the ranking of those kinds of results relative to their usual ranking. To limit searches to particular kinds of results, use the `responseFilter` query parameter, or call a more specific endpoint such as Bing Image Search or Bing News Search.

We also send `textDecoration` and `textFormat` query parameters to cause the search term to be boldfaced in the search results. These values are hardcoded in the script.

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
