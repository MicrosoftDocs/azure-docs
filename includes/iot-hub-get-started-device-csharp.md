## Create a simulated device app

In this section, you'll create a Windows console app that simulates a device that sends device-to-cloud messages to an IoT hub.

1. In Visual Studio, add a new Visual C# Windows Classic Desktop project to the current solution using the **Console  Application** project template.  Make sure the .NET Framework version is 4.5.1 or higher. Name the project **SimulatedDevice**.

   	![][30]

2. In Solution Explorer, right-click the **SimulatedDevice** project, and then click **Manage NuGet Packages**.

3. In the **NuGet Package Manager** window, select **Browse**, search for **Microsoft.Azure.Devices.Client**, click **Install** to install the **Microsoft.Azure.Devices.Client** package, and accept the terms of use.

	This downloads, installs, and adds a reference to the [Azure IoT - Device SDK NuGet package][lnk-device-nuget] and its dependencies.

4. Add the following `using` statement at the top of the **Program.cs** file:

		using Microsoft.Azure.Devices.Client;
        using Newtonsoft.Json;


5. Add the following fields to the **Program** class, substituting the placeholder values with the IoT hub hostname you retrieved in the *Create an IoT hub* section and the device key retrieved in the *Create a device identity* section:

		static DeviceClient deviceClient;
        static string iotHubUri = "{iot hub hostname}";
        static string deviceKey = "{device key}";

6. Add the following method to the **Program** class:

		private static async void SendDeviceToCloudMessagesAsync()
        {
            double avgWindSpeed = 10; // m/s
            Random rand = new Random();

            while (true)
            {
                double currentWindSpeed = avgWindSpeed + rand.NextDouble() * 4 - 2;

                var telemetryDataPoint = new
                {
                    deviceId = "myFirstDevice",
                    windSpeed = currentWindSpeed
                };
                var messageString = JsonConvert.SerializeObject(telemetryDataPoint);
                var message = new Message(Encoding.ASCII.GetBytes(messageString));

                await deviceClient.SendEventAsync(message);
                Console.WriteLine("{0} > Sending message: {1}", DateTime.Now, messageString);

                Task.Delay(1000).Wait();
            }
        }

	This method sends a new device-to-cloud message every second. The message contains a JSON-serialized object with the deviceId and a randomly generated number to simulate a wind speed sensor.

7. Finally, add the following lines to the **Main** method:

        Console.WriteLine("Simulated device\n");
        deviceClient = DeviceClient.Create(iotHubUri, new DeviceAuthenticationWithRegistrySymmetricKey("myFirstDevice", deviceKey));

        SendDeviceToCloudMessagesAsync();
        Console.ReadLine();

  By default, the **Create** method creates a **DeviceClient** instance that uses the AMQP protocol to communicate with IoT Hub. To use the HTTPS protocol, use the override of the **Create** method that enables you to specify the protocol. If you choose to use the HTTPS protocol, you should also add the **Microsoft.AspNet.WebApi.Client** NuGet package to your project to include the **System.Net.Http.Formatting** namespace.

This tutorial takes you through the steps to create an IoT Hub device client. As an alternative, you can use the [Connected Service for Azure IoT Hub][lnk-connected-service] Visual Studio extension to add the necessary code to your device client application.


> [AZURE.NOTE] To keep things simple, this tutorial does not implement any retry policy. In production code, you should implement retry policies (such as an exponential backoff), as suggested in the MSDN article [Transient Fault Handling][lnk-transient-faults].

<!-- Links -->

[lnk-device-nuget]: https://www.nuget.org/packages/Microsoft.Azure.Devices.Client/
[lnk-transient-faults]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx
[lnk-connected-service]: https://visualstudiogallery.msdn.microsoft.com/e254a3a5-d72e-488e-9bd3-8fee8e0cd1d6

<!-- Images -->
[30]: ./media/iot-hub-getstarted-device-csharp/create-identity-csharp1.png
