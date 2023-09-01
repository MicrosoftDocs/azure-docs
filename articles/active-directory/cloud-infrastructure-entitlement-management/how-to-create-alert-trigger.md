---
title: Create and view activity alerts and alert triggers in Microsoft Entra Permissions Management
description: How to create and view activity alerts and alert triggers in Microsoft Entra Permissions Management.
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

# Create and view activity alerts and alert triggers

This article describes how you can create and view activity alerts and alert triggers in Permissions Management.

## Create an activity alert trigger

1. In the Permissions Management home page, select **Activity Triggers** (the bell icon).
1. In the **Activity** tab, select **Create Activity Trigger**.
1. In the **Alert Name** box, enter a name for your alert.
1. In **Authorization System Type**, select your authorization system: Amazon Web Services (**AWS**), Microsoft **Azure**, or Google Cloud Platform (**GCP**).
1. In **Authorization System**, select **Is** or **In**, and then select one or more accounts and folders.
1. From the **Select a Type** dropdown, select: **Access Key ID**, **Identity Tag Key**, **Identity Tag Key Value**, **Resource Name**, **Resource Tag Key**,  **Resource Tag Key Value**, **Role Name**, **Role Session Name**, **State**, **Task Name**, or **Username**.
1. From the **Operator** dropdown, select an option:

    - **Is**/**Is Not**: Select in the value field to view a list of all available values. You can either select or enter the required value.
    - **Contains**/**Not Contains**: Enter any text that the query parameter should or shouldn't contain, for example *Permissions Management*.
    - **In**/**Not In**: Select in the value field to view list of all available values. Select the required multiple values.

1. To add another parameter, select the plus sign **(+)**, then select an operator, and then enter a value.

1. To remove a parameter, select the minus sign **(-)**.
1. To add another activity type, select **Add**, and then enter your parameters.
1. To save your alert, select **Save**.

    A message displays to confirm your activity trigger has been created.

    The **Triggers** table in the **Alert Triggers** subtab displays your alert trigger.

## View an activity alert

1. In the Permissions Management home page, select **Activity Triggers** (the bell icon).
1. In the **Activity** tab, select the **Alerts** subtab.
1. From the **Alert Name** dropdown, select an alert.
1. From the **Date** dropdown, select **Last 24 Hours**, **Last 2 Days**, **Last Week**, or **Custom Range**.

    If you select **Custom Range**, select date and time settings, and then select **Apply**.
1. To view the alert, select **Apply**

    The **Alerts** table displays information about your alert.

    Select the alert name to view the individual activities and further details about the **resources**, **tasks**, and **identities** involved.



## View activity alert triggers

1. In the Permissions Management home page, select **Activity triggers** (the bell icon).
1. In the **Activity** tab, select the **Alert Triggers** subtab.
1. From the **Status** dropdown, select **All**, **Activated** or **Deactivated**, then select **Apply**.

    The **Triggers** table displays the following information:

    - **Alerts**: The name of the alert trigger.
    - **# of users subscribed**: The number of users who have subscribed to a specific alert trigger.

        - Select a number in this column to view information about the user.

    - **Created By**: The email address of the user who created the alert trigger.
    - **Modified By**: The email address of the user who last modified the alert trigger.
    - **Last Updated**: The date and time the alert trigger was last updated.
    - **Subscription**: A switch that displays if the alert is **On** or **Off**.

         - If the column displays **Off**, the current user isn't subscribed to that alert. Switch the toggle to **On** to subscribe to the alert.
         - The user who creates an alert trigger is automatically subscribed to the alert, and receives emails about the alert.

1. To see only activated or only deactivated triggers, from the **Status** dropdown, select **Activated** or **Deactivated**, and then select **Apply**.

1. To view other options available to you, select the ellipses (**...**), and then select from the available options.

    If the **Subscription** is **On**, the following options are available:

    - **Edit**: Enables you to modify alert parameters

       > [!NOTE]
         > Only the user who created the alert can perform the following actions: edit the trigger screen, rename an alert, deactivate an alert, and delete an alert. Changes made by other users aren't saved.

    - **Duplicate**: Create a duplicate of the alert called "**Copy of XXX**".
    - **Rename**: Enter the new name of the query, and then select **Save.**
    - **Deactivate**: The alert is listed, but no longer sends emails to subscribed users.
    - **Activate**: Activate the alert trigger and start sending emails to subscribed users.
    - **Notification Settings**: View the **Email** of users who are subscribed to the alert trigger and their **User Status**.
    - **Delete**: Delete the alert.

    If the **Subscription** is **Off**, the following options are available:
    - **View**: View  details of the alert trigger.
    - **Notification Settings**: View the **Email** of users who are subscribed to the alert trigger and their **User Status**.
    - **Duplicate**: Create a duplicate copy of the selected alert trigger.




## Next steps

- For an overview on activity triggers, see [View information about activity triggers](ui-triggers.md).
- For information on rule-based anomalies and anomaly triggers, see [Create and view rule-based anomalies and anomaly triggers](product-rule-based-anomalies.md).
- For information on finding outliers in identity's behavior, see [Create and view statistical anomalies and anomaly triggers](product-statistical-anomalies.md).
- For information on permission analytics triggers, see [Create and view permission analytics triggers](product-permission-analytics.md).
