---
title: Create Apache Hadoop clusters using PowerShell - Azure HDInsight 
description: Learn how to create Apache Hadoop, Apache HBase, Apache Storm, or Apache Spark clusters on Linux for HDInsight by using Azure PowerShell.
author: hrasheed-msft
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 05/24/2019
ms.author: hrasheed

---
# Create Linux-based clusters in HDInsight using Azure PowerShell

[!INCLUDE [selector](../../includes/hdinsight-create-linux-cluster-selector.md)]

Azure PowerShell is a powerful scripting environment that you can use to control and automate the deployment and management of your workloads in Microsoft Azure. This document provides information about how to create a Linux-based HDInsight cluster by using Azure PowerShell. It also includes an example script.

## Prerequisites

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

You must have the following before starting this procedure:

* An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
* [Azure PowerShell](/powershell/azure/install-Az-ps)

    > [!IMPORTANT]  
    > Azure PowerShell support for managing HDInsight resources using Azure Service Manager is **deprecated**, and was removed on January 1, 2017. The steps in this document use the new HDInsight cmdlets that work with Azure Resource Manager.
    >
    > Please follow the steps in [Install Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-Az-ps) to install the latest version of Azure PowerShell. If you have scripts that need to be modified to use the new cmdlets that work with Azure Resource Manager, see [Migrating to Azure Resource Manager-based development tools for HDInsight clusters](hdinsight-hadoop-development-using-azure-resource-manager.md) for more information.

## Create cluster

[!INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]

To create an HDInsight cluster by using Azure PowerShell, you must complete the following procedures:

* Create an Azure resource group
* Create an Azure Storage account
* Create an Azure Blob container
* Create an HDInsight cluster

The following script demonstrates how to create a new cluster:

[!code-powershell[main](../../powershell_scripts/hdinsight/create-cluster/create-cluster.ps1?range=5-71)]

The values you specify for the cluster login are used to create the Hadoop user account for the cluster. Use this account to connect to services hosted on the cluster such as web UIs or REST APIs.

The values you specify for the SSH user are used to create the SSH user for the cluster. Use this account to start a remote SSH session on the cluster and run jobs. For more information, see the [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md) document.

> [!IMPORTANT]  
> If you plan to use more than 32 worker nodes (either at cluster creation or by scaling the cluster after creation), you must also specify a head node size with at least 8 cores and 14 GB of RAM.
>
> For more information on node sizes and associated costs, see [HDInsight pricing](https://azure.microsoft.com/pricing/details/hdinsight/).

It can take up to 20 minutes to create a cluster.

## Create cluster: Configuration object

You can also create an HDInsight configuration object using `New-AzHDInsightClusterConfig` cmdlet. You can then modify this configuration object to enable additional configuration options for your cluster. Finally, use the `-Config` parameter of the `New-AzHDInsightCluster` cmdlet to use the configuration.

The following script creates a configuration object to configure an R Server on HDInsight cluster type. The configuration enables an edge node, RStudio, and an additional storage account.

[!code-powershell[main](../../powershell_scripts/hdinsight/create-cluster/create-cluster-with-config.ps1?range=59-99)]

> [!WARNING]  
> Using a storage account in a different location than the HDInsight cluster is not supported. When using this example, create the additional storage account in the same location as the server.

## Customize clusters

* See [Customize HDInsight clusters using Bootstrap](hdinsight-hadoop-customize-cluster-bootstrap.md#use-azure-powershell).
* See [Customize HDInsight clusters using Script Action](hdinsight-hadoop-customize-cluster-linux.md).

## Delete the cluster

[!INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]

## Troubleshoot

If you run into issues with creating HDInsight clusters, see [access control requirements](hdinsight-hadoop-create-linux-clusters-portal.md).

## Next steps

Now that you have successfully created an HDInsight cluster, use the following resources to learn how to work with your cluster.

### Apache Hadoop clusters

* [Use Apache Hive with HDInsight](hadoop/hdinsight-use-hive.md)
* [Use Apache Pig with HDInsight](hadoop/hdinsight-use-pig.md)
* [Use MapReduce with HDInsight](hadoop/hdinsight-use-mapreduce.md)

### Apache HBase clusters

* [Get started with Apache HBase on HDInsight](hbase/apache-hbase-tutorial-get-started-linux.md)
* [Develop Java applications for Apache HBase on HDInsight](hbase/apache-hbase-build-java-maven-linux.md)

### Storm clusters

* [Develop Java topologies for Storm on HDInsight](storm/apache-storm-develop-java-topology.md)
* [Use Python components in Storm on HDInsight](storm/apache-storm-develop-python-topology.md)
* [Deploy and monitor topologies with Storm on HDInsight](storm/apache-storm-deploy-monitor-topology-linux.md)

### Apache Spark clusters

* [Create a standalone application using Scala](spark/apache-spark-create-standalone-application.md)
* [Run jobs remotely on an Apache Spark cluster using Apache Livy](spark/apache-spark-livy-rest-interface.md)
* [Apache Spark with BI: Perform interactive data analysis using Spark in HDInsight with BI tools](spark/apache-spark-use-bi-tools.md)
* [Apache Spark with Machine Learning: Use Spark in HDInsight to predict food inspection results](spark/apache-spark-machine-learning-mllib-ipython.md)

