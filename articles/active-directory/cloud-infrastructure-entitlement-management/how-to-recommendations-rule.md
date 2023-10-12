---
title: Generate, view, and apply rule recommendations in the Microsoft Entra Permissions Management Autopilot dashboard
description: How to generate, view, and apply rule recommendations in the Microsoft Entra Permissions Management Autopilot dashboard.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 06/16/2023
ms.author: jfields
---

# Generate, view, and apply rule recommendations in the Autopilot dashboard

This article describes how to generate and view rule recommendations in the Permissions Management **Autopilot** dashboard.

> [!NOTE]
> Only users with **Administrator** permissions can view and make changes on the Autopilot tab. If you don't have these permissions, contact your system administrator.

## Generate rule recommendations

1. In the Permissions Management home page, select the **Autopilot** tab.
1. In the **Autopilot** dashboard, from the **Authorization system types** dropdown, select Amazon Web Services (**AWS**), Microsoft **Azure**, or Google Cloud Platform (**GCP**).
1. From the **Authorization System** dropdown, in the **List** and **Folders** box, select the account and folder names that you want, and then select **Apply**.
1. In the **Autopilot** dashboard, select a rule.
1. In the far right of the row, select the ellipses **(...)**.
1. To generate recommendations for each user and the authorization system, select **Generate Recommendations**.

    Only the user who created the selected rule can generate a recommendation.
1. View your recommendations in the **Recommendations** subtab.
1. Select **Close** to close the **Recommendations** subtab.

## View rule recommendations

1. In the Permissions Management home page, select the **Autopilot** tab.
1. In the **Autopilot** dashboard, from the **Authorization system types** dropdown, select Amazon Web Services (**AWS**), Microsoft **Azure**, or Google Cloud Platform (**GCP**).
1. From the **Authorization System** dropdown, in the **List** and **Folders** box, select the account and folder names that you want, and then select **Apply**.
1. In the **Autopilot** dashboard, select a rule.
1. In the far right of the row, select the ellipses **(...)**

1. To view recommendations for each user and the authorization system, select **View Recommendations**.

    Permissions Management displays the recommendations for each user and authorization system in the **Recommendations** subtab.

1. Select **Close** to close the **Recommendations** subtab.

## Apply rule recommendations

1. In the Permissions Management home page, select the **Autopilot** tab.
1. In the **Autopilot** dashboard, from the **Authorization system types** dropdown, select Amazon Web Services (**AWS**), Microsoft **Azure**, or Google Cloud Platform (**GCP**).
1. From the **Authorization System** dropdown, in the **List** and **Folders** box, select the account and folder names that you want, and then select **Apply**.
1. In the **Autopilot** dashboard, select a rule.
1. In the far right of the row, select the ellipses **(...)**

1. To view recommendations for each user and the authorization system, select **View Recommendations**.

    Permissions Management displays the recommendations for each user and authorization system in the **Recommendations** subtab.

1. To apply a recommendation, select the **Apply Recommendations** subtab, and then select a recommendation.
1. Select **Close** to close the **Recommendations** subtab.

## Unapply rule recommendations

1. In the Permissions Management home page, select the **Autopilot** tab.
1. In the **Autopilot** dashboard, from the **Authorization system types** dropdown, select Amazon Web Services (**AWS**), Microsoft **Azure**, or Google Cloud Platform (**GCP**).
1. From the **Authorization System** dropdown, in the **List** and **Folders** box, select the account and folder names that you want, and then select **Apply**.
1. In the **Autopilot** dashboard, select a rule.
1. In the far right of the row, select the ellipses **(...)**

1. To view recommendations for each user and the authorization system, select **View Recommendations**.

    Permissions Management displays the recommendations for each user and authorization system in the **Recommendations** subtab.

1. To remove a recommendation, select the **Unapply Recommendations** subtab, and then select a recommendation.
1. Select **Close** to close the **Recommendations** subtab.


## Next steps

- For more information about viewing rules, see [View roles in the Autopilot dashboard](ui-autopilot.md).
- For information about creating rules, see [Create a rule](how-to-create-rule.md).
- For information about notification settings for rules, see [View notification settings for a rule](how-to-notifications-rule.md).
