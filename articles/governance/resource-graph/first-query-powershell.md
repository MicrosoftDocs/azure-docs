---
title: Run your first Resource Graph query using Azure PowerShell
description: This article walks you through the steps to enable the Resource Graph module for Azure PowerShell and run your first query.
services: resource-graph
author: DCtheGeek
ms.author: dacoulte
ms.date: 09/18/2018
ms.topic: quickstart
ms.service: resource-graph
ms.custom: mvc
manager: carmonm
---
# Run your first Resource Graph query using Azure PowerShell

The first step to using Azure Resource Graph is to ensure the module for Azure PowerShell is
installed. This quickstart walks you through the process of adding the module to your Azure PowerShell
installation. You can use the module with Azure PowerShell installed locally or through the [Azure
Cloud Shell](https://shell.azure.com).

At the end of this process, you will have added the module to your Azure PowerShell installation of
choice and run your very first Resource Graph query.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

## Add the Resource Graph module

To enable Azure PowerShell to query Azure Resource Graph, the module must be added. This module
works wherever Azure PowerShell can be used, including [Cloud Shell](https://shell.azure.com) (both standalone and inside the portal), the [Azure PowerShell
Docker image](https://hub.docker.com/r/azuresdk/azure-powershell/), or locally installed.

1. Ensure Azure PowerShell 6.3.0 or higher is installed. If it is not yet installed, follow [these instructions](/powershell/azure/install-azurerm-ps).

1. Ensure PowerShellGet is installed. If it is not installed or updated, follow [these instructions](/powershell/gallery/installing-psget).

1. From an **administrative** PowerShell prompt, run the following command:

   ```azurepowershell-interactive
   # Install the Resource Graph module from PowerShell Gallery
   Install-Module AzureRm.ResourceGraph
   ```

1. Validate that the module has been imported and is the correct version (0.1.0):

   ```azurepowershell-interactive
   # Get a list of commands for the imported AzureRm.Graph module
   Get-Command -Module 'AzureRm.ResourceGraph' -CommandType 'Cmdlet'
   ```

## Run your first Resource Graph query

Now that the Azure PowerShell module has been added to your environment of choice, it is time to
try out a simple Resource Graph query. The query will return the first five Azure resources with
the **Name** and **Resource Type** of each resource.

1. Run your first Azure Resource Graph query using the `Search-AzureRmGraph` cmdlet:

   ```azurepowershell-interactive
   # Login first with Connect-AzureRmAccount if not using Cloud Shell

   # Run Azure Resource Graph query
   Search-AzureRmGraph -Query 'project name, type | limit 5'
   ```

   > [!NOTE]
   > As this query example does not provide a sort modifier such as `order by`, running this query multiple
   > times is likely to yield a different set of resources per request.

1. Update the query to `order by` the **Name** property:

   ```azurepowershell-interactive
   # Run Azure Resource Graph query with 'order by'
   Search-AzureRmGraph -Query 'project name, type | limit 5 | order by name asc'
   ```

  > [!NOTE]
  > Just as with the first query, running this query multiple times is likely to yield a different
  > set of resources per request. The order of the query commands is important. In this example, the
  > `order by` comes after the `limit`. This will first limit the query results and then order them.

1. Update the query to first `order by` the **Name** property and then `limit` to the top 5 results:

   ```azurepowershell-interactive
   # Run Azure Resource Graph query with `order by` first, then with `limit`
   Search-AzureRmGraph -Query 'project name, type | order by name asc | limit 5'
   ```

When the final query is run multiple times, assuming that nothing in your environment is changing,
the results returned will be consistent and as expected -- ordered by the **Name** property, but
still limited to the top 5 results.

## Clean-up

If you wish to remove the Resource Graph module from your Azure PowerShell environment, you can do
so by using the following command:

```azurepowershell-interactive
# Remove the Resource Graph module from the Azure PowerShell environment
Remove-Module -Name 'AzureRm.ResourceGraph'
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