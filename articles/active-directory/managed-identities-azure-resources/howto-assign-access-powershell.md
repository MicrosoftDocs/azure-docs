---
title: Assign a managed identity access to a resource using PowerShell - Azure AD
description: Step-by-step instructions for assigning a managed identity on one resource, access to another resource, using PowerShell.
services: active-directory
documentationcenter: 
author: MarkusVi
manager: daveba
editor: 

ms.service: active-directory
ms.subservice: msi
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 12/06/2018
ms.author: markvi
ms.collection: M365-identity-device-management
---

# Assign a managed identity access to a resource using PowerShell

[!INCLUDE [preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

Once you've configured an Azure resource with a managed identity, you can give the managed identity access to another resource, just like any security principal. This example shows you how to give an Azure virtual machine's managed identity access to an Azure storage account using PowerShell.

[!INCLUDE [az-powershell-update](../../../includes/updated-for-az.md)]

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](overview.md). **Be sure to review the [difference between a system-assigned and user-assigned managed identity](overview.md#managed-identity-types)**.
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before continuing.
- Install [the latest version of Azure PowerShell](/powershell/azure/install-az-ps) if you haven't already.

## Use RBAC to assign a managed identity access to another resource

After you've enabled managed identity on an Azure resource, [such as an Azure VM](qs-configure-powershell-windows-vm.md):

1. Sign in to Azure using the `Connect-AzAccount` cmdlet. Use an account that is associated with the Azure subscription under which you have configured the managed identity:

   ```powershell
   Connect-AzAccount
   ```
2. In this example, we are giving an Azure VM access to a storage account. First we use [Get-AzVM](/powershell/module/az.compute/get-azvm) to get the service principal for the VM named `myVM`, which was created when we enabled managed identity. Then, use [New-AzRoleAssignment](/powershell/module/Az.Resources/New-AzRoleAssignment) to give the VM **Reader** access to a storage account called `myStorageAcct`:

    ```powershell
    $spID = (Get-AzVM -ResourceGroupName myRG -Name myVM).identity.principalid
    New-AzRoleAssignment -ObjectId $spID -RoleDefinitionName "Reader" -Scope "/subscriptions/<mySubscriptionID>/resourceGroups/<myResourceGroup>/providers/Microsoft.Storage/storageAccounts/<myStorageAcct>"
    ```

## Next steps

- [Managed identity for Azure resources overview](overview.md)
- To enable managed identity on an Azure VM, see [Configure managed identities for Azure resources on an Azure VM using PowerShell](qs-configure-powershell-windows-vm.md).
