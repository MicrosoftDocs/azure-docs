---
title: What are HDInsight, the Hadoop technology stack & clusters? - Azure | Microsoft Docs
description: An introduction to HDInsight and the Hadoop technology stack and components, including Spark, Kafka, Hive, HBase for big data analysis.
keywords: azure hadoop, hadoop azure, hadoop intro, hadoop introduction, hadoop technology stack, intro to hadoop, introduction to hadoop, what is a hadoop cluster, what is hadoop cluster, what is hadoop used for
services: hdinsight
documentationcenter: ''
author: cjgronlund
manager: jhubbard
editor: cgronlun

ms.assetid: e56a396a-1b39-43e0-b543-f2dee5b8dd3a
ms.service: hdinsight
ms.custom: hdinsightactive,hdiseo17may2017
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 07/20/2017
ms.author: cgronlun

---
# Introduction to Azure HDInsight, the Hadoop technology stack, and Hadoop clusters
 This article provides an introduction to Azure HDInsight, a cloud distribution of the Hadoop technology stack. It also covers what a Hadoop cluster is and when you would use it. 

## What is HDInsight and the Hadoop technology stack? 
Azure HDInsight is a cloud distribution of the Hadoop components from the [Hortonworks Data Platform (HDP)](https://hortonworks.com/products/data-center/hdp/). [Apache Hadoop](http://hadoop.apache.org/) was the original open-source framework for distributed processing and analysis of big data sets on clusters of computers. 


The Hadoop technology stack includes related software and utilities, including Apache Hive, HBase, Spark, Kafka, and many others. To see available Hadoop technology stack components on HDInsight, see [Components and versions available with HDInsight][component-versioning]. To read more about Hadoop in HDInsight, see the [Azure features page for HDInsight](https://azure.microsoft.com/services/hdinsight/).

## What is a Hadoop cluster, and when do you use it?
*Hadoop* is also a cluster type that has:

* YARN for job scheduling and resource management
* MapReduce for parallel processing
* The Hadoop distributed file system (HDFS)
  
Hadoop clusters are most often used for batch processing of stored data. Other kinds of clusters in HDInsight have additional capabilities: Spark has grown in popularity because of its faster, in-memory processing. See [Cluster types on HDInsight](#overview) for details.

## What is big data?
Big data describes any large body of digital information, such as:

* Sensor data from industrial equipment
* Customer activity collected from a website
* A Twitter newsfeed

Big data is being collected in escalating volumes, at higher velocities, and in a greater variety of formats. It can be historical (meaning stored) or real time (meaning streamed from the source). 

## <a name="overview"></a>Cluster types in HDInsight
HDInsight includes specific cluster types and cluster customization capabilities, such as adding components, utilities, and languages.

### Spark, Kafka, Interactive Hive, HBase, customized, and other cluster types
HDInsight offers the following cluster types:

* **[Apache Hadoop](https://wiki.apache.org/hadoop)**: Uses [HDFS](#hdfs), [YARN](#yarn) resource management, and a simple [MapReduce](#mapreduce) programming model to process and analyze batch data in parallel.
* **[Apache Spark](http://spark.apache.org/)**: A parallel processing framework that supports in-memory processing to boost the performance of big-data analysis applications, Spark works for SQL, streaming data, and machine learning. See [What is Apache Spark in HDInsight?](hdinsight-apache-spark-overview.md)
* **[Apache HBase](http://hbase.apache.org/)**: A NoSQL database built on Hadoop that provides random access and strong consistency for large amounts of unstructured and semi-structured data - potentially billions of rows times millions of columns. See [What is HBase on HDInsight?](hdinsight-hbase-overview.md)
* **[Microsoft R Server](https://msdn.microsoft.com/microsoft-r/rserver)**: A server for hosting and managing parallel, distributed R processes. It provides data scientists, statisticians, and R programmers with on-demand access to scalable, distributed methods of analytics on HDInsight. See [Overview of R Server on HDInsight](hdinsight-hadoop-r-server-overview.md).
* **[Apache Storm](https://storm.incubator.apache.org/)**: A distributed, real-time computation system for processing large streams of data fast. Storm is offered as a managed cluster in HDInsight. See [Analyze real-time sensor data using Storm and Hadoop](hdinsight-storm-sensor-data-analysis.md).
* **[Apache Interactive Hive preview (AKA: Live Long and Process)](https://cwiki.apache.org/confluence/display/Hive/LLAP)**: In-memory caching for interactive and faster Hive queries. See [Use Interactive Hive in HDInsight](hdinsight-hadoop-use-interactive-hive.md).
* **[Apache Kafka](https://kafka.apache.org/)**: An open-source platform used for building streaming data pipelines and applications. Kafka also provides message-queue functionality that allows you to publish and subscribe to data streams. See [Introduction to Apache Kafka on HDInsight](hdinsight-apache-kafka-introduction.md).

You can also configure clusters using the following methods:
* **[Domain-joined clusters preview](hdinsight-domain-joined-introduction.md)**: A cluster joined to an Active Directory domain so that you can control access and provide governance for data.
* **[Custom clusters with script actions](hdinsight-hadoop-customize-cluster-linux.md)**: Clusters with scripts that run during provisioning and install additional components.

### Example cluster customization scripts
Script actions are Bash scripts on Linux that run during cluster provisioning, and that can be used to install additional components on the cluster. 

The following example scripts are provided by the HDInsight team:

* **[Hue](hdinsight-hadoop-hue-linux.md)**: A set of web applications used to interact with a cluster. Linux clusters only.
* **[Giraph](hdinsight-hadoop-giraph-install-linux.md)**: Graph processing to model relationships between things or people.
* **[Solr](hdinsight-hadoop-solr-install-linux.md)**: An enterprise-scale search platform that allows full-text search on data.

For information on developing your own Script Actions, see [Script Action development with HDInsight](hdinsight-hadoop-script-actions-linux.md).

## Components and utilities on HDInsight clusters
The following components and utilities are included on HDInsight clusters:

* **[Ambari](#ambari)**: Cluster provisioning, management, monitoring, and utilities.
* **[Avro](#avro)** (Microsoft .NET Library for Avro): Data serialization for the Microsoft .NET environment. 
* **[Hive & HCatalog](#hive)**: SQL-like querying, and a table and storage management layer.
* **[Mahout](#mahout)**: For scalable machine learning applications.
* **[MapReduce](#mapreduce)**: Legacy framework for Hadoop distributed processing and resource management. See [YARN](#yarn).
* **[Oozie](#oozie)**: Workflow management.
* **[Phoenix](#phoenix)**: Relational database layer over HBase.
* **[Pig](#pig)**: Simpler scripting for MapReduce transformations.
* **[Sqoop](#sqoop)**: Data import and export.
* **[Tez](#tez)**: Allows data-intensive processes to run efficiently at scale.
* **[YARN](#yarn)**: Resource management that is part of the Hadoop core library.
* **[ZooKeeper](#zookeeper)**: Coordination of processes in distributed systems.

> [!NOTE]
> For information on the specific components and version information, see [Hadoop components and versions in HDInsight][component-versioning]
>
>

### <a name="ambari"></a>Ambari
Apache Ambari is for provisioning, managing, and monitoring Apache Hadoop clusters. It includes an intuitive collection of operator tools and a robust set of APIs that hide the complexity of Hadoop, simplifying the operation of clusters. HDInsight clusters on Linux provide both the Ambari web UI and the Ambari REST API. Ambari Views on HDInsight clusters allow plug-in UI capabilities.
See [Manage HDInsight clusters using Ambari](hdinsight-hadoop-manage-ambari.md) and <a target="_blank" href="https://github.com/apache/ambari/blob/trunk/ambari-server/docs/api/v1/index.md">Apache Ambari API reference</a>.

### <a name="avro"></a>Avro (Microsoft .NET Library for Avro)
The Microsoft .NET Library for Avro implements the Apache Avro compact binary data interchange format for serialization for the Microsoft .NET environment. It defines a language-agnostic schema so that data serialized in one language can be read in another. Detailed information on the format can be found in the <a target=_"blank" href="http://avro.apache.org/docs/current/spec.html">Apache Avro Specification</a>. The format of Avro files supports the distributed MapReduce programming model: Files are “splittable”, meaning you can seek any point in a file and start reading from a particular block. To find out how, see [Serialize data with the Microsoft .NET Library for Avro](hdinsight-dotnet-avro-serialization.md). Linux-based cluster support to come.

### <a name="hdfs"></a>HDFS
Hadoop Distributed File System (HDFS) is a file system that, with YARN and MapReduce, is the core of Hadoop technology. It's the standard file system for Hadoop clusters on HDInsight. See [Query data from HDFS-compatible storage](hdinsight-hadoop-use-blob-storage.md).

### <a name="hive"></a>Hive & HCatalog
<a target="_blank" href="http://hive.apache.org/">Apache Hive</a> is data warehouse software built on Hadoop that allows you to query and manage large datasets in distributed storage by using a SQL-like language called HiveQL. Hive, like Pig, is an abstraction on top of MapReduce, and it translates queries into a series of MapReduce jobs. Hive is closer to a relational database management system than Pig, and is used with more structured data. For unstructured data, Pig is the better choice. See [Use Hive with Hadoop in HDInsight](hdinsight-use-hive.md).

<a target="_blank" href="https://cwiki.apache.org/confluence/display/Hive/HCatalog/">Apache HCatalog</a> is a table and storage management layer for Hadoop that presents you with a relational view of data. In HCatalog, you can read and write files in any format that works for a Hive SerDe (serializer-deserializer).

### <a name="mahout"></a>Mahout
<a target="_blank" href="https://mahout.apache.org/">Apache Mahout</a> is a library of machine learning algorithms that run on Hadoop. Using principles of statistics, machine learning applications teach systems to learn from data and to use past outcomes to determine future behavior. See [Generate movie recommendations using Mahout on Hadoop](hdinsight-mahout.md).

### <a name="mapreduce"></a>MapReduce
MapReduce is the legacy software framework for Hadoop for writing applications to batch process big data sets in parallel. A MapReduce job splits large datasets and organizes the data into key-value pairs for processing. MapReduce jobs run on [YARN](#yarn). See <a target="_blank" href="http://wiki.apache.org/hadoop/MapReduce">MapReduce</a> in the Hadoop Wiki.

### <a name="oozie"></a>Oozie
<a target="_blank" href="http://oozie.apache.org/">Apache Oozie</a> is a workflow coordination system that manages Hadoop jobs. It is integrated with the Hadoop stack and supports Hadoop jobs for MapReduce, Pig, Hive, and Sqoop. It can also be used to schedule jobs specific to a system, like Java programs or shell scripts. See [Use Oozie with Hadoop](hdinsight-use-oozie-linux-mac.md).

### <a name="phoenix"></a>Phoenix
<a  target="_blank" href="http://phoenix.apache.org/">Apache Phoenix</a> is a relational database layer over HBase. Phoenix includes a JDBC driver that allows you to query and manage SQL tables directly. Phoenix translates queries and other statements into native NoSQL API calls - instead of using MapReduce - thus enabling faster applications on top of NoSQL stores. See [Use Apache Phoenix and SQuirreL with HBase clusters](hdinsight-hbase-phoenix-squirrel.md).

### <a name="pig"></a>Pig
<a  target="_blank" href="http://pig.apache.org/">Apache Pig</a> is a high-level platform that allows you to perform complex MapReduce transformations on large datasets by using a simple scripting language called Pig Latin. Pig translates the Pig Latin scripts so they’ll run within Hadoop. You can create User-Defined Functions (UDFs) to extend Pig Latin. See [Use Pig with Hadoop](hdinsight-use-pig.md).

### <a name="sqoop"></a>Sqoop
<a  target="_blank" href="http://sqoop.apache.org/">Apache Sqoop</a> is a tool that transfers bulk data between Hadoop and relational databases such as SQL, or other structured data stores, as efficiently as possible. See [Use Sqoop with Hadoop](hdinsight-use-sqoop.md).

### <a name="tez"></a>Tez
<a  target="_blank" href="http://tez.apache.org/">Apache Tez</a> is an application framework built on Hadoop YARN that executes complex, acyclic graphs of general data processing. It's a more flexible and powerful successor to the MapReduce framework that allows data-intensive processes, such as Hive, to run more efficiently at scale. See ["Use Apache Tez for improved performance" in Use Hive and HiveQL](hdinsight-use-hive.md#usetez).

### <a name="yarn"></a>YARN
Apache YARN is the next generation of MapReduce (MapReduce 2.0, or MRv2) and supports data processing scenarios beyond MapReduce batch processing with greater scalability and real-time processing. YARN provides resource management and a distributed application framework. MapReduce jobs run on YARN. See <a target="_blank" href="http://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/YARN.html">Apache Hadoop NextGen MapReduce (YARN)</a>.

### <a name="zookeeper"></a>ZooKeeper
<a  target="_blank" href="http://zookeeper.apache.org/">Apache ZooKeeper</a> coordinates processes in large distributed systems using a shared hierarchical namespace of data registers (znodes). Znodes contain small amounts of meta information needed to coordinate processes: status, location, configuration, and so on. See an example of [ZooKeeper with an HBase cluster and Apache Phoenix](hdinsight-hbase-phoenix-squirrel-linux.md). 

## Programming languages on HDInsight
HDInsight clusters - Spark, HBase, Kafka, Hadoop, and other clusters - support many programming languages, but some aren't installed by default. For libraries, modules, or packages not installed by default, [use a script action to install the component](hdinsight-hadoop-script-actions-linux.md). 

### Default programming language support
By default, HDInsight clusters support:

* Java
* Python

Additional languages can be installed using [script actions](hdinsight-hadoop-script-actions-linux.md).

### Java virtual machine (JVM) languages
Many languages other than Java can run on a Java virtual machine (JVM); however, running some of these languages may require additional components installed on the cluster.

These JVM-based languages are supported on HDInsight clusters:

* Clojure
* Jython (Python for Java)
* Scala

### Hadoop-specific languages
HDInsight clusters support the following languages that are specific to the Hadoop technology stack:

* Pig Latin for Pig jobs
* HiveQL for Hive jobs and SparkSQL

## HDInsight Standard and HDInsight Premium
HDInsight provides big data cloud offerings in two categories, Standard and Premium. HDInsight Standard provides an enterprise-scale cluster that organizations can use to run their big data workloads. HDInsight Premium builds on Standard capabilities and provides advanced analytical and security capabilities for an HDInsight cluster. For more information, see [Azure HDInsight Premium](hdinsight-component-versioning.md#hdinsight-standard-and-hdinsight-premium)

## Microsoft business intelligence and HDInsight
Familiar business intelligence (BI) tools retrieve, analyze, and report data integrated with HDInsight by using either the Power Query add-in or the Microsoft Hive ODBC Driver:

* [Connect Excel to Hadoop with Power Query](hdinsight-connect-excel-power-query.md): Learn how to connect Excel to the Azure Storage account that stores the data from your HDInsight cluster by using Microsoft Power Query for Excel. Windows workstation required. 
* [Connect Excel to Hadoop with the Microsoft Hive ODBC Driver](hdinsight-connect-excel-hive-odbc-driver.md): Learn how to import data from HDInsight with the Microsoft Hive ODBC Driver. Windows workstation required. 
* [Microsoft Cloud Platform](http://www.microsoft.com/server-cloud/solutions/business-intelligence/default.aspx): Learn about Power BI for Office 365, download the SQL Server trial, and set up SharePoint Server 2013 and SQL Server BI.
* [SQL Server Analysis Services](http://msdn.microsoft.com/library/hh231701.aspx)
* [SQL Server Reporting Services](http://msdn.microsoft.com/library/ms159106.aspx)


## Next steps

* [Get started with Hadoop in HDInsight](hdinsight-hadoop-linux-tutorial-get-started.md): A quick-start tutorial for provisioning HDInsight Hadoop clusters and running sample Hive queries.
* [Get started with Spark in HDInsight](hdinsight-apache-spark-jupyter-spark-sql.md): A quick-start tutorial for creating a Spark cluster and running interactive Spark SQL queries.
* [Use R Server on HDInsight](hdinsight-hadoop-r-server-get-started.md): Start using R Server in HDInsight Premium.
* [Provision HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md): Learn how to provision an HDInsight Hadoop cluster through the Azure portal, Azure CLI, or Azure PowerShell.


[component-versioning]: hdinsight-component-versioning.md
[zookeeper]: http://zookeeper.apache.org/