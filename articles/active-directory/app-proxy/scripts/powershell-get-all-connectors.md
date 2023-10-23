---
title: PowerShell sample - List all Microsoft Entra application proxy connector groups
description: PowerShell example that lists all Microsoft Entra application proxy connector groups and connectors in your directory.
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

# Get all Application Proxy connector groups and connectors in the directory

This PowerShell script example lists all Microsoft Entra application proxy connector groups and connectors in your directory.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [updated-for-az](../../../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../../includes/cloud-shell-try-it.md)]

This sample requires the [Azure Active Directory PowerShell 2.0 for Graph module](/powershell/azure/active-directory/install-adv2) or the [Azure Active Directory PowerShell 2.0 for Graph module preview version](/powershell/azure/active-directory/install-adv2?view=azureadps-2.0-preview&preserve-view=true) (AzureADPreview).

## Sample script

[!code-azurepowershell[main](~/powershell_scripts/application-proxy/get-all-connectors.ps1 "Get all connector groups and connectors in the directory")]

## Script explanation

| Command | Notes |
|---|---|
| [Get-AzureADApplicationProxyConnectorGroup](/powershell/module/azuread/get-azureadapplicationproxyconnectorgroup) | Retrieves a list of all connector groups, or if specified, details of the specified connector group. |
| [Get-AzureADApplicationProxyConnectorGroupMembers](/powershell/module/azuread/get-azureadapplicationproxyconnectorgroupmembers) | Gets all Application Proxy connectors associated with each connector group.|

## Next steps

For more information on the Azure AD PowerShell module, see [Azure AD PowerShell module overview](/powershell/azure/active-directory/overview).

For other PowerShell examples for Application Proxy, see [Azure AD PowerShell examples for Microsoft Entra application proxy](../application-proxy-powershell-samples.md).
