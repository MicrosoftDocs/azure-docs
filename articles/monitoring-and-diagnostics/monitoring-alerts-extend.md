---
title: Extend (copy) alerts from OMS portal into Azure - Overview | Microsoft Docs
description: Overview of process of copy alerts from OMS portal into Azure Alerts, details around common customer concerns.
author: msvijayn
manager: kmadnani1
editor: ''
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/06/2018
ms.author: vinagara

---
# Extend (copy) alerts from OMS portal into Azure
The Operations Management Suite (OMS) portal shows only Log Analytics alerts.  The new alerts experience has now integrated the alerting experience across various services and parts in Microsoft Azure. The new experience available as **Alerts** under Azure Monitor in the Azure portal contains activity log alerts, metric alerts, and log alerts for both Log Analytics and Application Insights. 


But for some users, the use of Log Analytics and allied functionality like alerts, has been through [Microsoft Operation Management Suite (OMS) portal](../operations-management-suite/operations-management-suite-overview.md). And hence to allow them to easily manage their other Azure resources alongside their use of Log Analytics - systematically Microsoft has been ensuring that the capabilities of OMS portal are also available in Azure portal. In that regard, Azure alerts already allows users to manage query-based alerts for Log Analytics, for more information, see [log alerts on Azure alerts](monitor-alerts-unified-log.md). In Alerts under Azure Monitor, alerts created in OMS portal are already listed under appropriate log analytics workspace. But any editing or change on such alerts created in OMS portal, require the user to leave Azure and use OMS portal; then return back to Azure if they needed to manage any other service. To reduce this hardship, Microsoft is now enabling users to  extend their alerts from OMS portal into Azure.

## Benefits of extending your alerts
Apart from the benefit accrued in not having to navigate out of Azure portal, there are other salient advantages in extending alerts from OMS portal into Azure

- Unlike in the OMS portal, where only 250 alerts could be created and viewed; in Azure Alerts this limitation is not present
- From Azure alerts, all your alert types can be managed, enumerated, and viewed; not just Log Analytics alerts as is the case with OMS portal
- Control access to users to only Monitoring and Alerting, using [Azure Monitor role](monitoring-roles-permissions-security.md)
- Azure Alerts utilize [Action Groups](monitoring-action-groups.md), which allow you to have more than one action for each alert including SMS, Voice Call, Automation Runbook, Webhook, ITSM Connector and more. 

## Process of extending your alerts
The process of extending alerts from OMS portal into Azure, does **not** involve changing your alert definition, query, or configuration in any way. The only change required is that in Azure, all actions such as email notification, webhook call, running automation runbook or connecting to ITSM tool are done via Action Group. Hence if appropriate action group are associated with your alert - they will become extended into Azure.

Since the process of extending is nondestructive and not interruptive, Microsoft will extend alerts created in OMS portal to Azure alerts automatically - starting from **14 May 2018**. From this day, Microsoft will begin to schedule extending the alerts into Azure and gradually make all alerts present in OMS portal, manageable from Azure portal. 

When alerts in a Log Analytics workspace get scheduled for extending into Azure, they will continue to work and will **not** in any way compromise your monitoring. When scheduled, your alerts may be unavailable for modification/editing temporarily; but new Azure alerts can continue to be created in this brief time. In this brief period, if any edit or creation of alert is done from OMS portal, users will have the option to continue into Azure Log Analytics or Azure Alerts.

 ![During scheduled period, user action on alerts redirected to Azure](./media/monitor-alerts-extend/ScheduledDirection.png)

> [!NOTE]
> Extending alerts from OMS portal to Azure is not charged and usage of Azure alerts for query based Log Analytics alerts will be not billed, when used within the limits and conditions stated in [Azure Monitor pricing policy](https://azure.microsoft.com/pricing/details/monitor/)  

Users can enjoy the benefits of extending alerts before this date; by voluntarily opting to make their alerts manageable in Azure.

### How to voluntarily extending your alerts
To enable OMS users an easy pass into Azure alerts, Microsoft has created tools to enable extending the alerts. Microsoft OMS portal customers can extend their alerts to Azure either from a wizard in OMS portal (or) by a programmatic approach using a new API. For more information, see [Extending alerts into Azure using OMS portal and API](monitoring-alerts-extend-tool.md).


## Usage after extending your alerts
As stated, alerts created in Microsoft Operation Management Suite will be extended into Azure Alerts; after, which you can manage them from Azure. Alerts will continue to be listed in the OMS portal - Alert setting section. 
As illustrated below:

 ![OMS Portal listing alerts after being extended into Azure](./media/monitor-alerts-extend/PostExtendList.png)

For any operation on alerts like edit or creation done in OMS portal, users will be transparently directed to Azure Alerts. 

> [!NOTE]
> As users will be transparently taken to Azure, on any addition or edit action on an alert in OMS - ensure users are properly mapped with appropriate [permissions for using Azure Monitor and Alerts](monitoring-roles-permissions-security.md)

Alert creation will continue from the existing [Log Analytics API](../log-analytics/log-analytics-api-alerts.md) as earlier, with only minor change being that after alerts are extended into Azure - action groups would need to be associated in schedule.

## Next steps

* Learn of the tools to [initiate extending alerts from OMS into Azure](monitoring-alerts-extend-tool.md)
* Learn more about the new [Azure alerts experience](monitoring-overview-unified-alerts.md).
* Learn about [log alerts in Azure Alerts](monitor-alerts-unified-log.md).
