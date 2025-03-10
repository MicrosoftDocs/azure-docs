---
title: Tutorial - Monitor alerts and metrics in Azure Business Continuity Center
description: In this tutorial, learn how to monitor alerts and configure notifications for your business continuity estate using Azure Business Continuity center.
ms.topic: tutorial
ms.date: 12/30/2024
ms.service: azure-business-continuity-center
ms.custom:
  - ignite-2023
  - ignite-2024
author: jyothisuri
ms.author: jsuri
---

# Tutorials: Monitor alerts and metrics for your business continuity estate


This tutorial describes how Azure Business Continuity Center allows you to view alerts across Azure Backup and Azure Site Recovery, configure notifications, view metrics, and take appropriate action. 

## Monitor alerts

Azure Business Continuity Center allows you to monitor alerts that are raised for your critical events in your backup and disaster recovery events. You can view any built-in alerts that were fired by solutions, such as Azure Backup or Azure Site Recovery, and alerts fired based on custom alert rules on metrics.

[!INCLUDE [View fired alerts in Azure Business Continuity Center.](../../includes/business-continuity-center-view-fired-alerts.md)]

## Configure notifications

To route alerts to the notification channels, create an alert processing rule and an action group. An alert processing rule is a rule that specifies which alerts should be routed to a particular notification channel, and the action group represents the notification channel.

>[!Note]
>Any action group supported by Azure Monitor (for example, email, webhooks, functions, logic apps, etc.) are supported for the backup and disaster recovery alerts also.

To configure email notifications for your alerts, follow these steps:

1. Go to **Business Continuity Center** > **Monitoring + Reporting** > **Alerts** > **+ Create**, and then select **Create Alert Processing Rule**.

   :::image type="content" source="./media/tutorial-monitor-alerts-metrics/create-alerts.png" alt-text="Screenshot shows how to create alerts." lightbox="./media/tutorial-monitor-alerts-metrics/create-alerts.png":::

2. Under **Scope**, select *scope of the alert processing rule*, and then apply the rule for all the resources in a subscription.

   You can make other customizations to the scope by applying filters. For example, generating notification for alert of a certain severity, generating notifications only for selected alert rules, etc.

3. On **Rule settings**, select **Apply action group** and **Create action group** (or use an existing one). It is the destination to which the notification for an alert should be sent. For example, an email address. 
 
4.	To create  an action group, on the **Basics** tab, select the *name of the action group*, the *subscription*, and the *resource group* under which it must be created. 
 
5. On the **Notifications** tab, select the *destination of the notification* as **Email**, **SMS Message**, or **Push/ Voice**, and then enter the *recipient's email ID* and other required details. 
 
6. Select **Review+Create** > **Create** to deploy the action group. The creation of the action group leads you back to the alert processing rule creation. The created action group appears in the Rule settings page. 

7. On the **Scheduling** tab, select **Always**. 
 
8. On the **Details** tab, specify the subscription, resource group and name of the alert processing rule being created. 
 
9. Add *Tags* if needed and select **Review + Create** > **Create**. The alert processing rule will be active in a few minutes. 

## View metrics

You can use Azure Business Continuity Center to view built-in metrics for business continuity scenarios, and enable alerts based on these metric values. 

>[!Note]
>Currently, only metrics for Azure Backup are supported (Backup Health Events and Restore Health Events). [Learn more](../backup/metrics-overview.md) about the supported metrics and their definitions.

To view metrics, follow these steps:

1. Go to **Business Continuity Center** > **Monitoring + Reporting** > **Metrics** to open the **Azure Monitor metrics explorer**.

   :::image type="content" source="./media/tutorial-monitor-alerts-metrics/view-metrics.png" alt-text="Screenshot shows how to view metrics." lightbox="./media/tutorial-monitor-alerts-metrics/view-metrics.png":::

2. On **Metrics**, select the *resource(s)* for which you want to see metrics. For example, in Azure Backup scenarios, you have to choose a *vault* (or a *group of vaults* in a subscription and region). 
 
3. Select the *metric* you want to view, for example, *Backup Health events*.

4. Use the *filters* to further see the metric values at lower levels of granularity, for example, a particular protected item in the vault.
 
5. To create alert rules based on the value of the metric, select **New Alert Rule** at the top of the *metrics chart*, which leads you to the metric alert rules creation experience. [Learn more](../backup/backup-azure-monitor-alerts-notification.md#configure-alerts-and-notifications-on-your-metrics) about supported metric alert scenarios.
 
## Next steps

- [Configure datasources](./tutorial-configure-protection-datasource.md)

 
