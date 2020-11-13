---
title: Azure AD secure hybrid access | Microsoft Docs
description: This article describes partner solutions for integrating your legacy on-premises, public cloud, or private cloud applications with Azure AD. Secure your legacy apps by connecting app delivery controllers or networks to Azure AD. 
services: active-directory
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 9/10/2020
ms.author: gasinh
ms.collection: M365-identity-device-management
---

# Secure hybrid access: Secure legacy apps with Azure Active Directory

You can now protect your on-premises and cloud legacy authentication applications by connecting them to Azure Active Directory (AD) with:

- [Azure AD Application Proxy](#secure-hybrid-access-sha-through-azure-ad-application-proxy)

- [Your existing application delivery controllers and networks](#sha-through-networking-and-delivery-controllers)

- [Virtual Private Network (VPN) and Software-Defined Perimeter (SDP) applications](#sha-through-vpn-and-sdp-applications)

You can bridge the gap and strengthen your security posture across all applications with Azure AD capabilities like Azure AD [Conditional Access](https://docs.microsoft.com/azure/active-directory/conditional-access/overview) and Azure AD [Identity Protection](https://docs.microsoft.com/azure/active-directory/identity-protection/overview-identity-protection).

## Secure hybrid access (SHA) through Azure AD Application Proxy
  
Using [Application Proxy](https://aka.ms/whyappproxy) you can provide [secure remote access](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy) to your on-premises web applications. Your users don’t require to use a VPN. Users benefit by easily connecting to their applications from any device after a [single sign-on](https://docs.microsoft.com/azure/active-directory/manage-apps/add-application-portal-setup-sso). Application Proxy provides remote access as a service and allows you to [easily publish your on-premise applications](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-add-on-premises-application) to users outside the corporate network. It helps you scale your cloud access management without requiring you to modify your on-premises applications. [Plan an Azure AD Application Proxy deployment](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-deployment-plan) as a next step.

## Azure AD partner integrations

### SHA through networking and delivery controllers

In addition to [Azure AD Application Proxy](https://aka.ms/whyappproxy), to enable you to use the [Zero Trust framework](https://www.microsoft.com/security/blog/2020/04/02/announcing-microsoft-zero-trust-assessment-tool/), Microsoft partners with third-party providers. You can use your existing networking and delivery controllers, and easily protect legacy applications that are critical to your business processes but that you couldn’t protect before with Azure AD. It’s likely you already have everything you need to start protecting these applications.

![Image shows secure hybrid access with networking partners and app proxy](./media/secure-hybrid-access/secure-hybrid-access.png)

The following networking vendors offer pre-built solutions and detailed guidance for integrating with Azure AD.

- [Akamai Enterprise Application Access (EAA)](https://docs.microsoft.com/azure/active-directory/saas-apps/akamai-tutorial)

- [Citrix Application Delivery Controller (ADC)](https://docs.microsoft.com/azure/active-directory/saas-apps/citrix-netscaler-tutorial)

- [F5 Big-IP APM](https://docs.microsoft.com/azure/active-directory/saas-apps/headerf5-tutorial)

- [Kemp](https://docs.microsoft.com/azure/active-directory/saas-apps/kemp-tutorial)

### SHA through VPN and SDP applications

Using VPN  and SDP solutions you can provide secure access to your enterprise network from any device, at any time, in any location while protecting your organization’s data. By having Azure AD as an Identity provider (IDP), you can use modern authentication and authorization methods like Azure AD [Single sign-on](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on) and [Multi-factor authentication](https://docs.microsoft.com/azure/active-directory/authentication/concept-mfa-howitworks) to secure your on-premises legacy applications.  

![Image shows secure hybrid access with VPN partners and app proxy ](./media/secure-hybrid-access/app-proxy-vpn.png)

The following VPN and SDP vendors offer pre-built solutions and detailed guidance for integrating with Azure AD.

• [Cisco AnyConnect](https://docs.microsoft.com/azure/active-directory/saas-apps/cisco-anyconnect)

• [Fortinet](https://docs.microsoft.com/azure/active-directory/saas-apps/fortigate-ssl-vpn-tutorial)

• [F5 Big-IP APM](https://aka.ms/f5-hybridaccessguide)

• [Palo Alto Networks Global Protect](https://docs.microsoft.com/azure/active-directory/saas-apps/paloaltoadmin-tutorial)

• [Zscaler Private Access (ZPA)](https://aka.ms/zscaler-hybridaccessguide)
