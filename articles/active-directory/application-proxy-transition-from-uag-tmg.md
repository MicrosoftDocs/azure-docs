---
title: Transition to Azure AD application proxies from Microsoft Forefront | Microsoft Docs
description: Covers the basics about how to move from the Microsoft Forefront TMG and UAG solutions to Azure Active Directory application proxies.
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
ms.date: 04/17/2017
ms.author: kgremban
ROBOTS: NOINDEX
---
# Transition to Azure AD application proxies from Microsoft Forefront

This article describes how to move from the Microsoft Forefront Threat Management Gateway (TMG) and Unified Access Gateway (UAG) solutions to Azure AD Application Proxy.

For detailed information about the transition from Forefront TMG and UAG to Application Proxy, you can [read a related white paper from Microsoft](https://blogs.technet.microsoft.com/isablog/2015/06/30/modernizing-microsoft-application-access-with-web-application-proxy-and-azure-active-directory-application-proxy/).

## Functionality details for the conversion

|**TMG/UAG functionality**|**Web Application Proxy/Azure AD Application Proxy**|
|:-----|:-----|
|Selective HTTP publishing for browser apps|Available in Web Application Proxy in Windows Server 2012 R2. Available in Azure AD Application Proxy today.|
|Active Directory Federation Services (AD FS) integration|Available in Web Application Proxy in Windows Server 2012 R2. Available in Azure AD Application Proxy today.|
|Rich protocols publishing (for example, Citrix, Lync, RDG)|Available in Web Application Proxy in Windows Server 2012 R2. Available in Azure AD Application Proxy today.|
|Preauthentication for ActiveSync (HTTP Basic) and RDG|Currently not available in Web Application Proxy or Azure AD Application Proxy.|
|Portal|Use Intune or System Center for Web Application Proxy. Use Azure AD Access Panel or Office 365 App Launcher for Azure AD Application Proxy.|
|Endpoint health detection|Use Intune or System Center.|
|SSL tunneling|Use Windows SSL or VPN capability.|
|Layer 2/3 firewall|Use Windows Server capabilities.|
|Web application firewall|No current solution from Microsoft.|
|Secure web gateway (forward proxy)|No current solution from Microsoft.|


## Next steps

[Blog: Web Application Proxy](https://blogs.technet.microsoft.com/applicationproxyblog/tag/web-application-proxy)<br>
[Blog: Azure AD Application Proxy](https://blogs.technet.microsoft.com/applicationproxyblog/tag/aad-ap)
