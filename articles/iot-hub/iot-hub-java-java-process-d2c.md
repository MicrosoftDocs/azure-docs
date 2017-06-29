---
title: Process Azure IoT Hub device-to-cloud messages (Java) | Microsoft Docs
description: How to process IoT Hub device-to-cloud messages by using routing rules and custom endpoints to dispatch messages to other back-end services.
services: iot-hub
documentationcenter: java
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: bd9af5f9-a740-4780-a2a6-8c0e2752cf48
ms.service: iot-hub
ms.devlang: java
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/29/2017
ms.author: dobett

---
# Process IoT Hub device-to-cloud messages (Java)

[!INCLUDE [iot-hub-selector-process-d2c](../../includes/iot-hub-selector-process-d2c.md)]

Azure IoT Hub is a fully managed service that enables reliable and secure bi-directional communications between millions of devices and a solution back end. Other tutorials ([Get started with IoT Hub] and [Send cloud-to-device messages with IoT Hub][lnk-c2d]) show you how to use the basic device-to-cloud and cloud-to-device messaging functionality of IoT Hub.

This tutorial builds on the code shown in the [Get started with IoT Hub] tutorial, and shows you how to use message routing to process device-to-cloud messages in a scalable way. The tutorial illustrates how to process messages that require immediate action from the solution back end. For example, a device might send an alarm message that triggers inserting a ticket into a CRM system. By contrast, data-point messages simply feed into an analytics engine. For example, temperature telemetry from a device that is to be stored for later analysis is a data-point message.

At the end of this tutorial, you run three Java console apps:

* **simulated-device**, a modified version of the app created in the [Get started with IoT Hub] tutorial, sends data-point device-to-cloud messages every second, and interactive device-to-cloud messages every 10 seconds. This app uses the AMQP protocol to communicate with IoT Hub.
* **read-d2c-messages** displays the telemetry sent by your simulated device app.
* **read-critical-queue** de-queues the critical messages from the Service Bus queue attached to the IoT hub.

> [!NOTE]
> IoT Hub has SDK support for many device platforms and languages, including C, Java, and JavaScript. For instructions on how to replace the simulated device in this tutorial with a physical device, and how to connect devices to an IoT Hub, see the [Azure IoT Developer Center].

To complete this tutorial, you need the following:

* A complete working version of the [Get started with IoT Hub] tutorial.
* The latest [Java SE Development Kit 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) 
* [Maven 3](https://maven.apache.org/install.html) 
* An active Azure account. (If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.)

You should have some basic knowledge of [Azure Storage] and [Azure Service Bus].

## Send interactive messages from a simulated device app

In this section, you modify the simulated device app you created in the [Get started with IoT Hub] tutorial to occasionally send messages that require immediate processing.

1. Use a text editor to open the simulated-device\src\main\java\com\mycompany\app\App.java file. This file contains the code for the **simulated-device** app you created in the [Get started with IoT Hub] tutorial.

2. Replace the **MessageSender** class with the following code:

    ```java
    private static class MessageSender implements Runnable {

        public void run()  {
            try {
                double minTemperature = 20;
                double minHumidity = 60;
                Random rand = new Random();

                while (true) {
                    String msgStr;
                    Message msg;
                    if (new Random().nextDouble() > 0.7) {
                        msgStr = "This is a critical message.";
                        msg = new Message(msgStr);
                        msg.setProperty("level", "critical");
                    } else {
                        double currentTemperature = minTemperature + rand.nextDouble() * 15;
                        double currentHumidity = minHumidity + rand.nextDouble() * 20; 
                        TelemetryDataPoint telemetryDataPoint = new TelemetryDataPoint();
                        telemetryDataPoint.deviceId = deviceId;
                        telemetryDataPoint.temperature = currentTemperature;
                        telemetryDataPoint.humidity = currentHumidity;

                        msgStr = telemetryDataPoint.serialize();
                        msg = new Message(msgStr);
                    }
                    
                    System.out.println("Sending: " + msgStr);

                    Object lockobj = new Object();
                    EventCallback callback = new EventCallback();
                    client.sendEventAsync(msg, callback, lockobj);

                    synchronized (lockobj) {
                        lockobj.wait();
                    }
                    Thread.sleep(1000);
                }
            } catch (InterruptedException e) {
                System.out.println("Finished.");
            }
        }
    }
    ```

    This method randomly adds the property `"level": "critical"` to messages sent by the simulated device, which simulates a message that requires immediate action by the application back-end. The application passes this information in the message properties, instead of in the message body, so that IoT Hub can route the message to the proper message destination.

    > [!NOTE]
    > You can use message properties to route messages for various scenarios including cold-path processing, in addition to the hot path example shown here.

2. Save and close the simulated-device\src\main\java\com\mycompany\app\App.java file.

    > [!NOTE]
    > For the sake of simplicity, this tutorial does not implement any retry policy. In production code, you should implement a retry policy such as exponential backoff, as suggested in the MSDN article [Transient Fault Handling].

3. To build the **simulated-device** app using Maven, execute the following command at the command prompt in the simulated-device folder:

    ```cmd/sh
    mvn clean package -DskipTests
    ```

## Add a queue to your IoT hub and route messages to it

In this section, you create a Service Bus queue, connect it to your IoT hub, and configure your IoT hub to send messages to the queue based on the presence of a property on the message. For more information about how to process messages from Service Bus queues, see [Get started with queues][lnk-sb-queues-java].

1. Create a Service Bus queue as described in [Get started with queues][lnk-sb-queues-java]. Make a note of the namespace and queue name.

2. In the Azure portal, open your IoT hub and click **Endpoints**.

    ![Endpoints in IoT hub][30]

3. In the **Endpoints** blade, click **Add** at the top to add your queue to your IoT hub. Name the endpoint **CriticalQueue** and use the drop-downs to select **Service Bus queue**, the Service Bus namespace in which your queue resides, and the name of your queue. When you are done, click **Save** at the bottom.

    ![Adding an endpoint][31]

4. Now click **Routes** in your IoT Hub. Click **Add** at the top of the blade to create a routing rule that routes messages to the queue you just added. Select **DeviceTelemetry** as the source of data. Enter `level="critical"` as the condition, and choose the queue you just added as a custom endpoint as the routing rule endpoint. When you are done, click **Save** at the bottom.

    ![Adding a route][32]

    Make sure the fallback route is set to **ON**. This setting is the default configuration of an IoT hub.

    ![Fallback route][33]

## (Optional) Read from the queue endpoint

You can optionally read the messages from the queue endpoint by following the instructions in [Get started with queues][lnk-sb-queues-java]. Name the app **read-critical-queue**.

## Run the applications

Now you are ready to run the three applications.

1. To run the **read-d2c-messages** application, in a command prompt or shell navigate to the read-d2c folder and execute the following command:

   ```cmd/sh
   mvn exec:java -Dexec.mainClass="com.mycompany.app.App"
   ```

   ![Run read-d2c-messages][readd2c]

2. To run the **read-critical-queue** application, in a command prompt or shell navigate to the read-critical-queue folder and execute the following command:

   ```cmd/sh
   mvn exec:java -Dexec.mainClass="com.mycompany.app.App"
   ```
   
   ![Run read-critical-messages][readqueue]

3. To run the **simulated-device** app, in a command prompt or shell navigate to the simulated-device folder and execute the following command:

   ```cmd/sh
   mvn exec:java -Dexec.mainClass="com.mycompany.app.App"
   ```
   
   ![Run simulated-device][simulateddevice]

## Next steps

In this tutorial, you learned how to reliably dispatch device-to-cloud messages by using the message routing functionality of IoT Hub.

The [How to send cloud-to-device messages with IoT Hub][lnk-c2d] shows you how to send messages to your devices from your solution back end.

To see examples of complete end-to-end solutions that use IoT Hub, see [Azure IoT Suite][lnk-suite].

To learn more about developing solutions with IoT Hub, see the [IoT Hub developer guide].

To learn more about message routing in IoT Hub, see [Send and receive messages with IoT Hub][lnk-devguide-messaging].

<!-- Images. -->
<!-- TODO: UPDATE PICTURES -->
[simulateddevice]: ./media/iot-hub-java-java-process-d2c/runsimulateddevice.png
[readd2c]: ./media/iot-hub-java-java-process-d2c/runprocessinteractive.png
[readqueue]: ./media/iot-hub-java-java-process-d2c/runprocessd2c.png

[30]: ./media/iot-hub-java-java-process-d2c/click-endpoints.png
[31]: ./media/iot-hub-java-java-process-d2c/endpoint-creation.png
[32]: ./media/iot-hub-java-java-process-d2c/route-creation.png
[33]: ./media/iot-hub-java-java-process-d2c/fallback-route.png

<!-- Links -->

[lnk-sb-queues-java]: ../service-bus-messaging/service-bus-java-how-to-use-queues.md

[Azure Storage]: https://azure.microsoft.com/documentation/services/storage/
[Azure Service Bus]: https://azure.microsoft.com/documentation/services/service-bus/

[IoT Hub developer guide]: iot-hub-devguide.md
[lnk-devguide-messaging]: iot-hub-devguide-messaging.md
[Get started with IoT Hub]: iot-hub-java-java-getstarted.md
[Azure IoT Developer Center]: https://azure.microsoft.com/develop/iot
[Transient Fault Handling]: https://msdn.microsoft.com/library/hh675232.aspx

<!-- Links -->
[Transient Fault Handling]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx

[lnk-c2d]: iot-hub-java-java-c2d.md
[lnk-suite]: https://azure.microsoft.com/documentation/suites/iot-suite/
