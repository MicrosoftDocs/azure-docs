---
title: 'Quickstart: Call the Text Analytics service by using the Azure SDK for .NET and C#'
titleSuffix: Azure Cognitive Services
description: Information and code samples to help you start using the Text Analytics service and C#.
services: cognitive-services
author: raymondl
manager: nitinme

ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: quickstart
ms.date: 07/19/2019
ms.author: assafi
---

# Quickstart: Use the .NET SDK and C# to call the Text Analytics service
<a name="HOLTop"></a>

This quickstart helps you begin using the Azure SDK for .NET and C# to analyze language. Although the [Text Analytics](//go.microsoft.com/fwlink/?LinkID=759711) REST API is compatible with most programming languages, the SDK provides an easy way to integrate the service into your applications.

> [!NOTE]
> The demo code in this article uses the synchronous methods of the Text Analytics .NET SDK for simplicity. However, for production scenarios, we recommend using the batched asynchronous methods in your own applications to keep them scalable and responsive. For example, you could use `SentimentBatchAsync`  instead of `Sentiment`.
>
> A batched asynchronous version of this example can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/samples/TextAnalytics).

For technical details, refer to the SDK for .NET [Text Analytics reference](https://docs.microsoft.com/dotnet/api/overview/azure/cognitiveservices/client/textanalytics?view=azure-dotnet).

## Prerequisites

* Any edition of Visual Studio 2017 or later
* The Text Analytics [SDK for .NET](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Language.TextAnalytics)

[!INCLUDE [cognitive-services-text-analytics-signup-requirements](../../../../includes/cognitive-services-text-analytics-signup-requirements.md)]

You also need the [endpoint and access key](../How-tos/text-analytics-how-to-access-key.md) that was generated for you during sign-up.

## Create the Visual Studio solution and install the SDK

1. Create a new console app (.NET Core) project. [Access Visual Studio](https://visualstudio.microsoft.com/vs/).
1. Right-click the solution and select **Manage NuGet Packages for Solution**.
1. Select the **Browse** tab. Search for **Microsoft.Azure.CognitiveServices.Language.TextAnalytics**.

## Authenticate your credentials

1. Add the following `using` statements to the main class file (which is Program.cs by default).

    ```csharp
    using System;
    using System.Collections.Generic;
    using System.Net.Http;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Azure.CognitiveServices.Language.TextAnalytics;
    using Microsoft.Azure.CognitiveServices.Language.TextAnalytics.Models;
    using Microsoft.Rest;
    ```

2. Create a new `ApiKeyServiceClientCredentials` class to store the credentials and add them for each request.

    ```csharp
    class ApiKeyServiceClientCredentials : ServiceClientCredentials
    {
        private readonly string apiKey;

        public ApiKeyServiceClientCredentials(string apiKey)
        {
            this.apiKey = apiKey;
        }

        public override Task ProcessHttpRequestAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            if (request == null)
            {
                throw new ArgumentNullException("request");
            }
            request.Headers.Add("Ocp-Apim-Subscription-Key", this.apiKey);
            return base.ProcessHttpRequestAsync(request, cancellationToken);
        }
    }
    ```

3. Update the `Program` class. Add a constant member for your Text Analytics API key, and another for the service endpoint. Remember to use the correct Azure location for your Text Analytics resource.

    ```csharp
    //Enter your Text Analytics (TA) API Key (available in Azure Portal -> your TA resource -> Keys)
    private const string ApiKey = "enter-your-textanalytics-api-key-here";
    //You can get the resource location from Azure Portal -> your TA resource -> Overview
    private const string Endpoint = "enter-your-service-endpoint-here"; // For example: "https://<your-location>.api.cognitive.microsoft.com";
    ```

> [!Tip]
> To boost the security of secrets in production systems, we recommend that you use [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/quick-create-net).
>

## Create a Text Analytics client

In the `Main` function of your project, call the sample method that you want to invoke. Pass the `Endpoint` and `ApiKey` parameters that you defined.

```csharp
    public static void Main(string[] args)
    {
        var credentials = new ApiKeyServiceClientCredentials(ApiKey);
        var client = new TextAnalyticsClient(credentials)
        {
            Endpoint = Endpoint
        };

        // Change the console encoding to display non-ASCII characters.
        Console.OutputEncoding = System.Text.Encoding.UTF8;
        SentimentAnalysisExample(client);
        // DetectLanguageExample(client);
        // RecognizeEntitiesExample(client);
        // KeyPhraseExtractionExample(client);
        Console.ReadLine();
    }
```

The following sections describe how to call each service feature.

## Perform sentiment analysis

1. Create a new function `SentimentAnalysisExample()` that takes the client that you created earlier.
2. In the same function, call `client.Sentiment()` and get the result. The result will contain the sentiment `Score` if successful, and an `errorMessage` if not. A score that's close to 0 indicates a negative sentiment, while a score that's closer to 1 indicates a positive sentiment.

    ```csharp
    var result = client.Sentiment("I had the best day of my life.", "en");

    // Printing sentiment results
    Console.WriteLine($"Sentiment Score: {result.Score:0.00}");
    ```

### Output

```console
Sentiment Score: 0.87
```

## Perform language detection

1. Create a new function `DetectLanguageExample()` that takes the client that you created earlier.
2. In the same function, call `client.DetectLanguage()` and get the result. The result will contain the list of detected languages in `DetectedLanguages` if successful, and an `errorMessage` if not. Then print the first returned language.

    ```csharp
    var result = client.DetectLanguage("This is a document written in English.");

    // Printing detected languages
    Console.WriteLine($"Language: {result.DetectedLanguages[0].Name}");
    ```

> [!Tip]
> In some cases it may be hard to disambiguate languages based on the input. You can use the `countryHint` parameter to specify a 2-letter country code. By default the API is using the "US" as the default countryHint, to remove this behavior you can reset this parameter by setting this value to empty string `countryHint = ""` .

### Output

```console
Language: English
```

## Perform entity recognition

1. Create a new function `RecognizeEntitiesExample()` that takes the client that you created earlier.
2. In the same function, call `client.Entities()` and get the result. Then iterate through the results. The result will contain the list of detected entities in `Entities` if successful, and an `errorMessage` if not. For each detected entity, print its Type, Sub-Type, Wikipedia name (if they exist) as well as the locations in the original text.

    ```csharp
    var result = client.Entities("Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800.");

    // Printing recognized entities
    Console.WriteLine("Entities:");
    foreach (var entity in result.Entities)
    {
        Console.WriteLine($"\tName: {entity.Name},\tType: {entity.Type ?? "N/A"},\tSub-Type: {entity.SubType ?? "N/A"}");
        foreach (var match in entity.Matches)
        {
            Console.WriteLine($"\t\tOffset: {match.Offset},\tLength: {match.Length},\tScore: {match.EntityTypeScore:F3}");
        }
    }
    ```

### Output

```console
Entities:
    Name: Microsoft,        Type: Organization,     Sub-Type: N/A
        Offset: 0,      Length: 9,      Score: 1.000
    Name: Bill Gates,       Type: Person,   Sub-Type: N/A
        Offset: 25,     Length: 10,     Score: 1.000
    Name: Paul Allen,       Type: Person,   Sub-Type: N/A
        Offset: 40,     Length: 10,     Score: 0.999
    Name: April 4,  Type: Other,    Sub-Type: N/A
        Offset: 54,     Length: 7,      Score: 0.800
    Name: April 4, 1975,    Type: DateTime, Sub-Type: Date
        Offset: 54,     Length: 13,     Score: 0.800
    Name: BASIC,    Type: Other,    Sub-Type: N/A
        Offset: 89,     Length: 5,      Score: 0.800
    Name: Altair 8800,      Type: Other,    Sub-Type: N/A
        Offset: 116,    Length: 11,     Score: 0.800
```

## Perform key phrase extraction

1. Create a new function `KeyPhraseExtractionExample()` that takes the client that you created earlier.
2. In the same function, call `client.KeyPhrases()` and get the result. The result will contain the list of detected key phrases in `KeyPhrases` if successful, and an `errorMessage` if not. Then print any detected key phrases.

    ```csharp
    var result = client.KeyPhrases("My cat might need to see a veterinarian.");

    // Printing key phrases
    Console.WriteLine("Key phrases:");

    foreach (string keyphrase in result.KeyPhrases)
    {
        Console.WriteLine($"\t{keyphrase}");
    }
    ```

### Output

```console
Key phrases:
    cat
    veterinarian
```

## Next steps

> [!div class="nextstepaction"]
> [Text Analytics With Power BI](../tutorials/tutorial-power-bi-key-phrases.md)


* [Text Analytics overview](../overview.md)
* [Frequently asked questions (FAQ)](../text-analytics-resource-faq.md)
