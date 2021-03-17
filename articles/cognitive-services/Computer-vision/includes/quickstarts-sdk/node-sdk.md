---
title: "Quickstart: Computer Vision client library for Node.js"
description: Get started with the Computer Vision client library for Node.js with this quickstart
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: include
ms.date: 12/15/2020
ms.author: pafarley
ms.custom: devx-track-js
---

<a name="HOLTop"></a>

Use the Computer Vision client library to:

* Analyze an image for tags, text description, faces, adult content, and more.
* Read printed and handwritten text with the Read API.

[Reference documentation](/javascript/api/@azure/cognitiveservices-computervision/) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/cognitiveservices/cognitiveservices-computervision) | [Package (npm)](https://www.npmjs.com/package/@azure/cognitiveservices-computervision) | [Samples](https://azure.microsoft.com/resources/samples/?service=cognitive-services&term=vision&sort=0)

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The current version of [Node.js](https://nodejs.org/)
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="Create a Computer Vision resource"  target="_blank">create a Computer Vision resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Computer Vision service. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Setting up

### Create a new Node.js application

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it.

```console
mkdir myapp && cd myapp
```

Run the `npm init` command to create a node application with a `package.json` file.

```console
npm init
```

### Install the client library

Install the `ms-rest-azure` and `@azure/cognitiveservices-computervision` NPM package:

```console
npm install @azure/cognitiveservices-computervision
```

Also install the async module:

```console
npm install async
```

Your app's `package.json` file will be updated with the dependencies.

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/ComputerVision/ComputerVisionQuickstart.js), which contains the code examples in this quickstart.

Create a new file, *index.js*, and open it in a text editor.

### Find the subscription key and endpoint

Go to the Azure portal. If the Computer Vision resource you created in the **Prerequisites** section deployed successfully, click the **Go to Resource** button under **Next Steps**. You can find your subscription key and endpoint in the resource's **key and endpoint** page, under **resource management**. 

Create variables for your Computer Vision subscription key and endpoint. Paste your subscription key and endpoint into the following code where indicated. Your Computer Vision endpoint has the form `https://<your_computer_vision_resource_name>.cognitiveservices.azure.com/`.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_imports_and_vars)]

> [!IMPORTANT]
> Remember to remove the subscription key from your code when you're done, and never post it publicly. For production, consider using a secure way of storing and accessing your credentials. For example, [Azure key vault](../../../../key-vault/general/overview.md).

> [!div class="nextstepaction"]
> [I set up the client](?success=set-up-client#object-model) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Javascript&Section=set-up-client)

## Object model

The following classes and interfaces handle some of the major features of the Computer Vision Node.js SDK.

|Name|Description|
|---|---|
| [ComputerVisionClient](/javascript/api/@azure/cognitiveservices-computervision/computervisionclient) | This class is needed for all Computer Vision functionality. You instantiate it with your subscription information, and you use it to do most image operations.|
|[VisualFeatureTypes](/javascript/api/@azure/cognitiveservices-computervision/visualfeaturetypes)| This enum defines the different types of image analysis that can be done in a standard Analyze operation. You specify a set of **VisualFeatureTypes** values depending on your needs. |

## Code examples

These code snippets show you how to do the following tasks with the Computer Vision client library for Node.js:

* [Authenticate the client](#authenticate-the-client)
* [Analyze an image](#analyze-an-image)
* [Read printed and handwritten text](#read-printed-and-handwritten-text)

## Authenticate the client


Instantiate a client with your endpoint and key. Create a [ApiKeyCredentials](/python/api/msrest/msrest.authentication.apikeycredentials) object with your key and endpoint, and use it to create a [ComputerVisionClient](/javascript/api/@azure/cognitiveservices-computervision/computervisionclient) object.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_client)]

Then, define a function `computerVision` and declare an async series with primary function and callback function. You will add your quickstart code into the primary function, and call `computerVision` at the bottom of the script. The rest of the code in this quickstart goes inside the `computerVision` function.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_functiondef_begin)]

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_functiondef_end)]

> [!div class="nextstepaction"]
> [I authenticated the client](?success=authenticate-client#analyze-an-image) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Javascript&Section=authenticate-client)

## Analyze an image

The code in this section analyzes remote images to extract various visual features. You can do these operations as part of the **analyzeImage** method of the client object, or you can call them using individual methods. See the [reference documentation](/javascript/api/@azure/cognitiveservices-computervision/) for details.

> [!NOTE]
> You can also analyze a local image. See the [ComputerVisionClient](/javascript/api/@azure/cognitiveservices-computervision/computervisionclient) methods, such as **analyzeImageInStream**. Or, see the sample code on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/ComputerVision/ComputerVisionQuickstart.js) for scenarios involving local images.

### Get image description

The following code gets the list of generated captions for the image. See [Describe images](../../concept-describing-images.md) for more details.

First, define the URL of an image to analyze:

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_describe_image)]

Then add the following code to get the image description and print it to the console.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_describe)]

### Get image category

The following code gets the detected category of the image. See [Categorize images](../../concept-categorizing-images.md) for more details.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_categories)]

Define the helper function `formatCategories`:

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_categories_format)]

### Get image tags

The following code gets the set of detected tags in the image. See [Content tags](../../concept-tagging-images.md) for more details.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_tags)]

Define the helper function `formatTags`:

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_tagsformat)]

### Detect objects

The following code detects common objects in the image and prints them to the console. See [Object detection](../../concept-object-detection.md) for more details.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_objects)]

Define the helper function `formatRectObjects` to return the top, left, bottom, and right coordinates, along with the width and height.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_objectformat)]

### Detect brands

The following code detects corporate brands and logos in the image and prints them to the console. See [Brand detection](../../concept-brand-detection.md) for more details.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_brands)]

### Detect faces

The following code returns the detected faces in the image with their rectangle coordinates and select face attributes. See [Face detection](../../concept-detecting-faces.md) for more details.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_faces)]

Define the helper function `formatRectFaces`:

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_formatfaces)]

### Detect adult, racy, or gory content

The following code prints the detected presence of adult content in the image. See [Adult, racy, gory content](../../concept-detecting-adult-content.md) for more details.

Define the URL of the image to use:

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_adult_image)]

Then add the following code to detect adult content and print the results to the console.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_adult)]

### Get image color scheme

The following code prints the detected color attributes in the image, like the dominant colors and accent color. See [Color schemes](../../concept-detecting-color-schemes.md) for more details.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_colors)]

Define the helper function `printColorScheme` to print the details of the color scheme to the console.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_colors_print)]

### Get domain-specific content

Computer Vision can use specialized model to do further analysis on images. See [Domain-specific content](../../concept-detecting-domain-content.md) for more details.

First, define the URL of an image to analyze:

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_domain_image)]

The following code parses data about detected landmarks in the image.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_landmarks)]

Define the helper function `formatRectDomain` to parse the location data about detected landmarks.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_landmarks_rect)]

### Get the image type

The following code prints information about the type of image&mdash;whether it is clip art or line drawing.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_imagetype)]

Define the helper function `describeType`:

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_imagetype_describe)]

> [!div class="nextstepaction"]
> [I analyzed an image](?success=analyze-image#read-printed-and-handwritten-text) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Javascript&Section=analyze-image)

## Read printed and handwritten text

Computer Vision can extract the visible text in an image and convert it to a character stream. This sample uses the Read operations.

### Set up test images

Save a reference of the URL of the images you want to extract text from.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_read_images)]

> [!NOTE]
> You can also read text from a local image. See the [ComputerVisionClient](/javascript/api/@azure/cognitiveservices-computervision/computervisionclient) methods, such as **readInStream**. Or, see the sample code on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/ComputerVision/ComputerVisionQuickstart.js) for scenarios involving local images.

### Call the Read API

Define the following fields in your function to denote the Read call status values.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_statuses)]

Add the code below, which calls the `readTextFromURL` function for the given images.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_read_call)]

Define the `readTextFromURL` function. This calls the **read** method  on the client object, which returns an operation ID and starts an asynchronous process to read the content of the image. Then it uses the operation ID to check the operation status until the results are returned. They it returns the extracted results.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_read_helper)]

Then, define the helper function `printRecText`, which prints the results of the Read operations to the console.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_read_print)]

> [!div class="nextstepaction"]
> [I read text](?success=read-printed-handwritten-text#run-the-application) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Javascript&Section=read-printed-handwritten-text)

## Run the application

Run the application with the `node` command on your quickstart file.

```console
node index.js
```

> [!div class="nextstepaction"]
> [I ran the application](?success=run-the-application#clean-up-resources) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Javascript&Section=run-the-application)

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

> [!div class="nextstepaction"]
> [I cleaned up resources](?success=clean-up-resources#next-steps) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Javascript&Section=clean-up-resources)

## Next steps

> [!div class="nextstepaction"]
>[Computer Vision API reference (Node.js)](/javascript/api/@azure/cognitiveservices-computervision/)


* [What is Computer Vision?](../../overview.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/ComputerVision/ComputerVisionQuickstart.js).
