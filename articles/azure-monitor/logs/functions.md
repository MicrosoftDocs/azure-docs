---
title: Functions in Azure Monitor log queries | Microsoft Docs
description: This article describes how to use functions to call a query from another log query in Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/31/2020

---

# Using functions in Azure Monitor log queries

To use a log query with another query you can save it as a function. This allows you to simplify complex queries by breaking them into parts and allows you to reuse common code with multiple queries.

## Create a function

Create a function with Log Analytics in the Azure portal by clicking **Save** and then providing the information in the following table.

| Setting | Description |
|:---|:---|
| Name           | Display name for the query in **Query explorer**. |
| Save as        | Function |
| Function Alias | Short name to use the function in other queries. May not contain spaces and must be unique. |
| Category       | A category to organize saved queries and functions in **Query explorer**. |

You can also create functions using the [REST API](/rest/api/loganalytics/savedsearches/createorupdate) or [PowerShell](/powershell/module/az.operationalinsights/new-azoperationalinsightssavedsearch).


## Use a function
Use a function by including its alias in another query. It can be used like any other table.

## Function parameters 
You can add parameters to a function so that you can provide values for certain variables when calling it. The only way to currently create a function with parameters is using a Resource Manager template. See [Resource Manager template samples for log queries in Azure Monitor](./resource-manager-log-queries.md#parameterized-function) for an example.

## Example
The following sample query returns all missing security updates reported in the last day. Save this query as a function with the alias _security_updates_last_day_. 

```Kusto
Update
| where TimeGenerated > ago(1d) 
| where Classification == "Security Updates" 
| where UpdateState == "Needed"
```

Create another query and reference the _security_updates_last_day_ function to search for SQL-related needed security updates.

```Kusto
security_updates_last_day | where Title contains "SQL"
```

## Next steps
See other lessons for writing Azure Monitor log queries:

- [String operations](/azure/data-explorer/kusto/query/samples?&pivots=azuremonitor#string-operations)
- [Date and time operations](/azure/data-explorer/kusto/query/samples?&pivots=azuremonitor#date-and-time-operations)
- [Aggregation functions](/azure/data-explorer/kusto/query/samples?&pivots=azuremonitor#aggregations)
- [Advanced aggregations](/azure/data-explorer/write-queries#advanced-aggregations)
- [JSON and data structures](/azure/data-explorer/kusto/query/samples?&pivots=azuremonitor#json-and-data-structures)
- [Joins](/azure/data-explorer/kusto/query/samples?&pivots=azuremonitor#joins)
- [Charts](/azure/data-explorer/kusto/query/samples?&pivots=azuremonitor#charts)
