---
title: PowerShell sample - Export apps with secrets and certificates expiring beyond the required date in Microsoft Entra tenant.
description: PowerShell example that exports all apps with secrets and certificates expiring beyond the required date for the specified apps in your Microsoft Entra tenant.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.custom: has-azure-ad-ps-ref
ms.topic: sample
ms.date: 07/12/2023
ms.author: jomondi
ms.reviewer: mifarca
---

# Export apps with secrets and certificates expiring beyond the required date

This PowerShell script example exports all app registrations secrets and certificates expiring beyond a required period for the specified apps from your directory in a CSV file non-interactively.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-azurepowershell[main](~/powershell_scripts/application-management/export-apps-with-secrets-beyond-required.ps1 "Exports all apps with secrets and certificates expiring beyond the required date for the specified apps in your directory.")]

## Script explanation

This script is working non-interactively. The admin using it will need to change the values in the "#PARAMETERS TO CHANGE" section with their own App ID, Application Secret, Tenant Name, the period for the apps credentials expiration and the Path where the CSV will be exported.
This script uses the [Client_Credential Oauth Flow](../../develop/v2-oauth2-client-creds-grant-flow.md)
The function "RefreshToken" will build the access token based on the values of the parameters modified by the admin.

The "Add-Member" command is responsible for creating the columns in the CSV file.

| Command | Notes |
|---|---|
| [Invoke-WebRequest](/powershell/module/microsoft.powershell.utility/invoke-webrequest) | Sends HTTP and HTTPS requests to a web page or web service. It parses the response and returns collections of links, images, and other significant HTML elements. |

## Next steps

For more information on the Azure AD PowerShell module, see [Azure AD PowerShell module overview](/powershell/azure/active-directory/overview).

For other PowerShell examples for Application Management, see [Azure AD PowerShell examples for Application Management](../app-management-powershell-samples.md).
