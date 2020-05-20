---
title: "Content Moderator Java client library quickstart"
titleSuffix: Azure Cognitive Services
description: In this quickstart, learn how to get started with the Azure Cognitive Services Content Moderator client library for Java.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: content-moderator
ms.topic: include
ms.date: 01/27/2020
ms.author: pafarley
---

Get started with the Content Moderator client library for Java. Follow these steps to install the package and try out the example code for basic tasks. Content Moderator is a cognitive service that checks text, image, and video content for material that is potentially offensive, risky, or otherwise undesirable. When such material is found, the service applies appropriate labels (flags) to the content. Your app can then handle flagged content in order to comply with regulations or maintain the intended environment for users.

Use the Content Moderator client library for Java to:

* Moderate images for adult or racy content, text, or human faces.

[Reference documentation](https://docs.microsoft.com/java/api/overview/azure/cognitiveservices/client/contentmoderator?view=azure-java-stable) | [Artifact (Maven)](https://mvnrepository.com/artifact/com.microsoft.azure.cognitiveservices/azure-cognitiveservices-contentmoderator) | [Samples](https://docs.microsoft.com/samples/browse/?products=azure&term=content-moderator)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* The current version of the [Java Development Kit (JDK)](https://www.oracle.com/technetwork/java/javase/downloads/index.html)
* The [Gradle build tool](https://gradle.org/install/), or another dependency manager.

## Setting up

### Create a Content Moderator Azure resource

Azure Cognitive Services are represented by Azure resources that you subscribe to. Create a resource for Content Moderator using the [Azure portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) or [Azure CLI](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account-cli) on your local machine. You can also:

* Get a [trial key](https://azure.microsoft.com/try/cognitive-services/#decision) valid for seven days for free. After you sign up, it will be available on the [Azure website](https://azure.microsoft.com/try/cognitive-services/my-apis/).  
* View your resource on the [Azure portal](https://portal.azure.com/).

After getting a key from your trial subscription or resource, [create an environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the key, named `AZURE_CONTENTMODERATOR_KEY`.

### Create a new Gradle project

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it. 

```console
mkdir myapp && cd myapp
```
Run `gradle init`. This command will create essential build files for Gradle, including *build.gradle.kts*, which is used at runtime to create and configure your application. Run this command from your working directory:

```console
gradle init --type basic
```

When prompted to choose a build script DSL, select **Kotlin**.

Find *build.gradle.kts* and open it with your preferred IDE or text editor. Then copy in the following build configuration. This configuration defines the project as a Java application whose entry point is the class **ContentModeratorQuickstart**. It imports the Content Moderator client library as well as the Gson sdk for JSON serialization.

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

From your working directory, run the following command to create a project source folder.

```console
mkdir -p src/main/java
```

Then create a file named *ContentModeratorQuickstart.java* in the new folder. Open the file in your preferred editor or IDE and import the following libraries at the top:

[!code-java[](~/cognitive-services-quickstart-code/java/ContentModerator/src/main/java/ContentModeratorQuickstart.java?name=snippet_imports)]

## Object model

The following classes handle some of the major features of the Content Moderator Java client library.

|Name|Description|
|---|---|
|[ContentModeratorClient](https://docs.microsoft.com/java/api/com.microsoft.azure.cognitiveservices.vision.contentmoderator.contentmoderatorclient?view=azure-java-stable)|This class is needed for all Content Moderator functionality. You instantiate it with your subscription information, and you use it to produce instances of other classes.|
|[ImageModeration](https://docs.microsoft.com/java/api/com.microsoft.azure.cognitiveservices.vision.contentmoderator.imagemoderations?view=azure-java-stable)|This class provides the functionality for analyzing images for adult content, personal information, or human faces.|
|[TextModerations](https://docs.microsoft.com/java/api/com.microsoft.azure.cognitiveservices.vision.contentmoderator.textmoderations?view=azure-java-stable)|This class provides the functionality for analyzing text for language, profanity, errors, and personal information.|
|[Reviews](https://docs.microsoft.com/java/api/com.microsoft.azure.cognitiveservices.vision.contentmoderator.reviews?view=azure-java-stable)|This class provides the functionality of the Review APIs, including the methods for creating jobs, custom workflows, and human reviews.|


## Code examples

These code snippets show you how to do the following tasks with the Content Moderator client library for Java:

* [Authenticate the client](#authenticate-the-client)
* [Moderate images](#moderate-images)

## Authenticate the client

> [!NOTE]
> This step assumes you've [created an environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for your Content Moderator key, named `AZURE_CONTENTMODERATOR_KEY`.

In the application's `main` method, create a [ContentModeratorClient](https://docs.microsoft.com/java/api/com.microsoft.azure.cognitiveservices.vision.contentmoderator.contentmoderatorclient?view=azure-java-stable) object using your subscription endpoint value and subscription key environment variable. 

> [!NOTE]
> If you created the environment variable after you launched the application, you will need to close and reopen the editor, IDE, or shell running it to access the variable.

[!code-java[](~/cognitive-services-quickstart-code/java/ContentModerator/src/main/java/ContentModeratorQuickstart.java?name=snippet_client)]

## Moderate images

### Get images

In the **src/main/** folder of your project, create a **resources** folder and navigate to it. Then create a new text file, *ImageFiles.txt*. In this file, you add the URLs of images to analyze&mdash;one URL on each line. You can use the following sample images:

```
https://moderatorsampleimages.blob.core.windows.net/samples/sample2.jpg
https://moderatorsampleimages.blob.core.windows.net/samples/sample5.png
```

### Define helper class

Then, in your *ContentModeratorQuickstart.java* file, add the following class definition inside the **ContentModeratorQuickstart** class. This inner class will be used later in the image moderation process.

[!code-java[](~/cognitive-services-quickstart-code/java/ContentModerator/src/main/java/ContentModeratorQuickstart.java?name=snippet_evaluationdata)]

### Iterate through images

Next, add the following code to the bottom of the `main` method. Or, you can add it to a separate method that's called from `main`. This code steps through each line of the _ImageFiles.txt_ file.

[!code-java[](~/cognitive-services-quickstart-code/java/ContentModerator/src/main/java/ContentModeratorQuickstart.java?name=snippet_imagemod_iterate)]

### Check for adult/racy content
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

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

In this quickstart, you learned how to use the Content Moderator Java library to perform moderation tasks. Next, learn more about the moderation of images or other media by reading a conceptual guide.

> [!div class="nextstepaction"]
>[Image moderation concepts](https://docs.microsoft.com/azure/cognitive-services/content-moderator/image-moderation-api)

* [What is Azure Content Moderator?](../../overview.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/java/ContentModerator/src/main/java/ContentModeratorQuickstart.java).