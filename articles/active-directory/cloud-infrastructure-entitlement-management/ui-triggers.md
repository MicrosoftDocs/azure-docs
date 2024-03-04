---
title: View information about alerts and alert triggers in Permissions Management
description: How to view information about alerts and alert triggers in the Alerts dashboard in Permissions Management.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: overview
ms.date: 07/25/2023
ms.author: jfields
---

# View information about alerts and alert triggers

This article describes how to use the **Alerts** dashboard in Permissions Management to view information about alerts and alert triggers.

## Display the Alerts dashboard

- In the Permissions Management home page, select **Alerts** (the bell icon).

    The **Alerts** dashboard has four tabs:

    - **Activity**
    - **Rule-Based Anomaly**
    - **Statistical Anomaly**
    - **Permission Analytics**

    Each tab has two subtabs:

    - **Alerts**
    - **Alert Triggers**
      
- Select the **Authorization system**(s) and/or **folder**(s) to display alerts and alert triggers in scope of the selected view. 
- Alert triggers are based on data collected. All alerts, if triggered, are shown every hour under the Alerts subtab.

## View information about alerts

The **Alerts** subtab in the **Activity**, **Rule-Based Anomaly**, **Statistical Anomaly**, and **Permission Analytics** tabs display the following information:

- **Alert Name**: Select **All** alert names or specific ones.
- **Date**: Select **Last 24 hours**, **Last 2 Days**, **Last Week**, or **Custom Range.**

    - If you select **Custom Range**, also enter **From** and **To** duration settings.
- **Apply**: Select this option to activate your settings.
- **Reset Filter**: Select this option to discard your settings.
- **Reload**: Select this option to refresh the displayed information.
- **Create Activity Trigger**: Select this option to [create a new alert trigger](how-to-create-alert-trigger.md).
- The **Alerts** table displays a list of alerts with the following information:
    - **Alerts**: The name of the alert.
    - **# of users subscribed**: The number of users who have subscribed to the alert.
    - **Created By**: The name of the user who created the alert.
    - **Modified By**: The name of the user who modified the alert.

The **Rule-Based Anomaly** tab and the **Statistical Anomaly** tab both have one more option:

- **Columns**: Select the columns you want to display: **Task**, **Resource**, and **Identity**.
    - To return to the system default settings, select **Reset to default**.



## View information about alert triggers

The **Alert Triggers** subtab in the **Activity**, **Rule-Based Anomaly**, **Statistical Anomaly**, and **Permission Analytics** tab displays the following information:

- **Status**: Select the alert status you want to display: **All**, **Activated**, or **Deactivated**.
- **Apply**: Select this option to activate your settings.
- **Reset Filter**: Select this option to discard your settings.
- **Reload**: Select **Reload** to refresh the displayed information.
- **Create Activity Trigger**: Select this option to [create a new alert trigger](how-to-create-alert-trigger.md).
- The **Triggers** table displays a list of triggers with the following information:
    - **Alerts**: The name of the alert.
    - **# of users subscribed**: The number of users who have subscribed to the alert.
    - **Created By**: The name of the user who created the alert.
    - **Modified By**: The name of the user who modified the alert.






## Next steps

- For information on activity alerts and alert triggers, see [Create and view activity alerts and alert triggers](how-to-create-alert-trigger.md).
- For information on rule-based anomalies and anomaly triggers, see [Create and view rule-based anomalies and anomaly triggers](product-rule-based-anomalies.md).
- For information on finding outliers in identity's behavior, see [Create and view statistical anomalies and anomaly triggers](product-statistical-anomalies.md).
- For information on permission analytics triggers, see [Create and view permission analytics triggers](product-permission-analytics.md).
