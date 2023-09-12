---
title: What's new in HDInsight on AKS?
description: An introduction to new concepts in HDInsight on AKS that aren't in HDInsight.
ms.service: hdinsight-aks
ms.topic: conceptual
ms.date: 08/31/2023
---

# What's new in HDInsight on AKS?

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
