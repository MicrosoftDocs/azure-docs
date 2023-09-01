---
title: Azure identity & access security best practices | Microsoft Docs
description: This article provides a set of best practices for identity management and access control using built in Azure capabilities.
services: security
documentationcenter: na
author: terrylanfear
manager: RKarlin

ms.assetid: 07d8e8a8-47e8-447c-9c06-3a88d2713bc1
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/29/2023
ms.author: terrylan

---
# Azure Identity Management and access control security best practices

In this article, we discuss a collection of Azure identity management and access control security best practices. These best practices are derived from our experience with [Azure AD](../../active-directory/fundamentals/active-directory-whatis.md) and the experiences of customers like yourself.

For each best practice, we explain:

* What the best practice is
* Why you want to enable that best practice
* What might be the result if you fail to enable the best practice
* Possible alternatives to the best practice
* How you can learn to enable the best practice

This Azure identity management and access control security best practices article is based on a consensus opinion and Azure platform capabilities and feature sets, as they exist at the time this article was written.

The intention in writing this article is to provide a general roadmap to a more robust security posture after deployment guided by our “[5 steps to securing your identity infrastructure](steps-secure-identity.md)” checklist, which walks you through some of our core features and services.

Opinions and technologies change over time and this article will be updated on a regular basis to reflect those changes.

Azure identity management and access control security best practices discussed in this article include:

* Treat identity as the primary security perimeter
* Centralize identity management
* Manage connected tenants
* Enable single sign-on
* Turn on Conditional Access
* Plan for routine security improvements
* Enable password management
* Enforce multi-factor verification for users
* Use role-based access control
* Lower exposure of privileged accounts
* Control locations where resources are located
* Use Azure AD for storage authentication

## Treat identity as the primary security perimeter

Many consider identity to be the primary perimeter for security. This is a shift from the traditional focus on network security. Network perimeters keep getting more porous, and that perimeter defense can’t be as effective as it was before the explosion of [BYOD](/mem/intune/fundamentals/byod-technology-decisions) devices and cloud applications.

[Azure Active Directory (Azure AD)](../../active-directory/fundamentals/active-directory-whatis.md) is the Azure solution for identity and access management. Azure AD is a multitenant, cloud-based directory and identity management service from Microsoft. It combines core directory services, application access management, and identity protection into a single solution.

The following sections list best practices for identity and access security using Azure AD.

**Best practice**: Center security controls and detections around user and service identities.
**Detail**: Use Azure AD to collocate controls and identities.

## Centralize identity management

In a hybrid identity scenario we recommend that you integrate your on-premises and cloud directories. Integration enables your IT team to manage accounts from one location, regardless of where an account is created. Integration also helps your users be more productive by providing a common identity for accessing both cloud and on-premises resources.

**Best practice**: Establish a single Azure AD instance. Consistency and a single authoritative source will increase clarity and reduce security risks from human errors and configuration complexity.  
**Detail**: Designate a single Azure AD directory as the authoritative source for corporate and organizational accounts.

**Best practice**: Integrate your on-premises directories with Azure AD.  
**Detail**: Use [Azure AD Connect](../../active-directory/hybrid/whatis-hybrid-identity.md) to synchronize your on-premises directory with your cloud directory.

> [!Note]
> There are [factors that affect the performance of Azure AD Connect](../../active-directory/hybrid/plan-connect-performance-factors.md). Ensure Azure AD Connect has enough capacity to keep underperforming systems from impeding security and productivity. Large or complex organizations (organizations provisioning more than 100,000 objects) should follow the [recommendations](../../active-directory/hybrid/whatis-hybrid-identity.md) to optimize their Azure AD Connect implementation.

**Best practice**: Don’t synchronize accounts to Azure AD that have high privileges in your existing Active Directory instance.  
**Detail**: Don’t change the default [Azure AD Connect configuration](../../active-directory/hybrid/how-to-connect-sync-configure-filtering.md) that filters out these accounts. This configuration mitigates the risk of adversaries pivoting from cloud to on-premises assets (which could create a major incident).

**Best practice**: Turn on password hash synchronization.  
**Detail**: Password hash synchronization is a feature used to synch user password hashes from an on-premises Active Directory instance to a cloud-based Azure AD instance. This sync helps to protect against leaked credentials being replayed from previous attacks.

Even if you decide to use federation with Active Directory Federation Services (AD FS) or other identity providers, you can optionally set up password hash synchronization as a backup in case your on-premises servers fail or become temporarily unavailable. This sync enables users to sign in to the service by using the same password that they use to sign in to their on-premises Active Directory instance. It also allows Identity Protection to detect compromised credentials by comparing synchronized password hashes with passwords known to be compromised, if a user has used the same email address and password on other services that aren't connected to Azure AD.

For more information, see [Implement password hash synchronization with Azure AD Connect sync](../../active-directory/hybrid/how-to-connect-password-hash-synchronization.md).

**Best practice**: For new application development, use Azure AD for authentication.  
**Detail**: Use the correct capabilities to support authentication:

  - Azure AD for employees
  - [Azure AD B2B](../../active-directory/external-identities/index.yml) for guest users and external partners
  - [Azure AD B2C](../../active-directory-b2c/index.yml) to control how customers sign up, sign in, and manage their profiles when they use your applications

Organizations that don’t integrate their on-premises identity with their cloud identity can have more overhead in managing accounts. This overhead increases the likelihood of mistakes and security breaches.

> [!Note]
> You need to choose which directories critical accounts will reside in and whether the admin workstation used is managed by new cloud services or existing processes. Using existing management and identity provisioning processes can decrease some risks but can also create the risk of an attacker compromising an on-premises account and pivoting to the cloud. You might want to use a different strategy for different roles (for example, IT admins vs. business unit admins). You have two options. First option is to create Azure AD Accounts that aren’t synchronized with your on-premises Active Directory instance. Join your admin workstation to Azure AD, which you can manage and patch by using Microsoft Intune. Second option is to use existing admin accounts by synchronizing to your on-premises Active Directory instance. Use existing workstations in your Active Directory domain for management and security.

## Manage connected tenants
Your security organization needs visibility to assess risk and to determine whether the policies of your organization, and any regulatory requirements, are being followed. You should ensure that your security organization has visibility into all subscriptions connected to your production environment and network (via [Azure ExpressRoute](../../expressroute/expressroute-introduction.md) or [site-to-site VPN](../../vpn-gateway/vpn-gateway-howto-multi-site-to-site-resource-manager-portal.md)). A [Global Administrator](../../active-directory/roles/permissions-reference.md#global-administrator) in Azure AD can elevate their access to the [User Access Administrator](../../role-based-access-control/built-in-roles.md#user-access-administrator) role and see all subscriptions and managed groups connected to your environment.

See [elevate access to manage all Azure subscriptions and management groups](../../role-based-access-control/elevate-access-global-admin.md) to ensure that you and your security group can view all subscriptions or management groups connected to your environment. You should remove this elevated access after you’ve assessed risks.

## Enable single sign-on

In a mobile-first, cloud-first world, you want to enable single sign-on (SSO) to devices, apps, and services from anywhere so your users can be productive wherever and whenever. When you have multiple identity solutions to manage, this becomes an administrative problem not only for IT but also for users who have to remember multiple passwords.

By using the same identity solution for all your apps and resources, you can achieve SSO. And your users can use the same set of credentials to sign in and access the resources that they need, whether the resources are located on-premises or in the cloud.

**Best practice**: Enable SSO.  
**Detail**: Azure AD [extends on-premises Active Directory](../../active-directory/hybrid/whatis-hybrid-identity.md) to the cloud. Users can use their primary work or school account for their domain-joined devices, company resources, and all of the web and SaaS applications that they need to get their jobs done. Users don’t have to remember multiple sets of usernames and passwords, and their application access can be automatically provisioned (or deprovisioned) based on their organization group memberships and their status as an employee. And you can control that access for gallery apps or for your own on-premises apps that you’ve developed and published through the [Azure AD Application Proxy](../../active-directory/app-proxy/application-proxy.md).

Use SSO to enable users to access their [SaaS applications](../../active-directory/manage-apps/what-is-single-sign-on.md) based on their work or school account in Azure AD. This is applicable not only for Microsoft SaaS apps, but also other apps, such as [Google Apps](../../active-directory/saas-apps/google-apps-tutorial.md) and [Salesforce](../../active-directory/saas-apps/salesforce-tutorial.md). You can configure your application to use Azure AD as a [SAML-based identity](../../active-directory/fundamentals/active-directory-whatis.md) provider. As a security control, Azure AD does not issue a token that allows users to sign in to the application unless they have been granted access through Azure AD. You can grant access directly, or through a group that users are a member of.

Organizations that don’t create a common identity to establish SSO for their users and applications are more exposed to scenarios where users have multiple passwords. These scenarios increase the likelihood of users reusing passwords or using weak passwords.

## Turn on Conditional Access

Users can access your organization's resources by using a variety of devices and apps from anywhere. As an IT admin, you want to make sure that these devices meet your standards for security and compliance. Just focusing on who can access a resource is not sufficient anymore.

To balance security and productivity, you need to think about how a resource is accessed before you can make a decision about access control. With Azure AD Conditional Access, you can address this requirement. With Conditional Access, you can make automated access control decisions based on conditions for accessing your cloud apps.

**Best practice**: Manage and control access to corporate resources.  
**Detail**: Configure common Azure AD [Conditional Access policies](../../active-directory/conditional-access/concept-conditional-access-policy-common.md) based on a group, location, and application sensitivity for SaaS apps and Azure AD–connected apps.

**Best practice**: Block legacy authentication protocols.  
**Detail**: Attackers exploit weaknesses in older protocols every day, particularly for password spray attacks. Configure Conditional Access to [block legacy protocols](../../active-directory/conditional-access/howto-conditional-access-policy-block-legacy.md).

## Plan for routine security improvements

Security is always evolving, and it is important to build into your cloud and identity management framework a way to regularly show growth and discover new ways to secure your environment.

Identity Secure Score is a set of recommended security controls that Microsoft publishes that works to provide you a numerical score to objectively measure your security posture and help plan future security improvements. You can also view your score in comparison to those in other industries as well as your own trends over time.

**Best practice**: Plan routine security reviews and improvements based on best practices in your industry.  
**Detail**: Use the Identity Secure Score feature to rank your improvements over time.

## Enable password management

If you have multiple tenants or you want to enable users to [reset their own passwords](https://support.microsoft.com/account-billing/reset-your-work-or-school-password-using-security-info-23dde81f-08bb-4776-ba72-e6b72b9dda9e), it’s important that you use appropriate security policies to prevent abuse.

**Best practice**: Set up self-service password reset (SSPR) for your users.  
**Detail**: Use the Azure AD [self-service password reset](../../active-directory/authentication/tutorial-enable-sspr.md) feature.  

**Best practice**: Monitor how or if SSPR is really being used.  
**Detail**: Monitor the users who are registering by using the Azure AD [Password Reset Registration Activity report](../../active-directory/authentication/howto-sspr-reporting.md). The reporting feature that Azure AD provides helps you answer questions by using prebuilt reports. If you're appropriately licensed, you can also create custom queries.

**Best practice**: Extend cloud-based password policies to your on-premises infrastructure.  
**Detail**: Enhance password policies in your organization by performing the same checks for on-premises password changes as you do for cloud-based password changes. Install [Azure AD password protection](../../active-directory/authentication/concept-password-ban-bad.md) for Windows Server Active Directory agents on-premises to extend banned password lists to your existing infrastructure. Users and admins who change, set, or reset passwords on-premises are required to comply with the same password policy as cloud-only users.

## Enforce multi-factor verification for users

We recommend that you require two-step verification for all of your users. This includes administrators and others in your organization who can have a significant impact if their account is compromised (for example, financial officers).

There are multiple options for requiring two-step verification. The best option for you depends on your goals, the Azure AD edition you’re running, and your licensing program. See [How to require two-step verification for a user](../../active-directory/authentication/howto-mfa-userstates.md) to determine the best option for you. See the [Azure AD](https://azure.microsoft.com/pricing/details/active-directory/) and [Azure AD Multi-Factor Authentication](https://azure.microsoft.com/pricing/details/multi-factor-authentication/) pricing pages for more information about licenses and pricing.

Following are options and benefits for enabling two-step verification:

**Option 1**: Enable MFA for all users and login methods with Azure AD Security Defaults  
**Benefit**: This option enables you to easily and quickly enforce MFA for all users in your environment with a stringent policy to:

* Challenge administrative accounts and administrative logon mechanisms
* Require MFA challenge via Microsoft Authenticator for all users
* Restrict legacy authentication protocols.

This method is available to all licensing tiers but is not able to be mixed with existing Conditional Access policies. You can find more information in [Azure AD Security Defaults](../../active-directory/fundamentals/concept-fundamentals-security-defaults.md)

**Option 2**: [Enable Multi-Factor Authentication by changing user state](../../active-directory/authentication/howto-mfa-userstates.md).   
**Benefit**: This is the traditional method for requiring two-step verification. It works with both [Azure AD Multi-Factor Authentication in the cloud and Azure AD Multi-Factor Authentication Server](../../active-directory/authentication/concept-mfa-howitworks.md). Using this method requires users to perform two-step verification every time they sign in and overrides Conditional Access policies.

To determine where Multi-Factor Authentication needs to be enabled, see [Which version of Azure AD MFA is right for my organization?](../../active-directory/authentication/concept-mfa-howitworks.md).

**Option 3**: [Enable Multi-Factor Authentication with Conditional Access policy](../../active-directory/authentication/howto-mfa-getstarted.md).  
**Benefit**: This option allows you to prompt for two-step verification under specific conditions by using [Conditional Access](../../active-directory/conditional-access/concept-conditional-access-policy-common.md). Specific conditions can be user sign-in from different locations, untrusted devices, or applications that you consider risky. Defining specific conditions where you require two-step verification enables you to avoid constant prompting for your users, which can be an unpleasant user experience.

This is the most flexible way to enable two-step verification for your users. Enabling a Conditional Access policy works only for Azure AD Multi-Factor Authentication in the cloud and is a premium feature of Azure AD. You can find more information on this method in [Deploy cloud-based Azure AD Multi-Factor Authentication](../../active-directory/authentication/howto-mfa-getstarted.md).

**Option 4**: Enable Multi-Factor Authentication with Conditional Access policies by evaluating [Risk-based Conditional Access policies](../../active-directory/conditional-access/howto-conditional-access-policy-risk.md).   
**Benefit**: This option enables you to:

* Detect potential vulnerabilities that affect your organization’s identities.
* Configure automated responses to detected suspicious actions that are related to your organization’s identities.
* Investigate suspicious incidents and take appropriate action to resolve them.

This method uses the Azure AD Identity Protection risk evaluation to determine if two-step verification is required based on user and sign-in risk for all cloud applications. This method requires Azure Active Directory P2 licensing. You can find more information on this method in [Azure Active Directory Identity Protection](../../active-directory/identity-protection/overview-identity-protection.md).

> [!Note]
> Option 2, enabling Multi-Factor Authentication by changing the user state, overrides Conditional Access policies. Because options 3 and 4 use Conditional Access policies, you cannot use option 2 with them.

Organizations that don’t add extra layers of identity protection, such as two-step verification, are more susceptible for credential theft attack. A credential theft attack can lead to data compromise.

## Use role-based access control

Access management for cloud resources is critical for any organization that uses the cloud. [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) helps you manage who has access to Azure resources, what they can do with those resources, and what areas they have access to.

Designating groups or individual roles responsible for specific functions in Azure helps avoid confusion that can lead to human and automation errors that create security risks. Restricting access based on the [need to know](https://en.wikipedia.org/wiki/Need_to_know) and [least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) security principles is imperative for organizations that want to enforce security policies for data access.

Your security team needs visibility into your Azure resources in order to assess and remediate risk. If the security team has operational responsibilities, they need additional permissions to do their jobs.

You can use [Azure RBAC](../../role-based-access-control/overview.md) to assign permissions to users, groups, and applications at a certain scope. The scope of a role assignment can be a subscription, a resource group, or a single resource.

**Best practice**: Segregate duties within your team and grant only the amount of access to users that they need to perform their jobs. Instead of giving everybody unrestricted permissions in your Azure subscription or resources, allow only certain actions at a particular scope.  
**Detail**: Use [Azure built-in roles](../../role-based-access-control/built-in-roles.md) in Azure to assign privileges to users.

> [!Note]
> Specific permissions create unneeded complexity and confusion, accumulating into a “legacy” configuration that’s difficult to fix without fear of breaking something. Avoid resource-specific permissions. Instead, use management groups for enterprise-wide permissions and resource groups for permissions within subscriptions. Avoid user-specific permissions. Instead, assign access to groups in Azure AD.

**Best practice**: Grant security teams with Azure responsibilities access to see Azure resources so they can assess and remediate risk.  
**Detail**: Grant security teams the Azure RBAC [Security Reader](../../role-based-access-control/built-in-roles.md#security-reader) role. You can use the root management group or the segment management group, depending on the scope of responsibilities:

* **Root management group** for teams  responsible for all enterprise resources
* **Segment management group** for teams with limited scope (commonly because of regulatory or other organizational boundaries)

**Best practice**: Grant the appropriate permissions to security teams that have direct operational responsibilities.  
**Detail**: Review the Azure built-in roles for the appropriate role assignment. If the built-in roles don't meet the specific needs of your organization, you can create [Azure custom roles](../../role-based-access-control/custom-roles.md). As with built-in roles, you can assign custom roles to users, groups, and service principals at subscription, resource group, and resource scopes.

**Best practices**: Grant Microsoft Defender for Cloud access to security roles that need it. Defender for Cloud allows security teams to quickly identify and remediate risks.  
**Detail**: Add security teams with these needs to the Azure RBAC [Security Admin](../../role-based-access-control/built-in-roles.md#security-admin) role so they can view security policies, view security states, edit security policies, view alerts and recommendations, and dismiss alerts and recommendations. You can do this by using the root management group or the segment management group, depending on the scope of responsibilities.

Organizations that don’t enforce data access control by using capabilities like Azure RBAC might be giving more privileges than necessary to their users. This can lead to data compromise by allowing users to access types of data (for example, high business impact) that they shouldn’t have.

## Lower exposure of privileged accounts

Securing privileged access is a critical first step to protecting business assets. Minimizing the number of people who have access to secure information or resources reduces the chance of a malicious user getting access, or an authorized user inadvertently affecting a sensitive resource.

Privileged accounts are accounts that administer and manage IT systems. Cyber attackers target these accounts to gain access to an organization’s data and systems. To secure privileged access, you should isolate the accounts and systems from the risk of being exposed to a malicious user.

We recommend that you develop and follow a roadmap to secure privileged access against cyber attackers. For information about creating a detailed roadmap to secure identities and access that are managed or reported in Azure AD, Microsoft Azure, Microsoft 365, and other cloud services, review [Securing privileged access for hybrid and cloud deployments in Azure AD](../../active-directory/roles/security-planning.md).

The following summarizes the best practices found in [Securing privileged access for hybrid and cloud deployments in Azure AD](../../active-directory/roles/security-planning.md):

**Best practice**: Manage, control, and monitor access to privileged accounts.   
**Detail**: Turn on [Azure AD Privileged Identity Management](../../active-directory/roles/security-planning.md). After you turn on Privileged Identity Management, you’ll receive notification email messages for privileged access role changes. These notifications provide early warning when additional users are added to highly privileged roles in your directory.

**Best practice**: Ensure all critical admin accounts are managed Azure AD accounts.
**Detail**: Remove any consumer accounts from critical admin roles (for example, Microsoft accounts like hotmail.com, live.com, and outlook.com).

**Best practice**: Ensure all critical admin roles have a separate account for administrative tasks in order to avoid phishing and other attacks to compromise administrative privileges.  
**Detail**: Create a separate admin account that’s assigned the privileges needed to perform the administrative tasks. Block the use of these administrative accounts for daily productivity tools like Microsoft 365 email or arbitrary web browsing.

**Best practice**: Identify and categorize accounts that are in highly privileged roles.   
**Detail**: After turning on Azure AD Privileged Identity Management, view the users who are in the global administrator, privileged role administrator, and other highly privileged roles. Remove any accounts that are no longer needed in those roles, and categorize the remaining accounts that are assigned to admin roles:

* Individually assigned to administrative users, and can be used for non-administrative purposes (for example, personal email)
* Individually assigned to administrative users and designated for administrative purposes only
* Shared across multiple users
* For emergency access scenarios
* For automated scripts
* For external users

**Best practice**: Implement “just in time” (JIT) access to further lower the exposure time of privileges and increase your visibility into the use of privileged accounts.   
**Detail**: Azure AD Privileged Identity Management lets you:

* Limit users to only taking on their privileges JIT.
* Assign roles for a shortened duration with confidence that the privileges are revoked automatically.

**Best practice**: Define at least two emergency access accounts.   
**Detail**: Emergency access accounts help organizations restrict privileged access in an existing Azure Active Directory environment. These accounts are highly privileged and are not assigned to specific individuals. Emergency access accounts are limited to scenarios where normal administrative accounts can’t be used. Organizations must limit the emergency account's usage to only the necessary amount of time.

Evaluate the accounts that are assigned or eligible for the global admin role. If you don’t see any cloud-only accounts by using the `*.onmicrosoft.com` domain (intended for emergency access), create them. For more information, see [Managing emergency access administrative accounts in Azure AD](../../active-directory/roles/security-emergency-access.md).

**Best practice**: Have a “break glass" process in place in case of an emergency.  
**Detail**: Follow the steps in [Securing privileged access for hybrid and cloud deployments in Azure AD](../../active-directory/roles/security-planning.md).

**Best practice**: Require all critical admin accounts to be password-less (preferred), or require Multi-Factor Authentication.  
**Detail**: Use the [Microsoft Authenticator app](../../active-directory/authentication/howto-authentication-passwordless-phone.md) to sign in to any Azure AD account without using a password. Like [Windows Hello for Business](/windows/security/identity-protection/hello-for-business/hello-identity-verification), the Microsoft Authenticator uses key-based authentication to enable a user credential that’s tied to a device and uses biometric authentication or a PIN.

Require Azure AD Multi-Factor Authentication at sign-in for all individual users who are permanently assigned to one or more of the Azure AD admin roles: Global Administrator, Privileged Role Administrator, Exchange Online Administrator, and SharePoint Online Administrator. Enable [Multi-Factor Authentication for your admin accounts](../../active-directory/authentication/howto-mfa-userstates.md) and ensure that admin account users have registered.

**Best practice**: For critical admin accounts, have an admin workstation where production tasks aren’t allowed (for example, browsing and email). This will protect your admin accounts from attack vectors that use browsing and email and significantly lower your risk of a major incident.  
**Detail**: Use an admin workstation. Choose a level of workstation security:

- Highly secure productivity devices provide advanced security for browsing and other productivity tasks.
- [Privileged Access Workstations (PAWs)](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/) provide a dedicated operating system that’s protected from internet attacks and threat vectors for sensitive tasks.

**Best practice**: Deprovision admin accounts when employees leave your organization.  
**Detail**: Have a process in place that disables or deletes admin accounts when employees leave your organization.

**Best practice**: Regularly test admin accounts by using current attack techniques.  
**Detail**: Use Microsoft 365 Attack Simulator or a third-party offering to run realistic attack scenarios in your organization. This can help you find vulnerable users before a real attack occurs.

**Best practice**: Take steps to mitigate the most frequently used attacked techniques.  
**Detail**:
[Identify Microsoft accounts in administrative roles that need to be switched to work or school accounts](../../active-directory/roles/security-planning.md#identify-microsoft-accounts-in-administrative-roles-that-need-to-be-switched-to-work-or-school-accounts)  

[Ensure separate user accounts and mail forwarding for global administrator accounts](../../active-directory/roles/security-planning.md)  

[Ensure that the passwords of administrative accounts have recently changed](../../active-directory/roles/security-planning.md#ensure-the-passwords-of-administrative-accounts-have-recently-changed)  

[Turn on password hash synchronization](../../active-directory/roles/security-planning.md#turn-on-password-hash-synchronization)  

[Require Multi-Factor Authentication for users in all privileged roles as well as exposed users](../../active-directory/roles/security-planning.md#require-multi-factor-authentication-for-users-in-privileged-roles-and-exposed-users)  

[Obtain your Microsoft 365 Secure Score (if using Microsoft 365)](../../active-directory/roles/security-planning.md#obtain-your-microsoft-365-secure-score-if-using-microsoft-365)  

[Review the Microsoft 365 security guidance (if using Microsoft 365)](../../active-directory/roles/security-planning.md#review-the-microsoft-365-security-and-compliance-guidance-if-using-microsoft-365)  

[Configure Microsoft 365 Activity Monitoring (if using Microsoft 365)](../../active-directory/roles/security-planning.md#configure-microsoft-365-activity-monitoring-if-using-microsoft-365)  

[Establish incident/emergency response plan owners](../../active-directory/roles/security-planning.md#establish-incidentemergency-response-plan-owners)  

[Secure on-premises privileged administrative accounts](../../active-directory/roles/security-planning.md#turn-on-password-hash-synchronization)

If you don’t secure privileged access, you might find that you have too many users in highly privileged roles and are more vulnerable to attacks. Malicious actors, including cyber attackers, often target admin accounts and other elements of privileged access to gain access to sensitive data and systems by using credential theft.

## Control locations where resources are created

Enabling cloud operators to perform tasks while preventing them from breaking conventions that are needed to manage your organization's resources is very important. Organizations that want to control the locations where resources are created should hard code these locations.

You can use [Azure Resource Manager](../../azure-resource-manager/management/overview.md) to create security policies whose definitions describe the actions or resources that are specifically denied. You assign those policy definitions at the desired scope, such as the subscription, the resource group, or an individual resource.

> [!NOTE]
> Security policies are not the same as Azure RBAC. They actually use Azure RBAC to authorize users to create those resources.
>
>

Organizations that are not controlling how resources are created are more susceptible to users who might abuse the service by creating more resources than they need. Hardening the resource creation process is an important step to securing a multitenant scenario.

## Actively monitor for suspicious activities

An active identity monitoring system can quickly detect suspicious behavior and trigger an alert for further investigation. The following table lists Azure AD capabilities that can help organizations monitor their identities:

**Best practice**: Have a method to identify:

- Attempts to sign in [without being traced](../../active-directory/reports-monitoring/howto-access-activity-logs.md).
- [Brute force](../../active-directory/reports-monitoring/howto-access-activity-logs.md) attacks against a particular account.
- Attempts to sign in from multiple locations.
- Sign-ins from [infected devices](../../active-directory/reports-monitoring/howto-access-activity-logs.md).
- Suspicious IP addresses.

**Detail**: Use Azure AD Premium [anomaly reports](../../active-directory/reports-monitoring/overview-reports.md). Have processes and procedures in place for IT admins to run these reports on a daily basis or on demand (usually in an incident response scenario).

**Best practice**: Have an active monitoring system that notifies you of risks and can adjust risk level (high, medium, or low) to your business requirements.   
**Detail**: Use [Azure AD Identity Protection](../../active-directory/identity-protection/overview-identity-protection.md), which flags the current risks on its own dashboard and sends daily summary notifications via email. To help protect your organization's identities, you can configure risk-based policies that automatically respond to detected issues when a specified risk level is reached.

Organizations that don’t actively monitor their identity systems are at risk of having user credentials compromised. Without knowledge that suspicious activities are taking place through these credentials, organizations can’t mitigate this type of threat.

## Use Azure AD for storage authentication
[Azure Storage](../../storage/blobs/authorize-access-azure-active-directory.md) supports authentication and authorization with Azure AD for Blob storage and Queue storage. With Azure AD authentication, you can use the Azure role-based access control to grant specific permissions to users, groups, and applications down to the scope of an individual blob container or queue.

We recommend that you use [Azure AD for authenticating access to storage](https://azure.microsoft.com/blog/azure-storage-support-for-azure-ad-based-access-control-now-generally-available/).

## Next step

See [Azure security best practices and patterns](best-practices-and-patterns.md) for more security best practices to use when you’re designing, deploying, and managing your cloud solutions by using Azure.
