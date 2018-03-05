---
title: Sentiment analysis on streaming data using Azure Databricks | Microsoft Docs
description: Learn to use Azure Databricks with Event Hubs and Cognitive Services API to perform sentiment analysis on data being streamed from Twitter. 
services: azure-databricks
documentationcenter: ''
author: nitinme
manager: cgronlun
editor: ''
tags: ''

ms.assetid: 
ms.service: azure-databricks
ms.custom: mvc
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: "Active"
ms.date: 03/04/2018
ms.author: nitinme

---

# Sentiment analysis on streaming data using Azure Databricks

In this tutorial, you learn how to perform sentiment analysis on a stream of tweets using Azure Databricks, Azure Events Hub, and Cognitive Services API.

This tutorial covers the following tasks: 

> [!div class="checklist"]
> * Create an Azure Databricks workspace
> * Create a Spark cluster in Azure Databricks
> * Create a Twitter app to generate streaming data
> * Create a notebook in Azure Databricks
> * Add libraries for Event Hubs and Twitter
> * Send tweets to Event Hubs
> * Receive messages from Event Hubs

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

Before you start with this tutorial, make sure you have the following:
- An Azure Event Hubs namespace.
- Policy name and policy key to access the Event Hubs namespace.
- Connection string to access the Event Hubs namespace.
- An Event Hub within the namespace.
- Consumer group. For this tutorial, you can use the **$Default** consumer group, which is available by default.
- Partition count. You can use the default partition count, which is **2**. 

You can meet these requirements by completing the steps in the article [Create an Azure Event Hubs namespace and event hub](../event-hubs/event-hubs-create.md).

## Log in to the Azure portal

Log in to the [Azure portal](https://portal.azure.com/).

## Create an Azure Databricks workspace

In this section, you create an Azure Databricks workspace using the Azure portal. 

1. In the Azure portal, click **Create a resource**, click **Data + Analytics**, and then click **Azure Databricks (Preview)**. 

    ![Databricks on Azure portal](./media/databricks-stream-from-eventhubs/azure-databricks-on-portal.png "Databricks on Azure portal")

2. Under **Azure Databricks (Preview)**, click **Create**.

3. Under **Azure Databricks Service**, provide the following values:

    ![Create an Azure Databricks workspace](./media/databricks-stream-from-eventhubs/create-databricks-workspace.png "Create an Azure Databricks workspace")

    * For **Workspace name**, provide a name for your Databricks workspace.
    * For **Subscription**, from the drop-down, select your Azure subscription.
    * For **Resource group**, specify whether you want to create a new resource group or use an existing one. A resource group is a container that holds related resources for an Azure solution. For more information, see [Azure Resource Group overview](../azure-resource-manager/resource-group-overview.md).
    * For **Location**, select **East US 2**. For other available regions, see [Azure services available by region](https://azure.microsoft.com/regions/services/).

4. Click **Create**.

## Create a Spark cluster in Databricks

1. In the Azure portal, go to the Databricks workspace that you created, and then click **Initialize Workspace**.

2. You are redirected to the Azure Databricks portal. From the portal, click **Cluster**.

    ![Databricks on Azure](./media/databricks-stream-from-eventhubs/databricks-on-azure.png "Databricks on Azure")

3. In the **New cluster** page, provide the values to create a cluster.

    ![Create Databricks Spark cluster on Azure](./media/databricks-stream-from-eventhubs/create-databricks-spark-cluster.png "Create Databricks Spark cluster on Azure")

    * Enter a name for the cluster.
    * For this article, create a cluster with **4.0 (beta)** runtime. 
    * Make sure you select the **Terminate after ____ minutes of inactivity** checkbox. Provide a duration (in minutes) to terminate the cluster, if the cluster is not being used.
    * Accept all other default values. 
    * Click **Create cluster**. Once the cluster is running, you can attach notebooks to the cluster and run Spark jobs.

## Create a Twitter application

To receive a real-time stream of tweets, you must create an application in Twitter. Follow the steps to create a Twitter application and record the values that you need to complete this tutorial.

1. From a web browser, go to [Twitter Application Management](http://twitter.com/app), and click **Create New App**.

    ![Create Twitter application](./media/databricks-stream-from-eventhubs/databricks-create-twitter-app.png "Create Twitter application")

2. In the **Create an application** page, provide the details for the new app, and then click **Create your Twitter application**.

    ![Twitter application details](./media/databricks-stream-from-eventhubs/databricks-provide-twitter-app-details.png "Twitter application details")

3. In the application page, click the **Keys and Access Tokens** tab and copy the values for **Consume Key** and **Consumer Secret**. Also, click **Create my access token** to generate the access tokens. Copy the values for **Access Token** and **Access Token Secret**.

    ![Twitter application details](./media/databricks-stream-from-eventhubs/twitter-app-key-secret.png "Twitter application details")

Save the values that you retrieved for the Twitter application. You need this later in the tutorial.

## Add libraries to the cluster

< TBD >

## Create notebooks in Databricks

In this section, you create two notebooks in Databricks workspace with the following names

- **SendTweetsToEventHub** - You use this notebook to get tweets from Twitter and stream them to Events Hub.
- **ReadTweetsFromEventHub** - You use this notebook to read the tweets from Events Hub.

1. In the left pane, click **Workspace**. From the **Workspace** drop-down, click **Create**, and then click **Notebook**.

    ![Create notebook in Databricks](./media/databricks-stream-from-eventhubs/databricks-create-notebook.png "Create notebook in Databricks")

2. In the **Create Notebook** dialog box, enter **SendTweetsToEventHub**, select **Scala** as the language, and select the Spark cluster that you created earlier.

    ![Create notebook in Databricks](./media/databricks-stream-from-eventhubs/databricks-notebook-details.png "Create notebook in Databricks")

    Click **Create**.

3. Repeat the steps to create the **ReadTweetsFromEventHub** notebook.

## Send message to Event Hubs

In the **SendTweetsToEventHub** notebook, paste the following code, and replace the placeholder with values for your Event Hubs namesapce and Twitter application that you created earlier. This notebook streams tweets with the keyword "Azure" into Events Hub.

    import java.util._
    import scala.collection.JavaConverters._
    import com.microsoft.azure.eventhubs._

    // Connection information about Event Hub!
    // Replace values below with yours
    
    val namespaceName = "<EVENT HUBS NAMESPACE>"
    val eventHubName = "<EVENT HUB NAME>"
    val sasKeyName = "<POLICY NAME>"
    val sasKey = "<POLICY KEY>"
    val connStr = new ConnectionStringBuilder(namespaceName, eventHubName, sasKeyName, sasKey)
    val eventHubClient = EventHubClient.createFromConnectionStringSync(connStr.toString())
    
    def sendEvent(message: String) = {
      val messageData = new EventData(message.getBytes("UTF-8"))
      eventHubClient.send(messageData) 
      System.out.println("Sent event: " + message + "\n")
    }
    
    import twitter4j._
    import twitter4j.TwitterFactory
    import twitter4j.Twitter
    import twitter4j.conf.ConfigurationBuilder
    
    // Twitter configuration!
    // Replace values below with yours
    
    val twitterConsumerKey = "<CONSUMER KEY>"
    val twitterConsumerSecret = "<CONSUMER SECRET>"
    val twitterOauthAccessToken = "<ACCESS TOKEN>"
    val twitterOauthTokenSecret = "<TOKEN SECRET>"
    
    val cb = new ConfigurationBuilder()
      cb.setDebugEnabled(true)
      .setOAuthConsumerKey(twitterConsumerKey)
      .setOAuthConsumerSecret(twitterConsumerSecret)
      .setOAuthAccessToken(twitterOauthAccessToken)
      .setOAuthAccessTokenSecret(twitterOauthTokenSecret)
    
    val twitterFactory = new TwitterFactory(cb.build())
    val twitter = twitterFactory.getInstance()
    
    // Getting tweets with keyword "Azure" and sending them to the Event Hub in realtime!
    
    val query = new Query(" #Azure ")
    query.setCount(100)
    query.lang("en")
    var finished = false
    while (!finished) {
      val result = twitter.search(query) 
      val statuses = result.getTweets()
      var lowestStatusId = Long.MaxValue
      for (status <- statuses.asScala) {
        if(status.isRetweet()){ 
          sendEvent(status.getRetweetedStatus().getText())
        } else {
          sendEvent(status.getText())
        }
        lowestStatusId = Math.min(status.getId(), lowestStatusId)
        Thread.sleep(2000)
      }
      query.setMaxId(lowestStatusId - 1)
    }
    
    // Closing connection to the Event Hub
    eventHubClient.close()

## Read message from Event Hubs

In the **ReadTweetsFromEventHub** notebook, paste the following code, and replace the placeholder with values for your Azure Event Hubs that you created earlier. This notebook reads the tweets that you earlier streamed into Events Hub using the **SendTweetsToEventHub** notebook.

    import java.io._
    import java.net._
    import java.util._
    import javax.net.ssl.HttpsURLConnection
    
    import com.google.gson.Gson
    import com.google.gson.GsonBuilder
    import com.google.gson.JsonObject
    import com.google.gson.JsonParser
    import scala.util.parsing.json._
    
    // Configuration parameters for connecting to Event Hub.
    val customEventhubParameters = scala.collection.immutable.Map[String, String] (
         "eventhubs.policyname" -> "RootManageSharedAccessKey",
         "eventhubs.policykey" -> "3aPJIMfP1ukfaisHZhfGkIPUPzgr+yiDoJI7QSsRI/U=",
         "eventhubs.namespace" -> "eventhubnsfordatabricks",
         "eventhubs.name" -> "eventhub_databricks",
         "eventhubs.partition.count" -> "2",
         "eventhubs.consumergroup" -> "$Default",
         "eventhubs.progressTrackingDir" -> "/eventhubs/progress",
         "eventhubs.sql.containsProperties" -> "true",
         "eventhubs.maxRate" -> s"3"
         )
    
    // Getting a stream of messages using Event Hub to Spark connector (open source)
    val incomingStream = spark.readStream.format("eventhubs").options(customEventhubParameters).load()
    
    // Insight into the schema of the incoming datastream.
    incomingStream.printSchema
    
    // Sending the incoming stream into the console.
    // Data comes in batches!
    incomingStream.writeStream.outputMode("append").format("console").option("truncate", false).start().awaitTermination()

You get the following output.

  
    root
     |-- body: binary (nullable = true)
     |-- offset: long (nullable = true)
     |-- seqNumber: long (nullable = true)
     |-- enqueuedTime: long (nullable = true)
     |-- publisher: string (nullable = true)
     |-- partitionKey: string (nullable = true)
     |-- properties: map (nullable = true)
     |    |-- key: string
     |    |-- value: string (valueContainsNull = true)
    
    -------------------------------------------
    Batch: 0
    -------------------------------------------
    +----------+------+---------+------------+---------+------------+----------+
    |body|offset|seqNumber|enqueuedTime|publisher|partitionKey|properties|
    +------+------+---------+------------+---------+------------+----------+
    |[41 62 6F 75 74 20 74 6F 20 73 74 61 72 74 20 6D 79 20 74 68 69 72 64 20 73 68 69 66 74 20 74 6F 64 61 79 2C 20 64 65 6C 69 76 65 72 69 6E 67 20 61 20 63 75 73 74 6F 6D 20 23 41 7A 75 72 65 20 23 53 65 63 75 72 69 74 79 20 43 65 6E 74 65 72 20 74 72 61 69 6E 69 6E 67 20 66 6F 72 20 61 20 63 75 73 74 6F 6D 65 72 2E 20 46 6F 63 75 73 20 6F 6E E2 80 A6 20 68 74 74 70 73 3A 2F 2F 74 2E 63 6F 2F 48 7A 4E 44 62 6C 75 30 61 32]|0     |0        |1519782402  |null     |null        |[]        |

Because the output is in a binary mode, use the following snippet to convert it into string.

    // Body is binary, so cast it to string to see the actual content of the message
    val messages = incomingStream.selectExpr("cast (body as string) AS Content")
    messages.writeStream.outputMode("append").format("console").option("truncate", false).start().awaitTermination()

The output now resembles the following snippet.

    ------------
    Batch: 0
    ------------
    +-------------+
    |Content      |    
    +-------------------------------------------+
    |About to start my third shift today, delivering a custom #Azure #Security Center training for a customer. Focus on… https://t.co/HzNDblu0a2|
    |Read the blog and learn how to securely shift your workload to #Azure: https://t.co/rsmcZA3knd https://t.co/o021XWLjOl                     |
    |Looking for investments in the #cloud ? Try these. 4 Top Cloud Stocks to Buy Now @themotleyfool #stocks $MSFT,… https://t.co/PvanIE2KPw    |
    |#DataScientists Q&A discussion forum >> Which is the best #BigData Analytics platform for beginners -- #AWS vs… https://t.co/M94LJeWwoH    
    +---------------------------------------------+
    
    --------------
    Batch: 1
    --------------
    ...
    ...

## Next steps 
In this tutorial, you learned how to use Azure Databricks to stream data into Azure Events Hub and then read the streaming data from Events Hub in real time. You learned how to:
> [!div class="checklist"]
> * Create an Azure Databricks workspace
> * Create a Spark cluster in Azure Databricks
> * Create a Twitter app to generate streaming data
> * Create a notebook in Azure Databricks
> * Add libraries for Event Hubs and Twitter
> * Send tweets to Event Hubs
> * Receive messages from Event Hubs

Advance to the next tutorial to learn about performing sentiment analysis on the streamed data using Azure Databricks and [Azure Cognitive Services API](../cognitive-services/text-analytics/overview.md).

> [!div class="nextstepaction"]
>[Sentiment analyis on streaming data using Azure Databricks ](quickstart-create-databricks-workspace-portal.md)
