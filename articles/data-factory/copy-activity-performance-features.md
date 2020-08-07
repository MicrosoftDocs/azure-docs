---
title: Copy activity performance optimization features
description: Learn about the key features that help you optimize the copy activity performance in Azure Data Factory。
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
ms.date: 06/15/2020
---

# Copy activity performance optimization features

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines the copy activity performance optimization features that you can leverage in Azure Data Factory.

## Data Integration Units

A Data Integration Unit is a measure that represents the power (a combination of CPU, memory, and network resource allocation) of a single unit in Azure Data Factory. Data Integration Unit only applies to [Azure integration runtime](concepts-integration-runtime.md#azure-integration-runtime), but not [self-hosted integration runtime](concepts-integration-runtime.md#self-hosted-integration-runtime).

The allowed DIUs to empower a copy activity run is **between 2 and 256**. If not specified or you choose "Auto" on the UI, Data Factory dynamically applies the optimal DIU setting based on your source-sink pair and data pattern. The following table lists the supported DIU ranges and default behavior in different copy scenarios:

| Copy scenario | Supported DIU range | Default DIUs determined by service |
|:--- |:--- |---- |
| Between file stores |- **Copy from or to single file**: 2-4 <br>- **Copy from and to multiple files**: 2-256 depending on the number and size of the files <br><br>For example, if you copy data from a folder with 4 large files and choose to preserve hierarchy, the max effective DIU is 16; when you choose to merge file, the max effective DIU is 4. |Between 4 and 32 depending on the number and size of the files |
| From file store to non-file store |- **Copy from single file**: 2-4 <br/>- **Copy from multiple files**: 2-256 depending on the number and size of the files <br/><br/>For example, if you copy data from a folder with 4 large files, the max effective DIU is 16. |- **Copy into Azure SQL Database or Azure Cosmos DB**: between 4 and 16 depending on the sink tier (DTUs/RUs) and source file pattern<br>- **Copy into Azure Synapse Analytics** using PolyBase or COPY statement: 2<br>- Other scenario: 4 |
| From non-file store to file store |- **Copy from partition-option-enabled data stores** (including [Oracle](connector-oracle.md#oracle-as-source)/[Netezza](connector-netezza.md#netezza-as-source)/[Teradata](connector-teradata.md#teradata-as-source)): 2-256 when writing to a folder, and 2-4 when writing to one single file. Note per source data partition can use up to 4 DIUs.<br>- **Other scenarios**: 2-4 |- **Copy from REST or HTTP**: 1<br/>- **Copy from Amazon Redshift** using UNLOAD: 2<br>- **Other scenario**: 4 |
| Between non-file stores |- **Copy from partition-option-enabled data stores** (including [Oracle](connector-oracle.md#oracle-as-source)/[Netezza](connector-netezza.md#netezza-as-source)/[Teradata](connector-teradata.md#teradata-as-source)): 2-256 when writing to a folder, and 2-4 when writing to one single file. Note per source data partition can use up to 4 DIUs.<br/>- **Other scenarios**: 2-4 |- **Copy from REST or HTTP**: 1<br>- **Other scenario**: 4 |

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

## Self-hosted integration runtime scalability

If you would like to achieve higher throughput, you can either scale up or scale out the Self-hosted IR:

- If the CPU and available memory on the Self-hosted IR node are not fully utilized, but the execution of concurrent jobs is reaching the limit, you should scale up by increasing the number of concurrent jobs that can run on a node.  See [here](create-self-hosted-integration-runtime.md#scale-up) for instructions.
- If on the other hand, the CPU is high on the Self-hosted IR node or available memory is low, you can add a new node to help scale out the load across the multiple nodes.  See [here](create-self-hosted-integration-runtime.md#high-availability-and-scalability) for instructions.

Note in the following scenarios, single copy activity execution can leverage multiple Self-hosted IR nodes:

- Copy data from file-based stores, depending on the number and size of the files.
- Copy data from partition-option-enabled data store (including [Oracle](connector-oracle.md#oracle-as-source), [Netezza](connector-netezza.md#netezza-as-source), [Teradata](connector-teradata.md#teradata-as-source), [SAP HANA](connector-sap-hana.md#sap-hana-as-source), [SAP Table](connector-sap-table.md#sap-table-as-source), and [SAP Open Hub](connector-sap-business-warehouse-open-hub.md#sap-bw-open-hub-as-source)), depending on the number of data partitions.

## Parallel copy

You can set parallel copy (`parallelCopies` property) on copy activity to indicate the parallelism that you want the copy activity to use. You can think of this property as the maximum number of threads within the copy activity that read from your source or write to your sink data stores in parallel.

The parallel copy is orthogonal to [Data Integration Units](#data-integration-units) or [Self-hosted IR nodes](#self-hosted-integration-runtime-scalability). It is counted across all the DIUs or Self-hosted IR nodes.

For each copy activity run, by default Azure Data Factory dynamically applies the optimal parallel copy setting based on your source-sink pair and data pattern. 

> [!TIP]
> The default behavior of parallel copy usually gives you the best throughput, which is auto-determined by ADF based on your source-sink pair, data pattern and number of DIUs or the Self-hosted IR's CPU/memory/node count. Refer to [Troubleshoot copy activity performance](copy-activity-performance-troubleshooting.md) on when to tune parallel copy.

The following table lists the parallel copy behavior:

| Copy scenario | Parallel copy behavior |
| --- | --- |
| Between file stores | `parallelCopies` determines the parallelism **at the file level**. The chunking within each file happens underneath automatically and transparently. It's designed to use the best suitable chunk size for a given data store type to load data in parallel. <br/><br/>The actual number of parallel copies copy activity uses at run time is no more than the number of files you have. If the copy behavior is **mergeFile** into file sink, the copy activity can't take advantage of file-level parallelism. |
| From file store to non-file store | - When copying data into Azure SQL Database or Azure Cosmos DB, default parallel copy also depend on the sink tier (number of DTUs/RUs).<br>- When copying data into Azure Table, default parallel copy is 4. |
| From non-file store to file store | - When copying data from partition-option-enabled data store (including [Oracle](connector-oracle.md#oracle-as-source), [Netezza](connector-netezza.md#netezza-as-source), [Teradata](connector-teradata.md#teradata-as-source), [SAP HANA](connector-sap-hana.md#sap-hana-as-source), [SAP Table](connector-sap-table.md#sap-table-as-source), and [SAP Open Hub](connector-sap-business-warehouse-open-hub.md#sap-bw-open-hub-as-source)), default parallel copy is 4. The actual number of parallel copies copy activity uses at run time is no more than the number of data partitions you have. When use Self-hosted Integration Runtime and copy to Azure Blob/ADLS Gen2, note the max effective parallel copy is 4 or 5 per IR node.<br>- For other scenarios, parallel copy doesn't take effect. Even if parallelism is specified, it's not applied. |
| Between non-file stores | - When copying data into Azure SQL Database or Azure Cosmos DB, default parallel copy also depend on the sink tier (number of DTUs/RUs).<br/>- When copying data from partition-option-enabled data store (including [Oracle](connector-oracle.md#oracle-as-source), [Netezza](connector-netezza.md#netezza-as-source), [Teradata](connector-teradata.md#teradata-as-source), [SAP HANA](connector-sap-hana.md#sap-hana-as-source), [SAP Table](connector-sap-table.md#sap-table-as-source), and [SAP Open Hub](connector-sap-business-warehouse-open-hub.md#sap-bw-open-hub-as-source)), default parallel copy is 4.<br>- When copying data into Azure Table, default parallel copy is 4. |

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

- **You want to ingest data from various data stores into Azure Synapse Analytics (formerly SQL Data Warehouse) via PolyBase.** Azure Synapse Analytics uses PolyBase as a high-throughput mechanism to load a large amount of data into Azure Synapse Analytics. The source data must be in Blob storage or Azure Data Lake Store, and it must meet additional criteria. When you load data from a data store other than Blob storage or Azure Data Lake Store, you can activate data copying via interim staging Blob storage. In that case, Azure Data Factory performs the required data transformations to ensure that it meets the requirements of PolyBase. Then it uses PolyBase to load data into Azure Synapse Analytics efficiently. For more information, see [Use PolyBase to load data into Azure SQL Data Warehouse](connector-azure-sql-data-warehouse.md#use-polybase-to-load-data-into-azure-sql-data-warehouse).
- **Sometimes it takes a while to perform a hybrid data movement (that is, to copy from an on-premises data store to a cloud data store) over a slow network connection.** To improve performance, you can use staged copy to compress the data on-premises so that it takes less time to move data to the staging data store in the cloud. Then you can decompress the data in the staging store before you load into the destination data store.
- **You don't want to open ports other than port 80 and port 443 in your firewall because of corporate IT policies.** For example, when you copy data from an on-premises data store to an Azure SQL Database sink or an Azure Synapse Analytics sink, you need to activate outbound TCP communication on port 1433 for both the Windows firewall and your corporate firewall. In this scenario, staged copy can take advantage of the self-hosted integration runtime to first copy data to a Blob storage staging instance over HTTP or HTTPS on port 443. Then it can load the data into SQL Database or Azure Synapse Analytics from Blob storage staging. In this flow, you don't need to enable port 1433.

### How staged copy works

When you activate the staging feature, first the data is copied from the source data store to the staging Blob storage (bring your own). Next, the data is copied from the staging data store to the sink data store. Azure Data Factory automatically manages the two-stage flow for you. Azure Data Factory also cleans up temporary data from the staging storage after the data movement is complete.

![Staged copy](media/copy-activity-performance/staged-copy.png)

When you activate data movement by using a staging store, you can specify whether you want the data to be compressed before you move data from the source data store to an interim or staging data store and then decompressed before you move data from an interim or staging data store to the sink data store.

Currently, you can't copy data between two data stores that are connected via different Self-hosted IRs, neither with nor without staged copy. For such scenario, you can configure two explicitly chained copy activities to copy from source to staging then from staging to sink.

### Configuration

Configure the **enableStaging** setting in the copy activity to specify whether you want the data to be staged in Blob storage before you load it into a destination data store. When you set **enableStaging** to `TRUE`, specify the additional properties listed in the following table. You also need to create an Azure Storage or Storage shared access signature-linked service for staging if you don't have one.

| Property | Description | Default value | Required |
| --- | --- | --- | --- |
| enableStaging |Specify whether you want to copy data via an interim staging store. |False |No |
| linkedServiceName |Specify the name of an [AzureStorage](connector-azure-blob-storage.md#linked-service-properties) linked service, which refers to the instance of Storage that you use as an interim staging store. <br/><br/> You can't use Storage with a shared access signature to load data into Azure Synapse Analytics via PolyBase. You can use it in all other scenarios. |N/A |Yes, when **enableStaging** is set to TRUE |
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