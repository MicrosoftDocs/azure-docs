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

Create a file named `index.js` and import the following libraries:

[!code-csharp[Const statements](~/cognitive-services-quickstart-code/javascript/AnomalyDetector/anomaly_detector_quickstart.js?name=const-statements)]

Create variables for your resource's Azure endpoint and key. If you created the environment variable after you launched the application, you will need to close and reopen the editor, IDE, or shell running it to access the variable. Then create a ApiKeyCredentials object to contain the key.

[!code-csharp[Const statements](~/cognitive-services-quickstart-code/javascript/AnomalyDetector/anomaly_detector_quickstart.js?name=vars)]

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

Instantiate a AnomalyDetectorClient object with your endpoint and credentials.

```javascript
[!code-csharp[Const statements](~/cognitive-services-quickstart-code/javascript/AnomalyDetector/anomaly_detector_quickstart.js?name=authentication)]
```


## Detect anomalies in the entire data set 

Call the API to detect anomalies through the entire time series data using the client's [entire_detect()](https://docs.microsoft.com/python/api/azure-cognitiveservices-anomalydetector/azure.cognitiveservices.anomalydetector.anomalydetectorclient?view=azure-python#entire-detect-body--custom-headers-none--raw-false----operation-config-) method. Store the returned [EntireDetectResponse](https://docs.microsoft.com/python/api/azure-cognitiveservices-anomalydetector/azure.cognitiveservices.anomalydetector.models.entiredetectresponse?view=azure-python) object. Iterate through the response's `is_anomaly` list, and print the index of any `true` values. These values correspond to the index of anomalous data points, if any were found.

[!code-python[Batch anomaly detection sample](~/samples-anomaly-detector/quickstarts/sdk/python-sdk-sample.py?name=detectAnomaliesBatch)]

## Detect the anomaly status of the latest data point

Call the Anomaly Detector API to determine if your latest data point is an anomaly using the client's [last_detect()](https://docs.microsoft.com/python/api/azure-cognitiveservices-anomalydetector/azure.cognitiveservices.anomalydetector.anomalydetectorclient?view=azure-python#last-detect-body--custom-headers-none--raw-false----operation-config-) method, and store the returned [LastDetectResponse](https://docs.microsoft.com/python/api/azure-cognitiveservices-anomalydetector/azure.cognitiveservices.anomalydetector.models.lastdetectresponse?view=azure-python) object. The response's `is_anomaly` value is a boolean that specifies that point's anomaly status.  

[!code-python[Batch anomaly detection sample](~/samples-anomaly-detector/quickstarts/sdk/python-sdk-sample.py?name=latestPointDetection)]


    
## Example task 1

Example: Create a new method to read in the data and add it to a [Request](https://docs.microsoft.com/dotnet/) object as an array of [Points](https://docs.microsoft.com/dotnet/). Send the request with the [send()](https://docs.microsoft.com/dotnet/) method

```javascript
```

<!-- 
    If this code sample is in a function, tell the reader to call it. For example:

    Call the `example()` function.

-->

## Example task 2

Example: Create a new method to read in the data and add it to a [Request](https://docs.microsoft.com/dotnet/) object as an array of [Points](https://docs.microsoft.com/dotnet/). Send the request with the [send()](https://docs.microsoft.com/dotnet/) method

```javascript
```

<!-- 
    If this code sample is in a function, tell the reader to call it. For example:

    Call the `example()` function.

-->

## Run the application

Run the application with the `node` command on your quickstart file.

```console
node index.js
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Troubleshooting

<!--
    This section is optional. If you know of areas that people commonly run into trouble, help them resolve those issues in this section
-->

## Next steps

> [!div class="nextstepaction"]
>[Next article]()

* [What is the [Product Name] API?](../overview.md)
* [Article2](../overview.md)
* [Article3](../overview.md)
* The source code for this sample can be found on [GitHub]().