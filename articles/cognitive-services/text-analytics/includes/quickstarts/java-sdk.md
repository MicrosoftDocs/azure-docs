---
title: "Quickstart: Text Analytics v3 client library for Java | Microsoft Docs"
description: Get started with the v3 Text Analytics client library for Java.
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: include
ms.date: 03/17/2020
ms.author: aahi
ms.reviewer: tasharm, assafi, sumeh
---

<a name="HOLTop"></a>

[Reference documentation](https://aka.ms/azsdk-java-textanalytics-ref-docs) | [Library source code](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/textanalytics/azure-ai-textanalytics) | [Package](https://mvnrepository.com/artifact/com.azure/azure-ai-textanalytics/1.0.0) | [Samples](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/textanalytics/azure-ai-textanalytics/src/samples/java/com/azure/ai/textanalytics)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* [Java Development Kit](https://www.oracle.com/technetwork/java/javase/downloads/index.html) (JDK) with version 8 or above
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Text Analytics resource"  target="_blank">create a Text Analytics resource <span class="docon docon-navigate-external x-hidden-focus"></span></a> in the Azure portal to get your key and endpoint.  After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Text Analytics API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Setting up

### Add the client library

Create a Maven project in your preferred IDE or development environment. Then add the following dependency to your project's *pom.xml* file. You can find the implementation syntax [for other build tools](https://mvnrepository.com/artifact/com.azure/azure-ai-textanalytics/1.0.0) online.

```xml
<dependencies>
     <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-ai-textanalytics</artifactId>
        <version>1.0.0</version>
    </dependency>
</dependencies>
```

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it [on GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/java/TextAnalytics/TextAnalyticsSamples.java), which contains the code examples in this quickstart. 

Create a Java file named `TextAnalyticsSamples.java`. Open the file and add the following `import` statements:

```java
import com.azure.core.credential.AzureKeyCredential;
import com.azure.ai.textanalytics.models.*;
import com.azure.ai.textanalytics.TextAnalyticsClientBuilder;
import com.azure.ai.textanalytics.TextAnalyticsClient;
```

In the java file, add a new class and add your Azure resource's key and endpoint as shown below.

[!INCLUDE [text-analytics-find-resource-information](../find-azure-resource-info.md)]

```java
public class TextAnalyticsSamples {
    private static String KEY = "<replace-with-your-text-analytics-key-here>";
    private static String ENDPOINT = "<replace-with-your-text-analytics-endpoint-here>";
}
```

Add the following main method to the class. You will define the methods called here later.

```java
public static void main(String[] args) {
    //You will create these methods later in the quickstart.
    TextAnalyticsClient client = authenticateClient(KEY, ENDPOINT);

    sentimentAnalysisExample(client);
    detectLanguageExample(client);
    recognizeEntitiesExample(client);
    recognizeLinkedEntitiesExample(client);
    extractKeyPhrasesExample(client);
}
```

## Object model

The Text Analytics client is a `TextAnalyticsClient` object that authenticates to Azure using your key, and provides functions to accept text as single strings or as a batch. You can send text to the API synchronously, or asynchronously. The response object will contain the analysis information for each document you send. 

## Code examples

* [Authenticate the client](#authenticate-the-client)
* [Sentiment Analysis](#sentiment-analysis) 
* [Language detection](#language-detection)
* [Named Entity recognition](#named-entity-recognition-ner) 
* [Entity linking](#entity-linking)
* [Key phrase extraction](#key-phrase-extraction)

## Authenticate the client

Create a method to instantiate the `TextAnalyticsClient` object with the key and endpoint for your Text Analytics resource.

```java
static TextAnalyticsClient authenticateClient(String key, String endpoint) {
    return new TextAnalyticsClientBuilder()
        .credential(new AzureKeyCredential(key))
        .endpoint(endpoint)
        .buildClient();
}
```

In your program's `main()` method, call the authentication method to instantiate the client.

## Sentiment analysis

Create a new function called `sentimentAnalysisExample()` that takes the client that you created earlier, and call its `analyzeSentiment()` function. The returned `AnalyzeSentimentResult` object will contain `documentSentiment` and `sentenceSentiments` if successful, or an `errorMessage` if not. 

```java
static void sentimentAnalysisExample(TextAnalyticsClient client)
{
    // The text that need be analyzed.
    String text = "I had the best day of my life. I wish you were there with me.";

    DocumentSentiment documentSentiment = client.analyzeSentiment(text);
    System.out.printf(
        "Recognized document sentiment: %s, positive score: %s, neutral score: %s, negative score: %s.%n",
        documentSentiment.getSentiment(),
        documentSentiment.getConfidenceScores().getPositive(),
        documentSentiment.getConfidenceScores().getNeutral(),
        documentSentiment.getConfidenceScores().getNegative());

    for (SentenceSentiment sentenceSentiment : documentSentiment.getSentences()) {
        System.out.printf(
            "Recognized sentence sentiment: %s, positive score: %s, neutral score: %s, negative score: %s.%n",
            sentenceSentiment.getSentiment(),
            sentenceSentiment.getConfidenceScores().getPositive(),
            sentenceSentiment.getConfidenceScores().getNeutral(),
            sentenceSentiment.getConfidenceScores().getNegative());
        }
    }
```

### Output

```console
Recognized document sentiment: positive, positive score: 1.0, neutral score: 0.0, negative score: 0.0.
Recognized sentence sentiment: positive, positive score: 1.0, neutral score: 0.0, negative score: 0.0.
Recognized sentence sentiment: neutral, positive score: 0.21, neutral score: 0.77, negative score: 0.02.
```

## Language detection

Create a new function called `detectLanguageExample()` that takes the client that you created earlier, and call its `detectLanguage()` function. The returned `DetectLanguageResult` object will contain a primary language detected, a list of other languages detected if successful, or an `errorMessage` if not.

> [!Tip]
> In some cases it may be hard to disambiguate languages based on the input. You can use the `countryHint` parameter to specify a 2-letter country code. By default the API is using the "US" as the default countryHint, to remove this behavior you can reset this parameter by setting this value to empty string `countryHint = ""`. To set a different default, set the `TextAnalyticsClientOptions.DefaultCountryHint` property and pass it during the client's initialization.

```java
static void detectLanguageExample(TextAnalyticsClient client)
{
    // The text that need be analyzed.
    String text = "Ce document est rédigé en Français.";

    DetectedLanguage detectedLanguage = client.detectLanguage(text);
    System.out.printf("Detected primary language: %s, ISO 6391 name: %s, score: %.2f.%n",
        detectedLanguage.getName(),
        detectedLanguage.getIso6391Name(),
        detectedLanguage.getConfidenceScore());
}
```

### Output

```console
Detected primary language: French, ISO 6391 name: fr, score: 1.00.
```
## Named Entity recognition (NER)

> [!NOTE]
> In version `3.0`:
> * NER includes separate methods for detecting personal information. 
> * Entity linking is a separate request than NER.

Create a new function called `recognizeEntitiesExample()` that takes the client that you created earlier, and call its `recognizeEntities()` function. The returned `RecognizeEntitiesResult` object will contain a list of `NamedEntity` if successful, or an `errorMessage` if not.

```java
static void recognizeEntitiesExample(TextAnalyticsClient client)
{
    // The text that need be analyzed.
    String text = "I had a wonderful trip to Seattle last week.";

    for (CategorizedEntity entity : client.recognizeEntities(text)) {
        System.out.printf(
            "Recognized entity: %s, entity category: %s, entity sub-category: %s, score: %s.%n",
            entity.getText(),
            entity.getCategory(),
            entity.getSubcategory(),
            entity.getConfidenceScore());
    }
}
```

### Output

```console
Recognized entity: trip, entity category: Event, entity sub-category: null, score: 0.61.
Recognized entity: Seattle, entity category: Location, entity sub-category: GPE, score: 0.82.
Recognized entity: last week, entity category: DateTime, entity sub-category: DateRange, score: 0.8.
```

## Entity linking

Create a new function called `recognizeLinkedEntitiesExample()` that takes the client that you created earlier, and call its `recognizeLinkedEntities()` function. The returned `RecognizeLinkedEntitiesResult` object will contain a list of `LinkedEntity` if successful, or an `errorMessage` if not. Since linked entities are uniquely identified, occurrences of the same entity are grouped under a `LinkedEntity` object as a list of `LinkedEntityMatch` objects.

```java
static void recognizeLinkedEntitiesExample(TextAnalyticsClient client)
{
    // The text that need be analyzed.
    String text = "Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, " +
        "to develop and sell BASIC interpreters for the Altair 8800. " +
        "During his career at Microsoft, Gates held the positions of chairman, " +
        "chief executive officer, president and chief software architect, " +
        "while also being the largest individual shareholder until May 2014.";

    System.out.printf("Linked Entities:%n");
    for (LinkedEntity linkedEntity : client.recognizeLinkedEntities(text)) {
        System.out.printf("Name: %s, ID: %s, URL: %s, Data Source: %s.%n",
            linkedEntity.getName(),
            linkedEntity.getDataSourceEntityId(),
            linkedEntity.getUrl(),
            linkedEntity.getDataSource());
        System.out.printf("Matches:%n");
        for (LinkedEntityMatch linkedEntityMatch : linkedEntity.getMatches()) {
            System.out.printf("Text: %s, Score: %.2f%n",
            linkedEntityMatch.getText(),
            linkedEntityMatch.getConfidenceScore());
        }
    }
}
```

### Output

```console
Linked Entities:
Name: Altair 8800, ID: Altair 8800, URL: https://en.wikipedia.org/wiki/Altair_8800, Data Source: Wikipedia.
Matches:
Text: Altair 8800, Score: 0.88
Name: Bill Gates, ID: Bill Gates, URL: https://en.wikipedia.org/wiki/Bill_Gates, Data Source: Wikipedia.
Matches:
Text: Bill Gates, Score: 0.63
Text: Gates, Score: 0.63
Name: Paul Allen, ID: Paul Allen, URL: https://en.wikipedia.org/wiki/Paul_Allen, Data Source: Wikipedia.
Matches:
Text: Paul Allen, Score: 0.60
Name: Microsoft, ID: Microsoft, URL: https://en.wikipedia.org/wiki/Microsoft, Data Source: Wikipedia.
Matches:
Text: Microsoft, Score: 0.55
Text: Microsoft, Score: 0.55
Name: April 4, ID: April 4, URL: https://en.wikipedia.org/wiki/April_4, Data Source: Wikipedia.
Matches:
Text: April 4, Score: 0.32
Name: BASIC, ID: BASIC, URL: https://en.wikipedia.org/wiki/BASIC, Data Source: Wikipedia.
Matches:
Text: BASIC, Score: 0.33
```
## Key phrase extraction

Create a new function called `extractKeyPhrasesExample()` that takes the client that you created earlier, and call its `extractKeyPhrases()` function. The returned `ExtractKeyPhraseResult` object will contain a list of key phrases if successful, or an `errorMessage` if not.

```java
static void extractKeyPhrasesExample(TextAnalyticsClient client)
{
    // The text that need be analyzed.
    String text = "My cat might need to see a veterinarian.";

    System.out.printf("Recognized phrases: %n");
    for (String keyPhrase : client.extractKeyPhrases(text)) {
        System.out.printf("%s%n", keyPhrase);
    }
}
```

### Output

```console
Recognized phrases: 
cat
veterinarian
```
