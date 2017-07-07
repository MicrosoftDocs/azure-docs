---
title: Upgrade to Azure AD Application Proxy | Microsoft Docs
description: Choose which proxy solution is best if you're upgrading from Microsoft Forefront or Unified Access Gateway.
services: active-directory
documentationcenter: ''
author: kgremban
manager: femila

ms.assetid:
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/27/2017
ms.author: kgremban
---
# Upgrade to Azure AD proxies from Microsoft Forefront or Unified Access Gateway

This article describes how to move from the Microsoft Forefront Threat Management Gateway (TMG) and Unified Access Gateway (UAG) solutions to Azure AD Application Proxy.

For detailed information about the transition from Forefront TMG and UAG to Application Proxy, you can [read a related white paper from Microsoft](https://blogs.technet.microsoft.com/isablog/2015/06/30/modernizing-microsoft-application-access-with-web-application-proxy-and-azure-active-directory-application-proxy/).

## Functionality details for the conversion

|**TMG/UAG functionality**|**Modern solution**|
|:-----|:-----|
|Selective HTTP publishing for browser apps|Azure AD Application Proxy|
|Active Directory Federation Services (AD FS) integration|Azure AD Application Proxy|
|Rich protocols publishing (for example, Citrix, Lync, RDG)|Azure AD Application Proxy|
|Portal|Azure AD Access Panel or Office 365 App Launcher for Azure AD Application Proxy|
|Endpoint health detection|Intune or System Center|
|SSL tunneling|Windows SSL or VPN|
|Layer 2/3 firewall|Windows Server|
|Preauthentication for ActiveSync (HTTP Basic) and RDG|No current solution from Microsoft|
|Web application firewall|No current solution from Microsoft.|
|Secure web gateway (forward proxy)|No current solution from Microsoft.|


## Next steps

[Blog: Web Application Proxy](https://blogs.technet.microsoft.com/applicationproxyblog/tag/web-application-proxy)<br>
[Blog: Azure AD Application Proxy](https://blogs.technet.microsoft.com/applicationproxyblog/tag/aad-ap)
