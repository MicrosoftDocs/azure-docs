---
title: Data processing and user-defined functions with Azure Digital Twins| Microsoft Docs
description: Overview of data processing, matchers and user-defined functions with Azure Digital Twins
author: alinamstanciu
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 10/08/2018
ms.author: alinast
---

# Data processing and user-defined functions

Azure Digital Twins offers advanced compute capabilities. Developers can define and run custom functions against incoming telemetry messages to send events to pre-defined endpoints.

## Data processing flow

Once devices send telemetry data to Digital Twins, developers can process data in four phases: _validate_, _match_, _compute_, and _dispatch_:

![Digital Twins Data Processing Flow][1]

1. The _validate_ phase transforms the incoming telemetry message to a commonly understood [`data transfer object`](https://en.wikipedia.org/wiki/Data_transfer_object) format. This phase also executes device and sensor validation.
1. The _match_ phase finds the appropriate User-Defined Function(s) to run. Predefined matchers will find the User-Defined Function(s) based on the device, sensor, and space information from the incoming telemetry message.
1. The _compute_ phase runs the User-Defined Function(s) matched in the previous phase. These function(s) may read and update computed values on spatial graph nodes, and can emit custom notifications.
1. The _dispatch_ phase routes any custom notifications from the compute phase to endpoints defined in the graph.

## Data processing objects

Data processing in Azure Digital Twins consists of defining three objects: _matchers_, _user-defined functions_, and _role assignments_:

![Digital Twins Data Processing Flow][2]

### Matchers

_Matchers_ define a set of conditions that evaluate what actions will take place based on incoming sensor telemetry. These conditions to determine the match could include properties from the sensor, the sensor's parent device, and the sensor's parent space. The conditions are expressed as comparisons against a [JSON path](http://jsonpath.com/) as outlined in the example below:

- All sensors of datatype `Temperature`.
- Having `01` in their port.
- Which belong to devices with the extended property key `Manufacturer` set to the value `GoodCorp`.
- Which belong to spaces of type `Venue`.
- Which are descendants of parent `SpaceId` `DE8F06CA-1138-4AD7-89F4-F782CC6F69FD`.

```JSON
{
  "SpaceId": "DE8F06CA-1138-4AD7-89F4-F782CC6F69FD",
  "Name": "My custom matcher",
  "Description": "All sensors of datatype Temperature with 01 in their port that belong to devices with the extended property key Manufacturer set to the value GoodCorp and that belong to spaces of type Venue that are somewhere below space Id DE8F06CA-1138-4AD7-89F4-F782CC6F69FD",
  "Conditions": [
    {
      "target": "Sensor",
      "path": "$.dataType",
      "value": "\"Temperature\"",
      "comparison": "Equals"
    },
    {
      "target": "Sensor",
      "path": "$.port",
      "value": "01",
      "comparison": "Contains"
    },
    {
      "target": "SensorDevice",
      "path": "$.properties[?(@.name == 'Manufacturer')].value",
      "value": "\"GoodCorp\"",
      "comparison": "Equals"
    },
    {
      "target": "SensorSpace",
      "path": "$.type",
      "value": "\"Venue\"",
      "comparison": "Equals"
    }
  ]
}
```

> [!IMPORTANT]
> - JSON paths are case-sensitive.
> - The JSON payload is the same as the payload that would be returned by:
>   - `/sensors/{id}?includes=properties,types` for the sensor.
>   - `/devices/{id}?includes=properties,types,sensors,sensorsproperties,sensorstypes` for the sensor's parent device.
>   - `/spaces/{id}?includes=properties,types,location,timezone` for the sensor's parent space.
> - The comparisons are case-insensitive.

### User-defined functions

A _user-defined function_, or _UDF_, is a custom function that runs within an isolated environment in Azure Digital Twins. UDFs have access to both the raw sensor telemetry message as it was received, as well as to the spatial graph and dispatcher service. Once the UDF is registered within the graph, a matcher (detailed above) must be created to specify when to run the UDF. When Digital Twins receives new telemetry from a given sensor, the matched UDF can calculate a moving average of the last few sensor readings, for example.

UDFs can be written in JavaScript and allow developers to execute custom snippets of code against sensor telemetry messages. There are also helper methods to interact with the graph in the user-defined execution environment. With a UDF, developers can:

- Set the sensor reading directly onto the sensor object within the graph.
- Perform an action based on different sensor readings within a space in the graph.
- Create a notification when certain conditions are met for an incoming sensor reading.
- Attach graph metadata to the sensor reading before sending out a notification.

Refer to [How to User User-Defined Functions](how-to-user-defined-functions.md) for more details.

### Role assignment

A UDF's actions are subject to Digital Twins' role-based access control to secure data within the service. Role assignments ensure that a given UDF has the proper permissions to interact with the spatial graph. For example, a UDF might attempt to create, read, update, or delete graph data under a given space. A UDF's level of access is checked when the UDF asks the graph for data or attempts an action. For more information, see [Role-Based Access Control](security-create-manage-role-assignments.md).

It's possible for a matcher to trigger a UDF that has no role assignments. In this case, the UDF would fail to read any data from the graph.

## Next steps

To learn more about how to routing events and telemetry messages to other Azure services, read [Routing events and messages](concepts-events-routing.md).

To learn more about how to create matchers, user-defined functions, and role assignments, read [Guide for using user-defined functions](how-to-user-defined-functions.md).

<!-- Images -->
[1]: media/concepts/digital-twins-data-processing-flow.png
[2]: media/concepts/digital-twins-user-defined-functions.png
