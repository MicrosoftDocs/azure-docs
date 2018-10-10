---
title: "Tutorial: Anomaly Detection with Javascript"
titlesuffix: Azure Cognitive Services
description: Explore a Javascript Web app that uses the Anomaly Detection API. Send original data points to API and get the expected value and anomaly points.
services: cognitive-services
author: wenya
manager: bix

ms.service: cognitive-services
ms.component: anomaly-detection
ms.topic: tutorial
ms.date: 05/01/2018
ms.author: wenya
---

# Tutorial: Anomaly Detection with Javascript application

[!INCLUDE [PrivatePreviewNote](../../../../../includes/cognitive-services-anomaly-finder-private-preview-note.md)]

Explore a Web application that uses the Anomaly Detection REST API to detect an anomaly. The example submits the time series data to the Anomaly Detection API with your subscription key, then gets all the anomaly points and the expected value for each data point from the API.

## Prerequisites

### Platform requirements

This tutorial has been developed using a simple text editor.

### Subscribe to Anomaly Detection and get a subscription key 

[!INCLUDE [GetSubscriptionKey](../includes/get-subscription-key.md)]

## Get and use the example

This tutorial provides two scenarios for time series data anomaly detection. Let's get started.

<a name="Step1"></a> 
### Download the tutorial project

Clone the [Cognitive Services JavaScript Anomaly Detection Tutorial](https://github.com/MicrosoftAnomalyDetection/javascript-sample), or download the .zip file and extract it to an empty directory.

<a name="Step2"></a>
### Run the example

There are two scenarios you can try the example.
1. Put your **subscription key** into the Subscription Key field on detect function on anomalydetection.html.
2. Put anomaly detection API endpoint, and verify that you are using the correct region in Subscription Region.
3. Open the **anomalydetection.html** file in a Web browser.

**Scenario 1 Detect weekly time series data**
1. In Period field, input period **7**. 
2. Replace the sample data with your weekly time series data points (Json) in Points field, or use the sample data directly.
3. Click the Anomaly Detection button and verify the result in the right Response text box.

**Scenario 2 Detect the time series data without a period**
1. Leave the period empty in Period filed, assume that you don't know the period of the time series.
2. Using the same time series data as the scenario 1.
3. Click the Anomaly Detection button and verify the Period field in the right Response text box.

<a name="Step3"></a>
### Read the result

[!INCLUDE [diagrams](../includes/diagrams.md)]

<a name="Review"></a>
### Review and learn

Now you get a running application. Let's review how the example app integrates with Cognitive Services technology. This step will make it easier to either continue building on this app or develop your own app using Microsoft Anomaly Detection.
This example app makes use of the Anomaly Detection Restful API endpoint.
Reviewing how the Restful API gets used in the example application, let's look at a code snippet from anomalydetection.html.
```JavaScript
function anomalyDetection(url, subscriptionKey, points, period) {
    var obj = new Object();
    obj.Points = JSON.parse(points); // this points are read from text box.
    obj.Period = parseInt(period);//period=7 weekly period
    var tsData = JSON.stringify(obj);
    // Perform the REST API call.
    $.ajax({
        url: url, //Anomaly Detection API endpoint
        // Request headers.
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/json");
			xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey); // Replace your subscription key
        },
        type: "POST",
        // Request body.
        data: tsData, // json format
        })
        .done(function (data) {
            // Show formatted JSON on webpage.
            $("#responseTextArea").val(JSON.stringify(data, null, 2));
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
            $("#responseTextArea").val(errorString);           
        });
}

```

## Next steps

> [!div class="nextstepaction"]
> [REST API reference](https://dev.labs.cognitive.microsoft.com/docs/services/anomaly-detection/operations/post-anomalydetection)
