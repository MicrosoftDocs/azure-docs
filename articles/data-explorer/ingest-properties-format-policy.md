---
title: Ingest json formatted data into Azure Data Explorer
description: Learn about how to ingest json formatted data into Azure Data Explorer.
author: orspod
ms.author: orspodek
ms.reviewer: tzviagt
ms.service: data-explorer
ms.topic: conceptual
ms.date: 01/13/2020
---

# Ingestion supported formats and properties

## Ingestion properties

Ingestion commands may zero on more ingestion properties through the
use of the `with` keyword. The supported properties are:  

* `avroMapping`, `csvMapping`, `jsonMapping`: A string value that indicates
  how to map data from the source file to the actual columns in the table.
  See [data mappings](../mappings.md).

* `avroMappingReference`, `csvMappingReference`, `jsonMappingReference`:
  A string value that indicates how to map data from the source file to the
  actual columns in the table using a named mapping policy object.
  See [data mappings](../mappings.md).

* `creationTime`: The datetime value (formatted as a ISO8601 string) to use
  as the creation time of the ingested data extents. If unspecified, the current
  value (`now()`) will be used. Overriding the default is useful when ingesting
  older data, so that retention policy will be applied correctly.
  For example: `with (creationTime="2017-02-13T11:09:36.7992775Z")`.

* `extend_schema`: A Boolean value that, if specified, instructs the command
  to extend the schema of the table (defaults to `false`). This option applies only
  to `.append` and `.set-or-append` commands. Note that the only allowed schema extensions
  have additional columns added to the table at the end.<br>
  For example, if the original table schema is `(a:string, b:int)` then a
  valid schema extension would be `(a:string, b:int, c:datetime, d:string)`,
  but `(a:string, c:datetime)` would not.

* `folder`: For [ingest-from-query](./ingest-from-query.md) commands,
  the folder to assign to the table (if the table already exist this will
  override the table's folder).
  For example: `with (folder="Tables/Temporary")`.

* `format`: The data format (see below for supported values and their meaning).
  For example: `with (format="csv")`.

* `ingestIfNotExists`: A string value that, if specified, prevents ingestion
  from succeeding if the table already has data tagged with an `ingest-by:` tag
  with the same value. This ensure idempotent data ingestion.
  For more information see [ingest-by: tags](../extents-overview.md#ingest-by-extent-tags).
  For example, the properties `with (ingestIfNotExists='["Part0001"]', tags='["ingest-by:Part0001"]')`
  indicate that if data with the tag `ingest-by:Part0001` already exists, then
  we should not complete the current ingestion. If it doesn't already exist,
  then this new ingestion should have this tag set (in case a future ingestion
  attempts to ingest the same data again in the future.)

* `ignoreFirstRecord`: A Boolean value that, if set to `true`, indicates that
  ingestion should ignore the first record of every file. This is useful for
  files formatted in `csv` (and similar formats) if the first record in the file
  is a header record specifying the column names. By default `false` is assumed.
  For example: `with (ignoreFirstRecord=false)`.

* `persistDetails`: A Boolean value that, if specified, indicates that the command
  should persist the detailed results (even if successful) so that the
  [.show operation details](../operations.md#show-operation-details) command could retrieve them.
  Defaults to `false`.
  For example: `with (persistDetails=true)`.

* `policy_ingestiontime`: A Boolean value that, if specified, describes whether
  to enable the [Ingestion Time Policy](../../concepts/ingestiontimepolicy.md)
  on a table that is created by this command. (The default is `true`.)
  For example: `with (policy_ingestiontime=false)`.

* `recreate_schema`: A Boolean value that, if specified, describes whether the
  command may recreate the schema of the table. This option applies only
  to the `.set-or-replace` command. This takes precedence over the `extend_schema`
  option if both are set.
  For example, `with (recreate_schema=true)`.

* `tags`: A list of [tags](../extents-overview.md#extent-tagging) to associate
  with the ingested data, formatted as a JSON string.
  For example: `with (tags="['Tag1', 'Tag2']")`.

* `validationPolicy`: A JSON string that indicates what validations to run
  during ingestion. See below for an explanation of the different options.
  For example: `with (validationPolicy='{"ValidationOptions":1, "ValidationImplications":1}')`
  (this is actually the default policy).

* `zipPattern`: When ingesting data from storage that has a ZIP archive,
  a string value indicating the regular expression to use when selecting which
  files in the ZIP archive to ingest. All other files in the archive will be
  ignored.
  For example: `with (zipPattern="*.csv")`.

## Supported data formats

For all ingestion methods other than ingest-from-query, the data must be
formatted in one of the supported data formats:

|Format   |Extension   |Description|
|---------|------------|-----------|
|avro     |`.avro`     |An [Avro container file](https://avro.apache.org/docs/current/). The following codes are supported: `null`, `deflate` (`snappy` is currently not supported).|
|csv      |`.csv`      |A text file with comma-separated values (`,`). See [RFC 4180: _Common Format and MIME Type for Comma-Separated Values (CSV) Files_](https://www.ietf.org/rfc/rfc4180.txt).|
|json     |`.json`     |A text file with JSON objects delimited by `\n` or `\r\n`. See [JSON Lines (JSONL)](http://jsonlines.org/).|
|multijson|`.multijson`|A text file with a JSON array of property bags (each representing a record), or any number of property bags delimited by whitespace, `\n` or `\r\n`. Each property bag can be spread on multiple lines. (This format is preferred over `json`, unless the data is non-property bags.)|
|parquet  |`.parquet`  |A [Parquet file](https://en.wikipedia.org/wiki/Apache_Parquet).|
|psv      |`.psv`      |A text file with pipe-separated values (<code>&#124;</code>).|
|raw      |`.raw`      |A text file whose entire contents is a single string value.|
|scsv     |`.scsv`     |A text file with semicolon-separated values (`;`).|
|sohsv    |`.sohsv`    |A text file with SOH-separated values. (SOH is ASCII codepoint 1; this format is used by Hive on HDInsight.)|
|tsv      |`.tsv`      |A text file with tab-separated values (`\t`).|
|tsve     |`.tsv`      |A text file with tab-separated values (`\t`). A backslash character (`\`) is used for escaping.|
|txt      |`.txt`      |A text file with lines delimited by `\n`. Empty lines are skipped.|

<#ifdef MICROSOFT>
There are also additional Microsoft-only internal formats, available for Microsoft internal use:

|Format   |Extension   |Description|
|---------|------------|-----------|
|sstream  |`.ss`       |[Microsoft Cosmos structured streams](https://aka.ms/cosmos).|
<#endif>

### Compression

Blobs and files can be optionally compressed through any of the following
compression algorithms:

|Compression|Extension|
|-----------|---------|
|GZip       |.gz      |
|Zip        |.zip     |

The name of the blob or file should indicate compression by appending the extension
noted above to the name of the blob or file. Thus, `MyData.csv.zip` indicates
a blob or a file whose format is CSV and that has been compressed via Zip
(either as an archive or as a single file), and `MyData.csv.gz` indicates
a blob or a file whose format is CSV and that has been compressed via GZip.

Blob or file names that do not include the format extension but just compression
(for example, `MyData.zip`) are also supported, but in this case the file format
must be specified as an ingestion property as it cannot be inferred.

> [!NOTE]
> Some compression formats keep track of the original file extension as part
> of the compressed stream. This extension is generally ignored for the purpose
> of determining the file format. If this can't be determined from the (compressed)
> blob or file name, it must be specified through the `format` ingestion property.

## Validation policy during ingestion

When ingesting from storage, the source data gets validated as part of parsing.
The validation policy indicates how to react to parsing failures. It consists
of two properties:

* `ValidationOptions`: Here, `0` means that no validation should be performed,
  `1` validates that all records have the same number of fields (useful for
  CSV files and similar), and `2` indicates to ignore fields that are not
  double-quoted.

* `ValidationImplications`: `0` indicates that validation failures should fail
  the whole ingestion,
  and `1` indicates that validation failures should be ignored.