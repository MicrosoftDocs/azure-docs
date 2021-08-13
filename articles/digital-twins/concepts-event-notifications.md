---
# Mandatory fields.
title: Event notifications
titleSuffix: Azure Digital Twins
description: See how to interpret different event types and their different notification messages.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 4/8/2021
ms.topic: conceptual
ms.service: digital-twins
ms.custom: contperf-fy21q4

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Event notifications

Different events in Azure Digital Twins produce **notifications**, which allow the solution backend to be aware when different actions are happening. These notifications are then [routed](concepts-route-events.md) to different locations inside and outside of Azure Digital Twins that can use this information to take action.

There are several types of notifications that can be generated, and notification messages may look different depending on which type of event generated them. This article gives detail about different types of messages, and what they might look like.

This chart shows the different notification types:

[!INCLUDE [digital-twins-notifications.md](../../includes/digital-twins-notifications.md)]

## Notification structure

In general, notifications are made up of two parts: the header and the body. 

### Event notification headers

Notification message headers are represented with key-value pairs. Depending on the protocol used (MQTT, AMQP, or HTTP), message headers will be serialized differently. This section discusses general header information for notification messages, regardless of the specific protocol and serialization chosen.

Some notifications conform to the [CloudEvents](https://cloudevents.io/) standard. CloudEvents conformance is as follows.
* Notifications emitted from devices continue to follow the existing specifications for notifications
* Notifications processed and emitted by IoT Hub continue to follow the existing specifications for notification, except where IoT Hub chooses to support CloudEvents, such as through Event Grid
* Notifications emitted from [digital twins](concepts-twins-graph.md) with a [model](concepts-models.md) conform to CloudEvents
* Notifications processed and emitted by Azure Digital Twins conform to CloudEvents

Services have to add a sequence number on all the notifications to indicate their order, or maintain their own ordering in some other way. 

Notifications emitted by Azure Digital Twins to Event Grid will be automatically formatted to either the CloudEvents schema or EventGridEvent schema, depending on the schema type defined in the event grid topic. 

Extension attributes on headers will be added as properties on the Event Grid schema in the payload. 

### Event notification bodies

The bodies of notification messages are described here in JSON. Depending on the wanted serialization type for the message body (such as with JSON, CBOR, Protobuf, and so on), the message body may be serialized differently.

The set of fields that the body contains vary with different notification types.

The following sections go into more detail about the different types of notifications emitted by IoT Hub and Azure Digital Twins (or other Azure IoT services). You'll read about the things that trigger each notification type, and the set of fields included with each type of notification body.

## Digital twin change notifications

**Digital twin change notifications** are triggered when a digital twin is being updated, like:
* When property values or metadata changes.
* When digital twin or component metadata changes. An example of this scenario is changing the model of a digital twin.

### Properties

Here are the fields in the body of a digital twin change notification.

| Name    | Value |
| --- | --- |
| `id` | Identifier of the notification, such as a UUID or a counter maintained by the service. `source` + `id` is unique for each distinct event |
| `source` | Name of the IoT hub or Azure Digital Twins instance, like *myhub.azure-devices.net* or *mydigitaltwins.westus2.azuredigitaltwins.net* |
| `data` | A JSON Patch document describing the update made to the twin. For details, see [Body details](#body-details) below. |
| `specversion` | *1.0*<br>The message conforms to this version of the [CloudEvents spec](https://github.com/cloudevents/spec). |
| `type` | `Microsoft.DigitalTwins.Twin.Update` |
| `datacontenttype` | `application/json` |
| `subject` | ID of the digital twin |
| `time` | Timestamp for when the operation occurred on the digital twin |
| `traceparent` | A W3C trace context for the event |

### Body details

Inside the message, the `data` field contains a JSON Patch document containing the update to the digital twin.

For example, say that a digital twin was updated using the following patch.

:::code language="json" source="~/digital-twins-docs-samples/models/patch-component-2.json":::

The data in the corresponding notification (if synchronously executed by the service, such as Azure Digital Twins updating a digital twin) would have a body like:

```json
{
    "modelId": "dtmi:example:com:floor4;2",
    "patch": [
      {
        "value": 40,
        "path": "/Temperature",
        "op": "replace"
      },
      {
        "value": 30,
        "path": "/comp1/prop1",
        "op": "add"
      }
    ]
  }
```

This data is the information that will go in the `data` field of the lifecycle notification message.

## Digital twin lifecycle notifications

Wether [digital twins](concepts-twins-graph.md) represent [IoT Hub devices in Azure Digital Twins](how-to-ingest-iot-hub-data.md) or not, they will all emit notifications. They do so because of **lifecycle notifications**, which are about the digital twin itself.

Lifecycle notifications are triggered when:
* A digital twin is created
* A digital twin is deleted

### Properties

Here are the fields in the body of a lifecycle notification.

| Name | Value |
| --- | --- |
| `id` | Identifier of the notification, such as a UUID or a counter maintained by the service. `source` + `id` is unique for each distinct event. |
| `source` | Name of the IoT hub or Azure Digital Twins instance, like *myhub.azure-devices.net* or *mydigitaltwins.westus2.azuredigitaltwins.net* |
| `data` | The data of the twin experiencing the lifecycle event. For details, see [Body details](#body-details-1) below. |
| `specversion` | *1.0*<br>The message conforms to this version of the [CloudEvents spec](https://github.com/cloudevents/spec). |
| `type` | `Microsoft.DigitalTwins.Twin.Create`<br>`Microsoft.DigitalTwins.Twin.Delete` |
| `datacontenttype` | `application/json` |
| `subject` | ID of the digital twin |
| `time` | Timestamp for when the operation occurred on the twin |
| `traceparent` | A W3C trace context for the event |

### Body details

Here's an example of a lifecycle notification message: 

```json
{
  "specversion": "1.0",
  "id": "d047e992-dddc-4a5a-b0af-fa79832235f8",
  "type": "Microsoft.DigitalTwins.Twin.Create",
  "source": "contoso-adt.api.wus2.digitaltwins.azure.net",
  "data": {
    "$dtId": "floor1",
    "$etag": "W/\"e398dbf4-8214-4483-9d52-880b61e491ec\"",
    "$metadata": {
      "$model": "dtmi:example:Floor;1"
    }
  },
  "subject": "floor1",
  "time": "2020-06-23T19:03:48.9700792Z",
  "datacontenttype": "application/json",
  "traceparent": "00-18f4e34b3e4a784aadf5913917537e7d-691a71e0a220d642-01"
}
```

Inside the message, the `data` field contains the data of the affected digital twin, represented in JSON format. The schema for this `data` field is *Digital Twins Resource 7.1*.

For creation events, the `data` payload reflects the state of the twin after the resource is created, so it should include all system generated-elements just like a `GET` call.

Here's an example of the data for an [IoT Plug and Play (PnP)](../iot-develop/overview-iot-plug-and-play.md) device, with components and no top-level properties. Properties that don't make sense for devices (such as reported properties) should be omitted. The following JSON object is the information that will go in the `data` field of the lifecycle notification message:

```json
{
  "$dtId": "device-digitaltwin-01",
  "$etag": "W/\"e59ce8f5-03c0-4356-aea9-249ecbdc07f9\"",
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

Here's another example of digital twin data. This one is based on a [model](concepts-models.md), and doesn't support components:

```json
{
  "$dtId": "logical-digitaltwin-01",
  "$etag": "W/\"e59ce8f5-03c0-4356-aea9-249ecbdc07f9\"",
  "avgTemperature": 70,
  "comfortIndex": 85,
  "$metadata": {
    "$model": "dtmi:com:contoso:Building;1",
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

## Digital twin relationship change notifications

**Relationship change notifications** are triggered when any relationship of a digital twin is created, updated, or deleted. 

### Properties

Here are the fields in the body of a relationship change notification.

| Name    | Value |
| --- | --- |
| `id` | Identifier of the notification, such as a UUID or a counter maintained by the service. `source` + `id` is unique for each distinct event |
| `source` | Name of the Azure Digital Twins instance, like *mydigitaltwins.westus2.azuredigitaltwins.net* |
| `data` | The payload of the relationship that was changed. For details, see [Body details](#body-details-2) below. |
| `specversion` | *1.0*<br>The message conforms to this version of the [CloudEvents spec](https://github.com/cloudevents/spec). |
| `type` | `Microsoft.DigitalTwins.Relationship.Create`<br>`Microsoft.DigitalTwins.Relationship.Update`<br>`Microsoft.DigitalTwins.Relationship.Delete` |
| `datacontenttype` | `application/json` |
| `subject` | ID of the relationship, like `<twin-ID>/relationships/<relationshipID>` |
| `time` | Timestamp for when the operation occurred on the relationship |
| `traceparent` | A W3C trace context for the event |

### Body details

Inside the message, the `data` field contains the payload of a relationship, in JSON format. It uses the same format as a `GET` request for a relationship via the [DigitalTwins API](/rest/api/digital-twins/dataplane/twins). 

Here's an example of the data for an update relationship notification. "Updating a relationship" means properties of the relationship have changed, so the data shows the updated property and its new value. The following JSON object is the information that will go in the `data` field of the digital twin relationship notification message:

```json
{
    "modelId": "dtmi:example:Floor;1",
    "patch": [
      {
        "value": "user3",
        "path": "/ownershipUser",
        "op": "replace"
      }
    ]
  }
```

Here's an example of the data for a create or delete relationship notification. For `Relationship.Delete`, the body is the same as the `GET` request, and it gets the latest state before deletion.

```json
{
    "$relationshipId": "device_to_device",
    "$etag": "W/\"72479873-0083-41a8-83e2-caedb932d881\"",
    "$relationshipName": "Connected",
    "$targetId": "device2",
    "connectionType": "WIFI"
}
```

## Digital twin telemetry messages

**Telemetry messages** are received in Azure Digital Twins from connected devices that collect and send measurements.

### Properties

Here are the fields in the body of a telemetry message.

| Name    | Value |
| --- | --- |
| `id` | Identifier of the notification, which is provided by the customer when calling the telemetry API. |
| `source` | Fully qualified name of the twin that the telemetry event was sent to. Uses the following format: `<your-Digital-Twin-instance>.api.<your-region>.digitaltwins.azure.net/<twin-ID>`. |
| `specversion` | *1.0*<br>The message conforms to this version of the [CloudEvents spec](https://github.com/cloudevents/spec). |
| `type` | `microsoft.iot.telemetry` |
| `data` | The telemetry message that has been sent to twins. The payload is unmodified and may not align with the schema of the twin that has been sent the telemetry. |
| `dataschema` | The data schema is the model ID of the twin or the component that emits the telemetry. For example, `dtmi:example:com:floor4;2`. |
| `datacontenttype` | `application/json` |
| `traceparent` | A W3C trace context for the event. |

### Body details

The body contains the telemetry measurement along with some contextual information about the device.

Here's an example telemetry message body: 

```json
{
  "specversion": "1.0",
  "id": "df5a5992-817b-4e8a-b12c-e0b18d4bf8fb",
  "type": "microsoft.iot.telemetry",
  "source": "contoso-adt.api.wus2.digitaltwins.azure.net/digitaltwins/room1",
  "data": {
    "Temperature": 10
  },
  "dataschema": "dtmi:example:com:floor4;2",
  "datacontenttype": "application/json",
  "traceparent": "00-7e3081c6d3edfb4eaf7d3244b2036baa-23d762f4d9f81741-01"
}
```

## Next steps

Learn about delivering events to different destinations, using endpoints and routes:
* [Event routes](concepts-route-events.md)
