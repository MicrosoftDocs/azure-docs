---
title: SAP change data capture solution (preview) - introduction and architecture
titleSuffix: Azure Data Factory
description: This article introduces and describes the architecture for SAP change data capture (preview) in Azure Data Factory.
author: ukchrist
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.date: 06/01/2022
ms.author: ulrichchrist
---

# SAP change data capture solution in Azure Data Factory (preview)

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article introduces and describes the architecture for SAP change data capture (preview) in Azure Data Factory.

## Introduction

Azure Data Factory is a data integration (ETL/ELT) platform as a service (PaaS) and for SAP data integration, Data Factory currently offers six connectors:

:::image type="content" source="media/sap-change-data-capture-solution/sap-supported-cdc-connectors.png" alt-text="Shows a list of the supported connectors for the SAP CDC solution.":::

These connectors can only extract data in batches, where each batch treats old and new data equally w/o identifying data changes (*batch mode*). This extraction mode isn’t optimal when dealing with large datasets like tables that have millions or billions of records that change often. To keep your copy of SAP data fresh and up-to-date, frequently extracting the dataset in full is expensive and inefficient. You can use a manual, limited workaround to extract mostly new or updated records. The process requires a timestamp column, monotonously increasing values, and continuously tracking the highest value since the last extraction, called *watermarking*. Unfortunately, some tables don't have a column that you can use for watermarking, and this process can’t handle deleted records.

Consequently, our customers have been asking for a new connector that can extract only data changes or *deltas*. Deltas consist of inserts, updates, and deletes. leveraging the CDC feature that exists in most SAP systems (in “CDC mode”). After gathering their requirements, we’ve decided to build a new SAP ODP connector leveraging SAP Operational Data Provisioning (ODP) framework.

The new connector connects to all SAP systems that support ODP, including R/3, ECC, S/4HANA, BW, and BW/4HANA. The connector works directly at the application layer or indirectly via an SAP Landscape Transformation (SLT) replication server as a proxy. It can either fully or incrementally extract SAP data that includes not only physical tables, but also logical objects created on top of those tables without watermarking. An example is Advanced Business Application Programming (ABAP) Core Data Services (CDS) views. Combined w/ existing Data Factory features, such as copy + data flow activities, pipeline templates, and tumbling window triggers, we can offer low-latency SAP CDC/replication solution w/ self-managed pipeline experience.

This article provides a high-level architecture of the Azure SAP CDC solution in Data Factory, prerequisites, and step-by-step guidelines to preview it and its current limitations.

## Architecture

The high-level architecture of our SAP CDC solution in Data Factory is divided into two sides, left-hand-side (LHS) and right-hand-side (RHS). LHS includes SAP ODP connector that invokes ODP API over standard Remote Function Call (RFC) modules to extract raw SAP data (full + deltas). RHS includes the Data Factory copy activity that loads the raw SAP data into any destination, such as Azure Blob Storage or Azure Data Lake Storage Gen2, in CSV/Parquet format, essentially archiving/preserving all historical changes. RHS can also include Data Factory data flow activity that transforms the raw SAP data, merges all changes, and loads the result into any destination, such as Azure SQL Database or Azure Synapse Analytics, essentially replicating SAP data. The Data Factory data flow activity also can load the result into Data Lake Storage Gen2 in Delta format, enabling time-travel to produce snapshots of SAP data at any specific periods in the past. LHS and RHS can be combined as SAP CDC/replication template to auto-generate Data Factory pipeline that can be frequently run by using a Data Factory tumbling-window trigger to replicate SAP data into Azure with low latency and without watermarking.

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-architecture-diagram.png" border="false" alt-text="Diagram of the architecture of SAP CDC.":::

The Data Factory copy activity with SAP ODP connector runs on a self-hosted integration runtime that you install on your on-premises computer or virtual machine, so it has a line of sight to your SAP source systems and the SLT replication server. The Data Factory data flow activity runs on a serverless Azure Databricks or Apache Spark cluster, Azure IR. SAP ODP connector via ODP can extract various data source (“provider”) types, such as:

- SAP extractors, originally built to extract data from SAP ECC and load it into SAP BW
- ABAP CDS views, the new data extraction standard for SAP S/4HANA
- InfoProviders and InfoObjects in SAP BW and BW/4HANA
- SAP application tables, when using SLT replication server as a proxy

These providers run on SAP systems to produce either full or incremental data in Operational Delta Queue (ODQ) that is consumed by the Data Factory copy activity with the SAP ODB connector in the Data Factory pipeline (*subscriber*).

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-shir-architecture-diagram.png" border="false" alt-text="Diagram of the architecture of SAP CDC through the self-hosted integration runtime.":::

Because ODP completely decouples providers from subscribers, any SAP documentation that offers provider configurations are applicable for Data Factory as a subscriber. For more information about ODP, see [Introduction to operational data provisioning](https://wiki.scn.sap.com/wiki/display/BI/Introduction+to+Operational+Data+Provisioning).

## Next steps

[Prerequisites and configuration of the SAP CDC solution](sap-change-data-capture-prerequisites-configuration.md)