---
title: "Quickstart: Call your Bing Custom Search endpoint using C# | Microsoft Docs"
titlesuffix: Azure Cognitive Services
description: Use this quickstart to begin requesting search results from your Bing Custom Search instance in C#. 
services: cognitive-services
author: aahill
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-custom-search
ms.topic: quickstart
ms.date: 05/07/2018
ms.author: maheshb
---

# Quickstart: Call your Bing Custom Search endpoint using C# 

Use this quickstart to begin requesting search results from your Bing Custom Search instance. While this application is written in C#, the Bing Custom Search API is a RESTful web service compatible with most programming languages.

## Prerequisites

- A Bing Custom Search instance. See [Quickstart: Create your first Bing Custom Search instance](quick-start.md) for more information.
- Microsoft [.Net Core](https://www.microsoft.com/net/download/core)
- Any edition of [Visual Studio 2017](https://www.visualstudio.com/downloads/)
- If you are using Linux/MacOS, this application can be run using [Mono](http://www.mono-project.com/).

You must have a [Cognitive Services API account](../cognitive-services-apis-create-account) with access to the Bing Custom Search API. If you don't have an Azure subscription, you can [create an account](https://azure.microsoft.com/try/cognitive-services/?api=bing-custom-search) for free. Before continuing, You will need the access key provided after activating your free trial, or a paid subscription key from your Azure dashboard.

[!INCLUDE [cognitive-services-bing-web-search-prerequisites](../../../includes/cognitive-services-bing-web-search-prerequisites.md)]

## Create and initialize the application

1. Create a new C# console application in Visual Studio. Then add the following packages to your project.

    ```csharp
    using System;
    using System.Net.Http;
    using System.Web;
    using Newtonsoft.Json;
    ```

2. Create the following classes to store the search results returned by the Bing Custom Search API.

    ```csharp
    public class BingCustomSearchResponse {        
        public string _type{ get; set; }            
        public WebPages webPages { get; set; }
    }

    public class WebPages {
        public string webSearchUrl { get; set; }
        public int totalEstimatedMatches { get; set; }
        public WebPage[] value { get; set; }        
    }

    public class WebPage {
        public string name { get; set; }
        public string url { get; set; }
        public string displayUrl { get; set; }
        public string snippet { get; set; }
        public DateTime dateLastCrawled { get; set; }
        public string cachedPageUrl { get; set; }
    }
    ```

3. In the main method of your project, create variables for your Bing Custom Search API subscription key, your search instance's Custom Configuration ID, and a search term.

    ```csharp
    var subscriptionKey = "YOUR-SUBSCRIPTION-KEY";
    var customConfigId = "YOUR-CUSTOM-CONFIG-ID";
    var searchTerm = args.Length > 0 ? args[0]:"microsoft" 
    ```

4. Construct the request URL by appending your search term to the `q=` query parameter, and your search instance's Custom Configuration ID to `customconfig=`. separate the parameters with a `&` character. 

    ```csharp
    var url = "https://api.cognitive.microsoft.com/bingcustomsearch/v7.0/search?" +
                "q=" + searchTerm + "&" +
                "customconfig=" + customConfigId;
    ```

## Send and receive a search request 

1. Create a request client, and add your subscription key to the `Ocp-Apim-Subscription-Key` header.

    ```csharp
    var client = new HttpClient();
    client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);
    ```

2. Perform the search request and get the response as a JSON object.

    ```csharp
    var httpResponseMessage = client.GetAsync(url).Result;
    var responseContent = httpResponseMessage.Content.ReadAsStringAsync().Result;
    BingCustomSearchResponse response = JsonConvert.DeserializeObject<BingCustomSearchResponse>(responseContent);
    ```
## Process and view the results

1. Iterate over the response object to display information about each search result, including its name, url, and the date the webpage was last crawled.

    ```csharp
    for(int i = 0; i < response.webPages.value.Length; i++) {                
        var webPage = response.webPages.value[i];
        
        Console.WriteLine("name: " + webPage.name);
        Console.WriteLine("url: " + webPage.url);                
        Console.WriteLine("displayUrl: " + webPage.displayUrl);
        Console.WriteLine("snippet: " + webPage.snippet);
        Console.WriteLine("dateLastCrawled: " + webPage.dateLastCrawled);
        Console.WriteLine();
    }            
    ```

## Full application code

To run this example, follow these steps:

1. Create a folder for your code.  
  
2. From a command prompt or terminal, navigate to the folder you just created.  
  
3. Run the following commands:

    ```
    dotnet new console -o BingCustomSearch
    cd BingCustomSearch
    dotnet add package Newtonsoft.Json
    dotnet restore
    ```
  
4. Copy the following code to Program.cs. Replace **YOUR-SUBSCRIPTION-KEY** and **YOUR-CUSTOM-CONFIG-ID** with your subscription key and configuration ID.

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
6. Build the application using the following command. Note the DLL path referenced by the command output.

    <pre>
    dotnet build 
    </pre>
    
7. Run the application using the following command replacing **PATH TO OUTPUT** with the DLL path referenced in step 6.

    <pre>    
    dotnet **PATH TO OUTPUT**
    </pre>

## Next steps

> [!div class="nextstepaction"]
> [Build a Custom Search web page](./custom-search-web-page.md)

- [Configure your hosted UI experience](./hosted-ui.md)
- [Use decoration markers to highlight text](./hit-highlighting.md)
- [Page webpages](./page-webpages.md)
