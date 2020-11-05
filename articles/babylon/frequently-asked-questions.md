---
title: Frequently asked questions (FAQ)
titleSuffix: Azure Purview
description: This article answers frequently asked questions about Azure Purview. 
author: SunetraVirdi
ms.author: suvirdi
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: conceptual
ms.date: 10/20/2020
---

# Frequently asked questions (FAQ) about Azure Purview

## Overview

Many organizations lack a holistic understanding of their data. It's challenging to understand what data exists, where data is located, and how to find and access relevant data. Data lacks context such as lineage, classification, and comprehensive metadata, making it difficult for business users to search for the right data and use that data appropriately. As a result, only a small fraction of collected data is used to inform business decisions. Finally, identifying data security issues and protecting sensitive data is inconsistent. It requires ongoing time and effort, especially while maintaining data agility.

Azure Purview is a data governance solution. It helps customers gain deep knowledge of all their data while maintaining control over its use. With Azure Purview, organizations discover and curate data. They gain insights into their data estate, and centrally govern access to data.

## Purpose of this FAQ

This FAQ answers common questions that customers and field teams often ask. It's intended to clarify questions about Azure Purview and related solutions, such as Azure Data Catalog (ADC) Gen 2 (deprecated) and Azure Information Protection.

## Audience of this FAQ

The audience for this FAQ is customers, Data & AI global black belt specialists, and other customer representatives from the field.

## What are the Azure data sources available for metadata scanning and classification?

|Data source |Availability|
|---------|---------|
|Azure Blob storage|Available|
|Azure Cognitive Search|Not available|
|Azure Cosmos DB|Available|
|Azure Databricks|Not available|
|Azure Data Explorer|Available|
|Azure Data Lake Storage Gen1|Available|
|Azure Data Lake Storage Gen2|Available|
|Azure Files|Available|
|Azure SQL Database|Available|
|Azure SQL Managed Instance|Available|
|Azure Synapse Analytics (SQL DW)|Available|
|Power BI|Not available|

## Are any non-Azure data sources available for metadata scanning?

No.

## What data systems/processors can we connect and get lineage?

|Data system/processor  |Availability|
|---------|---------|
|Azure Data Factory: Copy activity, Data Flow activity    |Available    |
|Custom lineage    |Available    |
|Azure Data Share    |Not available    |
|Power BI    |Not available    |
|SQL Server Integration Services    |Not available    |

## What data sources are supported by the insights classification report?

|Data source  |Availability |
|---------|---------|
|Amazon S3| Available|
|Azure Blob storage|Available|
|Azure Cosmos DB|Not available|
|Azure Data Lake Storage Gen1|Available|
|Azure Data Lake Storage Gen2| Available|
|Azure Files|Available|
|Azure SQL DB|Not available|
|Azure SQL Managed Instance|Not available|
|Azure Synapse Analytics|Not available|
|Power BI|Not available|
|SQL Server|Not available|

## How are ADC Gen 2, Azure Information Protection, and Azure Purview related?

Azure Purview originally began as ADC Gen 2 but has since broadened in scope. It now embraces the advanced catalog capabilities of ADC Gen 2 combined with the data classification, labeling, and compliance policy enforcement capabilities of Azure Information Protection. Today, it aligns more closely to the broader industry definition of data governance.

## What happens to customers using ADC Gen 1?

Azure Purview is the focus of all product innovation in the catalog solution space for Microsoft. ADC Gen 1 will continue to be supported.

## Can customers have multiple Azure Purview accounts in the same subscription?

Yes, we support many Azure Purview accounts per subscription and per tenant.

## What resources exist that can help me learn about Azure Purview?

- **Docs:** [Azure Purview documentation](overview.md)
- **Discussions:** For email support to customers by program managers and Friends of Azure, contact BabylonBabylonDiscussion@Microsoft.com.
- **Teams site:** Friends of Azure Purview
- **Sandbox environment for Azure Purview:** To get access to the [sandbox environment](https://aka.ms/babylondemo), request access to the Sandbox Security Group.
- **Microsoft Stream:** View the most recent Azure Purview [demo](https://msit.microsoftstream.com/video/b332a1ff-0400-aa75-8884-f1ea68ead103).

## Can I run ADC Gen 1 and Azure Purview in parallel?

Yes. Both are independent services.

## How do I migrate existing ADC Gen 1 data assets to Azure Purview?

Use the Azure Purview APIs to extract from ADC Gen 1 and ingest into Azure Purview. For the glossary, we support bulk tools based on CSV.

## How do I encrypt sensitive data for SQL tables using Azure Purview?

Data encryption is done at the data source level. Azure Purview stores only the metadata. It doesn't preview data.

## Will all the capabilities of ADC Gen 2 exist in Azure Purview?

Yes.

## Is the data lineage feature available in Azure Purview?

Yes, but it's limited to the Azure Data Factory connector.

## How can I scan SQL Server on-premises?

Use the self-host integration runtime capability. 

## What is the difference between classification in Azure SQL Database and classification in Azure Purview?

|Azure SQL DB classification  |Azure Purview classification  |
|---------|---------|
|Classification is based on SQL metadata from system catalogs. |Classification is based on Azure Purview's sampling technique by using the system-defined or custom-defined regex pattern.|
|Custom classification is supported.     |Custom classification is supported.         |
|Doesn't use Microsoft 365 system classifiers out of the box.    | Uses Microsoft 365 system classifiers out of the box.        |

## What's the difference between a glossary and classification?

A glossary uses a naming convention followed by non-technical/business users of the data, also known as data consumers. These types of people are business analysts or data scientists who use Azure Purview to search for certain types of data, based on business usage. For instance, supply chain analysts might need to search for the terms *SKU types* and *shipment details*. They search the glossary for these terms to find relevant data.
Classification is a tag applied to a data asset at the table, column, or file level, that identifies what data exists in the asset. Classification can be applied automatically or manually, based on the type of data found. Typically, you use classification tags to identify whether an asset contains sensitive data, and what type of sensitive data that might be.

## Can customer create a glossary hierarchy in Azure Purview?

No.

## Can I give a friendly name to a data asset in Azure Purview?

No.

## Can Azure Purview scan SharePoint?

Scanning for on-premises SharePoint sites and libraries is provided through the Azure Information Protection scanner. The scanner is available for use  through a customer's Microsoft 365 subscription with the following SKUs: AIP P1, EMS E3, and M365 E3. If you have any one of these SKUs, you should have the right entitlements to start using the Azure Information Protection scanner.

## What is the difference between classifications and labels in Azure Purview?

Azure Purview's data governance solution is based on the Apache Atlas framework. As defined by Atlas, classification is a way to identify the contents of an asset (table or file) or an entity (table column or structured file). This classification becomes a metadata property that allows Azure Purview to understand the data within each asset and govern and protect them.

Labels are a Microsoft 365 concept that resembles classification at the asset level. You create a label with a collection of classifications applied at the asset or entity level.

Atlas-centric customers will see no real distinction between classifications and labels. To these customers, everything is a classification and labels aren't needed.

Security-focused customers will see a distinction between classification and labeling, but only because in Microsoft 365 the classifications aren't exposed directly to the user; only labels are visible. So, similar to Atlas, Office 365 security customers don't need to deal with both entities.

## Can customers create a glossary hierarchy?

No.
