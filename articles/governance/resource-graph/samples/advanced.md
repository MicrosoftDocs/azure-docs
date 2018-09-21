---
title: Advanced Azure Resource Graph queries
description: Use Azure Resource Graph to run some advanced queries.
services: resource-graph
author: DCtheGeek
ms.author: dacoulte
ms.date: 09/18/2018
ms.topic: quickstart
ms.service: resource-graph
manager: carmonm
ms.custom: mvc
---
# Advanced Resource Graph queries

The first step to understanding queries with Azure Resource Graph is a basic understanding of the
[Query Language](../concepts/query-language.md). If you aren't already familiar with Kusto Query
Language (KQL), it's recommended to review the basics to understand how to compose requests for the
resources you're looking for.

We'll walk through the following advanced queries:

> [!div class="checklist"]
> - [Find virtual machine scale sets that do not have disk encryption or the encryption is not enabled](#vmss-not-encrypted)
> - [List all tag names](#list-all-tags)
> - [Virtual machines matched by regex](#vm-regex)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free) before you begin.

## Language Support

Azure CLI (through an extension) and Azure PowerShell (through a module) support Azure Resource
Graph. Before performing any of the following queries, check that your environment is ready. See
[Azure CLI](../first-query-azurecli.md#add-the-resource-graph-extension) and [Azure
PowerShell](../first-query-powershell.md#add-the-resource-graph-module) for steps to install and
validate your shell environment of choice.

## <a name="vmss-not-encrypted"></a>Find virtual machine scale sets that do not have disk encryption or the encryption is not enabled

This query looks for virtual machine scale set resources, expands the extensions details, looks at
the extension **Type** and **EncryptionOperation** properties, summarizes, and returns the resources
where the count of expected configurations were 0.

```Query
where type =~ 'microsoft.compute/virtualmachinescalesets'
| project id, extension = properties.virtualMachineProfile.extensionProfile.extensions
| where extension !has 'AzureDiskEncryption' or extension !has '"EnableEncryption"'
| project id
```

```azurecli-interactive
az graph query -q "where type =~ 'microsoft.compute/virtualmachinescalesets' | project id, extension = properties.virtualMachineProfile.extensionProfile.extensions | where extension !has 'AzureDiskEncryption' or extension !has '"EnableEncryption"' | project id"
```

```azurepowershell-interactive
Search-AzureRmGraph -Query "where type =~ 'microsoft.compute/virtualmachinescalesets' | project id, extension = properties.virtualMachineProfile.extensionProfile.extensions | where extension !has 'AzureDiskEncryption' or extension !has '"EnableEncryption"' | project id"
```

## <a name="list-all-tags"></a>List all tag names

This query starts with the tag and builds a JSON object listing all unique tag names and their
corresponding types.

```Query
project tags
| summarize buildschema(tags)
```

```azurecli-interactive
az graph query -q "project tags | summarize buildschema(tags)"
```

```azurepowershell-interactive
Search-AzureRmGraph -Query "project tags | summarize buildschema(tags)"
```

## <a name="vm-regex"></a>Virtual machines matched by regex

This query looks for virtual machines that match a [regular expression](/dotnet/standard/base-types/regular-expression-language-quick-reference) (known as _regex_).
The **matches regex @** allows us to define the regex to match, which is **^Contoso(.*)[0-9]+$**. That regex definition is explained as:

- `^` - Match must start at the beginning of the string.
- `Contoso` - The core string we are matching for (case-sensitive).
- `(.*)` - A sub-expression match:
  - `.` - Matches any single character (except a new line).
  - `*` - Matches previous element zero or more times.
- `[0-9]` - Character group match for numbers 0 through 9.
- `+` - Matches previous element one or more times.
- `$` - Match of the previous element must occur at the end of the string.

After matching by name, the query projects the name and orders by name ascending.

```Query
where type =~ 'microsoft.compute/virtualmachines' and name matches regex @'^Contoso(.*)[0-9]+$'
| project name
| order by name asc
```

```azurecli-interactive
az graph query -q "where type =~ 'microsoft.compute/virtualmachines' and name matches regex @'^Contoso(.*)[0-9]+$' | project name | order by name asc"
```

```azurepowershell-interactive
Search-AzureRmGraph -Query "where type =~ 'microsoft.compute/virtualmachines' and name matches regex @'^Contoso(.*)[0-9]+$' | project name | order by name asc"
```

## Next steps

- See samples of [Starter queries](starter.md)
- Learn more about the [query language](../concepts/query-language.md)
- Learn to [explore resources](../concepts/explore-resources.md)