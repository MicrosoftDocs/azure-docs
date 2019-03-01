---
title: Determine the anomaly status of your latest data point using the Anomaly Detector REST API and cURL | Microsoft Docs
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

# Determine the anomaly status of your latest data point using the Anomaly Detector REST API and cURL 


This article provides information and code samples to help you get started using the Anomaly Finder API. With the [Detect latest point anomaly status](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyFinderV2/operations/post-timeseries-last-detect) method, you can detect latest point anomaly status.


## Prerequisites

- You must have [cURL](https://curl.haxx.se/windows).

[!INCLUDE [cognitive-services-anomaly-detector-signup-requirements](../../../../includes/cognitive-services-anomaly-detector-signup-requirements.md)]

## Detect latest point anomaly status

### Example of time series data

To see the time series data used in the example click TBD.

### Detect latest point anomaly status example

To run the example, perform the following steps.

1. Replace the `[REPLACE_WITH_YOUR_SUBSCRIPTION_KEY]` value with your valid subscription key.
2. Replace the `[REPLACE_WITH_ENDPOINT]` to use the endpoint you receive.
3. Replace the `[REPLACE_WITH_THE_EXAMPLE_OR_YOUR_OWN_DATA_POINTS]` with the example or your own data points.
4. Execute and check the response.

To detect anomaly against the last point.
```cURL
curl -v POST 'https://[REPLACE_WITH_ENDPOINT]/anomalyfinder/v2.0/timeseries/last/detect' -H 'Content-Type: application/json' -H 'Ocp-Apim-Subscription-Key: [REPLACE_WITH_YOUR_SUBSCRIPTION_KEY]' --data-ascii '[REPLACE_WITH_THE_EXAMPLE_OR_YOUR_OWN_DATA_POINTS]'
```

### Example response
A successful response is returned in JSON. Click TBD to see the response from the example.

## Next steps

> [!div class="nextstepaction"]
> [Visualize anomalies using Python](../tutorials/visualize-anomalies-using-python.md)

> [REST API reference](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyFinderV2/operations/post-timeseries-entire-detect)
