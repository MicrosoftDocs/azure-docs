---
title: Routing messages with Azure IoT Hub (Python) | Microsoft Docs
description: How to process Azure IoT Hub device-to-cloud messages by using routing rules and custom endpoints to dispatch messages to other back-end services.
services: iot-hub
documentationcenter: python
author: kgremban
manager: timlt
editor: ''

ms.assetid: bd9af5f9-a740-4780-a2a6-8c0e2752cf48
ms.service: iot-hub
ms.devlang: python
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/22/2018
ms.author: v-masebo;kgremban

---
# Routing messages with IoT Hub (Python)

[!INCLUDE [iot-hub-selector-process-d2c](../../includes/iot-hub-selector-process-d2c.md)]

This tutorial builds on the [Get started with IoT Hub] tutorial.  The tutorial:

* Shows you how to use routing rules to dispatch device-to-cloud messages in an easy, configuration-based way.
* Illustrates how to isolate interactive messages that require immediate action from the solution back end for further processing.  For example, a device might send an alarm message that triggers inserting a ticket into a CRM system.  In contrast, data-point messages, such as temperature telemetry, feed into an analytics engine.

At the end of this tutorial, you run three Python console apps:

* **SimulatedDevice.py**, a modified version of the app created in the [Get started with IoT Hub] tutorial, sends data-point device-to-cloud messages every second, and interactive device-to-cloud messages per random interval. This app uses the MQTT protocol to communicate with IoT Hub.
* **ReadCriticalQueue.py** de-queues the critical messages from the Service Bus queue attached to the IoT hub.

> [!NOTE]
> IoT Hub has SDK support for many device platforms and languages, including C, Java, and JavaScript. For instructions on how to replace the device in this tutorial with a physical device, and how to connect devices to an IoT Hub, see the [Azure IoT Developer Center].

To complete this tutorial, you need the following:

* A complete working version of the [Get started with IoT Hub] tutorial.
* [Python 2.x or 3.x][lnk-python-download]. Make sure to use the 32-bit or 64-bit installation as required by your setup. When prompted during the installation, make sure to add Python to your platform-specific environment variable. If you are using Python 2.x, you may need to [install or upgrade *pip*, the Python package management system][lnk-install-pip].
* If you are using Windows OS, then [Visual C++ redistributable package][lnk-visual-c-redist] to allow the use of native DLLs from Python.
* [Node.js 4.0 or later][lnk-node-download]. Make sure to use the 32-bit or 64-bit installation as required by your setup. This is needed to install the [IoT Hub Explorer tool][lnk-iot-hub-explorer].
* An active Azure account. (If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.)

We also recommend reading about [Azure Storage] and [Azure Service Bus].


## Send interactive messages from a device app
In this section, you modify the device app you created in the [Get started with IoT Hub] tutorial to occasionally send messages that require immediate processing.

1. Use a text editor to open the **SimulatedDevice.py** file. This file contains the code for the **SimulatedDevice** app you created in the [Get started with IoT Hub] tutorial.

2. Replace the **iothub_client_telemetry_sample_run** function with the following code:

    ```python
    def iothub_client_telemetry_sample_run():

    try:
        client = iothub_client_init()
        print ( "IoT Hub device sending periodic messages, press Ctrl-C to exit" )
        message_counter = 0

        while True:
            random_seed = random.random()
            msg_txt_formatted = MSG_TXT % (AVG_WIND_SPEED + (random_seed * 4 + 2))
            # messages can be encoded as string or bytearray
            if (message_counter & 1) == 1:
                message = IoTHubMessage(bytearray(msg_txt_formatted, 'utf8'))
            else:
                message = IoTHubMessage(msg_txt_formatted)
            # optional: assign ids
            message.message_id = "message_%d" % message_counter
            message.correlation_id = "correlation_%d" % message_counter
            # optional: assign properties
            prop_map = message.properties()
            if random_seed > .5:
                if random_seed > .8:
                    prop_map.add("level", 'critical')
                else:
                    prop_map.add("level", 'storage')

            client.send_event_async(message, send_confirmation_callback, message_counter)
            print ( "IoTHubClient.send_event_async accepted message [%d] for transmission to IoT Hub." % message_counter )

            status = client.get_send_status()
            print ( "Send status: %s" % status )
            time.sleep(30)

            status = client.get_send_status()
            print ( "Send status: %s" % status )

            message_counter += 1

    except IoTHubError as iothub_error:
        print ( "Unexpected error %s from IoTHub" % iothub_error )
        return
    except KeyboardInterrupt:
        print ( "IoTHubClient sample stopped" )
    ```
   
    This method randomly adds the property `"level": "critical"` and `"level": "storage"` to messages sent by the device, which simulates a message that requires immediate action by the application back-end or one that needs to be permanently stored. The application supports routing messages based on message body.
   
   > [!NOTE]
   > You can use message properties to route messages for various scenarios including cold-path processing, in addition to the hot path example shown here.

1. Save and close the **SimulatedDevice.py** file.

    > [!NOTE]
    > For the sake of simplicity, this tutorial does not implement any retry policy. In production code, you should implement a retry policy such as exponential backoff, as suggested in the MSDN article [Transient Fault Handling].


## Add queues to your IoT hub and route messages to them

In this section, you create both a Service Bus queue and a Storage account, connect them to your IoT hub, and configure your IoT hub to send messages to the queue based on the presence of a property on the message and all messages to the Storage account. For more information about how to process messages from Service Bus queues, see [Get started with queues][lnk-sb-queues-node] and how to manage storage, see [Get started with Azure Storage][Azure Storage].

1. Create a Service Bus queue as described in [Get started with queues][lnk-sb-queues-node]. Make a note of the namespace and queue name.

    > [!NOTE]
    > Service Bus queues and topics used as IoT Hub endpoints must not have **Sessions** or **Duplicate Detection** enabled. If either of those options are enabled, the endpoint appears as **Unreachable** in the Azure portal.

1. In the Azure portal, open your IoT hub and click **Endpoints**.

    ![Endpoints in IoT hub][30]

1. In the **Endpoints** blade, click **Add** at the top to add your queue to your IoT hub. Name the endpoint **CriticalQueue** and use the drop-downs to select **Service Bus queue**, the Service Bus namespace in which your queue resides, and the name of your queue. When you are done, click **OK** at the bottom.  

    ![Adding an endpoint][31]

1. Now click **Routes** in your IoT Hub. Click **Add** at the top of the blade to create a routing rule that routes messages to the queue you just added. 

    ![Adding a route][34]

    Enter a name and select **Device Messages** as the source of data. Choose **CriticalQueue** as a custom endpoint as the routing rule endpoint and enter `level="critical"` as the query string. Click **Save** at the bottom.

    ![Route details][32]

    Make sure the fallback route is set to **ON**. This setting is the default configuration of an IoT hub.

    ![Fallback route][33]

## (Optional) Read from the queue endpoint

In this section, you create a Python console app that reads critical messages from IoT Service Bus. See further information in [Get started with queues][lnk-sb-queues-node]. 

1. Open a new command prompt and install the Azure IoT Hub Device SDK for Python as follows. Close the command prompt after the installation.

    ```cmd/sh
    pip install azure-servicebus
    ```

    > [!NOTE]
    > For issues installing the **azure-servicebus** package or for further installation options see the [Python azure-servicebus package][lnk-python-service-bus].

1. Create a file named **ReadCriticalQueue.py**. Open this file in a Python editor/IDE of your choice (for example, IDLE).

1. Add the following code to import the required modules from the device SDK:

    ```python
    from azure.servicebus import ServiceBusService, Message, Queue
    ```

1. Add the following code and replace the placeholders with connection data for your service bus:

    ```python
    SERVICE_BUS_NAME = {serviceBusName}
    SHARED_ACCESS_POLICY_NAME = {sharedAccessPolicyName}
    SHARED_ACCESS_POLICY_KEY_VALUE = {sharedAccessPolicyKeyValue}
    QUEUE_NAME = {queueName}    
    ```

5. Add the following code to connect to and read the service bus: 

    ```python
    def setup_client():
        bus_service = ServiceBusService(
        service_namespace=SERVICE_BUS_NAME,
        shared_access_key_name=SHARED_ACCESS_POLICY_NAME,
        shared_access_key_value=SHARED_ACCESS_POLICY_KEY_VALUE)

        while True:
            msg = bus_service.receive_queue_message(QUEUE_NAME, peek_lock=False)
            print(msg.body)
    ```

1. Finally, add the main function. 

    ```python
    if __name__ == '__main__':
        setup_client()
    ```

1. Save and close the **ReadCriticalQueue.py** file. You are now ready to run the applications.


## Run the applications

Now you are ready to run the applications.

1. Open a command prompt and install the IoT Hub Explorer. 

    ```cmd/sh
    npm install -g iothub-explorer
    ```

1. Run the following command on the command prompt, to begin monitoring the device-to-cloud messages from your device. Use your IoT hub's connection string in the placeholder after `--login`.

    ```cmd/sh
    iothub-explorer monitor-events [deviceId] --login "[IoTHub connection string]"
    ```

1. Open a new command prompt and navigate to the directory containing the **SimulatedDevice.py** file.

1. Run the **SimulatedDevice.py** file, which periodically sends telemetry data to your IoT hub. 
   
    ```cmd/sh
    python SimulatedDevice.py
    ```

1. To run the **ReadCriticalQueue** application, in a command prompt or shell navigate to **ReadCriticalQueue.py** file and execute the following command:

   ```cmd/sh
   python ReadCriticalQueue.py
   ```

1. Observe the device messages on the command prompt running the IoT Hub Explorer from the previous section. Observe the `critical` messages in the **ReadCriticalQueue** application.

    ![Python device-to-cloud messages][2]


## (Optional) Add Storage Container to your IoT hub and route messages to it

In this section, you create a Storage account, connect it to your IoT hub, and configure your IoT hub to send messages to the account based on the presence of a property on the message. For more information about how to manage storage, see [Get started with Azure Storage][Azure Storage].

 > [!NOTE]
   > IoT Hub accounts created under the _F1 Free_ tier are limited to one **Endpoint**. If you are not limited to one **Endpoint**, you may setup the **StorageContainer** in addition to the **CriticalQueue** and run both simulatneously.

1. Create a Storage account as described in [Azure Storage Documentation][lnk-storage]. Make a note of the account name.

2. In the Azure portal, open your IoT hub and click **Endpoints**.

3. In the **Endpoints** blade, select the **CriticalQueue** endpoint, and click **Delete**. Click **Yes**, and then click **Add**. Name the endpoint **StorageContainer** and use the drop-downs to select **Azure Storage Container**, and create a **Storage account** and a **Storage container**.  Make note of the names.  When you are done, click **OK** at the bottom. 

 > [!NOTE]
   > IoT Hub accounts created under the _F1 Free_ tier are limited to one **Endpoint**. If you are not limited to one **Endpoint**, you do not need to delete the **CriticalQueue**.

4. Click **Routes** in your IoT Hub. Click **Add** at the top of the blade to create a routing rule that routes messages to the queue you just added. Select **Device Messages** as the source of data. Enter `level="storage"` as the condition, and choose **StorageContainer** as a custom endpoint as the routing rule endpoint. Click **Save** at the bottom.  

    Make sure the fallback route is set to **ON**. This setting is the default configuration of an IoT hub.

1. Make sure your previous application **SimulatedDevice.py** is still running. 

1. In the Azure Portal, go to your storage account, under **Blob Service**, click **Browse blobs...**.  Select your container, navigate to and click the JSON file, and click **Download** to view the data.


## Next steps

In this tutorial, you learned how to reliably dispatch device-to-cloud messages by using the message routing functionality of IoT Hub.

To see examples of complete end-to-end solutions that use IoT Hub, see [Azure IoT Suite][lnk-suite].

To learn more about developing solutions with IoT Hub, see the [IoT Hub developer guide].

To learn more about message routing in IoT Hub, see [Send and receive messages with IoT Hub][lnk-devguide-messaging].

<!-- Images. -->
[2]: ./media/iot-hub-python-python-process-d2c/output.png

[30]: ./media/iot-hub-python-python-process-d2c/click-endpoints.png
[31]: ./media/iot-hub-python-python-process-d2c/endpoint-creation.png
[32]: ./media/iot-hub-python-python-process-d2c/route-creation.png
[33]: ./media/iot-hub-python-python-process-d2c/fallback-route.png
[34]: ./media/iot-hub-python-python-process-d2c/click-routes.png

<!-- Links -->
[lnk-python-download]: https://www.python.org/downloads/
[lnk-visual-c-redist]: http://www.microsoft.com/download/confirmation.aspx?id=48145
[lnk-node-download]: https://nodejs.org/en/download/
[lnk-install-pip]: https://pip.pypa.io/en/stable/installing/
[lnk-iot-hub-explorer]: https://github.com/Azure/iothub-explorer
[lnk-sb-queues-node]: ../service-bus-messaging/service-bus-python-how-to-use-queues.md

[Azure Storage]: https://azure.microsoft.com/documentation/services/storage/
[Azure Service Bus]: https://azure.microsoft.com/documentation/services/service-bus/

[IoT Hub developer guide]: iot-hub-devguide.md
[lnk-devguide-messaging]: iot-hub-devguide-messaging.md
[Get started with IoT Hub]: iot-hub-python-getstarted.md
[Azure IoT Developer Center]: https://azure.microsoft.com/develop/iot

[Transient Fault Handling]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx

[lnk-suite]: https://azure.microsoft.com/documentation/suites/iot-suite/
[lnk-free-trial]: https://azure.microsoft.com/free/
[lnk-storage]: https://docs.microsoft.com/en-us/azure/storage/
[lnk-python-service-bus]: https://pypi.python.org/pypi/azure-servicebus