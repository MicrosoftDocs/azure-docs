---
title: Azure Quick Start - Manage VM with inventory collection | Microsoft Docs 
description: Azure Quick Start - Manage VM with inventory collection
services: service-name-with-dashes-AZURE-ONLY 
keywords: Don’t add or edit keywords without consulting your SEO champ.
author: jennyhunter-msft
ms.author: jehunte
ms.date: 09/13/2017
ms.topic: hero-article
manager: carmonm
---

# Manage a virtual machine with inventory collection
Inventory tracking can be enabled for an Azure virtual machine from the machines's resource page. This method provides a browser-based user interface for setting up and configuring inventory collection.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.
If you don't have an Azure virtual machine, create a [virtual machine](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/quick-create-portal) before you begin.

## Log in to the Azure portal

Log in to the [Azure portal](https://portal.azure.com/).


## Enable inventory collection from the virtual machine resource page

1. Navigate to the virtual machine you wish to onboard to management.

2. Select **Inventory (Preview)** from the resource menu underneath **Operations**.

3. You will see a status bar at the top of the page, notifying you that the solution is not enabled. Click the status bar.

    ![View the status bar when your machine is not enabled](./media/quick-manage-inventory/inventory-not-onboarded.png)  

4. Select Log Analytics Workpsace to store your data logs. If no workspaces are available to you for that region, you will be prompted to create a default workspace and Automation account. Click **Enable** to start onboarding your computer.

    ![View onboarding options](./media/quick-manage-inventory/inventory-onboarding-options.png)  

5. You will see a new status bar notifying you that the solution is being enabled. This process can take up to 15 minutes. During this time, you can close the blade, or keep it open and it will report when the solution is enabled. You can monitor the deployment status also from the notifications pane.

    ![View the inventory solution immediately after onboarding](./media/quick-manage-inventory/inventory-onboarded.png)  

6. When the deployment is complete, your status bar will disappear. At this time, your inventory is still collecting, and data may not be visible yet. A full collection of data can take 24 hours.


## Configure your inventory settings
By default, Software, Windows Services, and Linux Daemons are configured for collection. To collect Windows Registy and File inventory, you will need to configure the inventory collection settings.

1. From the **Inventory (Preview)** view, select the **Edit Settings** button with the gear at the top of the page.

2. To add a new collection setting, navigate to the setting category you wish to add by using the tabs that read **Windows Registry**, **Windows Files**, and **Linux Files**. Click **Add** at the top of the page.

3. To view details and descriptions of each setting property, visit the [Inventory documentation page](https://aka.ms/configinventorydocs).


## Disconnecting your virtual machine from management

If you plan to continue on to work with subsequent quick starts or to continue managing this virtual machine, do not disconnect it from the workspace used in this quick start. If you do not plan to continue, use the following steps to remove your machine from management.

1. From the left-hand menu in the Azure portal, click **Log Analytics** and then click select the workspace that you used when onboarding your virtual machine.

2. On your Log Analytics page, select **Virtual machines** under the **Workspace Data Sources** categroy in the resource menu. 

3. Select the virtual machine you want to disconnect from the list. It will have a green checkmark next to text that says "This workspace" in the **OMS Connection** column. Click **Disconnect** at the top of the next page and **Yes** to the confirmation dialog in order to disconnect the machine from management.


## Next steps

*EXAMPLE*:
In this quick start, you’ve connected a virtual machine to management through Log Analytics. To learn more about managament through Log Analytics, continue to the tutorial for Change Tracking or Update Management.

> [!div class="nextstepaction"]
> [Manage VM with change tracking](./tutorial-manage-vm.md)
> [Manage WM with update assessment and deployment](./tutorial-manage-vm.md)
