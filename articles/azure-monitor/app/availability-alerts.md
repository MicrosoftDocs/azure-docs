---
title: Set up availability alerts with Application Insights
description: Learn how to set up web tests in Application Insights. Get alerts if a website becomes unavailable or responds slowly.
ms.topic: conceptual
ms.date: 03/22/2023
ms.reviewer: sdash

---

# Availability alerts

[Application Insights](app-insights-overview.md) availability tests send web requests to your application at regular intervals from points around the world. You can receive alerts if your application isn't responding or if it responds too slowly.

## Enable alerts

Alerts are now automatically enabled by default, but to fully configure an alert, you must initially create your availability test.

:::image type="content" source="./media/availability-alerts/create-test.png" alt-text="Screenshot that shows the Create test dialog in the Azure portal." lightbox="./media/availability-alerts/create-test.png":::

> [!NOTE]
> With the [new unified alerts](../alerts/alerts-overview.md), the alert rule severity and notification preferences with [action groups](../alerts/action-groups.md) *must be* configured in the alerts experience. Without the following steps, you'll only receive in-portal notifications.

1. After you save the availability test, on the **Details** tab, select the ellipsis by the test you made. Select **Open Rules (Alerts) page**.

   :::image type="content" source="./media/availability-alerts/edit-alert.png" alt-text="Screenshot that shows the Availability pane for an Application Insights resource in the Azure portal and the Open Rules (Alerts) page menu option." lightbox="./media/availability-alerts/edit-alert.png":::

1. Set the severity level, rule description, and action group that have the notification preferences you want to use for this alert rule.

### Alert criteria

Automatically enabled availability alerts trigger an email when the endpoint you've defined is unavailable and when it's available again. Availability alerts that are created through this experience are state based. When the alert criteria are met, a single alert gets generated when the website is detected as unavailable. If the website is still down the next time the alert criteria is evaluated, it won't generate a new alert.

For example, suppose that your website is down for an hour and you've set up an email alert with an evaluation frequency of 15 minutes. You'll only receive an email when the website goes down and another email when it's back up. You won't receive continuous alerts every 15 minutes to remind you that the website is still unavailable.

You might not want to receive notifications when your website is down for only a short period of time, for example, during maintenance. You can change the evaluation frequency to a higher value than the expected downtime, up to 15 minutes. You can also increase the alert location threshold so that it only triggers an alert if the website is down for a specific number of regions. For longer scheduled downtimes, temporarily deactivate the alert rule or create a custom rule. It gives you more options to account for the downtime.

#### Change the alert criteria

To make changes to the location threshold, aggregation period, and test frequency, select the condition on the edit page of the alert rule to open the **Configure signal logic** window.

### Create a custom alert rule

If you need advanced capabilities, you can create a custom alert rule on the **Alerts** tab. Select **Create** > **Alert rule**. Choose **Metrics** for **Signal type** to show all available signals and select **Availability**.

A custom alert rule offers higher values for the aggregation period (up to 24 hours instead of 6 hours) and the test frequency (up to 1 hour instead of 15 minutes). It also adds options to further define the logic by selecting different operators, aggregation types, and threshold values.

- **Alert on X out of Y locations reporting failures**: The X out of Y locations alert rule is enabled by default in the [new unified alerts experience](../alerts/alerts-overview.md) when you create a new availability test. You can opt out by selecting the "classic" option or by choosing to disable the alert rule. Configure the action groups to receive notifications when the alert triggers by following the preceding steps. Without this step, you'll only receive in-portal notifications when the rule triggers.

- **Alert on availability metrics**: By using the [new unified alerts](../alerts/alerts-overview.md), you can alert on segmented aggregate availability and test duration metrics too:

   1. Select an Application Insights resource in the **Metrics** experience, and select an **Availability** metric.

   1. The **Configure alerts** option from the menu takes you to the new experience where you can select specific tests or locations on which to set up alert rules. You can also configure the action groups for this alert rule here.

- **Alert on custom analytics queries**: By using the [new unified alerts](../alerts/alerts-overview.md), you can alert on [custom log queries](../alerts/alerts-unified-log.md). With custom queries, you can alert on any arbitrary condition that helps you get the most reliable signal of availability issues. It's also applicable if you're sending custom availability results by using the TrackAvailability SDK.

  The metrics on availability data include any custom availability results you might be submitting by calling the TrackAvailability SDK. You can use the alerting on metrics support to alert on custom availability results.

## Automate alerts

To automate this process with Azure Resource Manager templates, see [Create a metric alert with an Azure Resource Manager template](../alerts/alerts-metric-create-templates.md#template-for-an-availability-test-along-with-a-metric-alert).

## Troubleshooting

See the dedicated [Troubleshooting article](troubleshoot-availability.md).

## Next steps

- [Multi-step web tests](availability-multistep.md)
- [Availability](availability-overview.md)
