---
title: Azure security features that help with identity management | Microsoft Docs
description: Learn about the core Azure security features that help with identity management. See information about topics like single sign-on and reverse proxy.
services: security
documentationcenter: na
author: TerryLanfear
manager: rkarlin

ms.assetid: 5aa0a7ac-8f18-4ede-92a1-ae0dfe585e28
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/05/2022
ms.author: terrylan
# Customer intent: As an IT Pro or decision maker, I am trying to learn about identity management capabilities in Azure
---
# Azure identity management security overview

 Identity management is the process of authenticating and authorizing [security principals](/windows/security/identity-protection/access-control/security-principals). It also involves controlling information about those principals (identities). Security principals (identities) may include services, applications, users, groups, etc.
 Microsoft identity and access management solutions help IT protect access to applications and resources across the corporate datacenter and into the cloud. Such protection enables additional levels of validation, such as multifactor authentication and Conditional Access policies. Monitoring suspicious activity through advanced security reporting, auditing, and alerting helps mitigate potential security issues. [Microsoft Entra ID P1 or P2](../../active-directory/fundamentals/active-directory-whatis.md#what-are-the-azure-ad-licenses) provides single sign-on (SSO) to thousands of cloud software as a service (SaaS) apps and access to web apps that you run on-premises.

By taking advantage of the security benefits of Microsoft Entra ID, you can:

* Create and manage a single identity for each user across your hybrid enterprise, keeping users, groups, and devices in sync. 
* Provide SSO access to your applications, including thousands of pre-integrated SaaS apps.
* Enable application access security by enforcing rules-based multifactor authentication for both on-premises and cloud applications.
* Provision secure remote access to on-premises web applications through Microsoft Entra application proxy.

The goal of this article is to provide an overview of the core Azure security features that help with identity management. We also provide links to articles that give details of each feature so you can learn more.  

The article focuses on the following core Azure Identity management capabilities:

* Single sign-on
* Reverse proxy
* Multifactor authentication
* Azure role-based access control (Azure RBAC)
* Security monitoring, alerts, and machine learning-based reports
* Consumer identity and access management
* Device registration
* Privileged identity management
* Identity protection
* Hybrid identity management/Azure AD connect
* Microsoft Entra access reviews

## Single sign-on

SSO means being able to access all the applications and resources that you need to do business, by signing in only once using a single user account. Once signed in, you can access all of the applications you need without being required to authenticate (for example, type a password) a second time.

Many organizations rely upon SaaS applications such as Microsoft 365, Box, and Salesforce for user productivity. Historically, IT staff needed to individually create and update user accounts in each SaaS application, and users had to remember a password for each SaaS application.

Microsoft Entra ID extends on-premises Active Directory environments into the cloud, enabling users to use their primary organizational account to  sign in not only to their domain-joined devices and company resources, but also to all the web and SaaS applications they need for their jobs.

Not only do users not have to manage multiple sets of usernames and passwords, you can provision or de-provision application access automatically, based on their organizational groups and their employee status. Microsoft Entra ID introduces security and access governance controls with which you can centrally manage users' access across SaaS applications.

Learn more:

* [Overview on SSO](../../active-directory/manage-apps/what-is-single-sign-on.md)
* [Video on authentication fundamentals](https://www.youtube.com/watch?v=fbSVgC8nGz4&feature=emb_title)
* [Quickstart series on application management](../../active-directory/manage-apps/view-applications-portal.md)

## Reverse proxy

Microsoft Entra application proxy lets you publish on-premises applications, such as [SharePoint](https://support.office.com/article/What-is-SharePoint-97b915e6-651b-43b2-827d-fb25777f446f?ui=en-US&rs=en-US&ad=US) sites, [Outlook Web App](/Exchange/clients/outlook-on-the-web/outlook-on-the-web), and [IIS](https://www.iis.net/)-based apps inside your private network and provides secure access to users outside your network. Application Proxy provides remote access and SSO for many types of on-premises web applications with the thousands of SaaS applications that Microsoft Entra ID supports. Employees can sign in to your apps from home on their own devices and authenticate through this cloud-based proxy.

Learn more:

* [Enabling Microsoft Entra application proxy](../../active-directory/app-proxy/application-proxy-add-on-premises-application.md)
* [Publish applications using Microsoft Entra application proxy](../../active-directory/app-proxy/application-proxy-add-on-premises-application.md)
* [Single sign-on with Application Proxy](../../active-directory/app-proxy/application-proxy-configure-single-sign-on-with-kcd.md)
* [Working with Conditional Access](../../active-directory/app-proxy/application-proxy-integrate-with-sharepoint-server.md)

<a name='multi-factor-authentication'></a>

## Multifactor authentication

Microsoft Entra multifactor authentication is a method of authentication that requires the use of more than one verification method and adds a critical second layer of security to user sign-ins and transactions. Multifactor authentication helps safeguard access to data and applications while meeting user demand for a simple sign-in process. It delivers strong authentication via a range of verification options: phone calls, text messages, or mobile app notifications or verification codes and third-party OAuth tokens.

Learn more: [How Microsoft Entra multifactor authentication works](../../active-directory/authentication/concept-mfa-howitworks.md)

## Azure RBAC

Azure RBAC is an authorization system built on Azure Resource Manager that provides fine-grained access management of resources in Azure. Azure RBAC allows you to granularly control the level of access that users have. For example, you can limit a user to only manage virtual networks and another user to manage all resources in a resource group. Azure includes several built-in roles that you can use. The following lists four fundamental built-in roles. The first three apply to all resource types.

* [Owner](../../role-based-access-control/built-in-roles.md#owner) - Has full access to all resources including the right to delegate access to others. 
* [Contributor](../../role-based-access-control/built-in-roles.md#contributor) - Can create and manage all types of Azure resources but can't grant access to others.
* [Reader](../../role-based-access-control/built-in-roles.md#reader) - Can view existing Azure resources.
* [User Access Administrator](../../role-based-access-control/built-in-roles.md#user-access-administrator) - Lets you manage user access to Azure resources.

Learn more:

* [What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md)
* [Azure built-in roles](../../role-based-access-control/built-in-roles.md)

## Security monitoring, alerts, and machine learning-based reports

Security monitoring, alerts, and machine learning-based reports that identify inconsistent access patterns can help you protect your business. You can use Microsoft Entra ID access and usage reports to gain visibility into the integrity and security of your organization's directory. With this information, a directory administrator can better determine where possible security risks might lie so that they can adequately plan to mitigate those risks.

In the Azure portal, reports fall into the following categories:

* **Anomaly reports**: Contain sign-in events that we found to be anomalous. Our goal is to make you aware of such activity and enable you to determine whether an event is suspicious.
* **Integrated Application reports**: Provide insights into how cloud applications are being used in your organization. Microsoft Entra ID offers integration with thousands of cloud applications.
* **Error reports**: Indicate errors that might occur when you provision accounts to external applications.
* **User-specific reports**: Display device sign-in activity data for a specific user.
* **Activity logs**: Contain a record of all audited events within the last 24 hours, last 7 days, or last 30 days, and group activity changes and password reset and registration activity.

Learn more: [Microsoft Entra ID reporting guide](../../active-directory/reports-monitoring/overview-reports.md)

## Consumer identity and access management

Azure AD B2C is a highly available, global, identity management service for consumer-facing applications that scales to hundreds of millions of identities. It can be integrated across mobile and web platforms. Your consumers can sign in to all your applications through customizable experiences by using their existing social accounts or by creating new credentials.

In the past, application developers who wanted to sign up customers and sign them in to their applications would have written their own code. And they would have used on-premises databases or systems to store usernames and passwords. Azure AD B2C offers your organization a better way to integrate consumer identity management into applications with the help of a secure, standards-based platform and a large set of extensible policies.

When you use Azure AD B2C, your consumers can sign up for your applications by using their existing social accounts (Facebook, Google, Amazon, LinkedIn) or by creating new credentials (email address and password, or username and password).

Learn more:

* [What is Azure Active Directory B2C?](../../active-directory-b2c/overview.md)
* [Azure Active Directory B2C: Types of applications](../../active-directory-b2c/application-types.md)

## Device registration

Microsoft Entra device registration is the foundation for device-based [Conditional Access](../../active-directory/devices/manage-device-identities.md) scenarios. When a device is registered, Microsoft Entra device registration provides the device with an identity that it uses to authenticate the device when a user signs in. The authenticated device  and the attributes of the device can then be used to enforce Conditional Access policies for applications that are hosted in the cloud and on-premises.

When combined with a mobile device management solution such as Intune, the device attributes in Microsoft Entra ID are updated with additional information about the device. You can then create Conditional Access rules that enforce access from devices to meet your standards for security and compliance.

Learn more:

* [Get started with Microsoft Entra device registration](../../active-directory/devices/manage-device-identities.md)
* [Automatic device registration with Microsoft Entra ID for Windows domain-joined devices](../../active-directory/devices/hybrid-join-plan.md#review-supported-devices)

## Privileged identity management

With Microsoft Entra Privileged Identity Management, you can manage, control, and monitor your privileged identities and access to resources in Microsoft Entra ID as well as other Microsoft online services, such as Microsoft 365 and Microsoft Intune.

Users sometimes need to carry out privileged operations in Azure or Microsoft 365 resources, or in other SaaS apps. This need often means that organizations have to give users permanent privileged access in Microsoft Entra ID. Such access is a growing security risk for cloud-hosted resources, because organizations can't sufficiently monitor what the users are doing with their administrator privileges. Additionally, if a user account with privileged access is compromised, that one breach could affect the organization's overall cloud security. Microsoft Entra Privileged Identity Management helps to mitigate this risk.

With Microsoft Entra Privileged Identity Management, you can:

* See which users are Microsoft Entra administrators.
* Enable on-demand, just-in-time (JIT) administrative access to Microsoft services such as Microsoft 365 and Intune.
* Get reports about administrator access history and changes in administrator assignments.
* Get alerts about access to a privileged role.

Learn more:

* [What is Microsoft Entra Privileged Identity Management?](../../active-directory/privileged-identity-management/pim-configure.md)
* [Assign Microsoft Entra directory roles in PIM](../../active-directory/privileged-identity-management/pim-how-to-add-role-to-user.md)

## Identity protection

Microsoft Entra ID Protection is a security service that provides a consolidated view into risk detections and potential vulnerabilities that affect your organization's identities. Identity Protection takes advantage of existing Microsoft Entra anomaly-detection capabilities, which are available through Microsoft Entra Anomalous Activity reports. Identity Protection also introduces new risk detection types that can detect anomalies in real time.

Learn more: [Microsoft Entra ID Protection](../../active-directory/identity-protection/overview-identity-protection.md)

## Hybrid identity management (Microsoft Entra Connect)

Microsoft's identity solutions span on-premises and cloud-based capabilities, creating a single user identity for authentication and authorization to all resources, regardless of location. We call this hybrid identity. Microsoft Entra Connect is the Microsoft tool designed to meet and accomplish your hybrid identity goals. This allows you to provide a common identity for your users for Microsoft 365, Azure, and SaaS applications integrated with Microsoft Entra ID. It provides the following features:

* Synchronization
* AD FS and federation integration
* Pass through authentication
* Health Monitoring

Learn more:

* [Hybrid identity white paper](https://download.microsoft.com/download/D/B/A/DBA9E313-B833-48EE-998A-240AA799A8AB/Hybrid_Identity_White_Paper.pdf)
* [Microsoft Entra ID](../../active-directory/index.yml)

<a name='azure-ad-access-reviews'></a>

## Microsoft Entra access reviews

Microsoft Entra access reviews enable organizations to efficiently manage group memberships, access to enterprise applications, and privileged role assignments.

Learn more: [Microsoft Entra access reviews](../../active-directory/governance/access-reviews-overview.md)
