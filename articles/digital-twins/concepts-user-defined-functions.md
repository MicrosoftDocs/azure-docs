---
title: Data processing and user-defined functions with Azure Digital Twins| Microsoft Docs
description: Overview of data processing, matchers and user-defined functions with Azure Digital Twins
author: alinamstanciu
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: alinast
---

# Data processing and User-Defined Functions

Once devices are sending telemetry data to Digital Twins, data processing can take place. This processing takes place in four phases: _parse_, _match_, _compute_, and _dispatch_: 

![Digital Twins Data Processing Flow][1]

1. The parse phase involves transforming incoming telemetry message to a commonly understood [`data transfer object`](https://en.wikipedia.org/wiki/Data_transfer_object) format. Device and sensor validation are executed.
1. The match phase uses the device and sensor information to match the telemetry message with an appropriate User-Defined Function. 
1. The compute phase runs any selected User-Defined Function. It could read spatial graph nodes, update it with computed values and dispatching the notifications to next step.
1. Finally, the dispatch step enqueues notifications and actions to the Dispatcher service.

Any data processing consists of defining three objects: _matchers_, _user-defined function_, and _role assignments_ as outlined below.

# Matchers

_Matchers_ allow for persisting a set of conditions that evaluate on incoming sensor telemetry. Properties from the sensor, the sensor's device, and the sensor's space are used to determine the match. The conditions are expressed as comparisons against a [JSON path](http://jsonpath.com/) as outlined in below example of matcher:

- All sensors of datatype `Temperature`
- Having `01` in their port 
- Which belong to devices with the extended property key `Manufacturer` set to `Contoso`
- which belong to spaces of type `Venue`
- Which are descendants of parent `SpaceId` DE8F06CA-1138-4AD7-89F4-F782CC6F69FD"

```{json}
{
  "SpaceId": DE8F06CA-1138-4AD7-89F4-F782CC6F69FD",
  "Name": "My custom matcher",
  "Description": "All sensors of datatype Temperature with 01 in their port that belong to devices with the extended property key Manufacturer set to Contoso and that belong to spaces of type Venue that are somewhere below space Id DE8F06CA-1138-4AD7-89F4-F782CC6F69FD",
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
      "value": "\"Contoso\"",
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

>[!NOTE]
- JSON paths are case-sensitive
- JSON payload is identical to the payload that would be returned by `/sensors/{id}?includes=properties,types` or `/devices/{id}?includes=properties,types,sensors,sensorsproperties,sensorstypes` or `/spaces/{id}?includes=properties,types,location,timezone` for respectively the sensor, the sensor's parent device and the sensor's parent space.
- The comparisons are case-insensitive.

# User-Defined Function

A `User-Defined Function` or _UDF_ is a custom function that runs within an isolated environment and has access both to the sensor telemetry message as it was received, as well as to the graph and dispatcher service. When new telemetry from a sensor is received, a UDF may choose to calculate a moving average of the last few sensor readings, for example. Once the UDF is registered within the graph, a matcher must be created to specify when to run the UDF. A matcher specifies a condition on which to run a specific UDF.
 
The role assignments of the UDF are what tells Digital Twins system which data the UDF itself can access. This access is checked at the time that the UDF code itself asks the graph for data. The matchers are responsible for deciding whether to invoke an UDF for a given piece of sensor telemetry, and this is checked when we receive the telemetry but before the UDF execution has begun.  
 
It is possible, for example, for a matcher to invoke a UDF that has no role assignments, which would mean it would fail to read any data from the graph. It is also possible to give a UDF access to the whole graph but fail to be invoked because it has no appropriate matcher for a given piece of telemetry.

UDFs allow for executing custom snippets of code against sensor telemetry messages. Currently the language supported by the platform is JavaScript. There are also helper methods exposed for dealing with the topology in the user-defined execution environment. An example user-defined function is outlined below:

- Set the sensor reading directly onto the sensor within the graph.
- Perform an action based on different sensor readings within a space in the graph.
- Notify when certain conditions are met for an incoming sensor reading.
- Attach graph metadata to the sensor reading before sending out a notification.

# Role Assignment

We need to create a role assignment for the UDF to execute under to ensure it has the proper permissions to interact with the Digital Twins Management APIs to perform actions on graph objects. The actions that the UDF performs are not exempt from the role-based access control within the Digital Twins Management APIs. They can be limited in scope by specifying certain roles, or certain access control paths. See [Role-Based Access Control](security-create-manage-role-assignments.md) documentation for further information.

## Next steps

Learn more on how to create matchers, user-defined functions, and role assignments:

<!-- > [!div class="nextstepaction"]
> [How to create User-Defined Functions] (howto-user-defined-functions.md) -->

<!-- Images -->
[1]: media/concepts/digital-twins-data-processing-flow.png
