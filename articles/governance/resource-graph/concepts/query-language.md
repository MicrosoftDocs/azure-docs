---
title: Understand the query language
description: Describes Resource Graph tables and the available Kusto data types, operators, and functions usable with Azure Resource Graph.
ms.date: 03/20/2024
ms.topic: conceptual
---

# Understanding the Azure Resource Graph query language

The query language for the Azure Resource Graph supports many operators and functions. Each
work and operate based on [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/index). To learn about the
query language used by Resource Graph, start with the [tutorial for KQL](/azure/data-explorer/kusto/query/tutorial).

This article covers the language components supported by Resource Graph:

- [Understanding the Azure Resource Graph query language](#understanding-the-azure-resource-graph-query-language)
  - [Resource Graph tables](#resource-graph-tables)
  - [Extended properties](#extended-properties)
  - [Resource Graph custom language elements](#resource-graph-custom-language-elements)
    - [Shared query syntax (preview)](#shared-query-syntax-preview)
  - [Supported KQL language elements](#supported-kql-language-elements)
    - [Supported tabular/top level operators](#supported-tabulartop-level-operators)
  - [Query scope](#query-scope)
  - [Escape characters](#escape-characters)
  - [Next steps](#next-steps)

## Resource Graph tables

Resource Graph provides several tables for the data it stores about Azure Resource Manager resource types and their properties. Resource Graph tables can be used with the `join` operator to get properties from related resource types.

Resource Graph tables support the `join` flavors:
- [innerunique](/azure/data-explorer/kusto/query/join-innerunique)
- [inner](/azure/data-explorer/kusto/query/join-inner)
- [leftouter](/azure/data-explorer/kusto/query/join-leftouter)
- [fullouter](/azure/data-explorer/kusto/query/join-fullouter)

| Resource Graph table | Can `join` other tables? | Description |
| --- | --- | --- |
| AdvisorResources | Yes | Includes resources _related_ to `Microsoft.Advisor`. |
| AlertsManagementResources | Yes | Includes resources _related_ to `Microsoft.AlertsManagement`. |
| AppServiceResources | Yes | Includes resources _related_ to `Microsoft.Web`. |
| AuthorizationResources | Yes | Includes resources _related_ to `Microsoft.Authorization`. |
| AWSResources | Yes | Includes resources _related_ to `Microsoft.AwsConnector`. |
| AzureBusinessContinuityResources | Yes | Includes resources _related_ to `Microsoft.AzureBusinessContinuity`. |
| ChaosResources | Yes | Includes resources _related_ to `Microsoft.Chaos`. |
| CommunityGalleryResources | Yes | Includes resources _related_ to `Microsoft.Compute`. |
| ComputeResources | Yes | Includes resources related to `Microsoft.Compute` Virtual Machine Scale Sets. |
| DesktopVirtualizationResources | Yes | Includes resources _related_ to `Microsoft.DesktopVirtualization`. |
| DnsResources | Yes | Includes resources _related_ to `Microsoft.Network`. |
| EdgeOrderResources | Yes | Includes resources _related_ to `Microsoft.EdgeOrder`. |
| ElasticsanResources | Yes | Includes resources _related_ to `Microsoft.ElasticSan`. |
| ExtendedLocationResources | Yes | Includes resources _related_ to `Microsoft.ExtendedLocation`. |
| FeatureResources | Yes | Includes resources _related_ to `Microsoft.Features`. |
| GuestConfigurationResources | Yes | Includes resources _related_ to `Microsoft.GuestConfiguration`. |
| HealthResourceChanges | Yes | Includes resources _related_ to `Microsoft.Resources`. |
| HealthResources| Yes | Includes resources _related_ to `Microsoft.ResourceHealth`. |
| InsightsResources | Yes | Includes resources _related_ to `Microsoft.Insights`. |
| IoTSecurityResources | Yes | Includes resources _related_ to `Microsoft.IoTSecurity` and `Microsoft.IoTFirmwareDefense`. |
| KubernetesConfigurationResources | Yes | Includes resources _related_ to `Microsoft.KubernetesConfiguration`. |
| KustoResources | Yes | Includes resources _related_ to `Microsoft.Kusto`. |
| MaintenanceResources | Yes | Includes resources _related_ to `Microsoft.Maintenance`. |
| ManagedServicesResources | Yes | Includes resources _related_ to `Microsoft.ManagedServices`. |
| MigrateResources | Yes | Includes resources _related_ to `Microsoft.OffAzure`. |
| NetworkResources | Yes | Includes resources _related_ to `Microsoft.Network`. |
| OrbitalResources | Yes | Includes resources _related_ to `Microsoft.Orbital`. |
| PatchAssessmentResources| Yes | Includes resources _related_ to Azure Virtual Machines patch assessment `Microsoft.Compute` and `Microsoft.HybridCompute`. |
| PatchInstallationResources| Yes | Includes resources _related_ to Azure Virtual Machines patch installation `Microsoft.Compute` and `Microsoft.HybridCompute`. |
| PolicyResources | Yes | Includes resources _related_ to `Microsoft.PolicyInsights`. |
| RecoveryServicesResources | Yes | Includes resources _related_ to `Microsoft.DataProtection` and `Microsoft.RecoveryServices`. |
| ResourceChanges | Yes | Includes resources _related_ to `Microsoft.Resources`. |
| ResourceContainerChanges | Yes | Includes resources _related_ to `Microsoft.Resources`. |
| ResourceContainers | Yes | Includes management group (`Microsoft.Management/managementGroups`), subscription (`Microsoft.Resources/subscriptions`) and resource group (`Microsoft.Resources/subscriptions/resourcegroups`) resource types and data. |
| Resources | Yes | The default table if a table isn't defined in the query. Most Resource Manager resource types and properties are here. |
| SecurityResources | Yes | Includes resources _related_ to `Microsoft.Security`. |
| ServiceFabricResources | Yes | Includes resources _related_ to `Microsoft.ServiceFabric`. |
| ServiceHealthResources | Yes | Includes resources _related_ to `Microsoft.ResourceHealth/events`. |
| SpotResources | Yes | Includes resources _related_ to `Microsoft.Compute`. |
| SupportResources | Yes | Includes resources _related_ to `Microsoft.Support`. |
| TagsResources | Yes | Includes resources _related_ to `Microsoft.Resources/tagnamespaces`. |

For a list of tables that includes resource types, go to [Azure Resource Graph table and resource type reference](../reference/supported-tables-resources.md).

> [!NOTE]
> `Resources` is the default table. While querying the `Resources` table, it isn't required to
> provide the table name unless `join` or `union` are used. But the recommended practice is to
> always include the initial table in the query.

To discover which resource types are available in each table, use Resource Graph Explorer in the portal. As an alternative, use a query such as `<tableName> | distinct type` to get a list of resource types the given Resource Graph table supports that exist in your environment.

The following query shows a simple `join`. The query result blends the columns together and any
duplicate column names from the joined table, _ResourceContainers_ in this example, are appended
with **1**. As _ResourceContainers_ table has types for both subscriptions and resource groups,
either type might be used to join to the resource from `Resources` table.

```kusto
Resources
| join ResourceContainers on subscriptionId
| limit 1
```

The following query shows a more complex use of `join`. First, the query uses `project` to get the
fields from `Resources` for the Azure Key Vault vaults resource type. The next step uses `join` to
merge the results with _ResourceContainers_ where the type is a subscription _on_ a property that is
both in the first table's `project` and the joined table's `project`. The field rename avoids `join`
adding it as _name1_ since the property already is projected from `Resources`. The query result is a
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

## Extended properties

As a _preview_ feature, some of the resource types in Resource Graph have more type-related
properties available to query beyond the properties provided by Azure Resource Manager. This set of
values, known as _extended properties_, exists on a supported resource type in
`properties.extended`. To show resource types with _extended properties_, use the following
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

### Shared query syntax (preview)

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

Example 1: Use only the shared query:

The results of this Resource Graph query are the same as the query stored in the shared query.

```kusto
{{/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SharedQueries/providers/Microsoft.ResourceGraph/queries/Count VMs by OS}}
```

Example 2: Include the shared query as part of a larger query:

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
[tabular operators](/azure/data-explorer/kusto/query/queries) are supported by Resource Graph, some of which have different behaviors.

### Supported tabular/top level operators

Here's the list of KQL tabular operators supported by Resource Graph with specific samples:

|KQL |Resource Graph sample query |Notes |
|---|---|---|
|[count](/azure/data-explorer/kusto/query/countoperator) |[Count key vaults](../samples/starter.md#count-key-vault-resources) | |
|[distinct](/azure/data-explorer/kusto/query/distinctoperator) |[Show resources that contain storage](../samples/starter.md#show-resources-that-contain-storage) | |
|[extend](/azure/data-explorer/kusto/query/extendoperator) |[Count virtual machines by OS type](../samples/starter.md#count-virtual-machines-by-os-type) | |
|[join](/azure/data-explorer/kusto/query/joinoperator) |[Key vault with subscription name](../samples/advanced.md#key-vaults-with-subscription-name) |Join flavors supported: [innerunique](/azure/data-explorer/kusto/query/joinoperator#default-join-flavor), [inner](/azure/data-explorer/kusto/query/joinoperator#inner-join), [leftouter](/azure/data-explorer/kusto/query/joinoperator#left-outer-join), and [fullouter](/azure/data-explorer/kusto/query/join-fullouter). Limit of three `join` in a single query, one of which might be a cross-table `join`. If all cross-table `join` use is between _Resource_ and _ResourceContainers_, then three cross-table `join` are allowed. Custom join strategies, such as broadcast join, aren't allowed. For which tables can use `join`, go to [Resource Graph tables](#resource-graph-tables). |
|[limit](/azure/data-explorer/kusto/query/limitoperator) |[List all public IP addresses](../samples/starter.md#list-all-public-ip-addresses) |Synonym of `take`. Doesn't work with [Skip](./work-with-data.md#skipping-records). |
|[mvexpand](/azure/data-explorer/kusto/query/mvexpandoperator) | | Legacy operator, use `mv-expand` instead. _RowLimit_ max of 400. The default is 128. |
|[mv-expand](/azure/data-explorer/kusto/query/mvexpandoperator) |[List Azure Cosmos DB with specific write locations](../samples/advanced.md#list-azure-cosmos-db-with-specific-write-locations) |_RowLimit_ max of 400. The default is 128. Limit of 2 `mv-expand` in a single query.|
|[order](/azure/data-explorer/kusto/query/orderoperator) |[List resources sorted by name](../samples/starter.md#list-resources-sorted-by-name) |Synonym of `sort` |
|[parse](/azure/data-explorer/kusto/query/parseoperator) |[Get virtual networks and subnets of network interfaces](../samples/advanced.md#get-virtual-networks-and-subnets-of-network-interfaces) |It's optimal to access properties directly if they exist instead of using `parse`. |
|[project](/azure/data-explorer/kusto/query/projectoperator) |[List resources sorted by name](../samples/starter.md#list-resources-sorted-by-name) | |
|[project-away](/azure/data-explorer/kusto/query/projectawayoperator) |[Remove columns from results](../samples/advanced.md#remove-columns-from-results) | |
|[sort](/azure/data-explorer/kusto/query/sort-operator) |[List resources sorted by name](../samples/starter.md#list-resources-sorted-by-name) |Synonym of `order` |
|[summarize](/azure/data-explorer/kusto/query/summarizeoperator) |[Count Azure resources](../samples/starter.md#count-azure-resources) |Simplified first page only |
|[take](/azure/data-explorer/kusto/query/takeoperator) |[List all public IP addresses](../samples/starter.md#list-all-public-ip-addresses) |Synonym of `limit`. Doesn't work with [Skip](./work-with-data.md#skipping-records). |
|[top](/azure/data-explorer/kusto/query/topoperator) |[Show first five virtual machines by name and their OS type](../samples/starter.md#show-first-five-virtual-machines-by-name-and-their-os-type) | |
|[union](/azure/data-explorer/kusto/query/unionoperator) |[Combine results from two queries into a single result](../samples/advanced.md#combine-results-from-two-queries-into-a-single-result) |Single table allowed: ```| union [kind= inner|outer] [withsource=ColumnName] Table```. Limit of three `union` legs in a single query. Fuzzy resolution of `union` leg tables isn't allowed. Might be used within a single table or between the _Resources_ and _ResourceContainers_ tables. |
|[where](/azure/data-explorer/kusto/query/whereoperator) |[Show resources that contain storage](../samples/starter.md#show-resources-that-contain-storage) | |

There's a default limit of three `join` and three `mv-expand` operators in a single Resource Graph SDK query. You can request an increase in these limits for your tenant through **Help + support**.

To support the _Open Query_ portal experience, Azure Resource Graph Explorer has a higher global limit than Resource Graph SDK.

## Query scope

The scope of the subscriptions or [management groups](../../management-groups/overview.md) from
which resources are returned by a query defaults to a list of subscriptions based on the context of
the authorized user. If a management group or a subscription list isn't defined, the query scope is
all resources, and includes [Azure Lighthouse](../../../lighthouse/overview.md) delegated
resources.

The list of subscriptions or management groups to query can be manually defined to change the scope
of the results. For example, the REST API `managementGroups` property takes the management group ID,
which is different from the name of the management group. When `managementGroups` is specified,
resources from the first 10,000 subscriptions in or under the specified management group hierarchy
are included. `managementGroups` can't be used at the same time as `subscriptions`.

Example: Query all resources within the hierarchy of the management group named `My Management
Group` with ID `myMG`.

- REST API URI

  ```http
  POST https://management.azure.com/providers/Microsoft.ResourceGraph/resources?api-version=2021-03-01
  ```

- Request Body

  ```json
  {
    "query": "Resources | summarize count()",
    "managementGroups": ["myMG"]
  }
  ```

The `AuthorizationScopeFilter` parameter enables you to list Azure Policy assignments and Azure role-based access control (Azure RBAC) role assignments in the `AuthorizationResources` table that are inherited from upper scopes. The `AuthorizationScopeFilter` parameter accepts the following values for the `PolicyResources` and `AuthorizationResources` tables:

- **AtScopeAndBelow** (default if not specified): Returns assignments for the given scope and all child scopes.
- **AtScopeAndAbove**: Returns assignments for the given scope and all parent scopes, but not child scopes.
- **AtScopeAboveAndBelow**: Returns assignments for the given scope, all parent scopes, and all child scopes.
- **AtScopeExact**: Returns assignments only for the given scope; no parent or child scopes are included.

> [!NOTE]
> To use the `AuthorizationScopeFilter` parameter, be sure to use the **2021-06-01-preview** or later API version in your requests.

Example: Get all policy assignments at the **myMG** management group and Tenant Root (parent) scopes.

- REST API URI

  ```http
  POST https://management.azure.com/providers/Microsoft.ResourceGraph/resources?api-version=2021-06-01-preview
  ```

- Request Body Sample

  ```json
  {
    "options": {
      "authorizationScopeFilter": "AtScopeAndAbove"
    },
    "query": "PolicyResources | where type =~ 'Microsoft.Authorization/PolicyAssignments'",
    "managementGroups": ["myMG"]
  }
  ```

Example: Get all policy assignments at the **mySubscriptionId** subscription, management group, and Tenant Root scopes.

- REST API URI

  ```http
  POST https://management.azure.com/providers/Microsoft.ResourceGraph/resources?api-version=2021-06-01-preview
  ```
- Request Body Sample

  ```json
  {
    "options": {
      "authorizationScopeFilter": "AtScopeAndAbove"
    },
    "query": "PolicyResources | where type =~ 'Microsoft.Authorization/PolicyAssignments'",
    "subscriptions": ["mySubscriptionId"]
  }
  ```

## Escape characters

Some property names, such as those that include a `.` or `$`, must be wrapped or escaped in the
query or the property name is interpreted incorrectly and doesn't provide the expected results.

- Dot (`.`): Wrap the property name `['propertyname.withaperiod']` using brackets.

  Example query that wraps the property _odata.type_:

  ```kusto
  where type=~'Microsoft.Insights/alertRules' | project name, properties.condition.['odata.type']
  ```

- Dollar sign (`$`): Escape the character in the property name. The escape character used depends on the shell that runs Resource Graph.

  - **Bash**: Use a backslash (`\`) as the escape character.

    Example query that escapes the property _\$type_ in Bash:

    ```kusto
    where type=~'Microsoft.Insights/alertRules' | project name, properties.condition.\$type
    ```

  - **cmd**: Don't escape the dollar sign (`$`) character.

  - **PowerShell**: Use a backtick (``` ` ```) as the escape character.

    Example query that escapes the property _\$type_ in PowerShell:

    ```kusto
    where type=~'Microsoft.Insights/alertRules' | project name, properties.condition.`$type
    ```

## Next steps

- Azure Resource Graph query language [Starter queries](../samples/starter.md) and [Advanced queries](../samples/advanced.md).
- Learn more about how to [explore Azure resources](explore-resources.md).
