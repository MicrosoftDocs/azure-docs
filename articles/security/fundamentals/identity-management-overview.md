---
title: Azure identity management security overview
description: Learn about Microsoft Entra ID security features for identity management, including single sign-on, multifactor authentication, role-based access control, and identity governance.
services: security
author: msmbaldwin

ms.assetid: 5aa0a7ac-8f18-4ede-92a1-ae0dfe585e28
ms.service: security
ms.subservice: security-fundamentals
ms.topic: overview
ms.date: 11/04/2025
ms.author: mbaldwin
# Customer intent: As an IT Pro or decision maker, I want to learn about identity management capabilities in Azure
---
# Azure identity management security overview

Identity management is the process of authenticating and authorizing [security principals](/windows/security/identity-protection/access-control/security-principals). Microsoft Entra ID provides comprehensive identity and access management for applications and resources across your organization. This article covers core Azure identity management features that help protect access to resources.

## Single sign-on

Single sign-on (SSO) enables users to access multiple applications and resources with a single user account and password. Users sign in once and can access all their applications without repeated authentication. Microsoft Entra ID supports SSO for thousands of SaaS applications and on-premises web applications.

Microsoft Entra ID extends on-premises Active Directory into the cloud, enabling users to sign in with their organizational account to domain-joined devices, company resources, and integrated applications. SSO reduces password fatigue and improves security by minimizing exposed credentials.

Learn more:

* [What is single sign-on in Microsoft Entra ID?](/entra/identity/enterprise-apps/what-is-single-sign-on)
* [Plan a single sign-on deployment](/entra/identity/enterprise-apps/plan-sso-deployment)

## Multifactor authentication

Microsoft Entra multifactor authentication (MFA) adds a critical second layer of security by requiring two or more verification methods. MFA helps protect against unauthorized access while maintaining a simple sign-in experience for users.

Verification methods include:

* Microsoft Authenticator app
* Windows Hello for Business
* FIDO2 security keys
* Certificate-based authentication
* OATH tokens (hardware and software)
* SMS and voice call

Microsoft Entra ID P1 and P2 licenses support Conditional Access policies that enforce MFA based on user, location, device, and application context.

Learn more:

* [How Microsoft Entra multifactor authentication works](/entra/identity/authentication/concept-mfa-howitworks)
* [Plan a Microsoft Entra multifactor authentication deployment](/entra/identity/authentication/howto-mfa-getstarted)

## Azure role-based access control

Azure role-based access control (Azure RBAC) provides fine-grained access management for Azure resources. With Azure RBAC, you can grant users the minimum permissions needed to perform their jobs.

Azure RBAC includes built-in roles:

* **Owner**: Full access to all resources, including the right to delegate access
* **Contributor**: Create and manage all types of Azure resources, but can't grant access
* **Reader**: View existing Azure resources
* **User Access Administrator**: Manage user access to Azure resources

You can also create custom roles tailored to your specific needs.

Learn more:

* [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview)
* [Azure built-in roles](/azure/role-based-access-control/built-in-roles)
* [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)

## Application Proxy

Microsoft Entra application proxy enables secure remote access to on-premises web applications without requiring VPN connections. Application Proxy publishes applications like SharePoint sites, Outlook Web App, and IIS-based apps to external users while maintaining security through Microsoft Entra ID authentication and Conditional Access policies.

Application Proxy supports SSO and can integrate with existing on-premises authentication methods.

Learn more:

* [Microsoft Entra application proxy overview](/entra/identity/app-proxy/overview-what-is-app-proxy)
* [Publish on-premises apps with Microsoft Entra application proxy](/entra/identity/app-proxy/application-proxy-add-on-premises-application)

## Privileged Identity Management

Microsoft Entra Privileged Identity Management (PIM) helps you manage, control, and monitor privileged access to important resources. PIM provides just-in-time (JIT) privileged access, reducing the risk of excessive or unnecessary permissions.

With PIM, you can:

* Provide time-bound access to Azure and Microsoft Entra roles
* Require approval to activate privileged roles
* Enforce multifactor authentication for role activation
* Require justification for role activation
* Receive notifications for privileged role activations
* Conduct access reviews to ensure users still need privileged roles
* Generate audit reports for compliance

Learn more:

* [What is Microsoft Entra Privileged Identity Management?](/entra/id-governance/privileged-identity-management/pim-configure)
* [Plan a Privileged Identity Management deployment](/entra/id-governance/privileged-identity-management/pim-deployment-plan)

## Identity Protection

Microsoft Entra ID Protection detects potential vulnerabilities and risky activities affecting your organization's identities. It uses machine learning to identify anomalous sign-in behaviors and user activities.

Identity Protection provides:

* **Risk-based Conditional Access**: Policies that respond to detected risks in real-time
* **Risk detection**: Identification of suspicious activities, including anonymous IP address usage, atypical travel, and malware-linked IP addresses
* **Investigation tools**: Reports and dashboards for analyzing risks
* **Automated remediation**: Risk-based policies that can automatically require password changes or block access

Learn more:

* [What is Microsoft Entra ID Protection?](/entra/id-protection/overview-identity-protection)
* [Investigate risk with Identity Protection](/entra/id-protection/howto-identity-protection-investigate-risk)

## Microsoft Entra access reviews

Microsoft Entra access reviews enable efficient management of group memberships, access to enterprise applications, and privileged role assignments. Regular access reviews help ensure users have only the access they need.

Access reviews support:

* **Automated reviews**: Scheduled recurring reviews with customizable frequency
* **Delegated reviews**: Business owners and managers can review access for their teams
* **Self-attestation**: Users can confirm they still need access
* **Recommendations**: Machine learning suggests which users should lose access based on sign-in activity
* **Automated actions**: Remove access automatically when reviews complete

Learn more:

* [What are Microsoft Entra access reviews?](/entra/id-governance/access-reviews-overview)
* [Plan a Microsoft Entra access reviews deployment](/entra/id-governance/deploy-access-reviews)

## Hybrid identity management

For organizations with on-premises Active Directory, Microsoft provides hybrid identity solutions to synchronize identities between on-premises and cloud environments.

**Microsoft Entra Connect** (maintenance mode) synchronizes on-premises AD DS identities to Microsoft Entra ID. It runs on an on-premises server and provides:

* Directory synchronization for users, groups, and contacts
* Password hash synchronization or pass-through authentication
* Federation integration with AD FS
* Health monitoring

**Microsoft Entra Cloud Sync** is the modern, cloud-based synchronization solution that uses lightweight provisioning agents:

* Simplified deployment with lightweight agents
* Support for multi-forest disconnected environments
* High availability with multiple agents
* Cloud-based configuration and management

Microsoft recommends Cloud Sync for new hybrid identity deployments.

Learn more:

* [What is Microsoft Entra Cloud Sync?](/entra/identity/hybrid/cloud-sync/what-is-cloud-sync)
* [Choose the right sync client for Microsoft Entra ID](/entra/identity/hybrid/sync-tools)

## Device registration

Microsoft Entra device registration enables device-based Conditional Access policies. Registered devices receive an identity that authenticates the device during user sign-in. Device attributes can enforce Conditional Access policies for cloud and on-premises applications.

When combined with mobile device management (MDM) solutions like Microsoft Intune, device attributes are enriched with configuration and compliance information. This enables Conditional Access rules based on device security and compliance posture.

Learn more:

* [Plan your Microsoft Entra device deployment](/entra/identity/devices/plan-device-deployment)
* [Microsoft Entra joined devices](/entra/identity/devices/concept-directory-join)
* [Microsoft Entra hybrid joined devices](/entra/identity/devices/concept-hybrid-join)

## External identities

Microsoft Entra External ID provides identity management for customer-facing applications and B2B collaboration. External ID supports consumer sign-up and sign-in with social accounts (Facebook, Google, LinkedIn) or email-based credentials.

For B2B collaboration, External ID enables secure sharing of applications and resources with external partners while maintaining control over your corporate data. External users authenticate with their home organization or supported identity providers.

Learn more:

* [Microsoft Entra External ID overview](/entra/external-id/external-identities-overview)
* [B2B collaboration overview](/entra/external-id/what-is-b2b)

## Next steps

* [Azure security best practices and patterns](/azure/security/fundamentals/best-practices-and-patterns)
* [Network security overview](/azure/security/fundamentals/network-overview)
* [Threat detection and protection](/azure/security/fundamentals/threat-detection)
* [Key management in Azure](/azure/security/fundamentals/key-management)
