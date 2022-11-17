---
title: Manage Azure HDInsight clusters using Azure CLI
description: Learn how to use the Azure CLI to manage Azure HDInsight clusters. Cluster types include Apache Hadoop, Spark, HBase, Kafka, Interactive Query.
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive,hdiseo17may2017, devx-track-azurecli
ms.date: 11/17/2022
---

# Manage Azure HDInsight clusters using Azure CLI

[!INCLUDE [selector](includes/hdinsight-portal-management-selector.md)]

Learn how to use [Azure CLI](/cli/azure/) to manage Azure HDInsight clusters. The Azure CLI is Microsoft's cross-platform command-line experience for managing Azure resources.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* Azure CLI. If you haven't installed the Azure CLI, see [Install the Azure CLI](/cli/azure/install-azure-cli) for steps.

* An Apache Hadoop cluster on HDInsight. See [Get Started with HDInsight on Linux](hadoop/apache-hadoop-linux-tutorial-get-started.md).

## Connect to Azure

Sign in to your Azure subscription. If you plan to use Azure Cloud Shell, then select **Try it** in the upper-right corner of the code block. Else, enter the command below:

```azurecli-interactive
az login

# If you have multiple subscriptions, set the one to use
# az account set --subscription "SUBSCRIPTIONID"
```

## List clusters

Use [az hdinsight list](/cli/azure/hdinsight#az-hdinsight-list) to list clusters. Edit the commands below by replacing `RESOURCE_GROUP_NAME` with the name of your resource group, then enter the commands:

```azurecli-interactive
# List all clusters in the current subscription
az hdinsight list

# List only cluster name and its resource group
az hdinsight list --query "[].{Cluster:name, ResourceGroup:resourceGroup}" --output table

# List all cluster for your resource group
az hdinsight list --resource-group RESOURCE_GROUP_NAME

# List all cluster names for your resource group
az hdinsight list --resource-group RESOURCE_GROUP_NAME --query "[].{clusterName:name}" --output table
```

## Show cluster

Use [az hdinsight show](/cli/azure/hdinsight#az-hdinsight-show) to show information for a specified cluster. Edit the command below by replacing `RESOURCE_GROUP_NAME`, and `CLUSTER_NAME` with the relevant information, then enter the command:

```azurecli-interactive
az hdinsight show --resource-group RESOURCE_GROUP_NAME --name CLUSTER_NAME
```

## Delete clusters

Use [az hdinsight delete](/cli/azure/hdinsight#az-hdinsight-delete) to delete a specified cluster. Edit the command below by replacing `RESOURCE_GROUP_NAME`, and `CLUSTER_NAME` with the relevant information, then enter the command:

```azurecli-interactive
az hdinsight delete --resource-group RESOURCE_GROUP_NAME --name CLUSTER_NAME
```

You can also delete a cluster by deleting the resource group that contains the cluster. Note, this will delete all the resources in the group including the default storage account.

```azurecli-interactive
az group delete --name RESOURCE_GROUP_NAME
```

## Scale clusters

Use [az hdinsight resize](/cli/azure/hdinsight#az-hdinsight-resize) to resize the specified HDInsight cluster to the specified size. Edit the command below by replacing `RESOURCE_GROUP_NAME`, and `CLUSTER_NAME` with the relevant information. Replace `WORKERNODE_COUNT` with the desired number of worker nodes for your cluster. For more information about scaling clusters, see [Scale HDInsight clusters](./hdinsight-scaling-best-practices.md). Enter the command:

```azurecli-interactive
az hdinsight resize --resource-group RESOURCE_GROUP_NAME --name CLUSTER_NAME --workernode-count WORKERNODE_COUNT
```

## Next steps

In this article, you've learned how to perform different HDInsight cluster administrative tasks. To learn more, see the following articles:

* [Manage Apache Hadoop clusters in HDInsight by using the Azure portal](hdinsight-administer-use-portal-linux.md)
* [Administer HDInsight by using Azure PowerShell](hdinsight-administer-use-powershell.md)
* [Get started with Azure HDInsight](hadoop/apache-hadoop-linux-tutorial-get-started.md)
* [Get started with Azure CLI](/cli/azure/get-started-with-azure-cli)
