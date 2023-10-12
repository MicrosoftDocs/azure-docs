---
title: View notification settings for a rule in the Autopilot dashboard in Permissions Management
description: How to view notification settings for a rule  in the Autopilot dashboard in Microsoft Entra Permissions Management.
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

# View notification settings for a rule in the Autopilot dashboard

This article describes how to view notification settings for a rule in the Microsoft Entra Permissions Management **Autopilot** dashboard.

> [!NOTE]
> Only users with **Administrator** permissions can view and make changes on the Autopilot tab. If you don't have these permissions, contact your system administrator.

## View notification settings for a rule

1. In the Permissions Management home page, select the **Autopilot** tab.
1. In the **Autopilot** dashboard, from the **Authorization system types** dropdown, select Amazon Web Services (**AWS**), Microsoft **Azure**, or Google Cloud Platform (**GCP**).
1. From the **Authorization System** dropdown, in the **List** and **Folders** box, select the account and folder names that you want, and then select **Apply**.
1. In the **Autopilot** dashboard, select a rule.
1. In the far right of the row, select the ellipses **(...)**
1. To view notification settings for a rule, select **Notification Settings**.

    Permissions Management displays a list of subscribed users. These users are signed up to receive notifications for the selected rule.

1. To close the **Notification Settings** box, select **Close**.


## Next steps

- For more information about viewing rules, see [View roles in the Autopilot dashboard](ui-autopilot.md).
- For information about creating rules, see [Create a rule](how-to-create-rule.md).
- For information about generating, viewing, and applying rule recommendations for rules, see [Generate, view, and apply rule recommendations for rules](how-to-recommendations-rule.md).
