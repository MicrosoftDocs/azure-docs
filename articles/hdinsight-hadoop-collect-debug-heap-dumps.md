<properties linkid="collect heap dumps" urlDisplayName="Collect Heap Dumps for Debugging and Analysis" pageTitle="Collect Heap Dumps for Debugging and Analysis| Azure" metaKeywords="" description="Collect Heap Dumps for Debugging and Analysis" metaCanonical="" services="hdinsight" documentationCenter="" title="Collect Heap Dumps for Debugging and Analysis" authors="bradsev" solutions="" manager="paulettm" editor="cgronlun" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="12/08/2014" ms.author="bradsev" />

# Collect Heap Dumps for Debugging and Analysis

Heap dumps can be automatically collected for Hadoop services and placed inside the blob storage account of a user under HDInsightHeapDumps/.  Dump files for a service with heaps contain a snapshot of the application's memory. This includes the values of variables at the time the dump was created.

The collection of heap dumps for various services must be enabled for services on individual clusters. The default for this feature is to be off for a cluster. These heap dumps can be large in size so it is advisable to monitor the blob storage account where they are being saved once the collection has been enabled.

## In this article

- [For which services can heap dumps be enabled?](#whichServices)
- [The configuration elements that enable heap dumps](#configuration)
- [How to enable heap dumps with Azure HDInsight PowerShell](#powershell)
- [How to enable heap dumps with HDInsight .NET SDK](#sdk)


## <a name="whichServices"></a>For which services can heap dumps be enabled?

The services which can have heap dumps enabled if requested are: 

*  **hcatalog**: tempelton
*  **hive**: hiveserver2, metastore, derbyserver 
*  **mapreduce**: jobhistoryserver 
*  **yarn**: resourcemanager, nodemanager, timelineserver 
*  **hdfs**: datanode, secondarynamenode, namenode

## <a name="configuration"></a>The configuration elements that enable heap dumps

In order to turn on heap dumps for a service the user needs to set the appropriate configuration elements in the section for that service, which is specified by the service_name.

	"javaargs.<service_name>.XX:+HeapDumpOnOutOfMemoryError" = "-XX:+HeapDumpOnOutOfMemoryError",
	"javaargs.<service_name>.XX:HeapDumpPath" = "-XX:HeapDumpPath=c:\Dumps\<service_name>_%date:~4,2%%date:~7,2%%date:~10,2%%time:~0,2%%time:~3,2%%time:~6,2%.hprof" 

The value of the <service_name> can be any of the services listed above: tempelton, hiveserver2, metastore, derbyserver, jobhistoryserver, resourcemanager, nodemanager, timelineserver, datanode, secondarynamenode, or namenode.

## <a name="powershell"></a>How to enable heap dumps with Azure HDInsight PowerShell

For example, to turn on heap dumps using PowerShell for the jobhistoryserver the user would do the following:

Using powershell sdk:

	$MapRedConfigValues = new-object 'Microsoft.WindowsAzure.Management.HDInsight.Cmdlet.DataObjects.AzureHDInsightMapReduceConfiguration'

	$MapRedConfigValues.Configuration = @{ "javaargs.jobhistoryserver.XX:+HeapDumpOnOutOfMemoryError"="-XX:+HeapDumpOnOutOfMemoryError" ; "javaargs.jobhistoryserver.XX:HeapDumpPath" = "-XX:HeapDumpPath=c:\\Dumps\\jobhistoryserver_%date:~4,2%_%date:~7,2%_%date:~10,2%_%time:~0,2%_%time:~3,2%_%time:~6,2%.hprof" }

## <a name="sdk"></a>How to enable heap dumps with Azure HDInsight .NET SDK

For example, to turn on heap dumps using the .NET SDK for the jobhistoryserver the user would do the following:

Using c# sdk:

	clusterInfo.MapReduceConfiguration.ConfigurationCollection.Add(new KeyValuePair<string, string>("javaargs.jobhistoryserver.XX:+HeapDumpOnOutOfMemoryError", "-XX:+HeapDumpOnOutOfMemoryError"));

	clusterInfo.MapReduceConfiguration.ConfigurationCollection.Add(new KeyValuePair<string, string>("javaargs.jobhistoryserver.XX:HeapDumpPath", "-XX:HeapDumpPath=c:\\Dumps\\jobhistoryserver_%date:~4,2%_%date:~7,2%_%date:~10,2%_%time:~0,2%_%time:~3,2%_%time:~6,2%.hprof"));



