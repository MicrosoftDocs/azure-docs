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
ms.date: 2/16/2021
ms.author: gasinh
ms.collection: M365-identity-device-management
---

# Secure hybrid access: Secure legacy apps with Azure Active Directory

You can now protect your on-premises and cloud legacy authentication applications by connecting them to Azure Active Directory (AD) with:

- [Azure AD Application Proxy](#secure-hybrid-access-sha-through-azure-ad-application-proxy)

- [Your existing application delivery controllers and networks](#sha-through-networking-and-delivery-controllers)

- [Virtual Private Network (VPN) and Software-Defined Perimeter (SDP) applications](#sha-through-vpn-and-sdp-applications)

You can bridge the gap and strengthen your security posture across all applications with Azure AD capabilities like Azure AD [Conditional Access](../conditional-access/overview.md) and Azure AD [Identity Protection](../identity-protection/overview-identity-protection.md).

## Secure hybrid access (SHA) through Azure AD Application Proxy
  
Using [Application Proxy](./what-is-application-proxy.md) you can provide [secure remote access](./application-proxy.md) to your on-premises web applications. Your users don’t require to use a VPN. Users benefit by easily connecting to their applications from any device after a [single sign-on](./add-application-portal-setup-sso.md). Application Proxy provides remote access as a service and allows you to [easily publish your on-premise applications](./application-proxy-add-on-premises-application.md) to users outside the corporate network. It helps you scale your cloud access management without requiring you to modify your on-premises applications. [Plan an Azure AD Application Proxy deployment](./application-proxy-deployment-plan.md) as a next step.

## Azure AD partner integrations

### SHA through networking and delivery controllers

In addition to [Azure AD Application Proxy](./what-is-application-proxy.md), to enable you to use the [Zero Trust framework](https://www.microsoft.com/security/blog/2020/04/02/announcing-microsoft-zero-trust-assessment-tool/), Microsoft partners with third-party providers. You can use your existing networking and delivery controllers, and easily protect legacy applications that are critical to your business processes but that you couldn’t protect before with Azure AD. It’s likely you already have everything you need to start protecting these applications.

![Image shows secure hybrid access with networking partners and app proxy](./media/secure-hybrid-access/secure-hybrid-access.png)

The following networking vendors offer pre-built solutions and detailed guidance for integrating with Azure AD.

- [Akamai Enterprise Application Access (EAA)](../saas-apps/akamai-tutorial.md)

- [Citrix Application Delivery Controller (ADC)](../saas-apps/citrix-netscaler-tutorial.md)

- [F5 Big-IP APM](./f5-aad-integration.md)

- [Kemp](../saas-apps/kemp-tutorial.md)

- [Pulse Secure Virtual Traffic Manager (VTM)](../saas-apps/pulse-secure-virtual-traffic-manager-tutorial.md)

### SHA through VPN and SDP applications

Using VPN  and SDP solutions you can provide secure access to your enterprise network from any device, at any time, in any location while protecting your organization’s data. By having Azure AD as an Identity provider (IDP), you can use modern authentication and authorization methods like Azure AD [Single sign-on](./what-is-single-sign-on.md) and [Multi-factor authentication](../authentication/concept-mfa-howitworks.md) to secure your on-premises legacy applications.  

![Image shows secure hybrid access with VPN partners and app proxy ](./media/secure-hybrid-access/app-proxy-vpn.png)

The following VPN vendors offer pre-built solutions and detailed guidance for integrating with Azure AD.

- [Cisco AnyConnect](../saas-apps/cisco-anyconnect.md)

- [Fortinet](../saas-apps/fortigate-ssl-vpn-tutorial.md)

- [F5 Big-IP APM](./f5-aad-password-less-vpn.md)

- [Palo Alto Networks Global Protect](../saas-apps/paloaltoadmin-tutorial.md)

- [Pulse Secure Pulse Connect Secure (PCS)](../saas-apps/pulse-secure-pcs-tutorial.md)

The following SDP vendors offer pre-built solutions and detailed guidance for integrating with Azure AD.

- [Datawiza Access Broker](./add-application-portal-setup-oidc-sso.md)

- [Perimeter 81](../saas-apps/perimeter-81-tutorial.md)


- [Silverfort Authentication Platform](./add-application-portal-setup-oidc-sso.md)

- [Strata](../saas-apps/maverics-identity-orchestrator-saml-connector-tutorial.md)

- [Zscaler Private Access (ZPA)](../saas-apps/zscalerprivateaccess-tutorial.md)
