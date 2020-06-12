---
title: Upgrade to Azure AD Application Proxy | Microsoft Docs
description: Choose which proxy solution is best if you're upgrading from Microsoft Forefront or Unified Access Gateway.
services: active-directory
documentationcenter: ''
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 05/17/2019
ms.author: kenwith
ms.reviewer: harshja
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Compare remote access solutions

Azure Active Directory Application Proxy is one of two remote access solutions that Microsoft offers. The other is Web Application Proxy, the on-premises version. These two solutions replace earlier products that Microsoft offered: Microsoft Forefront Threat Management Gateway (TMG) and Unified Access Gateway (UAG). Use this article to understand how these four solutions compare to each other. For those of you still using the deprecated TMG or UAG solutions, use this article to help plan your migration to one of the Application Proxy. 


## Feature comparison

Use this table to understand how Threat Management Gateway (TMG), Unified Access Gateway (UAG), Web Application Proxy (WAP), and Azure AD Application Proxy (AP) compare to each other.

| Feature | TMG | UAG | WAP | AP |
| ------- | --- | --- | --- | --- |
| Certificate authentication | Yes | Yes | - | - |
| Selectively publish browser apps | Yes | Yes | Yes | Yes |
| Preauthentication and single sign-on | Yes | Yes | Yes | Yes | 
| Layer 2/3 firewall | Yes | Yes | - | - |
| Forward proxy capabilities | Yes | - | - | - |
| VPN capabilities | Yes | Yes | - | - |
| Rich protocol support | - | Yes | Yes, if running over HTTP | Yes, if running over HTTP or through Remote Desktop Gateway |
| Serves as ADFS proxy server | - | Yes | Yes | - |
| One portal for application access | - | Yes | - | Yes |
| Response body link translation | Yes | Yes | - | Yes | 
| Authentication with headers | - | Yes | - | Yes, with PingAccess | 
| Cloud-scale security | - | - | - | Yes | 
| Conditional Access | - | Yes | - | Yes |
| No components in the demilitarized zone (DMZ) | - | - | - | Yes |
| No inbound connections | - | - | - | Yes |

For most scenarios, we recommend Azure AD Application Proxy as the modern solution. Web Application Proxy is only preferred in scenarios that require a proxy server for AD FS, and you can't use custom domains in Azure Active Directory. 

Azure AD Application Proxy offers unique benefits when compared to similar products, including:

- Extending Azure AD to on-premises resources
   - Cloud-scale security and protection
   - Features like Conditional Access and Multi-Factor Authentication are easy to enable
- No components in the demilitarized zone
- No inbound connections required
- One access panel that your users can go to for all their applications, including O365, Azure AD integrated SaaS apps, and your on-premises web apps. 


## Next steps

- [Use Azure AD Application to provide secure remote access to on-premises applications](application-proxy.md)
