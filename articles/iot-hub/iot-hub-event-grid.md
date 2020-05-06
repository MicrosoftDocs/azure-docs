---
title: Azure IoT Hub and Event Grid | Microsoft Docs
description: Use Azure Event Grid to trigger processes based on actions that happen in IoT Hub.  
author: robinsh
manager: philmea
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 02/20/2019
ms.author: robinsh
ms.custom: [amqp, mqtt]
---

# React to IoT Hub events by using Event Grid to trigger actions

Azure IoT Hub integrates with Azure Event Grid so that you can send event notifications to other services and trigger downstream processes. Configure your business applications to listen for IoT Hub events so that you can react to critical events in a reliable, scalable, and secure manner. For example, build an application that updates a database, creates a work ticket, and delivers an email notification every time a new IoT device is registered to your IoT hub.

[Azure Event Grid](../event-grid/overview.md) is a fully managed event routing service that uses a publish-subscribe model. Event Grid has built-in support for Azure services like [Azure Functions](../azure-functions/functions-overview.md) and [Azure Logic Apps](../logic-apps/logic-apps-what-are-logic-apps.md), and can deliver event alerts to non-Azure services using webhooks. For a complete list of the event handlers that Event Grid supports, see [An introduction to Azure Event Grid](../event-grid/overview.md).

![Azure Event Grid architecture](./media/iot-hub-event-grid/event-grid-functional-model.png)

## Regional availability

The Event Grid integration is available for IoT hubs located in the regions where Event Grid is supported. For the latest list of regions, see [An introduction to Azure Event Grid](../event-grid/overview.md).

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

### Device Telemetry schema

Device telemetry message must be in a valid JSON format with the contentType set to **application/json** and contentEncoding set to **UTF-8** in the message [system properties](iot-hub-devguide-routing-query-syntax.md#system-properties). Both of these properties are case insensitive. If the content encoding is not set, then IoT Hub will write the messages in base 64 encoded format.

You can enrich device telemetry events before they are published to Event Grid by selecting the endpoint as Event Grid. For more information, see [Message Enrichments Overview](iot-hub-message-enrichments-overview.md).

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

For a detailed description of each property, see [Azure Event Grid event schema for IoT Hub](../event-grid/event-schema-iot-hub.md).

## Filter events

IoT Hub event subscriptions can filter events based on event type, data content and subject, which is the device name.

Event Grid enables [filtering](../event-grid/event-filtering.md) on event types, subjects and data content. While creating the Event Grid subscription, you can choose to subscribe to selected IoT events. Subject filters in Event Grid work based on **Begins With** (prefix) and **Ends With** (suffix) matches. The filter uses an `AND` operator, so events with a subject that match both the prefix and suffix are delivered to the subscriber.

The subject of IoT Events uses the format:

```json
devices/{deviceId}
```

Event Grid also allows for filtering on attributes of each event, including the data content. This allows you to choose what events are delivered based contents of the telemetry message. Please see [advanced filtering](../event-grid/event-filtering.md#advanced-filtering) to view examples. For filtering on the telemetry message body, you must set the contentType to **application/json** and contentEncoding to **UTF-8** in the message [system properties](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-routing-query-syntax#system-properties). Both of these properties are case insensitive.

For non-telemetry events like DeviceConnected, DeviceDisconnected, DeviceCreated and DeviceDeleted, the Event Grid filtering can be used when creating the subscription. For telemetry events, in addition to the filtering in Event Grid, users can also filter on device twins, message properties and body through the message routing query. 

When you subscribe to telemetry events via Event Grid, IoT Hub creates a default message route to send data source type device messages to Event Grid. For more information about message routing, see [IoT Hub message routing](iot-hub-devguide-messages-d2c.md). This route will be visible in the portal under IoT Hub > Message Routing. Only one route to Event Grid is created regardless of the number of EG subscriptions created for telemetry events. So, if you need several subscriptions with different filters, you can use the OR operator in these queries on the same route. The creation and deletion of the route is controlled through subscription of telemetry events via Event Grid. You cannot create or delete a route to Event Grid using IoT Hub Message Routing.

To filter messages before telemetry data is sent, you can update your [routing query](iot-hub-devguide-routing-query-syntax.md). Note that routing query can be applied to the message body only if the body is JSON. You must also set the contentType to **application/json** and contentEncoding to **UTF-8** in the message [system properties](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-routing-query-syntax#system-properties).

## Limitations for device connected and device disconnected events

To receive device connection state events, a device must do either a 'D2C Send Telemetry' OR a 'C2D Receive Message' operation with Iot Hub. However, note that if a device is using AMQP protocol to connect with Iot Hub, it is recommended that they do a 'C2D Receive Message' operation otherwise their connection state notifications may be delayed by few minutes. If your device is using MQTT protocol, IoT Hub will keep the C2D link open. For AMQP, you can open the C2D link by calling the [Receive Async API](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client.deviceclient.receiveasync?view=azure-dotnet), for IoT Hub C# SDK, or [device client for AMQP](iot-hub-amqp-support.md#device-client).

The D2C link is open if you are sending telemetry. 

If the device connection is flickering, which means the device connects and disconnects frequently, we will not send every single connection state, but will publish the current connection state taken at a periodic snapshot, till the flickering continues. Receiving either the same connection state event with different sequence numbers or different connection state events both mean that there was a change in the device connection state.

## Tips for consuming events

Applications that handle IoT Hub events should follow these suggested practices:

* Multiple subscriptions can be configured to route events to the same event handler, so don't assume that events are from a particular source. Always check the message topic to ensure that it comes from the IoT hub that you expect.

* Don't assume that all events you receive are the types that you expect. Always check the eventType before processing the message.

* Messages can arrive out of order or after a delay. Use the etag field to understand if your information about objects is up-to-date for device created or device deleted events.

## Next steps

* [Try the IoT Hub events tutorial](../event-grid/publish-iot-hub-events-to-logic-apps.md)

* [Learn how to order device connected and disconnected events](iot-hub-how-to-order-connection-state-events.md)

* [Learn more about Event Grid](../event-grid/overview.md)

* [Compare the differences between routing IoT Hub events and messages](iot-hub-event-grid-routing-comparison.md)

* [Learn how to use IoT telemetry events to implement IoT spatial analytics using Azure Maps](../azure-maps/tutorial-iot-hub-maps.md#create-an-azure-function-and-add-an-event-grid-subscription)
