---
# Mandatory fields.
title: Route event data
description: See how to route Azure Digital Twins telemetry and event data to external Azure services.
author: philmea
ms.author: philmea # Microsoft employees only
ms.date: 2/12/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---
# Route telemetry and event data to outside services

The Event APIs let developers wire-up event flow throughout the system, as well as to downstream services.

## Endpoints
To define an event route, developers first must define endpoints. An endpoint is a connection to a destination outside of ADT. Supported destinations are (see priority table above):
* [p0] EventGrid custom topics
* [p0] EventHub
* [p1] ServiceBus
* [p1] EventGrid system topics (GA)
* [p2] Azure Data Lake Store (ADLS) Gen2  (post-GA)

Endpoints are set up using control plane APIs or in the portal. An endpoint definition gives 
* An endpoint id (or name) to the endpoint, this is a friendly name
* Endpoint type, e.g. Event Grid, Event Hub or other type.
* Primary connection string and secondary connection string to authenticate (* - this might be temporary for private preview until we implement the MSI auth pass when we need Azure Id for the service)
* Path is topic path of the endpoint, e.g. your-topic.westus.eventgrid.azure.net
These are the endpoints APIs that are available in control plane
1.	Create endpoint
2.	Get list of endpoints
3.	Get endpoint by Id (similar with above, but passing endpointId)
4.	Delete endpoint by Id
5.	Get endpoint health (this is similar to Hub API GetEndpointHealth https://docs.microsoft.com/en-us/rest/api/iothub/iothubresource/getendpointhealth )

## Routes
Event routes are defined using data plane APIs. A route definition contains:
* The desired route id 
* The desired endpoint id
* A filter that defines which events are sent to the endpoint 
One route should allow multiple notifications and event types to be selected. 
This is the desired behavior: if there is no route, no messages are routed outside of DT. If there is a route and filter is null, all messages are routed to the endpoint. If there is a route and filter is added, messages will be filtered based on the filter.
In SDK form:

```csharp
Response CreateEventRoute(string routeId,
                            string endpointId,
                            string filter)
```

Filter can be null/empty and all events will be published to the endpoint.
PATCH {service}/eventroutes/{id}
Patch operation supports patching of the filter in json-patch format.
Delete routes operation
DELETE {service}/eventroutes/{id} 
Response DeleteEventRoute(string routeId);
And to list event routes:
GET {service}/eventroutes
IEnumerable<Response<string>> ListEventRoutes();
Message routing query/filter
Message routing query supports multiple category of filters, all expressed in one single query language.
1.	Filter on messages types
2.	Filter on twin instances (no traversal of graph)
3.	Filter on message/notification body
4.	Filter on message properties
Note: ADT messages are following CloudEvents standard, see doc Digital Twin x-team APIs 2 - Notifications.docx

In order to explain the message routing query, here are two sample messages of telemetry and notification:
Telemetry message

```json
{ 
    "specversion": "1.0", 
    "type": "microsoft.iot.telemetry", 
    "source": "myhub.westcentralus.azuredigitaltwins.net", 
    "subject": "thermostat.vav-123", 
    "id": "c1b53246-19f2-40c6-bc9e-4666fa590d1a",
     "dataschema”: “dtmi:contosocom:DigitalTwins:VAV;1”,
    "time": "2018-04-05T17:31:00Z", 
    "datacontenttype" : "application/json", 
    "data": " 
    { 
  "temp": 70,
  “humidity: 40 
      } 
}
```


Lifecycle notifications message

```json
{ 
    "specversion": "1.0", 
    "type": "microsoft.digitaltwins.twin.create", 
    "source": "mydigitaltwins.westcentralus.azuredigitaltwins.net", 
    "subject": "device-123", 
    "id": "c1b53246-19f2-40c6-bc9e-4666fa590d1a", 
    "time": "2018-04-05T17:31:00Z", 
    "datacontenttype" : "application/json", 
    “dataschema”: “dtmi:contosocom:DigitalTwins:Device;1”             
    "data": " 
    { 
  "$dtId": "room-123", 
  “property”: “value”,
   "$metadata": { 
              …
    } 
      } 
}
```

## Filter based on Messages Types (Telemetry & Notification Types)
Query language for filtering on messages type is, AND and OR operators are supported. The list of messages types is described here
type = ‘microsoft.digitaltwins.twin.create’ OR type = ‘microsoft.iot.telemetry’
You can also specify IN operator 
type IN [‘microsoft.iot.telemetry’, ‘microsoft.digitaltwins.twin.create’]
Filtering based on Twins
The query language for this should be compatible with DT query language and should be a sub-set of query language (join is out of scope) QueryStore.Language.Syntax.docx example

$dt.$metadata.$model = "urn:example:Thermostat:1" OR 
$dt.$metadata.$model = "urn:contosocom:DigitalTwins:Space"

Or 

$dt.IS_OF_MODEL(urn:example:Thermostat:1') OR
$dt.IS_OF_MODEL('urn:contosocom:DigitalTwins:Space;1')

* Priority is to support filtering based on the model and support OR operations between multiple models
* Second priority is to support filtering by other properties of the twin (beside model above)
$dt.firmareVersion = “1.0” AND
$dt.location = “Redmond”
Filtering based on message body
Query language should be similar to IoT Hub supporting filtering of the message. In the Hub query language, the telemetry message itself is referred to as $body
Test

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

Filtering based on message properties
* Query language should be similar with Hub filtering on message properties
AND source = “thermostat.vav-10”
AND contentType = ‘UTF-8’
Any of these 4 dimensions could be use individually or with AND and OR conditions
AND type = ‘DigitalTwinTelemetryMessages’
AND $dt.$metadata.$model = "urn:contosocom:DigitalTwins:Device"
AND $dt.firmareVersion = “1.1”
AND $dt.Name = ‘device1’
AND $body.Temperature > 0
AND source = “thermostat.vav-10”
AND contentType = ‘UTF-8’

Filtering on the routes is flat with no traversal of the graph (out of scope for public preview). 
Digital Twins should support at least 10 custom endpoints and 100 routes, same as IoT Hub.
Complex filtering to traverse the graph is out of scope for public preview and GA.

## Route Event Types
Notification/Event 	Routing Source Name	Note 
Digital Twin Change Notification	Digital Twin Change Notification	This notification includes any digital twins property change, regardless if it’s a Hub device or not
Digital Twin Lifecycle Notification	Digital Twin Lifecycle Notification	This notification includes any digital twins property change, regardless if it’s a Hub device or not
Digital Twin Edge Change Notification	Digital Twin Edge Change Notification	
Digital Twin Model Change Notification	Digital Twin Model Change Notification	This notification includes any model change, regardless if it’s represented as capability model or interface.
Digital Twin Event Subscription Change Notification	Digital Twin Event Subscription Change Notification	
Digital Twin Telemetry Messages	Telemetry Messages	This message includes any telemetry message, regardless if it’s coming from a Hub device or a logical digital twin.

## Notification / Message Formats
Notifications allow the solution backend to be notified when below actions are happening. These are the types of notifications emitted by IoT Hub and Digital Twins or other Azure IoT service. 
Notifications are made up of two parts: the headers and the body. In this section, we will discuss and illustrate message headers as key-value pairs and the message body as JSON. Depending on the protocol used (i.e. MQTT, AMQP, or HTTP) message headers will be serialized differently. Depending on the serialization desired for the message body, the message body may be serialized differently (i.e. as JSON, CBOR, Protobuf, etc.). This section discusses the format for telemetry messages regardless of the specific protocol and serialization chosen.

We aspire to have notifications conform to the CloudEvents standard. For practical reasons, we suggest a phased approach to CloudEvents conformance.
* Notification emitted from devices continues to follow the existing specification for notifications
* Notification processed and emitted by IoT Hub continues to follow the existing specification for notification, except where IoT Hub chooses to support CloudEvents, such as through Event Grid.
* Notification emitted from logical digital twins conforms to CloudEvents.
* Notification processed and emitted by ADT conforms to CloudEvents.

Services have to add sequence number on all the notification to be used to indicate order of notifications or they need to maintain ordering.  Notification emitted by ADT to Event Grid is formatted into Event Grid schema until Event Grid supports CloudEvents on input. Extension attributes on headers will be added as properties on Event Grid schema inside of payload.  To read more about proposed Digital Twins notifications and messages, please read Notifications and Event Types section of Digital Twins Event Processing.docx
Digital twin lifecycle notifications
All digital twins are emitting notifications, regardless if they are proxies or not. A digital twin proxy is defined in Digital Twins Proxies for Device Digital Twins 

### Trigger
These notifications are triggered when digital twins are:
* Digital twin created (regardless if proxy or not)
* Digital twin deleted (regardless if proxy or not)
* A proxy is attached to a Hub device
* A proxy is detached from its associated Hub device

Properties
Name	Value
id	Identifier of the notification e.g. a UUID, a counter maintained by the service. Source + id is unique for each distinct event
source	Name of IoT Hub or Digital Twins instance, e.g. 
myhub.azure-devices.net or mydigitaltwins.westcentralus.azuredigitaltwins.net
specversion	1.0
type	Microsoft.<Service RP>.Twin.Create
Microsoft.<Service RP>.Twin.Delete
Microsoft.<Service RP>.TwinProxy.Create
Microsoft.<Service RP>.TwinProxy.Delete
Microsoft.<Service RP>.TwinProxy.Attach
Microsoft.<Service RP>.TwinProxy.Detach
datacontenttype	application/json
subject	Id of the digital twin instance, e.g. <twinid>
time	Time of when the operation happened on the twin
sequence & sequencetype	See Headers section

#### Body
This section includes digital twin payload in a JSON format for all types. The schema is here Digital Twins Resource 7.1. The body is always the state after the resource is created, so it should include all system generated elements as of a GET call.
Here is an example of body for PnP devices with components and no top-level properties. Properties that do not make sense for devices should be omitted, e.g. reported properties.

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

and another example of a logical digital twin not supporting components, such as:

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
These notifications are triggered when any relationship’s edge of a digital twin is created, updated, or deleted. See definition of relationship and edge here Relationship resource
Properties
Name	Value
id	Identifier of the notification e.g. a UUID, a counter maintained by the service. Source + id is unique for each distinct event
source	Name of Digital Twins instance, e.g. 
mydigitaltwins.westcentralus.azuredigitaltwins.net
specversion	1.0
type	Microsoft.<Service RP>.Edge.Create
Microsoft.<Service RP>.Edge.Update
Microsoft.<Service RP>.Edge.Delete
datacontenttype	application/json for Edge.Create
or application/json-patch+json for Edge.Update
subject	Id of the edge, e.g. <twinid>/relationships/<relationshipName>/<edged>
time	Time of when the operation happened on the edge
sequence & sequencetype	See Headers section

#### Body
This section includes payload in a JSON format for create, and delete relationship’s edge. It uses the same format as GET payload for a relationship’s edge Relationship API. Update relationship means properties of the edge have changed. 
For Edge.Delete body is the same as GET, it gets the latest state before deletion.
Here is an example of a create or delete edge notification

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

Here is an example of an update edge notification to update a property

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

These notifications are triggered when a DTDL model is uploaded, reloaded, patched, decommissioned, or deleted. See model APIs for Hub and DT Model API Discussion Notes.docx

Properties
Name	Value
id	Identifier of the notification e.g. a UUID, a counter maintained by the service. Source + id is unique for each distinct event
source	Name of IoT Hub or Digital Twins instance, e.g. 
myhub.azure-devices.net or mydigitaltwins.westcentralus.azuredigitaltwins.net
specversion	1.0
type	Microsoft.<Service RP>.Model.Upload
Microsoft.<Service RP>.Model.Reload (Hub specific)
Microsoft.<Service RP>.Model.Patch (Hub specific)
Microsoft.<Service RP>.Model.Decom 
Microsoft.<Service RP>.Model.Delete
datacontenttype	application/json
subject	Id of the model, e.g. <modelId> in the form of dtmi:my:Room;1
time	Time of when the operation happened on the model
sequence	Value expressing the relative order of the event. It describes the position of an event in the ordered sequence of events. Services have to add sequence number on all the notification to be used to indicate order of notifications or they need to maintain ordering. Sequence will be incremented for each subject and will be reset to 1 every time the object gets recreated with the same id (delete and recreate). See Headers section for more details
sequencetype	The exact value and meaning of sequence. E.g. value must start with 1 and increase by 1 for each subsequent value, string-encoded signed 32-bit integers, see examples here 

modelstatus	The resolution model status for resolving a model. Possible values: Successful/NotFound/Failed (Hub only, see definitions here Azure IoT Digital Twin Model Resolution Design Spec.docx)

updatereason	Update model reason in the schema. Possible values: Create/Reset/Override (Hub only, see definitions here Azure IoT Digital Twin Model Resolution Design Spec.docx)

#### Body

No body for upload, reload, and patch model. User must make a GET call to get the model content. 
For Model.Delete body is the same as GET, it gets the latest state before deletion.
For and Model.Decom, the body of the patch will be in JSON patch format, like all other patch APIs in the DT API surface. That is, to decommission a model, you would use
[
  {
    "op": "replace",
    "path": "/decommissionedState",
    "value": true
  }
]

### Digital twin change notifications

These are triggered when the digital twin resource is being updated, for instance:
1.	When property values or metadata changes.
2.	When twin or component metadata changes, e.g. the model of the twin changes.

Properties
Name	Value
id	Identifier of the notification e.g. a UUID, a counter maintained by the service. Source + id is unique for each distinct event
source	Name of IoT Hub or Digital Twins instance, e.g. 
myhub.azure-devices.net or mydigitaltwins.westcentralus.azuredigitaltwins.net
specversion	1.0
type	Microsoft.<Service RP>.Twin.Update
datacontenttype	application/json-patch+json 
subject	Id of the twin, e.g. <twinId>
time	Time of when the operation happened on the twin
sequence & sequencetype	See Headers section


#### Body

The body for the Twin.Update notification is a Json-Patch document containing the update to the digital twin resource.
For instance, as a result of a PATCH twin of:

```json
[
  {
    "op": "replace",
    "path": "/mycomp/prop1",
    "value": {"a":3}
  }
]
```

The corresponding notification (if synchronously executed by the service, e.g. ADT updating a logical digital twin) would contain a body such as:

```json
[
    { "op": "replace", "path": "/myComp/prop1", "value": {"a": 3}},
    { "op": "replace", "path": "/myComp/$metadata/prop1",
        "value": {
            "desiredValue": { "a": 3 },
            "desiredVersion": 2,
		“ackCode”: 200,
            “ackVersion”: 2 
        }
    }
]
```

