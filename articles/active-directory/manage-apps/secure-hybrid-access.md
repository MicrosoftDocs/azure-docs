---
title: Azure AD secure hybrid access | Microsoft Docs
description: This article describes partner solutions for integrating your legacy on-premises, public cloud, or private cloud applications with Azure AD. 
services: active-directory
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 8/17/2021
ms.author: gasinh
ms.collection: M365-identity-device-management
---

# Secure hybrid access: Secure legacy apps with Azure Active Directory

You can now protect your on-premises and cloud legacy authentication applications by connecting them to Azure Active Directory (AD) with:

- [Azure AD Application Proxy](#secure-hybrid-access-through-azure-ad-application-proxy)

- [Secure hybrid access partners](#secure-hybrid-access-through-azure-ad-partner-integrations)

You can bridge the gap and strengthen your security posture across all applications with Azure AD capabilities like [Azure AD Conditional Access](https://docs.microsoft.com/azure/active-directory/conditional-access/overview) and [Azure AD Identity Protection](https://docs.microsoft.com/azure/active-directory/identity-protection/overview-identity-protection). By having Azure AD as an Identity provider (IDP), you can use modern authentication and authorization methods like [single sign-on (SSO)](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on) and [multifactor authentication (MFA)](https://docs.microsoft.com/azure/active-directory/authentication/concept-mfa-howitworks) to secure your on-premises legacy applications.

## Secure hybrid access through Azure AD Application Proxy
  
Using [Application Proxy](https://docs.microsoft.com/azure/active-directory/app-proxy/what-is-application-proxy) you can provide [secure remote access](https://docs.microsoft.com/azure/active-directory/app-proxy/application-proxy-add-on-premises-application) to your on-premises web applications. Your users don’t need to use a VPN. Users benefit by easily connecting to their applications from any device after a [SSO](https://docs.microsoft.com/azure/active-directory/app-proxy/application-proxy-config-sso-how-to#how-to-configure-single-sign-on). Application Proxy provides remote access as a service and allows you to [easily publish your on-premise applications](https://docs.microsoft.com/azure/active-directory/app-proxy/application-proxy-add-on-premises-application) to users outside the corporate network. It helps you scale your cloud access management without requiring you to modify your on-premises applications. [Plan an Azure AD Application Proxy](https://docs.microsoft.com/azure/active-directory/app-proxy/application-proxy-deployment-plan) deployment as a next step.

## Secure hybrid access through Azure AD partner integrations  

In addition to [Azure AD Application Proxy](https://aka.ms/whyappproxy), Microsoft partners with third-party providers to enable secure access to your on-premises applications and applications that use legacy authentication.

![Image shows secure hybrid access with app proxy and partners](./media/secure-hybrid-access/secure-hybrid-access.png)

The following partners offer pre-built solutions to support conditional access policies per application and provide detailed guidance for integrating with Azure AD. 

- [Akamai Enterprise Application Access](https://docs.microsoft.com/azure/active-directory/saas-apps/akamai-tutorial)

- [Citrix Application Delivery Controller (ADC)](https://docs.microsoft.com/azure/active-directory/saas-apps/citrix-netscaler-tutorial)  

- [Datawiza Access Broker](datawiza-with-azure-ad.md)

- [F5 Big-IP APM ADC](https://docs.microsoft.com/azure/active-directory/manage-apps/f5-aad-integration)

- [F5 Big-IP APM VPN](https://docs.microsoft.com/azure/active-directory/manage-apps/f5-aad-password-less-vpn)

- [Kemp](https://docs.microsoft.com/azure/active-directory/saas-apps/kemp-tutorial)

- [Perimeter 81](https://docs.microsoft.com/azure/active-directory/saas-apps/perimeter-81-tutorial)

- [Silverfort Authentication Platform](https://docs.microsoft.com/azure/active-directory/manage-apps/add-application-portal-setup-oidc-sso)

- [Strata](https://docs.microsoft.com/azure/active-directory/saas-apps/maverics-identity-orchestrator-saml-connector-tutorial)

The following partners offer pre-built solutions and detailed guidance for integrating with Azure AD. 

- [Cisco AnyConnect](https://docs.microsoft.com/azure/active-directory/saas-apps/cisco-anyconnect)

- [Fortinet](https://docs.microsoft.com/azure/active-directory/saas-apps/fortigate-ssl-vpn-tutorial)

- [Palo Alto Networks Global Protect](https://docs.microsoft.com/azure/active-directory/saas-apps/paloaltoadmin-tutorial)

- [Pulse Secure Pulse Connect Secure (PCS)](https://docs.microsoft.com/azure/active-directory/saas-apps/pulse-secure-pcs-tutorial)

- [Pulse Secure Virtual Traffic Manager (VTM)](https://docs.microsoft.com/azure/active-directory/saas-apps/pulse-secure-virtual-traffic-manager-tutorial)

- [Zscaler Private Access (ZPA)](https://docs.microsoft.com/azure/active-directory/saas-apps/zscalerprivateaccess-tutorial)
