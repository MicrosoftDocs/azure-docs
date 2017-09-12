---
title: How to assign an MSI access to an Azure resource, using PowerShell
description: Step by step instructions for assigning an MSI on one resource, access to another resource, using PowerShell.
services: active-directory
documentationcenter: ''
author: bryanla
manager: mbaldwin
editor: ''

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/14/2017
ms.author: bryanla
---

# How to assign a Managed Service Identity (MSI) access to a resource, using PowerShell

Once you've configured an Azure resource with an MSI, you can give the MSI access to another resource, just like any security principal. This example shows you how to give an Azure virtual machine's MSI access to an Azure storage account, using PowerShell.

## Use Role Based Access Control (RBAC) to assign the MSI access to another resource

After you've enabled MSI on an Azure resource, [such as an Azure VM](msi-qs-configure-powershell-windows-vm):

1. Sign in to Azure using the `Login-AzureRmAccount` cmdlet. Use an account that is associated with the Azure subscription under which you have configured the MSI:

   ```powershell
   Login-AzureRmAccount
   ```
2. In this example, we are giving an Azure VM access to a storage account. First we use [Get-AzureRMVM](/powershell/module/azurerm.compute/get-azurermvm) to get the service principal for the VM, which was created when we enabled MSI. Then, we use [New-AzureRmRoleAssignment](/powershell/module/AzureRM.Resources/New-AzureRmRoleAssignment) to give the VM "Reader" access to a storage account. 

    ```powershell
    (Get-AzureRMVM -ResourceGroupName myRG -Name windowsvm0).identity.principalid
    New-AzureRmRoleAssignment -ObjectId <from above cmd> -RoleDefinitionName Reader -Scope /subscriptions/<subscriptionID>/resourceGroups/myRG
    ```

## Troubleshooting

If the MSI for the resource does not show up in the list of available identities, verify that the MSI has been enabled correctly. In our case, we can go back to the Azure VM in the [Azure portal](https://portal.azure.com) and:

- look at the "Configuration" page and ensure MSI enabled = "Yes."
- look at the "Extensions" page and ensure the MSI extension deployed successfully.

If either is incorrect, you may need to redeploy the MSI on your resource again, or troubleshoot the deployment failure.

## Related content

- For an overview of MSI, see [Managed Service Identity overview](msi-overview.md).
- To enable MSI on an Azure VM, see [Configure an Azure VM Managed Service Identity (MSI) using PowerShell](msi-qs-configure-powershell-windows-vm.md).

Use the following comments section to provide feedback and help us refine and shape our content.

