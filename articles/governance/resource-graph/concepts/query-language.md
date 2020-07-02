---
title: Understand the query language
description: Describes Resource Graph tables and the available Kusto data types, operators, and functions usable with Azure Resource Graph.
ms.date: 06/29/2020
ms.topic: conceptual
---
# Understanding the Azure Resource Graph query language

The query language for the Azure Resource Graph supports a number of operators and functions. Each
work and operate based on [Kusto Query Language (KQL)](/azure/kusto/query/index). To learn about the
query language used by Resource Graph, start with the
[tutorial for KQL](/azure/kusto/query/tutorial).

This article covers the language components supported by Resource Graph:

- [Resource Graph tables](#resource-graph-tables)
- [Resource Graph custom language elements](#resource-graph-custom-language-elements)
- [Supported KQL language elements](#supported-kql-language-elements)
- [Escape characters](#escape-characters)

## Resource Graph tables

Resource Graph provides several tables for the data it stores about Resource Manager resource types
and their properties. These tables can be used with `join` or `union` operators to get properties
from related resource types. Here is the list of tables available in Resource Graph:

|Resource Graph tables |Description |
|---|---|
|Resources |The default table if none defined in the query. Most Resource Manager resource types and properties are here. |
|ResourceContainers |Includes subscription (in preview -- `Microsoft.Resources/subscriptions`) and resource group (`Microsoft.Resources/subscriptions/resourcegroups`) resource types and data. |
|AdvisorResources |Includes resources _related_ to `Microsoft.Advisor`. |
|AlertsManagementResources |Includes resources _related_ to `Microsoft.AlertsManagement`. |
|HealthResources |Includes resources _related_ to `Microsoft.ResourceHealth`. |
|MaintenanceResources |Includes resources _related_ to `Microsoft.Maintenance`. |
|SecurityResources |Includes resources _related_ to `Microsoft.Security`. |

For a complete list including resource types, see
[Reference: Supported tables and resource types](../reference/supported-tables-resources.md).

> [!NOTE]
> _Resources_ is the default table. While querying the _Resources_ table, it isn't required to
> provide the table name unless `join` or `union` are used. However, the recommended practice is to
> always include the initial table in the query.

Use Resource Graph Explorer in the portal to discover what resource types are available in each
table. As an alternative, use a query such as `<tableName> | distinct type` to get a list of
resource types the given Resource Graph table supports that exist in your environment.

The following query shows a simple `join`. The query result blends the columns together and any
duplicate column names from the joined table, _ResourceContainers_ in this example, are appended
with **1**. As _ResourceContainers_ table has types for both subscriptions and resource groups,
either type might be used to join to the resource from _resources_ table.

```kusto
Resources
| join ResourceContainers on subscriptionId
| limit 1
```

The following query shows a more complex use of `join`. The query limits the joined table to
subscriptions resources and with `project` to include only the original field _subscriptionId_ and
the _name_ field renamed to _SubName_. The field rename avoids `join` adding it as _name1_ since the
field already exists in _Resources_. The original table is filtered with `where` and the following
`project` includes columns from both tables. The query result is a single key vault displaying type,
the name of the key vault, and the name of the subscription it's in.

```kusto
Resources
| where type == 'microsoft.keyvault/vaults'
| join (ResourceContainers | where type=='microsoft.resources/subscriptions' | project SubName=name, subscriptionId) on subscriptionId
| project type, name, SubName
| limit 1
```

> [!NOTE]
> When limiting the `join` results with `project`, the property used by `join` to relate the two
> tables, _subscriptionId_ in the above example, must be included in `project`.

## Resource Graph custom language elements

### <a name="shared-query-syntax"></a>Shared query syntax (preview)

As a preview feature, a [shared query](../tutorials/create-share-query.md) can be accessed directly
in a Resource Graph query. This scenario makes it possible to create standard queries as shared
queries and reuse them. To call a shared query inside a Resource Graph query, use the
`{{shared-query-uri}}` syntax. The URI of the shared query is the _Resource ID_ of the shared query
on the **Settings** page for that query. In this example, our shared query URI is
`/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SharedQueries/providers/Microsoft.ResourceGraph/queries/Count VMs by OS`.
This URI points to the subscription, resource group, and full name of the shared query we want to
reference in another query. This query is the same as the one created in
[Tutorial: Create and share a query](../tutorials/create-share-query.md).

> [!NOTE]
> You can't save a query that references a shared query as a shared query.

Example 1: Use only the shared query

The results of this Resource Graph query are the same as the query stored in the shared query.

```kusto
{{/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SharedQueries/providers/Microsoft.ResourceGraph/queries/Count VMs by OS}}
```

Example 2: Include the shared query as part of a larger query

This query first uses the shared query, and then uses `limit` to further restrict the results.

```kusto
{{/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SharedQueries/providers/Microsoft.ResourceGraph/queries/Count VMs by OS}}
| where properties_storageProfile_osDisk_osType =~ 'Windows'
```

## Supported KQL language elements

Resource Graph supports all KQL [data types](/azure/kusto/query/scalar-data-types/),
[scalar functions](/azure/kusto/query/scalarfunctions),
[scalar operators](/azure/kusto/query/binoperators), and
[aggregation functions](/azure/kusto/query/any-aggfunction). Specific
[tabular operators](/azure/kusto/query/queries) are supported by Resource Graph, some of which have
different behaviors.

### Supported tabular/top level operators

Here is the list of KQL tabular operators supported by Resource Graph with specific samples:

|KQL |Resource Graph sample query |Notes |
|---|---|---|
|[count](/azure/kusto/query/countoperator) |[Count key vaults](../samples/starter.md#count-keyvaults) | |
|[distinct](/azure/kusto/query/distinctoperator) |[Show distinct values for a specific alias](../samples/starter.md#distinct-alias-values) | |
|[extend](/azure/kusto/query/extendoperator) |[Count virtual machines by OS type](../samples/starter.md#count-os) | |
|[join](/azure/kusto/query/joinoperator) |[Key vault with subscription name](../samples/advanced.md#join) |Join flavors supported: [innerunique](/azure/kusto/query/joinoperator#default-join-flavor), [inner](/azure/kusto/query/joinoperator#inner-join), [leftouter](/azure/kusto/query/joinoperator#left-outer-join). Limit of 3 `join` in a single query. Custom join strategies, such as broadcast join, aren't allowed. May be used within a single table or between the _Resources_ and _ResourceContainers_ tables. |
|[limit](/azure/kusto/query/limitoperator) |[List all public IP addresses](../samples/starter.md#list-publicip) |Synonym of `take` |
|[mvexpand](/azure/kusto/query/mvexpandoperator) | | Legacy operator, use `mv-expand` instead. _RowLimit_ max of 400. The default is 128. |
|[mv-expand](/azure/kusto/query/mvexpandoperator) |[List Cosmos DB with specific write locations](../samples/advanced.md#mvexpand-cosmosdb) |_RowLimit_ max of 400. The default is 128. |
|[order](/azure/kusto/query/orderoperator) |[List resources sorted by name](../samples/starter.md#list-resources) |Synonym of `sort` |
|[project](/azure/kusto/query/projectoperator) |[List resources sorted by name](../samples/starter.md#list-resources) | |
|[project-away](/azure/kusto/query/projectawayoperator) |[Remove columns from results](../samples/advanced.md#remove-column) | |
|[sort](/azure/kusto/query/sortoperator) |[List resources sorted by name](../samples/starter.md#list-resources) |Synonym of `order` |
|[summarize](/azure/kusto/query/summarizeoperator) |[Count Azure resources](../samples/starter.md#count-resources) |Simplified first page only |
|[take](/azure/kusto/query/takeoperator) |[List all public IP addresses](../samples/starter.md#list-publicip) |Synonym of `limit` |
|[top](/azure/kusto/query/topoperator) |[Show first five virtual machines by name and their OS type](../samples/starter.md#show-sorted) | |
|[union](/azure/kusto/query/unionoperator) |[Combine results from two queries into a single result](../samples/advanced.md#unionresults) |Single table allowed: _T_ `| union` \[`kind=` `inner`\|`outer`\] \[`withsource=`_ColumnName_\] _Table_. Limit of 3 `union` legs in a single query. Fuzzy resolution of `union` leg tables isn't allowed. May be used within a single table or between the _Resources_ and _ResourceContainers_ tables. |
|[where](/azure/kusto/query/whereoperator) |[Show resources that contain storage](../samples/starter.md#show-storage) | |

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

- See the language in use in [Starter queries](../samples/starter.md).
- See advanced uses in [Advanced queries](../samples/advanced.md).
- Learn more about how to [explore resources](explore-resources.md).