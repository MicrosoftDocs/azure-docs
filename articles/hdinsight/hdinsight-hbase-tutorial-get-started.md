<properties
	pageTitle="HBase tutorial: Get started with HBase in Hadoop | Microsoft Azure"
	description="Follow this HBase tutorial to get started using Apache HBase with Hadoop in HDInsight. Create tables from the HBase shell and query them using Hive."
	keywords="apache hbase,hbase,hbase shell,hbase tutorial"
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
	ms.date="04/27/2016"
	ms.author="jgao"/>



# HBase tutorial: Get started using Apache HBase with Windows-based Hadoop in HDInsight

[AZURE.INCLUDE [hbase-selector](../../includes/hdinsight-hbase-selector.md)]

Learn how to create HBase clusters in HDInsight, create HBase tables, and query the tables by using Apache Hive. For general HBase information, see [HDInsight HBase overview][hdinsight-hbase-overview].

The information in this document is specific to Windows-based HDInsight clusters. For information on Windows-based clusters, use the tab selector on the top of the page to switch.

> [AZURE.NOTE] HBase (version 0.98.0) on Windows-based HDInsight is only available for use with HDInsight 3.1 clusters (based on Apache Hadoop and YARN 2.4.0). For version information, see [What's new in the Hadoop cluster versions provided by HDInsight?][hdinsight-versions]

###Before you begin

[AZURE.INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]

Before you begin this HBase tutorial, you must have the following:

- **A Microsoft Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
- **A workstation** with Visual Studio 2013 or greater: For instructions, see [Install Visual Studio](http://msdn.microsoft.com/library/e2h7fzkw.aspx).

## Create HBase cluster

[AZURE.INCLUDE [provisioningnote](../../includes/hdinsight-provisioning.md)]

**To create an HBase cluster by using the Azure portal**

1. Sign in to the [Azure portal][azure-management-portal].
2. Click **New** or **+** in the upper left corner, and then click **Data + Analytics**, **HDInsight**.
3. Enter the following values:

	- **Cluster Name** - Enter a name to identify this cluster.
	- **Cluster Type** - Select **HBase**.
	- **Cluster Operating System** - Select **Windows**.  For creating Linux-based HBase cluster, see  [HBase tutorial: Get started using Apache HBase with Hadoop in HDInsight (Linux)](hdinsight-hbase-tutorial-get-started-linux.md).
	- **Version** - Select an HBase version.
	- **Subscription** - Select your Azure subscription used for creating this cluster.
	- **Resource Group** -  Create a new Azure resource group or select an existing one. For more information, see [Azure Resource Manager Overview](resource-group-overview.md)
	- **Credentials** - For Windows based cluster, you can create a cluster user (a.k.a HTTP user, HTTP web service user) and a Remote Desktop user. Click **Enable Remote Desktop** to add the remote desktop user credentials. The next section requires RDP.
	- **Data Source** - create a new Azure storage account or select an existing Azure storage account to be used as the default file system for the cluster. The default storage account location determines the location of the cluster location. The default storage account and the cluster must co-locate in the same data center.
	- **Node Pricing Tiers** - Select the number of region servers for the HBase cluster

		> [AZURE.WARNING] For high availability of HBase services, you must create a cluster that contains at least **three** nodes. This ensures that, if one node goes down, the HBase data regions are available on other nodes.

		> If you are learning HBase, always choose 1 for the cluster size, and delete the cluster after each use to reduce the cost.

	- **Optional Configuration** - Configure Azure virtual network, configure Script actions, and add additional storage accounts.

4. Click **Create**.

>[AZURE.NOTE] After an HBase cluster is deleted, you can create another HBase cluster by using the same default storage account and the default blob container. The new cluster will pick up the HBase tables you created in the original cluster. To avoid inconsistencies, we recommend that you disable the HBase tables before you delete the cluster.

## Create tables and insert data

Currently, there are two way to access HBase. This section covers using the HBase shell. The next section covers using the .NET SDK.

For most people, data appears in the tabular format:

![hdinsight hbase tabular data][img-hbase-sample-data-tabular]

In HBase which is an implementation of BigTable, the same data looks like:

![hdinsight hbase bigtable data][img-hbase-sample-data-bigtable]

It'll make more sense after you finish the next procedure.  

**To use the HBase shell**

1. Use RDP to connect to your HBase cluster in HDInsight. For the RDP instructions, see [Manage Hadoop clusters in HDInsight using the Azure Portal][hdinsight-manage-portal].
2. Within your RDP session, click the **Hadoop Command Line** shortcut located on the desktop.
3. Open the HBase shell:

		cd %HBASE_HOME%\bin
		hbase shell

4. Create an HBase with two column families:

		create 'Contacts', 'Personal', 'Office'
		list
5. Insert some data:

		put 'Contacts', '1000', 'Personal:Name', 'John Dole'
		put 'Contacts', '1000', 'Personal:Phone', '1-425-000-0001'
		put 'Contacts', '1000', 'Office:Phone', '1-425-000-0002'
		put 'Contacts', '1000', 'Office:Address', '1111 San Gabriel Dr.'
		scan 'Contacts'

	![hdinsight hadoop hbase shell][img-hbase-shell]

6. Get a single row

		get 'Contacts', '1000'

	You'll see the same results as using the scan command because there is only one row.

	For more information about the Hbase table schema, see [Introduction to HBase Schema Design][hbase-schema]. For more HBase commands, see [Apache HBase reference guide][hbase-quick-start].


6. Exit the shell

		exit

**To bulk load data into the contacts HBase table**

HBase includes several methods of loading data into tables. For more information, see [Bulk loading](http://hbase.apache.org/book.html#arch.bulk.load).


A sample data file has been uploaded to a public blob container, wasb://hbasecontacts@hditutorialdata.blob.core.windows.net/contacts.txt. The content of the data file is:

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

> [AZURE.NOTE] This procedure uses the Contacts HBase table you created in the last procedure.

1. Within your RDP session, click the **Hadoop Command Line** shortcut located on the desktop.
2. Change directory:

		cd %HBASE_HOME%\bin

3. Run the following command to transform the data file to StoreFiles and store at a relative path specified by Dimporttsv.bulk.output:

		hbase org.apache.hadoop.hbase.mapreduce.ImportTsv -Dimporttsv.columns="HBASE_ROW_KEY,Personal:Name, Personal:Phone, Office:Phone, Office:Address" -Dimporttsv.bulk.output="/example/data/storeDataFileOutput" Contacts wasb://hbasecontacts@hditutorialdata.blob.core.windows.net/contacts.txt

4. Run the following command to upload the data from /example/data/storeDataFileOutput to the HBase table:

		hbase org.apache.hadoop.hbase.mapreduce.LoadIncrementalHFiles /example/data/storeDataFileOutput Contacts

5. You can open the HBase shell, and use the scan command to list the table content.



## Use Hive to query HBase tables

You can query data stored in HBase by using Hive. This section creates a Hive table that maps to the HBase table and uses it to query the data in your HBase table.

**To open the cluster dashboard**

1. Browse to **https://<HDInsight Cluster Name>.azurehdinsight.net/**.
5. Enter the Hadoop user account user name and password. The default user name is **admin** and the password is what you entered during the creation process. A new browser tab opens.
6. Click **Hive Editor** at the top of the page. The Hive Editor looks like this:

	![HDInsight cluster dashboard.][img-hdinsight-hbase-hive-editor]

**To run Hive queries**

1. Enter the following HiveQL script into Hive Editor and click **Submit** to create a Hive Table that maps to the HBase table. Make sure that you created the sample table referenced earlier in this tutorial by using the HBase shell before you run this statement.

		CREATE EXTERNAL TABLE hbasecontacts(rowkey STRING, name STRING, homephone STRING, officephone STRING, officeaddress STRING)
		STORED BY 'org.apache.hadoop.hive.hbase.HBaseStorageHandler'
		WITH SERDEPROPERTIES ('hbase.columns.mapping' = ':key,Personal:Name,Personal:Phone,Office:Phone,Office:Address')
		TBLPROPERTIES ('hbase.table.name' = 'Contacts');

	Wait until the **Status** updates to **Completed**.

2. Enter the following HiveQL script into Hive Editor, and then click **Submit**. The Hive query queries the data in the HBase table:

     	SELECT count(*) FROM hbasecontacts;

4. To retrieve the results of the Hive query, click the **View Details** link in the **Job Session** window when the job finishes running. There will be only one job output file because you put one record into the HBase table.




**To browse the output file**

1. In the Query Console, click **File Browser**.
2. Click the Azure storage account that is used as the default file system for the HBase cluster.
3. Click the HBase cluster name. The default Azure storage account container uses the cluster name.
4. Click **User**, and then click **Admin**. (This is the Hadoop user name.)
6. Click the job name with the **Last Modified** time that matches the time when the SELECT Hive query ran.
4. Click **stdout**. Save the file and open the file with Notepad. There will be one output file.

	![HDInsight HBase Hive Editor File Browser][img-hdinsight-hbase-file-browser]

## Use the .NET HBase REST API client library

You must download the HBase REST API client library for .NET from GitHub and build the project so that you can use the HBase .NET SDK. The following procedure includes the instructions for this task.

1. Create a new C# Visual Studio Windows Desktop Console application.
2. Open the NuGet Package Manager Console by clicking **Tools** > **NuGet Package Manager** > **Package Manager Console**.
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

            // Retrieve the cluster version.
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

## Check cluster status

HBase in HDInsight ships with a Web UI for monitoring clusters. Using the Web UI, you can request statistics or information about regions.

To open the Web UI, you must RDP into the cluster, and then click the HMaster Info Web UI shortcut on your desktop, or use the following URL in a web browser:

	http://zookeeper[0-2]:60010/master-status

In a high availability cluster, you'll find a link to the current active HBase master node that is hosting the Web UI.

##Delete the cluster
To avoid inconsistencies, we recommend that you disable the HBase tables before you delete the cluster.
[AZURE.INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]


## What's next?
In this HBase tutorial for HDInsight, you learned how to create an HBase cluster and how to create tables and view the data in those tables from the HBase shell. You also learned how use a Hive query on data in HBase tables and how to use the HBase C# REST APIs to create an HBase table and retrieve data from the table.

For more information, see:

- [HDInsight HBase overview][hdinsight-hbase-overview].
HBase is an Apache, open-source, NoSQL database built on Hadoop that provides random access and strong consistency for large amounts of unstructured and semistructured data.
- [Create HBase clusters on Azure Virtual Network][hdinsight-hbase-provision-vnet].
With virtual network integration, HBase clusters can be deployed to the same virtual network as your applications so that applications can communicate with HBase directly.
- [Configure HBase replication in HDInsight](hdinsight-hbase-geo-replication.md). Learn how to configure HBase replication across two Azure datacenters.
- [Analyze Twitter sentiment with HBase in HDInsight][hbase-twitter-sentiment].
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
