---
title: Manage VM with inventory collection | Microsoft Docs 
description: Manage VM with inventory collection
services: automation 
keywords: inventory, automation, change, tracking
author: jennyhunter-msft
ms.author: jehunte
ms.date: 09/13/2017
ms.topic: hero-article
manager: carmonm
---

# Manage a virtual machine with inventory collection

Inventory tracking can be enabled for an Azure virtual machine from the machine's resource page. This method provides a browser-based user interface for setting up and configuring inventory collection.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.
If you don't have an Azure virtual machine, create a [virtual machine](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/quick-create-portal) before you begin.

## Log in to the Azure portal

Log in to the [Azure portal](https://portal.azure.com/).

## Enable inventory collection from the virtual machine resource page

1. In the screen on the left, select **Virtual machines**.
1. From the list, select a virtual machine.
1. Select **Inventory (Preview)** from the resource menu underneath **Operations**.
1. A banner appears at the top of the page, notifying you that the solution is not enabled. Click the banner to enable the solution.

    ![View the status bar when your machine is not enabled](./media/automation-vm-inventory/inventory-not-onboarded.png)

1. Select Log Analytics Workpsace to store your data logs. If no workspaces are available to you for that region, you are prompted to create a default workspace and Automation account. Click **Enable** to start onboarding your computer.

    ![View onboarding options](./media/automation-vm-inventory/inventory-onboarding-options.png)  

1. A status bar notifies you that the solution is being enabled. This process can take up to 15 minutes. During this time, you can close the blade, or keep it open and it will report when the solution is enabled. You can monitor the deployment status from the notifications pane.

    ![View the inventory solution immediately after onboarding](./media/automation-vm-inventory/inventory-onboarded.png)

1. When the deployment is complete, the status bar will disappears. At this time, the system is still still collecting inventory data,
1. and data may not be visible yet. A full collection of data can take 24 hours.

## Configure your inventory settings

By default, Software, Windows Services, and Linux Daemons are configured for collection. To collect Windows Registy and File inventory, you configure the inventory collection settings.

1. From the **Inventory (Preview)** view, select the **Edit Settings** button with the gear at the top of the page.
1. To add a new collection setting, navigate to the setting category you wish to add by using the tabs that read **Windows Registry**, **Windows Files**, and **Linux Files**. Click **Add** at the top of the page.
1. To view details and descriptions of each setting property, visit the [Inventory documentation page](https://aka.ms/configinventorydocs).

## Disconnecting your virtual machine from management

To remove your machine from inventory management:

1. From the left-hand menu in the Azure portal, click **Log Analytics** and then click select the workspace that you used when onboarding your virtual machine.
1. On your Log Analytics page, select **Virtual machines** under the **Workspace Data Sources** categroy in the resource menu. 
1. Select the virtual machine you want to disconnect from the list. It will have a green checkmark next to text that says "This workspace" in the **OMS Connection** column. Click **Disconnect** at the top of the next page and **Yes** to the confirmation dialog in order to disconnect the machine from management.

## Next steps

In this quick start, you’ve connected a virtual machine to management through Log Analytics. To learn more about managament through Log Analytics, continue to the tutorial for Change tracking or Update management.

> [!div class="nextstepaction"]
> [Manage VM with change tracking](./tutorial-manage-vm.md)
> [Manage WM with update assessment and deployment](./tutorial-manage-vm.md)
