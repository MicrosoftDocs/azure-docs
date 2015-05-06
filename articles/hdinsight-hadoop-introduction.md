<properties 
	pageTitle="What is Hadoop in HDInsight: Cloud big data analysis | Microsoft Azure" 
	description="An introduction to Hadoop components in the cloud in HDInsight. Learn how HDInsight uses Hadoop clusters to manage, analyze, and report on big data." 
	keywords="big data,big data analysis,hadoop,introduction to hadoop,what is hadoop"
	services="hdinsight" 
	documentationCenter="" 
	authors="cjgronlund" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="02/18/2015"
   ms.author="cgronlun"/>


# Introduction to Hadoop in HDInsight: Big-data analysis and processing in the cloud

Get an introduction to Hadoop, its ecosystem, and big data in Azure HDInsight: What is Hadoop in HDInsight and what are the Hadoop components, common terminology, and scenarios for big data analysis. Also, learn about documentation, tutorials, and resources for using Hadoop in HDInsight.

## What is Hadoop in HDInsight?

Azure HDInsight deploys and provisions Apache Hadoop clusters in the cloud, providing a software framework designed to manage, analyze, and report on big data. The Hadoop core provides reliable data storage with the Hadoop Distributed File System (HDFS), and a simple MapReduce programming model to process and analyze, in parallel, the data stored in this distributed system.


## What is big data?
Big data refers to data being collected in ever-escalating volumes, at increasingly high velocities, and for a widening variety of unstructured formats and variable semantic contexts. 

Big data describes any large body of digital information, from the text in a Twitter feed, to the sensor information from industrial equipment, to information about customer browsing and purchases on an online catalog. Big data can be historical (meaning stored data) or real-time (meaning streamed directly from the source). 

For big data to provide actionable intelligence or insight, not only must the right questions be asked and data be relevant to the issues be collected, the data must be accessible, cleaned, analyzed, and then presented in a useful way. That's where big data analysis on Hadoop in HDInsight can help.


## <a name="overview"></a>Overview of the Hadoop ecosystem on HDInsight

HDInsight is a cloud implementation on Microsoft Azure of the rapidly exanding Apache Hadoop technology stack that is the go-to solution for big data analysis. It includes implementations of Storm, HBase, Pig, Hive, Sqoop, Oozie, Ambari, and so on. HDInsight also integrates with business intelligence (BI) tools such as Excel, SQL Server Analysis Services, and SQL Server Reporting Services.


* Azure HDInsight deploys and provisions Hadoop clusters in the cloud, by using either **Linux** or **Windows** as the underlying OS.

	* **HDInsight on Linux (Preview)** - A Hadoop cluster on Ubuntu. Use this if you are familiar with Linux or Unix, are migrating from an existing Linux-based Hadoop solution, or want easy integration with Hadoop ecosystem components built for Linux.

	* **HDInsight on Windows** - A Hadoop cluster on Windows Server. Use this if you are familiar with Windows, are migrating from an existing Windows-based Hadoop solution, or want to integrate with .NET or other Windows capabilities.

	The following table presents a comparison between the two:

	Category | HDInsight on Linux | HDInsight on Windows 
	---------| -------------------| --------------------
	**Cluster OS** | Ubuntu 12.04 Long Term Support (LTS) | Windows Server 2012 R2
	**Cluster Type** | Hadoop | Hadoop, HBase, Storm
	**Deployment** | Azure Management Portal, cross-platform command line, Azure PowerShell | Azure Management Portal, cross-platform command line, Azure PowerShell, HDInsight .NET SDK
	**Cluster UI** | Ambari | Cluster Dashboard
	**Remote Access** | Secure Shell (SSH) | Remote Desktop Protocol (RDP)
	

* HDInsight uses the **Hortonworks Data Platform (HDP)** Hadoop distribution.

* Apache Hadoop is a software framework for big-data management and analysis. HDInsight provides several configurations for specific workloads, or you can <a href="http://azure.microsoft.com/documentation/articles/hdinsight-hadoop-customize-cluster/" target="_blank">customize clusters by using Script Actions</a>.

	* **Hadoop**: Provides reliable data storage with [HDFS](#HDFS), and a simple [MapReduce](#mapreduce) programming model to process and analyze data in parallel.
	
	* **<a target="_blank" href="http://hbase.apache.org/">HBase</a>**: A NoSQL database built on Hadoop that provides random access and strong consistency for large amounts of unstructured and semi-structured data - potentially billions of rows times millions of columns. See [Overview of HBase on HDInsight](hdinsight-hbase-overview.md).
	
	* **<a  target="_blank" href="https://storm.incubator.apache.org/">Apache Storm</a>**: A distributed, real-time computation system for processing large streams of data fast. Storm is offered as a managed cluster in HDInsight. See [Analyze real-time sensor data using Storm and Hadoop](hdinsight-storm-sensor-data-analysis.md).

## What are the Hadoop components?

In addition to the previous overall configurations, the following individual components are also included on HDInsight clusters.

* **[Ambari](#ambari)** - Cluster provisioning, management, and monitoring. 

* **[Avro](#avro)** (Microsoft .NET Library for Avro) - Data serialization for the Microsoft .NET environment. 

* **[Hive](#hive)** - Structured Query Language (SQL)-like querying.

* **[Mahout](#mahout)** - Machine learning.

* **[MapReduce and YARN](#mapreduce)** - Distributed processing and resource management.

* **[Oozie](#oozie)** - Workflow management.

* **[Pig](#pig)** - Simpler scripting for MapReduce transformations.

* **[Sqoop](#sqoop)** - Data import and export. 

* **[ZooKeeper](#zookeeper)** - Coordination of processes in distributed systems.

> [AZURE.NOTE] For information on the specific components and version information, see [What's new in the Hadoop cluster versions provided by HDInsight?][component-versioning]

###<a name="ambari"></a>Ambari

Apache Ambari is for provisioning, managing and monitoring Apache Hadoop clusters. It includes an intuitive collection of operator tools and a robust set of APIs that hide the complexity of Hadoop, simplifying the operation of clusters. See [Manage HDInsight clusters using Ambari](hdinsight-hadoop-manage-ambari.md) (Linux only), [Monitor Hadoop clusters in HDInsight using the Ambari API](hdinsight-monitor-use-ambari-api.md), and <a target="_blank" href="https://github.com/apache/ambari/blob/trunk/ambari-server/docs/api/v1/index.md">Apache Ambari API reference</a>.

### <a name="avro"></a>Avro (Microsoft .NET Library for Avro)

The Microsoft .NET Library for Avro implements the Apache Avro compact binary data interchange format for serialization for the Microsoft .NET environment. It uses <a target="_blank" href="http://www.json.org/">JavaScript Object Notation (JSON)</a> to define a language-agnostic schema that underwrites language interoperability, meaning data serialized in one language can be read in another. Detailed information on the format can be found in the <a target=_"blank" href="http://avro.apache.org/docs/current/spec.html">Apache Avro Specification</a>. 
The format of Avro files supports the distributed MapReduce programming model. Files are “splittable”, meaning you can seek any point in a file and start reading from a particular block. To find out how, see [Serialize data with the Microsoft .NET Library for Avro](hdinsight-dotnet-avro-serialization.md).


### <a name="hdfs"></a>HDFS

Hadoop Distributed File System (HDFS) is a distributed file system that, with MapReduce and YARN, is the core of the Hadoop ecosystem. HDFS is the standard file system for Hadoop clusters on HDInsight.

### <a name="hive"></a>Hive

<a target="_blank" href="http://hive.apache.org/">Apache Hive</a> is data warehouse software built on Hadoop that allows you to query and manage large datasets in distributed storage by using a SQL-like language called HiveQL. Hive, like Pig, is an abstraction on top of MapReduce. When run, Hive translates queries into a series of MapReduce jobs. Hive is conceptually closer to a relational database management system than Pig, and is therefore appropriate for use with more structured data. For unstructured data, Pig is the better choice. See [Use Hive with Hadoop in HDInsight](hdinsight-use-hive.md).

### <a name="mahout"></a>Mahout

<a target="_blank" href="https://mahout.apache.org/">Apache Mahout</a> is a scalable library of machine learning algorithms that run on Hadoop. Using principles of statistics, machine learning applications teach systems to learn from data and to use past outcomes to determine future behavior. See [Generate movie recommendations using Mahout on Hadoop](hdinsight-mahout.md).

### <a name="mapreduce"></a>MapReduce and YARN
Hadoop MapReduce is a software framework for writing applications to process big-data sets in parallel. A MapReduce job splits large datasets and organizes the data into key-value pairs for processing. 

Apache YARN is the next generation of MapReduce (MapReduce 2.0, or MRv2) that splits the two major tasks of JobTracker - resource management and job scheduling/monitoring - into separate entities.

For more information on MapReduce, see <a target="_blank" href="http://wiki.apache.org/hadoop/MapReduce">MapReduce</a> in the Hadoop Wiki. To learn about YARN, see <a target="_blank" href="http://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/YARN.html">Apache Hadoop NextGen MapReduce (YARN)</a>.

### <a name="oozie"></a>Oozie
<a target="_blank" href="http://oozie.apache.org/">Apache Oozie</a> is a workflow coordination system that manages Hadoop jobs. It is integrated with the Hadoop stack and supports Hadoop jobs for MapReduce, Pig, Hive, and Sqoop. It can also be used to schedule jobs specific to a system, like Java programs or shell scripts. See [Use a time-based Oozie Coordinator with Hadoop in HDInsight](hdinsight-use-oozie-coordinator-time.md).

### <a name="pig"></a>Pig

<a  target="_blank" href="http://pig.apache.org/">Apache Pig</a> is a high-level platform that allows you to perform complex MapReduce transformations on very large datasets by using a simple scripting language called Pig Latin. Pig translates the Pig Latin scripts so they’ll run within Hadoop. You can create User Defined Functions (UDFs) to extend Pig Latin. See [Use Pig with Hadoop to analyze an Apache log file](hdinsight-use-pig.md).

### <a name="sqoop"></a>Sqoop
<a  target="_blank" href="http://sqoop.apache.org/">Apache Sqoop</a> is tool that transfers bulk data between Hadoop and relational databases such a SQL, or other structured data stores, as efficiently as possible. See [Use Sqoop with Hadoop](hdinsight-use-sqoop.md).


### <a name="zookeeper"></a>ZooKeeper
<a  target="_blank" href="http://zookeeper.apache.org/">Apache ZooKeeper</a> coordinates processes in large distributed systems by means of a shared hierarchical namespace of data registers (znodes). Znodes contain small amounts of meta information needed to coordinate processes: status, location, configuration, and so on. 

## <a name="advantage"></a>Advantages of Hadoop in the cloud

As part of the Azure cloud ecosystem, Hadoop in HDInsight offers a number of benefits, among them:

* Automatic provisioning of Hadoop clusters. HDInsight clusters are much easier to create than manually configuring Hadoop clusters. For details, see [Provision Hadoop clusters in HDInsight](hdinsight-provision-clusters.md).

* State-of-the-art Hadoop components. For details, see [
* What's new in the Hadoop cluster versions provided by HDInsight?][component-versioning].

* High availability and reliability of clusters. See [Availability and reliability of Hadoop clusters in HDInsight](hdinsight-high-availability.md) for details.

* Efficient and economical data storage with Azure Blob storage, a Hadoop-compatible option. See [Use Azure Blob storage with Hadoop in HDInsight](hdinsight-use-blob-storage.md) for details.

* Integration with other Azure services, including [Websites](../documentation/services/websites/) and [SQL Database](../documentation/services/sql-database/).

* Low entry cost. Start a [free trial](/pricing/free-trial/), or consult [HDInsight pricing details](/pricing/details/hdinsight/).


To read more about the advantages on Hadoop in HDInsight, see the  [Azure features page for HDInsight][marketing-page].



## <a id="resources"></a>Resources for learning more about big-data analysis, Hadoop, and HDInsight

Build on this introduction to Hadoop on HDInsight and big data analysis with the resources below.


### HDInsight on Linux (Preview)

* [Get started with HDInsight on Linux](hdinsight-hadoop-linux-get-started.md) - A quick-start tutorial for provisioning HDInsight Hadoop clusters on Linux and running sample Hive queries.

* [Provision HDInsight on Linux using custom options](hdinsight-hadoop-provision-linux-clusters.md) - Learn how to provision an HDInsight Hadoop cluster on Linux by using custom options through the Azure Management Portal, Azure cross-platform command line, or Azure PowerShell.

* [Working with HDInsight on Linux](hdinsight-hadoop-linux-information.md) - Get some quick tips on working with Hadoop Linux clusters provisioned on Azure.

* [Manage HDInsight clusters using Ambari](hdinsight-hadoop-manage-ambari.md) - Learn how to monitor and manage your Linux-based Hadoop on HDInsight cluster by using Ambari Web, or the Ambari REST API.


### HDInsight on Windows

* [HDInsight documentation](http://azure.microsoft.com/documentation/services/hdinsight/) - The documentation page for Azure HDInsight with links to articles, videos, and more resources.

* [Learning map for HDInsight](hdinsight-learn-map.md) - A guided tour of Hadoop documentation for HDInsight.

* [Get started with Azure HDInsight](hdinsight-get-started.md) - A quick-start tutorial for using Hadoop in HDInsight.

* [Run the HDInsight samples](hdinsight-run-samples.md) - A tutorial on how to run the samples that ship with HDInsight.
	
* [Azure HDInsight SDK](http://msdnstage.redmond.corp.microsoft.com/library/dn479185.aspx) - Reference documentation for the HDInsight SDK.


### Apache Hadoop			

* <a target="_blank" href="http://hadoop.apache.org/">Apache Hadoop</a> - Learn more about the Apache Hadoop software library, a framework that allows for the distributed processing of large datasets across clusters of computers.	

* <a target="_blank" href="http://hadoop.apache.org/docs/r0.18.1/hdfs_design.html">HDFS</a> - Learn more about the architecture and design of the Hadoop Distributed File System, the primary storage system used by Hadoop applications.		

* <a target="_blank" href="http://hadoop.apache.org/docs/r1.2.1/mapred_tutorial.html">MapReduce Tutorial</a> - Learn more about the programming framework for writing Hadoop applications that rapidly process large amounts of data in parallel on large clusters of compute nodes.	

### SQL Database on Azure	
		
* [Azure SQL Database](http://msdn.microsoft.com/library/windowsazure/ee336279.aspx) - MSDN documentation for SQL Database.
	
* [Management Portal for SQL Database](https://msdn.microsoft.com/library/azure/dn771027.aspx) - A lightweight and easy-to-use database management tool for managing SQL Database in the cloud.

* [Adventure Works for SQL Database](http://msftdbprodsamples.codeplex.com/releases/view/37304) - Download page for a SQL Database sample database.	

### Microsoft business intelligence (for HDInsight on Windows)

Familiar business intelligence (BI) tools - such as Excel, PowerPivot, SQL Server Analysis Services, and SQL Server Reporting Services - retrieve, analyze, and report data integrated with HDInsight by using either the Power Query add-in or the Microsoft Hive ODBC Driver. 

These BI tools can help in your big-data analysis:
 
* [Connect Excel to Hadoop with Power Query](hdinsight-connect-excel-power-query.md) - Learn how to connect Excel to the Azure Storage account that stores the data associated with your HDInsight cluster by using Microsoft Power Query for Excel. 

* [Connect Excel to Hadoop with the Microsoft Hive ODBC Driver](hdinsight-connect-excel-hive-ODBC-driver.md) - Learn how to import data from HDInsight with the Microsoft Hive ODBC Driver.

* [Microsoft Cloud Platform](http://www.microsoft.com/server-cloud/solutions/business-intelligence/default.aspx) - Learn about Power BI for Office 365, download the SQL Server trial, and set up SharePoint Server 2013 and SQL Server BI.

* <a target="_blank" https://msdn.microsoft.com/library/hh231701.aspx">Learn more about SQL Server Analysis Services</a>.

* <a target="_blank" href="http://msdn.microsoft.com/library/ms159106.aspx">Learn about SQL Server Reporting Services</a>.


### Try Hadoop solutions for big-data analysis (for HDInsight on Windows)

Use big data analysis on your organization's data to gain insights into your business. Here are some examples: 

* [Analyze HVAC sensor data](hdinsight-hive-analyze-sensor-data.md) - Learn how to analyze sensor data by using Hive with HDInsight (Hadoop), and then visualize the data in Microsoft Excel. In this sample, you'll use Hive to process historical data produced by HVAC systems to see which systems can't reliably maintain a set temperature.

* [Use Hive with HDInsight to analyze website logs](hdinsight-hive-analyze-website-log.md) - Learn how to use HiveQL in HDInsight to analyze website logs to get insight into the frequency of visits in a day from external websites, and a summary of website errors that the users experience.

* [Analyze sensor data in real-time with Storm and HBase in HDInsight (Hadoop)](hdinsight-storm-sensor-data-analysis.md) - Learn how to build a solution that uses a Storm cluster in HDInsight to process sensor data from Azure Event Hubs, and then displays the processed sensor data as near-real-time information on a web-based dashboard.


[marketing-page]: ../services/hdinsight/
[component-versioning]: hdinsight-component-versioning.md
[zookeeper]: http://zookeeper.apache.org/ 
