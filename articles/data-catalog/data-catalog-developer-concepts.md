<properties
   pageTitle="Azure Data Catalog developer concepts | Microsoft Azure"
   description="Introduction to the key concepts in Azure Data Catalog conceptual model, as exposed through the Catalog REST API."
   services="data-catalog"
   documentationCenter=""
   authors="dvana"
   manager="mblythe"
   editor=""
   tags=""/>
<tags
   ms.service="data-catalog"
   ms.devlang="NA"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-catalog"
   ms.date="03/10/2016"
   ms.author="derrickv"/>  

# Azure Data Catalog developer concepts

Microsoft **Azure Data Catalog** is a fully managed cloud service that provides capabilities for data source discovery and for crowdsourcing data source metadata. Developers can use the service via its REST APIs. Understanding the concepts implemented in the service is important for developers to successfully integrate with **Azure Data Catalog**.

## Key concepts

The **Azure Data Catalog** conceptual model is based on four key concepts: The **Catalog**, **Users**, **Assets**, and **Annotations**.

![concept][1]

*Figure 1 - Azure Data Catalog simplified conceptual model*

### Catalog

A **Catalog** is the top level container for all the metadata an organization will store. There is one **Catalog** allowed per Azure Account. Catalogs are tied to an Azure subscription, but only one **Catalog** can be created for any given Azure account, even though an account can have multiple subscriptions.

A catalog contains **Users** and **Assets**.

### Users

Users are security principals that have permissions to perform actions (search the catalog, add, edit or remove items, etc…) in the Catalog.

There are several different roles a user can have. For more information on roles see the section Roles and Authorization.

Individual users and security groups can be added.

Azure Data Catalog uses Azure Active Directory for identity and access management. Each Catalog user must be a member of the Active Directory for the account.

### Assets

A **Catalog** contains data assets. **Assets** are the unit of granularity managed by the catalog.

The granularity of an asset varies by data source. For SQL Server or Oracle Database an asset can be a Table or a View. For SQL Server Analysis Services an asset can be a Measure, a Dimension, or a Key Performance Indicator (KPI). For SQL Server Reporting Services an asset is a Report.

An **Asset** is the thing you add or remove from a Catalog. It is the unit of result you get back from **Search**.

An **Asset** is made up from its name, location and type as well as annotations that further describe it.

### Annotations

Annotations are items that represent metadata about Assets.

Examples of annotations are description, tags, schema, documentation, etc… A full list of the asset types and annotation types are in the Asset Object model section.

## Crowdsourcing annotations and user perspective (multiplicity of opinion)

A key aspect of Azure Data Catalog is how it supports the crowdsourcing of metadata in the system. As opposed to a wiki approach – where there is only one opinion and the last writer wins – the Azure Data Catalog model allows multiple opinions to live side by side in the system.

This approach reflects the real world of enterprise data where different users can have different perspectives on a given asset:

-	A database administrator may provide information about service level agreements, or the available processing window for bulk ETL operations
-	A data steward may provide information about the business processes to which the asset applies, or the classifications that the business has applied to it
-	A finance analyst may provide information about how the data is used during end-of-period reporting tasks

To support this example, each user – the DBA, the data steward, and the analyst – can add a description to a single table that has been registered in the Catalog. All descriptions are maintained in the system, and in the Azure Data Catalog portal all descriptions are displayed.

This pattern is applied to most of the items in the object model. This is the reason object types in the JSON payload are often arrays for properties where you might expect a singleton.

For example, under the asset root is an array of description objects. The array property is named “descriptions”. A description object has three properties, description, tags, and friendlyName. The pattern is that each user who types any one or more of those properties gets a description object created for the values supplied by the user.

The UX can then choose how to display the combination. There are three different patterns for display.

-	The simplest pattern is “Show All”. In this pattern all the objects are shown in some sort of list view. This is what the Azure Data Catalog portal UX does for description.
-	Another pattern is “Merge”. In this pattern all the values from the different users are merged together, with duplicate removed. Examples of this pattern in the Azure Data Catalog portal UX are the tags and experts properties.
-	A third pattern is “last writer wins”. In this pattern only the most recent value typed in is shown. friendlyName is an example of this pattern.

## Asset object model

As introduced in the Key Concepts section, the **Azure Data Catalog** object model includes items, which can be assets or annotations. Items have properties, which can be optional or required. Some properties apply to all items. Some properties apply to all assets. Some properties apply only to specific asset types.

### Common properties

These properties apply to all root asset types and all annotation types.

> [AZURE.NOTE] Properties whose names begin with a double underscore are system types.

|**Property Name**|**Data Type**|**Comments**
|---|---|---
|modifiedTime|DateTime|The last time the root was modified.  This is set by the client. (The server does not maintain this value).
|__id|String|id of the item (read-only). This id is guaranteed to unique to the asset within a catalog.
|__type|String|The type of the asset (read-only).
|__creatorId|String|A string used by the creator of the asset to uniquely identify the asset.

### Common root properties

These properties apply to all root asset types.

|**Property Name**|**Data Type**|**Comments**
|---|---|---
|name|String|A name derived from the data source location information
|dsl|Data Source Location|Uniquely describes the data source and is one of the identifiers for the asset. (See dual identity section).  The structure of the dsl varies by the source type.
|dataSource|DataSourceInfo|More detail on the type of asset.
|lastRegisteredBy|SecurityPrincipal|Describes the user who most recently registered this asset.  Contains both the unique id for the user (the upn) as well as a display name (lastName and firstName).
|lastRegisteredTime|dateTime|The last time this asset was registered in the catalog.
|containerId|String|Id of the container asset for the data source. This property is not supported for the Container type.

### Root asset types

Root asset types are those types that represent the various types of data assets that can be registered in the catalog.

|**Asset Type**|**Additional Properties**|**Data Type**|**Comments**
|---|---|---|---
|Table|||A Table represents any tabular data.  This would include a SQL Table, SQL View, Analysis Services Tabular Table, Analysis Services Multidimensional dimension, Oracle Table, etc?
|Measure|||This type represents an Analysis Services measure.
||Measure|Column|Metadata describing the measure
||isCalculated|Boolean|Specifies if the measure is calculated or not.
||measureGroup|String|Physical container for measure
||goalExpression|String|An MDX numeric expression or a calculation that returns the target value of the KPI.
||valueExpression|String|An MDX numeric expression that returns the actual value of the KPI.
||statusExpression|String|An MDX expression that represents the state of the KPI at a specified point in time.
||trendExpression|String|An MDX expression that evaluates the value of the KPI over time. The trend can be any time-based criterion that is useful in a specific business context.
||measureGroup|String|physical container for measure
|Report|||This type represents a SQL Server Reporting Services report
||CreatedBy|String| |
||CreatedDate|String| |
|Container|||This type represents a container of other assets such as a SQL database, an Azure Blobs container, or an Analysis Services model.

### Annotation types

Annotation types represent types of metadata that can be assigned to other types within the catalog.

|**Annotation Type**|**Additional Properties**|**Data Type**|**Comments**
|---|---|---|---
|Description|||Each user of the system can add their own description and tags. Only that user can edit the Description object. (Admins and Asset owners can delete the description object but not edit it). The system maintains these separately. Thus there is an array of descriptions on each asset (one for each user who has contributed their knowledge about the asset, in addition to possibly one that contains information derived from the data source).
||friendlyName|string|A friendly name that can be used instead of the name derived from the data source. This is useful for display and for searching.
||tags|string[]|An array of tags for the asset
||description|string|a short description (2-3 lines) of the asset
|Schema|||The Schema describes the structure of the data. It lists the attribute (i.e. column, attribute, field, etc?) names, types as well other metadata. This information is all derived from the data source. There is typically one schema item on an asset.
||columns|Column[]|An array of column objects. They describe the column with information derived from the data source.
|SchemaDescription|||This contains a description and set of tags for each attribute defined in the schema. Each user of the system can add their own description and tags. Only that user can edit the description object. (Admins and Asset owners can delete the SchemaDescription object but not edit it). The system maintains these separately. Thus there is an array of SchemaDescription objects on each asset (one for each user who has contributed their knowledge about the attributes, in addition to possibly one that contains information derived from the data source). The SchemaAttributes is loosely bound to the schema so it can get out of sync. i.e. the SchemaDescription might describe columns that no longer exist in the schema or fail to reference a new column that was recently added. It is up to the writer to keep these in sync. The data source may also have description information. This would be an additional schemaDescription object that would be created when running the tool.
||columnDescriptions|ColumnDescription[]|An array of ColumnDescriptions that describe the columns in the schema.
|Expert|||This contains a list of users are considered experts in the data set. The experts? opinions (i.e. descriptions) will bubble to the top of the UX when listing descriptions. Each user can specify their own list of experts. Only that user can edit the experts object. (Admins and Asset owners can delete the Experts object but not edit it).
||experts|string[]|Array of email addresses.
|Preview|||The preview contains a snapshot of the top 20 rows of data for the asset. Preview only make sense for some types of assets (i.e. it makes sense for Table but not for Measure).
||preview|object[]|Array of objects that represent a column. Each object has a property mapping to a column with a value for that column for the row.
|AccessInstruction|||This contains information about how to request access to the data source. This information is what is shown in the \"Request Access\" field in the Catalog Portal.
||mimeType|string|The mime type of the content.
||content|string|The instructions for how to get access to this data asset. This could be an URL, an email address, or a set of instructions.
|TableDataProfile|||
||numberOfRows|int|The number of rows in the data set
||size|long|The size in bytes of the data set.
||schemaModifiedTime|string|The last time the schema was modified
||dataModifiedTime|string|The last time the data set was modified (data was added, modified or delete)
|ColumnsDataProfile|||
||columns|ColumnDataProfile[]|The number of rows in the data set
|Documentation|||A given asset can have only one documentation associated with it.
||mimeType|string|The mime type of the content.
||content|string|The documentation content.


### Common types

Common types can be used as the types for properties, but are not Items.

|**Common Type**|**Properties**|**Data Type**|**Comments**
|---|---|---|---
|DataSourceInfo||||
||sourceType|string|Describes the type of data source. i.e. SQL Server, Oracle Database, etc?
||objectType|string|Describes the type of object in the data source. i.e. Table, View for SQL Server.
||formatType|string|Describes the structure of the data. Current values are structured or unstructured.
|SecurityPrincipal||||
||upn|string|Unique email address of user.
||firstName|string|First name of user (for display purposes).
||lastName|string|Last name of user (for display purposes).
|Column||||
||name|string|Name of the column or attribute.
||type|string|data type of the column or attribute. The Allowable types will depend on data sourceType of the asset. Only a subset of types are supported.
||maxLength|int|The maximum length allowed for the column or attribute. Derived from data source. Only applicable to some source types.
||Precision|byte|The precision for the column or attribute. Derived from data source. Only applicable to some source types.
||isNullable|Boolean|Whether the column is allowed to have a null value or not. Derived from data source. Only applicable to some source types.
||expression|string|If the value is a calculated column this field contains the expression that expresses the value. Derived from data source. Only applicable to some source types.
||defaultValue|object|The default value inserted if not specified in the insert statement for the object. Derived from data source. Only applicable to some source types.
|ColumnDescription||||
||tags|string[]|An array of tags describing the column.
||description|string|A description describing the column.
||columnName|string|The name of the column this information refers to.
|ColumnDataProfile||||
||columnName|string|The name of the column
||type|string|The type of the column
||min|string|The minimum value in the data set
||max|string|The maximum value in the data set
||avg|double|The average value in the data set
||stdev|double|The standard deviation for the data set
||nullCount|int|The count of null values in the data set
||distinctCount|int|The count of distinct values in the data set

## Roles and authorization

Microsoft Azure Data Catalog provides authorization capabilities for CRUD operations on assets and annotations.

## Key concepts

The Azure Data Catalog uses two authorization mechanisms:

- Role-based authorization
- Permission-based authorization

### Roles

There are 3 roles: **Administrator**, **Owner**, and **Contributor**.  Each role has its scope and rights which are summarized in the following table.

|**Role**|**Scope**|**Rights**
|---|---|---
|Administrator|Catalog (i.e. all assets/annotations in the Catalog)|Read Delete ViewRoles ChangeOwnership ChangeVisibility ViewPermissions
|Owner|Each asset (i.e. aka root item)|Read Delete ViewRoles ChangeOwnership ChangeVisibility ViewPermissions
|Contributor|Each individual asset and annotation|Read Update Delete ViewRoles Note: all the rights are revoked if the Read right on the item is revoked from the Contributor

> [AZURE.NOTE] **Read**, **Update**, **Delete**, **ViewRoles** rights are applicable to any item (asset or annotation) while **TakeOwnership**, **ChangeOwnership**, **ChangeVisibility**, **ViewPermissions** are only applicable to the root asset.
>
>**Delete** right applies to an item as well as any sub-items or single item underneath it. For example, deleting an asset will also delete any annotations for that asset.

### Permissions

Permission is as list of access control entries. Each access control entry assigns set of rights to a security principal. Permissions can only be specified on an asset (i.e. root item) and apply to the asset and any sub-items.

During the **Azure Data Catalog** preview, only **Read** right is supported in the permissions list to enable scenario to restrict visibility of an asset.

By default any authenticated user has **Read** right for any item in the catalog unless visibility is restricted to the set of principals in the permissions.

## REST API

**PUT** and **POST** view item requests can be used to control roles and permissions: in addition to item payload two system properties can be specified **__roles** and **__permissions**.

> [AZURE.NOTE]
>
> **__permissions** only applicable to a root item.
>
> **Owner** role only applicable to a root item.
>
> By default when an item is created in the catalog its **Contributor** is set to the currently authenticated user. If item should be updatable by everyone, **Contributor** should be set to <Everyone> special security principal in the **__roles** property when item is first published (refer to example below). **Contributor** cannot be changed and stays the same during life-time of an item (i.e. even **Administrator** or **Owner** doesn’t have the right to change the **Contributor**). The only value supported for the explicit setting of the **Contributor** is <Everyone>: i.e. **Contributor** can only be a user who created an item or <Everyone>.

### Examples
**Set Contributor to <Everyone> when publishing an item.**

Special security principal <Everyone> has objectId "00000000-0000-0000-0000-000000000201".

**POST** https://api.azuredatacatalog.com/catalogs/default/views/tables/?api-version=2015-07.1.0-Preview

Requests to **Azure Data Catalog (ADC)** may return an HTTP 302 response to indicate redirection to a different endpoint. In response to a 302, the caller must re-issue the request to the URL specified by the Location response header.


> [AZURE.NOTE] Some HTTP client implementations may automatically re-issue requests in response to a 302 from the server, but typically strip **Authorization headers** from the request. Since the Authorization header is required to make requests to ADC, you must ensure the Authorization header is still provided when re-issuing a request to a redirect location specified by ADC. Below is sample code demonstrating this using the .NET HttpWebRequest object.


**Body**

	{
	    "__roles": [
	        {
	            "role": "Contributor",
	            "members": [
	                {
	                    "objectId": "00000000-0000-0000-0000-000000000201"
	                }
	            ]
	        }
	    ],
	    … other table properties
	}

**Assign owners and restrict visibility for an existing root item**

**PUT** https://api.azuredatacatalog.com/catalogs/default/views/tables/042297b0...1be45ecd462a?api-version=2015-07.1.0-Preview

	{
	    "__roles": [
	        {
	            "role": "Owner",
	            "members": [
	                {
	                    "objectId": "c4159539-846a-45af-bdfb-58efd3772b43",
	                    "upn": "user1@contoso.com"
	                },
	                {
	                    "objectId": "fdabd95b-7c56-47d6-a6ba-a7c5f264533f",
	                    "upn": "user2@contoso.com"
	                }
	            ]
	        }
	    ],
	    "__permissions": [
	        {
	            "principal": {
	                "objectId": "27b9a0eb-bb71-4297-9f1f-c462dab7192a",
	                "upn": "user3@contoso.com"
	            },
	            "rights": [
	                {
	                    "right": "Read"
	                }
	            ]
	        },
	        {
	            "principal": {
	                "objectId": "4c8bc8ce-225c-4fcf-b09a-047030baab31",
	                "upn": "user4@contoso.com"
	            },
	            "rights": [
	                {
	                    "right": "Read"
	                }
	            ]
	        }
	    ]
	}

> [AZURE.NOTE] In PUT it’s not required to specify an item payload in the body: PUT can be used to update just roles and/or permissions.

<!--Image references-->
[1]: ./media/data-catalog-developer-concepts/concept2.png
