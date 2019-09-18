---
title: PowerShell sample for Azure AD Application Proxy | Microsoft Docs
description: PowerShell example that lists all the users and groups assigned to a specific Azure AD Application Proxy application.
services: active-directory
author: msmimart
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: conceptual
ms.date: 09/17/2019
ms.author: mimart
ms.reviewer: japere
ms.collection: M365-identity-device-management
---

# Display users and groups assigned to an Application Proxy application

This PowerShell script example lists the users and groups assigned to a specific Azure Active Directory (Azure AD) Application Proxy application.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [updated-for-az](../../../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../../includes/cloud-shell-try-it.md)]

This sample requires the Azure AD PowerShell Module Version for Graph. If needed, install the module using the instructions found in [Azure Active Directory PowerShell for Graph](https://docs.microsoft.com/powershell/azure/active-directory/install-adv2?view=azureadps-2.0).

## Sample script

[!code-powershell[main](../../../powershell_scripts/application-proxy/display-users-group-of-an-app.ps1 "Display users and groups assigned to an Application Proxy application")]

## Script explanation

| Command | Notes |
|---|---|
| [Get-AzureADUser](https://docs.microsoft.com/powershell/module/AzureAD/Get-AzureADUser?view=azureadps-2.0)| Gets a user. |
| [Get-AzureADGroup](https://docs.microsoft.com/powershell/module/AzureAD/Get-AzureADGroup?view=azureadps-2.0)| Gets a group. |
| [Get-AzureADServicePrincipal](https://docs.microsoft.com/powershell/module/azuread/get-azureadserviceprincipal?view=azureadps-2.0) | Gets a service principal. |
| [Get-AzureADUserAppRoleAssignment](https://docs.microsoft.com/powershell/module/AzureAD/Get-AzureADUserAppRoleAssignment?view=azureadps-2.0) | Get a user application role assignment. |

# Next steps

For more information on the Azure AD PowerShell module, see [Azure AD PowerShell module overview](https://docs.microsoft.com/powershell/azure/active-directory/overview?view=azureadps-2.0).

For other PowerShell examples for Application Proxy, see [Azure AD PowerShell examples for Azure AD Application Proxy](../application-proxy-powershell-samples.md).