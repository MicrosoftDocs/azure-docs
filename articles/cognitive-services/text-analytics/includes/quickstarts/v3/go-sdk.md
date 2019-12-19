---
author: aahill
ms.service: cognitive-services
ms.topic: include
ms.date: 10/28/2019
ms.author: aahi
---

<!-- these links are for v2. Make sure to update them to the correct v3 content -->
[Reference documentation](https://docs.microsoft.com/python/api/overview/azure/cognitiveservices/textanalytics?view=azure-python) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cognitiveservices/azure-cognitiveservices-language-textanalytics) | [Package (Github)](https://github.com/Azure/azure-sdk-for-go/tree/master/services/cognitiveservices/v2.1/textanalytics) | [Samples](https://github.com/Azure-Samples/cognitive-services-quickstart-code)

## Prerequisites

* An Azure subscription - [create one for free](https://azure.microsoft.com/free/)
* The latest version of [Go](https://golang.org/dl/)

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

<!-- 
    Briefly introduce and describe the functionality of the library's main classes. Include links to their reference pages. If needed, briefly explain the object hierarchy and how the classes work together to manipulate resources in the service.
-->

The Text Analytics client is a [BaseClient](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/textanalytics#New) object that authenticates to Azure using your key. The client provides several methods for analyzing text, as a single string, or a batch. 

Text is sent to the API as a list of `documents`, which are `dictionary` objects containing a combination of `id`, `text`, and `language` attributes depending on the method used. The `text` attribute stores the text to be analyzed in the origin `language`, and the `id` can be any value. 

The response object is a list containing the analysis information for each document. 

## Code examples

These code snippets show you how to do the following with the Text Analytics client library for Python:
<!-- If you add more code examples, add a link to them here-->
* [Authenticate the client](#authenticate-the-client)
* [Sentiment Analysis](#sentiment-analysis)
* [Language detection](#language-detection)
* [Entity recognition](#entity-recognition)
* [Key phrase extraction](#key-phrase-extraction)

## Authenticate the client

In a new function, create variables for your resource's Azure endpoint and subscription key.

[!INCLUDE [text-analytics-find-resource-information](../find-azure-resource-info.md)]

Create a new [BaseClient](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/textanalytics#New) object. Pass your key to the [autorest.NewCognitiveServicesAuthorizer()](https://godoc.org/github.com/Azure/go-autorest/autorest#NewCognitiveServicesAuthorizer) function, which will then be passed to the client's `authorizer` property.

<!-- Use the below example key/endpoint variable names and example strings, for consistency with the other quickstart variables -->
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

```go
func SentimentAnalysis() {
    textAnalyticsclient := GetTextAnalyticsClient()
    ctx := context.Background()
    inputDocuments := []textanalytics.MultiLanguageInput{
        textanalytics.MultiLanguageInput{
            Language: to.StringPtr("en"),
            ID:       to.StringPtr("0"),
            Text:     to.StringPtr("I had the best day of my life."),
        },
        textanalytics.MultiLanguageInput{
            Language: to.StringPtr("en"),
            ID:       to.StringPtr("1"),
            Text:     to.StringPtr("This was a waste of my time. The speaker put me to sleep."),
        },
        textanalytics.MultiLanguageInput{
            Language: to.StringPtr("es"),
            ID:       to.StringPtr("2"),
            Text:     to.StringPtr("No tengo dinero ni nada que dar..."),
        },
        textanalytics.MultiLanguageInput{
            Language: to.StringPtr("it"),
            ID:       to.StringPtr("3"),
            Text:     to.StringPtr("L'hotel veneziano era meraviglioso. È un bellissimo pezzo di architettura."),
        },
    }

    batchInput := textanalytics.MultiLanguageBatchInput{Documents: &inputDocuments}
    result, _ := textAnalyticsclient.Sentiment(ctx, to.BoolPtr(false), &batchInput)
    batchResult := textanalytics.SentimentBatchResult{}
    jsonString, _ := json.Marshal(result.Value)
    json.Unmarshal(jsonString, &batchResult)

    // Printing sentiment results
    for _, document := range *batchResult.Documents {
        fmt.Printf("Document ID: %s ", *document.ID)
        fmt.Printf("Sentiment Score: %f\n", *document.Score)
    }

    // Printing document errors
    fmt.Println("Document Errors")
    for _, error := range *batchResult.Errors {
        fmt.Printf("Document ID: %s Message : %s\n", *error.ID, *error.Message)
    }
}
```

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

```go
func DetectLanguage() {
    textAnalyticsclient := GetTextAnalyticsClient()
    ctx := context.Background()
    inputDocuments := []textanalytics.LanguageInput{
        textanalytics.LanguageInput{
            ID:   to.StringPtr("0"),
            Text: to.StringPtr("This is a document written in English."),
        },
        textanalytics.LanguageInput{
            ID:   to.StringPtr("1"),
            Text: to.StringPtr("Este es un document escrito en Español."),
        },
        textanalytics.LanguageInput{
            ID:   to.StringPtr("2"),
            Text: to.StringPtr("这是一个用中文写的文件"),
        },
    }

    batchInput := textanalytics.LanguageBatchInput{Documents: &inputDocuments}
    result, _ := textAnalyticsclient.DetectLanguage(ctx, to.BoolPtr(false), &batchInput)

    // Printing language detection results
    for _, document := range *result.Documents {
        fmt.Printf("Document ID: %s ", *document.ID)
        fmt.Printf("Detected Languages with Score: ")
        for _, language := range *document.DetectedLanguages {
            fmt.Printf("%s %f,", *language.Name, *language.Score)
        }
        fmt.Println()
    }

    // Printing document errors
    fmt.Println("Document Errors")
    for _, error := range *result.Errors {
        fmt.Printf("Document ID: %s Message : %s\n", *error.ID, *error.Message)
    }
}
```

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

```go
func ExtractEntities() {
    textAnalyticsclient := GetTextAnalyticsClient()
    ctx := context.Background()
    inputDocuments := []textanalytics.MultiLanguageInput{
        textanalytics.MultiLanguageInput{
            Language: to.StringPtr("en"),
            ID:       to.StringPtr("0"),
            Text:     to.StringPtr("Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800."),
        },
        textanalytics.MultiLanguageInput{
            Language: to.StringPtr("es"),
            ID:       to.StringPtr("1"),
            Text:     to.StringPtr("La sede principal de Microsoft se encuentra en la ciudad de Redmond, a 21 kilómetros de Seattle."),
        },
    }

    batchInput := textanalytics.MultiLanguageBatchInput{Documents: &inputDocuments}
    result, _ := textAnalyticsclient.Entities(ctx, to.BoolPtr(false), &batchInput)

    // Printing extracted entities results
    for _, document := range *result.Documents {
        fmt.Printf("Document ID: %s\n", *document.ID)
        fmt.Printf("\tExtracted Entities:\n")
        for _, entity := range *document.Entities {
            fmt.Printf("\t\tName: %s\tType: %s", *entity.Name, *entity.Type)
            if entity.SubType != nil {
                fmt.Printf("\tSub-Type: %s\n", *entity.SubType)
            }
            fmt.Println()
            for _, match := range *entity.Matches {
                fmt.Printf("\t\t\tOffset: %v\tLength: %v\tScore: %f\n", *match.Offset, *match.Length, *match.EntityTypeScore)
            }
        }
        fmt.Println()
    }

    // Printing document errors
    fmt.Println("Document Errors")
    for _, error := range *result.Errors {
        fmt.Printf("Document ID: %s Message : %s\n", *error.ID, *error.Message)
    }
}
```


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

```go
func ExtractKeyPhrases() {
    textAnalyticsclient := GetTextAnalyticsClient()
    ctx := context.Background()
    inputDocuments := []textanalytics.MultiLanguageInput{
        textanalytics.MultiLanguageInput{
            Language: to.StringPtr("ja"),
            ID:       to.StringPtr("0"),
            Text:     to.StringPtr("猫は幸せ"),
        },
        textanalytics.MultiLanguageInput{
            Language: to.StringPtr("de"),
            ID:       to.StringPtr("1"),
            Text:     to.StringPtr("Fahrt nach Stuttgart und dann zum Hotel zu Fu."),
        },
        textanalytics.MultiLanguageInput{
            Language: to.StringPtr("en"),
            ID:       to.StringPtr("2"),
            Text:     to.StringPtr("My cat might need to see a veterinarian."),
        },
        textanalytics.MultiLanguageInput{
            Language: to.StringPtr("es"),
            ID:       to.StringPtr("3"),
            Text:     to.StringPtr("A mi me encanta el fútbol!"),
        },
    }

    batchInput := textanalytics.MultiLanguageBatchInput{Documents: &inputDocuments}
    result, _ := textAnalyticsclient.KeyPhrases(ctx, to.BoolPtr(false), &batchInput)

    // Printing extracted key phrases results
    for _, document := range *result.Documents {
        fmt.Printf("Document ID: %s\n", *document.ID)
        fmt.Printf("\tExtracted Key Phrases:\n")
        for _, keyPhrase := range *document.KeyPhrases {
            fmt.Printf("\t\t%s\n", keyPhrase)
        }
        fmt.Println()
    }

    // Printing document errors
    fmt.Println("Document Errors")
    for _, error := range *result.Errors {
        fmt.Printf("Document ID: %s Message : %s\n", *error.ID, *error.Message)
    }
}
```
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
