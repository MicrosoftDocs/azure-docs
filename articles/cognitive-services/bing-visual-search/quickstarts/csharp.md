---
title: C# Quickstart for Bing Visual Search API | Microsoft Docs
titleSuffix: Bing Web Search APIs - Cognitive Services
description: Shows how to quickly get started using the Visual Search API to get insights about an image.
services: cognitive-services
author: swhite-msft
manager: rosh

ms.service: cognitive-services
ms.technology: bing-visual-search
ms.topic: article
ms.date: 4/19/2018
ms.author: scottwhi
---

# Your first Bing Visual Search query in C#

Bing Visual Search API lets you send a request to Bing to get insights about an image. To call the API, send an HTTP POST  request to https:\/\/api.cognitive.microsoft.com/bing/v7.0/images/visualsearch. The response contains JSON objects that you parse to get the insights.

This article includes a simple console application that sends a Bing Visual Search API request and displays the JSON search results. While this application is written in C#, the API is a RESTful Web service compatible with any programming language that can make HTTP requests and parse JSON. 

The example program uses .NET Core classes only and runs on Windows using the .NET CLR or on Linux or macOS using [Mono](http://www.mono-project.com/).


## Prerequisites

You will need [Visual Studio 2017](https://www.visualstudio.com/downloads/) to get this code running on Windows. (The free Community Edition will work.)

For this quickstart, you may use a [free trial](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api) subscription key or a paid subscription key.

## Running the application

To run this application, follow these steps:

1. Create a new Console solution in Visual Studio.
1. Replace the contents of `Program.cs` with the code shown in this quickstart.
2. Replace the `accessKey` value with your subscription key.
2. Replace the `insightsToken` value with an insights token from an /images/search response.
3. Run the program.

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
        // *** Update and verify the following values. ***
        // **********************************************

        // Replace the accessKey string value with your valid subscription key.
        const string accessKey = "<YOUR-SUBSCRIPTION-KEY-GOES-HERE>";

        // Verify the endpoint URI. At this writing, only one endpoint is used for Bing
        // search APIs. In the future, regional endpoints may be available. If you
        // encounter unexpected authorization errors, double-check this value against
        // the endpoint for your Bing search instance in your Azure dashboard.
        const string uriBase = "https://api.cognitive.microsoft.com/bing/v7.0/images/visualsearch";

        // Update with an insights token from an image object that the /images/search API endpoint returns.
        static string insightsToken = "<YOUR-INSIGHTS-TOKEN-GOES-HERE>";

        // Boundary strings for form data in body of POST.
        const string CRLF = "\r\n";
        static string BoundaryTemplate = "batch_{0}";
        static string StartBoundaryTemplate = "--{0}";
        static string EndBoundaryTemplate = "--{0}--";

        const string CONTENT_TYPE_HEADER_PARAMS = "multipart/form-data; boundary={0}";
        const string POST_BODY_HEADERS = "Content-Disposition: form-data; name=\"knowledgeRequest\"" + CRLF + CRLF;


        // Used to return image search results including relevant headers
        struct SearchResult
        {
            public String jsonResult;
            public Dictionary<String, String> relevantHeaders;
        }

        static void Main()
        {
            try
            {
                Console.OutputEncoding = System.Text.Encoding.UTF8;

                if (accessKey.Length == 32)
                {
                    Console.WriteLine("Getting image insights for token: " + insightsToken);

                    // Set up POST body.
                    var boundary = string.Format(BoundaryTemplate, Guid.NewGuid());
                    var requestBody = BuildPostBody(boundary, insightsToken);
                    var contentTypeHdrValue = string.Format(CONTENT_TYPE_HEADER_PARAMS, boundary);

                    SearchResult result = BingImageSearch(requestBody, contentTypeHdrValue);

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
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }


        /// <summary>
        /// Build body of POST request.
        /// </summary>
        static string BuildPostBody(string boundary, string insightsToken)
        {
            var startBoundary = string.Format(StartBoundaryTemplate, boundary);
            var endBoundary = string.Format(EndBoundaryTemplate, boundary);

            var requestBody = startBoundary + CRLF;
            requestBody += POST_BODY_HEADERS;

            requestBody += "{\"imageInfo\":{\"imageInsightsToken\":\"" + insightsToken + "\"}}" + CRLF + CRLF;

            requestBody += endBoundary + CRLF;

            return requestBody;
        }


        /// <summary>
        /// Calls the Bing visual search endpoint and returns the results as a SearchResult.
        /// </summary>
        static SearchResult BingImageSearch(string requestBody, string contentTypeValue)
        {
            WebRequest request = HttpWebRequest.Create(uriBase);
            request.ContentType = contentTypeValue;
            request.ContentLength = requestBody.Length;
            request.Headers["Ocp-Apim-Subscription-Key"] = accessKey;
            request.Method = "POST";

            using (Stream requestStream = request.GetRequestStream())
            {
                StreamWriter writer = new StreamWriter(requestStream);
                writer.Write(requestBody);
                writer.Close();
            }


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




## Next steps

[Get insights about an image you upload](../upload-image.md)
[Bing Visual Search single-page app tutorial](../tutorial-bing-visual-search-single-page-app.md)
[Bing Visual Search overview](../overview.md)  
[Try it](https://aka.ms/bingvisualsearchtryforfree)  
[Get a free trial access key](https://azure.microsoft.com/try/cognitive-services/?api=bing-visual-search-api)  
[Bing Visual Search API reference](https://aka.ms/bingvisualsearchreferencedoc)
