---
title: Transform or customize data at ingestion time in Microsoft Sentinel (preview)
description: Learn about how to configure Azure Monitor's ingestion-time data transformation for use with Microsoft Sentinel.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 02/27/2022


#Customer intent: As a security engineer, I want to configure ingestion-time data transformation and custom log ingestion so that I can control, filter, and enrich data before it is ingested into Microsoft Sentinel.

---

# Transform or customize data at ingestion time in Microsoft Sentinel (preview)

This article describes how to configure [ingestion-time data transformation and custom log ingestion](data-transformation.md) for use in Microsoft Sentinel.

Ingestion-time data transformation provides customers with more control over the ingested data. Supplementing the pre-configured, hardcoded workflows that create standardized tables, ingestion time-transformation adds the capability to filter and enrich the output tables, even before running any queries. Custom log ingestion uses the Custom Log API to normalize custom-format logs so they can be ingested into certain standard tables, or alternatively, to create customized output tables with user-defined schemas for ingesting these custom logs.

These two mechanisms are configured using Data Collection Rules (DCRs), either in the Log Analytics portal, or via API or ARM template. This article will help you choose which kind of DCR you need for your particular data connector, and direct you to the instructions for each scenario.

## Prerequisites

Before you start configuring DCRs for data transformation:

- **Learn more about data transformation and DCRs in Azure Monitor and Microsoft Sentinel**. For more information, see:

    - [Data collection rules in Azure Monitor](/azure/azure-monitor/essentials/data-collection-rule-overview)
    - [Logs ingestion API in Azure Monitor Logs (Preview)](/azure/azure-monitor/logs/logs-ingestion-api-overview)
    - [Transformations in Azure Monitor Logs (preview)](/azure/azure-monitor/essentials/data-collection-transformations)
    - [Data transformation in Microsoft Sentinel (preview)](data-transformation.md)

- **Verify data connector support**. Make sure that your data connectors are supported for data transformation.

    In our [data connector reference](data-connectors-reference.md) article, check the section for your data connector to understand which types of DCRs are supported. Continue in this article to understand how the DCR type you select affects the rest of the ingestion and transformation process.

## Determine your requirements

| If you are ingesting | Ingestion-time transformation is... | Use this DCR type |
| -------------------- | ---------------------------- | ----------------- |
| **Custom data** through <br>the [**Log Ingestion API**](/azure/azure-monitor/logs/logs-ingestion-api-overview) | <li>Required<li>Included in the DCR that defines the data model | Standard DCR |
| **Built-in data types** <br>(Syslog, CommonSecurityLog, WindowsEvent, SecurityEvent) <br>using the Azure Monitor Agent | <li>Optional<li>If desired, added to the DCR that configures how this data is being ingested | Standard DCR |
| **Built-in data types** <br>from most other sources | <li>Optional<li>If desired, added to the DCR attached to the Workspace where this data is being ingested | Workspace transformation DCR |



## Configure your data transformation

Use the following procedures from the Log Analytics and Azure Monitor documentation to configure your data transformation DCRs:

[Direct ingestion through the Log Ingestion API](/azure/azure-monitor/logs/logs-ingestion-api-overview):
- Walk through a tutorial for [ingesting logs using the Azure portal](/azure/azure-monitor/logs/tutorial-logs-ingestion-portal).
- Walk through a tutorial for [ingesting logs using Azure Resource Manager (ARM) templates and REST API](/azure/azure-monitor/logs/tutorial-logs-ingestion-api).

[Workspace transformations](/azure/azure-monitor/essentials/data-collection-transformations-workspace):
- Walk through a tutorial for [configuring workspace transformation using the Azure portal](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal).
- Walk through a tutorial for [configuring workspace transformation using Azure Resource Manager (ARM) templates and REST API](/azure/azure-monitor/logs/tutorial-workspace-transformations-api).- 

[More on data collection rules](/azure/azure-monitor/essentials/data-collection-rule-overview):
- [Structure of a data collection rule in Azure Monitor (preview)](/azure/azure-monitor/essentials/data-collection-rule-structure)
- [Data collection transformations in Azure Monitor (preview)](/azure/azure-monitor/essentials/data-collection-transformations)


When you're done, come back to Microsoft Sentinel to verify that your data is being ingested based on your newly configured transformation. It may take up to 60 minutes for the data transformation configurations to apply.


## Migrate to ingestion-time data transformation

If you currently have custom Microsoft Sentinel data connectors, or built-in, API-based data connectors, you may want to migrate to using ingestion-time data transformation.

Use one of the following methods:

- Configure a DCR to define, from scratch, the custom ingestion from your data source to a new table. You might use this option if you want to use a new schema that doesn't have the current column suffixes, and doesn't require query-time KQL functions to standardize your data.

    After you've verified that your data is properly ingested to the new table, you can delete the legacy table, as well as your legacy, custom data connector.

- Continue using the custom table created by your custom data connector. You might use this option if you have a lot of custom security content created for your existing table. In such cases, see [Migrate from Data Collector API and custom fields-enabled tables to DCR-based custom logs](/azure/azure-monitor/logs/custom-logs-migrate) in the Azure Monitor documentation.

## Next steps

For more information about data transformation and DCRs, see:

- [Custom data ingestion and transformation in Microsoft Sentinel (preview)](data-transformation.md)
- [Data collection transformations in Azure Monitor Logs (preview)](/azure/azure-monitor/essentials/data-collection-transformations)
- [Logs ingestion API in Azure Monitor Logs (Preview)](/azure/azure-monitor/logs/logs-ingestion-api-overview)
- [Structure of a data collection rule in Azure Monitor (preview)](/azure/azure-monitor/essentials/data-collection-rule-structure)
- [Configure data collection for the Azure Monitor Agent](/azure/azure-monitor/agents/azure-monitor-agent-data-collection)
