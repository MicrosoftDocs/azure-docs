---
title: PowerShell sample - List users & groups for a Microsoft Entra application proxy app
description: PowerShell example that lists all the users and groups assigned to a specific Microsoft Entra application proxy application.
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-proxy
ms.workload: identity
ms.custom: has-azure-ad-ps-ref
ms.topic: sample
ms.date: 08/29/2022
ms.author: kenwith
ms.reviewer: ashishj
---

# Display users and groups assigned to an Application Proxy application

This PowerShell script example lists the users and groups assigned to a specific Microsoft Entra application proxy application.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [updated-for-az](../../../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../../includes/cloud-shell-try-it.md)]

This sample requires the [Azure Active Directory PowerShell 2.0 for Graph module](/powershell/azure/active-directory/install-adv2) or the [Azure Active Directory PowerShell 2.0 for Graph module preview version](/powershell/azure/active-directory/install-adv2?view=azureadps-2.0-preview&preserve-view=true) (AzureADPreview).

## Sample script

[!code-azurepowershell[main](~/powershell_scripts/application-proxy/display-users-group-of-an-app.ps1 "Display users and groups assigned to an Application Proxy application")]

## Script explanation

| Command | Notes |
|---|---|
| [Get-AzureADUser](/powershell/module/AzureAD/get-azureaduser)| Gets a user. |
| [Get-AzureADGroup](/powershell/module/AzureAD/get-azureadgroup)| Gets a group. |
| [Get-AzureADServicePrincipal](/powershell/module/azuread/get-azureadserviceprincipal) | Gets a service principal. |
| [Get-AzureADUserAppRoleAssignment](/powershell/module/AzureAD/get-azureaduserapproleassignment) | Get a user application role assignment. |
| [Get-AzureADGroupAppRoleAssignment](/powershell/module/AzureAD/get-azureadgroupapproleassignment) | Get a group application role assignment. |

## Next steps

For more information on the Azure AD PowerShell module, see [Azure AD PowerShell module overview](/powershell/azure/active-directory/overview).

For other PowerShell examples for Application Proxy, see [Azure AD PowerShell examples for Microsoft Entra application proxy](../application-proxy-powershell-samples.md).
