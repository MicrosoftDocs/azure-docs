---
title: PowerShell sample for Azure AD Application Proxy | Microsoft Docs
description: PowerShell example that bulk replaces a certificate across Azure AD Application Proxy applications.
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

# Get all Application Proxy applications published with the identical certificate and replace it

This PowerShell script example lists all the Azure Active Directory (Azure AD) Application Proxy applications that are published with the identical certificate and allows you to replace the certificate in bulk with a new one.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [updated-for-az](../../../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../../includes/cloud-shell-try-it.md)]

This sample requires the Azure AD PowerShell Module Version for Graph. If needed, install the module using the instructions found in [Azure Active Directory PowerShell for Graph](https://docs.microsoft.com/powershell/azure/active-directory/install-adv2?view=azureadps-2.0).

## Sample script

[!code-powershell[main](../../../powershell_scripts/application-proxy/get-custom-domain-replace-cert.ps1 "Get all Application Proxy applications published with the identical certificate and replace it")]

## Script explanation

| Command | Notes |
|---|---|
|[Get-AzureADServicePrincipal](https://docs.microsoft.com/powershell/module/azuread/get-azureadserviceprincipal?view=azureadps-2.0) | Gets a service principal. |
|[Get-AzureADApplication](https://docs.microsoft.com/powershell/module/azuread/get-azureadserviceprincipal?view=azureadps-2.0) | Gets an Azure AD application. |
|[Get-AzureADApplicationProxyApplication](https://docs.microsoft.com/powershell/module/azuread/get-azureadapplicationproxyapplication?view=azureadps-2.0) | Retrieves an application configured for Application Proxy in Azure AD. |
|[Set-AzureADApplicationProxyApplicationCustomDomainCertificate](https://docs.microsoft.com/powershell/module/azuread/set-azureadapplicationproxyapplicationcustomdomaincertificate?view=azureadps-2.0) | Assigns a certificate to an application configured for Application Proxy in Azure AD. This command uploads the certificate and allows the application to use Custom Domains. |

# Next steps

For more information on the Azure AD PowerShell module, see [Azure AD PowerShell module overview](https://docs.microsoft.com/powershell/azure/active-directory/overview?view=azureadps-2.0).

For other PowerShell examples for Application Proxy, see [Azure AD PowerShell examples for Azure AD Application Proxy](../application-proxy-powershell-samples.md).