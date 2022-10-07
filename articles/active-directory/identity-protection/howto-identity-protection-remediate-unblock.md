---
title: Remediate risks and unblock users in Azure AD Identity Protection
description: Learn about the options you have close active risk detections.

services: active-directory
ms.service: active-directory
ms.subservice: identity-protection
ms.topic: how-to
ms.date: 02/17/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: chuqiaoshi

ms.collection: M365-identity-device-management
---
# Remediate risks and unblock users

After completing your [investigation](howto-identity-protection-investigate-risk.md), you need to take action to remediate the risk or unblock users. Organizations can enable automated remediation using their [risk policies](howto-identity-protection-configure-risk-policies.md). Organizations should try to close all risk detections that they're presented in a time period your organization is comfortable with. Microsoft recommends closing events quickly, because time matters when working with risk.

## Remediation

All active risk detections contribute to the calculation of a value called user risk level. The user risk level is an indicator (low, medium, high) for the probability that an account has been compromised. As an administrator, you want to get all risk detections closed, so that the affected users are no longer at risk.

Some risks detections may be marked by Identity Protection as "Closed (system)" because the events were no longer determined to be risky.

Administrators have the following options to remediate:

- Self-remediation with risk policy
- Manual password reset
- Dismiss user risk
- Close individual risk detections manually

### Remediation framework

1. If the account is confirmed compromised:
   1. Select the event or user in the **Risky sign-ins** or **Risky users** reports and choose "Confirm compromised".
   1. If a risk policy or a Conditional Access policy wasn't triggered at part of the risk detection, and the risk wasn't [self-remediated](#self-remediation-with-risk-policy), then:
      1. [Request a password reset](#manual-password-reset).
      1. Block the user if you suspect the attacker can reset the password or do multi-factor authentication for the user.
      1. Revoke refresh tokens.
      1. [Disable any devices](../devices/device-management-azure-portal.md) considered compromised.
      1. If using [continuous access evaluation](../conditional-access/concept-continuous-access-evaluation.md), revoke all access tokens.

For more information about what happens when confirming compromise, see the section [How should I give risk feedback and what happens under the hood?](howto-identity-protection-risk-feedback.md#how-should-i-give-risk-feedback-and-what-happens-under-the-hood).

### Self-remediation with risk policy

If you allow users to self-remediate, with Azure AD multifactor authentication (MFA) and self-service password reset (SSPR) in your risk policies, they can unblock themselves when risk is detected. These detections are then considered closed. Users must have previously registered for Azure AD MFA and SSPR for use when risk is detected.

Some detections may not raise risk to the level where a user self-remediation would be required but administrators should still evaluate these detections. Administrators may determine that extra measures are necessary like [blocking access from locations](../conditional-access/howto-conditional-access-policy-location.md) or lowering the acceptable risk in their policies.

### Manual password reset

If requiring a password reset using a user risk policy isn't an option, administrators can close all risk detections for a user with a manual password reset.

Administrators are given two options when resetting a password for their users:

- **Generate a temporary password** - By generating a temporary password, you can immediately bring an identity back into a safe state. This method requires contacting the affected users because they need to know what the temporary password is. Because the password is temporary, the user is prompted to change the password to something new during the next sign-in.

- **Require the user to reset password** - Requiring the users to reset passwords enables self-recovery without contacting help desk or an administrator. This method only applies to users that are registered for Azure AD MFA and SSPR. For users that haven't been registered, this option isn't available.

### Dismiss user risk

If a password reset isn't an option for you, you can choose to dismiss user risk detections.

When you select **Dismiss user risk**, all events are closed and the affected user is no longer at risk. However, because this method doesn't have an impact on the existing password, it doesn't bring the related identity back into a safe state. 

To **Dismiss user risk**, search for and select **Azure AD Risky users**, select the affected user, and select **Dismiss user(s) risk**.

### Close individual risk detections manually

You can close individual risk detections manually. By closing risk detections manually, you can lower the user risk level. Typically, risk detections are closed manually in response to a related investigation. For example, when talking to a user reveals that an active risk detection isn't required anymore. 
 
When closing risk detections manually, you can choose to take any of the following actions to change the status of a risk detection:

- Confirm user compromised
- Dismiss user risk
- Confirm sign-in safe
- Confirm sign-in compromised

#### Deleted users

It isn't possible for administrators to dismiss risk for users who have been deleted from the directory. To remove deleted users, open a Microsoft support case.

## Unblocking users

An administrator may choose to block a sign-in based on their risk policy or investigations. A block may occur based on either sign-in or user risk.

### Unblocking based on user risk

To unblock an account blocked because of user risk, administrators have the following options:

1. **Reset password** - You can reset the user's password.
1. **Dismiss user risk** - The user risk policy blocks a user if the configured user risk level for blocking access has been reached. You can reduce a user's risk level by dismissing user risk or manually closing reported risk detections.
1. **Exclude the user from policy** - If you think that the current configuration of your sign-in policy is causing issues for specific users, you can exclude the users from it. For more information, see the section Exclusions in the article [How To: Configure and enable risk policies](howto-identity-protection-configure-risk-policies.md#exclusions).
1. **Disable policy** - If you think that your policy configuration is causing issues for all your users, you can disable the policy. For more information, see the article [How To: Configure and enable risk policies](howto-identity-protection-configure-risk-policies.md).

### Unblocking based on sign-in risk

To unblock an account based on sign-in risk, administrators have the following options:

1. **Sign in from a familiar location or device** - A common reason for blocked suspicious sign-ins are sign-in attempts from unfamiliar locations or devices. Your users can quickly determine whether this reason is the blocking reason by trying to sign-in from a familiar location or device.
1. **Exclude the user from policy** - If you think that the current configuration of your sign-in policy is causing issues for specific users, you can exclude the users from it. For more information, see the section Exclusions in the article [How To: Configure and enable risk policies](howto-identity-protection-configure-risk-policies.md#exclusions).
1. **Disable policy** - If you think that your policy configuration is causing issues for all your users, you can disable the policy. For more information, see the article [How To: Configure and enable risk policies](howto-identity-protection-configure-risk-policies.md).

## PowerShell preview

Using the Microsoft Graph PowerShell SDK Preview module, organizations can manage risk using PowerShell. The preview modules and sample code can be found in the [Azure AD GitHub repo](https://github.com/AzureAD/IdentityProtectionTools). 

The `Invoke-AzureADIPDismissRiskyUser.ps1` script included in the repo allows organizations to dismiss all risky users in their directory.

## Next steps

To get an overview of Azure AD Identity Protection, see the [Azure AD Identity Protection overview](overview-identity-protection.md).
