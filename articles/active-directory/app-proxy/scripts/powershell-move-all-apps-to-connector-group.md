---
title: PowerShell sample - Move Azure Active Directory Application Proxy apps to another group
description: Azure Active Directory (Azure AD) Application Proxy PowerShell example used to move all applications currently assigned to a connector group to a different connector group.
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-proxy
ms.workload: identity
ms.custom:
ms.topic: sample
ms.date: 08/29/2022
ms.author: kenwith
ms.reviewer: ashishj
---

# Move all Azure Active Directory Application Proxy apps assigned to a connector group to another connector group

This PowerShell script example moves all Azure Active Directory (Azure AD) Application Proxy applications currently assigned to a connector group to a different connector group.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [updated-for-az](../../../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../../includes/cloud-shell-try-it.md)]

This sample requires the [AzureAD V2 PowerShell for Graph module](/powershell/azure/active-directory/install-adv2) (AzureAD) or the [AzureAD V2 PowerShell for Graph module preview version](/powershell/azure/active-directory/install-adv2?view=azureadps-2.0-preview&preserve-view=true) (AzureADPreview).

## Sample script

[!code-azurepowershell[main](~/powershell_scripts/application-proxy/move-all-apps-to-a-connector-group.ps1 "Move all apps assigned to a connector group to another connector group")]

## Script explanation

| Command | Notes |
|---|---|
|[Get-AzureADServicePrincipal](/powershell/module/azuread/get-azureadserviceprincipal) | Gets a service principal. |
|[Get-AzureADApplication](/powershell/module/azuread/get-azureadapplication) | Gets an Azure AD application. |
| [Get-AzureADApplicationProxyConnectorGroup](/powershell/module/azuread/get-azureadapplicationproxyconnectorgroup) | Retrieves a list of all connector groups, or if specified, details of the specified connector group. |
| [Set-AzureADApplicationProxyConnectorGroup](/powershell/module/azuread/set-azureadapplicationproxyapplicationconnectorgroup) | Assigns the given connector group to a specified application.|

## Next steps

For more information on the Azure AD PowerShell module, see [Azure AD PowerShell module overview](/powershell/azure/active-directory/overview).

For other PowerShell examples for Application Proxy, see [Azure AD PowerShell examples for Azure AD Application Proxy](../application-proxy-powershell-samples.md).
