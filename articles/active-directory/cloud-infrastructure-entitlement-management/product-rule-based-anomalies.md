---
title: Create and view rule-based anomaly alerts and alert triggers in Permissions Management
description: How to create and view rule-based anomaly alerts and alert triggers in Permissions Management.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 02/23/2022
ms.author: jfields
---

# Create and view rule-based anomaly alerts and alert triggers

Rule-based anomalies identify recent activity in Permissions Management that is determined to be unusual based on explicit rules defined in the alert trigger. The goal of rule-based anomaly alerts is high-precision detection.

You can configure rule-based anomaly alert triggers for the following conditions:
- **Any Resource Accessed for the First Time**: The identity accesses a resource for the first time during the specified time interval.
- **Identity Performs a Particular Task for the First Time**: The identity does a specific task for the first time during the specified time interval.
- **Identity Performs a Task for the First Time**: The identity performs any task for the first time during the specified time interval.

Alert triggers are based on data collected. All alerts, if triggered, are shown every hour under the Alerts subtab.

## View rule-based anomaly alerts

1. In the Permissions Management home page, select **Alerts** (the bell icon).
1. Select **Rule-Based Anomaly**, and then select the **Alerts** subtab.

    The **Alerts** subtab displays the following information:

      - **Alert Name**: Lists the name of the alert.

      - To view the specific identity, resource, and task names that occurred during the alert collection period, select the **Alert Name**.

      - **Anomaly Alert Rule**: Displays the name of the rule select when creating the alert.
      - **# of Occurrences**: How many times the alert trigger has occurred.
      - **Task**: How many tasks performed are triggered by the alert.
      - **Resources**: How many resources accessed are triggered by the alert.
      - **Identity**: How many identities performing unusual behavior are triggered by the alert.
      - **Authorization System**: Displays which authorization systems the alert applies to, Amazon Web Services (**AWS**), Microsoft **Azure**, or Google Cloud Platform (**GCP**).
      - **Date/Time**: Lists the date and time of the alert.
      - **Date/Time (UTC)**: Lists the date and time of the alert in Coordinated Universal Time (UTC).


1. To filter alerts:

    - From the **Alert Name** dropdown, select **All** or the appropriate alert name.
    - From the **Date** dropdown menu, select **Last 24 Hours**, **Last 2 Days**, **Last Week**, or **Custom Range**, and select **Apply**.

     - If you select **Custom Range**, also enter **From** and **To** duration settings.
1. To view details that match the alert criteria, select the ellipses (**...**).

     - **View Trigger**: Displays the current trigger settings and applicable authorization system details
     - **Details**: Displays details about **Authorization System Type**, **Authorization Systems**, **Resources**, **Tasks**, **Identities**, and **Activity**
     - **Activity**: Displays details about the **Identity Name**, **Resource Name**, **Task Name**, **Date/Time**, **Inactive For**, and **IP Address**. Selecting the "eye" icon displays the **Raw Events Summary**

## Create a rule-based anomaly alert trigger

1. In the Permissions Management home page, select **Alerts** (the bell icon).
1. Select **Rule-Based Anomaly**, and then select the **Alerts** subtab.
1. Select **Create Alert Trigger**.

1. In the **Alert Name** box, enter a name for the alert.
1. Select the **Authorization System**, **AWS**, **Azure**, or **GCP**.
1. Select one of the following conditions:
      - **Any Resource Accessed for the First Time**: The identity accesses a resource for the first time during the specified time interval.
      - **Identity Performs a Particular Task for the First Time**: The identity does a specific task for the first time during the specified time interval.
      - **Identity Performs a Task for the First Time**: The identity performs any task for the first time during the specified time interval.
1. Select **Next**.
1. On the **Authorization Systems** tab, select the available authorization systems and folders, or select **All**.

    This screen defaults to **List** view, but you can change it to **Folders** view. You can select the applicable folder instead of individually selecting by authorization system.

      - The **Status** column displays if the authorization system is online or offline.
      - The **Controller** column displays if the controller is enabled or disabled.

1. On the **Configuration** tab, to update the **Time Interval**, select **90 Days**, **60 Days**, or **30 Days** from the **Time range** dropdown.
1. Select **Save**.

## View a rule-based anomaly alert trigger

1. In the Permissions Management home page, select **Alerts** (the bell icon).
1. Select **Rule-Based Anomaly**, and then select the **Alert Triggers** subtab.

    The **Alert Triggers** subtab displays the following information:

      - **Alerts**: Displays the name of the alert.
      - **Anomaly Alert Rule**: Displays the name of the selected rule when creating the alert.
      - **# of Users Subscribed**: Displays the number of users subscribed to the alert.
      - **Created By**: Displays the email address of the user who created the alert.
      - **Last Modified By**: Displays the email address of the user who last modified the alert.
      - **Last Modified On**: Displays the date and time the trigger was last modified.
      - **Subscription**: Subscribes you to receive alert emails. Switches between **On** and **Off**.

1. To view other options available to you, select the ellipses (**...**), and then select from the available options:

    If the **Subscription** is **On**, the following options are available:

    - **Edit**: Enables you to modify alert parameters.

       Only the user who created the alert can edit the trigger screen, rename an alert, deactivate an alert, and delete an alert. Changes made by other users aren't saved.

    - **Duplicate**: Create a duplicate copy of the selected alert trigger.
    - **Rename**: Enter the new name of the query, and then select **Save.**
    - **Deactivate**: The alert will still be listed, but will no longer send emails to subscribed users.
    - **Activate**: Activate the alert trigger and start sending emails to subscribed users.
    - **Notification Settings**: View the **Email** of users who are subscribed to the alert trigger.
    - **Delete**: Delete the alert.

    If the **Subscription** is **Off**, the following options are available:
    - **View**: View  details of the alert trigger.
    - **Notification Settings**: View the **Email** of users who are subscribed to the alert trigger.
    - **Duplicate**: Create a duplicate copy of the selected alert trigger.

1. To filter by **Activated** or **Deactivated**, in the **Status** section, select **All**, **Activated**, or **Deactivated**, and then select **Apply**.



## Next steps

- For an overview on alerts and alert triggers, see [View information about alerts and alert triggers](ui-triggers.md).
- For information on activity alerts and alert triggers, see [Create and view activity alerts and alert triggers](how-to-create-alert-trigger.md).
- For information on finding outliers in identity's behavior, see [Create and view statistical anomaly alerts and alert triggers](product-statistical-anomalies.md).
- For information on permission analytics alerts and alert triggers, see [Create and view permission analytics alerts and alert triggers](product-permission-analytics.md).
