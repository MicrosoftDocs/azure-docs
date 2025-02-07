---
title: Get started with Azure IoT Hub device twins (Python)
titleSuffix: Azure IoT Hub
description: How to use the Azure IoT SDK for Python to create device and backend service application code for device twins.
author: kgremban
ms.author: kgremban
ms.service: azure-iot-hub
ms.devlang: python
ms.topic: include
ms.date: 07/12/2024
ms.custom: mqtt, devx-track-python, py-fresh-zinc
---

  * Python SDK - [Python version 3.7 or later](https://www.python.org/downloads/) is recommended. Make sure to use the 32-bit or 64-bit installation as required by your setup. When prompted during the installation, make sure to add Python to your platform-specific environment variable.

## Overview

This article describes how to use the [Azure IoT SDK for Python](https://github.com/Azure/azure-iot-sdk-python) to create device and backend service application code for device twins.

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

Device applications can read and write twin reported properties, and be notified of desired twin property changes that are set by a backend application or IoT Hub.

The [IoTHubDeviceClient](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient) class contains methods that can be used to work with device twins.

This section describes how to create device application code that:

* Retrieves a device twin and examine reported properties
* Patch reported device twin properties

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

### Retrieve a device twin and examine reported properties

You can retrieve and examine device twin information including tags and properties. The device twin information retrieved matches device twin JSON-formatted data that you can view for a device in the Azure portal.

Call [get_twin](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient?#azure-iot-device-iothubdeviceclient-get-twin) to get the device  twin from the Azure IoT Hub service. The twin information is placed into a variable that can be printed or examined.

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
1. Call [patch_twin_reported_properties](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient?#azure-iot-device-iothubdeviceclient-patch-twin-reported-properties) to apply the JSON patch to reported properties. This is a synchronous call, meaning that this function does not return until the patch is sent to the service and acknowledged.

If `patch_twin_reported_properties` returns an error, this function raises the corresponding error.

```python
# create the reported properties patch
reported_properties = {"temperature": random.randint(320, 800) / 10}
print("Setting reported temperature to {}".format(reported_properties["temperature"]))
# update the reported properties and wait for the result
await device_client.patch_twin_reported_properties(reported_properties)
```

You can also call these methods to update device twins:

* Call [replace_twin](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager?#azure-iot-hub-iothubregistrymanager-replace-twin) to replace device twin tags and desired properties.
* Call [update_twin](/en-us/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager?#azure-iot-hub-iothubregistrymanager-update-twin) to update device twin tags and desired properties.

### Incoming desired properties patch handler

Call [on_twin_desired_properties_patch_received](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient?&#azure-iot-device-iothubdeviceclient-on-twin-desired-properties-patch-received) to create a handler function or coroutine that is called when a twin desired properties patch is received. The handler takes one argument, which is the twin patch in the form of a JSON dictionary object.

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

A backend application connects to a device through IoT Hub and can read device reported and desired properties, write device desired properties, and run device queries.

This section describes how to create a backend application to:

* Update twin tags and desired properties
* Queries devices using filters on the tags and properties

The [IoTHubRegistryManager](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager) class exposes all methods required to create a backend application to interact with device twins from the service.

### Connect to IoT hub

You can connect a backend service to IoT Hub using the following methods:

* Shared access policy
* Microsoft Entra

[!INCLUDE [iot-authentication-service-connection-string.md](iot-authentication-service-connection-string.md)]

#### Connect using a shared access policy

Connect to IoT hub using [from_connection_string](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager?#azure-iot-hub-iothubregistrymanager-from-connection-string). Your application needs the **service connect** permission to modify desired properties of a device twin, and it needs **registry read** permission to query the identity registry. There is no default shared access policy that contains only these two permissions, so you need to create one if a one does not already exist. Supply this shared access policy connection string as a parameter to `fromConnectionString`. For more information about shared access policies, see [Control access to IoT Hub with shared access signatures](/azure/iot-hub/authenticate-authorize-sas).

For example:

```python
import sys
from time import sleep
from azure.iot.hub import IoTHubRegistryManager
from azure.iot.hub.models import Twin, TwinProperties, QuerySpecification, QueryResult

# Connect to IoT hub
IOTHUB_CONNECTION_STRING = "{IoT hub service connection string}"
iothub_registry_manager = IoTHubRegistryManager.from_connection_string(IOTHUB_CONNECTION_STRING)
```

#### Connect using Microsoft Entra

[!INCLUDE [iot-hub-howto-connect-service-iothub-entra-python](iot-hub-howto-connect-service-iothub-entra-python.md)]

### Update twin tags and desired properties

You can update both device twin tags and desired properties from a backend application at the same time using [update_twin](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager?#azure-iot-hub-iothubregistrymanager-update-twin).

1. Call [get_twin](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager?#azure-iot-hub-iothubregistrymanager-get-twin) to get the current version of the device twin
1. Use the [Twin](/python/api/azure-iot-hub/azure.iot.hub.protocol.models.twin(class)) class to add tags and properties in JSON format.
1. Call `update_twin` to apply the patch to the device twin. You can also use [replace_twin](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager?#azure-iot-hub-iothubregistrymanager-replace-twin) to replace desired properties and tags for a device twin.

This example updates `region` and `plant` tag information, and sets a `power_level` desired property to `1`.

```python
new_tags = {
        'location' : {
            'region' : 'US',
            'plant' : 'Redmond43'
        }
    }

DEVICE_ID = "[Device Id]"
twin = iothub_registry_manager.get_twin(DEVICE_ID)
twin_patch = Twin(tags=new_tags, properties= TwinProperties(desired={'power_level' : 1}))
twin = iothub_registry_manager.update_twin(DEVICE_ID, twin_patch, twin.etag)
```

### Create a device twin query

You can query device twin information using device twin queries. Device twin queries are SQL-like queries that return a result set of device twins.

To use a device twin query:

1. Use a [QuerySpecification](/python/api/azure-iot-hub/azure.iot.hub.protocol.models.queryspecification) object to define a SQL-like query request.

1. Use [query_iot_hub](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager?#azure-iot-hub-iothubregistrymanager-query-iot-hub) to query an IoTHub and retrieve device twin information using the SQL-like query specification.

This example runs two queries. The first selects only the device twins of devices located in the `Redmond43` plant, and the second refines the query to select only the devices that are also connected through a cellular network. Results are printed after each query.

```python
query_spec = QuerySpecification(query="SELECT * FROM devices WHERE tags.location.plant = 'Redmond43'")
query_result = iothub_registry_manager.query_iot_hub(query_spec, None, 100)
print("Devices in Redmond43 plant: {}".format(', '.join([twin.device_id for twin in query_result.items])))

print()

query_spec = QuerySpecification(query="SELECT * FROM devices WHERE tags.location.plant = 'Redmond43' AND properties.reported.connectivity = 'cellular'")
query_result = iothub_registry_manager.query_iot_hub(query_spec, None, 100)
print("Devices in Redmond43 plant using cellular network: {}".format(', '.join([twin.device_id for twin in query_result.items])))

print()
```

### SDK service sample

The Azure IoT SDK for Python provides a working sample of a service app that handles device twin tasks. For more information, see  [Registry Manager Query Sample](https://github.com/Azure/azure-iot-hub-python/blob/main/samples/iothub_registry_manager_query_sample.py).
