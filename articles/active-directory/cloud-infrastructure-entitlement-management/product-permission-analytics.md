---
title: Create and view permission analytics triggers in Permissions Management
description: How to create and view permission analytics triggers in the Permission analytics tab in Permissions Management.
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

# Create and view permission analytics triggers

This article describes how you can create and view permission analytics triggers in Permissions Management.

## View permission analytics triggers

1. In the Permissions Management home page, select **Activity triggers** (the bell icon).
1. Select **Permission Analytics**, and then select the **Alerts** subtab.

    The **Alerts** subtab displays the following information:

      - **Alert Name**: Lists the name of the alert.
           - To view the name, ID, role, domain, authorization system, statistical condition, anomaly date, and observance period, select **Alert name**.
           - To expand the top information found with a graph of when the anomaly occurred, select **Details**.
      - **Anomaly Alert Rule**: Displays the name of the rule select when creating the alert.
      - **# of Occurrences**: Displays how many times the alert trigger has occurred.
      - **Task**: Displays how many tasks are affected by the alert
      - **Resources**: Displays how many resources are affected by the alert
      - **Identity**: Displays how many identities are affected by the alert
      - **Authorization System**: Displays which authorization systems the alert applies to
      - **Date/Time**: Displays the date and time of the alert.
      - **Date/Time (UTC)**: Lists the date and time of the alert in Coordinated Universal Time (UTC).

1. To filter the alerts, select the appropriate alert name or, from the **Alert Name** menu,select **All**.

      - From the **Date** dropdown menu, select **Last 24 Hours**, **Last 2 Days**, **Last Week**, or **Custom Range**, and then select **Apply**.

        If you select **Custom range**, select date and time settings, and then select **Apply**.      - **View Trigger**: Displays the current trigger settings and applicable authorization system details.

1. To view the following details, select the ellipses (**...**):

      - **Details**: Displays **Authorization System Type**, **Authorization Systems**, **Resources**, **Tasks**, and **Identities** that matched the alert criteria.
1. To view specific matches, select **Resources**, **Tasks**, or **Identities**.

   The **Activity** section displays details about the **Identity Name**, **Resource Name**, **Task Name**, **Date**, and **IP Address**.

## Create a permission analytics trigger

1. In the Permissions Management home page, select **Activity triggers** (the bell icon).
1. Select **Permission Analytics**, select the **Alerts** subtab, and then select **Create Permission Analytics Trigger**.
1. In the **Alert Name** box,  enter a name for the alert.
1. Select the **Authorization System**.
1. Select **Identity performed high number of tasks**, and then select **Next**.
1. On the **Authorization Systems** tab, select the appropriate accounts and folders, or select **All**.

    This screen defaults to the **List** view but can also be changed to the **Folder** view, and the applicable folder can be selected instead of individually by system.

    - The **Status** column displays if the authorization system is online or offline
    - The **Controller** column displays if the controller is enabled or disabled.
1. Select **Save**.

## View permission analytics alert triggers

1. In the Permissions Management home page, select **Activity triggers** (the bell icon).
1. Select **Permission Analytics**, and then select the **Alert Triggers** subtab.

    The **Alert triggers** subtab displays the following information:

      - **Alert**: Lists the name of the alert.
      - **Anomaly Alert Rule**: Displays the name of the rule select when creating the alert.
      - **# of users subscribed**: Displays the number of users subscribed to the alert.
      - **Created By**: Displays the email address of the user who created the alert.
      - **Last modified By**: Displays the email address of the user who last modified the alert.
      - **Last Modified On**: Displays the date and time the trigger was last modified.
      - **Subscription**: Toggle the button to **On** or **Off**.
      - **View Trigger**: Displays the current trigger settings and applicable authorization system details.

1. To view other options available to you, select the ellipses (**...**), and then make a selection from the available options:

      - **Details** displays **Authorization System Type**, **Authorization Systems**, **Resources**, **Tasks**, and **Identities** that matched the alert criteria.
      - To view the specific matches, select **Resources**, **Tasks**, or **Identities**.
      - The **Activity** section displays details about the **Identity Name**, **Resource Name**, **Task Name**, **Date**, and **IP Address**.

1. To filter by **Activated** or **Deactivated**, in the **Status** section, select **All**, **Activated**, or **Deactivated**, and then select **Apply**.


## Next steps

- For an overview on activity triggers, see [View information about activity triggers](ui-triggers.md).
- For information on activity alerts and alert triggers, see [Create and view activity alerts and alert triggers](how-to-create-alert-trigger.md).
- For information on rule-based anomalies and anomaly triggers, see [Create and view rule-based anomalies and anomaly triggers](product-rule-based-anomalies.md).
- For information on finding outliers in identity's behavior, see [Create and view statistical anomalies and anomaly triggers](product-statistical-anomalies.md).
