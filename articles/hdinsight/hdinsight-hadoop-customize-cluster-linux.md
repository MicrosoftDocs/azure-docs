<properties 
	pageTitle="Customize HDInsight Clusters using script actions | Microsoft Azure" 
	description="Learn how to customize HDInsight clusters using Script Action." 
	services="hdinsight" 
	documentationCenter="" 
	authors="Blackmist" 
	manager="paulettm" 
	editor="cgronlun"
	tags="azure-portal"/> 

<tags 
	ms.service="hdinsight" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="08/18/2015" 
	ms.author="larryfr"/> 

# Customize HDInsight clusters using Script Action

HDInsight provides a configuration option called **Script Action** that invokes custom scripts, which define the customization to be performed on the cluster during the provision process. These scripts can be used to install additional software on a cluster, or to change the configuration of applications on a cluster. 

> [AZURE.NOTE] The information in this article is specific to Linux-based HDInsight clusters. For a version of this article that is specific to Windows-based clusters, see [Customize HDInsight clusters using Script Action (Windows)](hdinsight-hadoop-customize-cluster-linux.md)

## Script Action in the cluster provision process

Script Action is only used while a clusters is in the process of being created. The following diagram illustrates when Script Action is executed during the provision process:

![HDInsight cluster customization and stages during cluster provisioning][img-hdi-cluster-states] 

The script is ran while HDInsight is being configured. At this stage, the script is run in parallel on all the specified nodes in the cluster, and is ran with root privileges on the nodes. 

> [AZURE.NOTE] Because you have root privileges on the cluster nodes during the **ClusterCustomization** stage, you can use the script to perform operations like stopping and starting services, including Hadoop-related services. If you stop services, you must ensure that the Ambari service and other Hadoop-related services are up and running before the script finishes running. These services are required to successfully ascertain the health and state of the cluster while it is being created.

Each cluster can accept multiple script actions that are invoked in the order in which they are specified. A script can be ran on the head nodes, the worker nodes, or both.

> [AZURE.IMPORTANT] Script actions must complete within 15 minutes, or they will timeout.

## Example Script Action scripts

Script Action scripts can be used from the Azure Preview Portal, Azure PowerShell, or the HDInsight .NET SDK. This article shows how to use Script Action from the portal. To learn how to use PowerShell and .NET SDK to use Script Action, look at the samples listed in the table below.

HDInsight provides several scripts to install the following components on HDInsight clusters:

Name | Script
----- | -----
**Install Spark** | https://hdiconfigactions.blob.core.windows.net/sparkconfigactionv03/spark-installer-v03.ps1. See [Install and use Spark on HDInsight clusters](hdinsight-hadoop-spark-install-linux.md).
**Install R** | https://hdiconfigactions.blob.core.windows.net/rconfigactionv02/r-installer-v02.ps1. See [Install and use R on HDInsight clusters](hdinsight-hadoop-r-scripts-linux.md).
**Install Solr** | https://hdiconfigactions.blob.core.windows.net/solrconfigactionv01/solr-installer-v01.ps1. See [Install and use Solr on HDInsight clusters](hdinsight-hadoop-solr-install-linux.md).
**Install Giraph** | https://hdiconfigactions.blob.core.windows.net/giraphconfigactionv01/giraph-installer-v01.ps1. See [Install and use Giraph on HDInsight clusters](hdinsight-hadoop-giraph-install-linux.md).

##Use a Script Action from the Azure Preview portal

1. Start provisioning a cluster as described at [Provisioning a cluster using custom options](hdinsight-provision-clusters.md#portal). 

2. Under __Optional Configuration__, for the **Script Actions** blade, click **add script action** to provide details about the script action, as shown below:

	![Use Script Action to customize a cluster](./media/hdinsight-hadoop-customize-cluster-linux/HDI.CreateCluster.8.png "Use Script Action to customize a cluster")
	
	| Property | Value |
	| -------- | ----- |
	| Name | Specify a name for the script action. |
	| Script URI | Specify the URI to the script that is invoked to customize the cluster. |
	| Head/Worker | Specify the nodes (**Head** or **Worker**) on which the customization script is run. |
	| Parameters | Specify the parameters, if required by the script. |

	Press ENTER to add more than one script action to install multiple components on the cluster. 

3. Click **Select** to save the script action configuration and continue with cluster provisioning. 

##Use a Script Action from Azure PowerShell

In this section, we use the **<a href = "http://msdn.microsoft.com/library/dn858088.aspx" target="_blank">Add-AzureHDInsightScriptAction</a>** cmdlet to invoke scripts by using Script Action to customize a cluster. Before proceeding, make sure you have installed and configured Azure PowerShell. For information about configuring a workstation to run HDInsight Powershell cmdlets, see [Install and configure Azure PowerShell](../powershell-install-configure.md).

Perform the following steps:

1. Open the Azure PowerShell console and declare the following variables:

		# PROVIDE VALUES FOR THESE VARIABLES
		$subscriptionName = "<SubscriptionName>"		# Name of the Azure subscription
		$clusterName = "<HDInsightClusterName>"			# HDInsight cluster name
		$storageAccountName = "<StorageAccountName>"	# Azure storage account that hosts the default container
		$storageAccountKey = "<StorageAccountKey>"      # Key for the storage account
		$containerName = $clusterName
		$location = "<MicrosoftDataCenter>"				# Location of the HDInsight cluster. It must be in the same data center as the storage account.
		$clusterNodes = <ClusterSizeInNumbers>			# The number of nodes in the HDInsight cluster.
		$version = "<HDInsightClusterVersion>"          # HDInsight version, for example "3.1"
	
2. Specify the configuration values (such as nodes in the cluster) and the default storage to be used.

		# SPECIFY THE CONFIGURATION OPTIONS
		Select-AzureSubscription $subscriptionName
		$config = New-AzureHDInsightClusterConfig -ClusterSizeInNodes $clusterNodes
		$config.DefaultStorageAccount.StorageAccountName="$storageAccountName.blob.core.windows.net"
		$config.DefaultStorageAccount.StorageAccountKey=$storageAccountKey
		$config.DefaultStorageAccount.StorageContainerName=$containerName
	
3. Use **Add-AzureHDInsightScriptAction** cmdlet to invoke the script. The following example uses the the script to install R on the cluster: 

		# INVOKE THE SCRIPT USING THE SCRIPT ACTION
		$config = Add-AzureHDInsightScriptAction -Config $config -Name "Install R"  -ClusterRoleCollection HeadNode,DataNode -Uri https://hdiconfigactions.blob.core.windows.net/linuxrconfigactionv01/r-installer-v01.sh


	The **Add-AzureHDInsightScriptAction** cmdlet takes the following parameters:

	| Parameter | Definition |
	| --------- | ---------- |
	| Config | Configuration object to which script action information is added. |
	| Name | Name of the script action. |
	| ClusterRoleCollection | Specifies the nodes on which the customization script is run. The valid values are **HeadNode** (to install on the head node) or **DataNode** (to install on all the data nodes). You can use either or both values. |
	| Parameters | Parameters required by the script. |
	| Uri | Specifies the URI to the script that is executed. |
	
4. Finally, provision the cluster:
	
		New-AzureHDInsightCluster -Config $config -Name $clusterName -Location $location -Version $version 

When prompted, enter the credentials for the cluster. It can take several minutes before the cluster is created.

##Use a Script Action from the HDInsight .NET SDK

The HDInsight .NET SDK provides client libraries that makes it easier to work with HDInsight from a .NET application. The following steps demonstrate how to use a script to customize a cluster from the HDInsight .NET SDK.


> [AZURE.IMPORTANT] You must first create a self-signed certificate, install it on your workstation, and then upload it to your Azure subscription. For instructions, see [Create a self-signed certificate](http://go.microsoft.com/fwlink/?LinkId=511138). 


###Create a Visual Studio project

1. Open Visual Studio 2013 or 2015.

2. From the **File** menu, click **New**, and then click **Project**.

3. From **New Project**, type or select the following values:
	
	| Property | Value |
	| -------- | ----- |
	| Category | Templates/Visual C#/Windows |
	| Template | Console Application |
	| Name | ScriptActionCluster |

4. Click **OK** to create the project.

5. From the **Tools** menu, click **Nuget Package Manager**, and then click **Package Manager Console**.

6. Run the following command in the console to install the package.

		Install-Package Microsoft.WindowsAzure.Management.HDInsight

	This command adds the .NET libraries and references to them from the current Visual Studio project.

7. From **Solution Explorer**, double-click **Program.cs** to open it.

8. Add the following **using** statements to the top of the file:

		using System.Security.Cryptography.X509Certificates;
		using Microsoft.WindowsAzure.Management.HDInsight;
		using Microsoft.WindowsAzure.Management.HDInsight.ClusterProvisioning;
		using Microsoft.WindowsAzure.Management.HDInsight.Framework.Logging;
	
9. In the **Main()** function, paste the following code, and provide values for the variables :
		
        var clusterName = args[0];

        // PROVIDE VALUES FOR THE VARIABLES
        string thumbprint = "<CertificateThumbprint>";  
        string subscriptionId = "<AzureSubscriptionID>";
        string location = "<MicrosoftDataCenterLocation>";
        string storageaccountname = "<AzureStorageAccountName>.blob.core.windows.net";
        string storageaccountkey = "<AzureStorageAccountKey>";
        string username = "<HDInsightUsername>";
        string password = "<HDInsightUserPassword>";
        int clustersize = <NumberOfNodesInTheCluster>;

        // PROVIDE THE CERTIFICATE THUMBPRINT TO RETRIEVE THE CERTIFICATE FROM THE CERTIFICATE STORE 
        X509Store store = new X509Store();
        store.Open(OpenFlags.ReadOnly);
        X509Certificate2 cert = store.Certificates.Cast<X509Certificate2>().First(item => item.Thumbprint == thumbprint);

        // CREATE AN HDINSIGHT CLIENT OBJECT
        HDInsightCertificateCredential creds = new HDInsightCertificateCredential(new Guid(subscriptionId), cert);
        var client = HDInsightClient.Connect(creds);
		client.IgnoreSslErrors = true;

        // PROVIDE THE CLUSTER INFORMATION
		var clusterInfo = new ClusterCreateParameters()
        {
            Name = clusterName,
            Location = location,
            DefaultStorageAccountName = storageaccountname,
            DefaultStorageAccountKey = storageaccountkey,
            DefaultStorageContainer = clusterName,
            UserName = username,
            Password = password,
            ClusterSizeInNodes = clustersize,
            Version = "3.1"
        };        

10. Append the following code to the **Main()** function. This code invokes a Script Action; in this example, the script to install R on the cluster:

		// ADD THE SCRIPT ACTION TO INSTALL R

        clusterInfo.ConfigActions.Add(new ScriptAction(
            "Install R",
            new ClusterNodeType[] { ClusterNodeType.HeadNode, ClusterNodeType.DataNode },
            new Uri("https://hdiconfigactions.blob.core.windows.net/linuxrconfigactionv01/r-installer-v01.sh"), null
            ));

11. Finally, create the cluster:

		client.CreateCluster(clusterInfo);

11. Save changes to the application and build the solution. 

###Run the application

Open the Azure PowerShell console, navigate to the location where you saved the project, navigate to the \bin\debug directory within the project, and then run the following command:

	.\ScriptActionCluster <cluster-name>

Provide a cluster name and press ENTER to provision a cluster.

## Support for open-source software used on HDInsight clusters

The Microsoft Azure HDInsight service is a flexible platform that enables you to build big-data applications in the cloud by using an ecosystem of open-source technologies formed around Hadoop. Microsoft Azure provides a general level of support for open-source technologies, as discussed in the **Support Scope** section of the [Azure Support FAQ website](http://azure.microsoft.com/support/faq/). The HDInsight service provides an additional level of support for some of the components, as described below.

There are two types of open-source components that are available in the HDInsight service:

- **Built-in components** - These components are pre-installed on HDInsight clusters and provide core functionality of the cluster. For example, YARN ResourceManager, the Hive query language (HiveQL), and the Mahout library belong to this category. A full list of cluster components is available in [What's new in the Hadoop cluster versions provided by HDInsight?](hdinsight-component-versioning.md).

- **Custom components** - You, as a user of the cluster, can install or use in your workload any component available in the community or created by you.

Built-in components are fully supported, and Microsoft Support will help to isolate and resolve issues related to these components.

Custom components receive commercially reasonable support to help you to further troubleshoot the issue. This might result in resolving the issue or asking you to engage available channels for the open-source technologies where deep expertise for that technology is found. For example, there are many community sites that can be used, like: 

* [MSDN forum for HDInsight](https://social.msdn.microsoft.com/Forums/azure/home?forum=hdinsight)

* [Stack Overflow](https://stackoverflow.com)

Also, Apache projects have project sites on [Apache.org](https://apache.org); for example, [Hadoop](http://hadoop.apache.org/) and [Spark](http://spark.apache.org/).

The HDInsight service provides several ways to use custom components. Regardless of how a component is used or installed on the cluster, the same level of support applies. Below is a list of the most common ways that custom components can be used on HDInsight clusters:

1. Job submission - Hadoop or other types of jobs that execute or use custom components can be submitted to the cluster.

2. Cluster customization - During cluster creation, you can specify additional settings and custom components that will be installed on the cluster nodes.

3. Samples - For popular custom components, Microsoft and others may provide samples of how these components can be used on the HDInsight clusters. These samples are provided without support.

## Next steps

See the following for information and examples on creating and using scripts to customize a cluster:

- [Develop Script Action scripts for HDInsight](hdinsight-hadoop-script-actions-linux.md)
- [Install and use Spark on HDInsight clusters](hdinsight-hadoop-spark-install-linux.md)
- [Install and use R on HDInsight clusters](hdinsight-hadoop-r-scripts-linux.md)
- [Install and use Solr on HDInsight clusters](hdinsight-hadoop-solr-install-linux.md)
- [Install and use Giraph on HDInsight clusters](hdinsight-hadoop-giraph-install-linux.md)



[img-hdi-cluster-states]: ./media/hdinsight-hadoop-customize-cluster-linux/HDI-Cluster-state.png "Stages during cluster provisioning"
 