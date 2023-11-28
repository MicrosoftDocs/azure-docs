---
title: 'Quickstart: Use Azure OpenAI Service with the Java SDK to generate images'
titleSuffix: Azure OpenAI
description: Walkthrough on how to get started with Azure OpenAI and make your first image generation call with the Java SDK. 
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
author: PatrickFarley
ms.author: pafarley
ms.date: 08/24/2023
keywords: 
---

Use this guide to get started generating images with the Azure OpenAI SDK for Java.

[Library source code](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/openai/azure-ai-openai) | [Artifact (Maven)](https://central.sonatype.com/artifact/com.azure/azure-ai-openai/1.0.0-beta.3) | [Samples](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/openai/azure-ai-openai/src/samples)

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true)
- Access granted to the Azure OpenAI service in the desired Azure subscription.
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI Service by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access?azure-portal=true).
* The current version of the [Java Development Kit (JDK)](https://www.microsoft.com/openjdk)
* The [Gradle build tool](https://gradle.org/install/), or another dependency manager.
- An Azure OpenAI resource created in the East US region. For more information, see [Create a resource and deploy a model with Azure OpenAI](../how-to/create-resource.md).

> [!NOTE]
> Currently, you must submit an application to access Azure OpenAI Service. To apply for access, complete [this form](https://aka.ms/oai/access). If you need assistance, open an issue on this repo to contact Microsoft.

## Set up

[!INCLUDE [get-key-endpoint](get-key-endpoint.md)]

[!INCLUDE [environment-variables](environment-variables.md)]


## Create a new Java application

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

## Install the Java SDK


This quickstart uses the Gradle dependency manager. You can find the client library and information for other dependency managers on the [Maven Central Repository](https://search.maven.org/artifact/com.microsoft.azure.cognitiveservices/azure-cognitiveservices-computervision).

Locate *build.gradle.kts* and open it with your preferred IDE or text editor. Then copy in the following build configuration. This configuration defines the project as a Java application whose entry point is the class **OpenAIQuickstart**. It imports the Azure AI Vision library.

```kotlin
plugins {
    java
    application
}
application { 
    mainClass.set("OpenAIQuickstart")
}
repositories {
    mavenCentral()
}
dependencies {
    implementation(group = "com.azure", name = "azure-ai-openai", version = "1.0.0-beta.3")
    implementation("org.slf4j:slf4j-simple:1.7.9")
}
```

## Generate images with DALL-E

1. Create a Java file.

    From your working directory, run the following command to create a project source folder:

    ```console
    mkdir -p src/main/java
    ```

    Navigate to the new folder and create a file called *OpenAIQuickstart.java*. 


1. Open *OpenAIQuickstart.java* in your preferred editor or IDE and paste in the following code.

    ```java
    import com.azure.ai.openai.OpenAIAsyncClient;
    import com.azure.ai.openai.OpenAIClientBuilder;
    import com.azure.ai.openai.models.ImageGenerationOptions;
    import com.azure.ai.openai.models.ImageLocation;
    import com.azure.core.credential.AzureKeyCredential;
    import com.azure.core.models.ResponseError;
    
    import java.util.concurrent.TimeUnit;
    
    /**
     * Sample demonstrates how to get the images for a given prompt.
     */
    public class OpenAIQuickstart {
    
        /**
         * Runs the sample algorithm and demonstrates how to get the images for a given prompt.
         *
         * @param args Unused. Arguments to the program.
         */
        public static void main(String[] args) throws InterruptedException {
            
            // Get key and endpoint from environment variables:
            String azureOpenaiKey = System.getenv("AZURE_OPENAI_KEY");
            String endpoint = System.getenv("AZURE_OPENAI_ENDPOINT");
    
            OpenAIAsyncClient client = new OpenAIClientBuilder()
                .endpoint(endpoint)
                .credential(new AzureKeyCredential(azureOpenaiKey))
                .buildAsyncClient();
    
            ImageGenerationOptions imageGenerationOptions = new ImageGenerationOptions(
                "A drawing of the Seattle skyline in the style of Van Gogh");
            client.getImages(imageGenerationOptions).subscribe(
                images -> {
                    for (ImageLocation imageLocation : images.getData()) {
                        ResponseError error = imageLocation.getError();
                        if (error != null) {
                            System.out.printf("Image generation operation failed. Error code: %s, error message: %s.%n",
                                error.getCode(), error.getMessage());
                        } else {
                            System.out.printf(
                                "Image location URL that provides temporary access to download the generated image is %s.%n",
                                imageLocation.getUrl());
                        }
                    }
                },
                error -> System.err.println("There was an error getting images." + error),
                () -> System.out.println("Completed getImages."));
    
            // The .subscribe() creation and assignment is not a blocking call. For the purpose of this example, we sleep
            // the thread so the program does not end before the send operation is complete. Using .block() instead of
            // .subscribe() will turn this into a synchronous call.
            TimeUnit.SECONDS.sleep(10);
        }
    }
    ```

1. Navigate back to the project root folder, and build the app with:

   ```console
   gradle build
   ```
   
   Then, run it with the `gradle run` command:
   
   ```console
   gradle run
   ```


## Output

The URL of the generated image is printed to the console.

```console
Image location URL that provides temporary access to download the generated image is https://dalleproduse.blob.core.windows.net/private/images/d2ea917f-8802-4ad6-8ef6-3fb7a15c8482/generated_00.png?se=2023-08-25T23%3A11%3A28Z&sig=%2BKa5Mkb9U88DfvxoBpyAjamYRzwb7aVCEucM6XJC3wQ%3D&ske=2023-08-31T15%3A27%3A47Z&skoid=09ba021e-c417-441c-b203-c81e5dcd7b7f&sks=b&skt=2023-08-24T15%3A27%3A47Z&sktid=33e01921-4d64-4f8c-a055-5bdaffd5e33d&skv=2020-10-02&sp=r&spr=https&sr=b&sv=2020-10-02.
Completed getImages.
```

> [!NOTE]
> The image generation APIs come with a content moderation filter. If the service recognizes your prompt as harmful content, it won't return a generated image. For more information, see the [content filter](../concepts/content-filter.md) article.


## Clean up resources

If you want to clean up and remove an Azure OpenAI resource, you can delete the resource. Before deleting the resource, you must first delete any deployed models.

- [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* For more examples, check out the [Azure OpenAI Samples GitHub repository](https://aka.ms/AOAICodeSamples)
