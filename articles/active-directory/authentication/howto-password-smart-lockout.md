---
title: Prevent attacks using smart lockout
description: Learn how Microsoft Entra smart lockout helps protect your organization from brute-force attacks that try to guess user passwords.

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 09/21/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: rogoya

ms.collection: M365-identity-device-management
---
# Protect user accounts from attacks with Microsoft Entra smart lockout

Smart lockout helps lock out bad actors that try to guess your users' passwords or use brute-force methods to get in. Smart lockout can recognize sign-ins that come from valid users and treat them differently than ones of attackers and other unknown sources. Attackers get locked out, while your users continue to access their accounts and be productive.

## How smart lockout works

By default, smart lockout locks an account from sign-in after: 

- 10 failed attempts in Azure Public and Microsoft Azure operated by 21Vianet tenants 
- 3 failed attempts for Azure US Government tenants

The account locks again after each subsequent failed sign-in attempt. The lockout period is one minute at first, and longer in subsequent attempts. To minimize the ways an attacker could work around this behavior, we don't disclose the rate at which the lockout period increases after unsuccessful sign-in attempts.

Smart lockout tracks the last three bad password hashes to avoid incrementing the lockout counter for the same password. If someone enters the same bad password multiple times, this behavior doesn't cause the account to lock out.

> [!NOTE]
> Hash tracking functionality isn't available for customers with pass-through authentication enabled as authentication happens on-premises not in the cloud.

Federated deployments that use Active Directory Federation Services (AD FS) 2016 and AD FS 2019 can enable similar benefits by using [AD FS Extranet Lockout and Extranet Smart Lockout](/windows-server/identity/ad-fs/operations/configure-ad-fs-extranet-smart-lockout-protection). It's recommended to move to [managed authentication](https://www.microsoft.com/security/business/identity-access/upgrade-adfs).  

Smart lockout is always on, for all Microsoft Entra customers, with these default settings that offer the right mix of security and usability. Customization of the smart lockout settings, with values specific to your organization, requires Microsoft Entra ID P1 or higher licenses for your users.

Using smart lockout doesn't guarantee that a genuine user is never locked out. When smart lockout locks a user account, we try our best to not lock out the genuine user. The lockout service attempts to ensure that bad actors can't gain access to a genuine user account. The following considerations apply:

* Lockout state across Microsoft Entra data centers is synchronized. However, the total number of failed sign-in attempts allowed before an account is locked out will have slight variance from the configured lockout threshold. Once an account is locked out, it's locked out everywhere across all Microsoft Entra data centers.
* Smart Lockout uses familiar location vs unfamiliar location to differentiate between a bad actor and the genuine user. Both unfamiliar and familiar locations have separate lockout counters.
* After an account lockout, the user can initiate self-service password reset (SSPR) to sign in again. If the user chooses **I forgot my password** during SSPR, the duration of the lockout is reset to 0 seconds. If the user chooses **I know my password** during SSPR, the lockout timer continues, and the duration of the lockout isn't reset. To reset the duration and sign in again, the user needs to change their password.

Smart lockout can be integrated with hybrid deployments that use password hash sync or pass-through authentication to protect on-premises Active Directory Domain Services (AD DS) accounts from being locked out by attackers. By setting smart lockout policies in Microsoft Entra ID appropriately, attacks can be filtered out before they reach on-premises AD DS.

When using [pass-through authentication](../hybrid/connect/how-to-connect-pta.md), the following considerations apply:

* The Microsoft Entra lockout threshold is **less** than the AD DS account lockout threshold. Set the values so that the AD DS account lockout threshold is at least two or three times greater than the Microsoft Entra lockout threshold.
* The Microsoft Entra lockout duration must be set longer than the AD DS account lockout duration. The Microsoft Entra duration is set in seconds, while the AD DS duration is set in minutes.

For example, if you want your Microsoft Entra smart lockout duration to be higher than AD DS, then Microsoft Entra ID would be 120 seconds (2 minutes) while your on-premises AD is set to 1 minute (60 seconds). If you want your Microsoft Entra lockout threshold to be 5, then you want your on-premises AD DS lockout threshold to be 10.  This configuration would ensure smart lockout prevents your on-premises AD DS accounts from being locked out by brute force attacks on your Microsoft Entra accounts.

> [!IMPORTANT]
> An administrator can unlock the users' cloud account if they have been locked out by the Smart Lockout capability, without the need of waiting for the lockout duration to expire. For more information, see [Reset a user's password using Microsoft Entra ID](../fundamentals/users-reset-password-azure-portal.md).

## Verify on-premises account lockout policy

To verify your on-premises AD DS account lockout policy, complete the following steps from a domain-joined system with administrator privileges:

1. Open the Group Policy Management tool.
2. Edit the group policy that includes your organization's account lockout policy, such as, the **Default Domain Policy**.
3. Browse to **Computer Configuration** > **Policies** > **Windows Settings** > **Security Settings** > **Account Policies** > **Account Lockout Policy**.
4. Verify your **Account lockout threshold** and **Reset account lockout counter after** values.

![Modify the on-premises Active Directory account lockout policy](./media/howto-password-smart-lockout/active-directory-on-premises-account-lockout-policy.png)

<a name='manage-azure-ad-smart-lockout-values'></a>

## Manage Microsoft Entra smart lockout values

Based on your organizational requirements, you can customize the Microsoft Entra smart lockout values. Customization of the smart lockout settings, with values specific to your organization, requires Microsoft Entra ID P1 or higher licenses for your users. Customization of the smart lockout settings isn't available for Microsoft Azure operated by 21Vianet tenants.

To check or modify the smart lockout values for your organization, complete the following steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Authentication Administrator](../roles/permissions-reference.md#authentication-administrator).
1. Browse to **Protection** > **Authentication methods** > **Password protection**.
1. Set the **Lockout threshold**, based on how many failed sign-ins are allowed on an account before its first lockout.

    The default is 10 for Azure Public tenants and 3 for Azure US Government tenants.

1. Set the **Lockout duration in seconds**, to the length in seconds of each lockout.

    The default is 60 seconds (one minute).

> [!NOTE]
> If the first sign-in after a lockout period has expired also fails, the account locks out again. If an account locks repeatedly, the lockout duration increases.

![Customize the Microsoft Entra smart lockout policy in the Microsoft Entra admin center](./media/howto-password-smart-lockout/azure-active-directory-custom-smart-lockout-policy.png)

## Testing Smart lockout

When the smart lockout threshold is triggered, you'll get the following message while the account is locked:

*Your account is temporarily locked to prevent unauthorized use. Try again later, and if you still have trouble, contact your admin.*

When you test smart lockout, your sign-in requests might be handled by different datacenters due to the geo-distributed and load-balanced nature of the Microsoft Entra authentication service. 

Smart lockout tracks the last three bad password hashes to avoid incrementing the lockout counter for the same password. If someone enters the same bad password multiple times, this behavior doesn't cause the account to lock out.


## Default protections
In addition to Smart lockout, Microsoft Entra ID also protects against attacks by analyzing signals including IP traffic and identifying anomalous behavior. Microsoft Entra ID blocks these malicious sign-ins by default and returns [AADSTS50053 - IdsLocked error code](../develop/reference-error-codes.md), regardless of the password validity.

## Next steps

- To customize the experience further, you can [configure custom banned passwords for Microsoft Entra password protection](tutorial-configure-custom-password-protection.md).

- To help users reset or change their password from a web browser, you can [configure Microsoft Entra self-service password reset](tutorial-enable-sspr.md).
