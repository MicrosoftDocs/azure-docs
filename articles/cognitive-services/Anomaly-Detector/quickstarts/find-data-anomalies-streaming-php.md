---
title: Detect latest point anomaly status  - PHP - Anomaly Finder - Microsoft Cognitive Services | Microsoft Docs
description: Get information and code samples to help you quickly get started using Anomaly Finder with PHP in Cognitive Services.
services: cognitive-services
author: chliang
manager: bix

ms.service: cognitive-services
ms.technology: anomaly-detection
ms.topic: article
ms.date: 05/01/2018
ms.author: chliang
---

# Detect latest point anomaly status  - PHP - Anomaly Finder

This article provides information and code samples to help you get started using the Anomaly Finder API. With the [Detect latest point anomaly status](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyFinderV2/operations/post-timeseries-last-detect) method, you can detect latest point anomaly status.


## Prerequisites

- You must have [PHP](https://secure.php.net/downloads.php) installed.

- You must have a subscription key, refer to [Obtaining Subscription Keys](../How-to/get-subscription-key.md).

## Detect latest point anomaly status

### Example of time series data

To see the time series data used in the example click [here](../includes/request.md).

### Detect latest point anomaly status example

To run the example, perform the following steps.

1. Replace the `[YOUR_SUBSCRIPTION_KEY]` value with your valid subscription key.
2. Replace the `[REPLACE_WITH_ENDPOINT]` to use the endpoint you receive.
3. Replace the `[REPLACE_WITH_THE_EXAMPLE_OR_YOUR_OWN_DATA_POINTS]` with the example or your own data points.
4. Execute and check the response.

```PHP
<?php
$detect_last_url = 'https://[REPLACE_WITH_ENDPOINT]/anomalyfinder/v2.0/timeseries/last/detect';

$requestData = '[REPLACE_WITH_THE_EXAMPLE_OR_YOUR_OWN_DATA_POINTS]';
$subscription_key = '[REPLACE_WITH_YOUR_SUBSCRIPTION_KEY]';

$headers = array(
    'http' => array(
        'header'  => "Content-type: application/json\r\n".
                     "Ocp-Apim-Subscription-Key: {$subscription_key}\r\n",
        'method'  => 'POST',
        'content' => $requestData
    )
);

# Detect anomaly against the last point 
try
{
    $context  = stream_context_create($headers);
    $result = file_get_contents($detect_last_url, false, $context);
    if ($result === FALSE) { /* Handle error */ }
	
    var_dump($result);
}
catch (Exception $ex)
{
    echo $ex;
}

?>
```

### Example response

A successful response is returned in JSON. Click [here](../includes/response-latest.md) to see the response from the example.

## Next steps

> [REST API reference](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyFinderV2/operations/post-timeseries-last-detect)
