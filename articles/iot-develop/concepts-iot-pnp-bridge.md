---
title: IoT Plug and Play bridge | Microsoft Docs
description: Understand the IoT Plug and Play bridge and how to use it to connect existing devices attached to a Windows or Linux gateway as IoT Plug and Play devices.
author: dominicbetts
ms.author: dobett
ms.date: 11/17/2022
ms.topic: conceptual
ms.service: iot-develop
services: iot-develop
ms.custom: mvc

#Customer intent: As a solution or device builder, I want to understand what the IoT Plug and Play bridge is, and how I can use it to connect existing sensors attached to a Windows or Linux PC as IoT Plug and Play devices.
---

# IoT Plug and Play bridge

The IoT Plug and Play bridge connects existing devices attached to a Windows or Linux gateway to an IoT hub as IoT Plug and Play devices. Use the bridge to map IoT Plug and Play interfaces to the telemetry the attached devices are sending, work with device properties, and invoke commands.

:::image type="content" source="media/concepts-iot-pnp-bridge/iot-pnp-bridge-high-level.png" alt-text="Diagram that shows the high-level bridge architecture. There are two existing sensors attached (both wired and wireless) to a Windows or Linux PC containing IoT Plug and Play bridge. The IoT Plug and Play bridge then connects to an IoT hub." border="false":::

IoT Plug and Play bridge is an open-source application. You can deploy the application as a standalone executable on any IoT device, industrial PC, server, or gateway that runs Windows 10 or Linux. It can also be compiled into your application code. The IoT Plug and Play bridge uses a simple configuration JSON file to identify the attached devices/peripherals that should be exposed up to Azure.

## Supported protocols and sensors

IoT Plug and Play bridge supports the following types of peripherals by default. The table includes links to the adapter documentation:

|Peripheral|Windows|Linux|
|---------|---------|---------|
|[Bluetooth sensor adapter](https://github.com/Azure/iot-plug-and-play-bridge/blob/master/pnpbridge/docs/bluetooth_sensor_adapter.md) connects detected Bluetooth Low Energy (BLE) enabled sensors.       |Yes|No|
|[Camera adapter](https://github.com/Azure/iot-plug-and-play-bridge/blob/master/pnpbridge/docs/camera_adapter.md) connects cameras on a Windows 10 device.               |Yes|No|
|[Modbus adapter](https://github.com/Azure/iot-plug-and-play-bridge/blob/master/pnpbridge/docs/modbus_adapters.md) connects sensors on a Modbus device.              |Yes|Yes|
|[MQTT adapter](https://github.com/Azure/iot-plug-and-play-bridge/blob/master/pnpbridge/docs/mqtt_adapter.md) connects devices that use an MQTT broker.                  |Yes|Yes|
|[SerialPnP adapter](https://github.com/Azure/iot-plug-and-play-bridge/blob/master/serialpnp/Readme.md) connects devices that communicate over a serial connection.               |Yes|Yes|
|[Windows USB peripherals](https://github.com/Azure/iot-plug-and-play-bridge/blob/master/pnpbridge/docs/coredevicehealth_adapter.md) uses a list of adapter-supported device interface classes to connect devices that have a specific hardware ID.  |Yes|Not Applicable|

To learn how to extend the IoT Plug and Play bridge to support other device protocols, see [Extend the IoT Plug and Play bridge](https://github.com/Azure/iot-plug-and-play-bridge/blob/master/pnpbridge/docs/author_adapter.md). To learn how to build and deploy the IoT Plug and Play bridge, see [Build and deploy the IoT Plug and Play bridge](https://github.com/Azure/iot-plug-and-play-bridge/blob/master/pnpbridge/docs/build_deploy.md).

## IoT Plug and Play bridge architecture

:::image type="content" source="media/concepts-iot-pnp-bridge/iot-pnp-bridge-components.png" alt-text="Diagram that shows the detailed bridge architecture. On the left hand side there are several boxes indicating various peripherals attached to a Windows or Linux PC containing IoT Plug and Play bridge. From the top, a box labeled configuration points toward the bridge. The bridge then connects to an IoT hub on the right side of the diagram." border="false" lightbox="media/concepts-iot-pnp-bridge/iot-pnp-bridge-components.png":::

### IoT Plug and Play bridge adapters

IoT Plug and Play bridge supports a set of IoT Plug and Play bridge adapters for various types of device. An *adapter manifest* statically defines the adapters to a bridge.

The bridge adapter manager uses the manifest to identify and call adapter functions. The adapter manager only calls the create function on the bridge adapters that are required by the interface components listed in the configuration file. An adapter instance is created for each IoT Plug and Play component.

A bridge adapter creates and acquires a digital twin interface handle. The adapter uses this handle to bind the device functionality to the digital twin.

The bridge adapter uses information in the configuration file to configure full device to digital twin communication through the bridge:

- Establishes a communication channel directly.
- Creates a device watcher to wait for a communication channel to become available.

### Configuration file

The IoT Plug and Play bridge uses a JSON-based configuration file that specifies:

- How to connect to an IoT hub or IoT Central application. Options include connection strings, authentication parameters, or the Device Provisioning Service (DPS).
- The location of the IoT Plug and Play capability models that the bridge uses. The model defines the capabilities of an IoT Plug and Play device, and is static and immutable.
- A list of IoT Plug and Play interface components and the following information for each component:
  - The interface ID and component name.
  - The bridge adapter required to interact with the component.
  - Device information that the bridge adapter needs to establish communication with the device. For example hardware ID, or specific information for an adapter, interface, or protocol.
  - An optional bridge adapter subtype or interface configuration if the adapter supports multiple communication types with similar devices. The example shows how a bluetooth sensor component could be configured:
  
      ```json
      {
        "_comment": "Component BLE sensor",
        "pnp_bridge_component_name": "blesensor1",
        "pnp_bridge_adapter_id": "bluetooth-sensor-pnp-adapter",
        "pnp_bridge_adapter_config": {
          "bluetooth_address": "267541100483311",
          "blesensor_identity" : "Blesensor1"
        }
      }
      ```
  
- An optional list of global bridge adapter parameters. For example, the bluetooth sensor bridge adapter has a dictionary of supported configurations. An interface component that requires the bluetooth sensor adapter can pick one of these configurations as its `blesensor_identity`:

    ```json
    {
      "pnp_bridge_adapter_global_configs": {
        "bluetooth-sensor-pnp-adapter": {
          "Blesensor1" : {
            "company_id": "0x499",
            "endianness": "big",
            "telemetry_descriptor": [
              {
                "telemetry_name": "humidity",
                "data_parse_type": "uint8",
                "data_offset": 1,
                "conversion_bias": 0,
                "conversion_coefficient": 0.5
              },
              {
                "telemetry_name": "temperature",
                "data_parse_type": "int8",
                "data_offset": 2,
                "conversion_bias": 0,
                "conversion_coefficient": 1.0
              },
              {
                "telemetry_name": "pressure",
                "data_parse_type": "int16",
                "data_offset": 4,
                "conversion_bias": 0,
                "conversion_coefficient": 1.0
              },
              {
                "telemetry_name": "acceleration_x",
                "data_parse_type": "int16",
                "data_offset": 6,
                "conversion_bias": 0,
                "conversion_coefficient": 0.00980665
              },
              {
                "telemetry_name": "acceleration_y",
                "data_parse_type": "int16",
                "data_offset": 8,
                "conversion_bias": 0,
                "conversion_coefficient": 0.00980665
              },
              {
                "telemetry_name": "acceleration_z",
                "data_parse_type": "int16",
                "data_offset": 10,
                "conversion_bias": 0,
                "conversion_coefficient": 0.00980665
              }
            ]
          }
        }
      }
    }
    ```

## Download IoT Plug and Play bridge

You can download a pre-built version of the bridge with supported adapters from [IoT Plug and Play bridge releases](https://github.com/Azure/iot-plug-and-play-bridge/releases) and expand the list of assets for the most recent release. Download the most recent version of the application for your operating system.

You can also download and view the source code of [IoT Plug and Play bridge on GitHub](https://github.com/Azure/iot-plug-and-play-bridge).

## Next steps

Now that you have an overview of the architecture of IoT Plug and Play bridge, the next steps are to learn more about:

- [How to connect an IoT Plug and Play bridge sample running on Linux or Windows to IoT Hub](https://github.com/Azure/iot-plug-and-play-bridge/blob/master/pnpbridge/docs/quick_start.md)
- [Build and deploy IoT Plug and Play bridge](https://github.com/Azure/iot-plug-and-play-bridge/blob/master/pnpbridge/docs/build_deploy.md)
- [Extend IoT Plug and Play bridge](https://github.com/Azure/iot-plug-and-play-bridge/blob/master/pnpbridge/docs/author_adapter.md)
- [IoT Plug and Play bridge on GitHub](https://github.com/Azure/iot-plug-and-play-bridge)
