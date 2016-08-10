<properties
	pageTitle="Send cloud-to-device messages with IoT Hub | Microsoft Azure"
	description="Follow this tutorial to learn how to send cloud-to-device messages using Azure IoT Hub with C#."
	services="iot-hub"
	documentationCenter=".net"
	authors="fsautomata"
	manager="timlt"
	editor=""/>

<tags
     ms.service="iot-hub"
     ms.devlang="dotnet"
     ms.topic="article"
     ms.tgt_pltfrm="na"
     ms.workload="na"
     ms.date="06/23/2016"
     ms.author="elioda"/>

# Tutorial: How to send cloud-to-device messages with IoT Hub and .Net

[AZURE.INCLUDE [iot-hub-selector-c2d](../../includes/iot-hub-selector-c2d.md)]

## Introduction

Azure IoT Hub is a fully managed service that helps enable reliable and secure bi-directional communications between millions of IoT devices and an application back end. The [Get started with IoT Hub] tutorial shows how to create an IoT hub, provision a device identity in it, and code a simulated device that sends device-to-cloud messages.

This tutorial builds on [Get started with IoT Hub]. It shows you how to:

- From your application cloud back end, send cloud-to-device messages to a single device through IoT Hub.
- Receive cloud-to-device messages on a device.
- From your application cloud back end, request delivery acknowledgement (*feedback*) for messages sent to a device from IoT Hub.

You can find more information on cloud-to-device messages in the [IoT Hub Developer Guide][IoT Hub Developer Guide - C2D].

At the end of this tutorial, you will run two Windows console applications:

* **SimulatedDevice**, a modified version of the app created in [Get started with IoT Hub], which connects to your IoT hub and receives cloud-to-device messages.
* **SendCloudToDevice**, which sends a cloud-to-device message to the simulated device through IoT Hub, and then receives its delivery acknowledgement.

> [AZURE.NOTE] IoT Hub has SDK support for many device platforms and languages (including C, Java, and Javascript) through Azure IoT device SDKs. For step-by-step instructions on how to connect your device to this tutorial's code, and generally to Azure IoT Hub, see the [Azure IoT Developer Center].

To complete this tutorial, you'll need the following:

+ Microsoft Visual Studio 2015

+ An active Azure account. (If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][lnk-free-trial].)

## Receive messages on the simulated device

In this section, you'll modify the simulated device application you created in [Get started with IoT Hub] to receive cloud-to-device messages from the IoT hub.

1. In Visual Studio, in the **SimulatedDevice** project, add the following method to the **Program** class.

        private static async void ReceiveC2dAsync()
        {
            Console.WriteLine("\nReceiving cloud to device messages from service");
            while (true)
            {
                Message receivedMessage = await deviceClient.ReceiveAsync();
                if (receivedMessage == null) continue;

                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine("Received message: {0}", Encoding.ASCII.GetString(receivedMessage.GetBytes()));
                Console.ResetColor();

                await deviceClient.CompleteAsync(receivedMessage);
            }
        }

    The `ReceiveAsync` method asynchronously returns the received message at the time that it is received by the device. It returns *null* after a specifiable timeout period (in this case, the default of one minute is used). When this happens, the code should continue waiting for new messages. This is the reason for the `if (receivedMessage == null) continue` line.

    The call to `CompleteAsync()` notifies IoT Hub that the message has been successfully processed. The message can be safely removed from the device queue. If something happened that prevented the device app from completing the processing of the message, IoT Hub delivers it again. It is then important that message processing logic in the device app be *idempotent*, so that receiving the same message multiple times produces the same result. An application can also temporarily abandon a message, which results in IoT hub retaining the message in the queue for future consumption. Or, the application can reject a message, which permanently removes the message from the queue. For more information about the cloud-to-device message lifecycle, see the [IoT Hub Developer Guide][IoT Hub Developer Guide - C2D].

    > [AZURE.NOTE] When using HTTP/1 instead of AMQP as a transport, the `ReceiveAsync` method returns immediately. The supported pattern for cloud-to-device messages with HTTP/1 is intermittently connected devices that check for messages infrequently (less than every 25 minutes). Issuing more HTTP/1 receives results in IoT Hub throttling the requests. For more information about the differences between AMQP and HTTP/1 support, and IoT Hub throttling, see the [IoT Hub Developer Guide][IoT Hub Developer Guide - C2D].

2. Add the following method in the **Main** method, right before the `Console.ReadLine()` line:

        ReceiveC2dAsync();

> [AZURE.NOTE] For simplicity's sake, this tutorial does not implement any retry policy. In production code, you should implement retry policies (such as exponential backoff), as suggested in the MSDN article [Transient Fault Handling].

## Send a cloud-to-device message

In this section, you'll write a Windows console app that sends cloud-to-device messages to the simulated device app.

1. In the current Visual Studio solution, create a new Visual C# Desktop App project by using the **Console  Application** project template. Name the project **SendCloudToDevice**.

    ![New project in Visual Studio][20]

2. In Solution Explorer, right-click the solution, and then click **Manage NuGet Packages for Solution...**. 

	This opens the **Manage NuGet Packages** window.

3. Search for `Microsoft Azure Devices`, click **Install**, and accept the terms of use. 

	This downloads, installs, and adds a reference to the [Azure IoT - Service SDK NuGet package].

4. Add the following `using` statement at the top of the **Program.cs** file:

		using Microsoft.Azure.Devices;

5. Add the following fields to the **Program** class. Substitute the placeholder value with the IoT hub connection string from [Get started with IoT Hub]:

		static ServiceClient serviceClient;
        static string connectionString = "{iot hub connection string}";

6. Add the following method to the **Program** class:

		private async static Task SendCloudToDeviceMessageAsync()
        {
            var commandMessage = new Message(Encoding.ASCII.GetBytes("Cloud to device message."));
            await serviceClient.SendAsync("myFirstDevice", commandMessage);
        }

	This method sends a new cloud-to-device message to the device with the ID, `myFirstDevice`. Change this parameter accordingly, in case you modified it from the one used in [Get started with IoT Hub].

7. Finally, add the following lines to the **Main** method:

        Console.WriteLine("Send Cloud-to-Device message\n");
        serviceClient = ServiceClient.CreateFromConnectionString(connectionString);

        Console.WriteLine("Press any key to send a C2D message.");
        Console.ReadLine();
        SendCloudToDeviceMessageAsync().Wait();
        Console.ReadLine();

8. From within Visual Studio, right-click your solution, and select **Set StartUp projects...**. Select **Multiple startup projects**, then select the **Start** action for **ProcessDeviceToCloudMessages**, **SimulatedDevice**, and **SendCloudToDevice**.

9.  Press **F5**. All three applications should start. Select the **SendCloudToDevice** windows, and press **Enter**. You should see the message being received by the simulated app.

    ![App receiving message][21]

## Receive delivery feedback
It is possible to request delivery (or expiration) acknowledgements from IoT Hub for each cloud-to-device message. This enables the cloud back end to easily inform retry or compensation logic. For more information about cloud-to-device feedback, see the [IoT Hub Developer Guide][IoT Hub Developer Guide - C2D].

In this section, you will modify the **SendCloudToDevice** app to request feedback, and receive it from IoT Hub.

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

2. Add the following method in the **Main** method, right after the `serviceClient = ServiceClient.CreateFromConnectionString(connectionString)` line:

        ReceiveFeedbackAsync();

3. To request feedback for the delivery of your cloud-to-device message, you have to specify a property in the **SendCloudToDeviceMessageAsync** method. Add the following line, right after the `var commandMessage = new Message(...);` line:

        commandMessage.Ack = DeliveryAcknowledgement.Full;

4.  Run the apps by pressing **F5**. You should see all three applications start. Select the **SendCloudToDevice** windows, and press **Enter**. You should see the message being received by the simulated app, and after a few seconds, the feedback message being received by your **SendCloudToDevice** application.

    ![App receiving message][22]

> [AZURE.NOTE] For simplicity's sake, this tutorial does not implement any retry policy. In production code, you should implement retry policies (such as exponential backoff), as suggested in the MSDN article [Transient Fault Handling].

## Next steps

In this tutorial, you learned how to send and receive cloud-to-device messages. 

To see examples of complete end-to-end solutions that use IoT Hub, see [Azure IoT Suite].

To learn more about developing solutions with IoT Hub, see the [IoT Hub Developer Guide].

<!-- Images -->
[20]: ./media/iot-hub-csharp-csharp-c2d/create-identity-csharp1.png
[21]: ./media/iot-hub-csharp-csharp-c2d/sendc2d1.png
[22]: ./media/iot-hub-csharp-csharp-c2d/sendc2d2.png

<!-- Links -->

[Azure IoT - Service SDK NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.Devices/
[Transient Fault Handling]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx

[IoT Hub Developer Guide - C2D]: iot-hub-devguide.md#c2d

[IoT Hub Developer Guide]: iot-hub-devguide.md
[Get started with IoT Hub]: iot-hub-csharp-csharp-getstarted.md
[Azure IoT Developer Center]: http://www.azure.com/develop/iot
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[Azure IoT Suite]: https://azure.microsoft.com/documentation/suites/iot-suite/