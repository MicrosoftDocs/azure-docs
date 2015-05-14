<properties
   pageTitle="Use MapReduce and PowerShell with Hadoop | Microsoft Azure"
   description="Learn how to use PowerShell to remotely run MapReduce jobs with Hadoop on HDInsight."
   services="hdinsight"
   documentationCenter=""
   authors="Blackmist"
   manager="paulettm"
   editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="02/18/2015"
   ms.author="larryfr"/>

#Run Hive queries with Hadoop on HDInsight using PowerShell

[AZURE.INCLUDE [mapreduce-selector](../includes/hdinsight-selector-use-mapreduce.md)]

This document provides an example of using Azure PowerShell to run a MapReduce job in a Hadoop on HDInsight cluster.

##<a id="prereq"></a>Prerequisites

To complete the steps in this article, you will need the following:

* An Azure HDInsight (Hadoop on HDInsight) cluster (Windows-based or Linux-based)

* <a href="http://azure.microsoft.com/documentation/articles/install-configure-powershell/" target="_blank">Azure PowerShell</a>

##<a id="powershell"></a>Run a MapReduce job using Azure PowerShell

Azure PowerShell provides *cmdlets* that allow you to remotely run MapReduce jobs on HDInsight. Internally, this is accomplished by using REST calls to <a href="https://cwiki.apache.org/confluence/display/Hive/WebHCat" target="_blank">WebHCat</a> (formerly called Templeton) running on the HDInsight cluster.

The following cmdlets are used when running MapReduce jobs in a remote HDInsight cluster.

* **Add-AzureAccount**: Authenticates Azure PowerShell to your Azure subscription

* **New-AzureHDInsightMapReduceJobDefinition**: Creates a new *job definition* by using the specified MapReduce information

* **Start-AzureHDInsightJob**: Sends the job definition to HDInsight, starts the job, and returns a *job* object that can be used to check the status of the job

* **Wait-AzureHDInsightJob**: Uses the job object to check the status of the job. It waits until the job completes or the wait time is exceeded.

* **Get-AzureHDInsightJobOutput**: Used to retrieve the output of the job

The following steps demonstrate how to use these cmdlets to run a job in your HDInsight cluster.

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

2. Open a new **Azure PowerShell** command prompt. Change directories to the location of the **mapreducejob.ps1** file, then use the following command to run the script:

		.\mapreducejob.ps1

3. When the job completes, you should receive output similar to the following:

		Cluster         : CLUSTERNAME
		ExitCode        : 0
		Name            : wordcount
		PercentComplete : map 100% reduce 100%
		Query           :
		State           : Completed
		StatusDirectory : f1ed2028-afe8-402f-a24b-13cc17858097
		SubmissionTime  : 12/5/2014 8:34:09 PM
		JobId           : job_1415949758166_0071

	This output indicates that the job completed successfully.
	
	> [AZURE.NOTE] If the **ExitCode** is a value other than 0, see [Troubleshooting](#troubleshooting).

##<a id="results"></a>View the job output

The MapReduce job stored the results of the operation to Azure Blob storage, in the **wasb:///example/data/WordCountOutput** path that was specified as an argument for the job. Azure Blob storage is accessible through Azure PowerShell, but you must know the storage account name, key, and the  container that is used by your HDInsight cluster to directly access the files.

Fortunately, you can obtain this information by using the following Azure PowerShell cmdlets:

* **Get-AzureHDInsightCluster**: Returns information about an HDInsight cluster, including any storage accounts associated with it. There will always be a default storage account associated with a cluster.
* **New-AzureStorageContext**: Given the storage account name and key retrieved using **Get-AzureHDInsightCluster**, returns a context object that can be used to access the storage account.
* **Get-AzureStorageBlob**: Given a context object and container name, returns a list of blobs within the container.
* **Get-AzureStorageBlobContent**: Given a context object, a file path and name, and a container name (returned from **Get-AzureHDinsightCluster**), downloads a file from Azure Blob storage.

The following example retrieves the storage information, then downloads the output from **wasb:///example/data/WordCountOutput**. Replace **CLUSTERNAME** with the name of your HDInsight cluster.

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

> [AZURE.NOTE] This example will store the downloaded files to the  **example/data/WordCountOutput** folder in the directory that you run the script from.

The output of the MapReduce job is stored in files with the name *part-r-#####*. Open the **example/data/WordCountOutput/part-r-00000** file in a text editor to see the words and counts produced by the job.

> [AZURE.NOTE] The output files of a MapReduce job are immutable. So if you rerun this sample, you need to change the name of the output file.

##<a id="troubleshooting"></a>Troubleshooting

If no information is returned when the job completes, an error may have occurred during processing. To view error information for this job, add the following command to the end of the **mapreducejob.ps1** file, save it, and then run it again.

	# Print the output of the WordCount job.
	Write-Host "Display the standard output ..." -ForegroundColor Green
	Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $wordCountJob.JobId -StandardError

This returns the information that was written to STDERR on the server when you ran the job, and it may help determine why the job is failing.

##<a id="summary"></a>Summary

As you can see, Azure PowerShell provides an easy way to run MapReduce jobs on an HDInsight cluster, monitor the job status, and retrieve the output.

##<a id="nextsteps"></a>Next steps

For general information about MapReduce jobs in HDInsight:

* [Use MapReduce on HDInsight Hadoop](hdinsight-use-mapreduce.md)

For information about other ways you can work with Hadoop on HDInsight:

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)

* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)
