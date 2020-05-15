---
title: "Quickstart: Detect anomalies in your time series data using the Anomaly Detector REST API and Java"
titleSuffix: Azure Cognitive Services
description: Learn how to use the Anomaly Detector API to detect abnormalities in your data series either as a batch or on streaming data.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: anomaly-detector
ms.topic: quickstart
ms.date: 03/24/2020
ms.author: aahi
---

# Quickstart: Detect anomalies in your time series data using the Anomaly Detector REST API and Java

Use this quickstart to start using the Anomaly Detector API's two detection modes to detect anomalies in your time series data. This Java application sends two API requests containing JSON-formatted time series data, and gets the responses.

| API request                                        | Application output                                                                                                                         |
|----------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| Detect anomalies as a batch                        | The JSON response containing the anomaly status (and other data) for each data point in the time series data, and the positions of any detected anomalies. |
| Detect the anomaly status of the latest data point | The JSON response containing the anomaly status (and other data) for the latest data point in the time series data.                                                                                                                                         |

 While this application is written in Java, the API is a RESTful web service compatible with most programming languages. You can find the source code for this quickstart on [GitHub](https://github.com/Azure-Samples/AnomalyDetector/blob/master/quickstarts/java-detect-anomalies.java).

## Prerequisites

- The [Java&trade; Development Kit(JDK) 7](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) or later.
- An Anomaly detector key and endpoint
- Import these libraries from the Maven Repository
    - [JSON in Java](https://mvnrepository.com/artifact/org.json/json) package
    - [Apache HttpClient](https://mvnrepository.com/artifact/org.apache.httpcomponents/httpclient) package

- A JSON file containing time series data points. The example data for this quickstart can be found on [GitHub](https://github.com/Azure-Samples/anomalydetector/blob/master/example-data/request-data.json).

### Create an Anomaly Detector resource

[!INCLUDE [anomaly-detector-resource-creation](../../../../includes/cognitive-services-anomaly-detector-resource-cli.md)]

## Create a new application

1. Create a new Java project and import the following libraries.
    
    [!code-java[Import statements](~/samples-anomaly-detector/quickstarts/java-detect-anomalies.java?name=imports)]

2. Create variables for your subscription key and your endpoint. Below are the URIs you can use for anomaly detection. These will be appended to your service endpoint later to create the API request URLs.

    |Detection method  |URI  |
    |---------|---------|
    |Batch detection    | `/anomalydetector/v1.0/timeseries/entire/detect`        |
    |Detection on the latest data point     | `/anomalydetector/v1.0/timeseries/last/detect`        |

    [!code-java[Initial key and endpoint variables](~/samples-anomaly-detector/quickstarts/java-detect-anomalies.java?name=vars)]

## Create a function to send requests

1. Create a new function called `sendRequest()` that takes the variables created above. Then perform the following steps.

2. Create a `CloseableHttpClient` object that can send requests to the API. Send the request to an `HttpPost` request object by combining your endpoint, and an Anomaly Detector URL.

3. Use the request's `setHeader()` function to set the `Content-Type` header to `application/json`, and add your subscription key to the `Ocp-Apim-Subscription-Key` header.

4. Use the request's `setEntity()` function to the data to be sent.

5. Use the client's `execute()` function to send the request, and save it to a `CloseableHttpResponse` object.

6. Create an `HttpEntity` object to store the response content. Get the content with `getEntity()`. If the response isn't empty, return it.

    [!code-java[API request method](~/samples-anomaly-detector/quickstarts/java-detect-anomalies.java?name=request)]

## Detect anomalies as a batch

1. Create a method called `detectAnomaliesBatch()` to detect anomalies throughout the data as a batch. Call the `sendRequest()` method created above with your endpoint, url, subscription key, and json data. Get the result, and print it to the console.

2. If the response contains `code` field, print the error code and error message.

3. Otherwise, find the positions of anomalies in the data set. The response's `isAnomaly` field contains a boolean value relating to whether a given data point is an anomaly. Get the JSON array, and iterate through it, printing the index of any `true` values. These values correspond to the index of anomalous data points, if any were found.

    [!code-java[Method for batch detection](~/samples-anomaly-detector/quickstarts/java-detect-anomalies.java?name=detectBatch)]

## Detect the anomaly status of the latest data point

Create a method called `detectAnomaliesLatest()` to detect the anomaly status of the last data point in the data set. Call the `sendRequest()` method created above with your endpoint, url, subscription key, and json data. Get the result, and print it to the console.

[!code-java[Latest point detection method](~/samples-anomaly-detector/quickstarts/java-detect-anomalies.java?name=detectLatest)]

## Load your time series data and send the request

1. In the main method of your application, read in the JSON file containing the data that will be added to the requests.

2. Call the two anomaly detection functions created above.

    [!code-java[Main method](~/samples-anomaly-detector/quickstarts/java-detect-anomalies.java?name=main)]

### Example response

A successful response is returned in JSON format. Click the links below to view the JSON response on GitHub:
* [Example batch detection response](https://github.com/Azure-Samples/anomalydetector/blob/master/example-data/batch-response.json)
* [Example latest point detection response](https://github.com/Azure-Samples/anomalydetector/blob/master/example-data/latest-point-response.json)

[!INCLUDE [anomaly-detector-next-steps](../includes/quickstart-cleanup-next-steps.md)]
