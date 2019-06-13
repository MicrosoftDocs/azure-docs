---

title: Manage emergency access administrator accounts - Azure Active Directory | Microsoft Docs
description: This article describes how to use emergency access accounts to help prevent being inadvertently locked out of your Azure Active Directory (Azure AD) tenant. 
services: active-directory 
author: markwahl-msft
ms.author: curtand
ms.date: 03/19/2019
ms.topic: conceptual
ms.service: active-directory
ms.subservice: users-groups-roles
ms.workload: identity
ms.custom: it-pro
ms.reviewer: markwahl-msft
ms.collection: M365-identity-device-management
---

# Manage emergency access accounts in Azure AD

It is important that you prevent being inadvertently locked out of your Azure Active Directory (Azure AD) tenant because you can't sign in or activate an existing individual user's account as an administrator. You can mitigate the impact of inadvertent lack of administrative access by creating two or more *emergency access accounts* in your tenant.

Emergency access accounts are highly privileged, and they are not assigned to specific individuals. Emergency access accounts are limited to emergency or 'break glass' scenarios where normal administrative accounts cannot be used. Organizations must maintain a goal of restricting the emergency account's usage to only the times when it is absolutely necessary.

This article provides guidelines for managing emergency access accounts in Azure AD.

## When would you use an emergency access account?

An organization might need to use an emergency access account in the following situations:

- The user accounts are federated, and federation is currently unavailable because of a cell-network break or an identity-provider outage. For example, if the identity provider host in your environment has gone down, users might be unable to sign in when Azure AD redirects to their identity provider.
- The administrators are registered through Azure Multi-Factor Authentication, and all their individual devices are unavailable or the service is unavailable. Users might be unable to complete Multi-Factor Authentication to activate a role. For example, a cell network outage is preventing them from answering phone calls or receiving text messages, the only two authentication mechanisms that they registered for their device.
- The person with the most recent Global Administrator access has left the organization. Azure AD prevents the last Global Administrator account from being deleted, but it does not prevent the account from being deleted or disabled on-premises. Either situation might make the organization unable to recover the account.
- Unforeseen circumstances such as a natural disaster emergency, during which a mobile phone or other networks might be unavailable. 

## Create two cloud-based emergency access accounts

Create two or more emergency access accounts. These accounts should be cloud-only accounts that use the \*.onmicrosoft.com domain and that are not federated or synchronized from an on-premises environment.

When configuring these accounts, the following requirements must be met:

- The emergency access accounts should not be associated with any individual user in the organization. Make sure that your accounts are not connected with any employee-supplied mobile phones, hardware tokens that travel with individual employees, or other employee-specific credentials. This precaution covers instances where an individual employee is unreachable when the credential is needed. It is important to ensure that any registered devices are kept in a known, secure location that has multiple means of communicating with Azure AD.
- The authentication mechanism used for an emergency access account should be distinct from that used by your other administrative accounts, including other emergency access accounts.  For example, if your normal administrator sign-in is via on-premises MFA, then Azure MFA would be a different mechanism.  However if Azure MFA is your primary part of authentication for your administrative accounts, then consider a different approach for these, such as using Conditional Access with a third-party MFA provider.
- The device or credential must not expire or be in scope of automated cleanup due to lack of use.  
- You should make the Global Administrator role assignment permanent for your emergency access accounts. 


### Exclude at least one account from phone-based multi-factor authentication

To reduce the risk of an attack resulting from a compromised password, Azure AD recommends that you require multi-factor authentication for all individual users. This group includes administrators and all others (for example, financial officers) whose compromised account would have a significant impact.

However, at least one of your emergency access accounts should not have the same multi-factor authentication mechanism as your other non-emergency accounts. This includes third-party multi-factor authentication solutions. If you have a Conditional Access policy to require [multi-factor authentication for every administrator](../authentication/howto-mfa-userstates.md) for Azure AD and other connected software as a service (SaaS) apps, you should exclude emergency access accounts from this requirement, and configure a different mechanism instead. Additionally, you should make sure the accounts do not have a per-user multi-factor authentication policy.

### Exclude at least one account from Conditional Access policies

During an emergency, you do not want a policy to potentially block your access to fix an issue. At least one emergency access account should be excluded from all Conditional Access policies. If you have enabled a [baseline policy](../conditional-access/baseline-protection.md), you should exclude your emergency access accounts.

## Additional guidance for hybrid customers

An additional option for organizations that use AD Domain Services and ADFS or similar identity provider to federate to Azure AD, is to configure an emergency access account whose MFA claim could be supplied by that identity provider.  For example, the emergency access account could be backed by a certificate and key pair such as one stored on a smartcard.  When that user is authenticated to AD, ADFS can supply a claim to Azure AD indicating that the user has met MFA requirements.  Even with this approach, organizations must still have cloud-based emergency access accounts in case federation cannot be established. 

## Store devices and credentials in a safe location

Organizations need to ensure that the credentials for emergency access accounts are kept secure and known only to individuals who are authorized to use them. Some customers use a smartcard and others use passwords. A password for an emergency access account is usually separated into two or three parts, written on separate pieces of paper, and stored in secure, fireproof safes that are in secure, separate locations.

If using passwords, make sure the accounts have strong passwords that do not expire the password. Ideally, the passwords should be at least 16 characters long and randomly generated.


## Monitor sign-in and audit logs

Monitor the [Azure AD sign-in and audit logs](../reports-monitoring/concept-sign-ins.md) for any sign-ins and audit activity from the emergency access accounts. Normally, these accounts should not be signing in and should not be making changes, so use of them is likely to be anomalous and require security investigation.

## Validate accounts at regular intervals

To train staff members to use emergency access accounts and validate the emergency access accounts, do the following minimum steps at regular intervals:

- Ensure that security-monitoring staff are aware that the account-check activity is ongoing.
- Ensure that the emergency break glass process to use these accounts is documented and current.
- Ensure that administrators and security officers who might need to perform these steps during an emergency are trained on the process.
- Update the account credentials, in particular any passwords, for your emergency access accounts, and then validate that the emergency access accounts can sign-in and perform administrative tasks.
- Ensure that users have not registered Multi-Factor Authentication or self-service password reset (SSPR) to any individual user’s device or personal details. 
- If the accounts are registered for Multi-Factor Authentication to a device, for use during sign-in or role activation, ensure that the device is accessible to all administrators who might need to use it during an emergency. Also verify that the device can communicate through at least two network paths that do not share a common failure mode. For example, the device can communicate to the internet through both a facility's wireless network and a cell provider network.

These steps should be performed at regular intervals and for key changes:

- At least every 90 days
- When there has been a recent change in IT staff, such as a job change, a departure, or a new hire
- When the Azure AD subscriptions in the organization have changed

## Next steps

- [Securing privileged access for hybrid and cloud deployments in Azure AD](directory-admin-roles-secure.md)
- [Add users using Azure AD](../fundamentals/add-users-azure-active-directory.md) and [assign the new user to the Global Administrator role](../fundamentals/active-directory-users-assign-role-azure-portal.md)
- [Sign up for Azure AD Premium](../fundamentals/active-directory-get-started-premium.md), if you haven’t signed up already
- [How to require two-step verification for a user](../authentication/howto-mfa-userstates.md)
- [Configure additional protections for Global Administrators in Office 365](https://docs.microsoft.com/office365/enterprise/protect-your-global-administrator-accounts), if you are using Office 365
- [Start an access review of Global Administrators](../privileged-identity-management/pim-how-to-start-security-review.md) and [transition existing Global Administrators to more specific administrator roles](directory-assign-admin-roles.md)
