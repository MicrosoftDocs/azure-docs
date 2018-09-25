---
title: Azure IoT Edge module composition | Microsoft Docs 
description: Learn how a deployment manifest declares which modules to deploy, how to deploy them, and how to create message routes between them. 
author: kgremban
manager: timlt
ms.author: kgremban
ms.date: 06/06/2018
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Learn how to use deployment manifests to deploy modules and establish routes

Each IoT Edge device runs at least two modules: $edgeAgent and $edgeHub, which make up the IoT Edge runtime. In addition to those standard two, any IoT Edge device can run multiple modules to perform any number of processes. When you deploy all these modules to a device at once, you need a way to declare which modules are included and how they interact with each other. 

The *deployment manifest* is a JSON document that describes:

* The configuration of the Edge agent, which includes the container image for each module, the credentials to access private container registries, and instructions for how each module should be created and managed.
* The configuration of the Edge hub, which includes how messages flow between modules and eventually to IoT Hub.
* Optionally, the desired properties of the module twins.

All IoT Edge devices need to be configured with a deployment manifest. A newly installed IoT Edge runtime reports an error code until configured with a valid manifest. 

In the Azure IoT Edge tutorials, you build a deployment manifest by going through a wizard in the Azure IoT Edge portal. You can also apply a deployment manifest programmatically using REST or the IoT Hub Service SDK. For more information, see [Understand IoT Edge deployments][lnk-deploy].

## Create a deployment manifest

At a high level, the deployment manifest configures a module twin's desired properties for IoT Edge modules deployed on an IoT Edge device. Two of these modules are always present: `$edgeAgent`, and `$edgeHub`.

A deployment manifest that contains only the IoT Edge runtime (agent and hub) is valid.

The manifest follows this structure:

```json
{
    "modulesContent": {
        "$edgeAgent": {
            "properties.desired": {
                // desired properties of the Edge agent
                // includes the image URIs of all modules
                // includes container registry credentials
            }
        },
        "$edgeHub": {
            "properties.desired": {
                // desired properties of the Edge hub
                // includes the routing information between modules, and to IoT Hub
            }
        },
        "{module1}": {  // optional
            "properties.desired": {
                // desired properties of module with id {module1}
            }
        },
        "{module2}": {  // optional
            ...
        },
        ...
    }
}
```

## Configure modules

You need to tell the IoT Edge runtime how to install the modules in your deployment. The configuration and management information for all modules goes inside the **$edgeAgent** desired properties. This information includes the configuration parameters for the Edge agent itself. 

For a complete list of properties that can or must be included, see [Properties of the Edge agent and Edge hub](module-edgeagent-edgehub.md).

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
            "{module1}": { // optional
                // configuration and management details
            },
            "{module2}": { // optional
                // configuration and management details
            }
        }
    }
},
```

## Declare routes

Edge hub provides a way to declaratively route messages between modules, and between modules and IoT Hub. The Edge hub manages all communication, so the route information goes inside the **$edgeHub** desired properties. You can have multiple routes within the same deployment.

Routes are declared in the **$edgeHub** desired properties with the following syntax:

```json
"$edgeHub": {
    "properties.desired": {
        "routes": {
            "{route1}": "FROM <source> WHERE <condition> INTO <sink>",
            "{route2}": "FROM <source> WHERE <condition> INTO <sink>"
        },
    }
}
```

Every route needs a source and a sink, but the condition is an optional piece that you can use to filter messages. 


### Source
The source specifies where the messages come from. It can be any of the following values:

| Source | Description |
| ------ | ----------- |
| `/*` | All device-to-cloud messages from any device or module |
| `/messages/*` | Any device-to-cloud message sent by a device or a module through some or no output |
| `/messages/modules/*` | Any device-to-cloud message sent by a module through some or no output |
| `/messages/modules/{moduleId}/*` | Any device-to-cloud message sent by {moduleId} with no output |
| `/messages/modules/{moduleId}/outputs/*` | Any device-to-cloud message sent by {moduleId} with some output |
| `/messages/modules/{moduleId}/outputs/{output}` | Any device-to-cloud message sent by {moduleId} using {output} |

### Condition
The condition is optional in a route declaration. If you want to pass all messages from the sink to the source, just leave out the **WHERE** clause entirely. Or you can use the [IoT Hub query language][lnk-iothub-query] to filter for certain messages or message types that satisfy the condition.

The messages that pass between modules in IoT Edge are formatted the same as the messages that pass between your devices and Azure IoT Hub. All messages are formatted as JSON and have **systemProperties**, **appProperties**, and **body** parameters. 

You can build queries around all three parameters with the following syntax: 

* System properties: `$<propertyName>` or `{$<propertyName>}`
* Application properties: `<propertyName>`
* Body properties: `$body.<propertyName>` 

For examples about how to create queries for message properties, see [Device-to-cloud message routes query expressions](../iot-hub/iot-hub-devguide-routing-query-syntax.md).

An example that is specific to IoT Edge is when you want to filter for messages that arrived at a gateway device from a leaf device. Messages that come from modules contain a system property called **connectionModuleId**. So if you want to route messages from leaf devices directly to IoT Hub, use the following route to exclude module messages:

```sql
FROM /messages/\* WHERE NOT IS_DEFINED($connectionModuleId) INTO $upstream
```

### Sink
The sink defines where the messages are sent. It can be any of the following values:

| Sink | Description |
| ---- | ----------- |
| `$upstream` | Send the message to IoT Hub |
| `BrokeredEndpoint("/modules/{moduleId}/inputs/{input}")` | Send the message to input `{input}` of module `{moduleId}` |

IoT Edge provides at-least-once guarantees. The Edge hub stores messages locally in case a route cannot deliver the message to its sink. For example, if the Edge hub cannot connect to IoT Hub, or the target module is not connected.

Edge hub stores the messages up to the time specified in the `storeAndForwardConfiguration.timeToLiveSecs` property of the [Edge hub desired properties](module-edgeagent-edgehub.md).

## Define or update desired properties 

The deployment manifest can specify desired properties for the module twin of each module deployed to the IoT Edge device. When the desired properties are specified in the deployment manifest, they overwrite any desired properties currently in the module twin.

If you do not specify a module twin's desired properties in the deployment manifest, IoT Hub will not modify the module twin in any way, and you will be able to set the desired properties programmatically.

The same mechanisms that allow you to modify device twins are used to modify module twins. For more information, see the [device twin developer guide](../iot-hub/iot-hub-devguide-device-twins.md).   

## Deployment manifest example

This an example of a deployment manifest JSON document.

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
                "password": "{password}",
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
          "tempSensor": {
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
          "sensorToFilter": "FROM /messages/modules/tempSensor/outputs/temperatureOutput INTO BrokeredEndpoint(\"/modules/filtermodule/inputs/input1\")",
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

* For a complete list of properties that can or must be included in $edgeAgent and $edgeHub, see [Properties of the Edge agent and Edge hub](module-edgeagent-edgehub.md).

* Now that you know how IoT Edge modules are used, [Understand the requirements and tools for developing IoT Edge modules][lnk-module-dev].

[lnk-deploy]: module-deployment-monitoring.md
[lnk-iothub-query]: ../iot-hub/iot-hub-devguide-routing-query-syntax.md
[lnk-docker-create-options]: https://docs.docker.com/engine/api/v1.32/#operation/ContainerCreate
[lnk-docker-logging-options]: https://docs.docker.com/engine/admin/logging/overview/
[lnk-module-dev]: module-development.md
