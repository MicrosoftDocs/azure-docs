<properties
   pageTitle="Create Windows-based Hadoop clusters in HDInsight using Azure CLI"
   	description="Learn how to create clusters for Azure HDInsight by using Azure CLI."
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
   ms.date="05/27/2016"
   ms.author="jgao"/>

# Create Windows-based Hadoop clusters in HDInsight using Azure CLI

[AZURE.INCLUDE [selector](../../includes/hdinsight-selector-create-clusters.md)]

Learn how to create HDInsight clusters using Azure CLI. For other cluster creation tools and features click the tab select on the top of this page or see [Cluster creation methods](hdinsight-provision-clusters.md#cluster-creation-methods).

##Prerequisites:

[AZURE.INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]


Before you begin the instructions in this article, you must have the following:

- **Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
- **Azure CLI**.

	[AZURE.INCLUDE [use-latest-version](../../includes/hdinsight-use-latest-cli.md)] 

##Connect to Azure

Use the following command to connect to Azure:

	azure login

For more information on authenticating using a work or school account, see [Connect to an Azure subscription from the Azure CLI](../xplat-cli-connect.md).

Use the following command to switch to the ARM mode:

	azure config mode arm

To get help, use the **-h** switch.  For example:

	azure hdinsight cluster create -h

##Create clusters

You must have a Azure Resource Management (ARM), and a Azure Blob storage account before you can create an HDInsight cluster. To create an HDInsight cluster, you must specify the following:

- **Azure Resource Group**: A Data Lake Analytics account must be created within a Azure Resource group. Azure Resource Manager enables you to work with the resources in your application as a group. You can deploy, update or delete all of the resources for your application in a single, coordinated operation.

	To list the resource groups in your subscription:

		azure group list

	To create a new resource group:

		azure group create -n "<Resource Group Name>" -l "<Azure Location>"

- **HDInsight cluster name**

- **Location**: One of the Azure data centers that supports HDInsight clusters. For a list of supported locations, see [HDInsight pricing](https://azure.microsoft.com/pricing/details/hdinsight/).

- **Default storage account**: HDInsight uses an Azure Blob storage container as the default file system. An Azure Storage account is required before you can create an HDInsight cluster.

	To create a new Azure storage account:

		azure storage account create "<Azure Storage Account Name>" -g "<Resource Group Name>" -l "<Azure Location>" --type LRS

	> [AZURE.NOTE] The Storage account must be collocated with HDInsight in the data center.
	> The storage account type can't be ZRS, because ZRS doesn't support table.

	For information on creating an Azure Storage account by using the Azure Portal, see [Create, manage, or delete a Storage account][azure-create-storageaccount].

	If you already have a Storage account but do not know the account name and account key, you can use the following commands to retrieve the information:

		-- Lists Storage accounts
		azure storage account list
		-- Shows a Storage account
		azure storage account show "<Storage Account Name>"
		-- Lists the keys for a Storage account
		azure storage account keys list "<Storage Account Name>" -g "<Resource Group Name>"

	For details on getting the information by using the Azure Portal, see the "Manage your storage account" section of [About Azure storage accounts](../storage/storage-create-storage-account#manage-your-storage-account).

- **(Optional) Default Blob container**: The **azure hdinsight cluster create** command creates the container if it doesn't exist. If you choose to create the container beforehand, you can use the following command:

	azure storage container create --account-name "<Storage Account Name>" --account-key <Storage Account Key> [ContainerName]

Once you have the Storage account prepared, you are ready to create a cluster:


    azure hdinsight cluster create -g <Resource Group Name> -c <HDInsight Cluster Name> -l <Location> --osType <Windows | Linux> --version <Cluster Version> --clusterType <Hadoop | HBase | Spark | Storm> --workerNodeCount 2 --headNodeSize Large --workerNodeSize Large --defaultStorageAccountName <Azure Storage Account Name>.blob.core.windows.net --defaultStorageAccountKey "<Default Storage Account Key>" --defaultStorageContainer <Default Blob Storage Container> --userName admin --password "<HTTP User Password>" --rdpUserName <RDP Username> --rdpPassword "<RDP User Password" --rdpAccessExpiry "03/01/2016"


##Create clusters using configuration files
Typically, you create an HDInsight cluster, run jobs on it, and then delete the cluster to cut down the cost. The command-line interface gives you the option to save the configurations into a file, so that you can reuse it every time you create a cluster.  

	azure hdinsight config create [options ] <Config File Path> <overwirte>
	azure hdinsight config add-config-values [options] <Config File Path>
	azure hdinsight config add-script-action [options] <Config File Path>

Example: Create a configuration file that contains a script action to run when creating a cluster.

	azure hdinsight config create "C:\myFiles\configFile.config"
	azure hdinsight config add-script-action --configFilePath "C:\myFiles\configFile.config" --nodeType HeadNode --uri <Script Action URI> --name myScriptAction --parameters "-param value"
	azure hdinsight cluster create --configurationPath "C:\myFiles\configFile.config"

##Create clusters with script action

Create a configuration file that contains a script action to run when creating a cluster.

    azure hdinsight config create "C:\myFiles\configFile.config"
    azure hdinsight config add-script-action --configFilePath "C:\myFiles\configFile.config" --nodeType HeadNode --uri <scriptActionURI> --name myScriptAction --parameters "-param value"

Create a cluster with a script action

	azure hdinsight cluster create -g myarmgroup01 -l westus -y Windows --clusterType Hadoop --version 3.2 --defaultStorageAccountName mystorageaccount --defaultStorageAccountKey <defaultStorageAccountKey> --defaultStorageContainer mycontainer --userName admin --password <clusterPassword> --sshUserName sshuser --sshPassword <sshPassword> --workerNodeCount 1 –configurationPath "C:\myFiles\configFile.config" myNewCluster01


For general script action information, see [Customize HDInsight clusters using Script Action (Linux)](hdinsight-hadoop-customize-cluster.md).


## Create clusters using ARM templates

You can use CLI to create clusters by calling ARM templates. See [Deploy with Azure CLI](hdinsight-hadoop-create-windows-clusters-arm-templates.md#deploy-with-azure-cli).

## See also

- [Get started with Azure HDInsight](hdinsight-hadoop-linux-tutorial-get-started.md) - Learn how to start working with your HDInsight cluster
- [Submit Hadoop jobs programmatically](hdinsight-submit-hadoop-jobs-programmatically.md) - Learn how to programmatically submit jobs to HDInsight
- [Manage Hadoop clusters in HDInsight using the Azure CLI](hdinsight-administer-use-command-line.md)
- [Using the Azure CLI for Mac, Linux, and Windows with Azure Service Management](../virtual-machines-command-line-tools.md)
