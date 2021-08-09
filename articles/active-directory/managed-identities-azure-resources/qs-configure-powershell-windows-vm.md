---
title: Configure managed identities on an Azure VM using PowerShell - Azure AD
description: Step-by-step instructions for configuring managed identities for Azure resources on an Azure VM using PowerShell.
services: active-directory
documentationcenter:
author: barclayn
manager: daveba
editor:

ms.service: active-directory
ms.subservice: msi
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 08/19/2020
ms.author: barclayn
ms.collection: M365-identity-device-management 
ms.custom: devx-track-azurepowershell
---

# Configure managed identities for Azure resources on an Azure VM using PowerShell

[!INCLUDE [preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

Managed identities for Azure resources provide Azure services with an automatically managed identity in Azure Active Directory. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code.

In this article, using PowerShell, you learn how to perform the following managed identities for Azure resources operations on an Azure VM.

[!INCLUDE [az-powershell-update](../../../includes/updated-for-az.md)]

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](overview.md). **Be sure to review the [difference between a system-assigned and user-assigned managed identity](overview.md#managed-identity-types)**.
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before continuing.
- To run the example scripts, you have two options:
    - Use the [Azure Cloud Shell](../../cloud-shell/overview.md), which you can open using the **Try It** button on the top right corner of code blocks.
    - Run scripts locally by installing the latest version of [Azure PowerShell](/powershell/azure/install-az-ps), then sign in to Azure using `Connect-AzAccount`. 

## System-assigned managed identity

In this section, you will learn how to enable and disable the system-assigned managed identity using Azure PowerShell.

### Enable system-assigned managed identity during creation of an Azure VM

To create an Azure VM with the system-assigned managed identity enabled, your account needs the [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor) role assignment.  No additional Azure AD directory role assignments are required.

1. Refer to one of the following Azure VM Quickstarts, completing only the necessary sections ("Sign in to Azure", "Create resource group", "Create networking group", "Create the VM").

    When you get to the "Create the VM" section, make a slight modification to the [New-AzVMConfig](/powershell/module/az.compute/new-azvm) cmdlet syntax. Be sure to add a `-IdentityType SystemAssigned` parameter to provision the VM with the system-assigned identity enabled, for example:

    ```azurepowershell-interactive
    $vmConfig = New-AzVMConfig -VMName myVM -IdentityType SystemAssigned ...
    ```

   - [Create a Windows virtual machine using PowerShell](../../virtual-machines/windows/quick-create-powershell.md)
   - [Create a Linux virtual machine using PowerShell](../../virtual-machines/linux/quick-create-powershell.md)

### Enable system-assigned managed identity on an existing Azure VM

To enable system-assigned managed identity on a VM that was originally provisioned without it, your account needs the [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor) role assignment.  No additional Azure AD directory role assignments are required.

1. Retrieve the VM properties using the `Get-AzVM` cmdlet. Then to enable a system-assigned managed identity, use the `-IdentityType` switch on the [Update-AzVM](/powershell/module/az.compute/update-azvm) cmdlet:

   ```azurepowershell-interactive
   $vm = Get-AzVM -ResourceGroupName myResourceGroup -Name myVM
   Update-AzVM -ResourceGroupName myResourceGroup -VM $vm -IdentityType SystemAssigned
   ```

### Add VM system assigned identity to a group

After you have enabled system assigned identity on a VM, you can add it to a group.  The following procedure adds a VM's system assigned identity to a group.

1. Retrieve and note the `ObjectID` (as specified in the `Id` field of the returned values) of the VM's service principal:

   ```azurepowershell-interactive
   Get-AzADServicePrincipal -displayname "myVM"
   ```

1. Retrieve and note the `ObjectID` (as specified in the `Id` field of the returned values) of the group:

   ```azurepowershell-interactive
   Get-AzADGroup -searchstring "myGroup"
   ```

1. Add the VM's service principal to the group:

   ```azurepowershell-interactive
   Add-AzureADGroupMember -ObjectId "<objectID of group>" -RefObjectId "<object id of VM service principal>"
   ```

## Disable system-assigned managed identity from an Azure VM

To disable system-assigned managed identity on a VM, your account needs the [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor) role assignment.  No additional Azure AD directory role assignments are required.

If you have a Virtual Machine that no longer needs the system-assigned managed identity but still needs user-assigned managed identities, use the following cmdlet:

1. Retrieve the VM properties using the `Get-AzVM` cmdlet and set the `-IdentityType` parameter to `UserAssigned`:

   ```azurepowershell-interactive
   $vm = Get-AzVM -ResourceGroupName myResourceGroup -Name myVM
   Update-AzVm -ResourceGroupName myResourceGroup -VM $vm -IdentityType "UserAssigned"
   ```

If you have a virtual machine that no longer needs system-assigned managed identity and it has no user-assigned managed identities, use the following commands:

```azurepowershell-interactive
$vm = Get-AzVM -ResourceGroupName myResourceGroup -Name myVM
Update-AzVm -ResourceGroupName myResourceGroup -VM $vm -IdentityType None
```

## User-assigned managed identity

In this section, you learn how to add and remove a user-assigned managed identity from a VM using Azure PowerShell.

### Assign a user-assigned managed identity to a VM during creation

To assign a user-assigned identity to a VM, your account needs the [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor) and [Managed Identity Operator](../../role-based-access-control/built-in-roles.md#managed-identity-operator) role assignments. No additional Azure AD directory role assignments are required.

1. Refer to one of the following Azure VM Quickstarts, completing only the necessary sections ("Sign in to Azure", "Create resource group", "Create networking group", "Create the VM").

    When you get to the "Create the VM" section, make a slight modification to the [`New-AzVMConfig`](/powershell/module/az.compute/new-azvm) cmdlet syntax. Add the `-IdentityType UserAssigned` and `-IdentityID` parameters to provision the VM with a user-assigned identity.  Replace `<VM NAME>`,`<SUBSCRIPTION ID>`, `<RESROURCE GROUP>`, and `<USER ASSIGNED IDENTITY NAME>` with your own values.  For example:

    ```azurepowershell-interactive
    $vmConfig = New-AzVMConfig -VMName <VM NAME> -IdentityType UserAssigned -IdentityID "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/<RESROURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<USER ASSIGNED IDENTITY NAME>..."
    ```

    - [Create a Windows virtual machine using PowerShell](../../virtual-machines/windows/quick-create-powershell.md)
    - [Create a Linux virtual machine using PowerShell](../../virtual-machines/linux/quick-create-powershell.md)


### Assign a user-assigned managed identity to an existing Azure VM

To assign a user-assigned identity to a VM, your account needs the [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor) and [Managed Identity Operator](../../role-based-access-control/built-in-roles.md#managed-identity-operator) role assignments. No additional Azure AD directory role assignments are required.

1. Create a user-assigned managed identity using the [New-AzUserAssignedIdentity](/powershell/module/az.managedserviceidentity/new-azuserassignedidentity) cmdlet.  Note the `Id` in the output because you will need this in the next step.

   > [!IMPORTANT]
   > Creating user-assigned managed identities only supports alphanumeric, underscore and hyphen (0-9 or a-z or A-Z, \_ or -) characters. Additionally, name should be limited from 3 to 128 character length for the assignment to VM/VMSS to work properly. For more information see [FAQs and known issues](known-issues.md)

   ```azurepowershell-interactive
   New-AzUserAssignedIdentity -ResourceGroupName <RESOURCEGROUP> -Name <USER ASSIGNED IDENTITY NAME>
   ```
1. Retrieve the VM properties using the `Get-AzVM` cmdlet. Then to assign a user-assigned managed identity to the Azure VM, use the `-IdentityType` and `-IdentityID` switch on the [Update-AzVM](/powershell/module/az.compute/update-azvm) cmdlet.  The value for the`-IdentityId` parameter is the `Id` you noted in the previous step.  Replace `<VM NAME>`, `<SUBSCRIPTION ID>`, `<RESROURCE GROUP>`, and `<USER ASSIGNED IDENTITY NAME>` with your own values.

   > [!WARNING]
   > To retain any previously user-assigned managed identities assigned to the VM, query the `Identity` property of the VM object (for example, `$vm.Identity`).  If any user assigned managed identities are returned, include them in the following command along with the new user assigned managed identity you would like to assign to the VM.

   ```azurepowershell-interactive
   $vm = Get-AzVM -ResourceGroupName <RESOURCE GROUP> -Name <VM NAME>
   Update-AzVM -ResourceGroupName <RESOURCE GROUP> -VM $vm -IdentityType UserAssigned -IdentityID "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/<RESROURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<USER ASSIGNED IDENTITY NAME>"
   ```

### Remove a user-assigned managed identity from an Azure VM

To remove a user-assigned identity to a VM, your account needs the [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor) role assignment.

If your VM has multiple user-assigned managed identities, you can remove all but the last one using the following commands. Be sure to replace the `<RESOURCE GROUP>` and `<VM NAME>` parameter values with your own values. The `<USER ASSIGNED IDENTITY NAME>` is the user-assigned managed identity's name property, which should remain on the VM. This information can be found by querying the `Identity` property of the VM object.  For example, `$vm.Identity`:

```azurepowershell-interactive
$vm = Get-AzVm -ResourceGroupName myResourceGroup -Name myVm
Update-AzVm -ResourceGroupName myResourceGroup -VirtualMachine $vm -IdentityType UserAssigned -IdentityID <USER ASSIGNED IDENTITY NAME>
```
If your VM does not have a system-assigned managed identity and you want to remove all user-assigned managed identities from it, use the following command:

```azurepowershell-interactive
$vm = Get-AzVm -ResourceGroupName myResourceGroup -Name myVm
Update-AzVm -ResourceGroupName myResourceGroup -VM $vm -IdentityType None
```
If your VM has both system-assigned and user-assigned managed identities, you can remove all the user-assigned managed identities by switching to use only system-assigned managed identities.

```azurepowershell-interactive
$vm = Get-AzVm -ResourceGroupName myResourceGroup -Name myVm
Update-AzVm -ResourceGroupName myResourceGroup -VirtualMachine $vm -IdentityType "SystemAssigned"
```

## Next steps

- [Managed identities for Azure resources overview](overview.md)
- For the full Azure VM creation Quickstarts, see:

  - [Create a Windows virtual machine with PowerShell](../../virtual-machines/windows/quick-create-powershell.md)
  - [Create a Linux virtual machine with PowerShell](../../virtual-machines/linux/quick-create-powershell.md)
