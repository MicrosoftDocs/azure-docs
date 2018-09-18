---
 title: include file
 description: include file
 services: iot-accelerators
 author: dominicbetts
 ms.service: iot-accelerators
 ms.topic: include
 ms.date: 07/26/2018
 ms.author: dobett
 ms.custom: include file
---

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

To learn more about the JavaScript file that updates the device state object, see [Understand the device model behavior](../articles/iot-accelerators/iot-accelerators-device-simulation-device-behavior.md).

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

When the solution starts, it queries all the simulated devices to build a list of `Type` values to use in the UI. The solution uses the `Latitiude` and `Longitude` properties to add the location of the device to the map on the dashboard.

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

To learn more about the JavaScript file that implements the behavior of the device, see [Understand the device model behavior](../articles/iot-accelerators/iot-accelerators-device-simulation-device-behavior.md).

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