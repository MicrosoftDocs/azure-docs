---
title: Create and view rule-based anomalies and anomaly triggers in CloudKnox Permissions Management 
description: How to create and view rule-based anomalies and anomaly triggers in CloudKnox Permissions Management.
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

# Create and view rule-based anomaly alerts and anomaly triggers 

Rule-based anomalies identify recent activity in CloudKnox Permissions Management (CloudKnox) that is determined to be unusual based on explicit rules defined in the activity trigger. The goal of rule-based anomaly is high precision detection.

## View rule-based anomaly alerts

1. In the CloudKnox home page, select **Activity triggers** (the bell icon).
1. Select **Rule-based anomaly**, and then select the **Alerts** subtab.

    The **Alerts** subtab displays the following information:

      - **Alert name**: Lists the name of the alert.
    
         - To view the specific identity, resource, and task names that occurred during the alert collection period, select the **Alert Name**.

      - **Anomaly alert rule**: Displays the name of the rule select when creating the alert.
      - **# of occurrences**: How many times the alert trigger has occurred.
      - **Task**: How many tasks are affected by the alert.
      - **Resources**: How many resources are affected by the alert.
      - **Identity**: How many identities are affected by the alert.
      - **Authorization system**: Displays which authorization systems the alert applies to
      - **Date/Time**: Lists the date and time of the alert.
      - **Date/Time (UTC)**: Lists the date and time of the alert in Coordinated Universal Time (UTC).
      - **View trigger**: Displays the current trigger settings and applicable authorization system details
      - **Activity**: Displays details about the **Identity Name**, **Resource Name**, **Task Name**, **Date**, and **IP Address**.

1. To filter alerts:

    - From the **Alert Name** dropdown, select **All** or the appropriate alert name.  
    - From the **Date** dropdown menu, select **Last 24 Hours**, **Last 2 Days**, **Last Week**, or **Custom Range**, and select **Apply**.

1. To view details that match the alert criteria, select the ellipses (**...**). 

    For example, **Authorization System Type**, **Authorization Systems**, **Resources**, **Tasks**, and **Identities**.

## Create a rule-based anomaly trigger

1. In the CloudKnox home page, select **Activity triggers** (the bell icon).
1. Select **Rule-based anomaly**, and then select the **Alerts** subtab.
1. Select the **Create Anomaly Trigger** button.

1. In the **Alert Name** box, enter a name for the alert.
1. Select the **Authorization system**.
1. Select one of the following conditions:
      - **Any Resource Accessed for the First Time**: The identity accesses a resource for the first time during the specified time interval
      - **Identity Performs a Particular Task for the First Time**: The identity does a specific task for the first time during the specified time interval 
      - **Inactive Identity Becomes Active**: An identity that hasn't been active for 90 days becomes active and does any task in the selected time interval
1. Select **Next**.
1. On the **Authorization systems** tab, select the available authorization systems accounts and folders, or select **All**. 

    This screen defaults to **List** view, but you can change it to **Folder** view. You can select the applicable folder instead of individually by system. 

      - The **Status** column displays if the authorization system is online or offline. 
      - The **Controller** column displays if the controller is enabled or disabled.

1. On the **Configuration** tab, to update the **Time Interval**, select **90 Days**, **60 Days**, or **30 Days** from the **Time range** dropdown.
1. Select **Save**.

## View a rule-based anomaly trigger

1. In the CloudKnox home page, select **Activity triggers** (the bell icon).
1. Select **Rule-based anomaly**, and then select the **Alert triggers** subtab.
 
    The **Alert triggers** subtab displays the following information:

      - **Alert**: Displays the name of the alert.
      - **Anomaly Alert Rule**: Displays the name of the selected rule when creating the alert.
      - **# of users subscribed**: Displays the number of users subscribed to the alert.
      - **Created by**: Displays the email address of the user who created the alert.
      - **Last modified by**: Displays the email address of the user who last modified the alert.
      - **Last modified on**: Displays the date and time the trigger was last modified.
      - **Subscription**: Switches between **On** and **Off**.
      - **View Trigger**: Displays the current trigger settings and applicable authorization system details.

1. To view other options available to you, select the ellipses (**...**), and then select from the available options:

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

1. To filter by **Activated** or **Deactivated**, in the **Status** section, select **All**, **Activated**, or **Deactivated**, and then select **Apply**.



## Next steps

- For information on how to create and view an alert, see [Create an alert](cloudknox-howto-create-alert-trigger.md). 
- For information on alerts and alert triggers, see [View alerts and alert triggers](cloudknox-howto-view-alert-trigger.md). 
- For information on finding outliers in identity's behavior, see [Find outliers in an identity's behavior](cloudknox-product-statistical-anomalies.md)
- For information on permission analytics triggers, see [Create and view permission analytics triggers](cloudknox-product-permission-analytics.md)