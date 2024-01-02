---
title: Configure alerts - Azure portal - Azure Database for PostgreSQL - Flexible Server
description: This article describes how to configure and access metric alerts for Azure Database for PostgreSQL - Flexible Server from the Azure portal.
author: varun-dhawan
ms.author: varundhawan
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.date: 7/12/2023
---

# Use the Azure portal to set up alerts on metrics for Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This article shows you how to set up Azure Database for PostgreSQL alerts using the Azure portal. You can receive an alert based on monitoring metrics for your Azure services.

The alert triggers when the value of a specified metric crosses a threshold you assign. The alert triggers both when the condition is first met, and then afterwards when that condition is no longer being met. Metric alerts are stateful, that is, they only send out notifications when the state changes.

You can configure an alert to do the following actions when it triggers:

* Send email notifications to the service administrator and co-administrators.
* Send email to additional emails that you specify.
* Call a webhook.

You can configure and get information about alert rules using:

* [Azure portal](../../azure-monitor/alerts/alerts-metric.md#create-with-azure-portal)
* [Azure CLI](../../azure-monitor/alerts/alerts-metric.md#with-azure-cli)
* [Azure Monitor REST API](/rest/api/monitor/metricalerts)

## Create an alert rule on a metric from the Azure portal

1.	In the [Azure portal](https://portal.azure.com/), select the Azure Database for PostgreSQL – Flexible Server you want to monitor

2. Under the **Monitoring** section of the sidebar, select **Alerts**.

3.	Select **+ New alert rule**.

4. The **Create rule** page opens as shown below. Fill in the required information:

5. Current Flexible Server instance is automatically added to the alert **Scope**.

6. Within the **Condition** section, select **Add condition**.

7.	You'll see a list of supported signals, select the metric you want to create an alert on. For example, select `storage percent`.

8.	You'll see a chart for the metric for the last six hours. Use the **Chart period** dropdown to select to see longer history for the metric.

9.	Select the **Threshold type** (ex. "Static" or "Dynamic"), **Operator** (ex. "Greater than"), and **Aggregation type** (ex. average). This selection determines the logic that the metric alert rule will evaluate.
    - If you're using a Static threshold, continue to define a Threshold value (ex. 85 percent). The metric chart can help determine what might be a reasonable threshold.
    - If you're using a Dynamic threshold, continue to define the Threshold sensitivity. The metric chart will display the calculated thresholds based on recent data. [Learn more about Dynamic Thresholds condition type and sensitivity options](../../azure-monitor/alerts/alerts-dynamic-thresholds.md).

10. Refine the condition by adjusting **Aggregation granularity (Period)** interval over which data points are grouped using the aggregation type function (ex. "Lookback period 30 minutes"), and **Frequency** (ex "Check every 15 Minutes").

11. Select **Done** when complete.
12. Add an action group. An action group is a collection of notification preferences defined by the owner of an Azure subscription. Within the **Action Groups** section, choose **Select action group** to select an already existing action group to attach to the alert rule.
    - You can also create a new action group to receive notifications on the alert. For more information, see [create and manage action group](../../azure-monitor/alerts/action-groups.md).
    - To create a new action group, choose **+ Create action group**. Fill out the **create action group** form with a **subscription**, **resource group**, **action group name** and **display name**.
    -	Configure **Notifications** for action group.

    In **Notification type**, choose **Email Azure Resource Manager Role** to select subscription Owners, Contributors, and Readers to receive notifications. Choose the **Azure Resource Manager Role** for sending the email. You can also choose **Email/SMS message/Push/Voice** to send notifications to specific recipients. Provide **Name** to the notification type and select **Review + Create** when completed.

13. Fill in **Alert rule details** like **severity**, **alert rule name** and **description**.
14. Select **Create alert rule** to create the alert.
15. Within a few minutes, the alert is active and triggers as previously described.

## Monitor multiple resources

Azure Database for PostgreSQL Flexible server also supports multi-resource metric alert rule. You can monitor at scale by applying the same metric alert rule to multiple Flexible server instances in the same Azure region. Individual notifications are sent for each monitored resource.

To [set up a new metric alert rule](../../azure-monitor/alerts/alerts-create-new-alert-rule.md), in the alert rule creation experience, in Scope definition (step 5.)  from the previous section use the checkboxes to select all the Azure PostgreSQL Flexible Server instances you want the rule to be applied to. 

> [!IMPORTANT]
> The resources you select must be within the same resource type, location, and subscription. Resources that do not fit these criteria are not selectable.

You can also use [Azure Resource Manager templates](../../azure-monitor/alerts/alerts-create-new-alert-rule.md#create-a-new-alert-rule-using-an-arm-template) to deploy multi-resource metric alerts. To learn more about multi-resource alerts, refer our blog [Scale Monitoring with Azure PostgreSQL Multi-Resource Alert](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/scale-monitoring-with-azure-postgresql-multi-resource-alerts/ba-p/3866526).

## Manage your alerts

Once you have created an alert, you can select it and do the following actions:

* View a graph showing the metric threshold and the actual values from the previous day relevant to this alert.
* **Edit** or **Delete** the alert rule.
* **Disable** or **Enable** the alert, if you want to temporarily stop or resume receiving notifications.

## Next steps

* Learn more about [setting alert on metrics](../../azure-monitor/alerts/alerts-create-new-alert-rule.md).
* Learn more about [monitoring metrics available in Azure Database for PostgreSQL - Flexible Server](./concepts-monitoring.md).
* [Understand how metric alerts work in Azure Monitor](../../azure-monitor/alerts/alerts-types.md).
* [Scale Monitoring with Azure PostgreSQL Multi-Resource Alerts](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/scale-monitoring-with-azure-postgresql-multi-resource-alerts/ba-p/3866526).
