---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Managing emergency access adminstrative accounts in Azure AD | Microsoft Docs
description: Describes how to use emergency access accounts to help organizations restrict privileged access within an existing Azure Active Directory environment. 
services: active-directory 
keywords: Don’t add or edit keywords without consulting your SEO champ.
author: markwahl-msft
ms.author: billmath
ms.date: 12/13/2017
ms.topic: article-type-from-white-list
ms.service: active-directory
ms.workload: identity
ms.custom: it-pro
ms.reviewer: markwahl-msft
---


# Managing emergency access administrative accounts in Azure AD 

For most day-to-day activities, global administrative role rights are not needed.  Users should not be permanently assigned to the role, as the user may inadvertently perform a task with higher permissions than required. When a user does need to act as a global administrator, they should activate the role assignment using Azure AD PIM, either on their own account or an alternate administrative account.

In addition to users taking on administrative access rights for themselves, customers need to prepare to ensure that they do not get into a situation where they could be inadvertently locked out of administration of their Azure AD tenant due to their inability to sign in or activate an existing individual user's account as an administrator.  They can mitigate the impact of accidental lack of administrative access through storing in their tenant two or more *emergency access accounts*.

Emergency access accounts help organizations restrict privileged access within an existing Azure Active Directory environment. These accounts are highly privileged and are not assigned to specific individuals. Emergency access accounts are limited to emergency for 'break glass' scenarios where normal administrative accounts cannot be used.  Organizations must ensure the aim of controlling and reducing the emergency account's usage to only that time for which it is necessary.

Scenarios in which an organization might need to make use of an emergency access account:

 - The user accounts are federated and federation is unavailable due to a network break or an outage of the identity provider.  For example, if the identity provider host in the customer’s environment has gone down, then a user may not be able to sign in when Azure AD redirects to their identity provider. 
 - The admins are registered through MFA and all of their individual devices are unavailable.  It is possible that users are not able to complete multi-factor authentication to activate a role, if for instance a cell network outage may prevent users from being able to answer phone calls or receive text messages, and that was the only mechanism that they registered for their device. 
 - The last person who had global administrative access left the organization.  Azure AD prevents the last global admin account from being deleted, but does not prevent the account from being deleted or disabled on-premises, leading to a situation where the organization is unable to recover that account.

## Initial configuration

Create two or more emergency access accounts.  These should be cloud-only accounts using the *.onmicrosoft.com domain, that are not federated or synchronized from an on-premises environment.  

They should not be associated to any individual user in the organization.  Organizations will need to ensure the credentials for these accounts are kept secure and known only to individuals who are authorized to use them. 

Note: Typically, the account password for an emergency access account is separated into two or three parts, and then written on separate pieces of paper and stored in secure, fireproof safes that are in secure separate locations. Make sure that your emergency access accounts are not connected with any employee-supplied mobile phones, hardware tokens that travel with individual employees, or other employee-specific credentials, in case that individual employee is unreachable at the time the credential is needed. 

### Initial configuration with permanent assignments

One option is to assign those users as permanent members of the Global Administrator role.  This would be appropriate for organizations which do not have Azure AD Premium P2 subscriptions.

Azure AD recommends that you require multi-factor authentication (MFA) for all your individual users, including administrators and all other users who would have significant impact if their account was compromised (e.g. financial officers). This reduces the risk of an attack due to a compromised password. However, if your organization does not have shared devices, then MFA may not be possible for these emergency access accounts.  If you are configuring a conditional access policy to require [MFA registration for every admin](https://docs.microsoft.com/en-us/azure/multi-factor-authentication/multi-factor-authentication-get-started-user-states) for Azure AD and other connected SaaS apps, you may need to configure policy exclusions to exclude emergency access accounts from this requirement.

### Initial configuration with approvals

Another option is to configure those users as eligible and approvers to activate the Global Administrator role.  This would require the organization to have Azure AD Premium P2 subscriptions, as well as a MFA option suitable for shared use among multiple individuals and the network environment.  This is because activation of the Global Administrator role requires the user to have previously performed MFA.  Learn more at [How to require MFA in Azure AD Privileged Identity Management](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-privileged-identity-management-how-to-require-mfa).

Using MFA associated with personal devices are not recommended for emergency access accounts, because in an actual emergency one person who needs to have access to a MFA-registered device might not be the one who is holding the personal device.  Also consider the threat landscape, if due to unforeseen circumstances mobile phone or other networks are unavailable during a natural disaster emergency.  Therefore, it is important to ensure that any registered devices are kept in a known, secure location that has multiple means of communicating with Azure AD.

## Ongoing monitoring

Monitor the [Azure AD sign in and audit logs](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-reporting-activity-sign-ins) for any sign-ins and audit activity from the emergency access accounts.  Normally those accounts should not be signing in and should not be making changes, so use of them is likely to be anomalous and require security investigation.

## Account check validation must occur at regular intervals

Perform the following steps at least:
 - Every 90 days
 - When there has been a recent change in IT staff – a job change, departure or new hire
 - When the Azure AD subscriptions in the organization have changed

To ensure staff are trained in how to use the emergency access accounts:

1.	Ensure security monitoring staff are aware that the account check activity is ongoing.
2.	Validate that the cloud user accounts can sign in and activate their roles, and that users who may need to perform these steps during an emergency are trained on the process.
3.	Ensure that they have not been registered for MFA or SSPR to any individual user’s device or personal details.  
4. If the accounts are registered for MFA to a device, for use during role activation, ensure the device is accessible to all administrators who may need to use it during an emergency.  Also verify that the device is registered through at least two mechanisms that do not share a common failure mode (e.g., the device could communicate to the Internet both through a facility's wireless network as well as via a cell provider network).
5.	Update the credentials.

## Next steps
- [Add a cloud-based user](add-users-azure-active-directory.md) and [assign the new user to the global administrator role](active-directory-users-assign-role-azure-portal.md)
- [Sign up for Azure Active Directory Premium](active-directory-get-started-premium.md), if you haven’t already
- [Require Azure MFA for individual users assigned as administrators](../../multi-factor-authentication/multi-factor-authentication-get-started-user-states.md)
- [Configure additional protections for global administrators in Office 365](https://support.office.com/article/Protect-your-Office-365-global-administrator-accounts-6b4ded77-ac8d-42ed-8606-c014fd947560), if you are using Office 365
- [Perform an access review of global administrators](active-directory-privileged-identity-management-how-to-start-security-review.md) and [transition existing global administrators to more specific administrator roles](active-directory-assign-admin-roles-azure-portal.md)

