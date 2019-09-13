---
author: aahill
ms.service: cognitive-services
ms.topic: include
ms.date: 09/05/2019
ms.author: aahi
---

[Reference documentation](https://docs.microsoft.com/python/api/overview/azure/cognitiveservices/textanalytics?view=azure-python) | [Library source code](https://github.com/Azure/azure-sdk-for-ruby/tree/master/data/azure_cognitiveservices_textanalytics) | [Package (RubyGems)](https://rubygems.org/gems/azure_cognitiveservices_textanalytics) | [Samples](https://github.com/Azure-Samples/cognitive-services-quickstart-code)

<a name="HOLTop"></a>

## Prerequisites

* The current version of [Ruby](https://www.ruby-lang.org/)
* The Text analytics [SDK for Ruby](https://rubygems.org/gems/azure_cognitiveservices_textanalytics)
 
[!INCLUDE [cognitive-services-text-analytics-signup-requirements](../../../../../includes/cognitive-services-text-analytics-signup-requirements.md)]

<a name="RubyProject"></a>

## Create a Ruby project and install the SDK

1. Create a new ruby project and add a new file named `Gemfile`.
2. Add the Text Analytics SDK to the project by adding the below code to `Gemfile`.

```ruby
source 'https://rubygems.org'
gem 'azure_cognitiveservices_textanalytics', '~>0.17.3'
```

## Create a Text analytics client

1. Create a new file named `TextAnalyticsExamples.rb` in your favorite editor or IDE. Import the Text Analytics SDK.

2. A credentials object will be used by the Text Analytics client. Create it with `CognitiveServicesCredentials.new()` and passing your subscription key.

3. Create the client with your correct Text Analytics endpoint.

```ruby
# encoding: UTF-8
# Without this encoding directive, you might get an error such as:
# sdk.rb:60: invalid multibyte char (UTF-8)

require 'azure_cognitiveservices_textanalytics'

include Azure::CognitiveServices::TextAnalytics::V2_1::Models

key_var = "TEXT_ANALYTICS_SUBSCRIPTION_KEY"
if (!ENV[key_var])
    raise "Please set/export the following environment variable: " + key_var
else
    subscription_key = ENV[key_var]
end

endpoint_var = "TEXT_ANALYTICS_ENDPOINT"
if (!ENV[endpoint_var])
    raise "Please set/export the following environment variable: " + endpoint_var
else
    endpoint = ENV[endpoint_var]
end

credentials = MsRestAzure::CognitiveServicesCredentials.new(subscription_key)

textAnalyticsClient =
    Azure::TextAnalytics::Profiles::Latest::Client.new({
        credentials: credentials
    })
textAnalyticsClient.endpoint = endpoint
```

<a name="SentimentAnalysis"></a>

## Sentiment analysis

Using the Text Analytics SDK or API, You can perform sentiment analysis on a set of text records. The following example displays the sentiment scores for several documents.

1. Create a new function called `SentimentAnalysisExample()` which takes the text analytics client created above as a parameter.

2. Define a set of `MultiLanguageInput` objects to be analyzed. Add a language and text for each object. The ID can be any value.

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
```

3. Within the same function, combine the documents into a list. Add it to the `documents` field of a `MultiLanguageBatchInput` object. 

4. Call the client's `sentiment()` function with the `MultiLanguageBatchInput` object as a parameter to send the documents. If any results are returned, print them.
```ruby
    input_documents =  MultiLanguageBatchInput.new
    input_documents.documents = [input_1, input_2, input_3, input_4]

    result = client.sentiment(
        multi_language_batch_input: input_documents
    )
  
    if (!result.nil? && !result.documents.nil? && result.documents.length > 0)
        puts '===== SENTIMENT ANALYSIS ====='
        result.documents.each do |document|
            puts "Document Id: #{document.id}: Sentiment Score: #{document.score}"
        end
    end
end
```

5. Call the `SentimentAnalysisExample()` function.

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

The Text Analytics service can detect the language of a text document across a large number of languages and locales. The following example displays the language that several documents were written in.

1. Create a new function called `DetectLanguageExample()` that takes the text analytics client created above as a parameter. 

2. Define a set of `LanguageInput` objects to be analyzed. Add a language and text for each object. The ID can be any value.

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
```

3. Within the same function, combine the documents into a list. Add it to the `documents` field of a `LanguageBatchInput` object. 

4. Call the client's `detect_language()` function with the `LanguageBatchInput` object as a parameter to send the documents. If any results are returned, print them.
```ruby
    input_documents = LanguageBatchInput.new
    input_documents.documents = [language_input_1, language_input_2, language_input_3]

    result = client.detect_language(
        language_batch_input: input_documents
    )

    if (!result.nil? && !result.documents.nil? && result.documents.length > 0)
        puts '===== LANGUAGE DETECTION ====='
        result.documents.each do |document|
            puts "Document ID: #{document.id} , Language: #{document.detected_languages[0].name}"
        end
    else
        puts 'No results data..'
    end
end
```

5. Call the function `DetectLanguageExample`

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

The Text Analytics service can distinguish and extract different entities (people, places and things) in text documents. The following example displays the entities found in several example documents.

1. Create a new function called `Recognize_Entities()` which takes the text analytics client created above as a parameter.

2. Define a set of `MultiLanguageInput` objects to be analyzed. Add a language and text for each object. The ID can be any value.

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
    ```

3. Within the same function, combine the documents into a list. Add it to the `documents` field of a `MultiLanguageBatchInput` object. 

4. Call the client's `entities()` function with the `MultiLanguageBatchInput` object as a parameter to send the documents. If any results are returned, print them.

```ruby
    input_documents = MultiLanguageBatchInput.new
    input_documents.documents = [input_1, input_2]

    result = client.entities(
    multi_language_batch_input: input_documents
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
end
```

5. Call the function `RecognizeEntitiesExample`
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

The Text Analytics service can extract key-phrases in sentences. The following example displays the entities found in several example documents in multiple languages.

1. Create a new function called `KeyPhraseExtractionExample()` which takes the text analytics client created above as a parameter.

2. Define a set of `MultiLanguageInput` objects to be analyzed. Add a language and text for each object. The ID can be any value.

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
```

3. Within the same function, combine the documents into a list. Add it to the `documents` field of a `MultiLanguageBatchInput` object. 

4. Call the client's `key_phrases()` function with the `MultiLanguageBatchInput` object as a parameter to send the documents. If any results are returned, print them.

```ruby
    input_documents =  MultiLanguageBatchInput.new
    input_documents.documents = [input_1, input_2, input_3, input_4]

    result = client.key_phrases(
        multi_language_batch_input: input_documents
    )

    if (!result.nil? && !result.documents.nil? && result.documents.length > 0)
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
end
```

5. Call the function `KeyPhraseExtractionExample`

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
