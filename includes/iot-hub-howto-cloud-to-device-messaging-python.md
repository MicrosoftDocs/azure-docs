---
author: kgremban
ms.author: kgremban
ms.service: azure-iot-hub
ms.devlang: python
ms.topic: include
ms.date: 12/19/2024
ms.custom: mqtt, devx-track-python, py-fresh-zinc
---

## Create a device application

This section describes how to receive cloud-to-device messages.

The [IoTHubDeviceClient](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient) class includes methods to create a synchronous connection from a device to an Azure IoT Hub and receive messages from IoT Hub.

The **azure-iot-device** library must be installed to create device applications.

```cmd/sh
pip install azure-iot-device
```

For a Python-based device application to receive cloud-to-device messages, it must connect to IoT Hub and then set up a callback message handler to process incoming messages from IoT Hub.

### Device import statement

Add this code to import the `IoTHubDeviceClient` functions from the azure.iot.device SDK.

```python
from azure.iot.device import IoTHubDeviceClient
```

### Connect a device to IoT Hub

A device app can authenticate with IoT Hub using the following methods:

* Shared access key
* X.509 certificate

[!INCLUDE [iot-authentication-device-connection-string.md](iot-authentication-device-connection-string.md)]

#### Authenticate using a shared access key

To connect a device to IoT Hub:

1. Call [create_from_connection_string](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient?#azure-iot-device-iothubdeviceclient-create-from-connection-string) to add the device primary connection string.
1. Call [connect](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient?#azure-iot-device-iothubdeviceclient-connect) to connect the device client.

For example:

```python
# Add your IoT hub primary connection string
CONNECTION_STRING = "{Device primary connection string}"
device_client = IoTHubDeviceClient.create_from_connection_string(CONNECTION_STRING)

# Connect the client
device_client.connect()
```

#### Authenticate using an X.509 certificate

[!INCLUDE [iot-hub-howto-auth-device-cert-python](iot-hub-howto-auth-device-cert-python.md)]

##### Handle reconnection

`IoTHubDeviceClient` will by default attempt to reestablish a dropped connection. Reconnection behavior is governed by the `IoTHubDeviceClient` [connection_retry](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient?#azure-iot-device-iothubdeviceclient-on-message-received) and `connection_retry_interval` parameters.

### Create a message handler

Create a message handler function to process incoming messages to the device. This will be assigned by `on_message_received` (next step) as the callback message handler.

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

Use the [on_message_received](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient?azure-iot-device-iothubdeviceclient-on-message-received) method to assign the message handler method.

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

## Create a backend application

This section describes how to send a cloud-to-device message. A solution backend application connects to an IoT Hub and messages are sent to IoT Hub encoded with a destination device. IoT Hub stores incoming messages to its message queue, and messages are delivered from the IoT Hub message queue to the target device.

The [IoTHubRegistryManager](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager) class exposes all methods required to create a backend application to interact with cloud-to-device messages from the service. The **azure-iot-hub** library must be installed to create backend service applications.

```cmd/sh
pip install azure-iot-hub
```

### Import the IoTHubRegistryManager object

Add the following `import` statement. [IoTHubRegistryManager](/python/api/azure-iot-hub/azure.iot.hub.iothub_registry_manager.iothubregistrymanager) includes APIs for IoT Hub Registry Manager operations.

```python
from azure.iot.hub import IoTHubRegistryManager
```

### Connect to IoT hub

You can connect a backend service to IoT Hub using the following methods:

* Shared access policy
* Microsoft Entra

[!INCLUDE [iot-authentication-service-connection-string.md](iot-authentication-service-connection-string.md)]

#### Connect using a shared access policy

Connect to IoT hub using [from_connection_string](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager?#azure-iot-hub-iothubregistrymanager-from-connection-string).

For example:

```python
IoTHubConnectionString = "{IoT hub service connection string}"
registry_manager = IoTHubRegistryManager.from_connection_string(IoTHubConnectionString)
```

#### Connect using Microsoft Entra

[!INCLUDE [iot-hub-howto-connect-service-iothub-entra-python](iot-hub-howto-connect-service-iothub-entra-dotnet.md)]

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

The Azure IoT SDK for Python provides a working sample of a service app that demonstrates how to send a cloud-to-device message. For more information, see [send_message.py](https://github.com/Azure/azure-iot-sdk-python/tree/main/samples/async-hub-scenarios) demonstrates how to send a cloud-to-device message.
