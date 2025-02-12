---
title: Get started with module identities and module identity twins (Python)
titleSuffix: Azure IoT Hub
description: Learn how to create module identities and update module identity twins using the Azure IoT Hub SDK for Python.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: python
ms.topic: include
ms.date: 11/19/2024
ms.custom: mqtt, devx-track-python, py-fresh-zinc
---

  * [Python version 3.7 or later](https://www.python.org/downloads/) is recommended. Make sure to use the 32-bit or 64-bit installation as required by your setup. When prompted during the installation, make sure to add Python to your platform-specific environment variable.

## Overview

This article describes how to use the [Azure IoT SDK for Python](https://github.com/Azure/azure-iot-sdk-python) to create device and backend service application code for module identity twins.

## Install packages

The **azure-iot-device** library must be installed to create device applications.

```cmd/sh
pip install azure-iot-device
```

The **azure-iot-hub** library must be installed to create backend service applications.

```cmd/sh
pip install azure-iot-hub
```

The **msrest** library is used to catch HTTPOperationError exceptions.

```cmd/sh
pip install msrest
```

## Create a device application

This section describes how to use device application code to:

* Retrieve a module identity twin and examine reported properties
* Update module identity twin reported properties
* Create a module identity twin desired property update callback handler

[!INCLUDE [iot-authentication-device-connection-string.md](iot-authentication-device-connection-string.md)]

### Import statements

Add this `import` statement to use the device library.

```python
# import the device client library
import asyncio
from azure.iot.device.aio import IoTHubDeviceClient
```

### Connect to a device

The [IoTHubModuleClient](/python/api/azure-iot-device/azure.iot.device.iothubmoduleclient) class contains methods that can be used to work with module identity twins.

To connect an application to a device:

1. Call [create_from_connection_string](/python/api/azure-iot-device/azure.iot.device.iothubmoduleclient?#azure-iot-device-iothubmoduleclient-create-from-connection-string) to add the module identity connection string
1. Call [connect](/python/api/azure-iot-device/azure.iot.device.iothubmoduleclient?#azure-iot-device-iothubmoduleclient-connect) to connect the device client to an Azure IoT hub

```python
# import the device client library
import asyncio
from azure.iot.device.aio import IoTHubDeviceClient

# substitute the device connection string in conn_str
# and add it to the IoTHubDeviceClient object
conn_str = "{Device module identity connection string}"
device_client = IoTHubDeviceClient.create_from_connection_string(conn_str)

# connect the application to the device
await device_client.connect()
```

> [!NOTE]
> Python does not support connection of a device app to an IoT Hub module identity twin using a certificate.

### Retrieve a module identity twin and examine properties

Call [get_twin](/python/api/azure-iot-device/azure.iot.device.iothubmoduleclient?#azure-iot-device-iothubmoduleclient-get-twin) to retrieve the module identity twin from the Azure IoT Hub service. The twin information is placed into a variable that can be examined.

This example retrieves the device twin and uses the `print` command to view the device twin in JSON format.

```python
# get the twin
twin = await device_client.get_twin()
print("Twin document:")
print("{}".format(twin))
```

### Update module identity twin reported properties

You can apply a patch to update module identity twin reported properties in JSON format.

To apply a patch to update reported properties:

1. Assign a reported property JSON patch to a variable.
1. Call [patch_twin_reported_properties](/python/api/azure-iot-device/azure.iot.device.iothubmoduleclient?#azure-iot-device-iothubmoduleclient-patch-twin-reported-properties) to apply the JSON patch to reported properties.

For example:

```python
# create the reported properties patch
reported_properties = {"temperature": random.randint(320, 800) / 10}
print("Setting reported temperature to {}".format(reported_properties["temperature"]))
# update the reported properties and wait for the result
await device_client.patch_twin_reported_properties(reported_properties)
```

### Create a module identity twin desired property update callback handler

Call [on_twin_desired_properties_patch_received](/python/api/azure-iot-device/azure.iot.device.iothubmoduleclient?#azure-iot-device-iothubmoduleclient-on-twin-desired-properties-patch-received) to create a handler function or coroutine that is called when a module identity twin desired properties patch is received. The handler takes one argument, which is the twin patch in the form of a JSON dictionary object.

This example sets up a desired properties patch handler named `twin_patch_handler`.

For example:

```python
try:
    # Set handlers on the client
    device_client.on_twin_desired_properties_patch_received = twin_patch_handler
except:
    # Clean up in the event of failure
    client.shutdown()
```

The `twin_patch_handler` receives and prints JSON desired property updates.

```python
    # Define behavior for receiving twin desired property patches
    def twin_patch_handler(twin_patch):
        print("Twin patch received:")
        print(twin_patch)
```

### SDK device samples

The Azure IoT SDK for Python provides a working sample of device apps that handle module identity twin tasks:

* [get_twin](https://github.com/Azure/azure-iot-sdk-python/blob/main/samples/async-hub-scenarios/get_twin.py) - Connect to a device and retrieve twin information.
* [update_twin_reported_properties](https://github.com/Azure/azure-iot-sdk-python/blob/main/samples/async-hub-scenarios/update_twin_reported_properties.py) - Update twin reported properties.
* [receive_twin_desired_properties](https://github.com/Azure/azure-iot-sdk-python/blob/main/samples/async-hub-scenarios/receive_twin_desired_properties_patch.py) - Receive and update desired properties.

## Create a backend application

This section describes how to create a backend application to retrieve and update module identity twin desired properties.

The [IoTHubRegistryManager](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager) class exposes all methods required to create a backend application to interact with module identity twins from the service.

### Service import statements

Add this `import` statement to use the service library.

```python
import sys
from azure.iot.hub import IoTHubRegistryManager
from azure.iot.hub.models import Twin, TwinProperties, QuerySpecification, QueryResult
```

### Connect to IoT hub

You can connect a backend service to IoT Hub using the following methods:

* Shared access policy
* Microsoft Entra

[!INCLUDE [iot-authentication-service-connection-string.md](iot-authentication-service-connection-string.md)]

#### Connect using a shared access policy

Connect to IoT hub using [from_connection_string](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager?#azure-iot-hub-iothubregistrymanager-from-connection-string).

The `update_module_twin` method used in this section requires the **Service Connect** shared access policy permission to add desired properties to a module. As a parameter to `from_connection_string`, supply a shared access policy connection string that includes **Service Connect** permission. For more information about shared access policies, see [Control access to IoT Hub with shared access signatures](/azure/iot-hub/authenticate-authorize-sas).

For example:

```python
# Connect to IoT hub
IOTHUB_CONNECTION_STRING = "{IoT hub shared access policy connection string}"
iothub_registry_manager = IoTHubRegistryManager.from_connection_string(IOTHUB_CONNECTION_STRING)
```

#### Connect using Microsoft Entra

[!INCLUDE [iot-hub-howto-connect-service-iothub-entra-python](iot-hub-howto-connect-service-iothub-entra-python.md)]

### Retrieve and update module identity twin desired properties

You can update desired properties from a backend application using [update_module_twin](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager?#azure-iot-hub-iothubregistrymanager-update-module-twin).

To retrieve and update module identity twin desired properties:

1. Call [get_module_twin](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager?#azure-iot-hub-iothubregistrymanager-get-module-twin) to get the current version of the module identity twin.
1. Use the [Twin](/python/api/azure-iot-hub/azure.iot.hub.protocol.models.twin(class)) class to add desired properties in JSON format.
1. Call `update_module_twin` to apply the patch to the device twin. You can also use [replace_module_twin](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager?#azure-iot-hub-iothubregistrymanager-replace-module-twin) to replace desired properties and tags for a module identity twin.

This example updates the `telemetryInterval` desired property to `122`.

```python
try:
    module_twin = iothub_registry_manager.get_module_twin(DEVICE_ID, MODULE_ID)
    print ( "" )
    print ( "Module identity twin properties before update:" )
    print ( "{0}".format(module_twin.properties) )

    # Update twin
    twin_patch = Twin()
    twin_patch.properties = TwinProperties(desired={"telemetryInterval": 122})
    updated_module_twin = iothub_registry_manager.update_module_twin(
        DEVICE_ID, MODULE_ID, twin_patch, module_twin.etag
    )
    print ( "" )
    print ( "Module identity twin properties after update     :" )
    print ( "{0}".format(updated_module_twin.properties) )

except Exception as ex:
    print ( "Unexpected error {0}".format(ex) )
except KeyboardInterrupt:
    print ( "IoTHubRegistryManager sample stopped" )
```

### SDK service sample

The Azure IoT SDK for Python provides a working sample of a service app that handles device identity module twin tasks. For more information, see  [Test IoTHub Registry Manager](https://github.com/Azure/azure-iot-hub-python/blob/8c8f315e8b26c65c5517541a7838a20ef8ae668b/tests/test_iothub_registry_manager.py).
