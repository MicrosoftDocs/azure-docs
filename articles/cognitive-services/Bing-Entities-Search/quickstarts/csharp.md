---
title: C# Quickstart for Azure Cognitive Services, Bing Entity Search API | Microsoft Docs
description: Get information and code samples to help you quickly get started using the Bing Entity Search API in Microsoft Cognitive Services on Azure.
services: cognitive-services
documentationcenter: ''
author: v-jaswel

ms.service: cognitive-services
ms.technology: entity-search
ms.topic: article
ms.date: 11/28/2017
ms.author: v-jaswel

---
# Quickstart for Microsoft Bing Entity Search API with C# 
<a name="HOLTop"></a>

This article shows you how to use the [Bing Entity Search](https://docs.microsoft.com/azure/cognitive-services/bing-entities-search/search-the-web) API with C#.

## Prerequisites

You will need [Visual Studio 2017](https://www.visualstudio.com/downloads/) to run this code on Windows. (The free Community Edition will work.)

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Bing Entity Search API**. The [free trial](https://azure.microsoft.com/try/cognitive-services/?api=bing-entity-search-api) is sufficient for this quickstart. You need the access key provided when you activate your free trial, or you may use a paid subscription key from your Azure dashboard.

## Search entities

To run this application, follow these steps.

1. Create a new C# project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```csharp
using System;
using System.Net.Http;
using System.Text;

namespace EntitySearchSample
{
    class Program
    {
        static string host = "https://api.cognitive.microsoft.com";
        static string path = "/bing/v7.0/entities";

        static string market = "en-US";

        // NOTE: Replace this example key with a valid subscription key.
        static string key = "ENTER KEY HERE";

        static string query = "italian restaurant near me";

        async static void Search()
        {
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", key);

            string uri = host + path + "?mkt=" + market + "&q=" + System.Net.WebUtility.UrlEncode(query);

            HttpResponseMessage response = await client.GetAsync(uri);

            string contentString = await response.Content.ReadAsStringAsync();
            Console.WriteLine(JsonPrettyPrint(contentString));
        }

        static void Main(string[] args)
        {
            Search();
            Console.ReadLine();
        }


        static string JsonPrettyPrint(string json)
        {
            if (string.IsNullOrEmpty(json))
                return string.Empty;

            json = json.Replace(Environment.NewLine, "").Replace("\t", "");

            StringBuilder sb = new StringBuilder();
            bool quote = false;
            bool ignore = false;
            int offset = 0;
            int indentLength = 3;

            foreach (char ch in json)
            {
                switch (ch)
                {
                    case '"':
                        if (!ignore) quote = !quote;
                        break;
                    case '\'':
                        if (quote) ignore = !ignore;
                        break;
                }

                if (quote)
                    sb.Append(ch);
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
                            if (ch != ' ') sb.Append(ch);
                            break;
                    }
                }
            }

            return sb.ToString().Trim();
        }

    }
}
```

**Response**

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
        "webSearchUrl": "https://www.bing.com/search?q=Park+Place&filters=local_ypid:%22YN873x5786319842120194005%22&elv=AXXfrEiqqD9r3GuelwApulqDCgnOZrYZ*RB3VGaWfk8gK7yMNsMKZ091jipuxw7sD8M5EX84K6nRW*6aYSd2s*n!ZICJHXshywvARqsAvOi4",
        "name": "Park Place",
        "url": "https://www.restaurantparkplace.com/",
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
        "telephone": "(206) 453-5867"
      },
      {
        "_type": "LocalBusiness",
        "webSearchUrl": "https://www.bing.com/search?q=Pasta+and+Company&filters=local_ypid:%22YN873x2257558900374394159%22&elv=AXXfrEiqqD9r3GuelwApulqDCgnOZrYZ*RB3VGaWfk8gK7yMNsMKZ091jipuxw7sD8M5EX84K6nRW*6aYSd2s*n!ZICJHXshywvARqsAvOi4",
        "name": "Pasta and Company",
        "url": "http://www.pastaco.com/",
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
          "postalCode": "98121",
          "addressCountry": "US",
          "neighborhood": ""
        },
        "telephone": "(206) 322-1644"
      },
      {
        "_type": "LocalBusiness",
        "webSearchUrl": "https://www.bing.com/search?q=Calozzi%27s+Cheesesteaks-Italian&filters=local_ypid:%22YN925x222744375%22&elv=AXXfrEiqqD9r3GuelwApulqDCgnOZrYZ*RB3VGaWfk8gK7yMNsMKZ091jipuxw7sD8M5EX84K6nRW*6aYSd2s*n!ZICJHXshywvARqsAvOi4",
        "name": "Calozzi's Cheesesteaks-Italian",
        "entityPresentationInfo": {
          "entityScenario": "ListItem",
          "entityTypeHints": [
            "Place",
            "LocalBusiness"
          ]
        },
        "address": {
          "addressLocality": "Bellevue",
          "addressRegion": "WA",
          "postalCode": "98008",
          "addressCountry": "US",
          "neighborhood": "Crossroads"
        },
        "telephone": "(425) 221-5116"
      },
      {
        "_type": "Restaurant",
        "webSearchUrl": "https://www.bing.com/search?q=Princi&filters=local_ypid:%22YN873x3764731790710239496%22&elv=AXXfrEiqqD9r3GuelwApulqDCgnOZrYZ*RB3VGaWfk8gK7yMNsMKZ091jipuxw7sD8M5EX84K6nRW*6aYSd2s*n!ZICJHXshywvARqsAvOi4",
        "name": "Princi",
        "url": "http://www.princi.com/",
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
        "telephone": "(206) 624-0173"
      },
      {
        "_type": "Restaurant",
        "webSearchUrl": "https://www.bing.com/search?q=Swedish+Ballard+Cafeteria&filters=local_ypid:%22YN873x9787543113095303180%22&elv=AXXfrEiqqD9r3GuelwApulqDCgnOZrYZ*RB3VGaWfk8gK7yMNsMKZ091jipuxw7sD8M5EX84K6nRW*6aYSd2s*n!ZICJHXshywvARqsAvOi4",
        "name": "Swedish Ballard Cafeteria",
        "url": "http://www.swedish.com/",
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
          "postalCode": "98107",
          "addressCountry": "US",
          "neighborhood": "Ballard"
        }
      }
    ]
  }
}
```

[Back to top](#HOLTop)

## Next steps

> [!div class="nextstepaction"]
> [Bing Entity Search tutorial](../tutorial-bing-entities-search-single-page-app.md)

## See also 

[Bing Entity Search overview](../search-the-web.md )
[API Reference](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference)
