---
title: Deploy module & routes with deployment manifests - Azure IoT Edge
description: Learn how a deployment manifest declares which modules to deploy, how to deploy them, and how to create message routes between them. 
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 05/28/2019
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Learn how to deploy modules and establish routes in IoT Edge

Each IoT Edge device runs at least two modules: $edgeAgent and $edgeHub, which are part of the IoT Edge runtime. IoT Edge device can run multiple additional modules for any number of processes. Use a deployment manifest to tell your device which modules to install and how to configure them to work together.

The *deployment manifest* is a JSON document that describes:

* The **IoT Edge agent** module twin, which includes three components:
  * The container image for each module that runs on the device.
  * The credentials to access private container registries that contain module images.
  * Instructions for how each module should be created and managed.
* The **IoT Edge hub** module twin, which includes how messages flow between modules and eventually to IoT Hub.
* The desired properties of any additional module twins (optional).

All IoT Edge devices must be configured with a deployment manifest. A newly installed IoT Edge runtime reports an error code until configured with a valid manifest.

In the Azure IoT Edge tutorials, you build a deployment manifest by going through a wizard in the Azure IoT Edge portal. You can also apply a deployment manifest programmatically using REST or the IoT Hub Service SDK. For more information, see [Understand IoT Edge deployments](module-deployment-monitoring.md).

## Create a deployment manifest

At a high level, a deployment manifest is a list of module twins that are configured with their desired properties. A deployment manifest tells an IoT Edge device (or a group of devices) which modules to install and how to configure them. Deployment manifests include the *desired properties* for each module twin. IoT Edge devices report back the *reported properties* for each module.

Two modules are required in every deployment manifest: `$edgeAgent`, and `$edgeHub`. These modules are part of the IoT Edge runtime that manages the IoT Edge device and the modules running on it. For more information about these modules, see [Understand the IoT Edge runtime and its architecture](iot-edge-runtime.md).

In addition to the two runtime modules, you can add up to 20 modules of your own to run on an IoT Edge device.

A deployment manifest that contains only the IoT Edge runtime (edgeAgent and edgeHub) is valid.

Deployment manifests follow this structure:

```json
{
    "modulesContent": {
        "$edgeAgent": { // required
            "properties.desired": {
                // desired properties of the Edge agent
                // includes the image URIs of all modules
                // includes container registry credentials
            }
        },
        "$edgeHub": { //required
            "properties.desired": {
                // desired properties of the Edge hub
                // includes the routing information between modules, and to IoT Hub
            }
        },
        "module1": {  // optional
            "properties.desired": {
                // desired properties of module1
            }
        },
        "module2": {  // optional
            "properties.desired": {
                // desired properties of module2
            }
        },
        ...
    }
}
```

## Configure modules

Define how the IoT Edge runtime installs the modules in your deployment. The IoT Edge agent is the runtime component that manages installation, updates, and status reporting for an IoT Edge device. Therefore, the $edgeAgent module twin contains the configuration and management information for all modules. This information includes the configuration parameters for the IoT Edge agent itself.

For a complete list of properties that can or must be included, see [Properties of the IoT Edge agent and IoT Edge hub](module-edgeagent-edgehub.md).

The $edgeAgent properties follow this structure:

```json
"$edgeAgent": {
    "properties.desired": {
        "schemaVersion": "1.0",
        "runtime": {
            "settings":{
                "registryCredentials":{ // give the edge agent access to container images that aren't public
                    }
                }
            }
        },
        "systemModules": {
            "edgeAgent": {
                // configuration and management details
            },
            "edgeHub": {
                // configuration and management details
            }
        },
        "modules": {
            "module1": { // optional
                // configuration and management details
            },
            "module2": { // optional
                // configuration and management details
            }
        }
    }
},
```

## Declare routes

The IoT Edge hub manages communication between modules, IoT Hub, and any leaf devices. Therefore, the $edgeHub module twin contains a desired property called *routes* that declares how messages are passed within a deployment. You can have multiple routes within the same deployment.

Routes are declared in the **$edgeHub** desired properties with the following syntax:

```json
"$edgeHub": {
    "properties.desired": {
        "routes": {
            "route1": "FROM <source> WHERE <condition> INTO <sink>",
            "route2": "FROM <source> WHERE <condition> INTO <sink>"
        },
    }
}
```

Every route needs a source and a sink, but the condition is an optional piece that you can use to filter messages.

### Source

The source specifies where the messages come from. IoT Edge can route messages from modules or leaf devices.

Using the IoT SDKs, modules can declare specific output queues for their messages using the ModuleClient class. Output queues aren't necessary, but are helpful for managing multiple routes. Leaf devices can use the DeviceClient class of the IoT SDKs to send messages to IoT Edge gateway devices in the same way that they would send messages to IoT Hub. For more information, see [Understand and use Azure IoT Hub SDKs](../iot-hub/iot-hub-devguide-sdks.md).

The source property can be any of the following values:

| Source | Description |
| ------ | ----------- |
| `/*` | All device-to-cloud messages or twin change notifications from any module or leaf device |
| `/twinChangeNotifications` | Any twin change (reported properties) coming from any module or leaf device |
| `/messages/*` | Any device-to-cloud message sent by a module through some or no output, or by a leaf device |
| `/messages/modules/*` | Any device-to-cloud message sent by a module through some or no output |
| `/messages/modules/<moduleId>/*` | Any device-to-cloud message sent by a specific module through some or no output |
| `/messages/modules/<moduleId>/outputs/*` | Any device-to-cloud message sent by a specific module through some output |
| `/messages/modules/<moduleId>/outputs/<output>` | Any device-to-cloud message sent by a specific module through a specific output |

### Condition

The condition is optional in a route declaration. If you want to pass all messages from the source to the sink, just leave out the **WHERE** clause entirely. Or you can use the [IoT Hub query language](../iot-hub/iot-hub-devguide-routing-query-syntax.md) to filter for certain messages or message types that satisfy the condition. IoT Edge routes don't support filtering messages based on twin tags or properties.

The messages that pass between modules in IoT Edge are formatted the same as the messages that pass between your devices and Azure IoT Hub. All messages are formatted as JSON and have **systemProperties**, **appProperties**, and **body** parameters.

You can build queries around any of the three parameters with the following syntax:

* System properties: `$<propertyName>` or `{$<propertyName>}`
* Application properties: `<propertyName>`
* Body properties: `$body.<propertyName>`

For examples about how to create queries for message properties, see [Device-to-cloud message routes query expressions](../iot-hub/iot-hub-devguide-routing-query-syntax.md).

An example that is specific to IoT Edge is when you want to filter for messages that arrived at a gateway device from a leaf device. Messages that come from modules include a system property called **connectionModuleId**. So if you want to route messages from leaf devices directly to IoT Hub, use the following route to exclude module messages:

```query
FROM /messages/* WHERE NOT IS_DEFINED($connectionModuleId) INTO $upstream
```

### Sink

The sink defines where the messages are sent. Only modules and IoT Hub can receive messages. Messages can't be routed to other devices. There are no wildcard options in the sink property.

The sink property can be any of the following values:

| Sink | Description |
| ---- | ----------- |
| `$upstream` | Send the message to IoT Hub |
| `BrokeredEndpoint("/modules/<moduleId>/inputs/<input>")` | Send the message to a specific input of a specific module |

IoT Edge provides at-least-once guarantees. The IoT Edge hub stores messages locally in case a route can't deliver the message to its sink. For example, if the IoT Edge hub can't connect to IoT Hub, or the target module isn't connected.

IoT Edge hub stores the messages up to the time specified in the `storeAndForwardConfiguration.timeToLiveSecs` property of the [IoT Edge hub desired properties](module-edgeagent-edgehub.md).

## Define or update desired properties

The deployment manifest specifies desired properties for each module deployed to the IoT Edge device. Desired properties in the deployment manifest overwrite any desired properties currently in the module twin.

If you do not specify a module twin's desired properties in the deployment manifest, IoT Hub won't modify the module twin in any way. Instead, you can set the desired properties programmatically.

The same mechanisms that allow you to modify device twins are used to modify module twins. For more information, see the [module twin developer guide](../iot-hub/iot-hub-devguide-module-twins.md).

## Deployment manifest example

The following example shows what a valid deployment manifest document may look like.

```json
{
  "modulesContent": {
    "$edgeAgent": {
      "properties.desired": {
        "schemaVersion": "1.0",
        "runtime": {
          "type": "docker",
          "settings": {
            "minDockerVersion": "v1.25",
            "loggingOptions": "",
            "registryCredentials": {
              "ContosoRegistry": {
                "username": "myacr",
                "password": "<password>",
                "address": "myacr.azurecr.io"
              }
            }
          }
        },
        "systemModules": {
          "edgeAgent": {
            "type": "docker",
            "settings": {
              "image": "mcr.microsoft.com/azureiotedge-agent:1.0",
              "createOptions": ""
            }
          },
          "edgeHub": {
            "type": "docker",
            "status": "running",
            "restartPolicy": "always",
            "settings": {
              "image": "mcr.microsoft.com/azureiotedge-hub:1.0",
              "createOptions": ""
            }
          }
        },
        "modules": {
          "SimulatedTemperatureSensor": {
            "version": "1.0",
            "type": "docker",
            "status": "running",
            "restartPolicy": "always",
            "settings": {
              "image": "mcr.microsoft.com/azureiotedge-simulated-temperature-sensor:1.0",
              "createOptions": "{}"
            }
          },
          "filtermodule": {
            "version": "1.0",
            "type": "docker",
            "status": "running",
            "restartPolicy": "always",
            "settings": {
              "image": "myacr.azurecr.io/filtermodule:latest",
              "createOptions": "{}"
            }
          }
        }
      }
    },
    "$edgeHub": {
      "properties.desired": {
        "schemaVersion": "1.0",
        "routes": {
          "sensorToFilter": "FROM /messages/modules/SimulatedTemperatureSensor/outputs/temperatureOutput INTO BrokeredEndpoint(\"/modules/filtermodule/inputs/input1\")",
          "filterToIoTHub": "FROM /messages/modules/filtermodule/outputs/output1 INTO $upstream"
        },
        "storeAndForwardConfiguration": {
          "timeToLiveSecs": 10
        }
      }
    }
  }
}
```

## Next steps

* For a complete list of properties that can or must be included in $edgeAgent and $edgeHub, see [Properties of the IoT Edge agent and IoT Edge hub](module-edgeagent-edgehub.md).

* Now that you know how IoT Edge modules are used, [Understand the requirements and tools for developing IoT Edge modules](module-development.md).
