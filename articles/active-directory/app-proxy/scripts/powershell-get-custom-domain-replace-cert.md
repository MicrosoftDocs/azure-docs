---
title: PowerShell sample - Replace certificate in Azure Active Directory Application Proxy apps
description: PowerShell example that bulk replaces a certificate across Azure Active Directory (Azure AD) Application Proxy applications.
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

# Get all Azure Active Directory Application Proxy applications published with the identical certificate and replace it

This PowerShell script example allows you to replace the certificate in bulk for all the Azure Active Directory (Azure AD) Application Proxy applications that are published with the identical certificate.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [updated-for-az](../../../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../../includes/cloud-shell-try-it.md)]

This sample requires the [AzureAD V2 PowerShell for Graph module](/powershell/azure/active-directory/install-adv2) (AzureAD) or the [AzureAD V2 PowerShell for Graph module preview version](/powershell/azure/active-directory/install-adv2?view=azureadps-2.0-preview&preserve-view=true) (AzureADPreview).

## Sample script

[!code-azurepowershell[main](~/powershell_scripts/application-proxy/get-custom-domain-replace-cert.ps1 "Get all Application Proxy applications published with the identical certificate and replace it")]

## Script explanation

| Command | Notes |
|---|---|
|[Get-AzureADServicePrincipal](/powershell/module/azuread/get-azureadserviceprincipal) | Gets a service principal. |
|[Get-AzureADApplication](/powershell/module/azuread/get-azureadapplication) | Gets an Azure AD application. |
|[Get-AzureADApplicationProxyApplication](/powershell/module/azuread/get-azureadapplicationproxyapplication) | Retrieves an application configured for Application Proxy in Azure AD. |
|[Set-AzureADApplicationProxyApplicationCustomDomainCertificate](/powershell/module/azuread/set-azureadapplicationproxyapplicationcustomdomaincertificate) | Assigns a certificate to an application configured for Application Proxy in Azure AD. This command uploads the certificate and allows the application to use Custom Domains. |

## Next steps

For more information on the Azure AD PowerShell module, see [Azure AD PowerShell module overview](/powershell/azure/active-directory/overview).

For other PowerShell examples for Application Proxy, see [Azure AD PowerShell examples for Azure AD Application Proxy](../application-proxy-powershell-samples.md).
