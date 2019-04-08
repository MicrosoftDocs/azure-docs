---
title: "Quickstart: C# SDK query prediction endpoint"
titleSuffix: Azure Cognitive Services 
description: Use the C# SDK to send a user utterance to LUIS and receive a prediction. 
author: diberry
manager: nitinme
ms.service: cognitive-services
services: cognitive-services
ms.subservice: language-understanding
ms.topic: quickstart
ms.date: 02/14/2019
ms.author: diberry
---

# Quickstart: Query prediction endpoint with C# .NET SDK

Use the .NET SDK, found on [NuGet](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Language.LUIS.Runtime/), to send a user utterance to Language Understanding (LUIS) and receive a prediction of the user's intention. 

This quickstart sends a user utterance, such as `turn on the bedroom light`, to a public Language Understanding application, then receives the prediction and displays the top-scoring intent `HomeAutomation.TurnOn` and the entity `HomeAutomation.Room` found within the utterance. 

## Prerequisites

* [Visual Studio Community 2017 edition](https://visualstudio.microsoft.com/vs/community/)
* C# programming language (included with VS Community 2017)
* Public app ID: df67dcdb-c37d-46af-88e1-8b97951ca1c2

> [!Note]
> The complete solution is available from the [cognitive-services-language-understanding](https://github.com/Azure-Samples/cognitive-services-language-understanding/tree/master/documentation-samples/sdk-quickstarts/c%23/UsePredictionRuntime) GitHub repository.

Looking for more documentation?

 * [SDK reference documentation](https://docs.microsoft.com/dotnet/api/overview/azure/cognitiveservices/client/languageunderstanding?view=azure-dotnet)


## Get Cognitive Services or Language Understanding key

In order to use the public app for home automation, you need a valid key for endpoint predictions. You can use either a Cognitive Services key (created below with the Azure CLI), which is valid for many cognitive services, or a `Language Understanding` key. 

Use the following [Azure CLI command to create a Cognitive Service key](https://docs.microsoft.com/cli/azure/cognitiveservices/account?view=azure-cli-latest#az-cognitiveservices-account-create):

```azurecli-interactive
az cognitiveservices account create \
    -n my-cog-serv-resource \
    -g my-cog-serv-resource-group \
    --kind CognitiveServices \
    --sku S0 \
    -l WestEurope \ 
    --yes
```

## Create .NET Core project

Create a .NET Core console project in Visual Studio Community 2017.

1. Open Visual Studio Community 2017.
1. Create a new project, from the **Visual C#** section, choose **Console App (.NET Core)**.
1. Enter the project name `QueryPrediction`, leave the remaining default values, and select **OK**.
    This creates a simple project with the primary code file named **Program.cs**.

## Add SDK with NuGet

1. In the **Solution Explorer**, select the Project in the tree view named **QueryPrediction**, then right-click. From the menu, select **Manage NuGet Packages...**.
1. Select **Browse** then enter `Microsoft.Azure.CognitiveServices.Language.LUIS.Runtime`. When the package information displays, select **Install** to install the package into the project. 
1. Add the following _using_ statements to the top of **Program.cs**. Do not remove the existing _using_ statement for `System`. 

```csharp
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.CognitiveServices.Language.LUIS.Runtime;
using Microsoft.Azure.CognitiveServices.Language.LUIS.Runtime.Models;
```

## Create a new method for the prediction

Create a new method, `GetPrediction` to send the query to the query prediction endpoint. The method will create and configure all necessary objects then return a `Task` with the [`LuisResult`](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.runtime.models.luisresult?view=azure-dotnet) prediction results. 

```csharp
static async  Task<LuisResult> GetPrediction() {
}
```

## Create credentials object

Add the following code to the `GetPrediction` method to create the client credentials with your Cognitive Service key.

Replace `<REPLACE-WITH-YOUR-KEY>` with your Cognitive Service key's region. The key is in the [Azure portal](https://portal.azure.com) on the Keys page for that resource.

```csharp
// Use Language Understanding or Cognitive Services key
// to create authentication credentials
var endpointPredictionkey = "<REPLACE-WITH-YOUR-KEY>";
var credentials = new ApiKeyServiceClientCredentials(endpointPredictionkey);
```

## Create Language Understanding client

In the `GetPrediction` method, after the preceding code, add the following code to use the new credentials, creating a [`LUISRuntimeClient`](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.runtime.luisruntimeclient.-ctor?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Language_LUIS_Runtime_LUISRuntimeClient__ctor_Microsoft_Rest_ServiceClientCredentials_System_Net_Http_DelegatingHandler___) client object. 

Replace `<REPLACE-WITH-YOUR-KEY-REGION>` with your key's region, such as `westus`. The key region is in the [Azure portal](https://portal.azure.com) on the Overview page for that resource.

```csharp
// Create Luis client and set endpoint
// region of endpoint must match key's region, for example `westus`
var luisClient = new LUISRuntimeClient(credentials, new System.Net.Http.DelegatingHandler[] { });
luisClient.Endpoint = "https://<REPLACE-WITH-YOUR-KEY-REGION>.api.cognitive.microsoft.com";
```

## Set query parameters

In the `GetPrediction` method, after the preceding code, add the following code to set the query parameters.

```csharp
// public Language Understanding Home Automation app
var appId = "df67dcdb-c37d-46af-88e1-8b97951ca1c2";

// query specific to home automation app
var query = "turn on the bedroom light";

// common settings for remaining parameters
Double? timezoneOffset = null;
var verbose = true;
var staging = false;
var spellCheck = false;
String bingSpellCheckKey = null;
var log = false;
```

## Query prediction endpoint

In the `GetPrediction` method, after the preceding code, add the following code to set the query parameters:

```csharp
// Create prediction client
var prediction = new Prediction(luisClient);

// get prediction
return await prediction.ResolveAsync(appId, query, timezoneOffset, verbose, staging, spellCheck, bingSpellCheckKey, log, CancellationToken.None);
```

## Display prediction results

Change the **Main** method to call the new `GetPrediction` method and return the prediction results:

```csharp
static void Main(string[] args)
{

    var luisResult = GetPrediction().Result;

    // Display query
    Console.WriteLine("Query:'{0}'", luisResult.Query);

    // Display most common properties of query result
    Console.WriteLine("Top intent is '{0}' with score {1}", luisResult.TopScoringIntent.Intent,luisResult.TopScoringIntent.Score);

    // Display all entities detected in query utterance
    foreach (var entity in luisResult.Entities)
    {
        Console.WriteLine("{0}:'{1}' begins at position {2} and ends at position {3}", entity.Type, entity.Entity, entity.StartIndex, entity.EndIndex);
    }

    Console.Write("done");

}
```

## Run the project

Build the project in Studio and run the project to the see the output of the query:

```console
Query:'turn on the bedroom light'
Top intent is 'HomeAutomation.TurnOn' with score 0.809439957
HomeAutomation.Room:'bedroom' begins at position 12 and ends at position 18
```

## Next steps

Learn more about the [.NET SDK](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Language.LUIS.Runtime/) and the [.NET reference documentation](https://docs.microsoft.com/dotnet/api/overview/azure/cognitiveservices/client/languageunderstanding?view=azure-dotnet). 

> [!div class="nextstepaction"] 
> [Tutorial: Build LUIS app to determine user intentions](luis-quickstart-intents-only.md) 