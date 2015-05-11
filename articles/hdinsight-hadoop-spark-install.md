<properties 
	pageTitle="Use Script Action to install Spark on Hadoop cluster | Microsoft Azure" 
	description="Learn how to customize HDInsight cluster to install Spark. You'll use a Script Action configuration option to use a script to install Spark" 
	services="hdinsight" 
	documentationCenter="" 
	authors="nitinme" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="hdinsight" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/17/2015" 
	ms.author="nitinme"/>

# Install and use Spark on HDInsight Hadoop clusters

You can install Spark on any type of cluster in Hadoop on Azure HDInsight by using **Script Action** cluster customization. Script Action lets you run scripts to customize a cluster, only when the cluster is being created. For more information, see [Customize HDInsight cluster using Script Action][hdinsight-cluster-customize].

In this topic, you will learn how to install Spark by using Script Action. Once you have installed Spark, you'll also learn how to run a Spark query on HDInsight clusters.


## <a name="whatis"></a>What is Spark?

<a href="http://spark.apache.org/docs/latest/index.html" target="_blank">Apache Spark</a> is an open-source parallel processing framework that supports in-memory processing to boost the performance of big-data analytic applications. Spark's in-memory computation capabilities make it a good choice for iterative algorithms in machine learning and graph computations.

Spark can also be used to perform conventional disk-based data processing. Spark improves the traditional MapReduce framework by avoiding writes to disk in the intermediate stages. Also, Spark is compatible with the Hadoop Distributed File System (HDFS) and Azure Blob storage so the existing data can easily be processed via Spark. 

This topic provides instructions on how to customize an HDInsight cluster to install Spark.

## <a name="whatis"></a>Which version of Spark can I install?

In this topic, we use a Script Action custom script to install Spark on an HDInsight cluster. This script can install Spark 1.2.0 or Spark 1.0.2 depending on the version of the HDInsight cluster you provision.

- If you use the script while provisioning an **HDInsight 3.2** cluster, it installs **Spark 1.2.0**.
- If you use the script while provisioning an **HDInsight 3.1** cluster, it installs **Spark 1.0.2**. 

You can modify this script or create your own script to install other versions of Spark.


## <a name="install"></a>How do I install Spark?

A sample script to install Spark on an HDInsight cluster is available from a read-only Azure storage blob at [https://hdiconfigactions.blob.core.windows.net/sparkconfigactionv03/spark-installer-v03.ps1](https://hdiconfigactions.blob.core.windows.net/sparkconfigactionv03/spark-installer-v03.ps1). This section provides instructions on how to use the sample script while provisioning the cluster by using the Azure portal. 

> [AZURE.NOTE] The sample script works only with HDInsight 3.1 and 3.2 clusters. For more information on HDInsight cluster versions, see [HDInsight cluster versions](hdinsight-component-versioning.md).

1. Start provisioning a cluster by using the **CUSTOM CREATE** option, as described at [Provisioning a cluster using custom options](hdinsight-provision-clusters.md#portal). Pick the cluster version depending on the following:

	- If you want to install **Spark 1.2.0**, provision an HDInsight 3.2 cluster.
	- If you want to install **Spark 1.0.2**, provision an HDInsight 3.1 cluster.


2. On the **Script Actions** page of the wizard, click **add script action** to provide details about the script action, as shown below:

	![Use Script Action to customize a cluster](./media/hdinsight-hadoop-customize-cluster/HDI.CustomProvision.Page6.png "Use Script Action to customize a cluster")
	
	<table border='1'>
		<tr><th>Property</th><th>Value</th></tr>
		<tr><td>Name</td>
			<td>Specify a name for the script action. For example, <b>Install Spark</b>.</td></tr>
		<tr><td>Script URI</td>
			<td>Specify the Uniform Resource Identifier (URI) to the script that is invoked to customize the cluster. For example, <i>https://hdiconfigactions.blob.core.windows.net/sparkconfigactionv03/spark-installer-v03.ps1</i></td></tr>
		<tr><td>Node Type</td>
			<td>Specify the nodes on which the customization script is run. You can choose <b>All nodes</b>, <b>Head nodes only</b>, or <b>Worker nodes only</b>.
		<tr><td>Parameters</td>
			<td>Specify the parameters, if required by the script. The script to install Spark does not require any parameters so you can leave this blank.</td></tr>
	</table>	

	You can add more than one script action to install multiple components on the cluster. After you have added the scripts, click the checkmark to start provisioning the cluster.

You can also use the script to install Spark on HDInsight by using Azure PowerShell or the HDInsight .NET SDK. Instructions for these procedures are provided later in this topic.

## <a name="usespark"></a>How do I use Spark in HDInsight?
Spark provides APIs in Scala, Python, and Java. You can also use the interactive Spark shell to run Spark queries. This section provides instructions on how to use the different approaches to work with Spark:

- [Using the Spark shell to run interactive queries](#sparkshell)
- [Using the Spark shell to run Spark SQL queries](#sparksql) 
- [Using a standalone Scala program](#standalone)

###<a name="sparkshell"></a>Using the Spark shell to run interactive queries
Perform the following steps to run Spark queries from an interactive Spark shell. In this section, we run a Spark query on a sample data file (/example/data/gutenberg/davinci.txt) that is available on HDInsight clusters by default.

1. From the Azure portal, enable Remote Desktop for the cluster you created with Spark installed, and then remote into the cluster. For instructions, see <a href="http://azure.microsoft.com/documentation/articles/hdinsight-administer-use-management-portal/#rdp" target="_blank">Connect to HDInsight clusters using RDP</a>.

2. In the Remote Desktop Protocol (RDP) session, from the desktop, open the Hadoop command line (from a desktop shortcut), and navigate to the location where Spark is installed; for example, **C:\apps\dist\spark-1.2.0**.


3. Run the following command to start the Spark shell:

		 .\bin\spark-shell --master yarn

	After the command finishes running, you should get a Scala prompt:

		 scala>

5. On the Scala prompt, enter the Spark query shown below. This query counts the occurrence of each word in the davinci.txt file that is available at the /example/data/gutenberg/ location on the Azure Blob storage associated with the cluster.

		val file = sc.textFile("/example/data/gutenberg/davinci.txt")
		val counts = file.flatMap(line => line.split(" ")).map(word => (word, 1)).reduceByKey(_ + _)
		counts.toArray().foreach(println)

6. The output should resemble the following:

	![Output from running Scala interactive shell in an HDInsight cluster](./media/hdinsight-hadoop-spark-install/hdi-scala-interactive.png)
		

7. Enter :q to exit the Scala prompt.

		:q

###<a name="sparksql"></a>Using the Spark shell to run Spark SQL queries

Spark SQL allows you to use Spark to run relational queries expressed in Structured Query Language (SQL), HiveQL, or Scala. In this section, we look at using Spark to run a Hive query on a sample Hive table. The Hive table used in this section (called **hivesampletable**) is available by default when you provision a cluster.

>[AZURE.NOTE] The sample below was created against **Spark 1.2.0**, which is installed if you run the script action while provisioning HDInsight 3.2 cluster.

1. From the Azure portal, enable Remote Desktop for the cluster you created with Spark installed, and then remote into the cluster. For instructions, see <a href="http://azure.microsoft.com/documentation/articles/hdinsight-administer-use-management-portal/#rdp" target="_blank">Connect to HDInsight clusters using RDP</a>.

2. In the RDP session, from the desktop, open the Hadoop command line (from a desktop shortcut), and navigate to the location where Spark is installed; for example, **C:\apps\dist\spark-1.2.0**.


3. Run the following command to start the Spark shell:

		 .\bin\spark-shell --master yarn

	After the command finishes running, you should get a Scala prompt:

		 scala>

4. On the Scala prompt, set the Hive context. This is required to work with Hive queries by using Spark.

		val hiveContext = new org.apache.spark.sql.hive.HiveContext(sc)

	Note that **sc** is default Spark context that is set when you start the Spark shell.

5. Run a Hive query by using the Hive context and print the output to the console. The query retrieves data on devices of a specific make and limits the number of records retrieved to 20.

		hiveContext.sql("""SELECT * FROM hivesampletable WHERE devicemake LIKE "HTC%" LIMIT 20""").collect().foreach(println)

6. You should see an output like the following:

	![Output from running Spark SQL on an HDInsight cluster](./media/hdinsight-hadoop-spark-install/hdi-spark-sql.png)

7. Enter :q to exit the Scala prompt.

		:q

### <a name="standalone"></a>Using a standalone Scala program

In this section, we write a Scala application that counts the number of lines containing the letters 'a' and 'b' in a sample data file (/example/data/gutenberg/davinci.txt) that is available on HDInsight clusters by default. To write and use a standalone Scala program with a cluster customized with Spark installation, you must perform the following steps:

- Write a Scala program
- Build the Scala program to get the .jar file
- Run the job on the cluster

#### Write a Scala program
In this section, you write a Scala program that counts the number of lines containing 'a' and 'b' in the sample data file. 

1. Open a text editor and paste the following code:


		/* SimpleApp.scala */
		import org.apache.spark.SparkContext
		import org.apache.spark.SparkContext._
		import org.apache.spark.SparkConf
		
		object SimpleApp {
		  def main(args: Array[String]) {
		    val logFile = "/example/data/gutenberg/davinci.txt"			//Location of the sample data file on Azure Blob storage
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
In this section, you use the <a href="http://www.scala-sbt.org/0.13/docs/index.html" target="_blank">Simple Build Tool</a> (or sbt) to build the Scala program. sbt requires Java 1.6 or later, so make sure you have the right version of Java installed before continuing with this section.

1. Install sbt from http://www.scala-sbt.org/0.13/tutorial/Installing-sbt-on-Windows.html.
2. Create a folder called **SimpleScalaApp**, and within this folder create a file called **simple.sbt**. This is a configuration file that contains information about the Scala version, library dependencies, etc. Paste the following into the simple.sbt file and save it:


		name := "SimpleApp"
	
		version := "1.0"
	
		scalaVersion := "2.10.4"
	
		libraryDependencies += "org.apache.spark" %% "spark-core" % "1.2.0"



	>[AZURE.NOTE] Make sure you retain the empty lines in the file.

	
3. Under the **SimpleScalaApp** folder, create a directory structure **\src\main\scala** and paste the Scala program (**SimpleApp.scala**) you created earlier under the \src\main\scala folder.
4. Open a command prompt, navigate to the SimpleScalaApp directory, and enter the following command:


		sbt package


	Once the application is compiled, you will see a **simpleapp_2.10-1.0.jar** file created under the **\target\scala-2.10** directory within the root SimpleScalaApp folder.


#### Run the job on the cluster
In this section, you remote into the cluster that has Spark installed and then copy the SimpleScalaApp project's target folder. You then use the **spark-submit** command to submit the job on the cluster.

1. Remote into the cluster that has Spark installed. From the computer where you wrote and built the SimpleApp.scala program, copy the **SimpleScalaApp\target** folder and paste it to a location on the cluster.
2. In the RDP session, from the desktop, open the Hadoop command line, and navigate to the location where you pasted the **target** folder.
3. Enter the following command to run the SimpleApp.scala program:


		C:\apps\dist\spark-1.2.0\bin\spark-submit --class "SimpleApp" --master local target/scala-2.10/simpleapp_2.10-1.0.jar

4. When the program finishes running, the output is displayed on the console.


		Lines with a: 21374, Lines with b: 11430

## <a name="usingPS"></a>Install Spark on HDInsight Hadoop clusters by using Azure PowerShell

In this section, we use the **<a href = "http://msdn.microsoft.com/library/dn858088.aspx" target="_blank">Add-AzureHDInsightScriptAction</a>** cmdlet to invoke scripts by using Script Action to customize a cluster. Before proceeding, make sure you have installed and configured Azure PowerShell. For information on configuring a workstation to run Azure PowerShell cmdlets for HDInsight, see [Install and configure Azure PowerShell][powershell-install-configure].

Perform the following steps:

1. Open an Azure PowerShell window and declare the following variables:

		# Provide values for these variables
		$subscriptionName = "<SubscriptionName>"		# Name of the Azure subscription
		$clusterName = "<HDInsightClusterName>"			# HDInsight cluster name
		$storageAccountName = "<StorageAccountName>"	# Azure Storage account that hosts the default container
		$storageAccountKey = "<StorageAccountKey>"      # Key for the Storage account
		$containerName = $clusterName
		$location = "<MicrosoftDataCenter>"				# Location of the HDInsight cluster. It must be in the same data center as the Storage account.
		$clusterNodes = <ClusterSizeInNumbers>			# Number of nodes in the HDInsight cluster
		$version = "<HDInsightClusterVersion>"          # For example, "3.2"
	
2. Specify the configuration values such as nodes in the cluster and the default storage to be used.

		# Specify the configuration options
		Select-AzureSubscription $subscriptionName
		$config = New-AzureHDInsightClusterConfig -ClusterSizeInNodes $clusterNodes
		$config.DefaultStorageAccount.StorageAccountName="$storageAccountName.blob.core.windows.net"
		$config.DefaultStorageAccount.StorageAccountKey=$storageAccountKey
		$config.DefaultStorageAccount.StorageContainerName=$containerName
	
3. Use the **Add-AzureHDInsightScriptAction** cmdlet to add a script action to cluster configuration. Later, when the cluster is being created, the script action gets executed. 

		# Add a script action to the cluster configuration
		$config = Add-AzureHDInsightScriptAction -Config $config -Name "Install Spark" -ClusterRoleCollection HeadNode -Uri https://hdiconfigactions.blob.core.windows.net/sparkconfigactionv03/spark-installer-v03.ps1

	**Add-AzureHDInsightScriptAction** cmdlet takes the following parameters:

	<table style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse;">
	<tr>
	<th style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; width:90px; padding-left:5px; padding-right:5px;">Parameter</th>
	<th style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; width:550px; padding-left:5px; padding-right:5px;">Definition</th></tr>
	<tr>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Config</td>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px; padding-right:5px;">The configuration object to which script action information is added.</td></tr>
	<tr>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Name</td>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Name of the script action.</td></tr>
	<tr>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">ClusterRoleCollection</td>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Specifies the nodes on which the customization script is run. The valid values are HeadNode (to install on the head node) or DataNode (to install on all the data nodes). You can use either or both values.</td></tr>
	<tr>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Uri</td>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Specifies the URI to the script that is executed.</td></tr>
	<tr>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Parameters</td>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Parameters required by the script. The sample script used in this topic does not require any parameters, and hence you do not see this parameter in the snippet above.
	</td></tr>
	</table>
	
4. Finally, start provisioning a customized cluster with Spark installed.  
	
		# Start provisioning a cluster with Spark installed
		New-AzureHDInsightCluster -Config $config -Name $clusterName -Location $location -Version $version 

When prompted, enter the credentials for the cluster. It can take several minutes before the cluster is created.


## <a name="usingSDK"></a>Install Spark on HDInsight Hadoop clusters by using the .NET SDK

The HDInsight .NET SDK provides .NET client libraries that make it easier to work with HDInsight from a .NET Framework application. This section provides instructions on how to use Script Action from the SDK to provision a cluster that has Spark installed. The following procedures must be performed:

- Install the HDInsight .NET SDK
- Create a self-signed certificate
- Create a console application
- Run the application


**To install the HDInsight .NET SDK**

You can install latest published build of the SDK from [NuGet](http://nuget.codeplex.com/wikipage?title=Getting%20Started). The instructions will be shown in the next procedure.

**To create a self-signed certificate**

Create a self-signed certificate, install it on your workstation, and upload it to your Azure subscription. For instructions, see [Create a self-signed certificate](http://go.microsoft.com/fwlink/?LinkId=511138). 


**To create a Visual Studio application**

1. Open Visual Studio 2013.

2. From the **File** menu, click **New**, and then click **Project**.

3. From **New Project**, type or select the following values:
	
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

6. Run the following command in the console to install the package:

		Install-Package Microsoft.WindowsAzure.Management.HDInsight

	This command adds the .NET libraries and references to them from the current Visual Studio project.

7. From Solution Explorer, double-click **Program.cs** to open it.

8. Add the following using statements to the top of the file:

		using System.Security.Cryptography.X509Certificates;
		using Microsoft.WindowsAzure.Management.HDInsight;
		using Microsoft.WindowsAzure.Management.HDInsight.ClusterProvisioning;
		using Microsoft.WindowsAzure.Management.HDInsight.Framework.Logging;
	
9. In the Main() function, copy and paste the following code, and provide values for the variables:
		
        var clusterName = args[0];

        // Provide values for the variables
        string thumbprint = "<CertificateThumbprint>";  
        string subscriptionId = "<AzureSubscriptionID>";
        string location = "<MicrosoftDataCenterLocation>";
        string storageaccountname = "<AzureStorageAccountName>.blob.core.windows.net";
        string storageaccountkey = "<AzureStorageAccountKey>";
        string username = "<HDInsightUsername>";
        string password = "<HDInsightUserPassword>";
        int clustersize = <NumberOfNodesInTheCluster>;

        // Provide the certificate thumbprint to retrieve the certificate from the certificate store 
        X509Store store = new X509Store();
        store.Open(OpenFlags.ReadOnly);
        X509Certificate2 cert = store.Certificates.Cast<X509Certificate2>().First(item => item.Thumbprint == thumbprint);

        // Create an HDInsight client object
        HDInsightCertificateCredential creds = new HDInsightCertificateCredential(new Guid(subscriptionId), cert);
        var client = HDInsightClient.Connect(creds);
		client.IgnoreSslErrors = true;
        
        // Provide the cluster information
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
            Version = "3.2"
        };        

10. Append the following code to the Main() function to use the [ScriptAction](http://msdn.microsoft.com/library/microsoft.windowsazure.management.hdinsight.clusterprovisioning.data.scriptaction.aspx) class to invoke a custom script to install Spark.

		// Add the script action to install Spark
        clusterInfo.ConfigActions.Add(new ScriptAction(
          "Install Spark", // Name of the config action
          new ClusterNodeType[] { ClusterNodeType.HeadNode }, // List of nodes to install Spark on
          new Uri("https://hdiconfigactions.blob.core.windows.net/sparkconfigactionv03/spark-installer-v03.ps1"), // Location of the script to install Spark.
		  null //Because the script used does not require any parameters
        ));

11. Finally, create the cluster.

		client.CreateCluster(clusterInfo);

11. Save changes to the application and build the solution. 

**To run the application**

Open an Azure PowerShell console, navigate to the location where you saved the Visual Studio project, navigate to the \bin\debug directory within the project, and then run the following command:

	.\CreateSparkCluster <cluster-name>

Provide a cluster name and press ENTER to provision a cluster with Spark installed.


## See also##
- [Install R on HDInsight clusters][hdinsight-install-r] provides instructions on how to use cluster customization to install and use R on HDInsight Hadoop clusters. R is an open-source language and environment for statistical computing. It provides hundreds of built-in statistical functions and its own programming language that combines aspects of functional and object-oriented programming. It also provides extensive graphical capabilities.
- [Install Giraph on HDInsight clusters](hdinsight-hadoop-giraph-install.md). Use cluster customization to install Giraph on HDInsight Hadoop clusters. Giraph allows you to perform graph processing by using Hadoop, and can be used with Azure HDInsight.
- [Install Solr on HDInsight clusters](hdinsight-hadoop-solr-install.md). Use cluster customization to install Solr on HDInsight Hadoop clusters. Solr allows you to perform powerful search operations on data stored.





[hdinsight-provision]: hdinsight-provision-clusters.md
[hdinsight-install-r]: hdinsight-hadoop-r-scripts.md
[hdinsight-cluster-customize]: hdinsight-hadoop-customize-cluster.md
[powershell-install-configure]: install-configure-powershell.md
