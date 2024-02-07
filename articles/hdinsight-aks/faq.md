---
title: HDInsight on AKS FAQ
description: HDInsight on AKS frequently asked questions.
ms.service: hdinsight-aks
ms.topic: faq
ms.date: 08/29/2023
---

# HDInsight on AKS - Frequently asked questions

This article addresses some common questions about Azure HDInsight on AKS.

## General

* What is HDInsight on AKS?

   HDInsight on AKS is a new HDInsight version, which provides enterprise ready managed cluster service with emerging open-source analytics projects like Apache Flink (for Streaming), Trino (for adhoc analytics and BI), and Apache Spark. For more information, see [Overview](./overview.md).

* What cluster shapes do HDInsight on AKS support?

   HDInsight on AKS supports Trino, Apache Flink, and Apache Spark to start with. However, other cluster shapes such as Kafka, Hive etc., are on roadmap. 
 
* How do I get started with HDInsight on AKS?

   To get started, visit Azure Marketplace and search for Azure HDInsight on AKS service and refer to [getting started](./quickstart-create-cluster.md).

* What happens to existing HDInsight on VM and the clusters I’m running today?

   There are no changes to existing HDInsight (HDInsight on VM). All your existing clusters continue to run, and you can continue to create and scale new HDInsight clusters.

* Which operating system is supported with HDInsight on AKS?

   HDInsight on AKS is based on Mariner OS. For more information, see [OS Version](./release-notes/hdinsight-aks-release-notes.md#operating-system-version).

* In what all Regions are HDInsight on AKS available?

   For a list of supported regions, refer to [Region availability](./overview.md#region-availability-public-preview).

* What’s the cost to deploy an HDInsight on AKS Cluster?

   For more information about pricing, see HDInsight on AKS pricing.

## Cluster management

* Can I run multiple clusters simultaneously?

   Yes, you can run as many clusters as you want per cluster pool simultaneously. However, make sure you aren't constraint by quota for your subscription. The maximum number of nodes allowed in a cluster pool are 250 (in public preview).

* Can I install or add more plugins/libraries on my cluster?

   Yes, you can install custom plugins and libraries depending on the cluster shapes.
   * For Trino, refer to [Install custom plugins](./trino/trino-custom-plugins.md). 
   * For Spark, refer to [Library management in Spark](./spark/library-management.md).
     
* Can I SSH into my cluster?

   Yes, you can SSH onto your cluster via webssh and execute queries and submit jobs directly from there.

## Metastore

* Can I use an external metastore to connect to my cluster?

   Yes, you can use an external metastore. However, we support only Azure SQL Database as an external custom metastore.

* Can I share a metastore across multiple clusters?

   Yes, you can share a metastore across multiple HDInsight of AKS. 

* What's the version of Hive metastore supported?

   Hive metastore version 3.1.2

## Workloads

### Trino

* What is Trino?

   Trino is an open source federated and distributed SQL query engine, which allows you to query data residing on different data sources without moving to a central data warehouse.
    You can query the data using ANSI SQL, no need to learn a new language. For more information, see [Trino overview](./trino/trino-overview.md).

* What all connectors do you support?

   HDInsight on AKS Trino supports multiple connectors.  For more information, see this list of [Trino connectors](./trino/trino-connectors.md).
    We keep on adding new connectors as and when new connectors are available in the open-source version.

* Can I add catalogs to an existing cluster?

   Yes, you can add supported catalogs to the existing cluster. For more information, see [Add catalogs to an existing cluster](./trino/trino-add-catalogs.md).
 
### Apache Flink

* What is Apache Flink?

   Apache Flink is a best-in-class open-source analytic engine for stream processing and performing stateful computation over unbounded and bounded data streams. It can perform computations at in-memory speed and at any scale.
    Flink on HDInsight on AKS offers managed open-source Apache Flink. For more information, see [Flink overview](./flink/flink-overview.md).

* Do you support both session and app mode in Apache Flink?

   In HDInsight on AKS, Flink currently support session mode clusters.  

* What is state backend management and how it's done in HDInsight on AKS? 

   Backends determine where state is stored. When checkpointing is activated, state is persisted upon checkpoints to guard against data loss and recover consistently. How the state is represented internally, and how and where it's persisted upon checkpoints depends on the chosen State Backend. For more information,see [Flink overview](./flink/flink-overview.md)

### Apache Spark 

* What is Apache Spark? 

   Apache Spark is a data processing framework that can quickly perform processing tasks on large data sets, and can also distribute data processing tasks across multiple computers, either on its own or in tandem with other distributed computing tools.   

* What language APIs are supported in Spark? 

   Azure HDInsight on AKS supports Python and Scala. 

* Are external metastore supported in HDInsight on AKS Spark? 

   HDInsight on AKS support external metastore connectivity. Currently only Azure SQL DB in supported as external metastore. 

* What are the various ways to submit jobs in HDInsight on AKS Spark? 

   You can submit jobs on HDInsight on AKS Spark using Jupyter Notebook, Zeppelin Notebook, SDK and cluster terminal. For more information, see [Submit and Manage Jobs on a Spark cluster in HDInsight on AKS](./spark/submit-manage-jobs.md)
