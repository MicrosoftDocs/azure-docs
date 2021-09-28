---
title: Best practices for using Azure Data Lake Storage Gen2 | Microsoft Docs
description: Learn the best practices about data ingestion, date security, and performance related to using Azure Data Lake Storage Gen2
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 09/21/2021
ms.author: normesta
ms.reviewer: sachins
---

# Best practices for using Azure Data Lake Storage Gen2

This article presents best practice recommendations about security, resiliency, and directory structure in a Data Lake Storage Gen2 enabled storage account. For best practice recommendations around performance optimization, see [Optimize Azure Data Lake Storage Gen2 for performance](data-lake-storage-performance-tuning-guidance.md).

## Security considerations

### Use security groups instead of individual users

When applying access control lists (ACLs), always use Azure AD security groups as the assigned principal in an ACL entry. Resist the opportunity to directly assign individual users or service principals. Using this structure will allow you to add and remove users or service principals without the need to reapply ACLs to an entire directory structure. Instead, you can just add or remove users and service principals from the appropriate Azure AD security group.

For more information about applying this best practice, see [Security groups](data-lake-storage-access-control-model.md#security-groups).

For general information about the Data Lake Storage Gen2 access control model, see [Access control model in Azure Data Lake Storage Gen2](data-lake-storage-access-control-model.md).

### Configure the Azure Storage firewall with Azure service access

Turn on the Azure Storage firewall to limit the vector of external attacks. To access your storage account from a service such as [Azure Databricks](/azure/databricks/scenarios/what-is-azure-databricks), deploy an instance of that service to your virtual network. Then, you can configure the firewall to grant access to the storage account for that service.

For more information about how to apply this best practice, see [Grant access to trusted Azure services](../common/storage-network-security.md).

For general security recommendations, see [Security recommendations for Blob storage](security-recommendations.md)

## Resiliency considerations

When designing a system with Data Lake Storage Gen2 or any cloud service, consider your availability requirements and how to respond to potential interruptions in the service. An issue could be localized to the specific instance or even region-wide, so having a plan for both is important. Depending on the recovery time objective and the recovery point objective service-level agreement for your workload, you might choose a more or less aggressive strategy for high availability and disaster recovery.

### High availability and disaster recovery

Data Lake Storage Gen2 already handles 3x replication to guard against localized hardware failures. Replication options such as zone-redundant storage (ZRS) and geo-zone-redundant storage (GZRS) improve availability. With these capabilities, workloads can respond to a service interruption by switching over to a separately replicated instance locally or in a new region.

To prepare for a catastrophic failure of a region, make sure to replicate data to a different region by using replication options such as geo-redundant storage (GRS) and read-access geo-redundant storage (RA-GRS). Also consider your requirements for edge cases such as data corruption where you might want to create periodic snapshots to fall back on. Depending on the importance and size of the data, consider rolling delta snapshots of 1-, 6-, and 24-hour periods, according to risk tolerances.

In addition to choosing an appropriate replication model, consider ways to help connecting clients automatically fail over to the secondary region through monitoring triggers, length of failed attempts, or perhaps send a notification to admins for manual intervention. Keep in mind that there is tradeoff of failing over versus waiting for a service to come back online.

### Use Distcp for data movement between two locations

Short for distributed copy, DistCp is a Linux command-line tool that comes with Hadoop and provides distributed data movement between two locations. The two locations can be Data Lake Storage Gen2, Hadoop Distributed File System (HDFS), or S3. This tool uses MapReduce jobs on a Hadoop cluster (for example, HDInsight) to scale out on all the nodes. Distcp is considered one of the fastest ways to move big data without special network compression appliances. Distcp also provides an option to only update deltas between two locations, handles automatic retries, as well as dynamic scaling of compute. This approach is incredibly efficient when it comes to replicating items such like Hive/Spark tables that can have many large files in a single directory, and you only want to copy over the modified data. For these reasons, Distcp is the most recommended tool for copying data between big data stores.

Copy jobs can be triggered by Apache Oozie workflows using frequency or data triggers, as well as Linux cron jobs. For intensive replication jobs, we recommend that you spin up a separate HDInsight Hadoop cluster that can be tuned and scaled specifically for the copy jobs. This ensures that copy jobs do not interfere with critical jobs. If running replication on a wide enough frequency, the cluster can even be taken down between each job. If failing over to secondary region, make sure that another cluster is also spun up in the secondary region to replicate new data back to the primary Data Lake Storage Gen2 account once it comes back up. For examples of using Distcp, see [Use Distcp to copy data between Azure Storage Blobs and Data Lake Storage Gen2](../blobs/data-lake-storage-use-distcp.md).

### Use Azure Data Factory to schedule copy jobs

[Azure Data Factory](../../data-factory/introduction.md) can also be used to schedule copy jobs by using a Copy Activity, and can even be set up on a frequency via the Copy Wizard. Keep in mind that Azure Data Factory has a limit of cloud data movement units (DMUs), and eventually caps the throughput/compute for large data workloads. Additionally, Azure Data Factory currently does not offer delta updates between Data Lake Storage Gen2 accounts, so directories like Hive tables would require a complete copy to replicate. Refer to the [data factory article](../../data-factory/load-azure-data-lake-storage-gen2.md) for more information on copying with Data Factory.

## Monitoring considerations

Data Lake Storage Gen2 provides metrics in the Azure portal under the Data Lake Storage Gen2 account and in Azure Monitor. Availability of Data Lake Storage Gen2 is displayed in the Azure portal. To get the most up-to-date availability of a Data Lake Storage Gen2 account, you must run your own synthetic tests to validate availability. Other metrics such as total storage utilization, read/write requests, and ingress/egress are available to be leveraged by monitoring applications and can also trigger alerts when thresholds (for example, Average latency or # of errors per minute) are exceeded.

## Directory layout considerations

When ingesting data it's important to pre-plan the structure of the data so that security, partitioning, and processing can be utilized effectively. Many of the following recommendations are applicable for all big data workloads. Every workload has different requirements on how the data is consumed, but below are some common layouts to consider when working with Internet of Things (IoT) and batch scenarios.

### IoT structure

In IoT workloads, there can be a great deal of data being ingested that spans across numerous products, devices, organizations, and customers. It's important to pre-plan the directory layout for organization, security, and efficient processing of the data for down-stream consumers. A general template to consider might be the following layout:

*{Region}/{SubjectMatter(s)}/{yyyy}/{mm}/{dd}/{hh}/*

For example, landing telemetry for an airplane engine within the UK might look like the following structure:

*UK/Planes/BA1293/Engine1/2017/08/11/12/*

In this example, by putting the date at the end of the directory structure, you can use ACLs to more easily secure regions and subject matters to specific users and groups. If you put the data structure at the beginning, it would be much more difficult to secure these regions and subject matters. For example, if you wanted to provide access only to UK data or certain planes, you'd need to apply a separate permission for numerous directories under every hour directory. This structure would also exponentially increase the number of directories as time went on.

### Batch jobs structure

A commonly used approach in batch processing is to place data into an "in" directory. Then, once the data is processed, put the new data into an "out" directory for downstream processes to consume. This directory structure is sometimes used for jobs that require processing on individual files, and might not require massively parallel processing over large datasets. Like the IoT structure recommended above, a good directory structure has the parent-level directories for things such as region and subject matters (for example, organization, product, or producer). Consider date and time in the structure to allow better organization, filtered searches, security, and automation in the processing. The level of granularity for the date structure is determined by the interval on which the data is uploaded or processed, such as hourly, daily, or even monthly.

Sometimes file processing is unsuccessful due to data corruption or unexpected formats. In such cases, a directory structure might benefit from a **/bad** folder to move the files to for further inspection. The batch job might also handle the reporting or notification of these *bad* files for manual intervention. Consider the following template structure:

*{Region}/{SubjectMatter(s)}/In/{yyyy}/{mm}/{dd}/{hh}/*\
*{Region}/{SubjectMatter(s)}/Out/{yyyy}/{mm}/{dd}/{hh}/*\
*{Region}/{SubjectMatter(s)}/Bad/{yyyy}/{mm}/{dd}/{hh}/*

For example, a marketing firm receives daily data extracts of customer updates from their clients in North America. It might look like the following snippet before and after being processed:

*NA/Extracts/ACMEPaperCo/In/2017/08/14/updates_08142017.csv*\
*NA/Extracts/ACMEPaperCo/Out/2017/08/14/processed_updates_08142017.csv*

In the common case of batch data being processed directly into databases such as Hive or traditional SQL databases, there isn't a need for an **/in** or **/out** directory because the output already goes into a separate folder for the Hive table or external database. For example, daily extracts from customers would land into their respective directories. Then, a service such as [Azure Data Factory](../../data-factory/introduction.md), [Apache Oozie](https://oozie.apache.org/), or [Apache Airflow](https://airflow.apache.org/) would trigger a daily Hive or Spark job to process and write the data into a Hive table.

## See also

- [Access control model in Azure Data Lake Storage Gen2](data-lake-storage-access-control-model.md)
- [Optimize Azure Data Lake Storage Gen2 for performance](data-lake-storage-performance-tuning-guidance.md)
- [The hitchhiker's guide to the Data Lake](https://github.com/rukmani-msft/adlsguidancedoc/blob/master/Hitchhikers_Guide_to_the_Datalake.md)
- [Overview of Azure Data Lake Storage Gen2](data-lake-storage-introduction.md)
