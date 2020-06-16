---
title: "Quickstart: Detect anomalies as a batch using the Anomaly Detector REST API and Python"
titleSuffix: Azure Cognitive Services
description: Use the Anomaly Detector API to detect abnormalities in your data series either as a batch or on streaming data in this quickstart.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: anomaly-detector
ms.topic: quickstart
ms.date: 03/24/2020
ms.author: aahi
ms.custom: tracking-python
---

# Quickstart: Detect anomalies in your time series data using the Anomaly Detector REST API and Python

Use this quickstart to start using the Anomaly Detector API's two detection modes to detect anomalies in your time series data. This Python application sends two API requests containing JSON-formatted time series data, and gets the responses.

| API request                                        | Application output                                                                                                                         |
|----------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| Detect anomalies as a batch                        | The JSON response containing the anomaly status (and other data) for each data point in the time series data, and the positions of any detected anomalies. |
| Detect the anomaly status of the latest data point | The JSON response containing the anomaly status (and other data) for the latest data point in the time series data.                                                                                                                                         |

 While this application is written in Python, the API is a RESTful web service compatible with most programming languages. You can find the source code for this quickstart on [GitHub](https://github.com/Azure-Samples/AnomalyDetector/blob/master/quickstarts/python-detect-anomalies.py).

## Prerequisites

- [Python 2.x or 3.x](https://www.python.org/downloads/)
- An Anomaly detector key and endpoint
- The [Requests library](https://pypi.org/project/requests/) for python

- A JSON file containing time series data points. The example data for this quickstart can be found on [GitHub](https://github.com/Azure-Samples/anomalydetector/blob/master/example-data/request-data.json).

### Create an Anomaly Detector resource

[!INCLUDE [anomaly-detector-resource-creation](../../../../includes/cognitive-services-anomaly-detector-resource-cli.md)]


## Create a new application

1. Create a new python file and add the following imports.

    [!code-python[import statements](~/samples-anomaly-detector/quickstarts/python-detect-anomalies.py?name=imports)]

2. Create variables for your subscription key and your endpoint. Below are the URIs you can use for anomaly detection. These will be appended to your service endpoint later to create the API request URLs.

    |Detection method  |URI  |
    |---------|---------|
    |Batch detection    | `/anomalydetector/v1.0/timeseries/entire/detect`        |
    |Detection on the latest data point     | `/anomalydetector/v1.0/timeseries/last/detect`        |

    [!code-python[initial endpoint and key variables](~/samples-anomaly-detector/quickstarts/python-detect-anomalies.py?name=vars)]

3. Read in the JSON data file by opening it, and using `json.load()`.

    [!code-python[Open JSON file and read in the data](~/samples-anomaly-detector/quickstarts/python-detect-anomalies.py?name=fileLoad)]

## Create a function to send requests

1. Create a new function called `send_request()` that takes the variables created above. Then perform the following steps.

2. Create a dictionary for the request headers. Set the `Content-Type` to `application/json`, and add your subscription key to the `Ocp-Apim-Subscription-Key` header.

3. Send the request using `requests.post()`. Combine your endpoint and anomaly detection URL for the full request URL, and include your headers, and json request data. And then return the response.

    [!code-python[request method](~/samples-anomaly-detector/quickstarts/python-detect-anomalies.py?name=request)]

## Detect anomalies as a batch

1. Create a method called `detect_batch()` to detect anomalies throughout the data as a batch. Call the `send_request()` method created above with your endpoint, url, subscription key, and json data.

2. Call `json.dumps()` on the result to format it, and print it to the console.

3. If the response contains `code` field, print the error code and error message.

4. Otherwise, find the positions of anomalies in the data set. The response's `isAnomaly` field contains a boolean value relating to whether a given data point is an anomaly. Iterate through the list, and print the index of any `True` values. These values correspond to the index of anomalous data points, if any were found.

    [!code-python[detection as a batch](~/samples-anomaly-detector/quickstarts/python-detect-anomalies.py?name=detectBatch)]

## Detect the anomaly status of the latest data point

1. Create a method called `detect_latest()` to determine if the latest data point in your time series is an anomaly. Call the `send_request()` method above with your endpoint, url, subscription key, and json data. 

2. Call `json.dumps()` on the result to format it, and print it to the console.

    [!code-python[Latest point detection](~/samples-anomaly-detector/quickstarts/python-detect-anomalies.py?name=detectLatest)]

## Send the request

Call the anomaly detection methods created above.

[!code-python[Method calls](~/samples-anomaly-detector/quickstarts/python-detect-anomalies.py?name=methodCalls)]

### Example response

A successful response is returned in JSON format. Click the links below to view the JSON response on GitHub:
* [Example batch detection response](https://github.com/Azure-Samples/anomalydetector/blob/master/example-data/batch-response.json)
* [Example latest point detection response](https://github.com/Azure-Samples/anomalydetector/blob/master/example-data/latest-point-response.json)

[!INCLUDE [anomaly-detector-next-steps](../includes/quickstart-cleanup-next-steps.md)]
