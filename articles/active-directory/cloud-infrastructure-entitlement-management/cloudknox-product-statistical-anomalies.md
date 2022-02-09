---
title: Create and view statistical anomalies and anomaly triggers in CloudKnox Permissions Management
description: How to create and view statistical anomalies and anomaly triggers in the Statistical Anomaly tab in CloudKnox Permissions Management.
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

# Create and view statistical anomalies and anomaly triggers

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

Statistical anomalies can detect outliers in an identity's behavior if recent activity is determined to be unusual based on models defined in an activity trigger. The goal of this anomaly trigger is a high recall rate.

## View statistical anomalies in an identity's behavior

1. In the CloudKnox home page, select **Activity triggers** (the bell icon).
1. Select **Statistical anomaly**, and then select the **Alerts** subtab.

    The **Alerts** subtab displays the following information:

      - **Alert Name**: Lists the name of the alert 
      - **Anomaly Alert Rule**: Displays the name of the rule select when creating the alert. 
      - **# of Occurrences**: Displays how many times the alert trigger has occurred.
      - **Task**: Displays how many tasks are affected by the alert.
      - **Resources**: Displays how many resources are affected by the alert.
      - **Identity**: Displays how many identities are affected by the alert.
      - **Authorization System**: Displays which authorization systems the alert applies to.
      - **Date/Time**: Lists the date and time of the alert.
      - **Date/Time (UTC)**: Lists the date and time of the alert in Coordinated Universal Time (UTC).
      -  **Activity** section displays details about the **Identity Name**, **Resource Name**, **Task Name**, **Date**, and **IP Address**.
      - **View Trigger**: Displays the current trigger settings and applicable authorization system details

1. To filter the alerts, select the appropriate alert name or choose **All** from the **Alert Name** dropdown menu. 
1. From the **Date** dropdown menu, select **Last 24 Hours**, **Last 2 Days**, **Last Week**, or **Custom Range**, and select **Apply**.

    - If you select **Custom Range**, also enter **From** and **To** duration settings.
1. To view the following details, select the ellipses (**...**):

      - **Details**: Displays **Authorization System Type**, **Authorization Systems**, **Resources**, **Tasks**, and **Identities** that matched the alert criteria.

1. To view the specific matches, select **Resources**, **Tasks**, or **Identities**.
1. To view the name, ID, role, domain, authorization system, statistical condition, anomaly date, and observance period, select the **Alert Name**. 
1. To expand the top information found with a graph of when the anomaly occurred, select **Details**.

## Create a statistical anomaly trigger

1. In the CloudKnox home page, select **Activity triggers** (the bell icon).
1. Select **Statistical anomaly**, select the **Alerts** subtab, and then select **Create alert trigger**.
1. Enter a name for the alert in the **Alert Name** box.
1. Select the **Authorization system**, Amazon Web Services (**AWS**), Microsoft **Azure**, or Google Cloud Platform (**GCP**).
1. Select one of the following conditions:

      - **Identity Performed High Number of Tasks**: The identity performs at a higher volume than usual. The typical performance is 25 tasks per day and they're now performing 100 tasks per day.
      - **Identity Performed Low Number of Tasks**: The identity performs lower than their daily average. The typical performance is 100 tasks per day and they're now performing 25 tasks per day.
      - **Identity Performed Tasks with Multiple Unusual Patterns**: The identity does many unusual tasks and at different times. This means that identities can execute actions outside their normally logged hours or performance hours, and at a higher than usual volume of tasks than normal.
      - **Identity Performed Tasks with Unusual Results**: The identity performing an action gets a different result than usual, such as most tasks end in a successful result and are now ending in a failed result or vice versa.
      - **Identity Performed Tasks with Unusual Timing**: The identity does tasks outside of their normal logged in time or performance hours determined by the UTC actions hours grouped as follows:
           - 12AM-4AM UTC
           - 4AM-8AM UTC
           - 8AM-12PM UTC
           - 12PM-4PM UTC
           - 4PM-8PM UTC
           - 8PM-12AM UTC
      - **Identity Performed Tasks with Unusual Types**: The identity does unusual types of tasks from their normal tasking, for example, read, write, or delete tasks they wouldn't ordinarily perform.
1. Select **Next**.

1. On the **Authorization systems** tab, select the appropriate systems, or, to select all systems, select **All**. 

    The screen defaults to the **List** view but you can switch to **Folder** view using the menu, and then select the applicable folder instead of individually by system. 

     - The **Status** column displays if the authorization system is online or offline. 

     - The **Controller** column displays if the controller is enabled or disabled.


1. On the **Configuration** tab, to update the **Time Interval**, from the **Time range** dropdown, select **90 Days**, **60 Days**, or **30 Days**, and then select **Save**.

## View statistical anomaly triggers

1. In the CloudKnox home page, select **Activity triggers** (the bell icon).
1. Select **Statistical anomaly**, and then select the **Alert triggers** subtab.

    The **Alert triggers** subtab displays the following information:

      - **Alert**: Displays the name of the alert.
      - **Anomaly alert rule**: Displays the name of the rule select when creating the alert. 
      - **# of users subscribed**: Displays the number of users subscribed to the alert.
      - **Created by**: Displays the email address of the user who created the alert.
      - **Last modified by**: Displays the email address of the user who last modified the alert.
      - **Last modified on**: Displays the date and time the trigger was last modified.
      - **Subscription**: Toggle the button to **On** or **Off**.

1. To filter by **Activated** or **Deactivated**, in the **Status** section, select **All**, **Activated**, or **Deactivated**, and then select **Apply**.

1. To view other options available to you, select the ellipses (**...**), and then make a selection from the available options:

      - **Details**: Displays **Authorization System Type**, **Authorization Systems**, **Resources**, **Tasks**, and **Identities** that matched the alert criteria.
      - To view the specific matches, select **Resources**, **Tasks**, or **Identities**.
      - The **Activity** section displays details about the **Identity Name**, **Resource Name**, **Task Name**, **Date**, and **IP Address**.
      - **View Trigger**: Displays the current trigger settings and applicable authorization system details.

1. Select **Apply**.



## Next steps

- For an overview on activity triggers, see [View information about activity triggers](cloudknox-ui-triggers.md).
- For information on activity alerts and alert triggers, see [Create and view activity alerts and alert triggers](cloudknox-howto-create-alert-trigger.md). 
- For information on rule-based anomalies and anomaly triggers, see [Create and view rule-based anomalies and anomaly triggers](cloudknox-product-rule-based-anomalies.md).
- For information on permission analytics triggers, see [Create and view permission analytics triggers](cloudknox-product-permission-analytics.md).