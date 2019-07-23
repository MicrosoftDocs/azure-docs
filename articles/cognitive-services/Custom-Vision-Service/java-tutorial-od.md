---
title: "Quickstart: Create an object detection project with the Custom Vision SDK for Java"
titlesuffix: Azure Cognitive Services
description: Create a project, add tags, upload images, train your project, and detect objects using the Java SDK.
services: cognitive-services
author: areddish
manager: nitinme

ms.service: cognitive-services
ms.subservice: custom-vision
ms.topic: quickstart
ms.date: 07/03/2019
ms.author: areddish
---

# Quickstart: Create an object detection project with the Custom Vision SDK for Java

This article provides information and sample code to help you get started using the Custom Vision SDK with Java to build an object detection model. After it's created, you can add tagged regions, upload images, train the project, obtain the project's default prediction endpoint URL, and use the endpoint to programmatically test an image. Use this example as a template for building your own Java application.

## Prerequisites

- A Java IDE of your choice
- [JDK 7 or 8](https://aka.ms/azure-jdks) installed.
- Maven installed

## Get the Custom Vision SDK and sample code

To write a Java app that uses Custom Vision, you'll need the Custom Vision maven packages. These packages are included in the sample project you will download, but you can access them individually here.

You can install the Custom Vision SDK from maven central repository:
- [Training SDK](https://mvnrepository.com/artifact/com.microsoft.azure.cognitiveservices/azure-cognitiveservices-customvision-training)
- [Prediction SDK](https://mvnrepository.com/artifact/com.microsoft.azure.cognitiveservices/azure-cognitiveservices-customvision-prediction)

Clone or download the [Cognitive Services Java SDK Samples](https://github.com/Azure-Samples/cognitive-services-java-sdk-samples/tree/master) project. Navigate to the **Vision/CustomVision/** folder.

This Java project creates a new Custom Vision object detection project named __Sample Java OD Project__, which can be accessed through the [Custom Vision website](https://customvision.ai/). It then uploads images to train and test a classifier. In this project, the classifier is intended to determine whether a tree is a __Hemlock__ or a __Japanese Cherry__.

[!INCLUDE [get-keys](includes/get-keys.md)]

The program is configured to store your key data as environment variables. Set these variables by navigating to the **Vision/CustomVision** folder in PowerShell. Then enter the commands:

```powershell
$env:AZURE_CUSTOMVISION_TRAINING_API_KEY ="<your training api key>"
$env:AZURE_CUSTOMVISION_PREDICTION_API_KEY ="<your prediction api key>"
```

## Understand the code

Load the `Vision/CustomVision` project in your Java IDE and open the _CustomVisionSamples.java_ file. Find the **runSample** method and comment out the **ImageClassification_Sample** method call&mdash;this method executes the image classification scenario, which is not covered in this guide. The **ObjectDetection_Sample** method implements the primary functionality of this quickstart; navigate to its definition and inspect the code. 

### Create a new Custom Vision Service project

Go to the code block that creates a training client and an object detection project. The created project will show up on the [Custom Vision website](https://customvision.ai/) that you visited earlier. 

[!code-java[](~/cognitive-services-java-sdk-samples/Vision/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?range=181-206)]

### Add tags to your project

[!code-java[](~/cognitive-services-java-sdk-samples/Vision/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?range=208-218)]

### Upload and tag images

When you tag images in object detection projects, you need to specify the region of each tagged object using normalized coordinates. Go to the definition of the `regionMap` Map. This code associates each of the sample images with its tagged region.

[!code-java[](~/cognitive-services-java-sdk-samples/Vision/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?range=130-179)]

Then, skip to the code block that adds the images to the project. The images are read from the **src/main/resources** folder of the project and are uploaded to the service with their appropriate tags and region coordinates.

[!code-java[](~/cognitive-services-java-sdk-samples/Vision/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?range=220-231)]

The previous code snippet makes use of two helper functions that retrieve the images as resource streams and upload them to the service.

[!code-java[](~/cognitive-services-java-sdk-samples/Vision/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?range=277-314)]

### Train the project and publish

This code creates the first iteration in the project and then publishes that iteration to the prediction endpoint. The name given to the published iteration can be used to send prediction requests. An iteration is not available in the prediction endpoint until it is published.

[!code-java[](~/cognitive-services-java-sdk-samples/Vision/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?range=233-242)]

### Use the prediction endpoint

The prediction endpoint, represented by the `predictor` object here, is the reference that you use to submit an image to the current model and get a classification prediction. In this sample, `predictor` is defined elsewhere using the prediction key environment variable.

[!code-java[](~/cognitive-services-java-sdk-samples/Vision/CustomVision/src/main/java/com/microsoft/azure/cognitiveservices/vision/customvision/samples/CustomVisionSamples.java?range=244-270)]

## Run the application

To compile and run the solution using maven, run the following command in the project directory in PowerShell:

```powershell
mvn compile exec:java
```

View the console output for logging and prediction results. You can then verify that the test image is tagged appropriately and that the region of detection is correct.

[!INCLUDE [clean-od-project](includes/clean-od-project.md)]

## Next steps

Now you have seen how every step of the object detection process can be done in code. This sample executes a single training iteration, but often you will need to train and test your model multiple times in order to make it more accurate. The following guide deals with image classification, but its principles are similar to object detection.

> [!div class="nextstepaction"]
> [Test and retrain a model](test-your-model.md)
