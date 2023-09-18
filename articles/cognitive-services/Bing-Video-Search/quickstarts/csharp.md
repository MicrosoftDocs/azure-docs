---
title: "Quickstart: Search for videos using the REST API and C# - Bing Video Search"
titleSuffix: Azure AI services
description: "Use this quickstart to send video search requests to the Bing Video Search REST API using C#."
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-video-search
ms.topic: quickstart
ms.date: 10/22/2020
ms.author: clschott
ms.devlang: csharp
ms.custom: devx-track-csharp, mode-api
---

# Quickstart: Search for videos using the Bing Video Search REST API and C#

[!INCLUDE [Bing move notice](../../bing-web-search/includes/bing-move-notice.md)]

Use this quickstart to make your first call to the Bing Video Search API. This simple C# application sends an HTTP video search query to the API and displays the JSON response. Although this application is written in C#, the API is a RESTful Web service compatible with most programming languages.

The source code for this sample is available [on GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/dotnet/Search/BingVideoSearchv7.cs) with additional error handling, features, and code annotations.

## Prerequisites

You’ll need to set up your machine to run .NET core. You can find the installation instructions on the [.NET Core Downloads](https://dotnet.microsoft.com/download)
page. You can run this application on Windows, Linux, macOS, or in a Docker container. You’ll need to install your favorite code editor. The descriptions below
use [Visual Studio Code](https://code.visualstudio.com/), which is an open source, cross platform editor. However, you can use whatever tools you are
comfortable with.

[!INCLUDE [cognitive-services-bing-video-search-signup-requirements](../../../../includes/cognitive-services-bing-video-search-signup-requirements.md)]

## Create and initialize a project

The first step is to create a new application. Open a command prompt and create a new directory for your application. Make that the current directory. Enter the following command in a console window:

```dotnetcli
dotnet new console --name VideoSearchClient
```

You'll need to add the following `using` directive at the top of your Main method so that the C# compiler recognizes the Task and JSON types:

```csharp
using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;
```

Add variables for your subscription key, endpoint, and search term. For the `uriBase` value, you can use the global endpoint in the following code or use the [custom subdomain](../../../ai-services/cognitive-services-custom-subdomains.md) endpoint displayed in the Azure portal for your resource.

```csharp
// Replace the accessKey string value with your valid access key.
const string _accessKey = "enter your key here";

// Or use the custom subdomain endpoint displayed in the Azure portal for your resource.
const string _uriBase = "https://api.cognitive.microsoft.com/bing/v7.0/videos/search";

const string _searchTerm = "kittens";
```

Next, update the Main method so we can use Async methods. Add the async modifier, and change the return type to Task.

```csharp
static async Task Main(string[] args)
{
    
}
```

Now, you have a program that does nothing but does it asynchronously. Let's improve it.

## Create a data structure to hold the Bing Video Search API response

Define a `SearchResult` and `Video` class to contain the video search results. You can add more properties later when you need other fields from the JSON result.

```cscharp
class SearchResult
{
    [JsonPropertyName("totalEstimatedMatches")]
    public int TotalEstimatedMatches { get; set; }

    [JsonPropertyName("value")]
    public List<Video> Videos { get; set; }
}

class Video
{
    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; }

    [JsonPropertyName("thumbnailUrl")]
    public string ThumbnailUrl { get; set; }

    [JsonPropertyName("contentUrl")]
    public string ContentUrl { get; set; }
}
```

## Create and handle a video search request

We use `HttpClient` to perform the call to the API. First, we need to add the header `Ocp-Apim-Subscription-Key` and your access key. 

```csharp
using var client = new HttpClient();
client.BaseAddress = new Uri(_uriBase);
client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", _accessKey);
```

Construct the URI for the search request. Format the search term `_searchTerm` before you append it to the string.

```csharp
var response = await client.GetAsync($"?q={Uri.EscapeDataString(_searchTerm)}");
```

## Process the result

When the response was successful, we can process the JSON data. We deserialize the JSON string into our `SearchResult` we had created earlier. Loop to the result (if any) and print the result to the console.

```csharp
if (response.IsSuccessStatusCode)
{
    var json = await response.Content.ReadAsStringAsync();
    var result = JsonSerializer.Deserialize<SearchResult>(json);

    foreach (var video in result.Videos)
    {
        Console.WriteLine($"Name: {video.Name}");
        Console.WriteLine($"ContentUrl: {video.ContentUrl}");
        Console.WriteLine();
    }
}
```

## Example JSON response 

A successful response is returned in JSON, as shown in the following example:

```json
{
    "_type": "Videos",
    "instrumentation": {},
    "readLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=kittens",
    "webSearchUrl": "https://www.bing.com/videos/search?q=kittens",
    "totalEstimatedMatches": 1000,
    "value": [
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=...",
            "name": "Top 10 cute kitten videos compilation",
            "description": "HELP HOMELESS ANIMALS AND WIN A PRIZE BY CHOOSING...",
            "thumbnailUrl": "https://tse4.mm.bing.net/th?id=OVP.n1aE_Oikl4MtzBb...",
            "datePublished": "2014-11-12T22:47:36.0000000",
            "publisher": [
                {
                    "name": "Fabrikam"
                }
            ],
            "creator": {
                "name": "Marcus Appel"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.fabrikam.com/watch?v=8HVWitAW-Qg",
            "hostPageUrl": "https://www.fabrikam.com/watch?v=8HVWitAW-Qg",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.fabrikam.com/watch?v=8HVWitAW-Qg",
            "width": 480,
            "height": 360,
            "duration": "PT3M52S",
            "motionThumbnailUrl": "https://tse4.mm.bing.net/th?id=OM.j4QyJAENJphdZQ_1501386166&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.fabrikam.com/embed/8HVWitAW-Qg?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 7513633,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "655D98260D012432848F6558260D012432848F",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        . . .
    ],
    "nextOffset": 36,
    "queryExpansions": [
        {
            "text": "Kittens Meowing",
            "displayText": "Meowing",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Kittens+Meowing...",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search...",
            "thumbnail": {
                "thumbnailUrl": "https://tse3.mm.bing.net/th?q=Kittens+Meowing&pid..."
            }
        },
        {
            "text": "Funny Kittens",
            "displayText": "Funny",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Funny+Kittens...",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search...",
            "thumbnail": {
                "thumbnailUrl": "https://tse3.mm.bing.net/th?q=Funny+Kittens&..."
            }
        },
        . . .
    ],
    "pivotSuggestions": [
        {
            "pivot": "kittens",
            "suggestions": [
                {
                    "text": "Cat",
                    "displayText": "Cat",
                    "webSearchUrl": "https://www.bing.com/videos/search?q=Cat...",
                    "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?...",
                    "thumbnail": {
                        "thumbnailUrl": "https://tse3.mm.bing.net/th?q=Cat&pid=Api..."
                    }
                },
                {
                    "text": "Feral Cat",
                    "displayText": "Feral Cat",
                    "webSearchUrl": "https://www.bing.com/videos/search?q=Feral+Cat...",
                    "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search...",
                    "thumbnail": {
                        "thumbnailUrl": "https://tse3.mm.bing.net/th?q=Feral+Cat&pid=Api&..."
                    }
                }
            ]
        }
    ],
    "relatedSearches": [
        {
            "text": "Kittens Being Born",
            "displayText": "Kittens Being Born",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Kittens+Being+Born...",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?...",
            "thumbnail": {
                "thumbnailUrl": "https://tse1.mm.bing.net/th?q=Kittens+Being+Born&pid=..."
            }
        },
        . . .
    ]
}
```

## Next steps

> [!div class="nextstepaction"]
> [Build a single-page web app](../tutorial-bing-video-search-single-page-app.md)

## See also 

 [What is the Bing Video Search API?](../overview.md)
