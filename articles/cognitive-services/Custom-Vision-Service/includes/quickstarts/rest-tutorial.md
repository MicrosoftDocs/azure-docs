---
author: PatrickFarley
ms.author: pafarley
ms.service: cognitive-services
ms.date: 12/09/2020
---

Get started with the Custom Vision REST API. Follow these steps to call the API and build an image classification model. You'll create a project, add tags, train the project, and use the project's prediction endpoint URL to programmatically test it. Use this example as a template for building your own image recognition app.

> [!NOTE]
> If you want to build and train a classification model _without_ writing code, see the [browser-based guidance](../../getting-started-build-a-classifier.md) instead.

Use the Custom Vision client library for .NET to:

* Create a new Custom Vision project
* Add tags to the project
* Upload and tag images
* Train the project
* Publish the current iteration
* Test the prediction endpoint

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* Once you have your Azure subscription, <a href="https://portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=microsoft_azure_cognitiveservices_customvision#create/Microsoft.CognitiveServicesCustomVision"  title="Create a Custom Vision resource"  target="_blank">create a Custom Vision resource <span class="docon docon-navigate-external x-hidden-focus"></span></a> in the Azure portal to create a training and prediction resource and get your keys and endpoint. Wait for it to deploy and click the **Go to resource** button.
    * You will need the key and endpoint from the resources you create to connect your application to Custom Vision. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.


## Create a new Custom Vision project

This next bit of code creates an image classification project. The created project will show up on the [Custom Vision website](https://customvision.ai/). See the [CreateProject](/dotnet/api/microsoft.azure.cognitiveservices.vision.customvision.training.customvisiontrainingclientextensions.createproject?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Vision_CustomVision_Training_CustomVisionTrainingClientExtensions_CreateProject_Microsoft_Azure_CognitiveServices_Vision_CustomVision_Training_ICustomVisionTrainingClient_System_String_System_String_System_Nullable_System_Guid__System_String_System_Collections_Generic_IList_System_String__&preserve-view=true) method to specify other options when you create your project (explained in the [Build a classifier](../../getting-started-build-a-classifier.md) web portal guide).  

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/CustomVision/ImageClassification/Program.cs?name=snippet_create)]


## Add tags to the project

This method defines the tags that you will train the model on.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/CustomVision/ImageClassification/Program.cs?name=snippet_addtags)]

## Upload and tag images

First, download the sample images for this project. Save the contents of the [sample Images folder](https://github.com/Azure-Samples/cognitive-services-sample-data-files/tree/master/CustomVision/ImageClassification/Images) to your local device.

Then define a helper method to upload the images in this directory. You may need to edit the **GetFiles** argument to point to the location where your images are saved.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/CustomVision/ImageClassification/Program.cs?name=snippet_loadimages)]

Next, define a method to upload the images, applying tags according to their folder location (the images are already sorted). You can upload and tag images iteratively, or in a batch (up to 64 per batch). This code snippet contains examples of both. 

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/CustomVision/ImageClassification/Program.cs?name=snippet_upload)]


## Train the project

This method creates the first training iteration in the project. It queries the service until training is completed.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/CustomVision/ImageClassification/Program.cs?name=snippet_train)]

> [!TIP]
> Train with selected tags
>
> You can optionally train on only a subset of your applied tags. You may want to do this if you haven't applied enough of certain tags yet, but you do have enough of others. In the [TrainProject](/dotnet/api/microsoft.azure.cognitiveservices.vision.customvision.training.customvisiontrainingclientextensions.trainproject?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Vision_CustomVision_Training_CustomVisionTrainingClientExtensions_TrainProject_Microsoft_Azure_CognitiveServices_Vision_CustomVision_Training_ICustomVisionTrainingClient_System_Guid_System_String_System_Nullable_System_Int32__System_Nullable_System_Boolean__System_String_Microsoft_Azure_CognitiveServices_Vision_CustomVision_Training_Models_TrainingParameters_&preserve-view=true) call, use the *trainingParameters* parameter. Construct a [TrainingParameters](/dotnet/api/microsoft.azure.cognitiveservices.vision.customvision.training.models.trainingparameters?preserve-view=true&view=azure-dotnet) and set its **SelectedTags** property to a list of IDs of the tags you want to use. The model will train to only recognize the tags on that list.

## Publish the current iteration

This method makes the current iteration of the model available for querying. You can use the model name as a reference to send prediction requests. You need to enter your own value for `predictionResourceId`. You can find the prediction resource ID on the resource's **Overview** tab in the Azure portal, listed as **Subscription ID**.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/CustomVision/ImageClassification/Program.cs?name=snippet_publish)]


## Test the prediction endpoint

This part of the script loads the test image, queries the model endpoint, and outputs prediction data to the console.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/CustomVision/ImageClassification/Program.cs?name=snippet_test)]


## Run the application

#### [Visual Studio IDE](#tab/visual-studio)

Run the application by clicking the **Debug** button at the top of the IDE window.

#### [CLI](#tab/cli)

Run the application from your application directory with the `dotnet run` command.

```dotnet
dotnet run
```

---

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

Now you've done every step of the image classification process in code. This sample executes a single training iteration, but often you'll need to train and test your model multiple times in order to make it more accurate.

> [!div class="nextstepaction"]
> [Test and retrain a model](../../test-your-model.md)

* [What is Custom Vision?](../../overview.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/CustomVision/ObjectDetection/Program.cs)
* [SDK reference documentation](/dotnet/api/overview/azure/cognitiveservices/client/customvision?view=azure-dotnet)
