---
title: 'Quickstart: Text Analytics client library for .NET | Microsoft Docs'
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
# Quickstart: Text analytics client library for .NET
<a name="HOLTop"></a>

Get started with the Text Analytics client library for .NET. Follow these steps to install the package and try out the example code for basic tasks. 

Use the Text Analytics client library for Python to perform:

* Sentiment analysis
* Language detection
* Entity recognition
* Key phrase extraction

[Reference documentation](https://docs.microsoft.com/en-us/dotnet/api/overview/azure/cognitiveservices/client/textanalytics?view=azure-dotnet-preview) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Language.TextAnalytics) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Language.TextAnalytics/) | [Samples](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples)

> [!NOTE] The demo code in this article uses the synchronous methods of the Text Analytics .NET SDK for simplicity. However, for production scenarios, we recommend using the batched asynchronous methods in your own applications to keep them scalable and responsive. For example, you could use SentimentBatchAsync instead of Sentiment.

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* The current version of the [.NET Core SDK](https://dotnet.microsoft.com/download/dotnet-core).

## Setting up

### Create a Text Analytics Azure resource

Azure Cognitive Services are represented by Azure resources that you subscribe to. Create a resource for [Product name] using the [Azure portal](../../cognitive-services-apis-create-account.md) or [Azure CLI](../../cognitive-services-apis-create-account-cli.md) on your local machine. You can also:

* Get a [trial key](https://azure.microsoft.com/try/cognitive-services/#decision) valid for 7 days for free. After signing up it will be available on the [Azure website](https://azure.microsoft.com/try/cognitive-services/my-apis/).  
* View your resource on the [Azure Portal](https://portal.azure.com/)

After you get a key from your trial subscription or resource, [create an environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the key, named `TEXTANALYTICS_SUBSCRIPTION_KEY`.

### Create a new C# application

Create a new .NET Core application in your preferred editor or IDE. 

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `text-analytics quickstart`. This command creates a simple "Hello World" C# project with a single source file: *program.cs*. 

```console
dotnet new console -n text-analytics-quickstart
```

Change your directory to the newly created app folder. You can build the application with:

```console
dotnet build
```

The build output should contain no warnings or errors. 

```console
...
Build succeeded.
 0 Warning(s)
 0 Error(s)
...
```

From the project directory, open the *program.cs* file in your preferred editor or IDE. Add the following `using` directives:

[!code-csharp[import declarations](~/cognitive-services-dotnet-sdk-samples/samples/language/Program.cs?name=imports)]

In the application's `Main` method, create variables for your resource's Azure endpoint and key. If you created the environment variable after you launched the application, you will need to close and reopen the editor, IDE, or shell running it to access the variable. You will define the methods later. Call the sample methods that you want to invoke. 

[!code-csharp[main method](~/cognitive-services-dotnet-sdk-samples/samples/language/Program.cs?name=main)]

### Install the client library

Within the application directory, install the [Product Name] client library for .NET with the following command:

```console
dotnet add package Microsoft.Azure.CognitiveServices.Language.TextAnalytics --version 4.0.0
```

If you're using the Visual Studio IDE, the client library is available as a downloadable NuGet package.

## Object model

TBD

## Code examples

* [Authenticate the client](#authenticate-the-client)
* [Sentiment Analysis](#sentiment-analysis)
* [Language detection](#language-detection)
* [Entity recognition](#entity-recognition)
* [Key phrase extraction](#key-phrase-extraction)

## Authenticate the client

Create a new `ApiKeyServiceClientCredentials` class to store the credentials and add them for each request.

[!code-csharp[Client class](~/cognitive-services-dotnet-sdk-samples/samples/language/Program.cs?name=client-class)]

## Sentiment analysis

Create a new function called `SentimentAnalysisExample()` that takes the client that you created earlier, and call its `Sentiment()` function. The result will contain the sentiment `Score` if successful, and an `errorMessage` if not. 

A score that's close to 0 indicates a negative sentiment, while a score that's closer to 1 indicates a positive sentiment.

[!code-csharp[Sentiment Analysis example](~/cognitive-services-dotnet-sdk-samples/samples/language/Program.cs?name=sentiment)]

### Output

```console
Sentiment Score: 0.87
```

## Language detection

Create a new function called `languageDetectionExample()` that takes the client that you created earlier, and call its  `DetectLanguage()` function. The result will contain the list of detected languages in `DetectedLanguages` if successful, and an `errorMessage` if not.  It'll then print the first returned language.

> [!Tip]
> In some cases it may be hard to disambiguate languages based on the input. You can use the `countryHint` parameter to specify a 2-letter country code. By default the API is using the "US" as the default countryHint, to remove this behavior you can reset this parameter by setting this value to empty string `countryHint = ""` .

[!code-csharp[Language Detection example](~/cognitive-services-dotnet-sdk-samples/samples/language/Program.cs?name=language-detection)]

### Output

```console
Language: English
```

## Entity recognition

Create a new function `RecognizeEntitiesExample()` that takes the client that you created earlier, and call its `Entities()` function. Iterate through the results. The result will contain the list of detected entities in `Entities` if successful, and an `errorMessage` if not. For each detected entity, print its Type, Sub-Type, Wikipedia name (if they exist) as well as the locations in the original text.

[!code-csharp[Entity Recognition example](~/cognitive-services-dotnet-sdk-samples/samples/language/Program.cs?name=language-detection)]

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
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples/blob/master/samples/language/text_analytics_samples.py).