---
title: What are HDInsight and the Hadoop and Spark technology stack? - Azure | Microsoft Docs
description: An introduction to HDInsight, and to the Hadoop and Spark technology stack and components, including Kafka, Hive, Storm, and HBase for big data analysis.
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
ms.date: 12/13/2017
ms.author: cgronlun

---
# Introduction to Azure HDInsight and the Hadoop and Spark technology stack
This article provides an introduction to Azure HDInsight. Azure HDInsight is a fully managed, full-spectrum, open-source analytics service for enterprises. You can use open-source frameworks such as Hadoop, Spark, Hive, LLAP, Kafka, Storm, R, and more. 

[!INCLUDE [hdinsight-price-change](../../../includes/hdinsight-enhancements.md)]

[Apache Hadoop](http://hadoop.apache.org/) was the original open-source framework for distributed processing and analysis of big data sets on clusters. The Hadoop technology stack includes related software and utilities, including Apache Hive, HBase, Spark, Kafka, and many others. 

To see available Hadoop technology stack components on HDInsight, see [Components and versions available with HDInsight][component-versioning]. To read more about Hadoop in HDInsight, see the [Azure features page for HDInsight](https://azure.microsoft.com/services/hdinsight/).

[Apache Spark](http://spark.apache.org) is an open-source, parallel-processing framework that supports in-memory processing to boost the performance of big-data analytic applications. To read more about Spark in HDInsight, see the [Introduction to Spark on Azure HDInsight](../spark/apache-spark-overview.md). 

<a href="https://ms.portal.azure.com/#create/Microsoft.HDInsightCluster" target="_blank"><img src="./media/apache-hadoop-introduction/deploy-to-azure.png" alt="Deploy an Azure HDInsight cluster"></a>

## What is HDInsight and the Hadoop technology stack? 
Azure HDInsight is a cloud distribution of the Hadoop components from the [Hortonworks Data Platform (HDP)](https://hortonworks.com/products/data-center/hdp/). Azure HDInsight makes it easy, fast, and cost-effective to process massive amounts of data. You can use the most popular open-source frameworks such as Hadoop, Spark, Hive, LLAP, Kafka, Storm, R, and more. With these frameworks, you can enable a broad range of scenarios such as extract, transform, and load (ETL), data warehousing, machine learning, and IoT.

## What is big data?

Big data is collected in escalating volumes, at higher velocities, and in a greater variety of formats than ever before. It can be historical (meaning stored) or real-time (meaning streamed from the source). See [Scenarios for using HDInsight](#scenarios-for-using-hdinsight) to learn about the most common use cases for big data.

## Why should I use HDInsight?

This section lists the capabilities of Azure HDInsight.


|Capability  |Description  |
|---------|---------|
|Cloud native     |     Azure HDInsight enables you to create optimized clusters for [Hadoop](apache-hadoop-linux-tutorial-get-started.md), [Spark](../spark/apache-spark-jupyter-spark-sql.md), [Interactive query (LLAP)](../interactive-query/apache-interactive-query-get-started.md), [Kafka](../kafka/apache-kafka-get-started.md), [Storm](../storm/apache-storm-tutorial-get-started-linux.md), [HBase](../hbase/apache-hbase-tutorial-get-started-linux.md), and [R Server](../r-server/r-server-get-started.md) on Azure. HDInsight also provides an end-to-end SLA on all your production workloads.  |
|Low-cost and scalable     | HDInsight enables you to [scale](../hdinsight-administer-use-portal-linux.md) workloads up or down. You can reduce costs by [creating clusters on demand](../hdinsight-hadoop-create-linux-clusters-adf.md) and paying only for what you use. You can also build data pipelines to operationalize your jobs. Decoupled compute and storage provide better performance and flexibility. |
|Secure and compliant    | HDInsight enables you to protect your enterprise data assets with [Azure Virtual Network](../hdinsight-extend-hadoop-virtual-network.md), [encryption](../hdinsight-hadoop-create-linux-clusters-with-secure-transfer-storage.md), and integration with [Azure Active Directory](../domain-joined/apache-domain-joined-introduction.md). HDInsight also meets the most popular industry and government [compliance standards](https://azure.microsoft.com/overview/trusted-cloud).        |
|Monitoring    | Azure HDInsight integrates with [Azure Log Analytics](../hdinsight-hadoop-oms-log-analytics-tutorial.md) to provide a single interface with which you can monitor all your clusters.        |
|Global availability | HDInsight is available in more [regions](https://azure.microsoft.com/regions/services/) than any other big data analytics offering. Azure HDInsight is also available in Azure Government, China, and Germany, which allows you to meet your enterprise needs in key sovereign areas. |  
|Productivity     |  Azure HDInsight enables you to use rich productive tools for Hadoop and Spark with your preferred development environments. These development environments include  [Visual Studio](apache-hadoop-visual-studio-tools-get-started.md), [VSCode](../hdinsight-for-vscode.md), [Eclipse](../spark/apache-spark-eclipse-tool-plugin.md), and [IntelliJ](../spark/apache-spark-intellij-tool-plugin.md) for Scala, Python, R, Java, and .NET support. Data scientists can also collaborate using popular notebooks such as [Jupyter](../spark/apache-spark-jupyter-notebook-kernels.md) and [Zeppelin](../spark/apache-spark-zeppelin-notebook.md).    |
|Extensibility     |  You can extend the HDInsight clusters with installed components (Hue, Presto, and so on) by using [script actions](../hdinsight-hadoop-customize-cluster-linux.md), by [adding edge nodes](../hdinsight-apps-use-edge-node.md), or by [integrating with other big data certified applications](../hdinsight-apps-install-applications.md). HDInsight enables seamless integration with the most popular big data solutions with a [one-click](https://azure.microsoft.com/services/hdinsight/partner-ecosystem/) deployment.|

## Scenarios for using HDInsight

Azure HDInsight can be used for a variety of scenarios in big data processing. It can be historical data (data that's already collected and stored) or real-time data (data that's directly streamed from the source). The scenarios for processing such data can be summarized in the following categories: 

### Batch processing (ETL)

Extract, transform, and load (ETL) is a process where unstructured or structured data is extracted from heterogeneous data sources. It's then transformed into a structured format and loaded into a data store. You can use the transformed data for data science or data warehousing.

### Internet of Things (IoT)

You can use HDInsight to process streaming data that's received in real time from a variety of devices. For more information, [read this blog post from Azure that announces the public preview of Apache Kafka on HDInsight with Azure Managed disks](https://azure.microsoft.com/blog/announcing-public-preview-of-apache-kafka-on-hdinsight-with-azure-managed-disks/).

![HDInsight architecture: Internet of Things](./media/apache-hadoop-introduction/hdinsight-architecture-iot.png) 

### Data science

You can use HDInsight to build applications that extract critical insights from data. You can also use Azure Machine Learning on top of that to predict future trends for your business. For more information, [read this customer story](https://customers.microsoft.com/story/pros).

![HDInsight architecture: Data science](./media/apache-hadoop-introduction/hdinsight-architecture-data-science.png)

### Data warehousing

You can use HDInsight to perform interactive queries at petabyte scales over structured or unstructured data in any format. You can also build models connecting them to BI tools. For more information, [read this customer story](https://customers.microsoft.com/story/milliman). 

![HDInsight architecture: Data warehousing](./media/apache-hadoop-introduction/hdinsight-architecture-data-warehouse.png)

### Hybrid

You can use HDInsight to extend your existing on-premises big data infrastructure to Azure to leverage the advanced analytics capabilities of the cloud.

![HDInsight architecture: Hybrid](./media/apache-hadoop-introduction/hdinsight-architecture-hybrid.png)

## Cluster types in HDInsight
HDInsight includes specific cluster types and cluster customization capabilities, such as the capability to add components, utilities, and languages.

### Spark, Kafka, Interactive Query, HBase, customized, and other cluster types
HDInsight offers the following cluster types:

* **[Apache Hadoop](https://wiki.apache.org/hadoop)**: A framework that uses [HDFS](#hdfs), [YARN](#yarn) resource management, and a simple [MapReduce](#mapreduce) programming model to process and analyze batch data in parallel.

* **[Apache Spark](http://spark.apache.org/)**: A parallel processing framework that supports in-memory processing to boost the performance of big-data analysis applications. Spark works for SQL, streaming data, and machine learning. See [What is Apache Spark in HDInsight?](../spark/apache-spark-overview.md)

* **[Apache HBase](http://hbase.apache.org/)**: A NoSQL database built on Hadoop that provides random access and strong consistency for large amounts of unstructured and semi-structured data--potentially billions of rows times millions of columns. See [What is HBase on HDInsight?](../hbase/apache-hbase-overview.md)

* **[Microsoft R Server](https://msdn.microsoft.com/microsoft-r/rserver)**: A server for hosting and managing parallel, distributed R processes. It provides data scientists, statisticians, and R programmers with on-demand access to scalable, distributed methods of analytics on HDInsight. See [Overview of R Server on HDInsight](../r-server/r-server-overview.md).

* **[Apache Storm](https://storm.incubator.apache.org/)**: A distributed, real-time computation system for processing large streams of data fast. Storm is offered as a managed cluster in HDInsight. See [Analyze real-time sensor data using Storm and Hadoop](../storm/apache-storm-sensor-data-analysis.md).

* **[Apache Interactive Query preview (AKA: Live Long and Process)](https://cwiki.apache.org/confluence/display/Hive/LLAP)**: In-memory caching for interactive and faster Hive queries. See [Use Interactive Query in HDInsight](../interactive-query/apache-interactive-query-get-started.md).

* **[Apache Kafka](https://kafka.apache.org/)**: An open-source platform that's used for building streaming data pipelines and applications. Kafka also provides message-queue functionality that allows you to publish and subscribe to data streams. See [Introduction to Apache Kafka on HDInsight](../kafka/apache-kafka-introduction.md).

## Open-source components in HDInsight

Azure HDInsight enables you to create clusters with open-source frameworks such as Hadoop, Spark, Hive, LLAP, Kafka, Storm, HBase, and R. These clusters, by default, come with other open-source components that are included on the cluster such as [Ambari](https://github.com/apache/ambari/blob/trunk/ambari-server/docs/api/v1/index.md), [Avro](http://avro.apache.org/docs/current/spec.html), [Hive](http://hive.apache.org), [HCatalog](https://cwiki.apache.org/confluence/display/Hive/HCatalog/), [Mahout](https://mahout.apache.org/), [MapReduce](http://wiki.apache.org/hadoop/MapReduce), [YARN](http://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/YARN.html), [Phoenix](http://phoenix.apache.org/), [Pig](http://pig.apache.org/), [Sqoop](http://sqoop.apache.org/), [Tez](http://tez.apache.org/), [Oozie](http://oozie.apache.org/), [ZooKeeper](http://zookeeper.apache.org/).  


## Programming languages in HDInsight
HDInsight clusters, including Spark, HBase, Kafka, Hadoop, and others, support many programming languages. Some programming languages aren't installed by default. For libraries, modules, or packages that are not installed by default, [use a script action to install the component](../hdinsight-hadoop-script-actions-linux.md). 

### Default programming language support
By default, HDInsight clusters support:

* Java
* Python

You can install additional languages by using [script actions](../hdinsight-hadoop-script-actions-linux.md).

### Java virtual machine (JVM) languages
Many languages other than Java can run on a Java virtual machine (JVM). However, if you run some of these languages, you might have to install additional components on the cluster.

The following JVM-based languages are supported on HDInsight clusters:

* Clojure
* Jython (Python for Java)
* Scala

### Hadoop-specific languages
HDInsight clusters support the following languages that are specific to the Hadoop technology stack:

* Pig Latin for Pig jobs
* HiveQL for Hive jobs and SparkSQL

## Business intelligence on HDInsight
Familiar business intelligence (BI) tools retrieve, analyze, and report data that is integrated with HDInsight by using either the Power Query add-in or the Microsoft Hive ODBC Driver:

* [Apache Spark BI using data visualization tools with Azure HDInsight](../spark/apache-spark-use-bi-tools.md)

* [Visualize Hive data with Microsoft Power BI in Azure HDInsight](apache-hadoop-connect-hive-power-bi.md) 

* [Visualize Interactive Query Hive data with Power BI in Azure HDInsight](../interactive-query/apache-hadoop-connect-hive-power-bi-directquery.md)

* [Connect Excel to Hadoop with Power Query](apache-hadoop-connect-excel-power-query.md): Learn how to use Microsoft Power Query for Excel to connect Excel to the Azure Storage account that stores the data from your HDInsight cluster. Windows Workstation is required. 

* [Connect Excel to Hadoop with the Microsoft Hive ODBC Driver](apache-hadoop-connect-excel-hive-odbc-driver.md): Learn how to import data from HDInsight with the Microsoft Hive ODBC Driver. Windows Workstation is required. 

* [Microsoft Cloud Platform](http://www.microsoft.com/server-cloud/solutions/business-intelligence/default.aspx): Learn about Power BI for Office 365, download the SQL Server trial, and set up SharePoint Server 2013 and SQL Server BI.

* [SQL Server Analysis Services](http://msdn.microsoft.com/library/hh231701.aspx)

* [SQL Server Reporting Services](http://msdn.microsoft.com/library/ms159106.aspx)


## Next steps

* [Get started with Hadoop in HDInsight](apache-hadoop-linux-tutorial-get-started.md)
* [Get started with Spark in HDInsight](../spark/apache-spark-jupyter-spark-sql.md)
* [Get started with Kafka on HDInsight](../kafka/apache-kafka-get-started.md)
* [Get started with Storm on HDInsight](../storm/apache-storm-tutorial-get-started-linux.md)
* [Get started with HBase on HDInsight](../hbase/apache-hbase-tutorial-get-started-linux.md)
* [Get started with Interactive Query (LLAP) on HDInsight](../interactive-query/apache-interactive-query-get-started.md)
* [Get started with R Server on HDInsight](../r-server/r-server-get-started.md)
* [Manage HDInsight clusters](../hdinsight-administer-use-portal-linux.md)
* [Secure your HDInsight clusters](../domain-joined/apache-domain-joined-introduction.md)
* [Monitor HDInsight clusters](../hdinsight-hadoop-oms-log-analytics-tutorial.md)


[component-versioning]: ../hdinsight-component-versioning.md
[zookeeper]: http://zookeeper.apache.org/
