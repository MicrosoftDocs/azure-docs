---
title: How to configure MSI on an Azure VM using PowerShell
description: Step by step instructions for configuring a Managed Service Identity (MSI) on an Azure VM, using PowerShell.
services: active-directory
documentationcenter: 
author: daveba
manager: mtillman
editor: 

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 11/27/2017
ms.author: daveba
---

# Configure a VM Managed Service Identity (MSI) using PowerShell

[!INCLUDE[preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

Managed Service Identity (MSI) provides Azure services with an automatically managed identity in Azure Active Directory. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code. 

In this article, you learn how to enable and remove system and user assigned MSIs for an Azure VM, using PowerShell.

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../../includes/active-directory-msi-qs-configure-prereqs.md)]

Also, install [the latest version of Azure PowerShell](https://www.powershellgallery.com/packages/AzureRM) if you haven't already.

## System assigned MSI

In this section, you will learn how to enable and remove a system assigned MSI using Azure PowerShell

### Enable MSI during creation of an Azure VM

To create an MSI-enabled VM:

1. Refer to one of the following Azure VM Quickstarts, completing only the necessary sections ("Log in to Azure", "Create resource group", "Create networking group", "Create the VM"). 

   > [!IMPORTANT] 
   > When you get to the "Create the VM" section, make a slight modification to the [New-AzureRmVMConfig](/powershell/module/azurerm.compute/new-azurermvm) cmdlet syntax. Be sure to add a `-AssignIdentity "SystemAssigned"` parameter to provision the VM with an MSI, for example:
   >  
   > `$vmConfig = New-AzureRmVMConfig -VMName myVM -AssignIdentity "SystemAssigned" ...`

   - [Create a Windows virtual machine using PowerShell](../../virtual-machines/windows/quick-create-powershell.md)
   - [Create a Linux virtual machine using PowerShell](../../virtual-machines/linux/quick-create-powershell.md)



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

2. First retrieve the VM properties using the `Get-AzureRmVM` cmdlet. Then to enable MSI, use the `-AssignIdentity` switch on the [Update-AzureRmVM](/powershell/module/azurerm.compute/update-azurermvm) cmdlet:

   ```powershell
   $vm = Get-AzureRmVM -ResourceGroupName myResourceGroup -Name myVM
   Update-AzureRmVM -ResourceGroupName myResourceGroup -VM $vm -AssignIdentity "SystemAssigned"
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

## User assigned identity

In this section, you will learn how to enable and remove a user assigned identity from a VM using Azure PowerShell.

### Assign a user assigned identity to a VM during creation

To assign a user assigned identity to an Azure VM when creating the VM:

 1. Refer to one of the following Azure VM Quickstarts, completing only the necessary sections ("Log in to Azure", "Create resource group", "Create networking group", "Create the VM"). 

    
       When you get to the "Create the VM" section, make a slight modification to the [New-AzureRmVMConfig](/powershell/module/azurerm.compute/new-azurermvm) cmdlet syntax. Add the `-IdentityType UserAssigned` and `-IdentityID ` parameters to provision the VM with a user assigned identity.  Replace `<VM NAME>`,`<SUBSCRIPTION ID>`, `<RESROURCE GROUP>`, and `<MSI NAME>` with your own values.  For example:
       
       ```powershell 
       $vmConfig = New-AzureRmVMConfig -VMName <VM NAME> -IdentityType UserAssigned -IdentityID "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/<RESROURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<MSI NAME>..."
       ```

   - [Create a Windows virtual machine using PowerShell](../../virtual-machines/windows/quick-create-powershell.md)
   - [Create a Linux virtual machine using PowerShell](../../virtual-machines/linux/quick-create-powershell.md)

2. Add the MSI VM extension using the `-Type` parameter on the [Set-AzureRmVMExtension](/powershell/module/azurerm.compute/set-azurermvmextension) cmdlet. You can pass either "ManagedIdentityExtensionForWindows" or "ManagedIdentityExtensionForLinux", depending on the type of VM, and name it using the `-Name` parameter. The `-Settings` parameter specifies the port used by the OAuth token endpoint for token acquisition:
      > [!NOTE]
    > This step is only required if you are using the VM extension.  If you are using the IMDS endpoint, you can skip this step.  For more information on the IMDS endpoint see the [What is Managed Service Identity (MSI) for Azure resources?](overview.md)

   ```powershell
   $settings = @{ "port" = 50342 }
   Set-AzureRmVMExtension -ResourceGroupName myResourceGroup -Location WestUS -VMName myVM -Name "ManagedIdentityExtensionForWindows" -Type "ManagedIdentityExtensionForWindows" -Publisher "Microsoft.ManagedIdentity" -TypeHandlerVersion "1.0" -Settings $settings 
   ```


### Assign a user identity to an existing Azure VM

To assign a user assigned identity to an existing Azure VM:

1. Sign in to Azure using `Connect-AzureRmAccount`. Use an account that is associated with the Azure subscription that contains the VM. Also make sure your account belongs to a role that gives you write permissions on the VM, such as “Virtual Machine Contributor”:

   ```powershell
   Connect-AzureRmAccount
   ```

2. First retrieve the VM properties using the `Get-AzureRmVM` cmdlet. Then to assign a user assigned identity to the Azure VM, use the `-IdentityType` and `-IdentityID` switch on the [Update-AzureRmVM](/powershell/module/azurerm.compute/update-azurermvm) cmdlet. Replace `<VM NAME>`, `<SUBSCRIPTION ID>`, `<RESROURCE GROUP>`, and `<MSI NAME>` with your own values.

   ```powershell
   $vm = Get-AzureRmVM -ResourceGroupName <RESOURCE GROUP> -Name <VM NAME>
   Update-AzureRmVM -ResourceGroupName <RESOURCE GROUP> -VM $vm -IdentityType UserAssigned -IdentityID "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/<RESROURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<MSI NAME>"
   ```

3. Add the MSI VM extension using the `-Type` parameter on the [Set-AzureRmVMExtension](/powershell/module/azurerm.compute/set-azurermvmextension) cmdlet. You can pass either "ManagedIdentityExtensionForWindows" or "ManagedIdentityExtensionForLinux", depending on the type of VM, and name it using the `-Name` parameter. The `-Settings` parameter specifies the port used by the OAuth token endpoint for token acquisition. Specify the correct `-Location` parameter, matching the location of the existing VM.

   ```powershell
   $settings = @{ "port" = 50342 }
   Set-AzureRmVMExtension -ResourceGroupName myResourceGroup -Location WestUS -VMName myVM -Name "ManagedIdentityExtensionForWindows" -Type "ManagedIdentityExtensionForWindows" -Publisher "Microsoft.ManagedIdentity" -TypeHandlerVersion "1.0" -Settings $settings 
   ```

## Related content

- [Managed Service Identity overview](overview.md)
- For the full Azure VM creation Quickstarts, see:
  
  - [Create a Windows virtual machine with PowerShell](../../virtual-machines/windows/quick-create-powershell.md) 
  - [Create a Linux virtual machine with PowerShell](../../virtual-machines/linux/quick-create-powershell.md) 

Use the following comments section to provide feedback and help us refine and shape our content.
















