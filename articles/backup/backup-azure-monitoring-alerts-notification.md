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

1. Go to **Backup center** in the Azure portal.

1. Select **Alerts** from the menu and select **Alert processing rules**.

   :::image type="content" source="./media/backup-azure-monitoring-laworkspace/backup-center-manage-alert-processing-rules-inline.png" alt-text="Screenshot for Manage Actions in Backup center." lightbox="./media/backup-azure-monitoring-laworkspace/backup-center-manage-alert-processing-rules-expanded.png":::

1. Select **Create**.

   :::image type="content" source="./media/backup-azure-monitoring-laworkspace/backup-center-create-alert-processing-rule.png" alt-text="Screenshot for creating a new action rule.":::

1. Select the scope for which the alert processing rule should be applied.

   You can apply the rule for all resources within a subscription. Optionally, you can also apply filters on the alerts; for example, to only generate notifications for alerts of a certain severity.

   :::image type="content" source="./media/backup-azure-monitoring-laworkspace/alert-processing-rule-scope-inline.png" alt-text="Screenshot for setting the action rule scope." lightbox="./media/backup-azure-monitoring-laworkspace/alert-processing-rule-scope-expanded.png":::

1. Under **Rule Settings**, create an action group (or use an existing one).

   An action group is the destination to which the notification for an alert should be sent. For example, an email address.
 
   :::image type="content" source="media/backup-azure-monitoring-laworkspace/create-action-group.png" alt-text="Screenshot for creating a new action group.":::

1. On the **Basics** tab, select the name of the action group, the subscription, and resource group under which it should be created.

    :::image type="content" source="media/backup-azure-monitoring-laworkspace/azure-monitor-action-groups-basic.png" alt-text="Screenshot for basic properties of action group."::: 

1. On the **Notifications** tab, select **Email/SMS message/Push/Voice** and enter the recipient email ID.

    :::image type="content" source="media/backup-azure-monitoring-laworkspace/azure-monitor-email.png" alt-text="Screenshot for setting notification properties."::: 

1. Select **Review+Create** -> **Create** to deploy the action group.

1. Save the action rule.

[Learn more](/azure/azure-monitor/alerts/alerts-action-rules) about Action Rules in Azure Monitor.

## Suppress notifications during a planned maintenance window

For certain scenarios, you might want to suppress notifications for a particular window of time when backups are going to fail. This is especially important for database backups, where log backups could happen as frequently as every 15 minutes, and you don't want to receive a separate notification every 15 minutes for each failure occurrence. In such a scenario, you can create a second alert processing rule that exists alongside the main alert processing rule used for sending notifications. The second alert processing rule won't be linked to an action group, but is used to specify the time for notification types that should be suppressed.

By default, the suppression alert processing rule takes priority over the other alert processing rule. If a single fired alert is affected by different alert processing rules of both types, the action groups of that alert will be suppressed.

To create a suppression alert processing rule, follow these steps:

1. Go to **Business Continuity Center** > **Monitoring + Reporting** > **Alerts**.
1. Select **Manage alerts** > **Manage alert processing rules**.

   :::image type="content" source="./media/move-to-azure-monitor-alerts/alert-processing-rule-blade-inline.png" alt-text="Screenshot showing alert processing rules blade in portal." lightbox="./media/move-to-azure-monitor-alerts/alert-processing-rule-blade-expanded.png":::

1. Select **Create**.

   :::image type="content" source="./media/move-to-azure-monitor-alerts/alert-processing-rule-create.png" alt-text="Screenshot showing creation of new alert processing rule.":::

1. Select **Scope**, for example, subscription or resource group, that the alert processing rule should span.

   You can also select more granular filters if you want to suppress notifications only for a particular backup item. For example, if you want to suppress notifications for *testdb1* database in the Virtual Machine *VM1*, you can specify filters "where Alert Context (payload) contains `/subscriptions/00000000-0000-0000-0000-0000000000000/resourceGroups/testRG/providers/Microsoft.Compute/virtualMachines/VM1/providers/Microsoft.RecoveryServices/backupProtectedItem/SQLDataBase;MSSQLSERVER;testdb1`".
   
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

## Next steps
Learn more about [Azure Backup monitoring and reporting](monitoring-and-alerts-overview.md).