---
title: Azure Monitor log query language differences
description: Reference information for Kusto query language used by Azure Monitor. Includes additional elements specific to Azure Monitor and elements not supported in Azure Monitor log queries.
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 10/09/2020

---

# Azure Monitor log query language
Azure Monitor Logs is based on Azure Data Explorer, and log queries are written using the same Kusto query language (KQL). This is a rich language designed to be easy to read and author, and you should be able to start using it with some basic guidance.

## Getting started
The best way to get started learning to write log queries using KQL is leveraging available tutorials and samples.

- [Log Analytics tutorial](log-analytics-tutorial.md) - Tutorial on using the features of Log Analytics which is the tool that you'll use in the Azure portal to edit and run queries. It also allows you to write simple queries without directly working with the query language. If you haven't used Log Analytics before, start here so you understand the tool that you'll use with the other tutorials and samples.
- [KQL tutorial](/azure/data-explorer/kusto/query/tutorial?pivots=azuremonitor) - Guided walk through basic KQL concepts and common operators. This is the best place to start to come up to speed with the language. 
- [Example queries](example-queries.md) - Description of the example queries available in Log Analytics. You can use the queries without modification or use them as samples to learn KQL.
- [Query samples](/azure/data-explorer/kusto/query/samples?pivots=azuremonitor) - Variety of different sample queries illustrating a variety of concepts.


## Reference documentation
[Documentation for KQL](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/) including the reference for all commands and operators is available in the Azure Data Explorer documentation. Even as you get proficient using KQL, you'll still regularly use the reference to investigate new commands and scenarios that you haven't used before.

Most of the documentation for KQL will apply to both Azure Monitor and Azure Data Explorer. The documentation will specify those operators that aren't supported by Azure Monitor or that have different functionality. Operators specific to Azure Monitor are documented in the Azure Monitor content. The following section summarizes the differences between versions of the language.


## KQL elements not supported in Azure Monitor
The following sections describe elements of the Kusto query language that aren't supported by Azure Monitor.

### Statements not supported in Azure Monitor

* [Alias](/azure/kusto/query/aliasstatement)
* [Query parameters](/azure/kusto/query/queryparametersstatement)

### Functions not supported in Azure Monitor

* [cluster()](/azure/kusto/query/clusterfunction)
* [cursor_after()](/azure/kusto/query/cursorafterfunction)
* [cursor_before_or_at()](/azure/kusto/query/cursorbeforeoratfunction)
* [cursor_current(), current_cursor()](/azure/kusto/query/cursorcurrent)
* [database()](/azure/kusto/query/databasefunction)
* [current_principal()](/azure/kusto/query/current-principalfunction)
* [extent_id()](/azure/kusto/query/extentidfunction)
* [extent_tags()](/azure/kusto/query/extenttagsfunction)

### Operators not supported in Azure Monitor

* [Cross-Cluster Join](/azure/kusto/query/joincrosscluster)

### Plugins not supported in Azure Monitor

* [Python plugin](/azure/kusto/query/pythonplugin)
* [sql_request plugin](/azure/kusto/query/sqlrequestplugin)


## Additional operators in Azure Monitor
The following operators support specific Azure Monitor features and are not available outside of Azure Monitor.

* [app()](app-expression.md)
* [resource()](resource-expression.md)
* [workspace()](workspace-expression.md)

## Next steps

- Get references to different [resources for writing Azure Monitor log queries](query-language.md).
- Access the complete [reference documentation for Kusto query language](/azure/kusto/query/).
