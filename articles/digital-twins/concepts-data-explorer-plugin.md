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

1. What is the Azure Digital Twins Query Plugin for Azure Data Explorer (ADX)? 

The Azure Digital Twins plugin for ADX allows you to run queries that access and combine data across the Azure Digital Twins twin graph and ADX time series databases. For example, you can write a KQL query that selects digital twins of interest via the Azure Digital Twins query plugin, joins those twins against the respective times series in ADX, and then performs advanced time series analytics on those twins. Use the plugin to contextualize disparate time series data by reasoning across digital twins and their relationships to gain insights into the behavior of modeled environments. 

2. What will I do during the private preview? 

To get you up and running with the plugin, we've provided an example scenario where you will combine data in a sample twin graph in Azure Digital Twins with sample time series data in ADX. More specifically, you will use the queries to understand the operational behavior of various portions of an example power distribution grid. You are also welcome to use the plugin with your own application.  

3. Can I get the plugin running on my own ADX cluster? 

Yes, although the example scenario below uses a public ADX cluster that contains sample time series data for this exercise. If you wish to use the plugin on your own cluster, run the following command to enable the plugin. 

```kusto
.enable plugin azure_digital_twins_query_request. 
```

This command requires All Databases admin permission. More information on the command can be found here. 

4. Are there any prerequisites for participating in the Private Preview? 

In your CLI, install/upgrade the Azure IoT Extension using the command 

```azurecli-interactive
az extension add --name azure-iot [–upgrade] 
```

6. How does the Azure Digital Twins plugin for ADX work? 

You can invoke the Azure Digital Twins plugin within an ADX Kusto query as follows: 

```kusto
evaluate azure_digital_twins_query_request(Azure Digital Twinsendpoint, Azure Digital Twinsquery) 
```

where `Azure Digital Twinsendpoint` and `Azure Digital Twinsquery` are strings representing the Azure Digital Twins instance endpoint and Azure Digital Twins query, respectively. The plugin works by calling the Azure Digital Twins query API, and the query language structure is the same as when using the API. The user of the plugin must be granted the Azure Digital Twins Data Reader role or the Azure Digital Twins Data Owner role, as the user's Azure AD token is used to authenticate. Information on how to assign this role can be found here. 

7. This Private Preview uses simulated data. How can I ingest my own IoT data into an ADX cluster? 

There are two main pathways for ingesting IoT data into ADX: 

Path 1: Ingest IoT data directly into an ADX cluster. In this scenario, telemetry data is fed directly into ADX, without being used to update the state of digital twins in Azure Digital Twins. In this case, the twin graph is used to contextualize time series data using joint Azure Digital Twins/ADX queries. Customers are free to use whatever data schema they like in ADX, although they will need to define the mapping between time series IDs and the twin IDs. See FAQs 8 and 10 below for more detail. 

Path 2: Egress Telemetry and Twin Property Updates from Azure Digital Twins to ADX. We are building an integration that will automatically historize digital twin state changes by recording the twin property updates to ADX. This integration will eliminate the need to write Azure functions to perform the task. This path will be suitable for customers that currently use telemetry data to bring their digital twins to life and rely on twin change events to drive notifications and reactive-computing within the twin graph (Azure Digital Twins->ADX egress private preview starts 6/30). As with Path 1, customers will be able to run joint Azure Digital Twins/ADX queries using the plugin to contextualize time series data. 

8. What ADX schema is used for the time series data in example walkthrough below? 

We have used the same schema that will be used for the automated historization of twin data from Azure Digital Twins to ADX (Path 2 above). The schema is as follows: 

| timestamp | twinId | modelId | name | value | relationshipTarget | relationshipID |
| --- | --- | --- | --- | --- | --- | --- |
| ... | ... | ... | ... | ... | ... | ... |
| 2021-02-01 17:24 | ConfRoomTempSensor | dtmi:com:example:TemperatureSensor;1 | temperature | 301.0 |  |  |
| ... | ... | ... | ... | ... | ... | ... |

Digital twin properties are stored as key-value pairs (name, value). name and value are stored as dynamic data types. The schema also supports storing properties for relationships, per the relationshipTarget and relationshipID fields. The key-value schema avoids the need to create a column for each twin property. 

9. How can I use this schema to store a property with multiple fields, such as roll, pitch, yaw? 

If you are storing samples directly to ADX yourself (Path 1 above), you can store a JSON object {“roll”: 20, “pitch”: 15, “yaw”: 45} as value. Once Azure Digital Twins supports Path 2, DTDL properties of type Object will be written to ADX in this fashion. 

10. We are following Path 1, and ingesting time series data directly into ADX. How can we convert this raw time series data into a schema suitable for joint Azure Digital Twins/ADX queries? 

You can create an update policy in ADX to automatically transform and append data to a target table whenever new data is inserted into a source table. Use the update policy to enrich your raw time series data with the twin ID and persist it to a target table. Using the twin ID, the target table can then be joined against the digital twins selected by the Azure Digital Twins plugin. 

For example, say you created a table to hold the raw time series data flowing into your ADX instance. 

```kusto
.createmerge table rawData (Timestamp:datetime, someId:string, Value:string, ValueType:string)  
```

Create a mapping table to relate time series IDs with twin IDs and other optional fields. 

```kusto
.createmerge table mappingTable (someId:string, twinId:string, otherMetadata:string) 
```

Create a target table to hold the enriched time series data. 

```kusto
.createmerge table timeseriesSilver (twinId:string, Timestamp:datetime, someId:string, otherMetadata:string, ValueNumeric:real, ValueString:string)  
``` 

Create a function to enrich the raw data by joining it with the mapping table. This will add the twin ID to the resulting target table. 

```kusto
.createoralter function with (folder = "Update", skipvalidation = "true") Update_rawData() { 
rawData 
| join kind=leftouter mappingTable on someId 
| project 
    Timestamp, ValueNumeric = toreal(Value), ValueString = Value, … 
} 
```  

Lastly, create an update policy to call the function Update_rawData and update the target table. 

```kusto
.alter table timeseriesSilver policy update 
@'[{"IsEnabled": true, "Source": "rawData", "Query": "Update_rawData()", "IsTransactional": false, "PropagateIngestionProperties": false}]' 
```

Once the target table is created, you can use the Azure Digital Twins plugin to select twins of interest and then join them against time series data in the target table. See the walkthrough below for query examples. 

## Next steps

<link to kusto documentation for query?>

Read about another strategy for analyzing historical data in Azure Digital Twins:
* [How-to: Integrate with Azure Time Series Insights](how-to-integrate-time-series-insights.md)