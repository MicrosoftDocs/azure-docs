---
title: How to create and delete a user assigned Managed Service Identity using Azure Resource Manager
description: Step by step instructions on how to create and delete user assigned Managed Service Identity using Azure Resource.
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
ms.date: 04/16/2018
ms.author: daveba
---

# Create and delete a user assigned Managed Service Identity (MSI) using Azure Resource Manager

[!INCLUDE[preview-notice](~/includes/active-directory-msi-preview-notice-ua.md)]

Managed Service Identity provides Azure services with a managed identity in Azure Active Directory. You can use this identity to authenticate to services that support Azure AD authentication, without needing credentials in your code. 

In this article, you learn how to create and delete a user assigned MSI using Azure Resource Manager.

## Prerequisites

[!INCLUDE [msi-core-prereqs](~/includes/active-directory-msi-core-prereqs-ua.md)]

## Create a user assigned MSI 

To create a user assigned MSI, use the [New-AzureRmUserAssignedIdentity](/powershell/module/azurerm.managedserviceidentity/new-azurermuserassignedidentity) command. The `ResourceGroupName` parameter specifies the resource group where to create the MSI, and the `-Name` parameter specifies its name. Replace the `<RESOURCE GROUP>` and `<MSI NAME>` parameter values with your own values:

 ```azurpowershell-interactive
New-AzureRmUserAssignedIdentity -ResourceGroupName <RESOURCEGROUP> -Name <MSI NAME>
```
## List user assigned MSIs

To list managed service identities, use the [Get-AzureRmUserAssigned](/powershell/module/azurerm.managedserviceidentity/get-azurermuserassignedidentity) command.  The `-ResourceGroupName` parameter specifies the resource group where the MSI was created.  Replace the `<RESOURCE GROUP>` with your own value:

```azurepowershell-interactive
Get-AzureRmUserAssignedIdentity -ResourceGroupName PSRG
 <RESOURCE GROUP>
```
In the response, user assigned identities have `"Microsoft.ManagedIdentity/userAssignedIdentities"` value returned for key, `Type`.

`Type :Microsoft.ManagedIdentity/userAssignedIdentities`

## Delete a user assigned MSI

To delete a user assigned MSI, use the [Remove-AzureRmUserAssignedIdentity](/powershell/module/azurerm.managedserviceidentity/remove-azurermuserassignedidentity) command.  The `-ResourceGroupName` parameter specifies the resource group where the MSI was created and the `-Name` parameter specifies its name.  Replace the `<RESOURCE GROUP>` and the `<MSI NAME>` parameters values with your own values:

 ```azurecli-interactive
Remove-AzurRmUserAssignedIdentity -ResourceGroupName <RESOURCE GROUP> -Name <MSI NAME>
```

## Related content

For a full list and more details of the Azure PowerShell MSI commands, see [AzureRM.ManagedServiceIdentity](/powershell/module/azurerm.managedserviceidentity#managed_service_identity).


 
