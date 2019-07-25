---
title: "Quickstart: Create an object detection project with the Custom Vision SDK for C#"
titlesuffix: Azure Cognitive Services
description: Create a project, add tags, upload images, train your project, and detect objects using the .NET SDK with C#.
services: cognitive-services
author: areddish
manager: nitinme

ms.service: cognitive-services
ms.subservice: custom-vision
ms.topic: quickstart
ms.date: 07/03/2019
ms.author: areddish
---

# Quickstart: Create an object detection project with the Custom Vision .NET SDK

This article provides information and sample code to help you get started using the Custom Vision SDK with C# to build an object detection model. After it's created, you can add tagged regions, upload images, train the project, obtain the project's default prediction endpoint URL, and use the endpoint to programmatically test an image. Use this example as a template for building your own .NET application. 

## Prerequisites

- Any edition of [Visual Studio 2015 or 2017](https://www.visualstudio.com/downloads/)

## Get the Custom Vision SDK and sample code

To write a .NET app that uses Custom Vision, you'll need the Custom Vision NuGet packages. These packages are included in the sample project you will download, but you can access them individually here.

- [Microsoft.Azure.CognitiveServices.Vision.CustomVision.Training](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.CustomVision.Training/)
- [Microsoft.Azure.CognitiveServices.Vision.CustomVision.Prediction](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.CustomVision.Prediction/)

Clone or download the [Cognitive Services .NET Samples](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples) project. Navigate to the **CustomVision/ObjectDetection** folder and open _ObjectDetection.csproj_ in Visual Studio.

This Visual Studio project creates a new Custom Vision project named __My New Project__, which can be accessed through the [Custom Vision website](https://customvision.ai/). It then uploads images to train and test an object detection model. In this project, the model is trained to detect forks and scissors in images.

[!INCLUDE [get-keys](includes/get-keys.md)]

## Understand the code

Open the _Program.cs_ file and inspect the code. Insert your subscription keys in the appropriate definitions in the **Main** method.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ObjectDetection/Program.cs?range=18-27)]

The Endpoint parameter should point to the region where the Azure resource group containing the Custom Vision resources was created in. For this example, we assume the South Central US region and use:

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ImageClassification/Program.cs?range=14-14)]

### Create a new Custom Vision Service project

This next bit of code creates an object detection project. The created project will show up on the [Custom Vision website](https://customvision.ai/) that you visited earlier. 

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ObjectDetection/Program.cs?range=29-35)]

### Add tags to the project

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ObjectDetection/Program.cs?range=37-39)]

### Upload and tag images

When you tag images in object detection projects, you need to specify the region of each tagged object using normalized coordinates. The following code associates each of the sample images with its tagged region.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ObjectDetection/Program.cs?range=41-84)]

Then, this map of associations is used to upload each sample image with its region coordinates.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ObjectDetection/Program.cs?range=86-104)]

At this point, all of the sample images have been uploaded, and each has a tag (**fork** or **scissors**) and an associated pixel rectangle for that tag.

### Train the project

This code creates the first training iteration in the project.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ObjectDetection/Program.cs?range=106-117)]

### Publish the current iteration

The name given to the published iteration can be used to send prediction requests. An iteration is not available in the prediction endpoint until it is published.

```csharp
// The iteration is now trained. Publish it to the prediction end point.
var publishedModelName = "treeClassModel";
var predictionResourceId = "<target prediction resource ID>";
trainingApi.PublishIteration(project.Id, iteration.Id, publishedModelName, predictionResourceId);
Console.WriteLine("Done!\n");
```

### Create a prediction endpoint

```csharp
// Create a prediction endpoint, passing in the obtained prediction key
CustomVisionPredictionClient endpoint = new CustomVisionPredictionClient()
{
        ApiKey = predictionKey,
        Endpoint = SouthCentralUsEndpoint
};
```

### Use the prediction endpoint

This part of the script loads the test image, queries the model endpoint, and outputs prediction data to the console.

```csharp
// Make a prediction against the new project
Console.WriteLine("Making a prediction:");
var imageFile = Path.Combine("Images", "test", "test_image.jpg");
using (var stream = File.OpenRead(imageFile))
{
        var result = endpoint.DetectImage(project.Id, publishedModelName, stream);

        // Loop over each prediction and write out the results
        foreach (var c in result.Predictions)
        {
                Console.WriteLine($"\t{c.TagName}: {c.Probability:P1} [ {c.BoundingBox.Left}, {c.BoundingBox.Top}, {c.BoundingBox.Width}, {c.BoundingBox.Height} ]");
        }
}
```

## Run the application

As the application runs, it should open a console window and write the following output:

```console
Creating new project:
        Training
Done!

Making a prediction:
        fork: 98.2% [ 0.111609578, 0.184719115, 0.6607002, 0.6637112 ]
        scissors: 1.2% [ 0.112389535, 0.119195729, 0.658031344, 0.7023591 ]
```

You can then verify that the test image (found in **Images/Test/**) is tagged appropriately and that the region of detection is correct. At this point, you can press any key to exit the application.

[!INCLUDE [clean-od-project](includes/clean-od-project.md)]

## Next steps

Now you have seen how every step of the object detection process can be done in code. This sample executes a single training iteration, but often you will need to train and test your model multiple times in order to make it more accurate. The following guide deals with image classification, but its principles are similar to object detection.

> [!div class="nextstepaction"]
> [Test and retrain a model](test-your-model.md)
