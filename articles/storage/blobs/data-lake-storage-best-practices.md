---
title: Best practices for using Azure Data Lake Storage Gen2 | Microsoft Docs
description: Learn the best practices about data ingestion, date security, and performance related to using Azure Data Lake Storage Gen2 (previously known as Azure Data Lake Store) 
services: storage
author: normesta

ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: article
ms.date: 12/06/2018
ms.author: normesta
ms.reviewer: sachins
---

# Best practices for using Azure Data Lake Storage Gen2

In this article, you learn about best practices and considerations for working with Azure Data Lake Storage Gen2. This article provides information around security, performance, resiliency, and monitoring for Data Lake Storage Gen2. Before Data Lake Storage Gen2, working with truly big data in services like Azure HDInsight was complex. You had to shard data across multiple Blob storage accounts so that petabyte storage and optimal performance at that scale could be achieved. With Data Lake Storage Gen2, most of the hard limits for size and performance are removed. However, there are still some considerations that this article covers so that you can get the best performance with Data Lake Storage Gen2.

## Security considerations

Azure Data Lake Storage Gen2 offers POSIX access controls for Azure Active Directory (Azure AD) users, groups, and service principals. These access controls can be set to existing files and directories. The access controls can also be used to create default permissions that can be automatically applied to new files or directories. More details on Data Lake Storage Gen2 ACLs are available at [Access control in Azure Data Lake Storage Gen2](storage-data-lake-storage-access-control.md).

### Use security groups versus individual users

When working with big data in Data Lake Storage Gen2, it is likely that a service principal is used to allow services such as Azure HDInsight to work with the data. However, there might be cases where individual users need access to the data as well. In all cases, strongly consider using Azure Active Directory [security groups](../common/storage-auth-aad.md) instead of assigning individual users to directories and files.

Once a security group is assigned permissions, adding or removing users from the group doesn’t require any updates to Data Lake Storage Gen2. This also helps ensure you don't exceed the maximum number of access control entries per access control list (ACL). Currently, that number is 32, (including the four POSIX-style ACLs that are always associated with every file and directory): the owning user, the owning group, the mask, and other. Each directory can have two types of ACL, the access ACL and the default ACL, for a total of 64 access control entries. For more information about these ACLs, see [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

### Security for groups

When you or your users need access to data in a storage account with hierarchical namespace enabled, it’s best to use Azure Active Directory security groups. Some recommended groups to start with might be **ReadOnlyUsers**, **WriteAccessUsers**, and **FullAccessUsers** for the root of the file system, and even separate ones for key subdirectories. If there are any other anticipated groups of users that might be added later, but have not been identified yet, you might consider creating dummy security groups that have access to certain folders. Using security group ensures that you can avoid long processing time when assigning new permissions to thousands of files.

### Security for service principals

Azure Active Directory service principals are typically used by services like Azure Databricks to access data in Data Lake Storage Gen2. For many customers, a single Azure Active Directory service principal might be adequate, and it can have full permissions at the root of the Data Lake Storage Gen2 file system. Other customers might require multiple clusters with different service principals where one cluster has full access to the data, and another cluster with only read access. 

### Enable the Data Lake Storage Gen2 firewall with Azure service access

Data Lake Storage Gen2 supports the option of turning on a firewall and limiting access only to Azure services, which is recommended to limit the vector of external attacks. Firewall can be enabled on a storage account in the Azure portal via the **Firewall** > **Enable Firewall (ON)** > **Allow access to Azure services** options.

Adding Azure Databricks clusters to a virtual network that may be allowed to access via the Storage Firewall requires the use of a preview feature of Databricks. To enable this feature, please place a support request.

## Resiliency considerations

When architecting a system with Data Lake Storage Gen2 or any cloud service, you must consider your availability requirements and how to respond to potential interruptions in the service. An issue could be localized to the specific instance or even region-wide, so having a plan for both is important. Depending on the recovery time objective and the recovery point objective SLAs for your workload, you might choose a more or less aggressive strategy for high availability and disaster recovery.

### High availability and disaster recovery

High availability (HA) and disaster recovery (DR) can sometimes be combined together, although each has a slightly different strategy, especially when it comes to data. Data Lake Storage Gen2 already handles 3x replication under the hood to guard against localized hardware failures. Additionally, other replication options, such as ZRS improve HA while GRS & RA-GRS improve DR. When building a plan for HA, in the event of a service interruption the workload needs access to the latest data as quickly as possible by switching over to a separately replicated instance locally or in a new region.

In a DR strategy, to prepare for the unlikely event of a catastrophic failure of a region, it is also important to have data replicated to a different region using GRS or RA-GRS replication. You must also consider your requirements for edge cases such as data corruption where you may want to create periodic snapshots to fall back to. Depending on the importance and size of the data, consider rolling delta snapshots of 1-, 6-, and 24-hour periods, according to risk tolerances.

For data resiliency with Data Lake Storage Gen2, it is recommended to geo-replicate your data via GRS or RA-GRS that satisfies your HA/DR requirements. Additionally, you should consider ways for the application using Data Lake Storage Gen2 to automatically fail over to the secondary region through monitoring triggers or length of failed attempts, or at least send a notification to admins for manual intervention. Keep in mind that there is tradeoff of failing over versus waiting for a service to come back online.

### Use Distcp for data movement between two locations

Short for distributed copy, DistCp is a Linux command-line tool that comes with Hadoop and provides distributed data movement between two locations. The two locations can be Data Lake Storage Gen2, HDFS, or S3. This tool uses MapReduce jobs on a Hadoop cluster (for example, HDInsight) to scale out on all the nodes. Distcp is considered the fastest way to move big data without special network compression appliances. Distcp also provides an option to only update deltas between two locations, handles automatic retries, as well as dynamic scaling of compute. This approach is incredibly efficient when it comes to replicating things like Hive/Spark tables that can have many large files in a single directory and you only want to copy over the modified data. For these reasons, Distcp is the most recommended tool for copying data between big data stores.

Copy jobs can be triggered by Apache Oozie workflows using frequency or data triggers, as well as Linux cron jobs. For intensive replication jobs, it is recommended to spin up a separate HDInsight Hadoop cluster that can be tuned and scaled specifically for the copy jobs. This ensures that copy jobs do not interfere with critical jobs. If running replication on a wide enough frequency, the cluster can even be taken down between each job. If failing over to secondary region, make sure that another cluster is also spun up in the secondary region to replicate new data back to the primary Data Lake Storage Gen2 account once it comes back up. For examples of using Distcp, see [Use Distcp to copy data between Azure Storage Blobs and Data Lake Storage Gen2](../blobs/data-lake-storage-use-distcp.md).

### Use Azure Data Factory to schedule copy jobs

Azure Data Factory can also be used to schedule copy jobs using a Copy Activity, and can even be set up on a frequency via the Copy Wizard. Keep in mind that Azure Data Factory has a limit of cloud data movement units (DMUs), and eventually caps the throughput/compute for large data workloads. Additionally, Azure Data Factory currently does not offer delta updates between Data Lake Storage Gen2 accounts, so directories like Hive tables would require a complete copy to replicate. Refer to the [data factory article](../../data-factory/load-azure-data-lake-storage-gen2.md) for more information on copying with Data Factory.

## Monitoring considerations

Data Lake Storage Gen2 provides metrics in the Azure portal under the Data Lake Storage Gen2 account and in Azure Monitor. Availability of Data Lake Storage Gen2 is displayed in the Azure portal. To get the most up-to-date availability of a Data Lake Storage Gen2 account, you must run your own synthetic tests to validate availability. Other metrics such as total storage utilization, read/write requests, and ingress/egress are available to be leveraged by monitoring applications and can also trigger alerts when thresholds (for example, Average latency or # of errors per minute) are exceeded.

## Directory layout considerations

When landing data into a data lake, it’s important to pre-plan the structure of the data so that security, partitioning, and processing can be utilized effectively. Many of the following recommendations are applicable for all big data workloads. Every workload has different requirements on how the data is consumed, but below are some common layouts to consider when working with IoT and batch scenarios.

### IoT structure

In IoT workloads, there can be a great deal of data being landed in the data store that spans across numerous products, devices, organizations, and customers. It’s important to pre-plan the directory layout for organization, security, and efficient processing of the data for down-stream consumers. A general template to consider might be the following layout:

    {Region}/{SubjectMatter(s)}/{yyyy}/{mm}/{dd}/{hh}/

For example, landing telemetry for an airplane engine within the UK might look like the following structure:

    UK/Planes/BA1293/Engine1/2017/08/11/12/

There's an important reason to put the date at the end of the directory structure. If you want to lock down certain regions or subject matters to users/groups, then you can easily do so with the POSIX permissions. Otherwise, if there was a need to restrict a certain security group to viewing just the UK data or certain planes, with the date structure in front a separate permission would be required for numerous directories under every hour directory. Additionally, having the date structure in front would exponentially increase the number of directories as time went on.

### Batch jobs structure

From a high-level, a commonly used approach in batch processing is to land data in an “in” directory. Then, once the data is processed, put the new data into an “out” directory for downstream processes to consume. This directory structure is seen sometimes for jobs that require processing on individual files and might not require massively parallel processing over large datasets. Like the IoT structure recommended above, a good directory structure has the parent-level directories for things such as region and subject matters (for example, organization, product/producer). This structure helps with securing the data across your organization and better management of the data in your workloads. Furthermore, consider date and time in the structure to allow better organization, filtered searches, security, and automation in the processing. The level of granularity for the date structure is determined by the interval on which the data is uploaded or processed, such as hourly, daily, or even monthly.

Sometimes file processing is unsuccessful due to data corruption or unexpected formats. In such cases, directory structure might benefit from a **/bad** folder to move the files to for further inspection. The batch job might also handle the reporting or notification of these *bad* files for manual intervention. Consider the following template structure:

    {Region}/{SubjectMatter(s)}/In/{yyyy}/{mm}/{dd}/{hh}/
    {Region}/{SubjectMatter(s)}/Out/{yyyy}/{mm}/{dd}/{hh}/
    {Region}/{SubjectMatter(s)}/Bad/{yyyy}/{mm}/{dd}/{hh}/

For example, a marketing firm receives daily data extracts of customer updates from their clients in North America. It might look like the following snippet before and after being processed:

    NA/Extracts/ACMEPaperCo/In/2017/08/14/updates_08142017.csv
    NA/Extracts/ACMEPaperCo/Out/2017/08/14/processed_updates_08142017.csv

In the common case of batch data being processed directly into databases such as Hive or traditional SQL databases, there isn’t a need for an **/in** or **/out** folder since the output already goes into a separate folder for the Hive table or external database. For example, daily extracts from customers would land into their respective folders, and orchestration by something like Azure Data Factory, Apache Oozie, or Apache Airflow would trigger a daily Hive or Spark job to process and write the data into a Hive table.
