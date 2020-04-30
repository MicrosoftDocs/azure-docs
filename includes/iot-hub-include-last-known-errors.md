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
When an IoT Hub fails, the last known error that was logged can be viewed, which should help you determine what the problem was, and how to address it. This table contains the most common errors.

|Last Known Error|Description/when it occurs|Mitigation/next steps|
|-----|-----|-----|
Transient=1|A transient error has occurred and IoTHub will retry the operation.|Check diagnostic logs for more relevant information about the error?|
|InternalError=2|An error occurred while delivering a message to an endpoint|Check diagnostic logs for more relevant information about the error?|
|Unauthorized=3|IoTHub is not authorized to send messages to the specified endpoint.|Validate the connection string is up to date for the endpoint. If it has changed, consider updating your hub. For endpoints that use managed identity (GA in May--is it going to, do we need this, what's the deal?). Check that IoTHub principal has required permissions on the target resource.|
|Throttled=4|IoTHub is being throttled while writing messages into the endpoint.|Consider reviewing the throttling limits for the affected endpoint. <br><br>Increase the limit (is this possible), or consider reducing the load of messages sent to this endpoint.|
|Timeout=5|Operation timeout. Please retry.| Timeouts can usually be retried. Any other idea apart from retrying?|
|NullMessage=6|This happens when a non-nullable parameter is set to null.|Review content of the message to ensure all required fields are present.|
|Slow=7|  |  |
|InvalidData=8|This error happens when sending invalid data (like invalid characters) to an event grid endpoint.|Validate data is correct.|
|**Service Bus**|||
|MaxMessageSize<br>Exceeded|Message routing has a message size limit of 256Kb. The message size being routed exceeded this limit.|See if fewer application properties or message enrichments can be used.|
|**Topics**|||
|PartitioningAndDuplicate<br>DetectionNotSupported=40|Service bus must not have duplicate detection enabled|Disable duplicate detection from service bus or consider using an entity without duplicate detection|
|SessionfulEntityNotSupported=41|Service bus must not have sessions enabled|Disable session from service bus or consider using an entity without sessions|
|NoMatchingSubscriptions<br>ForMessage=42|There is not subscription to write message on the service bus topic|Create a subscription for IoTHub messages to be sent|
|EndpointExternallyDisabled=43|Endpoint is not on active state so IoTHub can send messages to it|Wait for endpoint to be in Active state or troubleshoot the endpoint to become active.|
|DeviceMaximumQueueDepth<br>
Exceeded=44|Service bus size limit has been reached|Consider removing messages from the target event hub to allow new messages to be ingested into the event hub|