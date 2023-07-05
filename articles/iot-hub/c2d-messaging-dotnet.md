---
title: Send cloud-to-device messages (.NET)
titleSuffix: Azure IoT Hub
description: How to send cloud-to-device messages from a back-end app and receive them on a device app using the Azure IoT SDKs for .NET.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.devlang: csharp
ms.topic: how-to
ms.date: 05/30/2023
ms.custom: [amqp, mqtt, "Role: Cloud Development", "Role: IoT Device", devx-track-csharp, devx-track-dotnet]
---

# Send cloud-to-device messages with IoT Hub (.NET)

[!INCLUDE [iot-hub-selector-c2d](../../includes/iot-hub-selector-c2d.md)]

Azure IoT Hub is a fully managed service that helps enable reliable and secure bi-directional communications between millions of devices and a solution back end.

This article shows you how to:

* Send cloud-to-device (C2D) messages from your solution backend to a single device through IoT Hub

* Receive cloud-to-device messages on a device

* Request delivery acknowledgment (*feedback*), from your solution backend, for messages sent to a device from IoT Hub

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-whole.md)]

At the end of this article, you run two .NET console apps.

* **MessageReceiveSample**: a sample device app included with the [Microsoft Azure IoT SDK for .NET](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/device/samples), which connects to your IoT hub and receives cloud-to-device messages.

* **SendCloudToDevice**: a service app that sends a cloud-to-device message to the device app through IoT Hub and then receives its delivery acknowledgment.

> [!NOTE]
> IoT Hub has SDK support for many device platforms and languages (C, Java, Python, and JavaScript) through [Azure IoT device SDKs](iot-hub-devguide-sdks.md).

You can find more information on cloud-to-device messages in [D2C and C2D Messaging with IoT Hub](iot-hub-devguide-messaging.md).

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* An IoT hub in your Azure subscription. If you don't have a hub yet, you can follow the steps in [Create an IoT hub](iot-hub-create-through-portal.md).

* A device registered in your IoT hub. If you haven't registered a device yet, register one in the [Azure portal](iot-hub-create-through-portal.md#register-a-new-device-in-the-iot-hub).

* This article uses sample code from the [Azure IoT SDK for C#](https://github.com/Azure/azure-iot-sdk-csharp).

  * Download or clone the SDK repository from GitHub to your development machine.
  * Make sure that .NET Core 3.0.0 or greater is installed on your development machine. Check your version by running `dotnet --version` and [download .NET](https://dotnet.microsoft.com/download) if necessary.

* Make sure that port 8883 is open in your firewall. The device sample in this article uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](../iot/iot-mqtt-connect-to-iot-hub.md#connecting-to-iot-hub).

* Visual Studio.

## Get the device connection string

In this article, you run a sample app that simulates a device, which receives cloud-to-device messages sent through your IoT Hub. The **MessageReceiveSample** sample app included with the [Microsoft Azure IoT SDK for .NET](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/device/samples) connects to your IoT hub and acts as your simulated device. The sample uses the primary connection string of the registered device on your IoT hub. 

[!INCLUDE [iot-hub-include-find-device-connection-string](../../includes/iot-hub-include-find-device-connection-string.md)]

## Receive messages in the device app

In this section, run the **MessageReceiveSample** sample device app to receive C2D messages sent through your IoT hub. Open a new command prompt and navigate to the **azure-iot-sdk-csharp\iothub\device\samples\getting started\MessageReceiveSample** folder, under the folder where you expanded the Azure IoT C# SDK. Run the following commands, replacing the `{Your device connection string}` placeholder value with the device connection string you copied from the registered device in your IoT hub.

```cmd/sh
dotnet restore
dotnet run --c "{Your device connection string}"
```

The following output is from the sample device app after it successfully starts and connects to your IoT hub:
    
```cmd/sh
5/22/2023 11:13:18 AM> Press Control+C at any time to quit the sample.
     
5/22/2023 11:13:18 AM> Device waiting for C2D messages from the hub...
5/22/2023 11:13:18 AM> Use the Azure Portal IoT hub blade or Azure IoT Explorer to send a message to this device.
5/22/2023 11:13:18 AM> Trying to receive C2D messages by polling using the ReceiveAsync() method. Press 'n' to move to the next phase.
```

The sample device app polls for messages by using the [ReceiveAsync](/dotnet/api/microsoft.azure.devices.client.deviceclient.receiveasync) and [CompleteAsync](/dotnet/api/microsoft.azure.devices.client.deviceclient.completeasync) methods. The `ReceiveC2dMessagesPollingAndCompleteAsync` method uses the `ReceiveAsync` method, which asynchronously returns the received message at the time the device receives the message. `ReceiveAsync` returns *null* after a specifiable timeout period. In this example, the default of one minute is used. When the device receives a *null*, it should continue to wait for new messages. This requirement is the reason why the sample app includes the following block of code in the `ReceiveC2dMessagesPollingAndCompleteAsync` method:

```csharp
   if (receivedMessage == null)
   {
      continue;
   }
```

The call to the `CompleteAsync` method notifies IoT Hub that the message has been successfully processed and that the message can be safely removed from the device queue. The device should call this method when its processing successfully completes regardless of the protocol it's using.

With AMQP and HTTPS protocols, but not the [MQTT protocol](../iot/iot-mqtt-connect-to-iot-hub.md), the device can also:

* Abandon a message, which results in IoT Hub retaining the message in the device queue for future consumption.
* Reject a message, which permanently removes the message from the device queue.

If something happens that prevents the device from completing, abandoning, or rejecting the message, IoT Hub will, after a fixed timeout period, queue the message for delivery again. For this reason, the message processing logic in the device app must be *idempotent*, so that receiving the same message multiple times produces the same result.

For more information about the cloud-to-device message lifecycle and how IoT Hub processes cloud-to-device messages, see [Send cloud-to-device messages from an IoT hub](iot-hub-devguide-messages-c2d.md).

> [!NOTE]
> When using HTTPS instead of MQTT or AMQP as a transport, the `ReceiveAsync` method returns immediately. The supported pattern for cloud-to-device messages with HTTPS is intermittently connected devices that check for messages infrequently (a minimum of every 25 minutes). Issuing more HTTPS receives results in IoT Hub throttling the requests. For more information about the differences between MQTT, AMQP, and HTTPS support, see [Cloud-to-device communications guidance](iot-hub-devguide-c2d-guidance.md) and [Choose a communication protocol](iot-hub-devguide-protocols.md).

## Get the IoT hub connection string

In this article, you create a back-end service to send cloud-to-device messages through your IoT Hub. To send cloud-to-device messages, your service needs the **service connect** permission. By default, every IoT Hub is created with a shared access policy named **service** that grants this permission.

[!INCLUDE [iot-hub-include-find-service-connection-string](../../includes/iot-hub-include-find-service-connection-string.md)]

## Send a cloud-to-device message

In this section, you create a .NET console app that sends cloud-to-device messages to the simulated device app. You need the device ID from your device and your IoT hub connection string.

1. In Visual Studio, select **File** > **New** > **Project**. In **Create a new project**, select **Console App (.NET Framework)**, and then select **Next**.

1. Name the project *SendCloudToDevice*, then select **Next**.

   :::image type="content" source="./media/iot-hub-csharp-csharp-c2d/sendcloudtodevice-project-configure.png" alt-text="Screenshot of the 'Configure a new project' popup in Visual Studio." lightbox="./media/iot-hub-csharp-csharp-c2d/sendcloudtodevice-project-configure.png":::

1. Accept the most recent version of the .NET Framework. Select **Create** to create the project.

1. In Solution Explorer, right-click the new project, and then select **Manage NuGet Packages**.

1. In **Manage NuGet Packages**, select **Browse**, and then search for and select **Microsoft.Azure.Devices**. Select  **Install**.

   This step downloads, installs, and adds a reference to the [Azure IoT service SDK NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Devices/).

1. Add the following `using` statement at the top of the **Program.cs** file.

   ``` csharp
   using Microsoft.Azure.Devices;
   ```

1. Add the following fields to the **Program** class. Replace the `{iot hub connection string}` placeholder value with the IoT hub connection string you noted previously in [Get the IoT hub connection string](#get-the-iot-hub-connection-string). Replace the `{device id}` placeholder value with the device ID of the registered device in your IoT hub.

   ``` csharp
   static ServiceClient serviceClient;
   static string connectionString = "{iot hub connection string}";
   static string targetDevice = "{device id}";
   ```

1. Add the following method to the **Program** class to send a message to your device.

   ``` csharp
   private async static Task SendCloudToDeviceMessageAsync()
   {
        var commandMessage = new
         Message(Encoding.ASCII.GetBytes("Cloud to device message."));
        await serviceClient.SendAsync(targetDevice, commandMessage);
   }
   ```

1. Finally, add the following lines to the **Main** method.

   ``` csharp
   Console.WriteLine("Send Cloud-to-Device message\n");
   serviceClient = ServiceClient.CreateFromConnectionString(connectionString);

   Console.WriteLine("Press any key to send a C2D message.");
   Console.ReadLine();
   SendCloudToDeviceMessageAsync().Wait();
   Console.ReadLine();
   ```

1. Press **F5** to start your sample service app. Select the **SendCloudToDevice** window, and press **Enter**. You should see the message received by the sample device app, as shown in the following output example.
 
   ```cmd/sh
   5/22/2023 11:13:18 AM> Press Control+C at any time to quit the sample.
   
   5/22/2023 11:13:18 AM> Device waiting for C2D messages from the hub...
   5/22/2023 11:13:18 AM> Use the Azure Portal IoT hub blade or Azure IoT Explorer to send a message to this device.
   5/22/2023 11:13:18 AM> Trying to receive C2D messages by polling using the ReceiveAsync() method. Press 'n' to move to the next phase.
   5/22/2023 11:15:18 AM> Polling using ReceiveAsync() - received message with Id=
   5/22/2023 11:15:18 AM> Received message: [Cloud to device message.]
           Content type:
   
   5/22/2023 11:15:18 AM> Completed C2D message with Id=.
   ```

## Receive delivery feedback

It's possible to request delivery (or expiration) acknowledgments from IoT Hub for each cloud-to-device message. This option enables the solution back end to easily inform, retry, or compensation logic. For more information about cloud-to-device feedback, see [D2C and C2D Messaging with IoT Hub](iot-hub-devguide-messaging.md).

In this section, you modify the **SendCloudToDevice** sample service app to request feedback, and receive it from the IoT hub.

1. In Visual Studio, in the **SendCloudToDevice** project, add the following method to the **Program** class.

   ```csharp
   private async static void ReceiveFeedbackAsync()
   {
        var feedbackReceiver = serviceClient.GetFeedbackReceiver();

        Console.WriteLine("\nReceiving c2d feedback from service");
        while (true)
        {
            var feedbackBatch = await feedbackReceiver.ReceiveAsync();
            if (feedbackBatch == null) continue;

            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("Received feedback: {0}",
              string.Join(", ", feedbackBatch.Records.Select(f => f.StatusCode)));
            Console.ResetColor();

            await feedbackReceiver.CompleteAsync(feedbackBatch);
        }
    }
    ```

    Note this receive pattern is the same one used to receive cloud-to-device messages from the device app.

1. Add the following line in the **Main** method, right after `serviceClient = ServiceClient.CreateFromConnectionString(connectionString)`.

   ```csharp
   ReceiveFeedbackAsync();
   ```

1. To request feedback for the delivery of your cloud-to-device message, you have to specify a property in the **SendCloudToDeviceMessageAsync** method. Add the following line, right after the `var commandMessage = new Message(...);` line.

   ```csharp
   commandMessage.Ack = DeliveryAcknowledgement.Full;
   ```

1. Make sure the sample device app is running, and then run the sample service app by pressing **F5**. Select the **SendCloudToDevice** console window and press **Enter**. You should see the message being received by the sample device app, and after a few seconds, the feedback message being received by your **SendCloudToDevice** application. The following output shows the feedback message received by the sample service app:

   ```cmd/sh
   Send Cloud-to-Device message
   
   
   Receiving c2d feedback from service
   Press any key to send a C2D message.
   
   Received feedback: Success
   ```

> [!NOTE]
> For simplicity, this article does not implement any retry policy. In production code, you should implement retry policies, such as exponential backoff, as suggested in [Transient fault handling](/azure/architecture/best-practices/transient-faults).
>

## Next steps

In this article, you learned how to send and receive cloud-to-device messages.

* To learn more about cloud-to-device messages, see [Send cloud-to-device messages from an IoT hub](iot-hub-devguide-messages-c2d.md).

* To learn more about IoT Hub message formats, see [Create and read IoT Hub messages](iot-hub-devguide-messages-construct.md).
