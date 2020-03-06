---
title: Copy activity performance optimization features
description: Learn about the key features that helps you optimize the copy activity performance in Azure Data Factory。
services: data-factory
documentationcenter: ''
ms.author: jingwang
author: linda33wj
manager: shwang
ms.reviewer: douglasl
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 03/05/2020
---

# Copy activity performance optimization features

Azure Data Factory provides the following performance optimization features:

- [Data Integration Units](#data-integration-units)
- [Parallel copy](#parallel-copy)
- [Staged copy](#staged-copy)
- [Self-hosted integration runtime scalability](create-self-hosted-integration-runtime.md#high-availability-and-scalability)

## Data Integration Units

A Data Integration Unit is a measure that represents the power (a combination of CPU, memory, and network resource allocation) of a single unit in Azure Data Factory. Data Integration Unit only applies to [Azure integration runtime](concepts-integration-runtime.md#azure-integration-runtime), but not [self-hosted integration runtime](concepts-integration-runtime.md#self-hosted-integration-runtime).

The allowed DIUs to empower a copy activity run is **between 2 and 256**. If not specified or you choose “Auto” on the UI, Data Factory dynamically apply the optimal DIU setting based on your source-sink pair and data pattern. The following table lists the default DIUs and max supported DIUs in different copy scenarios:

| Copy scenario | Default DIUs determined by service | Max supported DIUs |
|:--- |:--- |---- |
| Copy data between file-based stores | Between 4 and 32 depending on the number and size of the files. | 256<br>Per file either on source or sink can use up to 4 DIUs. |
| Copy data from partition-option-enabled cloud relational data store (including [Oracle](connector-oracle.md#oracle-as-source)/[Netezza](connector-netezza.md#netezza-as-source)/[Teradata](connector-teradata.md#teradata-as-source)) to any other cloud data stores | 4 | 256<br/>Per source data partition can use up to 4 DIUs.<br>For file-based sink, DIUs beyond 4 applies when writing to a folder instead of one single file. |
| Copy data to Azure SQL Database or Azure Cosmos DB |Between 4 and 16 depending on the sink Azure SQL Database's or Cosmos DB's tier (number of DTUs/RUs) and source data pattern. |256<br>Per source file or database partition can use up to 4 DIUs. |
| All the other copy scenarios | 4 | 4 |

You can see the DIUs used for each copy run in the copy activity monitoring view or activity output. For more information, see [Copy activity monitoring](copy-activity-monitoring.md). To override this default, specify a value for the `dataIntegrationUnits` property as follows. The *actual number of DIUs* that the copy operation uses at run time is equal to or less than the configured value, depending on your data pattern.

You will be charged **# of used DIUs \* copy duration \* unit price/DIU-hour**. See the current prices [here](https://azure.microsoft.com/pricing/details/data-factory/data-pipeline/). Local currency and separate discounting may apply per subscription type.

**Example:**

```json
"activities":[
    {
        "name": "Sample copy activity",
        "type": "Copy",
        "inputs": [...],
        "outputs": [...],
        "typeProperties": {
            "source": {
                "type": "BlobSource",
            },
            "sink": {
                "type": "AzureDataLakeStoreSink"
            },
            "dataIntegrationUnits": 128
        }
    }
]
```

## Parallel copy

You can set parallel copy (`parallelCopies` property) on copy activity to indicate the parallelism that you want the copy activity to use. You can think of this property as the maximum number of threads within the copy activity that can read from your source or write to your sink data stores in parallel.

The paralle copy is orthogonal to Data Integration Units or Self-hosted IR nodes. The former is counted across all the DIUs or Self-hosted IR nodes.

For each copy activity run, by default Azure Data Factory dynamically apply the optimal parallel copy setting based on your source-sink pair and data pattern. The following table lists the default number of parallel copies:

> [!TIP]
> When you copy data between file-based stores, the default behavior which is auto-determined based on your source file pattern usually gives you the best throughput.

| Copy scenario | Default parallel copy count determined by service |
| --- | --- |
| Copy data from file-based stores |Depends on the size of the files and the number of DIUs used to copy data between two cloud data stores, or the self-hosted integration runtime's CPU/memory and node count.<br/><br>`parallelCopies` determines the parallelism **at the file level**. The chunking within each file happens underneath automatically and transparently. It's designed to use the best suitable chunk size for a given data store type to load data in parallel. <br/><br>The actual number of parallel copies copy activity uses at run time is no more than the number of files you have. If the copy behavior is **mergeFile** into file sink, the copy activity can't take advantage of file-level parallelism. |
| Copy from relational data store with partition option enabled (including [Oracle](connector-oracle.md#oracle-as-source), [Netezza](connector-netezza.md#netezza-as-source), [Teradata](connector-teradata.md#teradata-as-source), [SAP HANA](connector-sap-hana.md#sap-hana-as-source), [SAP Table](connector-sap-table.md#sap-table-as-source), and [SAP Open Hub](connector-sap-business-warehouse-open-hub.md#sap-bw-open-hub-as-source)) |4<br><br>Applies when the data partition option is enabled. The actual number of parallel copies copy activity uses at run time is no more than the number of data partitions you have.<br><br>When use Self-hosted Integration Runtime and copy to Azure Blob/ADLS Gen2, note the max effective parallel copy is 4 or 5 per IR node. |
| Copy data to Azure SQL Database or Azure Cosmos DB |Between 1 and 4 depending on the sink Azure SQL Database's or Cosmos DB's tier (number of DTUs/RUs) |
| Copy data from any source store to Azure Table storage |4 |
| All other copy scenarios |1 |

To control the load on machines that host your data stores, or to tune copy performance, you can override the default value and specify a value for the `parallelCopies` property. The value must be an integer greater than or equal to 1. At run time, for the best performance, the copy activity uses a value that is less than or equal to the value that you set.

When you specify a value for the `parallelCopies` property, take the load increase on your source and sink data stores into account. Also consider the load increase to the self-hosted integration runtime if the copy activity is empowered by it. This load increase happens especially when you have multiple activities or concurrent runs of the same activities that run against the same data store. If you notice that either the data store or the self-hosted integration runtime is overwhelmed with the load, decrease the `parallelCopies` value to relieve the load.

**Example:**

```json
"activities":[
    {
        "name": "Sample copy activity",
        "type": "Copy",
        "inputs": [...],
        "outputs": [...],
        "typeProperties": {
            "source": {
                "type": "BlobSource",
            },
            "sink": {
                "type": "AzureDataLakeStoreSink"
            },
            "parallelCopies": 32
        }
    }
]
```

## Staged copy

When you copy data from a source data store to a sink data store, you might choose to use Blob storage as an interim staging store. Staging is especially useful in the following cases:

- **You want to ingest data from various data stores into SQL Data Warehouse via PolyBase.** SQL Data Warehouse uses PolyBase as a high-throughput mechanism to load a large amount of data into SQL Data Warehouse. The source data must be in Blob storage or Azure Data Lake Store, and it must meet additional criteria. When you load data from a data store other than Blob storage or Azure Data Lake Store, you can activate data copying via interim staging Blob storage. In that case, Azure Data Factory performs the required data transformations to ensure that it meets the requirements of PolyBase. Then it uses PolyBase to load data into SQL Data Warehouse efficiently. For more information, see [Use PolyBase to load data into Azure SQL Data Warehouse](connector-azure-sql-data-warehouse.md#use-polybase-to-load-data-into-azure-sql-data-warehouse).
- **Sometimes it takes a while to perform a hybrid data movement (that is, to copy from an on-premises data store to a cloud data store) over a slow network connection.** To improve performance, you can use staged copy to compress the data on-premises so that it takes less time to move data to the staging data store in the cloud. Then you can decompress the data in the staging store before you load into the destination data store.
- **You don't want to open ports other than port 80 and port 443 in your firewall because of corporate IT policies.** For example, when you copy data from an on-premises data store to an Azure SQL Database sink or an Azure SQL Data Warehouse sink, you need to activate outbound TCP communication on port 1433 for both the Windows firewall and your corporate firewall. In this scenario, staged copy can take advantage of the self-hosted integration runtime to first copy data to a Blob storage staging instance over HTTP or HTTPS on port 443. Then it can load the data into SQL Database or SQL Data Warehouse from Blob storage staging. In this flow, you don't need to enable port 1433.

### How staged copy works

When you activate the staging feature, first the data is copied from the source data store to the staging Blob storage (bring your own). Next, the data is copied from the staging data store to the sink data store. Azure Data Factory automatically manages the two-stage flow for you. Azure Data Factory also cleans up temporary data from the staging storage after the data movement is complete.

![Staged copy](media/copy-activity-performance/staged-copy.png)

When you activate data movement by using a staging store, you can specify whether you want the data to be compressed before you move data from the source data store to an interim or staging data store and then decompressed before you move data from an interim or staging data store to the sink data store.

Currently, you can't copy data between two data stores that are connected via different Self-hosted IRs, neither with nor without staged copy. For such scenario, you can configure two explicitly chained copy activity to copy from source to staging then from staging to sink.

### Configuration

Configure the **enableStaging** setting in the copy activity to specify whether you want the data to be staged in Blob storage before you load it into a destination data store. When you set **enableStaging** to `TRUE`, specify the additional properties listed in the following table. You also need to create an Azure Storage or Storage shared access signature-linked service for staging if you don’t have one.

| Property | Description | Default value | Required |
| --- | --- | --- | --- |
| enableStaging |Specify whether you want to copy data via an interim staging store. |False |No |
| linkedServiceName |Specify the name of an [AzureStorage](connector-azure-blob-storage.md#linked-service-properties) linked service, which refers to the instance of Storage that you use as an interim staging store. <br/><br/> You can't use Storage with a shared access signature to load data into SQL Data Warehouse via PolyBase. You can use it in all other scenarios. |N/A |Yes, when **enableStaging** is set to TRUE |
| path |Specify the Blob storage path that you want to contain the staged data. If you don't provide a path, the service creates a container to store temporary data. <br/><br/> Specify a path only if you use Storage with a shared access signature, or you require temporary data to be in a specific location. |N/A |No |
| enableCompression |Specifies whether data should be compressed before it's copied to the destination. This setting reduces the volume of data being transferred. |False |No |

>[!NOTE]
> If you use staged copy with compression enabled, the service principal or MSI authentication for staging blob linked service isn't supported.

Here's a sample definition of a copy activity with the properties that are described in the preceding table:

```json
"activities":[
    {
        "name": "Sample copy activity",
        "type": "Copy",
        "inputs": [...],
        "outputs": [...],
        "typeProperties": {
            "source": {
                "type": "SqlSource",
            },
            "sink": {
                "type": "SqlSink"
            },
            "enableStaging": true,
            "stagingSettings": {
                "linkedServiceName": {
                    "referenceName": "MyStagingBlob",
                    "type": "LinkedServiceReference"
                },
                "path": "stagingcontainer/path",
                "enableCompression": true
            }
        }
    }
]
```

### Staged copy billing impact

You're charged based on two steps: copy duration and copy type.

* When you use staging during a cloud copy, which is copying data from a cloud data store to another cloud data store, both stages empowered by Azure integration runtime, you're charged the [sum of copy duration for step 1 and step 2] x [cloud copy unit price].
* When you use staging during a hybrid copy, which is copying data from an on-premises data store to a cloud data store, one stage empowered by a self-hosted integration runtime, you're charged for [hybrid copy duration] x [hybrid copy unit price] + [cloud copy duration] x [cloud copy unit price].

## Next steps
See the other copy activity articles:

- [Copy activity overview](copy-activity-overview.md)
- [Copy activity performance and scalability guide](copy-activity-performance.md)
- [Troubleshoot copy activity performance](copy-activity-performance-troubleshooting.md)
- [Use Azure Data Factory to migrate data from your data lake or data warehouse to Azure](data-migration-guidance-overview.md)
- [Migrate data from Amazon S3 to Azure Storage](data-migration-guidance-s3-azure-storage.md)