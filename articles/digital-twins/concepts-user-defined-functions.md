---
title: 'Data processing and user-defined functions with Azure Digital Twins| Microsoft Docs'
description: Overview of data processing, matchers, and user-defined functions with Azure Digital Twins.
author: alinamstanciu
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 01/02/2019
ms.author: alinast
---

# Data processing and user-defined functions

Azure Digital Twins offers advanced compute capabilities. Developers can define and run custom functions against incoming telemetry messages to send events to predefined endpoints.

## Data processing flow

After devices send telemetry data to Azure Digital Twins, developers can process data in four phases: *validate*, *match*, *compute*, and *dispatch*.

![Azure Digital Twins data processing flow][1]

1. The validate phase transforms the incoming telemetry message to a commonly understood [data transfer object](https://docs.microsoft.com/aspnet/web-api/overview/data/using-web-api-with-entity-framework/part-5) format. This phase also executes device and sensor validation.
1. The match phase finds the appropriate user-defined functions to run. Predefined matchers find the user-defined functions based on the device, sensor, and space information from the incoming telemetry message.
1. The compute phase runs the user-defined functions matched in the previous phase. These functions might read and update computed values on spatial graph nodes and can emit custom notifications.
1. The dispatch phase routes any custom notifications from the compute phase to endpoints defined in the graph.

## Data processing objects

Data processing in Azure Digital Twins consists of defining three objects: *matchers*, *user-defined functions*, and *role assignments*.

![Azure Digital Twins data processing objects][2]

<div id="matcher"></div>

### Matchers

Matchers define a set of conditions that evaluate what actions take place based on incoming sensor telemetry. Conditions to determine the match might include properties from the sensor, the sensor's parent device, and the sensor's parent space. The conditions are expressed as comparisons against a [JSON path](https://jsonpath.com/) as outlined in this example:

- All sensors of datatype **Temperature** represented by the escaped String value `\"Temperature\"`
- Having `01` in their port
- Which belong to devices with the extended property key **Manufacturer** set to the escaped String value `\"GoodCorp\"`
- Which belong to spaces of the type specified by the escaped String `\"Venue\"`
- Which are descendants of parent **SpaceId** `DE8F06CA-1138-4AD7-89F4-F782CC6F69FD`

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
> - JSON paths are case sensitive.
> - The JSON payload is the same as the payload that's returned by:
>   - `/sensors/{id}?includes=properties,types` for the sensor.
>   - `/devices/{id}?includes=properties,types,sensors,sensorsproperties,sensorstypes` for the sensor's parent device.
>   - `/spaces/{id}?includes=properties,types,location,timezone` for the sensor's parent space.
> - The comparisons are case insensitive.

### User-defined functions

A user-defined function is a custom function executed within an isolated Azure Digital Twins environment. User-defined functions have access to raw sensor telemetry message as it gets received. User-defined functions also have access to the spatial graph and dispatcher service. After the user-defined function is registered within a graph, a matcher (detailed [above](#matcher)) must be created to specify when the function is executed. For example, when Azure Digital Twins receives new telemetry from a given sensor, the matched user-defined function can calculate a moving average of the last few sensor readings.

User-defined functions can be written in JavaScript. Helper methods interact with the graph in the user-defined execution environment. Developers can execute custom snippets of code against sensor telemetry messages. Examples include:

- Set the sensor reading directly onto the sensor object within the graph.
- Perform an action based on different sensor readings within a space in the graph.
- Create a notification when certain conditions are met for an incoming sensor reading.
- Attach graph metadata to the sensor reading before sending out a notification.

For more information, see [How to use user-defined functions](./how-to-user-defined-functions.md).


#### Examples

The [GitHub repo for the Digital Twins C# sample](https://github.com/Azure-Samples/digital-twins-samples-csharp/) contains a few examples of the user-defined functions:
- [This function](https://github.com/Azure-Samples/digital-twins-samples-csharp/blob/master/occupancy-quickstart/src/actions/userDefinedFunctions/availabilityForTutorial.js) looks for carbon dioxide, motion, and temperature values to determine whether a room is available with these values in range. The [tutorials for Digital Twins](tutorial-facilities-udf.md) explore this function in more details. 
- [This function](https://github.com/Azure-Samples/digital-twins-samples-csharp/blob/master/occupancy-quickstart/src/actions/userDefinedFunctions/multiplemotionsensors.js) looks for data from multiple motion sensors, and determines that the space is available if none of them detect any motion. You can easily replace the user-defined function used in either the [quickstart](quickstart-view-occupancy-dotnet.md), or the [tutorials](tutorial-facilities-setup.md), by making the changes mentioned in the comments section of the file. 



### Role assignment

A user-defined function's actions are subject to Azure Digital Twins [role-based access control](./security-role-based-access-control.md) to secure data within the service. Role assignments define which user-defined functions have the proper permissions to interact with the spatial graph and its entities. For example, a user-defined function might have the ability and permission to *CREATE*, *READ*, *UPDATE*, or *DELETE* graph data under a given space. A user-defined function's level of access is checked when the user-defined function asks the graph for data or attempts an action. For more information, see [Role-based access control](./security-create-manage-role-assignments.md).

It's possible for a matcher to trigger a user-defined function that has no role assignments. In this case, the user-defined function fails to read any data from the graph.

## Next steps

- To learn more about how to route events and telemetry messages to other Azure services, read [Route events and messages](./concepts-events-routing.md).

- To learn more about how to create matchers, user-defined functions, and role assignments, read [Guide for using user-defined functions](./how-to-user-defined-functions.md).

- Review the [user-defined function client library reference documentation](./reference-user-defined-functions-client-library.md).

<!-- Images -->
[1]: media/concepts/digital-twins-data-processing-flow.png
[2]: media/concepts/digital-twins-user-defined-functions.png
