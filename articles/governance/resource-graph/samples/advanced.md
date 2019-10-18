---
title: Advanced query samples
description: Use Azure Resource Graph to run some advanced queries, including virtual machine scale set capacity, listing all tags used, and matching virtual machines with regular expressions.
author: DCtheGeek
ms.author: dacoulte
ms.date: 10/18/2019
ms.topic: quickstart
ms.service: resource-graph
---
# Advanced Resource Graph queries

The first step to understanding queries with Azure Resource Graph is a basic understanding of the
[Query Language](../concepts/query-language.md). If you aren't already familiar with [Azure Data
Explorer](../../../data-explorer/data-explorer-overview.md), it's recommended to review the basics
to understand how to compose requests for the resources you're looking for.

We'll walk through the following advanced queries:

> [!div class="checklist"]
> - [Get virtual machine scale set capacity and size](#vmss-capacity)
> - [Remove columns from results](#remove-column)
> - [List all tag names](#list-all-tags)
> - [Virtual machines matched by regex](#vm-regex)
> - [List Cosmos DB with specific write locations](#mvexpand-cosmosdb)
> - [Key vault with subscription name](#join)
> - [List SQL Databases and their elastic pools](#join-sql)
> - [List virtual machines with their network interface and public IP](#join-vmpip)
> - [Find storage accounts with a specific tag on the resource group](#join-findstoragetag)
> - [Combine results from two queries into a single result](#unionresults)
> - [Include the tenant and subscription names with DisplayNames](#displaynames)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free)
before you begin.

## Language support

Azure CLI (through an extension) and Azure PowerShell (through a module) support Azure Resource
Graph. Before running any of the following queries, check that your environment is ready. See
[Azure CLI](../first-query-azurecli.md#add-the-resource-graph-extension) and [Azure
PowerShell](../first-query-powershell.md#add-the-resource-graph-module) for steps to install and
validate your shell environment of choice.

## <a name="vmss-capacity"></a>Get virtual machine scale set capacity and size

This query looks for virtual machine scale set resources and gets various details including the
virtual machine size and the capacity of the scale set. The query uses the `toint()` function to
cast the capacity to a number so that it can be sorted. Finally, the columns are renamed into custom
named properties.

```kusto
Resources
| where type=~ 'microsoft.compute/virtualmachinescalesets'
| where name contains 'contoso'
| project subscriptionId, name, location, resourceGroup, Capacity = toint(sku.capacity), Tier = sku.name
| order by Capacity desc
```

```azurecli-interactive
az graph query -q "Resources | where type=~ 'microsoft.compute/virtualmachinescalesets' | where name contains 'contoso' | project subscriptionId, name, location, resourceGroup, Capacity = toint(sku.capacity), Tier = sku.name | order by Capacity desc"
```

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type=~ 'microsoft.compute/virtualmachinescalesets' | where name contains 'contoso' | project subscriptionId, name, location, resourceGroup, Capacity = toint(sku.capacity), Tier = sku.name | order by Capacity desc"
```

## <a name="remove-column"></a>Remove columns from results

The following query uses `summarize` to count resources by subscription, `join` to combine it with
subscription details from _ResourceContainers_ table, then `project-away` to remove some of the
columns.

```kusto
Resources
| summarize resourceCount=count() by subscriptionId
| join (ResourceContainers | where type=='microsoft.resources/subscriptions' | project SubName=name, subscriptionId) on subscriptionId
| project-away subscriptionId, subscriptionId1
```

```azurecli-interactive
az graph query -q "Resources | summarize resourceCount=count() by subscriptionId | join (ResourceContainers | where type=='microsoft.resources/subscriptions' | project SubName=name, subscriptionId) on subscriptionId| project-away subscriptionId, subscriptionId1"
```

```azurepowershell-interactive
Search-AzGraph -Query "Resources | summarize resourceCount=count() by subscriptionId | join (ResourceContainers | where type=='microsoft.resources/subscriptions' | project SubName=name, subscriptionId) on subscriptionId| project-away subscriptionId, subscriptionId1"
```

## <a name="list-all-tags"></a>List all tag names

This query starts with the tag and builds a JSON object listing all unique tag names and their
corresponding types.

```kusto
Resources
| project tags
| summarize buildschema(tags)
```

```azurecli-interactive
az graph query -q "Resources | project tags | summarize buildschema(tags)"
```

```azurepowershell-interactive
Search-AzGraph -Query "Resources | project tags | summarize buildschema(tags)"
```

## <a name="vm-regex"></a>Virtual machines matched by regex

This query looks for virtual machines that match a [regular expression](/dotnet/standard/base-types/regular-expression-language-quick-reference)
(known as _regex_). The **matches regex \@** allows us to define the regex to match, which is `^Contoso(.*)[0-9]+$`.
That regex definition is explained as:

- `^` - Match must start at the beginning of the string.
- `Contoso` - The case-sensitive string.
- `(.*)` - A subexpression match:
  - `.` - Matches any single character (except a new line).
  - `*` - Matches previous element zero or more times.
- `[0-9]` - Character group match for numbers 0 through 9.
- `+` - Matches previous element one or more times.
- `$` - Match of the previous element must occur at the end of the string.

After matching by name, the query projects the name and orders by name ascending.

```kusto
Resources
| where type =~ 'microsoft.compute/virtualmachines' and name matches regex @'^Contoso(.*)[0-9]+$'
| project name
| order by name asc
```

```azurecli-interactive
az graph query -q "Resources | where type =~ 'microsoft.compute/virtualmachines' and name matches regex @'^Contoso(.*)[0-9]+$' | project name | order by name asc"
```

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type =~ 'microsoft.compute/virtualmachines' and name matches regex @'^Contoso(.*)[0-9]+$' | project name | order by name asc"
```

## <a name="mvexpand-cosmosdb"></a>List Cosmos DB with specific write locations

The following query limits to Cosmos DB resources, uses `mv-expand` to expand the property bag for
**properties.writeLocations**, then project specific fields and limit the results further to
**properties.writeLocations.locationName** values matching either 'East US' or 'West US'.

```kusto
Resources
| where type =~ 'microsoft.documentdb/databaseaccounts'
| project id, name, writeLocations = (properties.writeLocations)
| mv-expand writeLocations
| project id, name, writeLocation = tostring(writeLocations.locationName)
| where writeLocation in ('East US', 'West US')
| summarize by id, name
```

```azurecli-interactive
az graph query -q "Resources | where type =~ 'microsoft.documentdb/databaseaccounts' | project id, name, writeLocations = (properties.writeLocations) | mv-expand writeLocations | project id, name, writeLocation = tostring(writeLocations.locationName) | where writeLocation in ('East US', 'West US') | summarize by id, name"
```

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type =~ 'microsoft.documentdb/databaseaccounts' | project id, name, writeLocations = (properties.writeLocations) | mv-expand writeLocations | project id, name, writeLocation = tostring(writeLocations.locationName) | where writeLocation in ('East US', 'West US') | summarize by id, name"
```

## <a name="join"></a>Key vault with subscription name

The following query shows a complex use of `join`. The query limits the joined table to
subscriptions resources and with `project` to include only the original field _subscriptionId_ and
the _name_ field renamed to _SubName_. The field rename avoids `join` adding it as _name1_ since the
field already exists in _resources_. The original table is filtered with `where` and the following
`project` includes columns from both tables. The query result is a single key vault displaying type,
the name of the key vault, and the name of the subscription it's in.

```kusto
Resources
| join (ResourceContainers | where type=='microsoft.resources/subscriptions' | project SubName=name, subscriptionId) on subscriptionId
| where type == 'microsoft.keyvault/vaults'
| project type, name, SubName
| limit 1
```

```azurecli-interactive
az graph query -q "Resources | join (ResourceContainers | where type=='microsoft.resources/subscriptions' | project SubName=name, subscriptionId) on subscriptionId | where type == 'microsoft.keyvault/vaults' | project type, name, SubName| limit 1"
```

```azurepowershell-interactive
Search-AzGraph -Query "Resources | join (ResourceContainers | where type=='microsoft.resources/subscriptions' | project SubName=name, subscriptionId) on subscriptionId | where type == 'microsoft.keyvault/vaults' | project type, name, SubName| limit 1"
```

## <a name="join-sql"></a>List SQL Databases and their elastic pools

The following query uses **leftouter** `join` to bring together SQL Database resources and their
related elastic pools, if they have any.

```kusto
Resources
| where type =~ 'microsoft.sql/servers/databases'
| project databaseId = id, databaseName = name, elasticPoolId = tolower(tostring(properties.elasticPoolId))
| join kind=leftouter (
    Resources
    | where type =~ 'microsoft.sql/servers/elasticpools'
    | project elasticPoolId = tolower(id), elasticPoolName = name, elasticPoolState = properties.state)
on elasticPoolId
| project-away elasticPoolId1
```

```azurecli-interactive
az graph query -q "Resources | where type =~ 'microsoft.sql/servers/databases' | project databaseId = id, databaseName = name, elasticPoolId = tolower(tostring(properties.elasticPoolId)) | join kind=leftouter ( Resources | where type =~ 'microsoft.sql/servers/elasticpools' | project elasticPoolId = tolower(id), elasticPoolName = name, elasticPoolState = properties.state) on elasticPoolId | project-away elasticPoolId1"
```

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type =~ 'microsoft.sql/servers/databases' | project databaseId = id, databaseName = name, elasticPoolId = tolower(tostring(properties.elasticPoolId)) | join kind=leftouter ( Resources | where type =~ 'microsoft.sql/servers/elasticpools' | project elasticPoolId = tolower(id), elasticPoolName = name, elasticPoolState = properties.state) on elasticPoolId | project-away elasticPoolId1"
```

## <a name="join-vmpip"></a>List virtual machines with their network interface and public IP

This query uses two **leftouter** `join` commands to bring together virtual machines, their related
network interfaces, and any public IP address related to those network interfaces.

```kusto
Resources
| where type =~ 'microsoft.compute/virtualmachines'
| extend nics=array_length(properties.networkProfile.networkInterfaces) 
| mvexpand nic=properties.networkProfile.networkInterfaces 
| where nics == 1 or nic.properties.primary =~ 'true' or isempty(nic) 
| project vmId = id, vmName = name, vmSize=tostring(properties.hardwareProfile.vmSize), nicId = tostring(nic.id) 
| join kind=leftouter (
    Resources
    | where type =~ 'microsoft.network/networkinterfaces'
    | extend ipConfigsCount=array_length(properties.ipConfigurations) 
    | mvexpand ipconfig=properties.ipConfigurations 
    | where ipConfigsCount == 1 or ipconfig.properties.primary =~ 'true'
    | project nicId = id, publicIpId = tostring(ipconfig.properties.publicIPAddress.id))
on nicId
| project-away nicId1
| summarize by vmId, vmName, vmSize, nicId, publicIpId
| join kind=leftouter (
    Resources
    | where type =~ 'microsoft.network/publicipaddresses'
    | project publicIpId = id, publicIpAddress = properties.ipAddress)
on publicIpId
| project-away publicIpId1
```

```azurecli-interactive
azure graph query -q "Resources | where type =~ 'microsoft.compute/virtualmachines' | extend nics=array_length(properties.networkProfile.networkInterfaces) | mvexpand nic=properties.networkProfile.networkInterfaces | where nics == 1 or nic.properties.primary =~ 'true' or isempty(nic) | project vmId = id, vmName = name, vmSize=tostring(properties.hardwareProfile.vmSize), nicId = tostring(nic.id) | join kind=leftouter ( Resources | where type =~ 'microsoft.network/networkinterfaces' | extend ipConfigsCount=array_length(properties.ipConfigurations) | mvexpand ipconfig=properties.ipConfigurations | where ipConfigsCount == 1 or ipconfig.properties.primary =~ 'true' | project nicId = id, publicIpId = tostring(ipconfig.properties.publicIPAddress.id)) on nicId | project-away nicId1 | summarize by vmId, vmName, vmSize, nicId, publicIpId | join kind=leftouter ( Resources | where type =~ 'microsoft.network/publicipaddresses' | project publicIpId = id, publicIpAddress = properties.ipAddress) on publicIpId | project-away publicIpId1"
```

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type =~ 'microsoft.compute/virtualmachines' | extend nics=array_length(properties.networkProfile.networkInterfaces) | mvexpand nic=properties.networkProfile.networkInterfaces | where nics == 1 or nic.properties.primary =~ 'true' or isempty(nic) | project vmId = id, vmName = name, vmSize=tostring(properties.hardwareProfile.vmSize), nicId = tostring(nic.id) | join kind=leftouter ( Resources | where type =~ 'microsoft.network/networkinterfaces' | extend ipConfigsCount=array_length(properties.ipConfigurations) | mvexpand ipconfig=properties.ipConfigurations | where ipConfigsCount == 1 or ipconfig.properties.primary =~ 'true' | project nicId = id, publicIpId = tostring(ipconfig.properties.publicIPAddress.id)) on nicId | project-away nicId1 | summarize by vmId, vmName, vmSize, nicId, publicIpId | join kind=leftouter ( Resources | where type =~ 'microsoft.network/publicipaddresses' | project publicIpId = id, publicIpAddress = properties.ipAddress) on publicIpId | project-away publicIpId1"
```

## <a name="join-findstoragetag"></a>Find storage accounts with a specific tag on the resource group

The following query uses an **innerunique** `join` to connect storage accounts with resource groups
that have a specified tag name and tag value.

```kusto
Resources
| where type =~ 'microsoft.storage/storageaccounts'
| join kind=innerunique (
    ResourceContainers
    | where type =~ 'microsoft.resources/subscriptions/resourcegroups'
    | where tags['key1'] == 'value1'
    | project subscriptionId, resourceGroup)
on subscriptionId, resourceGroup
| project-away subscriptionId1, resourceGroup1
```

```azurecli-interactive
az graph query -q "Resources | where type =~ 'microsoft.storage/storageaccounts' | join kind=innerunique ( ResourceContainers | where type =~ 'microsoft.resources/subscriptions/resourcegroups' | where tags['key1'] == 'value1' | project subscriptionId, resourceGroup) on subscriptionId, resourceGroup | project-away subscriptionId1, resourceGroup1"
```

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type =~ 'microsoft.storage/storageaccounts' | join kind=innerunique ( ResourceContainers | where type =~ 'microsoft.resources/subscriptions/resourcegroups' | where tags['key1'] == 'value1' | project subscriptionId, resourceGroup) on subscriptionId, resourceGroup | project-away subscriptionId1, resourceGroup1"
```

## <a name="unionresults"></a>Combine results from two queries into a single result

The following query uses `union` to get results from the _ResourceContainers_ table and add them to
results from the _Resources_ table.

```kusto
ResourceContainers
| where type=='microsoft.resources/subscriptions/resourcegroups' | project name, type  | limit 5
| union  (Resources | project name, type | limit 5)
```

```azurecli-interactive
az graph query -q "ResourceContainers | where type=='microsoft.resources/subscriptions/resourcegroups' | project name, type  | limit 5 | union  (Resources | project name, type | limit 5)"
```

```azurepowershell-interactive
Search-AzGraph -Query "ResourceContainers | where type=='microsoft.resources/subscriptions/resourcegroups' | project name, type  | limit 5 | union  (Resources | project name, type | limit 5)"
```

## <a name="displaynames"></a>Include the tenant and subscription names with DisplayNames

This query uses the new **Include** parameter with option _DisplayNames_ to add
**subscriptionDisplayName** and **tenantDisplayName** to the results. This parameter is only
available for Azure CLI and Azure PowerShell.

```azurecli-interactive
az graph query -q "limit 1" --include displayNames
```

```azurepowershell-interactive
Search-AzGraph -Query "limit 1" -Include DisplayNames
```

> [!NOTE]
> If the query doesn't use **project** to specify the returned properties,
> **subscriptionDisplayName** and **tenantDisplayName** are automatically included in the results.
> If the query does use **project**, each of the _DisplayName_ fields must be explicitly included in
> the **project** or they won't be returned in the results, even when the **Include** parameter is
> used.

## Next steps

- See samples of [Starter queries](starter.md)
- Learn more about the [query language](../concepts/query-language.md)
- Learn to [explore resources](../concepts/explore-resources.md)