---
title: Data ingestion properties for Azure Synapse Data Explorer (Preview)
description: Learn about the various data ingestion properties supported by Azure Synapse Data Explorer.
ms.topic: conceptual
ms.date: 11/02/2021
author: shsagir
ms.author: shsagir
ms.reviewer: tzgitlin
ms.service: synapse-analytics
ms.subservice: data-explorer
---

# Azure Synapse Data Explorer data ingestion properties (Preview)

Data ingestion is the process by which data is added to a table and is made available for query in Data Explorer. You add properties to the ingestion command after the `with` keyword.

## Ingestion properties

The following table lists the properties supported by Data Explorer, describes them, and provides examples: 

|Property              |Description                                              |Example                                             |
|----------------------|---------------------------------------------------------|----------------------------------------------------|
|`ingestionMapping`    |A string value that indicates how to map data from the source file to the actual columns in the table. Define the `format` value with the relevant mapping type. See [data mappings](/azure/data-explorer/kusto/management/mappings?context=/azure/synapse-analytics/context/context).|`with (format="json", ingestionMapping = "[{\"column\":\"rownumber\", \"Properties\":{\"Path\":\"$.RowNumber\"}}, {\"column\":\"rowguid\", \"Properties\":{\"Path\":\"$.RowGuid\"}}]")`<br>(deprecated: `avroMapping`, `csvMapping`, `jsonMapping`) |
|`ingestionMappingReference`|A string value that indicates how to map data from the source file to the actual columns in the table using a named mapping policy object. Define the `format` value with the relevant mapping type. See [data mappings](/azure/data-explorer/kusto/management/mappings?context=/azure/synapse-analytics/context/context).|`with (format="csv", ingestionMappingReference = "Mapping1")`<br>(deprecated: `avroMappingReference`, `csvMappingReference`, `jsonMappingReference`)|
|`creationTime` |The datetime value (formatted as an ISO8601 string) to use at the creation time of the ingested data extents. If unspecified, the current value (`now()`) will be used. Overriding the default is useful when ingesting older data, so that the retention policy will be applied correctly. When specified, make sure the `Lookback` property in the target table's effective [Extents merge policy](/azure/data-explorer/kusto/management/mergepolicy?context=/azure/synapse-analytics/context/context) is aligned with the specified value.|`with (creationTime="2017-02-13")`|
|`extend_schema`|A Boolean value that, if specified, instructs the command to extend the schema of the table (defaults to `false`). This option applies only to `.append` and `.set-or-append` commands. The only allowed schema extensions have additional columns added to the table at the end.|If the original table schema is `(a:string, b:int)`, a valid schema extension would be `(a:string, b:int, c:datetime, d:string)`, but `(a:string, c:datetime)` wouldn't be valid|
|`folder` |For [ingest-from-query](/azure/data-explorer/kusto/management/data-ingestion/ingest-from-query?context=/azure/synapse-analytics/context/context) commands, the folder to assign to the table. If the table already exists, this property will override the table's folder.|`with (folder="Tables/Temporary")`|
|`format` |The data format (see [supported data formats](data-explorer-ingest-data-supported-formats.md)).|`with (format="csv")`|
|`ingestIfNotExists`|A string value that, if specified, prevents ingestion from succeeding if the table already has data tagged with an `ingest-by:` tag with the same value. This ensures idempotent data ingestion. For more information, see [ingest-by: tags](/azure/data-explorer/kusto/management/extents-overview?context=/azure/synapse-analytics/context/context#ingest-by-extent-tags).|The properties `with (ingestIfNotExists='["Part0001"]', tags='["ingest-by:Part0001"]')` indicate that if data with the tag `ingest-by:Part0001` already exists, then don't complete the current ingestion. If it doesn't already exist, this new ingestion should have this tag set (in case a future ingestion attempts to ingest the same data again.)|
|`ignoreFirstRecord` |A Boolean value that, if set to `true`, indicates that ingestion should ignore the first record of every file. This property is useful for files in `CSV`and similar formats, if the first record in the file are the column names. By default, `false` is assumed.|`with (ignoreFirstRecord=false)`|
|`persistDetails` |A Boolean value that, if specified, indicates that the command should persist the detailed results (even if successful) so that the [.show operation details](/azure/data-explorer/kusto/management/operations?context=/azure/synapse-analytics/context/context#show-operation-details) command could retrieve them. Defaults to `false`.|`with (persistDetails=true)`|
|`policy_ingestiontime`|A Boolean value that, if specified, describes whether to enable the [Ingestion Time Policy](/azure/data-explorer/kusto/management/ingestiontimepolicy?context=/azure/synapse-analytics/context/context) on a table that is created by this command. The default is `true`.|`with (policy_ingestiontime=false)`|
|`recreate_schema` |A Boolean value that, if specified, describes whether the command may recreate the schema of the table. This property applies only to the `.set-or-replace` command. This property takes precedence over the `extend_schema` property if both are set.|`with (recreate_schema=true)`|
|`tags`|A list of [tags](/azure/data-explorer/kusto/management/extents-overview?context=/azure/synapse-analytics/context/context#extent-tagging) to associate with the ingested data, formatted as a JSON string |`with (tags="['Tag1', 'Tag2']")`|
|`validationPolicy`|A JSON string that indicates which validations to run during ingestion. See [Data ingestion](data-explorer-ingest-data-overview.md) for an explanation of the different options.| `with (validationPolicy='{"ValidationOptions":1, "ValidationImplications":1}')` (this is actually the default policy)|
|`zipPattern`|Use this property when ingesting data from storage that has a ZIP archive. This is a string value indicating the regular expression to use when selecting which files in the ZIP archive to ingest.  All other files in the archive will be ignored.|`with (zipPattern="*.csv")`|

## Next steps

- Learn more about [data ingestion](data-explorer-ingest-data-overview.md).
- Learn more about [supported data formats](data-explorer-ingest-data-supported-formats.md).
