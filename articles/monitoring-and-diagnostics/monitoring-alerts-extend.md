---
title: Migrate Log Analytics alerts into Azure Alerts - Overview | Microsoft Docs
description: Overview of process to copy alerts from Log Analytics in OMS portal into Azure Alerts, with details addressing common customer concerns.
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
ms.date: 05/24/2018
ms.author: vinagara

---
# Migrate Log Analytics alerts to Azure Alerts
Until recently, Azure Log Analytics included its own alert functionality which could proactively notify you of conditions based on Log Analytics data.  Management of alert rules were performed in [Microsoft Operation Management Suite (OMS) portal](../operations-management-suite/operations-management-suite-overview.md). The new alerts experience has now integrated the alerting experience across various services in Microsoft Azure. The new experience is available as **Alerts** under Azure Monitor in the Azure portal, and supports alerting from activity logs, metrics, and logs from both Log Analytics and Application Insights. 

## Benefits of extending your alerts
There are several advantages of creating and managing alerts in the Azure port, such as:

- Unlike in the OMS portal, where only 250 alerts could be created and viewed; in Azure Alerts this limitation is not present
- From Azure Alerts, all your alert types can be managed, enumerated, and viewed; not just Log Analytics alerts as was the case previously
- Control access to users to only Monitoring and Alerting, using [Azure Monitor role](monitoring-roles-permissions-security.md)
- Azure Alerts utilize [Action Groups](monitoring-action-groups.md), which allows you to have more than one action for each alert including SMS, send a Voice call, invoke an Automation Runbook, invoke a Webhook, configure an ITSM Connector, and more. 

## Process of extending your alerts
The process of extending alerts from Log Analytics into Azure, does **not** involve changing your alert definition, query, or configuration in any way. The only change required is that in Azure, all actions such as email notification, a webhook call, running an Automation runbook or connecting to your ITSM tool are performed using an Action Group. If action groups are already associated with your alert - they will be included when extended into Azure.

> [!NOTE]
> Microsoft will automatically extend alerts created in Log Analytics to Azure alerts starting on **14 May 2018** in a recurring series until completed. From this day forward, Microsoft will begin to schedule extending the alerts into Azure, and during this transition, alerts can be managed from both the OMS portal and Azure portal. This process of extending your alerts is nondestructive and not interruptive, and if your alerts haven't been auto-extended, you can [manually extend your alerts](monitoring-alerts-extend-tool.md) during this time.  
> 

When alerts in a Log Analytics workspace are scheduled for extending into Azure, they will continue to work and will **not** in any way compromise your configuration. When scheduled, your alerts may be unavailable for modification/editing temporarily; but new Azure alerts can continue to be created during this time. If you attempt to edit or create alerts from the OMS portal, you will have the option to continue creating them from your Log Analytics workspace or from Azure Alerts in the Azure portal.

 ![During scheduled period, user action on alerts redirected to Azure](./media/monitor-alerts-extend/ScheduledDirection.png)

> [!NOTE]
> Extending alerts from OMS portal to Azure does not incur charges to your account and usage of Azure alerts for query based Log Analytics alerts will be not billed when used within the limits and conditions stated in [Azure Monitor pricing policy](https://azure.microsoft.com/pricing/details/monitor/)  

You can enjoy the benefits of extending alerts before this date; by voluntarily opting to make your alerts manageable in Azure.

### How to voluntarily extend your alerts
To extend your alerts in Azure Alerts, we have included two methods to complete this task in your workspace.  You can extend your alerts to Azure either from a wizard available in the OMS portal or programatically using a new API.  For more information, see [Extending alerts into Azure using OMS portal and API](monitoring-alerts-extend-tool.md).

## Experience after extending your alerts
After your alerts are extended into Azure Alerts, they will continue to be available in the OMS portal for management no differently than before .<br><br> ![OMS Portal listing alerts after being extended into Azure](./media/monitor-alerts-extend/PostExtendList.png)

When you attempt to edit an existing alert or create a new alert in the OMS portal, you are automatically redirected to Azure Alerts.  

> [!NOTE]
> It is necessary to ensure the permissions assigned to individuals who need to add or edit alerts are properly assigned in Azure.  Review, [permissions for using Azure Monitor and Alerts](monitoring-roles-permissions-security.md) to understand what permissions you need to grant.  
> 

Alert creation will continue to work from the [Log Analytics API](../log-analytics/log-analytics-api-alerts.md) and [Log Analytics Resource Template](../monitoring/monitoring-solutions-resources-searches-alerts.md), with only one minor change that needs to be applied  - action groups need to be included.

## Next steps

* Learn about the tools to [initiate extending alerts from Log Analytics into Azure](monitoring-alerts-extend-tool.md)
* Learn more about the new [Azure alerts experience](monitoring-overview-unified-alerts.md).
* Learn how to create [log alerts in Azure Alerts](monitor-alerts-unified-log.md).
