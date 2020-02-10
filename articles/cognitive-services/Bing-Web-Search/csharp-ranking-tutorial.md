---
title: Using rank to display search results
titleSuffix: Azure Cognitive Services
description: Shows how to use the Bing RankingResponse answer to display search results in rank order.
services: cognitive-services
author: aahill
manager: nitinme
ms.assetid: 2575A80C-FC74-4631-AE5D-8101CF2591D3
ms.service: cognitive-services
ms.subservice: bing-web-search
ms.topic: tutorial
ms.date: 12/19/2019
ms.author: aahi
---

# Build a console app search client in C#

This tutorial shows how to build a simple .NET Core console app that allows users to query the Bing Web Search API and display ranked results.

This tutorial shows how to:

- Make a simple query to the Bing Web Search API
- Display query results in ranked order

## Prerequisites

To follow along with the tutorial, you need:

- Visual Studio. If you don't have it, [download and install the free Visual Studio 2017 Community Edition](https://www.visualstudio.com/downloads/).
- A subscription key for the Bing Web Search API. If you don't have one, [sign up for a free trial](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api).

## Create a new Console App project

In Visual Studio, create a project with `Ctrl`+`Shift`+`N`.

In the **New Project** dialog, click **Visual C# > Windows Classic Desktop > Console App (.NET Framework)**.

Name the application **MyConsoleSearchApp**, and then click **OK**.

## Add the JSON.net Nuget package to the project

JSON.net allows you to work with the JSON responses returned by the API. Add its NuGet package to your project:

- In **Solution Explorer** right-click on the project and select **Manage NuGet Packages...**.
- On the  **Browse** tab, search for `Newtonsoft.Json`. Select the latest version, and then click **Install**.
- Click the **OK** button on the **Review Changes** window.
- Close the Visual Studio tab titled **NuGet: MyConsoleSearchApp**.

## Add a reference to System.Web

This tutorial relies on the `System.Web` assembly. Add a reference to this assembly to your project:

- In **Solution Explorer**, right-click on **References** and select **Add Reference...**
- Select **Assemblies > Framework**, then scroll down and check **System.Web**
- Select **OK**

## Add some necessary using statements

The code in this tutorial requires three additional using statements. Add these statements below the existing `using` statements at the top of **Program.cs**:

```csharp
using System.Web;
using System.Net.Http;
```

## Ask the user for a query

In **Solution Explorer**, open **Program.cs**. Update the `Main()` method:

```csharp
static void Main()
{
    // Get the user's query
    Console.Write("Enter Bing query: ");
    string userQuery = Console.ReadLine();
    Console.WriteLine();

    // Run the query and display the results
    RunQueryAndDisplayResults(userQuery);

    // Prevent the console window from closing immediately
    Console.WriteLine("\nHit ENTER to exit...");
    Console.ReadLine();
}
```

This method:

- Asks the user for a query
- Calls `RunQueryAndDisplayResults(userQuery)` to execute the query and display the results
- Waits for user input in order to prevent the console window from immediately closing.

## Search for query results using the Bing Web Search API

Next, add a method that queries the API and displays the results:

```csharp
static void RunQueryAndDisplayResults(string userQuery)
{
    try
    {
        // Create a query
        var client = new HttpClient();
        client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "<YOUR_SUBSCRIPTION_KEY_GOES_HERE>");
        var queryString = HttpUtility.ParseQueryString(string.Empty);
        queryString["q"] = userQuery;
        var query = "https://api.cognitive.microsoft.com/bing/v7.0/search?" + queryString;

        // Run the query
        HttpResponseMessage httpResponseMessage = client.GetAsync(query).Result;

        // Deserialize the response content
        var responseContentString = httpResponseMessage.Content.ReadAsStringAsync().Result;
        Newtonsoft.Json.Linq.JObject responseObjects = Newtonsoft.Json.Linq.JObject.Parse(responseContentString);

        // Handle success and error codes
        if (httpResponseMessage.IsSuccessStatusCode)
        {
            DisplayAllRankedResults(responseObjects);
        }
        else
        {
            Console.WriteLine($"HTTP error status code: {httpResponseMessage.StatusCode.ToString()}");
        }
    }
    catch (Exception e)
    {
        Console.WriteLine(e.Message);
    }
}
```

This method:

- Creates an `HttpClient` to query the Web Search API
- Sets the `Ocp-Apim-Subscription-Key` HTTP header, which Bing uses to authenticate the request
- Executes the request and uses JSON.net to deserialize the results
- Calls `DisplayAllRankedResults(responseObjects)` to display all results in ranked order

Make sure to set the value of `Ocp-Apim-Subscription-Key` to your subscription key.

## Display ranked results

Before showing how to display the results in ranked order, take a look at a sample web search response:

```json
{
    "_type" : "SearchResponse",
    "webPages" : {
        "webSearchUrl" : "https:\/\/www.bing.com\/cr?IG=70BE289346...",
        "totalEstimatedMatches" : 982000,
        "value" : [{
            "id" : "https:\/\/api.cognitive.microsoft.com\/api\/v7\/#WebPages.0",
            "name" : "Contoso Sailing Club - Seattle",
            "url" : "https:\/\/www.bing.com\/cr?IG=70BE289346ED4594874FE...",
            "displayUrl" : "https:\/\/contososailingsea...",
            "snippet" : "Come sail with Contoso in Seattle...",
            "dateLastCrawled" : "2017-04-07T02:25:00"
        },
        {
            "id" : "https:\/\/api.cognitive.microsoft.com\/api\/7\/#WebPages.6",
            "name" : "Contoso Sailing Lessons - Official Site",
            "url" : "http:\/\/www.bing.com\/cr?IG=70BE289346ED4594874FE...",
            "displayUrl" : "https:\/\/www.constososailinglessonsseat...",
            "snippet" : "Contoso sailing lessons in Seattle...",
            "dateLastCrawled" : "2017-04-09T14:30:00"
        },

        ...

        ],
        "someResultsRemoved" : true
    },
    "relatedSearches" : {
        "id" : "https:\/\/api.cognitive.microsoft.com\/api\/7\/#RelatedSearches",
        "value" : [{
            "text" : "sailing lessons",
            "displayText" : "sailing lessons",
            "webSearchUrl" : "https:\/\/www.bing.com\/cr?IG=70BE289346E..."
        }

        ...

        ]
    },
    "rankingResponse" : {
        "mainline" : {
            "items" : [{
                "answerType" : "WebPages",
                "resultIndex" : 0,
                "value" : {
                    "id" : "https:\/\/api.cognitive.microsoft.com\/api\/v7\/#WebPages.0"
                }
            },
            {
                "answerType" : "WebPages",
                "resultIndex" : 1,
                "value" : {
                    "id" : "https:\/\/api.cognitive.microsoft.com\/api\/v7\/#WebPages.1"
                }
            }

            ...

            ]
        },
        "sidebar" : {
            "items" : [{
                "answerType" : "RelatedSearches",
                "value" : {
                    "id" : "https:\/\/api.cognitive.microsoft.com\/api\/v7\/#RelatedSearches"
                }
            }]
        }
    }
}
```

The `rankingResponse` JSON object ([documentation](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-web-api-v7-reference#rankingresponse)) describes the appropriate display order for search results. It includes one or more of the following, prioritized groups:

- `pole`: The search results to get the most visible treatment (for example, displayed above the mainline and sidebar).
- `mainline`: The search results to display in the mainline.
- `sidebar`: The search results to display in the sidebar. If there is no sidebar, display the results below the mainline.

The ranking response JSON may include one or more of the groups.

In **Program.cs**, add the following method to display results in properly ranked order:

```csharp
static void DisplayAllRankedResults(Newtonsoft.Json.Linq.JObject responseObjects)
{
    string[] rankingGroups = new string[] { "pole", "mainline", "sidebar" };

    // Loop through the ranking groups in priority order
    foreach (string rankingName in rankingGroups)
    {
        Newtonsoft.Json.Linq.JToken rankingResponseItems = responseObjects.SelectToken($"rankingResponse.{rankingName}.items");
        if (rankingResponseItems != null)
        {
            foreach (Newtonsoft.Json.Linq.JObject rankingResponseItem in rankingResponseItems)
            {
                Newtonsoft.Json.Linq.JToken resultIndex;
                rankingResponseItem.TryGetValue("resultIndex", out resultIndex);
                var answerType = rankingResponseItem.Value<string>("answerType");
                switch (answerType)
                {
                    case "WebPages":
                        DisplaySpecificResults(resultIndex, responseObjects.SelectToken("webPages.value"), "WebPage", "name", "url", "displayUrl", "snippet");
                        break;
                    case "News":
                        DisplaySpecificResults(resultIndex, responseObjects.SelectToken("news.value"), "News", "name", "url", "description");
                        break;
                    case "Images":
                        DisplaySpecificResults(resultIndex, responseObjects.SelectToken("images.value"), "Image", "thumbnailUrl");
                        break;
                    case "Videos":
                        DisplaySpecificResults(resultIndex, responseObjects.SelectToken("videos.value"), "Video", "embedHtml");
                        break;
                    case "RelatedSearches":
                        DisplaySpecificResults(resultIndex, responseObjects.SelectToken("relatedSearches.value"), "RelatedSearch", "displayText", "webSearchUrl");
                        break;
                }
            }
        }
    }
}
```

This method:

- Loops over the `rankingResponse` groups that the response contains
- Displays the items in each group by calling `DisplaySpecificResults(...)`

In **Program.cs**, add the following two methods:

```csharp
static void DisplaySpecificResults(Newtonsoft.Json.Linq.JToken resultIndex, Newtonsoft.Json.Linq.JToken items, string title, params string[] fields)
{
    if (resultIndex == null)
    {
        foreach (Newtonsoft.Json.Linq.JToken item in items)
        {
            DisplayItem(item, title, fields);
        }
    }
    else
    {
        DisplayItem(items.ElementAt((int)resultIndex), title, fields);
    }
}

static void DisplayItem(Newtonsoft.Json.Linq.JToken item, string title, string[] fields)
{
    Console.WriteLine($"{title}: ");
    foreach( string field in fields )
    {
        Console.WriteLine($"- {field}: {item[field]}");
    }
    Console.WriteLine();
}
```

These methods work together to output the search results to the console.

## Run the application

Run the application. The output should look similar to the following:

```
Enter Bing query: sailing lessons seattle

WebPage:
- name: Contoso Sailing Club - Seattle
- url: https://www.bing.com/cr?IG=70BE289346ED4594874FE...
- displayUrl: https://contososailingsea....
- snippet: Come sail with Contoso in Seattle...

WebPage:
- name: Contoso Sailing Lessons Seattle - Official Site
- url: http://www.bing.com/cr?IG=70BE289346ED4594874FE...
- displayUrl: https://www.constososailinglessonsseat...
- snippet: Contoso sailing lessons in Seattle...

...
```

## Next steps

Read more about [using ranking to display results](rank-results.md).
