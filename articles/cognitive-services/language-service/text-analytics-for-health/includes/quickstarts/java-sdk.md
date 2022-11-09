---
author: jboback
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 09/15/2022
ms.custom: devx-track-java, ignite-fall-2021
ms.author: jboback
---

[Reference documentation](/java/api/overview/azure/ai-textanalytics-readme?preserve-view=true&view=azure-java-stable) | [Additional samples](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/textanalytics/azure-ai-textanalytics/src/samples) | [Package (Maven)](https://mvnrepository.com/artifact/com.azure/azure-ai-textanalytics/5.2.0) | [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/textanalytics/azure-ai-textanalytics)

Use this quickstart to create a Text Analytics for health application with the client library for Java. In the following example, you will create a Java application that can identify medical [entities](../../concepts/health-entity-categories.md), [relations](../../concepts/relation-extraction.md), and [assertions](../../concepts/assertion-detection.md) that appear in text.

[!INCLUDE [Use Language Studio](../../../includes/use-language-studio.md)]

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* [Java Development Kit](https://www.oracle.com/technetwork/java/javase/downloads/index.html) (JDK) with version 8 or above
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">create a Language resource </a> in the Azure portal to get your key and endpoint.  After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`Free F0`) to try the service, and upgrade later to a paid tier for production.
* To use the Analyze feature, you will need a Language resource with the standard (S) pricing tier.

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVA&Pillar=Language&Product=Text-analytics-for-health&Page=quickstart&Section=Prerequisites" target="_target">I ran into an issue</a>


## Setting up

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

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVA&Pillar=Language&Product=Text-analytics-for-health&Page=quickstart&Section=Set-up-the-environment" target="_target">I ran into an issue</a>

## Code example

Create a Java file named `EntityLinking.java`. Open the file and copy the below code. Remember to replace the `key` variable with the key for your resource, and replace the `endpoint` variable with the endpoint for your resource. 

[!INCLUDE [find the key and endpoint for a resource](../../../includes/find-azure-resource-info.md)]

```java
import com.azure.core.credential.AzureKeyCredential;
import com.azure.ai.textanalytics.models.*;
import com.azure.ai.textanalytics.TextAnalyticsClientBuilder;
import com.azure.ai.textanalytics.TextAnalyticsClient;

import java.util.List;
import java.util.Arrays;
import com.azure.core.util.Context;
import com.azure.core.util.polling.SyncPoller;

import com.azure.ai.textanalytics.util.*;


public class Example {

    private static String KEY = "replace-with-your-key-here";
    private static String ENDPOINT = "replace-with-your-endpoint-here";

    public static void main(String[] args) {
        TextAnalyticsClient client = authenticateClient(KEY, ENDPOINT);
        healthExample(client);
    }

    // Method to authenticate the client object with your key and endpoint
    static TextAnalyticsClient authenticateClient(String key, String endpoint) {
        return new TextAnalyticsClientBuilder()
                .credential(new AzureKeyCredential(key))
                .endpoint(endpoint)
                .buildClient();
    }

    // Example method for extracting information from healthcare-related text 
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
                    "Results of Azure Text Analytics for health entities\" Model, version: %s%n",
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
}

```

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVA&Pillar=Language&Product=Text-analytics-for-health&Page=quickstart&Section=Code-example" target="_target">I ran into an issue</a>

### Output

```console
Poller status: IN_PROGRESS.
Operation created time: 2022-09-15T19:06:11Z, expiration time: 2022-09-16T19:06:11Z.
Poller status: SUCCESSFULLY_COMPLETED.
Results of Azure Text Analytics for health entities" Model, version: 2022-03-01
Document ID = 0
Document entities: 
	Text: 100mg, normalized name: null, category: Dosage, subcategory: null, confidence score: 0.980000.
	Text: ibuprofen, normalized name: ibuprofen, category: MedicationName, subcategory: null, confidence score: 1.000000.
	Text: twice daily, normalized name: null, category: Frequency, subcategory: null, confidence score: 1.000000.
Relation type: DosageOfMedication.
	Entity text: 100mg, category: Dosage, role: Dosage.
	Entity text: ibuprofen, category: MedicationName, role: Medication.
Relation type: FrequencyOfMedication.
	Entity text: ibuprofen, category: MedicationName, role: Medication.
	Entity text: twice daily, category: Frequency, role: Frequency.
```
