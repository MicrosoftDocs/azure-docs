<properties
   pageTitle="Use Hadoop Pig with PowerShell in HDInsight | Microsoft Azure"
   description="Learn how to submit Pig jobs to a Hadoop cluster on HDInsight using Azure PowerShell."
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
   ms.date="07/25/2016"
   ms.author="larryfr"/>

#Run Pig jobs using PowerShell

[AZURE.INCLUDE [pig-selector](../../includes/hdinsight-selector-use-pig.md)]

This document provides an example of using Azure PowerShell to submit Pig jobs to a Hadoop on HDInsight cluster. Pig allows you to write MapReduce jobs by using a language (Pig Latin,) that models data transformations, rather than map and reduce functions.

> [AZURE.NOTE] This document does not provide a detailed description of what the Pig Latin statements used in the examples do. For information about the Pig Latin used in this example, see [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md).

##<a id="prereq"></a>Prerequisites

To complete the steps in this article, you will need the following.

- **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
- **A workstation with Azure PowerShell**.

    [AZURE.INCLUDE [upgrade-powershell](../../includes/hdinsight-use-latest-powershell.md)]


##<a id="powershell"></a>Run Pig jobs using PowerShell

Azure PowerShell provides *cmdlets* that allow you to remotely run Pig jobs on HDInsight. Internally, this is accomplished by using REST calls to [WebHCat](https://cwiki.apache.org/confluence/display/Hive/WebHCat) (formerly called Templeton) running on the HDInsight cluster.

The following cmdlets are used when running Pig jobs on a remote HDInsight cluster:

* **Login-AzureRmAccount**: Authenticates Azure PowerShell to your Azure Subscription

* **New-AzureRmHDInsightPigJobDefinition**: Creates a new *job definition* by using the specified Pig Latin statements

* **Start-AzureRmHDInsightJob**: Sends the job definition to HDInsight, starts the job, and returns a *job* object that can be used to check the status of the job

* **Wait-AzureRmHDInsightJob**: Uses the job object to check the status of the job. It will wait until the job has completed, or the wait time has been exceeded.

* **Get-AzureRmHDInsightJobOutput**: Used to retrieve the output of the job

The following steps demonstrate how to use these cmdlets to run a job on your HDInsight cluster.

1. Using an editor, save the following code as **pigjob.ps1**. You must replace **CLUSTERNAME** with the name of your HDInsight cluster.

        #Login to your Azure subscription
        Login-AzureRmAccount
        #Get credentials for the admin/HTTPs account
        $creds = Get-Credential

        #Specify the cluster name
        $clusterName = "CLUSTERNAME"
        
        #Get the cluster info so we can get the resource group, storage, etc.
        $clusterInfo = Get-AzureRmHDInsightCluster -ClusterName $clusterName
        $resourceGroup = $clusterInfo.ResourceGroup
        $storageAccountName = $clusterInfo.DefaultStorageAccount.split('.')[0]
        $container = $clusterInfo.DefaultStorageContainer
        $storageAccountKey = (Get-AzureRmStorageAccountKey `
            -Name $storageAccountName `
        -ResourceGroupName $resourceGroup)[0].Value

        #Store the Pig Latin into $QueryString
        $QueryString =  "LOGS = LOAD 'wasbs:///example/data/sample.log';" +
        "LEVELS = foreach LOGS generate REGEX_EXTRACT(`$0, '(TRACE|DEBUG|INFO|WARN|ERROR|FATAL)', 1)  as LOGLEVEL;" +
        "FILTEREDLEVELS = FILTER LEVELS by LOGLEVEL is not null;" +
        "GROUPEDLEVELS = GROUP FILTEREDLEVELS by LOGLEVEL;" +
        "FREQUENCIES = foreach GROUPEDLEVELS generate group as LOGLEVEL, COUNT(FILTEREDLEVELS.LOGLEVEL) as COUNT;" +
        "RESULT = order FREQUENCIES by COUNT desc;" +
        "DUMP RESULT;"


        #Create a new HDInsight Pig Job definition
        $pigJobDefinition = New-AzureRmHDInsightPigJobDefinition `
            -Query $QueryString `
            -Arguments "-w"

        # Start the Pig job on the HDInsight cluster
        Write-Host "Start the Pig job ..." -ForegroundColor Green
        $pigJob = Start-AzureRmHDInsightJob `
            -ClusterName $clusterName `
            -JobDefinition $pigJobDefinition `
            -HttpCredential $creds

        # Wait for the Pig job to complete
        Write-Host "Wait for the Pig job to complete ..." -ForegroundColor Green
        Wait-AzureRmHDInsightJob `
            -ClusterName $clusterName `
            -JobId $pigJob.JobId `
            -HttpCredential $creds

        # Display the output of the Pig job.
        Write-Host "Display the standard output ..." -ForegroundColor Green
        Get-AzureRmHDInsightJobOutput `
            -ClusterName $clusterName `
            -JobId $pigJob.JobId `
            -DefaultContainer $container `
            -DefaultStorageAccountName $storageAccountName `
            -DefaultStorageAccountKey $storageAccountKey `
            -HttpCredential $creds

2. Open a new Windows PowerShell command prompt. Change directories to the location of the **pigjob.ps1** file, then use the following command to run the script:

		.\pigjob.ps1
        
    You will first be prompted to login to your Azure subscription. Then, you will be asked for the HTTPs/Admin account name and password for the HDInsight cluster.

7. When the job completes, it should return information similar to the following:

        Start the Pig job ...
        Wait for the Pig job to complete ...
        Display the standard output ...
        (TRACE,816)
        (DEBUG,434)
        (INFO,96)
        (WARN,11)
        (ERROR,6)
        (FATAL,2)

##<a id="troubleshooting"></a>Troubleshooting

If no information is returned when the job completes, an error may have occurred during processing. To view error information for this job, add the following command to the end of the **pigjob.ps1** file, save it, and then run it again.

	# Print the output of the Pig job.
	Write-Host "Display the standard error output ..." -ForegroundColor Green
    Get-AzureRmHDInsightJobOutput `
            -Clustername $clusterName `
            -JobId $pigJob.JobId `
            -DefaultContainer $container `
            -DefaultStorageAccountName $storageAccountName `
            -DefaultStorageAccountKey $storageAccountKey `
            -HttpCredential $creds `
            -DisplayOutputType StandardError

This will return the information that was written to STDERR on the server when you ran the job, and it may help determine why the job is failing.

##<a id="summary"></a>Summary

As you can see, Azure PowerShell provides an easy way to run Pig jobs on an HDInsight cluster, monitor the job status, and retrieve the output.

##<a id="nextsteps"></a>Next steps

For general information about Pig in HDInsight:

* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)

For information about other ways you can work with Hadoop on HDInsight:

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)

* [Use MapReduce with Hadoop on HDInsight](hdinsight-use-mapreduce.md)
