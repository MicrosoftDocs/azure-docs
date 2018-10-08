---
title: Egress and Endpoints with Azure Digital Twins | Microsoft Docs
description: Guideline on how to create endpoints with Azure Digital Twins
author: alinamstanciu
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 10/08/2018
ms.author: alinast
---

# Egress and endpoints

Azure Digital Twins supports the concept of _endpoints_ where each endpoint represents a message/event broker that resides in the user's Azure subscription. We have currently enabled events and messages to be sent to Event Hub, Event Grid, and Service Bus Topics.

Events will be sent to the endpoints according to pre-defined routing preferences: the user can specify which endpoint should receive any of the following events:`TopologyOperation`, `UdfCustom`, `SensorChange`, `SpaceChange`, or `DeviceMessage`.

For a basic understanding of events routing and event types, refer to [Routing events and messages](concepts-events-routing.md).

## Event Types description

Here are the event formats for each of the event types:

- `TopologyOperation`

  Applies for graph changes, the `subject` property will contain the type of object affected. Types of objects that could trigger this event are: `Device, DeviceBlobMetadata`, `DeviceExtendedProperty`, `ExtendedPropertyKey`, `ExtendedType`, `KeyStore`, `Report`, `RoleDefinition`, `Sensor`, `SensorBlobMetadata`, `SensorExtendedProperty`, `Space`,  `SpaceBlobMetadata`, `SpaceExtendedProperty`, `SpaceResource`, `SpaceRoleAssignment`, `System`, `User`, `UserBlobMetadata`, `UserExtendedProperty`.

  Example:

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
    "topic": "/subscriptions/yourTopicName"
  }
  ```

    | Custom Attribute Name | Replace With |
    | --- | --- |
    | `yourTopicName` | The name of your customized topic |

- `UdfCustom`

  Represents an event sent by a user-defined function (UDF). Note, this event has to be explicitly sent from the UDF itself.

  Example:

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
    "topic": "/subscriptions/yourTopicName"
  }
  ```

    | Custom Attribute Name | Replace With |
    | --- | --- |
    | `yourTopicName` | The name of your customized topic |

- `SensorChange`

  Represents an update to a sensor's state based on telemetry changes.

  Example:

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
    "topic": "/subscriptions/yourTopicName"
  }
  ```

    | Custom Attribute Name | Replace With |
    | --- | --- |
    | `yourTopicName` | The name of your customized topic |

- `SpaceChange`

  Represents an update to a space's state based on telemetry changes.

  Example:

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
    "topic": "/subscriptions/yourTopicName"
  }
  ```

    | Custom Attribute Name | Replace With |
    | --- | --- |
    | `yourTopicName` | The name of your customized topic |

- `DeviceMessage`

  Allows you to specify an `EventHub` connection to which raw telemetry events can be routed as well from Azure Digital Twins.

> [!NOTE]
> - `DeviceMessage` is combinable only with `EventHub`; you will not be able to combine `DeviceMessage` with any of the other event types.
> - You will be able to specify only one endpoint of the combination of type `EventHub`/`DeviceMessage`.

## Configuring Endpoints

Endpoint management is exercised through the Endpoints API. Here are some examples about how to configure the different supported endpoints. Pay special attention to the event types array as it specifies the routing for the endpoint:

```plaintext
POST https://endpoints-demo.azuresmartspaces.net/management/api/v1.0/endpoints
```

- Route to **Service Bus** events types: `SensorChange`, `SpaceChange`, `TopologyOperation`

  ```JSON
  {
    "type": "ServiceBus",
    "eventTypes": [
      "SensorChange",
      "SpaceChange",
      "TopologyOperation"
    ],
    "connectionString": "Endpoint=sb://yourNamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=yourPrimaryKey",
    "secondaryConnectionString": "Endpoint=sb://yourNamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=yourSecondaryKey",
    "path": "yourTopicName"
  }
  ```

    | Custom Attribute Name | Replace With |
    | --- | --- |
    | `yourNamespace` | The namespace of your endpoint |
    | `yourPrimaryKey` | The primary key to authenticate |
    | `yourSecondaryKey` | The secondary key to authenticate |
    | `yourTopicName` | The name of your customized topic |

- Route to **Event Grid** events types: `SensorChange`, `SpaceChange`, `TopologyOperation`

  ```JSON
  {
    "type": "EventGrid",
    "eventTypes": [
      "SensorChange",
      "SpaceChange",
      "TopologyOperation"
    ],
    "connectionString": "yourPrimaryKey",
    "secondaryConnectionString": "yourSecondaryKey",
    "path": "yourTopicName.westus-1.eventgrid.azure.net"
  }
  ```

    | Custom Attribute Name | Replace With |
    | --- | --- |
    | `yourPrimaryKey` | The primary key to authenticate |
    | `yourSecondaryKey` | The secondary key to authenticate |
    | `yourTopicName` | The name of your customized topic |

- Route to **Event Hub** events types: `SensorChange`, `SpaceChange`, `TopologyOperation`

  ```JSON
  {
    "type": "EventHub",
    "eventTypes": [
      "SensorChange",
      "SpaceChange",
      "TopologyOperation"
    ],
    "connectionString": "Endpoint=sb://yourNamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=yourPrimaryKey",
    "secondaryConnectionString": "Endpoint=sb://yourNamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=yourSecondaryKey",
    "path": "yourEventHubName"
  }
  ```

    | Custom Attribute Name | Replace With |
    | --- | --- |
    | `yourNamespace` | The namespace of your endpoint |
    | `yourPrimaryKey` | The primary key to authenticate |
    | `yourSecondaryKey` | The secondary key to authenticate |
    | `yourEventHubName` | The name of your Event Hub |

- Route to **Event Hub** event types `DeviceMessage`. Note the inclusion of _EntityPath_ in the `connectionString`, which is mandatory.

  ```JSON
  {
    "type": "EventHub",
    "eventTypes": [
      "DeviceMessage"
    ],
    "connectionString": "Endpoint=sb://yourNamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=yourPrimaryKey;EntityPath=yourEventHubName",
    "secondaryConnectionString": "Endpoint=sb://yourNamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=yourSecondaryKey;EntityPath=yourEventHubName",
    "path": "yourEventHubName"
  }
  ```

    | Custom Attribute Name | Replace With |
    | --- | --- |
    | `yourNamespace` | The namespace of your endpoint |
    | `yourPrimaryKey` | The primary key to authenticate |
    | `yourSecondaryKey` | The secondary key to authenticate |
    | `yourEventHubName` | The name of your Event Hub |

> [!NOTE]
> Upon the creation of a new Endpoint, it may take up to 5 to 10 minutes to start receiving events at the endpoint.

## Primary and secondary connection strings/keys

When a primary connection string/key becomes unauthorized, the system will automatically roll to the secondary connection string/key allowing for updating the primary key through the Endpoints API. When both primary and secondary connection strings/keys are unauthorized, the system will enter an exponential back off wait of up to 30 minutes, and events will be dropped on each retry. When the system is on a back off wait state, updating connections strings/keys through the Endpoints API may take up to 30 minutes to take effect.

## Unreachable endpoints

When an endpoint becomes unreachable, the system will enter an exponential back off wait of up to 30 minutes where events will be dropped on each retry.

## Next steps

Learn how to use Azure Digital Twins Swagger:

> [!div class="nextstepaction"]
> [Azure Digital Twins Swagger](how-to-use-swagger.md)

Learn more about routing events and messages in Azure Digital Twins:

> [!div class="nextstepaction"]
> [Routing events and messages](concepts-events-routing.md)
