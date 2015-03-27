<properties 
   pageTitle="Get started using Hadoop with Hive in HDInsight on Linux| Azure" 
   description="Get started using Hadoop in HDInsight on Linux. Learn how to provision HDInsight Hadoop clusters running on Linux, and query data with Hive" 
   services="hdinsight" 
   documentationCenter="" 
   authors="nitinme" 
   manager="paulettm" 
   editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="03/13/2015"
   ms.author="nitinme"/>

# Get started using Hadoop with Hive in HDInsight on Linux (Preview)

This tutorial gets you started quickly with HDInsight on Linux by showing you how to provision an HDInsight Hadoop cluster on Linux and run a Hive query to extract meaningful information from unstructured data.


> [AZURE.NOTE] If you are new to Hadoop and Big Data, you can read more about the terms <a href="http://go.microsoft.com/fwlink/?LinkId=510084" target="_blank">Apache Hadoop</a>, <a href="http://go.microsoft.com/fwlink/?LinkId=510086" target="_blank">MapReduce</a>, <a href="http://go.microsoft.com/fwlink/?LinkId=510087" target="_blank">HDFS</a>, and <a href="http://go.microsoft.com/fwlink/?LinkId=510085" target="_blank">Hive</a>. To understand how HDInsight enables Hadoop in Azure, see [Introduction to Hadoop in HDInsight](hdinsight-hadoop-introduction.md).


## What does this tutorial achieve? ##

Assume you have a large unstructured data set and you want to run queries on it to extract some meaningful information. Here's how we achieve this:

   !["Get started using Hadoop with Hive in HDInsight" tutorial steps illustrated: create an account; provision a cluster; query data; and analyze in Tableau.](./media/hdinsight-hadoop-linux-get-started/HDI.Linux.GetStartedFlow.png)


**Prerequisites:**

Before you begin this tutorial, you must have the following:


- An Azure subscription. For more information about obtaining a subscription, see <a href="http://azure.microsoft.com/pricing/purchase-options/" target="_blank">Purchase Options</a>, <a href="http://azure.microsoft.com/pricing/member-offers/" target="_blank">Member Offers</a>, or <a href="http://azure.microsoft.com/pricing/free-trial/" target="_blank">Free Trial</a>.

**Estimated time to complete:** 30 minutes

## In this tutorial

* [Create an Azure storage account](#storage)
* [Provision an HDInsight Linux cluster](#provision)
* [Submit a Hive job](#hivequery)
* [Next steps](#nextsteps)

## <a name="storage"></a>Create an Azure Storage account

HDInsight uses Azure Blob Storage for storing data. It is called *WASB* or *Azure Storage - Blob*. WASB is Microsoft's implementation of HDFS on Azure Blob storage. For more information see [Use Azure Blob storage with HDInsight](hdinsight-use-blob-storage.md).

When you provision an HDInsight cluster, you specify an Azure Storage account. A specific Blob storage container from that account is designated as the default file system, just like in HDFS. The HDInsight cluster is by default provisioned in the same data center as the storage account you specify.

In addition to this storage account, you can add additional storage accounts when you custom-configure an HDInsight cluster. This additional storage account can either be from the same Azure subscription or different Azure subscriptions. For instructions, see [Provision HDInsight Linux clusters using custom options](hdinsight-hadoop-provision-linux-clusters.md). 

To simplify this tutorial, only the default blob container and the default storage account are used. In practice, the data files are usually stored in a designated storage account.

**To create an Azure Storage account**

1. Sign in to the <a href="https://manage.windowsazure.com/" target="_blank">Azure Management Portal</a>.
2. Click **NEW** on the lower left corner, point to **DATA SERVICES**, point to **STORAGE**, and then click **QUICK CREATE**.

	![Azure portal where you can use Quick Create to set up a new storage account.](./media/hdinsight-hadoop-linux-get-started/HDI.StorageAccount.QuickCreate.png)

3. Enter **URL**, **LOCATION** and **REPLICATION**, and then click **CREATE STORAGE ACCOUNT**. Affinity groups are not supported. You will see the new storage account in the storage list.

	>[AZURE.NOTE]  The quick-create option to provision an HDInsight Linux cluster, like the one we use in this tutorial, does not ask for a location while provisioning the cluster. By default, it co-locates the cluster in the same data center as the storage account. So, make sure you create your storage account in the locations supported for the cluster, which are:  **East Asia**, **Southeast Asia**, **North Europe**, **West Europe**, **East US**, **West US**, **North Central US**, **South Central US**.

4. Wait until the **STATUS** of the new storage account is changed to **Online**.
5. Select the new storage account from the list and click **MANAGE ACCESS KEYS** from the bottom of the page.
7. Make a note of the **STORAGE ACCOUNT NAME** and the **PRIMARY ACCESS KEY** (or the **SECONDARY ACCESS KEY**. Either of the keys work).  You will need them later in the tutorial.


For more information, see
[How to Create a Storage Account](storage-create-storage-account.md) and [Use Azure Blob Storage with HDInsight](hdinsight-use-blob-storage.md).
	
## <a name="provision"></a>Provision an HDInsight cluster on Linux

When you provision an HDInsight cluster, you provision Azure compute resources that contains Hadoop and related applications. In this section you provision an HDInsight cluster on Linux using the quick-create option. This option uses default user names and Azure storage containers, and configures a cluster with HDInsight version 3.2 (Hadoop version 2.5, HDP version 2.2) running on Ubuntu 12.04 LTS. For information about different HDInsight versions and their SLA, see [HDInsight component versioning](hdinsight-component-versioning.md) page.

>[AZURE.NOTE]  You can also create Hadoop clusters running Windows Server OS. For instructions, see [Get Started with HDInsight on Windows](hdinsight-get-started.md).


**To provision an HDInsight cluster** 

1. Sign in to the <a href="https://manage.windowsazure.com/" target="_blank">Azure Management Portal</a>. 

2. Click **NEW** on the lower left side, click **Data Services**, click **HDInsight**, and then click **Hadoop on Linux**.

	![Creation of a Hadoop cluster in HDInsight.](./media/hdinsight-hadoop-linux-get-started/HDI.QuickCreateCluster.png)

4. Enter or select the following values:

	<table border="1">
	<tr><th>Name</th><th>Value</th></tr>
	<tr><td>Cluster Name</td><td>Name of the cluster</td></tr>
	<tr><td>Cluster Size</td><td>Number of data nodes you want to deploy. The default value is 4. But the option to use 1 or 2 data nodes is also available from the drop-down. Any number of cluster nodes can be specified by using the <strong>Custom Create</strong> option. Pricing details on the billing rates for various cluster sizes are available. Click the <strong>?</strong> symbol just above the dropdown box and follow the link on the pop up.</td></tr>
	<tr><td>Password</td><td>The password for the <i>HTTP</i> account (default username: admin) and <i>SSH</i> account (default username: hdiuser). Note that these are NOT the administrator accounts for the VMs on which the clusters are provisioned. </td></tr>
	
	<tr><td>Storage Account</td><td>Select the storage account you created from the dropdown box. <br/>

	Once a storage account is chosen, it cannot be changed. If the storage account is removed, the cluster will no longer be available for use.

	The HDInsight cluster is co-located in the same datacenter as the storage account. 
	</td></tr>
	</table>

	Keep a copy of the cluster name. You will need it later in the tutorial.

	
5. Click **Create HDInsight Cluster**. When the provisioning completes, the  status column shows **Running**.

	>[AZURE.NOTE] The procedure above creates a Linux cluster with the quick-create option that uses default SSH username and Azure storage containers. To create a cluster with custom options, such as using SSH key for authentication or using additional storage accounts, see [Provision HDInsight Linux clusters using custom options](hdinsight-hadoop-provision-linux-clusters.md).


## <a name="hivequery"></a>Submit a Hive job on the cluster
Now that you have an HDInsight Linux cluster provisioned, the next step is to run a sample Hive job to query sample data (sample.log) that comes with HDInsight clusters. The sample data contains log information including trace,  warnings, info, errors, etc. We query this data to retrieve all the error logs with a specific severity. You must perform the following steps to run a Hive query on an HDInsight Linux cluster.

- Connect to a Linux cluster
- Run a Hive job



### To connect to a cluster

You can connect to an HDInsight cluster on Linux from a Linux computer or a Windows computer using SSH.

**To connect from a Linux computer**

1. Open a terminal and enter the following command:

		ssh <username>@<clustername>-ssh.azurehdinsight.net

	Because you provisioned a cluster with the quick create option, the default SSH username is **hdiuser**. So, the command must be

		ssh hdiuser@myhdinsightcluster-ssh.azurehdinsight.net

2. When prompted, enter the password that you provided while provisioning the cluster. After you are successfully connected, the prompt will change to the following:

		hdiuser@headnode-0:~$


**To connect from a Windows computer**

1. Download **PuTTY** for Windows clients. This is available from <a href="http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html" target="_blank">http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html</a>

2. Open **PuTTY**. In **Category**, click **Session**. From the **Basic options for your PuTTY session** screen, enter the SSH address of your HDInsight server in the **Host name (or IP address)** field. The SSH address is your cluster name, followed by**-ssh.azurehdinsight.net**. For example, **myhdinsightcluster-ssh.azurehdinsight.net**.

	![Connect to an HDInsight cluster on Linux using PuTTY](./media/hdinsight-hadoop-linux-get-started/HDI.linux.connect.putty.png)

3. To save the connection information for future use, enter a name for this connection under **Saved Sessions**, then click **Save**. The connection will be added to the list of saved sessions.

4. Click **Open** to connect to the cluster. When prompted for the user name, enter *hdiuser*. For password, enter the password you specified while provisioning the cluster. After you are successfully connected, the prompt will change to the following:

		hdiuser@headnode-0:~$

### To run a Hive job

Once you are connected to the cluster using SSH, use the following commands to run a Hive query.

1. Start the Hive Command-Line Interface (CLI) by using the following command at the prompt:

		hive

2. Using the CLI, enter the following statements to create a new table named log4jLogs using the sample data already available on the cluster.

		DROP TABLE log4jLogs;
		CREATE EXTERNAL TABLE log4jLogs(t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string) 
		ROW FORMAT DELIMITED FIELDS TERMINATED BY ' ' 
		STORED AS TEXTFILE LOCATION 'wasb:///example/data/';
		SELECT t4 AS sev, COUNT(*) AS cnt FROM log4jLogs WHERE t4 = '[ERROR]' GROUP BY t4;

	These statements perform the following actions.

	- **DROP TABLE** - deletes the table and the data file, in case the table already exists.
	- **CREATE EXTERNAL TABLE** - creates a new 'external' table in Hive. External tables only store the table definition in Hive; the data is left in the original location.
	- **ROW FORMAT** - tells Hive how the data is formatted. In this case, the fields in each log are separated by a space.
	- **STORED AS TEXTFILE LOCATION** - tells Hive where the data is stored (the example/data directory,) and that it is stored as text.
	- **SELECT** - select a count of all rows where column t4 contain the value [ERROR]. 

	>[AZURE.NOTE] External tables should be used when you expect the underlying data to be updated by an external source, such as an automated data upload process, or by another MapReduce operation, but al
	>ways want Hive queries to use the latest data. Dropping an external table does **not** delete the data, only the table definition.

	This returns the following output.

		Query ID = hdiuser_20150116000202_cceb9c6b-4356-4931-b9a7-2c373ebba493
		Total jobs = 1
		Launching Job 1 out of 1
		Number of reduce tasks not specified. Estimated from input data size: 1
		In order to change the average load for a reducer (in bytes):
		  set hive.exec.reducers.bytes.per.reducer=<number>
		In order to limit the maximum number of reducers:
		  set hive.exec.reducers.max=<number>
		In order to set a constant number of reducers:
		  set mapreduce.job.reduces=<number>
		Starting Job = job_1421200049012_0006, Tracking URL = <URL>:8088/proxy/application_1421200049012_0006/
		Kill Command = /usr/hdp/2.2.1.0-2165/hadoop/bin/hadoop job  -kill job_1421200049012_0006
		Hadoop job information for Stage-1: number of mappers: 1; number of reducers: 1
		2015-01-16 00:02:40,823 Stage-1 map = 0%,  reduce = 0%
		2015-01-16 00:02:55,488 Stage-1 map = 100%,  reduce = 0%, Cumulative CPU 3.32 sec
		2015-01-16 00:03:05,298 Stage-1 map = 100%,  reduce = 100%, Cumulative CPU 5.62 sec
		MapReduce Total cumulative CPU time: 5 seconds 620 msec
		Ended Job = job_1421200049012_0006
		MapReduce Jobs Launched: 
		Stage-Stage-1: Map: 1  Reduce: 1   Cumulative CPU: 5.62 sec   HDFS Read: 0 HDFS Write: 0 SUCCESS
		Total MapReduce CPU Time Spent: 5 seconds 620 msec
		OK
		[ERROR]    3
		Time taken: 60.991 seconds, Fetched: 1 row(s)

	Note that the output contains **[ERROR]  3**, as there are three rows that contain this value.

3. Use the following statements to create a new "internal" table named **errorLogs**.

		CREATE TABLE IF NOT EXISTS errorLogs (t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string) STORED AS ORC;
		INSERT OVERWRITE TABLE errorLogs SELECT t1, t2, t3, t4, t5, t6, t7 FROM log4jLogs WHERE t4 = '[ERROR]';


	These statements perform the following actions.

	- **CREATE TABLE IF NOT EXISTS** - creates a table, if it does not already exist. Since the EXTERNAL keyword is not used, this is an 'internal' table, which is stored in the Hive data warehouse and is managed completely by Hive. Unlike **EXTERNAL** tables, dropping an internal table will delete the underlying data as well.
	- **STORED AS ORC** - stores the data in Optimized Row Columnar (ORC) format. This is a highly optimized and efficient format for storing Hive data.
	- **INSERT OVERWRITE ... SELECT** - selects rows from the **log4jLogs** table that contain [ERROR], then inserts the data into the **errorLogs** table

4. To verify that only rows containing **[ERROR]** in column t4 were stored to the **errorLogs** table, use the following statement to return all the rows from errorLogs.

		SELECT * from errorLogs;

	The following output should be displayed on the console.

		2012-02-03	18:35:34	SampleClass0	[ERROR]	 incorrect		id
		2012-02-03	18:55:54	SampleClass1	[ERROR]	 incorrect		id
		2012-02-03	19:25:27	SampleClass4	[ERROR]	 incorrect		id
		Time taken: 0.987 seconds, Fetched: 3 row(s)

	The returned data should all correspond to [ERROR] logs.


## <a name="nextsteps"></a>Next steps
In this tutorial, you have learned how to provision a Hadoop Linux cluster with HDInsight and run a Hive query on it using SSH. To learn more, see the following articles:

- [Provision HDInsight on Linux using custom options](hdinsight-hadoop-provision-linux-clusters.md)
- [Working with HDInsight on Linux](hdinsight-hadoop-linux-information.md)
- [Manage HDInsight clusters using Ambari](hdinsight-hadoop-manage-ambari.md)
- [Use MapReduce with HDInsight][hdinsight-use-mapreduce]
- [Use Hive with HDInsight][hdinsight-use-hive]
- [Use Pig with HDInsight][hdinsight-use-pig]
- [Use Azure Blob storage with HDInsight](hdinsight-use-blob-storage.md)
- [Upload data to HDInsight][hdinsight-upload-data]


[1]: hdinsight-hadoop-visual-studio-tools-get-started.md

[hdinsight-provision]: hdinsight-provision-clusters.md
[hdinsight-admin-powershell]: hdinsight-administer-use-powershell.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-use-mapreduce]: hdinsight-use-mapreduce.md
[hdinsight-use-hive]: hdinsight-use-hive.md
[hdinsight-use-pig]: hdinsight-use-pig.md

[powershell-download]: http://go.microsoft.com/fwlink/p/?linkid=320376&clcid=0x409
[powershell-install-configure]: install-configure-powershell.md
[powershell-open]: install-configure-powershell.md#Install

[img-hdi-dashboard]: ./media/hdinsight-get-started/HDI.dashboard.png
[img-hdi-dashboard-query-select]: ./media/hdinsight-get-started/HDI.dashboard.query.select.png
[img-hdi-dashboard-query-select-result]: ./media/hdinsight-get-started/HDI.dashboard.query.select.result.png
[img-hdi-dashboard-query-select-result-output]: ./media/hdinsight-get-started/HDI.dashboard.query.select.result.output.png
[img-hdi-dashboard-query-browse-output]: ./media/hdinsight-get-started/HDI.dashboard.query.browse.output.png
[image-hdi-clusterstatus]: ./media/hdinsight-get-started/HDI.ClusterStatus.png
[image-hdi-gettingstarted-powerquery-importdata]: ./media/hdinsight-get-started/HDI.GettingStarted.PowerQuery.ImportData.png
[image-hdi-gettingstarted-powerquery-importdata2]: ./media/hdinsight-get-started/HDI.GettingStarted.PowerQuery.ImportData2.png