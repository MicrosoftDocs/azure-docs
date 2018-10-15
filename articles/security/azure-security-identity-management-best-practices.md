---
title: Azure identity & access security best practices | Microsoft Docs
description: This article provides a set of best practices for identity management and access control using built in Azure capabilities.
services: security
documentationcenter: na
author: barclayn
manager: mbaldwin
editor: TomSh

ms.assetid: 07d8e8a8-47e8-447c-9c06-3a88d2713bc1
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/17/2018
ms.author: barclayn

---
# Azure Identity Management and access control security best practices

Many consider identity to be the new boundary layer for security, taking over that role from the traditional network-centric perspective. This evolution of the primary pivot for security attention and investments come from the fact that network perimeters have become increasingly porous and that perimeter defense cannot be as effective as they once were prior to the explosion of [BYOD](http://aka.ms/byodcg) devices and cloud applications.

In this article, we discuss a collection of Azure identity management and access control security best practices. These best practices are derived from our experience with [Azure AD](../active-directory/fundamentals/active-directory-whatis.md) and the experiences of customers like yourself.

For each best practice, we explain:

* What the best practice is
* Why you want to enable that best practice
* What might be the result if you fail to enable the best practice
* Possible alternatives to the best practice
* How you can learn to enable the best practice

This Azure identity management and access control security best practices article is based on a consensus opinion and Azure platform capabilities and feature sets, as they exist at the time this article was written. Opinions and technologies change over time and this article will be updated on a regular basis to reflect those changes.

Azure identity management and access control security best practices discussed in this article include:

* Treat identity as the primary security perimeter
* Centralize identity management
* Enable single sign-on
* Turn on conditional access
* Enable password management
* Enforce multi-factor verification for users
* Use role-based access control
* Lower exposure of privileged accounts
* Control locations where resources are located

## Treat identity as the primary security perimeter

Many consider identity to be the primary perimeter for security. This is a shift from the traditional focus on network security. Network perimeters keep getting more porous, and that perimeter defense can’t be as effective as it was before the explosion of [BYOD](http://aka.ms/byodcg) devices and cloud applications.
[Azure Active Directory (Azure AD)](../active-directory/active-directory-whatis.md) is the Azure solution for identity and access management. Azure AD is a multitenant, cloud-based directory and identity management service from Microsoft. It combines core directory services, application access management, and identity protection into a single solution.

The following sections list best practices for identity and access security using Azure AD.

## Centralize identity management

In a [hybrid identity](https://resources.office.com/ww-landing-M365E-EMS-IDAM-Hybrid-Identity-WhitePaper.html?) scenario we recommend that you integrate your on-premises and cloud directories. Integration enables your IT team to manage accounts from one single location, regardless of where an account is created. Integration also helps your users to be more productive by providing a common identity for accessing both cloud and on-premises resources.


**Best practice**: Integrate your on-premises directories with Azure AD.  
**Detail**: Use [Azure AD Connect](../active-directory/connect/active-directory-aadconnect.md) to synchronize your on-premises directory with your cloud directory.

**Best practice**: Turn on password hash synchronization.  
**Detail**: Password hash synchronization is a feature used to synchronize hashes of user password hashes from an on-premises Active Directory instance to a cloud-based Azure AD instance.

Even if you decide to use federation with Active Directory Federation Services (AD FS) or other identity providers, you can optionally set up password hash synchronization as a backup in case your on-premises servers fail or become temporarily unavailable. This enables users to sign in to the service by using the same password that they use to sign in to their on-premises Active Directory instance. It also allows Identity Protection to detect compromised credentials by comparing those password hashes with passwords known to be compromised, if a user has used their same email address and password on other services not connected to Azure AD.

For more information, see [Implement password hash synchronization with Azure AD Connect sync](../active-directory/connect/active-directory-aadconnectsync-implement-password-hash-synchronization.md).

Organizations that don’t integrate their on-premises identity with their cloud identity can have more overhead in managing accounts. This overhead increases the likelihood of mistakes and security breaches.

## Enable single sign-on

In a mobile-first, cloud-first world, you want to enable single sign-on (SSO) to devices, apps, and services from anywhere so your users can be productive wherever and whenever. When you have multiple identity solutions to manage, this becomes an administrative problem not only for IT but also for users who have to remember multiple passwords.

By using the same identity solution for all your apps and resources, you can achieve SSO. And your users can use the same set of credentials to sign in and access the resources that they need, whether the resources are located on-premises or in the cloud.

**Best practice**: Enable SSO.  
**Detail**: Azure AD [extends on-premises Active Directory](../active-directory/connect/active-directory-aadconnect.md) to the cloud. Users can use their primary work or school account for their domain-joined devices, company resources, and all of the web and SaaS applications that they need to get their jobs done. Users don’t have to remember multiple sets of usernames and passwords, and their application access can be automatically provisioned (or deprovisioned) based on their organization group memberships and their status as an employee. And you can control that access for gallery apps or for your own on-premises apps that you’ve developed and published through the [Azure AD Application Proxy](../active-directory/active-directory-application-proxy-get-started.md).

Use SSO to enable users to access their [SaaS applications](../active-directory/active-directory-appssoaccess-whatis.md) based on their work or school account in Azure AD. This is applicable not only for Microsoft SaaS apps, but also other apps, such as [Google Apps](../active-directory/active-directory-saas-google-apps-tutorial.md) and [Salesforce](../active-directory/active-directory-saas-salesforce-tutorial.md). You can configure your application to use Azure AD as a [SAML-based identity](../active-directory/fundamentals-identity.md) provider. As a security control, Azure AD does not issue a token that allows users to sign in to the application unless they have been granted access through Azure AD. You can grant access directly, or through a group that users are a member of.

Organizations that don’t create a common identity to establish SSO for their users and applications are more exposed to scenarios where users have multiple passwords. These scenarios increase the likelihood of users reusing passwords or using weak passwords.

## Turn on conditional access

Users can access your organization's resources by using a variety of devices and apps from anywhere. As an IT administrator, you want to make sure that these devices meet your standards for security and compliance. Just focusing on who can access a resource is not sufficient anymore.

To balance security and productivity, you need to think about how a resource is accessed before you can make an access control decision. With Azure AD conditional access, you can address this requirement. With conditional access, you can make automated access control decisions for accessing your cloud apps that are based on conditions.

**Best practice**: Manage and control access to corporate resources.  
**Detail**: Configure Azure AD [conditional access](../active-directory/active-directory-conditional-access-azure-portal.md) based on a group, location, and application sensitivity for SaaS apps and Azure AD–connected apps.

## Enable password management

If you have multiple tenants or you want to enable users to [reset their own passwords](../active-directory/active-directory-passwords-update-your-own-password.md), it’s important that you use appropriate security policies to prevent abuse.

**Best practice**: Set up self-service password reset (SSPR) for your users.  
**Detail**: Use the Azure AD [self-service password reset](../active-directory-b2c/active-directory-b2c-reference-sspr.md) feature.

**Best practice**: Monitor how or if SSPR is really being used.  
**Detail**: Monitor the users who are registering by using the Azure AD [Password Reset Registration Activity report](../active-directory/active-directory-passwords-get-insights.md). The reporting feature that Azure AD provides helps you answer questions by using prebuilt reports. If you're appropriately licensed, you can also create custom queries.

## Enforce multi-factor verification for users

We recommend that you require two-step verification for all of your users. This includes administrators and others in your organization who can have a significant impact if their account is compromised (for example, financial officers).

There are multiple options for requiring two-step verification. The best option for you depends on your goals, the Azure AD edition you’re running, and your licensing program. See [How to require two-step verification for a user](../active-directory/authentication/howto-mfa-userstates.md) to determine the best option for you. See the [Azure AD](https://azure.microsoft.com/pricing/details/active-directory/) and [Azure Multi-Factor Authentication](https://azure.microsoft.com/pricing/details/multi-factor-authentication/) pricing pages for more information about licenses and pricing.

Following are options and benefits for enabling two-step verification:

**Option 1**: [Enable Multi-Factor Authentication by changing user state](../active-directory/authentication/howto-mfa-userstates.md).   
**Benefit**: This is the traditional method for requiring two-step verification. It works with both [Azure Multi-Factor Authentication in the cloud and Azure Multi-Factor Authentication Server](../active-directory/authentication/concept-mfa-whichversion.md). Using this method requires users to perform two-step verification every time they sign in and overrides conditional access policies.

**Option 2**: [Enable Multi-Factor Authentication with conditional access policy](../active-directory/authentication/howto-mfa-getstarted.md#enable-multi-factor-authentication-with-conditional-access).   
**Benefit**: This option allows you to prompt for two-step verification under specific conditions by using [conditional access](../active-directory/active-directory-conditional-access-azure-portal.md). Specific conditions can be user sign-in from different locations, untrusted devices, or applications that you consider risky. Defining specific conditions where you require two-step verification enables you to avoid constant prompting for your users, which can be an unpleasant user experience.

This is the most flexible way to enable two-step verification for your users. Enabling a conditional access policy works only for Azure Multi-Factor Authentication in the cloud and is a premium feature of Azure AD. You can find more information on this method in [Deploy cloud-based Azure Multi-Factor Authentication](../active-directory/authentication/howto-mfa-getstarted.md).

**Option 3**: Enable Multi-Factor Authentication with conditional access policies by evaluating user and sign-in risk of [Azure AD Identity Protection](../active-directory/authentication/tutorial-risk-based-sspr-mfa.md).   
**Benefit**: This option enables you to:

- Detect potential vulnerabilities that affect your organization’s identities.
- Configure automated responses to detected suspicious actions that are related to your organization’s identities.
- Investigate suspicious incidents and take appropriate action to resolve them.

This method uses the Azure AD Identity Protection risk evaluation to determine if two-step verification is required based on user and sign-in risk for all cloud applications. This method requires Azure Active Directory P2 licensing. You can find more information on this method in [Azure Active Directory Identity Protection](../active-directory/identity-protection/overview.md).

> [!Note]
> Option 1, enabling Multi-Factor Authentication by changing the user state, overrides conditional access policies. Because options 2 and 3 use conditional access policies, you cannot use option 1 with them.

Organizations that don’t add extra layers of identity protection, such as two-step verification, are more susceptible for credential theft attack. A credential theft attack can lead to data compromise.

## Use role-based access control (RBAC)

Restricting access based on the [need to know](https://en.wikipedia.org/wiki/Need_to_know) and [least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) security principles is imperative for organizations that want to enforce security policies for data access. You can use [role-based access control (RBAC)](../role-based-access-control/overview.md) to assign permissions to users, groups, and applications at a certain scope. The scope of a role assignment can be a subscription, a resource group, or a single resource.

You can use [built-in RBAC](../role-based-access-control/built-in-roles.md) roles in Azure to assign privileges to users. Organizations that do not enforce data access control by using capabilities such as RBAC might be giving more privileges than necessary to their users. This can lead to data compromise by allowing user access to certain types of data (for example, high business impact) that they shouldn’t have.

## Lower exposure of privileged accounts

Securing privileged access is a critical first step to protecting business assets. Minimizing the number of people who have access to secure information or resources reduces the chance of a malicious user getting access, or an authorized user inadvertently affecting a sensitive resource.

Privileged accounts are accounts that administer and manage IT systems. Cyber attackers target these accounts to gain access to an organization’s data and systems. To secure privileged access, you should isolate the accounts and systems from the risk of being exposed to a malicious user.

We recommend that you develop and follow a roadmap to secure privileged access against cyber attackers. For information about creating a detailed roadmap to secure identities and access that are managed or reported in Azure AD, Microsoft Azure, Office 365, and other cloud services, review [Securing privileged access for hybrid and cloud deployments in Azure AD](../active-directory/users-groups-roles/directory-admin-roles-secure.md).

The following summarizes the best practices found in [Securing privileged access for hybrid and cloud deployments in Azure AD](../active-directory/users-groups-roles/directory-admin-roles-secure.md):

**Best practice**: Manage, control, and monitor access to privileged accounts.   
**Detail**: Turn on [Azure AD Privileged Identity Management](../active-directory/privileged-identity-management/active-directory-securing-privileged-access.md). After you turn on Privileged Identity Management, you’ll receive notification email messages for privileged access role changes. These notifications provide early warning when additional users are added to highly privileged roles in your directory.

**Best practice**: Identify and categorize accounts that are in highly privileged roles.   
**Detail**: After turning on Azure AD Privileged Identity Management, view the users who are in the global administrator, privileged role administrator, and other highly privileged roles. Remove any accounts that are no longer needed in those roles, and categorize the remaining accounts that are assigned to admin roles:

- Individually assigned to administrative users, and can be used for non-administrative purposes (for example, personal email)
- Individually assigned to administrative users and designated for administrative purposes only
- Shared across multiple users
- For emergency access scenarios
- For automated scripts
- For external users

**Best practice**: Implement “just in time” (JIT) access to further lower the exposure time of privileges and increase your visibility into the use of privileged accounts.   
**Detail**: Azure AD Privileged Identity Management lets you:

- Limit users to only taking on their privileges JIT.
- Assign roles for a shortened duration with confidence that the privileges are revoked automatically.

**Best practice**: Define at least two emergency access accounts.   
**Detail**: Emergency access accounts help organizations restrict privileged access in an existing Azure Active Directory environment. These accounts are highly privileged and are not assigned to specific individuals. Emergency access accounts are limited to scenarios where normal administrative accounts can’t be used. Organizations must limit the emergency account's usage to only the necessary amount of time.

Evaluate the accounts that are assigned or eligible for the global admin role. If you don’t see any cloud-only accounts by using the `*.onmicrosoft.com` domain (intended for emergency access), create them. For more information, see Managing emergency access administrative accounts in Azure AD.

**Best practice**: Turn on Multi-Factor Authentication, and register all other highly privileged single-user non-federated admin accounts.  
**Detail**: Require Azure Multi-Factor Authentication at sign-in for all individual users who are permanently assigned to one or more of the Azure AD admin roles: global administrator, privileged role administrator, Exchange Online administrator, and SharePoint Online administrator. Use the guide to enable [Multi-Factor Authentication for your admin accounts](../active-directory/authentication/howto-mfa-userstates.md) and ensure that all those users have [registered](https://aka.ms/mfasetup).

**Best practice**: Take steps to mitigate the most frequently used attacked techniques.  
**Detail**:
[Identify Microsoft accounts in administrative roles that need to be switched to work or school accounts](../active-directory/users-groups-roles/directory-admin-roles-secure.md#identify-microsoft-accounts-in-administrative-roles-that-need-to-be-switched-to-work-or-school-accounts)  

[Ensure separate user accounts and mail forwarding for global administrator accounts](../active-directory/users-groups-roles/directory-admin-roles-secure.md)  

[Ensure that the passwords of administrative accounts have recently changed](../active-directory/users-groups-roles/directory-admin-roles-secure.md#ensure-the-passwords-of-administrative-accounts-have-recently-changed)  

[Turn on password hash synchronization](../active-directory/users-groups-roles/directory-admin-roles-secure.md#turn-on-password-hash-synchronization)  

[Require Multi-Factor Authentication for users in all privileged roles as well as exposed users](../active-directory/users-groups-roles/directory-admin-roles-secure.md#require-multi-factor-authentication-mfa-for-users-in-all-privileged-roles-as-well-as-exposed-users)  

[Obtain your Office 365 Secure Score (if using Office 365)](../active-directory/users-groups-roles/directory-admin-roles-secure.md#obtain-your-office-365-secure-score-if-using-office-365)  

[Review the Office 365 security and compliance guidance (if using Office 365)](../active-directory/users-groups-roles/directory-admin-roles-secure.md#review-the-office-365-security-and-compliance-guidance-if-using-office-365)  

[Configure Office 365 Activity Monitoring (if using Office 365)](../active-directory/users-groups-roles/directory-admin-roles-secure.md#configure-office-365-activity-monitoring-if-using-office-365)  

[Establish incident/emergency response plan owners](../active-directory/users-groups-roles/directory-admin-roles-secure.md#establish-incidentemergency-response-plan-owners)  

[Secure on-premises privileged administrative accounts](../active-directory/users-groups-roles/directory-admin-roles-secure.md#turn-on-password-hash-synchronization)

If you don’t secure privileged access, you might find that you have too many users in highly privileged roles and are more vulnerable to attacks. Malicious actors, including cyber attackers, often target admin accounts and other elements of privileged access to gain access to sensitive data and systems by using credential theft.

## Control locations where resources are created

Enabling cloud operators to perform tasks while preventing them from breaking conventions that are needed to manage your organization's resources is very important. Organizations that want to control the locations where resources are created should hard code these locations.

You can use [Azure Resource Manager](../azure-resource-manager/resource-group-overview.md) to create security policies whose definitions describe the actions or resources that are specifically denied. You assign those policy definitions at the desired scope, such as the subscription, the resource group, or an individual resource.

> [!NOTE]
> Security policies are not the same as RBAC. They actually use RBAC to authorize users to create those resources.
>
>

Organizations that are not controlling how resources are created are more susceptible to users who might abuse the service by creating more resources than they need. Hardening the resource creation process is an important step to securing a multitenant scenario.

## Actively monitor for suspicious activities

An active identity monitoring system can quickly detect suspicious behavior and trigger an alert for further investigation. The following table lists two Azure AD capabilities that can help organizations monitor their identities:

**Best practice**: Have a method to identify:

- Attempts to sign in [without being traced](../active-directory/active-directory-reporting-sign-ins-from-unknown-sources.md).
- [Brute force](../active-directory/active-directory-reporting-sign-ins-after-multiple-failures.md) attacks against a particular account.
- Attempts to sign in from multiple locations.
- Sign-ins from [infected devices](../active-directory/active-directory-reporting-sign-ins-from-possibly-infected-devices.md).
- Suspicious IP addresses.

**Detail**: Use Azure AD Premium [anomaly reports](../active-directory/active-directory-view-access-usage-reports.md). Have processes and procedures in place for IT admins to run these reports on a daily basis or on demand (usually in an incident response scenario).

**Best practice**: Have an active monitoring system that notifies you of risks and can adjust risk level (high, medium, or low) to your business requirements.   
**Detail**: Use [Azure AD Identity Protection](../active-directory/active-directory-identityprotection.md), which flags the current risks on its own dashboard and sends daily summary notifications via email. To help protect your organization's identities, you can configure risk-based policies that automatically respond to detected issues when a specified risk level is reached.

Organizations that don’t actively monitor their identity systems are at risk of having user credentials compromised. Without knowledge that suspicious activities are taking place through these credentials, organizations can’t mitigate this type of threat.

## Next step

See [Azure security best practices and patterns](security-best-practices-and-patterns.md) for more security best practices to use when you’re designing, deploying, and managing your cloud solutions by using Azure.
