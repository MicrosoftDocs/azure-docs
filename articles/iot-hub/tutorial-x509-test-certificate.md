---
title: Tutorial - Test ability of X.509 certificates to authenticate devices to an Azure IoT Hub | Microsoft Docs
description: Tutorial - Test your X.509 certificates to authenticate to Azure IoT Hub
author: v-gpettibone
manager: philmea
ms.service: iot-hub
services: iot-hub
ms.topic: tutorial
ms.date: 02/26/2021
ms.author: robinsh
ms.custom: [mvc, 'Role: Cloud Development', 'Role: Data Analytics']
#Customer intent: As a developer, I want to be able to use X.509 certificates to authenticate devices to an IoT hub. This step of the tutorial needs to show me how to test that my certificate authenticates my device.
---

# Tutorial: Testing certificate authentication

You can use the following C# code example to test that your certificate can authenticate your device to your IoT Hub. Note that you must do the following before you run the test code:

* Create a root CA or subordinate CA certificate.
* Upload your CA certificate to your IoT Hub.
* Prove that you possess the CA certificate.
* Add a device to your IoT Hub.
* Create a device certificate with the same device ID as your your device.

## Code Example

The following code example shows how to create a C# application to simulate the X.509 device registered for your IoT hub. The example sends temperature and humidity values from the simulated device to your hub. In this tutorial, we will create only the device application. It is left as an exercise to the readers to create the IoT Hub service application that will send responses to the events sent by this simulated device.

1. Open Visual Studio, select **Create a new project**, and then choose the **Console App (.NET Framework)** project template. Select **Next**.

1. In **Configure your new project**, name the project *SimulateX509Device*, and then select **Create**.

   ![Create X.509 device project in Visual Studio](./media/iot-hub-security-x509-get-started/create-device-project-vs2019.png)

1. In Solution Explorer, right-click the **SimulateX509Device** project, and then select **Manage NuGet Packages**.

1. In the **NuGet Package Manager**, select **Browse** and search for and choose **Microsoft.Azure.Devices.Client**. Select **Install**.

   ![Add device SDK NuGet package in Visual Studio](./media/iot-hub-security-x509-get-started/device-sdk-nuget.png)

    This step downloads, installs, and adds a reference to the Azure IoT device SDK NuGet package and its dependencies.

    Input and run the following code:

```csharp
using System;
using Microsoft.Azure.Devices.Client;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using System.Text;

namespace SimulateX509Device
{
    class Program
    {
        private static int MESSAGE_COUNT = 5;

        // Temperature and humidity variables.
        private const int TEMPERATURE_THRESHOLD = 30;
        private static float temperature;
        private static float humidity;
        private static Random rnd = new Random();

        // Set the device ID to the name (device identifier) of your device.
        private static String deviceId = "{your-device-id}";

        static async Task SendEvent(DeviceClient deviceClient)
        {
            string dataBuffer;
            Console.WriteLine("Device sending {0} messages to IoTHub...\n", MESSAGE_COUNT);

            // Iterate MESSAGE_COUNT times to set randomm termperature and humidity values.
            for (int count = 0; count < MESSAGE_COUNT; count++)
            {
                // Set random values for temperature and humidity.
                temperature = rnd.Next(20, 35);
                humidity = rnd.Next(60, 80);
                dataBuffer = string.Format("{{\"deviceId\":\"{0}\",\"messageId\":{1},\"temperature\":{2},\"humidity\":{3}}}", deviceId, count, temperature, humidity);
                Message eventMessage = new Message(Encoding.UTF8.GetBytes(dataBuffer));
                eventMessage.Properties.Add("temperatureAlert", (temperature > TEMPERATURE_THRESHOLD) ? "true" : "false");
                Console.WriteLine("\t{0}> Sending message: {1}, Data: [{2}]", DateTime.Now.ToLocalTime(), count, dataBuffer);

                // Send to IoT Hub.
                await deviceClient.SendEventAsync(eventMessage);
            }
        }
        static void Main(string[] args)
        {
            try
            {
                // Create an X.509 certificate object.
                var cert = new X509Certificate2(@"{full path to pfx certificate.pfx}", "{your certificate password}");

                // Create an authentication object using your X.509 certificate. 
                var auth = new DeviceAuthenticationWithX509Certificate("{your-device-id}", cert);

                // Create the device client.
                var deviceClient = DeviceClient.Create("{your-IoT-Hub-name}.azure-devices.net", auth, TransportType.Mqtt);

                if (deviceClient == null)
                {
                    Console.WriteLine("Failed to create DeviceClient!");
                }
                else
                {
                    Console.WriteLine("Successfully created DeviceClient!");
                    SendEvent(deviceClient).Wait();
                }

                Console.WriteLine("Exiting...\n");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in sample: {0}", ex.Message);
            }
         }
    }
}
```