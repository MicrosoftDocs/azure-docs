---
title: Data collection transformations
description: Use transformations in a data collection rule in Azure Monitor to filter and modify incoming data.
ms.topic: conceptual
ms.date: 06/29/2022
ms.reviwer: nikeist

---

# Data collection transformations in Azure Monitor (preview)
Transformations in Azure Monitor allow you to filter or modify incoming data before it's sent to a Log Analytics workspace. This article provides a basic description of transformations and how they are implemented. It provides links to other content for actually creating a transformation.

## Why to use transformations
The following table describes the different goals that transformations can be used to achieve.

| Category | Details |
|:---|:---|
| Reduce data costs | Since you're charged ingestion cost for any data sent to a Log Analytics workspace, you want to filter out any data that you don't require to reduce your costs.<br><br>**Remove entire rows.** For example, you might have a diagnostic setting to collect resource logs from a particular resource but not require all of the log entries that it generates. Create a transformation that filters out records that match a certain criteria.<br><br>**Remove a column from each row.** For example, your data may include columns with data that's redundant or has minimal value. Create a transformation that filters out columns that aren't required.<br><br>**Parse important data from a column.** You may have a table with valuable data buried in a particular column. Use a transformation to parse the valuable data into a new column and remove the original. |
| Remove sensitive data | You may have a data source that sends information you don't want stored for privacy or compliancy reasons.<br><br>**Filter sensitive information.** Filter out entire rows or just particular columns that contain sensitive information.<br><br>**Obfuscate sensitive information**. For example, you might replace digits with a common character in an IP address or telephone number. |
| Enrich data with additional or calculated information | Use a transformation to add information to data that provides business context or simplifies querying the data later.<br><br>**Add a column with additional information.** For example, you might add a column identifying whether an IP address in another column is internal or external.<br><br>**Add business specific information.** For example, you might add a column indicating a company division based on location information in other columns. 




## Supported tables
Transformations may be applied to the following tables in a Log Analytics workspace. 

- Any Azure table listed in [Tables that support time transformations in Azure Monitor Logs (preview)](../logs/tables-feature-support.md)
- Any custom table


## How transformations work
Transformations are performed in Azure Monitor in the [data ingestion pipeline](../essentials/data-collection.md) after the data source delivers the data and before it's sent to the destination. The data source may perform its own filtering before sending data but then rely on the transformation for further manipulation for it's sent to the destination.

Transformations are defined in a [data collection rule (DCR)](data-collection-rule-overview.md) and use a [Kusto Query Language (KQL) statement](data-collection-transformations-structure.md) that is applied individually to each entry in the incoming data. It must understand the format of the incoming data and create output in the structure expected by the destination.

For example, a DCR that collects data from a virtual machine using Azure Monitor agent would specify particular data to collect from the client operating system. It could also include a transformation that would get applied to that data after it's sent to the data ingestion pipeline that further filters the data or adds a calculated column. This workflow is shown in the following diagram.

:::image type="content" source="media/data-collection-transformations/transformation-azure-monitor-agent.png" lightbox="media/data-collection-transformations/transformation-azure-monitor-agent.png" alt-text="Diagram of ingestion-time transformation for Azure Monitor agent." border="false":::

Another example is data sent from a custom application using the [logs ingestion API](../logs/logs-ingestion-api-overview.md). In this case, the application sends the data to a [data collection endpoint](data-collection-endpoint-overview.md) and specifies a data collection rule in the REST API call. The DCR includes the transformation and the destination workspace and table.

:::image type="content" source="media/data-collection-transformations/transformation-data-ingestion-api.png" lightbox="media/data-collection-transformations/transformation-data-ingestion-api.png" alt-text="Diagram of ingestion-time transformation for custom application using logs ingestion API." border="false":::

## Workspace transformation DCR
The workspace transformation DCR is a special DCR that's applied directly to a Log Analytics workspace. It includes default transformations for one more [supported tables](../logs/tables-feature-support.md). These transformations are applied to any data sent to these tables unless that data came from another DCR.

For example, if you create a transformation in the workspace transformation DCR for the `Event` table, it would be applied to events collected by virtual machines running the [Log Analytics agent](../agents/log-analytics-agent.md) since this agent doesn't use a DCR. The transformation would be ignored by any data sent from the [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) though since it uses a DCR and would be expected to provide its own transformation.

A common use of the workspace transformation DCR is collection of [resource logs](resource-logs.md) which are configured with a [diagnostic setting](diagnostic-settings.md). This is shown in the example below. 

:::image type="content" source="media/data-collection-transformations/transformation-diagnostic-settings.png" lightbox="media/data-collection-transformations/transformation-diagnostic-settings.png" alt-text="Diagram of workspace transformation for resource logs configured with diagnostic settings." border="false":::

## Creating a transformation
There are multiple methods to create transformations depending on the data collection method. The following table lists guidance for different methods for creating transformations. 

| Type | Reference |
|:---|:---|
| Logs ingestion API with transformation | [Send data to Azure Monitor Logs using REST API (Azure portal)](../logs/tutorial-logs-ingestion-portal.md)<br>[Send data to Azure Monitor Logs using REST API (Resource Manager templates)](../logs/tutorial-logs-ingestion-api.md) |
| Transformation in workspace DCR | [Add workspace transformation to Azure Monitor Logs using the Azure portal (preview)](../logs/tutorial-workspace-transformations-portal.md)<br>[Add workspace transformation to Azure Monitor Logs using resource manager templates (preview)](../logs/tutorial-workspace-transformations-api.md)


## Next steps

- [Create a data collection rule](../agents/data-collection-rule-azure-monitor-agent.md) and an association to it from a virtual machine using the Azure Monitor agent.
