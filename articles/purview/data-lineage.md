---
title: Data lineage in Azure Purview
description: Describes the concepts for data lineage. 
author: chanuengg
ms.author: csugunan
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: conceptual
ms.date: 11/30/2020
---

# Data lineage in Azure Purview Data Catalog client

This document provides an overview of how data lineage is managed in the Azure Purview Data Catalog. It also details how data systems can integrate with the catalog to capture lineage of data. The data being tracked can come from different platforms and phases of transformation, including: landing zone (on-premises or multi-cloud), to raw, cooked zone and finally to visualization platforms.

## Use Cases

Data lineage is broadly understood as the lifecycle that spans the data’s origin, and where it moves over time across the data estate. It is used for different kinds of backwards-looking scenarios such as troubleshooting, tracing root cause in data pipelines and debugging. Lineage is also used for data quality analysis, auditing/compliance and “what if” scenarios often referred to as impact analysis. Lineage is represented visually to show data moving from source to destination including how the data was transformed throughout. Given the complexity of most enterprise data environments, these views can be indecipherable without doing some consolidation or masking of peripheral data points. 

## Lineage experience in Data Catalog

Data catalog will connect with other data processing, storage, and analytics systems to extract bespoke lineage. The information is combined to represent a generic, scenario-specific lineage experience in the catalog.

:::image type="content" source="media/concept-lineage/lineage-end-end.png" alt-text="end-end lineage showing data copied from blob store all the way to Power BI dashboard":::

A typical data estate of a customer would involve systems doing data extraction, transformation/load (ETL/ELT systems), analytics, and visualization systems. Each of the systems captures rich static and operational metadata that describes the state and quality of the data within the systems boundary. The goal of Lineage feature in Data catalog is to extract the movement, transformation, and operational metadata from each data system at the lowest grain possible. Once the metadata is gathered, tread it carefully at different grain to help answer a broad range of technical and business questions.

The following example is a typical use case of data moving across desperate systems, where data catalog would connect to each of the systems for lineage.

- Data Factory copies data from on-prem/raw zone to a landing zone in the cloud. 
- Data processing systems like Synapse, Databricks would process and transform data from landing zone to Curated zone using notebooks.
- Further processing of data into analytical models for optimal query performance and aggregation. 
- Data visualization systems will consume the datasets and process through their meta model to create a BI Dashboard, ML experiments and so on.

## Lineage granularity

This section covers the details about the granularity of which the lineage information is gathered by a data catalog. This granularity can vary based on the data systems which are being.

###	Entity level lineage: Source(s) > Process > Target(s) 

- Lineage is represented as a graph, typically it contains source and target entities in Data storage systems that are connected by a process invoked by a compute system. 
- Data systems connect to the data catalog to generate and report a unique object referencing the physical object of the underlying data system for example: SQL Stored procedure, notebooks, and so on.
- High fidelity lineage with additional metadata like ownership is captured to show the lineage in a human readable format for source & target entities. for example:  lineage at a hive table level instead of partitions or file level.

### Column or attribute level lineage

Identify attribute(s) of a source entity that is used to create or derive attribute(s) in the target entity. The name of the source attribute could be retained or renamed in a target. Systems like ADF can do a one-one copy from on-premises environment to the cloud. For example: `Table1/ColumnA -> Table2/ColumnA`.

###	Process execution status

To support root cause analysis and data quality scenarios, we capture the execution status of the jobs in data processing systems. This requirement has nothing to do with replacing the monitoring capabilities of other data processing systems, neither the goal is to replace them. 

## Summary

Lineage is a critical feature of the Purview Data Catalog to support quality, trust, and audit scenarios. The goal of a data catalog is to build a robust framework where all the data systems within your environment can naturally connect and report lineage. Once the metadata is available, the data catalog can bring together the metadata provided by data systems to power data governance use cases.

## Next steps

* [Quickstart: Create an Azure Purview account in the Azure portal](create-catalog-portal.md)
* [Quickstart: Create an Azure Purview account using Azure PowerShell/Azure CLI](create-catalog-powershell)
* [Quickstart: Use Purview Studio](use-purview-studio.md)