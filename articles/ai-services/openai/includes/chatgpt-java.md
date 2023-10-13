---
title: 'Quickstart: Use Azure OpenAI Service with the Java SDK'
titleSuffix: Azure OpenAI
description: Walkthrough on how to get started with Azure OpenAI and make your first chat completions call with the Java SDK. 
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
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
- The [Gradle build tool](https://gradle.org/install/), or another dependency manager.
- An Azure OpenAI Service resource with either the `gpt-35-turbo` or the `gpt-4` models deployed. For more information about model deployment, see the [resource deployment guide](../how-to/create-resource.md).

> [!div class="nextstepaction"]
> [I ran into an issue with the prerequisites.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVA&Pillar=AOAI&Product=Chatgpt&Page=quickstart&Section=Prerequisites)

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


> [!div class="nextstepaction"]
> [I ran into an issue with the setup.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVA&Pillar=AOAI&Product=Chatgpt&Page=quickstart&Section=Set-up-the-environment)

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

## Create a sample application

1. Create a Java file.

    From your working directory, run the following command to create a project source folder:

    ```console
    mkdir -p src/main/java
    ```

    Navigate to the new folder and create a file called *OpenAIQuickstart.java*. 


1. Open *OpenAIQuickstart.java* in your preferred editor or IDE and paste in the following code.

    ```java    
    import com.azure.ai.openai.OpenAIClient;
    import com.azure.ai.openai.OpenAIClientBuilder;
    import com.azure.ai.openai.models.ChatChoice;
    import com.azure.ai.openai.models.ChatCompletions;
    import com.azure.ai.openai.models.ChatCompletionsOptions;
    import com.azure.ai.openai.models.ChatMessage;
    import com.azure.ai.openai.models.ChatRole;
    import com.azure.ai.openai.models.CompletionsUsage;
    import com.azure.core.credential.AzureKeyCredential;
    
    import java.util.ArrayList;
    import java.util.List;
    
    public class GetChatCompletionsSample {
    
        public static void main(String[] args) {
            String azureOpenaiKey = System.getenv("AZURE_OPENAI_KEY");;
            String endpoint = System.getenv("AZURE_OPENAI_ENDPOINT");;
            String deploymentOrModelId = "gpt-35-turbo";
    
          OpenAIClient client = new OpenAIClientBuilder()
                .endpoint(endpoint)
                .credential(new AzureKeyCredential(azureOpenaiKey))
                .buildClient();
    
            List<ChatMessage> chatMessages = new ArrayList<>();
            chatMessages.add(new ChatMessage(ChatRole.SYSTEM, "You are a helpful assistant"));
            chatMessages.add(new ChatMessage(ChatRole.USER, "Does Azure OpenAI support customer managed keys?"));
            chatMessages.add(new ChatMessage(ChatRole.ASSISTANT, "Yes, customer managed keys are supported by Azure OpenAI?"));
            chatMessages.add(new ChatMessage(ChatRole.USER, "Do other Azure AI services support this too?"));
    
            ChatCompletions chatCompletions = client.getChatCompletions(deploymentOrModelId, new ChatCompletionsOptions(chatMessages));
    
            System.out.printf("Model ID=%s is created at %s.%n", chatCompletions.getId(), chatCompletions.getCreatedAt());
            for (ChatChoice choice : chatCompletions.getChoices()) {
                ChatMessage message = choice.getMessage();
                System.out.printf("Index: %d, Chat Role: %s.%n", choice.getIndex(), message.getRole());
                System.out.println("Message:");
                System.out.println(message.getContent());
            }
    
            System.out.println();
            CompletionsUsage usage = chatCompletions.getUsage();
            System.out.printf("Usage: number of prompt token is %d, "
                    + "number of completion token is %d, and number of total tokens in request and response is %d.%n",
                usage.getPromptTokens(), usage.getCompletionTokens(), usage.getTotalTokens());
        }
    }  
    ```

    > [!IMPORTANT]
    > For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). For more information about credential security, see the Azure AI services [security](../../security-features.md) article.

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
Model ID=chatcmpl-7JYnyE4zpd5gaIfTRH7hNpeVsvAw4 is created at 1684896378.
Index: 0, Chat Role: assistant.
Message:
Yes, most of the Azure AI services support customer managed keys. However, there may be some exceptions, so it is best to check the documentation of each specific service to confirm.

Usage: number of prompt token is 59, number of completion token is 36, and number of total tokens in request and response is 95.
```

> [!div class="nextstepaction"]
> [I ran into an issue when running the code sample.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVA&Pillar=AOAI&Product=Chatgpt&Page=quickstart&Section=Create-application)

## Clean up resources

If you want to clean up and remove an Azure OpenAI resource, you can delete the resource. Before deleting the resource, you must first delete any deployed models.

- [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* For more examples, check out the [Azure OpenAI Samples GitHub repository](https://aka.ms/AOAICodeSamples)
