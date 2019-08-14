---
title: 'Quickstart: Text Analytics client library for Go | Microsoft Docs'
titleSuffix: Azure Cognitive Services
description: Get information and code samples to help you quickly get started using the Text Analytics API in Azure Cognitive Services.
services: cognitive-services
author: laramume
manager: assafi

ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: quickstart
ms.date: 07/30/2019
ms.author: aahi
---

# Quickstart: Text analytics client library for Go

Get started with the Text Analytics client library for Go. Follow these steps to install the package and try out the example code for basic tasks. 

Use the Text Analytics client library for Go to perform:

* Sentiment analysis
* Language detection
* Entity recognition
* Key phrase extraction

[Reference documentation](https://docs.microsoft.com/python/api/overview/azure/cognitiveservices/textanalytics?view=azure-python) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cognitiveservices/azure-cognitiveservices-language-textanalytics) | [Package (Github)](https://github.com/Azure/azure-sdk-for-go/tree/master/services/cognitiveservices/v2.1/textanalytics) | [Samples](https://github.com/Azure-Samples/cognitive-services-quickstart-code)

## Prerequisites

* An Azure subscription - [create one for free](https://azure.microsoft.com/free/)
* The latest version of [Go](https://golang.org/dl/)

## Setting up

### Create a Text Analytics Azure resource 

Azure Cognitive Services are represented by Azure resources that you subscribe to. Create a resource for Text Analytics using the [Azure portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) or [Azure CLI](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account-cli) on your local machine. You can also:

* Get a [trial key](https://azure.microsoft.com/try/cognitive-services/#decision) valid for 7 days for free. After signing up it will be available on the [Azure website](https://azure.microsoft.com/try/cognitive-services/my-apis/).
* View your resource on the [Azure portal](https://portal.azure.com).

After you get a key from your trial subscription or resource, [create an environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the key, named `TEXT_ANALYTICS_SUBSCRIPTION_KEY`.

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

```golang
import (
    "context"
    "encoding/json"
    "fmt"
    "github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/textanalytics"
    "github.com/Azure/go-autorest/autorest"
)
```

Add the following functions to your project as most of the parameters and properties for this quickstart expect string and bool pointers.

```golang
// returns a pointer to the string value passed in.
func StringPointer(v string) *string {
    return &v
}

// returns a pointer to the bool value passed in.
func BoolPointer(v bool) *bool {
    return &v
}
```

In the main function of your project, create variables for your resource's Azure endpoint and key. If you created the environment variable after you launched the application, you will need to close and reopen the editor, IDE, or shell running it to access the variable.

[!INCLUDE [text-analytics-find-resource-information](../includes/find-azure-resource-info.md)]

```golang
// This sample assumes you have created an environment variable for your key
subscriptionKey := os.Getenv("TEXT_ANALYTICS_SUBSCRIPTION_KEY")
// replace this endpoint with the correct one for your Azure resource. 
endpoint := "https://eastus.api.cognitive.microsoft.com"
```

## Object model 

The Text Analytics client is a [BaseClient](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/textanalytics#New) object that authenticates to Azure using your key. The client provides several methods for analyzing text, as a single string, or a batch. 

Text is sent to the API as a list of `documents`, which are `dictionary` objects containing a combination of `id`, `text`, and `language` attributes depending on the method used. The `text` attribute stores the text to be analyzed in the origin `language`, and the `id` can be any value. 

The response object is a list containing the analysis information for each document. 

## Code examples

These code snippets show you how to do the following with the Text Analytics client library for Python:

* [Authenticate the client](#authenticate-the-client)
* [Sentiment Analysis](#sentiment-analysis)
* [Language detection](#language-detection)
* [Entity recognition](#entity-recognition)
* [Key phrase extraction](#key-phrase-extraction)

## Authenticate the client

In the main function of your project, create a new [BaseClient](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/textanalytics#New) object. Pass your key to the [autorest.NewCognitiveServicesAuthorizer()](https://godoc.org/github.com/Azure/go-autorest/autorest#NewCognitiveServicesAuthorizer) function, which will then be passed to the client's `authorizer` property.

```golang
textAnalyticsClient := textanalytics.New(endpoint)
textAnalyticsClient.Authorizer = autorest.NewCognitiveServicesAuthorizer(subscriptionKey)
```

## Sentiment analysis

Create a new function called `SentimentAnalysis()` that takes the client created earlier. Create a list of [MultiLanguageInput](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/textanalytics#MultiLanguageBatchInput) objects, containing the documents you want to analyze. Each object will contain an `id`, `Language` and a `text` attribute. The `text` attribute stores the text to be analyzed, `language` is the language of the document, and the `id` can be any value. 

```golang
func SentimentAnalysis(textAnalyticsclient textanalytics.BaseClient) {

    ctx := context.Background()
    inputDocuments := []textanalytics.MultiLanguageInput {
        textanalytics.MultiLanguageInput {
            Language: StringPointer("en"),
            ID:StringPointer("0"),
            Text:StringPointer("I had the best day of my life."),
        },
    }

    batchInput := textanalytics.MultiLanguageBatchInput{Documents:&inputDocuments}
}
```

In the same function, call the client's [Sentiment()](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/textanalytics#BaseClient.Sentiment) function and get the result. Then iterate through the results, and print each document's ID, and sentiment score. A score closer to 0 indicates a negative sentiment, while a score closer to 1 indicates a positive sentiment.

```golang
result, _ := textAnalyticsclient.Sentiment(ctx, BoolPointer(false), &batchInput)
batchResult := textanalytics.SentimentBatchResult{}
jsonString, _ := json.Marshal(result.Value)
json.Unmarshal(jsonString, &batchResult)

// Printing sentiment results
for _,document := range *batchResult.Documents {
    fmt.Printf("Document ID: %s " , *document.ID)
    fmt.Printf("Sentiment Score: %f\n",*document.Score)
}

// Printing document errors
fmt.Println("Document Errors")
for _,error := range *batchResult.Errors {
    fmt.Printf("Document ID: %s Message : %s\n" ,*error.ID, *error.Message)
}
```

In the main function of your project, call `SentimentAnalysis()`.

### Output

```console
Document ID: 1 , Sentiment Score: 0.87
```

## Language detection

Create a new function called `LanguageDetection()` that takes the client created earlier. Create a list of [LanguageInput](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/textanalytics#LanguageInput) objects, containing the documents you want to analyze. Each object will contain an `id` and a `text` attribute. The `text` attribute stores the text to be analyzed, and the `id` can be any value. 

```golang
func LanguageDetection(textAnalyticsclient textanalytics.BaseClient) {

	ctx := context.Background()
	inputDocuments := []textanalytics.LanguageInput {
		textanalytics.LanguageInput {
			ID:StringPointer("0"),
			Text:StringPointer("This is a document written in English."),
		},
	}

	batchInput := textanalytics.LanguageBatchInput{Documents:&inputDocuments}
}
```

In the same function, call the client's [DetectLanguage()](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/textanalytics#BaseClient.DetectLanguage) and get the result. Then iterate through the results, and print each document's ID, and detected language.

```golang
result, _ := textAnalyticsclient.DetectLanguage(ctx, BoolPointer(false), &batchInput)

// Printing language detection results
for _,document := range *result.Documents {
    fmt.Printf("Document ID: %s " , *document.ID)
    fmt.Printf("Detected Languages with Score: ")
    for _,language := range *document.DetectedLanguages{
        fmt.Printf("%s %f,",*language.Name, *language.Score)
    }
    fmt.Println()
}

// Printing document errors
fmt.Println("Document Errors")
for _,error := range *result.Errors {
    fmt.Printf("Document ID: %s Message : %s\n" ,*error.ID, *error.Message)
}
```

In the main function of your project, call `LanguageDetection()`.

### Output

```console
Document ID: 0 Detected Languages with Score: English 1.000000
```

## Entity recognition

Create a new function called `ExtractEntities()` that takes the client created earlier. Create a list of [MultiLanguageInput](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/textanalytics#MultiLanguageBatchInput) objects, containing the documents you want to analyze. Each object will contain an `id`, `language`, and a `text` attribute. The `text` attribute stores the text to be analyzed, `language` is the language of the document, and the `id` can be any value. 

```golang
func ExtractKeyPhrases(textAnalyticsclient textanalytics.BaseClient) {

	ctx := context.Background()
	inputDocuments := []textanalytics.MultiLanguageInput {
		textanalytics.MultiLanguageInput {
			Language: StringPointer("en"),
			ID:StringPointer("0"),
			Text:StringPointer("Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800."),
		}
	}

	batchInput := textanalytics.MultiLanguageBatchInput{Documents:&inputDocuments}
}
```

In the same function, call the client's [Entities()](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/textanalytics#BaseClient.Entities) and get the result. Then iterate through the results, and print each document's ID, and extracted entities score.

```golang
    result, _ := textAnalyticsclient.Entities(ctx, BoolPointer(false), &batchInput)

	// Printing extracted entities results
	for _,document := range *result.Documents {
		fmt.Printf("Document ID: %s\n" , *document.ID)
		fmt.Printf("\tExtracted Entities:\n")
		for _,entity := range *document.Entities{
			fmt.Printf("\t\tName: %s\tType: %s",*entity.Name, *entity.Type)
			if entity.SubType != nil{
				fmt.Printf("\tSub-Type: %s\n", *entity.SubType)
			}
			fmt.Println()
			for _,match := range *entity.Matches{
				fmt.Printf("\t\t\tOffset: %v\tLength: %v\tScore: %f\n", *match.Offset, *match.Length, *match.EntityTypeScore)
			}
		}
		fmt.Println()
	}

	// Printing document errors
	fmt.Println("Document Errors")
	for _,error := range *result.Errors {
		fmt.Printf("Document ID: %s Message : %s\n" ,*error.ID, *error.Message)
	}
```

In the main function of your project, call `ExtractEntities()`.

### Output

```console
Document ID: 0
	Extracted Entities:
		Name: Microsoft	Type: Organization
			Offset: 0	Length: 9	Score: 1.000000
		Name: Bill Gates	Type: Person
			Offset: 25	Length: 10	Score: 0.999847
		Name: Paul Allen	Type: Person
			Offset: 40	Length: 10	Score: 0.998841
		Name: April 4	Type: Other
			Offset: 54	Length: 7	Score: 0.800000
		Name: April 4, 1975	Type: DateTime	Sub-Type: Date

			Offset: 54	Length: 13	Score: 0.800000
		Name: BASIC	Type: Other
			Offset: 89	Length: 5	Score: 0.800000
		Name: Altair 8800	Type: Other
			Offset: 116	Length: 11	Score: 0.800000
```

## Key phrase extraction

Create a new function called `ExtractKeyPhrases()` that takes the client created earlier. Create a list of [MultiLanguageInput](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/textanalytics#MultiLanguageBatchInput) objects, containing the documents you want to analyze. Each object will contain an `id`, `language`, and a `text` attribute. The `text` attribute stores the text to be analyzed, `language` is the language of the document, and the `id` can be any value.

```golang
func ExtractKeyPhrases(textAnalyticsclient textanalytics.BaseClient) {

	ctx := context.Background()
	inputDocuments := []textanalytics.MultiLanguageInput {
		textanalytics.MultiLanguageInput {
			Language: StringPointer("en"),
			ID:StringPointer("0"),
			Text:StringPointer("My cat might need to see a veterinarian."),
		},
	}

	batchInput := textanalytics.MultiLanguageBatchInput{Documents:&inputDocuments}
}
```

In the same function, call the client's [KeyPhrases()](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/textanalytics#BaseClient.KeyPhrases) and get the result. Then iterate through the results, and print each document's ID, and extracted key phrases.

```golang
    result, _ := textAnalyticsclient.KeyPhrases(ctx, BoolPointer(false), &batchInput)

	// Printing extracted key phrases results
	for _,document := range *result.Documents {
		fmt.Printf("Document ID: %s\n" , *document.ID)
		fmt.Printf("\tExtracted Key Phrases:\n")
		for _,keyPhrase := range *document.KeyPhrases{
			fmt.Printf("\t\t%s\n",keyPhrase)
		}
		fmt.Println()
	}

	// Printing document errors
	fmt.Println("Document Errors")
	for _,error := range *result.Errors {
		fmt.Printf("Document ID: %s Message : %s\n" ,*error.ID, *error.Message)
	}
```

In the main function of your project, call `ExtractKeyPhrases()`.

### Output

```console
Document ID: 0
	Extracted Key Phrases:
		cat
		veterinarian
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with the resource group.

* [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps


> [!div class="nextstepaction"]
> [Text Analytics With Power BI](../tutorials/tutorial-power-bi-key-phrases.md)


* [Text Analytics overview](../overview.md)
* [Sentiment analysis](../how-tos/text-analytics-how-to-sentiment-analysis.md)
* [Entity recognition](../how-tos/text-analytics-how-to-entity-linking.md)
* [Detect language](../how-tos/text-analytics-how-to-keyword-extraction.md)
* [Language recognition](../how-tos/text-analytics-how-to-language-detection.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/azure-sdk-for-go-samples/tree/master/cognitiveservices).
