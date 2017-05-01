---
title: Hadoop components & versions - Azure HDInsight | Microsoft Docs
description: Learn the Hadoop components and versions in HDInsight and the service levels available in this cloud distribution of HortonWorks Data Platform.
services: hdinsight
editor: cgronlun
manager: asadk
author: bprakash
tags: azure-portal
documentationcenter: ''

ms.assetid: 367b3f4a-f7d3-4e59-abd0-5dc59576f1ff
ms.service: hdinsight
ms.custom: hdinsightactive
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/14/2017
ms.author: bprakash

---
# What are the different Hadoop components and versions available with HDInsight?

Learn about the service levels offered for Azure HDInsight, as well as the Hadoop ecosystem components and versions included. Each HDInsight version is a cloud distribution of a version of the HortonWorks Data Platform (HDP).

## HDInsight Standard and HDInsight Premium

Azure HDInsight provides the big data cloud offerings in two categories: **Standard** and **Premium**. The table below section lists the features that are available **only as part of Premium**. Features that are not explicitly called out in the table here are available as part of Standard.

> [!NOTE]
> The HDInsight Premium offering is currently in Preview and available only for Linux clusters.
>
>

| HDInsight Premium feature | Description |
| --- | --- |
| Domain-joined HDInsight clusters |Join HDInsight clusters to Azure Active Directory (AAD) domains for enterprise-level security. You can now configure a list of employees from your enterprise who can authenticate through Azure Active Directory to log on to HDInsight cluster. The enterprise admin can also configure role based access control for Hive security using [Apache Ranger](http://hortonworks.com/apache/ranger/), thus restricting access to data to only as much as needed. Finally, the admin can audit the data accessed by employees, and any changes done to access control policies, thus achieving a high degree of governance of their corporate resources. For more information, see [Configure domain-joined HDInsight clusters](hdinsight-domain-joined-configure.md). |

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

This table will be updated as more cluster types are included in HDInsight Premium.

### Features not supported for HDInsight Premium

The following features are currently not supported for HDInsight Premium clusters.

* **No support for Azure Data Lake Store as primary storage**. You can still use Azure Data Lake Store as add-on storage with HDInsight Premium clusters.

### Pricing and SLA
For information on pricing and SLA for HDInsight Premium, see [HDInsight pricing](https://azure.microsoft.com/pricing/details/hdinsight/).

## Hadoop components available with different HDInsight versions
Azure HDInsight supports multiple Hadoop cluster versions that can be deployed at any time. Each version choice creates a specific version of the Hortonworks Data Platform (HDP) distribution and a set of components that are contained within that distribution. The component versions associated with HDInsight cluster versions are itemized in the following table. Note that the default cluster version used by Azure HDInsight is currently 3.5, and, as of 02/17/2017, based on HDP 2.5.

> [!NOTE]
> The default version from the service may change without notice. We recommend that you specify the version when you create clusters using .NET SDK/Azure PowerShell and Azure CLI, if you have a version dependency.
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

**Get current component version information**

The component versions associated with HDInsight cluster versions may change in future updates to HDInsight. One way to determine the available components and to verify which versions are being used for a cluster is to use the Ambari REST API. The **GetComponentInformation** command can be used to retrieve information about a service component. For details, see the [Ambari documentation][ambari-docs]. Another way to obtain this information is to log in to a cluster by using Remote Desktop and examine the contents of the "C:\apps\dist\" directory directly.

**Release notes**

See [HDInsight release notes](hdinsight-release-notes.md) for additional release notes on the latest versions of HDInsight.

## Supported HDInsight versions
The following table lists the versions of HDInsight currently available, the corresponding Hortonworks Data Platform versions that they use, and their release dates. When known, their support expiration and deprecation dates are also provided. Please note the following:

* Highly available clusters with two head nodes are deployed by default for HDInsight 2.1 and above. They are not available for HDInsight 1.6 clusters.
* Once the support has expired for a particular version, it may not be available through the Azure portal. The following table indicates which versions are available on the Azure Classic Portal. Cluster versions will continue to be available using the `Version` parameter in the Windows PowerShell [New-AzureRmHDInsightCluster](https://msdn.microsoft.com/library/mt619331.aspx) command and the .NET SDK until its deprecation date.

| HDInsight Version | HDP Version | VM OS | High Availability | Release Date | Available on Azure portal | Support Expiration Date | Deprecation Date |
| --- | --- | --- | --- | --- | --- | --- | --- |
| HDI 3.6 |HDP 2.6 |Ubuntu 16 |Yes |04/06/2017 |Yes | | |
| HDI 3.5 |HDP 2.5 |Ubuntu 16 |Yes |9/30/2016 |Yes |07/05/2017 |05/31/2018 |
| HDI 3.4 |HDP 2.4 |Ubuntu 14.0.4 LTS |Yes |03/29/2016 |Yes |12/29/2016 |1/9/2018 |
| HDI 3.3 |HDP 2.3 |Ubuntu 14.0.4 LTS or Windows Server 2012R2 |Yes |12/02/2015 |Yes |06/27/2016 |07/31/2017 |
| HDI 3.2 |HDP 2.2 |Ubuntu 12.04 LTS or Windows Server 2012R2 |Yes |2/18/2015 |No |3/1/2016 |04/01/2017 |
| HDI 3.1 |HDP 2.1 |Windows Server 2012R2 |Yes |6/24/2014 |No |05/18/2015 |06/30/2016 |
| HDI 3.0 |HDP 2.0 |Windows Server 2012R2 |Yes |02/11/2014 |No |09/17/2014 |06/30/2015 |
| HDI 2.1 |HDP 1.3 |Windows Server 2012R2 |Yes |10/28/2013 |No |05/12/2014 |05/31/2015 |
| HDI 1.6 |HDP 1.1 | |No |10/28/2013 |No |04/26/2014 |05/31/2015 |

##HDI Version 3.3 nearing deprecation date
The support for HDI 3.3 cluster expired on 06/27/2016 and it will be deprecated on 07/31/2017. If you have HDI 3.3 Cluster, then upgrade your Cluster to HDI 3.5 or HDI 3.6 soon. Deprecation timelines for HDI 3.3 Windows may vary by region. Customers will receive a separate communication if their region’s planned deprecation date is different than that identified in this communication.

### The service-level agreement for HDInsight cluster versions
The SLA is defined in terms of a "Support Window". A Support Window refers to the period of time that an HDInsight cluster version is supported by Microsoft Customer Service and Support. An HDInsight cluster is outside the Support Window if its version has a **Support Expiration Date** past the current date. A list of supported HDInsight cluster versions can be found in the table above. The support expiration date for a given HDInsight version X (once a newer X+1 version is available) is calculated as the later of:  

* Formula 1: Add 180 days to the date HDInsight cluster version X was released.
* Formula 2: Add 90 days to the date HDInsight cluster version X+1 (the subsequent version after X) is made available in the Portal.

The **Deprecation Date** is the date after which the cluster version cannot be created on HDInsight. Starting July 31st 2017, you cannot resize a cluster after it's deprecation date. 

> [!NOTE]
> Windows-based HDInsight cluster (including version 2.1, 3.0, 3.1, 3.2 and 3.3) run on Azure Guest OS Family 4, which uses the 64-bit version of Windows Server 2012 R2 and supports .NET Framework 4.0, 4.5, 4.5.1, and 4.5.2.
>
>

## Hortonworks release notes associated with HDInsight versions
* HDInsight cluster version 3.4 uses a Hadoop distribution that is based on [Hortonworks Data Platform 2.4](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.4.0/bk_HDP_RelNotes/content/ch_relnotes_v240.html). This is the **default** Hadoop cluster created when using the portal.
* HDInsight cluster version 3.3 uses a Hadoop distribution that is based on [Hortonworks Data Platform 2.3](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.3.0/bk_HDP_RelNotes/content/ch_relnotes_v230.html).

  * Apache Storm release notes are available [here](https://storm.apache.org/2015/11/05/storm0100-released.html).
  * Apache Hive release notes are available [here](https://issues.apache.org/jira/secure/ReleaseNote.jspa?version=12332384&styleName=Text&projectId=12310843).
* HDInsight cluster version 3.2 uses a Hadoop distribution that is based on [Hortonworks Data Platform 2.2][hdp-2-2].  

  * Release notes for specific Apache components - [Hive 0.14](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12310843&version=12326450), [Pig 0.14](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12310730&version=12326954), [HBase 0.98.4](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12310753&version=12326810), [Phoenix 4.2.0](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12315120&version=12327581), [M/R 2.6](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12310941&version=12327180), [HDFS 2.6](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12310942&version=12327181), [YARN 2.6](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12313722&version=12327197), [Common](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12310240&version=12327179), [Tez 0.5.2](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12314426&version=12328742), [Ambari 2.0](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12312020&version=12327486), [Storm 0.9.3](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12314820&version=12327112), [Oozie 4.1.0](https://issues.apache.org/jira/secure/ReleaseNote.jspa?version=12324960&projectId=12311620).
* HDInsight cluster version 3.1 uses a Hadoop distribution that is based on [Hortonworks Data Platform 2.1.7][hdp-2-1-7].HDInsight 3.1 clusters created before 11/7/2014 were based on the [Hortonworks Data Platform 2.1.1][hdp-2-1-1].
* HDInsight cluster version 3.0 uses a Hadoop distribution that is based on [Hortonworks Data Platform 2.0][hdp-2-0-8].
* HDInsight cluster version 2.1 uses a Hadoop distribution that is based on [Hortonworks Data Platform 1.3][hdp-1-3-0].
* HDInsight cluster version 1.6 uses a Hadoop distribution that is based on [Hortonworks Data Platform 1.1][hdp-1-1-0].

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
