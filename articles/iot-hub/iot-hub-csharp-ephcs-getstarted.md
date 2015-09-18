<properties
	pageTitle="Get Started with IoT Hub"
	description="Follow this tutorial to get started using Azure IoT Hub with C# and using the EventProcessorHost."
	services="iot-hub"
	documentationCenter=""
	authors="nberdy"
	manager="kevinmil"
	editor=""/>

<tags
	ms.service="iot-hub"
	ms.workload="core"
	ms.tgt_pltfrm="csharp"
	ms.devlang="csharp"
	ms.topic="article"
	ms.date="09/29/2015"
	ms.author="sethm"/>

# Get started with IoT Hub

## Introduction

IoT Hub is a service that enables secure bi-directional communication between millions of devices and a partitioned cloud service. After you collect data into IoT Hub, you can store the data using a storage cluster or transform it using a real-time analytics provider. This large scale event collection and processing capability is a key component of Internet of Things (IoT) application architectures.

This tutorial shows how to use the Azure portal to create an IoT Hub. It also shows you how to collect messages into an IoT Hub using a console application written in C#, and how to retrieve them in parallel using the C# [Event Processor Host] library.

???NOTE: ARE WE SHOWING SENDING A COMMAND TOO???

In order to complete this tutorial you'll need the following:

+ Microsoft Visual Studio 2015, or Microsoft Visual Studio Express 2015 for Windows.

+ An active Azure account. <br/>If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started%2F target="_blank").

##Create an IoT Hub

1. Log on to the [Azure management portal], and click **NEW** at the top of the left navigation bar.

2. Click **Internet of Things**, then **IoT Hub**.

   	![][1]	//pic of creation blade

3. Type a name for your IoT Hub, select the scale tier, select your desired region, and then click **Create** at the bottom of the blade.

   	![][2]

4. From the portal startboard, click on the tile for the IoT Hub you just created.

   	![][3]

5. Click the **Settings** icon at the top of the blade, and then click **Shared access policies**. Find the primary connection strings for the policies "registryReadWrite" and "service" by clicking on the policy name and copying the connection strings somewhere to use later in this tutorial.

   	![][4]

Your IoT Hub is now created, and you have the connection strings you need to send and receive events.

## Create an application to generate device ID/key pairs

In this section, you'll write a Windows console app that generates device ID/key pairs in your IoT Hub that you will use in your client code to connect your device to the IoT Hub.

1. In Visual Studio, create a new Visual C# Desktop App project using the **Console Application** project template. Name the project **DeviceIdCreator**.

2. In Solution Explorer, right-click the solution, and then click **Manage NuGet Packages for Solution...**.

	This displays the Manage NuGet Packages dialog box.

3. Search for `Microsoft Azure IoT SOMETHING`, click **Install**, and accept the terms of use.

	![][5]

	This downloads, installs, and adds a reference to the <a href="https://www.nuget.org/packages/WindowsAzure.SOMETHINGSOMETHINGSOMETHING/">Azure IoT Hub library NuGet package</a>.

4. Add the following `using` statements at the top of the **Program.cs** file:
	using Microsoft.Azure.Devices;	//IS THIS THE FINAL NAME???
	using Microsoft.Azure.Devices.Common.Exceptions;

5. Add the following field to the **Program** class:

		static RegistryManager registryManager;

6. Add the following to the **Main** method, substituting the placeholder value with the connection string from the "registryReadWrite" rule:

		registryManager = RegistryManager.CreateFromConnectionString("{registryReadWrite connection string}");
		AddDeviceAsync().Wait();
		Console.ReadLine();

7. Add the following method to the **Program** class:

    private async static Task AddDeviceAsync()
    {
        string deviceId = "myFirstDevice";
        Device device;
        try
        {
            device = await registryManager.AddDeviceAsync(new Device(deviceId));
        }
        catch (DeviceAlreadyExistsException ex)
        {
            device = await registryManager.GetDeviceAsync(deviceId);
        }
        Console.WriteLine("Generated device key: {0}", device.Authentication.SymmetricKey.PrimaryKey);
    }

	This method creates a device identity within the IoT Hub identity store and then returns the key for that device to the console.

8. Finally, run the application and write down the key output to the console.

## Receive messages with EventProcessorHost

[EventProcessorHost] is a .NET class that simplifies receiving events from IoT Hub by managing persistent checkpoints and parallel receives from the IoT Hub. Using [EventProcessorHost], you can split events across multiple receivers, even when hosted in different nodes. This example shows how to use [EventProcessorHost] for a single receiver.

In order to use [EventProcessorHost], you must have an [Azure Storage account]:

1. Log on to the [Azure portal], and click **NEW** at the bottom of the screen.
//TODO: update this for Ibiza

2. Click **Data Services**, then **Storage**, then **Quick Create**, and then type a name for your storage account. Select your desired region, and then click **Create Storage Account**.

    ![][11]

3. Click the newly created storage account, and then click **Manage Access Keys**:

    ![][12]

    Copy the access key to use later in this tutorial.

4. In Visual Studio, create a new Visual C# Desktop App project using the **Console  Application** project template. Name the project **ReadTelemetry**.Microsoft.Azure.EventProcessorHost

    ![][14]

5. In Solution Explorer, right-click the solution, and then click **Manage NuGet Packages**.

	The **Manage NuGet Packages** dialog box appears.

6. Search for `EventProcessorHost`, click **Install**, and accept the terms of use.

    ![][13]

	This downloads, installs, and adds a reference to the [Azure Service Bus Event Hub - EventProcessorHost NuGet package](https://www.nuget.org/packages/Microsoft.Azure.ServiceBus.EventProcessorHost), with all its dependencies.	//TODO: update the URL

7. Right-click the **ReadTelemetry** project, click **Add**, and then click **Class**. Name the new class **SimpleEventProcessor**, and then click **OK** to create the class.

8. Add the following statements at the top of the SimpleEventProcessor.cs file:

		using System.Diagnostics;
		using System.Threading.Tasks;
		using Microsoft.Azure.EventProcessorHost;

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

9. In the **Program** class, add the following `using` statements at the top:

		using Microsoft.ServiceBus.Messaging;
		using Microsoft.Threading;
		using System.Threading.Tasks;

	Then, modify the **Main** method to the **Program** class as shown below, substituting the Event Hub name and connection string, and the storage account and key that you copied in the previous sections:

        static void Main(string[] args)
        {
          string eventHubConnectionString = "{event hub connection string}";
          string eventHubName = "{event hub name}";
          string storageAccountName = "{storage account name}";
          string storageAccountKey = "{storage account key}";
          string storageConnectionString = string.Format("DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1}",
              storageAccountName, storageAccountKey);

          string eventProcessorHostName = Guid.NewGuid().ToString();
          EventProcessorHost eventProcessorHost = new EventProcessorHost(eventProcessorHostName, eventHubName, EventHubConsumerGroup.DefaultGroupName, eventHubConnectionString, storageConnectionString);
          Console.WriteLine("Registering EventProcessor...");
          eventProcessorHost.RegisterEventProcessorAsync<SimpleEventProcessor>().Wait();

          Console.WriteLine("Receiving. Press enter key to stop worker.");
          Console.ReadLine();
          eventProcessorHost.UnregisterEventProcessorAsync().Wait();
        }

> [AZURE.NOTE] This tutorial uses a single instance of [EventProcessorHost]. To increase throughput, it is recommended that you run multiple instances of [EventProcessorHost], as shown in the [Scaled out event processing] sample. In those cases, the various instances  automatically coordinate with each other in order to load balance the received events. If you want multiple receivers to each process *all* the events, you must use the **ConsumerGroup** concept. When receiving events from different machines, it might be useful to specify names for [EventProcessorHost] instances based on the machines (or roles) in which they are deployed. For more information about these topics, refer to the [Event Hubs Overview] and [Event Hubs Programming Guide] topics.




## eph


    create new class: SimpleEventProcessor

    class SimpleEventProcessor : IEventProcessor
    {
        Task IEventProcessor.CloseAsync(PartitionContext context, CloseReason reason)
        {
            Console.WriteLine("Processor Shutting Down. Partition '{0}', Reason: '{1}'.", context.Lease.PartitionId, reason);
            return Task.FromResult<object>(null);
        }

        Task IEventProcessor.OpenAsync(PartitionContext context)
        {
            Console.WriteLine("SimpleEventProcessor initialized.  Partition: '{0}', Offset: '{1}'", context.Lease.PartitionId, context.Lease.Offset);
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

            // Note: when coding for high throughput EP, one might want to checkpoint more sparingly.
            await context.CheckpointAsync();
        }
    }

    add to Program.cs:

        static void Main(string[] args)
        {
            // TODO make it work with IoT Hub conn string
            string eventHubConnectionString = "HostName=testHub.df.azure-devices-int.net;CredentialType=SharedAccessSignature;CredentialScope=IotHub;SharedAccessKeyName=owner;SharedAccessKey=4xwyYVlM4P9+U9hLJ43Yo9/d5HI9++MtgRLQaeEknoM=";
            string eventHubName = "events";
            string storageAccountName = "eliostorage";
            string storageAccountKey = "rF4+hTj9doRk5DarAob7QRVTC8HRlIgeOBAEPOETNuPuiAI1op7j5ZKq8QuFe+lMr389uNoljVJkjkwCTYb91A==";
            string storageConnectionString = string.Format("DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1}",
                storageAccountName, storageAccountKey);

            string eventProcessorHostName = Guid.NewGuid().ToString();
            EventProcessorHost eventProcessorHost = new EventProcessorHost(eventProcessorHostName, eventHubName, EventHubConsumerGroup.DefaultGroupName, eventHubConnectionString, storageConnectionString);
            Console.WriteLine("Registering EventProcessor...");
            eventProcessorHost.RegisterEventProcessorAsync<SimpleEventProcessor>().Wait();

            Console.WriteLine("Receiving. Press enter key to stop worker.");
            Console.ReadLine();
            eventProcessorHost.UnregisterEventProcessorAsync().Wait();
        }

Run and keep running.

///////TEMP TO USE EH CONN STRING

            #region using eh conn string
            var ehBuilder = new ServiceBusConnectionStringBuilder();
            ehBuilder.Endpoints.Add(new Uri("sb://ihrpdfblusb04.servicebus.windows.net/"));
            ehBuilder.SharedAccessKeyName = "owner";
            ehBuilder.SharedAccessKey = "4xwyYVlM4P9+U9hLJ43Yo9/d5HI9++MtgRLQaeEknoM=";

            eventHubConnectionString = ehBuilder.ToString();
            eventHubName = "ihrpdfblu001-iothub-ehub-testhub-119-f6bfd6b991";
            #endregion
///////////////////

##create simulated device console app
get nuget for Microsoft.Azure.IoT.Devices.Client
	get nuget for Newtonsoft.Json
	get hub URI from portal.
    fill in URI and devcie key from first step.

code:

		static DeviceClient deviceClient;

        static void Main(string[] args)
        {
            deviceClient = DeviceClient.Create("testHub.df.azure-devices-int.net", new DeviceAuthenticationWithRegistrySymmetricKey("myFirstDevice", "toYa8ys2VhV3Tov1xMQPJA=="));

            SendDeviceToCloudMessagesAsync();
            Console.ReadLine();
        }

        private static async void SendDeviceToCloudMessagesAsync()
        {
            double avgWindSpeed = 10; // m/s
            Random rand = new Random();

            while (true)
            {
                // randomize +/- 2 m/s
                double currentWindSpeed = avgWindSpeed + rand.NextDouble() * 4 - 2;

                var telemetryDataPoint = new
                {
                    deviceId = "myFirstDevice",
                    windSpeed = currentWindSpeed
                };
                var messageString = JsonConvert.SerializeObject(telemetryDataPoint);
                var message = new Message(Encoding.ASCII.GetBytes(messageString));

                await deviceClient.SendEventAsync(message);
                Console.WriteLine("{0} > Sending message: {1}", DateTime.Now, message);

                Thread.Sleep(1000);
            }
        }

Run and see the messages going through!!!

Add a note to use retry policies in production as described in https://msdn.microsoft.com/en-us/library/hh680901(v=pandp.50).aspx. Suggest Exponential back-off.
