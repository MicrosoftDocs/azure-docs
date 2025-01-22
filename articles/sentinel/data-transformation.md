---
title: Custom data ingestion and transformation in Microsoft Sentinel
description: Learn about how Azure Monitor's custom log ingestion and data transformation features can help you get any data into Microsoft Sentinel and shape it the way you want.
author: yelevin
ms.author: yelevin
ms.topic: conceptual
ms.date: 09/25/2024

#Customer intent: As a security engineer, I want to customize data ingestion and transformation in Microsoft Sentinel so that analysts can filter, enrich, and secure log data efficiently.

---

# Custom data ingestion and transformation in Microsoft Sentinel

[Azure Monitor Logs](/azure/azure-monitor/logs/data-platform-logs) serves as the data platform for Microsoft Sentinel. All logs ingested into Microsoft Sentinel are stored in a [Log Analytics workspace](/azure/azure-monitor/logs/log-analytics-workspace-overview), and [log queries](/azure/azure-monitor/logs/log-query-overview) written in Kusto Query Language (KQL) are used to to detect threats and monitor your network activity.

Log Analytics' custom data ingestion process gives you a high level of control over the data that gets ingested. It uses [**data collection rules (DCRs)**](/azure/azure-monitor/essentials/data-collection-rule-overview) to collect your data and manipulate it before it's stored in your workspace. This allows you to filter or enrich data being collected in standard tables and to create highly customizable tables for storing data from sources that produce unique log formats.

Microsoft Sentinel uses two tools from the underlying Azure Monitor platform to control this process:

- [**Transformations**](/azure/azure-monitor/essentials/data-collection-transformations) are defined in DCRs and apply KQL queries to incoming data before it's stored in your workspace. These transformations can filter out irrelevant data, enrich existing data with analytics or external data, or mask sensitive or personal information.

- The [**Logs ingestion API**](/azure/azure-monitor/logs/logs-ingestion-api-overview) allows you to send custom-format logs from any data source to your Log Analytics workspace, and store those logs either in certain standard tables, or in custom-formatted tables that you create. You have full control over the creation of these custom tables, down to specifying the column names and types. The API uses [**DCRs**](/azure/azure-monitor/essentials/data-collection-rule-overview) to define, configure, and apply transformations to these data flows.

These two tools will be explained in more detail below.

## Use cases and sample scenarios

[Sample transformations in Azure Monitor](/azure/azure-monitor/essentials/data-collection-transformations-samples) provides description and sample queries for common scenarios using ingestion-time transformations in Sentinel and Azure Monitor.

Scenarios that are particularly useful for Microsoft Sentinel include:

- [Reduce data costs.](/azure/azure-monitor/essentials/data-collection-transformations-samples#reduce-data-costs) Filter collection of data by either rows or columns to reduce ingestion and storage costs.

- [Normalization](/azure/azure-monitor/essentials/data-collection-transformations-samples#normalize-data). Normalize logs with the [Advanced Security Information Model (ASIM)](normalization.md) to improve the performance of normalized queries. For more information, see [Ingest-time normalization](normalization-ingest-time.md).

- [Enrich data](/azure/azure-monitor/essentials/data-collection-transformations-samples#enrich-data). Ingestion-time transformations let you improve analytics by enriching your data with extra columns added to the configured KQL transformation. Extra columns might include parsed or calculated data from existing columns.

- [Remove sensitive data](/azure/azure-monitor/essentials/data-collection-transformations-samples#remove-sensitive-data). Ingestion-time transformations can be used to mask or remove personal information such as masking all but the last digits of a social security number or credit card number.

## Data ingestion flow in Microsoft Sentinel

The following image shows where ingestion-time data transformation enters the data ingestion flow in Microsoft Sentinel. This data can be supported standard tables or in a specific set of custom tables.

Microsoft Sentinel collects data in the Log Analytics workspace from multiple sources. 

- Data collected from the Logs ingestion API endpoint or Azure Monitor agent (AMA) is processed by a specific DCR that may include an ingestion-time transformation. 

- Data from built-in data connectors is processed in Log Analytics using some combination of hardcoded workflows and ingestion-time transformations in the workspace DCR. 

:::image type="content" source="media/data-transformation/data-transformation-architecture.png" alt-text="Diagram of the Microsoft Sentinel data transformation architecture." lightbox="media/data-transformation/data-transformation-architecture.png"  border="false":::

## DCR support in Microsoft Sentinel

In Azure Monitor, data collection rules (DCRs) determine the data flow for different input streams. A data flow includes: the data stream to be transformed (standard or custom), the destination workspace and table, and an optional KQL transformation. 

Ingestion-time transformations are defined in DCRs, and Microsoft Sentinel's support for DCRs depends on the type of data connector you're using. 

- *Standard DCRs*, currently supported for AMA-based connectors and workflows using the [Logs ingestion API](/azure/azure-monitor/logs/logs-ingestion-api-overview). Each DCR contains the configuration for a particular data collection scenario, and multiple connectors or sources can share different DCRs.

- *Workspace transformation DCRs*, for workflows that don't currently use DCRs. Workspace transformation DCRs serves all the supported workflows in a workspace that don't otherwise use a DCR. It contains transformations for any [supported tables](/azure/azure-monitor/logs/tables-feature-support) that are applied to all traffic sent to that table.

For more in-depth information on custom logs, ingestion-time transformation, and data collection rules, see the articles linked in the [Related content](#related-content) section at the end of this article.

### DCR support for Microsoft Sentinel data connectors

The following table describes DCR support for Microsoft Sentinel data connector types:

| Data connector type | DCR support |
| ------------------- | ----------- |
| **Direct ingestion via [Logs ingestion API](/azure/azure-monitor/logs/logs-ingestion-api-overview)** | DCR specified in API call |
| [**Azure Monitor agent (AMA) logs**](connect-services-windows-based.md), such as: <li>[Windows Security Events via AMA](./data-connectors/windows-security-events-via-ama.md)<li>[Windows Forwarded Events](./data-connectors/windows-forwarded-events.md)<li>[CEF data](connect-cef-ama.md)<li>[Syslog data](connect-cef-syslog.md) | One or more DCRs associated with agent |
| [**Diagnostic settings-based connections**](connect-services-diagnostic-setting-based.md) | Workspace transformation DCR with [supported output tables](/azure/azure-monitor/logs/tables-feature-support) |
| **Built-in, service-to-service data connectors**, such as:<li>[Microsoft Office 365](connect-services-api-based.md)<li>[Microsoft Entra ID](connect-azure-active-directory.md)<li>[Amazon S3](connect-aws.md) | Workspace transformation DCR with [supported output tables](/azure/azure-monitor/logs/tables-feature-support) |
| **Built-in, API-based data connector**, such as: <li>[Codeless data connectors](create-codeless-connector.md) | DCR created for connector |
| **Built-in, API-based data connectors**, such as: <li>[Legacy codeless data connectors](create-codeless-connector-legacy.md)<li>[Azure Functions-based data connectors](connect-azure-functions-template.md) | Not currently supported |



## Limitations and considerations

- Transformations in Microsoft Sentinel have the same limitations as Azure Monitor. See [Limitations and considerations](/azure/azure-monitor/essentials/data-collection-transformations-create#limitations-and-considerations) for details.
- Log Analytic workspaces enabled for Microsoft Sentinel aren't subject to the [filtering ingestion charge](/azure/azure-monitor/essentials/data-collection-transformations#cost-for-transformations), regardless of how much data the transformation filters. 


## Related content

For more information, see:

- [Transform or customize data at ingestion time in Microsoft Sentinel (preview)](configure-data-transformation.md)
- [Microsoft Sentinel data connectors](connect-data-sources.md)
- [Find your Microsoft Sentinel data connector](data-connectors-reference.md)

For more in-depth information on ingestion-time transformation, the Custom Logs API, and data collection rules, see the following articles in the Azure Monitor documentation:

- [Data collection transformations in Azure Monitor Logs](/azure/azure-monitor/essentials/data-collection-transformations)
- [Logs ingestion API in Azure Monitor Logs](/azure/azure-monitor/logs/logs-ingestion-api-overview)
- [Data collection rules in Azure Monitor](/azure/azure-monitor/essentials/data-collection-rule-overview)
