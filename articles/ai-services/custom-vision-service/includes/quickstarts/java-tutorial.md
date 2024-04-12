---
author: PatrickFarley
ms.custom: devx-track-java
ms.author: pafarley
ms.service: azure-ai-custom-vision
ms.date: 10/13/2020
ms.topic: include
---

Get started using the Custom Vision client library for Java to build an image classification model. Follow these steps to install the package and try out the example code for basic tasks. Use this example as a template for building your own image recognition app.

> [!NOTE]
> If you want to build and train a classification model _without_ writing code, see the [browser-based guidance](../../getting-started-build-a-classifier.md) instead.

Use the Custom Vision client library for Java to:

* Create a new Custom Vision project
* Add tags to the project
* Upload and tag images
* Train the project
* Publish the current iteration
* Test the prediction endpoint

[Reference documentation](/java/api/overview/azure/cognitiveservices/client/customvision) | 
Library source code [(training)](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/cognitiveservices/ms-azure-cs-customvision-training) [(prediction)](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/cognitiveservices/ms-azure-cs-customvision-prediction)| 
Artifact (Maven) [(training)](https://search.maven.org/artifact/com.azure/azure-cognitiveservices-customvision-training/1.1.0-preview.2/jar) [(prediction)](https://search.maven.org/artifact/com.azure/azure-cognitiveservices-customvision-prediction/1.1.0-preview.2/jar) | 
[Samples](/samples/browse/?products=azure&terms=custom%20vision)

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The current version of the [Java Development Kit(JDK)](https://www.microsoft.com/openjdk)
* The [Gradle build tool](https://gradle.org/install/), or another dependency manager.
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesCustomVision"  title="Create a Custom Vision resource"  target="_blank">create a Custom Vision resource </a> in the Azure portal to create a training and prediction resource.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

[!INCLUDE [create environment variables](../environment-variables.md)]

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
> Want to view the whole quickstart code file at once? You can find it on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/java/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java), which contains the code examples in this quickstart.


In the application's **CustomVisionQuickstart** class, create variables that retrieve your resource's keys and endpoint from environment variables.

[!code-java[](~/cognitive-services-quickstart-code/java/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?name=snippet_creds)]


> [!IMPORTANT]
> Go to the Azure portal. If the Custom Vision resources you created in the **Prerequisites** section deployed successfully, select the **Go to Resource** button under **Next Steps**. You can find your keys and endpoint in the resources' **key and endpoint** pages. You'll need to get the keys for both your training and prediction resources, along with the API endpoint for your training resource.
>
> You can find the prediction resource ID on the resource's **Properties** tab in the Azure portal, listed as **Resource ID**.

> [!IMPORTANT]
> Remember to remove the keys from your code when you're done, and never post them publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md). See the Azure AI services [security](../../../security-features.md) article for more information.

In the application's **main** method, add calls for the methods used in this quickstart. You'll define these later.

[!code-java[](~/cognitive-services-quickstart-code/java/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?name=snippet_maincalls)]

## Object model

The following classes and interfaces handle some of the major features of the Custom Vision Java client library.

|Name|Description|
|---|---|
|[CustomVisionTrainingClient](/java/api/com.microsoft.azure.cognitiveservices.vision.customvision.training.customvisiontrainingclient) | This class handles the creation, training, and publishing of your models. |
|[CustomVisionPredictionClient](/java/api/com.microsoft.azure.cognitiveservices.vision.customvision.prediction.customvisionpredictionclient)| This class handles the querying of your models for image classification predictions.|
|[ImagePrediction](/java/api/com.microsoft.azure.cognitiveservices.vision.customvision.prediction.models.imageprediction)| This class defines a single prediction on a single image. It includes properties for the object ID and name, and a confidence score.|

## Code examples

These code snippets show you how to do the following tasks with the Custom Vision client library for Java:

* [Authenticate the client](#authenticate-the-client)
* [Create a new Custom Vision project](#create-a-new-custom-vision-project)
* [Add tags to the project](#add-tags-to-the-project)
* [Upload and tag images](#upload-and-tag-images)
* [Train the project](#train-the-project)
* [Publish the current iteration](#publish-the-current-iteration)
* [Test the prediction endpoint](#test-the-prediction-endpoint)

## Authenticate the client

In your **main** method, instantiate training and prediction clients using your endpoint and keys.

[!code-java[](~/cognitive-services-quickstart-code/java/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?name=snippet_auth)]


## Create a Custom Vision project

T## Create a new Custom Vision project

This next method creates an image classification project. The created project will show up on the [Custom Vision website](https://customvision.ai/) that you visited earlier. See the [CreateProject](/java/api/com.microsoft.azure.cognitiveservices.vision.customvision.training.trainings.createproject#com_microsoft_azure_cognitiveservices_vision_customvision_training_Trainings_createProject_String_CreateProjectOptionalParameter_&preserve-view=true) method overloads to specify other options when you create your project (explained in the [Build a detector](../../get-started-build-detector.md) web portal guide).

[!code-java[](~/cognitive-services-quickstart-code/java/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?name=snippet_create)]

## Add tags to your project

This method defines the tags that you will train the model on.

[!code-java[](~/cognitive-services-quickstart-code/java/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?name=snippet_tags)]

## Upload and tag images

First, download the sample images for this project. Save the contents of the [sample Images folder](https://github.com/Azure-Samples/cognitive-services-sample-data-files/tree/master/CustomVision/ImageClassification/Images) to your local device.

[!code-java[](~/cognitive-services-quickstart-code/java/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?name=snippet_upload)]

The previous code snippet makes use of two helper functions that retrieve the images as resource streams and upload them to the service (you can upload up to 64 images in a single batch).

[!code-java[](~/cognitive-services-quickstart-code/java/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?name=snippet_helpers)]

## Train the project

This method creates the first training iteration in the project. It queries the service until training is completed.

[!code-java[](~/cognitive-services-quickstart-code/java/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?name=snippet_train)]


## Publish the current iteration

This method makes the current iteration of the model available for querying. You can use the model name as a reference to send prediction requests. You need to enter your own value for `predictionResourceId`. You can find the prediction resource ID on the resource's **Properties** tab in the Azure portal, listed as **Resource ID**.

[!code-java[](~/cognitive-services-quickstart-code/java/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?name=snippet_publish)]

## Test the prediction endpoint

This method loads the test image, queries the model endpoint, and outputs prediction data to the console.

[!code-java[](~/cognitive-services-quickstart-code/java/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?name=snippet_predict)]

## Run the application

You can build the app with:

```console
gradle build
```

Run the application with the `gradle run` command:

```console
gradle run
```

## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../../multi-service-resource.md?pivots=azcli#clean-up-resources)

[!INCLUDE [clean-ic-project](../../includes/clean-ic-project.md)]

## Next steps

Now you've seen how every step of the image classification process can be done in code. This sample executes a single training iteration, but often you'll need to train and test your model multiple times in order to make it more accurate.

> [!div class="nextstepaction"]
> [Test and retrain a model](../../test-your-model.md)

* [What is Custom Vision?](../../overview.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/java/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java)
