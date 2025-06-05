---
title: Deploy modules and establish routes in Azure IoT Edge
description: Learn how to use deployment manifests in Azure IoT Edge to define modules, set desired properties, and establish message routing for efficient device management.
author: PatAltimore
ms.author: patricka
ms.date: 05/15/2025
ms.topic: concept-article
ms.service: azure-iot-edge
services: iot-edge
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:05/15/2025
  - ai-gen-description
  - build-2025
---

# Learn how to deploy modules and establish routes in IoT Edge

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

Each IoT Edge device runs at least two modules: $edgeAgent and $edgeHub, which are part of the IoT Edge runtime. An IoT Edge device can run multiple modules for different processes. Use a deployment manifest to tell your device which modules to install and how to set them up to work together.

The *deployment manifest* is a JSON document that describes:

* The **IoT Edge agent** module twin, which includes three components:
  * The container image for each module that runs on the device
  * The credentials to use private container registries that have module images
  * Instructions for how each module is created and managed
* The **IoT Edge hub** module twin, which includes how messages flow between modules and to IoT Hub
* The desired properties of any extra module twins (optional)

All IoT Edge devices need a deployment manifest. A newly installed IoT Edge runtime shows an error code until it's set up with a valid manifest.

In the Azure IoT Edge tutorials, you build a deployment manifest by using a wizard in the Azure IoT Edge portal. You can also apply a deployment manifest programmatically by using REST or the IoT Hub Service SDK. For more information, see [Understand IoT Edge deployments](module-deployment-monitoring.md).

## Create a deployment manifest

A deployment manifest is a list of module twins set with their desired properties. It tells an IoT Edge device or group of devices which modules to install and how to set them up. Deployment manifests include the *desired properties* for each module twin. IoT Edge devices report the *reported properties* for each module.

Every deployment manifest requires two modules: `$edgeAgent` and `$edgeHub`. These modules are part of the IoT Edge runtime that manages the IoT Edge device and the modules running on it. For more information about these modules, see [Understand the IoT Edge runtime and its architecture](iot-edge-runtime.md).

You can add up to 50 additional modules to run on an IoT Edge device, in addition to the two runtime modules.

A deployment manifest that has only the IoT Edge runtime (`$edgeAgent` and `$edgeHub`) is valid.

Deployment manifests use this structure:

```json
{
  "modulesContent": {
    "$edgeAgent": { // required
      "properties.desired": {
        // desired properties of the IoT Edge agent
        // includes the image URIs of all deployed modules
        // includes container registry credentials
      }
    },
    "$edgeHub": { //required
      "properties.desired": {
        // desired properties of the IoT Edge hub
        // includes the routing information between modules and to IoT Hub
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
    }
  }
}
```

## Configure modules

Define how the IoT Edge runtime installs the modules in your deployment. The IoT Edge agent is the runtime component that manages installation, updates, and status reporting for an IoT Edge device. So, the $edgeAgent module twin has the configuration and management information for all modules. This information includes the configuration parameters for the IoT Edge agent itself.

The $edgeAgent properties follow this structure:

```json
{
  "modulesContent": {
    "$edgeAgent": {
      "properties.desired": {
        "schemaVersion": "1.1",
        "runtime": {
          "settings":{
            "registryCredentials":{
              // let the IoT Edge agent use container images that aren't public
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
          "module1": {
            // configuration and management details
          },
          "module2": {
            // configuration and management details
          }
        }
      }
    },
    "$edgeHub": { ... },
    "module1": { ... },
    "module2": { ... }
  }
}
```

The IoT Edge agent schema version 1.1 was released with IoT Edge version 1.0.10 and lets you set module startup order. Use schema version 1.1 for any IoT Edge deployment running version 1.0.10 or later.

### Module configuration and management

The IoT Edge agent desired properties list is where you define which modules run on an IoT Edge device and how they're set up and managed.

For a complete list of desired properties that can or must be included, see [Properties of the IoT Edge agent and IoT Edge hub](module-edgeagent-edgehub.md).

For example:

```json
{
  "modulesContent": {
    "$edgeAgent": {
      "properties.desired": {
        "schemaVersion": "1.1",
        "runtime": { ... },
        "systemModules": {
          "edgeAgent": { ... },
          "edgeHub": { ... }
        },
        "modules": {
          "module1": {
            "version": "1.0",
            "type": "docker",
            "status": "running",
            "restartPolicy": "always",
            "startupOrder": 2,
            "settings": {
              "image": "myacr.azurecr.io/module1:latest",
              "createOptions": "{}"
            }
          },
          "module2": { ... }
        }
      }
    },
    "$edgeHub": { ... },
    "module1": { ... },
    "module2": { ... }
  }
}
```

Every module has a **settings** property with the module **image**, an address for the container image in a container registry, and any **createOptions** to set up the image on startup. For more information, see [How to configure container create options for IoT Edge modules](how-to-use-create-options.md).

The edgeHub module and custom modules also have three properties that tell the IoT Edge agent how to manage them:

* **Status**: Whether the module runs or stops when first deployed. Required.
* **RestartPolicy**: When and if the IoT Edge agent restarts the module if it stops. If the module stops without any errors, it doesn't start automatically. For more information, see [Docker Docs - Start containers automatically](https://aka.ms/docker-container-restart-policy). Required.
* **StartupOrder**: *Introduced in IoT Edge version 1.0.10.* The order the IoT Edge agent uses to start the modules when first deployed. The order uses integers, where a module with a startup value of 0 starts first and then higher numbers follow. The edgeAgent module doesn't have a startup value because it always starts first. Optional.

  The IoT Edge agent starts the modules in order of the startup value, but doesn't wait for each module to finish starting before starting the next one.

  Startup order helps if some modules depend on others. For example, you might want the edgeHub module to start first so it's ready to route messages when the other modules start. Or you might want to start a storage module before you start modules that send data to it. But always design your modules to handle failures of other modules. Containers can stop and restart at any time, and any number of times.

    > [!NOTE]
  > Changing a module's properties restarts that module. For example, a restart happens if you change properties for the:
  >    * module image
  >    * Docker create options
  >    * environment variables
  >    * restart policy
  >    * image pull policy
  >    * version
  >    * startup order
  >
  > If no module properties are changed, a module restart isn't triggered.

## Declare routes

IoT Edge hub manages communication between modules, IoT Hub, and downstream devices. The $edgeHub module twin has a desired property called *routes* that defines how messages move within a deployment. You can set up multiple routes in the same deployment.

Declare routes in the **$edgeHub** desired properties using this syntax:

```json
{
  "modulesContent": {
    "$edgeAgent": { ... },
    "$edgeHub": {
      "properties.desired": {
        "schemaVersion": "1.1",
        "routes": {
          "route1": "FROM <source> WHERE <condition> INTO <sink>",
          "route2": {
            "route": "FROM <source> WHERE <condition> INTO <sink>",
            "priority": 0,
            "timeToLiveSecs": 86400
          }
        },
        "storeAndForwardConfiguration": {
          "timeToLiveSecs": 10
        }
      }
    },
    "module1": { ... },
    "module2": { ... }
  }
}
```

IoT Edge hub schema version 1 released with IoT Edge version 1.0.10 and lets you set route prioritization and time to live. Use schema version 1.1 for any IoT Edge deployment running version 1.0.10 or later.

Each route needs a *source* for incoming messages and a *sink* for outgoing messages. The *condition* is optional and lets you filter messages.

Assign *priority* to routes to process important messages first. This feature helps when the upstream connection is weak or limited and you need to prioritize critical data over standard telemetry messages.

### Source

The source specifies where the messages come from. IoT Edge can route messages from modules or downstream devices.

With the IoT SDKs, modules can set specific output queues for their messages using the ModuleClient class. Output queues aren't required, but they help manage multiple routes. Downstream devices use the DeviceClient class in the IoT SDKs to send messages to IoT Edge gateway devices, just like they send messages to IoT Hub. For more information, see [Understand and use Azure IoT Hub SDKs](../iot-hub/iot-hub-devguide-sdks.md).

The source property can use any of these values:

| Source | Description |
| ------ | ----------- |
| `/*` | All device-to-cloud messages or twin change notifications from any module or downstream device |
| `/twinChangeNotifications` | Any twin change (reported properties) coming from any module or downstream device |
| `/messages/*` | Any device-to-cloud message sent by a module through some or no output, or by a downstream  device |
| `/messages/modules/*` | Any device-to-cloud message sent by a module through some or no output |
| `/messages/modules/<moduleId>/*` | Any device-to-cloud message sent by a specific module through some or no output |
| `/messages/modules/<moduleId>/outputs/*` | Any device-to-cloud message sent by a specific module through some output |
| `/messages/modules/<moduleId>/outputs/<output>` | Any device-to-cloud message sent by a specific module through a specific output |

### Condition

The condition is optional in a route declaration. To pass all messages from the source to the sink, leave out the **WHERE** clause. Or use the [IoT Hub query language](../iot-hub/iot-hub-devguide-routing-query-syntax.md) to filter messages or message types that meet the condition. IoT Edge routes don't support filtering messages based on twin tags or properties.

Messages that move between modules in IoT Edge use the same format as messages between your devices and Azure IoT Hub. All messages use JSON format and have **systemProperties**, **appProperties**, and **body** parameters.

Build queries around any of the three parameters using this syntax:

* System properties: `$<propertyName>` or `{$<propertyName>}`
* Application properties: `<propertyName>`
* Body properties: `$body.<propertyName>`

For examples of how to create queries for message properties, see [Device-to-cloud message routes query expressions](../iot-hub/iot-hub-devguide-routing-query-syntax.md).

For example, you might want to filter messages that arrive at a gateway device from a downstream device. Messages sent from modules include a system property called **connectionModuleId**. To route messages from downstream devices directly to IoT Hub and exclude module messages, use this route:

```query
FROM /messages/* WHERE NOT IS_DEFINED($connectionModuleId) INTO $upstream
```

### Sink

The sink defines where messages are sent. Only modules and IoT Hub can receive messages. You can't route messages to other devices. The sink property doesn't support wildcards.

The sink property can use any of these values:

| Sink | Description |
| ---- | ----------- |
| `$upstream` | Send the message to IoT Hub |
| `BrokeredEndpoint("/modules/<moduleId>/inputs/<input>")` | Send the message to a specific input of a specific module |

IoT Edge provides *at least once* guarantees. IoT Edge hub stores messages locally if a route can't deliver the message to its sink. For example, if IoT Edge hub can't connect to IoT Hub or the target module isn't connected.

IoT Edge hub stores messages up to the time set in the `storeAndForwardConfiguration.timeToLiveSecs` property of the [IoT Edge hub desired properties](module-edgeagent-edgehub.md).

### Priority and time-to-live

Declare routes as a string that defines the route, or as an object with a route string, a priority integer, and a time-to-live integer.

#### Option 1

   ```json
   "route1": "FROM <source> WHERE <condition> INTO <sink>",
   ```

#### Option 2 (introduced in IoT Edge version 1.0.10 with IoT Edge hub schema version 1.1)

   ```json
   "route2": {
     "route": "FROM <source> WHERE <condition> INTO <sink>",
     "priority": 0,
     "timeToLiveSecs": 86400
   }
   ```

**Priority** values range from 0 to 9, where 0 is the highest priority. Messages are queued by their endpoints. All priority 0 messages for a specific endpoint are processed before any priority 1 messages for the same endpoint. If multiple routes for the same endpoint have the same priority, messages are processed in the order they arrive. If you don't set a priority, the route uses the lowest priority.

The **timeToLiveSecs** property uses the value from IoT Edge hub's **storeAndForwardConfiguration** unless you set it directly. The value can be any positive integer.

For details about how priority queues are managed, see [Route priority and time-to-live](https://github.com/Azure/iotedge/blob/main/doc/Route_priority_and_TTL.md).

## Define or update desired properties

The deployment manifest sets desired properties for each module deployed to the IoT Edge device. Desired properties in the deployment manifest overwrite any desired properties currently in the module twin.

If you don't set a module twin's desired properties in the deployment manifest, IoT Hub doesn't change the module twin. Instead, set the desired properties programmatically.

The same mechanisms that let you change device twins also let you change module twins. For more information, see the [module twin developer guide](../iot-hub/iot-hub-devguide-module-twins.md).

## Deployment manifest example

The following example shows what a valid deployment manifest document can look like.

```json
{
  "modulesContent": {
    "$edgeAgent": {
      "properties.desired": {
        "schemaVersion": "1.1",
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
              "image": "mcr.microsoft.com/azureiotedge-agent:1.5",
              "createOptions": "{}"
            }
          },
          "edgeHub": {
            "type": "docker",
            "status": "running",
            "restartPolicy": "always",
            "startupOrder": 0,
            "settings": {
              "image": "mcr.microsoft.com/azureiotedge-hub:1.5",
              "createOptions": "{\"HostConfig\":{\"PortBindings\":{\"443/tcp\":[{\"HostPort\":\"443\"}],\"5671/tcp\":[{\"HostPort\":\"5671\"}],\"8883/tcp\":[{\"HostPort\":\"8883\"}]}}}"
            }
          }
        },
        "modules": {
          "SimulatedTemperatureSensor": {
            "version": "1.5",
            "type": "docker",
            "status": "running",
            "restartPolicy": "always",
            "startupOrder": 2,
            "settings": {
              "image": "mcr.microsoft.com/azureiotedge-simulated-temperature-sensor:1.5",
              "createOptions": "{}"
            }
          },
          "filtermodule": {
            "version": "1.0",
            "type": "docker",
            "status": "running",
            "restartPolicy": "always",
            "startupOrder": 1,
            "env": {
              "tempLimit": {"value": "100"}
            },
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
        "schemaVersion": "1.1",
        "routes": {
          "sensorToFilter": {
            "route": "FROM /messages/modules/SimulatedTemperatureSensor/outputs/temperatureOutput INTO BrokeredEndpoint(\"/modules/filtermodule/inputs/input1\")",
            "priority": 0,
            "timeToLiveSecs": 1800
          },
          "filterToIoTHub": {
            "route": "FROM /messages/modules/filtermodule/outputs/output1 INTO $upstream",
            "priority": 1,
            "timeToLiveSecs": 1800
          }
        },
        "storeAndForwardConfiguration": {
          "timeToLiveSecs": 100
        }
      }
    }
  }
}
```

## Next steps

* For a complete list of properties you can or must include in $edgeAgent and $edgeHub, see [Properties of the IoT Edge agent and IoT Edge hub](module-edgeagent-edgehub.md).

* Now that you know how IoT Edge modules work, [learn about the requirements and tools for developing IoT Edge modules](module-development.md).
