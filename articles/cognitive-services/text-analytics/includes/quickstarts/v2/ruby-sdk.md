---
author: aahill
ms.service: cognitive-services
ms.topic: include
ms.date: 10/02/2019
ms.author: aahi
---

[Reference documentation](https://docs.microsoft.com/python/api/overview/azure/cognitiveservices/textanalytics?view=azure-python) | [Library source code](https://github.com/Azure/azure-sdk-for-ruby/tree/master/data/azure_cognitiveservices_textanalytics) | [Package (RubyGems)](https://rubygems.org/gems/azure_cognitiveservices_textanalytics) | [Samples](https://github.com/Azure-Samples/cognitive-services-quickstart-code)

<a name="HOLTop"></a>

## Prerequisites

* An Azure subscription - [create one for free](https://azure.microsoft.com/free/)
* The current version of [Ruby](https://www.ruby-lang.org/)

## Setting up

### Create a Text Analytics Azure resource 

[!INCLUDE [text-analytics-resource-creation](../resource-creation.md)]

### Create a new Ruby application

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it. Then create a file named `GemFile`, and a Ruby file for your code.

```console
mkdir myapp && cd myapp
```

In your `GemFile`, add the following lines to add the client library as a dependency.

```ruby
source 'https://rubygems.org'
gem 'azure_cognitiveservices_textanalytics', '~>0.17.3'
```

In your Ruby file, import the following packages.

[!code-ruby[Import statements](~/cognitive-services-ruby-sdk-samples/samples/text_analytics.rb?name=includeStatement)]

Create variables for your resource's Azure endpoint and key. 

[!INCLUDE [text-analytics-find-resource-information](../../find-azure-resource-info-v2.md)]

```ruby
const subscription_key = '<paste-your-text-analytics-key-here>'
const endpoint = `<paste-your-text-analytics-endpoint-here>`
```

## Object model 

The Text Analytics client authenticates to Azure using your key. The client provides several methods for analyzing text, as a single string, or a batch. 

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

Create a class named `TextAnalyticsClient`. 

```ruby
class TextAnalyticsClient
  @textAnalyticsClient
  #...
end
```

In this class, create a function called `initialize` to authenticate the client using your key and endpoint. 

[!code-ruby[initialize function for authentication](~/cognitive-services-ruby-sdk-samples/samples/text_analytics.rb?name=initialize)]

Outside of the class, use the client's `new()` function to instantiate it.

[!code-ruby[client creation](~/cognitive-services-ruby-sdk-samples/samples/text_analytics.rb?name=clientCreation)] 

<a name="SentimentAnalysis"></a>

## Sentiment analysis

In the client object, create a function called `AnalyzeSentiment()` that takes a list of input documents that will be created later. Call the client's `sentiment()` function and get the result. Then iterate through the results, and print each document's ID, and sentiment score. A score closer to 0 indicates a negative sentiment, while a score closer to 1 indicates a positive sentiment.

[!code-ruby[client method for sentiment analysis](~/cognitive-services-ruby-sdk-samples/samples/text_analytics.rb?name=analyzeSentiment)] 

Outside of the client function, create a new function called `SentimentAnalysisExample()` that takes the `TextAnalyticsClient` object created earlier. Create a list of `MultiLanguageInput` objects, containing the documents you want to analyze. Each object will contain an `id`, `Language` and a `text` attribute. The `text` attribute stores the text to be analyzed, `language` is the language of the document, and the `id` can be any value. Then call the client's `AnalyzeSentiment()` function.

[!code-ruby[sentiment analysis document creation and call](~/cognitive-services-ruby-sdk-samples/samples/text_analytics.rb?name=sentimentCall)] 

Call the `SentimentAnalysisExample()` function.

```ruby
SentimentAnalysisExample(textAnalyticsClient)
```

### Output

```console
===== SENTIMENT ANALYSIS =====
Document ID: 1 , Sentiment Score: 0.87
Document ID: 2 , Sentiment Score: 0.11
Document ID: 3 , Sentiment Score: 0.44
Document ID: 4 , Sentiment Score: 1.00
```

<a name="LanguageDetection"></a>

## Language detection

In the client object, create a function called `DetectLanguage()` that takes a list of input documents that will be created later. Call the client's `detect_language()` function and get the result. Then iterate through the results, and print each document's ID, and detected language.

[!code-ruby[client method for language detection](~/cognitive-services-ruby-sdk-samples/samples/text_analytics.rb?name=detectLanguage)] 

Outside of the client function, create a new function called `DetectLanguageExample()` that takes the `TextAnalyticsClient` object created earlier. Create a list of `LanguageInput` objects, containing the documents you want to analyze. Each object will contain an `id`, and a `text` attribute. The `text` attribute stores the text to be analyzed, and the `id` can be any value. Then call the client's `DetectLanguage()` function.

[!code-ruby[language detection document creation and call](~/cognitive-services-ruby-sdk-samples/samples/text_analytics.rb?name=detectLanguageCall)] 

Call the `DetectLanguageExample()` function.

```ruby
DetectLanguageExample(textAnalyticsClient)
```

### Output

```console
===== LANGUAGE EXTRACTION ======
Document ID: 1 , Language: English
Document ID: 2 , Language: Spanish
Document ID: 3 , Language: Chinese_Simplified
```

<a name="EntityRecognition"></a>

## Entity recognition

In the client object, create a function called `RecognizeEntities()` that takes a list of input documents that will be created later. Call the client's `entities()` function and get the result. Then iterate through the results, and print each document's ID, and the recognized entities.

[!code-ruby[client method for entity recognition](~/cognitive-services-ruby-sdk-samples/samples/text_analytics.rb?name=recognizeEntities)]

Outside of the client function, create a new function called `RecognizeEntitiesExample()` that takes the `TextAnalyticsClient` object created earlier. Create a list of `MultiLanguageInput` objects, containing the documents you want to analyze. Each object will contain an `id`, a `language`, and a `text` attribute. The `text` attribute stores the text to be analyzed, `language` is the language of the text, and the `id` can be any value. Then call the client's `RecognizeEntities()` function.

[!code-ruby[entity recognition documents and method call](~/cognitive-services-ruby-sdk-samples/samples/text_analytics.rb?name=recognizeEntitiesCall)] 

Call the `RecognizeEntitiesExample()` function.

```ruby
RecognizeEntitiesExample(textAnalyticsClient)
```

### Output

```console
===== ENTITY RECOGNITION =====
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

<a name="KeyPhraseExtraction"></a>

## Key phrase extraction

In the client object, create a function called `ExtractKeyPhrases()` that takes a list of input documents that will be created later. Call the client's `key_phrases()` function and get the result. Then iterate through the results, and print each document's ID, and the extracted key phrases.

[!code-ruby[key phrase extraction client method](~/cognitive-services-ruby-sdk-samples/samples/text_analytics.rb?name=extractKeyPhrases)] 

Outside of the client function, create a new function called `KeyPhraseExtractionExample()` that takes the `TextAnalyticsClient` object created earlier. Create a list of `MultiLanguageInput` objects, containing the documents you want to analyze. Each object will contain an `id`, a `language`, and a `text` attribute. The `text` attribute stores the text to be analyzed, `language` is the language of the text, and the `id` can be any value. Then call the client's `ExtractKeyPhrases()` function.

[!code-ruby[key phrase document creation and call](~/cognitive-services-ruby-sdk-samples/samples/text_analytics.rb?name=keyPhrasesCall)]


Call the `KeyPhraseExtractionExample()` function.

```ruby
KeyPhraseExtractionExample(textAnalyticsClient)
```

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
                rock
Document ID: 4
         Key phrases:
                fútbol
```
