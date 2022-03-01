---
title: Transform or customize data at ingestion time in Microsoft Sentinel
description: Learn about how to configure Azure Monitor's ingestion-time data transformation for use with Microsoft Sentinel.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 02/27/2022
---

# Transform or customize data at ingestion time in Microsoft Sentinel

This article describes how to configure [ingestion-time data transformation and custom log ingestion](data-transformation.md) for use in Microsoft Sentinel.

Ingestion-time data transformation provides customers with more control over the ingested data. Supplementing the pre-configured, hardcoded workflows that create standardized tables, ingestion time-transformation adds the capability to filter and enrich the output tables, even before running any queries. Custom log ingestion uses the Custom Log API to normalize custom-format logs so they can be ingested into certain standard tables, or alternatively, to create customized output tables with user-defined schemas for ingesting these custom logs.

These two mechanisms are configured using Data Collection Rules (DCRs), either in the Log Analytics portal, or via API or ARM template. This article will help you choose which kind of DCR you need for your particular data connector, and direct you to the instructions for each scenario.

## Prerequisites

Before you start configuring DCRs for data transformation:

- **Learn more about data transformation and DCRs in Azure Monitor and Microsoft Sentinel**. For more information, see:

    - [Data collection rule transformations in Azure Monitor (preview)](../azure-monitor/essentials/data-collection-rule-transformations.md)
    - [Ingestion-time transformations in Azure Monitor Logs (preview)](../azure-monitor/logs/ingestion-time-transformations.md)
    - [Data transformation in Microsoft Sentinel](data-transformation.md)

- **Verify data connector support**. Make sure that your data connectors are supported for data transformation.

    In our [data connector reference](data-connectors-reference.md) article, check the section for your data connector to understand the types of DCRs and data transformation supported.

## Configure your data transformation

Use the following procedures from the Log Analytics and Azure Monitor documentation to configure your data transformation DCRs:

TBD list of links

When you're done, come back to Microsoft Sentinel to verify that your data is being ingested based on your newly-configured transformation. It make take up to 60 minutes for the data transformation configurations to apply.


## Migrate to ingestion-time data transformation

If you currently have custom Microsoft Sentinel data connectors, or built-in, API-based data connectors, you may want to migrate to using ingestion-time data transformation.

Use one of the following methods:

- Configure a DCR to define the custom ingestion from your data source from scratch, to a new table. You might use this option if you want to use a new schema, that doesn't have the current column suffixes, and doesn't require query-time KQL functions to standardize your data.

    After you've verified that your data is properly ingested to the new table, you can delete the legacy table, as well as your legacy, custom data connector.

- Continue using the custom table created by your custom data connector. You might use this option if you have a lot of custom security content created for your existing table. In such cases, TBD link to LA MIGRATION GUIDE.

## Next steps

For more information about data transformation and DCRs, see:

TBD list

