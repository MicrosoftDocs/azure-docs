---
author: aahill
ms.service: cognitive-services
ms.topic: include
ms.date: 10/02/2019
ms.author: aahi
---

<!-- these links are for v2. Make sure to update them to the correct v3 content -->
[Reference documentation](https://docs.microsoft.com/python/api/overview/azure/cognitiveservices/textanalytics?view=azure-python) | [Library source code](https://github.com/Azure/azure-sdk-for-ruby/tree/master/data/azure_cognitiveservices_textanalytics) | [Package (RubyGems)](https://rubygems.org/gems/azure_cognitiveservices_textanalytics) | [Samples](https://github.com/Azure-Samples/cognitive-services-quickstart-code)

<a name="HOLTop"></a>

## Prerequisites

<!--
Add any extra steps preparing an environment for working with the client library. 
-->

* An Azure subscription - [create one for free](https://azure.microsoft.com/free/)
* The current version of [Ruby](https://www.ruby-lang.org/)

## Setting up

### Create a Text Analytics Azure resource 

<!-- NOTE
The below is an "include" file, which is a text file that will be referenced, and rendered on the docs site.
These files are used to display text across multiple articles at once. Consider keeping them in-place for consistency with other articles.
 -->

[!INCLUDE [text-analytics-resource-creation](resource-creation.md)]

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

```ruby
require 'azure_cognitiveservices_textanalytics'
include Azure::CognitiveServices::TextAnalytics::V2_1::Models
```

Create variables for your resource's Azure endpoint and key. 

[!INCLUDE [text-analytics-find-resource-information](../find-azure-resource-info.md)]

```ruby
const subscription_key = '<paste-your-text-analytics-key-here>'
const endpoint = `<paste-your-text-analytics-endpoint-here>`
```

## Object model 

<!-- 
    Briefly introduce and describe the functionality of the library's main classes. Include links to their reference pages. If needed, briefly explain the object hierarchy and how the classes work together to manipulate resources in the service.
-->

The Text Analytics client authenticates to Azure using your key. The client provides several methods for analyzing text, as a single string, or a batch. 

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

Create a class named `TextAnalyticsClient`. 

```ruby
class TextAnalyticsClient
  @textAnalyticsClient
  #...
end
```

In this class, create a function called `initialize` to authenticate the client using your key and endpoint. 

```ruby
def initialize(endpoint, key)
  credentials =
      MsRestAzure::CognitiveServicesCredentials.new(key)

  endpoint = String.new(endpoint)

  @textAnalyticsClient = Azure::TextAnalytics::Profiles::Latest::Client.new({
      credentials: credentials
  })
  @textAnalyticsClient.endpoint = endpoint
end
```

Outside of the class, use the client's `new()` function to instantiate it.

```ruby
client = TextAnalyticsClient.new(endpoint, subscription_key)
```

<a name="SentimentAnalysis"></a>

## Sentiment analysis

In the client object, create a function called `AnalyzeSentiment()` that takes a list of input documents that will be created later. Call the client's `sentiment()` function and get the result. Then iterate through the results, and print each document's ID, and sentiment score. A score closer to 0 indicates a negative sentiment, while a score closer to 1 indicates a positive sentiment.

```ruby
def AnalyzeSentiment(inputDocuments)
  result = @textAnalyticsClient.sentiment(
      multi_language_batch_input: inputDocuments
  )

  if (!result.nil? && !result.documents.nil? && result.documents.length > 0)
    puts '===== SENTIMENT ANALYSIS ====='
    result.documents.each do |document|
      puts "Document Id: #{document.id}: Sentiment Score: #{document.score}"
    end
  end
  puts ''
end
```

Outside of the client function, create a new function called `SentimentAnalysisExample()` that takes the `TextAnalyticsClient` object created earlier. Create a list of `MultiLanguageInput` objects, containing the documents you want to analyze. Each object will contain an `id`, `Language` and a `text` attribute. The `text` attribute stores the text to be analyzed, `language` is the language of the document, and the `id` can be any value. Then call the client's `AnalyzeSentiment()` function.

```ruby
def SentimentAnalysisExample(client)
  # The documents to be analyzed. Add the language of the document. The ID can be any value.
  input_1 = MultiLanguageInput.new
  input_1.id = '1'
  input_1.language = 'en'
  input_1.text = 'I had the best day of my life.'

  input_2 = MultiLanguageInput.new
  input_2.id = '2'
  input_2.language = 'en'
  input_2.text = 'This was a waste of my time. The speaker put me to sleep.'

  input_3 = MultiLanguageInput.new
  input_3.id = '3'
  input_3.language = 'es'
  input_3.text = 'No tengo dinero ni nada que dar...'

  input_4 = MultiLanguageInput.new
  input_4.id = '4'
  input_4.language = 'it'
  input_4.text = "L'hotel veneziano era meraviglioso. È un bellissimo pezzo di architettura."

  inputDocuments =  MultiLanguageBatchInput.new
  inputDocuments.documents = [input_1, input_2, input_3, input_4]

  client.AnalyzeSentiment(inputDocuments)
end
```

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

```ruby
def DetectLanguage(inputDocuments)
  result = @textAnalyticsClient.detect_language(
      language_batch_input: inputDocuments
  )

  if (!result.nil? && !result.documents.nil? && result.documents.length > 0)
    puts '===== LANGUAGE DETECTION ====='
    result.documents.each do |document|
      puts "Document ID: #{document.id} , Language: #{document.detected_languages[0].name}"
    end
  else
    puts 'No results data..'
  end
  puts ''
end
```

Outside of the client function, create a new function called `DetectLanguageExample()` that takes the `TextAnalyticsClient` object created earlier. Create a list of `LanguageInput` objects, containing the documents you want to analyze. Each object will contain an `id`, and a `text` attribute. The `text` attribute stores the text to be analyzed, and the `id` can be any value. Then call the client's `DetectLanguage()` function.

```ruby
def DetectLanguageExample(client)
 # The documents to be analyzed.
 language_input_1 = LanguageInput.new
 language_input_1.id = '1'
 language_input_1.text = 'This is a document written in English.'

 language_input_2 = LanguageInput.new
 language_input_2.id = '2'
 language_input_2.text = 'Este es un document escrito en Español..'

 language_input_3 = LanguageInput.new
 language_input_3.id = '3'
 language_input_3.text = '这是一个用中文写的文件'

 language_batch_input = LanguageBatchInput.new
 language_batch_input.documents = [language_input_1, language_input_2, language_input_3]

 client.DetectLanguage(language_batch_input)
end
```

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

```ruby
def RecognizeEntities(inputDocuments)
  result = @textAnalyticsClient.entities(
      multi_language_batch_input: inputDocuments
  )

  if (!result.nil? && !result.documents.nil? && result.documents.length > 0)
    puts '===== ENTITY RECOGNITION ====='
    result.documents.each do |document|
      puts "Document ID: #{document.id}"
        document.entities.each do |entity|
          puts "\tName: #{entity.name}, \tType: #{entity.type == nil ? "N/A": entity.type},\tSub-Type: #{entity.sub_type == nil ? "N/A": entity.sub_type}"
          entity.matches.each do |match|
            puts "\tOffset: #{match.offset}, \Length: #{match.length},\tScore: #{match.entity_type_score}"
          end
          puts
        end
    end
  else
    puts 'No results data..'
  end
  puts ''
end
```

Outside of the client function, create a new function called `RecognizeEntitiesExample()` that takes the `TextAnalyticsClient` object created earlier. Create a list of `MultiLanguageInput` objects, containing the documents you want to analyze. Each object will contain an `id`, a `language`, and a `text` attribute. The `text` attribute stores the text to be analyzed, `language` is the language of the text, and the `id` can be any value. Then call the client's `RecognizeEntities()` function.

```ruby
def RecognizeEntitiesExample(client)
  # The documents to be analyzed.
  input_1 = MultiLanguageInput.new
  input_1.id = '1'
  input_1.language = 'en'
  input_1.text = 'Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800.'

  input_2 = MultiLanguageInput.new
  input_2.id = '2'
  input_2.language = 'es'
  input_2.text = 'La sede principal de Microsoft se encuentra en la ciudad de Redmond, a 21 kilómetros de Seattle.'

  multi_language_batch_input =  MultiLanguageBatchInput.new
  multi_language_batch_input.documents = [input_1, input_2]

  client.RecognizeEntities(multi_language_batch_input)
end
```

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

```ruby
def ExtractKeyPhrases(inputDocuments)
  result = @textAnalyticsClient.key_phrases(
      multi_language_batch_input: inputDocuments
  )

  if (!result.nil? && !result.documents.nil? && result.documents.length > 0)
    puts '===== KEY PHRASE EXTRACTION ====='
    result.documents.each do |document|
      puts "Document Id: #{document.id}"
      puts '  Key Phrases'
      document.key_phrases.each do |key_phrase|
        puts "    #{key_phrase}"
      end
    end
  else
    puts 'No results data..'
  end
  puts ''
end
```

Outside of the client function, create a new function called `KeyPhraseExtractionExample()` that takes the `TextAnalyticsClient` object created earlier. Create a list of `MultiLanguageInput` objects, containing the documents you want to analyze. Each object will contain an `id`, a `language`, and a `text` attribute. The `text` attribute stores the text to be analyzed, `language` is the language of the text, and the `id` can be any value. Then call the client's `ExtractKeyPhrases()` function.

```ruby
def KeyPhraseExtractionExample(client)
  # The documents to be analyzed.
  input_1 = MultiLanguageInput.new
  input_1.id = '1'
  input_1.language = 'ja'
  input_1.text = '猫は幸せ'

  input_2 = MultiLanguageInput.new
  input_2.id = '2'
  input_2.language = 'de'
  input_2.text = 'Fahrt nach Stuttgart und dann zum Hotel zu Fu.'

  input_3 = MultiLanguageInput.new
  input_3.id = '3'
  input_3.language = 'en'
  input_3.text = 'My cat is stiff as a rock.'

  input_4 = MultiLanguageInput.new
  input_4.id = '4'
  input_4.language = 'es'
  input_4.text = 'A mi me encanta el fútbol!'

  input_documents =  MultiLanguageBatchInput.new
  input_documents.documents = [input_1, input_2, input_3, input_4]

  client.ExtractKeyPhrases(input_documents)
end
```


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
