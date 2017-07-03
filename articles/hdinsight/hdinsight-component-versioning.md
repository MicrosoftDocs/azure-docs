---
title: Hadoop components & versions - Azure HDInsight | Microsoft Docs
description: Learn the Hadoop components and versions in HDInsight and the service levels available in this cloud distribution of HortonWorks Data Platform.
keywords: hadoop versions,hadoop ecosystem components,hadoop components,how to check hadoop version
services: hdinsight
editor: cgronlun
manager: asadk
author: bprakash
tags: azure-portal
documentationcenter: ''

ms.assetid: 367b3f4a-f7d3-4e59-abd0-5dc59576f1ff
ms.service: hdinsight
ms.custom: hdinsightactive,hdiseo17may2017
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/14/2017
ms.author: bprakash
 

---
# What are the Hadoop components and versions available with HDInsight?

Learn about the Hadoop ecosystem components and versions in Azure HDInsight, as well as the Standard and Premium service levels. Also, learn how to check Hadoop component versions in HDInsight. 

Each HDInsight version is a cloud distribution of a version of the HortonWorks Data Platform (HDP).

## Hadoop components available with different HDInsight versions
Azure HDInsight supports multiple Hadoop cluster versions that can be deployed at any time. Each version choice creates a specific version of the Hortonworks Data Platform (HDP) distribution and a set of components that are contained within that distribution. The default cluster version used by Azure HDInsight is currently 3.5, and, as of February 17, 2017, based on HDP 2.5.

The component versions associated with HDInsight cluster versions are itemized in the following table: 

> [!NOTE]
> The default version from the service may change without notice. If you have a version dependency, we recommend that you specify the version when you create clusters using .NET SDK/Azure PowerShell and Azure CLI. 
>
>


| Component | HDInsight version 3.6 | HDInsight version 3.5 (Default) | HDInsight version 3.4 | HDInsight Version 3.3 | HDInsight Version 3.2 | HDInsight Version 3.1 | HDInsight Version 3.0 |
| --- | --- | --- | --- | --- | --- | --- |--- |
| Hortonworks Data Platform |2.6 |2.5 |2.4 |2.3 |2.2 |2.1.7 |2.0 |
| Apache Hadoop & YARN |2.7.3 |2.7.3 |2.7.1 |2.7.1 |2.6.0 |2.4.0 |2.2.0 |
| Apache Tez |0.7.0 |0.7.0 |0.7.0 |0.7.0 |0.5.2 |0.4.0 |-|
| Apache Pig |0.16.0 |0.16.0 |0.15.0 |0.15.0 |0.14.0 |0.12.1 |0.12.0 |
| Apache Hive & HCatalog |1.2.1 |1.2.1 |1.2.1 |1.2.1 |0.14.0 |0.13.1 |0.12.0 |
| Apache Hive2 | 2.1.0 |-|-|-|-|-|-|
| Apache Tez-Hive2 | 0.8.4 |-|-|-|-|-|-|
| Apache Ranger | 0.7.0 |0.6.0 |-|-|-|-|-|
| Apache HBase |1.1.2 |1.1.2 |1.1.2 |1.1.1 |0.98.4 |0.98.0 |-|
| Apache Sqoop |1.4.6 |1.4.6 |1.4.6 |1.4.6 |1.4.5 |1.4.4 |1.4.4 |
| Apache Oozie |4.2.0 |4.2.0 |4.2.0 |4.2.0 |4.1.0 |4.0.0 |4.0.0 |
| Apache Zookeeper |3.4.6 |3.4.6 |3.4.6 |3.4.6 |3.4.6 |3.4.5 |3.4.5 |
| Apache Storm |1.1.0 |1.0.1 |0.10.0 |0.10.0 |0.9.3 |0.9.1 |-|
| Apache Mahout |0.9.0+ |0.9.0+ |0.9.0+ |0.9.0+ |0.9.0 |0.9.0 |-|
| Apache Phoenix |4.7.0 |4.7.0 |4.4.0 |4.4.0 |4.2.0 |4.0.0.2.1.7.0-2162 |-|
| Apache Spark |2.1.0 (Linux only) |1.6.2 + 2.0 (Linux only) |1.6.0 (Linux only) |1.5.2 (Linux only/Experimental build) |1.3.1 (Windows-only) |-|-|
| Apache Kafka | 0.10.0 | 0.10.0 | 0.9.0 |-|-|-|-|
| Apache Ambari | 2.5.0 | 2.4.0 | 2.2.1 | 2.1.0 |-|-|-|
| Apache Zeppelin | 0.7.0 |-|-|-|-|-|-|
| Mono |4.2.1 |4.2.1 |3.2.8 |-|-|-|


## How to check current Hadoop component version information

The Hadoop ecosystem component versions associated with HDInsight cluster versions can change with updates to HDInsight. To check the Hadoop components and to verify which versions are being used for a cluster, use the Ambari REST API. The **GetComponentInformation** command retrieves information about service components. For details, see the [Ambari documentation][ambari-docs].

For Windows-based clusters only: Another way to get component versions is to log in to a cluster by using Remote Desktop and examine the contents of the "C:\apps\dist\" directory directly.

> [!IMPORTANT]
> Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [Windows retirement on HDInsight](#hdi-version-33-nearing-retirement-date). 

### Release notes

See [HDInsight release notes](hdinsight-release-notes.md) for additional release notes on the latest versions of HDInsight.

## Supported HDInsight versions
The following table lists the versions of HDInsight currently available, the corresponding Hortonworks Data Platform versions that they use, and their release dates. When known, their support expiration and retirement dates are also provided. Note the following version information:

* Highly available clusters with two head nodes are deployed by default for HDInsight 2.1 and above. They are not available for HDInsight 1.6 clusters.
* Once the support has expired for a particular version, it may not be available through the Azure portal. The following table indicates which versions are available on the Azure Classic Portal. Cluster versions  continue to be available using the `Version` parameter in the Windows PowerShell [New-AzureRmHDInsightCluster](https://msdn.microsoft.com/library/mt619331.aspx) command and the .NET SDK until its retirement date.

| HDInsight Version | HDP Version | VM OS | High Availability | Release Date | Available on Azure portal | Support Expiration Date | Retirement Date |
| --- | --- | --- | --- | --- | --- | --- | --- |
| HDI 3.6 |HDP 2.6 |Ubuntu 16 |Yes |04/06/2017 |Yes | | |
| HDI 3.5 |HDP 2.5 |Ubuntu 16 |Yes |9/30/2016 |Yes |07/05/2017 |05/31/2018 |
| HDI 3.4 |HDP 2.4 |Ubuntu 14.0.4 LTS |Yes |03/29/2016 |Yes |12/29/2016 |1/9/2018 |
| HDI 3.3 |HDP 2.3 |Windows Server 2012R2 |Yes |12/02/2015 |Yes |06/27/2016 |07/31/2018 |
| HDI 3.3 |HDP 2.3 |Ubuntu 14.0.4 LTS |Yes |12/02/2015 |Yes |06/27/2016 |07/31/2017 |
| HDI 3.2 |HDP 2.2 |Ubuntu 12.04 LTS or Windows Server 2012R2 |Yes |2/18/2015 |No |3/1/2016 |04/01/2017 |
| HDI 3.1 |HDP 2.1 |Windows Server 2012R2 |Yes |6/24/2014 |No |05/18/2015 |06/30/2016 |
| HDI 3.0 |HDP 2.0 |Windows Server 2012R2 |Yes |02/11/2014 |No |09/17/2014 |06/30/2015 |
| HDI 2.1 |HDP 1.3 |Windows Server 2012R2 |Yes |10/28/2013 |No |05/12/2014 |05/31/2015 |
| HDI 1.6 |HDP 1.1 | |No |10/28/2013 |No |04/26/2014 |05/31/2015 |

## HDI version 3.3 nearing retirement date
The support for HDI 3.3 cluster expired on 06/27/2016 and it will be retired on 07/31/2017. If you have HDI 3.3 Cluster, then upgrade your Cluster to HDI 3.6 soon. Retirement timelines for HDI 3.3 Windows may vary by region. If your region’s planned retirement date is different, you are notified separately.

### The service-level agreement for HDInsight cluster versions
The SLA is defined in terms of a **Support Window**. A Support Window refers to the period of time that an HDInsight cluster version is supported by Microsoft Customer Service and Support. If the version has a **Support Expiration Date** in the past, the HDInsight cluster is outside the Support Window. A list of supported HDInsight cluster versions can be found in the preceding table. The support expiration date for a given HDInsight version X (once a newer X+1 version is available) is calculated as the later of:  

* Formula 1: Add 180 days to the date HDInsight cluster version X was released.
* Formula 2: Add 90 days to the date HDInsight cluster version X+1 (the subsequent version after X) is made available in the Portal.

The **Retirement Date** is the date after which the cluster version cannot be created on HDInsight. Starting July 31, 2017, you cannot resize a cluster after its retirement date. 

> [!NOTE]
> Windows-based HDInsight clusters (including version 2.1, 3.0, 3.1, 3.2 and 3.3) run on Azure Guest OS Family 4, which uses the 64-bit version of Windows Server 2012 R2 and supports .NET Framework 4.0, 4.5, 4.5.1, and 4.5.2.
>
>

## Hortonworks release notes associated with HDInsight versions
* HDInsight cluster version 3.6 uses a Hadoop distribution that is based on [Hortonworks Data Platform 2.6](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.6.0/bk_release-notes/content/ch_relnotes.html). 
* HDInsight cluster version 3.5 uses a Hadoop distribution that is based on [Hortonworks Data Platform 2.5](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.5.0/bk_release-notes/content/ch_relnotes_v250.html). This Hadoop cluster is the **default** created when using the portal.
* HDInsight cluster version 3.4 uses a Hadoop distribution that is based on [Hortonworks Data Platform 2.4](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.4.0/bk_HDP_RelNotes/content/ch_relnotes_v240.html). 
* HDInsight cluster version 3.3 uses a Hadoop distribution that is based on [Hortonworks Data Platform 2.3](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.3.0/bk_HDP_RelNotes/content/ch_relnotes_v230.html).

  * Apache Storm release notes are available [here](https://storm.apache.org/2015/11/05/storm0100-released.html).
  * Apache Hive release notes are available [here](https://issues.apache.org/jira/secure/ReleaseNote.jspa?version=12332384&styleName=Text&projectId=12310843).
* HDInsight cluster version 3.2 uses a Hadoop distribution that is based on [Hortonworks Data Platform 2.2][hdp-2-2].  

  * Release notes for specific Apache components - [Hive 0.14](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12310843&version=12326450), [Pig 0.14](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12310730&version=12326954), [HBase 0.98.4](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12310753&version=12326810), [Phoenix 4.2.0](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12315120&version=12327581), [M/R 2.6](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12310941&version=12327180), [HDFS 2.6](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12310942&version=12327181), [YARN 2.6](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12313722&version=12327197), [Common](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12310240&version=12327179), [Tez 0.5.2](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12314426&version=12328742), [Ambari 2.0](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12312020&version=12327486), [Storm 0.9.3](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12314820&version=12327112), [Oozie 4.1.0](https://issues.apache.org/jira/secure/ReleaseNote.jspa?version=12324960&projectId=12311620).
* HDInsight cluster version 3.1 uses a Hadoop distribution that is based on [Hortonworks Data Platform 2.1.7][hdp-2-1-7].HDInsight 3.1 clusters created before 11/7/2014 were based on the [Hortonworks Data Platform 2.1.1][hdp-2-1-1].
* HDInsight cluster version 3.0 uses a Hadoop distribution that is based on [Hortonworks Data Platform 2.0][hdp-2-0-8].
* HDInsight cluster version 2.1 uses a Hadoop distribution that is based on [Hortonworks Data Platform 1.3][hdp-1-3-0].
* HDInsight cluster version 1.6 uses a Hadoop distribution that is based on [Hortonworks Data Platform 1.1][hdp-1-1-0].

## HDInsight Standard and HDInsight Premium

Azure HDInsight provides the big data cloud offerings in two categories: **Standard** and **Premium**. The table in the following section lists the features that are available **only as part of Premium**. Features that are not explicitly called out in the table here are available as part of Standard.

> [!NOTE]
> The HDInsight Premium offering is currently in Preview and available only for Linux clusters.
>
>

| HDInsight Premium feature | Description |
| --- | --- |
| Domain-joined HDInsight clusters |Join HDInsight clusters to Azure Active Directory (AAD) domains for enterprise-level security. You can now configure a list of employees from your enterprise who can authenticate through Azure Active Directory to log on to HDInsight cluster. The enterprise admin can also configure role-based access control for Hive security using [Apache Ranger](http://hortonworks.com/apache/ranger/), thus restricting access to data to only as much as needed. Finally, the admin can audit the data accessed by employees, and any changes done to access control policies, thus achieving a high degree of governance of their corporate resources. For more information, see [Configure domain-joined HDInsight clusters](hdinsight-domain-joined-configure.md). |

### Cluster types supported for HDInsight Premium
The following table lists the HDInsight cluster type and Premium support matrix.

| Cluster type | Standard | Premium (Preview) |
| --- | --- | --- |
| Hadoop |Yes |Yes (HDInsight 3.5 & 3.6 only) |
| Spark |Yes |No |
| HBase |Yes |No |
| Storm |Yes |No |
| R Server  |Yes |No |
| Interactive Hive (Preview) |Yes |No |
| Kafka (Preview)|Yes|No| 

This table is updated as more cluster types are included in HDInsight Premium.

### Features not supported for HDInsight Premium

The following features are currently not supported for HDInsight Premium clusters.

* **No support for Azure Data Lake Store as primary storage**. You can still use Azure Data Lake Store as add-on storage with HDInsight Premium clusters.

### Pricing and SLA
For information on pricing and SLA for HDInsight Premium, see [HDInsight pricing](https://azure.microsoft.com/pricing/details/hdinsight/).

## Default node configuration and virtual machine sizes for clusters
The following tables list the default virtual machine (VM) sizes for HDInsight clusters:

> [!IMPORTANT]
> If you need more than 32 worker nodes in a cluster, you must select a head node size with at least 8 cores and 14 GB of RAM.
>
>

* All supported regions except Brazil South and Japan West:

  | Cluster type | Hadoop | HBase | Storm | Spark | R Server |
  | --- | --- | --- | --- | --- | --- |
  | Head: default VM size |D3 v2 |D3 v2 |A3 |D12 v2 |D12 v2 |
  | Head: recommended VM sizes |D3 v2, D4 v2, D12 v2 |D3 v2, D4 v2, D12 v2 |A3, A4, A5 |D12 v2, D13 v2, D14 v2 |D12 v2, D13 v2, D14 v2 |
  | Worker: default VM size |D3 v2 |D3 v2 |D3 v2 |Windows: D12 v2; Linux: D4 v2 |Windows: D12 v2; Linux: D4 v2 |
  | Worker: recommended VM sizes |D3 v2, D4 v2, D12 v2 |D3 v2, D4 v2, D12 v2 |D3 v2, D4 v2, D12 v2 |Windows: D12 v2, D13 v2, D14 v2; Linux: D4 v2, D12 v2, D13 v2, D14 v2 |Windows: D12 v2, D13 v2, D14 v2; Linux: D4 v2, D12 v2, D13 v2, D14 v2 |
  | ZooKeeper: default VM size | |A3 |A2 | | |
  | ZooKeeper: recommended VM sizes | |A3, A4, A5 |A2, A3, A4 | | |
  | Edge: default VM size | | | | |Windows: D12 v2; Linux: D4 v2 |
  | Edge: recommended VM size | | | | |Windows: D12 v2, D13 v2, D14 v2; Linux: D4 v2, D12 v2, D13 v2, D14 v2 |
* Brazil South and Japan West only (no v2 sizes here):

  | Cluster type | Hadoop | HBase | Storm | Spark | R Server |
  | --- | --- | --- | --- | --- | --- |
  | Head: default VM size |D3 |D3 |A3 |D12 |D12 |
  | Head: recommended VM sizes |D3, D4, D12 |D3, D4, D12 |A3, A4, A5 |D12, D13, D14 |D12, D13, D14 |
  | Worker: default VM size |D3 |D3 |D3 |Windows: D12; Linux: D4 |Windows: D12; Linux: D4 |
  | Worker: recommended VM sizes |D3, D4, D12 |D3, D4, D12 |D3, D4, D12 |Windows: D12, D13, D14; Linux: D4, D12, D13, D14 |Windows: D12, D13, D14; Linux: D4, D12, D13, D14 |
  | ZooKeeper: default VM size | |A2 |A2 | | |
  | ZooKeeper: recommended VM sizes | |A2, A3, A4 |A2, A3, A4 | | |
  | Edge: default VM sizes | | | | |Windows: D12; Linux: D4 |
  | Edge: recommended VM sizes | | | | |Windows: D12, D13, D14; Linux: D4, D12, D13, D14 |

> [!NOTE]
> Head is known as *Nimbus* for the Storm cluster type. Worker is known as *Region* for the HBase cluster type and as *Supervisor* for the Storm cluster type.

## Next steps
- [Cluster setup for Hadoop, Spark, and more on HDInsight](hdinsight-hadoop-provision-linux-clusters.md)
- [Work in Hadoop on HDInsight from a Windows PC](hdinsight-hadoop-windows-tools.md)

[image-hdi-versioning-versionscreen]: ./media/hdinsight-component-versioning/hdi-versioning-version-screen.png

[wa-forums]: http://azure.microsoft.com/support/forums/

[connect-excel-with-hive-ODBC]: hdinsight-connect-excel-hive-ODBC-driver.md

[hdp-2-2]: http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.2.0/HDP_2.2.0_Release_Notes_20141202_version/index.html

[hdp-2-1-7]: http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.1.7-Win/bk_releasenotes_HDP-Win/content/ch_relnotes-HDP-2.1.7.html

[hdp-2-1-1]: http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.1.1/bk_releasenotes_hdp_2.1/content/ch_relnotes-hdp-2.1.1.html

[hdp-2-0-8]: http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.0.8.0/bk_releasenotes_hdp_2.0/content/ch_relnotes-hdp2.0.8.0.html

[hdp-1-3-0]: http://docs.hortonworks.com/HDPDocuments/HDP1/HDP-1.3.0/bk_releasenotes_hdp_1.x/content/ch_relnotes-hdp1.3.0_1.html

[hdp-1-1-0]: http://docs.hortonworks.com/HDPDocuments/HDP1/HDP-Win-1.1/bk_releasenotes_HDP-Win/content/ch_relnotes-hdp-win-1.1.0_1.html

[ambari-docs]: https://github.com/apache/ambari/blob/trunk/ambari-server/docs/api/v1/index.md

[zookeeper]: http://zookeeper.apache.org/
