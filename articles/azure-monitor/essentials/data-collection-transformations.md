---
title: Data collection transformations
description: Use transformations in a data collection rule in Azure Monitor to filter and modify incoming data.
ms.topic: conceptual
ms.date: 06/29/2022
ms.reviwer: nikeist

---

# Data collection transformations in Azure Monitor (preview)
Transformations in Azure Monitor allow you to filter or modify incoming data before it's sent to its destination. This article provides a basic description of transformations and how they are implemented.

## When to use transformations
Transformations are useful for the following scenarios:

**Reduce data ingestion cost.** You can create a transformation to filter data that you don't require from a particular workflow. You may also remove data that you don't require from specific columns, resulting in a lower amount of the data that you need to ingest and store. For example, you might have a diagnostic setting to collect resource logs from a particular resource but not require all of the log entries that it generates. Create a transformation that filters out records that match a certain criteria. 

**Simplify query requirements.** You may have a table with valuable data buried in a particular column or data that needs some type of conversion each time it's queried. Create a transformation that parses this data into a custom column so that queries don't need to parse it. Remove extra data from the column that isn't required to decrease ingestion and retention costs.

## Supported workflows
Transformations are not yet supported for all data collected by Azure Monitor. Ingestion-time transformations are supported for any workflow that uses the Azure Monitor [data ingestion pipeline](../data-collection.md), which is any workflow that uses a [data collection rule (DCR)](data-collection-rule-overview.md).

 Workflows that currently support transformations are:

- [Azure Monitor agent](../agents/data-collection-rule-azure-monitor-agent.md)
- [Custom logs](../logs/data-ingestion-api-overview.md)

For workflows that don't yet support transformations, you can use a [workspace transformation](#workspace-transformations).

## Ingestion-time transformation
Azure Monitor currently supports transformations at ingestion time. This transformation is applied after the data source delivers the data to the Azure Monitor ingestion pipeline and before the data is sent to the destination.

The transformation is defined in a [data collection rule (DCR)](data-collection-rule-overview.md) and uses a [Kusto Query Language (KQL) statement]() that is applied individually to each entry in the incoming data. It must understand the format of the incoming data and create output in the structure expected by the destination.

For example, a DCR that collects data from a virtual machine using Azure Monitor agent would specify particular data to collect from the agent. It could also include a transformation that would get applied to that data after it was sent to the data ingestion pipeline that further filtered the data or added a calculated column. This workflow is shown in the following diagram.

:::image type="content" source="media/data-collection-transformations/transformation-data-collectron-rule.png" lightbox="media/data-collection-transformations/transformation-data-collectron-rule.png" alt-text="Diagram of ingestion-time transformation for workflow supporting data collection rules.":::


## Workspace transformations
Workspace transformations provide ingestion-time transformations for workflows that send data to a Log Analytics workspace but don't yet use the Azure Monitor data ingestion pipeline, which is any workflow that doesn't use a [data collection rule (DCR)](data-collection-rule-overview.md). 

Workspace transformations are defined in a [workspace DCR](data-collection-rule-overview.md#types-of-data-collection-rules), which is associated with the workspace itself. This DCR can contain a transformation for one more [supported tables](tables-feature-support.md). Any data sent to these tables not using another DCR have the transformation applied. 

A common example is [resource logs](resource-logs.md) which are configured with a [diagnostic setting](diagnostic-settings.md). This is shown in the example below. 

:::image type="content" source="media/data-collection-transformations/transformation-legacy.png" alt-text="Diagram of ingestion-time transformation for workflow supporting data collection rules.":::

## Creating a transformation
The following table lists guidance for different methods for creating trasnformations. See [Structure of ingestion-time transformations in Azure Monitor (preview)](ingestion-time-transformations-structure.md) for details on writing the query of an ingestion-time transformation.  

| Type | Reference |
|:---|:---|
| Transformation queries | [Structure of ingestion-time transformations in Azure Monitor (preview)](ingestion-time-transformations-structure.md) |
| Data ingestion API with transformation | [Send custom logs to Azure Monitor Logs using the Azure portal](../logs/tutorial-data-ingestion-p[ortal].md)<br>[Send custom logs to Azure Monitor Logs using Resource Manager templates](../logs/tutorial-data-ingestion-api.md) |
| Workspace transformations | [Add workspace transformation to Azure Monitor Logs using the Azure portal (preview)](tutorial-workspace-tranformations-portal.md)<br>[Add workspace transformation to Azure Monitor Logs using resource manager templates (preview)](tutorial-workspace-tranformations-api.md)


## Next steps

- [Create a data collection rule](../agents/data-collection-rule-azure-monitor-agent.md) and an association to it from a virtual machine using the Azure Monitor agent.
