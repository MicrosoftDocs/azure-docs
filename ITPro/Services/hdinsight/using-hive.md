<properties linkid="manage-services-hdinsight-using-hive" urlDisplayName="Using Hive" pageTitle="Using Hive with HDInsight - Windows Azure tutorial" metaKeywords="using hive, hive hdinsight, hive azure, powershell, hdinsight" metaDescription="Learn how to use Hive with data stored in HDInsight." umbracoNaviHide="0" disqusComments="1" writer="jgao" editor="mollybos" manager="paulettm" />



# Using Hive with HDInsight #

[Apache Hive][apache-hive] provides a means of running MapReduce job through an SQL-like scripting language, called *HiveQL*, which can be applied towards summarization, querying, and analysis of large volumes of data. In this article, you will use HiveQL to query the data in an Apache log4j log file and report basic statistics. 

**Prerequisites:**

Note the following requirements before you begin this article:

* A Windows Azure HDInsight cluster. For instructions, see [Getting started with Windows Azure HDInsight service][hdinsight-getting-started] or [Provision HDInsight clusters][hdinsight-provision].

**Estimated time to complete:** 30 minutes

##In this article

* [The Hive usage case](#usage)
* [Upload data files to Windows Azure Blob storage](#uploaddata)
* [Run Hive queries using PowerShell](#runhivequeries)
* [Next steps](#nextsteps)

##<a id="usage"></a>The Hive usage case

Databases are great for small sets of data and low latency queries. However, when it comes to Big Data and large data sets in terabytes, traditional SQL databases are not the ideal solution. Traditionally, database administrators have relied on scaling up by buying bigger hardware as database load increases and performance degrades. 

Hive solves these problems by allowing users to scale out when querying Big Data. Hive queries data in parallel across multiple nodes using MapReduce, distributing the database across multiple hosts as load increases.

Hive can also be used as an alternative to writing java MapReduce jobs, because it provides an SQL-like interface to run complex queries against Big Data. By providing a simple, SQL like wrapper, complex MapReduce code can be avoided with a few lines of SQL-like entries.
 
Hive also allows programmers who are familiar with the MapReduce framework to be able to plug in their custom mappers and reducers to perform more sophisticated analysis that may not be supported by the built-in capabilities of the language.  

Hive is best suited for batch processing of large amounts of immutable data (such as web logs). It is not appropriate for transaction applications that need very fast response times, such as database management systems. Hive is optimized for scalability (more machines can be added dynamically to the Hadoop cluster), extensibility (with MapReduce framework and other programming interfaces), and fault-tolerance. Latency is not a key design consideration.   

Generally, all applications save errors, exceptions and other coded issues in a log file, so administrators can review the problems, or generate certain metrics from the log file data. These log files usually get quite large in size, containing a wealth of data that must be processed and mined. 

Log files are therefore a good example of big data. Working with big data is difficult using relational databases and statistics/visualization packages. Due to the large amounts of data and the computation of this data, parallel software running on tens, hundreds, or even thousands of servers is often required to compute this data in a reasonable time. Hadoop provides a Hive data warehouse system that facilitates easy data summarization, ad-hoc queries, and the analysis of large datasets stored in Hadoop compatible file systems.

[Apache Log4j][apache-log4j] is a logging utility. Each log inside a file contains a *log level* field to show the type and the severity. For example:

	2012-02-03 20:26:41 SampleClass3 [TRACE] verbose detail for id 1527353937











##<a id="uploaddata"></a>Upload data files to the Blob storage

HDInsight uses Windows Azure Blob storage container as the default file system.  For more information, see [Using Windows Azure Blob Storage with HDInsight][hdinsight-storage]. In this article, you will use a log4j sample file distributed with the HDInsight cluster stored in *\example\data\sample.log*. For information on uploading data, see [How to Upload Data to HDInsight][hdinsight-upload-data].

To access files, use the following syntax: 

		wasb[s]://[[<containername>@]<storageaccountname>.blob.core.windows.net]/<path>/<filename>

For example:

		wasb://mycontainer@mystorage.blob.core.windows.net/example/data/sample.log

replace *mycontainer* with the container name, and *mystorage* with the Blob storage account name. 

Because the file is stored in the default file system, you can also access the file using the following:

		wasb:///example/data/sample.log
		/example/data/sample.log






























##<a id="runhivequeries"></a> Run Hive queries using PowerShell
In the last section, you have uploaded a log4j file called sample.log to the default file system container.  In this section, you will run HiveQL to create hive table, load data to the hive table, and then query the data to find out how many error logs.

This article provides the instructions for using PowerShell cmdlets. Before you go through this section, you must first setup the local environment, and configure the connection to Windows Azure. For details, see [Getting Started with Windows Azure HDInsight Service][hdinsight-get-started] and [How to Administer HDInsight Using PowerShell][hdinsight-admin-powershell].

There are two options to run Hive queries:

**To run the Hive queries using Start-AzureHDInsightJob**

1. Open a Windows Azure PowerShell console windows. The instructions can be found in [Install and configure PowerShell for HDInsight][hdinsight-configure-powershell].
2. Set the variables in the following script and run it:

		### Provide Windows Azure subscription name, and the Azure Storage account and container that is used for the default HDInsight file system.
		$subscriptionname = "<SubscriptionName>"
		$storageaccountname = "<AzureStorageAccountName>"
		$containername = "<AzureStorageContainerName>"
		
		### Provide HDInsight cluster name Where you want to run the Hive job
		$clustername = "<HDInsightClusterName>"

3. Run the following script to define the HiveQL queries:

		### HiveQL queries
		### Use the internal table option. 
		$querystring = "DROP TABLE log4jLogs;" +
		               "CREATE TABLE log4jLogs(t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string) ROW FORMAT DELIMITED FIELDS TERMINATED BY ' ';" +
		               "LOAD DATA INPATH 'wasb://$containername@$storageaccountname.blob.core.windows.net/example/data/log4j/sample.log' OVERWRITE INTO TABLE log4jLogs;" +
		               "SELECT t4 AS sev, COUNT(*) AS cnt FROM log4jLogs WHERE t4 = '[ERROR]' GROUP BY t4;"
		
		### Use the external table option. 
		$querystring = "DROP TABLE log4jLogs;" +
		                "CREATE EXTERNAL TABLE log4jLogs(t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string) ROW FORMAT DELIMITED FIELDS TERMINATED BY ' ' STORED AS TEXTFILE LOCATION 'wasb://$containername@$storageaccountname.blob.core.windows.net/example/data/log4j/';" +
				        "SELECT t4 AS sev, COUNT(*) AS cnt FROM log4jLogs WHERE t4 = '[ERROR]' GROUP BY t4;"

	The LOAD DATA HiveQL command will result in moving the data file to the \hive\warehouse\ folder.  The DROP TABLE command will delete the table and the data file.  If you use the internal table option and want to run the script again, you must upload the sample.log file again. If you want to keep the data file, you must use the CREATE EXTERNAL TABLE command as shown in the script.
	
	You can also use the external table for the situation where the data file is located in a different container or storage account.

	Use the DROP TABLE first in case you run the script again and the log4jlogs table already exists.

4. Run the following script to create an Hive job definition:

		### Provide HDInsight user name and password for running the Hive job.
		$creds = Get-Credential 
		
		### Create a Hive job definition 
		$HiveJobDefinition = New-AzureHDInsightHiveJobDefinition -Query $querystring -JobName "HiveJob-log4j"
		
5. Run the following script to submit the Hive job:

		### Submit the job to the cluster 
		$HiveJob = Start-AzureHDInsightJob -Credentials $creds -Cluster $clustername -JobDefinition $HiveJobDefinition
		
6. Run the following script to wait for the Hive job to complete:

		### Wait for the Hive job to complete
		$HiveJob | Wait-AzureHDInsightJob -Credentials $creds -WaitTimeoutInSeconds 3600
		
7. Run the following script to print the standard output:
		### Print the standard error and the standard output of the Hive job.
		Get-AzureHDInsightJobOutput -Cluster $clustername -Subscription $subscriptionname -JobId $HiveJob.JobId -StandardOutput


 	![HDI.HIVE.PowerShell][image-hdi-hive-powershell]

	The results is:

		[ERROR] 3

**To submit Hive queries using Invoke-Hive**

1. Open a Windows Azure PowerShell console window.
2. Set the variables for the following script and run it:

		$subscriptionName = "<SubscriptionName>"
		$clusterName = "<HDInsightClusterName>"
		$queryString = "show tables;"  ### This query lists the existing Hive tables

3. Run the following script to invoke HiveQL queries:

		Select-AzureSubscription -SubscriptionName $subscriptionName
		Use-AzureHDInsightCluster $clusterName -Subscription (Get-AzureSubscription -Current).SubscriptionId
		
		Invoke-Hive $queryString

	The output is:

		hivesampletable

You can use the same command to run a HiveQL file:

	Invoke-Hive –File "wasb://<ContainerName>@<StorageAccountName>/<Path>/query.hql"

		
##<a id="nextsteps"></a>Next steps

While Hive makes it easy to query data using a SQL-like query language, other languages available with the HDInsight Service provide complementary functionality such as data movement and transformation. To learn more, see the following articles:

* [Getting started with Windows Azure HDInsight Service](/en-us/manage/services/hdinsight/get-started-hdinsight/)
* [Submit Hadoop jobs programmatically][hdinsight-submit-jobs]
* [Upload data to HDInsight][hdinsight-upload-data]
* [Using MapReduce with HDInsight](/en-us/manage/services/hdinsight/using-mapreduce-with-hdinsight/)
* [Using Pig with HDInsight](/en-us/manage/services/hdinsight/using-pig-with-hdinsight/) 

[sample-log]: http://go.microsoft.com/fwlink/?LinkID=286223
[apache-hive]: http://hive.apache.org/
[apache-log4j]: http://en.wikipedia.org/wiki/Log4j

[hdinsight-get-started]: /en-us/manage/services/hdinsight/get-started-hdinsight/
[hdinsight-storage]: /en-us/manage/services/hdinsight/howto-blob-store
[hdinsight-upload-data]: /en-us/manage/services/hdinsight/upload-data/
[hdinsight-admin-powershell]: /en-use/manage/services/hdinsight/administer-hdinsight-powershell/
[hdinsight-provision]: /en-us/manage/services/hdinsight/provision-hdinsight-clusters/
[hdinsight-submit-jobs]: /en-us/manage/services/hdinsight/submit-hadoop-jobs-programmatically/
[hdinsight-upload-data]: /en-us/manage/services/hdinsight/howto-upload-data-to-hdinsight/
[hdinsight-configure-powershell]: /en-us/manage/services/hdinsight/configure-powershell-for-hdinsight/ 
[hdinsight-getting-started]: /en-us/manage/services/hdinsight/get-started-hdinsight/

[azure-create-storageaccount]: /en-us/manage/services/storage/how-to-create-a-storage-account/
[azure-storage-explorer]: http://azurestorageexplorer.codeplex.com/ 

[image-hdi-hive-powershell]: ../media/HDI.HIVE.PowerShell.png 
