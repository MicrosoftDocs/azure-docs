---
title: Azure IoT Hub and Event Grid
titleSuffix: Azure IoT Hub
description: Use Azure Event Grid to send notifications and trigger processes based on actions that happen in IoT Hub.  
author: kgremban

ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 01/22/2022
ms.author: kgremban
ms.custom: [amqp, mqtt, 'Role: Cloud Development']
---

# React to IoT Hub events by using Event Grid to trigger actions

Azure IoT Hub integrates with Azure Event Grid so that you can send event notifications to other services and trigger downstream processes. Configure your business applications to listen for IoT Hub events so that you can react to critical events in a reliable, scalable, and secure manner. For example, build an application that updates a database, creates a work ticket, and delivers an email notification every time a new IoT device is registered to your IoT hub.

[Azure Event Grid](../event-grid/overview.md) is a fully managed event routing service that uses a publish-subscribe model. Event Grid has built-in support for Azure services like [Azure Functions](../azure-functions/functions-overview.md) and [Azure Logic Apps](../logic-apps/logic-apps-overview.md), and can deliver event alerts to non-Azure services using webhooks. For a complete list of the event handlers that Event Grid supports, see [An introduction to Azure Event Grid](../event-grid/overview.md).

To watch a video discussing this integration, see [Azure IoT Hub integration with Azure Event Grid](/shows/internet-of-things-show/iot-devices-and-event-grid).

![Diagram that shows Azure Event Grid architecture.](./media/iot-hub-event-grid/event-grid-functional-model.png)

## Regional availability

The Event Grid integration is available for IoT hubs located in the regions where Event Grid is supported. For the latest list of regions, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=event-grid&regions=all).

## Event types

IoT Hub publishes the following event types:

| Event type | Description |
| ---------- | ----------- |
| Microsoft.Devices.DeviceCreated | Published when a device is registered to an IoT hub. |
| Microsoft.Devices.DeviceDeleted | Published when a device is deleted from an IoT hub. |
| Microsoft.Devices.DeviceConnected | Published when a device is connected to an IoT hub. |
| Microsoft.Devices.DeviceDisconnected | Published when a device is disconnected from an IoT hub. |
| Microsoft.Devices.DeviceTelemetry | Published when a device telemetry message is sent to an IoT hub |

Use either the Azure portal or Azure CLI to configure which events to publish from each IoT hub. For an example, try the tutorial [Send email notifications about Azure IoT Hub events using Logic Apps](../event-grid/publish-iot-hub-events-to-logic-apps.md).

## Event schema

IoT Hub events contain all the information you need to respond to changes in your device lifecycle. You can identify an IoT Hub event by checking that the eventType property starts with **Microsoft.Devices**. For more information about how to use Event Grid event properties, see the [Event Grid event schema](../event-grid/event-schema.md).

### Device connected schema

The following example shows the schema of a device connected event:

```json
[{  
  "id": "f6bbf8f4-d365-520d-a878-17bf7238abd8",
  "topic": "/SUBSCRIPTIONS/<subscription ID>/RESOURCEGROUPS/<resource group name>/PROVIDERS/MICROSOFT.DEVICES/IOTHUBS/<hub name>",
  "subject": "devices/LogicAppTestDevice",
  "eventType": "Microsoft.Devices.DeviceConnected",
  "eventTime": "2018-06-02T19:17:44.4383997Z",
  "data": {
      "deviceConnectionStateEventInfo": {
        "sequenceNumber":
          "000000000000000001D4132452F67CE200000002000000000000000000000001"
      },
    "hubName": "egtesthub1",
    "deviceId": "LogicAppTestDevice",
    "moduleId" : "DeviceModuleID",
  }, 
  "dataVersion": "1",
  "metadataVersion": "1"
}]
```

### Device telemetry schema

Device telemetry messages must be in a valid JSON format with the contentType set to **application/json** and contentEncoding set to **UTF-8** in the message [system properties](iot-hub-devguide-routing-query-syntax.md#system-properties). Both of these properties are case insensitive. If the content encoding is not set, then IoT Hub writes the messages in base 64 encoded format.

You can enrich device telemetry events before they're published to Event Grid by selecting the endpoint as Event Grid. For more information, see [message enrichments](iot-hub-message-enrichments-overview.md).

The following example shows the schema of a device telemetry event:

```json
[{  
  "id": "9af86784-8d40-fe2g-8b2a-bab65e106785",
  "topic": "/SUBSCRIPTIONS/<subscription ID>/RESOURCEGROUPS/<resource group name>/PROVIDERS/MICROSOFT.DEVICES/IOTHUBS/<hub name>",
  "subject": "devices/LogicAppTestDevice",
  "eventType": "Microsoft.Devices.DeviceTelemetry",
  "eventTime": "2019-01-07T20:58:30.48Z",
  "data": {
      "body": {
          "Weather": {
              "Temperature": 900
            },
            "Location": "USA"
        },
        "properties": {
            "Status": "Active"
        },
        "systemProperties": {
          "iothub-content-type": "application/json",
          "iothub-content-encoding": "utf-8",
          "iothub-connection-device-id": "d1",
          "iothub-connection-auth-method": "{\"scope\":\"device\",\"type\":\"sas\",\"issuer\":\"iothub\",\"acceptingIpFilterRule\":null}",
          "iothub-connection-auth-generation-id": "123455432199234570",
          "iothub-enqueuedtime": "2019-01-07T20:58:30.48Z",
          "iothub-message-source": "Telemetry"
        }
  },
  "dataVersion": "",
  "metadataVersion": "1"
}]
```

### Device created schema

The following example shows the schema of a device created event:

```json
[{
  "id": "56afc886-767b-d359-d59e-0da7877166b2",
  "topic": "/SUBSCRIPTIONS/<subscription ID>/RESOURCEGROUPS/<resource group name>/PROVIDERS/MICROSOFT.DEVICES/IOTHUBS/<hub name>",
  "subject": "devices/LogicAppTestDevice",
  "eventType": "Microsoft.Devices.DeviceCreated",
  "eventTime": "2018-01-02T19:17:44.4383997Z",
  "data": {
    "twin": {
      "deviceId": "LogicAppTestDevice",
      "etag": "AAAAAAAAAAE=",
      "deviceEtag":"null",
      "status": "enabled",
      "statusUpdateTime": "0001-01-01T00:00:00",
      "connectionState": "Disconnected",
      "lastActivityTime": "0001-01-01T00:00:00",
      "cloudToDeviceMessageCount": 0,
      "authenticationType": "sas",
      "x509Thumbprint": {
        "primaryThumbprint": null,
        "secondaryThumbprint": null
      },
      "version": 2,
      "properties": {
        "desired": {
          "$metadata": {
            "$lastUpdated": "2018-01-02T19:17:44.4383997Z"
          },
          "$version": 1
        },
        "reported": {
          "$metadata": {
            "$lastUpdated": "2018-01-02T19:17:44.4383997Z"
          },
          "$version": 1
        }
      }
    },
    "hubName": "egtesthub1",
    "deviceId": "LogicAppTestDevice"
  },
  "dataVersion": "1",
  "metadataVersion": "1"
}]
```

> [!WARNING]
> *Twin data* associated with a device creation event is a default configuration and shouldn't be relied on for actual `authenticationType` and other device properties in a newly created device. For `authenticationType` and other device properties in a newly created device, use the register manager API provided in the Azure IoT SDKs.

For a detailed description of each property, see [Azure Event Grid event schema for IoT Hub](../event-grid/event-schema-iot-hub.md).

## Filter events

Event Grid enables [filtering](../event-grid/event-filtering.md) on event types, subjects, and data content. While creating the Event Grid subscription, you can choose to subscribe to selected IoT events.

* Event type: For the list of IoT Hub event types, see [event types](#event-types).
* Subject: For IoT Hub events, the subject is the device name. The subject takes the format `devices/{deviceId}`. You can filter subjects based on **Begins With** (prefix) and **Ends With** (suffix) matches. The filter uses an `AND` operator, so events with a subject that match both the prefix and suffix are delivered to the subscriber.
* Data content: The data content is populated by IoT Hub using the message format. You can choose what events are delivered based on the contents of the telemetry message. For examples, see [advanced filtering](../event-grid/event-filtering.md#advanced-filtering). For filtering on the telemetry message body, you must set the contentType to **application/json** and contentEncoding to **UTF-8** in the message [system properties](./iot-hub-devguide-routing-query-syntax.md#system-properties). Both of these properties are case insensitive.

For device telemetry events, IoT Hub will create the default [message route](iot-hub-devguide-messages-d2c.md) called *RouteToEventGrid* based on the subscription. To filter messages before telemetry data is sent, update the [routing query](iot-hub-devguide-routing-query-syntax.md).

## Limitations for device connection state events

Device connected and device disconnected events are available for devices connecting using either the MQTT or AMQP protocol, or using either of these protocols over WebSockets. Requests made only with HTTPS won't trigger device connection state notifications.

* For devices connecting using Java, Node, or Python [Azure IoT SDKs](iot-hub-devguide-sdks.md) with the [MQTT protocol](../iot/iot-mqtt-connect-to-iot-hub.md) will have connection states sent automatically. 
* For devices connecting using the Java, Node, or Python [Azure IoT SDKs](iot-hub-devguide-sdks.md) with the [AMQP protocol](iot-hub-amqp-support.md), a cloud-to-device link should be created to reduce any delay in accurate connection states. 
* For devices connecting using the .NET [Azure IoT SDK](iot-hub-devguide-sdks.md) with the [MQTT](../iot/iot-mqtt-connect-to-iot-hub.md) or [AMQP](iot-hub-amqp-support.md) protocol won’t send a device connected event until an initial device-to-cloud or cloud-to-device message is sent/received.
* Outside of the Azure IoT SDKs, in MQTT these operations equate to SUBSCRIBE or PUBLISH operations on the appropriate messaging [topics](../iot/iot-mqtt-connect-to-iot-hub.md). Over AMQP these equate to attaching or transferring a message on the [appropriate link paths](iot-hub-amqp-support.md).

### Device connection state interval

IoT Hub attempts to report each device connection state change event, but some may be missed. At minimum, IoT Hub reports connection state change events that occur 60 seconds apart from each other. This behavior may lead to outcomes such as multiple device connect events reported with no device disconnect events between them.

<!--
![Diagram that shows state change events on a device, and how those events are reported by IoT Hub.](https://user-images.githubusercontent.com/94493443/178398214-7423f7ca-8dfe-4202-8e9a-46cc70974b5e.png)
-->

## Tips for consuming events

Applications that handle IoT Hub events should follow these suggested practices:

* Multiple subscriptions can be configured to route events to the same event handler, so don't assume that events are from a particular source. Always check the message topic to ensure that it comes from the IoT hub that you expect.
* Don't assume that all events you receive are the types that you expect. Always check the eventType before processing the message.
* Messages can arrive out of order or after a delay. Use the etag field to understand if your information about objects is up to date for device created or device-deleted events.

## Next steps

* [Learn how to order device connected and disconnected events](iot-hub-how-to-order-connection-state-events.md)
* [Compare the differences between routing IoT Hub events and messages](iot-hub-event-grid-routing-comparison.md)
* [Learn more about how to use Event Grid and Azure Monitor to monitor, diagnose, and troubleshoot device connectivity to IoT Hub](iot-hub-troubleshoot-connectivity.md)
