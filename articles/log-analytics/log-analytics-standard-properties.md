---
title: Standard properties in Azure Monitor Log Analytics records | Microsoft Docs
description: Describes properties that are common to multiple data types in Azure Monitor Log Analytics.
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: ''

ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/11/2018
ms.author: bwren
ms.component: na
---

# Standard properties in Log Analytics records
Data in [Log Analytics](../log-analytics/log-analytics-queries.md) is stored as a set of records, each with a particular data type that has a unique set of properties. Many data types will have standard properties that are common across multiple types. This article describes these properties and provides examples of how you can use them in queries.

Some of these properties are still in the process of being implemented, so you may see them in some data types but not yet in others.


## _ResourceId
The **_ResourceId** property holds a unique identifier for the resource that that the record is associated with. This gives you a standard property to use to scope your query to only records from a particular resource, or to join related data across multiple tables.

For Azure resources, the value of **_ResourceId** is the [Azure resource ID URL](../azure-resource-manager/resource-group-template-functions-resource.md). The property is currently limited to Azure resources, but it will be extended to resources outside of Azure such as on-premises computers. 

### Examples
The following example shows a query that joins performance and event data for each computer. It shows all events with an ID of _101_ and processor utilization over 50%.

```Kusto
Perf 
| where CounterName == "% User Time" and CounterValue  > 50 and _ResourceId != "" 
| join type=inner (     
    Event 
    | where EventID == 101 
) on _ResourceId
```

The following example shows a query that joins _AzureActivity_ records with _SecurityEvent_ records. It shows all activity operations with users that were logged in to these machines.

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

## Next steps

- Read more about how [Log Analytics data is stored](../log-analytics/log-analytics-queries.md).
- Get a lesson on [writing queries in Log Analytics](../log-analytics/query-language/get-started-queries.md).
- Get a lesson on [joining tables in Log Analytics queries](../log-analytics/query-language/joins.md).