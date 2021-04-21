---
author: PatrickFarley
ms.author: pafarley
ms.service: cognitive-services
ms.date: 10/25/2020
---

Get started with the Custom Vision client library for Python. Follow these steps to install the package and try out the example code for building an object detection model. You'll create a project, add tags, train the project, and use the project's prediction endpoint URL to programmatically test it. Use this example as a template for building your own image recognition app.

> [!NOTE]
> If you want to build and train an object detection model _without_ writing code, see the [browser-based guidance](../../get-started-build-detector.md) instead.

Use the Custom Vision client library for Python to:

* Create a new Custom Vision project
* Add tags to the project
* Upload and tag images
* Train the project
* Publish the current iteration
* Test the prediction endpoint

[Reference documentation](/python/api/overview/azure/cognitiveservices/customvision) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cognitiveservices/azure-cognitiveservices-vision-customvision/azure/cognitiveservices/vision/customvision) | [Package (PyPI)](https://pypi.org/project/azure-cognitiveservices-vision-customvision/) | [Samples](/samples/browse/?languages=python&products=azure&term=vision&terms=vision)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* [Python 3.x](https://www.python.org/)
  * Your Python installation should include [pip](https://pip.pypa.io/en/stable/). You can check if you have pip installed by running `pip --version` on the command line. Get pip by installing the latest version of Python.
* Once you have your Azure subscription, <a href="https://portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=microsoft_azure_cognitiveservices_customvision#create/Microsoft.CognitiveServicesCustomVision"  title="Create a Custom Vision resource"  target="_blank">create a Custom Vision resource</a> in the Azure portal to create a training and prediction resource and get your keys and endpoint. Wait for it to deploy and click the **Go to resource** button.
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

[!code-python[](~/cognitive-services-quickstart-code/python/CustomVision/ObjectDetection/CustomVisionQuickstart.py?name=snippet_imports)]

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/CustomVision/ObjectDetection/CustomVisionQuickstart.py), which contains the code examples in this quickstart.

Create variables for your resource's Azure endpoint and subscription keys.

[!code-python[](~/cognitive-services-quickstart-code/python/CustomVision/ObjectDetection/CustomVisionQuickstart.py?name=snippet_creds)]


> [!IMPORTANT]
> Go to the Azure portal. If the Custom Vision resources you created in the **Prerequisites** section deployed successfully, click the **Go to Resource** button under **Next Steps**. You can find your keys and endpoint in the resources' **key and endpoint** pages, under **resource management**. You'll need to get the keys for both your training and prediction resources, along with the API endpoint for your training resource.
>
> You can find the prediction resource ID value on the resource's **Overview** tab, listed as **Subscription ID**.
>
> Remember to remove the keys from your code when you're done, and never post them publicly. For production, consider using a secure way of storing and accessing your credentials. For more information, see the Cognitive Services [security](../../../cognitive-services-security.md) article.

## Object model

|Name|Description|
|---|---|
|[CustomVisionTrainingClient](/python/api/azure-cognitiveservices-vision-customvision/azure.cognitiveservices.vision.customvision.training.customvisiontrainingclient) | This class handles the creation, training, and publishing of your models. |
|[CustomVisionPredictionClient](/python/api/azure-cognitiveservices-vision-customvision/azure.cognitiveservices.vision.customvision.prediction.customvisionpredictionclient)| This class handles the querying of your models for object detection predictions.|
|[ImagePrediction](/python/api/azure-cognitiveservices-vision-customvision/azure.cognitiveservices.vision.customvision.prediction.models.imageprediction)| This class defines a single object prediction on a single image. It includes properties for the object ID and name, the bounding box location of the object, and a confidence score.|

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

Instantiate a training and prediction client with your endpoint and keys. Create **ApiKeyServiceClientCredentials** objects with your keys, and use them with your endpoint to create a [CustomVisionTrainingClient](/python/api/azure-cognitiveservices-vision-customvision/azure.cognitiveservices.vision.customvision.training.customvisiontrainingclient) and [CustomVisionPredictionClient](/python/api/azure-cognitiveservices-vision-customvision/azure.cognitiveservices.vision.customvision.prediction.customvisionpredictionclient) object.

[!code-python[](~/cognitive-services-quickstart-code/python/CustomVision/ObjectDetection/CustomVisionQuickstart.py?name=snippet_auth)]


## Create a new Custom Vision project

Add the following code to your script to create a new Custom Vision service project. 

See the [create_project](/python/api/azure-cognitiveservices-vision-customvision/azure.cognitiveservices.vision.customvision.training.operations.customvisiontrainingclientoperationsmixin#create-project-name--description-none--domain-id-none--classification-type-none--target-export-platforms-none--custom-headers-none--raw-false----operation-config-&preserve-view=true) method to specify other options when you create your project (explained in the [Build a detector](../../get-started-build-detector.md) web portal guide).  

[!code-python[](~/cognitive-services-quickstart-code/python/CustomVision/ObjectDetection/CustomVisionQuickstart.py?name=snippet_create)]


## Add tags to the project

To create object tags in your project, add the following code:

[!code-python[](~/cognitive-services-quickstart-code/python/CustomVision/ObjectDetection/CustomVisionQuickstart.py?name=snippet_tags)]


## Upload and tag images

First, download the sample images for this project. Save the contents of the [sample Images folder](https://github.com/Azure-Samples/cognitive-services-sample-data-files/tree/master/CustomVision/ObjectDetection/Images) to your local device.

> [!NOTE]
> Do you need a broader set of images to complete your training? Trove, a Microsoft Garage project, allows you to collect and purchase sets of images for training purposes. Once you've collected your images, you can download them and then import them into your Custom Vision project in the usual way. Visit the [Trove page](https://www.microsoft.com/ai/trove?activetab=pivot1:primaryr3) to learn more.

When you tag images in object detection projects, you need to specify the region of each tagged object using normalized coordinates. The following code associates each of the sample images with its tagged region. The regions specify the bounding box in normalized coordinates, and the coordinates are given in the order: left, top, width, height.

[!code-python[](~/cognitive-services-quickstart-code/python/CustomVision/ObjectDetection/CustomVisionQuickstart.py?name=snippet_tagging)]

> [!NOTE]
> If you don't have a click-and-drag utility to mark the coordinates of regions, you can use the web UI at [Customvision.ai](https://www.customvision.ai/). In this example, the coordinates are already provided.

Then, use this map of associations to upload each sample image with its region coordinates (you can upload up to 64 images in a single batch). Add the following code.


[!code-python[](~/cognitive-services-quickstart-code/python/CustomVision/ObjectDetection/CustomVisionQuickstart.py?name=snippet_upload)]

> [!NOTE]
> You'll need to change the path to the images based on where you downloaded the Cognitive Services Python SDK Samples repo earlier.

## Train the project

This code creates the first iteration of the prediction model. 

[!code-python[](~/cognitive-services-quickstart-code/python/CustomVision/ObjectDetection/CustomVisionQuickstart.py?name=snippet_train)]

> [!TIP]
> Train with selected tags
>
> You can optionally train on only a subset of your applied tags. You may want to do this if you haven't applied enough of certain tags yet, but you do have enough of others. In the **[train_project](/python/api/azure-cognitiveservices-vision-customvision/azure.cognitiveservices.vision.customvision.training.operations.customvisiontrainingclientoperationsmixin#train-project-project-id--training-type-none--reserved-budget-in-hours-0--force-train-false--notification-email-address-none--selected-tags-none--custom-headers-none--raw-false----operation-config-&preserve-view=true)** call, set the optional parameter *selected_tags* to a list of the ID strings of the tags you want to use. The model will train to only recognize the tags on that list.

## Publish the current iteration

An iteration is not available in the prediction endpoint until it is published. The following code makes the current iteration of the model available for querying. 

[!code-python[](~/cognitive-services-quickstart-code/python/CustomVision/ObjectDetection/CustomVisionQuickstart.py?name=snippet_publish)]

## Test the prediction endpoint

To send an image to the prediction endpoint and retrieve the prediction, add the following code to the end of the file:

[!code-python[](~/cognitive-services-quickstart-code/python/CustomVision/ObjectDetection/CustomVisionQuickstart.py?name=snippet_test)]


## Run the application

Run *CustomVisionQuickstart.py*.

```powershell
python CustomVisionQuickstart.py
```

The output of the application should appear in the console. You can then verify that the test image (found in **<base_image_location>/images/Test**) is tagged appropriately and that the region of detection is correct. You can also go back to the [Custom Vision website](https://customvision.ai) and see the current state of your newly created project.

## Clean up resources

[!INCLUDE [clean-od-project](../../includes/clean-od-project.md)]

## Next steps

Now you've done every step of the object detection process in code. This sample executes a single training iteration, but often you'll need to train and test your model multiple times in order to make it more accurate. The following guide deals with image classification, but its principles are similar to object detection.

> [!div class="nextstepaction"]
> [Test and retrain a model](../../test-your-model.md)

* [What is Custom Vision?](../../overview.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/CustomVision/ObjectDetection/CustomVisionQuickstart.py)
* [SDK reference documentation](/python/api/overview/azure/cognitiveservices/customvision)
