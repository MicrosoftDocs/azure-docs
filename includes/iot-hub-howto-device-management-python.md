---
title: Device management using direct methods (Python)
titleSuffix: Azure IoT Hub
description: How to use Azure IoT Hub direct methods with the Azure IoT SDK for Python for device management tasks including invoking a remote device reboot.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: csharp
ms.topic: include
ms.date: 10/09/2024
ms.custom: mqtt, devx-track-python, py-fresh-zinc
---

  * **Python SDK** - [Python version 3.7 or later](https://www.python.org/downloads/) is recommended. Make sure to use the 32-bit or 64-bit installation as required by your setup. When prompted during the installation, make sure to add Python to your platform-specific environment variable.

    * Device applications require the **azure-iot-device** package. You can install the package using this command:

      ```cmd/sh
        pip install azure-iot-device
      ```

    * Service applications require the **azure-iot-hub** package. You can install the package using this command:

      ```cmd/sh
        pip install azure-iot-hub
      ```

## Overview

This article describes how to use the [Azure IoT SDK for Python](https://github.com/Azure/azure-iot-sdk-python) to create device and backend service application code for device direct methods.

## Create a device application

This section describes how to use device application code to:

* Respond to a direct method called by the cloud
* Trigger a simulated device reboot
* Use the reported properties to enable device twin queries to identify devices and when they were last rebooted

[!INCLUDE [iot-authentication-device-connection-string.md](iot-authentication-device-connection-string.md)]

### Device import statements

Add import statements to access `IoTHubDeviceClient` and `MethodResponse`.

```python
# import the device client library
import time
import datetime
from azure.iot.device import IoTHubDeviceClient, MethodResponse
```

### Connect to a device

The [IoTHubDeviceClient](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient) class contains methods that can be used to work with direct methods.

Call [create_from_connection_string](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient?#azure-iot-device-iothubdeviceclient-create-from-connection-string) to connect an application to a device using a device connection string.

```python
# substitute the device connection string in conn_str
# and add it to the IoTHubDeviceClient object
conn_str = "{IOT hub device connection string}"
device_client = IoTHubDeviceClient.create_from_connection_string(conn_str)
```

### Create a direct method callback

Call [on_method_request_received](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient?#azure-iot-device-iothubdeviceclient-on-method-request-received) to create a handler function or coroutine that is called when a direct method is received. The listener is associated with a method name keyword, such as "reboot". The method name can be used in an IoT Hub or backend application to trigger the callback method on the device.

This example sets up a direct method handler named `method_request_handler`.

For example:

```python
try:
    # Attach the handler to the client
    client.on_method_request_received = method_request_handler
except:
    # In the event of failure, clean up
    client.shutdown()
```

In this example, the `method_request_handler` callback method implements the direct method on the device. The code is executed when the "rebootDevice" direct method is called from a service application. This code updates reported properties related to a simulated device reboot. The reported properties can be read and verified by an IoT Hub or backend application, as demonstrated in the **Create a backend application** section of this article.

```python
# Define the handler for method requests
def method_request_handler(method_request):
    if method_request.name == "rebootDevice":
        # Act on the method by rebooting the device
        print("Rebooting device")
        time.sleep(20)
        print("Device rebooted")

        # ...and patching the reported properties
        current_time = str(datetime.datetime.now())
        reported_props = {"rebootTime": current_time}
        client.patch_twin_reported_properties(reported_props)
        print( "Device twins updated with latest rebootTime")

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

This section describes how to initiate a remote reboot on a device using a direct method call from a backend service application.

The [IoTHubRegistryManager](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager) class exposes all methods required to create a backend application to send messages to a device.

### Service import statements

Add these import statements to connect to Iot Hub, receive cloud-to-device methods, and call device twin methods.

```python
import sys, time

from azure.iot.hub import IoTHubRegistryManager
from azure.iot.hub.models import CloudToDeviceMethod, CloudToDeviceMethodResult, Twin
```

### Connect to IoT hub

Connect to IoT hub using [from_connection_string](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager?#azure-iot-hub-iothubregistrymanager-from-connection-string). As a parameter, supply the **IoT Hub service connection string** that you created in the prerequisites section.

To invoke a direct method on a device through IoT Hub, your service needs the **service connect** permission. By default, every IoT Hub is created with a shared access policy named **service** that grants this permission.

As a parameter to `CreateFromConnectionString`, supply the **service** shared access policy connection string. For more information about shared access policies, see [Control access to IoT Hub with shared access signatures](/azure/iot-hub/authenticate-authorize-sas).

For example:

```python
# Connect to IoT hub
IOTHUB_CONNECTION_STRING = "{IoT hub service connection string}"
iothub_registry_manager = IoTHubRegistryManager.from_connection_string(IOTHUB_CONNECTION_STRING)
```

### Invoke a method on a device

You can invoke a direct method by name on a device. The method name identifies the method. The method name is "rebootTime" in the examples within this article.

To invoke a direct method on a device:

1. Create a [CloudToDeviceMethod](/python/api/azure-iot-hub/azure.iot.hub.protocol.models.cloudtodevicemethod) object. Supply the method name and payload as parameters.
1. Call [invoke_device_method](/python/api/azure-iot-hub/azure.iot.hub.iothub_registry_manager.iothubregistrymanager?#azure-iot-hub-iothub-registry-manager-iothubregistrymanager-invoke-device-method) to invoke a direct method on a device. Supply the device ID and `CloudToDeviceMethod` payload object as parameters.

This example invokes a direct method named "rebootDevice" on a device. The example then uses device twin queries to discover the last reboot time for the device that was updated as described in the **Create a direct method callback** section of this article.

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

    print ( "" )
    print ( "Successfully invoked the device to reboot." )

    print ( "" )
    print ( response.payload )

    while True:
        print ( "" )
        print ( "IoTHubClient waiting for commands, press Ctrl-C to exit" )

        status_counter = 0
        while status_counter <= WAIT_COUNT:
            twin_info = registry_manager.get_twin(DEVICE_ID)

            if twin_info.properties.reported.get("rebootTime") != None :
                print ("Last reboot time: " + twin_info.properties.reported.get("rebootTime"))
            else:
                print ("Waiting for device to report last reboot time...")

            time.sleep(5)
            status_counter += 1

except Exception as ex:
    print ( "" )
    print ( "Unexpected error {0}".format(ex) )
    return
except KeyboardInterrupt:
    print ( "" )
    print ( "IoTHubDeviceMethod sample stopped" )

if __name__ == '__main__':
print ( "Starting the IoT Hub Service Client DeviceManagement Python sample..." )
print ( "    Connection string = {0}".format(CONNECTION_STRING) )
print ( "    Device ID         = {0}".format(DEVICE_ID) )
```

### SDK service samples

The Azure IoT SDK for Python provides a working sample of a service app that handles direct method tasks. For more information, see [Service helper sync](https://github.com/Azure/azure-iot-sdk-python/blob/e75d1c2026eab939d5d31097fd0c22924c53abf8/dev_utils/dev_utils/service_helper_sync.py).
