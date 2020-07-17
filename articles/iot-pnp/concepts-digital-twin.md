---
title: Understand IoT Plug and Play digital twins
description: Understand how IoT Plug and Play Preview uses digital twins
author: prashmo
ms.author: prashmo
ms.date: 07/17/2020
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
---

# Understand IoT Plug and Play digital twins

An IoT Plug and Play device implements a model described by [Digital Twins Definition Language v2 (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl) schema. A model describes the set of components, properties, commands, and telemetry messages that a particular twin can have. When an IoT Plug and Play device connects to IoT Hub for the first time, a device twin and a digital twin are initialized.

This article describes how components and properties are represented in the desired and reported sections of a device twin. It also describes how these concepts are mapped in the corresponding digital twin.

## Device twins and digital twins

Device twins are JSON documents that store device state information including metadata, configurations, and conditions. To learn more, see [Understand and use device twins in IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md#device-operations).

Both device and solution builders can continue to use the same set of Device Twin APIs and SDKs to implement devices and solutions using IoT Plug and Play conventions.

Solution builders can work with high level constructs such as components, properties, and commands using the Digital Twin APIs.

In a device twin, the state of the property is split across the desired and reported sections. A digital twin provides unified view of the current and desired state of the property. The synchronization state of given property is stored in the corresponding root-level or component `$metadata` section.

### Digital twin JSON format

When represented as a JSON object, a digital twin includes the following fields:

| Field name | Description |
| --- | --- |
| `$dtId` | A user-provided string representing the ID of the device digital twin |
| `{propertyName}` | The value of a property in JSON (`string`, number type, or object) |
| `$metadata.$model` | [Optional] The ID of the model interface that characterizes this digital twin |
| `$metadata.{propertyName}.desiredValue` | [Only for writable properties] The desired value of the specified property |
| `$metadata.{propertyName}.desiredVersion` | [Only for writable properties] The version of the desired value |
| `$metadata.{propertyName}.ackVersion` | [Required, only for writable properties] The version acknowledged by the device implementing the digital twin, it must by greater or equal to desired version |
| `$metadata.{propertyName}.ackCode` | [Required, only for writable properties] The `ack` code returned by the device app implementing the digital twin |
| `$metadata.{propertyName}.ackDescription` | [Optional, only for writable properties] The `ack` description returned by the device app implementing the digital twin |
| `$metadata.{propertyName}.lastUpdateTime` | IoT Hub maintains the timestamp of the last update of the property by the device. The timestamps are in UTC and encoded in the ISO8601 format YYYY-MM-DDTHH:MM:SS.mmmZ |
| `{componentName}` | A JSON object containing the component's property values and metadata, similar to a root object. |
| `{componentName}.{propertyName}` | The value of the component's property in JSON (`string`, number type, or object) |
| `{componentName}.$metadata` | The metadata information for the component, similar to the root-level `$metadata` |

The following snippet shows an IoT Plug and Play device twin formatted as a JSON object:

```json
{
    "deviceId": "sample-device",
    "modelId": "dtmi:com:example:TemperatureController;1",
    "version": 15,
    "properties": {
        "desired": {
            "serialNumber": "alwinexlepaho8329-a",
            "thermostat1": {
                "__t": "c",
                "targetTemperature": "72.2"
            },
            "$metadata": {
                "$lastUpdated": "2020-07-17T06:12:57.9247361Z",
                "$lastUpdatedVersion": 4,
                "serialNumber": {
                    "$lastUpdated": "2020-07-17T06:09:14.5746526Z",
                    "$lastUpdatedVersion": 2
                },
                "thermostat1": {
                    "$lastUpdated": "2020-07-17T06:12:57.9247361Z",
                    "$lastUpdatedVersion": 4,
                    "__t": {
                        "$lastUpdated": "2020-07-17T06:11:04.8581212Z",
                        "$lastUpdatedVersion": 3
                    },
                    "targetTemperature": {
                        "$lastUpdated": "2020-07-17T06:12:57.9247361Z",
                        "$lastUpdatedVersion": 4
                    }
                }
            },
            "$version": 4
        },
        "reported": {
            "serialNumber": {
                "value": "alwinexlepaho8329",
                "ac": 200,
                "av": 1,
            },
            "thermostat1": {
                "maxTempSinceLastReboot": 67.89,
                "__t": "c",
                "targetTemperature": {
                    "value": "72.2",
                    "ac": 200,
                    "ad": "Successfully executed patch",
                }
            },
            "$metadata": {

            },
            "$version": 11
        }
    }
}
```

The following snippet shows the digital twin formatted as a JSON object:

```json
{
    "$dtId": "sample-device",
    "serialNumber": "alwinexlepaho8329",
    "thermostat1": {
        "maxTempSinceLastReboot": 67.89,
        "targetTemperature": "72.2",
        "$metadata": {
            "targetTemperature": {
                "desiredValue": "72.2",
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
            "ackDescription": "Successfully executed patch",
            "lastUpdateTime": "2020-07-17T06:10:31.9609233Z"
        }
    }
}
```

### Properties

In this example, `alwinexlepaho8329` is the current value of the `serialNumber` property reported by the device. `alwinexlepaho8329-a` is the desired value set by the solution. The desired value and synchronization state of a root-level property is set within root-level `$metadata` for a digital twin.

The following snippets show the side-by-side JSON representation of the `serialNumber` writable property:

:::row:::
   :::column span="":::
      **Device twin**
      ```json
        "properties": {
          "desired": {
              "serialNumber": "alwinexlepaho8329-a",
          },
          "reported": {
              "serialNumber": {
                  "value": "alwinexlepaho8329",
                  "ac": 200,
                  "av": 1
              }
          }
        }
      ```
   :::column-end:::
   :::column span="":::
      **Digital twin**
      ```json
          "serialNumber": "alwinexlepaho8329",
          "$metadata": {
              "serialNumber": {
                  "desiredValue": "alwinexlepaho8329-a",
                  "desiredVersion": 2,
                  "ackVersion": 1,
                  "ackCode": 200,
                  "ackDescription": "Successfully executed patch",
                  "lastUpdateTime": "2020-07-17T06:10:31.9609233Z"
              }
          }
      ```
   :::column-end:::
:::row-end:::

### Components

In a device twin, a component is identified by the `{ "__t": "c"}` marker. In a digital twin, `$metadata` marks a component.

In this example, `thermostat1` is a component with two properties. `maxTempSinceLastReboot` is read-only property. `targetTemperature` is a writable property that's been successfully synced by the device. The desired value and synchronization state of a theses properties are within component's `$metadata`.

The following snippets show the side-by-side JSON representation of the `thermostat1` component:

:::row:::
   :::column span="":::
      **Device twin**
      ```json            
        "properties": {
            "desired": {                    
                "thermostat1": {
                    "__t": "c",
                    "targetTemperature": "72.2"
                },
                "$metadata": {
                    "thermostat1": {
                        "$lastUpdated": "2020-07-17T06:12:57.9247361Z",
                        "$lastUpdatedVersion": 4,
                        "__t": {
                            "$lastUpdated": "2020-07-17T06:11:04.8581212Z",
                            "$lastUpdatedVersion": 3
                        },
                        "targetTemperature": {
                            "$lastUpdated": "2020-07-17T06:12:57.9247361Z",
                            "$lastUpdatedVersion": 4
                        }
                    }
                },
                "$version": 4
            },
            "reported": {
                "thermostat1": {
                    "maxTempSinceLastReboot": 67.89,
                    "__t": "c",
                    "targetTemperature": {
                        "value": "72.2",
                        "ac": 200,
                        "ad": "Successfully executed patch",
                        "av": 4
                    }
                },
                "$metadata": {
                },
                "$version": 11
            }
        }          
      ```
   :::column-end:::
   :::column span="":::
      **Digital twin**
      ```json
        "thermostat1": {
            "maxTempSinceLastReboot": 67.89,
            "targetTemperature": "72.2",
            "$metadata": {
                "targetTemperature": {
                    "desiredValue": "72.2",
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
        }
      ```
   :::column-end:::
:::row-end:::

## Digital twin REST APIs

A set of REST APIs lets you interact with a digital twin: **Get Digital Twin**, **Update Digital Twin**, **Invoke Component Command** and **Invoke Command**, . To learn more, see [Digital Twin REST API reference](https://docs.microsoft.com/rest/api/iothub/service/digitaltwin).

## Digital twin change events

When digital twin change event is enabled, an event is triggered whenever the current or desired value of the component or property changes. Corresponding events are generated in the device twin format if twin change events are enabled. Digital twin change events are generated in [JSON patch format](https://tools.ietf.org/html/rfc6902).

To learn how to enable routing for device and digital twin events, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](../iot-hub/iot-hub-devguide-messages-d2c.md#non-telemetry-events). To understand messaging format, see [Create and read IoT Hub messages](../iot-hub/iot-hub-devguide-messages-construct)

For example, the following digital twin change event is triggered when `targetTemperature` is set by the solution:

```json
iothub-connection-device-id:sample-device
iothub-enqueuedtime:7/17/2020 6:11:04 AM
iothub-message-source:digitalTwinChangeEvents
correlation-id:275d463fa034
content-type:application/json-patch+json
content-encoding:utf-8
[
  {
    "op": "add",
    "path": "/thermostat1/$metadata/targetTemperature",
    "value": {
      "desiredValue": "72.2",
      "desiredVersion": 4
    }
  }
]
```

The following digital twin event is triggered when the device reports that the previous desired change was applied:

```json
iothub-connection-device-id:sample-device
iothub-enqueuedtime:7/17/2020 6:11:05 AM
iothub-message-source:digitalTwinChangeEvents
correlation-id:275d464a2c80
content-type:application/json-patch+json
content-encoding:utf-8
[
  {
    "op": "add",
    "path": "/thermostat1/$metadata/targetTemperature/ackCode",
    "value": 200
  },
  {
    "op": "add",
    "path": "/thermostat1/$metadata/targetTemperature/ackDescription",
    "value": "Successfully executed patch"
  },
  {
    "op": "add",
    "path": "/thermostat1/$metadata/targetTemperature/ackVersion",
    "value": 4
  },
  {
    "op": "add",
    "path": "/thermostat1/$metadata/targetTemperature/lastUpdateTime",
    "value": "2020-07-17T06:11:04.9309159Z"
  },
  {
    "op": "add",
    "path": "/thermostat1/targetTemperature",
    "value": "72.2"
  }
]
```

## Next steps

Now that you've learned about digital twins, here are some additional resources:

- [Digital Twins Definition Language v2 (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl)
- [Node service SDK](https://docs.microsoft.com/azure/iot-hub/iot-c-sdk-ref/)
- [IoT REST API](https://docs.microsoft.com/rest/api/iothub/device)
- [Azure IoT explorer](./howto-install-iot-explorer.md)

