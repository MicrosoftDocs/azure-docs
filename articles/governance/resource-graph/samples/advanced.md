---
title: Advanced query samples
description: Use Azure Resource Graph to run some advanced queries, including VMSS capacity, listing all tags used, and matching virtual machines with regular expressions.
author: DCtheGeek
ms.author: dacoulte
ms.date: 01/23/2019
ms.topic: quickstart
ms.service: resource-graph
manager: carmonm
ms.custom: seodec18
---
# Advanced Resource Graph queries

The first step to understanding queries with Azure Resource Graph is a basic understanding of the
[Query Language](../concepts/query-language.md). If you aren't already familiar with [Azure Data
Explorer](../../../data-explorer/data-explorer-overview.md), it's recommended to review the basics
to understand how to compose requests for the resources you're looking for.

We'll walk through the following advanced queries:

> [!div class="checklist"]
> - [Get virtual machine scale set capacity and size](#vmss-capacity)
> - [List all tag names](#list-all-tags)
> - [Virtual machines matched by regex](#vm-regex)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free) before you begin.

[!INCLUDE [az-powershell-update](../../../../includes/updated-for-az.md)]

## Language support

Azure CLI (through an extension) and Azure PowerShell (through a module) support Azure Resource
Graph. Before running any of the following queries, check that your environment is ready. See
[Azure CLI](../first-query-azurecli.md#add-the-resource-graph-extension) and [Azure
PowerShell](../first-query-powershell.md#add-the-resource-graph-module) for steps to install and
validate your shell environment of choice.

## <a name="vmss-capacity"></a>Get virtual machine scale set capacity and size

This query looks for virtual machine scale set resources and gets various details including the
virtual machine size and the capacity of the scale set. The query uses the `toint()` function to
cast the capacity to a number so that it can be sorted. Finally, the columns are renamed into
custom named properties.

```kusto
where type=~ 'microsoft.compute/virtualmachinescalesets'
| where name contains 'contoso'
| project subscriptionId, name, location, resourceGroup, Capacity = toint(sku.capacity), Tier = sku.name
| order by Capacity desc
```

```azurecli-interactive
az graph query -q "where type=~ 'microsoft.compute/virtualmachinescalesets' | where name contains 'contoso' | project subscriptionId, name, location, resourceGroup, Capacity = toint(sku.capacity), Tier = sku.name | order by Capacity desc"
```

```azurepowershell-interactive
Search-AzGraph -Query "where type=~ 'microsoft.compute/virtualmachinescalesets' | where name contains 'contoso' | project subscriptionId, name, location, resourceGroup, Capacity = toint(sku.capacity), Tier = sku.name | order by Capacity desc"
```

## <a name="list-all-tags"></a>List all tag names

This query starts with the tag and builds a JSON object listing all unique tag names and their
corresponding types.

```kusto
project tags
| summarize buildschema(tags)
```

```azurecli-interactive
az graph query -q "project tags | summarize buildschema(tags)"
```

```azurepowershell-interactive
Search-AzGraph -Query "project tags | summarize buildschema(tags)"
```

## <a name="vm-regex"></a>Virtual machines matched by regex

This query looks for virtual machines that match a [regular expression](/dotnet/standard/base-types/regular-expression-language-quick-reference) (known as _regex_).
The **matches regex \@** allows us to define the regex to match, which is `^Contoso(.*)[0-9]+$`. That regex definition is explained as:

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
where type =~ 'microsoft.compute/virtualmachines' and name matches regex @'^Contoso(.*)[0-9]+$'
| project name
| order by name asc
```

```azurecli-interactive
az graph query -q "where type =~ 'microsoft.compute/virtualmachines' and name matches regex @'^Contoso(.*)[0-9]+$' | project name | order by name asc"
```

```azurepowershell-interactive
Search-AzGraph -Query "where type =~ 'microsoft.compute/virtualmachines' and name matches regex @'^Contoso(.*)[0-9]+$' | project name | order by name asc"
```

## Next steps

- See samples of [Starter queries](starter.md)
- Learn more about the [query language](../concepts/query-language.md)
- Learn to [explore resources](../concepts/explore-resources.md)
