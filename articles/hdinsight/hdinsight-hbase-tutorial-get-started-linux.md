<properties
	pageTitle="HBase tutorial: Get started with HBase in Hadoop | Microsoft Azure"
	description="Follow this HBase tutorial to get started using Apache HBase with Linux-based Hadoop in HDInsight. Create tables from the HBase shell and query them using Hive."
	services="hdinsight"
	documentationCenter=""
	authors="Blackmist"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="08/18/2015"
	ms.author="larryfr"/>



# HBase tutorial: Get started using Apache HBase with Hadoop in HDInsight

Learn how to provision an HBase cluster in HDInsight, create HBase tables, and query the tables by using Hive. For general HBase information, see [HDInsight HBase overview][hdinsight-hbase-overview].

[AZURE.INCLUDE [hdinsight-azure-preview-portal](../../includes/hdinsight-azure-preview-portal.md)]

* [HBase tutorial: Get started using Apache HBase with Hadoop in HDInsight](hdinsight-hbase-tutorial-get-started-v1.md)

> [AZURE.NOTE] This article uses a Linux-based HDInsight cluster. For information on using HBase with a Windows-based cluster, see [Get started using Apache HBase with Hadoop in HDInsight (Windows)](hdinsight-hbase-tutorial-get-started.md)

##Prerequisites

Before you begin this HBase tutorial, you must have the following:

- **An Azure subscription**. See [Get Azure free trial](http://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).

* **An SSH client**. See one of the following articles for more information on using SSH with HDInsight:
 
    - [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md)
    
    - [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)

## HBase data storage

If you are familiar with Relational Database Management Systems (RDBMS,) you may be used to thinking of data in purely tabular format:

![hdinsight hbase tabular data][img-hbase-sample-data-tabular]

In HBase which is an implementation of BigTable, the same data looks like:

![hdinsight hbase bigtable data][img-hbase-sample-data-bigtable]

This type of data storage is usually called a [Column Family].

The basic design concept behind a column family data store is that related data is stored within a family. When querying data, searches within a family are faster as the search is scoped to just the column family instead of the entire table.

## Provision an HBase cluster

1. Sign in to the [Azure preview portal](https://portal.azure.com).

2. Click **New** in the upper left corner, and then click **Data + Analytics**, **HDInsight**.

3. Enter the following values:

	- **Cluster Name**: enter a name to identify this cluster.
	
	- **Cluster Type**: HBase
	
	- **Cluster Operating System**: Ubuntu 12.04 LTS
	
	- **Subscription**: select your Azure subscription used for provisioning this cluster.
	
	- **Resource Group**: add or select an Azure resource group.  For more information, see [Azure Resource Manager Overview](resource-group-overview.md).
	
	- **Configure the credentials**: enter a password for the __admin__ account, then provide an SSH user credentials. For more information on using SSH with HDInsight, see the following documents:
	
		- [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md)
		
		- [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)	
	
	- **Data Source**: create a new Azure storage account or select an existing Azure storage account to be used as the default file system for the cluster. This Azure Storage account must be in the same location as the HDInsight HBase cluster.
	
	- **Note Pricing Tiers:** select the number of region servers for the HBase cluster.

		> [AZURE.WARNING] For high availability of HBase services, you must provision a cluster that contains at least **three** nodes. This ensures that, if one node goes down, the HBase data regions are available on other nodes.

		> If you are learning HBase, always choose 1 for the cluster size, and delete the cluster after each use to reduce the cost.

	- **Optional Configuration**: select the cluster version, configure Azure virtual network, configure Hive/Oozie metastore, configure Script actions, and add additional storage accounts.

4. Click **Create**.

> [AZURE.NOTE] After an HBase cluster is deleted, you can create another HBase cluster by using the same default blob container. The new cluster will pick up the HBase tables you created in the original cluster.

## Use the HBase shell

1. Use SSH to connect to your HBase cluster in HDInsight. Replace USERNAME with your SSH user name and CLUSTERNAME with your HDInsight cluster name:

		ssh USERNAME@CLUSTERNAME-ssh.azurehdinsight.net
		
 	For more information on using SSH with HDInsight, see the following documents:

	- [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md)
    
    - [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)

2. Use the following command to start the HBase shell:

		hbase shell
		
	You will be presented with a prompt similar to the following once the shell has loaded:
	
		hbase(main):001:0>

4. Create an new table named __Contacts__ with two column families (__Personal__ and __Office__):

		create 'Contacts', 'Personal', 'Office'
		list

5. Insert some data. The following populates data within the __Personal__ and __Office__ families for row 1000 within the table:

		put 'Contacts', '1000', 'Personal:Name', 'John Dole'
		put 'Contacts', '1000', 'Personal:Phone', '1-425-000-0001'
		put 'Contacts', '1000', 'Office:Phone', '1-425-000-0002'
		put 'Contacts', '1000', 'Office:Address', '1111 San Gabriel Dr.'
		
6. Use the following to retrieve data from the __Contacts__ table:
 
		scan 'Contacts'

	The results should appear similar to the following:
	
		ROW                   COLUMN+CELL
		1000                 column=Office:Address, timestamp=1439905040696, value=1111
							San Gabriel Dr.
		1000                 column=Office:Phone, timestamp=1439905024025, value=1-425-
							000-0002
		1000                 column=Personal:Name, timestamp=1439904988727, value=John
							Dole
		1000                 column=Personal:Phone, timestamp=1439905005104, value=1-42
							5-000-0001
		1 row(s) in 0.1220 seconds

6. Get a single row from the table:

		get 'Contacts', '1000'

	You will see the same results as using the scan command because there is only one row.

6. Exit the shell

		exit
		
For more information about the Hbase table schema, see [Introduction to HBase Schema Design][hbase-schema]. For more HBase commands, see [Apache HBase reference guide][hbase-quick-start].

###Bulk load data

HBase includes several methods of loading data into tables.  For more information, see [Bulk loading](http://hbase.apache.org/book.html#arch.bulk.load).

A sample data file has been uploaded to a public blob container, wasb://hbasecontacts@hditutorialdata.blob.core.windows.net/contacts.txt.  The content of the data file is:

	8396	Calvin Raji		230-555-0191	230-555-0191	5415 San Gabriel Dr.
	16600	Karen Wu		646-555-0113	230-555-0192	9265 La Paz
	4324	Karl Xie		508-555-0163	230-555-0193	4912 La Vuelta
	16891	Jonn Jackson	674-555-0110	230-555-0194	40 Ellis St.
	3273	Miguel Miller	397-555-0155	230-555-0195	6696 Anchor Drive
	3588	Osa Agbonile	592-555-0152	230-555-0196	1873 Lion Circle
	10272	Julia Lee		870-555-0110	230-555-0197	3148 Rose Street
	4868	Jose Hayes		599-555-0171	230-555-0198	793 Crawford Street
	4761	Caleb Alexander	670-555-0141	230-555-0199	4775 Kentucky Dr.
	16443	Terry Chander	998-555-0171	230-555-0200	771 Northridge Drive

You can create a text file and upload the file to your own storage account if you want. For the instructions, see [Upload data for Hadoop jobs in HDInsight][hdinsight-upload-data].

> [AZURE.NOTE] This procedure uses the Contacts HBase table you have created in the last procedure.

1. Use the following command to transform the data file to StoreFiles and store at a relative path specified by Dimporttsv.bulk.output:

		hbase org.apache.hadoop.hbase.mapreduce.ImportTsv -Dimporttsv.columns="HBASE_ROW_KEY,Personal:Name, Personal:Phone, Office:Phone, Office:Address" -Dimporttsv.bulk.output="/example/data/storeDataFileOutput" Contacts wasb://hbasecontacts@hditutorialdata.blob.core.windows.net/contacts.txt

4. Run the following command to upload the data from  /example/data/storeDataFileOutput to the HBase table:

		hbase org.apache.hadoop.hbase.mapreduce.LoadIncrementalHFiles /example/data/storeDataFileOutput Contacts

5. You can open the HBase shell, and use the scan command to list the table content.

## Check cluster status

HBase provides a web UI for monitoring clusters. Using the Web UI, you can request statistics or information about regions.

To open the web UI, you must create an SSH tunnel to the server, and then access the HBase web UI through Ambari web.

1. [Create an SSH tunnel to access Ambari web and other service UIs](hdinsight-linux-ambari-ssh-tunnel.md).

2. Once the tunnel has been created, and you have opened Ambari web, select the __Hbase__ service from the list on the left, or from the __Services__ menu.

3. Use the __Quick Links__ dropdown to select one of the Zookeeper nodes, and then select the __HBase Master UI__ link.

	![Image of the quick links](./media/hdinsight-hbase-tutorial-get-started-linux/quicklinks.png)

	> [AZURE.NOTE] Due to the long Fully Qualified Domain Name for the Zookeeper nodes, you may have to use the arrow keys to scroll to the right to access the __HBase Master UI__ link.

## Use Hive to query HBase tables

You can query data in HBase tables by using Hive. This section creates a Hive table that maps to the HBase table and uses it to query the data in your HBase table.

1. From an SSH connection to the cluster, use the following command to start an interactive Hive session:

		hive

1. Once you receive the `hive>` prompt, enter the following to create an external table that will allow you to query HBase:

		CREATE EXTERNAL TABLE hbasecontacts(rowkey STRING, name STRING, homephone STRING, officephone STRING, officeaddress STRING)
		STORED BY 'org.apache.hadoop.hive.hbase.HBaseStorageHandler'
		WITH SERDEPROPERTIES ('hbase.columns.mapping' = ':key,Personal:Name,Personal:Phone,Office:Phone,Office:Address')
		TBLPROPERTIES ('hbase.table.name' = 'Contacts');

2. Enter the following to return a count of records from the new external table.

     	SELECT count(*) FROM hbasecontacts;

## Use the .NET HBase REST API client library

You must download the HBase REST API client library for .NET from GitHub and build the project so that you can use the HBase .NET SDK. The following procedure includes the instructions for this task.

1. Create a new C# Visual Studio Windows Desktop Console application.

2. Open the NuGet Package Manager Console by clicking the **TOOLS** menu > **NuGet Package Manager** > **Package Manager Console**.

3. Run the following NuGet command in the console:

		Install-Package Microsoft.HBase.Client

5. Add the following **using** statements at the top of the file:

		using Microsoft.HBase.Client;
		using org.apache.hadoop.hbase.rest.protobuf.generated;

6. Replace the **Main** function with the following. Replace &lt;yourHBaseClusterName> with the name of the HBase cluster, and &lt;youradminuserPassword> with the password for the admin account:

        static void Main(string[] args)
        {
            string clusterURL = "https://<yourHBaseClusterName>.azurehdinsight.net";
            string hadoopUsername= "admin";
            string hadoopUserPassword = "<youradminUserPassword>";

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

8. Press **F5** to run the application. It will connect to the HBase server and display some version information, then create a new table, add data to it, then retrieve and display the data.

## What's next?

In this HBase tutorial for HDInsight, you learned how to provision an HBase cluster and how to create tables and view the data in those tables from the HBase shell. You also learned how use a Hive query on data in HBase tables and how to use the HBase C# REST APIs to create an HBase table and retrieve data from the table.

To learn more, see:

- [HDInsight HBase overview][hdinsight-hbase-overview]:
HBase is an Apache, open-source, NoSQL database built on Hadoop that provides random access and strong consistency for large amounts of unstructured and semistructured data.

- [Provision HBase clusters on Azure Virtual Network][hdinsight-hbase-provision-vnet]:
With virtual network integration, HBase clusters can be deployed to the same virtual network as your applications so that applications can communicate with HBase directly.

- [Develop a Java application that uses HBase](hdinsight-hbase-build-java-maven-linux.md)

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
[azure-management-portal]: https://portal.azure.com/
[azure-create-storageaccount]: http://azure.microsoft.com/documentation/articles/storage-create-storage-account/

[img-hdinsight-hbase-cluster-quick-create]: ./media/hdinsight-hbase-tutorial-get-started/hdinsight-hbase-quick-create.png
[img-hdinsight-hbase-hive-editor]: ./media/hdinsight-hbase-tutorial-get-started/hdinsight-hbase-hive-editor.png
[img-hdinsight-hbase-file-browser]: ./media/hdinsight-hbase-tutorial-get-started/hdinsight-hbase-file-browser.png
[img-hbase-shell]: ./media/hdinsight-hbase-tutorial-get-started/hdinsight-hbase-shell.png
[img-hbase-sample-data-tabular]: ./media/hdinsight-hbase-tutorial-get-started/hdinsight-hbase-contacts-tabular.png
[img-hbase-sample-data-bigtable]: ./media/hdinsight-hbase-tutorial-get-started/hdinsight-hbase-contacts-bigtable.png
