---
title: PowerShell sample - Microsoft Entra application proxy apps with identical certs
description: PowerShell example that lists all Microsoft Entra application proxy applications that are published with the identical certificate.
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

# Get all Microsoft Entra application proxy apps that are published with the identical certificate

This PowerShell script example lists all Microsoft Entra application proxy applications that are published with the identical certificate.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [updated-for-az](../../../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../../includes/cloud-shell-try-it.md)]

This sample requires the [Azure Active Directory PowerShell 2.0 for Graph module](/powershell/azure/active-directory/install-adv2) or the [Azure Active Directory PowerShell 2.0 for Graph module preview version](/powershell/azure/active-directory/install-adv2?view=azureadps-2.0-preview&preserve-view=true) (AzureADPreview).

## Sample script

[!code-azurepowershell[main](~/powershell_scripts/application-proxy/get-custom-domain-identical-cert.ps1 "Get all Azure AD Proxy application apps published with the identical certificate")]

## Script explanation

| Command | Notes |
|---|---|
|[Get-AzureADServicePrincipal](/powershell/module/azuread/get-azureadserviceprincipal) | Gets a service principal. |
|[Get-AzureADApplication](/powershell/module/azuread/get-azureadapplication) | Gets a Microsoft Entra application. |
|[Get-AzureADApplicationProxyApplication](/powershell/module/azuread/get-azureadapplicationproxyapplication) | Retrieves an application configured for Application Proxy in Microsoft Entra ID. |

## Next steps

For more information on the Azure AD PowerShell module, see [Azure AD PowerShell module overview](/powershell/azure/active-directory/overview).

For other PowerShell examples for Application Proxy, see [Azure AD PowerShell examples for Microsoft Entra application proxy](../application-proxy-powershell-samples.md).
