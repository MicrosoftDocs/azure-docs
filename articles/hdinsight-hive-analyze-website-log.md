<properties 
	pageTitle="Use Hive with Hadoop for website log analysis| Microsoft Azure" 
	description="Learn how to use Hive with HDInsight to analyze website logs. You'll use a log file as input into an HDInsight table, and use HiveQL to query the data." 
	services="hdinsight" 
	documentationCenter="" 
	authors="nitinme" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="hdinsight" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/06/2015" 
	ms.author="nitinme"/>

# Use Hive with HDInsight to analyze logs from websites

Learn how to use HiveQL with HDInsight to analyze logs from a website. Website log analysis can be used to segment your audience based on similar activities, categorize site visitors by demographics, and to find out the content they view, the websites they come from, and so on.

In this sample, you will use an HDInsight cluster to analyze website log files to get insight into the frequency of visits to the website from external websites in a day. You'll also generate a summary of website errors that the users experience. You will learn how to:

- Connect to a Azure Blob storage, which contains website log files.
- Create HIVE tables to query those logs.
- Create HIVE queries to analyze the data.
- Use Microsoft Excel to connect to HDInsight (by using open database connectivity (ODBC) to retrieve the analyzed data.

![HDI.Samples.Website.Log.Analysis][img-hdi-weblogs-sample]

##Prerequisites

- You must have provisioned an **HDInsight cluster**. For instructions, see [Provision HDInsight Clusters][hdinsight-provision]. 
- You must have Microsoft Excel 2013 or Excel 2010 installed.
- You must have [Microsoft Hive ODBC Driver](http://www.microsoft.com/download/details.aspx?id=40886) to import data from Hive into Excel.


##To run the sample

1. From the Azure Portal, click the cluster on which you want to run the sample, and then click **Query Console** at the bottom. Alternatively, you can directly open the Query Console by using the following URL:

	 	https://<clustername>.azurehdinsight.net
	
	When prompted, authenticate by using the administrator user name and password you used when provisioning the cluster.
  
2. From the web page that opens, click the **Getting Started Gallery** tab, and then under the **Samples** category, click the **Website Log Analysis** sample.

3. Follow the instructions provided on the web page to finish the sample.

##Next steps
Try the following sample: [Analyzing sensor data using Hive with HDInsight](hdinsight-hive-analyze-sensor-data.md).


[hdinsight-provision]: hdinsight-provision-clusters.md
[hdinsight-sensor-data-sample]: hdinsight-use-hive-sensor-data-analysis.md

[img-hdi-weblogs-sample]: ./media/hdinsight-hive-analyze-website-log/hdinsight-weblogs-sample.png
