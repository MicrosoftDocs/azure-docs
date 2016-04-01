## Send a cloud-to-device message from the app back end

In this section, you'll write a Windows console app that sends cloud-to-device messages to the simulated device app.

1. In the current Visual Studio solution, create a new Visual C# Desktop App project using the **Console  Application** project template. Name the project **SendCloudToDevice**.

   	![][20]

2. In Solution Explorer, right-click the solution, and then click **Manage NuGet Packages for Solution...**. 

	This displays the Manage NuGet Packages window.

3. Search for `Microsoft Azure Devices`, click **Install**, and accept the terms of use. 

	This downloads, installs, and adds a reference to the [Azure IoT - Service SDK NuGet package].

4. Add the following `using` statement at the top of the **Program.cs** file:

		using Microsoft.Azure.Devices;

5. Add the following fields to the **Program** class, substituting the placeholder value with the IoT hub connection string from [Get started with IoT Hub]:

		static ServiceClient serviceClient;
        static string connectionString = "{iot hub connection string}";

6. Add the following method to the **Program** class:

		private async static Task SendCloudToDeviceMessageAsync()
        {
            var commandMessage = new Message(Encoding.ASCII.GetBytes("Cloud to device message."));
            await serviceClient.SendAsync("myFirstDevice", commandMessage);
        }

	This method will send a new cloud-to-device message to the device with id `myFirstDevice`. Change this parameter accordingly, in case you modified from the one used in [Get started with IoT Hub].

7. Finally, add the following lines to the **Main** method:

        Console.WriteLine("Send Cloud-to-Device message\n");
        serviceClient = ServiceClient.CreateFromConnectionString(connectionString);

        Console.WriteLine("Press any key to send a C2D message.");
        Console.ReadLine();
        SendCloudToDeviceMessageAsync().Wait();
        Console.ReadLine();

8. From within Visual Studio, right click your solution and select **Set StartUp projects...**. Select **Multiple startup projects**, then select the **Start** action for **ProcessDeviceToCloudMessages**, **SimulatedDevice**, and **SendCloudToDevice**.

9.  Press **F5**, and you should see all three application start. Select the **SendCloudToDevice** windows and press **Enter**: you should see the message being received by the simulated app.

    ![][21]

## Receiving delivery feedback
It is possible to request delivery (or expiration) ackownledgments from IoT Hub for each cloud-to-device message. This enables the cloud back end to easily inform retry or compensation logic. Refer to the [IoT Hub Developer Guide][IoT Hub Developer Guide - C2D] for more information on cloud-to-device feedback.

In this section, you will modify the **SendCloudToDevice** app to request feedback and receive them from IoT Hub.

1. In Visual Studio, in the **SendCloudToDevice** project, add the following method to the **Program** class.
   
        private async static void ReceiveFeedbackAsync()
        {
            var feedbackReceiver = serviceClient.GetFeedbackReceiver();

            Console.WriteLine("\nReceiving c2d feedback from service");
            while (true)
            {
                var feedbackBatch = await feedbackReceiver.ReceiveAsync();
                if (feedbackBatch == null) continue;

                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine("Received feedback: {0}", string.Join(", ", feedbackBatch.Records.Select(f => f.StatusCode)));
                Console.ResetColor();

                await feedbackReceiver.CompleteAsync(feedbackBatch);
            }
        }

    Note that the receive pattern is the same one used to receive cloud-to-device messages from the device app.

2. Add the following method in the **Main** method right after the `serviceClient = ServiceClient.CreateFromConnectionString(connectionString)` line:

        ReceiveFeedbackAsync();

3. In order to request feedback for the delivery of your cloud-to-device message, you have to specify a property in the **SendCloudToDeviceMessageAsync** method. Add the following line, right after the `var commandMessage = new Message(...);` line:

        commandMessage.Ack = DeliveryAcknowledgement.Full;

4.  Run the apps by pressing **F5**, and you should see all three application start. Select the **SendCloudToDevice** windows and press **Enter**: you should see the message being received by the simulated app, and after a few seconds, the feedback message being received by your **SendCloudToDevice** application.

    ![][22]

> [AZURE.NOTE] For simplicity's sake, this tutorial does not implement any retry policy. In production code, it is reccommended to implement retry policies (such as exponential backoff), as suggested in the MSDN article [Transient Fault Handling].

<!-- Links -->

[IoT Hub Developer Guide - C2D]: iot-hub-devguide.md#c2d
[Azure IoT - Service SDK NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.Devices/
[Transient Fault Handling]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx
[Get started with IoT Hub]: iot-hub-csharp-csharp-getstarted.md

<!-- Images -->
[20]: ./media/iot-hub-c2d-cloud-csharp/create-identity-csharp1.png
[21]: ./media/iot-hub-c2d-cloud-csharp/sendc2d1.png
[22]: ./media/iot-hub-c2d-cloud-csharp/sendc2d2.png






