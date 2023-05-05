---
title: Troubleshoot Azure IoT message routing
description: How to perform troubleshooting for Azure IoT Hub message routing
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: troubleshooting
ms.date: 05/06/2020
---

# Troubleshooting message routing

This article provides monitoring and troubleshooting guidance for common issues and resolution for IoT Hub [message routing](iot-hub-devguide-messages-d2c.md).

## Monitoring message routing

We recommend you monitor [IoT Hub metrics related to message routing and endpoints](monitor-iot-hub-reference.md#routing-metrics) to give you an overview of the messages sent. You can also create a diagnostic setting to send operations for [**routes** in IoT Hub resource logs](monitor-iot-hub-reference.md#routes) to Azure Monitor Logs, Event Hubs or Azure Storage for custom processing. To learn more about using metrics, resource logs, and diagnostic settings, see [Monitor IoT Hub](monitor-iot-hub.md). For a tutorial, see [Set up and use metrics and resource logs with an IoT hub](tutorial-use-metrics-and-diags.md).

We also recommend enabling the [fallback route](iot-hub-devguide-messages-d2c.md#fallback-route) if you want to maintain messages that don't match the query on any of the routes. These can be retained in the [built-in endpoint](iot-hub-devguide-messages-read-builtin.md) for the amount of retention days configured.

## Top issues

The following are the most common issues observed with message routing. To start troubleshooting, click on the issue for detailed steps.

* [Messages from my devices are not being routed as expected](#messages-from-my-devices-are-not-being-routed-as-expected)
* [I suddenly stopped getting messages at the built-in Event Hubs endpoint](#i-suddenly-stopped-getting-messages-at-the-built-in-endpoint)

### Messages from my devices are not being routed as expected

To troubleshoot this issue, analyze the following.

#### The routing metrics for this endpoint

All the [IoT Hub metrics related to routing](monitor-iot-hub-reference.md#routing-metrics) are prefixed with *Routing*. You can combine information from multiple metrics to identify root cause for issues. For example, use metric **Routing Deliveries** to identify the number of messages that were delivered to an endpoint or dropped when they didn't match queries on any of the routes and fallback route was disabled. Check the **Routing Latency** metric to observe whether latency for message delivery is steady or increasing. A growing latency can indicate a problem with a specific endpoint and we recommend checking [the health of the endpoint](#the-health-of-the-endpoint). These routing metrics also have [dimensions](monitor-iot-hub-reference.md#metric-dimensions) that provide details on the metric like the endpoint type, specific endpoint name and a reason why the message was not delivered.

#### The resource logs for any operational issues

Observe the [**Routes** resource logs](monitor-iot-hub-reference.md#routes) to get more information on the routing and endpoint [operations](#operation-names) or identify errors and relevant [error code](#common-error-codes) to understand the issue further. For example, the operation name **RouteEvaluationError** in the log indicates the route could not be evaluated because of an issue with the message format. Use the tips provided for the specific [operation names](#operation-names) to mitigate the issue. When an event is logged as an error, the log will also provide more information on why the evaluation failed. For example, if the operation name is **EndpointUnhealthy**, an [Error code](#common-error-codes) of 403004 indicates the endpoint ran out of space.

#### The health of the endpoint

Use the REST API [Get Endpoint Health](/rest/api/iothub/iothubresource/getendpointhealth#iothubresource_getendpointhealth) to get [health status](iot-hub-devguide-endpoints.md#custom-endpoints) of the endpoints. The *Get Endpoint Health* API also provides information on the last time a message was successfully sent to the endpoint, the [last known error](#last-known-errors-for-iot-hub-routing-endpoints), last known error time and the last time a send attempt was made for this endpoint. Use the possible mitigation provided for the specific [last known error](#last-known-errors-for-iot-hub-routing-endpoints).

### I suddenly stopped getting messages at the built-in endpoint

To troubleshoot this issue, analyze the following.

#### Was a new route created?

Once a route is created, data stops flowing to the built-in-endpoint, unless a route is created to that endpoint. To ensure messages continues to flow to the built-in-endpoint if a new route is added, configure a route to the *events* endpoint. 

#### Was the Fallback route disabled?

The fallback route sends all the messages that don't satisfy any of the query conditions on any of the existing routes to the [built-in-Event Hubs](iot-hub-devguide-messages-read-builtin.md) (messages/events), that is compatible with [Event Hubs](../event-hubs/index.yml). If message routing is turned on, you can enable the fallback route capability. If there are no routes to the built-in endpoint and a fallback route is enabled, only messages that don't match any query conditions on routes will be sent to the built-in-endpoint. Also, if all existing routes are deleted, the fallback route must be enabled to receive all data at the built-in-endpoint.

You can enable or disable the fallback route in the Azure portal by using the Message Routing blade for the IoT hub. You can also use the Azure Resource Manager for [FallbackRouteProperties](/rest/api/iothub/iothubresource/createorupdate#fallbackrouteproperties) to use a custom endpoint for a fallback route.

## Last known errors for IoT Hub routing endpoints

<a id="last-known-errors"></a>  <!-- why are we using anchors? robin -->
[!INCLUDE [iot-hub-include-last-known-errors](../../includes/iot-hub-include-last-known-errors.md)]

## Routes resource logs

The following are the operation names and error codes logged in the [routes resource logs](monitor-iot-hub-reference.md#routes).

<a id="diagnostics-operation-names"></a>
### Operation Names

[!INCLUDE [iot-hub-diagnostics-operation-names](../../includes/iot-hub-diagnostics-operation-names.md)]

<a id="diagnostics-error-codes"></a>
### Common error codes

[!INCLUDE [iot-hub-diagnostics-error-codes](../../includes/iot-hub-diagnostics-error-codes.md)]

## Next steps

If you need more help, you can contact the Azure experts on the [Microsoft Q&A and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.
