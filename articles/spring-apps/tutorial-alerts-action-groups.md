---
title: "Tutorial: Monitor Azure Spring Apps resources using alerts and action groups"
description: Learn how to use Spring app alerts.
author: karlerickson
ms.author: karler
ms.service: spring-apps
ms.topic: tutorial
ms.date: 12/29/2019
ms.custom: devx-track-java, event-tier1-build-2022
---

# Tutorial: Monitor Spring app resources using alerts and action groups

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article describes how to monitor Spring app resources using alerts and action groups.

Azure Spring Apps alerts support monitoring resources based on conditions such as available storage, rate of requests, or data usage. An alert sends notification when rates or conditions meet the defined specifications.

There are two steps to set up an alert pipeline:

1. Set up an Action Group with the actions to be taken when an alert is triggered, such as email, SMS, Runbook, or Webhook. Action Groups can be reused among different alerts.
2. Set up Alert rules. The rules bind metric patterns with the action groups based on target resource, metric, condition, time aggregation, etc.

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- A deployed Azure Spring Apps instance. For more information, see [Quickstart: Deploy your first application to Azure Spring Apps](./quickstart.md) to get started.

## Set up Action Groups and Alerts

The following procedures initialize both **Action Group** and **Alert** starting from the **Alerts** option in the navigation pane of an Azure Spring Apps instance. (The procedure can also start from the **Monitor Overview** page of the Azure portal.)

Navigate from a resource group to your Azure Spring Apps instance. Select **Alerts** in the navigation pane, then select **Manage actions**:

:::image type="content" source="media/alerts-action-groups/action-1-a.png" alt-text="Screenshot of the Azure portal showing the Alerts page with Manage actions highlighted." lightbox="media/alerts-action-groups/action-1-a.png":::

### Set up an Action Group

To begin the procedure to initialize a new **Action Group**, select **Add action group**.

:::image type="content" source="media/alerts-action-groups/action-1.png" alt-text="Screenshot of the Azure portal showing the Manage actions page with Add action group highlighted." lightbox="media/alerts-action-groups/action-1.png":::

On the **Add action group** page:

1. Specify an **Action group name** and **Short name**.

1. Specify **Subscription** and **Resource group**.

1. Specify **Action Name**.

1. Select **Action Type**.  This action opens another pane to define the action that is taken on activation.

1. Define the action using the options in the right pane.  This case uses email notification.

1. Select **OK** in the right action pane.

1. Select **OK** in the **Add action group** dialog.

   :::image type="content" source="media/alerts-action-groups/action-2.png" alt-text="Screenshot of the Azure portal showing the Add action group page with the Action type pane open." lightbox="media/alerts-action-groups/action-2.png":::

### Set up an Alert

The previous steps created an **Action Group** that uses email. You could also use phone notification, webhooks, Azure functions, and so forth. The following steps configure an **Alert**.

1. Navigate back to the **Alerts** page and then select **Manage Alert Rules**.

   :::image type="content" source="media/alerts-action-groups/alerts-2.png" alt-text="Screenshot of the Azure portal showing the Alerts page with Manage alert rules highlighted." lightbox="media/alerts-action-groups/alerts-2.png":::

1. Select the **Resource** for the alert.

1. Select **New alert rule**.

   :::image type="content" source="media/alerts-action-groups/alerts-3.png" alt-text="Screenshot of the Azure portal showing the Rules page with Add alert rule highlighted and the Resource dropdown menu highlighted." lightbox="media/alerts-action-groups/alerts-3.png":::

1. On the **Create rule** page, specify the **RESOURCE**.

1. The **CONDITION** setting provides many options for monitoring your **Spring Cloud** resources.  Select **Add** to open the **Configure signal logic** pane.

1. Select a condition. This example uses **System CPU Usage Percentage**.

   :::image type="content" source="media/alerts-action-groups/alerts-3-1.png" alt-text="Screenshot of the Azure portal showing the Configure signal logic pane." lightbox="media/alerts-action-groups/alerts-3-1.png":::

1. Scroll down the **Configure signal logic** pane to set the **Threshold value** to monitor.

   :::image type="content" source="media/alerts-action-groups/alerts-3-2.png" alt-text="Screenshot of the Azure portal showing Configure signal logic pane with Threshold value highlighted." lightbox="media/alerts-action-groups/alerts-3-2.png":::

1. Select **Done**.

   For details of the conditions available to monitor, see the [User portal metrics options](./concept-metrics.md#user-metrics-options) section of [Metrics for Azure Spring Apps](./concept-metrics.md).

1. Under **ACTIONS**, select **Select action group**. From the ACTIONS pane, select the previously defined **Action Group**.

   :::image type="content" source="media/alerts-action-groups/alerts-3-3.png" alt-text="Screenshot of the Azure portal showing the Select an action group to attach to this alert rule pane with an Action group name highlighted." lightbox="media/alerts-action-groups/alerts-3-3.png":::

1. Scroll down, and under **ALERT DETAILS**, name the alert rule.

1. Set the **Severity**.

1. Select **Create alert rule**.

   :::image type="content" source="media/alerts-action-groups/alerts-3-4.png" alt-text="Screenshot of the Azure portal showing the Create rule page with Alert Details highlighted." lightbox="media/alerts-action-groups/alerts-3-4.png":::

1. Verify that the new alert rule is enabled.

   :::image type="content" source="media/alerts-action-groups/alerts-4.png" alt-text="Screenshot of the Azure portal showing the Rules page for Alerts." lightbox="media/alerts-action-groups/alerts-4.png":::

A rule can also be created using the **Metrics** page:

   :::image type="content" source="media/alerts-action-groups/alerts-5.png" alt-text="Screenshot of the Azure portal showing the Metrics page with Metrics highlighted in the navigation pane." lightbox="media/alerts-action-groups/alerts-5.png":::

## Next steps

In this article, you learned how to set up alerts and action groups for an application in Azure Spring Apps. To learn more about action groups, see:

> [!div class="nextstepaction"]
> [Create and manage action groups in the Azure portal](../azure-monitor/alerts/action-groups.md)

> [!div class="nextstepaction"]
> [SMS Alert Behavior in Action Groups](../azure-monitor/alerts/alerts-sms-behavior.md)
