---
title: include file
description: include file
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 04/28/2019
ms.author: robinsh
ms.custom: include file
---

You can use the REST API [Get Endpoint Health](https://docs.microsoft.com/rest/api/iothub/iothubresource/getendpointhealth#iothubresource_getendpointhealth) to get health status of the endpoints. We recommend using the [IoT Hub metrics](../articles/iot-hub/iot-hub-metrics.md) related to routing message latency to identify and debug errors when endpoint health is dead or unhealthy, as we expect latency to be higher when the endpoint is in one of those states.


|Health Status|Description|
|---|---|
|healthy|The endpoint is accepting messages as expected.|
|unhealthy|The endpoint is not accepting messages and IoT Hub is retrying to send messages to this endpoint.|
|unknown|IoT Hub has not attempted to deliver messages to this endpoint.|
|degraded|The endpoint is accepting messages slower than expected or is recovering from an unhealthy state.|
|dead|IoT Hub is no longer delivering messages to this endpoint. Retries to send messages to this endpoint failed.|
