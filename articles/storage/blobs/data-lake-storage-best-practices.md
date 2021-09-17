---
title: Best practices for using Azure Data Lake Storage Gen2 | Microsoft Docs
description: Learn the best practices about data ingestion, date security, and performance related to using Azure Data Lake Storage Gen2 (previously known as Azure Data Lake Store) 
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 12/06/2018
ms.author: normesta
ms.reviewer: sachins
---

# Best practices for using Azure Data Lake Storage Gen2

In this article, you learn about best practices and considerations for working with Azure Data Lake Storage Gen2. This article provides information around security, performance, resiliency, and monitoring for Data Lake Storage Gen2. Before Data Lake Storage Gen2, working with truly big data in services like Azure HDInsight was complex. You had to shard data across multiple Blob storage accounts so that petabyte storage and optimal performance at that scale could be achieved. Data Lake Storage Gen2 supports individual file sizes as high as 190.7 TiB and most of the hard limits for performance have been removed. However, there are still some considerations that this article covers so that you can get the best performance with Data Lake Storage Gen2.

- For security best practices, see [Access control model in Azure Data Lake Storage Gen2](data-lake-storage-access-control-model.md).

- For performance optimization best practices, see [Optimize Azure Data Lake Storage Gen2 for performance](data-lake-storage-performance-tuning-guidance.md).

### Enable the Data Lake Storage Gen2 firewall with Azure service access

Data Lake Storage Gen2 supports the option of turning on a firewall and limiting access only to Azure services, which is recommended to limit the vector of external attacks. Firewall can be enabled on a storage account in the Azure portal via the **Firewall** > **Enable Firewall (ON)** > **Allow access to Azure services** options.

To access your storage account from Azure Databricks, deploy Azure Databricks to your virtual network, and then add that virtual network to your firewall. See [Configure Azure Storage firewalls and virtual networks](../common/storage-network-security.md).

## Resiliency considerations

When architecting a system with Data Lake Storage Gen2 or any cloud service, you must consider your availability requirements and how to respond to potential interruptions in the service. An issue could be localized to the specific instance or even region-wide, so having a plan for both is important. Depending on the recovery time objective and the recovery point objective SLAs for your workload, you might choose a more or less aggressive strategy for high availability and disaster recovery.

### High availability and disaster recovery

High availability (HA) and disaster recovery (DR) can sometimes be combined together, although each has a slightly different strategy, especially when it comes to data. Data Lake Storage Gen2 already handles 3x replication under the hood to guard against localized hardware failures. Additionally, other replication options, such as ZRS or GZRS, improve HA, while GRS & RA-GRS improve DR. When building a plan for HA, in the event of a service interruption the workload needs access to the latest data as quickly as possible by switching over to a separately replicated instance locally or in a new region.

In a DR strategy, to prepare for the unlikely event of a catastrophic failure of a region, it is also important to have data replicated to a different region using GRS or RA-GRS replication. You must also consider your requirements for edge cases such as data corruption where you may want to create periodic snapshots to fall back to. Depending on the importance and size of the data, consider rolling delta snapshots of 1-, 6-, and 24-hour periods, according to risk tolerances.

For data resiliency with Data Lake Storage Gen2, it is recommended to geo-replicate your data via GRS or RA-GRS that satisfies your HA/DR requirements. Additionally, you should consider ways for the application using Data Lake Storage Gen2 to automatically fail over to the secondary region through monitoring triggers or length of failed attempts, or at least send a notification to admins for manual intervention. Keep in mind that there is tradeoff of failing over versus waiting for a service to come back online.

### Use Distcp for data movement between two locations

Short for distributed copy, DistCp is a Linux command-line tool that comes with Hadoop and provides distributed data movement between two locations. The two locations can be Data Lake Storage Gen2, HDFS, or S3. This tool uses MapReduce jobs on a Hadoop cluster (for example, HDInsight) to scale out on all the nodes. Distcp is considered the fastest way to move big data without special network compression appliances. Distcp also provides an option to only update deltas between two locations, handles automatic retries, as well as dynamic scaling of compute. This approach is incredibly efficient when it comes to replicating things like Hive/Spark tables that can have many large files in a single directory and you only want to copy over the modified data. For these reasons, Distcp is the most recommended tool for copying data between big data stores.

Copy jobs can be triggered by Apache Oozie workflows using frequency or data triggers, as well as Linux cron jobs. For intensive replication jobs, it is recommended to spin up a separate HDInsight Hadoop cluster that can be tuned and scaled specifically for the copy jobs. This ensures that copy jobs do not interfere with critical jobs. If running replication on a wide enough frequency, the cluster can even be taken down between each job. If failing over to secondary region, make sure that another cluster is also spun up in the secondary region to replicate new data back to the primary Data Lake Storage Gen2 account once it comes back up. For examples of using Distcp, see [Use Distcp to copy data between Azure Storage Blobs and Data Lake Storage Gen2](../blobs/data-lake-storage-use-distcp.md).

### Use Azure Data Factory to schedule copy jobs

Azure Data Factory can also be used to schedule copy jobs using a Copy Activity, and can even be set up on a frequency via the Copy Wizard. Keep in mind that Azure Data Factory has a limit of cloud data movement units (DMUs), and eventually caps the throughput/compute for large data workloads. Additionally, Azure Data Factory currently does not offer delta updates between Data Lake Storage Gen2 accounts, so directories like Hive tables would require a complete copy to replicate. Refer to the [data factory article](../../data-factory/load-azure-data-lake-storage-gen2.md) for more information on copying with Data Factory.

## Directory layout considerations

When landing data into a data lake, it’s important to pre-plan the structure of the data so that security, partitioning, and processing can be utilized effectively. Many of the following recommendations are applicable for all big data workloads. Every workload has different requirements on how the data is consumed, but below are some common layouts to consider when working with IoT and batch scenarios.

### IoT structure

In IoT workloads, there can be a great deal of data being landed in the data store that spans across numerous products, devices, organizations, and customers. It’s important to pre-plan the directory layout for organization, security, and efficient processing of the data for down-stream consumers. A general template to consider might be the following layout:

*{Region}/{SubjectMatter(s)}/{yyyy}/{mm}/{dd}/{hh}/*

For example, landing telemetry for an airplane engine within the UK might look like the following structure:

*UK/Planes/BA1293/Engine1/2017/08/11/12/*

There's an important reason to put the date at the end of the directory structure. If you want to lock down certain regions or subject matters to users/groups, then you can easily do so with the POSIX permissions. Otherwise, if there was a need to restrict a certain security group to viewing just the UK data or certain planes, with the date structure in front a separate permission would be required for numerous directories under every hour directory. Additionally, having the date structure in front would exponentially increase the number of directories as time went on.

### Batch jobs structure

From a high-level, a commonly used approach in batch processing is to land data in an “in” directory. Then, once the data is processed, put the new data into an “out” directory for downstream processes to consume. This directory structure is seen sometimes for jobs that require processing on individual files and might not require massively parallel processing over large datasets. Like the IoT structure recommended above, a good directory structure has the parent-level directories for things such as region and subject matters (for example, organization, product/producer). This structure helps with securing the data across your organization and better management of the data in your workloads. Furthermore, consider date and time in the structure to allow better organization, filtered searches, security, and automation in the processing. The level of granularity for the date structure is determined by the interval on which the data is uploaded or processed, such as hourly, daily, or even monthly.

Sometimes file processing is unsuccessful due to data corruption or unexpected formats. In such cases, directory structure might benefit from a **/bad** folder to move the files to for further inspection. The batch job might also handle the reporting or notification of these *bad* files for manual intervention. Consider the following template structure:

*{Region}/{SubjectMatter(s)}/In/{yyyy}/{mm}/{dd}/{hh}/*\
*{Region}/{SubjectMatter(s)}/Out/{yyyy}/{mm}/{dd}/{hh}/*\
*{Region}/{SubjectMatter(s)}/Bad/{yyyy}/{mm}/{dd}/{hh}/*

For example, a marketing firm receives daily data extracts of customer updates from their clients in North America. It might look like the following snippet before and after being processed:

*NA/Extracts/ACMEPaperCo/In/2017/08/14/updates_08142017.csv*\
*NA/Extracts/ACMEPaperCo/Out/2017/08/14/processed_updates_08142017.csv*

In the common case of batch data being processed directly into databases such as Hive or traditional SQL databases, there isn’t a need for an **/in** or **/out** folder since the output already goes into a separate folder for the Hive table or external database. For example, daily extracts from customers would land into their respective folders, and orchestration by something like Azure Data Factory, Apache Oozie, or Apache Airflow would trigger a daily Hive or Spark job to process and write the data into a Hive table.

## Number of accounts

- Create different storage accounts (ideally in different subscriptions) for your development and production environments. In addition to ensuring that there is enough isolation between your development and production environments requiring different SLAs, this also helps you track and optimize your management and billing policies efficiently.

- Identify the different logical sets of your data and think about your needs to manage them in a unified or isolated fashion – this will help determine your account boundaries. Provide examples and possibly harvest that image.

- Start your design approach with one storage account and think about reasons why you need multiple storage accounts (isolation, region based requirements etc) instead of the other way around.

- There are also [subscription limits and quotas](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits) on other resources (such as VM cores, ADF instances) – factor that into consideration when designing your data lake.

- When you decide on the number of ADLS Gen2 storage accounts, ensure that you are optimizing for your consumption patterns. If you do not require isolation and you are not utilizing your storage accounts to their fullest capabilities, you will be incurring the overhead of managing multiple accounts without a meaningful return on investment. 

- When you have multiple data lakes, one thing you would want to treat carefully is if and how you are replicating data across the multiple accounts. This creates a management problem of what is the source of truth and how fresh it needs to be, and also consumes transactions involved in copying data back and forth. We have features in our roadmap that makes this workflow easier if you have a legitimate scenario to replicate your data. 

- If you have requirements for really storing really large amounts of data (multi-petabytes) and require the account to support a really large transaction and throughput pattern (tens of thousands of TPS and hundreds of Gbps throughput), typically observed by requiring 1000s of cores of compute power for analytics processing via Databricks or HDInsight, please do contact our product group so we can plan to support your requirements appropriately. 

## Data format

Data may arrive to your data lake account in a variety of formats – human readable formats such as JSON, CSV or XML files, compressed binary formats such as .tar.gz and a variety of sizes – huge files (a few TBs) such as an export of a SQL table from your on-premise systems or a large number of tiny files (a few KBs) such as real-time events from your IoT solution. While ADLS Gen2 supports storing all kinds of data without imposing any restrictions, it is better to think about data formats to maximize efficiency of your processing pipelines and optimize costs – you can achieve both of these by picking the right format and the right file sizes.
Hadoop has a set of file formats it supports for optimized storage and processing of structured data. Let us look at some common file formats – [Avro](https://avro.apache.org/docs/current/), [Parquet](https://parquet.apache.org/documentation/latest/) and [ORC](https://orc.apache.org/docs/). All of these are machine-readable binary file formats, offer compression to manage the file size and are self-describing in nature with a schema embedded in the file. The difference between the formats is in how data is stored – Avro stores data in a row-based format and Parquet and ORC formats store data in a columnar format. 

*	Avro file format is favored where the I/O patterns are more write heavy or the query patterns favor retrieving multiple rows of records in their entirety. E.g. Avro format is favored by message bus such as Event Hub or Kafka writes multiple events/messages in succession.
*	Parquet and ORC file formats are favored when the I/O patterns are more read heavy and/or when the query patterns are focused on a subset of columns in the records – where the read transactions can be optimized to retrieve specific columns instead of reading the entire record.

### Managing costs

ADLS Gen2 offers a data lake store for your analytics scenarios with the goal of lowering your total cost of ownership. The pricing for ADLS Gen2 can be found [here](https://azure.microsoft.com/en-us/pricing/details/storage/data-lake/). As our enterprise customers serve the needs of multiple organizations including analytics use-cases on a central data lake, their data and transactions tend to increase dramatically. With little or no centralized control, so will the associated costs increase. This section provides key considerations that you can use to manage and optimize the cost of your data lake. 

*	ADLS Gen2 provides policy management that you can use to leverage the lifecycle of data stored in your Gen2 account. You can read more about these policies [here](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-lifecycle-management-concepts?tabs=azure-portal). E.g. if your organization has a retention policy requirement to keep the data for 5 years, you can set a policy to automatically delete the data if it has not been modified for 5 years. If your analytics scenarios primarily operate on data that is ingested in the past month, you can move the data older than the month to a lower tier (cool or archive) which have a lower cost for data stored. Please note that the lower tiers have a lower price for data at rest, but higher policies for transactions, so do not move data to lower tiers if you expect the data to be frequently transacted on. 

*	Ensure that you are choosing the right replication option for your accounts, you can read the [data redundancy article](https://docs.microsoft.com/en-us/azure/storage/common/storage-redundancy) to learn more about your options. E.g. while GRS accounts ensure that your data is replicated across multiple regions, it also costs higher than an LRS account (where data is replicated on the same datacenter). When you have a production environment, replication options such as GRS are highly valuable to ensure business continuity with high availability and disaster recovery. However, an LRS account might just suffice for your development environment. 
*	As you can see from the [pricing page](https://azure.microsoft.com/en-us/pricing/details/storage/data-lake/) of ADLS Gen2, your read and write transactions are billed in 4 MB increments. E.g. if you do 10,000 read operations and each file read is 16 MB in size, you will be charged for 40,000 transactions. When you have scenarios where you read a few KBs of data in a transaction, you will still be charged for the a 4 MB transaction. Optimizing for more data in a single transaction, i.e. optimizing for higher throughtput in your transactions does not just save cost, but also highly improves your performance.

## Monitoring considerations

Data Lake Storage Gen2 provides metrics in the Azure portal under the Data Lake Storage Gen2 account and in Azure Monitor. Availability of Data Lake Storage Gen2 is displayed in the Azure portal. To get the most up-to-date availability of a Data Lake Storage Gen2 account, you must run your own synthetic tests to validate availability. Other metrics such as total storage utilization, read/write requests, and ingress/egress are available to be leveraged by monitoring applications and can also trigger alerts when thresholds (for example, Average latency or # of errors per minute) are exceeded.

Understanding how your data lake is used and how it performs is a key component of operationalizing your service and ensuring it is available for use by any workloads which consume the data contained within it. This includes:

- Being able to audit your data lake in terms of frequent operations
- Having visibiliy into key performace indicators such as operations with high latency
- Undestanding common errors, the operations that caused the error, and operations which cause service-side throttling

All of the telemetry for your data lake is available through [Azure Storage logs in Azure Monitor](https://docs.microsoft.com/azure/storage/common/monitor-storage). Azure Storage logs in Azure Monitor is a new preview feature for Azure Storage which allows for a direct integration between your storage accounts and Log Analytics, Event Hubs, and archival of logs to another storage account utilizing standard [diagnostic settings](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings). A reference of the the full list of metrics and resources logs and their associated schema can be found in the [Azure Storage monitoring data reference](https://docs.microsoft.com/azure/storage/common/monitor-storage-reference).

- Where your choose to store your logs from Azure Storage logs becomes important when you consider how you will access it:
  - If you want to access your logs in near real-time and be able to correlate events in logs with other metrics from Azure Monitor, you can store your logs in a Log Analytics workspace. This allows you to query your logs using KQL and author queries which enumerate the `StorageBlobLogs` table in your workspace.
  - If you want to store your logs for both near real-time query and long term retention, you can configure your diagnostic settings to send logs to both a Log Analytics workspace and a storage account.
  - If you want to access your logs through another query engine such as [Splunk](https://splunkbase.splunk.com/app/4343), you can configure your dianostic settings to send logs to an Event Hub and ingest logs from the Event Hub to your chosen destination.
- Azure Storage logs in Azure Monitor can be enabled through the Azure Portal, PowerShell, the Azure CLI, and Azure Resource Manager templates. For at-scale deployments, Azure Policy can be used with full support for remediation tasks. For more details, see:
  - [Azure/Community-Policy](https://github.com/Azure/Community-Policy/tree/master/Policies/Storage/deploy-storage-monitoring-log-analytics)
  - [ciphertxt/AzureStoragePolicy](https://github.com/ciphertxt/AzureStoragePolicy)

## Optimizing your data lake for better scale and performance

Link to the perf article
