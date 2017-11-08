---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Azure IoT Edge module composition | Microsoft Docs 
description: Learn what goes into Azure IoT Edge modules and how they can be reused
services: iot-edge
keywords: 
author: kgremban
manager: timlt

ms.author: kgremban
ms.date: 10/05/2017
ms.topic: article
ms.service: iot-edge

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.devlang:devlang-from-white-list
# ms.suite: 
# ms.tgt_pltfrm:
# ms.reviewer:
---

# Understand how IoT Edge modules can be used, configured, and reused

Azure IoT Edge allows you to compose multiple IoT Edge modules before deploying them to IoT Edge devices. This article explains the most important concepts around composing multiple IoT Edge modules before deployment. 

## The deployment manifest
The *deployment manifest* is a JSON document which describes:

* Which IoT Edge modules have to be deployed, along with their creation and management options;
* The configuration of the Edge hub, describing how messages should flow between modules, and between modules and IoT Hub;
* Optionally, the values to set in the desired properties of the module twins, to configure the individual module applications.

In the tutorial [Deploy an IoT Edge module to a simulated device][lnk-tutorial1], you build a deployment manifest by going through a wizard in the Azure IoT Edge portal. You can also apply a deployment manifest programmatically using REST or the IoT Hub Service SDK. Refer to [Deploy and monitor][lnk-deploy] for more information on IoT Edge deployments.

At a high level, the deployment manifest configures the desired properties of the IoT Edge modules deployed on an IoT Edge device. Two of these modules are always present: the Edge agent, and the Edge hub.

The manifest follows this structure:

    {
        "moduleContent": {
            "$edgeAgent": {
                "properties.desired": {
                    // desired properties of the Edge agent
                }
            },
            "$edgeHub": {
                "properties.desired": {
                    // desired properties of the Edge hub
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

An example of a deployment manifest is reported at the end of this section.

> [!IMPORTANT]
> All IoT Edge devices need to be configured with a deployment manifest. A newly installed IoT Edge runtime will report an error code until configured with a valid manifest. 

### Specify the modules
The desired properties of the module twin of the Edge agent contain: the desired modules, their configuration and management options, along with configuration parameters for the Edge agent.

At a high level, this section of the manifest contains the references to the module images and management options for the IoT Edge runtime modules (Edge agent and Edge hub), and the user-specified modules.

Refer to the [desired properties of the Edge agent][lnk-edgeagent-desired] for the detailed decsription of this section of the manifest.

> [!NOTE]
> A deployment manifest containing only the IoT Edge runtime (agent and hub) is valid.


### Specify the routes
Edge hub provides a way to declaratively route messages between modules, and between modules and IoT Hub.

Routes have the following syntax:

        FROM <source>
        [WHERE <condition>]
        INTO <sink>

The *source* can be anything of the following:

| Source | Description |
| ------ | ----------- |
| `/*` | All device-to-cloud messages from any device or module |
| `/messages/*` | Any device-to-cloud message sent by a device or a module through some or no output |
| `/messages/modules/*` | Any device-to-cloud message sent by a module through some or no output |
| `/messages/modules/{moduleId}/*` | Any device-to-cloud message sent by {moduleId} with no output |
| `/messages/modules/{moduleId}/outputs/*` | Any device-to-cloud message sent by {moduleId} with some output |
| `/messages/modules/{moduleId}/outputs/{output}` | Any device-to-cloud message sent by {moduleId} using {output} |

The condition can be any condition supported by the [IoT Hub query language][lnk-iothub-query] for IoT Hub routing rules.

The sink can be one of the following:

| Sink | Description |
| ---- | ----------- |
| `$upstream` | Send the message to IoT Hub |
| `BrokeredEndpoint(/modules/{moduleId}/inputs/{input})` | Send the message to input `{input}` of module `{moduleId}` |

It is important to note that Edge hub provides at-least-once guarantees, which means that messages will be stored locally in case a route cannot deliver the message to its sink, e.g. the Edge hub cannot connect to IoT Hub, or the target module is not connected.

Edge hub will store the messages up to the time specified in the `storeAndForwardConfiguration.timeToLiveSecs` property of the Edge hub desired properties.

### Specifying the desired properties of the module twin

The deployment manifest can specify the desired properties of the module twin of each of the user modules specified in the Edge agent section.

Note that when the desired properties are specified in the deployment manifest, they will overwrite any desired properties currently in the module twin.

If you do not specify a module twin's desired properties in the deployment manifest, IoT Hub will not modify the module twin in any way, and you will be able to set the desired properties programmatically.

### Deployment manifest example

This an example of a deployment manifest JSON document.

    {
    "moduleContent": {
        "$edgeAgent": {
            "properties.desired": {
                "schemaVersion": "1.0",
                "runtime": {
                    "type": "docker",
                    "settings": {
                        "minDockerVersion": "v1.25",
                        "loggingOptions": ""
                    }
                },
                "systemModules": {
                    "edgeAgent": {
                        "type": "docker",
                        "settings": {
                        "image": "edgepreview.azurecr.io/azureiotedge/edge-agent:1.0-preview",
                        "createOptions": ""
                        }
                    },
                    "edgeHub": {
                        "type": "docker",
                        "status": "running",
                        "restartPolicy": "always",
                        "settings": {
                        "image": "edgepreview.azurecr.io/azureiotedge/edge-hub:1.0-preview",
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
                        "image": "edgepreview.azurecr.io/azureiotedge/simulated-temperature-sensor:1.0-preview",
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

## Reference: Edge agent module twin

The module twin for the Edge agent is called `$edgeAgent` and coordinates the communications between the Edge agent running on a device and IoT Hub.
The desired properties are set when applying a deployment manifest on a specific device as part of a single-device or at-scale deployment. See [Deployment and monitoring][lnk-deploy] for more information on how to deploy modules on IoT Edge devices.

### Edge agent twin desired properties

| Property | Description | Required |
| -------- | ----------- | -------- |
| schemaVersion | Has to be "1.0" | Yes |
| runtime.type | Has to be "docker" | Yes |
| runtime.settings.minDockerVersion | Set to the minimum Docker version required by this deployment manifest | Yes |
| runtime.settings.loggingOptions | A stringified JSON containing the logging options for the Edge agent container. [Docker logging options][lnk-docker-logging-options] | No |
| systemModules.edgeAgent.type | Has to be "docker" | Yes |
| systemModules.edgeAgent.settings.image | The URI of the image of the Edge agent. Currently, the Edge agent is not able to update itself. | Yes |
| systemModules.edgeAgent.settings.createOptions | A stringified JSON containing the options for the creation of the Edge agent container. [Docker create options][lnk-docker-create-options] | No |
| systemModules.edgeAgent.configuration.id | The id of the deployment that deployed this module. | This is set by IoT Hub when this manifest is applied using a deployment. Not part of a deployment manifest. |
| systemModules.edgeHub.type | Has to be "docker" | Yes |
| systemModules.edgeHub.status | Has to be "running" | Yes |
| systemModules.edgeHub.restartPolicy | Has to be "always" | Yes |
| systemModules.edgeHub.settings.image | The URI of the image of the Edge hub. | Yes |
| systemModules.edgeHub.settings.createOptions | A stringified JSON containing the options for the creation of the Edge hub container. [Docker create options][lnk-docker-create-options] | No |
| systemModules.edgeHub.configuration.id | The id of the deployment that deployed this module. | This is set by IoT Hub when this manifest is applied using a deployment. Not part of a deployment manifest. |
| modules.{moduleId}.version | A user-defined string representing the version of this module. | Yes |
| modules.{moduleId}.type | Has to be "docker" | Yes |
| modules.{moduleId}.restartPolicy | {"never" \| "on-failed" \| "on-unhealthy" \| "always"} | Yes |
| modules.{moduleId}.settings.image | The URI to the module image. | Yes |
| modules.{moduleId}.settings.createOptions | A stringified JSON containing the options for the creation of the module container. [Docker create options][lnk-docker-create-options] | No |
| modules.{moduleId}.configuration.id | The id of the deployment that deployed this module. | This is set by IoT Hub when this manifest is applied using a deployment. Not part of a deployment manifest. |

### Edge agent twin reported properties

The Edge agent reported properties include three main pieces of information:

1. The status of the application of the last-seen desired properties;
2. The status of the modules currently running on the device, as reported by the Edge agent; and
3. A copy of the desired properties currently running on the device.

This last pioece of information is useful in case the latest desired properties are not applied successfully by the runtime, and the device is still running a previous deployment manifest.

> [!NOTE]
> The reported properties of the Edge agent are extremely useful as they can be queried with the [IoT Hub query language] to investigate the status of deployments at scale. Refer to [Deployments][lnk-deploy] for more information on how to use this feature.

The following table does not include the information that is copied from the desired properties.

| Property | Description |
| -------- | ----------- |
| lastDesiredVersion | This int refers to the last version of the desired properties processed by the Edge agent. |
| lastDesiredStatus.code | This is the status code referring to last desired properties seen by the Edge agent. Allowed values: `200` Success, `400` Invalid configuration, `412` Invalid schema version, `417` the desired properties are empty, `500` Failed |
| lastDesiredStatus.description | Text description of the status |
| deviceHealth | `healthy` if the runtime status of all modules is either `running` or `stopped`, `unhealthy` otherwise |
| configurationHealth.{deploymentId}.health | `healthy` if the runtime status of all modules set by the deployment {deploymentId} is either `running` or `stopped`, `unhealthy` otherwise |
| runtime.platform.OS | Reporting the OS running on the device |
| runtime.platform.architecture | Reporting the architecture of the CPU on the device |
| systemModules.edgeAgent.runtimeStatus | The reported status of Edge agent: {"running" \| "unhealthy"} |
| systemModules.edgeAgent.statusDescription | Text description of the reported status of the Edge agent. |
| systemModules.edgeHub.runtimeStatus | Current status of Edge hub: { "running" \| "stopped" \| "failed" \| "backoff" \| "unhealthy" } |
| systemModules.edgeHub.statusDescription | Text description of the current status of Edge hub if unhealthy. |
| systemModules.edgeHub.exitCode | If exited, the exit code reported by the Edge hub container |
| systemModules.edgeHub.startTimeUtc | Time when Edge hub was last started |
| systemModules.edgeHub.lastExitTimeUtc | Time when Edge hub last exited |
| systemModules.edgeHub.lastRestartTimeUtc | Time when Edge hub was last restarted |
| systemModules.edgeHub.restartCount | Number of times this module was restarted as part of the restart policy. |
| modules.{moduleId}.runtimeStatus | Current status of the module: { "running" \| "stopped" \| "failed" \| "backoff" \| "unhealthy" } |
| modules.{moduleId}.statusDescription | Text description of the current status of the module if unhealthy. |
| modules.{moduleId}.exitCode | If exited, the exit code reported by the module container |
| modules.{moduleId}.startTimeUtc | Time when the module was last started |
| modules.{moduleId}.lastExitTimeUtc | Time when the module last exited |
| modules.{moduleId}.lastRestartTimeUtc | Time when the module was last restarted |
| modules.{moduleId}.restartCount | Number of times this module was restarted as part of the restart policy. |

## Reference: Edge hub module twin

The module twin for the Edge hub is called `$edgeHub` and coordinates the communications between the Edge hub running on a device and IoT Hub.
The desired properties are set when applying a deployment manifest on a specific device as part of a single-device or at-scale deployment. See [Deployments][lnk-deploy] for more information on how to deploy modules on IoT Edge devices.

### Edge hub twin desired properties

| Property | Description | Required in the deployment manifest |
| -------- | ----------- | -------- |
| schemaVersion | Has to be "1.0" | Yes |
| routes.{routeName} | A string representing an Edge hub route. | The `routes` element can be present but empty. |
| storeAndForwardConfiguration.timeToLiveSecs | The time in seconds that Edge hub will keep messages in case of disconnected routing endpoints, e.g. disconnected from IoT Hub, or local module | Yes |

### Edge hub twin reported properties

| Property | Description |
| -------- | ----------- |
| lastDesiredVersion | This int refers to the last version of the desired properties processed by the Edge hub. |
| lastDesiredStatus.code | This is the status code referring to last desired properties seen by the Edge hub. Allowed values: `200` Success, `400` Invalid configuration, `500` Failed |
| lastDesiredStatus.description | Text description of the status |
| clients.{device or module identity}.status | The connectivioty status of this device or module. Possible values {"connected" \| "disconnected"}. Only module identities can be in disconnected state. Downstream devices connecting to Edge hub appear only when connected. |
| clients.{device or module identity}.lastConnectTime | Last time the device or module connected |
| clients.{device or module identity}.lastDisconnectTime | Last time the device or module disconnected |


[lnk-tutorial1]: tutorial-install-iot-edge.md
[lnk-deploy]: module-deployment-monitoring.md
[lnk-edgeagent-desired]: #edge-agent-twin-desired-properties
[lnk-edgeagent-reported]: #edge-agent-twin-reported-properties
[lnk=edgehub-desired]: #edge-hub-twin-desired-properties
[lnk-edgehub-reported]: #edge-hub-twin-reported-properties

[lnk-iothub-query]: ../iot-hub/iot-hub-devguide-query-language.md

[lnk-docker-create-options]: https://docs.docker.com/engine/api/v1.32/#operation/ContainerCreate

[lnk-docker-logging-options]: https://docs.docker.com/engine/admin/logging/overview/