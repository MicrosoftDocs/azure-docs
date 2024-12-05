---
title: Configure and manage Azure Monitor based alert notifications for Azure Backup
description: Learn how to configure Azure Monitor alert notifications.
ms.topic: how-to
ms.date: 12/30/2024
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
ms.custom: engagement-fy24
---

# Configure alert notifications for Azure Backup

This article describes how to configure and manage Azure Monitor based alert notifications for Azure Backup. You can use these alerts to monitor the health of your backup items and take corrective actions when needed.

## Configure notifications for alerts

To configure notifications for Azure Monitor alerts, create an [alert processing rule](/azure/azure-monitor/alerts/alerts-action-rules). To create an alert processing rule (earlier called *action rule*) to send email notifications to a given email address, follow these steps. Also, follow these steps to route these alerts to other notification channels, such as ITSM, webhook, logic app, and so on.

1. In the [Azure portal](https://portal.azure.com/), go to **Business Continuity Center** > **Monitoring + Reporting** > **Alerts** to create or view alert processing rules. [Learn more](/azure/azure-monitor/alerts/alerts-processing-rules?tabs=portal&branch=main#configure-an-alert-processing-rule).

1. Send alerts to the notification channel of your choice using action groups as part of the alert processing rules. Learn [how to create action groups](/azure/azure-monitor/alerts/action-groups#create-an-action-group-in-the-azure-portal).

## Suppress notifications during a planned maintenance window

For certain scenarios, you might want to suppress notifications for a particular window of time when backups are going to fail. This is especially important for database backups, where log backups could happen as frequently as every 15 minutes, and you don't want to receive a separate notification every 15 minutes for each failure occurrence. In such a scenario, you can create a second alert processing rule that exists alongside the main alert processing rule used for sending notifications. The second alert processing rule won't be linked to an action group, but is used to specify the time for notification types that should be suppressed.

By default, the suppression alert processing rule takes priority over the other alert processing rule. If a single fired alert is affected by different alert processing rules of both types, the action groups of that alert will be suppressed.
Learn more [about suppression of notifications during planned maintenance
](/azure/azure-monitor/alerts/alerts-processing-rules?tabs=portal#suppress-notifications-during-planned-maintenance).


To create a suppression alert processing rule, follow these steps:

1. Go to **Business Continuity Center** > **Monitoring + Reporting** > **Alerts**.
1. Select **Manage alerts** > **Manage alert processing rules**.

   :::image type="content" source="./media/move-to-azure-monitor-alerts/alert-processing-rule-blade-inline.png" alt-text="Screenshot showing alert processing rules blade in portal." lightbox="./media/move-to-azure-monitor-alerts/alert-processing-rule-blade-expanded.png":::

1. Select **Create**.

   :::image type="content" source="./media/move-to-azure-monitor-alerts/alert-processing-rule-create.png" alt-text="Screenshot showing creation of new alert processing rule.":::

1. Select **Scope**, for example, subscription or resource group, that the alert processing rule should span.

   You can also select more granular filters if you want to suppress notifications only for a particular backup item. For example, if you want to suppress notifications for *testdb1* database in the Virtual Machine *VM1*, you can specify filters "where Alert Context (payload) contains `/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/testRG/providers/Microsoft.Compute/virtualMachines/VM1/providers/Microsoft.RecoveryServices/backupProtectedItem/SQLDataBase;MSSQLSERVER;testdb1`".
   
   To get the required format of your required backup item, see the *SourceId field* from the [Alert details page](backup-azure-monitoring-alerts.md#view-fired-alerts-in-the-azure-portal).

   :::image type="content" source="./media/move-to-azure-monitor-alerts/alert-processing-rule-scope.png" alt-text="Screenshot showing specified scope of alert processing rule.":::

1. Under **Rule Settings**, select **Suppress notifications**.

   :::image type="content" source="./media/move-to-azure-monitor-alerts/alert-processing-rule-settings.png" alt-text="Screenshot showing alert processing rule settings.":::

1. Under **Scheduling**, select the window of time for which the alert processing rule will apply.

   :::image type="content" source="./media/move-to-azure-monitor-alerts/alert-processing-rule-schedule.png" alt-text="Screenshot showing alert processing rules scheduling.":::

1. Under **Details**, specify the subscription, resource group, and name under that the alert processing rule should be created.

   :::image type="content" source="./media/move-to-azure-monitor-alerts/alert-processing-rule-details.png" alt-text="Screenshot showing alert processing rules details.":::

1. Select **Review+Create**.

   If your suppression windows are one-off scenarios and not recurring, you can **Disable** the alert processing rule once you don't need it anymore. You can enable it again in future when you have a new maintenance window in the future.

## Configure alerts and notifications on your metrics

To configure alerts and notifications on your metrics, follow these steps:

1. Click **New Alert Rule** at the top of the metric charts.

1. Select the scope for which you want to create alerts.   <br><br>    The scope limits are the same as the limits described in the [View metrics](metrics-overview.md#view-metrics-in-the-azure-portal) section.

1. Select the condition on which the alert should be fired.

   - By default, some fields are pre-populated based on the selections in the metric chart. You can edit the parameters as needed.
   - Choose the threshold type and value to set the trigger condition for the alert. Learn more [about the alert conditions for alert rules](/azure/azure-monitor/alerts/alerts-create-metric-alert-rule).
   - To generate individual alerts for each datasource in the vault, use the **dimensions** selection in the metric alerts rule. Following are some scenarios:

   - Firing alerts on failed backup jobs for each datasource:

     **Alert Rule: Fire an alert if Backup Health Events > 0 in the last 24 hours for**:
     - Dimensions["HealthStatus"]= “Persistent Unhealthy / Transient Unhealthy”
     - Dimensions["DatasourceId"]= “All current and future values”

   - Firing alerts if all backups in the vault were successful for the day:

     **Alert Rule: Fire an alert if Backup Health Events < 1 in the last 24 hours for**:
     - Dimensions["HealthStatus"]="Persistent Unhealthy / Transient Unhealthy / Persistent Degraded / Transient Degraded"

   :::image type="content" source="./media/metrics-overview/metric-alert-condition-inline.png" alt-text="Screenshot showing the option to select the condition on which the alert should be fired." lightbox="./media/metrics-overview/metric-alert-condition-expanded.png":::

   >[!NOTE]
   >If you select more dimensions as part of the alert rule condition, the cost increases (that's proportional to the number of unique combinations of dimension values possible). Selection of more dimensions allows you to get more context on a fired alert.


1. To configure notifications for these alerts using Action Groups, configure an Action Group as part of the alert rule, or create a separate action rule.

   We support various notification channels, such as email, ITSM, webhook, Logic App, SMS. [Learn more about Action Groups](/azure/azure-monitor/alerts/action-groups).

   :::image type="content" source="./media/metrics-overview/action-group-inline.png" alt-text="Screenshot showing the process to configure notifications for these alerts using Action Groups." lightbox="./media/metrics-overview/action-group-expanded.png":::

1. Configure auto-resolution behavior - You can configure metric alerts as _stateless_ or _stateful_ as required.

   - To generate an alert on every job failure irrespective of the failure is due to the same underlying cause (stateless behavior), deselect the **Automatically resolve alerts** option in the alert rule.
   - Alternately, to configure the alerts as stateful, select the same checkbox. Therefore, when a metric alert is fired on the scope, another failure won't create a new metric alert. The alert gets auto-resolved if the alert generation condition evaluates to false for three successive evaluation cycles. New alerts are generated if the condition evaluates to true again.

[Learn more about stateful and stateless behavior of Azure Monitor metric alerts](/azure/azure-monitor/alerts/alerts-troubleshoot-metric#the-metric-alert-is-not-triggered-every-time-the-condition-is-met).

:::image type="content" source="./media/metrics-overview/auto-resolve-alert-inline.png" alt-text="Screenshot showing the process to configure auto-resolution behavior." lightbox="./media/metrics-overview/auto-resolve-alert-expanded.png":::

## Next steps
Learn more about [Azure Backup monitoring and reporting](monitoring-and-alerts-overview.md).