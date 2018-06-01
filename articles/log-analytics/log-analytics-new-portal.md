---
title: Transition from OMS portal to Azure portal for Log Analytics users | Microsoft Docs
description: Answers to common questions for Log Analytics users transitioning from the OMS portal to the Azure portal.
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: ''

ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/22/2018
ms.author: bwren

---
# Transition from OMS portal to Azure portal for Log Analytics users
Log Analytics initially used its own portal called the OMS portal to manage its configuration and analyze collected data.  All functionality from this portal has been moved to the Azure portal, and the OMS portal will be deprecated on DATE. This article answers common questions for users making this transition.  If you used Log Analytics in the OMS portal, then you can find answers here for how you can perform the same tasks in the Azure portal.

## What's the difference between OMS and Log Analytics?
You may be wondering why the portal used the name OMS instead of Log Analytics. Operations Management Suite (OMS) is actually a bundling of multiple management services in Azure that includes Log Analytics. We recently introduced new pricing that doesn't include this bundling and are moving away from the term. You won't see the term OMS in the Azure portal but instead interact directly with the services that were included in this suite.


## Where do I find Log Analytics in Azure?
Log in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).  Click **All services**, and in the list of resources, type **Log Analytics**. Select **Log Analytics** and then select your workspace. The summary page for the workspace is displayed.

![Log Analytics workspace](media/log-analytics-new-portal/log-analytics.png)

## Where is my overview page?
The main screen in the OMS portal displays the tiles for all the management solutions installed in your workspace. In the Azure portal, this is referred to as the **Overview** page. From your workspace in the Azure portal, either select **Overview** in the menu or click the **Overview** button on the main page.

![Overview page](media/log-analytics-new-portal/overview.png)


## How do I create a new workspace? 
From the list of workspaces in the Azure portal, click **Add** in the list of workspaces.  For complete details, see [Create a Log Analytics workspace in the Azure portal](../log-analytics/log-analytics-quick-create-workspace.md).


![Overview page](media/log-analytics-new-portal/new-workspace.png)

## Where do I find my settings?
Many of the settings in the **Settings** section of the OMS portal are available in the **Advanced settings** menu in the Azure portal for the workspace.

![Advanced settings](media/log-analytics-new-portal/advanced-settings.png)

The following table is a complete list of how you can access settings that were previously available in the **Settings** section of the OMS portal.


| Setting in the OMS portal | Equivalent in the Azure portal |
|:---|:---|
| Solutions         |  [List and remove management solutions](#How do I install and-remove-management-solutions) from list of solutions in the Azure portal. |
| Connected Sources | **Advanced settings** menu for the workspace. |
| Data              | **Advanced settings** menu for the workspace. |
| Computer Groups   | **Advanced settings** menu for the workspace. |
| Accounts | |
| Automation Account | **Automation Account** menu for the workspace. |
| Azure Subscription & Data Plan | **Pricing tier** menu for the workspace. |
| Manage users | Use Azure role-based access to [manage permissions for your workspace](#how-do-i-manage-permissions). |
| Workspace Information | Information available on **OMS Workspace** menu for the workspace. |
| Alerts | Alert rules based on Log Analytics queries are now managed in the [unified alerting experience](../monitoring-and-diagnostics/monitor-alerts-unified-usage.md). |
| Preview Features | No longer required. |
| Upgrade Summary | No longer required. |


## How do I install and remove management solutions?
In the OMS portal, you install management solutions from the Solutions Gallery and removed them from **Settings**. In the Azure portal, [install management solutions](../monitoring/monitoring-solutions.md#install-a-management-solution) from the Azure Marketplace. [Remove solutions](../monitoring/monitoring-solutions.md#remove-a-management-solution) from the list of installed solutions.


## How do I access my dashboards?
[Dashboards](../log-analytics/log-analytics-dashboards.md) in Log Analytics have been deprecated.  You can visualize data in Log Analytics using [View Designer](../log-analytics/log-analytics-view-designer.md) which has additional functionality.

## How do I manage permissions?
You can now permissions to your Log Analytics workspace using [Azure role-based access](https://docs.microsoft.com/en-us/azure/active-directory/role-based-access-control-configure). For details, see [Manage workspaces](../log-analytics/log-analytics-manage-access.md).

## How do I check my usage?
You can now easily view and manage your usage and cost of Log Analytics by selecting **Usage and estimated costs** in your workspace.

![Usage and estimated costs](media/log-analytics-new-portal/usage.png)


## Can I still use the classic portal?
For a limited time, you can still access the portal through this url, with your own workspace name:
https://\<your workspace name\>.portal.mms.microsoft.com
