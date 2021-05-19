---
# Mandatory fields.
title: Querying with Azure Data Explorer
titleSuffix: Azure Digital Twins
description: Understand the Azure Digital Twins query plugin for Azure Data Explorer
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 5/19/2021
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Azure Digital Twins query plugin for Azure Data Explorer

The Azure Digital Twins plugin for [Azure Data Explorer (ADX)](/azure/data-explorer/data-explorer-overview) lets you run ADX queries that access and combine data across the Azure Digital Twins graph and ADX time series databases. Use the plugin to contextualize disparate time series data by reasoning across digital twins and their relationships to gain insights into the behavior of modeled environments.

For example, with this plugin, you can write a KQL query that...
1. selects digital twins of interest via the Azure Digital Twins query plugin,
2. joins those twins against the respective times series in ADX, and then 
3. performs advanced time series analytics on those twins.  

Combining data from a twin graph in Azure Digital Twins with time series data in ADX can help you understand the operational behavior of various parts of your solution. 

## Using the plugin

In order to get the plugin running on your own ADX cluster that contains time series data, start by running the following command to enable the plugin:

```kusto
.enable plugin azure_digital_twins_query_request. 
```

This command requires **All Databases admin** permission. For more information on the command, see the [.enable plugin documentation](/azure/data-explorer/kusto/management/enable-plugin). 

Once the plugin is enabled, you can invoke it within an ADX Kusto query like this: 

```kusto
evaluate azure_digital_twins_query_request(Azure Digital Twinsendpoint, Azure Digital Twinsquery) 
```

where `Azure Digital Twinsendpoint` and `Azure Digital Twinsquery` are strings representing the Azure Digital Twins instance endpoint and Azure Digital Twins query, respectively. 

The plugin works by calling the [Azure Digital Twins query API](/rest/api/digital-twins/dataplane/query), and the [query language structure](concepts-query-language.md) is the same as when using the API. The user of the plugin must be granted the Azure Digital Twins Data Reader role or the Azure Digital Twins Data Owner role, as the user's Azure AD token is used to authenticate. Information on how to assign this role can be found in [Concepts: Security for Azure Digital Twins solutions](concepts-security.md#authorization-azure-roles-for-azure-digital-twins). 

## Using ADX IoT data with Azure Digital Twins

There are two main pathways for ingesting IoT data into ADX to be used with Azure Digital Twins.

* **Ingest telemetry data directly (path 1)**: In this scenario, telemetry data is fed directly into an ADX cluster, without being used to update the state of digital twins in Azure Digital Twins. In this case, the twin graph is used to contextualize time series data using joint Azure Digital Twins/ADX queries. With this path, you can use whatever data schema you want to in ADX, but you'll need to define the mapping between time series IDs and the twin IDs. For more detail on this process, see [Mapping data across ADX and Azure Digital Twins (path 1)](#mapping-data-across-adx-and-azure-digital-twins-path-1) below. 

* **Receive telemetry and property updates from Azure Digital Twins (path 2)**: Azure Digital Twins can automatically historize digital twin state changes by recording the twin property updates to ADX. This path is a good choice if you currently use telemetry data to bring your digital twins to life, and rely on twin change events to drive notifications and reactive-computing within the twin graph.

In either of these scenarios, you'll be able to run joint Azure Digital Twins/ADX queries using the plugin to contextualize time series data. The next sections describe data schema considerations for making these joint queries.

### Mapping data across ADX and Azure Digital Twins (path 1)

If you're following path 1, ingesting time series data directly into ADX, you'll need to convert this raw time series data into a schema suitable for joint Azure Digital Twins/ADX queries.

An [update policy](/azure/data-explorer/kusto/management/updatepolicy.md) in ADX allows you to automatically transform and append data to a target table whenever new data is inserted into a source table. 

You can use an update policy to enrich your raw time series data with the corresponding **twin ID** from Azure Digital Twins, and persist it to a target table. Using the twin ID, the target table can then be joined against the digital twins selected by the Azure Digital Twins plugin. 

For example, say you created the following table to hold the raw time series data flowing into your ADX instance. 

```kusto
.createmerge table rawData (Timestamp:datetime, someId:string, Value:string, ValueType:string)  
```

You could create a mapping table to relate time series IDs with twin IDs, and other optional fields. 

```kusto
.createmerge table mappingTable (someId:string, twinId:string, otherMetadata:string) 
```

Then, create a target table to hold the enriched time series data. 

```kusto
.createmerge table timeseriesSilver (twinId:string, Timestamp:datetime, someId:string, otherMetadata:string, ValueNumeric:real, ValueString:string)  
```

Next, create a function `Update_rawData` to enrich the raw data by joining it with the mapping table. This will add the twin ID to the resulting target table. 

```kusto
.createoralter function with (folder = "Update", skipvalidation = "true") Update_rawData() { 
rawData 
| join kind=leftouter mappingTable on someId 
| project 
    Timestamp, ValueNumeric = toreal(Value), ValueString = Value, ... 
} 
```

Lastly, create an update policy to call the function and update the target table. 

```kusto
.alter table timeseriesSilver policy update 
@'[{"IsEnabled": true, "Source": "rawData", "Query": "Update_rawData()", "IsTransactional": false, "PropagateIngestionProperties": false}]' 
```

Once the target table is created, you can use the Azure Digital Twins plugin to select twins of interest and then join them against time series data in the target table. 

### Automated historization schema (path 2)

When twin data is automatically historized from Azure Digital Twins to ADX (path 2), it uses the following schema (shown with example values below).

| timestamp | twinId | modelId | name | value | relationshipTarget | relationshipID |
| --- | --- | --- | --- | --- | --- | --- |
| 2021-02-01 17:24 | ConfRoomTempSensor | dtmi:com:example:TemperatureSensor;1 | temperature | 301.0 |  |  |

Digital twin properties are stored as key-value pairs (`name, value`). `name` and `value` are stored as dynamic data types. 

The schema also supports storing properties for relationships, per the `relationshipTarget` and `relationshipID` fields. The key-value schema avoids the need to create a column for each twin property.

### Representing properties with multiple fields 

You may want to store a property in your schema with multiple fields. These properties are represented by storing a JSON object as `value`.

For instance, if you want to represent a property with three fields for roll, pitch, and yaw, the object would look like this:`{"roll": 20, "pitch": 15, "yaw": 45}`.

If you are storing samples directly to ADX yourself (path 1), you'll create and store this JSON object yourself. If you're taking advantage of automatic historization (path 2), DTDL properties of type Object will be written to ADX in this fashion. 

## Next steps

Read about another strategy for analyzing historical data in Azure Digital Twins:
* [How-to: Integrate with Azure Time Series Insights](how-to-integrate-time-series-insights.md)