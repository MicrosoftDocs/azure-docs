---
author: PatrickFarley
ms.author: pafarley
ms.service: cognitive-services
ms.date: 09/15/2020
---

This guide provides instructions and sample code to help you get started using the Custom Vision client library for C# to build an object detection model. You'll create a project, add tags, train the project, and use the project's prediction endpoint URL to programmatically test it. Use this example as a template for building your own image recognition app.

> [!NOTE]
> If you want to build and train an object detection model _without_ writing code, see the [browser-based guidance](../../get-started-build-detector.md) instead.

## Prerequisites

- Any edition of [Visual Studio 2015 or 2017](https://www.visualstudio.com/downloads/)
- [!INCLUDE [create-resources](../../includes/create-resources.md)]

## Install the Custom Vision client library

To write an image analysis app with Custom Vision for .NET, you'll need the Custom Vision NuGet packages. These packages are included in the sample project you'll download, but you can access them individually here.

- [Microsoft.Azure.CognitiveServices.Vision.CustomVision.Training](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.CustomVision.Training/)
- [Microsoft.Azure.CognitiveServices.Vision.CustomVision.Prediction](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.CustomVision.Prediction/)

Clone or download the [Cognitive Services .NET Samples](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples) project. Navigate to the **CustomVision/ObjectDetection** folder and open _ObjectDetection.csproj_ in Visual Studio.

This Visual Studio project creates a new Custom Vision project named __My New Project__, which can be accessed through the [Custom Vision website](https://customvision.ai/). It then uploads images to train and test an object detection model. In this project, the model is trained to detect forks and scissors in images.

[!INCLUDE [get-keys](../../includes/get-keys.md)]

## Examine the code

Open the _Program.cs_ file and inspect the code. [Create environment variables](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for your training and prediction keys named `CUSTOM_VISION_TRAINING_KEY` and `CUSTOM_VISION_PREDICTION_KEY`, respectively. The script will look for these variables.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ObjectDetection/Program.cs?name=snippet_keys)]

Also, get your Endpoint URL from the Settings page of the Custom Vision website. Save it to an environment variable called `CUSTOM_VISION_ENDPOINT`. The script saves a reference to it at the root of your class.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ObjectDetection/Program.cs?name=snippet_endpoint)]

## Create a new Custom Vision Service project

This next bit of code creates an object detection project. The created project will show up on the [Custom Vision website](https://customvision.ai/) that you visited earlier. See the [CreateProject](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.customvision.training.customvisiontrainingclientextensions.createproject?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Vision_CustomVision_Training_CustomVisionTrainingClientExtensions_CreateProject_Microsoft_Azure_CognitiveServices_Vision_CustomVision_Training_ICustomVisionTrainingClient_System_String_System_String_System_Nullable_System_Guid__System_String_System_Collections_Generic_IList_System_String__&preserve-view=true) method to specify other options when you create your project (explained in the [Build a detector](../../get-started-build-detector.md) web portal guide).  

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ObjectDetection/Program.cs?name=snippet_create)]


## Add tags to the project

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ObjectDetection/Program.cs?name=snippet_tags)]

## Upload and tag images

When you tag images in object detection projects, you need to specify the region of each tagged object using normalized coordinates. The following code associates each of the sample images with its tagged region.

> [!NOTE]
> If you don't have a click-and-drag utility to mark the coordinates of regions, you can use the web UI at [Customvision.ai](https://www.customvision.ai/). In this example, the coordinates are already provided.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ObjectDetection/Program.cs?name=snippet_upload_regions)]

Then, this map of associations is used to upload each sample image with its region coordinates. You can upload up to 64 images in a single batch.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ObjectDetection/Program.cs?name=snippet_upload)]

At this point, you've uploaded all the samples images and tagged each one (**fork** or **scissors**) with an associated pixel rectangle.

## Train the project

This code creates the first training iteration in the project.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ObjectDetection/Program.cs?name=snippet_train)]

> [!TIP]
> Train with selected tags
>
> You can optionally train on only a subset of your applied tags. You may want to do this if you haven't applied enough of certain tags yet, but you do have enough of others. In the [TrainProject](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.customvision.training.customvisiontrainingclientextensions.trainproject?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Vision_CustomVision_Training_CustomVisionTrainingClientExtensions_TrainProject_Microsoft_Azure_CognitiveServices_Vision_CustomVision_Training_ICustomVisionTrainingClient_System_Guid_System_String_System_Nullable_System_Int32__System_Nullable_System_Boolean__System_String_Microsoft_Azure_CognitiveServices_Vision_CustomVision_Training_Models_TrainingParameters_&preserve-view=true) call, use the *trainingParameters* parameter. Construct a [TrainingParameters](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.customvision.training.models.trainingparameters?view=azure-dotnet&preserve-view=true) and set its **SelectedTags** property to a list of IDs of the tags you want to use. The model will train to only recognize the tags on that list.

## Publish the current iteration

The name given to the published iteration can be used to send prediction requests. An iteration is not available in the prediction endpoint until it's published.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ObjectDetection/Program.cs?name=snippet_publish)]

## Create a prediction endpoint

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ObjectDetection/Program.cs?name=snippet_prediction_endpoint)]

## Test the prediction endpoint

This part of the script loads the test image, queries the model endpoint, and outputs prediction data to the console.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ObjectDetection/Program.cs?name=snippet_prediction)]

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

[!INCLUDE [clean-od-project](../../includes/clean-od-project.md)]

## Next steps

Now you've done every step of the object detection process in code. This sample executes a single training iteration, but often you'll need to train and test your model multiple times in order to make it more accurate. The following guide deals with image classification, but its principles are similar to object detection.

> [!div class="nextstepaction"]
> [Test and retrain a model](../../test-your-model.md)

* [What is Custom Vision?](../../overview.md)
* [SDK reference documentation](https://docs.microsoft.com/dotnet/api/overview/azure/cognitiveservices/client/customvision?view=azure-dotnet)