---
title: Find time series anomalies in batch  - Ruby - Anomaly Finder - Microsoft Cognitive Services | Microsoft Docs
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

# Detect latest point anomaly status  - Ruby - Anomaly Finder

This article provides information and code samples to help you get started using the Anomaly Finder API. With the [Detect latest point anomaly status](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyFinderV2/operations/post-timeseries-last-detect) method, you can detect latest point anomaly status.


## Prerequisites

- You must have [Ruby](https://www.ruby-lang.org/en/downloads/) 2.4.x or later installed.

[!INCLUDE [cognitive-services-anomaly-detector-signup-requirements](../../../../includes/cognitive-services-anomaly-detector-signup-requirements.md)]

## Detect latest point anomaly status

### Example of time series data

To see the time series data used in the example click [here](../includes/request.md).

### Detect latest point anomaly status example

To run the example, perform the following steps.

1. Save below code as a.rb file. (Below code is tested under Ruby 2.5.0)
2. Replace the `[REPLACE_WITH_YOUR_SUBSCRIPTION_KEY]` value with your valid subscription key.
3. Replace the `[REPLACE_WITH_ENDPOINT]` to use the endpoint you receive.
4. Replace the `[REPLACE_WITH_THE_EXAMPLE_OR_YOUR_OWN_DATA_POINTS]` with the example or your own data points.
5. Execute and check the response.

```ruby
require 'net/http'

subscription_key = '[REPLACE_WITH_YOUR_SUBSCRIPTION_KEY]'

uri_detect_last = URI('https://[REPLACE_WITH_ENDPOINT]/anomalyfinder/v2.0/timeseries/last/detect')

request_data = '[REPLACE_WITH_THE_EXAMPLE_OR_YOUR_OWN_DATA_POINTS]'

#
# Detect anomaly against the last point
request_detect_last = Net::HTTP::Post.new(uri_detect_last)
request_detect_last.content_type = 'application/json'
request_detect_last.body = request_data
request_detect_last['Ocp-Apim-Subscription-Key'] = subscription_key

response_detect_last = Net::HTTP.start(uri_detect_last.hostname, uri_detect_last.port, :use_ssl => true) do |http|
  http.request(request_detect_last)
end
print response_detect_last.body

#
# Detect anomaly against the entire series
request_detect_entire = Net::HTTP::Post.new(uri_detect_entire)
request_detect_entire.content_type = 'application/json'
request_detect_entire.body = request_data
request_detect_entire['Ocp-Apim-Subscription-Key'] = subscription_key

response_detect_entire = Net::HTTP.start(uri_detect_entire.hostname, uri_detect_entire.port, :use_ssl => true) do |http|
  http.request(request_detect_entire)
end
print response_detect_entire.body
```

### Example response

A successful response is returned in JSON. Click [here](../includes/response-latest.md) to see the response from the example.

## Next steps

> [REST API reference](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyFinderV2/operations/post-timeseries-last-detect)
