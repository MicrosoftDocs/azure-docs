---
title:  Monitor app lifecycle events using Azure Activity log and Azure Service Health
description: Monitor app lifecycle events and set up alerts with Azure Activity log and Azure Service Health.
author: KarlErickson
ms.author: shiqiu
ms.service: spring-apps
ms.topic: how-to
ms.date: 08/19/2021
ms.custom: devx-track-java, event-tier1-build-2022
---

# Monitor app lifecycle events using Azure Activity log and Azure Service Health

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article shows you how to monitor app lifecycle events and set up alerts with Azure Activity log and Azure Service Health.

Azure Spring Apps provides built-in tools to monitor the status and health of your applications. App lifecycle events help you understand any changes that were made to your applications so you can take action as necessary.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- A deployed Azure Spring Apps service instance and at least one application already created in your service instance. For more information, see [Quickstart: Deploy your first Spring Boot app in Azure Spring Apps](quickstart.md). 

## Monitor app lifecycle events triggered by users in Azure Activity logs

[Azure Activity logs](../azure-monitor/essentials/activity-log.md) contain resource events emitted by operations taken on the resources in your subscription. The following details for application lifecycle events (such as start, stop, and restart) are added into Azure Activity Logs:

- The time the operation occurred.
- The status of the operation.
- Which instance(s) are created when you start your app.
- Which instance(s) are deleted when you stop your app.
- Which instance(s) are deleted and created when you restart your app.

To see the affected instances when you restart your app, navigate to your Azure Spring Apps instance in the Azure portal and select **Activity log** in the navigation pane.

:::image type="content" source="media/monitor-app-lifecycle-events/activity-log-restart-detail.png" alt-text="Screenshot of the Azure portal showing the Activity log page and the details pane open on the selected operation." lightbox="media/monitor-app-lifecycle-events/activity-log-restart-detail.png":::

## Monitor app lifecycle events in Azure Service Health

[Azure Resource Health](../service-health/resource-health-overview.md) helps you diagnose and get support for issues that may affect the availability of your service. These issues include service incidents, planned maintenance periods, and regional outages. Application restarting events are added into Azure Service Health. They include both unexpected incidents (for example, an unplanned app crash) and scheduled actions (for example, planned maintenance).

### Monitor unplanned app lifecycle events

When your app is restarted because of unplanned events, your Azure Spring Apps instance shows a status of **degraded** in the **Resource health** section of the Azure portal. Degraded means that your resource detected a potential loss in performance, although it's still available for use. Examples of unplanned events include app crash, health check failure, and system outage.

On the Azure Home page, select **Service Health** and then select **Resource Health**.

In **Health history**, you can find the latest status, the root cause, and affected instances.

:::image type="content" source="media/monitor-app-lifecycle-events/resource-health-detail.png" alt-text="Screenshot of the Azure portal showing the Resource Health page with the information and health history for degraded resource." lightbox="media/monitor-app-lifecycle-events/resource-health-detail.png" :::

### Monitor planned app lifecycle events

Your app may be restarted during platform maintenance. You can receive a maintenance notification in advance from the **Planned maintenance** page of Azure Service Health.

:::image type="content" source="media/monitor-app-lifecycle-events/planned-maintenance-notification.png" alt-text="Screenshot of the Azure portal showing the Planned maintenance page for Service Health with a  maintenance issue highlighted." lightbox="media/monitor-app-lifecycle-events/planned-maintenance-notification.png":::

When platform maintenance happens, your Azure Spring Apps instance shows a status of **degraded**. If restarting is needed during platform maintenance, Azure Spring Apps performs a rolling update to incrementally update your applications. Rolling updates are designed to update your workloads without downtime. You can find the latest status in the health history page.

:::image type="content" source="media/monitor-app-lifecycle-events/planned-maintenance-in-progress.png" alt-text="Screenshot of Azure portal example log for planned maintenance in progress." lightbox="media/monitor-app-lifecycle-events/planned-maintenance-in-progress.png" :::

>[!NOTE]
> Currently, Azure Spring Apps performs one regular planned maintenance to upgrade the underlying Kubernetes version every 2-4 months. For a detailed maintenance timeline, check the notifications on the Azure Service Health page.

## Set up alerts

You can set up alerts for app lifecycle events. Service health notifications are also stored in the Azure activity log. The activity log stores a large volume of information, so there's a separate user interface to make it easier to view and set up alerts on service health notifications.

The following list describes the key steps needed to set up an alert: 

1. Set up an action group with the actions to take when an alert is triggered. Example action types include sending a voice call, SMS, email; or triggering various types of automated actions. Various alerts may use the same action group or different action groups depending on the user's requirements.
2. Set up alert rules. The alerts use action groups to notify users that an alert for some specific app lifecycle event has been triggered.

### Set up alerts on Activity log

Use the following steps to create an activity log alert rule in the Azure portal:

1. Navigate to your Azure Spring Apps instance and select **Activity log** in the navigation pane.

1. Select any log to open its detail pane and then select **New alert rule**.

   :::image type="content" source="media/monitor-app-lifecycle-events/activity-log-alert.png" alt-text="Screenshot of the Azure portal showing the Activity log page and the New Alert rule button highlighted for a selected log." lightbox="media/monitor-app-lifecycle-events/activity-log-alert.png" :::

1. By default, alerts are scoped to the current subscription. Select the **Scope** tab to select a different subscription.

1. Select the **Condition** tab. Select **Signal name** to configure the criteria for the condition.

   :::image type="content" source="media/monitor-app-lifecycle-events/activity-log-alert-condition.png" alt-text="Screenshot of Azure portal activity log alert condition." lightbox="media/monitor-app-lifecycle-events/activity-log-alert-condition.png":::

1. Select the **Actions** tab. Add action groups to be applied to the alert rule.

1. Select **Review + create** and then select **Create**.

### Set up alerts to monitor app lifecycle events in Azure Service Health

Use the following steps to create an alert rule for service health notifications in the Azure portal.

1. On the Azure Home page, select **Service Health** and then select **Resource health** in the navigation pane.
1. Select **Add resource health alert**.

   :::image type="content" source="media/monitor-app-lifecycle-events/add-resource-health-alert.png" alt-text="Screenshot of Azure portal Resource health page with the 'Add resource health alert' button highlighted." lightbox="media/monitor-app-lifecycle-events/add-resource-health-alert.png":::

1. Select the **Scope** tab. Specify the resources to be applied to the alert rule.

   :::image type="content" source="media/monitor-app-lifecycle-events/resource-health-alert-target.png" alt-text="Screenshot of the Azure portal showing the Scope tab for Create an alert rule dialog when selected from the Resource health page." lightbox="media/monitor-app-lifecycle-events/resource-health-alert-target.png":::

1. Select the **Condition** tab. Define the criteria to trigger the alert rule.

   :::image type="content" source="media/monitor-app-lifecycle-events/resource-health-alert-condition.png" alt-text="Screenshot of the Azure portal showing the Condition tab for Create an alert rule dialog when selected from the Resource health page." lightbox="media/monitor-app-lifecycle-events/resource-health-alert-condition.png":::

1. Select the **Actions** tab. Add action groups to be applied to the alert rule.

1. Select **Review + create** and then select **Create**.

### Set up alerts to monitor the planned maintenance notification

Use the following steps to create an alert rule for planned maintenance notifications in the Azure portal:

1. On the Azure Home page, select **Service Health** and then select **Health alerts** in the navigation pane.
1. Select **Add service health alert**.

   :::image type="content" source="media/monitor-app-lifecycle-events/add-service-health-alert.png" alt-text="Screenshot of Azure portal Health alerts page the 'Add service health alert' button highlighted." lightbox="media/monitor-app-lifecycle-events/add-service-health-alert.png":::

1. Provide values for settings on the **Scope**, **Condition**, and **Actions** tabs.

   :::image type="content" source="media/monitor-app-lifecycle-events/add-service-health-alert-details.png" lightbox="media/monitor-app-lifecycle-events/add-service-health-alert-details.png" alt-text="Screenshot of the Azure portal showing the Scope tab for Create an alert rule dialog when selected from the Health alerts page.":::

1. Select **Review + create** and then select **Create**.

## Next steps

[Self-diagnose and solve problems in Azure Spring Apps](how-to-self-diagnose-solve.md)
