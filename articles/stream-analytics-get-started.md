<properties 
	pageTitle="Get started using Azure Stream Analytics | Azure" 
	description="Get started using Azure Stream Analytics to process and transform events in Azure Service Bus Event Hub and store the results to Azure SQL Database." 
	services="stream-analytics" 
	documentationCenter="" 
	authors="mumian" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="stream-analytics" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="01/02/2015" 
	ms.author="jgao"/>


# Get started using Azure Stream Analytics

Azure Stream Analytics is a fully managed service providing low latency, highly available, scalable complex event processing over streaming data in the cloud. For more information, see [Introduction to Azure Stream Analytics][stream.analytics.introduction] and [Azure Stream Analytics documentation][stream.analytics.documentation].

To get you started quickly using Stream Analytics, this tutorial will show you how to consume device temperature reading data from an [Azure Service Bus Event Hub][azure.event.hubs.documentation] and process the data, outputting the results to an [Azure SQL Database][azure.sql.database.documentation].  The following diagram shows the flow of events from input to processing to output:
  
![Azure Stream Analytics get started flow][img.get.started.flowchart]

##In this article

- [Generate Event Hub sample data](#generateData)
- [Prepare an Azure SQL Database for storing output data](#prepareDatabase)
- [Create a Stream Analytics job](#createJob)
- [Start the job](#startJob)
- [View job output](#viewJobOutput)
- [Stop, update, and restart Job](#updateJob)
- [View job output](#viewJobOutput2)
- [Next steps](#nextsteps)


##<a name="generateData"></a>Generate Event Hub sample data
This tutorial will leverage the *Service Bus Event Hubs Getting Started* application, a code sample in the MSDN CodeGallery, to create a new Event Hub, generate sample device temperature readings, and send the device reading data to the Event Hub.

###Create a Service Bus namespace
The sample application will create an Event Hub in a preexisting Service Bus namespace.  You can use a Service Bus namespace you've already provisioned or follow the steps below to create a new one:

1.	Sign in to the [Azure Management portal][azure.management.portal].
2.	Click **SERVICE BUS** in the left pane to open the Service Bus page. 
2.	Click **CREATE** on the bottom of page, and follow the instructions to create a namespace. Use **MESSAGING** as the type. It takes a few moments to get the namespace created.
3.	Click the newly created namespace, and then click **CONNECTION INFORMATION** on the bottom of the page.
4.	Copy the connection string. You will use it later in the tutorial.

###Create an Azure Storage account

This sample application requires an Azure Storage account or a Storage Emulator for maintaining the application state. You can use an existing Storage account or follow the steps below to create one: 

1.	From the Management portal, create a new Storage Account by clicking **NEW**, **DATA SERVICES**, **STORAGE**, **QUICK CREATE**, and follow the instructions. It takes a few moments to get the Storage account created.
2.	Select the newly created storage account and then click **MANAGE ACCESS KEYS** at the bottom of the page.
3.	Copy the storage account name and one of the access keys.

###Generate Event Hub sample data

1.	Download [Service Bus Event Hubs Getting Started.zip](https://code.msdn.microsoft.com/windowsapps/Service-Bus-Event-Hub-286fd097), and then unzip it to your workstation.
2.	Open the **EventHubSample.sln** solution file in Visual Studio.
3.	Open **app.config**.
4.	Specify both the Service Bus and the Storage account connection strings. The key names are **Microsoft.ServiceBus.ConnectionString** and **AzureStorageConnectionString**. 

	The service bus connection string will be in the following format: 
 
		Endpoint=sb://<namespaceName>.servicebus.windows.net/;SharedAccessKeyName=<yourAccessKeyName>;SharedAccessKey=<yourAccessKey> 


	The storage account connection string will be in the following format: 	

		DefaultEndpointsProtocol=https;AccountName=<accountName>;AccountKey=<yourAccountKey>;
5.	Build the solution.
6.	Run the application from the bins folder.  The usage is as follows: 

		BasicEventHubSample <eventhubname> <NumberOfMessagesToSend> <NumberOfPartitions> 

	The following example creates a new Event Hub called **devicereadings** with **16** partitions, and then sends **200** events to the Event Hub: 

		BasicEventHubSample devicereadings 200 16

 	![insert image here][img.stream.analytics.event.hub.client.output] 
7. After the events have been sent, press **ENTER** to close the application. 

###Create an Event Hub Shared Access Policy
While there is already a Shared Access Policy on the Service Bus namespace that can be used to connect to everything inside the namespace, for best security practices we will create a separate policy for the Event Hub only.

1.	From the Management portal, open the **SERVICE BUS** page, and then click the Service Bus namespace name.
2.	Click **EVENT HUBS** at the top of the page.
3.	Click **devicereadings**, the Event Hub for this tutorial. This is the default Event Hub name created by BasicEventHubSample.  
4.	Click **CONFIGURE** at the top of the page.
5.	Under Shared Access Policies, create a new policy with **Manage** permissions.

	![][img.stream.analytics.event.hub.shared.access.policy.config]
6.	Click **SAVE** at the bottom of the page.
7.	If the Event Hub is in a different subscription than the Stream Analytics job will be in, you will need to copy and save the connection information for later.  To do this, click **DASHBOARD**, and then click **CONNECTION INFORMATION** at the bottom of the page and save the Connection String.


##<a name="prepareDatabase"></a>Prepare an Azure SQL Database for storing output data
Azure Stream Analytics can output data to Azure SQL Database, Azure Blob storage, and Azure Event Hub. In this tutorial, you will define a job that outputs to an Azure SQL Database. For more information, see Getting Started with Microsoft Azure SQL Database.

###Create Azure SQL Database
If you already have an Azure SQL Database to use for this tutorial, skip this section.

1.	From the Management portal, click **NEW**, **DATA SERVICES**, **SQL DATABASE**, **QUICK CREATE**.  Specify a database name on an existing or a new SQL Database server.
2.	Select the newly created database
3.	Click **DASHBOARD**, click **Show connection strings** on the right pane of the page, and then copy the **ADO.NET** connection string. You will use it later in the tutorial.  
4.	Make sure the server-level firewall settings enable you to connect to the database.  You can do this by adding a new IP rule under the Server's Configure tab. For more details, including how to handle dynamic IP, see [http://msdn.microsoft.com/en-us/library/azure/ee621782.aspx](http://msdn.microsoft.com/en-us/library/azure/ee621782.aspx).

###Create output tables
1.	Open Visual Studio or SQL Server Management Studio.
2.	Connect to the Azure SQL Database.
3.	Use the following T-SQL statements to create two tables to your database:

		CREATE TABLE [dbo].[PassthroughReadings] (
		    [DeviceId]      BIGINT NULL,
			[Temperature] BIGINT    NULL
		);

		GO
		CREATE CLUSTERED INDEX [PassthroughReadings]
		    ON [dbo].[PassthroughReadings]([DeviceId] ASC);
		GO

		CREATE TABLE [dbo].[AvgReadings] (
		    [WinStartTime]   DATETIME2 (6) NULL,
		    [WinEndTime]     DATETIME2 (6) NULL,
		    [DeviceId]      BIGINT NULL,
			[AvgTemperature] FLOAT (53)    NULL,
			[EventCount] BIGINT null
		);
		
		GO
		CREATE CLUSTERED INDEX [AvgReadings]
		    ON [dbo].[AvgReadings]([DeviceId] ASC);

	>[AZURE.NOTE] Clustered indexes are required on all SQL Database tables in order to insert data.
	   
##<a name="createJob"></a>Create a Stream Analytics job

After you have created the Azure Service Bus Event Hub, the Azure SQL database and the output tables, you are ready to create a Stream Analytics job.

###Provision a Stream Analytics job
1.	From the Management portal, click **NEW**,**DATA SERVICES**, **STREAM ANALYTICS**, **QUICK CREATE**. 
2.	Specify the following values, and then click **CREATE STREAM ANALYTICS JOB**:

	- **JOB NAME**: Enter a job name. For example, **DeviceTemperatures**.
	- **REGION**: Select the region where you want to run the job. Azure Stream Analytics is currently only available in 2 regions during preview. For more information, see [Azure Stream Analytics limitations and known issues][stream.analytics.limitations]. Consider placing the job and the Event Hub in the same region to ensure better performance and that you will not be paying to transfer data between regions.
	- **STORAGE ACCOUNT**: Choose the Storage account that you would like to use to store monitoring data for all Stream Analytics jobs running within this region. You have the option to choose an existing Storage account or to create a new one.
	
3.	Click **STREAM ANALYTICS** in the left pane to list the Stream Analytics jobs.

	![][img.stream.analytics.portal.button]
 
	The new job will be listed with a status of **NOT STARTED**.  Notice the **START** button on the bottom of the page is disabled. You must configure the job input, output, query and so on before you can start the job. 

###Specify job input

1.	Click the job name.
2.	Click **INPUTS** from the top of the page, and then click **ADD INPUT**. The dialog that opens will walk you through a number of steps to setup your Input.
3.	Select **DATA STREAM**, and then click the right button.
4.	Select **EVENT HUB**, and then click the right button
5.	Type or select the following values on the third page: 

	- **INPUT ALIAS**: Enter a friendly name for this job input. Note that you will be using this name in the query later on.
	- **EVENT HUB**: If the Event Hub you created is in the same subscription as the Stream Analytics job, select the namespace the Event Hub is in.  

		If your Event Hub is in a different subscription, select **Use Event Hub from Another Subscription** and manually enter the **SERVICE BUS NAMESPACE**, **EVENT HUB NAME**, **EVENT HUB POLICY NAME**, **EVENT HUB POLICY KEY**, and **EVENT HUB PARTITION COUNT**.  

		>[AZURE.NOTE] This sample uses the default number of partitions, which is 16.
		
	- **EVENT HUB NAME**: Select the name of the Azure Event Hub you created. For this tutorial use **devicereadings**.
	- **EVENT HUB POLICY NAME**: Select the Event Hub policy created earlier in this tutorial.
 
	![][img.stream.analytics.config.input]

6.	Click the right button.
7.	Specify the following values:

	- **EVENT SERIALIZER FORMAT**: JSON
	- **ENCODING**: UTF8

8.	Click the check button to add this source and to verify that Stream Analytics can successfully connect to the Event Hub.

###Specify job output
1.	Click **OUTPUT** from the top of the page, then click **ADD OUTPUT**.
2.	Select **SQL DATABASE**, and then click the right button.
3.	Type or select the following values.  Use the ADO.NET connection string from your database to fill in the following fields:

	- **SQL DATABASE**: Choose the SQL Database you created earlier in the tutorial.  If it is in -the same subscription, select the database from the dropdown menu.   If not, manually enter the Server Name and Database fields. 
	- **USERNAME**: Enter the SQL Database login name.
	- **PASSWORD**: Enter the SQL Database login password.
	- **TABLE**: Specify the table you wish to send output to.  For now, use **PassthroughReadings**.

	![][img.stream.analytics.config.output]

4.	Click the check button to create your output and verify that Stream Analytics can successfully connect to the SQL Database as specified.

###Specify job query
Stream Analytics supports a simple, declarative query model for describing transformations.  To learn more about the language, please see the Azure Stream Analytics Query Language Reference.  

This tutorial will start with a simple pass-through query that outputs device temperature readings to a SQL Database table.

1.	Click **Query** from the top of the page 
2.	Add the following to the code editor:

		SELECT DeviceId, Temperature FROM input
Make sure that the name of the input source matches the name of the input you specified earlier.
3.	Click **SAVE** from the bottom of the page and **YES** to confirm.

##<a name="startJob"></a>Start the job
As a default, Stream Analytics jobs start reading incoming events from the time that the job starts.  Because the Event Hub contains existing data to process, we need to configure the job to consume this historical data.  

1.	Click **DASHBOARD** from the top of the page.
2.	Click **START** from the bottom of the page.
3.	Click **CUSTOM TIME**, and specify a start time.  Make sure that the start time is sometime before the time that you ran BasicEventHubSample.  
3.	Click the check button on the bottom of the dialog. In the **quick glance** pane, the **STATUS** will change to **Starting** and may take a couple of minutes to complete the starting process and move into the **Running** state.   


##<a name="viewJobOutput"></a>View job output

1.	In Visual Studio or SQL Server Management Studio, connect to your SQL Database and run the following query: 

		SELECT * FROM PassthroughReadings

2.	You will see records corresponding to the reading events from the Event Hub.   

	![][img.stream.analytics.job.output1]

	You can rerun the BasicEventHubSample application to generate new events and see them propagate to the output in real time by rerunning the SELECT * query.
	
	If you have any issues with missing or unexpected output, view the Operation Logs for the job, linked on the right pane of the Dashboard page.

##<a name="updateJob"></a>Stop, update, and restart Job
Now let us do a more interesting query over the data.

1.	From the **DASHBOARD** or **MONITOR** page, click **STOP**.
2.	From the **QUERY** page, replace the existing query with the following and then click **SAVE**:

		SELECT DateAdd(second,-5,System.TimeStamp) as WinStartTime, system.TimeStamp as WinEndTime, DeviceId, Avg(Temperature) as AvgTemperature, Count(*) as EventCount 
		FROM input
		GROUP BY TumblingWindow(second, 5), DeviceId

	This new query will use the time that the event was pushed to Event Hub as the timestamp, finding and projecting the average temperature reading every 5 seconds and the number of events that fall within that 5 second window.
3.	From the **OUTPUT** page, click **EDIT**.  Change the output table from PassthroughReadings to AvgReadings and then click the check icon.

4.	From the **DASHBOARD** page, click **START**.

##<a name="viewJobOutput2"></a>View Job output

1.	In Visual Studio or SQL Server Management Studio, connect to the SQL Database and run the following query:

		SELECT * from AvgReadings

2.	You will see records for 5 second intervals showing the average temperature and number of events for each device: 

	![][img.stream.analytics.job.output2]
 
3.	 To continue seeing events processed by the running job, rerun the BasicEventHubSample application.







##<a name="nextsteps"></a>Next steps
In this tutorial, you have learned how to use Stream Analytics to process the weather data. To learn more, see the following articles:


- [Introduction to Azure Stream Analytics][stream.analytics.introduction]
- [Azure Stream Analytics developer guide][stream.analytics.developer.guide]
- [Scale Azure Stream Analytics jobs][stream.analytics.scale]
- [Azure Stream Analytics limitations and known issues][stream.analytics.limitations]
- [Azure Stream Analytics query language reference][stream.analytics.query.language.reference]
- [Azure Stream Analytics management REST API reference][stream.analytics.rest.api.reference]




[img.stream.analytics.event.hub.client.output]: .\media\stream-analytics-get-started\AzureStreamAnalyticsEHClientOuput.png
[img.stream.analytics.event.hub.shared.access.policy.config]: .\media\stream-analytics-get-started\AzureStreamAnalyticsEHSharedAccessPolicyConfig.png
[img.stream.analytics.job.output2]: .\media\stream-analytics-get-started\AzureStreamAnalyticsSQLOutput2.png
[img.stream.analytics.job.output1]: .\media\stream-analytics-get-started\AzureStreamAnalyticsSQLOutput1.png
[img.stream.analytics.config.output]: .\media\stream-analytics-get-started\AzureStreamAnalyticsConfigureOutput.png
[img.stream.analytics.config.input]: .\media\stream-analytics-get-started\AzureStreamAnalyticsConfigureInput.png



[img.get.started.flowchart]: ./media/stream-analytics-get-started/StreamAnalytics.get.started.flowchart.png
[img.job.quick.create]: ./media/stream-analytics-get-started/StreamAnalytics.quick.create.png
[img.stream.analytics.portal.button]: ./media/stream-analytics-get-started/StreamAnalyticsPortalButton.png
[img.event.hub.policy.configure]: ./media/stream-analytics-get-started/StreamAnalytics.Event.Hub.policy.png
[img.create.table]: ./media/stream-analytics-get-started/StreamAnalytics.create.table.png
[img.stream.analytics.job.output]: ./media/stream-analytics-get-started/StreamAnalytics.job.output.png
[img.stream.analytics.operation.logs]: ./media/stream-analytics-get-started/StreamAnalytics.operation.log.png
[img.stream.analytics.operation.log.details]: ./media/stream-analytics-get-started/StreamAnalytics.operation.log.details.png


[azure.sql.database.firewall]: http://msdn.microsoft.com/en-us/library/azure/ee621782.aspx
[azure.event.hubs.documentation]: http://azure.microsoft.com/en-us/services/event-hubs/
[azure.sql.database.documentation]: http://azure.microsoft.com/en-us/services/sql-database/

[sql.database.introduction]: http://azure.microsoft.com/en-us/services/sql-database/
[event.hubs.introduction]: http://azure.microsoft.com/en-us/services/event-hubs/
[azure.blob.storage]: http://azure.microsoft.com/en-us/documentation/services/storage/
[azure.sdk.net]: ../dotnet-sdk/

[stream.analytics.introduction]: ../stream-analytics-introduction/
[stream.analytics.limitations]: ../stream-analytics-limitations/
[stream.analytics.scale]: ../stream-analytics-scale-jobs/
[stream.analytics.query.language.reference]: http://go.microsoft.com/fwlink/?LinkID=513299
[stream.analytics.rest.api.reference]: http://go.microsoft.com/fwlink/?LinkId=517301
[stream.analytics.developer.guide]: ../stream-analytics-developer-guide/
[stream.analytics.documentation]: http://go.microsoft.com/fwlink/?LinkId=512093




[azure.management.portal]: https://manage.windowsazure.com

