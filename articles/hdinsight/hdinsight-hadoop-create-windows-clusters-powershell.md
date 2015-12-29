<properties
   pageTitle="Create Windows-based Hadoop clusters in HDInsight using Azure PowerShell| Microsoft Azure"
   	description="Learn how to create clusters for Azure HDInsight by using Azure PowerShell."
   services="hdinsight"
   documentationCenter=""
   tags="azure-portal"
   authors="mumian"
   manager="paulettm"
   editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="12/29/2015"
   ms.author="jgao"/>

# Create Windows-based Hadoop clusters in HDInsight using Azure PowerShell

[AZURE.INCLUDE [selector](../../includes/hdinsight-create-windows-cluster-selector.md)]

Learn how to create HDInsight clusters using Azure PowerShell.


###Prerequisites:

Before you begin the instructions in this article, you must have the following:

- Azure subscription. See [Get Azure free trial](http://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
- Azure PowerShell.  See [Install Azure PowerShell 1.0](hdinsight-administer-use-powershell.md#install-azure-powershell-10-and-greater).



## Create using Azure PowerShell
Azure PowerShell is a powerful scripting environment that you can use to control and automate the deployment and management of your workloads in Azure. This section provides instructions on how to create an HDInsight cluster by using Azure PowerShell. For information on configuring a workstation to run HDInsight Windows PowerShell cmdlets, see [Install and configure Azure PowerShell](../install-configure-powershell.md). For more information on using Azure PowerShell with HDInsight, see [Administer HDInsight using PowerShell](hdinsight-administer-use-powershell.md). For the list of the HDInsight Windows PowerShell cmdlets, see [HDInsight cmdlet reference](https://msdn.microsoft.com/library/azure/dn858087.aspx).


The following procedures are needed to create an HDInsight cluster by using Azure PowerShell:

- Create an Azure resource group
- Create an Azure Storage account
- Create an Azure Blob container
- Create an HDInsight cluster

	$subscriptionId = "<Azure Subscription ID>"
	
	$newResourceGroupName = "<Azure Resource Group Name>"
	$location = "<Azure Location>" # for example, "East US 2"
	$newDefaultStorageAccountName = "<Azure Storage Account Name>"
	$newClusterName = "<Azure HDInsight Cluster Name>"
	$clusterSizeInNodes = 1
	
	###########################################
	# login Azure
	###########################################
	Login-AzureRmAccount
	Select-AzureRmSubscription -SubscriptionId $subscriptionId
	
	###########################################
	# Create the resource group
	###########################################
	New-AzureRmResourceGroup -Name $newRresourceGroupName -Location $location
	
	###########################################
	# Preapre default storage account and container
	###########################################
	New-AzureRmStorageAccount -ResourceGroupName $newResourceGroupName -Name $newDefaultStorageAccountName -Location $location
	
	$defaultStorageAccountKey = Get-AzureRmStorageAccountKey -ResourceGroupName $newResourceGroupName -Name $newDefaultStorageAccountName |  %{ $_.Key1 }
	$defaultStorageContext = New-AzureStorageContext -StorageAccountName $newDefaultStorageAccountName -StorageAccountKey $defaultStorageAccountKey
	New-AzureStorageContainer -Name $newClusterName -Context $defaultStorageContext #use the cluster name as the container name
		
	###########################################
	# Create the cluster
	###########################################
	$httpCredential =Get-Credential -Message "Enter the HTTP account credential:"
	New-AzureRmHDInsightCluster `
		-ResourceGroupName $newResourceGroupName `
		-ClusterName $newClusterName `
		-Location $location `
		-ClusterSizeInNodes $clusterSizeInNodes `
		-ClusterType Hadoop `
		-OSType Windows `
		-Version "3.2" `
		-HttpCredential $httpCredential 

## Create using ARM template

You can use Azure PowerShell to deploy an ARM template which creates an HDInsight cluster.  See [Call templates using Azure PowerShell](hdinsight-hadoop-create-windows-clusters-arm-templates.md#call-templates-using-powershell).

##Next steps
In this article, you have learned several ways to create an HDInsight cluster. To learn more, see the following articles:

* [Get started with Azure HDInsight](hdinsight-get-started.md) - Learn how to start working with your HDInsight cluster
* [Use Sqoop with HDInsight](hdinsight-use-sqoop.md) - Learn how to copy data between HDInsight and SQL Database or SQL Server
* [Administer HDInsight using PowerShell](hdinsight-administer-use-powershell.md) - Learn how to work with HDInsight by using Azure PowerShell
* [Submit Hadoop jobs programmatically](hdinsight-submit-hadoop-jobs-programmatically.md) - Learn how to programmatically submit jobs to HDInsight
* [Azure HDInsight SDK documentation] [hdinsight-sdk-documentation] - Discover the HDInsight SDK




[hdinsight-sdk-documentation]: http://msdn.microsoft.com/library/dn479185.aspx
[azure-preview-portal]: https://manage.windowsazure.com
[connectionmanager]: http://msdn.microsoft.com/library/mt146773(v=sql.120).aspx
[ssispack]: http://msdn.microsoft.com/library/mt146770(v=sql.120).aspx
[ssisclustercreate]: http://msdn.microsoft.com/library/mt146774(v=sql.120).aspx
[ssisclusterdelete]: http://msdn.microsoft.com/library/mt146778(v=sql.120).aspx
