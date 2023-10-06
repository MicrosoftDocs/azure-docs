---
title: Release notes for Azure HDInsight on AKS  
description: Latest release notes for Azure HDInsight on AKS. Get development tips and details for Trino, Flink, Spark, and more.
ms.service: hdinsight-aks
ms.topic: conceptual
ms.date: 08/29/2023
---

# Azure HDInsight on AKS release notes

This article provides information about the **most recent**- Azure HDInsight on AKS release updates. For information on earlier releases, see [HDInsight on AKS Release Notes Archive](./hdinsight-aks-release-notes-archive.md).

## Summary

Azure HDInsight on AKS is a new version of HDInsight, which runs on Kubernetes and brings in the best of the open source on Kubernetes. It's gaining popularity among enterprise customers for open-source analytics on Azure Kubernetes Services.

## Release date: June 30, 2023

**This release applies to the following**

- Cluster Pool Version: 1.0.6
- Cluster Version: 1.0.4

HDInsight on AKS follows safe deployment practices, and this release is available to all [supported regions](../overview.md#region-availability-public-preview) over several days.

> [!NOTE]
> To understand about HDInsight on AKS versioning and support, refer to the **[versioning page](../versions.md)**.

**HDInsight on AKS Version**

- Release Version: 1.0.4

**General & Platform Updates:**

- HDInsight on AKS portal now supports load based autoscale for Apache Spark
- Public storage for CLI is now available
- HDInsight on AKS Monitoring adds support for Managed Prometheus
- Cascade deletion support added on deletion of cluster pool it deletes all the associated resources
- HDInsight on AKS adds resource business states to portal for customers to identify the state of cluster
- HDInsight on AKS now enables users to custom name their management resource group
- HDInsight on AKS adds more SKU options for default node pool for cluster pool
- HDInsight on AKS has updated to [Azure Kubernetes Services 1.26](https://azure.microsoft.com/updates/generally-available-kubernetes-126-support-in-aks/), update your cluster pools by recreation before the previous version of AKS retires to avoid disruption

**Trino:**

- Updates
  - Trino 410 is now available with this release.
  - Result caching by plan added to HDInsight on AKS
- Bug Fixes
  - CLI showing SLF4J warnings on start are fixed
  - Trino Create failed: failing services are: IngressAuthService is fixed
  - Autoscale doesn't change nodeCount and other minor fixes is fixed
  - Reliability improvements

**Apache Flink:**

- Updates
  - Hive Metastore support is now added to Flink SQL
- Bug Fixes
  - Cluster versions API fixed for Flink 1.16.0-1.0.4.11
  - Reliability improvements

**Spark:**

- Updates
  - Spark connectivity with Kafka/HBase (ESP/non ESP - HDInsight on VM)
  - Schedule based Autoscale now adds support for Graceful Decommission [Spark]
- Bug Fixes
  - Fixed Spark Cluster CRD missing common fields.
  - Reliability improvements

## Release Information

### Operating System version

- Mariner OS 2.0

**Workload versions**

|Workload|Version|
| -------- | -------- |
|Trino |410 |
|Flink |1.16 |
|Apache Spark |3.3.1 |

**Supported Java and Scala versions**

|Java|Scala|
| -------- | -------- |
|8, JDK 1.8.0_345 |2.12.10 |

The preview is available in the following [regions](../overview.md#region-availability-public-preview)

If you have any more questions, contact [Azure Support](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).

### Next steps

- [Azure HDInsight on AKS : Frequently asked questions](../faq.md)
- [Create a cluster pool and cluster](../quickstart-create-cluster.md)
