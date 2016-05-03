## Create a device identity

In this section, you'll create a Windows console app that creates a new device identity in the identity registry in your IoT hub. A device cannot connect to IoT hub unless it has an entry in the device identity registry. Refer to the **Device Identity Registry** section of the [IoT Hub Developer Guide][lnk-devguide-identity] for more information. When you run this console application, it generates a unique device ID and key that your device can identify itself with when it sends device-to-cloud messages to IoT Hub.

1. In Visual Studio, add a new Visual C# Windows Classic Desktop project to the current solution using the **Console  Application** project template. Make sure the .NET Framework version is 4.5.1 or higher. Name the project **CreateDeviceIdentity**.

	![][10]

2. In Solution Explorer, right-click the **CreateDeviceIdentity** project, and then click **Manage NuGet Packages**.

3. In the **NuGet Package Manager** window, select **Browse**, search for **microsoft.azure.devices**, click **Install** to install the **Microsoft.Azure.Devices** package, and accept the terms of use.

	![][11]

4. This downloads, installs, and adds a reference to the [Microsoft Azure IoT Service SDK][lnk-nuget-service-sdk] NuGet package and its dependencies.

4. Add the following `using` statements at the top of the **Program.cs** file:

		using Microsoft.Azure.Devices;
        using Microsoft.Azure.Devices.Common.Exceptions;

5. Add the following fields to the **Program** class, replacing the placeholder value with the connection string for the IoT hub you created in the previous section:

		static RegistryManager registryManager;
        static string connectionString = "{iothub connection string}";

6. Add the following method to the **Program** class:

		private static async Task AddDeviceAsync()
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

	This method creates a new device identity with ID **myFirstDevice** (if that device ID already exists in the registry, the code simply retrieves the existing device information). The app then displays the primary key for that identity. You will use this key in the simulated device to connect to your IoT hub.

7. Finally, add the following lines to the **Main** method:

		registryManager = RegistryManager.CreateFromConnectionString(connectionString);
        AddDeviceAsync().Wait();
        Console.ReadLine();

8. Run this application, and make a note of the device key.

    ![][12]

> [AZURE.NOTE] The IoT Hub identity registry only stores device identities to enable secure access to the hub. It stores device IDs and keys to use as security credentials and an enabled/disabled flag that enables you to disable access for an individual device. If you application needs to store other device-specific metadata, it should use an application-specific store. Refer to [IoT Hub Developer Guide][lnk-devguide-identity] for more information.

## Receive device-to-cloud messages

In this section, you'll create a Windows console app that reads device-to-cloud messages from IoT Hub. An IoT hub exposes an [Event Hubs][lnk-event-hubs-overview]-compatible endpoint to enable you to read device-to-cloud messages. To keep things simple, this tutorial creates a basic reader that is not suitable for a high throughput deployment. The [Process device-to-cloud messages][lnk-processd2c-tutorial] tutorial shows you how to process device-to-cloud messages at scale. The [Get Started with Event Hubs][lnk-eventhubs-tutorial] tutorial provides further information on how to process messages from Event Hubs and is applicable to the IoT Hub Event Hub-compatible endpoints.

> [AZURE.NOTE] The Event Hubs-compatible endpoint for reading device-to-cloud messages always uses the AMQPS protocol.

1. In Visual Studio, add a new Visual C# Windows Classic Desktop project to the current solution using the **Console  Application** project template. Make sure the .NET Framework version is 4.5.1 or higher. Name the project **ReadDeviceToCloudMessages**.

    ![][10]

2. In Solution Explorer, right-click the **ReadDeviceToCloudMessages** project, and then click **Manage NuGet Packages**.

3. In the **NuGet Package Manager** window, search for **WindowsAzure.ServiceBus**, click **Install**, and accept the terms of use.

    This downloads, installs, and adds a reference to the [Azure Service Bus][lnk-servicebus-nuget], with all its dependencies. This package enables the application to connect to the Event Hub-compatible endpoint on your IoT hub.

4. Add the following `using` statements at the top of the **Program.cs** file:

        using Microsoft.ServiceBus.Messaging;
        using System.Threading;

5. Add the following fields to the **Program** class, replacing the placeholder value with the connection string for the IoT hub you created in the *Create an IoT hub* section:

        static string connectionString = "{iothub connection string}";
        static string iotHubD2cEndpoint = "messages/events";
        static EventHubClient eventHubClient;

6. Add the following method to the **Program** class:

        private static async Task ReceiveMessagesFromDeviceAsync(string partition, CancellationToken ct)
        {
            var eventHubReceiver = eventHubClient.GetDefaultConsumerGroup().CreateReceiver(partition, DateTime.UtcNow);
            while (true)
            {
                if (ct.IsCancellationRequested) break;
                EventData eventData = await eventHubReceiver.ReceiveAsync();
                if (eventData == null) continue;

                string data = Encoding.UTF8.GetString(eventData.GetBytes());
                Console.WriteLine("Message received. Partition: {0} Data: '{1}'", partition, data);
            }
        }

    This method uses an **EventHubReceiver** instance to receive messages from all the IoT hub device-to-cloud receive partitions. Notice how you pass a `DateTime.Now` parameter when you create the **EventHubReceiver** object so that it only receives messages sent after it starts. This is useful in a test environment so you can see the current set of messages, but in a production environment your code should make sure that it processes all the messages - see the [How to process IoT Hub device-to-cloud messages][lnk-processd2c-tutorial] tutorial for more information.

7. Finally, add the following lines to the **Main** method:

        Console.WriteLine("Receive messages. Ctrl-C to exit.\n");
        eventHubClient = EventHubClient.CreateFromConnectionString(connectionString, iotHubD2cEndpoint);

        var d2cPartitions = eventHubClient.GetRuntimeInformation().PartitionIds;

        CancellationTokenSource cts = new CancellationTokenSource();

        System.Console.CancelKeyPress += (s, e) =>
        {
          e.Cancel = true;
          cts.Cancel();
          Console.WriteLine("Exiting...");
        };

        var tasks = new List<Task>();
        foreach (string partition in d2cPartitions)
        {
           tasks.Add(ReceiveMessagesFromDeviceAsync(partition, cts.Token));
        }  
        Task.WaitAll(tasks.ToArray());


<!-- Links -->

[lnk-eventhubs-tutorial]: ../articles/event-hubs/event-hubs-csharp-ephcs-getstarted.md
[lnk-devguide-identity]: ../articles/iot-hub/iot-hub-devguide.md#identityregistry
[lnk-servicebus-nuget]: https://www.nuget.org/packages/WindowsAzure.ServiceBus
[lnk-event-hubs-overview]: ../articles/event-hubs/event-hubs-overview.md

[lnk-nuget-service-sdk]: https://www.nuget.org/packages/Microsoft.Azure.Devices/
[lnk-processd2c-tutorial]: ../articles/iot-hub/iot-hub-csharp-csharp-process-d2c.md

<!-- Images -->
[10]: ./media/iot-hub-getstarted-cloud-csharp/create-identity-csharp1.png
[11]: ./media/iot-hub-getstarted-cloud-csharp/create-identity-csharp2.png
[12]: ./media/iot-hub-getstarted-cloud-csharp/create-identity-csharp3.png
