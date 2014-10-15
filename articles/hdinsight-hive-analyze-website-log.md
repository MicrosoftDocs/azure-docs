<properties linkid="manage-services-hdinsight-howto-hive" urlDisplayName="Use Hive in HDInsight Hadoop for website log analysis" pageTitle="Use Hive in HDInsight Hadoop for website log analysis| Azure" metaKeywords="" description="Learn how to use Hive with HDInsight to analyze website logs. You'll use a log file as input into an HDInsight table, and use HiveQL to query the data." metaCanonical="" services="hdinsight" documentationCenter="" title="Use Hive in HDInsight Hadoop for website log analysis" authors="nitinme" solutions="" manager="paulettm" editor="cgronlun" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/14/2014" ms.author="nitinme" />

# Use Hive with HDInsight to analyze logs from websites

Learn how to use HiveQL with HDInsight to analyze logs from a website. Website log analysis can be used to segment your audience based on similar activities, categorize site visitors by demographics, find out the content they view, the websites they come from, and so on.

In this sample you will use an HDInsight cluster to analyze website log files to get insight into the frequency of visits to the website in a day from external websites, and a summary of website errors that the users experience. You will learn how to:

- Connect to an Azure Storage Blob containing website log files
- Create HIVE tables to query those logs
- Create HIVE queries to analyze the data
- Use Microsoft Excel to connect to HDInsight (using an ODBC connection) to retrieve the analyzed data

![HDI.Samples.Website.Log.Analysis][img-hdi-weblogs-sample]

##Prerequisites

- You must have provisioned an **HDInsight cluster**. For instructions, see [Provision HDInsight Clusters][hdinsight-provision]. 
- You must have Microsoft Excel 2010 or Microsoft Excel 2013 installed.
- You must have [Microsoft Hive ODBC Driver](http://www.microsoft.com/en-us/download/details.aspx?id=40886) to import data from Hive into Excel.


##To run the sample

1. From the Azure Management Portal, click the cluster on which you want to run the sample, and then click **Query Console** from the bottom. Alternatively, you can directly open the Query Console using the following URL:

	 	https://<clustername>.azurehdinsight.net
	
	When prompted, authenticate using the administrator user name and password you used when provisioning the cluster.
  
2. From the web page that opens, click the **Getting Started Gallery** tab, and then under the **Samples** category, click the **Website Log Analysis** sample.
3. Follow the instructions provided on the web page to finish the sample.

##Next steps
Try the sample on how to analyze sensor data using Azure HDInsight. See [Analyzing sensor data using Hive with HDInsight][hdinsight-sensor-data-sample].


[hdinsight-provision]: ../hdinsight-provision-clusters/
[hdinsight-sensor-data-sample]: ../hdinsight-use-hive-sensor-data-analysis/

[img-hdi-weblogs-sample]: ./media/hdinsight-hive-analyze-website-log/hdinsight-weblogs-sample.png