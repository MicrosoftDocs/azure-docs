---
title: "Quickstart: Analyze text content with Java"
description: In this quickstart, get started using the Azure AI Content Safety Java SDK to analyze text content for objectionable material.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.custom:
ms.topic: include
ms.date: 10/10/2023
ms.author: pafarley
---

[Reference documentation](/java/api/overview/azure/ai-contentsafety-readme) | [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/contentsafety/azure-ai-contentsafety/src) |[Artifact (Maven)](https://central.sonatype.com/artifact/com.azure/azure-ai-contentsafety) | [Samples](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/contentsafety/azure-ai-contentsafety/src/samples/java/com/azure/ai/contentsafety)


## Prerequisites


* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
* The current version of the [Java Development Kit (JDK)](https://www.microsoft.com/openjdk)
* The [Gradle build tool](https://gradle.org/install/), or another dependency manager.
* Once you have your Azure subscription, <a href="https://aka.ms/acs-create"  title="Create a Content Safety resource"  target="_blank">create a Content Safety resource </a> in the Azure portal to get your key and endpoint. Enter a unique name for your resource, select the subscription you entered on the application form, select a resource group, supported region, and supported pricing tier. Then select **Create**.
  * The resource takes a few minutes to deploy. After it finishes, Select **go to resource**. In the left pane, under **Resource Management**, select **Subscription Key and Endpoint**. The endpoint and either of the keys are used to call APIs.

## Set up application
Create a new Gradle project.

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it. 
    
```console
mkdir myapp && cd myapp
```

Run the `gradle init` command from your working directory. This command will create essential build files for Gradle, including *build.gradle.kts*, which is used at runtime to create and configure your application.

```console
gradle init --type basic
```

When prompted to choose a **DSL**, select **Kotlin**.

From your working directory, run the following command to create a project source folder:

```console
mkdir -p src/main/java
```

Navigate to the new folder and create a file called *ContentSafetyQuickstart.java*.


### Install the client SDK 

This quickstart uses the Gradle dependency manager. You can find the client library and information for other dependency managers on the [Maven Central Repository](https://central.sonatype.com/artifact/com.azure/azure-ai-contentsafety).

Locate *build.gradle.kts* and open it with your preferred IDE or text editor. Then copy in the following build configuration. This configuration defines the project as a Java application whose entry point is the class **ContentSafetyQuickstart**. It imports the Azure AI Vision library.

```kotlin
plugins {
    java
    application
}
application { 
    mainClass.set("ContentSafetyQuickstart")
}
repositories {
    mavenCentral()
}
dependencies {
    implementation(group = "com.azure", name = "azure-ai-contentsafety", version = "1.0.0-beta.1")
}
```

[!INCLUDE [Create environment variables](../env-vars.md)]


## Analyze text content

Open *ContentSafetyQuickstart.java* in your preferred editor or IDE and paste in the following code. Replace `<your text sample>` with the text content you'd like to use.

> [!TIP]
> Text size and granularity
>
> The default maximum length for text submissions is **10K** characters.

```Java
import com.azure.ai.contentsafety.models.AnalyzeTextOptions;
import com.azure.ai.contentsafety.models.AnalyzeTextResult;
import com.azure.ai.contentsafety.*;
import com.azure.core.credential.KeyCredential;
import com.azure.core.util.Configuration;

public class ContentSafetyQuickstart {
    public static void main(String[] args) {

        // get endpoint and key from environment variables
        String endpoint = System.getenv("CONTENT_SAFETY_ENDPOINT");
        String key = System.getenv("CONTENT_SAFETY_KEY");
        
        ContentSafetyClient contentSafetyClient = new ContentSafetyClientBuilder()
            .credential(new KeyCredential(key))
            .endpoint(endpoint).buildClient();

        AnalyzeTextResult response = contentSafetyClient.analyzeText(new AnalyzeTextOptions("<your text sample>"));

        System.out.println("Hate severity: " + response.getHateResult().getSeverity());
        System.out.println("SelfHarm severity: " + response.getSelfHarmResult().getSeverity());
        System.out.println("Sexual severity: " + response.getSexualResult().getSeverity());
        System.out.println("Violence severity: " + response.getViolenceResult().getSeverity());
    }
}
```

Navigate back to the project root folder, and build the app with:

```console
gradle build
```

Then, run it with the `gradle run` command:

```console
gradle run
```

## Output

```console
Hate severity: 0
SelfHarm severity: 0
Sexual severity: 0
Violence severity: 0
```