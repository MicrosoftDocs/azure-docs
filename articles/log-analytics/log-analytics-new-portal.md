---
title: Portals for creating and editing log queries in Azure Log Analytics | Microsoft Docs
description: This article describes the portals that you can use in Azure Log Analytics to create and edit log searches.  
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
Log Analytics initially used the OMS portal to manage its configuration and analyze collected data.  All functionality from this portal has been moved to the Azure portal, and the OMS portal will be deprecated on <date>.

This article answers common questions for users making this transition.  If you used Log Analytics in the OMS portal, then this article will describe how you can perform the same tasks in the Azure portal.

## What's the difference between OMS and Log Analytics?
You may be wondering why the portal used the name OMS instead of Log Analytics. Operations Management Suite (OMS) is actually a bundling of multiple management services in Azure that includes Log Analytics. We recently introduced new pricing that doesn't include this bundling and are moving away from the term. You won't see the term OMS in the Azure portal but instead will interact directly with the services that were included in this suite.


## Where do I find Log Analytics in Azure?
There are two ways to access Log Analytics in the Azure portal. You can start with the Log Analytics service and select a workspace to work it, or you can start with Azure Monitor and work with your default workspace <how do we set this>.

You can add Log Analytics or Azure Monitor to the list of services pinned to the navigation pane by clicking the star icon next to it.

### Log Analytics
Log in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).  Click **All services**, and in the list of resources, type **Log Analytics**. Select **Log Analytics** and then select your workspace. The summary page for the workspace is displayed.

![Log Analytics]()

### Azure Monitor
Log in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).  Click **All services**, and in the list of resources, type **Monitor**. Select **Monitor** and then **Log Analytics** in the menu. The **Log Search** page for the default workspace is displayed.

![Azure Monitor]()

## Where is my overview page?
The main screen in the OMS portal displays the tiles for all the management solutions installed in your workspace. In the Azure portal, this is referred to as the **Overview** page. 

If you accessed Log Analytics from the Log Analytics service, either select **Overview** in the menu or click the **Overview** button on the main page.

![Overview]()

If you accessed Log Analytics from the Azure Monitor service, select **Management solutions** from the menu.

![Overview]()

## How do I create a new workspace? 
Open **Log Analytics** and click **Add** in the list of workspaces.  For complete details, see [Create a Log Analytics workspace in the Azure portal](../log-analytics/log-analytics-quick-create-workspace.md).


## Where do I find my settings?
The options that were available in the **Settings** section of the OMS portal are available in the **Advanced settings** menu for the workspace except for the following:

Solutions - List and remove management solutions from XXX.
Accounts - 
Workspace Information - **OMS Workspace** menu for the workspace.
Manage users - See [Manage workspaces](../log-analytics/log-analytics-manage-access.md)
Azure Subscription & Data Plan - **Pricing tier** menu for the workspace.
Automation Account - **Automation Account** menu for the workspace.
Alerts - Alert rules based on Log Analytics queries are now managed in the [unified alerting experience](../monitoring-and-diagnostics/monitor-alerts-unified-usage.md).
Preview Features - No longer required.
Upgrade Summary - No longer required.


![Advanced settings]()

## How do I install and remove management solutions?
In the OMS portal, you install management solutions from the Solutions Gallery and removed them from **Settings**.

In the Azure portal, [install management solutions](../monitoring/monitoring-solutions.md#install-a-management-solution) from the Azure Marketplace.  Remove solutions (../monitoring/monitoring-solutions.md#remove-a-management-solution)


## How do I access my dashboards?
[Dashboards](../log-analytics/log-analytics-dashboards.md) in Log Analytics have been deprecated.  You can visualize data in Log Analytics using [View Designer](../log-analytics/log-analytics-view-designer.md) which has additional functionality.

## How do I check my usage?
You can now easily view and manage your usage and cost of Log Analytics by selecting **Usage and estimated costs** in the Log Analytics menu.

![Usage and estimated costs]()

## How do I manage permissions?
To manage who can access the workspace, and what they can do, select Access control (IAM) from the left-hand menu. A list of users and apps, which have access to this workspace, will show up:

To learn about role-based access control in Azure, see [Get started with Role-Based Access Control in the Azure portal](../role-based-access-control/overview.md).

### No access?
If you see the below message when trying to access your workspace in Azure, your account is missing the required privileges.

To view your workspace, you need at least a “Reader” role, granted specifically for this specific workspace or the subscription it belongs to. Contact an admin of subscription/workspace to be assigned with the proper role.
To learn about role-based access control in Azure, see this article.


## How to access the legacy portal?
Still want to use the legacy portal? for a limited time, you can still access the portal through this url, with your own workspace name:
https://<your workspace name>.portal.mms.microsoft.com
