---
author: areddish
ms.author: areddish
ms.service: azure-ai-custom-vision
ms.date: 10/26/2020
ms.custom:
ms.topic: include
---

This guide provides instructions and sample code to help you get started using the Custom Vision client library for Node.js to build an object detection model. You'll create a project, add tags, train the project, and use the project's prediction endpoint URL to programmatically test it. Use this example as a template for building your own image recognition app.

> [!NOTE]
> If you want to build and train an object detection model _without_ writing code, see the [browser-based guidance](../../get-started-build-detector.md) instead.

Use the Custom Vision client library for .NET to:

* Create a new Custom Vision project
* Add tags to the project
* Upload and tag images
* Train the project
* Publish the current iteration
* Test the prediction endpoint

Reference documentation [(training)](/javascript/api/@azure/cognitiveservices-customvision-training/) [(prediction)](/javascript/api/@azure/cognitiveservices-customvision-prediction/) | Library source code [(training)](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/cognitiveservices/cognitiveservices-customvision-training) [(prediction)](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/cognitiveservices/cognitiveservices-customvision-prediction) | Package (npm) [(training)](https://www.npmjs.com/package/@azure/cognitiveservices-customvision-training) [(prediction)](https://www.npmjs.com/package/@azure/cognitiveservices-customvision-prediction) | [Samples](/samples/browse/?products=azure&terms=custom%20vision&languages=javascript)


## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The current version of [Node.js](https://nodejs.org/)
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesCustomVision"  title="Create a Custom Vision resource"  target="_blank">create a Custom Vision resource </a> in the Azure portal to create a training and prediction resource.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

[!INCLUDE [create environment variables](../environment-variables.md)]

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

To write an image analysis app with Custom Vision for Node.js, you'll need the Custom Vision NPM packages. To install them, run the following command in PowerShell:

```shell
npm install @azure/cognitiveservices-customvision-training
npm install @azure/cognitiveservices-customvision-prediction
```

Your app's `package.json` file will be updated with the dependencies.

Create a file named `index.js` and import the following libraries:

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/CustomVision/ObjectDetection/CustomVisionQuickstart.js?name=snippet_imports)]

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/CustomVision/ObjectDetection/CustomVisionQuickstart.js), which contains the code examples in this quickstart.

Create variables for your resource's Azure endpoint and keys. 

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/CustomVision/ObjectDetection/CustomVisionQuickstart.js?name=snippet_creds)]

Also add fields for your project name and a timeout parameter for asynchronous calls.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/CustomVision/ObjectDetection/CustomVisionQuickstart.js?name=snippet_vars)]

## Object model

|Name|Description|
|---|---|
|[TrainingAPIClient](/javascript/api/@azure/cognitiveservices-customvision-training/trainingapiclient) | This class handles the creation, training, and publishing of your models. |
|[PredictionAPIClient](/javascript/api/@azure/cognitiveservices-customvision-prediction/predictionapiclient)| This class handles the querying of your models for object detection predictions.|
|[Prediction](/javascript/api/@azure/cognitiveservices-customvision-prediction/)| This interface defines a single prediction on a single image. It includes properties for the object ID and name, and a confidence score.|

## Code examples

These code snippets show you how to do the following tasks with the Custom Vision client library for JavaScript:

* [Authenticate the client](#authenticate-the-client)
* [Create a new Custom Vision project](#create-a-new-custom-vision-project)
* [Add tags to the project](#add-tags-to-the-project)
* [Upload and tag images](#upload-and-tag-images)
* [Train the project](#train-the-project)
* [Publish the current iteration](#publish-the-current-iteration)
* [Test the prediction endpoint](#test-the-prediction-endpoint)

## Authenticate the client

Instantiate client objects with your endpoint and key. Create an **ApiKeyCredentials** object with your key, and use it with your endpoint to create a [TrainingAPIClient](/javascript/api/@azure/cognitiveservices-customvision-training/trainingapiclient) and [PredictionAPIClient](/javascript/api/@azure/cognitiveservices-customvision-prediction/predictionapiclient) object.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/CustomVision/ObjectDetection/CustomVisionQuickstart.js?name=snippet_auth)]

## Add helper function

Add the following function to help make multiple asynchronous calls. You'll use this later on.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/CustomVision/ObjectDetection/CustomVisionQuickstart.js?name=snippet_auth)]

## Create a new Custom Vision project

Start a new function to contain all of your Custom Vision function calls. Add the following code to create a new Custom Vision service project.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/CustomVision/ObjectDetection/CustomVisionQuickstart.js?name=snippet_create)]

## Add tags to the project

To create classification tags to your project, add the following code to your function:

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/CustomVision/ObjectDetection/CustomVisionQuickstart.js?name=snippet_tags)]

## Upload and tag images

First, download the sample images for this project. Save the contents of the [sample Images folder](https://github.com/Azure-Samples/cognitive-services-sample-data-files/tree/master/CustomVision/ObjectDetection/Images) to your local device.

To add the sample images to the project, insert the following code after the tag creation. This code uploads each image with its corresponding tag. When you tag images in object detection projects, you need to specify the region of each tagged object using normalized coordinates. For this tutorial, the regions are hardcoded inline with the code. The regions specify the bounding box in normalized coordinates, and the coordinates are given in the order: left, top, width, height. You can upload up to 64 images in a single batch.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/CustomVision/ObjectDetection/CustomVisionQuickstart.js?name=snippet_upload)]


> [!IMPORTANT]
> You'll need to change the path to the images (`sampleDataRoot`) based on where you downloaded the Azure AI services Python SDK Samples repo.

> [!NOTE]
> If you don't have a click-and-drag utility to mark the coordinates of regions, you can use the web UI at [Customvision.ai](https://www.customvision.ai/). In this example, the coordinates are already provided.


## Train the project

This code creates the first iteration of the prediction model. 

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/CustomVision/ObjectDetection/CustomVisionQuickstart.js?name=snippet_train)]


## Publish the current iteration

This code publishes the trained iteration to the prediction endpoint. The name given to the published iteration can be used to send prediction requests. An iteration is not available in the prediction endpoint until it is published.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/CustomVision/ObjectDetection/CustomVisionQuickstart.js?name=snippet_publish)]


## Test the prediction endpoint

To send an image to the prediction endpoint and retrieve the prediction, add the following code to your function. 

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/CustomVision/ObjectDetection/CustomVisionQuickstart.js?name=snippet_test)]

Then, close your Custom Vision function and call it.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/CustomVision/ObjectDetection/CustomVisionQuickstart.js?name=snippet_function_close)]

## Run the application

Run the application with the `node` command on your quickstart file.

```shell
node index.js
```

The output of the application should appear in the console. You can then verify that the test image (found in **\<sampleDataRoot\>/Test/**) is tagged appropriately and that the region of detection is correct. You can also go back to the [Custom Vision website](https://customvision.ai) and see the current state of your newly created project.

## Clean up resources

[!INCLUDE [clean-od-project](../../includes/clean-od-project.md)]

## Next steps

Now you've done every step of the object detection process in code. This sample executes a single training iteration, but often you'll need to train and test your model multiple times in order to make it more accurate. The following guide deals with image classification, but its principles are similar to object detection.

> [!div class="nextstepaction"]
> [Test and retrain a model](../../test-your-model.md)

* [What is Custom Vision?](../../overview.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/CustomVision/ObjectDetection/CustomVisionQuickstart.js)
* [SDK reference documentation (training)](/javascript/api/@azure/cognitiveservices-customvision-training/)
* [SDK reference documentation (prediction)](/javascript/api/@azure/cognitiveservices-customvision-prediction/)
