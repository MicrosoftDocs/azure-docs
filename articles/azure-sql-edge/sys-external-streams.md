---
title: sys.external_streams (Transact-SQL) - Azure SQL Edge
description: sys.external_streams returns a row for each external stream object created within the scope of the database.
author: rwestMSFT
ms.author: randolphwest
ms.date: 09/14/2023
ms.service: sql-edge
ms.topic: reference
keywords:
  - sys.external_streams
  - SQL Edge
---
# sys.external_streams (Transact-SQL)

> [!IMPORTANT]  
> Azure SQL Edge no longer supports the ARM64 platform.

Returns a row for each external stream object created within the scope of the database.

| Column name | Data type | Description |
| --- | --- | --- |
| **name** | **sysname** | Name of the stream. Is unique within the database. |
| **object_id** | **int** | object identification number for the stream object. Is unique within the database. |
| **principal_id** | **int** | ID of the principal that owns this assembly. |
| **schema_id** | **int** | ID of the schema that contains the object. |
| **parent_object_id** | **id** | object identification number for the parent object for this stream. In the current implementation, this value is always null. |
| **type** | **char(2)** | Object type. For stream objects, the type is always 'ES'. |
| **type_desc** | **nvarchar(60)** | Description of the object type. For stream objects, the type is always 'EXTERNAL_STREAM'. |
| **create_date** | **datetime** | Date the object was created. |
| **modify_date** | **datetime** | Date the object was last modified by using an ALTER statement. |
| **is_ms_shipped** | **bit** | Object created by an internal component. |
| **is_published** | **bit** | Object is published. |
| **is_schema_published** | **bit** | Only the schema of the object is published. |
| **max_column_id_used** | **bit** | This column is used for internal purposes and will be removed in future. |
| **uses_ansi_nulls** | **bit** | Stream object was created with the SET ANSI_NULLS database option ON. |
| **data_source_id** | **int** | The object ID for the external data source represented by the stream object. |
| **file_format_id** | **int** | The object ID for the external file format used by the stream object. The external file format is required to specify the actual layout of the data referenced by an external stream. |
| **location** | **varchar(max)** | The target for the external stream object. For more information, see [Create External Stream](overview.md). |
| **input_option** | **varchar(max)** | The input options used during the creation of the external stream. For more information, see [Create External Stream](overview.md). |
| **output_option** | **varchar(max)** | The output options used during the creation of the external stream. For more information, see [Create External Stream](overview.md). |

## Permissions

The visibility of the metadata in catalog views is limited to securables that a user either owns, or on which the user has been granted some permission. For more information, see [Metadata Visibility Configuration](/sql/relational-databases/security/metadata-visibility-configuration/).

## See also

- [Catalog Views (Transact-SQL)](/sql/relational-databases/system-catalog-views/catalog-views-transact-sql/)
- [System Views (Transact-SQL)](/sql/t-sql/language-reference/)
