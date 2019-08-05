---
title: 'Quickstart: Text Analytics client library for Python | Microsoft Docs'
titleSuffix: Azure Cognitive Services
description: Use this quickstart to to begin using the Text Analytics API from Azure Cognitive Services.
services: cognitive-services
author: raymondl
manager: nitinme

ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: quickstart
ms.date: 08/05/2019
ms.author: assafi
---
# Quickstart: Text analytics client library for Python
<a name="HOLTop"></a>

This quickstart helps you begin using the Azure SDK for .NET and C# to analyze language. Although the [Text Analytics](//go.microsoft.com/fwlink/?LinkID=759711) REST API is compatible with most programming languages, the SDK provides an easy way to integrate the service into your applications.

> [!NOTE]
> The source code for this sample is available on [GitHub](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/samples/TextAnalytics).

For technical details, refer to the SDK for .NET [Text Analytics reference](https://docs.microsoft.com/dotnet/api/overview/azure/cognitiveservices/client/textanalytics?view=azure-dotnet).

## Prerequisites

* Any edition of [visual studio 2017 or later]
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
        SentimentAnalysisExample(client).Wait();
        // DetectLanguageExample(client).Wait();
        // RecognizeEntitiesExample(client).Wait();
        // KeyPhraseExtractionExample(client).Wait();
        Console.ReadLine();
    }
```

The following sections describe how to call each service feature.

## Perform sentiment analysis

1. Create a new function `SentimentAnalysisExample()` that takes the client that you created earlier.
2. Generate a list of `MultiLanguageInput` objects that contains the documents that you want to analyze.

    ```csharp
    public static async Task SentimentAnalysisExample(TextAnalyticsClient client)
    {
        // The documents to be analyzed. Add the language of the document. The ID can be any value.
        var inputDocuments = new MultiLanguageBatchInput(
            new List<MultiLanguageInput>
            {
                new MultiLanguageInput("en", "1", "I had the best day of my life.")
            });
        //...
    }
    ```

3. In the same function, call `client.SentimentAsync()` and get the result. Then iterate through the results. Print each document's ID and sentiment score. A score that's close to 0 indicates a negative sentiment, while a score that's closer to 1 indicates a positive sentiment.

    ```csharp
    var result = await client.SentimentAsync(false, inputDocuments);

    // Printing sentiment results
    foreach (var document in result.Documents)
    {
        Console.WriteLine($"Document ID: {document.Id} , Sentiment Score: {document.Score:0.00}");
    }
    ```

### Output

```console
Document ID: 1 , Sentiment Score: 0.87
```

## Perform language detection

1. Create a new function `DetectLanguageExample()` that takes the client that you created earlier.
2. Generate a list of `LanguageInput` objects that contains your documents.

    ```csharp
    public static async Task DetectLanguageExample(TextAnalyticsClient client)
    {

        // The documents to be submitted for language detection. The ID can be any value.
        var inputDocuments = new LanguageBatchInput(
                new List<LanguageInput>
                    {
                        new LanguageInput(id: "1", text: "This is a document written in English.")
                    });
        //...
    }
    ```

3. In the same function, call `client.DetectLanguageAsync()` and get the result. Then iterate through the results. Print each document's ID and the first returned language.

    ```csharp
    var langResults = await client.DetectLanguageAsync(false, inputDocuments);

    // Printing detected languages
    foreach (var document in langResults.Documents)
    {
        Console.WriteLine($"Document ID: {document.Id} , Language: {document.DetectedLanguages[0].Name}");
    }
    ```

### Output

```console
===== LANGUAGE EXTRACTION ======
Document ID: 1 , Language: English
```

## Perform entity recognition

1. Create a new function `RecognizeEntitiesExample()` that takes the client that you created earlier.
2. Generate a list of `MultiLanguageBatchInput` objects that contains your documents.

    ```csharp
    public static async Task RecognizeEntitiesExample(TextAnalyticsClient client)
    {
        // The documents to be submitted for entity recognition. The ID can be any value.
        var inputDocuments = new MultiLanguageBatchInput(
            new List<MultiLanguageInput>
            {
                new MultiLanguageInput("en", "1", "Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800.")
            });
        //...
    }
    ```

3. In the same function, call `client.EntitiesAsync()` and get the result. Then iterate through the results. Print each document's ID. For each detected entity, print its Wikipedia name and the type and subtypes (if they exist) as well as the locations in the original text.

    ```csharp
    var entitiesResult = await client.EntitiesAsync(false, inputDocuments);

    // Printing recognized entities
    foreach (var document in entitiesResult.Documents)
    {
        Console.WriteLine($"Document ID: {document.Id} ");

        Console.WriteLine("\t Entities:");
        foreach (var entity in document.Entities)
        {
            Console.WriteLine($"\t\tName: {entity.Name},\tType: {entity.Type ?? "N/A"},\tSub-Type: {entity.SubType ?? "N/A"}");
            foreach (var match in entity.Matches)
            {
                Console.WriteLine($"\t\t\tOffset: {match.Offset},\tLength: {match.Length},\tScore: {match.EntityTypeScore:F3}");
            }
        }
    }
    ```

### Output

```console
Document ID: 1
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
2. Generate a list of `MultiLanguageBatchInput` objects that contains your documents.

    ```csharp
    public static async Task KeyPhraseExtractionExample(TextAnalyticsClient client)
    {
        var inputDocuments = new MultiLanguageBatchInput(
                    new List<MultiLanguageInput>
                    {
                        new MultiLanguageInput("en", "1", "My cat might need to see a veterinarian.")
                    });
        //...
    }
    ```

3. In the same function, call `client.KeyPhrasesAsync()` and get the result. Then iterate through the results. Print each document's ID and any detected key phrases.

    ```csharp
    var kpResults = await client.KeyPhrasesAsync(false, inputDocuments);

    // Printing keyphrases
    foreach (var document in kpResults.Documents)
    {
        Console.WriteLine($"Document ID: {document.Id} ");

        Console.WriteLine("\t Key phrases:");

        foreach (string keyphrase in document.KeyPhrases)
        {
            Console.WriteLine($"\t\t{keyphrase}");
        }
    }
    ```

### Output

```console
Document ID: 1
         Key phrases:
                cat
                veterinarian
```

## Next steps

> [!div class="nextstepaction"]
> [Text Analytics With Power BI](../tutorials/tutorial-power-bi-key-phrases.md)


* [Text Analytics overview](../overview.md)
* [Frequently asked questions (FAQ)](../text-analytics-resource-faq.md)
