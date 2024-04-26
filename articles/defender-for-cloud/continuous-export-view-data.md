---
title: View exported data in Azure Monitor
description: Learn how to view the data you exported with continuous export in Azure Monitor and analyze it effectively.
author: Elazark
ms.author: Elkrieger
ms.topic: how-to
ms.date: 03/19/2024
#customer intent: As a security analyst, I want to be able to view the exported data in Azure Monitor so that I can analyze and respond to security alerts and recommendations effectively.
---

# View exported data in Azure Monitor

After you've set up continuous export of Microsoft Defender for Cloud security alerts and recommendations, you can view the data in Azure Monitor. This article describes how to view the data in Log Analytics or in Azure Event Hubs.

## Prerequisites

- [Setup continuous export in the Azure portal](continuous-export.md) or [setup continuous export with Azure Policy](continuous-export-azure-policy.md) or [setup continuous export with REST API](continuous-export-rest-api.md).

## View exported alerts and recommendations in Azure Monitor

[Azure Monitor](../azure-monitor/alerts/alerts-overview.md) provides a unified alerting experience for various Azure alerts, including a diagnostic log, metric alerts, and custom alerts that are based on Log Analytics workspace queries.

To view alerts and recommendations from Defender for Cloud in Azure Monitor, configure an alert rule that's based on Log Analytics queries (a log alert rule).

**To configure an alert rule**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for and select **Monitor**.

1. Select **Alerts**.

1. Select **New alert rule**.

    :::image type="content" source="media/continuous-export-view-data/azure-monitor-alerts.png" alt-text="Screenshot that shows the Azure Monitor alerts page." lightbox="media/continuous-export-view-data/azure-monitor-alerts.png":::

1. Set up your new rule the same way you'd configure a [log alert rule in Azure Monitor](../azure-monitor/alerts/alerts-unified-log.md):

    - For **Resource**, select the Log Analytics workspace to which you exported security alerts and recommendations.

    - For **Condition**, select **Custom log search**. In the page that appears, configure the query, lookback period, and frequency period. In the search query, you can enter **SecurityAlert** or **SecurityRecommendation** to query the data types that Defender for Cloud continuously exports to as you enable the continuous export to Log Analytics feature.

    - Optionally, create an [action group](../azure-monitor/alerts/action-groups.md) to trigger. Action groups can automate sending an email, creating an ITSM ticket, running a webhook, and more, based on an event in your environment.

The Defender for Cloud alerts or recommendations appear (depending on your configured continuous export rules and the condition that you defined in your Azure Monitor alert rule) in Azure Monitor alerts, with automatic triggering of an action group (if provided).

## Next step

> [!div class="nextstepaction"]
> [Download a CSV report](export-alerts-to-csv.md)
