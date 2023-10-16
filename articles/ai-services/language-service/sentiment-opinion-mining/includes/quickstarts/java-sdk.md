---
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 07/19/2023
ms.custom: devx-track-java, ignite-fall-2021
ms.author: aahi
---

[Reference documentation](/java/api/overview/azure/ai-textanalytics-readme?preserve-view=true&view=azure-java-stable) | [Additional samples](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/textanalytics/azure-ai-textanalytics/src/samples) | [Package (Maven)](https://mvnrepository.com/artifact/com.azure/azure-ai-textanalytics/5.2.0) | [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/textanalytics/azure-ai-textanalytics) 

Use this quickstart to create a sentiment analysis application with the client library for Java. In the following example, you will create a Java application that can identify the sentiment(s) expressed in a text sample, and perform aspect-based sentiment analysis.

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* [Java Development Kit](https://www.oracle.com/technetwork/java/javase/downloads/index.html) (JDK) with version 8 or above




## Setting up

[!INCLUDE [Create an Azure resource](../../../includes/create-resource.md)]



[!INCLUDE [Get your key and endpoint](../../../includes/get-key-endpoint.md)]



[!INCLUDE [Create environment variables](../../../includes/environment-variables.md)]



### Add the client library

Create a Maven project in your preferred IDE or development environment. Then add the following dependency to your project's *pom.xml* file. You can find the implementation syntax [for other build tools](https://mvnrepository.com/artifact/com.azure/azure-ai-textanalytics/5.2.0) online.

```xml
<dependencies>
     <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-ai-textanalytics</artifactId>
        <version>5.2.0</version>
    </dependency>
</dependencies>
```




## Code example

Create a Java file named `Example.java`. Open the file and copy the below code. Then run the code.

```java
import com.azure.core.credential.AzureKeyCredential;
import com.azure.ai.textanalytics.models.*;
import com.azure.ai.textanalytics.TextAnalyticsClientBuilder;
import com.azure.ai.textanalytics.TextAnalyticsClient;

public class Example {
    
    // This example requires environment variables named "LANGUAGE_KEY" and "LANGUAGE_ENDPOINT"
    private static String languageKey = System.getenv("LANGUAGE_KEY");
    private static String languageEndpoint = System.getenv("LANGUAGE_ENDPOINT");

    public static void main(String[] args) {
        TextAnalyticsClient client = authenticateClient(languageKey, languageEndpoint);
        sentimentAnalysisWithOpinionMiningExample(client);
    }
    // Method to authenticate the client object with your key and endpoint.
    static TextAnalyticsClient authenticateClient(String key, String endpoint) {
        return new TextAnalyticsClientBuilder()
                .credential(new AzureKeyCredential(key))
                .endpoint(endpoint)
                .buildClient();
    }
    // Example method for detecting sentiment and opinions in text.
    static void sentimentAnalysisWithOpinionMiningExample(TextAnalyticsClient client)
    {
        // The document that needs be analyzed.
        String document = "The food and service were unacceptable. The concierge was nice, however.";

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
Document = The food and service were unacceptable. The concierge was nice, however.
Recognized document sentiment: mixed, positive score: 0.470000, neutral score: 0.000000, negative score: 0.520000.
	Sentence sentiment: negative, positive score: 0.000000, neutral score: 0.000000, negative score: 0.990000.
		Target sentiment: negative, target text: food
			'negative' assessment sentiment because of "unacceptable". Is the assessment negated: false.
		Target sentiment: negative, target text: service
			'negative' assessment sentiment because of "unacceptable". Is the assessment negated: false.
	Sentence sentiment: positive, positive score: 0.940000, neutral score: 0.010000, negative score: 0.050000.
		Target sentiment: positive, target text: concierge
			'positive' assessment sentiment because of "nice". Is the assessment negated: false.
```

[!INCLUDE [clean up resources](../../../includes/clean-up-resources.md)]

[!INCLUDE [clean up environment variables](../../../includes/clean-up-variables.md)]



## Next steps

* [Sentiment analysis and opinion mining language support](../../language-support.md)
* [How to call the API](../../how-to/call-api.md)  
* [Reference documentation](/java/api/overview/azure/ai-textanalytics-readme?preserve-view=true&view=azure-java-stable)
* [Additional samples](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/textanalytics/azure-ai-textanalytics/src/samples)