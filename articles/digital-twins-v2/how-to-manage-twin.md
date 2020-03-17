---
# Mandatory fields.
title: Manage an individual digital twin
titleSuffix: Azure Digital Twins
description: See how to manipulate an individual Azure digital twin, including its details, commands, and properties.
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

# Manage an individual digital twin in the twin graph

Azure Digital Twins **Twin APIs** let developers create, modify, and delete digital twins and their relationships in an Azure Digital Twins instance.

## Get twin data for an entire digital twin

You can access data on any Azure digital twin by calling `Response<JsonDocument> GetTwin(string id);`.
This returns twin data in JSON form. Assuming the following twin type (written in [Digital Twins Definition Language (DTDL)](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL)) defines a digital twin of twin type *Moon*:

```json
{
    "@id": " urn:contosocom:example:Moon:1",
    "@type": "Interface",
    "@context": "http://azure.com/v3/contexts/Model.json",
    "contents": [
        {
            "@type": "Property",
            "name": "radius",
            "schema": "double",
            "writable": true
        },
        {
            "@type": "Property",
            "name": "mass",
            "schema": "double",
            "writable": true
        }
    ]
}
```

The call `GetTwin("myMoon-001");` might return:

```json
{
  "$dtId": "myMoon-001",
  "$conformance": "conformant",
  "radius": 1737.1,
  "mass": 0.0734,
  "$metadata": {
    "$model": "urn:contosocom:example:Moon:1",
    "radius": {
      "desiredValue": 1737.1,
      "desiredVersion": 5,
      "ackVersion": 4,
      "ackCode": 200,
      "ackDescription": "OK"
    },
    "mass": {
      "desiredValue": 0.0734,
      "desiredVersion": 8,
      "ackVersion": 8,
      "ackCode": 200,
      "ackDescription": "OK"
    }
  }
}
```

The defined properties of the Azure digital twin are returned as top-level properties on the digital twin. Metadata or system information that is not part of the DTDL definition is returned with a `$` prefix:
* The ID of the digital twin in this Azure Digital Twins instance.
* The conformance flag, indicating if the current data in the digital twin is conforming to the defined twin type. Digital twins defined in the Azure Digital Twins service will always be conformant, but [digital twins controlled by IoT Hub devices](concepts-iothub-devices.md) may have data not conforming with the twin type definition. The conformance flag has three possible values:
    - *Conformant*: The defined twin type is available, and the data in the digital twin conforms with the twin type definition.
    - *Non-Conformant*: The defined twin type is available, and the data in the digital twin does not conform with the twin type definition. For example, a property with an expected type of `double` has mistakenly been set by a device to a `string` value.
    - *Unknown*: The defined twin type cannot be found, so conformance cannot be validated.
* Metadata. The metadata section contains a variety of metadata. For example:
    - The DTMI of the twin type of the digital twin.
    - Synchronization status for each writeable property. This is most useful for devices, where it's possible that the service and the device have diverging statuses (for example, when a device is offline). Currently, this property only applies to physical devices connected to IoT Hub. With the data in the metadata section, it is possible to understand the full status of a property, as well as the last modified timestamps. For more information about sync status, see [this IoT Hub tutorial](/articles/iot-hub/tutorial-device-twins.md) on synchronizing device state.
    - Service-specific metadata, like from IoT Hub or Azure Digital Twins. 

## Patch digital twins

To update multiple properties on a digital twin, use 
`Response<JsonDocument> UpdateTwin(string id, JsonDocument patch)`.
The JSON document passed in to `UpdateTwin` must be in JSON patch format.

For example:

```json
[
  {
    "op": "replace",
    "path": "mass",
    "value": 0.0799
  },
  {
    "op": "replace",
    "path": "temperature",
    "value": 0.800
  }
]
```

This JSON patch document replaces the *mass* property of the digital twin it is applied to. 

### Patch properties in components

To patch properties in components, use path syntax in JSON Patch:

```json
[
  {
    "op": "replace",
    "path": "/mycomponentname/mass",
    "value": 0.0799
  }
]
```

## Change the twin type

`UpdateTwin` can also be used to migrate an Azure digital twin to a different twin type. For example:

```json
[
  {
    "op": "replace",
    "path": "/$metadata/$model",
    "value": "urn:contosocom:example:foo:1"
  }
]
```

 This operation will only succeed if the digital twin being modified after application of the patch is conformant with the new twin type. For example:
* Imagine an Azure digital twin with a twin type of *foo_old*. *Foo_old* defines a required property *temperature*.
* The new twin type *foo* defines a property temperature, and adds a new required property *humidity*.
* After the patch, the digital twin must have both a temperature and humidity property. The patch thus needs to be:

```json
[
  {
    "op": "replace",
    "path": "$metadata.$model",
    "value": "urn:contosocom:example:foo"
  },
  {
    "op": "add",
    "path": "humidity",
    "value": 100
  }
]
```

## Get and set properties on digital twins

To access properties on Azure digital twins, you can use `GetProperty` functions on the client object. These functions can retrieve values as JSON (including all the metadata) or as primitive types:

```csharp
var client = new DigitalTwinsServiceClient("...");
double tempVal = 0;
// Get property as Json
Response<JsonDocument> result = client.GetPropertyAsJson(roomid, "temperature");

// Get property as primitive type 
Response<int> intresult = client.GetIntProperty(roomid, "myIntProperty");
// result value is: int a = intresult.Value

Response<double> dresult = client.GetDoubleProperty(roomid, "myDoubleProperty");
// ...etc, other versions of the functions
// ...compute something...
Response<string> jresult = client.SetPropertyAsJson(roomid, "temperature", tempVal);
Response<int> ires = client.SetIntProperty(roomid, "myIntProperty", myIntValue);
```

## Complex properties

To access complex properties, you need to use JSON. 

```csharp
var client = new DigitalTwinsServiceClient("...");
string complexPropertyValue;
Response<JsonDocument> = client.GetPropertyAsJson(roomid, "myComplexProperty");
// Deserialize return value, with System.Text.Json
// [TBA]
// ...compute something...
Response<string> result = client.SetProperty(roomid, "myComplexProperty", complexPropertyJSonValue);
```

## Components

For components defined in a twin type, you can describe a property path.
Let's say we have the following DTDL twin types that define a phone device with two cameras:

```json
{
    "@id": "urn:contosocom:example:Camera:1",
    "@type": "Interface",
    "@context": "http://azure.com/v3/contexts/Model.json",
    "contents": [
        {
            "@type": "Property",
            "name": "aperture",
            "schema": "double",
            "writable": true
        },
        {
            "@type": "Property",
            "name": "exposure",
            "schema": "double",
            "writable": true
        }
    ]
},
{
    "@id": " urn:contosocom:example:Phone:1",
    "@type": "Interface",
    "@context": "http://azure.com/v3/contexts/Model.json",
    "contents": [
        {
            "@type": "Component",
            "name": "frontCamera",
            "schema": "urn:contosocom:example:Camera:1"
        },
        {
            "@type": "Component",
            "name": "backCamera",
            "schema": "urn:contosocom:example:Camera:1"
        },
    ]
}
```

To access properties on the *frontCamera* component, you can write:

```csharp
var client = new DigitalTwinsServiceClient("...");
Response<double> result = client.SetDoubleProperty(phoneId, "frontCamera.aperture", newApertureValue);
```

In other words, the property name for component access is a property path consisting of component names separated by a dot, followed by the property name on the final leaf component.

## Relationships

To access relationships, see the following example.
Recall the twin type definitions of *Moon* and *Planet* digital twins:

```json
{
    "@id": "urn:contosocom:example:Planet:1",
    "@type": "Interface",
    "@context": "http://azure.com/v3/contexts/Model.json",
    "extends": [
      "ex:CelestialBody"
    ],
    "contents": [
      {
          "@type": "Relationship",
          "name": "satellites",
          "target": "urn:contosocom:example:Moon:1"
      }
    ]
},
{
    "@id": "urn:contosocom:example:Moon:1",
    "@type": "Interface",
    "@context": "http://azure.com/v3/contexts/Model.json",
    "extends": [
        "ex:CelestialBody"
    ],
    "contents": [
        {
            "@type": "Relationship",
            "name": "owner",
            "target": "urn:contosocom:example:Planet:1"
        }
    ]
}
```

To access relationships, you can write:

```csharp
var client = new DigitalTwinsServiceClient("...");
string rels;
Response<JsonDocument> result = client.GetRelationshipAsJson(planetId, "satellites");
// Parse relationships as json as desired from result.Value
```
This call returns an array of relationships, because each relationship can have a cardinality that is larger than one. To navigate a relationship, you can follow the target of the returned relationship:

```csharp
var client = new DigitalTwinsServiceClient("...");
string rels;
Response<JsonDocument> result = client.GetRelationshipAsJson(planetId, "satellites");
var result = results.Value.GetArrayEnumerator());
foreach (JElement je in result)
{
    String target = je.GetProperty("Target").GetString();
    String name;
    Response<string> name = client.GetStringProperty(target, "name"); 
    Console.WriteLine(name);
}
```

## Next steps

Learn about managing the other key elements of an Azure Digital Twins solution:
* [Manage a twin type](how-to-manage-model.md)
* [Manage a twin graph](how-to-manage-graph.md)