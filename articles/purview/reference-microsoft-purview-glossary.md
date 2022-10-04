---
title: Microsoft Purview governance portal product glossary
description: A glossary defining the terminology used throughout the Microsoft Purview governance portal
author: djpmsft
ms.author: daperlov
ms.service: purview
ms.custom: event-tier1-build-2022
ms.topic: conceptual
ms.date: 06/17/2022
---
# Microsoft Purview governance portal product glossary

Below is a glossary of terminology used throughout the Microsoft Purview governance portal, and documentation.

## Advanced resource sets
A set of features activated at the Microsoft Purview instance level that, when enabled, enrich resource set assets by computing extra aggregations on the metadata to provide information such as partition counts, total size, and schema counts. Resource set pattern rules are also included.
## Annotation
Information that is associated with data assets in the Microsoft Purview Data Map, for example, glossary terms and classifications. After they're applied, annotations can be used within Search to aid in the discovery of the data assets.
## Approved
The state given to any request that has been accepted as satisfactory by the designated individual or group who has authority to change the state of the request.
## Asset
Any single object that is stored within a Microsoft Purview Data Catalog.
> [!NOTE]
> A single object in the catalog could potentially represent many objects in storage, for example, a resource set is an asset but it's made up of many partition files in storage.
## Azure Information Protection
A cloud solution that supports labeling of documents and emails to classify and protect information. Labeled items can be protected by encryption, marked with a watermark, or restricted to specific actions or users, and is bound to the item. This cloud-based solution relies on Azure Rights Management Service (RMS) for enforcing restrictions.
## Business glossary
A searchable list of specialized terms that an organization uses to describe key business words and their definitions. Using a business glossary can provide consistent data usage across the organization.
## Capacity unit
A measure of data map usage. All Microsoft Purview Data Maps include one capacity unit by default, which provides up to 2 GB of metadata storage and has a throughput of 25 data map operations/second.
## Classification report
A report that shows key classification details about the scanned data.  
## Classification
A type of annotation used to identify an attribute of an asset or a column such as "Age", “Email Address", and "Street Address". These attributes can be assigned during scans or added manually. 
## Classification rule
A classification rule is a set of conditions that determine how scanned data should be classified when content matches the specified pattern.
## Classified asset
An asset where Microsoft Purview extracts schema and applies classifications during an automated scan. The scan rule set determines which assets get classified. If the asset is considered a candidate for classification and no classifications are applied during scan time, an asset is still considered a classified asset.
## Collection
An organization-defined grouping of assets, terms, annotations, and sources. Collections allow for easier fine-grained access control and discoverability of assets within a data catalog.
## Collection admin
A role that can assign roles in the Microsoft Purview governance portal. Collection admins can add users to roles on collections where they're admins. They can also edit collections, their details, and add subcollections.
## Column pattern
A regular expression included in a classification rule that represents the column names that you want to match.
## Contact
An individual who is associated with an entity in the data catalog.
## Control plane operation
An operation that manages resources in your subscription, such as role-based access control and Azure policy that are sent to the Azure Resource Manager end point. Control plane operations can also apply to resources outside of Azure across on-premises, multicloud, and SaaS sources.
## Credential
A verification of identity or tool used in an access control system. Credentials can be used to authenticate an individual or group to grant access to a data asset.
## Data Catalog
A searchable inventory of assets and their associated metadata that allows users to find and curate data across a data estate. The Data Catalog also includes a business glossary where subject matter experts can provide terms and definitions to add a business context to an asset.
## Data curator
A role that provides access to the data catalog to manage assets, configure custom classifications, set up glossary terms, and view insights. Data curators can create, read, modify, move, and delete assets. They can also apply annotations to assets.
## Data map
A metadata repository that is the foundation of the Microsoft Purview governance portal. The data map is a graph that describes assets across a data estate and is populated through scans and other data ingestion processes. This graph helps organizations understand and govern their data by providing rich descriptions of assets, representing data lineage, classifying assets, storing relationships between assets, and housing information at both the technical and semantic layers. The data map is an open platform that can be interacted with and accessed through Apache Atlas APIs or the Microsoft Purview governance portal.
## Data map operation
A create, read, update, or delete action performed on an entity in the data map. For example, creating an asset in the data map is considered a data map operation.
## Data owner
An individual or group responsible for managing a data asset.
## Data pattern
A regular expression that represents the data that is stored in a data field. For example, a data pattern for employee ID could be Employee{GUID}.
## Data plane operation
An operation within a specific Microsoft Purview instance, such as editing an asset or creating a glossary term. Each instance has predefined roles, such as "data reader" and "data curator" that control which data plane operations a user can perform.
## Data reader
A role that provides read-only access to data assets, classifications, classification rules, collections, glossary terms, and insights.
## Data Sharing
Microsoft Purview Data Sharing is a set of features in Microsoft Purview that enables you to securely share data across organizations.
## Data Share contributor
A role that can share data within an organization and with other organizations using data share capabilities in Microsoft Purview. Data share contributors can view, create, update, and delete sent and received shares.
## Data source admin
A role that can manage data sources and scans. A user in the Data source admin role doesn't have access to Microsoft Purview governance portal. Combining this role with the Data reader or Data curator roles at any collection scope provides Microsoft Purview governance portal access.
## Data steward
An individual or group responsible for maintaining nomenclature, data quality standards, security controls, compliance requirements, and rules for the associated object.
## Data dictionary
A list of canonical names of database columns and their corresponding data types. It's often used to describe the format and structure of a database, and the relationship between its elements.
## Discovered asset
An asset that the Microsoft Purview Data Map identifies in a data source during the scanning process. The number of discovered assets includes all files or tables before resource set grouping.
## Distinct match threshold
The total number of distinct data values that need to be found in a column before the scanner runs the data pattern on it. For example, a distinct match threshold of eight for employee ID requires that there are at least eight unique data values among the sampled values in the column that match the data pattern set for employee ID.
## Expert
An individual within an organization who understands the full context of a data asset or glossary term.
## Full scan
A scan that processes all assets within a selected scope of a data source.
## Fully Qualified Name (FQN)
A path that defines the location of an asset within its data source.
## Glossary term
An entry in the Business glossary that defines a concept specific to an organization. Glossary terms can contain information on synonyms, acronyms, and related terms.
## Incremental scan
A scan that detects and processes assets that have been created, modified, or deleted since the previous successful scan. To run an incremental scan, at least one full scan must be completed on the source.
## Ingested asset
An asset that has been scanned, classified (when applicable), and added to the Microsoft Purview Data Map. Ingested assets are discoverable and consumable within the data catalog through automated scanning or external connections, such as Azure Data Factory and Azure Synapse.
## Insight reader
A role that provides read-only access to insights reports for collections where the insights reader also has the **Data reader** role.
## Data Estate Insights
An area of the Microsoft Purview governance portal that provides up-to-date reports and actionable insights about the data estate.
## Integration runtime
The compute infrastructure used to scan in a data source.
## Lineage
How data transforms and flows as it moves from its origin to its destination. Understanding this flow across the data estate helps organizations see the history of their data, and aid in troubleshooting or impact analysis.
## Management
An area within the Microsoft Purview Governance Portal where you can manage connections, users, roles, and credentials. Also referred to as "Management center."
## Minimum match threshold
The minimum percentage of matches among the distinct data values in a column that must be found by the scanner for a classification to be applied.

For example, a minimum match threshold of 60% for employee ID requires that 60% of all distinct values among the sampled data in a column match the data pattern set for employee ID. If the scanner samples 128 values in a column and finds 60 distinct values in that column, then at least 36 of the distinct values (60%) must match the employee ID data pattern for the classification to be applied.
## Policy
A statement or collection of statements that controls how access to data and data sources should be authorized. 
## Object type
A categorization of assets based upon common data structures. For example, an Azure SQL Server table and Oracle database table both have an object type of table.
## On-premises data
Data that is in a data center controlled by a customer, for example, not in the cloud or software as a service (SaaS).
## Owner
An individual or group in charge of managing a data asset.
## Pattern rule
A configuration that overrides how the Microsoft Purview Data Map groups assets as resource sets and displays them within the catalog.
## Microsoft Purview instance
A single Microsoft Purview (formerly Azure Purview) account.
## Registered source
A source that has been added to a Microsoft Purview instance and is now managed as a part of the Data catalog.
## Related terms
Glossary terms that are linked to other terms within the organization.
## Resource set
A single asset that represents many partitioned files or objects in storage. For example, the Microsoft Purview Data Map stores partitioned Apache Spark output as a single resource set instead of unique assets for each individual file.
## Role
Permissions assigned to a user within a Microsoft Purview instance. Roles, such as Microsoft Purview Data Curator or Microsoft Purview Data Reader, determine what can be done within the product.
## Root collection
A system-generated collection that has the same friendly name as the Microsoft Purview account. All assets belong to the root collection by default.
## Scan
A Microsoft Purview Data Map process that discovers and examines metadata in a source or set of sources to populate the data map. A scan automatically connects to a source, extracts metadata, captures lineage, and applies classifications. Scans can be run manually or on a schedule.
## Scan rule set
A set of rules that define which data types and classifications a scan ingests into a catalog.
## Scan trigger
A schedule that determines the recurrence of when a scan runs.
## Schema classification
A classification applied to one of the columns in an asset schema.
## Search
A feature that allows users to find items in the data catalog by entering in a set of keywords.
## Search relevance
The scoring of data assets that determine the order search results are returned. Multiple factors determine an asset's relevance score.
## Self-hosted integration runtime
An integration runtime installed on an on-premises machine or virtual machine inside a private network that is used to connect to data on-premises or in a private network.
## Sensitivity label
Annotations that classify and protect an organization’s data. The Microsoft Purview Data Map integrates with Microsoft Purview Information Protection for creation of sensitivity labels.
## Sensitivity label report
A summary of which sensitivity labels are applied across the data estate.
## Service
A product that provides standalone functionality and is available to customers by subscription or license.
## Share
A group of assets that are shared as a single entity.
## Source
A system where data is stored. Sources can be hosted in various places such as a cloud or on-premises. You register and scan sources so that you can manage them in the Microsoft Purview governance portal.
## Source type
A categorization of the registered sources used in the Microsoft Purview Data Map, for example, Azure SQL Database, Azure Blob Storage, Amazon S3, or SAP ECC.
## Steward
An individual who defines the standards for a glossary term. They're responsible for maintaining quality standards, nomenclature, and rules for the assigned entity.
## Term template
A definition of attributes included in a glossary term. Users can either use the system-defined term template or create their own to include custom attributes.
## Workflow
An automated process that coordinates the creation and modification of catalog entities, including validation and approval. Workflows define repeatable business processes to achieve high quality data, policy compliance, and user collaboration across an organization.

## Next steps

To get started with other Microsoft Purview governance services, see [Quickstart: Create a Microsoft Purview (formerly Azure Purview) account](create-catalog-portal.md).
