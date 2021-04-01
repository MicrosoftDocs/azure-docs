---
title: "Quickstart: Computer Vision client library for Python"
description: Get started with the Computer Vision client library for Python with this quickstart.
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

Use the Computer Vision client library to:

* Analyze an image for tags, text description, faces, adult content, and more.
* Read printed and handwritten text with the Read API.

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

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/ComputerVision/ComputerVisionQuickstart.py), which contains the code examples in this quickstart.

Create a new Python file&mdash;*quickstart-file.py*, for example. Then open it in your preferred editor or IDE.

### Find the subscription key and endpoint

Go to the Azure portal. If the Computer Vision resource you created in the **Prerequisites** section deployed successfully, click the **Go to Resource** button under **Next Steps**. You can find your subscription key and endpoint in the resource's **key and endpoint** page, under **resource management**. 

Create variables for your Computer Vision subscription key and endpoint. Paste your subscription key and endpoint into the following code where indicated. Your Computer Vision endpoint has the form `https://<your_computer_vision_resource_name>.cognitiveservices.azure.com/`.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ComputerVisionQuickstart.py?name=snippet_imports_and_vars)]

> [!IMPORTANT]
> Remember to remove the subscription key from your code when you're done, and never post it publicly. For production, consider using a secure way of storing and accessing your credentials. For example, [Azure key vault](../../../../key-vault/general/overview.md).

> [!div class="nextstepaction"]
> [I set up the client](?success=set-up-client#object-model) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Python&Section=set-up-client)

## Object model

The following classes and interfaces handle some of the major features of the Computer Vision Python SDK.

|Name|Description|
|---|---|
|[ComputerVisionClientOperationsMixin](/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision.operations.computervisionclientoperationsmixin)| This class directly handles all of the image operations, such as image analysis, text detection, and thumbnail generation.|
| [ComputerVisionClient](/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision.computervisionclient) | This class is needed for all Computer Vision functionality. You instantiate it with your subscription information, and you use it to produce instances of other classes. It implements **ComputerVisionClientOperationsMixin**.|
|[VisualFeatureTypes](/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision.models.visualfeaturetypes)| This enum defines the different types of image analysis that can be done in a standard Analyze operation. You specify a set of **VisualFeatureTypes** values depending on your needs. |

## Code examples

These code snippets show you how to do the following tasks with the Computer Vision client library for Python:

* [Authenticate the client](#authenticate-the-client)
* [Analyze an image](#analyze-an-image)
* [Read printed and handwritten text](#read-printed-and-handwritten-text)

## Authenticate the client

Instantiate a client with your endpoint and key. Create a [CognitiveServicesCredentials](/python/api/msrest/msrest.authentication.cognitiveservicescredentials) object with your key, and use it with your endpoint to create a [ComputerVisionClient](/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision.computervisionclient) object.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ComputerVisionQuickstart.py?name=snippet_client)]

> [!div class="nextstepaction"]
> [I authenticated the client](?success=authenticate-client#analyze-an-image) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Python&Section=authenticate-client)

## Analyze an image

Use your client object to analyze the visual features of a remote image. First save a reference to the URL of an image you want to analyze.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ComputerVisionQuickstart.py?name=snippet_remoteimage)]

> [!TIP]
> You can also analyze a local image. See the [ComputerVisionClientOperationsMixin](/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision.operations.computervisionclientoperationsmixin) methods, such as **analyze_image_in_stream**. Or, see the sample code on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/ComputerVision/ComputerVisionQuickstart.py) for scenarios involving local images.

### Get image description

The following code gets the list of generated captions for the image. See [Describe images](../../concept-describing-images.md) for more details.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ComputerVisionQuickstart.py?name=snippet_describe)]

### Get image category

The following code gets the detected category of the image. See [Categorize images](../../concept-categorizing-images.md) for more details.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ComputerVisionQuickstart.py?name=snippet_categorize)]

### Get image tags

The following code gets the set of detected tags in the image. See [Content tags](../../concept-tagging-images.md) for more details.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ComputerVisionQuickstart.py?name=snippet_tags)]

### Detect objects

The following code detects common objects in the image and prints them to the console. See [Object detection](../../concept-object-detection.md) for more details.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ComputerVisionQuickstart.py?name=snippet_objects)]        

### Detect brands

The following code detects corporate brands and logos in the image and prints them to the console. See [Brand detection](../../concept-brand-detection.md) for more details.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ComputerVisionQuickstart.py?name=snippet_brands)]

### Detect faces

The following code returns the detected faces in the image with their rectangle coordinates and select face attributes. See [Face detection](../../concept-detecting-faces.md) for more details.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ComputerVisionQuickstart.py?name=snippet_faces)]

### Detect adult, racy, or gory content

The following code prints the detected presence of adult content in the image. See [Adult, racy, gory content](../../concept-detecting-adult-content.md) for more details.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ComputerVisionQuickstart.py?name=snippet_adult)]

### Get image color scheme

The following code prints the detected color attributes in the image, like the dominant colors and accent color. See [Color schemes](../../concept-detecting-color-schemes.md) for more details.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ComputerVisionQuickstart.py?name=snippet_color)]

### Get domain-specific content

Computer Vision can use specialized model to do further analysis on images. See [Domain-specific content](../../concept-detecting-domain-content.md) for more details. 

The following code parses data about detected celebrities in the image.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ComputerVisionQuickstart.py?name=snippet_celebs)]

The following code parses data about detected landmarks in the image.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ComputerVisionQuickstart.py?name=snippet_landmarks)]

### Get the image type

The following code prints information about the type of image&mdash;whether it is clip art or line drawing.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ComputerVisionQuickstart.py?name=snippet_type)]

> [!div class="nextstepaction"]
> [I analyzed an image](?success=analyze-image#read-printed-and-handwritten-text) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Python&Section=analyze-image)

## Read printed and handwritten text

Computer Vision can read visible text in an image and convert it to a character stream. You do this in two parts.

### Call the Read API

First, use the following code to call the **read** method for the given image. This returns an operation ID and starts an asynchronous process to read the content of the image.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ComputerVisionQuickstart.py?name=snippet_read_call)]

> [!TIP]
> You can also read text from a local image. See the [ComputerVisionClientOperationsMixin](/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision.operations.computervisionclientoperationsmixin) methods, such as **read_in_stream**. Or, see the sample code on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/ComputerVision/ComputerVisionQuickstart.py) for scenarios involving local images.

### Get Read results

Next, get the operation ID returned from the **read** call, and use it to query the service for operation results. The following code checks the operation at one-second intervals until the results are returned. It then prints the extracted text data to the console.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ComputerVisionQuickstart.py?name=snippet_read_response)]

> [!div class="nextstepaction"]
> [I read text](?success=read-printed-handwritten-text#run-the-application) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Python&Section=read-printed-handwritten-text)

## Run the application

Run the application with the `python` command on your quickstart file.

```console
python quickstart-file.py
```

> [!div class="nextstepaction"]
> [I ran the application](?success=run-the-application#clean-up-resources) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Python&Section=run-the-application)

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

> [!div class="nextstepaction"]
> [I cleaned up resources](?success=clean-up-resources#next-steps) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Python&Section=clean-up-resources)

## Next steps

In this quickstart, you learned how to use the Computer Vision library for Python to do basis tasks. Next, explore the reference documentation to learn more about the library.

> [!div class="nextstepaction"]
>[Computer Vision API reference (Python)](/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision)

* [What is Computer Vision?](../../overview.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/ComputerVision/ComputerVisionQuickstart.py).
