---
title: PowerShell samples for Microsoft Entra application proxy
description: Use these PowerShell samples for Microsoft Entra application proxy to get information about Application Proxy apps and connectors in your directory, assign users and groups to apps, and get certificate information.
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-proxy
ms.workload: identity
ms.topic: sample
ms.date: 09/14/2023
ms.author: kenwith
ms.reviewer: ashishj
---

# Microsoft Entra application proxy PowerShell examples

The following table includes links to PowerShell script examples for Microsoft Entra application proxy. These samples require either the [Microsoft Entra V2 PowerShell for Graph module](/powershell/azure/active-directory/install-adv2) or the [Microsoft Entra V2 PowerShell for Graph module preview version](/powershell/azure/active-directory/install-adv2?view=azureadps-2.0-preview&preserve-view=true), unless otherwise noted.


For more information about the cmdlets used in these samples, see [Application Proxy Application Management](/powershell/module/azuread/#application_proxy_application_management) and [Application Proxy Connector Management](/powershell/module/azuread/#application_proxy_connector_management).

| Link | Description |
|---|---|
|**Application Proxy apps**||
| [List basic information for all Application Proxy apps](scripts/powershell-get-all-app-proxy-apps-basic.md) | Lists basic information (AppId, DisplayName, ObjId) about all the Application Proxy apps in your directory. |
| [List extended information for all Application Proxy apps](scripts/powershell-get-all-app-proxy-apps-extended.md) | Lists extended information  (AppId, DisplayName, ExternalUrl, InternalUrl, ExternalAuthenticationType) about all the Application Proxy apps in your directory.  |
| [List all Application Proxy apps by connector group](scripts/powershell-get-all-app-proxy-apps-by-connector-group.md) | Lists information about all the Application Proxy apps in your directory and which connector groups the apps are assigned to. |
| [Get all Application Proxy apps with a token lifetime policy](scripts/powershell-get-all-app-proxy-apps-with-policy.md) | Lists all Application Proxy apps in your directory with a token lifetime policy and its details. This sample requires the [Microsoft Entra V2 PowerShell for Graph module preview version](/powershell/azure/active-directory/install-adv2?view=azureadps-2.0-preview&preserve-view=true). |
|**Connector groups**||
| [Get all connector groups and connectors in the directory](scripts/powershell-get-all-connectors.md) | Lists all the connector groups and connectors in your directory. |
| [Move all apps assigned to a connector group to another connector group](scripts/powershell-move-all-apps-to-connector-group.md) | Moves all applications currently assigned to a connector group to a different connector group. |
|**Users and group assigned**||
| [Display users and groups assigned to an Application Proxy application](scripts/powershell-display-users-group-of-app.md) | Lists the users and groups assigned to a specific Application Proxy application. |
| [Assign a user to an application](scripts/powershell-assign-user-to-app.md) | Assigns a specific user to an application. |
| [Assign a group to an application](scripts/powershell-assign-group-to-app.md) | Assigns a specific group to an application. |
|**External URL configuration**||
| [Get all Application Proxy apps using default domains (.msappproxy.net)](scripts/powershell-get-all-default-domain-apps.md)  | Lists all the Application Proxy applications using default domains (.msappproxy.net). |
| [Get all Application Proxy apps using wildcard publishing](scripts/powershell-get-all-wildcard-apps.md) | Lists all Application Proxy apps using wildcard publishing. |
|**Custom Domain configuration**||
| [Get all Application Proxy apps using custom domains and certificate information](scripts/powershell-get-all-custom-domains-and-certs.md) | Lists all Application Proxy apps that are using custom domains and the certificate information associated with the custom domains. |
| [Get all Microsoft Entra ID Proxy application apps published with no certificate uploaded](scripts/powershell-get-all-custom-domain-no-cert.md) | Lists all Application Proxy apps that are using custom domains but don't have a valid TLS/SSL certificate uploaded. |
| [Get all Microsoft Entra ID Proxy application apps published with the identical certificate](scripts/powershell-get-custom-domain-identical-cert.md) | Lists all the Microsoft Entra ID Proxy application apps published with the identical certificate. |
| [Get all Microsoft Entra ID Proxy application apps published with the identical certificate and replace it](scripts/powershell-get-custom-domain-replace-cert.md) | For Microsoft Entra ID Proxy application apps that are published with an identical certificate, allows you to replace the certificate in bulk. |
