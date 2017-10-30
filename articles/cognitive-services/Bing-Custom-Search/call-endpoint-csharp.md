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

This example shows how to request search results from your custom search instance using C#. To create this example follow these steps:

1. Create your custom instance (see [Define a custom search instance](define-your-custom-view.md)).
2. Get a subscription key, see [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=bing-custom-search-api).  

  >[!NOTE]  
  >Existing Bing Custom Search customers who have a preview key provisioned on or before October 15 2017 will be able to use their keys until November 30 2017, or until they have exhausted the maximum number of queries allowed. Afterward, they need to migrate to the generally available version on Azure. 
 
3. Install [.Net Core](https://www.microsoft.com/net/download/core).
4. Create a folder for your code.
5. From a command prompt or terminal, navigate to the folder you just created.
6. Run the following commands:
    <pre>
    dotnet new console -o BingCustomSearch
    cd BingCustomSearch
    dotnet add package Newtonsoft.Json
    dotnet restore
    </pre>
7. Copy the code below to Program.cs
8. Replace **YOUR-SUBSCRIPTION-KEY** and **YOUR-CUSTOM-CONFIG-ID** with your key and configuration ID (see step 1).

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
                
                Console.WriteLine("name: " + webPage.name);
                Console.WriteLine("url: " + webPage.url);                
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
        public WebPages webPages { get; set; }
    }

    public class WebPages
    {
        public string webSearchUrl { get; set; }
        public int totalEstimatedMatches { get; set; }
        public WebPage[] value { get; set; }        
    }

    public class WebPage
    {
        public string name { get; set; }
        public string url { get; set; }
        public string displayUrl { get; set; }
        public string snippet { get; set; }
        public DateTime dateLastCrawled { get; set; }
        public string cachedPageUrl { get; set; }
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
9. Run the code using the commands below replacing **PATH TO OUTPUT** with the path referenced by the build step:
    <pre>
    dotnet build
    dotnet **PATH TO OUTPUT**
    </pre>

### Next steps
- [Configure and consume custom hosted UI](./hosted-ui.md)
- [Use decoration markers to highlight text](./hit-highlighting.md)
- [Page webpages](./page-webpages.md)