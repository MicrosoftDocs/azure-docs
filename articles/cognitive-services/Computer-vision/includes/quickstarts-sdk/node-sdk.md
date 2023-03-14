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

Use the Optical character recognition client library to read printed and handwritten text with the Read API.  The OCR service can read visible text in an image and convert it to a character stream. For more information on text recognition, see the [Optical character recognition (OCR)](../../overview-ocr.md) overview.


> [!TIP]
> You can also read text from a local image. See the [ComputerVisionClient](/javascript/api/@azure/cognitiveservices-computervision/computervisionclient) methods, such as **readInStream**. Or, see the sample code on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/ComputerVision/ComputerVisionQuickstart.js) for scenarios involving local images.

[Reference documentation](/javascript/api/@azure/cognitiveservices-computervision/) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/cognitiveservices/cognitiveservices-computervision) | [Package (npm)](https://www.npmjs.com/package/@azure/cognitiveservices-computervision) | [Samples](https://azure.microsoft.com/resources/samples/?service=cognitive-services&term=vision&sort=0)

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The current version of [Node.js](https://nodejs.org/)
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="Create a Computer Vision resource"  target="_blank">create a Computer Vision resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Computer Vision service. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVASCRIPT&Pillar=Vision&Product=OCR&Page=quickstart&Section=Prerequisites" target="_target">I ran into an issue</a>

## Read printed and handwritten text

1. Create a new Node.js application.

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

    Create a new file, *index.js*, and open it in a text editor.

1. Find the key and endpoint.

    [!INCLUDE [find key and endpoint](../find-key.md)]

1. Paste the following code into your *index.js* file.

   [!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart-single.js?name=snippet_single)]


1. Paste your key and endpoint into the above code where indicated. Your Computer Vision endpoint has the form `https://<your_computer_vision_resource_name>.cognitiveservices.azure.com/`.

   > [!IMPORTANT]
   > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md). See the Cognitive Services [security](../../../cognitive-services-security.md) article for more information.

1. As an optional step, see [How to specify the model version](../../how-to/call-read-api.md#determine-how-to-process-the-data-optional). For example, to explicitly specify the latest GA model, edit the `read` statement as shown. Skipping the parameter or using `"latest"` automatically uses the most recent GA model.

   ```JS
     let result = await client.read(url,{modelVersion:"2022-04-30"});
   ```

1. Run the application with the `node` command on your quickstart file.

   ```console
   node index.js
   ```

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVASCRIPT&Pillar=Vision&Product=OCR&Page=quickstart&Section=Read-printed-and-handwritten-text" target="_target">I ran into an issue</a>

## Output

```console
-------------------------------------------------
READ PRINTED, HANDWRITTEN TEXT AND PDF

Read printed text from URL... printed_text.jpg
Recognized text:
Nutrition Facts Amount Per Serving
Serving size: 1 bar (40g)
Serving Per Package: 4
Total Fat 13g
Saturated Fat 1.5g
Amount Per Serving
Trans Fat 0g
Calories 190
Cholesterol 0mg
ories from Fat 110
Sodium 20mg
nt Daily Values are based on Vitamin A 50%
calorie diet.

-------------------------------------------------
End of quickstart.
```

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVASCRIPT&Pillar=Vision&Product=OCR&Page=quickstart&Section=Output" target="_target">I ran into an issue</a>

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)


## Next steps

In this quickstart, you learned how to install the OCR client library and use the Read API. Next, learn more about the Read API features.

> [!div class="nextstepaction"]
>[Call the Read API](../../how-to/call-read-api.md)

* [OCR overview](../../overview-ocr.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/ComputerVision/ComputerVisionQuickstart.js).
