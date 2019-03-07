---
title: Determine the anomaly status of your latest data point using the Anomaly Detector REST API and Python | Microsoft Docs
description: Use your past data points from your time series to determine if later ones are anomalies.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: anomaly-detection
ms.topic: article
ms.date: 03/01/2019
ms.author: aahi
---

# Determine the anomaly status of your latest data point using the Anomaly Detector REST API and Python


This article provides information and code samples to help you get started using the Anomaly Finder API. With the [Detect latest point anomaly status](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyFinderV2/operations/post-timeseries-last-detect) method, you can detect latest point anomaly status.


## Prerequisites

- You must have [Python](https://www.python.org/downloads/) installed if you want to run the sample locally.

[!INCLUDE [cognitive-services-anomaly-detector-data-requirements](../../../../../includes/cognitive-services-anomaly-detector-data-requirements.md)]

[!INCLUDE [cognitive-services-anomaly-detector-signup-requirements](../../../../../includes/cognitive-services-anomaly-detector-signup-requirements.md)]

## Detect latest point anomaly status

### Example of time series data

To see the time series data used in the example click TBD.

### Detect latest point anomaly status example

To run the example, perform the following steps.

1. Make sure you have installed python3, then create a python executable file named detect.py. In detect.py, you should include the code below. 
2. Replace the `[YOUR_SUBSCRIPTION_KEY]` value with your valid subscription key.
3. Replace the `[REPLACE_WITH_ENDPOINT]` to use the endpoint you receive.
4. Replace the `[REPLACE_WITH_THE_EXAMPLE_OR_YOUR_OWN_DATA_POINTS]` with your data points.


```python
import requests
import json


def detect(url, subscription_key, request_data):
    headers = {'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': subscription_key}
    response = requests.post(url, data=json.dumps(request_data), headers=headers)
    if response.status_code == 200:
        return json.loads(response.content.decode("utf-8"))
    else:
        print(response.status_code)
        raise Exception(response.text)


sample_data = "[REPLACE_WITH_THE_EXAMPLE_OR_YOUR_OWN_DATA_POINTS]"
endpoint = "https://[REPLACE_WITH_ENDPOINT]/anomalyfinder/v2.0/timeseries/last/detect"
subscription_key = "[YOUR_SUBSCRIPTION_KEY]"

result = detect(endpoint, subscription_key, sample_data)
print(result)

```

### Example response

A successful response is returned in JSON. Click TBD to see the response from the example.

## Next steps

> [!div class="nextstepaction"]
> [Visualize anomalies using Python](../tutorials/visualize-anomalies-using-python.md)

> [REST API reference](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyFinderV2/operations/post-timeseries-entire-detect)
