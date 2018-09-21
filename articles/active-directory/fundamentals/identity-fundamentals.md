---
title: What are the fundamentals of Azure identity and access management? - Azure Active Directory | Microsoft Docs
description: Learn about the advanced protection capabilities and additional tools that are available with Azure Active Directory Premium editions.
services: active-directory
author: eross-msft
manager: mtillman
ms.author: lizross

ms.service: active-directory
ms.component: fundamentals
ms.workload: identity
ms.topic: conceptual
ms.date: 09/13/2018
ms.reviewer: jsnow
ms.custom: it-pro
---

# What are the fundamentals of Azure identity and access management?
Azure AD Premium is a cloud-based identity and access management solution, with advanced protection capabilities. These advanced capabilities help provide a secure identity for all of your apps, identity protection (enhanced with the [Microsoft intelligence security graph](https://www.microsoft.com/security/intelligence)), and [Privileged Identity Management (PIM)](../privileged-identity-management/pim-configure.md). Azure AD helps to protect your users' identities in real time, helping you to create risk-based and adaptive access policies around your organization's data.

Watch this short video for a quick overview of Azure AD identity management and protection:
>[!VIDEO https://www.youtube.com/embed/9LGIJ2-FKIM]

Azure AD also provides a set of tools that can help you secure, automate, and manage your environment, including resetting passwords, user and group management, and app requests. Azure AD can also help you manage user-owned devices and access and control of Software as a Service (SaaS) apps.

For more information about the costs of Azure Active Directory Premium editions and the associated tools, see [Azure Active Directory pricing](https://azure.microsoft.com/pricing/details/active-directory/).

## Connect on-premises Active Directory with Azure AD and Office 365
Extend your on-premises Active Directory implementation into the cloud by integrating your on-premises directories with Azure AD through [hybrid identity management](https://aka.ms/aadframework). [Azure AD Connect](../connect/active-directory-aadconnect.md) provides this integration, giving your users a single identity and single sign-on (SSO) access to both your on-premises resources and your cloud services, such as Office 365.

Azure AD Connect replaces older versions of identity integration tools, such as DirSync and Azure AD Sync, helping to support your identity synchronization needs between on-premises and Azure AD. Azure AD Connect synchronization is enabled through:

- **Synchronization.** Responsible for creating users, groups, and other objects. It's also responsible for making sure identity information for your on-premises users matches what is in Azure AD. Turning on password write-back also helps keep your on-premises directories in sync when users update passwords in Azure AD.

- Authentication. Choosing the right authentication method is important when setting up your Azure AD hybrid identity solution. You can choose cloud authentication (Password Hash Synchronization / Pass-through Authentication) or federated authentication (AD FS) for your organization. For more information about your available options, see [Choose the right authentication method for your Azure Active Directory hybrid identity solution](https://aka.ms/auth-options).

- **Health monitoring.** Azure AD Connect Health provides monitoring and a central location on the Azure portal to view this activity. For more information, see [Monitor your on-premises identity infrastructure and synchronization services in the cloud](../connect-health/active-directory-aadconnect-health.md).

## Increase productivity and reduce helpdesk costs with self-service and single sign-on experiences
Users save time when they have a single username and password, along with a consistent experience on every device. Users also save time by performing self-service tasks,  like[resetting a forgotten password](../user-help/active-directory-passwords-update-your-own-password.md) or requesting access to an application without waiting for assistance from the helpdesk.

Furthering the SSO and consistent experience, Azure AD [extends your on-premises Active Directory](../connect/active-directory-aadconnect.md) into the cloud, letting your users use their primary organizational account for their domain-joined devices, company resources, and all the web and SaaS applications they need to use to get a job done. 

Additionally, application access can be automatically provisioned (or de-provisioned) based on group memberships and a user's employee status, helping you control access to gallery apps or your own on-premises apps that you’ve developed and published through the [Azure AD Application Proxy](../manage-apps/application-proxy.md).

## Manage and control access to your organizational resources
Microsoft identity and access management solutions help you to protect access to apps and resources across your organization's datacenter and into the cloud. This access management helps to provide additional levels of validation such as [Multi-Factor Authentication](../authentication/concept-mfa-howitworks.md) and [conditional access policies](../conditional-access/overview.md). Monitoring suspicious activity through advanced security reporting, auditing, and alerting can also help to mitigate potential security issues.

Using conditional access policies in Azure AD Premium lets you create policy-based access rules for any Azure AD-connected app, such as SaaS apps, custom apps running in the cloud or on-premises, or web apps). Azure AD evaluates your rules in real time, enforcing them whenever a user attempts to access an app. Azure identity protection policies let you automatically take action (by blocking access, enforcing Multi-Factor Authentication, or resetting user passwords) if suspicious activity is discovered.

## Azure Active Directory Privileged Identity Management
[Privileged Identity Management (PIM)](../privileged-identity-management/pim-getting-started.md), included with the Azure Active Directory Premium 2 edition, helps you to discover, restrict, and monitor administrative accounts and their access to resources in your Azure Active Directory and other Microsoft online services. PIM also helps you administer on-demand administrative access for the exact period of time you need, meaning that you can allow administrators to request multi-factor authenticated, temporary elevation of their privileges for a pre-configured period of time before their accounts return to a normal user state.

## Next steps
For more information about the Azure AD architecture, see [What is the Azure AD architecture?](active-directory-architecture.md).
