---
title: Create or edit an activity log, service health, or resource health alert rule
description: This article shows you how to create a new activity log, service health, and resource health alert rule.
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: how-to
ms.date: 11/27/2023
ms.reviewer: harelbr
---

# Create or edit an activity log, service health, or resource health alert rule

This article shows you how to create or edit an activity log, service health, or resource health alert rule. To learn more about alerts, see the [alerts overview](alerts-overview.md).

You create an alert rule by combining the resources to be monitored, the monitoring data from the resource, and the conditions that you want to trigger the alert. You can then define [action groups](./action-groups.md) and [alert processing rules](alerts-action-rules.md) to determine what happens when an alert is triggered.

Alerts triggered by these alert rules contain a payload that uses the [common alert schema](alerts-common-schema.md).

[!INCLUDE [alerts-wizard-access](../includes/alerts-wizard-access.md)]

### Edit an existing alert rule

1. In the [portal](https://portal.azure.com/), either from the home page or from a specific resource, select **Alerts** from the left pane.
1. Select **Alert rules**.
1. Select the alert rule you want to edit, and then select **Edit**.

    :::image type="content" source="media/alerts-create-activity-log-alert-rule/alerts-edit-activity-log-alert-rule.png" alt-text="Screenshot that shows steps to edit an existing activity log alert rule.":::
1. Select any of the tabs for the alert rule to edit the settings.

[!INCLUDE [alerts-wizard-scope](../includes/alerts-wizard-scope.md)]

## Configure the alert rule conditions

1. On the **Condition** tab, when you select the **Signal name** field, the most commonly used signals are displayed in the drop-down list. Select one of these popular signals, or select **See all signals** if you want to choose a different signal for the condition.

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-popular-signals.png" alt-text="Screenshot that shows popular signals when creating an alert rule.":::

1. (Optional) If you chose to **See all signals** in the previous step, use the **Select a signal** pane to search for the signal name or filter the list of signals. Filter by:
    - **Signal type**: The [type of alert rule](alerts-overview.md#types-of-alerts) you're creating.
    - **Signal source**: The service sending the signal.

    This table describes the services available for activity log alert rules:

    | Signal source            | Description                                                     |
    |--------------------------|-----------------------------------------------------------------|
    | Activity log – Policy    | The service that provides the Policy activity log events.       |
    | Activity log – Autoscale | The service that provides the Autoscale activity log events.    |
    | Activity log – Security  | The service that provides the Security activity log events.     |
    | Resource health          | The service that provides the resource-level health status.     |
    | Service health           | The service that provides the subscription-level health status. |

    Select the **Signal name** and **Apply**.

    #### [Activity log alert](#tab/activity-log)

    1. On the **Conditions** pane, select the **Chart period**.
    1. The **Preview** chart shows you the results of your selection.
    1. Select values for each of these fields in the **Alert logic** section:

        |Field |Description |
        |---------|---------|
        |Event level| Select the level of the events for this alert rule. Values are **Critical**, **Error**, **Warning**, **Informational**, **Verbose**, and **All**.|
        |Status|Select the status levels for the alert.|
        |Event initiated by|Select the user or service principal that initiated the event.|

    #### [Resource Health alert](#tab/resource-health)

    1.  On the **Conditions** pane, select values for each of these fields:

      |Field |Description |
      |---------|---------|
      |Event status| Select the statuses of Resource Health events. Values are **Active**, **In Progress**, **Resolved**, and **Updated**.|
      |Current resource status|Select the current resource status. Values are **Available**, **Degraded**, and **Unavailable**.|
      |Previous resource status|Select the previous resource status. Values are **Available**, **Degraded**, **Unavailable**, and **Unknown**.|
      |Reason type|Select the causes of the Resource Health events. Values are **Platform Initiated**, **Unknown**, and **User Initiated**.|
  
    #### [Service Health alert](#tab/service-health)

    1. On the **Conditions** pane, select values for each of these fields:

      |Field |Description |
      |---------|---------|
      |Services| Select the Azure services.|
      |Regions|Select the Azure regions.|
      |Event types|Select the types of Service Health events. Values are **Service issue**, **Planned maintenance**, **Health advisories**, and **Security advisories**.| 

    ---

[!INCLUDE [alerts-wizard-actions](../includes/alerts-wizard-actions.md)]

## Configure the alert rule details

:::image type="content" source="media/alerts-create-new-alert-rule/alerts-activity-log-rule-details-tab.png" alt-text="Screenshot that shows the Actions tab when creating a new activity log alert rule.":::

1. Enter values for the **Alert rule name** and the **Alert rule description**.
1. Select **Enable upon creation** for the alert rule to start running as soon as you're done creating it.

1. [!INCLUDE [alerts-wizard-custom=properties](../includes/alerts-wizard-custom-properties.md)]

[!INCLUDE [alerts-wizard-finish](../includes/alerts-wizard-finish.md)]

## Next steps
 [View and manage your alert instances](alerts-manage-alert-instances.md)