---
title: Conditional Access - Risk-based Conditional Access - Azure Active Directory
description: Create Conditional Access policies to enable Identity Protection enhancements to policies

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 05/26/2020

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb, rogoya

ms.collection: M365-identity-device-management
---
# Conditional Access: Risk-based Conditional Access

Organizations with Azure AD Premium P2 licenses can create Conditional Access policies incorporating Azure AD Identity Protection risk detections. There are three default policies that can be enabled out of the box. 

* Require all users to register for Azure Multi-Factor Authentication.
* Require a password change for users that are high risk.
* Require multi-factor authentication for users with medium or high sign-in risk.

## Require all users to register for Azure Multi-Factor Authentication

Enabling this policy will require all users to register for Azure Multi-Factor Authentication within 14 days. 

1. Sign in to the **Azure portal**.
1. Click on **All services**, then browse to **Azure AD Identity Protection**.
1. Click on **MFA registration**.
1. Under **Assignments**, select **Users**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Select excluded users**, choose your organization's emergency access or break-glass accounts, and select **Select**. 
   1. Select **Done**.
1. Set **Enforce Policy** to **On**.
1. Click **Save**.

## Require a password change high-risk users

Microsoft works with researchers, law enforcement, various security teams at Microsoft, and other trusted sources to find username and password pairs. When one of these pairs matches an account in your environment, a risk-based password change can be triggered using the following policy.

1. Sign in to the **Azure portal**.
1. Click on **All services**, then browse to **Azure AD Identity Protection**.
1. Click on **User risk policy**.
1. Under **Assignments**, select **Users**
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Select excluded users**, choose your organization's emergency access or break-glass accounts, and select **Select**.
   1. Select **Done**.
1. Under **Conditions**, select **User risk**, then choose **High**.
   1. Click **Select** then **Done**.
1. Under **Controls** > **Access**, choose **Allow access**, and then select **Require password change**.
   1. Click **Select**.
1. Set **Enforce Policy** to **On**.
1. Click **Save**.

## Require MFA medium or high sign-in risk users

Most users have a normal behavior that can be tracked, when they fall outside of this norm it could be risky to allow them to just sign in. You may want to block that user or maybe just ask them to perform multi-factor authentication to prove that they are really who they say they are. To enable a policy requiring MFA when a risky sign-in is detected, enable the following policy.

1. Sign in to the **Azure portal**.
1. Click on **All services**, then browse to **Azure AD Identity Protection**.
1. Click on **Sign-in risk policy**
1. Under **Assignments**, select **Users**
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Select excluded users**, choose your organization's emergency access or break-glass accounts, and select **Select**.
   1. Select **Done**.
1. Under **Conditions**, select **Sign-in risk**, then choose **Medium and above**.
   1. Click **Select** then **Done**.
1. Under **Controls** > **Access**, choose **Allow access**, and then select **Require multi-factor authentication**.
   1. Click **Select**.
1. Set **Enforce Policy** to **On**.
1. Click **Save**.

## Next steps

[Conditional Access common policies](concept-conditional-access-policy-common.md)

[Determine impact using Conditional Access report-only mode](howto-conditional-access-report-only.md)

[Simulate sign in behavior using the Conditional Access What If tool](troubleshoot-conditional-access-what-if.md)

[How it works: Azure Multi-Factor Authentication](../authentication/concept-mfa-howitworks.md)

[What is Azure Active Directory Identity Protection?](../identity-protection/overview.md)
