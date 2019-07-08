---
title: Run your first query using Azure PowerShell
description: This article walks you through the steps to enable the Resource Graph module for Azure PowerShell and run your first query.
author: DCtheGeek
ms.author: dacoulte
ms.date: 01/23/2019
ms.topic: quickstart
ms.service: resource-graph
manager: carmonm
ms.custom: seodec18
---
# Quickstart: Run your first Resource Graph query using Azure PowerShell

The first step to using Azure Resource Graph is to check that the module for Azure PowerShell is
installed. This quickstart walks you through the process of adding the module to your Azure
PowerShell installation.

At the end of this process, you'll have added the module to your Azure PowerShell installation of
choice and run your first Resource Graph query.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

[!INCLUDE [az-powershell-update](../../../includes/updated-for-az.md)]

## Add the Resource Graph module

To enable Azure PowerShell to query Azure Resource Graph, the module must be added. This module can
be used with locally installed PowerShell, with [Azure Cloud Shell](https://shell.azure.com), or
with the [Azure PowerShell Docker image](https://hub.docker.com/r/azuresdk/azure-powershell/).

### Base requirements

The Azure Resource Graph module requires the following software:

- Azure PowerShell 1.0.0 or higher. If it isn't yet installed, follow [these instructions](/powershell/azure/install-az-ps).

- PowerShellGet 2.0.1 or higher. If it isn't installed or updated, follow [these instructions](/powershell/gallery/installing-psget).

### Install the module

The Resource Graph module for PowerShell is **Az.ResourceGraph**.

1. From an **administrative** PowerShell prompt, run the following command:

   ```azurepowershell-interactive
   # Install the Resource Graph module from PowerShell Gallery
   Install-Module -Name Az.ResourceGraph
   ```

1. Validate that the module has been imported and is the correct version (0.7.1):

   ```azurepowershell-interactive
   # Get a list of commands for the imported Az.ResourceGraph module
   Get-Command -Module 'Az.ResourceGraph' -CommandType 'Cmdlet'
   ```

## Run your first Resource Graph query

With the Azure PowerShell module added to your environment of choice, it's time to try out a simple
Resource Graph query. The query will return the first five Azure resources with the **Name** and
**Resource Type** of each resource.

1. Run your first Azure Resource Graph query using the `Search-AzGraph` cmdlet:

   ```azurepowershell-interactive
   # Login first with Connect-AzAccount if not using Cloud Shell

   # Run Azure Resource Graph query
   Search-AzGraph -Query 'project name, type | limit 5'
   ```

   > [!NOTE]
   > As this query example does not provide a sort modifier such as `order by`, running this query multiple
   > times is likely to yield a different set of resources per request.

1. Update the query to `order by` the **Name** property:

   ```azurepowershell-interactive
   # Run Azure Resource Graph query with 'order by'
   Search-AzGraph -Query 'project name, type | limit 5 | order by name asc'
   ```

   > [!NOTE]
   > Just as with the first query, running this query multiple times is likely to yield a different
   > set of resources per request. The order of the query commands is important. In this example, the
   > `order by` comes after the `limit`. This will first limit the query results and then order them.

1. Update the query to first `order by` the **Name** property and then `limit` to the top five results:

   ```azurepowershell-interactive
   # Run Azure Resource Graph query with `order by` first, then with `limit`
   Search-AzGraph -Query 'project name, type | order by name asc | limit 5'
   ```

When the final query is run several times, assuming that nothing in your environment is changing,
the results returned will be consistent and as expected -- ordered by the **Name** property, but
still limited to the top five results.

> [!NOTE]
> If the query does not return results from a subscription you already have access to, then note that
> `Search-AzGraph` cmdlet defaults to subscriptions in the default context. To see the list of subscription ids
> which are part of the default context run this `(Get-AzContext).Account.ExtendedProperties.Subscriptions`
> If you wish to search across all the subscriptions you have access to, one can set the PSDefaultParameterValues for
> `Search-AzGraph` cmdlet by running 
> `$PSDefaultParameterValues=@{"Search-AzGraph:Subscription"= $(Get-AzSubscription).ID }`
   
## Clean up resources

If you wish to remove the Resource Graph module from your Azure PowerShell environment, you can do
so by using the following command:

```azurepowershell-interactive
# Remove the Resource Graph module from the Azure PowerShell environment
Remove-Module -Name 'Az.ResourceGraph'
```

> [!NOTE]
> This does not delete the module file downloaded earlier. It only removes it from the running
> PowerShell session.

## Next steps

- Get more information about the [query language](./concepts/query-language.md)
- Learn to [explore resources](./concepts/explore-resources.md)
- Run your first query with [Azure CLI](first-query-azurecli.md)
- See samples of [Starter queries](./samples/starter.md)
- See samples of [Advanced queries](./samples/advanced.md)
- Provide feedback on [UserVoice](https://feedback.azure.com/forums/915958-azure-governance)
