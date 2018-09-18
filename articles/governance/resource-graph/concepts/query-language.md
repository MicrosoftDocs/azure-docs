---
title: Understanding the Azure Resource Graph query language
description: Describes how the query language for Azure Resource Graph works.
services: resource-graph
author: DCtheGeek
ms.author: dacoulte
ms.date: 09/18/2018
ms.topic: conceptual
ms.service: resource-graph
manager: carmonm
---
# Understanding the Azure Resource Graph query language

The query language for the Azure Resource Graph supports a number of operators and functions. Each
work and operate similar to the Kusto Query Language (KQL). However, it's important to understand
that while Resource Graph's query language is similar to
[KQL](https://docs.loganalytics.io/docs/Language-Reference/Tabular-operators), it isn't the
same.

> [!NOTE]
> Links to KQL documentation may require authentication.

The best way to learn about the query language used by Resource Graph is to start with the
documentation for KQL to get an understanding about how the language is structured and how the
various supported operators and functions work together.

## Supported tabular operators

Here is the list of supported tabular operators in Resource Graph:

- [distinct](https://docs.loganalytics.io/docs/Language-Reference/Tabular-operators/distinct-operator)
- [extend](https://docs.loganalytics.io/docs/Language-Reference/Tabular-operators/extend-operator)
- [limit](https://docs.loganalytics.io/docs/Language-Reference/Tabular-operators/limit-operator)
- [order by](https://docs.loganalytics.io/docs/Language-Reference/Tabular-operators/order-operator)
- [project](https://docs.loganalytics.io/docs/Language-Reference/Tabular-operators/project-operator)
- [project-away](https://docs.loganalytics.io/docs/Language-Reference/Tabular-operators/project-away-operator)
- [sample](https://docs.loganalytics.io/docs/Language-Reference/Tabular-operators/sample-operator)
- [sample-distinct](https://docs.loganalytics.io/docs/Language-Reference/Tabular-operators/sample-distinct-operator)
- [sort by](https://docs.loganalytics.io/docs/Language-Reference/Tabular-operators/sort-operator)
- [summarize](https://docs.loganalytics.io/docs/Language-Reference/Tabular-operators/summarize-operator)
- [take](https://docs.loganalytics.io/docs/Language-Reference/Tabular-operators/take-operator)
- [top](https://docs.loganalytics.io/docs/Language-Reference/Tabular-operators/top-operator)
- [top-nested](https://docs.loganalytics.io/docs/Language-Reference/Tabular-operators/top-nested-operator)
- [top-hitters](https://docs.loganalytics.io/docs/Language-Reference/Tabular-operators/top-hitters-operator)
- [where](https://docs.loganalytics.io/docs/Language-Reference/Tabular-operators/where-operator)

## Supported functions

Here is the list of supported functions in Resource Graph:

- [ago()](https://docs.loganalytics.io/docs/Language-Reference/Scalar-functions/ago%28%29)
- [buldschema()](https://docs.loganalytics.io/docs/Language-Reference/Aggregation-functions/buildschema%28%29)
- [count()](https://docs.loganalytics.io/docs/Language-Reference/Aggregation-functions/count%28%29)
- [strcat()](https://docs.loganalytics.io/docs/Language-Reference/Scalar-functions/strcat%28%29)
- [isnotempty()](https://docs.loganalytics.io/docs/Language-Reference/Scalar-functions/isnotempty%28%29_-notempty%28%29)
- [tostring()](https://docs.loganalytics.io/docs/Language-Reference/Scalar-functions/tostring%28%29)

## Next steps

- See the language in use in [Starter queries](../samples/starter.md)
- See advanced uses in [Advanced queries](../samples/advanced.md)
- Learn to [explore resources](explore-resources.md)