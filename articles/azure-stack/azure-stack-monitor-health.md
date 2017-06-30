---
title: Monitor health and alerts in Azure Stack | Microsoft Docs
description: Learn how to monitor health and alerts in Azure Stack.
services: azure-stack
documentationcenter: ''
author: chasat-MS
manager: dsavage
editor: ''

ms.assetid: 69901c7b-4673-4bd8-acf2-8c6bdd9d1546
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/30/2017
ms.author: chasat

---
# Monitor health and alerts in Azure Stack

Azure Stack includes infrastructure monitoring capabilities that enable a cloud operator to view health and alerts for an Azure Stack region.

Azure Stack has a set of region management capabilities available in the **Region management** tile. This tile, pinned by default in the administrator portal for the Default Provider Subscription, lists all the deployed regions of Azure Stack. It also shows the count of active critical and warning alerts for each region. This tile is your entry point into the health and alert functionality of Azure Stack.

 ![The Region Management tile](media/azure-stack-monitor-health/image1.png)

 ## Understand health in Azure Stack

 Health and alerts are managed in Azure Stack by the Health resource provider. Azure Stack infrastructure components register with the Health resource provider during Azure Stack deployment and configuration. This registration enables the display of health and alerts for each component. Health in Azure Stack is a simple concept. If alerts for a registered instance of a component exist, the health state of that component reflects the worst active alert severity; warning, or critical.
 
 ## View and manage component health state
 
 You can view the health state of components in both the Azure Stack administrator portal and through Rest API and PowerShell.
 
To view the health state in the portal, click the region that you want to view in the **Region management** tile. You can view the health state of infrastructure roles and of resource providers. Note that in this release, the Compute resource provider does not report health state.

![List of infrastructure roles](media/azure-stack-monitor-health/image2.png)

You can click a resource provider or infrastructure role to view more detailed information.

If you click an infrastructure role, and then click the role instance, you’ll see options in the **Role instance** blade to Start, Restart, or Shutdown. (The available options depend on the current state.) Although there is the capability to start, restart, or shut down an infrastructure role instance, we don’t recommend that you do so without guidance from the [Azure Stack forum](https://aka.ms/azurestackforum).

> [!WARNING]
>In an Azure Stack Development Kit environment, there is only one role instance for each infrastructure role. Therefore, if you restart or shut down a role instance, the functionality that the role offers is unavailable until the role instance starts. If you restart or shut down the AzS-Xrp01 role instance (associated with several of the infrastructure roles), you must use Hyper-V Manager to start the virtual machine.
>
>
 
## View alerts

The list of active alerts for each Azure Stack region is available directly from the **Region management** blade. The first tile in the default configuration is the **Alerts** tile, which displays a summary of the critical and warning alerts for the region. You can pin the Alerts tile, like any other tile on this blade, to the dashboard for quick access.   

![Alerts tile that shows a warning](media/azure-stack-monitor-health/image3.png)

By selecting the top portion of the **Alerts** tile, you navigate to the list of all active alerts for the region. If you select either the **Critical** or **Warning** line item within the tile, you navigate to a filtered list of alerts (Critical or Warning). 

![Filtered warning alerts](media/azure-stack-monitor-health/image4.png)
  
The **Alerts** blade supports the ability to filter both on status (Active or Closed) and severity (Critical or Warning). The default view displays all Active alerts. All closed alerts are removed from the system after seven days.

![Filter pane to filter by critical or warning status](media/azure-stack-monitor-health/image5.png)

The Alerts blade also exposes the **View API** action, which displays the Rest API that was used to generate the list view. This action provides a quick way to become familiar with the Rest API syntax that you can use to query alerts. You can use this API in automation or for integration with your existing datacenter monitoring, reporting, and ticketing solutions. 

![The View API option that shows the Rest API](media/azure-stack-monitor-health/image6.png)

From the Alerts blade, you can select an alert to navigate to the **Alert details** blade. This blade displays all fields that are associated with the alert, and enables quick navigation to the affected component and source of the alert. For example, the following alert occurs if one of the infrastructure role instances goes offline or is not accessible.  

![The Alert Details blade](media/azure-stack-monitor-health/image7.png)

After the infrastructure role instance is back online, this alert automatically closes.

## Next steps

[Manage updates in Azure Stack](azure-stack-updates.md)

[Region management in Azure Stack](azure-stack-region-management.md)
