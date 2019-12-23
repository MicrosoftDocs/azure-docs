---
author: aahill
ms.service: cognitive-services
ms.topic: include
ms.date: 01/08/2020
ms.author: assafi
---

<a name="HOLTop"></a>

<!-- these links are for v2. Make sure to update them to the correct v3 content on the same site where appropriate.-->
[Reference documentation](https://docs.microsoft.com/dotnet/api/overview/azure/cognitiveservices/client/textanalytics?view=azure-dotnet-preview) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Language.TextAnalytics) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Language.TextAnalytics/) | [Samples](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples)

> [!NOTE]
> The code in this article uses the synchronous methods of the Text Analytics .NET SDK as well as un-secured credentials use for simplicity reasons. For production scenarios, we recommend using the batched asynchronous methods for performance and scalability. For example, calling [SentimentBatchAsync()](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.textanalyticsclientextensions.sentimentbatchasync?view=azure-dotnet&viewFallbackFrom=azure-dotnet-preview) instead of [Sentiment()](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.textanalyticsclientextensions.sentiment?view=azure-dotnet). For secured use of credentials we recommend using Azure [Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/key-vault-overview) to store all access keys and the use of [AAD authentication](https://docs.microsoft.com/en-us/azure/cognitive-services/authentication#authenticate-with-azure-active-directory) for all role based access controls. **Remember to never store access keys in code.**

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* The [Visual Studio IDE](https://visualstudio.microsoft.com/vs/)

## Setting up

<!--
Add any extra steps preparing an environment for working with the client library. 
-->

### Create a Text Analytics Azure resource
<!-- NOTE
The below is an "include" file, which is a text file that will be referenced, and rendered on the docs site.
These files are used to display text across multiple articles at once. Consider keeping them in-place for consistency with other articles.
 -->

[!INCLUDE [text-analytics-resource-creation](resource-creation.md)]

### Create a new .NET Core application

Using the Visual Studio IDE, create a new .NET Core console app. This will create a simple "Hello World" project with a single C# source file: *program.cs*.

Install the client library by right-clicking on the solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse**, check **Include prerelease**, and search for `Azure.AI.TextAnalytics`. Click on it, and then **Install**. You can also use the [Package Manager Console](https://docs.microsoft.com/nuget/consume-packages/install-use-packages-powershell#find-and-install-a-package).

Open the *program.cs* file and add the following `using` directives:

```csharp
using System;
using Azure.AI.TextAnalytics;
```

In the application's `Program` class, create variables for your resource's key and endpoint.

[!INCLUDE [text-analytics-find-resource-information](../find-azure-resource-info.md)]

<!-- Use the below example variable names and example strings, for consistency with the other quickstart variables -->
```csharp
private static readonly string key = "<replace-with-your-text-analytics-key-here>";
private static readonly Uri endpoint = new Uri("<replace-with-your-text-analytics-endpoint-here>");
```

Replace the application's `Main` method. You will define the methods called here later.

```csharp
static void Main(string[] args)
{
    var client = new TextAnalyticsClient(endpoint, key);

    SentimentAnalysisExample(client);
    LanguageDetectionExample(client);
    KeyPhraseExtractionExample(client);
    EntityRecognitionExample(client);
    EntityLinkingExample(client);
    EntityPIIExample(client);

    Console.Write("Press any key to exit.");
    Console.ReadKey();
}
```

## Object model

<!-- 
    Briefly introduce and describe the functionality of the library's main classes. Include links to their reference pages. If needed, briefly explain the object hierarchy and how the classes work together to manipulate resources in the service.
-->

<!-- TODO: Update client docs link -->
The Text Analytics client is a [TextAnalyticsClient]() object that authenticates to Azure using your key, and provides functions to accept text as single strings or as a batch. You can send text to the API synchronously, or asynchronously. The response object will contain the analysis information for each document you send. An optional, `TextAnalyticsClientOptions` instance can be used to initialize the client with various default settings (e.g. default language or country hint).

<!-- TODO: Update samples link to deeper v3 link -->
Additional examples, including AAD authentication and the use of client default settings can be found [here](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples).

## Code examples
<!-- If you add more code examples, add a link to them here-->
* [Sentiment Analysis](#sentiment-analysis)
* [Language detection](#language-detection)
* [Entity recognition](#entity-recognition)
* [Entity recognition - PII](#entity-pii)
* [Key phrase extraction](#key-phrase-extraction)
* [Entity linking](#entity-linking)

In your program's `main()` method, call the authentication method to instantiate the client.

## Sentiment analysis

<!-- TODO: Update client docs links -->
Create a new function called `SentimentAnalysisExample()` that takes the client that you created earlier, and call its [AnalyzeSentiment()]() function. The returned [AnalyzeSentimentResult]() object will contain the sentiment label and score of the entire input document, as well as a sentiment analysis for each sentence.

A score that's close to 0 indicates a negative sentiment, while a score that's closer to 1 indicates a positive sentiment.

```csharp
static void sentimentAnalysisExample(ITextAnalyticsClient client)
{
    var response = client.AnalyzeSentiment("I had the best day of my life. I wish you were there with me.");
    Console.WriteLine($"Document sentiment: {response.Value.DocumentSentiment.SentimentClass}\n");
    foreach (var sentence in response.Value.SentenceSentiments)
    {
        Console.WriteLine($"Sentence [offset {sentence.Offset}, length {sentence.Length}]");
        Console.WriteLine($"Sentence sentiment: {sentence.SentimentClass}");
        Console.WriteLine($"Positive score: {sentence.PositiveScore:0.00}");
        Console.WriteLine($"Negative score: {sentence.NegativeScore:0.00}");
        Console.WriteLine($"Neutral score: {sentence.NeutralScore:0.00}\n");
    }
}
```

### Output

```console
Document sentiment: Positive

Sentence [offset 0, length 30]
Sentence sentiment: Positive
Positive score: 1.00
Negative score: 0.00
Neutral score: 0.00

Sentence [offset 31, length 30]
Sentence sentiment: Neutral
Positive score: 0.21
Negative score: 0.02
Neutral score: 0.77
```

## Language detection

Create a new function called `languageDetectionExample()` that takes the client that you created earlier, and call its  [DetectLanguage()](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.textanalyticsclientextensions.detectlanguage?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Language_TextAnalytics_TextAnalyticsClientExtensions_DetectLanguage_Microsoft_Azure_CognitiveServices_Language_TextAnalytics_ITextAnalyticsClient_System_String_System_String_System_Nullable_System_Boolean__System_Threading_CancellationToken_) function. The returned [LanguageResult](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.models.languageresult?view=azure-dotnet) object will contain the list of detected languages in `DetectedLanguages` if successful, and an `errorMessage` if not.  Print the first returned language.

> [!Tip]
> In some cases it may be hard to disambiguate languages based on the input. You can use the `countryHint` parameter to specify a 2-letter country code. By default the API is using the "US" as the default countryHint, to remove this behavior you can reset this parameter by setting this value to empty string `countryHint = ""` .

```csharp
static void languageDetectionExample(ITextAnalyticsClient client)
{
    var result = client.DetectLanguage("This is a document written in English.");
    Console.WriteLine($"Language: {result.DetectedLanguages[0].Name}");
}
```

### Output

```console
Language: English
```

## Entity recognition

Create a new function called `RecognizeEntitiesExample()` that takes the client that you created earlier, and call its [Entities()](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.textanalyticsclientextensions.entities?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Language_TextAnalytics_TextAnalyticsClientExtensions_Entities_Microsoft_Azure_CognitiveServices_Language_TextAnalytics_ITextAnalyticsClient_System_String_System_String_System_Nullable_System_Boolean__System_Threading_CancellationToken_) function. Iterate through the results. The returned [EntitiesResult](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.models.entitiesresult?view=azure-dotnet) object will contain the list of detected entities in `Entities` if successful, and an `errorMessage` if not. For each detected entity, print its Type, Sub-Type, Wikipedia name (if they exist) as well as the locations in the original text.

```csharp
static void entityRecognitionExample(ITextAnalyticsClient client)
{

    var result = client.Entities("Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800.");
    Console.WriteLine("Entities:");
    foreach (var entity in result.Entities)
    {
        Console.WriteLine($"\tName: {entity.Name},\tType: {entity.Type ?? "N/A"},\tSub-Type: {entity.SubType ?? "N/A"}");
        foreach (var match in entity.Matches)
        {
            Console.WriteLine($"\t\tOffset: {match.Offset},\tLength: {match.Length},\tScore: {match.EntityTypeScore:F3}");
        }
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

## Key phrase extraction

Create a new function called `KeyPhraseExtractionExample()` that takes the client that you created earlier and call its [KeyPhrases()](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.textanalyticsclientextensions.keyphrases?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Language_TextAnalytics_TextAnalyticsClientExtensions_KeyPhrases_Microsoft_Azure_CognitiveServices_Language_TextAnalytics_ITextAnalyticsClient_System_String_System_String_System_Nullable_System_Boolean__System_Threading_CancellationToken_) function. The result will contain the list of detected key phrases in `KeyPhrases` if successful, and an `errorMessage` if not. Print any detected key phrases.

```csharp
static void keyPhraseExtractionExample(TextAnalyticsClient client)
{
    var result = client.KeyPhrases("My cat might need to see a veterinarian.");

    // Printing key phrases
    Console.WriteLine("Key phrases:");

    foreach (string keyphrase in result.KeyPhrases)
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
