---
title: Use Hadoop Pig with PowerShell in HDInsight | Microsoft Docs
description: Learn how to submit Pig jobs to a Hadoop cluster on HDInsight using Azure PowerShell.
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.assetid: 737089c1-b494-4387-9def-7b4dac3be532
ms.service: hdinsight
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 01/19/2017
ms.author: larryfr

---
# Run Pig jobs using PowerShell
[!INCLUDE [pig-selector](../../includes/hdinsight-selector-use-pig.md)]

This document provides an example of using Azure PowerShell to submit Pig jobs to a Hadoop on HDInsight cluster. Pig allows you to write MapReduce jobs by using a language (Pig Latin,) that models data transformations, rather than map and reduce functions.

> [!NOTE]
> This document does not provide a detailed description of what the Pig Latin statements used in the examples do. For information about the Pig Latin used in this example, see [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md).
> 
> 

## <a id="prereq"></a>Prerequisites
To complete the steps in this article, you will need the following.

* **An Azure HDInsight cluster**

  > [!IMPORTANT]
  > Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight Deprecation on Windows](hdinsight-component-versioning.md#hdi-version-32-and-33-nearing-deprecation-date).

* **A workstation with Azure PowerShell**.

[!INCLUDE [upgrade-powershell](../../includes/hdinsight-use-latest-powershell.md)]

## <a id="powershell"></a>Run Pig jobs using PowerShell
Azure PowerShell provides *cmdlets* that allow you to remotely run Pig jobs on HDInsight. Internally, this is accomplished by using REST calls to [WebHCat](https://cwiki.apache.org/confluence/display/Hive/WebHCat) (formerly called Templeton) running on the HDInsight cluster.

The following cmdlets are used when running Pig jobs on a remote HDInsight cluster:

* **Login-AzureRmAccount**: Authenticates Azure PowerShell to your Azure Subscription
* **New-AzureRmHDInsightPigJobDefinition**: Creates a new *job definition* by using the specified Pig Latin statements
* **Start-AzureRmHDInsightJob**: Sends the job definition to HDInsight, starts the job, and returns a *job* object that can be used to check the status of the job
* **Wait-AzureRmHDInsightJob**: Uses the job object to check the status of the job. It will wait until the job has completed, or the wait time has been exceeded.
* **Get-AzureRmHDInsightJobOutput**: Used to retrieve the output of the job

The following steps demonstrate how to use these cmdlets to run a job on your HDInsight cluster.

1. Using an editor, save the following code as **pigjob.ps1**.
   
        # Login to your Azure subscription
        # Is there an active Azure subscription?
        $sub = Get-AzureRmSubscription -ErrorAction SilentlyContinue
        if(-not($sub))
        {
            Add-AzureRmAccount
        }

        # Get cluster info
        $clusterName = Read-Host -Prompt "Enter the HDInsight cluster name"
        $creds=Get-Credential -Message "Enter the login for the cluster"

        #Store the Pig Latin into $QueryString
        $QueryString =  "LOGS = LOAD 'wasb:///example/data/sample.log';" +
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
            -HttpCredential $creds


1. Open a new Windows PowerShell command prompt. Change directories to the location of the **pigjob.ps1** file, then use the following command to run the script:
   
        .\pigjob.ps1
   
    You will first be prompted to login to your Azure subscription. Then, you will be asked for the HTTPs/Admin account name and password for the HDInsight cluster.

2. When the job completes, it should return information similar to the following:
   
        Start the Pig job ...
        Wait for the Pig job to complete ...
        Display the standard output ...
        (TRACE,816)
        (DEBUG,434)
        (INFO,96)
        (WARN,11)
        (ERROR,6)
        (FATAL,2)

## <a id="troubleshooting"></a>Troubleshooting

If no information is returned when the job completes, an error may have occurred during processing. To view error information for this job, add the following command to the end of the **pigjob.ps1** file, save it, and then run it again.

    # Print the output of the Pig job.
    Write-Host "Display the standard error output ..." -ForegroundColor Green
    Get-AzureRmHDInsightJobOutput `
            -Clustername $clusterName `
            -JobId $pigJob.JobId `
            -HttpCredential $creds `
            -DisplayOutputType StandardError

This will return the information that was written to STDERR on the server when you ran the job, and it may help determine why the job is failing.

## <a id="summary"></a>Summary
As you can see, Azure PowerShell provides an easy way to run Pig jobs on an HDInsight cluster, monitor the job status, and retrieve the output.

## <a id="nextsteps"></a>Next steps
For general information about Pig in HDInsight:

* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)

For information about other ways you can work with Hadoop on HDInsight:

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)
* [Use MapReduce with Hadoop on HDInsight](hdinsight-use-mapreduce.md)

