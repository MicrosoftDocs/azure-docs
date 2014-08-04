<properties linkid="manage-services-hdinsight-customize HDInsight Hadoop clusters" urlDisplayName="Get Started" pageTitle="Customize Hadoop clusters in HDInsight | Azure" metaKeywords="" description="Customize Hadoop clusters in HDInsight" metaCanonical="" services="hdinsight" documentationCenter="" title="Customize Hadoop clusters in HDInsight" authors="jgao" solutions="" manager="paulettm" editor="cgronlun" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="jgao" />




# Customize Hadoop clusters in HDInsight

Learn how to configure Hadoop clusters in HDInsight to get beyond the default configuration settings by using either Azure PowerShell or the HDInsight .NET SDK. A standard HDInsight configuration includes cluster name, number of data nodes, HDInsight version, region, Hadoop user name/password, Hive/Oozie metastore and one ore more storage accounts. For information on using the default configuration settings, see [Provision Hadoop clusters in HDInsight][hdinsight-provision].

After a cluster is provisioned, you can make changes to the configuration files on the cluster via a RDP session. However, the configurations will be lost when nodes reimages that Azure platform periodically performs for maintenance or error recovery reasons. For more information on re-imaging, see [Role Instance Restarts Due to OS Upgrades](http://blogs.msdn.com/b/kwill/archive/2012/09/19/role-instance-restarts-due-to-os-upgrades.aspx). This article covers the solution on for preserving the changes throughout the lifetime of the cluster at the provision time.  

##In this article

* [Understand Hadoop configuration on HDInsight](#config)
* [Customize Hadoop cluster during provision](#provision)
* [Next steps](#nextsteps)


##<a id="config"></a>Understand Hadoop configuration on HDInsight

The following chart illustrates the provision options and capabilities:

|Customization options|Azure portal|Azure PowerShell|HDInsight .NET SDK|CLI|Comments|
|---------------------|------------|----------------|------------------|---|--------|
|Hive/Oozie metastore|![HDI.Check.Mark][img-hdi-checkmark]|![HDI.Check.Mark][img-hdi-checkmark]|![HDI.Check.Mark][img-hdi-checkmark]||Azure SQL database is used as Hive/Oozie metastore|
|Additional Azure Storage accounts|![HDI.Check.Mark][img-hdi-checkmark]|![HDI.Check.Mark][img-hdi-checkmark]|![HDI.Check.Mark][img-hdi-checkmark]|||
|Hadoop configurations||![HDI.Check.Mark][img-hdi-checkmark]|![HDI.Check.Mark][img-hdi-checkmark]||Supported by all cluster versions.</br> Supported configuration files:</br><ul><li>core-site.xml</li><li>hdfs-site.xml</li><li>mapred-site.xml</li><li>capacity-scheduler.xml</li><li>hive-stie.xml</li><li>oozie-site.xml</li></ul>|
|Yarn configurations||![HDI.Check.Mark][img-hdi-checkmark]|![HDI.Check.Mark][img-hdi-checkmark]||Supported by HDInsight cluster 3.0 and later|
|Additional libraries||![HDI.Check.Mark][img-hdi-checkmark]|![HDI.Check.Mark][img-hdi-checkmark]||Shared libraries to the following Hadoop componnents: <br/> <ul><li>Hive</li><li>Oozie</li></ul>|


Use the Add-AzureHDInsightConfigValues cmdlet. For example:

	
	$configvalues = new-object 'Microsoft.WindowsAzure.Management.HDInsight.Cmdlet.DataObjects.AzureHDInsightHiveConfiguration'
	$configvalues.Configuration = @{ “hive.exec.compress.output”=”true” }

##<a id="provision"></a>Customize Hadoop cluster during provision





##<a name="nextsteps"></a>Next steps
In this article, you have learned how to customize HDInsight cluster. To learn more, see the following articles:

- [Get started using Hadoop 2.2 clusters with HDInsight][hdinsight-get-started-30]
- [Get started with the HDInsight Emulator][hdinsight-emulator]
- [Use Azure Blob storage with HDInsight][hdinsight-storage]
- [Administer HDInsight using PowerShell][hdinsight-admin-powershell]
- [Upload data to HDInsight][hdinsight-upload-data]
- [Use MapReduce with HDInsight][hdinsight-use-mapreduce]
- [Use Hive with HDInsight][hdinsight-use-hive]
- [Use Pig with HDInsight][hdinsight-use-pig]
- [Use Oozie with HDInsight][hdinsight-use-oozie]
- [Develop C# Hadoop streaming programs for HDInsight][hdinsight-develop-streaming]
- [Develop Java MapReduce programs for HDInsight][hdinsight-develop-mapreduce]


[img-hdi-checkmark]: ./hdinsight-customize-clusters/hdi.checkmark.png

[hdinsight-provision]: ../hdinsight-provision-clusters/#powershell
