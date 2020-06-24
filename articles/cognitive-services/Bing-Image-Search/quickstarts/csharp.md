---
title: "Quickstart: Search for images using the Bing Image Search REST API and C#"
titleSuffix: Azure Cognitive Services
description: Use this quickstart to send image search requests to the Bing Image Search REST API using C#, and receive JSON responses.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-image-search
ms.topic: quickstart
ms.date: 05/08/2020
ms.author: aahi
---
# Quickstart: Search for images using the Bing Image Search REST API and C#

Use this quickstart to learn how to send search requests to the Bing Image Search API. This C# application sends a search query to the API, and displays the URL of the first image in the results. Although this application is written in C#, the API is a RESTful web service compatible with most programming languages.

The source code for this sample is available [on GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/dotnet/Search/BingImageSearchv7Quickstart.cs) with additional error handling and annotations.

## Prerequisites
* Any edition of [Visual Studio 2017 or later](https://www.visualstudio.com/downloads/).
* The [Json.NET](https://www.newtonsoft.com/json) framework, available as a NuGet package.
* If you're using Linux/MacOS, this application can be run using [Mono](https://www.mono-project.com/).

[!INCLUDE [cognitive-services-bing-image-search-signup-requirements](../../../../includes/cognitive-services-bing-image-search-signup-requirements.md)]

## Create and initialize a project

1. Create a new console solution named `BingSearchApisQuickStart` in Visual Studio. Then, add the following namespaces to the main code file:

    ```csharp
    using System;
    using System.Net;
    using System.IO;
    using System.Collections.Generic;
    using Newtonsoft.Json.Linq;
    ```

2. Create variables for the API endpoint, your subscription key, and search term. For `uriBase`, you can use the global endpoint in the following code, or use the [custom subdomain](../../../cognitive-services/cognitive-services-custom-subdomains.md) endpoint displayed in the Azure portal for your resource.

    ```csharp
    //...
    namespace BingSearchApisQuickstart
    {
        class Program
        {
        // Replace the this string with your valid access key.
        const string subscriptionKey = "enter your key here";
        const string uriBase = "https://api.cognitive.microsoft.com/bing/v7.0/images/search";
        const string searchTerm = "tropical ocean";
    //...
    ```

## Create a struct to format the Bing Image Search response

Define a `SearchResult` struct to contain the image search results and JSON header information.

```csharp
    namespace BingSearchApisQuickstart
    {
        class Program
        {
        //...
            struct SearchResult
            {
                public String jsonResult;
                public Dictionary<String, String> relevantHeaders;
            }
//...
```

## Create a method to send search requests

Create a method named `BingImageSearch` to perform the call to the API, and set the return type to the `SearchResult` struct created previously.

```csharp
//...
namespace BingSearchApisQuickstart
{
    //...
    class Program
    {
        //...
        static SearchResult BingImageSearch(string searchTerm)
        {
        }
//...
```

## Create and handle an image search request

In the `BingImageSearch` method, perform the following steps:

1. Construct the URI for the search request. Format the `SearchTerm` search term before you append it to the string.

    ```csharp
    static SearchResult BingImageSearch(string SearchTerm){

        var uriQuery = uriBase + "?q=" + Uri.EscapeDataString(SearchTerm);
    //...
    ```

2. Send the web request and get the response as a JSON string.

    ```csharp
    WebRequest request = WebRequest.Create(uriQuery);
    request.Headers["Ocp-Apim-Subscription-Key"] = subscriptionKey;
    HttpWebResponse response = (HttpWebResponse)request.GetResponseAsync().Result;
    string json = new StreamReader(response.GetResponseStream()).ReadToEnd();
    ```

3. Create the search result object and extract the Bing HTTP headers. Then, return `searchResult`.

    ```csharp
    // Create the result object for return
    var searchResult = new SearchResult()
    {
        jsonResult = json,
        relevantHeaders = new Dictionary<String, String>()
    };

    // Extract Bing HTTP headers
    foreach (String header in response.Headers)
    {
        if (header.StartsWith("BingAPIs-") || header.StartsWith("X-MSEdge-"))
            searchResult.relevantHeaders[header] = response.Headers[header];
    }
    return searchResult;
    ```

## Process and view the response

1. In the main method, call `BingImageSearch()` and store the returned response. Then, deserialize the JSON into an object.

    ```csharp
    SearchResult result = BingImageSearch(searchTerm);
    //deserialize the JSON response from the Bing Image Search API
    dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject(result.jsonResult);
    ```

2. Get the first returned image from `jsonObj`, and print out the title and a URL to the image.
    ```csharp
    var firstJsonObj = jsonObj["value"][0];
    Console.WriteLine("Title for the first image result: " + firstJsonObj["name"]+"\n");
    //After running the application, copy the output URL into a browser to see the image.
    Console.WriteLine("URL for the first image result: " + firstJsonObj["webSearchUrl"]+"\n");
    ```  


## Example JSON response

Responses from the Bing Image Search API are returned as JSON. This sample response has been truncated to show a single result.

```json
{
"_type":"Images",
"instrumentation":{
    "_type":"ResponseInstrumentation"
},
"readLink":"images\/search?q=tropical ocean",
"webSearchUrl":"https:\/\/www.bing.com\/images\/search?q=tropical ocean&FORM=OIIARP",
"totalEstimatedMatches":842,
"nextOffset":47,
"value":[
    {
        "webSearchUrl":"https:\/\/www.bing.com\/images\/search?view=detailv2&FORM=OIIRPO&q=tropical+ocean&id=8607ACDACB243BDEA7E1EF78127DA931E680E3A5&simid=608027248313960152",
        "name":"My Life in the Ocean | The greatest WordPress.com site in ...",
        "thumbnailUrl":"https:\/\/tse3.mm.bing.net\/th?id=OIP.fmwSKKmKpmZtJiBDps1kLAHaEo&pid=Api",
        "datePublished":"2017-11-03T08:51:00.0000000Z",
        "contentUrl":"https:\/\/mylifeintheocean.files.wordpress.com\/2012\/11\/tropical-ocean-wallpaper-1920x12003.jpg",
        "hostPageUrl":"https:\/\/mylifeintheocean.wordpress.com\/",
        "contentSize":"897388 B",
        "encodingFormat":"jpeg",
        "hostPageDisplayUrl":"https:\/\/mylifeintheocean.wordpress.com",
        "width":1920,
        "height":1200,
        "thumbnail":{
        "width":474,
        "height":296
        },
        "imageInsightsToken":"ccid_fmwSKKmK*mid_8607ACDACB243BDEA7E1EF78127DA931E680E3A5*simid_608027248313960152*thid_OIP.fmwSKKmKpmZtJiBDps1kLAHaEo",
        "insightsMetadata":{
        "recipeSourcesCount":0,
        "bestRepresentativeQuery":{
            "text":"Tropical Beaches Desktop Wallpaper",
            "displayText":"Tropical Beaches Desktop Wallpaper",
            "webSearchUrl":"https:\/\/www.bing.com\/images\/search?q=Tropical+Beaches+Desktop+Wallpaper&id=8607ACDACB243BDEA7E1EF78127DA931E680E3A5&FORM=IDBQDM"
        },
        "pagesIncludingCount":115,
        "availableSizesCount":44
        },
        "imageId":"8607ACDACB243BDEA7E1EF78127DA931E680E3A5",
        "accentColor":"0050B2"
    }]
}
```

## Next steps

> [!div class="nextstepaction"]
> [Bing Image Search single-page app tutorial](../tutorial-bing-image-search-single-page-app.md)

## See also

* [What is the Bing Image Search API?](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/overview)  
* [Try an online interactive demo](https://azure.microsoft.com/services/cognitive-services/bing-image-search-api/).
* [Pricing details for the Bing Search APIs](https://azure.microsoft.com/pricing/details/cognitive-services/search-api/). 
* [Get a free Cognitive Services access key](https://azure.microsoft.com/try/cognitive-services/?api=bing-image-search-api).
* [Azure Cognitive Services documentation](https://docs.microsoft.com/azure/cognitive-services).
* [Bing Image Search API reference](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference).
