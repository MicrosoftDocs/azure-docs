---
title: "Quickstart: Perform a web search with C# - Bing Web Search REST API"
titleSuffix: Azure AI services
description: "Use this quickstart to send requests to the Bing Web Search REST API using C#, and receive a JSON response."
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-web-search
ms.topic: quickstart
ms.date: 10/19/2020
ms.author: aahi
ms.custom: seodec2018, devx-track-csharp, mode-api
#Customer intent: "As a new developer, I want to make my first call to the Bing Web Search API and receive a response using C#."
---

# Quickstart: Search the web using the Bing Web Search REST API and C#

[!INCLUDE [Bing move notice](../../bing-web-search/includes/bing-move-notice.md)]

Use this quickstart to make your first call to the Bing Web Search API. This C# application sends a search request to the API, and shows the JSON response. Although this application is written in C#, the API is a RESTful Web service compatible with most programming languages.

This example program in this quickstart uses only .NET Core classes.

## Prerequisites

Here are a few things that you'll need before running this quickstart:

* Windows: [Visual Studio 2017 or later](https://www.visualstudio.com/downloads/)
* Linux/macOS: [Visual Studio Code](https://code.visualstudio.com/) and [.NET Core](https://dotnet.microsoft.com/download)
* [A free Azure subscription](https://azure.microsoft.com/free/dotnet)

[!INCLUDE [bing-web-search-quickstart-signup](../../../../includes/bing-web-search-quickstart-signup.md)]

## Create a project and declare dependencies

Create a console project in Visual Studio or VS Code. Use the following code to import the required namespaces and types:

```csharp
using System;
using System.Text;
using System.Net;
using System.IO;
using System.Collections.Generic;
```

## Declare a namespace and class for your program

In this quickstart, we'll put most of the code in the `Program` class. Start by creating the `BingSearchApiQuickstart` namespace and `Program` class in your project.  

```csharp
namespace BingSearchApisQuickstart
{
    class Program
    {
        // The code in the following sections goes here.
    }
}
```

## Define variables

A few variables must be set before we can continue. Add this code to the `Program` class you created in the previous section: 

1. For the `uriBase` value, you can use the global endpoint in the following code, or use the [custom subdomain](../../../ai-services/cognitive-services-custom-subdomains.md) endpoint displayed in the Azure portal for your resource. 

2. Confirm that `uriBase` is valid and replace the `accessKey` value with a subscription key from your Azure account. 

3. Optionally, customize the search query by replacing the value for `searchTerm`. 

```csharp
// Enter a valid subscription key.
const string accessKey = "enter key here";
/*
 * If you encounter unexpected authorization errors, double-check this value
 * against the endpoint for your Bing Web search instance in your Azure
 * dashboard.
 */
const string uriBase = "https://api.cognitive.microsoft.com/bing/v7.0/search";
const string searchTerm = "Microsoft Cognitive Services";
```

## Declare the Main method

The `Main()` method is required and is the first method invoked when you start the program. In this application, the main method  validates the `accessKey`, makes a request, and prints the response.

The `main()` method is dependent on methods that you create in the next sections.

```csharp
static void Main()
{
    Console.OutputEncoding = System.Text.Encoding.UTF8;
    if (accessKey.Length == 32)
    {
        Console.WriteLine("Searching the Web for: " + searchTerm);
        SearchResult result = BingWebSearch(searchTerm);
        Console.WriteLine("\nRelevant HTTP Headers:\n");
        foreach (var header in result.relevantHeaders)
            Console.WriteLine(header.Key + ": " + header.Value);

        Console.WriteLine("\nJSON Response:\n");
        Console.WriteLine(JsonPrettyPrint(result.jsonResult));
    }
    else
    {
        Console.WriteLine("Invalid Bing Search API subscription key!");
        Console.WriteLine("Please paste yours into the source code.");
    }
    Console.Write("\nPress Enter to exit ");
    Console.ReadLine();
}
```

## Create a struct for search results

Create a struct that returns search results with relevant headers. You call it when you make a request to the Bing Web Search API to create a result object.

```csharp
// Returns search results with headers.
struct SearchResult
{
    public String jsonResult;
    public Dictionary<String, String> relevantHeaders;
}
```

## Construct a request

Use this code to construct the search query, perform the GET request, and handle the response.

```csharp
/// <summary>
/// Makes a request to the Bing Web Search API and returns data as a SearchResult.
/// </summary>
static SearchResult BingWebSearch(string searchQuery)
{
    // Construct the search request URI.
    var uriQuery = uriBase + "?q=" + Uri.EscapeDataString(searchQuery);

    // Perform request and get a response.
    WebRequest request = HttpWebRequest.Create(uriQuery);
    request.Headers["Ocp-Apim-Subscription-Key"] = accessKey;
    HttpWebResponse response = (HttpWebResponse)request.GetResponseAsync().Result;
    string json = new StreamReader(response.GetResponseStream()).ReadToEnd();

    // Create a result object.
    var searchResult = new SearchResult()
    {
        jsonResult = json,
        relevantHeaders = new Dictionary<String, String>()
    };

    // Extract Bing HTTP headers.
    foreach (String header in response.Headers)
    {
        if (header.StartsWith("BingAPIs-") || header.StartsWith("X-MSEdge-"))
            searchResult.relevantHeaders[header] = response.Headers[header];
    }
    return searchResult;
}
```

## Format the response

This method formats the JSON response, primarily by indenting and adding line breaks.

```csharp
/// <summary>
/// Formats the JSON string by adding line breaks and indents.
/// </summary>
/// <param name="json">The raw JSON string.</param>
/// <returns>The formatted JSON string.</returns>
static string JsonPrettyPrint(string json)
{
    if (string.IsNullOrEmpty(json))
        return string.Empty;

    json = json.Replace(Environment.NewLine, "").Replace("\t", "");

    StringBuilder sb = new StringBuilder();
    bool quote = false;
    bool ignore = false;
    char last = ' ';
    int offset = 0;
    int indentLength = 2;

    foreach (char ch in json)
    {
        switch (ch)
        {
            case '"':
                if (!ignore) quote = !quote;
                break;
            case '\\':
                if (quote && last != '\\') ignore = true;
                break;
        }

        if (quote)
        {
            sb.Append(ch);
            if (last == '\\' && ignore) ignore = false;
        }
        else
        {
            switch (ch)
            {
                case '{':
                    case '[':
                        sb.Append(ch);
                        sb.Append(Environment.NewLine);
                        sb.Append(new string(' ', ++offset * indentLength));
                        break;
                    case ']':
                    case '}':
                        sb.Append(Environment.NewLine);
                        sb.Append(new string(' ', --offset * indentLength));
                        sb.Append(ch);
                        break;
                    case ',':
                        sb.Append(ch);
                        sb.Append(Environment.NewLine);
                        sb.Append(new string(' ', offset * indentLength));
                        break;
                    case ':':
                        sb.Append(ch);
                        sb.Append(' ');
                        break;
                    default:
                        if (quote || ch != ' ') sb.Append(ch);
                        break;
            }
        }
        last = ch;
    }
    return sb.ToString().Trim();
}
```

## Put it all together

The last step is to run your code. If you'd like to compare your code with ours, see the [sample code on GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/dotnet/Search/BingWebSearchv7.cs).

## Example JSON response

Responses from the Bing Web Search API are returned as JSON. This sample response has been truncated to show a single result.  

```json
{
  "_type": "SearchResponse",
  "queryContext": {
    "originalQuery": "Microsoft Cognitive Services"
  },
  "webPages": {
    "webSearchUrl": "https://www.bing.com/search?q=Microsoft+cognitive+services",
    "totalEstimatedMatches": 22300000,
    "value": [
      {
        "id": "https://api.cognitive.microsoft.com/api/v7/#WebPages.0",
        "name": "Microsoft Cognitive Services",
        "url": "https://www.microsoft.com/cognitive-services",
        "displayUrl": "https://www.microsoft.com/cognitive-services",
        "snippet": "Knock down barriers between you and your ideas. Enable natural and contextual interaction with tools that augment users' experiences via the power of machine-based AI. Plug them in and bring your ideas to life.",
        "deepLinks": [
          {
            "name": "Face",
            "url": "https://azure.microsoft.com/services/cognitive-services/face/",
            "snippet": "Add facial recognition to your applications to detect, identify, and verify faces using the Face service from Microsoft Azure. ... Cognitive Services; Face service;"
          },
          {
            "name": "Text Analytics",
            "url": "https://azure.microsoft.com/services/cognitive-services/text-analytics/",
            "snippet": "Cognitive Services; Text Analytics API; Text Analytics API . Detect sentiment, ... you agree that Microsoft may store it and use it to improve Microsoft services, ..."
          },
          {
            "name": "Computer Vision API",
            "url": "https://azure.microsoft.com/services/cognitive-services/computer-vision/",
            "snippet": "Extract the data you need from images using optical character recognition and image analytics with Computer Vision APIs from Microsoft Azure."
          },
          {
            "name": "Emotion",
            "url": "https://www.microsoft.com/cognitive-services/en-us/emotion-api",
            "snippet": "Cognitive Services Emotion API - microsoft.com"
          },
          {
            "name": "Bing Speech API",
            "url": "https://azure.microsoft.com/services/cognitive-services/speech/",
            "snippet": "Add speech recognition to your applications, including text to speech, with a speech API from Microsoft Azure. ... Cognitive Services; Bing Speech API;"
          },
          {
            "name": "Get Started for Free",
            "url": "https://azure.microsoft.com/services/cognitive-services/",
            "snippet": "Add vision, speech, language, and knowledge capabilities to your applications using intelligence APIs and SDKs from Cognitive Services."
          }
        ]
      }
    ]
  },
  "relatedSearches": {
    "id": "https://api.cognitive.microsoft.com/api/v7/#RelatedSearches",
    "value": [
      {
        "text": "microsoft bot framework",
        "displayText": "microsoft bot framework",
        "webSearchUrl": "https://www.bing.com/search?q=microsoft+bot+framework"
      },
      {
        "text": "microsoft cognitive services youtube",
        "displayText": "microsoft cognitive services youtube",
        "webSearchUrl": "https://www.bing.com/search?q=microsoft+cognitive+services+youtube"
      },
      {
        "text": "microsoft cognitive services search api",
        "displayText": "microsoft cognitive services search api",
        "webSearchUrl": "https://www.bing.com/search?q=microsoft+cognitive+services+search+api"
      },
      {
        "text": "microsoft cognitive services news",
        "displayText": "microsoft cognitive services news",
        "webSearchUrl": "https://www.bing.com/search?q=microsoft+cognitive+services+news"
      },
      {
        "text": "ms cognitive service",
        "displayText": "ms cognitive service",
        "webSearchUrl": "https://www.bing.com/search?q=ms+cognitive+service"
      },
      {
        "text": "microsoft cognitive services text analytics",
        "displayText": "microsoft cognitive services text analytics",
        "webSearchUrl": "https://www.bing.com/search?q=microsoft+cognitive+services+text+analytics"
      },
      {
        "text": "microsoft cognitive services toolkit",
        "displayText": "microsoft cognitive services toolkit",
        "webSearchUrl": "https://www.bing.com/search?q=microsoft+cognitive+services+toolkit"
      },
      {
        "text": "microsoft cognitive services api",
        "displayText": "microsoft cognitive services api",
        "webSearchUrl": "https://www.bing.com/search?q=microsoft+cognitive+services+api"
      }
    ]
  },
  "rankingResponse": {
    "mainline": {
      "items": [
        {
          "answerType": "WebPages",
          "resultIndex": 0,
          "value": {
            "id": "https://api.cognitive.microsoft.com/api/v7/#WebPages.0"
          }
        }
      ]
    },
    "sidebar": {
      "items": [
        {
          "answerType": "RelatedSearches",
          "value": {
            "id": "https://api.cognitive.microsoft.com/api/v7/#RelatedSearches"
          }
        }
      ]
    }
  }
}
```

## Next steps

> [!div class="nextstepaction"]
> [Bing Web Search API single-page app tutorial](../tutorial-bing-web-search-single-page-app.md)

[!INCLUDE [bing-web-search-quickstart-see-also](../../../../includes/bing-web-search-quickstart-see-also.md)]
