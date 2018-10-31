---
title: Use MapReduce and PowerShell with Hadoop - Azure HDInsight 
description: Learn how to use PowerShell to remotely run MapReduce jobs with Hadoop on HDInsight.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 05/09/2018
ms.author: jasonh

---
# Run MapReduce jobs with Hadoop on HDInsight using PowerShell

[!INCLUDE [mapreduce-selector](../../../includes/hdinsight-selector-use-mapreduce.md)]

This document provides an example of using Azure PowerShell to run a MapReduce job in a Hadoop on HDInsight cluster.

## <a id="prereq"></a>Prerequisites

* **An Azure HDInsight (Hadoop on HDInsight) cluster**

  > [!IMPORTANT]
  > Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](../hdinsight-component-versioning.md#hdinsight-windows-retirement).

* **A workstation with Azure PowerShell**.

## <a id="powershell"></a>Run a MapReduce job

Azure PowerShell provides *cmdlets* that allow you to remotely run MapReduce jobs on HDInsight. Internally, PowerShell makes REST calls to [WebHCat](https://cwiki.apache.org/confluence/display/Hive/WebHCat) (formerly called Templeton) running on the HDInsight cluster.

The following cmdlets are used when running MapReduce jobs in a remote HDInsight cluster.

* **Connect-AzureRmAccount**: Authenticates Azure PowerShell to your Azure subscription.

* **New-AzureRmHDInsightMapReduceJobDefinition**: Creates a new *job definition* by using the specified MapReduce information.

* **Start-AzureRmHDInsightJob**: Sends the job definition to HDInsight and starts the job. A *job* object is returned.

* **Wait-AzureRmHDInsightJob**: Uses the job object to check the status of the job. It waits until the job completes or the wait time is exceeded.

* **Get-AzureRmHDInsightJobOutput**: Used to retrieve the output of the job.

The following steps demonstrate how to use these cmdlets to run a job in your HDInsight cluster.

1. Using an editor, save the following code as **mapreducejob.ps1**.

    [!code-powershell[main](../../../powershell_scripts/hdinsight/use-mapreduce/use-mapreduce.ps1?range=5-69)]

2. Open a new **Azure PowerShell** command prompt. Change directories to the location of the **mapreducejob.ps1** file, then use the following command to run the script:

        .\mapreducejob.ps1

    When you run the script, you are prompted for the name of the HDInsight cluster and the cluster login. You may also be prompted to authenticate to your Azure subscription.

3. When the job completes, you receive output similar to the following text:

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

    > [!NOTE]
    > If the **ExitCode** is a value other than 0, see [Troubleshooting](#troubleshooting).

    This example also stores the downloaded files to an **output.txt** file in the directory that you run the script from.

### View output

To see the words and counts produced by the job, open the **output.txt** file in a text editor.

> [!NOTE]
> The output files of a MapReduce job are immutable. So if you rerun this sample, you need to change the name of the output file.

## <a id="troubleshooting"></a>Troubleshooting

If no information is returned when the job completes, view errors for the job. To view error information for this job, add the following command to the end of the **mapreducejob.ps1** file, save it, and then run it again.

```powershell
# Print the output of the WordCount job.
Write-Host "Display the standard output ..." -ForegroundColor Green
Get-AzureRmHDInsightJobOutput `
        -Clustername $clusterName `
        -JobId $wordCountJob.JobId `
        -HttpCredential $creds `
        -DisplayOutputType StandardError
```

This cmdlet returns the information that was written to STDERR as the job runs.

## <a id="summary"></a>Summary

As you can see, Azure PowerShell provides an easy way to run MapReduce jobs on an HDInsight cluster, monitor the job status, and retrieve the output.

## <a id="nextsteps"></a>Next steps

For general information about MapReduce jobs in HDInsight:

* [Use MapReduce on HDInsight Hadoop](hdinsight-use-mapreduce.md)

For information about other ways you can work with Hadoop on HDInsight:

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)
* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)
