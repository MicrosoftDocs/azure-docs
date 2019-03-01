---
title: Detect latest point anomaly status  - Javascript - Anomaly Finder - Microsoft Cognitive Services | Microsoft Docs
description: Get information and code samples to help you quickly get started using Anomaly Finder with Javascript in Cognitive Services.
services: cognitive-services
author: chliang
manager: bix

ms.service: cognitive-services
ms.subservice: anomaly-detection
ms.topic: article
ms.date: 05/01/2018
ms.author: chliang
---

# Detect latest point anomaly status  - Javascript - Anomaly Finder

This article provides information and code samples to help you get started using the Anomaly Finder API. With the [Detect latest point anomaly status](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyFinderV2/operations/post-timeseries-last-detect) method, you can detect latest point anomaly status.


## Prerequisites

[!INCLUDE [cognitive-services-anomaly-detector-signup-requirements](../../../../includes/cognitive-services-anomaly-detector-signup-requirements.md)]

## Detect latest point anomaly status

### Example of time series data

To see the time series data used in the example click [here](../includes/request.md).

### Detect latest point anomaly status example

To run the example, perform the following steps.

1. Create a new HTML file.
2. Replace the HTML file with the following code.
3. Replace the `[YOUR_SUBSCRIPTION_KEY]` value with your valid subscription key.
4. Replace the `[REPLACE_WITH_ENDPOINT]` value with your endpoint.
5. Replace the data in requestTextArea with your data points.
6. Open the HTML file in a Web browser and click `Anomaly Finder` button.

```Javascript
<!DOCTYPE html>
<html>
<head>
    <title>Anomaly Finder Javascript Quick Starts</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js"></script>
</head>
<body>
    <script type="text/javascript">
        function detect() {
            // **********************************************
            // *** Update or verify the following values. ***
            // **********************************************
            // Replace the subscriptionKey string value with your valid subscription key.
            var subscriptionKey = "[YOUR_SUBSCRIPTION_KEY]";
            var uriBase = "https://[REPLACE_WITH_ENDPOINT]/anomalyfinder/v2.0/timeseries/last/detect";

            var body = document.getElementById("requestTextArea").value;
            // Perform the REST API call.
            $.ajax({
                url: uriBase,
                // Request headers.
                type: "post",
                url: uriBase,
                headers: {
                    "Content-Type": "application/json",
                    "Ocp-Apim-Subscription-Key": subscriptionKey
                },
                type: "POST",
                // Request body.
                data: body,
                success: (function (data) {
                    // Show formatted JSON on webpage.
                    $("#responseTextArea").val(JSON.stringify(data, null, 2));
                }),
                error: function (request, status, error) {
                    alert(request.responseText);
                }
            });
        };
    </script>

    <h1>Anomaly Finder Javascript Quick Starts:</h1>
    Enter the detection data, then click the <strong>Anomaly Finder</strong> button.

    <button onclick="detect()">Anomaly Finder</button>
    <br><br>
    <div id="wrapper" style="width:1020px; display:table;">
        <div id="imageDiv" style="width:420px; display:table-cell;">
            Request:
            <br><br>
            <textarea id="requestTextArea" class="UIInput" style="width:580px; height:400px;">
                {
                  "Granularity": "daily",
                  "Series": [
                    {
                      "Timestamp": "2018-03-01T00:00:00Z",
                      "Value": 32858923
                    },
                    {
                      "Timestamp": "2018-03-02T00:00:00Z",
                      "Value": 29615278
                    },
                    {
                      "Timestamp": "2018-03-03T00:00:00Z",
                      "Value": 22839355
                    },
                    {
                      "Timestamp": "2018-03-04T00:00:00Z",
                      "Value": 25948736
                    },
                    {
                      "Timestamp": "2018-03-05T00:00:00Z",
                      "Value": 34139159
                    },
                    {
                      "Timestamp": "2018-03-06T00:00:00Z",
                      "Value": 33843985
                    },
                    {
                      "Timestamp": "2018-03-07T00:00:00Z",
                      "Value": 33637661
                    },
                    {
                      "Timestamp": "2018-03-08T00:00:00Z",
                      "Value": 32627350
                    },
                    {
                      "Timestamp": "2018-03-09T00:00:00Z",
                      "Value": 29881076
                    },
                    {
                      "Timestamp": "2018-03-10T00:00:00Z",
                      "Value": 22681575
                    },
                    {
                      "Timestamp": "2018-03-11T00:00:00Z",
                      "Value": 24629393
                    },
                    {
                      "Timestamp": "2018-03-12T00:00:00Z",
                      "Value": 34010679
                    },
                    {
                      "Timestamp": "2018-03-13T00:00:00Z",
                      "Value": 33893888
                    },
                    {
                      "Timestamp": "2018-03-14T00:00:00Z",
                      "Value": 33760076
                    },
                    {
                      "Timestamp": "2018-03-15T00:00:00Z",
                      "Value": 33093515
                    },
                    {
                      "Timestamp": "2018-03-16T00:00:00Z",
                      "Value": 29945555
                    },
                    {
                      "Timestamp": "2018-03-17T00:00:00Z",
                      "Value": 22676212
                    },
                    {
                      "Timestamp": "2018-03-18T00:00:00Z",
                      "Value": 25262514
                    },
                    {
                      "Timestamp": "2018-03-19T00:00:00Z",
                      "Value": 33631649
                    },
                    {
                      "Timestamp": "2018-03-20T00:00:00Z",
                      "Value": 34468310
                    },
                    {
                      "Timestamp": "2018-03-21T00:00:00Z",
                      "Value": 34212281
                    },
                    {
                      "Timestamp": "2018-03-22T00:00:00Z",
                      "Value": 38144434
                    },
                    {
                      "Timestamp": "2018-03-23T00:00:00Z",
                      "Value": 34662949
                    },
                    {
                      "Timestamp": "2018-03-24T00:00:00Z",
                      "Value": 24623684
                    },
                    {
                      "Timestamp": "2018-03-25T00:00:00Z",
                      "Value": 26530491
                    },
                    {
                      "Timestamp": "2018-03-26T00:00:00Z",
                      "Value": 35445003
                    },
                    {
                      "Timestamp": "2018-03-27T00:00:00Z",
                      "Value": 34250789
                    },
                    {
                      "Timestamp": "2018-03-28T00:00:00Z",
                      "Value": 33423012
                    },
                    {
                      "Timestamp": "2018-03-29T00:00:00Z",
                      "Value": 30744783
                    },
                    {
                      "Timestamp": "2018-03-30T00:00:00Z",
                      "Value": 25825128
                    },
                    {
                      "Timestamp": "2018-03-31T00:00:00Z",
                      "Value": 21244209
                    },
                    {
                      "Timestamp": "2018-04-01T00:00:00Z",
                      "Value": 22576956
                    },
                    {
                      "Timestamp": "2018-04-02T00:00:00Z",
                      "Value": 31957221
                    },
                    {
                      "Timestamp": "2018-04-03T00:00:00Z",
                      "Value": 33841228
                    },
                    {
                      "Timestamp": "2018-04-04T00:00:00Z",
                      "Value": 33554483
                    },
                    {
                      "Timestamp": "2018-04-05T00:00:00Z",
                      "Value": 32383350
                    },
                    {
                      "Timestamp": "2018-04-06T00:00:00Z",
                      "Value": 29494850
                    },
                    {
                      "Timestamp": "2018-04-07T00:00:00Z",
                      "Value": 22815534
                    },
                    {
                      "Timestamp": "2018-04-08T00:00:00Z",
                      "Value": 25557267
                    },
                    {
                      "Timestamp": "2018-04-09T00:00:00Z",
                      "Value": 34858252
                    },
                    {
                      "Timestamp": "2018-04-10T00:00:00Z",
                      "Value": 34750597
                    },
                    {
                      "Timestamp": "2018-04-11T00:00:00Z",
                      "Value": 34717956
                    },
                    {
                      "Timestamp": "2018-04-12T00:00:00Z",
                      "Value": 34132534
                    },
                    {
                      "Timestamp": "2018-04-13T00:00:00Z",
                      "Value": 30762236
                    },
                    {
                      "Timestamp": "2018-04-14T00:00:00Z",
                      "Value": 22504059
                    },
                    {
                      "Timestamp": "2018-04-15T00:00:00Z",
                      "Value": 26149060
                    },
                    {
                      "Timestamp": "2018-04-16T00:00:00Z",
                      "Value": 35250105
                    }
                  ]
                }
		    </textarea>
        </div>
        <div id="jsonOutput" style="width:600px; display:table-cell;">
            Response:
            <br><br>
            <textarea id="responseTextArea" class="UIInput" style="width:580px; height:400px;"></textarea>
        </div>
    </div>
</body>
</home>
```

### Example response

A successful response is returned in JSON. Click [here](../includes/response-latest.md) to see the response from the example.

## Next steps

> [Javascript app](../tutorials/javascript-tutorial.md)
