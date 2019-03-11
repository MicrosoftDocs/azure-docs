---
title: Find anomalies as a batch using the Anomaly Finder REST API and Python | Microsoft Docs
description: Use the Anomaly Detector API to detect abnormalities in your data series as a batch.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: anomaly-detection
ms.topic: article
ms.date: 03/01/2019
ms.author: aahi
---

# Find anomalies as a batch using the Anomaly Finder REST API and Python

Use this quickstart to begin using the Anomaly Detector API to find anomalies in your time series data as a batch of data points. This Python application sends a batch JSON-formatted data points to the API, and gets the response. The API will generate and apply a statistical model to the data set, and each point is analyzed with the same model. While this application is written in Python, the API is a RESTful Web service compatible with most programming languages.

## Prerequisites

- [Python 2.x or 3.x](https://www.python.org/downloads/)

- The [Requests library](http://docs.python-requests.org) for python

[!INCLUDE [cognitive-services-anomaly-detector-data-requirements](../../../../includes/cognitive-services-anomaly-detector-data-requirements.md)]

[!INCLUDE [cognitive-services-anomaly-detector-signup-requirements](../../../../includes/cognitive-services-anomaly-detector-signup-requirements.md)]

## Create a new application

1. In your favorite text editor or IDE, create a new python file. Add the following imports.

    ```python
    import requests
    import json
    ```

2. Create variables for your subscription key, and your endpoint. To detect anomalies in a batch of data points, use the URL `anomalyfinder/v2.0/timeseries/entire/detect`. Then create a string with a path to the JSON formatted time series data.

    ```python
    batch_detection_url = "anomalyfinder/v2.0/timeseries/entire/detect"
    endpoint = "[YOUR_ENDPOINT_URL]"
    subscription_key = "[YOUR_SUBSCRIPTION_KEY]"
    data_location = "[PATH_TO_TIME_SERIES_DATA]"
    ```

3. Read in the JSON data file by opening it, and using `json.load()`. 

    ```python
    file_handler = open(data_location)
    json_data = json.load(file_handler)
    ```

## Create a client to send requests

1. Create a new async function called `send_request()` that takes the variables created above. Then perform the following steps.

2. create a dictionary for the request headers. Set the `Content-Type` to `application/json`, and add your subscription key to the `Ocp-Apim-Subscription-Key` header.

3. send the request using `requests.post()`. Combine your endpoint and anomaly detection URL for the full request URL, and include your headers, and json request data. 

4. If the request is successful, return the response.  
    
    ```python
    def send_request(endpoint, url, subscription_key, request_data):
        headers = {'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': subscription_key}
        response = requests.post(endpoint+url, data=json.dumps(request_data), headers=headers)
        if response.status_code == 200:
            return json.loads(response.content.decode("utf-8"))
        else:
            print(response.status_code)
            raise Exception(response.text)
    ```

## Send the API request and read the response

1. Call the `send_request()` method above with yoru endpoint, url, subscprition key, and json data. Call `json.dumps()` on the result to format it, and print it to the console.

    ```python
    result = send_request(endpoint, batch_detection_url, subscription_key, json_data)
    print(json.dumps(result, indent=4))
    ```

2. Find the positions of anomalies in the data set. The response's `IsAnomaly` field contains a boolean value relating to whether a given data point is an anomaly. Iterate through the list, and print the index of any `true` values. These values correspond to the index of anomalous data points, if any were found.

    ```python
    anomalies = result["IsAnomaly"]
    
    print("Anomalies found in the following data positions:")
    
    for x in range(len(anomalies)):
        if anomalies[x] == True:
            print (x)
    ```

### Example response

A successful response is returned in JSON. Click TBD to see the response from the example.

## Next steps

> [!div class="nextstepaction"]
> [Visualize anomalies using Python](../tutorials/visualize-anomalies-using-python.md)

> [REST API reference](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyFinderV2/operations/post-timeseries-entire-detect)

[Find time series anomalies in batch](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyFinderV2/operations/post-timeseries-entire-detect) 
