<properties title="Analyzing sensor data using Hive with HDInsight" pageTitle="Analyzing sensor data using Hive and Microsoft Azure HDInsight (Hadoop)" description="Learn how to use Hive and Excel to analyze and visualize sensor data with HDInsight (Hadoop)" metaKeywords="Azure hdinsight hive, Azure hdinsight hive sensor, azure hadoop hive, azure hadoop sensor, azure hadoop excel, azure hdinsight excel" services="hdinsight" solutions="" documentationCenter="big-data" authors="larryfr" videoId="" scriptId="" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="09/30/2014" ms.author="larryfr" />

#Analyzing sensor data using Hive with HDInsight

Learn how to analyze sensor data using Hive with HDInsight (Hadoop), then visualize the data in Microsoft Excel using Power View.

In this sample, you'll use Hive to process historical data produced by heating, ventilation, and air conditioning (HVAC) systems to identify systems that are not able to reliably maintain a set temperature. You will learn how to:

- Create HIVE tables to query data stored in comma separated value (CSV) files
- Create HIVE queries to analyze the data
- Use Microsoft Excel to connect to HDInsight (using an ODBC connection) to retrieve the analyzed data
- Use Power View to visualize the data

![A diagram of the solution architecture](./media/hdinsight-use-hive-sensor-data-analysis/hvac-architecture.png)

##Prerequisites:

* An HDInsight (Hadoop) cluster - see [Provision Hadoop clusters in HDInsight](/en-us/documentation/articles/hdinsight-provision-clusters/) for information on creating a cluster

* Microsoft Excel 2013

	> [WACOM.NOTE] Microsoft Excel is used for data visualization with [Power View](https://support.office.com/en-US/Article/Power-View-Explore-visualize-and-present-your-data-98268d31-97e2-42aa-a52b-a68cf460472e?ui=en-US&rs=en-US&ad=US), which is currently only available on Windows.

* [Microsoft Hive ODBC Driver](http://www.microsoft.com/en-us/download/details.aspx?id=40886)

##To run the sample

1. From the Azure Management Portal, click the cluster on which you want to run the sample, and then click **Query Console** from the bottom. Alternatively, you can directly open the Query Console using the following URL

	 	https://<clustername>.azurehdinsight.net

	When prompted, authenticate using the administrator user name and password you used when provisioning this cluster.

2. From the web page that opens, click the **Getting Started Gallery** tab, and then under the **Samples** category, click the **Website Log Analysis** sample.

3. Follow the instructions provided on the web page to finish the sample.


