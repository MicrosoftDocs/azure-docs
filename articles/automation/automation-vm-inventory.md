---
title: Manage an Azure virtual machine with inventory collection | Microsoft Docs 
description: Manage a virtual machine with inventory collection
services: automation 
keywords: inventory, automation, change, tracking
author: jennyhunter-msft
ms.author: jehunte
ms.date: 09/13/2017
ms.topic: hero-article
manager: carmonm
---

# Manage an Azure virtual machine with inventory collection

You can enable inventory tracking for an Azure virtual machine from the virtual machine's resource page. This method provides a browser-based user interface for setting up and configuring inventory collection.

## Before you begin
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/).
If you don't have an Azure virtual machine, [create a virtual machine](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/quick-create-portal).

## Sign in to the Azure portal
Sign in to the [Azure portal](https://portal.azure.com/).

## Enable inventory collection from the virtual machine resource page

1. In the left pane of the Azure portal, select **Virtual machines**.
2. In the list of virtual machines, select a virtual machine.
3. On the **Resource** menu, under **Operations**, select **Inventory (Preview)**.  
    A banner appears at the top of the window, notifying you that the solution is not enabled. 
4. To enable the solution, select the banner.
5. Select a log analytics workspace for storing your data logs.  
    If no workspace is available to you for that region, you are prompted to create a default workspace and automation account. 
6. To start onboarding your computer, select **Enable**.

   ![View onboarding options](./media/automation-vm-inventory/inventory-onboarding-options.png)  
    A status bar notifies you that the solution is being enabled. This process can take up to 15 minutes. During this time, you can close the window, or you can keep it open and it will notify you when the solution is enabled. You can monitor the deployment status from the notifications pane.

   ![View the inventory solution immediately after onboarding](./media/automation-vm-inventory/inventory-onboarded.png)

When the deployment is complete, the status bar disappears. The system is still collecting inventory data, and the data might not be visible yet. A full collection of data can take 24 hours.

## Configure your inventory settings

By default, software, Windows services, and Linux daemons are configured for collection. To collect Windows registry and file inventory, configure the inventory collection settings.

1. In the **Inventory (Preview)** view, select the **Edit Settings** button at the top of the window.
2. To add a new collection setting, go to the setting category that you want to add by selecting the **Windows Registry**, **Windows Files**, and **Linux Files** tabs. 
3. Select **Add** at the top of the window.
4. To view the details and descriptions of each setting property, visit the [Inventory documentation page](https://aka.ms/configinventorydocs).

## Disconnect your virtual machine from management

To remove your virtual machine from inventory management:

1. In the left pane of the Azure portal, select **Log Analytics**, and then select the workspace that you used when you onboarded your virtual machine.
2. In the **Log Analytics** window, on the **Resource** menu, under the **Workspace Data Sources** category, select **Virtual machines**. 
3. In the list, select the virtual machine that you want to disconnect. The virtual machine has a green check mark next to **This workspace** in the **OMS Connection** column. 
4. At the top of the next page, select **Disconnect**.
5. In the confirmation window, select **Yes**.  
    This action disconnects the machine from management.

## Next steps

* To learn about managing changes in files and registry settings on your virtual machines, see [Track software changes in your environment with the Change Tracking solution](../log-analytics/log-analytics-change-tracking.md).
* To learn about managing Windows and package updates on your virtual machines, see [The Update Management solution in OMS](../operations-management-suite/oms-solution-update-management.md).
