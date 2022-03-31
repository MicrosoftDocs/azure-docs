---
# Mandatory fields.
title: Monitor with alerts
titleSuffix: Azure Digital Twins
description: Learn how to troubleshoot Azure Digital Twins by setting up alerts based on service metrics.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 03/10/2022
ms.topic: how-to
ms.service: digital-twins
---

# Monitor Azure Digital Twins with alerts

In this article, you'll learn how to set up *alerts* in the [Azure portal](https://portal.azure.com). These alerts will notify you when configurable conditions you've defined based on the metrics of your Azure Digital Twins instance are met, allowing you to take important actions.

Azure Digital Twins collects [metrics](how-to-monitor-metrics.md) for your service instance that give information about the state of your resources. You can use these metrics to assess the overall health of Azure Digital Twins service and the resources connected to it.

Alerts proactively notify you when important conditions are found in your metrics data. They allow you to identify and address issues before the users of your system notice them. You can read more about alerts in [Overview of alerts in Microsoft Azure](../azure-monitor/alerts/alerts-overview.md).

## Turn on alerts

Here's how to enable alerts for your Azure Digital Twins instance:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Azure Digital Twins instance. You can find it by typing its name into the portal search bar. 

2. Select **Alerts** from the menu, then **+ New alert rule**.

   :::image type="content" source="media/how-to-monitor-alerts/alerts-pre.png" alt-text="Screenshot of the Azure portal showing the button to create a new alert rule in the Alerts section of an Azure Digital Twin instance." lightbox="media/how-to-monitor-alerts/alerts-pre.png":::

3. On the **Create alert rule** page that follows, you can follow the prompts to define conditions, actions to be triggered, and alert details.     
    * **Scope** details should fill automatically with the details for your instance
    * You'll define **Condition** and **Action group** details to customize alert triggers and responses. For more information about this process, see the [Select conditions](#select-conditions) section later in this article.
    * In the **Alert rule details** section, enter a name and optional description for your rule. 
        - You can select the **Enable alert rule upon creation** checkbox if you want the alert to become active as soon as it's created.
        - You can select the **Automatically resolve alerts** checkbox if you want to resolve the alert when the condition isn't met anymore.
        - This section is also where you select a **subscription**, **resource group**, and **Severity** level.

4. Select the **Create alert rule** button to create your alert rule.

   :::image type="content" source="media/how-to-monitor-alerts/create-alert-rule.png" alt-text="Screenshot of the Azure portal showing the Create Alert Rule page with sections for scope, condition, action group, and alert rule details." lightbox="media/how-to-monitor-alerts/create-alert-rule.png":::

For a guided walkthrough of filling out these fields, see [Overview of alerts in Microsoft Azure](../azure-monitor/alerts/alerts-overview.md). Below are some examples of what the steps will look like for Azure Digital Twins.

## Select conditions

Here's an excerpt from the **Select condition** process illustrating what types of alert signals are available for Azure Digital Twins. On this page you can filter the type of signal, and select the signal that you want from a list.

:::image type="content" source="media/how-to-monitor-alerts/configure-signal-logic.png" alt-text="Screenshot of the Azure portal showing the first Configure Signal Logic page. There are highlights around the Signal type box and the list of metrics.":::

After selecting a signal, you'll be asked to configure the logic of the alert. You can filter on a dimension, set a threshold value for your alert, and set the frequency of checks for the condition. Here's an example of setting up an alert for when the average Routing Failure Rate metric goes above 5%.

:::image type="content" source="media/how-to-monitor-alerts/configure-signal-logic-2.png" alt-text="Screenshot of the Azure portal showing the second Configure Signal Logic page.":::

## Verify success

After setting up alerts, they'll show up back on the **Alerts** page for your instance.
 
:::image type="content" source="media/how-to-monitor-alerts/alerts-post.png" alt-text="Screenshot of the Azure portal showing the Alerts page and button to add. There's one alert configured." lightbox="media/how-to-monitor-alerts/alerts-post.png":::

## Next steps

* For more information about alerts with Azure Monitor, see [Overview of alerts in Microsoft Azure](../azure-monitor/alerts/alerts-overview.md).
* For information about the Azure Digital Twins metrics, see [Monitor with metrics](how-to-monitor-metrics.md).
* To see how to enable diagnostics logging for your Azure Digital Twins metrics, see [Monitor with diagnostics logs](how-to-monitor-diagnostics.md).
