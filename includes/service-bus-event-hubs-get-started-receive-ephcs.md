## Receive messages with EventProcessorHost

**EventProcessorHost** is a .NET class that simplifies receiving events from Event Hubs by managing persistent checkpoints and parallel receives from Event Hubs. Using **EventProcessorHost**, you can split events across multiple receivers, even when hosted in different nodes. This example shows how to use **EventProcessorHost** for a single receiver. The [Scaled out event processing sample] shows how to use **EventProcessorHost** with multiple receivers.

For more information about Event Hubs receive patterns, see the [Event Hubs developer guide].

In order to use **EventProcessorHost** you need to have an [Azure Storage account]:

1. Log on to the [Azure Management Portal], and click **NEW** at the bottom of the screen.

2. Click on **Data Services**, then **Storage**, then **Quick Create**, then type a name for your storage account, select your desired Region, and then click **Create Storage Account**.

   	![][11]

3. Click your newly created storage account, then click **Manage Access Keys**:

   	![][12]

	Copy your access key for later use.

4. In Visual Studio, create a new Visual C# Desktop App project using the **Console  Application** template. We will call it **Receiver**.

   	![][14]

5. In the Solution Explorer, right-click the solution, then click **Manage NuGet Packages**. 

	This displays the Manage NuGet Packages dialog box.

6. Search for `Microsoft Azure Service Bus Event Hub - EventProcessorHost` and click **Install**, and accept the terms of use. 

	![][13]

	This downloads, installs, and adds a reference <a href="https://www.nuget.org/packages/Microsoft.Azure.ServiceBus.EventProcessorHost">Azure Service Bus Event Hub - EventProcessorHost NuGet package</a>, with all its dependencies.

7. Create a new class called **SimpleEventProcessor**, add the following statements at the top:

		using Microsoft.ServiceBus.Messaging;
		using System.Diagnostics;
		using System.Threading.Tasks;

	Then, insert the following as the body of the class:

		class SimpleEventProcessor : IEventProcessor
	    {
	        Stopwatch checkpointStopWatch;
	        
	        async Task CloseAsync(PartitionContext context, CloseReason reason)
	        {
	            Console.WriteLine(string.Format("Processor Shuting Down.  Partition '{0}', Reason: '{1}'.", context.Lease.PartitionId, reason.ToString()));
	            if (reason == CloseReason.Shutdown)
	            {
	                await context.CheckpointAsync();
	            }
	        }
	
	        Task OpenAsync(PartitionContext context)
	        {
	            Console.WriteLine(string.Format("SimpleEventProcessor initialize.  Partition: '{0}', Offset: '{1}'", context.Lease.PartitionId, context.Lease.Offset));
	            this.checkpointStopWatch = new Stopwatch();
	            this.checkpointStopWatch.Start();
	            return Task.FromResult<object>(null);
	        }
	
	        async Task ProcessEventsAsync(PartitionContext context, IEnumerable<EventData> messages)
	        {
	            foreach (EventData eventData in messages)
	            {
	                string data = Encoding.UTF8.GetString(eventData.GetBytes());
	                
	                Console.WriteLine(string.Format("Message received.  Partition: '{0}', Data: '{2}'",
	                    context.Lease.PartitionId, data));
	            }
	
	            //Call checkpoint every 5 minutes, so that worker can resume processing from the 5 minutes back if it restarts.
	            if (this.checkpointStopWatch.Elapsed > TimeSpan.FromMinutes(5))
	            {
	                await context.CheckpointAsync();
	                lock (this)
	                {
	                    this.checkpointStopWatch.Reset();
	                }
	            }
	        }
	    }

	This class will be called by the EventProcessorHost to process events received from your event hub. Note how the **SimpleEventProcessor** class uses a stopwatch to periodically call the checkpoint method on the EventProcessorHost context. This ensure that, in case the receiver is restarted, it will lose no more of five minutes of processing work.

8. In your **Program** class, add the following statements at the top:

		using Microsoft.ServiceBus.Messaging;
		using System.Threading.Tasks;
	
	Then, add the following code in the **Main** method, substituting the event hubs name and connection string, and the storage account and key copied in the previoud sections:

		string eventHubConnectionString = "{event hub connection string}";
        string eventHubName = "{event hub name}";
        string storageAccountName = "{storage account name}";
        string storageAccountKey = "{storage account key}";
        string storageConnectionString = string.Format("DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1}",
                    storageAccountName, storageAccountKey);

        string eventProcessorHostName = Guid.NewGuid().ToString();
        EventProcessorHost eventProcessorHost = new EventProcessorHost(eventProcessorHostName, eventHubName, EventHubConsumerGroup.DefaultGroupName, eventHubConnectionString, storageConnectionString);
        eventProcessorHost.RegisterEventProcessorAsync<SimpleEventProcessor>().Wait();
            
        Console.WriteLine("Receiving. Press enter key to stop worker.");
        Console.ReadLine();

> [AZURE.NOTE] In this tutorial we use a single instance of **EventProcessorHost**. To increase throughput, it is usual to run multiple instances of **EventProcessorHost**, as shown in the [Scaled out event processing sample]. In those cases, the various instances  automatically coordinate to load balance the received events. If you want multiple receivers to each process *all* the events, you have to use the `ConsumerGroup` concept. When receiving events from different machines, it might be useful to specify names for **EventProcessorHost** instances based on the machines (or roles) in which they are deployed. Refer to [Event Hubs developer guide] for more information about these topics.

<!-- Links -->
[Event Hubs developer guide]: http://msdn.microsoft.com/en-us/library/azure/dn789972.aspx
[Scaled out event processing sample]: https://code.msdn.microsoft.com/windowsazure/Service-Bus-Event-Hub-45f43fc3
[Azure Storage account]: http://azure.microsoft.com/en-us/documentation/articles/storage-create-storage-account/

<!-- Images -->

[11]: ./media/service-bus-event-hubs-getstarted/create-eph-csharp2.png
[12]: ./media/service-bus-event-hubs-getstarted/create-eph-csharp3.png
[13]: ./media/service-bus-event-hubs-getstarted/create-eph-csharp1.png
[14]: ./media/service-bus-event-hubs-getstarted/create-sender-csharp1.png