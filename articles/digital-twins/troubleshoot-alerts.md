---
# Mandatory fields.
title: Set up alerts
titleSuffix: Azure Digital Twins
description: See how to enable alerts on Azure Digital Twins metrics.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 7/28/2020
ms.topic: troubleshooting
ms.service: digital-twins
---

# Troubleshooting Azure Digital Twins: Alerts

Azure Digital Twins collects [metrics](troubleshoot-metrics.md) for your service instance that give information about the state of your resources. You can use these metrics to assess the overall health of Azure Digital Twins service and the resources connected to it.

**Alerts** proactively notify you when important conditions are found in your metrics data. They allow you to identify and address issues before the users of your system notice them. You can read more about alerts in [*Overview of alerts in Microsoft Azure*](../azure-monitor/platform/alerts-overview.md).

## Turn on alerts

Here is how to enable alerts for your Azure Digital Twins instance:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Azure Digital Twins instance. You can find it by typing its name into the portal search bar. 

2. Select **Alerts** from the menu, then **+ New alert rule**.

    :::image type="content" source="media/troubleshoot-metrics/alerts.png" alt-text="Screenshot showing the Alerts page and button to add":::

3. On the *Create alert rule* page that follows, follow the prompts to define conditions, actions to be triggered, and alert details. For descriptions of these fields and more alert details, see [*Overview of alerts in Microsoft Azure*](../azure-monitor/platform/alerts-overview.md).

## Next steps

* For more information about alerts with Azure Monitor, see [*Overview of alerts in Microsoft Azure*](../azure-monitor/platform/alerts-overview.md).
* For information about the Azure Digital Twins metrics, see [*Troubleshooting: View metrics with Azure Monitor*](troubleshoot-metrics.md).
* To see how to enable diagnostics logging for your metrics, see [*Troubleshooting: Set up diagnostics*](troubleshoot-diagnostics.md).
