---
title: Bing Custom Search Get started | Microsoft Docs
description: Describes how to call Bing Custom Search endpoint with Java
services: cognitive-services
author: brapel
manager: ehansen

ms.service: cognitive-services
ms.technology: bing-web-search
ms.topic: article
ms.date: 05/09/2017
ms.author: v-brapel
---

# Call Bing Custom Search endpoint (Java)

[!INCLUDE [call-bing-custom-search-endpoint](../../../includes/call-bing-custom-search-endpoint.md)]

```csharp
using System;
using System.Net.Http;
using System.Web;
using Newtonsoft.Json;

namespace bing_custom_search_example_dotnet
{
    class Program
    {
        static void Main(string[] args)
        {
            var subscriptionKey = "YOUR-SUBSCRIPTION-KEY";
            var customConfigId = "YOUR-CUSTOM-CONFIG-ID";
            var searchTerm = args.Length > 0 ? args[0]: "microsoft";            

            var url = "https://api.cognitive.microsoft.com/bingcustomsearch/v7.0/search?" +
                "q=" + searchTerm +
                "&customconfig=" + customConfigId;

            var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);
            var httpResponseMessage = client.GetAsync(url).Result;
            var responseContent = httpResponseMessage.Content.ReadAsStringAsync().Result;
            BingCustomSearchResponse response = JsonConvert.DeserializeObject<BingCustomSearchResponse>(responseContent);
            
            for(int i = 0; i < response.webPages.value.Length; i++)
            {                
                var webPage = response.webPages.value[i];
                
                Console.WriteLine("id: " + webPage.id);
                Console.WriteLine("name: " + webPage.name);
                Console.WriteLine("url: " + webPage.url);
                Console.WriteLine("urlPingSuffix: " + webPage.urlPingSuffix);
                Console.WriteLine("displayUrl: " + webPage.displayUrl);
                Console.WriteLine("snippet: " + webPage.snippet);
                Console.WriteLine("dateLastCrawled: " + webPage.dateLastCrawled);
                Console.WriteLine();
            }            
        }
    }
}
```
