---
title: Understand the query language
description: Describes Resource Graph tables and the available Kusto data types, operators, and functions usable with Azure Resource Graph.
ms.date: 08/03/2021
ms.topic: conceptual
---
# Understanding the Azure Resource Graph query language

The query language for the Azure Resource Graph supports a number of operators and functions. Each
work and operate based on [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/index). To learn about the
query language used by Resource Graph, start with the
[tutorial for KQL](/azure/data-explorer/kusto/query/tutorial).

This article covers the language components supported by Resource Graph:

- [Resource Graph tables](#resource-graph-tables)
- [Resource Graph custom language elements](#resource-graph-custom-language-elements)
- [Supported KQL language elements](#supported-kql-language-elements)
- [Scope of the query](#query-scope)
- [Escape characters](#escape-characters)

## Resource Graph tables

Resource Graph provides several tables for the data it stores about Azure Resource Manager resource
types and their properties. Some tables can be used with `join` or `union` operators to get
properties from related resource types. Here is the list of tables available in Resource Graph:

|Resource Graph table |Can `join` other tables? |Description |
|---|---|---|
|Resources |Yes |The default table if none defined in the query. Most Resource Manager resource types and properties are here. |
|ResourceContainers |Yes |Includes subscription (`Microsoft.Resources/subscriptions`) and resource group (`Microsoft.Resources/subscriptions/resourcegroups`) resource types and data. |
|AdvisorResources |Yes (preview) |Includes resources _related_ to `Microsoft.Advisor`. |
|AlertsManagementResources |Yes (preview) |Includes resources _related_ to `Microsoft.AlertsManagement`. |
|ExtendedLocationResources |No |Includes resources _related_ to `Microsoft.ExtendedLocation`. |
|GuestConfigurationResources |No |Includes resources _related_ to `Microsoft.GuestConfiguration`. |
|HealthResources|Yes |Includes resources _related_ to `Microsoft.ResourceHealth/availabilitystatuses`. |
|KubernetesConfigurationResources |No |Includes resources _related_ to `Microsoft.KubernetesConfiguration`. |
|MaintenanceResources |Partial, join _to_ only. (preview) |Includes resources _related_ to `Microsoft.Maintenance`. |
|PatchAssessmentResources|No |Includes resources _related_ to Azure Virtual Machines patch assessment. |
|PatchInstallationResources|No |Includes resources _related_ to Azure Virtual Machines patch installation. |
|PolicyResources |Yes |Includes resources _related_ to `Microsoft.PolicyInsights`. |
|RecoveryServicesResources |Partial, join _to_ only. (preview) |Includes resources _related_ to `Microsoft.DataProtection` and `Microsoft.RecoveryServices`. |
|SecurityResources |Yes (preview) |Includes resources _related_ to `Microsoft.Security`. |
|ServiceHealthResources |No (preview) |Includes resources _related_ to `Microsoft.ResourceHealth/events`. |
|WorkloadMonitorResources |No |Includes resources _related_ to `Microsoft.WorkloadMonitor`. |

For a complete list, including resource types, see [Reference: Supported tables and resource types](../reference/supported-tables-resources.md).

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
either type might be used to join to the resource from _Resources_ table.

```kusto
Resources
| join ResourceContainers on subscriptionId
| limit 1
```

The following query shows a more complex use of `join`. First, the query uses `project` to get the
fields from _Resources_ for the Azure Key Vault vaults resource type. The next step uses `join` to
merge the results with _ResourceContainers_ where the type is a subscription _on_ a property that is
both in the first table's `project` and the joined table's `project`. The field rename avoids `join`
adding it as _name1_ since the property already is projected from _Resources_. The query result is a
single key vault displaying type, the name, location, and resource group of the key vault, along
with the name of the subscription it's in.

```kusto
Resources
| where type == 'microsoft.keyvault/vaults'
| project name, type, location, subscriptionId, resourceGroup
| join (ResourceContainers | where type=='microsoft.resources/subscriptions' | project SubName=name, subscriptionId) on subscriptionId
| project type, name, location, resourceGroup, SubName
| limit 1
```

> [!NOTE]
> When limiting the `join` results with `project`, the property used by `join` to relate the two
> tables, _subscriptionId_ in the above example, must be included in `project`.

## <a name="extended-properties"></a>Extended properties (preview)

As a _preview_ feature, some of the resource types in Resource Graph have additional type-related
properties available to query beyond the properties provided by Azure Resource Manager. This set of
values, known as _extended properties_, exists on a supported resource type in
`properties.extended`. To see which resource types have _extended properties_, use the following
query:

```kusto
Resources
| where isnotnull(properties.extended)
| distinct type
| order by type asc
```

Example: Get count of virtual machines by `instanceView.powerState.code`:

```kusto
Resources
| where type == 'microsoft.compute/virtualmachines'
| summarize count() by tostring(properties.extended.instanceView.powerState.code)
```

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

Resource Graph supports a subset of KQL [data types](/azure/data-explorer/kusto/query/scalar-data-types/),
[scalar functions](/azure/data-explorer/kusto/query/scalarfunctions),
[scalar operators](/azure/data-explorer/kusto/query/binoperators), and
[aggregation functions](/azure/data-explorer/kusto/query/any-aggfunction). Specific
[tabular operators](/azure/data-explorer/kusto/query/queries) are supported by Resource Graph, some of which have
different behaviors.

### Supported tabular/top level operators

Here is the list of KQL tabular operators supported by Resource Graph with specific samples:

|KQL |Resource Graph sample query |Notes |
|---|---|---|
|[count](/azure/data-explorer/kusto/query/countoperator) |[Count key vaults](../samples/starter.md#count-keyvaults) | |
|[distinct](/azure/data-explorer/kusto/query/distinctoperator) |[Show resources that contain storage](../samples/starter.md#show-storage) | |
|[extend](/azure/data-explorer/kusto/query/extendoperator) |[Count virtual machines by OS type](../samples/starter.md#count-os) | |
|[join](/azure/data-explorer/kusto/query/joinoperator) |[Key vault with subscription name](../samples/advanced.md#join) |Join flavors supported: [innerunique](/azure/data-explorer/kusto/query/joinoperator#default-join-flavor), [inner](/azure/data-explorer/kusto/query/joinoperator#inner-join), [leftouter](/azure/data-explorer/kusto/query/joinoperator#left-outer-join). Limit of 3 `join` in a single query, 1 of which may be a cross-table `join`. If all cross-table `join` use is between _Resource_ and _ResourceContainers_, then 3 cross-table `join` are allowed. Custom join strategies, such as broadcast join, aren't allowed. For which tables can use `join`, see [Resource Graph tables](#resource-graph-tables). |
|[limit](/azure/data-explorer/kusto/query/limitoperator) |[List all public IP addresses](../samples/starter.md#list-publicip) |Synonym of `take`. Doesn't work with [Skip](./work-with-data.md#skipping-records). |
|[mvexpand](/azure/data-explorer/kusto/query/mvexpandoperator) | | Legacy operator, use `mv-expand` instead. _RowLimit_ max of 400. The default is 128. |
|[mv-expand](/azure/data-explorer/kusto/query/mvexpandoperator) |[List Cosmos DB with specific write locations](../samples/advanced.md#mvexpand-cosmosdb) |_RowLimit_ max of 400. The default is 128. Limit of 2 `mv-expand` in a single query.|
|[order](/azure/data-explorer/kusto/query/orderoperator) |[List resources sorted by name](../samples/starter.md#list-resources) |Synonym of `sort` |
|[parse](/azure/data-explorer/kusto/query/parseoperator) |[Get virtual networks and subnets of network interfaces](../samples/advanced.md#parse-subnets) |It's optimal to access properties directly if they exist instead of using `parse`. |
|[project](/azure/data-explorer/kusto/query/projectoperator) |[List resources sorted by name](../samples/starter.md#list-resources) | |
|[project-away](/azure/data-explorer/kusto/query/projectawayoperator) |[Remove columns from results](../samples/advanced.md#remove-column) | |
|[sort](/azure/data-explorer/kusto/query/sortoperator) |[List resources sorted by name](../samples/starter.md#list-resources) |Synonym of `order` |
|[summarize](/azure/data-explorer/kusto/query/summarizeoperator) |[Count Azure resources](../samples/starter.md#count-resources) |Simplified first page only |
|[take](/azure/data-explorer/kusto/query/takeoperator) |[List all public IP addresses](../samples/starter.md#list-publicip) |Synonym of `limit`. Doesn't work with [Skip](./work-with-data.md#skipping-records). |
|[top](/azure/data-explorer/kusto/query/topoperator) |[Show first five virtual machines by name and their OS type](../samples/starter.md#show-sorted) | |
|[union](/azure/data-explorer/kusto/query/unionoperator) |[Combine results from two queries into a single result](../samples/advanced.md#unionresults) |Single table allowed: _T_ `| union` \[`kind=` `inner`\|`outer`\] \[`withsource=`_ColumnName_\] _Table_. Limit of 3 `union` legs in a single query. Fuzzy resolution of `union` leg tables isn't allowed. May be used within a single table or between the _Resources_ and _ResourceContainers_ tables. |
|[where](/azure/data-explorer/kusto/query/whereoperator) |[Show resources that contain storage](../samples/starter.md#show-storage) | |

There is a default limit of 3 `join` and 3 `mv-expand` operators in a single Resource Graph SDK query. You can request an increase in these limits for your tenant through **Help + support**.

To support the "Open Query" portal experience, Azure Resource Graph Explorer has a higher global limit than Resource Graph SDK.

## Query scope

The scope of the subscriptions from which resources are returned by a query depend on the method of
accessing Resource Graph. Azure CLI and Azure PowerShell populate the list of subscriptions to
include in the request based on the context of the authorized user. The list of subscriptions can be
manually defined for each with the **subscriptions** and **Subscription** parameters, respectively.
In REST API and all other SDKs, the list of subscriptions to include resources from must be
explicitly defined as part of the request.

As a **preview**, REST API version `2020-04-01-preview` adds a property to scope the query to a
[management group](../../management-groups/overview.md). This preview API also makes the
subscription property optional. If a management group or a subscription list isn't defined, the
query scope is all resources, which includes
[Azure Lighthouse](../../../lighthouse/overview.md) delegated
resources, that the authenticated user can access. The new `managementGroupId` property takes the
management group ID, which is different from the name of the management group. When
`managementGroupId` is specified, resources from the first 5,000 subscriptions in or under the
specified management group hierarchy are included. `managementGroupId` can't be used at the same
time as `subscriptions`.

Example: Query all resources within the hierarchy of the management group named 'My Management
Group' with ID 'myMG'.

- REST API URI

  ```http
  POST https://management.azure.com/providers/Microsoft.ResourceGraph/resources?api-version=2020-04-01-preview
  ```

- Request Body

  ```json
  {
      "query": "Resources | summarize count()",
      "managementGroupId": "myMG"
  }
  ```

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

    Example query that escapes the property _\$type_ in Bash:

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
