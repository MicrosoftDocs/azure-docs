---
title: Azure security features that help with identity management | Microsoft Docs
description: " This article provides an overview of the core Azure security features that help with identity management. Microsoft identity and access management solutions help IT protect access to applications and resources across the corporate datacenter and into the cloud, enabling additional levels of validation, such as Multi-Factor Authentication and Conditional Access policies. "
services: security
documentationcenter: na
author: TerryLanfear
manager: barbkess
editor: TomSh

ms.assetid: 5aa0a7ac-8f18-4ede-92a1-ae0dfe585e28
ms.service: security
ms.subservice: security-fundamentals
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/19/2018
ms.author: terrylan
Customer intent: As an IT Pro or decision maker I am trying to learn about identity management capabilities in Azure
---
# Azure identity management security overview

 Identity management is the process of authenticating and authorizing [security principals](/windows/security/identity-protection/access-control/security-principals). It also involves controlling information about those principals (identities). Security principals (identities) may include services, applications, users, groups, etc.
 Microsoft identity and access management solutions help IT protect access to applications and resources across the corporate datacenter and into the cloud. Such protection enables additional levels of validation, such as Multi-Factor Authentication and Conditional Access policies. Monitoring suspicious activity through advanced security reporting, auditing, and alerting helps mitigate potential security issues. [Azure Active Directory Premium](/azure/active-directory/active-directory-editions) provides single sign-on (SSO) to thousands of cloud software as a service (SaaS) apps and access to web apps that you run on-premises.
 
By taking advantage of the security benefits of Azure Active Directory (Azure AD), you can:

* Create and manage a single identity for each user across your hybrid enterprise, keeping users, groups, and devices in sync. 
* Provide SSO access to your applications, including thousands of pre-integrated SaaS apps.
* Enable application access security by enforcing rules-based Multi-Factor Authentication for both on-premises and cloud applications.
* Provision secure remote access to on-premises web applications through Azure AD Application Proxy.

The goal of this article is to provide an overview of the core Azure security features that help with identity management. We also provide links to articles that give details of each feature so you can learn more.  

The article focuses on the following core Azure Identity management capabilities:

* Single sign-on
* Reverse proxy
* Multi-Factor Authentication
* Role based access control (RBAC)
* Security monitoring, alerts, and machine learning-based reports
* Consumer identity and access management
* Device registration
* Privileged identity management
* Identity protection
* Hybrid identity management/Azure AD connect
* Azure AD access reviews

## Single sign-on

SSO means being able to access all the applications and resources that you need to do business, by signing in only once using a single user account. Once signed in, you can access all of the applications you need without being required to authenticate (for example, type a password) a second time.

Many organizations rely upon SaaS applications such as Office 365, Box, and Salesforce for user productivity. Historically, IT staff needed to individually create and update user accounts in each SaaS application, and users had to remember a password for each SaaS application.

Azure AD extends on-premises Active Directory environments into the cloud, enabling users to use their primary organizational account to  sign in not only to their domain-joined devices and company resources, but also to all the web and SaaS applications they need for their jobs.

Not only do users not have to manage multiple sets of usernames and passwords, you can provision or de-provision application access automatically, based on their organizational groups and their employee status. Azure AD introduces security and access governance controls with which you can centrally manage users' access across SaaS applications.

Learn more:

* [Overview of single sign-on](https://azure.microsoft.com/documentation/videos/overview-of-single-sign-on/)
* [What is application access and single sign-on with Azure Active Directory?](../../active-directory/manage-apps/what-is-single-sign-on.md)
* [Integrate Azure Active Directory single sign-on with SaaS apps](../../active-directory/manage-apps/configure-single-sign-on-non-gallery-applications.md)

## Reverse proxy

Azure AD Application Proxy lets you publish on-premises applications, such as [SharePoint](https://support.office.com/article/What-is-SharePoint-97b915e6-651b-43b2-827d-fb25777f446f?ui=en-US&rs=en-US&ad=US) sites, [Outlook Web App](https://technet.microsoft.com/library/jj657718.aspx), and [IIS](https://www.iis.net/)-based apps inside your private network and provides secure access to users outside your network. Application Proxy provides remote access and SSO for many types of on-premises web applications with the thousands of SaaS applications that Azure AD supports. Employees can sign in to your apps from home on their own devices and authenticate through this cloud-based proxy.

Learn more:

* [Enabling Azure AD Application Proxy](/azure/active-directory/manage-apps/application-proxy-enable)
* [Publish applications using Azure AD Application Proxy](/azure/active-directory/active-directory-application-proxy-publish)
* [Single sign-on with Application Proxy](../../active-directory/manage-apps/application-proxy-configure-single-sign-on-with-kcd.md)
* [Working with Conditional Access](../../active-directory/manage-apps/application-proxy-integrate-with-sharepoint-server.md)

## Multi-Factor Authentication

Azure Multi-Factor Authentication is a method of authentication that requires the use of more than one verification method and adds a critical second layer of security to user sign-ins and transactions. Multi-Factor Authentication helps safeguard access to data and applications while meeting user demand for a simple sign-in process. It delivers strong authentication via a range of verification options: phone calls, text messages, or mobile app notifications or verification codes and third-party OAuth tokens.

Learn more:

* [Multi-Factor Authentication](https://azure.microsoft.com/documentation/services/multi-factor-authentication/)
* [What is Azure Multi-Factor Authentication?](/azure/active-directory/authentication/multi-factor-authentication)
* [How Azure Multi-Factor Authentication works](../../active-directory/authentication/concept-mfa-howitworks.md)

## RBAC

RBAC is an authorization system built on Azure Resource Manager that provides fine-grained access management of resources in Azure. RBAC allows you to granularly control the level of access that users have. For example, you can limit a user to only manage virtual networks and another user to manage all resources in a resource group. Azure includes several built-in roles that you can use. The following lists four fundamental built-in roles. The first three apply to all resource types.

Learn more:

* [What is role-based access control (RBAC)?](/azure/role-based-access-control/overview)
* [Built-in roles for Azure resources](/azure/role-based-access-control/built-in-roles)

## Security monitoring, alerts, and machine learning-based reports

Security monitoring, alerts, and machine learning-based reports that identify inconsistent access patterns can help you protect your business. You can use Azure AD access and usage reports to gain visibility into the integrity and security of your organization’s directory. With this information, a directory administrator can better determine where possible security risks might lie so that they can adequately plan to mitigate those risks.

In the Azure portal, reports fall into the following categories:

* **Anomaly reports**: Contain sign-in events that we found to be anomalous. Our goal is to make you aware of such activity and enable you to determine whether an event is suspicious.
* **Integrated Application reports**: Provide insights into how cloud applications are being used in your organization. Azure AD offers integration with thousands of cloud applications.
* **Error reports**: Indicate errors that might occur when you provision accounts to external applications.
* **User-specific reports**: Display device sign-in activity data for a specific user.
* **Activity logs**: Contain a record of all audited events within the last 24 hours, last 7 days, or last 30 days, and group activity changes and password reset and registration activity.

Learn more:

* [View your access and usage reports](/azure/active-directory/active-directory-view-access-usage-reports)
* [Get started with Azure Active Directory reporting](/azure/active-directory/active-directory-reporting-getting-started)
* [Azure Active Directory reporting guide](/azure/active-directory/active-directory-reporting-guide)

## Consumer identity and access management

Azure AD B2C is a highly available, global, identity management service for consumer-facing applications that scales to hundreds of millions of identities. It can be integrated across mobile and web platforms. Your consumers can sign in to all your applications through customizable experiences by using their existing social accounts or by creating new credentials.

In the past, application developers who wanted to sign up customers and sign them in to their applications would have written their own code. And they would have used on-premises databases or systems to store usernames and passwords. Azure AD B2C offers your organization a better way to integrate consumer identity management into applications with the help of a secure, standards-based platform and a large set of extensible policies.

When you use Azure AD B2C, your consumers can sign up for your applications by using their existing social accounts (Facebook, Google, Amazon, LinkedIn) or by creating new credentials (email address and password, or username and password).

Learn more:

* [What is Azure Active Directory B2C?](https://azure.microsoft.com/services/active-directory-b2c/)
* [Azure Active Directory B2C preview: Sign up and sign in consumers in your applications](../../active-directory-b2c/overview.md)
* [Azure Active Directory B2C Preview: Types of applications](../../active-directory-b2c/application-types.md)

## Device registration

Azure AD device registration is the foundation for device-based [Conditional Access](/azure/active-directory/active-directory-conditional-access-device-registration-overview) scenarios. When a device is registered, Azure AD device registration provides the device with an identity that it uses to authenticate the device when a user signs in. The authenticated device  and the attributes of the device can then be used to enforce Conditional Access policies for applications that are hosted in the cloud and on-premises.

When combined with a mobile device management solution such as Intune, the device attributes in Azure AD are updated with additional information about the device. You can then create Conditional Access rules that enforce access from devices to meet your standards for security and compliance.

Learn more:

* [Get started with Azure AD device registration](/azure/active-directory/active-directory-conditional-access-device-registration-overview)
* [Automatic device registration with Azure AD for Windows domain-joined devices](/azure/active-directory/active-directory-conditional-access-automatic-device-registration)
* [Set up automatic registration of Windows domain-joined devices with Azure AD](/azure/active-directory/active-directory-conditional-access-automatic-device-registration-setup)

## Privileged identity management

With Azure AD Privileged Identity Management, you can manage, control, and monitor your privileged identities and access to resources in Azure AD as well as other Microsoft online services, such as Office 365 and Microsoft Intune.

Users sometimes need to carry out privileged operations in Azure or Office 365 resources, or in other SaaS apps. This need often means that organizations have to give users permanent privileged access in Azure AD. Such access is a growing security risk for cloud-hosted resources, because organizations can't sufficiently monitor what the users are doing with their administrator privileges. Additionally, if a user account with privileged access is compromised, that one breach could affect the organization's overall cloud security. Azure AD Privileged Identity Management helps to mitigate this risk.

With Azure AD Privileged Identity Management, you can:

* See which users are Azure AD administrators.
* Enable on-demand, just-in-time (JIT) administrative access to Microsoft services such as Office 365 and Intune.
* Get reports about administrator access history and changes in administrator assignments.
* Get alerts about access to a privileged role.

Learn more:

* [What is Azure AD Privileged Identity Management?](../../active-directory/privileged-identity-management/pim-configure.md)
* [Assign Azure AD directory roles in PIM](../../active-directory/privileged-identity-management/pim-how-to-add-role-to-user.md)

## Identity protection

Azure AD Identity Protection is a security service that provides a consolidated view into risk detections and potential vulnerabilities that affect your organization’s identities. Identity Protection takes advantage of existing Azure AD anomaly-detection capabilities, which are available through Azure AD Anomalous Activity reports. Identity Protection also introduces new risk detection types that can detect anomalies in real time.

Learn more:

* [Azure AD Identity Protection](/azure/active-directory/identity-protection/overview)
* [Channel 9: Azure AD and Identity Show: Identity Protection Preview](https://channel9.msdn.com/Series/Azure-AD-Identity/Azure-AD-and-Identity-Show-Identity-Protection-Preview)

## Hybrid identity management/Azure AD connect

Microsoft’s identity solutions span on-premises and cloud-based capabilities, creating a single user identity for authentication and authorization to all resources, regardless of location. We call this hybrid identity. Azure AD Connect is the Microsoft tool designed to meet and accomplish your hybrid identity goals. This allows you to provide a common identity for your users for Office 365, Azure, and SaaS applications integrated with Azure AD. It provides the following features:

* Synchronization
* AD FS and federation integration
* Pass through authentication
* Health Monitoring

Learn more:

* [Hybrid identity white paper](https://download.microsoft.com/download/D/B/A/DBA9E313-B833-48EE-998A-240AA799A8AB/Hybrid_Identity_White_Paper.pdf)
* [Azure Active Directory](https://azure.microsoft.com/documentation/services/active-directory/)
* [Azure AD team blog](https://blogs.technet.microsoft.com/ad/)

## Azure AD access reviews

Azure Active Directory (Azure AD) access reviews enable organizations to efficiently manage group memberships, access to enterprise applications, and privileged role assignments.

Learn more:

* [Azure AD access reviews](../../active-directory/governance/access-reviews-overview.md)
* [Manage user access with Azure AD access reviews](../../active-directory/governance/access-reviews-overview.md)
