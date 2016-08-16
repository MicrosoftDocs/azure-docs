<properties
   pageTitle="Azure Data Catalog developer concepts"
   description="Introduction to the key concepts in Azure Data Catalog conceptual model, as exposed through the Catalog REST API."
   services="data-catalog"
   documentationCenter=""
   authors="spelluru"
   manager="paulettm"
   editor=""
   tags=""/>
<tags
   ms.service="data-catalog"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-catalog"
   ms.date="07/25/2016"
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

For example, under the asset root is an array of description objects. The array property is named “descriptions”. A description object has one property - description. The pattern is that each user who types description gets a description object created for the value supplied by the user.

The UX can then choose how to display the combination. There are three different patterns for display.

-	The simplest pattern is “Show All”. In this pattern all the objects are shown in some sort of list view. This is what the Azure Data Catalog portal UX does for description.
-	Another pattern is “Merge”. In this pattern all the values from the different users are merged together, with duplicate removed. Examples of this pattern in the Azure Data Catalog portal UX are the tags and experts properties.
-	A third pattern is “last writer wins”. In this pattern only the most recent value typed in is shown. friendlyName is an example of this pattern.

## Asset object model

As introduced in the Key Concepts section, the **Azure Data Catalog** object model includes items, which can be assets or annotations. Items have properties, which can be optional or required. Some properties apply to all items. Some properties apply to all assets. Some properties apply only to specific asset types.

### System properties

<table><tr><td><b>Property Name</b></td><td><b>Data Type</b></td><td><b>Comments</b></td></tr><tr><td>timestamp</td><td>DateTime</td><td>The last time the item was modified. This is generated by the server when an item is inserted and every time an item is updated. The value of this property is ignored on input of publish operations.</td></tr><tr><td>id</td><td>Uri</td><td>Absolute url of the item (read-only). It is the unique addressable URI for the item.  The value of this property is ignored on input of publish operations.</td></tr><tr><td>type</td><td>String</td><td>The type of the asset (read-only).</td></tr><tr><td>etag</td><td>String</td><td>A string corresponding to the version of the item that can be used for optimistic concurrency control when performing operations that update items in the catalog. "*" can be used to match any value.</td></tr></table>

### Common properties

These properties apply to all root asset types and all annotation types.

<table>
<tr><td><b>Property Name</b></td><td><b>Data Type</b></td><td><b>Comments</b></td></tr>
<tr><td>fromSourceSystem</td><td>Boolean</td><td>Indicates whether item's data is derived from a source system (like Sql Server Database, Oracle Database) or authored by a user.</td></tr>
</table>

### Common root properties
<p>
These properties apply to all root asset types.
<table><tr><td><b>Property Name</b></td><td><b>Data Type</b></td><td><b>Comments</b></td></tr><tr><td>name</td><td>String</td><td>A name derived from the data source location information</td></tr><tr><td>dsl</td><td>DataSourceLocation</td><td>Uniquely describes the data source and is one of the identifiers for the asset. (See dual identity section).  The structure of the dsl varies by the protocol and source type.</td></tr><tr><td>dataSource</td><td>DataSourceInfo</td><td>More detail on the type of asset.</td></tr><tr><td>lastRegisteredBy</td><td>SecurityPrincipal</td><td>Describes the user who most recently registered this asset.  Contains both the unique id for the user (the upn) as well as a display name (lastName and firstName).</td></tr><tr><td>containerId</td><td>String</td><td>Id of the container asset for the data source. This property is not supported for the Container type.</td></tr></table>

### Common non-singleton annotation properties

These properties apply to all non-singleton annotation types (i.e. annotations which allowed to be multiple per asset).

<table>
<tr><td><b>Property Name</b></td><td><b>Data Type</b></td><td><b>Comments</b></td></tr>
<tr><td>key</td><td>String</td><td>A user specified key which uniquely identifies the annotation in the current collection. The key length cannot exceed 256 characters.</td></tr>
</table>

### Root asset types

Root asset types are those types that represent the various types of data assets that can be registered in the catalog. For each root type there is a view defined which describes asset and annotations included in the view. View name should be used in the corresponding {view_name} url segment when publishing an asset using REST API.

<table><tr><td><b>Asset Type (View name)</b></td><td><b>Additional Properties</b></td><td><b>Data Type</b></td><td><b>Allowed Annotations</b></td><td><b>Comments</b></td></tr><tr><td>Table ("tables")</td><td></td><td></td><td>Description<p>FriendlyName<p>Tag<p>Schema<p>ColumnDescription<p>ColumnTag<p> Expert<p>Preview<p>AccessInstruction<p>TableDataProfile<p>ColumnDataProfile<p>ColumnDataClassification<p>Documentation<p></td><td>A Table represents any tabular data.  This would include a SQL Table, SQL View, Analysis Services Tabular Table, Analysis Services Multidimensional dimension, Oracle Table, etc…   </td></tr><tr><td>Measure ("measures")</td><td></td><td></td><td>Description<p>FriendlyName<p>Tag<p>Expert<p>AccessInstruction<p>Documentation<p></td><td>This type represents an Analysis Services measure.</td></tr><tr><td></td><td>measure</td><td>Column</td><td></td><td>Metadata describing the measure</td></tr><tr><td></td><td>isCalculated </td><td>Boolean</td><td></td><td>Specifies if the measure is calculated or not.</td></tr><tr><td></td><td>measureGroup</td><td>String</td><td></td><td>Physical container for measure</td></tr><td>KPI ("kpis")</td><td></td><td></td><td>Description<p>FriendlyName<p>Tag<p>Expert<p>AccessInstruction<p>Documentation</td><td></td></tr><tr><td></td><td>measureGroup</td><td>String</td><td></td><td>Physical container for measure</td></tr><tr><td></td><td>goalExpression</td><td>String</td><td></td><td>An MDX numeric expression or a calculation that returns the target value of the KPI.</td></tr><tr><td></td><td>valueExpression</td><td>String</td><td></td><td>An MDX numeric expression that returns the actual value of the KPI.</td></tr><tr><td></td><td>statusExpression</td><td>String</td><td></td><td>An MDX expression that represents the state of the KPI at a specified point in time.</td></tr><tr><td></td><td>trendExpression</td><td>String</td><td></td><td>An MDX expression that evaluates the value of the KPI over time. The trend can be any time-based criterion that is useful in a specific business context.</td>
<tr><td>Report ("reports")</td><td></td><td></td><td>Description<p>FriendlyName<p>Tag<p>Expert<p>AccessInstruction<p>Documentation<p></td><td>This type represents a SQL Server Reporting Services report </td></tr><tr><td></td><td>assetCreatedDate</td><td>String</td><td></td><td></td></tr><tr><td></td><td>assetCreatedBy</td><td>String</td><td></td><td></td></tr><tr><td></td><td>assetModifiedDate</td><td>String</td><td></td><td></td></tr><tr><td></td><td>assetModifiedBy</td><td>String</td><td></td><td></td></tr><tr><td>Container ("containers")</td><td></td><td></td><td>Description<p>FriendlyName<p>Tag<p>Expert<p>AccessInstruction<p>Documentation<p></td><td>This type represents a container of other assets such as a SQL database, an Azure Blobs container, or an Analysis Services model.</td></tr></table>

### Annotation types

Annotation types represent types of metadata that can be assigned to other types within the catalog.

<table>
<tr><td><b>Annotation Type (Nested view name)</b></td><td><b>Additional Properties</b></td><td><b>Data Type</b></td><td><b>Comments</b></td></tr>

<tr><td>Description ("descriptions")</td><td></td><td></td><td>This contains a description for an asset. Each user of the system can add their own description.  Only that user can edit the Description object.  (Admins and Asset owners can delete the Description object but not edit it). The system maintains these separately.  Thus there is an array of descriptions on each asset (one for each user who has contributed their knowledge about the asset, in addition to possibly one that contains information derived from the data source).</td></tr>
<tr><td></td><td>description</td><td>string</td><td>A short description (2-3 lines) of the asset</td></tr>

<tr><td>Tag ("tags")</td><td></td><td></td><td>This contains a tag for an asset. Each user of the system can add multiple tags for an asset.  Only the user who created Tag objects can edit them.  (Admins and Asset owners can delete the Tag object but not edit it). The system maintains these separately.  Thus there is an array of Tag objects on each asset.</td></tr>
<tr><td></td><td>tag</td><td>string</td><td>A tag describing the asset.</td></tr>

<tr><td>FriendlyName ("friendlyName")</td><td></td><td></td><td>This contains a friendly name for an asset. FriendlyName is a sigleton annotation - only one FriendlyName can be added to an asset.  Only the user who created FriendlyName object can edit it. (Admins and Asset owners can delete the FriendlyName object but not edit it). The system maintains these separately.</td></tr>
<tr><td></td><td>friendlyName</td><td>string</td><td>A friendly name of the asset.</td></tr>

<tr><td>Schema ("schema")</td><td></td><td></td><td>The Schema describes the structure of the data.  It lists the attribute (i.e. column, attribute, field, etc…) names, types as well other metadata.  This information is all derived from the data source.  Schema is a singleton annotaiton - only one Schema can be added for an asset.</td></tr>
<tr><td></td><td>columns</td><td>Column[]</td><td>An array of column objects. They describe the column with information derived from the data source.</td></tr>

<tr><td>ColumnDescription ("columnDescriptions")</td><td></td><td></td><td>This contains a description for a column.  Each user of the system can add their own descriptions for multiple columns (at most one per column). Only the user who created ColumnDescription objects can edit them.  (Admins and Asset owners can delete the ColumnDescription object but not edit it). The system maintains these separately.  Thus there is an array of ColumnDescription objects on each asset (one per column for each user who has contributed their knowledge about the column in addition to possibly one that contains information derived from the data source).  The ColumnDescription is loosely bound to the Schema so it can get out of sync. i.e. the ColumnDescription might describe a column that no longer exist in the schema.  It is up to the writer to keep these in sync.  The data source may also have columns description information. These would be additional ColumnDescription objects that would be created when running the tool.</td></tr>
<tr><td></td><td>columnName</td><td>String</td><td>The name of the column this description refers to.</td></tr>
<tr><td></td><td>description</td><td>String</td><td>a short description (2-3 lines) of the column.</td></tr>

<tr><td>ColumnTag ("columnTags")</td><td></td><td></td><td>This contains a tag for a column.  Each user of the system can add multiple tags for a given column and can add tags for multiple columns. Only the user who created ColumnTag objects can edit them. (Admins and Asset owners can delete the ColumnTag object but not edit it). The system maintains these separately.  Thus there is an array of ColumnTag objects on each asset.  The ColumnTag is loosely bound to the schema so it can get out of sync. i.e. the ColumnTag might describe a column that no longer exist in the schema.  It is up to the writer to keep these in sync.</td></tr>
<tr><td></td><td>columnName</td><td>String</td><td>The name of the column this tag refers to.</td></tr>
<tr><td></td><td>tag</td><td>String</td><td>A tag describing the column.</td></tr>

<tr><td>Expert ("experts")</td><td></td><td></td><td>This contains a user who is considered an expert in the data set.  The experts’ opinions (i.e. descriptions) will bubble to the top of the UX when listing descriptions.    Each user can specify their own experts.    Only that user can edit the experts object.  (Admins and Asset owners can delete the Expert objects but not edit it).</td></tr>
<tr><td></td><td>expert</td><td>SecurityPrincipal</td><td></td></tr>

<tr><td>Preview ("previews")</td><td></td><td></td><td>The preview contains a snapshot of the top 20 rows of data for the asset. Preview only make sense for some types of assets (i.e. it makes sense for Table but not for Measure).</td></tr>
<tr><td></td><td>preview</td><td>object[]</td><td>Array of objects that represent a column.  Each object has a property mapping to a column with a value for that column for the row.</td></tr>

<tr><td>AccessInstruction ("accessInstructions")</td><td></td><td></td><td></td></tr>
<tr><td></td><td>mimeType</td><td>string</td><td>The mime type of the content.</td></tr>
<tr><td></td><td>content</td><td>string</td><td>The instructions for how to get access to this data asset. This could be an URL, an email address, or a set of instructions.</td></tr>

<tr><td>TableDataProfile ("tableDataProfiles")</td><td></td><td></td><td></td></tr>
<tr><td></td><td>numberOfRows</td></td><td>int</td><td>The number of rows in the data set</td></tr>
<tr><td></td><td>size</td><td>long</td><td>The size in bytes of the data set.  </td></tr>
<tr><td></td><td>schemaModifiedTime</td><td>string</td><td>The last time the schema was modified</td></tr>
<tr><td></td><td>dataModifiedTime</td><td>string</td><td>The last time the data set was modified (data was added, modified or delete)</td></tr>

<tr><td>ColumnsDataProfile ("columnsDataProfiles")</td><td></td><td></td><td></td></tr>
<tr><td></td><td>columns</td></td><td>ColumnDataProfile[]</td><td>An array of column data profiles.</td></tr>

<tr><td>ColumnDataClassification ("columnDataClassifications")</td><td></td><td></td><td></td></tr>
<tr><td></td><td>columnName</td><td>String</td><td>The name of the column this classification refers to.</td></tr>
<tr><td></td><td>classification</td><td>String</td><td>The classification of the data in this column.</td></tr>

<tr><td>Documentation ("documentation")</td><td></td><td></td><td>A given asset can have only one documentation associated with it.</td></tr>
<tr><td></td><td>mimeType</td><td>string</td><td>The mime type of the content.</td></tr>
<tr><td></td><td>content</td><td>string</td><td>The documentation content.</td></tr>

</table>

### Common types

Common types can be used as the types for properties, but are not Items.
<table>
<tr><td><b>Common Type</b></td><td><b>Properties</b></td><td><b>Data Type</b></td><td><b>Comments</b></td></tr>
<tr><td>DataSourceInfo</td><td></td><td></td><td></td></tr>
<tr><td></td><td>sourceType</td><td>string</td><td>Describes the type of data source.  i.e. SQL Server, Oracle Database, etc…  </td></tr>
<tr><td></td><td>objectType</td><td>string</td><td>Describes the type of object in the data source. i.e. Table, View for SQL Server.</td></tr>

<tr><td>DataSourceLocation</td><td></td><td></td><td></td></tr>
<tr><td></td><td>protocol</td><td>string</td><td>Required. Describes a protocol used to communicate with the data source. i.e. "tds" for SQl Server, "oracle" for Oracle, etc… Please refer to [Data source reference specification - DSL Structure](data-catalog-dsr.md) for the list of currently supported protocols.</td></tr>
<tr><td></td><td>address</td><td>Dictionary<string, object></td><td>Required. This is a set of data specific to the protocol that is used to identify the data source being referenced. The address data scoped to a particular protocol, meaning it is meaningless without knowing the protocol.</td></tr>
<tr><td></td><td>authentication</td><td>string</td><td>Optional. The authentication scheme used to communicate with the data source. i.e. windows, oauth, etc… </td></tr>
<tr><td></td><td>connectionProperties</td><td>Dictionary<string, object></td><td>Optional. Additional information on how to connect to a data source.</td></tr>

<tr><td>SecurityPrincipal</td><td></td><td></td><td>Note that backend does not perform any validation of provided properties against AAD during publishing.</td></tr>
<tr><td></td><td>upn</td><td>string</td><td>Unique email address of user. Must be specified if objectId is not provided or in the context of "lastRegisteredBy" property, otherwise optional.</td></tr>
<tr><td></td><td>objectId</td><td>Guid</td><td>User or security group AAD identity. Optional. Must be specified if upn is not provided, otherwise optional.</td></tr>
<tr><td></td><td>firstName</td><td>string</td><td>First name of user (for display purposes). Optional. Only valid in the context of "lastRegisteredBy" property. Cannot be specified when providing security principal for "roles", "permissions" and "experts".</td></tr>
<tr><td></td><td>lastName</td><td>string</td><td>Last name of user (for display purposes). Optional. Only valid in the context of "lastRegisteredBy" property. Cannot be specified when providing security principal for "roles", "permissions" and "experts".</td></tr>

<tr><td>Column</td><td></td><td></td><td></td></tr>
<tr><td></td><td>name</td><td>string</td><td>Name of the column or attribute.</td></tr>
<tr><td></td><td>type</td><td>string</td><td>data type of the column or attribute. The Allowable types will depend on data sourceType of the asset.  Only a subset of types are supported.</td></tr>
<tr><td></td><td>maxLength</td><td>int</td><td>The maximum length allowed for the column or attribute. Derived from data source. Only applicable to some source types.</td></tr>
<tr><td></td><td>precision</td><td>byte</td><td>The precision for the column or attribute. Derived from data source. Only applicable to some source types.</td></tr>
<tr><td></td><td>isNullable</td><td>Boolean</td><td>Whether the column is allowed to have a null value or not. Derived from data source. Only applicable to some source types.</td></tr>
<tr><td></td><td>expression</td><td>string</td><td>If the value is a calculated column this field contains the expression that expresses the value. Derived from data source. Only applicable to some source types.</td></tr>

<tr><td>ColumnDataProfile</td><td></td><td></td><td></td></tr>
<tr><td></td><td>columnName </td><td>string</td><td>The name of the column</td></tr>
<tr><td></td><td>type </td><td>string</td><td>The type of the column</td></tr>
<tr><td></td><td>min </td><td>string</td><td>The minimum value in the data set</td></tr>
<tr><td></td><td>max </td><td>string</td><td>The maximum value in the data set</td></tr>
<tr><td></td><td>avg </td><td>double</td><td>The average value in the data set</td></tr>
<tr><td></td><td>stdev </td><td>double</td><td>The standard deviation for the data set</td></tr>
<tr><td></td><td>nullCount </td><td>int</td><td>The count of null values in the data set</td></tr>
<tr><td></td><td>distinctCount  </td><td>int</td><td>The count of distinct values in the data set</td></tr>


</table>

## Asset identity
Azure Data Catalog uses "protocol" and identity properties from the "address" property bag of the DataSourceLocation "dsl" property to generate identity of the asset which is used to address the asset inside the Catalog.
For example, the "tds" protocol has identity properties "server", "database", "schema" and "object"; the combination of the protocol and the identity properties are used to generate the identity of the SQL Server Table Asset.
Azure Data Catalog provides several built-in data source protocols which are listed at [Data source reference specification - DSL Structure](data-catalog-dsr.md).
The set of supported protocols can be extended programmatically (please refer to Data Catalog REST API reference). Administrators of the Catalog can register custom data source protocols. The table below describes the properties needed to register a custom protocol.

### Custom data source protocol specification
<table>
<tr><td><b>Type</b></td><td><b>Properties</b></td><td><b>Data Type</b></td><td><b>Comments</b></td></tr>

<tr><td>DataSourceProtocol</td><td></td><td></td><td></td></tr>
<tr><td></td><td>namespace</td><td>string</td><td>The namespace of the protocol. Namespace must be from 1 to 255 characters long, contain one or more non-empty parts separated by dot (.). Each part must be from 1 to 255 characters long, start with a letter and contain only letters and numbers.</td></tr>
<tr><td></td><td>name</td><td>string</td><td>The name of the protocol. Name must be from 1 to 255 characters long, start with a letter and contain only letters, numbers, and the dash (-) character.</td></tr>
<tr><td></td><td>identityProperties</td><td>DataSourceProtocolIdentityProperty[]</td><td>List of identity properties, must contain at least one, but no more than 20 properties. For example: "server", "database", "schema", "object" are identity properties of the "tds" protocol.</td></tr>
<tr><td></td><td>identitySets</td><td>DataSourceProtocolIdentitySet[]</td><td>List of identity sets. Defines sets of identity properties which represent valid asset's identity. Must contain at least one, but no more than 20 sets. For example: {"server", "database", "schema" and "object"} is an identity set for "tds" protocol, which defines identity of Sql Server Table asset.</td></tr>

<tr><td>DataSourceProtocolIdentityProperty</td><td></td><td></td><td></td></tr>
<tr><td></td><td>name</td><td>string</td><td>The name of the property. Name must be from 1 to 100 characters long, start with a letter and can contain only letters and numbers.</td></tr>
<tr><td></td><td>type</td><td>string</td><td>The type of the property. Supported values: "bool", boolean", "byte", "guid", "int", "integer", "long", "string", "url"</td></tr>
<tr><td></td><td>ignoreCase</td><td>bool</td><td>Indicates whether case should be ignored when using property's value. Can only be specified for properties with "string" type. Default value is false.</td></tr>
<tr><td></td><td>urlPathSegmentsIgnoreCase</td><td>bool[]</td><td>Indicates whether case should be ignored for each segment of the url's path. Can only be specified for properties with "url" type. Default value is [false].</td></tr>

<tr><td>DataSourceProtocolIdentitySet</td><td></td><td></td><td></td></tr>
<tr><td></td><td>name</td><td>string</td><td>The name of the identity set.</td></tr>
<tr><td></td><td>properties</td><td>string[]</td><td>The list of identity properties included into this identity set. It cannot contain duplicates. Each property referenced by identity set must be defined in the list of  "identityProperties" of the protocol.</td></tr>

</table>

## Roles and authorization

Microsoft Azure Data Catalog provides authorization capabilities for CRUD operations on assets and annotations.

## Key concepts

The Azure Data Catalog uses two authorization mechanisms:

- Role-based authorization
- Permission-based authorization

### Roles

There are 3 roles: **Administrator**, **Owner**, and **Contributor**.  Each role has its scope and rights which are summarized in the following table.

<table><tr><td><b>Role</b></td><td><b>Scope</b></td><td><b>Rights</b></td></tr><tr><td>Administrator</td><td>Catalog (i.e. all assets/annotations in the Catalog)</td><td>Read
Delete
ViewRoles

ChangeOwnership
ChangeVisibility
ViewPermissions</td></tr><tr><td>Owner</td><td>Each asset (i.e. aka root item)</td><td>Read
Delete
ViewRoles

ChangeOwnership
ChangeVisibility
ViewPermissions</td></tr><tr><td>Contributor</td><td>Each individual asset and annotation</td><td>Read
Update
Delete
ViewRoles
Note: all the rights are revoked if the Read right on the item is revoked from the Contributor</td></tr></table>

> [AZURE.NOTE] **Read**, **Update**, **Delete**, **ViewRoles** rights are applicable to any item (asset or annotation) while **TakeOwnership**, **ChangeOwnership**, **ChangeVisibility**, **ViewPermissions** are only applicable to the root asset.
>
>**Delete** right applies to an item as well as any sub-items or single item underneath it. For example, deleting an asset will also delete any annotations for that asset.

### Permissions

Permission is as list of access control entries. Each access control entry assigns set of rights to a security principal. Permissions can only be specified on an asset (i.e. root item) and apply to the asset and any sub-items.

During the **Azure Data Catalog** preview, only **Read** right is supported in the permissions list to enable scenario to restrict visibility of an asset.

By default any authenticated user has **Read** right for any item in the catalog unless visibility is restricted to the set of principals in the permissions.

## REST API

**PUT** and **POST** view item requests can be used to control roles and permissions: in addition to item payload two system properties can be specified **roles** and **permissions**.

> [AZURE.NOTE]
>
> **permissions** only applicable to a root item.
>
> **Owner** role only applicable to a root item.
>
> By default when an item is created in the catalog its **Contributor** is set to the currently authenticated user. If item should be updatable by everyone, **Contributor** should be set to <Everyone> special security principal in the **roles** property when item is first published (refer to example below). **Contributor** cannot be changed and stays the same during life-time of an item (i.e. even **Administrator** or **Owner** doesn’t have the right to change the **Contributor**). The only value supported for the explicit setting of the **Contributor** is <Everyone>: i.e. **Contributor** can only be a user who created an item or <Everyone>.

###Examples
**Set Contributor to <Everyone> when publishing an item.**
Special security principal <Everyone> has objectId "00000000-0000-0000-0000-000000000201".
  **POST** https://api.azuredatacatalog.com/catalogs/default/views/tables/?api-version=2016-03-30

  > [AZURE.NOTE] Some HTTP client implementations may automatically re-issue requests in response to a 302 from the server, but typically strip Authorization headers from the request. Since the Authorization header is required to make requests to ADC, you must ensure the Authorization header is still provided when re-issuing a request to a redirect location specified by ADC. Below is sample code demonstrating this using the .NET HttpWebRequest object.

**Body**

	{
		"roles": [
			{
				"role": "Contributor",
				"members": [
					{
						"objectId": "00000000-0000-0000-0000-000000000201"
					}
				]
			}
		]
	}

  **Assign owners and restrict visibility for an existing root item**
  **PUT** https://api.azuredatacatalog.com/catalogs/default/views/tables/042297b0...1be45ecd462a?api-version=2016-03-30

	{
		"roles": [
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
		"permissions": [
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
