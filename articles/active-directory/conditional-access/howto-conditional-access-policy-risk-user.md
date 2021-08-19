---
title: User risk-based Conditional Access - Azure Active Directory
description: Create Conditional Access policies using Identity Protection user risk

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 05/04/2021

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb, rogoya

ms.collection: M365-identity-device-management
---
# Conditional Access: User risk-based Conditional Access

Microsoft works with researchers, law enforcement, various security teams at Microsoft, and other trusted sources to find leaked username and password pairs. Organizations with Azure AD Premium P2 licenses can create Conditional Access policies incorporating [Azure AD Identity Protection user risk detections](../identity-protection/concept-identity-protection-risks.md#user-risk). 

There are two locations where this policy may be configured, Conditional Access and Identity Protection. Configuration using a Conditional Access policy is the preferred method providing more context including enhanced diagnostic data, report-only mode integration, Graph API support, and the ability to utilize other Conditional Access attributes in the policy.

## Enable with Conditional Access policy

1. Sign in to the **Azure portal** as a global administrator, security administrator, or Conditional Access administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies. For more info, [set naming standards for your policies](./plan-conditional-access.md#set-naming-standards-for-your-policies).
1. Under **Assignments**, select **Users and groups**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
   1. Select **Done**.
1. Under **Cloud apps or actions** > **Include**, select **All cloud apps**.
1. Under **Conditions** > **User risk**, set **Configure** to **Yes**. Under **Configure user risk levels needed for policy to be enforced** select **High**, then select **Done**.
1. Under **Access controls** > **Grant**, select **Grant access**, **Require password change**, and select **Select**.
1. Confirm your settings, and set **Enable policy** to **On**.
1. Select **Create** to create to enable your policy.

## Enable through Identity Protection

1. Sign in to the **Azure portal**.
1. Select **All services**, then browse to **Azure AD Identity Protection**.
1. Select **User risk policy**.
1. Under **Assignments**, select **Users**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Select excluded users**, choose your organization's emergency access or break-glass accounts, and select **Select**.
   1. Select **Done**.
1. Under **Conditions**, select **User risk**, then choose **High**.
   1. Select **Select**, then **Done**.
1. Under **Controls** > **Access**, choose **Allow access**, and then select **Require password change**.
   1. Select **Select**.
1. Set **Enforce Policy** to **On**.
1. Select **Save**.

## Next steps

[Conditional Access common policies](concept-conditional-access-policy-common.md)

[Sign-in risk-based Conditional Access](howto-conditional-access-policy-risk.md)

[Determine impact using Conditional Access report-only mode](howto-conditional-access-insights-reporting.md)

[Simulate sign in behavior using the Conditional Access What If tool](troubleshoot-conditional-access-what-if.md)

[What is Azure Active Directory Identity Protection?](../identity-protection/overview-identity-protection.md)