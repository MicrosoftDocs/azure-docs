---
title: Configure alerts - Azure portal -  Azure Database for PostgreSQL - Single Server
description: This article describes how to configure and access metric alerts for Azure Database for PostgreSQL - Single Server from the Azure portal.
ms.service: postgresql
ms.subservice: single-server
ms.topic: how-to
ms.author: sunila
author: sunilagarwal
ms.date: 06/24/2022
---

# Use the Azure portal to set up alerts on metrics for Azure Database for PostgreSQL - Single Server

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

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

   :::image type="content" source="./media/how-to-alert-on-metric/2-alert-rules.png" alt-text="Select Alert Rules":::

3. Select **Add metric alert** (+ icon).

4. The **Create rule** page opens as shown below. Fill in the required information:

   :::image type="content" source="./media/how-to-alert-on-metric/4-add-rule-form.png" alt-text="Add metric alert form":::

5. Within the **Condition** section, select **Add condition**.

6. Select a metric from the list of signals to be alerted on. In this example, select "Storage percent".

   :::image type="content" source="./media/how-to-alert-on-metric/6-configure-signal-logic.png" alt-text="Select metric":::

7. Configure the alert logic including the **Condition** (ex. "Greater than"), **Threshold** (ex. 85 percent), **Time Aggregation**, **Period** of time the metric rule must be satisfied before the alert triggers (ex. "Over the last 30 minutes"), and **Frequency**.

   Select **Done** when complete.

   :::image type="content" source="./media/how-to-alert-on-metric/7-set-threshold-time.png" alt-text="Screenshot that highlights the Alert logic section and the Done button.":::

8. Within the **Action Groups** section, select **Create New** to create a new group to receive notifications on the alert.

9. Fill out the "Add action group" form with a name, short name, subscription, and resource group.

10. Configure an **Email/SMS/Push/Voice** action type.

    Choose "Email Azure Resource Manager Role" to select subscription Owners, Contributors, and Readers to receive notifications.

    Optionally, provide a valid URI in the **Webhook** field if you want it called when the alert fires.

    Select **OK** when completed.

    :::image type="content" source="./media/how-to-alert-on-metric/10-action-group-type.png" alt-text="Screenshot that shows how to add a new action group.":::

11. Specify an Alert rule name, Description, and Severity.

    :::image type="content" source="./media/how-to-alert-on-metric/11-name-description-severity.png" alt-text="Action group":::

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
