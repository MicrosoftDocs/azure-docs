---
title: Understand the query language
description: Describes the available Kusto operators and functions usable with Azure Resource Graph.
author: DCtheGeek
ms.author: dacoulte
ms.date: 04/22/2019
ms.topic: conceptual
ms.service: resource-graph
manager: carmonm
ms.custom: seodec18
---
# Understanding the Azure Resource Graph query language

The query language for the Azure Resource Graph supports a number of operators and functions. Each
work and operate based on [Azure Data Explorer](../../../data-explorer/data-explorer-overview.md).

The best way to learn about the query language used by Resource Graph is to start with the
documentation for the Azure Data Explorer [Query Language](/azure/kusto/query/index). It provides
an understanding about how the language is structured and how the various supported operators and
functions work together.

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
- [zip()](/azure/kusto/query/zipfunction)

## Escape characters

Some property names, such as those that include a `.` or `$`, must be wrapped or escaped in the
query or the property name is interpreted incorrectly and doesn't provide the expected results.

- `.` - Wrap the property name as such: `['propertyname.withaperiod']`
  
  Example query that wraps the property _odata.type_:

  ```kusto
  where type=~'Microsoft.Insights/alertRules' | project name, properties.condition.['odata.type']
  ```

- `$` - Escape the character in the property name. The escape character used depends on the shell
  Resource Graph is run from.

  - **bash** - `\`

    Example query that escapes the property _\$type_ in bash:

    ```kusto
    where type=~'Microsoft.Insights/alertRules' | project name, properties.condition.\$type
    ```

  - **cmd** - Don't escape the `$` character.

  - **PowerShell** - ``` ` ```

    Example query that escapes the property _\$type_ in PowerShell:

    ```kusto
    where type=~'Microsoft.Insights/alertRules' | project name, properties.condition.`$type
    ```

## Next steps

- See the language in use in [Starter queries](../samples/starter.md)
- See advanced uses in [Advanced queries](../samples/advanced.md)
- Learn to [explore resources](explore-resources.md)