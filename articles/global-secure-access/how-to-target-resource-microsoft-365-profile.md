---
title: How to apply Conditional Access policies to the Microsoft 365 traffic profile
description: Learn how to apply Conditional Access policies to the Microsoft 365 traffic profile.

ms.service: network-access
ms.subservice: 
ms.topic: how-to
ms.date: 07/07/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: mamkumar
---
# Apply Conditional Access policies to the Microsoft 365 traffic profile

With a devoted traffic forwarding profile for all your Microsoft 365 traffic, you can apply Conditional Access policies to all of your Microsoft 365 traffic. With Conditional Access, you can require multifactor authentication and device compliance for accessing Microsoft 365 resources. 

This article describes how to apply Conditional Access policies to your Microsoft 365 traffic forwarding profile.

## Prerequisites

* Administrators who interact with **Global Secure Access preview** features must have one or more of the following role assignments depending on the tasks they're performing.
   * [Global Secure Access Administrator role](/azure/active-directory/roles/permissions-reference)
   * [Conditional Access Administrator](/azure/active-directory/roles/permissions-reference#conditional-access-administrator) or [Security Administrator](/azure/active-directory/roles/permissions-reference#security-administrator) to create and interact with Conditional Access policies.
* The preview requires a Microsoft Entra ID Premium P1 license. If needed, you can [purchase licenses or get trial licenses](https://aka.ms/azureadlicense).
* To use the Microsoft 365 traffic forwarding profile, a Microsoft 365 E3 license is recommended.

## Create a Conditional Access policy targeting the Microsoft 365 traffic profile

The following example policy targets all users except for your break-glass accounts and guest/external users, requiring multifactor authentication, device compliance, or a hybrid Azure AD joined device when accessing Microsoft 365 traffic.

:::image type="content" source="media/how-to-target-resource-microsoft-365-profile/target-resource-traffic-profile.png" alt-text="Screenshot showing a Conditional Access policy targeting a traffic profile.":::

1. Sign in to the **[Microsoft Entra admin center](https://entra.microsoft.com)** as a Conditional Access Administrator or Security Administrator.
1. Browse to **Identity** > **Protection** > **Conditional Access**.
1. Select **Create new policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**:
      1. Select **Users and groups** and choose your organization's [emergency access or break-glass accounts](#user-exclusions).
      1. Select **Guest or external users** and select all checkboxes.
1. Under **Target resources** > **Network Access (Preview)***.
   1. Choose **Microsoft 365 traffic**.
1. Under **Access controls** > **Grant**.
   1. Select **Require multifactor authentication**, **Require device to be marked as compliant**, and **Require hybrid Azure AD joined device**
   1. **For multiple controls** select **Require one of the selected controls**.
   1. Select **Select**.

After administrators confirm the policy settings using [report-only mode](/azure/active-directory/conditional-access/howto-conditional-access-insights-reporting), an administrator can move the **Enable policy** toggle from **Report-only** to **On**.

### User exclusions

[!INCLUDE [active-directory-policy-exclusions](../../includes/active-directory-policy-exclude-user.md)]

## Next steps

The next step for getting started with Microsoft Entra Internet Access is to [review the Global Secure Access logs](concept-global-secure-access-logs-monitoring.md).

For more information about traffic forwarding, see the following articles:

- [Learn about traffic forwarding profiles](concept-traffic-forwarding.md)
- [Manage the Microsoft 365 traffic profile](how-to-manage-microsoft-365-profile.md)
