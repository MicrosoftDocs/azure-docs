<properties 
	pageTitle="Collect Heap Dumps for Debugging and Analysis| Azure" 
	description="Collect Heap Dumps for Debugging and Analysis" 
	services="hdinsight" 
	documentationCenter="" 
	authors="bradsev" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="hdinsight" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/31/2015" 
	ms.author="bradsev"/>

# Collect heap dumps for debugging and analysis

Heap dumps can be automatically collected for Hadoop services and placed inside the Azure Blob storage account of a user under HDInsightHeapDumps/. Dump files for a service with heaps contain a snapshot of the application's memory. This includes the values of variables at the time the dump was created.

The collection of heap dumps for various services must be enabled for services on individual clusters. The default for this feature is to be off for a cluster. These heap dumps can be large, so it is advisable to monitor the Blob storage account where they are being saved once the collection has been enabled.


## <a name="whichServices"></a>Eligible services for heap dumps

The services that can have heap dumps enabled if requested are: 

*  **hcatalog** - tempelton
*  **hive** - hiveserver2, metastore, derbyserver 
*  **mapreduce** - jobhistoryserver 
*  **yarn** - resourcemanager, nodemanager, timelineserver 
*  **hdfs** - datanode, secondarynamenode, namenode

## <a name="configuration"></a>Configuration elements that enable heap dumps

To turn on heap dumps for a service, you need to set the appropriate configuration elements in the section for that service, which is specified by **service_name**.

	"javaargs.<service_name>.XX:+HeapDumpOnOutOfMemoryError" = "-XX:+HeapDumpOnOutOfMemoryError",
	"javaargs.<service_name>.XX:HeapDumpPath" = "-XX:HeapDumpPath=c:\Dumps\<service_name>_%date:~4,2%%date:~7,2%%date:~10,2%%time:~0,2%%time:~3,2%%time:~6,2%.hprof" 

The value of **service_name** can be any of the services listed above: tempelton, hiveserver2, metastore, derbyserver, jobhistoryserver, resourcemanager, nodemanager, timelineserver, datanode, secondarynamenode, or namenode.

## <a name="powershell"></a>How to enable heap dumps by using Azure PowerShell

For example, to turn on heap dumps by using Azure PowerShell for jobhistoryserver, you would do the following:

	$MapRedConfigValues = new-object 'Microsoft.WindowsAzure.Management.HDInsight.Cmdlet.DataObjects.AzureHDInsightMapReduceConfiguration'

	$MapRedConfigValues.Configuration = @{ "javaargs.jobhistoryserver.XX:+HeapDumpOnOutOfMemoryError"="-XX:+HeapDumpOnOutOfMemoryError" ; "javaargs.jobhistoryserver.XX:HeapDumpPath" = "-XX:HeapDumpPath=c:\\Dumps\\jobhistoryserver_%date:~4,2%_%date:~7,2%_%date:~10,2%_%time:~0,2%_%time:~3,2%_%time:~6,2%.hprof" }

## <a name="sdk"></a>How to enable heap dumps by using the Azure HDInsight .NET SDK

For example, to turn on heap dumps by using the Azure HDInsight .NET SDK for jobhistoryserver, you would do the following:

	clusterInfo.MapReduceConfiguration.ConfigurationCollection.Add(new KeyValuePair<string, string>("javaargs.jobhistoryserver.XX:+HeapDumpOnOutOfMemoryError", "-XX:+HeapDumpOnOutOfMemoryError"));

	clusterInfo.MapReduceConfiguration.ConfigurationCollection.Add(new KeyValuePair<string, string>("javaargs.jobhistoryserver.XX:HeapDumpPath", "-XX:HeapDumpPath=c:\\Dumps\\jobhistoryserver_%date:~4,2%_%date:~7,2%_%date:~10,2%_%time:~0,2%_%time:~3,2%_%time:~6,2%.hprof"));



