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
work and operate based on [Azure Data Explorer](../../../data-explorer/data-explorer-overview.md).

The best way to learn about the query language used by Resource Graph is to start with the
documentation for the Azure Data Explorer [Query Language](/azure/kusto/query/index). This
provides an understanding about how the language is structured and how the various supported
operators and functions work together.

## Supported tabular operators

Here is the list of supported tabular operators in Resource Graph:

- [count](/azure/kusto/query/countoperator)
- [distinct](/azure/kusto/query/distinctoperator)
- [extend](/azure/kusto/query/extendoperator)
- [limit](/azure/kusto/query/limitoperator)
- [order by](/azure/kusto/query/orderoperator)
- [project](/azure/kusto/query/projectoperator)
- [project-away](/azure/kusto/query/projectawayoperator)
- [sample](/azure/kusto/query/sampleoperator)
- [sample-distinct](/azure/kusto/query/sampledistinctoperator)
- [sort by](/azure/kusto/query/sortoperator)
- [summarize](/azure/kusto/query/summarizeoperator)
- [take](/azure/kusto/query/takeoperator)
- [top](/azure/kusto/query/topoperator)
- [top-nested](/azure/kusto/query/topnestedoperator)
- [top-hitters](/azure/kusto/query/tophittersoperator)
- [where](/azure/kusto/query/whereoperator)

## Supported functions

Here is the list of supported functions in Resource Graph:

- [ago()](/azure/kusto/query/agofunction)
- [buildschema()](/azure/kusto/query/buildschema-aggfunction)
- [strcat()](/azure/kusto/query/strcatfunction)
- [isnotempty()](/azure/kusto/query/isnotemptyfunction)
- [tostring()](/azure/kusto/query/tostringfunction)

## Next steps

- See the language in use in [Starter queries](../samples/starter.md)
- See advanced uses in [Advanced queries](../samples/advanced.md)
- Learn to [explore resources](explore-resources.md)
