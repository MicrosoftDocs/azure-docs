---
ms.topic: include
ms.date: 11/02/2021
author: shsagir
ms.author: shsagir
ms.service: synapse-analytics
ms.subservice: data-explorer
---
## Clean up resources

When the Azure resources are no longer needed, clean up the resources you deployed by deleting the resource group. 

### Clean up resources using the Azure portal

Delete the resources in the Azure portal by following the steps in [clean up resources](../ingest-data/data-explorer-ingest-event-hub-portal.md#clean-up-resources).

### Clean up resources using PowerShell

If the Cloud Shell is still open, you don't need to copy/run the first line (Read-Host).

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter the same project name that you used in the last procedure"
$resourceGroupName = "${projectName}rg"

Remove-AzResourceGroup -ResourceGroupName $resourceGroupName

Write-Host "Press [ENTER] to continue ..."
```
