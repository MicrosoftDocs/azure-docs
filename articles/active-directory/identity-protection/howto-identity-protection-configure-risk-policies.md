---
title: Risk policies - Azure Active Directory Identity Protection
description: Enable and configure risk policies in Azure Active Directory Identity Protection

services: active-directory
ms.service: active-directory
ms.subservice: identity-protection
ms.topic: how-to
ms.date: 05/04/2021

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: sahandle

ms.collection: M365-identity-device-management
---
# How To: Configure and enable risk policies

As we learned in the previous article, [Identity Protection policies](concept-identity-protection-policies.md) we have two risk policies that we can enable in our directory. 

- Sign-in risk policy
- User risk policy

![Security overview page to enable user and sign-in risk policies](./media/howto-identity-protection-configure-risk-policies/identity-protection-security-overview.png)

Both policies work to automate the response to risk detections in your environment and allow users to self-remediate when risk is detected. 

> [!VIDEO https://www.youtube.com/embed/zEsbbik-BTE]

## Choosing acceptable risk levels

Organizations must decide the level of risk they are willing to accept balancing user experience and security posture. 

Microsoft's recommendation is to set the user risk policy threshold to **High** and the sign-in risk policy to **Medium and above** and allow self-remediation options. Choosing to block access rather than allowing self-remediation options, like password change and multi-factor authentication, will impact your users and administrators. Weigh this choice when configuring your policies.

Choosing a **High** threshold reduces the number of times a policy is triggered and minimizes the impact to users. However, it excludes **Low** and **Medium** risk detections from the policy, which may not block an attacker from exploiting a compromised identity. Selecting a **Low** threshold introduces more user interrupts, but increased security posture.

Configured trusted [network locations](../conditional-access/location-condition.md) are used by Identity Protection in some risk detections to reduce false positives.

### Risk remediation

Organizations can choose to block access when risk is detected, but that stops legitimate users from doing what they need to. A better solution is to allow self-remediation using Azure AD Multi-Factor Authentication (MFA) and self-service password reset (SSPR). 

- When a user triggers a user risk policy a secure password reset through SSPR can trigger, requiring Azure AD Multi-Factor Authentication be performed prior to the user creating a new password, and resetting the user risk. 
- When a user triggers a sign in risk policy Azure AD MFA can be triggered, allowing to user to prove it is them by using one of their registered authentication methods, and resetting the sign in risk. 

> [!WARNING]
> Users must be registered for Azure AD MFA and SSPR before they get into a situation requiring remediation or will be blocked and require administrator intervention.

## Exclusions

Policies allow for excluding users such as your [emergency access or break-glass administrator accounts](../roles/security-emergency-access.md). Organizations may determine they need to exclude other accounts from specific policies based on the way the accounts are used. All exclusions should be reviewed regularly to see if they are still applicable.

## Enable policies

There are two locations where these policies may be configured, Conditional Access and Identity Protection. Configuration using Conditional Access policies is the preferred method, providing more context including: enhanced diagnostic data, report-only mode integration, Graph API support, and the ability to utilize other Conditional Access attributes in the policies.

To create a sin-in risk-based policy, follow the instructions in the article, [Conditional Access: Sign-in risk-based Conditional Access](../conditional-access/howto-conditional-access-policy-risk.md).

To create a user risk-based policy, follow the instructions in the article, [Conditional Access: User risk-based Conditional Access](../conditional-access/howto-conditional-access-policy-risk-user.md)


## Next steps

- [Enable Azure AD Multi-Factor Authentication registration policy](howto-identity-protection-configure-mfa-policy.md)

- [What is risk](concept-identity-protection-risks.md)

- [Investigate risk detections](howto-identity-protection-investigate-risk.md)

- [Simulate risk detections](howto-identity-protection-simulate-risk.md)
