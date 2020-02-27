---
# Mandatory fields.
title: Route event data
titleSuffix: Azure Digital Twins
description: See how to route Azure Digital Twins telemetry and event data to external Azure services.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 2/21/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Route telemetry and event data to outside services

Azure Digital Twins **Event APIs** let developers wire-up event flow throughout the system, as well as to downstream services.

## Routes

Event routes are defined using data plane APIs. A route definition contains:
* The desired route ID 
* The desired endpoint ID
* A filter that defines which events are sent to the endpoint 

One route should allow multiple notifications and event types to be selected. 

If there is no route, no messages are routed outside of Azure Digital Twins. If there is a route and the filter is `null`, all messages are routed to the endpoint. If there is a route and a filter is added, messages will be filtered based on the filter.

In SDK form:

```csharp
Response CreateEventRoute(string routeId,
                            string endpointId,
                            string filter)
```
Filter can be `null`/empty and all events will be published to the endpoint.

`PATCH {service}/eventroutes/{id}`
Patch operation supports patching of the filter in json-patch format.

Delete routes operation
`DELETE {service}/eventroutes/{id}`
`Response DeleteEventRoute(string routeId);`

List event routes:
`GET {service}/eventroutes`
`IEnumerable<Response<string>> ListEventRoutes();`

## Message routing query and filter
Message routing query supports multiple categories of filters, all expressed in one single query language:
* Filter on messages types
* Filter on twin instances (no traversal of graph)
* Filter on message/notification body
* Filter on message properties

> [!NOTE]
> Azure Digital Twins messages are following CloudEvents standard.

In order to explain the message routing query, here are two sample messages of telemetry and notification:

Telemetry message

```json
{ 
    "specversion": "1.0", 
    "type": "microsoft.iot.telemetry", 
    "source": "myhub.westcentralus.azuredigitaltwins.net", 
    "subject": "thermostat.vav-123", 
    "id": "c1b53246-19f2-40c6-bc9e-4666fa590d1a",
     "dataschema": "dtmi:contosocom:DigitalTwins:VAV;1",
    "time": "2018-04-05T17:31:00Z", 
    "datacontenttype" : "application/json", 
    "data": " 
    { 
  "temp": 70,
  "humidity: 40 
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
    "dataschema": "dtmi:contosocom:DigitalTwins:Device;1"             
    "data": " 
    { 
  "$dtId": "room-123", 
  "property": "value",
   "$metadata": { 
              …
    } 
      } 
}
```

### Filter based on message types

You can query based on message type—telemetry vs. notifications. In the query language for filtering on message type, `IS`, `AND`, and `OR` operators are supported. 

`type = 'microsoft.digitaltwins.twin.create' OR type = 'microsoft.iot.telemetry'`
You can also specify `IN` operator 
`type IN ['microsoft.iot.telemetry', 'microsoft.digitaltwins.twin.create']`

### Filter based on Twins

The query language for this filtering scenario is compatible with Azure Digital Twins query language, and is a subset of it (Azure Digital Twins query language's `JOIN` is out of scope).

`$dt.$metadata.$model = "urn:example:Thermostat:1"` OR 
`$dt.$metadata.$model = "urn:contosocom:DigitalTwins:Space"`

or 

`$dt.IS_OF_MODEL(urn:example:Thermostat:1')` OR
`$dt.IS_OF_MODEL('urn:contosocom:DigitalTwins:Space;1')`

`$dt.firmareVersion = "1.0" AND $dt.location = "Redmond"`

### Filter based on message body

This query language should be similar to the way IoT Hub supports filtering of messages. In the IoT Hub query language, the telemetry message itself is referred to as `$body`.

```json
{
	"Temperature": 50,
        "Humidity": 83,
        "Time": "2017-03-09T00:00:00.000Z",
        "IsEnabled": true,
        "GPS": {
            "Long": "40.748440",
            "Lat": "-73.984559",
        }
}
```

### Filter based on message properties
This query language should be similar to IoT Hub's query language, filtering on message properties.

```sql
AND source = "thermostat.vav-10"
AND contentType = 'UTF-8'
```

Any of these four dimensions could be used individually, or with `AND` and `OR` conditions.

```sql
AND type = 'DigitalTwinTelemetryMessages'
AND $dt.$metadata.$model = "urn:contosocom:DigitalTwins:Device"
AND $dt.firmareVersion = "1.1"
AND $dt.Name = 'device1'
AND $body.Temperature > 0
AND source = "thermostat.vav-10"
AND contentType = 'UTF-8'
```

Filtering on the routes is flat, with no traversal of the graph (out of scope for Azure Digital Twins Preview). 
Azure Digital Twins should support at least 10 custom endpoints and 100 routes, like with IoT Hub.
Complex filtering to traverse the graph is out of scope for preview release.

## Route event types and message formats

Recall the types of notifications that can be generated and used for event routing:

[!INCLUDE [digital-twins-v2-notifications.md](../../includes/digital-twins-v2-notifications.md)]

Notifications allow the solution backend to be notified when below actions are happening. The sections that follow describe the types of notifications emitted by IoT Hub and Azure Digital Twins, or other Azure IoT services. 

Notifications are made up of two parts: the headers and the body. 

### Notification headers

In this section, we will discuss and illustrate notification message headers as key-value pairs and the message body as JSON. Depending on the protocol used (MQTT, AMQP, or HTTP), message headers will be serialized differently. Depending on the serialization desired for the message body (such as with JSON, CBOR, Protobuf, etc.), the message body may be serialized differently. This section discusses the format for telemetry messages, regardless of the specific protocol and serialization chosen.

We aspire to have notifications conform to the CloudEvents standard. For practical reasons, we suggest a phased approach to CloudEvents conformance.
* Notifications emitted from devices continue to follow the existing specifications for notifications
* Notifications processed and emitted by IoT Hub continue to follow the existing specifications for notification, except where IoT Hub chooses to support CloudEvents, such as through Event Grid
* Notifications emitted from logical digital twins conform to CloudEvents
* Notifications processed and emitted by Azure Digital Twins conform to CloudEvents

Services have to add a sequence number on all the notifications to indicate order of notifications, or otherwise perform their own actions to maintain ordering. Notifications emitted by Azure Digital Twins to Event Grid are formatted into the Event Grid schema, until Event Grid supports CloudEvents on input. Extension attributes on headers will be added as properties on the Event Grid schema inside of the payload.  

### Digital twin life-cycle notifications

All digital twins are emitting notifications, regardless of whether they are proxies representing [IoT Hub devices in Azure Digital Twins](concepts-iothub-devices.md) or not.

#### Trigger

These notifications are triggered when:
* A digital twin is created (proxy or not)
* A digital twin is deleted (proxy or not)
* A proxy is attached to an IoT Hub device
* A proxy is detached from its associated IoT Hub device

#### Properties

| Name | Value |
| --- | --- |
| id | Identifier of the notification, such as a UUID or a counter maintained by the service. `source` + `id` is unique for each distinct event |
| source | Name of the IoT hub or Azure Digital Twins instance, like *myhub.azure-devices.net* or *mydigitaltwins.westcentralus.azuredigitaltwins.net* |
| specversion | 1.0 |
| type | `Microsoft.<Service RP>.Twin.Create`<br>`Microsoft.<Service RP>.Twin.Delete`<br>`Microsoft.<Service RP>.TwinProxy.Create`<br>`Microsoft.<Service RP>.TwinProxy.Delete`<br>`Microsoft.<Service RP>.TwinProxy.Attach`<br>`Microsoft.<Service RP>.TwinProxy.Detach` |
| datacontenttype | application/json |
| subject | ID of the digital twin instance |
| time | Timestamp for when the operation occurred on the twin |
| sequence, sequencetype | See earlier detail on notification headers |

#### Body

This section includes a digital twin payload in a JSON format for all types. The schema for this is *Digital Twins Resource 7.1*. The body is always the state after the resource is created, so it should include all system generated-elements just like a `GET` call.
Here is an example of body for [IoT Plug and Play (PnP)](../iot-pnp/overview-iot-plug-and-play.md) devices, with components and no top-level properties. Properties that do not make sense for devices (such as reported properties) should be omitted.

```json
{
  "$dtId": "device-digitaltwin-01",
  "thermostat": {
    "temperature": 80,
    "humidity": 45,
    "$metadata": {
      "$model": "urn:example:Thermostat:1",
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
    "$model": "urn:example:Thermostat_X500:1",
  }
}
```

Here is another example of a logical digital twin not supporting components:

```json
{
  "$dtId": "logical-digitaltwin-01",
  "avgTemperature": 70,
  "comfortIndex": 85
  "$metadata": {
    "$model": "urn:example:Building:1",
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

These notifications are triggered when any relationship's edge of a digital twin is created, updated, or deleted. 

#### Properties

| Name	| Value |
| --- | --- |
| id	| Identifier of the notification, such as a UUID or a counter maintained by the service. `source` + `id` is unique for each distinct event |
| source	| Name of the Azure Digital Twins instance, like *mydigitaltwins.westcentralus.azuredigitaltwins.net* |
| specversion	| 1.0 |
| type	| `Microsoft.<Service RP>.Edge.Create`<br>`Microsoft.<Service RP>.Edge.Update`<br>`Microsoft.<Service RP>.Edge.Delete`<br>`datacontenttype	application/json for Edge.Create`<br>`application/json-patch+json for Edge.Update` |
| subject	| ID of the edge, like `<twinid>/relationships/<relationshipName>/<edged>` |
| time	| Timestamp for when the operation occurred on the edge |
| sequence, sequencetype	| See earlier detail on notification headers |

#### Body

This section includes payload in a JSON format for creating and deleting a relationship's edge. It uses the same format as a `GET` request for a relationship's edge via the Relationship API. "Updating a relationship" means properties of the edge have changed. 
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

### Digital twin model change notifications

These notifications are triggered when a Digital Twins Definition Language (DTDL) [model](concepts-models.md) is uploaded, reloaded, patched, decommissioned, or deleted.

#### Properties

| Name	| Value |
| --- | --- |
| id	| Identifier of the notification, such as a UUID or a counter maintained by the service. `source` + `id` is unique for each distinct event |
| source	| Name of the IoT hub or Azure Digital Twins instance, like *myhub.azure-devices.net* or *mydigitaltwins.westcentralus.azuredigitaltwins.net* |
| specversion	| 1.0 |
| type	| `Microsoft.<Service RP>.Model.Upload`<br>`Microsoft.<Service RP>.Model.Reload` (Hub-specific)<br>`Microsoft.<Service RP>.Model.Patch` (Hub-specific)<br>`Microsoft.<Service RP>.Model.Decom`<br>`Microsoft.<Service RP>.Model.Delete` |
| datacontenttype	| application/json |
| subject	| ID of the model, in the form `dtmi:my:Room;1` |
| time	| Timestamp for when the operation occurred on the model |
| sequence	| Value expressing the event's position in the larger ordered sequence of events. Services have to add a sequence number on all the notifications to indicate order of notifications, or otherwise perform their own actions to maintain ordering. Sequence will be incremented for each subject, and will be reset to 1 every time the object gets recreated with the same ID (such as during delete and recreate operations). |
| sequencetype	| The exact value and meaning of sequence. For example, this property may specify that the value must be a string-encoded, signed, 32-bit integer that starts with 1, and increases by 1 for each subsequent value |
| modelstatus	| The resolution model status for resolving a model. Possible values: Successful/NotFound/Failed (IoT Hub only) | 
| updatereason	| Update model reason in the schema. Possible values: Create/Reset/Override (IoT Hub only) | 

#### Body

No body for upload, reload, and patch model. User must make a `GET` call to get the model content. 
For `Model.Delete`, the request body is the same as a `GET` request, and it gets the latest state before deletion.
For and `Model.Decom`, the body of the patch will be in JSON patch format, like all other patch APIs in the Azure Digital Twins API surface. That is, to decommission a model, you would use:

```json
[
  {
    "op": "replace",
    "path": "/decommissionedState",
    "value": true
  }
]
```

### Digital twin change notifications

These notifications are triggered when a digital twin resource is being updated, for instance:
* When property values or metadata changes.
* When twin or component metadata changes. An example of this scenario is changing the model of a twin.

#### Properties

| Name	| Value |
| --- | --- |
| id	| Identifier of the notification, such as a UUID or a counter maintained by the service. `source` + `id` is unique for each distinct event |
| source	| Name of the IoT hub or Azure Digital Twins instance, like *myhub.azure-devices.net* or *mydigitaltwins.westcentralus.azuredigitaltwins.net*
| specversion	| 1.0 |
| type	| `Microsoft.<Service RP>.Twin.Update` |
| datacontenttype	| application/json-patch+json |
| subject	| ID of the twin |
| time	| Timestamp for when the operation occurred on the twin |
| sequence, sequencetype	| See earlier detail on notification headers |

#### Body

The body for the `Twin.Update` notification is a JSON Patch document containing the update to the digital twin resource.
For instance, for the following PATCH twin:

```json
[
  {
    "op": "replace",
    "path": "/mycomp/prop1",
    "value": {"a":3}
  }
]
```

The corresponding notification (if synchronously executed by the service, such as Azure Digital Twins updating a logical digital twin) would contain a body like:

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

Learn more about the Azure Digital Twins APIs
* [Use the Azure Digital Twins APIs](concepts-use-apis.md)