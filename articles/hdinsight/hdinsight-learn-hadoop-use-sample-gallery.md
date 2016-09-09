<properties
   pageTitle="Learn Hadoop in HDInsight with the Sample Gallery | Microsoft Azure"
   description="Quickly learn Hadoop by running sample applications from the HDInsight Getting Started Gallery. Use sample data or supply your own."
   services="hdinsight"
   documentationCenter=""
   tags="azure-portal"
   authors="mumian"
   manager="paulettm"
   editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.workload="big-data"
   ms.tgt_pltfrm="na"
   ms.devlang="na"
   ms.topic="article"
   ms.date="07/25/2016"
   ms.author="jgao"/>

# Learn Hadoop by using the Azure HDInsight Getting Started Gallery

The Getting Started Gallery is only available for Windows-based HDInsight clusters. The gallery provides an easy and quick way learn Hadoop by running sample applications in HDInsight. Some of the samples come with sample data. You can supply your own data for the remaining samples. Currently, there are the following six samples (with more coming):

- Solutions with your Azure data
	- Microsoft Azure website log analysis
	- Microsoft Azure storage analytics
- Solutions with sample data
	- Sensor data analysis
	- Twitter trend analysis
	- Website log analysis
	- Mahout movie recommendation

![HDInsight Hadoop, Storm, and HBase Getting Started Gallery solutions including sample data.][hdinsight.sample.gallery]

The following video shows how to run the Twitter trend analysis sample:

<center><a href="https://www.youtube.com/embed/7ePbHot1SN4">https://www.youtube.com/embed/7ePbHot1SN4></a></center>

The Dashboard can be accessed by browsing to http://<YourHDInsightClusterName>.azurehdinsight.net/ or from the Azure Portal.

**To run a sample from the Getting Started Gallery**

1. Sign in to the [Azure Portal][azure.portal].
2. Click **Browse** from the left menu, click **HDInsight Clusters**, and then click your cluster name.
3. Click **Dashboard** from the top menu.
4. Enter the user name and password for the HTTP user (also called the cluster user).
6. Click **Getting Started Gallery** at the top of the page.
7. Click one of the samples. Each sample gives detailed steps for running it. The following image shows the Twitter trend analysis sample:

	![HDInsight Twitter trend analysis sample][hdinsight.twitter.sample]

## Next steps
Other ways to learn about HDInsight include:

- [HDInsight learning map][hdinsight.learn.map]
- [HDInsight infographic][hdinsight.infographic]

<!--Image references-->
[hdinsight.sample.gallery]: ./media/hdinsight-learn-hadoop-use-sample-gallery/HDInsight-Getting-Started-Gallery.png
[hdinsight.twitter.sample]: ./media/hdinsight-learn-hadoop-use-sample-gallery/HDInsight-Twitter-Trend-Analysis-sample.png

<!--Link references-->
[hdinsight.learn.map]: https://azure.microsoft.com/documentation/learning-paths/hdinsight-self-guided-hadoop-training/
[hdinsight.infographic]: http://go.microsoft.com/fwlink/?linkid=523960
[azure.portal]:https://portal.azure.com
