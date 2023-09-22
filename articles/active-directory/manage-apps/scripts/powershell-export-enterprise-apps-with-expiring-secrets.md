---
title: PowerShell sample - Export enterprise apps with expiring secrets and certificates in Microsoft Entra tenant.
description: PowerShell example that exports all enterprise apps with expiring secrets and certificates for the specified enterprise apps in your Microsoft Entra tenant.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: sample
ms.date: 07/11/2023
ms.author: jomondi
ms.reviewer: mifarca
---

# Export enterprise apps with expiring secrets and certificates

This PowerShell script example exports all enterprise applications with secrets and certificates expiring in the next X days (and already expired if you choose so), with their owners for the specified enterprise apps from your directory in a CSV file.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

This sample requires the [Microsoft Graph PowerShell](/powershell/microsoftgraph/installation) SDK module.

## Sample script

[!code-azurepowershell[main](~/powershell_scripts/application-management/export-enterprise-apps-with-expiring-secrets.ps1 "Exports all apps with expiring secrets and certificates for the specified apps in your directory.")]

## Script explanation

The script can be used directly without any modifications. The admin will be asked about the expiration date and whether they would like to see already expired secrets or certificates or not.

The "Add-Member" command is responsible for creating the columns in the CSV file.
The "New-Object" command creates an object to be used for the columns in the CSV file export.
You can modify the "$Path" variable directly in PowerShell, with a CSV file path, in case you'd prefer the export to be non-interactive.

| Command | Notes |
|---|---|
| [Get-MgServicePrincipal](/powershell/module/microsoft.graph.applications/get-mgserviceprincipal?view=graph-powershell-1.0&preserve-view=true) | Retrieves an enterprise application from your directory. |
| [Get-MgServicePrincipalOwner](/powershell/module/microsoft.graph.applications/get-mgserviceprincipalowner?view=graph-powershell-1.0&preserve-view=true) | Retrieves the owners of an enterprise application from your directory. |

## Next steps

For more information on the Microsoft Graph PowerShell module, see [Microsoft Graph PowerShell module overview](/powershell/microsoftgraph/installation).

For other PowerShell examples for Application Management, see [Azure Microsoft Graph PowerShell examples for Application Management](../app-management-powershell-samples.md).
