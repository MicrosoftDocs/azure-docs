---
title: "Quickstart: Create an image classification project with the Custom Vision SDK for Node.js"
titleSuffix: Azure Cognitive Services
description: Create a project, add tags, upload images, train your project, and make a prediction using the Node.js SDK.
services: cognitive-services
author: areddish
manager: daauld

ms.service: cognitive-services
ms.subservice: custom-vision
ms.topic: quickstart
ms.date: 12/05/2019
ms.author: areddish
---

# Quickstart: Create an image classification project with the Custom Vision Node.js SDK

This article shows you how to get started using the Custom Vision SDK with Node.js to build an image classification model. After it's created, you can add tags, upload images, train the project, obtain the project's published prediction endpoint URL, and use the endpoint to programmatically test an image. Use this example as a template for building your own Node.js application. If you wish to go through the process of building and using a classification model _without_ code, see the [browser-based guidance](getting-started-build-a-classifier.md) instead.

## Prerequisites

- [Node.js 8](https://www.nodejs.org/en/download/) or later installed.
- [npm](https://www.npmjs.com/) installed.
- [!INCLUDE [create-resources](includes/create-resources.md)]

## Install the Custom Vision SDK

To install the Custom Vision service SDK for Node.js, run the following command in PowerShell:

```shell
npm install @azure/cognitiveservices-customvision-training
npm install @azure/cognitiveservices-customvision-prediction
```

[!INCLUDE [get-keys](includes/get-keys.md)]

[!INCLUDE [node-get-images](includes/node-get-images.md)]

## Add the code

Create a new file called *sample.js* in your preferred project directory.

### Create the Custom Vision service project

Add the following code to your script to create a new Custom Vision service project. Insert your subscription keys in the appropriate definitions and set the sampleDataRoot path value to your image folder path. Make sure the endPoint value matches the training and prediction endpoints you have created at [Customvision.ai](https://www.customvision.ai/). Note that the difference between creating an object detection and image classification project is the domain specified in the **createProject** call.

```javascript
const util = require('util');
const fs = require('fs');
const TrainingApiClient = require("@azure/cognitiveservices-customvision-training");
const PredictionApiClient = require("@azure/cognitiveservices-customvision-prediction");

const setTimeoutPromise = util.promisify(setTimeout);

const trainingKey = "<your training key>";
const predictionKey = "<your prediction key>";
const predictionResourceId = "<your prediction resource id>";
const sampleDataRoot = "<path to image files>";

const endPoint = "https://<my-resource-name>.cognitiveservices.azure.com/"

const publishIterationName = "classifyModel";

const trainer = new TrainingApiClient(trainingKey, endPoint);

(async () => {
    console.log("Creating project...");
    const sampleProject = await trainer.createProject("Sample Project")
```

### Create tags in the project

To create classification tags to your project, add the following code to the end of *sample.js*:

```javascript
const hemlockTag = await trainer.createTag(sampleProject.id, "Hemlock");
const cherryTag = await trainer.createTag(sampleProject.id, "Japanese Cherry");
```

### Upload and tag images

To add the sample images to the project, insert the following code after the tag creation. This code uploads each image with its corresponding tag. You can upload up to 64 images in a single batch.

> [!NOTE]
> You'll need to change *sampleDataRoot* to the path to the images based on where you downloaded the Cognitive Services Node.js SDK Samples project earlier.

```javascript
console.log("Adding images...");
let fileUploadPromises = [];

const hemlockDir = `${sampleDataRoot}/Hemlock`;
const hemlockFiles = fs.readdirSync(hemlockDir);
hemlockFiles.forEach(file => {
    fileUploadPromises.push(trainer.createImagesFromData(sampleProject.id, fs.readFileSync(`${hemlockDir}/${file}`), { tagIds: [hemlockTag.id] }));
});

const cherryDir = `${sampleDataRoot}/Japanese Cherry`;
const japaneseCherryFiles = fs.readdirSync(cherryDir);
japaneseCherryFiles.forEach(file => {
    fileUploadPromises.push(trainer.createImagesFromData(sampleProject.id, fs.readFileSync(`${cherryDir}/${file}`), { tagIds: [cherryTag.id] }));
});

await Promise.all(fileUploadPromises);
```

### Train the classifier and publish

This code creates the first iteration of the prediction model and then publishes that iteration to the prediction endpoint. The name given to the published iteration can be used to send prediction requests. An iteration is not available in the prediction endpoint until it is published.

```javascript
console.log("Training...");
let trainingIteration = await trainer.trainProject(sampleProject.id);

// Wait for training to complete
console.log("Training started...");
while (trainingIteration.status == "Training") {
    console.log("Training status: " + trainingIteration.status);
    await setTimeoutPromise(1000, null);
    trainingIteration = await trainer.getIteration(sampleProject.id, trainingIteration.id)
}
console.log("Training status: " + trainingIteration.status);

// Publish the iteration to the end point
await trainer.publishIteration(sampleProject.id, trainingIteration.id, publishIterationName, predictionResourceId);
```

### Get and use the published iteration on the prediction endpoint

To send an image to the prediction endpoint and retrieve the prediction, add the following code to the end of the file:

```javascript
    const predictor = new PredictionApiClient(predictionKey, endPoint);
    const testFile = fs.readFileSync(`${sampleDataRoot}/Test/test_image.jpg`);

    const results = await predictor.classifyImage(sampleProject.id, publishIterationName, testFile);

    // Step 6. Show results
    console.log("Results:");
    results.predictions.forEach(predictedResult => {
        console.log(`\t ${predictedResult.tagName}: ${(predictedResult.probability * 100.0).toFixed(2)}%`);
    });
})()
```

## Run the application

Run *sample.js*.

```shell
node sample.js
```

The output of the application should be similar to the following text:

```console
Creating project...
Adding images...
Training...
Training started...
Training status: Training
Training status: Training
Training status: Training
Training status: Completed
Results:
         Hemlock: 94.97%
         Japanese Cherry: 0.01%
```

You can then verify that the test image (found in **<base_image_url>/Images/Test/**) is tagged appropriately. You can also go back to the [Custom Vision website](https://customvision.ai) and see the current state of your newly created project.

[!INCLUDE [clean-ic-project](includes/clean-ic-project.md)]

## Next steps

Now you have seen how every step of the image classification process can be done in code. This sample executes a single training iteration, but often you will need to train and test your model multiple times in order to make it more accurate.

> [!div class="nextstepaction"]
> [Test and retrain a model](test-your-model.md)
