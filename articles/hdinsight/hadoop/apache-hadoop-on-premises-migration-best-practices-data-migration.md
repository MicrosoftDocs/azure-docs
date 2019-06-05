---
title: Migrate on-premises Apache Hadoop clusters to Azure HDInsight - data migration best practices
description: Learn data migration best practices for migrating on-premises Hadoop clusters to Azure HDInsight.
author: hrasheed-msft
ms.reviewer: ashishth
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 04/08/2019
ms.author: hrasheed
---
# Migrate on-premises Apache Hadoop clusters to Azure HDInsight - data migration best practices

This article gives recommendations for data migration to Azure HDInsight. It's part of a series that provides best practices to assist with migrating on-premises Apache Hadoop systems to Azure HDInsight.

## Migrate on-premises data to Azure

There are two main options to migrate data from on-premises to Azure environment:

1.  Transfer data over network with TLS
    1. Over internet - You can transfer data to Azure storage over a regular internet connection using any one of several tools such as: Azure Storage Explorer, AzCopy, Azure Powershell, and Azure CLI.  See [Moving data to and from Azure Storage](../../storage/common/storage-moving-data.md) for more information.
    2. Express Route - ExpressRoute is an Azure service that lets you create private connections between Microsoft datacenters and infrastructure that’s on your premises or in a colocation facility. ExpressRoute connections do not go over the public Internet, and offer higher security, reliability, and speeds with lower latencies than typical connections over the Internet. For more information, see [Create and modify an ExpressRoute circuit](../../expressroute/expressroute-howto-circuit-portal-resource-manager.md).
    1. Data Box online data transfer - Data Box Edge and Data Box Gateway are online data transfer products that act as network storage gateways to manage data between your site and Azure. Data Box Edge, an on-premises network device, transfers data to and from Azure and uses artificial intelligence (AI)-enabled edge compute to process data. Data Box Gateway is a virtual appliance with storage gateway capabilities. For more information, see [Azure Data Box Documentation - Online Transfer](https://docs.microsoft.com/azure/databox-online/).
1.  Shipping data Offline
    1. Data Box offline data transfer - Data Box, Data Box Disk, and Data Box Heavy devices help you transfer large amounts of data to Azure when the network isn’t an option. These offline data transfer devices are shipped between your organization and the Azure datacenter. They use AES encryption to help protect your data in transit, and they undergo a thorough post-upload sanitization process to delete your data from the device. For more information on the Data Box offline transfer devices, see [Azure Data Box Documentation - Offline Transfer](https://docs.microsoft.com/azure/databox/). For more information on migration of Hadoop clusters, see [Use Azure Data Box to migrate from an on-premises HDFS store to Azure Storage](../../storage/blobs/data-lake-storage-migrate-on-premises-hdfs-cluster.md).

The following table has approximate data transfer duration based on the data volume and network bandwidth. Use a Data box if the data migration is expected to take more than three weeks.

|**Data Qty**|**Network Bandwidth**||||
|---|---|---|---|---|
|| **45 Mbps (T3)**|**100 Mbps**|**1 Gbps**|**10 Gbps**|
|1 TB|2 days|1 day| 2 hours|14 minutes|
|10 TB|22 days|10 days|1 day|2 hours|
|35 TB|76 days|34 days|3 days|8 hours|
|80 TB|173 days|78 days|8 days|19 hours|
|100 TB|216 days|97 days|10 days|1 day|
|200 TB|1 year|194 days|19 days|2 days|
|500 TB|3 years|1 year|49 days|5 days|
|1 PB|6 years|3 years|97 days|10 days|
|2 PB|12 years|5 years|194 days|19 days|

Tools native to Azure, like Apache Hadoop  DistCp, Azure Data Factory, and AzureCp, can be used to transfer data over the network. The third-party tool WANDisco can also be used for the same purpose. Apache Kafka Mirrormaker and Apache Sqoop can be used for ongoing data transfer from on-premises to Azure storage systems.


## Performance considerations when using Apache Hadoop DistCp


DistCp is an Apache project that uses a MapReduce Map job to transfer data, handle errors, and recover from those errors. It assigns a list of source files to each Map task. The Map task then copies all of its assigned files to the destination. There are several techniques can improve the performance of DistCp.

### Increase the number of Mappers

DistCp tries to create map tasks so that each one copies roughly the same number of bytes. By default, DistCp jobs use 20 mappers. Using more Mappers for Distcp (with the 'm' parameter at command line) increases parallelism during the data transfer process and decreases the length of the data transfer. However, there are two things to consider while increasing the number of Mappers:

1. DistCp's lowest granularity is a single file. Specifying a number of Mappers more than the number of source files does not help and will waste the available cluster resources.
1. Consider the available Yarn memory on the cluster to determine the number of Mappers. Each Map task is launched as a Yarn container. Assuming that no other heavy workloads are running on the cluster, the number of Mappers can be determined by the following formula: m = (number of worker nodes \* YARN memory for each worker node) / YARN container size. However, If other applications are using memory, then choose to only use a portion of YARN memory for DistCp jobs.

### Use more than one DistCp job

When the size of the dataset to be moved is larger than 1 TB, use more than one DistCp job. Using more than one job limits the impact of failures. If any job fails, you only need to restart that specific job rather than all of the jobs.

### Consider splitting files

If there are a small number of large files, then consider splitting them into 256-MB file chunks to get more potential concurrency with more Mappers.

### Use the 'strategy' command-line parameter

Consider using `strategy = dynamic` parameter in the command line. The default value of the `strategy` parameter is `uniform size`, in which case each map copies roughly the same number of bytes. When this parameter is changed to `dynamic`, the listing file is split into several "chunk-files". The number of chunk-files is a multiple of the number of maps. Each map task is assigned one of the chunk-files. After all the paths in a chunk are processed, the current chunk is deleted and a new chunk is acquired. The process continues until no more chunks are available. This "dynamic" approach allows faster map-tasks to consume more paths than slower ones, thus speeding up the DistCp job overall.

### Increase the number of threads

See if increasing the `-numListstatusThreads` parameter improves performance. This parameter controls the number of threads to use for building file listing and 40 is the maximum value.

### Use the output committer algorithm

See if passing the parameter `-Dmapreduce.fileoutputcommitter.algorithm.version=2` improves DistCp performance. This output committer algorithm has optimizations around writing output files to the destination. The following command is an example that shows the usage of different parameters:

```bash
hadoop distcp -Dmapreduce.fileoutputcommitter.algorithm.version=2 -numListstatusThreads 30 -m 100 -strategy dynamic hdfs://nn1:8020/foo/bar wasb://<container_name>@<storage_account_name>.blob.core.windows.net/foo/
```

## Metadata migration

### Apache Hive

The hive metastore can be migrated either by using the scripts or by using the DB Replication.

#### Hive metastore migration using scripts

1. Generate the Hive DDLs from on premises Hive metastore. This step can be done using a [wrapper bash script](https://github.com/hdinsight/hdinsight.github.io/blob/master/hive/hive-export-import-metastore.md).
1. Edit the generated DDL to replace HDFS url with WASB/ADLS/ABFS URLs.
1. Run the updated DDL on the metastore from the HDInsight cluster.
1. Make sure that the Hive metastore version is compatible between on-premises and cloud.

#### Hive metastore migration using DB replication

- Set up Database Replication between on-premises Hive metastore DB and HDInsight metastore DB.
- Use the "Hive MetaTool" to replace HDFS url with WASB/ADLS/ABFS urls, for example:

```bash
./hive --service metatool -updateLocation hdfs://nn1:8020/ wasb://<container_name>@<storage_account_name>.blob.core.windows.net/
```

### Apache Ranger

- Export on-premises Ranger policies to xml files.
- Transform on premises specific HDFS-based paths to WASB/ADLS using a tool like XSLT.
- Import the policies on to Ranger running on HDInsight.

## Next steps

Read the next article in this series:

- [Security and DevOps best practices for on-premises to Azure HDInsight Hadoop migration](apache-hadoop-on-premises-migration-best-practices-security-devops.md)
