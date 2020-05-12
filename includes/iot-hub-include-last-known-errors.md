---
title: include file
description: include file
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 04/22/2019
ms.author: robinsh
ms.custom: include file
---
[Get Endpoint Health](/rest/api/iothub/iothubresource/getendpointhealth.md#iothubresource_getendpointhealth) in the REST API gives the health status of the endpoints, as well as the last known error, to identify the reason an endpoint is not healthy. The table below lists the most common errors.

|Last Known Error|Description/when it occurs|Possible Mitigation|
|-----|-----|-----|
|Transient|A transient error has occurred and IoTHub will retry the operation.|Observe routes diagnostic logs|
|InternalError|An error occurred while delivering a message to an endpoint.|a|
|Unauthorized|IoTHub is not authorized to send messages to the specified endpoint.|a|
|Throttled|IoTHub is being throttled while writing messages into the endpoint.|a|
|Timeout|Operation timeout. Please retry.| |
|PartitioningAndDuplicate<br>DetectionNotSupported|Service bus must not have duplicate detection enabled.| |
|SessionfulEntityNotSupported|Service bus must not have sessions enabled.| |
|NoMatchingSubscriptions<br>ForMessage|There is no subscription to write message on the service bus topic.| |
|EndpointExternallyDisabled|Endpoint is not in an active state so IoTHub can send messages to it.| |
|DeviceMaximumQueueDepth<br>
Exceeded|Service bus size limit has been reached.| |