<properties
   	pageTitle="Create Hadoop, HBase, Storm, or Spark clusters on Linux in HDInsight using Azure PowerShell | Microsoft Azure"
   	description="Learn how to create Hadoop, HBase, Storm, or Spark clusters on Linux for HDInsight by using Azure PowerShell."
   	services="hdinsight"
   	documentationCenter=""
   	authors="nitinme"
   	manager="paulettm"
   	editor="cgronlun"
	tags="azure-portal"/>

<tags
   	ms.service="hdinsight"
   	ms.devlang="na"
   	ms.topic="article"
   	ms.tgt_pltfrm="na"
   	ms.workload="big-data"
   	ms.date="07/08/2016"
   	ms.author="nitinme"/>

# Create Linux-based clusters in HDInsight by using Azure PowerShell

[AZURE.INCLUDE [selector](../../includes/hdinsight-selector-create-clusters.md)]

Azure PowerShell is a powerful scripting environment that you can use to control and automate the deployment and management of your workloads in Microsoft Azure. This document provides information about how to create a Linux-based HDInsight cluster by using Azure PowerShell. It also includes an example script.

> [AZURE.NOTE] Azure PowerShell is only available on Windows clients. If you are using a Linux, Unix, or Mac OS X client, see [Create a Linux-based HDInsight cluster using Azure CLI](hdinsight-hadoop-create-linux-clusters-azure-cli.md) for information about using the Azure CLI to create a cluster.

## Prerequisites
You must have the following before starting this procedure:

- An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).

- Azure PowerShell.
    For more information about using Azure PowerShell with HDInsight, see [Administer HDInsight using PowerShell](hdinsight-administer-use-powershell.md). For the list of HDInsight Windows PowerShell cmdlets, see [HDInsight cmdlet reference](https://msdn.microsoft.com/library/azure/dn858087.aspx).

    [AZURE.INCLUDE [upgrade-powershell](../../includes/hdinsight-use-latest-powershell.md)]

## Create clusters

[AZURE.INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]

To create an HDInsight cluster by using Azure PowerShell, you must complete the following procedures:

- Create an Azure resource group
- Create an Azure Storage account
- Create an Azure Blob container
- Create an HDInsight cluster

The two most important parameters that you must set to create Linux clusters are the ones that specify the OS type and the SSH user details:

- Make sure you specify the **-OSType** parameter as **Linux**.
- To use SSH for remote sessions on the clusters, you can specify the SSH user password or the SSH public key. If you specify both the SSH user password and the SSH public key, the key will be ignored. If you want to use the SSH key for remote sessions, you must specify a blank SSH password when prompted for one. For more information about using SSH with HDInsight, see one of the following articles:

    * [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md)
    * [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)

The following script demonstrates how to create a new cluster:

    $token ="<SpecifyAnUniqueString>"

    $resourceGroupName = $token + "rg"      # Provide a Resource Group name
    $clusterName = $token
    $defaultStorageAccountName = $token + "store"   # Provide a Storage account name
    $defaultStorageContainerName = $token + "container"
    $location = "East US 2"     # Change the location if needed
    $clusterNodes = 1           # The number of nodes in the HDInsight cluster

    # Sign in to Azure
    Login-AzureRmAccount

    # Select the subscription to use if you have multiple subscriptions
    #$subscriptionID = "<SubscriptionName>"        # Provide your Subscription Name
    #Select-AzureRmSubscription -SubscriptionId $subscriptionID

    # Create an Azure Resource Group
    New-AzureRmResourceGroup -Name $resourceGroupName -Location $location

    # Create an Azure Storage account and container used as the default storage
    New-AzureRmStorageAccount `
        -ResourceGroupName $resourceGroupName `
        -StorageAccountName $defaultStorageAccountName `
        -Location $location `
        -Type Standard_LRS
    $defaultStorageAccountKey = (Get-AzureRmStorageAccountKey -Name $defaultStorageAccountName -ResourceGroupName $resourceGroupName)[0].Key1
    $destContext = New-AzureStorageContext -StorageAccountName $defaultStorageAccountName -StorageAccountKey $defaultStorageAccountKey
    New-AzureStorageContainer -Name $defaultStorageContainerName -Context $destContext

    # Create an HDInsight cluster
    $credentials = Get-Credential -Message "Enter Cluster user credentials" -UserName "admin"
    $sshCredentials = Get-Credential -Message "Enter SSH user credentials"

    # The location of the HDInsight cluster must be in the same data center as the Storage account.
    $location = Get-AzureRmStorageAccount -ResourceGroupName $resourceGroupName -StorageAccountName $defaultStorageAccountName | %{$_.Location}

    New-AzureRmHDInsightCluster `
        -ClusterName $clusterName `
        -ResourceGroupName $resourceGroupName `
        -HttpCredential $credentials `
        -Location $location `
        -DefaultStorageAccountName "$defaultStorageAccountName.blob.core.windows.net" `
        -DefaultStorageAccountKey $defaultStorageAccountKey `
        -DefaultStorageContainer $defaultStorageContainerName  `
        -ClusterSizeInNodes $clusterNodes `
        -ClusterType Hadoop `
        -OSType Linux `
        -Version "3.4" `
        -SshCredential $sshCredentials

The values you specify for **$clusterCredentials** are used to create the Hadoop user account for the cluster. Use this account to connect to the cluster.

The values you specify for **$sshCredentials** are used to create the SSH user for the cluster. Use this account to start a remote SSH session on the cluster and run jobs.

> [AZURE.IMPORTANT] In this script, you must specify the number of worker nodes that will be in the cluster. If you plan to use more than 32 worker nodes (either at cluster creation or by scaling the cluster after creation), you must also specify a head node size with at least 8 cores and 14 GB of RAM.
>
> For more information on node sizes and associated costs, see [HDInsight pricing](https://azure.microsoft.com/pricing/details/hdinsight/).

It can take up to 20 minutes to create a cluster.

The following sample demonstrates how to add an additional storage account:

    # Create another storage account used as additional storage account
    $additionalStorageAccountName = $token + "store2"
    New-AzureRmStorageAccount -ResourceGroupName $resourceGroupName -StorageAccountName $additionalStorageAccountName -Location $location -Type Standard_LRS
    $additionalStorageAccountKey = (Get-AzureRmStorageAccountKey -Name $additionalStorageAccountName -ResourceGroupName $resourceGroupName)[0].Value

    $config = New-AzureRmHDInsightClusterConfig
    Add-AzureRmHDInsightStorage -Config $config -StorageAccountName "$additionalStorageAccountName.blob.core.windows.net" -StorageAccountKey $additionalStorageAccountKey

    # Create a new HDInsight cluster
    New-AzureRmHDInsightCluster `
        -ClusterName $clusterName `
        -ResourceGroupName $resourceGroupName `
        -HttpCredential $credentials `
        -Location $location `
        -DefaultStorageAccountName "$defaultStorageAccountName.blob.core.windows.net" `
        -DefaultStorageAccountKey $defaultStorageAccountKey `
        -DefaultStorageContainer $defaultStorageContainerName  `
        -ClusterSizeInNodes $clusterNodes `
        -ClusterType Hadoop `
        -OSType Linux `
        -Version "3.4" `
        -SshCredential $sshCredentials `
        -Config $config

## Customize clusters

- See [Customize HDInsight clusters using Bootstrap](hdinsight-hadoop-customize-cluster-bootstrap.md#use-azure-powershell).
- See [Customize Windows-based HDInsight clusters using Script Action](hdinsight-hadoop-customize-cluster.md#call-scripts-using-azure-powershell).

## Delete the cluster

[AZURE.INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]

## Next steps

Now that you have successfully created an HDInsight cluster, use the following resources to learn how to work with your cluster.

### Hadoop clusters

* [Use Hive with HDInsight](hdinsight-use-hive.md)
* [Use Pig with HDInsight](hdinsight-use-pig.md)
* [Use MapReduce with HDInsight](hdinsight-use-mapreduce.md)

### HBase clusters

* [Get started with HBase on HDInsight](hdinsight-hbase-tutorial-get-started-linux.md)
* [Develop Java applications for HBase on HDInsight](hdinsight-hbase-build-java-maven-linux.md)

### Storm clusters

* [Develop Java topologies for Storm on HDInsight](hdinsight-storm-develop-java-topology.md)
* [Use Python components in Storm on HDInsight](hdinsight-storm-develop-python-topology.md)
* [Deploy and monitor topologies with Storm on HDInsight](hdinsight-storm-deploy-monitor-topology-linux.md)

### Spark clusters

* [Create a standalone application using Scala](hdinsight-apache-spark-create-standalone-application.md)
* [Run jobs remotely on a Spark cluster using Livy](hdinsight-apache-spark-livy-rest-interface.md)
* [Spark with BI: Perform interactive data analysis using Spark in HDInsight with BI tools](hdinsight-apache-spark-use-bi-tools.md)
* [Spark with Machine Learning: Use Spark in HDInsight to predict food inspection results](hdinsight-apache-spark-machine-learning-mllib-ipython.md)
* [Spark Streaming: Use Spark in HDInsight for building real-time streaming applications](hdinsight-apache-spark-eventhub-streaming.md)
