---
title: 'Quickstart: Call the Text Analytics service using the Go SDK'
titleSuffix: Azure Cognitive Services
description: Get information and code samples to help you quickly get started using the Text Analytics API in Microsoft Cognitive Services.
services: cognitive-services
author: laramume
manager: assafi

ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: quickstart
ms.date: 05/23/2019
ms.author: aahi
---
# Quickstart: Call the Text Analytics service using the Go SDK 
<a name="HOLTop"></a>

Use this quickstart to begin analyzing language with the Text Analytics SDK for Go. This article shows you how to detect language, analyze sentiment, extract key phrases, and identify linked entities. While the REST API is compatible with most programming languages, the SDK provides an easy way to integrate the service into your applications. The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/azure-sdk-for-go-samples/tree/master/cognitiveservices).

## Prerequisites

* The Text Analytics [SDK for Go](https://github.com/Azure/azure-sdk-for-go/tree/master/services/cognitiveservices/v2.1/textanalytics)

[!INCLUDE [cognitive-services-text-analytics-signup-requirements](../../../../includes/cognitive-services-text-analytics-signup-requirements.md)]

You must also have the [endpoint and access key](../How-tos/text-analytics-how-to-access-key.md) that was generated for you during sign-up.

## Set up a new Project

Create a new Go project in your favorite code editor or IDE. Then add the following import statement to the Go file.

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

## Create Text Analytics Client and Authenticate Credentials

In the main function of your project, create a new `TextAnalytics` object. Use the correct Azure region for your Text Analytics subscription. For example: `https://eastus.api.cognitive.microsoft.com`. If you're using a trial key, you don't need to update the location.

```golang
//Replace 'eastus' with the correct region for your Text Analytics subscription
textAnalyticsClient := textanalytics.New("https://eastus.api.cognitive.microsoft.com")
```

Create a variable for your key and pass it to the function `autorest.NewCognitiveServicesAuthorizer` which will then be passed to the client's `authorizer` property.

```golang
subscriptionKey := "<<subscriptionKey>>"
textAnalyticsClient.Authorizer = autorest.NewCognitiveServicesAuthorizer(subscriptionKey)
```

## Sentiment analysis

Create a new function called `SentimentAnalysis()` that takes the client created earlier. Create a list of `MultiLanguageInput` objects, containing the documents you want to analyze. Each object will contain an `id`, `Language` and a `text` attribute. The `text` attribute stores the text to be analyzed, `language` is the language of the document, and the `id` can be any value. 

```golang
func SentimentAnalysis(textAnalyticsclient textanalytics.BaseClient) {

    ctx := context.Background()
    inputDocuments := []textanalytics.MultiLanguageInput {
        textanalytics.MultiLanguageInput {
            Language: StringPointer("en"),
            ID:StringPointer("0"),
            Text:StringPointer("I had the best day of my life."),
        },
        textanalytics.MultiLanguageInput {
            Language: StringPointer("en"),
            ID:StringPointer("1"),
            Text:StringPointer("This was a waste of my time. The speaker put me to sleep."),
        },
        textanalytics.MultiLanguageInput {
            Language: StringPointer("es"),
            ID:StringPointer("2"),
            Text:StringPointer("No tengo dinero ni nada que dar..."),
        },
        textanalytics.MultiLanguageInput {
            Language: StringPointer("it"),
            ID:StringPointer("3"),
            Text:StringPointer("L'hotel veneziano era meraviglioso. È un bellissimo pezzo di architettura."),
        },
    }

    batchInput := textanalytics.MultiLanguageBatchInput{Documents:&inputDocuments}
}
```

In the same function, call `textAnalyticsclient.Sentiment()` and get the result. Then iterate through the results, and print each document's ID, and sentiment score. A score closer to 0 indicates a negative sentiment, while a score closer to 1 indicates a positive sentiment.

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
Document ID: 2 , Sentiment Score: 0.11
Document ID: 3 , Sentiment Score: 0.44
Document ID: 4 , Sentiment Score: 1.00
```

## Language detection

Create a new function called `LanguageDetection()` that takes the client created earlier. Create a list of `LanguageInput` objects, containing the documents you want to analyze. Each object will contain an `id` and a `text` attribute. The `text` attribute stores the text to be analyzed, and the `id` can be any value. 

```golang
func LanguageDetection(textAnalyticsclient textanalytics.BaseClient) {

	ctx := context.Background()
	inputDocuments := []textanalytics.LanguageInput {
		textanalytics.LanguageInput {
			ID:StringPointer("0"),
			Text:StringPointer("This is a document written in English."),
		},
		textanalytics.LanguageInput {
			ID:StringPointer("1"),
			Text:StringPointer("Este es un document escrito en Español."),
		},
		textanalytics.LanguageInput {
			ID:StringPointer("2"),
			Text:StringPointer("这是一个用中文写的文件"),
		},
	}

	batchInput := textanalytics.LanguageBatchInput{Documents:&inputDocuments}
}
```

In the same function, call `textAnalyticsclient.DetectLanguage()` and get the result. Then iterate through the results, and print each document's ID, and detected language.

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
Document ID: 0 Detected Languages with Score: English 1.000000,
Document ID: 1 Detected Languages with Score: Spanish 1.000000,
Document ID: 2 Detected Languages with Score: Chinese_Simplified 1.000000,
```

## Entity recognition

Create a new function called `ExtractEntities()` that takes the client created earlier. Create a list of `MultiLanguageInput` objects, containing the documents you want to analyze. Each object will contain an `id`, `language`, and a `text` attribute. The `text` attribute stores the text to be analyzed, `language` is the language of the document, and the `id` can be any value. 

```golang
func ExtractKeyPhrases(textAnalyticsclient textanalytics.BaseClient) {

	ctx := context.Background()
	inputDocuments := []textanalytics.MultiLanguageInput {
		textanalytics.MultiLanguageInput {
			Language: StringPointer("en"),
			ID:StringPointer("0"),
			Text:StringPointer("Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800."),
		},
		textanalytics.MultiLanguageInput {
			Language: StringPointer("es"),
			ID:StringPointer("1"),
			Text:StringPointer("La sede principal de Microsoft se encuentra en la ciudad de Redmond, a 21 kilómetros de Seattle."),
		},
	}

	batchInput := textanalytics.MultiLanguageBatchInput{Documents:&inputDocuments}
}
```

In the same function, `call textAnalyticsclient.Entities()` and get the result. Then iterate through the results, and print each document's ID, and extracted entities score.

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

Document ID: 1
	Extracted Entities:
		Name: Microsoft	Type: Organization
			Offset: 21	Length: 9	Score: 0.999756
		Name: Redmond (Washington)	Type: Location
			Offset: 60	Length: 7	Score: 0.991128
		Name: 21 kilómetros	Type: Quantity	Sub-Type: Dimension

			Offset: 71	Length: 13	Score: 0.800000
		Name: Seattle	Type: Location
			Offset: 88	Length: 7	Score: 0.999878
```

## Key phrase extraction

Create a new function called `ExtractKeyPhrases()` that takes the client created earlier. Create a list of `MultiLanguageInput` objects, containing the documents you want to analyze. Each object will contain an `id`, `language`, and a `text` attribute. The `text` attribute stores the text to be analyzed, `language` is the language of the document, and the `id` can be any value.

```golang
func ExtractKeyPhrases(textAnalyticsclient textanalytics.BaseClient) {

	ctx := context.Background()
	inputDocuments := []textanalytics.MultiLanguageInput {
		textanalytics.MultiLanguageInput {
			Language: StringPointer("ja"),
			ID:StringPointer("0"),
			Text:StringPointer("猫は幸せ"),
		},
		textanalytics.MultiLanguageInput {
			Language: StringPointer("de"),
			ID:StringPointer("1"),
			Text:StringPointer("Fahrt nach Stuttgart und dann zum Hotel zu Fu."),
		},
		textanalytics.MultiLanguageInput {
			Language: StringPointer("en"),
			ID:StringPointer("2"),
			Text:StringPointer("My cat might need to see a veterinarian."),
		},
		textanalytics.MultiLanguageInput {
			Language: StringPointer("es"),
			ID:StringPointer("3"),
			Text:StringPointer("A mi me encanta el fútbol!"),
		},
	}

	batchInput := textanalytics.MultiLanguageBatchInput{Documents:&inputDocuments}
}
```

In the same function, call textAnalyticsclient.KeyPhrases() and get the result. Then iterate through the results, and print each document's ID, and extracted key phrases.

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
		幸せ

Document ID: 1
	Extracted Key Phrases:
		Stuttgart
		Hotel
		Fahrt
		Fu

Document ID: 2
	Extracted Key Phrases:
		cat
		veterinarian

Document ID: 3
	Extracted Key Phrases:
		fútbol
```

## Next steps

> [!div class="nextstepaction"]
> [Text Analytics With Power BI](../tutorials/tutorial-power-bi-key-phrases.md)

## See also

 [Text Analytics overview](../overview.md)
 [Frequently asked questions (FAQ)](../text-analytics-resource-faq.md)
