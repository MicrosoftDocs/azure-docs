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
<a name="definitions"></a>
## Definitions

<a name="point"></a>
### Point

|Name|Description|Schema|
|---|---|---|
|**Timestamp**  <br>*optional*|The timestamp for the data point. Make sure it aligns with the midnight, and use a UTC date time string, for example, 2017-08-01T00:00:00Z.|string (date-time)|
|**Value**  <br>*optional*|A data measure value.|number (double)|


<a name="request"></a>
### Request

|Name|Description|Schema|
|---|---|---|
|**Period**  <br>*optional*|The period of the data points. If the value is null or does not present, the API will determine the period automatically.|number (double)|
|**Points**  <br>*optional*|The time series data points. The data should be sorted by timestamp ascending to match the anomaly result. If the data is not sorted correctly or there is duplicated timestamp, the API will detect the anomaly points correctly, but you could not well match the points returned with the input. In such case, a warning message will be added in the response.|< [point](#point) > array|


<a name="response"></a>
### Response

|Name|Description|Schema|
|---|---|---|
|**ExpectedValues**  <br>*optional*|The predicted value by the learning based model. If the input data points are sorted by timestamp ascending, the index of the array can be used to map the expected value and original value.|< number (double) > array|
|**IsAnomaly**  <br>*optional*|The result on whether the data points are anomalies or not in both directions (spikes or dips). true means the point is anomaly, false means the point is non-anomaly. If the input data points are sorted by timestamp ascending, the index of the array can be used to map the expected value and original value.|< boolean > array|
|**IsAnomaly_Neg**  <br>*optional*|The result on whether the data points are anomalies in negative direction (dips). true means the direction of the anomaly is negative. If the input data points are sorted by timestamp ascending, the index of the array can be used to map the expected value and original value.|< boolean > array|
|**IsAnomaly_Pos**  <br>*optional*|The result on whether the data points are anomalies in positive direction (spikes). true means the direction of the anomaly is positive. If the input data points are sorted by timestamp ascending, the index of the array can be used to map the expected and original value.|< boolean > array|
|**LowerMargin**  <br>*optional*|(ExpectedValue - LowerMargin) determines the lower bound that data point is still thought as normal. If the input data points are sorted by timestamp ascending, the index of the array can be used to map the expected value and original value.|< number (double) > array|
|**Period**  <br>*optional*|The period that the API used to detect the anomaly points.|number (float)|
|**UpperMargin**  <br>*optional*|The sum of ExpectedValue and UpperMargin determines the upper bound that data point is still thought as normal. If the input data points are sorted by timestamp ascending, the index of the array can be used to map the expected value and original value.|< number (double) > array|
|**WarningText**  <br>*optional*|If the input data points provided are not following the rule that the API requires, and the data can still be detected by the API, the API will analyze the data and append the warning information in this field.|string|



