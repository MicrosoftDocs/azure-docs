---
title: "Tutorial: Extract image details using the Bing Image Search API and C#"
titleSuffix: Azure Cognitive Services
description: Use this article to create a C# application that extracts image details using the Bing Image Search API.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-image-search
ms.topic: tutorial
ms.date: 05/15/2019
ms.author: aahi
---

# Tutorial: Extract image details using the Bing Image Search API and C#

There are multiple [endpoints](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/image-search-endpoint) available through the Bing Image Search API. The `/details` endpoint accepts a POST request with an image, and can return a variety of details about the image. This C# application sends an image using this API, and displays the details returned by Bing, which are JSON objects, such as the following:

![[JSON results]](media/cognitive-services-bing-images-api/jsonResult.jpg)

This tutorial explains how to:

> [!div class="checklist"]
> * Use the Image Search `/details` endpoint in a `POST` request
> * Specify headers for the request
> * Use URL parameters to specify results
> * Upload the image data and send the `POST` request
> * Print the JSON results to the console

The source code for this sample is available on [GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/Tutorials/BingGetSimilarImages.cs).

## Prerequisites

* Any edition of [Visual studio 2017 or later](https://visualstudio.microsoft.com/downloads/).

[!INCLUDE [cognitive-services-bing-image-search-signup-requirements](../../../includes/cognitive-services-bing-image-search-signup-requirements.md)]

## Construct an image details search request

The following is the `/details` endpoint, which accepts POST requests with image data in the body of the request.
```
https://api.cognitive.microsoft.com/bing/v7.0/images/details
```

When constructing the search request URL, the `modules` parameter follows the above endpoint, and specifies the types of details the results will contain:

* `modules=All`
* `modules=RecognizedEntities` (people or places visible in the image)

Specify `modules=All` in the POST request to get JSON text that includes the following:

* `bestRepresentativeQuery` - a Bing query that returns images similar to the uploaded image
* `detectedObjects` - objects found in the image
* `image` - metadata for the image
* `imageInsightsToken` - a token for a later GET requests that get `RecognizedEntities` (people or places visible in the image) from the image.
* `imageTags` - tags for the image
* `pagesIncluding` - Web pages that include the image
* `relatedSearches` - searches based on details in the image.
* `visuallySimilarImages` - similar images on the web.

Specify `modules=RecognizedEntities` in the POST request to only get `imageInsightsToken`, which can be used in a subsequent GET request to identify people or places in the image.

## Create a WebClient object, and set headers for the API request

Create a `WebClient` object, and set the headers. All requests to the Bing Search API require an `Ocp-Apim-Subscription-Key`. A `POST` request to upload an image must also specify `ContentType: multipart/form-data`.

```javascript
WebClient client = new WebClient();
client.Headers["Ocp-Apim-Subscription-Key"] = accessKey;
client.Headers["ContentType"] = "multipart/form-data";
```

## Upload the image, and display the results

The `WebClient` class's `UpLoadFile()` method formats data for the `POST` request, including formatting `RequestStream` and calling `HttpWebRequest`.

Call `WebClient.UpLoadFile()` with the `/details` endpoint and the image file to upload. Use the JSON response to initialize an instance of the `SearchResult` structure, and store the response.

```javascript        
const string uriBase = "https://api.cognitive.microsoft.com/bing/v7.0/images/details";
// The image to upload. Replace with your file and path.
const string imageFile = "your-image.jpg";
byte[] resp = client.UploadFile(uriBase + "?modules=All", imageFile);
var json = System.Text.Encoding.Default.GetString(resp);
// Create result object for return
var searchResult = new SearchResult()
{
    jsonResult = json,
    relevantHeaders = new Dictionary<String, String>()
};
```
This JSON response can then be printed to the console.

## Use an image insights token in a request

To use the `ImageInsightsToken` returned with results of a `POST`, you can add it to a `GET` request. For example:

```
https://api.cognitive.microsoft.com/bing/v7.0/images/details?InsightsToken="bcid_A2C4BB81AA2C9EF8E049C5933C546449*ccid_osS7gaos*mid_BF7CC4FC4A882A3C3D56E644685BFF7B8BACEAF2
```

If there are identifiable people or places in the image, this request will return information about them.

## Next steps

> [!div class="nextstepaction"]
> [Display images and search options in a single-page Web app
](tutorial-bing-image-search-single-page-app.md)

## See also

* [Bing Image Search API reference](//docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference)
