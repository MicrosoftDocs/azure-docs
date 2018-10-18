--- 
title: How to use the Anomaly Finder API with Python - Microsoft Cognitive Services | Microsoft Docs
description: Get information and code samples to help you quickly get started using Anomaly Finder with Python in Cognitive Services.
services: cognitive-services
author: chliang
manager: bix

ms.service: cognitive-services
ms.technology: anomaly-detection
ms.topic: article
ms.date: 05/01/2018
ms.author: chliang
---

# Use the Anomaly Finder API with Python

[!INCLUDE [PrivatePreviewNote](../../../../../includes/cognitive-services-anomaly-finder-private-preview-note.md)]

This article provides information and code samples to help you quickly get started using the Anomaly Finder API with Python to accomplish task of getting anomaly result for time series data.

## Prerequisites

[!INCLUDE [GetSubscriptionKey](../includes/get-subscription-key.md)]

## Getting anomaly points with Anomaly Finder API using Python 

[!INCLUDE [DataContract](../includes/datacontract.md)]

### Example of time series data

The example of the time series data points is as follows.

[!INCLUDE [Request](../includes/request.md)]

### Analyze data and get anomaly points Python example

Make sure you have installed python3, then create a python executable file named detect.py. In detect.py, you should include the code below. 
Before executing the code, remember to replace the `[YOUR_SUBSCRIPTION_KEY]` value with your valid subscription key.
Replace the `[REPLACE_WITH_THE_EXAMPLE_OR_YOUR_OWN_DATA_POINTS]` with your data points.

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
endpont = "https://api.labs.cognitive.microsoft.com/anomalyfinder/v1.0/anomalydetection"
subscription_key = "[YOUR_SUBSCRIPTION_KEY]"

result = detect(endpont, subscription_key, sample_data)
print(result)

```

### Example response

A successful response is returned in JSON. Sample response is as follows.
[!INCLUDE [Response](../includes/response.md)]

## Next steps

> [!div class="nextstepaction"]
> [Python app](../tutorials/python-tutorial.md)
