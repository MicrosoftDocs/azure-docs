---
title: Routing messages with IoT Hub (Node) | Microsoft Docs
description: How to process IoT Hub device-to-cloud messages by using routing rules and custom endpoints to dispatch messages to other back-end services.
services: iot-hub
documentationcenter: node
author: msebolt
manager: timlt
editor: ''

ms.assetid: bd9af5f9-a740-4780-a2a6-8c0e2752cf48
ms.service: iot-hub
ms.devlang: node
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/17/2017
ms.author: v-masebo

---
# Routing messages with IoT Hub (Node)

[!INCLUDE [iot-hub-selector-process-d2c](../../includes/iot-hub-selector-process-d2c.md)]

This tutorial builds on the ([Get started with IoT Hub] tutorial.  The tutorial:

* Shows you how to use routing rules to dispatch device-to-cloud messages in an easy, configuration-based way.
* Illustrates how to isolate interactive messages that require immediate action from the solution back end for further processing.  For example, a device might send an alarm message that triggers inserting a ticket into a CRM system.  In contrast, data-point messages, such as temperature telemetry, feed into an analytics engine.

At the end of this tutorial, you run three Node.js console apps:

* **SimulatedDevice.js**, a modified version of the app created in the [Get started with IoT Hub] tutorial, sends data-point device-to-cloud messages every second, and interactive device-to-cloud messages per random interval. This app uses the MQTT protocol to communicate with IoT Hub.
* **ReadDeviceToCloudMessages.js** displays the telemetry sent by your device app.
* **ReadCriticalQueue.js** de-queues the critical messages from the Service Bus queue attached to the IoT hub.

> [!NOTE]
> IoT Hub has SDK support for many device platforms and languages, including C, Java, and JavaScript. For instructions on how to replace the device in this tutorial with a physical device, and how to connect devices to an IoT Hub, see the [Azure IoT Developer Center].

To complete this tutorial, you need the following:

* A complete working version of the [Get started with IoT Hub] tutorial.
* Node.js version 4.0.x or later.
* An active Azure account. (If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.)

We also recommend reading about [Azure Storage] and [Azure Service Bus].

## Send interactive messages from a device app
In this section, you modify the device app you created in the [Get started with IoT Hub] tutorial to occasionally send messages that require immediate processing.

1. Use a text editor to open the **simulateddevice\SimulatedDevice.js** file. This file contains the code for the **SimulatedDevice** app you created in the [Get started with IoT Hub] tutorial.

2. Replace the **connectCallback** function with the following code:

    ```nodejs
    var connectCallback = function (err) {
      if (err) {
        console.log('Could not connect: ' + err);
      } else {
        console.log('Client connected');
    
        // Create a message and send it to the IoT Hub every second
        setInterval(function(){
    	var data, message;
    	if (Math.random() > 0.7) {
    		if (Math.random() > 0.5) {
                data = "This is a critical message.";
                message = new Message(data);
                message.properties.add("level", "critical");
	        } else {
	            data = "This is a storage message.";
	            message = new Message(data);
                message.properties.add("level", "storage");
            }
            console.log("Sending message: " + message.getData());
    	}
    	else {
            	var temperature = 20 + (Math.random() * 15);
            	var humidity = 60 + (Math.random() * 20);            
            	data = JSON.stringify({ deviceId: 'myFirstNodeDevice', temperature: temperature, humidity: humidity });
            	message = new Message(data);
            	message.properties.add('temperatureAlert', (temperature > 30) ? 'true' : 'false');
            	console.log("Sending message: " + message.getData());
            }
    	client.sendEvent(message, printResultFor('send'));
        }, 1000);
      }
    };
    ```
   
    This method randomly adds the property `"level": "critical"` and `"level": "storage"` to messages sent by the device, which simulates a message that requires immediate action by the application back-end or one that needs to be permanently stored. The application passes this information in the message properties, instead of in the message body, so that IoT Hub can route the message to the proper message destination.
   
   > [!NOTE]
   > You can use message properties to route messages for various scenarios including cold-path processing, in addition to the hot path example shown here.

2. Save and close the **simulateddevice\SimulatedDevice.js** file.

    > [!NOTE]
    > We strongly recommend that you implement a retry policy such as exponential backoff, as suggested in the MSDN article [Transient Fault Handling].

## Add Service Bus queue to your IoT hub and route messages to it

In this section, you create a Service Bus queue, connect it to your IoT hub, and configure your IoT hub to send messages to the queue based on the presence of a property on the message. For more information about how to process messages from Service Bus queues, see [Get started with queues][lnk-sb-queues-node].

1. Create a Service Bus queue as described in [Get started with queues][lnk-sb-queues-node]. Make a note of the namespace and queue name.

2. In the Azure portal, open your IoT hub and click **Endpoints**.

    ![Endpoints in IoT hub][30]

3. In the **Endpoints** blade, click **Add** at the top to add your queue to your IoT hub. Name the endpoint **CriticalQueue** and use the drop-downs to select **Service Bus queue**, the Service Bus namespace in which your queue resides, and the name of your queue. When you are done, click **OK** at the bottom.  

 > [!NOTE]
   > Depending on your IoT Hub's pricing tier you might be limited to only one **Endpoint**.  If so, skip step 5 and return after completing the tutorial and then replace the **CriticalQueue** with the **StorageQueue** as your single endpoint.

    ![Adding an endpoint][31]

4. Now click **Routes** in your IoT Hub. Click **Add** at the top of the blade to create a routing rule that routes messages to the queue you just added. Select **Device Messages** as the source of data. Enter `level="critical"` as the condition, and choose **CriticalQueue** as a custom endpoint as the routing rule endpoint. Click **Save** at the bottom.  

    ![Adding a route][32]

    Make sure the fallback route is set to **ON**. This setting is the default configuration of an IoT hub.

    ![Fallback route][33]

## (Optional) Read from the queue endpoint

In this section, you create a Node.js console app that reads critical messages from IoT Service Bus. See further information in [Get started with queues][lnk-sb-queues-node]. 

1. Create an empty folder called `readcriticalqueue`. In the `readcriticalqueue` folder, create a package.json file using the following command at your command prompt. Accept all the defaults:

    ```cmd/sh
    npm init
    ```

2. At your command prompt in the `readcriticalqueue` folder, run the following command to install the **azure** package:

    ```cmd/sh
    npm install azure --save
    ```

3. Using a text editor, create a **ReadCriticalQueue.js** file in the `readcriticalqueue` folder.

4. Add the following `require` statements at the start of the **ReadCriticalQueue.js** file:

    ```nodejs
    'use strict';

    var azure = require('azure');
    ```

5. Add the following variable declaration and replace the placeholder values with the IoT Service Bus connection string and queue name:

    ```nodejs
    var connectionString = '{iotservicebus connection string}';
    var queueName = '{iotservice bus queue name}';
    ```

6. Add the following two functions that print output to the console:

    ```nodejs
    var serviceBusService = azure.createServiceBusService(connectionString);

    setInterval(function() {serviceBusService.receiveQueueMessage(queueName, function(error, receivedMessage) {
        if(!error){
            // Message received and deleted
    	    console.log(receivedMessage);
        } else { console.log(error); }
    	});
    }, 3000);
    ```

7. Save and close the **ReadCriticalQueue.js** file.

## Run the applications

Now you are ready to run the three applications.

1. To run the **ReadDeviceToCloudMessages** application, in a command prompt or shell navigate to the readdevicetocloudmessages folder and execute the following command:

   ```cmd/sh
   node ReadDeviceToCloudMessages.js
   ```

   ![Run read-d2c-messages][readd2c]

2. To run the **ReadCriticalQueue** application, in a command prompt or shell navigate to the readcriticalqueue folder and execute the following command:

   ```cmd/sh
   node ReadCriticalQueue.js
   ```
   
   ![Run read-critical-messages][readqueue]

3. To run the **SimulatedDevice** app, in a command prompt or shell navigate to the simulateddevice folder and execute the following command:

   ```cmd/sh
   node SimulatedDevice.js
   ```
   
   ![Run simulated-device][simulateddevice]

1. In the Azure Portal, go to your storage account, under **Blob Service**, click **Browse blobs...**.  Select your container, navigate to and click the JSON file, and click **Download** to view the data.

 > [!NOTE]
   > If you are limited to only one **Endpoint**, only complete this step after re-running the tutorial after replacing the **CriticalQueue** with the **StorageQueue** as your single endpoint.

## (Optional) Read from the storage endpoint

In this section, you create a Storage account, connect it to your IoT hub, and configure your IoT hub to send messages to the queue based on the presence of a property on the message. For more information about how to manage storage, see [Get started with Azure Storage][Azure Storage].

1. Create a Storage account as described in [Azure Storage Documentation][lnk-storage]. Make a note of the account name.

2. In the Azure portal, open your IoT hub and click **Endpoints**.

    ![Endpoints in IoT hub][30]

3. In the **Endpoints** blade, click **Add** at the top to add your queue to your IoT hub. Name the endpoint **StorageQueue** and use the drop-downs to select **Azure Storage Container**, and create a **Storage account** and a **Storage container**.  Make note of the names.  When you are done, click **OK** at the bottom.  

    ![Adding an endpoint][31]

4. Now click **Routes** in your IoT Hub. Click **Add** at the top of the blade to create a routing rule that routes messages to the queue you just added. Select **Device Messages** as the source of data. Enter `level="storage"` as the condition, and choose **StorageQueue** as a custom endpoint as the routing rule endpoint. Click **Save** at the bottom.  

    ![Adding a route][32]

    Make sure the fallback route is set to **ON**. This setting is the default configuration of an IoT hub.

    ![Fallback route][33]

## Next steps

In this tutorial, you learned how to reliably dispatch device-to-cloud messages by using the message routing functionality of IoT Hub.

The [How to send cloud-to-device messages with IoT Hub][lnk-c2d] shows you how to send messages to your devices from your solution back end.

To see examples of complete end-to-end solutions that use IoT Hub, see [Azure IoT Suite][lnk-suite].

To learn more about developing solutions with IoT Hub, see the [IoT Hub developer guide].

To learn more about message routing in IoT Hub, see [Send and receive messages with IoT Hub][lnk-devguide-messaging].

<!-- Images. -->
<!-- TODO: UPDATE PICTURES -->
[simulateddevice]: ./media/iot-hub-node-node-process-d2c/runsimulateddevice.png
[readd2c]: ./media/iot-hub-node-node-process-d2c/runprocessinteractive.png
[readqueue]: ./media/iot-hub-node-node-process-d2c/runprocessd2c.png

[30]: ./media/iot-hub-node-node-process-d2c/click-endpoints.png
[31]: ./media/iot-hub-node-node-process-d2c/endpoint-creation.png
[32]: ./media/iot-hub-node-node-process-d2c/route-creation.png
[33]: ./media/iot-hub-node-node-process-d2c/fallback-route.png

<!-- Links -->

[lnk-sb-queues-node]: ../service-bus-messaging/service-bus-nodejs-how-to-use-queues.md

[Azure Storage]: https://azure.microsoft.com/documentation/services/storage/
[Azure Service Bus]: https://azure.microsoft.com/documentation/services/service-bus/

[IoT Hub developer guide]: iot-hub-devguide.md
[lnk-devguide-messaging]: iot-hub-devguide-messaging.md
[Get started with IoT Hub]: iot-hub-node-node-getstarted.md
[Azure IoT Developer Center]: https://azure.microsoft.com/develop/iot
[Transient Fault Handling]: https://msdn.microsoft.com/library/hh675232.aspx

<!-- Links -->
[Transient Fault Handling]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx

[lnk-c2d]: iot-hub-node-node-c2d.md
[lnk-suite]: https://azure.microsoft.com/documentation/suites/iot-suite/
[lnk-free-trial]: https://azure.microsoft.com/free/
[lnk-storage]: https://docs.microsoft.com/en-us/azure/storage/