---
title: How to configure MSI on an Azure VM using PowerShell
description: Step by step instructions for configuring a Managed Service Identity (MSI) on an Azure VM, using PowerShell.
services: active-directory
documentationcenter: 
author: bryanla
manager: mbaldwin
editor: 

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/14/2017
ms.author: bryanla
---

# Configure a VM Managed Service Identity (MSI) using PowerShell

[!INCLUDE[preview-notice](../../includes/active-directory-msi-preview-notice.md)]

Managed Service Identity provides Azure services with an automatically managed identity in Azure Active Directory. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code. 

In this article, you learn how to enable and remove MSI for an Azure VM, using PowerShell.

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../includes/msi-qs-configure-prereqs.md)]

Also, install [Azure PowerShell version 4.3.1](https://www.powershellgallery.com/packages/AzureRM/4.3.1) if you haven't already.

## Enable MSI during creation of an Azure VM

To create an MSI-enabled VM:

1. Refer to one of the following Azure VM Quickstarts, completing only the necessary sections ("Log in to Azure", "Create resource group", "Create networking group", "Create the VM"). 

   > [!IMPORTANT] 
   > When you get to the "Create the VM" section, make a slight modification to the [New-AzureRmVMConfig](/powershell/module/azurerm.compute/new-azurermvm) cmdlet syntax. Be sure to add a `-IdentityType "SystemAssigned"` parameter to provision the VM with an MSI, for example:
   >  
   > `$vmConfig = New-AzureRmVMConfig -VMName myVM -IdentityType "SystemAssigned" ...`

   - [Create a Windows virtual machine using PowerShell](../virtual-machines/windows/quick-create-powershell.md)
   - [Create a Linux virtual machine using PowerShell](../virtual-machines/linux/quick-create-powershell.md)



2. Add the MSI VM extension using the `-Type` parameter on the [Set-AzureRmVMExtension](/powershell/module/azurerm.compute/set-azurermvmextension) cmdlet. You can pass either "ManagedIdentityExtensionForWindows" or "ManagedIdentityExtensionForLinux", depending on the type of VM, and name it using the `-Name` parameter. The `-Settings` parameter specifies the port used by the OAuth token endpoint for token acquisition:

   ```powershell
   $settings = @{ "port" = 50342 }
   Set-AzureRmVMExtension -ResourceGroupName myResourceGroup -Location WestUS -VMName myVM -Name "ManagedIdentityExtensionForWindows" -Type "ManagedIdentityExtensionForWindows" -Publisher "Microsoft.ManagedIdentity" -TypeHandlerVersion "1.0" -Settings $settings 
   ```

## Enable MSI on an existing Azure VM

If you need to enable MSI on an existing Virtual Machine:

1. Sign in to Azure using `Login-AzureRmAccount`. Use an account that is associated with the Azure subscription that contains the VM. Also make sure your account belongs to a role that gives you write permissions on the VM, such as “Virtual Machine Contributor”:

   ```powershell
   Login-AzureRmAccount
   ```

2. First retrieve the VM properties using the `Get-AzureRmVM` cmdlet. Then to enable MSI, use the `-IdentityType` switch on the [Update-AzureRmVM](/powershell/module/azurerm.compute/update-azurermvm) cmdlet:

   ```powershell
   $vm = Get-AzureRmVM -ResourceGroupName myResourceGroup -Name myVM
   Update-AzureRmVM -ResourceGroupName myResourceGroup -VM $vm -IdentityType "SystemAssigned"
   ```

3. Add the MSI VM extension using the `-Type` parameter on the [Set-AzureRmVMExtension](/powershell/module/azurerm.compute/set-azurermvmextension) cmdlet. You can pass either "ManagedIdentityExtensionForWindows" or "ManagedIdentityExtensionForLinux", depending on the type of VM, and name it using the `-Name` parameter. The `-Settings` parameter specifies the port used by the OAuth token endpoint for token acquisition. Be sure to specify the correct `-Location` parameter, matching the location of the existing VM:

   ```powershell
   $settings = @{ "port" = 50342 }
   Set-AzureRmVMExtension -ResourceGroupName myResourceGroup -Location WestUS -VMName myVM -Name "ManagedIdentityExtensionForWindows" -Type "ManagedIdentityExtensionForWindows" -Publisher "Microsoft.ManagedIdentity" -TypeHandlerVersion "1.0" -Settings $settings 
   ```

## Remove MSI from an Azure VM

If you have a Virtual Machine that no longer needs an MSI, you can use the `RemoveAzureRmVMExtension` cmdlet to remove MSI from the VM:

1. Sign in to Azure using `Login-AzureRmAccount`. Use an account that is associated with the Azure subscription that contains the VM. Also make sure your account belongs to a role that gives you write permissions on the VM, such as “Virtual Machine Contributor”:

   ```powershell
   Login-AzureRmAccount
   ```

2. Use the `-Name` switch with the [Remove-AzureRmVMExtension](/powershell/module/azurerm.compute/remove-azurermvmextension) cmdlet, specifying the same name you used when you added the extension:

   ```powershell
   Remove-AzureRmVMExtension -ResourceGroupName myResourceGroup -Name "ManagedIdentityExtensionForWindows" -VMName myVM
   ```

## Related content

- [Managed Service Identity overview](msi-overview.md)
- For the full Azure VM creation Quickstarts, see:
  
  - [Create a Windows virtual machine with PowerShell](../virtual-machines/windows/quick-create-powershell.md) 
  - [Create a Linux virtual machine with PowerShell](../virtual-machines/linux/quick-create-powershell.md) 

Use the following comments section to provide feedback and help us refine and shape our content.
















