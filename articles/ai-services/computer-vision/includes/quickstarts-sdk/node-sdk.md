---
title: "Quickstart: Optical character recognition client library for Node.js"
description: Get started with the Optical character recognition client library for Node.js with this quickstart.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: include
ms.date: 08/07/2023
ms.author: pafarley
ms.custom: devx-track-js
---

<a name="HOLTop"></a>

Use the optical character recognition (OCR) client library to read printed and handwritten text with the Read API. The OCR service can read visible text in an image and convert it to a character stream. For more information on text recognition, see the [OCR overview](../../overview-ocr.md).

> [!TIP]
> You can also read text from a local image. See the [ComputerVisionClient](/javascript/api/@azure/cognitiveservices-computervision/computervisionclient) methods, such as **readInStream**. Or, see the sample code on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/ComputerVision/ComputerVisionQuickstart.js) for scenarios involving local images.

[Reference documentation](/javascript/api/@azure/cognitiveservices-computervision/) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/cognitiveservices/cognitiveservices-computervision) | [Package (npm)](https://www.npmjs.com/package/@azure/cognitiveservices-computervision) | [Samples](/samples/browse/?products=azure&terms=computer-vision)

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).
- The current version of [Node.js](https://nodejs.org/).
- <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision" title="create a Vision resource" target="_blank">An Azure AI Vision resource</a>. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
- The key and endpoint from the resource you create to connect your application to the Azure AI Vision service.

  1. After your Azure Vision resource deploys, select **Go to resource**.
  1. In the left navigation menu, select **Keys and Endpoint**.
  1. Copy one of the keys and the **Endpoint** for use later in the quickstart.

[!INCLUDE [create environment variables](../environment-variables.md)]

## Read printed and handwritten text

Create a new Node.js application.

1. In a console window, create a new directory for your app, and navigate to it.

   ```console
   mkdir myapp
   cd myapp
   ```

1. Run the `npm init` command to create a node application with a `package.json` file. Select **Enter** for any prompts.

   ```console
   npm init
   ```

1. To install the client library, install the `ms-rest-azure` and `@azure/cognitiveservices-computervision` npm package:

   ```console
   npm install ms-rest-azure
   npm install @azure/cognitiveservices-computervision
   ```

1. Install the async module:

   ```console
   npm install async
   ```

   Your app's `package.json` file is updated with the dependencies.

1. Create a new file, *index.js*, and open it in a text editor.

1. Paste the following code into your *index.js* file.

   [!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ComputerVisionQuickstart-single.js?name=snippet_single)]

1. As an optional step, see [Determine how to process the data](../../how-to/call-read-api.md#determine-how-to-process-the-data-optional). For example, to explicitly specify the latest GA model, edit the `read` statement as shown. Skipping the parameter or using `"latest"` automatically uses the most recent GA model.

   ```js
     let result = await client.read(url,{modelVersion:"2022-04-30"});
   ```

1. Run the application with the `node` command on your quickstart file.

   ```console
   node index.js
   ```

## Output

```output
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

## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Clean up resources with the Azure portal](../../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Clean up resources with Azure CLI](../../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

In this quickstart, you learned how to install the OCR client library and use the Read API. Next, learn more about the Read API features.

> [!div class="nextstepaction"]
>[Call the Read API](../../how-to/call-read-api.md)

- [OCR overview](../../overview-ocr.md)
- The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/ComputerVision/ComputerVisionQuickstart.js).
