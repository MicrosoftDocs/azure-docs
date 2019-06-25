---
title: "Quickstart: Check spelling with the Bing Spell Check SDK for C#"
titlesuffix: Azure Cognitive Services
description: Get started using the Bing Spell Check REST API to check spelling and grammar.
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-spell-check
ms.topic: quickstart
ms.date: 02/20/2019
ms.author: aahi
---

# Quickstart: Check spelling with the Bing Spell Check SDK for C#

Use this quickstart to begin spell checking with the Bing Spell Check SDK for C#. While Bing Spell Check has a REST API compatible with most programming languages, the SDK provides an easy way to integrate the service into your applications. The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/samples/SpellCheck).

## Application dependencies

* Any edition of [Visual Studio 2017 or later](https://visualstudio.microsoft.com/downloads/).
* The Bing Spell Check [NuGet Package](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Language.SpellCheck)

To add the Bing Spell Check SDK to your project, select **Manage NuGet Packages** from **Solution Explorer** in Visual Studio. Add the `Microsoft.Azure.CognitiveServices.Language.SpellCheck` package. The package also installs the following dependencies:

* Microsoft.Rest.ClientRuntime
* Microsoft.Rest.ClientRuntime.Azure
* Newtonsoft.Json

[!INCLUDE [cognitive-services-bing-spell-check-signup-requirements](../../../includes/cognitive-services-bing-spell-check-signup-requirements.md)]

## Create and initialize the application

1. Create a new C# console solution in Visual Studio. Then add the following `using` statement.
    
    ```csharp
    using System;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.Azure.CognitiveServices.Language.SpellCheck;
    using Microsoft.Azure.CognitiveServices.Language.SpellCheck.Models;
    ```

2. Create a new class. Then create an asynchronous function called `SpellCheckCorrection()` that takes a subscription key and sends the spell check request.

3. Instantiate the client by creating a new `ApiKeyServiceClientCredentials` object. 

    ```csharp
    public static class SpellCheckSample{
        public static async Task SpellCheckCorrection(string key){
            var client = new SpellCheckClient(new ApiKeyServiceClientCredentials(key));
        }
        //...
    }
    ```

## Send the request and read the response

1. In the function created above, perform the following steps. Send the spell check request with the client. Add the text to be checked to the `text` parameter, and set the mode to `proof`.  
    
    ```csharp
    var result = await client.SpellCheckerWithHttpMessagesAsync(text: "Bill Gatas", mode: "proof");
    ```

2. Get the first spell check result, if there is one. Print the first misspelled word (token) returned, the token type, and the number of suggestions.

    ```csharp
    if (firstspellCheckResult != null){
        var firstspellCheckResult = result.Body.FlaggedTokens.FirstOrDefault();
    
        Console.WriteLine("SpellCheck Results#{0}", result.Body.FlaggedTokens.Count);
        Console.WriteLine("First SpellCheck Result token: {0} ", firstspellCheckResult.Token);
        Console.WriteLine("First SpellCheck Result Type: {0} ", firstspellCheckResult.Type);
        Console.WriteLine("First SpellCheck Result Suggestion Count: {0} ", firstspellCheckResult.Suggestions.Count);
    }
    ```

3. Get the first suggested correction, if there is one.Print the suggestion score, and the suggested word. 

    ```csharp
            var suggestions = firstspellCheckResult.Suggestions;

            if (suggestions?.Count > 0)
            {
                var firstSuggestion = suggestions.FirstOrDefault();
                Console.WriteLine("First SpellCheck Suggestion Score: {0} ", firstSuggestion.Score);
                Console.WriteLine("First SpellCheck Suggestion : {0} ", firstSuggestion.Suggestion);
            }
   }

## Next steps

> [!div class="nextstepaction"]
> [Create a single page web-app](tutorials/spellcheck.md)

- [What is the Bing Spell Check API?](overview.md)
- [Bing Spell Check C# SDK reference guide](https://docs.microsoft.com/dotnet/api/overview/azure/cognitiveservices/client/bingspellcheck?view=azure-dotnet)