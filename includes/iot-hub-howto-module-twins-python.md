---
title: Get started with module identity and module twins (Python)
titleSuffix: Azure IoT Hub
description: Learn how to create module identities and update module twins using the Azure IoT Hub SDK for Python.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: python
ms.topic: include
ms.date: 09/03/2024
ms.custom: mqtt, devx-track-python, py-fresh-zinc
---

## Overview

This article describes how to use the [Azure IoT SDK for Python](https://github.com/Azure/azure-iot-sdk-python) to create device and backend service application code for module twins.

## Install packages

The azure-iot-device library must be installed to create device applications.

```cmd/sh
pip install azure-iot-device
```

The azure-iot-hub library must be installed to create backend service applications.

```cmd/sh
pip install azure-iot-hub
```

The msrest library is used to catch HTTPOperationError exceptions.

```cmd/sh
pip install msrest
```

## Create a device application

Device applications can read and write module twin reported properties, and be notified of desired module twin property changes that are set by a backend application or IoT Hub.

This section describes how to use device application code to:

* Retrieve module twin and examine reported properties
* Update reported module twin properties
* Create a module desired property update callback handler

### Import statements

Add this `import` statement to use the device library.

```python
# import the device client library
import asyncio
from azure.iot.device.aio import IoTHubDeviceClient
```

### Connect to a device

This section shows how to connect an application to a device using a device primary key that includes a shared access key.

The [IoTHubModuleClient](/python/api/azure-iot-device/azure.iot.device.iothubmoduleclient) class contains methods that can be used to work with module twins.

To connect an application to a device:

1. Call [create_from_connection_string](/python/api/azure-iot-device/azure.iot.device.iothubmoduleclient?#azure-iot-device-iothubmoduleclient-create-from-connection-string) to add the device connection string
1. Call [connect](/python/api/azure-iot-device/azure.iot.device.iothubmoduleclient?#azure-iot-device-iothubmoduleclient-connect) to connect the device client to an Azure IoT hub

```python
# import the device client library
import asyncio
from azure.iot.device.aio import IoTHubDeviceClient

# substitute the device connection string in conn_str
# and add it to the IoTHubDeviceClient object
conn_str = "{IOT hub device connection string}"
device_client = IoTHubDeviceClient.create_from_connection_string(conn_str)

# connect the application to the device
await device_client.connect()
```

### Retrieve a device twin and examine reported properties

You can retrieve and examine device module properties.

Call [get_twin](/python/api/azure-iot-device/azure.iot.device.iothubmoduleclient?#azure-iot-device-iothubmoduleclient-get-twin) to get the module twin from the Azure IoT Hub service. The twin information is placed into a variable that can be printed or examined.

This example retrieves the device twin and uses the `print` command to view the device twin in JSON format.

```python
# get the twin
twin = await device_client.get_twin()
print("Twin document:")
print("{}".format(twin))
```

### Patch reported device twin properties

You can apply a patch to update device reported properties in JSON format.

To apply a patch to update reported properties:

1. Assign a reported property JSON patch to a variable.
1. Call [patch_twin_reported_properties](/python/api/azure-iot-device/azure.iot.device.iothubmoduleclient?#azure-iot-device-iothubmoduleclient-patch-twin-reported-properties) to apply the JSON patch to reported properties. This is a synchronous call, meaning that this function does not return until the patch is sent to the service and acknowledged.

If `patch_twin_reported_properties` returns an error, this function raises the corresponding error.

```python
# create the reported properties patch
reported_properties = {"temperature": random.randint(320, 800) / 10}
print("Setting reported temperature to {}".format(reported_properties["temperature"]))
# update the reported properties and wait for the result
await device_client.patch_twin_reported_properties(reported_properties)
```

### Incoming desired properties patch handler

Call [on_twin_desired_properties_patch_received](/python/api/azure-iot-device/azure.iot.device.iothubmoduleclient?#azure-iot-device-iothubmoduleclient-on-twin-desired-properties-patch-received) to create a handler function or coroutine that is called when a twin desired properties patch is received. The handler takes one argument, which is the twin patch in the form of a JSON dictionary object.

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

The Azure IoT SDK for Python includes the following samples:

* [get_twin](https://github.com/Azure/azure-iot-sdk-python/blob/main/samples/async-hub-scenarios/get_twin.py) - Connect to a device and retrieve twin information.
* [update_twin_reported_properties](https://github.com/Azure/azure-iot-sdk-python/blob/main/samples/async-hub-scenarios/update_twin_reported_properties.py) - Update twin reported properties.
* [receive_twin_desired_properties](https://github.com/Azure/azure-iot-sdk-python/blob/main/samples/async-hub-scenarios/receive_twin_desired_properties_patch.py) - Receive and update desired properties.

## Create a backend application

A backend application connects to a device through IoT Hub and can read module reported and desired properties, and write module desired properties.

This section describes how to create a backend application to:

* Create a module
* Update desired properties

The [IoTHubRegistryManager](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager) class exposes all methods required to create a backend application to interact with module twins from the service.

### Service import statements

Add this `import` statement to use the service library.

```python
import sys
from azure.iot.hub import IoTHubRegistryManager
from azure.iot.hub.models import Twin, TwinProperties, QuerySpecification, QueryResult
```

### Connect to IoT hub

Connect to IoT hub using [from_connection_string](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager?#azure-iot-hub-iothubregistrymanager-from-connection-string).

The SDK methods in this section require shared access policy permissions that includes the following:

* **Registry Write** - required to add a module (or device) to the IoT Hub registry
* **Service Connect** - required to add desired properties to a module

As a parameter to `CreateFromConnectionString`, supply a shared access policy connection string that includes these permissions. For more information about shared access policies, see [Control access to IoT Hub with shared access signatures](/azure/iot-hub/authenticate-authorize-sas).

For example:

```python
# Connect to IoT hub
IOTHUB_CONNECTION_STRING = "{IoT hub shared access policy connection string}"
iothub_registry_manager = IoTHubRegistryManager.from_connection_string(IOTHUB_CONNECTION_STRING)
```

### Create a module

Use [create_module_with_sas](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager?#azure-iot-hub-iothubregistrymanager-create-module-with-sas) to create a module using a shared access key.

This example creates a new module named `myFirstModule` for device `myFirstDevice`. If the module already exists, the code calls [get_module](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager?#azure-iot-hub-iothubregistrymanager-get-module) to retrieve the module identity for the device from IoT Hub.

```python
DEVICE_ID = "myFirstDevice"
MODULE_ID = "myFirstModule"

try:
    # CreateModule - let IoT Hub assign keys
    primary_key = ""
    secondary_key = ""
    managed_by = ""
    new_module = iothub_registry_manager.create_module_with_sas(
        DEVICE_ID, MODULE_ID, managed_by, primary_key, secondary_key
    )
except HttpOperationError as ex:
    if ex.response.status_code == 409:
        # 409 indicates a conflict. This happens because the module already exists.
        new_module = iothub_registry_manager.get_module(DEVICE_ID, MODULE_ID)
    else:
        raise
```

### Update desired properties

You can update both module twin tags and desired properties from a backend application at the same time using [update_module_twin](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager?#azure-iot-hub-iothubregistrymanager-update-module-twin).

1. Call [get_module_twin](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager?#azure-iot-hub-iothubregistrymanager-get-module-twin) to get the current version of the module twin
1. Use the [Twin](/python/api/azure-iot-hub/azure.iot.hub.protocol.models.twin(class)) class to add module tags and properties in JSON format.
1. Call `update_module_twin` to apply the patch to the device twin. You can also use [replace_module_twin](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager?#azure-iot-hub-iothubregistrymanager-replace-module-twin) to replace desired properties and tags for a module twin.

This example updates the `telemetryInterval` desired property to `122`.

```python
try:
    module_twin = iothub_registry_manager.get_module_twin(DEVICE_ID, MODULE_ID)
    print ( "" )
    print ( "Module twin properties before update    :" )
    print ( "{0}".format(module_twin.properties) )

    # Update twin
    twin_patch = Twin()
    twin_patch.properties = TwinProperties(desired={"telemetryInterval": 122})
    updated_module_twin = iothub_registry_manager.update_module_twin(
        DEVICE_ID, MODULE_ID, twin_patch, module_twin.etag
    )
    print ( "" )
    print ( "Module twin properties after update     :" )
    print ( "{0}".format(updated_module_twin.properties) )

except Exception as ex:
    print ( "Unexpected error {0}".format(ex) )
except KeyboardInterrupt:
    print ( "IoTHubRegistryManager sample stopped" )
```

### SDK service sample

The Azure IoT SDK for Python provides a working sample of a service app that handles device twin tasks. For more information, see  [Registry Manager Query Sample](https://github.com/Azure/azure-iot-hub-python/blob/main/samples/iothub_registry_manager_query_sample.py).
