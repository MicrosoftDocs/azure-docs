---
title: SAP knowledge center overview
titleSuffix: Azure Data Factory
description: Overview of the ADF SAP Knowledge Center and ADF SAP IP
author: ukchrist
ms.author: ulrichchrist
ms.service: data-factory
ms.custom: event-tier1-build-2022, ignite-2022
ms.topic: conceptual
ms.date: 01/11/2023
---

# SAP knowledge center overview

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Azure Data Factory and Azure Synapse Analytics pipelines provide a collection of assets to power your SAP workloads. These assets include SAP connectors and templates as well upcoming solution accelerators provided by both Microsoft and partners. The SAP knowledge center is a consolidated location summarizing the available assets along with giving a comparison of when to use which solution.

## SAP connectors

Azure Data Factory and Synapse pipelines support extracting data using the following SAP connectors

- SAP Business Warehouse Open Hub
- SAP Business Warehouse via MDX
- SAP CDC
- SAP Cloud for Customer
- SAP ECC
- SAP HANA
- SAP Table

 For a more detailed breakdown of each SAP connector along with prerequisites, see [SAP connectors](industry-sap-connectors.md).

## SAP templates

Azure Data Factory and Synapse pipelines provide templates to help accelerate common patterns by creating pipelines and activities for you that just need to be connected to your SAP data sources.

See [pipeline templates](solution-templates-introduction.md) for an overview of pipeline templates.

Templates are offered for the following scenarios
- Incrementally copy from SAP BW to ADLS Gen 2
- Incrementally copy from SAP Table to Blob
- Dynamically copy multiple tables from SAP HANA to ADLS Gen 2

For a summary of the SAP specific templates and how to use them see [SAP templates](industry-sap-templates.md).


## SAP whitepaper

To learn about overall support for the SAP data integration scenario, see [SAP data integration whitepaper](https://github.com/Azure/Azure-DataFactory/blob/master/whitepaper/SAP%20Data%20Integration%20using%20Azure%20Data%20Factory.pdf) with detailed introduction on each SAP connector, comparison and guidance.
