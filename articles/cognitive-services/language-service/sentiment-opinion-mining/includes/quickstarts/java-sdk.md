---
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 04/12/2022
ms.custom: devx-track-java, ignite-fall-2021
ms.author: aahi
---

[Reference documentation](/java/api/overview/azure/ai-textanalytics-readme?preserve-view=true&view=azure-java-stable) | [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/textanalytics/azure-ai-textanalytics) | [Package](https://mvnrepository.com/artifact/com.azure/azure-ai-textanalytics/5.1.0) | [Samples](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/textanalytics/azure-ai-textanalytics/src/samples)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* [Java Development Kit](https://www.oracle.com/technetwork/java/javase/downloads/index.html) (JDK) with version 8 or above
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">create a Language resource </a> in the Azure portal to get your key and endpoint.  After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
* To use the Analyze feature, you will need a Language resource with the standard (S) pricing tier.

## Setting up

### Add the client library

Create a Maven project in your preferred IDE or development environment. Then add the following dependency to your project's *pom.xml* file. You can find the implementation syntax [for other build tools](https://mvnrepository.com/artifact/com.azure/azure-ai-textanalytics/5.1.0) online.

```xml
<dependencies>
     <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-ai-textanalytics</artifactId>
        <version>5.1.0</version>
    </dependency>
</dependencies>
```

## Code example

Create a Java file named `Example.java`. Open the file and copy the below code. Remember to replace the `key` variable with the key for your resource, and replace the `endpoint` variable with the endpoint for your resource. 

[!INCLUDE [find the key and endpoint for a resource](../../../includes/find-azure-resource-info.md)]

```java
import com.azure.core.credential.AzureKeyCredential;
import com.azure.ai.textanalytics.models.*;
import com.azure.ai.textanalytics.TextAnalyticsClientBuilder;
import com.azure.ai.textanalytics.TextAnalyticsClient;

public class Example {

    private static String KEY = "replace-with-your-key-here";
    private static String ENDPOINT = "replace-with-your-endpoint-here";

    public static void main(String[] args) {
        TextAnalyticsClient client = authenticateClient(KEY, ENDPOINT);
        sentimentAnalysisWithOpinionMiningExample(client);
    }
    // Method to authenticate the client object with your key and endpoint
    static TextAnalyticsClient authenticateClient(String key, String endpoint) {
        return new TextAnalyticsClientBuilder()
                .credential(new AzureKeyCredential(key))
                .endpoint(endpoint)
                .buildClient();
    }
    // Example method for sentiment in text
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
    // Example method for detecting opinions in text
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
}

```

## Output

```console
Recognized document sentiment: positive, positive score: 1.0, neutral score: 0.0, negative score: 0.0.
Recognized sentence sentiment: positive, positive score: 1.0, neutral score: 0.0, negative score: 0.0.
Recognized sentence sentiment: neutral, positive score: 0.21, neutral score: 0.77, negative score: 0.02.

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
