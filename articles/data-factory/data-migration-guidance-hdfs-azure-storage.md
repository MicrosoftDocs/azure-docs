---
title: Use Azure Data Factory to migrate data from an on-premises Hadoop cluster to Azure Storage | Microsoft Docs
description: Use Azure Data Factory to migrate data from on-premises Hadoop cluster to Azure Storage.
services: data-factory
documentationcenter: ''
author: dearandyxu
ms.author: yexu
ms.reviewer: 
manager: 
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 8/30/2019
---

# Use Azure Data Factory to migrate data from an on-premises Hadoop cluster to Azure Storage 

Azure Data Factory provides a performant, robust, and cost-effective mechanism to migrate data at scale from on-premises HDFS to Azure Blob storage or Azure Data Lake Storage Gen2. 

Data Factory offers two basic approaches for migrating data from on-premises HDFS to Azure. You can select the approach based on your scenario. 

- **Data Factory DistCp mode**: Data Factory supports using [DistCp](https://hadoop.apache.org/docs/current3/hadoop-distcp/DistCp.html) (distributed copy) to copy files as-is to Azure Blob (including [staged copy](https://docs.microsoft.com/azure/data-factory/copy-activity-performance#staged-copy)) or Azure Data Lake Store to fully leverage your cluster's power instead of running on the Data Factory self-hosted integration runtime. 

   DistCp provides better copy throughput, especially when your cluster is powerful. Depending on your Data Factory configuration, copy activity automatically constructs a DistCp command, submits the data to your Hadoop cluster, and monitors the copy status. You can use Data Factory integrated with DistCp to take advantage of your existing powerful cluster to achieve the best copy throughput. You also get the benefit of flexible scheduling and a unified monitoring experience from Data Factory. 

   By default, Data Factory DistCp mode is the recommended way to migrate data from an on-premises Hadoop cluster to Azure.

- **Data Factory native integration runtime mode**: DistCp isn't an option in all scenarios. For example, in an environment running Azure Virtual Networks, the DistCp tool doesn't support Azure ExpressRoute private peering with an Azure Storage virtual network endpoint. In addition, in some cases, you don't want to use your existing Hadoop cluster as an engine for migrating data to avoid putting heavy loads on your cluster, which might affect the performance of existing ETL jobs. Instead, you can use the native capability of Data Factory, in which the Data Factory integration runtime is the engine that copies data from on-premises HDFS to Azure.

This article provides the following information about both approaches:
> [!div class="checklist"]
> * Performance​ 
> * Copy resilience
> * Network security
> * High-level solution architecture 
> * Implementation best practices  

## Performance

In Data Factory DistCp mode, throughput is the same as using DistCp tool independently. It maximizes the capacity of your existing Hadoop cluster. DistCp is a tool you can use for large inter-cluster or intra-cluster copying. DistCp uses MapReduce to effect its distribution, error handling and recovery, and reporting. It expands a list of files and directories into input to map tasks. Each task copies a partition of the files that's specified in the source list. You can use Data Factory integrated with DistCp to build pipelines to fully utilize your network bandwidth, storage IOPS, and bandwidth to maximize data movement throughput for your environment.  

Data Factory native integration runtime mode also allows parallelism at different levels. You can use parallelism to fully utilize your network bandwidth, storage IOPS, and bandwidth to maximize data movement throughput. You do this by manually scaling up the self-hosted integration runtime machine or scale out to self-hosted  integration runtime multiple machines.

- A single copy activity can take advantage of scalable compute resources. With a self-hosted integration runtime, you can manually scale up the machine or scale out to multiple machines  ([up to four nodes](https://docs.microsoft.com/azure/data-factory/create-self-hosted-integration-runtime#high-availability-and-scalability)). A single copy activity  partitions its file set across all nodes. 
- A single copy activity reads from and writes to the data store by using multiple threads. 
- Data Factory control flow can start multiple copy activities in parallel. For example, use [For Each loop](https://docs.microsoft.com/azure/data-factory/control-flow-for-each-activity). 

For more information, see the [copy activity performance guide](https://docs.microsoft.com/azure/data-factory/copy-activity-performance).

## Resilience

In Data Factory DistCp mode, you can use different DistCp command-line parameters (For example, `-i`, ignore failures; `-update`, write data when source file and destination file differ in size) to achieve different levels of resilience.

In Data Factory native integration runtime mode, in a single copy activity run, Data Factory has a built-in retry mechanism so it can handle a certain level of transient failures in the data stores or in the underlying network. When doing binary copying from on-premises HDFS to Blob and from on-premises HDFS to Data Lake Store Gen2, Data Factory automatically performs checkpointing to a large extent. If a copy activity run fails or times out, on a subsequent retry (make sure that retry count is > 1), the copy resumes from the last failure point instead of starting from the beginning.

## Network security 

By default, Data Factory transfers data from on-premises HDFS to Azure Blob storage or Azure Data Lake Storage Gen2 by using an encrypted connection over HTTPS protocol. HTTPS provides data encryption in transit and prevents eavesdropping and man-in-the-middle attacks. 

Alternatively, if you don't want data to be transferred over the public internet, for higher security, transfer data over a private peering link via ExpressRoute. 

## Solution architecture

To migrate data over the public internet:

![Diagram that shows the solution architecture for migrating data over a public network](media/data-migration-guidance-hdfs-to-azure-storage/solution-architecture-public-network.png)

- In this architecture, data is transferred securely by using HTTPS over the public internet. 
- We recommend using Data Factory DistCp mode in a public network environment. You can take advantage of your powerful existing cluster to achieve the best copy throughput. You also get the benefit of flexible scheduling and unified monitoring experience from Data Factory.
- For this architecture, you must install the Data Factory self-hosted integration runtime on a Windows machine behind a corporate firewall to submit the DistCp command to your Hadoop cluster and to monitor the copy status. Because the machine isn't the engine that will move data (for control purpose only), the capacity of the machine doesn't affect the throughput of data movement.
- Existing parameters from the DistCp command are supported.

To migrate data over a private link: 

![Diagram that shows the solution architecture for migrating data over a private network](media/data-migration-guidance-hdfs-to-azure-storage/solution-architecture-private-network.png)

- In this architecture, data migration is done over a private peering link via Azure ExpressRoute. Data never traverses over the public internet.
- The DistCp tool doesn't support ExpressRoute private peering with an Azure Storage virtual network endpoint. You're encouraged to use Data Factory native capability via the integration runtime to migrate the data.
- For this architecture, you must install the Data Factory self-hosted integration runtime on a Windows VM in your Azure virtual network. You can manually scale up your VM or scale out to multiple VMs to fully utilize your network and storage IOPS or bandwidth.
- The recommended configuration to start with for each Azure VM (with the Data Factory self-hosted integration runtime installed) is Standard_D32s_v3 with a 32 vCPU and 128 GB of memory. You can keep monitoring the CPU and memory utilization of the VM during data migration to see if you need to further scale up the VM for better performance or to scale down the VM to reduce cost.
- You can also scale out by associating up to four VM nodes with a single self-hosted integration runtime. A single copy job running against a self-hosted integration runtime automatically partitions the file set and makes use of all VM nodes to copy the files in parallel. For high availability, we recommend that you start with two VM nodes to avoid a single-point-of-failure scenario during the data migration.
- You can achieve initial snapshot data migration and delta data migration by using this architecture.

## Implementation best practices

We recommend that you follow these best practices when you implement your data migration.

### Authentication and credential management 

- To authenticate to HDFS, you can use [either Windows (Kerberos) or Anonymous](https://docs.microsoft.com/azure/data-factory/connector-hdfs#linked-service-properties). 
- Multiple authentication types are supported for connecting to Azure Blob storage.  We highly recommend using [managed identities for Azure resources](https://docs.microsoft.com/azure/data-factory/connector-azure-blob-storage#managed-identity). Built on top of an automatically managed Data Factory identify in Azure AD, managed identities allows you to configure pipelines without supplying credentials in the linked service definition. Alternatively, you can authenticate to Azure Blob storage by using a [service principal](https://docs.microsoft.com/azure/data-factory/connector-azure-blob-storage#service-principal-authentication), a [shared access signature](https://docs.microsoft.com/azure/data-factory/connector-azure-blob-storage#shared-access-signature-authentication), or a [storage account key](https://docs.microsoft.com/azure/data-factory/connector-azure-blob-storage#account-key-authentication). 
- Multiple authentication types also are supported for connecting to Azure Data Lake Storage Gen2.  We highly recommend using [managed identities for Azure resources](https://docs.microsoft.com/azure/data-factory/connector-azure-data-lake-storage#managed-identity), but you also can use a [service principal](https://docs.microsoft.com/azure/data-factory/connector-azure-data-lake-storage#service-principal-authentication) or a [storage account key](https://docs.microsoft.com/azure/data-factory/connector-azure-data-lake-storage#account-key-authentication). 
- When you're not using managed identities for Azure resources, we highly recommend [storing the credentials in Azure Key Vault](https://docs.microsoft.com/azure/data-factory/store-credentials-in-key-vault) to make it easier to centrally manage and rotate keys without modifying Data Factory linked services. This is also a [best practice for CI/CD](https://docs.microsoft.com/azure/data-factory/continuous-integration-deployment#best-practices-for-cicd). 

### Initial snapshot data migration 

In Data Factory DistCp mode, you can create one copy activity to submit the DistCp command and use different parameters to control initial data migration behavior. 

In Data Factory native integration runtime mode, we recommend data partition, especially when you migrate more than 10 TB of data. To partition the data, use the folder names on HDFS. Then, each Data Factory copy job can copy one folder partition at a time. You can run multiple Data Factory copy jobs concurrently for better throughput.

If any of the copy jobs fail due to network or data store transient issues, you can rerun the failed copy job to reload that specific partition from HDFS. All other copy jobs that are loading other partitions won't be affected.

### Delta data migration 

In Data Factory DistCp mode, you can use DistCp command-line parameter "`-update`, write data when source file and destination file differ in size” to achieve delta data migration.

In Data Factory native integration mode, the most performant way to identify new or changed files from HDFS is by using a time-partitioned naming convention. When your data in HDFS has been time-partitioned with time slice information in the file or folder name (for example, */yyyy/mm/dd/file.csv*), your pipeline can easily identify which files and folders to copy incrementally.

Alternatively, if your data in HDFS isn't time-partitioned, Data Factory can identify new or changed files by using their LastModifiedDate value. Data Factory scans all the files from HDFS and copies only the new and updated file whose last modified timestamp is greater than a certain value. If you have a large number of files in HDFS, the initial file scanning could take a long time regardless of how many files match the filter condition. In this scenario, we recommend that you first partition the data by using the same partition you used for the initial snapshot migration, so file scanning occurs in parallel.

### Estimate price 

Consider the following pipeline for migrating data from HDFS to Azure Blob storage: 

![Diagram that shows the pricing pipeline](media/data-migration-guidance-hdfs-to-azure-storage/pricing-pipeline.png)

Let's assume the following facts are true: 

- Total data volume is 1 PB.
- Migrate data by using second solution architecture (Data Factory native integration runtime mode).
- 1 PB is divided into 1,000 partitions and each copy moves one partition.
- Each copy activity is configured with one self-hosted integration runtime that's associated to four machines and achieves 500-MBps throughput.
- ForEach concurrency is set to 4 and aggregate throughput is 2 GBps.
- In total, it takes 146 hours to complete the migration.

Here's the estimated price based on our assumptions: 

![Table that shows pricing calculations](media/data-migration-guidance-hdfs-to-azure-storage/pricing-table.png)

> [!NOTE]
> This is a hypothetical pricing example. Your actual pricing depends on the actual throughput in your environment.
> The price for Azure Windows VM (with self-hosted integration runtime installed) isn't included.

### Additional references

- [HDFS connector](https://docs.microsoft.com/azure/data-factory/connector-hdfs)
- [Azure Blob storage connector](https://docs.microsoft.com/azure/data-factory/connector-azure-blob-storage)
- [Azure Data Lake Storage Gen2 connector](https://docs.microsoft.com/azure/data-factory/connector-azure-data-lake-storage)
- [Copy activity performance tuning guide](https://docs.microsoft.com/azure/data-factory/copy-activity-performance)
- [Create and configure a self-hosted integration runtime](https://docs.microsoft.com/azure/data-factory/create-self-hosted-integration-runtime)
- [Self-hosted integration runtime high availability and scalability](https://docs.microsoft.com/azure/data-factory/create-self-hosted-integration-runtime#high-availability-and-scalability)
- [Data movement security considerations](https://docs.microsoft.com/azure/data-factory/data-movement-security-considerations)
- [Store credentials in Azure Key Vault](https://docs.microsoft.com/azure/data-factory/store-credentials-in-key-vault)
- [Copy a file incrementally based on time-partitioned file name](https://docs.microsoft.com/azure/data-factory/tutorial-incremental-copy-partitioned-file-name-copy-data-tool)
- [Copy new and changed files based on LastModifiedDate](https://docs.microsoft.com/azure/data-factory/tutorial-incremental-copy-lastmodified-copy-data-tool)
- [Data Factory pricing page](https://azure.microsoft.com/pricing/details/data-factory/data-pipeline/)

## Next steps

- [Copy files from multiple containers with Azure Data Factory](solution-template-copy-files-multiple-containers.md)