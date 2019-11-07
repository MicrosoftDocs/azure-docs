---
title: Configure the Connected Factory topology - Azure | Microsoft Docs
description: This article describes how to configure the Connected Factory solution accelerator including its topology. 
author: dominicbetts
manager: timlt
ms.service: iot-accelerators
services: iot-accelerators
ms.topic: conceptual
ms.date: 12/12/2017
ms.author: dobett
---

# Configure the Connected Factory solution accelerator

The Connected Factory solution accelerator shows a simulated dashboard for a fictional company Contoso. This company has factories in numerous global locations globally.

This article uses Contoso as an example to describe how to configure the topology of a Connected Factory solution.

## Simulated factories configuration

Each Contoso factory has production lines that consist of three stations each. Each station is a real OPC UA server with a specific role:

* Assembly station
* Test station
* Packaging station

These OPC UA servers have OPC UA nodes and [OPC Publisher](overview-opc-publisher.md) sends the values of these nodes to Connected Factory. This includes:

* Current operational status such as current power consumption.
* Production information such as the number of products produced.

You can use the dashboard to drill into the Contoso factory topology from a global view down to a station level view. The Connected Factory dashboard enables:

* The visualization of OEE and KPI figures for each layer in the topology.
* The visualization of current values of OPC UA nodes in the stations.
* The aggregation of the OEE and KPI figures from the station level to the global level.
* The visualization of alerts and actions to perform if values reach specific thresholds.

## Connected Factory topology

The topology of factories, production lines, and stations is hierarchical:

* The global level has factory nodes as children.
* The factories have production line nodes as children.
* The production lines have station nodes as children.
* The stations (OPC UA servers) have OPC UA nodes as children.

Every node in the topology has a common set of properties that define:

* A unique identifier for the topology node.
* A name.
* A description.
* An image.
* The children of the topology node.
* Minimum, target, and maximum values for OEE and KPI figures and the alert actions to execute.

## Topology configuration file

To configure the properties listed in the previous section, the Connected Factory solution uses a configuration file called [ContosoTopologyDescription.json](https://github.com/Azure/azure-iot-connected-factory/blob/master/WebApp/Contoso/Topology/ContosoTopologyDescription.json).

You can find this file in the solution source code in the `WebApp/Contoso/Topology` folder.

The following snippet shows an outline of the `ContosoTopologyDescription.json` configuration file:

```json
{
  <global_configuration>,
  "Factories": [
    <factory_configuration>,
    "ProductionLines": [
      <production_line_configuration>,
      "Stations": [
        <station_configuration>,
        <more station_configurations>
      ],
      <more production_line_configurations>
    ]
    <more factory_configurations>
  ]
}
```

The common properties of `<global_configuration>`, `<factory_configuration>`, `<production_line_configuration>`, and `<station_configuration>` are:

* **Name** (type string)

  Defines a descriptive name, which should be only one word for the topology node to show in the dashboard.

* **Description** (type string)

  Describes the topology node in more detail.

* **Image** (type string)

  The path to an image in the WebApp solution to show when information about the topology node is shown in the dashboard.

* **OeeOverall**, **OeePerformance**, **OeeAvailability**, **OeeQuality**, **Kpi1**, **Kpi2** (type `<performance_definition>`)

  These properties define minimal, target, and maximal values of the operational figure used to generate alerts. These properties also define the actions to execute if an alert is detected.

The `<factory_configuration>` and `<production_line_configuration>` items have a property:

* **Guid** (type string)

  Uniquely identifies the topology node.

`<factory_configuration>` has a property:

* **Location** (type `<location_definition>`)

  Specifies where the factory is located.

`<station_configuration>` has properties:

* **OpcUri** (type string)

  This property must be set to the OPC UA Application URI of the OPC UA server.
  Because it must be globally unique by OPC UA specification, this property is used to identify the station topology node.

* **OpcNodes**, which are an array of OPC UA nodes (type `<opc_node_description>`)

`<location_definition>` has properties:

* **City** (type string)

  Name of city closest to the location

* **Country** (type string)

  Country of the location

* **Latitude** (type double)

  Latitude of the location

* **Longitude** (type double)

  Longitude of the location

`<performance_definition>` has properties:

* **Minimum** (type double)

  Lower threshold the value can reach. If the current value is below this threshold, an alert is generated.

* **Target** (type double)

  Ideal target value.

* **Maximum** (type double)

  Upper threshold the value can reach. If the current value is above this threshold, an alert is generated.

* **MinimumAlertActions** (type `<alert_action>`)

  Defines the set of actions, which can be taken as response to a minimum alert.

* **MaximumAlertActions** (type `<alert_action>`)

  Defines the set of actions, which can be taken as response to a maximum alert.

`<alert_action`> has properties:

* **Type** (type string)

  Type of the alert action. The following types are known:

  * **AcknowledgeAlert**: the status of the alert should change to acknowledged.
  * **CloseAlert**: all older alerts of the same type should no longer be shown in the dashboard.
  * **CallOpcMethod**: an OPC UA method should be called.
  * **OpenWebPage**: a browser window should be opened showing additional contextual information.

* **Description** (type string)

  Description of the action shown in the dashboard.

* **Parameter** (type string)

  Parameters required to execute the action. The value depends on the action type.

  * **AcknowledgeAlert**: no parameter required.
  * **CloseAlert**: no parameter required.
  * **CallOpcMethod**: the node information and parameters of the OPC UA method to call in the format "NodeId of parent node, NodeId of method to call, URI of the OPC UA server."
  * **OpenWebPage**: the URL to show in the browser window.

`<opc_node_description>` contains information about OPC UA nodes in a station (OPC UA server). Nodes that represent no existing OPC UA nodes, but are used as storage in the computation logic of Connected Factory are also valid. It has the following properties:

* **NodeId** (type string)

  Address of the OPC UA node in the station’s (OPC UA server’s) address space. Syntax must be as specified in the OPC UA specification for a NodeId.

* **SymbolicName** (type string)

  Name to be shown in the dashboard when the value of this OPC UA node is shown.

* **Relevance** (array of type string)

  Indicates for which computation of OEE or KPI the OPC UA node value is relevant. Each array element can be one of the following values:

  * **OeeAvailability_Running**: the value is relevant for calculation of OEE Availability.
  * **OeeAvailability_Fault**: the value is relevant for calculation of OEE Availability.
  * **OeePerformance_Ideal**: the value is relevant for calculation of OEE Performance and is typically a constant value.
  * **OeePerformance_Actual**: the value is relevant for calculation of OEE Performance.
  * **OeeQuality_Good**: the value is relevant for calculation of OEE Quality.
  * **OeeQuality_Bad**: the value is relevant for calculation of OEE Quality.
  * **Kpi1**: the value is relevant for calculation of KPI1.
  * **Kpi2**: the value is relevant for calculation of KPI2.

* **OpCode** (type string)

  Indicates how the value of the OPC UA node is handled in Time Series Insight queries and OEE/KPI calculations. Each Time Series Insight query targets a specific timespan, which is a parameter of the query and delivers a result. The OpCode controls how the result is computed and can be one of the following values:

  * **Diff**: difference between the last and the first value in the timespan.
  * **Avg**: the average of all values in the timespan.
  * **Sum**: the sum of all values in the timespan.
  * **Last**: currently not used.
  * **Count**: the number of values in the timespan.
  * **Max**: the maximal value in the timespan.
  * **Min**: the minimal value in the timespan.
  * **Const**: the result is the value specified by property ConstValue.
  * **SubMaxMin**: the difference between the maximal and the minimal value.
  * **Timespan**: the timespan.

* **Units** (type string)

  Defines a unit of the value for display in the dashboard.

* **Visible** (type boolean)

  Controls if the value should be shown in the dashboard.

* **ConstValue** (type double)

  If the **OpCode** is **Const**, then this property is the value of the node.

* **Minimum** (type double)

  If the current value falls below this value, then a minimum alert is generated.

* **Maximum** (type double)

  If the current value raises above this value, then a maximum alert is generated.

* **MinimumAlertActions** (type `<alert_action>`)

  Defines the set of actions, which can be taken as response to a minimum alert.

* **MaximumAlertActions** (type `<alert_action>`)

  Defines the set of actions, which can be taken as response to a maximum alert.

At the station level, you also see **Simulation** objects. These objects are only used to configure the Connected Factory simulation and should not be used to configure a real topology.

## How the configuration data is used at runtime

All the properties used in the configuration file can be grouped into different categories depending on how they are used. Those categories are:

### Visual appearance

Properties in this category define the visual appearance of the Connected Factory dashboard. Examples include:

* Name
* Description
* Image
* Location
* Units
* Visible

### Internal topology tree addressing

The WebApp maintains an internal data dictionary containing information of all topology nodes. The properties **Guid** and **OpcUri** are used as keys to access this dictionary and need to be unique.

### OEE/KPI computation

The OEE/KPI figures for the Connected Factory simulation are parameterized by:

* The OPC UA node values to be included in the calculation.
* How the figure is computed from the telemetry values.

Connected Factory uses the OEE formulas as published by the [http://www.oeefoundation.org](http://www.oeefoundation.org).

OPC UA node objects in stations enable tagging for usage in OEE/KPI calculation. The **Relevance** property indicates for which OEE/KPI figure the OPC UA node value should be used. The **OpCode** property defines how the value is included in the computation.

### Alert handling

Connected Factory supports a simple minimum/maximum threshold-based alert generation mechanism. There are a number of predefined actions you can configure in response to those alerts. The following properties control this mechanism:

* Maximum
* Minimum
* MaximumAlertActions
* MinimumAlertActions

## Correlating to telemetry data

For certain operations, such as visualizing the last value or creating Time Series Insight queries, the WebApp needs an addressing scheme for the ingested telemetry data. The telemetry sent to Connected Factory also needs to be stored in internal data structures. The two properties enabling these operations are at station (OPC UA server) and OPC UA node level:

* **OpcUri**

  Identifies (globally unique) the OPC UA server the telemetry comes from. In the ingested messages, this property is sent as **ApplicationUri**.

* **NodeId**

  Identifies the node value in the OPC UA server. The format of the property must be as specified in the OPC UA specification. In the ingested messages, this property is sent as **NodeId**.

See [What is OPC Publisher](overview-opc-publisher.md) for more information on how the telemetry data is ingested to Connected Factory.

## Example: How KPI1 is calculated

The configuration in the `ContosoTopologyDescription.json` file controls how OEE/KPI figures are calculated. The following example shows how properties in this file control the computation of KPI1.

In Connected Factory KPI1 is used to measure the number of successfully manufactured products in the last hour. Each station (OPC UA server) in the Connected Factory simulation provides an OPC UA node (`NodeId: "ns=2;i=385"`), which provides the telemetry to compute this KPI.

The configuration for this OPC UA node looks like the following snippet:

```json
{
  "NodeId": "ns=2;i=385",
  "SymbolicName": "NumberOfManufacturedProducts",
  "Relevance": [ "Kpi1", "OeeQuality_Good" ],
  "OpCode": "SubMaxMin"
},
```

This configuration enables querying of the telemetry values of this node using Time Series Insights. The Time Series Insights query retrieves:

* The number of values.
* The minimal value.
* The maximal value.
* The average of all values.
* The sum of all values for all unique **OpcUri** (**ApplicationUri**), **NodeId** pairs in a given timespan.

One characteristic of the **NumberOfManufactureredProducts** node value is that it only increases. To calculate the number of products manufactured in the timespan, Connected Factory uses the **OpCode** **SubMaxMin**. The calculation retrieves the minimum value at the start of the timespan and the maximum value at the end of the timespan.

The **OpCode** in the configuration configures the computation logic to calculate the result of the difference of maximum and minimum value. Those results are then accumulated bottom up to the root (global) level and shown in the dashboard.

## Next steps

A suggested next step is to learn how to [Customize the Connected Factory solution](iot-accelerators-connected-factory-customize.md).
