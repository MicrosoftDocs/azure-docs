---
title: "Quickstart: Image Analysis client library for Java"
description: In this quickstart, get started with the Image Analysis client library for Java.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-vision
ms.topic: include
ms.date: 12/15/2020
ms.custom: devx-track-java
ms.author: pafarley
---

<a name="HOLTop"></a>

Use the Image Analysis client library to analyze a remote image for tags, text description, faces, adult content, and more.

> [!TIP]
> You can also analyze a local image. See the [ComputerVision](/java/api/com.microsoft.azure.cognitiveservices.vision.computervision.computervision) methods, such as **AnalyzeImage**. Or, see the sample code on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java) for scenarios involving local images.

> [!TIP]
> The Analyze API can do many different operations other than generate image tags. See the [Image Analysis how-to guide](../../how-to/call-analyze-image.md) for examples that showcase all of the available features.

[Reference documentation](/java/api/overview/azure/cognitiveservices/client/computervision) | [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/cognitiveservices/ms-azure-cs-computervision) |[Artifact (Maven)](https://search.maven.org/artifact/com.microsoft.azure.cognitiveservices/azure-cognitiveservices-computervision) | [Samples](/samples/browse/?products=azure&terms=computer-vision)

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The current version of the [Java Development Kit (JDK)](https://www.microsoft.com/openjdk)
* The [Gradle build tool](https://gradle.org/install/), or another dependency manager.
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="create a Vision resource"  target="_blank">create a Vision resource</a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
    * You need the key and endpoint from the resource you create to connect your application to the Azure AI Vision service.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.



[!INCLUDE [create environment variables](../environment-variables.md)]


## Analyze image

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

    Locate *build.gradle.kts* and open it with your preferred IDE or text editor. Then copy in the following build configuration. This configuration defines the project as a Java application whose entry point is the class **ImageAnalysisQuickstart**. It imports the Azure AI Vision library.

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
        implementation(group = "com.microsoft.azure.cognitiveservices", name = "azure-cognitiveservices-computervision", version = "1.0.9-beta")
    }
    ```

1. Create a Java file.

    From your working directory, run the following command to create a project source folder:

    ```console
    mkdir -p src/main/java
    ```

    Navigate to the new folder and create a file called *ImageAnalysisQuickstart.java*. 


1. Open *ImageAnalysisQuickstart.java* in your preferred editor or IDE and paste in the following code.

   [!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/src/main/java/ImageAnalysisQuickstart-single.java?name=snippet_single)]


1. Navigate back to the project root folder, and build the app with:

   ```console
   gradle build
   ```
   
   Then, run it with the `gradle run` command:
   
   ```console
   gradle run
   ```



## Output

```console
Azure AI Vision - Java Quickstart Sample

Analyzing an image from a URL ...

Tags:
'person' with confidence 0.998895
'human face' with confidence 0.997437
'smile' with confidence 0.991973
'outdoor' with confidence 0.985962
'happy' with confidence 0.969785
'clothing' with confidence 0.961570
'friendship' with confidence 0.946441
'tree' with confidence 0.917331
'female person' with confidence 0.890976
'girl' with confidence 0.888741
'social group' with confidence 0.872044
'posing' with confidence 0.865493
'adolescent' with confidence 0.857371
'love' with confidence 0.852553
'laugh' with confidence 0.850097
'people' with confidence 0.849922
'lady' with confidence 0.844540
'woman' with confidence 0.818172
'group' with confidence 0.792975
'wedding' with confidence 0.615252
'dress' with confidence 0.517169
```


## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

In this quickstart, you learned how to install the Image Analysis client library and make basic image analysis calls. Next, learn more about the Analyze API features.

> [!div class="nextstepaction"]
>[Call the Analyze API](../../how-to/call-analyze-image.md)

* [Image Analysis overview](../../overview-image-analysis.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java).
