<properties urlDisplayName="HDInsight Administration" pageTitle="Provision Hadoop clusters in HDInsight | Azure" metaKeywords="hdinsight, hdinsight administration, hdinsight administration azure" description="Learn how to provision clusters for Azure HDInsight using the management portal, PowerShell, or the command line." umbracoNaviHide="0" disqusComments="1" editor="cgronlun" manager="paulettm" services="hdinsight" documentationCenter="" title="Provision Hadoop clusters in HDInsight" authors="jgao" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="09/25/2014" ms.author="jgao" />

#Provision Hadoop clusters in HDInsight using custom options

In this article you learn about the different ways to custom-provision an Hadoop cluster on Azure HDInsight - using the Azure Management Portal, PowerShell, command line tools, or HDInsight .NET SDK. This article talks about provisioning Hadoop clusters. For instructions on how to provision an HBase cluster, see [Provision HBase cluster in HDInsight][hdinsight-hbase-custom-provision]. See <a href="http://go.microsoft.com/fwlink/?LinkId=510237">What's the difference between Hadoop and HBase?</a> to understand why you might choose one over the other.

## What is an HDInsight cluster?

Have you ever wondered why we mention clusters, every time we talk about Hadoop or BigData? That's because Hadoop enables distributed processing of large data, spread across different nodes of a cluster. The cluster has a master/slave architecture with a master (also called head node or name node) and any number of slaves (also called data node). For more information, see [Apache Hadoop][apache-hadoop].

![HDInsight Cluster][img-hdi-cluster]

An HDInsight cluster abstracts the Hadoop implementation details so that you don't need to worry about how to communicate with different nodes of a cluster. When you provision an HDInsight cluster, you provision Azure compute resources that contain Hadoop and related applications. For more information, see [Introduction to Hadoop in HDInsight][hadoop-hdinsight-intro]. The data to be churned is stored in Azure Blob storage, also called *Azure Storage - Blob* (or WASB) in the context of HDInsight. For more information, see [Use Azure Blob Storage with HDInsight][hdinsight-storage].

This article provides instructions on the different ways to provision a cluster. If you are looking at a quick-start approach to provision a cluster, see [Get Started with Azure HDInsight][hdinsight-get-started]. 

**Prerequisites:**

Before you begin this article, you must have the following:

- An Azure subscription. Azure is a subscription-based platform. The HDInsight PowerShell cmdlets perform the tasks with your subscription. For more information about obtaining a subscription, see [Purchase Options][azure-purchase-options], [Member Offers][azure-member-offers], or [Free Trial][azure-free-trial].

##In this article

* [Configuration options](#configuration)
* [Using Azure Management Portal](#portal)
* [Using Azure PowerShell](#powershell)
* [Using Cross-platform Command Line](#cli)
* [Using HDInsight .NET SDK](#sdk)
* [Next steps](#nextsteps)

##<a id="configuration"></a>Configuration options

###Additional storage

During configuration, you must specify an Azure Blob Storage account, and a default container. This is used as the default storage location by the cluster. Optionally, you can specify additional blobs that will also be associated with your cluster.

For more information on using secondary blob stores, see [Using Azure Blob Storage with HDInsight](http://azure.microsoft.com/en-us/documentation/articles/hdinsight-use-blob-storage/).

###Metastore

The Metastore contains information about Hive tables, partitions, schemas, columns, etc. This information is used by Hive to locate where data is stored on HDFS (or WASB for HDInsight.) By default, Hive uses an embedded database to store this information.

When provisioning an HDInsight cluster, you can specify a SQL Database that will contain the Metastore for Hive. This allows the metadata information to be preserved when you delete a cluster, as it is stored externally in SQL Database.

###Virtual Networking

[Azure Virtual Network](http://azure.microsoft.com/en-us/documentation/services/virtual-network/) allows you to create a secure, persistent, network containing the resources you need for your solution. A virtual network allows you to:

* Connect cloud resources together in a private network (cloud-only)

	![diagram of cloud-only configuration](.\media\hdinsight-provision-clusters\cloud-only.png)

* Connect your cloud resources to your local datacenter network (site-to-site or point to site) using a Virtual Private Network (VPN)

	Site-to-site configuration allows you to connect multiple resources from your data center to the Azure Virtual Network using a hardware VPN or the Routing and Remote Access Service

	![diagram of site-to-site configuration](.\media\hdinsight-provision-clusters\site-to-site.png)

	Point-to-site configuration allows you to connect a specific resource to the Azure Virtual Network using software VPN

	![diagram of point-to-site configuration](.\media\hdinsight-provision-clusters\point-to-site.png)

For more information on Virtual Network features, benefits, and capabilities, see the [Azure Virtual Network overview](http://msdn.microsoft.com/library/azure/jj156007.aspx).

> [WACOM.NOTE] You must create the Azure Virtual Network before provisioning an HDInsight cluster. For more information, see [Virtual Network configuration tasks](http://msdn.microsoft.com/en-us/library/azure/jj156206.aspx).
> 
> Azure HDInsight only supports location-based Virtual Networks, and does not currently work with Affinity Group-based Virtual Networks.


> [WACOM.NOTE] It is highly recommended to designate a single subnet for one cluster. 

##<a id="portal"></a> Using Azure Management Portal

HDInsight clusters use an Azure Blob Storage container as the default file system. An Azure storage account located on the same data center is required before you can create a HDInsight cluster. For more information, see [Use Azure Blob Storage with HDInsight][hdinsight-storage]. For details on creating an Azure storage account, see [How to Create a Storage Account][azure-create-storageaccount].


> [WACOM.NOTE] Currently, only the **East Asia**, **Southeast Asia**, **North Europe**, **West Europe**, **East US**, **West US**, **North Central US**, and **South Central US** regions can host HDInsight clusters.

**To create a HDInsight cluster using the custom create option**

1. Sign in to the [Azure Management Portal][azure-management-portal].
2. Click **+ NEW** on the bottom of the page, click **DATA SERVICES**, click **HDINSIGHT**, and then click **CUSTOM CREATE**.
3. On the **Cluster Details** page, type or choose the following values:

	![HDI.CustomCreateCluster][image-hdi-customcreatecluster]

    <table border='1'>
		<tr><th>Property</th><th>Value</th></tr>
		<tr><td>Cluster name</td>
			<td><p>Name the cluster. </p>
				<ul>
				<li>DNS name must start and end with alpha numeric, may contain dashes.</li>
				<li>The field must be a string between 3 to 63 characters.</li>
				</ul></td></tr>
		<tr><td>Cluster Type</td>
			<td>For cluster type, select <strong>Hadoop</strong>.</td></tr>
		<tr><td>HDInsight version</td>
			<td>Choose the version. For Hadoop, the default is HDInsight version 3.1, which uses Hadoop 2.4.</td></tr>
		</table>

	Enter or select the values as shown in the table and then click the right arrow.

4. On the **Configure Cluster** page, enter or select the following values:

	<table border="1">
	<tr><th>Name</th><th>Value</th></tr>
	<tr><td>Data nodes</td><td>Number of data nodes you want to deploy. For testing purposes, create a single node cluster. <br />The cluster size limit varies for Azure subscriptions. Contact Azure billing support to increase the limit.</td></tr>
	<tr><td>Region/Virtual network</td><td><p>Choose the same region as the storage account you created in the last procedure. HDInsight requires the storage account located in the same region. Later in the configuration, you can only choose a storage account that is in the same region as you specified here.</p><p>The available regions are: <strong>East Asia</strong>, <strong>Southeast Asia</strong>, <strong>North Europe</strong>, <strong>West Europe</strong>, <strong>East US</strong>, <strong>West US</strong>, <strong>North Central US</strong>, <strong>South Central US</strong><br/>If you have created an Azure Virtual Network, you can select the network that the HDInsight cluster will be configured to use.</p><p>For more information on creating an Azure Virtual Network, see [Virtual Network configuration tasks](http://msdn.microsoft.com/en-us/library/azure/jj156206.aspx).</p></td></tr>
	</table>


5. On the **Configure Cluster User** page, provide the following values:

    ![HDI.CustomCreateCluster.ClusterUser][image-hdi-customcreatecluster-clusteruser]
	
    <table border='1'>
		<tr><th>Property</th><th>Value</th></tr>
		<tr><td>User name</td>
			<td>Specify the HDInsight cluster user name.</td></tr>
		<tr><td>Password/Confirm Password</td>
			<td>Specify the HDInsight cluster user password.</td></tr>
		<tr><td>Enter Hive/Oozie Metastore</td>
			<td>Select this checkbox to specify a SQL database on the same data center as the cluster, to be used as the Hive/Oozie metastore. This is useful if you want to retain the metadata about Hive/Oozie jobs even after a cluster has been deleted.</td></tr>
		<tr><td>Metastore Database</td>
			<td>Specify the Azure SQL database that will be used as the metastore for Hive/OOzie. This SQL database must be in the same data center as the HDInsight cluster. The list box only lists the SQL databases in the same data center as you specified on the <strong>Cluster Details</strong> page.</td></tr>
		<tr><td>Database user</td>
			<td>Specify the SQL database user that will be used to connect to the database.</td></tr>
		<tr><td>Database user password</td>
			<td>Specify the SQL database user password.</td></tr>
	</table>

	>[WACOM.NOTE] The Azure SQL database used for the metastore must allow connectivity to other Azure services, including Azure HDInsight. On the Azure SQL database dashboard, on the right side click the server name. This is the server on which the SQL database instance is running. Once you are on the server view, click **Configure**, and then for **Windows Azure Services**, click **Yes**, and then click **Save**.   

    Click the right arrow.


6. On the **Storage Account** page, provide the following value:

    ![HDI.CustomCreateCluster.StorageAccount][image-hdi-customcreatecluster-storageaccount]

	<table border='1'>
		<tr><th>Property</th><th>Value</th></tr>
		<tr><td>Storage Account</td>
			<td>Specify the Azure storage account that will be used as the default file system for the HDInsight cluster. You can choose one of the three options:
			<ul>
				<li>Use Existing Storage</li>
				<li>Create New Storage</li>
				<li>Use Storage From Another Subscription</li>
			</ul>
			</td></tr>
		<tr><td>Account Name</td>
			<td><ul>
				<li>If you chose to use existing storage, for <strong>Account name</strong>, select an exising storage account. The drop-down only lists the storage accounts located in the same data center where you chose to provision the cluster.</li>
				<li>If you chose <strong>Create new storage</strong> or <strong>Use storage from another subscription</strong> option, you must provide the storage account name.</li>
			</ul></td></tr>
		<tr><td>Account Key</td>
			<td>If you chose the <strong>Use Storage From Another Subscription</strong> option, specify the account key for that storage account.</td></tr>	
		<tr><td>Default container</td>
			<td><p>Specifies the default container on the storage account that is used as the default file system for the HDInsight cluster. If you chose <strong>Use Existing Storage</strong> for the <strong>Storage Account</strong> field, and there are no existing containers in that account, the container is created by default with a the same name as the cluster name. If a container with the name of the cluster already exists, a sequence number will be appended to the container name. For example, mycontainer1, mycontainer2, and so on. However, if the existing storage account has a container with a name different from the cluster name you specified, you can use that container as well.</p>
            <p>If you chose to create a new storage or use storage from another Azure subscription, you must specify the default container name</p>
        </td></tr>
		<tr><td>Additional Storage Accounts</td>
			<td>HDInsight supports multiple storage accounts. There is no limit on the additional storage account that can be used by a cluster. However, if you create a cluster using the Management Portal, you have a limit of seven due to the UI constraints. Each additional storage account you specify adds an extra Storage Account page to the wizard where you can specify the account information. For example, in the screenshot above, one additional storage account is selected, and hence page 5 is added to the dialog.</td></tr>		
	</table>

	Click the right arrow.

7. On the **Storage Account** page, enter the account information for the additional storage account:

	![HDI.CustomCreateCluster.AddOnStorage][image-hdi-customcreatecluster-addonstorage]

    Here again, you have the option to choose from existing storage, create new storage, or use storage from another Azure subscription. The procedure to provide the values is similar to the previous step.

    Click the check mark to start provisioning the cluster. When the provisioning completes, the  status column shows **Running**.

	> [WACOM.NOTE] Once an Azure storage account is chosen for your HDInsight cluster, you can neither delete the account, nor change the account to a different account.

##<a id="powershell"></a> Using Azure PowerShell
Azure PowerShell is a powerful scripting environment that you can use to control and automate the deployment and management of your workloads in Azure. This section provides instructions on how to provision an HDInsight cluster using For information on configuring a workstation to run HDInsight Powershell cmdlets, see [Install and configure Azure PowerShell][powershell-install-configure]. For more information on using PowerShell with HDInsight, see [Administer HDInsight using PowerShell][hdinsight-admin-powershell]. For the list of the HDInsight PowerShell cmdlets, see [HDInsight cmdlet reference][hdinsight-powershell-reference].

> [WACOM.NOTE] While the scripts in this section can be used to configure an HDInsight cluster on an Azure Virtual Network, they will not create an Azure Virtual Network. For information on creating an Azure Virtual Network, see [Virtual Network configuration tasks](http://msdn.microsoft.com/en-us/library/azure/jj156206.aspx).

The following procedures are needed to provision an HDInsight cluster using PowerShell:

- Create an Azure Storage account
- Create an Azure Blob container
- Create a HDInsight cluster

HDInsight uses an Azure Blob Storage container as the default file system. An Azure storage account and storage container are required before you can create an HDInsight cluster. The storage account must be located in the same data center as the HDInsight Cluster.


**To create an Azure storage account**

- Run the following commands from an Azure PowerShell console window:

		$storageAccountName = "<StorageAcccountName>"	# Provide a storage account name 
		$location = "<MicrosoftDataCenter>"				# For example, "West US"
		
		# Create an Azure storage account
		New-AzureStorageAccount -StorageAccountName $storageAccountName -Location $location
	
	If you have already had a storage account but do not know the account name and account key, you can use the following PowerShell commands to retrieve the information:
	
		# List storage accounts for the current subscription
		Get-AzureStorageAccount

		# List the keys for a storage account
		Get-AzureStorageKey "<StorageAccountName>"
	
**To create Azure Blob storage container**

- Run the following commands from an Azure PowerShell console window:

		$storageAccountName = "<StorageAccountName>"	# Provide the storage account name 
		$storageAccountKey = "<StorageAccountKey>"		# Provide either primary or secondary key
		$containerName="<ContainerName>"				# Provide a container name

		# Create a storage context object
		$destContext = New-AzureStorageContext -StorageAccountName $storageAccountName 
		                                       -StorageAccountKey $storageAccountKey  
		 
		# Create a Blob storage container
		New-AzureStorageContainer -Name $containerName -Context $destContext

Once you have the storage account and the blob container prepared, you are ready to create a cluster. 

**To provision an HDInsight cluster**

> [WACOM.NOTE] The PowerShell cmdlets are the only recommended way to change configuration variables in an HDInsight cluster.  Changes made to Hadoop configuration files while connected to the cluster via Remote Desktop may be overwritten in the event of cluster patching.  Configuration values set via PowerShell will be preserved if the cluster is patched. 

- Run the following commands from an Azure PowerShell console window:		

		$subscriptionName = "<SubscriptionName>"		# Name of the Azure subscription.
		$storageAccountName = "<StorageAccountName>"	# Azure storage account that hosts the default container. 
		$containerName = "<ContainerName>"				# Azure Blob container that is used as the default file system for the HDInsight cluster.

		$clusterName = "<HDInsightClusterName>"			# The name you will name your HDInsight cluster.
		$location = "<MicrosoftDataCenter>"				# The location of the HDInsight cluster. It must in the same data center as the storage account.
		$clusterNodes = <ClusterSizeInNodes>			# The number of nodes in the HDInsight cluster.

		# Get the storage primary key based on the account name
		Select-AzureSubscription $subscriptionName
		$storageAccountKey = Get-AzureStorageKey $storageAccountName | %{ $_.Primary }

		# Create a new HDInsight cluster
		New-AzureHDInsightCluster -Name $clusterName -Location $location -DefaultStorageAccountName "$storageAccountName.blob.core.windows.net" -DefaultStorageAccountKey $storageAccountKey -DefaultStorageContainerName $containerName  -ClusterSizeInNodes $clusterNodes

	When prompted, enter the credentials for the cluster. It can take several minutes before the cluster provision completes.

	![HDI.CLI.Provision][image-hdi-ps-provision]

 

**To provision an HDInsight cluster using custom configuration options**

While provisioning a cluster, you can use the other configuration options such as connecting to more than one Azure Blob storage, using a Virtual Network, or using an Azure SQL database for Hive and Oozie metastores. This allows you to separate lifetime of your data and metadata from the lifetime of the cluster.

> [WACOM.NOTE] The PowerShell cmdlets are the only recommended way to change configuration variables in an HDInsight cluster.  Changes made to Hadoop configuration files while connected to the cluster via Remote Desktop may be overwritten in the event of cluster patching.  Configuration values set via PowerShell will be preserved if the cluster is patched. 

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
		
		# Get the virtual network ID and subnet name
		$vnetID = "<AzureVirtualNetworkID>"
		$subNetName = "<AzureVirtualNetworkSubNetName>" 

		# Get the storage account keys
		Select-AzureSubscription $subscriptionName
		$storageAccountKey_Default = Get-AzureStorageKey $storageAccountName_Default | %{ $_.Primary }
		$storageAccountKey_Add1 = Get-AzureStorageKey $storageAccountName_Add1 | %{ $_.Primary }
		
		$oozieCreds = Get-Credential -Message "Oozie metastore"
		$hiveCreds = Get-Credential -Message "Hive metastore"
		
		# Create a Blob storage container
		$dest1Context = New-AzureStorageContext -StorageAccountName $storageAccountName_Default -StorageAccountKey $storageAccountKey_Default  
		New-AzureStorageContainer -Name $containerName_Default -Context $dest1Context

		# Create a new HDInsight cluster
		$config = New-AzureHDInsightClusterConfig -ClusterSizeInNodes $clusterNodes |
		    Set-AzureHDInsightDefaultStorage -StorageAccountName "$storageAccountName_Default.blob.core.windows.net" -StorageAccountKey $storageAccountKey_Default -StorageContainerName $containerName_Default |
		    Add-AzureHDInsightStorage -StorageAccountName "$storageAccountName_Add1.blob.core.windows.net" -StorageAccountKey $storageAccountKey_Add1 |
		    Add-AzureHDInsightMetastore -SqlAzureServerName "$hiveSQLDatabaseServerName.database.windows.net" -DatabaseName $hiveSQLDatabaseName -Credential $hiveCreds -MetastoreType HiveMetastore |
		    Add-AzureHDInsightMetastore -SqlAzureServerName "$oozieSQLDatabaseServerName.database.windows.net" -DatabaseName $oozieSQLDatabaseName -Credential $oozieCreds -MetastoreType OozieMetastore |
		        New-AzureHDInsightCluster -Name $clusterName -Location $location -VirtualNetworkId $vnetID -SubnetName $subNetName

	>[WACOM.NOTE] The Azure SQL Database used for the metastore must allow connectivity to other Azure services, including Azure HDInsight. On the Azure SQL database dashboard, on the right side click the server name. This is the server on which the SQL database instance is running. Once you are on the server view, click **Configure**, and then for **Windows Azure Services**, click **Yes**, and then click **Save**.

**To list HDInsight clusters**

- Run the following commands from an Azure PowerShell console window to list the HDInsight cluster and verify that the cluster was successfully provisioned:

		Get-AzureHDInsightCluster -Name <ClusterName>


##<a id="cli"></a> Using Cross-platform command line

> [WACOM.NOTE] As of 8/29/2014, the Cross-Platform Command-line Interface cannot be used to associate a cluster with an Azure Virtual Network.

Another option for provisioning an HDInsight cluster is the Cross-platform Command-line Interface. The command-line tool is implemented in Node.js. It can be used on any platform that supports Node.js including Windows, Mac and Linux. The command-line tool is open source.  The source code is managed in GitHub at <a href= "https://github.com/Azure/azure-sdk-tools-xplat">https://github.com/Azure/azure-sdk-tools-xplat</a>. For a general guide on how to use the command-line interface, see [How to use the Azure Command-Line Tools for Mac and Linux][azure-command-line-tools]. For comprehensive reference documentation, see [Azure command-line tool for Mac and Linux][azure-command-line-tool]. This article only covers using the command-line interface from Windows.

The following procedures are needed to provision an HDInsight cluster using Cross-platform command line:

- Install cross-platform command line
- Download and import Azure account publish settings
- Create an Azure Storage account
- Provision a cluster

The command-line interface can be installed using *Node.js Package Manager (NPM)* or Windows Installer. Microsoft recommends that you install using only one of the two options.

**To install the command-line interface using NPM**

1.	Browse to **www.nodejs.org**.
2.	Click **INSTALL** and following the instructions using the default settings.
3.	Open **Command Prompt** (or *Azure Command Prompt*, or *Developer Command Prompt for VS2012*) from your workstation.
4.	Run the following command in the command prompt window.

		npm install -g azure-cli

	> [WACOM.NOTE] If you get an error saying the NPM command is not found, verify the following paths are in the PATH environment variable: <i>C:\Program Files (x86)\nodejs;C:\Users\[username]\AppData\Roaming\npm</i> or <i>C:\Program Files\nodejs;C:\Users\[username]\AppData\Roaming\npm</i>
	
5.	Run the following command to verify the installation:

		azure hdinsight -h

	You can use the *-h* switch at different levels to display the help information. For example:
		
		azure -h
		azure hdinsight -h
		azure hdinsight cluster -h
		azure hdinsight cluster create -h

**To install the command-line interface using windows installer**

1.	Browse to **http://azure.microsoft.com/en-us/downloads/**.
2.	Scroll down to the **Command line tools** section, and then click **Cross-platform Command Line Interface** and follow the Web Platform Installer wizard.

**To download and import publish settings**

Before using the command-line interface, you must configure connectivity between your workstation and Azure. Your Azure subscription information is used by the command-line interface to connect to your account. This information can be obtained from Azure in a publish settings file. The publish settings file can then be imported as a persistent local config setting that the command-line interface will use for subsequent operations. You only need to import your publish settings once.

> [WACOM.NOTE] The publish settings file contains sensitive information. Microsoft recommends that you delete the file or take additional steps to encrypt the user folder that contains the file. On Windows, modify the folder properties or use BitLocker.


1.	Open a **Command Prompt**.
2.	Run the following command to download the publish settings file.

		azure account download
 
	![HDI.CLIAccountDownloadImport][image-cli-account-download-import]

	The command launches the Web page to download the publish settings file from. 

3.	At the prompt to save the file, click **Save** and provide a location where the file must be saved.
5.	From the command prompt window, run the following command to import the publish settings file:

		azure account import <file>

	In the previous screenshot, the publish settings file was saved to C:\HDInsight folder on the workstation.

**To create an Azure storage account**

HDInsight uses an Azure Blob Storage container as the default file system. An Azure storage account is required before you can create an HDInsight cluster. The storage account must be located in the same data center.

- From the command prompt window, run the following command to create an Azure storage account:

		azure storage account create [options] <StorageAccountName>

	When prompted for a location, select a location where an HDINsight cluster can be provisioned. The storage must be in the same location as the HDInsight cluster. Currently, only the **East Asia**, **Southeast Asia**, **North Europe**, **West Europe**, **East US**, **West US**, **North Central US**, and **South Central US** regions can host HDInsight clusters.  

For information on creating an Azure storage account using Azure Management portal, see [How to Create a Storage Account][azure-create-storageaccount].

If you already have a storage account but do not know the account name and account key, you can use the following commands to retrieve the information:

	-- lists storage accounts
	azure storage account list

	-- Shows information for a storage account
	azure storage account show <StorageAccountName>

	-- Lists the keys for a storage account
	azure storage account keys list <StorageAccountName>

For details on getting the information using the management portal, see the *How to: View, copy and regenerate storage access keys* section of [How to Manage Storage Accounts][azure-manage-storageaccount].

An HDInsight cluster also requires a container within a storage account. If the storage account you provide does not already have a containder, the *azure hdinsight cluster create* prompts you for a container name and creates it as well. However, if you want to create the container beforehand, you can use the following command:

	azure storage container create --account-name <StorageAccountName> --account-key <StorageAccountKey> [ContainerName]
		
Once you have the storage account and the blob container prepared, you are ready to create a cluster.

**To provision an HDInsight cluster**

- From the command prompt window, run the following command:

		azure hdinsight cluster create --clusterName <ClusterName> --storageAccountName "<StorageAccountName>.blob.core.windows.net" --storageAccountKey <storageAccountKey> --storageContainer <SorageContainerName> --nodes <NumberOfNodes> --location <DataCenterLocation> --username <HDInsightClusterUsername> --clusterPassword <HDInsightClusterPassword>

	![HDI.CLIClusterCreation][image-cli-clustercreation]


**To provision an HDInsight cluster using a configuration file**

Typically, you provision an HDInsight cluster, run the jobs, and then delete the cluster to cut down the cost. The command-line interface gives you the option to save the configurations into a file, so that you can reuse it every time you provision a cluster.

- From the command prompt window, run the following commands:
 
		
		#Create the config file
		azure hdinsight cluster config create <file> 
		 
		#Add commands to create a basic cluster
		azure hdinsight cluster config set <file> --clusterName <ClusterName> --nodes <NumberOfNodes> --location "<DataCenterLocation>" --storageAccountName "<StorageAccountName>.blob.core.windows.net" --storageAccountKey "<StorageAccountKey>" --storageContainer "<BlobContainerName>" --username "<Username>" --clusterPassword "<UserPassword>"
		 
		#If requred, include commands to use additional blob storage with the cluster
		azure hdinsight cluster config storage add <file> --storageAccountName "<StorageAccountName>.blob.core.windows.net"
		       --storageAccountKey "<StorageAccountKey>"
		 
		#If required, include commands to use a SQL database as a Hive metastore
		azure hdinsight cluster config metastore set <file> --type "hive" --server "<SQLDatabaseName>.database.windows.net"
		       --database "<HiveDatabaseName>" --user "<Username>" --metastorePassword "<UserPassword>"
		
		#If required, include commands to use a SQL database as an Oozie metastore 
		azure hdinsight cluster config metastore set <file> --type "oozie" --server "<SQLDatabaseName>.database.windows.net"
		       --database "<OozieDatabaseName>" --user "<SQLUsername>" --metastorePassword "<SQLPassword>"
		 
		#Run this command to create a cluster using the config file		
		azure hdinsight cluster create --config <file>
		 
	>[WACOM.NOTE] The Azure SQL database used for the metastore must allow connectivity to other Azure services, including Azure HDInsight. On the Azure SQL database dashboard, on the right side click the server name. This is the server on which the SQL database instance is running. Once you are on the server view, click **Configure**, and then for **Windows Azure Services**, click **Yes**, and then click **Save**.


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
The HDInsight .NET SDK provides .NET client libraries that makes it easier to work with HDInsight from a .NET application. 

The following procedures must be performed to provision an HDInsight cluster using the SDK:

- Install HDInsight .NET SDK
- Create a self-signed certificate
- Create a console application
- Run the application


**To install HDInsight .NET SDK**

You can install latest published build of the SDK from [NuGet](http://nuget.codeplex.com/wikipage?title=Getting%20Started). The instructions will be shown in the next procedure.

**To create a self-signed certificate**

Create a self-signed certificate, install it on your workstation, and upload it to your Azure subscription. For instructions, see [Create a self-signed certificate](http://go.microsoft.com/fwlink/?LinkId=511138). 


**To create a Visual Studio console application**

1. Open Visual Studio 2013.

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

5. From the **Tools** menu, click **Nuget Package Manager**, and then click **Package Manager Console**.

6. Run the following commands in the console to install the packages.

		Install-Package Microsoft.WindowsAzure.Management.HDInsight

	This command adds .NET libraries and references to them to the current Visual Studio project.

7. From Solution Explorer, double-click **Program.cs** to open it.

8. Add the following using statements to the top of the file:

		using System.Security.Cryptography.X509Certificates;
		using Microsoft.WindowsAzure.Management.HDInsight;
		using Microsoft.WindowsAzure.Management.HDInsight.ClusterProvisioning;

	
9. In the Main() function, copy and paste the following code:
		
        string certfriendlyname = "<CertificateFriendlyName>";     // Friendly name for the certificate your created earlier  
        string subscriptionid = "<AzureSubscriptionID>";
        string clustername = "<HDInsightClusterName>";
        string location = "<MicrosoftDataCenter>";
        string storageaccountname = "<AzureStorageAccountName>.blob.core.windows.net";
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

[hdinsight-sdk-documentation]: http://msdn.microsoft.com/en-us/library/dn479185.aspx
[hdinsight-hbase-custom-provision]: http://azure.microsoft.com/en-us/documentation/articles/hdinsight-hbase-get-started/

[hdinsight-get-started]: ../hdinsight-get-started/
[hdinsight-storage]: ../hdinsight-use-blob-storage/
[hdinsight-admin-powershell]: ../hdinsight-administer-use-powershell/
[hadoop-hdinsight-intro]: ../hdinsight-hadoop-introduction/
[hdinsight-submit-jobs]: ../hdinsight-submit-hadoop-jobs-programmatically/
[hdinsight-powershell-reference]: http://msdn.microsoft.com/en-us/library/windowsazure/dn479228.aspx

[azure-create-storageaccount]: ../storage-create-storage-account/ 
[azure-management-portal]: https://manage.windowsazure.com/

[azure-command-line-tools]: ../xplat-cli/
[azure-command-line-tool]: ../command-line-tools/
[azure-manage-storageaccount]: ../storage-manage-storage-account/

[apache-hadoop]: http://go.microsoft.com/fwlink/?LinkId=510084
[azure-purchase-options]: http://azure.microsoft.com/en-us/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/en-us/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/en-us/pricing/free-trial/
[hdi-remote]: http://azure.microsoft.com/en-us/documentation/articles/hdinsight-administer-use-management-portal/#rdp


[Powershell-install-configure]: ../install-configure-powershell/

[image-hdi-customcreatecluster]: ./media/hdinsight-get-started/HDI.CustomCreateCluster.png
[image-hdi-customcreatecluster-clusteruser]: ./media/hdinsight-get-started/HDI.CustomCreateCluster.ClusterUser.png
[image-hdi-customcreatecluster-storageaccount]: ./media/hdinsight-get-started/HDI.CustomCreateCluster.StorageAccount.png
[image-hdi-customcreatecluster-addonstorage]: ./media/hdinsight-get-started/HDI.CustomCreateCluster.AddOnStorage.png

[image-customprovision-page1]: ./media/hdinsight-provision-clusters/HDI.CustomProvision.Page1.png 
[image-customprovision-page2]: ./media/hdinsight-provision-clusters/HDI.CustomProvision.Page2.png 
[image-customprovision-page3]: ./media/hdinsight-provision-clusters/HDI.CustomProvision.Page3.png 
[image-customprovision-page4]: ./media/hdinsight-provision-clusters/HDI.CustomProvision.Page4.png 

[image-cli-account-download-import]: ./media/hdinsight-provision-clusters/HDI.CLIAccountDownloadImport.png
[image-cli-clustercreation]: ./media/hdinsight-provision-clusters/HDI.CLIClusterCreation.png
[image-cli-clustercreation-config]: ./media/hdinsight-provision-clusters/HDI.CLIClusterCreationConfig.png
[image-cli-clusterlisting]: ./media/hdinsight-provision-clusters/HDI.CLIListClusters.png "List and show clusters"

[image-hdi-ps-provision]: ./media/hdinsight-provision-clusters/HDI.ps.provision.png

[img-hdi-cluster]: ./media/hdinsight-provision-clusters/HDI.Cluster.png

