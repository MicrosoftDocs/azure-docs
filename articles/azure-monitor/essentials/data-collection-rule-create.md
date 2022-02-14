---
title: Create data collection rule in Azure Monitor
description: Details on how to create a data collection rule in Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 01/06/2022

---



# Create data collection rule in Azure Monitor

## Create a DCR
You can currently use any of the following methods to create a DCR:

- [Use the Azure portal](../agents/data-collection-rule-azure-monitor-agent.md) to create a data collection rule and have it associated with one or more virtual machines.
- Directly edit the data collection rule in JSON and [submit using the REST API](/rest/api/monitor/datacollectionrules).
- Create DCR and associations with [Azure CLI](https://github.com/Azure/azure-cli-extensions/blob/master/src/monitor-control-service/README.md).
- Create DCR and associations with Azure PowerShell.
  - [Get-AzDataCollectionRule](https://github.com/Azure/azure-powershell/blob/master/src/Monitor/Monitor/help/Get-AzDataCollectionRule.md)
  - [New-AzDataCollectionRule](https://github.com/Azure/azure-powershell/blob/master/src/Monitor/Monitor/help/New-AzDataCollectionRule.md)
  - [Set-AzDataCollectionRule](https://github.com/Azure/azure-powershell/blob/master/src/Monitor/Monitor/help/Set-AzDataCollectionRule.md)
  - [Update-AzDataCollectionRule](https://github.com/Azure/azure-powershell/blob/master/src/Monitor/Monitor/help/Update-AzDataCollectionRule.md)
  - [Remove-AzDataCollectionRule](https://github.com/Azure/azure-powershell/blob/master/src/Monitor/Monitor/help/Remove-AzDataCollectionRule.md)
  - [Get-AzDataCollectionRuleAssociation](https://github.com/Azure/azure-powershell/blob/master/src/Monitor/Monitor/help/Get-AzDataCollectionRuleAssociation.md)
  - [New-AzDataCollectionRuleAssociation](https://github.com/Azure/azure-powershell/blob/master/src/Monitor/Monitor/help/New-AzDataCollectionRuleAssociation.md)
  - [Remove-AzDataCollectionRuleAssociation](https://github.com/Azure/azure-powershell/blob/master/src/Monitor/Monitor/help/Remove-AzDataCollectionRuleAssociation.md)

## Components of a data collection rule
Data collection rules include the following components.

| Component |  Description |
|:---|:---|
| Data sources | Unique source of monitoring data with its own format and method of exposing its data. Examples of a data source include Windows event log, performance counters, and syslog. Each data source matches a particular data source type as described below. |
| Streams |  Unique handle that describes a set of data sources that will be transformed and schematized as one type. Each data source requires one or more streams, and one stream may be used by multiple data sources. All data sources in a stream share a common schema. Use multiple streams for example, when you want to send a particular data source to multiple tables in the same Log Analytics workspace. |
| Destinations | Set of destinations where the data should be sent. Examples include Log Analytics workspace and Azure Monitor Metrics. | 
| Data flows | Definition of which streams should be sent to which destinations. |
| Endpoint | HTTPS endpoint for DCR used for custom logs API. The DCR is applied to any data sent to that endpoint. |



### Data source types
Each data source has a data source type. Each type defines a unique set of properties that must be specified for each data source. The data source types currently available are shown in the following table.

| Data source type | Description | 
|:---|:---|
| extension | VM extension-based data source |
| performanceCounters | Performance counters for both Windows and Linux |
| syslog | Syslog events on Linux |
| windowsEventLogs | Windows event log |

## DCR structure

The DCR contains three main sections: `streamDeclarations`, `destinations`, and `dataFlows`.

* *`streamDeclarations`*: this section contains the declaration of all the different types of data that will be sent via the HTTP endpoint directly into Log Analytics. Each stream is an object whose key represents the stream name (this can be any name you choose, but has to start with the "Custom-" prefix), and whose value is the full list of top-level properties that the JSON data that will be sent will contain. Note that the shape of the data you send to the endpoint doesn't need to match that of the destination table. Rather, the output of the transform that is applied on top of the input data needs to match the destination shape. The possible data types that can be assigned to the properties are string, int, long, real, boolean, dynamic, and dateTime. Dynamic data should be represented by a string.  
* *`destinations`*: this section contains a declaration of all the destinations where the data will be sent. Only Log Analytics is supported as a destination today. Each Log Analytics destination will require the full Workspace Resource ID, as well as a friendly name that will be used later in the DCR to refer to this Workspace.  
* *`dataFlows`*: data flows are the section that ties everything together. In it, for each stream we declared in the `streamDeclarations` section, we will specify:
    * the `destination` (from the `destinations` section) where the data will be sent  
    * the `transformKql`, a [KQL](customlogs_kql_guidance.md) snippet that always starts with "source" as the table on which to operate, and is followed by a free-form KQL query describing how to transform the data that was sent in the input shape described in the `streamDeclarations` section to the shape of the table that was created in step 3. Not the full set of KQL commands is available. In brief, only commands that apply to one row at a time are applicable. For example, `where`, `extend`, and `project` are valid, while `summarize` is not  
    * the `outputStream` section, which describes which table in the Workspace specified under the `destination` property the data will be ingested into. The value of the outputStream will have the `Microsoft-[tableName]` shape when data is being ingested into a standard Log Analytics table, or `Custom-[tableName]` when ingesting data into a custom-created table (as we created in step 3 in this tutorial)  



## Data collection endpoint


## Next steps