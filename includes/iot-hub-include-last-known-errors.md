---
title: include file
description: include file
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 04/22/2019
ms.author: kgremban
ms.custom: include file
---
[Get Endpoint Health](/rest/api/iothub/iothubresource/getendpointhealth#iothubresource_getendpointhealth) in the REST API gives the health status of the endpoints, as well as the last known error, to identify the reason an endpoint is not healthy. The table below lists the most common errors.

|Last Known Error|Description/when it occurs|Possible Mitigation|
|-----|-----|-----|
|Transient|A transient error has occurred and IoT Hub will retry the operation.|Observe [routes resource logs](../articles/iot-hub/monitor-iot-hub-reference.md#routes).|
|InternalError|An error occurred while delivering a message to an endpoint.|This is an internal exception but also observe the [routes resource logs](../articles/iot-hub/monitor-iot-hub-reference.md#routes).|
|Unauthorized|IoT Hub is not authorized to send messages to the specified endpoint.|Validate that the connection string is up to date for the endpoint. If it has changed, consider an update on your IoT Hub. If the endpoint uses managed identity, check that the IoT Hub principal has the required permissions on the target.|
|Throttled|IoT Hub is being throttled while writing messages into the endpoint.|Review the throttle limits for the affected endpoint. Modify configurations for the endpoint to scale up if needed.|
|Timeout|Operation timeout.|Retry the operation.|
|Not Found|Target resource does not exist.|Ensure that the target resource exists.|
|Container Not Found|Storage container does not exist.|Ensure the storage container exists.|
|Container disabled|Storage container is disabled.|Ensure the storage container is enabled.|
|MaxMessageSizeExceeded|Message routing has a message size limit of 256Kb.The message size being routed exceeded this limit.|Check if message size can be reduced by using fewer application properties or fewer message enrichments.|
|PartitioningAndDuplicateDetectionNotSupported|Service bus may not have duplicate detection enabled.|Disable duplicate detection from Service Bus or consider using an entity without duplicate detection.|
|SessionfulEntityNotSupported|Service bus may not have sessions enabled.|Disable session from Service Bus or consider using an entity without sessions.|
|NoMatchingSubscriptionsForMessage|There is no subscription to write message on the service bus topic.|Create a subscription for IoT Hub messages to be routed to.|
|EndpointExternallyDisabled|Endpoint is not in an active state so IoT Hub can send messages to it.|Enable the endpoint to bring it back to active state.|
|DeviceMaximumQueueDepthExceeded|Service bus size limit has been reached.|Consider removing messages from the target Event Hubs to allow new messages to be ingested into the Event Hubs.|