---
title: How to apply Conditional Access policies to Microsoft Entra Private Access apps
description: How to apply Conditional Access policies to Microsoft Entra Private Access apps.

ms.service: network-access
ms.subservice: 
ms.topic: how-to
ms.date: 07/07/2023

ms.author: sarahlipsey
author: shlipsey3
manager: amycolannino
ms.reviewer: katabish
---
# Apply Conditional Access policies to Private Access apps

Applying Conditional Access policies to your Microsoft Entra Private Access apps is a powerful way to enforce security policies for your internal, private resources. You can apply Conditional Access policies to your Quick Access and Private Access apps from Global Secure Access (preview).

This article describes how to apply Conditional Access policies to your Quick Access and Private Access apps.

## Prerequisites

* Administrators who interact with **Global Secure Access preview** features must have one or more of the following role assignments depending on the tasks they're performing.
   * [Global Secure Access Administrator role](/azure/active-directory/roles/permissions-reference)
   * [Conditional Access Administrator](/azure/active-directory/roles/permissions-reference#conditional-access-administrator) or [Security Administrator](/azure/active-directory/roles/permissions-reference#security-administrator) to create and interact with Conditional Access policies.
* You need to have configured Quick Access or Private Access.
* The preview requires a Microsoft Entra ID Premium P1 license. If needed, you can [purchase licenses or get trial licenses](https://aka.ms/azureadlicense).

### Known limitations

- At this time, connecting through the Global Secure Access Client is required to acquire Private Access traffic.

## Conditional Access and Global Secure Access

You can create a Conditional Access policy for your Quick Access or Private Access apps from Global Secure Access. Starting the process from Global Secure Access automatically adds the selected app as the **Target resource** for the policy. All you need to do is configure the policy settings.

1. Sign in to the **[Microsoft Entra admin center](https://entra.microsoft.com)** as a Conditional Access Administrator or Security Administrator.
1. Go to **Global Secure Access (preview)** > **Applications** > **Enterprise applications.**
1. Select an application from the list.

    ![Screenshot of the Enterprise applications details.](media/how-to-target-resource-private-access-apps/enterprise-apps.png)

1. Select **Conditional Access** from the side menu. Any existing Conditional Access policies appear in a list. 

    ![Screenshot of the Conditional Access menu option.](media/how-to-target-resource-private-access-apps/conditional-access-policies.png)

1. Select **Create new policy**. The selected app appears in the **Target resources** details.

    ![Screenshot of the Conditional Access policy with the Quick Access app selected.](media/how-to-target-resource-private-access-apps/quick-access-target-resource.png)

1. Configure the conditions, access controls, and assign users and groups as needed.

You can also apply Conditional Access policies to a group of applications based on custom attributes. To learn more, go to [Filter for applications in Conditional Access policy (Preview)](/azure/active-directory/conditional-access/concept-filter-for-applications).

### Assignments and Access controls example

Adjust the following policy details to create a Conditional Access policy requiring multifactor authentication, device compliance, or a hybrid Azure AD joined device for your Quick Access application. The user assignments ensure that your organization's emergency access or break-glass accounts are excluded from the policy.

1. Under **Assignments**, select **Users**:
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Users and groups** and choose your organization's [emergency access or break-glass accounts](#user-exclusions).  
1. Under **Access controls** > **Grant**:
   1. Select **Require multifactor authentication**, **Require device to be marked as compliant**, and **Require hybrid Azure AD joined device**
1. Confirm your settings and set **Enable policy** to **Report-only**.
   
After administrators confirm the policy settings using [report-only mode](/azure/active-directory/conditional-access/howto-conditional-access-insights-reporting), an administrator can move the **Enable policy** toggle from **Report-only** to **On**.

### User exclusions

[!INCLUDE [active-directory-policy-exclusions](../../includes/active-directory-policy-exclude-user.md)]

## Next steps

- [Enable the Private Access traffic forwarding profile](how-to-manage-private-access-profile.md)
- [Enable source IP restoration](how-to-source-ip-restoration.md)