---
title: Use Hadoop Pig with PowerShell in HDInsight - Azure 
description: Learn how to submit Pig jobs to a Hadoop cluster on HDInsight using Azure PowerShell.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.topic: conceptual
ms.date: 05/09/2018
ms.author: jasonh

ms.custom: H1Hack27Feb2017,hdinsightactive
---
# Use Azure PowerShell to run Pig jobs with HDInsight

[!INCLUDE [pig-selector](../../../includes/hdinsight-selector-use-pig.md)]

This document provides an example of using Azure PowerShell to submit Pig jobs to a Hadoop on HDInsight cluster. Pig allows you to write MapReduce jobs by using a language (Pig Latin) that models data transformations, rather than map and reduce functions.

> [!NOTE]
> This document does not provide a detailed description of what the Pig Latin statements used in the examples do. For information about the Pig Latin used in this example, see [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md).

## <a id="prereq"></a>Prerequisites

* **An Azure HDInsight cluster**

  > [!IMPORTANT]
  > Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](../hdinsight-component-versioning.md#hdinsight-windows-retirement).

* **A workstation with Azure PowerShell**.

## <a id="powershell"></a>Run a Pig job

Azure PowerShell provides *cmdlets* that allow you to remotely run Pig jobs on HDInsight. Internally, PowerShell uses REST calls to [WebHCat](https://cwiki.apache.org/confluence/display/Hive/WebHCat) running on the HDInsight cluster.

The following cmdlets are used when running Pig jobs on a remote HDInsight cluster:

* **Connect-AzureRmAccount**: Authenticates Azure PowerShell to your Azure Subscription.
* **New-AzureRmHDInsightPigJobDefinition**: Creates a *job definition* by using the specified Pig Latin statements.
* **Start-AzureRmHDInsightJob**: Sends the job definition to HDInsight and starts the job. A *job* object is returned.
* **Wait-AzureRmHDInsightJob**: Uses the job object to check the status of the job. It waits until the job has completed, or the wait time has been exceeded.
* **Get-AzureRmHDInsightJobOutput**: Used to retrieve the output of the job.

The following steps demonstrate how to use these cmdlets to run a job on your HDInsight cluster.

1. Using an editor, save the following code as **pigjob.ps1**.

    [!code-powershell[main](../../../powershell_scripts/hdinsight/use-pig/use-pig.ps1?range=5-51)]

1. Open a new Windows PowerShell command prompt. Change directories to the location of the **pigjob.ps1** file, then use the following command to run the script:

        .\pigjob.ps1

    You are prompted to log in to your Azure subscription. Then, you are asked for the HTTPs/Admin account name and password for the HDInsight cluster.

2. When the job completes, it should return information similar to the following text:

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

If no information is returned when the job completes, view the error logs. To view error information for this job, add the following command to the end of the **pigjob.ps1** file, save it, and then run it again.

    # Print the output of the Pig job.
    Write-Host "Display the standard error output ..." -ForegroundColor Green
    Get-AzureRmHDInsightJobOutput `
            -Clustername $clusterName `
            -JobId $pigJob.JobId `
            -HttpCredential $creds `
            -DisplayOutputType StandardError

This cmdlet returns the information that was written to STDERR during job processing.

## <a id="summary"></a>Summary
As you can see, Azure PowerShell provides an easy way to run Pig jobs on an HDInsight cluster, monitor the job status, and retrieve the output.

## <a id="nextsteps"></a>Next steps
For general information about Pig in HDInsight:

* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)

For information about other ways you can work with Hadoop on HDInsight:

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)
* [Use MapReduce with Hadoop on HDInsight](hdinsight-use-mapreduce.md)
