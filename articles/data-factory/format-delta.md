---
title: Delta format in Azure Data Factory 
description: Transform and move data from a delta lake using the delta format
author: kromerm
ms.service: data-factory
ms.topic: conceptual
ms.date: 03/26/2020
ms.author: makromer
---

# Delta format in Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article highlights how to copy data to and from a delta lake stored in [Azure Data Lake Store Gen2](connector-azure-data-lake-storage.md) or [Azure Blob Storage](connector-azure-blob-storage.md) using the delta format. This connector is available as an [inline dataset](data-flow-source.md#inline-datasets) in mapping data flows as both a source and a sink.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4ALTs]

## Mapping data flow properties

This connector is available as an [inline dataset](data-flow-source.md#inline-datasets) in mapping data flows as both a source and a sink.

### Source properties

The below table lists the properties supported by a delta source. You can edit these properties in the **Source options** tab.

| Name | Description | Required | Allowed values | Data flow script property |
| ---- | ----------- | -------- | -------------- | ---------------- |
| Format | Format must be `delta` | yes | `delta` | format |
| File system | The container/file system of the delta lake | yes | String | fileSystem |
| Folder path | The direct of the delta lake | yes | String | folderPath |
| Compression type | The compression type of the delta table | no | `bzip2`<br>`gzip`<br>`deflate`<br>`ZipDeflate`<br>`snappy`<br>`lz4` | compressionType |
| Compression level | Choose whether the compression completes as quickly as possible or if the resulting file should be optimally compressed. | required if `compressedType` is specified. | `Optimal` or `Fastest` | compressionLevel |
| Time travel | Choose whether to query an older snapshot of a delta table | no | Query by timestamp: Timestamp <br> Query by version: Integer | timestampAsOf <br> versionAsOf |
| Allow no files found | If true, an error is not thrown if no files are found | no | `true` or `false` | ignoreNoFilesFound |

#### Import schema

Delta is only available as an inline dataset and, by default, doesn't have an associated schema. To get column metadata, click the **Import schema** button in the **Projection** tab. This will allow you to reference the column names and data types specified by the corpus. To import the schema, a [data flow debug session](concepts-data-flow-debug-mode.md) must be active and you must have an existing CDM entity definition file to point to.
 

### Delta source script example

```
source(output(movieId as integer,
            title as string,
            releaseDate as date,
            rated as boolean,
            screenedOn as timestamp,
            ticketPrice as decimal(10,2)
            ),
    store: 'local',
    format: 'delta',
    versionAsOf: 0,
    allowSchemaDrift: false,
    folderPath: $tempPath + '/delta'
  ) ~> movies
```

### Sink properties

The below table lists the properties supported by a delta sink. You can edit these properties in the **Settings** tab.

| Name | Description | Required | Allowed values | Data flow script property |
| ---- | ----------- | -------- | -------------- | ---------------- |
| Format | Format must be `delta` | yes | `delta` | format |
| File system | The container/file system of the delta lake | yes | String | fileSystem |
| Folder path | The direct of the delta lake | yes | String | folderPath |
| Compression type | The compression type of the delta table | no | `bzip2`<br>`gzip`<br>`deflate`<br>`ZipDeflate`<br>`snappy`<br>`lz4` | compressionType |
| Compression level | Choose whether the compression completes as quickly as possible or if the resulting file should be optimally compressed. | required if `compressedType` is specified. | `Optimal` or `Fastest` | compressionLevel |
| Vacuum | Specify retention threshold in hours for older versions of table. A value of 0 or less defaults to 30 days | yes | Integer | vacuum |
| Update method | Specify which update operations are allowed on the delta lake. For methods that aren't insert, a preceding alter row transformation is required to mark rows. | yes | `true` or `false` | deletable <br> insertable <br> updateable <br> merge |
| Optimized Write | Achieve higher throughput for write operation via optimizing internal shuffle in Spark executors. As a result, you may notice fewer partitions and files that are of a larger size | no | `true` or `false` | optimizedWrite: true |
| Auto Compact | After any write operation has completed, Spark will automatically execute the ```OPTIMIZE``` command to re-organize the data, resulting in more partitions if necessary, for better reading performance in the future | no | `true` or `false` |    autoCompact: true |

### Delta sink script example

The associated data flow script is:

```
moviesAltered sink(
          input(movieId as integer,
                title as string
            ),
           mapColumn(
                movieId,
                title
            ),
           insertable: true,
           updateable: true,
           deletable: true,
           upsertable: false,
           keys: ['movieId'],
            store: 'local',
           format: 'delta',
           vacuum: 180,
           folderPath: $tempPath + '/delta'
           ) ~> movieDB
```

### Known limitations

When writing to a delta sink, there is a known limitation where the numbers of rows written won't be return in the monitoring output.

## Next steps

* Create a [source transformation](data-flow-source.md) in mapping data flow.
* Create a [sink transformation](data-flow-sink.md) in mapping data flow.
* Create an [alter row transformation](data-flow-alter-row.md) to mark rows as insert, update, upsert, or delete.
