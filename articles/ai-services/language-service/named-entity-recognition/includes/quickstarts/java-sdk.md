---
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 12/19/2023
ms.custom: devx-track-java
ms.author: jboback
---

[Reference documentation](/java/api/overview/azure/ai-textanalytics-readme?preserve-view=true&view=azure-java-stable) | [More samples](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/textanalytics/azure-ai-textanalytics/src/samples) | [Package (Maven)](https://mvnrepository.com/artifact/com.azure/azure-ai-textanalytics/5.2.0) | [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/textanalytics/azure-ai-textanalytics) 

Use this quickstart to create a Named Entity Recognition (NER) application with the client library for Java. In the following example, you will create a Java application that can identify [recognized entities](../../concepts/named-entity-categories.md) in text.

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
        recognizeEntitiesExample(client);
    }
    // Method to authenticate the client object with your key and endpoint
    static TextAnalyticsClient authenticateClient(String key, String endpoint) {
        return new TextAnalyticsClientBuilder()
                .credential(new AzureKeyCredential(key))
                .endpoint(endpoint)
                .buildClient();
    }
    // Example method for recognizing entities in text
    static void recognizeEntitiesExample(TextAnalyticsClient client)
    {
        // The text that needs to be analyzed.
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
}

```



## Output

```console
Recognized entity: trip, entity category: Event, entity sub-category: null, score: 0.74, offset: 18, length: 4.
Recognized entity: Seattle, entity category: Location, entity sub-category: GPE, score: 1.0, offset: 26, length: 7.
Recognized entity: last week, entity category: DateTime, entity sub-category: DateRange, score: 0.8, offset: 34, length: 9.
```
