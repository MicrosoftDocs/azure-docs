---
title: Egress and endpoints - Azure Digital Twins | Microsoft Docs
description: Learn how to create and egress event endpoints in Azure Digital Twins.
ms.author: alinast
author: alinamstanciu
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 01/21/2020
---

# Egress and endpoints in Azure Digital Twins

Azure Digital Twins *endpoints* represent a message or event broker within a user's Azure subscription. Events and messages can be sent to Azure Event Hubs, Azure Event Grid, and Azure Service Bus topics.

Events are routed to endpoints according to predefined routing preferences. Users specify which *event types* each endpoint may receive.

To learn more about events, routing, and event types, refer to [Routing events and messages in Azure Digital Twins](./concepts-events-routing.md).

## Events

Events are sent by IoT objects (such as devices and sensors) for processing by Azure message and event brokers. Events are defined by the following [Azure Event Grid event schema reference](../event-grid/event-schema.md).

```JSON
{
  "id": "00000000-0000-0000-0000-000000000000",
  "subject": "ExtendedPropertyKey",
  "data": {
    "SpacesToNotify": [
      "3a16d146-ca39-49ee-b803-17a18a12ba36"
    ],
    "Id": "00000000-0000-0000-0000-000000000000",
      "Type": "ExtendedPropertyKey",
    "AccessType": "Create"
  },
  "eventType": "TopologyOperation",
  "eventTime": "2018-04-17T17:41:54.9400177Z",
  "dataVersion": "1",
  "metadataVersion": "1",
  "topic": "/subscriptions/YOUR_TOPIC_NAME"
}
```

| Attribute | Type | Description |
| --- | --- | --- |
| id | string | Unique identifier for the event. |
| subject | string | Publisher-defined path to the event subject. |
| data | object | Event data specific to the resource provider. |
| eventType | string | One of the registered event types for this event source. |
| eventTime | string | The time the event is generated based on the provider's UTC time. |
| dataVersion | string | The schema version of the data object. The publisher defines the schema version. |
| metadataVersion | string | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |
| topic | string | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |

For more information about the Event Grid event schema:

- Review the [Azure Event Grid event schema reference](../event-grid/event-schema.md).
- Read the [Azure EventGrid Node.js SDK EventGridEvent reference](https://docs.microsoft.com/javascript/api/@azure/eventgrid/eventgridevent?view=azure-node-latest).

## Event types

Events types classify the nature of the event and are set in the **eventType** field. Available event types are given by the following list:

- TopologyOperation
- UdfCustom
- SensorChange
- SpaceChange
- DeviceMessage

The event formats for each event type are further described in the following subsections.

### TopologyOperation

**TopologyOperation** applies to graph changes. The **subject** property specifies the type of object affected. The following types of objects might trigger this event:

- Device
- DeviceBlobMetadata
- DeviceExtendedProperty
- ExtendedPropertyKey
- ExtendedType
- KeyStore
- Report
- RoleDefinition
- Sensor
- SensorBlobMetadata
- SensorExtendedProperty
- Space
- SpaceBlobMetadata
- SpaceExtendedProperty
- SpaceResource
- SpaceRoleAssignment
- System
- User
- UserBlobMetadata
- UserExtendedProperty

#### Example

```JSON
{
  "id": "00000000-0000-0000-0000-000000000000",
  "subject": "ExtendedPropertyKey",
  "data": {
    "SpacesToNotify": [
      "3a16d146-ca39-49ee-b803-17a18a12ba36"
    ],
    "Id": "00000000-0000-0000-0000-000000000000",
      "Type": "ExtendedPropertyKey",
    "AccessType": "Create"
  },
  "eventType": "TopologyOperation",
  "eventTime": "2018-04-17T17:41:54.9400177Z",
  "dataVersion": "1",
  "metadataVersion": "1",
  "topic": "/subscriptions/YOUR_TOPIC_NAME"
}
```

| Value | Replace with |
| --- | --- |
| YOUR_TOPIC_NAME | The name of your customized topic |

### UdfCustom

**UdfCustom** is an event sent by a user-defined function (UDF).
  
> [!IMPORTANT]  
> This event must be explicitly sent from the UDF itself.

#### Example

```JSON
{
  "id": "568fd394-380b-46fa-925a-ebb96f658cce",
  "subject": "UdfCustom",
  "data": {
    "TopologyObjectId": "7c799bfc-1bff-4b9e-b15a-669933969d20",
    "ResourceType": "Space",
    "Payload": "\"Room is not available or air quality is poor\"",
    "CorrelationId": "568fd394-380b-46fa-925a-ebb96f658cce"
  },
  "eventType": "UdfCustom",
  "eventTime": "2018-10-02T06:50:15.198Z",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "topic": "/subscriptions/YOUR_TOPIC_NAME"
}
```

| Value | Replace with |
| --- | --- |
| YOUR_TOPIC_NAME | The name of your customized topic |

### SensorChange

**SensorChange** is an update to a sensor's state based on telemetry changes.

#### Example

```JSON
{
  "id": "60bf5336-2929-45b4-bb4c-b45699dfe95f",
  "subject": "SensorChange",
  "data": {
    "Type": "Classic",
    "DataType": "Motion",
    "Id": "60bf5336-2929-45b4-bb4c-b45699dfe95f",
    "Value": "False",
    "PreviousValue": "True",
    "EventTimestamp": "2018-04-17T17:46:15.4964262Z",
    "MessageType": "sensor",
    "Properties": {
      "ms-client-request-id": "c9e576b7-5eea-4f61-8617-92a57add5179",
      "ms-activity-id": "ct22YwXEGJ5u.605.0"
    }
  },
  "eventType": "SensorChange",
  "eventTime": "2018-04-17T17:46:18.5452993Z",
  "dataVersion": "1",
  "metadataVersion": "1",
  "topic": "/subscriptions/YOUR_TOPIC_NAME"
}
```

| Value | Replace with |
| --- | --- |
| YOUR_TOPIC_NAME | The name of your customized topic |

### SpaceChange

**SpaceChange** is an update to a space's state based on telemetry changes.

#### Example

```JSON
{
  "id": "42522e10-b1aa-42ff-a5e7-7181788ffc4b",
  "subject": "SpaceChange",
  "data": {
    "Type": null,
    "DataType": "AvailableAndFresh",
    "Id": "7c799bfc-1bff-4b9e-b15a-669933969d20",
    "Value": "Room is not available or air quality is poor",
    "PreviousValue": null,
    "RawData": null,
    "transactionId": null,
    "EventTimestamp": null,
    "MessageType": null,
    "Properties": null,
    "CorrelationId": "42522e10-b1aa-42ff-a5e7-7181788ffc4b"
  },
  "eventType": "SpaceChange",
  "eventTime": "2018-10-02T06:50:20.128Z",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "topic": "/subscriptions/YOUR_TOPIC_NAME"
}
```

| Value | Replace with |
| --- | --- |
| YOUR_TOPIC_NAME | The name of your customized topic |

### DeviceMessage

By using **DeviceMessage**, you can specify an **EventHub** connection to which raw telemetry events can be routed as well from Azure Digital Twins.

> [!NOTE]
> - **DeviceMessage** is combinable only with **EventHub**. You can't combine **DeviceMessage** with any of the other event types.
> - You can specify only one endpoint of the combination of type **EventHub** or **DeviceMessage**.

## Configure endpoints

Endpoint management is exercised through the Endpoints API.

[!INCLUDE [Digital Twins Management API](../../includes/digital-twins-management-api.md)]

The following examples demonstrate how to configure the supported endpoints.

>[!IMPORTANT]
> Pay careful attention to the **eventTypes** attribute. It defines which event types are handled by the endpoint and thus determine its routing.

An authenticated HTTP POST request against:

```URL
YOUR_MANAGEMENT_API_URL/endpoints
```

- Route to Service Bus event types **SensorChange**, **SpaceChange**, and **TopologyOperation**:

  ```JSON
  {
    "type": "ServiceBus",
    "eventTypes": [
      "SensorChange",
      "SpaceChange",
      "TopologyOperation"
    ],
    "connectionString": "Endpoint=sb://YOUR_NAMESPACE.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=YOUR_PRIMARY_KEY",
    "secondaryConnectionString": "Endpoint=sb://YOUR_NAMESPACE.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=YOUR_SECONDARY_KEY",
    "path": "YOUR_TOPIC_NAME"
  }
  ```

    | Value | Replace with |
    | --- | --- |
    | YOUR_NAMESPACE | The namespace of your endpoint |
    | YOUR_PRIMARY_KEY | The primary connection string used to authenticate |
    | YOUR_SECONDARY_KEY | The secondary connection string used to authenticate |
    | YOUR_TOPIC_NAME | The name of your customized topic |

- Route to Event Grid event types **SensorChange**, **SpaceChange**, and **TopologyOperation**:

  ```JSON
  {
    "type": "EventGrid",
    "eventTypes": [
      "SensorChange",
      "SpaceChange",
      "TopologyOperation"
    ],
    "connectionString": "YOUR_PRIMARY_KEY",
    "secondaryConnectionString": "YOUR_SECONDARY_KEY",
    "path": "YOUR_TOPIC_NAME.westus-1.eventgrid.azure.net"
  }
  ```

    | Value | Replace with |
    | --- | --- |
    | YOUR_PRIMARY_KEY | The primary connection string used to authenticate|
    | YOUR_SECONDARY_KEY | The secondary connection string used to authenticate |
    | YOUR_TOPIC_NAME | The name of your customized topic |

- Route to Event Hubs event types **SensorChange**, **SpaceChange**, and **TopologyOperation**:

  ```JSON
  {
    "type": "EventHub",
    "eventTypes": [
      "SensorChange",
      "SpaceChange",
      "TopologyOperation"
    ],
    "connectionString": "Endpoint=sb://YOUR_NAMESPACE.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=YOUR_PRIMARY_KEY",
    "secondaryConnectionString": "Endpoint=sb://YOUR_NAMESPACE.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=YOUR_SECONDARY_KEY",
    "path": "YOUR_EVENT_HUB_NAME"
  }
  ```

    | Value | Replace with |
    | --- | --- |
    | YOUR_NAMESPACE | The namespace of your endpoint |
    | YOUR_PRIMARY_KEY | The primary connection string used to authenticate |
    | YOUR_SECONDARY_KEY | The secondary connection string used to authenticate |
    | YOUR_EVENT_HUB_NAME | The name of your event hub |

- Route to Event Hubs event type **DeviceMessage**. The inclusion of `EntityPath` in the **connectionString** is mandatory:

  ```JSON
  {
    "type": "EventHub",
    "eventTypes": [
      "DeviceMessage"
    ],
    "connectionString": "Endpoint=sb://YOUR_NAMESPACE.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=YOUR_PRIMARY_KEY;EntityPath=YOUR_EVENT_HUB_NAME",
    "secondaryConnectionString": "Endpoint=sb://YOUR_NAMESPACE.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=YOUR_SECONDARY_KEY;EntityPath=YOUR_EVENT_HUB_NAME",
    "path": "YOUR_EVENT_HUB_NAME"
  }
  ```

    | Value | Replace with |
    | --- | --- |
    | YOUR_NAMESPACE | The namespace of your endpoint |
    | YOUR_PRIMARY_KEY | The primary connection string used to authenticate |
    | YOUR_SECONDARY_KEY | The secondary connection string used to authenticate |
    | YOUR_EVENT_HUB_NAME | The name of your event hub |

> [!NOTE]  
> Upon the creation of a new endpoint, it might take up to 5 to 10 minutes to start receiving events at the endpoint.

## Primary and secondary connection keys

When a primary connection key becomes unauthorized, the system automatically tries the secondary connection key. That provides a backup and allows the possibility to gracefully authenticate and update the primary key through the Endpoints API.

If both the primary and secondary connection keys are unauthorized, the system enters an exponential back-off wait time of up to 30 minutes. Events are dropped on each triggered back-off wait time.

Whenever the system is in a back-off wait state, updating connections keys through the Endpoints API might take up to 30 minutes to take effect.

## Unreachable endpoints

When an endpoint becomes unreachable, the system enters an exponential back-off wait time of up to 30 minutes. Events are dropped on each triggered back-off wait time.

## Next steps

- Learn [how to use Azure Digital Twins Swagger](how-to-use-swagger.md).

- Learn more about [routing events and messages](concepts-events-routing.md) in Azure Digital Twins.
