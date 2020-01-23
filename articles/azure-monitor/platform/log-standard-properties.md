---
title: Standard properties in Azure Monitor log records | Microsoft Docs
description: Describes properties that are common to multiple data types in Azure Monitor logs.
ms.service:  azure-monitor
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/18/2019

---

# Standard properties in Azure Monitor Logs
Data in Azure Monitor Logs is [stored as a set of records in either a Log Analytics workspace or Application Insights application](../log-query/logs-structure.md), each with a particular data type that has a unique set of properties. Many data types will have standard properties that are common across multiple types. This article describes these properties and provides examples of how you can use them in queries.

> [!NOTE]
> Some of the standard properties will not show in the schema view or intellisense in Log Analytics, and they won't show in query results unless you explicitly specify the property in the output.

## TimeGenerated and timestamp
The **TimeGenerated** (Log Analytics workspace) and **timestamp** (Application Insights application) properties contain the date and time that the record was created by the data source. See [Log data ingestion time in Azure Monitor](data-ingestion-time.md) for more details.

**TimeGenerated** and **timestamp** provide a common property to use for filtering or summarizing by time. When you select a time range for a view or dashboard in the Azure portal, it uses TimeGenerated or timestamp to filter the results. 

### Examples

The following query returns the number of error events created for each day in the previous week.

```Kusto
Event
| where EventLevelName == "Error" 
| where TimeGenerated between(startofweek(ago(7days))..endofweek(ago(7days))) 
| summarize count() by bin(TimeGenerated, 1day) 
| sort by TimeGenerated asc 
```

The following query returns the number of exceptions created for each day in the previous week.

```Kusto
exceptions
| where timestamp between(startofweek(ago(7days))..endofweek(ago(7days))) 
| summarize count() by bin(TimeGenerated, 1day) 
| sort by timestamp asc 
```

## \_TimeReceived
The **\_TimeReceived** property contains the date and time that the record was received by the Azure Monitor ingestion point in the Azure cloud. This can be useful for identifying latency issues between the data source and the cloud. An example would be a networking issue causing a delay with data being sent from an agent. See [Log data ingestion time in Azure Monitor](data-ingestion-time.md) for more details.

The following query gives the average latency by hour for event records from an agent. This includes the time from the agent to the cloud and and the total time for the record to be available for log queries.

```Kusto
Event
| where TimeGenerated > ago(1d) 
| project TimeGenerated, TimeReceived = _TimeReceived, IngestionTime = ingestion_time() 
| extend AgentLatency = toreal(datetime_diff('Millisecond',TimeReceived,TimeGenerated)) / 1000
| extend TotalLatency = toreal(datetime_diff('Millisecond',IngestionTime,TimeGenerated)) / 1000
| summarize avg(AgentLatency), avg(TotalLatency) by bin(TimeGenerated,1hr)
``` 

## Type and itemType
The **Type** (Log Analytics workspace) and **itemType** (Application Insights application) properties hold the name of the table that the record was retrieved from which can also be thought of as the record type. This property is useful in queries that combine records from multiple table, such as those that use the `search` operator, to distinguish between records of different types. **$table** can be used in place of **Type** in some places.

### Examples
The following query returns the count of records by type collected over the past hour.

```Kusto
search * 
| where TimeGenerated > ago(1h)
| summarize count() by Type

```
## \_ItemId
The **\_ItemId** property holds a unique identifier for the record.


## \_ResourceId
The **\_ResourceId** property holds a unique identifier for the resource that the record is associated with. This gives you a standard property to use to scope your query to only records from a particular resource, or to join related data across multiple tables.

For Azure resources, the value of **_ResourceId** is the [Azure resource ID URL](../../azure-resource-manager/templates/template-functions-resource.md). The property is currently limited to Azure resources, but it will be extended to resources outside of Azure such as on-premises computers.

> [!NOTE]
> Some data types already have fields that contain Azure resource ID or at least parts of it like subscription ID. While these fields are kept for backward compatibility, it is recommended to use the _ResourceId to perform cross correlation since it will be more consistent.

### Examples
The following query joins performance and event data for each computer. It shows all events with an ID of _101_ and processor utilization over 50%.

```Kusto
Perf 
| where CounterName == "% User Time" and CounterValue  > 50 and _ResourceId != "" 
| join kind=inner (     
    Event 
    | where EventID == 101 
) on _ResourceId
```

The following query joins _AzureActivity_ records with _SecurityEvent_ records. It shows all activity operations with users that were logged in to these machines.

```Kusto
AzureActivity 
| where  
    OperationName in ("Restart Virtual Machine", "Create or Update Virtual Machine", "Delete Virtual Machine")  
    and ActivityStatus == "Succeeded"  
| join kind= leftouter (    
   SecurityEvent 
   | where EventID == 4624  
   | summarize LoggedOnAccounts = makeset(Account) by _ResourceId 
) on _ResourceId  
```

The following query parses **_ResourceId** and aggregates billed data volumes per Azure subscription.

```Kusto
union withsource = tt * 
| where _IsBillable == true 
| parse tolower(_ResourceId) with "/subscriptions/" subscriptionId "/resourcegroups/" 
    resourceGroup "/providers/" provider "/" resourceType "/" resourceName   
| summarize Bytes=sum(_BilledSize) by subscriptionId | sort by Bytes nulls last 
```

Use these `union withsource = tt *` queries sparingly as scans across data types are expensive to execute.

## \_IsBillable
The **\_IsBillable** property specifies whether ingested data is billable. Data with **\_IsBillable** equal to _false_ are collected for free and not billed to your Azure account.

### Examples
To get a list of computers sending billed data types, use the following query:

> [!NOTE]
> Use queries with `union withsource = tt *` sparingly as scans across data types are expensive to execute. 

```Kusto
union withsource = tt * 
| where _IsBillable == true 
| extend computerName = tolower(tostring(split(Computer, '.')[0]))
| where computerName != ""
| summarize TotalVolumeBytes=sum(_BilledSize) by computerName
```

This can be extended to return the count of computers per hour that are sending billed data types:

```Kusto
union withsource = tt * 
| where _IsBillable == true 
| extend computerName = tolower(tostring(split(Computer, '.')[0]))
| where computerName != ""
| summarize dcount(computerName) by bin(TimeGenerated, 1h) | sort by TimeGenerated asc
```

## \_BilledSize
The **\_BilledSize** property specifies the size in bytes of data that will be billed to your Azure account if **\_IsBillable** is true.


### Examples
To see the size of billable events ingested per computer, use the `_BilledSize` property which provides the size in bytes:

```Kusto
union withsource = tt * 
| where _IsBillable == true 
| summarize Bytes=sum(_BilledSize) by  Computer | sort by Bytes nulls last 
```

To see the size of billable events ingested per subscription, use the following query:

```Kusto
union withsource=table * 
| where _IsBillable == true 
| parse _ResourceId with "/subscriptions/" SubscriptionId "/" *
| summarize Bytes=sum(_BilledSize) by  SubscriptionId | sort by Bytes nulls last 
```

To see the size of billable events ingested per resource group, use the following query:

```Kusto
union withsource=table * 
| where _IsBillable == true 
| parse _ResourceId with "/subscriptions/" SubscriptionId "/resourcegroups/" ResourceGroupName "/" *
| summarize Bytes=sum(_BilledSize) by  SubscriptionId, ResourceGroupName | sort by Bytes nulls last 

```


To see the count of events ingested per computer, use the following query:

```Kusto
union withsource = tt *
| summarize count() by Computer | sort by count_ nulls last
```

To see the count of billable events ingested per computer, use the following query: 

```Kusto
union withsource = tt * 
| where _IsBillable == true 
| summarize count() by Computer  | sort by count_ nulls last
```

To see the count of billable data types from a specific computer, use the following query:

```Kusto
union withsource = tt *
| where Computer == "computer name"
| where _IsBillable == true 
| summarize count() by tt | sort by count_ nulls last 
```

## Next steps

- Read more about how [Azure Monitor log data is stored](../log-query/log-query-overview.md).
- Get a lesson on [writing log queries](../../azure-monitor/log-query/get-started-queries.md).
- Get a lesson on [joining tables in log queries](../../azure-monitor/log-query/joins.md).
