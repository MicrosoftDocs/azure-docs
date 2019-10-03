---
title: Manage Azure HDInsight clusters using Azure CLI
description: Learn how to use the Azure CLI to manage Azure HDInsight clusters. Cluster types include Apache Hadoop, Spark, HBase, Storm, Kafka, Interactive Query, and ML Services.
ms.reviewer: jasonh
author: tylerfox

ms.service: hdinsight
ms.custom: hdinsightactive,hdiseo17may2017
ms.topic: conceptual
ms.date: 05/13/2019
ms.author: tyfox
---

# Manage Azure HDInsight clusters using Azure CLI

[!INCLUDE [selector](../../includes/hdinsight-portal-management-selector.md)]

Learn how to use [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest) to manage Azure HDInsight clusters. The Azure command-line interface (CLI) is Microsoft's cross-platform command-line experience for managing Azure resources.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* Azure CLI. If you haven't installed the Azure CLI, see [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) for steps.

* An Apache Hadoop cluster on HDInsight. See [Get Started with HDInsight on Linux](hadoop/apache-hadoop-linux-tutorial-get-started.md).

## Connect to Azure

Sign in to your Azure subscription. If you plan to use Azure Cloud Shell then simply select **Try it** in the upper-right corner of the code block. Else, enter the command below:

```azurecli-interactive
az login

# If you have multiple subscriptions, set the one to use
# az account set --subscription "SUBSCRIPTIONID"
```

## List clusters

Use [az hdinsight list](https://docs.microsoft.com/cli/azure/hdinsight?view=azure-cli-latest#az-hdinsight-list) to list clusters. Edit the commands below by replacing `RESOURCE_GROUP_NAME` with the name of your resource group, then enter the commands:

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

Use [az hdinsight show](https://docs.microsoft.com/cli/azure/hdinsight?view=azure-cli-latest#az-hdinsight-show) to show information for a specified cluster. Edit the command below by replacing `RESOURCE_GROUP_NAME`, and `CLUSTER_NAME` with the relevant information, then enter the command:

```azurecli-interactive
az hdinsight show --resource-group RESOURCE_GROUP_NAME --name CLUSTER_NAME
```

## Delete clusters

Use [az hdinsight delete](https://docs.microsoft.com/cli/azure/hdinsight?view=azure-cli-latest#az-hdinsight-delete) to delete a specified cluster. Edit the command below by replacing `RESOURCE_GROUP_NAME`, and `CLUSTER_NAME` with the relevant information, then enter the command:

```azurecli-interactive
az hdinsight delete --resource-group RESOURCE_GROUP_NAME --name CLUSTER_NAME
```

You can also delete a cluster by deleting the resource group that contains the cluster. Note, this will delete all the resources in the group including the default storage account.

```azurecli-interactive
az group delete --name RESOURCE_GROUP_NAME
```

## Scale clusters

Use [az hdinsight resize](https://docs.microsoft.com/cli/azure/hdinsight?view=azure-cli-latest#az-hdinsight-resize) to resize the specified HDInsight cluster to the specified size. Edit the command below by replacing `RESOURCE_GROUP_NAME`, and `CLUSTER_NAME` with the relevant information. Replace `TARGET_INSTANCE_COUNT` with the desired number of worker nodes for your cluster. For more information about scaling clusters, see [Scale HDInsight clusters](./hdinsight-scaling-best-practices.md). Enter the command:

```azurecli-interactive
az hdinsight resize --resource-group RESOURCE_GROUP_NAME --name CLUSTER_NAME --target-instance-count TARGET_INSTANCE_COUNT
```

## Next steps

In this article, you have learned how to perform different HDInsight cluster administrative tasks. To learn more, see the following articles:

* [Manage Apache Hadoop clusters in HDInsight by using the Azure portal](hdinsight-administer-use-portal-linux.md)
* [Administer HDInsight by using Azure PowerShell](hdinsight-administer-use-powershell.md)
* [Get started with Azure HDInsight](hadoop/apache-hadoop-linux-tutorial-get-started.md)
* [Get started with Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli?view=azure-cli-latest)
