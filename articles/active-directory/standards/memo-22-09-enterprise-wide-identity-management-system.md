---
title: Memo 22-09 enterprise-wide identity management system
description: Get guidance on meeting enterprise-wide identity management system requirements outlined in US government OMB memorandum 22-09.
services: active-directory 
ms.service: active-directory
ms.subservice: standards
ms.workload: identity
ms.topic: how-to
author: gargi-sinha
ms.author: gasinh
manager: martinco
ms.reviewer: martinco
ms.date: 3/10/2022
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Enterprise-wide identity management system

Memorandum 22-09 requires agencies to develop a plan to consolidate their identity platforms to as few agency-managed identity systems as possible within 60 days of the publication date (March 28, 2022). There are several advantages to consolidating your identity platform:

* Centralized management of identity lifecycle, policy enforcement, and auditable controls

* Uniform capability and parity of enforcement 

* Reduced need to train resources across multiple systems

* Enabling users to sign in once and then directly access applications and services in the IT environment

* Integration with as many agency applications as possible

* Use of shared authentication services and trust relationships to facilitate integration among agencies 

## Why Azure Active Directory?

Azure Active Directory (Azure AD) provides the capabilities necessary to implement the recommendations from memorandum 22-09. It also provides broad identity controls that support Zero Trust initiatives. Today, If your agency uses Microsoft Office 365 or Azure, you already have Azure AD as an identity provider (IdP) and you can connect your applications and resources to Azure AD as your enterprise-wide identity system. 

## Single sign-on requirements

The memo requires that users sign in once and then directly access applications. Microsoft's robust single sign-on (SSO) capabilities enable users to sign in once and then access cloud and other applications. For more information, see [Azure Active Directory single sign-on](../hybrid/how-to-connect-sso.md).

## Integration across agencies

[Azure AD B2B collaboration](../external-identities/what-is-b2b.md) helps you meet the requirement to facilitate integration/collaboration among agencies. Whether the users reside in different Microsoft tenant in the same cloud, [tenant on another microsoft cloud](../external-identities/b2b-government-national-clouds.md), or a [non Azure AD tenant (SAML/WS-Fed identity provider)](..//external-identities/direct-federation.md).

Azure AD cross-tenant access settings allow agencies to manage how they collaborate with other Azure AD organizations and other Microsoft Azure clouds. It does this by:

- Limiting what other Microsoft tenants your users can access.
- Granular settings to control access for external users including enforcement of multifactor authentication (MFA) and device signal.

## Connecting applications

To consolidate your enterprise to using Azure AD as the enterprise-wide identity system, you must first understand the assets that will be in scope. 

### Document applications and services

You must inventory the applications and services that users will access. An identity management system can protect only what it knows. 

Classify assets in terms of:

- The sensitivity of data that they contain.
- Laws and regulations that establish specific requirements for confidentiality, integrity, or availability of data/information in each major system and that apply to the system's information protection requirements.

As a part of your application inventory, you need to determine if your current applications use cloud-ready protocols or [legacy authentication protocols](../fundamentals/auth-sync-overview.md):

* Cloud-ready applications support modern protocols for authentication, such as SAML, WS-Federation/Trust, OpenID Connect (OIDC), and OAuth 2.0.

* Legacy authentication applications rely on older or proprietary methods of authentication, such as Kerberos/NTLM (Windows authentication), header-based authentication, LDAP, and Basic authentication. 

#### Tools for application and service discovery 

Microsoft offers the following tools to help with your discovery of applications:

| Tool| Usage |
| - | - |
| [Usage Analytics for Active Directory Federation Services (AD FS)](../hybrid/how-to-connect-health-adfs.md)| Analyzes the authentication traffic of your federated servers. |
| [Microsoft Defender for Cloud Apps](/defender-cloud-apps/what-is-defender-for-cloud-apps)| Scans firewall logs to detect cloud apps, infrastructure as a service (IaaS) services, and platform as a service (PaaS) services that your organization uses. It was previously called Microsoft Cloud App Security. Integrating Defender for Cloud Apps with Defender for Endpoint allows discovery to happen from data analyzed from Windows client devices. |
| [Application Discovery worksheet](https://download.microsoft.com/download/2/8/3/283F995C-5169-43A0-B81D-B0ED539FB3DD/Application%20Discovery%20worksheet.xlsx)| Helps you document the current states of your applications. |

We recognize that your apps might be in systems other than Microsoft's, and that Microsoft tools might not discover those apps. Ensure that you do a complete inventory. All providers should have mechanisms for discovering applications that use their services. 

#### Prioritizing applications for connection

After you discover all applications in your environment, you need to prioritize them for migration. Consider business criticality, user profiles, usage, and lifespan. 

For more information on prioritizing applications for migration, see [Migrating your applications to Azure Active Directory](https://aka.ms/migrateapps/whitepaper). 

First, connect your cloud-ready apps in priority order. Then look at apps that use [legacy authentication protocols](../fundamentals/auth-sync-overview.md). 

For apps that use legacy authentication protocols, consider the following:

* For apps with modern authentication that aren't yet using Azure AD, reconfigure them to use Azure AD.

* For apps without modern authentication, there are two choices:

   * Modernize the application code to use modern protocols by integrating the [Microsoft Authentication Library (MSAL)](../develop/v2-overview.md).

   *  [Use Azure AD Application Proxy or secure hybrid partner access](../manage-apps/secure-hybrid-access.md) to provide secure access.

*  Decommission access to apps that are no longer needed or that aren't supported (for example, apps that shadow IT processes added). 

## Connecting devices

Part of centralizing your identity management system will include enabling users to sign in to physical and virtual devices. 

You can connect Windows and Linux devices in your centralized Azure AD system. That eliminates the need to have multiple, separate identity systems.

During your inventory and scope phase, consider identifying your devices and infrastructure so they can be integrated with Azure AD. This integration will centralize your authentication and management. It will also take advantage of conditional access policies and MFA that can be enforced through Azure AD. 

### Tools for discovering devices

You can use [Azure Automation accounts](../../automation/change-tracking/manage-inventory-vms.md) to identify devices through inventory collection connected to Azure Monitor. 

[Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/machines-view-overview) also features device inventory capabilities and discovery. This feature discovers which devices have Defender for Endpoint configured and which devices don't. Device inventory can also come from on-premises systems such as [System Center Configuration Manager](/mem/configmgr/core/clients/manage/inventory/introduction-to-hardware-inventory) or other systems that manage devices and clients. 

### Integration of devices with Azure AD

Devices integrated with Azure AD can be either [hybrid joined devices](../devices/concept-azure-ad-join-hybrid.md) or [Azure AD joined devices](../devices/concept-azure-ad-join.md). Agencies should separate device onboarding by client and user devices, and by physical and virtual machines that operate as infrastructure. For more information about choosing and implementing your deployment strategy for user devices, see [Plan your Azure AD device deployment](../devices/plan-device-deployment.md). For servers and infrastructure, consider the following examples for connecting:

* [Azure Windows virtual machines](../devices/howto-vm-sign-in-azure-ad-windows.md)

* [Azure Linux virtual machines](../devices/howto-vm-sign-in-azure-ad-linux.md)

* [Azure Virtual Desktop](https://learn.microsoft.com/azure/architecture/example-scenario/wvd/azure-virtual-desktop-azure-active-directory-join)

* [Virtual desktop infrastructure](../devices/howto-device-identity-virtual-desktop-infrastructure.md)

## Next steps

The following articles are part of this documentation set:

[Meet identity requirements of memorandum 22-09](memo-22-09-meet-identity-requirements.md)

[Multifactor authentication](memo-22-09-multi-factor-authentication.md)

[Authorization](memo-22-09-authorization.md)

[Other areas of Zero Trust](memo-22-09-other-areas-zero-trust.md)

For more information about Zero Trust, see:

[Securing identity with Zero Trust](/security/zero-trust/deploy/identity)
