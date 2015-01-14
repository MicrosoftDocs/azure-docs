<properties linkid="install Solr on HDInsight cluster" urlDisplayName="Use Script Action in HDInsight to install Solr on Hadoop cluster" pageTitle="Use Script Action in HDInsight to install Solr on Hadoop cluster| Azure" metaKeywords="" description="Learn how to customize HDInsight cluster to install Solr. You'll use a Script Action configuration option to use a script to install Solr" metaCanonical="" services="hdinsight" documentationCenter="" title="" authors="nitinme" solutions="" manager="paulettm" editor="cgronlun"/>

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="12/19/2014" ms.author="nitinme" />

# Install and use Solr on HDInsight Hadoop clusters

You can install Solr on any type of cluster in Hadoop on HDInsight using **Script Action** cluster customization. Script action lets you run scripts to customize a cluster, only when the cluster is being created. For more information, see [Customize HDInsight cluster using script action][hdinsight-cluster-customize].

In this topic, you will learn how to install Solr using Script Action. Solr is a powerful search platform and provides enterprise-level search capabilities on data managed by Hadoop. Once you have installed Solr on HDInsight cluster, you'll also learn how to search data using Solr.

> [AZURE.NOTE] The sample script used in this topic creates a Solr cluster with a specific configuration. If you want to configure the Solr cluster with different collections, shards, schemas, replicas, etc., you must modify the script and Solr binaries accordingly.


## In this article

- [What is Solr?](#whatis)
- [How do I install Solr?](#install)
- [How do I use Solr in HDInsight?](#usesolr)
- [Install Solr on HDInsight Hadoop clusters using PowerShell](#usingPS)
- [Install Solr on HDInsight Hadoop clusters using the .NET SDK](#usingSDK) 


## <a name="whatis"></a>What is Solr?

<a href="http://lucene.apache.org/solr/features.html" target="_blank">Apache Solr</a> is an enterprise search platform that enables powerful full-text search on data. While Hadoop enables storing and managing vast amounts of data, Apache Solr provides the search capabilities to quickly retrieve the data. This topic provides instructions on how to customize an HDInsight cluster to install Solr.   

## <a name="install"></a>How do I install Solr?

A sample script to install Solr on an HDInsight cluster is available from a read-only Azure storage blob at [https://hdiconfigactions.blob.core.windows.net/solrconfigactionv01/solr-installer-v01.ps1](https://hdiconfigactions.blob.core.windows.net/solrconfigactionv01/solr-installer-v01.ps1). This section provides instructions on how to use the sample script while provisioning the cluster using the Azure Management Portal. 


> [AZURE.NOTE] The sample script works only with HDInsight cluster version 3.1.  For more information on HDInsight cluster versions, see [HDInsight cluster versions](http://azure.microsoft.com/en-us/documentation/articles/hdinsight-component-versioning/).


1. Start provisioning a cluster using the **CUSTOM CREATE** option, as described at [Provisioning a cluster using custom options](http://azure.microsoft.com/en-us/documentation/articles/hdinsight-provision-clusters/#portal). 
2. On the **Script Actions** page of the wizard, click **add script action** to provide details about the Script Action, as shown below:

	![Use Script Action to customize a cluster](./media/hdinsight-hadoop-solr-install/hdi-script-action-solr.png "Use Script Action to customize a cluster")
	
	<table border='1'>
		<tr><th>Property</th><th>Value</th></tr>
		<tr><td>Name</td>
			<td>Specify a name for the script action. For example, <b>Install Solr</b>.</td></tr>
		<tr><td>Script URI</td>
			<td>Specify the URI to the script that is invoked to customize the cluster. For example, <i>https://hdiconfigactions.blob.core.windows.net/solrconfigactionv01/solr-installer-v01.ps1</i></td></tr>
		<tr><td>Node Type</td>
			<td>Specifies the nodes on which the customization script is run. You can choose <b>All Nodes</b>, <b>Head nodes only</b>, or <b>Worker nodes</b> only.
		<tr><td>Parameters</td>
			<td>Specify the parameters, if required by the script. The script to install Solr does not require any parameters so you can leave this blank.</td></tr>
	</table>	

	You can add more than one script action to install multiple components on the cluster. After you have added the scripts, click the checkmark to start provisioning the cluster.

You can also use the script to install Solr on HDInsight using PowerShell or the HDInsight .NET SDK. Instructions for these procedures are provided later in this topic.

## <a name="usesolr"></a>How do I use Solr in HDInsight?

You must start with indexing Solr with some data files. You can then use Solr to run search queries on the indexed data. Perform the following steps, to use Solr in an HDInsight cluster:

1. **RDP into the HDInsight cluster with Solr installed**. From the Azure Management Portal, enable remote desktop for the cluster you created with Solr installed, and then remote into the cluster. For instructions, see <a href="http://azure.microsoft.com/en-us/documentation/articles/hdinsight-administer-use-management-portal/#rdp" target="_blank">Connect to HDInsight clusters using RDP</a>.

2. **Index Solr by uploading data files**. When you index Solr, you put documents in it that you may need to search on. To index Solr, RDP into the cluster, navigate to the Desktop, open the Hadoop command line, and navigate to **C:\apps\dist\solr-4.7.2\example\exampledocs**. Run the following command: 
	
		java -jar post.jar solr.xml monitor.xml

	You'll see the following output on the console.

		POSTing file solr.xml
		POSTing file monitor.xml
		2 files indexed.
		COMMITting Solr index changes to http://localhost:8983/solr/update..
		Time spent: 0:00:01.624

	The post.jar utility indexes Solr with two sample documents, **solr.xml** and **monitor.xml**. The post.jar utility and the sample documents are available with Solr installation.

3. **Use the Solr dashboard to search within the indexed documents**. In the RDP session to the HDInsight cluster, open Internet Explorer, and launch the Solr dashboard at **http://headnodehost:8983/solr/#/**. From the left pane, from the Core Selector drop-down, select **collection1**, and within that, click **Query**. As an example, to select and return all the docs in Solr, provide the following values:
	1. In the **q** text box, enter **\*:**\*. This will return all the documents that are indexed in Solr. If you want to search for a specific string within the documents, you can enter that string here.
	2. In the **wt** text box, select the output format. Default is **json**. Click **Execute Query**.

		![Use Script Action to customize a cluster](./media/hdinsight-hadoop-solr-install/hdi-solr-dashboard-query.png "Run a query on Solr dashboard")
	
	The output returns the two docs that we used for indexing Solr. The output resembles the following:

			"response": {
			    "numFound": 2,
			    "start": 0,
			    "maxScore": 1,
			    "docs": [
			      {
			        "id": "SOLR1000",
			        "name": "Solr, the Enterprise Search Server",
			        "manu": "Apache Software Foundation",
			        "cat": [
			          "software",
			          "search"
			        ],
			        "features": [
			          "Advanced Full-Text Search Capabilities using Lucene",
			          "Optimized for High Volume Web Traffic",
			          "Standards Based Open Interfaces - XML and HTTP",
			          "Comprehensive HTML Administration Interfaces",
			          "Scalability - Efficient Replication to other Solr Search Servers",
			          "Flexible and Adaptable with XML configuration and Schema",
			          "Good unicode support: héllo (hello with an accent over the e)"
			        ],
			        "price": 0,
			        "price_c": "0,USD",
			        "popularity": 10,
			        "inStock": true,
			        "incubationdate_dt": "2006-01-17T00:00:00Z",
			        "_version_": 1486960636996878300
			      },
			      {
			        "id": "3007WFP",
			        "name": "Dell Widescreen UltraSharp 3007WFP",
			        "manu": "Dell, Inc.",
			        "manu_id_s": "dell",
			        "cat": [
			          "electronics and computer1"
			        ],
			        "features": [
			          "30\" TFT active matrix LCD, 2560 x 1600, .25mm dot pitch, 700:1 contrast"
			        ],
			        "includes": "USB cable",
			        "weight": 401.6,
			        "price": 2199,
			        "price_c": "2199,USD",
			        "popularity": 6,
			        "inStock": true,
			        "store": "43.17614,-90.57341",
			        "_version_": 1486960637584081000
			      }
			    ]
			  }
   

4. **Recommended: Back up the indexed data from Solr to Azure Storage Blob (WASB) associated with the HDInsight cluster**. As a good practice, you should back up the indexed data from the Solr cluster nodes onto WASB. Perform the following steps to do so:

	1. From the RDP session, open Internet Explorer, and point to the following URL:

			http://localhost:8983/solr/replication?command=backup

		You should see a response like this

			<?xml version="1.0" encoding="UTF-8"?>
			<response>
			  <lst name="responseHeader">
			    <int name="status">0</int>
			    <int name="QTime">9</int>
			  </lst>
			  <str name="status">OK</str>
			</response>

	2. In the remote session, navigate to {SOLR_HOME}\{Collection}\data. For the cluster created using the sample script, this should be **C:\apps\dist\solr-4.7.2\example\solr\collection1\data**. At this location, you should see a snapshot folder creating with a name similar to **snapshot.*timestamp***.
	
	3. Zip the snapshot folder and upload it to WASB. From the Hadoop command line, navigate to the location of the snapshot folder using the following command:

			  hadoop fs -CopyFromLocal snapshot._timestamp_.zip /example/data

		This command copies the snapshot to /example/data/ under the container within the default storage account associated with the cluster.

## <a name="usingPS"></a>Install Solr on HDInsight Hadoop clusters using PowerShell

In this section we use the **<a href = "http://msdn.microsoft.com/en-us/library/dn858088.aspx" target="_blank">Add-AzureHDInsightScriptAction</a>** cmdlet to invoke scripts using Script Action to customize a cluster. Before proceeding, make sure you have installed and configured PowerShell. For information on configuring a workstation to run HDInsight Powershell cmdlets, see [Install and configure Azure PowerShell][powershell-install-configure].

Perform the following steps:

1. Open an Azure PowerShell window and declare the following variables:

		# PROVIDE VALUES FOR THESE VARIABLES
		$subscriptionName = "<SubscriptionName>"		# Name of the Azure subscription
		$clusterName = "<HDInsightClusterName>"			# The HDInsight cluster name
		$storageAccountName = "<StorageAccountName>"	# Azure storage account that hosts the default container
		$storageAccountKey = "<StorageAccountKey>"      # Key for the storage account
		$containerName = $clusterName
		$location = "<MicrosoftDataCenter>"				# The location of the HDInsight cluster. It must in the same data center as the storage account.
		$clusterNodes = <ClusterSizeInNumbers>			# The number of nodes in the HDInsight cluster.
		$version = "<HDInsightClusterVersion>"          # For example "3.1"
	
2. Specify the configuration values such as nodes in the cluster and the default storage to be used.

		# SPECIFY THE CONFIGURATION OPTIONS
		Select-AzureSubscription $subscriptionName
		$config = New-AzureHDInsightClusterConfig -ClusterSizeInNodes $clusterNodes
		$config.DefaultStorageAccount.StorageAccountName="$storageAccountName.blob.core.windows.net"
		$config.DefaultStorageAccount.StorageAccountKey=$storageAccountKey
		$config.DefaultStorageAccount.StorageContainerName=$containerName
	
3. Use **Add-AzureHDInsightScriptAction** cmdlet to to add Script Action to cluster configuration. Later, when the cluster is being created, the Script Action gets executed. 

		# ADD SCRIPT ACTION TO CLUSTER CONFIGURATION
		$config = Add-AzureHDInsightScriptAction -Config $config -Name "Install Solr" -ClusterRoleCollection HeadNode,DataNode -Uri https://hdiconfigactions.blob.core.windows.net/solrconfigactionv01/solr-installer-v01.ps1

	**Add-AzureHDInsightScriptAction** cmdlet takes the following parameters:

	<table style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse;">
	<tr>
	<th style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; width:90px; padding-left:5px; padding-right:5px;">Parameter</th>
	<th style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; width:550px; padding-left:5px; padding-right:5px;">Definition</th></tr>
	<tr>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Config</td>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px; padding-right:5px;">The configuration object to which script action information is added</td></tr>
	<tr>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Name</td>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Name of the script action</td></tr>
	<tr>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">ClusterRoleCollection</td>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Specifies the nodes on which the customization script is run. The valid values are HeadNode (to install on the headnode) or DataNode (to install on all the datanodes). You can use either or both values.</td></tr>
	<tr>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Uri</td>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Specifies the URI to the script that is executed</td></tr>
	<tr>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Parameters</td>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Parameters required by the script. The sample script used in this topic does not require any parameters, and hence you do not see this parameter in the snippet above.
	</td></tr>
	</table>
	
4. Finally, start provisioning a customized cluster with Solr installed.  
	
		# START PROVISIONING A CLUSTER WITH SOLR INSTALLED
		New-AzureHDInsightCluster -Config $config -Name $clusterName -Location $location -Version $version 

When prompted, enter the credentials for the cluster. It can take several minutes before the cluster is created.


## <a name="usingSDK"></a>Install Solr on HDInsight Hadoop clusters using the .NET SDK

The HDInsight .NET SDK provides .NET client libraries that makes it easier to work with HDInsight from a .NET application. This section provides instructions on how to use Script Action from the SDK to provision a cluster that has Solr installed. The following procedures must be performed:

- Install HDInsight .NET SDK
- Create a self-signed certificate
- Create a console application
- Run the application


**To install HDInsight .NET SDK**

You can install latest published build of the SDK from [NuGet](http://nuget.codeplex.com/wikipage?title=Getting%20Started). The instructions will be shown in the next procedure.

**To create a self-signed certificate**

Create a self-signed certificate, install it on your workstation, and upload it to your Azure subscription. For instructions, see [Create a self-signed certificate](http://go.microsoft.com/fwlink/?LinkId=511138). 


**To create a Visual Studio application**

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
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">CreateSolrCluster</td></tr>
	</table>

4. Click **OK** to create the project.

5. From the **Tools** menu, click **Nuget Package Manager**, and then click **Package Manager Console**.

6. Run the following commands in the console to install the package.

		Install-Package Microsoft.WindowsAzure.Management.HDInsight

	This command adds the .NET libraries and references to them from the current Visual Studio project.

	
7. From Solution Explorer, double-click **Program.cs** to open it.

8. Add the following using statements to the top of the file:

		using System.Security.Cryptography.X509Certificates;
		using Microsoft.WindowsAzure.Management.HDInsight;
		using Microsoft.WindowsAzure.Management.HDInsight.ClusterProvisioning;
		using Microsoft.WindowsAzure.Management.HDInsight.Framework.Logging;
	
9. In the Main() function, copy and paste the following code, and provide values for the variables :
		
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

10. Append the following code to the Main() function to use the [ScriptAction](http://msdn.microsoft.com/en-us/library/microsoft.windowsazure.management.hdinsight.clusterprovisioning.data.scriptaction.aspx) class to invoke a custom script to install Solr.

		// ADD THE SCRIPT ACTION TO INSTALL Solr
        clusterInfo.ConfigActions.Add(new ScriptAction(
          "Install Solr", // Name of the config action
          new ClusterNodeType[] { ClusterNodeType.HeadNode, ClusterNodeType.DataNode }, // List of nodes to install Solr on
          new Uri("https://hdiconfigactions.blob.core.windows.net/solrconfigactionv01/solr-installer-v01.ps1"), // Location of the script to install Solr
		  null //because the script used does not require any parameters.
        ));

11. Finally, create the cluster.

		client.CreateCluster(clusterInfo);

11. Save changes to the application and build the solution. 

**To run the application**

Open a PowerShell console, navigate to the location where you saved the Visual Studio project, navigate to the \bin\debug directory within the project, and then run the following command:

	.\CreateSolrCluster <cluster-name>

Provide a cluster name and press ENTER to provision a cluster with Solr installed.


## See also##
- [Install and use Spark on HDInsight clusters][hdinsight-install-spark]. Use cluster customization to install Spark on HDInsight Hadoop clusters. Spark is an open-source parallel processing framework that supports in-memory processing to boost the performance of big data analytic applications.
- [Install R on HDInsight clusters][hdinsight-install-r]. Use cluster customization to install R on HDInsight Hadoop clusters. R is an open source language and environment for statistical computing and provides hundreds of build-in statistical functions and its own programming language that combines aspects of functional and object-oriented programming. It also provides extensive graphical capabilities.
- [Install Giraph on HDInsight clusters](../hdinsight-hadoop-giraph-install). Use cluster customization to install Giraph on HDInsight Hadoop clusters. Giraph allows you to perform graph processing using Hadoop, and can be used with Azure HDInsight.




[hdinsight-provision]: ../hdinsight-provision-clusters/
[hdinsight-install-r]: ../hdinsight-hadoop-r-scripts/
[hdinsight-install-spark]: ../hdinsight-hadoop-spark-install/
[hdinsight-cluster-customize]: ../hdinsight-hadoop-customize-cluster
