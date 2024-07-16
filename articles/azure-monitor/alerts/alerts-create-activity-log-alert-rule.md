---
title: Create an activity log, service health, or resource health alert rule
description: This article shows you how to create or edit an activity log, service health, or resource health alert rule in Azure Monitor.
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: how-to
ms.date: 11/27/2023
ms.reviewer: harelbr

# Customer intent: As an Azure cloud administrator, I want to create a new log search alert rule so that I can use a log search query to monitor the performance and availability of my resources.
---

# Create or edit an activity log, service health, or resource health alert rule

This article shows you how to create or edit an activity log, service health, or resource health alert rule in Azure Monitor. To learn more about alerts, see the [alerts overview](alerts-overview.md).

You create an alert rule by combining the resources to be monitored, the monitoring data from the resource, and the conditions that you want to trigger the alert. You can then define [action groups](./action-groups.md) and [alert processing rules](alerts-action-rules.md) to determine what happens when an alert is triggered.

Alerts triggered by these alert rules contain a payload that uses the [common alert schema](alerts-common-schema.md).

[!INCLUDE [alerts-wizard-access](../includes/alerts-wizard-access.md)]

### Edit an existing alert rule

1. In the [Azure portal](https://portal.azure.com/), either from the home page or from a specific resource, select **Alerts** on the left pane.
1. Select **Alert rules**.
1. Select the alert rule you want to edit, and then select **Edit**.

    :::image type="content" source="media/alerts-create-activity-log-alert-rule/alerts-edit-activity-log-alert-rule.png" alt-text="Screenshot that shows the button for editing an existing activity log alert rule.":::
1. Select any of the tabs for the alert rule to edit the settings.

[!INCLUDE [alerts-wizard-scope](../includes/alerts-wizard-scope.md)]

## Configure alert rule conditions

1. On the **Condition** tab, select **Activity log**, **Resource health**, or **Service health**. Or select **See all signals** if you want to choose a different signal for the condition.

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-popular-signals.png" alt-text="Screenshot that shows popular signals for creating an alert rule.":::

1. (Optional) If you selected **See all signals** in the previous step, use the **Select a signal** pane to search for the signal name or filter the list of signals. Filter by:
    - **Signal type**: The [type of alert rule](alerts-overview.md#types-of-alerts) that you're creating.
    - **Signal source**: The service that sends the signal.

    This table describes the available services for activity log alert rules:

    | Signal source            | Description                                                     |
    |--------------------------|-----------------------------------------------------------------|
    | **Activity log – Policy**    | The service that provides the policy-related activity log events.       |
    | **Activity log – Autoscale** | The service that provides the autoscale-related activity log events.    |
    | **Activity log – Security**  | The service that provides the security-related activity log events.     |
    | **Resource health**          | The service that provides the resource-level health status.     |
    | **Service health**           | The service that provides the subscription-level health status. |

    Select the signal name, and then select **Apply**.

    #### [Activity log alert](#tab/activity-log)

    1. On the **Conditions** pane, select the **Chart period** value.

       The **Preview** chart shows the results of your selection.
    1. In the **Alert logic** section, select values for each of these fields:

        |Field |Description |
        |---------|---------|
        |**Event level**| Select the level of the events for this alert rule. Values are **Critical**, **Error**, **Warning**, **Informational**, **Verbose**, and **All**.|
        |**Status**|Select the status levels for the alert.|
        |**Event initiated by**|Select the user principal or service principal that initiated the event.|

    #### [Resource health alert](#tab/resource-health)

    - On the **Conditions** pane, select values for each of these fields:

       |Field |Description |
       |---------|---------|
       |**Event status**| Select the statuses of resource health events. Values are **Active**, **In Progress**, **Resolved**, and **Updated**.|
       |**Current resource status**|Select the current resource status. Values are **Available**, **Degraded**, and **Unavailable**.|
       |**Previous resource status**|Select the previous resource status. Values are **Available**, **Degraded**, **Unavailable**, and **Unknown**.|
       |**Reason type**|Select the causes of the resource health events. Values are **Platform Initiated**, **Unknown**, and **User Initiated**.|
  
    #### [Service health alert](#tab/service-health)

    - On the **Conditions** pane, select values for each of these fields:

      |Field |Description |
      |---------|---------|
      |**Services**| Select the Azure services.|
      |**Regions**|Select the Azure regions.|
      |**Event types**|Select the types of service health events. Values are **Service issue**, **Planned maintenance**, **Health advisories**, and **Security advisories**.|

    ---

[!INCLUDE [alerts-wizard-actions](../includes/alerts-wizard-actions.md)]

## Configure alert rule details

1. On the **Details** tab, enter values for **Alert rule name** and **Alert rule description**.
1. Select **Enable alert rule upon creation** for the alert rule to start running as soon as you finish creating it.
1. (Optional) For **Region**, select a region in which your alert rule will be processed. If you need to make sure the rule is processed within the [EU Data Boundary](/privacy/eudb/eu-data-boundary-learn), select the North Europe or West Europe region. In all other cases, you can select the Global region (which is the default).

   > [!NOTE]
   > Service Health alert rules can only be located in the Global region.

   :::image type="content" source="media/alerts-create-new-alert-rule/alerts-activity-log-rule-details-tab.png" alt-text="Screenshot that shows the Details tab for creating a new activity log alert rule.":::

1. [!INCLUDE [alerts-wizard-custom=properties](../includes/alerts-wizard-custom-properties.md)]

[!INCLUDE [alerts-wizard-finish](../includes/alerts-wizard-finish.md)]

## Related content

- [View and manage your alert instances](alerts-manage-alert-instances.md)
