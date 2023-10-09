---
title: Anomaly Detector multivariate JavaScript client library quickstart 
titleSuffix: Azure AI services
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 04/29/2021
ms.author: mbullwin
---

Get started with the Anomaly Detector multivariate client library for JavaScript. Follow these steps to install the package and start using the algorithms provided by the service. The new multivariate anomaly detector APIs enable developers by easily integrating advanced AI for detecting anomalies from groups of metrics, without the need for machine learning knowledge or labeled data. Dependencies and inter-correlations between different signals are automatically counted as key factors. This helps you to proactively protect your complex systems from failures.

Use the Anomaly Detector multivariate client library for JavaScript to:

* Detect system level anomalies from a group of time series.
* When any individual time series won't tell you much, and you have to look at all signals to detect a problem.
* Predicative maintenance of expensive physical assets with tens to hundreds of different types of sensors measuring various aspects of system health.

[Library reference documentation](/javascript/api/overview/azure/ai-anomaly-detector-readme) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/anomalydetector/ai-anomaly-detector-rest) | [Package (npm)](https://www.npmjs.com/package/@azure/ai-anomaly-detector) | [Sample code](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/anomalydetector/ai-anomaly-detector-rest/samples/v1-beta/javascript/sample_multivariate_detection.js)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The current version of [Node.js](https://nodejs.org/)
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector"  title="Create an Anomaly Detector resource"  target="_blank">create an Anomaly Detector resource </a> in the Azure portal to get your key and endpoint. Wait for it to deploy and select the **Go to resource** button.
    * You'll need the key and endpoint from the resource you create to connect your application to the Anomaly Detector API. You'll paste your key and endpoint into the code below later in the quickstart.
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

> [!NOTE]
> You will always have the option of using one of two keys. This is to allow secure key rotation. For the purposes of this quickstart use the first key. 
   

```javascript
const apiKey = "YOUR_API_KEY";
const endpoint = "YOUR_ENDPOINT";
const data_source = "YOUR_SAMPLE_ZIP_FILE_LOCATED_IN_AZURE_BLOB_STORAGE_WITH_SAS";
```

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md). See the Azure AI services [security](../../../security-features.md) article for more information.

To use the Anomaly Detector multivariate APIs, you need to first train your own models. Training data is a set of multiple time series that meet the following requirements:

Each time series should be a CSV file with two (and only two) columns, "timestamp" and "value" (all in lowercase) as the header row. The "timestamp" values should conform to ISO 8601; the "value" could be integers or decimals with any number of decimal places. For example:

|timestamp | value|
|-------|-------|
|2019-04-01T00:00:00Z| 5|
|2019-04-01T00:01:00Z| 3.6|
|2019-04-01T00:02:00Z| 4|
|`...`| `...` |

Each CSV file should be named after a different variable that will be used for model training. For example, "temperature.csv" and "humidity.csv". All the CSV files should be zipped into one zip file without any subfolders. The zip file can have whatever name you want. The zip file should be uploaded to Azure Blob storage. Once you generate the blob SAS (Shared access signatures) URL for the zip file, it can be used for training. Refer to this document for how to generate SAS URLs from Azure Blob Storage.

### Install the client library

Install the `ms-rest-azure` and `azure-ai-anomalydetector` NPM packages. The csv-parse library is also used in this quickstart:

```console
npm install @azure/ai-anomaly-detector csv-parse
```

Your app's `package.json` file is updated with the dependencies.

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
const client = new AnomalyDetectorClient(endpoint, new AzureKeyCredential(apiKey));
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

You pass your model request to the Anomaly Detector client `trainMultivariateModel` method.

```javascript
console.log("Training a new model...")
const train_response = await client.trainMultivariateModel(Modelrequest)
const model_id = train_response.location?.split("/").pop() ?? ""
console.log("New model ID: " + model_id)
```

To check if training of your model is complete you can track the model's status:

```javascript
let model_response = await client.getMultivariateModel(model_id);
let model_status = model_response.modelInfo.status;

while (model_status != 'READY' && model_status != 'FAILED'){
  await sleep(10000).then(() => {});
  model_response = await client.getMultivariateModel(model_id);
  model_status = model_response.modelInfo.status;
}

if (model_status == 'FAILED') {
  console.log("Training failed.\nErrors:");
  for (let error of model_response.modelInfo?.errors ?? []) {
    console.log("Error code: " + error.code + ". Message: " + error.message);
  }
}

console.log("TRAINING FINISHED.");
```

## Detect anomalies

Use the `detectAnomaly` and `getDectectionResult` functions to determine if there are any anomalies within your datasource.

```javascript
console.log("Start detecting...");
const detect_request = {
  source: data_source,
  startTime: new Date(2021,0,2,12,0,0),
  endTime: new Date(2021,0,3,0,0,0)
};
const result_header = await client.detectAnomaly(model_id, detect_request);
const result_id = result_header.location?.split("/").pop() ?? "";
let result = await client.getDetectionResult(result_id);
let result_status = result.summary.status;

while (result_status != 'READY' && result_status != 'FAILED'){
  await sleep(2000).then(() => {});
  result = await client.getDetectionResult(result_id);
  result_status = result.summary.status;
}

if (result_status == 'FAILED') {
  console.log("Detection failed.\nErrors:");
  for (let error of result.summary.errors ?? []) {
    console.log("Error code: " + error.code + ". Message: " + error.message)
  }
}
console.log("Result status: " + result_status);
console.log("Result Id: " + result.resultId);
```

## Export model

> [!NOTE]
> The export command is intended to be used to allow running Anomaly Detector multivariate models in a containerized environment. This is not currently not supported for multivariate, but support will be added in the future.

To export your trained model use the `exportModel` function.

```javascript
const export_result = await client.exportModel(model_id)
const model_path = "model.zip"
const destination = fs.createWriteStream(model_path)
export_result.readableStreamBody?.pipe(destination)
console.log("New model has been exported to "+model_path+".")
```

## Delete model

To delete an existing model that is available to the current resource use the `deleteMultivariateModel` function.

```javascript
client.deleteMultivariateModel(model_id)
console.log("New model has been deleted.")
```

## Run the application

Before running the application it can be helpful to check your code against the [full sample code](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/anomalydetector/ai-anomaly-detector-rest/samples/v1-beta/javascript/sample_multivariate_detection.js)

Run the application with the `node` command on your quickstart file.

```console
node index.js
```

## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with the resource group.

* [Portal](../../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* [What is the Anomaly Detector API?](../../overview.md)
* [Best practices when using the Anomaly Detector API.](../../concepts/best-practices-multivariate.md)
