---
title: Device management using direct methods (Python)
titleSuffix: Azure IoT Hub
description: How to use Azure IoT Hub direct methods with the Azure IoT SDK for Python for device management tasks including invoking a remote device reboot.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: csharp
ms.topic: include
ms.date: 1/6/2025
ms.custom: mqtt, devx-track-python, py-fresh-zinc
---

  * Python SDK - [Python version 3.7 or later](https://www.python.org/downloads/) is recommended. Make sure to use the 32-bit or 64-bit installation as required by your setup. When prompted during the installation, make sure to add Python to your platform-specific environment variable.

## Overview

This article describes how to use the [Azure IoT SDK for Python](https://github.com/Azure/azure-iot-sdk-python) to create device and backend service application code for device direct methods.

## Install packages

The **azure-iot-device** library must be installed to create device applications.

```cmd/sh
pip install azure-iot-device
```

The **azure-iot-hub** library must be installed to create backend service applications.

```cmd/sh
pip install azure-iot-hub
```

## Create a device application

This section describes how to use device application code to create a direct method callback listener.

The [IoTHubDeviceClient](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient) class contains methods that can be used to work with direct methods.

### Device import statement

Add this import statement to access `IoTHubDeviceClient` and `MethodResponse`.

```python
# import the device client library
from azure.iot.device import IoTHubDeviceClient, MethodResponse
```

### Connect to a device

A device app can authenticate with IoT Hub using the following methods:

* Shared access key
* X.509 certificate

[!INCLUDE [iot-authentication-device-connection-string.md](iot-authentication-device-connection-string.md)]

#### Authenticate using a shared access key

Use [create_from_connection_string](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient?#azure-iot-device-iothubdeviceclient-create-from-connection-string) to connect an application to a device using a device connection string.

```python
# substitute the device connection string in conn_str
# and add it to the IoTHubDeviceClient object
conn_str = "{IoT hub device connection string}"
device_client = IoTHubDeviceClient.create_from_connection_string(conn_str)
```

#### Authenticate using an X.509 certificate

[!INCLUDE [iot-hub-howto-auth-device-cert-python](iot-hub-howto-auth-device-cert-python.md)]

### Create a direct method callback

Use [on_method_request_received](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient?#azure-iot-device-iothubdeviceclient-on-method-request-received) to create a handler function or coroutine that is called when a direct method is received. The listener is associated with a method name keyword, such as "reboot". The method name can be used in an IoT Hub or backend application to trigger the callback method on the device.

The handler function should create a [MethodResponse](/python/api/azure-iot-device/azure.iot.device.methodresponse) and pass it to [send_method_response](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient?#azure-iot-device-iothubdeviceclient-send-method-response) to send a direct method response acknowledgment to the calling application.

This example sets up a direct method handler named `method_request_handler`.

```python
try:
    # Attach the handler to the client
    client.on_method_request_received = method_request_handler
except:
    # In the event of failure, clean up
    client.shutdown()
```

In this example, the `method_request_handler` callback method implements the direct method on the device. The code is executed when the "rebootDevice" direct method is called from a service application. The method calls `send_method_response` to send a direct method response acknowledgment to the calling application.

```python
# Define the handler for method requests
def method_request_handler(method_request):
    if method_request.name == "rebootDevice":
        # Act on the method by rebooting the device
        print("Rebooting device")
        time.sleep(20)
        print("Device rebooted")
        # Create a method response indicating the method request was resolved
        resp_status = 200
        resp_payload = {"Response": "This is the response from the device"}
        method_response = MethodResponse(method_request.request_id, resp_status, resp_payload)
    else:
        # Create a method response indicating the method request was for an unknown method
        resp_status = 404
        resp_payload = {"Response": "Unknown method"}
        method_response = MethodResponse(method_request.request_id, resp_status, resp_payload)

    # Send the method response
    client.send_method_response(method_response)
```

### SDK device samples

The Azure IoT SDK for Python provides a working sample of a device app that handles direct method tasks. For more information, see [Receive direct method](https://github.com/Azure/azure-iot-sdk-python/blob/main/samples/async-hub-scenarios/receive_direct_method.py).

## Create a backend application

This section describes how to use a backend service application to call a direct method on a device.

The [IoTHubRegistryManager](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager) class exposes all methods required to create a backend application to send messages to a device.

### Service import statements

Add these import statements to connect to Iot Hub, send cloud-to-device direct methods, and receive device direct method responses.

```python
from azure.iot.hub import IoTHubRegistryManager
from azure.iot.hub.models import CloudToDeviceMethod, CloudToDeviceMethodResult
```

### Connect to IoT hub

You can connect a backend service to IoT Hub using the following methods:

* Shared access policy
* Microsoft Entra

[!INCLUDE [iot-authentication-service-connection-string.md](iot-authentication-service-connection-string.md)]

#### Connect using a shared access policy

Connect to IoT hub using [from_connection_string](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager?#azure-iot-hub-iothubregistrymanager-from-connection-string).

To invoke a direct method on a device through IoT Hub, your service needs the **service connect** permission. By default, every IoT Hub is created with a shared access policy named **service** that grants this permission.

As a parameter to `from_connection_string`, supply the **service** shared access policy. For more information about shared access policies, see [Control access to IoT Hub with shared access signatures](/azure/iot-hub/authenticate-authorize-sas).

For example:

```python
# Connect to IoT hub
IOTHUB_CONNECTION_STRING = "{IoT hub service connection string}"
iothub_registry_manager = IoTHubRegistryManager.from_connection_string(IOTHUB_CONNECTION_STRING)
```

#### Connect using Microsoft Entra

[!INCLUDE [iot-hub-howto-connect-service-iothub-entra-python](iot-hub-howto-connect-service-iothub-entra-python.md)]

### Invoke a method on a device

You can invoke a direct method by name on a device. The method name identifies the method. In the following and previous device example shown in **Create a direct method callback**, the direct method name is "rebootDevice".

To invoke a direct method on a device:

1. Create a [CloudToDeviceMethod](/python/api/azure-iot-hub/azure.iot.hub.protocol.models.cloudtodevicemethod) object. Supply the method name and payload as parameters.
1. Call [invoke_device_method](/python/api/azure-iot-hub/azure.iot.hub.iothub_registry_manager.iothubregistrymanager?#azure-iot-hub-iothub-registry-manager-iothubregistrymanager-invoke-device-method) to invoke a direct method on a device. Supply the device ID and `CloudToDeviceMethod` payload object as parameters.

This example calls `CloudToDeviceMethod` to invoke a direct method named "rebootDevice" on a device. After the direct method is successfully invoked, the direct method response payload is displayed.

```python
CONNECTION_STRING = "{IoTHubConnectionString}"
DEVICE_ID = "{deviceId}"

METHOD_NAME = "rebootDevice"
METHOD_PAYLOAD = "{\"method_number\":\"42\"}"
TIMEOUT = 60
WAIT_COUNT = 10

try:
    print ( "" )
    print ( "Invoking device to reboot..." )

    # Call the direct method.
    deviceMethod = CloudToDeviceMethod(method_name=METHOD_NAME, payload=METHOD_PAYLOAD)
    response = registry_manager.invoke_device_method(DEVICE_ID, deviceMethod)

    print ( "Successfully invoked the device to reboot." )

    print ( "The device has returned this payload:" )
    print ( response.payload )

except Exception as ex:
    print ( "" )
    print ( "Unexpected error {0}".format(ex) )
    return
```

### SDK service samples

The Azure IoT SDK for Python provides working samples of service apps that handle direct method tasks. For more information, see:

* [Service helper sync](https://github.com/Azure/azure-iot-sdk-python/blob/e75d1c2026eab939d5d31097fd0c22924c53abf8/dev_utils/dev_utils/service_helper_sync.py)
* [Service operations](https://github.com/Azure/azure-iot-sdk-python/blob/e75d1c2026eab939d5d31097fd0c22924c53abf8/tests/e2e/provisioning_e2e/iothubservice20180630/operations/service_operations.py)
