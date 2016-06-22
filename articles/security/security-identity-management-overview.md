<properties
   pageTitle="Azure identity management security overview | Microsoft Azure"
   description=" Microsoft identity and access management solutions help IT protect access to applications and resources across the corporate datacenter and into the cloud, enabling additional levels of validation such as multi-factor authentication and conditional access policies. This article provides an overview of the core Azure security features that help with identity management. "
   services="security"
   documentationCenter="na"
   authors="TerryLanfear"
   manager="StevenPo"
   editor="TomSh"/>

<tags
   ms.service="security"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/22/2016"
   ms.author="terrylan"/>

# Azure identity management security overview

Microsoft identity and access management solutions help IT protect access to applications and resources across the corporate datacenter and into the cloud, enabling additional levels of validation such as multi-factor authentication and conditional access policies. Monitoring suspicious activity through advanced security reporting, auditing and alerting helps mitigate potential security issues. [Azure Active Directory Premium](../active-directory/active-directory-editions.md) provides single sign-on to thousands of cloud (SaaS) apps and access to web apps you run on-premises.

Security benefits of Azure Active Directory (AD) include the ability to:

- Create and manage a single identity for each user across your hybrid enterprise, keeping users, groups and devices in sync
- Provide single sign-on access to your applications including thousands of pre-integrated SaaS apps
- Enable application access security by enforcing rules-based Multi-Factor Authentication for both on-premises and cloud applications
- Provision secure remote access to on-premises web applications through Azure AD Application Proxy

The goal of this article is to provide an overview of the core Azure security features that help with identity management. We also provide links to articles that will give details of each feature so you can learn more.  

The article focuses on the following core Azure Identity management capabilities:

- Single sign-on
- Reverse proxy
- Multi-factor authentication
- Security monitoring, alerts, and machine learning-based reports
- Consumer identity and access management
- Device registration
- Privileged identity management
- Identity protection
- Hybrid identity management

## Single sign-on

Single sign-on (SSO) means being able to access all of the applications and resources that you need to do business, by signing in only once using a single user account. Once signed in, you can access all of the applications you need without being required to authenticate (e.g. type a password) a second time.

Many organizations rely upon software as a service (SaaS) applications such as Office 365, Box and Salesforce for end user productivity. Historically, IT staff needed to individually create and update user accounts in each SaaS application, and users had to remember a password for each SaaS application.

Azure AD extends on-premises Active Directory into the cloud, enabling users to use their primary organizational account to not only sign in to their domain-joined devices and company resources, but also all of the web and SaaS applications needed for their job.

Not only do users not have to manage multiple sets of usernames and passwords, application access can be automatically provisioned or de-provisioned based on organizational groups and their status as an employee. Azure AD introduces security and access governance controls that enable you to centrally manage users' access across SaaS applications.

Learn more:

- [Overview of Single Sign-On](https://azure.microsoft.com/documentation/videos/overview-of-single-sign-on/)
- [What is application access and single sign-on with Azure Active Directory?](../active-directory/active-directory-appssoaccess-whatis.md)
- [Integrate Azure Active Directory single sign-on with SaaS apps](../active-directory/active-directory-sso-integrate-saas-apps.md)

## Reverse proxy

Azure AD Application Proxy lets you publish on-premises applications, such as [SharePoint](https://support.office.com/article/What-is-SharePoint-97b915e6-651b-43b2-827d-fb25777f446f?ui=en-US&rs=en-US&ad=US) sites, [Outlook Web App](https://technet.microsoft.com/library/jj657718.aspx), and [IIS](http://www.iis.net/)-based apps inside your private network and provides secure access to users outside your network. Application Proxy provides remote access and single sign-on (SSO) for many types of on-premises web applications with the thousands of SaaS applications that Azure AD supports. Employees can log into your apps from home on their own devices and authenticate through this cloud-based proxy.

Learn more:

- [Enabling Azure AD Application Proxy](../active-directory/active-directory-application-proxy-enable.md)
- [Publish applications using Azure AD Application Proxy](../active-directory/active-directory-application-proxy-publish.md)
- [Single-sign-on with Application Proxy](../active-directory/active-directory-application-proxy-sso-using-kcd.md)
- [Working with conditional access](../active-directory/active-directory-application-proxy-conditional-access.md)

## Multi-factor authentication
Azure Multi-factor authentication (MFA) is a method of authentication that requires the use of more than one verification method and adds a critical second layer of security to user sign-ins and transactions. MFA helps safeguard access to data and applications while meeting user demand for a simple sign-in process. It delivers strong authentication via a range of verification options—phone call, text message, or mobile app notification or verification code and 3rd party OAuth tokens.

Learn more:

- [Multi-factor authentication](https://azure.microsoft.com/documentation/services/multi-factor-authentication/)
- [What is Azure Multi-Factor Authentication?](../multi-factor-authentication/multi-factor-authentication.md)
- [How Azure Multi-Factor Authentication works](../multi-factor-authentication/multi-factor-authentication-how-it-works.md)

## Security monitoring, alerts, and machine learning-based reports

Security monitoring and alerts and machine learning-based reports that identify inconsistent access patterns can help you protect your business. You can use Azure Active Directory's access and usage reports to gain visibility into the integrity and security of your organization’s directory. With this information, a directory admin can better determine where possible security risks may lie so that they can adequately plan to mitigate those risks.

In the Azure classic portal, reports are categorized in the following ways:

- Anomaly reports – contain sign in events that we found to be anomalous. Our goal is to make you aware of such activity and enable you to be able to make a determination about whether an event is suspicious.
- Integrated Application reports – provide insights into how cloud applications are being used in your organization. Azure Active Directory offers integration with thousands of cloud applications.
- Error reports – indicate errors that may occur when provisioning accounts to external applications.
- User-specific reports – display device/sign in activity data for a specific user.
- Activity logs – contain a record of all audited events within the last 24 hours, last 7 days, or last 30 days, as well as group activity changes, and password reset and registration activity.

Learn more:

- [View your access and usage reports](../active-directory/active-directory-view-access-usage-reports.md)
- [Getting started with Azure Active Directory Reporting](../active-directory/active-directory-reporting-getting-started.md)
- [Azure Active Directory Reporting Guide](../active-directory/active-directory-reporting-guide.md)

## Consumer identity and access management

Azure Active Directory B2C is a highly available, global, identity management service for consumer-facing applications that scales to hundreds of millions of identities. It can be integrated across mobile and web platforms. Your consumers can log on to all your applications through customizable experiences by using their existing social accounts or by creating new credentials.

In the past, application developers who wanted to sign up and sign in consumers into their applications would have written their own code. And they would have used on-premises databases or systems to store usernames and passwords. Azure Active Directory B2C offers your organization a better way to integrate consumer identity management into applications with the help of a secure, standards-based platform and a large set of extensible policies.

When you use Azure Active Directory B2C, your consumers can sign up for your applications by using their existing social accounts (Facebook, Google, Amazon, LinkedIn) or by creating new credentials (email address and password, or username and password).

Learn more:

- [What is Azure Active Directory B2C?](https://azure.microsoft.com/services/active-directory-b2c/)
- [Azure Active Directory B2C preview: Sign up and sign in consumers in your applications](../active-directory-b2c/active-directory-b2c-overview.md)
- [Azure Active Directory B2C Preview: Types of Applications](../active-directory-b2c/active-directory-b2c-apps.md)

## Device registration

Azure AD Device Registration is the foundation for device-based [conditional access](../active-directory/active-directory-conditional-access-on-premises-setup.md) scenarios. When a device is registered, Azure Active Directory Device Registration provides the device with an identity which is used to authenticate the device when the user signs in. The authenticated device, and the attributes of the device, can then be used to enforce conditional access policies for applications that are hosted in the cloud and on-premises.

When combined with a mobile device management (MDM) solution such as Intune, the device attributes in Azure Active Directory are updated with additional information about the device. This allows you to create conditional access rules that enforce access from devices to meet your standards for security and compliance.

Learn more:

- [Get started with Azure Active Directory Device Registration](../active-directory/active-directory-conditional-access-device-registration-overview.md)
- [Setting up on-premises conditional access using Azure Active Directory Device Registration](../active-directory/active-directory-conditional-access-on-premises-setup.md)
- [Automatic device registration with Azure Active Directory for Windows domain-joined devices](../active-directory/active-directory-conditional-access-automatic-device-registration.md)

## Privileged identity management
Azure Active Directory (AD) Privileged Identity Management lets you manage, control, and monitor your privileged identities and access to resources in Azure AD as well as other Microsoft online services like Office 365 or Microsoft Intune.

Sometimes users need to carry out privileged operations in Azure or Office 365 resources, or other SaaS apps. This often means organizations have to give them permanent privileged access in Azure AD. This is a growing security risk for cloud-hosted resources because organizations can't sufficiently monitor what those users are doing with their admin privileges. Additionally, if a user account with privileged access is compromised, that one breach could impact their overall cloud security. Azure AD Privileged Identity Management helps to resolve this risk.

Azure AD Privileged Identity Management lets you:

- See which users are Azure AD admins
- Enable on-demand, "just in time" administrative access to Microsoft Online Services like Office 365 and Intune
- Get reports about administrator access history and changes in administrator assignments
- Get alerts about access to a privileged role

Learn more:

- [Azure AD Privileged Identity Management](../active-directory/active-directory-privileged-identity-management-configure.md)
- [Roles in Azure AD Privileged Identity Management](../active-directory/active-directory-privileged-identity-management-roles.md)
- [Azure AD Privileged Identity Management: How to add or remove a user role](../active-directory/active-directory-privileged-identity-management-how-to-add-role-to-user.md)

## Identity protection
Azure AD Identity Protection is a security service that provides a consolidated view into risk events and potential vulnerabilities affecting your organization’s identities. Identity Protection leverages existing Azure Active Directory’s anomaly detection capabilities (available through Azure AD’s Anomalous Activity Reports), and introduces new risk event types that can detect anomalies in real-time.

Learn more:

- [Azure Active Directory Identity Protection](../active-directory/active-directory-identityprotection.md)
- [Channel 9: Azure AD and Identity Show: Identity Protection Preview](https://channel9.msdn.com/Series/Azure-AD-Identity/Azure-AD-and-Identity-Show-Identity-Protection-Preview)

## Hybrid identity management

Microsoft’s approach to identity spans on-premises and the cloud, creating a single user identity for authentication and authorization to all resources, regardless of location.

Learn more:

- [Hybrid identity white paper](http://download.microsoft.com/download/D/B/A/DBA9E313-B833-48EE-998A-240AA799A8AB/Hybrid_Identity_White_Paper.pdf)
- [Azure Active Directory](https://azure.microsoft.com/documentation/services/active-directory/)
- [Active Directory Team Blog](https://blogs.technet.microsoft.com/ad/)
