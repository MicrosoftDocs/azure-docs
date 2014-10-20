<properties linkid="manage-services-Stream-Analytics-get-started" urlDisplayName="Get Started" pageTitle="Get started using Azure Stream Analytics | Azure" metaKeywords="" description="Get started using Azure Stream Analytics to process and transform events in Azure Service Bus Event Hub and store the results to Azure SQL Database." metaCanonical="" services="Stream Analytics" documentationCenter="" title="Get started with Azure STream Analytics" authors="jgao" solutions="big-data" manager="paulettm" editor="cgronlun" />

<tags ms.service="stream analytics" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/27/2014" ms.author="jgao" />


# Get started using Azure Stream Analytics (preview) 

Azure Stream Analytics is a fully managed service providing low latency, highly available, scalable complex event processing over streaming data in the cloud. For more information, see [Introduction to Azure Stream Analytics][stream.analytics.introduction].

To get you started quickly using Stream Analytics, this tutorial will show you how to process and transform weather data stored in [Azure Service Bus Event Hub][event.hubs.introduction] , and store the results to [Azure SQL Database][sql.database.introduction]. In addition, this tutorial also show you how to send events to Event Hub using the [Azure SDK for .NET][azure.sdk.net]. The following diagram shows the scenario covered in this tutorial:

![Azure Stream Analytics architecture and process diagram][img.get.started.flowchart]
 



>[WACOM.NOTE] For the preview release, Stream Analytics jobs can only be provisioned in the Central US and West Europe regions. For other limitations in this preview release, see [Azure Stream Analytics (preview) limitations and known issues][stream.analytics.limitations].
 

**Prerequisites**

- A workstation with Visual Studio 2013.

## In this tutorial:

- [Prepare input source and output destination that will be used by the job](#prepare)
- [Provision/run the Stream Analytics job](#runjob)
- [Send events to the Event Hub](#sendevents)
- [Check the job output in Azure SQL Database](#checkresults)
- [Troubleshoot the job](#troubleshoot)
- [Next steps](#nextsteps)










##<a name="prepare"></a>Prepare input source and output destination for the Stream Analytics job
The Stream Analytics job will be designed to read events from an Event Hub and write the job output to an Azure SQL Database. Both the Event Hub and the Azure SQL Database are needed before you can configure the input and the output for the Stream Analytics jobs.

### Create Event Hub as input source

Stream Analytics currently supports reading data from [Azure Blob storage][azure.blob.storage] and [Azure Event Hub](http://azure.microsoft.com/en-us/services/event-hubs/).  This tutorial demonstrates reading data from Event Hub. The benefits of using Event Hub include:

- Stream millions of events per second into multiple applications
- Enable applications to process events with variable load profiles
- Connect millions of devices across platforms

For more information about Event Hubs, see [azure.microsoft.com][event.hubs.introduction].

#### Create Azure Service Bus Event Hub 
**To create an Azure Service Bus**

1. Sign in to the [Azure Management Portal][azure.management.portal].
2. Click **NEW**, click **APP SERVICES**, click **SERVICE BUS**, click **EVENT HUB**, and then click **QUICK CREATE**. 
3. Type or enter the following values:

	- **EVENT HUB NAME**: Name your Event Hub. For example, weathereventhub.
	- **REGION**: Select a region that is closer to your location. Please note: only some regions have Event Hub enabled at this time. 
	
		> [WACOM.NOTE] It is recommended to locate the Event Hub or other job inputs in the same region (data center) as the Stream Analytic job for efficiency and reducing cost. Stream Analytics is only available in the Central US and West Europe regions in the preview release.

	- **NAMESPACE NAME**: If you have not had a namespace created for the region, the default namespace name is "[Event Hub Name]-ns". You can use an existing namespace. Make a note of the namepace. You will need it in the next step.
4. Click **CREATE A NEW EVENT HUB**. It takes a few moments to create the Event Hub. When it is ready. the **STATUS** column shows **Active**.

#### Configure access policies for the Event Hub

You must configure shared access policies for the Event Hub before you can access it. In this tutorial, you will need a write policy for the client application to write events into the Event Hub, and a Manage policy for the Stream Analytics job to listen to the Event Hub. To simplify the tutorial, you will create one Manage policy for both writing and reading.

>[WACOM.NOTE] There is a limitation with the preview release, Stream Analytics requires a Shared Access Policy with Manage permissions for Event Hub input and output sources. For details, see [Azure Stream Analytics limitations and known issues][stream.analytics.limitations].

**To configure access policies for the Event Hub**

1. From management portal, click **SERVICE BUS** in the left pane.
2. Click the Service bus namespace that contains the Event Hub.
3. Click **EVENT HUBS** from the top.
4. Click the Event Hub that you will use for your Stream Analytics job.
5. Click **CONFIGURE** on the top of the page. 
6. In the shared access policies section, type the following values to create a new listen policy:

	- **NAME**: Manage
	- **PERMISSIONS**: Manage

7. Click **SAVE** on the bottom of the page. After the configuration is saved, you will see a Shared access key generator section on the bottom of the page. 

	![Azure service bus event hub shared access policies][img.event.hub.policy.configure]

1. Click **DASHBOARD** from the top of the page.
6. Click **CONNECTION INFORMATION** on the bottom of the page.
7. Make a copy of the two connection strings.  Here is a sample:

		Endpoint=sb://xxxxxx-ns.servicebus.windows.net/;SharedAccessKeyName=Manage;SharedAccessKey=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

	You will need the connection string from the console application that will be used to send events to this Event Hub. You may also need the connection string for configuring the Stream Analytics job input. If the Event Hub is under the same Azure subscription as the Stream Analytics job, the Event Hub properties will be populated by the Management portal when you select the Event Hub name. Otherwise, you will need to configure it manually. In addition to the information stored in the connection string, you must also provide the Event Hub name for configuring your Stream Analytics jobs.

8. Click the check sign to close the dialog. 
































###Prepare an Azure SQL Database for storing the output data

Stream Analytics is capable to output data to [Azure SQL Database](http://azure.microsoft.com/en-us/documentation/services/sql-database/), [Azure Blob storage](http://azure.microsoft.com/en-us/documentation/services/storage/), and [Azure Event Hub](http://azure.microsoft.com/en-us/services/event-hubs/). In this tutorial, you will define a job to write the output data to an Azure SQL Database. You can use an existing Azure SQL Database, or create a new one. Once you have a database, you will create the table. 

Later in the tutorial, you will need to specify the Azure SQL Database connection string in the Stream Analytics job definition.

For more information on using Azure Data Database, see [Getting Started with Microsoft Azure SQL Database](http://azure.microsoft.com/en-us/documentation/articles/sql-database-get-started/).
 
####Create Azure SQL Database

**To create a SQL Azure database**

1. Sign in to the [Azure Management Portal][azure.management.portal].
2. Click **NEW**, click **SQL DATABASE**, and then click **QUICK CREATE**.
3. Type or enter the following value:

	- **DATABASE NAME**: Specify a database name. For example, Weather-db.
	- **SERVER**: You can either create a new SQL Database server by selecting **New SQL Database server**, or choose an existing server. If you choose to create a new SQL Database server, you need to specify region, login Name and login password.
4. Click **CREATE SQL DATABASE** to continue. 
5. Wait until the new database appears in the database list, and the status is changed to **Online**.

####Get connection string for the SQL Azure Database 

When you configure the Output for the Stream Analytics job, you will need to specify this SQL Azure Database. If this database is under the same Azure subscription, the Management portal will populate the SQL Azure Database properties after you select the database. Otherwise, you will need to specify all the information manually. The connection string contains most of the information needed.

**To get the connection string** 

1. Click the newly created database from the database list.
2. Click **DASHBOARD** from the top of the page.
3. Click **Show connection strings** on the right.
4. Make a copy of the **ADO.NET** connection string. Here is a sample of it:

		Server=tcp:xxxxxxxxxx.database.windows.net,1433;Database=xxxxx;User ID=xxxx@xxxxxxxxxx;Password={your_password_here};Trusted_Connection=False;Encrypt=True;Connection Timeout=30;
5. Click the cross button to close the dialog box.


### Configure Azure SQL Database firewall

To help protect your data, the Azure SQL Database firewall prevents all access to your Azure SQL Database server until you specify which computers have permission. The firewall grants access based on the originating IP address of each request. For more information, see [Azure SQL Database Firewall][azure.sql.database.firewall].

Before you can connect to the database to create a table, you must configure the firewall to allow your workstation to connect to the database.

You must also enables all Windows Azure Services to connect to SQL databases on this server. So the Stream Analytics service can send data to the database. 

**To configure firewall**

1. From Azure management portal, click **SQL Databased** on the left pane.
2. Allocate the Database where you want to the Stream Analytics job to send output to, and then click the server name in the **SEVER** column.
3. Click **CONFIGURE** from the top.
4. Add the new firewall rule with the following properties:

	- **RULE NAME**: AllowAll
	- **START IP ADDRESS**: 0.0.0.0
	- **END IP ADDRESS**: 255.255.255.255

	> [WACOM.NOTE] Instead of the creating the AllowAll firewall rule, you could also click **ADD TO THE ALLOWED IP ADDRESS**. In some cases, it don't work if your workstation is behind a proxy server.
5. Next to **WINDOWS AZURE SERVICES**, click **YES** to allow all Windows Azure services to connect to the SQL Database.
6. Click **SAVE** on the bottom of the page.
7. Wait 5 minutes for the changes to the firewall settings to take effect. See [Azure SQL Database Firewall][azure.sql.database.firewall].

### Create Azure SQL Database table

There are several options for creating Azure SQL Database table, the following procedure shows you how using SQL Server Object Explorer.

**To create the table**

1. Open Visual Studio 2013.
2. From the **View** menu, click **Server Explorer**.
3. Right-click **Data Connections**, and then click **Add Connection**.
4. In **Add Connection**, enter the following values:

	- **Server name**: Enter the FQDN of the Azure SQL Database server.
	- **Login on to the server**: Select **Use SQL Server Authentication**.
	- **User name**: Enter the Azure SQL Database login.
	- **Password**: Enter the Azure SQL Database login password.
	- **Connect to a database**: Select the Azure SQL Database name. The UI shall popular the drop down list box if the connection information is correct.
5. Click **OK**. You shall see the Azure SQL Database server listed Server Explorer.
6. Right-click the Azure SQL Database server name, and then click **New Query**.
7. In SQLQuery1.sql pane, paste the following query:

		CREATE TABLE [dbo].[Weather] (
		    [id]          BIGINT        IDENTITY (1, 1) NOT NULL,
		    [winStartTime] DATETIME2 (6) NULL,
		    [winEndTime]   DATETIME2 (6) NULL,
		    [avgTemperature] FLOAT (53)    NULL,
			[Count] Int NULL
		);
		Go;
		 
		CREATE CLUSTERED INDEX [IX_Weather_Temperature]
		    ON [dbo].[Weather]([avgTemperature] ASC);
8. Click the **Execute** button. You shall see **Command(s) completed successfully**.
9. Right-click the Azure SQL Database server name, and then click **Refresh**. You shall see the Weather table listed there.
10. Keep Visual Studio opened. You will use it to verify the output after running the Stream Analytics job.













##<a name="runjob"></a> Create and run a Stream Analytic job using the Management portal

After you have created the Azure Service Bus Event Hub, the Azure SQL Database and the table, you are ready to create a Stream Analytics job.


###Provision Stream Analytics job

**To provision a Stream Analytics job**

1. Sign in [Azure management portal][azure.management.portal].
2. Click **NEW**, click **DATA SERVICES**, click **STREAM ANALYTICS**, and then click **QUICK CREATE**.
3. Type or select the following values:

	- **JOB NAME**: Enter a job name. For example, WeatherJob
	- **REGION**: Select the region where you want to run the job. Stream Analytics is only available for some of the regions for the preview release. Consider placing the job and the Event Hub in the same region for better performance and reducing cost.
	- **STORAGE ACCOUNT**: Choose the storage account that you would like to use to store monitoring data for this and other jobs running within this region.  You have the option to choose a existing storage account within the same region, or have the provision process to create a new storage account.

		![create provision an Azure Stream Analytics job][img.job.quick.create]


4. Click **CREATE STREAM ANALYTICS JOB**. Wait until the provision process is completed. When it is completed, the new job is listed on the main pane. The status is **NOT STARTED**. Notice the START button on the bottom of the page is disabled. You must configure the job input, output, query and so on before you can start the job. 

###Configure the job

The minimal requirement is configuring one input, query, and output. 

When you configure the Event Hub input, you can use the Event Hub connection string to help you if the event hub is under a different Azure subscription.

When you configure the Azure SQL Database output, you can use the database connection string to help you if the database is under a different Azure subscription.

Stream Analytics supports a simple, declarative query model for describing transformations. Using Stream Analytics Query Language you can quickly and easily implement temporal functions including temporal based joins, windowed aggregates, temporal filters, as well as other common operations such as joins, aggregates, projections, filters, etc. For more information on writing your own queries, see [Azure Stream Analytics query language reference][stream.analytics.query.language.reference].

**To add a Stream Analytics job input**

1. From the management portal, click **Stream Analytics** in the left pane.

	![Azure Stream Analytic logo icon button][img.stream.analytics.portal.button]
2. In the right pane, click the Stream Analytics job you just created. 
3. Click **INPUTS** from the top of the page.
4. Click **ADD INPUT** from the bottom of the page.  It opens the **Add an input to your job** dialog box.
5. Click **DATA STREAM**, and then click the right button.
6. Click **EVENT HUB**, and then click the right button.
7. Type or select the following values:

	- **INPUT ALIAS**: Give this job input a friendly name. For example, EventHubInput. You will use this alias when you define the job query later in the tutorial. 
	- **SERVICE BUS NAMESPACE**: Select the Event Hub namespace you created earlier. It will populate the rest of the list boxes if the Event Hub is under the same Azure subscription, otherwise, you will need to provide all the information. 
	
		>[WACOM.NOTE] Use the namespace short name. Do not use either the FQDN, nor the sb:// prefix. Otherwise, you will receive the "We couldn't reach 'EventHubInput'. EventHub connection string format is invalid" error.

	- **EVENT HUB NAME**: Select the name of the Event Hub you created earlier. The sample name is weathereventhub.
	- **EVENT HUB POLICY NAME**: When you created the Event Hub, you also created shared access policies on the Event Hub Configure tab. Each shared access policy will have a name, permissions that you set, and access keys. Shared access policies let you grant access permissions using a primary and secondary key. The sample name is ReadFromStreamAnalyticsJob.
	- **EVENT HUB POLICY KEY**: You will not see this field if the Event Hub is under the same subscription. Type the primary or secondary key here. The connection string only contains the primary key.
	- **EVENT HUB PARTITION COUNT**: Use the default value.  For more information, see [Scale Stream Analytics jobs][stream.analytics.scale].
8. Click the right button to continue.
9. Type or select the following values:

	- **EVENT SERIALIZER FORMAT**: CSV
	- **DELIMITeR**: Comma (,)
	- **ENCODING**: UTF8
10. Click the check button to create the Event Hub input.
11. Verify the input has been created successfully, and the **CONNECTION STATUS** is set to **Connected**.

**To add a Stream Analytics job output**

1. Click **OUTPUT** from the top of the page.
2. Click **ADD OUTPUT**.
3. Click **SQL DATABASE**, and then click the right button.
4. Type or select the following values:

	- **AZURE SQL DATABASE:** Choose the Azure SQL Database you created. The Azure SQL Database can be  from another subscription.
	- **SERVER NAME:** Enter the server name or the FQDN name of the Azure SQL Database server. For example,  xxxxxxxxxx.database.windows.net.
	- **DATABASE:** Enter the Azure SQL Database name. 
	- **USERNAME:** Enter the Azure SQL Database login name.
	- **PASSWORD:** Enter the Azure SQL Database login password.
	- **TABLE:** Enter the table you created for the Stream Analytics job output. The default name is **Weather** specified in the T-SQL query.

**To add a query**



1. Click **QUERY** from the top of the page.
2. Replace the code with the following

		SELECT DateAdd(second,-1,System.TimeStamp) as WinStartTime, 
			   system.TimeStamp as WinEndTime, 
			   Avg(temperature) as AvgTemperature, 
			   Count(*) as Count 
		FROM EventHubInput
        GROUP BY TumblingWindow(second, 1)

	EventHubInput is the Input alias for the input you defined earlier in the tutorial.

	The transformation does a temporal query using the time that the event was pushed to Event Hub as the timestamp, finding the average temperature reading each second and the number of events in that 1 second window

	For more information on writing your own queries, see [Azure Stream Analytics query language reference][stream.analytics.query.language.reference].

3. Click **SAVE** from the bottom of the page.
4. Click **YES** to confirm.

**To start the Stream Analytics job**

1. Click **DASHBOARD** from the top of the page.
2. Click **START** on the bottom of the page.
3. Click **YES** to confirm starting the job. Wait until the **STATUS** showing **RUNNING**.



































##<a name="sendevents"></a> Create the Event Hub client application

In this section, you will create a Visual Studio 2013 console application to serve as a client application writing events to the Event Hub.

Before you proceed, you need the following information:

- Event Hub connection string
- Event Hub name (it is referred as EventHubPath in the program)

The data file is csv file shared on an Azure storage account. The storage account information is specified in the program. The source data schema is:

	Timestamp, Temperature, Humidity, Pressue, Visibility, Wind speed, Wind orientation


**To create a new Visual Studio project**

1. Switch to the **Visual Studio 2013** windows if it is not close. Otherwise, open a new Visual Studio 2013 window.
2. From the **FILE** menu, click **New**, and then click **Project**.
3. From the **New Project** dialog, type or select the following values:

	- Template category: Template / Visual C# / Windows
	- Template: Console Application
	- Name: WeatherEHClient
4. Click **OK** to create the project. 
5. From the **TOOLS** menu, click **Library Package Manager**, and then click **Package Manager Console**.
6. In the Package Manager Console on the bottom of the page, run the following commands:

		Install-Package WindowsAzure.Storage
		Install-package WindowsAzure.ServiceBus

9. Add a new class file called **EventHubEventFeeder.cs** (From **Solution Explorer**, right-click **WeatherEHClient**, click **Add**, and then click **Class**).  
10. Replace the code with the following:

		using System;
		using System.Collections.Generic;
		using System.Linq;
		using System.Text;
		using System.Threading;
		using System.Threading.Tasks;
		using Microsoft.ServiceBus;
		using Microsoft.ServiceBus.Messaging;
		
		namespace WeatherEHClient
		{
		    public class EventHubEventFeeder : IDisposable
		    {
		        private readonly List<EventHubSender> senders = new List<EventHubSender>();
		        private readonly List<EventHubClient> eventHubClients = new List<EventHubClient>();
		        private int totalShardCount;
		
		        public EventHubEventFeeder(
		            string eventHubConnectionString,
		            string eventHubName,
		            int shardCount = 0)
		        {
		            NamespaceManager ehNamespaceManager = NamespaceManager.CreateFromConnectionString(eventHubConnectionString);
		
		            EventHubDescription ehDescription = ehNamespaceManager.GetEventHub(eventHubName);
		            string[] partitionIDs = ehDescription.PartitionIds;
		            totalShardCount = ehDescription.PartitionCount;
		
		            for (short i = 0; i < this.totalShardCount; i++)
		            {
		                EventHubClient eventHubClient = EventHubClient.CreateFromConnectionString(eventHubConnectionString, eventHubName);
		                EventHubSender sender = eventHubClient.CreatePartitionedSender(partitionIDs[i]);
		                this.eventHubClients.Add(eventHubClient);
		                this.senders.Add(sender);
		            }
		        }
		
		        public void Send(IEnumerable<EventData> events, bool async = false)
		        {
		            int index = 0;
		            foreach (var e in events)
		            {
		                Send(e, (short)(Interlocked.Increment(ref index) % this.senders.Count), async);
		            }
		        }
		
		        public void Send(EventData e, short shardid, bool async = false)
		        {
		            this.senders[shardid].Send(e);
		        }
		
		        public void Dispose()
		        {
		            Parallel.ForEach(this.senders, sender => sender.Close());
		            senders.Clear();
		
		            foreach (var eventHubClient in this.eventHubClients)
		            {
		                if (eventHubClient != null && !eventHubClient.IsClosed)
		                {
		                    eventHubClient.Close();
		                }
		            }
		
		            this.eventHubClients.Clear();
		        }
		    }
		}


11. From **Solution Explorer**, double-click **Program.cs**.
12. Replace the code with the following:

		using System;
		using System.IO;
		using System.Collections.Generic;
		using System.Linq;
		using System.Text;
		using System.Threading.Tasks;
		using Microsoft.ServiceBus;
		using Microsoft.ServiceBus.Messaging;
		
		using Microsoft.WindowsAzure.Storage;
		using Microsoft.WindowsAzure.Storage.Blob;
		
		namespace WeatherEHClient
		{
		    class Program
		    {
		        // Enter the Event Hub connection string and name 
		        private const string EventHubConnectionString = @"<EventHubConnectionString>";
		        private const string EventHubPath = @"weathereventhub";

		        // The data file is stored in an Azure storage account
		        private const string WeatherSourceDataBlobURL = @"https://azurebigdatatutorials.blob.core.windows.net";
		        private const string WeatherSourceDataBlobContainerName = @"moonweather";
		        private const string WeatherSourceDataBlobName = @"Moon_CopernicusCrater_2000_01_01__00_05.csv";
		
		        private static string[] ColumnNames = new[] { "Timestamp", "Temperature", "Humidity", "Pressure", "Visibility", "Wind Speed", "Wind Orientation" };
		        private const int RowPerCSV = 10;
		
		        static void Main(string[] args)
		        {
		            CsvBuilder csvBuilder = new CsvBuilder(ColumnNames);
		            using (EventHubEventFeeder eventhubFeeder = new EventHubEventFeeder(EventHubConnectionString, EventHubPath))
		            {
		                eventhubFeeder.Send(GetEvents(csvBuilder));
		            }
		
		            Console.WriteLine("Completed sending events. Press ENTER to continue");
		            Console.ReadLine();
		        }
		
		        private static IEnumerable<EventData> GetEvents(CsvBuilder csvBuilder)
		        {
		            int rowCountPerCSV = 1;
		            string weatherLine;
		
		            // Prepare objects for reading the blob
		            MemoryStream memoryStream = new MemoryStream();
		            StreamReader streamReader = new StreamReader(memoryStream);
		
		            // Access the block blob
		            CloudBlobClient cloudBlobClient = new CloudBlobClient(new Uri(WeatherSourceDataBlobURL));
		            CloudBlobContainer cloudBlobContainer = cloudBlobClient.GetContainerReference(WeatherSourceDataBlobContainerName);
		            CloudBlockBlob cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(WeatherSourceDataBlobName);
		            cloudBlockBlob.DownloadToStream(memoryStream);
		
		            memoryStream.Position = 0;
		
		            // skip the first line, the column head
		            weatherLine = streamReader.ReadLine();
		
		            // process the data one line at a time
		            while ((weatherLine = streamReader.ReadLine()) != null)
		            {
		                Console.WriteLine("Processing: {0}", weatherLine);
		                string[] row = weatherLine.Split(',');
		                csvBuilder.AddRow(row);
		                if (rowCountPerCSV++ == RowPerCSV)
		                {
		                    rowCountPerCSV = 1;
		                    string csv = csvBuilder.Build();
		                    csvBuilder.Reset();
		
		                    yield return new EventData(Encoding.ASCII.GetBytes(csv));
		                }
		            }
		        }
		
		        class CsvBuilder
		        {
		            private const string DELIMITER = ",";
		            private StringBuilder stringBuilder;
		            private string[] columnNames;
		
		            public CsvBuilder(string[] columnNames)
		            {
		                this.stringBuilder = new StringBuilder();
		                this.stringBuilder.AppendLine(string.Join(DELIMITER, columnNames));
		                this.columnNames = columnNames;
		            }
		
		            public void AddRow(string[] row)
		            {
		                this.stringBuilder.AppendLine(string.Join(DELIMITER, row));
		            }
		
		            public string Build()
		            {
		                return this.stringBuilder.ToString();
		            }
		
		            public void Reset()
		            {
		                this.stringBuilder.Clear();
		                this.stringBuilder.AppendLine(string.Join(DELIMITER, columnNames));
		            }
		        }
		    }
		
		}
13. Set EventHubConnectionString with your Service Bus Event Hub connection string with the manage permission. 
14. Set EventHubPath with the Event Hub name.

**To run the client application**

- Press **F5** to run the application. 


##<a name="checkresults"></a>Check job output in Azure SQL Database

**To check the results in Azure SQL Database**

1. Switch to the **Visual Studio 2013** windows if it is not close. Otherwise, open a new Visual Studio 2013 window.
2. From the **VIEW** menu, click **Server Explorer**.
3. Expand **Data Connections**.  You shall see the Azure SQL Database server listed there. Otherwise, add a new connection to the server.
4. Right-click the Azure SQL Database server, and then click **New Query**.
5. In the query pane, enter the following query:

		SELECT * from Weather order by id;
6. Click the **Execute** button. You will see some data similar to:

	![Azure Stream Analytics job output in Azure SQL Database][img.stream.analytics.job.output]

##<a name="troubleshoot"></a>Troubleshoot
If a job failed, an easy way to troubleshoot is looking the operation logs.

**To check the operation logs**

1. Sign in [Azure management portal][azure.management.portal].
2. Click **STREAM ANALYTICS** from the left.
3. Click the Stream Analytics job you want to troubleshoot.
4. Click **DASHBOARD** from the top of the page.
5. In **quick glance**, click **Operation Logs**. Filter the log by date and time if you need to
6. Look for the logs with **Failed** in the **STATUS** column.

	![Azure Stream Analytics operation logs][img.stream.analytics.operation.logs]

7. Highlight the log, and then click **DETAILS** from the bottom of the page. The following is a sample error log:

	![Azure Stream Analytics operation log details][img.stream.analytics.operation.log.details]

	The error indicates an output schema issue.	

##<a name="nextsteps"></a>Next steps
In this tutorial, you have learned how to use Stream Analytics to process the weather data. To learn more, see the following articles:


- [Introduction to Azure Stream Analytics][stream.analytics.introduction]
- [Azure Stream Analytics developer guide][stream.analytics.developer.guide]
- [Scale Azure Stream Analytics jobs][stream.analytics.scale]
- [Azure Stream Analytics limitations and known issues][stream.analytics.limitations]
- [Azure Stream Analytics query language reference][stream.analytics.query.language.reference]
- [Azure Stream Analytics REST API reference][stream.analytics.rest.api.reference]








[img.get.started.flowchart]: ./media/stream-analytics-get-started/StreamAnalytics.get.started.flowchart.png
[img.job.quick.create]: ./media/stream-analytics-get-started/StreamAnalytics.quick.create.png
[img.stream.analytics.portal.button]: ./media/stream-analytics-get-started/StreamAnalyticsPortalButton.png
[img.event.hub.policy.configure]: ./media/stream-analytics-get-started/StreamAnalytics.Event.Hub.policy.png
[img.create.table]: ./media/stream-analytics-get-started/StreamAnalytics.create.table.png
[img.stream.analytics.job.output]: ./media/stream-analytics-get-started/StreamAnalytics.job.output.png
[img.stream.analytics.operation.logs]: ./media/stream-analytics-get-started/StreamAnalytics.operation.log.png
[img.stream.analytics.operation.log.details]: ./media/stream-analytics-get-started/StreamAnalytics.operation.log.details.png


[azure.sql.database.firewall]: http://msdn.microsoft.com/en-us/library/azure/ee621782.aspx

[sql.database.introduction]: http://azure.microsoft.com/en-us/services/sql-database/
[event.hubs.introduction]: http://azure.microsoft.com/en-us/services/event-hubs/
[azure.blob.storage]: http://azure.microsoft.com/en-us/documentation/services/storage/
[azure.sdk.net]: ../dotnet-sdk/

[stream.analytics.introduction]: ../stream-analytics-introduction/
[stream.analytics.limitations]: ../stream-analytics-limitations/
[stream.analytics.scale]: ../stream-analytics-scale-jobs/
[stream.analytics.query.language.reference]: http://go.microsoft.com/fwlinks/?LinkID=513299
[stream.analytics.rest.api.reference]: http://go.microsoft.com/fwlink/?LinkId=517301
[stream.analytics.developer.guide]: ../stream-analytics-developer-guide/




[azure.management.portal]: https://manage.windowsazure.com

