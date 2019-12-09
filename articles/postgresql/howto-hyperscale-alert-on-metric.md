---
title: Configure metrics alerts for Azure Database for PostgreSQL - Hyperscale (Citus)
description: This article describes how to configure and access metric alerts for Azure Database for PostgreSQL - Hyperscale (Citus)
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.topic: conceptual
ms.date: 11/04/2019
---

# Use the Azure portal to set up alerts on metrics for Azure Database for PostgreSQL - Hyperscale (Citus)

This article shows you how to set up Azure Database for PostgreSQL alerts using the Azure portal. You can receive an alert based on monitoring metrics for your Azure services.

We'll set up an alert to trigger when the value of a specified metric crosses a threshold. The alert triggers when the condition is first met, and continues to trigger afterwards.

You can configure an alert to do the following actions when it triggers:
* Send email notifications to the service administrator and coadministrators.
* Send email to additional emails that you specify.
* Call a webhook.

You can configure and get information about alert rules using:
* [Azure portal](../azure-monitor/platform/alerts-metric.md#create-with-azure-portal)
* [Azure CLI](../azure-monitor/platform/alerts-metric.md#with-azure-cli)
* [Azure Monitor REST API](https://docs.microsoft.com/rest/api/monitor/metricalerts)

## Create an alert rule on a metric from the Azure portal
1. In the [Azure portal](https://portal.azure.com/), select the Azure Database for PostgreSQL server you want to monitor.

2. Under the **Monitoring** section of the sidebar, select **Alerts** as shown:

   ![Select Alert Rules](./media/howto-hyperscale-alert-on-metric/2-alert-rules.png)

3. Select **New alert rule** (+ icon).

4. The **Create rule** page opens as shown below. Fill in the required information:

   ![Add metric alert form](./media/howto-hyperscale-alert-on-metric/4-add-rule-form.png)

5. Within the **Condition** section, select **Add**.

6. Select a metric from the list of signals to be alerted on. In this example, select "Storage percent".
   
   ![Select metric](./media/howto-hyperscale-alert-on-metric/6-configure-signal-logic.png)

7. Configure the alert logic:

    * **Operator** (ex. "Greater than")
    * **Threshold value** (ex. 85 percent)
    * **Aggregation granularity** amount of time the metric rule must be satisfied before the alert triggers (ex. "Over the last 30 minutes")
    * and **Frequency of evaluation** (ex. "1 minute")
   
   Select **Done** when complete.

   ![Select metric](./media/howto-hyperscale-alert-on-metric/7-set-threshold-time.png)

8. Within the **Action Groups** section, select **Create New** to create a new group to receive notifications on the alert.

9. Fill out the "Add action group" form with a name, short name, subscription, and resource group.

    ![Action group](./media/howto-hyperscale-alert-on-metric/9-add-action-group.png)

10. Configure an **Email/SMS/Push/Voice** action type.
    
    Choose "Email Azure Resource Manager Role" to send notifications to subscription owners, contributors, and readers.
   
    Select **OK** when completed.

    ![Action group](./media/howto-hyperscale-alert-on-metric/10-action-group-type.png)

11. Specify an Alert rule name, Description, and Severity.

    ![Action group](./media/howto-hyperscale-alert-on-metric/11-name-description-severity.png) 

12. Select **Create alert rule** to create the alert.

    Within a few minutes, the alert is active and triggers as previously described.

## Manage your alerts

Once you've created an alert, you can select it and do the following actions:

* View a graph showing the metric threshold and the actual values from the previous day relevant to this alert.
* **Edit** or **Delete** the alert rule.
* **Disable** or **Enable** the alert, if you want to temporarily stop or resume receiving notifications.

## Next steps
* Learn more about [configuring webhooks in alerts](../azure-monitor/platform/alerts-webhooks.md).
* Get an [overview of metrics collection](../monitoring-and-diagnostics/insights-how-to-customize-monitoring.md) to make sure your service is available and responsive.
