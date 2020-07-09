---
title: Azure PowerShell Script Sample - Encrypt a Windows VM 
description: Azure PowerShell Script Sample - Encrypt a Windows VM 
services: virtual-machines-windows
documentationcenter: virtual-machines
author: cynthn
manager: gwallace

tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machines-windows

ms.topic: sample
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 12/12/2017
ms.author: cynthn
---

# Encrypt a Windows virtual machine with Azure PowerShell

This script creates a secure Azure Key Vault, encryption keys, Azure Active Directory service principal, and a Windows virtual machine (VM). The VM is then encrypted using the encryption key from Key Vault and service principal credentials.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

 

## Sample script

[!code-powershell[main](../../../powershell_scripts/virtual-machine/encrypt-vm/encrypt-windows-vm.ps1 "Encrypt VM disks")]

## Clean up deployment

Run the following command to remove the resource group, VM, and all related resources.

```powershell
Remove-AzResourceGroup -Name myResourceGroup
```

## Script explanation

This script uses the following commands to create the deployment. Each item in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzKeyVault](https://docs.microsoft.com/powershell/module/az.keyvault/new-azkeyvault) | Creates an Azure Key Vault to store secure data such as encryption keys. |
| [Add-AzKeyVaultKey](https://docs.microsoft.com/powershell/module/az.keyvault/add-azkeyvaultkey) | Creates an encryption key in Key Vault. |
| [New-AzADServicePrincipal](https://docs.microsoft.com/powershell/module/az.resources/new-azadserviceprincipal) | Creates an Azure Active Directory service principal to securely authenticate and control access to encryption keys. |
| [Set-AzKeyVaultAccessPolicy](https://docs.microsoft.com/powershell/module/az.keyvault/set-azkeyvaultaccesspolicy) | Sets permissions on the Key Vault to grant the service principal access to encryption keys. |
| [New-AzVM](https://docs.microsoft.com/powershell/module/az.compute/new-azvm) | Creates the virtual machine and connects it to the network card, virtual network, subnet, and network security group. This command also opens port 80 and sets the administrative credentials. |
| [Get-AzKeyVault](https://docs.microsoft.com/powershell/module/az.keyvault/get-azkeyvault) | Gets required information on the Key Vault |
| [Set-AzVMDiskEncryptionExtension](https://docs.microsoft.com/powershell/module/az.compute/set-azvmdiskencryptionextension) | Enables encryption on a VM using the service principal credentials and encryption key. |
| [Get-AzVmDiskEncryptionStatus](https://docs.microsoft.com/powershell/module/az.compute/get-azvmdiskencryptionstatus) | Shows the status of the VM encryption process. |
| [Remove-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/remove-azresourcegroup) | Removes a resource group and all resources contained within. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional virtual machine PowerShell script samples can be found in the [Azure Windows VM documentation](../windows/powershell-samples.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
