<properties
	pageTitle="Real-time Twitter sentiment analysis with Stream Analytics | Microsoft Azure"
	description="Learn how to use Stream Analytics for real-time Twitter sentiment analysis. Step-by-step guidance from event generation to data on a live dashboard."
	keywords="real-time twitter trend analysis, sentiment analysis, social media analysis, trend analysis example"
	services="stream-analytics"
	documentationCenter=""
	authors="jeffstokes72"
	manager="jhubbard"
	editor="cgronlun"/>

<tags
	ms.service="stream-analytics"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="big-data"
	ms.date="09/26/2016"
	ms.author="jeffstok"/>


# Social media analysis: Real-time Twitter sentiment analysis in Azure Stream Analytics

Learn how to build a sentiment analysis solution for social media analytics by bringing real-time Twitter events into Azure Event Hubs. You'll write an Azure Stream Analytics query to analyze the data. You'll then either store the results for later perusal or use a dashboard and [Power BI](https://powerbi.com/) to provide insights in real time.

Social media analytics tools help organizations understand trending topics, that is, subjects and attitudes that have a high volume of posts in social media. Sentiment analysis, which is also called *opinion mining*, uses social media analytics tools to determine attitudes toward a product, idea, and so on. Real-time Twitter trend analysis is a great example because the hashtag subscription model enables you to listen to specific keywords and develop sentiment analysis on the feed.

## Scenario: Sentiment analysis in real time

A company that has a news media website is interested in getting an advantage over its competitors by featuring site content that is immediately relevant to its readers. The company uses social media analysis on topics that are relevant to readers by doing real-time sentiment analysis on Twitter data. Specifically, to identify trending topics in real time on Twitter, the company needs real-time analytics about the tweet volume and sentiment for key topics. So, in essence, the need is a sentiment analysis analytics engine that's based on this social media feed.

## Prerequisites
-	Twitter account and [OAuth access token](https://dev.twitter.com/oauth/overview/application-owner-access-tokens)
-	[TwitterClient.zip](http://download.microsoft.com/download/1/7/4/1744EE47-63D0-4B9D-9ECF-E379D15F4586/TwitterClient.zip) from the Microsoft Download Center
-	Optional: Source code for twitter client from [GitHub](https://aka.ms/azure-stream-analytics-twitterclient)

## Create an event hub input and a consumer group

The sample application will generate events and push them to an Event Hubs instance (an event hub, for short). Service Bus event hubs are the preferred method of event ingestion for Stream Analytics. See Event Hubs documentation in [Service Bus documentation](/documentation/services/service-bus/).

Use the following steps to create an event hub.

1.	In the Azure portal, click **NEW** > **APP SERVICES** > **SERVICE BUS** > **EVENT HUB** > **QUICK CREATE**, and provide a name, region, and new or existing namespace.  
2.	As a best practice, each Stream Analytics job should read from a single Event Hubs consumer group. We will walk you through the process of creating a consumer group later. You can learn more about consumer groups at [Azure Event Hubs overview](https://msdn.microsoft.com/library/azure/dn836025.aspx). To create a consumer group, go to the newly created event hub, click the **CONSUMER GROUPS** tab, click **CREATE** on the bottom of the page, and then provide a name for your consumer group.
3.	To grant access to the event hub, we will need to create a shared access policy. Click the **CONFIGURE** tab of your event hub.
4.	Under **SHARED ACCESS POLICIES**, create a new policy with **MANAGE** permissions.

	![Shared Access Policies where you can create a policy with Manage permissions.](./media/stream-analytics-twitter-sentiment-analysis-trends/stream-ananlytics-shared-access-policies.png)

5.	Click **SAVE** at the bottom of the page.
6.	Go to the **DASHBOARD**, click **CONNECTION INFORMATION** at the bottom of the page, and then copy and save the connection information. (Use the copy icon that appears under the search icon.)

## Configure and start the Twitter client application

We have provided a client application that will connect to Twitter data via [Twitter's Streaming APIs](https://dev.twitter.com/streaming/overview) to collect Tweet events about a parameterized set of topics. The [Sentiment140](http://help.sentiment140.com/) open source tool is used to assign a sentiment value to each tweet.

- 0 = negative
- 2 = neutral
- 4 = positive

Then, Tweet events are pushed to the event hub.  

Follow these steps to set up the application:

1.	[Download the TwitterClient solution](http://download.microsoft.com/download/1/7/4/1744EE47-63D0-4B9D-9ECF-E379D15F4586/TwitterClient.zip).
2.	Open TwitterClient.exe.config, and replace oauth_consumer_key, oauth_consumer_secret, oauth_token, and oauth_token_secret with Twitter tokens that have your values.  

	[Steps to generate an OAuth access token](https://dev.twitter.com/oauth/overview/application-owner-access-tokens)  

	Note that you will need to make an empty application to generate a token.  
3.	Replace the EventHubConnectionString and EventHubName values in TwitterClient.exe.config with the connection string and name of your event hub. The connection string that you copied earlier gives you both the connection string and the name of your event hub, so be sure to separate them and put each in the correct field. For example, consider the following connection string:

        Endpoint=sb://your.servicebus.windows.net/;SharedAccessKeyName=yourpolicy;SharedAccessKey=yoursharedaccesskey;EntityPath=yourhub

	The TwitterClient.exe.config file should contain your settings as in the following example:

        add key="EventHubConnectionString" value="Endpoint=sb://your.servicebus.windows.net/;SharedAccessKeyName=yourpolicy;SharedAccessKey=yoursharedaccesskey"
        add key="EventHubName" value="yourhub"

	It is important to note that the text "EntityPath=" does __not__ appear in the EventHubName value.

4.	*Optional:* Adjust the keywords to search for.  As a default, this application looks for "Azure,Skype,XBox,Microsoft,Seattle".  You can adjust the values for **twitter_keywords** in TwitterClient.exe.config, if desired.
5.	Run TwitterClient.exe to start your application. You will see Tweet events with the **CreatedAt**, **Topic**, and **SentimentScore** values being sent to your event hub.

	![Sentiment analysis: SentimentScore values sent to an event hub.](./media/stream-analytics-twitter-sentiment-analysis-trends/stream-analytics-twitter-sentiment-output-to-event-hub.png)

## Create a Stream Analytics job

Now that Tweet events are streaming in real time from Twitter, we can set up a Stream Analytics job to analyze these events in real time.

### Provision a Stream Analytics job

1.	In the [Azure portal](https://manage.windowsazure.com/), click **NEW** > **DATA SERVICES** > **STREAM ANALYTICS** > **QUICK CREATE**.
2.	Specify the following values, and then click **CREATE STREAM ANALYTICS JOB**:

	* **JOB NAME**: Enter a job name.
	* **REGION**: Select the region where you want to run the job. Consider placing the job and the event hub in the same region to ensure better performance and to ensure that you will not be paying to transfer data between regions.
	* **STORAGE ACCOUNT**: Choose the Azure storage account that you would like to use to store monitoring data for all Stream Analytics jobs that run within this region. You have the option to choose an existing storage account or to create a new one.

3.	Click **STREAM ANALYTICS** in the left pane to list the Stream Analytics jobs.  
	![Stream Analytics service icon](./media/stream-analytics-twitter-sentiment-analysis-trends/stream-analytics-service-icon.png)

	The new job will be shown with a status of **CREATED**. Notice that the **START** button on the bottom of the page is disabled. You must configure the job input, output, and query before you can start the job.


### Specify job input
1.	In your Stream Analytics job, click **INPUTS** from the top of the page, and then click **ADD INPUT**. The dialog box that opens will walk you through a number of steps to set up your input.
2.	Click **DATA STREAM**, and then click the right button.
3.	Click **EVENT HUB**, and then click the right button.
4.	Type or select the following values on the third page:

	* **INPUT ALIAS**: Enter a friendly name for this job input, such as *TwitterStream*. Note that you will use this name in the query later.
	**EVENT HUB**: If the event hub that you created is in the same subscription as the Stream Analytics job, select the namespace that the event hub is in.

		If your event hub is in a different subscription, click **Use Event Hub from Another Subscription**, and then manually enter information for **SERVICE BUS NAMESPACE**, **EVENT HUB NAME**, **EVENT HUB POLICY NAME**, **EVENT HUB POLICY KEY**, and **EVENT HUB PARTITION COUNT**.

	* **EVENT HUB NAME**: Select the name of the event hub.

	* **EVENT HUB POLICY NAME**: Select the event hub policy that you created earlier in this tutorial.

	* **EVENT HUB CONSUMER GROUP**: Type the name of the consumer group that you created earlier in this tutorial.
5.	Click the right button.
6.	Specify the following values:

	* **EVENT SERIALIZER FORMAT**: JSON
	* **ENCODING**: UTF8

7.	Click the **CHECK** button to add this source and to verify that Stream Analytics can successfully connect to the event hub.

### Specify job query

Stream Analytics supports a simple, declarative query model that describes transformations. To learn more about the language, see the [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx).  This tutorial will help you author and test several queries over Twitter data.

#### Sample data input

To validate your query against actual job data, you can use the **SAMPLE DATA** feature to extract events from your stream and create a .json file of the events for testing.

1.	Select your event hub input, and then click **SAMPLE DATA** at the bottom of the page.
2.	In the dialog box that opens, specify a **START TIME** to start collecting data and a **DURATION** for how much additional data to consume.
3.	Click the **DETAILS** button, and then click the **Click here** link to download and save the generated .json file.

#### Pass-through query
To start, we will do a simple pass-through query that projects all the fields in an event.

1.	Click **QUERY** at the top of the Stream Analytics job page.
2.	In the code editor, replace the initial query template with the following:

		SELECT * FROM TwitterStream

	Make sure that the name of the input source matches the name of the input that you specified earlier.

3.	Click **Test** under the query editor.
4.	Go to your sample .json file.
5.	Click the **CHECK** button, and see the results below the query definition.

	![Results displayed below query definition](./media/stream-analytics-twitter-sentiment-analysis-trends/stream-analytics-sentiment-by-topic.png)

#### Count of tweets by topic: Tumbling window with aggregation

To compare the number of mentions among topics, we'll use a [TumblingWindow](https://msdn.microsoft.com/library/azure/dn835055.aspx) to get the count of mentions by topic every five seconds.

1.	Change the query in the code editor to:

		SELECT System.Timestamp as Time, Topic, COUNT(*)
		FROM TwitterStream TIMESTAMP BY CreatedAt
		GROUP BY TUMBLINGWINDOW(s, 5), Topic

	This query uses the **TIMESTAMP BY** keyword to specify a timestamp field in the payload to be used in the temporal computation. If this field wasn't specified, the windowing operation would be performed by using the time that each event arrived at the event hub.  Learn more in the "Arrival Time Vs Application Time" section of [Stream Analytics Query Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx).

	This query also accesses a timestamp for the end of each window by using the **System.Timestamp** property.

2.	Click **Rerun** under the query editor to see the results of the query.

#### Identify trending topics: Sliding window

To identify trending topics, we'll look for topics that cross a threshold value for mentions in a given amount of time. For the purposes of this tutorial, we'll check for topics that are mentioned more than 20 times in the last five seconds by using a [SlidingWindow](https://msdn.microsoft.com/library/azure/dn835051.aspx).

1.	Change the query in the code editor to:
		SELECT System.Timestamp as Time, Topic, COUNT(*) as Mentions
		FROM TwitterStream TIMESTAMP BY CreatedAt
		GROUP BY SLIDINGWINDOW(s, 5), topic
		HAVING COUNT(*) > 20

2.	Click **Rerun** under the query editor to see the results of the query.

	![Sliding Window query output](./media/stream-analytics-twitter-sentiment-analysis-trends/stream-analytics-query-output.png)

#### Count of mentions and sentiment: Tumbling window with aggregation
The final query that we will test uses **TumblingWindow** to get the number of mentions, average, minimum, maximum, and standard deviation of sentiment score for each topic every five seconds.

1.	Change the query in the code editor to:

		SELECT System.Timestamp as Time, Topic, COUNT(*), AVG(SentimentScore), MIN(SentimentScore),
    	Max(SentimentScore), STDEV(SentimentScore)
		FROM TwitterStream TIMESTAMP BY CreatedAt
		GROUP BY TUMBLINGWINDOW(s, 5), Topic

2.	Click **Rerun** under the query editor to see the results of the query.
3.	This is the query that we will use for our dashboard.  Click **SAVE** at the bottom of the page.


## Create output sink

Now that we have defined an event stream, an event hub input to ingest events, and a query to perform a transformation over the stream, the last step is to define an output sink for the job.  We'll write the aggregated tweet events from our job query to Azure Blob storage.  You could also push your results to Azure SQL Database, Azure Table storage, or Event Hubs, depending on your specific application needs.

Use the following steps to create a container for Blob storage, if you don't already have one:

1.	Use an existing storage account or create a new storage account by clicking **NEW** > **DATA SERVICES** > **STORAGE** > **QUICK CREATE**, and then following the instructions on the screen.
2.	Select the storage account, click **CONTAINERS** at the top of the page, and then click **ADD**.
3.	Specify a **NAME** for your container, and set its **ACCESS** to **Public Blob**.

## Specify job output

1.	In your Stream Analytics job, click **OUTPUT** at the top of the page, and then click **ADD OUTPUT**. The dialog box that opens will walk you through several steps to set up your output.
2.	Click **BLOB STORAGE**, and then click the right button.
3.	Type or select the following values on the third page:

	* **OUTPUT ALIAS**: Enter a friendly name for this job output.

	* **SUBSCRIPTION**: If the Blob storage that you created is in the same subscription as the Stream Analytics job, click **Use Storage Account from Current Subscription**. If your storage is in a different subscription, click **Use Storage Account from Another Subscription**, and manually enter information for **STORAGE ACCOUNT**, **STORAGE ACCOUNT KEY**, and **CONTAINER**.

	* **STORAGE ACCOUNT**: Select the name of the storage account.

	* **CONTAINER**: Select the name of the container.

	* **FILENAME PREFIX**: Type a file prefix to use when writing blob output.

4.	Click the right button.
5.	Specify the following values:
	* **EVENT SERIALIZER FORMAT**: JSON
	* **ENCODING**: UTF8
6.	Click the **CHECK** button to add this source and to verify that Stream Analytics can successfully connect to the storage account.

## Start job

Because a job input, query, and output have all been specified, we are ready to start the Stream Analytics job.

1.	From the job **DASHBOARD**, click **START** at the bottom of the page.
2.	In the dialog box that opens, click **JOB START TIME**, and then click the **CHECK** button on the bottom of the dialog box. The job status will change to **Starting** and will shortly change to **Running**.


## View output for sentiment analysis

After your job is running and processing the real-time Twitter stream, choose how you want to view the output for sentiment analysis. Use a tool like [Azure Storage Explorer](https://azurestorageexplorer.codeplex.com/) or [Azure Explorer](http://www.cerebrata.com/products/azure-explorer/introduction) to view your job output in real time. From here, you can use [Power BI](https://powerbi.com/) to extend your application to include a customized dashboard like the one in the following screenshot.

![Social media analysis: Stream Analytics sentiment analysis (opinion mining) output in a Power BI dashboard.](./media/stream-analytics-twitter-sentiment-analysis-trends/stream-analytics-output-power-bi.png)

## Get support
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics).


## Next steps

- [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
- [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
- [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
- [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
- [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
