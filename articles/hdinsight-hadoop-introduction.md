<properties 
   pageTitle="Introduction to Hadoop in HDInsight: Big data analysis in the cloud | Azure" 
   description="An introduction to the Hadoop components on HDInsight. Learn how HDInsight uses Hadoop clusters in the cloud to manage, analyze, and report on big data." 
   services="hdinsight" 
   documentationCenter="" 
   authors="cgronlun" 
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


# Introduction to Hadoop in HDInsight: Big data processing and analysis in the cloud

Get an introduction to the Hadoop ecosystem in HDInsight - components, common terminology, and scenarios. Also, find out about tutorials and resources for using Hadoop in HDInsight.

Azure HDInsight deploys and provisions Apache Hadoop clusters in the cloud, providing a software framework designed to manage, analyze, and report on big data. The Hadoop core provides reliable data storage with the Hadoop Distributed File System (HDFS), and a simple MapReduce programming model to process and analyze, in parallel, the data stored in this distributed system.


### What is big data?
Big data refers to data being collected in ever-escalating volumes, at increasingly high velocities, and for a widening variety of unstructured formats and variable semantic contexts. 

Big data describes any large body of digital information from the text in a Twitter feed, to the sensor information from industrial equipment, to information about customer browsing and purchases on an online catalog. Big data can be historical (meaning stored data) or real-time (meaning streamed directly from the source). 

For big data to provide actionable intelligence or insight, not only must the right questions be asked and data relevant to the issues be collected, the data must be accessible, cleaned, analyzed, and then presented in a useful way. That's where Hadoop in HDInsight can help.

## In this article

This article provides an overview of Hadoop on HDInsight, including:

* **[Overview of the Hadoop ecosystem on HDInsight:](#overview)**  HDInsight is the Hadoop solution on Azure and provides implementations of Storm, HBase, Pig, Hive, Sqoop, Oozie, Ambari, and so on. HDInsight also integrates with business intelligence (BI) tools such as Excel, SQL Server Analysis Services, and SQL Server Reporting Services.

* **[Advantages of Hadoop in the cloud:](#advantage)** Reasons you should consider HDInsight's cloud implementation of Hadoop.

* **[HDInsight solutions for big data analysis:](#solutions)** Some practical ways you can you HDInsight to answer questions for your organization, from analyzing Twitter sentiment to analyzing HVAC system effectiveness.

* **[Resources for learning more about big data analysis, Hadoop, and HDInsight:](#resources)** Links to  additional information.

## <a name="overview"></a>Overview of the Hadoop ecosystem on HDInsight

Apache Hadoop is the rapidly expanding technology stack that is the go-to solution for big data analysis. HDInsight is the framework for the Microsoft Azure cloud implementation of Hadoop.

* Azure HDInsight deploys and provisions Hadoop clusters in the cloud, using either **Linux** or **Windows** as the underlying OS.

	* **HDInsight on Linux (Preview)** - A Hadoop cluster on Ubuntu. Use this if you are familiar with Linux or Unix, migrating from an existing Linux-based Hadoop solution, or want easy integration with Hadoop ecosystem components built for Linux.

	* **HDInsight on Windows** - A Hadoop cluster on Windows Server. Use this if you are familiar with Windows, are migrating from an existing Windows-based Hadoop solution, or want to integrate with .NET or other Windows capabilities.

	The following table presents a comparison between the two:

	Category | HDInsight on Linux | HDInsight on Windows 
	---------| -------------------| --------------------
	**Cluster OS** | Ubuntu 12.04 LTS | Windows Server 2012 R2
	**Cluster Type** | Hadoop | Hadoop, HBase, Storm
	**Deployment** | Azure Management Portal, Cross-platform command line, PowerShell | Azure Management Portal, Cross-platform command line, PowerShell, HDInsight .NET SDK
	**Cluster UI** | Ambari | Cluster Dashboard
	**Remote Access** | SSH | RDP
	

* HDInsight uses the **Hortonworks Data Platform (HDP)** Hadoop distribution.

* Apache Hadoop is a software framework for big data management and analysis. HDInsight provides several configurations for specific workloads, or you can <a href="http://azure.microsoft.com/en-us/documentation/articles/hdinsight-hadoop-customize-cluster/" target="_blank">customize clusters using Script Actions</a>.

	* **Hadoop for HDInsight** - Apache Hadoop core provides reliable data storage with the [Hadoop Distributed File System (HDFS)](#HDFS), and a simple [MapReduce](#mapreduce) programming model to process and analyze data in parallel.
	
	* **HBase for HDInsight** - [HBase](#hbase) is an Apache open source NoSQL database built on Hadoop that provides random access and strong consistency for large amounts of unstructured and semi-structured data.
	
	* **Storm for HDInsight** - [Storm](#storm) is a distributed, fault-tolerant, open source computation system that allows you to process data in real time.

In addition to the previous overall configurations, the following individual components are also included on HDInsight clusters.

* **[Ambari](#ambari):** Cluster provisioning, management, and monitoring 

* **[Avro](#avro)** (Microsoft .NET Library for Avro): Data serialization for the Microsoft .NET environment 

* **[Hive](#hive):** SQL-like querying

* **[Mahout](#mahout):** Machine learning

* **[MapReduce and YARN](#mapreduce):** Distributed processing and resource management

* **[Oozie](#oozie):** Workflow management

* **[Pig](#pig):** Simpler scripting for MapReduce transformations

* **[Sqoop](#sqoop):** Data import and export 

* **[Zookeeper](#zookeeper):** Coordinates processes in distributed systems

> [AZURE.NOTE] For information on the specific components and version information, see [What's new in the Hadoop cluster versions provided by HDInsight?][component-versioning]

###<a name="ambari"></a>Ambari

Apache Ambari is for provisioning, managing and monitoring Apache Hadoop clusters. It includes an intuitive collection of operator tools and a robust set of APIs that hide the complexity of Hadoop, simplifying the operation of clusters. See [Manage HDInsight clusters using Ambari](../hdinsight-hadoop-manage-ambari) (Linux only),  [Monitor Hadoop clusters in HDInsight using the Ambari API](../hdinsight-monitor-use-ambari-api/), and <a target="_blank" href="https://github.com/apache/ambari/blob/trunk/ambari-server/docs/api/v1/index.md">Apache Ambari API reference</a>.

### <a name="avro"></a>Avro (Microsoft .NET Library for Avro)

The Microsoft .NET Library for Avro implements the Apache Avro compact binary data interchange format for serialization for the Microsoft .NET environment. It uses <a target="_blank" href="http://www.json.org/">JSON</a> to define a language-agnostic schema that underwrites language interoperability, meaning data serialized in one language can be read in another. Detailed information on the format can be found in the <a target=_"blank" href="http://avro.apache.org/docs/current/spec.html">Apache Avro Specification</a>. 
The format of Avro files supports the distributed MapReduce programming model. Files are “splittable”, meaning you can seek any point in a file and start reading from a particular block. To find out how, see [Serialize data with the Microsoft .NET Library for Avro](../hdinsight-dotnet-avro-serialization/).

### <a name="hbase"></a>HBase

<a target="_blank" href="http://hbase.apache.org/">Apache HBase</a> is a non-relational database built on Hadoop and designed for large amounts of unstructured and semi-structured data - potentially billions of rows times millions of columns. HBase clusters on HDInsight are configured to store data directly in Azure Blob storage, with low latency and increased elasticity. See [Overview of HBase on HDInsight](../hdinsight-hbase-overview/).

### <a name="hdfs"></a>HDFS

Hadoop Distributed File System (HDFS) is a distributed file system that, with MapReduce and YARN, is the core of the Hadoop ecosystem. HDFS is the standard file system for Hadoop clusters on HDInsight.

### <a name="hive"></a>Hive

<a target="_blank" href="http://hive.apache.org/">Apache Hive</a> is data warehouse software built on Hadoop that allows you to query and manage large datasets in distributed storage using a SQL-like language call HiveQL. Hive, like Pig, is an abstraction on top of MapReduce and when run, Hive translates queries into a series of MapReduce jobs. Hive is conceptually closer to a relational database management system than Pig, and is therefore appropriate for use with more structured data. For unstructured data, Pig is better choice. See [Use Hive with Hadoop in HDInsight](../hdinsight-use-hive/)

### <a name="mahout"></a>Mahout

<a target="_blank" href="https://mahout.apache.org/">Apache Mahout</a> is a scalable library of machine learning algorithms that run on Hadoop. Using principles of statistics, machine learning applications teach systems to learn from data and to use past outcomes to determine future behavior. See [Generate movie recommendations using Mahout on Hadoop](../hdinsight-mahout/).

### <a name="mapreduce"></a>MapReduce and YARN
Hadoop MapReduce is a software framework for writing applications to process big data sets in parallel. A MapReduce job splits large data sets and organizes the data into key-value pairs for processing. 

Apache YARN is the next generation of MapReduce (MapReduce 2.0, or MRv2) that splits the two major tasks of JobTracker - resource management and job scheduling/monitoring - into separate entities.

For more information on MapReduce, see <a target="_blank" href="http://wiki.apache.org/hadoop/MapReduce">MapReduce</a> in the Hadoop Wiki. To learn about YARN, see <a target="_blank" href="http://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/YARN.html">Apache Hadoop NextGen MapReduce (YARN)</a>.

### <a name="oozie"></a>Oozie
<a target="_blank" href="http://oozie.apache.org/">Apache Oozie</a> is a workflow coordination system that manages Hadoop jobs. It is integrated with the Hadoop stack and supports Hadoop jobs for MapReduce, Pig, Hive, and Sqoop. It can also be used to schedule jobs specific to a system, like Java programs or shell scripts. See [Use a time-based Oozie Coordinator with Hadoop in HDInsight](../hdinsight-use-oozie-coordinator-time/).

### <a name="pig"></a>Pig

<a  target="_blank" href="http://pig.apache.org/">Apache Pig</a> is a high-level platform that allows you to perform complex MapReduce transformations on very large data sets using a simple scripting language called Pig Latin. Pig translates the Pig Latin scripts so they’ll run within Hadoop. You can create User Defined Functions (UDFs) to extend Pig Latin. See [Use Pig with Hadoop to analyze an Apache log file](../hdinsight-use-pig/).

### <a name="sqoop"></a>Sqoop
<a  target="_blank" href="http://sqoop.apache.org/">Apache Sqoop</a> is tool that transfers bulk data between Hadoop and relational databases such a SQL, or other structured data stores, as efficiently as possible. See [Use Sqoop with Hadoop](../hdinsight-use-sqoop/).

### <a name="storm"></a>Storm
<a  target="_blank" href="https://storm.incubator.apache.org/">Apache Storm</a> is a distributed, real-time computation system for processing large streams of data fast. Storm is offered as a managed cluster in HDInsight. See [Analyze real-time sensor data using Storm and Hadoop](../hdinsight-storm-sensor-data-analysis/).

### <a name="zookeeper"></a>Zookeeper
<a  target="_blank" href="http://zookeeper.apache.org/">Apache Zookeeper</a> coordinates processes in large distributed systems by means of a shared hierarchical namespace of data registers (znodes). Znodes contain small amounts of meta information needed to coordinate processes: status, location, configuration, and so on. 

## <a name="advantage"></a>Advantages of Hadoop in the cloud

As part of the Azure cloud ecosystem, Hadoop in HDInsight offers a number of benefits, among them:

* Automatic provisioning of Hadoop clusters. HDInsight clusters are much easier to create than manually configuring Hadoop clusters. For details, see [Provision Hadoop clusters in HDInsight](/en-us/documentation/articles/hdinsight-provision-clusters/)

* State-of-the-art Hadoop components. For details, see [What's new in the Hadoop cluster versions provided by HDInsight?][component-versioning]

* High availability and reliability of clusters. See [Availability and reliability of Hadoop clusters in HDInsight](../hdinsight-high-availability/) for details.

* Efficient and economical data storage with Azure Blob storage, a Hadoop-compatible option. See [Use Azure Blob storage with Hadoop in HDInsight](../hdinsight-use-blob-storage/) for details.

* Integration with other Azure services, including [Websites](../documentation/services/websites/) and [SQL Database](../documentation/services/sql-database/).

* Low entry cost. Start a [free trial](/pricing/free-trial/), or consult [HDInsight pricing details](/pricing/details/hdinsight/).

To read more about the advantages on Hadoop in HDInsight, see the [Azure features page for HDInsight][marketing-page].



## <a id="resources"></a>Resources for learning more about big data analysis, Hadoop, and HDInsight


### HDInsight on Linux (Preview)

* [Get started with HDInsight on Linux](../hdinsight-hadoop-linux-get-started): A quick-start tutorial for provisioning HDInsight Hadoop clusters on Linux and running sample Hive queries.

* [Provision HDInsight on Linux using custom options](../hdinsight-hadoop-provision-linux-clusters): Learn how to provision HDInsight Hadoop cluster on Linux using custom options through the Azure Management Portal, Azure cross-platform command-line, or Azure PowerShell.

* [Working with HDInsight on Linux](../hdinsight-hadoop-linux-information): Get some quick tips on working with Hadoop Linux clusters provisioned on Azure.

* [Manage HDInsight clusters using Ambari](../hdinsight-hadoop-manage-ambari). Learn how to monitor and manage your Linux-based Hadoop on HDInsight cluster using Ambari Web, or the Ambari REST API.


### HDInsight on Windows

* [HDInsight documentation](../documentation/services/hdinsight/): The documentation page for Azure HDInsight with links to articles, videos, and more resources.

* [Learning map for HDInsight](../hdinsight-learn-map): A guided tour of Hadoop documentation for HDInsight.

* [Get started with Azure HDInsight](../hdinsight-get-started/): A quick-start tutorial for using Hadoop in HDInsight.

* [Run the HDInsight samples](../hdinsight-run-samples/): A tutorial on how the run the samples that ship with HDInsight.
	
* [Azure HDInsight SDK](http://msdnstage.redmond.corp.microsoft.com/en-us/library/dn479185.aspx): Reference documentation for the HDinsight SDK.


### Apache Hadoop			

* <a target="_blank" href="http://hadoop.apache.org/">Apache Hadoop</a>: Learn more about the Apache Hadoop software library, a framework that allows for the distributed processing of large data sets across clusters of computers.	

*  <a target="_blank" href="http://hadoop.apache.org/docs/r0.18.1/hdfs_design.html">HDFS</a>: Learn more about the architecture and design of the Hadoop Distributed File System (HDFS), the primary storage system used by Hadoop applications.		

* <a target="_blank" href="http://mapreduce.org/">MapReduce</a>: Learn more about the programming framework for writing Hadoop applications that rapidly process vast amounts of data in parallel on large clusters of compute nodes.	

### SQL Database on Azure	
		
* [Azure SQL Database](http://msdn.microsoft.com/en-us/library/windowsazure/ee336279.aspx): MSDN documentation for SQL Database.
	
* [Management Portal for SQL Database](http://msdn.microsoft.com/en-us/library/windowsazure/gg442309.aspx): A lightweight and easy-to-use database management tool for managing SQL Database in the cloud.

* [Adventure Works for SQL Database](http://msftdbprodsamples.codeplex.com/releases/view/37304): Download page for SQL Database sample database.	

### Microsoft business intelligence (for HDInsight on Windows)

Familiar business intelligence (BI) tools - such as Excel, PowerPivot, SQL Server Analysis Services and Reporting Services - retrieve, analyze, and report data integrated with HDInsight using either the Power Query add-in or the Microsoft Hive ODBC Driver. 

These BI tools can help in your big data analysis:
 
* [Connect Excel to Hadoop with Power Query](../hdinsight-connect-excel-power-query/): Learn how to connect Excel to the Azure storage account that stores the data associated with your HDInsight cluster by using Microsoft Power Query for Excel. 

* [Connect Excel to Hadoop with the Microsoft Hive ODBC Driver](../hdinsight-connect-excel-hive-ODBC-driver/): Learn how to import data from HDInsight with the Microsoft Hive ODBC Driver.

* [Microsoft Business Intelligence (BI)](http://www.microsoft.com/en-us/server-cloud/solutions/business-intelligence/default.aspx): Learn about Power BI for Office 365, download the SQL Server trial, and set up SharePoint Server 2013 and SQL Server BI.

* <a target="_blank" href="http://www.microsoft.com/en-us/server-cloud/solutions/business-intelligence/analysis.aspx">Learn more about SQL Server Analysis Services</a>.

* <a target="_blank" href="http://msdn.microsoft.com/en-us/library/ms159106.aspx">Learn about SQL Server Reporting Services</a>


### Try HDInsight solutions for big data analysis (for HDInsight on Widows)

Analyze data from your organization to gain insights into your business. Here are some examples: 

* [Analyze HVAC sensor data](../hdinsight-hive-analyze-sensor-data/): Learn how to analyze sensor data using Hive with HDInsight (Hadoop), and then visualize the data in Microsoft Excel. In this sample, you'll use Hive to process historical data produced by HVAC systems to see which systems can't reliably maintain a set temperature.

* [Use Hive with HDInsight to analyze website logs](../hdinsight-hive-analyze-website-log/): Learn how to use HiveQL in HDInsight to analyze website logs to get insight into the frequency of visits in a day from external websites, and a summary of website errors that the users experience.

* [Analyze sensor data in real-time with Storm and HBase in HDInsight (Hadoop)](../hdinsight-storm-sensor-data-analysis/): Learn how to build a solution that uses a Storm cluster in HDInsight to process sensor data from Azure Event Hubs, and then displays the processed sensor data as near-real-time information on a web-based dashboard.

To try Hadoop on HDInsight, see "Get started" articles in the Explore section on the [HDInsight documentation page](../documentation/services/hdinsight/). To try more advanced examples, scroll down to the Analyze section.


[marketing-page]: ../services/hdinsight/
[component-versioning]: ../hdinsight-component-versioning/
[zookeeper]: http://zookeeper.apache.org/ 
