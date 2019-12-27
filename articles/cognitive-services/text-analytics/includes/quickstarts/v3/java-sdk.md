---
title: "Quickstart: Text Analytics client library for Java | Microsoft Docs"
description: Get started with the Text Analytics client library for Java...
services: cognitive-services
author: tasharm
manager: assafi
ms.service: cognitive-services
ms.subservice: 
ms.topic: quickstart
ms.date: 12/27/2019
ms.author: tasharm
---

<a name="HOLTop"></a>

[Reference documentation](https://docs.microsoft.com/dotnet/api/overview/azure/cognitiveservices/client/textanalytics?view=azure-dotnet-preview) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Language.TextAnalytics) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Language.TextAnalytics/) | [Samples](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples)

> [!NOTE]
> The code in this article uses the synchronous methods of the Text Analytics java SDK for simplicity. For production scenarios, we recommend using the batched asynchronous methods for performance and scalability. For example, calling [SentimentBatchAsync()](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.textanalyticsclientextensions.sentimentbatchasync?view=azure-dotnet&viewFallbackFrom=azure-dotnet-preview) instead of [Sentiment()](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.textanalyticsclientextensions.sentiment?view=azure-dotnet).

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* Eclipse IDE - [Install from here](https://www.eclipse.org/downloads/)
* Java Development Kit (JDK) with version 8 or above

## Setting up

### Create a Text Analytics Azure resource

[!INCLUDE [text-analytics-resource-creation](resource-creation.md)]

### Create a new maven project in eclipse

Using the eclipse IDE, create a new maven project.

Add the following dependencies to your pom file.

```console
<dependencies>
 	<dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-ai-textanalytics</artifactId>
        <version>1.0.0-beta.1</version>
    </dependency>
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-core</artifactId>
       	<version>1.1.0</version>
    </dependency>
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-core-http-netty</artifactId>
        <version>1.1.0</version>
    </dependency>
</dependencies>
```
Create a new java file with under `\src\main\java`. 

Open the java file and add the following `import` statements:

```java
import com.azure.ai.textanalytics.models.AnalyzeSentimentResult;
import com.azure.ai.textanalytics.models.DetectLanguageResult;
import com.azure.ai.textanalytics.models.DetectedLanguage;
import com.azure.ai.textanalytics.models.ExtractKeyPhraseResult;
import com.azure.ai.textanalytics.models.LinkedEntity;
import com.azure.ai.textanalytics.models.NamedEntity;
import com.azure.ai.textanalytics.models.RecognizeEntitiesResult;
import com.azure.ai.textanalytics.models.RecognizeLinkedEntitiesResult;
import com.azure.ai.textanalytics.models.RecognizePiiEntitiesResult;
import com.azure.ai.textanalytics.models.TextSentiment;
import com.azure.ai.textanalytics.TextAnalyticsClientBuilder;
import com.azure.ai.textanalytics.TextAnalyticsClient;
import java.util.List;
```

In the java file, add a new class and add your azure resource's key and endpoint as shown below.

```java
public class TextAnalyticsSample {
    private static String SUBSCRIPTION_KEY = "<<enter-your-key-here>>";
    private static String ENDPOINT = "<<enter-your-endpoint-here>>";
}
```

Add the following main method to the class. You will define the methods called here later.

```java
public static void main(String[] args) {
    
    TextAnalyticsClient client = authenticateClient(SUBSCRIPTION_KEY, ENDPOINT);
    
    sentimentAnalysisExample(client);
    detectLanguageExample(client);
    recognizeEntitiesExample(client);
    recognizePiiEntitiesExample(client);
    recognizeLinkedEntitiesExample(client);
    extractKeyPhrasesExample(client);
}
```

## Object model

The Text Analytics client is a [TextAnalyticsClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.textanalyticsclient?view=azure-dotnet) object that authenticates to Azure using your key, and provides functions to accept text as single strings or as a batch. You can send text to the API synchronously, or asynchronously. The response object will contain the analysis information for each document you send. 

## Code examples

* [Authenticate the client](#authenticate-the-client)
* [Sentiment Analysis](#sentiment-analysis)
* [Language detection](#language-detection)
* [Entity recognition](#entity-recognition)
* [PII entity recognition](#entity-pii-recognition)
* [Entity linking](#entity-linking)
* [Key phrase extraction](#key-phrase-extraction)

## Authenticate the client

Create a method to instantiate the [TextAnalyticsClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.textanalyticsclient?view=azure-dotnet) object with your `SUBSCRIPTION_KEY` AND `ENDPOINT` created above.

```java
static TextAnalyticsClient authenticateClient(String subscriptionKey, String endpoint) {
    return new TextAnalyticsClientBuilder()
    .subscriptionKey(subscriptionKey)
    .endpoint(endpoint)
    .buildClient();
}
```

In your program's `main()` method, call the authentication method to instantiate the client.

## Sentiment analysis

Create a new function called `sentimentAnalysisExample()` that takes the client that you created earlier, and call its [analyzeSentiment()](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.textanalyticsclientextensions.sentiment?view=azure-dotnet) function. The returned [AnalyzeSentimentResult](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.models.sentimentresult?view=azure-dotnet) object will contain [documentSentiment](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.models.sentimentresult?view=azure-dotnet) and [sentenceSentiments](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.models.sentimentresult?view=azure-dotnet) if successful, and an `errorMessage` if not. 

```java
static void sentimentAnalysisExample(TextAnalyticsClient client)
{
    // The text that need be analyzed.
    String text = "I had the best day of my life. I wish you were there with me.";

    AnalyzeSentimentResult sentimentResult = client.analyzeSentiment(text);
    TextSentiment documentSentiment = sentimentResult.getDocumentSentiment();
    System.out.printf(
        "Recognized TextSentiment: %s, Positive Score: %.2f, Neutral Score: %.2f, Negative Score: %.2f.%n",
        documentSentiment.getTextSentimentClass(),
        documentSentiment.getPositiveScore(),
        documentSentiment.getNeutralScore(),
        documentSentiment.getNegativeScore());

    List<TextSentiment> sentiments = sentimentResult.getSentenceSentiments();
    for (TextSentiment textSentiment : sentiments) {
        System.out.printf(
            "Recognized Sentence TextSentiment: %s, Positive Score: %.2f, Neutral Score: %.2f, Negative Score: %.2f.%n",
            textSentiment.getTextSentimentClass(),
            textSentiment.getPositiveScore(),
            textSentiment.getNeutralScore(),
            textSentiment.getNegativeScore());
    }
}
```

### Output

```console
Recognized TextSentiment: positive, Positive Score: 1.00, Neutral Score: 0.00, Negative Score: 0.00.
Recognized Sentence TextSentiment: positive, Positive Score: 1.00, Neutral Score: 0.00, Negative Score: 0.00.
Recognized Sentence TextSentiment: neutral, Positive Score: 0.21, Neutral Score: 0.77, Negative Score: 0.02.
```
## Language detection

Create a new function called `detectLanguageExample()` that takes the client that you created earlier, and call its [detectLanguage()](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.textanalyticsclientextensions.sentiment?view=azure-dotnet) function. The returned [DetectLanguageResult](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.models.sentimentresult?view=azure-dotnet) object will contains a primary language detected, a list of other languages detected, and an `errorMessage` if not. 

```java
static void detectLanguageExample(TextAnalyticsClient client)
{
    // The text that need be analyzed.
    String text = "Hello world";

    DetectLanguageResult detectLanguageResult = client.detectLanguage(text, "US");
    DetectedLanguage detectedDocumentLanguage = detectLanguageResult.getPrimaryLanguage();
    System.out.printf("Detected Primary Language: %s, ISO 6391 Name: %s, Score: %s.%n",
        detectedDocumentLanguage.getName(),
        detectedDocumentLanguage.getIso6391Name(),
        detectedDocumentLanguage.getScore());

    List<DetectedLanguage> detectedLanguages = detectLanguageResult.getDetectedLanguages();
    for (DetectedLanguage detectedLanguage : detectedLanguages) {
        System.out.printf("Other detected languages: %s, ISO 6391 Name: %s, Score: %s.%n",
            detectedLanguage.getName(),
            detectedLanguage.getIso6391Name(),
            detectedLanguage.getScore());
    }
}
```

### Output

```console
Detected Primary Language: English, ISO 6391 Name: en, Score: 1.0.
Other detected languages: English, ISO 6391 Name: en, Score: 1.0.
```
## Entity recognition

Create a new function called `recognizeEntitiesExample()` that takes the client that you created earlier, and call its [recognizeEntities()](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.textanalyticsclientextensions.sentiment?view=azure-dotnet) function. The returned [RecognizeEntitiesResult](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.models.sentimentresult?view=azure-dotnet) object will contains a list of [NamedEntity](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.models.sentimentresult?view=azure-dotnet), and an `errorMessage` if not. 

```java
static void recognizeEntitiesExample(TextAnalyticsClient client)
{
    // The text that need be analysed.
    String text = "Satya Nadella is the CEO of Microsoft";
    
    RecognizeEntitiesResult recognizeEntitiesResult = client.recognizeEntities(text);

    for (NamedEntity entity : recognizeEntitiesResult.getNamedEntities()) {
        System.out.printf(
            "Recognized NamedEntity Text: %s, Type: %s, Subtype: %s, Offset: %s, Length: %s, Score: %.2f.%n",
            entity.getText(),
            entity.getType(),
            entity.getSubtype() == null || entity.getSubtype().isEmpty() ? "N/A" : entity.getSubtype(),
            entity.getOffset(),
            entity.getLength(),
            entity.getScore());
    }
}
```

### Output

```console
Recognized NamedEntity Text: Satya Nadella, Type: Person, Subtype: N/A, Offset: 0, Length: 13, Score: 1.00.
Recognized NamedEntity Text: Microsoft, Type: Organization, Subtype: N/A, Offset: 28, Length: 9, Score: 1.00.
```
## PII entity recognition

Create a new function called `recognizePiiEntitiesExample()` that takes the client that you created earlier, and call its [recognizePiiEntities()](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.textanalyticsclientextensions.sentiment?view=azure-dotnet) function. The returned [RecognizePiiEntitiesResult](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.models.sentimentresult?view=azure-dotnet) object will contains a list of [NamedEntity](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.models.sentimentresult?view=azure-dotnet), and an `errorMessage` if not. 

```java
static void recognizePiiEntitiesExample(TextAnalyticsClient client)
{
    // The text that need be analysed.
    String text = "My SSN is 555-55-5555";
    
    RecognizePiiEntitiesResult recognizePiiEntitiesResult = client.recognizePiiEntities(text);

    for (NamedEntity entity : recognizePiiEntitiesResult.getNamedEntities()) {
        System.out.printf(
            "Recognized PII Entity Text: %s, Type: %s, Subtype: %s, Offset: %s, Length: %s, Score: %s.%n",
            entity.getText(),
            entity.getType(),
            entity.getSubtype(),
            entity.getOffset(),
            entity.getLength(),
            entity.getScore());
    }
}
```

### Output

```console
Recognized PII Entity Text: 555-55-5555, Type: U.S. Social Security Number (SSN), Subtype: , Offset: 10, Length: 11, Score: 0.85.
```
## Entity linking

Create a new function called `recognizeLinkedEntitiesExample()` that takes the client that you created earlier, and call its [recognizeLinkedEntities()](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.textanalyticsclientextensions.sentiment?view=azure-dotnet) function. The returned [RecognizeLinkedEntitiesResult](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.models.sentimentresult?view=azure-dotnet) object will contains a list of [LinkedEntity](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.models.sentimentresult?view=azure-dotnet), and an `errorMessage` if not. 

```java
static void recognizeLinkedEntitiesExample(TextAnalyticsClient client)
{
    // The text that need be analysed.
    String text = "Old Faithful is a geyser at Yellowstone Park.";
    
    RecognizeLinkedEntitiesResult recognizeLinkedEntitiesResult = client.recognizeLinkedEntities(text);

    for (LinkedEntity linkedEntity : recognizeLinkedEntitiesResult.getLinkedEntities()) {
        System.out.printf("Recognized Linked NamedEntity: %s, URL: %s, Data Source: %s.%n",
            linkedEntity.getName(),
            linkedEntity.getUrl(),
            linkedEntity.getDataSource());
    }
}
```

### Output

```console
Recognized Linked NamedEntity: Yellowstone National Park, URL: https://en.wikipedia.org/wiki/Yellowstone_National_Park, Data Source: Wikipedia.
Recognized Linked NamedEntity: Old Faithful, URL: https://en.wikipedia.org/wiki/Old_Faithful, Data Source: Wikipedia.
```
## Key phrase extraction

Create a new function called `extractKeyPhrasesExample()` that takes the client that you created earlier, and call its [extractKeyPhrases()](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.textanalyticsclientextensions.sentiment?view=azure-dotnet) function. The returned [ExtractKeyPhraseResult](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.models.sentimentresult?view=azure-dotnet) object will contains a list of key phrases if successful, and an `errorMessage` if not. 

```java
static void extractKeyPhrasesExample(TextAnalyticsClient client)
{
    // The text that need be analyzed.
    String text = "My cat might need to see a veterinarian.";
    
    ExtractKeyPhraseResult keyPhraseResult = client.extractKeyPhrases(text);

    for (String keyPhrase : keyPhraseResult.getKeyPhrases()) {
        System.out.printf("Recognized Phrases: %s.%n", keyPhrase);
    }
}
```

### Output

```console
Recognized Phrases: cat.
Recognized Phrases: veterinarian.
```