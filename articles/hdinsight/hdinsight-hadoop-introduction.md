---
title: What is Hadoop & the Hadoop technology stack in Azure HDInsight? | Microsoft Docs
description: An intro to Hadoop clusters and the Hadoop technology stack and components in HDInsight, including Spark, Kafka, HBase for big data analysis.
keywords: azure hadoop, hadoop azure, hadoop intro, hadoop introduction, hadoop technology stack, intro to hadoop, introduction to hadoop, what is a hadoop cluster, what is hadoop cluster, what is hadoop used for
services: hdinsight
documentationcenter: ''
author: cjgronlund
manager: jhubbard
editor: cgronlun

ms.assetid: e56a396a-1b39-43e0-b543-f2dee5b8dd3a
ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 05/11/2017
ms.author: cgronlun

---
# Introduction to the Azure HDInsight Hadoop technology stack and Hadoop clusters
 This article provides an introduction to Azure HDInsight, a cloud distribution of the Hadoop technology stack. You'll also learn what a Hadoop cluster is and what it's used for. 

## What is the Hadoop technology stack in HDInsight? 
Hadoop is an open-source framework for distributed processing and analysis of big data sets on clusters of computers. Azure HDInsight makes the Hadoop components from the **Hortonworks Data Platform (HDP)** distribution available in the cloud. HDInsight deploys managed clusters with high reliability and availability, and provides enterprise-grade security and governance with Active Directory.  

Apache Hadoop was the original open-source project for big data processing. Following was the development of related software and utilities considered part of the Hadoop technology stack, including Apache Hive, HBase, Spark, Kafka, and many others. See [Overview of the Hadoop technology stack in HDInsight](#overview) for details.

## What is a Hadoop cluster, and what's it used for?
The term *Hadoop* also refers to a type of cluster that has the Hadoop distributed file system (HDFS), Hadoop YARN for job scheduling and resource management, and MapReduce for parallel processing. Hadoop clusters are most often used for batch processing of stored data. There are other kinds of clusters available with additional capabilities, such as faster, in-memory processing or processing for streaming message queues. For details, see [Overview of the Hadoop technology stack](#overview) following.

## What is big data?
Big data describes any large body of digital information, from a Twitter newsfeed, to sensor data from industrial equipment, to information about customer behavior on a website. Big data can be historical (meaning stored data) or real time (meaning streamed directly from the source). Big data is being collected in ever-escalating volumes, at increasingly higher velocities, and in an expanding variety formats.

## <a name="overview"></a>Overview of the Hadoop technology stack in HDInsight
HDInsight is a cloud distribution on Microsoft Azure of the rapidly expanding Apache Hadoop technology stack for big data analysis. It includes implementations of Apache Spark, HBase, Kafka, Storm, Pig, Hive, Interactive Hive, Sqoop, Oozie, Ambari, and so on. HDInsight also integrates with business intelligence (BI) tools such as Power BI, Excel, SQL Server Analysis Services, and SQL Server Reporting Services.

### Spark, Kafka, Interactive Hive, HBase, customized, and other cluster types
HDInsight offers the following cluster types:

* **[Apache Hadoop](https://wiki.apache.org/hadoop)**: Uses [HDFS](#hdfs), [YARN](#yarn) resource manager, and a simple [MapReduce](#mapreduce) programming model to process and analyze data in parallel.
* **[Apache Spark](http://spark.apache.org/)**: A parallel processing framework that supports in-memory processing to boost the performance of big-data analysis applications, Spark works for SQL, streaming data, and machine learning. See [Overview: What is Apache Spark in HDInsight?](hdinsight-apache-spark-overview.md)
* **[Apache HBase](http://hbase.apache.org/)**: A NoSQL database built on Hadoop that provides random access and strong consistency for large amounts of unstructured and semi-structured data - potentially billions of rows times millions of columns. See [Overview of HBase on HDInsight](hdinsight-hbase-overview.md).
* **[Microsoft R Server](https://msdn.microsoft.com/en-us/microsoft-r/rserver)**: A server for hosting and managing parallel, distributed R processes. It provides data scientists, statisticians, and R programmers with on-demand access to scalable, distributed methods of analytics on HDInsight. See [Overview of R Server on HDInsight](hdinsight-hadoop-r-server-overview.md).
* **[Apache Storm](https://storm.incubator.apache.org/)**: A distributed, real-time computation system for processing large streams of data fast. Storm is offered as a managed cluster in HDInsight. See [Analyze real-time sensor data using Storm and Hadoop](hdinsight-storm-sensor-data-analysis.md).
* **[Apache Interactive Hive preview (AKA: Live Long and Process)](https://cwiki.apache.org/confluence/display/Hive/LLAP)**: In-memory caching for interactive and faster Hive queries. See [Use Interactive Hive in HDInsight](hdinsight-hadoop-use-interactive-hive.md).
* **[Apache Kafka preview](https://kafka.apache.org/)**: An open-source platform used for building streaming data pipelines and applications. Kafka also provides message-queue functionality that allows you to publish and subscribe to data streams. See [Introduction to Apache Kafka on HDInsight](hdinsight-apache-kafka-introduction.md).
* **[Domain-joined clusters preview](hdinsight-domain-joined-introduction.md)**: A cluster joined to an Active Directory domain so that you can control access and provide governance for data.
* **[Custom clusters with script actions](hdinsight-hadoop-customize-cluster-linux.md)**: Clusters with scripts that run during provisioning and install additional components.

### Example cluster customization scripts
Script actions are Bash scripts on Linux that run during cluster provisioning, and that can be used to install additional components on the cluster.

The following example scripts are provided by the HDInsight team:

* **[Hue](hdinsight-hadoop-hue-linux.md)**: A set of web applications used to interact with a cluster. Linux clusters only.
* **[Giraph](hdinsight-hadoop-giraph-install-linux.md)**: Graph processing to model relationships between things or people.
* **[R](hdinsight-hadoop-r-scripts-linux.md)**: An open-source language and environment for statistical computing used in machine learning.
* **[Solr](hdinsight-hadoop-solr-install-linux.md)**: An enterprise-scale search platform that allows full-text search on data.

For information on developing your own Script Actions, see [Script Action development with HDInsight](hdinsight-hadoop-script-actions-linux.md).

## Components and utilities on HDInsight cluster
The following components and utilities are included on HDInsight clusters.

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
* **[YARN](#yarn)**: Part of the Hadoop core library and next generation of the MapReduce software framework.
* **[ZooKeeper](#zookeeper)**: Coordination of processes in distributed systems.

> [!NOTE]
> For information on the specific components and version information, see [Hadoop components and versions in HDInsight][component-versioning]
>
>

### <a name="ambari"></a>Ambari
Apache Ambari is for provisioning, managing, and monitoring Apache Hadoop clusters. It includes an intuitive collection of operator tools and a robust set of APIs that hide the complexity of Hadoop, simplifying the operation of clusters. HDInsight clusters on Linux provide both the Ambari web UI and the Ambari REST API. Ambari Views on HDInsight clusters allow plug-in UI capabilities.

See [Manage HDInsight clusters using Ambari](hdinsight-hadoop-manage-ambari.md) (Linux only), [Monitor Hadoop clusters in HDInsight using the Ambari API](hdinsight-monitor-use-ambari-api.md), and <a target="_blank" href="https://github.com/apache/ambari/blob/trunk/ambari-server/docs/api/v1/index.md">Apache Ambari API reference</a>.

### <a name="avro"></a>Avro (Microsoft .NET Library for Avro)
The Microsoft .NET Library for Avro implements the Apache Avro compact binary data interchange format for serialization for the Microsoft .NET environment. It uses <a target="_blank" href="http://www.json.org/">JSON</a> to define a language-agnostic schema so that data serialized in one language can be read in another. Detailed information on the format can be found in the <a target=_"blank" href="http://avro.apache.org/docs/current/spec.html">Apache Avro Specification</a>.

The format of Avro files supports the distributed MapReduce programming model. Files are “splittable”, meaning you can seek any point in a file and start reading from a particular block. To find out how, see [Serialize data with the Microsoft .NET Library for Avro](hdinsight-dotnet-avro-serialization.md).

### <a name="hdfs"></a>HDFS
Hadoop Distributed File System (HDFS) is a file system that, with YARN and MapReduce, is the core of Hadoop technology. HDFS is the standard file system for Hadoop clusters on HDInsight.

### <a name="hive"></a>Hive & HCatalog
<a target="_blank" href="http://hive.apache.org/">Apache Hive</a> is data warehouse software built on Hadoop that allows you to query and manage large datasets in distributed storage by using a SQL-like language called HiveQL. Hive, like Pig, is an abstraction on top of MapReduce, and it translates queries into a series of MapReduce jobs. Hive is closer to a relational database management system than Pig, and is used with more structured data. For unstructured data, Pig is the better choice. See [Use Hive with Hadoop in HDInsight](hdinsight-use-hive.md).

<a target="_blank" href="https://cwiki.apache.org/confluence/display/Hive/HCatalog/">Apache HCatalog</a> is a table and storage management layer for Hadoop that presents you with a relational view of data. In HCatalog, you can read and write files in any format for which a Hive SerDe (serializer-deserializer) can be written.

### <a name="mahout"></a>Mahout
<a target="_blank" href="https://mahout.apache.org/">Apache Mahout</a> is a scalable library of machine learning algorithms that run on Hadoop. Using principles of statistics, machine learning applications teach systems to learn from data and to use past outcomes to determine future behavior. See [Generate movie recommendations using Mahout on Hadoop](hdinsight-mahout.md).

### <a name="mapreduce"></a>MapReduce
MapReduce is the legacy software framework for Hadoop for writing applications to batch process big data sets in parallel. A MapReduce job splits large datasets and organizes the data into key-value pairs for processing.

MapReduce jobs run on [YARN](#yarn). 

See <a target="_blank" href="http://wiki.apache.org/hadoop/MapReduce">MapReduce</a> in the Hadoop Wiki.

### <a name="oozie"></a>Oozie
<a target="_blank" href="http://oozie.apache.org/">Apache Oozie</a> is a workflow coordination system that manages Hadoop jobs. It is integrated with the Hadoop stack and supports Hadoop jobs for MapReduce, Pig, Hive, and Sqoop. It can also be used to schedule jobs specific to a system, like Java programs or shell scripts. See [Use Oozie with Hadoop](hdinsight-use-oozie.md).

### <a name="phoenix"></a>Phoenix
<a  target="_blank" href="http://phoenix.apache.org/">Apache Phoenix</a> is a relational database layer over HBase. Phoenix includes a JDBC driver that allows you to query and manage SQL tables directly. Phoenix translates queries and other statements into native NoSQL API calls - instead of using MapReduce - thus enabling faster applications on top of NoSQL stores. See [Use Apache Phoenix and SQuirreL with HBase clusters](hdinsight-hbase-phoenix-squirrel.md).

### <a name="pig"></a>Pig
<a  target="_blank" href="http://pig.apache.org/">Apache Pig</a> is a high-level platform that allows you to perform complex MapReduce transformations on very large datasets by using a simple scripting language called Pig Latin. Pig translates the Pig Latin scripts so they’ll run within Hadoop. You can create User-Defined Functions (UDFs) to extend Pig Latin. See [Use Pig with Hadoop](hdinsight-use-pig.md).

### <a name="sqoop"></a>Sqoop
<a  target="_blank" href="http://sqoop.apache.org/">Apache Sqoop</a> is tool that transfers bulk data between Hadoop and relational databases such a SQL, or other structured data stores, as efficiently as possible. See [Use Sqoop with Hadoop](hdinsight-use-sqoop.md).

### <a name="tez"></a>Tez
<a  target="_blank" href="http://tez.apache.org/">Apache Tez</a> is an application framework built on Hadoop YARN that executes complex, acyclic graphs of general data processing. It's a more flexible and powerful successor to the MapReduce framework that allows data-intensive processes, such as Hive, to run more efficiently at scale. See ["Use Apache Tez for improved performance" in Use Hive and HiveQL](hdinsight-use-hive.md#usetez).

### <a name="yarn"></a>YARN
Apache YARN is the next generation of MapReduce (MapReduce 2.0, or MRv2) and supports data processing scenarios beyond MapReduce batch processing with greater scalability and real-time processing. YARN provides resource management and a distributed application framework. MapReduce jobs run on YARN.

See <a target="_blank" href="http://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/YARN.html">Apache Hadoop NextGen MapReduce (YARN)</a>.

### <a name="zookeeper"></a>ZooKeeper
<a  target="_blank" href="http://zookeeper.apache.org/">Apache ZooKeeper</a> coordinates processes in large distributed systems using a shared hierarchical namespace of data registers (znodes). Znodes contain small amounts of meta information needed to coordinate processes: status, location, configuration, and so on.

## Programming languages on HDInsight
HDInsight clusters--Spark, HBase, Kafka, Hadoop, and other clusters--support many programming languages, but some aren't installed by default. For libraries, modules, or packages not installed by default, use a script action to install the component. See [Script action development with HDInsight](hdinsight-hadoop-script-actions-linux.md).

### Default programming language support
By default, HDInsight clusters support:

* Java
* Python

Additional languages can be installed using script actions: [Script action development with HDInsight](hdinsight-hadoop-script-actions-linux.md).

### Java virtual machine (JVM) languages
Many languages other than Java can be run using a Java virtual machine (JVM); however, running some of these languages may require additional components installed on the cluster.

These JVM-based languages are supported on HDInsight clusters:

* Clojure
* Jython (Python for Java)
* Scala

### Hadoop-specific languages
HDInsight clusters support the following languages that are specific to the Hadoop technology stack:

* Pig Latin for Pig jobs
* HiveQL for Hive jobs and SparkSQL

## <a name="advantage"></a>Advantages of Hadoop in the cloud
As part of the Azure cloud ecosystem, Hadoop in HDInsight has many benefits, among them:

* Automatic provisioning of Hadoop clusters. HDInsight clusters are much easier to create than manually configuring Hadoop clusters. For details, see [Provision Hadoop clusters in HDInsight](hdinsight-hadoop-provision-linux-clusters.md).
* State-of-the-art Hadoop components. For details, see [Hadoop components, versioning, and service offerings in HDInsight][component-versioning].
* High availability and reliability of clusters. See [Availability and reliability of Hadoop clusters in HDInsight](hdinsight-high-availability-linux.md) for details.
* Efficient and economical data storage with Azure Storage or Azure Data Lake Store, both HDFS-compatible storage options. See [Use Azure Storage with Hadoop in HDInsight](hdinsight-hadoop-use-blob-storage.md) or [Use Data Lake Store with an HDInsight cluster](https://docs.microsoft.com/en-us/azure/data-lake-store/data-lake-store-hdinsight-hadoop-use-portal) for details.
* Integration with other Azure services, including [Web apps](https://azure.microsoft.com/documentation/services/app-service/web/) and [SQL Database](https://azure.microsoft.com/documentation/services/sql-database/).
* Additional VM sizes and types for running HDInsight clusters. See [Hadoop components, versioning, and service offerings in HDInsight][component-versioning] for details.
* Cluster scaling. Cluster scaling enables you to change the number of nodes of a running HDInsight cluster without having to delete or re-create it.
* Virtual Network support. HDInsight clusters can be used with Azure Virtual Network to support isolation of cloud resources or hybrid scenarios that link cloud resources with those in your datacenter.
* Low entry cost. Start a [free trial](https://azure.microsoft.com/free/), or consult [HDInsight pricing details](https://azure.microsoft.com/pricing/details/hdinsight/).

To read more about the advantages on Hadoop in HDInsight, see the [Azure features page for HDInsight][marketing-page].

## HDInsight Standard and HDInsight Premium
HDInsight provides big data cloud offerings in two categories, Standard and Premium. HDInsight Standard provides an enterprise-scale cluster that organizations can use to run their big data workloads. HDInsight Premium builds on Standard capabilities and provides advanced analytical and security capabilities for an HDInsight cluster. For more information, see [Azure HDInsight Premium](hdinsight-component-versioning.md#hdinsight-standard-and-hdinsight-premium)

## <a id="resources"></a>Resources for learning more about big-data analysis, Hadoop, and HDInsight
Build on this introduction to Hadoop in the cloud and big data analysis with the resources following.

### Hadoop documentation for HDInsight
* [HDInsight documentation](https://docs.microsoft.com/azure/hdinsight/): The documentation page for Hadoop on Azure HDInsight with links to articles, videos, and more resources.
* [Get started with Hadoop in HDInsight](hdinsight-hadoop-linux-tutorial-get-started.md): A quick-start tutorial for provisioning HDInsight Hadoop clusters and running sample Hive queries.
* [Get started with Spark in HDInsight](hdinsight-apache-spark-jupyter-spark-sql.md): A quick-start tutorial for creating a Spark cluster and running interactive Spark SQL queries.
* [Use R Server on HDInsight](hdinsight-hadoop-r-server-get-started.md): Start using R Server in HDInsight Premium.
* [Provision HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md): Learn how to provision an HDInsight Hadoop cluster through the Azure portal, Azure CLI, or Azure PowerShell.

### Apache Hadoop
* <a target="_blank" href="http://hadoop.apache.org/">Apache Hadoop</a>: Learn more about the Apache Hadoop software library, a framework that allows for the distributed processing of large datasets across clusters of computers.
* <a target="_blank" href="http://hadoop.apache.org/docs/r1.0.4/hdfs_design.html">HDFS</a>: Learn more about the architecture and design of the Hadoop Distributed File System, the primary storage system used by Hadoop applications.
* <a target="_blank" href="http://hadoop.apache.org/docs/r1.2.1/mapred_tutorial.html">MapReduce Tutorial</a>: Learn more about the programming framework for writing Hadoop applications that rapidly process large amounts of data in parallel on large clusters of compute nodes.

### Microsoft business intelligence
Familiar business intelligence (BI) tools retrieve, analyze, and report data integrated with HDInsight by using either the Power Query add-in or the Microsoft Hive ODBC Driver:

* [Connect Excel to Hadoop with Power Query](hdinsight-connect-excel-power-query.md): Learn how to connect Excel to the Azure Storage account that stores the data associated with your HDInsight cluster by using Microsoft Power Query for Excel. Windows workstation required. 
* [Connect Excel to Hadoop with the Microsoft Hive ODBC Driver](hdinsight-connect-excel-hive-odbc-driver.md): Learn how to import data from HDInsight with the Microsoft Hive ODBC Driver. Windows workstation required. 
* [Microsoft Cloud Platform](http://www.microsoft.com/server-cloud/solutions/business-intelligence/default.aspx): Learn about Power BI for Office 365, download the SQL Server trial, and set up SharePoint Server 2013 and SQL Server BI.
* [SQL Server Analysis Services](http://msdn.microsoft.com/library/hh231701.aspx).
* [SQL Server Reporting Services](http://msdn.microsoft.com/library/ms159106.aspx).

[marketing-page]: https://azure.microsoft.com/services/hdinsight/
[component-versioning]: hdinsight-component-versioning.md
[zookeeper]: http://zookeeper.apache.org/
