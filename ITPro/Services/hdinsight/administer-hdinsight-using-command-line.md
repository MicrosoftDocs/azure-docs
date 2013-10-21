<properties linkid="manage-services-hdinsight-administer-hdinsight-using-command-line" urlDisplayName="HDInsight Administration" pageTitle="Administer HDInsight using using the command line interface - Windows Azure" metaKeywords="hdinsight, hdinsight administration, hdinsight administration azure" metaDescription="Learn how to perform administrative tasks for the HDInsight service using the command-line interface." umbracoNaviHide="0" disqusComments="1" writer="jgao" editor="cgronlun" manager="paulettm" />

# Administer HDInsight using Cross-platform Command-line Interface

In this article, you will learn how to using the Cross-platform Command-line Interface to manage HDInsight clusters. The command-line tool is implemented in Node.js. It can be used on any platform that supports Node.js including Windows, Mac and Linux. The command-line tool is open source.  The source code is managed in GitHub at <a href= "https://github.com/WindowsAzure/azure-sdk-tools-xplat">https://github.com/WindowsAzure/azure-sdk-tools-xplat</a>. For a general guide on how to use the command-line interface, see [How to use the Windows Azure Command-Line Tools for Mac and Linux][azure-command-line-tools]. For comprehensive reference documentation, see [Windows Azure command-line tool for Mac and Linux][azure-command-line-tool]. This article only covers using the command-line interface from Windows.


**Prerequisites:**

Before you begin this article, you must have the following:

- A Windows Azure subscription. Windows Azure is a subscription-based platform. The HDInsight PowerShell cmdlets perform the tasks with your subscription. For more information about obtaining a subscription, see [Purchase Options][azure-purchase-options], [Member Offers][azure-member-offers], or [Free Trial][azure-free-trial].

##In this article

* [Installation](#installation)
* [Download and import Windows Azure account publishsettings](#importsettings)
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
3.	Open **Command Prompt** (or *Windows Azure Command Prompt*, or *Developer Command Prompt for VS2012*) from your workstation.
4.	Run the following command in the command prompt window.

		npm install –g azure-cli

	<div class="dev-callout"> 
	<b>Note</b> 
	<p>If you get an error saying the NPM command is not found, verify the following paths are in the PATH environment variable:
	
		C:\Program Files (x86)\nodejs;C:\Users\[username]\AppData\Roaming\npm

	or

		C:\Program Files\nodejs;C:\Users\[username]\AppData\Roaming\npm
	
	</p> 
	</div>

5.	Run the following command to verify the installation:

		azure hdinsight –h

	You can use the *-h* switch at different levels to display the help information.  For example:
		
		azure -h
		azure hdinsight -h
		azure hdinsight cluster -h
		azure hdinsight cluster create -h

**To install the command-line interface using windows installer**

1.	Browse to **http://www.windowsazure.com/en-us/downloads/**.
2.	Scrool down to the **Command line tools** section, and then click **Cross-platform Command Line Interface** and follow the Web Platform Installer wizard.

##<a id="importsettings"></a> Download and import Windows Azure account publishsettings

Before using the command-line interface, you must configure connectivity between your workstation and Windows Azure. Your Windows Azure subscription information is used by the command-line interface to connect to your account. This information can be obtained from Windows Azure in a publishsettings file. The publishsettings file can then be imported as a persistent local config setting that the command-line interface will use for subsequent operations. You only need to import your publishsettings once.


<div class="dev-callout"> 
<b>Important</b> 
<p>The publishsettings file contains sensitive information. It is recommended that you delete the file or take additional steps to encrypt the user folder that contains the file. On Windows, modify the folder properties or use BitLocker.</p> 
</div>


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
HDInsight uses a Windows Azure Blob Storage container as the default file system. A Windows Azure storage account is required before you can create an HDInsight cluster. 

After you have imported the publishsettings file, you can use the following command to create a storage account:

		azure account storage create [options] <StorageAccountName>


<div class="dev-callout"> 
<b>Important</b> 
<p>The storage account must be collocated in the same data center.Currently, you can only provision HDInsight clusters in the following data centers:<p>

<ul>
<li>East US</li>
<li>West US</li>
<li>North Europe</li>
</ul>

</div>

For information on creating a Windows Azure storage account using Windows Azure Management portal, see [How to Create a Storage Account][azure-create-storageaccount].

If you have already had a storage account but do not know the account name and account key, you can use the following commands to retrieve the information:

		-- lists storage accounts
		azure account storage list
		-- Shows a storage account
		azure account storage show <StorageAccountName>
		-- Lists the keys for a storage account
		azure account storage keys list <StorageAccountName>

For details on getting the information using the management portal, see the *How to: View, copy and regenerate storage access keys* section of [How to Manage Storage Accounts][azure-manage-storageaccount].

<div class="dev-callout"> 
<b>Note</b> 
<p>For better performance, collocate the HDInsight cluster and the storage account in the same data center.</p> 
</div>

The *azure hdinsight cluster create* command creates the container if it doesn’t exist. If you choose to create the container beforehand, you can use the following command:

		azure storage container create –-account-name <StorageAccountName> --account-key <StorageAccountKey> [ContainerName]
		
Once you have the storage account and the blob container prepared, you are ready to create a cluster: 

		azure hdinsight cluster create –-clusterName <ClusterName> --storageAccountName <StorageAccountName> --storageAccountKey <storageAccountKey> --storageContainer <StorageContainer> --nodes <NumberOfNodes> --location <DataCenterLocation> --username <HDInsightClusterUsername> --clusterPassword <HDInsightClusterPassword>

![HDI.CLIClusterCreation][image-cli-clustercreation]

















##<a id="provisionconfigfile"></a> Provision an HDInsight cluster using a configuration file
Typically, you provision an HDInsight cluster, run their jobs, and then delete the cluster to cut down the cost. The command-line interface gives you the option to save the configurations into a file, so that you can reuse it every time you provision a cluster.  
 
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

* [Administer HDInsight using management portal][hdinsight-admin]
* [Administer HDInsight using PowerShell][hdinsight-admin-powershell]
* [Monitor HDInsight][hdinsight-monitor]
* [Getting started with Windows Azure HDInsight Service][hdinsight-getting-started]
* [How to use the Windows Azure Command-Line Tools for Mac and Linux][azure-command-line-tools]
* [Windows Azure command-line tool for Mac and Linux][azure-command-line-tool]


[azure-command-line-tools]: /en-us/develop/nodejs/how-to-guides/command-line-tools/
[azure-command-line-tool]: /en-us/manage/linux/other-resources/command-line-tools/
[azure-create-storageaccount]: /en-us/manage/services/storage/how-to-create-a-storage-account/ 
[azure-manage-storageaccount]: /en-us/manage/services/storage/how-to-manage-a-storage-account/
[azure-purchase-options]: https://www.windowsazure.com/en-us/pricing/purchase-options/
[azure-member-offers]: https://www.windowsazure.com/en-us/pricing/member-offers/
[azure-free-trial]: https://www.windowsazure.com/en-us/pricing/free-trial/


[hdinsight-admin]: /en-us/manage/services/hdinsight/howto-administer-hdinsight/
[hdinsight-monitor]: /en-us/manage/services/hdinsight/howto-monitor-hdinsight/
[hdinsight-admin-powershell]: /en-us/manage/services/hdinsight/administer-hdinsight-powershell/
[hdinsight-getting-started]: /en-us/manage/services/hdinsight/get-started-hdinsight/

[image-cli-account-download-import]: ../media/HDI.CLIAccountDownloadImport.png 
[image-cli-clustercreation]: ..\media\HDI.CLIClusterCreation.png
[image-cli-clustercreation-config]: ..\media\HDI.CLIClusterCreationConfig.png
[image-cli-clusterlisting]: ..\media\HDI.CLIListClusters.png "List and show clusters"
