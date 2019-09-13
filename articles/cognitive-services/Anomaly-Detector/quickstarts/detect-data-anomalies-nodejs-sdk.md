---
title: "Quickstart: Detect data anomalies using the Anomaly Detector client library for Python"
titleSuffix: Azure Cognitive Services
description: Use the Anomaly Detector API to detect abnormalities in your data series either as a batch or on streaming data.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: anomaly-detector
ms.topic: quickstart
ms.date: 09/12/2019
ms.author: aahi
---

# Quickstart: Anomaly Detector client library for Node.js

Get started with the Anomaly Detector client library for Node.js. Follow these steps to install the package and try out the example code for basic tasks. The Anomaly Detector service enables you to find abnormalities in your time series data by automatically using the best-fitting models on it, regardless of industry, scenario, or data volume.

Use the Anomaly Detector client library for Node.js to:

* Detect anomalies throughout your time series dataset, as a batch request
* Detect the anomaly status of the latest data point in your time series

[Reference documentation](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-anomalydetector/?view=azure-node-latest) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/AnomalyDetector) | [Package (npm)](https://www.npmjs.com/package/@azure/cognitiveservices-anomalydetector) | [Samples](https://github.com/Azure-Samples/anomalydetector)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* The current version of [Node.js](https://nodejs.org/)

## Setting up

### Create an Anomaly Detector Azure resource

Azure Cognitive Services are represented by Azure resources that you subscribe to. Create a resource for [Product name] using the [Azure portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) or [Azure CLI](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account-cli) on your local machine. You can also:

* Get a [trial key](https://azure.microsoft.com/try/cognitive-services/#decision) valid for 7 days for free. After signing up it will be available on the [Azure website](https://azure.microsoft.com/try/cognitive-services/my-apis/).  
* View your resource on the [Azure Portal](https://portal.azure.com/).

<!-- rename TBD_KEY to something meaningful for your service, like TEXT_ANALYTICS_KEY -->
After you get a key from your trial subscription or resource, [create an environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the key, named `ANOMALY_DETECTOR_KEY`.
 
### Create a new Node.js application

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it. 

```console
mkdir myapp && cd myapp
```

Run the `npm init` command to create a node application with a `package.json` file. 

```console
npm init
```

Install the csv-parse library.

```console
npm i csv-parse
``` 

Create a file named `index.js` and import the following libraries:

[!code-javascript[Import statements](~/cognitive-services-quickstart-code/javascript/AnomalyDetector/anomaly_detector_quickstart.js?name=imports)]

Create variables for your resource's Azure endpoint and key. If you created the environment variable after you launched the application, you will need to close and reopen the editor, IDE, or shell running it to access the variable. Then create a ApiKeyCredentials object to contain the key.

[!code-javascript[Initial variables](~/cognitive-services-quickstart-code/javascript/AnomalyDetector/anomaly_detector_quickstart.js?name=vars)]

### Install the client library

Install the `ms-rest-azure` and `azure-cognitiveservices-anomalydetector` NPM packages:

```console
npm install  @azure/cognitiveservices-anomalydetector ms-rest-azure
```

Your app's `package.json` file will be updated with the dependencies.

## Object model

<!-- 
    Briefly introduce and describe the functionality of the library's main classes. Include links to their reference pages.

    Explain the object hierarchy and how the classes work together to manipulate resources in the service.
-->

## Code examples 

These code snippets show you how to do the following with the Anomaly Detector client library for Node.js:

* [Authenticate the client](#authenticate-the-client)
* [Load a time series data set from a file](#load-time-series-data-from-a-file)
* [Detect anomalies in the entire data set](#detect-anomalies-in-the-entire-data-set) 
* [Detect the anomaly status of the latest data point](#detect-the-anomaly-status-of-the-latest-data-point)

## Authenticate the client

> [!NOTE]
> This quickstart assumes you've [created an environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for your Anomaly Detector key, named `ANOMALY_DETECTOR_KEY`.

Instantiate a [AnomalyDetectorClient](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-anomalydetector/anomalydetectorclient?view=azure-node-latest) object with your endpoint and credentials.

[!code-javascript[Authentication](~/cognitive-services-quickstart-code/javascript/AnomalyDetector/anomaly_detector_quickstart.js?name=authentication)]

## Load time series data from a file

Download the example data for this quickstart from [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/AnomalyDetector/request-data.csv):
1. In your browser, right-click **Raw**.
2. Click **Save link as**.
3. Save the file to your application directory, as a .csv file.

This time series data is formatted as a .csv file, and will be sent to the Anomaly Detector API.

Read your data file with the csv-parse library's `readFileSync()` method, and parse the file with `parse()`. For each line, push a [Point](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-anomalydetector/point?view=azure-node-latest) object containing the timestamp, and the numeric value.

[!code-javascript[Read the data file](~/cognitive-services-quickstart-code/javascript/AnomalyDetector/anomaly_detector_quickstart.js?name=readFile)]

## Detect anomalies in the entire data set 

Call the API to detect anomalies through the entire time series as a batch with the client's [entireDetect()](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-anomalydetector/anomalydetectorclient?view=azure-node-latest#entiredetect-request--msrest-requestoptionsbase-) method. Store the returned [EntireDetectResponse](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-anomalydetector/entiredetectresponse?view=azure-node-latest) object. Iterate through the response's `isAnomaly` list, and print the index of any `true` values. These values correspond to the index of anomalous data points, if any were found.

[!code-javascript[Batch detection function](~/cognitive-services-quickstart-code/javascript/AnomalyDetector/anomaly_detector_quickstart.js?name=batchCall)]

## Detect the anomaly status of the latest data point

Call the Anomaly Detector API to determine if your latest data point is an anomaly using the client's [lastDetect()](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-anomalydetector/anomalydetectorclient?view=azure-node-latest#lastdetect-request--msrest-requestoptionsbase-) method, and store the returned [LastDetectResponse](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-anomalydetector/lastdetectresponse?view=azure-node-latest) object. The response's `isAnomaly` value is a boolean that specifies that point's anomaly status.  

[!code-javascript[Last point detection function](~/cognitive-services-quickstart-code/javascript/AnomalyDetector/anomaly_detector_quickstart.js?name=lastDetection)]

## Run the application

Run the application with the `node` command on your quickstart file.

```console
node index.js
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

> [!div class="nextstepaction"]
>[Streaming anomaly detection with Azure Databricks](../tutorials/anomaly-detection-streaming-databricks.md)

* What is the [Anomaly Detector API?](../overview.md)
* [Best practices](../concepts/anomaly-detection-best-practices.md) when using the Anomaly Detector API.
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/AnomalyDetector/blob/master/quickstarts/sdk/csharp-sdk-sample.cs).
