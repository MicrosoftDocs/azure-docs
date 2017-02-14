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
ms.date: 02/13/2017
ms.author: chasat

---
# Monitor health and alerts in Azure Stack
Microsoft Azure Stack Technical Preview 2 introduces new infrastructure monitoring capabilities that enable you, the cloud administrator, to view health and alerts for an Azure Stack region.

This preview release of Azure Stack introduces a set of region management capabilities available in the **Region Management** tile. The Region Management tile, pinned by default for members of the admin subscription, lists all the deployed regions of Azure Stack. It also the counts of active critical and warning alerts for each region. This tile is your entry point into the health and alert functionality of Azure Stack.

 ![The Region Management tile](media/azure-stack-monitor-health/image1.png)

 ## Understand health in Azure Stack

 Health and alerts are managed in Azure Stack by the Health resource provider. Azure Stack infrastructure components register with the Health resource provider during Azure Stack deployment and configuration. They perform this registration for the purpose of displaying health and alerts. Health in Azure Stack is a simple concept. If alerts for a registered instance of a component exist, the health state of that component reflects the worst active alert severity; warning, or critical.
 
 You can view the health state of components in both the Azure Stack portal and through Rest API and PowerShell. In the TP2 release, you can view the health state of infrastructure roles. However, the only infrastructure role reporting alerts and health is the Health controller. In future releases, other infrastructure roles will surface alerts and report health.

![List of infrastructure roles](media/azure-stack-monitor-health/image2.png)
 
## View alerts

The list of active alerts for each Azure Stack region is available directly from the Region Management blade.  The first tile in the default configuration is the Alerts tile, which displays a summary of the critical and warning alerts for the region. The Alerts tile, like any other tile on this blade, can be pinned to the dashboard for quick access.   

![Alerts tile that shows a warning](media/azure-stack-monitor-health/image3.png)

By selecting the **Alerts** tile, you navigate to the list of all active alerts for the region. If you select either the **Critical** or **Warning** line item within the tile, you navigate to a filtered list of alerts (Critical or Warning). 

![Filtered warning alerts](media/azure-stack-monitor-health/image4.png)
  
The Alerts blade supports the ability to filter both on status (active or closed) and severity (critical or warning). The default view displays all Active alerts. All closed alerts are removed from the system after seven days.

![Filter pane to filter by critical or warning status](media/azure-stack-monitor-health/image5.png)

The Alerts list blade also exposes an action called **View API**, which displays the Rest API used to generate the list view. This action provides a quick way to become familiar with the Rest APIs that you can use to query alerts for use in automation or integration with your existing datacenter monitoring, reporting, and ticketing solutions. 

![The View API option that shows the Rest API](media/azure-stack-monitor-health/image6.png)

From the alert list blade, you can select an alert to navigate to the **Alert Details** blade. The alert detail blade displays all the fields associated with the alert and allows for quick navigation to the affected component and source of the alert. For example, the following alert occurs if one of the infrastructure role instances goes offline or is inaccessible. After the infrastructure role instance is back online, this alert will close automatically. 

![The Alert Details blade](media/azure-stack-monitor-health/image7.png)

Now that you know more about health and viewing alerts in Azure Stack, it’s time to learn more about how to update Azure Stack.

## Next steps
[Updates management in Azure Stack](azure-stack-updates.md)

