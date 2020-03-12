---
title: "Tutorial: Create a single-page web app - Bing Web Search API"
titleSuffix: Azure Cognitive Services
description: This single-page app demonstrates how the Bing Web Search API can be used to retrieve, parse, and display relevant search results in a single-page app.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-web-search
ms.topic: tutorial
ms.date: 03/05/2020
ms.author: aahi
---

# Tutorial: Create a single-page app using the Bing Web Search API

This single-page app demonstrates how to retrieve, parse, and display search results from the Bing Web Search API. The tutorial uses boilerplate HTML and CSS, and focuses on the JavaScript code. HTML, CSS, and JS files are available on [GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/tree/master/Tutorials/Bing-Web-Search) with quickstart instructions.

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
* A subscription key for the Bing Search API. If you don't have one, [Create a Bing Search v7 resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesBingSearch-v7). You can also use a [trial key](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api).
## Get the source code and install dependencies

The first step is to clone the repository with the sample app's source code.

```console
git clone https://github.com/Azure-Samples/cognitive-services-REST-api-samples.git
```

Then run `npm install`. For this tutorial, Express.js is the only dependency.

```console
cd <path-to-repo>/cognitive-services-REST-api-samples/Tutorials/Bing-Web-Search
npm install
```

## App components

The sample app we're building is made up of four parts:

* `bing-web-search.js` - Our Express.js app. It handles request/response logic and routing.
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

The HTML form includes options that map to query parameters in the [Bing Web Search API v7](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-web-api-v7-reference#query-parameters). This table provides a breakdown of how users can filter search results using the sample app:

| Parameter | Description |
|-----------|-------------|
| `query` | A text field to enter a query string. |
| `where` | A drop-down menu to select the market (location and language). |
| `what` | Checkboxes to promote specific result types. Promoting images, for example, increases the ranking of images in search results. |
| `when` | A drop-down menu that allows the user to limit the search results to today, this week, or this month. |
| `safe` | A checkbox to enable Bing SafeSearch, which filters out adult content. |
| `count` | Hidden field. The number of search results to return on each request. Change this value to display fewer or more results per page. |
| `offset` | Hidden field. The offset of the first search result in the request, which is used for paging. It's reset to `0` with each new request. |

> [!NOTE]
> The Bing Web Search API offers additional query parameters to help refine search results. This sample only uses a few. For a complete list of available parameters, see [Bing Web Search API v7 reference](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-web-api-v7-reference#query-parameters).

The `bingSearchOptions()` function converts these options to match the format required by the Bing Search API.

```javascript
// Build query options from selections in the HTML form.
function bingSearchOptions(form) {

    var options = [];
    // Where option.
    options.push("mkt=" + form.where.value);
    // SafeSearch option.
    options.push("SafeSearch=" + (form.safe.checked ? "strict" : "moderate"));
    // Freshness option.
    if (form.when.value.length) options.push("freshness=" + form.when.value);
    var what = [];
    for (var i = 0; i < form.what.length; i++)
        if (form.what[i].checked) what.push(form.what[i].value);
    // Promote option.
    if (what.length) {
        options.push("promote=" + what.join(","));
        options.push("answerCount=9");
    }
    // Count option.
    options.push("count=" + form.count.value);
    // Offset option.
    options.push("offset=" + form.offset.value);
    // Hardcoded text decoration option.
    options.push("textDecorations=true");
    // Hardcoded text format option.
    options.push("textFormat=HTML");
    return options.join("&");
}
```

`SafeSearch` can be set to `strict`, `moderate`, or `off`, with `moderate` being the default setting for Bing Web Search. This form uses a checkbox, which has two states: `strict` or `moderate`.

If any of the **Promote** checkboxes are selected, the `answerCount` parameter is added to the query. `answerCount` is required when using the `promote` parameter. In this snippet, the value is set to `9` to return all available result types.
> [!NOTE]
> Promoting a result type doesn't *guarantee* that it will be included in the search results. Rather, promotion increases the ranking of those kinds of results relative to their usual ranking. To limit searches to particular kinds of results, use the `responseFilter` query parameter, or call a more specific endpoint such as Bing Image Search or Bing News Search.

The `textDecoration` and `textFormat` query parameters are hardcoded into the script, and cause the search term to be boldfaced in the search results. These parameters aren't required.

## Manage subscription keys

To avoid hardcoding the Bing Search API subscription key, this sample app uses a browser's persistent storage to store the subscription key. If no subscription key is stored, the user is prompted to enter one. If the subscription key is rejected by the API, the user is prompted to re-enter a subscription key.

The `getSubscriptionKey()` function uses the `storeValue` and `retrieveValue` functions to store and retrieve a user's subscription key. These functions use the `localStorage` object, if supported, or cookies.

```javascript
// Cookie names for stored data.
API_KEY_COOKIE   = "bing-search-api-key";
CLIENT_ID_COOKIE = "bing-search-client-id";

BING_ENDPOINT = "https://api.cognitive.microsoft.com/bing/v7.0/search";

// See source code for storeValue and retrieveValue definitions.

// Get stored subscription key, or prompt if it isn't found.
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

As we saw earlier, when the form is submitted, `onsubmit` fires, calling `bingWebSearch`. This function initializes and sends the request. `getSubscriptionKey` is called on each submission to authenticate the request.

## Call Bing Web Search

Given the query, the options string, and the subscription key, the `BingWebSearch` function creates an `XMLHttpRequest` object to call the Bing Web Search endpoint.

```javascript
// Perform a search constructed from the query, options, and subscription key.
function bingWebSearch(query, options, key) {
    window.scrollTo(0, 0);
    if (!query.trim().length) return false;

    showDiv("noresults", "Working. Please wait.");
    hideDivs("pole", "mainline", "sidebar", "_json", "_http", "paging1", "paging2", "error");

    var request = new XMLHttpRequest();
    var queryurl = BING_ENDPOINT + "?q=" + encodeURIComponent(query) + "&" + options;

    // Initialize the request.
    try {
        request.open("GET", queryurl);
    }
    catch (e) {
        renderErrorMessage("Bad request (invalid URL)\n" + queryurl);
        return false;
    }

    // Add request headers.
    request.setRequestHeader("Ocp-Apim-Subscription-Key", key);
    request.setRequestHeader("Accept", "application/json");
    var clientid = retrieveValue(CLIENT_ID_COOKIE);
    if (clientid) request.setRequestHeader("X-MSEdge-ClientID", clientid);

    // Event handler for successful response.
    request.addEventListener("load", handleBingResponse);

    // Event handler for errors.
    request.addEventListener("error", function() {
        renderErrorMessage("Error completing request");
    });

    // Event handler for an aborted request.
    request.addEventListener("abort", function() {
        renderErrorMessage("Request aborted");
    });

    // Send the request.
    request.send();
    return false;
}
```

Following a successful request, the `load` event handler fires and calls the `handleBingResponse` function. `handleBingResponse` parses the result object,  displays the results, and contains error logic for failed requests.

```javascript
function handleBingResponse() {
    hideDivs("noresults");

    var json = this.responseText.trim();
    var jsobj = {};

    // Try to parse results object.
    try {
        if (json.length) jsobj = JSON.parse(json);
    } catch(e) {
        renderErrorMessage("Invalid JSON response");
        return;
    }

    // Show raw JSON and the HTTP request.
    showDiv("json", preFormat(JSON.stringify(jsobj, null, 2)));
    showDiv("http", preFormat("GET " + this.responseURL + "\n\nStatus: " + this.status + " " +
        this.statusText + "\n" + this.getAllResponseHeaders()));

    // If the HTTP response is 200 OK, try to render the results.
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

    // Any other HTTP response is considered an error.
    else {
        // 401 is unauthorized; force a re-prompt for the user's subscription
        // key on the next request.
        if (this.status === 401) invalidateSubscriptionKey();

        // Some error responses don't have a top-level errors object, if absent
        // create one.
        var errors = jsobj.errors || [jsobj];
        var errmsg = [];

        // Display the HTTP status code.
        errmsg.push("HTTP Status " + this.status + " " + this.statusText + "\n");

        // Add all fields from all error responses.
        for (var i = 0; i < errors.length; i++) {
            if (i) errmsg.push("\n");
            for (var k in errors[i]) errmsg.push(k + ": " + errors[i][k]);
        }

        // Display Bing Trace ID if it isn't blocked by CORS.
        var traceid = this.getResponseHeader("BingAPIs-TraceId");
        if (traceid) errmsg.push("\nTrace ID " + traceid);

        // Display the error message.
        renderErrorMessage(errmsg.join("\n"));
    }
}
```

> [!IMPORTANT]
> A successful HTTP request *doesn't* mean that the search itself succeeded. If an error occurs in the search operation, the Bing Web Search API returns a non-200 HTTP status code and includes error information in the JSON response. If the request was rate-limited, the API returns an empty response.

Much of the code in both of the preceding functions is dedicated to error handling. Errors may occur at the following stages:

| Stage | Potential error(s) | Handled by |
|-------|--------------------|------------|
| Building the request object | Invalid URL | `try` / `catch` block |
| Making the request | Network errors, aborted connections | `error` and `abort` event handlers |
| Performing the search | Invalid request, invalid JSON, rate limits | Tests in `load` event handler |

Errors are handled by calling `renderErrorMessage()`. If the response passes all of the error tests, `renderSearchResults()` is called to display the search results.

## Display search results

There are [use and display requirements](useanddisplayrequirements.md) for results returned by the Bing Web Search API. Since a response may include various result types, it isn't enough to iterate through the top-level `WebPages` collection. Instead, the sample app uses `RankingResponse` to order the results to spec.

> [!NOTE]
> If you only want a single result type, use the `responseFilter` query parameter, or consider using one of the other Bing Search endpoints, such as Bing Image Search.

Each response has a `RankingResponse` object that may include up to three collections: `pole`, `mainline`, and `sidebar`. `pole`, if present, is the most relevant search result and must be prominently displayed. `mainline` contains most of the search results, and is displayed immediately after `pole`. `sidebar` includes auxiliary search results. If possible, these results should be displayed in the sidebar. If screen limits make a sidebar impractical, these results should appear after the `mainline` results.

Each `RankingResponse` includes a `RankingItem` array that specifies how results must be ordered. Our sample app uses the `answerType` and `resultIndex` parameters to identify the result.

> [!NOTE]
> There are additional ways to identify and rank results. For more information, see [Using ranking to display results](rank-results.md).

Let's take a look at the code:

```javascript
// Render the search results from the JSON response.
function renderSearchResults(results) {

    // If spelling was corrected, update the search field.
    if (results.queryContext.alteredQuery)
        document.forms.bing.query.value = results.queryContext.alteredQuery;

    // Add Prev / Next links with result count.
    var pagingLinks = renderPagingLinks(results);
    showDiv("paging1", pagingLinks);
    showDiv("paging2", pagingLinks);

    // Render the results for each section.
    for (section in {pole: 0, mainline: 0, sidebar: 0}) {
        if (results.rankingResponse[section])
            showDiv(section, renderResultsItems(section, results));
    }
}
```

The `renderResultsItems()` function iterates through the items in each `RankingResponse` collection, maps each ranking result to a search result using the `answerType` and `resultIndex` values, and calls the appropriate rendering function to generate the HTML. If `resultIndex` isn't specified for an item, `renderResultsItems()` iterates through all results of that type and calls the rendering function for each item. The resulting HTML is inserted into the appropriate `<div>` element in `index.html`.

```javascript
// Render search results from the RankingResponse object per rank response and
// use and display requirements.
function renderResultsItems(section, results) {

    var items = results.rankingResponse[section].items;
    var html = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        // Collection name has lowercase first letter while answerType has uppercase
        // e.g. `WebPages` RankingResult type is in the `webPages` top-level collection.
        var type = item.answerType[0].toLowerCase() + item.answerType.slice(1);
        if (type in results && type in searchItemRenderers) {
            var render = searchItemRenderers[type];
            // This ranking item refers to ONE result of the specified type.
            if ("resultIndex" in item) {
                html.push(render(results[type].value[item.resultIndex], section));
            // This ranking item refers to ALL results of the specified type.
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

## Review renderer functions

In our sample app, the `searchItemRenderers` object includes functions that generate HTML for each type of search result.

```javascript
// Render functions for each result type.
searchItemRenderers = {
    webPages: function(item) { ... },
    news: function(item) { ... },
    images: function(item, section, index, count) { ... },
    videos: function(item, section, index, count) { ... },
    relatedSearches: function(item, section, index, count) { ... }
}
```

> [!IMPORTANT]
> The sample app has renderers for web pages, news, images, videos, and related searches. Your application will need renderers for any type of results it may receive, which could include computations, spelling suggestions, entities, time zones, and definitions.

Some of the rendering functions accept only the `item` parameter. Others accept additional parameters, which can be used to render items differently based on context. A renderer that doesn't use this information doesn't need to accept these parameters.

The context arguments are:

| Parameter  | Description |
|------------|-------------|
| `section` | The results section (`pole`, `mainline`, or `sidebar`) in which the item appears. |
| `index`<br>`count` | Available when the `RankingResponse` item specifies that all results in a given collection are to be displayed; `undefined` otherwise. The index of the item within its collection and the total number of items in that collection. You can use this information to number the results, to generate different HTML for the first or last result, and so on. |

In the sample app, both the `images` and `relatedSearches` renderers use the context arguments to customize the generated HTML. Let's take a closer look at the `images` renderer:

```javascript
searchItemRenderers = {
    // Render image result with thumbnail.
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
    },
    // Other renderers are omitted from this sample...
}
```

The image renderer:

* Calculates the image thumbnail size (width varies, while height is fixed at 60 pixels).
* Inserts the HTML that precedes the image result based on context.
* Builds the HTML `<a>` tag that links to the page that contains the image.
* Builds the HTML `<img>` tag to display the image thumbnail.

The image renderer uses the `section` and `index` variables to display results differently depending on where they appear. A line break (`<br>` tag) is inserted between image results in the sidebar, so that the sidebar displays a column of images. In other sections, the first image result `(index === 0)` is preceded by a `<p>` tag.

The thumbnail size is used in both the `<img>` tag and the `h` and `w` fields in the thumbnail's URL. The `title` and `alt` attributes (a textual description of the image) are constructed from the image's name and the hostname in the URL.

Here's an example of how images are displayed in the sample app:

![[Bing image results]](media/cognitive-services-bing-web-api/web-search-spa-images.png)

## Persist the client ID

Responses from the Bing search APIs may include a `X-MSEdge-ClientID` header that should be sent back to the API with each successive request. If more than one of the Bing Search APIs is used by your app, make sure the same client ID is sent with each request across services.

Providing the `X-MSEdge-ClientID` header allows the Bing APIs to associate a user's searches. First, it allows the Bing search engine to apply past context to searches to find results that better satisfy the request. If a user has previously searched for terms related to sailing, for example, a later search for "knots" might preferentially return information about knots used in sailing. Second, Bing may randomly select users to experience new features before they are made widely available. Providing the same client ID with each request ensures that users who have been chosen to see a feature will always see it. Without the client ID, the user might see a feature appear and disappear, seemingly at random, in their search results.

Browser security policies, such as Cross-Origin Resource Sharing (CORS), may prevent the sample app from accessing the `X-MSEdge-ClientID` header. This limitation occurs when the search response has a different origin from the page that requested it. In a production environment, you should address this policy by hosting a server-side script that does the API call on the same domain as the Web page. Since the script has the same origin as the Web page, the `X-MSEdge-ClientID` header is then available to JavaScript.

> [!NOTE]
> In a production Web application, you should perform the request server-side anyway. Otherwise, your Bing Search API subscription key must be included in the web page, where it's available to anyone who views source. You are billed for all usage under your API subscription key, even requests made by unauthorized parties, so it is important not to expose your key.

For development purposes, you can make a request through a CORS proxy. The response from this type of proxy has an `Access-Control-Expose-Headers` header that whitelists response headers and makes them available to JavaScript.

It's easy to install a CORS proxy to allow our sample app to access the client ID header. Run this command:

```console
npm install -g cors-proxy-server
```

Next, change the Bing Web Search endpoint in `script.js` to:

```javascript
http://localhost:9090/https://api.cognitive.microsoft.com/bing/v7.0/search
```

Start the CORS proxy with this command:

```console
cors-proxy-server
```

Leave the command window open while you use the sample app; closing the window stops the proxy. In the expandable HTTP Headers section below the search results, the `X-MSEdge-ClientID` header should be visible. Verify that it's the same for each request.

## Next steps

> [!div class="nextstepaction"]
> [Bing Web Search API v7 reference](//docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v7-reference)
