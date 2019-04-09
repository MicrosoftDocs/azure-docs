---
title: "Visualize a deep learning model trained with Custom Vision API"
titlesuffix: Azure Cognitive Services
description: Create a project, add tags, upload images, train your project, visualize a model
services: cognitive-services
author: Alibek Jakupov
manager: 

ms.service: cognitive-services
ms.subservice: custom-vision
ms.topic: tutorial
ms.date: 09/04/2019
ms.author: 
---
# Visualize a deep learning model trained with Custom Vision AP

Azure Custom Vision API offers an awesome possibility to train your own classifier using only several images, due to the transfer learning, that allows us to build upon the features and concept that were learned during the training of the base model, in other words cut off the final dense layer that is responsible for predicting the class labels of the original base model and replace it by a new dense layer that will predict the class labels of our new task at hand. However, one may be interested in what is happening inside. And as Albert Einstein once said: I have no special talent, I am only passionately curious.  So let us satisfy our curiosity and have a look on internal structure of your exported model.
This article provides information and sample code to help you visualize a pre-trained model generated with Azure Custom Vision api to get a brief overview of input/output nodes of the model. After it's created, you can navigate your model, analyse all the nodes and input weights. Use this example as a template for your future projects.

## Prerequisites

- Python 3.6
- Any IDE

## Why visualize your model?

According to the information provided on Custom Vision welcome page (https://www.customvision.ai/) : 
>Easily customize your own state-of-the-art computer vision models for your unique use case. Just upload a few labeled images and let Custom Vision Service do the hard work. With just one click, you can export trained models to be run on device or as Docker containers. However, what if we wanted to go beyond the scope of simple usage and dive a little bit deeper, say inspect the model?Fortunately there is a way to do that using TensorBoard. 
The computations you'll use TensorFlow for - like training a massive deep neural network - can be complex and confusing. To make it easier to understand, debug, and optimize TensorFlow programs, we've included a suite of visualization tools called TensorBoard. You can use TensorBoard to visualize your TensorFlow graph, plot quantitative metrics about the execution of your graph, and show additional data like images that pass through it.
So, the idea is quite simple
1)	Train your image classifier (Important : use Compact model to able to export it to your machine)
2)	Generate tensor flow model
3)	Use TensorBoard 


### Create a new Custom Vision service project

The created project will show up on the [Custom Vision website](https://customvision.ai/) that you visited earlier. 

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ImageClassification/Program.cs?range=32-34)]

### Create tags in the project

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ImageClassification/Program.cs?range=36-38)]

### Upload and tag images

The images for this project are included. They are referenced in the **LoadImagesFromDisk** method in _Program.cs_.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ImageClassification/Program.cs?range=40-55)]

### Train the classifier and publish

This code creates the first iteration in the project and then publishes that iteration to the prediction endpoint. The name given to the published iteration can be used to send prediction requests. An iteration is not available in the prediction endpoint until it is published.

```csharp
// The returned iteration will be in progress, and can be queried periodically to see when it has completed
while (iteration.Status == "Training")
{
        Thread.Sleep(1000);

        // Re-query the iteration to get it's updated status
        iteration = trainingApi.GetIteration(project.Id, iteration.Id);
}

// The iteration is now trained. Publish it to the prediction end point.
var publishedModelName = "treeClassModel";
var predictionResourceId = "<target prediction resource ID>";
trainingApi.PublishIteration(project.Id, iteration.Id, publishedModelName, predictionResourceId);
Console.WriteLine("Done!\n");
```

### Set the prediction endpoint

The prediction endpoint is the reference that you can use to submit an image to the current model and get a classification prediction.

```csharp
// Create a prediction endpoint, passing in obtained prediction key
CustomVisionPredictionClient endpoint = new CustomVisionPredictionClient()
{
        ApiKey = predictionKey,
        Endpoint = SouthCentralUsEndpoint
};
```

### Submit an image to the default prediction endpoint

In this script, the test image is loaded in the **LoadImagesFromDisk** method, and the model's prediction output is to be displayed in the console.

```csharp
// Make a prediction against the new project
Console.WriteLine("Making a prediction:");
var result = endpoint.ClassifyImage(project.Id, publishedModelName, testImage);

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

You can then verify that the test image (found in **Images/Test/**) is tagged appropriately. Press any key to exit the application. You can also go back to the [Custom Vision website](https://customvision.ai) and see the current state of your newly created project.

[!INCLUDE [clean-ic-project](includes/clean-ic-project.md)]

## Next steps

Now you have seen how every step of the image classification process can be done in code. This sample executes a single training iteration, but often you will need to train and test your model multiple times in order to make it more accurate.

> [!div class="nextstepaction"]
> [Test and retrain a model](test-your-model.md)
