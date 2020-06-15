---
# Mandatory fields.
title: Interpret event data
titleSuffix: Azure Digital Twins
description: See how to interpret different event types and their different notification messages.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 3/12/2020
ms.topic: how-to
ms.service: digital-twins
ROBOTS: NOINDEX, NOFOLLOW

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Understand event data

[!INCLUDE [Azure Digital Twins current preview status](../../includes/digital-twins-preview-status.md)]

Different events in Azure Digital Twins produce **notifications**, which allow the solution backend to be aware when different actions are happening. These are then [routed](concepts-route-events.md) to different locations inside and outside of Azure Digital Twins that can use this information to take action.

There are several types of notifications that can be generated, and notification messages may look different depending on which type of event generated them. This article gives detail about different types of messages, and what they might look like.

This chart shows the different notification types:

[!INCLUDE [digital-twins-notifications.md](../../includes/digital-twins-notifications.md)]

In general, notifications are made up of two parts: the header and the body. 

### Event notification headers

Notification message headers are represented with key-value pairs. Depending on the protocol used (MQTT, AMQP, or HTTP), message headers will be serialized differently. This section discusses general header information for notification messages, regardless of the specific protocol and serialization chosen.

Some notifications conform to the CloudEvents standard. CloudEvents conformance is as follows.
* Notifications emitted from devices continue to follow the existing specifications for notifications
* Notifications processed and emitted by IoT Hub continue to follow the existing specifications for notification, except where IoT Hub chooses to support CloudEvents, such as through Event Grid
* Notifications emitted from [digital twins](concepts-twins-graph.md) with a [model](concepts-models.md) conform to CloudEvents
* Notifications processed and emitted by Azure Digital Twins conform to CloudEvents

Services have to add a sequence number on all the notifications to indicate their order, or maintain their own ordering in some other way. Notifications emitted by Azure Digital Twins to Event Grid are formatted into the Event Grid schema, until Event Grid supports CloudEvents on input. Extension attributes on headers will be added as properties on the Event Grid schema inside of the payload. 

### Event notification bodies

The bodies of notification messages are described here in JSON. Depending on the serialization desired for the message body (such as with JSON, CBOR, Protobuf, etc.), the message body may be serialized differently.

The set of fields that the body contains vary with different notification types. Here are two sample message bodies, to get an idea of what they generally look like and may include.

Telemetry message:

```json
{ 
    "specversion": "1.0", 
    "type": "microsoft.iot.telemetry", 
    "source": "myhub.westus2.azuredigitaltwins.net", 
    "subject": "thermostat.vav-123", 
    "id": "c1b53246-19f2-40c6-bc9e-4666fa590d1a",
    "dataschema": "dtmi:com:contoso:DigitalTwins:VAV;1",
    "time": "2018-04-05T17:31:00Z", 
    "datacontenttype" : "application/json", 
    "data":  
      {
          "temp": 70,
          "humidity": 40 
      }
}
```

Life-cycle notification message:

```json
{ 
    "specversion": "1.0", 
    "type": "microsoft.digitaltwins.twin.create", 
    "source": "mydigitaltwins.westus2.azuredigitaltwins.net", 
    "subject": "device-123", 
    "id": "c1b53246-19f2-40c6-bc9e-4666fa590d1a", 
    "time": "2018-04-05T17:31:00Z", 
    "datacontenttype" : "application/json", 
    "dataschema": "dtmi:com:contoso:DigitalTwins:Device;1",           
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

## Message-format detail for different event types

This section goes into more detail about the different types of notifications emitted by IoT Hub and Azure Digital Twins (or other Azure IoT services). You will read about the things that trigger each notification type, and the set of fields included with each type of notification body.

### Digital twin life-cycle notifications

All [digital twins](concepts-twins-graph.md) emit notifications, regardless of whether they represent [IoT Hub devices in Azure Digital Twins](how-to-ingest-iot-hub-data.md) or not. This is because of **life-cycle notifications**, which are about the digital twin itself.

Life-cycle notifications are triggered when:
* A digital twin is created
* A digital twin is deleted

#### Properties

Here are the fields in the body of a life-cycle notification.

| Name | Value |
| --- | --- |
| `id` | Identifier of the notification, such as a UUID or a counter maintained by the service. `source` + `id` is unique for each distinct event. |
| `source` | Name of the IoT hub or Azure Digital Twins instance, like *myhub.azure-devices.net* or *mydigitaltwins.westus2.azuredigitaltwins.net* |
| `specversion` | 1.0 |
| `type` | `Microsoft.DigitalTwins.Twin.Create`<br>`Microsoft.DigitalTwins.Twin.Delete`<br>`Microsoft.DigitalTwins.TwinProxy.Create`<br>`Microsoft.DigitalTwins.TwinProxy.Delete`<br>`Microsoft.DigitalTwins.TwinProxy.Attach`<br>`Microsoft.DigitalTwins.TwinProxy.Detach` |
| `datacontenttype` | application/json |
| `subject` | ID of the digital twin |
| `time` | Timestamp for when the operation occurred on the twin |
| `sequence` | Value expressing the event's position in the larger ordered sequence of events. Services have to add a sequence number on all the notifications to indicate their order, or maintain their own ordering in some other way. The sequence number increments with each message. It will be reset to 1 if the object is deleted and recreated with the same ID. |
| `sequencetype` | More detail about how the sequence field is used. For example, this property may specify that the value must be a signed 32-bit integer, which starts at 1 and increases by 1 each time. |

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
      "$model": "dtmi:com:contoso:Thermostat;1",
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
    "$model": "dtmi:com:contoso:Thermostat_X500;1",
  }
}
```

Here is another example of a digital twin. This one is based on a [model](concepts-models.md), and does not support components:

```json
{
  "$dtId": "logical-digitaltwin-01",
  "avgTemperature": 70,
  "comfortIndex": 85,
  "$metadata": {
    "$model": "dtmi:com:contoso:Building;1",
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

### Digital twin relationship change notifications

**Relationship change notifications** are triggered when any relationship of a digital twin is created, updated, or deleted. 

#### Properties

Here are the fields in the body of an edge change notification.

| Name    | Value |
| --- | --- |
| `id` | Identifier of the notification, such as a UUID or a counter maintained by the service. `source` + `id` is unique for each distinct event |
| `source` | Name of the Azure Digital Twins instance, like *mydigitaltwins.westus2.azuredigitaltwins.net* |
| `specversion` | 1.0 |
| `type` | `Microsoft.DigitalTwins.Relationship.Create`<br>`Microsoft.DigitalTwins.Relationship.Update`<br>`Microsoft.DigitalTwins.Relationship.Delete`<br>`datacontenttype    application/json for Relationship.Create`<br>`application/json-patch+json for Relationship.Update` |
| `subject` | ID of the relationship, like `<twinID>/relationships/<relationshipName>/<edgeID>` |
| `time` | Timestamp for when the operation occurred on the relationship |
| `sequence` | Value expressing the event's position in the larger ordered sequence of events. Services have to add a sequence number on all the notifications to indicate their order, or maintain their own ordering in some other way. The sequence number increments with each message. It will be reset to 1 if the object is deleted and recreated with the same ID. |
| `sequencetype` | More detail about how the sequence field is used. For example, this property may specify that the value must be a signed 32-bit integer, which starts at 1 and increases by 1 each time. |

#### Body details

The body is the payload of a relationship, also in JSON format. It uses the same format as a `GET` request for a relationship via the [DigitalTwins API](how-to-use-apis-sdks.md). 

"Updating a relationship" means properties of the relationship have changed. 

Here is an example of an update relationship notification to update a property:

```json
[
  {
    "op": "replace",
    "path": "ownershipUser",
    "value": "user3"
  }
]
```

For `Relationship.Delete`, the body is the same as the `GET` request, and it gets the latest state before deletion.

Here is an example of a create or delete relationship notification:

```json
{
    "$relationshipId": "EdgeId1",
    "$sourceId": "building11",
    "$relationshipName": "Contains",
    "$targetId": "floor11",
    "ownershipUser": "user1",
    "ownershipDepartment": "Operations"
}
```

### Digital twin model change notifications

**Model change notifications** are triggered when a Digital Twins Definition Language (DTDL) [model](concepts-models.md) is uploaded, reloaded, patched, decommissioned, or deleted.

#### Properties

Here are the fields in the body of a model change notification.

| Name    | Value |
| --- | --- |
| `id` | Identifier of the notification, such as a UUID or a counter maintained by the service. `source` + `id` is unique for each distinct event |
| `source` | Name of the IoT hub or Azure Digital Twins instance, like *myhub.azure-devices.net* or *mydigitaltwins.westus2.azuredigitaltwins.net* |
| `specversion` | 1.0 |
| `type` | `Microsoft.DigitalTwins.Model.Upload`<br>`Microsoft.DigitalTwins.Model.Reload` (Hub-specific)<br>`Microsoft.DigitalTwins.Model.Patch` (Hub-specific)<br>`Microsoft.DigitalTwins.Model.Decom`<br>`Microsoft.DigitalTwins.Model.Delete` |
| `datacontenttype` | application/json |
| `subject` | ID of the model, in the form `dtmi:<domain>:<unique model identifier>;<model version number>` |
| `time` | Timestamp for when the operation occurred on the model |
| `sequence` | Value expressing the event's position in the larger ordered sequence of events. Services have to add a sequence number on all the notifications to indicate their order, or maintain their own ordering in some other way. The sequence number increments with each message. It will be reset to 1 if the object is deleted and recreated with the same ID. |
| `sequencetype` | More detail about how the sequence field is used. For example, this property may specify that the value must be a signed 32-bit integer, which starts at 1 and increases by 1 each time. |
| `modelstatus` | The resolution status for resolving a model. Possible values: Successful/NotFound/Failed (IoT Hub only) | 
| `updatereason` | Update model reason in the schema. Possible values: Create/Reset/Override (IoT Hub only) | 

#### Body details

There is no message body for the actions of uploading, reloading, and patching models. The user must make a `GET` call to get the model content. 

For and `Model.Decom`, the body of the patch will be in JSON patch format, like all other patch APIs in the Azure Digital Twins API surface. So, to decommission a model, you would use:

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

**Digital twin change notifications** are triggered when a digital twin is being updated, like:
* When property values or metadata changes.
* When digital twin or component metadata changes. An example of this scenario is changing the model of a digital twin.

#### Properties

Here are the fields in the body of a digital twin change notification.

| Name    | Value |
| --- | --- |
| `id` | Identifier of the notification, such as a UUID or a counter maintained by the service. `source` + `id` is unique for each distinct event |
| `source` | Name of the IoT hub or Azure Digital Twins instance, like *myhub.azure-devices.net* or *mydigitaltwins.westus2.azuredigitaltwins.net*
| `specversion` | 1.0 |
| `type` | `Microsoft.DigitalTwins.Twin.Update` |
| `datacontenttype` | application/json-patch+json |
| `subject` | ID of the digital twin |
| `time` | Timestamp for when the operation occurred on the digital twin |
| `sequence` | Value expressing the event's position in the larger ordered sequence of events. Services have to add a sequence number on all the notifications to indicate their order, or maintain their own ordering in some other way. The sequence number increments with each message. It will be reset to 1 if the object is deleted and recreated with the same ID. |
| `sequencetype` | More detail about how the sequence field is used. For example, this property may specify that the value must be a signed 32-bit integer, which starts at 1 and increases by 1 each time. |

#### Body details

The body for the `Twin.Update` notification is a JSON Patch document containing the update to the digital twin.

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

See how to create endpoints and routes to deliver events:
* [How-to: Manage endpoints and routes](how-to-manage-routes.md)

Or, learn more about the Azure Digital Twins APIs and SDK options:
* [How-to: Use the Azure Digital Twins APIs and SDKs](how-to-use-apis-sdks.md)