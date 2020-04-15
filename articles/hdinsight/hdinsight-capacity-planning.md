---
title: Cluster capacity planning in Azure HDInsight 
description: Identify key questions for capacity and performance planning of an Azure HDInsight cluster.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive
ms.date: 04/07/2020
---

# Capacity planning for HDInsight clusters

Before deploying an HDInsight cluster, plan for the intended cluster capacity by determining the needed performance and scale. This planning helps optimize both usability and costs. Some cluster capacity decisions can't be changed after deployment. If the performance parameters change, a cluster can be dismantled and re-created without losing stored data.

The key questions to ask for capacity planning are:

* In which geographic region should you deploy your cluster?
* How much storage do you need?
* What cluster type should you deploy?
* What size and type of virtual machine (VM) should your cluster nodes use?
* How many worker nodes should your cluster have?

## Choose an Azure region

The Azure region determines where your cluster is physically provisioned. To minimize the latency of reads and writes, the cluster should be near your data.

HDInsight is available in many Azure regions. To find the closest region, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=hdinsight).

## Choose storage location and size

### Location of default storage

The default storage, either an Azure Storage account or Azure Data Lake Storage, must be in the same location as your cluster. Azure Storage is available at all locations. Data Lake Storage Gen1 is available in some regions - see the current [Data Lake Storage availability](https://azure.microsoft.com/global-infrastructure/services/?products=storage).

### Location of existing data

If you want to use an existing storage account or Data Lake Storage as your cluster's default storage, then you must deploy your cluster at that same location.

### Storage size

On a deployed cluster, you can attach additional Azure Storage accounts or access other Data Lake Storage. All your storage accounts must live in the same location as your cluster. A Data Lake Storage can be in a different location, though great distances may introduce some latency.

Azure Storage has some [capacity limits](../azure-resource-manager/management/azure-subscription-service-limits.md#storage-limits), while  Data Lake Storage Gen1 is almost unlimited.

A cluster can access a combination of different storage accounts. Typical examples include:

* When the amount of data is likely to exceed the storage capacity of a single blob storage
container.
* When the rate of access to the blob container might exceed the threshold where throttling occurs.
* When you want to make data, you've already uploaded to a blob container available to the
cluster.
* When you want to isolate different parts of the storage for reasons of security, or to simplify
administration.

For better performance, use only one container per storage account.

## Choose a cluster type

The cluster type determines the workload your HDInsight cluster is configured to run. Types include [Apache Hadoop](./hadoop/apache-hadoop-introduction.md), [Apache Storm](./storm/apache-storm-overview.md), [Apache Kafka](./kafka/apache-kafka-introduction.md), or [Apache Spark](./spark/apache-spark-overview.md). For a detailed description of the available cluster types, see [Introduction to Azure HDInsight](hdinsight-overview.md#cluster-types-in-hdinsight). Each cluster type has a specific deployment topology that includes requirements for the size and number of nodes.

## Choose the VM size and type

Each cluster type has a set of node types, and each node type has specific options for their VM size and type.

To determine the optimal cluster size for your application, you can benchmark cluster capacity and increase the size as indicated. For example, you can use a simulated workload, or a *canary query*. Run your simulated workloads on different size clusters. Gradually increase the size until the intended performance is reached. A canary query can be inserted periodically among the other production queries to show whether the cluster has enough resources.

For more information on how to choose the right VM family for your workload, see [Selecting the right VM size for your cluster](hdinsight-selecting-vm-size.md).

## Choose the cluster scale

A cluster's scale is determined by the quantity of its VM nodes. For all cluster types, there are node types that have a specific scale, and node types that support scale-out. For example, a cluster may  require exactly three [Apache ZooKeeper](https://zookeeper.apache.org/) nodes or two Head nodes. Worker nodes that do data processing in a distributed fashion benefit from the additional worker nodes.

Depending on your cluster type, increasing the number of worker nodes adds additional computational capacity (such as more cores). More nodes will increase the total memory required for the entire cluster to support in-memory storage of data being processed. As with the choice of VM size and type, selecting the right cluster scale is typically reached empirically. Use simulated workloads or canary queries.

You can scale out your cluster to meet peak load demands. Then scale it back down when those extra nodes are no longer needed. The [Autoscale feature](hdinsight-autoscale-clusters.md) allows you to automatically scale your cluster based upon predetermined metrics and timings. For more information on scaling your clusters manually, see [Scale HDInsight clusters](hdinsight-scaling-best-practices.md).

### Cluster lifecycle

You're charged for a cluster's lifetime. If there are only specific times that you need your cluster, [create on-demand clusters using Azure Data Factory](hdinsight-hadoop-create-linux-clusters-adf.md). You can also create PowerShell scripts that provision and delete your cluster, and then schedule those scripts using [Azure Automation](https://azure.microsoft.com/services/automation/).

> [!NOTE]  
> When a cluster is deleted, its default Hive metastore is also deleted. To persist the metastore for the next cluster re-creation, use an external metadata store such as Azure Database or [Apache Oozie](https://oozie.apache.org/).
<!-- see [Using external metadata stores](hdinsight-using-external-metadata-stores.md). -->

### Isolate cluster job errors

Sometimes errors can occur because of the parallel execution of multiple maps and reduce components on a multi-node cluster. To help isolate the issue, try distributed testing. Run concurrent multiple jobs on a single worker node cluster. Then expand this approach to run multiple jobs concurrently on clusters containing more than one node. To create a single-node HDInsight cluster in Azure, use the *`Custom(size, settings, apps)`* option  and use a value of 1 for *Number of Worker nodes* in the **Cluster size** section when provisioning a new cluster in the portal.

## Quotas

After determining your target cluster VM size, scale, and type, check the current quota capacity limits of your subscription. When you reach a quota limit, you can't deploy new clusters. Or scale out existing clusters by adding more worker nodes. The only quota limit is the CPU Cores quota that exists at the region level for each subscription. For example, your subscription may have 30 core limit in the East US region.

To check your available cores, do the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Navigate to the **Overview** page for the HDInsight cluster.
3. On the left menu, select **Quota limits**.

   The page displays the number of cores in use, the number of available cores, and the total cores.

If you need to request a quota increase, do the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Select **Help + support** on the bottom-left side of the page.
1. Select **New support request**.
1. On the **New support request** page, under **Basics** tab, select the following options:

   - **Issue type**: **Service and subscription limits (quotas)**
   - **Subscription**: the subscription you want to modify
   - **Quota type**: **HDInsight**

     ![Create a support request to increase HDInsight core quota](./media/hdinsight-capacity-planning/hdinsight-quota-support-request.png)

1. Select **Next: Solutions >>**.
1. On the **Details** page, enter a description of the issue, select the severity of the issue, your preferred contact method, and other required fields.
1. Select **Next: Review + create >>**.
1. On the **Review + create** tab, select **Create**.

> [!NOTE]  
> If you need to increase the HDInsight core quota in a private region, [submit a whitelist request](https://aka.ms/canaryintwhitelist).

You can [contact support to request a quota increase](https://docs.microsoft.com/azure/azure-portal/supportability/resource-manager-core-quotas-request).

There are some fixed quota limits. For example, a single Azure subscription can have at most 10,000 cores. For details on these limits, see [Azure subscription and service limits, quotas, and constraints](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits).

## Next steps

* [Set up clusters in HDInsight with Apache Hadoop, Spark, Kafka, and more](hdinsight-hadoop-provision-linux-clusters.md): Learn how to set up and configure clusters in HDInsight.
* [Monitor cluster performance](hdinsight-key-scenarios-to-monitor.md): Learn about key scenarios to monitor for your HDInsight cluster that might affect your cluster's capacity.
