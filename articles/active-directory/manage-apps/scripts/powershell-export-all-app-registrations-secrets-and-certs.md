---
title: PowerShell sample - Export app registrations, secrets, and certificates in Azure Active Directory tenant.
description: PowerShell example that exports all app registrations, secrets, and certificates for the specified apps in your Azure Active Directory tenant.
services: active-directory
author: kenwith
manager: daveba
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: sample
ms.date: 02/18/2021
ms.author: kenwith
ms.reviewer: mifarca
---

# Export app registrations, secrets, and certificates

This PowerShell script example exports all app registrations, secrets, and certificates for the specified apps in your directory.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

This sample requires the [AzureAD V2 PowerShell for Graph module](/powershell/azure/active-directory/install-adv2) (AzureAD) or the [AzureAD V2 PowerShell for Graph module preview version](/powershell/azure/active-directory/install-adv2?view=azureadps-2.0-preview&preserve-view=true) (AzureADPreview).

## Sample script

[!code-azurepowershell[main](~/powershell_scripts/application-management/export-all-app-registrations-secrets-and-certs.ps1 "Exports all app registrations, secrets, and certificates for the specified apps in your directory.")]

## Script explanation

| Command | Notes |
|---|---|
| [Get-AzureADApplication](/powershell/module/azuread/get-azureadapplication?view=azureadps-2.0&preserve-view=true) | Exports all app registrations, secrets, and certificates for the specified apps in your directory. |

## Next steps

For more information on the Azure AD PowerShell module, see [Azure AD PowerShell module overview](/powershell/azure/active-directory/overview).

For other PowerShell examples for Application Management, see [Azure AD PowerShell examples for Application Management](../app-management-powershell-samples.md).
