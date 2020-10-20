---
title: Frequently asked questions (FAQ)
description: This article answers frequently asked questions (FAQ), which clarifies information about Azure Babylon. 
author: SunetraVirdi
ms.author: suvirdi
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: conceptual
ms.date: 10/20/2020
---

# Frequently asked questions (FAQ)

## Overview

Many organizations lack a holistic understanding of their data. It's challenging to understand what data exists, where data is located, and how to find and access relevant data. Data lacks context such as lineage, classification, and comprehensive metadata, making it difficult for business users to search for the right data and use that data appropriately. As a result, only a small fraction of collected data is used to inform business decisions. Finally, identifying data security issues and protecting sensitive data is inconsistent and requires ongoing time and effort, especially while maintaining data agility.

Azure Babylon is a data governance solution, which helps customers gain deep knowledge of all their data while maintaining control over its use. With Azure Babylon, organizations discover and curate data, gain insights into their data estate, and centrally govern access to data.

### Purpose of this FAQ

This FAQ is intended to clarify questions regarding Azure Babylon and related solutions such as Azure Data Catalog Gen 2 (now deprecated) and Azure Information Protection. The following FAQ answers common questions that customers and field teams often ask.  

### Audience of this FAQ

The audience for this FAQ is customers, Data & AI global black belt specialists, and other customer representatives from the field.

### What are the Azure data sources available for metadata scanning and classification?

|Data source |Availability|
|---------|---------|
|Azure SQL DB|Available|
|ADLS Gen 1|Available|
|ADLS Gen 2|Available|
|Azure Data Explorer|Available|
|Cosmos DB|Available|
|Synapse (SQL DW)|Available|
|Synapse|Not available|
|Data Bricks|Not available|
|Power BI|Not available|
|Azure Search|Available|

### What are the non-Azure data sources available for metadata scanning?

|Data source  |Availability |
|---------|---------|
|Amazon S3|Not available|
|Teradata|Not available|
|SAP S/4 HANA|Not available|
|Hive Metastore|Not available|
|SAP ECC|Not available|
|Salesforce|Not available|
|Oracle|Not available|

### What data systems/processors can we connect and get lineage?

|Data processors  |Availability|
|---------|---------|
|Azure Data Factory - Copy activity, Dataflow activity    |Available    |
|Azure Data Share    |Not available    |
|SSIS    |Not available    |
|Power BI    |Not available    |
|Custom Lineage    |Available    |

### What data sources are supported by the insights classification report?

|Data source  |Availability |
|---------|---------|
|Azure Blob Storage|Available|
|Azure Files|Available|
|ADLS Gen 1|Available|
|ADLS Gen 2| Available|
|Amazon S3|Available|
|Power BI|Not available|
|Azure SQL DB|Not available|
|Azure Cosmos DB|Not available|
|Azure Synapse Analytics|Not available|
|SQL Server|Not available|
|Azure SQL DB-managed instance|Not available|

### How are ADC Gen 2, Azure Information Protection, and Azure Babylon related?

Azure Babylon originally began as Azure Data Catalog Gen 2 but has since broadened in scope. It now embraces the advanced catalog capabilities of ADC Gen 2 with the data classification, labeling, and compliance policy enforcement capabilities in Azure Information Protection. Today, it aligns more closely to the broader industry definition of data governance.

### What happens to customers using ADC Gen 1?

Azure Babylon is the focus of all product innovation in the catalog solution space for Microsoft. ADC Gen 1 will continue to be supported. 

### Can customers have multiple Azure Babylon accounts in the same subscription?

Yes, we support many Azure Babylon accounts per subscription and per tenant.

### What resources exist that can help me learn about Azure Babylon?

- **Docs:** [Azure Babylon documentation](overview.md)
- **Discussions:** For email support to customers by program managers and Friends of Azure, contact BabylonBabylonDiscussion@Microsoft.com.
- **Teams site:** Friends of Azure Babylon
- **Sandbox environment for Azure Babylon:** To get access to the [sandbox environment](aka.ms/babylondemo), request access to the Sandbox Security Group.
- **Microsoft Stream:** Most recent Azure Babylon [demo](https://msit.microsoftstream.com/video/b332a1ff-0400-aa75-8884-f1ea68ead103).

### When Azure Babylon goes public, can I run ADC V1 and Azure Babylon in parallel?

Yes. Both will be independent services.

### How do I migrate existing ADC v1 data assets to Azure Babylon?

Use the Azure Babylon APIs to extract from ADC v1 and ingest into Azure Babylon. For the glossary, we support bulk tools based on CSV.

### How do I encrypt sensitive data for SQL tables by using Azure Babylon?

Data encryption is done at the data source level. Azure Babylon stores only the metadata. It doesn't preview data.

### Will all the capabilities of ADC V2 exist in Azure Babylon?

Yes.

### Is the data lineage feature available in Azure Babylon?

Yes, limited to the ADF connector.

### How can I scan SQL Server on-premises?

Use the self-host integration runtime capability. 

### What is the difference between classification in Azure SQL DB and classification in Azure Babylon?

|Azure SQL classification  |Azure Babylon classification  |
|---------|---------|
|Classification is based on SQL metadata from system catalogs. |Classification is based on Azure Babylon's sampling technique by using the system-defined or custom-defined regex pattern.|
|Custom classification is supported.     |Custom classification is supported.         |
|Doesn't use Microsoft 365 system classifiers out of the box.    | Uses Microsoft 365 system classifiers out of the box.        |

### What's the difference between glossary and classification?

The glossary uses a naming convention followed by non-technical/business users of the data, also known as data consumers. These types of people are business analysts or data scientists who use Azure Babylon to search for certain types of data, based on business usage. For instance, supply chain analysts might need to search for the terms *SKU types* and *shipment details*. They can search the glossary by using these terms to find relevant data.
Classification is a tag applied to the data asset, at the table, column, or file level, that identifies what data exists in the asset. Classification can be applied automatically or manually, based on the type of data found. Typically, you use classification tags to identify whether an asset contains sensitive data, and what type of sensitive data that might be.

### Can customer create a glossary hierarchy in Azure Babylon?

No.

### Can I give a friendly name to a data asset in Azure Babylon?

No.

### Does Azure Babylon scan Sharepoint as well?

Scanning for on-premises SharePoint sites and libraries is provided through the Azure Information Protection scanner. The scanner is available for use  through a customer's Microsoft 365 subscription with the following SKUs: AIP P1, EMS E3, and M365 E3. If you have any one of these SKUs, you should have the right entitlements to start using the Azure Information Protection scanner.

### What is the difference between classifications and labels in Azure Babylon?

Azure Babylon's data governance solution is based on the Apache Atlas framework. As defined by Atlas, classification is a way to identify contents of an asset (table or file) or an entity (table column or structured file). This classification becomes a metadata property that allows Azure Babylon to understand the data within each asset and govern and protect them.

Labels are an M365 concept that resembles classification at the asset level. You can create a label with a collection of classifications applied at the asset or entity level.

Atlas-centric customers will see no real distinction between classifications and labels. To these customers, everything is a classification and labels aren't needed.

Security-focused customers understand a distinction between classification and labeling, but only because in Microsoft 365 the classifications aren't exposed directly to the user. Only labels are visible. So, similar to Atlas, Office 365 security customers don't need to deal with both entities.

### Can customers create a glossary hierarchy?

No.
