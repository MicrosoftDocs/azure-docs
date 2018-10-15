---
title: "Quickstart: Custom Search SDK, C#"
titleSuffix: Azure Cognitive Services
description: Setup Custom Search SDK C# console application.
services: cognitive-services
author: swhite-msft
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-custom-search
ms.topic: quickstart
ms.date: 09/06/2018
ms.author: scottwhi
---

# Quickstart: Using the Bing Custom Search SDK with C#

The Bing Custom Search SDK provides an easier programming model than the Bing Custom Search REST API. This section walks you through making your first Custom Search calls using the C# SDK.

## Prerequisites

To complete this quickstart, you need:

- A ready-to-use custom search instance. See [Create your first Bing Custom Search instance](quick-start.md).  
  
- A subscription key. You can get a subscription key when you activate your [free trial](https://azure.microsoft.com/try/cognitive-services/?api=bing-custom-search), or you can use a paid subscription key from your Azure dashboard (see [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account)).  
  
- Visual Studio 2017 installed. If you don’t already have it, you can download the **free** [Visual Studio 2017 Community Edition](https://www.visualstudio.com/downloads/).  
  
- The [NuGet Custom Search](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Search.CustomSearch/1.2.0) package installed. From the Solution Explorer in Visual Studio, right-click on your project and select `Manage NuGet Packages` from the menu. Install the `Microsoft.Azure.CognitiveServices.Search.CustomSearch` package.

Installing the NuGet Custom Search package also installs the following assemblies:

* Microsoft.Rest.ClientRuntime
* Microsoft.Rest.ClientRuntime.Azure
* Newtonsoft.Json



## Run the code

> [!TIP]
> Get the latest code as a Visual Studio solution from [GitHub](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/BingSearchv7/BingCustomWebSearch).

To run this example, follow these steps:

1. Open Visual Studio 2017.
  
2. Click the **File** menu, click **New**, **Project**, and then the **Visual C# Console Application** template.
  
3. Name your solution CustomSearchSolution and browse to the folder to put it in.
  
4. Click OK to create the solution.  
  
4. From the Solution Explorer, right-click on your project (it has the same name as the solution) and select `Manage NuGet Packages`. Click **Browse** in the NuGet Package Manager. Enter Microsoft.Azure.CognitiveServices.Search.CustomSearch in the search box and press enter. Select the package and click Install.  
  
4. Copy the following code into the Program.cs file. Replace **YOUR-SUBSCRIPTION-KEY** and **YOUR-CUSTOM-CONFIG-ID** with your subscription key and configuration ID.  
  
    ```csharp
    using System;
    using System.Linq;
    using Microsoft.Azure.CognitiveServices.Search.CustomSearch;

    namespace CustomSrchSDK
    {
        class Program
        {
            static void Main(string[] args)
            {

                var client = new CustomSearchAPI(new ApiKeyServiceClientCredentials("YOUR-SUBSCRIPTION-KEY"));

                try
                {
                    // This will look up a single query (Xbox).
                    var webData = client.CustomInstance.SearchAsync(query: "Xbox", customConfig: Int32.Parse("YOUR-CUSTOM-CONFIG-ID")).Result;
                    Console.WriteLine("Searched for Query# \" Xbox \"");

                    //WebPages
                    if (webData?.WebPages?.Value?.Count > 0)
                    {
                        // find the first web page
                        var firstWebPagesResult = webData.WebPages.Value.FirstOrDefault();

                        if (firstWebPagesResult != null)
                        {
                            Console.WriteLine("Number of webpage results {0}", webData.WebPages.Value.Count);
                            Console.WriteLine("First web page name: {0} ", firstWebPagesResult.Name);
                            Console.WriteLine("First web page URL: {0} ", firstWebPagesResult.Url);
                        }
                        else
                        {
                            Console.WriteLine("Couldn't find web results!");
                        }
                    }
                    else
                    {
                        Console.WriteLine("Didn't see any Web data..");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Encountered exception. " + ex.Message);
                }

                Console.WriteLine("Press any key to exit...");
                Console.ReadKey();
            }

        }
    }
    ```  
  
5. Build and run (debug) the solution. 




## Breaking it down

After installing the NuGet Custom Search package, you need to add a using directive for it.

```csharp
using Microsoft.Azure.CognitiveServices.Search.CustomSearch;
```

Next, instantiate the custom search client, which you use to make search requests. Be sure to replace `YOUR-SUBSCRIPTION-KEY` with your key.

```csharp
var client = new CustomSearchAPI(new ApiKeyServiceClientCredentials("YOUR-CUSTOM-SEARCH-KEY"));
```

Now you can use the client to send a search request. Be sure to replace your `YOUR-CUSTOM-CONFIG-ID` with your instance's configuration ID (you can find the ID in the [Custom Search portal](https://www.customsearch.ai/)). This example searches for Xbox. Update as needed.

```csharp
var webData = client.CustomInstance.SearchAsync(query: "Xbox", customConfig: Int32.Parse("YOUR-CUSTOM-CONFIG-ID")).Result;
```

The `SearchAsync` method returns a `WebData` object. Use `WebData` to iterate through any `WebPages` that were found. This code finds the first webpage result and prints the webpage's `Name` and `URL`.

```csharp
//WebPages
if (webData?.WebPages?.Value?.Count > 0)
{
    // find the first web page
    var firstWebPagesResult = webData.WebPages.Value.FirstOrDefault();

    if (firstWebPagesResult != null)
    {
        Console.WriteLine("Webpage Results#{0}", webData.WebPages.Value.Count);
        Console.WriteLine("First web page name: {0} ", firstWebPagesResult.Name);
        Console.WriteLine("First web page URL: {0} ", firstWebPagesResult.Url);
    }
    else
    {
        Console.WriteLine("Couldn't find web results!");
    }
}
else
{
    Console.WriteLine("Didn't see any Web data..");
}

```


## Next steps

Check out the SDK samples. Each sample includes a ReadMe file with details about prerequisites and installing/running the samples.

* Get started with [.NET samples](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/BingSearchv7) 
    * [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Search.CustomSearch/1.2.0)
    * See also [.NET libraries](https://github.com/Azure/azure-sdk-for-net/tree/psSdkJson6/src/SDKs/CognitiveServices/dataPlane/Search/BingCustomSearch) for definitions and dependencies.
* Get started with [NodeJS samples](https://github.com/Azure-Samples/cognitive-services-node-sdk-samples) 
    * See also [NodeJS libraries](https://github.com/Azure/azure-sdk-for-node/tree/master/lib/services/customSearch) for definitions and dependencies.
* Get started with [Java samples](https://github.com/Azure-Samples/cognitive-services-java-sdk-samples) 
    * See also [Java libraries](https://github.com/Azure/azure-sdk-for-java/tree/master/cognitiveservices/azure-customsearch) for definitions and dependencies.
* Get started with [Python samples](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples) 
    * See also [Python libraries](https://github.com/Azure/azure-sdk-for-python/tree/master/azure-cognitiveservices-search-customsearch) for definitions and dependencies.

