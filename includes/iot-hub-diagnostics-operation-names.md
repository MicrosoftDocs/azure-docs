---
 title: include file
 description: include file
 services: iot-hub
 author: robinsh
 ms.service: iot-hub
 ms.topic: include
 ms.date: 04/24/2020
 ms.author: robinsh
 ms.custom: include file
---

<!-- operation names for the diag logs for IoT Hub -->


|Operation Name|Error Code (resultType)|Level|Description|Notes|
|------------- |----------|-----|-----------|--------|
|UndefinedRouteEvaluation |   |Information|We log undefined evaluation when a message cannot be evaluated with a giving condition. Example = a property on the route condition is not present in the message.|  |
|RouteEvaluationError|  |Error|Error evaluating message because of an issue with the message format. For example: content encoding not specified. Content type not valid.|This one has many sub-events in the spec doc. For example: routeEvaluationError-Content encoding not specified. routeEvaluationError-ContentType not valid. When this event is logged, we log the exception information with it, which can provide more information for the customer on why the evaluation failed. Examples: Content encoding is not specified in system properties. Error in $body query. Expecting a tags/desired/reported.|
|DroppedMessage|   |Error|Message dropped by routing as message didn't match any routing query. Message failed to send after several retries because of dead endpoint.|   |
|EndpointDead|   |Error|Endpoint has not been accepting messages from IoT Hub for over am hour.|   |
|EndpointUnhealthy|   |Error|Endpoint has not been accepting messages from IoT Hub and IoT Hub is trying to resend the messages.|This one has many sub-events in the spec doc. For example: <br>Endpointunhealthy-internalServerError<br>endpointUnhealthy-authorization error<br>Failure kind (result description field in diagnostic logs) is displayed in the error message, and it comes from the exception message when delivering messages to an endpoint fails failing endpoint. For example, for a service bus that ran out of space I got this repro: <br>{ "time": "2019-12-12T03:25:14Z", "resourceId": "/SUBSCRIPTIONS/91D12660-3DEC-467A-BE2A-213B5544DDC0/RESOURCEGROUPS/JUAN-TEST/PROVIDERS/MICROSOFT.DEVICES/IOTHUBS/JUANHUB1", "operationName": "endpointUnhealthy", "category": "Routes", "level": "Error", "resultType": "403004", "resultDescription": "DeviceMaximumQueueDepthExceeded", "properties": "{\"deviceId\":null,\"endpointName\":\"juan-sb-1\",\"messageId\":null,\"details\":\"DeviceMaximumQueueDepthExceeded\",\"routeName\":null,\"statusCode\":\"403\"}", "location": "westus"} |
|OrphanedMessage|   |Information|Case when message does not match to any route|   |
|EndpointHealthy|   |Information|Endpoint is healthy and receiving messages from IoT Hub. We don’t log this all the time. We log it in the case of a revive; this means we were unable to send messages to the endpoint, but the endpoint is now healthy|   |
|InvalidMessage|   |Error|Message is invalid because of incompatibility with the endpoint|    |

**Throttled logs**

Throttle the log errors to protect from a situation when OperationName/error applies to many messages, to balance COGS. We throttle the following events by logging one occurrence per minute per IotHub.

UndefinedRouteEvaluation

RouteEvaluationError

OrphanedMessage