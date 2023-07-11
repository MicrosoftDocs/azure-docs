---
title: "Face JavaScript client library quickstart"
description: Use the Face client library for JavaScript to detect and identify faces (facial recognition search).
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: face-api
ms.topic: include
ms.date: 05/03/2022
ms.author: pafarley
---

Get started with facial recognition using the Face client library for JavaScript. Follow these steps to install the package and try out the example code for basic tasks. The Face service provides you with access to advanced algorithms for detecting and recognizing human faces in images. Follow these steps to install the package and try out the example code for basic face identification using remote images.

[Reference documentation](/javascript/api/overview/azure/cognitiveservices-face-readme) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/cognitiveservices/cognitiveservices-face) | [Package (npm)](https://www.npmjs.com/package/@azure/cognitiveservices-face) | [Samples](/samples/browse/?products=azure&term=face&languages=javascript)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The latest version of [Node.js](https://nodejs.org/en/)
* [!INCLUDE [contributor-requirement](../../../includes/quickstarts/contributor-requirement.md)]
* Once you have your Azure subscription, [Create a Face resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesFace) in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
    * You'll need the key and endpoint from the resource you create to connect your application to the Face API.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.



[!INCLUDE [create environment variables](../environment-variables.md)]


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

1. Install the `ms-rest-azure` and `azure-cognitiveservices-face` npm packages:

    ```console
    npm install @azure/cognitiveservices-face @azure/ms-rest-js uuid
    ```

    Your app's `package.json` file is updated with the dependencies.

1. Create a file named `index.js`, open it in a text editor, and paste in the following code:

    > [!NOTE]
    > If you haven't received access to the Face service using the [intake form](https://aka.ms/facerecognition), some of these functions won't work.

    :::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart-single.js" id="snippet_single":::

1. Run the application with the `node` command on your quickstart file.

    ```console
    node index.js
    ```



## Output

```console
========IDENTIFY FACES========

Creating a person group with ID: c08484e0-044b-4610-8b7e-c957584e5d2d
Adding faces to person group...
Create a persongroup person: Family1-Dad.
Create a persongroup person: Family1-Mom.
Create a persongroup person: Family2-Lady.
Create a persongroup person: Family1-Son.
Create a persongroup person: Family1-Daughter.
Create a persongroup person: Family2-Man.
Add face to the person group person: (Family1-Son) from image: Family1-Son2.jpg.
Add face to the person group person: (Family1-Dad) from image: Family1-Dad2.jpg.
Add face to the person group person: (Family1-Mom) from image: Family1-Mom1.jpg.
Add face to the person group person: (Family2-Man) from image: Family2-Man1.jpg.
Add face to the person group person: (Family1-Son) from image: Family1-Son1.jpg.
Add face to the person group person: (Family2-Lady) from image: Family2-Lady2.jpg.
Add face to the person group person: (Family1-Mom) from image: Family1-Mom2.jpg.
Add face to the person group person: (Family1-Dad) from image: Family1-Dad1.jpg.
Add face to the person group person: (Family2-Man) from image: Family2-Man2.jpg.
Add face to the person group person: (Family2-Lady) from image: Family2-Lady1.jpg.
Done adding faces to person group.

Training person group: c08484e0-044b-4610-8b7e-c957584e5d2d.
Waiting 10 seconds...
Training status: succeeded.

Person: Family1-Mom is identified for face in: identification1.jpg with ID: b7f7f542-c338-4a40-ad52-e61772bc6e14. Confidence: 0.96921.
Person: Family1-Son is identified for face in: identification1.jpg with ID: 600dc1b4-b2c4-4516-87de-edbbdd8d7632. Confidence: 0.92886.
Person: Family1-Dad is identified for face in: identification1.jpg with ID: e83b494f-9ad2-473f-9d86-3de79c01e345. Confidence: 0.96725.
```


## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

In this quickstart, you learned how to use the Face client library for JavaScript to do basic face identification. Next, learn about the different face detection models and how to specify the right model for your use case.

> [!div class="nextstepaction"]
> [Specify a face detection model version](../../how-to/specify-detection-model.md)

* [What is the Face service?](../../overview.md)
* More extensive sample code can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/Face/sdk_quickstart.js).
