---
 title: include file
 description: include file
 services: iot-hub
 author: kgremban
 ms.service: iot-hub
 ms.topic: include
 ms.date: 04/28/2020
 ms.author: kgremban
 ms.custom: include file
---

<!-- operation names for the diag logs for IoT Hub -->

|Operation Name|Level|Description|
|------------- |-----|-----------|
|UndefinedRouteEvaluation|Information|The message cannot be evaluated with a giving condition. For example, if a property in the route query condition is absent in the message. Learn more about [routing query syntax](../articles/iot-hub/iot-hub-devguide-routing-query-syntax.md).|
|RouteEvaluationError|Error|There was an error evaluating the message because of an issue with the message format. For example, this error will be logged if the content encoding not specified or Content type not valid in the message. These must be set in the [system properties](../articles/iot-hub/iot-hub-devguide-routing-query-syntax.md#system-properties).|
|DroppedMessage|Error|Message was dropped and not routed. This could be due to reasons like message didn't match any routing query or endpoint was dead and message could not be delivered after several retries. We recommend getting more details on the endpoint by using the REST API [get endpoint health](/rest/api/iothub/iothubresource/getendpointhealth#iothubresource_getendpointhealth).|
|EndpointUnhealthy|Error|Endpoint has not been accepting messages from IoT Hub and IoT Hub is trying to resend the messages. We recommend observing the last known error via the REST API [get endpoint health](/rest/api/iothub/iothubresource/getendpointhealth#iothubresource_getendpointhealth).|
|EndpointDead|Error|Endpoint has not been accepting messages from IoT Hub for over an hour. We recommend observing the last known error via the REST API [get endpoint health](/rest/api/iothub/iothubresource/getendpointhealth#iothubresource_getendpointhealth).|
|EndpointHealthy|Information|Endpoint is healthy and receiving messages from IoT Hub. This message is not logged continuously, but logged only when the endpoint becomes healthy again. This message means IoT Hub was unable to send messages to the endpoint, but the endpoint is now healthy.|
|OrphanedMessage|Information|The message does not match to any route.|
|InvalidMessage|Error|Message is invalid because of incompatibility with the endpoint. We recommend check configurations of the endpoint.|


The operations *UndefinedRouteEvaluation*, *RouteEvaluationError* and *OrphanedMessage* are throttled and logged no more than once a minute per IoT Hub.