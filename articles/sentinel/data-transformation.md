---
title: Ingestion-time data transformation in Microsoft Sentinel
description: Learn about how Azure Monitor's ingestion-time data transformation features can help you stream custom data into Microsoft Sentinel.
author: batamig
ms.author: bagol
ms.topic: conceptual
ms.date: 02/01/2022
---

# Data transformation in Microsoft Sentinel

Azure Monitor's Log Analytics serves as the platform behind the Microsoft Sentinel workspace. All logs streamed into Microsoft Sentinel are stored in Log Analytics by default. From Microsoft Sentinel, you can access the ingested logs and run Kusto Query Language (KQL) queries to investigate threats and monitor your network activity.

Log Analytics supports ingestion-time data transformation, which provides customers with more control over the ingested data. Instead of relying on pre-configured, hardcoded workflows that create standardized tables, ingestion time-transformation supports the ability to filter and enrich the output tables, even before running any queries. Data collection rules (DCRs) provide extra support for creating customized output tables, including specific column names and types.

## Use cases and sample scenarios

### Filtering

Ingestion-time transformation provides you with the ability to filter out irrelevant data before it's even stored in your workspace.

You can filter at the record level, or the column level, by removing the content for specific fields. Filtering out irrelevant data can:

- Help to reduce costs, as you reduce storage requirements
- Improve analytics and enrich your data with extra information, standardized according to your SOC teams' needs
- Improve performance, as fewer query-time adjustments are needed

You can also use ingestion-time data transformation when working with multiple workspaces. When you configure your data connections, use different filters for each workspace.

### Enrichment and tagging

Ingestion-time transformation also provides the ability to enrich your data with extra columns. Extra columns might include parsed data from other columns, or columns of data taken from static tables, and added to the configured KQL transformation.

For example, add extra information such as owner entities, an expanded event description, or classifications that depend on the user, location, or activity type.

### Obfuscation

Ingestion-time transformations can also be used to mask or remove personal information.. For example, you might use data transformation to mask the last numbers of a social security number or credit card, or you could replace other types of personal data with nonsense or standard text. Mask your personal information at the ingestion time to increase security across your network.


## Data transformation flow in Microsoft Sentinel

The following image shows where ingestion-time data transformation enters the data ingestion flow into Microsoft Sentinel.

Microsoft Sentinel data connectors collect data into the Log Analytics workspace, where it's processed using both hardcoded workflows and DCR-based custom logs, and then stored in both standard and custom tables accessible from Microsoft Sentinel.

:::image type="content" source="media/data-transformation/data-transformation-architecture.png" alt-text="Diagram of the Microsoft Sentinel data transformation architecture.":::

## DCR support in Microsoft Sentinel

In Log Analytics, data collection rules (DCRs) determine the data flow for different input streams. Each data flow includes: the data stream to be transformed (standard or custom), the destination workspace, the KQL transformation, and the output table. For standard input streams, the output table is the same as the input stream.

Support for DCRs in Microsoft Sentinel includeS:

- *Standard* DCRs<!--native? normal?-->, currently supported only for AMA-based connectors and the custom logs workflow.

- *Workspace transformation* DCRs, for workflows that don't currently support standard DCRs.

    Use workspace DCRs to create a default DCR to use across your workspace. One default DCR is supported for each workspace, with one transformation for each input stream. Default DCRs are also supported for specific tables only.

    Default DCRs can be created using the Log Analytics portal, and edited using the Log Analytics API or ARM template.

Microsoft Sentinel's support for ingestion-time transformation depends on the type of data connector you're using.

The following table describes DCR support for Microsoft Sentinel data connector types:

|Data connector type    |DCR support  |
|------------------|------------------|
|**AMA standard logs**, such as: <br> - [Windows Security Events via AMA](data-connectors-reference.md#windows-security-events-via-ama)<br>- [Windows Forwarded Events](data-connectors-reference.md#windows-forwarded-events-preview)<br>- [CEF data](connect-common-event-format.md) <br>- [Syslog data](connect-syslog.md)             |  Standard DCRs       |
|**MMA standard logs**, such as <br>- [Syslog data](connect-syslog.md) <br>- [CommonSecurityLog](connect-azure-windows-microsoft-services.md)            |         |
|[**Diagnostic settings-based connections**](connect-azure-windows-microsoft-services.md#diagnostic-settings-based-connections)       |  Default DCRs, based on the specific data connector's output tables       |
|**Built-in, service-to-service data connectors**, such as [Amazon S3](connect-aws.md)            |Default DCRs, based on the specific data connector's output tables        |
|**Custom, [direct API](connect-rest-api-template.md) or [Logstash](connect-logstash.md)-based data connectors**    |  Standard DCRs      |         |
|**Built-in, API-based data connectors**, such as: <br>- [Codeless data connectors](create-codeless-connector.md)<br>- [Azure Functions-based data connectors](connect-azure-functions-template.md)           | Not currently supported        |
|            |         |

## Data transformation support for custom data connectors

If you've created custom data connectors for Microsoft Sentinel, you can still use DCRs for ingestion-time data transformation.

When using DCRs with custom connectors, data is ingested similarly to custom log ingestion, such as with built-in data connectors that use direct API, Azure Functions, or Logstash.

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

- KQL syntax: Not all operators are supported. For more information, see TBD.

- Custom logs can currently be sent only to the following tables: **WindowsEvent**, **SecurityEvent**, **CommonSecurityLog**, and **Syslog**

## Next steps

Learn more about ingestion-time data transformation. For more information, see <x>.

Link to LA docs

Learn more about Microsoft Sentinel data connector types. For more information, see:

- [Microsoft Sentinel data connectors](connect-data-sources.md)
- [Find your Microsoft Sentinel data connector](data-connectors-reference.md)
