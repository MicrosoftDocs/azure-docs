---
title: Starter Azure Resource Graph queries
description: Use Azure Resource Graph to run some starter queries.
services: resource-graph
author: DCtheGeek
ms.author: dacoulte
ms.date: 09/18/2018
ms.topic: quickstart
ms.service: resource-graph
manager: carmonm
ms.custom: mvc
---
# Starter Resource Graph queries

The first step to understanding queries with Azure Resource Graph is a basic understanding of the
[Query Language](../concepts/query-language.md). If you are not already familiar with [Azure Data
Explorer](../../../data-explorer/data-explorer-overview.md), it is recommended to review the basics
to understand how to compose requests for the resources you are looking for.

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

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free) before you begin.

## Language support

Azure CLI (through an extension) and Azure PowerShell (through a module) support Azure Resource
Graph. Before performing any of the following queries, check that your environment is ready. See
[Azure CLI](../first-query-azurecli.md#add-the-resource-graph-extension) and [Azure
PowerShell](../first-query-powershell.md#add-the-resource-graph-module) for steps to install and
validate your shell environment of choice.

## <a name="count-resources"></a>Count Azure resources

This query returns number of Azure resources that exist in the subscriptions that you have access
to. It is also a good query to use to validate that your shell of choice has the appropriate Azure
Resource Graph components installed and in working order.

```Query
summarize count()
```

```azurecli-interactive
az graph query -q "summarize count()"
```

```powershell
Search-AzureRmGraph -Query "summarize count()"
```

## <a name="list-resources"></a>List resources sorted by name

Without limiting to any type of resource or specific matching property, this query returns only the
**name**, **type**, and **location** of the Azure resources, but uses `order by` to sort them by
the **name** property in ascending (`asc`) order.

```Query
project name, type, location
| order by name asc
```

```azurecli-interactive
az graph query -q "project name, type, location | order by name asc"
```

```powershell
Search-AzureRmGraph -Query "project name, type, location | order by name asc"
```

## <a name="show-vms"></a>Show all virtual machines ordered by name in descending order

Instead of getting all Azure resources, if we only wanted a list of virtual machines (which are
type `Microsoft.Compute/virtualMachines`), we can match the property **type** in the results.
Similar to the previous query, `desc` changes the `order by` to be descending. The `=~` in the type
match tells Resource Graph to be case insensitive.

```Query
project name, location, type
| where type =~ 'Microsoft.Compute/virtualMachines'
| order by name desc
```

```azurecli-interactive
az graph query -q "project name, location, type| where type =~ 'Microsoft.Compute/virtualMachines' | order by name desc"
```

```powershell
Search-AzureRmGraph -Query "project name, location, type| where type =~ 'Microsoft.Compute/virtualMachines' | order by name desc"
```

## <a name="show-sorted"></a>Show first five virtual machines by name and their OS type

This query will use `limit` to only retrieve five matching records that are ordered by name. The type
of the Azure resource is `Microsoft.Compute/virtualMachines`. `project` tells Azure Resource Graph
which properties to include.

```Query
where type =~ 'Microsoft.Compute/virtualMachines'
| project name, properties.storageProfile.osDisk.osType
| top 5 by name desc
```

```azurecli-interactive
az graph query -q "where type =~ 'Microsoft.Compute/virtualMachines' | project name, properties.storageProfile.osDisk.osType | top 5 by name desc"
```

```powershell
Search-AzureRmGraph -Query "where type =~ 'Microsoft.Compute/virtualMachines' | project name, properties.storageProfile.osDisk.osType | top 5 by name desc"
```

## <a name="count-os"></a>Count virtual machines by OS type

Building on the previous query, we are still limiting by Azure resources of type
`Microsoft.Compute/virtualMachines`, but are no longer limiting the number of records returned.
Instead, we used `summarize` and `count()` to define how to group and aggregate the values by
property, which in this example is `properties.storageProfile.osDisk.osType`. For an example of how
this string looks in the full object, see [explore resources - virtual machine discovery](../concepts/explore-resources.md#virtual-machine-discovery).

```Query
where type =~ 'Microsoft.Compute/virtualMachines'
| summarize count() by tostring(properties.storageProfile.osDisk.osType)
```

```azurecli-interactive
az graph query -q "where type =~ 'Microsoft.Compute/virtualMachines' | summarize count() by tostring(properties.storageProfile.osDisk.osType)"
```

```powershell
Search-AzureRmGraph -Query "where type =~ 'Microsoft.Compute/virtualMachines' | summarize count() by tostring(properties.storageProfile.osDisk.osType)"
```

A different way to write the same query is to `extend` a property and give it a temporary name for
use within the query, in this case **os**. **os** is then used by `summarize` and `count()` as in
the previous example.

```Query
where type =~ 'Microsoft.Compute/virtualMachines'
| extend os = properties.storageProfile.osDisk.osType
| summarize count() by tostring(os)
```

```azurecli-interactive
az graph query -q "where type =~ 'Microsoft.Compute/virtualMachines' | extend os = properties.storageProfile.osDisk.osType | summarize count() by tostring(os)"
```

```powershell
Search-AzureRmGraph -Query "where type =~ 'Microsoft.Compute/virtualMachines' | extend os = properties.storageProfile.osDisk.osType | summarize count() by tostring(os)"
```

> [!NOTE]
> Be aware that while `=~` allows case insensitive matching, use of properties (such as **properties.storageProfile.osDisk.osType**) in the query require the case to be correct. If the property is the incorrect case, it can still return a value, but the grouping or summarization would be incorrect.

## <a name="show-storage"></a>Show resources that contain storage

Instead of explicitly defining the type to match, this example query will find any Azure resource
that `contains` the word **storage**.

```Query
where type contains 'storage' | distinct type
```

```azurecli-interactive
az graph query -q "where type contains 'storage' | distinct type"
```

```powershell
Search-AzureRmGraph -Query "where type contains 'storage' | distinct type"
```

## <a name="list-publicip"></a>List all public IP addresses

Similar to the previous query, find everything that was a type containing the word
**publicIPAddresses**. This query expands on that pattern to exclude results where the
**properties.ipAddress** is null, to only return the **properties.ipAddress**, and to `limit` the
results by the top 100. You may need to escape the quotes depending on your chosen
shell.

```Query
where type contains 'publicIPAddresses' and properties.ipAddress != ''
| project properties.ipAddress
| limit 100
```

```azurecli-interactive
az graph query -q "where type contains 'publicIPAddresses' and properties.ipAddress != '' | project properties.ipAddress | limit 100"
```

```powershell
Search-AzureRmGraph -Query "where type contains 'publicIPAddresses' and properties.ipAddress != '' | project properties.ipAddress | limit 100"
```

## <a name="count-resources-by-ip"></a>Count resources that have IP addresses configured by subscription

Using the previous example query and adding `summarize` and `count()`, we can get a list by subscription of resources with configured IP addresses.

```Query
where type contains 'publicIPAddresses' and properties.ipAddress != ''
| summarize count () by subscriptionId
```

```azurecli-interactive
az graph query -q "where type contains 'publicIPAddresses' and properties.ipAddress != '' | summarize count () by subscriptionId"
```

```powershell
Search-AzureRmGraph -Query "where type contains 'publicIPAddresses' and properties.ipAddress != '' | summarize count () by subscriptionId"
```

## <a name="list-tag"></a>List resources with a specific tag value

We can limit the results by properties other than the Azure resource type, such as a tag. In this
example, we are filtering for Azure resources with a tag name of **Environment** that have a value
of **Internal**.

```Query
where tags.environment=~'internal'
| project name
```

```azurecli-interactive
az graph query -q "where tags.environment=~'internal' | project name"
```

```powershell
Search-AzureRmGraph -Query "where tags.environment=~'internal' | project name"
```

If it was required to also provide what tags that resource had and their values, this example could
be expanded by adding the property **tags** to the `project` keyword.

```Query
where tags.environment=~'internal'
| project name, tags
```

```azurecli-interactive
az graph query -q "where tags.environment=~'internal' | project name, tags"
```

```powershell
Search-AzureRmGraph -Query "where tags.environment=~'internal' | project name, tags"
```

## <a name="list-specific-tag"></a>List all storage accounts with specific tag value

Combining the filter capability of the previous example with use of filtering by Azure resource
type by **type** property, we can limit our search for specific types of Azure resources with a
specific tag name and value.

```Query
where type =~ 'Microsoft.Storage/storageAccounts'
| where tags['tag with a space']=='Custom value'
```

```azurecli-interactive
az graph query -q "where type =~ 'Microsoft.Storage/storageAccounts' | where tags['tag with a space']=='Custom value'"
```

```powershell
Search-AzureRmGraph -Query "where type =~ 'Microsoft.Storage/storageAccounts' | where tags['tag with a space']=='Custom value'"
```

> [!NOTE]
> This example uses `==` for matching instead of the `=~` conditional. `==` is a case sensitive match.

## Next steps

- Learn more about the [query language](../concepts/query-language.md)
- Learn to [explore resources](../concepts/explore-resources.md)
- See samples of [Advanced queries](advanced.md)