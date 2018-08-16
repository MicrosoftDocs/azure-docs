---
title: "Quickstart: Use C# to call the Bing Web Search API"
description: Get information and code samples to help you quickly get started using the Bing Web Search API in Microsoft Cognitive Services on Azure.
services: cognitive-services
documentationcenter: ''
author: v-jerkin
ms.service: cognitive-services
ms.component: bing-web-search
ms.topic: article
ms.date: 9/18/2017
ms.author: v-jerkin, erhopf
---

# Quickstart: Use C# to call the Bing Web Search API  

Use this quickstart to make your first call to the Bing Web Search API and receive a JSON response.  

[!INCLUDE [quickstart-signup](../includes/quickstart-signup.md)]

## Prerequisites

The example program uses .NET Core classes only and runs on Windows using the .NET CLR or on Linux or macOS using [Mono](http://www.mono-project.com/).  

* Windows: [Visual Studio 2017](https://www.visualstudio.com/downloads/)   
* Linux/macOS: [Mono](http://www.mono-project.com/)  

## Make a call to the Bing Web Search API  

To run this application, follow these steps.

1. Create a new Console solution in Visual Studio.
2. Copy this sample code into `Program.cs`:    
    ```csharp
    using System;
    using System.Text;
    using System.Net;
    using System.IO;
    using System.Collections.Generic;

    namespace BingSearchApisQuickstart
    {

        class Program
        {
            // **********************************************
            // *** Update or verify the following values. ***
            // **********************************************

            // Replace the accessKey string value with your valid access key.
            const string accessKey = "enter key here";

            // Verify the endpoint URI.  At this writing, only one endpoint is used for Bing
            // search APIs.  In the future, regional endpoints may be available.  If you
            // encounter unexpected authorization errors, double-check this value against
            // the endpoint for your Bing Web search instance in your Azure dashboard.
            const string uriBase = "https://api.cognitive.microsoft.com/bing/v7.0/search";

            const string searchTerm = "Microsoft Cognitive Services";

            // Used to return search results including relevant headers
            struct SearchResult
            {
                public String jsonResult;
                public Dictionary<String, String> relevantHeaders;
            }

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

            /// <summary>
            /// Performs a Bing Web search and return the results as a SearchResult.
            /// </summary>
            static SearchResult BingWebSearch(string searchQuery)
            {
                // Construct the URI of the search request
                var uriQuery = uriBase + "?q=" + Uri.EscapeDataString(searchQuery);

                // Perform the Web request and get the response
                WebRequest request = HttpWebRequest.Create(uriQuery);
                request.Headers["Ocp-Apim-Subscription-Key"] = accessKey;
                HttpWebResponse response = (HttpWebResponse)request.GetResponseAsync().Result;
                string json = new StreamReader(response.GetResponseStream()).ReadToEnd();

                // Create result object for return
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
            }

            /// <summary>
            /// Formats the given JSON string by adding line breaks and indents.
            /// </summary>
            /// <param name="json">The raw JSON string to format.</param>
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
                            case '}':
                            case ']':
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
        }
    }
    ```
3. Replace the `accessKey` value with an access key valid for your subscription.
4. Run the program.

## Sample response

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
            "name": "Face API",
            "url": "https://azure.microsoft.com/services/cognitive-services/face/",
            "snippet": "Add facial recognition to your applications to detect, identify, and verify faces using a Face API from Microsoft Azure. ... Cognitive Services; Face API;"
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
> [Bing Web search single-page app tutorial](../tutorial-bing-web-search-single-page-app.md)

[!INCLUDE [quickstart-see-also](../includes/quickstart-see-also.md)]
