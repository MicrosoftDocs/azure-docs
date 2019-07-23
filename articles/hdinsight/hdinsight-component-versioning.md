---
title: Apache Hadoop components and versions - Azure HDInsight 
description: Learn the Apache Hadoop components and versions in HDInsight and the service levels available in this cloud distribution of Hortonworks Data Platform.
keywords: hadoop versions,hadoop ecosystem components,hadoop components,how to check hadoop version
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive,hdiseo17may2017
ms.topic: conceptual
ms.date: 06/07/2019
---

# What are the Apache Hadoop components and versions available with HDInsight?

Learn about the [Apache Hadoop](https://hadoop.apache.org/) ecosystem components and versions in Microsoft Azure HDInsight, as well as the Enterprise Security Package. Also, learn how to check Hadoop component versions in HDInsight.

## Apache Hadoop components available with different HDInsight versions

Azure HDInsight supports multiple Hadoop cluster versions that can be deployed at any time. Each version choice creates a specific version of the HDP distribution and a set of components that are contained within that distribution. As of April 4, 2017, the default cluster version used by Azure HDInsight is 3.6 and is based on HDP 2.6.

The component versions associated with HDInsight cluster versions are listed in the following table: 

> [!NOTE]  
> The default version for the HDInsight service might change without notice. If you have a version dependency, specify the HDInsight version when you create your clusters with the .NET SDK with Azure PowerShell and Azure Classic CLI.

| Component | HDInsight 4.0 | HDInsight 3.6 (Default) | HDInsight 3.5 | HDInsight 3.4 | HDInsight 3.3 | HDInsight 3.2 |
|---------------------------|---------------|-----------------------------|---------------|---------------|---------------|----------------------|
| Hortonworks Data Platform | 3.0 | 2.6 | 2.5 | 2.4 | 2.3 | 2.2 |
| Apache Hadoop and YARN | 3.1.1 | 2.7.3 | 2.7.3 | 2.7.1 | 2.7.1 | 2.6.0 |
| Apache Tez | 0.9.1 | 0.7.0 | 0.7.0 | 0.7.0 | 0.7.0 | 0.5.2 |
| Apache Pig | 0.16.0 | 0.16.0 | 0.16.0 | 0.15.0 | 0.15.0 | 0.14.0 |
| Apache Hive and HCatalog | - | 1.2.1 | 1.2.1 | 1.2.1 | 1.2.1 | 0.14.0 |
| Apache Hive | 3.1.0 | 2.1.0 | - | - | - | - |
| Apache Tez Hive2 | - | 0.8.4 | - | - | - | - |
| Apache Ranger | 1.1.0 | 0.7.0 | 0.6.0 | - | - | - |
| Apache HBase | 2.0.1 | 1.1.2 | 1.1.2 | 1.1.2 | 1.1.1 | 0.98.4 |
| Apache Sqoop | 1.4.7 | 1.4.6 | 1.4.6 | 1.4.6 | 1.4.6 | 1.4.5 |
| Apache Oozie | 4.3.1 | 4.2.0 | 4.2.0 | 4.2.0 | 4.2.0 | 4.1.0 |
| Apache Zookeeper | 3.4.6 | 3.4.6 | 3.4.6 | 3.4.6 | 3.4.6 | 3.4.6 |
| Apache Storm | - | 1.1.0 | 1.0.1 | 0.10.0 | 0.10.0 | 0.9.3 |
| Apache Mahout | - | 0.9.0+ | 0.9.0+ | 0.9.0+ | 0.9.0+ | 0.9.0 |
| Apache Phoenix | 5 | 4.7.0 | 4.7.0 | 4.4.0 | 4.4.0 | 4.2.0 |
| Apache Spark | 2.3.1, 2.4 | 2.3.0, 2.2.0, 2.1.0 | 1.6.2, 2.0 | 1.6.0 | 1.5.2 | 1.3.1 (Windows only) |
| Apache Livy | 0.5 | 0.4, 0.4, 0.3 | 0.3 | 0.3 | 0.2 | - |
| Apache Kafka | 1.1.1, 2.1 | 1.1, 1.0 * (See Note below) | 0.10.0 | 0.9.0 | - | - |
| Apache Ambari | 2.7.0 | 2.6.0 | 2.4.0 | 2.2.1 | 2.1.0 | - |
| Apache Zeppelin | 0.8.0 | 0.7.0 | - | - | - | - |
| Mono | 4.2.1 | 4.2.1 | 4.2.1 | 3.2.8 | - | - |

> [!NOTE]
> Due to system performance considerations, support for Kafka version 0.10 was expired in March 2019.

## Check for current Hadoop component version information

The Hadoop ecosystem component versions associated with HDInsight cluster versions can change with updates to HDInsight. To check the Hadoop components and to verify which versions are being used for a cluster, use the Ambari REST API. The **GetComponentInformation** command retrieves information about service components. For details, see the [Apache Ambari documentation](https://github.com/apache/ambari/blob/trunk/ambari-server/docs/api/v1/index.md).

### Release notes

See [HDInsight release notes](hdinsight-release-notes.md) for additional release notes on the latest versions of HDInsight.

## Supported HDInsight versions

The following tables list the versions of HDInsight. The HDP versions that correspond to each HDInsight version are listed along with the product release dates. The support expiration and retirement dates are also provided, when they're known.

### Available versions

The following table lists the versions of HDInsight that are available in the Azure portal as well as other deployment methods like PowerShell and .NET SDK.

| HDInsight version | HDP version | VM OS | Release date | Support expiration date | Retirement date | High availability |  Availability on the Azure portal | 
| --- | --- | --- | --- | --- | --- | --- | --- |
| HDInsight 4.0 |HDP 3.0 |Ubuntu 16.0.4 LTS |September 24, 2018 | | |Yes |Yes |
| HDInsight 3.6 |HDP 2.6 |Ubuntu 16.0.4 LTS |April 4, 2017 | June 30, 2020 |December 31, 2020 |Yes |Yes |


> [!NOTE]  
> After support for a version has expired, it might not be available through the Microsoft Azure portal. However, cluster versions continue to be available using the `Version` parameter in the Windows PowerShell [New-AzHDInsightCluster](https://docs.microsoft.com/powershell/module/az.hdinsight/new-azhdinsightcluster) command and the .NET SDK until the version retirement date.
>

### Retired versions

The following table lists the versions of HDInsight that are **not** available in the Azure portal.

| HDInsight version | HDP version | VM OS | Release date | Support expiration date | Retirement date | High availability |  Availability on the Azure portal | 
| --- | --- | --- | --- | --- | --- | --- | --- |
| HDInsight 3.5 <br> (Non-Spark) |HDP 2.5 |Ubuntu 16.0.4 LTS |September 30, 2016 |September 5, 2017 |June 28, 2018 |Yes |No |
| HDInsight 3.4 |HDP 2.4 |Ubuntu 14.0.4 LTS |March 29, 2016 |December 29, 2016 |January 9, 2018 |Yes |No |
| HDInsight 3.3 |HDP 2.3 |Windows Server 2012 R2 |December 2, 2015 |June 27, 2016 |July 31, 2018 |Yes |No |
| HDInsight 3.3 |HDP 2.3 |Ubuntu 14.0.4 LTS |December 2, 2015 |June 27, 2016 |July 31, 2017 |Yes |No |
| HDInsight 3.2 |HDP 2.2 |Ubuntu 12.04 LTS or Windows Server 2012 R2 |February 18, 2015 |March 1, 2016 |April 1, 2017 |Yes |No |
| HDInsight 3.1 |HDP 2.1 |Windows Server 2012 R2 |June 24, 2014 |May 18, 2015 |June 30, 2016 |Yes |No |
| HDInsight 3.0 |HDP 2.0 |Windows Server 2012 R2 |February 11, 2014 |September 17, 2014 |June 30, 2015 |Yes |No |
| HDInsight 2.1 |HDP 1.3 |Windows Server 2012 R2 |October 28, 2013 |May 12, 2014 |May 31, 2015 |Yes |No |
| HDInsight 1.6 |HDP 1.1 | |October 28, 2013 |April 26, 2014 |May 31, 2015 |No |No |

> [!NOTE]  
> Highly available clusters with two head nodes are deployed by default for HDInsight version 2.1 and later. They are not available for HDInsight version 1.6 clusters.

## Enterprise Security Package for HDInsight

Enterprise Security is an optional package that you can add on your HDInsight cluster as part of create cluster workflow. The Enterprise Security Package supports:

- Integration with Active Directory for authentication.

    In the past, you can only create HDInsight clusters with a local admin user and a local SSH user. The local admin user can access all the files, folders, tables, and columns.  With the Enterprise Security Package, you can enable role-based access control by integrating HDInsight clusters with your own Active Directory, which include on-premises Active Directory, Azure Active Directory Domain Services, or Active Directory on IaaS virtual machine. Domain administrator on the cluster can grant users to use their own corporate (domain) user-name and password to access the cluster. 

    For more information, see:

    - [An introduction to Apache Hadoop security with domain-joined HDInsight clusters](./domain-joined/apache-domain-joined-introduction.md)
    - [Plan Azure domain-joined Apache Hadoop clusters in HDInsight](./domain-joined/apache-domain-joined-architecture.md)
    - [Configure domain-joined sandbox environment](./domain-joined/apache-domain-joined-configure.md)
    - [Configure Domain-joined HDInsight clusters using Azure Active Directory Domain Services](./domain-joined/apache-domain-joined-configure-using-azure-adds.md)

- Authorization for data

  - Integration with Apache Ranger for authorization for Hive, Spark SQL, and Yarn Queues.
  - You can set access control on files and folders.

    For more information, see:

  - [Configure Apache Hive policies in Domain-joined HDInsight](./domain-joined/apache-domain-joined-run-hive.md)

- View the audit logs to monitor accesses and the configured policies. 

### Supported cluster types

Currently, only the following cluster types support the Enterprise Security Package:

- Hadoop (HDInsight 3.6 only)
- Spark
- Interactive Query

### Support for Azure Data Lake Storage

The Enterprise Security Package supports using Azure Data Lake Storage as both the primary storage and the add-on storage.

### Pricing and service level agreement

For information on pricing and SLA for the Enterprise Security Package, see [HDInsight pricing](https://azure.microsoft.com/pricing/details/hdinsight/).


## Service level agreement for HDInsight cluster versions

The service level agreement (SLA) is defined in terms of a _support window_. The support window is the period of time that an HDInsight cluster version is supported by Microsoft Customer Service and Support. If the version has a _support expiration date_ that has passed, the HDInsight cluster is outside the support window. The support expiration date for a specified HDInsight version X (after a newer X+1 version is available) is calculated as the later of:  

* Formula 1: Add 180 days to the date when the HDInsight cluster version X was released.
* Formula 2: Add 90 days to the date when the HDInsight cluster version X+1 is made available in Azure portal.

The _retirement date_ is the date after which the cluster version cannot be created on HDInsight. Starting July 31, 2017, you cannot resize an HDInsight cluster after its retirement date. 

> [!NOTE]  
> HDInsight Windows clusters (including versions 2.1, 3.0, 3.1, 3.2 and 3.3) run on Azure Guest OS Family version 4, which uses the 64-bit version of Windows Server 2012 R2. Azure Guest OS Family version 4 supports the .NET Framework versions 4.0, 4.5, 4.5.1, and 4.5.2.

## Hortonworks release notes associated with HDInsight versions

The section provides links to release notes for the Hortonworks Data Platform distributions and Apache components that are used with HDInsight.
* HDInsight cluster version 4.0 uses a Hadoop distribution that is based on [Hortonworks Data Platform 3.0](https://docs.hortonworks.com/HDPDocuments/HDP3/HDP-3.0.0/release-notes/content/relnotes.html)
* HDInsight cluster version 3.6 uses a Hadoop distribution that is based on [Hortonworks Data Platform 2.6](https://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.6.0/bk_release-notes/content/ch_relnotes.html).
* HDInsight cluster version 3.5 uses a Hadoop distribution that is based on [Hortonworks Data Platform 2.5](https://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.5.0/bk_release-notes/content/ch_relnotes_v250.html). HDInsight cluster version 3.5 is the _default_ Hadoop cluster that is created in the Azure portal.
* HDInsight cluster version 3.4 uses a Hadoop distribution that is based on [Hortonworks Data Platform 2.4](https://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.4.0/bk_HDP_RelNotes/content/ch_relnotes_v240.html).
* HDInsight cluster version 3.3 uses a Hadoop distribution that is based on [Hortonworks Data Platform 2.3](https://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.3.0/bk_HDP_RelNotes/content/ch_relnotes_v230.html).

  * [Apache Storm release notes](https://storm.apache.org/2015/11/05/storm0100-released.html) are available on the Apache website.
  * [Apache Hive release notes](https://issues.apache.org/jira/secure/ReleaseNote.jspa?version=12332384&styleName=Text&projectId=12310843) are available on the Apache website.
* HDInsight cluster version 3.2 uses a Hadoop distribution that is based on [Hortonworks Data Platform 2.2][hdp-2-2].

  * Release notes for specific Apache components are available as follows: [Hive 0.14](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12310843&version=12326450), [Pig 0.14](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12310730&version=12326954), [HBase 0.98.4](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12310753&version=12326810), [Phoenix 4.2.0](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12315120&version=12327581), [M/R 2.6](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12310941&version=12327180), [HDFS 2.6](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12310942&version=12327181), [YARN 2.6](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12313722&version=12327197), [Common](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12310240&version=12327179), [Tez 0.5.2](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12314426&version=12328742), [Ambari 2.0](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12312020&version=12327486), [Storm 0.9.3](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12314820&version=12327112), and [Oozie 4.1.0](https://issues.apache.org/jira/secure/ReleaseNote.jspa?version=12324960&projectId=12311620).
* HDInsight cluster version 3.1 uses a Hadoop distribution that is based on [Hortonworks Data Platform 2.1.7][hdp-2-1-7]. HDInsight 3.1 clusters created before November, 7, 2014, are based on [Hortonworks Data Platform 2.1.1][hdp-2-1-1].
* HDInsight cluster version 3.0 uses a Hadoop distribution that is based on [Hortonworks Data Platform 2.0][hdp-2-0-8].
* HDInsight cluster version 2.1 uses a Hadoop distribution that is based on [Hortonworks Data Platform 1.3][hdp-1-3-0].
* HDInsight cluster version 1.6 uses a Hadoop distribution that is based on [Hortonworks Data Platform 1.1][hdp-1-1-0].

## Default node configuration and virtual machine sizes for clusters

The following tables list the default virtual machine (VM) sizes for HDInsight clusters.  This chart is necessary to understand the VM sizes to use when you are creating PowerShell or Azure CLI scripts to deploy HDInsight clusters.

> [!IMPORTANT]  
> If you need more than 32 worker nodes in a cluster, you must select a head node size with at least 8 cores and 14 GB of RAM.

* All supported regions except Brazil South and Japan West:

|Cluster type|Hadoop|HBase|Interactive Query|Storm|Spark|ML Server|Kafka|
|---|---|---|---|---|---|---|---|
|Head: default VM size|D12 v2|D12 v2|D13 v2|A3|D12 v2|D12 v2|D3v2|
|Head: recommended VM sizes|D3 v2|D3 v2|D13|A4 v2|D12 v2|D12 v2|A2M v2|
||D4 v2|D4 v2|D14|A8 v2|D13 v2|D13 v2|D3 v2|
||D12 v2|D12 v2|E16 v3|A2m v2|D14 v2|D14 v2|D4 v2|
||E4 v3|E4 v3|E32 v3|E4 v3|E4 v3|E4 v3|D12 v2|
|Worker: default VM size|D4 v2|D4 v2|D14 v2|D3 v2|D13 v2|D4 v2|4 D12v2 with 2 S30 disks per broker|
|Worker: recommended VM sizes|D3 v2|D3 v2|D13|D3 v2|D4 v2|D4 v2|D13 v2|
||D4 v2|D4 v2|D14|D4 v2|D12 v2|D12 v2|DS12 v2|
||D12 v2|D12 v2|E16 v3|D12 v2|D13 v2|D13 v2|DS13 v2|
||E4 v3|E4 v3|E20 v3|E4 v3|D14 v2|D14 v2|E4 v3|
||||E32 v3||E16 v3|E16 v3|ES4 v3|
||||E64 v3||E20 v3|E20 v3|E8 v3|
||||||E32 v3|E32 v3|ES8 v3|
||||||E64 v3|E64 v3||
|ZooKeeper: default VM size||A4 v2|A4 v2|A4 v2||A2 v2|D3v2|
|ZooKeeper: recommended VM sizes||A4 v2||A2 v2|||A2M v2|
|||A8 v2||A4 v2|||D3 v2|
|||A2m v2||A8 v2|||E8 v3|
|ML Services: default VM size||||||D4 v2||
|ML Services: recommended VM size||||||D4 v2||
|||||||D12 v2||
|||||||D13 v2||
|||||||D14 v2||
|||||||E16 v3||
|||||||E20 v3||
|||||||E32 v3||
|||||||E64 v3||

* Brazil South and Japan West only (no v2 sizes):

  | Cluster type | Hadoop | HBase | Interactive Query |Storm | Spark | ML Services |
  | --- | --- | --- | --- | --- | --- | --- |
  | Head: default VM size |D12 |D12  | D13 |A3 |D12 |D12 |
  | Head: recommended VM sizes |D3,<br/> D4,<br/> D12 |D3,<br/> D4,<br/> D12  | D13,<br/> D14 |A3,<br/> A4,<br/> A5 |D12,<br/> D13,<br/> D14 |D12,<br/> D13,<br/> D14 |
  | Worker: default VM size |D4 |D4  |  D14 |D3 |D13 |D4 |
  | Worker: recommended VM sizes |D3,<br/> D4,<br/> D12 |D3,<br/> D4,<br/> D12  | D13,<br/> D14 |D3,<br/> D4,<br/> D12 |D4,<br/> D12,<br/> D13,<br/> D14 | D4,<br/> D12,<br/> D13,<br/> D14 |
  | ZooKeeper: default VM size | |A4 v2 | A4 v2| A4 v2 | | A2 v2|
  | ZooKeeper: recommended VM sizes | |A2,<br/> A3,<br/> A4 | |A2,<br/> A3,<br/> A4 | | |
  | ML Services: default VM sizes | | | | | |D4 |
  | ML Services: recommended VM sizes | | | | | |D4,<br/> D12,<br/> D13,<br/> D14 |

> [!NOTE]
> - Head is known as *Nimbus* for the Storm cluster type.
> - Worker is known as *Supervisor* for the Storm cluster type.
> - Worker is known as *Region* for the HBase cluster type.

## Next steps
- [Cluster setup for Apache Hadoop, Spark, and more on HDInsight](hdinsight-hadoop-provision-linux-clusters.md)
- [Work in Apache Hadoop on HDInsight from a Windows PC](hdinsight-hadoop-windows-tools.md)

[hdp-2-2]: https://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.2.9/bk_HDP_RelNotes/content/ch_relnotes_v229.html

[hdp-2-1-7]: https://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.1.7-Win/bk_releasenotes_HDP-Win/content/ch_relnotes-HDP-2.1.7.html

[hdp-2-1-1]: https://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.1.1/bk_releasenotes_hdp_2.1/content/ch_relnotes-hdp-2.1.1.html

[hdp-2-0-8]: https://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.0.8.0/bk_releasenotes_hdp_2.0/content/ch_relnotes-hdp2.0.8.0.html

[hdp-1-3-0]: https://docs.hortonworks.com/HDPDocuments/HDP1/HDP-1.3.0/bk_releasenotes_hdp_1.x/content/ch_relnotes-hdp1.3.0_1.html

[hdp-1-1-0]: https://docs.hortonworks.com/HDPDocuments/HDP1/HDP-1.3.0/bk_releasenotes_hdp_1.x/content/ch_relnotes-hdp1.1.1.16_1.html
