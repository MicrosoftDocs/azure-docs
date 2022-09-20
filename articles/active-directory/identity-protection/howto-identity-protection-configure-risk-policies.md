---
title: Risk policies - Azure Active Directory Identity Protection
description: Enable and configure risk policies in Azure Active Directory Identity Protection

services: active-directory
ms.service: active-directory
ms.subservice: identity-protection
ms.topic: how-to
ms.date: 08/23/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: sahandle

ms.collection: M365-identity-device-management
---
# Configure and enable risk policies

As we learned in the previous article, [Identity Protection policies](concept-identity-protection-policies.md) we have two risk policies that we can enable in our directory. 

- Sign-in risk policy
- User risk policy

Both policies work to automate the response to risk detections in your environment and allow users to self-remediate when risk is detected. 

## Choosing acceptable risk levels

Organizations must decide the level of risk they're willing to accept balancing user experience and security posture. 

Microsoft's recommendation is to set the user risk policy threshold to **High** and the sign-in risk policy to **Medium and above** and allow self-remediation options. Choosing to block access rather than allowing self-remediation options, like password change and multi-factor authentication, will impact your users and administrators. Weigh this choice when configuring your policies.

Choosing a **High** threshold reduces the number of times a policy is triggered and minimizes the impact to users. However, it excludes **Low** and **Medium** risk detections from the policy, which may not block an attacker from exploiting a compromised identity. Selecting a **Low** threshold introduces more user interrupts.

Configured trusted [network locations](../conditional-access/location-condition.md) are used by Identity Protection in some risk detections to reduce false positives.

### Risk remediation

Organizations can choose to block access when risk is detected. Blocking sometimes stops legitimate users from doing what they need to. A better solution is to allow self-remediation using Azure AD Multi-Factor Authentication (MFA) and self-service password reset (SSPR).

- When a user risk policy triggers: 
   - Administrators can require a secure password reset, requiring Azure AD MFA be done before the user creates a new password with SSPR, resetting the user risk. 
- When a sign-in risk policy triggers: 
   - Azure AD MFA can be triggered, allowing to user to prove it's them by using one of their registered authentication methods, resetting the sign-in risk. 

> [!WARNING]
> Users must register for Azure AD MFA and SSPR before they face a situation requiring remediation. Users not registered are blocked and require administrator intervention.
> 
> Password change (I know my password and want to change it to something new) outside of the risky user policy remediation flow does not meet the requirement for secure password reset.

## Exclusions

Policies allow for excluding users such as your [emergency access or break-glass administrator accounts](../roles/security-emergency-access.md). Organizations may need to exclude other accounts from specific policies based on the way the accounts are used. Exclusions should be reviewed regularly to see if they're still applicable.

## Enable policies

There are two locations where these policies may be configured, Conditional Access and Identity Protection. Configuration using Conditional Access policies is the preferred method, providing more context including:

   - Enhanced diagnostic data
   - Report-only mode integration
   - Graph API support
   - Use more Conditional Access attributes like sign-in frequency in the policy

Organizations can choose to deploy policies using the steps outlined below or using the [Conditional Access templates (Preview)](../conditional-access/concept-conditional-access-policy-common.md#conditional-access-templates-preview).

> [!VIDEO https://www.youtube.com/embed/zEsbbik-BTE]

Before organizations enable remediation policies, they may want to [investigate](howto-identity-protection-investigate-risk.md) and [remediate](howto-identity-protection-remediate-unblock.md) any active risks.

### User risk with Conditional Access

1. Sign in to the **Azure portal** as a Global Administrator, Security Administrator, or Conditional Access Administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
   1. Select **Done**.
1. Under **Cloud apps or actions** > **Include**, select **All cloud apps**.
1. Under **Conditions** > **User risk**, set **Configure** to **Yes**. 
   1. Under **Configure user risk levels needed for policy to be enforced**, select **High**.
   1. Select **Done**.
1. Under **Access controls** > **Grant**.
   1. Select **Grant access**, **Require password change**.
   1. Select **Select**.
1. Under **Session**.
   1. Select **Sign-in frequency**.
   1. Ensure **Every time** is selected.
   1. Select **Select**.
1. Confirm your settings, and set **Enable policy** to **On**.
1. Select **Create** to create to enable your policy.

### Sign in risk with Conditional Access

1. Sign in to the **Azure portal** as a Global Administrator, Security Administrator, or Conditional Access Administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
   1. Select **Done**.
1. Under **Cloud apps or actions** > **Include**, select **All cloud apps**.
1. Under **Conditions** > **Sign-in risk**, set **Configure** to **Yes**. Under **Select the sign-in risk level this policy will apply to**. 
   1. Select **High** and **Medium**.
   1. Select **Done**.
1. Under **Access controls** > **Grant**.
   1. Select **Grant access**, **Require multi-factor authentication**.
   1. Select **Select**.
1. Under **Session**.
   1. Select **Sign-in frequency**.
   1. Ensure **Every time** is selected.
   1. Select **Select**.
1. Confirm your settings and set **Enable policy** to **On**.
1. Select **Create** to create to enable your policy.

## Next steps

- [Enable Azure AD Multi-Factor Authentication registration policy](howto-identity-protection-configure-mfa-policy.md)
- [What is risk](concept-identity-protection-risks.md)
- [Investigate risk detections](howto-identity-protection-investigate-risk.md)
- [Simulate risk detections](howto-identity-protection-simulate-risk.md)
- [Require reauthentication every time](../conditional-access/howto-conditional-access-session-lifetime.md#require-reauthentication-every-time)