---
title: "Quickstart: Detect anomalies as a batch using the Anomaly Detector REST API and Python"
titleSuffix: Azure Cognitive Services
description: Use the Anomaly Detector API to detect abnormalities in your data series either as a batch or on streaming data.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: anomaly-detector
ms.topic: quickstart
ms.date: 03/26/2019
ms.author: aahi
---

# Quickstart: Detect anomalies in your time series data using the Anomaly Detector REST API and Python

Use this quickstart to start using the Anomaly Detector API's two detection modes to detect anomalies in your time series data. This Python application sends two API requests containing JSON-formatted time series data, and gets the responses.

| API request                                        | Application output                                                                                                                         |
|----------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| Detect anomalies as a batch                        | The JSON response containing the anomaly status (and other data) for each data point in the time series data, and the positions of any detected anomalies. |
| Detect the anomaly status of the latest data point | The JSON response containing the anomaly status (and other data) for the latest data point in the time series data.                                                                                                                                         |

 While this application is written in Python, the API is a RESTful web service compatible with most programming languages.

## Prerequisites

- [Python 2.x or 3.x](https://www.python.org/downloads/)

- The [Requests library](http://docs.python-requests.org) for python

- A JSON file containing time series data points. The example data for this quickstart can be found on [GitHub](https://github.com/Azure-Samples/anomalydetector/blob/master/example-data/request-data.json).

[!INCLUDE [cognitive-services-anomaly-detector-data-requirements](../../../../includes/cognitive-services-anomaly-detector-data-requirements.md)]

[!INCLUDE [cognitive-services-anomaly-detector-signup-requirements](../../../../includes/cognitive-services-anomaly-detector-signup-requirements.md)]


## Create a new application

1. In your favorite text editor or IDE, create a new python file. Add the following imports.

    ```python
    import requests
    import json
    ```

2. Create variables for your subscription key and your endpoint. Below are the URIs you can use for anomaly detection. These will be appended to your service endpoint later to create the API request URLs.

    |Detection method  |URI  |
    |---------|---------|
    |Batch detection    | `/anomalydetector/v1.0/timeseries/entire/detect`        |
    |Detection on the latest data point     | `/anomalydetector/v1.0/timeseries/last/detect`        |

    ```python
    batch_detection_url = "/anomalydetector/v1.0/timeseries/entire/detect"
    latest_point_detection_url = "/anomalydetector/v1.0/timeseries/last/detect"

    endpoint = "[YOUR_ENDPOINT_URL]"
    subscription_key = "[YOUR_SUBSCRIPTION_KEY]"
    data_location = "[PATH_TO_TIME_SERIES_DATA]"
    ```

3. Read in the JSON data file by opening it, and using `json.load()`.

    ```python
    file_handler = open(data_location)
    json_data = json.load(file_handler)
    ```

## Create a function to send requests

1. Create a new function called `send_request()` that takes the variables created above. Then perform the following steps.

2. Create a dictionary for the request headers. Set the `Content-Type` to `application/json`, and add your subscription key to the `Ocp-Apim-Subscription-Key` header.

3. Send the request using `requests.post()`. Combine your endpoint and anomaly detection URL for the full request URL, and include your headers, and json request data. And then return the response.

```python
def send_request(endpoint, url, subscription_key, request_data):
    headers = {'Content-Type': 'application/json',
               'Ocp-Apim-Subscription-Key': subscription_key}
    response = requests.post(
        endpoint+url, data=json.dumps(request_data), headers=headers)
    return json.loads(response.content.decode("utf-8"))
```

## Detect anomalies as a batch

1. Create a method called `detect_batch()` to detect anomalies throughout the data as a batch. Call the `send_request()` method created above with your endpoint, url, subscription key, and json data.

2. Call `json.dumps()` on the result to format it, and print it to the console.

3. If the response contains `code` field, print the error code and error message.

4. Otherwise, find the positions of anomalies in the data set. The response's `isAnomaly` field contains a boolean value relating to whether a given data point is an anomaly. Iterate through the list, and print the index of any `True` values. These values correspond to the index of anomalous data points, if any were found.

```python
def detect_batch(request_data):
    print("Detecting anomalies as a batch")
    result = send_request(endpoint, batch_detection_url,
                          subscription_key, request_data)
    print(json.dumps(result, indent=4))

    if result.get('code') != None:
        print("Detection failed. ErrorCode:{}, ErrorMessage:{}".format(
            result['code'], result['message']))
    else:
        # Find and display the positions of anomalies in the data set
        anomalies = result["isAnomaly"]
        print("Anomalies detected in the following data positions:")
        for x in range(len(anomalies)):
            if anomalies[x] == True:
                print(x)
```

## Detect the anomaly status of the latest data point

1. Create a method called `detect_latest()` to determine if the latest data point in your time series is an anomaly. Call the `send_request()` method above with your endpoint, url, subscription key, and json data. 

2. Call `json.dumps()` on the result to format it, and print it to the console.

```python
def detect_latest(request_data):
    print("Determining if latest data point is an anomaly")
    # send the request, and print the JSON result
    result = send_request(endpoint, latest_point_detection_url,
                          subscription_key, request_data)
    print(json.dumps(result, indent=4))
```

## Load your time series data and send the request

1. Load your JSON time series data opening a file handler, and using `json.load()` on it. Then call the anomaly detection methods created above.

```python
file_handler = open(data_location)
json_data = json.load(file_handler)

detect_batch(json_data)
detect_latest(json_data)
```

### Example response

A successful response is returned in JSON format. Click the links below to view the JSON response on GitHub:
* [Example batch detection response](https://github.com/Azure-Samples/anomalydetector/blob/master/example-data/batch-response.json)
* [Example latest point detection response](https://github.com/Azure-Samples/anomalydetector/blob/master/example-data/latest-point-response.json)

## Next steps

> [!div class="nextstepaction"]
> [REST API reference](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyDetector/operations/post-timeseries-entire-detect)
