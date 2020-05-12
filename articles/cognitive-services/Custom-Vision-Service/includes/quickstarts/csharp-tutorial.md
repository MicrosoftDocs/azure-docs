---
author: PatrickFarley
ms.author: pafarley
ms.service: cognitive-services
ms.date: 04/14/2020
---

This article provides information and sample code to help you get started using the Custom Vision SDK with C# to build an image classification model. After it's created, you can add tags, upload images, train the project, obtain the project's default prediction endpoint URL, and use the endpoint to programmatically test an image. Use this example as a template for building your own .NET application. If you want to go through the process of building and using a classification model _without_ code, see the [browser-based guidance](../../getting-started-build-a-classifier.md) instead.

## Prerequisites

- Any edition of [Visual Studio 2015 or 2017](https://www.visualstudio.com/downloads/)
- [!INCLUDE [create-resources](../../includes/create-resources.md)]

## Get the Custom Vision SDK and sample code

To write a .NET app that uses Custom Vision, you'll need the Custom Vision NuGet packages. These packages are included in the sample project you'll download, but you can access them individually here.

- [Microsoft.Azure.CognitiveServices.Vision.CustomVision.Training](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.CustomVision.Training/)
- [Microsoft.Azure.CognitiveServices.Vision.CustomVision.Prediction](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.CustomVision.Prediction/)

Clone or download the [Cognitive Services .NET Samples](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples) project. Navigate to the **CustomVision/ImageClassification** folder and open _ImageClassification.csproj_ in Visual Studio.

This Visual Studio project creates a new Custom Vision project named __My New Project__, which can be accessed through the [Custom Vision website](https://customvision.ai/). It then uploads images to train and test a classifier. In this project, the classifier is intended to determine whether a tree is a __Hemlock__ or a __Japanese Cherry__.

[!INCLUDE [get-keys](../../includes/get-keys.md)]

## Understand the code

Open the _Program.cs_ file and inspect the code. [Create environment variables](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for your training and prediction keys named `CUSTOM_VISION_TRAINING_KEY` and `CUSTOM_VISION_PREDICTION_KEY`, respectively. The script will look for these variables.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ImageClassification/Program.cs?name=snippet_keys)]

Also, get your Endpoint URL from the Settings page of the Custom Vision website. Save it to an environment variable called `CUSTOM_VISION_ENDPOINT`. The script saves a reference to it at the root of your class.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ImageClassification/Program.cs?name=snippet_endpoint)]

The following lines of code execute the primary functionality of the project.

### Create a new Custom Vision service project

The created project will show up on the [Custom Vision website](https://customvision.ai/) that you visited earlier. See the [CreateProject](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.customvision.training.customvisiontrainingclientextensions.createproject?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Vision_CustomVision_Training_CustomVisionTrainingClientExtensions_CreateProject_Microsoft_Azure_CognitiveServices_Vision_CustomVision_Training_ICustomVisionTrainingClient_System_String_System_String_System_Nullable_System_Guid__System_String_System_Collections_Generic_IList_System_String__) method to specify other options when you create your project (explained in the [Build a classifier](../../getting-started-build-a-classifier.md) web portal guide).   

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ImageClassification/Program.cs?name=snippet_create)]

### Create tags in the project

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ImageClassification/Program.cs?name=snippet_tags)]

### Upload and tag images

The images for this project are included. They are referenced in the **LoadImagesFromDisk** method in _Program.cs_. You can upload up to 64 images in a single batch.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ImageClassification/Program.cs?name=snippet_upload)]

### Train the classifier and publish

This code creates the first iteration of the prediction model and then publishes that iteration to the prediction endpoint. You can use the name of the iteration to send prediction requests. An iteration is not available in the prediction endpoint until it's published.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ImageClassification/Program.cs?name=snippet_train)]

### Set the prediction endpoint

The prediction endpoint is the reference that you can use to submit an image to the current model and get a classification prediction.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ImageClassification/Program.cs?name=snippet_prediction_endpoint)]

### Submit an image to the default prediction endpoint

In this script, the test image is loaded in the **LoadImagesFromDisk** method, and the model's prediction output is to be displayed in the console. The value of the `publishedModelName` variable should correspond to the "Published as" value found on the Custom Vision portal's **Performance** tab. 

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/CustomVision/ImageClassification/Program.cs?name=snippet_prediction)]

## Run the application

As the application runs, it should open a console window and write the following output:

```console
Creating new project:
        Uploading images
        Training
Done!

Making a prediction:
        Hemlock: 95.0%
        Japanese Cherry: 0.0%
```

You can then verify that the test image (found in **Images/Test/**) is tagged appropriately. Press any key to exit the application. You can also go back to the [Custom Vision website](https://customvision.ai) and see the current state of your newly created project.

[!INCLUDE [clean-ic-project](../../includes/clean-ic-project.md)]

## Next steps

Now you've seen how to do every step of the image classification process in code. This sample executes a single training iteration, but often you will need to train and test your model multiple times in order to make it more accurate.

> [!div class="nextstepaction"]
> [Test and retrain a model](../../test-your-model.md)
