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

Get started with the Anomaly Detector multivariate client library for JavaScript. Follow these steps to install the package start using the algorithms provided by the service. The new multivariate anomaly detection APIs enable developers by easily integrating advanced AI for detecting anomalies from groups of metrics, without the need for machine learning knowledge or labeled data. Dependencies and inter-correlations between different signals are automatically counted as key factors. This helps you to proactively protect your complex systems from failures.

Use the Anomaly Detector multivariate client library for JavaScript to:

* Detect system level anomalies from a group of time series.
* When any individual time series won't tell you much and you have to look at all signals to detect a problem.
* Predicative maintenance of expensive physical assets with tens to hundreds of different types of sensors measuring various aspects of system health.

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

 To use the Anomaly Detector multivariate APIs, we need to train our own model before using detection. Data used for training is a batch of time series, each time series should be in CSV format with two columns, timestamp and value. All of the time series should be zipped into one zip file and be uploaded to [Azure Blob storage](../../../storage/blobs/storage-blobs-introduction.md#blobs). By default the file name will be used to represent the variable for the time series. Alternatively, an extra meta.json file can be included in the zip file if you wish the name of the variable to be different from the .zip file name. Once we generate [blob SAS (Shared access signatures) URL](../../../storage/common/storage-sas-overview.md), we can use the url to the zip file for training.

### Install the client library

Install the `ms-rest-azure` and `azure-ai-anomalydetector` NPM packages. The csv-parse library is also used in this quickstart:

```console
npm install @azure/ai-anomaly-detector @azure/ms-rest-js csv-parse
```

Your app's `package.json` file will be updated with the dependencies.

## Code examples

These code snippets show you how to do the following with the Anomaly Detector client library for Node.js:

* [Authenticate the client](#authenticate-the-client)
* [Load a time series data set from a file](#load-time-series-data-from-a-file)
* [Detect anomalies in the entire data set](#detect-anomalies-in-the-entire-data-set) 
* [Detect the anomaly status of the latest data point](#detect-the-anomaly-status-of-the-latest-data-point)
* [Detect the change points in the data set](#detect-change-points-in-the-data-set)

## Authenticate the client

Instantiate a `AnomalyDetectorClient` object with your endpoint and credentials.

```javascript
const client = new AnomalyDetectorClient(endpoint, new AzureKeyCredential(apiKey)).client;
```


## Run the application

Run the application with the `node` command on your quickstart file.

```console
node index.js
```

[!INCLUDE [anomaly-detector-next-steps](../quickstart-cleanup-next-steps.md)]
