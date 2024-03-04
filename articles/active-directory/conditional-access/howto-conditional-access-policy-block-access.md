---
title: Conditional Access - Block access
description: Create a custom Conditional Access policy to Block access

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
# Conditional Access: Block access

For organizations with a conservative cloud migration approach, the block all policy is an option that can be used. 

> [!CAUTION]
> Misconfiguration of a block policy can lead to organizations being locked out of the Azure portal.

Policies like these can have unintended side effects. Proper testing and validation are vital before enabling. Administrators should utilize tools such as [Conditional Access report-only mode](concept-conditional-access-report-only.md) and [the What If tool in Conditional Access](what-if-tool.md) when making changes.

## User exclusions
[!INCLUDE [active-directory-policy-exclusions](../../../includes/active-directory-policy-exclude-user.md)]

## Create a Conditional Access policy

The following steps will help create Conditional Access policies to block access to all apps except for [Office 365](concept-conditional-access-cloud-apps.md#office-365) if users aren't on a trusted network. These policies are put in to [Report-only mode](howto-conditional-access-insights-reporting.md) to start so administrators can determine the impact they'll have on existing users. When administrators are comfortable that the policies apply as they intend, they can switch them to **On**.

The first policy blocks access to all apps except for Microsoft 365 applications if not on a trusted location.

1. Sign in to the **[Microsoft Entra admin center](https://entra.microsoft.com)** as a [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator).
1. Browse to **Microsoft Entra ID (Azure AD)** > **Protection** > **Conditional Access**.
1. Select **Create new policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
1. Under **Target resources** > **Cloud apps**, select the following options:
   1. Under **Include**, select **All cloud apps**.
   1. Under **Exclude**, select **Office 365**, select **Select**.
1. Under **Conditions**:
   1. Under **Conditions** > **Location**.
      1. Set **Configure** to **Yes**
      1. Under **Include**, select **Any location**.
      1. Under **Exclude**, select **All trusted locations**.
   1. Under **Client apps**, set **Configure** to **Yes**, and select **Done**.
1. Under **Access controls** > **Grant**, select **Block access**, then select **Select**.
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After administrators confirm the settings using [report-only mode](howto-conditional-access-insights-reporting.md), they can move the **Enable policy** toggle from **Report-only** to **On**.

A second policy is created below to require multifactor authentication or a compliant device for users of Microsoft 365.

1. Select **Create new policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
1. Under **Target resources** > **Cloud apps** > **Include** > **Select apps**, choose **Office 365**, and select **Select**.
1. Under **Access controls** > **Grant**, select **Grant access**.
   1. Select **Require multifactor authentication** and **Require device to be marked as compliant** select **Select**.
   1. Ensure **Require one of the selected controls** is selected.
   1. Select **Select**.
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After administrators confirm the settings using [report-only mode](howto-conditional-access-insights-reporting.md), they can move the **Enable policy** toggle from **Report-only** to **On**.

> [!NOTE]
> Conditional Access policies are enforced after first-factor authentication is completed. Conditional Access isn't intended to be an organization's first line of defense for scenarios like denial-of-service (DoS) attacks, but it can use signals from these events to determine access.

## Next steps

[Conditional Access templates](concept-conditional-access-policy-common.md)

[Determine effect using Conditional Access report-only mode](howto-conditional-access-insights-reporting.md)

[Use report-only mode for Conditional Access to determine the results of new policy decisions.](concept-conditional-access-report-only.md)
