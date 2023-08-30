---
title: Send cloud-to-device messages (Python)
titleSuffix: Azure IoT Hub
description: How to send cloud-to-device messages from a back-end app and receive them on a device app using the Azure IoT SDKs for Python.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.devlang: python
ms.topic: how-to
ms.date: 05/30/2023
ms.custom: mqtt, devx-track-python, py-fresh-zinc
---

# Send cloud-to-device messages with IoT Hub (Python)

[!INCLUDE [iot-hub-selector-c2d](../../includes/iot-hub-selector-c2d.md)]

Azure IoT Hub is a fully managed service that helps enable reliable and secure bi-directional communications between millions of devices and a solution back end. 

This article shows you how to:

* Send cloud-to-device (C2D) messages from your solution backend to a single device through IoT Hub

* Receive cloud-to-device messages on a device

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-whole.md)]

At the end of this article, you run two Python console apps:

* **SimulatedDevice.py**: simulates a device that connects to your IoT hub and receives cloud-to-device messages.

* **SendCloudToDeviceMessage.py**: sends cloud-to-device messages to the simulated device app through IoT Hub.

To learn more about cloud-to-device messages, see [Send cloud-to-device messages from an IoT hub](iot-hub-devguide-messages-c2d.md).

> [!NOTE]
> IoT Hub has SDK support for many device platforms and languages (C, Java, Python, and JavaScript) through the [Azure IoT device SDKs](iot-hub-devguide-sdks.md).

## Prerequisites

* An active Azure account. (If you don't have an account, you can create a [free account](https://azure.microsoft.com/pricing/free-trial/) in just a couple of minutes.)

* An IoT hub. Create one with the [CLI](iot-hub-create-using-cli.md) or the [Azure portal](iot-hub-create-through-portal.md).

* A registered device. Register one in the [Azure portal](iot-hub-create-through-portal.md#register-a-new-device-in-the-iot-hub).

* [Python version 3.7 or later](https://www.python.org/downloads/) is recommended. Make sure to use the 32-bit or 64-bit installation as required by your setup. When prompted during the installation, make sure to add Python to your platform-specific environment variable.

* Make sure that port 8883 is open in your firewall. The device sample in this article uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](../iot/iot-mqtt-connect-to-iot-hub.md#connecting-to-iot-hub).

## Receive messages in the simulated device app

In this section, you create a Python console app to simulate a device and receive cloud-to-device messages from the IoT hub.

1. From a command prompt in your working directory, install the **Azure IoT Hub Device SDK for Python**:

    ```cmd/sh
    pip install azure-iot-device
    ```

1. Using a text editor, create a file named **SimulatedDevice.py**.

1. Add the following `import` statements and variables at the start of the **SimulatedDevice.py** file:

    ```python
    import time
    from azure.iot.device import IoTHubDeviceClient

    RECEIVED_MESSAGES = 0
    ```

1. Add the following code to **SimulatedDevice.py** file. Replace the `{deviceConnectionString}` placeholder value with the connection string for the registered device in [Prerequisites](#prerequisites):

    ```python
    CONNECTION_STRING = "{deviceConnectionString}"
    ```

1. Define the following function that is used to print received messages to the console:

    ```python
    def message_handler(message):
        global RECEIVED_MESSAGES
        RECEIVED_MESSAGES += 1
        print("")
        print("Message received:")

        # print data from both system and application (custom) properties
        for property in vars(message).items():
            print ("    {}".format(property))

        print("Total calls received: {}".format(RECEIVED_MESSAGES))
    ```

1. Add the following code to initialize the client and wait to receive the cloud-to-device message:

    ```python
    def main():
        print ("Starting the Python IoT Hub C2D Messaging device sample...")

        # Instantiate the client
        client = IoTHubDeviceClient.create_from_connection_string(CONNECTION_STRING)

        print ("Waiting for C2D messages, press Ctrl-C to exit")
        try:
            # Attach the handler to the client
            client.on_message_received = message_handler

            while True:
                time.sleep(1000)
        except KeyboardInterrupt:
            print("IoT Hub C2D Messaging device sample stopped")
        finally:
            # Graceful exit
            print("Shutting down IoT Hub Client")
            client.shutdown()
    ```

1. Add the following main function:

    ```python
    if __name__ == '__main__':
        main()
    ```

1. Save and close the **SimulatedDevice.py** file.

For more information about the cloud-to-device message lifecycle and how IoT Hub processes cloud-to-device messages, see [Send cloud-to-device messages from an IoT hub](iot-hub-devguide-messages-c2d.md).

## Get the IoT hub connection string

In this article, you create a backend service to send cloud-to-device messages through your IoT Hub. To send cloud-to-device messages, your service needs the **service connect** permission. By default, every IoT Hub is created with a shared access policy named **service** that grants this permission.

[!INCLUDE [iot-hub-include-find-service-connection-string](../../includes/iot-hub-include-find-service-connection-string.md)]

## Send a cloud-to-device message

In this section, you create a Python console app that sends cloud-to-device messages to the simulated device app. You need the device ID from your device and your IoT hub connection string.

1. In your working directory, open a command prompt and install the **Azure IoT Hub Service SDK for Python**.

   ```cmd/sh
   pip install azure-iot-hub
   ```

1. Using a text editor, create a file named **SendCloudToDeviceMessage.py**.

1. Add the following `import` statements and variables at the start of the **SendCloudToDeviceMessage.py** file:

    ```python
    import random
    import sys
    from azure.iot.hub import IoTHubRegistryManager

    MESSAGE_COUNT = 2
    AVG_WIND_SPEED = 10.0
    MSG_TXT = "{\"service client sent a message\": %.2f}"
    ```

1. Add the following code to **SendCloudToDeviceMessage.py** file. Replace the `{iot hub connection string}` and `{device id}` placeholder values with the IoT hub connection string and device ID you noted previously:

    ```python
    CONNECTION_STRING = "{IoTHubConnectionString}"
    DEVICE_ID = "{deviceId}"
    ```

1. Add the following code to send messages to your device:

    ```python
    def iothub_messaging_sample_run():
        try:
            # Create IoTHubRegistryManager
            registry_manager = IoTHubRegistryManager(CONNECTION_STRING)

            for i in range(0, MESSAGE_COUNT):
                print ( 'Sending message: {0}'.format(i) )
                data = MSG_TXT % (AVG_WIND_SPEED + (random.random() * 4 + 2))

                props={}
                # optional: assign system properties
                props.update(messageId = "message_%d" % i)
                props.update(correlationId = "correlation_%d" % i)
                props.update(contentType = "application/json")

                # optional: assign application properties
                prop_text = "PropMsg_%d" % i
                props.update(testProperty = prop_text)

                registry_manager.send_c2d_message(DEVICE_ID, data, properties=props)

            try:
                # Try Python 2.xx first
                raw_input("Press Enter to continue...\n")
            except:
                pass
                # Use Python 3.xx in the case of exception
                input("Press Enter to continue...\n")

        except Exception as ex:
            print ( "Unexpected error {0}" % ex )
            return
        except KeyboardInterrupt:
            print ( "IoT Hub C2D Messaging service sample stopped" )
    ```

1. Add the following main function:

    ```python
    if __name__ == '__main__':
        print ( "Starting the Python IoT Hub C2D Messaging service sample..." )

        iothub_messaging_sample_run()
    ```

1. Save and close **SendCloudToDeviceMessage.py** file.

## Run the applications

You're now ready to run the applications.

1. At the command prompt in your working directory, run the following command to listen for cloud-to-device messages:

    ```shell
    python SimulatedDevice.py
    ```

    ![Run the simulated device app](./media/iot-hub-python-python-c2d/device-1.png)

1. Open a new command prompt in your working directory and run the following command to send cloud-to-device messages:

    ```shell
    python SendCloudToDeviceMessage.py
    ```

    ![Run the app to send the cloud-to-device command](./media/iot-hub-python-python-c2d/service.png)

1. Note the messages received by the device.

    ![Message received](./media/iot-hub-python-python-c2d/device-2.png)

## Next steps

In this article, you learned how to send and receive cloud-to-device messages.

* To learn more about cloud-to-device messages, see [Send cloud-to-device messages from an IoT hub](iot-hub-devguide-messages-c2d.md).

* To learn more about IoT Hub message formats, see [Create and read IoT Hub messages](iot-hub-devguide-messages-construct.md).
