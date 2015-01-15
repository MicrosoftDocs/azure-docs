<properties urlDisplayName="Use Hadoop Hive in HDInsight" pageTitle="Use Hadoop Hive in HDInsight | Azure" metaKeywords="" description="Learn how to use Hive with HDInsight. You'll use a log file as input into an HDInsight table, and use HiveQL to query the data and report basic statistics." metaCanonical="" services="hdinsight" documentationCenter="" title="" authors="mumian" solutions="" manager="paulettm" editor="cgronlun" videoId="" scriptId=""/>

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="09/25/2014" ms.author="jgao" />

# Use Hive with Hadoop in HDInsight

[Apache Hive][apache-hive] provides a means of running MapReduce job through an SQL-like scripting language, called *HiveQL*. Hive is a data warehouse system for Hadoop, which enables data summarization, querying, and analysis of large volumes of data. In this article, you use HiveQL to query a sample data file that is provided as part of HDInsight cluster provisioning.


**Prerequisites:**

- You must have provisioned an **HDInsight cluster**. For a walkthrough on how to do this with the Azure portal, see [Get started with HDInsight][hdinsight-get-started]. For instructions on the various other ways in which such clusters can be created, see [Provision HDInsight Clusters][hdinsight-provision].

- You must have installed **Azure PowerShell** on your workstation. For instructions on how to do this, see [Install and configure Azure PowerShell][powershell-install-configure].

##In this article

* [The Hive usage case](#usage)
* [Upload data for Hive tables](#uploaddata)
* [Run Hive queries using PowerShell](#runhivequeries)
* [Run HIve queries using HDInsight Tools for Visual Studio](#runhivefromvs)
* [Use Tez for improved performance](#usetez)
* [Next steps](#nextsteps)

##<a id="usage"></a>The Hive usage case

![HDI.HIVE.Architecture][image-hdi-hive-architecture]

Hive projects structure on a largely unstructured data, and then lets you query that data. Hive provides a layer of abstraction over the Java-based MapReduce framework, enabling users to query data without knowledge of Java or MapReduce. HiveQL, the Hive query language, allows you to write queries with statements that are similar to T-SQL. HiveQL queries are compiled to MapReduce for you by HDInsight and run on the cluster. Other benefits of Hive are:

- Hive allows programmers who are familiar with the MapReduce framework to plug in custom mappers and reducers to perform more sophisticated analysis that may not be supported by the built-in capabilities of the HiveQL language.
- Hive is best suited for the batch processing of large amounts of immutable data (such as web logs). It is not appropriate for transaction applications that need very fast response times, such as database management systems.
- Hive is optimized for scalability (more machines can be added dynamically to the Hadoop cluster), extensibility (within the MapReduce framework and with other programming interfaces), and fault-tolerance. Latency is not a key design consideration.

##<a id="uploaddata"></a>Upload data for Hive tables

HDInsight uses an Azure Blob storage container as the default file system for Hadoop clusters. Some sample data files are added to the blob storage as part of cluster provisioning. This article uses a *log4j* sample file that is distributed with the HDInsight cluster and is stored at **/example/data/sample.log** under your blob storage container. Each log inside the file consists of a line of fields that contains a `[LOG LEVEL]` field to show the type and the severity. For example:

	2012-02-03 20:26:41 SampleClass3 [ERROR] verbose detail for id 1527353937

In the example above, the log level is ERROR.

> [AZURE.NOTE] You can also generate your own log4j files using the [Apache Log4j][apache-log4j] logging utility and then upload that to the blob container. See [Upload Data to HDInsight][hdinsight-upload-data] for instructions. For more information on how Azure Blob storage is used with HDInsight, see [Use Azure Blob Storage with HDInsight][hdinsight-storage].

HDInsight can access files stored in blob storage using the **wasb** prefix. For example, to access the sample.log file, you would use the following syntax:

	wasb:///example/data/sample.log

Since WASB is the default storage for HDInsight, you can also access the file using **/example/data/sample.log**.

> [AZURE.NOTE] The above syntax, **wasb:///**, is used to access files stored on the default storage container for your HDInsight cluster. If you specified additional storage accounts when you provisioned your cluster, and want to access files stored on these accounts, you can access the data by specifying the container name and storage account address. For example, **wasb://mycontainer@mystorage.blob.core.windows.net/example/data/sample.log**.

##<a id="runhivequeries"></a> Run Hive queries using PowerShell

Hive queries can be run in PowerShell either by using the **Start-AzureHDInsightJob** cmdlet or the **Invoke-Hive** cmdlet.

* **Start-AzureHDInsightJob** is a generic job runner, used to start Hive, Pig, and MapReduce jobs on an HDInsight cluster. **Start-AzureHDInsightJob** is asynchronous, and returns before the job has completed. Information about the job is returned, and can be used with cmdlets such as **Wait-AzureHDInsightJob**, **Stop-AzureHDInsightJob**, and **Get-AzureHDInsightJobOutput**.  **Get-AzureHDInsightJobOutput** must be used to retrieve information written to **STDOUT** or **STDERR** by the job.

* **Invoke-Hive** runs a Hive query, waits on it to complete, and retrieves the output of the query as one action.

1. Open an Azure PowerShell console windows. The instructions can be found in [Install and configure Azure PowerShell][powershell-install-configure].
2. Run the following command to connect to your Azure subscription:

		Add-AzureAccount

	You will be prompted to enter your Azure account credentials.

2. Set the variables in the following script and run it.

		# Provide Azure subscription name, and the Azure Storage account and container that is used for the default HDInsight file system.
		$subscriptionName = "<SubscriptionName>"
		$storageAccountName = "<AzureStorageAccountName>"
		$containerName = "<AzureStorageContainerName>"

		# Provide HDInsight cluster name Where you want to run the Hive job
		$clusterName = "<HDInsightClusterName>"

3. Run the following script to create a new table named **log4jLogs** using the sample data.

		# HiveQL
		# Create an EXTERNAL table
		$queryString = "DROP TABLE log4jLogs;" +
		               "CREATE EXTERNAL TABLE log4jLogs(t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string) ROW FORMAT DELIMITED FIELDS TERMINATED BY ' ' STORED AS TEXTFILE LOCATION 'wasb:///example/data/';" +
		               "SELECT t4 AS sev, COUNT(*) AS cnt FROM log4jLogs WHERE t4 = '[ERROR]' GROUP BY t4;"

	The HiveQL statements perform the following actions

	* **DROP TABLE** - deletes the table and the data file, in case the table already exists
	* **CREATE EXTERNAL TABLE** - creates a new 'external' table in Hive. External tables only store the table definition in Hive - the data is left in the original location
	* **ROW FORMAT** - tells Hive how the data is formatted. In this case, the fields in each log are separated by a space
	* **STORED AS TEXTFILE LOCATION** - tells Hive where the data is stored (the example/data directory,) and that it is stored as text
	* **SELECT** - select a count of all rows where column **t4** contain the value **[ERROR]**. This should return a value of **3** as there are three rows that contain this value

	> [AZURE.NOTE] External tables should be used when you expect the underlying data to be updated by an external source, such as an automated data upload process, or by another MapReduce operation, but always want Hive queries to use the latest data.
	>
	> Dropping an external table does **not** delete the data, only the table definition.


4. Run the following script to create a Hive job definition from the previous query.

		# Create a Hive job definition
		$hiveJobDefinition = New-AzureHDInsightHiveJobDefinition -Query $queryString

	You can also use the -File switch to specify a HiveQL script file on HDFS.

5. Run the following script to submit the Hive job:

		# Submit the job to the cluster
		Select-AzureSubscription $subscriptionName
		$hiveJob = Start-AzureHDInsightJob -Cluster $clusterName -JobDefinition $hiveJobDefinition

6. Run the following script to wait for the Hive job to complete:

		# Wait for the Hive job to complete
		Wait-AzureHDInsightJob -Job $hiveJob -WaitTimeoutInSeconds 3600

7. Run the following script to print the standard output:

		# Print the standard error and the standard output of the Hive job.
		Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $hiveJob.JobId -StandardOutput


 	![HDI.HIVE.PowerShell][image-hdi-hive-powershell]

	The result is:

		[ERROR] 3

	which means there were three instances of ERROR logs in the *sample.log* file.

4. To use **Invoke-Hive**, you must first set the cluster to use.

		# Connect to the cluster
		Use-AzureHDInsightCluster $clusterName

4. Use the following script to create a new 'internal' table named **errorLogs** using the **Invoke-Hive** cmdlet.

		# Run a query to create an 'internal' Hive table
		$response = Invoke-Hive -Query @"
		CREATE TABLE IF NOT EXISTS errorLogs (t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string) STORED AS ORC;
		INSERT OVERWRITE TABLE errorLogs SELECT t1, t2, t3, t4, t5, t6, t7 FROM log4jLogs WHERE t4 = '[ERROR]';
		"@
		# print the output on the console
		Write-Host $response

	These statements perform the following actions.

	* **CREATE TABLE IF NOT EXISTS** - creates a table, if it does not already exist. Since the **EXTERNAL** keyword is not used, this is an 'internal' table, which is stored in the Hive data warehouse and is managed completely by Hive
	* **STORED AS ORC** - stores the data in Optimized Row Columnar (ORC) format. This is a highly optimized and efficient format for storing Hive data
	* **INSERT OVERWRITE ... SELECT** - selects rows from the **log4jLogs** table that contain **[ERROR]**, then insert the data into the **errorLogs** table

	> [AZURE.NOTE] Unlike **EXTERNAL** tables, dropping an internal table will delete the underlying data as well.

	The output will look like the following.

	![PowerShell Invoke-Hive output][img-hdi-hive-powershell-output]

	> [AZURE.NOTE] For longer HiveQL queries, you can use PowerShell Here-Strings or HiveQL script files. The following snippet shows how to use the *Invoke-Hive* cmdlet to run a HiveQL script file. The HiveQL script file must be uploaded to WASB.
	>
	> `Invoke-Hive -File "wasb://<ContainerName>@<StorageAccountName>/<Path>/query.hql"`
	>
	> For more information about Here-Strings, see [Using Windows PowerShell Here-Strings][powershell-here-strings].

5. To verify that only rows containing **[ERROR]** in column t4 were stored to the **errorLogs** table, use the following statement to return all the rows from **errorLogs**.

		#Select all rows
		$response = Invoke-Hive -Query "SELECT * from errorLogs;"
		Write-Host $response

	Three rows of data should be returned, all containing **[ERROR]** in column t4.


> [AZURE.NOTE] If required, you can also import the output of your queries into Microsoft Excel for further analysis. For instructions, see [Connect Excel to Hadoop with Power Query][import-to-excel].

##<a id="runhivefromvs"></a>Run Hive queries using Visual Studio
HDInsight Tools for Visual Studio comes with Azure SDK for .NET version 2.5 or later.  Using the tools from Visual Studio, you can connect to HDInsight cluster, create Hive tables, and run Hive queries.  For more information see [Get started using HDInsight Hadoop Tools for Visual Studio][1].



##<a id="usetez"></a>Using Tez For Improved Performance

[Apache Tez][apache-tez] is a framework that allows for data intensive applications like Hive to execute much more efficiently at scale. In the latest release of HDInsight, Hive now supports running on Tez.  This is currently off by default and must be enabled.  In future cluster versions, this will be set to be on by default. In order to take advantage of Tez, the following value must be set for a Hive query:

		set hive.execution.engine=tez;

This can submitted on a per query basis by placing this at the beginning of your query.  One can also set this to be on by default on a cluster by setting the configuration value at cluster creation time.  You can find more details in  [Provisioning HDInsight Clusters][hdinsight-provision].

The [Hive on Tez design documents][hive-on-tez-wiki] contain a number of details on the implementation choices and tuning configurations.


##<a id="nextsteps"></a>Next steps

While Hive makes it easy to query data using a SQL-like query language, other components available with HDInsight provide complementary functionality such as data movement and transformation. To learn more, see the following articles:

* [Get started using HDInsight Hadoop Tools for Visual Studio][1]
* [Use Oozie with HDInsight][hdinsight-use-oozie]
* [Submit Hadoop jobs programmatically][hdinsight-submit-jobs]
* [Using Pig with HDInsight](../hdinsight-use-pig/)
* [Analyze flight delay data using HDInsight][hdinsight-analyze-flight-data]
* [Azure HDInsight SDK documentation][hdinsight-sdk-documentation]
* [Upload data to HDInsight][hdinsight-upload-data]
* [Get started with Azure HDInsight](../hdinsight-get-started/)


[1]: ../hdinsight-hadoop-visual-studio-tools-get-started/

[hdinsight-sdk-documentation]: http://msdnstage.redmond.corp.microsoft.com/en-us/library/dn479185.aspx

[azure-purchase-options]: http://azure.microsoft.com/en-us/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/en-us/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/en-us/pricing/free-trial/

[apache-tez]: http://tez.apache.org
[apache-hive]: http://hive.apache.org/
[apache-log4j]: http://en.wikipedia.org/wiki/Log4j
[hive-on-tez-wiki]: https://cwiki.apache.org/confluence/display/Hive/Hive+on+Tez
[import-to-excel]: http://azure.microsoft.com/en-us/documentation/articles/hdinsight-connect-excel-power-query/


[hdinsight-use-oozie]: ../hdinsight-use-oozie/
[hdinsight-analyze-flight-data]: ../hdinsight-analyze-flight-delay-data/



[hdinsight-storage]: ../hdinsight-use-blob-storage

[hdinsight-provision]: ../hdinsight-provision-clusters/
[hdinsight-submit-jobs]: ../hdinsight-submit-hadoop-jobs-programmatically/
[hdinsight-upload-data]: ../hdinsight-upload-data/
[hdinsight-get-started]: ../hdinsight-get-started/

[Powershell-install-configure]: ../install-configure-powershell/
[powershell-here-strings]: http://technet.microsoft.com/en-us/library/ee692792.aspx

[image-hdi-hive-powershell]: ./media/hdinsight-use-hive/HDI.HIVE.PowerShell.png
[img-hdi-hive-powershell-output]: ./media/hdinsight-use-hive/HDI.Hive.PowerShell.Output.png
[image-hdi-hive-architecture]: ./media/hdinsight-use-hive/HDI.Hive.Architecture.png
