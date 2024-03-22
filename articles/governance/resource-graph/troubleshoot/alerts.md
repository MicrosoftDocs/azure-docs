---
title: Troubleshoot Azure Resource Graph alerts
description: Learn how to troubleshoot issues with Azure Resource Graph alerts integration with Log Analytics.
ms.date: 11/07/2023
ms.topic: troubleshooting
---

# Troubleshoot Azure Resource Graph alerts

> [!NOTE]
> Azure Resource Graph alerts integration with Log Analytics is in public preview.

The following descriptions help you troubleshoot queries for Azure Resource Graph alerts that integrate with Log Analytics.

## Operators and functions

Many [supported operators](../concepts/query-language.md#supported-kql-language-elements) in Azure Resource Graph Explorer work with the Log Analytics integration for alerts.

But because Azure Resource Graph alerts is in preview, there are operators and functions that work in Azure Resource Graph but are unsupported with the Log Analytics integration.

The following are known unsupported operators and functions:

| Operator/function | Type |
| ---- | ---- |
| `join` | operator <br/>The integration works when you join an Azure Resource Graph table with a Log Analytics table. The integration doesn't work if you join two or more Azure Resource Graph tables. |
| `mv-apply` | operator |
| `arg_min()` | scalar function |
| `avg()`, `avgif()` | aggregation function |
| `percentile()`, `percentiles()`, `percentilew()`, `percentilesw()` | aggregation function |
| `rand()` | scalar function |
| `stdev()`, `stdevif()`, `stdevp()` | aggregation function |
| `variance()`, `varianceif()`, `variancep()` | aggregation function |
| Using keys with bag functions | scalar function |

For more information about operators and functions, go to [tabular operators](/azure/data-explorer/kusto/query/queries), [scalar functions](/azure/data-explorer/kusto/query/scalarfunctions), and [aggregation functions](/azure/data-explorer/kusto/query/aggregation-functions).

## Pagination

Azure Resource Graph has pagination in its dedicated APIs. But with the way Log Analytics interacts with Azure Resource Graph, pagination isn't a supported reason why only 1,000 results are returned.

- Cross queries between Azure Resource Graph and Log Analytics don't support pagination and only show the first 1,000 results.
- You must set a limitation of 400 when writing a query with the [mv-expand](../concepts/query-language.md#supported-tabulartop-level-operators) operator.


## Managed identities

The managed identity for your alert must have the role [Log Analytics Contributor](../../../role-based-access-control/built-in-roles.md#log-analytics-contributor) or [Log Analytics Reader](../../../role-based-access-control/built-in-roles.md#log-analytics-reader). The role provides the permissions to get monitoring information.

When you set up an alert, the results can be different than the result after the alert is fired. The reason is that a fired alert is run using a managed identity, but when you manually test an alert it uses the user's identity.

## Table names

Azure Resource Graph table names need to be camel case with the first letter of each word capitalized, like `Resources` or `ResourceContainers`. You can also use lowercase like `resources` or `resourcecontainers`.
