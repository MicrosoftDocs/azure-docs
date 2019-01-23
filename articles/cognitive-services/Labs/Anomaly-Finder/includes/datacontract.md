---
title: include file
description: include file
services: cognitive-services
author: chliang
manager: bix

ms.service: cognitive-services
ms.component: anomaly-finder
ms.topic: include
ms.date: 04/13/2018
ms.author: chliang
ms.custom: include file
---
With the [Anomaly Finder API](https://labs.cognitive.microsoft.com/en-us/project-anomaly-finder), you can upload time series data in JSON format to the API endpoint, and then read the result from the API response. You can upload the time series data, each data point includes:  
* Timestamp - The timestamp for the data point. Make sure it uses a UTC date time string, for example, "2017-08-01T00:00:00Z"
* Value - The measurement of that data point

The results consist of:
* Period - The periodicity that the API uses to detect the anomalies
* WarningText - The possible warning information
* ExpectedValue - The predicted value by the learning based model
* IsAnomaly - The result on whether the data points are anomalies or not in both directions (spikes or dips)
* IsAnomaly_Neg - The result on whether the data points are anomalies in negative direction (dips)
* IsAnomaly_Pos - The result on whether the data points are anomalies in positive direction (spikes)
* UpperMargin - The sum of ExpectedValue and UpperMargin determines the upper bound that data point is still thought as normal
* LowerMargin - (ExpectedValue - LowerMargin) determines the lower bound that data point is still thought as normal

Details of the data contract can be found [here](../apiref.md).

