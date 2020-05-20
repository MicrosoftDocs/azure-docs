---
title: "Quickstart: Text Analytics client library for Go | Microsoft Docs"
titleSuffix: Azure Cognitive Services
description: In this quickstart, detect language by using the Go Text Analytics client library from Azure Cognitive Services.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: quickstart
ms.date: 02/26/2020
ms.author: aahi
---

# Quickstart: Use the Text Analytics client library for Go

[Reference documentation](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/textanalytics) | [Library source code](https://github.com/Azure/azure-sdk-for-go/blob/090dc0ee4d8d2d60e2a9525774d967a4111a2b0c/services/cognitiveservices/v2.1/textanalytics/client.go) | [Package (GitHub)](https://github.com/Azure/azure-sdk-for-go/tree/master/services/cognitiveservices/v2.1/textanalytics) | [Samples](https://github.com/Azure-Samples/cognitive-services-quickstart-code)

> [!NOTE]
> This quickstart only applies to Text Analytics version 2.1. Currently, a v3 client library for Go is unavailable.

## Prerequisites

* An Azure subscription - [create one for free](https://azure.microsoft.com/free/)
* The latest version of [Go](https://golang.org/dl/)
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Text Analytics resource"  target="_blank">create a Text Analytics resource <span class="docon docon-navigate-external x-hidden-focus"></span></a> in the Azure portal to get your key and endpoint. 
    * You will need the key and endpoint from the resource you create to connect your application to the Text Analytics API. You'll do this later in the quickstart.
    * You can use the free pricing tier to try the service, and upgrade later to a paid tier for production.

## Setting up

### Create a new Go project

In a console window (cmd, PowerShell, Terminal, Bash), create a new workspace for your Go project and navigate to it. Your workspace will contain three folders: 

* **src** - This directory contains source code and packages. Any packages installed with the `go get` command will reside here.
* **pkg** - This directory contains the compiled Go package objects. These files all have an `.a` extension.
* **bin** - This directory contains the binary executable files that are created when you run `go install`.

> [!TIP]
> Learn more about the structure of a [Go workspace](https://golang.org/doc/code.html#Workspaces). This guide includes information for setting `$GOPATH` and `$GOROOT`.

Create a workspace called `my-app` and the required sub directories for `src`, `pkg`, and `bin`:

```console
$ mkdir -p my-app/{src, bin, pkg}  
$ cd my-app
```

### Install the Text Analytics client library for Go

Install the client library for Go: 

```console
$ go get -u <https://github.com/Azure/azure-sdk-for-go/tree/master/services/cognitiveservices/v2.1/textanalytics>
```

or if you use dep, within your repo run:

```console
$ dep ensure -add <https://github.com/Azure/azure-sdk-for-go/tree/master/services/cognitiveservices/v2.1/textanalytics>
```

### Create your Go application

Next, create a file named `src/quickstart.go`:

```bash
$ cd src
$ touch quickstart.go
```

Open `quickstart.go` in your favorite IDE or text editor. Then add the package name and import the following libraries:

[!code-go[Import statements](~/azure-sdk-for-go-samples/cognitiveservices/textanalytics.go?name=imports)]

## Object model 

The Text Analytics client is a [BaseClient](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/textanalytics#New) object that authenticates to Azure using your key. The client provides several methods for analyzing text, as a single string, or a batch. 

Text is sent to the API as a list of `documents`, which are `dictionary` objects containing a combination of `id`, `text`, and `language` attributes depending on the method used. The `text` attribute stores the text to be analyzed in the origin `language`, and the `id` can be any value. 

The response object is a list containing the analysis information for each document. 

## Code examples

These code snippets show you how to do the following with the Text Analytics client library for Go:

* [Authenticate the client](#authenticate-the-client)
* [Sentiment Analysis](#sentiment-analysis)
* [Language detection](#language-detection)
* [Entity recognition](#entity-recognition)
* [Key phrase extraction](#key-phrase-extraction)

## Authenticate the client


In a new function, create variables for your resource's Azure endpoint and subscription key.

[!INCLUDE [text-analytics-find-resource-information](../includes/find-azure-resource-info.md)]

Create a new [BaseClient](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/textanalytics#New) object. Pass your key to the [autorest.NewCognitiveServicesAuthorizer()](https://godoc.org/github.com/Azure/go-autorest/autorest#NewCognitiveServicesAuthorizer) function, which will then be passed to the client's `authorizer` property.

```go
func GetTextAnalyticsClient() textanalytics.BaseClient {
    var key string = "<paste-your-text-analytics-key-here>"
    var endpoint string = "<paste-your-text-analytics-endpoint-here>"

    textAnalyticsClient := textanalytics.New(endpoint)
    textAnalyticsClient.Authorizer = autorest.NewCognitiveServicesAuthorizer(key)

    return textAnalyticsClient
}
```

## Sentiment analysis

Create a new function called `SentimentAnalysis()` and create a client using the `GetTextAnalyticsClient()` method created earlier. Create a list of [MultiLanguageInput](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/textanalytics#MultiLanguageBatchInput) objects, containing the documents you want to analyze. Each object will contain an `id`, `Language` and a `text` attribute. The `text` attribute stores the text to be analyzed, `language` is the language of the document, and the `id` can be any value. 

Call the client's [Sentiment()](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/textanalytics#BaseClient.Sentiment) function and get the result. Then iterate through the results, and print each document's ID, and sentiment score. A score closer to 0 indicates a negative sentiment, while a score closer to 1 indicates a positive sentiment.

[!code-go[Sentiment analysis sample](~/azure-sdk-for-go-samples/cognitiveservices/textanalytics.go?name=sentimentAnalysis)]

call `SentimentAnalysis()` in your project.

### Output

```console
Document ID: 1 , Sentiment Score: 0.87
Document ID: 2 , Sentiment Score: 0.11
Document ID: 3 , Sentiment Score: 0.44
Document ID: 4 , Sentiment Score: 1.00
```

## Language detection

Create a new function called `LanguageDetection()` and create a client using the `GetTextAnalyticsClient()` method created earlier. Create a list of [LanguageInput](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/textanalytics#LanguageInput) objects, containing the documents you want to analyze. Each object will contain an `id` and a `text` attribute. The `text` attribute stores the text to be analyzed, and the `id` can be any value. 

Call the client's [DetectLanguage()](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/textanalytics#BaseClient.DetectLanguage) and get the result. Then iterate through the results, and print each document's ID, and detected language.

[!code-go[Language detection sample](~/azure-sdk-for-go-samples/cognitiveservices/textanalytics.go?name=languageDetection)]

Call `LanguageDetection()` in your project.

### Output

```console
Document ID: 0 , Language: English 
Document ID: 1 , Language: Spanish
Document ID: 2 , Language: Chinese_Simplified
```

## Entity recognition

Create a new function called `ExtractEntities()` and create a client using the `GetTextAnalyticsClient()` method created earlier. Create a list of [MultiLanguageInput](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/textanalytics#MultiLanguageBatchInput) objects, containing the documents you want to analyze. Each object will contain an `id`, `language`, and a `text` attribute. The `text` attribute stores the text to be analyzed, `language` is the language of the document, and the `id` can be any value. 

Call the client's [Entities()](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/textanalytics#BaseClient.Entities) and get the result. Then iterate through the results, and print each document's ID, and extracted entities score.

[!code-go[entity recognition sample](~/azure-sdk-for-go-samples/cognitiveservices/textanalytics.go?name=entityRecognition)]

call `ExtractEntities()` in your project.

### Output

```console
Document ID: 1
    Name: Microsoft,        Type: Organization,     Sub-Type: N/A
    Offset: 0, Length: 9,   Score: 1.0
    Name: Bill Gates,       Type: Person,   Sub-Type: N/A
    Offset: 25, Length: 10, Score: 0.999847412109375
    Name: Paul Allen,       Type: Person,   Sub-Type: N/A
    Offset: 40, Length: 10, Score: 0.9988409876823425
    Name: April 4,  Type: Other,    Sub-Type: N/A
    Offset: 54, Length: 7,  Score: 0.8
    Name: April 4, 1975,    Type: DateTime, Sub-Type: Date
    Offset: 54, Length: 13, Score: 0.8
    Name: BASIC,    Type: Other,    Sub-Type: N/A
    Offset: 89, Length: 5,  Score: 0.8
    Name: Altair 8800,      Type: Other,    Sub-Type: N/A
    Offset: 116, Length: 11,        Score: 0.8

Document ID: 2
    Name: Microsoft,        Type: Organization,     Sub-Type: N/A
    Offset: 21, Length: 9,  Score: 0.999755859375
    Name: Redmond (Washington),     Type: Location, Sub-Type: N/A
    Offset: 60, Length: 7,  Score: 0.9911284446716309
    Name: 21 kilómetros,    Type: Quantity, Sub-Type: Dimension
    Offset: 71, Length: 13, Score: 0.8
    Name: Seattle,  Type: Location, Sub-Type: N/A
    Offset: 88, Length: 7,  Score: 0.9998779296875
```

## Key phrase extraction

Create a new function called `ExtractKeyPhrases()` and create a client using the `GetTextAnalyticsClient()` method created earlier. Create a list of [MultiLanguageInput](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/textanalytics#MultiLanguageBatchInput) objects, containing the documents you want to analyze. Each object will contain an `id`, `language`, and a `text` attribute. The `text` attribute stores the text to be analyzed, `language` is the language of the document, and the `id` can be any value.

Call the client's [KeyPhrases()](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/textanalytics#BaseClient.KeyPhrases) and get the result. Then iterate through the results, and print each document's ID, and extracted key phrases.

[!code-go[key phrase extraction sample](~/azure-sdk-for-go-samples/cognitiveservices/textanalytics.go?name=keyPhrases)]

Call `ExtractKeyPhrases()` in your project.

### Output

```console
Document ID: 1
         Key phrases:
                幸せ
Document ID: 2
         Key phrases:
                Stuttgart
                Hotel
                Fahrt
                Fu
Document ID: 3
         Key phrases:
                cat
                veterinarian
Document ID: 4
         Key phrases:
                fútbol
```
