---
title: Analyze sensor data using Hive and Hadoop - Azure HDInsight 
description: Learn how to analyze sensor data by using the Hive Query Console with HDInsight (Hadoop), then visualize the data in Microsoft Excel with PowerView.
services: hdinsight
ms.service: hdinsight
author: jasonwhowell
ms.author: jasonh
ms.reviewer: jasonh
ms.topic: conceptual
ms.date: 04/14/2017
ROBOTS: NOINDEX
---
# Analyze sensor data using the Hive Query Console on Hadoop in HDInsight

Learn how to analyze sensor data by using the Hive Query Console with HDInsight (Hadoop), then visualize the data in Microsoft Excel by using Power View.

> [!IMPORTANT]
> The steps in this document only work with Windows-based HDInsight clusters. HDInsight is only available on Windows for versions lower than HDInsight 3.4. Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](../hdinsight-component-versioning.md#hdinsight-windows-retirement).


In this sample, you use Hive to process historical data and identify problems with heating and air conditioning systems. Specifically, you identify systems are not able to reliably maintain a set temperature by performing the following tasks:

* Create HIVE tables to query data stored in comma-separated value (CSV) files.
* Create HIVE queries to analyze the data.
* To retrieve the analyzed data, use Microsoft Excel to connect to HDInsight.
* To visualize the data, use Power View.

![A diagram of the solution architecture](./media/apache-hive-analyze-sensor-data/hvac-architecture.png)

## Prerequisites

* An HDInsight (Hadoop) cluster: See [Create Hadoop clusters in HDInsight](../hdinsight-hadoop-provision-linux-clusters.md) for information about creating a cluster.
* Microsoft Excel 2013

  > [!NOTE]
  > Microsoft Excel is used for data visualization with [Power View](https://support.office.com/Article/Power-View-Explore-visualize-and-present-your-data-98268d31-97e2-42aa-a52b-a68cf460472e?ui=en-US&rs=en-US&ad=US).

* [Microsoft Hive ODBC Driver](http://www.microsoft.com/download/details.aspx?id=40886)

## To run the sample

1. From your web browser, navigate to the following URL: 

         https://<clustername>.azurehdinsight.net

    Replace `<clustername>` with the name of your HDInsight cluster.

    When prompted, authenticate by using the administrator user name and password you used when provisioning this cluster.

2. From the web page that opens, click the **Getting Started Gallery** tab, and then under the **Solutions with Sample Data** category, click the **Sensor Data Analysis** sample.

    ![Getting started gallery image](./media/apache-hive-analyze-sensor-data/getting-started-gallery.png)

3. Follow the instructions provided on the web page to finish the sample.
