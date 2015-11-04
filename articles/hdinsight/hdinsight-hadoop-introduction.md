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
   ms.date="09/03/2015"
   ms.author="cgronlun"/>


# Introduction to Hadoop in HDInsight: Big-data analysis and processing in the cloud

Get an introduction to Hadoop, its ecosystem, and big data in Azure HDInsight: What is Hadoop in HDInsight and what are the Hadoop components, common terminology, and scenarios for big data analysis? Also, learn about Hadoop tutorials, documentation, and resources for using Hadoop in HDInsight.

## What is Hadoop in HDInsight?

Azure HDInsight deploys and provisions Apache Hadoop clusters in the cloud, providing a software framework designed to manage, analyze, and report on big data with high reliability and availability. HDInsight uses the **Hortonworks Data Platform (HDP)** Hadoop distribution. Hadoop often refers to the entire Hadoop ecosystem of components, which includes Storm and HBase clusters, as well as other technologies under the Hadoop umbrella. See [Overview of the Hadoop ecosystem on HDInsight](#overview) below for details.


## What is big data?
Big data refers to data being collected in ever-escalating volumes, at increasingly high velocities, and for a widening variety of unstructured formats and variable semantic contexts.

Big data describes any large body of digital information, from the text in a Twitter feed, to the sensor information from industrial equipment, to information about customer browsing and purchases on an online catalog. Big data can be historical (meaning stored data) or real-time (meaning streamed directly from the source).

For big data to provide actionable intelligence or insight, not only must the right questions be asked and data be relevant to the issues be collected, the data must be accessible, cleaned, analyzed, and then presented in a useful way. That's where big data analysis on Hadoop in HDInsight can help.


## <a name="overview"></a>Overview of the Hadoop ecosystem on HDInsight

HDInsight is a cloud implementation on Microsoft Azure of the rapidly exanding Apache Hadoop technology stack that is the go-to solution for big data analysis. It includes implementations of Storm, HBase, Pig, Hive, Sqoop, Oozie, Ambari, and so on. HDInsight also integrates with business intelligence (BI) tools such as Excel, SQL Server Analysis Services, and SQL Server Reporting Services.

### Linux and Windows clusters

Azure HDInsight deploys and provisions Hadoop clusters in the cloud, by using either **Linux** or **Windows** as the underlying OS.

* **HDInsight on Linux** - A Hadoop cluster on Ubuntu. Use this if you are familiar with Linux or Unix, are migrating from an existing Linux-based Hadoop solution, or want easy integration with Hadoop ecosystem components built for Linux.

* **HDInsight on Windows** - A Hadoop cluster on Windows Server. Use this if you are familiar with Windows, are migrating from an existing Windows-based Hadoop solution, or want to use .NET or other Windows-only technologies on the cluster.

The following table compares the two:

Category | Hadoop on Linux | Hadoop on Windows
---------| -------------------| --------------------
**Cluster OS** | Ubuntu 12.04 Long Term Support (LTS) | Windows Server 2012 R2
**Cluster Type** | Hadoop, HBase, Storm | Hadoop, HBase, Storm
**Deployment** | Azure preview portal, Azure CLI, Azure PowerShell | Azure portal, Azure preview portal, Azure CLI, Azure PowerShell, HDInsight .NET SDK
**Cluster UI** | Ambari | Cluster Dashboard
**Remote Access** | Secure Shell (SSH), REST API, ODBC, JDBC | Remote Desktop Protocol (RDP), REST API, ODBC, JDBC



### Hadoop, HBase, Storm, Spark, and customized clusters

HDInsight provides cluster configurations for Hadoop, HBase, or Storm. Or, you can [customize clusters with script actions](hdinsight-hadoop-customize-cluster-linux.md).

* **Hadoop** (the "Query" workload): Provides reliable data storage with [HDFS](#HDFS), and a simple [MapReduce](#mapreduce) programming model to process and analyze data in parallel.

* **<a target="_blank" href="http://hbase.apache.org/">HBase</a>** (the "NoSQL" workload): A NoSQL database built on Hadoop that provides random access and strong consistency for large amounts of unstructured and semi-structured data - potentially billions of rows times millions of columns. See [Overview of HBase on HDInsight](hdinsight-hbase-overview.md).

* **<a  target="_blank" href="https://storm.incubator.apache.org/">Apache Storm</a>** (the "Stream" workload): A distributed, real-time computation system for processing large streams of data fast. Storm is offered as a managed cluster in HDInsight. See [Analyze real-time sensor data using Storm and Hadoop](hdinsight-storm-sensor-data-analysis.md).

#### Example customization scripts

Script Actions are scripts that are ran during cluster provisioning, and can be used to install additional components on the cluster. For Windows-based HDInsight clusters, these are PowerShell scripts. For Linux-based clusters, these are Bash scripts.

The following are example scripts provided by the HDInsight team:

* [Hue](hdinsight-hadoop-hue-linux.md)

	> [AZURE.NOTE] The Hue script is available only for Linux-based clusters.

* [Giraph](hdinsight-hadoop-giraph-install-linux.md)

* [R](hdinsight-hadoop-r-scripts-linux.md)

* [Solr](hdinsight-hadoop-solr-install-linux.md)

* [Spark](hdinsight-hadoop-spark-install-linux.md)

For information on developing your own Script Actions, see [Script Action development with HDInsight](hdinsight-hadoop-script-actions-linux.md).

## What are the Hadoop components?

In addition to the previous overall configurations, the following individual components are also included on HDInsight clusters.

* **[Ambari](#ambari)**: Cluster provisioning, management, and monitoring.

	> [AZURE.NOTE] Only a subset of the Ambari REST API is provided for Windows-based HDInsight clusters.

* **[Avro](#avro)** (Microsoft .NET Library for Avro): Data serialization for the Microsoft .NET environment.

* **[Hive & HCatalog](#hive)**: Structured Query Language (SQL)-like querying, and a table and storage management layer.

* **[Mahout](#mahout)**: Machine learning.

* **[MapReduce and YARN](#mapreduce)**: Distributed processing and resource management.

* **[Oozie](#oozie)**: Workflow management.

* **[Phoenix](#phoenix)**: Relational database layer over HBase.

* **[Pig](#pig)**: Simpler scripting for MapReduce transformations.

* **[Sqoop](#sqoop)**: Data import and export.

* **[Tez](#tez)**: Allows data-intensive processes to run efficiently at scale.

* **[ZooKeeper](#zookeeper)**: Coordination of processes in distributed systems.

> [AZURE.NOTE] For information on the specific components and version information, see [What's new in the Hadoop cluster versions provided by HDInsight?][component-versioning]

###<a name="ambari"></a>Ambari

Apache Ambari is for provisioning, managing and monitoring Apache Hadoop clusters. It includes an intuitive collection of operator tools and a robust set of APIs that hide the complexity of Hadoop, simplifying the operation of clusters. Linux-based HDInsight clusters provide both the Ambari web UI and the Ambari REST API, while Windows-based clusters provide a subset of the REST API.

See [Manage HDInsight clusters using Ambari](hdinsight-hadoop-manage-ambari.md) (Linux only), [Monitor Hadoop clusters in HDInsight using the Ambari API](hdinsight-monitor-use-ambari-api.md), and <a target="_blank" href="https://github.com/apache/ambari/blob/trunk/ambari-server/docs/api/v1/index.md">Apache Ambari API reference</a>.

### <a name="avro"></a>Avro (Microsoft .NET Library for Avro)

The Microsoft .NET Library for Avro implements the Apache Avro compact binary data interchange format for serialization for the Microsoft .NET environment. It uses <a target="_blank" href="http://www.json.org/">JavaScript Object Notation (JSON)</a> to define a language-agnostic schema that underwrites language interoperability, meaning data serialized in one language can be read in another. Detailed information on the format can be found in the <a target=_"blank" href="http://avro.apache.org/docs/current/spec.html">Apache Avro Specification</a>.
The format of Avro files supports the distributed MapReduce programming model. Files are “splittable”, meaning you can seek any point in a file and start reading from a particular block. To find out how, see [Serialize data with the Microsoft .NET Library for Avro](hdinsight-dotnet-avro-serialization.md).


### <a name="hdfs"></a>HDFS

Hadoop Distributed File System (HDFS) is a distributed file system that, with MapReduce and YARN, is the core of the Hadoop ecosystem. HDFS is the standard file system for Hadoop clusters on HDInsight.

### <a name="hive"></a>Hive & HCatalog

<a target="_blank" href="http://hive.apache.org/">Apache Hive</a> is data warehouse software built on Hadoop that allows you to query and manage large datasets in distributed storage by using a SQL-like language called HiveQL. Hive, like Pig, is an abstraction on top of MapReduce. When run, Hive translates queries into a series of MapReduce jobs. Hive is conceptually closer to a relational database management system than Pig, and is therefore appropriate for use with more structured data. For unstructured data, Pig is the better choice. See [Use Hive with Hadoop in HDInsight](hdinsight-use-hive.md).

<a target="_blank" href="https://cwiki.apache.org/confluence/display/Hive/HCatalog/">Apache HCatalog</a> is a table and storage management layer for Hadoop that presents users with a relational view of data. In HCatalog, you can read and write files in any format for which a Hive SerDe (serializer-deserializer) can be written.

### <a name="mahout"></a>Mahout

<a target="_blank" href="https://mahout.apache.org/">Apache Mahout</a> is a scalable library of machine learning algorithms that run on Hadoop. Using principles of statistics, machine learning applications teach systems to learn from data and to use past outcomes to determine future behavior. See [Generate movie recommendations using Mahout on Hadoop](hdinsight-mahout.md).

### <a name="mapreduce"></a>MapReduce and YARN
Hadoop MapReduce is a software framework for writing applications to process big-data sets in parallel. A MapReduce job splits large datasets and organizes the data into key-value pairs for processing.

Apache YARN is the next generation of MapReduce (MapReduce 2.0, or MRv2) that splits the two major tasks of JobTracker - resource management and job scheduling/monitoring - into separate entities.

For more information on MapReduce, see <a target="_blank" href="http://wiki.apache.org/hadoop/MapReduce">MapReduce</a> in the Hadoop Wiki. To learn about YARN, see <a target="_blank" href="http://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/YARN.html">Apache Hadoop NextGen MapReduce (YARN)</a>.

### <a name="oozie"></a>Oozie
<a target="_blank" href="http://oozie.apache.org/">Apache Oozie</a> is a workflow coordination system that manages Hadoop jobs. It is integrated with the Hadoop stack and supports Hadoop jobs for MapReduce, Pig, Hive, and Sqoop. It can also be used to schedule jobs specific to a system, like Java programs or shell scripts. See [Use a time-based Oozie Coordinator with Hadoop](hdinsight-use-oozie-coordinator-time.md).

### <a name="phoenix"></a>Phoenix
<a  target="_blank" href="http://phoenix.apache.org/">Apache Phoenix</a> is a relational database layer over HBase. Phoenix includes a JDBC driver that allows users to query and manage SQL tables directly. Phoenix translates queries and other statements into native NoSQL API calls - instead of using MapReduce - thus enabling faster applications on top of NoSQL stores. See [Use Apache Phoenix and SQuirreL with HBase clusters](hdinsight-hbase-phoenix-squirrel.md).


### <a name="pig"></a>Pig
<a  target="_blank" href="http://pig.apache.org/">Apache Pig</a> is a high-level platform that allows you to perform complex MapReduce transformations on very large datasets by using a simple scripting language called Pig Latin. Pig translates the Pig Latin scripts so they’ll run within Hadoop. You can create User Defined Functions (UDFs) to extend Pig Latin. See [Use Pig with Hadoop to analyze an Apache log file](hdinsight-use-pig.md).

### <a name="sqoop"></a>Sqoop
<a  target="_blank" href="http://sqoop.apache.org/">Apache Sqoop</a> is tool that transfers bulk data between Hadoop and relational databases such a SQL, or other structured data stores, as efficiently as possible. See [Use Sqoop with Hadoop](hdinsight-use-sqoop.md).

### <a name="tez"></a>Tez
<a  target="_blank" href="http://tez.apache.org/">Apache Tez</a> is an application framework built on Hadoop YARN that executes complex, acyclic graphs of general data processing. It's a more flexible and powerful successor to the MapReduce framework that allows data-intensive processes, such as Hive, to run more efficiently at scale. See ["Use Apache Tez for improved performance" in Use Hive and HiveQL](hdinsight-use-hive.md#usetez).


### <a name="zookeeper"></a>ZooKeeper
<a  target="_blank" href="http://zookeeper.apache.org/">Apache ZooKeeper</a> coordinates processes in large distributed systems by means of a shared hierarchical namespace of data registers (znodes). Znodes contain small amounts of meta information needed to coordinate processes: status, location, configuration, and so on.

## <a name="advantage"></a>Advantages of Hadoop in the cloud

As part of the Azure cloud ecosystem, Hadoop in HDInsight offers a number of benefits, among them:

* Automatic provisioning of Hadoop clusters. HDInsight clusters are much easier to create than manually configuring Hadoop clusters. For details, see [Provision Hadoop clusters in HDInsight](hdinsight-hadoop-provision-linux-clusters.md).

* State-of-the-art Hadoop components. For details, see [What's new in the Hadoop cluster versions provided by HDInsight?][component-versioning].

* High availability and reliability of clusters. See [Availability and reliability of Hadoop clusters in HDInsight](hdinsight-high-availability-linux.md) for details.

* Efficient and economical data storage with Azure Blob storage, a Hadoop-compatible option. See [Use Azure Blob storage with Hadoop in HDInsight](hdinsight-hadoop-use-blob-storage.md) for details.

* Integration with other Azure services, including [Web apps](../documentation/services/app-service/web/) and [SQL Database](../documentation/services/sql-database/).

* Low entry cost. Start a [free trial](/pricing/free-trial/), or consult [HDInsight pricing details](/pricing/details/hdinsight/).


To read more about the advantages on Hadoop in HDInsight, see the  [Azure features page for HDInsight][marketing-page].



## <a id="resources"></a>Resources for learning more about big-data analysis, Hadoop, and HDInsight

Build on this introduction to Hadoop on HDInsight and big data analysis with the resources below.


### HDInsight on Linux

* [HDInsight documentation](http://azure.microsoft.com/documentation/services/hdinsight/): The documentation page for Azure HDInsight with links to articles, videos, and more resources.

* [Get started with HDInsight on Linux](hdinsight-hadoop-linux-tutorial-get-started.md): A quick-start tutorial for provisioning HDInsight Hadoop clusters on Linux and running sample Hive queries.

* [Get started with Linux-based Storm on HDInsight](hdinsight-apache-storm-tutorial-get-started-linux.md): A quick-start tutorial for provisioning a Storm on HDInsight cluster and running sample Storm topologies.

* [Provision HDInsight on Linux](hdinsight-hadoop-provision-linux-clusters.md): Learn how to provision an HDInsight Hadoop cluster on Linux through the Azure Portal, Azure CLI, or Azure PowerShell.

* [Working with HDInsight on Linux](hdinsight-hadoop-linux-information.md): Get some quick tips on working with Hadoop Linux clusters provisioned on Azure.

* [Manage HDInsight clusters using Ambari](hdinsight-hadoop-manage-ambari.md): Learn how to monitor and manage your Linux-based Hadoop on HDInsight cluster by using Ambari Web, or the Ambari REST API.


### HDInsight on Windows

* [HDInsight documentation](http://azure.microsoft.com/documentation/services/hdinsight/): The documentation page for Azure HDInsight with links to articles, videos, and more resources.

* [Learning map for HDInsight](hdinsight-learn-map.md): A guided tour of Hadoop documentation for HDInsight.

* [Get started with Azure HDInsight](hdinsight-hadoop-tutorial-get-started-windows.md): A quick-start tutorial for using Hadoop in HDInsight.

* [Run the HDInsight samples](hdinsight-run-samples.md): A tutorial on how to run the samples that ship with HDInsight.

* [Azure HDInsight SDK](http://msdnstage.redmond.corp.microsoft.com/library/dn479185.aspx): Reference documentation for the HDInsight SDK.


### Apache Hadoop

* <a target="_blank" href="http://hadoop.apache.org/">Apache Hadoop</a>: Learn more about the Apache Hadoop software library, a framework that allows for the distributed processing of large datasets across clusters of computers.

* <a target="_blank" href="http://hadoop.apache.org/docs/r1.0.4/hdfs_design.html">HDFS</a>: Learn more about the architecture and design of the Hadoop Distributed File System, the primary storage system used by Hadoop applications.

* <a target="_blank" href="http://hadoop.apache.org/docs/r1.2.1/mapred_tutorial.html">MapReduce Tutorial</a>: Learn more about the programming framework for writing Hadoop applications that rapidly process large amounts of data in parallel on large clusters of compute nodes.

### SQL Database on Azure

* [Azure SQL Database](http://msdn.microsoft.com/library/windowsazure/ee336279.aspx): MSDN documentation for SQL Database.

* [Management Portal for SQL Database](https://msdn.microsoft.com/library/azure/dn771027.aspx): A lightweight and easy-to-use database management tool for managing SQL Database in the cloud.

* [Adventure Works for SQL Database](http://msftdbprodsamples.codeplex.com/releases/view/37304): Download page for a SQL Database sample database.

### Microsoft business intelligence (for HDInsight on Windows)

Familiar business intelligence (BI) tools - such as Excel, PowerPivot, SQL Server Analysis Services, and SQL Server Reporting Services - retrieve, analyze, and report data integrated with HDInsight by using either the Power Query add-in or the Microsoft Hive ODBC Driver.

These BI tools can help in your big-data analysis:

* [Connect Excel to Hadoop with Power Query](hdinsight-connect-excel-power-query.md): Learn how to connect Excel to the Azure Storage account that stores the data associated with your HDInsight cluster by using Microsoft Power Query for Excel.

* [Connect Excel to Hadoop with the Microsoft Hive ODBC Driver](hdinsight-connect-excel-hive-ODBC-driver.md): Learn how to import data from HDInsight with the Microsoft Hive ODBC Driver.

* [Microsoft Cloud Platform](http://www.microsoft.com/server-cloud/solutions/business-intelligence/default.aspx): Learn about Power BI for Office 365, download the SQL Server trial, and set up SharePoint Server 2013 and SQL Server BI.

* <a target="_blank" href="http://msdn.microsoft.com/library/hh231701.aspx">Learn more about SQL Server Analysis Services</a>.

* <a target="_blank" href="http://msdn.microsoft.com/library/ms159106.aspx">Learn about SQL Server Reporting Services</a>.


### Try Hadoop solutions for big-data analysis (for HDInsight on Windows)

Use big data analysis on your organization's data to gain insights into your business. Here are some examples:

* [Analyze HVAC sensor data](hdinsight-hive-analyze-sensor-data.md): Learn how to analyze sensor data by using Hive with HDInsight (Hadoop), and then visualize the data in Microsoft Excel. In this sample, you'll use Hive to process historical data produced by HVAC systems to see which systems can't reliably maintain a set temperature.

* [Use Hive with HDInsight to analyze website logs](hdinsight-hive-analyze-website-log.md): Learn how to use HiveQL in HDInsight to analyze website logs to get insight into the frequency of visits in a day from external websites, and a summary of website errors that the users experience.

* [Analyze sensor data in real-time with Storm and HBase in HDInsight (Hadoop)](hdinsight-storm-sensor-data-analysis.md): Learn how to build a solution that uses a Storm cluster in HDInsight to process sensor data from Azure Event Hubs, and then displays the processed sensor data as near-real-time information on a web-based dashboard.


[marketing-page]: ../services/hdinsight/
[component-versioning]: hdinsight-component-versioning.md
[zookeeper]: http://zookeeper.apache.org/
