---
title: View information about activity alerts and triggers in Microsoft CloudKnox Permissions Management
description: How to view information about activity alerts and triggers in the Activity Triggers dashboard in Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: overview
ms.date: 02/02/2022
ms.author: v-ydequadros
---

# View information about activity alerts and triggers

This topic describes how to use the **Activity Triggers** dashboard in Microsoft CloudKnox Permissions Management (CloudKnox) to view information about activity alerts and triggers.

**To display the Activity Triggers dashboard:**

- In the upper right of the CloudKnox dashboard, select **Activity Triggers** (the bell icon).

    The **Activity Triggers** dashboard has four tabs:

    - **Activity**
    - **Rule-Based Anomaly**
    - **Statistical Anomaly**
    - **Permission Analytics**

    Each tab has two subtabs:

    - **Alerts**
    - **Alert Triggers**

## The Alerts subtab

The **Alerts** subtab in the **Activity**, **Rule-Based Anomaly**, **Statistical Anomaly**, and **Permission Analytics** tabs displays the following information:

- **Alert Name** - You can display **All** triggers or specific triggers.
- **Date** - You can select **Last 24 hours**, **Last 2 Days**, **Last Week**, or **Custom Range.**
    - To specify a **Custom Range**, enter a **From** and **To** duration.
    - Select **Apply** to activate your settings or **Reset Filter** to discard your settings.
- **Reload** - Select **Reload** to refresh the displayed information.  
- **Create Alert Trigger** - Select this option to create a new alert trigger. 
    <!---Add link - For more information, see Create a new alert trigger.--->

The **Rule-Based Anomaly** tab and the **Statistical Anomaly** tab both have one more option:

- **||| Columns** - Select the columns you want to display: **Task**, **Resource**, and **Identity**.
    - To return to the system default settings, select **Reset to default**.

## The Alert Triggers subtab

The **Alert Triggers** subtab in the **Activity**, **Rule-Based Anomaly**, **Statistical Anomaly**, and **Permission Analytics** tabs displays the following information:

- **Status** - Select the alert status you want to display: **All**, **Activated**, or **Deactivated**.
- **Apply** - Select this option to activate your settings. 
- **Reset Filter** - Select this option to discard your settings.
- **Reload** - Select **Reload** to refresh the displayed information.  
- **Create Alert Trigger** - Select this option to create a new alert trigger. 
    <!---Add link - For more information, see Create a new alert trigger.--->
- A list of alert triggers that displays:
    - **Alerts** - The name of the alert.
    - **# of users subscribed** - The number of users who have subscribed to the alert.
    - **Created By** - The name of the person who created the alert.
    - **Modified By** - The name of the person who modified the alert.


The **Rule-Based Anomaly** tab and the **Statistical Anomaly** tab both have one more option:

- **||| Columns** - Select the columns you want to display: **Task**, **Resource**, and **Identity**.
    - To return to the system default settings, select **Reset to default**.




## Next steps

- For information on how to create alerts and triggers, see [Create an alert trigger](cloudknox-howto-create-alert-trigger.md).
- For information on now to Create and save product alerts, see [Create and save product alerts](cloudknox-product-alerts.md). 
