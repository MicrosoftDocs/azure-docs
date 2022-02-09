---
title: Create and view activity alerts and alert triggers in CloudKnox Permissions Management 
description: How to create and view activity alerts and alert triggers in CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 02/09/2022
ms.author: v-ydequadros
---

# Create and view activity alerts and alert triggers

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

This article describes how you can create and view activity alerts and alert triggers in CloudKnox Permissions Management (CloudKnox).

## Create an activity trigger

1. In the CloudKnox home page, select **Activity triggers** (the bell icon).
1. In the **Activity** tab, select **Create alert trigger**.
1. In **Alert name**, enter a name for your activity trigger.
1. In **Authorization system type**, select your authorization system: Amazon Web Services (**AWS**), Microsoft **Azure**, or Google Cloud Platform (**GCP**).
1. In **Authorization system**, select **Is** or **In**, and then select one or more accounts and folders from the **List** and **Folders** options.
1. From the **Select a type** dropdown, select: **Access key ID**, **Identity tag key**, **Identity tag key value**, **Resource name**, **Resource tag key** or **Resource tag key value**.
1. From the **Operator** dropdown, select an option:

    - **Is**/**Is Not**: Select in the value field to view a list of all available usernames. You can either select or enter the required username.
    - **Contains**/**Not Contains**: Enter any text that the query parameter should or shouldn't contain, for example *CloudKnox*.
    - **In**/**Not In**: Select in the value field to view list of all available values. Select the required multiple values.

1. To add another parameter, select the plus sign **(+)**, then select an operator, and then enter a value.

    To remove a parameter, select the minus sign **(-)**.
1. To add another activity type, select **Add**, and then enter your parameters.
1. To save your alert, select **Save**.

    A message displays to confirm your activity trigger has been created.

    The **Triggers** table in the **Alert triggers** subtab displays your alert.

## View an activity alert

1. In the CloudKnox home page, select **Activity triggers** (the bell icon).
1. In the **Activity** tab, select the **Alerts** subtab.
1. From the **Alert name** dropdown, select an alert.
1. From the **Date** dropdown, select **Last 24 Hours**, **Last 2 Days**, **Last Week**, or **Custom Range**.

    If you select **Custom range**, select date and time settings, and then select **Apply**.
1. To run the alert, select **Apply**

    The **Alerts** table displays information about your alert.



## View activity alert triggers

1. In the CloudKnox home page, select **Activity triggers** (the bell icon).
1. In the **Activity** tab, select the **Alert triggers** subtab.
1. From the **Status** dropdown, select **All**, **Activated** or **Deactivated**, then select **Apply**.

    The **Triggers** table displays the following information:

    - **Alerts**: The name of the alert trigger.
    - **# of users subscribed**: The number of users who have subscribed to a specific alert trigger. 

        - Select a number in this column to view information about the user.

    - **Created by**: The email address of the user who created the alert trigger.
    - **Modified by**: The email address of the user who last modified the alert trigger.
    - **Last updated**: The date and time the alert trigger was last updated.
    - **Subscription**: A switch that displays if the alert is **On** or **Off**.

         - If the column displays **Off**, the current user isn't subscribed to that alert. Switch the toggle to **On** to subscribe to the alert.
         - The user who creates an alert trigger is automatically subscribed to the alert, and will receive emails about the alert.

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

- For an overview on activity triggers, see [View information about activity triggers](cloudknox-ui-triggers.md).
- For information on rule-based anomalies and anomaly triggers, see [Create and view rule-based anomalies and anomaly triggers](cloudknox-product-rule-based-anomalies.md).
- For information on finding outliers in identity's behavior, see [Create and view statistical anomalies and anomaly triggers](cloudknox-product-statistical-anomalies.md).
- For information on permission analytics triggers, see [Create and view permission analytics triggers](cloudknox-product-permission-analytics.md).