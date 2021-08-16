---
# Mandatory fields.
title: Set up alerts
titleSuffix: Azure Digital Twins
description: See how to enable alerts on Azure Digital Twins metrics.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 7/28/2020
ms.topic: how-to
ms.service: digital-twins
---

# Troubleshooting Azure Digital Twins: Alerts

Azure Digital Twins collects [metrics](troubleshoot-metrics.md) for your service instance that give information about the state of your resources. You can use these metrics to assess the overall health of Azure Digital Twins service and the resources connected to it.

**Alerts** proactively notify you when important conditions are found in your metrics data. They allow you to identify and address issues before the users of your system notice them. You can read more about alerts in [Overview of alerts in Microsoft Azure](../azure-monitor/alerts/alerts-overview.md).

## Turn on alerts

Here is how to enable alerts for your Azure Digital Twins instance:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Azure Digital Twins instance. You can find it by typing its name into the portal search bar. 

2. Select **Alerts** from the menu, then **+ New alert rule**.

3. On the *Create alert rule* page that follows, you can follow the prompts to define conditions, actions to be triggered, and alert details.     
    * **Scope** details should fill automatically with the details for your instance
    * You will define **Condition** and **Action group** details to customize alert triggers and responses
    * In the **Alert rule details** section, enter a name and optional description for your rule. You can select the _Enable alert rule upon creation_ checkbox if you want the alert to become active as soon as it is created.
        - This is also where you select a _resource group_ and _Severity_ level.

4. Select the _Create alert rule_ button to create your alert rule.

:::image type="content" source="media/troubleshoot-alerts/create-alert-rule.png" alt-text="Screenshot of the Azure portal showing the Create Alert Rule page with sections for scope, condition, action group, and alert rule details." lightbox="media/troubleshoot-alerts/create-alert-rule.png":::

For a guided walkthrough of filling out these fields, see [Overview of alerts in Microsoft Azure](../azure-monitor/alerts/alerts-overview.md). Below are some examples of what the steps will look like for Azure Digital Twins.

### Select conditions

Here is an excerpt from the *Select condition* process illustrating what types of alert signals are available for Azure Digital Twins. On this page you can filter the type of signal, and select the signal that you want from a list.

:::image type="content" source="media/troubleshoot-alerts/configure-signal-logic.png" alt-text="Screenshot of the Azure portal showing the first Configure Signal Logic page. There are highlights around the Signal type box and the list of metrics.":::

After selecting a signal, you'll be asked to configure the logic of the alert. You can filter on a dimension, set a threshold value for your alert, and set the frequency of checks for the condition. Here is an example of setting up an alert for when the average Routing Failure Rate metric goes above 5%.

:::image type="content" source="media/troubleshoot-alerts/configure-signal-logic-2.png" alt-text="Screenshot of the Azure portal showing the second Configure Signal Logic page.":::

### Verify success

After setting up alerts, they'll show up back on the *Alerts* page for your instance.
 
:::image type="content" source="media/troubleshoot-alerts/alerts-post.png" alt-text="Screenshot of the Azure portal showing the Alerts page and button to add. There is one alert configured." lightbox="media/troubleshoot-alerts/alerts-post.png":::

## Next steps

* For more information about alerts with Azure Monitor, see [Overview of alerts in Microsoft Azure](../azure-monitor/alerts/alerts-overview.md).
* For information about the Azure Digital Twins metrics, see [Troubleshooting: View metrics with Azure Monitor](troubleshoot-metrics.md).
* To see how to enable diagnostics logging for your metrics, see [Troubleshooting: Set up diagnostics](troubleshoot-diagnostics.md).
