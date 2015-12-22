<properties
	pageTitle="Manage Hadoop clusters using Azure CLI | Microsoft Azure"
	description="How to use the Azure CLI to manage Hadoop clusters in HDIsight"
	services="hdinsight"
	editor="cgronlun"
	manager="paulettm"
	authors="mumian"
	tags="azure-portal"
	documentationCenter=""/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="12/16/2015"
	ms.author="jgao"/>

# Manage Hadoop clusters in HDInsight using the Azure CLI

[AZURE.INCLUDE [selector](../../includes/hdinsight-portal-management-selector.md)]

Learn how to use the [Azure Command-line Interface](xplat-cli-install.md) to manage Hadoop clusters in Azure HDInsight. The Azure CLI is implemented in Node.js. It can be used on any platform that supports Node.js, including Windows, Mac, and Linux.

This article covers only using the Azure CLI with HDInsight. For a general guide on how to use Azure CLI, see [Install and configure Azure CLI][azure-command-line-tools].

##Prerequisites

Before you begin this article, you must have the following:

- **An Azure subscription**. See [Get Azure free trial](http://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
- **Azure CLI** - See [Install and configure the Azure CLI](../xplat-cli-install.md) for installation and configuration information.
- **Connect to Azure**, using the following command:

		azure login

	For more information on authenticating using a work or school account, see [Connect to an Azure subscription from the Azure CLI](xplat-cli-connect.md).
	
- **Switch to the Azure Resource Manager mode**, using the following command:

		azure config mode arm

To get help, use the **-h** switch.  For example:

	azure hdinsight cluster create -h
	
##Create clusters

[AZURE.INCLUDE [provisioningnote](../../includes/hdinsight-provisioning.md)]

You must have a Azure Resource Management (ARM), and a Azure Blob storage account before you can create a HDInsight cluster. To create a HDInsight cluster, you must specify the following:

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

	For details on getting the information by using the Azure Portal, see the "View, copy, and regenerate storage access keys" section of [Create, manage, or delete a Storage account][azure-create-storageaccount].

- **(Optional) Default Blob container**: The **azure hdinsight cluster create** command creates the container if it doesn't exist. If you choose to create the container beforehand, you can use the following command:

	azure storage container create --account-name "<Storage Account Name>" --account-key <Storage Account Key> [ContainerName]

Once you have the Storage account prepared, you are ready to create a cluster:

	azure hdinsight cluster create --resource-group <Resource Group Name> --clusterName <Cluster Name> --location <Location> --osType <Windows | Linux> --version <Cluster Version> --clusterType <Hadoop | HBase | Spark | Storm> --storageAccountName <Default Storage Account Name> --storageAccountKey <Storage Account Key> --storageContainer <Default Storage Container> --username <HDInsight Cluster Username> --password <HDInsight Cluster Password> --sshUserName <SSH Username> --sshPassword <SSH User Password> --workerNodeCount <Number of Worker Nodes>


##Create clusters using configuration files
Typically, you create an HDInsight cluster, run jobs on it, and then delete the cluster to cut down the cost. The command-line interface gives you the option to save the configurations into a file, so that you can reuse it every time you create a cluster.  

	azure hdinsight config create [options ] <Config File Path> <overwirte>
	azure hdinsight config add-config-values [options] <Config File Path>
	azure hdinsight config add-script-action [options] <Config File Path>

Example: Create a configuration file that contains a script action to run when creating a cluster.

	azure hdinsight config create "C:\myFiles\configFile.config"
	azure hdinsight config add-script-action --configFilePath "C:\myFiles\configFile.config" --nodeType HeadNode --uri <Script Action URI> --name myScriptAction --parameters "-param value"
	azure hdinsight cluster create --configurationPath "C:\myFiles\configFile.config"

##Create clusters with a script action

Here is an example:

	azure hdinsight cluster create -g myarmgroup01 -l westus -y Linux --clusterType Hadoop --version 3.2 --defaultStorageAccountName mystorageaccount --defaultStorageAccountKey <defaultStorageAccountKey> --defaultStorageContainer mycontainer --userName admin --password <clusterPassword> --sshUserName sshuser --sshPassword <sshPassword> --workerNodeCount 1 –configurationPath "C:\myFiles\configFile.config" myNewCluster01
	
For general script action information, see [Customize HDInsight clusters using Script Action (Linux)](hdinsight-hadoop-customize-cluster-linux.md).

##List and show cluster details
Use the following commands to list and show cluster details:

	azure hdinsight cluster list
	azure hdinsight cluster show <Cluster Name>

![HDI.CLIListCluster][image-cli-clusterlisting]


##Delete clusters
Use the following command to delete a cluster:

	azure hdinsight cluster delete <Cluster Name>

##Scale clusters

To change the Hadoop cluster size:

	azure hdinsight cluster resize [options] <clusterName> <Target Instance Count>


## Enable/disable HTTP access for a cluster

	azure hdinsight cluster enable-http-access [options] <Cluster Name> <userName> <password>
	azure hdinsight cluster disable-http-access [options] <Cluster Name>

## Enable/disable RDP access for a cluster

  	azure hdinsight cluster enable-rdp-access [options] <Cluster Name> <rdpUserName> <rdpPassword> <rdpExpiryDate>
  	azure hdinsight cluster disable-rdp-access [options] <Cluster Name>


##Next steps
In this article, you have learned how to perform different HDInsight cluster administrative tasks. To learn more, see the following articles:

* [Administer HDInsight by using the Azure Portal] [hdinsight-admin-portal]
* [Administer HDInsight by using Azure PowerShell] [hdinsight-admin-powershell]
* [Get started with Azure HDInsight] [hdinsight-get-started]
* [How to use the Azure CLI] [azure-command-line-tools]


[azure-command-line-tools]: ../xplat-cli.md
[azure-create-storageaccount]: ../storage-create-storage-account.md
[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/


[hdinsight-admin-portal]: hdinsight-administer-use-management-portal.md
[hdinsight-admin-powershell]: hdinsight-administer-use-powershell.md
[hdinsight-get-started]: ../hdinsight-get-started.md

[image-cli-account-download-import]: ./media/hdinsight-administer-use-command-line/HDI.CLIAccountDownloadImport.png
[image-cli-clustercreation]: ./media/hdinsight-administer-use-command-line/HDI.CLIClusterCreation.png
[image-cli-clustercreation-config]: ./media/hdinsight-administer-use-command-line/HDI.CLIClusterCreationConfig.png
[image-cli-clusterlisting]: ./media/hdinsight-administer-use-command-line/HDI.CLIListClusters.png "List and show clusters"
