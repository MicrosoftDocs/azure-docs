---
title: "Quickstart: Text Analytics v3 client library for Java | Microsoft Docs"
description: Get started with the v3 Text Analytics client library for Java.
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: include
ms.date: 07/15/2021
ms.custom: devx-track-java
ms.author: aahi
ms.reviewer: tasharm, assafi, sumeh
---

<a name="HOLTop"></a>

# [Version 3.1](#tab/version-3-1)

[Reference documentation](/java/api/overview/azure/ai-textanalytics-readme?preserve-view=true&view=azure-java-preview) | [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/textanalytics/azure-ai-textanalytics) | [Package](https://mvnrepository.com/artifact/com.azure/azure-ai-textanalytics/5.1.0) | [Samples](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/textanalytics/azure-ai-textanalytics/src/samples)

# [Version 3.0](#tab/version-3)

[Reference documentation](/java/api/overview/azure/ai-textanalytics-readme) | [Library source code](https://github.com/Azure/azure-sdk-for-java/blob/azure-ai-textanalytics_5.0.0/sdk/textanalytics/azure-ai-textanalytics) | [Package](https://mvnrepository.com/artifact/com.azure/azure-ai-textanalytics/5.0.0) | [Samples](https://github.com/Azure/azure-sdk-for-java/tree/azure-ai-textanalytics_5.0.0/sdk/textanalytics/azure-ai-textanalytics/src/samples/java/com/azure/ai/textanalytics)

---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* [Java Development Kit](https://www.oracle.com/technetwork/java/javase/downloads/index.html) (JDK) with version 8 or above
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Text Analytics resource"  target="_blank">create a Text Analytics resource </a> in the Azure portal to get your key and endpoint.  After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Text Analytics API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
* To use the Analyze feature, you will need a Text Analytics resource with the standard (S) pricing tier.

## Setting up

### Add the client library

# [Version 3.1](#tab/version-3-1)

Create a Maven project in your preferred IDE or development environment. Then add the following dependency to your project's *pom.xml* file. You can find the implementation syntax [for other build tools](https://mvnrepository.com/artifact/com.azure/azure-ai-textanalytics/5.1.0-beta.7) online.

```xml
<dependencies>
     <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-ai-textanalytics</artifactId>
        <version>5.1.0</version>
    </dependency>
</dependencies>
```

# [Version 3.0](#tab/version-3)

Create a Maven project in your preferred IDE or development environment. Then add the following dependency to your project's *pom.xml* file. You can find the implementation syntax [for other build tools](https://mvnrepository.com/artifact/com.azure/azure-ai-textanalytics/5.0.0) online.

```xml
<dependencies>
     <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-ai-textanalytics</artifactId>
        <version>5.0.0</version>
    </dependency>
</dependencies>
```

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it [on GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/java/TextAnalytics/TextAnalyticsSamples.java), which contains the code examples in this quickstart. 

---

Create a Java file named `TextAnalyticsSamples.java`. Open the file and add the following `import` statements:

# [Version 3.1 preview](#tab/version-3-1)


```java

import com.azure.ai.textanalytics.TextAnalyticsAsyncClient;
import com.azure.core.credential.AzureKeyCredential;
import com.azure.ai.textanalytics.models.*;
import com.azure.ai.textanalytics.TextAnalyticsClientBuilder;
import com.azure.ai.textanalytics.TextAnalyticsClient;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import java.util.Arrays;
import com.azure.core.util.Context;
import com.azure.core.util.polling.SyncPoller;
import com.azure.ai.textanalytics.util.AnalyzeHealthcareEntitiesResultCollection;
import com.azure.ai.textanalytics.util.AnalyzeHealthcareEntitiesPagedIterable;
```

# [Version 3.0](#tab/version-3)

```java
import com.azure.core.credential.AzureKeyCredential;
import com.azure.ai.textanalytics.models.*;
import com.azure.ai.textanalytics.TextAnalyticsClientBuilder;
import com.azure.ai.textanalytics.TextAnalyticsClient;
```

---




In the java file, add a new class and add your Azure resource's key and endpoint as shown below.

[!INCLUDE [text-analytics-find-resource-information](../find-azure-resource-info.md)]

```java
public class TextAnalyticsSamples {
    private static String KEY = "<replace-with-your-text-analytics-key-here>";
    private static String ENDPOINT = "<replace-with-your-text-analytics-endpoint-here>";
}
```

Add the following main method to the class. You will define the methods called here later.

# [Version 3.1](#tab/version-3-1)

```java
public static void main(String[] args) {
    //You will create these methods later in the quickstart.
    TextAnalyticsClient client = authenticateClient(KEY, ENDPOINT);

    sentimentAnalysisWithOpinionMiningExample(client)
    detectLanguageExample(client);
    recognizeEntitiesExample(client);
    recognizeLinkedEntitiesExample(client);
    recognizePiiEntitiesExample(client);
    extractKeyPhrasesExample(client);
}
```

# [Version 3.0](#tab/version-3)

```java
public static void main(String[] args) {
    //You will create these methods later in the quickstart.
    TextAnalyticsClient client = authenticateClient(KEY, ENDPOINT);

    sentimentAnalysisExample(client);
    detectLanguageExample(client);
    recognizeEntitiesExample(client);
    recognizeLinkedEntitiesExample(client);
    extractKeyPhrasesExample(client);
        AnalyzeOperationExample(client)
}
```

---


## Object model

The Text Analytics client is a `TextAnalyticsClient` object that authenticates to Azure using your key, and provides functions to accept text as single strings or as a batch. You can send text to the API synchronously, or asynchronously. The response object will contain the analysis information for each document you send. 

## Code examples

* [Authenticate the client](#authenticate-the-client)
* [Sentiment Analysis](#sentiment-analysis) 
* [Opinion mining](#opinion-mining)
* [Language detection](#language-detection)
* [Named Entity recognition](#named-entity-recognition-ner)
* [Entity linking](#entity-linking)
* [Key phrase extraction](#key-phrase-extraction)

## Authenticate the client

Create a method to instantiate the `TextAnalyticsClient` object with the key and endpoint for your Text Analytics resource. This example is the same for versions 3.0 and 3.1 of the API.

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

# [Version 3.1](#tab/version-3-1)

> [!NOTE]
> In version `3.1`:
> * Sentiment Analysis includes Opinion Mining analysis which is optional flag. 
> * Opinion Mining contains aspect and opinion level sentiment. 

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
}
```

### Output

```console
Recognized document sentiment: positive, positive score: 1.0, neutral score: 0.0, negative score: 0.0.
Recognized sentence sentiment: positive, positive score: 1.0, neutral score: 0.0, negative score: 0.0.
Recognized sentence sentiment: neutral, positive score: 0.21, neutral score: 0.77, negative score: 0.02.
```

## Opinion mining

To perform sentiment analysis with opinion mining, create a new function called `sentimentAnalysisWithOpinionMiningExample()` that takes the client that you created earlier, and call its `analyzeSentiment()` function with setting option object `AnalyzeSentimentOptions`. The returned `AnalyzeSentimentResult` object will contain `documentSentiment` and `sentenceSentiments` if successful, or an `errorMessage` if not. 


```java
 static void sentimentAnalysisWithOpinionMiningExample(TextAnalyticsClient client)
 {
     // The document that needs be analyzed.
     String document = "Bad atmosphere. Not close to plenty of restaurants, hotels, and transit! Staff are not friendly and helpful.";

     System.out.printf("Document = %s%n", document);

     AnalyzeSentimentOptions options = new AnalyzeSentimentOptions().setIncludeOpinionMining(true);
     final DocumentSentiment documentSentiment = client.analyzeSentiment(document, "en", options);
     SentimentConfidenceScores scores = documentSentiment.getConfidenceScores();
     System.out.printf(
             "Recognized document sentiment: %s, positive score: %f, neutral score: %f, negative score: %f.%n",
             documentSentiment.getSentiment(), scores.getPositive(), scores.getNeutral(), scores.getNegative());


     documentSentiment.getSentences().forEach(sentenceSentiment -> {
         SentimentConfidenceScores sentenceScores = sentenceSentiment.getConfidenceScores();
         System.out.printf("\tSentence sentiment: %s, positive score: %f, neutral score: %f, negative score: %f.%n",
                 sentenceSentiment.getSentiment(), sentenceScores.getPositive(), sentenceScores.getNeutral(), sentenceScores.getNegative());
         sentenceSentiment.getOpinions().forEach(opinion -> {
             TargetSentiment targetSentiment = opinion.getTarget();
             System.out.printf("\t\tTarget sentiment: %s, target text: %s%n", targetSentiment.getSentiment(),
                     targetSentiment.getText());
             for (AssessmentSentiment assessmentSentiment : opinion.getAssessments()) {
                 System.out.printf("\t\t\t'%s' assessment sentiment because of \"%s\". Is the assessment negated: %s.%n",
                         assessmentSentiment.getSentiment(), assessmentSentiment.getText(), assessmentSentiment.isNegated());
             }
         });
     });
 }
```

### Output

```console
Document = Bad atmosphere. Not close to plenty of restaurants, hotels, and transit! Staff are not friendly and helpful.
Recognized document sentiment: negative, positive score: 0.010000, neutral score: 0.140000, negative score: 0.850000.
	Sentence sentiment: negative, positive score: 0.000000, neutral score: 0.000000, negative score: 1.000000.
		Target sentiment: negative, target text: atmosphere
			'negative' assessment sentiment because of "bad". Is the assessment negated: false.
	Sentence sentiment: negative, positive score: 0.020000, neutral score: 0.440000, negative score: 0.540000.
	Sentence sentiment: negative, positive score: 0.000000, neutral score: 0.000000, negative score: 1.000000.
		Target sentiment: negative, target text: Staff
			'negative' assessment sentiment because of "friendly". Is the assessment negated: true.
			'negative' assessment sentiment because of "helpful". Is the assessment negated: true.
```

# [Version 3.0](#tab/version-3)

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
}
```

### Output

```console
Recognized document sentiment: positive, positive score: 1.0, neutral score: 0.0, negative score: 0.0.
Recognized sentence sentiment: positive, positive score: 1.0, neutral score: 0.0, negative score: 0.0.
Recognized sentence sentiment: neutral, positive score: 0.21, neutral score: 0.77, negative score: 0.02.
```

---

## Language detection

Create a new function called `detectLanguageExample()` that takes the client that you created earlier, and call its `detectLanguage()` function. The returned `DetectLanguageResult` object will contain a primary language detected, a list of other languages detected if successful, or an `errorMessage` if not. This example is the same for versions 3.0 and 3.1 of the API.

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

## Named Entity Recognition (NER)

# [Version 3.1](#tab/version-3-1)

> [!NOTE]
> In version `3.1`:
> * NER includes separate methods for detecting personal information. 
> * Entity linking is a separate request than NER.

Create a new function called `recognizeEntitiesExample()` that takes the client that you created earlier, and call its `recognizeEntities()` function. The returned `CategorizedEntityCollection` object will contain a list of `CategorizedEntity` if successful, or an `errorMessage` if not.

```java
static void recognizeEntitiesExample(TextAnalyticsClient client)
{
    // The text that need be analyzed.
    String text = "I had a wonderful trip to Seattle last week.";

    for (CategorizedEntity entity : client.recognizeEntities(text)) {
        System.out.printf(
            "Recognized entity: %s, entity category: %s, entity sub-category: %s, score: %s, offset: %s, length: %s.%n",
            entity.getText(),
            entity.getCategory(),
            entity.getSubcategory(),
            entity.getConfidenceScore(),
            entity.getOffset(),
            entity.getLength());
    }
}
```

### Output

```console
Recognized entity: trip, entity category: Event, entity sub-category: null, score: 0.61, offset: 8, length: 4.
Recognized entity: Seattle, entity category: Location, entity sub-category: GPE, score: 0.82, offset: 16, length: 7.
Recognized entity: last week, entity category: DateTime, entity sub-category: DateRange, score: 0.8, offset: 24, length: 9.
```


## Personally Identifiable Information (PII) recognition

Create a new function called `recognizePiiEntitiesExample()` that takes the client that you created earlier, and call its `recognizePiiEntities()` function. The returned `PiiEntityCollection` object will contain a list of `PiiEntity` if successful, or an `errorMessage` if not. It will also
contain the redacted text, which consists of the input text with all identifiable entities replaced with `*****`.

```java
static void recognizePiiEntitiesExample(TextAnalyticsClient client)
{
    // The text that need be analyzed.
    String document = "My SSN is 859-98-0987";
    PiiEntityCollection piiEntityCollection = client.recognizePiiEntities(document);
    System.out.printf("Redacted Text: %s%n", piiEntityCollection.getRedactedText());
    piiEntityCollection.forEach(entity -> System.out.printf(
        "Recognized Personally Identifiable Information entity: %s, entity category: %s, entity subcategory: %s,"
            + " confidence score: %f.%n",
        entity.getText(), entity.getCategory(), entity.getSubcategory(), entity.getConfidenceScore()));
}
```

### Output

```console
Redacted Text: My SSN is ***********
Recognized Personally Identifiable Information entity: 859-98-0987, entity category: U.S. Social Security Number (SSN), entity subcategory: null, confidence score: 0.650000.
```

# [Version 3.0](#tab/version-3)

> [!NOTE]
> In version `3.0`:
> * NER includes separate methods for detecting personal information. 
> * Entity linking is a separate request than NER.

Create a new function called `recognizeEntitiesExample()` that takes the client that you created earlier, and call its `recognizeEntities()` function. The returned `CategorizedEntityCollection` object will contain a list of `CategorizedEntity` if successful, or an `errorMessage` if not.

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

---

## Entity linking

# [Version 3.1](#tab/version-3-1)

Create a new function called `recognizeLinkedEntitiesExample()` that takes the client that you created earlier, and call its `recognizeLinkedEntities()` function. The returned `LinkedEntityCollection` object will contain a list of `LinkedEntity` if successful, or an `errorMessage` if not. Since linked entities are uniquely identified, occurrences of the same entity are grouped under a `LinkedEntity` object as a list of `LinkedEntityMatch` objects.


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
            System.out.printf("Text: %s, Score: %.2f, Offset: %s, Length: %s%n",
            linkedEntityMatch.getText(),
            linkedEntityMatch.getConfidenceScore(),
            linkedEntityMatch.getOffset(),
            linkedEntityMatch.getLength());
        }
    }
}
```

### Output

```console
Linked Entities:
Name: Microsoft, ID: Microsoft, URL: https://en.wikipedia.org/wiki/Microsoft, Data Source: Wikipedia.
Matches:
Text: Microsoft, Score: 0.55, Offset: 9, Length: 0
Text: Microsoft, Score: 0.55, Offset: 9, Length: 150
Name: Bill Gates, ID: Bill Gates, URL: https://en.wikipedia.org/wiki/Bill_Gates, Data Source: Wikipedia.
Matches:
Text: Bill Gates, Score: 0.63, Offset: 10, Length: 25
Text: Gates, Score: 0.63, Offset: 5, Length: 161
Name: Paul Allen, ID: Paul Allen, URL: https://en.wikipedia.org/wiki/Paul_Allen, Data Source: Wikipedia.
Matches:
Text: Paul Allen, Score: 0.60, Offset: 10, Length: 40
Name: April 4, ID: April 4, URL: https://en.wikipedia.org/wiki/April_4, Data Source: Wikipedia.
Matches:
Text: April 4, Score: 0.32, Offset: 7, Length: 54
Name: BASIC, ID: BASIC, URL: https://en.wikipedia.org/wiki/BASIC, Data Source: Wikipedia.
Matches:
Text: BASIC, Score: 0.33, Offset: 5, Length: 89
Name: Altair 8800, ID: Altair 8800, URL: https://en.wikipedia.org/wiki/Altair_8800, Data Source: Wikipedia.
Matches:
Text: Altair 8800, Score: 0.88, Offset: 11, Length: 116
```

# [Version 3.0](#tab/version-3)

Create a new function called `recognizeLinkedEntitiesExample()` that takes the client that you created earlier, and call its `recognizeLinkedEntities()` function. The returned `LinkedEntityCollection` object will contain a list of `LinkedEntity` if successful, or an `errorMessage` if not. Since linked entities are uniquely identified, occurrences of the same entity are grouped under a `LinkedEntity` object as a list of `LinkedEntityMatch` objects.

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

---

## Key phrase extraction

Create a new function called `extractKeyPhrasesExample()` that takes the client that you created earlier, and call its `extractKeyPhrases()` function. The returned `ExtractKeyPhraseResult` object will contain a list of key phrases if successful, or an `errorMessage` if not. This example is the same for version 3.0 and 3.1 of the API.

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
---

## Extract health entities

# [Version 3.1](#tab/version-3-1)

You can use Text Analytics to perform an asynchronous request to extract healthcare entities from text. The below sample shows a basic example. You can find a more advanced sample [on GitHub](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/textanalytics/azure-ai-textanalytics/src/samples/java/com/azure/ai/textanalytics/lro/AnalyzeHealthcareEntities.java).


```java
static void healthExample(TextAnalyticsClient client){
    List<TextDocumentInput> documents = Arrays.asList(
            new TextDocumentInput("0",
                    "Prescribed 100mg ibuprofen, taken twice daily."));

    AnalyzeHealthcareEntitiesOptions options = new AnalyzeHealthcareEntitiesOptions().setIncludeStatistics(true);

    SyncPoller<AnalyzeHealthcareEntitiesOperationDetail, AnalyzeHealthcareEntitiesPagedIterable>
            syncPoller = client.beginAnalyzeHealthcareEntities(documents, options, Context.NONE);

    System.out.printf("Poller status: %s.%n", syncPoller.poll().getStatus());
    syncPoller.waitForCompletion();

    // Task operation statistics
    AnalyzeHealthcareEntitiesOperationDetail operationResult = syncPoller.poll().getValue();
    System.out.printf("Operation created time: %s, expiration time: %s.%n",
            operationResult.getCreatedAt(), operationResult.getExpiresAt());
    System.out.printf("Poller status: %s.%n", syncPoller.poll().getStatus());

    for (AnalyzeHealthcareEntitiesResultCollection resultCollection : syncPoller.getFinalResult()) {
        // Model version
        System.out.printf(
                "Results of Azure Text Analytics \"Analyze Healthcare Entities\" Model, version: %s%n",
                resultCollection.getModelVersion());

        for (AnalyzeHealthcareEntitiesResult healthcareEntitiesResult : resultCollection) {
            System.out.println("Document ID = " + healthcareEntitiesResult.getId());
            System.out.println("Document entities: ");
            // Recognized healthcare entities
            for (HealthcareEntity entity : healthcareEntitiesResult.getEntities()) {
                System.out.printf(
                        "\tText: %s, normalized name: %s, category: %s, subcategory: %s, confidence score: %f.%n",
                        entity.getText(), entity.getNormalizedText(), entity.getCategory(),
                        entity.getSubcategory(), entity.getConfidenceScore());
            }
            // Recognized healthcare entity relation groups
            for (HealthcareEntityRelation entityRelation : healthcareEntitiesResult.getEntityRelations()) {
                System.out.printf("Relation type: %s.%n", entityRelation.getRelationType());
                for (HealthcareEntityRelationRole role : entityRelation.getRoles()) {
                    HealthcareEntity entity = role.getEntity();
                    System.out.printf("\tEntity text: %s, category: %s, role: %s.%n",
                            entity.getText(), entity.getCategory(), role.getName());
                }
            }
        }
    }
}
```

### output

```console
Poller status: IN_PROGRESS.
Operation created time: 2021-07-20T19:45:50Z, expiration time: 2021-07-21T19:45:50Z.
Poller status: SUCCESSFULLY_COMPLETED.
Results of Azure Text Analytics "Analyze Healthcare Entities" Model, version: 2021-05-15
Document ID = 0
Document entities: 
	Text: 100mg, normalized name: null, category: Dosage, subcategory: null, confidence score: 1.000000.
	Text: ibuprofen, normalized name: ibuprofen, category: MedicationName, subcategory: null, confidence score: 1.000000.
	Text: twice daily, normalized name: null, category: Frequency, subcategory: null, confidence score: 1.000000.
Relation type: DosageOfMedication.
	Entity text: 100mg, category: Dosage, role: Dosage.
	Entity text: ibuprofen, category: MedicationName, role: Medication.
Relation type: FrequencyOfMedication.
	Entity text: ibuprofen, category: MedicationName, role: Medication.
	Entity text: twice daily, category: Frequency, role: Frequency.
```

# [Version 3.0](#tab/version-3)

This feature is not available in version 3.0.

---

## Use the API asynchronously with the Analyze operation

# [Version 3.1](#tab/version-3-1)

You can use the Analyze operation to perform asynchronous batch requests for: NER, key phrase extraction, sentiment analysis, and PII detection. The below sample shows a basic example on one operation. You can find a more advanced sample [on GitHub](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/textanalytics/Azure.AI.TextAnalytics/samples/Sample_AnalyzeActions.md)

[!INCLUDE [Analyze Batch Action pricing](../analyze-operation-pricing-caution.md)]

Create a new function called `analyzeBatchActionsExample()`, which calls the `beginAnalyzeBatchActions()` function. The result will be a long running operation which will be polled for results.

```java
static void analyzeActionsExample(TextAnalyticsClient client){
        List<TextDocumentInput> documents = new ArrayList<>();
        documents.add(new TextDocumentInput("0", "Microsoft was founded by Bill Gates and Paul Allen."));


        SyncPoller<AnalyzeActionsOperationDetail, AnalyzeActionsResultPagedIterable> syncPoller =
                client.beginAnalyzeActions(documents,
                        new TextAnalyticsActions().setDisplayName("Example analyze task")
                                .setRecognizeEntitiesActions(new RecognizeEntitiesAction())
                                .setExtractKeyPhrasesActions(
                                        new ExtractKeyPhrasesAction().setModelVersion("latest")),
                        new AnalyzeActionsOptions().setIncludeStatistics(false),
                        Context.NONE);

        // Task operation statistics details
        while (syncPoller.poll().getStatus() == LongRunningOperationStatus.IN_PROGRESS) {
            final AnalyzeActionsOperationDetail operationDetail = syncPoller.poll().getValue();
            System.out.printf("Action display name: %s, Successfully completed actions: %d, in-process actions: %d,"
                            + " failed actions: %d, total actions: %d%n",
                    operationDetail.getDisplayName(), operationDetail.getSucceededCount(),
                    operationDetail.getInProgressCount(), operationDetail.getFailedCount(),
                    operationDetail.getTotalCount());
        }

        syncPoller.waitForCompletion();

        Iterable<PagedResponse<AnalyzeActionsResult>> pagedResults = syncPoller.getFinalResult().iterableByPage();
        for (PagedResponse<AnalyzeActionsResult> perPage : pagedResults) {
            System.out.printf("Response code: %d, Continuation Token: %s.%n", perPage.getStatusCode(),
                    perPage.getContinuationToken());
            for (AnalyzeActionsResult actionsResult : perPage.getElements()) {
                System.out.println("Entities recognition action results:");
                for (RecognizeEntitiesActionResult actionResult : actionsResult.getRecognizeEntitiesResults()) {
                    if (!actionResult.isError()) {
                        for (RecognizeEntitiesResult documentResult : actionResult.getDocumentsResults()) {
                            if (!documentResult.isError()) {
                                for (CategorizedEntity entity : documentResult.getEntities()) {
                                    System.out.printf(
                                            "\tText: %s, category: %s, confidence score: %f.%n",
                                            entity.getText(), entity.getCategory(), entity.getConfidenceScore());
                                }
                            } else {
                                System.out.printf("\tCannot recognize entities. Error: %s%n",
                                        documentResult.getError().getMessage());
                            }
                        }
                    } else {
                        System.out.printf("\tCannot execute Entities Recognition action. Error: %s%n",
                                actionResult.getError().getMessage());
                    }
                }

                System.out.println("Key phrases extraction action results:");
                for (ExtractKeyPhrasesActionResult actionResult : actionsResult.getExtractKeyPhrasesResults()) {
                    if (!actionResult.isError()) {
                        for (ExtractKeyPhraseResult documentResult : actionResult.getDocumentsResults()) {
                            if (!documentResult.isError()) {
                                System.out.println("\tExtracted phrases:");
                                for (String keyPhrases : documentResult.getKeyPhrases()) {
                                    System.out.printf("\t\t%s.%n", keyPhrases);
                                }
                            } else {
                                System.out.printf("\tCannot extract key phrases. Error: %s%n",
                                        documentResult.getError().getMessage());
                            }
                        }
                    } else {
                        System.out.printf("\tCannot execute Key Phrases Extraction action. Error: %s%n",
                                actionResult.getError().getMessage());
                    }
                }
            }
        }
    }
```

After you add this example to your application, call it in your `main()` method.

```java
analyzeBatchActionsExample(client);
```

### Output

```console
Action display name: Example analyze task, Successfully completed actions: 1, in-process actions: 1, failed actions: 0, total actions: 2
Response code: 200, Continuation Token: null.
Entities recognition action results:
	Text: Microsoft, category: Organization, confidence score: 1.000000.
	Text: Bill Gates, category: Person, confidence score: 1.000000.
	Text: Paul Allen, category: Person, confidence score: 1.000000.
Key phrases extraction action results:
	Extracted phrases:
		Bill Gates.
		Paul Allen.
		Microsoft.
```

You can also use the Analyze operation to perform NER, key phrase extraction, sentiment analysis and detect PII. See the [Analyze sample](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/textanalytics/azure-ai-textanalytics/src/samples/java/com/azure/ai/textanalytics/lro/AnalyzeActionsAsync.java) on GitHub.

# [Version 3.0](#tab/version-3)

This feature is not available in version 3.0.

---
