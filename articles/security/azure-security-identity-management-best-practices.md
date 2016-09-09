<properties
   pageTitle="Azure Identity Management and Access Control Security Best Practices | Microsoft Azure"
   description="This article provides a set of best practices for identity management and access control using built in Azure capabilities."
   services="security"
   documentationCenter="na"
   authors="YuriDio"
   manager="swadhwa"
   editor="TomSh"/>

<tags
   ms.service="security"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/26/2016"
   ms.author="yurid"/>

# Azure Identity Management and access control security best practices

Many consider identity to be the new boundary layer for security, taking over that role from the traditional network-centric perspective. This evolution of the primary pivot for security attention and investments come from the fact that network perimeters have become increasingly porous and that perimeter defense cannot be as effective as they once were prior to the explosion of [BYOD](http://aka.ms/byodcg) devices and cloud applications.

In this article we will discuss a collection of Azure identity management and access control security best practices. These best practices are derived from our experience with [Azure AD](../active-directory/active-directory-whatis.md) and the experiences of customers like yourself.

For each best practice, we’ll explain:

- What the best practice is
- Why you want to enable that best practice
- What might be the result if you fail to enable the best practice
- Possible alternatives to the best practice
- How you can learn to enable the best practice

This Azure identity management and access control security best practices article is based on a consensus opinion and Azure platform capabilities and feature sets, as they exist at the time this article was written. Opinions and technologies change over time and this article will be updated on a regular basis to reflect those changes.

Azure identity management and access control security best practices discussed in this article include:

- Centralize your identity management
- Enable Single Sign-On (SSO)
- Deploy password management
- Enforce multi-factor authentication (MFA) for users
- Use role based access control (RBAC)
- Control locations where resources are created using resource manager
- Guide developers to leverage identity capabilities for SaaS apps
- Actively monitor for suspicious activities

## Centralize your identity management

One important step towards securing your identity is to ensure that IT can manage accounts from one single location regarding where this account was created. While the majority of the enterprises IT organizations will have their primary account directory on-premises, hybrid cloud deployments are on the rise and it is important that you understand how to integrate on-premises and cloud directories and provide a seamless experience to the end user.

To accomplish this [hybrid identity](../active-directory/active-directory-hybrid-identity-design-considerations-overview.md) scenario we recommend two options:

- Synchronize your on-premises directory with your cloud directory using Azure AD Connect
- Federate your on-premises identity with your cloud directory using [Active Directory Federation Services](https://msdn.microsoft.com/library/bb897402.aspx) (AD FS)

Organizations that fail to integrate their on-premises identity with their cloud identity will experience increased administrative overhead in managing accounts, which increases the likelihood of mistakes and security breaches.

For more information on Azure AD synchronization, please read the article [Integrating your on-premises identities with Azure Active Directory](../active-directory/active-directory-aadconnect.md).

## Enable Single Sign-On (SSO)

When you have multiple directories to manage, this becomes an administrative problem not only for IT, but also for end users that will have to remember multiple passwords. By using [SSO](https://azure.microsoft.com/documentation/videos/overview-of-single-sign-on/) you will provide your users the ability of use the same set of credentials to sign-in and access the resources that they need, regardless where this resource is located on-premises or in the cloud.

Use SSO to enable users to access their [SaaS applications](../active-directory/active-directory-appssoaccess-whatis.md) based on their organizational account in Azure AD. This is applicable not only for Microsoft SaaS apps, but also other apps, such as [Google Apps](../active-directory/active-directory-saas-google-apps-tutorial.md) and [Salesforce](../active-directory/active-directory-saas-salesforce-tutorial.md). Your application can be configured to use Azure AD as a [SAML-based identity](../active-directory/fundamentals-identity.md) provider. As a security control, Azure AD will not issue a token allowing them to sign into the application unless they have been granted access using Azure AD. You may grant access directly, or through a group that they are a member of.

> [AZURE.NOTE] the decision to use SSO will impact how you integrate your on-premises directory with your cloud directory. If you want SSO, you will need to use federation, because directory synchronization will only provide [same sign-on experience](../active-directory/active-directory-aadconnect.md).

Organizations that do not enforce SSO for their users and applications are more exposed to scenarios where users will have multiple passwords which directly increases the likelihood of users reusing passwords or using weak passwords.

You can learn more about Azure AD SSO by reading the article [AD FS management and customizaton with Azure AD Connect](../active-directory/active-directory-aadconnect-federation-management.md).

## Deploy password management

In scenarios where you have multiple tenants or you want to enable users to [reset their own password](../active-directory/active-directory-passwords-update-your-own-password.md), it is important that you use appropriate security policies to prevent abuse. In Azure you can leverage the self-service password reset capability and customize the security options to meet your business requirements.

It is particularly important to obtain feedback from these users and learn from their experiences as they try to perform these steps. Based on these experiences, elaborate a plan to mitigate potential issues that may occur during the deployment for a larger group. It is also recommended that you use the [Password Reset Registration Activity report](../active-directory/active-directory-passwords-get-insights.md) to monitor the users that are registering.

Organizations that want to avoid password change support calls but do enable users to reset their own passwords are more susceptible to a higher call volume to the service desk due to password issues. In organizations that have multiple tenants, it is imperative that you implement this type of capability and enable users to perform password reset within security boundaries that were established in the security policy.

You can learn more about password reset by reading the article [Deploying Password Management and training users to use it](../active-directory/active-directory-passwords-best-practices.md).

## Enforce multi-factor authentication (MFA) for users

For organizations that need to be compliant with industry standards, such as [PCI DSS version 3.2](http://blog.pcisecuritystandards.org/preparing-for-pci-dss-32), multi-factor authentication is a must have capability for authenticate users. Beyond being compliant with industry standards, enforcing MFA to authenticate users can also help organizations to mitigate credential theft type of attack, such as [Pass-the-Hash (PtH)](http://aka.ms/PtHPaper).

By enabling Azure MFA for your users, you are adding a second layer of security to user sign-ins and transactions. In this case, a transaction might be accessing a document located in a file server or in your SharePoint Online. Azure MFA also helps IT to reduce the likelihood that a compromised credential will have access to organization’s data.

For example: you enforce Azure MFA for your users and configure it to use a phone call or text message as verification. If the user’s credentials are compromised, the attacker won’t be able to access any resource since he will not have access to user’s phone. Organizations that do not add extra layers of identity protection are more susceptible for credential theft attack, which may lead to data compromise.

One alternative for organizations that want to keep the entire authentication control on-premises is to use [Azure Multi-Factor Authentication Server](../multi-factor-authentication/multi-factor-authentication-get-started-server.md), also called MFA on-premises. By using this method you will still be able to enforce multi-factor authentication, while keeping the MFA server on-premises.

For more information on Azure MFA, please read the article [Getting started with Azure Multi-Factor Authentication in the cloud](../multi-factor-authentication/multi-factor-authentication-get-started-cloud.md).

## Use role based access control (RBAC)

Restricting access based on the [need to know](https://en.wikipedia.org/wiki/Need_to_know) and [least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) security principles is imperative for organizations that want to enforce security policies for data access. Azure Role-Based Access Control (RBAC) can be used to assign permissions to users, groups, and applications at a certain scope. The scope of a role assignment can be a subscription, a resource group, or a single resource.

You can leverage [built in RBAC](../active-directory/role-based-access-built-in-roles.md) roles in Azure to assign privileges to users. Consider using *Storage Account Contributor* for cloud operators that need to manage storage accounts and *Classic Storage Account Contributor* role to manage classic storage accounts. For cloud operators that needs to manage VMs and storage account, consider adding them to *Virtual Machine Contributor* role.

Organizations that do not enforce data access control by leveraging capabilities such as RBAC may be giving more privileges than necessary to their users. This can lead to data compromise by allow users access to certain types of types of data (e.g., high business impact) that they shouldn’t have in the first place.

You can learn more about Azure RBAC by reading the article [Azure Role-Based Access Control](../active-directory/role-based-access-control-configure.md).

## Control locations where resources are created using resource manager

Enabling cloud operators to perform tasks while preventing them from breaking conventions that are needed to manage your organization's resources is very important. Organizations that want to control the locations where resources are created should hard code these locations.

To achieve this, organizations can create security policies that have definitions that describe the actions or resources that are specifically denied. You assign those policy definitions at the desired scope, such as the subscription, resource group, or an individual resource.

> [AZURE.NOTE] this is not the same as RBAC, it actually leverages RBAC to authenticate the users that have privilege to create those resources.

Leverage [Azure Resource Manager](../resource-group-overview.md) to create custom policies also for scenarios where the organization wants to allow operations only when the appropriate cost center is associated; otherwise, they will deny the request.

Organizations that are not controlling how resources are created are more susceptible to users that may abuse the service by creating more resources than they need. Hardening the resource creation process is an important step to secure a multi-tenant scenario.

You can learn more about creating policies with Azure Resource Manager by reading the article [Use Policy to manage resources and control access](../resource-manager-policy.md).

## Guide developers to leverage identity capabilities for SaaS apps

User identity will be leveraged in many scenarios when users access [SaaS apps](https://azure.microsoft.com/marketplace/active-directory/all/) that can be integrated with on-premises or cloud directory. First and foremost, we recommend that developers use a secure methodology to develop these apps, such as [Microsoft Security Development Lifecycle (SDL)](https://www.microsoft.com/sdl/default.aspx). Azure AD simplifies authentication for developers by providing identity as a service, with support for industry-standard protocols such as [OAuth 2.0](http://oauth.net/2/) and [OpenID Connect](http://openid.net/connect/), as well as open source libraries for different platforms.

Make sure to register any application that outsources authentication to Azure AD, this is a mandatory procedure. The reason behind this is because Azure AD needs to coordinate the communication with the application when handling sign-on (SSO) or exchanging tokens. The user’s session expires when the lifetime of the token issued by Azure AD expires. Always evaluate if your application should use this time or if you can reduce this time. Reducing the lifetime can act as a security measure that will force users to sign out based on a period of inactivity.

Organizations that do not enforce identity control to access apps and do not guide their developers on how to securely integrate apps with their identity management system may be more susceptible to credential theft type of attack, such as [weak authentication and session management described in Open Web Application Security Project (OWASP) Top 10](https://www.owasp.org/index.php/OWASP_Top_Ten_Cheat_Sheet).

You can learn more about authentication scenarios for SaaS apps by reading [Authentication Scenarios for Azure AD](../active-directory/active-directory-authentication-scenarios.md).

## Actively monitor for suspicious activities

According to [Verizon 2016 Data Breach report](http://www.verizonenterprise.com/verizon-insights-lab/dbir/2016/), credential compromise is still in the rise and becoming one of the most profitable businesses for cyber criminals. For this reason is important to have an active identity monitor system in place that can quickly detect suspicious behavior activity and trigger an alert for further investigation. Azure AD has two major capabilities that can help organizations monitor their identities: Azure AD Premium [anomaly reports](../active-directory/active-directory-view-access-usage-reports.md) and Azure AD [identity protection](../active-directory/active-directory-identityprotection.md) capability.

Make sure to use the anomaly reports to identify attempts to sign in [without being traced](../active-directory/active-directory-reporting-sign-ins-from-unknown-sources.md), [brute force](../active-directory/active-directory-reporting-sign-ins-after-multiple-failures.md) attacks against a particular account, attempts to sign in from multiple locations, sign in from [infected devices](../active-directory/active-directory-reporting-sign-ins-from-possibly-infected-devices.md) and suspicious IP addresses. Keep in mind that these are reports. In other words, you must have processes and procedures in place for IT admins to run these reports on the daily basis or on demand (usually in an incident response scenario).

In contrast, Azure AD identity protection is an active monitoring system and it will flag the current risks on its own dashboard. Besides that, you will also receive daily summary notifications via email. We recommend that you adjust the risk level according to your business requirements. The risk level for a risk event is an indication (High, Medium, or Low) of the severity of the risk event. The risk level helps Identity Protection users prioritize the actions they must take to reduce the risk to their organization.

Organizations that do not actively monitor their identity systems are at risk of having user credentials compromised. Without knowledge that suspicious activities are taking place using these credentials, organizations won’t be able to mitigate this type of threat.
You can learn more about Azure Identity protection by reading [Azure Active Directory Identity Protection](../active-directory/active-directory-identityprotection.md).
