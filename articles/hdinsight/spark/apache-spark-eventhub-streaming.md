---
title: 'Tutorial: Process data from Azure Event Hubs with Apache Spark in Azure HDInsight | Microsoft Docs'
description: Connect Apache Spark in Azure HDInsight to Azure Event Hubs and process the streaming data.  
services: hdinsight
documentationcenter: ''
author: mumian
manager: cgronlun
editor: cgronlun
tags: azure-portal

ms.service: hdinsight
ms.custom: hdinsightactive,hdiseo17may2017
ms.devlang: na
ms.topic: conceptual
ms.date: 04/23/2018
ms.author: jgao

#custom intent: As a developer new to Apache Spark and to Apache Spark in Azure HDInsight, I want to learn how to use Apache Spark in Azure HDInsight to process streaming data from Azure Event Hubs.
---

# Tutorial: Process data from Azure Event Hubs with Spark in  HDInsight

Learn how to create an Apache Spark streaming application that does:

1.	Ingest messages into an Azure Event Hub.
2.	Retrieve the messages from Event Hub in real-time using an application running in Spark cluster on Azure HDInsight with two different approaches.
3.	Build streaming analytic pipelines to persist data to different storage systems, or get insights from data on the fly.

For a detailed explanation of Spark streaming, see [Apache Spark streaming overview](http://spark.apache.org/docs/latest/streaming-programming-guide.html#overview). HDInsight brings the same streaming features to a Spark cluster on Azure.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * bla, bla, bla

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

* **Complete the article [Tutorial: Load data and run queries on an Apache Spark cluster in Azure HDInsight](./apache-spark-load-data-run-query.md)**.

## Create a Twitter application

To receive a stream of tweets, you create an application in Twitter. Follow the instructions create a Twitter application and record the values that you need to complete this tutorial.

1. Browse to [Twitter Application Management](https://apps.twitter.com/).
2. Select **Create New App**.
3. Provide the following values:

    - Name: provide the application name. The value used for this tutorial is **HDISparkStreamApp0423**. This name has to be an unique name.
    - Description: provide a short description of the application. The value used for this tutorial is **A simple HDInsight Spark streaming application**.
    - Website: provide the application's website. It doesn't have to be a valid website.  The value used for this tutorial is **http://www.contoso.com**.
    - Callback URL: you can leave it blank.

4. Select **Yes, I have read and agree to the Twitter Developer Agreement**, and then click **Create your Twitter application**.
5. Select the **Keys and Access Tokens** tab.
6. Select **Create my access token** at the end of the page.
7. Write down the following values from the page.  You need these values later in the tutorial:

    - **Consumer Key (API Key)**	KsdaSZzOA0Ij4oCgQnjb0w590
    - **Consumer Secret (API Secret)**	Y4Qr2VOXFRYpouBES9ZeWYwVUbNWEPPo7peIoGxzKjFKpefjzo
    - **Access Token**	23087070-KfFXFmTo00thKXzdDbkhpI3D4P27kPHoQtFQboLv1
    - **Access Token Secret**	09sbg641kC5LGpYgz5FSRUhNi6IJ7WaRmk3q5FYognYrl

## Create an event hub



## Next steps

In this tutorial, you learned how to:

- Visualize Spark data using Power BI.

Advance to the next article to see how the data you registered in Spark can be pulled into a BI analytics tool such as Power BI. 
> [!div class="nextstepaction"]
> [Run a Spark streaming job](apache-spark-eventhub-streaming.md)

