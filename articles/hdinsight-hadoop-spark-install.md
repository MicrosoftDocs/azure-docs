<properties linkid="install Spark on HDInsight cluster" urlDisplayName="Use Script Action in HDInsight to install Spark on Hadoop cluster" pageTitle="Use Script Action in HDInsight to install Spark on Hadoop cluster| Azure" metaKeywords="" description="Learn how to customize HDInsight cluster to install Spark. You'll use a Script Action configuration option to use a script to install Spark" metaCanonical="" services="hdinsight" documentationCenter="" title="Install and use Spark on HDInsight clusters" authors="nitinme" solutions="" manager="paulettm" editor="cgronlun" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="12/19/2014" ms.author="nitinme" />

# Install and use Spark 1.0 on HDInsight Hadoop clusters

You can install Spark on any type of cluster in Hadoop on HDInsight using **Script Action** cluster customization. Script action lets you run scripts to customize a cluster, only when the cluster is being created. For more information, see [Customize HDInsight cluster using script action][hdinsight-cluster-customize].

In this topic, you will learn how to install Spark 1.0 using Script Action. Once you have installed Spark, you'll also learn how to run a Spark query on HDInsight clusters.


## In this article

- [What is Spark?](#whatis)
- [How do I install Spark?](#install)
- [How do I use Spark in HDInsight?](#usespark)
- [Install Spark on HDInsight Hadoop clusters using PowerShell](#usingPS)
- [Install Spark on HDInsight Hadoop clusters using the .NET SDK](#usingSDK) 


## <a name="whatis"></a>What is Spark?

<a href="http://spark.apache.org/docs/latest/index.html" target="_blank">Apache Spark</a> is an open-source parallel processing framework that supports in-memory processing to boost the performance of big data analytic applications. Spark's in-memory computation capabilities make it a good choice for iterative algorithms in machine learning and graph computations.

Spark can also be used to perform conventional disk-based data processing. Spark improves over traditional MapReduce framework by avoiding writes to disk in the intermediate stages. Also, Spark is compatible with HDFS and WASB so the existing data can easily be processed using Spark. 

This topic provides instructions on how to customize an HDInsight cluster to install Spark.   

## <a name="install"></a>How do I install Spark?

A sample script to install Spark on an HDInsight cluster is available from a read-only Azure storage blob at [https://hdiconfigactions.blob.core.windows.net/sparkconfigactionv02/spark-installer-v02.ps1](https://hdiconfigactions.blob.core.windows.net/sparkconfigactionv02/spark-installer-v02.ps1). This section provides instructions on how to use the sample script while provisioning the cluster using the Azure Management Portal. 

> [AZURE.NOTE] The sample script works only with HDInsight cluster version 3.1.  For more information on HDInsight cluster versions, see [HDInsight cluster versions](http://azure.microsoft.com/en-us/documentation/articles/hdinsight-component-versioning/).

1. Start provisioning a cluster using the **CUSTOM CREATE** option, as described at [Provisioning a cluster using custom options](http://azure.microsoft.com/en-us/documentation/articles/hdinsight-provision-clusters/#portal). 
2. On the **Script Actions** page of the wizard, click **add script action** to provide details about the Script Action, as shown below:

	![Use Script Action to customize a cluster](./media/hdinsight-hadoop-customize-cluster/HDI.CustomProvision.Page6.png "Use Script Action to customize a cluster")
	
	<table border='1'>
		<tr><th>Property</th><th>Value</th></tr>
		<tr><td>Name</td>
			<td>Specify a name for the script action. For example, <b>Install Spark</b>.</td></tr>
		<tr><td>Script URI</td>
			<td>Specify the URI to the script that is invoked to customize the cluster. For example, <i>https://hdiconfigactions.blob.core.windows.net/sparkconfigactionv02/spark-installer-v02.ps1</i></td></tr>
		<tr><td>Node Type</td>
			<td>Specifies the nodes on which the customization script is run. You can choose <b>All Nodes</b>, <b>Head nodes only</b>, or <b>Worker nodes</b> only.
		<tr><td>Parameters</td>
			<td>Specify the parameters, if required by the script. The script to install Spark does not require any parameters so you can leave this blank.</td></tr>
	</table>	

	You can add more than one script action to install multiple components on the cluster. After you have added the scripts, click the checkmark to start provisioning the cluster.

You can also use the script to install Spark on HDInsight using PowerShell or the HDInsight .NET SDK. Instructions for these procedures are provided later in this topic.

## <a name="usespark"></a>How do I use Spark in HDInsight?
Spark provides APIs in Scala, Python, and Java. You can also use the interactive Spark shell to run Spark queries. This section provides introduction on how to use these two approaches to work with Spark:

- [Using the  Spark shell](#sparkshell)
- [Using a standalone Scala program](#standalone)

###<a name="sparkshell"></a>Using the Spark shell
Perform the following steps to run Spark queries from an interactive Spark shell. In this section we run a Spark query on a sample data file (/example/data/gutenberg/davinci.txt) that is available on HDInsight clusters by default.

1. From the Azure Management Portal, enable remote desktop for the cluster you created with Spark installed, and then remote into the cluster. For instructions, see <a href="http://azure.microsoft.com/en-us/documentation/articles/hdinsight-administer-use-management-portal/#rdp" target="_blank">Connect to HDInsight clusters using RDP</a>.

2. In the RDP session, from the Desktop, open the Hadoop Command Line, and navigate to the location where Spark is installed, for example, **C:\apps\dist\spark-1.0.2**.


3. Run the following command to start the Spark shell.

		 .\bin\spark-shell --master yarn

	After the command finishes running, you should get a Scala prompt.

		 scala>

5. On the Scala prompt, enter the Spark query shown below. This query counts the occurrence of each word in the davinci.txt file that is available at /example/data/gutenberg/ location on the WASB storage associated with the cluster.

		val file = sc.textFile("/example/data/gutenberg/davinci.txt")
		val counts = file.flatMap(line => line.split(" ")).map(word => (word, 1)).reduceByKey(_ + _)
		counts.toArray().foreach(println)

6. The output should resemble the following:

	![Output from running Scala interactive shell in an HDInsight cluster][img-hdi-scala-interactive]
		

7. Enter :q to exit the Scala prompt.

		:q

### <a name="standalone"></a>Using a standalone Scala program

In this section we write a Scala application that counts the number of lines containing the letters 'a' and 'b' in a sample data file (/example/data/gutenberg/davinci.txt) that is available on HDInsight clusters by default. To write and use a standalone Scala program with a cluster customized with Spark installation, you must perform the following steps:

- Write a Scala program
- Build it to get the .jar file
- Run the job on the cluster

#### Write a Scala program
In this section you write a Scala program that counts the number of lines containing 'a' and 'b' in the sample data file. 

1. Open a text editor and paste the following code:


		/* SimpleApp.scala */
		import org.apache.spark.SparkContext
		import org.apache.spark.SparkContext._
		import org.apache.spark.SparkConf
		
		object SimpleApp {
		  def main(args: Array[String]) {
		    val logFile = "/example/data/gutenberg/davinci.txt"			//location of sample data file on WASB
		    val conf = new SparkConf().setAppName("SimpleApplication")
		    val sc = new SparkContext(conf)
		    val logData = sc.textFile(logFile, 2).cache()
		    val numAs = logData.filter(line => line.contains("a")).count()
		    val numBs = logData.filter(line => line.contains("b")).count()
		    println("Lines with a: %s, Lines with b: %s".format(numAs, numBs))
		  }
		}

2. Save the file with the name **SimpleApp.scala**.

#### Build the Scala program
In this section, you use <a href="http://www.scala-sbt.org/0.13/docs/index.html" target="_blank">Simple Build Tool</a> (or sbt) to build the scala program. sbt requires Java 1.6 or later so make sure you have the right version of Java installed before continuing with this section.

1. Install sbt from  http://www.scala-sbt.org/0.13/tutorial/Installing-sbt-on-Windows.html.
2. Create a folder called **SimpleScalaApp** and within this folder create a file called **simple.sbt**. This is a configuration file that contains information about the Scala version, library dependencies, etc. Paste the following into the simple.sbt file and save it.


		name := "SimpleApp"
	
		version := "1.0"
	
		scalaVersion := "2.10.4"
	
		libraryDependencies += "org.apache.spark" %% "spark-core" % "1.0.2"



	>[AZURE.NOTE] Make sure you retain the empty lines in the file.

	
3. Under the **SimpleScalaApp** folder, create a directory structure **\src\main\scala** and paste the Scala program (**SimpleApp.scala**) you created earlier under \src\main\scala folder.
4. Open a command prompt, navigate to the SimpleScalaApp directory, and enter the following command:


		sbt package


	Once the application is compiled, you will see a **simpleapp_2.10-1.0.jar** created under **\target\scala-2.10** directory within the root SimpleScalaApp folder.


#### Run the job on the cluster
In this section you will remote into the cluster that has Spark installed and then copy the SimpleScalaApp project's target folder. You will then use the **spark-submit** command to submit the job on the cluster.

1. Remote into the cluster that has Spark installed. From the computer where you wrote and built the SimpleApp.scala program, copy the **SimpleScalaApp\target** folder and paste it to a location on the cluster.
2. In the RDP session, from the Desktop, open the Hadoop Command Line, and navigate to the location you pasted the **target** folder.
3. Enter the following command to run the SimpleApp.scala program:


		C:\apps\dist\spark-1.0.2\bin\spark-submit --class "SimpleApp" --master local target/scala-2.10/simpleapp_2.10-1.0.jar

4. When the program finishes running, the output is displayed on the console.


		Lines with a: 21374, Lines with b: 11430

## <a name="usingPS"></a>Install Spark on HDInsight Hadoop clusters using PowerShell

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
		$config = Add-AzureHDInsightScriptAction -Config $config -Name "Install Spark" -ClusterRoleCollection HeadNode -Uri https://hdiconfigactions.blob.core.windows.net/sparkconfigactionv02/spark-installer-v02.ps1

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
	
4. Finally, start provisioning a customized cluster with Spark installed.  
	
		# START PROVISIONING A CLUSTER WITH SPARK INSTALLED
		New-AzureHDInsightCluster -Config $config -Name $clusterName -Location $location -Version $version 

When prompted, enter the credentials for the cluster. It can take several minutes before the cluster is created.


## <a name="usingSDK"></a>Install Spark on HDInsight Hadoop clusters using the .NET SDK

The HDInsight .NET SDK provides .NET client libraries that makes it easier to work with HDInsight from a .NET application. This section provides instructions on how to use Script Action from the SDK to provision a cluster that has Spark installed. The following procedures must be performed:

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
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">CreateSparkCluster</td></tr>
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

10. Append the following code to the Main() function to use the [ScriptAction](http://msdn.microsoft.com/en-us/library/microsoft.windowsazure.management.hdinsight.clusterprovisioning.data.scriptaction.aspx) class to invoke a custom script to install Spark.

		// ADD THE SCRIPT ACTION TO INSTALL SPARK
        clusterInfo.ConfigActions.Add(new ScriptAction(
          "Install Spark", // Name of the config action
          new ClusterNodeType[] { ClusterNodeType.HeadNode }, // List of nodes to install Spark on
          new Uri("https://hdiconfigactions.blob.core.windows.net/sparkconfigactionv02/spark-installer-v02.ps1"), // Location of the script to install Spark
		  null //because the script used does not require any parameters.
        ));

11. Finally, create the cluster.

		client.CreateCluster(clusterInfo);

11. Save changes to the application and build the solution. 

**To run the application**

Open a PowerShell console, navigate to the location where you saved the Visual Studio project, navigate to the \bin\debug directory within the project, and then run the following command:

	.\CreateSparkCluster <cluster-name>

Provide a cluster name and press ENTER to provision a cluster with Spark installed.


## See also##
- [Install R on HDInsight clusters][hdinsight-install-r] provides instructions on how to use cluster customization to install and use R on HDinsight Hadoop clusters. R is an open source language and environment for statistical computing and provides hundreds of build-in statistical functions and its own programming language that combines aspects of functional and object-oriented programming. It also provides extensive graphical capabilities.
- [Install Giraph on HDInsight clusters](../hdinsight-hadoop-giraph-install). Use cluster customization to install Giraph on HDInsight Hadoop clusters. Giraph allows you to perform graph processing using Hadoop, and can be used with Azure HDInsight.
- [Install Solr on HDInsight clusters](../hdinsight-hadoop-solr-install). Use cluster customization to install Solr on HDInsight Hadoop clusters. Solr allows you to perform search powerful search operations on data stored.





[hdinsight-provision]: ../hdinsight-provision-clusters/
[hdinsight-install-r]: ../hdinsight-hadoop-r-scripts/
[hdinsight-cluster-customize]: ../hdinsight-hadoop-customize-cluster
[powershell-install-configure]: ../install-configure-powershell/