---
title: View information about activity triggers in CloudKnox Permissions Management
description: How to view information about activity triggers in the Activity triggers dashboard in CloudKnox Permissions Management.
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

# View information about activity triggers

This article describes how to use the **Activity triggers** dashboard in CloudKnox Permissions Management (CloudKnox) to view information about activity alerts and triggers.

## Display the Activity triggers dashboard

- In the CloudKnox home page, select **Activity triggers** (the bell icon).

    The **Activity triggers** dashboard has four tabs:

    - **Activity**
    - **Rule-based anomaly**
    - **Statistical anomaly**
    - **Permission analytics**

    Each tab has two subtabs:

    - **Alerts**
    - **Alert triggers**

## The Alerts subtab

The **Alerts** subtab in the **Activity**, **Rule-based anomaly**, **Statistical anomaly**, and **Permission analytics** tab displays the following information:

- **Alert Name**: You can display **All** triggers or specific triggers.
- **Date**: You can select **Last 24 hours**, **Last 2 Days**, **Last week**, or **Custom range.**
    - To specify a **Custom range**, enter a **From** and **To** duration.
    - Select **Apply** to activate your settings or **Reset filter** to discard your settings.
- **Reload**: Select **Reload** to refresh the displayed information.  
- **Create Alert Trigger**: Select this option to create a new alert trigger. 
    <!---Add link - For more information, see Create a new alert trigger.--->

The **Rule-based anomaly** tab and the **Statistical anomaly** tab both have one more option:

- **||| Columns**: Select the columns you want to display: **Task**, **Resource**, and **Identity**.
    - To return to the system default settings, select **Reset to default**.

## The Alert triggers subtab

The **Alert triggers** subtab in the **Activity**, **Rule-based anomaly**, **Statistical anomaly**, and **Permission analytics** tab displays the following information:

- **Status**: Select the alert status you want to display: **All**, **Activated**, or **Deactivated**.
- **Apply**: Select this option to activate your settings. 
- **Reset filter**: Select this option to discard your settings.
- **Reload**: Select **Reload** to refresh the displayed information.  
- **Create alert trigger**: Select this option to create a new alert trigger. 
    <!---Add link - For more information, see Create a new alert trigger.--->
- A list of alert triggers that displays:
    - **Alerts**: The name of the alert.
    - **# of users subscribed**: The number of users who have subscribed to the alert.
    - **Created by**: The name of the person who created the alert.
    - **Modified By**: The name of the person who modified the alert.


The **Rule-based anomaly** tab and the **Statistical anomaly** tab both have one more option:

- **||| Columns**: Select the columns you want to display: **Task**, **Resource**, and **Identity**.
    - To return to the system default settings, select **Reset to default**.




## Next steps

- For information on how to create and view an alert, see [Create and view an alert](cloudknox-howto-create-alert-trigger.md).

