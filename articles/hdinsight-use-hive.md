<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="jgao" />

# Use Hive with Hadoop in HDInsight

[Apache Hive][apache-hive] provides a means of running MapReduce job through an SQL-like scripting language, called *HiveQL*. Hive is a data warehouse system for Hadoop, which enables data summarization, querying, and analysis of large volumes of data. In this article, you use HiveQL to query a sample data file that is provided as part of HDInsight cluster provisioning. 

**Prerequisites:**

- You must have provisioned an **HDInsight cluster**. For a walkthrough on how to do this with the Azure portal, see [Get started with HDInsight][hdinsight-get-started]. For instructions on the various other ways in which such clusters can be created, see [Provision HDInsight Clusters][hdinsight-provision]. 

- You must have installed **Azure PowerShell** on your workstation. For instructions on how to do this, see [Install and configure Azure PowerShell][powershell-install-configure].

**Estimated time to complete:** 30 minutes



##In this article

* [The Hive usage case](#usage)
* [Upload data for Hive tables](#uploaddata)
* [Run Hive queries using PowerShell](#runhivequeries)
* [Use Tez for improved performance](#usetez)
* [Next steps](#nextsteps)

##<a id="usage"></a>The Hive usage case

Hive projects some kind of structure on a largely unstructured data set (which is all Hadoop is about), and then lets you query that data using HiveQL. Hive provides a layer of abstraction over the Java-based MapReduce framework, enabling users to query data without knowledge of Java or MapReduce. HiveQL provides a simple SQL-like wrapper that allows queries to be written in HiveQL that are then compiled to MapReduce for you by HDInsight and run on the cluster. Other benefits of Hive are: 

- Hive allows programmers who are familiar with the MapReduce framework to plug in custom mappers and reducers to perform more sophisticated analysis that may not be supported by the built-in capabilities of the HiveQL language.
- Hive is best suited for the batch processing of large amounts of immutable data (such as web logs). It is not appropriate for transaction applications that need very fast response times, such as database management systems.
- Hive is optimized for scalability (more machines can be added dynamically to the Hadoop cluster), extensibility (within the MapReduce framework and with other programming interfaces), and fault-tolerance. Latency is not a key design consideration.   


##<a id="uploaddata"></a>Upload data for Hive tables

HDInsight uses Azure Blob storage container as the default file system for Hadoop clusters. Some sample data files are added to the blob storage as part of cluster provisioning. You can use these sample data files for running Hive queries on the cluster. If you want, you can also upload your own data file to the blob storage account associated with the cluster. See [Upload Data to HDInsight][hdinsight-upload-data] for instructions. For more information on how Azure Blob storage is used with HDInsight, see [Use Azure Blob Storage with HDInsight][hdinsight-storage]. 

This article uses a *log4j* sample file that is distributed with the HDInsight cluster and is stored at *\example\data\sample.log* under your blob storage container. You can also generate your own log4j files using the [Apache Log4j][apache-log4j] logging utility and then upload that to the blob container. Each log inside the file consists of a line of fields that contains a `[LOG LEVEL]` field to show the type and the severity. For example:

	2012-02-03 20:26:41 SampleClass3 [ERROR] verbose detail for id 1527353937 

In the example above, the log level is ERROR.

You can access the files by using the following syntax from within your application: 

	wasb://<containerName>@<AzureStorageName>.blob.core.windows.net

So, to access the sample.log file, you would use the following syntax:

	wasb://mycontainer@mystorage.blob.core.windows.net/example/data/sample.log

Replace *mycontainer* with the Azure Blob container name, and *mystorage* with the Azure storage account name. 

Because the file is stored in the default file system, you can also access the file using the following:

	wasb:///example/data/sample.log
	/example/data/sample.log


##<a id="runhivequeries"></a> Run Hive queries using PowerShell
In the last section, you identified a *sample.log* file that you will use for running Hive queries. In this section, you will run HiveQL to create a hive table, load the sample data to the hive table, and then query the data to find out how many error logs are present in the file.

This article provides the instructions for using Azure PowerShell cmdlets to run a Hive query. Before you proceed with this section, you must first setup the local environment, and configure the connection to Azure as explained in the **Prerequisites** section at the beginning of this topic.

Hive queries can be run in PowerShell either by using the **Start-AzureHDInsightJob** cmdlet or the **Invoke-Hive** cmdlet.

**To run the Hive queries using Start-AzureHDInsightJob**

1. Open an Azure PowerShell console windows. The instructions can be found in [Install and configure Azure PowerShell][powershell-install-configure].
2. Run the following command to connect to your Azure subscription:

		Add-AzureAccount

	You will be prompted to enter your Azure account credentials.

2. Set the variables in the following script and run it:

		# Provide Azure subscription name, and the Azure Storage account and container that is used for the default HDInsight file system.
		$subscriptionName = "<SubscriptionName>"
		$storageAccountName = "<AzureStorageAccountName>"
		$containerName = "<AzureStorageContainerName>"
		
		# Provide HDInsight cluster name Where you want to run the Hive job
		$clusterName = "<HDInsightClusterName>"

3. Run the following script to define the HiveQL queries. You can choose to create an *internal* or *external* Hive table. 

	- With internal tables the sample data that you use is moved from its existing location to \hive\warehouse\<*tablename>* folder. So, when you drop an internal table, the associated data is also deleted.  If you use the internal tables and want to run the script again, you must upload the *sample.log* file again to the blob storage. 
	- With external tables, the data is not moved from its original location.You can also use the external table for the situation where the data file is located in a different container or storage account.

			# HiveQL queries
			# Use the internal table option. 
			$queryString = "DROP TABLE log4jLogs;" +
			               "CREATE TABLE log4jLogs(t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string) ROW FORMAT DELIMITED FIELDS TERMINATED BY ' ';" +
			               "LOAD DATA INPATH 'wasb://$containerName@$storageAccountName.blob.core.windows.net/example/data/sample.log' OVERWRITE INTO TABLE log4jLogs;" +
			               "SELECT t4 AS sev, COUNT(*) AS cnt FROM log4jLogs WHERE t4 = '[ERROR]' GROUP BY t4;"
			
			# Use the external table option. 
			$queryString = "DROP TABLE log4jLogs;" +
			                "CREATE EXTERNAL TABLE log4jLogs(t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string) ROW FORMAT DELIMITED FIELDS TERMINATED BY ' ' STORED AS TEXTFILE LOCATION 'wasb://$containerName@$storageAccountName.blob.core.windows.net/example/data/';" +
					        "SELECT t4 AS sev, COUNT(*) AS cnt FROM log4jLogs WHERE t4 = '[ERROR]' GROUP BY t4;"

	
	The DROP TABLE command deletes the table and the data file, in case the table already exists. The LOAD DATA HiveQL command moves the data file from \example\data to the \hive\warehouse\<*tablename>* folder.
	
	
4. Run the following script to create a Hive job definition:
		
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

If required, you can also import the output of your queries into Microsoft Excel for further analysis. For instructions, see [Connect Excel to Hadoop with Power Query][import-to-excel]. 

**To submit Hive queries using Invoke-Hive**

1. Open an Azure PowerShell console window.
2. Run the following command to connect to your Azure subscription:

		Add-AzureAccount

	You will be prompted to enter your Azure account credentials.
2. Set the variables in the following script and run it:

		# Provide Azure subscription name, Azure Storage account, and container.
		$subscriptionName = "<SubscriptionName>"
		$storageAccountName = "<AzureStorageAccountName>"
		$containerName = "<AzureStorageContainerName>"
		
		# Provide HDInsight cluster name Where you want to run the Hive job
		$clusterName = "<HDInsightClusterName>"

3. Connect to the HDInsight cluster.

		# Connect to the cluster
		Use-AzureHDInsightCluster $clusterName

4. Run the following script to invoke HiveQL queries:

		# Run the query to create an internal Hive table, load sample data
		$response = Invoke-Hive -Query @"
		>> DROP TABLE log4jLogs;
		>> CREATE TABLE log4jLogs(t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string) ROW   
			FORMAT DELIMITED FIELDS TERMINATED BY ' ';
		>> LOAD DATA INPATH 'wasb://$containerName@$storageAccountName.blob.core.windows.net/example/data/
			sample.log' OVERWRITE INTO TABLE log4jLogs;
		>> SELECT t4 AS sev, COUNT(*) AS cnt FROM log4jLogs WHERE t4 = '[ERROR]' GROUP BY t4; 
		>> "@
		
		
5. Print the output on the console.
	
		# print the output on the console
		Write-Host $response

	The output looks like the following:

	![PowerShell Invoke-Hive output][img-hdi-hive-powershell-output]

	For longer HiveQL queries, you can use PowerShell Here-Strings or HiveQL script files. The following snippet shows how to use the *Invoke-Hive* cmdlet to run a HiveQL script file. The HiveQL script file must be uploaded to WASB.

		Invoke-Hive -File "wasb://<ContainerName>@<StorageAccountName>/<Path>/query.hql"

	For more information about Here-Strings, see [Using Windows PowerShell Here-Strings][powershell-here-strings].

If required, you can also import the output of your queries into Microsoft Excel for further analysis. For instructions, see [Connect Excel to Hadoop with Power Query][import-to-excel].

##<a id="usetez"</a>Using Tez For Improved Performance

[Apache Tez][apache-tez] is a framework that allows for data intensive applications like Hive to execute much more efficiently at scale. In the latest release of HDInsight, Hive now supports running on Tez.  This is currently off by default and must be enabled.  In order to take advantage of Tez, the following value must be set for a Hive query:

		set hive.execution.engine=tez;
		
This can submitted on a per query basis by placing this at the beginning of your query.  One can also set this to be on by default on a cluster by setting the configuration value at cluster creation time.  You can find more details in  [Provisioning HDInsight Clusters][hdinsight-provision].

The [Hive on Tez design documents][hive-on-tez-wiki] contain a number of details on the implementation choices and tuning configurations.

	
##<a id="nextsteps"></a>Next steps

While Hive makes it easy to query data using a SQL-like query language, other components available with HDInsight provide complementary functionality such as data movement and transformation. To learn more, see the following articles:

* [Use Oozie with HDInsight][hdinsight-use-oozie]
* [Submit Hadoop jobs programmatically][hdinsight-submit-jobs]
* [Using Pig with HDInsight](../hdinsight-use-pig/) 
* [Analyze flight delay data using HDInsight][hdinsight-analyze-flight-data]
* [Azure HDInsight SDK documentation][hdinsight-sdk-documentation]
* [Upload data to HDInsight][hdinsight-upload-data]
* [Get started with Azure HDInsight](../hdinsight-get-started/)



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
