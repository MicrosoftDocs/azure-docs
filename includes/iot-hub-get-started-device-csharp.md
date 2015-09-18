## Create a device identity

In this section, you'll write a Windows console app that creates a new device identity in your IoT hub. Refer to the **Device Identity Registry** section of the [IoT Hub Developer Guide][IoT Hub Developer Guide - Identity Registry] for more information. After running this console application, you will have an id and a key, to use as your device identity to send device-to-cloud messages to IoT Hub.

1. In Visual Studio, create a new Visual C# Desktop App project using the **Console  Application** project template. Name the project **CreateDeviceIdentity**.

   	![][10]

2. In Solution Explorer, right-click the solution, and then click **Manage NuGet Packages for Solution...**.

	This displays the Manage NuGet Packages window.

3. Search for `Microsoft Azure Devices`, click **Install**, and accept the terms of use.

	This downloads, installs, and adds a reference to the [Azure IoT - Service SDK NuGet package].

4. Add the following `using` statement at the top of the **Program.cs** file:

		using Microsoft.Azure.Devices;
        using Microsoft.Azure.Devices.Common.Exceptions;

5. Add the following fields to the **Program** class, substituting the placeholder values with the name of the Event Hub you created in the previous section, and the connection string with **Send** rights:

		static string eventHubName = "{event hub name}";
        static string connectionString = "{send connection string}";

6. Add the following method to the **Program** class:

		private async static Task AddDeviceAsync()
        {
            string deviceId = "myFirstDevice";
            Device device;
            try
            {
                device = await registryManager.AddDeviceAsync(new Device(deviceId));
            }
            catch (DeviceAlreadyExistsException)
            {
                device = await registryManager.GetDeviceAsync(deviceId);
            }
            Console.WriteLine("Generated device key: {0}", device.Authentication.SymmetricKey.PrimaryKey);
        }

	This method will create a new device identity with id **myFirstDevice** (in case an identity exists with the same id already exists, it will simply retrieve it). Then, the app displays the primary key for that identity. This key will be used by the simulated device to connect to IoT Hub.

7. Finally, add the following lines to the **Main** method:

		registryManager = RegistryManager.CreateFromConnectionString(connectionString);
        AddDeviceAsync().Wait();
        Console.ReadLine();

8. Run this application, and write down the device key.

    ![][12]

## Receive messages with EventProcessorHost
Iot Hub exposes an [Event Hubs][Event Hubs Overview]-compatible endpoint to receive device-to-cloud messages. This tutorial uses [EventProcessorHost] to receive these messages in a console app. More information on how to process IoT Hub's device-to-cloud messages can be found in the [Process device-to-cloud messages] tutorial. For more information on how to process messages from Event Hubs you can refer to the [Get Started with Event Hubs] tutorial.

In order to use [EventProcessorHost], you must have an [Azure Storage account]. You can use an existing one, or follow the following steps to create a new one.

1. Log on to the [Azure Preview Portal].

2. In the jumpbar, click **New**, then click **Data + Storage**, and then click **Storage account**.

    ![][20]

3. In **Storage account** blade, select the desired deployment model for the storage account and click **Create**.

4. In the **New IoT Hub** blade, specify the desired configuration for the IoT Hub.

    ![][21]

    * In the **Name** box, enter a name to identify your storage account. When the **Name** is validated, a green check mark appears in the **Name** box.
    * Change the **Type** as desired. This tutorial does not require a specific storage type.
    * In the **Resource group** box, create a new resource group, or select and existing one. For more information, see [Using resource groups to manage your Azure resources](resource-group-portal.md).
    * Use **Location** to specify the geographic location in which to host your IoT hub.  

4. Once the new storage account options are configured, click **Create**.  It can take a few minutes for the storage account to be created.  To check the status, you can monitor the progress on the Startboard. Or, you can monitor your progress from the Notifications hub.

5. After the storage account has been created successfully, open the blade of the new account and select **Key** icon on the top. Take note of the account name and connection string.

    ![][22]

4. In the current Visual Studio solution, create a new Visual C# Desktop App project using the **Console  Application** project template. Name the project **ProcessDeviceToCloudMessages**.

    ![][10]

5. In Solution Explorer, right-click the solution, and then click **Manage NuGet Packages**.

    The **Manage NuGet Packages** dialog box appears.

6. Search for `Microsoft Azure Service Bus Event Hub - EventProcessorHost`, click **Install**, and accept the terms of use.

    This downloads, installs, and adds a reference to the [Azure Service Bus Event Hub - EventProcessorHost NuGet package](https://www.nuget.org/packages/Microsoft.Azure.ServiceBus.EventProcessorHost), with all its dependencies.

7. Right-click the **ProcessDeviceToCloudMessages** project, click **Add**, and then click **Class**. Name the new class **SimpleEventProcessor**, and then click **OK** to create the class.

8. Add the following statements at the top of the SimpleEventProcessor.cs file:

        using Microsoft.ServiceBus.Messaging;

    Then, substitute the following code for the body of the class:

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

            await context.CheckpointAsync();
        }
    }

    This class will be called by the **EventProcessorHost** to process events received from IoT Hub.

9. In the **Program** class, add the following `using` statements at the top:

        using Microsoft.ServiceBus.Messaging;

    Then, modify the **Main** method to the **Program** class as shown below, substituting the Event Hub name and connection string, and the storage account and key that you copied in the previous sections:

        static void Main(string[] args)
        {
          string iotHubConnectionString = "{iot hub service connection string}";
            string iotHubD2cEndpoint = "messages/events";
            string storageConnectionString = "{storage connection string}";

            string eventProcessorHostName = Guid.NewGuid().ToString();
            EventProcessorHost eventProcessorHost = new EventProcessorHost(eventProcessorHostName, iotHubD2cEndpoint, EventHubConsumerGroup.DefaultGroupName, iotHubConnectionString, storageConnectionString, "messages-events");
            Console.WriteLine("Registering EventProcessor...");
            eventProcessorHost.RegisterEventProcessorAsync<SimpleEventProcessor>().Wait();

            Console.WriteLine("Receiving. Press enter key to stop worker.");
            Console.ReadLine();
            eventProcessorHost.UnregisterEventProcessorAsync().Wait();
        }

> [AZURE.NOTE] For simplicity's sake, this tutorial uses a single instance of [EventProcessorHost]. Please refer to [Event Hubs Programming Guide][Event Hubs Programming Guide] and the [Process device-to-cloud messages] tutorial for more information on processing device-to-cloud messages.

<!-- Links -->

[Get Started with Event Hubs]: event-hubs-csharp-ephcs-getstarted.md

[Event Hubs Programming Guide]: event-hubs-programming-guide.md

[IoT Hub Developer Guide - Identity Registry]: iot-hub-devguide.md#identityregistry
[Azure IoT - Service SDK NuGet package]: http://toadd

[Event Hubs Overview]: event-hubs-overview.md
[Scaled out event processing]: https://code.msdn.microsoft.com/windowsazure/Service-Bus-Event-Hub-45f43fc3
[Azure Storage account]: storage-create-storage-account.md
[EventProcessorHost]: http://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventprocessorhost(v=azure.95).aspx

[Azure Preview Portal]: https://portal.azure.com/


<!-- Images -->
[10]: ./media/iot-hub-getstarted-cloud-csharp/create-identity-csharp1.png
[12]: ./media/iot-hub-getstarted-cloud-csharp/create-identity-csharp3.png

[20]: ./media/iot-hub-getstarted-cloud-csharp/create-storage1.png
[21]: ./media/iot-hub-getstarted-cloud-csharp/create-storage2.png
[22]: ./media/iot-hub-getstarted-cloud-csharp/create-storage3.png
