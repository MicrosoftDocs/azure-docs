---
title: Understand IoT Plug and Play digital twins
description: Understand the digital twins when using Plug and Play preview
author: miagdp
ms.author: miag
ms.date: 07/15/2020
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
---

# Understand IoT Plug and Play digital twins

Every IoT Plug and Play device that registers with IoT Hub has a digital twin. When an IoT Plug and Play device connects to IoT Hub for the first time, an initial device twin and digital twin are populated. The information captured in [device twins](../iot-hub/iot-hub-devguide-device-twins.md) follows the IoT Plug and Play convention, where the schema is defined in the [Digital Twin Definition Language (DTDL) V2](https://github.com/Azure/opendigitaltwins-dtdl). There's a set of device facing endpoints that are designed to interact with the device twin. Digital Twin REST APIs are provided for the service backend to interact with the digital twin as a resource.

## Device twins

Device twins are JSON documents that store device state information including metadata, configurations, and conditions. Azure IoT Hub maintains a device twin for each device that you connect to IoT Hub. To learn more, see [Understand and use device twins in IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md#device-operations).

For an IoT Plug and Play device, device twins are created when a device connects. Both desired properties and reported properties are exposed in this JSON document and they're implemented using IoT Plug and Play as the convention. Any device that conforms to the IoT Plug and Play convention automatically benefits from IoT Plug and Play features. For device twins, devices can use the same set of APIs and SDKs. The same operations can be applied to device twins for both IoT Plug and Play and non-IoT Plug and Play devices. To learn more, see [Device Operations](../iot-hub/iot-hub-devguide-device-twins.md#device-operations).

The following JSON shows how properties are exposed in a device twin that's created when an IoT Plug and Play device connects. In this example, the `PnPDevice` has implemented model `dtmi:contoso:macaw;1`, and within this model there's a component `setting` that has a reported property `fanspeed`. The initial value for this property is `1`. Any device reporting a component must have the `{"t": "c"}` marker:

```json
{
  "deviceId": "PnPDevice",
  "modelId": "dtmi:contoso:macaw;1",
  "properties": {
    "reported": {
      "settings": {
        "fanSpeed": {
          "value": 1,
          "ac": 200,
          "av": 1
        },
        "__t": "c"
        },
        "$metadata": {
          "$lastUpdated": "2020-07-10T22:35:56.0487962Z",
          "settings": {
            "$lastUpdated": "2020-07-10T22:35:56.0487962Z",
            "fanSpeed": {
              "$lastUpdated": "2020-07-10T22:35:56.0487962Z",
              "value": {
                "$lastUpdated": "2020-07-10T22:35:56.0487962Z"
              },
              "ac": {
                "$lastUpdated": "2020-07-10T22:35:56.0487962Z"
              },
              "av": {
                "$lastUpdated": "2020-07-10T22:35:56.0487962Z"
              }
            },
          },
        },
        "$version": 3
    }
  },
}
```

## Digital twins

A digital twin is created when an IoT Plug and Play device connects to an IoT hub. Digital twins can be directly managed and updated by service back-end using the Digital Twin REST APIs. Operations that update digital twins trigger a digital twin change event as well as a twin change event. These events can be routed to an endpoint such as an Event hub. To learn more, see [IoT Hub message routing](../iot-hub/iot-hub-devguide-messages-d2c.md).

For the device twin example shown previously, the corresponding digital twin looks like the following JSON. The sample shows the same information of a desired property `fanspeed` within a component `setting`.

```json
{
  "$dtId": "PnPDevice",
  "settings": {
    "fanSpeed": 1,
    "$metadata": {
      "fanSpeed": {
        "ackVersion": 1,
        "ackCode": 200,
        "lastUpdateTime": "2020-07-10T22:35:56.0487962Z"
      },
    }
  },
  "$metadata": {
    "$model": "dtmi:contoso:macaw;1",
  }
}
```

To use the digital twin, a device must follow these rules:

- Rules on setting desired value of a digital twin writable property:
  - Simple key value form.
  - Name must be a valid DTDL v2 name.
  - Value must be a valid DTDL v2 value.

- Rules on reporting a digital twin property:
  - Read-only property:
    - Simple key value form.
    - Name must be a valid DTDL v2 name.
    - Value must be a valid DTDL v2 value.
  - Writable property:
    - Always needs to be in the embedded form: `value`, `ac`, and `av` are required fields.
    - Name must be a valid DTDL v2 name.
    - `value` must be a valid DTDL v2 value.
    - `ac` and `av` must be numeric values.
    - `ad` description is an optional string.

## Digital Twin REST APIs

A set of REST APIs is provided to interact with a digital twin: **Get Digital Twin**, **Invoke Component Command**, **Invoke Command**, and **Update Digital Twin**. To learn more, see [Digital Twin REST API reference](https://docs.microsoft.com/rest/api/iothub/digitaltwinmodel/digitaltwin). The following rules apply to digital twin patches:

- **Component CRUD**: Component level operations require empty object `$metadata` marker within the value:
  - **Create or Update**: Sets the desired values all properties provided and clears desired values for any properties not provided.
  - **Delete**: Clears the desired values of all the properties present. A device stops reporting the individual properties and the component is eventually removed from the digital twin.

    Examples for component CRUD operations:

    ```json
    {
      "op": "add",
      "path": "/led",
      "value": {
        "testDisplay": "test_string",
        "color": "green",
          "$metadata": {}
      }
    },
    {
      "op": "replace",
      "path": "/led",
      "value": {
        "testDisplay": "test_string",
        "color": "green",
        "$metadata": {}
      }
    },
    {
      "op": "remove", // Clears desired value of "testDisplay", "color"
      "path": "/led"
    }
    ```

- Properties CRUD
  - **Create or Update**: JSON patch value is set as the property's desired value. The device can then pick up the desired value and report an update in the embedded form with `value`, `ac`, `av`.
  - **Delete**: Clears the desired value of property if it's set. The device can then stop reporting this property and the property is removed.

    Examples for properties operations:

    ```json
    {
      "op": "add",
      "path": "/led/testDisplay",
      "value": "Test123!"
    },
    {
      "op": "replace",
      "path": "/led/color",
      "value": "Red"
    },
    {
      "op": "remove", // Clears the desired value of "timer"
      "path": "/led/timer",
    }
    ```

- Conversion between property and component types isn't supported. The object must be removed and readded with the new type.

- Desired values for root level properties are set in the root `$metadata`. For example:

  ```json
  "$metadata": {
    "$model": "dtmi:contoso:mxchip;1",
    "properties": {
        "lastUpdateTime": "2020-07-10T18:20:14.597656Z"
    },
    "irSwitch": {
      "ackVersion": 1,
      "ackCode": 200,
      "lastUpdateTime": "2020-07-10T22:43:15.3276407Z"
    },
    "current": {
      "ackVersion": 1,
      "ackCode": 200,
      "lastUpdateTime": "2020-07-10T22:43:15.3276407Z"
    }
  }
  ```

## Digital Twin change events

A digital twin change event is triggered when a desired value and version is set, and when device reports them. For example:

```json
iothub-connection-device-id: PnPDevice
iothub-enqueuedtime:7/7/2020 10:47:14 PM
iothub-message-source:digitalTwinChangeEvents
correlation-id:fe0630c28b0
content-type:application/json-patch+json
content-encoding:utf-8
[
  {
    "op": "replace",
    "path": "/settings/fanSpeed",
    "value": 5
  }
]
```

Now that you've learned about digital twins, here are some additional resources:

- [Digital Twins Definition Language (DTDL)](https://aka.ms/DTDL)
- [C device SDK](https://docs.microsoft.com/azure/iot-hub/iot-c-sdk-ref/)
- [IoT REST API](https://docs.microsoft.com/rest/api/iothub/device)
- [Model components](./concepts-components.md)


