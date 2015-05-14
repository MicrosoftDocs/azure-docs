<properties 
	pageTitle="What's new in Hadoop cluster versions of HDInsight? | Microsoft Azure" 
	description="HDInsight supports multiple Hadoop cluster versions deployable at any time. See the Hadoop and HortonWorks Data Platform (HDP) distribution versions supported." 
	services="hdinsight" 
	editor="cgronlun" 
	manager="paulettm" 
	authors="bradsev" 
	documentationCenter=""/>

<tags 
	ms.service="hdinsight" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/18/2015" 
	ms.author="bradsev"/>


#What's new in the Hadoop cluster versions provided by HDInsight?

##HDInsight versions and Hadoop components
Azure HDInsight supports multiple Hadoop cluster versions that can be deployed at any time. Each version choice provisions a specific version of the Hortonworks Data Platform (HDP) distribution and a set of components that are contained within that distribution. The component versions associated with HDInsight cluster versions are itemized in the following table. Note that the default cluster version used by Azure HDInsight is currently 3.1, and, as of 11/7/2014, based on HDP 2.1.7.


<table border="1">
<tr><th>Component</th><th>HDInsight Version 3.2</th><th>HDInsight Version 3.1 (Default)</th><th>HDInsight Version 3.0</th><th>HDInsight Version 2.1</th></tr>
<tr><td>Hortonworks Data Platform</td><td>2.2</td><td>2.1.7</td><td>2.0</td><td>1.3</td></tr>
<tr><td>Apache Hadoop & YARN</td><td>2.6.0</td><td>2.4.0</td><td>2.2.0</td><td>1.2.0</td></tr>
<tr><td>Tez</td><td>0.5.2</td><td>0.4.0</td><td></td><td></td></tr>
<tr><td>Apache Pig</td><td>0.14.0</td><td>0.12.1</td><td>0.12.0</td><td>0.11.0</td></tr>
<tr><td>Apache Hive & HCatalog</td><td>0.14.0</td><td>0.13.1</td><td>0.12.0</td><td>0.11.0</td></tr>
<tr><td>HBase </td><td>0.98.4</td><td>0.98.0</td><td></td><td></td></tr>
<tr><td>Apache Sqoop</td><td>1.4.5</td><td>1.4.4</td><td>1.4.4</td><td>1.4.3</td></tr>
<tr><td>Apache Oozie</td><td>4.1.0</td><td>4.0.0</td><td>4.0.0</td><td>3.3.2</td></tr>
<tr><td>Zookeeper</td><td>3.4.6</td><td>3.4.5</td><td>3.4.5</td><td></td></tr>
<tr><td>Storm</td><td>0.9.3</td><td>0.9.1</td><td></td><td></td></tr>
<tr><td>Mahout</td><td>0.9.0</td><td>0.9.0</td><td></td><td></td></tr>
<tr><td>Phoenix</td><td>4.2.0</td><td>4.0.0.2.1.7.0-2162</td><td></td><td></td></tr>
</table>


**Get current component version information**

The component versions associated with HDInsight cluster versions may change in future updates to HDInsight. One way to determine the available components and to verify which versions are being used for a cluster is to use the Ambari REST API. The **GetComponentInformation** command can be used to retrieve information about a service component. For details, see the [Ambari documentation][ambari-docs]. Another way to obtain this information is to log in to a cluster by using Remote Desktop and examine the contents of the "C:\apps\dist\" directory directly.


**Release notes**	

See [HDInsight release notes](hdinsight-release-notes.md) for additional release notes on the latest versions of HDInsight.

### Select a version when provisioning an HDInsight cluster

When creating a cluster through the HDInsight Windows PowerShell cmdlets or the HDInsight .NET SDK, you can choose the version for the HDInsight Hadoop cluster by using the "Version" parameter.

If you use the **Quick Create** option, you will get version 3.1 of HDInsight, which creates a Hadoop cluster by default. If you use the **Custom Create** option from the Azure portal, you can choose the version of the cluster you will deploy from the **HDInsight Version** drop-down on the **Cluster Details** page. 

##Feature highlights
Some of the salient features of the HDInsight platform include:

- **Storm** - Storm on Azure HDInsight is now generally available, giving a fast and easy way to deploy real-time analytics in just a few clicks and within minutes. Apache Storm on Azure HDInsight is an open-source project in the Apache Hadoop ecosystem that provides access to an analytics platform capable of reliably processing millions of events. Now Hadoop users can gain insights as events happen, along with insights from past events. Microsoft is also providing built-in integration with Visual Studio, making developer interaction with Storm easy. You can now develop, deploy, and debug Storm topologies from within Visual Studio.

- **HDInsight on Linux (Preview)** - Azure HDInsight provides the option of provisioning Hadoop clusters that run on Linux (Ubuntu) virtual machines (VMs). You can use this option if you are familiar with Linux or Unix, are migrating from an existing Linux-based Hadoop solution, or want easy integration with Hadoop ecosystem components built for Linux. You can provision an HDInsight cluster on Linux from a client computer running Windows or Linux by using the Azure portal, the Azure cross-platform command-line interface (CLI), or the HDInsight .NET SDK (Windows only).

- **Additional VM sizes** - HDInsight clusters are now available on more VM types and sizes. HDInsight clusters can now utilize A2 to A7 sizes built for general purposes; D-Series nodes that feature solid-state drives (SSDs) and 60-percent faster processors; and A8 and A9 sizes that have InfiniBand support for fast networking. Apache HBase on Azure HDInsight customers can benefit from the larger memory configurations of the D-Series to increase performance. Apache Storm on Azure HDInsight customers can also benefit from additional memory for loading larger reference data sets, as well as faster CPUs for higher throughput.

- **Cluster scaling** - Cluster scaling enables you to change the number of nodes of a running HDInsight cluster without having to delete or re-create it. Currently, only Hadoop Query and Apache Storm have this ability, but Apache HBase is soon to follow. 

- **Script Action** - This cluster customization feature enables the modification of Hadoop clusters in arbitrary ways by using custom scripts. With this new feature, users can experiment with and deploy projects available from the Apache Hadoop ecosystem to Azure HDInsight clusters. This customization feature is available on all types of HDInsight clusters, including Hadoop, HBase and Storm.

- **HBase** - HBase is a low-latency NoSQL database that allows online transactional processing of big data. HBase is offered as a managed cluster integrated into the Azure environment. The clusters are configured to store data directly in Azure Blob storage, which provides low latency and increased elasticity in performance/cost choices. This enables customers to build interactive websites that work with large datasets, to build services that store sensor and telemetry data from millions of end points, and to analyze this data with Hadoop jobs.

- **Apache Phoenix** - Apache Phoenix is a Structured Query Language (SQL) query layer over HBase. It supports a limited subset of the SQL query language specification, including support of secondary indexes. It is delivered as a client-embedded Java Database Connectivity (JDBC) driver that targets low-latency queries over HBase data. Apache Phoenix takes your SQL query, compiles it into a series of HBase scans and coprocessors calls, and produces regular JDBC result sets. Apache Phoenix is a relational database layer over HBase. It is delivered as a client-embedded JDBC driver that targets low-latency queries over HBase data. Apache Phoenix takes your SQL query, compiles it into a series of HBase scans, and orchestrates the running of those scans to produce regular JDBC result sets.

- **Cluster Dashboard** - A new web application that is deployed to your HDInsight cluster. Use it to run Hive queries, check job logs, and browse Azure Blob storage. The URL used to access the web application is <*ClusterName*>.azurehdinsight.net.

- **Microsoft Avro Library** - This library implements the Apache Avro data serialization system for the Microsoft .NET environment. Apache Avro provides a compact binary data interchange format for serialization. It uses JavaScript Object Notation (JSON) to define a language-agnostic schema that underwrites language interoperability. Data serialized in one language can be read in another. Currently C, C++, C#, Java, PHP, Python, and Ruby are supported. The Apache Avro serialization format is widely used in Azure HDInsight to represent complex data structures within a Hadoop MapReduce job.

- **YARN** - A new, general-purpose, distributed application management framework that has replaced the classic Apache Hadoop MapReduce framework for processing data in Hadoop clusters. It effectively serves as the Hadoop operating system, and takes Hadoop from a single-use data platform for batch processing to a multi-use platform that enables batch, interactive, online and stream processing. This new management framework improves scalability and cluster utilization according to criteria such as capacity guarantees, fairness, and service-level agreements (SLAs).

- **Tez (HDInsight 3.1 and above only)** - A general-purpose and customizable framework that creates simplified data-processing tasks across both small-scale and large-scale workloads in Hadoop. It provides the ability to execute a complex directed acyclic graph (DAG) of tasks for a single job, so that projects in the Apache Hadoop ecosystem, such as Apache Hive and Apache Pig, can meet requirements for human-interactive response times and extreme throughput at petabyte scale. Note that Hive 0.13 allows Hive queries to run on top of Tez, rather than on MapReduce.

- **High Availability (HA)** - A second head node has been added to the Hadoop clusters deployed by HDInsight to increase the availability of the service. Standard implementations of Hadoop clusters typically have a single head node. HDInsight removes this single point of failure with the addition of a secondary head node. The switch to a new HA cluster configuration doesn't change the price of the cluster, unless customers provision clusters with an extra-large head node instead of the default large-size node.

- **Hive performance** - Order-of-magnitude improvements to Hive query response times (up to 40x) and to data compression (up to 80%) using the **Optimized Row Columnar** (ORC) format.

- **Pig, Sqoop, Oozie, Ambari** - Component version upgrades for HDInsight cluster version 3.0 (HDP 2.0/Hadoop 2.2) that provide parity with HDInsight cluster version 2.1 (HDP 1.3/Hadoop 1.2). See the version table below for specifics.

- **Mahout** - This library of scalable machine-learning algorithms is pre-installed on HDInsight 3.1 (and above) Hadoop clusters. So you can run Mahout jobs without the need for any additional cluster configuration.

- **Virtual Network support** - HDInsight clusters can be used with Azure Virtual Network to support isolation of cloud resources or hybrid scenarios that link cloud resources with those in your datacenter.


## Supported versions
The following table lists the versions of HDInsight currently available, the corresponding Hortonworks Data Platform versions that they use, and their release dates. When known, their support expiration and deprecation dates are also provided. Please note the following:

* Highly available clusters with two head nodes are deployed by default for HDInsight 2.1 and above. They are not available for HDInsight 1.6 clusters.
* Once the support has expired for a particular version, it may not be available through the Azure portal. The following table indicates which versions are available on the Azure portal. Cluster versions will continue to be available using the `Version` parameter in the Windows PowerShell [New-AzureHDInsightCluster](http://msdn.microsoft.com/library/dn593744.aspx) command and the .NET SDK until its deprecation date. 

<table border="1">
<tr><th>HDInsight Version</th><th>HDP Version</a><th>High Availability</th></th><th>Release Date</th><th>Available on Azure Portal</th><th>Support Expiration Date</th><th>Deprecation Date</th></tr>
<tr><td>HDI 3.2</td><td>HDP 2.2</td><td>Yes</td><td>2/18/2015</td><td>Yes</td><td></td><td></td></tr>
<tr><td>HDI 3.1</td><td>HDP 2.1</td><td>Yes</td><td>6/24/2014</td><td>Yes</td><td></td><td></td></tr>
<tr><td>HDI 3.0</td><td>HDP 2.0</td><td>Yes</td><td>02/11/2014</td><td>Yes</td><td>09/17/2014</td><td>06/30/2015</td></tr>
<tr><td>HDI 2.1</td><td>HDP 1.3</td><td>Yes</td><td>10/28/2013</td><td>No</td><td>05/12/2014</td><td>05/31/2015</td></tr>
<tr><td>HDI 1.6</td><td>HDP 1.1</td><td>No</td><td>10/28/2013</td><td>No</td><td>04/26/2014</td><td>05/31/2015</td></tr>
</table><br>

**Deployment of non-default clusters**	

HDInsight 3.1 clusters are created by default on Hadoop 2.4, so users must use the **Custom Create** option in the portal to specify other HDInsight cluster versions if they need to be created.

### The service-level agreement for HDInsight cluster versions

The SLA is defined in terms of a "Support Window". A Support Window refers to the period of time that an HDInsight cluster version is supported by Microsoft Customer Service and Support. An HDInsight cluster is outside the Support Window if its version has a **Support Expiration Date** past the current date. A list of supported HDInsight cluster versions can be found in the table above. The support expiration date for a given HDInsight version X (once a newer X+1 version is available) is calculated as the later of:  

- Formula 1: Add 180 days to the date HDInsight cluster version X was released.
- Formula 2: Add 90 days to the date HDInsight cluster version X+1 (the subsequent version after X) is made available in the Azure portal.

The **Deprecation Date** is the date after which the cluster version cannot be created on HDInsight.

> [AZURE.NOTE] Both HDInsight 2.1 and 3.0 clusters run on Azure Guest OS [Family 4](cloud-services-guestos-update-matrix.md), which uses the 64-bit version of Windows Server 2012 R2 and supports .NET Framework 4.0, 4.5. and 4.5.1. 

## Hortonworks release notes associated with HDInsight versions##

* HDInsight cluster version 3.2 uses a Hadoop distribution that is based on [Hortonworks Data Platform 2.2][hdp-2-2].

	* Release notes for specific Apache components - [Hive 0.14](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12310843&version=12326450), [Pig 0.14](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12310730&version=12326954), [HBase 0.98.4](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12310753&version=12326810), [Phoenix 4.2.0](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12315120&version=12327581), [M/R 2.6](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12310941&version=12327180), [HDFS 2.6](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12310942&version=12327181), [YARN 2.6](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12313722&version=12327197), [Common](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12310240&version=12327179), [Tez 0.5.2](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12314426&version=12328742), [Ambari 2.0](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12312020&version=12327486), [Storm 0.9.3](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12314820&version=12327112), [Oozie 4.1.0](https://issues.apache.org/jira/secure/ReleaseNote.jspa?version=12324960&projectId=12311620).


* HDInsight cluster version 3.1 uses a Hadoop distribution that is based on [Hortonworks Data Platform 2.1.7][hdp-2-1-7]. This is the **default** Hadoop cluster created when using the Azure HDInsight portal after 11/7/2014. HDInsight 3.1 clusters created before 11/7/2014 were based on the [Hortonworks Data Platform 2.1.1][hdp-2-1-1]. 

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
