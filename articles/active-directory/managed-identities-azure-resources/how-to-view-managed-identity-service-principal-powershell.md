---
title: View the service principal of a managed identity using PowerShell - Azure AD
description: Step-by-step instructions for viewing the service principal of a managed identity using PowerShell.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: daveba
editor: ''

ms.service: active-directory
ms.subservice: msi
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 11/29/2018
ms.author: markvi
ms.collection: M365-identity-device-management
---

# View the service principal of a managed identity using PowerShell

Managed identities for Azure resources provides Azure services with an automatically managed identity in Azure Active Directory. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code. 

In this article, you learn how to view the service principal of a managed identity using PowerShell.

[!INCLUDE [az-powershell-update](../../../includes/updated-for-az.md)]

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](overview.md).
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/).
- Enable [system assigned identity on a virtual machine](/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm#system-assigned-managed-identity) or [application](/azure/app-service/overview-managed-identity#add-a-system-assigned-identity).
- Install the latest version of [Azure PowerShell](/powershell/azure/install-az-ps)

## View the service principal

This following command demonstrates how to view the service principal of a VM or application with system assigned identity enabled. Replace `<VM or application name>` with your own values.

```powershell
Get-AzADServicePrincipal -DisplayName <VM or application name>
```

## Next steps

For more information on viewing Azure AD service principals using PowerShell, see [Get-AzADServicePrincipal](/powershell/module/az.resources/get-azadserviceprincipal).


