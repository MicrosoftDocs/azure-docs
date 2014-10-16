<properties linkid="manage-services-Stream-Analytics-get-started" urlDisplayName="Get Started" pageTitle="Get started using Azure Stream Analytics | Azure" metaKeywords="" description="Get started using Azure Stream Analytics to process and transform events in Azure Service Bus Event Hub and store the results to Azure SQL database." metaCanonical="" services="Stream Analytics" documentationCenter="" title="Get started with Azure STream Analytics" authors="jgao" solutions="big-data" manager="paulettm" editor="cgronlun" />

<tags ms.service="stream analytics" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/27/2014" ms.author="jgao" />


# Get started using Azure Stream Analytics (preview) to process Moon Weather data


**Notes for reviewers:**

- Anywhere there is a <b>***</b> - a question for PMs or a reminder for the writer
- Actual Azure service name and access keys are for the testing purpose.  They will be removed before the article is released.

**Questions for PMs:**

- Azure service bus event hubs has shared access policies defined both on the namespace level and the eventhub level.  When submitting events to the event hub, it seems to me that the namespace level root policy is required.  Can someone confirm?
- Is there an easy way to check/list the events in the event hub?  This is needed for the validation purpose. 
- Arthur Watson's question: "Will free trial customers, or even customers with limited MSDN subscriptions, be able to actually use our public preview service?  Last I knew it required a paid subscription with no billing limit to use any add-on service, even a free one, and we’re going to charge."
- Arthur Watson's comments on firewall: "You might still get a connection error due to up to five minutes firewall rule propagation delay, and might still get a connection error if you’re connecting from a corporate network or ISP that assigns dynamic IP addresses.  For example from my own corpnet account in same IE session, it automatically configured a firewall rule for 131.107.174.202, but when I tried to manage it failed because it thought my IP was 131.107.159.202.  This failure did not go away with either time or retry.

To really do this, you need to go to the Configure page, then click Manage allowed IP addresses under the quick glance links, and put in the IP address from the failure message, or a big range that includes all dynamic addresses you might possibly be assigned.

I hope there’s a best practice about how to do this from the Azure SQL Database team that we can leverage rather than guessing based on personal experience.

One other important note on firewall, while you’re in the configure page you definitely need to enable connection from Windows Azure Services, and I confirmed that if you forget you’ll end up with a not very helpful generic network-related or instance-specific connection failure message.
"

**Article starts here**

To get you started quickly using Azure Stream Analytics, this tutorial will show you how to process and transform Moon weather data stored in Azure Service Bus Event Hub (Azure Event Hub), and store the results to Azure SQL database. In addition, this tutorial also show you how to send events to Azure Event Hub using the .NET SDK. The following diagram shows the scenario covered in this tutorial:

![Azure Stream Analytics architecture and process diagram][img.get.started.flowchart]
 

Azure Stream Analytics is a fully managed service providing low latency, highly available, scalable complex event processing over streaming data in the cloud. For more information, see [Introduction to Azure Stream Analytics][stream.analytics.introduction].

>[WACOM.NOTE] For the preview release, Stream Analytics jobs can only be provisioned in the Central US and West Europe regions. For other limitations in this preview release, see [Limitations and known issues in the Azure Stream Analytics preview release][stream.analytics.limitations].
 
**Prerequisites** 

- **A Microsoft Azure subscription**.  For more information about obtaining a subscription, see Purchase Options, Member Offers, or Free Trial.
- **A workstation with Visual Studio 2013**. The Visual Studio will be used to develop a client application for sending events to Azure Event Hub.















## In this tutorial:

- [Prepare input source and output destination that will be used by the job](#prepare)
- [Provision/run the Stream Analytics job](#runjob)
- [Send events to the Event Hub](#sendevents)
- [Check the job output in Azure SQL database](#checkresults)
- [Next steps](#nextsteps)










##<a name="prepare"></a>Prepare input source and output destination for the Stream Analytics job
The Stream Analytics job will be designed to read events from an Azure Event Hub and write the job output to an Azure SQL database. Both the event hub and the Azure SQL database are needed before you can configure the input and the output for the Stream Analytics jobs.

### Create an Azure Event Hub as input source

Azure Stream Analytics currently supports reading data from [Azure Blob storage](http://azure.microsoft.com/en-us/documentation/services/storage/) and [Azure Event Hub](http://azure.microsoft.com/en-us/services/event-hubs/).  This tutorial demonstrates reading data from Azure Event Hub. The benefits of using Event Hub include:

- Stream millions of events per second into multiple applications
- Enable applications to process events with variable load profiles
- Connect millions of devices across platforms

For more information about Azure Event Hubs, see [azure.microsoft.com][event.hubs.introduction].

#### Create an Azure Service Bus Event Hub 
**To create an Azure Service Bus**

1. Sign in to the [Azure Management Portal][azure-management-portal].
2. Click **NEW**, click **APP SERVICES**, click **SERVICE BUS**, click **EVENT HUB**, and then click **QUICK CREATE**. 
3. Type or enter the following values:

	- EVENT HUB NAME: Name your Event Hub. For example, moonweathereventhub.
	- REGION: Select a region that is closer to your location. Please note: only some regions have Event Hub enabled at this time. 
	
		> [WACOM.NOTE] It is recommended to locate the Event Hub or other job inputs in the same region (data center) as the Stream Analytic job for efficiency and reducing cost. Azure Stream Analytics is only available in the Central US and West Europe regions in the preview release.

	- NAMESPACE NAME: If you have not had a namespace created for the region, the default namespace name is "[Event Hub Name]-ns". You can use an existing namespace. Make a note of the namepace. You will need it in the next step.
4. Click **CREATE A NEW EVENT HUB**. It takes a few moment to create the event hub. When it is ready. the **STATUS** column shows **Active**.

#### Configure access policies for the event hub

*** (use the namespace level access permission instead?)

You must configure shared access policies for the Event Hub before you can access it. In this tutorial, you will need a write policy for the client application to write events into the Event Hub, and a Manage policy for the Stream Analytics job to listen to the Event Hub.

>[WACOM.NOTE] *** talk about the limitation of using the manage access permission instead of listen

*** what is the difference with using the ns access policy and event hub access policy? It seems ns access policy is required for sending events to event hub

*** is "manage" the minimum permission for a Stream Analytics job? 

**To configure access policies for the Event Hub**

1. From management portal, click **SERVICE BUS** in the left pane.
2. Click the Service bus namespace that contains the Event Hub.
3. Click **EVENT HUBS** from the top.
4. Click the Event Hub that you will use for your Stream Analytics job.
5. Click **CONFIGURE** on the top of the page. 
6. In the shared access policies section, type the following values to create a new listen policy:

	- **NAME**: Write
	- **PERMISSIONS**: Send

7. Click **SAVE** on the bottom of the page. After the configuration is saved, you will see a Shared access key generator section on the bottom of the page. 
8. Repeat steps 6 and 7 to create another write policy with the following values:

	- **NAME**: ReadFromStreamAnalyticsJob
	- **PERMISSIONS**: Manage

	![Azure service bus event hub shared access policies][img.event.hub.policy.configure]


























#### Get the connection information for the event hub

*** (use the namespace level access permission instead?)

You will need the connections string from both the Stream Analytics job configuration and the console application.

**To get the connection information**

1. Click **DASHBOARD** from the top of the page.
6. Click **CONNECTION INFORMATION** on the bottom of the page.
7. Make a copy of the two connection strings.  Here is a sample:

		Endpoint=sb://xxxxxx-ns.servicebus.windows.net/;SharedAccessKeyName=ReadFromStreamAnalyticsJob;SharedAccessKey=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

	The ReadFromStreamAnalyticsJob policy connection string will be used to configure the Stream Analytics job. In addition to the information stored in the connection string, you must also provide the Event Hub name for configuring your Stream Analytics jobs.

	The Write policy connection string will be used in the client application that sends events to the event hub.

8. Click the check sign to close the dialog. 











###Prepare an Azure SQL Database for storing the output data

Azure Stream Analytics is capable to output data to [Azure SQL Database](http://azure.microsoft.com/en-us/documentation/services/sql-database/), [Azure Blob storage](http://azure.microsoft.com/en-us/documentation/services/storage/), and [Azure Event Hub](http://azure.microsoft.com/en-us/services/event-hubs/). In this tutorial, you will define a job to write the output data to an Azure SQL Database. You can use an existing Azure SQL Database, or create a new one. Once you have a database, you will create the table schema. 

Later in the tutorial, you will need to specify the Azure SQL database connection string in the Stream Analytics job definition.

For more information on using Azure Data Database, see [Getting Started with Microsoft Azure SQL Database](http://azure.microsoft.com/en-us/documentation/articles/sql-database-get-started/).
 

**To create a SQL Azure database**

1. Sign in to the [Azure Management Portal][azure-management-portal].
2. Click **NEW**, click **SQL DATABASE**, and then click **QUICK CREATE**.
3. Type or enter the following value:

	- **DATABASE NAME**: Specify a database name. For example, MoonWeather-db.
	- **SERVER**: You can either create a new SQL Database server by selecting **New SQL database server**, or choose an existing server. If you choose to create a new SQL database server, you need to specify region, login Name and login password.
4. Click **CREATE SQL DATABASE** to continue. 
5. Wait until the new database appears in the database list, and the status is changed to **Online**.

**To get the connection string** (*** this is not needed using the portal to create a NRT job)

1. Click the newly created database from the database list.
2. Click **DASHBOARD** from the top of the page.
3. Click **Show connection strings** on the right.
4. Make a note of the **ADO.NET** connection string. You will need it later in the tutorial. Notice the password is **{your_password_here}**. Make sure to replace it with the actual Azure SQL Database password. Here is a sample connection string:  *** update the connection string sample.

		Server=tcp:n4q67nhxru.database.windows.net,1433;Database=hdiv3;User ID=jgao@n4q67nhxru;Password={your_password_here};Trusted_Connection=False;Encrypt=True;Connection Timeout=30;
5. Click the cross button to close the dialog box.


**To create the table schema**

1. From the management portal, click **SQL Databases** from the left pane,
2. Click the database you created for this project.
3. Click **MANAGE** from the bottom of the page.
4. If you get a firewall prompt, click **YES** to update the firewall rules, and then click **Yes** again to manage the database.
5. Enter your SQL Database **USERNAME** and **PASSWORD**, and then click **Log on**.
6. Click **New Query** from the top of the page.
7. Copy and paste the following script into the query pane

		CREATE TABLE [dbo].[Weather] (
		    [id]          BIGINT        IDENTITY (1, 1) NOT NULL,
		    [insert_time] DATETIME2 (6) NULL,
		    [timestamp]   DATETIME2 (6) NULL,
		    [temperature] FLOAT (53)    NULL
		);
		 
		CREATE CLUSTERED INDEX [IX_Weather_Temperature]
		    ON [dbo].[Weather]([Temperature] ASC);

8. Click **Run**. Verify the commands were completed successfully.


*** check firewall


















##<a name="runjob"></a> Create and run a Stream Analytic job using the Management portal

After you have created the Azure Service Bus Event Hub, the Azure SQL database and the table schema, you are ready to create a Stream Analytics job.


**To provision a Stream Analytics job**

1. Sign in [Azure management portal][azure.portal].
2. Click **NEW**, click **DATA SERVICES**, click **STREAM ANALYTICS**, and then click **QUICK CREATE**.
3. Type or select the following values:

	- **JOB NAME**: Enter a job name. For example, MoonWeatherJob
	- **REGION**: Select the region where you want to run the job. Azure Stream Analytics is only available for some of the regions for the preview release. Consider place the job and the event hub in the same region for better performance and reducing cost.
	- **STORAGE ACCOUNT**: Choose the storage account that you would like to use to store monitoring data for this and any jobs running within this region.  You have the option to choose a storage account within the same region, or have the provision process to create a new storage account within the same region.

		![create provision an Azure Stream Analytics job][img.job.quick.create]

4. Click **CREATE STREAM ANALYTICS JOB**. Wait until the provision process is completed. When it is completed, the new job is listed on the main pane. The status is **NOT STARTED**. Notice the START button on the bottom of the page is disabled. You must configure the job input, output, query and so on before you can start the job. 

**To add a Stream Analytics job input**

1. From the management portal, click **Stream Analytics** in the left pane.

	![Azure Stream Analytic logo icon button][img.stream.analytics.portal.button]
2. In the right pane, click the Stream Analytics job you just created. 
3. Click **INPUTS** from the top of the page.
4. Click **ADD INPUT**. There are two places. Either one works. It opens the **Add an input to your job** dialog box.
5. Click **DATA STREAM**, and then click the right button.
6. Click **EVENT HUB**, and then click the right button.
7. Type or select the following values. Use the information in the Event Hub ReadFromStreamAnalyticsJob policy connection string for some of the fields.
	> 
	- **INPUT ALIAS**: Enter the name of this job input. For example, EventHubInput.
	- **EVENT HUB**: Choose the Azure Event Hub you created earlier. If the event hub is  from another Azure subscription, you must specify additional properties including **Event Hub policy key**.
	- **SERVICE BUS NAMESPACE**: Select the Azure Event Hub namespace you created earlier. It will populate the rest of the list boxes. ***test FQDN and with a / at the end of the FQDN. 
	- **EVENT HUB NAME**: Select the name of the Azure Event Hub you created earlier. The sample name is moonweathereventhub.
	- **EVENT HUB POLICY NAME**: When you created the Event Hub, you also created shared access policies on the Event Hub Configure tab. Each shared access policy will have a name, permissions that you set, and access keys. Shared access policies let you grant access permissions using a primary and secondary key. The sample name is ReadFromStreamAnalyticsJob.
	- **EVENT HUB POLICY KEY**: Type the primary or secondary key here. The connection string only has the primary key.
	- **EVENT HUB PARTITION COUNT**: Use the default value.  For more information, see [Scale Stream Analytics jobs][stream.analytics.scale].
8. Click the right button to continue.
9. Type or select the following values:

	- **EVENT SERIALIZER FORMAT**: JSON
	- **ENCODING**: UTF8
10. Click the check button to create the Event Hub input.
11. Verify the input has been created successfully, and the **CONNECTION STATUS** is set to **Connected**.

**To add a Stream Analytics job output**

1. Click **OUTPUT** from the top of the page.
2. Click **ADD OUTPUT**.
3. Click **SQL DATABASE**, and then click the right button.
4. Type or select the following values:

	- **OUTPUT ALIAS:** SQLDatabaseOutput
	- **AZURE SQL DATABASE:** Choose the Azure SQL database you created. The Azure SQL database can be  from another subscription
	- **SERVER NAME:** Enter the FQDN name of the Azure SQL database. For example,  w6g4vic5x0.database.windows.net.
	- **DATABASE:** Enter the database name. jgaomoonweatherdb
	- **USER:** Enter the Azure SQL database login name.
	- **PASSWORD:** Enter the Azure SQL database login password.
	- **TABLE:** Enter the table you created for the Stream Analytics job output. The default name is weather specified in the T-SQL is weather.

Stream Analytics supports a simple, declarative query model for describing transformations. Using Stream Analytics Query Language you can quickly and easily implement temporal functions including temporal based joins, windowed aggregates, temporal filters, as well as other common operations such as joins, aggregates, projections, filters, etc.  

**To add a query**

1. Click **QUERY** from the top of the page.
2. Replace the code with the following

		SELECT Timestamp,Temperature FROM EventHubInput

	For more information on writting your own queries/code, see the Stream Analytics reference document. *** need fwlink

3. Click **SAVE** from the bottom of the page.
4. Click **YES** to confirm.

**To start the Stream Analytics job**

1. Click the back key to go back to the job page
2. Click **START** on the bottom of the page.
3. Click **YES** to confirm starting the job. Wait until the **STATUS** showing **RUNNING**.



































##<a name="sendevents"></a> Create the Event Hub client application

In this section, you will create a Visual Studio 2013 console application to serve as a client application writing events to the Azure Event Hub.

Before you proceed, you need the following information:

- Event Hub connection string
- Event Hub name (it is referred as EventHubPath in the program)

The data file is csv file shared on an Azure storage account. The storage account information is specified in the program. The source data schema is:

	Timestamp, Temperature, Humidity, Pressue, Visibility, Wind speed, Wind orientation


**To create a new Visual Studio project**

1. Open **Visual Studio 2013**.
2. From the **FILE** menu, click **New**, and then click **Project**.
3. From the **New Project** dialog, type or select the following values:

	- Template category: Template / Visual C# / Windows Desktop
	- Template: Console Application
	- Name: MoonWeatherEHClient
	- Location: C:\Tutorials\MoonWeather
4. Click **OK** to create the project. 
5. From the **TOOLS** menu, click **Nuget Package Manager**, and then click **Package Manager Console**.
6. In the Package Manager Console on the bottom of the page, run the following commands:

		Install-package WindowsAzure.ServiceBus
		Install-Package EnterpriseLibrary.WindowsAzure.TransientFaultHandling
7. Add a new class file called **EventHubHelper.cs** (From **Solution Explorer**, right-click **MoonWeatherEHClient**, click **Add**, and then click **Class**).  
8. Replace the code with the following:

		using System;
		using System.Linq;
		using System.Threading.Tasks;
		using Microsoft.Practices.TransientFaultHandling;
		using Microsoft.ServiceBus;
		using Microsoft.ServiceBus.Messaging;
		using RetryPolicy = Microsoft.Practices.TransientFaultHandling.RetryPolicy;
		
		namespace MoonWeatherEHClient
		{
		    public static class EventHubHelper
		    {
		        private static readonly RetryPolicy RetryPolicy = new RetryPolicy(
		            new EventHubTransientErrorDetectionStrategy(),
		            new ExponentialBackoff(
		                "EventHubInputAdapter",
		                5,
		                TimeSpan.FromMilliseconds(100),
		                TimeSpan.FromSeconds(5),
		                TimeSpan.FromMilliseconds(500),
		                true));
		
		        public static Task ExecuteAsync(Func<Task> taskFunc)
		        {
		            return RetryPolicy.ExecuteAsync(taskFunc);
		        }
		
		        public static Task<TResult> ExecuteAsync<TResult>(Func<Task<TResult>> taskFunc)
		        {
		            return RetryPolicy.ExecuteAsync(taskFunc);
		        }
		
		        /// <summary>
		        /// Create an EventHub path in a given eventhub namespace
		        /// </summary>
		        /// <param name="eventHubConnectionString">The connection string used to access the EventHub namespace</param>
		        /// <param name="eventHubPath">the name of the EventHub path</param>
		        /// <param name="shardCount">the shardCount of the EventHub</param>
		        public static void CreateEventHubIfNotExists(string eventHubConnectionString, string eventHubPath, int shardCount = 0)
		        {
		            NamespaceManager namespaceManager = NamespaceManager.CreateFromConnectionString(eventHubConnectionString);
		            EventHubDescription evenhubDesc = new EventHubDescription(eventHubPath);
		
		            if (shardCount > 0)
		            {
		                evenhubDesc.PartitionCount = shardCount;
		            }
		
		            Console.WriteLine("Creating EventHubPath '{0}' in EventHub with connection string '{1}'", eventHubPath, eventHubConnectionString);
		            RetryPolicy.ExecuteAsync(() => namespaceManager.CreateEventHubIfNotExistsAsync(evenhubDesc)).Wait();
		        }
		
		        private class EventHubTransientErrorDetectionStrategy : ITransientErrorDetectionStrategy
		        {
		            public bool IsTransient(Exception ex)
		            {
		                var messagingException = ex as MessagingException;
		                if ((messagingException != null && messagingException.IsTransient) || ex is TimeoutException)
		                {
		                    Console.WriteLine(ex);
		                    return true;
		                }
		
		                Console.WriteLine(ex);
		                return false;
		            }
		        }
		    }
		}


9. Add a new class file called **EventHubFeeder.cs** (From **Solution Explorer**, right-click **MoonWeatherEHClient**, click **Add**, and then click **Class**).  
10. Replace the code with the following:

		using System;
		using System.Collections.Generic;
		using System.Linq;
		using System.Text;
		using System.Threading;
		using System.Threading.Tasks;
		using Microsoft.ServiceBus;
		using Microsoft.ServiceBus.Messaging;
		
		namespace MoonWeatherEHClient
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
		            NamespaceManager namespaceManager = NamespaceManager.CreateFromConnectionString(eventHubConnectionString);
		            this.totalShardCount = shardCount == 0
		                ? EventHubHelper.ExecuteAsync(() => namespaceManager.GetEventHubAsync(eventHubName))
		                    .Result.PartitionCount
		                : shardCount;
		            var partitionIDs = namespaceManager.GetEventHubAsync(eventHubName).Result.PartitionIds;
		
		            for (short i = 0; i < this.totalShardCount; i++)
		            {
		                var eventHubClient = EventHubClient.CreateFromConnectionString(eventHubConnectionString, eventHubName);
		                var sender = EventHubHelper.ExecuteAsync(() => eventHubClient.CreatePartitionedSenderAsync(partitionIDs[i])).Result;
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
		
		        public int SendBatches(IEnumerable<EventData> events, int batchSize = 100)
		        {
		            var eventCount = events.Count();
		            var eventsEnumerator = events.GetEnumerator();
		            var shardTasks = new List<Task>(Enumerable.Range(0, this.senders.Count).Select(_ => Task.Delay(0)));
		            var sendTasks = new List<Task>(batchSize);
		            short shardId = 0;
		            var currBatch = 0;
		            int i;
		            for (i = 0; i < eventCount; i++)
		            {
		                if (eventsEnumerator.MoveNext())
		                {
		                    sendTasks.Add(
		                        EventHubHelper.ExecuteAsync(
		                            () => this.senders[shardId].SendAsync(eventsEnumerator.Current)));
		                    currBatch++;
		                    if (currBatch == batchSize || i == eventCount - 1)
		                    {
		                        currBatch = 0;
		                        shardTasks[shardId] = Task.WhenAll(sendTasks);
		                        sendTasks = new List<Task>(batchSize);
		                        shardId = (short)Task.WaitAny(shardTasks.ToArray());
		                    }
		                }
		                else
		                {
		                    break;
		                }
		            }
		
		            Task.WaitAll(shardTasks.ToArray());
		            return i;
		        }
		
		        public void Send(EventData e, short shardid, bool async = false)
		        {
		            var result = EventHubHelper.ExecuteAsync(() => this.senders[shardid].SendAsync(e));
		            if (!async)
		            {
		                result.Wait();
		            }
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
using Microsoft.ServiceBus.Messaging;

using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

namespace MoonWeatherEHClient
{
    class Program
    {
        // Enter the Azure Event Hub connection string and name
        private const string EventHubConnectionString = @"Endpoint=sb://i0thub-ns.servicebus.windows.net/;SharedAccessKeyName=Manage;SharedAccessKey=XuqbAJh94y4SpSIS9s7L5H07+AheUHvDhlucTccyMtQ=";
        private const string EventHubPath = @"moonweathereventhub";

        // The data file is stored in an Azure storage account
        private const string MoonWeatherSourceDataBlobURL = @"https://azurebigdatatutorials.blob.core.windows.net";
        private const string MoonWeatherSourceDataBlobContainerName = @"moonweather";
        private const string MoonWeatherSourceDataBlobName = @"Moon_CopernicusCrater_2000_01_01__00_05.csv";

        private static string[] ColumnNames = new[] { "Timestamp", "Temperature", "Humidity", "Pressure", "Visibility", "Wind Speed", "Wind Orientation" };
        private const int RowPerCSV = 10;

        static void Main(string[] args)
        {
            // Enable the following code section if you want to create a new Event Hub
            //logger.Write("Creating eventhub if not exist...");
            //EventHubHelper.CreateEventHubIfNotExists(EventHubConnectionString, EventHubPath);
            //EventHubHelper.GetEventHub(EventHubConnectionString, EventHubPath);
            
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
            CloudBlobClient cloudBlobClient = new CloudBlobClient(new Uri(MoonWeatherSourceDataBlobURL));     
            CloudBlobContainer cloudBlobContainer = cloudBlobClient.GetContainerReference(MoonWeatherSourceDataBlobContainerName);
            CloudBlockBlob cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(MoonWeatherSourceDataBlobName);
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

13. Set EventHubConnectionString with your namespace connection string. 
14. Set EventHubPath with the Azure Event Hub name.

**To run the client application**

- Press F5 to run the application. 


##<a name="checkresults"></a>Check job output in Azure SQL database

**To check the results in Azure SQL database**

1. Sign in [Azure management portal][azure.portal].
2. In the left menu, click **SQL DATABASES**.
3. In the right pane, click the database you configured to store the Stream Analytics job results.
4. Click **MANAGE** on the bottom of the page.
5. Enter your credentials.
6. In the management portal for SQL Database,click **New Query**.
7. In the query pane, enter the following SQL statement:

	SELECT * FROM weather
8. Click **Run** from the top of the page. You shall see 300 records for each time you run the client application.


##<a name="nextsteps"></a>Next steps
In this tutorial, you have learned how to use Stream Analytics to process the Moon weather data. To learn more, see the following articles:








[img.get.started.flowchart]: ./media/stream-analytics-get-started/StreamAnalytics.get.started.flowchart.png
[img.job.quick.create]: ./media/stream-analytics-get-started/StreamAnalytics.quick.create.png
[img.stream.analytics.portal.button]: ./media/stream-analytics-get-started/StreamAnalyticsPortalButton.png
[img.event.hub.policy.configure]: ./media/stream-analytics-get-started/StreamAnalytics.Event.Hub.policy.png





[event.hubs.introduction]: http://azure.microsoft.com/en-us/services/event-hubs/
[stream.analytics.introduction]: ../stream-analytics-introduction/
[stream.analytics.limitations]: ../stream-analytics-limitations/
[stream.analytics.scale]: ../stream-analytics-scale-jobs/



[azure.portal]: https://manage.windowsazure.com

