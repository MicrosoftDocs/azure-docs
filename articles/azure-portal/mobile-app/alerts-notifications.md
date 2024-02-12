---
title: Azure mobile app alerts and notifications
description: Use Azure mobile app notifications to get up-to-date alerts and information on your resources and services.
ms.date: 11/2/2023
ms.topic: conceptual
---

# Azure mobile app alerts and notifications

Use  Azure mobile app notifications to get up-to-date alerts and information on your resources and services.

Azure mobile app notifications offer users flexibility in how they receive push notifications.

Azure mobile app notifications are a way to monitor and manage your Azure resources from your mobile device. You can use the Azure mobile app to view the status of your resources, get alerts on issues, and take corrective actions.

This article describes different options for configuring your notifications in the Azure mobile app.

## Enable push notifications for Service Health alerts

To enable push notifications for Service Health on specific subscriptions:

1. Open the Azure mobile app and sign in with your Azure account.
1. Select the menu icon on the top left corner, then select **Settings**.
1. Select **Service Health issue alerts**.

   :::image type="content" source="media/alerts-notifications/service-health.png" alt-text="Screenshot showing the Service Health issue alerts section of the Settings page in the Azure mobile app.":::

1. Use the toggle switches to select subscriptions for which you want to receive push notifications.
1. Select **Save** to confirm your changes.

## Enable push notifications for custom alerts

You can enable push notifications in the Azure mobile app for custom alerts that you define. To do so, you first [create a new alert rule](/azure/azure-monitor/alerts/alerts-create-new-alert-rule?tabs=metric) in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com) using the same Azure account information that you're using in the Azure mobile app.
1. In the Azure portal, open **Azure Monitor**.
1. Select **Alerts**.
1. Select **Create alert rule** and select the target resource that you want to monitor.
1. Configure the condition, severity, and action group for your alert rule. You can use an existing [action group](/azure/azure-monitor/alerts/action-groups), or create a new one.
1. In the action group, make sure to add a notification type of **Push Notification** and select the Azure mobile app as the destination. This enables notifications in your Azure mobile app.
1. Select **Create alert rule** to save your changes.

## View alerts

There are several ways to view current alerts on the Azure mobile app.

### Notifications list view

Select the **Notifications** icon on the bottom toolbar to see a list view of all current alerts.

:::image type="content" source="media/alerts-notifications/notifications-icon-toolbar.png" alt-text="Screenshot showing the Notifications icon on the bottom toolbar of the Azure mobile app.":::

In the list view you have the option to search for specific alerts or utilize the filter option in the top right of the screen to filter by specific subscriptions.

:::image type="content" source="media/alerts-notifications/notifications-list-view-filter.png" alt-text="Screenshot showing the notification list view and filter option in the Azure mobile app.":::

When you select a specific alert, you'll see an alert details page that will provide more information, including:

- Severity
- Fired time
- App Service plan
- Alert condition
- User response
- Why the alert fired
- Additional details
  - Description
  - Monitor service
  - AlertID
  - Suppression status
  - Target resource type
  - Signal type

You can change the user response by selecting the edit option (pencil icon) next to the current response. Select either **New**, **Acknowledged**, or **Closed**, and then select **Done** in the top right corner. You can also select **History** near the top of the screen to view the timeline of events for the alert.

:::image type="content" source="media/alerts-notifications/alert-details.png" alt-text="Screenshot of the Alert details page in the Azure mobile app.":::

### Alerts card on Home view

You can also view alerts on the **Alerts** tile on your [Azure mobile app **Home**](home.md).

The **Alerts** tile includes two viewing options: **List** or **Chart**.

The **List** view will show your latest alerts along with top level information including:

- Title
- Alert state
- Severity
- Time

You can select **See All** to display the notifications list view showing all of your alerts.

:::image type="content" source="media/alerts-notifications/home-notifications-list-view.png" alt-text="Screenshot showing the notifications List view on Azure mobile app Home.":::

Alternately, you can select the **Chart** view to see the severity of the latest alerts on a bar chart.

:::image type="content" source="media/alerts-notifications/home-notifications-chart-view.png" alt-text="Screenshot showing the notifications Chart view on Azure mobile app Home.":::

## Next steps

- Learn more about the [Azure mobile app](overview.md).
- Download the Azure mobile app for free from the [Apple App Store](https://aka.ms/azureapp/ios/doc), [Google Play](https://aka.ms/azureapp/android/doc) or [Amazon App Store](https://aka.ms/azureapp/amazon/doc).
