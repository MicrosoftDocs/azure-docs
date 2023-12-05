---
title: "Content Moderator Java client library quickstart"
titleSuffix: Azure AI services
description: In this quickstart, learn how to get started with the Azure Content Moderator client library for Java. Build content filtering software into your app to comply with regulations or maintain the intended environment for your users.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-moderator
ms.topic: include
ms.date: 10/16/2020
ms.custom: "devx-track-java, cog-serv-seo-aug-2020"
ms.author: pafarley
---

Get started with the Azure Content Moderator client library for Java. Follow these steps to install the Maven package and try out the example code for basic tasks. 

Content Moderator is an AI service that lets you handle content that is potentially offensive, risky, or otherwise undesirable. Use the AI-powered content moderation service to scan text, image, and videos and apply content flags automatically. Build content filtering software into your app to comply with regulations or maintain the intended environment for your users.

Use the Content Moderator client library for Java to:

* Moderate text
* Moderate images

[Reference documentation](/java/api/overview/azure/cognitiveservices/client/contentmoderator) | [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/cognitiveservices/ms-azure-cs-contentmoderator) |[Artifact (Maven)](https://mvnrepository.com/artifact/com.microsoft.azure.cognitiveservices/azure-cognitiveservices-contentmoderator) | [Samples](/samples/browse/?products=azure&term=content-moderator)

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The current version of the [Java Development Kit (JDK)](https://www.microsoft.com/openjdk)
* The [Gradle build tool](https://gradle.org/install/), or another dependency manager.
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesContentModerator"  title="Create a Content Moderator resource"  target="_blank">create a Content Moderator resource </a> in the Azure portal to get your key and endpoint. Wait for it to deploy and click the **Go to resource** button.
    * You will need the key and endpoint from the resource you create to connect your application to Content Moderator. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Setting up

### Create a new Gradle project

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it. 

```console
mkdir myapp && cd myapp
```

Run the `gradle init` command from your working directory. This command will create essential build files for Gradle, including *build.gradle.kts*, which is used at runtime to create and configure your application.

```console
gradle init --type basic
```

When prompted to choose a **DSL**, select **Kotlin**.

## Install the client library

Find *build.gradle.kts* and open it with your preferred IDE or text editor. Then copy in the following build configuration. This configuration defines the project as a Java application whose entry point is the class **ContentModeratorQuickstart**. It imports the Content Moderator client library and the GSON sdk for JSON serialization.

```kotlin
plugins {
    java
    application
}

application{ 
    mainClassName = "ContentModeratorQuickstart"
}

repositories{
    mavenCentral()
}

dependencies{
    compile(group = "com.microsoft.azure.cognitiveservices", name = "azure-cognitiveservices-contentmoderator", version = "1.0.2-beta")
    compile(group = "com.google.code.gson", name = "gson", version = "2.8.5")
}
```

### Create a Java file


From your working directory, run the following command to create a project source folder:

```console
mkdir -p src/main/java
```

Navigate to the new folder and create a file called *ContentModeratorQuickstart.java*. Open it in your preferred editor or IDE and add the following `import` statements:

[!code-java[](~/cognitive-services-quickstart-code/java/ContentModerator/src/main/java/ContentModeratorQuickstart.java?name=snippet_imports)]

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/java/ContentModerator/src/main/java/ContentModeratorQuickstart.java), which contains the code examples in this quickstart.

In the application's **ContentModeratorQuickstart** class, create variables for your resource's key and endpoint.

> [!IMPORTANT]
> Go to the Azure portal. If the Content Moderator resource you created in the **Prerequisites** section deployed successfully, click the **Go to Resource** button under **Next Steps**. You can find your key and endpoint in the resource's **key and endpoint** page, under **resource management**.

[!code-java[](~/cognitive-services-quickstart-code/java/ContentModerator/src/main/java/ContentModeratorQuickstart.java?name=snippet_creds)]

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md). See the Azure AI services [security](../../../security-features.md) article for more information.

In the application's **main** method, add calls for the methods used in this quickstart. You'll define these methods later.

[!code-java[](~/cognitive-services-quickstart-code/java/ContentModerator/src/main/java/ContentModeratorQuickstart.java?name=snippet_maincalls)]

## Object model

The following classes handle some of the major features of the Content Moderator Java client library.

|Name|Description|
|---|---|
|[ContentModeratorClient](/java/api/com.microsoft.azure.cognitiveservices.vision.contentmoderator.contentmoderatorclient)|This class is needed for all Content Moderator functionality. You instantiate it with your subscription information, and you use it to produce instances of other classes.|
|[ImageModeration](/java/api/com.microsoft.azure.cognitiveservices.vision.contentmoderator.imagemoderations)|This class provides the functionality for analyzing images for adult content, personal information, or human faces.|
|[TextModerations](/java/api/com.microsoft.azure.cognitiveservices.vision.contentmoderator.textmoderations)|This class provides the functionality for analyzing text for language, profanity, errors, and personal information.|


## Code examples

These code snippets show you how to do the following tasks with the Content Moderator client library for Java:

* [Authenticate the client](#authenticate-the-client)
* [Moderate text](#moderate-text)
* [Moderate images](#moderate-images)


## Authenticate the client

In the application's `main` method, create a [ContentModeratorClient](/java/api/com.microsoft.azure.cognitiveservices.vision.contentmoderator.contentmoderatorclient) object using your subscription endpoint value and subscription key.

[!code-java[](~/cognitive-services-quickstart-code/java/ContentModerator/src/main/java/ContentModeratorQuickstart.java?name=snippet_client)]



## Moderate text

### Set up sample text

At the top of your **ContentModeratorQuickstart** class, define a reference to a local text file. Add a .txt file to your project directory and enter the text you'd like to analyze.

[!code-java[](~/cognitive-services-quickstart-code/java/ContentModerator/src/main/java/ContentModeratorQuickstart.java?name=snippet_textmod_var)]

### Analyze text

Create a new method that reads the .txt file and calls the **screenText** method on each line.

[!code-java[](~/cognitive-services-quickstart-code/java/ContentModerator/src/main/java/ContentModeratorQuickstart.java?name=snippet_textmod)]

### Print text moderation results

Add the following code to print the moderation results to a .json file in your project directory.

[!code-java[](~/cognitive-services-quickstart-code/java/ContentModerator/src/main/java/ContentModeratorQuickstart.java?name=snippet_textmod_print)]

Close out the `try` and `catch` statement to complete the method.

[!code-java[](~/cognitive-services-quickstart-code/java/ContentModerator/src/main/java/ContentModeratorQuickstart.java?name=snippet_textmod_catch)]


## Moderate images

### Set up sample image

In a new method, construct a **[BodyModelModel](/java/api/com.microsoft.azure.cognitiveservices.vision.contentmoderator.models.bodymodelmodel)** object with a given URL string that points to an image.

[!code-java[](~/cognitive-services-quickstart-code/java/ContentModerator/src/main/java/ContentModeratorQuickstart.java?name=snippet_imagemod)]


### Define helper class

Then, in your *ContentModeratorQuickstart.java* file, add the following class definition inside the **ContentModeratorQuickstart** class. This inner class is used in the image moderation process.

[!code-java[](~/cognitive-services-quickstart-code/java/ContentModerator/src/main/java/ContentModeratorQuickstart.java?name=snippet_evaluationdata)]


### Analyze content
This line of code checks the image at the given URL for adult or racy content. See the Image moderation conceptual guide for information on these terms.

[!code-java[](~/cognitive-services-quickstart-code/java/ContentModerator/src/main/java/ContentModeratorQuickstart.java?name=snippet_imagemod_ar)]

### Check for text
This line of code checks the image for visible text.

[!code-java[](~/cognitive-services-quickstart-code/java/ContentModerator/src/main/java/ContentModeratorQuickstart.java?name=snippet_imagemod_text)]

### Check for faces
This line of code checks the image for human faces.

[!code-java[](~/cognitive-services-quickstart-code/java/ContentModerator/src/main/java/ContentModeratorQuickstart.java?name=snippet_imagemod_faces)]

Finally, store the returned information in the `EvaluationData` list.

[!code-java[](~/cognitive-services-quickstart-code/java/ContentModerator/src/main/java/ContentModeratorQuickstart.java?name=snippet_imagemod_storedata)]

### Print results

After the `while` loop, add the following code, which prints the results to the console and to an output file, *src/main/resources/ModerationOutput.json*.

[!code-java[](~/cognitive-services-quickstart-code/java/ContentModerator/src/main/java/ContentModeratorQuickstart.java?name=snippet_imagemod_printdata)]

Close out the `try` statement and add a `catch` statement to complete the method.

[!code-java[](~/cognitive-services-quickstart-code/java/ContentModerator/src/main/java/ContentModeratorQuickstart.java?name=snippet_imagemod_catch)]

## Run the application

You can build the app with:

```console
gradle build
```

Run the application with the `gradle run` command:

```console
gradle run
```

Then navigate to the *src/main/resources/ModerationOutput.json* file and view the results of your content moderation.

## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

In this quickstart, you learned how to use the Content Moderator Java library to perform moderation tasks. Next, learn more about the moderation of images or other media by reading a conceptual guide.

> [!div class="nextstepaction"]
> [Image moderation concepts](../../image-moderation-api.md)
