---
title: Debug and analyze Hadoop services with heap dumps - Azure 
description: Automatically collect heap dumps for Hadoop services and place inside the Azure Blob storage account for debugging and analysis.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.topic: conceptual
ms.date: 05/25/2017
ms.author: jasonh
ROBOTS: NOINDEX

---
# Collect heap dumps in Blob storage to debug and analyze Hadoop services
[!INCLUDE [heapdump-selector](../../includes/hdinsight-selector-heap-dump.md)]

Heap dumps contain a snapshot of the application's memory, including the values of variables
at the time the dump was created. So they are useful for diagnosing problems that occur
at run-time. Heap dumps can be automatically collected for Hadoop services and placed inside
the Azure Blob storage account of a user under HDInsightHeapDumps/.

The collection of heap dumps for various services must be enabled for services on individual
clusters. The default for this feature is to be off for a cluster. These heap dumps can be
large, so it is advisable to monitor the Blob storage account where they are being saved
once the collection has been enabled.

> [!IMPORTANT]
> Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](hdinsight-component-versioning.md#hdinsight-windows-retirement). The information in this article only applies to Windows-based HDInsight. 
> For information on Linux-based HDInsight, see [Enable heap dumps for Hadoop services on
> Linux-based HDInsight](hdinsight-hadoop-collect-debug-heap-dump-linux.md)


## Eligible services for heap dumps
You can enable heap dumps for the following services:

* **hcatalog** - tempelton
* **hive** - hiveserver2, metastore, derbyserver
* **mapreduce** - jobhistoryserver
* **yarn** - resourcemanager, nodemanager, timelineserver
* **hdfs** - datanode, secondarynamenode, namenode

## Configuration elements that enable heap dumps
To turn on heap dumps for a service, you need to set the appropriate configuration elements
in the section for that service, which is specified by **service_name**.

    "javaargs.<service_name>.XX:+HeapDumpOnOutOfMemoryError" = "-XX:+HeapDumpOnOutOfMemoryError",
    "javaargs.<service_name>.XX:HeapDumpPath" = "-XX:HeapDumpPath=c:\Dumps\<service_name>_%date:~4,2%%date:~7,2%%date:~10,2%%time:~0,2%%time:~3,2%%time:~6,2%.hprof"

The value of **service_name** can be any of the services listed here:
tempelton, hiveserver2, metastore, derbyserver, jobhistoryserver, resourcemanager, nodemanager, timelineserver, datanode, secondarynamenode, or namenode.

## Enable using Azure PowerShell
For example, to turn on heap dumps by using Azure PowerShell for jobhistoryserver, you can use the following script:

[!INCLUDE [upgrade-powershell](../../includes/hdinsight-use-latest-powershell.md)]

    $MapRedConfigValues = new-object 'Microsoft.WindowsAzure.Management.HDInsight.Cmdlet.DataObjects.AzureHDInsightMapReduceConfiguration'

    $MapRedConfigValues.Configuration = @{ "javaargs.jobhistoryserver.XX:+HeapDumpOnOutOfMemoryError"="-XX:+HeapDumpOnOutOfMemoryError" ; "javaargs.jobhistoryserver.XX:HeapDumpPath" = "-XX:HeapDumpPath=c:\\Dumps\\jobhistoryserver_%date:~4,2%_%date:~7,2%_%date:~10,2%_%time:~0,2%_%time:~3,2%_%time:~6,2%.hprof" }

## Enable using .NET SDK
For example, to turn on heap dumps by using the Azure HDInsight .NET SDK for jobhistoryserver, you can use the following code:

    clusterInfo.MapReduceConfiguration.ConfigurationCollection.Add(new KeyValuePair<string, string>("javaargs.jobhistoryserver.XX:+HeapDumpOnOutOfMemoryError", "-XX:+HeapDumpOnOutOfMemoryError"));

    clusterInfo.MapReduceConfiguration.ConfigurationCollection.Add(new KeyValuePair<string, string>("javaargs.jobhistoryserver.XX:HeapDumpPath", "-XX:HeapDumpPath=c:\\Dumps\\jobhistoryserver_%date:~4,2%_%date:~7,2%_%date:~10,2%_%time:~0,2%_%time:~3,2%_%time:~6,2%.hprof"));
