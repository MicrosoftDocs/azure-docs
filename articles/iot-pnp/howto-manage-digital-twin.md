---
title: How to manage IoT Plug and Play digital twins
description: How to manage IoT Plug and Play device using digital twin APIs
author: prashmo
ms.author: prashmo
ms.date: 12/17/2020
ms.topic: how-to
ms.service: iot-pnp
services: iot-pnp
---

# Manage IoT Plug and Play digital twins

IoT Plug and Play supports **Get digital twin** and **Update digital twin** operations to manage digital twins. You can use either the [REST APIs](/rest/api/iothub/service/digitaltwin) or one of the [service SDKs](libraries-sdks.md).

At the time of writing, the digital twin API version is `2020-09-30`.

## Update a digital twin

An IoT Plug and Play device implements a model described by [Digital Twins Definition Language v2 (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl). Solution developers can use the **Update Digital Twin API** to update the state of component and the properties of the digital twin.

The IoT Plug and Play device used as an example in this article implements the [Temperature Controller model](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json) with [Thermostat](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/Thermostat.json) components.

The following snippet shows the response to a **Get digital twin** request formatted as a JSON object. To learn more about the digital twin format, see [Understand IoT Plug and Play digital twins](./concepts-digital-twin.md#digital-twin-example):

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
            "lastUpdateTime": "2020-07-17T06:10:31.9609233Z"
        }
    }
}
```

Digital twins let you update an entire component or property using a [JSON Patch](http://jsonpatch.com/).

For example, you can update the `targetTemperature` property as follows:

```json
[
    {
        "op": "add",
        "path": "/thermostat1/targetTemperature",
        "value": 21.4
    }
]
```

The previous update sets the desired value of a property in the corresponding component-level `$metadata` as shown in the following snippet. IoT Hub updates the desired version of the property:

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

### Add, replace, or remove a component

Component level operations require an empty object `$metadata` marker within the value.

An add or replace component operation sets the desired values of all the provided properties. It also clears desired values for any writable properties not provided with the update.

Removing a component clears the desired values of all writable properties present. A device eventually synchronizes this removal and stops reporting the individual properties. The component is then removed from the digital twin.

The following JSON Patch sample shows how to add, replace, or remove a component:

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
        "path": "/thermostat2"
    }
]
```

### Add, replace, or remove a property

An add or replace operation sets the desired value of a property. The device can synchronize state and report an update of the value along with an `ack` code, version, and description.

Removing a property clears the desired value of property if it's set. The device can then stop reporting this property and it's removed from the component. If this property is the last one in the component, then the component is removed as well.

The following JSON Patch sample shows how to add, replace, or remove a property within a component:

```json
[
    {
        "op": "add",
        "path": "/thermostat1/targetTemperature",
        "value": 21.4
    },
    {
        "op": "replace",
        "path": "/thermostat1/anotherWritableProperty",
        "value": 42
    },
    {
        "op": "remove",
        "path": "/thermostat2/targetTemperature",
    }
]
```

### Rules for setting the desired value of a digital twin property

**Name**

The name of a component or property must be valid DTDL v2 name.

Allowed characters are a-z, A-Z, 0-9 (not as the first character), and underscore (not as the first or last character).

A name can be 1-64 characters long.

**Property value**

The value must be a valid [DTDL v2 Property](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md#property).

All primitive types are supported. Within complex types, enums, maps, and objects are supported. To learn more, see [DTDL v2 Schemas](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md#schemas).

Properties don't support array or any complex schema with an array.

A maximum depth of a five levels is supported for a complex object.

All field names within complex object should be valid DTDL v2 names.

All map keys should be valid DTDL v2 names.

## Troubleshoot update digital twin API errors

The digital twin API throws the following generic error message:

`ErrorCode:ArgumentInvalid;'{propertyName}' exists within the device twin and is not digital twin conformant property. Please refer to aka.ms/dtpatch to update this to be conformant.`

If you see this error, make sure the update patch follows the [rules for setting desired value of a digital twin property](#rules-for-setting-the-desired-value-of-a-digital-twin-property)

When you update a component, make sure that the [empty object $metadata marker](#add-replace-or-remove-a-component) is set.

Updates can fail if a device's reported values don't conform to the [IoT plug and play conventions](./concepts-convention.md#writable-properties).

## Next steps

Now that you've learned about digital twins, here are some additional resources:

- [Interact with a device from your solution](quickstart-service.md)
- [IoT Digital Twin REST API](/rest/api/iothub/service/digitaltwin)
- [Azure IoT explorer](howto-use-iot-explorer.md)
