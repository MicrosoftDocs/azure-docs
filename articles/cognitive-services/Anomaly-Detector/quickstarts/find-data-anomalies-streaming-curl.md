---
title: Find time series anomalies in batch  - cURL - Anomaly Finder - Microsoft Cognitive Services | Microsoft Docs
description: Get information and code samples to help you quickly get started using Java and the Anomaly Finder in Cognitive Services.
services: cognitive-services
author: siji
manager: bix

ms.service: cognitive-services
ms.technology: anomaly-detection
ms.topic: article
ms.date: 05/01/2018
ms.author: kefre
---

# Detect latest point anomaly status  - cURL - Anomaly Finder

This article provides information and code samples to help you get started using the Anomaly Finder API. With the [Detect latest point anomaly status](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyFinderV2/operations/post-timeseries-last-detect) method, you can detect latest point anomaly status.


## Prerequisites

- You must have [cURL](https://curl.haxx.se/windows).

[!INCLUDE [cognitive-services-anomaly-detector-signup-requirements](../../../../includes/cognitive-services-anomaly-detector-signup-requirements.md)]

## Detect latest point anomaly status

### Example of time series data

To see the time series data used in the example click [here](../includes/request.md).

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
A successful response is returned in JSON. Click [here](../includes/response-latest.md) to see the response from the example.

## Next steps

> [REST API reference](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyFinderV2/operations/post-timeseries-last-detect)
