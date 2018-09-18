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

## Next steps

- See samples of [Starter queries](starter.md)
- Learn more about the [query language](../concepts/query-language.md)
- Learn to [explore resources](../concepts/explore-resources.md)