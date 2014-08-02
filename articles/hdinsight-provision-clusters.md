<properties linkid="manage-services-hdinsight-provision-hadoop-clusters" urlDisplayName="HDInsight Administration" pageTitle="Provision Hadoop clusters in HDInsight | Azure" metaKeywords="hdinsight, hdinsight administration, hdinsight administration azure" description="Learn how to provision clusters for Azure HDInsight using the management portal, PowerShell, or the command line." umbracoNaviHide="0" disqusComments="1" editor="cgronlun" manager="paulettm" services="hdinsight" documentationCenter="" title="Provision Hadoop clusters in HDInsight" authors="jgao" />

#Provision Hadoop clusters in HDInsight

In this article, you will learn different ways to provision HDInsight cluster.

**Prerequisites:**

Before you begin this article, you must have the following:

- An Azure subscription. Azure is a subscription-based platform. The HDInsight PowerShell cmdlets perform the tasks with your subscription. For more information about obtaining a subscription, see [Purchase Options][azure-purchase-options], [Member Offers][azure-member-offers], or [Free Trial][azure-free-trial].

##In this article

* [Using Azure Management Portal](#portal)
* [Using Azure PowerShell](#powershell)
* [Using Cross-platform Command Line](#cli)
* [Using HDInsight .NET SDK](#sdk)
* [Next steps](#nextsteps)

##<a id="portal"></a> Using Azure Management Portal

HDInsight cluster uses an Azure Blob Storage container as the default file system. An Azure storage account located on the same data center is required before you can create a HDInsight cluster. For more information, see [Use Azure Blob Storage with HDInsight][hdinsight-storage]. For details on creating an Azure storage account, see [How to Create a Storage Account][azure-create-storageaccount].


> [WACOM.NOTE] Currently, only the Southeast Asia, North Europe, West Europe, East US and the West US regions can host HDInsight clusters.

This session describes the procedure for creating an HDInsight cluster using the custom create option.  For the information on using the quick create option, see [Get Started with Azure HDInsight][hdinsight-get-started].


**To create a HDInsight cluster using the custom create option**

1. Sign in to the [Azure Management Portal][azure-management-portal].
2. Click **+ NEW** on the bottom of the page, click **DATA SERVICES**, click **HDINSIGHT**, and then click **CUSTOM CREATE**.
3. On the Cluster Details page, type or choose the following values:

	<table border='1'>
		<tr><th>Property</th><th>Value</th></tr>
		<tr><td>CLUSTER NAME</td>
			<td><p>Name the cluster. </p>
				<ul>
				<li>DNS name must start and end with alpha numeric, may contain dashes.</li>
				<li>The field must be a string between 3 to 63 characters.</li>
				</ul></td></tr>
		<tr><td>DATA NODES</td>
			<td>Specify the number of nodes in the cluster. The default value is 4.</td></tr>
		<tr><td>HDINSIGHT VERSION</td>
			<td>Choose the version. The default is 2.0 running Hadoop 1.2 clusters.  The 3.0 uses Hadoop 2.2 clusters. For more information, see <a href="http://azure.microsoft.com/en-us/documentation/articles/hdinsight-component-versioning/">What version of Hadoop is in Azure HDInsight?</a>.</td></tr>
		<tr><td>REGION</td>
			<td>Specify the data center where the cluster is installed. The location has to be the same as the Azure Blob storage that will be used as the default file system. Currently you can only choose *Southeast Asia*, *North Europe*, *West Europe*, *East US* or *West US*.</td>
		</tr>
	</table>

	![HDI.CustomProvision.Page1][image-customprovision-page1]

4. Click the right arrow on the bottom right corner of the page.
5. On the Configure Cluster User page, type or choose the following value:

	<table border='1'>
		<tr><th>Property</th><th>Value</th></tr>
		<tr><td>USER NAME</td>
			<td>Specify the HDInsight cluster user name.</td></tr>
		<tr><td><p>PASSWORD</p><p>CONFIRM PASSWORD</p></td>
			<td>Specify the HDInsight cluster user password.</td></tr>
		<tr><td>Enter Hive/Oozie Metastore</td>
			<td>Specify a SQL database on the same data center to be used as the Hive/Oozie metastore.</td></tr>
		<tr><td>HIVE META/OOZIESTORE DATABASE</td>
			<td>Specify the Azure SQL database that will be used as the metastore for Hive/OOzie. This SQL database must be in the same data center as the HDInsight cluster. The list box only lists the SQL databases in the same data center as you specified on the Cluster Details page.</td></tr>
		<tr><td>DATABASE USER</td>
			<td>Specify the SQL database user that will be used to connect to the database.</td></tr>
		<tr><td>DATABASE USER PASSWORD</td>
			<td>Specify the SQL database user password.</td></tr>
	</table>

	For version 2.0 HDInsight cluster, the credentials provided here can only access the services on the cluster. Remote Desktop can be turned on after the cluster is created.

	![HDI.CustomProvision.Page2][image-customprovision-page2]


6. Click the right arrow on the bottom right corner of the page.
7. On the Storage Account page, type or choose the following value:

	<table border='1'>
		<tr><th>Property</th><th>Value</th></tr>
		<tr><td>STORAGE ACCOUNT</td>
			<td>Specify the Azure Storage account that will be used as the default file system for the HDInsight cluster. You can choose one of the three options:
			<ul>
				<li>Use Existing Storage</li>
				<li>Create New Storage</li>
				<li>Use Storage From Another Subscription</li>
			</ul>
			</td></tr>
		<tr><td>ACCOUNT NAME</td>
			<td>When <b>Use Existing Storage</b> is chosen, the list box only lists the storage accounts located on the same data center.</td></tr>
		<tr><td>ACCOUNT KEY</td>
			<td>This field is only available when <strong>Use Storage From Another Subscription</strong> is chosen in the STORAGE ACCOUNT field.</td></tr>	
		<tr><td>DEFAULT CONTAINER</td>
			<td>The default container on the storage account will be used as the default file system for the HDInsight cluster. When <strong>Use Existing Storage</strong> in the STORAGE ACCOUNT field and <strong>Create default container</strong> in the DEFAULT CONTAINER filed are chosen, the default container name has the same name as the cluster. If a container with the name fo the cluster already exists, a sequence number will be appended to the container name. For example, mycontainer1, mycontainer2, and so on.</td></tr>
		<tr><td>ADDITIONAL STORAGE ACCOUNTS</td>
			<td>HDInsight supports multiple storage accounts. There is no limits of the additional storage account that can be used by a cluster. However, if you create a cluster using the Management Portal, you will find a limit of seven due to the UI constraints. Each additional storage account you specify in this field adds an extra Storage Account page where you can specify the account information. For example, in the following screenshot, 1 additional storage account is selected, the page 4 is added to the dialog.</td></tr>		
	</table>

	![HDI.CustomProvision.Page3][image-customprovision-page3]

8. Click the right arrow on the bottom right corner of the page.
9. On the Storage Account page, enter the account information for the additional storage account:

	![HDI.CustomProvision.Page4][image-customprovision-page4]

10. Click the Complete button (the check icon) on the bottom right corner to start the HDInsight cluster provision process.

It can take several minutes to provision a cluster.  When the provision process is completed successfully, the status column for the cluster will show **Running**.

> [WACOM.NOTE] Once an Azure storage account is chosen for your HDInsight cluster, you can neither delete the account, nor change the account to a different account.













































##<a id="powershell"></a> Using Azure PowerShell
Azure PowerShell is a powerful scripting environment that you can use to control and automate the deployment and management of your workloads in Azure. For information on configuring a workstation to run HDInsight Powershell cmdlets, see [Install and configure Azure PowerShell][powershell-install-configure]. For more information on using PowerShell with HDInsight, see [Administer HDInsight using PowerShell][hdinsight-admin-powershell]. For the list of the HDInsight PowerShell cmdlets, see [HDInsight cmdlet reference][hdinsight-powershell-reference].

The following procedures are needed to provision an HDInsight cluster using PowerShell:

- Create an Azure Storage account
- Create an Azure Blob container
- Create a HDInsight cluster

HDInsight uses an Azure Blob Storage container as the default file system. An Azure storage account and storage container are required before you can create an HDInsight cluster. The storage account must be located in the same data center as the HDInsight Cluster.


**To create an Azure storage account**

- Run the following commands from an Azure PowerShell console window:

		$storageAccountName = "<StorageAcccountName>"
		$location = "<MicrosoftDataCenter>"		# For example, "West US"
		
		# Create an Azure storage account
		New-AzureStorageAccount -StorageAccountName $storageAccountName -Location $location
	
	If you have already had a storage account but do not know the account name and account key, you can use the following PowerShell commands to retrieve the information:
	
		# List storage accounts for the current subscription
		Get-AzureStorageAccount

		# List the keys for a storage account
		Get-AzureStorageKey "<StorageAccountName>"
	
**To create Azure storage container**

- Run the following commands from an Azure PowerShell window:

		$storageAccountName = "<StorageAccountName>"
		$storageAccountKey = "<StorageAccountKey>"
		$containerName="<ContainerName>"

		# Create a storage context object
		$destContext = New-AzureStorageContext -StorageAccountName $storageAccountName 
		                                       -StorageAccountKey $storageAccountKey  
		 
		# Create a Blob storage container
		New-AzureStorageContainer -Name $containerName -Context $destContext

Once you have the storage account and the blob container prepared, you are ready to create a cluster. 

**To provision an HDInsight cluster**

- Run the following commands from an Azure PowerShell window:		

		$subscriptionName = "<SubscriptionName>"		# The name of the Azure subscription.
		$storageAccountName = "<StorageAccountName>"	# The Azure storage account that hosts the default container. The default container will be used as the default file system.
		$containerName = "<ContainerName>"				# The Azure Blob storage container that will be used as the default file system for the HDInsight cluster.

		$clusterName = "<HDInsightClusterName>"			# The name you will name your HDInsight cluster.
		$location = "<MicrosoftDataCenter>"				# The location of the HDInsight cluster. It must in the same data center as the storage account.
		$clusterNodes = <ClusterSizeInNodes>			# The number of nodes in the HDInsight cluster.

		# Get the storage primary key based on the account name
		Select-AzureSubscription $subscriptionName
		$storageAccountKey = Get-AzureStorageKey $storageAccountName | %{ $_.Primary }

		# Create a new HDInsight cluster
		New-AzureHDInsightCluster -Name $clusterName -Location $location -DefaultStorageAccountName "$storageAccountName.blob.core.windows.net" -DefaultStorageAccountKey $storageAccountKey -DefaultStorageContainerName $containerName  -ClusterSizeInNodes $clusterNodes

	It can take several minutes before the cluster provision completes.

	![HDI.CLI.Provision][image-hdi-ps-provision]

You can also provision cluster and configure it to connect to more than one Azure Blob storage or custom Hive and Oozie metastores. This advanced feature allows you to separate lifetime of your data and metadata from the lifetime of the cluster. 

**To provision an HDInsight cluster using configuration**

> [WACOM.NOTE] The PowerShell cmdlets are the only recommended way to change configruation variables in an HDInsight cluster.  Changes made to Hadoop configuration files while connected to the cluster via Remote Desktop may be overwritten in the event of clsuter patching.  Configuration values set via PowerShell will be preserved if the cluster is patched. 

- Run the following commands from a Windows PowerShell window:

		$subscriptionName = "<SubscriptionName>"
		$clusterName = "<ClusterName>"
		$location = "<MicrosoftDataCenter>"
		$clusterNodes = <ClusterSizeInNodes>
		
		$storageAccountName_Default = "<DefaultFileSystemStorageAccountName>"
		$containerName_Default = "<DefaultFileSystemContainerName>"
		
		$storageAccountName_Add1 = "<AdditionalStorageAccountName>"
		
		$hiveSQLDatabaseServerName = "<SQLDatabaseServerNameForHiveMetastore>"
		$hiveSQLDatabaseName = "<SQLDatabaseDatabaseNameForHiveMetastore>"
		$oozieSQLDatabaseServerName = "<SQLDatabaseServerNameForOozieMetastore>"
		$oozieSQLDatabaseName = "<SQLDatabaseDatabaseNameForOozieMetastore>"
		
		# Get the storage account keys
		Select-AzureSubscription $subscriptionName
		$storageAccountKey_Default = Get-AzureStorageKey $storageAccountName_Default | %{ $_.Primary }
		$storageAccountKey_Add1 = Get-AzureStorageKey $storageAccountName_Add1 | %{ $_.Primary }
		
		$oozieCreds = Get-Credential -Message "Oozie metastore"
		$hiveCreds = Get-Credential -Message "Hive metastore"
		
		# Create a Blob storage container
		#$dest1Context = New-AzureStorageContext -StorageAccountName $storageAccountName_Default -StorageAccountKey $storageAccountKey_Default  
		#New-AzureStorageContainer -Name $containerName_Default -Context $dest1Context
		
		# Create a new HDInsight cluster
		$config = New-AzureHDInsightClusterConfig -ClusterSizeInNodes $clusterNodes |
		    Set-AzureHDInsightDefaultStorage -StorageAccountName "$storageAccountName_Default.blob.core.windows.net" -StorageAccountKey $storageAccountKey_Default -StorageContainerName $containerName_Default |
		    Add-AzureHDInsightStorage -StorageAccountName "$storageAccountName_Add1.blob.core.windows.net" -StorageAccountKey $storageAccountKey_Add1 |
		    Add-AzureHDInsightMetastore -SqlAzureServerName "$hiveSQLDatabaseServerName.database.windows.net" -DatabaseName $hiveSQLDatabaseName -Credential $hiveCreds -MetastoreType HiveMetastore |
		    Add-AzureHDInsightMetastore -SqlAzureServerName "$oozieSQLDatabaseServerName.database.windows.net" -DatabaseName $oozieSQLDatabaseName -Credential $oozieCreds -MetastoreType OozieMetastore |
		        New-AzureHDInsightCluster -Name $clusterName -Location $location

**To list HDInsight clusters**

- Run the following commands from an Azure PowerShell window:

		Get-AzureHDInsightCluster -Name <ClusterName>












































































































##<a id="cli"></a> Using Cross-platform command line

Another option for provisioning an HDInsight cluster is the Cross-platform Command-line Interface. The command-line tool is implemented in Node.js. It can be used on any platform that supports Node.js including Windows, Mac and Linux. The command-line tool is open source.  The source code is managed in GitHub at <a href= "https://github.com/Azure/azure-sdk-tools-xplat">https://github.com/Azure/azure-sdk-tools-xplat</a>. For a general guide on how to use the command-line interface, see [How to use the Azure Command-Line Tools for Mac and Linux][azure-command-line-tools]. For comprehensive reference documentation, see [Azure command-line tool for Mac and Linux][azure-command-line-tool]. This article only covers using the command-line interface from Windows.


The following procedures are needed to provision an HDInsight cluster using Cross-platform command line:

- Install cross-platform command line
- Download and import Azure account publish settings
- Create an Azure Storage account
- Provision a cluster

The command-line interface can be installed using *Node.js Package Manager (NPM)* or Windows Installer.

**To install the command-line interface using NPM**

1.	Browse to **www.nodejs.org**.
2.	Click **INSTALL** and following the instructions using the default settings.
3.	Open **Command Prompt** (or *Azure Command Prompt*, or *Developer Command Prompt for VS2012*) from your workstation.
4.	Run the following command in the command prompt window.

		npm install -g azure-cli

	> [WACOM.NOTE] If you get an error saying the NPM command is not found, verify the following paths are in the PATH environment variable: <i>C:\Program Files (x86)\nodejs;C:\Users\[username]\AppData\Roaming\npm</i> or <i>C:\Program Files\nodejs;C:\Users\[username]\AppData\Roaming\npm</i>
	


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

Before using the command-line interface, you must configure connectivity between your workstation and Azure. Your Azure subscription information is used by the command-line interface to connect to your account. This information can be obtained from Azure in a publish settings file. The publish settings file can then be imported as a persistent local config setting that the command-line interface will use for subsequent operations. You only need to import your publish settings once.


> [WACOM.NOTE] The publish settings file contains sensitive information. It is recommended that you delete the file or take additional steps to encrypt the user folder that contains the file. On Windows, modify the folder properties or use BitLocker.


**To download and import publish settings**

1.	Open a **Command Prompt**.
2.	Run the following command to download the publish settings file.

		azure account download
 
	![HDI.CLIAccountDownloadImport][image-cli-account-download-import]

	The command shows the instructions for downloading the file, including an URL.

3.	Open **Internet Explorer** and browse to the URL listed in the command prompt window.
4.	Click **Save** to save the file to the workstation.
5.	From the command prompt window, run the following command to import the publish settings file:

		azure account import <file>

	In the previous screenshot, the publish settings file was saved to C:\HDInsight folder on the workstation.


HDInsight uses an Azure Blob Storage container as the default file system. An Azure storage account is required before you can create an HDInsight cluster. The storage account must be located in the same data center.

**To create an Azure storage account**

- From the command prompt window, run the following command:

		azure account storage create [options] <StorageAccountName>

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
		
Once you have the storage account and the blob container prepared, you are ready to create a cluster.

**To create a HDInsight cluster**

- From the command prompt window, run the following command:

		azure hdinsight cluster create --clusterName <ClusterName> --storageAccountName <StorageAccountName> --storageAccountKey <storageAccountKey> --storageContainer <StorageContainer> --nodes <NumberOfNodes> --location <DataCenterLocation> --username <HDInsightClusterUsername> --clusterPassword <HDInsightClusterPassword>

	![HDI.CLIClusterCreation][image-cli-clustercreation]


















Typically, you provision an HDInsight cluster, run their jobs, and then delete the cluster to cut down the cost. The command-line interface gives you the option to save the configurations into a file, so that you can reuse it every time you provision a cluster.  

**To provision an HDInsight cluster using a configuration file**

- From the command prompt window, run the following command:
 
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


**To list and show cluster details**

- Use the following commands to list and show cluster details:

		azure hdinsight cluster list
		azure hdinsight cluster show <ClusterName>
	
	![HDI.CLIListCluster][image-cli-clusterlisting]


**To delete a cluster**

- Use the following command to delete a cluster:

		azure hdinsight cluster delete <ClusterName>



##<a id="sdk"></a> Using HDInsight .NET SDK
The HDInsight .NET SDK provides .NET client libraries that makes it easier to work with HDInsight from .NET. 

The following procedures are needed to provision an HDInsight cluster using the SDK:

- Install HDInsight .NET SDK
- Create a console application
- Run the application


**To install HDInsight .NET SDK**
You can install latest published build of the SDK from [NuGet](http://nuget.codeplex.com/wikipage?title=Getting%20Started). The instructions will be shown in the next procedure.

**To create a Visual Studio console application**

1. Open Visual Studio 2012.

2. From the File menu, click **New**, and then click **Project**.

3. From New Project, type or select the following values:

	<table style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse;">
	<tr>
	<th style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; width:90px; padding-left:5px; padding-right:5px;">Property</th>
	<th style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; width:90px; padding-left:5px; padding-right:5px;">Value</th></tr>
	<tr>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Category</td>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px; padding-right:5px;">Templates/Visual C#/Windows</td></tr>
	<tr>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Template</td>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Console Application</td></tr>
	<tr>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Name</td>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">CreateHDICluster</td></tr>
	</table>

4. Click **OK** to create the project.


5. From the **Tools** menu, click **Library Package Manager**, click **Package Manager Console**.

6. Run the following commands in the console to install the packages.

		Install-Package Microsoft.WindowsAzure.Management.HDInsight


	This command adds .NET libraries and references to them to the current Visual Studio project.

7. From Solution Explorer, double-click **Program.cs** to open it.

8. Add the following using statements to the top of the file:

		using System.Security.Cryptography.X509Certificates;
		using Microsoft.WindowsAzure.Management.HDInsight;
		using Microsoft.WindowsAzure.Management.HDInsight.ClusterProvisioning;

	
9. In the Main() function, copy and paste the following code:
		
        string certfriendlyname = "<CertificateFriendlyName>";
        string subscriptionid = "<AzureSubscriptionID>";
        string clustername = "<HDInsightClusterName>";
        string location = "<MicrosoftDataCenter>";
        string storageaccountname = "<AzureStorageAccountName>";     // Full path must be used
        string storageaccountkey = "<AzureStorageAccountKey>";
        string containername = "<HDInsightDefaultContainerName>";
        string username = "<HDInsightUsername>";
        string password = "<HDInsightUserPassword>";
        int clustersize = <NumberOfNodesInTheCluster>;

        // Get the certificate object from certificate store using the friendly name to identify it
        X509Store store = new X509Store();
        store.Open(OpenFlags.ReadOnly);
        X509Certificate2 cert = store.Certificates.Cast<X509Certificate2>().First(item => item.FriendlyName == certfriendlyname);

        // Create the storage account if it doesn't exist.

        // Create the container if it doesn't exist.

		// Create an HDInsightClient object
        HDInsightCertificateCredential creds = new HDInsightCertificateCredential(new Guid(subscriptionid), cert);
        var client = HDInsightClient.Connect(creds);

		// Supply th cluster information
        ClusterCreateParameters clusterInfo = new ClusterCreateParameters()
        {
            Name = clustername,
            Location = location,
            DefaultStorageAccountName = storageaccountname,
            DefaultStorageAccountKey = storageaccountkey,
            DefaultStorageContainer = containername,
            UserName = username,
            Password = password,
            ClusterSizeInNodes = clustersize
        };

		// Create the cluster
        Console.WriteLine("Creating the HDInsight cluster ...");

        ClusterDetails cluster = client.CreateCluster(clusterInfo);

        Console.WriteLine("Created cluster: {0}.", cluster.ConnectionUrl);
        Console.WriteLine("Press ENTER to continue.");
        Console.ReadKey();

10. Replace the variables at the beginning of the main() function. 

**To run the application**

While the application is open in Visual Studio, press **F5** to run the application. A console window should open and display the status of the application. It can take several minutes to create a HDInsight cluster.



##<a id="nextsteps"></a> Next steps
In this article, you have learned several ways to provision an HDInsight cluster. To learn more, see the following articles:

* [Get started with Azure HDInsight][hdinsight-get-started]
* [Administer HDInsight using PowerShell][hdinsight-admin-powershell]
* [Submit Hadoop jobs programmatically][hdinsight-submit-jobs]
* [Azure HDInsight SDK documentation][hdinsight-sdk-documentation]

[hdinsight-sdk-documentation]: http://msdnstage.redmond.corp.microsoft.com/en-us/library/dn479185.aspx

[hdinsight-get-started]: ../hdinsight-get-started/
[hdinsight-storage]: ../hdinsight-use-blob-storage/
[hdinsight-admin-powershell]: ../hdinsight-administer-use-powershell/

[hdinsight-submit-jobs]: ../hdinsight-submit-hadoop-jobs-programmatically/
[hdinsight-powershell-reference]: http://msdn.microsoft.com/en-us/library/windowsazure/dn479228.aspx

[azure-create-storageaccount]: ../storage-create-storage-account/ 
[azure-management-portal]: https://manage.windowsazure.com/

[azure-command-line-tools]: ../xplat-cli/
[azure-command-line-tool]: ../command-line-tools/
[azure-manage-storageaccount]: ../storage-manage-storage-account/

[azure-purchase-options]: http://azure.microsoft.com/en-us/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/en-us/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/en-us/pricing/free-trial/

[Powershell-install-configure]: ../install-configure-powershell/


[image-customprovision-page1]: ./media/hdinsight-provision-clusters/HDI.CustomProvision.Page1.png 
[image-customprovision-page2]: ./media/hdinsight-provision-clusters/HDI.CustomProvision.Page2.png 
[image-customprovision-page3]: ./media/hdinsight-provision-clusters/HDI.CustomProvision.Page3.png 
[image-customprovision-page4]: ./media/hdinsight-provision-clusters/HDI.CustomProvision.Page4.png 

[image-cli-account-download-import]: ./media/hdinsight-provision-clusters/HDI.CLIAccountDownloadImport.png
[image-cli-clustercreation]: ./media/hdinsight-provision-clusters/HDI.CLIClusterCreation.png
[image-cli-clustercreation-config]: ./media/hdinsight-provision-clusters/HDI.CLIClusterCreationConfig.png
[image-cli-clusterlisting]: ./media/hdinsight-provision-clusters/HDI.CLIListClusters.png "List and show clusters"

[image-hdi-ps-provision]: ./media/hdinsight-provision-clusters/HDI.ps.provision.png
