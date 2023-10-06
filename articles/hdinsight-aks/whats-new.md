---
title: What's new in HDInsight on AKS? (Preview)
description: An introduction to new concepts in HDInsight on AKS that aren't in HDInsight.
ms.service: hdinsight-aks
ms.topic: conceptual
ms.date: 08/31/2023
---

# What's new in HDInsight on AKS? (Preview)

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

In HDInsight, all resources are managed on individual clusters, and Ambari is used to manage and operate on hosts and services running on the cluster. In HDInsight on AKS, all cluster management and operations have native support for [service management](./service-configuration.md) on Azure portal for individual clusters on HDInsight on AKS service. 

In HDInsight on AKS, two new concepts are introduced:

* **Cluster Pools** are used to group and manage clusters.
* **Clusters** are used for open source computes, they're hosted within a cluster pool. 

## Cluster Pools

HDInsight on AKS runs on Azure Kubernetes Service (AKS). The top-level resource is the Cluster Pool and manages all clusters running on the same AKS cluster. When you create a Cluster Pool, an underlying AKS cluster is created at the same time to host all clusters in the pool. Cluster pools are a logical grouping of clusters, which helps in building robust interoperability across multiple cluster types and allow enterprises to have the clusters in the same virtual network. Cluster pools provide rapid and cost-effective access to all the cluster types created on-demand and at scale.One cluster pool corresponds to one cluster in AKS infrastructure.

## Clusters

Clusters are individual open source compute workloads, such as Apache Spark, Apache Flink, and Trino, which can be created rapidly in few minutes with preset configurations and few clicks. Though running on the same cluster pool, each cluster can have its own configurations, such as cluster type, version, node VM size, node count. Clusters are running on separated compute resources with its own DNS and endpoints.

## Coming soon

* **Core Platform**
  * RBAC support using Ranger
  * Workload Identity support
  * In Place Upgrade support
  * Multi tenancy in cluster 
  * BCDR & AZ support
  * ADF for cluster CRUD operations
  * Configurable VM SKUs for Headnode, SSH
  * Data Plane RBAC using ARM roles
  * Private AKS cluster and private end point support
  * Script action support after cluster creation
  * Service management support

* **Apache Flink** 
  * Flink App mode clusters
  * SQL gateway support
  * Autoscale with Load Based for Flink

* **Apache Spark**
  * Shuffle aware Autoscale
  * Spark Ranger support - ADLS driver
  * Spark ACID support
  * Iceberg format support
  * JupyterHub support

* **Trino**
  * Support for Add or remove plugins/connectors
  * Support sharded data sources

## Features currently in preview

The following table list shows the features of HDInsight on AKS that are currently in preview. Preview features are sorted alphabetically.

|	Area	|	Features	|	Remarks	|
|	---	|	---	|	---	|
|	Fundamentals	|	Create Pool and clusters using portal	|		|
|	  |	Web ssh support 	|		|
|		|	Ability to Choose number of worker nodes during cluster creation	|		|
|	Storage	|	ADLS Gen2 support for storage	|		|
|	Metastore	|	External Metastore support	|		|
|		|	Integrate with HDI VM version Services	|		|
|	Security	|	Support for ARM RBAC	|		|
|		|	Support for MSI based authentication	|		|
|		|	Option to provide cluster access to other users	|		|
|	Logging and Monitoring	|	Log aggregation in Azure log analytics for server logs	|		|
|		|	Cluster and Service metrics via Managed Prometheus and Grafana	|		|
|		|	Support server metrics in Azure monitor	|		|
|		|	Service Status page for monitoring the service Health	|		|
|	Auto-Scaling	|	Load based Auto Scaling Support	|		|
|		|	Schedule based Auto Scaling Support	|		|
|	Customize and configure	|	Support script actions during cluster create	|		|
|		|	Support library management	|		|
|		|	Service config settings after cluster creation	|		|
|	Trino	|	Support for Trino catalogs	|		|
|		|	Submit queries to the cluster using Trino Cli/Dbeaver	|		|
|		|	Trino CLI Support	|		|
|		|	Add or remove plugins/connectors	|		|
|		|	Support for logging query events	|		|
|		|	Support for scan query statistics for any connector in Trino dashboard	|		|
|		|	Support Trino dashboard for query monitoring	|		|
|		|	Query Caching	|		|
|		|	Integrate with `PowerBI`	|		|
|		|	Integrate with Apache Superset/Redash	|		|
|		|	Support for multiple connectors	|		|
|	Flink	|	Support for Flink native web UI	|		|
|		|	Flink SQL support with HMS	|		|
|		|	Submit jobs to the cluster using REST API	|		|
|		|	Run programs packaged as JAR files via the Flink CLI.  	|		|
|		|	Support for persistent Savepoints	|		|
|		|	Support for update the config options when the job is running. 	|		|
|		|	Connecting to Azure services	|		|
|		|	Submit jobs to the cluster using Flink CLI - Python and Scala shells	|		|
|	Spark	|	Jupyter Notebook	|		|
|		|	Support for Delta lake 2.0	|		|
|		|	Zeppelin Support	|		|
|		|	Support ATS	|		|
|		|	Support for Yarn History server interface	|		|
|		|	Job submission using SSH	|		|
|		|	Job submission using SDK	|		|


