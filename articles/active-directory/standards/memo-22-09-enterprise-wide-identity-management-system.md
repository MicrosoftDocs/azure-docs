---
title: Memo 22-09 enterprise-wide identity management systems
description: Guidance on meeting enterprise-wide identity management system requirements outlined in US government OMB memorandum 22-09
services: active-directory 
ms.service: active-directory
ms.subservice: standards
ms.workload: identity
ms.topic: how-to
author: barbaraselden
ms.author: baselden
manager: martinco
ms.reviewer: martinco
ms.date: 3/10/2022
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Enterprise-wide identity management system

M-22-09 requires agencies to develop a plan to consolidate their identity platforms to “as few agency managed identity systems as possible” within 60 days of publication, March 28, 2022. There are several advantages to consolidating your identity platform:

* Centralized management of identity lifecycle, policy enforcement, and auditable controls.

* Uniform capability and parity of enforcement. 

* Reduced need to train resources across multiple systems.

* Enable users to sign in once and then directly access applications and services in the IT environment.

* Integrate with as many agency applications as possible.

* Facilitate integration among agencies using shared authentication services and trust relationships

 

## Why Azure Active Directory?

Azure Active Directory provides the capabilities necessary to implement the recommendations from M-22-09 as well as other broad identity controls that support Zero Trust initiatives. Additionally, if your agency uses Microsoft Office 365, you already have an Azure AD back end to which you can consolidate.

## Single sign-on requirements

The memo requires that users sign in once and then directly access applications. Microsoft’s robust single-sign-on capabilities enable the ability for users to sign-in once and then access cloud and other applications. For more information, see [Azure Active Directory Single sign-on](../hybrid/how-to-connect-sso.md).

### Integration across agencies

[Azure AD B2B collaboration](../external-identities/what-is-b2b.md) (B2B) helps you to meet the requirement to facilitate integration among agencies. It does this by both limiting what other Microsoft tenants your users can access, and by enabling you to allow access to users that you do not have to manage in your own tenant, but whom you can subject to your MFA and other access requirements.

## Connect applications

To consolidate your enterprise to using Azure AD as the enterprise-wide identity system, you must first understand the relevant assets that will be in scope. 

### Document applications and services

To do so, you must inventory the applications and services that users will be accessing: An identity management system can protect only what it knows. Assets must be classified in terms of the sensitivity of data they contain, as well as laws and regulations that establish specific requirements for confidentiality, integrity, or availability of data/information in each major system and that apply to the system’s particular information protection requirements.

### Classifying applications and services

As a part of your application inventory, you will need to determine if your current applications use “cloud ready” or legacy authentication protocols

* Cloud ready applications support modern protocols for authentication such as SAML, WS-Federation/Trust, OpenID Connect (OIDC), and OAuth 2.0.

* Legacy authentication applications rely on legacy or proprietary methods of authentication to include but not limited to Kerberos/NTLM (windows authentication), header based, LDAP, and basic authentication. 

#### Tools for application and service discovery 

Microsoft makes available several tools to help with your discovery of applications.

| Tool| Usage |
| - | - |
| [Usage Analytics for AD FS](../hybrid/how-to-connect-health-adfs.md)| Analyzes the authentication traffic of your federated servers. |
| [Microsoft Defender for Cloud Apps](%20/defender-cloud-apps/what-is-defender-for-cloud-apps) (MDCA)| Previously known as Microsoft Cloud App Security (MCAS), Defender for Cloud Apps scans firewall logs to detect cloud apps, IaaS and PaaS services used by your organization. Integrating MDCA with Defender for Endpoint allows discovery to happen from data analyzed from window client devices. |
| [Application Documentation worksheet](https://download.microsoft.com/download/2/8/3/283F995C-5169-43A0-B81D-B0ED539FB3DD/Application%20Discovery%20worksheet.xlsx)| Helps you document the current states of your applications |

We recognize that your apps may be in systems other than Microsoft, and that our tools may not discover those apps. Ensure you do a complete inventory. All providers should have mechanisms for discovering applications using their services. 

#### Prioritize applications for connection

Once you discover all applications in your environment, you will need to prioritize them for migration. You should consider business criticality, user profiles, usage, and lifespan. 

For more information on prioritizing applications for migration, see [Migrating your applications to Azure Active Directory](https://aka.ms/migrateapps/whitepaper). 

First, connect your cloud-ready apps in priority order. Then look at applications using legacy authentication protocols.

For apps using [legacy authentication protocols](../fundamentals/auth-sync-overview.md), consider the following:

* For apps with modern authentication not yet using Azure AD, reconfigure them to use Azure AD.

* For apps without modern authentication, there are two choices:

   * Modernize the application code to use modern protocols by integrating the [Microsoft Authentication Library (MSAL).](../develop/v2-overview.md)

   *  [Use Azure AD Application Proxy or Secure hybrid partner access](../manage-apps/secure-hybrid-access.md) to provide secure access.

*  Decommission access to apps that are no longer needed, or are not supported (for example, apps added by shadow IT processes).

## Connect devices

Part of centralizing your identity management system will include enabling sign-in to devices. This enables users to sign in to physical and virtual devices. 

You can connect Windows and Linux devices in your centralized Azure AD system, eliminating the need to have multiple, separate identity systems.

During your inventory and scope phase you should consider identifying your devices and infrastructure so they may be integrated with Azure AD to centralize your authentication and management and take advantage of conditional access policies and MFA that can be enforced through Azure AD. 

### Tools for discovering devices

You can leverage [Azure automation accounts](../../automation/change-tracking/manage-inventory-vms.md) to identify devices through inventory collection connected to Azure monitor. 

[Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/machines-view-overview?view=o365-worldwide) (MDE) also features device inventory capabilities and discovery. This feature looks at devices that have MDE configured as well as network discovery of devices not configured with MDE. Device inventory may also come from on-premises systems such as [Configuration manager](/mem/configmgr/core/clients/manage/inventory/introduction-to-hardware-inventory) to do device inventory or other 3<sup data-htmlnode="">rd</sup> party systems used to manage devices and clients. 

### Integrate devices to Azure AD

Devices integrated with Azure AD can either be [hybrid joined devices](../devices/concept-azure-ad-join-hybrid.md) or [Azure Active directory joined devices](../devices/concept-azure-ad-join-hybrid.md). Agencies should separate device onboarding by client and end user devices and physical and virtual machines that operate as infrastructure. For more information about choosing and implementing your end-user device deployment strategy, see [Plan your Azure AD device deployment](../devices/plan-device-deployment.md). For servers and infrastructure consider the following examples for connecting:

* [Azure windows VM’s](../devices/howto-vm-sign-in-azure-ad-windows.md)

* [Azure Linux VM’s](../devices/howto-vm-sign-in-azure-ad-linux.md)

* [VDI infrastructure](../devices/howto-device-identity-virtual-desktop-infrastructure.md)

## Next steps

The following articles are a part of this documentation set:

[Meet identity requirements of Memorandum 22-09](memo-22-09-meet-identity-requirements.md)

[Enterprise-wide identity management system](memo-22-09-enterprise-wide-identity-management-system.md)

[Multi-factor authentication](memo-22-09-multi-factor-authentication.md)

[Authorization](memo-22-09-authorization.md)

[Other areas of Zero Trust](memo-22-09-other-areas-zero-trust.md)

Additional Zero Trust Documentation

[Securing identity with Zero Trust](/security/zero-trust/deploy/identity)
