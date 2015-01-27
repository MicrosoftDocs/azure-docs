<properties 
	pageTitle="Set up and query HBase tables using Hive in HDInsight | Azure" 
	description="Get started using HBase with Hadoop in HDInsight. Learn how to create HBase tables and query them using Hive." 
	services="hdinsight" 
	documentationCenter="" 
	authors="bradsev" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="hdinsight" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="1/7/2015" 
	ms.author="bradsev"/>



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

HBase is a low-latency NoSQL database that allows online transactional processing of big data. HBase is offered as a managed cluster integrated into the Azure environment. The clusters are configured to store data directly in Azure Blob storage, which provides low latency and increased elasticity in performance/cost choices. This enables customers to build interactive websites that work with large datasets, to build services that store sensor and telemetry data from millions of end points, and to analyze this data with Hadoop jobs. For more information on HBase and the scenarios it can be used for, see [HDInsight HBase overview][hdinsight-hbase-overview].

> [AZURE.NOTE] HBase (version 0.98.0) is only available for use with HDInsight 3.1 clusters on HDInsight (based on Apache Hadoop and YARN 2.4.0). For version information, see [What's new in the Hadoop cluster versions provided by HDInsight?][hdinsight-versions]

##<a name="prerequisites"></a>Prerequisites

Before you begin this tutorial, you must have the following:

- **An Azure subscription** For more information about obtaining a subscription, see [Purchase Options][azure-purchase-options], [Member Offers][azure-member-offers], or [Free Trial][azure-free-trial].
- **An Azure storage account** For instructions, see [How To Create a Storage Account][azure-create-storageaccount].
- **A workstation** with Visual Studio 2013 installed. For instructions, see [Installing Visual Studio](http://msdn.microsoft.com/en-us/library/e2h7fzkw.aspx).

##<a name="create-hbase-cluster"></a>Provision an HBase cluster on the Azure portal

This section describes how to provision an HBase cluster using the Azure Management portal.


[AZURE.INCLUDE [provisioningnote](../includes/hdinsight-provisioning.md)]

**To provision an HDInsight cluster in the Azure Management portal** 


1. Sign in to the [Azure Management Portal][azure-management-portal]. 
2. Click **NEW** on the lower left, and then click **DATA SERVICES**, **HDINSIGHT**, **HBASE**. 
3. Enter **CLUSTER NAME**, **CLUSTER SIZE**, CLUSTER USER PASSWORD, and **STORAGE ACCOUNT**.
 
	![Choosing and HBase cluster type and entering cluster login credentials.][img-hdinsight-hbase-cluster-quick-create]

4. Click on the check icon on the lower left to create the HBase cluster.


##<a name="create-sample-table"></a>Create an HBase sample table from the HBase shell
This section describes how to enable and use the Remote Desktop Protocol (RDP) to access the HBase shell and then use it to create an HBase sample table, add rows, and then list the rows in the table.

It assumes you have completed the procedure outlined in the first section, and so have already successfully created an HBase cluster.

**To enable the RDP connection to the HBase cluster**

1. From the Management portal, click **HDINSIGHT** from the left to view the list of the existing clusters.
2. Click the HBase cluster where you want to open HBase Shell.
3. Click **CONFIGURATION** from the top.
4. Click **ENABLE REMOTE** from the bottom.
5. Enter the RDP user name and password.  The user name must be different from the cluster user name you used when provisioning the cluster. The **EXPIRES ON** data can be up to seven days from today.
6. Click the check on the lower right to enable remote desktop.
7. After the RPD is enabled, click **CONNECT** from the bottom of the **CONFIGURATION** tab, and follow the instructions.

 
**To open the HBase Shell**

1. Within your RDP session, click on the **Hadoop Command Line** shortcut located on the desktop.

2. Change the folder to the HBase home directory:
		
		cd %HBASE_HOME%\bin

3. Open the HBase shell:

		hbase shell


**To create a sample table, add data and retrieve the data**

1. Create a sample table:

		create 'sampletable', 'cf1'

2. Add a row to the sample table:

		put 'sampletable', 'row1', 'cf1:col1', 'value1'

3. List the rows in the sample table:
	
		scan 'sampletable'

**Check cluster status in the HBase WebUI**
	
HBase also ships with a WebUI that helps monitoring your cluster, for example by providing request statistics or information about regions. On the HBase cluster you can find the WebUI under the address of the zookeepernode.


	http://zookeepernode:60010/master-status
	
In a HighAvailability (HA) cluster, you will find a link to the current active HBase master node hosting the WebUI.

**Bulk load a sample table**

1. Create samplefile1.txt containing the following data, and upload to Azure Blob Storage to /tmp/samplefile1.txt:

		row1	c1	c2
		row2	c1	c2
		row3	c1	c2
		row4	c1	c2
		row5	c1	c2
		row6	c1	c2
		row7	c1	c2
		row8	c1	c2
		row9	c1	c2
		row10    c1	c2

2. Change the folder to the HBase home directory:
		
		cd %HBASE_HOME%\bin

3. Execute ImportTsv:

		hbase org.apache.hadoop.hbase.mapreduce.ImportTsv -Dimporttsv.columns="HBASE_ROW_KEY,a:b,a:c" -Dimporttsv.bulk.output=/tmpOutput sampletable2 /tmp/samplefile1.txt

4. Load the output from prior command into HBase:

		hbase org.apache.hadoop.hbase.mapreduce.LoadIncrementalHFiles /tmpOutput sampletable2



##<a name="hive-query"></a>Use Hive to query an HBase table

Now you have an HBase cluster provisioned and have created an HBase table, you can query it using Hive. This section creates a Hive table that maps to the HBase table and uses it to queries the data in your HBase table.

**To open cluster dashboard**

1. Sign in to the [Azure Management Portal][azure-management-portal]. 
2. Click **HDINSIGHT** from the left pane. You shall see a list of clusters created including the one you just created in the last section.
3. Click the cluster name where you want to run the Hive job.
4. Click **QUERY CONSOLE** from the bottom of the page to open cluster dashboard. It opens a Web page on a different browser tab.   
5. Enter the Hadoop User account username and password.  The default username is **admin**, the password is what you entered during the provision process. A new browser tab is opened. 
6. Click **Hive Editor** from the top. The Hive Editor looks like :

	![HDInsight cluster dashboard.][img-hdinsight-hbase-hive-editor]





























**To run Hive queries**

1. Enter the HiveQL script below into Hive Editor and click **SUBMIT** to create an Hive Table mapping to the HBase table. Make sure that you have created the sampletable table referenced here in HBase using the HBase Shell before executing this statement.
 
    	CREATE EXTERNAL TABLE hbasesampletable(rowkey STRING, col1 STRING, col2 STRING)
    	STORED BY 'org.apache.hadoop.hive.hbase.HBaseStorageHandler'
    	WITH SERDEPROPERTIES ('hbase.columns.mapping' = ':key,cf1:col1,cf1:col2')
    	TBLPROPERTIES ('hbase.table.name' = 'sampletable');

	Wait until the **Status** is updated to **Completed**.
 
2. Enter the HiveQL script below into Hive Editor, and then click **SUBMIT** button. The Hive query queries the data in the HBase table:

     	SELECT count(*) FROM hbasesampletable;
 
4. To retrieve the results of the Hive query, click on the **View Details** link in the **Job Session** window when the job finishes executing. The Job Output shall be 1 because you only put one record into the HBase table.




**To browse the output file**

1. From Query Console, click **File Browser** from the top.
2. Click the Azure Storage account used as the default file system for the HBase cluster.
3. Click the HBase cluster name. The default Azure storage account container uses the cluster name.
4. Click **user**.
5. Click **admin**. This is the Hadoop user name.
6. Click the job name with the **Last Modified** time matching the time when the SELECT Hive query ran.
4. Click **stdout**. Save the file and open the file with Notepad. The output shall be 1.

	![HDInsight HBase Hive Editor File Browser][img-hdinsight-hbase-file-browser]
	
##<a name="hbase-powershell"></a>Use HBase REST Client Library for .NET C# APIs to create an HBase table and retrieve data from the table

The Microsoft HBase REST Client Library for .NET project must be downloaded from GitHub and the project built to use the HBase .NET SDK. The following procedure includes the instructions for this task.

1. Create a new C# Visual Studio Windows Desktop Console application.
2. Open NuGet Package Manager Console by click the **TOOLS** menu, **NuGet Package Manager**, **Package Manager Console**.
3. Run the following NuGet command in the console:

	Install-Package Microsoft.HBase.Client

5. Add the following using statements on the top of the file:
		
		using Microsoft.HBase.Client;
		using org.apache.hadoop.hbase.rest.protobuf.generated;

6. Replace the Main function with the following:

        static void Main(string[] args)
        {
            string clusterURL = "https://<yourHBaseClusterName>.azurehdinsight.net";
            string hadoopUsername= "<yourHadoopUsername>";
            string hadoopUserPassword = "<yourHadoopUserPassword>";

            string hbaseTableName = "sampleHbaseTable";

            // Create a new instance of an HBase client.
            ClusterCredentials creds = new ClusterCredentials(new Uri(clusterURL), hadoopUsername, hadoopUserPassword);
            HBaseClient hbaseClient = new HBaseClient(creds);

            // Retrieve the cluster version
            var version = hbaseClient.GetVersion();
            Console.WriteLine("The HBase cluster version is " + version);

            // Create a new HBase table.
            TableSchema testTableSchema = new TableSchema();
            testTableSchema.name = hbaseTableName;
            testTableSchema.columns.Add(new ColumnSchema() { name = "d" });
            testTableSchema.columns.Add(new ColumnSchema() { name = "f" });
            hbaseClient.CreateTable(testTableSchema);

            // Insert data into the HBase table.
            string testKey = "content";
            string testValue = "the force is strong in this column";
            CellSet cellSet = new CellSet();
            CellSet.Row cellSetRow = new CellSet.Row { key = Encoding.UTF8.GetBytes(testKey) };
            cellSet.rows.Add(cellSetRow);

            Cell value = new Cell { column = Encoding.UTF8.GetBytes("d:starwars"), data = Encoding.UTF8.GetBytes(testValue) };
            cellSetRow.values.Add(value);
            hbaseClient.StoreCells(hbaseTableName, cellSet);

            // Retrieve a cell by its key.
            cellSet = hbaseClient.GetCells(hbaseTableName, testKey);
            Console.WriteLine("The data with the key '" + testKey + "' is: " + Encoding.UTF8.GetString(cellSet.rows[0].values[0].data));
            // with the previous insert, it should yield: "the force is strong in this column"

		    //Scan over rows in a table. Assume the table has integer keys and you want data between keys 25 and 35. 
		    Scanner scanSettings = new Scanner()
		    {
    		    batch = 10,
    		    startRow = BitConverter.GetBytes(25),
    		    endRow = BitConverter.GetBytes(35)
		    };

		    ScannerInformation scannerInfo = hbaseClient.CreateScanner(hbaseTableName, scanSettings);
		    CellSet next = null;
            Console.WriteLine("Scan results");

            while ((next = hbaseClient.ScannerGetNext(scannerInfo)) != null)
		    {
    		    foreach (CellSet.Row row in next.rows)
    		    {
                    Console.WriteLine(row.key + " : " + Encoding.UTF8.GetString(row.values[0].data));
    		    }
		    }

            Console.WriteLine("Press ENTER to continue ...");
            Console.ReadLine();
        }

7. Set the first three variables in the Main function.
8. Press **F5** to run the application.



##<a name="next"></a> What's Next?
In this tutorial, you have learned how to provision an HBase cluster, how to create tables, and and view the data in those tables from the HBase shell. You also learned how use Hive to query the data in HBase tables and how to use the HBase C# APIs to create an HBase table and retrieve data from the table. 

To learn more, see:

- [HDInsight HBase overview][hdinsight-hbase-overview]:
HBase is an Apache open source NoSQL database built on Hadoop that provides random access and strong consistency for large amounts of unstructured and semi-structured data.
- [Provision HBase clusters on Azure Virtual Network][hdinsight-hbase-provision-vnet]:
With the virtual network integration, HBase clusters can be deployed to the same virtual network as your applications so that applications can communicate with HBase directly.
- [Analyze Twitter sentiment with HBase in HDInsight][hbase-twitter-sentiment]:
Learn how to do real-time [sentiment analysis](http://en.wikipedia.org/wiki/Sentiment_analysis) of big data using HBase in an Hadoop cluster in HDInsight.

[hdinsight-hbase-overview]: ../hdinsight-hbase-overview/
[hdinsight-hbase-provision-vnet]: ../hdinsight-hbase-provision-vnet
[hdinsight-versions]: ../hdinsight-component-versioning/
[hbase-twitter-sentiment]: ../hdinsight-hbase-analyze-twitter-sentiment/
[azure-purchase-options]: http://azure.microsoft.com/en-us/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/en-us/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/en-us/pricing/free-trial/
[azure-management-portal]: https://manage.windowsazure.com/
[azure-create-storageaccount]: http://azure.microsoft.com/en-us/documentation/articles/storage-create-storage-account/ 

[img-hdinsight-hbase-cluster-quick-create]: ./media/hdinsight-hbase-get-started/hdinsight-hbase-quick-create.png
[img-hdinsight-hbase-hive-editor]: ./media/hdinsight-hbase-get-started/hdinsight-hbase-hive-editor.png
[img-hdinsight-hbase-file-browser]: ./media/hdinsight-hbase-get-started/hdinsight-hbase-file-browser.png








