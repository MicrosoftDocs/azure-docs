---
title: Metric based alerts in Azure Monitor for Azure services - Alerts (Preview) | Microsoft Docs
description: Trigger emails, notifications, call websites URLs (webhooks), or automation when the conditions you specify are met for Azure Alerts (Preview).
author: vinagara
manager: kmadnani
editor: ''
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.assetid: f7457655-ced6-4102-a9dd-7ddf2265c0e2
ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/24/2017
ms.author: robb

---
# Metric based alerts in Azure Monitor for Azure services - Alerts (Preview)
> [!div class="op_single_selector"]
> * [Portal](insights-alerts-unified.md)
>

## Overview
This article shows you how to set up Azure metric alerts using the new Alerts (Preview) interface inside Azure portal. 
**Metric values** - The alert triggers when the value of a specified metric crosses a threshold you assign in either direction. That is, it triggers both when the condition is first met and then afterwards when that condition is no longer being met.    

A metric alert can on triggering push information or notification using [Action Groups](monitoring-action-groups). While [Action Groups](monitoring-action-groups) support many means of communicating an alert, a few are mentioned below:

* send email notifications to the service administrator and co-administrators
* send email to additional emails that you specify.
* call a webhook and push JSON to Azure or external applications
* notify on mobile using SMS and/or Azure Mobile App. Learn more about the [Azure Mobile App](https://aka.ms/azureapp).
* Create incidents or tickets in popular IT Service Management tool using ITSM Connector. Learn more about [IT Service Management Connector](https://aka.ms/ITSMC).

> [!NOTE]
> While Azure Alerts (Preview) offers a new and enhanced experience for creating metric alerts in Azure. The older and existing [Azure Monitor Alerts](monitoring-overview-alerts.md) will also remain usable
>

## Create an alert rule on a metric with the Azure portal
1. In the [portal](https://portal.azure.com/), select **Monitor** and under the MONITOR section - choose **Alerts (Preview)**.  
    ![Monitoring](./media/monitor-alerts-unified/AlertsPreviewMenu.png)

2. Select the **Add Alert Rule** button to create a new alert in Azure.
    ![Add Alert](./media/monitor-alerts-unified/AlertsPreviewOption.png)

3. Create the rule  by first clicking **Select Resource** link. Filter appropriately by choosing needed **Subscription**, **Resource Type** and finally selecting required **Resource**.
    [Create rule](./media/monitor-alerts-unified/AlertsPreviewAdd.png)

4. Once **resource** is selected, click **Add criteria** button to choose the specific signal from list of signal options, their monitoring service and type listed - which are applicable to the resource selected earlier.
> [!NOTE]
> Signal types indicated as metric from platform service - as same as Near Real Time Metric Alerts. To learn more about [Near Real Time Metric Alerts](monitoring-near-real-time-metric-alerts.md)

5.  Once signal is selected, logic for alerting can be stated. For reference historic data of the selected signal is shown with option to tweak the time window from last 6 hours to last week. With the visualization in place, **Alert Logic** can be selected from shown options of Condition, Aggregation and finally Threshold. As preview of the logic provided, the condition is shown in the visualaziation along with signal history, so as to indicate when the alert would have been triggered in the past. Finally specify in the logic, for what time Alerts should look for the specified conditon by choosing from the **Period** option along with how often Alert should run by selecting **Frequency**
   [Configure signal logic](./media/monitor-alerts-unified/AlertsPreviewCriteria.png)

> [!TIP]
> Keeping **Period** value greater than **Frequency** minimizes risk of missing any issue. Also history period chosen for visualization will have no impact on alert; so ensure evaluation period is appropriately chosen

6. As the second step, define a name for your alert in the **Alert rule name** field along with an **Description** detailing specifics for the alert and **Severity** value from the options provided. These details will be re-used in all alert emails, notifications or push done by Azure Monitor. Additionally, user can choose to immediately activate the alert rule on creation by appropriately toggling **Enable rule upon creation** option.

7. As the third and final step, specify if any **Action Group** needs to be triggered for the alert rule when alert condition is met. You can choose any existing Action Group with alert or create a new Action Group. According to selected Action Group, when alert is trigger Azure will: send email(s), send SMS(s), call Webhook(s), push to your ITSM tool, etc. Learn more about [Action Groups](monitoring-action-groups.md).


7. If all fields are valid and with green tick the **create alert rule** button can be clicked and Alert is created in Azure Monitor - Alerts (Preview). All Alerts can be viewed from the Alerts (Preview) Dashboard.
   [Rule Creation](./media/monitor-alerts-unified/AlertsPreviewCreate.png)

Within a few minutes, the alert is active and triggers as previously described.

## Managing your alerts
1. In the [portal](https://portal.azure.com/), select **Monitor** and under the MONITOR section - choose **Alerts (Preview)**.  
    ![Monitoring](./media/insights-alerts-unified/AlertsPreviewMenu.png)
2. Select the **Manage rules** button on the top bar, to navigate to the rule management section - where all  alert rules will be listed; including alerts which have been disabled.
3. To find for specific alert rules, one can either use the drop down filters on top which allow to shortlist alert rules for specific *Subscription, Resource Groups and/or Resource*. Alternatively on using the search pane above the alert rule list marked *Filter alerts*, one can provide keyword which will be matched against *Alert Name, Condition and Target Resource*; to show only matching rules. 
   [Alert Management](./media/monitor-alerts-unified/AlertsPreviewManage.png)
1. To view or modify specific Alert rule, click on its name which would be shown as a clickable link.
2. Alert defined is shown - in the 3 stage structure of: 1) Alert Condition 2) Alert Detail 3) Action Group. **Target Criteria** can be clicked to modify the alert logic or  a new criteria can be added after using the bin icon to delete the earlier logic. Similarly, in Alert details section - **Description** and **Severity** can be modified. And the Action Group can be changed or a new one can be crafted to linking to the alert using the **New action group** button
   [Modify Alert Rule](./media/monitor-alerts-unified/AlertsPreviewEdit.png)
1. Using the top panel, changes to the alert can be reflective including: *Save* to commit any changes done to alert, *Discard* to go back without committing any changes made to alert, *Disable* to deactivate the alert - after which it will no longer run or trigger any action and finally,  *Delete* to permenantly remove the entire alert rule from Azure.

## Next steps
* [Get an overview of Azure Alerts (Preview)](monitoring-overview-unified.md) including the types of information you can collect and monitor.
* Learn more about the new [near real-time metric alerts (preview)](monitoring-near-real-time-metric-alerts.md)
* Get an [overview of metrics collection](insights-how-to-customize-monitoring.md) to make sure your service is available and responsive.
* Learn about [Log Search Alerts for Log Analytics in Azure Alerts (preview)](monitor-alerts-unified-log.md)
* Learn more about [configuring webhooks in alerts](insights-webhooks-alerts.md).