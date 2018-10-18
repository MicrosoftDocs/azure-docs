---
title: "Tutorial: Build a single-page Web app - Bing Visual Search"
titleSuffix: Azure Cognitive Services
description: Shows how to use the Bing Visual Search API in a single-page Web application.
services: cognitive-services
author: brapel
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-visual-search
ms.topic: tutorial
ms.date: 10/04/2017
ms.author: v-brapel
---
# Tutorial: Visual Search Single-page Web app

Bing Visual Search API provides an experience similar to the image details shown on Bing.com/images. With Visual Search, you can specify an image and get back insights about the image such as visually similar images, shopping sources, webpages that include the image, and more. 

This tutorial extends the single page web app from the Bing Image Search tutorial (see [Single-page Web app](../Bing-Image-Search/tutorial-bing-image-search-single-page-app.md)). For full source code to start this tutorial, see [Single-page Web app (source code)](../Bing-Image-Search/tutorial-bing-image-search-single-page-app-source.md). For the final source code of this tutorial, see [Visual Search Single-page Web app](tutorial-bing-visual-search-single-page-app-source.md).

The tasks covered are:

> [!div class="checklist"]
> * Call Bing Visual Search API with an image insights token
> * Display similar images

## Call Bing Visual Search
Edit the Bing Image Search tutorial and add the following code to the end of the script element at line 409. This code calls the Bing Visual Search API and displays the results.

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
Add the following code into the `searchItemsRenderer` object at line 151. This code adds a **find similar** link that calls the `bingVisualSearch` function when clicked. The function receives the imageInsightsToken as an argument.

``` javascript
html.push("<a href='javascript:bingVisualSearch(\"" + item.imageInsightsToken + "\");'>find similar</a><br>");
```

## Display similar images
Add the following HTML code at line 601. This markup code adds an element used to display the results of the Bing Visual Search API call.

``` html
<div id="insights">
    <h3><a href="#" onclick="return toggleDisplay('_insights')">Similar</a></h3>
    <div id="_insights" style="display: none"></div>
</div>
```

With all the new JavaScript code and HTML elements in place, search results are displayed with a **find similar** link. Click the link to populate the **Similar** section with images similar to the one you picked. You may have to expand the **Similar** section to show the images.

## Next steps

> [!div class="nextstepaction"]
> [Visual Search Single-page Web app source](tutorial-bing-visual-search-single-page-app-source.md)
> [Bing Visual Search API reference](https://aka.ms/bingvisualsearchreferencedoc)