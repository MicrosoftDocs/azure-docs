<properties
	pageTitle="Get started with Stream Analytics: Real-time fraud detection | Microsoft Azure"
	description="Learn how to use Stream Analytics to build a real-time fraud detection solution over generated telecommunication data."
	services="stream-analytics"
	documentationCenter=""
	authors="jeffstokes72"
	manager="paulettm"
	editor="cgronlun" />

<tags
	ms.service="stream-analytics"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="data-services"
	ms.date="04/28/2015"
	ms.author="jeffstok" />



# Get started using Azure Stream Analytics: Real-time fraud detection

Azure Stream Analytics is a fully managed service providing low-latency, highly available, scalable complex event processing over streaming data in the cloud. For more information, see [Introduction to Azure Stream Analytics](stream-analytics-introduction.md).

Learn how to create an end-to-end solution for real-time fraud detection with Stream Analytics. Bring events into Azure Event Hubs, write Stream Analytics queries for aggregation or alerting, and send the results to an output sink to gain insight over data in real time.

##Scenario: Telecommunications and SIM fraud

A telecommunications company has a large volume of data for incoming calls. They want to pare this data down to a manageable amount and obtain insights about customer usage over time and geographical regions. They are also very interested in detecting SIM fraud (multiple calls coming from the same identity around the same time but in geographically different locations) in real time so that they can easily respond by notifying customers or shutting down service.  These are canonical Internet of Things (IoT) like scenarios where there is a ton of telemetry or sensor data being generated – and customers want to aggregate them or alert over anomalies.

##Prerequisites

This scenario leverages an event generator located on GitHub.  Download it [here](https://github.com/Azure/azure-stream-analytics/tree/master/DataGenerators/TelcoGenerator) and follow the steps in this tutorial to set up your solution.

## Create an Event Hub input and Consumer Group

The sample application will generate events and push them to an Event Hub instance. Service Bus Event Hubs are the preferred method of event ingestion for Stream Analytics and you can learn more about Event Hubs in [Azure Service Bus documentation](/documentation/services/service-bus/).

Follow the steps below to create an Event Hub.

1.	In the [Azure portal](https://manage.windowsazure.com/) click **New** > **App Services** > **Service Bus** > **Event Hub** > **Quick Create**. Provide a name, region, and new or existing namespace to create a new Event Hub.  
2.	As a best practice, each Stream Analytics job should read from a single Event Hub Consumer Group. We will walk you through the process of creating a Consumer Group below, and you can [learn more about Consumer Groups](https://msdn.microsoft.com/library/azure/dn836025.aspx). To create a Consumer Group, navigate to the newly created Event Hub and click the **Consumer Groups** tab, then click **Create** on the bottom of the page and provide a name for your Consumer Group.
3.	To grant access to the Event Hub, we will need to create a shared access policy.  Click the **Configure** tab of your Event Hub.
4.	Under **Shared Access Policies**, create a new policy with **Manage** permissions.

	![Shared Access Policies where you can create a policy with Manage permissions.](./media/stream-analytics-get-started/stream-ananlytics-shared-access-policies.png)

5.	Click **Save** at the bottom of the page.
6.	Navigate to the **Dashboard** and click **Connection Information** at the bottom of the page and copy and save the connection information.

## Configure and start event generator application

We have provided a client application that will generate sample incoming call metadata and push it to Event Hub. Follow the steps below to setup this application.  

1.	Download the TelcoGenerator solution from [https://github.com/Azure/azure-stream-analytics/tree/master/DataGenerators/TelcoGenerator](https://github.com/Azure/azure-stream-analytics/tree/master/DataGenerators/TelcoGenerator).
2.	Replace the Microsoft.ServiceBus.ConnectionString and EventHubName values in App.Config with your Event Hub connection string and name.
3.	Build the solution to trigger the download of required nuget packages.
4.	Start the application. The usage is as follows:

    	telcodatagen [#NumCDRsPerHour] [SIM Card Fraud Probability] [#DurationHours]

The following example will generate 1000 events with a 20% probability of fraud over the course of 2 hours:

    TelcoDataGen.exe 1000 .2 2

You will see records being sent to your Event Hub. Some key fields that we will be using in this application are defined here:

| Record | Definition |
| ------------- | ------------- |
| CallrecTime | Timestamp for the call start time |
| SwitchNum | Telephone switch used to connect the call |
| CallingNum | Phone number of the caller |
| CallingIMSI | International Mobile Subscriber Identity (IMSI).  Unique identifier of the caller |
| CalledNum | Phone number of the call recipient |
| CalledIMSI | International Mobile Subscriber Identity (IMSI).  Unique identifier of the call recipient |


## Create Stream Analytics job
Now that we have a stream of telecommunications events, we can set up a Stream Analytics job to analyze these events in real time.

### Provision a Stream Analytics job

1.	From the Azure portal, click **New** > **Data Services** > **Stream Analytics** > **Quick Create**.
2.	Specify the following values, and then click **Create Stream Analytics Job**:

	* **Job Name**: Enter a job name.

	* **Region**: Select the region where you want to run the job. Consider placing the job and the event hub in the same 	region to ensure better performance and to ensure that you will not be paying to transfer data between regions.

	* **Storage Account**: Choose the Storage account that you would like to use to store monitoring data for all Stream Analytics jobs running within this region. You have the option to choose an existing Storage account or to create a new one.

3.	Click **Stream Analytics** in the left pane to list the Stream Analytics jobs.

	![Stream Analytics service icon](./media/stream-analytics-get-started/stream-analytics-service-icon.png)

4.	The new job will be shown with a status of **Created**. Notice that the **Start** button on the bottom of the page is disabled. You must configure the job input, output, and query before you can start the job.

### Specify job input
1.	In your Stream Analytics job click **Inputs** from the top of the page, and then click **Add Input**. The dialog box that opens will walk you through a number of steps to set up your input.
2.	Select **Data Stream**, and then click the right button.
3.	Select **Event Hub**, and then click the right button.
4.	Type or select the following values on the third page:

	* **Input Alias**: Enter a friendly name for this job input such as *CallStream*. Note that you will be using this name in the query later on.
	* **Event Hub**: If the Event Hub you created is in the same subscription as the Stream Analytics job, select the namespace that the event hub is in.

	If your event hub is in a different subscription, select **Use Event Hub from Another Subscription** and manually enter information for **Service Bus Namespace**, **Event Hub Name**, **Event Hub Policy Name**, **Event Hub Policy Key**, and **Event Hub Partition Count**.

	* **Event Hub Name**: Select the name of the Event Hub

	* **Event Hub Policy Name**: Select the event-hub policy created earlier in this tutorial.

	* **Event Hub Consumer Group**: Type in the Consumer Group created earlier in this tutorial.
5.	Click the right button.
6.	Specify the following values:

	* **Event Serializer Format**: JSON
	* **Encoding**: UTF8
7.	Click the check button to add this source and to verify that Stream Analytics can successfully connect to the event hub.

### Specify job query

Stream Analytics supports a simple, declarative query model for describing transformations. To learn more about the language, see the [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/dn834998.aspx). This tutorial will help you author and test several queries over your stream of call data.

#### Optional: Sample input data
To validate your query against actual job data, you can use the **Sample Data** feature to extract events from your stream and create a .JSON file of the events for testing.  The steps below show how to do this and we have also provided a sample [Telco.json](https://github.com/Azure/azure-stream-analytics/blob/master/Sample%20Data/telco.json) file for testing purposes.

1.	Select your Event Hub input and click **Sample Data** at the bottom of the page.
2.	In the dialog that appears, specify a **Start Time** to start collecting data from and a **Duration** for how much additional data to consume.
3.	Click the check button to start sampling data from the input.  It can take a minute or two for the data file to be produced.  When the process has completed, click **Details** and download and save the .JSON file that is generated.

	![Download and save processed data in a JSON file](./media/stream-analytics-get-started/stream-analytics-download-save-json-file.png)

#### Passthrough query

If you want to archive every event, you can use a passthrough query to read all the fields in the payload of the event or message. To start with, do a simple passthrough query that projects all the fields in an event.

1.	Click **Query** from the top of the Stream Analytics job page.
2.	Add the following to the code editor:

		SELECT * FROM CallStream

	> Make sure that the name of the input source matches the name of the input you specified earlier.

3.	Click **Test** under the query editor
4.	Supply a test file, either one that you created using the steps above or [Telco.json](https://github.com/Azure/azure-stream-analytics/blob/master/Sample%20Data/telco.json)
5.	Click the check button and see the results displayed below the query definition.

	![Query definition results](./media/stream-analytics-get-started/stream-analytics-sim-fraud-output.png)


### Column projection

We'll now pare down the returned fields to a smaller set.

1.	Change the query in the code editor to:

		SELECT CallRecTime, SwitchNum, CallingIMSI, CallingNum, CalledNum
		FROM CallStream

2.	Click **Rerun** under the query editor to see the results of the query.

	![Output in query editor.](./media/stream-analytics-get-started/stream-analytics-query-editor-output.png)

### Count of incoming calls by region: Tumbling window with aggregation

To compare the amount that incoming calls per region we'll leverage a [TumblingWindow](https://msdn.microsoft.com/library/azure/dn835055.aspx) to get the count of incoming calls grouped by SwitchNum every 5 seconds.

1.	Change the query in the code editor to:

		SELECT System.Timestamp as WindowEnd, SwitchNum, COUNT(*) as CallCount
		FROM CallStream TIMESTAMP BY CallRecTime
		GROUP BY TUMBLINGWINDOW(s, 5), SwitchNum

	This query uses the **Timestamp By** keyword to specify a timestamp field in the payload to be used in the temporal computation. If this field wasn't specified, the windowing operation would be performed using the time each event arrived at Event Hub. See ["Arrival Time Vs Application Time" in the Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx).

	Note that you can access a timestamp for the end of each window by using the System.Timestamp property.

2.	Click **Rerun** under the query editor to see the results of the query.

	![Query results for Timestand By](./media/stream-analytics-get-started/stream-ananlytics-query-editor-rerun.png)

### Identifying SIM fraud with a Self-Join

To identify potentially fraudulent usage we'll look for calls originating from the same user in but different locations in less than 5 seconds.  We [Join](https://msdn.microsoft.com/library/azure/dn835026.aspx) the stream of call events with itself to check for these cases.

1.	Change the query in the code editor to:

		SELECT System.Timestamp as Time, CS1.CallingIMSI, CS1.CallingNum as CallingNum1,
		CS2.CallingNum as CallingNum2, CS1.SwitchNum as Switch1, CS2.SwitchNum as Switch2
		FROM CallStream CS1 TIMESTAMP BY CallRecTime
		JOIN CallStream CS2 TIMESTAMP BY CallRecTime
		ON CS1.CallingIMSI = CS2.CallingIMSI
		AND DATEDIFF(ss, CS1, CS2) BETWEEN 1 AND 5
		WHERE CS1.SwitchNum != CS2.SwitchNum

2.	Click **Rerun** under the query editor to see the results of the query.

	![Query results of a join](./media/stream-analytics-get-started/stream-ananlytics-query-editor-join.png)

### Create output sink

Now that we have defined an event stream, an Event Hub input to ingest events, and a query to perform a transformation over the stream, the last step is to define an output sink for the job.  We'll write events for fraudulent behavior to blob storage.

Follow the steps below to create a container for Blob storage if you don't already have one.

1.	Use an existing Storage account or create a new Storage account by clicking **NEW** > **DATA SERVICES** > **STORAGE** > **QUICK CREATE** and following the instructions.
2.	Select the Storage account and then click **CONTAINERS** at the top of the page and then click **ADD**.
3.	Specify a **NAME** for your container and set its **ACCESS** to Public Blob.

## Specify job output

1.	In your Stream Analytics job click **OUTPUT** from the top of the page, and then click **ADD OUTPUT**. The dialog that opens will walk you through a number of steps to set up your output.
2.	Select **BLOB STORAGE**, and then click the right button.
3.	Type or select the following values on the third page:

	* **OUTPUT ALIAS**: Enter a friendly name for this job output.
	* **SUBSCRIPTION**: If the Blob Storage you created is in the same subscription as the Stream Analytics job, select **Use Storage Account from Current Subscription**. If your storage is in a different subscription, select **Use Storage Account from Another Subscription** and manually enter information for **STORAGE ACCOUNT**, **STORAGE ACCOUNT KEY**, **CONTAINER**.
	* **STORAGE ACCOUNT**: Select the name of the storage account.
	* **CONTAINER**: Select the name of the container.
	* **FILENAME PREFIX**: Type in a file prefix to use when writing blob output.

4.	Click the right button.
5.	Specify the following values:

	* **EVENT SERIALIZER FORMAT**: JSON
	* **ENCODING**: UTF8

6.	Click the check button to add this source and to verify that Stream Analytics can successfully connect to the storage account.

## Start job

Since a job input, query and output have all been specified, we are ready to start the Stream Analytics job.

1.	From the job **DASHBOARD**, click **START** at the bottom of the page.
2.	In the dialog that appears, select **JOB START TIME** and click the check button on the bottom of the dialog. The job status will change to **Starting** and will shortly move to **Running**.

## View output

Use a tool like [Azure Storage Explorer](https://azurestorageexplorer.codeplex.com/) or [Azure Explorer](http://www.cerebrata.com/products/azure-explorer/introduction) to view fraudulent events as they are written to your output in real time.  

![Fraudulent events viewed in real-time](./media/stream-analytics-get-started/stream-ananlytics-view-real-time-fraudent-events.png)

## Get support
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics). 


## Next steps

- [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
- [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
- [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
- [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
- [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx) 
