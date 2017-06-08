---
# required metadata

title: Fundamentals of Azure identity management | Microsoft Docs
description:
keywords:
author: jeffgilb
manager: femila
editor: jsnow
ms.author: jeffgilb
ms.date: 6/6/2017
ms.topic: article
ms.prod:
ms.service: azure
ms.technology:
ms.assetid:

# optional metadata

#ROBOTS:
#audience:
#ms.devlang:
#ms.suite:
#ms.tgt_pltfrm:
ms.custom: it-pro

---
# Fundamentals of Azure identity management
As more and more company digital resources live outside the corporate network, in the cloud and on devices, a great cloud-based identity and access management solution is becoming a necessity. Cloud-based identities are now the best way to maintain control over, and visibility into, how and when users access corporate applications and data.

Microsoft has been securing cloud-based identities for over a decade and now, with [Azure Active Directory (AD)](https://docs.microsoft.com/azure/active-directory/active-directory-editions), these same protection systems are available to you. With Azure AD, enterprise administrators can easily ensure user and administrator accountability with better security and governance than ever before.

Azure AD Premium is a cloud-based identity and access management solution with advanced protection capabilities that enables one secure identity for all apps, identity protection (enhanced by the [Microsoft intelligence security graph](https://www.microsoft.com/en-us/security/intelligence)), and Privileged Identity Management. Not just another monitoring or reporting tool, Azure AD Premium can protect your user’s identities in real time and enable you to create risk-based, adaptive access policies to protect your organization’s data.

Watch this short video for a quick overview of Azure AD identity management and protection:
<iframe width="560" height="315" src="https://www.youtube.com/embed/9LGIJ2-FKIM" frameborder="0" allowfullscreen></iframe>

Microsoft not only provides an identity that takes you everywhere, but also a set of tools to automate, help secure, and manage IT within your organization. Even after the advent of cloud computing, there is still demand to manage and control IT tasks like helpdesk calls to reset user passwords, user group management, and application requests. Complicating things further, employees are now bringing their personal devices to work and using readily available SaaS applications. This makes maintaining control over their applications across corporate datacenters and public cloud platforms a significant challenge.

> [!Note]
> The capabilities described in this article require an Azure Active Directory P1 or P2 subscription either purchased separately or as part of an [Enterprise Mobility + Security E3 or E5](https://docs.microsoft.com/enterprise-mobility-security/solutions/learn-about-ems) subscription.

## Connect on-premises Active Directory with Azure AD and Office 365
Organizations that have made large investments in on-premises Active Directory can extend those investments to the cloud by integrating their on-premises directories with Azure AD into [hybrid identity management](https://docs.microsoft.com/azure/active-directory/active-directory-hybrid-identity-design-considerations-overview). Doing so makes your users more productive by providing a common identity for accessing resources regardless of location. Users and organizations can then use single sign on (SSO) to access both on-premises resources and cloud services such as Office 365.

[Azure AD Connect](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect) is the only tool you need to get the integration done. Azure AD Connect provides capabilities to support your identity synchronization needs and replaces older versions of identity integration tools such as DirSync and Azure AD Sync. With Azure AD Connect, identity management and synchronization between on-premises and Azure AD is enabled through:

- Synchronization - This component is responsible for creating users, groups, and other objects. It is also responsible for making sure identity information for your on-premises users and groups is matching the cloud. Password write-back can also be enabled to keep on-premises directories in sync when a user updates their password in Azure AD.
- AD FS - Federation is an optional capability provided by Azure AD Connect that can be used to configure a hybrid environment using an on-premises AD FS infrastructure. Federation can be used by organizations to address complex deployments, such as single sign on, enforcement of AD sign-in policy, and smart card or third party MFA.
- Health Monitoring - [Azure AD Connect Health](https://docs.microsoft.com/azure/active-directory/connect-health/active-directory-aadconnect-health) can provide robust monitoring and provide a central location in the Azure portal to view this activity.

## Increase productivity and reduce helpdesk costs with self-service and single sign-on experiences

Employees are more productive when they have a single username and password to remember and a consistent experience from every device. They also save time when they can perform self-service tasks like [resetting a forgotten password](https://docs.microsoft.com/azure/active-directory/active-directory-passwords) or requesting access to an application without waiting for assistance from the helpdesk.

Azure AD [extends on-premises Active Directory](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect) into the cloud, enabling users to use their primary organizational account for both their domain-joined devices, company resources, and all of the web and SaaS applications they need to use to get their jobs done. In addition to not having to remember multiple sets of usernames and passwords, users' application access can also be automatically provisioned (or de-provisioned) based on their organization group memberships and their status as an employee. And you can control that access for gallery apps or for your own on-premises apps that you’ve developed and published through the [Azure AD Application Proxy](https://docs.microsoft.com/azure/active-directory/active-directory-application-proxy-get-started).

## Manage and control access to corporate resources
Microsoft identity and access management solutions help IT protect access to applications and resources across the corporate datacenter and into the cloud, enabling additional levels of validation such as [multi-factor authentication](https://docs.microsoft.com/azure/multi-factor-authentication/multi-factor-authentication-whats-next) and [conditional access policies](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-azure-portal). Monitoring suspicious activity through advanced security reporting, auditing and alerting helps mitigate potential security issues.

Conditional access policies in Azure AD Premium give you, the enterprise admin, the ability to create policy-based access rules for any Azure AD-connected application (SaaS apps, custom apps running in the cloud or on-premises web applications). Azure AD evaluates these policies in real time, and enforces them whenever a user attempts to access an application. Azure identity protection policies enable you to automatically take action if suspicious activity is discovered. These actions can include blocking access to users at high risk, enforcing multi-factor authentication, and resetting user passwords if it looks like credentials have been compromised.


## Azure Active Directory Privileged Identity Management

[Privileged Identity Management](https://docs.microsoft.com/azure/active-directory/active-directory-privileged-identity-management-getting-started), included with the Azure Active Directory Premium P2 offering, allows you to discover, restrict, and monitor administrative accounts and their access to resources in your Azure Active Directory and other Microsoft online services. It also helps you administer on-demand administrative access for the exact period of time you need.

Privileged Identity Management can enforce on-demand administrator rights so that administrators can request multi-factor authenticated, temporary elevation of their privileges for pre-configured periods of time before their accounts return to a normal user state.

## Benefits of Azure Identity

With Azure identity management, you can:

-   Create and manage a single identity for each user across your entire enterprise, keeping users, groups, and devices in sync with [Azure Active Directory Connect](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect).

-   Provide single sign-on access to your applications including thousands of pre-integrated SaaS apps or provide secure remote access to on-premises SaaS applications using the [Azure AD Application Proxy](https://docs.microsoft.com/azure/active-directory/active-directory-application-proxy-get-started).

-   Enable application access security by enforcing rules-based [Multi-Factor Authentication](https://docs.microsoft.com/azure/multi-factor-authentication/multi-factor-authentication-whats-next) for both on-premises and cloud applications.

-   Improve user productivity with [self-service password reset](https://docs.microsoft.com/azure/active-directory/active-directory-passwords), and group and application access requests using the [MyApps portal](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-user-help).

-   Take advantage of the [high-availability and reliability](https://docs.microsoft.com/azure/architecture/resiliency/high-availability-azure-applications) of a worldwide, enterprise-grade, cloud-based identity and access management solution.
