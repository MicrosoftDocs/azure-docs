<properties urlDisplayName="HDInsight Administration" pageTitle="Manage Hadoop clusters using Cross-Platform Command-Line | Azure" metaKeywords="hdinsight, hdinsight administration, hdinsight administration azure, hadoop, administration" description="Learn how to use the Cross-Platform Command-Line Interface to manage Hadoop clusters in HDIsight on any platform that supports Node.js, including Windows, Mac, and Linux." services="hdinsight" umbracoNaviHide="0" disqusComments="1" editor="cgronlun" manager="paulettm" title="Administer Hadoop clusters using the Cross-platform Command-line Interface" authors="jgao" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="jgao" />

# Manage Hadoop clusters in HDInsight using the Cross-platform Command-line Interface

In this article, you learn how to use the Cross-Platform Command-Line Interface to manage Hadoop clusters in HDInsight. The command-line tool is implemented in Node.js. It can be used on any platform that supports Node.js including Windows, Mac and Linux. 

The command-line tool is open source.  The source code is managed in GitHub at <a href= "https://github.com/WindowsAzure/azure-sdk-tools-xplat">https://github.com/WindowsAzure/azure-sdk-tools-xplat</a>. 

This article only covers using the command-line interface from Windows. For a general guide on how to use the command-line interface, see [How to use the Azure Command-Line Tools for Mac and Linux][azure-command-line-tools]. For comprehensive reference documentation, see [Azure command-line tool for Mac and Linux][azure-command-line-tool].


**Prerequisites:**

Before you begin this article, you must have the following:

- **Azure subscription**. Azure is a subscription-based platform. For more information about obtaining a subscription, see [Purchase Options][azure-purchase-options], [Member Offers][azure-member-offers], or [Free Trial][azure-free-trial].

##In this article

* [Installation](#installation)
* [Download and import Azure account publishsettings](#importsettings)
* [Provision a cluster](#provision)
* [Provision a cluster using configuration file](#provisionconfigfile)
* [List and show clusters](#listshow)
* [Delete a cluster](#delete)
* [Next steps](#nextsteps)

##<a id="installation"></a> Installation
The command-line interface can be installed using *Node.js Package Manager (NPM)* or Windows Installer.

**To install the command-line interface using NPM**

1.	Browse to **www.nodejs.org**.
2.	Click **INSTALL** and following the instructions using the default settings.
3.	Open **Command Prompt** (or *Azure Command Prompt*, or *Developer Command Prompt for VS2012*) from your workstation.
4.	Run the following command in the command prompt window.

		npm install -g azure-cli

	> [WACOM.NOTE] If you get an error saying the NPM command is not found, verify that the following paths are in the PATH environment variable: <i>C:\Program Files (x86)\nodejs;C:\Users\[username]\AppData\Roaming\npm</i> or <i>C:\Program Files\nodejs;C:\Users\[username]\AppData\Roaming\npm</i>


5.	Run the following command to verify the installation:

		azure hdinsight -h

	You can use the *-h* switch at different levels to display the help information.  For example:
		
		azure -h
		azure hdinsight -h
		azure hdinsight cluster -h
		azure hdinsight cluster create -h

**To install the command-line interface using windows installer**

1.	Browse to **http://azure.microsoft.com/en-us/downloads/**.
2.	Scroll down to the **Command line tools** section, and then click **Cross-platform Command Line Interface** and follow the Web Platform Installer wizard.

##<a id="importsettings"></a> Download and import Azure account publishsettings

Before using the command-line interface, you must configure connectivity between your workstation and Azure. Your Azure subscription information is used by the command-line interface to connect to your account. This information can be obtained from Azure in a publishsettings file. The publishsettings file can then be imported as a persistent local config setting that the command-line interface will use for subsequent operations. You only need to import your publishsettings once.

> [WACOM.NOTE] The publishsettings file contains sensitive information. It is recommended that you delete the file or take additional steps to encrypt the user folder that contains the file. On Windows, modify the folder properties or use BitLocker.


**To download and import publishsettings**

1.	Open a **Command Prompt**.
2.	Run the following command to download the publishsettings file.

		azure account download
 
	![HDI.CLIAccountDownloadImport][image-cli-account-download-import]

	The command shows the instructions for downloading the file, including an URL.

3.	Open **Internet Explorer** and browse to the URL listed in the command prompt window.
4.	Click **Save** to save the file to the workstation.
5.	From the command prompt window, run the following command to import the publishsettings file:

		azure account import <file>

	In the previous screenshot, the publishsettings file was saved to C:\HDInsight folder on the workstation.


##<a id="provision"></a> Provision an HDInsight cluster

[WACOM.INCLUDE [provisioningnote](../includes/hdinsight-provisioning.md)]


HDInsight uses an Azure Blob Storage container as the default file system. An Azure storage account is required before you can create an HDInsight cluster. 

After you have imported the publishsettings file, you can use the following command to create a storage account:

	azure account storage create [options] <StorageAccountName>


> [WACOM.NOTE] The storage account must be collocated in the same data center. Currently, you can only provision HDInsight clusters in the following data centers:

><ul>
<li>Southeast Asia</li>
<li>North Europe</li>
<li>West Europe</li>
<li>East US</li>
<li>West US</li>
</ul>


For information on creating an Azure storage account using Azure Management portal, see [How to Create a Storage Account][azure-create-storageaccount].

If you have already had a storage account but do not know the account name and account key, you can use the following commands to retrieve the information:

	-- lists storage accounts
	azure account storage list
	-- Shows a storage account
	azure account storage show <StorageAccountName>
	-- Lists the keys for a storage account
	azure account storage keys list <StorageAccountName>

For details on getting the information using the management portal, see the *How to: View, copy and regenerate storage access keys* section of [How to Manage Storage Accounts][azure-manage-storageaccount].


The *azure hdinsight cluster create* command creates the container if it doesn't exist. If you choose to create the container beforehand, you can use the following command:

	azure storage container create --account-name <StorageAccountName> --account-key <StorageAccountKey> [ContainerName]
		
Once you have the storage account and the blob container prepared, you are ready to create a cluster: 

	azure hdinsight cluster create --clusterName <ClusterName> --storageAccountName <StorageAccountName> --storageAccountKey <storageAccountKey> --storageContainer <StorageContainer> --nodes <NumberOfNodes> --location <DataCenterLocation> --username <HDInsightClusterUsername> --clusterPassword <HDInsightClusterPassword>

![HDI.CLIClusterCreation][image-cli-clustercreation]

















##<a id="provisionconfigfile"></a> Provision an HDInsight cluster using a configuration file
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


##<a id="listshow"></a> List and show cluster details
Use the following commands to list and show cluster details:
	
	azure hdinsight cluster list
	azure hdinsight cluster show <ClusterName>
	
![HDI.CLIListCluster][image-cli-clusterlisting]


##<a id="delete"></a> Delete a cluster
Use the following command to delete a cluster:

	azure hdinsight cluster delete <ClusterName>




##<a id="nextsteps"></a> Next steps
In this article, you have learned how to perform different HDInsight cluster administrative tasks. To learn more, see the following articles:

* [Administer HDInsight using management portal][hdinsight-admin-portal]
* [Administer HDInsight using PowerShell][hdinsight-admin-powershell]
* [Get started with Azure HDInsight][hdinsight-get-started]
* [How to use the Azure Command-Line Tools for Mac and Linux][azure-command-line-tools]
* [Azure command-line tool for Mac and Linux][azure-command-line-tool]


[azure-command-line-tools]: ../xplat-cli/
[azure-command-line-tool]: ../command-line-tools/
[azure-create-storageaccount]: ../storage-create-storage-account/ 
[azure-manage-storageaccount]: ../storage-manage-storage-account/
[azure-purchase-options]: http://azure.microsoft.com/en-us/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/en-us/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/en-us/pricing/free-trial/


[hdinsight-admin-portal]: ../hdinsight-administer-use-management-portal/
[hdinsight-admin-powershell]: ../hdinsight-administer-use-powershell/
[hdinsight-get-started]: ../hdinsight-get-started/

[image-cli-account-download-import]: ./media/hdinsight-administer-use-command-line/HDI.CLIAccountDownloadImport.png 
[image-cli-clustercreation]: ./media/hdinsight-administer-use-command-line/HDI.CLIClusterCreation.png
[image-cli-clustercreation-config]: ./media/hdinsight-administer-use-command-line/HDI.CLIClusterCreationConfig.png
[image-cli-clusterlisting]: ./media/hdinsight-administer-use-command-line/HDI.CLIListClusters.png "List and show clusters"
