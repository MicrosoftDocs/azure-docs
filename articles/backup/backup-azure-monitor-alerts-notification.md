---
title: Configure and manage Azure Monitor based alert notifications for Azure Backup
description: Learn how to configure Azure Monitor alert notifications.
ms.topic: how-to
ms.date: 04/08/2026
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.custom: engagement-fy24
# Customer intent: "As an IT administrator managing backup services, I want to configure alert notifications for Azure Monitor, so that I can efficiently monitor backup health and respond promptly to issues."
---

# Configure alert notifications for Azure Backup

This article describes how to configure and manage Azure Monitor based alert notifications for Azure Backup. You can use these alerts to monitor the health of your backup items and take corrective actions when needed.

## Configure notifications for alerts

To configure notifications for Azure Monitor alerts, create an [alert processing rule](/azure/azure-monitor/alerts/alerts-action-rules). To create an alert processing rule (earlier called *action rule*) to send email notifications to a given email address, follow these steps. Also, follow these steps to route these alerts to other notification channels, such as ITSM, webhook, logic app, and so on.

1. In the [Azure portal](https://portal.azure.com/), go to **Resiliency** > **Monitoring + Reporting** > **Alerts** to create or view alert processing rules. [Learn more](/azure/azure-monitor/alerts/alerts-processing-rules?tabs=portal&branch=main#configure-an-alert-processing-rule).

1. Send alerts to the notification channel of your choice using action groups as part of the alert processing rules. Learn [how to create action groups](/azure/azure-monitor/alerts/action-groups#create-an-action-group-in-the-azure-portal).

>[!Note]
>To send notifications for an alert to multiple email addresses, you can select multiple **email** notifications during the action group configuration.

## Suppress notifications during a planned maintenance window

For certain scenarios, you might want to suppress notifications for a particular window of time when backups are going to fail. This is especially important for database backups, where log backups could happen as frequently as every 15 minutes, and you don't want to receive a separate notification every 15 minutes for each failure occurrence. In such a scenario, you can create a second alert processing rule that exists alongside the main alert processing rule used for sending notifications. The second alert processing rule isn't linked to an action group, but is used to specify the time for notification types that should be suppressed.

By default, the suppression alert processing rule takes priority over the other alert processing rule. If a single fired alert is affected by different alert processing rules of both types, the action groups of that alert are suppressed.
Learn more [about suppression of notifications during planned maintenance
](/azure/azure-monitor/alerts/alerts-processing-rules?tabs=portal#suppress-notifications-during-planned-maintenance).


To create a suppression alert processing rule, follow these steps:

1. Go to **Resiliency** and select **Monitoring + Reporting** > **Alerts**.
1. Select **Manage alerts** > **Manage alert processing rules**.

   :::image type="content" source="./media/move-to-azure-monitor-alerts/alert-processing-rule-blade.png" alt-text="Screenshot that shows the alert pane in the Azure portal." lightbox="./media/move-to-azure-monitor-alerts/alert-processing-rule-blade.png":::

1. On the **Alert processing rules** pane, select **+ Create**.

   :::image type="content" source="./media/move-to-azure-monitor-alerts/alert-processing-rule-create.png" alt-text="Screenshot that shows the creation of new alert processing rule." lightbox="./media/move-to-azure-monitor-alerts/alert-processing-rule-create.png":::

1. On the **Create an alert processing rule** pane, on the **Scope** tab, click **+ Select scope**, for example, subscription or resource group, that the alert processing rule should span.

   You can also select more granular filters if you want to suppress notifications only for a particular backup item. For example, if you want to suppress notifications for *testdb1* database in the Virtual Machine *VM1*, you can specify filters "where Alert Context (payload) contains `/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/testRG/providers/Microsoft.Compute/virtualMachines/VM1/providers/Microsoft.RecoveryServices/backupProtectedItem/SQLDataBase;MSSQLSERVER;testdb1`."
   
   To get the required format of your required backup item, see the *SourceId field* from the [Alert details page](backup-azure-monitoring-alerts.md#view-fired-alerts-in-the-azure-portal).

   :::image type="content" source="./media/move-to-azure-monitor-alerts/alert-processing-rule-scope.png" alt-text="Screenshot that shows the specified scope of the alert processing rule." lightbox="./media/move-to-azure-monitor-alerts/alert-processing-rule-scope.png":::

1. On the **Rule settings** tab, select **Suppress notifications**.

   :::image type="content" source="./media/move-to-azure-monitor-alerts/alert-processing-rule-settings.png" alt-text="Screenshot that shows the alert processing rule settings." lightbox="./media/move-to-azure-monitor-alerts/alert-processing-rule-settings.png":::

1. On the **Scheduling** tab, select the window of time for which the alert processing rule needs to apply.

   :::image type="content" source="./media/move-to-azure-monitor-alerts/alert-processing-rule-schedule.png" alt-text="Screenshot that shows the alert processing rules scheduling." lightbox="./media/move-to-azure-monitor-alerts/alert-processing-rule-schedule.png":::

1. On the **Details** tab, specify the subscription, resource group, and name under which the alert processing rule should be created.

   :::image type="content" source="./media/move-to-azure-monitor-alerts/alert-processing-rule-details.png" alt-text="Screenshot that shows the alert processing rules details." lightbox="./media/move-to-azure-monitor-alerts/alert-processing-rule-details.png":::

1. Select **Review + create** and complete the creation of the suppression alert processing rule.

   If your suppression windows are one-off scenarios and not recurring, you can **Disable** the alert processing rule once you don't need it anymore. You can enable it again in future when you have a new maintenance window in the future.

## Configure alerts and notifications on your metrics

To configure alerts and notifications on your metrics, follow these steps:

1. Go to **Resiliency** and select **Monitoring + Reporting** > **Alerts**.

   :::image type="content" source="./media/move-to-azure-monitor-alerts/create-alert-rule.png" alt-text="Screenshot that shows how to create an alert rule." lightbox="./media/move-to-azure-monitor-alerts/create-alert-rule.png":::

1. On the **Alerts** pane, select  **+ Create** > **Create alert rule**.

1. On the **Create an alert rule** pane, on the **Scope** tab, click **+ Select scope** to choose the scope for which you want to create alerts.

   The scope limits are the same as the limits described in the [View metrics](metrics-overview.md#view-metrics-in-the-azure-portal) section.

   :::image type="content" source="./media/move-to-azure-monitor-alerts/grant-scope.png" alt-text="Screenshot that shows how to select the scope for the alert rule." lightbox="./media/move-to-azure-monitor-alerts/grant-scope.png":::

1. On the **Condition** tab, for **Signal name**, select the condition  from the dropdown menu on which the alert should be fired.

   - By default, some fields are prepopulated based on the selections in the metric chart. You can edit the parameters as needed.
   - Choose the threshold type and value to set the trigger condition for the alert. Learn more [about the alert conditions for alert rules](/azure/azure-monitor/alerts/alerts-create-metric-alert-rule).
   - To generate individual alerts for each datasource in the vault, use the **dimensions** selection in the metric alerts rule. Following are some scenarios:
   - Firing alerts on failed backup jobs for each datasource:

     **Alert Rule: Fire an alert if Backup Health Events > 0 in the last 24 hours for**:
     - Dimensions["HealthStatus"]= “Persistent Unhealthy / Transient Unhealthy”
     - Dimensions["DatasourceId"]= “All current and future values”

   - Firing alerts if all backups in the vault were successful for the day:

     **Alert Rule: Fire an alert if Backup Health Events < 1 in the last 24 hours for**:
     - Dimensions["HealthStatus"]="Persistent Unhealthy / Transient Unhealthy / Persistent Degraded / Transient Degraded"

   :::image type="content" source="./media/move-to-azure-monitor-alerts/assign-signal.png" alt-text="Screenshot that shows the alert condition signal assignment." lightbox="./media/move-to-azure-monitor-alerts/assign-signal.png":::

   >[!NOTE]
   >If you select more dimensions as part of the alert rule condition, the cost increases (that's proportional to the number of unique combinations of dimension values possible). Selection of more dimensions allows you to get more context on a fired alert.

1. On the **Actions** tab, for **Select actions**, choose the required action type.

   To configure notifications for the alerts using Action Groups, on the **Select action groups** pane, select an Action Group as part of the alert rule, or create a separate action rule.

   Azure Backup supports various notification channels, such as email, ITSM, webhook, Logic App, SMS. [Learn more about Action Groups](/azure/azure-monitor/alerts/action-groups).

   :::image type="content" source="./media/move-to-azure-monitor-alerts/assign-action-group.png" alt-text="Screenshot that shows how to select an action group for the alert rule." lightbox="./media/move-to-azure-monitor-alerts/assign-action-group.png":::

1. On the **Details** tab, enter **Alert rule name**.

   :::image type="content" source="./media/move-to-azure-monitor-alerts/name-alert-rule.png" alt-text="Screenshot that shows how to enter the alert rule name." lightbox="./media/move-to-azure-monitor-alerts/name-alert-rule.png":::

1. On the **Tags** tab, provide the required tags.

1. On the **Review + create** tab, select **Review + create** > **Create** and complete the metrics configuration.

[Learn more about stateful and stateless behavior of Azure Monitor metric alerts](/azure/azure-monitor/alerts/alerts-troubleshoot-metric#the-metric-alert-is-not-triggered-every-time-the-condition-is-met).


## Next steps
Learn more about [Azure Backup monitoring and reporting](monitoring-and-alerts-overview.md).