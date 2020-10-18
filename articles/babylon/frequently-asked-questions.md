---
title: 'Frequently asked questions'
titleSuffix: Babylon
description: This how to guide describes details of the Map and Discover insights report. 
author: SunetraVirdi
ms.author: suvirdi
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: Concepts
ms.date: 9/9/2020
---
# Frequently Asked Questions (FAQ)

> [!NOTE]
> Please restrict the contents of the FAQ to private preview customers only

## Overview
Many organizations lack a holistic understanding of their data. It is challenging to understand what data exists, where data is located, and how to find and access relevant data. Data lacks context such as lineage, classification, and comprehensive metadata, making it difficult for business users to search for the right data and use that data appropriately. As a result, only a small fraction of collected data is used to inform business decisions. Finally, identifying data security issues and protecting sensitive data is inconsistent and requires ongoing time and effort especially while maintaining data agility.
Project Babylon is a yet-to-be-announced data governance solution, currently in private preview, that can help customers gain deep knowledge of all their data while maintaining control over its use. With Babylon, organizations can discover and curate data, gain insights into their data estate, and centrally govern access to data.

### What is this FAQ intended for?
This FAQ is intended to be a clarify questions regarding Babylon and related solutions such as Azure Data Catalog Gen 2 (now deprecated) and Compliance, Security and Information Protection for Azure. The below FAQ's will help you answer some common questions that we get asked often times by customers and field teams.  

### Who is the audience of these FAQ's? 
The audience for these FAQ's are customers, Data & AI Global Black Belts, and other customer representatives from the field. 

### What is the status of the Babylon Private Preview Program? Can I nominate customers? 

**Babylon Private Preview Program** is currently closed. We request interested customers to wait for public preview which will happen at the end of CY20.

### What's on the roadmap for the upcoming months?
||Current|CY H2 2020|CY H1 2021|
|---------|---------|---------|---------|
|**Babylon Platform (datamap, scanning & classification)**|Automated scanning & Classification w/ lineage Unified Platform, Apache Atlas APIs Scope- Azure (subset) + PBI + SQL Server|Custom auto classification rules; Fundamentals Scope- Expand Azure; Coverage: Synapse, Databricks, ADF, ADS, ADX, SSIS + non-MSFT: AWS, Erwin, Salesforce, SAP S/4 HANA, SAP ECC, Teradata, Oracle|Fundamentals Scope: More Coverage (All Azure + non-MSFT)|
|**Babylon Catalog**|Private Preview: 100+ customers; Browse & Search; Business Glossary|Public Preview Fundamentals; Improved Browse & Search (full text, wild card, scoped); Expand Business Glossary: Custom Terms, Expanded Search, Bulk Editing; Expand Asset Management: Reordering Fields, Attributes, Custom Fields, Bulk Editing; Fine Grained Access Control: Limit scope to subset of data assets, terms etc.|GA; Fundamentals; Hierarchical Categories|
|**Babylon Data Use Governance (insights & Policy)**|Insights:  Private Preview Map & Discover Insights: Asset, Catalog, Scan Classification & Labelling Insights: Azure Blob Storage only; Policy: Development in progress Policy authoring for tag based access policies, sharing and movement policies; Enforcement for resource based policies for ADLS Gen 2, Azure Data Explorer, SQL and Cosmos DB|Insights: Private Preview; Expand Map & Discover Insights: Asset, Scan, Glossary Updates; Classification Insights: All Supported Data Sources, MSFT & Non-MSFT; Data Sensitivity & Open Permission (DAG) Insights; Security Alerts (data sensitivity-based, open access permission for security persona (DAG). Surfaced in ASC, Azure Sentinel); Policy: Private Preview Same scope as current in development |Insights:  Public Preview; Data Estate Coverage, Policy, Retention, Sharing Insights; Label Integration across Babylon, M365, Power BI, SQL IP Policy: Public Preview Same scope as current in development|

### What are the Azure data sources available for metadata scanning and classification?
|Data source |Available/On Roadmap|
|---------|---------|
|Azure SQL DB|Available|
|ADLS Gen 1|Available|
|ADLS Gen 2|Available|
|Azure Data Explorer|Available|
|Cosmos DB|Available|
|Synapse (aka SQL DW)|Available|
|Synapse|On roadmap|
|Data Bricks|On roadmap|
|Power BI|CY20|
|Azure Search|Available|

### What are the non-Azure data sources available for metadata scanning?
|Data source  |Available/On Roadmap  |
|---------|---------|
|Amazon S3|CY2020|
|Teradata|CY2020|
|SAP S/4 HANA|CY2020|
|Hive Metastore|CY2020|
|SAP ECC|CY2020|
|Salesforce|CY2020|
|Oracle|CY2020|

### What Data systems/processors we can connect and get lineage?
|Data processors  |Available/On roadmap|
|---------|---------|
|Azure Data Factory - Copy activity, Dataflow activity    |Available    |
|Azure Data Share    |CY2020    |
|SSIS    |CY2020    |
|Power BI    |CY2020    |
|Custom Lineage    |Available    |

### What data sources are supported by 'Classification Report' within Insights?
|Data source  |Availablility |
|---------|---------|
|Azure Blob Storage|Available|
|Azure Files|Available|
|ADLS Gen 1|Available|
|ADLS Gen 2| Available|
|Power BI|CY2020|
|Azure SQL DB|CY2020|
|Azure Cosmos DB|CY2020|
|Azure Synapse Analytics|CY2020|
|SQL Server|CY2020|
|Azure SQL DB Managed Instance|CY2020|

### How are ADC Gen 2, Information Protection for Azure (IP4A) and Project Babylon related?
Project Babylon originally started off as Azure Data Catalog Gen 2 but has since broadened in scope embracing the advanced Catalog capabilities of ADC Gen 2 with the data classification, labelling and compliance policy enforcement capabilities in the Information Protection for Azure product. Today, it aligns more closely to the broader industry definition of Data Governance.

### What happens to customers using ADC Gen 1?
Project Babylon is the focus of all product innovation in the catalog solution space for Microsoft. ADC Gen 1 will continue to be supported and an easy migration path for existing customers will be made available over time.

### Can customers have multiple Babylon accounts in the same subscription?
Yes, we support many Babylon accounts per subscription and per tenant. 

### What resources exist today that can help me get up to speed on Babylon? 
- **Docs:** Aka.ms/babylondocs,  Internal Microsoft DocsBabylon
- **Discussions:** BabylonDiscussion@Microsoft.com - Used to provide email support to customers by PMs and Friends of Project Babylon
- **Teams Site:** Friends of Project Babylon
- **Sandbox environment for Babylon** aka.ms/babylondemo  (To get access to the Sandbox environment, please request access to Sandbox Security Group)
- Most recent demo of Babylon recorded [here](https://msit.microsoftstream.com/video/b332a1ff-0400-aa75-8884-f1ea68ead103) 

### Can I get my internal(MSFT) subscription allow-listed for Babylon?
Due to initial capacity constraint, we are not able to white-list all internal subscriptions yet. Once Babylon customers are officially onboarded successfully, we will re-evaluate this to allow internal white-list. You should check back in July by emailing BabylonDiscussion@microsoft.com.

### Can I share the demo link to my customer(s)?
No, the Contoso Babylon Demo environment is only available internally. Customers can access Babylon through their own whitelisted subscriptions in private preview.

### When will Project Babylon launch? What's next?
Project Babylon is planned to go public preview by the end of CY20.

### When Babylon goes public, can I run ADC V1 and Babylon in parallel?
Yes. Both will be independent services.

### How to Migrate existing ADC v1 data assets to Babylon?
Migration tool is planned in the future. But currently, you can use APIs to extract from ADC v1 and ingest into Babylon. For glossary we support bulk tools based on CSV.

### Any way to encrypt PII data for SQL tables, using Babylon?
Data encryption is done at the data source level. We store just the metadata. We do not preview data, in Babylon, at this point. With policies we will bring in data masking capabilities at run time later in the product lifecycle. Timing not confirmed.

### Will all capabilities of ADC V2 exist in Babylon?
Yes!

### Is Data Lineage feature now available in Babylon?
Yes. Limited to ADF connector at this point.

### Integration with PowerBI (both cataloging PowerBI datamodel and reports as well as use PowerBI to report on the data assets)
Currently Power BI in Babylon is available for allow-listed workspaces only. Currently available feature is lineage and related insights and reports. By Q4 we will have cataloging capabilities. We'd like to understand your use cases in more details.

###    How can I scan SQL Server On prem?
Using self-host integration runtime capability. We are currently working on lighting this up in Babylon. ETA - TBD.

### What is the difference between classification in Azure SQL DB and classification in Babylon?
|Azure SQL Classification  |Babylon classification  |
|---------|---------|
|Classification is based on SQL metadata from system catalogs. Meaning, if column name is SSN, it get classified as 'SSN'|Classification is based on Babylon's sampling technique using the system defined or custom defined regex pattern|
|Custom classification is possible     |Custom classification is possible         |
|Does not use M365 system classifiers out of the box    | Uses M365 system classifiers out of the box        |

### What is the difference between glossary and classification?
Glossary is a naming convention followed by non-technical/business users of the data, also known as data consumers. These are people like business analysts or data scientists who come into Babylon searching for certain types of data, based on its business usage. For instance, a supply chain analyst may be looking for 'SKU types' and 'shipment details'. He can search the glossary by these terms – 'SKU types' and 'shipment' to find relevant data.
Classification is a tag applied to the data asset (either at table or column or file level), that identifies what data exists in that asset. Classification can be applied automatically and manually based on the type of data found. Typically classification tags are used to identify if an asset contains sensitive data or not, and what type of sensitive data that might be.

### Can customer create glossary hierarchy today?
No. On the roadmap for CY2020

### Can I give a friendly name to the data asset in Babylon?
No.

### Does Babylon scan Sharepoint as well?

Scanning for on-premises SharePoint sites and libraries is provided through the Azure Information Protection Scanner. The scanner is available for use  through customer's M365 subscription with the following SKUs:  AIP P1, EMS E3, M365 E3 and a few other. If the customer has any one of these, they should have the right entitlements to start using the AIP Scanner today.

### What is the difference between classifications and labels in Babylon?
Babylon's data governance solution is based on Apache Atlas framework. As defined by Atlas, classification is a way to identify contents of an asset (table or file) or an entity (column within a table or structured file). This classification becomes a metadata property that allows Babylon to understand the data within each asset and govern and protect them.

Labels are an M365 concept that resembles classification at asset level. A label can be created with a collection of classifications applied at asset or entity level.

Atlas-centric customers will see no real distinction between Classifications and Labels. In fact, to these customers, everything is a classification and labels are not really needed. 

Security focused customers understand a distinction between Classification and Labeling – but only because in O365 the classifications are not exposed directly to the user; it's only labels that are visible. So O365 security customers don't have to deal with both entities, in the same way that Atlas-centric customers also don't have to deal with both entities. 

### Can customer create glossary hierarchy today?
No. On the roadmap for CY2020

### Can I give a friendly name to the data asset in Babylon?
No.
