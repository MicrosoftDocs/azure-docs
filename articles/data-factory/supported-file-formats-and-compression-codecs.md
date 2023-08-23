---
title: Supported file formats by copy activity in Azure Data Factory
titleSuffix: Azure Data Factory & Azure Synapse
description: This topic describes the file formats and compression codes that are supported by copy activity in Azure Data Factory and Azure Synapse Analytics.
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 08/10/2023
ms.author: jianleishen
---

# Supported file formats and compression codecs by copy activity in Azure Data Factory and Azure Synapse pipelines
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

*This article applies to the following connectors: [Amazon S3](connector-amazon-simple-storage-service.md), [Amazon S3 Compatible Storage](connector-amazon-s3-compatible-storage.md), [Azure Blob](connector-azure-blob-storage.md), [Azure Data Lake Storage Gen1](connector-azure-data-lake-store.md), [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md), [Azure Files](connector-azure-file-storage.md), [File System](connector-file-system.md), [FTP](connector-ftp.md), [Google Cloud Storage](connector-google-cloud-storage.md), [HDFS](connector-hdfs.md), [HTTP](connector-http.md), [Oracle Cloud Storage](connector-oracle-cloud-storage.md) and [SFTP](connector-sftp.md).*

[!INCLUDE [data-factory-v2-file-formats](includes/data-factory-v2-file-formats.md)] 

You can use the [Copy activity](copy-activity-overview.md) to copy files as-is between two file-based data stores, in which case the data is copied efficiently without any serialization or deserialization. 

In addition, you can also parse or generate files of a given format. For example, you can perform the following:

* Copy data from a SQL Server database and write to Azure Data Lake Storage Gen2 in Parquet format.
* Copy files in text (CSV) format from an on-premises file system and write to Azure Blob storage in Avro format.
* Copy zipped files from an on-premises file system, decompress them on-the-fly, and write extracted files to Azure Data Lake Storage Gen2.
* Copy data in Gzip compressed-text (CSV) format from Azure Blob storage and write it to Azure SQL Database.
* Many more activities that require serialization/deserialization or compression/decompression.

## Next steps

See the other Copy Activity articles:

- [Copy activity overview](copy-activity-overview.md)
- [Copy activity performance](copy-activity-performance.md)
