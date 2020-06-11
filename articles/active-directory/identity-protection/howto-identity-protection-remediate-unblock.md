---
title: Remediate risks and unblock users in Azure AD Identity Protection
description: Learn about the options you have close active risk detections.

services: active-directory
ms.service: active-directory
ms.subservice: identity-protection
ms.topic: how-to
ms.date: 06/05/2020

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: sahandle

ms.collection: M365-identity-device-management
---
# Remediate risks and unblock users

After completing your [investigation](howto-identity-protection-investigate-risk.md), you will want to take action to remediate the risk or unblock users. Organizations also have the option to enable automated remediation using their [risk policies](howto-identity-protection-configure-risk-policies.md). Organizations should try to close all risk detections that they are presented with in a time period your organization is comfortable with. Microsoft recommends closing events as soon as possible because time matters when working with risk.

## Remediation

All active risk detections contribute to the calculation of a value called user risk level. The user risk level is an indicator (low, medium, high) for the probability that an account has been compromised. As an administrator, you want to get all risk detections closed, so that the affected users are no longer at risk.

Some risks detections may be marked by Identity Protection as "Closed (system)" because the events were no longer determined to be risky.

Administrators have the following options to remediate:

- Self-remediation with risk policy
- Manual password reset
- Dismiss user risk
- Close individual risk detections manually

### Self-remediation with risk policy

If you allow users to self-remediate, with Azure Multi-Factor Authentication (MFA) and self-service password reset (SSPR) in your risk policies, they can unblock themselves when risk is detected. These detections are then considered closed. Users must have previously registered for Azure MFA and SSPR in order to use when risk is detected.

Some detections may not raise risk to the level where a user self-remediation would be required but administrators should still evaluate these detections. Administrators may determine that additional measures are necessary like [blocking access from locations](../conditional-access/howto-conditional-access-policy-location.md) or lowering the acceptable risk in their policies.

### Manual password reset

If requiring a password reset using a user risk policy is not an option, administrators can close all risk detections for a user with a manual password reset.

Administrators are given two options when resetting a password for their users:

- **Generate a temporary password** - By generating a temporary password, you can immediately bring an identity back into a safe state. This method requires contacting the affected users because they need to know what the temporary password is. Because the password is temporary, the user is prompted to change the password to something new during the next sign-in.

- **Require the user to reset password** - Requiring the users to reset passwords enables self-recovery without contacting help desk or an administrator. This method only applies to users that are registered for Azure MFA and SSPR. For users that have not been registered, this option isn't available.

### Dismiss user risk

If a password reset is not an option for you, because for example the user has been deleted, you can choose to dismiss user risk detections.

When you click **Dismiss user risk**, all events are closed and the affected user is no longer at risk. However, because this method doesn't have an impact on the existing password, it doesn't bring the related identity back into a safe state. 

### Close individual risk detections manually

You can close individual risk detections manually. By closing risk detections manually, you can lower the user risk level. Typically, risk detections are closed manually in response to a related investigation. For example, when talking to a user reveals that an active risk detection is not required anymore. 
 
When closing risk detections manually, you can choose to take any of the following actions to change the status of a risk detection:

- Confirm user compromised
- Dismiss user risk
- Confirm sign-in safe
- Confirm sign-in compromised

## Unblocking users

An administrator may choose to block a sign-in based on their risk policy or investigations. A block may occur based on either sign-in or user risk.

### Unblocking based on user risk

To unblock an account blocked due to user risk, administrators have the following options:

1. **Reset password** - You can reset the user's password.
1. **Dismiss user risk** - The user risk policy blocks a user if the configured user risk level for blocking access has been reached. You can reduce a user's risk level by dismissing user risk or manually closing reported risk detections.
1. **Exclude the user from policy** - If you think that the current configuration of your sign-in policy is causing issues for specific users, you can exclude the users from it. For more information, see the section Exclusions in the article [How To: Configure and enable risk policies](howto-identity-protection-configure-risk-policies.md#exclusions).
1. **Disable policy** - If you think that your policy configuration is causing issues for all your users, you can disable the policy. For more information, see the article [How To: Configure and enable risk policies](howto-identity-protection-configure-risk-policies.md).

### Unblocking based on sign-in risk

To unblock an account based on sign-in risk, administrators have the following options:

1. **Sign in from a familiar location or device** - A common reason for blocked suspicious sign-ins are sign-in attempts from unfamiliar locations or devices. Your users can quickly determine whether this reason is the blocking reason by trying to sign-in from a familiar location or device.
1. **Exclude the user from policy** - If you think that the current configuration of your sign-in policy is causing issues for specific users, you can exclude the users from it. For more information, see the section Exclusions in the article [How To: Configure and enable risk policies](howto-identity-protection-configure-risk-policies.md#exclusions).
1. **Disable policy** - If you think that your policy configuration is causing issues for all your users, you can disable the policy. For more information, see the article [How To: Configure and enable risk policies](howto-identity-protection-configure-risk-policies.md).

## Next steps

To get an overview of Azure AD Identity Protection, see the [Azure AD Identity Protection overview](overview-identity-protection.md).
