---
title: How to apply Conditional Access policies to Private Access apps
description: How to apply Conditional Access policies to Microsoft Entra Private Access apps.

ms.service: network-access
ms.subservice: 
ms.topic: how-to
ms.date: 06/21/2023

ms.author: sarahlipsey
author: shlipsey3
manager: amycolannino
ms.reviewer: katabish
---
# Apply Conditional Access policies to Private Access apps

Applying Conditional Access policies to your Microsoft Entra Private Access apps is a powerful way to enforce security policies for your internal, private resources. You can apply Conditional Access policies to your Quick Access and Global Secure Access (preview) enterprise apps.

## Prerequisites

* Administrators who interact with **Global Secure Access preview** features must have one or more of the following role assignments depending on the tasks they're performing.
   * [Global Secure Access Administrator role](../active-directory/roles/permissions-reference.md)
   * [Conditional Access Administrator](../active-directory/roles/permissions-reference.md#conditional-access-administrator) or [Security Administrator](../active-directory/roles/permissions-reference.md#security-administrator) to create and interact with Conditional Access policies.
* You must be routing your private network traffic through the **Global Secure Access preview**.
* You need to have configured Quick Access or Per-app Access.

## Access Conditional Policies from Global Secure Access

You can view and create Conditional Access policies from Global Secure Access without navigating to Microsoft Entra ID.

1. Sign in to the **[Microsoft Entra admin center](https://entra.microsoft.com)** as a Conditional Access Administrator or Security Administrator.
1. Go to **Global Secure Access (preview)** > **Applications** > **Enterprise applications.**
1. Select an application from the list.
    ![Screenshot of the Enterprise applications details.](media/how-to-target-resource-private-access-apps/enterprise-apps.png)
1. Select **Conditional Access** from the side menu. Any existing Conditional Access policies appear in a list. 
    ![Screenshot of the Conditional Access menu option.](media/how-to-target-resource-private-access-apps/conditional-access-policies.png)

Alternatively, you can got to **Microsoft Entra ID** > **Protection** > **Conditional Access** then select **Policies** from the side menu.
## Create a Conditional Access policy targeting the Quick Access application

The following example creates a Conditional Access policy requiring multifactor authentication for your Quick Access application.

1. Sign in to the **[Microsoft Entra admin center](https://entra.microsoft.com)** as a Conditional Access Administrator or Security Administrator.
1. Browse to **Microsoft Entra ID** > **Protection** > **Conditional Access**.
1. Select **Create new policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
1. Under **Target resources** > **Include**, and select **Select apps**.
   1. Choose your configured Quick Access application.
1. Under **Access controls** > **Grant**
   1. Select **Grant access**, **Require multifactor authentication**, and select **Select**.
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After administrators confirm the policy settings using [report-only mode](../active-directory/conditional-access/howto-conditional-access-insights-reporting.md), an administrator can move the **Enable policy** toggle from **Report-only** to **On**.