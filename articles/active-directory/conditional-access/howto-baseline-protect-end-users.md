---
title: Baseline policy End user protection (preview) - Azure Active Directory
description: Conditional Access policy to require multi-factor authentication for users

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 05/16/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb, rogoya

ms.collection: M365-identity-device-management
---
# Baseline policy: End user protection (preview)

We tend to think that administrator accounts are the only accounts that need protection with multi-factor authentication (MFA). Administrators have broad access to sensitive information and can make changes to subscription-wide settings. However, bad actors tend to target end users. After gaining access, these bad actors can request access to privileged information on behalf of the original account holder or download the entire directory to perform a phishing attack on your whole organization. One common method to improve the protection for all users is to require a stronger form of account verification, such as multi factor authentication (MFA).

To achieve a reasonable balance of security and usability, users shouldn’t be prompted every single time they sign-in. Authentication requests that reflect normal user behavior, such as signing in from the same device from the same location, have a low chance of compromise. Only sign-ins that are deemed risky and show characteristics of a bad actor should be prompted with MFA challenges.

End user protection is a risk-based MFA [baseline policy](concept-baseline-protection.md) that protects all users in a directory, including all administrator roles. Enabling this policy requires all users to register for MFA using the Authenticator App. Users can ignore the MFA registration prompt for 14 days, after which they will be blocked from signing in until they register for MFA. Once registered for MFA, users will be prompted for MFA only during risky sign-in attempts. Compromised user accounts are blocked until their password is reset and risk events have been dismissed.

> [!NOTE]
> This policy applies to all users including guest accounts and will be evaluated when logging into all applications.

## Recovering compromised accounts

To help protect our customers, Microsoft’s leaked credential service finds publicly available username/password pairs. If they match one of our users, we help secure that account immediately. Users identified as having a leaked credential are confirmed compromised. These users will be blocked from signing in until their password is reset.

Users assigned an Azure AD Premium license can restore access through self-service password reset (SSPR) if the capability is enabled in their directory. Users without a premium license that become blocked must contact an administrator to perform a manual password reset and dismiss the flagged user risk event.

### Steps to unblock a user

Confirm that the user has been blocked by the policy by examining the user’s sign-in logs.

1. An administrator needs to sign in to the **Azure portal** and navigate to **Azure Active Directory** > **Users** > click on the name of the user and navigate to Sign-ins.
1. To initiate password reset on a blocked user, an administrator needs to navigate to **Azure Active Directory** > **Users flagged for risk**
1. Click on the user whose account is blocked to view information about the user’s recent sign-in activity.
1. Click Reset Password to assign a temporary password that must be changed upon the next login.
1. Click Dismiss all events to reset the user’s risk score.

The user can now sign in, reset their password, and access the application.

## Deployment considerations

Because the **End user protection** policy applies to all users in your directory, several considerations need to be made to ensure a smooth deployment. These considerations include identifying users and service principles in Azure AD that cannot or should not perform MFA, as well as applications and clients used by your organization that do not support modern authentication.

### Legacy protocols

Legacy authentication protocols (IMAP, SMTP, POP3, etc.) are used by mail clients to make authentication requests. These protocols do not support MFA.  Most of the account compromises seen by Microsoft are caused by bad actors performing attacks against legacy protocols attempting to bypass MFA. To ensure that MFA is required when logging into an account and bad actors aren’t able to bypass MFA, this policy blocks all authentication requests made to administrator accounts from legacy protocols.

> [!WARNING]
> Before you enable this policy, make sure your users aren’t using legacy authentication protocols. See the article [How to: Block legacy authentication to Azure AD with Conditional Access](howto-baseline-protect-legacy-auth.md#identify-legacy-authentication-use) for more information.

## Enable the baseline policy

The policy **Baseline policy: End user protection (preview)** comes pre-configured and will show up at the top when you navigate to the Conditional Access blade in Azure portal.

To enable this policy and protect your users:

1. Sign in to the **Azure portal** as global administrator, security administrator, or Conditional Access administrator.
1. Browse to **Azure Active Directory** > **Conditional Access**.
1. In the list of policies, select **Baseline policy: End user protection (preview)**.
1. Set **Enable policy** to **Use policy immediately**.
1. Click **Save**.

## Next steps

For more information, see:

* [Conditional Access baseline protection policies](concept-baseline-protection.md)
* [Five steps to securing your identity infrastructure](../../security/azure-ad-secure-steps.md)
* [What is Conditional Access in Azure Active Directory?](overview.md)
