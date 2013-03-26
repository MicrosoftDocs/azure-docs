<properties linkid="manage-services-hdinsight-run-samples" urlDisplayName="How to run Samples" pageTitle="How to Run the HDInsight Samples - Windows Azure Services" metaKeywords="hdinsight samples, hdinsight samples azure" metaDescription="Learn how to run the samples included with the Windows Azure HDInsight service." umbracoNaviHide="0" disqusComments="1" writer="sburgess" editor="mollybos" manager="paulettm" />

<div chunk="../chunks/hdinsight-left-nav.md" />

# How to Run the HDInsight Samples#

## Introduction ##

A set of sample jobs is installed with each cluster that you can run quickly and easily to get started with HDInsight. This topic provides a brief overview on what these samples do and instructions on how to run them.

**What These Samples Are**

These samples are intended to get you started quickly learning and to give you an extensible testing bed to work through concepts. They provide you an easy way to create data sets of various sizes and allow running samples over the various sizes so you may observe the effects of data size on jobs as you get to learn your cluster.

**What These Samples Are Not**

These samples are not an exhaustive study of each of the disciplines implemented. Extensive documentation exists on the web for Java MR, Pig and Hive.

## Using the Samples Gallery ##

The dashboard running on your HDInsight cluster contains a **Hadoop Sample Gallery** page that contains a tile for each of samples that can be run directly on your cluster.

Note the procedure in this section assumes that you have gotten setup with Windows Azure and the HDinsight preview and that you have created an HDInsight cluster on which you can run samples. If you have not done this already, consult the [Getting Started with the Windows Azure HDInsight Service](/en-us/manage/services/hdinsight/get-started-hdinsight/) tutorial for instructions on how to satisfy these prerequisites

1. Sign in to the [Management Portal](https://manage.windowsazure.com).
2. Click **HDINSIGHT**. You shall see a list of deployed Hadoop clusters.
3. Click the Hadoop cluster where you want to upload data to.
4. From HDInsight Dashboard, click the cluster URL.
5. Enter **User name** and **Password** for the cluster, and then click **Log On**.
6. Click **Samples**.

	![HDI.TileSamples](../media/HDI.TileSamples.PNG "Samples")

7. The **Sample Gallery** screen will be shown.

	![HDI.SampleGallery](../media/HDI.SampleGallery.PNG "Samples")

To run a sample, simply click on one of the tiles and select **Deploy to your cluster**.

## Summary
HDInsight ships with five samples, which, with one exception (the Sqoop sample) can be run directly from the dashboard.

- **The Hadoop on Azure 10-GB Graysort Sample**: This tutorial shows how to run a general purpose GraySort on a 10 GB file using Hadoop on Windows Azure. 

- **The Hadoop on Azure Pi Estimator Sample**: This tutorial shows how to deploy a MapReduce program with Hadoop on Windows Azure that uses a statistical (quasi-Monte Carlo) method to estimate the value of Pi.

- **The Hadoop on Azure Wordcount Sample**: This tutorial shows two ways to use Hadoop on Windows Azure to run a MapReduce program that counts word occurences in a text.

- **The Hadoop on Azure C# Streaming Sample**:This tutorial shows how to use C# programs with the Hadoop streaming interface. 

- **The Hadoop on Azure Sqoop Import/Export Sample**: This tutorial shows how to use Sqoop to import and export data from a SQL database on Windows Azure to an Hadoop on Windows Azure HDFS cluster.

##Next Steps

In this article, you learned how to run the samples included with the HDInsight Service. For additional tutorials on using Pig, Hive, and MapReduce, or for examples of using the HDInsight Service for sentiment analysis or as a recommendation engine, see the following topics:

* [Tutorial: Using Pig][pig]

* [Tutorial: Using Hive][hive]

* [Tutorial: Using MapReduce][mapreduce]

* [Tutorial: Analyzing Twitter Data with Hive][twitter-hdi]

* [Tutorial: Simple recommendation engine using Apache Mahout][mahout-hdi]

[mapreduce]: /en-us/manage/services/hdinsight/using-mapreduce-with-hdinsight/
[hive]: /en-us/manage/services/hdinsight/using-hive-with-hdinsight/
[pig]: /en-us/manage/services/hdinsight/using-pig-with-hdinsight/
[mahout-hdi]: /en-us/manage/services/hdinsight/recommendation-engine-using-mahout/
[twitter-hdi]: /en-us/manage/services/hdinsight/analyzing-twitter-data-with-hive/