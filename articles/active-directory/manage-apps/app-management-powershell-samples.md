---
title: PowerShell samples for Azure Active Directory Application Management
description: These PowerShell samples are used for apps you manage in your Azure Active Directory tenant. You can use these sample scripts to find expiration information about secrets and certificates.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: sample
ms.date: 02/18/2021
ms.author: davidmu
ms.reviewer: sureshja
---

# Azure Active Directory PowerShell examples for Application Management

The following table includes links to PowerShell script examples for Azure AD Application Management. These samples require either:

- The [AzureAD V2 PowerShell for Graph module](/powershell/azure/active-directory/install-adv2) or,
- The [AzureAD V2 PowerShell for Graph module preview version](/powershell/azure/active-directory/install-adv2?view=azureadps-2.0-preview&preserve-view=true), unless otherwise noted.

For more information about the cmdlets used in these samples, see [Applications](/powershell/module/azuread/#applications).

| Link | Description |
|---|---|
|**Application Management scripts**||
| [Export secrets and certs (app registrations)](scripts/powershell-export-all-app-registrations-secrets-and-certs.md) | Export secrets and certificates for app registrations in Azure Active Directory tenant. |
| [Export secrets and certs (enterprise apps)](scripts/powershell-export-all-enterprise-apps-secrets-and-certs.md) | Export secrets and certificates for enterprise apps in Azure Active Directory tenant. |
| [Export expiring secrets and certs](scripts/powershell-export-apps-with-expriring-secrets.md) | Export App Registrations with expiring secrets and certificates and their Owners in Azure Active Directory tenant. |
| [Export secrets and certs expiring beyond required date](scripts/powershell-export-apps-with-secrets-beyond-required.md) | Export App Registrations with secrets and certificates expiring beyond the required date in Azure Active Directory tenant. This uses the non interactive Client_Credentials Oauth flow. |
