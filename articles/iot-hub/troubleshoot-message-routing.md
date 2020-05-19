---
title: Troubleshoot Azure IoT message routing
description: How to perform troubleshooting for Azure IoT message routing
author: ash2017
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 05/06/2020
ms.author: asrastog
---

# Troubleshooting message routing

This article provides monitoring and troubleshooting guidance for common issues and resolution for IoT Hub [message routing](iot-hub-devguide-messages-d2c.md). 

## Monitoring message routing

[IoT Hub metrics](iot-hub-metrics.md) lists all metrics that are enabled by default for your IoT Hub. We recommend you monitor metrics related to message routing and endpoints to give you an overview of the messages sent. Also turn on [diagnostic logs](iot-hub-monitor-resource-health.md) in Azure Monitor diagnostic settings, to track operations for **routes**. These diagnostic logs can be sent to Azure Monitor logs, Event Hubs, or Azure Storage for custom processing. Learn how to [set up and use metrics and diagnostic logs with an IoT Hub](tutorial-use-metrics-and-diags.md).

We also recommend enabling the [fallback route](iot-hub-devguide-messages-d2c.md#fallback-route) if you want to maintain messages that don't match the query on any of the routes. These can be retained in the [built-in endpoint](iot-hub-devguide-messages-read-builtin.md) for the amount of retention days configured. 

## Top issues

The following are the most common issues observed with message routing. To start troubleshooting, click on the issue for detailed steps.

* [Messages from my devices are not being routed as expected](#messages-from-my-devices-are-not-being-routed-as-expected)
* [I suddenly stopped getting messages at the built-in Event Hubs endpoint](#i-suddenly-stopped-getting-messages-at-the-built-in-endpoint)

### Messages from my devices are not being routed as expected

To troubleshoot this issue, analyze the following.

#### The routing metrics for this endpoint
All the [IoT Hub metrics](iot-hub-devguide-endpoints.md) related to routing are prefixed with *Routing*. You can combine information from multiple metrics to identify root cause for issues. For example, use metric **Routing Delivery Attempts** to identify the number of messages that were delivered to an endpoint or dropped when they didn't match queries on any of the routes and fallback route was disabled. Check the **Routing Latency** metric to observe whether latency for message delivery is steady or increasing. A growing latency can indicate a problem with a specific endpoint and we recommend checking [the health of the endpoint](#the-health-of-the-endpoint). These routing metrics also have [dimensions](iot-hub-metrics.md#dimensions) that provide details on the metric like the endpoint type, specific endpoint name and a reason why the message was not delivered.

#### The diagnostic logs for any operational issues 
Observe the **routes** [diagnostic logs](iot-hub-monitor-resource-health.md#routes) to get more information on the routing and endpoint [operations](#operation-names) or identify errors and relevant [error code](#common-error-codes) to understand the issue further. For example, the operation name **RouteEvaluationError** in the log indicates the route could not be evaluated because of an issue with the message format. Use the tips provided for the specific [operation names](#operation-names) to mitigate the issue. When an event is logged as an error, the log will also provide more information on why the evaluation failed. For example, if the operation name is **EndpointUnhealthy**, an [Error codes](#common-error-codes) of 403004 indicates the endpoint ran out of space.

#### The health of the endpoint
Use the REST API [Get Endpoint Health](https://docs.microsoft.com/rest/api/iothub/iothubresource/getendpointhealth#iothubresource_getendpointhealth) to get [health status](iot-hub-devguide-endpoints.md#custom-endpoints) of the endpoints. The *Get Endpoint Health* API also provides information on the last time a message was successfully sent to the endpoint, the [last known error](#last-known-errors-for-iot-hub-routing-endpoints), last known error time and the last time a send attempt was made for this endpoint. Use the possible mitigation provided for the specific [last known error](#last-known-errors-for-iot-hub-routing-endpoints).

### I suddenly stopped getting messages at the built-in endpoint

To troubleshoot this issue, analyze the following.

#### Was a new route created?
Once a route is created, data stops flowing to the built-in-endpoint, unless a route is created to that endpoint. To ensure messages continues to flow to the built-in-endpoint if a new route is added, configure a route to the *events* endpoint. 

#### Was the Fallback route disabled?
The fallback route sends all the messages that don't satisfy query conditions on any of the existing routes to the [built-in-Event Hubs](iot-hub-devguide-messages-read-builtin.md) (messages/events), that is compatible with [Event Hubs](https://docs.microsoft.com/azure/event-hubs/). If message routing is turned on, you can enable the fallback route capability. If there are no routes to the built-in-endpoint and a fallback route is enabled, only messages that don't match any query conditions on routes will be sent to the built-in-endpoint. Also, if all existing routes are deleted, fallback route must be enabled to receive all data at the built-in-endpoint.

You can enable/disable the fallback route in the Azure portal->Message Routing blade. You can also use Azure Resource Manager for [FallbackRouteProperties](https://docs.microsoft.com/rest/api/iothub/iothubresource/createorupdate#fallbackrouteproperties) to use a custom endpoint for fallback route.

## Last known errors for IoT Hub routing endpoints

<a id="last-known-errors"></a>
[!INCLUDE [iot-hub-include-last-known-errors](../../includes/iot-hub-include-last-known-errors.md)]

## Routes diagnostic logs

The following are the operation names and error codes logged in the [diagnostic logs](iot-hub-monitor-resource-health.md#routes).

<a id="diagnostics-operation-names"></a>
### Operation Names

[!INCLUDE [iot-hub-diagnostics-operation-names](../../includes/iot-hub-diagnostics-operation-names.md)]

<a id="diagnostics-error-codes"></a>
### Common error codes

[!INCLUDE [iot-hub-diagnostics-error-codes](../../includes/iot-hub-diagnostics-error-codes.md)]

## Next steps

If you need more help, you can contact the Azure experts on [the MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.
