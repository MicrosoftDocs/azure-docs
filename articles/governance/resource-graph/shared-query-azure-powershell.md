---
title: 'Quickstart: Create a shared query with Azure PowerShell'
description: In this quickstart, you follow the steps to create a Resource Graph shared query using Azure PowerShell.
ms.date: 11/09/2022
ms.topic: quickstart
ms.custom: devx-track-azurepowershell, mode-api
---
# Quickstart: Create a Resource Graph shared query using Azure PowerShell

This article describes how you can create an Azure Resource Graph shared query using the
[Az.ResourceGraph](/powershell/module/az.resourcegraph) PowerShell module.

## Prerequisites

- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

[!INCLUDE [azure-powershell-requirements-no-header.md](../../../includes/azure-powershell-requirements-no-header.md)]

  > [!IMPORTANT]
  > While the **Az.ResourceGraph** PowerShell module is in preview, you must install it separately
  > using the `Install-Module` cmdlet.

  ```azurepowershell-interactive
  Install-Module -Name Az.ResourceGraph -Scope CurrentUser -Repository PSGallery -Force
  ```

- If you have multiple Azure subscriptions, choose the appropriate subscription in which the
  resources should be billed. Select a specific subscription using the
  [Set-AzContext](/powershell/module/az.accounts/set-azcontext) cmdlet.

  ```azurepowershell-interactive
  Set-AzContext -SubscriptionId 00000000-0000-0000-0000-000000000000
  ```

## Create a Resource Graph shared query

With the **Az.ResourceGraph** PowerShell module added to your environment of choice, it's time to create
a Resource Graph shared query. The shared query is an Azure Resource Manager object that you can
grant permission to or run in Azure Resource Graph Explorer. The query summarizes the count of all
resources grouped by _location_.

1. Create a resource group with
   [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) to store the Azure
   Resource Graph shared query. This resource group is named `resource-graph-queries` and the
   location is `westus2`.

   ```azurepowershell-interactive
   # Login first with `Connect-AzAccount` if not using Cloud Shell

   # Create the resource group
   New-AzResourceGroup -Name resource-graph-queries -Location westus2
   ```

1. Create the Azure Resource Graph shared query using the **Az.ResourceGraph** PowerShell module and
   [New-AzResourceGraphQuery](/powershell/module/az.resourcegraph/new-azresourcegraphquery)
   cmdlet:

   ```azurepowershell-interactive
   # Create the Azure Resource Graph shared query
   $Params = @{
     Name = 'Summarize resources by location'
     ResourceGroupName = 'resource-graph-queries'
     Location = 'westus2'
     Description = 'This shared query summarizes resources by location for a pinnable map graphic.'
     Query = 'Resources | summarize count() by location'
   }
   New-AzResourceGraphQuery @Params
   ```

1. List the shared queries in the new resource group. The
   [Get-AzResourceGraphQuery](/powershell/module/az.resourcegraph/get-azresourcegraphquery)
   cmdlet returns an array of values.

   ```azurepowershell-interactive
   # List all the Azure Resource Graph shared queries in a resource group
   Get-AzResourceGraphQuery -ResourceGroupName resource-graph-queries
   ```

1. To get just a single shared query result, use `Get-AzResourceGraphQuery` with its `Name` parameter.

   ```azurepowershell-interactive
   # Show a specific Azure Resource Graph shared query
   Get-AzResourceGraphQuery -ResourceGroupName resource-graph-queries -Name 'Summarize resources by location'
   ```

## Clean up resources

If you wish to remove the Resource Graph shared query and resource group from your Azure
environment, you can do so by using the following commands:

- [Remove-AzResourceGraphQuery](/powershell/module/az.resourcegraph/remove-azresourcegraphquery)
- [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup)

```azurepowershell-interactive
# Delete the Azure Resource Graph shared query
Remove-AzResourceGraphQuery -ResourceGroupName resource-graph-queries -Name 'Summarize resources by location'

# Remove the resource group
# WARNING: This command deletes ALL resources you've added to this resource group
Remove-AzResourceGroup -Name resource-graph-queries
```

## Next steps

In this quickstart, you've created a Resource Graph shared query using Azure PowerShell. To learn
more about the Resource Graph language, continue to the query language details page.

> [!div class="nextstepaction"]
> [Get more information about the query language](./concepts/query-language.md)
