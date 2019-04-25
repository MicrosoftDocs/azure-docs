---
title: Starter query samples
description: Use Azure Resource Graph to run some starter queries, including counting resources, ordering resources, or by a specific tag.
author: DCtheGeek
ms.author: dacoulte
ms.date: 04/23/2019
ms.topic: quickstart
ms.service: resource-graph
manager: carmonm
ms.custom: seodec18
---
# Starter Resource Graph queries

The first step to understanding queries with Azure Resource Graph is a basic understanding of the
[Query Language](../concepts/query-language.md). If you aren't already familiar with [Azure Data
Explorer](../../../data-explorer/data-explorer-overview.md), it's recommended to review the basics
to understand how to compose requests for the resources you're looking for.

We'll walk through the following starter queries:

> [!div class="checklist"]
> - [Count Azure resources](#count-resources)
> - [List resources sorted by name](#list-resources)
> - [Show all virtual machines ordered by name in descending order](#show-vms)
> - [Show first five virtual machines by name and their OS type](#show-sorted)
> - [Count virtual machines by OS type](#count-os)
> - [Show resources that contain storage](#show-storage)
> - [List all public IP addresses](#list-publicip)
> - [Count resources that have IP addresses configured by subscription](#count-resources-by-ip)
> - [List resources with a specific tag value](#list-tag)
> - [List all storage accounts with specific tag value](#list-specific-tag)
> - [Show aliases for a virtual machine resource](#show-aliases)
> - [Show distinct values for a specific alias](#distinct-alias-values)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free) before you begin.

[!INCLUDE [az-powershell-update](../../../../includes/updated-for-az.md)]

## Language support

Azure CLI (through an extension) and Azure PowerShell (through a module) support Azure Resource
Graph. Before running any of the following queries, check that your environment is ready. See
[Azure CLI](../first-query-azurecli.md#add-the-resource-graph-extension) and [Azure
PowerShell](../first-query-powershell.md#add-the-resource-graph-module) for steps to install and
validate your shell environment of choice.

## <a name="count-resources"/>Count Azure resources

This query returns number of Azure resources that exist in the subscriptions that you have access
to. It's also a good query to validate your shell of choice has the appropriate Azure Resource
Graph components installed and in working order.

```kusto
summarize count()
```

```azurecli-interactive
az graph query -q "summarize count()"
```

```azurepowershell-interactive
Search-AzGraph -Query "summarize count()"
```

## <a name="list-resources"/>List resources sorted by name

This query returns any type of resource, but only the **name**, **type**, and **location**
properties. It uses `order by` to sort the properties by the **name** property in ascending (`asc`)
order.

```kusto
project name, type, location
| order by name asc
```

```azurecli-interactive
az graph query -q "project name, type, location | order by name asc"
```

```azurepowershell-interactive
Search-AzGraph -Query "project name, type, location | order by name asc"
```

## <a name="show-vms"/>Show all virtual machines ordered by name in descending order

To list only virtual machines (which are type `Microsoft.Compute/virtualMachines`), we can match
the property **type** in the results. Similar to the previous query, `desc` changes the `order by`
to be descending. The `=~` in the type match tells Resource Graph to be case insensitive.

```kusto
project name, location, type
| where type =~ 'Microsoft.Compute/virtualMachines'
| order by name desc
```

```azurecli-interactive
az graph query -q "project name, location, type| where type =~ 'Microsoft.Compute/virtualMachines' | order by name desc"
```

```azurepowershell-interactive
Search-AzGraph -Query "project name, location, type| where type =~ 'Microsoft.Compute/virtualMachines' | order by name desc"
```

## <a name="show-sorted"/>Show first five virtual machines by name and their OS type

This query will use `limit` to only retrieve five matching records that are ordered by name. The type
of the Azure resource is `Microsoft.Compute/virtualMachines`. `project` tells Azure Resource Graph
which properties to include.

```kusto
where type =~ 'Microsoft.Compute/virtualMachines'
| project name, properties.storageProfile.osDisk.osType
| top 5 by name desc
```

```azurecli-interactive
az graph query -q "where type =~ 'Microsoft.Compute/virtualMachines' | project name, properties.storageProfile.osDisk.osType | top 5 by name desc"
```

```azurepowershell-interactive
Search-AzGraph -Query "where type =~ 'Microsoft.Compute/virtualMachines' | project name, properties.storageProfile.osDisk.osType | top 5 by name desc"
```

## <a name="count-os"/>Count virtual machines by OS type

Building on the previous query, we're still limiting by Azure resources of type
`Microsoft.Compute/virtualMachines`, but are no longer limiting the number of records returned.
Instead, we used `summarize` and `count()` to define how to group and aggregate the values by
property, which in this example is `properties.storageProfile.osDisk.osType`. For an example of how
this string looks in the full object, see [explore resources - virtual machine
discovery](../concepts/explore-resources.md#virtual-machine-discovery).

```kusto
where type =~ 'Microsoft.Compute/virtualMachines'
| summarize count() by tostring(properties.storageProfile.osDisk.osType)
```

```azurecli-interactive
az graph query -q "where type =~ 'Microsoft.Compute/virtualMachines' | summarize count() by tostring(properties.storageProfile.osDisk.osType)"
```

```azurepowershell-interactive
Search-AzGraph -Query "where type =~ 'Microsoft.Compute/virtualMachines' | summarize count() by tostring(properties.storageProfile.osDisk.osType)"
```

A different way to write the same query is to `extend` a property and give it a temporary name for
use within the query, in this case **os**. **os** is then used by `summarize` and `count()` as in
the previous example.

```kusto
where type =~ 'Microsoft.Compute/virtualMachines'
| extend os = properties.storageProfile.osDisk.osType
| summarize count() by tostring(os)
```

```azurecli-interactive
az graph query -q "where type =~ 'Microsoft.Compute/virtualMachines' | extend os = properties.storageProfile.osDisk.osType | summarize count() by tostring(os)"
```

```azurepowershell-interactive
Search-AzGraph -Query "where type =~ 'Microsoft.Compute/virtualMachines' | extend os = properties.storageProfile.osDisk.osType | summarize count() by tostring(os)"
```

> [!NOTE]
> Be aware that while `=~` allows case insensitive matching, use of properties (such as **properties.storageProfile.osDisk.osType**) in the query require the case to be correct. If the property is the incorrect case, it can still return a value, but the grouping or summarization would be incorrect.

## <a name="show-storage"/>Show resources that contain storage

Instead of explicitly defining the type to match, this example query will find any Azure resource
that `contains` the word **storage**.

```kusto
where type contains 'storage' | distinct type
```

```azurecli-interactive
az graph query -q "where type contains 'storage' | distinct type"
```

```azurepowershell-interactive
Search-AzGraph -Query "where type contains 'storage' | distinct type"
```

## <a name="list-publicip"/>List all public IP addresses

Similar to the previous query, find everything that is a type with the word **publicIPAddresses**.
This query expands on that pattern to only include results where **properties.ipAddress**
`isnotempty`, to only return the **properties.ipAddress**, and to `limit` the results by the top
100. You may need to escape the quotes depending on your chosen shell.

```kusto
where type contains 'publicIPAddresses' and isnotempty(properties.ipAddress)
| project properties.ipAddress
| limit 100
```

```azurecli-interactive
az graph query -q "where type contains 'publicIPAddresses' and isnotempty(properties.ipAddress) | project properties.ipAddress | limit 100"
```

```azurepowershell-interactive
Search-AzGraph -Query "where type contains 'publicIPAddresses' and isnotempty(properties.ipAddress) | project properties.ipAddress | limit 100"
```

## <a name="count-resources-by-ip"/>Count resources that have IP addresses configured by subscription

Using the previous example query and adding `summarize` and `count()`, we can get a list by subscription of resources with configured IP addresses.

```kusto
where type contains 'publicIPAddresses' and isnotempty(properties.ipAddress)
| summarize count () by subscriptionId
```

```azurecli-interactive
az graph query -q "where type contains 'publicIPAddresses' and isnotempty(properties.ipAddress) | summarize count () by subscriptionId"
```

```azurepowershell-interactive
Search-AzGraph -Query "where type contains 'publicIPAddresses' and isnotempty(properties.ipAddress) | summarize count () by subscriptionId"
```

## <a name="list-tag"/>List resources with a specific tag value

We can limit the results by properties other than the Azure resource type, such as a tag. In this
example, we're filtering for Azure resources with a tag name of **Environment** that have a value
of **Internal**.

```kusto
where tags.environment=~'internal'
| project name
```

```azurecli-interactive
az graph query -q "where tags.environment=~'internal' | project name"
```

```azurepowershell-interactive
Search-AzGraph -Query "where tags.environment=~'internal' | project name"
```

To also provide what tags the resource has and their values, add the property **tags** to the
`project` keyword.

```kusto
where tags.environment=~'internal'
| project name, tags
```

```azurecli-interactive
az graph query -q "where tags.environment=~'internal' | project name, tags"
```

```azurepowershell-interactive
Search-AzGraph -Query "where tags.environment=~'internal' | project name, tags"
```

## <a name="list-specific-tag"/>List all storage accounts with specific tag value

Combine the filter functionality of the previous example and filter Azure resource type by **type**
property. This query also limits our search for specific types of Azure resources with a specific
tag name and value.

```kusto
where type =~ 'Microsoft.Storage/storageAccounts'
| where tags['tag with a space']=='Custom value'
```

```azurecli-interactive
az graph query -q "where type =~ 'Microsoft.Storage/storageAccounts' | where tags['tag with a space']=='Custom value'"
```

```azurepowershell-interactive
Search-AzGraph -Query "where type =~ 'Microsoft.Storage/storageAccounts' | where tags['tag with a space']=='Custom value'"
```

> [!NOTE]
> This example uses `==` for matching instead of the `=~` conditional. `==` is a case sensitive match.

## <a name="show-aliases"/>Show aliases for a virtual machine resource

[Azure Policy aliases](../../policy/concepts/definition-structure.md#aliases) are used by Azure
Policy to manage resource compliance. Azure Resource Graph can return the _aliases_ of a resource
type. These values are useful for comparing the current value of aliases when creating a custom
policy definition. The _aliases_ array isn't provided by default in the results of a query. Use
`project aliases` to explicitly add it to the results.

```kusto
where type =~ 'Microsoft.Compute/virtualMachines'
| limit 1
| project aliases
```

```azurecli-interactive
az graph query -q "where type =~ 'Microsoft.Compute/virtualMachines' | limit 1 | project aliases"
```

```azurepowershell-interactive
Search-AzGraph -Query "where type =~ 'Microsoft.Compute/virtualMachines' | limit 1 | project aliases"
```

## <a name="distinct-alias-values"/>Show distinct values for a specific alias

Seeing the value of aliases on a single resource is helpful, but it doesn't show the true value of
using Azure Resource Graph to query across subscriptions. This example looks at all values of a
specific alias and returns the distinct values.

```kusto
where type=~'Microsoft.Compute/virtualMachines'
| extend alias = aliases['Microsoft.Compute/virtualMachines/storageProfile.osDisk.managedDisk.storageAccountType']
| distinct tostring(alias)"
```

```azurecli-interactive
az graph query -q "where type=~'Microsoft.Compute/virtualMachines' | extend alias = aliases['Microsoft.Compute/virtualMachines/storageProfile.osDisk.managedDisk.storageAccountType'] | distinct tostring(alias)"
```

```azurepowershell-interactive
Search-AzGraph -Query "where type=~'Microsoft.Compute/virtualMachines' | extend alias = aliases['Microsoft.Compute/virtualMachines/storageProfile.osDisk.managedDisk.storageAccountType'] | distinct tostring(alias)"
```

## Next steps

- Learn more about the [query language](../concepts/query-language.md)
- Learn to [explore resources](../concepts/explore-resources.md)
- See samples of [Advanced queries](advanced.md)