---
title: Ingestion-time data transformation in Microsoft Sentinel
description: Learn about how Azure Monitor's ingestion-time data transformation features can help you stream custom data into Microsoft Sentinel.
author: yelevin
ms.author: yelevin
ms.topic: conceptual
ms.date: 02/17/2022
---

# Data transformation in Microsoft Sentinel

Azure Monitor's Log Analytics serves as the platform behind the Microsoft Sentinel workspace. All logs ingested into Microsoft Sentinel are stored in Log Analytics by default. From Microsoft Sentinel, you can access the stored logs and run Kusto Query Language (KQL) queries to detect threats and monitor your network activity.

Log Analytics supports ingestion-time data processing, which gives you more control over the data that gets ingested. Ingestion-time processing uses **data collection rules (DCRs)** to act on your data even before it's stored in your workspace, allowing you to filter and enrich standard tables and to create highly customizable tables for storing data from sources that produce unique log formats.

Microsoft Sentinel supports two types of ingestion-time data processing:

- **Ingestion-time transformation** uses DCRs to apply basic KQL queries to transform your data, either by filtering out irrelevant data, enriching existing data with analytics or external data, or masking sensitive or personal information.

- The **custom logs API** uses DCRs to normalize custom log formats so they can be ingested into standard tables. Alternatively, the API lets you create fully customizable output tables, specifying column names and types, to accept custom logs.

These two types will be explained in more detail below.

## Use cases and sample scenarios

### Filtering

Ingestion-time transformation provides you with the ability to filter out irrelevant data even before it's first stored in your workspace.

You can filter at the record (row) level, by specifying criteria for which records to include, or at the field (column) level, by removing the content for specific fields. Filtering out irrelevant data can:

- Help to reduce costs, as you reduce storage requirements
- Improve performance, as fewer query-time adjustments are needed

Ingestion-time data transformation supports [multiple-workspace scenarios](extend-sentinel-across-workspaces-tenants.md). You would create separate DCRs for each workspace.

### Enrichment and tagging

Ingestion-time transformation also lets you improve analytics by enriching your data with extra columns. Extra columns might include parsed or calculated data from existing columns, or data taken from data structures created on-the-fly, and added to the configured KQL transformation.

For example, you could add extra information such as external HR data, an expanded event description, or classifications that depend on the user, location, or activity type.

### Obfuscation

Ingestion-time transformations can also be used to mask or remove personal information. For example, you might use data transformation to mask all but the last digits of a social security number or credit card number, or you could replace other types of personal data with nonsense, standard text, or dummy data. Mask your personal information at ingestion time to increase security across your network.

## Data ingestion flow in Microsoft Sentinel

The following image shows where ingestion-time data processing enters the data ingestion flow into Microsoft Sentinel.

Microsoft Sentinel data connectors collect data into the Log Analytics workspace, where it's processed using some combination of hardcoded workflows, ingestion-time transformations, and DCR-based custom logs, and then stored in both standard and custom tables accessible from Microsoft Sentinel.

:::image type="content" source="media/data-transformation/data-transformation-architecture.png" alt-text="Diagram of the Microsoft Sentinel data transformation architecture.":::

## DCR support in Microsoft Sentinel

In Log Analytics, data collection rules (DCRs) determine the data flow for different input streams. A data flow includes: the data stream to be transformed (standard or custom), the destination workspace, the KQL transformation, and the output table. For standard input streams, the output table is the same as the input stream.

Support for DCRs in Microsoft Sentinel includes:

- *Standard DCRs*, currently supported only for AMA-based connectors and the custom logs workflow. 

    Each connector or log source workflow gets its own standard DCR.

- *Workspace transformation DCRs*, for workflows that don't currently support standard DCRs.

    A single *workspace transformation DCR* serves all the workflows in a workspace that aren't served by standard DCRs. A workspace can have only one *workspace transformation DCR*, but that DCR contains separate transformations for each input stream. Default DCRs are also supported for specific tables only.

    Workspace transformation DCRs can be created using the Log Analytics portal, but once created, they can be edited only using the Log Analytics API or ARM template.

Microsoft Sentinel's support for ingestion-time transformation depends on the type of data connector you're using.

The following table describes DCR support for Microsoft Sentinel data connector types:

| Data connector type | DCR support |
| ------------------- | ----------- |
| [**AMA standard logs**](connect-azure-windows-microsoft-services.md?tabs=AMA#windows-agent-based-connections), such as: <li>[Windows Security Events via AMA](data-connectors-reference.md#windows-security-events-via-ama)<li>[Windows Forwarded Events](data-connectors-reference.md#windows-forwarded-events-preview)<li>[CEF data](connect-common-event-format.md)<li>[Syslog data](connect-syslog.md)   | Standard DCRs |
| [**MMA standard logs**](connect-azure-windows-microsoft-services.md?tabs=LAA#windows-agent-based-connections), such as <li>[Syslog data](connect-syslog.md)<li>[CommonSecurityLog](connect-azure-windows-microsoft-services.md) | Workspace transformation DCRs |
| [**Diagnostic settings-based connections**](connect-azure-windows-microsoft-services.md#diagnostic-settings-based-connections)               | Workspace transformation DCRs, based on the specific data connector's output tables   |
| **Built-in, service-to-service data connectors**, <li>such as [Amazon S3](connect-aws.md)                                                  | Workspace transformation DCRs, based on the specific data connector's output tables   |
| **Custom, [direct API](connect-rest-api-template.md) or [Logstash](connect-logstash.md)-based data connectors**                              | Standard DCRs                                         |
| **Built-in, API-based data connectors**, such as: <li>[Codeless data connectors](create-codeless-connector.md)<li>[Azure Functions-based data connectors](connect-azure-functions-template.md) | Not currently supported        |
|            |         |

## Data transformation support for custom data connectors

If you've created custom data connectors for Microsoft Sentinel, you can still use DCRs to configure how the data will be parsed and stored in your workspace.

Only the following tables are currently supported for custom log ingestion: **WindowsEvent**, **SecurityEvent**, **CommonSecurityLog**, and **Syslog**

## Known issues

Ingestion-time data transformation currently has the following known issues for Microsoft Sentinel data connectors:

- Data transformations with default DCRs are supported only per table, and not per connector.

    For example, consider a DCR transformation for an MMA-based data connector sending data to a Syslog table. The same DCR is used for all other MMA connectors sending data for Syslog tables.

- While you can create your first default DCR using the Log Analytics portal, you can only edit it via API or ARM template.

    So this means, for example, that if you create a DCR to transform Syslog data for a specific MMA-based data connector, and you'd like to modify it to support another MMA-based data connector, you'll need to use API calls to make that modification.

- The following configurations are supported only via API:

    - Standard DCRs, for AMA-based connectors like [Windows Security Events via AMA](data-connectors-reference.md#windows-security-events-via-ama) and [Windows Forwarded Events](data-connectors-reference.md#windows-forwarded-events-preview), are supported only via API.

    - Data transformation configuration for custom log ingestion to a standard table

- It make take up to 60 minutes for the data transformation configurations to apply.

- KQL syntax: Not all operators are supported. For more information, see [Supported KQL features](/azure/azure-monitor/essentials/data-collection-rule-transformations#supported-kql-features) in the Azure Monitor documentation.

- Custom logs can currently be sent only to the following tables: **WindowsEvent**, **SecurityEvent**, **CommonSecurityLog**, and **Syslog**

## Next steps

Learn more about ingestion-time data transformation. For more information, see [Configure ingestion-time data transformation for Microsoft Sentinel](configure-data-transformation.md).

Link to LA docs

Learn more about Microsoft Sentinel data connector types. For more information, see:

- [Microsoft Sentinel data connectors](connect-data-sources.md)
- [Find your Microsoft Sentinel data connector](data-connectors-reference.md)
