---
title: sys.external_streaming_jobs (Transact-SQL) - Azure SQL Edge (Preview)
description: Learn about using sys.external_streaming_jobs in Azure SQL Edge (Preview)
keywords: sys.external_streaming_jobs, SQL Edge
services: sql-edge
ms.service: sql-edge
ms.topic: reference
author: SQLSourabh
ms.author: sourabha
ms.reviewer: sstein
ms.date: 05/19/2019
---

# sys.external_streaming_jobs (Transact-SQL)

Returns a row for each external streaming job created within the scope of the database.

|Column name|Data type|Description|  
|-----------------|---------------|-----------------|
|**name**|**sysname**|Name of the stream. Is unique within the database.|
|**object_id**|**int**|object identification number for the stream object. Is unique within the database.|
|**principal_id**|**int**|ID of the principal that owns this assembly|
|**schema_id**|**int**| ID of the schema that contains the object.|
|**parent_object_id**|**id**| object identification number for the parent object for this stream. In the current implementation, this value is always null|
|**type**|**char(2)**|Object type. For stream objects, the type is always 'EJ'|
|**type_desc**|**nvarchar(60)**| Description of the object type. For stream objects, the type is always 'EXTERNAL_STREAMING_JOB'|
|**create_date**|**datetime**| Date the object was created.|
|**modify_date**|**datetime**| In the current implementation, this value is the same as the create_date for the stream object |
|**is_ms_shipped**|**bit**| Object created by an internal component.|  
|**is_published**|**bit**| Object is published.|  
|**is_schema_published**|**bit**|Only the schema of the object is published.|
|**uses_ansi_nulls**|**bit**| Stream object was created with the SET ANSI_NULLS database option ON|
|**statement**|**varchar(max)**| The stream analytics query text for the streaming job. For more information, see [sp_create_streaming_job](overview.md) |
|**status**|**int**| The current status of the streaming job. The possible values are <br /><br /> **Created** = 0. The streaming job was created, but has not yet been started. <br /><br /> **Starting** = 1. The streaming job is in the starting phase. <br /><br /> **Failed** = 6. The streaming job Failed. This is generally an indication of a fatal error during processing. <br /><br /> **Stopped** = 4. The streaming job has been stopped. <br /><br /> **Idle** = 7. The streaming job is running, however there is no input to process. <br /><br /> **Processing** = 8. The streaming job is running, and is processing inputs. This state indicates a healthy state for the streaming job. <br /><br /> **Degraded** = 9. The streaming job is running, however there were some non-fatal input/output serialization/de-serialization errors during input processing. The input job will continue to run, but will drop inputs that encounter errors.|

## Permissions

The visibility of the metadata in catalog views is limited to securables that a user either owns or on which the user has been granted some permission. For more information, see [Metadata Visibility Configuration](/sql/relational-databases/security/metadata-visibility-configuration/).

## See also

- [T-SQL Streaming Catalog Views](overview.md)
- [Catalog Views (Transact-SQL)](/sql/relational-databases/system-catalog-views/catalog-views-transact-sql/)
- [System Views (Transact-SQL)](/sql/t-sql/language-reference/)

