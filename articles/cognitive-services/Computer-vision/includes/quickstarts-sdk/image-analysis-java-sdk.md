---
title: "Quickstart: Image Analysis client library for Java"
description: In this quickstart, get started with the Image Analysis client library for Java.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: include
ms.date: 12/15/2020
ms.custom: devx-track-java
ms.author: pafarley
---

<a name="HOLTop"></a>

Use the Image Analysis client library to analyze an image for tags, text description, faces, adult content, and more.

[Reference documentation](/java/api/overview/azure/cognitiveservices/client/computervision) | [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/cognitiveservices/ms-azure-cs-computervision) |[Artifact (Maven)](https://search.maven.org/artifact/com.microsoft.azure.cognitiveservices/azure-cognitiveservices-computervision) | [Samples](https://azure.microsoft.com/resources/samples/?service=cognitive-services&term=vision&sort=0)

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The current version of the [Java Development Kit (JDK)](https://www.oracle.com/technetwork/java/javase/downloads/index.html)
* The [Gradle build tool](https://gradle.org/install/), or another dependency manager.
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="Create a Computer Vision resource"  target="_blank">create a Computer Vision resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Computer Vision service. You'll paste your key and endpoint into the code below later in the quickstart.
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

### Install the client library

This quickstart uses the Gradle dependency manager. You can find the client library and information for other dependency managers on the [Maven Central Repository](https://search.maven.org/artifact/com.microsoft.azure.cognitiveservices/azure-cognitiveservices-computervision).

Locate *build.gradle.kts* and open it with your preferred IDE or text editor. Then copy in the following build configuration. This configuration defines the project as a Java application whose entry point is the class **ImageAnalysisQuickstart**. It imports the Computer Vision library.

```kotlin
plugins {
    java
    application
}
application { 
    mainClass.set("ImageAnalysisQuickstart")
}
repositories {
    mavenCentral()
}
dependencies {
    implementation(group = "com.microsoft.azure.cognitiveservices", name = "azure-cognitiveservices-computervision", version = "1.0.6-beta")
}
```

### Create a Java file

From your working directory, run the following command to create a project source folder:

```console
mkdir -p src/main/java
```

Navigate to the new folder and create a file called *ImageAnalysisQuickstart.java*. Open it in your preferred editor or IDE and add the following `import` statements:

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java?name=snippet_imports)]

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java), which contains the code examples in this quickstart.

Define the class **ImageAnalysisQuickstart**.

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java?name=snippet_classdef_1)]

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java?name=snippet_classdef_2)]

Within the **ImageAnalysisQuickstart** class, create variables for your resource's key and endpoint.

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java?name=snippet_creds)]


> [!IMPORTANT]
> Go to the Azure portal. If the Computer Vision resource you created in the **Prerequisites** section deployed successfully, click the **Go to Resource** button under **Next Steps**. You can find your key and endpoint in the resource's **key and endpoint** page, under **resource management**. 
>
> Remember to remove the key from your code when you're done, and never post it publicly. For production, consider using a secure way of storing and accessing your credentials. See the Cognitive Services [security](../../../cognitive-services-security.md) article for more information.

In the application's **main** method, add calls for the methods used in this quickstart. You'll define these later.

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java?name=snippet_main)]


> [!div class="nextstepaction"]
> [I set up the client](?success=set-up-client#object-model) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Java&Section=set-up-client&product=computer-vision&page=image-analysis-java-sdk)

## Object model

The following classes and interfaces handle some of the major features of the Image Analysis Java SDK.

|Name|Description|
|---|---|
| [ComputerVisionClient](/java/api/com.microsoft.azure.cognitiveservices.vision.computervision.computervisionclient) | This class is needed for all Computer Vision functionality. You instantiate it with your subscription information, and you use it to produce instances of other classes.|
|[ComputerVision](/java/api/com.microsoft.azure.cognitiveservices.vision.computervision.computervision)| This class comes from the client object and directly handles all of the image operations, such as image analysis, text detection, and thumbnail generation.|
|[VisualFeatureTypes](/java/api/com.microsoft.azure.cognitiveservices.vision.computervision.models.visualfeaturetypes)| This enum defines the different types of image analysis that can be done in a standard Analyze operation. You specify a set of VisualFeatureTypes values depending on your needs. |

## Code examples

These code snippets show you how to do the following tasks with the Image Analysis client library for Java:

* [Authenticate the client](#authenticate-the-client)
* [Analyze an image](#analyze-an-image)

## Authenticate the client

In a new method, instantiate a [ComputerVisionClient](/java/api/com.microsoft.azure.cognitiveservices.vision.computervision.computervisionclient) object with your endpoint and key.

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java?name=snippet_auth)]

> [!div class="nextstepaction"]
> [I authenticated the client](?success=authenticate-client#analyze-an-image) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Java&Section=authenticate-client&product=computer-vision&page=image-analysis-java-sdk)

## Analyze an image

The following code defines a method, `AnalyzeLocalImage`, which uses the client object to analyze a local image and print the results. The method returns a text description, categorization, list of tags, detected faces, adult content flags, main colors, and image type.

> [!TIP]
> You can also analyze a remote image using its URL. See the [ComputerVision](/java/api/com.microsoft.azure.cognitiveservices.vision.computervision.computervision) methods, such as **AnalyzeImage**. Or, see the sample code on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java) for scenarios involving remote images.

### Set up test image

First, create a **resources/** folder in the **src/main/** folder of your project, and add an image you'd like to analyze. Then add the following method definition to your **ImageAnalysisQuickstart** class. Change the value of the `pathToLocalImage` to match your image file. 

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java?name=snippet_analyzelocal_refs)]

### Specify visual features

Next, specify which visual features you'd like to extract in your analysis. See the [VisualFeatureTypes](/java/api/com.microsoft.azure.cognitiveservices.vision.computervision.models.visualfeaturetypes) enum for a complete list.

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java?name=snippet_analyzelocal_features)]

### Analyze
This block prints detailed results to the console for each scope of image analysis. The **analyzeImageInStream** method returns an **ImageAnalysis** object that contains all of extracted information.

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java?name=snippet_analyzelocal_analyze)]

The following sections show how to parse this information in detail.

### Get image description

The following code gets the list of generated captions for the image. For more information, see [Describe images](../../concept-describing-images.md).

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java?name=snippet_analyzelocal_captions)]

### Get image category

The following code gets the detected category of the image. For more information, see [Categorize images](../../concept-categorizing-images.md).

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java?name=snippet_analyzelocal_category)]

### Get image tags

The following code gets the set of detected tags in the image. For more information, see [Content tags](../../concept-tagging-images.md).

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java?name=snippet_analyzelocal_tags)]

### Detect faces

The following code returns the detected faces in the image with their rectangle coordinates and selects face attributes. For more information, see [Face detection](../../concept-detecting-faces.md).

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java?name=snippet_analyzelocal_faces)]

### Detect objects

The following code returns the detected objects in the image with their coordinates. For more information, see [Object detection](../../concept-object-detection.md).

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java?name=snippet_analyzelocal_objects)]


### Detect brands

The following code returns the detected brand logos in the image with their coordinates. For more information, see [Brand detection](../../concept-brand-detection.md).

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java?name=snippet_analyzelocal_brands)]



### Detect adult, racy, or gory content

The following code prints the detected presence of adult content in the image. For more information, see [Adult, racy, gory content](../../concept-detecting-adult-content.md).

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java?name=snippet_analyzelocal_adult)]

### Get image color scheme

The following code prints the detected color attributes in the image, like the dominant colors and accent color. For more information, see [Color schemes](../../concept-detecting-color-schemes.md).

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java?name=snippet_analyzelocal_colors)]

### Get domain-specific content

Image Analysis can use specialized model to do further analysis on images. For more information, see [Domain-specific content](../../concept-detecting-domain-content.md). 

The following code parses data about detected celebrities in the image.

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java?name=snippet_analyzelocal_celebrities)]

The following code parses data about detected landmarks in the image.

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java?name=snippet_analyzelocal_landmarks)]

### Get the image type

The following code prints information about the type of image&mdash;whether it is clip art or line drawing.

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java?name=snippet_imagetype)]

> [!div class="nextstepaction"]
> [I analyzed an image](?success=analyze-image#run-the-application) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Java&Section=analyze-image&product=computer-vision&page=image-analysis-java-sdk)

### Close out the method

Complete the try/catch block and close the method.

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java?name=snippet_analyze_catch)]


## Run the application

You can build the app with:

```console
gradle build
```

Run the application with the `gradle run` command:

```console
gradle run
```

> [!div class="nextstepaction"]
> [I ran the application](?success=run-the-application#clean-up-resources) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Java&Section=run-the-application&product=computer-vision&page=image-analysis-java-sdk)

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

> [!div class="nextstepaction"]
> [I cleaned up resources](?success=clean-up-resources#next-steps) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Java&Section=clean-up-resources&product=computer-vision&page=image-analysis-java-sdk)

## Next steps

In this quickstart, you learned how to install the Image Analysis client library and make basic image analysis calls. Next, learn more about the Analyze API features.

> [!div class="nextstepaction"]
>[Call the Analyze API](../../Vision-API-How-to-Topics/HowToCallVisionAPI.md)

* [Image Analysis overview](../../overview-image-analysis.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java).
