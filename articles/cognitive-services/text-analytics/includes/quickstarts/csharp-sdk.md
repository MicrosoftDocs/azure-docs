---
title: "Quickstart: Text Analytics client library for C# | Microsoft Docs"
description: Get started with the Text Analytics client library for C#
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: include
ms.date: 10/07/2020
ms.author: aahi
ms.reviewer: assafi
---

<a name="HOLTop"></a>

# [Version 3.1 preview](#tab/version-3-1)

[v3.1 Reference documentation](/dotnet/api/azure.ai.textanalytics?preserve-view=true&view=azure-dotnet-previews) | [v3.1 Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics) | [v3.1 Package (NuGet)](https://www.nuget.org/packages/Azure.AI.TextAnalytics/5.1.0-beta.1) | [v3.1 Samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics/samples)

# [Version 3.0](#tab/version-3)

[v3 Reference documentation](/dotnet/api/azure.ai.textanalytics) | [v3 Library source code](https://github.com/Azure/azure-sdk-for-net/tree/Azure.AI.TextAnalytics_5.0.0/sdk/textanalytics/Azure.AI.TextAnalytics) | [v3 Package (NuGet)](https://www.nuget.org/packages/Azure.AI.TextAnalytics) | [v3 Samples](https://github.com/Azure/azure-sdk-for-net/tree/Azure.AI.TextAnalytics_5.0.0/sdk/textanalytics/Azure.AI.TextAnalytics/samples)

# [Version 2.1](#tab/version-2)

[v2 Reference documentation](/dotnet/api/overview/azure/cognitiveservices/client/textanalytics) | [v2 Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Language.TextAnalytics) | [v2 Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Language.TextAnalytics/) | [v2 Samples](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples)

---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The [Visual Studio IDE](https://visualstudio.microsoft.com/vs/)
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Text Analytics resource"  target="_blank">create a Text Analytics resource <span class="docon docon-navigate-external x-hidden-focus"></span></a> in the Azure portal to get your key and endpoint.  After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Text Analytics API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Setting up

### Create a new .NET Core application

Using the Visual Studio IDE, create a new .NET Core console app. This will create a "Hello World" project with a single C# source file: *program.cs*.

# [Version 3.1 preview](#tab/version-3-1)

Install the client library by right-clicking on the solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse** and search for `Azure.AI.TextAnalytics`. Check the **include prerelase** box, select version `5.1.0-beta.1`, and then **Install**. You can also use the [Package Manager Console](/nuget/consume-packages/install-use-packages-powershell#find-and-install-a-package).

# [Version 3.0](#tab/version-3)

Install the client library by right-clicking on the solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse** and search for `Azure.AI.TextAnalytics`. Select version `5.0.0`, and then **Install**. You can also use the [Package Manager Console](/nuget/consume-packages/install-use-packages-powershell#find-and-install-a-package).


> [!TIP]
> Want to view the whole quickstart code file at once? You can find it [on GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/TextAnalytics/program.cs), which contains the code examples in this quickstart. 

# [Version 2.1](#tab/version-2)

Install the client library by right-clicking on the solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens, select **Browse** and search for `Microsoft.Azure.CognitiveServices.Language.TextAnalytics`. Click on it, and then **Install**. You can also use the [Package Manager Console](/nuget/consume-packages/install-use-packages-powershell#find-and-install-a-package).

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it [on GitHub](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/blob/master/samples/TextAnalytics/synchronous/Program.cs), which contains the code examples in this quickstart. 

---

# [Version 3.1 preview](#tab/version-3-1)

Open the *program.cs* file and add the following `using` directives:

```csharp
using Azure;
using System;
using System.Globalization;
using Azure.AI.TextAnalytics;
```

In the application's `Program` class, create variables for your resource's key and endpoint.

[!INCLUDE [text-analytics-find-resource-information](../find-azure-resource-info.md)]

```csharp
private static readonly AzureKeyCredential credentials = new AzureKeyCredential("<replace-with-your-text-analytics-key-here>");
private static readonly Uri endpoint = new Uri("<replace-with-your-text-analytics-endpoint-here>");
```

Replace the application's `Main` method. You will define the methods called here later.

```csharp
static void Main(string[] args)
{
    var client = new TextAnalyticsClient(endpoint, credentials);
    // You will implement these methods later in the quickstart.
    SentimentAnalysisExample(client);
    SentimentAnalysisWithOpinionMiningExample(client);
    LanguageDetectionExample(client);
    EntityRecognitionExample(client);
    EntityLinkingExample(client);
    RecognizePIIExample(client);
    KeyPhraseExtractionExample(client);

    Console.Write("Press any key to exit.");
    Console.ReadKey();
}
```

# [Version 3.0](#tab/version-3)

Open the *program.cs* file and add the following `using` directives:

```csharp
using Azure;
using System;
using System.Globalization;
using Azure.AI.TextAnalytics;
```

In the application's `Program` class, create variables for your resource's key and endpoint.

[!INCLUDE [text-analytics-find-resource-information](../find-azure-resource-info.md)]

```csharp
private static readonly AzureKeyCredential credentials = new AzureKeyCredential("<replace-with-your-text-analytics-key-here>");
private static readonly Uri endpoint = new Uri("<replace-with-your-text-analytics-endpoint-here>");
```

Replace the application's `Main` method. You will define the methods called here later.

```csharp
static void Main(string[] args)
{
    var client = new TextAnalyticsClient(endpoint, credentials);
    // You will implement these methods later in the quickstart.
    SentimentAnalysisExample(client);
    LanguageDetectionExample(client);
    EntityRecognitionExample(client);
    EntityLinkingExample(client);
    KeyPhraseExtractionExample(client);

    Console.Write("Press any key to exit.");
    Console.ReadKey();
}
```

# [Version 2.1](#tab/version-2)

Open the *program.cs* file and add the following `using` directives:

[!code-csharp[Import directives](~/cognitive-services-dotnet-sdk-samples/samples/TextAnalytics/synchronous/Program.cs?name=imports)]

In the application's `Program` class, create variables for your resource's key and endpoint. 

[!INCLUDE [text-analytics-find-resource-information](../find-azure-resource-info.md)]

```csharp
private static readonly string key = "<replace-with-your-text-analytics-key-here>";
private static readonly string endpoint = "<replace-with-your-text-analytics-endpoint-here>";
```

Replace the application's `Main` method. You will define the methods called here later.

[!code-csharp[main method](~/cognitive-services-dotnet-sdk-samples/samples/TextAnalytics/synchronous/Program.cs?name=main)]

---

## Object model

The Text Analytics client is a `TextAnalyticsClient` object that authenticates to Azure using your key, and provides functions to accept text as single strings or as a batch. You can send text to the API synchronously, or asynchronously. The response object will contain the analysis information for each document you send. 

If you're using version `3.x` of the service, you can use an optional `TextAnalyticsClientOptions` instance to initialize the client with various default settings (for example default language or country/region hint). You can also authenticate using an Azure Active Directory token. 

## Code examples

* [Sentiment analysis](#sentiment-analysis)
* [Opinion mining](#opinion-mining)
* [Language detection](#language-detection)
* [Named Entity Recognition](#named-entity-recognition-ner)
* [Entity linking](#entity-linking)
* [Key phrase extraction](#key-phrase-extraction)

## Authenticate the client

# [Version 3.1 preview](#tab/version-3-1)

Make sure your main method from earlier creates a new client object with your endpoint and credentials.

```csharp
var client = new TextAnalyticsClient(endpoint, credentials);
```

# [Version 3.0](#tab/version-3)

Make sure your main method from earlier creates a new client object with your endpoint and credentials.

```csharp
var client = new TextAnalyticsClient(endpoint, credentials);
```

# [Version 2.1](#tab/version-2)

Create a new `ApiKeyServiceClientCredentials` class to store the credentials and add them to the client's requests. Within it, create an override for `ProcessHttpRequestAsync()` that adds your key to the `Ocp-Apim-Subscription-Key` header.

[!code-csharp[Client class](~/cognitive-services-dotnet-sdk-samples/samples/TextAnalytics/synchronous/Program.cs?name=clientClass)]

Create a method to instantiate the [TextAnalyticsClient](/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.textanalyticsclient) object with your endpoint and a `ApiKeyServiceClientCredentials` object containing your key.

[!code-csharp[Client authentication](~/cognitive-services-dotnet-sdk-samples/samples/TextAnalytics/synchronous/Program.cs?name=authentication)]

---

## Sentiment analysis

# [Version 3.1 preview](#tab/version-3-1)

Create a new function called `SentimentAnalysisExample()` that takes the client that you created earlier, and call its `AnalyzeSentiment()` function. The returned `Response<DocumentSentiment>` object will contain the sentiment label and score of the entire input document, as well as a sentiment analysis for each sentence if successful. If there was an error, it will throw a `RequestFailedException`.

```csharp
static void SentimentAnalysisExample(TextAnalyticsClient client)
{
    string inputText = "I had the best day of my life. I wish you were there with me.";
    DocumentSentiment documentSentiment = client.AnalyzeSentiment(inputText);
    Console.WriteLine($"Document sentiment: {documentSentiment.Sentiment}\n");

    foreach (var sentence in documentSentiment.Sentences)
    {
        Console.WriteLine($"\tText: \"{sentence.Text}\"");
        Console.WriteLine($"\tSentence sentiment: {sentence.Sentiment}");
        Console.WriteLine($"\tPositive score: {sentence.ConfidenceScores.Positive:0.00}");
        Console.WriteLine($"\tNegative score: {sentence.ConfidenceScores.Negative:0.00}");
        Console.WriteLine($"\tNeutral score: {sentence.ConfidenceScores.Neutral:0.00}\n");
    }
}
```

### Output

```console
Document sentiment: Positive

        Text: "I had the best day of my life."
        Sentence sentiment: Positive
        Positive score: 1.00
        Negative score: 0.00
        Neutral score: 0.00

        Text: "I wish you were there with me."
        Sentence sentiment: Neutral
        Positive score: 0.21
        Negative score: 0.02
        Neutral score: 0.77
```

### Opinion mining

Create a new function called `SentimentAnalysisWithOpinionMiningExample()` that takes the client that you created earlier, and call its `AnalyzeSentimentBatch()` function with `AdditionalSentimentAnalyses.OpinionMining` option. The returned `AnalyzeSentimentResultCollection` object will contain the collection of `AnalyzeSentimentResult` in which represents `Response<DocumentSentiment>`. The difference between `SentimentAnalysis()` and `SentimentAnalysisWithOpinionMiningExample()` is that the latter will contain `MinedOpinion` in each sentence, which shows an analyzed aspect and the related opinion(s). If there was an error, it will throw a `RequestFailedException`.

```csharp
static void SentimentAnalysisWithOpinionMiningExample(TextAnalyticsClient client)
{
    var documents = new List<string>
    {
        "The food and service were unacceptable, but the concierge were nice.",
        "The rooms were beautiful. The AC was good and quiet.",
        "The breakfast was good, but the toilet was smelly.",
        "Loved this hotel - good breakfast - nice shuttle service - clean rooms.",
        "I had a great unobstructed view of the Microsoft campus.",
        "Nice rooms but bathrooms were old and the toilet was dirty when we arrived.",
        "We changed rooms as the toilet smelled."
    };

    AnalyzeSentimentResultCollection reviews = client.AnalyzeSentimentBatch(documents, options: new AnalyzeSentimentOptions()
    {
        AdditionalSentimentAnalyses = AdditionalSentimentAnalyses.OpinionMining
    });

    foreach (AnalyzeSentimentResult review in reviews)
    {
        Console.WriteLine($"Document sentiment: {review.DocumentSentiment.Sentiment}\n");
        foreach (SentenceSentiment sentence in review.DocumentSentiment.Sentences)
        {
            Console.WriteLine($"\tText: \"{sentence.Text}\"");
            Console.WriteLine($"\tSentence sentiment: {sentence.Sentiment}");
            Console.WriteLine($"\tPositive score: {sentence.ConfidenceScores.Positive:0.00}");
            Console.WriteLine($"\tNegative score: {sentence.ConfidenceScores.Negative:0.00}");
            Console.WriteLine($"\tNeutral score: {sentence.ConfidenceScores.Neutral:0.00}\n");

            foreach (MinedOpinion minedOpinion in sentence.MinedOpinions)
            {
                Console.WriteLine($"\tAspect: {minedOpinion.Aspect.Text}, Value: {minedOpinion.Aspect.Sentiment}");
                foreach (OpinionSentiment opinion in minedOpinion.Opinions)
                {
                    Console.WriteLine($"\t\tRelated Opinion: {opinion.Text}, Value: {opinion.Sentiment}");
                }
            }
        }
        Console.WriteLine($"\n");
    }
}
```

### Output

```console
Document sentiment: Positive

        Text: "The food and service were unacceptable, but the concierge were nice."
        Sentence sentiment: Positive
        Positive score: 0.84
        Negative score: 0.16
        Neutral score: 0.00

        Aspect: food, Value: Negative
                Related Opinion: unacceptable, Value: Negative
        Aspect: service, Value: Negative
                Related Opinion: unacceptable, Value: Negative
        Aspect: concierge, Value: Positive
                Related Opinion: nice, Value: Positive


Document sentiment: Positive

        Text: "The rooms were beautiful."
        Sentence sentiment: Positive
        Positive score: 1.00
        Negative score: 0.00
        Neutral score: 0.00

        Aspect: rooms, Value: Positive
                Related Opinion: beautiful, Value: Positive
        Text: "The AC was good and quiet."
        Sentence sentiment: Positive
        Positive score: 1.00
        Negative score: 0.00
        Neutral score: 0.00

        Aspect: AC, Value: Positive
                Related Opinion: good, Value: Positive
                Related Opinion: quiet, Value: Positive


Document sentiment: Negative

        Text: "The breakfast was good, but the toilet was smelly."
        Sentence sentiment: Negative
        Positive score: 0.01
        Negative score: 0.99
        Neutral score: 0.00

        Aspect: breakfast, Value: Positive
                Related Opinion: good, Value: Positive
        Aspect: toilet, Value: Negative
                Related Opinion: smelly, Value: Negative


Document sentiment: Positive

        Text: "Loved this hotel - good breakfast - nice shuttle service - clean rooms."
        Sentence sentiment: Positive
        Positive score: 1.00
        Negative score: 0.00
        Neutral score: 0.00

        Aspect: hotel, Value: Positive
                Related Opinion: good, Value: Positive
        Aspect: breakfast, Value: Positive
                Related Opinion: nice, Value: Positive
        Aspect: shuttle service, Value: Positive
                Related Opinion: loved, Value: Positive
        Aspect: rooms, Value: Positive
                Related Opinion: good, Value: Positive
                Related Opinion: nice, Value: Positive
                Related Opinion: clean, Value: Positive
                Related Opinion: loved, Value: Positive


Document sentiment: Positive

        Text: "I had a great unobstructed view of the Microsoft campus."
        Sentence sentiment: Positive
        Positive score: 1.00
        Negative score: 0.00
        Neutral score: 0.00

        Aspect: view, Value: Positive
                Related Opinion: great, Value: Positive
                Related Opinion: unobstructed, Value: Positive


Document sentiment: Negative

        Text: "Nice rooms but bathrooms were old and the toilet was dirty when we arrived."
        Sentence sentiment: Negative
        Positive score: 0.00
        Negative score: 1.00
        Neutral score: 0.00

        Aspect: rooms, Value: Positive
                Related Opinion: nice, Value: Positive
        Aspect: bathrooms, Value: Negative
                Related Opinion: old, Value: Negative
        Aspect: toilet, Value: Negative
                Related Opinion: dirty, Value: Negative


Document sentiment: Neutral

        Text: "We changed rooms as the toilet smelled."
        Sentence sentiment: Neutral
        Positive score: 0.01
        Negative score: 0.03
        Neutral score: 0.96

        Aspect: rooms, Value: Negative
                Related Opinion: smelled, Value: Negative
        Aspect: toilet, Value: Negative
                Related Opinion: smelled, Value: Negative
```

# [Version 3.0](#tab/version-3)

Create a new function called `SentimentAnalysisExample()` that takes the client that you created earlier, and call its `AnalyzeSentiment()` function. The returned `Response<DocumentSentiment>` object will contain the sentiment label and score of the entire input document, as well as a sentiment analysis for each sentence if successful. If there was an error, it will throw a `RequestFailedException`.

```csharp
static void SentimentAnalysisExample(TextAnalyticsClient client)
{
    string inputText = "I had the best day of my life. I wish you were there with me.";
    DocumentSentiment documentSentiment = client.AnalyzeSentiment(inputText);
    Console.WriteLine($"Document sentiment: {documentSentiment.Sentiment}\n");

    foreach (var sentence in documentSentiment.Sentences)
    {
        Console.WriteLine($"\tText: \"{sentence.Text}\"");
        Console.WriteLine($"\tSentence sentiment: {sentence.Sentiment}");
        Console.WriteLine($"\tPositive score: {sentence.ConfidenceScores.Positive:0.00}");
        Console.WriteLine($"\tNegative score: {sentence.ConfidenceScores.Negative:0.00}");
        Console.WriteLine($"\tNeutral score: {sentence.ConfidenceScores.Neutral:0.00}\n");
    }
}
```

### Output

```console
Document sentiment: Positive

        Text: "I had the best day of my life."
        Sentence sentiment: Positive
        Positive score: 1.00
        Negative score: 0.00
        Neutral score: 0.00

        Text: "I wish you were there with me."
        Sentence sentiment: Neutral
        Positive score: 0.21
        Negative score: 0.02
        Neutral score: 0.77
```

# [Version 2.1](#tab/version-2)

Create a new function called `SentimentAnalysisExample()` that takes the client that you created earlier, and call its [Sentiment()](/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.textanalyticsclientextensions.sentiment) function. The returned [SentimentResult](/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.models.sentimentresult) object will contain the sentiment `Score` if successful, and an `errorMessage` if not. 

A score that's close to 0 indicates a negative sentiment, while a score that's closer to 1 indicates a positive sentiment.

[!code-csharp[Sentiment analysis](~/cognitive-services-dotnet-sdk-samples/samples/TextAnalytics/synchronous/Program.cs?name=sentiment)]

```console
Sentiment Score: 0.87
```

---

## Language detection

# [Version 3.1 preview](#tab/version-3-1)


Create a new function called `LanguageDetectionExample()` that takes the client that you created earlier, and call its  `DetectLanguage()` function. The returned `Response<DetectedLanguage>` object will contain the detected language along with its name and ISO-6391 code. If there was an error, it will throw a `RequestFailedException`.

> [!Tip]
> In some cases it may be hard to disambiguate languages based on the input. You can use the `countryHint` parameter to specify a 2-letter country/region code. By default the API is using the "US" as the default countryHint, to remove this behavior you can reset this parameter by setting this value to empty string `countryHint = ""`. To set a different default, set the `TextAnalyticsClientOptions.DefaultCountryHint` property and pass it during the client's initialization.

```csharp
static void LanguageDetectionExample(TextAnalyticsClient client)
{
    DetectedLanguage detectedLanguage = client.DetectLanguage("Ce document est rédigé en Français.");
    Console.WriteLine("Language:");
    Console.WriteLine($"\t{detectedLanguage.Name},\tISO-6391: {detectedLanguage.Iso6391Name}\n");
}
```

### Output

```console
Language:
        French, ISO-6391: fr
```

# [Version 3.0](#tab/version-3)


Create a new function called `LanguageDetectionExample()` that takes the client that you created earlier, and call its  `DetectLanguage()` function. The returned `Response<DetectedLanguage>` object will contain the detected language along with its name and ISO-6391 code. If there was an error, it will throw a `RequestFailedException`.

> [!Tip]
> In some cases it may be hard to disambiguate languages based on the input. You can use the `countryHint` parameter to specify a 2-letter country/region code. By default the API is using the "US" as the default countryHint, to remove this behavior you can reset this parameter by setting this value to empty string `countryHint = ""`. To set a different default, set the `TextAnalyticsClientOptions.DefaultCountryHint` property and pass it during the client's initialization.

```csharp
static void LanguageDetectionExample(TextAnalyticsClient client)
{
    DetectedLanguage detectedLanguage = client.DetectLanguage("Ce document est rédigé en Français.");
    Console.WriteLine("Language:");
    Console.WriteLine($"\t{detectedLanguage.Name},\tISO-6391: {detectedLanguage.Iso6391Name}\n");
}
```

### Output

```console
Language:
        French, ISO-6391: fr
```

# [Version 2.1](#tab/version-2)

Create a new function called `languageDetectionExample()` that takes the client that you created earlier, and call its  [DetectLanguage()](/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.textanalyticsclientextensions.detectlanguage#Microsoft_Azure_CognitiveServices_Language_TextAnalytics_TextAnalyticsClientExtensions_DetectLanguage_Microsoft_Azure_CognitiveServices_Language_TextAnalytics_ITextAnalyticsClient_System_String_System_String_System_Nullable_System_Boolean__System_Threading_CancellationToken_) function. The returned [LanguageResult](/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.models.languageresult) object will contain the list of detected languages in `DetectedLanguages` if successful, and an `errorMessage` if not. Print the first returned language.

> [!Tip]
> In some cases it may be hard to disambiguate languages based on the input. You can use the `countryHint` parameter to specify a 2-letter country/region code. By default the API is using the "US" as the default countryHint, to remove this behavior you can reset this parameter by setting this value to empty string `countryHint = ""` .

[!code-csharp[Language Detection example](~/cognitive-services-dotnet-sdk-samples/samples/TextAnalytics/synchronous/Program.cs?name=languageDetection)]

### Output

```console
Language: English
```

---

## Named Entity Recognition (NER)

# [Version 3.1 preview](#tab/version-3-1)


Create a new function called `EntityRecognitionExample()` that takes the client that you created earlier, call its `RecognizeEntities()` function and iterate through the results. The returned `Response<CategorizedEntityCollection>` object will contain the collection of detected entities `CategorizedEntity`. If there was an error, it will throw a `RequestFailedException`.

```csharp
static void EntityRecognitionExample(TextAnalyticsClient client)
{
    var response = client.RecognizeEntities("I had a wonderful trip to Seattle last week.");
    Console.WriteLine("Named Entities:");
    foreach (var entity in response.Value)
    {
        Console.WriteLine($"\tText: {entity.Text},\tCategory: {entity.Category},\tSub-Category: {entity.SubCategory}");
        Console.WriteLine($"\t\tScore: {entity.ConfidenceScore:F2},\tLength: {entity.Length},\tOffset: {entity.Offset}\n");
    }
}
```

### Output

```console
Named Entities:
        Text: trip,     Category: Event,        Sub-Category:
                Score: 0.61,    Length: 4,      Offset: 18

        Text: Seattle,  Category: Location,     Sub-Category: GPE
                Score: 0.82,    Length: 7,      Offset: 26

        Text: last week,        Category: DateTime,     Sub-Category: DateRange
                Score: 0.80,    Length: 9,      Offset: 34
```

### Entity linking

Create a new function called `EntityLinkingExample()` that takes the client that you created earlier, call its `RecognizeLinkedEntities()` function and iterate through the results. The returned `Response<LinkedEntityCollection>` object will contain the collection of detected entities `LinkedEntity`. If there was an error, it will throw a `RequestFailedException`. Since linked entities are uniquely identified, occurrences of the same entity are grouped under a `LinkedEntity` object as a list of `LinkedEntityMatch` objects.

```csharp
static void EntityLinkingExample(TextAnalyticsClient client)
{
    var response = client.RecognizeLinkedEntities(
        "Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, " +
        "to develop and sell BASIC interpreters for the Altair 8800. " +
        "During his career at Microsoft, Gates held the positions of chairman, " +
        "chief executive officer, president and chief software architect, " +
        "while also being the largest individual shareholder until May 2014.");
    Console.WriteLine("Linked Entities:");
    foreach (var entity in response.Value)
    {
        Console.WriteLine($"\tName: {entity.Name},\tID: {entity.DataSourceEntityId},\tURL: {entity.Url}\tData Source: {entity.DataSource}");
        Console.WriteLine("\tMatches:");
        foreach (var match in entity.Matches)
        {
            Console.WriteLine($"\t\tText: {match.Text}");
            Console.WriteLine($"\t\tScore: {match.ConfidenceScore:F2}");
            Console.WriteLine($"\t\tLength: {match.Length}");
            Console.WriteLine($"\t\tOffset: {match.Offset}\n");
        }
    }
}
```

### Output

```console
Linked Entities:
        Name: Microsoft,        ID: Microsoft,  URL: https://en.wikipedia.org/wiki/Microsoft    Data Source: Wikipedia
        Matches:
                Text: Microsoft
                Score: 0.55
                Length: 9
                Offset: 0

                Text: Microsoft
                Score: 0.55
                Length: 9
                Offset: 150

        Name: Bill Gates,       ID: Bill Gates, URL: https://en.wikipedia.org/wiki/Bill_Gates   Data Source: Wikipedia
        Matches:
                Text: Bill Gates
                Score: 0.63
                Length: 10
                Offset: 25

                Text: Gates
                Score: 0.63
                Length: 5
                Offset: 161

        Name: Paul Allen,       ID: Paul Allen, URL: https://en.wikipedia.org/wiki/Paul_Allen   Data Source: Wikipedia
        Matches:
                Text: Paul Allen
                Score: 0.60
                Length: 10
                Offset: 40

        Name: April 4,  ID: April 4,    URL: https://en.wikipedia.org/wiki/April_4      Data Source: Wikipedia
        Matches:
                Text: April 4
                Score: 0.32
                Length: 7
                Offset: 54

        Name: BASIC,    ID: BASIC,      URL: https://en.wikipedia.org/wiki/BASIC        Data Source: Wikipedia
        Matches:
                Text: BASIC
                Score: 0.33
                Length: 5
                Offset: 89

        Name: Altair 8800,      ID: Altair 8800,        URL: https://en.wikipedia.org/wiki/Altair_8800  Data Source: Wikipedia
        Matches:
                Text: Altair 8800
                Score: 0.88
                Length: 11
                Offset: 116
```

### Personally Identifiable Information recognition

Create a new function called `RecognizePIIExample()` that takes the client that you created earlier, call its `RecognizePiiEntities()` function and iterate through the results. The returned `PiiEntityCollection` represents the list of detected PII entities. If there was an error, it will throw a `RequestFailedException`.

```csharp
static void RecognizePIIExample(TextAnalyticsClient client)
{
    string document = "A developer with SSN 859-98-0987 whose phone number is 800-102-1100 is building tools with our APIs.";

    PiiEntityCollection entities = client.RecognizePiiEntities(document).Value;

    Console.WriteLine($"Redacted Text: {entities.RedactedText}");
    if (entities.Count > 0)
    {
        Console.WriteLine($"Recognized {entities.Count} PII entit{(entities.Count > 1 ? "ies" : "y")}:");
        foreach (PiiEntity entity in entities)
        {
            Console.WriteLine($"Text: {entity.Text}, Category: {entity.Category}, SubCategory: {entity.SubCategory}, Confidence score: {entity.ConfidenceScore}");
        }
    }
    else
    {
        Console.WriteLine("No entities were found.");
    }
}
```

### Output

```console
Redacted Text: A developer with SSN *********** whose phone number is ************ is building tools with our APIs.
Recognized 2 PII entities:
Text: 859-98-0987, Category: U.S. Social Security Number (SSN), SubCategory: , Confidence score: 0.65
Text: 800-102-1100, Category: Phone Number, SubCategory: , Confidence score: 0.8
```

# [Version 3.0](#tab/version-3)


> [!NOTE]
> New in version `3.0`:
> * Entity linking is now a separated from entity recognition.


Create a new function called `EntityRecognitionExample()` that takes the client that you created earlier, call its `RecognizeEntities()` function and iterate through the results. The returned `Response<IReadOnlyCollection<CategorizedEntity>>` object will contain the list of detected entities. If there was an error, it will throw a `RequestFailedException`.

```csharp
static void EntityRecognitionExample(TextAnalyticsClient client)
{
    var response = client.RecognizeEntities("I had a wonderful trip to Seattle last week.");
    Console.WriteLine("Named Entities:");
    foreach (var entity in response.Value)
    {
        Console.WriteLine($"\tText: {entity.Text},\tCategory: {entity.Category},\tSub-Category: {entity.SubCategory}");
        Console.WriteLine($"\t\tScore: {entity.ConfidenceScore:F2}\n");
    }
}
```

### Output

```console
Named Entities:
        Text: trip,     Category: Event,        Sub-Category:
                Score: 0.61

        Text: Seattle,  Category: Location,     Sub-Category: GPE
                Score: 0.82

        Text: last week,        Category: DateTime,     Sub-Category: DateRange
                Score: 0.80
```

### Entity linking

Create a new function called `EntityLinkingExample()` that takes the client that you created earlier, call its `RecognizeLinkedEntities()` function and iterate through the results. The returned `Response<IReadOnlyCollection<LinkedEntity>>` represents the list of detected entities. If there was an error, it will throw a `RequestFailedException`. Since linked entities are uniquely identified, occurrences of the same entity are grouped under a `LinkedEntity` object as a list of `LinkedEntityMatch` objects.

```csharp
static void EntityLinkingExample(TextAnalyticsClient client)
{
    var response = client.RecognizeLinkedEntities(
        "Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, " +
        "to develop and sell BASIC interpreters for the Altair 8800. " +
        "During his career at Microsoft, Gates held the positions of chairman, " +
        "chief executive officer, president and chief software architect, " +
        "while also being the largest individual shareholder until May 2014.");
    Console.WriteLine("Linked Entities:");
    foreach (var entity in response.Value)
    {
        Console.WriteLine($"\tName: {entity.Name},\tID: {entity.DataSourceEntityId},\tURL: {entity.Url}\tData Source: {entity.DataSource}");
        Console.WriteLine("\tMatches:");
        foreach (var match in entity.Matches)
        {
            Console.WriteLine($"\t\tText: {match.Text}");
            Console.WriteLine($"\t\tScore: {match.ConfidenceScore:F2}\n");
        }
    }
}
```

### Output

```console
Linked Entities:
        Name: Altair 8800,      ID: Altair 8800,        URL: https://en.wikipedia.org/wiki/Altair_8800  Data Source: Wikipedia
        Matches:
                Text: Altair 8800
                Score: 0.88

        Name: Bill Gates,       ID: Bill Gates, URL: https://en.wikipedia.org/wiki/Bill_Gates   Data Source: Wikipedia
        Matches:
                Text: Bill Gates
                Score: 0.63

                Text: Gates
                Score: 0.63

        Name: Paul Allen,       ID: Paul Allen, URL: https://en.wikipedia.org/wiki/Paul_Allen   Data Source: Wikipedia
        Matches:
                Text: Paul Allen
                Score: 0.60

        Name: Microsoft,        ID: Microsoft,  URL: https://en.wikipedia.org/wiki/Microsoft    Data Source: Wikipedia
        Matches:
                Text: Microsoft
                Score: 0.55

                Text: Microsoft
                Score: 0.55

        Name: April 4,  ID: April 4,    URL: https://en.wikipedia.org/wiki/April_4      Data Source: Wikipedia
        Matches:
                Text: April 4
                Score: 0.32

        Name: BASIC,    ID: BASIC,      URL: https://en.wikipedia.org/wiki/BASIC        Data Source: Wikipedia
        Matches:
                Text: BASIC
                Score: 0.33
```

# [Version 2.1](#tab/version-2)

> [!NOTE]
> In version 2.1, entity linking is included in the NER response.

Create a new function called `RecognizeEntitiesExample()` that takes the client that you created earlier, and call its [Entities()](/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.textanalyticsclientextensions.entities#Microsoft_Azure_CognitiveServices_Language_TextAnalytics_TextAnalyticsClientExtensions_Entities_Microsoft_Azure_CognitiveServices_Language_TextAnalytics_ITextAnalyticsClient_System_String_System_String_System_Nullable_System_Boolean__System_Threading_CancellationToken_) function. Iterate through the results. The returned [EntitiesResult](/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.models.entitiesresult) object will contain the list of detected entities in `Entities` if successful, and an `errorMessage` if not. For each detected entity, print its Type, Sub-Type, Wikipedia name (if they exist) as well as the locations in the original text.

[!code-csharp[Entity Recognition example](~/cognitive-services-dotnet-sdk-samples/samples/TextAnalytics/synchronous/Program.cs?name=entityRecognition)]

--- 


### Key phrase extraction

# [Version 3.1 preview](#tab/version-3-1)

Create a new function called `KeyPhraseExtractionExample()` that takes the client that you created earlier, and call its `ExtractKeyPhrases()` function. The returned `<Response<KeyPhraseCollection>` object will contain the list of detected key phrases. If there was an error, it will throw a `RequestFailedException`.

```csharp
static void KeyPhraseExtractionExample(TextAnalyticsClient client)
{
    var response = client.ExtractKeyPhrases("My cat might need to see a veterinarian.");

    // Printing key phrases
    Console.WriteLine("Key phrases:");

    foreach (string keyphrase in response.Value)
    {
        Console.WriteLine($"\t{keyphrase}");
    }
}
```

### Output

```console
Key phrases:
    cat
    veterinarian
```

# [Version 3.0](#tab/version-3)

Create a new function called `KeyPhraseExtractionExample()` that takes the client that you created earlier, and call its `ExtractKeyPhrases()` function. The returned `<Response<IReadOnlyCollection<string>>` object will contain the list of detected key phrases. If there was an error, it will throw a `RequestFailedException`.

```csharp
static void KeyPhraseExtractionExample(TextAnalyticsClient client)
{
    var response = client.ExtractKeyPhrases("My cat might need to see a veterinarian.");

    // Printing key phrases
    Console.WriteLine("Key phrases:");

    foreach (string keyphrase in response.Value)
    {
        Console.WriteLine($"\t{keyphrase}");
    }
}
```

### Output

```console
Key phrases:
    cat
    veterinarian
```

# [Version 2.1](#tab/version-2)

Create a new function called `KeyPhraseExtractionExample()` that takes the client that you created earlier and call its [KeyPhrases()](/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.textanalyticsclientextensions.keyphrases#Microsoft_Azure_CognitiveServices_Language_TextAnalytics_TextAnalyticsClientExtensions_KeyPhrases_Microsoft_Azure_CognitiveServices_Language_TextAnalytics_ITextAnalyticsClient_System_String_System_String_System_Nullable_System_Boolean__System_Threading_CancellationToken_) function. The result will contain the list of detected key phrases in `KeyPhrases` if successful, and an `errorMessage` if not. Print any detected key phrases.

[!code-csharp[Key phrase extraction example](~/cognitive-services-dotnet-sdk-samples/samples/TextAnalytics/synchronous/Program.cs?name=keyPhraseExtraction)]


### Output

```console
Key phrases:
    cat
    veterinarian
```

---