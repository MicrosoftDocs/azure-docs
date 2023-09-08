---
title: User risk-based password change
description: Create Conditional Access policies using Identity Protection user risk

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 07/18/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: calebb, lhuangnorth

ms.collection: M365-identity-device-management
---
# Common Conditional Access policy: User risk-based password change

Microsoft works with researchers, law enforcement, various security teams at Microsoft, and other trusted sources to find leaked username and password pairs. Organizations with Azure AD Premium P2 licenses can create Conditional Access policies incorporating [Azure AD Identity Protection user risk detections](../identity-protection/concept-identity-protection-risks.md). 

There are two locations where this policy may be configured, Conditional Access and Identity Protection. Configuration using a Conditional Access policy is the preferred method providing more context including enhanced diagnostic data, report-only mode integration, Graph API support, and the ability to utilize other Conditional Access attributes like sign-in frequency in the policy.

## Template deployment

Organizations can choose to deploy this policy using the steps outlined below or using the [Conditional Access templates](concept-conditional-access-policy-common.md#conditional-access-templates). 

## Enable with Conditional Access policy

1. Sign in to the **[Microsoft Entra admin center](https://entra.microsoft.com)** as a [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator).
1. Browse to **Microsoft Entra ID (Azure AD)** > **Protection** > **Conditional Access**.
1. Select **Create new policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
1. Under **Target resources** > **Cloud apps** > **Include**, select **All cloud apps**.
1. Under **Conditions** > **User risk**, set **Configure** to **Yes**. 
   1. Under **Configure user risk levels needed for policy to be enforced**, select **High**.
   1. Select **Done**.
1. Under **Access controls** > **Grant**.
   1. Select **Grant access**, **Require multifactor authentication** and **Require password change**.
   1. Select **Select**.
1. Under **Session**.
   1. Select **Sign-in frequency**.
   1. Ensure **Every time** is selected.
   1. Select **Select**.
1. Confirm your settings, and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After administrators confirm the settings using [report-only mode](howto-conditional-access-insights-reporting.md), they can move the **Enable policy** toggle from **Report-only** to **On**.

## Next steps

- [Require reauthentication every time](../conditional-access/howto-conditional-access-session-lifetime.md#require-reauthentication-every-time)
- [Remediate risks and unblock users](../identity-protection/howto-identity-protection-remediate-unblock.md)
- [Conditional Access common policies](concept-conditional-access-policy-common.md)
- [Sign-in risk-based Conditional Access](howto-conditional-access-policy-risk.md)
- [Determine effect using Conditional Access report-only mode](howto-conditional-access-insights-reporting.md)
- [Use report-only mode for Conditional Access to determine the results of new policy decisions.](concept-conditional-access-report-only.md)
- [What is Azure Active Directory Identity Protection?](../identity-protection/overview-identity-protection.md)
