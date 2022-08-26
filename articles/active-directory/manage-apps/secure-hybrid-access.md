---
title: Secure hybrid access
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

- [Secure hybrid access: Secure legacy apps with Azure Active Directory](#secure-hybrid-access-secure-legacy-apps-with-azure-active-directory)
  - [Secure hybrid access through Azure AD Application Proxy](#secure-hybrid-access-through-azure-ad-application-proxy)
  - [Secure hybrid access through Azure AD partner integrations](#secure-hybrid-access-through-azure-ad-partner-integrations)

You can bridge the gap and strengthen your security posture across all applications with Azure AD capabilities like [Azure AD Conditional Access](../conditional-access/overview.md) and [Azure AD Identity Protection](../identity-protection/overview-identity-protection.md). By having Azure AD as an Identity provider (IDP), you can use modern authentication and authorization methods like [single sign-on (SSO)](what-is-single-sign-on.md) and [multifactor authentication (MFA)](../authentication/concept-mfa-howitworks.md) to secure your on-premises legacy applications.

## Secure hybrid access through Azure AD Application Proxy

Using [Application Proxy](../app-proxy/what-is-application-proxy.md) you can provide [secure remote access](../app-proxy/application-proxy-add-on-premises-application.md) to your on-premises web applications. Your users don’t need to use a VPN. Users benefit by easily connecting to their applications from any device after a [SSO](../app-proxy/application-proxy-config-sso-how-to.md#how-to-configure-single-sign-on). Application Proxy provides remote access as a service and allows you to [easily publish your applications](../app-proxy/application-proxy-add-on-premises-application.md) to users outside the corporate network. It helps you scale your cloud access management without requiring you to modify your on-premises applications. [Plan an Azure AD Application Proxy](../app-proxy/application-proxy-deployment-plan.md) deployment as a next step.

## Secure hybrid access through Azure AD partner integrations

In addition to [Azure AD Application Proxy](../app-proxy/what-is-application-proxy.md), Microsoft partners with third-party providers to enable secure access to your on-premises applications and applications that use legacy authentication.

![Illustration of Secure Hybrid Access partner integrations and Application Proxy providing access to legacy and on-premises applications after authentication with Azure AD.](./media/secure-hybrid-access/secure-hybrid-access.png)

The following partners offer pre-built solutions to support **conditional access policies per application** and provide detailed guidance for integrating with Azure AD.

- [Akamai Enterprise Application Access](../saas-apps/akamai-tutorial.md)

- [Citrix Application Delivery Controller (ADC)](../saas-apps/citrix-netscaler-tutorial.md)

- [Datawiza Access Broker](../manage-apps/datawiza-with-azure-ad.md)

- [F5 BIG-IP APM (ADC)](../manage-apps/f5-aad-integration.md)

- [F5 BIG-IP APM VPN](../manage-apps/f5-aad-password-less-vpn.md)

- [Kemp](../saas-apps/kemp-tutorial.md)

- [Perimeter 81](../saas-apps/perimeter-81-tutorial.md)

- [Silverfort Authentication Platform](../manage-apps/silverfort-azure-ad-integration.md)

- [Strata](../saas-apps/maverics-identity-orchestrator-saml-connector-tutorial.md)

The following partners offer pre-built solutions and detailed guidance for integrating with Azure AD.

- [AWS](../saas-apps/aws-clientvpn-tutorial.md)

- [Check Point](../saas-apps/check-point-remote-access-vpn-tutorial.md)

- [Cisco AnyConnect](../saas-apps/cisco-anyconnect.md)

- [Cloudflare](../manage-apps/cloudflare-azure-ad-integration.md)

- [Fortinet](../saas-apps/fortigate-ssl-vpn-tutorial.md)

- [Palo Alto Networks Global Protect](../saas-apps/paloaltoadmin-tutorial.md)

- [Pulse Secure Pulse Connect Secure (PCS)](../saas-apps/pulse-secure-pcs-tutorial.md)

- [Pulse Secure Virtual Traffic Manager (VTM)](../saas-apps/pulse-secure-virtual-traffic-manager-tutorial.md)

- [Zscaler Private Access (ZPA)](../saas-apps/zscalerprivateaccess-tutorial.md)
