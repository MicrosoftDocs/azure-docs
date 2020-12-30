---
title: Configure metric alerts - Azure portal - Azure Database for MySQL - Flexible Server
description: This article describes how to configure and access metric alerts for Azure Database for MySQL Flexible Server from the Azure portal.
author: ambhatna
ms.author: ambhatna
ms.service: mysql
ms.topic: how-to
ms.date: 9/21/2020
---

# Use the Azure portal to set up alerts on metrics for Azure Database for MySQL - Flexible Server 

> [!IMPORTANT] 
> Azure Database for MySQL - Flexible Server is currently in public preview.

This article shows you how to set up Azure Database for MySQL alerts using the Azure portal. You can receive an alert based on monitoring metrics for your Azure services.

The alert triggers when the value of a specified metric crosses a threshold you assign. The alert triggers both when the condition is first met, and then afterwards when that condition is no longer being met. Metric alerts are stateful, that is, they only send out notifications when the state changes.

You can configure an alert to do the following actions when it triggers:
* Send email notifications to the service administrator and co-administrators
* Send email to additional emails that you specify.
* Call a webhook

You can configure and get information about alert rules using:
* [Azure portal](../../azure-monitor/platform/alerts-metric.md#create-with-azure-portal)
* [Azure CLI](../../azure-monitor/platform/alerts-metric.md#with-azure-cli)
* [Azure Monitor REST API](/rest/api/monitor/metricalerts)

## Create an alert rule on a metric from the Azure portal
1. In the [Azure portal](https://portal.azure.com/), select the Azure Database for MySQL flexible server you want to monitor.
2. Under the **Monitoring** section of the sidebar, select **Alerts**.
3. Select **+ New alert rule**.
4. The **Create rule** page opens. Fill in the required information:
5. Within the **Condition** section, choose **Select condition**.
6. You will see a list of supported signals, select the metric you want to create an alert on. For example, select "Storage percent".
7. You will see a chart for the metric for the last six hours. Use the **Chart period** dropdown to select to see longer history for the metric.
8. Select the **Threshold** type (ex. "Static" or "Dynamic"), **Operator** (ex. "Greater than"), and **Aggregation type** (ex. average). This will determine the logic that the metric alert rule will evaluate.
    - If you are using a **Static** threshold, continue to define a **Threshold value** (ex. 85 percent). The metric chart can help determine what might be a reasonable threshold.
    - If you are using a **Dynamic** threshold, continue to define the **Threshold sensitivity**. The metric chart will display the calculated thresholds based on recent data. [Learn more about Dynamic Thresholds condition type and sensitivity options](../../azure-monitor/platform/alerts-dynamic-thresholds.md).
9. Refine the condition by adjusting **Aggregation granularity (Period)** interval over which data points are grouped using the aggregation type function (ex. "30 minutes"), and **Frequency** (ex "Every 15 Minutes").
10. Click **Done**.
11. Add an action group. An action group is a collection of notification preferences defined by the owner of an Azure subscription. Within the **Action Groups** section, choose **Select action group** to select an already existing action group to attach to the alert rule.
12. You can also create a new action group to receive notifications on the alert. Refer to [create and manage action group](../../azure-monitor/platform/action-groups.md) for more information.
13. To create a new action group, choose **+ Create action group**. Fill out the "Create action group" form with a **Subscription**, **Resource group**, **Action group name** and **Display Name**.
14. Configure **Notifications** for action group.
    
    In **Notification type**, choose "Email Azure Resource Manager Role" to select subscription Owners, Contributors, and Readers to receive notifications. Choose the **Azure Resource Manager Role** for sending the email.
    You can also choose **Email/SMS message/Push/Voice** to send notifications to specific recipients.

    Provide **Name** to the notification type and select **Review + Create** when completed.

    <!--:::image type="content" source="./media/howto-alert-on-metric/10-action-group-type.png" alt-text="Action group":::-->
    
15. Fill in **Alert rule details** like **Alert rule name**, **Description**, **Save alert rule to resource group** and **Severity**.

    <!--:::image type="content" source="./media/howto-alert-on-metric/11-name-description-severity.png" alt-text="Action group":::-->

16. Select **Create alert rule** to create the alert.
    Within a few minutes, the alert is active and triggers as previously described.
## Manage your alerts
Once you have created an alert, you can select it and do the following actions:

* View a graph showing the metric threshold and the actual values from the previous day relevant to this alert.
* **Edit** or **Delete** the alert rule.
* **Disable** or **Enable** the alert, if you want to temporarily stop or resume receiving notifications.


## Next steps
- Learn more about [setting alert on metrics](../../azure-monitor/platform/alerts-metric.md).
- Learn more about available [metrics in Azure Database for MySQL Flexible Server](./concepts-monitoring.md).
- [Understand how metric alerts work in Azure Monitor](../../azure-monitor/platform/alerts-metric-overview.md)