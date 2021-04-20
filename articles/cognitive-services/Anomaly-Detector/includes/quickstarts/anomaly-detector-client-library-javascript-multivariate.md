---
title: Anomaly Detector multivariate JavaScript client library quickstart 
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 04/06/2021
ms.author: mbullwin
---

Get started with the Anomaly Detector multivariate client library for JavaScript. Follow these steps to install the package and start using the algorithms provided by the service. The new multivariate anomaly detection APIs enable developers by easily integrating advanced AI for detecting anomalies from groups of metrics, without the need for machine learning knowledge or labeled data. Dependencies and inter-correlations between different signals are automatically counted as key factors. This helps you to proactively protect your complex systems from failures.

Use the Anomaly Detector multivariate client library for JavaScript to:

* Detect system level anomalies from a group of time series.
* When any individual time series won't tell you much and you have to look at all signals to detect a problem.
* Predicative maintenance of expensive physical assets with tens to hundreds of different types of sensors measuring various aspects of system health.

[Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/anomalydetector/ai-anomaly-detector) | [Package (npm)](https://www.npmjs.com/package/@azure/ai-anomaly-detector)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The current version of [Node.js](https://nodejs.org/)
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector"  title="Create an Anomaly Detector resource"  target="_blank">create an Anomaly Detector resource </a> in the Azure portal to get your key and endpoint. Wait for it to deploy and click the **Go to resource** button.
    * You will need the key and endpoint from the resource you create to connect your application to the Anomaly Detector API. You'll paste your key and endpoint into the code below later in the quickstart.
    You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

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

Create a file named `index.js` and import the following libraries:
`
```javascript
'use strict'

const fs = require('fs');
const parse = require("csv-parse/lib/sync");
const { AnomalyDetectorClient } = require('@azure/ai-anomaly-detector');
const { AzureKeyCredential } = require('@azure/core-auth');
```

Create variables your resource's Azure endpoint and key. Create another variable for the example data file.

```javascript
const apiKey = "YOUR_API_KEY";
const endpoint = "YOUR_ENDPOINT";
const data_source = "YOUR_SAMPLE_ZIP_FILE_LOCATED_IN_AZURE_BLOB_STORAGE_WITH_SAS";
```

 To use the Anomaly Detector multivariate APIs, we need to train our own model before using detection. Data used for training is a batch of time series, each time series should be in CSV format with two columns, timestamp and value. All of the time series should be zipped into one zip file and be uploaded to [Azure Blob storage](../../../../storage/blobs/storage-blobs-introduction.md). By default the file name will be used to represent the variable for the time series. Alternatively, an extra meta.json file can be included in the zip file if you wish the name of the variable to be different from the .zip file name. Once we generate [blob SAS (Shared access signatures) URL](../../../../storage/common/storage-sas-overview.md), we can use the url to the zip file for training.

### Install the client library

Install the `ms-rest-azure` and `azure-ai-anomalydetector` NPM packages. The csv-parse library is also used in this quickstart:

```console
npm install @azure/ai-anomaly-detector @azure/ms-rest-js csv-parse
```

Your app's `package.json` file will be updated with the dependencies.

## Code examples

These code snippets show you how to do the following with the Anomaly Detector client library for Node.js:

* [Authenticate the client](#authenticate-the-client)
* [Train a model](#train-a-model)
* [Detect anomalies](#detect-anomalies)
* [Export model](#export-model)
* [Delete model](#delete-model)

## Authenticate the client

Instantiate a `AnomalyDetectorClient` object with your endpoint and credentials.

```javascript
const client = new AnomalyDetectorClient(endpoint, new AzureKeyCredential(apiKey)).client;
```

## Train a model

### Construct a model result

First we need to construct a model request. Make sure that start and end time align with your data source.

```javascript
const Modelrequest = {
      source: data_source,
      startTime: new Date(2021,0,1,0,0,0),
      endTime: new Date(2021,0,2,12,0,0),
      slidingWindow:200
    };    
```

### Train a new model

You will need to pass your model request to the Anomaly Detector client `trainMultivariateModel` method.

```javascript
console.log("Training a new model...")
var train_response = await client.trainMultivariateModel(Modelrequest)
var model_id = train_response.location.split("/").pop()
console.log("New model ID: " + model_id)
```

To check if training of your model is complete you can track the model's status:

```javascript
var model_response = await client.getMultivariateModel(model_id)
var model_status = model_response.modelInfo.status

while (model_status != 'READY'){
    await sleep(10000).then(() => {});
    var model_response = await client.getMultivariateModel(model_id)
    var model_status = model_response.modelInfo.status
}

console.log("TRAINING FINISHED.")
```

## Detect anomalies

Use the `detectAnomaly` and `getDectectionResult` functions to determine if there are any anomalies within your datasource.

```javascript
console.log("Start detecting...")
const detect_request = {
    source: data_source,
    startTime: new Date(2021,0,2,12,0,0),
    endTime: new Date(2021,0,3,0,0,0)
};
const result_header = await client.detectAnomaly(model_id, detect_request)
const result_id = result_header.location.split("/").pop()
var result = await client.getDetectionResult(result_id)
var result_status = result.summary.status

while (result_status != 'READY'){
    await sleep(2000).then(() => {});
    var result = await client.getDetectionResult(result_id)
    var result_status = result.summary.status
}
```

## Export model

To export your trained model use the `exportModel` function.

```javascript
const export_result = await client.exportModel(model_id)
const model_path = "model.zip"
const destination = fs.createWriteStream(model_path)
export_result.readableStreamBody.pipe(destination)
console.log("New model has been exported to "+model_path+".")
```

## Delete model

To delete an existing model that is available to the current resource use the `deleteMultivariateModel` function.

```javascript
client.deleteMultivariateModel(model_id)
console.log("New model has been deleted.")
```

## Run the application

Run the application with the `node` command on your quickstart file.

```console
node index.js
```

## Next steps

* [Anomaly Detector multivariate best practices](../../concepts/best-practices-multivariate.md)
