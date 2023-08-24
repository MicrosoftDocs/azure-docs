---
title: 'Quickstart: Use Azure OpenAI Service with the Java SDK'
titleSuffix: Azure OpenAI
description: Walkthrough on how to get started with Azure OpenAI and make your first chat completions call with the Java SDK. 
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: include
author: mrbullwinkle
ms.author: mbullwin
ms.date: 07/26/2023
keywords: 
---

[Source code](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/openai/azure-ai-openai) | [Artifact (Maven)](https://central.sonatype.com/artifact/com.azure/azure-ai-openai/1.0.0-beta.3) | [Samples](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/openai/azure-ai-openai/src/samples)

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true)
- Access granted to the Azure OpenAI service in the desired Azure subscription.
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI Service by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access?azure-portal=true).
* The current version of the [Java Development Kit (JDK)](https://www.microsoft.com/openjdk)
* The [Gradle build tool](https://gradle.org/install/), or another dependency manager.
* Once you have your Azure subscription, <a href="tbd"  title="create an Azure OpenAI resource"  target="_blank">create a Vision resource</a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
    * You need the key and endpoint from the resource you create to connect your application to the Azure AI Vision service.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.




### Retrieve key and endpoint

To successfully make a call against Azure OpenAI, you need an **endpoint** and a **key**.

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively, you can find the value in the **Azure AI Studio** > **Playground** > **Code View**. An example endpoint is: `https://docs-test-001.openai.azure.com/`.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either `KEY1` or `KEY2`.|

Go to your resource in the Azure portal. The **Endpoint and Keys** can be found in the **Resource Management** section. Copy your endpoint and access key as you'll need both for authenticating your API calls. You can use either `KEY1` or `KEY2`. Always having two keys allows you to securely rotate and regenerate keys without causing a service disruption.

:::image type="content" source="../media/quickstarts/endpoint.png" alt-text="Screenshot of the overview UI for an OpenAI Resource in the Azure portal with the endpoint and access keys location circled in red." lightbox="../media/quickstarts/endpoint.png":::

Create and assign persistent environment variables for your key and endpoint.

### Environment variables

# [Command Line](#tab/command-line)

```CMD
setx AZURE_OPENAI_KEY "REPLACE_WITH_YOUR_KEY_VALUE_HERE" 
```

```CMD
setx AZURE_OPENAI_ENDPOINT "REPLACE_WITH_YOUR_ENDPOINT_HERE" 
```

# [PowerShell](#tab/powershell)

```powershell
[System.Environment]::SetEnvironmentVariable('AZURE_OPENAI_KEY', 'REPLACE_WITH_YOUR_KEY_VALUE_HERE', 'User')
```

```powershell
[System.Environment]::SetEnvironmentVariable('AZURE_OPENAI_ENDPOINT', 'REPLACE_WITH_YOUR_ENDPOINT_HERE', 'User')
```

# [Bash](#tab/bash)

```Bash
echo export AZURE_OPENAI_KEY="REPLACE_WITH_YOUR_KEY_VALUE_HERE" >> /etc/environment && source /etc/environment
```

```Bash
echo export AZURE_OPENAI_ENDPOINT="REPLACE_WITH_YOUR_ENDPOINT_HERE" >> /etc/environment && source /etc/environment
```
---

## Create a sample application


1. Create a new Gradle project.

    In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it. 
    
    ```console
    mkdir myapp && cd myapp
    ```
    
    Run the `gradle init` command from your working directory. This command will create essential build files for Gradle, including *build.gradle.kts*, which is used at runtime to create and configure your application.
    
    ```console
    gradle init --type basic
    ```

    When prompted to choose a **DSL**, select **Kotlin**.

1. Install the client library.

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

```output
Image location URL that provides temporary access to download the generated image is https://dalleproduse.blob.core.windows.net/private/images/d2ea917f-8802-4ad6-8ef6-3fb7a15c8482/generated_00.png?se=2023-08-25T23%3A11%3A28Z&sig=%2BKa5Mkb9U88DfvxoBpyAjamYRzwb7aVCEucM6XJC3wQ%3D&ske=2023-08-31T15%3A27%3A47Z&skoid=09ba021e-c417-441c-b203-c81e5dcd7b7f&sks=b&skt=2023-08-24T15%3A27%3A47Z&sktid=33e01921-4d64-4f8c-a055-5bdaffd5e33d&skv=2020-10-02&sp=r&spr=https&sr=b&sv=2020-10-02.
Completed getImages.
```

## Clean up resources

If you want to clean up and remove an Azure OpenAI resource, you can delete the resource. Before deleting the resource, you must first delete any deployed models.

- [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* For more examples, check out the [Azure OpenAI Samples GitHub repository](https://aka.ms/AOAICodeSamples)
