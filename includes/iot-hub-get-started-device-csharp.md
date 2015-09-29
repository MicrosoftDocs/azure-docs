## Create a simulated device app

In this section, you'll write a Windows console app that simulates a device sending device-to-cloud messages to an IoT hub.

1. In the current Visual Studio solution, click **File->Add->Project** to create a new Visual C# Desktop App project using the **Console  Application** project template. Name the project **SimulatedDevice**.

   	![][30]

2. In Solution Explorer, right-click the solution, and then click **Manage NuGet Packages for Solution...**.

	This displays the Manage NuGet Packages window.

3. Search for `Microsoft Azure Devices Client`, click **Install**, and accept the terms of use.

	This downloads, installs, and adds a reference to the [Azure IoT - Device SDK NuGet package].

4. Add the following `using` statement at the top of the **Program.cs** file:

		using Microsoft.Azure.Devices.Client;
        using Newtonsoft.Json;
        using System.Threading;

5. Add the following fields to the **Program** class, substituting the placeholder values with the IoT hub URI and the device key retrieved in the **Create an IoT hub** and **Create a device identity** sections, respectively:

		static DeviceClient deviceClient;
        static string iotHubUri = "{iot hub URI}";
        static string deviceKey = "{deviceKey}";

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

                Thread.Sleep(1000);
            }
        }

	This method will send a new device-to-cloud message every second, contaning a JSON-serialized object with the deviceId and a randomly generated number, representing a simulated wind speed sensor.

7. Finally, add the following lines to the **Main** method:

        Console.WriteLine("Simulated device\n");
        deviceClient = DeviceClient.Create(iotHubUri, new DeviceAuthenticationWithRegistrySymmetricKey("myFirstDevice", deviceKey));

        SendDeviceToCloudMessagesAsync();
        Console.ReadLine();

> [AZURE.NOTE] For simplicity's sake, this tutorial does not implement any retry policy. In production code, it is reccommended to implement retry policies (such as exponential backoff), as suggested in the MSDN article [Transient Fault Handling].

<!-- Links -->

[Azure IoT - Device SDK NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.Devices.Client/
[Transient Fault Handling]: https://msdn.microsoft.com/en-us/library/hh680901(v=pandp.50).aspx

<!-- Images -->
[30]: ./media/iot-hub-getstarted-device-csharp/create-identity-csharp1.png
