---
title: SAP Templates
titleSuffix: Azure Data Factory
description: Overview of the SAP templates
author: ukchrist
ms.author: ulrichchrist
ms.service: data-factory
ms.custom: event-tier1-build-2022, ignite-2022
ms.topic: conceptual
ms.date: 07/20/2023
---

# SAP templates overview

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Azure Data Factory and Azure Synapse Analytics pipelines provide SAP templates to quickly get started with a pattern based approach for various SAP scenarios. 

See [pipeline templates](solution-templates-introduction.md) for an overview of pipeline templates.

## SAP templates summary

The following table shows the templates related to SAP connectors that can be found in the Azure Data Factory template gallery: 

| SAP Connector/Data Store | Scenario | Description |
| -- | -- | -- |
| SAP CDC | [Replicate multiple objects from SAP via SAP CDC](solution-template-replicate-multiple-objects-sap-cdc.md) | Use this template for metadata driven incremental loads from multiple SAP ODP sources to Delta tables in ADLS Gen 2 |
| SAP BW via Open Hub | [Incremental copy to Azure Data Lake Storage Gen 2](load-sap-bw-data.md) | Use this template to incrementally copy SAP BW data via LastRequestID watermark to ADLS Gen 2 |
| SAP HANA | Dynamically copy tables to Azure Data Lake Storage Gen 2 | Use this template to do a full copy of list of tables from SAP HANA to ADLS Gen 2 |
| SAP Table | Incremental copy to Azure Blob Storage | Use this template to incrementally copy SAP Table data via a date timestamp watermark to Azure Blob Storage |
