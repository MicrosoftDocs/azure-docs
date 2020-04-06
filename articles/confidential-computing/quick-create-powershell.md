---
title: Quickstart - Create an Azure confidential computing virtual machine with Azure PowerShell
description: Get started with your deployments by learning how to quickly create a confidential computing virtual machine with Azure PowerShell.
author: JBCook
ms.service: virtual-machines
ms.subservice: workloads
ms.workload: infrastructure
ms.topic: quickstart
ms.date: 04/06/2020
ms.author: JenCook
---

# Quickstart: Create a confidential computing virtual machine with Azure PowerShell


A confidential computing virtual machine allows you to deploy and manage...

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]


## Create a confidential computing virtual machine
Add text here. 

## Deploy sample application
Add text here. 

## Allow traffic to application
Add text here. 

## Test your ACC virtual machine
Add text here.


## Clean up resources
When no longer needed, you can use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group and all related resources as follows. The `-Force` parameter confirms that you wish to delete the resources without an additional prompt to do so. The `-AsJob` parameter returns control to the prompt without waiting for the operation to complete.

```azurepowershell-interactive
Remove-AzResourceGroup -Name "myResourceGroup" -Force -AsJob
```

## Next steps
In this quickstart, you created a ...

> [!div class="nextstepaction"]
> [Create and manage Azure virtual machine scale sets]()
