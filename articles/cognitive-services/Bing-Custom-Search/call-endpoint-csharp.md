---
title: "Bing Custom Search: Call endpoint by using C Sharp | Microsoft Docs"
description: Describes how to call Bing Custom Search endpoint with C#
services: cognitive-services
author: brapel
manager: ehansen

ms.service: cognitive-services
ms.technology: bing-web-search
ms.topic: article
ms.date: 09/28/2017
ms.author: v-brapel
---

# Call Bing Custom Search endpoint (C#)

Call Bing Custom Search endpoint using C# by performing these steps:
1. Get a subscription key, see [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=bing-custom-search-api).
2. Install [.Net Core](https://www.microsoft.com/net/download/core)
3. Create a folder for your code
5. From a command prompt or terminal, navigate to the folder you just created.
6. Run the following commands:
    ```
    dotnet new console -o BingCustomSearch
    cd BingCustomSearch
    dotnet add package Newtonsoft.Json
    dotnet restore
    ```
7. Copy the code below to Program.cs
8. Replace **YOUR-SUBSCRIPTION-KEY** and **YOUR-CUSTOM-CONFIG-ID** with your key and configuration ID.

``` CSharp
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

    public class BingCustomSearchResponse
    {        
        public string _type{ get; set; }    
        public Instrumentation instrumentation { get; set; }
        public WebPages webPages { get; set; }
    }

    public class Instrumentation
    {
        public string pingUrlBase { get; set; }
        public string pageLoadPingUrl { get; set; }
    }

    public class WebPages
    {
        public string webSearchUrl { get; set; }
        public string webSearchUrlPingSuffix { get; set; }
        public int totalEstimatedMatches { get; set; }
        public Value[] value { get; set; }        
    }

    public class Value
    {
        public string id { get; set; }
        public string name { get; set; }
        public string url { get; set; }
        public string urlPingSuffix { get; set; }
        public string displayUrl { get; set; }
        public string snippet { get; set; }
        public DateTime dateLastCrawled { get; set; }
        public string cachedPageUrl { get; set; }
        public string cachedPageUrlPingSuffix { get; set; }
        public OpenGraphImage openGraphImage { get; set; }        
    }
    
    public class OpenGraphImage
    {
        public string contentUrl { get; set; }
        public int width { get; set; }
        public int height { get; set; }
    }
}
```