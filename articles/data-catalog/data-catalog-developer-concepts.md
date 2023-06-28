---
title: Azure Data Catalog developer concepts
description: Introduction to the key concepts in Azure Data Catalog conceptual model, as exposed through the Catalog REST API.
ms.service: data-catalog
ms.topic: conceptual
ms.date: 12/16/2022
---
# Azure Data Catalog developer concepts

[!INCLUDE [Microsoft Purview redirect](includes/catalog-to-purview-migration-flag.md)]

Microsoft **Azure Data Catalog** is a fully managed cloud service that provides capabilities for data source discovery and for crowdsourcing data source metadata. Developers can use the service via its REST APIs. Understanding the concepts implemented in the service is important for developers to successfully integrate with **Azure Data Catalog**.

## Key concepts

The **Azure Data Catalog** conceptual model is based on four key concepts: The **Catalog**, **Users**, **Assets**, and **Annotations**.

:::image type="content" source="./media/data-catalog-developer-concepts/concept2.png" alt-text="Conceptual model with Azure Account and Azure Subscription at the top, flowing into Catalog. Catalog flows into Users and Assets, and assets flows into Annotations.":::

### Catalog

A **Catalog** is the top-level container for all the metadata that an organization stores. There's one **Catalog** allowed per Azure Account. Catalogs are tied to an Azure subscription, but only one **Catalog** can be created for any given Azure account, even though an account can have multiple subscriptions.

A catalog contains **Users** and **Assets**.

### Users

**Users** are security principals that have permissions to perform actions (search the catalog, add, edit or remove items, etc.) in the Catalog.

There are several different roles a user can have. For information on roles, see the section Roles and Authorization.

Individual users and security groups can be added.

Azure Data Catalog uses Azure Active Directory for identity and access management. Each Catalog user must be a member of the Active Directory for the account.

### Assets

A **Catalog** contains data assets. **Assets** are the unit of granularity managed by the catalog.

The granularity of an asset varies by data source. For SQL Server or Oracle Database, an asset can be a Table or a View. For SQL Server Analysis Services, an asset can be a Measure, a Dimension, or a Key Performance Indicator (KPI). For SQL Server Reporting Services, an asset is a Report.

An **Asset** is the thing you add or remove from a Catalog. It's the unit of result you get back from **Search**.

An **Asset** is made up from its name, location, and type, and annotations that further describe it.

### Annotations

**Annotations** are items that represent metadata about Assets.

Examples of annotations are description, tags, schema, documentation, etc. See the [Asset Object model section](#asset-object-model) for a full list of the asset types and annotation types.

## Crowdsourcing annotations and user perspective (multiplicity of opinion)

A key aspect of Azure Data Catalog is how it supports the crowdsourcing of metadata in the system. As opposed to a wiki approach – where there's only one opinion and the last writer wins – the Azure Data Catalog model allows multiple opinions to live side by side in the system.

This approach reflects the real world of enterprise data where different users can have different perspectives on a given asset:

* A database administrator may provide information about service level agreements, or the available processing window for bulk ETL operations
* A data steward may provide information about the business processes to which the asset applies, or the classifications that the business has applied to it
* A finance analyst may provide information about how the data is used during end-of-period reporting tasks

To support this example, each user – the DBA, the data steward, and the analyst – can add a description to a single table that has been registered in the Catalog. All descriptions are maintained in the system, and in the Azure Data Catalog portal all descriptions are displayed.

This pattern is applied to most of the items in the object model, so object types in the JSON payload are often arrays for properties where you might expect a singleton.

For example, under the asset root is an array of description objects. The array property is named “descriptions”. A description object has one property - description. The pattern is that each user who types description gets a description object created for the value supplied by the user.

The UX can then choose how to display the combination. There are three different patterns for display.

* The simplest pattern is “Show All”. In this pattern, all the objects are shown in a list view. The Azure Data Catalog portal UX uses this pattern for description.
* Another pattern is “Merge”. In this pattern, all the values from the different users are merged together, with duplicate removed. Examples of this pattern in the Azure Data Catalog portal UX are the tags and experts properties.
* A third pattern is “last writer wins”. In this pattern, only the most recent value typed in is shown. friendlyName is an example of this pattern.

## Asset object model

As introduced in the Key Concepts section, the **Azure Data Catalog** object model includes items, which can be assets or annotations. Items have properties, which can be optional or required. Some properties apply to all items. Some properties apply to all assets. Some properties apply only to specific asset types.

### System properties

|Property name  |Data type  |Comments|
|----------|-----------|------------|
|timestamp     |DateTime       |The last time the item was modified. This field is generated by the server when an item is inserted and every time an item is updated. The value of this property is ignored on input of publish operations.        |
|ID|Uri  |Absolute url of the item (read-only). It's the unique addressable URI for the item.  The value of this property is ignored on input of publish operations.|
|type|String   |The type of the asset (read-only).|
|etag|String< |A string corresponding to the version of the item that can be used for optimistic concurrency control when performing operations that update items in the catalog. "*" can be used to match any value.|

### Common properties

These properties apply to all root asset types and all annotation types.

|Property name  |Data type  |Comments|
|----------|-----------|------------|
|fromSourceSystem     |Boolean      |Indicates whether item's data is derived from a source system (like SQL Server Database, Oracle Database) or authored by a user.        |

### Common root properties

These properties apply to all root asset types.

|Property name  |Data type  |Comments|
|----------|-----------|------------|
|name    |String      |A name derived from the data source location information       |
|dsl    |DataSourceLocation      |Uniquely describes the data source and is one of the identifiers for the asset. (See dual identity section).  The structure of the dsl varies by the protocol and source type.       |
|dataSource     |DataSourceInfo    |More detail on the type of asset.    |
|lastRegisteredBy    |SecurityPrincipal     |Describes the user who most recently registered this asset.  Contains both the unique ID for the user (the upn) and a display name (lastName and firstName).     |
|containerID    |String    |ID of the container asset for the data source. This property isn't supported for the Container type.    |

### Common non-singleton annotation properties

These properties apply to all non-singleton annotation types (annotations, which allowed to be multiple per asset).

|Property name  |Data type  |Comments|
|----------|-----------|------------|
|key   |String      |A user specified key, which uniquely identifies the annotation in the current collection. The key length can’t exceed 256 characters.    |

### Root asset types

Root asset types are those types that represent the various types of data assets that can be registered in the catalog. For each root type, there's a view, which describes asset and annotations included in the view. View name should be used in the corresponding {view_name} url segment when publishing an asset using REST API.

|Asset type (view name)  |More properties |Data type|Allowed annotations|Comments|
|----------|-----------|------------|------------|------------|
|Table ("tables")  | ||Description|A Table represents any tabular data.  For example: SQL Table, SQL View, Analysis Services Tabular Table, Analysis Services Multidimensional dimension, Oracle Table, etc.|
||||FriendlyName||
||||Tag||
||||Schema||
||||ColumnDescription||
||||ColumnTag||
||||Expert||
||||Preview||
||||AccessInstruction||
||||TableDataProfile||
||||ColumnDataProfile||
||||ColumnDataClassification||
||||Documentation||
|Measure ("measures")  |||Description|This type represents an Analysis Services measure.|
||||FriendlyName||
||||Tag||
||||Expert||
||||AccessInstruction||
||||Documentation||
||measure|Column||Metadata describing the measure.|
||isCalculated |Boolean||Specifies if the measure is calculated or not.|
||measureGroup |String||Specifies if the measure is calculated or not.|
|KPI ("kpis")  |||Description||
||||FriendlyName||
||||Tag||
||||Expert||
||||AccessInstruction||
||||Documentation||
||measureGroup|String||Physical container for measure.|
||goalExpression|String||An MDX numeric expression or a calculation that returns the target value of the KPI.|
||valueExpression|String||An MDX numeric expression that returns the actual value of the KPI.|
||statusExpression|String||An MDX expression that represents the state of the KPI at a specified point in time.|
||trendExpression|String||An MDX expression that evaluates the value of the KPI over time. The trend can be any time-based criterion that is useful in a specific business context.|
|Report ("reports")  |||Description|This type represents a SQL Server Reporting Services report.|
||||FriendlyName||
||||Tag||
||||Expert||
||||AccessInstruction||
||||Documentation||
||assetCreatedDate|String|||
||assetCreatedDate|String|||
||assetModifiedDate|String|||
||assetModifiedBy|String|||
|Report ("reports")  |||Description|This type represents a container of other assets such as an SQL database, an Azure Blobs container, or an Analysis Services model.|
||||Tag||
||||Expert||
||||AccessInstruction||
||||Documentation||

### Annotation types

Annotation types represent types of metadata that can be assigned to other types within the catalog.

|Annotation type (nested view name)  |More properties |Data type|Comments|
|----------|-----------|------------|------------|
|Description ("descriptions")  |||This property contains a description for an asset. Each user of the system can add their own description.  Only that user can edit the Description object.  (Admins and Asset owners can delete the Description object but not edit it). The system maintains users' descriptions separately.  Thus there's an array of descriptions on each asset (one for each user who has contributed their knowledge about the asset, in addition to possibly one that contains information derived from the data source).|
||description|string|A short description (2-3 lines) of the asset.|
|Tag ("tags") |||This property defines a tag for an asset. Each user of the system can add multiple tags for an asset.  Only the user who created Tag objects can edit them.  (Admins and Asset owners can delete the Tag object but not edit it). The system maintains users' tags separately.  Thus there's an array of Tag objects on each asset.|
||tag|string|A tag describing the asset.|
|FriendlyName ("friendlyName") |||This property contains a friendly name for an asset. FriendlyName is a singleton annotation - only one FriendlyName can be added to an asset.  Only the user who created FriendlyName object can edit it. (Admins and Asset owners can delete the FriendlyName object but not edit it). The system maintains users' friendly names separately.|
||friendlyName|string|A friendly name of the asset.|
|FriendlyName ("friendlyName") |||This property contains a friendly name for an asset. FriendlyName is a singleton annotation - only one FriendlyName can be added to an asset.  Only the user who created FriendlyName object can edit it. (Admins and Asset owners can delete the FriendlyName object but not edit it). The system maintains users' friendly names separately.|
||friendlyName|string|A friendly name of the asset.|
|Schema ("schema") |||The Schema describes the structure of the data.  It lists the attribute (column, attribute, field, etc.) names, types as well other metadata.  This information is all derived from the data source.  Schema is a singleton annotation - only one Schema can be added for an asset.|
||columns|Column[]|An array of column objects. They describe the column with information derived from the data source.|
|ColumnDescription ("columnDescriptions") |||This property contains a description for a column.  Each user of the system can add their own descriptions for multiple columns (at most one per column). Only the user who created ColumnDescription objects can edit them.  (Admins and Asset owners can delete the ColumnDescription object but not edit it). The system maintains these user's column descriptions separately.  Thus there's an array of ColumnDescription objects on each asset (one per column for each user who has contributed their knowledge about the column in addition to possibly one that contains information derived from the data source).  The ColumnDescription is loosely bound to the Schema so it can get out of sync. The ColumnDescription might describe a column that no longer exists in the schema.  It's up to the writer to keep description and schema in sync.  The data source may also have columns description information and they're other ColumnDescription objects that would be created when running the tool.|
||columnName|String|The name of the column this description refers to.|
||description|String|A short description (2-3 lines) of the column.|
|ColumnTag ("columnTags") |||This property contains a tag for a column. Each user of the system can add multiple tags for a given column and can add tags for multiple columns. Only the user who created ColumnTag objects can edit them. (Admins and Asset owners can delete the ColumnTag object but not edit it). The system maintains these users' column tags separately.  Thus there's an array of ColumnTag objects on each asset.  The ColumnTag is loosely bound to the schema so it can get out of sync. The ColumnTag might describe a column that no longer exists in the schema.  It's up to the writer to keep column tag and schema in sync.|
||columnName|String|The name of the column this tag refers to.|
||tag|String|A tag describing the column.|
|Expert ("experts") |||This property contains a user who is considered an expert in the data set. The experts’ opinions(descriptions) bubble to the top of the UX when listing descriptions. Each user can specify their own experts. Only that user can edit the experts' object. (Admins and Asset owners can delete the Expert objects but not edit it).|
||expert|SecurityPrincipal||
|Preview ("previews") |||The preview contains a snapshot of the top 20 rows of data for the asset. Preview only make sense for some types of assets (it makes sense for Table but not for Measure).|
||preview|object[]|Array of objects that represent a column.  Each object has a property mapping to a column with a value for that column for the row.|
|AccessInstruction ("accessInstructions") ||||
||mimeType|string|The mime type of the content.|
||content|string|The instructions for how to get access to this data asset. The content could be a URL, an email address, or a set of instructions.|
|TableDataProfile ("tableDataProfiles") ||||
||numberOfRows|int|The number of rows in the data set.|
||size|long|The size in bytes of the data set.|
||schemaModifiedTime|string|The last time the schema was modified.|
||dataModifiedTime|string|The last time the data set was modified (data was added, modified, or delete).|
|ColumnsDataProfile ("columnsDataProfiles") ||||
||columns|ColumnDataProfile[]|An array of column data profiles.|
|ColumnDataClassification ("columnDataClassifications") ||||
||columnName|String|The name of the column this classification refers to.|
||classification|String|The classification of the data in this column.|
|Documentation ("documentation") |||A given asset can have only one documentation associated with it.|
||mimeType|string|The mime type of the content.|
||content|string|The documentation content.|

### Common types

Common types can be used as the types for properties, but aren't Items.

|Common type  |Properties |Data type|Comments|
|----------|-----------|------------|------------|
|DataSourceInfo|sourceType|string|Describes the type of data source.  For example: SQL Server, Oracle Database, etc. |
||objectType|string|Describes the type of object in the data source. For example: Table, View for SQL Server.|
|DataSourceLocation|protocol|string|Required. Describes a protocol used to communicate with the data source. For example: `tds` for SQL Server, `oracle` for Oracle, etc. Refer to [Data source reference specification - DSL Structure](data-catalog-dsr.md#data-source-reference-specification) for the list of currently supported protocols.|
||address|Dictionary\<string,object\>|Required. Address is a set of data specific to the protocol that is used to identify the data source being referenced. The address data scoped to a particular protocol, meaning it's meaningless without knowing the protocol.|
||authentication|string|Optional. The authentication scheme used to communicate with the data source. For example: windows, oauth, etc.|
||connectionProperties|Dictionary\<string,object\>|Optional. Additional information on how to connect to a data source.|
|DataSourceLocation|||The backend doesn't perform any validation of provided properties against Azure Active Directory during publishing.|
||upn|string|Required. Unique email address of user. Must be specified if objectId isn't provided or in the context of "lastRegisteredBy" property, otherwise optional.|
||objectId|Guid|Optional. User or security group Azure Active Directory identity. Optional. Must be specified if upn isn't provided, otherwise optional.|
||firstName|string|First name of user (for display purposes). Optional. Only valid in the context of "lastRegisteredBy" property. Can’t be specified when providing security principal for "roles", "permissions" and "experts".|
||lastName|string|Last name of user (for display purposes). Optional. Only valid in the context of "lastRegisteredBy" property. Can’t be specified when providing security principal for "roles", "permissions" and "experts".|
|Column|name|string|Name of the column or attribute.|
||type|string|Data type of the column or attribute. The Allowable types depend on data sourceType of the asset.  Only a subset of types is supported.|
||maxLength|int|The maximum length allowed for the column or attribute. Derived from data source. Only applicable to some source types.|
||precision|int|The precision for the column or attribute. Derived from data source. Only applicable to some source types.|
||isNullable|isNullable|Whether the column is allowed to have a null value or not. Derived from data source. Only applicable to some source types.|
||expression|string|If the value is a calculated column, this field contains the expression that expresses the value. Derived from data source. Only applicable to some source types.|
|ColumnDataProfile|columnName|string|Name of the column.|
||type|string|The type of the column.|
||min|string|The minimum value in the data set.|
||max|string|The maximum value in the data set.|
||avg|double|The average value in the data set.|
||stdev|double|The standard deviation for the data set|
||nullCount|int|The count of null values in the data set.|
||distinctCount |int|The count of distinct values in the data set.|

## Asset identity

Azure Data Catalog uses "protocol" and identity properties from the "address" property bag of the DataSourceLocation "dsl" property to generate identity of the asset, which is used to address the asset inside the Catalog.
For example, the Tabular Data Stream (TDS) protocol has identity properties "server", "database", "schema", and "object". The combinations of the protocol and the identity properties are used to generate the identity of the SQL Server Table Asset.
Azure Data Catalog provides several built-in data source protocols, which are listed at [Data source reference specification - DSL Structure](data-catalog-dsr.md).
The set of supported protocols can be extended programmatically (Refer to Data Catalog REST API reference). Administrators of the Catalog can register custom data source protocols. The following table describes the properties needed to register a custom protocol.

### Custom data source protocol specification

There are three different types of data source protocol specifications. Listed below are the types, followed by a table of their properties.

#### DataSourceProtocol

|Properties |Data type|Comments|
|-----------|------------|------------|
|namespace|string|The namespace of the protocol. Namespace must be from 1 to 255 characters long, contain one or more non-empty parts separated by dot (.). Each part must be from 1 to 255 characters long, start with a letter and contain only letters and numbers. |
|name|string|The name of the protocol. Name must be from 1 to 255 characters long, start with a letter and contain only letters, numbers, and the dash (-) character.|
|identityProperties|DataSourceProtocolIdentityProperty[]|List of identity properties, must contain at least one, but no more than 20 properties. For example: "server", "database", "schema", "object" are identity properties of the "tds" protocol.|
|identitySets|DataSourceProtocolIdentitySet[]|List of identity sets. Defines sets of identity properties, which represent valid asset's identity. Must contain at least one, but no more than 20 sets. For example: {"server", "database", "schema" and "object"} is an identity set for the TDS protocol, which defines identity of SQL Server Table asset.|

#### DataSourceProtocolIdentityProperty

|Properties |Data type|Comments|
|-----------|------------|------------|
|name|string|The name of the property. Name must be from 1 to 100 characters long, start with a letter and can contain only letters and numbers.|
|type|string|The type of the property. Supported values: "bool", boolean", "byte", "guid", "int", "integer", "long", "string", "url"|
|ignoreCase|bool|Indicates whether case should be ignored when using property's value. Can only be specified for properties with "string" type. Default value is false.|
|urlPathSegmentsIgnoreCase|bool[]|Indicates whether case should be ignored for each segment of the url's path. Can only be specified for properties with "url" type. Default value is [false].|

#### DataSourceProtocolIdentitySet

|Properties |Data type|Comments|
|-----------|------------|------------|
|name|string|The name of the identity set.|
|properties|string[]|The list of identity properties included into this identity set. It can’t contain duplicates. Each property referenced by identity set must be defined in the list of "identityProperties" of the protocol.|

## Roles and authorization

Microsoft Azure Data Catalog provides authorization capabilities for CRUD operations on assets and annotations.

The Azure Data Catalog uses two authorization mechanisms:

* Role-based authorization
* Permission-based authorization

### Roles

There are three roles: **Administrator**, **Owner**, and **Contributor**.  Each role has its scope and rights, which are summarized in the following table.

|Role |Scope |Rights|
|----------|-----------|------------|
|Administrator|Catalog (all assets/annotations in the Catalog)|Read, Delete, ViewRoles, ChangeOwnership, ChangeVisibility, ViewPermissions|
|Owner|Each asset (root item)|Read, Delete, ViewRoles, ChangeOwnership, ChangeVisibility, ViewPermissions|
|Contributor|Each individual asset and annotation|Read*, Update, Delete, ViewRoles|

> [!NOTE]
> *All the rights are revoked if the Read right on the item is revoked from the Contributor

> [!NOTE]
> **Read**, **Update**, **Delete**, **ViewRoles** rights are applicable to any item (asset or annotation) while **TakeOwnership**, **ChangeOwnership**, **ChangeVisibility**, **ViewPermissions** are only applicable to the root asset.
> **Delete** right applies to an item and any subitems or single item underneath it. For example, deleting an asset also deletes any annotations for that asset.

### Permissions

Permission is as list of access control entries. Each access control entry assigns set of rights to a security principal. Permissions can only be specified on an asset (that is, root item) and apply to the asset and any subitems.

During the **Azure Data Catalog** preview, only **Read** right is supported in the permissions list to enable scenario to restrict visibility of an asset.

By default any authenticated user has **Read** right for any item in the catalog unless visibility is restricted to the set of principals in the permissions.

## REST API

**PUT** and **POST** view item requests can be used to control roles and permissions: in addition to item payload, two system properties can be specified **roles** and **permissions**.

> [!NOTE]
> **permissions** only applicable to a root item.
> **Owner** role only applicable to a root item.
> By default when an item is created in the catalog its **Contributor** is set to the currently authenticated user. If item should be updatable by everyone, **Contributor** should be set to &lt;Everyone&gt; special security principal in the **roles** property when item is first published (refer to the following example). **Contributor** cannot be changed and stays the same during life-time of an item (even **Administrator** or **Owner** doesn’t have the right to change the **Contributor**). The only value supported for the explicit setting of the **Contributor** is &lt;Everyone&gt;: **Contributor** can only be a user who created an item or &lt;Everyone&gt;.

### Examples

**Set Contributor to &lt;Everyone&gt; when publishing an item.**
Special security principal &lt;Everyone&gt; has objectId "00000000-0000-0000-0000-000000000201".
  **POST** https:\//api.azuredatacatalog.com/catalogs/default/views/tables/?api-version=2016-03-30

> [!NOTE]
> Some HTTP client implementations may automatically reissue requests in response to a 302 from the server, but typically strip Authorization headers from the request. Since the Authorization header is required to make requests to Azure Data Catalog, you must ensure the Authorization header is still provided when reissuing a request to a redirect location specified by Azure Data Catalog. The following sample code demonstrates it using the .NET HttpWebRequest object.

#### Body

```json
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
```

  **Assign owners and restrict visibility for an existing root item**: **PUT** https:\//api.azuredatacatalog.com/catalogs/default/views/tables/042297b0...1be45ecd462a?api-version=2016-03-30

```json
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
```

> [!NOTE]
> In PUT it’s not required to specify an item payload in the body: PUT can be used to update just roles and/or permissions.

## Next steps

[Azure Data Catalog REST API reference](/rest/api/datacatalog/)
