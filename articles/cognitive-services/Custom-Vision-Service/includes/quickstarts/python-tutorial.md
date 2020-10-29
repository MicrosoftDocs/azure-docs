---
author: PatrickFarley
ms.author: pafarley
ms.service: cognitive-services
ms.date: 10/25/2020
---

Get started with the Custom Vision client library for Python. Follow these steps to install the package and try out the example code for building an image classification model. You'll create a project, add tags, train the project, and use the project's prediction endpoint URL to programmatically test it. Use this example as a template for building your own image recognition app.

> [!NOTE]
> If you want to build and train a classification model _without_ writing code, see the [browser-based guidance](../../getting-started-build-a-classifier.md) instead.

Use the Custom Vision client library for Python to:

* Create a new Custom Vision project
* Add tags to the project
* Upload and tag images
* Train the project
* Publish the current iteration
* Test the prediction endpoint

[Reference documentation](https://docs.microsoft.com/python/api/overview/azure/cognitiveservices/customvision?view=azure-python) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cognitiveservices/azure-cognitiveservices-vision-customvision/azure/cognitiveservices/vision/customvision) | [Package (PyPI)](https://pypi.org/project/azure-cognitiveservices-vision-customvision/) | [Samples](https://docs.microsoft.com/samples/browse/?products=azure&term=vision&terms=vision&languages=python)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* [Python 3.x](https://www.python.org/)
* Once you have your Azure subscription, <a href="https://portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=microsoft_azure_cognitiveservices_customvision#create/Microsoft.CognitiveServicesCustomVision"  title="Create a Custom Vision resource"  target="_blank">create a Custom Vision resource <span class="docon docon-navigate-external x-hidden-focus"></span></a> in the Azure portal to create a training and prediction resource and get your keys and endpoint. Wait for it to deploy and click the **Go to resource** button.
    * You will need the key and endpoint from the resources you create to connect your application to Custom Vision. You'll paste your keys and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Setting up

### Install the client library

To write an image analysis app with Custom Vision for Python, you'll need the Custom Vision client library. After installing Python, run the following command in PowerShell or a console window:

```powershell
pip install azure-cognitiveservices-vision-customvision
```

### Create a new python application

Create a new Python file and import the following libraries.

[!code-python[](~/cognitive-services-quickstart-code/python/CustomVision/ImageClassification/CustomVisionQuickstart.py?name=snippet_imports)]

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/CustomVision/ImageClassification/CustomVisionQuickstart.cs), which contains the code examples in this quickstart.

Create variables for your resource's Azure endpoint and subscription keys.

[!code-python[](~/cognitive-services-quickstart-code/python/CustomVision/ImageClassification/CustomVisionQuickstart.py?name=snippet_creds)]

> [!IMPORTANT]
> Go to the Azure portal. If the Custom Vision resources you created in the **Prerequisites** section deployed successfully, click the **Go to Resource** button under **Next Steps**. You can find your keys and endpoint in the resources' **key and endpoint** pages, under **resource management**. You'll need to get both your training and prediction keys.
>
> You can find the prediction resource ID value on the resource's **Overview** tab, listed as **Subscription ID**.
>
> Remember to remove the keys from your code when you're done, and never post them publicly. For production, consider using a secure way of storing and accessing your credentials. See the Cognitive Services [security](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-security) article for more information.

## Object model

|Name|Description|
|---|---|
|[CustomVisionTrainingClient](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-customvision/azure.cognitiveservices.vision.customvision.training.customvisiontrainingclient?view=azure-python) | This class handles the creation, training, and publishing of your models. |
|[CustomVisionPredictionClient](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-customvision/azure.cognitiveservices.vision.customvision.prediction.customvisionpredictionclient?view=azure-python)| This class handles the querying of your models for image classification predictions.|
|[ImagePrediction](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-customvision/azure.cognitiveservices.vision.customvision.prediction.models.imageprediction?view=azure-python)| This class defines a single object prediction on a single image. It includes properties for the object ID and name, the bounding box location of the object, and a confidence score.|

## Code examples

These code snippets show you how to do the following with the Custom Vision client library for Python:

* [Authenticate the client](#authenticate-the-client)
* [Create a new Custom Vision project](#create-a-new-custom-vision-project)
* [Add tags to the project](#add-tags-to-the-project)
* [Upload and tag images](#upload-and-tag-images)
* [Train the project](#train-the-project)
* [Publish the current iteration](#publish-the-current-iteration)
* [Test the prediction endpoint](#test-the-prediction-endpoint)

## Authenticate the client

Instantiate a training and prediction client with your endpoint and keys. Create **ApiKeyServiceClientCredentials** objects with your keys, and use them with your endpoint to create a [CustomVisionTrainingClient](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-customvision/azure.cognitiveservices.vision.customvision.training.customvisiontrainingclient?view=azure-python) and [CustomVisionPredictionClient](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-customvision/azure.cognitiveservices.vision.customvision.prediction.customvisionpredictionclient?view=azure-python) object.

[!code-python[](~/cognitive-services-quickstart-code/python/CustomVision/ImageClassification/CustomVisionQuickstart.py?name=snippet_auth)]

## Create a new Custom Vision project

Add the following code to your script to create a new Custom Vision service project. 

See the [create_project](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-customvision/azure.cognitiveservices.vision.customvision.training.operations.customvisiontrainingclientoperationsmixin?view=azure-python#create-project-name--description-none--domain-id-none--classification-type-none--target-export-platforms-none--custom-headers-none--raw-false----operation-config-) method to specify other options when you create your project (explained in the [Build a classifier](../../getting-started-build-a-classifier.md) web portal guide).  

[!code-python[](~/cognitive-services-quickstart-code/python/CustomVision/ImageClassification/CustomVisionQuickstart.py?name=snippet_create)]

## Add tags to the project

To add classification tags to your project, add the following code:

[!code-python[](~/cognitive-services-quickstart-code/python/CustomVision/ImageClassification/CustomVisionQuickstart.py?name=snippet_tags)]


## Upload and tag images

First, download the sample images for this project. Save the contents of the [sample Images folder](https://github.com/Azure-Samples/cognitive-services-sample-data-files/tree/master/CustomVision/ImageClassification/Images) to your local device.

To add the sample images to the project, insert the following code after the tag creation. This code uploads each image with its corresponding tag. You can upload up to 64 images in a single batch.

[!code-python[](~/cognitive-services-quickstart-code/python/CustomVision/ImageClassification/CustomVisionQuickstart.py?name=snippet_tags)]

> [!NOTE]
> You'll need to change the path to the images based on where you downloaded the Cognitive Services Python SDK Samples repo.

## Train the project

This code creates the first iteration of the prediction model. 

[!code-python[](~/cognitive-services-quickstart-code/python/CustomVision/ImageClassification/CustomVisionQuickstart.py?name=snippet_train)]

> [!TIP]
> Train with selected tags
>
> You can optionally train on only a subset of your applied tags. You may want to do this if you haven't applied enough of certain tags yet, but you do have enough of others. In the **[train_project](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-customvision/azure.cognitiveservices.vision.customvision.training.operations.customvisiontrainingclientoperationsmixin?view=azure-python#train-project-project-id--training-type-none--reserved-budget-in-hours-0--force-train-false--notification-email-address-none--selected-tags-none--custom-headers-none--raw-false----operation-config-&preserve-view=true)** call, set the optional parameter *selected_tags* to a list of the ID strings of the tags you want to use. The model will train to only recognize the tags on that list.

## Publish the current iteration

An iteration is not available in the prediction endpoint until it is published. The following code makes the current iteration of the model available for querying. 

[!code-python[](~/cognitive-services-quickstart-code/python/CustomVision/ImageClassification/CustomVisionQuickstart.py?name=snippet_publish)]


## Test the prediction endpoint

To send an image to the prediction endpoint and retrieve the prediction, add the following code to the end of the file:

[!code-python[](~/cognitive-services-quickstart-code/python/CustomVision/ImageClassification/CustomVisionQuickstart.py?name=snippet_test)]

## Run the application

Run *CustomVisionQuickstart.py*.

```powershell
python CustomVisionQuickstart.py
```

The output of the application should be similar to the following text:

```console
Creating project...
Adding images...
Training...
Training status: Training
Training status: Completed
Done!
        Hemlock: 93.53%
        Japanese Cherry: 0.01%
```

You can then verify that the test image (found in **<base_image_location>/images/Test/**) is tagged appropriately. You can also go back to the [Custom Vision website](https://customvision.ai) and see the current state of your newly created project.

[!INCLUDE [clean-ic-project](../../includes/clean-ic-project.md)]

## Next steps

Now you've seen how every step of the image classification process can be done in code. This sample executes a single training iteration, but often you'll need to train and test your model multiple times in order to make it more accurate.

> [!div class="nextstepaction"]
> [Test and retrain a model](../../test-your-model.md)

* [What is Custom Vision?](../../overview.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/CustomVision/ImageClassification/CustomVisionQuickstart.cs)
* [SDK reference documentation](https://docs.microsoft.com/python/api/overview/azure/cognitiveservices/customvision?view=azure-python)