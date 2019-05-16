---
title: Device schema in remote monitoring solution - Azure | Microsoft Docs
description: This article describes the JSON schema that defines a simulated device in the remote monitoring solution.
author: dominicbetts
manager: philmea
ms.author: dobett
ms.service: iot-accelerators
services: iot-accelerators
ms.date: 12/18/2018
ms.topic: conceptual
---

# Understand the device model schema

You can use simulated devices in the Remote Monitoring solution to test its behavior. The Remote Monitoring solution includes a device simulation service to run simulated devices. When you deploy the Remote Monitoring solution, a collection of simulated devices is provisioned automatically. You can customize the existing simulated devices or create your own.

This article describes the device model schema that specifies the capabilities and behavior of a simulated device. The device model is stored in a JSON file.

> [!NOTE]
> This device model schema is only for simulated devices hosted in the device simulation service. If you want to create a real device, see [Connect your device to the Remote Monitoring solution accelerator](iot-accelerators-connecting-devices.md).

The following articles are related to the current article:

* [Implement the device model behavior](iot-accelerators-remote-monitoring-device-behavior.md) describes the JavaScript files you use to implement the behavior of a simulated device.
* [Create a new simulated device](iot-accelerators-remote-monitoring-create-simulated-device.md) puts it all together and shows you how to deploy a new simulated device type to your solution.

In this article, you learn how to:

>[!div class="checklist"]
> * Use a JSON file to define a simulated device model
> * Specify the properties the simulated device
> * Specify the telemetry the simulated device sends
> * Specify the cloud-to-device methods the device responds to

## The parts of the device model schema

Each device model, such as a chiller or truck, defines a type of device the simulation service can simulate. Each device model is stored in a JSON file with the following top-level schema:

```json
{
  "SchemaVersion": "1.0.0",
  "Id": "elevator-01",
  "Version": "0.0.1",
  "Name": "Elevator",
  "Description": "Elevator with floor, vibration and temperature sensors.",
  "Protocol": "AMQP",
  "Simulation": {
    // Specify the simulation behavior
  },
  "Properties": {
    // Define properties
  },
  "Telemetry": [
    // Specify telemetry
  ],
  "CloudToDeviceMethods": {
    // Specify methods
  }
}
```

You can view the schema files for the default simulated devices in the [devicemodels folder](https://github.com/Azure/device-simulation-dotnet/tree/master/Services/data/devicemodels) on GitHub.

The following table describes the top-level schema entries:

| Schema entry | Description |
| -- | --- |
| `SchemaVersion` | The schema version is always `1.0.0` and is specific to the format of this file. |
| `Id` | A unique ID for this device model. |
| `Version` | Identifies the version of the device model. |
| `Name` | A friendly name for the device model. |
| `Description` | A description of the device model. |
| `Protocol` | The connection protocol the device uses. Can be one of `AMQP`, `MQTT`, and `HTTP`. |

The following sections describe the other sections in the JSON schema:

## Simulation

In the `Simulation` section, you define the internal state of the simulated device. Any telemetry values sent by the device must be part of this device state.

The definition of the device state has two elements:

* `InitialState` defines initial values for all the properties of the device state object.
* `Script` identifies a JavaScript file that runs on a schedule to update the device state. You can use this script file to randomize the telemetry values sent by the device.

To learn more about the JavaScript file that updates the device state object, see [Understand the device model behavior](../../articles/iot-accelerators/iot-accelerators-device-simulation-advanced-device.md).

The following example shows the definition of the device state object for a simulated chiller device:

```json
"Simulation": {
  "InitialState": {
    "online": true,
    "temperature": 75.0,
    "temperature_unit": "F",
    "humidity": 70.0,
    "humidity_unit": "%",
    "pressure": 150.0,
    "pressure_unit": "psig",
    "simulation_state": "normal_pressure"
  },
  "Interval": "00:00:10",
  "Scripts": {
    "Type": "javascript",
    "Path": "chiller-01-state.js"
  }
}
```

The simulation service runs the **chiller-01-state.js** file every five seconds to update the device state. You can see the JavaScript files for the default simulated devices in the [scripts folder](https://github.com/Azure/device-simulation-dotnet/tree/master/Services/data/devicemodels/scripts) on GitHub. By convention, these JavaScript files have the suffix **-state** to distinguish them from the files that implement method behaviors.

## Properties

The `Properties` section of the schema defines the property values the device reports to the solution. For example:

```json
"Properties": {
  "Type": "Elevator",
  "Location": "Building 2",
  "Latitude": 47.640792,
  "Longitude": -122.126258
}
```

When the solution starts, it queries all the simulated devices to build a list of `Type` values to use in the UI. The solution uses the `Latitude` and `Longitude` properties to add the location of the device to the map on the dashboard.

## Telemetry

The `Telemetry` array lists all the telemetry types the simulated device sends to the solution.

The following example sends a JSON telemetry message every 10 seconds with `floor`, `vibration`, and `temperature` data from the elevator's sensors:

```json
"Telemetry": [
  {
    "Interval": "00:00:10",
    "MessageTemplate": "{\"floor\":${floor},\"vibration\":${vibration},\"vibration_unit\":\"${vibration_unit}\",\"temperature\":${temperature},\"temperature_unit\":\"${temperature_unit}\"}",
    "MessageSchema": {
      "Name": "elevator-sensors;v1",
      "Format": "JSON",
      "Fields": {
        "floor": "integer",
        "vibration": "double",
        "vibration_unit": "text",
        "temperature": "double",
        "temperature_unit": "text"
      }
    }
  }
]
```

`MessageTemplate` defines the structure of the JSON message sent by the simulated device. The placeholders in `MessageTemplate` use the syntax `${NAME}` where `NAME` is a key from the [device state object](#simulation). Strings should be quoted, numbers should not.

`MessageSchema` defines the schema of the message sent by the simulated device. The message schema is also published to IoT Hub to enable backend applications to reuse the information to interpret the incoming telemetry.

Currently, you can only use JSON message schemas. The fields listed in the schema can be of the following types:

* Object - serialized using JSON
* Binary - serialized using base64
* Text
* Boolean
* Integer
* Double
* DateTime

To send telemetry messages at different intervals, add multiple telemetry types to the `Telemetry` array. The following example sends temperature and humidity data every 10 seconds and the state of the light every minute:

```json
"Telemetry": [
  {
    "Interval": "00:00:10",
    "MessageTemplate":
      "{\"temperature\":${temperature},\"temperature_unit\":\"${temperature_unit}\",\"humidity\":\"${humidity}\"}",
    "MessageSchema": {
      "Name": "RoomComfort;v1",
      "Format": "JSON",
      "Fields": {
        "temperature": "double",
        "temperature_unit": "text",
        "humidity": "integer"
      }
    }
  },
  {
    "Interval": "00:01:00",
    "MessageTemplate": "{\"lights\":${lights_on}}",
    "MessageSchema": {
      "Name": "RoomLights;v1",
      "Format": "JSON",
      "Fields": {
        "lights": "boolean"
      }
    }
  }
],
```

## CloudToDeviceMethods

A simulated device can respond to cloud-to-device methods called from an IoT hub. The `CloudToDeviceMethods` section in the device model schema file:

* Defines the methods the simulated device can respond to.
* Identifies the JavaScript file that contains the logic to execute.

The simulated device sends the list of methods it supports to the IoT hub it's connected to.

To learn more about the JavaScript file that implements the behavior of the device, see [Understand the device model behavior](../../articles/iot-accelerators/iot-accelerators-device-simulation-advanced-device.md).

The following example specifies three supported methods and the JavaScript files that implement those methods:

```json
"CloudToDeviceMethods": {
  "Reboot": {
    "Type": "javascript",
    "Path": "Reboot-method.js"
  },
  "EmergencyValveRelease": {
    "Type": "javascript",
    "Path": "EmergencyValveRelease-method.js"
  },
  "IncreasePressure": {
    "Type": "javascript",
    "Path": "IncreasePressure-method.js"
  }
}
```

You can see the JavaScript files for the default simulated devices in the [scripts folder](https://github.com/Azure/device-simulation-dotnet/tree/master/Services/data/devicemodels/scripts) on GitHub. By convention, these JavaScript files have the suffix **-method** to distinguish them from the files that implement state behavior.

## Next steps

This article described how to create your own custom simulated device model. This article showed you how to:

<!-- Repeat task list from intro -->
>[!div class="checklist"]
> * Use a JSON file to define a simulated device model
> * Specify the properties the simulated device
> * Specify the telemetry the simulated device sends
> * Specify the cloud-to-device methods the device responds to

Now that you've learned about the JSON schema, the suggested next step is to learn how to [implement the behavior of your simulated device](iot-accelerators-remote-monitoring-device-behavior.md).

For more developer information about the Remote Monitoring solution, see:

* [Developer Reference Guide](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet/wiki/Developer-Reference-Guide)
* [Developer Troubleshooting Guide](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet/wiki/Developer-Troubleshooting-Guide)
