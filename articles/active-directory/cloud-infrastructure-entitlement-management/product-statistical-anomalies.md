---
title: Create and view statistical anomaly alerts and alert triggers in Permissions Management
description: How to create and view statistical anomaly alerts and alert triggers in the Statistical Anomaly tab in Permissions Management.
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

# Create and view statistical anomaly alerts and alert triggers

Statistical anomalies can detect outliers in an identity's behavior if the recent activity is determined to be unusual based on models defined in an activity trigger. The goal of this alert trigger is a high recall rate.

You can configure statistical anomaly alert triggers for the following scenarios:
- **Identity Performed High Number of Tasks**: The identity performs higher than their usual volume of tasks. For example, an identity typically performs 25 tasks per day, and now it is performing 100 tasks per day.
- **Identity Performed Low Number of Tasks**: The identity performs lower than their usual volume of tasks. For example, an identity typically performs 100 tasks per day, and now it is performing 25 tasks per day.
- **Identity Performed Tasks with Unusual Results**: The identity performing an action gets a different result than usual, such as most tasks end in a successful result and are now ending in a failed result or vice versa.
- **Identity Performed Tasks with Unusual Timing**: The identity does tasks at unusual times as established by their baseline in the observance period. Times are grouped by the following UTC 4-hour windows.
- **Identity Performed Tasks with Unusual Types**: The identity performs unusual types of tasks as established by their baseline in the observance period. For example, an identity performs read, write, or delete tasks they wouldn't ordinarily perform.
- **Identity Performed Tasks with Multiple Unusual Patterns**: The identity has several unusual patterns in the tasks performed by the identity as established by their baseline in the observance period.

Alert triggers are based on data collected. All alerts, if triggered, are shown every hour under the Alerts subtab.

## View statistical anomalies in an identity's behavior

1. In the Permissions Management home page, select **Alerts** (the bell icon).
1. Select **Statistical Anomaly**, and then select the **Alerts** subtab.

    The **Alerts** subtab displays the following information:

      - **Alert Name**: Lists the name of the alert.
      - **Anomaly Alert Rule**: Displays the name of the rule select when creating the alert.
      - **# of Occurrences**: Displays how many times the alert trigger has occurred.
      - **Authorization System**: Displays which authorization systems the alert applies to.
      - **Date/Time**: Lists the day of the outlier occurring.
      - **Date/Time (UTC)**: Lists the day of the outlier occurring in Coordinated Universal Time (UTC).


1. To filter the alerts based on name, select the appropriate alert name or choose **All** from the **Alert Name** dropdown menu, and select **Apply**.
1. To filter the alerts based on alert time, select **Last 24 Hours**, **Last 2 Days**, **Last Week**, or **Custom Range** from the **Date** dropdown menu, and select **Apply**.
1.  If you select the ellipses (**...**) and select:
      - **Details**, this brings you to an Alert Summary view with **Authorization System**, **Statistical Model** and **Observance Period** displayed along with a table with a row per identity triggering this alert. From here you can click:
       - **Details**: Displays graph(s) highlighting the anomaly with context, and up to the top 3 actions performed on the day of the anomaly
       - **View Trigger**: Displays the current trigger settings and applicable authorization system details
      - **View Trigger**: Displays the current trigger settings and applicable authorization system details

## Create a statistical anomaly alert trigger

1. In the Permissions Management home page, select **Alerts** (the bell icon).
1. Select **Statistical Anomaly**, select the **Alerts** subtab, and then select **Create Alert Trigger**.
1. Enter a name for the alert in the **Alert Name** box.
1. Select the **Authorization System**, Amazon Web Services (**AWS**), Microsoft **Azure**, or Google Cloud Platform (**GCP**).
1. Select one of the following conditions:

      - **Identity Performed High Number of Tasks**: The identity performs higher than their usual volume of tasks. For example, an identity typically performs 25 tasks per day, and now it is performing 100 tasks per day.
      - **Identity Performed Low Number of Tasks**: The identity performs lower than their usual volume of tasks. For example, an identity typically performs 100 tasks per day, and now it is performing 25 tasks per day.
      - **Identity Performed Tasks with Unusual Results**: The identity performing an action gets a different result than usual, such as most tasks end in a successful result and are now ending in a failed result or vice versa.
      - **Identity Performed Tasks with Unusual Timing**: The identity does tasks at unusual times as established by their baseline in the observance period. Times are grouped by the following UTC 4 hour windows.
           - 12AM-4AM UTC
           - 4AM-8AM UTC
           - 8AM-12PM UTC
           - 12PM-4PM UTC
           - 4PM-8PM UTC
           - 8PM-12AM UTC
      - **Identity Performed Tasks with Unusual Types**: The identity performs unusual types of tasks as established by their baseline in the observance period. For example, an identity performs read, write, or delete tasks they wouldn't ordinarily perform.
      - **Identity Performed Tasks with Multiple Unusual Patterns**: The identity has several unusual patterns in the tasks performed by the identity as established by their baseline in the observance period.
1. Select **Next**.

1. On the **Authorization Systems** tab, select the appropriate systems, or, to select all systems, select **All**.

    The screen defaults to the **List** view but you can switch to **Folder** view using the menu, and then select the applicable folder instead of individually by system.

     - The **Status** column displays if the authorization system is online or offline.

     - The **Controller** column displays if the controller is enabled or disabled.


1. Select **Save**.

## View statistical anomaly alert triggers

1. In the Permissions Management home page, select **Alerts** (the bell icon).
1. Select **Statistical Anomaly**, and then select the **Alert Triggers** subtab.

    The **Alert Triggers** subtab displays the following information:

      - **Alert**: Displays the name of the alert.
      - **Anomaly Alert Rule**: Displays the name of the rule select when creating the alert.
      - **# of users subscribed**: Displays the number of users subscribed to the alert.
      - **Created By**: Displays the email address of the user who created the alert.
      - **Last Modified By**: Displays the email address of the user who last modified the alert.
      - **Last Modified On**: Displays the date and time the trigger was last modified.
      - **Subscription**: Subscribes you to receive alert emails. Toggle the button to **On** or **Off**.

1. To filter by **Activated** or **Deactivated**, in the **Status** section, select **All**, **Activated**, or **Deactivated**, and then select **Apply**.

1. To view other options available to you, select the ellipses (**...**), and then select from the available options:

     If the **Subscription** is **On**, the following options are available:
     - **Edit**: Enables you to modify alert parameters

        > [!NOTE]
          > Only the user who created the alert can perform the following actions: edit the trigger screen, rename an alert, deactivate an alert, and delete an alert. Changes made by other users aren't saved.
     - **Duplicate**: Create a duplicate copy of the selected alert trigger.
     - **Rename**: Enter the new name of the query, and then select **Save.**
     - **Deactivate**: The alert will still be listed, but will no longer send emails to subscribed users.
     - **Activate**: Activate the alert trigger and start sending emails to subscribed users.
     - **Notification Settings**: View the **Email** of users who are subscribed to the alert trigger.
     - **Delete**: Delete the alert.

     If the **Subscription** is **Off**, the following options are available:
     - **View**: View  details of the alert trigger.
     - **Notification settings**: View the **Email** of users who are subscribed to the alert trigger.
     - **Duplicate**: Create a duplicate copy of the selected alert trigger.


1. Select **Apply**.



## Next steps

- For an overview on alerts and alert triggers, see [View information about alerts and alert triggers](ui-triggers.md).
- For information on activity alerts and alert triggers, see [Create and view activity alerts and alert triggers](how-to-create-alert-trigger.md).
- For information on rule-based anomaly alerts and alert triggers, see [Create and view rule-based anomaly alerts and alert triggers](product-rule-based-anomalies.md).
- For information on permission analytics alerts and alert triggers, see [Create and view permission analytics alerts and alert triggers](product-permission-analytics.md).
