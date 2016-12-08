---
title: Process IoT Hub device-to-cloud messages using routes (.Net) | Microsoft Docs
description: Follow this tutorial to learn useful patterns to process IoT Hub device-to-cloud messages.
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
ms.date: 12/12/2016
ms.author: dobett

---
# Tutorial: How to process IoT Hub device-to-cloud messages using routes (.Net)
[!INCLUDE [iot-hub-selector-process-d2c](../../includes/iot-hub-selector-process-d2c.md)]

## Introduction
Azure IoT Hub is a fully managed service that enables reliable and secure bi-directional communications between millions of devices and an application back end. Other tutorials ([Get started with IoT Hub] and [Send cloud-to-device messages with IoT Hub][lnk-c2d]) show you how to use the basic device-to-cloud and cloud-to-device messaging functionality of IoT Hub.

This tutorial builds on the code shown in the [Get started with IoT Hub] tutorial, and it shows how to use message routing to process device-to-cloud messages in a scalable way. The tutorial illustrates how to process messages which require immediate action from the application back end. For example, a device might send an alarm message that triggers inserting a ticket into a CRM system. By contrast, data point messages simply feed into an analytics engine. For example, temperature telemetry from a device that is to be stored for later analysis is a data point message.

At the end of this tutorial, you run three Windows console apps:

* **SimulatedDevice**, a modified version of the app created in the [Get started with IoT Hub] tutorial, sends data point device-to-cloud messages every second, and interactive device-to-cloud messages every 10 seconds. This app uses the AMQP protocol to communicate with IoT Hub.
* **ReadDeviceToCloudMessages** which displays the non-critical telemetry sent by your simulated device app.
* **ReadCriticalQueue** de-queues the critical messages from the Service Bus queue attached to the IoT hub.

> [!NOTE]
> IoT Hub has SDK support for many device platforms and languages, including C, Java, and JavaScript. To learn how to replace the simulated device in this tutorial with a physical device, and how to connect devices to an IoT Hub, see the [Azure IoT Developer Center].
> 
> 

To complete this tutorial, you need the following:

* Microsoft Visual Studio 2015.
* An active Azure account. <br/>If you don't have an account, you can create a [free account](https://azure.microsoft.com/free/) in just a couple of minutes.

You should have some basic knowledge of [Azure Storage] and [Azure Service Bus].

## Send interactive messages from a simulated device app
In this section, you modify the simulated device app you created in the [Get started with IoT Hub] tutorial to occasionally send messages which require immediate processing.

1. In Visual Studio, in the **SimulatedDevice** project, replace the `SendDeviceToCloudMessagesAsync` method with the following code.
   
    ```
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

                if (rand.NextDouble() > 0.7)
                {
                    message = new Message(Encoding.ASCII.GetBytes("This is a critical message"));
                    message.Properties.Add("level", "critical");
                }
                else
                {
                    message.Properties.Add("level", "normal");
                }

                await deviceClient.SendEventAsync(message);
                Console.WriteLine("{0} > Sending message: {1}", DateTime.Now, messageString);

                Task.Delay(1000).Wait();
            }
        }
    ```
   
     This randomly adds the property `"level": "critical"` to messages sent by the simulated device, which simulates a message which requires immediate action by the application back-end. The application passes this information in the message properties, instead of in the message body, so that IoT Hub can route the message to the proper message destination.

   > [!NOTE]
   > You can use message properties to route messages for a variety of scenarios including cold-path processing, in addition to the hot path example shown here.
   > 
   > 
   
   > [!NOTE]
   > For the sake of simplicity, this tutorial does not implement any retry policy. In production code, you should implement a retry policy such as exponential backoff, as suggested in the MSDN article [Transient Fault Handling].
   > 
   > 

## Add a queue to your IoT hub and route messages to it
In this section, you create a Service Bus queue, connect it to your IoT hub, and configure your IoT hub to send messages to the queue based on the presence of a property on the message. For more information about how to process messages from Service Bus queues, see [Get started with queues][Service Bus queue].

1. Create a Service Bus queue as described in [Get started with queues][Service Bus queue]. Make a note of hte namespace and queue name.

2. In the Azure portal, open your IoT hub and click on **Endpoints**.
    
    ![Endpoints in IoT hub][30]

3. In the endpoints blade, click on **Add** at the top to add your queue to your IoT hub. Name the endpoint "CriticalQueue" and use the drop-downs to select **Service Bus queue**, the Service Bus namespace in which your queue resides, and the name of your queue. When you are done, click **Save** at the bottom.
    
    ![Adding an endpoint][31]
    
4. Now click on **Routes** in your IoT Hub. Click on **Add** at the top of the blade to create a rule which routes messages to the queue you just added. Select **DeviceTelemetry** as the source of data. Enter `level="critical"` as the condition, and choose the queue you just added as an endpoint as the route endpoint. When you are done, click **Save** at the bottom.
    
    ![Adding a route][32]
    
    Make sure the fallback route is set to ON. This is the default configuration of the IoT hub.
    
    ![Fallback route][33]

## (Optional) Read from the queue endpoint
You can optionally read the messages from the queue endpoint by following the instructions at [Get started with queues][Service Bus queue]. Name your project **ReadCriticalQueue**.

## Run the applications
Now you are ready to run the applications.

1. In Visual Studio, in Solution Explorer, right-click your solution and select **Set StartUp Projects**. Select **Multiple startup projects**, then select **Start** as the action for the **ReadDeviceToCloudMessages**, **SimulatedDevice**, and **ReadCriticalQueue** projects.
2. Press **F5** to start the three console applications. The **ReadDeviceToCloudMessages** application will have only non-critical messages send from the **SimulatedDevice** application, and the **ReadCriticalQueue** application  will have only critical messages.
   
   ![Three console applications][50]

## Next steps
In this tutorial, you learned how to reliably dispatch device-to-cloud messages by using the message routing functionality of IoT Hub.

The [How to send cloud-to-device messages with IoT Hub][lnk-c2d] shows you how to send messages to your devices from your back end.

To see examples of complete end-to-end solutions that use IoT Hub, see [Azure IoT Suite][lnk-suite].

To learn more about developing solutions with IoT Hub, see the [IoT Hub Developer Guide].

To learn more about message routing in IoT Hub, see [Send and receive messages with IoT Hub][lnk-devguide-messaging].

<!-- Images. -->
[50]: ./media/iot-hub-csharp-csharp-process-d2c/run1.png
[10]: ./media/iot-hub-csharp-csharp-process-d2c/create-identity-csharp1.png

[30]: ./media/iot-hub-csharp-csharp-process-d2c/createqueue2.png
[31]: ./media/iot-hub-csharp-csharp-process-d2c/createqueue3.png
[32]: ./media/iot-hub-csharp-csharp-process-d2c/createqueue4.png

<!-- Links -->

[Azure blob storage]: ../storage/storage-dotnet-how-to-use-blobs.md
[Azure Data Factory]: https://azure.microsoft.com/documentation/services/data-factory/
[HDInsight (Hadoop)]: https://azure.microsoft.com/documentation/services/hdinsight/
[Service Bus queue]: ../service-bus-messaging/service-bus-dotnet-get-started-with-queues.md

[Azure IoT Hub developer guide - Device to cloud]: iot-hub-devguide-messaging.md

[Azure Storage]: https://azure.microsoft.com/documentation/services/storage/
[Azure Service Bus]: https://azure.microsoft.com/documentation/services/service-bus/

[IoT Hub Developer Guide]: iot-hub-devguide.md
[Get started with IoT Hub]: iot-hub-csharp-csharp-getstarted.md
[lnk-devguide-messaging]: iot-hub-devguide-messaging.md
[Azure IoT Developer Center]: https://azure.microsoft.com/develop/iot
[lnk-service-fabric]: https://azure.microsoft.com/documentation/services/service-fabric/
[lnk-stream-analytics]: https://azure.microsoft.com/documentation/services/stream-analytics/
[lnk-event-hubs]: https://azure.microsoft.com/documentation/services/event-hubs/
[Transient Fault Handling]: https://msdn.microsoft.com/library/hh675232.aspx

<!-- Links -->
[About Azure Storage]: ../storage/storage-create-storage-account.md#create-a-storage-account
[Get Started with Event Hubs]: ../event-hubs/event-hubs-csharp-ephcs-getstarted.md
[Azure Storage scalability Guidelines]: ../storage/storage-scalability-targets.md
[Azure Block Blobs]: https://msdn.microsoft.com/library/azure/ee691964.aspx
[Event Hubs]: ../event-hubs/event-hubs-overview.md
[EventProcessorHost]: http://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventprocessorhost(v=azure.95).aspx
[Event Hubs Programming Guide]: ../event-hubs/event-hubs-programming-guide.md
[Transient Fault Handling]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx
[Build multi-tier applications with Service Bus]: ../service-bus-messaging/service-bus-dotnet-multi-tier-app-using-service-bus-queues.md

[lnk-classic-portal]: https://manage.windowsazure.com
[lnk-c2d]: iot-hub-csharp-csharp-process-d2c.md
[lnk-suite]: https://azure.microsoft.com/documentation/suites/iot-suite/
