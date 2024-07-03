---
title: Use Apache Hive with PowerShell in HDInsight - Azure 
description: Use PowerShell to run Apache Hive queries in Apache Hadoop in Azure HDInsight
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive, devx-track-azurepowershell
ms.date: 09/14/2023
---

# Run Apache Hive queries using PowerShell

[!INCLUDE [hive-selector](../includes/hdinsight-selector-use-hive.md)]

This document provides an example of using Azure PowerShell to run Apache Hive queries in an Apache Hadoop on HDInsight cluster.

> [!NOTE]  
> This document does not provide a detailed description of what the HiveQL statements that are used in the examples do. For information on the HiveQL that is used in this example, see [Use Apache Hive with Apache Hadoop on HDInsight](hdinsight-use-hive.md).

## Prerequisites

* An Apache Hadoop cluster on HDInsight. See [Get Started with HDInsight on Linux](./apache-hadoop-linux-tutorial-get-started.md).

* The PowerShell [Az Module](/powershell/azure/) installed.

## Run a Hive query

Azure PowerShell provides *cmdlets* that allow you to remotely run Hive queries on HDInsight. Internally, the cmdlets make REST calls to [WebHCat](https://cwiki.apache.org/confluence/display/Hive/WebHCat) on the HDInsight cluster.

The following cmdlets are used when running Hive queries in a remote HDInsight cluster:

* `Connect-AzAccount`: Authenticates Azure PowerShell to your Azure subscription.
* `New-AzHDInsightHiveJobDefinition`: Creates a *job definition* by using the specified HiveQL statements.
* `Start-AzHDInsightJob`: Sends the job definition to HDInsight and starts the job. A *job* object is returned.
* `Wait-AzHDInsightJob`: Uses the job object to check the status of the job. It waits until the job completes or the wait time is exceeded.
* `Get-AzHDInsightJobOutput`: Used to retrieve the output of the job.
* `Invoke-AzHDInsightHiveJob`: Used to run HiveQL statements. This cmdlet blocks the query completes, then returns the results.
* `Use-AzHDInsightCluster`: Sets the current cluster to use for the `Invoke-AzHDInsightHiveJob` command.

The following steps demonstrate how to use these cmdlets to run a job in your HDInsight cluster:

1. Using an editor, save the following code as `hivejob.ps1`.

    [!code-powershell[main](../../../powershell_scripts/hdinsight/use-hive/use-hive.ps1?range=5-42)]

2. Open a new **Azure PowerShell** command prompt. Change directories to the location of the `hivejob.ps1` file, then use the following command to run the script:

    ```azurepowershell
    .\hivejob.ps1
    ```

    When the script runs, you're prompted to enter the cluster name and the HTTPS/Cluster Admin account credentials. You may also be prompted to sign in to your Azure subscription.

3. When the job completes, it returns information similar to the following text:

    ```output
    Display the standard output...
    2012-02-03      18:35:34        SampleClass0    [ERROR] incorrect       id
    2012-02-03      18:55:54        SampleClass1    [ERROR] incorrect       id
    2012-02-03      19:25:27        SampleClass4    [ERROR] incorrect       id
    ```

4. As mentioned earlier, `Invoke-Hive` can be used to run a query and wait for the response. Use the following script to see how Invoke-Hive works:

    [!code-powershell[main](../../../powershell_scripts/hdinsight/use-hive/use-hive.ps1?range=50-71)]

    The output looks like the following text:

    ```output
    2012-02-03    18:35:34    SampleClass0    [ERROR]    incorrect    id
    2012-02-03    18:55:54    SampleClass1    [ERROR]    incorrect    id
    2012-02-03    19:25:27    SampleClass4    [ERROR]    incorrect    id
    ```

   > [!NOTE]  
   > For longer HiveQL queries, you can use the Azure PowerShell **Here-Strings** cmdlet or HiveQL script files. The following snippet shows how to use the `Invoke-Hive` cmdlet to run a HiveQL script file. The HiveQL script file must be uploaded to wasbs://.
   >
   > `Invoke-AzHDInsightHiveJob -File "wasbs://<ContainerName>@<StorageAccountName>/<Path>/query.hql"`
   >
   > For more information about **Here-Strings**, see [HERE-STRINGS](/powershell/module/microsoft.powershell.core/about/about_quoting_rules#here-strings).

## Troubleshooting

If no information is returned when the job completes, view the error logs. To view error information for this job, add the following to the end of the `hivejob.ps1` file, save it, and then run it again.

```powershell
# Print the output of the Hive job.
Get-AzHDInsightJobOutput `
        -Clustername $clusterName `
        -JobId $job.JobId `
        -HttpCredential $creds `
        -DisplayOutputType StandardError
```

This cmdlet returns the information that is written to STDERR during job processing.

## Summary

As you can see, Azure PowerShell provides an easy way to run Hive queries in an HDInsight cluster, monitor the job status, and retrieve the output.

## Next steps

For general information about Hive in HDInsight:

* [Use Apache Hive with Apache Hadoop on HDInsight](hdinsight-use-hive.md)

For information about other ways you can work with Hadoop on HDInsight:

* [Use MapReduce with Apache Hadoop on HDInsight](hdinsight-use-mapreduce.md)
