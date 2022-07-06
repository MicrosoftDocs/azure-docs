---
title: SAP change data capture solution (Preview) - introduction and architecture
titleSuffix: Azure Data Factory
description: This topic introduces and describes the architecture for SAP change data capture (Preview) in Azure Data Factory.
author: ukchrist
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.date: 06/01/2022
ms.author: ulrichchrist
---

# SAP change data capture (CDC) solution in Azure Data Factory (Preview)

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This topic introduces and describes the architecture for SAP change data capture (Preview) in Azure Data Factory.

## Introduction

Azure Data Factory (ADF) is a data integration (ETL/ELT) Platform as a Service (PaaS) and for SAP data integration, ADF currently offers six connectors: 

:::image type="content" source="media/sap-change-data-capture-solution/sap-supported-cdc-connectors.png" alt-text="Shows a list of the supported connectors for the SAP CDC solution.":::

These connectors can only extract data in batches, where each batch treats old and new data equally w/o identifying data changes (“batch mode”).  This extraction mode isn’t optimal when dealing w/ large data sets, such as tables w/ millions/billions records, that change often.  To keep your copy of SAP data fresh/up-to-date, frequently extracting it in full is expensive/inefficient.  There’s a manual and limited workaround to extract mostly new/updated records, but this process requires a column w/ timestamp/monotonously increasing values and continuously tracking the highest value since last extraction (“watermarking”).  Unfortunately, some tables have no column that can be used for watermarking and this process can’t handle deleted records.

Consequently, our customers have been asking for a new connector that can extract only data changes (inserts/updates/deletes = “deltas”), leveraging the CDC feature that exists in most SAP systems (in “CDC mode”).  After gathering their requirements, we’ve decided to build a new SAP ODP connector leveraging SAP Operational Data Provisioning (ODP) framework.  This new connector can connect to all SAP systems that support ODP, such as R/3, ECC, S/4HANA, BW, and BW/4HANA, directly at the application layer or indirectly via SAP Landscape Transformation (SLT) replication server as a proxy.  It can fully/incrementally extract SAP data that includes not only physical tables, but also logical objects created on top of those tables, such as Advanced Business Application Programming (ABAP) Core Data Services (CDS) views, w/o watermarking.  Combined w/ existing ADF features, such as copy + data flow activities, pipeline templates, and tumbling window triggers, we can offer low-latency SAP CDC/replication solution w/ self-managed pipeline experience.

This document provides a high-level architecture of our SAP CDC solution in ADF, the prerequisites and step-by-step guidelines to preview it, and its current limitations.

## Architecture

The high-level architecture of our SAP CDC solution in ADF is divided into two sides, left-hand-side (LHS) and right-hand-side (RHS).  LHS includes SAP ODP connector that invokes ODP API over standard Remote Function Call (RFC) modules to extract raw SAP data (full + deltas).  RHS includes ADF copy activity that loads the raw SAP data into any destination, such as Azure Blob Storage/Azure Data Lake Store (ADLS) Gen2, in CSV/Parquet format, essentially archiving/preserving all historical changes.  RHS can also include ADF data flow activity that transforms the raw SAP data, merges all changes, and loads the result into any destination, such as Azure SQL Database/Azure Synapse Analytics, essentially replicating SAP data.  ADF data flow activity can also load the result into ADLS Gen2 in Delta format, enabling time-travel to produce snapshots of SAP data at any given periods in the past.  LHS and RHS can be combined as SAP CDC/replication template to auto-generate ADF pipeline that can be frequently run using ADF tumbling window trigger to replicate SAP data into Azure w/ low latency and w/o watermarking.

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-architecture-diagram.png" alt-text="Shows a diagram of the architecture of SAP CDC.":::

ADF copy activity w/ SAP ODP connector runs on a self-hosted integration runtime (SHIR) that you install on your on-premises/virtual machine, so it has a line of sight to your SAP source systems/SLT replication server, while ADF data flow activity runs on a serverless Databricks/Spark cluster, Azure IR.  SAP ODP connector via ODP can extract various data source (“provider”) types, such as:

-	SAP extractors, originally built to extract data from SAP ECC and load it into SAP BW
-	ABAP CDS views, the new data extraction standard for SAP S/4HANA
-	InfoProviders and InfoObjects in SAP BW and BW/4HANA
-	SAP application tables, when using SLT replication server as a proxy

These providers run on SAP systems to produce full/incremental data in Operational Delta Queue (ODQ) that is consumed by ADF copy activity w/ SAP ODB connector in ADF pipeline (“subscriber”).

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-shir-architecture-diagram.png" alt-text="Shows a diagram of the architecture of SAP CDC through the self-hosted integration runtime (SHIR).":::

Since ODP completely decouples providers from subscribers, any SAP docs that offer provider configurations are applicable for ADF as a subscriber.  For more info on ODP, see [Introduction to operational data provisioning](https://wiki.scn.sap.com/wiki/display/BI/Introduction+to+Operational+Data+Provisioning). 

## Next steps

[Prerequisites and configuration of the SAP CDC solution](sap-change-data-capture-prerequisites-configuration.md)