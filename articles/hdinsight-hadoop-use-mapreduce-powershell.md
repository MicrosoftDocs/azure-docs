<properties
   pageTitle="Use MapReduce with Hadoop in HDinsight | Azure"
   description="Learn how to use PowerShell to remotely run MapReduce jobs with Hadoop on HDInsight."
   services="hdinsight"
   documentationCenter=""
   authors="Blackmist"
   manager="paulettm"
   editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang=""
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="02/18/2015"
   ms.author="larryfr"/>

#Run Hive queries with Hadoop on HDInsight using PowerShell

[AZURE.INCLUDE [mapreduce-selector](../includes/hdinsight-selector-use-mapreduce.md)]

This document provides an example of using PowerShell to run a MapReduce job on a Hadoop on HDInsight cluster.

##<a id="prereq"></a>Prerequisites

To complete the steps in this article, you will need the following.

* An Azure HDInsight (Hadoop on HDInsight) cluster (either Windows or Linux-based)

* <a href="http://azure.microsoft.com/documentation/articles/install-configure-powershell/" target="_blank">Azure PowerShell</a>

##<a id="powershell"></a>Run a MapReduce job using PowerShell

Azure PowerShell provides *cmdlets* that allow you to remotely run MapReduce jobs on HDInsight. Internally, this is accomplished by using REST calls to <a href="https://cwiki.apache.org/confluence/display/Hive/WebHCat" target="_blank">WebHCat</a> (formerly called Templeton,) running on the HDInsight cluster.

The following cmdlets are used when running MapReduce jobs on a remote HDInsight cluster.

* **Add-AzureAccount** - Authenticates PowerShell to your Azure Subscription

* **New-AzureHDInsightMapReduceJobDefinition** - Creates a new *job definition* using the specified MapReduce information

* **Start-AzureHDInsightJob** - Sends the job definition to HDInsight, starts the job, and returns a *job* object that can be used to check the status of the job

* **Wait-AzureHDInsightJob** - Uses the job object to check the status of the job. It will wait until the job has completed, or the wait time has been exceeded

* **Get-AzureHDInsightJobOutput** - Used to retrieve the output of the job

The following steps demonstrate how to use these cmdlets to run a job on your HDInsight cluster.

1. Using an editor, save the following code as **mapreducejob.ps1**. You must replace **CLUSTERNAME** with the name of your HDInsight cluster.

		#Login to your Azure subscription
		# Is there an active Azure subscription?
		$sub = Get-AzureSubscription -ErrorAction SilentlyContinue
		if(-not($sub))
		{
		    Add-AzureAccount
		}

		#Specify the cluster name
		$clusterName = "CLUSTERNAME"

		#Define the MapReduce job
		#NOTE: If using an HDInsight 2.0 cluster, use hadoop-examples.jar instead.
		# -JarFile = the JAR containing the MapReduce application
		# -ClassName = the class of the application
		# -Arguments = The input file, and the output directory
		$wordCountJobDefinition = New-AzureHDInsightMapReduceJobDefinition -JarFile "wasb:///example/jars/hadoop-mapreduce-examples.jar" `
		                          -ClassName "wordcount" `
		                          -Arguments "wasb:///example/data/gutenberg/davinci.txt", "wasb:///example/data/WordCountOutput"

		#Submit the job to the cluster
		Write-Host "Start the MapReduce job..." -ForegroundColor Green
		$wordCountJob = Start-AzureHDInsightJob -Cluster $clusterName -JobDefinition $wordCountJobDefinition

		#Wait for the job to complete
		Write-Host "Wait for the job to complete..." -ForegroundColor Green
		Wait-AzureHDInsightJob -Job $wordCountJob -WaitTimeoutInSeconds 3600

		# Print the output
		Write-Host "Display the standard output..." -ForegroundColor Green
		Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $wordCountJob.JobId -StandardOutput

2. Open a new **Microsoft Azure PowerShell** prompt. Change directories to the location of the **mapreducejob.ps1** file, then use the following to run the script.

		.\mapreducejob.ps1

3. When the job completes, you should receive output similar to the following.

		Cluster         : CLUSTERNAME
		ExitCode        : 0
		Name            : wordcount
		PercentComplete : map 100% reduce 100%
		Query           :
		State           : Completed
		StatusDirectory : f1ed2028-afe8-402f-a24b-13cc17858097
		SubmissionTime  : 12/5/2014 8:34:09 PM
		JobId           : job_1415949758166_0071

	> [AZURE.NOTE] If the **ExitCode** is a value other than 0, see [Troubleshooting](#troubleshooting).

	This indicates that the job completed successfully.

##<a id="results"></a>View the job output

The MapReduce job stored the results of the operation to Azure Blob Storage, in the **wasb:///example/data/WordCountOutput** path specified as an argument to the job. Azure Blob Storage is accessible through Azure PowerShell, but you must know the Storage Account Name, Key, and a container that is used by your HDInsight cluster in order to directly access the files.

Fortunately, you can obtain this information using the following Azure PowerShell cmdlets:

* **Get-AzureHDInsightCluster** - Returns information about an HDInsight cluster, including any Storage Accounts associated with it. There will always be a default storage account associated with a cluster.
* **New-AzureStorageContext** - Given the Storage Account Name and Key retrieved using **Get-AzureHDInsightCluster**, returns a context object that can be used to access the Storage Account.
* **Get-AzureStorageBlob** - Given a context object and container name, returns a list of blobs within the container.
* **Get-AzureStorageBlobContent** - Given a context object, a file path and name, and a container name (returned from **Get-AzureHDinsightCluster**,) downloads a file from Azure Blob Storage.

The following example will retrieve the storage information, then download the output from **wasb:///example/data/WordCountOutput**. Replace **CLUSTERNAME** with the name of your HDInsight cluster.

		#Login to your Azure subscription
		# Is there an active Azure subscription?
		$sub = Get-AzureSubscription -ErrorAction SilentlyContinue
		if(-not($sub))
		{
		    Add-AzureAccount
		}

		#Specify the cluster name
		$clusterName = "CLUSTERNAME"

		#Retrieve the cluster information
		$clusterInfo = Get-AzureHDInsightCluster -ClusterName $clusterName

		#Get the storage account information
		$storageAccountName = $clusterInfo.DefaultStorageAccount.StorageAccountName
		$storageAccountKey = $clusterInfo.DefaultStorageAccount.StorageAccountKey
		$storageContainer = $clusterInfo.DefaultStorageAccount.StorageContainerName

		#Create the context object
		$context = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey

		#Download the files from wasb:///example/data/WordCountOutput
		#Use the -blob switch to filter only blobs contained in example/data/WordCountOutput
		Get-AzureStorageBlob -Container $storageContainer -Blob example/data/WordCountOutput/* -Context $context | Get-AzureStorageBlobContent -Context $context

> [AZURE.NOTE] This example will store the downloaded files to the  **example/data/WordCountOutput** folder in the directory you run the script from.

The output of the MapReduce job is stored in files with the name *part-r-#####*. Open the **example/data/WordCountOutput/part-r-00000** file in a text editor to see the words and counts produced by the job.

> [AZURE.NOTE] The output files of a MapReduce job are immutable. So if you rerun this sample you will need to change the name of the output file.

##<a id="troubleshooting"></a>Troubleshooting

If no information is returned when the job completes, an error may have occurred during processing. To view error information for this job, add the following to the end of the **mapreducejob.ps1** file, save it, and then run it again.

	# Print the output of the WordCount job.
	Write-Host "Display the standard output ..." -ForegroundColor Green
	Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $wordCountJob.JobId -StandardError

This will return the information written to STDERR on the server when running the job, and may help determine why the job is failing.

##<a id="summary"></a>Summary

As you can see, Azure PowerShell provides an easy way to run MapReduce jobs on an HDInsight cluster, monitor the job status, and retrieve the output.

##<a id="nextsteps"></a>Next steps

For general information on MapReduce jobs in HDInsight.

* [Use MapReduce on HDInsight Hadoop](hdinsight-use-mapreduce.md)

For information on other ways you can work with Hadoop on HDInsight.

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)

* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)