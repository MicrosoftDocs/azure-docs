---
title: "Quickstart: Optical character recognition client library for Node.js"
description: Get started with the Optical character recognition client library for Node.js with this quickstart
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

Use the Optical character recognition client library to read printed and handwritten text with the Read API.

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
> [I set up the client](?success=set-up-client#object-model) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Javascript&Section=set-up-client&product=computer-vision&page=node-sdk)

## Object model

The following classes and interfaces handle some of the major features of the OCR Node.js SDK.

|Name|Description|
|---|---|
| [ComputerVisionClient](/javascript/api/@azure/cognitiveservices-computervision/computervisionclient) | This class is needed for all Computer Vision functionality. You instantiate it with your subscription information, and you use it to do most image operations.|

## Code examples

These code snippets show you how to do the following tasks with the OCR client library for Node.js:

* [Authenticate the client](#authenticate-the-client)
* [Read printed and handwritten text](#read-printed-and-handwritten-text)

## Authenticate the client


Instantiate a client with your endpoint and key. Create a [ApiKeyCredentials](/python/api/msrest/msrest.authentication.apikeycredentials) object with your key and endpoint, and use it to create a [ComputerVisionClient](/javascript/api/@azure/cognitiveservices-computervision/computervisionclient) object.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_client)]

Then, define a function `computerVision` and declare an async series with primary function and callback function. At the end of the script, you'll complete this function definition and call it.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_functiondef_begin)]

> [!div class="nextstepaction"]
> [I authenticated the client](?success=authenticate-client#read-printed-and-handwritten-text) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Javascript&Section=authenticate-client&product=computer-vision&page=node-sdk)



## Read printed and handwritten text

The OCR service can extract the visible text in an image and convert it to a character stream. This sample uses the Read operations.

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
> [I read text](?success=read-printed-handwritten-text#run-the-application) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Javascript&Section=read-printed-handwritten-text&product=computer-vision&page=node-sdk)

## Close the function

Close out the `computerVision` function and call it.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart.js?name=snippet_functiondef_end)]

## Run the application

Run the application with the `node` command on your quickstart file.

```console
node index.js
```

> [!div class="nextstepaction"]
> [I ran the application](?success=run-the-application#clean-up-resources) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Javascript&Section=run-the-application&product=computer-vision&page=node-sdk)

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

> [!div class="nextstepaction"]
> [I cleaned up resources](?success=clean-up-resources#next-steps) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Javascript&Section=clean-up-resources&product=computer-vision&page=node-sdk)

## Next steps

In this quickstart, you learned how to install the OCR client library and use the Read API. Next, learn more about the Read API features.

> [!div class="nextstepaction"]
>[Call the Read API](../../Vision-API-How-to-Topics/call-read-api.md)

* [OCR overview](../../overview-ocr.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/ComputerVision/ComputerVisionQuickstart.js).
