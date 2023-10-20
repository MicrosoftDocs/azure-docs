---
title: PowerShell sample - List all Microsoft Entra application proxy apps with a policy
description: PowerShell example that lists all Microsoft Entra application proxy applications in your directory that have a lifetime token policy.
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

# Get all Application Proxy apps with a token lifetime policy

This PowerShell script example lists all the Microsoft Entra application proxy applications in your directory that have a token lifetime policy and lists details about the policy.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [updated-for-az](../../../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../../includes/cloud-shell-try-it.md)]

This sample requires the [Azure Active Directory PowerShell 2.0 for Graph module preview version](/powershell/azure/active-directory/install-adv2?view=azureadps-2.0-preview&preserve-view=true) (AzureADPreview).

## Sample script

[!code-azurepowershell[main](~/powershell_scripts/application-proxy/get-all-appproxy-apps-with-policy.ps1 "Get all Application Proxy apps with a token lifetime policy")]

## Script explanation

| Command | Notes |
|---|---|
|[Get-AzureADServicePrincipal](/powershell/module/azuread/get-azureadserviceprincipal) | Gets a service principal. |
|[Get-AzureADApplication](/powershell/module/azuread/get-azureadapplication) | Gets a Microsoft Entra application. |
|[Get-AzureADPolicy](/powershell/module/azuread/get-azureadpolicy?view=azureadps-2.0-preview&preserve-view=true) | Gets a policy in Microsoft Entra ID. |
|[Get-AzureADServicePrincipalPolicy](/powershell/module/azuread/get-azureadserviceprincipalpolicy?view=azureadps-2.0-preview&preserve-view=true) | Gets the policy of a service principal in Microsoft Entra ID. |


## Next steps

For more information on the Azure AD PowerShell module, see [Azure AD PowerShell module overview](/powershell/azure/active-directory/overview).

For other PowerShell examples for Application Proxy, see [Azure AD PowerShell examples for Microsoft Entra application proxy](../application-proxy-powershell-samples.md).
