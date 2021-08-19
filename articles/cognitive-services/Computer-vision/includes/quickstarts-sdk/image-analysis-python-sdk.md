---
title: "Quickstart: Image Analysis client library for Python"
description: Get started with the Image Analysis client library for Python with this quickstart.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: include
ms.date: 12/15/2020
ms.author: pafarley
---

<a name="HOLTop"></a>

Use the Image Analysis client library to analyze an image for tags, text description, faces, adult content, and more.

[Reference documentation](/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cognitiveservices/azure-cognitiveservices-vision-computervision) | [Package (PiPy)](https://pypi.org/project/azure-cognitiveservices-vision-computervision/) | [Samples](https://azure.microsoft.com/resources/samples/?service=cognitive-services&term=vision&sort=0)

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* [Python 3.x](https://www.python.org/)
  * Your Python installation should include [pip](https://pip.pypa.io/en/stable/). You can check if you have pip installed by running `pip --version` on the command line. Get pip by installing the latest version of Python.
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="Create a Computer Vision resource"  target="_blank">create a Computer Vision resource</a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.

    * You will need the key and endpoint from the resource you create to connect your application to the Computer Vision service. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Setting up

### Install the client library

You can install the client library with:

```console
pip install --upgrade azure-cognitiveservices-vision-computervision
```

Also install the Pillow library.

```console
pip install pillow
```

### Create a new Python application

Create a new Python file&mdash;*quickstart-file.py*, for example. Then open it in your preferred editor or IDE and import the following libraries.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ImageAnalysisQuickstart.py?name=snippet_imports)]

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/ComputerVision/ImageAnalysisQuickstart.py), which contains the code examples in this quickstart.

Then, create variables for your resource's Azure endpoint and key.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ImageAnalysisQuickstart.py?name=snippet_vars)]

> [!IMPORTANT]
> Go to the Azure portal. If the Computer Vision resource you created in the **Prerequisites** section deployed successfully, click the **Go to Resource** button under **Next Steps**. You can find your key and endpoint in the resource's **key and endpoint** page, under **resource management**. 
>
> Remember to remove the key from your code when you're done, and never post it publicly. For production, consider using a secure way of storing and accessing your credentials. For example, [Azure key vault](../../../../key-vault/general/overview.md).

> [!div class="nextstepaction"]
> [I set up the client](?success=set-up-client#object-model) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Python&Section=set-up-client&product=computer-vision&page=image-analysis-python-sdk)

## Object model

The following classes and interfaces handle some of the major features of the Image Analysis Python SDK.

|Name|Description|
|---|---|
|[ComputerVisionClientOperationsMixin](/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision.operations.computervisionclientoperationsmixin)| This class directly handles all of the image operations, such as image analysis, text detection, and thumbnail generation.|
| [ComputerVisionClient](/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision.computervisionclient) | This class is needed for all Computer Vision functionality. You instantiate it with your subscription information, and you use it to produce instances of other classes. It implements **ComputerVisionClientOperationsMixin**.|
|[VisualFeatureTypes](/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision.models.visualfeaturetypes)| This enum defines the different types of image analysis that can be done in a standard Analyze operation. You specify a set of **VisualFeatureTypes** values depending on your needs. |

## Code examples

These code snippets show you how to do the following tasks with the Image Analysis client library for Python:

* [Authenticate the client](#authenticate-the-client)
* [Analyze an image](#analyze-an-image)

## Authenticate the client

Instantiate a client with your endpoint and key. Create a [CognitiveServicesCredentials](/python/api/msrest/msrest.authentication.cognitiveservicescredentials) object with your key, and use it with your endpoint to create a [ComputerVisionClient](/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision.computervisionclient) object.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ImageAnalysisQuickstart.py?name=snippet_client)]

> [!div class="nextstepaction"]
> [I authenticated the client](?success=authenticate-client#analyze-an-image) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Python&Section=authenticate-client&product=computer-vision&page=image-analysis-python-sdk)

## Analyze an image

Use your client object to analyze the visual features of a remote image. First save a reference to the URL of an image you want to analyze.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ImageAnalysisQuickstart.py?name=snippet_remoteimage)]

> [!TIP]
> You can also analyze a local image. See the [ComputerVisionClientOperationsMixin](/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision.operations.computervisionclientoperationsmixin) methods, such as **analyze_image_in_stream**. Or, see the sample code on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/ComputerVision/ImageAnalysisQuickstart.py) for scenarios involving local images.

### Get image description

The following code gets the list of generated captions for the image. See [Describe images](../../concept-describing-images.md) for more details.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ImageAnalysisQuickstart.py?name=snippet_describe)]

### Get image category

The following code gets the detected category of the image. See [Categorize images](../../concept-categorizing-images.md) for more details.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ImageAnalysisQuickstart.py?name=snippet_categorize)]

### Get image tags

The following code gets the set of detected tags in the image. See [Content tags](../../concept-tagging-images.md) for more details.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ImageAnalysisQuickstart.py?name=snippet_tags)]

### Detect objects

The following code detects common objects in the image and prints them to the console. See [Object detection](../../concept-object-detection.md) for more details.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ImageAnalysisQuickstart.py?name=snippet_objects)]        

### Detect brands

The following code detects corporate brands and logos in the image and prints them to the console. See [Brand detection](../../concept-brand-detection.md) for more details.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ImageAnalysisQuickstart.py?name=snippet_brands)]

### Detect faces

The following code returns the detected faces in the image with their rectangle coordinates and select face attributes. See [Face detection](../../concept-detecting-faces.md) for more details.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ImageAnalysisQuickstart.py?name=snippet_faces)]

### Detect adult, racy, or gory content

The following code prints the detected presence of adult content in the image. See [Adult, racy, gory content](../../concept-detecting-adult-content.md) for more details.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ImageAnalysisQuickstart.py?name=snippet_adult)]

### Get image color scheme

The following code prints the detected color attributes in the image, like the dominant colors and accent color. See [Color schemes](../../concept-detecting-color-schemes.md) for more details.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ImageAnalysisQuickstart.py?name=snippet_color)]

### Get domain-specific content

Image Analysis can use specialized model to do further analysis on images. See [Domain-specific content](../../concept-detecting-domain-content.md) for more details. 

The following code parses data about detected celebrities in the image.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ImageAnalysisQuickstart.py?name=snippet_celebs)]

The following code parses data about detected landmarks in the image.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ImageAnalysisQuickstart.py?name=snippet_landmarks)]

### Get the image type

The following code prints information about the type of image&mdash;whether it is clip art or line drawing.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ImageAnalysisQuickstart.py?name=snippet_type)]

> [!div class="nextstepaction"]
> [I analyzed an image](?success=analyze-image#run-the-application) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Python&Section=analyze-image&product=computer-vision&page=image-analysis-python-sdk)



## Run the application

Run the application with the `python` command on your quickstart file.

```console
python quickstart-file.py
```

> [!div class="nextstepaction"]
> [I ran the application](?success=run-the-application#clean-up-resources) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Python&Section=run-the-application&product=computer-vision&page=image-analysis-python-sdk)

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

> [!div class="nextstepaction"]
> [I cleaned up resources](?success=clean-up-resources#next-steps) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Python&Section=clean-up-resources&product=computer-vision&page=image-analysis-python-sdk)

## Next steps

In this quickstart, you learned how to install the Image Analysis client library and make basic image analysis calls. Next, learn more about the Analyze API features.

> [!div class="nextstepaction"]
>[Call the Analyze API](../../Vision-API-How-to-Topics/HowToCallVisionAPI.md)

* [Image Analysis overview](../../overview-image-analysis.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/ComputerVision/ImageAnalysisQuickstart.py).
