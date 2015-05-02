<properties
	pageTitle="Set up and query HBase tables using Hive in HDInsight | Azure"
	description="Get started using HBase with Hadoop in HDInsight. Learn how to create HBase tables and query them using Hive."
	services="hdinsight"
	documentationCenter=""
	authors="mumian"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/09/2015"
	ms.author="jgao"/>



# Get started with Apache HBase in HDInsight

Learn how to create HBase tables and query HBase tables by using Hive in HDInsight.

HBase is a low-latency NoSQL database that allows online transactional processing of big data. HBase is offered as a managed cluster that is integrated into the Azure environment. The clusters are configured to store data directly in Azure Blob storage, which provides low latency and increased elasticity in performance and cost choices. This enables customers to build interactive websites that work with large datasets, to build services that store sensor and telemetry data from millions of end points, and to analyze this data with Hadoop jobs. For more information about HBase and the scenarios it can be used for, see [HDInsight HBase overview][hdinsight-hbase-overview].

> [AZURE.NOTE] HBase (version 0.98.0) is only available for use with HDInsight 3.1 clusters on HDInsight (based on Apache Hadoop and YARN 2.4.0). For version information, see [What's new in the Hadoop cluster versions provided by HDInsight?][hdinsight-versions]

## Prerequisites

Before you begin this tutorial, you must have the following:

- **An Azure subscription**: For more information about obtaining a subscription, see [Purchase Options][azure-purchase-options], [Member Offers][azure-member-offers], or [Free Trial][azure-free-trial].
- **An Azure storage account**: For instructions, see [How To Create a Storage Account][azure-create-storageaccount].
- **A workstation** with Visual Studio 2013 installed: For instructions, see [Installing Visual Studio](http://msdn.microsoft.com/library/e2h7fzkw.aspx).

## Provision an HBase cluster

[AZURE.INCLUDE [provisioningnote](../includes/hdinsight-provisioning.md)]

**To provision an HBase cluster by using the Azure portal**


1. Sign in to the [Azure portal][azure-management-portal].
2. Click **NEW** in the lower left, and then click **DATA SERVICES** > **HDINSIGHT** > **HBASE**.

	You can also use the CUSTOM CREATE option.
3. Enter **CLUSTER NAME**, **CLUSTER SIZE**, CLUSTER USER PASSWORD, and **STORAGE ACCOUNT**.

	![Choosing an HBase cluster type and entering cluster login credentials.][img-hdinsight-hbase-cluster-quick-create]

	The default HTTP USER NAME is admin. You can customize the name by using the CUSTOM CREATION option.

	> [AZURE.WARNING] For high availability of HBase services, you must provision a cluster that contains at least **three** nodes. This ensures that, if one node goes down, the HBase data regions are available on other nodes.

4. Click the checkmark icon in the lower right to create the HBase cluster.

>[AZURE.NOTE] After an HBase cluster is deleted, you can create another HBase cluster by using the same default blob. The new cluster will pick up the HBase tables you created in the original cluster.

## Create an HBase sample table from the HBase shell
This section describes how to use the HBase shell to create HBase tables, add rows, and list rows. To access the HBase shell, you must first enable Remote Desktop Protocol (RDP), and then make an RDP connection to the HBase cluster. For instructions, see [Manage Hadoop clusters in HDInsight using the Azure Portal][hdinsight-manage-portal].


**To use the HBase shell**

1. Within your RDP session, click the **Hadoop Command Line** shortcut located on the desktop.
2. Change the folder to the HBase home directory:

		cd %HBASE_HOME%\bin
3. Open the HBase shell:

		hbase shell

4. Create an HBase with one column family and insert a row:

		create 'sampletable', 'cf1'
		put 'sampletable', 'row1', 'cf1:col1', 'value1'
		scan 'sampletable'

	For more information about the Hbase table schema, see [Introduction to HBase Schema Design][hbase-schema]. For more HBase commands, see [Apache HBase reference guide][hbase-quick-start].
5. List the HBase tables:

		list

**Check cluster status in the HBase WebUI**

HBase also ships with a WebUI that you can use to help monitor your cluster. For example, you could request statistics or information about regions. On the HBase cluster, you can find the WebUI under the address of the zookeepernode:


	http://zookeepernode:60010/master-status

In a high availability cluster, you will find a link to the current active HBase master node that is hosting the WebUI.

**Bulk load a sample table**

1. From the HBase shell, create an HBase table with two column families:

		create 'Contacts', 'Personal', 'Office'


3. Create a contacts list that contains the following data, and upload it to a folder called /tmp/contacts.txt in Azure Blob storage. For the instructions, see [Upload data for Hadoop jobs in HDInsight][hdinsight-upload-data].

		8396	Calvin Raji	230-555-0191	5415 San Gabriel Dr.
		16600	Karen Wu	646-555-0113	9265 La Paz
		4324	Karl Xie	508-555-0163	4912 La Vuelta
		16891	Jonathan Jackson	674-555-0110	40 Ellis St.
		3273	Miguel Miller	397-555-0155	6696 Anchor Drive
		3588	Osarumwense Agbonile	592-555-0152	1873 Lion Circle
		10272	Julia Lee	870-555-0110	3148 Rose Street
		4868	Jose Hayes	599-555-0171	793 Crawford Street
		4761	Caleb Alexander	670-555-0141	4775 Kentucky Dr.
		16443	Terry Chander	998-555-0171	771 Northridge Drive

2. In a Hadoop command line, change the folder to the HBase home directory:

		cd %HBASE_HOME%\bin

3. Run ImportTsv. ImportTsv is a tool that will load data in TSV format into HBase. It has two distinct usages: loading data from TSV format in the Hadoop distributed file system (HDFS) into HBase, and preparing files to be loaded. For more information, see [Apache HBase reference guide][hbase-reference].

		hbase org.apache.hadoop.hbase.mapreduce.ImportTsv -Dimporttsv.columns="HBASE_ROW_KEY,Personal:Name, Personal:HomePhone, Office:Address" -Dimporttsv.bulk.output=/tmpOutput Contacts /tmp/contacts.txt

4. Load the output from the prior command into HBase:

		hbase org.apache.hadoop.hbase.mapreduce.LoadIncrementalHFiles /tmpOutput Contacts

## Use Hive to query an HBase table

Now that you have provisioned an HBase cluster and created an HBase table, you can query data in the table by using Hive. This section creates a Hive table that maps to the HBase table and uses it to query the data in your HBase table.

**To open the cluster dashboard**

1. Sign in to the [Azure portal][azure-management-portal].
2. Click **HDINSIGHT** in the left pane. You will see a list of clusters, including the one you created in the last section.
3. Click the cluster name where you want to run the Hive job.
4. Click **QUERY CONSOLE** at the bottom of the page to open the cluster dashboard. It opens a webpage in a different browser tab.
5. Enter the Hadoop user account user name and password. The default user name is **admin** and the password is what you entered during the provisioning process. A new browser tab opens.
6. Click **Hive Editor** at the top of the page. The Hive Editor looks like this:

	![HDInsight cluster dashboard.][img-hdinsight-hbase-hive-editor]





























**To run Hive queries**

1. Enter the following HiveQL script into Hive Editor and click **SUBMIT** to create an Hive Table that maps to the HBase table. Make sure that you have created the sample table referenced earlier in this tutorial by using the HBase shell before you run this statement.

		CREATE EXTERNAL TABLE hbasecontactstable(rowkey STRING, name STRING, homephone STRING, office STRING)
		STORED BY 'org.apache.hadoop.hive.hbase.HBaseStorageHandler'
		WITH SERDEPROPERTIES ('hbase.columns.mapping' = ':key,Personal:Name,Personal:HomePhone,Office:Address')
		TBLPROPERTIES ('hbase.table.name' = 'Contacts');

	Wait until the **Status** updates to **Completed**.

2. Enter the following HiveQL script into Hive Editor, and then click **SUBMIT**. The Hive query queries the data in the HBase table:

     	SELECT count(*) FROM hbasecontactstable;

4. To retrieve the results of the Hive query, click the **View Details** link in the **Job Session** window when the job finishes running. There will be only one job output file because you put one record into the HBase table.




**To browse the output file**

1. In the Query Console, click **File Browser**.
2. Click the Azure storage account that is used as the default file system for the HBase cluster.
3. Click the HBase cluster name. The default Azure storage account container uses the cluster name.
4. Click **User**, and then click **Admin**. (This is the Hadoop user name.)
6. Click the job name with the **Last Modified** time that matches the time when the SELECT Hive query ran.
4. Click **stdout**. Save the file and open the file with Notepad. There will be one output file.

	![HDInsight HBase Hive Editor File Browser][img-hdinsight-hbase-file-browser]

## Use the HBase REST API client library for .NET C#  to create and retrieve data from an HBase table

You must download the HBase REST API client library for .NET from GitHub and build the project so that you can use the HBase .NET SDK. The following procedure includes the instructions for this task.

1. Create a new C# Visual Studio Windows Desktop Console application.
2. Open the NuGet Package Manager Console by clicking the **TOOLS** menu > **NuGet Package Manager** > **Package Manager Console**.
3. Run the following NuGet command in the console:

		Install-Package Microsoft.HBase.Client

5. Add the following **using** statements at the top of the file:

		using Microsoft.HBase.Client;
		using org.apache.hadoop.hbase.rest.protobuf.generated;

6. Replace the **Main** function with the following:

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

7. Set the first three variables in the **Main** function.
8. Press **F5** to run the application.



## What's next?
In this tutorial, you learned how to provision an HBase cluster and how to create tables and view the data in those tables from the HBase shell. You also learned how use Hive to query the data in HBase tables and how to use the HBase C# REST APIs to create an HBase table and retrieve data from the table.

To learn more, see:

- [HDInsight HBase overview][hdinsight-hbase-overview]:
HBase is an Apache, open-source, NoSQL database built on Hadoop that provides random access and strong consistency for large amounts of unstructured and semistructured data.
- [Provision HBase clusters on Azure Virtual Network][hdinsight-hbase-provision-vnet]:
With virtual network integration, HBase clusters can be deployed to the same virtual network as your applications so that applications can communicate with HBase directly.
- [Configure HBase replication in HDInsight](hdinsight-hbase-geo-replication.md): Learn how to configure HBase replication across two Azure datacenters. 
- [Analyze Twitter sentiment with HBase in HDInsight][hbase-twitter-sentiment]:
Learn how to do real-time [sentiment analysis](http://en.wikipedia.org/wiki/Sentiment_analysis) of big data by using HBase in a Hadoop cluster in HDInsight.

[hdinsight-manage-portal]: hdinsight-administer-use-management-portal.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hbase-reference]: http://hbase.apache.org/book.html#importtsv
[hbase-schema]: http://0b4af6cdc2f0c5998459-c0245c5c937c5dedcca3f1764ecc9b2f.r43.cf2.rackcdn.com/9353-login1210_khurana.pdf
[hbase-quick-start]: http://hbase.apache.org/book.html#quickstart





[hdinsight-hbase-overview]: hdinsight-hbase-overview.md
[hdinsight-hbase-provision-vnet]: hdinsight-hbase-provision-vnet.md
[hdinsight-versions]: hdinsight-component-versioning.md
[hbase-twitter-sentiment]: hdinsight-hbase-analyze-twitter-sentiment.md
[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[azure-management-portal]: https://manage.windowsazure.com/
[azure-create-storageaccount]: http://azure.microsoft.com/documentation/articles/storage-create-storage-account/

[img-hdinsight-hbase-cluster-quick-create]: ./media/hdinsight-hbase-get-started/hdinsight-hbase-quick-create.png
[img-hdinsight-hbase-hive-editor]: ./media/hdinsight-hbase-get-started/hdinsight-hbase-hive-editor.png
[img-hdinsight-hbase-file-browser]: ./media/hdinsight-hbase-get-started/hdinsight-hbase-file-browser.png
