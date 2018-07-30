---
title: Use the Azure portal to create classic alerts for Azure services | Microsoft Docs
description: Trigger emails or notifications, or call website URLs (webhooks) or automation when the conditions that you specify are met.
author: rboucher
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 09/23/2016
ms.author: robb
ms.component: alerts
---
# Use the Azure portal to create classic metric alerts in Azure Monitor for Azure services 

> [!div class="op_single_selector"]
> * [Portal](insights-alerts-portal.md)
> * [PowerShell](insights-alerts-powershell.md)
> * [CLI](insights-alerts-command-line-interface.md)
>

> [!NOTE]
> This article describes how to create older classic metric alerts. Azure Monitor now supports [newer metric alerts](monitoring-near-real-time-metric-alerts.md). 


This article shows you how to set up classic Azure metric alerts by using the Azure portal. 

You can receive an alert based on  metrics for your Azure services, or you can receive alerts for events that occur in Azure.

* **Metric values**: The alert triggers when the value of a specified metric crosses a threshold that you assign in either direction. That is, it triggers both when the condition is first met and then when that condition is no longer being met.    

* **Activity log events**: An alert can trigger on *every* event or when certain events occur. Learn more about [activity log alerts](monitoring-activity-log-alerts.md).

You can configure a classic metric alert to do the following when it triggers:

* Send email notifications to the service administrator and co-administrators.
* Send email to additional email addresses that you specify.
* Call a webhook.
* Start execution of an Azure runbook (only from the Azure portal).

You can configure and get information about classic metric alert rules from the following locations: 

* [Azure portal](insights-alerts-portal.md)
* [PowerShell](insights-alerts-powershell.md)
* [Azure CLI](insights-alerts-command-line-interface.md)
* [Azure Monitor REST API](https://msdn.microsoft.com/library/azure/dn931945.aspx)

## Create an alert rule on a metric with the Azure portal
1. In the [portal](https://portal.azure.com/), locate the resource that you want to monitor, and then select it.

2. In the **MONITORING** section, select **Alerts (Classic)**. The text and icon might vary slightly for different resources. If you don't find **Alerts (Classic)** here, you might find it in **Alerts** or **Alert Rules**.

    ![Monitoring](./media/insights-alerts-portal/AlertRulesButton.png)

3. Select the **Add metric alert (classic)** command, and then fill in the fields.

    ![Add Alert](./media/insights-alerts-portal/AddAlertOnlyParamsPage.png)

4. **Name** your alert rule. Then choose a **Description**, which also appears in notification emails.

5. Select the **Metric** that you want to monitor. Then choose a **Condition** and **Threshold** value for the metric. Also choose the **Period** of time that the metric rule must be satisfied before the alert triggers. For example, if you use the period "Over the last 5 minutes" and your alert looks for a CPU above 80%, the alert triggers when the CPU has been consistently above 80% for 5 minutes. After the first trigger occurs, it triggers again when the CPU stays below 80% for 5 minutes. The CPU metric measurement happens every minute.

6. Select **Email owners...** if you want administrators and co-administrators to receive email notifications when the alert fires.

7. If you want to send notifications to additional email addresses when the alert fires, add them in the **Additional Administrator email(s)** field. Separate multiple emails with semicolons, in the following format: *email@contoso.com; email2@contoso.com*

8. Put in a valid URI in the **Webhook** field if you want it to be called when the alert fires.

9. If you use Azure Automation, you can select a runbook to be run when the alert fires.

10. Select **OK** to create the alert.   

Within a few minutes, the alert is active and triggers as previously described.

## Manage your alerts
After you create an alert, you can select it and do one of the following tasks:

* View a graph that shows the metric threshold and the actual values from the previous day.
* Edit or delete it.
* **Disable** or **Enable** it if you want to temporarily stop or resume receiving notifications for that alert.

## Next steps
* [Get an overview of Azure monitoring](monitoring-overview.md), including the types of information you can collect and monitor.
* Learn more about the [newer metric alerts](monitoring-near-real-time-metric-alerts.md).
* Learn more about [configuring webhooks in alerts](insights-webhooks-alerts.md).
* Learn more about [configuring alerts on activity log events](monitoring-activity-log-alerts.md).
* Learn more about [Azure Automation runbooks](../automation/automation-starting-a-runbook.md).
* Get an [overview of diagnostic logs](monitoring-overview-of-diagnostic-logs.md), and collect detailed high-frequency metrics on your service.
* Get an [overview of metrics collection](insights-how-to-customize-monitoring.md) to make sure that your service is available and responsive.
