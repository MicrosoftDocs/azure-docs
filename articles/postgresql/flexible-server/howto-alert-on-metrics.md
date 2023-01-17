---
title: Configure alerts - Azure portal - Azure Database for PostgreSQL - Flexible Server
description: This article describes how to configure and access metric alerts for Azure Database for PostgreSQL - Flexible Server from the Azure portal.
ms.author: sunila
author: sunilagarwal
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.date: 11/30/2021
---

# Use the Azure portal to set up alerts on metrics for Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This article shows you how to set up Azure Database for PostgreSQL alerts using the Azure portal. You can receive an alert based on monitoring metrics for your Azure services.

The alert triggers when the value of a specified metric crosses a threshold you assign. The alert triggers both when the condition is first met, and then afterwards when that condition is no longer being met.

You can configure an alert to do the following actions when it triggers:

* Send email notifications to the service administrator and co-administrators.
* Send email to additional emails that you specify.
* Call a webhook.

You can configure and get information about alert rules using:

* [Azure portal](../../azure-monitor/alerts/alerts-metric.md#create-with-azure-portal)
* [Azure CLI](../../azure-monitor/alerts/alerts-metric.md#with-azure-cli)
* [Azure Monitor REST API](/rest/api/monitor/metricalerts)

## Create an alert rule on a metric from the Azure portal

1. In the [Azure portal](https://portal.azure.com/), select the Azure Database for PostgreSQL server you want to monitor.

2. Under the **Monitoring** section of the sidebar, select **Alerts** as shown:

   :::image type="content" source="./media/howto-alert-on-metrics/2-alert-rules.png" alt-text="Select Alert Rules":::

3. Select **Add metric alert** (+ icon).

4. The **Create rule** page opens as shown below. Fill in the required information:

   :::image type="content" source="./media/howto-alert-on-metrics/4-add-rule-form.png" alt-text="Add metric alert form":::

5. Within the **Condition** section, select **Add condition**.

6. Select a metric from the list of signals to be alerted on. In this example, select "Storage percent".

   :::image type="content" source="./media/howto-alert-on-metrics/6-configure-signal-logic.png" alt-text="Select metric":::

7. Configure the alert logic including the **Condition** (ex. "Greater than"), **Threshold** (ex. 85 percent), **Time Aggregation**, **Period** of time the metric rule must be satisfied before the alert triggers (ex. "Over the last 30 minutes"), and **Frequency**.

   Select **Done** when complete.

   :::image type="content" source="./media/howto-alert-on-metrics/7-set-threshold-time.png" alt-text="Set threshold":::

8. Within the **Action Groups** section, select **Create New** to create a new group to receive notifications on the alert.

9. Fill out the "Add action group" form with a name, short name, subscription, and resource group.

10. Configure an **Email/SMS/Push/Voice** action type.

    1. Choose "Email Azure Resource Manager Role" to select subscription Owners, Contributors, and Readers to receive notifications.

    2. Optionally, provide a valid URI in the **Webhook** field if you want it called when the alert fires.

    3. Select **OK** when completed.

    :::image type="content" source="./media/howto-alert-on-metrics/10-action-group-type.png" alt-text="Action group":::

11. Specify an Alert rule name, Description, and Severity.

    :::image type="content" source="./media/howto-alert-on-metrics/11-name-description-severity.png" alt-text="Specify, name description and severity"::: 

12. Select **Create alert rule** to create the alert.

    Within a few minutes, the alert is active and triggers as previously described.

## Manage your alerts

Once you have created an alert, you can select it and do the following actions:

* View a graph showing the metric threshold and the actual values from the previous day relevant to this alert.
* **Edit** or **Delete** the alert rule.
* **Disable** or **Enable** the alert, if you want to temporarily stop or resume receiving notifications.

## Next steps

* Learn more about [configuring webhooks in alerts](../../azure-monitor/alerts/alerts-webhooks.md).
* Get an [overview of metrics collection](../../azure-monitor/data-platform.md) to make sure your service is available and responsive.