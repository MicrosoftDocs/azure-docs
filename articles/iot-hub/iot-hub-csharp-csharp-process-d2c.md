---
title: Routing messages with Azure IoT Hub (.Net) | Microsoft Docs
description: How to process Azure IoT Hub device-to-cloud messages by using routing rules and custom endpoints to dispatch messages to other back-end services.
services: iot-hub
documentationcenter: .net
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 5177bac9-722f-47ef-8a14-b201142ba4bc
ms.service: iot-hub
ms.devlang: csharp
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/25/2017
ms.author: dobett

---
# Routing messages with IoT Hub (.NET)

[!INCLUDE [iot-hub-selector-process-d2c](../../includes/iot-hub-selector-process-d2c.md)]

This tutorial builds on the [Get started with IoT Hub] tutorial. The tutorial:

* Shows you how to use routing rules to dispatch device-to-cloud messages in an easy, configuration-based way.
* Illustrates how to isolate interactive messages that require immediate action from the solution back end for further processing. For example, a device might send an alarm message that triggers inserting a ticket into a CRM system. In contrast, data-point messages, such as temperature telemetry, feed into an analytics engine.

At the end of this tutorial, you run three .NET console apps:

* **SimulatedDevice**, a modified version of the app created in the [Get started with IoT Hub] tutorial sends data-point device-to-cloud messages every second, and interactive device-to-cloud messages every 10 seconds.
* **ReadDeviceToCloudMessages** that displays the non-critical telemetry sent by your device app.
* **ReadCriticalQueue** de-queues the critical messages sent by your device app from a Service Bus queue. This queue is attached to the IoT hub.

> [!NOTE]
> IoT Hub has SDK support for many device platforms and languages, including C, Java, and JavaScript. To learn how to replace the simulated device in this tutorial with a physical device, see the [Azure IoT Developer Center].

To complete this tutorial, you need the following:

* Visual Studio 2015 or Visual Studio 2017.
* An active Azure account. <br/>If you don't have an account, you can create a [free account](https://azure.microsoft.com/free/) in just a couple of minutes.

We also recommend reading about [Azure Storage] and [Azure Service Bus].

## Send interactive messages

Modify the device app you created in the [Get started with IoT Hub] tutorial to occasionally send interactive messages.

In Visual Studio, in the **SimulatedDevice** project, replace the `SendDeviceToCloudMessagesAsync` method with the following code:

```csharp
private static async void SendDeviceToCloudMessagesAsync()
{
    double minTemperature = 20;
    double minHumidity = 60;
    Random rand = new Random();

    while (true)
    {
        double currentTemperature = minTemperature + rand.NextDouble() * 15;
        double currentHumidity = minHumidity + rand.NextDouble() * 20;

        var telemetryDataPoint = new
        {
            deviceId = "myFirstDevice",
            temperature = currentTemperature,
            humidity = currentHumidity
        };
        var messageString = JsonConvert.SerializeObject(telemetryDataPoint);
        string levelValue;

        if (rand.NextDouble() > 0.7)
        {
            if (rand.NextDouble() > 0.5)
            {
                messageString = "This is a critical message";
                levelValue = "critical";
            }
            else 
            {
                messageString = "This is a storage message";
                levelValue = "storage";
            }
        }
        else
        {
            levelValue = "normal";
        }
        
        var message = new Message(Encoding.ASCII.GetBytes(messageString));
        message.Properties.Add("level", levelValue);
        
        await deviceClient.SendEventAsync(message);
        Console.WriteLine("{0} > Sent message: {1}", DateTime.Now, messageString);

        await Task.Delay(1000);
    }
}
```

This method randomly adds the property `"level": "critical"` and `"level": "storage"` to messages sent by the device, which simulates a message that requires immediate action by the application back-end or one that needs to be permanently stored. The application supports routing messages based on message body.

> [!NOTE]
> You can use message properties to route messages for various scenarios including cold-path processing, in addition to the hot-path example shown here.

> [!NOTE]
> We strongly recommend that you implement a retry policy such as exponential backoff, as suggested in the MSDN article [Transient Fault Handling].

## Route messages to a queue in your IoT hub

In this section, you:

* Create a Service Bus queue.
* Connect it to your IoT hub.
* Configure your IoT hub to send messages to the queue based on the presence of a property on the message.

For more information about how to process messages from Service Bus queues, see [Get started with queues][Service Bus queue].

1. Create a Service Bus queue as described in [Get started with queues][Service Bus queue]. The queue must be in the same subscription and region as your IoT hub. Make a note of the namespace and queue name.

    > [!NOTE]
    > Service Bus queues and topics used as IoT Hub endpoints must not have **Sessions** or **Duplicate Detection** enabled. If either of those options are enabled, the endpoint appears as **Unreachable** in the Azure portal.

2. In the Azure portal, open your IoT hub and click **Endpoints**.
    
    ![Endpoints in IoT hub][30]

3. In the **Endpoints** blade, click **Add** at the top to add your queue to your IoT hub. Name the endpoint **CriticalQueue** and use the drop-downs to select **Service Bus queue**, the Service Bus namespace in which your queue resides, and the name of your queue. When you are done, click **Save** at the bottom.
    
    ![Adding an endpoint][31]
    
4. Now click **Routes** in your IoT Hub. Click **Add** at the top of the blade to create a routing rule that routes messages to the queue you just added. Select **DeviceTelemetry** as the source of data. Enter `level="critical"` as the condition, and choose the queue you just added as a custom endpoint as the routing rule endpoint. When you are done, click **Save** at the bottom.
    
    ![Adding a route][32]
    
    Make sure the fallback route is set to **ON**. This value is the default configuration for an IoT hub.
    
    ![Fallback route][33]

## Read from the queue endpoint

In this section, you read the messages from the queue endpoint.

1. In Visual Studio, add a Visual C# Windows Classic Desktop project to the current solution, by using the **Console App (.NET Framework)** project template. Name the project **ReadCriticalQueue**.

2. In Solution Explorer, right-click the **ReadCriticalQueue** project, and then click **Manage NuGet Packages**. This operation displays the **NuGet Package Manager** window.

3. Search for **WindowsAzure.ServiceBus**, click **Install**, and accept the terms of use. This operation downloads, installs, and adds a reference to the Azure Service Bus, with all its dependencies.

4. Add the following **using** statements at the top of the **Program.cs** file:
   
    ```csharp
    using System.IO;
    using Microsoft.ServiceBus.Messaging;
    ```

5. Finally, add the following lines to the **Main** method. Substitute the connection string with **Listen** permissions for the queue:
   
    ```csharp
    Console.WriteLine("Receive critical messages. Ctrl-C to exit.\n");
    var connectionString = "{service bus listen string}";
    var queueName = "{queue name}";
    
    var client = QueueClient.CreateFromConnectionString(connectionString, queueName);

    client.OnMessage(message =>
        {
            Stream stream = message.GetBody<Stream>();
            StreamReader reader = new StreamReader(stream, Encoding.ASCII);
            string s = reader.ReadToEnd();
            Console.WriteLine(String.Format("Message body: {0}", s));
        });
        
    Console.ReadLine();
    ```

## Run the applications
Now you are ready to run the applications.

1. In Visual Studio, in Solution Explorer, right-click your solution and select **Set StartUp Projects**. Select **Multiple startup projects**, then select **Start** as the action for the **ReadDeviceToCloudMessages**, **SimulatedDevice**, and **ReadCriticalQueue** projects.
2. Press **F5** to start the three console apps. The **ReadDeviceToCloudMessages** app has only non-critical messages sent from the **SimulatedDevice** application, and the **ReadCriticalQueue** app has only critical messages.
   
   ![Three console apps][50]

## (Optional) Add Storage Container to your IoT hub and route messages to it

In this section, you create a Storage account, connect it to your IoT hub, and configure your IoT hub to send messages to the account based on the presence of a property on the message. For more information about how to manage storage, see [Get started with Azure Storage][Azure Storage].

 > [!NOTE]
   > If you are not limited to one **Endpoint**, you may setup the **StorageContainer** in addition to the **CriticalQueue** and run both simulatneously.

1. Create a Storage account as described in [Azure Storage Documentation][lnk-storage]. Make a note of the account name.

2. In the Azure portal, open your IoT hub and click **Endpoints**.

3. In the **Endpoints** blade, select the **CriticalQueue** endpoint, and click **Delete**. Click **Yes**, and then click **Add**. Name the endpoint **StorageContainer** and use the drop-downs to select **Azure Storage Container**, and create a **Storage account** and a **Storage container**.  Make note of the names.  When you are done, click **OK** at the bottom. 

 > [!NOTE]
   > If you are not limited to one **Endpoint**, you do not need to delete the **CriticalQueue**.

4. Click **Routes** in your IoT Hub. Click **Add** at the top of the blade to create a routing rule that routes messages to the queue you just added. Select **Device Messages** as the source of data. Enter `level="storage"` as the condition, and choose **StorageContainer** as a custom endpoint as the routing rule endpoint. Click **Save** at the bottom.  

    Make sure the fallback route is set to **ON**. This setting is the default configuration of an IoT hub.

1. Make sure your previous applications are still running. 

1. In the Azure Portal, go to your storage account, under **Blob Service**, click **Browse blobs...**.  Select your container, navigate to and click the JSON file, and click **Download** to view the data.

## Next steps
In this tutorial, you learned how to reliably dispatch device-to-cloud messages by using the message routing functionality of IoT Hub.

The [How to send cloud-to-device messages with IoT Hub][lnk-c2d] shows you how to send messages to your devices from your solution back end.

To see examples of complete end-to-end solutions that use IoT Hub, see [Azure IoT Suite][lnk-suite].

To learn more about developing solutions with IoT Hub, see the [IoT Hub developer guide].

To learn more about message routing in IoT Hub, see [Send and receive messages with IoT Hub][lnk-devguide-messaging].

<!-- Images. -->
[50]: ./media/iot-hub-csharp-csharp-process-d2c/run1.png
[30]: ./media/iot-hub-csharp-csharp-process-d2c/click-endpoints.png
[31]: ./media/iot-hub-csharp-csharp-process-d2c/endpoint-creation.png
[32]: ./media/iot-hub-csharp-csharp-process-d2c/route-creation.png
[33]: ./media/iot-hub-csharp-csharp-process-d2c/fallback-route.png

<!-- Links -->
[Service Bus queue]: ../service-bus-messaging/service-bus-dotnet-get-started-with-queues.md
[Azure Storage]: https://azure.microsoft.com/documentation/services/storage/
[Azure Service Bus]: https://azure.microsoft.com/documentation/services/service-bus/
[IoT Hub developer guide]: iot-hub-devguide.md
[Get started with IoT Hub]: iot-hub-csharp-csharp-getstarted.md
[lnk-devguide-messaging]: iot-hub-devguide-messaging.md
[Azure IoT Developer Center]: https://azure.microsoft.com/develop/iot
[Transient Fault Handling]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx
[lnk-c2d]: iot-hub-csharp-csharp-c2d.md
[lnk-suite]: https://azure.microsoft.com/documentation/suites/iot-suite/
