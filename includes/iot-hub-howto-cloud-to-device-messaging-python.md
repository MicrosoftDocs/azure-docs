---
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: python
ms.topic: include
ms.date: 06/20/2024
ms.custom: mqtt, devx-track-python, py-fresh-zinc
---

## Install the Azure IoT SDK library

Install the azure-iot-device SDK library on your development machine before calling any related code:

```cmd/sh
pip install azure-iot-device
```

There are two Python SDK classes that are used to send messages to and from IoT devices. Message handling methods from these classes are described in sections on this page.

* The [IoTHubDeviceClient](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient) class includes methods to create a synchronous connection from a device to an Azure IoT Hub and receive messages from IoT Hub.

* The [IoTHubRegistryManager](/python/api/azure-iot-hub/azure.iot.hub.iothub_registry_manager.iothubregistrymanager) class includes APIs for IoT Hub Registry Manager operations. In this article, methods from this class show how to connect to IoT Hub and send a message to a device.

## Receive cloud-to-device messages

This section describes how to receive cloud-to-device messages using the [IoTHubDeviceClient](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient) class from the Azure IoT SDK for Python.

For a Python-based device application to receive cloud-to-device messages, it must connect to IoT Hub and then set up a callback message handler to process incoming messages from IoT Hub.

### Import the IoTHubDeviceClient object

Add a line of code to import the `IoTHubDeviceClient` functions from the azure.iot.device SDK.

```python
from azure.iot.device import IoTHubDeviceClient
```

### Connect the device client

Instantiate the [IoTHubDeviceClient](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient), passing an IoT Hub connection string to [create_from_connection_string](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient?azure-iot-device-iothubdeviceclient-create-from-connection-string). This creates a connection from the device to IoT Hub.

Alternatively, you can connect `IoTHubDeviceClient`to a device using one of these methods:

* [SAS token string](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient)
* [Symmetric key authentication](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient?#azure-iot-device-iothubdeviceclient-create-from-symmetric-key/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient)
* [X.509 certificate authentication](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient?#azure-iot-device-iothubdeviceclient-create-from-x509-certificate)

```python
deviceConnectionString = "{your IoT hub connection string}";
client = IoTHubDeviceClient.create_from_connection_string ({deviceConnectionString})
```

#### Handle reconnection

`IoTHubDeviceClient` will by default attempt to reestablish a dropped connection. Reconnection behavior is governed by the `IoTHubDeviceClient` [connection_retry](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient?#azure-iot-device-iothubdeviceclient-on-message-received) and `connection_retry_interval` parameters.

### Create a message handler

Create the message handler function to process incoming messages to the device.

In this example, `message_handler` is called when a message is received. The message properties (`.items`) are printed to the console using a loop.

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

### Assign the message handler

Use the [on_message_received](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient?azure-iot-device-iothubdeviceclient-on-message-received) method to assign the message handler method to the `IoTHubDeviceClient` object.

In this example, a message handler method named `message_handler` is attached to the `IoTHubDeviceClient` `client` object. The `client` object waits to receive a cloud-to-device message from an IoT Hub. This code waits up to 300 seconds (5 minutes) for a message, or exits if a keyboard key is pressed.

```python
try:
    # Attach the handler to the client
    client.on_message_received = message_handler

    while True:
        time.sleep(300)
except KeyboardInterrupt:
    print("IoT Hub C2D Messaging device sample stopped")
finally:
    # Graceful exit
    print("Shutting down IoT Hub Client")
    client.shutdown()
```

### SDK receive message sample

[Receive Message](https://github.com/Azure/azure-iot-sdk-python/tree/main/samples/async-hub-scenarios) - Receive Cloud-to-Device (C2D) messages sent from the Azure IoT Hub to a device.

## Send cloud-to-device messages

This section describes how to send a cloud-to-device message using the [IoTHubRegistryManager](/python/api/azure-iot-hub/azure.iot.hub.iothub_registry_manager.iothubregistrymanager) class from the Azure IoT SDK for Python. A solution backend application connects to an IoT Hub and messages are sent to IoT Hub encoded with a destination device. IoT Hub stores incoming messages to its message queue, and messages are delivered from the IoT Hub message queue to the target device.

### Import the IoTHubRegistryManager object

Add the following `import` statement. [IoTHubRegistryManager](/python/api/azure-iot-hub/azure.iot.hub.iothub_registry_manager.iothubregistrymanager) includes APIs for IoT Hub Registry Manager operations.

```python
from azure.iot.hub import IoTHubRegistryManager
```

### Connect the IoT Hub registry manager

Instantiate the [IoTHubRegistryManager](/python/api/azure-iot-hub/azure.iot.hub.iothub_registry_manager.iothubregistrymanager) object that connects to an IoT hub, passing an IoT Hub connection string to [from_connection_string](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager?#azure-iot-hub-iothubregistrymanager-from-connection-string).

```python
IoTHubConnectionString = "{Primary connection string to an IoT hub}"
registry_manager = IoTHubRegistryManager.from_connection_string(IoTHubConnectionString)
```

### Build and send a message

Use [send_c2d_message](/python/api/azure-iot-hub/azure.iot.hub.iothub_registry_manager.iothubregistrymanager?#azure-iot-hub-iothub-registry-manager-iothubregistrymanager-send-c2d-message) to send a message through the cloud (IoT Hub) to the device.

`send_c2d_message` uses these parameters:

* `deviceID` - The string identifier of the target device.
* `message` - The cloud-to-device message. The message is of type `str` (string).
* `properties` - An *optional* collection of properties of type `dict`. Properties can contain application properties and system properties. The default value is `{}`.

This example sends a test message to the target device.

```python
# define the device ID
deviceID = "Device-1"

# define the message
message = "{\"c2d test message\"}"

# include optional properties
props={}
props.update(messageId = "message1")
props.update(prop1 = "test property-1")
props.update(prop1 = "test property-2")
prop_text = "Test message"
props.update(testProperty = prop_text)

# send the message through the cloud (IoT Hub) to the device
registry_manager.send_c2d_message(deviceID, message, properties=props)
```

### SDK send message sample

[send_message.py](https://github.com/Azure/azure-iot-sdk-python/tree/main/samples/async-hub-scenarios) - Demonstrates how to send a cloud-to-device message.
