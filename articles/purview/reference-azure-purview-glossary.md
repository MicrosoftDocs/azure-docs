---
title: Azure Purview product glossary
description: A glossary defining the terminology used throughout Azure Purview
author: djpmsft
ms.author: daperlov
ms.service: purview
ms.topic: conceptual
ms.date: 04/14/2022
---
# Azure Purview product glossary

Below is a glossary of terminology used throughout Azure Purview.

## Advanced resource sets
A set of features activated at the Azure Purview instance level that, when enabled, enrich resource set assets by computing additional aggregations on the metadata to provide information such as partition counts, total size, and schema counts. Resource set pattern rules are also included.
## Annotation
Information that is associated with data assets in Azure Purview, for example, glossary terms and classifications. After they are applied, annotations can be used within Search to aid in the discovery of the data assets.
## Approved
The state given to any request that has been accepted as satisfactory by the designated individual or group who has authority to change the state of the request.
## Asset
Any single object that is stored within an Azure Purview data catalog.
> [!NOTE]
> A single object in the catalog could potentially represent many objects in storage, for example, a resource set is an asset but it's made up of many partition files in storage.
## Audit log
A secure, timestamped record of activity and events. Audit logs cannot be changed and are often used for regulatory and security compliance purposes.
## Azure Information Protection
A cloud solution that supports labeling of documents and emails to classify and protect information. Labeled items can be protected by encryption, marked with a watermark, or restricted to specific actions or users, and is bound to the item. This cloud-based solution relies on Azure Rights Management Service (RMS) for enforcing restrictions.
## Business rule
A user-defined rule that automatically runs to enrich the data map at scale. Business rules can modify metadata properties and annotations like terms, classifications, etc. They can also trigger advanced actions like starting a workflow.
## Business glossary
A searchable list of specialized terms that an organization uses to describe key business words and their definitions. Using a business glossary can provide consistent data usage across the organization.
## Capacity unit
A measure of data map usage. All Azure Purview data maps include one capacity unit by default, which provides up to 2GB of metadata storage and has a throughput of 25 data map operations/second.
## Certification
An annotation that indicates that an asset meets the organization's quality standards and can be regarded as reliable for business use. Assets are labeled as certified in the data catalog, making it easier for users to identify high-quality and trusted data.
## Classification report
A report that shows key classification details about the scanned data.  
## Classification
A type of annotation used to identify an attribute of an asset or a column such as "Age", “Email Address", and "Street Address". These attributes can be assigned during scans or added manually. 
## Classification rule
A classification rule is a set of conditions that determine how scanned data should be classified when content matches the specified pattern.
## Classified asset
An asset where Azure Purview extracts schema and applies classifications during an automated scan. The scan rule set determines which assets get classified. If the asset is considered a candidate for classification and no classifications are applied during scan time, an asset is still considered a classified asset.
## Collection
An organization-defined grouping of assets, terms, annotations, and sources. Collections allow for easier fine-grained access control and discoverability of assets within a data catalog.
## Collection admin
A role that can assign roles in Azure Purview. Collection admins can add users to roles on collections where they're admins. They can also edit collections, their details, and add subcollections.
## Column pattern
A regular expression included in a classification rule that represents the column names that you want to match.
## Concept
A semantic object or abstract data governance idea. Concepts are used to build metamodels in Azure Purview. A concept is an abstraction of the object that it represents. Instances of concepts are logical assets.
## Contact
An individual who is associated with an entity in the data catalog.
## Control plane operation
An operation that manages resources in your subscription, such as role-based access control and Azure policy, that are sent to the Azure Resource Manager end point. Control plane operations can also apply to resources outside of Azure across on-premises, multicloud, and SaaS sources.
## Credential
A verification of identity or tool used in an access control system. Credentials can be used to authenticate an individual or group to grant access to a data asset.
## Dark data
Data within an organization that is not managed by Azure Purview. For example, if an organization has 100 subscriptions and only 20 are managed by an Azure Purview account, then the other 80 subscriptions are considered "dark data." 
## Data access governance
A set of processes that help organizations manage and protect important or sensitive data assets. 
## Data catalog
Azure Purview features that enable customers to view and manage the metadata for assets in your data estate.
## Data curator
A role that provides access to the data catalog to manage assets, configure custom classifications, set up glossary terms, and view insights. Data curators can create, read, modify, move, and delete assets. They can also apply annotations to assets.
## Data domain
A logical grouping of assets, based on subject area, that an organization wants to govern. Data domains can bring a business context to data by aligning with a specific business purpose and establishing accountability.
## Data estate
All the data an organization owns and the infrastructure the organization has put in place to manage the data. 
## Data governance
A method of data management used to ensure an organization’s data maintains a high quality throughout the data lifecycle and adheres to established standards and policies. 
## Data map
Azure Purview features that enable customers to manage their data estate, such as scanning, lineage, and movement.
## Data map operation
A create, read, update, or delete action performed on an entity in the data map. For example, creating an asset in the data map is considered a data map operation.
## Data object
An entity that can be described and grouped by a distinct set of attributes or business uses. For example, a table is a data object that has attributes in the form of columns.
## Data owner
An individual or group responsible for managing a data asset.
## Data pattern
A regular expression that represents the data that is stored in a data field. For example, a data pattern for employee ID could be Employee{GUID}.
## Data plane operation
An operation within a specific Azure Purview instance, such as editing an asset or creating a glossary term. Each instance has predefined roles, such as "data reader" and "data curator" that control which data plane operations a user can perform.
## Data profiling
The process of analyzing data to understand its contents and structure.
## Data reader
A role that provides read-only access to data assets, classifications, classification rules, collections, glossary terms, and insights.
## Data source admin
A role that can manage data sources and scans. A user in the Data source admin role doesn't have access to Azure Purview studio. Combining this role with the Data reader or Data curator roles at any collection scope provides Azure Purview studio access.
## Data steward
An individual or group responsible for maintaining nomenclature, data quality standards, security controls, compliance requirements, and rules for the associated object.
## Data subject
A person who is identifiable directly or indirectly based on data. For example, a data subject can be identified by data containing name or identification numbers.
## Data subject access request
A request made by a data subject to an organization to grant them access to the personal data concerning them.
## Data dictionary
A list of canonical names of database columns and their corresponding data types. It is often used to describe the format and structure of a database, and the relationship between its elements.
## Discovered asset
An asset that Azure Purview identifies in a data source during the scanning process. The number of discovered assets includes all files or tables before resource set grouping.
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
## Governance
An area in Azure Purview that supports the application of data policies and sensitive data classifications.
## Incremental scan
A scan that detects and processes assets that have been created, modified, or deleted since the previous successful scan. To run an incremental scan, at least one full scan must be completed on the source.
## Ingested asset
An asset that has been scanned, classified (when applicable), and added to the Azure Purview data map. Ingested assets are discoverable and consumable within the data catalog through automated scanning or external connections, such as Azure Data Factory and Azure Synapse.
## Insights
An area within Azure Purview where you can view reports that summarize information about your data.
## Integration runtime
The compute infrastructure used to scan in a data source.
## Lineage
How data transforms and flows as it moves from its origin to its destination. Understanding this flow across the data estate helps organizations see the history of their data, and aid in troubleshooting or impact analysis.
## Logical asset
An asset that represents a concept or semantic object. Logical assets are instances of the concepts used to build metamodels. A business process, glossary term, and project are all examples of logical assets.
## Managed attribute
A set of user-defined attributes that provide a business or organization level context to an asset. A managed attribute has a name and a value. For example, “Department” is an attribute name and “Finance” is its value.
## Management
An area within Azure Purview where you can manage connections, users, roles, and credentials. Also referred to as "Management center."
## Metamodel
A logical data model for a metadata repository like the Azure Purview data catalog. A metamodel includes concepts, their attributes, and the relationships between the concepts.
## Minimum match threshold
The minimum percentage of matches among the distinct data values in a column that must be found by the scanner for a classification to be applied.

For example, a minimum match threshold of 60% for employee ID requires that 60% of all distinct values among the sampled data in a column match the data pattern set for employee ID. If the scanner samples 128 values in a column and finds 60 distinct values in that column, then at least 36 of the distinct values (60%) must match the employee ID data pattern for the classification to be applied.
## Object type
A categorization of assets based upon common data structures. For example, an Azure SQL Server table and Oracle database table both have an object type of table.
## On-premises data
Data that is in a data center controlled by a customer, for example, not in the cloud or software as a service (SaaS).
## Owner
An individual or group in charge of managing a data asset.
## Pattern rule
A configuration that overrides how Azure Purview groups assets as resource sets and displays them within the catalog.
## Policy
A statement or collection of statements that controls how access to data and data sources should be authorized.
## Azure Purview instance
A single Azure Purview account.
## Registered source
A source that has been added to an Azure Purview instance and is now managed as a part of the Data catalog.
## Related terms
Glossary terms that are linked to other terms within the organization.
## Relationship
A connection between two assets that describes how the objects interact with each other. For example, a business process consumes a data set.
## Resource set
A single asset that represents many partitioned files or objects in storage. For example, Azure Purview stores partitioned Apache Spark output as a single resource set instead of unique assets for each individual file.
## Role
Permissions assigned to a user within an Azure Purview instance. Roles, such as Azure Purview Data Curator or Azure Purview Data Reader, determine what can be done within the product.
## Root collection
A system-generated collection that has the same friendly name as the Azure Purview account. All assets belong to the root collection by default.
## Scan
An Azure Purview process that examines a source or set of sources and ingests its metadata into the data catalog. Scans can be run manually or on a schedule using a scan trigger.
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
## Secondary asset
Any Atlas entity in the data catalog that is not returned in search results or shown in search taxonomy. For example, column, parameter, index, foreign key, and primary key are considered secondary assets.
## Self-hosted integration runtime
An integration runtime installed on an on-premises machine or virtual machine inside a private network that is used to connect to data on-premises or in a private network.
## Sensitivity label
Annotations that classify and protect an organization’s data. Azure Purview integrates with Microsoft Information Protection for creation of sensitivity labels.
## Sensitivity label report
A summary of which sensitivity labels are applied across the data estate.
## Service
A product that provides standalone functionality and is available to customers by subscription or license.
## Source
A system where data is stored. Sources can be hosted in various places such as a cloud or on-premises. You register and scan sources so that you can manage them in Azure Purview.
## Source type
A categorization of the registered sources used in an Azure Purview instance, for example, Azure SQL Database, Azure Blob Storage, Amazon S3, or SAP ECC.
## Structured data
Data that adheres to a strict schema, so all the data has the same columns or properties. Sometimes referred to as relational data. 
## Steward
An individual who defines the standards for a glossary term. They are responsible for maintaining quality standards, nomenclature, and rules for the assigned entity.
## Term template
A definition of attributes included in a glossary term. Users can either use the system-defined term template or create their own to include custom attributes.
## Unmanaged data source
A data source in an organization that is not a part of the Azure Purview data catalog.
## Unstructured data
Data that does not adhere to a strict schema, has no structure, or does not have a repeating structure. Unstructured data is often stored in a data lake. 
## Workflow
An automated process that coordinates the creation and modification of catalog entities, including validation and approval. Workflows define repeatable business processes to achieve high quality data, policy compliance, and user collaboration across an organization.
## Next steps

To get started with Azure Purview, see [Quickstart: Create an Azure Purview account](create-catalog-portal.md).
