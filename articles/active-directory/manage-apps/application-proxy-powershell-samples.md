---
title: PowerShell sample for Azure AD Application Proxy | Microsoft Docs
description: PowerShell samples for Azure AD Application Proxy
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

# Azure AD PowerShell examples for Azure AD Application Proxy

The following table includes links to PowerShell script examples for Azure AD Application Proxy. These samples require the Azure Active Directory PowerShell Module Version for Graph. If you need to install this module, see [Azure Active Directory PowerShell for Graph](https://docs.microsoft.com/powershell/azure/active-directory/install-adv2?view=azureadps-2.0).

For more information about the cmdlets used in these samples, see [Application Proxy Application Management](https://docs.microsoft.com/en-us/powershell/module/azuread/?view=azureadps-2.0#application_proxy_application_management) and [Application Proxy Connector Management](https://docs.microsoft.com/en-us/powershell/module/azuread/?view=azureadps-2.0#application_proxy_connector_management).

| | |
|---|---|
|**Application Proxy apps**||
| [Get all Application Proxy apps](scripts/powershell-get-info-about-app-proxy-apps.md) | Lists information about all the Application Proxy apps in your directory and which connector groups the apps are assigned to. |
| [Get all Application Proxy apps with a token lifetime policy](scripts/powershell-get-all-apps-with-a-policy.md) | Lists all the Application apps in your directory with a policy and its details. |
|**Connector groups**||
| [Get all connector groups and connectors in the directory](scripts/powershell-get-all-connector-groups-and-connectors.md) | Lists all the connector groups and connectors in your directory. |
| [Move all apps assigned to a connector group to another connector group](scripts/powershell-move-apps-to-another-connector-group.md) | Moves all applications currently assigned to a connector group to a different connector group. |
|**Users and group assigned**||
| [Display users and groups assigned to an Application Proxy application](scripts/powershell-display-users-and-groups-of-an-app.md) | Lists the users and groups assigned to a specific Application Proxy application. |
| [Assign users and groups to applications](scripts/powershell-assign-users-and-groups-to-apps.md) | Assigns specific users and groups to applications. |
|**External URL configuration**||
| [Get all Application Proxy apps using default domains (.msappproxy.net)](scripts/powershell-get-all-default-domain-apps.md)  | Lists all the Application Proxy applications using default domains (.msappproxy.net). |
| [Get all Application Proxy apps using wildcards](scripts/powershell-get-all-wildcards-apps.md) | Lists all Application Proxy apps using wildcards. |
|**Custom Domain configuration**||
| [Get all Application Proxy apps using custom domains and certificate information](scripts/powershell-get-all-custom-domains-apps.md) | Lists all Application Proxy apps that are using custom domains and the certificate information associated with the custom domains. |
| [Get all Azure AD Proxy application apps published with no certificate uploaded](scripts/powershell-get-all-custom-domains-with-no-cert.md) | Lists all Application Proxy apps that are using custom domains but don't have a valid SSL certificate uploaded. |
| [Get all Azure AD Proxy application apps published with the identical certificate and replace it](scripts/powershell-get-all-custom-domain-app-and-replace-cert.md) | Lists all the Azure AD Proxy application apps published with the identical certificate and allows you to replace the certificate in bulk with a new one. |
