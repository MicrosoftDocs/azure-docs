---
title: Data formats supported by Azure Data Explorer for ingestion.
description: Learn about the various data and compression formats supported by Azure Data Explorer for ingestion.
author: orspod
ms.author: orspodek
ms.reviewer: tzgitlin
ms.service: data-explorer
ms.topic: conceptual
ms.date: 03/19/2020
---

# Data formats supported by Azure Data Explorer for ingestion

Data ingestion is the process by which data is added to a table and is made available for query in Azure Data Explorer. For all ingestion methods, other than ingest-from-query, the data must be in one of the supported formats. The following table lists and describes the formats that Azure Data Explorer supports for data ingestion.

|Format   |Extension   |Description|
|---------|------------|-----------|
|Avro     |`.avro`     |An [Avro container file](https://avro.apache.org/docs/current/). The following codes are supported: `null`, `deflate` (`snappy` is currently not supported).|
|CSV      |`.csv`      |A text file with comma-separated values (`,`). See [RFC 4180: _Common Format and MIME Type for Comma-Separated Values (CSV) Files_](https://www.ietf.org/rfc/rfc4180.txt).|
|JSON     |`.json`     |A text file with JSON objects delimited by `\n` or `\r\n`. See [JSON Lines (JSONL)](http://jsonlines.org/).|
|MultiJSON|`.multijson`|A text file with a JSON array of property bags (each representing a record), or any number of property bags delimited by whitespace, `\n` or `\r\n`. Each property bag can be spread on multiple lines. This format is preferred over `JSON`, unless the data is non-property bags.|
|ORC      |`.orc`      |An [Orc file](https://en.wikipedia.org/wiki/Apache_ORC).|
|Parquet  |`.parquet`  |A [Parquet file](https://en.wikipedia.org/wiki/Apache_Parquet).|
|PSV      |`.psv`      |A text file with pipe-separated values (<code>&#124;</code>).|
|RAW      |`.raw`      |A text file whose entire contents is a single string value.|
|SCsv     |`.scsv`     |A text file with semicolon-separated values (`;`).|
|SOHsv    |`.sohsv`    |A text file with SOH-separated values. (SOH is ASCII codepoint 1; this format is used by Hive on HDInsight.)|
|TSV      |`.tsv`      |A text file with tab-separated values (`\t`).|
|TSVE     |`.tsv`      |A text file with tab-separated values (`\t`). A backslash character (`\`) is used for escaping.|
|TXT      |`.txt`      |A text file with lines delimited by `\n`. Empty lines are skipped.|

## Supported data compression formats

Blobs and files can be compressed through any of the following compression algorithms:

|Compression|Extension|
|-----------|---------|
|GZip       |.gz      |
|Zip        |.zip     |

Indicate compression by appending the extension to the name of the blob or file.

For example:
* `MyData.csv.zip` indicates a blob or a file formatted as CSV, compressed with ZIP (archive or a single file)
* `MyData.csv.gz` indicates a blob or a file formatted as CSV, compressed with GZip

Blob or file names that don't include the format extensions but just compression (for example, ) is also supported. In this case, the file format
must be specified as an ingestion property because it cannot be inferred.

> [!NOTE]
> Some compression formats keep track of the original file extension as part
> of the compressed stream. This extension is generally ignored for
> determining the file format. If the file format can't be determined from the (compressed)
> blob or file name, it must be specified through the `format` ingestion property.

## Next steps

* Learn more about [data ingestion](/azure/data-explorer/ingest-data-overview)
* Learn more about [Azure Data Explorer data ingestion properties](ingestion-properties.md)
