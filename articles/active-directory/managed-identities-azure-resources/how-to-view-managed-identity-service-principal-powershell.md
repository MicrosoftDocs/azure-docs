---
title: How to view the service principal of a managed identity using PowerShell
description: Step-by-step instructions for viewing the service principal of a managed identity using PowerShell.
services: active-directory
documentationcenter: ''
author: daveba
manager: mtillman
editor: ''

ms.service: active-directory
ms.component: msi
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 11/29/2018
ms.author: daveba
---

# View the service principal of a managed identity using PowerShell

Managed identities for Azure resources provides Azure services with an automatically managed identity in Azure Active Directory. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code. 

In this article, you learn how to view the service principal of a managed identity using PowerShell.

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](overview.md).
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/).
- Enable [system assigned identity on a virtual machine](/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm#system-assigned-managed-identity) or [application](/azure/app-service/app-service-managed-service-identity#adding-a-system-assigned-identity).
- If you choose to install and use PowerShell locally, this tutorial requires Azure PowerShell module version 5.7.0 or later. Run ` Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). 
- If you are running PowerShell locally, you also need to: 
    - Run `Login-AzureRmAccount` to create a connection with Azure.
    - Install the [latest version of PowerShellGet](/powershell/gallery/installing-psget#for-systems-with-powershell-50-or-newer-you-can-install-the-latest-powershellget).
    - Run `Install-Module -Name PowerShellGet -AllowPrerelease` to get the pre-release version of the `PowerShellGet` module (you may need to `Exit` out of the current PowerShell session after you run this command to install the `AzureRM.ManagedServiceIdentity` module).
    - Run `Install-Module -Name AzureRM.ManagedServiceIdentity -AllowPrerelease` to install the prerelease version of the `AzureRM.ManagedServiceIdentity` module to perform the user-assigned managed identity operations in this article.

## View the service principal

This procedure demonstrates how to view the service principal of a VM or application with system assigned identity enabled. Replace `<VM or application name>` with your own values.

```PowerShell
Get-AzureRmADServicePrincipal -DisplayName <VM or application name>
```




