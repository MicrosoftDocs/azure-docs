<properties
   pageTitle="Use MapReduce and PowerShell with Hadoop | Microsoft Azure"
   description="Learn how to use PowerShell to remotely run MapReduce jobs with Hadoop on HDInsight."
   services="hdinsight"
   documentationCenter=""
   authors="Blackmist"
   manager="paulettm"
   editor="cgronlun"
	tags="azure-portal"/>

<tags
   ms.service="hdinsight"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="05/18/2016"
   ms.author="larryfr"/>

#Run Hive queries with Hadoop on HDInsight using PowerShell

[AZURE.INCLUDE [mapreduce-selector](../../includes/hdinsight-selector-use-mapreduce.md)]

This document provides an example of using Azure PowerShell to run a MapReduce job in a Hadoop on HDInsight cluster.

##<a id="prereq"></a>Prerequisites

To complete the steps in this article, you will need the following:

- **An Azure HDInsight (Hadoop on HDInsight) cluster (Windows-based or Linux-based)**

- **A workstation with Azure PowerShell**.

    [AZURE.INCLUDE [upgrade-powershell](../../includes/hdinsight-use-latest-powershell.md)]

##<a id="powershell"></a>Run a MapReduce job using Azure PowerShell

Azure PowerShell provides *cmdlets* that allow you to remotely run MapReduce jobs on HDInsight. Internally, this is accomplished by using REST calls to [WebHCat](https://cwiki.apache.org/confluence/display/Hive/WebHCat) (formerly called Templeton) running on the HDInsight cluster.

The following cmdlets are used when running MapReduce jobs in a remote HDInsight cluster.

* **Login-AzureRmAccount**: Authenticates Azure PowerShell to your Azure subscription

* **New-AzureRmHDInsightMapReduceJobDefinition**: Creates a new *job definition* by using the specified MapReduce information

* **Start-AzureRmHDInsightJob**: Sends the job definition to HDInsight, starts the job, and returns a *job* object that can be used to check the status of the job

* **Wait-AzureRmHDInsightJob**: Uses the job object to check the status of the job. It waits until the job completes or the wait time is exceeded.

* **Get-AzureRmHDInsightJobOutput**: Used to retrieve the output of the job

The following steps demonstrate how to use these cmdlets to run a job in your HDInsight cluster.

1. Using an editor, save the following code as **mapreducejob.ps1**. You must replace **CLUSTERNAME** with the name of your HDInsight cluster.

        #Specify the values
        $clusterName = "CLUSTERNAME"
                
        # Login to your Azure subscription
        # Is there an active Azure subscription?
        $sub = Get-AzureRmSubscription -ErrorAction SilentlyContinue
        if(-not($sub))
        {
            Login-AzureRmAccount
        }

        #Get HTTPS/Admin credentials for submitting the job later
        $creds = Get-Credential
        #Get the cluster info so we can get the resource group, storage, etc.
        $clusterInfo = Get-AzureRmHDInsightCluster -ClusterName $clusterName
        $resourceGroup = $clusterInfo.ResourceGroup
        $storageAccountName=$clusterInfo.DefaultStorageAccount.split('.')[0]
        $container=$clusterInfo.DefaultStorageContainer
        $storageAccountKey=(Get-AzureRmStorageAccountKey `
            -Name $storageAccountName `
        -ResourceGroupName $resourceGroup)[0].Value

        #Create a storage content and upload the file
        $context = New-AzureStorageContext `
            -StorageAccountName $storageAccountName `
            -StorageAccountKey $storageAccountKey
            
        #Define the MapReduce job
        #NOTE: If using an HDInsight 2.0 cluster, use hadoop-examples.jar instead.
        # -JarFile = the JAR containing the MapReduce application
        # -ClassName = the class of the application
        # -Arguments = The input file, and the output directory
        $wordCountJobDefinition = New-AzureRmHDInsightMapReduceJobDefinition `
            -JarFile "wasbs:///example/jars/hadoop-mapreduce-examples.jar" `
            -ClassName "wordcount" `
            -Arguments `
                "wasbs:///example/data/gutenberg/davinci.txt", `
                "wasbs:///example/data/WordCountOutput"

        #Submit the job to the cluster
        Write-Host "Start the MapReduce job..." -ForegroundColor Green
        $wordCountJob = Start-AzureRmHDInsightJob `
            -ClusterName $clusterName `
            -JobDefinition $wordCountJobDefinition `
            -HttpCredential $creds

        #Wait for the job to complete
        Write-Host "Wait for the job to complete..." -ForegroundColor Green
        Wait-AzureRmHDInsightJob `
            -ClusterName $clusterName `
            -JobId $wordCountJob.JobId `
            -HttpCredential $creds
        # Download the output
        Get-AzureStorageBlobContent `
            -Blob 'example/data/WordCountOutput/part-r-00000' `
            -Container $container `
            -Destination output.txt `
            -Context $context
        # Print the output
        Get-AzureRmHDInsightJobOutput `
            -Clustername $clusterName `
            -JobId $wordCountJob.JobId `
            -DefaultContainer $container `
            -DefaultStorageAccountName $storageAccountName `
            -DefaultStorageAccountKey $storageAccountKey `
            -HttpCredential $creds
            
2. Open a new **Azure PowerShell** command prompt. Change directories to the location of the **mapreducejob.ps1** file, then use the following command to run the script:

		.\mapreducejob.ps1
    
    When you run the script, you may be prompted to authenticate to your Azure subscription. You will also be asked to provide the HTTPS/Admin account name and password for the HDInsight cluster.

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

    This example will also store the downloaded files to the  **example/data/WordCountOutput** folder in the directory that you run the script from.

##View output

The output of the MapReduce job is stored in files with the name *part-r-#####*. Open the **example/data/WordCountOutput/part-r-00000** file in a text editor to see the words and counts produced by the job.

> [AZURE.NOTE] The output files of a MapReduce job are immutable. So if you rerun this sample, you need to change the name of the output file.

##<a id="troubleshooting"></a>Troubleshooting

If no information is returned when the job completes, an error may have occurred during processing. To view error information for this job, add the following command to the end of the **mapreducejob.ps1** file, save it, and then run it again.

	# Print the output of the WordCount job.
	Write-Host "Display the standard output ..." -ForegroundColor Green
	Get-AzureRmHDInsightJobOutput `
            -Clustername $clusterName `
            -JobId $wordCountJob.JobId `
            -DefaultContainer $container `
            -DefaultStorageAccountName $storageAccountName `
            -DefaultStorageAccountKey $storageAccountKey `
            -HttpCredential $creds `
            -DisplayOutputType StandardError

This returns the information that was written to STDERR on the server when you ran the job, and it may help determine why the job is failing.

##<a id="summary"></a>Summary

As you can see, Azure PowerShell provides an easy way to run MapReduce jobs on an HDInsight cluster, monitor the job status, and retrieve the output.

##<a id="nextsteps"></a>Next steps

For general information about MapReduce jobs in HDInsight:

* [Use MapReduce on HDInsight Hadoop](hdinsight-use-mapreduce.md)

For information about other ways you can work with Hadoop on HDInsight:

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)

* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)
