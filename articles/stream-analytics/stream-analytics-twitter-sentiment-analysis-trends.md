---
title: Real-time Twitter sentiment analysis with Stream Analytics | Microsoft Docs
description: Learn how to use Stream Analytics for real-time Twitter sentiment analysis. Step-by-step guidance from event generation to data on a live dashboard.
keywords: real-time twitter trend analysis, sentiment analysis, social media analysis, trend analysis example
services: stream-analytics
documentationcenter: ''
author: jeffstokes72 
manager: jhubbard
editor: cgronlun 

ms.assetid: 42068691-074b-4c3b-a527-acafa484fda2
ms.service: stream-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 03/03/2017
ms.author: jeffstok
---

# Real-time Twitter sentiment analysis in Azure Stream Analytics

Learn how to build a sentiment analysis solution for social media analytics by bringing real-time Twitter events into Azure Event Hubs. You will write an Azure Stream Analytics query to analyze the data. You'll then either store the results for later perusal or use a dashboard and [Power BI](https://powerbi.com/) to provide insights in real-time.

Social media analytics tools help organizations understand trending topics, that is, subjects and attitudes that have a high volume of posts in social media. Sentiment analysis, which is also called *opinion mining*, uses social media analytics tools to determine attitudes toward a product, idea, and so on. real-time Twitter trend analysis is a great example because the hashtag subscription model enables you to listen to specific keywords and develop sentiment analysis on the feed.

## Scenario: Social media sentiment analysis in real-time

A company that has a news media website is interested in getting an advantage over its competitors by featuring site content that is immediately relevant to its readers. The company uses social media analysis on topics that are relevant to readers by doing real-time sentiment analysis on Twitter data. Specifically, to identify trending topics in real-time on Twitter, the company needs real-time analytics about the tweet volume and sentiment for key topics. So, in essence, the need is a sentiment analysis analytics engine that's based on this social media feed.

## Prerequisites

* An Azure subscription
* Twitter account and [OAuth access token](https://dev.twitter.com/oauth/overview/application-owner-access-tokens)
* The [TwitterWPFClient.zip](https://github.com/Azure/azure-stream-analytics/blob/master/Samples/TwitterClient/TwitterWPFClient.zip) file from GitHub.
* Optional: Source code for twitter client from [GitHub](https://aka.ms/azure-stream-analytics-twitterclient)

## Create an event hub input

The sample application generates events and push them to an Event Hubs instance (an event hub, for short). Service Bus event hubs are the preferred method of event ingestion for Stream Analytics. For more information review the Event Hub documentation at [Azure Service Bus documentation](/azure/service-bus/).

### Use the following steps to create an event hub.

1. In the [Azure portal](https://portal.azure.com), click **NEW** > and type *Event Hubs* and then select **Event Hubs** from the resulting search. Then click **Create**.
2. Provide a name for the Event Hub and create a Resource Group. I have specified `socialtwitter-eh` and `socialtwitter-rg` respectively. Check the box to pin the account to the dashboard and then click the **Create** button.
3. Once the deployment is complete click the Event Hub and then click **Event Hubs** under **Entities**.
4. Click the **+ Event Hub** button to create your Event Hub. Provide your name again (mine was `socialtwitter-eh`) and click **Create**.
5. To grant access to the event hub, we need to create a shared access policy. Click the Event Hub and then click **Shared access policies** under **Settings**.
6. Under **SHARED ACCESS POLICIES**, create a new policy with **MANAGE** permissions by clicking **+ Add**. Give the policy a name and check **MANAGE** and then click **Create**.
7. Click your new policy once it is created and then click the copy button for the **CONNECTION STRING - PRIMARY KEY** entity. We will need this further in the exercise. Then return to the dashboard.

![shared access policy endpoints](./media/stream-analytics-twitter-sentiment-analysis-trends/keysandendpoints.png)

## Configure and start the Twitter client application

We have provided a client application that will connect to Twitter data via [Twitter's Streaming APIs](https://dev.twitter.com/streaming/overview) to collect Tweet events about a parameterized set of topics. The [Sentiment140](http://help.sentiment140.com/) open source tool is used to assign a sentiment value to each tweet.

* 0 = negative
* 2 = neutral
* 4 = positive

Then, Tweet events are pushed to the event hub.  

### Follow these steps to set up the application:

1. [Download the TwitterWPFClient.zip](https://github.com/Azure/azure-stream-analytics/blob/master/Samples/TwitterClient/TwitterWPFClient.zip) and unzip it.
2. Execute the `TwitterWPFClient.exe` application and enter your data for the Twitter API Key and Secret, Twitter Access Token and Secret and also the Azure Event Hub information. Finally define what keywords you wish to determine sentiment on. Note if you specify more than one word (using commas to define multiple values) and you want ANY you must flip the control to "Match ANY".

   [Steps to generate an OAuth access token](https://dev.twitter.com/oauth/overview/application-owner-access-tokens)  

   You will need to make an empty application to generate a token.  

3. Replace the EventHubConnectionString and EventHubName values in TwitterWpfClient.exe.config with the connection string and name of your event hub. The connection string that you copied earlier gives you both the connection string and the name of your event hub, so be sure to separate them and put each in the correct field. For example, consider the following connection string:  
   
   `Endpoint=sb://your.servicebus.windows.net/;SharedAccessKeyName=yourpolicy;SharedAccessKey=yoursharedaccesskey;EntityPath=yourhub`
   
   The TwitterWpfClient.exe.config file should contain your settings as in the following example:
   
   ```
     add key="EventHubConnectionString" value="Endpoint=sb://your.servicebus.windows.net/;SharedAccessKeyName=yourpolicy;SharedAccessKey=yoursharedaccesskey"
     add key="EventHubName" value="yourhub"
   ```
   
   It is important to note that the text "EntityPath=" does **not** appear in the EventHubName value.
   
   You may also enter the values for your Twitter and Azure connection information directly into the client. The same logic applies where "EntityPath=" is not used.
   
   ![wpfclient](./media/stream-analytics-twitter-sentiment-analysis-trends/wpfclientlines.png)

4. *Optional:* Adjust the keywords to search for.  As a default, this application looks for some game keywords.  You can adjust the values for **twitter_keywords** in TwitterWpfClient.exe.config, if desired.
5. Run TwitterWpfClient.exe and click the green start button to collect social sentiment. You will see Tweet events with the **CreatedAt**, **Topic**, and **SentimentScore** values being sent to your event hub.

## Create a Stream Analytics job

Now that Tweet events are streaming in real-time from Twitter, we can set up a Stream Analytics job to analyze these events in real-time.

### Provision a Stream Analytics job

In the [Azure portal](https://portal.azure.com/), click **NEW** > type **STREAM ANALYTICS** > and click the Stream Analytics tile result. Specify the following values, and then click **CREATE**.

   * **JOB NAME**: Enter a job name.
   * **Resource group**: Select the resource group created earlier in this exercise from the "use existing" option.
   * **STORAGE ACCOUNT**: Choose the Azure storage account that you would like to use to store monitoring data for all Stream Analytics jobs that run within this region. You have the option to choose an existing storage account or to create a new one.   

![New Job](./media/stream-analytics-twitter-sentiment-analysis-trends/newjob.png)

Once the job is created the job will open in Azure portal.

## Specify the job input

In your Stream Analytics job, click **INPUTS** in the middle of the job pane, in Job Topology, and then click **ADD**. The portal will then prompt for some information listed below. Most of the default values will suffice but they are defined below for your information.
  
   * **INPUT ALIAS**: Enter a friendly name for this job input, such as `TwitterStream`. You will use this name in the query later.
   * **EVENT HUB NAME**: Select the name of the event hub.
   * **EVENT HUB POLICY NAME**: Select the event hub policy that you created earlier in this tutorial.

Click the **Create** button.

## Specify job query

Stream Analytics supports a simple, declarative query model that describes transformations. To learn more about the language, see the [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx).  This tutorial will help you author and test several queries over Twitter data.

To compare the number of mentions among topics, we'll use a [Tumbling Window](https://msdn.microsoft.com/library/azure/dn835055.aspx) to get the count of mentions by topic every five seconds.

Change the query in the code editor to the code below and then click **Save**:

```
SELECT System.Timestamp as Time, Topic, COUNT(*)
FROM TwitterStream TIMESTAMP BY CreatedAt
GROUP BY TUMBLINGWINDOW(s, 5), Topic
```   

This query uses the **TIMESTAMP BY** keyword to specify a timestamp field in the payload to be used in the temporal computation. If this field wasn't specified, the windowing operation would be performed by using the time that each event arrived at the event hub.  Learn more in the "Arrival Time vs Application Time" section of [Stream Analytics Query Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx).

This query also accesses a timestamp for the end of each window by using the **System.Timestamp** property.

![Query Box](./media/stream-analytics-twitter-sentiment-analysis-trends/querybox.png)

## Create output sink

Now that we have defined an event stream, an event hub input to ingest events, and a query to perform a transformation over the stream, the last step is to define an output sink for the job.  We'll write the aggregated tweet events from our job query to Azure Blob storage.  You could also push your results to Azure SQL Database, Azure Table storage, or Event Hubs, depending on your specific application needs.

## Specify job output

In your Stream Analytics job, click **OUTPUT** in **Job Topology**, and then click **ADD**. Then type or select the following values on the pane:
   
   * **OUTPUT ALIAS**: Enter a friendly name for this job output. This demonstration will use `Output`.
   * **Sink**: Select Blob storage.
   * **STORAGE ACCOUNT**: Select "Create a new storage account".
    * **STORAGE account**: Give the new storage account a name (`socialtwitter` in this example)
    * **CONTAINER**: Give the new container a name  (`socialtwitter` in this example)

Leave the rest of the entries as default values. Lastly, click **Create**.

## Start the job

Because a job input, query, and output have all been specified, we are ready to start the Stream Analytics job.

In the job overview pane simply click **START** at the top of the page.

In the dialog box that opens, click **JOB START TIME**, and then click the **CHECK** button on the bottom of the dialog box. The job status will change to **Starting** and will shortly change to **Running**.

![Job running](./media/stream-analytics-twitter-sentiment-analysis-trends/jobrunning.png)

## View output for sentiment analysis

After your job is running and processing the real-time Twitter stream, choose how you want to view the output for sentiment analysis. Use a tool like [Azure Storage Explorer](https://http://storageexplorer.com/) or [Azure Explorer](http://www.cerebrata.com/products/azure-explorer/introduction) to view your job output in real-time. From here, you can use [Power BI](https://powerbi.com/) to extend your application to include a customized dashboard like the one in the following screenshot.

![powerbi](./media/stream-analytics-twitter-sentiment-analysis-trends/power-bi.png)

## Another query of interest  in this scenario

Another sample query we created for this scenario are based on [Sliding Window](https://msdn.microsoft.com/library/azure/dn835051.aspx). To identify trending topics, we'll look for topics that cross a threshold value for mentions in a given amount of time. For the purposes of this tutorial, we'll check for topics that are mentioned more than 20 times in the last five seconds.

```
SELECT System.Timestamp as Time, Topic, COUNT(*) as Mentions
FROM TwitterStream TIMESTAMP BY CreatedAt
GROUP BY SLIDINGWINDOW(s, 5), topic
HAVING COUNT(*) > 20
```

## Get support
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics).

## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)

