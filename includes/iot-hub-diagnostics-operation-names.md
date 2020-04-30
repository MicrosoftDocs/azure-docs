---
 title: include file
 description: include file
 services: iot-hub
 author: robinsh
 ms.service: iot-hub
 ms.topic: include
 ms.date: 04/28/2020
 ms.author: robinsh
 ms.custom: include file
---

<!-- operation names for the diag logs for IoT Hub -->

|Operation Name|Level|Description|
|------------- |-----|-----------|
|UndefinedRouteEvaluation |Information|We log undefined evaluation when a message cannot be evaluated with a giving condition. Example = a property on the route condition is not present in the message.|
|RouteEvaluationError|Error|Error evaluating message because of an issue with the message format. For example: content encoding not specified. Content type not valid.|
|DroppedMessage|Error|Message dropped by routing as message didn't match any routing query. Message failed to send after several retries because of dead endpoint.|
|EndpointDead|Error|Endpoint has not been accepting messages from IoT Hub for over am hour.|
|EndpointUnhealthy|Error|Endpoint has not been accepting messages from IoT Hub and IoT Hub is trying to resend the messages.|
|OrphanedMessage|Information|Case when message does not match to any route|
|EndpointHealthy|Information|Endpoint is healthy and receiving messages from IoT Hub. We don’t log this message all the time. We log it in the case of a revive; this message means we were unable to send messages to the endpoint, but the endpoint is now healthy|
|InvalidMessage|Error|Message is invalid because of incompatibility with the endpoint|

**Throttled logs**

Throttle the log errors to protect from a situation when OperationName/error applies to many messages, to balance COGS. We throttle the following events by logging one occurrence per minute per IotHub.

UndefinedRouteEvaluation

RouteEvaluationError

OrphanedMessage