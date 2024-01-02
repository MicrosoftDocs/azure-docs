---
# Mandatory fields.
title: Querying with the Azure Data Explorer plugin
titleSuffix: Azure Digital Twins
description: Learn about the Azure Digital Twins query plugin for Azure Data Explorer
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 03/23/2022
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Azure Digital Twins query plugin for Azure Data Explorer

This article explains about the Azure Digital Twin query plugin for [Azure Data Explorer](/azure/data-explorer/data-explorer-overview), how to use Azure Data Explorer IoT data with Azure Digital Twins, how to map data across Azure Data Explorer and Azure Digital Twins, and more.

The Azure Digital Twins plugin for [Azure Data Explorer](/azure/data-explorer/data-explorer-overview) lets you run Azure Data Explorer queries that access and combine data across the Azure Digital Twins graph and Azure Data Explorer time series databases. Use the plugin to contextualize disparate time series data by reasoning across digital twins and their relationships to gain insights into the behavior of modeled environments.

For example, with this plugin, you can write a Kusto query that:
1. Selects digital twins of interest via the Azure Digital Twins query plugin,
2. Joins those twins against the respective times series in Azure Data Explorer, and then 
3. Performs advanced time series analytics on those twins.  

Combining data from a twin graph in Azure Digital Twins with time series data in Azure Data Explorer can help you understand the operational behavior of various parts of your solution. 

## Using the plugin

You can invoke the plugin in a Kusto query with the following command. There are two placeholders, `<Azure-Digital-Twins-endpoint>` and `<Azure-Digital-Twins-query>`, which are strings representing the Azure Digital Twins instance endpoint and Azure Digital Twins query, respectively. 

```kusto
evaluate azure_digital_twins_query_request(<Azure-Digital-Twins-endpoint>, <Azure-Digital-Twins-query>) 
```

The plugin works by calling the [Azure Digital Twins Query API](/rest/api/digital-twins/dataplane/query), and the [query language structure](concepts-query-language.md) is the same as when using the API, with two exceptions: 
* The `*` wildcard in the `SELECT` clause isn't supported. Instead, Azure Digital Twin queries that are executed using the plugin should use aliases in the `SELECT` clause.

    For example, consider the below Azure Digital Twins query that is executed using the API:
    
    ```SQL
    SELECT * FROM DIGITALTWINS
    ```
    
    To execute that query when using the plugin, it should be rewritten like this:
    
    ```SQL
    SELECT T FROM DIGITALTWINS T
    ```
* Column names returned by the plugin may not start with a `$`. Using aliases in the `SELECT` clause will also help to avoid this scenario.

    For example, consider the below Azure Digital Twins query that is executed using the API:
    
    ```SQL
    SELECT T.$dtId, T.Temperature FROM DIGITALTWINS T
    ```
    
    To execute that query when using the plugin, it should be rewritten like this:
    
    ```SQL
    SELECT T.$dtId as tid, T.Temperature FROM DIGITALTWINS T
    ```


>[!IMPORTANT]
>The user of the plugin must be granted the **Azure Digital Twins Data Reader** role or the **Azure Digital Twins Data Owner** role, as the user's Microsoft Entra token is used to authenticate. Information on how to assign this role can be found in [Security for Azure Digital Twins solutions](concepts-security.md#authorization-azure-roles-for-azure-digital-twins).

For more information on using the plugin, see the [Kusto documentation for the azure_digital_twins_query_request plugin](/azure/data-explorer/kusto/query/azure-digital-twins-query-request-plugin).

To see example queries and complete a walkthrough with sample data, see [Azure Digital Twins query plugin for Azure Data Explorer: Sample queries and walkthrough](https://github.com/Azure-Samples/azure-digital-twins-getting-started/tree/main/adt-adx-queries) in GitHub.

## Ingesting Azure Digital Twins data into Azure Data Explorer

Before querying with the plugin, you'll need to ingest your Azure Digital Twins data into Azure Data Explorer. There are two main ways you can do so: through the **data history** feature, or through direct ingestion. The following sections describe these options in more detail.

### Ingesting with data history

The simplest way to ingest IoT data from Azure Digital Twins into Azure Data Explorer is to use the **data history** feature. This feature allows you to set up a connection between your Azure Digital Twins instance and an Azure Data Explorer cluster, and graph updates (including twin property updates, twin lifecycle events, and relationship lifecycle events) are automatically historized to the cluster. This is a good choice if you're using telemetry data to bring your digital twins to life. For more information about this feature, see [Data history (with Azure Data Explorer)](concepts-data-history.md). 

### Direct ingestion

You can also opt to [ingest IoT data directly into your Azure Data Explorer cluster from IoT Hub](/azure/data-explorer/ingest-data-iot-hub), or from other sources. Then, the Azure Digital Twins graph will be used to contextualize the time series data using joint Azure Digital Twins/Azure Data Explorer queries. This option is a good choice for direct-ingestion workloads—however, you won't be able to leverage Azure Digital Twins' event-based architecture to update other twins, trigger downstream services, or emit notifications when twins change state. For more information about this process, continue through the rest of this section.

#### Mapping data across Azure Data Explorer and Azure Digital Twins

If you're ingesting time series data directly into Azure Data Explorer, you may need to convert this raw time series data into a schema suitable for joint Azure Digital Twins/Azure Data Explorer queries.

An [update policy](/azure/data-explorer/kusto/management/updatepolicy) in Azure Data Explorer allows you to automatically transform and append data to a target table whenever new data is inserted into a source table. 

If the sensor ID in your telemetry data differs from the corresponding twin ID in Azure Digital Twins, you can use an update policy to enrich your raw time series data with the twin ID and persist it to a target table. Using the twin ID, the target table can then be joined against the digital twins selected by the Azure Digital Twins plugin. 

For example, say you created the following table to hold the raw time series data flowing into your Azure Data Explorer instance. 

```kusto
.create-merge table rawData (Timestamp:datetime, someId:string, Value:string, ValueType:string)  
```

You could create a mapping table to relate time series IDs with twin IDs, and other optional fields. 

```kusto
.create-merge table mappingTable (someId:string, twinId:string, otherMetadata:string) 
```

Then, create a target table to hold the enriched time series data. 

```kusto
.create-merge table timeseriesSilver (twinId:string, Timestamp:datetime, someId:string, otherMetadata:string, ValueNumeric:real, ValueString:string)  
```

Next, create a function `Update_rawData` to enrich the raw data by joining it with the mapping table. Doing so will add the twin ID to the resulting target table. 

```kusto
.create-or-alter function with (folder = "Update", skipvalidation = "true") Update_rawData() { 
rawData 
| join kind=leftouter mappingTable on someId 
| project 
    Timestamp, ValueNumeric = toreal(Value), ValueString = Value, ... 
} 
```

Lastly, create an update policy to call the function and update the target table. 

```kusto
.alter table timeseriesSilver policy update 
@'[{"IsEnabled": true, "Source": "rawData", "Query": "Update_rawData()", "IsTransactional": false, "PropagateIngestionProperties": false}]' 
```

Once the target table is created, you can use the Azure Digital Twins plugin to select twins of interest and then join them against time series data in the target table. 

#### Example schema

Here's an example of a schema that might be used to represent shared data. The example follows the Azure Data Explorer [data history schema for twin property updates](concepts-data-history.md#twin-property-updates).

| `TimeStamp` | `SourceTimeStamp` | `TwinId` | `ModelId` | `Name` | `Value` | `RelationshipTarget` | `RelationshipID` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2021-02-01 17:24 | 2021-02-01 17:11 | ConfRoomTempSensor | `dtmi:com:example:TemperatureSensor;1` | temperature | 301.0 |  |  |

Digital twin properties are stored as key-value pairs (`name, value`). `name` and `value` are stored as dynamic data types. 

The schema also supports storing properties for relationships, per the `relationshipTarget` and `relationshipID` fields. The key-value schema avoids the need to create a column for each twin property.

#### Representing properties with multiple fields 

You may want to store a property in your schema with multiple fields. These properties are represented by storing a JSON object as `value` in your schema.

For instance, if you want to represent a property with three fields for roll, pitch, and yaw, the value object would look like this: `{"roll": 20, "pitch": 15, "yaw": 45}`.

## Next steps

* View the plugin documentation for the Kusto Query Language in Azure Data Explorer: [azure_digital_twins_query_request plugin](/azure/data-explorer/kusto/query/azure-digital-twins-query-request-plugin)

* View sample queries using the plugin, including a walkthrough that runs the queries in an example scenario: [Azure Digital Twins query plugin for Azure Data Explorer: Sample queries and walkthrough](https://github.com/Azure-Samples/azure-digital-twins-getting-started/tree/main/adt-adx-queries) 

* Read about another strategy for analyzing historical data in Azure Digital Twins: [Integrate with Azure Time Series Insights](how-to-integrate-time-series-insights.md)
