---
title: Secure hybrid access, protect legacy apps with Azure Active Directory
description: Find partner solutions to integrate your legacy on-premises, public cloud, or private cloud applications with Azure AD.
services: active-directory
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 01/17/2023
ms.author: gasinh
ms.collection: M365-identity-device-management
---
# Secure hybrid access: Protect legacy apps with Azure Active Directory

In this article, learn to protect your on-premises and cloud legacy authentication applications by connecting them to Azure Active Directory (Azure AD).

* **Application Proxy**:
  * Protect users, apps, and data in the cloud and on-premises 
  * Use it to publish on-premises web applications externally
  * [Remote access to on-premises applications through Azure AD Application Proxy](../app-proxy/application-proxy.md)
* **Secure hybrid access through Azure AD partner integrations**:
  * Pre-built solutions
  * Conditional Access policies per application
  * [What is Conditional Access?](../conditional-access/overview.md)
  * Azure AD integration documentation

In addition to Application Proxy, you can strengthen your security posture with Identity Protection. 

Learn more:

* [What is Identity Protection?](../identity-protection/overview-identity-protection.md)
* [Using Azure AD Application Proxy to publish on-premises apps for remote users](../app-proxy/what-is-application-proxy.md)

## Single sign-on and multi-factor authentication

With Azure AD as an identity provider (IdP), you can use modern authentication and authorization methods like single sign-on (SSO) and Azure AD Multi-Factor Authentication (MFA) to secure legacy, on-premises applications.

Learn more:

* [What is SSO in Azure Active Directory?](what-is-single-sign-on.md)
* [How it works: Azure AD Multi-Factor Authentication](../authentication/concept-mfa-howitworks.md)

## Secure hybrid access with Application Proxy

Use Application Proxy to protect users, apps, and data in the cloud, and on premises. Use this tool for secure remote access to on-premises web applications. Users don’t need to use a virtual private network (VPN); they connect to applications from devices with SSO. 

Learn more:

* [Remote access to on-premises applications through Azure AD Application Proxy](../app-proxy/application-proxy.md)
* [Tutorial: Add an on-premises application for remote access through Application Proxy in Azure AD](../app-proxy/application-proxy-add-on-premises-application.md)
* [How to configure SSO to an Application Proxy application](../app-proxy/application-proxy-config-sso-how-to.md)
* [Using Azure AD Application Proxy to publish on-premises apps for remote users](../app-proxy/what-is-application-proxy.md)

### Application publishing and access management

Use Application Proxy remote access as a service to publish applications to users outside the corporate network. Help improve your cloud access management without requiring modification to your on-premises applications.

Learn more:

* [Tutorial: Add an on-premises application for remote access through Application Proxy in Azure AD](../app-proxy/application-proxy-add-on-premises-application.md)
* [Plan an Azure AD Application Proxy deployment](../app-proxy/application-proxy-deployment-plan.md)

## Partner integrations for apps: on-premises and legacy authentication

Microsoft partners with various companies that deliver pre-built solutions for on-premises applications, and applications that use legacy authentication. The following diagram illustrates a user flow from sign-in to secure access to apps and data.

   ![Diagram of secure hybrid access integrations and Application Proxy providing user access.](./media/secure-hybrid-access/secure-hybrid-access.png)

### Secure hybrid access through Azure AD partner integrations

The following partners offer solutions to support Conditional Access policies per application. Use the tables in the following two sections to learn about the partners and Azure AD integration documentation.

Learn more: [What is Conditional Access?](../conditional-access/overview.md)

|Partner|Integration documentation|
|---|---|
|Akamai Technologies|[Tutorial: Azure AD SSO integration with Akamai](../saas-apps/akamai-tutorial.md)|
|Citrix Systems, Inc.|[Tutorial: Azure AD SSO integration with Citrix ADC SAML Connector for Azure AD (Kerberos-based authentication)](../saas-apps/citrix-netscaler-tutorial.md)|
|Datawiza|[Tutorial: Configure Secure Hybrid Access with Azure AD and Datawiza](datawiza-with-azure-ad.md)|
|F5, Inc.|[Integrate F5 BIG-IP with Azure AD](f5-aad-integration.md)</br>[Tutorial: Configure F5 BIG-IP SSL-VPN for Azure AD SSO](f5-aad-password-less-vpn.md)|
|Progress Software Corporation, Progress Kemp|[Tutorial: Azure AD SSO integration with Kemp LoadMaster Azure AD integration](../saas-apps/kemp-tutorial.md)|
|Perimeter 81 Ltd.|[Tutorial: Azure AD SSO integration with Perimeter 81](../saas-apps/perimeter-81-tutorial.md)|
|Silverfort|[Tutorial: Configure Secure Hybrid Access with Azure AD and Silverfort](silverfort-azure-ad-integration.md)|
|Strata Identity, Inc.|[Integrate Azure AD SSO with Maverics Identity Orchestrator SAML Connector](../saas-apps/maverics-identity-orchestrator-saml-connector-tutorial.md)|

### Partners with pre-built solutions and integration documentation

|Partner|Integration documentation|
|---|---|
|Amazon Web Service, Inc.|[Tutorial: Azure AD SSO integration with AWS ClientVPN](../saas-apps/aws-clientvpn-tutorial.md)|
|Check Point Software Technologies Ltd.|[Tutorial: Azure AD single SSO integration with Check Point Remote Secure Access VPN](../saas-apps/check-point-remote-access-vpn-tutorial.md)|
|Cisco Systems, Inc.|[Tutorial: Azure AD SSO integration with Cisco AnyConnect](../saas-apps/cisco-anyconnect.md)|
|Cloudflare, Inc.|[Tutorial: Configure Cloudflare with Azure AD for secure hybrid access](cloudflare-azure-ad-integration.md)|
|Fortinet, Inc.|[Tutorial: Azure AD SSO integration with FortiGate SSL VPN](../saas-apps/fortigate-ssl-vpn-tutorial.md)|
|Palo Alto Networks|[Tutorial: Azure AD SSO integration with Palo Alto Networks Admin UI](../saas-apps/paloaltoadmin-tutorial.md)|
|Pulse Secure, Acquired by Ivanti|[Tutorial: Azure AD SSO integration with Pulse Connect Secure (PCS)](../saas-apps/pulse-secure-pcs-tutorial.md)</br>[Tutorial: Azure AD SSO integration with Pulse Secure Virtual Traffic Manager](../saas-apps/pulse-secure-virtual-traffic-manager-tutorial.md)</br>Pulse Secure is part of Ivanti. See, [Ivanti, Pulse Secure](https://www.ivanti.com/company/history/pulse-secure?psredirect)|
|Zsclaer, Inc.|[Tutorial: Integrate Zscaler Private Access with Azure AD](../saas-apps/zscalerprivateaccess-tutorial.md)|

