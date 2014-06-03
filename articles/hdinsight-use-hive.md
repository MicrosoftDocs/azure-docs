<properties linkid="manage-services-hdinsight-howto-hive" urlDisplayName="Use Hadoop Hive in HDInsight" pageTitle="Use Hadoop Hive in HDInsight | Azure" metaKeywords="" description="Learn how to use Hive with HDInsight. You'll use a log file as input into an HDInsight table, and use HiveQL to query the data and report basic statistics." metaCanonical="" services="hdinsight" documentationCenter="" title="Use Hadoop Hive in HDInsight" authors="jgao" solutions="" manager="paulettm" editor="cgronlun" />





# Use Hive with Hadoop in HDInsight

[Apache Hive][apache-hive] provides a means of running MapReduce job through an SQL-like scripting language, called *HiveQL*, which can be applied towards summarization, querying, and analysis of large volumes of data. In this article, you will use HiveQL to query the data in an Apache log4j log file and report basic statistics. 

**Prerequisites:**

- You must have provisioned an **HDInsight cluster**. For a walkthrough on how to do this with the Azure portal, see [Get started with HDInsight][hdinsight-get-started]. For instructions on the various other ways in which such clusters can be created, see [Provision HDInsight Clusters][hdinsight-provision]. 

- You must have installed **Azure PowerShell** on your workstation. For instructions on how to do this, see [Install and configure Azure PowerShell][powershell-install-configure].

**Estimated time to complete:** 30 minutes



##In this article

* [The Hive usage case](#usage)
* [Upload data files to Azure Blob storage](#uploaddata)
* [Run Hive queries using PowerShell](#runhivequeries)
* [Next steps](#nextsteps)

##<a id="usage"></a>The Hive usage case




Databases are appropriate when managing smaller sets of data for which low latency queries are possible. However, when it comes to big data sets that contain terabytes of data, traditional SQL databases are often not an ideal solution. Database administrators have habitually scaling up to deal with these larger data sets, buying bigger hardware as database load increased and performance degraded.  

Hive solves the problems associated with big data by allowing users to scale out when querying large data sets. Hive queries data in parallel across multiple nodes using MapReduce, distributing the database across on an increasing number of hosts as load increases.

Hive and HiveQL also offer an alternative to writing MapReduce jobs in Java when querying data. It provides a simple SQL-like wrapper that allows queries to be written in HiveQL that are then compiled to MapReduce for you by HDInsight and run on the cluster.
 
Hive also allows programmers who are familiar with the MapReduce framework to plug in custom mappers and reducers to perform more sophisticated analysis that may not be supported by the built-in capabilities of the HiveQL language.  

Hive is best suited for the batch processing of large amounts of immutable data (such as web logs). It is not appropriate for transaction applications that need very fast response times, such as database management systems. Hive is optimized for scalability (more machines can be added dynamically to the Hadoop cluster), extensibility (within the MapReduce framework and with other programming interfaces), and fault-tolerance. Latency is not a key design consideration.   

Generally, applications save errors, exceptions and other coded issues in a log file, so administrators can use the data in the log files to review problems that may arise and to generate metrics that are relevant to errors or other issues like performance. These log files usually get quite large in size and contain a wealth of data that must be processed and mined for intelligence on the application. 

Log files are therefore a paradigmatic example of big data. HDInsight provides a Hive data warehouse system that facilitates easy data summarization, ad-hoc queries, and the analysis of these big datasets stored in Hadoop compatible file systems such as Azure Blob Storage.
















##<a id="uploaddata"></a>Upload data files to the Blob storage

HDInsight uses Azure Blob storage container as the default file system.  For more information, see [Use Azure Blob Storage with HDInsight][hdinsight-storage]. 

In this article, you use a log4j sample file distributed with the HDInsight cluster that is stored in *\example\data\sample.log*. Each log inside the file consists of a line of fields that contains a `[LOG LEVEL]` field to show the type and the severity. For example:

	2012-02-03 20:26:41 SampleClass3 [ERROR] verbose detail for id 1527353937 


To access files, use the following syntax: 

	wasb://<containerName>@<AzureStorageName>.blob.core.windows.net

For example:

	wasb://mycontainer@mystorage.blob.core.windows.net/example/data/sample.log

replace *mycontainer* with the container name, and *mystorage* with the Blob storage account name. 

Because the file is stored in the default file system, you can also access the file using the following:

	wasb:///example/data/sample.log
	/example/data/sample.log

To generate your own log4j files, use the [Apache Log4j][apache-log4j] logging utility. For information on uploading data to Azure Blob Storage, see [Upload Data to HDInsight][hdinsight-upload-data].





















##<a id="runhivequeries"></a> Run Hive queries using PowerShell
In the last section, you uploaded a log4j file called sample.log to the default file system container.  In this section, you will run HiveQL to create a hive table, load data to the hive table, and then query the data to find out how many error logs there were.

This article provides the instructions for using Azure PowerShell cmdlets to run a Hive query. Before you go through this section, you must first setup the local environment, and configure the connection to Azure as explained in the **Prerequisites** section at the beginning of this topic.

Hive queries can be run in PowerShell either using the **Start-AzureHDInsightJob** cmdlet or the **Invoke-Hive** cmdlet

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

3. Run the following script to define the HiveQL queries:

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

	The LOAD DATA HiveQL command will result in moving the data file to the \hive\warehouse\ folder.  The DROP TABLE command will delete the table and the data file.  If you use the internal table option and want to run the script again, you must upload the sample.log file again. If you want to keep the data file, you must use the CREATE EXTERNAL TABLE command as shown in the script.
	
	You can also use the external table for the situation where the data file is located in a different container or storage account.

	Use the DROP TABLE first in case you run the script again and the log4jlogs table already exists.

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
8. 
		# Print the standard error and the standard output of the Hive job.
		Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $hiveJob.JobId -StandardOutput


 	![HDI.HIVE.PowerShell][image-hdi-hive-powershell]

	The results is:

		[ERROR] 3

**To submit Hive queries using Invoke-Hive**

1. Open an Azure PowerShell console window.
2. Run the following command to connect to your Azure subscription:

		Add-AzureAccount

	You will be prompted to enter your Azure account credentials.
2. Set the variable, and then run it:

		$clusterName = "<HDInsightClusterName>"

3. Run the following script to invoke HiveQL queries:

		Use-AzureHDInsightCluster $clusterName 
		$response = Invoke-Hive -Query @"
		    SELECT * FROM hivesampletable
		        WHERE devicemake LIKE "HTC%"
		        LIMIT 10; 
		"@
		
		Write-Host $response

	The output is:

	![PowerShell Invoke-Hive output][img-hdi-hive-powershell-output]

	For longer HiveQL queries, it is recommended to use PowerShell Here-Strings or HiveQL script file. The following samples shows how to use the Invoke-Hive cmdlet to run a HiveQL script file.  The HiveQL script file must be uploaded to WASB.

		Invoke-Hive -File "wasb://<ContainerName>@<StorageAccountName>/<Path>/query.hql"

	For more information about Here-Strings, see [Using Windows PowerShell Here-Strings][powershell-here-strings].
	
##<a id="nextsteps"></a>Next steps

While Hive makes it easy to query data using a SQL-like query language, other components available with HDInsight provide complementary functionality such as data movement and transformation. To learn more, see the following articles:

* [Get started with Azure HDInsight](../hdinsight-get-started/)
* [Analyze flight delay data using HDInsight][hdinsight-analyze-flight-data]
* [Use Oozie with HDInsight][hdinsight-use-oozie]
* [Submit Hadoop jobs programmatically][hdinsight-submit-jobs]
* [Upload data to HDInsight][hdinsight-upload-data]
* [Using Pig with HDInsight](../hdinsight-use-pig/)
* [Azure HDInsight SDK documentation][hdinsight-sdk-documentation]


[hdinsight-sdk-documentation]: http://msdnstage.redmond.corp.microsoft.com/en-us/library/dn479185.aspx

[azure-purchase-options]: http://azure.microsoft.com/en-us/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/en-us/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/en-us/pricing/free-trial/


[apache-hive]: http://hive.apache.org/
[apache-log4j]: http://en.wikipedia.org/wiki/Log4j


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
