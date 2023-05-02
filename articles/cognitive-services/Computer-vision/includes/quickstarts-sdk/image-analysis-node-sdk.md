---
title: "Quickstart: Image Analysis client library for Node.js"
description: Get started with the Image Analysis client library for Node.js with this quickstart
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: include
ms.date: 12/15/2020
ms.author: pafarley
ms.custom: devx-track-js, ignite-2022
---

<a name="HOLTop"></a>

Use the Image Analysis client library for JavaScript to analyze a remote image for content tags.


> [!TIP]
> You can also analyze a local image. See the [ComputerVisionClient](/javascript/api/@azure/cognitiveservices-computervision/computervisionclient) methods, such as **describeImageInStream**. Or, see the sample code on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/ComputerVision/ImageAnalysisQuickstart.js) for scenarios involving local images.

> [!TIP]
> The Analyze API can do many different operations other than generate image tags. See the [Image Analysis how-to guide](../../how-to/call-analyze-image.md) for examples that showcase all of the available features.

[Reference documentation](/javascript/api/@azure/cognitiveservices-computervision/) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/cognitiveservices/cognitiveservices-computervision) | [Package (npm)](https://www.npmjs.com/package/@azure/cognitiveservices-computervision) | [Samples](/samples/browse/?products=azure&terms=computer-vision)

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The current version of [Node.js](https://nodejs.org/)
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="Create a Computer Vision resource"  target="_blank">create a Computer Vision resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Computer Vision service. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVASCRIPT&Pillar=Vision&Product=Image-analysis&Page=quickstart&Section=Prerequisites" target="_target">I ran into an issue</a>

## Analyze image

1. Create a new Node.js application

    In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it.

    ```console
    mkdir myapp && cd myapp
    ```

    Run the `npm init` command to create a node application with a `package.json` file.

    ```console
    npm init
    ```

    ### Install the client library

    Install the `ms-rest-azure` and `@azure/cognitiveservices-computervision` npm package:

    ```console
    npm install @azure/cognitiveservices-computervision
    ```

    Also install the async module:

    ```console
    npm install async
    ```

    Your app's `package.json` file will be updated with the dependencies.

    Create a new file, *index.js*. 

1. Find the key and endpoint.

    [!INCLUDE [find key and endpoint](../find-key.md)]

1. Open *index.js* in a text editor and paste in the following code.

   [!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ImageAnalysisQuickstart-single.js?name=snippet_single)]


1. Paste your key and endpoint into the code where indicated. Your Computer Vision endpoint has the form `https://<your_computer_vision_resource_name>.cognitiveservices.azure.com/`.

   > [!IMPORTANT]
   > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md). See the Cognitive Services [security](../../../cognitive-services-security.md) article for more information.

1. Run the application with the `node` command on your quickstart file.

   ```console
   node index.js
   ```

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVASCRIPT&Pillar=Vision&Product=Image-analysis&Page=quickstart&Section=Analyze-image" target="_target">I ran into an issue</a>

## Output

```console
-------------------------------------------------
DETECT TAGS

Analyzing tags in image... sample16.png
Tags: grass (1.00), dog (0.99), mammal (0.99), animal (0.99), dog breed (0.99), pet (0.97), outdoor (0.97), companion dog (0.91), small greek domestic dog (0.90), golden retriever (0.89), labrador retriever (0.87), puppy (0.87), ancient dog breeds (0.85), field (0.80), retriever (0.68), brown (0.66)

-------------------------------------------------
End of quickstart.
```

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVASCRIPT&Pillar=Vision&Product=Image-analysis&Page=quickstart&Section=Output" target="_target">I ran into an issue</a>

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

In this quickstart, you learned how to install the Image Analysis client library and make basic image analysis calls. Next, learn more about the Analyze API features.

> [!div class="nextstepaction"]
>[Call the Analyze API](../../how-to/call-analyze-image.md)

* [Image Analysis overview](../../overview-image-analysis.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/ComputerVision/ImageAnalysisQuickstart.js).
