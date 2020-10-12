---
title: PowerShell - Create custom image from VHD file in Azure Lab Services
description: This PowerShell script creates a custom image from a VHD file in Azure Lab Services.    
ms.devlang: azurecli
ms.topic: sample
ms.date: 08/11/2020
---

# Use PowerShell to create a custom image from a VHD file in Azure Lab Services

This sample PowerShell script creates a custom image from a VHD file in Azure Lab Services

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh-az.md)]

## Prerequisites
* **A lab**. The script requires you to have an existing lab. 

## Sample script

[!code-powershell[main](../../../powershell_scripts/devtest-lab/create-custom-image-from-vhd/create-custom-image-from-vhd.ps1 "Add external user to a lab")]

## Script explanation

This script uses the following commands: 

| Command | Notes |
|---|---|
| [Get-AzResource](/powershell/module/az.resources/get-azresource) | Gets resources. |
| [Get-AzStorageAccountKey](/powershell/module/az.storage/get-azstorageaccountkey) | Gets the access keys for an Azure Storage account. |
| [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) | Adds an Azure deployment to a resource group. |

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/).

Additional Azure Lab Services PowerShell script samples can be found in the [Azure Lab Services PowerShell samples](../samples-powershell.md).
