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

## Get the training and prediction keys

The project needs a valid set of subscription keys in order to interact with the service. To get a set of free trial keys, go to the [Custom Vision website](https://customvision.ai) and sign in with a Microsoft account. Select the __gear icon__ in the upper right. In the __Accounts__ section, see the values in the __Training Key__ and __Prediction Key__ fields. You will need these later. 

![Image of the keys UI](./media/csharp-tutorial/training-prediction-keys.png)

## Understand the code

Open the _Program.cs_ file and inspect the code. Insert your subscription keys in the appropriate definitions in the **Main** method.

```csharp
// Add your training & prediction key from the settings page of the portal
string trainingKey = "<your key here>";
string predictionKey = "<your key here>";

// Create the Api, passing in the training key
TrainingApi trainingApi = new TrainingApi() { ApiKey = trainingKey };
```

The following lines of code execute the primary functionality of the project.

### Create a new Custom Vision Service project

The created project will show up on the [Custom Vision website](https://customvision.ai/) that you visited earlier. 

```csharp
    // Create a new project
Console.WriteLine("Creating new project:");
var project = trainingApi.CreateProject("My New Project");
```

### Create tags in the project

```csharp
// Make two tags in the new project
var hemlockTag = trainingApi.CreateTag(project.Id, "Hemlock");
var japaneseCherryTag = trainingApi.CreateTag(project.Id, "Japanese Cherry");
```

### Upload and tag images

The images for this project are included. They are referenced in the **LoadImagesFromDisk** method in _Program.cs_.

```csharp
// Add some images to the tags
Console.WriteLine("\tUploading images");
LoadImagesFromDisk();

// Images can be uploaded one at a time
foreach (var image in hemlockImages)
{
    using (var stream = new MemoryStream(File.ReadAllBytes(image)))
    {
        trainingApi.CreateImagesFromData(project.Id, stream, new List<string>() { hemlockTag.Id.ToString() });
    }
}

// Or uploaded in a single batch 
var imageFiles = japaneseCherryImages.Select(img => new ImageFileCreateEntry(Path.GetFileName(img), File.ReadAllBytes(img))).ToList();
trainingApi.CreateImagesFromFiles(project.Id, new ImageFileCreateBatch(imageFiles, new List<Guid>() { japaneseCherryTag.Id }));
```

### Train the classifier

This code creates the first iteration in the project and marks it as the default iteration. The default iteration reflects the version of the model that will respond to prediction requests. You should update this every time you retrain the model.

```csharp
// Now there are images with tags; start training the project
Console.WriteLine("\tTraining");
var iteration = trainingApi.TrainProject(project.Id);

// The returned iteration will be in progress, and can be queried periodically to see when it has completed
while (iteration.Status == "Completed")
{
    Thread.Sleep(1000);

    // Re-query the iteration to get it's updated status
    iteration = trainingApi.GetIteration(project.Id, iteration.Id);
}

// The iteration is now trained. Make it the default project endpoint
iteration.IsDefault = true;
trainingApi.UpdateIteration(project.Id, iteration.Id, iteration);
Console.WriteLine("Done!\n");
```

### Set the prediction endpoint

The prediction endpoint is the reference that you can use to submit an image to the current model and get a classification prediction.
 
```csharp
// Create a prediction endpoint, passing in obtained prediction key
PredictionEndpoint endpoint = new PredictionEndpoint() { ApiKey = predictionKey };
```
 
### Submit an image to the default prediction endpoint

In this script, the test image is loaded in the **LoadImagesFromDisk** method, and the model's prediction output is to be displayed in the console.

```csharp
// Make a prediction against the new project
Console.WriteLine("Making a prediction:");
var result = endpoint.PredictImage(project.Id, testImage);

// Loop over each prediction and write out the results
foreach (var c in result.Predictions)
{
    Console.WriteLine($"\t{c.TagName}: {c.Probability:P1}");
}
```

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

You can then verify that the test image (found in **Images/Test/**) is tagged appropriately. At this point, you can press any key to exit the application.

## Clean up resources
If you wish to implement your own image classification project (or try an [object detection](csharp-tutorial-od.md) project instead), you may want to delete the tree identification project from this example. A free trial allows for two Custom Vision projects.

On the [Custom Vision website](https://customvision.ai), navigate to **Projects** and select the trash can under My New Project.

![Screenshot of a panel labelled My New Project with a trash can icon](media/csharp-tutorial/delete_project.png)

## Next steps

Now you have seen how every step of the image classification process can be done in code. This sample executes a single training iteration, but often you will need to train and test your model multiple times in order to make it more accurate.

> [!div class="nextstepaction"]
> [Test and retrain a model](test-your-model.md)