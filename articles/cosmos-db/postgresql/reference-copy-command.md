---
title: pg_azure_storage extension
description: Reference documentation for using Azure Blob Storage extension
ms.author: avijitgupta
author: AvijitkGupta
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: reference
ms.date: 06/10/2023
---

## COPY FROM

`COPY FROM` copies data from a file, hosted on a file system or within `Azure blob storage`, to an SQL table (appending the data to whatever is in the table already). The command is helpful in dealing with large datasets, significantly reducing the time and resources required for data transfer.

```postgresql
COPY table_name [ ( column_name [, ...] ) ]
FROM { 'filename' | PROGRAM 'command' | STDIN | Azure_blob_url}
    [ [ WITH ] ( option [, ...] ) ]
    [ WHERE condition ]
```

### Arguments
#### Azure_blob_url
Allows unstructured data to be stored and accessed at a massive scale in block blobs. Objects in blob storage can be accessed from anywhere in the world via HTTPS. The storage client libraries are available for multiple languages, including .NET, Java, Node.js, Python, PHP, and Ruby.

### Option
#### format
Specifies the format of destination file. Currently the extension supports following formats

| **Format** | **Description**                                                         |
|------------|-------------------------------------------------------------------------|
| csv        | Comma-separated values format used by PostgreSQL COPY                   |
| tsv        | Tab-separated values, the default PostgreSQL COPY format                |
| binary     | Binary PostgreSQL COPY format                                           |
| text       | A file containing a single text value (for example, large JSON or XML)  |