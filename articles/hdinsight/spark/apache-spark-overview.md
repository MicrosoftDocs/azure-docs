---
title: What is Apache Spark - Azure HDInsight
description: This article provides an introduction to Spark in HDInsight and the different scenarios in which you can use Spark cluster in HDInsight.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive,mvc,seoapr2020
ms.topic: overview
ms.date: 04/17/2020

#customer intent: As a developer new to Apache Spark and Apache Spark in Azure HDInsight, I want to have a basic understanding of Microsoft's implementation of Apache Spark in Azure HDInsight so I can decide if I want to use it rather than build my own cluster.
---

# What is Apache Spark in Azure HDInsight

Apache Spark is a parallel processing framework that supports in-memory processing to boost the performance of big-data analytic applications. Apache Spark in Azure HDInsight is the Microsoft implementation of Apache Spark in the cloud. HDInsight makes it easier to create and configure a Spark cluster in Azure. Spark clusters in HDInsight are compatible with Azure Storage and Azure Data Lake Storage. So you can use HDInsight Spark clusters to process your data stored in Azure. For the components and the versioning information, see [Apache Hadoop components and versions in Azure HDInsight](../hdinsight-component-versioning.md).

![Spark: a unified framework](./media/apache-spark-overview/hdinsight-spark-overview.png)

## What is Apache Spark?

Spark provides primitives for in-memory cluster computing. A Spark job can load and cache data into memory and query it repeatedly. In-memory computing is much faster than disk-based applications, such as Hadoop, which shares data through Hadoop distributed file system (HDFS). Spark also integrates into the Scala programming language to let you manipulate distributed data sets like local collections. There's no need to structure everything as map and reduce operations.

![Traditional MapReduce vs. Spark](./media/apache-spark-overview/map-reduce-vs-spark1.png)

Spark clusters in HDInsight offer a fully managed Spark service. Benefits of creating a Spark cluster in HDInsight are listed here.

| Feature | Description |
| --- | --- |
| Ease creation |You can create a new Spark cluster in HDInsight in minutes using the Azure portal, Azure PowerShell, or the HDInsight .NET SDK. See [Get started with Apache Spark cluster in HDInsight](apache-spark-jupyter-spark-sql-use-portal.md). |
| Ease of use |Spark cluster in HDInsight include Jupyter and Apache Zeppelin notebooks. You can use these notebooks for interactive data processing and visualization. See [Use Apache Zeppelin notebooks with Apache Spark](apache-spark-zeppelin-notebook.md) and [Load data and run queries on an Apache Spark cluster](apache-spark-load-data-run-query.md).|
| REST APIs |Spark clusters in HDInsight include [Apache Livy](https://github.com/cloudera/hue/tree/master/apps/spark/java#welcome-to-livy-the-rest-spark-server), a REST API-based Spark job server to remotely submit and monitor jobs. See [Use Apache Spark REST API to submit remote jobs to an HDInsight Spark cluster](apache-spark-livy-rest-interface.md).|
| Support for Azure Data Lake Storage | Spark clusters in HDInsight can use Azure Data Lake Storage as both the primary storage or additional storage. For more information on Data Lake Storage, see [Overview of Azure Data Lake Storage](../../data-lake-store/data-lake-store-overview.md). |
| Integration with Azure services |Spark cluster in HDInsight comes with a connector to Azure Event Hubs. You can build streaming applications using the Event Hubs. Including Apache Kafka, which is already available as part of Spark. |
| Support for ML Server | Support for ML Server in HDInsight is provided as the **ML Services** cluster type. You can set up an ML Services cluster to run distributed R computations with the speeds promised with a Spark cluster. For more information, see [What is ML Services in Azure HDInsight](../r-server/r-server-overview.md). |
| Integration with third-party IDEs | HDInsight provides several IDE plugins that are useful to create and submit applications to an HDInsight Spark cluster. For more information, see [Use Azure Toolkit for IntelliJ IDEA](apache-spark-intellij-tool-plugin.md), [Use Spark & Hive Tools for VSCode](../hdinsight-for-vscode.md), and [Use Azure Toolkit for Eclipse](apache-spark-eclipse-tool-plugin.md).|
| Concurrent Queries |Spark clusters in HDInsight support concurrent queries. This capability enables multiple queries from one user or multiple queries from various users and applications to share the same cluster resources. |
| Caching on SSDs |You can choose to cache data either in memory or in SSDs attached to the cluster nodes. Caching in memory provides the best query performance but could be expensive. Caching in SSDs provides a great option for improving query performance without the need to create a cluster of a size that is required to fit the entire dataset in memory. See [Improve performance of Apache Spark workloads using Azure HDInsight IO Cache](apache-spark-improve-performance-iocache.md). |
| Integration with BI Tools |Spark clusters in HDInsight provide connectors for  BI tools such as Power BI for data analytics. |
| Pre-loaded Anaconda libraries |Spark clusters in HDInsight come with Anaconda libraries pre-installed. [Anaconda](https://docs.continuum.io/anaconda/) provides close to 200 libraries for machine learning, data analysis, visualization, and so on. |
| Adaptability | HDInsight allows you to change the number of cluster nodes dynamically with the Autoscale feature. See [Automatically scale Azure HDInsight clusters](../hdinsight-autoscale-clusters.md). Also, Spark clusters can be dropped with no loss of data since all the data is stored in Azure Storage or Data Lake Storage. |
| SLA |Spark clusters in HDInsight come with 24/7 support and an SLA of 99.9% up-time. |

Apache Spark clusters in HDInsight include the following components that are available on the clusters by default.

* [Spark Core](https://spark.apache.org/docs/latest/). Includes Spark Core, Spark SQL, Spark streaming APIs, GraphX, and MLlib.
* [Anaconda](https://docs.continuum.io/anaconda/)
* [Apache Livy](https://github.com/cloudera/hue/tree/master/apps/spark/java#welcome-to-livy-the-rest-spark-server)
* [Jupyter notebook](https://jupyter.org)
* [Apache Zeppelin notebook](http://zeppelin-project.org/)

HDInsight Spark clusters an [ODBC driver](https://go.microsoft.com/fwlink/?LinkId=616229) for connectivity from BI tools such as Microsoft Power BI.

## Spark cluster architecture

![The architecture of HDInsight Spark](./media/apache-spark-overview/hdi-spark-architecture.png)

It's easy to understand the components of Spark by understanding how Spark runs on HDInsight clusters.

Spark applications run as independent sets of processes on a cluster. Coordinated by the SparkContext object in your main program (called the driver program).

The SparkContext can connect to several types of cluster managers, which give resources across applications. These cluster managers include Apache Mesos, [Apache Hadoop YARN](https://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/YARN.html), or the Spark cluster manager. In HDInsight, Spark runs using the YARN cluster manager. Once connected, Spark acquires executors on workers nodes in the cluster, which are processes that run computations and store data for your application. Next, it sends your application code (defined by JAR or Python files passed to SparkContext) to the executors. Finally, SparkContext sends tasks to the executors to run.

The SparkContext runs the user's main function and executes the various parallel operations on the worker nodes. Then, the SparkContext collects the results of the operations. The worker nodes read and write data from and to the Hadoop distributed file system. The worker nodes also cache transformed data in-memory as Resilient Distributed Datasets (RDDs).

The SparkContext connects to the Spark master and is responsible for converting an application to a directed graph (DAG) of individual tasks. Tasks that get executed within an executor process on the worker nodes. Each application gets its own executor processes. Which stay up for the duration of the whole application and run tasks in multiple threads.

## Spark in HDInsight use cases

Spark clusters in HDInsight enable the following key scenarios:

### Interactive data analysis and BI

Apache Spark in HDInsight stores data in Azure Storage or Azure Data Lake Storage. Business experts and key decision makers can analyze and build reports over that data. And use Microsoft Power BI to build interactive reports from the analyzed data. Analysts can start from unstructured/semi structured data in cluster storage, define a schema for the data using notebooks, and then build data models using Microsoft Power BI. Spark clusters in HDInsight also support a number of third-party BI tools. Such as Tableau, making it easier for data analysts, business experts, and key decision makers.

* [Tutorial: Visualize Spark data using Power BI](apache-spark-use-bi-tools.md)

### Spark Machine Learning

Apache Spark comes with [MLlib](https://spark.apache.org/mllib/). MLlib is a machine learning library built on top of Spark that you can use from a Spark cluster in HDInsight. Spark cluster in HDInsight also includes Anaconda, a Python distribution with different kinds of packages for machine learning. And with built-in support for Jupyter and Zeppelin notebooks, you have an environment for creating machine learning applications.

* [Tutorial: Predict building temperatures using HVAC data](apache-spark-ipython-notebook-machine-learning.md)  
* [Tutorial: Predict food inspection results](apache-spark-machine-learning-mllib-ipython.md)

### Spark streaming and real-time data analysis

Spark clusters in HDInsight offer a rich support for building real-time analytics solutions. Spark already has connectors to ingest data from many sources like Kafka, Flume, Twitter, ZeroMQ, or TCP sockets. Spark in HDInsight adds first-class support for ingesting data from Azure Event Hubs. Event Hubs is the most widely used queuing service on Azure. Having complete support for Event Hubs makes Spark clusters in HDInsight an ideal platform for building real-time analytics pipeline.

* [Overview of Apache Spark Streaming](apache-spark-streaming-overview.md)
* [Overview of Apache Spark Structured Streaming](apache-spark-structured-streaming-overview.md)

## Where do I start?

You can use the following articles to learn more about Apache Spark in HDInsight:

* [Quickstart: Create an Apache Spark cluster in HDInsight and run interactive query using Jupyter](./apache-spark-jupyter-spark-sql-use-portal.md)
* [Tutorial: Run an Apache Spark job using Jupyter](./apache-spark-load-data-run-query.md)
* [Tutorial: Analyze data using BI tools](./apache-spark-use-bi-tools.md)
* [Tutorial: Machine learning using Apache Spark](./apache-spark-ipython-notebook-machine-learning.md)
* [Tutorial: Create a Scala Maven application using IntelliJ](./apache-spark-create-standalone-application.md)

## Next Steps

In this overview, you get some basic understanding of Apache Spark in Azure HDInsight. Learn how to create an HDInsight Spark cluster and run some Spark SQL queries:

* [Create an Apache Spark cluster in HDInsight](./apache-spark-jupyter-spark-sql-use-portal.md)
