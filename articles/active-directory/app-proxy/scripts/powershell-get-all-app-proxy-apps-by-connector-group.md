---
title: List Azure Active Directory Application Proxy connector groups for apps
description: PowerShell example that lists all Azure Active Directory (Azure AD) Application Proxy Connector groups with the assigned applications.
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

# Get all Application Proxy apps and list by connector group

This PowerShell script example lists information about all Azure Active Directory (Azure AD) Application Proxy Connector groups with the assigned applications.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [updated-for-az](../../../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../../includes/cloud-shell-try-it.md)]

This sample requires the [AzureAD V2 PowerShell for Graph module](/powershell/azure/active-directory/install-adv2) (AzureAD) or the [AzureAD V2 PowerShell for Graph module preview version](/powershell/azure/active-directory/install-adv2?view=azureadps-2.0-preview&preserve-view=true) (AzureADPreview).

## Sample script

[!code-azurepowershell[main](~/powershell_scripts/application-proxy/get-all-appproxy-apps-by-connectorgroup.ps1 "Get all Application Proxy Connector groups with the assigned applications")]

## Script explanation

| Command | Notes |
|---|---|
|[Get-AzureADServicePrincipal](/powershell/module/azuread/get-azureadserviceprincipal) | Gets a service principal. |
|[Get-AzureADApplication](/powershell/module/azuread/get-azureadapplication) | Gets an Azure AD application. |
|[Get-AzureADApplicationProxyApplication](/powershell/module/azuread/get-azureadapplicationproxyapplication) | Retrieves an application configured for Application Proxy in Azure AD. |
| [Get-AzureADApplicationProxyConnectorGroup](/powershell/module/azuread/get-azureadapplicationproxyconnectorgroup) | Retrieves a list of all connector groups, or if specified, details of the specified connector group. |


## Next steps

For more information on the Azure AD PowerShell module, see [Azure AD PowerShell module overview](/powershell/azure/active-directory/overview).

For other PowerShell examples for Application Proxy, see [Azure AD PowerShell examples for Azure AD Application Proxy](../application-proxy-powershell-samples.md).
