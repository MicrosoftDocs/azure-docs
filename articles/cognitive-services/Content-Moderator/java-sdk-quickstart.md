---
title: "Quickstart: Content Moderator client library for Java | Microsoft Docs"
description: Get started with the Content Moderator client library for Java.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: content-moderator
ms.topic: quickstart
ms.date: 07/16/2019
ms.author: pafarley
---

# Quickstart: Content Moderator client library for Java

Get started with the Content Moderator client library for Java. Follow these steps to install the package and try out the example code for basic tasks. Content Moderator is a cognitive service that checks text, image, and video content for material that is potentially offensive, risky, or otherwise undesirable. When such material is found, the service applies appropriate labels (flags) to the content. Your app can then handle flagged content in order to comply with regulations or maintain the intended environment for users.

Use the Content Moderator client library for Java to:

* Moderate images for adult or racy content, text, or human faces.

[Reference documentation](https://docs.microsoft.com/java/api/overview/azure/cognitiveservices/client/contentmoderator?view=azure-java-stable) | [Artifact (Maven)](https://mvnrepository.com/artifact/com.microsoft.azure.cognitiveservices/azure-cognitiveservices-contentmoderator) | [Samples](https://azure.microsoft.com/resources/samples/?service=cognitive-services&term=content+moderator&sort=0)

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

Find *build.gradle.kts* and open it with your preferred IDE or text editor. Then copy in the following build configuration. This configuration defines the project as a Java application whose entry point is the class **ContentModeratorQuickstart**. It imports the Content Moderator SDK as well as the Gson sdk for JSON serialization.

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

```java
import com.google.gson.*;

import com.microsoft.azure.cognitiveservices.vision.contentmoderator.*;
import com.microsoft.azure.cognitiveservices.vision.contentmoderator.models.*;

import java.io.*;
import java.lang.Object.*;
import java.util.*;
```

## Object model

The following classes handle some of the major features of the Content Moderator Java SDK.

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

### Authenticate the client

> [!NOTE]
> This step assumes you've [created an environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for your Content Moderator key, named `AZURE_CONTENTMODERATOR_KEY`.


In the application's `main` method, create a [ContentModeratorClient](https://docs.microsoft.com/java/api/com.microsoft.azure.cognitiveservices.vision.contentmoderator.contentmoderatorclient?view=azure-java-stable) object using your subscription endpoint value and subscription key environment variable. 

> [!NOTE]
> If you created the environment variable after you launched the application, you will need to close and reopen the editor, IDE, or shell running it to access the variable.

```java
/**
 * Authenticate
 */
// Create a variable called AZURE_CONTENTMODERATOR_KEY in your environment settings, with your key as its value.
// Replace the first part ("westus") with your own, if needed.
ContentModeratorClient client = ContentModeratorManager
    .authenticate(new AzureRegionBaseUrl()
    .fromString("https://westus.api.cognitive.microsoft.com"), System.getenv("AZURE_CONTENTMODERATOR_KEY"));
```

### Moderate images

In the **src/main/** folder of your project, create a **resources** folder and navigate to it. Then create a new text file, *ImageFiles.txt*. In this file, you add the URLs of images to analyze&mdash;one URL on each line. You can use the following sample contents:

```
https://moderatorsampleimages.blob.core.windows.net/samples/sample2.jpg
https://moderatorsampleimages.blob.core.windows.net/samples/sample5.png
```

Then, in your *ContentModeratorQuickstart.java* file, add the following class definition inside the **ContentModeratorQuickstart** class. This inner class will be used later in the image moderation process.

```Java    
// Contains the image moderation results for an image, including text and face detection.
public static class EvaluationData {
    // The URL of the evaluated image.
    public String ImageUrl;
    // The image moderation results.
    public Evaluate ImageModeration;
    // The text detection results.
    public OCR TextDetection;
    // The face detection results;
    public FoundFaces FaceDetection;
}
```

Next, add the following code to the bottom of the `main` method. Or, you can add it to a separate method that's called from `main`. This code uses the Content Moderator client object to analyze the images at the given URLs for adult/racy content, image text, and human faces. It stores the returned information in `EvaluationData` objects and then prints the results to an output file, *src/main/resources/ModerationOutput.json*.

```java
// Create an object in which to store the image moderation results.
List<EvaluationData> evaluationData = new ArrayList<EvaluationData>();

/**
 * Read image URLs from the input file and evaluate/moderate each one.
 */
// ImageFiles.txt is the file that contains the image URLs to evaluate.
// Relative paths are relative to the execution directory.
try (BufferedReader inputStream = new BufferedReader(new FileReader(new File("src\\main\\resources\\ImageFiles.txt")))){
    String line;
    while ((line = inputStream.readLine()) != null) {
        if (line.length() > 0) {
            // Evalutate each line of text
            BodyModelModel url = new BodyModelModel();
            url.withDataRepresentation("URL");
            url.withValue(line);
            EvaluationData imageData = new EvaluationData(); 
            imageData.ImageUrl = url.value();

            // Evaluate for adult and racy content.
            imageData.ImageModeration = client.imageModerations().evaluateUrlInput("application/json", url, new EvaluateUrlInputOptionalParameter().withCacheImage(true));
            Thread.sleep(1000);

            // Detect and extract text.
            imageData.TextDetection = client.imageModerations().oCRUrlInput("eng", "application/json", url, new OCRUrlInputOptionalParameter().withCacheImage(true));
            Thread.sleep(1000);

            // Detect faces.
            imageData.FaceDetection = client.imageModerations().findFacesUrlInput("application/json", url, new FindFacesUrlInputOptionalParameter().withCacheImage(true));
            Thread.sleep(1000);

            evaluationData.add(imageData);
        }
    }

    // Save the moderation results to a file.
    // ModerationOutput.json is the file to contain the output from the evaluation.
    // Relative paths are relative to the execution directory.
    BufferedWriter writer = new BufferedWriter(new FileWriter(new File("src\\main\\resources\\ModerationOutput.json")));
    Gson gson = new GsonBuilder().setPrettyPrinting().create();            
    System.out.println("adding imageData to file: " + gson.toJson(evaluationData).toString());
    writer.write(gson.toJson(evaluationData).toString());
    writer.close();

}   catch (Exception e) {
    System.out.println(e.getMessage());
    e.printStackTrace();
}
```

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

* [Portal](../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

In this quickstart, you learned how to use the Content Moderator Java library to perform moderation tasks. Next, learn more about the moderation of images or other media by reading a conceptual guide.

> [!div class="nextstepaction"]
>[Image moderation concepts](https://docs.microsoft.com/azure/cognitive-services/content-moderator/image-moderation-api)

* [What is Azure Content Moderator?](./overview.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-java-sdk-samples/blob/master/ContentModerator/ContentModeratorQuickstart/src/main/java/ContentModeratorQuickstart.java).