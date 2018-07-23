---
title: How to configure MSI on an Azure VMSS using PowerShell
description: Step by step instructions for configuring a system and user assigned identities on an Azure VMSS, using PowerShell.
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

# Configure a VMSS Managed Service Identity (MSI) using PowerShell

[!INCLUDE[preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

Managed Service Identity provides Azure services with an automatically managed identity in Azure Active Directory. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code. 

In this article, you learn how to perform the Managed Service Identity operations on a Virtual Machine Scale Set (VMSS), using PowerShell:
- Enable and disable the system assigned identity on an Azure VMSS
- Add and remove a user assigned identity on an Azure VMSS

## Prerequisites

- If you're unfamiliar with Managed Service Identity, check out the [overview section](overview.md). **Be sure to review the [difference between a system assigned and user assigned identity](overview.md#how-does-it-work)**.
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before continuing.
- To perform the management operations in this article, your account needs the following role assignments:
    - [Virtual Machine Contributor](/azure/role-based-access-control/built-in-roles#virtual-machine-contributor) to create a virtual machine scale set and enable and remove system assigned managed identity from a virtual machine scale set.
    - [Managed Identity Contributor](/azure/role-based-access-control/built-in-roles#managed-identity-contributor) role to create a user assigned identity.
    - [Managed Identity Operator](/azure/role-based-access-control/built-in-roles#managed-identity-operator) role to assign and remove a user assigned identity from and to a virtual machine scale set.
- Install [the latest version of Azure PowerShell](https://www.powershellgallery.com/packages/AzureRM) if you haven't already. 

## System assigned managed identity

In this section, you learn how to enable and remove a system assigned identity using Azure PowerShell.

### Enable system assigned identity during the creation of an Azure VMSS

To create a VMSS with the system assigned identity enabled:

1. Refer to *Example 1* in the [New-AzureRmVmssConfig](/powershell/module/azurerm.compute/new-azurermvmssconfig) cmdlet reference article to create a VMSS with a system assigned identity.  Add the parameter `-IdentityType SystemAssigned` to the `New-AzureRmVmssConfig` cmdlet:

    ```powershell
    $VMSS = New-AzureRmVmssConfig -Location $Loc -SkuCapacity 2 -SkuName "Standard_A0" -UpgradePolicyMode "Automatic" -NetworkInterfaceConfiguration $NetCfg -IdentityType SystemAssigned`
    ```

2. (Optional) Add the MSI VMSS extension using the `-Name` and `-Type` parameter on the [Add-AzureRmVmssExtension](/powershell/module/azurerm.compute/add-azurermvmssextension) cmdlet. You can pass either "ManagedIdentityExtensionForWindows" or "ManagedIdentityExtensionForLinux", depending on the type of VM, and name it using the `-Name` parameter. The `-Settings` parameter specifies the port used by the OAuth token endpoint for token acquisition:

    > [!NOTE]
    > This step is optional as you can use the Azure Instance Metadata Service (IMDS) identity endpoint, to retrieve tokens as well.

   ```powershell
   $setting = @{ "port" = 50342 }
   $vmss = Get-AzureRmVmss
   Add-AzureRmVmssExtension -VirtualMachineScaleSet $vmss -Name "ManagedIdentityExtensionForWindows" -Type "ManagedIdentityExtensionForWindows" -Publisher "Microsoft.ManagedIdentity" -TypeHandlerVersion "1.0" -Setting $settings 
   ```

## Enable system assigned identity on an existing Azure VMSS

If you need to enable a system assigned identity on an existing Azure VMSS:

1. Sign in to Azure using `Login-AzureRmAccount`. Use an account that is associated with the Azure subscription that contains the VM. Also make sure your account belongs to a role that gives you write permissions on the VM, such as “Virtual Machine Contributor”:

   ```powershell
   Login-AzureRmAccount
   ```

2. First retrieve the VMSS properties using the [`Get-AzureRmVmss`](/powershell/module/azurerm.compute/get-azurermvmss) cmdlet. Then to enable a system assigned identity, use the `-IdentityType` switch on the [Update-AzureRmVM](/powershell/module/azurerm.compute/update-azurermvm) cmdlet:

   ```powershell
   $vm = Get-AzureRmVmss -ResourceGroupName myResourceGroup -Name myVM
   Update-AzureRmVmss -ResourceGroupName myResourceGroup -Name -myVM -IdentityType "SystemAssigned"
   ```

3. Add the MSI VMSS extension using the `-Name` and `-Type` parameter on the [Add-AzureRmVmssExtension](/powershell/module/azurerm.compute/add-azurermvmssextension) cmdlet. You can pass either "ManagedIdentityExtensionForWindows" or "ManagedIdentityExtensionForLinux", depending on the type of VM, and name it using the `-Name` parameter. The `-Settings` parameter specifies the port used by the OAuth token endpoint for token acquisition:

   ```powershell
   $setting = @{ "port" = 50342 }
   $vmss = Get-AzureRmVmss
   Add-AzureRmVmssExtension -VirtualMachineScaleSet $vmss -Name "ManagedIdentityExtensionForWindows" -Type "ManagedIdentityExtensionForWindows" -Publisher "Microsoft.ManagedIdentity" -TypeHandlerVersion "1.0" -Setting $settings 
   ```

### Disable the system assigned identity from an Azure VMSS

> [!NOTE]
> Disabling Managed Service Identity from a Virtual Machine Scale Set is currently not supported. In the meantime, you can switch between using System Assigned and User Assigned Identities.

If you have a Virtual Machine Scale Set that no longer needs the system assigned identity but still needs user assigned identities, use the following cmdlet:

1. Sign in to Azure using `Login-AzureRmAccount`. Use an account that is associated with the Azure subscription that contains the VM. Also make sure your account belongs to a role that gives you write permissions on the VM, such as “Virtual Machine Contributor”:

2. Run the following cmdlet:

    ```powershell
    Update-AzureRmVmss -ResourceGroupName myResourceGroup -Name myVmss -IdentityType "UserAssigned"
    ```

## User assigned identity

In this section, you learn how to add and remove a user assigned identity from a VMSS using Azure PowerShell.

### Assign a user assigned identity during creation of an Azure VMSS

Creating a new VMSS with a user assigned identity isn't currently supported via PowerShell. See the next section on how to add a user assigned identity to an existing VMSS. Check back for updates.

### Assign a user identity to an existing Azure VMSS

To assign a user assigned identity to an existing Azure VMSS:

1. Sign in to Azure using `Connect-AzureRmAccount`. Use an account that is associated with the Azure subscription that contains the VM. Also make sure your account belongs to a role that gives you write permissions on the VM, such as “Virtual Machine Contributor”:

   ```powershell
   Connect-AzureRmAccount
   ```

2. First retrieve the VM properties using the `Get-AzureRmVM` cmdlet. Then to assign a user assigned identity to the Azure VMSS, use the `-IdentityType` and `-IdentityID` switch on the [Update-AzureRmVM](/powershell/module/azurerm.compute/update-azurermvm) cmdlet. Replace `<VM NAME>`, `<SUBSCRIPTION ID>`, `<RESROURCE GROUP>`, `<USER ASSIGNED ID1>`, `USER ASSIGNED ID2` with your own values.

   [!INCLUDE[ua-character-limit](~/includes/managed-identity-ua-character-limits.md)]


   ```powershell
   $vmss = Get-AzureRmVmss -ResourceGroupName <RESOURCE GROUP> -Name <VMSS NAME>
   Update-AzureRmVmss -ResourceGroupName <RESOURCE GROUP> -VM $vmss -IdentityType UserAssigned -IdentityID "<USER ASSIGNED ID1>","<USER ASSIGNED ID2>"
   ```

### Remove a user assigned identity from an Azure VMSS

> [!NOTE]
> Removing all user assigned identities from a Virtual Machine Scale Set is currently not supported, unless you have a system assigned identity. Check back for updates.

If your VMSS has multiple user assigned identities, you can remove all but the last one using the following commands. Be sure to replace the `<RESOURCE GROUP>` and `<VMSS NAME>` parameter values with your own values. The `<MSI NAME>` is the user assigned identity's name property, which should remain on the VMSS. This information can be found by in the identity section of the VMSS using `az vmss show`:

```powershell
$vmss = Get-AzureRmVmss -ResourceGroupName myResourceGroup -Name myVmss
$vmss.Identity.IdentityIds = "<MSI NAME>"
Update-AzureRmVmss -ResourceGroupName myResourceGroup -Name myVmss -VirtualMachineScaleSet $vmss
```

If your VMSS has both system assigned and user assigned identities, you can remove all the user assigned identities by switching to use only system assigned. Use the following command:

```powershell
$vmss = Get-AzureRmVmss -ResourceGroupName myResourceGroup -Name myVmss
$vmss.Identity.IdentityIds = $null
Update-AzureRmVmss -ResourceGroupName myResourceGroup -Name myVmss -VirtualMachine $vmss -IdentityType "SystemAssigned"
```

## Related content

- [Managed Service Identity overview](overview.md)
- For the full Azure VM creation Quickstarts, see:
  
  - [Create a Windows virtual machine with PowerShell](../../virtual-machines/windows/quick-create-powershell.md) 
  - [Create a Linux virtual machine with PowerShell](../../virtual-machines/linux/quick-create-powershell.md) 

















