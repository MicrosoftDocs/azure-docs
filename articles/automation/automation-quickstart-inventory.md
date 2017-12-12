---
title: Azure Quick Start - Enable Inventory with Azure Automation | Microsoft Docs 
description: Enable Inventory collection for your Azure and non-Azure machines.
services: automation
keywords: inventory, automation, change, tracking
author: jennyhunter-msft
ms.author: jehunte
ms.date: 10/26/2017
ms.topic: hero-article
ms.service: automation
ms.custom: mvc
manager: carmonm
---

# Enable Inventory collection for your Azure and non-Azure machines

In this quickstart, you learn how to enable inventory collection with Azure Automation.

By enabling Inventory, you can collect and view inventory for software, files, Linux daemons, Windows Services, and Windows Registry keys on your computers. Tracking the configurations of your machines can help you pinpoint operational issues across your environment and better understand the state of your machines.

## Prerequisites

To complete this quickstart:

* [Create an Automation account](automation-offering-get-started.md) before you begin.

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/).

## Log in to Azure

Log in to the Azure portal at http://portal.azure.com.

## Enable Inventory through an Automation account

To onboard a machine to Inventory, there are many different methods. For this article, we recommend onboarding through an Automation account. You can learn more about different methods to onboard your machines to Inventory by reading the [Onboarding](../log-analytics/log-analytics-change-tracking.md?toc=%2fazure%2fautomation%2ftoc.json) article.

1. In the left pane of the Azure portal, select **Automation accounts**. If it is not visible in the left pane, click **All services** and search for it in the resulting view.
1. In the list, select an Automation account. 
1. In the left pane of the Automation account, select **Inventory**.
1. Select a [Log Analytics](../log-analytics/log-analytics-overview.md?toc=%2fazure%2fautomation%2ftoc.json) workspace to store data logs from Inventory, and then select **Enable**. You get a notification indicating that the solution is being enabled. This process can take up to 15 minutes.

## Add a virtual machine

Select **Add Azure VM** on the Change tracking window. Choose a VM from the list of virtual machines in your subscription. Under **Change Tracking and Inventory**, select **Enable**.

> [!NOTE]
> If you already completed the [Change tracking quickstart](automation-quickstart-change.md) with your VM, the solution is already enabled for that VM.

## Configure your inventory settings

By default, software, Windows services, and Linux daemons are configured for collection. To collect Windows Registry and file inventory, configure the inventory collection settings.

> [!NOTE]
> Inventory and Change Tracking use the same collection settings, and settings are configured on a workspace level.

1. In the **Inventory** view, select the **Edit Settings** button at the top of the window.
1. To add a new collection setting, go to the setting category that you want to add by selecting the **Windows Registry**, **Windows Files**, and **Linux Files** tabs. 
1. Select **Add** at the top of the window.
1. To view the details and descriptions of each setting property, visit the [Change Tracking documentation page](../log-analytics/log-analytics-change-tracking.md?toc=%2fazure%2fautomation%2ftoc.json).

## View Inventory log data

Inventory generates log data that is sent to Log Analytics. To search the logs by running queries, select **Log Analytics** at the top of the **Inventory** window. Inventory data is stored under the type **ConfigurationData**.

To learn more about running and searching log files in Log Analytics, see [Log Analytics](../log-analytics/log-analytics-overview.md?toc=%2fazure%2fautomation%2ftoc.json).

## Next steps

In this quick start, you've enabled inventory collection and viewed the results. To learn more about Azure Automation, continue to the tutorial for enabling inventory of virtual machines.

> [!div class="nextstepaction"]
> [Enable inventory of virtual machines with Azure Automation](automation-vm-inventory.md)

* To learn about managing changes on your machines, see [Track software changes in your environment with the Change Tracking solution](../log-analytics/log-analytics-change-tracking.md?toc=%2fazure%2fautomation%2ftoc.json).
* To learn about managing Windows and package updates on your machines, see [The Update Management solution in OMS](../operations-management-suite/oms-solution-update-management.md?toc=%2fazure%2fautomation%2ftoc.json).