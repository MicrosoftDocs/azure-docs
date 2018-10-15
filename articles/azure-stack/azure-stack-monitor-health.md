---
title: Monitor health and alerts in Azure Stack | Microsoft Docs
description: Learn how to monitor health and alerts in Azure Stack.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 9/10/2018
ms.author: mabrigg

---
# Monitor health and alerts in Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Azure Stack includes infrastructure monitoring capabilities that enable you to view health and alerts for an Azure Stack region. The **Region management** tile, pinned by default in the administrator portal for the Default Provider Subscription, lists all the deployed regions of Azure Stack. The tile shows the number of active critical and warning alerts for each region, and is your entry point into the health and alert functionality of Azure Stack.

 ![The Region Management tile](media/azure-stack-monitor-health/image1.png)

 ## Understand health in Azure Stack

 Health and alerts are managed by the Health resource provider. Azure Stack infrastructure components register with the Health resource provider during Azure Stack deployment and configuration. This registration enables the display of health and alerts for each component. Health in Azure Stack is a simple concept. If alerts for a registered instance of a component exist, the health state of that component reflects the worst active alert severity; warning, or critical.

## Alert severity definition

In Azure Stack alerts are raised with only two severities: **warning** and **critical**.

- **Warning**  
  An operator can address the warning alert in a scheduled manner. The alert typically does not impact user workloads.

- **Critical**  
  An operator should address the critical alert with urgency. These are issues that currently impact or will soon impact Azure Stack users. 

 
 ## View and manage component health state
 
 As an Azure Stack operator, you can view the health state of components in the administrator portal and through REST API and PowerShell.
 
To view the health state in the portal, click the region that you want to view in the **Region management** tile. You can view the health state of infrastructure roles and of resource providers.

![List of infrastructure roles](media/azure-stack-monitor-health/image2.png)

You can click a resource provider or infrastructure role to view more detailed information.

> [!WARNING]  
> If you click an infrastructure role, and then click the role instance, there are options to Start, Restart, or Shutdown. Do not use these actions when you apply updates to an integrated system. Also, do **not** use these options in an Azure Stack Development Kit environment. These options are designed only for an integrated systems environment, where there is more than one role instance per infrastructure role. Restarting a role instance (especially AzS-Xrp01) in the development kit causes system instability. For troubleshooting assistance, post your issue to the [Azure Stack forum](https://aka.ms/azurestackforum).
>
 
## View alerts

The list of active alerts for each Azure Stack region is available directly from the **Region management** blade. The first tile in the default configuration is the **Alerts** tile, which displays a summary of the critical and warning alerts for the region. You can pin the Alerts tile, like any other tile on this blade, to the dashboard for quick access.   

![Alerts tile that shows a warning](media/azure-stack-monitor-health/image3.png)

By selecting the top part of the **Alerts** tile, you navigate to the list of all active alerts for the region. If you select either the **Critical** or **Warning** line item within the tile, you navigate to a filtered list of alerts (Critical or Warning). 

![Filtered warning alerts](media/azure-stack-monitor-health/image4.png)
  
The **Alerts** blade supports the ability to filter both on status (Active or Closed) and severity (Critical or Warning). The default view displays all active alerts. All closed alerts are removed from the system after seven days.

![Filter pane to filter by critical or warning status](media/azure-stack-monitor-health/image5.png)

The **View API** action displays the REST API that was used to generate the list view. This action provides a quick way to become familiar with the REST API syntax that you can use to query alerts. You can use this API in automation or for integration with your existing datacenter monitoring, reporting, and ticketing solutions. 

![The View API option that shows the REST API](media/azure-stack-monitor-health/image6.png)

You can click a specific alert to view the alert details. The alert details show all fields that are associated with the alert, and enable quick navigation to the affected component and source of the alert. For example, the following alert occurs if one of the infrastructure role instances goes offline or is not accessible.  

![The Alert details blade](media/azure-stack-monitor-health/image7.png)

After the infrastructure role instance is back online, this alert automatically closes. Many, but not every alert automatically closes when the underlying issue is resolved. We recommend that you select **Close Alert** after you perform remediation steps. If the issue persists, Azure Stack generates a new alert. If you resolve the issue, the alert remains closed and requires no additional action.

## Next steps

[Manage updates in Azure Stack](azure-stack-updates.md)

[Region management in Azure Stack](azure-stack-region-management.md)
