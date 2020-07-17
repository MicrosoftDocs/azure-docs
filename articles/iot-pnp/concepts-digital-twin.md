---
title: Understand IoT Plug and Play digital twins
description: Understand the digital twins when using Plug and Play preview
author: prashmo
ms.author: prashmo
ms.date: 07/17/2020
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
---

# Understand IoT Plug and Play digital twins

A IoT plug and play device implements a model described by [DTDL v2](https://aka.ms/DTDL) schema. A model describes the set of components, properties, commands, telemetry messages that a particular twin can have. When an IoT Plug and Play device connects to IoT Hub for the first time, an initial device twin and digital twin are populated. 

Device twins are JSON documents that store device state information including metadata, configurations, and conditions. To learn more, see [Understand and use device twins in IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md#device-operations).
Both device and solution developers can continue to use the same set of Device Twin APIs and SDKs to implement device using IoT Plug and Play conventions.

Solution developers can additionally operate on high level constructs like components, properties, commands using Digital Twin API surface.
This article talks about how components and properties are represented within desired and reported section of device twin. It also describes how these concepts are mapped within the corresponding digital twin.

Here is an example of a IoT Plug and Play device twin formatted as a JSON object:
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
                "value": "alwinexlepaho8329-a",
                "ac": 200,
                "av": 2,
                "ad": "Successfully executed patch"
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
Below is the corresponding digital twin formatted as JSON object:

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
            "lastUpdateTime": "2020-07-17T06:10:31.9609233Z"
        }
    }
}
```
**Property**
Within device twin, the state of the property is split across the desired and reported section. On the other hand, digital twin provides unified view of the current and desired state of the property. The synchronization state of given property is available within `$metadata`.

In this example, `alwinexlepaho8329` is the current value of the `serialNumber` property reported by the device. `alwinexlepaho8329-a` is the desired value set by the solution. The desired value and synchronization state of a root level property is set within root level `$metadata` for a digital twin.

Below is the side-by-side JSON representation of writable property `serialNumber`
:::row:::
   :::column span="":::
      **Device Twin**
      ```json
      {
        "properties": {
          "desired": {
              "serialNumber": "alwinexlepaho8329-a",
          },
          "reported": {
              "serialNumber": {
                  "value": "alwinexlepaho8329-a",
                  "ac": 200,
                  "av": 2,
                  "ad": "Successfully executed patch"
              }
          }
        },
      }```
   :::column-end:::
   :::column span="":::
      **Digital Twin**
      ```json
        {
          "serialNumber": "alwinexlepaho8329",
          "$metadata": {
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
   :::column-end:::
:::row-end:::

**Component**
Within a device twin, a component is indicated by `{ "__t": "c"}` marker, where as `$metadata` marks a component within a digital twin.
Below is the side-by-side JSON representation of component `thermostat1`

:::row:::
   :::column span="":::
      **Device Twin**
      ```json
          {             
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
          }
      ```
   :::column-end:::
   :::column span="":::
      **Digital Twin**
      ```json
        {
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
        }
      ```
   :::column-end:::
:::row-end:::

### Digital twin JSON format

When represented as a JSON object, a digital twin will display the following fields:

| Field name | Description |
| --- | --- |
| `$dtId` | A user-provided string representing the ID of the digital twin |
| `{propertyName}` | The value of a property in JSON (`string`, number type, or object) |
| `$metadata.$model` | [Optional] The ID of the model interface that characterizes this digital twin |
| `$metadata.{propertyName}.desiredValue` | [Only for writable properties] The desired value of the specified property |
| `$metadata.{propertyName}.desiredVersion` | [Only for writable properties] The version of the desired value |
| `$metadata.{propertyName}.ackVersion` | [Required, only for writable properties] The version acknowledged by the device implementing the digital twin, it must by greater or equal to desired version |
| `$metadata.{propertyName}.ackCode` | [Required, only for writable properties] The `ack` code returned by the device app implementing the digital twin |
| `$metadata.{propertyName}.ackDescription` | [Optional, only for writable properties] The `ack` description returned by the device app implementing the digital twin |
| `$metadata.{propertyName}.lastUpdateTime` | IoT Hub maintains the timestamp of the last update of the property by the device. The timestamps are in UTC and encoded in the ISO8601 format YYYY-MM-DDTHH:MM:SS.mmmZ |
| `{componentName}` | A JSON object containing the component's property values and metadata, similar to those of the root object. |
| `{componentName}.{propertyName}` | The value of the component's property in JSON (`string`, number type, or object) |
| `{componentName}.$metadata` | The metadata information for the component, similar to the root-level `$metadata` |

## Digital Twin REST APIs

A set of REST APIs is provided to interact with a digital twin: **Get Digital Twin**, **Invoke Component Command**, **Invoke Command**, and **Update Digital Twin**. To learn more, see [Digital Twin REST API reference](https://docs.microsoft.com/en-us/rest/api/iothub/service/digitaltwin).

## Digital Twin change events

When digital twin change event is enabled, an event is triggered whenever the current or desired value of the component and/or property changes.
Corresponding events are generated in the device twin format if twin change events are enabled.
Digital twin change events are generated in [Json Patch format](https://tools.ietf.org/html/rfc6902)
To learn how to enable routing, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-messages-d2c#non-telemetry-events)

For example, below digital twin change event is triggered when `targetTemperature` is set by the solution.

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

Below digital twin event is triggered when the device reported that the change was applied.
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

Now that you've learned about digital twins, here are some additional resources:

- [Digital Twins Definition Language (DTDL)](https://aka.ms/DTDL)
- [Node service SDK](https://docs.microsoft.com/azure/iot-hub/iot-c-sdk-ref/)
- [IoT REST API](https://docs.microsoft.com/rest/api/iothub/device)
- [Azure IoT explorer](./howto-install-iot-explorer.md)

