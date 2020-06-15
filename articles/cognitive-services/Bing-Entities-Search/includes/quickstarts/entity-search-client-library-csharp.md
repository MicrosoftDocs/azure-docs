---
title: Bing Entity Search C# client library quickstart 
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 03/06/2020
ms.author: aahi
---

Use this quickstart to begin searching for entities with the Bing Entity Search client library for C#. While Bing Entity Search has a REST API compatible with most programming languages, the client library provides an easy way to integrate the service into your applications. The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/BingSearchv7/BingEntitySearch).


## Prerequisites

* Any edition of [Visual Studio 2017 or later](https://www.visualstudio.com/downloads/).
* The [Json.NET](https://www.newtonsoft.com/json) framework, available as a NuGet package.
* If you are using Linux/MacOS, this application can be run using [Mono](https://www.mono-project.com/).
* The [Bing News Search SDK NuGet package](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Search.EntitySearch/1.2.0). Installing this package also installs the following:
    * Microsoft.Rest.ClientRuntime
    * Microsoft.Rest.ClientRuntime.Azure
    * Newtonsoft.Json

To add the Bing Entity Search client library to your Visual Studio project, use the **Manage NuGet Packages** option from **Solution Explorer**, and add the `Microsoft.Azure.CognitiveServices.Search.EntitySearch` package.


[!INCLUDE [cognitive-services-bing-news-search-signup-requirements](~/includes/cognitive-services-bing-entity-search-signup-requirements.md)]

## Create and initialize an application

1. create a new C# console solution in Visual Studio. Then add the following into the main code file.

    ```csharp
    using System;
    using System.Linq;
    using System.Text;
    using Microsoft.Azure.CognitiveServices.Search.EntitySearch;
    using Microsoft.Azure.CognitiveServices.Search.EntitySearch.Models;
    using Newtonsoft.Json;
    ```

## Create a client and send a search request

1. Create a new search client. Add your subscription key by creating a new `ApiKeyServiceClientCredentials`.

    ```csharp
    var client = new EntitySearchClient(new ApiKeyServiceClientCredentials("YOUR-ACCESS-KEY"));
    ```

1. Use the client's `Entities.Search()` function to search for your query:
    
    ```csharp
    var entityData = client.Entities.Search(query: "Satya Nadella");
    ```

## Get and print an entity description

1. If the API returned search results, get the main entity from `entityData`.

    ```csharp
    var mainEntity = entityData.Entities.Value.Where(thing => thing.EntityPresentationInfo.EntityScenario == EntityScenario.DominantEntity).FirstOrDefault();
    ```

2. Print the description of the main entity 

    ```csharp
    Console.WriteLine(mainEntity.Description);
    ```

## Next steps

> [!div class="nextstepaction"]
> [Create a single-page web app](../../tutorial-bing-entities-search-single-page-app.md)

* [What is the Bing Entity Search API?](../../overview.md )