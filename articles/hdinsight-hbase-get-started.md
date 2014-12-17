<properties urlDisplayName="Get Started" pageTitle="Set up and query HBase tables using Hive in HDInsight | Azure" metaKeywords="" description="Get started using HBase with Hadoop in HDInsight. Learn how to create HBase tables and query them using Hive." metaCanonical="" services="hdinsight" documentationCenter="" title="Set up HBase clusters and query them using Hive on Hadoop in HDInsight" authors="bradsev" solutions="big-data" manager="paulettm" editor="cgronlun" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="12/9/2014" ms.author="bradsev" />



# Set up HBase clusters and query them using Hive on Hadoop in HDInsight

Learn how to create and query HBase tables using Hive on Hadoop in HDInsight. 

##In this article

* [What is HBase?](#hbaseintro)
* [Prerequisites](#prerequisites)
* [Provision HBase clusters using Azure Management portal](#create-hbase-cluster)
* [Mange HBase tables using HBase shell](#create-sample-table)
* [Use HiveQL to query HBase tables](#hive-query)
* [Use the Microsoft HBase REST client library to manage HBase tabels](#hbase-powershell)
* [See also](#seealso)

##<a name="hbaseintro"></a>What is HBase?

HBase is a low-latency NoSQL database that allows online transactional processing of big data. HBase is offered as a managed cluster integrated into the Azure environment. The clusters are configured to store data directly in Azure Blob storage, which provides low latency and increased elasticity in performance/cost choices. This enables customers to build interactive websites that work with large datasets, to build services that store sensor and telemetry data from millions of end points, and to analyze this data with Hadoop jobs. For more information on HBase and the scenarios it can be used for, see [HDInsight HBase overview](http://azure.microsoft.com/en-us/documentation/articles/hdinsight-hbase-overview/).

> [WACOM.NOTE] HBase (version 0.98.0) is only available for use with HDInsight 3.1 clusters on HDInsight (based on Apache Hadoop and YARN 2.4.0). For version information, see [What's new in the Hadoop cluster versions provided by HDInsight?][hdinsight-versions]

##<a name="prerequisites"></a>Prerequisites

Before you begin this tutorial, you must have the following:

- **An Azure subscription** For more information about obtaining a subscription, see [Purchase Options][azure-purchase-options], [Member Offers][azure-member-offers], or [Free Trial][azure-free-trial].
- **An Azure storage account** For instructions, see [How To Create a Storage Account][azure-create-storageaccount].
- **A workstation** with Visual Studio 2013 installed. For instructions, see [Installing Visual Studio](http://msdn.microsoft.com/en-us/library/e2h7fzkw.aspx).
- Download the [Microsoft HBase REST Client Library for .NET](https://github.com/hdinsight/hbase-sdk-for-net). 


##<a name="create-hbase-cluster"></a>Provision an HBase cluster on the Azure portal

This section describes how to provision an HBase cluster using the Azure portal.


[WACOM.INCLUDE [provisioningnote](../includes/hdinsight-provisioning.md)]

**To provision an HDInsight cluster in the Azure portal** 


1. Sign in to the [Azure Management Portal][azure-management-portal]. 

2. Click **HDInsight** on the left to list the status of the clusters in your account and then the **+NEW** icon on the lower left. 

	![Creating an HBase cluster in HDInsight in the Azure portal.](http://i.imgur.com/PmGynKZ.jpg)

3. Click on the HDInsight icon in the second column from the left and then the HBase option in the next column. Specify the values for the CLUSTERNAME and CLUSTER SIZE, the name of the Storage Account, and a password for the new HBase cluster.
 
	![Choosing and HBase cluster type and entering cluster login credentials.](http://i.imgur.com/ecxbB9K.jpg)

4. Click on the check icon on the lower left to create the HBase cluster.


##<a name="create-sample-table"></a>Create an HBase sample table from the HBase shell
This section describes how to enable and use the Remote Desktop Protocol (RDP) to access the HBase shell and then use it to create an HBase sample table, add rows, and then list the rows in the table.

It assumes you have completed the procedure outlined in the first section, and so have already successfully created an HBase cluster.

**Enable the RDP connection to the HBase cluster**

1. To enable a Remote Desktop Connection to the HDInsight cluster, select the HBase cluster you have created and click the **CONFIGURATION** tab. Click the **ENABLE REMOTE** button at the bottom of the page to enable the RDP connection to the cluster.
2. Provide the credentials and expiration date on the **CONFIGURE REMOTE DESKTOP** wizard and click the checked circle on the lower right. (It might take a few minutes for the operation to complete.)
3. To connect to the HDInsight cluster, click on the **CONNECT** button at the bottom of the **CONFIGURATION** tab.

 
**Open the HBase Shell**

1. Within your RDP session, click on the **Hadoop Command Prompt** shortcut located on the desktop.

2. Change the folder to the HBase home directory:
		
		cd %HBASE_HOME%\bin

3. Open the HBase shell:

		hbase shell


**Create a sample table, add data and retrieve the data**

1. Create a sample table:

		create 'sampletable', 'cf1'

2. Add a row to the sample table:

		put 'sampletable', 'row1', 'cf1:col1', 'value1'

3. List the rows in the sample table:
	
		scan 'sampletable'

##<a name="hive-query"></a>Use Hive to query an HBase table

Now you have an HBase cluster provisioned and have created a table, you can query it using Hive. This section creates a Hive table that maps to the HBase table and uses it to queries the data in your HBase table.

**To open cluster dashboard**

1. Sign in to the [Azure Management Portal][azure-management-portal]. 
2. Click **HDINSIGHT** from the left pane. You shall see a list of clusters created including the one you just created in the last section.
3. Click the cluster name where you want to run the Hive job.
4. Click **MANAGE CLUSTER** from the bottom of the page to open cluster dashboard. It opens a Web page on a different browser tab.   
5. Enter the Hadoop User account username and password.  The default username is **admin**, the password is what you entered during the provision process.  The dashboard looks like :

	![HDInsight cluster dashboard.](http://i.imgur.com/tMwXlj9.jpg)


**To run an Hive query**

1. To create a Hive Table with a mapping to HBase table, enter HiveQL script below into Hive console window and click **SUBMIT** button. Make sure that you have created the sampletable referenced here in HBase using the HBase Shell before executing this statement.
 
    	CREATE EXTERNAL TABLE hbasesampletable(rowkey STRING, col1 STRING, col2 STRING)
    	STORED BY 'org.apache.hadoop.hive.hbase.HBaseStorageHandler'
    	WITH SERDEPROPERTIES ('hbase.columns.mapping' = ':key,cf1:col1,cf1:col2')
    	TBLPROPERTIES ('hbase.table.name' = 'sampletable');

 
2. To execute a Hive Query Over the Data in HBase, enter the HiveQL script below into Hive console window and click **SUBMIT** button.

     	SELECT count(*) FROM hbasesampletable;
 
4. To retrieve the results of the Hive query, click on the **View Details** link in the **Job Session** window when the job finishes executing.


Note: The HBase shell link switches the tab to the **HBase Shell**.



**To browse the output file**

1. From the cluster dashboard, click **Files** from the top.
2. Click **Templeton-Job-Status**.
3. Click the GUID number which has the last Modified time a little after the Job Start Time you wrote down earlier. Make a note of this GUID.  You will need it in the next section.
4. The **stdout** file has the data you need in the next section. You can click **stdout** to download a copy of the data file if you want.

	
##<a name="hbase-powershell"></a>Use HBase REST Client Library for .NET C# APIs to create an HBase table and retrieve data from the table

The Microsoft HBase REST Client Library for .NET project must be downloaded from GitHub and the project built to use the HBase .NET SDK. The following procedure includes the instructions for this task.

1. Downnload [Microsoft HBase REST Client Library for .NET](https://github.com/hdinsight/hbase-sdk-for-net) if you have not already satisfied this prerequisite.

2. Open Marlin.sln up in Visual Studio (**File** -> **Open** -> **Project/Solution ...**) from the location that it was downloaded to. Select **View** -> **Solution Explorer** to see the 'Marlin' solution and its Microsoft.HBase.Client project. Build the **Marlin** project by right-clicking on the it in the **Solution Explorer** and selecting **Build Solution**. 

4. Create an new Visual C# Console Application. Retrieve the resulting Microsoft.HBase.Client.dll and protobuf.dll built (from the ...\bin\debug\Microsoft.HBase.Client directory) and add them to your C# project: Right-click on **References**, select **Add References...**, browse to the two assemblies, and upload them. [protobuf-net](http://code.google.com/p/protobuf-net/) is a .NET implementation of the Google's Protocol Buffers binary serializer used for data communication.

5. Add the following using statements on the top of the file:
		
		using Microsoft.HBase.Client;
		using org.apache.hadoop.hbase.rest.protobuf.generated;

6. Create a new instance of an HBase client using the cluster credentials and retrieve the cluster version:

		// Create a new instance of an HBase client.
		var creds = new ClusterCredentials(new Uri("https://myclustername.azurehdinsight.net"), "myusername", "mypassword");
		var client = new HBaseClient(creds);

		// Retrieve the cluster version
		var version = client.GetVersion();
		Console.WriteLine(version);

7. To create a new HBase table, use this code:

		// Create a new HBase table.
		var testTableSchema = new TableSchema();
		testTableSchema.name = "mytablename";
		testTableSchema.columns.Add(new ColumnSchema() { name = "d" });
		testTableSchema.columns.Add(new ColumnSchema() { name = "f" });
		client.CreateTable(testTableSchema);

8. Insert data into a table with this code:

		// Insert data into a table.
		var tableName = "mytablename";
		var testKey = "content";
		var testValue = "the force is strong in this column";
		var set = new CellSet();
		var row = new CellSet.Row { key = Encoding.UTF8.GetBytes(testKey) };
		set.rows.Add(row);

		var value = new Cell { column = Encoding.UTF8.GetBytes("d:starwars"), data = Encoding.UTF8.GetBytes(testValue) };
		row.values.Add(value);
		client.StoreCells(tableName, set);

9. To retrieve a cell with its key, use this code. 

		// Retrieve a cell with its key.
		var testKey = "content";
		var tableName = "mytablename";

		var cells = client.GetCells(tableName, testKey);
		// get the first value from the row.
		.WriteLine(Encoding.UTF8.GetString(cells.rows[0].values[0].data));
		// with the previous insert, it should yield: "the force is strong in this column"

10. Scan over rows in a table with the following code:

		//Scan over rows in a table.
		var creds = new ClusterCredentials(new Uri("https://myclustername.azurehdinsight.net"), "myusername", "mypassword");
		var client = new HBaseClient(creds);

		var tableName = "mytablename";

		// assume the table has integer keys and we want data between keys 25 and 35
		var scanSettings = new Scanner()
		{
    		batch = 10,
    		startRow = BitConverter.GetBytes(25),
    		endRow = BitConverter.GetBytes(35)
		};

		var scannerInfo = client.CreateScanner(tableName, scanSettings);
		CellSet next = null;
		while ((next = client.ScannerGetNext(scannerInfo)) != null)
		{
    		foreach (var row in next.rows)
    		{
        		// ... read the rows
    		}
		}



##<a name="summary"></a>Summary
In this tutorial, you have learned how to provision an HBase cluster, how to create tables, and and view the data in those tables from the HBase shell. You also learned how use Hive to query the data in HBase tables and how to use the HBase C# APIs to create an HBase table and retrieve data from the table.

##<a name="next"></a> What's Next?

[HDInsight HBase overview][hdinsight-hbase-overview]:
HBase is an Apache open source NoSQL database built on Hadoop that provides random access and strong consistency for large amounts of unstructured and semi-structured data.

[Provision HBase clusters on Azure Virtual Network][hdinsight-hbase-provision-vnet]:
With the virtual network integration, HBase clusters can be deployed to the same virtual network as your applications so that applications can communicate with HBase directly.

[Analyze Twitter sentiment with HBase in HDInsight][hbase-twitter-sentiment]:
Learn how to do real-time [sentiment analysis](http://en.wikipedia.org/wiki/Sentiment_analysis) of big data using HBase in an Hadoop cluster in HDInsight.

[hdinsight-hbase-overview]: ../hdinsight-hbase-overview/
[hdinsight-hbase-provision-vnet]: ../hdinsight-hbase-provision-vnet
[hdinsight-versions]: ../hdinsight-component-versioning/

[hdinsight-get-started-30]: ../hdinsight-get-started-30/

[hdinsight-admin-powershell]: ../hdinsight-administer-use-powershell/

[hbase-twitter-sentiment]: ../hdinsight-hbase-analyze-twitter-sentiment/

[hdinsight-use-hive]: ../hdinsight-use-hive/

[hdinsight-storage]: ../hdinsight-use-blob-storage/



[azure-purchase-options]: http://azure.microsoft.com/en-us/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/en-us/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/en-us/pricing/free-trial/
[azure-management-portal]: https://manage.windowsazure.com/
[azure-create-storageaccount]: http://azure.microsoft.com/en-us/documentation/articles/storage-create-storage-account/ 

[apache-hadoop]: http://hadoop.apache.org/

[powershell-download]: http://go.microsoft.com/fwlink/p/?linkid=320376&clcid=0x409
[powershell-install-configure]: ../install-configure-powershell/
[powershell-open]: ../install-configure-powershell/#Install


[img-hdi-dashboard]: ./media/hdinsight-get-started/HDI.dashboard.png
[img-hdi-dashboard-query-select]: ./media/hdinsight-get-started/HDI.dashboard.query.select.png
[img-hdi-dashboard-query-select-result]: ./media/hdinsight-get-started/HDI.dashboard.query.select.result.png






