---

title: Manage emergency-access administrative accounts in Azure AD | Microsoft Docs
description: This article describes how to use emergency access accounts to help organizations restrict privileged access within an existing Azure Active Directory environment. 
services: active-directory 
author: markwahl-msft
ms.author: billmath
ms.date: 12/13/2017
ms.topic: article-type-from-white-list
ms.service: active-directory
ms.workload: identity
ms.custom: it-pro
ms.reviewer: markwahl-msft
---


# Manage emergency-access administrative accounts in Azure AD 

For most day-to-day activities, *global administrator* rights are not needed by your users. Users should not be permanently assigned to the role, because they might inadvertently perform a task that requires higher permissions than they should have. When users don't need to act as a global administrator, they should activate the role assignment by using Azure Active Directory (Azure AD) Privileged Identity Management (PIM), on either their own account or an alternate administrative account.

In addition to users' taking on administrative access rights for themselves, you need to prevent being inadvertently locked out of the administration of your Azure AD tenant because you can neither sign in nor activate an existing individual user's account as an administrator. You can mitigate the impact of inadvertent lack of administrative access by storing two or more *emergency access accounts* in your tenant.

Emergency access accounts can help organizations restrict privileged access within an existing Azure Active Directory environment. Such accounts are highly privileged, and they are not assigned to specific individuals. Emergency access accounts are limited to emergency or 'break glass' scenarios, situations where normal administrative accounts cannot be used. Organizations must maintain a goal of restricting the emergency account's usage to only that time during which it is necessary.

An organization might need to use an emergency access account in the following situations:

 - The user accounts are federated, and federation is currently unavailable because of a cell-network break or an identity-provider outage. For example, if the identity provider host in your environment has gone down, users might be unable to sign in when Azure AD redirects to their identity provider. 
 - The administrators are registered through Azure Multi-Factor Authentication, and all their individual devices are unavailable. Users might be unable to complete Multi-Factor Authentication to activate a role. For example, a cell network outage is preventing them from answering phone calls or receiving text messages, the only two authentication mechanisms that they registered for their device. 
 - The person with the most recent global administrative access has left the organization. Azure AD prevents the last *global administrator* account from being deleted, but it does not prevent the account from being deleted or disabled on-premises. Either situation might make the organization unable to recover the account.

## Initial configuration

Create two or more emergency access accounts. These should be cloud-only accounts that use the \*.onmicrosoft.com domain and that are not federated or synchronized from an on-premises environment. 

The accounts should not be associated with any individual user in the organization. Organizations need to ensure that the credentials for these accounts are kept secure and known only to individuals who are authorized to use them. 

> [!NOTE]
> An account password for an emergency access account is usually separated into two or three parts, written on separate pieces of paper, and stored in secure, fireproof safes that are in secure, separate locations. 
>
> Make sure that your emergency access accounts are not connected with any employee-supplied mobile phones, hardware tokens that travel with individual employees, or other employee-specific credentials. This precaution covers instances where an individual employee is unreachable when the credential is needed. 

### Initial configuration with permanent assignments

One option is to make users permanent members of the *global administrator* role. This option would be appropriate for organizations that do not have Azure AD Premium P2 subscriptions.

To reduce the risk of an attack resulting from a compromised password, Azure AD recommends that you require Multi-Factor Authentication for all individual users. This group should include administrators and all others (for example, financial officers) whose compromised account would have a significant impact. 

However, if your organization does not have shared devices, Multi-Factor Authentication might not be possible for these emergency access accounts. If you are configuring a conditional access policy to require [Multi-Factor Authentication registration for every admin](https://docs.microsoft.com/azure/multi-factor-authentication/multi-factor-authentication-get-started-user-states) for Azure AD and other connected software as a service (SaaS) apps, you might need to configure policy exclusions to exclude emergency access accounts from this requirement.

### Initial configuration with approvals

Another option is to configure your users as eligible and approvers to activate the *global administrator* role. This option would require your organization to have Azure AD Premium P2 subscriptions. It would also require a Multi-Factor Authentication option that's suitable for shared use among multiple individuals and the network environment. These requirements are because activation of the *global administrator* role requires users to have previously performed Multi-Factor Authentication. For more information, see [How to require Multi-Factor Authentication in Azure AD Privileged Identity Management](https://docs.microsoft.com/azure/active-directory/active-directory-privileged-identity-management-how-to-require-mfa).

We do not recommend using Multi-Factor Authentication that's associated with personal devices for emergency access accounts. In an actual emergency, the person who needs access to a Multi-Factor Authentication-registered device might not be the one who has the personal device. 

Also consider the threat landscape. For example, an unforeseen circumstance such as a natural disaster emergency might arise, during which a mobile phone or other networks might be unavailable. It is important to ensure that any registered devices are kept in a known, secure location that has multiple means of communicating with Azure AD.

## Ongoing monitoring

Monitor the [Azure AD sign-in and audit logs](https://docs.microsoft.com/azure/active-directory/active-directory-reporting-activity-sign-ins) for any sign-ins and audit activity from the emergency-access accounts. Normally those accounts should not be signing in and should not be making changes, so use of them is likely to be anomalous and require security investigation.

## Account-check validation must occur at regular intervals

To validate the account, perform the following steps at minimum:
- Every 90 days.
- When there has been a recent change in IT staff, such as a job change, a departure, or a new hire.
- When the Azure AD subscriptions in the organization have changed.

To train staff members to use emergency access accounts, do the following:

* Ensure that security-monitoring staff are aware that the account-check activity is ongoing.
* Validate that the cloud user accounts can sign in and activate their roles, and that users who might need to perform these steps during an emergency are trained on the process.
* Ensure that they have not registered Multi-Factor Authentication or self-service password reset (SSPR) to any individual user’s device or personal details. 
* If the accounts are registered for Multi-Factor Authentication to a device, for use during role activation, ensure that the device is accessible to all administrators who might need to use it during an emergency. Also verify that the device is registered through at least two mechanisms that do not share a common failure mode. For example, the device can communicate to the internet through both a facility's wireless network and a cell provider network.
* Update the account credentials.

## Next steps
- [Add a cloud-based user](../fundamentals/add-users-azure-active-directory.md) and [assign the new user to the global administrator role](../fundamentals/active-directory-users-assign-role-azure-portal.md).
- [Sign up for Azure Active Directory Premium](../fundamentals/active-directory-get-started-premium.md), if you haven’t signed up already.
- [Require Azure Multi-Factor Authentication for individual users assigned as administrators](https://docs.microsoft.com/azure/multi-factor-authentication/multi-factor-authentication-get-started-user-states).
- [Configure additional protections for global administrators in Office 365](https://support.office.com/article/Protect-your-Office-365-global-administrator-accounts-6b4ded77-ac8d-42ed-8606-c014fd947560), if you are using Office 365.
- [Perform an access review of global administrators](../privileged-identity-management/pim-how-to-start-security-review.md) and [transition existing global administrators to more specific administrator roles](directory-assign-admin-roles.md).


