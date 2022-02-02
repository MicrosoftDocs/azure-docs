---
title: View alerts and alert triggers in Microsoft CloudKnox Permissions Management
description: How to view alerts and alert triggers in Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 02/02/2022
ms.author: v-ydequadros
---

# View alerts and alert triggers

This article describes how you can view alerts and alert triggers in Microsoft CloudKnox Permissions Management (CloudKnox).

## View alerts

1. In the CloudKnox home page, select **Activity triggers** (the bell icon).
1. In the **Activity** tab, select the **Alerts** subtab.
1. From the **Alert name** dropdown, select **All**, select the alerts you want to view.
1. From the **Date** dropdown, select **Last 24 Hours**, **Last 2 Days**, **Last Week**, or **Custom Range**.

    If you select **Custom range**, select date and time settings, and then select **Apply**.
1. To run the alert, select **Apply**

    The **Alerts** table displays information about your alerts.


## View alert triggers

1. In the CloudKnox home page, select **Activity triggers** (the bell icon).
1. In the **Activity** tab, select the **Alert triggers** subtab.
1. From the **Status** dropdown, select **All**, **Activated** or **Deactivated**, then select **Apply**

    The **Triggers** table displays the following information:

    - **Alerts**: Displays the name of the alert trigger.
    - **# of users subscribed**: Displays how many users are subscribed to a specific alert trigger. 

        -Select the number in this column to view which users are subscribed to the alert trigger.

    - **Created by**: Displays the email address of the user who created the alert trigger.
    - **Modified by**: Displays the email address of the user who last modified the alert trigger.
    - **Last updated**: Displays the date and time the alert trigger was last updated.
    - **Subscription**: Displays either **On** or **Off**.

         - If the column displays **Off**, the current user isn't subscribed to that alert. Switch the toggle to **On** to subscribe to the alert.
         - The person who creates an alert trigger is automatically subscribed to the alert, and will receive emails about the alert.

1. To see only activated or only deactivated triggers, from the **Status** dropdown, select **Activated** or **Deactivated**, and then select **Apply**. 

1. To view other options available to you, select the ellipses (**...**), and then select from the available options.

    If the **Subscription** is **On**, the following options are available:

    - **Edit**: Enables you to modify alert parameters 

       > [!NOTE]
         > Only the user who created the alert can perform the following actions: edit the trigger screen, rename an alert, deactivate an alert, and delete an alert. Changes made by other users aren't saved.

    - **Duplicate**: Create a duplicate of the alert called "**Copy of XXX**".
    - **Rename**: Enter the new name of the query, and then select **Save.**
    - **Deactivate**: The alert will still be listed, but will no longer send emails to subscribed users.
    - **Activate**: Activate the alert trigger and start sending emails to subscribed users.
    - **Notification settings**: View the **Email** of users who are subscribed to the alert trigger and their **User status**. 
    - **Delete**: Delete the alert.

    If the **Subscription** is **Off**, the following options are available:
    - **View**: View  details of the alert trigger.
    - **Notification settings**: View the **Email** of users who are subscribed to the alert trigger and their **User status**. 
    - **Duplicate**: Create a duplicate copy of the selected alert trigger.


## Next steps

- For information on how to create and view an alert, see [Create an alert](cloudknox-howto-create-alert-trigger.md). 
- For information on rule-based anomalies and anomaly triggers, see [Create and view rule-based anomalies and anomaly triggers](cloudknox-product-rule-based-anomalies.md)
- For information on finding outliers in identity's behavior, see [Find outliers in an identity's behavior](cloudknox-product-statistical-anomalies.md)
- For information on permission analytics triggers, see [Create and view permission analytics triggers](cloudknox-product-permission-analytics.md)