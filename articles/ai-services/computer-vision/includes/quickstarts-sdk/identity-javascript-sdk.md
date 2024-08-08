---
title: "Face JavaScript client library quickstart"
description: Use the Face client library for JavaScript to detect and identify faces (facial recognition search).
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-vision
ms.subservice: azure-ai-face
ms.custom:
  - ignite-2023
ms.topic: include
ms.date: 05/03/2022
ms.author: pafarley
---

Get started with facial recognition using the Face client library for JavaScript. Follow these steps to install the package and try out the example code for basic tasks. The Face service provides you with access to advanced algorithms for detecting and recognizing human faces in images. Follow these steps to install the package and try out the example code for basic face identification using remote images.

[Reference documentation](https://aka.ms/azsdk-javascript-face-ref) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/face/ai-vision-face-rest) | [Package (npm)](https://www.npmjs.com/package/@azure-rest/ai-vision-face) | [Samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/face/ai-vision-face-rest/samples)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The latest version of [Node.js](https://nodejs.org/en/)
* Once you have your Azure subscription, [Create a Face resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesFace) in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
    * You'll need the key and endpoint from the resource you create to connect your application to the Face API.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.


## Create environment variables

[!INCLUDE [create environment variables](../face-environment-variables.md)]


## Identify and verify faces

1. Create a new Node.js application

    In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it. 

    ```console
    mkdir myapp && cd myapp
    ```

    Run the `npm init` command to create a node application with a `package.json` file. 

    ```console
    npm init
    ```

1. Install the `@azure-rest/ai-vision-face` npm packages:

    ```console
    npm install @azure-rest/ai-vision-face
    ```

    Your app's `package.json` file is updated with the dependencies.

1. Create a file named `index.js`, open it in a text editor, and paste in the following code:

    > [!NOTE]
    > If you haven't received access to the Face service using the [intake form](https://aka.ms/facerecognition), some of these functions won't work.

    :::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/Quickstart.js" id="snippet_single":::

1. Run the application with the `node` command on your quickstart file.

    ```console
    node index.js
    ```



## Output

```console
========IDENTIFY FACES========

Creating a person group with ID: a230ac8b-09b2-4fa0-ae04-d76356d88d9f
Adding faces to person group...
Create a persongroup person: Family1-Dad
Create a persongroup person: Family1-Mom
Create a persongroup person: Family1-Son
Add face to the person group person: (Family1-Dad) from image: (Family1-Dad1.jpg)
Add face to the person group person: (Family1-Mom) from image: (Family1-Mom1.jpg)
Add face to the person group person: (Family1-Son) from image: (Family1-Son1.jpg)
Add face to the person group person: (Family1-Dad) from image: (Family1-Dad2.jpg)
Add face to the person group person: (Family1-Mom) from image: (Family1-Mom2.jpg)
Add face to the person group person: (Family1-Son) from image: (Family1-Son2.jpg)
Done adding faces to person group.

Training person group: a230ac8b-09b2-4fa0-ae04-d76356d88d9f
Training status: succeeded
Pausing for 60 seconds to avoid triggering rate limit on free account...
No persons identified for face with ID 56380623-8bf0-414a-b9d9-c2373386b7be
Person: Family1-Dad is identified for face in: identification1.jpg with ID: c45052eb-a910-4fd3-b1c3-f91ccccc316a. Confidence: 0.96807
Person: Family1-Son is identified for face in: identification1.jpg with ID: 8dce9b50-513f-4fe2-9e19-352acfd622b3. Confidence: 0.9281
Person: Family1-Mom is identified for face in: identification1.jpg with ID: 75868da3-66f6-4b5f-a172-0b619f4d74c1. Confidence: 0.96902
Verification result between face c45052eb-a910-4fd3-b1c3-f91ccccc316a and person 35a58d14-fd58-4146-9669-82ed664da357: true with confidence: 0.96807
Verification result between face 8dce9b50-513f-4fe2-9e19-352acfd622b3 and person 2d4d196c-5349-431c-bf0c-f1d7aaa180ba: true with confidence: 0.9281
Verification result between face 75868da3-66f6-4b5f-a172-0b619f4d74c1 and person 35d5de9e-5f92-4552-8907-0d0aac889c3e: true with confidence: 0.96902

Deleting person group: a230ac8b-09b2-4fa0-ae04-d76356d88d9f

Done.
```


## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Azure portal](../../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

In this quickstart, you learned how to use the Face client library for JavaScript to do basic face identification. Next, learn about the different face detection models and how to specify the right model for your use case.

> [!div class="nextstepaction"]
> [Specify a face detection model version](../../how-to/specify-detection-model.md)

* [What is the Face service?](../../overview-identity.md)
* More extensive sample code can be found on [GitHub](https://aka.ms/FaceSamples).
