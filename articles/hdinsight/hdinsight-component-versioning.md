<properties
	pageTitle="What are the different components available with an HDInsight cluster? | Microsoft Azure"
	description="HDInsight supports multiple deployable Hadoop cluster components and versions. See the Hadoop and HortonWorks Data Platform (HDP) distribution versions supported."
	services="hdinsight"
	editor="cgronlun"
	manager="paulettm"
	authors="mumian"
	tags="azure-portal"
	documentationCenter=""/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/25/2016"
	ms.author="jgao"/>


# What are the different Hadoop components available with HDInsight?

Find out about the different service levels offered by HDInsight as well as the versions of different hadoop components included with HDInsight.

## HDInsight Standard and HDInsight Premium

Azure HDInsight provides the big data cloud offerings in two categories: **Standard** and **Premium**. The table below section lists the features that are available **only** as part of Premium. Features that are not explicitly called out in the table here are available as part of Standard.

>[AZURE.NOTE] The HDInsight Premium offering is currently in Preview and available only for Linux clusters.

| HDInsight Premium feature | Description |
|--------------|---------------|
| Microsoft R Server (Preview)       | Microsoft R Server is the most broadly deployed enterprise-class analytics platform for scalable R. The R language supports a variety of big data statistics, predictive modeling, and machine learning capabilities. As part of HDInsight Premium, you can now create an HDInsight cluster with R Server ready to be used with massive datasets and models. This new capability provides data scientists and statisticians a familiar R interface that can scale on-demand through HDInsight, without the overhead of cluster setup and maintenance. <br> <br>For more information, see [Getting Started with R Server on HDInsight](hdinsight-hadoop-r-server-get-started.md).

### Cluster types supported for Premium

The following table lists the HDInsight cluster type and Premium support matrix.

| Cluster type | Standard  | Premium |
|--------------|---------------|--------------|
| Hadoop       | Yes           | Yes          |
| Spark        | Yes           | Yes          |
| HBase        | Yes           | No           |
| Storm        | Yes           | No           |

This table will be updated as more cluster types are included in HDInsight Premium.

### Pricing and SLA

For information on pricing and SLA for HDInsight Premium, see [HDInsight pricing](https://azure.microsoft.com/pricing/details/hdinsight/).

## Hadoop components available with different HDInsight versions

Azure HDInsight supports multiple Hadoop cluster versions that can be deployed at any time. Each version choice creates a specific version of the Hortonworks Data Platform (HDP) distribution and a set of components that are contained within that distribution. The component versions associated with HDInsight cluster versions are itemized in the following table. Note that the default cluster version used by Azure HDInsight is currently 3.2, and, as of 12/03/2015, based on HDP 2.2.


Component|HDInsight version 3.4 | HDInsight Version 3.3 | HDInsight Version 3.2 (Default)|HDInsight Version 3.1 |HDInsight Version 3.0|
---|---|---|---|---|---
Hortonworks Data Platform|2.4|2.3|2.2|2.1.7|2.0|
Apache Hadoop & YARN|2.7.1|2.7.1|2.6.0|2.4.0|2.2.0|
Apache Tez|0.7.0|0.7.0 | 0.5.2|0.4.0||
Apache Pig|0.15.0|0.15.0|0.14.0|0.12.1|0.12.0|
Apache Hive & HCatalog|1.2.1|1.2.1|0.14.0|0.13.1|0.12.0|
Apache HBase |1.1.2|1.1.1|0.98.4|0.98.0||
Apache Sqoop|1.4.6|1.4.6|1.4.5|1.4.4|1.4.4|1.4.3
Apache Oozie|4.2.0|4.2.0|4.1.0|4.0.0|4.0.0|
Apache Zookeeper|3.4.6|3.4.6|3.4.6|3.4.5|3.4.5|
Apache Storm|0.10.0|0.10.0|0.9.3|0.9.1||
Apache Mahout|0.9.0+|0.9.0+|0.9.0|0.9.0||
Apache Phoenix|4.4.0|4.4.0|4.2.0|4.0.0.2.1.7.0-2162||
Apache Spark|1.6.0 (Linux only)|1.5.2 (Linux only/Experimental build)|1.3.1 (Windows-only)|||


**Get current component version information**

The component versions associated with HDInsight cluster versions may change in future updates to HDInsight. One way to determine the available components and to verify which versions are being used for a cluster is to use the Ambari REST API. The **GetComponentInformation** command can be used to retrieve information about a service component. For details, see the [Ambari documentation][ambari-docs]. Another way to obtain this information is to log in to a cluster by using Remote Desktop and examine the contents of the "C:\apps\dist\" directory directly.


**Release notes**

See [HDInsight release notes](hdinsight-release-notes.md) for additional release notes on the latest versions of HDInsight.


## Supported HDInsight versions
The following table lists the versions of HDInsight currently available, the corresponding Hortonworks Data Platform versions that they use, and their release dates. When known, their support expiration and deprecation dates are also provided. Please note the following:

* Highly available clusters with two head nodes are deployed by default for HDInsight 2.1 and above. They are not available for HDInsight 1.6 clusters.
* Once the support has expired for a particular version, it may not be available through the Azure Portal. The following table indicates which versions are available on the Azure Classic Portal. Cluster versions will continue to be available using the `Version` parameter in the Windows PowerShell [New-AzureRmHDInsightCluster](https://msdn.microsoft.com/library/mt619331.aspx) command and the .NET SDK until its deprecation date.

HDInsight Version|HDP Version|High Availability|Release Date|Available on Azure Portal|Support Expiration Date|Deprecation Date
---|---|---|---|---|---|---
HDI 3.4|HDP 2.4|Yes|03/29/2016|Yes||
HDI 3.3|HDP 2.3|Yes|12/02/2015|Yes||
HDI 3.2|HDP 2.2|Yes|2/18/2015|Yes||
HDI 3.1|HDP 2.1|Yes|6/24/2014|Yes||
HDI 3.0|HDP 2.0|Yes|02/11/2014|Yes|09/17/2014|06/30/2015
HDI 2.1|HDP 1.3|Yes|10/28/2013|Yes|05/12/2014|05/31/2015
HDI 1.6|HDP 1.1|No|10/28/2013|Yes|04/26/2014|05/31/2015

**Deployment of non-default clusters**

### The service-level agreement for HDInsight cluster versions

The SLA is defined in terms of a "Support Window". A Support Window refers to the period of time that an HDInsight cluster version is supported by Microsoft Customer Service and Support. An HDInsight cluster is outside the Support Window if its version has a **Support Expiration Date** past the current date. A list of supported HDInsight cluster versions can be found in the table above. The support expiration date for a given HDInsight version X (once a newer X+1 version is available) is calculated as the later of:  

- Formula 1: Add 180 days to the date HDInsight cluster version X was released.
- Formula 2: Add 90 days to the date HDInsight cluster version X+1 (the subsequent version after X) is made available in the Portal.

The **Deprecation Date** is the date after which the cluster version cannot be created on HDInsight.

> [AZURE.NOTE] Both HDInsight 2.1 and 3.0 clusters run on Azure Guest OS [Family 4](../cloud-services/cloud-services-guestos-update-matrix.md), which uses the 64-bit version of Windows Server 2012 R2 and supports .NET Framework 4.0, 4.5. and 4.5.1.

## Hortonworks release notes associated with HDInsight versions##

* HDInsight cluster version 3.4 uses a Hadoop distribution that is based on [Hortonworks Data Platform 2.4](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.4.0/bk_HDP_RelNotes/content/ch_relnotes_v240.html).



* HDInsight cluster version 3.3 uses a Hadoop distribution that is based on [Hortonworks Data Platform 2.3](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.3.0/bk_HDP_RelNotes/content/ch_relnotes_v230.html).
	* Apache Storm release notes is available [here](https://storm.apache.org/2015/11/05/storm0100-released.html).
	* Apache Hive release notes is available [here](https://issues.apache.org/jira/secure/ReleaseNote.jspa?version=12332384&styleName=Text&projectId=12310843).

* HDInsight cluster version 3.2 uses a Hadoop distribution that is based on [Hortonworks Data Platform 2.2][hdp-2-2].  This is the **default** Hadoop cluster created when using the portal.

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
