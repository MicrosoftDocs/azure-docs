---
title: Monitor device status
titleSuffix: Azure IoT Hub
description: Use Event Grid or the device heartbeat pattern to monitor the connection states of Azure IoT Hub devices.
author: kgremban
ms.author: kgremban
ms.topic: reference
ms.service: iot-hub
ms.date: 10/18/2022
---

# Monitor device connection status

Azure IoT Hub supports several methods for monitoring the status of your devices. This article presents the different monitoring methods and provides guidance to help you choose the best option for your IoT solution.

The following table introduces three ways to monitor your device connection status:

| Method | Status frequency | Cost | Effort to build |
| --- | --- | --- | --- |
| Device twin connectionState property | Intermittent | Low | Low |
| Event Grid | 60 seconds | Low | Low |
| Custom device heartbeat pattern | Custom | High | High |

Because of its reliability, low cost, and ease of use we recommend Event Grid as the preferred monitoring solution for most customers.

However, there are certain limitations to monitoring with Event Grid that may disqualify it for some IoT solutions. Use this article to understand the benefits and limitations of each option.

## Device twin connectionState

Every IoT Hub device identity contains a property called **connectionState** that reports either **connected** or **disconnected**. This property represents IoT Hub's understanding of a device's connection status.

The connection state property has several limitations:

* The connection state is updated only for devices that use MQTT or AMQP.
* Updates to this property rely on protocol-level pings and may be delayed as much as five minutes.

For these reasons, we recommend that you only use the **connectionState** field during development and debugging. IoT solutions shouldn't query the field at run time. For example, don't query the **connectionState** field to check if a device is connected before you send a cloud-to-device message or an SMS.

## Event Grid

We recommend Event Grid as the preferred monitoring solution for most customers.

Subscribe to the **deviceConnected** and **deviceDisconnected** events on Event Grid to get alerts and monitor the device connection state.

Use the following articles to learn how to integrate device connected and disconnected events in your IoT solution:

* [React to IoT Hub events by using Event Grid](iot-hub-event-grid.md)
* [Order device connection events by using Cosmos DB](iot-hub-how-to-order-connection-state-events.md)

Device connection state events are available for devices connecting using either the MQTT or AMQP protocol, or using either of these protocols over WebSockets. Requests made only with HTTPS won't trigger device connection state notifications.

* For devices connecting using the Azure IoT SDKs for Java, Node, or Python:
  * MQTT: connection state events are sent automatically.
  * AMQP: a [cloud-to-device link](iot-hub-amqp-support.md#invoke-cloud-to-device-messages-service-client) should be created to reduce delays in reporting connection states.
* For devices connecting using the Azure IoT SDKs for .NET or C, connection state events won't be reported until an initial device-to-cloud message is sent or a cloud-to-device message is received.

Outside of the Azure IoT SDKs, in MQTT these operations equate to SUBSCRIBE or PUBLISH operations on the appropriate messaging topics. Over AMQP these operations equate to attaching or transferring a message on the appropriate link paths.

IoT Hub doesn't report each individual device connect and disconnect, but rather publishes the current connection state taken at a periodic 60-second snapshot. Receiving either the same connection state event with different sequence numbers or different connection state events both mean that there was a change in the device connection state during the 60-second window.

### Event Grid limitations

Using Event Grid to monitor your device status comes with the following limitations:

* Event Grid doesn't report each individual device connect and disconnect event. Instead, it polls for device status every 60 seconds and publishes the most recent connection state if there was a state change. For this reason, state change reports may be delayed up to one minute and individual state changes may be unreported if multiple events happen within the 60-second window.
* Devices that use MQTT start reporting device status automatically. However, devices that use AMQP need [cloud-to-device link](iot-hub-amqp-support.md#invoke-cloud-to-device-messages-service-client) before they can report device status.
* The IoT C SDK doesn't have a connect method. Customers must send telemetry to begin reporting accurate device connection states.
* Event Grid exposes a public endpoint that can't be hidden.

If any of these limitations affect your ability to use Event Grid for device status monitoring, then you should consider building a custom device heartbeat pattern instead.

## Device heartbeat pattern

If you need to know the connection state of your devices but the limitations of Event Grid are too restricting for your solution, you can implement the *heartbeat pattern*. In the heartbeat pattern, the device sends device-to-cloud messages at least once every fixed amount of time (for example, at least once every hour). Even if a device doesn't have any data to send, it still sends an empty device-to-cloud message, usually with a property that identifies it as a heartbeat message. On the service side, the solution maintains a map with the last heartbeat received for each device. If the solution doesn't receive a heartbeat message within the expected time from the device, it assumes that there's a problem with the device.

### Device heartbeat limitations

Since heartbeat messages are implemented as device-to-cloud messages, they count against your [IoT Hub message quota and throttling limits](iot-hub-devguide-quotas-throttling.md).

### Short expiry time pattern

If an IoT solution uses the connection state solely to determine whether to send cloud-to-device messages to a device, and messages aren't broadcast to large sets of devices, consider using the *short expiry time pattern* as a simpler alternative to the heartbeat pattern. The short expiry time pattern is a way to determine whether to send cloud-to-device messages by sending messages with a short message expiration time and requesting message acknowledgments from the devices.

For more information, see [Message expiration (time to live)](./iot-hub-devguide-messages-c2d.md#message-expiration-time-to-live).

## Other monitoring options

A more complex implementation could include the information from [Azure Monitor](../azure-monitor/index.yml) and [Azure Resource Health](../service-health/resource-health-overview.md) to identify devices that are trying to connect or communicate but failing. Azure Monitor dashboards are helpful for seeing the aggregate health of your devices, while Event Grid and heartbeat patterns make it easier to respond to individual device outages.

To learn more about using these services with IoT Hub, see [Monitor IoT Hub](monitor-iot-hub.md) and [Check IoT Hub resource health](iot-hub-azure-service-health-integration.md). For more specific information about using Azure Monitor or Event Grid to monitor device connectivity, see [Monitor, diagnose, and troubleshoot device connectivity](iot-hub-troubleshoot-connectivity.md).
