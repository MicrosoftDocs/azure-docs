---
title: What is Apache Spark in HDInsight on AKS? (Preview)
description: An introduction to Apache Spark in HDInsight on AKS
ms.service: hdinsight-aks
ms.topic: conceptual
ms.date: 08/29/2023
---

# What is Apache Spark in HDInsight on AKS? (Preview)

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

Apache Spark is a parallel processing framework that supports in-memory processing to boost the performance of big-data analytic applications. 

Spark provides primitives for in-memory cluster computing. A Spark job can load and cache data into memory and query it repeatedly. In-memory computing is faster than disk-based applications, such as Hadoop, which shares data through Hadoop distributed file system (HDFS). Spark allows integration with the Scala and Python programming languages to let you manipulate distributed data sets like local collections. There's no need to structure everything as map and reduce operations.

:::image type="content" source="./media/spark-overview/spark-overview.png" alt-text="Diagram showing Spark overview in HDInsight on AKS."::: 


## HDInsight Spark in AKS
Azure HDInsight is a managed, full-spectrum, open-source analytics service for enterprises.

Apache Spark in Azure HDInsight is the managed spark service in Microsoft Azure. With Apache Spark on AKS in Azure HDInsight, you can store and process your data all within Azure. Spark clusters in HDInsight are compatible with or [Azure Data Lake Storage Gen2](../../storage/blobs/data-lake-storage-introduction.md), allows you to apply Spark processing on your existing data stores.

The Apache Spark framework for HDInsight on AKS enables fast data analytics and cluster computing using in-memory processing. Jupyter Notebook lets you interact with your data, combine code with markdown text, and do simple visualizations.

Spark on AKS in HDInsight composed of multiple components as pods. 

## Cluster Controllers

Cluster controllers are responsible for installing and managing respective service. Various controllers are installed and managed in a Spark cluster.

## Spark service components

**Zookeeper service:** A three node Zookeeper cluster, serves as distributed coordinator or High Availability storage for other services.

**Yarn service:** Hadoop Yarn cluster, Spark jobs would be scheduled in the cluster as Yarn applications.

**Client Interfaces:** HDInsight on AKS Spark provides various client interfaces. Livy Server, Jupyter Notebook, Spark History Server, provides Spark services to HDInsight on AKS users.
