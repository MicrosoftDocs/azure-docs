---
author: lucygoldbergmicrosoft
ms.service: data-explorer
ms.topic: include
ms.date: 11/28/2019
ms.author: lugoldbe
---

## Clean up resources

When the Azure resources are no longer needed, clean up the resources you deployed by deleting the resource group. 

### Clean up resources using the Azure portal

Delete the resources in the Azure portal by following the steps in [clean up resources](../articles/data-explorer/create-cluster-database-portal.md#clean-up-resources).

### Clean up resources using PowerShell

If the Cloud Shell is still open, you don't need to copy/run the first line (Read-Host).

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter the same project name that you used in the last procedure"
$resourceGroupName = "${projectName}rg"

Remove-AzResourceGroup -ResourceGroupName $resourceGroupName

Write-Host "Press [ENTER] to continue ..."
```