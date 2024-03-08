---
title: Azure PowerShell Samples
description: Learn about Azure PowerShell scripts. These samples help you manage labs in Azure Lab Services.
ms.topic: sample
ms.custom: devx-track-azurepowershell, UpdateFrequency2
ms.author: rosemalcolm
author: RoseHJM
ms.date: 09/30/2023
---

# Azure PowerShell samples for Azure Lab Services

This article includes the sample Azure PowerShell scripts for Azure Lab Services.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

[!INCLUDE [sample-powershell-install](../../includes/sample-powershell-install-no-ssh.md)]

This article includes the following samples:

| Script | Description |
|------- |------------ |
| [Add an external user to a lab](#add-an-external-user-to-a-lab) | This PowerShell script adds an external user to a lab in Azure DevTest Labs. |
| [Add marketplace images to a lab](#add-a-marketplace-image-to-a-lab) | This PowerShell script adds marketplace images to a lab in Azure DevTest Labs. |
| [Create a custom image from a virtual hard drive (VHD)](#create-a-custom-image-from-a-vhd-file) | This PowerShell script creates a custom image in a lab in Azure DevTest Labs. |
| [Create a custom role in a lab](#create-a-custom-role-in-a-lab) | This PowerShell script creates a custom role in a lab in Azure Lab Services. |
| [Set allowed virtual machine sizes in a lab](#set-allowed-virtual-machine-sizes) | This PowerShell script sets allowed virtual machine sizes in a lab. |

## Prerequisites

All of these scripts have the following prerequisite:

- An existing lab. If you don't have one, follow this quickstart on how to [Create a lab in Azure portal](devtest-lab-create-lab.md).

## Add an external user to a lab

This sample PowerShell script adds an external user to a lab in Azure DevTest Labs.

:::code language="powershell" source="../../powershell_scripts/devtest-lab/add-external-user-to-lab/add-external-user-to-custom-lab.ps1":::

This script uses the following commands:

| Command | Notes |
|---|---|
| [Get-AzADUser](/powershell/module/az.resources/get-azaduser) | Retries the user object from Microsoft Entra ID. |
| [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment) | Assigns the specified role to the specified principal, at the specified scope. |

## Add a marketplace image to a lab

This sample PowerShell script adds a marketplace image to a lab in Azure DevTest Labs.

:::code language="powershell" source="../../powershell_scripts/devtest-lab/add-marketplace-images-to-lab/add-marketplace-images-to-lab.ps1":::

This script uses the following commands:

| Command | Notes |
|---|---|
| [Get-AzResource](/powershell/module/az.resources/get-azresource) | Gets resources. |
| [Set-AzResource](/powershell/module/az.resources/set-azresource) | Modifies a resource. |
| [New-AzResource](/powershell/module/az.resources/new-azresource) | Create a resource. |

## Create a custom image from a VHD file

This sample PowerShell script creates a custom image from a VHD file in Azure Lab Services.

:::code language="powershell" source="../../powershell_scripts/devtest-lab/create-custom-image-from-vhd/create-custom-image-from-vhd.ps1":::

This script uses the following commands:

| Command | Notes |
|---|---|
| [Get-AzResource](/powershell/module/az.resources/get-azresource) | Gets resources. |
| [Get-AzStorageAccountKey](/powershell/module/az.storage/get-azstorageaccountkey) | Gets the access keys for an Azure Storage account. |
| [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) | Adds an Azure deployment to a resource group. |

## Create a custom role in a lab

This sample PowerShell script creates a custom role to use in a lab in Azure DevTest Labs.

:::code language="powershell" source="../../powershell_scripts/devtest-lab/create-custom-role-in-lab/create-custom-role-in-lab.ps1":::

This script uses the following commands:

| Command | Notes |
|---|---|
| [Get-AzProviderOperation](/powershell/module/az.resources/get-azprovideroperation) | Gets the operations for an Azure resource provider that are securable using Azure role-based access control. |
| [Get-AzRoleDefinition](/powershell/module/az.resources/get-azroledefinition) | Lists all Azure roles that are available for assignment. |
| [New-AzRoleDefinition](/powershell/module/az.resources/new-azroledefinition) | Creates a custom role. |

## Set allowed virtual machine sizes

This sample PowerShell script sets allowed virtual machine sizes in Azure Lab Services.

:::code language="powershell" source="../../powershell_scripts/devtest-lab/set-allowed-vm-sizes-in-lab/set-allowed-vm-sizes-in-lab.ps1":::

| Command | Notes |
|---|---|
| [Get-AzResource](/powershell/module/az.resources/get-azresource) | Gets resources. |
| [Set-AzResource](/powershell/module/az.resources/set-azresource) | Modifies a resource. |
| [New-AzResource](/powershell/module/az.resources/new-azresource) | Create a resource. |

## Next steps

For more information on Azure PowerShell, see [Azure PowerShell documentation](/powershell/).
