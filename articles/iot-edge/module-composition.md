---
title: Deploy module & routes with deployment manifests - Azure IoT Edge
description: Learn how a deployment manifest declares which modules to deploy, how to deploy them, and how to create message routes between them. 
author: PatAltimore

ms.author: patricka
ms.date: 1/31/2023
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Learn how to deploy modules and establish routes in IoT Edge

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

Each IoT Edge device runs at least two modules: $edgeAgent and $edgeHub, which are part of the IoT Edge runtime. IoT Edge device can run multiple modules for any number of processes. Use a deployment manifest to tell your device which modules to install and how to configure them to work together.

The *deployment manifest* is a JSON document that describes:

* The **IoT Edge agent** module twin, which includes three components:
  * The container image for each module that runs on the device.
  * The credentials to access private container registries that contain module images.
  * Instructions for how each module should be created and managed.
* The **IoT Edge hub** module twin, which includes how messages flow between modules and eventually to IoT Hub.
* The desired properties of any extra module twins (optional).

All IoT Edge devices must be configured with a deployment manifest. A newly installed IoT Edge runtime reports an error code until configured with a valid manifest.

In the Azure IoT Edge tutorials, you build a deployment manifest by going through a wizard in the Azure IoT Edge portal. You can also apply a deployment manifest programmatically using REST or the IoT Hub Service SDK. For more information, see [Understand IoT Edge deployments](module-deployment-monitoring.md).

## Create a deployment manifest

At a high level, a deployment manifest is a list of module twins that are configured with their desired properties. A deployment manifest tells an IoT Edge device (or a group of devices) which modules to install and how to configure them. Deployment manifests include the *desired properties* for each module twin. IoT Edge devices report back the *reported properties* for each module.

Two modules are required in every deployment manifest: `$edgeAgent`, and `$edgeHub`. These modules are part of the IoT Edge runtime that manages the IoT Edge device and the modules running on it. For more information about these modules, see [Understand the IoT Edge runtime and its architecture](iot-edge-runtime.md).

In addition to the two runtime modules, you can add up to 50 modules of your own to run on an IoT Edge device.

A deployment manifest that contains only the IoT Edge runtime (edgeAgent and edgeHub) is valid.

Deployment manifests follow this structure:

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
    }
  }
}
```

## Configure modules

Define how the IoT Edge runtime installs the modules in your deployment. The IoT Edge agent is the runtime component that manages installation, updates, and status reporting for an IoT Edge device. Therefore, the $edgeAgent module twin contains the configuration and management information for all modules. This information includes the configuration parameters for the IoT Edge agent itself.

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
              // give the IoT Edge agent access to container images that aren't public
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

The IoT Edge agent schema version 1.1 was released along with IoT Edge version 1.0.10, and enables module startup order. Schema version 1.1 is recommended for any IoT Edge deployment running version 1.0.10 or later.

### Module configuration and management

The IoT Edge agent desired properties list is where you define which modules are deployed to an IoT Edge device and how they should be configured and managed.

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

Every module has a **settings** property that contains the module **image**, an address for the container image in a container registry, and any **createOptions** to configure the image on startup. For more information, see [How to configure container create options for IoT Edge modules](how-to-use-create-options.md).

The edgeHub module and custom modules also have three properties that tell the IoT Edge agent how to manage them:

* **Status**: Whether the module should be running or stopped when first deployed. Required.
* **RestartPolicy**: When and if the IoT Edge agent should restart the module if it stops. If the module is stopped without any errors, it won't start automatically. For more information, see [Docker Docs - Start containers automatically](https://aka.ms/docker-container-restart-policy). Required.
* **StartupOrder**: *Introduced in IoT Edge version 1.0.10.* Which order the IoT Edge agent should start the modules when first deployed. The order is declared with integers, where a module given a startup value of 0 is started first and then higher numbers follow. The edgeAgent module doesn't have a startup value because it always starts first. Optional.

  The IoT Edge agent initiates the modules in order of the startup value, but doesn't wait for each module to finish starting before going to the next one.

  Startup order is helpful if some modules depend on others. For example, you may want the edgeHub module to start first so that it's ready to route messages when the other modules start. Or you may want to start a storage module before you start modules that send data to it. However, you should always design your modules to handle failures of other modules. It's the nature of containers that they may stop and restart at any time, and any number of times.

  > [!NOTE]
  > Changes to a module's properties will result in that module restarting. For example, a restart will happen if you change properties for the:
  >    * module image
  >    * Docker create options
  >    * environment variables
  >    * restart policy
  >    * image pull policy
  >    * version
  >    * startup order
  >
  > If no module property is changed, the module will **not** restart.

## Declare routes

The IoT Edge hub manages communication between modules, IoT Hub, and any downstream devices. Therefore, the $edgeHub module twin contains a desired property called *routes* that declares how messages are passed within a deployment. You can have multiple routes within the same deployment.

Routes are declared in the **$edgeHub** desired properties with the following syntax:

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

The IoT Edge hub schema version 1 was released along with IoT Edge version 1.0.10, and enables route prioritization and time to live. Schema version 1.1 is recommended for any IoT Edge deployment running version 1.0.10 or later.

Every route needs a *source* where the messages come from and a *sink* where the messages go. The *condition* is an optional piece that you can use to filter messages.

You can assign *priority* to routes that you want to make sure process their messages first. This feature is helpful in scenarios where the upstream connection is weak or limited and you have critical data that should be prioritized over standard telemetry messages.

### Source

The source specifies where the messages come from. IoT Edge can route messages from modules or downstream devices.

With the IoT SDKs, modules can declare specific output queues for their messages using the ModuleClient class. Output queues aren't necessary, but are helpful for managing multiple routes. Downstream devices can use the DeviceClient class of the IoT SDKs to send messages to IoT Edge gateway devices in the same way that they would send messages to IoT Hub. For more information, see [Understand and use Azure IoT Hub SDKs](../iot-hub/iot-hub-devguide-sdks.md).

The source property can be any of the following values:

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

The condition is optional in a route declaration. If you want to pass all messages from the source to the sink, just leave out the **WHERE** clause entirely. Or you can use the [IoT Hub query language](../iot-hub/iot-hub-devguide-routing-query-syntax.md) to filter for certain messages or message types that satisfy the condition. IoT Edge routes don't support filtering messages based on twin tags or properties.

The messages that pass between modules in IoT Edge are formatted the same as the messages that pass between your devices and Azure IoT Hub. All messages are formatted as JSON and have **systemProperties**, **appProperties**, and **body** parameters.

You can build queries around any of the three parameters with the following syntax:

* System properties: `$<propertyName>` or `{$<propertyName>}`
* Application properties: `<propertyName>`
* Body properties: `$body.<propertyName>`

For examples about how to create queries for message properties, see [Device-to-cloud message routes query expressions](../iot-hub/iot-hub-devguide-routing-query-syntax.md).

An example that is specific to IoT Edge is when you want to filter for messages that arrived at a gateway device from a downstream device. Messages sent from modules include a system property called **connectionModuleId**. So if you want to route messages from downstream devices directly to IoT Hub, use the following route to exclude module messages:

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

### Priority and time-to-live

Routes can be declared with either just a string defining the route, or as an object that takes a route string, a priority integer, and a time-to-live integer.

Option 1:

   ```json
   "route1": "FROM <source> WHERE <condition> INTO <sink>",
   ```

Option 2, introduced in IoT Edge version 1.0.10 with IoT Edge hub schema version 1.1:

   ```json
   "route2": {
     "route": "FROM <source> WHERE <condition> INTO <sink>",
     "priority": 0,
     "timeToLiveSecs": 86400
   }
   ```

**Priority** values can be 0-9, inclusive, where 0 is the highest priority. Messages are queued up based on their endpoints. All priority 0 messages targeting a specific endpoint will be processed before any priority 1 messages targeting the same endpoint are processed, and down the line. If multiple routes for the same endpoint have the same priority, their messages will be processed in a first-come-first-served basis. If no priority is specified, the route is assigned to the lowest priority.

The **timeToLiveSecs** property inherits its value from IoT Edge hub's **storeAndForwardConfiguration** unless explicitly set. The value can be any positive integer.

For detailed information about how priority queues are managed, see the reference page for [Route priority and time-to-live](https://github.com/Azure/iotedge/blob/master/doc/Route_priority_and_TTL.md).

## Define or update desired properties

The deployment manifest specifies desired properties for each module deployed to the IoT Edge device. Desired properties in the deployment manifest overwrite any desired properties currently in the module twin.

If you don't specify a module twin's desired properties in the deployment manifest, IoT Hub won't modify the module twin in any way. Instead, you can set the desired properties programmatically.

The same mechanisms that allow you to modify device twins are used to modify module twins. For more information, see the [module twin developer guide](../iot-hub/iot-hub-devguide-module-twins.md).

## Deployment manifest example

The following example shows what a valid deployment manifest document may look like.

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
              "image": "mcr.microsoft.com/azureiotedge-agent:1.4",
              "createOptions": "{}"
            }
          },
          "edgeHub": {
            "type": "docker",
            "status": "running",
            "restartPolicy": "always",
            "startupOrder": 0,
            "settings": {
              "image": "mcr.microsoft.com/azureiotedge-hub:1.4",
              "createOptions": "{\"HostConfig\":{\"PortBindings\":{\"443/tcp\":[{\"HostPort\":\"443\"}],\"5671/tcp\":[{\"HostPort\":\"5671\"}],\"8883/tcp\":[{\"HostPort\":\"8883\"}]}}}"
            }
          }
        },
        "modules": {
          "SimulatedTemperatureSensor": {
            "version": "1.0",
            "type": "docker",
            "status": "running",
            "restartPolicy": "always",
            "startupOrder": 2,
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

* For a complete list of properties that can or must be included in $edgeAgent and $edgeHub, see [Properties of the IoT Edge agent and IoT Edge hub](module-edgeagent-edgehub.md).

* Now that you know how IoT Edge modules are used, [Understand the requirements and tools for developing IoT Edge modules](module-development.md).
