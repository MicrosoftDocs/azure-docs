---
title: "Quickstart: Send a search request to the REST API using C# - Bing Entity Search"
titleSuffix: Azure Cognitive Services
description: Use this quickstart to send a request to the Bing Entity Search REST API using C#, and receive a JSON response.
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-entity-search
ms.topic: quickstart
ms.date: 05/08/2020
ms.author: aahi
---

# Quickstart: Send a search request to the Bing Entity Search REST API using C#

Use this quickstart to make your first call to the Bing Entity Search API and view the JSON response. This simple C# application sends a news search query to the API, and displays the response. The source code for this application is available on [GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/dotnet/Search/BingEntitySearchv7.cs).

Although this application is written in C#, the API is a RESTful Web service compatible with most programming languages.


## Prerequisites

- Any edition of [Visual Studio 2017 or later](https://www.visualstudio.com/downloads/).

- The [Json.NET](https://www.newtonsoft.com/json) framework, available as a NuGet package. To install the NuGet package in Visual Studio:

   1. Right-click your project in **Solution Explorer**.
   2. Select **Manage NuGet Packages**.
   3. Search for and select *Newtonsoft.Json*, and then install the package.

- If you're using Linux/MacOS, this application can be run by using [Mono](https://www.mono-project.com/).


[!INCLUDE [cognitive-services-bing-news-search-signup-requirements](../../../../includes/cognitive-services-bing-entity-search-signup-requirements.md)]

## Create and initialize a project

1. Create a new C# console solution in Visual Studio. Then, add the following namespaces into the main code file:
    
    ```csharp
    using Newtonsoft.Json;
    using System;
    using System.Net.Http;
    using System.Text;
    ```

2. Create a new class, and add variables for the API endpoint, your subscription key, and the query you want to search. You can use the global endpoint in the following code, or use the [custom subdomain](../../../cognitive-services/cognitive-services-custom-subdomains.md) endpoint displayed in the Azure portal for your resource.

    ```csharp
    namespace EntitySearchSample
    {
        class Program
        {
            static string host = "https://api.cognitive.microsoft.com";
            static string path = "/bing/v7.0/entities";
    
            static string market = "en-US";
    
            // NOTE: Replace this example key with a valid subscription key.
            static string key = "ENTER YOUR KEY HERE";
    
            static string query = "italian restaurant near me";
        //...
        }
    }
    ```

## Send a request and get the API response

1. Within the class, create a function called `Search()`. Within this function, create a new `HttpClient` object, and add your subscription key to the `Ocp-Apim-Subscription-Key` header.

2. Construct the URI for your request by combining the host and path. Then, add your market and URL-encode your query.

3. Await `client.GetAsync()` to get an HTTP response, and then store the JSON response by awaiting `ReadAsStringAsync()`.

4. Format the JSON string with `JsonConvert.DeserializeObject()` and print it to the console.

      ```csharp
      async static void Search()
      {
       //...
       HttpClient client = new HttpClient();
       client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", key);

       string uri = host + path + "?mkt=" + market + "&q=" + System.Net.WebUtility.UrlEncode(query);

       HttpResponseMessage response = await client.GetAsync(uri);

       string contentString = await response.Content.ReadAsStringAsync();
       dynamic parsedJson = JsonConvert.DeserializeObject(contentString);
       Console.WriteLine(parsedJson);
      }
      ```

5. In the `Main()` method of your application, call the `Search()` function.
    
    ```csharp
    static void Main(string[] args)
    {
        Search();
        Console.ReadLine();
    }
    ```


## Example JSON response

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "_type": "SearchResponse",
  "queryContext": {
    "originalQuery": "italian restaurant near me",
    "askUserForLocation": true
  },
  "places": {
    "value": [
      {
        "_type": "LocalBusiness",
        "webSearchUrl": "https://www.bing.com/search?q=sinful+bakery&filters=local...",
        "name": "Liberty's Delightful Sinful Bakery & Cafe",
        "url": "https://www.contoso.com/",
        "entityPresentationInfo": {
          "entityScenario": "ListItem",
          "entityTypeHints": [
            "Place",
            "LocalBusiness"
          ]
        },
        "address": {
          "addressLocality": "Seattle",
          "addressRegion": "WA",
          "postalCode": "98112",
          "addressCountry": "US",
          "neighborhood": "Madison Park"
        },
        "telephone": "(800) 555-1212"
      },

      . . .
      {
        "_type": "Restaurant",
        "webSearchUrl": "https://www.bing.com/search?q=Pickles+and+Preserves...",
        "name": "Munson's Pickles and Preserves Farm",
        "url": "https://www.princi.com/",
        "entityPresentationInfo": {
          "entityScenario": "ListItem",
          "entityTypeHints": [
            "Place",
            "LocalBusiness",
            "Restaurant"
          ]
        },
        "address": {
          "addressLocality": "Seattle",
          "addressRegion": "WA",
          "postalCode": "98101",
          "addressCountry": "US",
          "neighborhood": "Capitol Hill"
        },
        "telephone": "(800) 555-1212"
      },
      
      . . .
    ]
  }
}
```

## Next steps

> [!div class="nextstepaction"]
> [Build a single-page web app](../tutorial-bing-entities-search-single-page-app.md)

* [What is the Bing Entity Search API?](../overview.md )
* [Bing Entity Search API reference](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-entities-api-v7-reference).
