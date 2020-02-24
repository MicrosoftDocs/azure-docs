---
# Mandatory fields.
title: Represent objects with a twin
titleSuffix: Azure Digital Twins
description: Understand the concept of a digital twin, what its properties can be in Azure Digital Twins, and what role twins serve within the Azure Digital Twins graph.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 2/21/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Understand the concept of a digital twin

Within an Azure Digital Twins solution, the entities in your environment are represented by **twins.** A twin is described by one of the user-created Azure Digital Twins [models](concepts-models.md); it is implemented and connected via relationships to form the Azure Digital Twins [graph](concepts-graph-queries.md). This article gives more information on what a twin representation entails.

## Digital twin JSON format

The following section shows an example of a digital twin's data represented in JSON:

```json
{
  "$dtId": "digitaltwin-01",
  "prop1": 42,
  "prop2": {
    "x": 101,
    "y": 33
  },
  "component": {
    "componentProperty": 80,
    "$metadata": {
      "$model": "urn:example:Component:1",
      "componentProperty": {
        "desiredValue": 85,
        "desiredVersion": 3,
        "ackVersion": 2,
        "ackCode": 200,
        "ackDescription": "OK"
      }
    }
  },
  "$metadata": {
    "$model": "urn:example:Building:1",
    "prop1": {
      "desiredValue": 66,
      "desiredVersion": 5,
      "ackVersion": 4,
      "ackCode": 200,
      "ackDescription": "OK"
    },
    "prop2": {
      "desiredValue": {
        "x": 101,
        "y": 33,
      },
      "desiredVersion": 8,
      "ackVersion": 8,
      "ackCode": 200,
      "ackDescription": "OK"
    }
  }
}
```

More formally, the JSON data has the following fields:

| Field name | Description |
| --- | --- |
| `$dtId` | A user-provided string representing the ID of the digital twin. For [IoT Plug and Play (PnP)](../iot-pnp/overview-iot-plug-and-play.md) digital twins, this string is the same as a device identity ID string. Syntactic restriction as specified in IoT Hub public docs. |
| `$conformance` | An enum containing the conformance status of this digital twin (conformant, non-conformant, unknown) |
| `{propertyName}` | The value of a property in JSON (string, number, or object). |
| `$relationships` | URL of the path to the relationships collection. This field is absent if the digital twin has no outgoing edges. |
| `$metadata.$model` | [Optional] The URN of the capability model or interface that models this digital twin instance. |
| `$metadata.{propertyName}.desiredValue` | [only for writable properties] The desired value of the specified property. |
| `$metadata.{propertyName}.desiredVersion` | [only for writable properties] The version of the desired value. |
| `$metadata.{propertyName}.ackVersion` | The version acknowledged by the device app implementing the digital twin. |
| `$metadata.{propertyName}.ackCode` | [only for writable properties] The `ack` code returned by the device app implementing the digital twin. |
| `$metadata.{propertyName}.ackDescription` | [only for writable properties] The `ack` description returned by the device app implementing the digital twin. |
| `{componentName}` | A JSON object containing the property values and metadata analogously to the root object. This object exists even if the component has no properties. |
| `{componentName}.{propertyName}` | The value of the property in JSON (string, number, or object). |
| `{componentName}.$metadata` | The metadata information for the component, analogous to the root-level $metadata. |

## Relationship JSON format

A relationship resource has the following format:

```json
{
  "$edgeId": "edge-01",
  "$sourceId": "logical-digitaltwin-01",
  "$relationship": "contains",
  "$targetId": "device-digitaltwin-01",
  "prop1": "2019-04-01"
}
```

| Field name | Description |
| --- | --- |
| `$edgeId` | A user-provided string representing the ID of this edge. This string is unique in the context of the source digital twin, which also means that `sourceId` + `edgeId` is unique in the context of the service. |
| `$sourceId` | The ID of the source digital twin. |
| `$targetId` | The ID of the target digital twin. |
| `$relationshipName` | The name of the relationship. |
| `{propertyName}` | The value of the property in JSON (string, number, or object) |

## Next steps

Learn about other key components of an Azure Digital Twins solution:
* [Model an object](concepts-models.md)
* [Use the Azure Digital Twins graph](concepts-graph-queries.md)

Or, see how a twin is managed with Twin APIs:
* [Manage an individual twin](how-to-manage-twin.md)