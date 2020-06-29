---
title: " Build a single-page Web app - Bing Visual Search"
titleSuffix: Azure Cognitive Services
description: Learn how to integrate the Bing Visual Search API into a single-page Web application.
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-visual-search
ms.topic: tutorial
ms.date: 03/27/2020
ms.author: aahi
---
# Tutorial: Create a Visual Search single-page web app

The Bing Visual Search API returns insights for an image. You can either upload an image or provide a URL to one. Insights are visually similar images, shopping sources, webpages that include the image, and more. Insights returned by the Bing Visual Search API are similar to ones shown on Bing.com/images.

This tutorial explains how to extend a single-page web app for the Bing Image Search API. To view that tutorial or get the source code used here, see [Tutorial: Create a single-page app for the Bing Image Search API](../Bing-Image-Search/tutorial-bing-image-search-single-page-app.md).

The full source code for this application (after extending it to use the Bing Visual Search API), is available on [GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/Tutorials/Bing-Visual-Search/BingVisualSearchApp.html).

## Prerequisites

[!INCLUDE [cognitive-services-bing-visual-search-signup-requirements](../../../includes/cognitive-services-bing-visual-search-signup-requirements.md)]

## Call the Bing Visual Search API and handle the response

Edit the Bing Image Search tutorial and add the following code to the end of the `<script>` element (and before the closing `</script>` tag). The following code handles a visual search response from the API, iterates through the results, and displays them:

``` javascript
function handleVisualSearchResponse(){
    if(this.status !== 200){
        console.log(this.responseText);
        return;
    }
    let json = this.responseText;
    let response = JSON.parse(json);
    for (let i =0; i < response.tags.length; i++) {
        let tag = response.tags[i];
        if (tag.displayName === '') {
            for (let j = 0; j < tag.actions.length; j++) {
                let action = tag.actions[j];
                if (action.actionType === 'VisualSearch') {
                    let html = '';
                    for (let k = 0; k < action.data.value.length; k++) {
                        let item = action.data.value[k];
                        let height = 120;
                        let width = Math.max(Math.round(height * item.thumbnail.width / item.thumbnail.height), 120);
                        html += "<img src='"+ item.thumbnailUrl + "&h=" + height + "&w=" + width + "' height=" + height + " width=" + width + "'>";
                    }
                    showDiv("insights", html);
                    window.scrollTo({top: document.getElementById("insights").getBoundingClientRect().top, behavior: "smooth"});
                }
            }
        }
    }
}
```

The following code sends a search request to the API, using an event listener to call `handleVisualSearchResponse()`:

```javascript
function bingVisualSearch(insightsToken){
    let visualSearchBaseURL = 'https://api.cognitive.microsoft.com/bing/v7.0/images/visualsearch',
        boundary = 'boundary_ABC123DEF456',
        startBoundary = '--' + boundary,
        endBoundary = '--' + boundary + '--',
        newLine = "\r\n",
        bodyHeader = 'Content-Disposition: form-data; name="knowledgeRequest"' + newLine + newLine;

    let postBody = {
        imageInfo: {
            imageInsightsToken: insightsToken
        }
    }
    let requestBody = startBoundary + newLine;
    requestBody += bodyHeader;
    requestBody += JSON.stringify(postBody) + newLine + newLine;
    requestBody += endBoundary + newLine;

    let request = new XMLHttpRequest();

    try {
        request.open("POST", visualSearchBaseURL);
    } 
    catch (e) {
        renderErrorMessage("Error performing visual search: " + e.message);
    }
    request.setRequestHeader("Ocp-Apim-Subscription-Key", getSubscriptionKey());
    request.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
    request.addEventListener("load", handleVisualSearchResponse);
    request.send(requestBody);
}
```

## Capture insights token

Add the following code to the `searchItemsRenderer` object. This code adds a **find similar** link that calls the `bingVisualSearch` function when clicked. The function receives the `imageInsightsToken` as an argument.

``` javascript
html.push("<a href='javascript:bingVisualSearch(\"" + item.imageInsightsToken + "\");'>find similar</a><br>");
```

## Display similar images

Add the following HTML code at line 601. This markup code adds an element to display the results of the Bing Visual Search API call:

``` html
<div id="insights">
    <h3><a href="#" onclick="return toggleDisplay('_insights')">Similar</a></h3>
    <div id="_insights" style="display: none"></div>
</div>
```

With all the new JavaScript code and HTML elements in place, search results are displayed with a **find similar** link. Click the link to populate the **Similar** section with images similar to the one you picked. You may have to expand the **Similar** section to show the images.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Crop an image with the Bing Visual Search SDK for C#](tutorial-visual-search-crop-area-results.md)
