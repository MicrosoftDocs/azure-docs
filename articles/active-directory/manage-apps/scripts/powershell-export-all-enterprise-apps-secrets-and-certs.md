---
title: PowerShell sample - Export secrets and certificates for enterprise apps in Azure Active Directory tenant.
description: PowerShell example that exports all secrets and certificates for the specified enterprise apps in your Azure Active Directory tenant.
services: active-directory
author: mtillman
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: sample
ms.date: 03/09/2021
ms.author: mtillman
ms.reviewer: mifarca
---

# Export secrets and certificates for enterprise apps
This PowerShell script example exports all secrets, certificates and owners for the specified enterprise apps from your directory into a CSV file.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

This sample requires the [AzureAD V2 PowerShell for Graph module](/powershell/azure/active-directory/install-adv2) (AzureAD) or the [AzureAD V2 PowerShell for Graph module preview version](/powershell/azure/active-directory/install-adv2?view=azureadps-2.0-preview&preserve-view=true) (AzureADPreview).

## Sample script

[!code-azurepowershell[main](~/powershell_scripts/application-management/export-all-enterprise-apps-secrets-and-certs.ps1 "Exports all secrets and certificates for the specified enterprise apps in your directory.")]

## Script explanation

The "Add-Member" command is responsible for creating the columns in the CSV file.
You can modify the "$Path" variable directly in PowerShell, with a CSV file path, in case you'd prefer the export to be non-interactive.

| Command | Notes |
|---|---|
| [Get-AzureADServicePrincipal](/powershell/module/azuread/Get-azureADServicePrincipal?view=azureadps-2.0&preserve-view=true) | Retrieves an enterprise application from your directory. |
| [Get-AzureADServicePrincipalOwner](/powershell/module/azuread/Get-AzureADServicePrincipalOwner?view=azureadps-2.0&preserve-view=true) | Retrieves the owners of an enterprise application from your directory. |


## Next steps

For more information on the Azure AD PowerShell module, see [Azure AD PowerShell module overview](/powershell/azure/active-directory/overview).

For other PowerShell examples for Application Management, see [Azure AD PowerShell examples for Application Management](../app-management-powershell-samples.md).
