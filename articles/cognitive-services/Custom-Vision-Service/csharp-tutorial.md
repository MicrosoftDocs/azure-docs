---
title: "Quickstart: Create an image classification project with the Custom Vision SDK for C#"
titlesuffix: Azure Cognitive Services
description: Create a project, add tags, upload images, train your project, and make a prediction using the .NET SDK with C#.
services: cognitive-services
author: anrothMSFT
manager: cgronlun

ms.service: cognitive-services
ms.component: custom-vision
ms.topic: quickstart
ms.date: 10/31/2018
ms.author: anroth
---
# Quickstart: Create an image classification project with the Custom Vision .NET SDK

This article provides information and sample code to help you get started using the Custom Vision SDK with C# to build an image classification model. After it's created, you can add tags, upload images, train the project, obtain the project's default prediction endpoint URL, and use the endpoint to programmatically test an image. Use this example as a template for building your own .NET application. If you wish to go through the process of building and using a classification model _without_ code, see the [browser-based guidance](getting-started-build-a-classifier.md) instead.

## Prerequisites
- Any edition of [Visual Studio 2015 or 2017](https://www.visualstudio.com/downloads/)


## Get the Custom Vision SDK and sample code
To write a .NET app that uses Custom Vision, you'll need the Custom Vision NuGet packages. These are included in the sample project you will download, but you can access them individually here.

* [Microsoft.Azure.CognitiveServices.Vision.CustomVision.Training](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.CustomVision.Training/)
* [Microsoft.Azure.CognitiveServices.Vision.CustomVision.Prediction](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.CustomVision.Prediction/)

Clone or download the [Cognitive Services .NET Samples](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples) project. Navigate to the **CustomVision/ImageClassification** folder and open _ImageClassification.csproj_ in Visual Studio.

This Visual Studio project creates a new Custom Vision project named __My New Project__, which can be accessed through the [Custom Vision website](https://customvision.ai/). It then uploads images to train and test a classifier. In this project, the classifier is intended to determine whether a tree is a __Hemlock__ or a __Japanese Cherry__.

[!INCLUDE [get-keys](includes/get-keys.md)]

## Understand the code

Open the _Program.cs_ file and inspect the code. Insert your subscription keys in the appropriate definitions in the **Main** method.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ImageClassification/Program.cs?range=21-30)]

The following lines of code execute the primary functionality of the project.

### Create a new Custom Vision service project

The created project will show up on the [Custom Vision website](https://customvision.ai/) that you visited earlier. 

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ImageClassification/Program.cs?range=32-34)]

### Create tags in the project

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ImageClassification/Program.cs?range=36-38)]

### Upload and tag images

The images for this project are included. They are referenced in the **LoadImagesFromDisk** method in _Program.cs_.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ImageClassification/Program.cs?range=40-55)]

### Train the classifier

This code creates the first iteration in the project and marks it as the default iteration. The default iteration reflects the version of the model that will respond to prediction requests. You should update this each time you retrain the model.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ImageClassification/Program.cs?range=57-73)]

### Set the prediction endpoint

The prediction endpoint is the reference that you can use to submit an image to the current model and get a classification prediction.
 
[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ImageClassification/Program.cs?range=77-82)]
 
### Submit an image to the default prediction endpoint

In this script, the test image is loaded in the **LoadImagesFromDisk** method, and the model's prediction output is to be displayed in the console.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ImageClassification/Program.cs?range=84-92)]

## Run the application

As the application runs, it should open a console window and write the following output:

```
Creating new project:
        Uploading images
        Training
Done!

Making a prediction:
        Hemlock: 95.0%
        Japanese Cherry: 0.0%
```

You can then verify that the test image (found in **Images/Test/**) is tagged appropriately. Press any key to exit the application. You can also go back to the [Custom Vision website](https://customvision.ai) and see the current state of your newly created project.

[!INCLUDE [clean-ic-project](includes/clean-ic-project.md)]

## Next steps

Now you have seen how every step of the image classification process can be done in code. This sample executes a single training iteration, but often you will need to train and test your model multiple times in order to make it more accurate.

> [!div class="nextstepaction"]
> [Test and retrain a model](test-your-model.md)