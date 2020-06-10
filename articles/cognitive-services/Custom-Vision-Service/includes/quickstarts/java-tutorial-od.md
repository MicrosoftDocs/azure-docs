---
author: areddish
ms.author: areddish
ms.service: cognitive-services
ms.date: 04/14/2020
---

This article shows you how to get started using the Custom Vision SDK with Java to build an object detection model. After it's created, you can add tagged regions, upload images, train the project, obtain the project's default prediction endpoint URL, and use the endpoint to programmatically test an image. Use this example as a template for building your own Java application.

## Prerequisites

- A Java IDE of your choice
- [JDK 7 or 8](https://aka.ms/azure-jdks) installed.
- [Maven](https://maven.apache.org/) installed
- [!INCLUDE [create-resources](../../includes/create-resources.md)]

## Get the Custom Vision SDK and sample code

To write a Java app that uses Custom Vision, you'll need the Custom Vision maven packages. These packages are included in the sample project you will download, but you can access them individually here.

You can find the Custom Vision SDK in the maven central repository:
- [Training SDK](https://mvnrepository.com/artifact/com.microsoft.azure.cognitiveservices/azure-cognitiveservices-customvision-training)
- [Prediction SDK](https://mvnrepository.com/artifact/com.microsoft.azure.cognitiveservices/azure-cognitiveservices-customvision-prediction)

Clone or download the [Cognitive Services Java SDK Samples](https://github.com/Azure-Samples/cognitive-services-java-sdk-samples/tree/master) project. Navigate to the **Vision/CustomVision/** folder.

This Java project creates a new Custom Vision object detection project named __Sample Java OD Project__, which can be accessed through the [Custom Vision website](https://customvision.ai/). It then uploads images to train and test a classifier. In this project, the classifier is intended to determine whether an object is a **fork** or **scissors**.

[!INCLUDE [get-keys](../../includes/get-keys.md)]

The program is configured to reference your key data as environment variables. Navigate to the **Vision/CustomVision** folder and enter the following PowerShell commands to set the environment variables. 

> [!NOTE]
> If you're using a non-Windows operating system, see [Configure environment variables](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account?tabs=multiservice%2Cwindows#configure-an-environment-variable-for-authentication) for instructions.

```powershell
$env:AZURE_CUSTOMVISION_TRAINING_API_KEY ="<your training api key>"
$env:AZURE_CUSTOMVISION_PREDICTION_API_KEY ="<your prediction api key>"
```

## Understand the code

Load the `Vision/CustomVision` project in your Java IDE and open the _CustomVisionSamples.java_ file. Find the **runSample** method and comment out the **ImageClassification_Sample** method call&mdash;this method executes the image classification scenario, which is not covered in this guide. The **ObjectDetection_Sample** method implements the primary functionality of this quickstart; navigate to its definition and inspect the code. 

### Create a new Custom Vision Service project

Go to the code block that creates a training client and an object detection project. The created project will show up on the [Custom Vision website](https://customvision.ai/) that you visited earlier. See the [CreateProject](https://docs.microsoft.com/java/api/com.microsoft.azure.cognitiveservices.vision.customvision.training.trainings.createproject?view=azure-java-stable#com_microsoft_azure_cognitiveservices_vision_customvision_training_Trainings_createProject_String_CreateProjectOptionalParameter_) method overloads to specify other options when you create your project (explained in the [Build a detector](../../get-started-build-detector.md) web portal guide).

[!code-java[](~/cognitive-services-java-sdk-samples/Vision/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?name=snippet_create_od)]

### Add tags to your project

[!code-java[](~/cognitive-services-java-sdk-samples/Vision/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?name=snippet_tags_od)]

### Upload and tag images

When you tag images in object detection projects, you need to specify the region of each tagged object using normalized coordinates. Go to the definition of the `regionMap` Map. This code associates each of the sample images with its tagged region.

> [!NOTE]
> If you don't have a click-and-drag utility to mark the coordinates of regions, you can use the web UI at [Customvision.ai](https://www.customvision.ai/). In this example, the coordinates are already provided.

[!code-java[](~/cognitive-services-java-sdk-samples/Vision/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?name=snippet_od_mapping)]

Then, skip to the code block that adds the images to the project. The images are read from the **src/main/resources** folder of the project and are uploaded to the service with their appropriate tags and region coordinates.

[!code-java[](~/cognitive-services-java-sdk-samples/Vision/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?name=snippet_upload_od)]

The previous code snippet makes use of two helper functions that retrieve the images as resource streams and upload them to the service (you can upload up to 64 images in a single batch).

[!code-java[](~/cognitive-services-java-sdk-samples/Vision/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?name=snippet_helpers)]

### Train the project and publish

This code creates the first iteration of the prediction model and then publishes that iteration to the prediction endpoint. The name given to the published iteration can be used to send prediction requests. An iteration is not available in the prediction endpoint until it is published.

[!code-java[](~/cognitive-services-java-sdk-samples/Vision/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?name=snippet_train_od)]

### Use the prediction endpoint

The prediction endpoint, represented by the `predictor` object here, is the reference that you use to submit an image to the current model and get a classification prediction. In this sample, `predictor` is defined elsewhere using the prediction key environment variable.

[!code-java[](~/cognitive-services-java-sdk-samples/Vision/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?name=snippet_prediction_od)]

## Run the application

To compile and run the solution using maven, navigate to the project directory (**Vision/CustomVision**) in a command prompt and execute the run command:

```bash
mvn compile exec:java
```

View the console output for logging and prediction results. You can then verify that the test image is tagged appropriately and that the region of detection is correct.

[!INCLUDE [clean-od-project](../../includes/clean-od-project.md)]

## Next steps

Now you've seen how every step of the object detection process can be done in code. This sample executes a single training iteration, but often you'll need to train and test your model multiple times in order to make it more accurate. The following training guide deals with image classification, but its principles are similar to object detection.

> [!div class="nextstepaction"]
> [Test and retrain a model](../../test-your-model.md)
