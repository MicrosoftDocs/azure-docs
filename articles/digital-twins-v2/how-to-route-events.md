---
# Mandatory fields.
title: Route event data
titleSuffix: Azure Digital Twins
description: See how to route Azure Digital Twins telemetry and event data to external Azure services.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 3/12/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Route telemetry and event data to outside services

Azure Digital Twins **EventRoutes APIs** let developers wire up event flow, throughout the system and to downstream services. Read more about event routes in [Route Azure Digital Twins events to external services](concepts-route-events.md).

## Define event routes

Event routes are defined using data plane APIs. A route definition can contain these elements:
* The desired route ID 
* The desired endpoint ID
* A filter that defines which events are sent to the endpoint 

If there is no route ID, no messages are routed outside of Azure Digital Twins. 
If there is a route ID and the filter is `null`, all messages are routed to the endpoint. 
If there is a route ID and a filter is added, messages will be filtered based on the filter.

> [!NOTE]
> During this preview, filters are not supported. Please use Event Grid as an endpoint with an Event Grid subscription filter to use selective messaging.

One route should allow multiple notifications and event types to be selected. 

Here is the call to the SDK that is used to add an event route:

```csharp
await client.EventRoutes.AddAsync("routeName", new EventRoute("endpointID"));
```

> [!TIP]
> All SDK functions come in synchronous and asynchronous versions.

## Overview of message formats

Notifications allow the solution backend to be notified when different actions are happening. Recall that there are several types of notifications that can be generated, and used for event routing:

[!INCLUDE [digital-twins-notifications.md](../../includes/digital-twins-notifications.md)]

Notification messages are made up of two parts: the header and the body. 

### Notification headers

Notification message headers are represented with key-value pairs. Depending on the protocol used (MQTT, AMQP, or HTTP), message headers will be serialized differently. This section discusses general header information for notification messages, regardless of the specific protocol and serialization chosen.

Some notifications conform to the CloudEvents standard. CloudEvents conformance is as follows.
* Notifications emitted from devices continue to follow the existing specifications for notifications
* Notifications processed and emitted by IoT Hub continue to follow the existing specifications for notification, except where IoT Hub chooses to support CloudEvents, such as through Event Grid
* Notifications emitted from Azure digital twin based on twin types conform to CloudEvents
* Notifications processed and emitted by Azure Digital Twins conform to CloudEvents

Services have to add a sequence number on all the notifications to indicate order of notifications, or otherwise perform their own actions to maintain ordering. Notifications emitted by Azure Digital Twins to Event Grid are formatted into the Event Grid schema, until Event Grid supports CloudEvents on input. Extension attributes on headers will be added as properties on the Event Grid schema inside of the payload. 

### Notification body examples

The bodies of notification messages are described here in JSON. Depending on the serialization desired for the message body (such as with JSON, CBOR, Protobuf, etc.), the message body may be serialized differently.

The set of fields that the body contains vary with different notification types. Here are two sample message bodies, to get an idea of what they generally look like and may include:

Telemetry message

```json
{ 
    "specversion": "1.0", 
    "type": "microsoft.iot.telemetry", 
    "source": "myhub.westcentralus.azuredigitaltwins.net", 
    "subject": "thermostat.vav-123", 
    "id": "c1b53246-19f2-40c6-bc9e-4666fa590d1a",
    "dataschema": "urn:contosocom:example:DigitalTwins:VAV:1",
    "time": "2018-04-05T17:31:00Z", 
    "datacontenttype" : "application/json", 
    "data":  
      {
          "temp": 70,
          "humidity": 40 
      }
}
```

Life-cycle notifications message

```json
{ 
    "specversion": "1.0", 
    "type": "microsoft.digitaltwins.twin.create", 
    "source": "mydigitaltwins.westcentralus.azuredigitaltwins.net", 
    "subject": "device-123", 
    "id": "c1b53246-19f2-40c6-bc9e-4666fa590d1a", 
    "time": "2018-04-05T17:31:00Z", 
    "datacontenttype" : "application/json", 
    "dataschema": "urn:contosocom:example:DigitalTwins:Device:1",           
    "data":  
      { 
        "$dtId": "room-123", 
        "property": "value",
        "$metadata": { 
                //...
        } 
      } 
}
```

## Message format detail for different event types

This section goes into more detail about the different types of notifications emitted by IoT Hub and Azure Digital Twins (or other Azure IoT services). You will read about the things that trigger each notification type, and the set of fields included with each type of notification body.

### Digital twin life-cycle notifications

All Azure digital twins emit notifications, regardless of whether they represent [IoT Hub devices in Azure Digital Twins](how-to-ingest-iot-hub-data.md) or not. This is because of life-cycle notifications, which have to do with the digital twin itself.

Life-cycle notifications are triggered when:
* An Azure digital twin is created
* An Azure digital twin is deleted

#### Properties

These are the fields in the body of a life-cycle notification.

| Name | Value |
| --- | --- |
| id | Identifier of the notification, such as a UUID or a counter maintained by the service. `source` + `id` is unique for each distinct event. |
| source | Name of the IoT hub or Azure Digital Twins instance, like *myhub.azure-devices.net* or *mydigitaltwins.westcentralus.azuredigitaltwins.net* |
| specversion | 1.0 |
| type | `Microsoft.<Service RP>.Twin.Create`<br>`Microsoft.<Service RP>.Twin.Delete`<br>`Microsoft.<Service RP>.TwinProxy.Create`<br>`Microsoft.<Service RP>.TwinProxy.Delete`<br>`Microsoft.<Service RP>.TwinProxy.Attach`<br>`Microsoft.<Service RP>.TwinProxy.Detach` |
| datacontenttype | application/json |
| subject | ID of the Azure digital twin |
| time | Timestamp for when the operation occurred on the twin |
| sequence | Value expressing the event's position in the larger ordered sequence of events. Services have to add a sequence number on all the notifications to indicate order of notifications, or otherwise perform their own actions to maintain ordering. Sequence will be incremented for each subject, and will be reset to 1 every time the object gets recreated with the same ID (such as during delete and recreate operations). |
| sequencetype | The exact value and meaning of sequence. For example, this property may specify that the value must be a string-encoded, signed, 32-bit integer that starts with 1, and increases by 1 for each subsequent value. |

#### Body details

The body is the affected digital twin, represented in JSON format. The schema for this is *Digital Twins Resource 7.1*.

For creation events, the payload reflects the state of the twin after the resource is created, so it should include all system generated-elements just like a `GET` call.

Here is an example of a body for an [IoT Plug and Play (PnP)](../iot-pnp/overview-iot-plug-and-play.md) device, with components and no top-level properties. Properties that do not make sense for devices (such as reported properties) should be omitted.

```json
{
  "$dtId": "device-digitaltwin-01",
  "thermostat": {
    "temperature": 80,
    "humidity": 45,
    "$metadata": {
      "$model": "urn:contosocom:example:Thermostat:1",
      "temperature": {
        "desiredValue": 85,
        "desiredVersion": 3,
        "ackVersion": 2,
        "ackCode": 200,
        "ackDescription": "OK"
      },
      "humidity": {
        "desiredValue": 40,
        "desiredVersion": 1,
        "ackVersion": 1,
        "ackCode": 200,
        "ackDescription": "OK"
      }
    }
  },
  "$metadata": {
    "$model": "urn:contosocom:example:Thermostat_X500:1",
  }
}
```

Here is another example of an Azure digital twin. This one is based on a twin type, and does not support components:

```json
{
  "$dtId": "logical-digitaltwin-01",
  "avgTemperature": 70,
  "comfortIndex": 85,
  "$metadata": {
    "$model": "urn:contosocom:example:Building:1",
    "$kind": "DigitalTwin",
    "avgTemperature": {
      "desiredValue": 72,
      "desiredVersion": 5,
      "ackVersion": 4,
      "ackCode": 200,
      "ackDescription": "OK"
    },
    "comfortIndex": {
      "desiredValue": 90,
      "desiredVersion": 1,
      "ackVersion": 3,
      "ackCode": 200,
      "ackDescription": "OK"
    }
  }
}
```

### Digital twin edge change notifications

Edge change notifications are triggered when any relationship of an Azure digital twin is created, updated, or deleted. 

#### Properties

These are the fields in the body of an edge change notification.

| Name    | Value |
| --- | --- |
| id    | Identifier of the notification, such as a UUID or a counter maintained by the service. `source` + `id` is unique for each distinct event |
| source    | Name of the Azure Digital Twins instance, like *mydigitaltwins.westcentralus.azuredigitaltwins.net* |
| specversion    | 1.0 |
| type    | `Microsoft.<Service RP>.Edge.Create`<br>`Microsoft.<Service RP>.Edge.Update`<br>`Microsoft.<Service RP>.Edge.Delete`<br>`datacontenttype    application/json for Edge.Create`<br>`application/json-patch+json for Edge.Update` |
| subject    | ID of the relationship, like `<twinID>/relationships/<relationshipName>/<edgeID>` |
| time    | Timestamp for when the operation occurred on the relationship |
| sequence | Value expressing the event's position in the larger ordered sequence of events. Services have to add a sequence number on all the notifications to indicate order of notifications, or otherwise perform their own actions to maintain ordering. Sequence will be incremented for each subject, and will be reset to 1 every time the object gets recreated with the same ID (such as during delete and recreate operations). |
| sequencetype | The exact value and meaning of sequence. For example, this property may specify that the value must be a string-encoded, signed, 32-bit integer that starts with 1, and increases by 1 for each subsequent value. |

#### Body details

The body is the payload of a relationship, also in JSON format. It uses the same format as a `GET` request for a relationship via the [DigitalTwins API](how-to-use-apis.md). 

"Updating a relationship" means properties of the relationship have changed. 

Here is an example of an update edge notification to update a property:

```json
[
  {
    "op": "replace",
    "path": "ownershipUser",
    "value": "user3"
  }
]
```

For `Edge.Delete`, the body is the same as the `GET` request, and it gets the latest state before deletion.

Here is an example of a create or delete edge notification:

```json
{
    "$edgeId": "EdgeId1",
    "$sourceId": "building11",
    "$relationship": "Contains",
    "$targetId": "floor11",
    "ownershipUser": "user1",
    "ownershipDepartment": "Operations"
}
```

### Digital twin type change notifications

Twin type change notifications are triggered when a Digital Twins Definition Language (DTDL) [twin type](concepts-twin-types.md) is uploaded, reloaded, patched, decommissioned, or deleted.

#### Properties

These are the fields in the body of a twin type change notification.

| Name    | Value |
| --- | --- |
| id    | Identifier of the notification, such as a UUID or a counter maintained by the service. `source` + `id` is unique for each distinct event |
| source    | Name of the IoT hub or Azure Digital Twins instance, like *myhub.azure-devices.net* or *mydigitaltwins.westcentralus.azuredigitaltwins.net* |
| specversion    | 1.0 |
| type    | `Microsoft.<Service RP>.Model.Upload`<br>`Microsoft.<Service RP>.Model.Reload` (Hub-specific)<br>`Microsoft.<Service RP>.Model.Patch` (Hub-specific)<br>`Microsoft.<Service RP>.Model.Decom`<br>`Microsoft.<Service RP>.Model.Delete` |
| datacontenttype    | application/json |
| subject    | ID of the twin type, in the form `urn:<domain>:<unique twin type identifier>:<twin type version number>` |
| time    | Timestamp for when the operation occurred on the twin type |
| sequence    | Value expressing the event's position in the larger ordered sequence of events. Services have to add a sequence number on all the notifications to indicate order of notifications, or otherwise perform their own actions to maintain ordering. Sequence will be incremented for each subject, and will be reset to 1 every time the object gets recreated with the same ID (such as during delete and recreate operations). |
| sequencetype    | The exact value and meaning of sequence. For example, this property may specify that the value must be a string-encoded, signed, 32-bit integer that starts with 1, and increases by 1 for each subsequent value |
| modelstatus    | The resolution status for resolving a twin type. Possible values: Successful/NotFound/Failed (IoT Hub only) | 
| updatereason    | Update twin type reason in the schema. Possible values: Create/Reset/Override (IoT Hub only) | 

#### Body details

There is no message body for upload, reload, and patch twin type actions. The user must make a `GET` call to get the twin type content. 

For and `Model.Decom`, the body of the patch will be in JSON patch format, like all other patch APIs in the Azure Digital Twins API surface. So, to decommission a twin type, you would use:

```json
[
  {
    "op": "replace",
    "path": "/decommissionedState",
    "value": true
  }
]
```

For `Model.Delete`, the request body is the same as a `GET` request, and it gets the latest state before deletion.

### Digital twin change notifications

These notifications are triggered when an Azure digital twin is being updated, like:
* When property values or metadata changes.
* When digital twin or component metadata changes. An example of this scenario is changing the twin type of a digital twin.

#### Properties

These are the fields in the body of a digital twin change notification.

| Name    | Value |
| --- | --- |
| id    | Identifier of the notification, such as a UUID or a counter maintained by the service. `source` + `id` is unique for each distinct event |
| source    | Name of the IoT hub or Azure Digital Twins instance, like *myhub.azure-devices.net* or *mydigitaltwins.westcentralus.azuredigitaltwins.net*
| specversion    | 1.0 |
| type    | `Microsoft.<Service RP>.Twin.Update` |
| datacontenttype    | application/json-patch+json |
| subject    | ID of the digital twin |
| time    | Timestamp for when the operation occurred on the digital twin |
| sequence | Value expressing the event's position in the larger ordered sequence of events. Services have to add a sequence number on all the notifications to indicate order of notifications, or otherwise perform their own actions to maintain ordering. Sequence will be incremented for each subject, and will be reset to 1 every time the object gets recreated with the same ID (such as during delete and recreate operations). |
| sequencetype | The exact value and meaning of sequence. For example, this property may specify that the value must be a string-encoded, signed, 32-bit integer that starts with 1, and increases by 1 for each subsequent value. |

#### Body details

The body for the `Twin.Update` notification is a JSON Patch document containing the update to the Azure digital twin.

For example, say that a digital twin was updated using the following Patch.

```json
[
  {
    "op": "replace",
    "path": "/mycomp/prop1",
    "value": {"a":3}
  }
]
```

The corresponding notification (if synchronously executed by the service, such as Azure Digital Twins updating a digital twin) would have a body like:

```json
[
    { "op": "replace", "path": "/myComp/prop1", "value": {"a": 3}},
    { "op": "replace", "path": "/myComp/$metadata/prop1",
        "value": {
            "desiredValue": { "a": 3 },
            "desiredVersion": 2,
                "ackCode": 200,
            "ackVersion": 2 
        }
    }
]
```

## Next steps

Learn more about the Azure Digital Twins APIs:
* [Use the Azure Digital Twins APIs](how-to-use-apis.md)