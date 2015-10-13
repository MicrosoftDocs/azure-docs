## Create a device identity

In this section, you'll write a Windows console app that creates a new device identity in your IoT hub. Refer to the **Device Identity Registry** section of the [IoT Hub Developer Guide][IoT Hub Developer Guide - Identity Registry] for more information. After running this console application, you will have an ID and a key to use as your device identity to send device-to-cloud messages to IoT Hub.

1. In Visual Studio, create a new Visual C# Desktop App project using the **Console  Application** project template. Name the project **CreateDeviceIdentity**.

   ![][10]

2. In Solution Explorer, right-click the name of the project (in this example, **CreateDeviceIdentity**), and then click **Properties**.

3. In the **Target framework** list, click **.NET Framework 4.5.1**.

4. From the **Tools** menu, click **NuGet Package Manager**, then click **Package Manager Console**.

5. At the command line in the **Package Manager Console** window, type `Install-Package Microsoft.Azure.Devices -Pre`, then press Enter. The [Microsoft.Azure.Devices](https://www.nuget.org/packages/Microsoft.Azure.Devices/) package is installed and the appropriate references are added to the project.

4. Add the following `using` statement at the top of the **Program.cs** file:

		using Microsoft.Azure.Devices;
        using Microsoft.Azure.Devices.Common.Exceptions;

5. Add the following fields to the **Program** class, substituting the placeholder values with the name of the IoT hub you created in the previous section, and its connection string:

		static RegistryManager registryManager;
        static string connectionString = "{iothub connection string}";

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

	This method will create a new device identity with ID **myFirstDevice** (in case an identity already exists with the same ID, it will simply retrieve it). Then, the app displays the primary key for that identity. This key will be used by the simulated device to connect to IoT Hub.

7. Finally, add the following lines to the **Main** method:

		registryManager = RegistryManager.CreateFromConnectionString(connectionString);
        AddDeviceAsync().Wait();
        Console.ReadLine();

8. Run this application, and write down the device key.

    ![][12]

> [AZURE.NOTE] It is important to note that the IoT hub identity registry is only used to store device identities for the purpose of secure access, i.e. store security credentials and enable/disable individual device's access. Device application meta-data should be stored in an application-specific store. Refer to [IoT Hub Developer Guide][IoT Hub Developer Guide - Identity Registry] for more information.

## Receive device-to-cloud messages

In this section, you will create a Windows console app that reads device-to-cloud messages from IoT Hub. Iot Hub exposes an [Event Hubs][Event Hubs Overview]-compatible endpoint to read device-to-cloud messages. For simplicity's sake, this tutorial uses creates a simplified reader that is not suited for high throughput deployment. More information on how to process IoT Hub's device-to-cloud messages can be found in the [Process device-to-cloud messages] tutorial. For more information on how to process messages from Event Hubs you can refer to the [Get Started with Event Hubs] tutorial.

1. In the current Visual Studio solution, click **File->Add->Project** to create a new Visual C# Desktop App project using the **Console  Application** project template. Name the project **ReadDeviceToCloudMessages**.

    ![][10]

2. In Solution Explorer, right-click the solution, and then click **Manage NuGet Packages**.

    The **Manage NuGet Packages** dialog box appears.

3. Search for `WindowsAzure.ServiceBus`, click **Install**, and accept the terms of use.

    This downloads, installs, and adds a reference to the [Azure Service Bus](https://www.nuget.org/packages/WindowsAzure.ServiceBus), with all its dependencies.

4. Add the following `using` statement at the top of the **Program.cs** file:

        using Microsoft.Azure.Devices.Common;
        using Microsoft.ServiceBus.Messaging;

5. Add the following fields to the **Program** class, substituting the placeholder values with the name of the IoT hub you created in the previous section and its connection string:

        static string connectionString = "{iothub connection string}";
        static string iotHubD2cEndpoint = "messages/events";
        static EventHubClient eventHubClient;

6. Add the following method to the **Program** class:

        private async static Task ReceiveMessagesFromDeviceAsync(string partition)
        {
            var eventHubReceiver = eventHubClient.GetDefaultConsumerGroup().CreateReceiver(partition, DateTime.Now);
            while (true)
            {
                EventData eventData = await eventHubReceiver.ReceiveAsync();
                if (eventData == null) continue;

                string data = Encoding.UTF8.GetString(eventData.GetBytes());
                Console.WriteLine(string.Format("Message received. Partition: {0} Data: '{1}'", partition, data));
            }
        }

    This method uses an EventHub client to receive from all the device-to-cloud receive partitions of your IoT hub. Note how, when creating a EventHubReceiver a `DateTime.Now` parameter is passed. This creates a receiver that will receive only message that are sent after it starts.

7. Finally, add the following lines to the **Main** method:

        Console.WriteLine("Receive messages\n");
        eventHubClient = EventHubClient.CreateFromConnectionString(connectionString, iotHubD2cEndpoint);

        var d2cPartitions = eventHubClient.GetRuntimeInformation().PartitionIds;

        foreach (string partition in d2cPartitions)
        {
           ReceiveMessagesFromDeviceAsync(partition);
        }  
        Console.ReadLine();


<!-- Links -->

[Azure IoT - Service SDK NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.Devices/

[Get Started with Event Hubs]: event-hubs-csharp-ephcs-getstarted.md
[IoT Hub Developer Guide - Identity Registry]: iot-hub-devguide.md#identityregistry

[Event Hubs Overview]: event-hubs-overview.md
[Scaled out event processing]: https://code.msdn.microsoft.com/windowsazure/Service-Bus-Event-Hub-45f43fc3
[Azure Storage account]: storage-create-storage-account.md
[EventProcessorHost]: http://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventprocessorhost(v=azure.95).aspx

[Azure Preview Portal]: https://portal.azure.com/


<!-- Images -->
[10]: ./media/iot-hub-getstarted-cloud-csharp/create-identity-csharp1.png
[12]: ./media/iot-hub-getstarted-cloud-csharp/create-identity-csharp3.png

