---
title: How to configure managed identities for Azure resources on an Azure VM using PowerShell
description: Step by step instructions for configuring managed identities for Azure resources on an Azure VM using PowerShell.
services: active-directory
documentationcenter: 
author: daveba
manager: mtillman
editor: 

ms.service: active-directory
ms.component: msi
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 11/27/2017
ms.author: daveba
---

# Configure managed identities for Azure resources on an Azure VM using PowerShell

[!INCLUDE [preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

Managed identities for Azure resources provides Azure services with an automatically managed identity in Azure Active Directory. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code. 

In this article, using PowerShell, you learn how to perform the following managed identities for Azure resources operations on an Azure VM:

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](overview.md). **Be sure to review the [difference between a system-assigned and user-assigned managed identity](overview.md#how-does-it-work)**.
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before continuing.
- To perform the management operations in this article, your account needs the following Azure role based access control assignments:

    > [!NOTE]
    > No additional Azure AD directory role assignments required.

    - [Virtual Machine Contributor](/azure/role-based-access-control/built-in-roles#virtual-machine-contributor) to create a VM and enable and remove system and/or user-assigned managed identity from an Azure VM.
    - [Managed Identity Contributor](/azure/role-based-access-control/built-in-roles#managed-identity-contributor) role to create a user-assigned managed identity.
    - [Managed Identity Operator](/azure/role-based-access-control/built-in-roles#managed-identity-operator) role to assign and remove a user-assigned managed identity from and to a VM.
- Install [the latest version of Azure PowerShell](https://www.powershellgallery.com/packages/AzureRM) if you haven't already.

## System-assigned managed identity

In this section, you will learn how to enable and disable the system-assigned managed identity using Azure PowerShell.

### Enable system-assigned managed identity during creation of an Azure VM

To create an Azure VM with system-assigned managed identity enabled:

1. Refer to one of the following Azure VM Quickstarts, completing only the necessary sections ("Log in to Azure", "Create resource group", "Create networking group", "Create the VM").
    
    When you get to the "Create the VM" section, make a slight modification to the [New-AzureRmVMConfig](/powershell/module/azurerm.compute/new-azurermvm) cmdlet syntax. Be sure to add a `-AssignIdentity:$SystemAssigned` parameter to provision the VM with the system-assigned identity enabled, for example:
      
    ```powershell
    $vmConfig = New-AzureRmVMConfig -VMName myVM -AssignIdentity:$SystemAssigned ...
    ```

   - [Create a Windows virtual machine using PowerShell](../../virtual-machines/windows/quick-create-powershell.md)
   - [Create a Linux virtual machine using PowerShell](../../virtual-machines/linux/quick-create-powershell.md)

2. (Optional) Add the managed identities for Azure resources VM extension (planned for deprecation in January 2019) using the `-Type` parameter on the [Set-AzureRmVMExtension](/powershell/module/azurerm.compute/set-azurermvmextension) cmdlet. You can pass either "ManagedIdentityExtensionForWindows" or "ManagedIdentityExtensionForLinux", depending on the type of VM, and name it using the `-Name` parameter. The `-Settings` parameter specifies the port used by the OAuth token endpoint for token acquisition:

   ```powershell
   $settings = @{ "port" = 50342 }
   Set-AzureRmVMExtension -ResourceGroupName myResourceGroup -Location WestUS -VMName myVM -Name "ManagedIdentityExtensionForWindows" -Type "ManagedIdentityExtensionForWindows" -Publisher "Microsoft.ManagedIdentity" -TypeHandlerVersion "1.0" -Settings $settings 
   ```
    > [!NOTE]
    > This step is optional as you can use the Azure Instance Metadata Service (IMDS) identity endpoint, to retrieve tokens as well. The managed identities for Azure resources VM extension is planned for deprecation in January 2019. 

### Enable system-assigned managed identity on an existing Azure VM

If you need to enable a system-assigned managed identity on an existing Virtual Machine:

1. Sign in to Azure using `Login-AzureRmAccount`. Use an account that is associated with the Azure subscription that contains the VM.

   ```powershell
   Login-AzureRmAccount
   ```

2. First retrieve the VM properties using the `Get-AzureRmVM` cmdlet. Then to enable a system-assigned managed identity, use the `-AssignIdentity` switch on the [Update-AzureRmVM](/powershell/module/azurerm.compute/update-azurermvm) cmdlet:

   ```powershell
   $vm = Get-AzureRmVM -ResourceGroupName myResourceGroup -Name myVM
   Update-AzureRmVM -ResourceGroupName myResourceGroup -VM $vm -AssignIdentity:$SystemAssigned
   ```

3. (Optional) Add the managed identities for Azure resources VM extension (planned for deprecation in January 2019) using the `-Type` parameter on the [Set-AzureRmVMExtension](/powershell/module/azurerm.compute/set-azurermvmextension) cmdlet. You can pass either "ManagedIdentityExtensionForWindows" or "ManagedIdentityExtensionForLinux", depending on the type of VM, and name it using the `-Name` parameter. The `-Settings` parameter specifies the port used by the OAuth token endpoint for token acquisition. Be sure to specify the correct `-Location` parameter, matching the location of the existing VM:

   ```powershell
   $settings = @{ "port" = 50342 }
   Set-AzureRmVMExtension -ResourceGroupName myResourceGroup -Location WestUS -VMName myVM -Name "ManagedIdentityExtensionForWindows" -Type "ManagedIdentityExtensionForWindows" -Publisher "Microsoft.ManagedIdentity" -TypeHandlerVersion "1.0" -Settings $settings 
   ```
    > [!NOTE]
    > This step is optional as you can use the Azure Instance Metadata Service (IMDS) identity endpoint, to retrieve tokens as well.

## Disable system-assigned managed identity from an Azure VM

If you have a Virtual Machine that no longer needs the system-assigned managed identity but still needs user-assigned managed identities, use the following cmdlet:

1. Sign in to Azure using `Login-AzureRmAccount`. Use an account that is associated with the Azure subscription that contains the VM.

   ```powershell
   Login-AzureRmAccount
   ```

2. Retrieve the VM properties using the `Get-AzureRmVM` cmdlet and set the `-IdentityType` parameter to `UserAssigned`:

   ```powershell   
   $vm = Get-AzureRmVM -ResourceGroupName myResourceGroup -Name myVM	
   Update-AzureRmVm -ResourceGroupName myResourceGroup -VM $vm -IdentityType "UserAssigned"
   ```

If you have a virtual machine that no longer needs system-assigned managed identity and it has no user-assigned managed identities, use the following commands:

```powershell
$vm = Get-AzureRmVM -ResourceGroupName myResourceGroup -Name myVM
Update-AzureRmVm -ResourceGroupName myResourceGroup -VM $vm -IdentityType None
```

To remove the managed identities for Azure resources VM extension, user the -Name switch with the [Remove-AzureRmVMExtension](/powershell/module/azurerm.compute/remove-azurermvmextension) cmdlet, specifying the same name you used when you added the extension:

   ```powershell
   Remove-AzureRmVMExtension -ResourceGroupName myResourceGroup -Name "ManagedIdentityExtensionForWindows" -VMName myVM
   ```

## User-assigned managed identity

In this section, you learn how to add and remove a user-assigned managed identity from a VM using Azure PowerShell.

### Assign a user-assigned managed identity to a VM during creation

To assign a user-assigned managed identity to an Azure VM when creating the VM:

1. Refer to one of the following Azure VM Quickstarts, completing only the necessary sections ("Log in to Azure", "Create resource group", "Create networking group", "Create the VM"). 
  
    When you get to the "Create the VM" section, make a slight modification to the [`New-AzureRmVMConfig`](/powershell/module/azurerm.compute/new-azurermvm) cmdlet syntax. Add the `-IdentityType UserAssigned` and `-IdentityID ` parameters to provision the VM with a user-assigned identity.  Replace `<VM NAME>`,`<SUBSCRIPTION ID>`, `<RESROURCE GROUP>`, and `<USER ASSIGNED IDENTITY NAME>` with your own values.  For example:
    
    ```powershell 
    $vmConfig = New-AzureRmVMConfig -VMName <VM NAME> -IdentityType UserAssigned -IdentityID "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/<RESROURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<USER ASSIGNED IDENTITY NAME>..."
    ```
    
    - [Create a Windows virtual machine using PowerShell](../../virtual-machines/windows/quick-create-powershell.md)
    - [Create a Linux virtual machine using PowerShell](../../virtual-machines/linux/quick-create-powershell.md)

2. (Optional) Add the managed identity for Azure resources VM extension using the `-Type` parameter on the [Set-AzureRmVMExtension](/powershell/module/azurerm.compute/set-azurermvmextension) cmdlet. You can pass either "ManagedIdentityExtensionForWindows" or "ManagedIdentityExtensionForLinux", depending on the type of VM, and name it using the `-Name` parameter. The `-Settings` parameter specifies the port used by the OAuth token endpoint for token acquisition. Be sure to specify the correct `-Location` parameter, matching the location of the existing VM:
      > [!NOTE]
    > This step is optional as you can use the Azure Instance Metadata Service (IMDS) identity endpoint, to retrieve tokens as well. The managed identities for Azure resources VM extension is planned for deprecation in January 2019.

   ```powershell
   $settings = @{ "port" = 50342 }
   Set-AzureRmVMExtension -ResourceGroupName myResourceGroup -Location WestUS -VMName myVM -Name "ManagedIdentityExtensionForWindows" -Type "ManagedIdentityExtensionForWindows" -Publisher "Microsoft.ManagedIdentity" -TypeHandlerVersion "1.0" -Settings $settings 
   ```

### Assign a user-assigned managed identity to an existing Azure VM

To assign a user-assigned managed identity to an existing Azure VM:

1. Sign in to Azure using `Connect-AzureRmAccount`. Use an account that is associated with the Azure subscription that contains the VM.

   ```powershell
   Connect-AzureRmAccount
   ```

2. Create a user-assigned managed identity using the [New-AzureRmUserAssignedIdentity](/powershell/module/azurerm.managedserviceidentity/new-azurermuserassignedidentity) cmdlet.  Note the `Id` in the output because you will need this in the next step.

   > [!IMPORTANT]
   > Creating user-assigned managed identities only supports alphanumeric and hyphen (0-9 or a-z or A-Z or -) characters. Additionally, name should be limited to 24 character length for the assignment to VM/VMSS to work properly. Check back for updates. For more information see [FAQs and known issues](known-issues.md)

   ```powershell
   New-AzureRmUserAssignedIdentity -ResourceGroupName <RESOURCEGROUP> -Name <USER ASSIGNED IDENTITY NAME>
   ```
3. Retrieve the VM properties using the `Get-AzureRmVM` cmdlet. Then to assign a user-assigned managed identity to the Azure VM, use the `-IdentityType` and `-IdentityID` switch on the [Update-AzureRmVM](/powershell/module/azurerm.compute/update-azurermvm) cmdlet.  The value for the`-IdentityId` parameter is the `Id` you noted in the previous step.  Replace `<VM NAME>`, `<SUBSCRIPTION ID>`, `<RESROURCE GROUP>`, and `<USER ASSIGNED IDENTITY NAME>` with your own values.

   > [!WARNING]
   > To retain any previously user-assigned managed identities assigned to the VM, query the `Identity` property of the VM object (for example, `$vm.Identity`).  If any user assigned managed identities are returned, include them in the following command along with the new user assigned managed identity you would like to assign to the VM.

   ```powershell
   $vm = Get-AzureRmVM -ResourceGroupName <RESOURCE GROUP> -Name <VM NAME>
   Update-AzureRmVM -ResourceGroupName <RESOURCE GROUP> -VM $vm -IdentityType UserAssigned -IdentityID "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/<RESROURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<USER ASSIGNED IDENTITY NAME>"
   ```

4. Add the managed identity for Azure resources VM extension (planned for deprecation in January 2019) using the `-Type` parameter on the [Set-AzureRmVMExtension](/powershell/module/azurerm.compute/set-azurermvmextension) cmdlet. You can pass either "ManagedIdentityExtensionForWindows" or "ManagedIdentityExtensionForLinux", depending on the type of VM, and name it using the `-Name` parameter. The `-Settings` parameter specifies the port used by the OAuth token endpoint for token acquisition. Specify the correct `-Location` parameter, matching the location of the existing VM.

   ```powershell
   $settings = @{ "port" = 50342 }
   Set-AzureRmVMExtension -ResourceGroupName myResourceGroup -Location WestUS -VMName myVM -Name "ManagedIdentityExtensionForWindows" -Type "ManagedIdentityExtensionForWindows" -Publisher "Microsoft.ManagedIdentity" -TypeHandlerVersion "1.0" -Settings $settings 
   ```

### Remove a user-assigned managed identity from an Azure VM

If your VM has multiple user-assigned managed identities, you can remove all but the last one using the following commands. Be sure to replace the `<RESOURCE GROUP>` and `<VM NAME>` parameter values with your own values. The `<USER ASSIGNED IDENTITY NAME>` is the user-assigned managed identity's name property, which should remain on the VM. This information can be found by querying the `Identity` property of the VM object.  For example, `$vm.Identity`:

```powershell
$vm = Get-AzureRmVm -ResourceGroupName myResourceGroup -Name myVm
Update-AzureRmVm -ResourceGroupName myResourceGroup -VirtualMachine $vm -IdentityType UserAssigned -IdentityID <USER ASSIGNED IDENTITY NAME>
```
If your VM does not have a system-assigned managed identity and you want to remove all user-assigned managed identities from it, use the following command:

```powershell
$vm = Get-AzureRmVm -ResourceGroupName myResourceGroup -Name myVm
Update-AzureRmVm -ResourceGroupName myResourceGroup -VM $vm -IdentityType None
```
If your VM has both system-assigned and user-assigned managed identities, you can remove all the user-assigned managed identities by switching to use only system-assigned managed identities.

```powershell 
$vm = Get-AzureRmVm -ResourceGroupName myResourceGroup -Name myVm
Update-AzureRmVm -ResourceGroupName myResourceGroup -VirtualMachine $vm -IdentityType "SystemAssigned"
```

## Next steps

- [Managed identities for Azure resources overview](overview.md)
- For the full Azure VM creation Quickstarts, see:
  
  - [Create a Windows virtual machine with PowerShell](../../virtual-machines/windows/quick-create-powershell.md) 
  - [Create a Linux virtual machine with PowerShell](../../virtual-machines/linux/quick-create-powershell.md) 
