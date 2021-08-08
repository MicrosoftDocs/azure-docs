---
title: Frequently asked questions (FAQ)
description: This article answers frequently asked questions about Azure Purview. 
author: SunetraVirdi
ms.author: suvirdi
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 08/08/2021
---

# Frequently asked questions (FAQ) about Azure Purview

## Overview

Many organizations lack a holistic understanding of their data. It's challenging to understand what data exists, where data is located, and how to find and access relevant data. Data lacks context such as lineage, classification, and comprehensive metadata, making it difficult for business users to search for the right data and use that data appropriately. As a result, only a small fraction of collected data is used to inform business decisions. Finally, identifying data security issues and protecting sensitive data is inconsistent. It requires ongoing time and effort, especially while maintaining data agility.

Azure Purview is a data governance solution. It helps customers gain deep knowledge of all their data while maintaining control over its use. With Azure Purview, organizations discover and curate data. They gain insights into their data estate, and centrally govern access to data.

## Purpose of this FAQ

This FAQ answers common questions that customers and field teams often ask. It's intended to clarify questions about Azure Purview and related solutions, such as Azure Data Catalog (ADC) Gen 2 (deprecated) and Azure Information Protection.

### What are the source types available for metadata scanning and classification?

|Azure|Non-Azure|
|---------|---------|
|Azure Blob storage|Power BI|
|Azure Synapse Analytics (SQL DW)|SQL Server |
|Azure Cosmos DB|Teradata (Available by end of 2020)|
|Azure SQL Managed Instance|SAP ECC (Available by end of 2020)|
|Azure Data Explorer|SAP S/4 HANA (Available by end of 2020)|
|Azure Data Lake Storage Gen1|Hive Metastore (Available by end of 2020)|
|Azure Data Lake Storage Gen2|Amazon S3|
|Azure Files|Amazon RDS (public preview) |
|Azure SQL Database|--|

### What data systems/processors can we connect and get lineage?

|Data system/processor 
|---------
|Azure Data Factory: Copy activity, Data Flow activity 
|Custom lineage   
|Azure Data Share   
|Power BI    |
|SQL Server Integration Services  

### How are ADC Gen 2, Azure Information Protection, and Azure Purview related?

Azure Purview originally began as ADC Gen 2 but has since broadened in scope. It now embraces the advanced catalog capabilities of ADC Gen 2 combined with the data classification, labeling, and compliance policy enforcement capabilities of Azure Information Protection. Today, it aligns more closely to the broader industry definition of data governance.

### What happens to customers using ADC Gen 1?

Azure Purview is the focus of all product innovation in the catalog solution space for Microsoft. ADC Gen 1 will continue to be supported.

### Can customers have multiple Azure Purview accounts in the same subscription?

Yes, we support many Azure Purview accounts per subscription and per tenant.

### Can I run ADC Gen 1 and Azure Purview in parallel?

Yes. Both are independent services.

### How do I migrate existing ADC Gen 1 data assets to Azure Purview?

Use the Azure Purview APIs to extract from ADC Gen 1 and ingest into Azure Purview. For the glossary, we support bulk tools based on CSV.

### How do I encrypt sensitive data for SQL tables using Azure Purview?

Data encryption is done at the data source level. Azure Purview stores only the metadata. It doesn't preview data.

### Will all the capabilities of ADC Gen 2 exist in Azure Purview?

Yes.

<!--## Is the data lineage feature available in Azure Purview?

Yes, but it's limited to the Azure Data Factory connector.

<!-- ## How can I scan SQL Server on-premises? 

Use the self-host integration runtime capability. !-->

<!--### What is the difference between classification in Azure SQL Database and classification in Azure Purview?

|Azure SQL DB classification  |Azure Purview classification  |
|---------|---------|
|Classification is based on SQL metadata from system catalogs. |Classification is based on Azure Purview's sampling technique by using the system-defined or custom-defined regex pattern.|
|Custom classification is supported.     |Custom classification is supported.         |
|Doesn't use Microsoft 365 system classifiers out of the box.    | Uses Microsoft 365 system classifiers out of the box.        |
-->

### What's the difference between a glossary and classification?

A glossary uses a naming convention followed by non-technical/business users of the data, also known as data consumers. These types of people are business analysts or data scientists who use Azure Purview to search for certain types of data, based on business usage. For instance, supply chain analysts might need to search for the terms *SKU types* and *shipment details*. They search the glossary for these terms to find relevant data.
Classification is a tag applied to a data asset at the table, column, or file level, that identifies what data exists in the asset. Classification can be applied automatically or manually, based on the type of data found. Typically, you use classification tags to identify whether an asset contains sensitive data, and what type of sensitive data that might be.

### Does Azure Purview scan and classify emails, PDFs etc. in my Sharepoint and OneDrive?

Scanning for on-premises SharePoint sites and libraries is provided through the Azure Information Protection scanner. The scanner is available for use  through a customer's Microsoft 365 subscription with the following SKUs: AIP P1, EMS E3, and M365 E3. If you have any one of these SKUs, you should have the right entitlements to start using the Azure Information Protection scanner.

<!--### What is the difference between classifications and sensitivity labels in Azure Purview?

Azure Purview's data governance solution is based on the Apache Atlas framework. As defined by Atlas, classification is a way to identify the contents of an asset (table or file) or an entity (table column or structured file). This classification becomes a metadata property that allows Azure Purview to understand the data within each asset and govern and protect them.

Sensitivity labels are a Microsoft 365 concept that resembles classification at the asset level. You create a label with a collection of classifications applied at the asset or entity level.

Atlas-centric customers will see no real distinction between classifications and labels. To these customers, everything is a classification and labels aren't needed.

Security-focused customers will see a distinction between classification and labeling, but only because in Microsoft 365 the classifications aren't exposed directly to the user; only labels are visible. So, similar to Atlas, Office 365 security customers don't need to deal with both entities.
-->

### What is the compute used for the scan?
There is a Microsoft-managed scanning infrastructure. For most Azure/AWS resources that we support, you don't need to deploy a scanning infrastructure.

### Is there a way to provision Azure Purview via Azure Resource Manager (ARM) template / CLI / PowerShell?

Yes, ARM template is available

<!--### Does Azure Purview support guest users in AAD?-->

### I'm already using Atlas, can I easily move to Azure Purview?

Azure Purview is compatible with Atlas API. If you are migrating from Atlas, it's recommended to scan your data sources first using Azure Purview. Once the assets are available in your account, you can use similar Atlas APIs to integrate such as updating assets or adding custom lineage. Azure Purview modifies the Search API to use Azure Search so you should be able to use Advance Search.

### Can I create multiple catalogs in my tenant?

Yes, you can create multiple Azure Purview accounts per subscription and per tenant. You can review the limits page [Manage and increase quotas for resources with Azure Purview](how-to-manage-quotas.md).

Additional recommendation on when you should or should not have multiple accounts are documented in our [Azure Purview deployment best practices](deployment-best-practices.md).

### Can I register multiple tenants within a single Azure Purview account?

No, currently in order to scan another tenant's data source, you need to create a separate Azure Purview account in that tenant.

### Does Azure Purview support column level lineage?

Yes, Azure Purview supports column level lineage.

### Does Azure Purview support Soft-Delete?

Yes, Azure Purview supports Soft Delete for Azure subscription status management perspective. Purview can read subscription states (disabled/warned etc.) and put the account in soft-delete state until the account is restored/deleted. All the data plane API calls will be blocked when the account is in soft delete state and only GET/DELETE control plane API calls will be allowed. You can find additional information in Azure subscription states page [Azure Subscription Status](../cost-management-billing/manage/subscription-states.md)

### Does Azure Purview currently support Data Loss Prevention capabilities?

No, Azure Purview does not provide Data Loss Prevention capabilities at this point. 

Read about [Data Loss Prevention in Microsoft Information Protection](/microsoft-365/compliance/information-protection#prevent-data-loss) if you are interested in Data Loss Prevention features inside Microsoft 365.
