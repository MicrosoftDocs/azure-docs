<properties linkid="manage-services-hdinsight-using-client-library" urlDisplayName="Using the Hadoop .NET SDK" pageTitle="How to use the Hadoop .NET SDK with HDInsight - Windows Azure guidance" metaKeywords="hdinsight hadoop .net sdk, hadoop .net sdk, hadoop .net sdk azure" metaDescription="Learn how to use the Hadoop .NET SDK with the HDInsight Service." umbracoNaviHide="0" disqusComments="1" writer="sburgess" editor="mollybos" manager="paulettm" />

<div chunk="../chunks/hdinsight-left-nav.md" />

#Using the Hadoop .NET SDK with the HDInsight Service#

The Hadoop .NET SDK provides .NET client libraries that makes it easier to work with Hadoop from .NET. In this tutorial you will learn how to get the Hadoop .NET SDK and use it to build a simple .NET based application that runs Hive queries using the Windows Azure HDInsight Service. 

To enable the HDInsight Service preview, click [here](https://account.windowsazure.com/PreviewFeatures).

## In this Article

* [Downloading an installing the Hadoop .NET SDK](#install)
* [Preparing for the tutorial](#prepare)
* [Create the application](#create)
* [Run the application](#run)
* [Next Steps](#nextsteps)

##<a id="install"></a> Downloading and Installing the Hadoop .NET SDK##

You can install latest published build of the SDK from [NuGet](http://nuget.codeplex.com/wikipage?title=Getting%20Started). The SDK includes the following components:

* **MapReduce library** - simplifies writing MapReduce jobs in .NET languages using the Hadoop streaming interface.

* **LINQ to Hive client library** - translates C# or F# LINQ queries into HiveQL queries and executes them on the Hadoop cluster. This library can also execute arbitrary HiveQL queries from a .NET application.

* **WebClient library** - contains client libraries for *WebHDFS* and *WebHCat*.

	* **WebHDFS client library** - works with files in HDFS and Windows Azure Blog Storage.

	* **WebHCat client library** - manages the scheduling and execution of jobs in HDInsight cluster.
	
The NuGet syntax to install the libraries:

		install-package Microsoft.Hadoop.MapReduce
		install-package Microsoft.Hadoop.Hive 
		install-package Microsoft.Hadoop.WebClient 
			
These commands add the libraries and references to the current Visual Studio project.

##<a id="prepare"></a> Preparing for the Tutorial

You must have a [Windows Azure subscription][free-trial], and a [Windows Azure Storage Account][create-storage-account] before you can proceed. You must also know your Windows Azure storage account name and account key. For the instructions on how to  get this information, see the *How to: View, copy and regenerate storage access keys* section of [How to Manage Storage Accounts](/en-us/manage/services/storage/how-to-manage-a-storage-account/).


You must also download the Actors.txt file used in this tutorial. Perform the following steps to download this file to your development environment:

1. Create a C:\Tutorials folder on your local computer.

2. Download [Actors.txt](http://www.microsoft.com/en-us/download/details.aspx?id=37003), and save the file to the C:\Tutorials folder.

##<a id="create"></a>Create the application

In this section you will learn how to upload files to Hadoop cluster programmatically and how to execute Hive jobs using LINQ to Hive.

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
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">SimpleHiveJob</td></tr>
	</table>

4. Click **OK** to create the project.


3. From the **Tools** menu, click **Library Package Manager**, click **Package Manager Console**.

4. Run the following commands in the console to install the packages.

		install-package Microsoft.Hadoop.Hive 
		install-package Microsoft.Hadoop.WebClient 

	These commands add .NET libraries and references to them to the current Visual Studio project.

6. From Solution Explorer, double-click **Program.cs** to open it.

7. Add the following using statements to the top of the file:

		using Microsoft.Hadoop.WebHDFS.Adapters;
		using Microsoft.Hadoop.WebHDFS;
		using Microsoft.Hadoop.Hive;
	
7. In the Main() function, copy and paste the following code:
		
		// Upload actors.txt to Blob Storage
		var asvAccount = [Storage account name];
		var asvKey = [Storage account key];
		var asvContainer = [Container name];
		var localFile = "C:/Tutorials/Actors.txt"
		var hadoopUser = [Hadoop user name]; // The HDInsight cluster user
		var hadoopUserPassword = [Hadoop user password]; // The HDInsight cluster user password
		var clusterURI = [HDInsight cluster URL]; //"https://HDInsightCluster Name.azurehdinsight.net";
		
		var storageAdapter = new BlobStorageAdapter(asvAccount, asvKey, asvContainer, true);
		var HDFSClient = new WebHDFSClient(hadoopUser, storageAdapter);
		
		Console.WriteLine("Creating MovieData directory and uploading actors.txt...");
		HDFSClient.CreateDirectory("/user/hadoop/MovieData").Wait();
		HDFSClient.CreateFile(localFile, "/user/hadoop/MovieData/Actors.txt").Wait();
		
		// Create Hive connection
		var hiveConnection = new HiveConnection(
		  new System.Uri(clusterURI),
		  hadoopUser, 
		  hadoopUserPassword,
		  asvAccount, 
		  asvKey);
		
		// Drop any existing tables called Actors
		// Only needed if you wish to rerun this application
		// and drop a previous Actors table.
		//hiveConnection.GetTable<HiveRow>("Actors").Drop();

		Console.WriteLine("Creating a Hive table named 'Actors'...");
		string command =
		  @"CREATE TABLE Actors(
		            MovieId string, 
		            ActorId string,
		            Name string, 
		            AwardsCount int) 
		            row format delimited fields 
		        terminated by ',';";
		hiveConnection.ExecuteHiveQuery(command).Wait();
		
		Console.WriteLine("Load data from Actors.txt into the 'Actors' table in Hive...");
		command =
		  @"LOAD DATA INPATH 
		        '/user/hadoop/MovieData/Actors.txt'
		    OVERWRITE INTO TABLE Actors;";
		hiveConnection.ExecuteHiveQuery(command).Wait();
		
		Console.WriteLine("Performing Hive query...");
		var result = hiveConnection.ExecuteQuery(@"select name, awardscount
		          from actors sort by awardscount desc
		          limit 1");
		result.Wait();

		Console.WriteLine("The results are: {0}", result.Result.ReadToEnd());
        Console.WriteLine("\nPress any key to continue.");
        Console.ReadKey();

##<a id="run"></a>Run the application

While the application is open in Visual Studio, press **F5** to run the application. A console window should open and display the steps executed by the application as data is uploaded, stored into a Hive table, and finally queried. Once the application is complete and the query results have been returned, press any key to terminate the application.

<div class="dev-callout">
<strong>Note</strong>
<p>Each step performed by the application may take seconds or even minutes to complete. The time to upload the Actors.txt file will vary based on your Internet connection to the Windows Azure data center (East US for the HDinsight Service preview), while the other steps are dependent on cluster size.</p>
</div>

<div class="dev-callout">
<strong>Note</strong>
<p>The LOAD DATA INPATH operation is a move operation that moves the Actors.txt data into the Hive-controlled file system namespace. This effectively removes the Actors.txt file from the upload location. Because of this, the Actors.txt file must be uploaded each time you run this application.</p>
<p>For more information on loading data into Hive, see <a href="https://cwiki.apache.org/confluence/display/Hive/GettingStarted#GettingStarted-DMLOperations">Hive GettingStarted</a>.</p>
</div>

##<a id="nextsteps"></a>Next Steps
Now you understand how to create a .NET application using HDInsight client SDK. To learn more, see the following articles:

* [Getting Started with Windows Azure HDInsight Service](/en-us/manage/services/hdinsight/get-started-hdinsight/)
* [Using Pig with HDInsight][hdinsight-pig] 
* [Using MapReduce with HDInsight][hdinsight-mapreduce]
* [Using Hive with HDInsight](/en-us/manage/services/hdinsight/using-hive/)

[hdinsight-pig]: /en-us/manage/services/hdinsight/using-pig-with-hdinsight/
[hdinsight-mapreduce]: /en-us/manage/services/hdinsight/using-mapreduce-with-hdinsight/



[free-trial]: http://www.windowsazure.com/en-us/pricing/free-trial/
[create-storage-account]: http://www.windowsazure.com/en-us/manage/services/storage/how-to-create-a-storage-account/


