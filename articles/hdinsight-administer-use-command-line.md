<properties 
	pageTitle="Manage Hadoop clusters using a Command-Line interface | Microsoft Azure" 
	description="Learn how to use the cross-platform Command-Line interface to manage Hadoop clusters in HDIsight on any platform that supports Node.js, including Windows, Mac, and Linux." 
	services="hdinsight" 
	editor="cgronlun" 
	manager="paulettm" 
	authors="mumian" 
	documentationCenter=""/>

<tags 
	ms.service="hdinsight" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/31/2015" 
	ms.author="jgao"/>

# Manage Hadoop clusters in HDInsight by using the Cross-Platform Command-line Interface

Learn how to use the Azure Command-Line interface for Mac, Linux and Windows to manage Hadoop clusters in Azure HDInsight. The Azure CLI is implemented in Node.js. It can be used on any platform that supports Node.js, including Windows, Mac, and Linux. 

The Azure CLI is open source. The source code is managed in GitHub at <a href= "https://github.com/WindowsAzure/azure-sdk-tools-xplat">https://github.com/WindowsAzure/azure-sdk-tools-xplat</a>. 

This article covers only using the command-line interface from Windows. For a general guide on how to use the command-line interface, see [How to use the Azure Command-Line Tools for Mac and Linux] [azure-command-line-tools].


##Prerequisites

Before you begin this article, you must have the following:

- **Azure subscription** - Azure is a subscription-based platform. For more information about obtaining a subscription, see [Purchase Options][azure-purchase-options], [Member Offers][azure-member-offers], or [Free Trial][azure-free-trial].

##Installation
The command-line interface can be installed via *Node.js Package Manager (NPM)* or Windows Installer.

**To install the command-line interface by using NPM**

1.	Browse to **www.nodejs.org**.
2.	Click **INSTALL** and follow the instructions, using the default settings.
3.	Open **Command Prompt** (or **Azure Command Prompt**, or **Developer Command Prompt for VS2012**) from your workstation.
4.	Run the following command in the command prompt window:

		npm install -g azure-cli

	> [AZURE.NOTE] If you get an error saying the NPM command is not found, verify that the following paths are in the **PATH** environment variable: <i>C:\Program Files (x86)\nodejs;C:\Users\[username]\AppData\Roaming\npm</i> or <i>C:\Program Files\nodejs;C:\Users\[username]\AppData\Roaming\npm</i>


5.	Run the following command to verify the installation:

		azure hdinsight -h

	You can use the **-h** switch at different levels to display the help information. For example:
		
		azure -h
		azure hdinsight -h
		azure hdinsight cluster -h
		azure hdinsight cluster create -h

**To install the command-line interface by using Windows Installer**

1.	Browse to **http://azure.microsoft.com/downloads/**.
2.	Scroll down to the **Command line tools** section, and then click **Cross-Platform Command-Line Interface** and follow the Web Platform Installer wizard.

##Download and import an Azure account publishsettings file

Before using the command-line interface, you must configure connectivity between your workstation and Azure. Your Azure subscription information is used by the command-line interface to connect to your account. This information can be obtained from Azure in a publishsettings file. The publishsettings file can then be imported as a persistent local config setting that the command-line interface will use for subsequent operations. You need to import your publishsettings file only once.

> [AZURE.NOTE] The publishsettings file contains sensitive information. It is recommended that you delete the file or take additional steps to encrypt the user folder that contains the file. In Windows, modify the folder properties or use BitLocker Drive Encryption.


**To download and import the publishsettings file**

1.	Open a command prompt.
2.	Run the following command to download the publishsettings file:

		azure account download
 
	![Command-line Interface downloading Azure account.][image-cli-account-download-import]

	The command shows the instructions for downloading the file, including a URL.

3.	Open Internet Explorer and browse to the URL listed in the command prompt window.
4.	Click **Save** to save the file to the workstation.
5.	From the command prompt window, run the following command to import the publishsettings file:

		azure account import <file>

	In the previous screenshot, the publishsettings file was saved to the C:\HDInsight folder on the workstation.


##Provision an HDInsight cluster

[AZURE.INCLUDE [provisioningnote](../includes/hdinsight-provisioning.md)]


HDInsight uses an Azure Blob storage container as the default file system. An Azure Storage account is required before you can create an HDInsight cluster. 

After you have imported the publishsettings file, you can use the following command to create a Storage account:

	azure account storage create [options] <StorageAccountName>


> [AZURE.NOTE] The Storage account must be collocated with HDInsight in the data center.


For information on creating an Azure Storage account by using the Azure portal, see [Create, manage, or delete a Storage account][azure-create-storageaccount].

If you already have a Storage account but do not know the account name and account key, you can use the following commands to retrieve the information:

	-- Lists Storage accounts
	azure account storage list
	-- Shows a Storage account
	azure account storage show <StorageAccountName>
	-- Lists the keys for a Storage account
	azure account storage keys list <StorageAccountName>

For details on getting the information by using the Azure portal, see the "View, copy, and regenerate storage access keys" section of [Create, manage, or delete a Storage account][azure-create-storageaccount].


The **azure hdinsight cluster create** command creates the container if it doesn't exist. If you choose to create the container beforehand, you can use the following command:

	azure storage container create --account-name <StorageAccountName> --account-key <StorageAccountKey> [ContainerName]
		
Once you have the Storage account and the Blob container prepared, you are ready to create a cluster: 

	azure hdinsight cluster create --clusterName <ClusterName> --storageAccountName <StorageAccountName> --storageAccountKey <storageAccountKey> --storageContainer <StorageContainer> --nodes <NumberOfNodes> --location <DataCenterLocation> --username <HDInsightClusterUsername> --clusterPassword <HDInsightClusterPassword>

![HDI.CLIClusterCreation][image-cli-clustercreation]

















##Provision an HDInsight cluster by using a configuration file
Typically, you provision an HDInsight cluster, run jobs on it, and then delete the cluster to cut down the cost. The command-line interface gives you the option to save the configurations into a file, so that you can reuse it every time you provision a cluster.  
 
	azure hdinsight cluster config create <file>
	 
	azure hdinsight cluster config set <file> --clusterName <ClusterName> --nodes <NumberOfNodes> --location "<DataCenterLocation>" --storageAccountName "<StorageAccountName>.blob.core.windows.net" --storageAccountKey "<StorageAccountKey>" --storageContainer "<BlobContainerName>" --username "<Username>" --clusterPassword "<UserPassword>"
	 
	azure hdinsight cluster config storage add <file> --storageAccountName "<StorageAccountName>.blob.core.windows.net"
	       --storageAccountKey "<StorageAccountKey>"
	 
	azure hdinsight cluster config metastore set <file> --type "hive" --server "<SQLDatabaseName>.database.windows.net"
	       --database "<HiveDatabaseName>" --user "<Username>" --metastorePassword "<UserPassword>"
	 
	azure hdinsight cluster config metastore set <file> --type "oozie" --server "<SQLDatabaseName>.database.windows.net"
	       --database "<OozieDatabaseName>" --user "<SQLUsername>" --metastorePassword "<SQLPassword>"
	 
	azure hdinsight cluster create --config <file>
		 


![HDI.CLIClusterCreationConfig][image-cli-clustercreation-config]


##List and show cluster details
Use the following commands to list and show cluster details:
	
	azure hdinsight cluster list
	azure hdinsight cluster show <ClusterName>
	
![HDI.CLIListCluster][image-cli-clusterlisting]


##Delete a cluster
Use the following command to delete a cluster:

	azure hdinsight cluster delete <ClusterName>




##Next steps
In this article, you have learned how to perform different HDInsight cluster administrative tasks. To learn more, see the following articles:

* [Administer HDInsight by using the Azure portal] [hdinsight-admin-portal]
* [Administer HDInsight by using Azure PowerShell] [hdinsight-admin-powershell]
* [Get started with Azure HDInsight] [hdinsight-get-started]
* [How to use the Azure CLI for Mac, Linux and Windows] [azure-command-line-tools]


[azure-command-line-tools]: xplat-cli.md
[azure-create-storageaccount]: storage-create-storage-account.md 
[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/


[hdinsight-admin-portal]: hdinsight-administer-use-management-portal.md
[hdinsight-admin-powershell]: hdinsight-administer-use-powershell.md
[hdinsight-get-started]: hdinsight-get-started.md

[image-cli-account-download-import]: ./media/hdinsight-administer-use-command-line/HDI.CLIAccountDownloadImport.png 
[image-cli-clustercreation]: ./media/hdinsight-administer-use-command-line/HDI.CLIClusterCreation.png
[image-cli-clustercreation-config]: ./media/hdinsight-administer-use-command-line/HDI.CLIClusterCreationConfig.png
[image-cli-clusterlisting]: ./media/hdinsight-administer-use-command-line/HDI.CLIListClusters.png "List and show clusters"
