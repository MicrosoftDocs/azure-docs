---
title: What is Azure HDInsight
description: An introduction to HDInsight, and the Apache Hadoop and Apache Spark technology stack and components, including Kafka, Hive, Storm, and HBase for big data analysis.
ms.service: hdinsight
ms.topic: overview
ms.custom: contperf-fy21q1
ms.date: 08/21/2020
#Customer intent: As a data analyst, I want understand what is Hadoop and how it is offered in Azure HDInsight so that I can decide on using HDInsight instead of on premises clusters.
---

# What is Azure HDInsight?

Azure HDInsight is a managed, full-spectrum, open-source analytics service in the cloud for enterprises. You can use open-source frameworks such as Hadoop, Apache Spark, Apache Hive, LLAP, Apache Kafka, Apache Storm, R, and more.

## What is HDInsight and the Hadoop technology stack?

Azure HDInsight is a cloud distribution of Hadoop components. Azure HDInsight makes it easy, fast, and cost-effective to process massive amounts of data. You can use the most popular open-source frameworks such as Hadoop, Spark, Hive, LLAP, Kafka, Storm, R, and more. With these frameworks, you can enable a broad range of scenarios such as extract, transform, and load (ETL), data warehousing, machine learning, and IoT.

To see available Hadoop technology stack components on HDInsight, see [Components and versions available with HDInsight](./hdinsight-component-versioning.md). To read more about Hadoop in HDInsight, see the [Azure features page for HDInsight](https://azure.microsoft.com/services/hdinsight/).

## What is big data?

Big data is collected in escalating volumes, at higher velocities, and in a greater variety of formats than ever before. It can be historical (meaning stored) or real time (meaning streamed from the source). See [Scenarios for using HDInsight](#scenarios-for-using-hdinsight) to learn about the most common use cases for big data.

## Why should I use Azure HDInsight?

This section lists the capabilities of Azure HDInsight.

|Capability  |Description  |
|---------|---------|
|Cloud native     |     Azure HDInsight enables you to create optimized clusters for Hadoop, Spark, [Interactive query (LLAP)](./interactive-query/apache-interactive-query-get-started.md), Kafka, Storm, HBase on Azure. HDInsight also provides an end-to-end SLA on all your production workloads.  |
|Low-cost and scalable     | HDInsight enables you to scale workloads up or down. You can reduce costs by creating clusters on demand and paying only for what you use. You can also build data pipelines to operationalize your jobs. Decoupled compute and storage provide better performance and flexibility. |
|Secure and compliant    | HDInsight enables you to protect your enterprise data assets with Azure Virtual Network, encryption, and integration with Azure Active Directory. HDInsight also meets the most popular industry and government compliance standards.        |
|Monitoring    | Azure HDInsight integrates with Azure Monitor logs to provide a single interface with which you can monitor all your clusters.        |
|Global availability | HDInsight is available in more regions than any other big data analytics offering. Azure HDInsight is also available in Azure Government, China, and Germany, which allows you to meet your enterprise needs in key sovereign areas. |  
|Productivity     |  Azure HDInsight enables you to use rich productive tools for Hadoop and Spark with your preferred development environments. These development environments include  Visual Studio, VSCode, Eclipse, and IntelliJ for Scala, Python, R, Java, and .NET support. Data scientists can also collaborate using popular notebooks such as Jupyter and Zeppelin.    |
|Extensibility     |  You can extend the HDInsight clusters with installed components (Hue, Presto, and so on) by using script actions, by adding edge nodes, or by integrating with other big data certified applications. HDInsight enables seamless integration with the most popular big data solutions with a one-click deployment.|

## Scenarios for using HDInsight

Azure HDInsight can be used for a variety of scenarios in big data processing. It can be historical data (data that's already collected and stored) or real-time data (data that's directly streamed from the source). The scenarios for processing such data can be summarized in the following categories:

### Batch processing (ETL)

Extract, transform, and load (ETL) is a process where unstructured or structured data is extracted from heterogeneous data sources. It's then transformed into a structured format and loaded into a data store. You can use the transformed data for data science or data warehousing.

### Data warehousing

You can use HDInsight to perform interactive queries at petabyte scales over structured or unstructured data in any format. You can also build models connecting them to BI tools.

:::image type="content" source="./hadoop/media/apache-hadoop-introduction/hdinsight-architecture-data-warehouse.png" alt-text="HDInsight architecture: Data warehousing":::

### Internet of Things (IoT)

You can use HDInsight to process streaming data that's received in real time from different kinds of devices. For more information, [read this blog post from Azure that announces the public preview of Apache Kafka on HDInsight with Azure Managed disks](https://azure.microsoft.com/blog/announcing-public-preview-of-apache-kafka-on-hdinsight-with-azure-managed-disks/).

:::image type="content" source="./hadoop/media/apache-hadoop-introduction/hdinsight-architecture-iot.png" alt-text="HDInsight architecture: Internet of Things":::

### Data science

You can use HDInsight to build applications that extract critical insights from data. You can also use Azure Machine Learning on top of that to predict future trends for your business. For more information, [read this customer story](https://customers.microsoft.com/story/pros).

:::image type="content" source="./hadoop/media/apache-hadoop-introduction/hdinsight-architecture-data-science.png" alt-text="HDInsight architecture: Data science":::

### Hybrid

You can use HDInsight to extend your existing on-premises big data infrastructure to Azure to leverage the advanced analytics capabilities of the cloud.

:::image type="content" source="./hadoop/media/apache-hadoop-introduction/hdinsight-architecture-hybrid.png" alt-text="HDInsight architecture: Hybrid":::

## Cluster types in HDInsight

HDInsight includes specific cluster types and cluster customization capabilities, such as the capability to add components, utilities, and languages. HDInsight offers the following cluster types:

|Cluster Type | Description |
|---|---|
|[Apache Hadoop](./hadoop/apache-hadoop-introduction.md)|A framework that uses HDFS, YARN resource management, and a simple MapReduce programming model to process and analyze batch data in parallel.|
|[Apache Spark](./spark/apache-spark-overview.md)|An open-source, parallel-processing framework that supports in-memory processing to boost the performance of big-data analysis applications. See [What is Apache Spark in HDInsight?](./spark/apache-spark-overview.md).|
|[Apache HBase](./hbase/apache-hbase-overview.md)|A NoSQL database built on Hadoop that provides random access and strong consistency for large amounts of unstructured and semi-structured data--potentially billions of rows times millions of columns. See [What is HBase on HDInsight?](./hbase/apache-hbase-overview.md)|
|[Apache Storm](./storm/apache-storm-overview.md)|A distributed, real-time computation system for processing large streams of data fast. Storm is offered as a managed cluster in HDInsight. See [Analyze real-time sensor data using Storm and Hadoop](./storm/apache-storm-overview.md).|
|[Apache Interactive Query](./interactive-query/apache-interactive-query-get-started.md)|In-memory caching for interactive and faster Hive queries. See [Use Interactive Query in HDInsight](./interactive-query/apache-interactive-query-get-started.md).|
|[Apache Kafka](./kafka/apache-kafka-introduction.md)|An open-source platform that's used for building streaming data pipelines and applications. Kafka also provides message-queue functionality that allows you to publish and subscribe to data streams. See [Introduction to Apache Kafka on HDInsight](./kafka/apache-kafka-introduction.md).|

## Open-source components in HDInsight

Azure HDInsight enables you to create clusters with open-source frameworks such as Hadoop, Spark, Hive, LLAP, Kafka, Storm, HBase, and R. These clusters, by default, come with other open-source components that are included on the cluster such as Apache Ambari5, Avro5, Apache Hive3, HCatalog2, Apache Mahout2, Apache Hadoop MapReduce3, Apache Hadoop YARN2, Apache Phoenix3, Apache Pig3, Apache Sqoop3, Apache Tez3, Apache Oozie2, and Apache ZooKeeper5.  

## Programming languages in HDInsight

HDInsight clusters, including Spark, HBase, Kafka, Hadoop, and others, support many programming languages. Some programming languages aren't installed by default. For libraries, modules, or packages that aren't installed by default, use a script action to install the component.

|Programming language  |Information  |
|---------|---------|
|Default programming language support     | By default, HDInsight clusters support:<ul><li>Java</li><li>Python</li><li>.NET</li><li>Go</li></ul>  |
|Java virtual machine (JVM) languages     | Many languages other than Java can run on a Java virtual machine (JVM). However, if you run some of these languages, you might have to install additional components on the cluster. The following JVM-based languages are supported on HDInsight clusters: <ul><li>Clojure</li><li>Jython (Python for Java)</li><li>Scala</li></ul>     |
|Hadoop-specific languages     | HDInsight clusters support the following languages that are specific to the Hadoop technology stack: <ul><li>Pig Latin for Pig jobs</li><li>HiveQL for Hive jobs and SparkSQL</li></ul>        |

## Development tools for HDInsight

You can use HDInsight development tools, including IntelliJ, Eclipse, Visual Studio Code, and Visual Studio, to author and submit HDInsight data query and job with seamless integration with Azure.

* Azure toolkit for IntelliJ10
* Azure toolkit for Eclipse6
* Azure HDInsight tools for VS Code13
* Azure data lake tools for Visual Studio9

## Business intelligence on HDInsight

Familiar business intelligence (BI) tools retrieve, analyze, and report data that is integrated with HDInsight by using either the Power Query add-in or the Microsoft Hive ODBC Driver:

* [Apache Spark BI using data visualization tools with Azure HDInsight](./spark/apache-spark-use-bi-tools.md)

* [Visualize Apache Hive data with Microsoft Power BI in Azure HDInsight](./hadoop/apache-hadoop-connect-hive-power-bi.md)

* [Visualize Interactive Query Hive data with Power BI in Azure HDInsight](./interactive-query/apache-hadoop-connect-hive-power-bi-directquery.md)

* [Connect Excel to Apache Hadoop with Power Query](./hadoop/apache-hadoop-connect-excel-power-query.md) (requires Windows)

* [Connect Excel to Apache Hadoop with the Microsoft Hive ODBC Driver](./hadoop/apache-hadoop-connect-excel-hive-odbc-driver.md) (requires Windows)


## In-region data residency 

Spark, Hadoop, LLAP, Storm, and MLService do not store customer data, so these services automatically satisfy in-region data residency requirements including those specified in the [Trust Center](https://azuredatacentermap.azurewebsites.net/). 

Kafka and HBase do store customer data. This data is automatically stored by Kafka and HBase in a single region, so this service satisfies in-region data residency requirements including those specified in the [Trust Center](https://azuredatacentermap.azurewebsites.net/). 


Familiar business intelligence (BI) tools retrieve, analyze, and report data that is integrated with HDInsight by using either the Power Query add-in or the Microsoft Hive ODBC Driver.

## Next steps

* [Create Apache Hadoop cluster in HDInsight](./hadoop/apache-hadoop-linux-create-cluster-get-started-portal.md)
* [Create Apache Spark cluster - Portal](./spark/apache-spark-jupyter-spark-sql-use-portal.md)
* [Enterprise security in Azure HDInsight](./domain-joined/hdinsight-security-overview.md)
