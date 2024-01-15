---
title: "Quickstart: Image Analysis 4.0 client SDK for Node.js"
description: Get started with the Image Analysis 4.0 client SDK for Node.js with this quickstart
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-vision
ms.topic: include
ms.date: 01/15/2024
ms.author: pafarley
---

<a name="HOLTop"></a>

Use the Image Analysis client SDK for JavaScript to analyze an image to read text and generate an image caption. This quickstart analyzes a remote image and prints the results to the console.

[Reference documentation](https://aka.ms/azsdk/image-analysis/ref-docs/js) | [Package (npm)](https://aka.ms/azsdk/image-analysis/package/npm) | [Samples](https://aka.ms/azsdk/image-analysis/samples/js)

> [!TIP]
> The Analysis 4.0 API can do many different operations. See the [Analyze Image how-to guide](../../how-to/call-analyze-image-40.md) for examples that showcase all of the available features.

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The current version of [Node.js](https://nodejs.org/)
* The current version of Edge, Chrome, Firefox, or Safari internet browser.
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="create a Vision resource"  target="_blank">create a Vision resource</a> in the Azure portal to get your key and endpoint. In order to use the captioning feature in this quickstart, you must create your resource in one of the supported Azure regions (see [Image captions](/azure/ai-services/computer-vision/concept-describe-images-40) for the list of regions). After it deploys, select **Go to resource**.
    * You need the key and endpoint from the resource you create to connect your application to the Azure AI Vision service.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.


[!INCLUDE [create environment variables](../environment-variables.md)]


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

1. Install the client library

    Install `@azure-rest/ai-vision-image-analysis` npm package:

    ```console
    npm install @azure-rest/ai-vision-image-analysis
    ```

    Also install the async module:

    ```console
    npm install async
    ```

    Your app's `package.json` file will be updated with the dependencies.

    Create a new file, *index.js*. 

1. Open *index.js* in a text editor and paste in the following code.

   [!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/4-0/quickstart.js?name=snippet_single)]

1. Run the application with the `node` command on your quickstart file.

   ```console
   node index.js
   ```

<!-- tbd output-->


## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

In this quickstart, you learned how to install the Image Analysis client library and make basic image analysis calls. Next, learn more about the Analyze API features.

> [!div class="nextstepaction"]
>[Call the Analyze API](../../how-to/call-analyze-image.md)

* [Image Analysis overview](../../overview-image-analysis.md)
* The source code for this sample can be found on [GitHub](https://aka.ms/azsdk/image-analysis/samples/js).
