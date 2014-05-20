<properties linkid="manage-services-hdinsight-customize HDInsight Hadoop clusters" urlDisplayName="Get Started" pageTitle="Customize Hadoop clusters in HDInsight | Azure" metaKeywords="" description="Customize Hadoop clusters in HDInsight" metaCanonical="" services="hdinsight" documentationCenter="" title="Customize Hadoop clusters in HDInsight" authors="jgao" solutions="" manager="paulettm" editor="cgronlun" />




# Customize Hadoop clusters in HDInsight

Learn how to configure Hadoop clusters in HDInsight to get beyond the default configuration settings by using either Azure PowerShell or the HDInsight .NET SDK. A standard HDInsight configuration includes cluster name, number of data nodes, HDInsight version, region, Hadoop user name/password, Hive/Oozie metastore and one ore more storage accounts. 






##In this tutorial

* [Understand Hadoop configuration on HDInsight](#config)
* [Customize Hadoop cluster during provision](#provision)
* [Customize Hadoop cluster after provision](#post-provision)
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



Make changes direction to the configuration files can't be retained during the life time of the cluster.
change certain hadoop configurations from default values and would like to preserve the changes throughout the lifetime of the cluster


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
