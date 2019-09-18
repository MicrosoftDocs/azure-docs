---
title: PowerShell sample for Azure AD Application Proxy | Microsoft Docs
description: PowerShell example that lists all Azure AD Application Proxy applications in your directory that have a lifetime token policy.
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

# Get all Application Proxy apps with a token lifetime policy

This PowerShell script example lists all the Azure Active Directory (Azure AD) Application Proxy applications in your directory that have a token lifetime policy and lists details about the policy.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [updated-for-az](../../../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../../includes/cloud-shell-try-it.md)]

This sample requires the Azure AD PowerShell Module Version for Graph. If needed, install the module using the instructions found in [Azure Active Directory PowerShell for Graph](https://docs.microsoft.com/powershell/azure/active-directory/install-adv2?view=azureadps-2.0).

## Sample script

[!code-powershell[main](../../../powershell_scripts/application-proxy/get-all-appproxy-apps-with-policy.ps1 "Get all Application Proxy apps with a token lifetime policy")]

## Script explanation

| Command | Notes |
|---|---|
|[Get-AzureADServicePrincipal](https://docs.microsoft.com/powershell/module/azuread/get-azureadserviceprincipal?view=azureadps-2.0) | Gets a service principal. |
|[Get-AzureADApplication](https://docs.microsoft.com/powershell/module/azuread/get-azureadserviceprincipal?view=azureadps-2.0) | Gets an Azure AD application. |
|[Get-AzureADPolicy](https://docs.microsoft.com/powershell/module/azuread/get-azureadpolicy?view=azureadps-2.0-preview) | Gets a policy in Azure AD. |


# Next steps

For more information on the Azure AD PowerShell module, see [Azure AD PowerShell module overview](https://docs.microsoft.com/powershell/azure/active-directory/overview?view=azureadps-2.0).

For other PowerShell examples for Application Proxy, see [Azure AD PowerShell examples for Azure AD Application Proxy](../application-proxy-powershell-samples.md).