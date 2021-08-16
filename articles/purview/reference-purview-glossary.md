---
title: Purview product glossary
description: A glossary defining the terminology used throughout Azure Purview
author: djpmsft
ms.author: daperlov
ms.service: purview
ms.topic: conceptual
ms.date: 08/16/2021
---
# Azure Purview product glossary

Below is a glossary of terminology used throughout Azure Purview.

## Annotation
Information that is associated with data assets in Azure Purview, for example, glossary terms and classifications. After they are applied, annotations can be used within Search to aid in the discovery of the data assets. 
## Approved
The state given to any request that has been accepted as satisfactory by the designated individual or group who has authority to change the state of the request. 
## Asset
Any single object that is stored within an Azure Purview data catalog.
> [!NOTE]
> A single object in the catalog could potentially represent many objects in storage, for example, a resource set is an asset but it's made up of many partition files in storage.
## Azure Information Protection
A cloud solution that supports labeling of documents and emails to classify and protect information. Labeled items can be protected by encryption, marked with a watermark, or restricted to specific actions or users, and is bound to the item. This cloud-based solution relies on Azure Rights Management Service (RMS) for enforcing restrictions. 
## Business glossary
A searchable list of specialized terms that an organization uses to describe key business words and their definitions. Using a business glossary can provide consistent data usage across the organization. 
## Classification report
A report that shows key classification details about the scanned data.  
## Classification
A type of annotation used to identify an attribute of an asset or a column such as "Age", “Email Address", and "Street Address". These attributes can be assigned during scans or added manually. 
## Classification rule
A classification rule is a set of conditions that determine how scanned data should be classified when content matches the specified pattern.
## Classified asset
An asset where Azure Purview extracts schema and applies classifications during an automated scan. The scan rule set determines which assets get classified. If the asset is considered a candidate for classification and no classifications are applied during scan time, an asset is still considered a classified asset.
## Column pattern
A regular expression included in a classification rule that represents the column names that you want to match.
## Contact
An individual who is associated with an entity in the data catalog 
## Control plane
Operations that manage resources in your subscription, such as role-based access control and Azure policy, that are sent to the Azure Resource Manager end point. 
## Credential
A verification of identity or tool used in an access control system. Credentials can be used to authenticate an individual or group for the purpose of granting access to a data asset. 
## Data catalog
Azure Purview features that enable customers to view and manage the metadata for assets in your data estate.
## Data map
Azure Purview features that enable customers to manage their data estate, such as scanning, lineage, and movement.
## Data pattern
A regular expression that represents the data that is stored in a data field. For example, a data pattern for employee ID could be Employee{GUID}.
## Data plane
An operation within a specific Azure Purview instance, such as editing an asset or creating a glossary term. Each instance has predefined roles, such as ""data reader"" and ""data curator"" that control which data plane operations a user can perform.
## Discovered asset
An asset that Azure Purview identifies in a data source during the scanning process. The number of discovered assets includes all files or tables before resource set grouping.
## Distinct match threshold
The total number of distinct data values that need to be found in a column before the scanner runs the data pattern on it. For example, a distinct match threshold of eight for employee ID requires that there are at least eight unique data values among the sampled values in the column that match the data pattern set for employee ID.
## Expert
An individual within an organization who understands the full context of a data asset or glossary term.
## Full scan
A scan that processes all assets within a selected scope of a data source.
## Fully Qualified Name (FQN)
A path that defines the location of an asset within its data source.  
## Glossary term
An entry in the Business glossary that defines a concept specific to an organization. Glossary terms can contain information on synonyms, acronyms, and related terms.
## Incremental scan
A scan that detects and processes assets which have been created, modified, or deleted since the previous successful scan. To run an incremental scan, at least one full scan must be completed on the source.
## Ingested asset
An asset that has been scanned, classified (when applicable), and added to the Azure Purview data map. Ingested assets are discoverable and consumable within the data catalog through automated scanning or external connections, such as Azure Data Factory and Azure Synapse.
## Insights
An area within Azure Purview where you can view reports that summarize information about your data.
## Integration runtime
The compute infrastructure used to scan in a data source.
## Lineage
How data transforms and flows as it moves from its origin to its destination. Understanding this flow across the data estate helps organizations see the history of their data, and aid in troubleshooting or impact analysis. 
## Management Center
An area within Azure Purview where you can manage connections, users, roles, and credentials.
## Minimum match threshold
The minimum percentage of matches among the distinct data values in a column that must be found by the scanner for a classification to be applied. 

For example, a minimum match threshold of 60% for employee ID requires that 60% of all distinct values among the sampled data in a column match the data pattern set for employee ID. If the scanner samples 128 values in a column and finds 60 distinct values in that column, then at least 36 of the distinct values (60%) must match the employee ID data pattern for the classification to be applied.
## On-premises data
Data that is in a data center controlled by a customer, for example, not in the cloud or as a software as a service (SaaS). 
## Owner
An individual or group in charge of managing a data asset.
## Pattern rule
A configuration that overrides how Azure Purview groups assets as resource sets and displays them within the catalog.
## Purview instance
A single Azure Purview resource. 
## Registered source
A source that has been added to an Azure Purview instance and is now managed as a part of the Data catalog. 
## Related terms
Glossary terms that are linked to other terms within the organization.  
## Resource set
A single asset that represents many partitioned files or objects in storage. For example, Azure Purview stores partitioned Apache Spark output as a single resource set instead of unique assets for each individual file. 
## Role
Permissions assigned to a user within an Azure Purview instance. Roles, such as Purview Data Curator or Purview Data Reader, determine what can be done within the product.
## Scan
An Azure Purview process that examines a source or set of sources and ingests its metadata into the data catalog. Scans can be run manually or on a schedule using a scan trigger. 
## Scan ruleset
A set of rules that define which data types and classifications a scan ingests into a catalog. 
## Scan trigger
A schedule that determines the recurrence of when a scan runs.
## Search
A data discovery feature of Azure Purview that returns a list of assets that match to a keyword. 
## Search relevance
The scoring of data assets that determines the order search results are returned. Multiple factors determine an asset's relevance score.
## Self-hosted integration runtime
An integration runtime installed on an on-premises machine or virtual machine inside a private network that is used to connect to data on-premises or in a private network.
## Sensitivity label
Annotations that classify and protect an organization’s data. Azure Purview integrates with Microsoft Information Protection for creation of sensitivity labels. 
## Sensitivity label report
A summary of which sensitivity labels are applied across the data estate. 
## Service
A product that provides standalone functionality and is available to customers by subscription or license. 
## Source
A system where data is stored. Sources can be hosted in various places such as a cloud or on-premises. You register and scan sources so that you can manage them in Azure Purview. 
## Source type
A categorization of the registered sources used in an Azure Purview instance, for example, Azure SQL Database, Azure Blob Storage, Amazon S3, or SAP ECC. 
## Steward
An individual who defines the standards for a glossary term. They are responsible for maintaining quality standards, nomenclature, and rules for the assigned entity. 
## Term template
A definition of attributes included in a glossary term. Users can either use the system-defined term template or create their own to include custom attributes.
## Next steps

To get started with Azure Purview, see [Quickstart: Create an Azure Purview account](create-catalog-portal.md).