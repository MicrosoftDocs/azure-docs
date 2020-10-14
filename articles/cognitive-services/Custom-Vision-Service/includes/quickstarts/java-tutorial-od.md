---
author: areddish
ms.custom: devx-track-java
ms.author: areddish
ms.service: cognitive-services
ms.date: 10/13/2020
---

Get started using the Custom Vision client library for Java to build an object detection model. Follow these steps to install the package and try out the example code for basic tasks. Use this example as a template for building your own image recognition app.

> [!NOTE]
> If you want to build and train an object detection model _without_ writing code, see the [browser-based guidance](../../get-started-build-detector.md) instead.

Use the Custom Vision client library for Java to:

* Create a new Custom Vision project
* Add tags to the project
* Upload and tag images
* Train the project
* Test the prediction endpoint

[Reference documentation](https://docs.microsoft.com/en-us/java/api/overview/azure/cognitiveservices/client/customvision?view=azure-java-stable) | 
Library source code [(training)](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/cognitiveservices/ms-azure-cs-customvision-training) [(prediction)](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/cognitiveservices/ms-azure-cs-customvision-prediction)| 
Artifact (Maven) [(training)](https://search.maven.org/artifact/com.azure/azure-cognitiveservices-customvision-training/1.1.0-preview.2/jar) [(prediction)](https://search.maven.org/artifact/com.azure/azure-cognitiveservices-customvision-prediction/1.1.0-preview.2/jar) | 
[Samples](https://docs.microsoft.com/en-us/samples/browse/?products=azure&terms=custom%20vision)


## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The current version of the [Java Development Kit(JDK)](https://www.oracle.com/technetwork/java/javase/downloads/index.html)
* The [Gradle build tool](https://gradle.org/install/), or another dependency manager.
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesCustomVision"  title="Create a Custom Vision resource"  target="_blank">create a Custom Vision resource <span class="docon docon-navigate-external x-hidden-focus"></span></a> in the Azure portal to create a training and prediction resource and get your keys and endpoint. Wait for it to deploy and click the **Go to resource** button.
    * You will need the key and endpoint from the resources you create to connect your application to Custom Vision. You'll paste your key and endpoint into the code below later in the quickstart.
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

Locate *build.gradle.kts* and open it with your preferred IDE or text editor. Then copy in the following build configuration. This configuration defines the project as a Java application whose entry point is the class **CustomVisionQuickstart**. It imports the Custom Vision libraries.

```kotlin
plugins {
    java
    application
}
application { 
    mainClassName = "CustomVisionQuickstart"
}
repositories {
    mavenCentral()
}
dependencies {
    compile(group = "com.azure", name = "azure-cognitiveservices-customvision-training", version = "1.1.0-preview.2")
    compile(group = "com.azure", name = "azure-cognitiveservices-customvision-prediction", version = "1.1.0-preview.2")
}
```

### Create a Java file


From your working directory, run the following command to create a project source folder:

```console
mkdir -p src/main/java
```

Navigate to the new folder and create a file called *CustomVisionQuickstart.java*. Open it in your preferred editor or IDE and add the following `import` statements:

[!code-java[](~/cognitive-services-quickstart-code/java/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?name=snippet_imports)]

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it on [GitHub](tbd), which contains the code examples in this quickstart.

[!code-java[](~/cognitive-services-quickstart-code/java/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?name=snippet_imports)]


In the application's **CustomVisionQuickstart** class, create variables for your resource's keys and endpoint.

[!code-java[](~/cognitive-services-quickstart-code/java/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?name=snippet_creds)]


> [!IMPORTANT]
> Go to the Azure portal. If the [Product name] resource you created in the **Prerequisites** section deployed successfully, click the **Go to Resource** button under **Next Steps**. You can find your key and endpoint in the resource's **key and endpoint** page, under **resource management**. 
>
> Remember to remove the key from your code when you're done, and never post it publicly. For production, consider using a secure way of storing and accessing your credentials. See the Cognitive Services [security](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-security) article for more information.

In the application's **main** method, add calls for the methods used in this quickstart. You'll define these later.

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/src/main/java/ComputerVisionQuickstart.java?name=snippet_maincalls)]

## Examine the code

Load the `Vision/CustomVision` project in your Java IDE and open the _CustomVisionSamples.java_ file. Find the **runSample** method and comment out the **ImageClassification_Sample** method call&mdash;this method executes the image classification scenario, which is not covered in this guide. The **ObjectDetection_Sample** method implements the primary functionality of this quickstart; navigate to its definition and inspect the code. 

## Create a new Custom Vision project

Go to the code block that creates a training client and an object detection project. The created project will show up on the [Custom Vision website](https://customvision.ai/) that you visited earlier. See the [CreateProject](https://docs.microsoft.com/java/api/com.microsoft.azure.cognitiveservices.vision.customvision.training.trainings.createproject?view=azure-java-stable#com_microsoft_azure_cognitiveservices_vision_customvision_training_Trainings_createProject_String_CreateProjectOptionalParameter_&preserve-view=true) method overloads to specify other options when you create your project (explained in the [Build a detector](../../get-started-build-detector.md) web portal guide).

[!code-java[](~/cognitive-services-quickstart-code/java/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?name=snippet_create_od)]

## Add tags to your project

[!code-java[](~/cognitive-services-quickstart-code/java/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?name=snippet_tags_od)]

## Upload and tag images

When you tag images in object detection projects, you need to specify the region of each tagged object using normalized coordinates. Go to the definition of the `regionMap` Map. This code associates each of the sample images with its tagged region.

> [!NOTE]
> If you don't have a click-and-drag utility to mark the coordinates of regions, you can use the web UI at [Customvision.ai](https://www.customvision.ai/). In this example, the coordinates are already provided.

[!code-java[](~/cognitive-services-quickstart-code/java/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?name=snippet_od_mapping)]

Then, skip to the code block that adds the images to the project. The images are read from the **src/main/resources** folder of the project and are uploaded to the service with their appropriate tags and region coordinates.

[!code-java[](~/cognitive-services-quickstart-code/java/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?name=snippet_upload_od)]

The previous code snippet makes use of two helper functions that retrieve the images as resource streams and upload them to the service (you can upload up to 64 images in a single batch).

[!code-java[](~/cognitive-services-quickstart-code/java/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?name=snippet_helpers)]

## Train the project and publish

This code creates the first iteration of the prediction model and then publishes that iteration to the prediction endpoint. The name given to the published iteration can be used to send prediction requests. An iteration is not available in the prediction endpoint until it is published.

[!code-java[](~/cognitive-services-quickstart-code/java/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?name=snippet_train_od)]

## Use the prediction endpoint

The prediction endpoint, represented by the `predictor` object here, is the reference that you use to submit an image to the current model and get a classification prediction. In this sample, `predictor` is defined elsewhere using the prediction key environment variable.

[!code-java[](~/cognitive-services-quickstart-code/java/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?name=snippet_prediction_od)]

## Run the application

To compile and run the solution using maven, navigate to the project directory (**Vision/CustomVision**) in a command prompt and execute the run command:

```bash
mvn compile exec:java
```

View the console output for logging and prediction results. You can then verify that the test image is tagged appropriately and that the region of detection is correct.

[!INCLUDE [clean-od-project](../../includes/clean-od-project.md)]

## Next steps

Now you've done every step of the object detection process in code. This sample executes a single training iteration, but often you'll need to train and test your model multiple times in order to make it more accurate. The following guide deals with image classification, but its principles are similar to object detection.

> [!div class="nextstepaction"]
> [Test and retrain a model](../../test-your-model.md)

* [What is Custom Vision?](../../overview.md)
* The source code for this sample can be found on [GitHub](tbd)
