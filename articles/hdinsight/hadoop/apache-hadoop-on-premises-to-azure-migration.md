---
title: On-premises Hadoop eco-system to Azure HDInsight Migration
description: Learn best-practices for migrating on-premises Hadoop clusters to Azure HDInsight.
services: hdinsight
author: ashishthaps
ms.reviewer: hrasheed
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 10/16/2018
ms.author: ashishth
---
# On-premises Hadoop eco-system to Azure HDInsight Migration
# Overview
This paper is the best-practices guide for migrating on-premises Hadoop eco-system deployment to Azure HDInsight. In addition to describing the migration process, it also provides guidance on re-architecting the on-premises Hadoop system to take advantage of the benefits of Azure HDInsight optimized for cloud computing. In addition, the paper covers various topics, including questions designed to gather information critical to the success of the migration.

Several customers have asked for guidance on migrating on-premises Hadoop eco-system deployments to Azure HDInsight. In many of these discussions, it has been helpful to follow a specific process:

1. Understand the current on-premises deployment and topologies.
2.  Understand the current project scope, timelines, and team expertise.
3.  Understand the Azure requirements.
4.  Build out a detailed plan, together with best practices.

The questionnaire that captures information about the on-premises deployment, migration requirements etc: are included in the appendix and the main sections on the paper focuses on migration best practices and processes.

# Audience and Scope 

This guide is for Cloud Architects, Hadoop administrators and DevOps
engineers, who are responsible for the design, deployment and migration
of Apache Hadoop solutions in Azure HDInsight. Software developers, Data
Engineers and Data Scientists should also benefit from it as this will
help to understand how different types of clusters work in the cloud.

# Why to migrate to Azure HDInsight?

Azure HDInsight is a cloud distribution of the Hadoop components from the [Hortonworks Data Platform
(HDP)](https://hortonworks.com/products/data-center/hdp/). Azure HDInsight makes it easy, fast, and cost-effective to process massive amounts of data. The most popular open-source frameworks such as Hadoop, Spark, Hive, LLAP, Kafka, Storm, R, and HBase can be used with theHDInsight. 

## Advantages that Azure HDInsight offers over on-premises Hadoop
- **Low-cost** - Costs can be reduced by [creating clusters on demand](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-create-linux-clusters-adf) and paying only for what you use. Decoupled compute and storage provides flexibility to not depend on the data volume in order to determine the cluster size.
- **Automated cluster provisioning** - The cluster provisioning can easily be automated and is helpful when provisioning on-demand clusters. Setup and configuration required for the clusters are very minimal as well.
- **Managed hardware and configuration** - There is no need to worry about the physical hardware or space needed for the infrastructure with the HDInsight cluster. Just specify the configuration of the cluster, and Azure allocates  resources for the cluster.
- **Easily Scalable** - HDInsight enables you to [scale](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-administer-use-portal-linux) workloads up or down and takes care of data re-distribution, workload rebalancing etc: without interrupting the jobs.
- **Global availability** -  HDInsight is available in more [regions](https://azure.microsoft.com/regions/services/)than any other big data analytics offering. Azure HDInsight is also available in Azure Government, China, and Germany, which allows you to meet your enterprise needs in key sovereign areas.
- **Secure and compliant** - HDInsight enables you to protect your enterprise data assets
with [Azure Virtual Network](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-extend-hadoop-virtual-network), [encryption](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-create-linux-clusters-with-secure-transfer-storage), and integration with [Azure Active Directory](https://docs.microsoft.com/en-us/azure/hdinsight/domain-joined/apache-domain-joined-introduction).
HDInsight also meets the most popular industry and government [compliance standards](https://azure.microsoft.com/overview/trusted-cloud).
- **Simplified version management** - Azure HDInsight manages Hadoop eco-system components versions and
keep them up to date as much as possible, which is usually a complex process at on-premises deployments.
- **Smaller workload optimized specific clusters with less dependencies between components** -  A typical on-premises Hadoop setup uses a single cluster that serves many purposes. With Azure HDInsight, multiple smaller workload specific clusters can be created. This removes the complexity of maintaining a single cluster with growing complexity.
- **Productivity** - Azure HDInsight enables to use rich productive tools for Hadoop and Spark components with your preferred development environments and popular notebooks.
- **Extensibility with custom tools or third-party Applications** - HDInsight clusters can be extended with installed components and enables seamless integration with the most popular big data solutions with a [one-click](https://azure.microsoft.com/services/hdinsight/partner-ecosystem/) deployment from the Azure Market place.
- **Easy Management, Administration and Monitoring** - Azure HDInsight integrates with [Azure Log
Analytics](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-oms-log-analytics-tutorial) to
provide a single interface with which you can monitor all your clusters.
- **Integration with other Azure services** - HDInsight can easily be integrated with other popular Azure services including Azure Data Factory(ADF), Azure Blob, Azure Data Lake Store Gen2, Azure Cosmos DB, Azure SQL Database and Azure Analysis Services.
- **Self-healing processes and components** - HDInsight constantly checks the infrastructure as well as open source components using its own monitoring infrastructure. It also automatically recovers critical failures such as open source component down, nodes down and other health issues. Alerts are triggered in Ambari if any OSS component is failed.

For more information, see the article [What is Azure HDInsight and the Hadoop technology stack](https://docs.microsoft.com/en-us/azure/hdinsight/hadoop/apache-hadoop-introduction). 

# Proposed Azure HDInsight Architecture and Migration Best practices

Migrating from an on-premises Hadoop solution to Azure HDInsight requires a change in approach. A typical on-premises Hadoop infrastructure consists of a single large cluster that supports many
workloads. This often results in a complex system requiring compromises to get everything working in the single cluster. This can be simplified using Azure HDInsight but requires a change in approach to structure the data and jobs.

Below are some of the migration best practices as per the recommended Azure HDInsight Architecture.

- **Use multiple workload optimized clusters rather than using a single large cluster** - Since HDInsight clusters are designed for the specific type of compute usage and since the storage can be shared across multiple clusters, it is a good practice to create multiple workload optimized compute clusters to meet the needs of different jobs. Each cluster type is tuned with the optimized configuration for the best performance for specific workloads. The below table lists the supported cluster types in HDInsight and the corresponding workloads.

  **Workload**                                            **HDInsight Cluster type**
  ------------------------------------------------------- ----------------------------------
  Batch processing (ETL / ELT)                            Hadoop, Spark
  Data warehousing                                        Hadoop, Spark, Interactive Query
  IoT / Streaming                                         Kafka, Storm, Spark
  NoSQL Transactional processing                          HBase
  Interactive and Faster queries with in-memory caching   Interactive Query
  Data Science                                            ML Services, Spark

The following table shows the different methods that can be used to
create HDInsight cluster.

  **Tool**                                                                                                                                    **Browser based**   **Command Line**   **REST API**   **SDK**
  ------------------------------------------------------------------------------------------------------------------------------------------- ------------------- ------------------ -------------- ---------
  [Azure portal](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-create-linux-clusters-portal)                                                                                    
  [Azure Data Factory](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-create-linux-clusters-adf)                                                                                 
  [Azure CLI (ver 1.0)](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-create-linux-clusters-azure-cli)                                                                          
  [Azure PowerShell](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-create-linux-clusters-azure-powershell)                                                                      
  [cURL](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-create-linux-clusters-curl-rest)                                                                                         
  [.NET SDK](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-create-linux-clusters-dotnet-sdk)                                                                                    
  Python SDK                                                                                                                                                                                        
  Java SDK                                                                                                                                                                                          
  [Azure Resource Manager templates](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-create-linux-clusters-arm-templates)                                                         

For more information, see the article [Cluster types in HDInsight](https://docs.microsoft.com/en-us/azure/hdinsight/hadoop/apache-hadoop-introduction)
------------------------------------------------------------------------------------------------------------------------------------------------------

## Use Transient on-demand clusters 

For many of the HDInsight clusters, there are large periods of time that the cluster is not being used for processing. HDInsight supports on-demand transient clusters which can be deleted once the workload has been successfully completed. This helps to save cost on the cluster compute resources.

Deleting a cluster does not delete the storage account and external metadata associated with the cluster. The cluster can be re-created using the same storage accounts and the same metastores, when
needed. 

Azure Data Factory can be used to create the on-demand HDInsight cluster and also gives the option to schedule the cluster creation jobs at a specific time.

For more information, see the article [Create on-demand Hadoop clusters in HDInsight using Azure Data Factory](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-create-linux-clusters-adf)
===========================================================================================================================================================================================================

## Decouple Storage from Compute 

The typical on-premises Hadoop deployments co-locate storage and compute. As a result, compute and storage must be scaled together and cluster must be persisted for data access.

On HDInsight cluster, storage does not need to be co-located with compute and can either be in Azure storage, Azure Data Lake store or both. Decoupling storage from compute has the following benefits.

- Data sharing across multiple clusters
- Ability to have transient clusters since the data is not dependent
    on cluster

- Reduced storage cost

- Scaling storage and compute separately

- Capability to replicate data across Regions

> The implied performance cost of not co-locating compute clusters and
> storage resources is mitigated by the way the compute clusters are
> created close to the storage account resources inside the Azure
> region, where the high-speed network makes it efficient for the
> compute nodes to access the data inside Azure storage.

- Choosing the right Storage system for HDInsight cluster
    -------------------------------------------------------

> The on-premises HDFS directory structure can be re-created on one of
> the following storage systems. All of the below storage systems enable
> to safely delete HDInsight clusters that are used for computation
> without losing user data. They can be used as both default file system
> and additional file system. The HDInsight cluster and the storage
> account must be hosted in the same region.

- **Azure storage **

> HDInsight can use the blob container in Azure Storage as the default
> file system or additional file system for the cluster. The Standard
> tier storage account is supported, and the Premier tier is not
> supported with HDInsight clusters. The default Blob container stores
> cluster-specific information such as job history and logs. Sharing one
> blob container as the default file system for multiple clusters is not
> supported.
>
> The storage accounts that are defined in the creation process and
> their keys are stored in %HADOOP\_HOME%/conf/core-site.xml on the
> cluster nodes and can also be accessed under "custom core site"
> section in HDFS configs from Ambari. The storage account key is
> encrypted by default and a custom decryption script is used to decrypt
> the keys before being passed on to Hadoop daemons. The jobs including
> Hive, MapReduce, Hadoop streaming, and Pig, carry a description of
> storage accounts and metadata with them. 
>
> Azure storage can be geo-replicated. Although this gives the
> geographic recovery and data redundancy, a failover to the
> geo-replicated location severely impacts the performance, and it may
> incur additional costs. The recommendation is to choose the
> geo-replication wisely and only if the value of the data is worth the
> additional cost.
>
> One of the below formats can be used to access data that is stored in
> Azure Storage

- wasb:///: Access default storage using unencrypted communication.

- wasbs:///: Access default storage using encrypted communication.

- wasb://\<container-name\>@\<account-name\>.blob.core.windows.net/:
    Used when communicating with a non-default storage account. 

> [Azure Storage Scalability and Performance
> Targets](https://docs.microsoft.com/en-us/azure/storage/common/storage-scalability-targets)
> lists the current limits on the Azure storage accounts. If the needs
> of the application exceed the scalability targets of a single storage
> account, the application can be built to use multiple storage accounts
> and then partition data objects across those storage accounts.
>
> [Azure Storage
> Analytics](https://docs.microsoft.com/en-us/azure/storage/storage-analytics) provides
> metrics for all storage services and Azure portal can be configured
> collect metrics to be visualized through charts. Alerts can be created
> to notify when thresholds have been reached for storage resource
> metrics.
>
> Azure Storage offers [soft delete for blob
> objects](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blob-soft-delete)
> so as to easily recover data when it is erroneously modified or
> deleted by an application or other storage account user.
>
> The
> [snapshot](https://docs.microsoft.com/en-us/rest/api/storageservices/creating-a-snapshot-of-a-blob)
> of a blob can be created. A snapshot is a read-only version of a blob
> that\'s taken at a point in time. Once a snapshot has been created, it
> can be read, copied, or deleted, but not modified. Snapshots provide a
> way to back up a blob as it appears at a moment in time.

**Note**: For older version of on-premises on-premises Hadoop
Distributions that does not have the "wasbs" certificate, it needs to be
imported to the Java truststore. Below are the sample commands that can
be used for this after replacing storage account with your storage
account.

- Download the Azure Blob ssl cert to a file

> echo -n \| openssl s\_client -connect
> \<storage-account\>.blob.core.windows.net:443 \| sed -ne \'/-BEGIN
> CERTIFICATE-/,/-END CERTIFICATE-/p\' \> Azure\_Storage.cer
>
>  

- Import the above file to the Java truststore on all the nodes

> keytool -import -trustcacerts -keystore
> /path/to/jre/lib/security/cacerts -storepass changeit -noprompt -alias
> blobtrust -file Azure\_Storage.cer

- Verify that the added cert is in the truststore

    keytool -list -v -keystore /path/to/jre/lib/security/cacerts

For more information, see the following articles 
=================================================

- [Use Azure storage with Azure HDInsight clusters](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-use-blob-storage)
    =====================================================================================================================================

- [Azure Storage Scalability and Performance
    Targets](https://docs.microsoft.com/en-us/azure/storage/common/storage-scalability-targets)

- [Microsoft Azure Storage Performance and Scalability Checklist](https://docs.microsoft.com/en-us/azure/storage/common/storage-performance-checklist)
    ====================================================================================================================================================

- [Monitor, diagnose, and troubleshoot Microsoft Azure Storage](https://docs.microsoft.com/en-us/azure/storage/common/storage-monitoring-diagnosing-troubleshooting)
    ==================================================================================================================================================================

- [Monitor a storage account in the Azure portal](https://docs.microsoft.com/en-us/azure/storage/common/storage-monitor-storage-account)
    ======================================================================================================================================

<!-- -->

- **Azure Data Lake Store Gen1**

> Azure Data Lake Store implements HDFS and POSIX style access control
> model. It provides first class integration with AAD to fine grained
> access control and there are no limits to the size of data and the
> ability to run massively parallel analytics.
>
> One of the below formats can be used to access data that is stored in
> ADLS Gen1

- adl:///: Access the default Data Lake Store for the cluster.

- adl://\<storage-name\>.azuredatalakestore.net/: Used when
    communicating with a non-default Data Lake Store.

> When HDInsight is deployed with Data Lake Store as default storage,
> the cluster-related files are stored in Data Lake Store in the
> following location:
>
> adl://mydatalakestore/\<cluster\_root\_path\>/
>
> where \<cluster\_root\_path\> is the name of a folder you create in
> Data Lake Store. By specifying a root path for each cluster, the same
> Data Lake Store account can be used for more than one cluster.
>
> To be able to use a Data Lake Store as default storage, an Azure
> Active directory
>
> service principal must be granted with access to the following paths:

- The Data Lake Store account root. For example:
    adl://mydatalakestore/.

- The folder for all cluster folders. For example:
    adl://mydatalakestore/clusters.

- The folder for the cluster. For example:
    adl://mydatalakestore/clusters/cluster1storage.

> Only an Azure AD administrator can create an AAD service principal.
> The service principal must be created with a certificate. More than
> one Data Lake Store accounts could be added to an HDInsight cluster by
> giving permission to the service principal to the Data Lake Store
> accounts.
>
> Note: Adding Azure Data Lake Store as [additional]{.underline} storage
> to an [existing]{.underline} HDInsight cluster is not a supported
> scenario.
>
> ADLS Gen1 is currently available in the following Regions

- East US 2

- Central US

- North Europe

- West Europe

> For more information, see the following articles

- [Create HDInsight clusters with Data Lake Store by using the Azure
    portal](https://docs.microsoft.com/en-us/azure/data-lake-store/data-lake-store-hdinsight-hadoop-use-portal)

- [Use Data Lake Store with Azure HDInsight
    clusters](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-use-data-lake-store)

<!-- -->

- **Azure Data Lake Storage Gen2 (Preview)**

> Azure Data Lake Storage Gen2 is the latest storage offering and is in
> Preview at the time of writing of this paper. It unifies the core
> capabilities from the first generation of Azure Data Lake store with a
> Hadoop compatible file system endpoint directly integrated into Azure
> Blob Storage. This enhancement combines the scale and cost benefits of
> object storage with the reliability and performance typically
> associated only with on-premises file systems.
>
> ADLS Gen 2 is built on top of [Azure Blob
> storage](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction)
> and allows to interface with data using both file system and object
> storage paradigms. Features from [Azure Data Lake Storage
> Gen1](https://docs.microsoft.com/en-us/azure/data-lake-store/index),
> such as file system semantics, file-level security and scale are
> combined with low-cost, tiered storage, high availability/disaster
> recovery capabilities and a large SDK/tooling ecosystem from [Azure
> Blob
> storage](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction).
> In Data Lake Storage Gen2, all the qualities of object storage remain
> while adding the advantages of a file system interface optimized for
> analytics workloads.
>
> A fundamental feature of Data Lake Storage Gen2 is the addition of
> a [hierarchical
> namespace](https://docs.microsoft.com/en-us/azure/storage/data-lake-storage/namespace) to
> the Blob storage service which organizes objects/files into a
> hierarchy of directories for performant data access. The hierarchical
> structure enables operations such as renaming or deleting a directory
> to be single atomic metadata operations on the directory rather than
> enumerating and processing all objects that share the name prefix of
> the directory.
>
> In the past, cloud-based analytics had to compromise in areas of
> performance, management, and security. Below are the Key features of
> Data Lake Storage Gen2.

- **Hadoop compatible access**: Data Lake Storage Gen2 allows you to
    manage and access data just as you would with a [Hadoop Distributed
    File System
    (HDFS)](http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html).
    The new [ABFS
    driver](https://docs.microsoft.com/en-us/azure/storage/data-lake-storage/abfs-driver) is
    available within all Apache Hadoop environments, including [Azure
    HDInsight](https://docs.microsoft.com/en-us/azure/hdinsight/index) to
    access data stored in Data Lake Storage Gen2.

- **A superset of POSIX permissions**: The security model for Data
    Lake Gen2 fully supports ACL and POSIX permissions along with some
    extra granularity specific to Data Lake Storage Gen2. Settings may
    be configured through admin tools or through frameworks like Hive
    and Spark.

- **Cost effective**: Data Lake Storage Gen2 features low-cost storage
    capacity and transactions. As data transitions through its complete
    lifecycle, billing rates change keeping costs to a minimum via
    built-in features such as [Azure Blob storage
    lifecycle](https://docs.microsoft.com/en-us/azure/storage/common/storage-lifecycle-managment-concepts).

- **Works with Blob storage tools, frameworks, and apps**: Data Lake
    Storage Gen2 continues to work with a wide array of tools,
    frameworks, and applications that exist today for Blob storage.

- **Optimized driver**: The abfs driver is [optimized
    specifically](https://docs.microsoft.com/en-us/azure/storage/data-lake-storage/abfs-driver) for
    big data analytics. The corresponding REST APIs are surfaced through
    the dfs endpoint, dfs.core.windows.net.

> One of the below formats can be used to access data that is stored in
> ADLS Gen2

- abfs:///: Access the default Data Lake Store for the cluster.

- abfs\[s\]://file\_system\@account\_name.dfs.core.windows.net: Used
    when communicating with a non-default Data Lake Storage.

For more information, see the following articles
================================================

- [Introduction to Azure Data Lake Storage Gen2 Preview](https://docs.microsoft.com/en-us/azure/storage/data-lake-storage/introduction)
    =====================================================================================================================================

- <https://docs.microsoft.com/en-us/azure/storage/data-lake-storage/abfs-driver>

## Protect Azure Storage key visibility within the on-premises Hadoop cluster config

The Azure storage key added to the Hadoop config files to establish connectivity between on premises HDFS and Azure Blob storage can be protected by encrypting it with Hadoop credential provider framework. This securely stores the credentials and allows to securely access them.

**To provision the credentials:**

hadoop credential create
fs.azure.account.key.account.blob.core.windows.net -value \<storage
key\> -provider
jceks://hdfs\@headnode.xx.internal.cloudapp.net/path/to/jceks/file

**To add the above provider path to the core-site.xml or to the Ambari configs under custom core-site: **

\<property\>\
\<name\>hadoop.security.credential.provider.path\</name\>\
\<value\>
jceks://hdfs\@headnode.xx.internal.cloudapp.net/path/to/jceks
\</value\>\
\<description\>Path to interrogate for protected
credentials.\</description\>\
\</property\>

**The provider path property can also be added to the distcp command
line instead of storing key at cluster level at core-site.xml as
below. **

hadoop distcp -D hadoop.security.credential.provider.path=
jceks://hdfs\@headnode.xx.internal.cloudapp.net/path/to/jceks
/user/user1/ wasb:<//yourcontainer@youraccount.blob.core.windows.net/>user1

## Restrict access to Azure storage data using SAS signatures
    ----------------------------------------------------------

HDInsight by default has full access to data in the Azure Storage accounts associated with the cluster. Shared Access Signatures (SAS) on the blob container can be used to restrict access to the data, such as provide users with read-only access to the data.

**Using the SAS token created with python**

1.  Open the
    [SASToken.py](https://github.com/Azure-Samples/hdinsight-dotnet-python-azure-storage-shared-access-signature/blob/master/Python/SASToken.py)
    file and change the following values:
    - policy\_name: The name to use for the stored policy to create.
    - storage\_account\_name: The name of your storage account.
    - storage\_account\_key: The key for the storage account.
    - storage\_container\_name: The container in the storage account that you want to restrict access to.
    - example\_file\_path: The path to a file that is uploaded to the container
2.  The SASToken.py file comes with the "ContainerPermissions.READ + ContainerPermissions.LIST" permissions and can be adjusted based on the use case.
3.  Execute the script as below. python SASToken.py
4.  It displays the SAS token similar to the following text when the script completes:

    sr=c&si=policyname&sig=dOAi8CXuz5Fm15EjRUu5dHlOzYNtcK3Afp1xqxniEps%3D&sv=2014-02-14

5.  To use a Shared Access Signature as to limit access to a container, add a custom entry to the core-site configuration for the cluster under Ambari HDFS Configs Advanced Custom core-site Add property.
6.  Use the following values for the **Key** and **Value** fields:

> **Key**: fs.azure.sas.YOURCONTAINER.YOURACCOUNT.blob.core.windows.net
>
> **Value**: The SAS KEY returned by the Python application FROM step 4
> above

7.  Click the Add button to save this key and value, then click the Save button to save the configuration changes. When prompted, add a description of the change (\"adding SAS storage access\" for example) and then click Save.
8.  In the Ambari web UI, select HDFS from the list on the left, and then select Restart All Affected from the Service Actions drop down list on the right. When prompted, select Confirm Restart All.
9.  Repeat this process for MapReduce2 and YARN.
10. When the SAS tokens are generated with "READ + LIST" permissions, the users won't be able to "write and delete" data from Blob containers and will show messages like the below when either write
or delete operations are attempted.

    "This request is not authorized to perform this operation"

> **Note**: When the SAS tokens are generated with "READ + LIST + WRITE"
> permissions (to restrict "DELETE" only), the caveat is that the writes
> like "hadoop fs -put" first writes to a "\_COPYING\_" file and then
> tries to renames this file which always maps to a "copy+delete" for
> WASB. Since the "DELETE" permission was not provided, the "put" would
> fail. The "\_COPYING" operation is a Hadoop feature (poor man\'s
> concurrency control) and so currently there is no way to restrict just
> the "DELETE" operation without affecting the "WRITE" operations.
>
> **Note**: Unfortunately, the hadoop credential provider and decryption
> key provider(ShellDecryptionKeyProvider) currently do not work with
> the SAS tokens and so it currently cannot be protected from
> visibility.
>
> For more information, see the article
> https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-storage-sharedaccesssignature-permissions

## Use Data encryption and Replication
    -----------------------------------

All data written to Azure Storage is automatically encrypted using [Storage Service Encryption (SSE)](https://docs.microsoft.com/en-us/azure/storage/common/storage-service-encryption). The data in the Azure storage account is always replicated to ensure durability and high availability. When a storage account is created, one of the following replication options can be selected:

- [Locally redundant storage (LRS)](https://docs.microsoft.com/en-us/azure/storage/common/storage-redundancy-lrs)
- [Zone-redundant storage (ZRS)](https://docs.microsoft.com/en-us/azure/storage/common/storage-redundancy-zrs)
- [Geo-redundant storage (GRS)](https://docs.microsoft.com/en-us/azure/storage/common/storage-redundancy-grs)
- [Read-access geo-redundant storage (RA-GRS)](https://docs.microsoft.com/en-us/azure/storage/common/storage-redundancy-grs#read-access-geo-redundant-storage)
Azure Data Lake Store provides locally-redundant storage (LRS) but it is recommended to copy the critical data to another Data Lake Store account in another region with a frequency aligned to the needs of the disaster recovery plan. There are a variety of methods to copy data including [ADLCopy](https://docs.microsoft.com/en-us/azure/data-lake-store/data-lake-store-copy-data-azure-storage-blob), DistCp, [Azure PowerShell](https://docs.microsoft.com/en-us/azure/data-lake-store/data-lake-store-get-started-powershell) or [Azure Data Factory](https://docs.microsoft.com/en-us/azure/data-factory/connector-azure-data-lake-store). It is also recommended to enforce access policies for Data Lake Store account to prevent accidental deletion.

For more information, see the following articles:
=================================================

- [Azure storage replication](https://docs.microsoft.com/en-us/azure/storage/common/storage-redundancy)
- [Disaster guidance for ADLS](https://docs.microsoft.com/en-us/azure/data-lake-store/data-lake-store-disaster-recovery-guidance)

## Attaching additional Azure storage accounts to the cluster
    ----------------------------------------------------------
During the HDInsight creation process, an Azure Storage account or Azure Data Lake storage account is designated as the default file system. In addition to this default storage account, additional storage accounts can be added from the same Azure subscription or different Azure subscriptions during the cluster creation process or after a cluster has been provisioned.

Additional storage account can be added in one on the following ways:
- Ambari HDFS Config Advanced Custom core-site Add the storage Account Name and key Restarting the services
- Using [Script action](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-add-storage)
    by passing the storage account name and key

>[!Note]
>In valid use-cases, the limits on the Azure storage can be increased via a request made to [Azure Support](https://azure.microsoft.com/support/faq/).

For more information, see the following articles:
- [Add additional storage accounts to HDInsight](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-add-storage)
- [Attach additional Azure storage accounts to the cluster](https://blogs.msdn.microsoft.com/ashish/2016/08/25/hdinsight-attach-additional-azure-storage-accounts/)

## Plan well for the capacity needed for HDInsight clusters
    --------------------------------------------------------

The key things to identify for HDInsight cluster capacity planning are:

- **Choose the Region** - The Azure region determines where the cluster is physically provisioned. To minimize the latency of reads and writes, the cluster should be near in the same Region as the Region where data (storage account) is located.
- **Choose storage location and size**

> The default storage must be in the same Region as the cluster. For a
> 48-node cluster it is recommended to have 4 to 8 storage accounts.
> Although there may already be sufficient total storage, each storage
> account provides additional networking bandwidth for the compute
> nodes.
>
> When there are multiple storage accounts, use a random name for each
> storage account, without a prefix. The purpose of random naming is
> reducing the chance of storage bottlenecks (throttling) or common-mode
> failures across all accounts. For better performance, use only one
> container per storage account.

- **Choose the VM size and type (now supports the G-series)**

> Each cluster type has a set of node types, and each node type has
> specific options for their VM size and type.
>
> The VM size and type is determined by CPU processing power, RAM size,
> and network latency. A simulated workload can be used to determine the
> optimal VM size and type for each node types.

- **Choose the number of worker nodes**

    The initial number of worker nodes can be determined using the
    simulated workloads. The cluster can be scaled later by adding more
    worker nodes to meet peak load demands. Th cluster can later be
    scaled back when the additional worker nodes are not required.

For more information, see the article [Capacity planning for HDInsight clusters](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-capacity-planning)
==============================================================================================================================================================

- Use the recommended Virtual Machine types for Cluster Nodes
    -----------------------------------------------------------

> The following table lists the recommended and default Virtual Machine
> types for the cluster Nodes supported regions except [Brazil South and
> Japan
> West](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-component-versioning#default-node-configuration-and-virtual-machine-sizes-for-clusters).

  **Node type**   **Cluster type**                                                                                                                                                
  --------------- ------------------------------- ------------------------------- ------------------------------- ------------------------------- ------------------------------- -------------------------------
                  **Hadoop**                      **HBase**                       **Interactive Query**           **Storm**                       **Spark**                       **ML Server**
  Head            D3 v2, D4 v2, D12 v2            D3 v2, D4 v2, D12 v2            D13, D14                        A4 v2, A8 v2, A2m v2            D12 v2, D13 v2, D14 v2          D12 v2, D13 v2, D14 v2
  Worker          D3 v2, D4 v2, D12 v2            D3 v2, D4 v2, D12 v2            D13, D14                        D3 v2, D4 v2, D12 v2            D4 v2, D12 v2, D13 v2, D14 v2   D4 v2, D12 v2, D13 v2, D14 v2
  Zookeeper                                       A4 v2, A8 v2, A2m v2                                            A2 v2, A4 v2, A8 v2                                              
  Edge            D4 v2, D12 v2, D13 v2, D14 v2   D4 v2, D12 v2, D13 v2, D14 v2   D4 v2, D12 v2, D13 v2, D14 v2   D4 v2, D12 v2, D13 v2, D14 v2   D4 v2, D12 v2, D13 v2, D14 v2   D4 v2, D12 v2, D13 v2, D14 v2

**Note**: If the cluster needs more than 32 worker nodes, head node VM
should have at least 8 cores and 14 GB of RAM.

- Check the availability of Hadoop components in HDInsight
    --------------------------------------------------------

    Each HDInsight version is a cloud distribution of a version of
    Hortonworks Data Platform (HDP) and consists of a set of Hadoop
    eco-system components. The below table lists the components and
    their versions associated with HDInsight cluster v3.6. This can be
    used to identify the on-premises components that are not currently
    available in HDInsight.

  **Component**               **Version**
  --------------------------- ---------------------
  Hortonworks Data Platform   2.6
  Apache Hadoop and YARN      2.7.3
  Apache Tez                  0.7.0
  Apache Pig                  0.16.0
  Apache Hive and HCatalog    1.2.1
  Apache Hive2                2.1.0
  Apache Tez Hive2            0.8.4
  Apache Ranger               0.7.0
  Apache HBase                1.1.2
  Apache Sqoop                1.4.6
  Apache Oozie                4.2.0
  Apache Zookeeper            3.4.6
  Apache Storm                1.1.0
  Apache Mahout               0.9.0+
  Apache Phoenix              4.7.0
  Apache Spark                2.3.0, 2.2.0, 2.1.0
  Apache Livy                 0.4
  Apache Kafka                1.1, 1.0, 0.10.1
  Apache Ambari               2.6.0
  Apache Zeppelin             0.7.0
  Mono                        4.2.1
  Apache Slider               0.92.0

> Ambari UI or Ambari REST API could also be used to check the Hadoop
> components and versions in HDInsight.
>
> Applications or components that were available in On-premises clusters
> but are not part of the HDInsight clusters can be added on an Edge
> Node or on a VM in the same VNet as HDI cluster. A third-party Hadoop
> application that is not available on Azure HDInsight can be installed
> from the "Applications" option in HDInsight cluster. The custom hadoop
> applications can be installed on HDInsight cluster using the "script
> actions". Below table lists some of the common applications and their
> HDInsight integration options.

  **Application**         **Integration **
  ----------------------- -----------------------------------------
  Airflow                 IaaS or HDI Edge node
  Alluxio                 IaaS  
  Arcadia                 IaaS 
  Atlas                   None (Only HDP)
  Datameer                HDI Edge node
  Datastax (Cassandra)    IaaS (CosmosDB an alternative on Azure)
  DataTorrent             IaaS 
  Drill                   IaaS 
  Ignite                  IaaS
  Jethro                  IaaS 
  Mapador                 IaaS 
  Mongo                   IaaS (CosmosDB an alternative on Azure)
  NiFi                    IaaS 
  Presto                  IaaS or HDI Edge node
  Python 2                PaaS 
  Python 3                PaaS 
  R                       PaaS 
  SAS                     IaaS 
  Vertica                 IaaS (SQLDW an alternative on Azure)
  Tableau                 IaaS 
  Waterline               HDI Edge node
  StreamSets              HDI Edge 
  Palantir                IaaS 
  Sailpoint               Iaas 

> For more information, see the article [Hadoop components available
> with different HDInsight
> versions](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-component-versioning#hadoop-components-available-with-different-hdinsight-versions)

- Customize HDInsight clusters using script actions
    -------------------------------------------------

> HDInsight provides a configuration method called script actions that
> invokes custom scripts to customize the cluster. These scripts are
> used to install additional components and change configuration
> settings. Script actions can be used during or after cluster creation.
>
> A script action is Bash script that runs on the nodes in an HDInsight
> cluster. Script must be stored on a URI that is accessible from the
> HDInsight cluster. The script can be restricted to run on only certain
> node types.
>
> The script can be persisted or executes as ad hoc. The
> persisted scripts are used to customize new worker nodes added to the
> cluster through scaling operations. A persisted script might also
> apply changes to another node type, such as a head node, when scaling
> operations occur.
>
> HDInsight provides scripts to install the following components on
> HDInsight clusters: (provide the scripts but are not supported, same
> on components)

- Add an Azure Storage account

- Install Hue

- Install Presto

- Install Solr

- Install Giraph

- Pre-load Hive libraries

- Install or update Mono

    **Note**: HDInsight does not provide direct support for the custom
    hadoop components as well as the components installed using script
    action.

    Script actions can also be published to the Azure Marketplace as an
    HDInsight application. The

> For more information, see the following articles

- [Install third-party Hadoop Applications on HDInsight](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apps-install-applications)
    --------------------------------------------------------------------------------------------------------------------------------------------

- [Customize HDInsight clusters using script actions](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-customize-cluster-linux)
    ==============================================================================================================================================

- [Publish an HDInsight application in the Azure Marketplace](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apps-publish-applications)
    =================================================================================================================================================

<!-- -->

- Customize HDInsight configs using Bootstrap
    -------------------------------------------

> Changes to configs in the config files such as core-site.xml,
> hive-site.xml and oozie-env.xml can be made using boostrap. Below is
> an example using Powershell.
>
> For more information, see the article [Customize HDInsight clusters
> using
> Bootstrap](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-customize-cluster-bootstrap)

- Use edge nodes on Hadoop clusters in HDInsight to access the client tools
    -------------------------------------------------------------------------

> An empty edge node is a Linux virtual machine with the same client
> tools installed and configured as in the headnodes, but with no Hadoop
> services running. The edge node can be used

- for accessing the cluster

- testing client applications

- hosting client applications

> Edge node can be used during or after cluster creation. After the edge
> node has been created, users can connect to the edge node using SSH,
> and run client tools (eg: beeline, hive) to access the Hadoop cluster
> in HDInsight. The edge node ssh endpoint is
> \<EdgeNodeName\>.\<ClusterName\>-ssh.azurehdinsight.net:22. The edge
> node can be deleted from the Azure portal.
>
> For more information, see the article [Use empty edge nodes on Hadoop
> clusters in
> HDInsight](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apps-use-edge-node)

- Use the Scale-up and Scale-down feature of Cluster
    --------------------------------------------------

    HDInsight provides elasticity by giving you the option to scale up
    and scale down the number of worker nodes in your clusters. This
    allows you to shrink a cluster after hours or on weekends and expand
    it during peak business demands.

> Cluster scaling can be automated with the

- PowerShell cmdlet 

    Set-AzureRmHDInsightClusterSize -ClusterName \<Cluster Name\>
    -TargetInstanceCount \<NewSize\>

- Azure CLI

    azure hdinsight cluster resize \[options\] \<clusterName\> \<Target
    Instance Count\>

- Azure Portal Scale cluster

> When you add nodes to your running HDInsight cluster, any pending or
> running jobs will not be impacted. In addition, new jobs can be safely
> submitted while the scaling process is running. If the scaling
> operations fail for any reason, the failure is gracefully handled,
> leaving the cluster in a functional state.
>
> However, if you are scaling down your cluster by **r**emoving nodes,
> any pending or running jobs will fail when the scaling operation
> completes. This failure is due to some of the services restarting
> during the process. To address this issue, you can wait for the jobs
> to complete before scaling down your cluster, manually terminate the
> jobs, or resubmit the jobs after the scaling operation has concluded.
>
> If you shrink your cluster down to the minimum of one worker node, as
> shown in the previous image, HDFS may become stuck in safe mode when
> worker nodes are rebooted due to patching, or immediately after the
> scaling operation. You can execute a command to bring HDFS out of safe
> mode.
>
> hdfs dfsadmin -D \'fs.default.name=hdfs://mycluster/\' -safemode leave
>
> After leaving safe mode, you can manually remove the temporary files,
> or wait for Hive to eventually clean them up automatically.

For more information, see the article [Scale HDInsight clusters](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-scaling-best-practices)
===================================================================================================================================================

- Use HDInsight with Azure Virtual Network
    ----------------------------------------

> Azure Virtual Network enables the Azure resources, such as Azure
> Virtual Machines, to securely communicate with each other, communicate
> with the internet and on-premises networks, filtering and routing
> network traffic and connecting different virtual networks.
>
> Using Azure Virtual Network with HDInsight enables the following
> scenarios:

- Connecting to HDInsight directly from an on-premises network.

- Connecting HDInsight to data stores in an Azure Virtual network.

- Directly accessing Hadoop services that are not available publicly
    > over the internet. For example, Kafka APIs or the HBase Java API.

> HDInsight can either be added to a new or existing Azure Virtual
> Network. If HDInsight is being added to an existing Virtual Network,
> the existing network security groups and user-defined routes need to
> be updated to allow unrestricted access to [several IP
> addresses](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-extend-hadoop-virtual-network#hdinsight-ip-1)
> in the Azure data center. Also, make sure not to block traffic to the
> [ports](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-extend-hadoop-virtual-network#hdinsight-ports)
> which are being used by HDInsight services.
>
> **Note**: HDInsight does not currently support forced tunneling.
> Forced tunneling is a subnet setting that forces outbound Internet
> traffic to a device for inspection and logging. Either remove forced
> tunneling before installing HDInsight into a subnet or create a new
> subnet for HDInsight. HDInsight also does not support restricting
> outbound network connectivity

For more information, see the following articles
================================================

- [Azure virtual-networks-overview](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview)
    ===================================================================================================================

- [Extend Azure HDInsight using an Azure Virtual Network](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-extend-hadoop-virtual-network)
    =================================================================================================================================================

<!-- -->

## Use Azure Virtual Network Service Endpoints to securely connect to other Azure Services
    ---------------------------------------------------------------------------------------

> HDInsight supports [Virtual Network Service Endpoints](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-service-endpoints-overview) which allows customers to securely connect to Azure Blob Storage, Azure Data Lake Storage Gen2, Cosmos DB and SQL databases. By enabling a Service Endpoint for Azure HDInsight, traffic flows through a secured route from within the Azure data center. With this enhanced level of security at the networking layer, customers can lock down their big data storage accounts to their specified Virtual Networks (VNETs) and still use HDInsight clusters seamlessly to access and process that data.

For more information, see the following articles
================================================

- [Virtual Network Service Endpoints](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-service-endpoints-overview)
- [Enhance HDInsight security with service endpoints](https://azure.microsoft.com/en-us/blog/enhance-hdinsight-security-with-service-endpoints/)

## Connecting HDInsight to on-premises network
    -------------------------------------------

HDInsight can be connected to the on-premises network by using Azure Virtual Networks and a VPN gateway. Below steps can be followed to establish the connectivity.
- Use HDInsight in an Azure Virtual Network that has connectivity to the on-premises network.
- Configure DNS name resolution between the virtual network and on-premises network.
- Configure network security groups or user-defined routes (UDR) to control network traffic.

 For more information, see the article [Connect HDInsight to your on-premises network](https://docs.microsoft.com/en-us/azure/hdinsight/connect-on-premises-network)

## Use Enterprise Security Package (Domain-joined HDInsight clusters) to secure and govern the cluster
    ---------------------------------------------------------------------------------------------------

The Enterprise Security Package (ESP) supports Active Directory-based authentication, multiuser support, and role-based access control. With the ESP option chosen, HDInsight cluster is joined to the Active Directory domain and the enterprise admin can configure role-based access control (RBAC) for Hive security by using Apache Ranger. The admin can also audit the data access by employees and any changes done to access control policies. 

ESP feature is currently in preview and is available only on the following cluster types: Hadoop, Spark, HBase, Kafka and Interactive Query.

Below are the main to steps to deploy the Domain-joined HDInsight cluster
- Deploy Azure Active Directory (AAD) by passing the Domain name
- Deploy Azure Active Directory Domain Services (AAD DS)
- Create the required Virtual Network and subnet
- Deploy a VM in the Virtual Network to manage AAD DS
- Join the VM to the domain
- Install AD and DNS tools
- Have the AAD DS Administrator create an Organizational Unit (OU)
- Enable LDAPS for AAD DS
- Create a service account in Azure Active Directory with delegated read & write admin permission to the OU, so that it can
    - Join machines to the domain and place machine principals within the OU.
    - Create service principals within the OU that you specify during cluster creation.

> [!Note]
> The service account does not need to be AD domain admin account

- Deploy HDInsight ESP cluster by passing the below parameters
- **Domain name**: The domain name that\'s associated with Azure AD DS.
- **Domain user name**: The service account in the Azure ADDS DC managed domain that you created in the previous section.

> Eg: hdiadmin\@contoso.onmicrosoft.com. This domain user will be the
> administrator of this HDInsight cluster.

- **Domain password**: The password of the service account.

- **Organizational unit**: The distinguished name of the OU that you
    > want to use with the HDInsight cluster.

> Eg: OU=HDInsightOU,DC=contoso,DC=onmicrosoft,DC=com. If this OU does
> not exist, the HDInsight cluster tries to create the OU by using the
> privileges that the service account has.

- **LDAPS URL**: Eg: ldaps://contoso.onmicrosoft.com:636.

- **Access user group**: The security groups whose users you want to
    sync to the cluster.

    Eg: HiveUsers. If you want to specify multiple user groups, separate
    them by semicolon ';'. The group(s) must exist in the directory
    prior to provisioning. 

For more information, see the following articles
------------------------------------------------

- [An introduction to Hadoop security with domain-joined HDInsight
    clusters](https://docs.microsoft.com/en-us/azure/hdinsight/domain-joined/apache-domain-joined-introduction)

- [Plan Azure domain-joined Hadoop clusters in HDInsight](https://docs.microsoft.com/en-us/azure/hdinsight/domain-joined/apache-domain-joined-architecture)
    =========================================================================================================================================================

- [Configure a domain-joined HDInsight cluster by using Azure Active Directory Domain Services](https://docs.microsoft.com/en-us/azure/hdinsight/domain-joined/apache-domain-joined-configure-using-azure-adds)
    =============================================================================================================================================================================================================

- [Synchronize Azure Active Directory users to an HDInsight
    cluster](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-sync-aad-users-to-cluster?toc=%2Fen-us%2Fazure%2Fhdinsight%2Fdomain-joined%2FTOC.json&bc=%2Fen-us%2Fazure%2Fbread%2Ftoc.json)

- [Configure Hive policies in Domain-joined
    HDInsight](https://docs.microsoft.com/en-us/azure/hdinsight/domain-joined/apache-domain-joined-run-hive?toc=%2Fen-us%2Fazure%2Fhdinsight%2Fdomain-joined%2FTOC.json&bc=%2Fen-us%2Fazure%2Fbread%2Ftoc.json)

- [Run Apache Oozie in domain-joined HDInsight Hadoop
    clusters](https://docs.microsoft.com/en-us/azure/hdinsight/domain-joined/hdinsight-use-oozie-domain-joined-clusters)

<!-- -->

- Implement End to end Enterprise Security Management
    ---------------------------------------------------

> The end to end enterprise security can be implemented by integrating
> the below measures.

- **Private and protected data pipeline** (Perimeter level Security):

    Perimeter level Security can be achieved through Azure Virtual
    Networks, Network Security Groups and Gateway service

- **Authentication and authorization for Data Access**

<!-- -->

- ### Create Domain-joined HDI cluster using Azure Active Directory Domain Services. (Enterprise Security Package)

- Use Ambari to provide Role based access to cluster resources for AD
    users

- Use Apache Ranger to set access control policies for Hive at the
    table / column / row level. 

- SSH access to the cluster can be restricted only to the
    administrator.

### 

- **Auditing**

<!-- -->

- view and report all access to the HDInsight cluster resources and
    data. 

- view and report all changes to the access control policies

<!-- -->

- **Encryption**

<!-- -->

- ### Transparent Server-Side encryption using Microsoft managed keys as well as customer managed keys.

- ### In Transit encryption using Client-Side encryption, https and TLS

For more information, see the following articles:
-------------------------------------------------

- [Azure Virtual Networks
    overview](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview)

- [Azure Network Security Groups
    overview](https://docs.microsoft.com/en-us/azure/virtual-network/security-overview)

- [Azure Virtual Network
    peering](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-peering-overview)

- [Azure storage security
    guide](https://docs.microsoft.com/en-us/azure/storage/common/storage-security-guide)

- [Azure Storage Service Encryption at rest](https://docs.microsoft.com/en-us/azure/storage/common/storage-service-encryption)
    ============================================================================================================================

<!-- -->

- Use external metadata stores with HDInsight clusters 
    -----------------------------------------------------

> There are two main metastores that work with HDInsight clusters namely
> Hive and Oozie metastores. The Hive metastore is the central schema
> repository that can be used by data processing engines including
> Hadoop, Spark, LLAP, Presto and Pig. Oozie metastore stores details
> about schedule and status of current and completed Hadoop jobs.
>
> HDInsight uses Azure SQL Database as the Hive and Oozie metastores.
> There are two ways to set up a metastore in HDInsight clusters:

- Default metastore

    - No additional cost

    - Metastore is deleted when the cluster is deleted

    - Metastore is not sharable among different clusters

    - Uses basic Azure SQL DB, which has a 5 DTU limit.

- Custom external metastore

    - specify an external Azure SQL Database as the metastore.

    - Clusters can be created and deleted without losing metadata
        including Hive schema Oozie job details.

    - Single metastore db can be shared with different types of
        clusters

    - Metastore can be scaled up as needed

For more information, see the article: [Use external metadata stores in Azure HDInsight](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-use-external-metadata-stores)
=================================================================================================================================================================================

- Best practices for Hive Metastore
    ---------------------------------

> Below are some general HDInsight Hive metastore best practices:

- Use a custom external metastore whenever possible, as this will help
    > separate compute resources and metadata.

- Start with an S2 tier Azure SQL instance, which provides 50 DTU and
    > 250 GB of storage. If you see a bottleneck, you can scale the
    > database up.

- Ensure that the metastore created for one HDInsight cluster version
    > is not shared with a different HDInsight cluster version.
    > Different Hive versions use different schemas. For example, a
    > metastore cannot be shared with both Hive 1.2 and Hive 2.1
    > clusters.

- Back up the custom metastore periodically.

- Keep the metastore and HDInsight cluster in the same region.

- Monitor the metastore for performance and availability using Azure
    > SQL Database Monitoring tools, such as the Azure portal or Azure
    > Log Analytics.

- Execute "Analyze table" command as required to generate statistics
    > for tables and columns

> Eg: ANALYZE TABLE \[table\_name\] COMPUTE STATISTICS

- Best practices for different types of workloads
    -----------------------------------------------

    - Consider using LLAP cluster for interactive Hive queries with
        improved response time

        [LLAP](https://cwiki.apache.org/confluence/display/Hive/LLAP) is
        a new feature in Hive 2.0 that allows in-memory caching of
        queries. LLAP makes Hive queries much faster, up to [26x faster
        than Hive 1.x in some
        cases](https://hortonworks.com/blog/announcing-apache-hive-2-1-25x-faster-queries-much/).

    - Consider using Spark jobs in place of Hive jobs

    - Consider replacing impala-based queries with LLAP queries

    - Consider replacing MapReduce jobs with Spark jobs

    - Consider replacing low-latency Spark batch jobs using Spark
        Structured Streaming jobs

    - Data orchestration -- consider using Azure Data Factory(ADF) 2.0

    - Consider Ambari for Cluster Management

    - Change data storage from on-premises HDFS to wasb or adls or
        adfs for processing scripts

    - Consider using Ranger RBAC on Hive tables and auditing

    - Consider using CosmosDB in place of MongoDB or Cassandra

- Data Migration from on-premises to Azure
    ----------------------------------------

> There are two main options to migrate data from on-premises to Azure
> environment

1.  Transfer data over network with TLS

    a.  Over internet

    b.  Express Route

2.  Shipping data

    c.  Import / Export service

        - Internal SATA HDDs or SSDs only

        - Encrypted at REST (AES-128 / AES-256)

        - Import job can have up to 10 disks

        - Available in all Public regions & GA

    d.  Data Box

        - Up to 80TB of data per Databox

        - Encrypted at REST (AES-256)

        - Uses NAS protocols and supports common data copy tools

        - Ruggedized hardware

        - Available in US only & Public Preview

> Below table has approximate data transfer duration based on the data
> volume and network bandwidth. The general recommendation is to use
> Data box if the data migration is expected to take more than three
> weeks.

  **Data Qty**   **Network Bandwidth**                               
  -------------- ----------------------- -------------- ------------ -------------
                 **45 Mbps (T3)**        **100 Mbps**   **1 Gbps**   **10 Gbps**
  1 TB           2 days                  1 day          2 hours      14 minutes
  10 TB          22 days                 10 days        1 day        2 hours
  35 TB          76 days                 34 days        3 days       8 hours
  80 TB          173 days                78 days        8 days       19 hours
  100 TB         216 days                97 days        10 days      1 day
  200 TB         1 years                 194 days       19 days      2 days
  500 TB         3 years                 1 years        49 days      5 days
  1 PB           6 years                 3 years        97 days      10 days
  2 PB           12 years                5 years        194 days     19 days

DistCp, Azure Data Factory, AzureCp and third party tools including
WANDisco could be used for data transfer over network. Kafka Mirrormaker
and Sqoop could also be considered for ongoing data transfer from
on-premises to Azure storage systems.

- Performance considerations when using DistCp
    --------------------------------------------

    DistCp is an apache project and uses MapReduce (Map only job) to
    transfer data, handle errors and recover. It assigns a list of
    source files to Map tasks, each of which will copy them to the
    destination. Below are some of the best practices for DistCp's
    performance.

1.  Consider increasing the number of Mappers

> DistCp makes an attempt to size each map tasks comparably so that each
> map task copies roughly the same number of bytes. By default, DistCp
> jobs use 20 mappers. Typically, specifying more Mappers ('m' parameter
> in command line) in the DistCp increases parallelism during data
> transfer process and decreases the data transfer duration. However,
> there are two things to consider while increasing the number of
> Mappers.

A.  DistCp's lowest granularity is a single file and so specifying
    number of Mappers more than the number of source files does not help
    and will waste the available cluster resources.

B.  Consider the available Yarn memory on the cluster to determine the
    number of Mappers. Each Map task is launched as a Yarn container.
    Assuming that no other heavy workloads are running on the cluster,
    the number of Mappers can be determined by the following:

    m = (number of worker nodes \* YARN memory for each worker node) /
    YARN container size

> However, If other applications are using memory, then choose to only
> use a portion of YARN memory for DistCp jobs.

2.  When the size of the dataset to be moved is large as in greater than
    1 TB, consider using multiple DistCp jobs. There is likely no
    performance gain, but it spreads out the jobs so that if any job
    fails, you only need to restart that specific job rather than the
    entire job.

3.  If there are a small number of large files, then consider splitting
    them into 256 MB file chunks to get more potential concurrency with
    more Mappers.

4.  Consider using "strategy = dynamic" parameter in the command line.
    The default value of "strategy" parameter is "uniformsize", in which
    case each map copies roughly the same number of bytes. In the case
    of dynamic, the listing-file is split into several "chunk-files",
    the exact number of chunk-files being a multiple of the number of
    maps. Each map task is assigned one of the chunk-files. After all
    the paths in a chunk are processed, the current chunk is deleted and
    a new chunk is acquired. The process continues until no more chunks
    are available. This "dynamic" approach allows faster map-tasks to
    consume more paths than slower ones, thus speeding up the DistCp job
    overall.

5.  See if increasing "-numListstatusThreads" parameter improves
    performance. It controls the number of threads to use for building
    file listing and 40 is the maximum value

6.  See if passing the
    "-Dmapreduce.fileoutputcommitter.algorithm.version=2" improves
    DistCp performance. This output committer algorithm has a bunch of
    optimizations around writing the output files to the destination.

    Below is a DistCp command that shows the usage of different
    parameters just as an example.

> **hadoop distcp -Dmapreduce.fileoutputcommitter.algorithm.version=2
> -numListstatusThreads 30 -m 100 -strategy dynamic
> hdfs://nn1:8020/foo/bar**
>
> **wasb://\<container\_name\>@\<storage\_account\_name\>.blob.core.windows.net/foo/
> **

- Metadata Migration
    ------------------

    **Hive:**

    The hive metastore can be migrated either by using the scripts or by
    using the DB Replication

    - Hive metastore migration using scripts

    <!-- -->

    - Generate the Hive DDLs from on-prem Hive metastore. This can be
        done using a wrapper bash script
        <https://github.com/hdinsight/hdinsight.github.io/blob/master/hive/hive-export-import-metastore.md>

    - Edit the generated DDL to replace HDFS url with WASB/ADLS/ABFS
        urls

    - Run the updated DDL on the metastore from the HDI cluster

    - Make sure that the Hive metastore version is compatible between
        on-premises and cloud

    <!-- -->

    - Hive metastore migration using DB Replication

    <!-- -->

    - Setup Database Replication between on-premises Hive metastore DB
        and HDI metastore DB

    - Use the "Hive MetaTool" to replace HDFS url with WASB/ADLS/ABFS
        urls

> Eg: ./hive \--service metatool -updateLocation hdfs://nn1:8020/
> wasb://\<container\_name\>@\<storage\_account\_name\>.blob.core.windows.net/

**Ranger**:

- Export on-premises Ranger policies to xml files

- Transform on-prem specific HDFS based paths to WASB/ADLS using a
    tool like XSLT

- import the policies on to Ranger running on HDI

<!-- -->

- Use Monitoring & Alerting
    -------------------------

> For more information, see the article:
>
> [https://docs.microsoft.com/en-us/azure/log-analytics/log-analy
> tics-overview](https://docs.microsoft.com/en-us/azure/log-analytics/log-analy%20tics-overview)

- Cluster Upgrade (OS)
    --------------------

> It is a good practice to upgrade to the latest HDInsight version so as
> to take advantage of the latest features. Below are the steps that can
> be followed to upgrade the cluster to the latest version.

- Create a new TEST HDI cluster using the latest available HDI version

- Perform testing on the new cluster to make sure that the jobs and
    workloads work as expected.

- Modify jobs or applications or workloads as required

- Back up any transient data stored locally on the cluster nodes.

- Delete the existing cluster.

- Create a cluster in the same VNET subnet with latest HDI version
    using the same default data and meta store that the previous cluster
    used.

- Import any transient data was backed up.

- Start jobs/continue processing using the new cluster.

For more information, see the article: [Upgrade HDInsight cluster to a new version](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-upgrade-cluster)
===============================================================================================================================================================

- OS Patching for HDInsight (Ops) -- explain little bit more 
    -----------------------------------------------------------

> As a managed Hadoop service, HDInsight takes care of patching the OS
> of the underlying VMs used by HDInsight clusters. 

For more information, see the article: [OS patching for HDInsight](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-os-patching)
==========================================================================================================================================

- Post-Migration
    --------------

1.  **Remediate applications**

> Iteratively make the necessary changes to the jobs, processes and
> scripts

2.  **Perform Tests**

    Iteratively run functional and performance tests

3.  **Optimize**

> Address any performance issues based on the above test results and
> then retest to confirm the performance improvements.

Appendix: Gathering details to prepare for a migration
------------------------------------------------------

This section provides template questionnaires to help gather important
information about:

- The on-premises deployment.

- Project details.

- Azure requirements.

On-Premises Deployment Questionnaire

  **Topic**         **Question**                             **Example**                                                                                                                                **Answer**
  ----------------- ---------------------------------------- ------------------------------------------------------------------------------------------------------------------------------------------ ------------
  **Environment**   Cluster Distribution type                Hortonworks, Cloudera, MapR                                                                                                                
                    Cluster Distribution version             HDP 2.6.5, CDH 5.7                                                                                                                         
                    Big Data eco-system components           HDFS, Yarn, Hive, LLAP, Impala, Kudu, HBase, Spark, MapReduce, Kafka, Zookeeper, Solr, Sqoop, Oozie, Ranger, Atlas, Falcon, Zeppelin, R    
                    Cluster types                            Hadoop, Spark, Confluent Kafka, Storm, Solr                                                                                                
                    Number of clusters                       4                                                                                                                                          
                    Number of Master Nodes                   2                                                                                                                                          
                    Number of Worker Nodes                   100                                                                                                                                        
                    Number of Edge Nodes                     5                                                                                                                                          
                    Total Disk space                         100 TB                                                                                                                                     
                    Master Node configuration                m/y, cpu, disk etc:                                                                                                                        
                    Data Nodes configuration                 m/y, cpu, disk etc:                                                                                                                        
                    Edge Nodes configuration                 m/y, cpu, disk etc:                                                                                                                        
                    HDFS Encryption?                         Yes                                                                                                                                        
                    High Availability                        HDFS HA, Metastore HA                                                                                                                      
                    Disaster Recovery / Backup               Backup cluster?                                                                                                                            
                    Systems that are dependent on Cluster    SQL Server, Teradata, PowerBI, MongoDB                                                                                                     
                    Third party integrations                 Tableau, GridGain, Qubole, Informatica, Splunk                                                                                             
  **Security**      Perimeter security                       Firewalls                                                                                                                                  
                    Cluster authentication & authorization   Active Directory, Ambari, Cloudera Manager, No authentication                                                                              
                    HDFS Access Control                      Manual, ssh users                                                                                                                          
                    Hive authentication & authorization      Sentry, LDAP, AD with Kerberos, Ranger                                                                                                     
                    Auditing                                 Ambari, Cloudera Navigator, Ranger                                                                                                         
                    Monitoring                               Graphite, collectd, statsd, Telegraf, InfluxDB                                                                                             
                    Alerting                                 Kapacitor, Prometheus, Datadog                                                                                                             
                    Data Retention duration                  3 years, 5 years                                                                                                                           
                    Cluster Administrators                   Single Administrator, Multiple Administrators                                                                                              

Project Details questionnaire
-----------------------------

  **Topic**                     **Question**                                       **Example**                      **Answer**
  ----------------------------- -------------------------------------------------- -------------------------------- ------------
  **Workloads and Frequency**   MapReduce jobs                                     10 jobs -- twice daily           
                                Hive jobs                                          100 jobs -- every hour           
                                Spark batch jobs                                   50 jobs -- every 15 minutes      
                                Spark Streaming jobs                               5 jobs -- every 3 minutes        
                                Structured Streaming jobs                          5 jobs -- every minute           
                                ML Model training jobs                             2 jobs -- once in a week         
                                Programming Languages                              Python, Scala, Java              
                                Scripting                                          Shell, Python                    
  **Data**                      Data sources                                       Flat files, Json, Kafka, RDBMS   
                                Data orchestration                                 Oozie workflows, Airflow         
                                In memory lookups                                  Apache Ignite, Redis             
                                Data destinations                                  HDFS, RDBMS, Kafka, MPP          
  **Meta data**                 Hive DB type                                       Mysql, Postgres                  
                                No. of Hive metastores                             2                                
                                No. of Hive tables                                 100                              
                                No. of Ranger policies                             20                               
                                No. of Oozie workflows                             100                              
  **Scale**                     Data volume including Replication                  100 TB                           
                                Daily ingestion volume                             50 GB                            
                                Data growth rate                                   10% per year                     
                                Cluster Nodes growth rate                          5 % per year                     
  **Cluster utilization**       Average CPU % used                                 60%                              
                                Average Memory % used                              75%                              
                                Disk space used                                    75%                              
                                Average Network % used                             25%                              
  **Staff**                     No. of Administrators                              2                                
                                No. of Developers                                  10                               
                                No. of end users                                   100                              
                                Skills                                             Hadoop, Spark                    
                                No. of available resources for Migration efforts   2                                
  **Limitations**               Current limitations                                Latency is high                  
                                Current challenges                                 Concurrency issue                

Azure Requirements Questionnaire
--------------------------------

  **Topic**                         **Question**                                                          **Example**                         **Answer**
  --------------------------------- --------------------------------------------------------------------- ----------------------------------- ------------
  **Infrastructure**                Preferred Region                                                      US East                             
                                    VNet preferred?                                                       Yes                                 
                                    HA / DR Needed?                                                       Yes                                 
                                    Integration with other cloud services?                                ADF, CosmosDB                       
  **Data Movement**                 Initial load preference                                               DistCp, Data box, ADF, WANDisco     
                                    Data transfer delta                                                   DistCp, AzCopy                      
                                    Ongoing incremental data transfer                                     DistCp, Sqoop                       
  **Monitoring & Alerting**         Use Azure Monitoring & Alerting Vs Integrate third party monitoring   Use Azure Monitoring & Alerting     
  **Security preferences**          Private and protected data pipeline?                                  Yes                                 
                                    Domain Joined cluster (ESPP)?                                         Yes                                 
                                    On-Premises AD Sync to Cloud?                                         Yes                                 
                                    No. of AD users to sync?                                              100                                 
                                    Ok to sync passwords to cloud?                                        Yes                                 
                                    Cloud only Users?                                                     Yes                                 
                                    MFA needed?                                                           No                                  
                                    Data authorization requirements?                                      Yes                                 
                                    Role Based Access Control?                                            Yes                                 
                                    Auditing needed?                                                      Yes                                 
                                    Data encryption at rest?                                              Yes                                 
                                    Data encryption in transit?                                           Yes                                 
  **Re-Architecture preferences**   Single cluster vs Specific cluster types                              Specific cluster types              
                                    Co-located Storage Vs Remote Storage?                                 Remote Storage                      
                                    Smaller cluster size as data resides remotely?                        Smaller cluster size                
                                    Use multiple smaller clusters rather than a single big cluster?       Use multiple smaller clusters       
                                    Use a remote metastores?                                              Yes                                 
                                    Share metastores between different clusters?                          Yes                                 
                                    Deconstruct workloads?                                                Replace Hive jobs with Spark jobs   
                                    Use ADF for data orchestration?                                       No                                  
                                    HDI vs HDP on IaaS?                                                   HDI
