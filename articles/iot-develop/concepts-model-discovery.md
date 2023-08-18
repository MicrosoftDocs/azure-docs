---
title: Use IoT Plug and Play models in a solution | Microsoft Docs
description: As a solution builder, learn about how you can use IoT Plug and Play models in your IoT solution.
author: dominicbetts
ms.author: dobett
ms.date: 11/17/2022
ms.topic: conceptual
ms.service: iot-develop
services: iot-develop
---

# Use IoT Plug and Play models in an IoT solution

This article describes how, in an IoT solution, you can identify model ID of an IoT Plug and Play device and then retrieve its model definition.

There are two broad categories of IoT solution:

- A *purpose-built solution* works with a known set of models for the IoT Plug and Play devices that connect to the solution. You use these models when you develop the solution.

- A *model-driven solution* works with the model of any IoT Plug and Play device. Building a model-driven solution is more complex, but the benefit is that your solution works with any devices that are added in the future. A model-driven IoT solution retrieves a model and uses it to determine the telemetry, properties, and commands the device implements.

To use an IoT Plug and Play model, an IoT solution:

1. Identifies the model ID of the model implemented by the IoT Plug and Play device, module, or IoT Edge module connected to the solution.

1. Uses the model ID to retrieve the model definition of the connected device from a model repository or custom store.

## Identify model ID

When an IoT Plug and Play device connects to IoT Hub, it registers the model ID of the model it implements with IoT Hub.

IoT Hub notifies the solution with the device model ID as part of the device connection flow.

A solution can get the model ID of the IoT Plug and Play device by using one of the following three methods:

### Get Device Twin API

The solution can use the [Get Device Twin](/java/api/com.microsoft.azure.sdk.iot.device.deviceclient.getdevicetwin) API to retrieve model ID of the IoT Plug and Play device.

> [!TIP]
> For modules and IoT Edge modules, use [ModuleClient.getTwin](/java/api/com.microsoft.azure.sdk.iot.device.moduleclient.gettwin).

In the following device twin response snippet, `modelId` contains the model ID of an IoT Plug and Play device:

```json
{
    "deviceId": "sample-device",
    "etag": "AAAAAAAAAAc=",
    "deviceEtag": "NTk0ODUyODgx",
    "status": "enabled",
    "statusUpdateTime": "0001-01-01T00:00:00Z",
    "connectionState": "Disconnected",
    "lastActivityTime": "2020-07-17T06:12:26.8402249Z",
    "cloudToDeviceMessageCount": 0,
    "authenticationType": "sas",
    "x509Thumbprint": {
        "primaryThumbprint": null,
        "secondaryThumbprint": null
    },
    "modelId": "dtmi:com:example:TemperatureController;1",
    "version": 15,
    "properties": {...}
    }
}
```

### Get Digital Twin API

The solution can use the [Get Digital Twin](/rest/api/iothub/service/digitaltwin/getdigitaltwin) API to retrieve the model ID of the model implemented by the IoT Plug and Play device.

In the following digital twin response snippet, `$metadata.$model` contains the model ID of an IoT Plug and Play device:

```json
{
    "$dtId": "sample-device",
    "$metadata": {
        "$model": "dtmi:com:example:TemperatureController;1",
        "serialNumber": {
            "lastUpdateTime": "2020-07-17T06:10:31.9609233Z"
        }
    }
}
```

### Digital twin change event notification

A device connection results in a [Digital Twin change event](concepts-digital-twin.md#digital-twin-change-events) notification. A solution needs to subscribe to this event notification. To learn how to enable routing for digital twin events, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](../iot-hub/iot-hub-devguide-messages-d2c.md#non-telemetry-events).

The solution can use the event shown in the following snippet to learn about the IoT Plug and Play device that's connecting and get its model ID:

```json
iothub-connection-device-id:sample-device
iothub-enqueuedtime:7/22/2020 8:02:27 PM
iothub-message-source:digitalTwinChangeEvents
correlation-id:100f322dc2c5
content-type:application/json-patch+json
content-encoding:utf-8
[
  {
    "op": "replace",
    "path": "/$metadata/$model",
    "value": "dtmi:com:example:TemperatureController;1"
  }
]
```

## Retrieve a model definition

A solution uses model ID identified above to retrieve the corresponding model definition.

A solution can get the model definition by using one of the following options:

### Model repository

Solutions can use the [model repository](concepts-model-repository.md) to retrieve models. Either the device builders or the solution builders must upload their models to the repository beforehand so the solution can retrieve them.

After you identify the model ID for a new device connection, follow these steps:

1. Retrieve the model definition using the model ID from the model repository. For more information, see [Device model repository](concepts-model-repository.md).

1. Using the model definition of the connected device, you can enumerate the capabilities of the device.

1. Using the enumerated capabilities of the device, you can enable users to [interact with the device](tutorial-service.md).

### Custom store

Solutions can store these model definitions in a local file system, in a public file store, or use a custom implementation.

After you identify the model ID for a new device connection, follow these steps:

1. Retrieve the model definition using the model ID from your custom store.

1. Using the model definition of the connected device, you can enumerate the capabilities of the device.

1. Using the enumerated capabilities of the device, you can enable users to [interact with the device](tutorial-service.md).  

## Next steps

Now that you've learned how to integrate IoT Plug and Play models in an IoT solution, some suggested next steps are:

- [Interact with a device from your solution](tutorial-service.md)
- [IoT Digital Twin REST API](/rest/api/iothub/service/digitaltwin)
- [Azure IoT explorer](../iot/howto-use-iot-explorer.md)
