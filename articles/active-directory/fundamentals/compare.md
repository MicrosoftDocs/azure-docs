---
title: Compare Active Directory to Microsoft Entra ID
description: This document compares Active Directory Domain Services (ADDS) to Microsoft Entra ID. It outlines key concepts in both identity solutions and explains how it's different or similar.
services: active-directory
author: martincoetzer
manager: travisgr
tags: azuread
ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.subservice: fundamentals
ms.date: 08/17/2022
ms.author: martinco
---

# Compare Active Directory to Microsoft Entra ID

Microsoft Entra ID is the next evolution of identity and access management solutions for the cloud. Microsoft introduced Active Directory Domain Services in Windows 2000 to give organizations the ability to manage multiple on-premises infrastructure components and systems using a single identity per user.

Microsoft Entra ID takes this approach to the next level by providing organizations with an Identity as a Service (IDaaS) solution for all their apps across cloud and on-premises.

Most IT administrators are familiar with Active Directory Domain Services concepts. The following table outlines the differences and similarities between Active Directory concepts and Microsoft Entra ID.

|Concept|Active Directory (AD)|Microsoft Entra ID |
|:-|:-|:-|
|**Users**|||
|Provisioning: users | Organizations create internal users manually or use an in-house or automated provisioning system, such as the Microsoft Identity Manager, to integrate with an HR system.|Existing AD organizations use [Microsoft Entra Connect](../hybrid/connect/how-to-connect-sync-whatis.md) to sync identities to the cloud.</br> Microsoft Entra ID adds support to automatically create users from [cloud HR systems](../app-provisioning/what-is-hr-driven-provisioning.md). </br>Microsoft Entra ID can provision identities in [SCIM enabled](../app-provisioning/use-scim-to-provision-users-and-groups.md) SaaS apps to automatically provide apps with the necessary details to allow access for users. |
|Provisioning: external identities| Organizations create external users manually as regular users in a dedicated external AD forest, resulting in administration overhead to manage the lifecycle of external identities (guest users)| Microsoft Entra ID provides a special class of identity to support external identities. [Microsoft Entra B2B](/azure/active-directory/b2b/) will manage the link to the external user identity to make sure they are valid. |
| Entitlement management and groups| Administrators make users members of groups. App and resource owners then give groups access to apps or resources.| [Groups](./how-to-manage-groups.md) are also available in Microsoft Entra ID and administrators can also use groups to grant permissions to resources. In Microsoft Entra ID, administrators can assign membership to groups manually or use a query to dynamically include users to a group. </br> Administrators can use [Entitlement management](../governance/entitlement-management-overview.md) in Microsoft Entra ID to give users access to a collection of apps and resources using workflows and, if necessary, time-based criteria. |
| Admin management|Organizations will use a combination of domains, organizational units, and groups in AD to delegate administrative rights to manage the directory and resources it controls.| Microsoft Entra ID provides [built-in roles](./how-subscriptions-associated-directory.md) with its Microsoft Entra role-based access control (Microsoft Entra RBAC) system, with limited support for [creating custom roles](../roles/custom-overview.md) to delegate privileged access to the identity system, the apps, and resources it controls.</br>Managing  roles can be enhanced with [Privileged Identity Management (PIM)](../privileged-identity-management/pim-configure.md) to provide just-in-time, time-restricted, or workflow-based access to privileged roles. |
| Credential management| Credentials in Active Directory are based on passwords, certificate authentication, and smartcard authentication. Passwords are managed using password policies that are based on password length, expiry, and complexity.|Microsoft Entra ID uses intelligent [password protection](../authentication/concept-password-ban-bad.md) for cloud and on-premises. Protection includes smart lockout plus blocking common and custom password phrases and substitutions. </br>Microsoft Entra ID significantly boosts security [through Multi-factor authentication](../authentication/concept-mfa-howitworks.md) and [passwordless](../authentication/concept-authentication-passwordless.md) technologies, like FIDO2. </br>Microsoft Entra ID reduces support costs by providing users a [self-service password reset](../authentication/concept-sspr-howitworks.md) system. |
| **Apps**|||
| Infrastructure apps|Active Directory forms the basis for many infrastructure on-premises components, for example, DNS, DHCP, IPSec, WiFi, NPS, and VPN access|In a new cloud world, Microsoft Entra ID, is the new control plane for accessing apps versus relying on networking controls. When users authenticate, [Conditional Access](../conditional-access/overview.md) controls which users have access to which apps under required conditions.|
| Traditional and legacy apps| Most on-premises apps use LDAP, Windows-Integrated Authentication (NTLM and Kerberos), or Header-based authentication to control access to users.| Microsoft Entra ID can provide access to these types of on-premises apps using [Microsoft Entra application proxy](../app-proxy/application-proxy.md) agents running on-premises. Using this method Microsoft Entra ID can authenticate Active Directory users on-premises using Kerberos while you migrate or need to coexist with legacy apps. |
| SaaS apps|Active Directory doesn't support SaaS apps natively and requires federation system, such as AD FS.|SaaS apps supporting OAuth2, SAML, and WS-\* authentication can be integrated to use Microsoft Entra ID for authentication. |
| Line of business (LOB) apps with modern authentication|Organizations can use AD FS with Active Directory to support LOB apps requiring modern authentication.| LOB apps requiring modern authentication can be configured to use Microsoft Entra ID for authentication. |
| Mid-tier/Daemon services|Services running in on-premises environments normally use AD service accounts or group Managed Service Accounts (gMSA) to run. These apps will then inherit the permissions of the service account.| Microsoft Entra ID provides [managed identities](../managed-identities-azure-resources/index.yml) to run other workloads in the cloud. The lifecycle of these identities is managed by Microsoft Entra ID and is tied to the resource provider and it can't be used for other purposes to gain backdoor access.|
| **Devices**|||
| Mobile|Active Directory doesn't natively support mobile devices without third-party solutions.| Microsoft’s mobile device management solution, Microsoft Intune, is integrated with Microsoft Entra ID. Microsoft Intune provides device state information to the identity system to evaluate during authentication. |
| Windows desktops|Active Directory provides the ability to domain join Windows devices to manage them using Group Policy, System Center Configuration Manager, or other third-party solutions.|Windows devices can be [joined to Microsoft Entra ID](../devices/index.yml). Conditional Access can check if a device is Microsoft Entra joined as part of the authentication process. Windows devices can also be managed with [Microsoft Intune](/intune/what-is-intune). In this case, Conditional Access, will consider whether a device is compliant (for example, up-to-date security patches and virus signatures) before allowing access to the apps.|
| Windows servers| Active Directory provides strong management capabilities for on-premises Windows servers using Group Policy or other management solutions.| Windows servers virtual machines in Azure can be managed with [Microsoft Entra Domain Services](../../active-directory-domain-services/index.yml). [Managed identities](../managed-identities-azure-resources/index.yml) can be used when VMs need access to the identity system directory or resources.|
| Linux/Unix workloads|Active Directory doesn't natively support non-Windows without third-party solutions, although Linux machines can be configured to authenticate with Active Directory as a Kerberos realm.|Linux/Unix VMs can use [managed identities](../managed-identities-azure-resources/index.yml) to access the identity system or resources. Some organizations, migrate these workloads to cloud container technologies, which can also use managed identities.|

## Next steps

- [What is Microsoft Entra ID?](./whatis.md)
- [Compare self-managed Active Directory Domain Services, Microsoft Entra ID, and managed Microsoft Entra Domain Services](../../active-directory-domain-services/compare-identity-solutions.md)
- [Frequently asked questions about Microsoft Entra ID](./active-directory-faq.yml)
- [What's new in Microsoft Entra ID?](./whats-new.md)
