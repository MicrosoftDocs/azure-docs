## Receive messages with EventProcessorHost

[EventProcessorHost] is a .NET class that simplifies receiving events from Event Hubs by managing persistent checkpoints and parallel receives from those Event Hubs. Using [EventProcessorHost], you can split events across multiple receivers, even when hosted in different nodes. This example shows how to use [EventProcessorHost] for a single receiver. The [Scaled out event processing sample] shows how to use [EventProcessorHost] with multiple receivers.

In order to use [EventProcessorHost], you must have an [Azure Storage account]:

1. Log on to the [Azure Management Portal], and click **NEW** at the bottom of the screen.

2. Click **Data Services**, then **Storage**, then **Quick Create**, and then type a name for your storage account. Select your desired region, and then click **Create Storage Account**.

   	![][11]

3. Click the newly created storage account, and then click **Manage Access Keys**:

   	![][12]

	Copy the access key to use later in this tutorial.

4. In Visual Studio, create a new Visual C# Desktop App project using the **Console  Application** project template. Name the project **Receiver**.

   	![][14]

5. In Solution Explorer, right-click the solution, and then click **Manage NuGet Packages**.

	The **Manage NuGet Packages** dialog box appears.

6. Search for `Microsoft Azure Service Bus Event Hub - EventProcessorHost`, click **Install**, and accept the terms of use.

	![][13]

	This downloads, installs, and adds a reference to the <a href="https://www.nuget.org/packages/Microsoft.Azure.ServiceBus.EventProcessorHost">Azure Service Bus Event Hub - EventProcessorHost NuGet package</a>, with all its dependencies.

7. Right-click the **Receiver** project, click **Add**, and then click **Class**. Name the new class **SimpleEventProcessor**, and then click **OK** to create the class. 

8. Add the following statements at the top of the SimpleEventProcessor.cs file:

		using Microsoft.ServiceBus.Messaging;
		using System.Diagnostics;
		using System.Threading.Tasks;

	Then, substitute the following code for the body of the class:

		class SimpleEventProcessor : IEventProcessor
	    {
	        Stopwatch checkpointStopWatch;

	        async Task IEventProcessor.CloseAsync(PartitionContext context, CloseReason reason)
	        {
	            Console.WriteLine("Processor Shutting Down. Partition '{0}', Reason: '{1}'.", context.Lease.PartitionId, reason);
	            if (reason == CloseReason.Shutdown)
	            {
	                await context.CheckpointAsync();
	            }
	        }

	        Task IEventProcessor.OpenAsync(PartitionContext context)
	        {
	            Console.WriteLine("SimpleEventProcessor initialized.  Partition: '{0}', Offset: '{1}'", context.Lease.PartitionId, context.Lease.Offset);
	            this.checkpointStopWatch = new Stopwatch();
	            this.checkpointStopWatch.Start();
	            return Task.FromResult<object>(null);
	        }

	        async Task IEventProcessor.ProcessEventsAsync(PartitionContext context, IEnumerable<EventData> messages)
	        {
	            foreach (EventData eventData in messages)
	            {
	                string data = Encoding.UTF8.GetString(eventData.GetBytes());

	                Console.WriteLine(string.Format("Message received.  Partition: '{0}', Data: '{1}'",
	                    context.Lease.PartitionId, data));
	            }

	            //Call checkpoint every 5 minutes, so that worker can resume processing from the 5 minutes back if it restarts.
	            if (this.checkpointStopWatch.Elapsed > TimeSpan.FromMinutes(5))
                {
                    await context.CheckpointAsync();
                    this.checkpointStopWatch.Restart();
                }
	        }
	    }

	This class will be called by the **EventProcessorHost** to process events received from the Event Hub. Note that the `SimpleEventProcessor` class uses a stopwatch to periodically call the checkpoint method on the **EventProcessorHost** context. This ensures that, if the receiver is restarted, it will lose no more than five minutes of processing work.

9. Since this program uses asynchronous methods, it requires a synchronization context to behave properly.  By default, console applications
   do not have a synchronous context, so we'll need to provide one.   We can use the `AsyncPump` class from 
   [this blog post][Async Await in Console Apps], which you can download directly [here][AsyncPump.cs].

   Add the `AsyncPump.cs` file to your project.

10. In the **Program** class, add the following `using` statements at the top:

		using Microsoft.ServiceBus.Messaging;
		using Microsoft.Threading;
		using System.Threading.Tasks;

	Then, add the following method to the **Program** class, substituting the Event Hub name and connection string, and the storage account and key that you copied in the previous sections:

		static async Task MainAsync()
		{
		    string eventHubConnectionString = "{event hub connection string}";
		    string eventHubName = "{event hub name}";
		    string storageAccountName = "{storage account name}";
		    string storageAccountKey = "{storage account key}";
		    string storageConnectionString = string.Format("DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1}",
		        storageAccountName, storageAccountKey);
		
		    string eventProcessorHostName = Guid.NewGuid().ToString();
		    EventProcessorHost eventProcessorHost = new EventProcessorHost(eventProcessorHostName, eventHubName, EventHubConsumerGroup.DefaultGroupName, eventHubConnectionString, storageConnectionString);
		    await eventProcessorHost.RegisterEventProcessorAsync<SimpleEventProcessor>();
		
		    Console.WriteLine("Receiving. Press enter key to stop worker.");
		    Console.ReadLine();
		}

    Then, add the following code in the **Main** method:

		AsyncPump.Run(MainAsync);

> [AZURE.NOTE] This tutorial uses a single instance of [EventProcessorHost]. To increase throughput, it is recommended that you run multiple instances of [EventProcessorHost], as shown in the [Scaled out event processing] sample. In those cases, the various instances  automatically coordinate with each other in order to load balance the received events. If you want multiple receivers to each process *all* the events, you must use the **ConsumerGroup** concept. When receiving events from different machines, it might be useful to specify names for [EventProcessorHost] instances based on the machines (or roles) in which they are deployed. For more information about these topics, refer to the [Event Hubs Overview] and [Event Hubs Programming Guide] topics.

<!-- Links -->
[Event Hubs Overview]: http://msdn.microsoft.com/library/azure/dn836025.aspx
[Scaled out event processing]: https://code.msdn.microsoft.com/windowsazure/Service-Bus-Event-Hub-45f43fc3
[Azure Storage account]: http://azure.microsoft.com/documentation/articles/storage-create-storage-account/
[EventProcessorHost]: http://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventprocessorhost(v=azure.95).aspx
[Azure Management Portal]: http://manage.windowsazure.com

<!-- Images -->

[11]: ./media/service-bus-event-hubs-getstarted/create-eph-csharp2.png
[12]: ./media/service-bus-event-hubs-getstarted/create-eph-csharp3.png
[13]: ./media/service-bus-event-hubs-getstarted/create-eph-csharp1.png
[14]: ./media/service-bus-event-hubs-getstarted/create-sender-csharp1.png

[Event Hubs Programming Guide]: http://msdn.microsoft.com/library/azure/dn789972.aspx
[Async Await in Console Apps]: http://blogs.msdn.com/b/pfxteam/archive/2012/01/20/10259049.aspx
[AsyncPump.cs]: http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-components-postattachments/00-10-25-90-49/AsyncPump_2E00_cs