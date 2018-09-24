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
documentation for the Azure Data Explorer [Query Language](../../../kusta/query/index.md). This
provides an understanding about how the language is structured and how the various supported
operators and functions work together.

## Supported tabular operators

Here is the list of supported tabular operators in Resource Graph:

- [count](../../../kusto/query/countoperator.md)
- [distinct](../../../kusto/query/distinctoperator.md)
- [extend](../../../kusto/query/extendoperator.md)
- [limit](../../../kusto/query/limitoperator.md)
- [order by](../../../kusto/query/orderoperator.md)
- [project](../../../kusto/query/projectoperator.md)
- [project-away](../../../kusto/query/projectawayoperator.md)
- [sample](../../../kusto/query/sampleoperator.md)
- [sample-distinct](../../../kusto/query/sampledistinctoperator.md)
- [sort by](../../../kusto/query/sortoperator.md)
- [summarize](../../../kusto/query/summerizeoperator.md)
- [take](../../../kusto/query/takeoperator.md)
- [top](../../../kusto/query/topoperator.md)
- [top-nested](../../../kusto/query/topnestedoperator.md)
- [top-hitters](../../../kusto/query/tophittersoperator.md)
- [where](../../../kusto/query/whereoperator.md)

## Supported functions

Here is the list of supported functions in Resource Graph:

- [ago()](../../../kusto/query/agofunction.md)
- [buildschema()](../../../kusto/query/buildschema-aggfunction.md)
- [strcat()](../../../kusto/query/strcatfunction.md)
- [isnotempty()](../../../kusto/query/isnotemptyfunction.md)
- [tostring()](../../../kusto/query/tostringfunction.md)

## Next steps

- See the language in use in [Starter queries](../samples/starter.md)
- See advanced uses in [Advanced queries](../samples/advanced.md)
- Learn to [explore resources](explore-resources.md)