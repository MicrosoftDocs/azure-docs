---
title: How to manage IoT Plug and Play digital twin
description: How to manage IoT Plug and Play Preview device using digital twin
author: prashmo
ms.author: prashmo
ms.date: 07/20/2020
ms.topic: how-to
ms.service: iot-pnp
services: iot-pnp
---

# Manage Digital Twin

IoT plug and Play comes equipped with **Get Digital** and **Update Digital Twin** for managing digital twin. You can either use the [REST APIs](https://docs.microsoft.com/rest/api/iothub/service/digitaltwin) directly or use the [Service SDK](./libraries-sdks.md).

The most current digital twin API version for public preview is _**2020-05-31-preview**_.

## Update Digital Twin

An IoT Plug and Play device implements a model described by Digital Twins Definition Language (DTDL). IoT Plug and Play uses [DTDL *version 2*](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md). Solution developers can leverage **Update Digital Twin API** to update the state of component and/or properties of the digital twin.

The IoT plug and play device in this article that implements [Temperature Controller model](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json) with [Thermostat](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/Thermostat.json) component.

The following snippet shows the Get digital twin response formatted as a JSON object. To learn more about the digital twin format, see [Understand IoT Plug and Play digital twins](./concepts-digital-twin#digital-twin-json-format)

```json
{
    "$dtId": "sample-device",
    "serialNumber": "alwinexlepaho8329",
    "thermostat1": {
        "maxTempSinceLastReboot": 25.3,
        "targetTemperature": 20.4,
        "$metadata": {
            "targetTemperature": {
                "desiredValue": 20.4,
                "desiredVersion": 4,
                "ackVersion": 4,
                "ackCode": 200,
                "ackDescription": "Successfully executed patch",
                "lastUpdateTime": "2020-07-17T06:11:04.9309159Z"
            },
            "maxTempSinceLastReboot": {
                "lastUpdateTime": "2020-07-17T06:10:31.9609233Z"
            }
        }
    },
    "$metadata": {
        "$model": "dtmi:com:example:TemperatureController;1",
        "serialNumber": {
            "desiredValue": "alwinexlepaho8329-a",
            "desiredVersion": 2,
            "ackVersion": 1,
            "ackCode": 200,
            "lastUpdateTime": "2020-07-17T06:10:31.9609233Z"
        }
    }
}
```

Digital twin for a device allows updating an entire Component or Property using [JSON Patch](http://jsonpatch.com/).

For example, `targetTemperature` property can be updated as follows:

```json
[
    {
        "op": "add",
        "path": "/thermostat1/targetTemperature",
        "value": 21.4
    }
]
```

The above update results in the desired value of a property is set within corresponding root-level or component level `$metadata` as follows. IoT Hub updates the desired version of the property.

```json
"thermostat1": {
    "targetTemperature": 20.4,
    "$metadata": {
        "targetTemperature": {
            "desiredValue": 21.4,
            "desiredVersion": 5,
            "ackVersion": 4,
            "ackCode": 200,
            "ackDescription": "Successfully executed patch",
            "lastUpdateTime": "2020-07-17T06:11:04.9309159Z"
        }
    }
}
```

### Add, replace or remove a component

Component level operations requires empty object $metadata marker within value.
Add or replace component sets the desired values of all properties provided. It also clears desired values for any writable properties not provided within the update.

Removing a component clears the desired values of all writable properties present. Device can eventually synchronize this removal and stop reporting the individual properties. Post that component is removed from Digital Twin.

Below JSON Patch sample enumerates how to add, replace or remove a component.

```json
[
    {
        "op": "add",
        "path": "/thermostat1",
        "value": {
            "targetTemperature": 21.4,
            "anotherWritableProperty": 42,
            "$metadata": {}
        }
    },
    {
        "op": "replace",
        "path": "/thermostat1",
        "value": {
            "targetTemperature": 21.4,
            "$metadata": {}
        }
    },
    {
        "op": "remove",
        "path": "/thermostat1"
    }
]
```

### Add, replace or remove a property

Add or replace sets the desired value of the property. The device can synchronize state and report an update of the value along with ack code, version and description.

Removing a property clears the desired value of property if it is set. Device can then stop reporting this property and it is removed from the root-level or from the component. If this is the last property within the component, then the component is removed as well.

Below JSON Patch sample enumerates how to add, replace or remove a property within a component.

```json
[
    {
        "op": "add",
        "path": "/thermostat1/targetTemperature",
        "value": 21.4
    },
    {
        "op": "replace",
        "path": "/thermostat1/targetTemperature",
        "value": 21.4
    },
    {
        "op": "remove",
        "path": "/thermostat1/targetTemperature",
    }
]
```

## Rules for setting desired value of a digital twin property

### **Name**

Name of a component or property must be valid DTDL v2 name.

Allowed characters are a-z, A-Z, 0-9 (not as the first character), and underscore(not as the first or last character).

Name can be 1-64 characters long.

### **Property value**

Value must be valid [DTDL v2 Property](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md#property).

All primitive types are supported. Within complex types enum, maps and objects are supported. To learn more, see [DTDL v2 Schemas](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md#schemas).

Properties do not support array or any complex schema with array.

Maximum depth of a 5 levels is supported for a complex object.

All field names within complex object should be valid DTDL v2 name.

All map keys should be valid DTDL v2 name.

## Troubleshooting Update Digital Twin API Errors

Update Digital Twin API throws the below generic error message within preview. The next version of the API will have more actionable error messages.

_**ErrorCode:ArgumentInvalid;'{propertyName}' exists within the device twin and is not digital twin conformant property. Please refer to aka.ms/dtpatch to update this to be conformant.**_

Please make sure the update patch follows the [rules for setting desired value of a digital twin property](./howto-manage-digital-twin#Rules-for-setting-desired-value-of-a-digital-twin-property)

When updating a component, please make sure that the [empty object $metadata marker](./howto-manage-digital-twin#Add,-replace-or-remove-a-component) is set.

Updates may also fail if device reported values are not conforming to [IoT plug and play conventions](./concepts-convention#writable-properties).

## Next steps

Now that you've learned about digital twins, here are some additional resources:

- [Interact with a device from your solution](./quickstart-service-node)
- [IoT Digital Twin REST API](https://docs.microsoft.com/rest/api/iothub/service/digitaltwin)
- [Azure IoT explorer](./howto-install-iot-explorer.md)
