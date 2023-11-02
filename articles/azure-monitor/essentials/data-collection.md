---
title: Data collection in Azure Monitor
description: Monitoring data collected by Azure Monitor is separated into metrics that are lightweight and capable of supporting near real-time scenarios and logs that are used for advanced analysis.
ms.topic: conceptual
ms.date: 07/10/2022
---

# Data collection in Azure Monitor
Azure Monitor has a [common data platform](../data-platform.md) that consolidates data from a variety of sources. Currently, different sources of data for Azure Monitor use different methods to deliver their data, and each typically require different types of configuration. Get a description of the most common data sources at [Sources of monitoring data for Azure Monitor](../data-sources.md).

Azure Monitor is implementing a new [ETL](/azure/architecture/data-guide/relational-data/etl)-like data collection pipeline that improves on legacy data collection methods. This process uses a common data ingestion pipeline for all data sources and provides a standard method of configuration that's more manageable and scalable than current methods. Specific advantages of the new data collection include the following:

- Common set of destinations for different data sources.
- Ability to apply a transformation to filter or modify incoming data before it's stored.
- Consistent method for configuration of different data sources.
- Scalable configuration options supporting infrastructure as code and DevOps processes.

When implementation is complete, all data collected by Azure Monitor will use the new data collection process and be managed by data collection rules. Currently, only certain data collection methods support the ingestion pipeline, and they may have limited configuration options. There's no difference between data collected with the new ingestion pipeline and data collected using other methods. The data is all stored together as [Logs](../logs/data-platform-logs.md) and [Metrics](data-platform-metrics.md), supporting Azure Monitor features such as log queries, alerts, and workbooks. The only difference is in the method of collection.
## Data collection rules
Azure Monitor data collection is configured using a [data collection rule (DCR)](data-collection-rule-overview.md). A DCR defines the details of a particular data collection scenario including what data should be collected, how to potentially transform that data, and where to send that data. A single DCR can be used with multiple monitored resources, giving you a consistent method to configure a variety of monitoring scenarios.  In some cases, Azure Monitor will create and configure a DCR for you using options in the Azure portal. You may also directly edit DCRs to configure particular scenarios.

See [Data collection rules in Azure Monitor](data-collection-rule-overview.md) for details on data collection rules including how to view and create them.

## Transformations
One of the most valuable features of the new data collection process is [data transformations](data-collection-transformations.md), which allow you to apply a KQL query to incoming data to modify it before sending it to its destination. You might filter out unwanted data or modify existing data to improve your query or reporting capabilities. 

See [Data collection transformations in Azure Monitor (preview)](data-collection-transformations.md) For complete details on transformations including how to write transformation queries.


## Data collection scenarios
The following sections describe the data collection scenarios that are currently supported using DCR and the new data ingestion pipeline.

### Azure Monitor agent
The diagram below shows data collection for the [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) running on a virtual machine. In this scenario, the DCR specifies events and performance data to collect from the agent machine, a transformation to filter and modify the data after its collected, and a Log Analytics workspace to send the transformed data. To implement this scenario, you create an association between the DCR and the agent. One agent can be associated with multiple DCRs, and one DCR can be associated with multiple agents.

:::image type="content" source="media/data-collection-transformations/transformation-azure-monitor-agent.png" lightbox="media/data-collection-transformations/transformation-azure-monitor-agent.png" alt-text="Diagram showing data collection for Azure Monitor agent." border="false":::

See [Collect data from virtual machines with the Azure Monitor agent](../agents/data-collection-rule-azure-monitor-agent.md) for details on creating a DCR for the Azure Monitor agent.

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

