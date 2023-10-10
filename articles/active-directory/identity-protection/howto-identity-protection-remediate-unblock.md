---
title: Remediate risks and unblock users in Microsoft Entra ID Protection
description: Learn about the options you have close active risk detections.

services: active-directory
ms.service: active-directory
ms.subservice: identity-protection
ms.topic: how-to
ms.date: 09/07/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: chuqiaoshi

ms.collection: M365-identity-device-management
---
# Remediate risks and unblock users

After completing your [investigation](howto-identity-protection-investigate-risk.md), you need to take action to remediate the risky users or unblock them. Organizations can enable automated remediation by setting up [risk-based policies](howto-identity-protection-configure-risk-policies.md). Organizations should try to investigate and remediate all risky users in a time period that your organization is comfortable with. Microsoft recommends acting quickly, because time matters when working with risks.

## Risk remediation

All active risk detections contribute to the calculation of the user's risk level. The user risk level is an indicator (low, medium, high) of the probability that the user's account has been compromised. As an administrator, after thorough investigation of the risky users and the corresponding risky sign-ins and detections, you want to remediate the risky users so that they're no longer at risk and won't be blocked.

Microsoft Entra ID Protection marks some risk detections and the corresponding risky sign-ins as dismissed with risk state **Dismissed** and risk detail **Azure AD Identity Protection assessed sign-in safe**. It takes this action, because those events were no longer determined to be risky.

Administrators have the following options to remediate:

- Set up [risk-based policies](howto-identity-protection-configure-risk-policies.md) to allow users to self-remediate their risks.
- Manually reset their password.
- Dismiss their user risk.
- [Remediate in Microsoft Defender for Identity](/defender-for-identity/remediation-actions).

### Self-remediation with risk-based policy

You can allow users to self-remediate their sign-in risks and user risks by setting up [risk-based policies](howto-identity-protection-configure-risk-policies.md). If users pass the required access control, such as multifactor authentication or secure password change, then their risks are automatically remediated. The corresponding risk detections, risky sign-ins, and risky users are reported with the risk state **Remediated** instead of **At risk**. 

The prerequisites for users before risk-based policies can be applied to allow self-remediation of risks are:

- To perform MFA to self-remediate a sign-in risk: 
   - The user must have registered for Microsoft Entra multifactor authentication.
- To perform secure password change to self-remediate a user risk:
   -  The user must have registered for Microsoft Entra multifactor authentication.
   -  For hybrid users that are synced from on-premises to cloud, password writeback must be enabled.

If a risk-based policy is applied to a user during sign-in before the above prerequisites are met, then the user is blocked. This block action is because they aren't able to perform the required access control, and admin intervention is required to unblock the user. 

Risk-based policies are configured based on risk levels and only apply if the risk level of the sign-in or user matches the configured level. Some detections might not raise risk to the level where the policy applies, and administrators need to handle those risky users manually. Administrators can determine that extra measures are necessary like [blocking access from locations](../conditional-access/howto-conditional-access-policy-location.md) or lowering the acceptable risk in their policies.

### Self-remediation with self-service password reset

If a user has registered for self-service password reset (SSPR), then they can remediate their own user risk by performing a self-service password reset.

### Manual password reset

If requiring a password reset using a user risk policy isn't an option, or time is of the essence, administrators can remediate a risky user by requiring a password reset.

Administrators have options they can choose from:

- **Generate a temporary password** - By generating a temporary password, you can immediately bring an identity back into a safe state. This method requires contacting the affected users because they need to know what the temporary password is. Because the password is temporary, the user is prompted to change the password to something new during the next sign-in.
   - They can generate passwords for cloud and hybrid users in the Microsoft Entra admin center.
   - They can generate passwords for hybrid users from an on-premises directory when password hash synchronization and the [Allow on-premises password change to reset user risk](#enable-on-premises-password-reset-signals-preview) setting is enabled. 

      > [!WARNING]
      > Don't select the option **User must change password at next logon**. This is unsupported.

- **Require the user to reset password** - Requiring the users to reset passwords enables self-recovery without contacting help desk or an administrator. 
   - Cloud and hybrid users can complete a secure password change. This method only applies to users that can perform MFA already. For users that haven't registered, this option isn't available.
   - Hybrid users can complete a password change by pressing Ctrl+Alt+Del and changing their password from an on-premises or hybrid joined Windows device, when password hash synchronization and the [Allow on-premises password change to reset user risk](#enable-on-premises-password-reset-signals-preview) setting is enabled.

#### Allow on-premises password reset to remediate user risks (Preview)

Organizations who have enabled [password hash synchronization](../hybrid/connect/whatis-phs.md) can allow password changes on-premises to remediate user risk.

This configuration provides organizations two new capabilities:

- Risky hybrid users can self-remediate without administrators intervention. When a password is changed on-premises, user risk is now automatically remediated within Entra ID Protection, bringing the user to a safe state.
- Organizations can proactively deploy [user risk policies that require password changes](howto-identity-protection-configure-risk-policies.md#user-risk-policy-in-conditional-access) to confidently protect their hybrid users. This option strengthens your organization's security posture and simplifies security management by ensuring that user risks are promptly addressed, even in complex hybrid environments.

:::image type="content" source="media/howto-identity-protection-remediate-unblock/allow-on-premises-password-reset-user-risk.png" alt-text="Screenshot showing the location of the Allow on-premises password change to reset user risk checkbox." lightbox="media/howto-identity-protection-remediate-unblock/allow-on-premises-password-reset-user-risk.png":::

To configure this setting

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Security Operator](../roles/permissions-reference.md#security-operator).
1. Browse to **Protection** > **Identity Protection** > **Settings**.
1. Check the box to **Allow on-premises password change to reset user risk**.
1. Select **Save**.

### Dismiss user risk

If after investigation and confirming that the user account isn't at risk of being compromised, then you can choose to dismiss the risky user.

To Dismiss user risk in the [Microsoft Entra admin center](https://entra.microsoft.com), browse to **Protection** > **Identity Protection** > **Risky users**, select the affected user, and select **Dismiss user(s) risk**.

When you select **Dismiss user risk**, the user is no longer at risk, and all the risky sign-ins of this user and corresponding risk detections are dismissed as well. 

Because this method doesn't affect the user's existing password, it doesn't bring their identity back into a safe state. 

#### Risk state and detail based on dismissal of risk

- Risky user: 
   - Risk state: "At risk" -> "Dismissed"
   - Risk detail (the risk remediation detail): "-" -> "Admin dismissed all risk for user" 
- All the risky sign-ins of this user and the corresponding risk detections:
   - Risk state: "At risk" -> "Dismissed"
   - Risk detail (the risk remediation detail): "-" -> "Admin dismissed all risk for user" 

### Confirm a user to be compromised

If after investigation, an account is confirmed compromised:
   1. Select the event or user in the **Risky sign-ins** or **Risky users** reports and choose "Confirm compromised".
   2. If a risk-based policy wasn't triggered, and the risk wasn't [self-remediated](#self-remediation-with-risk-based-policy), then do one or more of the followings:
      1. [Request a password reset](#manual-password-reset).
      1. Block the user if you suspect the attacker can reset the password or do multifactor authentication for the user.
      1. Revoke refresh tokens.
      1. [Disable any devices](../devices/manage-device-identities.md) that are considered compromised.
      1. If using [continuous access evaluation](../conditional-access/concept-continuous-access-evaluation.md), revoke all access tokens.

For more information about what happens when confirming compromise, see the section [How should I give risk feedback and what happens under the hood?](howto-identity-protection-risk-feedback.md#how-should-i-give-risk-feedback-and-what-happens-under-the-hood).

### Deleted users

It isn't possible for administrators to dismiss risk for users who have been deleted from the directory. To remove deleted users, open a Microsoft support case.

## Unblocking users

An administrator can choose to block a sign-in based on their risk policy or investigations. A block can occur based on either sign-in or user risk.

### Unblocking based on user risk

To unblock an account blocked because of user risk, administrators have the following options:

1. **Reset password** - You can reset the user's password. If a user has been compromised or is at risk of being compromised, the user's password should be reset to protect their account and your organization. 
1. **Dismiss user risk** - The user risk policy blocks a user if the configured user risk level for blocking access has been reached. If after investigation you're confident that the user isn't at risk of being compromised, and it's safe to allow their access, then you can reduce a user's risk level by dismissing their user risk.
1. **Exclude the user from policy** - If you think that the current configuration of your sign-in policy is causing issues for specific users, and it's safe to grant access to these users without applying this policy to them, then you can exclude them from this policy. For more information, see the section Exclusions in the article [How To: Configure and enable risk policies](howto-identity-protection-configure-risk-policies.md#exclusions).
1. **Disable policy** - If you think that your policy configuration is causing issues for all your users, you can disable the policy. For more information, see the article [How To: Configure and enable risk policies](howto-identity-protection-configure-risk-policies.md).

### Unblocking based on sign-in risk

To unblock an account based on sign-in risk, administrators have the following options:

1. **Sign in from a familiar location or device** - A common reason for blocked suspicious sign-ins are sign-in attempts from unfamiliar locations or devices. Your users can quickly determine whether this reason is the blocking reason by trying to sign-in from a familiar location or device.
1. **Exclude the user from policy** - If you think that the current configuration of your sign-in policy is causing issues for specific users, you can exclude the users from it. For more information, see the section Exclusions in the article [How To: Configure and enable risk policies](howto-identity-protection-configure-risk-policies.md#exclusions).
1. **Disable policy** - If you think that your policy configuration is causing issues for all your users, you can disable the policy. For more information, see the article [How To: Configure and enable risk policies](howto-identity-protection-configure-risk-policies.md).

## PowerShell preview

Using the Microsoft Graph PowerShell SDK Preview module, organizations can manage risk using PowerShell. The preview modules and sample code can be found in the [Microsoft Entra GitHub repo](https://github.com/AzureAD/IdentityProtectionTools). 

The `Invoke-AzureADIPDismissRiskyUser.ps1` script included in the repository allows organizations to dismiss all risky users in their directory.

## Next steps

[Simulate a high user risk](howto-identity-protection-graph-api.md#confirm-users-compromised-using-powershell)
