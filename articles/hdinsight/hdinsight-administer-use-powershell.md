---
title: Manage Apache Hadoop clusters with PowerShell - Azure HDInsight
description: Learn how to perform administrative tasks for the Apache Hadoop clusters in Azure HDInsight by using Azure PowerShell.
ms.service: azure-hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive, devx-track-azurepowershell
author: hareshg
ms.author: hgowrisankar
ms.reviewer: nijelsf
ms.date: 10/17/2024
---

# Manage Apache Hadoop clusters in Azure HDInsight by using PowerShell

[!INCLUDE [selector](includes/hdinsight-portal-management-selector.md)]

You can use Azure PowerShell to control and automate the deployment and management of your workloads in Azure. In this article, you learn how to manage [Apache Hadoop](https://hadoop.apache.org/) clusters in Azure HDInsight by using the Az PowerShell module. For the list of the HDInsight PowerShell cmdlets, see the [Az.HDInsight reference](/powershell/module/az.hdinsight).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

The [Az PowerShell module](/powershell/azure/) installed.

## Create clusters

To create clusters, see [Create Linux-based clusters in HDInsight by using Azure PowerShell](hdinsight-hadoop-create-linux-clusters-azure-powershell.md).

## List clusters

To list all clusters in the current subscription, use the following command:

```powershell
Get-AzHDInsightCluster
```

## Show clusters

To show details of a specific cluster in the current subscription, use the following command:

```powershell
Get-AzHDInsightCluster -ClusterName <Cluster Name>
```

## Delete clusters

To delete a cluster, use the following command:

```powershell
Remove-AzHDInsightCluster -ClusterName <Cluster Name>
```

You can also delete a cluster by removing the resource group that contains the cluster. Deleting a resource group deletes all the resources in the group, including the default storage account.

```powershell
Remove-AzResourceGroup -Name <Resource Group Name>
```

## Scale clusters

You can use the cluster scaling feature to change the number of worker nodes that are used by a cluster that's running in HDInsight without having to re-create the cluster. To change the Hadoop cluster size by using PowerShell, run the following command from a client machine:

```powershell
Set-AzHDInsightClusterSize -ClusterName <Cluster Name> -TargetInstanceCount <NewSize>
```

 For more information about scaling clusters, see [Scale HDInsight clusters](./hdinsight-scaling-best-practices.md).

## Update HTTP user credentials

The [Set-AzHDInsightGatewayCredential](/powershell/module/az.hdinsight/set-azhdinsightgatewaycredential) parameter sets the gateway HTTP credentials of an HDInsight cluster.

```powershell
$clusterName = "CLUSTERNAME"
$credential = Get-Credential -Message "Enter the HTTP username and password:" -UserName "admin"

Set-AzHDInsightGatewayCredential -ClusterName $clusterName -HttpCredential $credential
```

## Find the default storage account

The following PowerShell script demonstrates how to get the default storage account name and the related information:

```powershell
#Connect-AzAccount
$clusterName = "<HDInsight Cluster Name>"

$clusterInfo = Get-AzHDInsightCluster -ClusterName $clusterName
$storageInfo = $clusterInfo.DefaultStorageAccount.split('.')
$defaultStorageType = $storageInfo[1]
$defaultStorageName = $storageInfo[0]

echo "Default Storage account name: $defaultStorageName"
echo "Default Storage account type: $defaultStorageType"

if ($defaultStorageType -eq "blob")
{
    $defaultBlobContainerName = $cluster.DefaultStorageContainer
    $defaultStorageAccountKey = (Get-AzStorageAccountKey -ResourceGroupName $resourceGroupName -Name $defaultStorageAccountName)[0].Value
    $defaultStorageAccountContext = New-AzStorageContext -StorageAccountName $defaultStorageAccountName -StorageAccountKey $defaultStorageAccountKey

    echo "Default Blob container name: $defaultBlobContainerName"
    echo "Default Storage account key: $defaultStorageAccountKey"
}
```

## Find the resource group

In the Azure Resource Manager mode, each HDInsight cluster belongs to an Azure resource group. To find the resource group, use the following command:

```powershell
$clusterName = "<HDInsight Cluster Name>"

$cluster = Get-AzHDInsightCluster -ClusterName $clusterName
$resourceGroupName = $cluster.ResourceGroup
```

## Submit jobs

To use the following products to submit jobs, follow the instructions in the references:

- **MapReduce**: [Run the MapReduce examples included in HDInsight](hadoop/apache-hadoop-run-samples-linux.md)
- **Apache Hive**: [Run Apache Hive queries by using PowerShell](hadoop/apache-hadoop-use-hive-powershell.md)
- **Apache Sqoop**: [Use Apache Sqoop with HDInsight](hadoop/hdinsight-use-sqoop.md)
- **Apache Oozie**: [Use Apache Oozie with Apache Hadoop to define and run a workflow in HDInsight](hdinsight-use-oozie-linux-mac.md)

## Upload data to Azure Blob Storage

To upload data to Azure Blob Storage, see [Upload data to HDInsight](hdinsight-upload-data.md).

## Related content

* [Az.HDInsight cmdlets](/powershell/module/az.hdinsight/#hdinsight)
* [Manage Apache Hadoop clusters in HDInsight by using the Azure portal](hdinsight-administer-use-portal-linux.md)
* [Administer HDInsight by using a command-line interface](hdinsight-administer-use-command-line.md)
* [Create HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md)
* [Submit Apache Hadoop jobs programmatically](hadoop/submit-apache-hadoop-jobs-programmatically.md)
* [Get started with Azure HDInsight](hadoop/apache-hadoop-linux-tutorial-get-started.md)
