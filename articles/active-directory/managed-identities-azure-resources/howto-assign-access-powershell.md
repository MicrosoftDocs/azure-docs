---
title: How to assign an MSI access to an Azure resource, using PowerShell
description: Step by step instructions for assigning an MSI on one resource, access to another resource, using PowerShell.
services: active-directory
documentationcenter: 
author: daveba
manager: mtillman
editor: 

ms.service: active-directory
ms.component: msi
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/14/2017
ms.author: daveba
---

# Assign a Managed Service Identity (MSI) access to a resource using PowerShell

[!INCLUDE [preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

Once you've configured an Azure resource with an MSI, you can give the MSI access to another resource, just like any security principal. This example shows you how to give an Azure virtual machine's MSI access to an Azure storage account, using PowerShell.

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../../includes/active-directory-msi-qs-configure-prereqs.md)]

Also, install [Azure PowerShell version 4.3.1](https://www.powershellgallery.com/packages/AzureRM/4.3.1) if you haven't already.

## Use RBAC to assign the MSI access to another resource

After you've enabled MSI on an Azure resource, [such as an Azure VM](qs-configure-powershell-windows-vm.md):

1. Sign in to Azure using the `Connect-AzureRmAccount` cmdlet. Use an account that is associated with the Azure subscription under which you have configured the MSI:

   ```powershell
   Connect-AzureRmAccount
   ```
2. In this example, we are giving an Azure VM access to a storage account. First we use [Get-AzureRMVM](/powershell/module/azurerm.compute/get-azurermvm) to get the service principal for the VM named "myVM", which was created when we enabled MSI. Then, we use [New-AzureRmRoleAssignment](/powershell/module/AzureRM.Resources/New-AzureRmRoleAssignment) to give the VM "Reader" access to a storage account called "myStorageAcct":

    ```powershell
    $spID = (Get-AzureRMVM -ResourceGroupName myRG -Name myVM).identity.principalid
    New-AzureRmRoleAssignment -ObjectId $spID -RoleDefinitionName "Reader" -Scope "/subscriptions/<mySubscriptionID>/resourceGroups/<myResourceGroup>/providers/Microsoft.Storage/storageAccounts/<myStorageAcct>"
    ```

## Troubleshooting

If the MSI for the resource does not show up in the list of available identities, verify that the MSI has been enabled correctly. In our case, we can go back to the Azure VM in the [Azure portal](https://portal.azure.com) and:

- Look at the "Configuration" page and ensure MSI enabled = "Yes."
- Look at the "Extensions" page and ensure the MSI extension deployed successfully.

If either is incorrect, you may need to redeploy the MSI on your resource again, or troubleshoot the deployment failure.

## Related content

- For an overview of MSI, see [Managed Service Identity overview](overview.md).
- To enable MSI on an Azure VM, see [Configure an Azure VM Managed Service Identity (MSI) using PowerShell](qs-configure-powershell-windows-vm.md).

Use the following comments section to provide feedback and help us refine and shape our content.

