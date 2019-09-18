---
title: PowerShell sample for Azure AD Application Proxy | Microsoft Docs
description: PowerShell example that assigns specific users and groups to applications.
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

# Assign users and groups to applications

This PowerShell script example allows you to assign specific users and groups to applications.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [updated-for-az](../../../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../../includes/cloud-shell-try-it.md)]

This sample requires the Azure Active Directory (Azure AD) PowerShell Module Version for Graph. If needed, install the module using the instructions found in [Azure Active Directory PowerShell for Graph](https://docs.microsoft.com/powershell/azure/active-directory/install-adv2?view=azureadps-2.0).

## Sample script

[!code-powershell[main](../../../powershell_scripts/application-proxy/assign-user-groups-to-apps.ps1 "Assign users and groups to applications")]

## Script explanation

| Command | Notes |
|---|---|
| [New-AzureADUserAppRoleAssignment](https://docs.microsoft.com/powershell/module/AzureAD/New-AzureADUserAppRoleAssignment?view=azureadps-2.0) | Assigns a user to an application role. |

# Next steps

For more information on the Azure AD PowerShell module, see [Azure AD PowerShell module overview](https://docs.microsoft.com/powershell/azure/active-directory/overview?view=azureadps-2.0).

For other PowerShell examples for Application Proxy, see [Azure AD PowerShell examples for Azure AD Application Proxy](../application-proxy-powershell-samples.md).