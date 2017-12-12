---
title: Azure Quick Start - Enable Change tracking with Azure Automation | Microsoft Docs 
description: Enable Change tracking for your Azure and non-Azure machines.
services: automation
keywords: change, tracking, automation
author: jennyhunter-msft
ms.author: jehunte
ms.date: 10/26/2017
ms.topic: hero-article
ms.custom: mvc
manager: carmonm
---

# Enable Change tracking for your Azure and non-Azure machines

In this quickstart, you learn how to enable, configure, and view logs for Change tracking in Azure Automation. By enabling Change tracking, you can track changes to software, files, Linux daemons, Windows Services, and Windows Registry keys on your computers. Identifying these configuration changes can help you pinpoint operational issues across your environment.

## Prerequisites

To complete this quickstart:

* [Create an Automation account](automation-offering-get-started.md) before you begin.

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/).

## Log in to Azure

Log in to the Azure portal at http://portal.azure.com.

## Enable Change tracking through an Automation account

There are a variety of different methods to onboard a machine and enable Change tracking. This article covers onboarding through an Automation account. You can learn more about different methods to onboard your machines to Change tracking by reading the [Onboarding](../log-analytics/log-analytics-change-tracking.md?toc=%2fazure%2fautomation%2ftoc.json) article.

1. In the left pane of the Azure portal, select **Automation accounts**. If it is not visible in the left pane, click **All services** and search for it in the resulting view.
1. In the list, select an Automation account.
1. Under **CONFIGURATION MANAGEMENT**, select **Change tracking**.
1. Select a [Log Analytics](../log-analytics/log-analytics-overview.md?toc=%2fazure%2fautomation%2ftoc.json) workspace to store data logs from Change Tracking, and then select **Enable**. You get a notification indicating that the solution is being enabled. This process can take up to 15 minutes.

## Add a virtual machine

Select **Add Azure VM** on the Change tracking window. Choose a VM from the list of virtual machines in your subscription. Under **Change Tracking and Inventory**, select **Enable**.

> [!NOTE]
> If you already completed the [Inventory tracking quickstart](automation-quickstart-inventory.md) with your VM, the solution is already enabled for that VM.

## View changes

In the **Change tracking** page, you can view the changes in each of the various categories for your machines over time.

   ![Change tracking - add view changes window](./media/automation-vm-change-tracking/change-view-changes.png)

You can select the change types and time range of changes to view. At the top of the window, you see a chart showing a graphical representation of changes over time. At the bottom, you see a table that lists recent changes.

## Configure Change tracking

By default, software, Windows services, and Linux daemons are configured for collection. To collect Windows Registry and file inventory, configure the collection settings.

> [!NOTE]
> Inventory and Change tracking use the same collection settings, and settings are configured on a workspace level.

1. In the **Change tracking** view, select the **Edit Settings**.
1. To add a new collection setting, go to the setting category that you want to add by selecting the **Windows Registry**, **Windows Files**, or **Linux Files** tabs.
1. Select **Add** at the top of the window and fill out the form. When you are complete, select **Save** to save your changes.

To view the details and descriptions of each setting property, visit the [Change tracking documentation page](../log-analytics/log-analytics-change-tracking.md?toc=%2fazure%2fautomation%2ftoc.json), or select **Documentation** on the Workspace COnfiguration page to go directly to the documentation from the Azure portal.

## Connect Azure Activity Log event data

To view Azure Activity log events for your environment along with your Change tracking changes, select the **Manage Activity Log Connection** at the top of the Change Tracking page. In the new pane, select **Connect**.

Once enabled, events from Azure resources get reported in Change tracking. These events are viewed under **Events** in the table on the Change tracking window.

## View Change tracking log data

Change tracking generates log data that is sent to Log Analytics. To search the logs by running queries, select **Log Analytics** at the top of the **Change tracking** window. Change tracking data is stored under the type **ConfigurationChange**.

To learn more about running and searching log files in Log Analytics, see [Log Analytics](../log-analytics/log-analytics-overview.md?toc=%2fazure%2fautomation%2ftoc.json).

## Next steps

In this quick start, you've enabled and configured tracking and viewed the results. To learn more about Azure Automation, continue to the tutorial for enabling change tracking of virtual machines.

> [!div class="nextstepaction"]
> [Enable change tracking of virtual machines with Azure Automation](automation-vm-change-tracking.md)

* For more information about Change tracking and how to configure your collection settings, see [Track changes in your environment with the Change Tracking solution](../log-analytics/log-analytics-change-tracking.md?toc=%2fazure%2fautomation%2ftoc.json).

* To learn about managing Windows and package updates on your virtual machines, see [The Update Management solution in OMS](../operations-management-suite/oms-solution-update-management.md?toc=%2fazure%2fautomation%2ftoc.json).
