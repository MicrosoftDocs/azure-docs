---

title: Manage emergency access accounts in Azure AD | Microsoft Docs
description: This article describes how to use emergency access accounts to help prevent being inadvertently locked out of the administration of your Azure Active Directory (Azure AD) tenant. 
services: active-directory 
author: markwahl-msft
ms.author: billmath
ms.date: 11/27/2018
ms.topic: article-type-from-white-list
ms.service: active-directory
ms.workload: identity
ms.custom: it-pro
ms.reviewer: markwahl-msft
---

# Manage emergency access accounts in Azure AD

It is important that you prevent being inadvertently locked out of the administration of your Azure Active Directory (Azure AD) tenant because you can neither sign in nor activate an existing individual user's account as an administrator. You can mitigate the impact of inadvertent lack of administrative access by creating two or more *emergency access accounts* in your tenant.

Emergency access accounts are highly privileged, and they are not assigned to specific individuals. Emergency access accounts are limited to emergency or 'break glass' scenarios, situations where normal administrative accounts cannot be used. Organizations must maintain a goal of restricting the emergency account's usage to only that time during which it is necessary.

## When would you use an emergency access account?

An organization might need to use an emergency access account in the following situations:

- The user accounts are federated, and federation is currently unavailable because of a cell-network break or an identity-provider outage. For example, if the identity provider host in your environment has gone down, users might be unable to sign in when Azure AD redirects to their identity provider.
- The administrators are registered through Azure Multi-Factor Authentication, and all their individual devices are unavailable. Users might be unable to complete Multi-Factor Authentication to activate a role. For example, a cell network outage is preventing them from answering phone calls or receiving text messages, the only two authentication mechanisms that they registered for their device.
- The person with the most recent Global Administrator access has left the organization. Azure AD prevents the last Global Administrator account from being deleted, but it does not prevent the account from being deleted or disabled on-premises. Either situation might make the organization unable to recover the account.
- Unforeseen circumstances such as a natural disaster emergency might arise, during which a mobile phone or other networks might be unavailable. It is important to ensure that any registered devices are kept in a known, secure location that has multiple means of communicating with Azure AD.

## Create two or more emergency accounts

Create two or more emergency access accounts. These should be cloud-only accounts that use the \*.onmicrosoft.com domain and that are not federated or synchronized from an on-premises environment.

The accounts should not be associated with any individual user in the organization. Organizations need to ensure that the credentials for these accounts are kept secure and known only to individuals who are authorized to use them.

## Make role assignment permanent

You should make the Global Administrator role assignment permanent for the emergency access accounts. Although you can use Azure AD Privileged Identity Management (PIM) to make emergency access accounts eligible for access, it recommended to make your access accounts permanent to ensure the accounts will be active.

## Exclude accounts from Multi-Factor Authentication

To reduce the risk of an attack resulting from a compromised password, Azure AD recommends that you require Multi-Factor Authentication for all individual users. This group should include administrators and all others (for example, financial officers) whose compromised account would have a significant impact.

However, emergency access accounts should not have Multi-Factor Authentication enabled. If you have a conditional access policy to require [Multi-Factor Authentication registration for every administrator](https://docs.microsoft.com/azure/multi-factor-authentication/multi-factor-authentication-get-started-user-states) for Azure AD and other connected software as a service (SaaS) apps, you might need to configure policy exclusions to exclude emergency access accounts from this requirement.

## Store passwords in a safe location

A password for an emergency access account is usually separated into two or three parts, written on separate pieces of paper, and stored in secure, fireproof safes that are in secure, separate locations. Make sure that your emergency access accounts are not connected with any employee-supplied mobile phones, hardware tokens that travel with individual employees, or other employee-specific credentials. This precaution covers instances where an individual employee is unreachable when the credential is needed.

## Monitor sign-in and audit logs

Monitor the [Azure AD sign-in and audit logs](https://docs.microsoft.com/azure/active-directory/active-directory-reporting-activity-sign-ins) for any sign-ins and audit activity from the emergency-access accounts. Normally those accounts should not be signing in and should not be making changes, so use of them is likely to be anomalous and require security investigation.

## Validate accounts at regular intervals

To validate the emergency access accounts, perform the following steps at minimum:

- Ensure that emergency break glass process is documented and current.
- Ensure that key managers and security officers who might need to perform these steps during an emergency are trained on the process.
- Validate that the emergency access accounts can sign in.
- Update the emergency access account credentials.

These steps should be performed at regular intervals and for key changes:
- At least every 90 days.
- When there has been a recent change in IT staff, such as a job change, a departure, or a new hire.
- When the Azure AD subscriptions in the organization have changed.

## Next steps

- [Securing privileged access for hybrid and cloud deployments in Azure AD](directory-admin-roles-secure.md)
- [Add a cloud-based user](../fundamentals/add-users-azure-active-directory.md) and [assign the new user to the global administrator role](../fundamentals/active-directory-users-assign-role-azure-portal.md).
- [Sign up for Azure Active Directory Premium](../fundamentals/active-directory-get-started-premium.md), if you haven’t signed up already.
- [Require Azure Multi-Factor Authentication for individual users assigned as administrators](https://docs.microsoft.com/azure/multi-factor-authentication/multi-factor-authentication-get-started-user-states).
- [Configure additional protections for global administrators in Office 365](https://support.office.com/article/Protect-your-Office-365-global-administrator-accounts-6b4ded77-ac8d-42ed-8606-c014fd947560), if you are using Office 365.
- [Perform an access review of global administrators](../privileged-identity-management/pim-how-to-start-security-review.md) and [transition existing global administrators to more specific administrator roles](directory-assign-admin-roles.md).
