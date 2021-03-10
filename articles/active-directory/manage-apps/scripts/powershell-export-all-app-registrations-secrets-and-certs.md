---
title: PowerShell sample - Export secrets and certificates for app registrations in Azure Active Directory tenant.
description: PowerShell example that exports all secrets and certificates for the specified app registrations in your Azure Active Directory tenant.
services: active-directory
author: kenwith
manager: daveba
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: sample
ms.date: 03/09/2021
ms.author: kenwith
ms.reviewer: mifarca
---

# Export secrets and certificates for app registrations

This PowerShell script example exports all secrets and certificates for the specified app registrations from your directory into a CSV file.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

This sample requires the [AzureAD V2 PowerShell for Graph module](/powershell/azure/active-directory/install-adv2) (AzureAD) or the [AzureAD V2 PowerShell for Graph module preview version](/powershell/azure/active-directory/install-adv2?view=azureadps-2.0-preview&preserve-view=true) (AzureADPreview).

## Sample script

[!code-azurepowershell[main](~/powershell_scripts/application-management/export-all-app-registrations-secrets-and-certs.ps1 "Exports all secrets and certificates for the specified app registrations in your directory.")]

## Script explanation

The "Add-Member" command is responsible for creating the columns in the CSV file.
You can modify the "$Path" variable directly in PowerShell, with a CSV file path, in case you'd prefer the export to be non-interactive.

| Command | Notes |
|---|---|
| [Get-AzureADApplication](/powershell/module/azuread/get-azureadapplication) | Retrieves an application from your directory. |
| [Get-AzureADApplicationOwner](/powershell/module/azuread/Get-AzureADApplicationOwner) | Retrieves the owners of an application from your directory. |

## Next steps

For more information on the Azure AD PowerShell module, see [Azure AD PowerShell module overview](/powershell/azure/active-directory/overview).

For other PowerShell examples for Application Management, see [Azure AD PowerShell examples for Application Management](../app-management-powershell-samples.md).
