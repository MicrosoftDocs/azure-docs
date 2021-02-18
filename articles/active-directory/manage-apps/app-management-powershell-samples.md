---
title: PowerShell samples for Azure AD Application Management
description: Use these PowerShell samples for Azure AD Application Management to ...
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

# Azure AD PowerShell examples for Application Management

The following table includes links to PowerShell script examples for Azure AD Application Management. These samples require either the [AzureAD V2 PowerShell for Graph module](/powershell/azure/active-directory/install-adv2) or the [AzureAD V2 PowerShell for Graph module preview version](/powershell/azure/active-directory/install-adv2?view=azureadps-2.0-preview), unless otherwise noted.


For more information about the cmdlets used in these samples, see [Application Proxy Application Management](/powershell/module/azuread/#application_proxy_application_management) and [Application Proxy Connector Management](/powershell/module/azuread/#application_proxy_connector_management).

| Link | Description |
|---|---|
|**Application Proxy apps**||
| [List basic information for all Application Proxy apps](scripts/powershell-get-all-app-proxy-apps-basic.md) | Lists basic information (AppId, DisplayName, ObjId) about all the Application Proxy apps in your directory. |
| [List extended information for all Application Proxy apps](scripts/powershell-get-all-app-proxy-apps-extended.md) | Lists extended information  (AppId, DisplayName, ExternalUrl, InternalUrl, ExternalAuthenticationType) about all the Application Proxy apps in your directory.  |
| [List all Application Proxy apps by connector group](scripts/powershell-get-all-app-proxy-apps-by-connector-group.md) | Lists information about all the Application Proxy apps in your directory and which connector groups the apps are assigned to. |
| [Get all Application Proxy apps with a token lifetime policy](scripts/powershell-get-all-app-proxy-apps-with-policy.md) | Lists all Application Proxy apps in your directory with a token lifetime policy and its details. This sample requires the [AzureAD V2 PowerShell for Graph module preview version](/powershell/azure/active-directory/install-adv2?view=azureadps-2.0-preview). |
