---
title: "Quickstart: Send search queries using the REST API for the Bing Image Search API using C#"
description: Use this quickstart to make your first call to the Bing Web Search API and receive a JSON response.
services: cognitive-services
documentationcenter: ''
author: aahill
ms.service: cognitive-services
ms.component: bing-image-search
ms.topic: article
ms.date: 8/9/2018
ms.author: aahi
---
# Quickstart: Send search queries using the REST API and C#

Use this quickstart to make your first call to the Bing Image Search API and receive a JSON response. The simple C# application in this article sends a search query and displays the raw results.

While this application is written in C#, the API is a RESTful Web service compatible with any programming language that can make HTTP requests and parse JSON.

The source code for this C# sample is available [on GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/dotnet/Search/BingImageSearchv7.cs).

## Prerequisites

* [Visual Studio 2017](https://www.visualstudio.com/downloads/). (The free Community Edition will work.)

The application uses only .NET Core classes and runs on Windows using the .NET CLR, or on Linux and macOS using [Mono](http://www.mono-project.com/).

[!INCLUDE [cognitive-services-bing-image-search-signup-requirements](../../../../includes/cognitive-services-bing-image-search-signup-requirements.md)]

## Create and initialize a project



1. create a new Console solution named `BingSearchApisQuickStart` in Visual Studio. Then import the following packages into your solution's main code file.

    ```csharp
    using System;
    using System.Text;
    using System.Net;
    using System.IO;
    using System.Collections.Generic;
    ```

2. Define the API endpoint, your subscription key, and search term.

    ```csharp
    // Replace the accessKey string value with your valid access key.
    const string accessKey = "enter key here";
    const string uriBase = "https://api.cognitive.microsoft.com/bing/v7.0/images/search";
    const string searchTerm = "puppies";
    ```

## Create a struct to format the Bing Image Search response

Define a `SearchResult` struct to contain the image search results, and JSON header information.
    
    ```csharp
        namespace BingSearchApisQuickstart
        {
            class Program
            {
    ...
                struct SearchResult
                {
                    public String jsonResult;
                    public Dictionary<String, String> relevantHeaders;
                }
    ...
            }
        }
    ```

## Make and handle a request

Create a method named `BingImageSearch` to perform the call to the API, and return the results as a SearchResult.

    ```csharp
    ...
    namespace BingSearchApisQuickstart
    {
        class Program
        {
            static SearchResult BingImageSearch(string searchQuery)
            {
    ```
    1. In the `BingImageSearch` method, construct the URI for the search request

        ```csharp
        var uriQuery = uriBase + "?q=" + Uri.EscapeDataString(searchQuery);
        ```
    2. Perform the web request and get the response as a JSON string.

        ```csharp
        WebRequest request = HttpWebRequest.Create(uriQuery);
        request.Headers["Ocp-Apim-Subscription-Key"] = accessKey;
        HttpWebResponse response = (HttpWebResponse)request.GetResponseAsync().Result;
        string json = new StreamReader(response.GetResponseStream()).ReadToEnd();
        // Create result object for return
        var searchResult = new SearchResult()
        ```
    3. Create the search result object, and extract the BING HTTP headers. 
        ```csharp
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
        ```

## View the response

Write the resulting JSON to the console,
    ```csharp
    Console.WriteLine(JsonPrettyPrint(result.jsonResult));
    ```


## JSON response

Responses from the Bing Image Search API are returned as JSON. This sample response has been truncated to show a single result.

```json
{
  "_type": "Images",
  "instrumentation": {},
  "readLink": "https://api.cognitive.microsoft.com/api/v7/images/search?q=puppies",
  "webSearchUrl": "https://www.bing.com/images/search?q=puppies&FORM=OIIARP",
  "totalEstimatedMatches": 955,
  "nextOffset": 1,
  "value": [
    {
      "webSearchUrl": "https://www.bing.com/images/search?view=detailv...",
      "name": "So cute - Puppies Wallpaper",
      "thumbnailUrl": "https://tse3.mm.bing.net/th?id=OIP.jHrihoDNkXGS1t...",
      "datePublished": "2014-02-01T21:55:00.0000000Z",
      "contentUrl": "http://images4.contoso.com/image/photos/14700000/So-cute-puppies...",
      "hostPageUrl": "http://www.contoso.com/clubs/puppies/images/14749028/...",
      "contentSize": "394455 B",
      "encodingFormat": "jpeg",
      "hostPageDisplayUrl": "www.contoso.com/clubs/puppies/images/14749...",
      "width": 1600,
      "height": 1200,
      "thumbnail": {
        "width": 300,
        "height": 225
      },
      "imageInsightsToken": "ccid_jHrihoDN*mid_F68CC526226E163FD1EA659747AD...",
      "insightsMetadata": {
        "recipeSourcesCount": 0
      },
      "imageId": "F68CC526226E163FD1EA659747ADCB8F9FA36",
      "accentColor": "8D613E"
    }
  ],
  "queryExpansions": [
    {
      "text": "Shih Tzu Puppies",
      "displayText": "Shih Tzu",
      "webSearchUrl": "https://www.bing.com/images/search?q=Shih+Tzu+Puppies...",
      "searchLink": "https://api.cognitive.microsoft.com/api/v7/images/search?q=Shih...",
      "thumbnail": {
        "thumbnailUrl": "https://tse2.mm.bing.net/th?q=Shih+Tzu+Puppies&pid=Api..."
      }
    }
  ],
  "pivotSuggestions": [
    {
      "pivot": "puppies",
      "suggestions": [
        {
          "text": "Dog",
          "displayText": "Dog",
          "webSearchUrl": "https://www.bing.com/images/search?q=Dog&tq=%7b%22pq%...",
          "searchLink": "https://api.cognitive.microsoft.com/api/v7/images/search?q=Dog...",
          "thumbnail": {
            "thumbnailUrl": "https://tse1.mm.bing.net/th?q=Dog&pid=Api&mkt=en-US..."
          }
        }
      ]
    }
  ],
  "similarTerms": [
    {
      "text": "cute",
      "displayText": "cute",
      "webSearchUrl": "https://www.bing.com/images/search?q=cute&FORM=...",
      "thumbnail": {
        "url": "https://tse2.mm.bing.net/th?q=cute&pid=Api&mkt=en-US..."
      }
    }
  ],
  "relatedSearches": [
    {
      "text": "Cute Puppies",
      "displayText": "Cute Puppies",
      "webSearchUrl": "https://www.bing.com/images/search?q=Cute+Puppies",
      "searchLink": "https://api.cognitive.microsoft.com/api/v7/images/sear...",
      "thumbnail": {
        "thumbnailUrl": "https://tse4.mm.bing.net/th?q=Cute+Puppies&pid=..."
      }
    }
  ]
}
```

## Next steps

> [!div class="nextstepaction"]
> [Bing Image Search single-page app tutorial](../tutorial-bing-image-search-single-page-app.md)

## See also 

[Bing Image Search overview](../overview.md)  
[Try it](https://azure.microsoft.com/services/cognitive-services/bing-image-search-api/)  
[Get a free trial access key](https://azure.microsoft.com/try/cognitive-services/?api=bing-image-search-api)  
[Bing Image Search API reference](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference)
