---
title: Microsoft Entra recommendation - Turn off per user MFA in Microsoft Entra ID
description: Learn why you should turn off per user MFA in Microsoft Entra ID
services: active-directory
author: shlipsey3
manager: amycolannino

ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.subservice: report-monitor
ms.date: 09/21/2023
ms.author: sarahlipsey
ms.reviewer: hafowler
---

# Microsoft Entra recommendation: Switch from per-user MFA to Conditional Access MFA

[Microsoft Entra recommendations](overview-recommendations.md) is a feature that provides you with personalized insights and actionable guidance to align your tenant with recommended best practices.

This article covers the recommendation to switch per-user multifactor authentication (MFA) accounts to Conditional Access MFA accounts. This recommendation is called `switchFromPerUserMFA` in the recommendations API in Microsoft Graph.

## Description

As an admin, you want to maintain security for your company’s resources, but you also want your employees to easily access resources as needed. MFA enables you to enhance the security posture of your tenant.

In your tenant, you can enable MFA on a per-user basis. In this scenario, your users perform MFA each time they sign in. There are some exceptions, such as when they sign in from trusted IP addresses or when the remember MFA on trusted devices feature is turned on. While enabling MFA is a good practice, switching per-user MFA to MFA based on [Conditional Access](../conditional-access/overview.md) can reduce the number of times your users are prompted for MFA.

This recommendation shows up if:

- You have per-user MFA configured for at least 5% of your users.
- Conditional Access policies are active for more than 1% of your users (indicating familiarity with Conditional Access policies).

## Value 

This recommendation improves your user's productivity and minimizes the sign-in time with fewer MFA prompts. Conditional Access and MFA used together help ensure that your most sensitive resources can have the tightest controls, while your least sensitive resources can be more freely accessible.

## Action plan

1. Confirm that there's an existing Conditional Access policy with an MFA requirement. Ensure that you're covering all resources and users you would like to secure with MFA.
    - Review your Conditional Access policies.

2. Require MFA using a Conditional Access policy.
    - [Secure user sign-in events with Microsoft Entra multifactor authentication](../authentication/tutorial-enable-azure-mfa.md).

3. Ensure that the per-user MFA configuration is turned off. 

After all users have been migrated to Conditional Access MFA accounts, the recommendation status automatically updates the next time the service runs. Continue to review your Conditional Access policies to improve the overall health of your tenant.

## Next steps

- [Review the Microsoft Entra recommendations overview](overview-recommendations.md)
- [Learn how to use Microsoft Entra recommendations](howto-use-recommendations.md)
- [Explore the Microsoft Graph API properties for recommendations](/graph/api/resources/recommendation)
- [Learn about requiring MFA for all users using Conditional Access](../conditional-access/howto-conditional-access-policy-all-users-mfa.md)
- [View the MFA Conditional Access policy tutorial](../authentication/tutorial-enable-azure-mfa.md)
