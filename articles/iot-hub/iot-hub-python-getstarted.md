---
title: Get started with Azure IoT Hub (Python) | Microsoft Docs
description: This article shows you how to send messages from a simulated device to your Azure IoT hub using the Azure IoT SDKs for Python.
services: iot-hub
author: dsk-2015
manager: timlt
editor: ''

ms.service: iot-hub
ms.devlang: python
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/22/2017
ms.author: dkshir
ms.custom: na

---
# Connect your simulated device to your IoT hub using Python
[!INCLUDE [iot-hub-selector-get-started](../../includes/iot-hub-selector-get-started.md)]

At the end of this tutorial, you will have two Python apps:

* **CreateDeviceIdentity.py**, which creates a device identity and associated security key to connect your simulated device app.
* **SimulatedDevice.py**, which connects to your IoT hub with the device identity created earlier, and periodically sends a telemetry message using the MQTT protocol.

> [!NOTE]
> The article [Azure IoT SDKs][lnk-hub-sdks] provides information about the Azure IoT SDKs that you can use to build both applications to run on devices and your solution back end.
> 
> 

To complete this tutorial, you need the following:

* [Python 2.x or 3.x][lnk-python-download]. Make sure to use the 32-bit or 64-bit installation as required by your setup. When prompted during the installation, make sure to add Python to your platform-specific environment variable. If you are using Python 2.x, you may need to [install or upgrade *pip*, the Python package management system][lnk-install-pip].
* If you are using Windows OS, then [Visual C++ redistributable package][lnk-visual-c-redist] to allow the use of native DLLs from Python.
* [Node.js 4.0 or later][lnk-node-download]. Make sure to use the 32-bit or 64-bit installation as required by your setup. This is needed to install the [IoT Hub Explorer tool][lnk-iot-hub-explorer].
* An active Azure account. If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.

> [!NOTE]
> The *pip* packages for `azure-iothub-service-client` and `azure-iothub-device-client` are currently available only for Windows OS. For Linux/Mac OS, please refer to the Linux and Mac OS-specific sections on the [Prepare your development environment for Python][lnk-python-devbox] post.
> 

[!INCLUDE [iot-hub-get-started-create-hub](../../includes/iot-hub-get-started-create-hub.md)]

You have now created your IoT hub. Use the IoT Hub host name and the IoT Hub connection string in the rest of this tutorial.

> [!NOTE]
> You can also easily create your IoT hub on a command line, using the Python or Node.js based Azure CLI. The article [Create an IoT hub using the Azure CLI 2.0][lnk-azure-cli-hub] shows you the quick steps to do so. 
> 

## Create a device identity
This section lists the steps to create a Python console app, that creates a device identity in the identity registry of your IoT hub. A device can only connect to IoT Hub if it has an entry in the identity registry. For more information, see the **Identity Registry** section of the [IoT Hub developer guide][lnk-devguide-identity]. When you run this console app, it generates a unique device ID and key that your device can use to identify itself when it sends device-to-cloud messages to IoT Hub.

1. Open a command prompt and install the **Azure IoT Hub Service SDK for Python**. Close the command prompt after you install the SDK.

    ```
    pip install azure-iothub-service-client
    ```

2. Create a Python file named **CreateDeviceIdentity.py**. Open it in [a Python editor/IDE of your choice][lnk-python-ide-list], for example, the default [IDLE][lnk-idle].

3. Add the following code to import the required modules from the service SDK:

    ```python
    import sys
    import iothub_service_client
    from iothub_service_client import IoTHubRegistryManager, IoTHubRegistryManagerAuthMethod
    from iothub_service_client import IoTHubDeviceStatus, IoTHubError
    ```
2. Add the following code, replacing the placeholder for `[IoTHub Connection String]` with the connection string for the IoT hub you created in the previous section. You can use any name as the `DEVICE_ID`.
   
    ```python
    CONNECTION_STRING = "[IoTHub Connection String]"
    DEVICE_ID = "MyFirstPythonDevice"
    ```
3. Add the following function to print some of the device information.

    ```python
    def print_device_info(title, iothub_device):
        print ( title + ":" )
        print ( "iothubDevice.deviceId                    = {0}".format(iothub_device.deviceId) )
        print ( "iothubDevice.primaryKey                  = {0}".format(iothub_device.primaryKey) )
        print ( "iothubDevice.secondaryKey                = {0}".format(iothub_device.secondaryKey) )
        print ( "iothubDevice.connectionState             = {0}".format(iothub_device.connectionState) )
        print ( "iothubDevice.status                      = {0}".format(iothub_device.status) )
        print ( "iothubDevice.lastActivityTime            = {0}".format(iothub_device.lastActivityTime) )
        print ( "iothubDevice.cloudToDeviceMessageCount   = {0}".format(iothub_device.cloudToDeviceMessageCount) )
        print ( "iothubDevice.isManaged                   = {0}".format(iothub_device.isManaged) )
        print ( "iothubDevice.authMethod                  = {0}".format(iothub_device.authMethod) )
        print ( "" )
    ```
3. Add the following function to create the device identification using the Registry Manager. 

    ```python
    def iothub_createdevice():
        try:
            iothub_registry_manager = IoTHubRegistryManager(CONNECTION_STRING)
            auth_method = IoTHubRegistryManagerAuthMethod.SHARED_PRIVATE_KEY
            new_device = iothub_registry_manager.create_device(DEVICE_ID, "", "", auth_method)
            print_device_info("CreateDevice", new_device)

        except IoTHubError as iothub_error:
            print ( "Unexpected error {0}".format(iothub_error) )
            return
        except KeyboardInterrupt:
            print ( "iothub_createdevice stopped" )
    ```
4. Finally, add the main function as follows and save the file.

    ```python
    if __name__ == '__main__':
        print ( "" )
        print ( "Python {0}".format(sys.version) )
        print ( "Creating device using the Azure IoT Hub Service SDK for Python" )
        print ( "" )
        print ( "    Connection string = {0}".format(CONNECTION_STRING) )
        print ( "    Device ID         = {0}".format(DEVICE_ID) )

        iothub_createdevice()
    ```
5. On the command prompt, run the **CreateDeviceIdentity.py** as follows:

    ```python
    python CreateDeviceIdentity.py
    ```
6. You should see the simulated device getting created. Note down the **deviceId** and the **primaryKey** of this device. You need these values later when you create an application that connects to IoT Hub as a device.

    ![Create device success][1]

> [!NOTE]
> The IoT Hub identity registry only stores device identities to enable secure access to the IoT hub. It stores device IDs and keys to use as security credentials and an enabled/disabled flag that you can use to disable access for an individual device. If your application needs to store other device-specific metadata, it should use an application-specific store. For more information, see the [IoT Hub developer guide][lnk-devguide-identity].
> 
> 


## Create a simulated device app
This section lists the steps to create a Python console app, that simulates a device and sends device-to-cloud messages to your IoT hub.

1. Open a new command prompt and install the Azure IoT Hub Device SDK for Python as follows. Close the command prompt after the installation.

    ```
    pip install azure-iothub-device-client
    ```
2. Create a file named **SimulatedDevice.py**. Open this file in a Python editor/IDE of your choice (for example, IDLE).

3. Add the following code to import the required modules from the device SDK.

    ```python
    import random
    import time
    import sys
    import iothub_client
    from iothub_client import IoTHubClient, IoTHubClientError, IoTHubTransportProvider, IoTHubClientResult
    from iothub_client import IoTHubMessage, IoTHubMessageDispositionResult, IoTHubError, DeviceMethodReturnValue
    ```
4. Add the following code and replace the placeholder for `[IoTHub Device Connection String]` with the connection string for your device. The device connection string is usually in the format of `HostName=<hostName>;DeviceId=<deviceId>;SharedAccessKey=<primaryKey>`. Use the **deviceId** and **primaryKey** of the device you created in the previous section to replace the `<deviceId>` and `<primaryKey>` respectively. Replace `<hostName>` with your IoT hub's host name, usually as `<IoT hub name>.azure-devices.net`.

    ```python
    # String containing Hostname, Device Id & Device Key in the format
    CONNECTION_STRING = "[IoTHub Device Connection String]"
    # choose HTTP, AMQP or MQTT as transport protocol
    PROTOCOL = IoTHubTransportProvider.MQTT
    MESSAGE_TIMEOUT = 10000
    AVG_WIND_SPEED = 10.0
    SEND_CALLBACKS = 0
    MSG_TXT = "{\"deviceId\": \"MyFirstPythonDevice\",\"windSpeed\": %.2f}"    
    ```
5. Add the following code to define a send confirmation callback. 

    ```python
    def send_confirmation_callback(message, result, user_context):
        global SEND_CALLBACKS
        print ( "Confirmation[%d] received for message with result = %s" % (user_context, result) )
        map_properties = message.properties()
        print ( "    message_id: %s" % message.message_id )
        print ( "    correlation_id: %s" % message.correlation_id )
        key_value_pair = map_properties.get_internals()
        print ( "    Properties: %s" % key_value_pair )
        SEND_CALLBACKS += 1
        print ( "    Total calls confirmed: %d" % SEND_CALLBACKS )
    ```
6. Add the following code to initialize the device client.

    ```python
    def iothub_client_init():
        # prepare iothub client
        client = IoTHubClient(CONNECTION_STRING, PROTOCOL)
        # set the time until a message times out
        client.set_option("messageTimeout", MESSAGE_TIMEOUT)
        client.set_option("logtrace", 0)
        return client
    ```
7. Add the following function to format and send a message from your simulated device to your IoT hub.

    ```python
    def iothub_client_telemetry_sample_run():

        try:
            client = iothub_client_init()
            print ( "IoT Hub device sending periodic messages, press Ctrl-C to exit" )
            message_counter = 0

            while True:
                msg_txt_formatted = MSG_TXT % (AVG_WIND_SPEED + (random.random() * 4 + 2))
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
                prop_text = "PropMsg_%d" % message_counter
                prop_map.add("Property", prop_text)

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
8. Finally, add the main function. 

    ```python
    if __name__ == '__main__':
        print ( "Simulating a device using the Azure IoT Hub Device SDK for Python" )
        print ( "    Protocol %s" % PROTOCOL )
        print ( "    Connection string=%s" % CONNECTION_STRING )

        iothub_client_telemetry_sample_run()
    ```
9. Save and close the **SimulatedDevice.py** file. You are now ready to run this app.

> [!NOTE]
> To keep things simple, this tutorial does not implement any retry policy. In production code, you should implement retry policies (such as an exponential backoff), as suggested in the MSDN article [Transient Fault Handling][lnk-transient-faults].
> 
> 

## Receive messages from your simulated device
To receive telemetry messages from your device, you need to use an [Event Hubs][lnk-event-hubs-overview]-compatible endpoint exposed by the IoT Hub, which reads the device-to-cloud messages. Read the [Get Started with Event Hubs][lnk-eventhubs-tutorial] tutorial for information on how to process messages from Event Hubs for your IoT hub's Event Hub-compatible endpoint. Event Hubs does not support telemetry in Python yet, so you can either create a [Node.js](iot-hub-node-node-getstarted.md#D2C_node) or a [.NET](iot-hub-csharp-csharp-getstarted.md#D2C_csharp) Event Hubs-based console app to read the device-to-cloud messages from IoT Hub. This tutorial shows how you can use the [IoT Hub Explorer tool][lnk-iot-hub-explorer] to read these device messages.

1. Open a command prompt and install the IoT Hub Explorer. 

    ```
    npm install -g iothub-explorer
    ```

2. Run the following command on the command prompt, to begin monitoring the device-to-cloud messages from your device. Use your IoT hub's connection string in the placeholder after `--login`.

    ```
    iothub-explorer monitor-events MyFirstPythonDevice --login "[IoTHub connection string]"
    ```

3. Open a new command prompt and navigate to the directory containing the **SimulatedDevice.py** file.

4. Run the **SimulatedDevice.py** file, which periodically sends telemetry data to your IoT hub. 
   
    ```
    python SimulatedDevice.py
    ```
5. Observe the device messages on the command prompt running the IoT Hub Explorer from the previous section. 

    ![Python device-to-cloud messages][2]

## Next steps
In this tutorial, you configured a new IoT hub in the Azure portal, and then created a device identity in the IoT hub's identity registry. You used this device identity to enable the simulated device app to send device-to-cloud messages to the IoT hub. You observed the messages received by the IoT hub with the help of the IoT Hub Explorer tool. 

To explore the Python SDK for Azure IoT Hub usage in depth, visit [this Git Hub repo][lnk-python-github]. To review the messaging capabilities of the Azure IoT Hub Service SDK for Python, you can download and run [iothub_messaging_sample.py][lnk-messaging-sample]. For device side simulation using the Azure IoT Hub Device SDK for Python, you can download and run the [iothub_client_sample.py][lnk-client-sample].

To continue getting started with IoT Hub and to explore other IoT scenarios, see:

* [Connecting your device][lnk-connect-device]
* [Getting started with device management][lnk-device-management]
* [Getting started with Azure IoT Edge][lnk-iot-edge]

To learn how to extend your IoT solution and process device-to-cloud messages at scale, see the [Process device-to-cloud messages][lnk-process-d2c-tutorial] tutorial.
[!INCLUDE [iot-hub-get-started-next-steps](../../includes/iot-hub-get-started-next-steps.md)]

<!-- Images. -->
[1]: ./media/iot-hub-python-getstarted/createdevice.png
[2]: ./media/iot-hub-python-getstarted/sendd2cmessage.png

<!-- Links -->
[lnk-python-download]: https://www.python.org/downloads/
[lnk-visual-c-redist]: http://www.microsoft.com/download/confirmation.aspx?id=48145
[lnk-node-download]: https://nodejs.org/en/download/
[lnk-install-pip]: https://pip.pypa.io/en/stable/installing/
[lnk-azure-cli-hub]: https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-create-using-cli
[lnk-transient-faults]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx
[lnk-idle]: https://docs.python.org/3/library/idle.html
[lnk-python-ide-list]: https://wiki.python.org/moin/IntegratedDevelopmentEnvironments
[lnk-iot-hub-explorer]: https://github.com/Azure/iothub-explorer
[lnk-python-github]: https://github.com/Azure/azure-iot-sdk-python
[lnk-messaging-sample]: https://github.com/Azure/azure-iot-sdk-python/blob/master/service/samples/iothub_messaging_sample.py
[lnk-client-sample]: https://github.com/Azure/azure-iot-sdk-python/blob/master/device/samples/iothub_client_sample.py

[lnk-eventhubs-tutorial]: ../event-hubs/event-hubs-csharp-ephcs-getstarted.md
[lnk-devguide-identity]: iot-hub-devguide-identity-registry.md
[lnk-event-hubs-overview]: ../event-hubs/event-hubs-overview.md
[lnk-python-devbox]: https://github.com/Azure/azure-iot-sdk-python/blob/master/doc/python-devbox-setup.md

[lnk-process-d2c-tutorial]: iot-hub-csharp-csharp-process-d2c.md

[lnk-hub-sdks]: iot-hub-devguide-sdks.md
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/

[lnk-device-management]: iot-hub-node-node-device-management-get-started.md
[lnk-iot-edge]: iot-hub-linux-iot-edge-get-started.md
[lnk-connect-device]: https://azure.microsoft.com/develop/iot/
