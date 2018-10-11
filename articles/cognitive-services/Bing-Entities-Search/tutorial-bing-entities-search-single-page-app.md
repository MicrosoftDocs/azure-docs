---
title: "Tutorial: Bing Entity Search single-page web app"
titlesuffix: Azure Cognitive Services
description: Shows how to use the Bing Entity Search API in a single-page Web application.
services: cognitive-services
author: v-jerkin
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-entity-search
ms.topic: tutorial
ms.date: 12/08/2017
ms.author: v-jerkin
---
# Tutorial: Single-page web app

The Bing Entity Search API lets you search the Web for information about *entities* and *places.* You may request either kind of result, or both, in a given query. The definitions of places and entities are provided below.

|||
|-|-|
|Entities|Well-known people, places, and things that you find by name|
|Places|Restaurants, hotels, and other local businesses that you find by name *or* by type (Italian restaurants)|

In this tutorial, we build a single-page Web application that uses the Bing Entity Search API to display search results right in the page. The application includes HTML, CSS, and JavaScript components.

The API lets you prioritize results by location. In a mobile app, you can ask the device for its own location. In a Web app, you can use the `getPosition()` function. But this call works only in secure contexts, and it may not provide a precise location. Also, the user may want to search for entities near a location other than their own.

Our app therefore calls upon the Bing Maps service to obtain latitude and longitude from a user-entered location. The user can then enter the name of a landmark ("Space Needle") or a full or partial address ("New York City"), and the Bing Maps API provides the coordinates.

<!-- Remove until we can replace with a sanitized version.
![[Single-page Bing Entity Search app]](media/entity-search-spa-demo.png)
-->

> [!NOTE]
> The JSON and HTTP headings at the bottom of the page reveal the JSON response and HTTP request information when clicked. These details are useful when exploring the service.

The tutorial app illustrates how to:

> [!div class="checklist"]
> * Perform a Bing Entity Search API call in JavaScript
> * Perform a Bing Maps `locationQuery` API call in JavaScript
> * Pass search options to the API calls
> * Display search results
> * Handle the Bing client ID and API subscription keys
> * Deal with any errors that might occur

The tutorial page is entirely self-contained; it does not use any external frameworks, style sheets, or even image files. It uses only widely supported JavaScript language features and works with current versions of all major Web browsers.

In this tutorial, we discuss only selected portions of the source code. The full source code is available [on a separate page](tutorial-bing-entities-search-single-page-app-source.md). Copy and paste this code into a text editor and save it as `bing.html`.

> [!NOTE]
> This tutorial is substantially similar to the [single-page Bing Web Search app tutorial](../Bing-Web-Search/tutorial-bing-web-search-single-page-app.md), but deals only with entity search results.

## App components

Like any single-page Web app, the tutorial application includes three parts:

> [!div class="checklist"]
> * HTML - Defines the structure and content of the page
> * CSS - Defines the appearance of the page
> * JavaScript - Defines the behavior of the page

This tutorial doesn't cover most of the HTML or CSS in detail, as they are straightforward.

The HTML contains the search form in which the user enters a query and chooses search options. The form is connected to the JavaScript that actually performs the search by the `<form>` tag's `onsubmit` attribute:

```html
<form name="bing" onsubmit="return newBingEntitySearch(this)">
```

The `onsubmit` handler returns `false`, which keeps the form from being submitted to a server. The JavaScript code actually does the work of collecting the necessary information from the form and performing the search.

The search is done in two phases. First, if the user has entered a location restriction, a Bing Maps query is done to convert it into coordinates. The callback for this query then kicks off the Bing Entity Search query.

The HTML also contains the divisions (HTML `<div>` tags) where the search results appear.

## Managing subscription keys

> [!NOTE]
> This app requires subscription keys for both the Bing Search API and the Bing Maps API. You can use a [trial Bing Search key](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api) and a [basic Bing Maps key](https://www.microsoft.com/maps/create-a-bing-maps-key).

To avoid having to include the Bing Search and Bing Maps API subscription keys in the code, we use the browser's persistent storage to store them. If either key has not been stored, we prompt for it and store it for later use. If the key is later rejected by the API, we invalidate the stored key so the user is asked for it upon their next search.

We define `storeValue` and `retrieveValue` functions that use either the `localStorage` object (if the browser supports it) or a cookie. Our `getSubscriptionKey()` function uses these functions to store and retrieve the user's key.

```javascript
// cookie names for data we store
SEARCH_API_KEY_COOKIE = "bing-search-api-key";
MAPS_API_KEY_COOKIE   = "bing-maps-api-key";
CLIENT_ID_COOKIE      = "bing-search-client-id";

// API endpoints
SEARCH_ENDPOINT = "https://api.cognitive.microsoft.com/bing/v7.0/entities";
MAPS_ENDPOINT   = "http://dev.virtualearth.net/REST/v1/Locations";

// ... omitted definitions of storeValue() and retrieveValue()

// get stored API subscription key, or prompt if it's not found
function getSubscriptionKey(cookie_name, key_length, api_name) {
    var key = retrieveValue(cookie_name);
    while (key.length !== key_length) {
        key = prompt("Enter " + api_name + " API subscription key:", "").trim();
    }
    // always set the cookie in order to update the expiration date
    storeValue(cookie_name, key);
    return key;
}

function getMapsSubscriptionKey() {
    return getSubscriptionKey(MAPS_API_KEY_COOKIE, 64, "Bing Maps");
}

function getSearchSubscriptionKey() {
    return getSubscriptionKey(SEARCH_API_KEY_COOKIE, 32, "Bing Search");
}
```

The HTML `<body>` tag includes an `onload` attribute that calls `getSearchSubscriptionKey()` and `getMapsSubscriptionKey()` when the page has finished loading. These calls serve to immediately prompt the user for their keys if they haven't yet entered them.

```html
<body onload="document.forms.bing.query.focus(); getSearchSubscriptionKey(); getMapsSubscriptionKey();">
```

## Selecting search options

![[Bing Entity Search form]](media/entity-search-spa-form.png)

The HTML form includes the following controls:

| | |
|-|-|
|`where`|A drop-down menu for selecting the market (location and language) used for the search.|
|`query`|The text field in which to enter the search terms.|
|`safe`|A checkbox indicating whether SafeSearch is turned on (restricts "adult" results)|
|`what`|A menu for choosing to search for entities, places, or both.|
|`mapquery`|The text field in which the user may enter a full or partial address, a landmark, etc. to help Bing Entity Search return more relevant results.|

> [!NOTE]
> Places results are currently available only in the United States. The `where` and `what` menus have code to enforce this restriction. If you choose a non-US market while Places is selected in the `what` menu, `what` changes to Anything. If you choose Places while a non-US market is selected in the `where` menu, `where` changes to the US.

Our JavaScript function `bingSearchOptions()` converts these fields to a partial query string for the Bing Search API.

```javascript
// build query options from the HTML form
function bingSearchOptions(form) {

    var options = [];
    options.push("mkt=" + form.where.value);
    options.push("SafeSearch=" + (form.safe.checked ? "strict" : "off"));
    if (form.what.selectedIndex) options.push("responseFilter=" + form.what.value);
    return options.join("&");
}
```

For example, the SafeSearch feature can be `strict`, `moderate`, or `off`, with `moderate` being the default. But our form uses a checkbox, which has only two states. The JavaScript code converts this setting to either `strict` or `off` (we don't use `moderate`).

The `mapquery` field isn't handled in `bingSearchOptions()` because it is used for the Bing Maps location query, not for Bing Entity Search.

## Obtaining a location

The Bing Maps API offers a [`locationQuery` method](//msdn.microsoft.com/library/ff701711.aspx), which we use to find the latitude and longitude of the location the user enters. These coordinates are then passed to the Bing Entity Search API with the user's request. The search results prioritize entities and places that are close to the specified location.

We can't access the Bing Maps API using an ordinary `XMLHttpRequest` query in a Web app because the service does not support cross-origin queries. Fortunately, it supports JSONP (the "P" is for "padded"). A JSONP response is an ordinary JSON response wrapped in a function call. The request is made by inserting using a `<script>` tag into the document. (Loading scripts is not subject to browser security policies.)

The `bingMapsLocate()` function creates and inserts the `<script>` tag for the query. The `jsonp=bingMapsCallback` segment of the query string specifies the name of the function to be called with the response.

```javascript
function bingMapsLocate(where) {

    where = where.trim();
    var url = MAPS_ENDPOINT + "?q=" + encodeURIComponent(where) + 
                "&jsonp=bingMapsCallback&maxResults=1&key=" + getMapsSubscriptionKey();

    var script = document.getElementById("bingMapsResult")
    if (script) script.parentElement.removeChild(script);

    // global variable holds reference to timer that will complete the search if the maps query fails
    timer = setTimeout(function() {
        timer = null;
        var form = document.forms.bing;
        bingEntitySearch(form.query.value, "", bingSearchOptions(form), getSearchSubscriptionKey());
    }, 5000);

    script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("id", "bingMapsResult");
    script.setAttribute("src", url);
    script.setAttribute("onerror", "BingMapsCallback(null)");
    document.body.appendChild(script);

    return false;
}
```

> [!NOTE]
> If the Bing Maps API does not respond, the `bingMapsCallBack()` function is never called. Ordinarily, that would mean that `bingEntitySearch()` isn't called, and the entity search results do not appear. To avoid this scenario, `bingMapsLocate()` also sets a timer to call `bingEntitySearch()` after five seconds. There is logic in the callback function to avoid performing the entity search twice.

When the query completes, the `bingMapsCallback()` function is called, as requested.

```javascript
function bingMapsCallback(response) {

    if (timer) {    // we beat the timer; stop it from firing
        clearTimeout(timer);
        timer = null;
    } else {        // the timer beat us; don't do anything
        return; 
    }

    var location = "";
    var name = "";
    var radius = 1000;

    if (response) {
        try {
            if (response.statusCode === 401) {
                invalidateMapsKey();
            } else if (response.statusCode === 200) {
                var resource = response.resourceSets[0].resources[0];
                var coords   = resource.point.coordinates;
                name         = resource.name;

                // the radius is the largest of the distances between the location and the corners
                // of its bounding box (in case it's not in the center) with a minimum of 1 km
                try {
                    var bbox    = resource.bbox;
                    radius  = Math.max(haversineDistance(bbox[0], bbox[1], coords[0], coords[1]),
                                       haversineDistance(coords[0], coords[1], bbox[2], bbox[1]),
                                       haversineDistance(bbox[0], bbox[3], coords[0], coords[1]),
                                       haversineDistance(coords[0], coords[1], bbox[2], bbox[3]), 1000);
                } catch(e) {  }
                var location = "lat:" + coords[0] + ";long:" + coords[1] + ";re:" + Math.round(radius);
            }
        }
        catch (e) { }   // response is unexpected. this isn't fatal, so just don't provide location
    }

    var form = document.forms.bing;
    if (name) form.mapquery.value = name;
    bingEntitySearch(form.query.value, location, bingSearchOptions(form), getSearchSubscriptionKey());

}
```

Along with latitude and longitude, the Bing Entity Search query requires a *radius* that indicates the precision of the location information. We calculate the radius using the *bounding box* provided in the Bing Maps response. The bounding box is a rectangle that surrounds the entire location. For example, if the user enters `NYC`, the result contains roughly central coordinates of New York City and a bounding box that encompasses the city. 

We first calculate the distances from the primary coordinates to each of the four corners of the bounding box using the function `haversineDistance()` (not shown). We use the largest of these four distances as the radius. The minimum radius is a kilometer. This value is also used as a default if no bounding box is provided in the response.

Having obtained the coordinates and the radius, we then call `bingEntitySearch()` to perform the actual search.

## Performing the search

Given the query, a location, an options string, and the API key, the `BingEntitySearch()` function makes the Bing Entity Search request.

```javascript
// perform a search given query, location, options string, and API keys
function bingEntitySearch(query, latlong, options, key) {

    // scroll to top of window
    window.scrollTo(0, 0);
    if (!query.trim().length) return false;     // empty query, do nothing

    showDiv("noresults", "Working. Please wait.");
    hideDivs("pole", "mainline", "sidebar", "_json", "_http", "error");

    var request = new XMLHttpRequest();
    var queryurl = SEARCH_ENDPOINT + "?q=" + encodeURIComponent(query) + "&" + options;

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

    if (latlong) request.setRequestHeader("X-Search-Location", latlong);

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
            if (jsobj._type === "SearchResponse") {
                renderSearchResults(jsobj);
            } else {
                renderErrorMessage("No search results in JSON response");
            }
        } else {
            renderErrorMessage("Empty response (are you sending too many requests too quickly?)");
        }
    if (divHidden("pole") && divHidden("mainline") && divHidden("sidebar")) 
        showDiv("noresults", "No results.<p><small>Looking for restaurants or other local businesses? Those currently areen't supported outside the US.</small>");
    }

    // Any other HTTP status is an error
    else {
        // 401 is unauthorized; force re-prompt for API key for next request
        if (this.status === 401) invalidateSearchKey();

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
> A successful HTTP request does *not* necessarily mean that the search itself succeeded. If an error occurs in the search operation, the Bing Entity Search API returns a non-200 HTTP status code and includes error information in the JSON response. Additionally, if the request was rate-limited, the API returns an empty response.

Much of the code in both of the preceding functions is dedicated to error handling. Errors may occur at the following stages:

|Stage|Potential error(s)|Handled by|
|-|-|-|
|Building JavaScript request object|Invalid URL|`try`/`catch` block|
|Making the request|Network errors, aborted connections|`error` and `abort` event handlers|
|Performing the search|Invalid request, invalid JSON, rate limits|tests in `load` event handler|

Errors are handled by calling `renderErrorMessage()` with any details known about the error. If the response passes the full gauntlet of error tests, we call `renderSearchResults()` to display the search results in the page.

## Displaying search results

The Bing Entity Search API [requires you to display results in a specified order](use-display-requirements.md). Since the API may return two different kinds of responses, it is not enough to iterate through the top-level `Entities` or `Places` collection in the JSON response and display those results. (If you want only one type of result, use the `responseFilter` query parameter.)

Instead, we use the `rankingResponse` collection in the search results to order the results for display. This object refers to items in the `Entitiess` and/or `Places` collections.

`rankingResponse` may contain up to three collections of search results, designated `pole`, `mainline`, and `sidebar`. 

`pole`, if present, is the most relevant search result and should be displayed prominently. `mainline` refers to the bulk of the search results. Mainline results should be displayed immediately after `pole` (or first, if `pole` is not present). 

Finally. `sidebar` refers to auxiliary search results. They may be displayed in an actual sidebar or simply after the mainline results. We have chosen the latter for our tutorial app.

Each item in a `rankingResponse` collection refers to the actual search result items in two different, but equivalent, ways.

| | |
|-|-|
|`id`|The `id` looks like a URL, but should not be used for links. The `id` type of a ranking result matches the `id` of either a search result item in an answer collection, *or* an entire answer collection (such as `Entities`).
|`answerType`<br>`resultIndex`|The `answerType` refers to the top-level answer collection that contains the result (for example, `Entities`). The `resultIndex` refers to the result's index within that collection. If `resultIndex` is omitted, the ranking result refers to the entire collection.

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

    // for each possible section, render the resuts from that section
    for (section in {pole: 0, mainline: 0, sidebar: 0}) {
        if (results.rankingResponse[section])
            showDiv(section, renderResultsItems(section, results));
    }
}
```

## Rendering result items

In our JavaScript code is an object, `searchItemRenderers`, that contains *renderers:* functions that generate HTML for each kind of search result.

```javascript
searchItemRenderers = { 
    entities: function(item) { ... },
    places: function(item) { ... }
}
```

A renderer function may accept the following parameters:

| | |
|-|-|
|`item`|The JavaScript object containing the item's properties, such as its URL and its description.|
|`index`|The index of the result item within its collection.|
|`count`|The number of items in the search result item's collection.|

The `index` and `count` parameters can be used to number results, to generate special HTML for the beginning or end of a collection, to insert line breaks after a certain number of items, and so on. If a renderer does not need this functionality, it does not need to accept these two parameters. In fact, we do not use them in the renderers for our tutorial app.

Let's take a closer look at the `entities` renderer:

```javascript
    entities: function(item) {
        var html = [];
        html.push("<p class='entity'>");
        if (item.image) {
            var img = item.image;
            if (img.hostPageUrl) html.push("<a href='" + img.hostPageUrl + "'>");
            html.push("<img src='" + img.thumbnailUrl +  "' title='" + img.name + "' height=" + img.height + " width= " + img.width + ">");
            if (img.hostPageUrl) html.push("</a>");
            if (img.provider) {
                var provider = img.provider[0];
                html.push("<small>Image from ");
                if (provider.url) html.push("<a href='" + provider.url + "'>");
                html.push(provider.name ? provider.name : getHost(provider.url));
                if (provider.url) html.push("</a>");
                html.push("</small>");
            }
        }
        html.push("<p>");
        if (item.entityPresentationInfo) {
            var pi = item.entityPresentationInfo;
            if (pi.entityTypeHints || pi.entityTypeDisplayHint) {
                html.push("<i>");
                if (pi.entityTypeDisplayHint) html.push(pi.entityTypeDisplayHint);
                else if (pi.entityTypeHints) html.push(pi.entityTypeHints.join("/"));
                html.push("</i> - ");
            }
        }
        html.push(item.description);
        if (item.webSearchUrl) html.push("&nbsp;<a href='" + item.webSearchUrl + "'>More</a>")
        if (item.contractualRules) {
            html.push("<p><small>");
            var rules = [];
            for (var i = 0; i < item.contractualRules.length; i++) {
                var rule = item.contractualRules[i];
                var link = [];
                if (rule.license) rule = rule.license;
                if (rule.url) link.push("<a href='" + rule.url + "'>");
                link.push(rule.name || rule.text || rule.targetPropertyName + " source");
                if (rule.url) link.push("</a>");
                rules.push(link.join(""));
            }
            html.push("License: " + rules.join(" - "));
            html.push("</small>");
        }
        return html.join("");
    }, // places renderer omitted
```

Our entity renderer function:

> [!div class="checklist"]
> * Builds the HTML `<img>` tag to display the image thumbnail, if any. 
> * Builds the HTML `<a>` tag that links to the page that contains the image.
> * Builds the description that displays information about the image and the site it's on.
> * Incorporates the entity's classification using the display hints, if any.
> * Includes a link to a Bing search to get more information about the entity.
> * Displays any licensing or attribution information required by data sources.

## Persisting client ID

Responses from the Bing search APIs may include a `X-MSEdge-ClientID` header that should be sent back to the API with successive requests. If multiple Bing Search APIs are being used, the same client ID should be used with all of them, if possible.

Providing the `X-MSEdge-ClientID` header allows the Bing APIs to associate all of a user's searches, which has two important benefits.

First, it allows the Bing search engine to apply past context to searches to find results that better satisfy the user. If a user has previously searched for terms related to sailing, for example, a later search for "docks" might preferentially return information about places to dock a sailboat.

Second, Bing may randomly select users to experience new features before they are made widely available. Providing the same client ID with each request ensures that users that have been chosen to see a feature always see it. Without the client ID, the user might see a feature appear and disappear, seemingly at random, in their search results.

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
> [Bing Entity Search API reference](//docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference)

> [!div class="nextstepaction"]
> [Bing Maps API documentation](//msdn.microsoft.com/library/dd877180.aspx)
