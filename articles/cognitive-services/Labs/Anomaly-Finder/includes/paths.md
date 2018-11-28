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
<a name="paths"></a>
## Paths

<a name="anomalydetection-post"></a>
### Detect anomaly points for the time series data points requested
```
POST /anomalydetection
```


#### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Body**|**body**  <br>*required*|The time series data points and period if needed.|[request](#request)|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Successful operation.|< [response](#response) > array|
|**400**|Can not parse JSON request.|No Content|
|**403**|The certificate you provided is not accepted by server.|No Content|
|**405**|Method Not Allowed.|No Content|
|**500**|Internal Server Error.|No Content|


#### Consumes

* `application/json`


#### Produces

* `application/json`


#### Tags

* anomalydetection



