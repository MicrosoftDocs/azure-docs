---
title: Data collection in Azure Monitor
description: Monitoring data collected by Azure Monitor is separated into metrics that are lightweight and capable of supporting near real-time scenarios and logs that are used for advanced analysis.
ms.topic: conceptual
ms.date: 11/01/2023
---

# Data collection in Azure Monitor 




## Data collection scenarios
The following sections describe the data collection scenarios that are currently supported using DCR and the new data ingestion pipeline.

### Azure Monitor agent

>[!IMPORTANT]
>The Log Analytics agent is on a **deprecation path** and won't be supported after **August 31, 2024**. Any new data centers brought online after January 1 2024 will not support the Log Analytics agent. If you use the Log Analytics agent to ingest data to Azure Monitor, [migrate to the new Azure Monitor agent](../agents/azure-monitor-agent-migration.md) prior to that date.
>
The diagram below shows data collection for the [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) running on a virtual machine. In this scenario, the DCR specifies events and performance data to collect from the agent machine, a transformation to filter and modify the data after its collected, and a Log Analytics workspace to send the transformed data. To implement this scenario, you create an association between the DCR and the agent. One agent can be associated with multiple DCRs, and one DCR can be associated with multiple agents.

:::image type="content" source="media/data-collection-transformations/transformation-azure-monitor-agent.png" lightbox="media/data-collection-transformations/transformation-azure-monitor-agent.png" alt-text="Diagram showing data collection for Azure Monitor agent." border="false":::



### Log ingestion API
The diagram below shows data collection for the [Logs ingestion API](../logs/logs-ingestion-api-overview.md), which allows you to send data to a Log Analytics workspace from any REST client. In this scenario, the API call connects to a [data collection endpoint (DCE)](data-collection-endpoint-overview.md) and specifies a DCR to accept its incoming data. The DCR understands the structure of the incoming data, includes a transformation that ensures that the data is in the format of the target table, and specifies a workspace and table to send the transformed data.

:::image type="content" source="media/data-collection-transformations/transformation-data-ingestion-api.png" lightbox="media/data-collection-transformations/transformation-data-ingestion-api.png" alt-text="Diagram showing data collection for custom application using logs ingestion API." border="false":::

See [Logs ingestion API in Azure Monitor (Preview)](../logs/logs-ingestion-api-overview.md) for details on the Logs ingestion API.

### Workspace transformation DCR
The diagram below shows data collection for [resource logs](resource-logs.md) using a [workspace transformation DCR](data-collection-transformations.md#workspace-transformation-dcr). This is a special DCR that's associated with a workspace and provides a default transformation for [supported tables](../logs/tables-feature-support.md). This transformation is applied to any data sent to the table that doesn't use another DCR. The example here shows resource logs using a diagnostic setting, but this same transformation could be applied to other data collection methods such as Log Analytics agent or Container insights.

:::image type="content" source="media/data-collection-transformations/transformation-diagnostic-settings.png" lightbox="media/data-collection-transformations/transformation-diagnostic-settings.png" alt-text="Diagram showing data collection for resource logs using a transformation in the workspace transformation DCR." border="false":::

See [Workspace transformation DCR](data-collection-transformations.md#workspace-transformation-dcr) for details about workspace transformation DCRs and links to walkthroughs for creating them.

## Frequently asked questions

This section provides answers to common questions.

### Is there a maximum amount of data that I can collect in Azure Monitor?

There's no limit to the amount of metric data you can collect, but this data is stored for a maximum of 93 days. See [Retention of metrics](./data-platform-metrics.md#retention-of-metrics). There's no limit on the amount of log data that you can collect, but the pricing tier you choose for the Log Analytics workspace might affect the limit. See [Pricing details](https://azure.microsoft.com/pricing/details/monitor/).

### How do I access data collected by Azure Monitor?

Insights and solutions provide a custom experience for working with data stored in Azure Monitor. You can work directly with log data by using a log query written in Kusto Query Language (KQL). In the Azure portal, you can write and run queries and interactively analyze data by using Log Analytics. Analyze metrics in the Azure portal with the metrics explorer. See [Analyze log data in Azure Monitor](../logs/log-query-overview.md) and [Analyze metrics with Azure Monitor metrics explorer](./analyze-metrics.md).

## Next steps

- Read more about [data collection rules](data-collection-rule-overview.md).
- Read more about [transformations](data-collection-transformations.md).

