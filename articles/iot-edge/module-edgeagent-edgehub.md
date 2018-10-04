---
title: Azure IoT EdgeAgent and EdgeHub reference | Microsoft Docs 
description: Review the specific properties and their values for the edgeAgent and edgeHub module twins
author: kgremban
manager: timlt
ms.author: kgremban
ms.date: 09/21/2018
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Properties of the Edge agent and Edge hub module twins

The Edge agent and Edge hub are two modules that make up the IoT Edge runtime. For more information about what duties each module performs, see [Understand the Azure IoT Edge runtime and its architecture](iot-edge-runtime.md). 

This article provides the desired properties and reported properties of the runtime module twins. For more information on how to deploy modules on IoT Edge devices, see [Deployment and monitoring][lnk-deploy].

## EdgeAgent desired properties

The module twin for the Edge agent is called `$edgeAgent` and coordinates the communications between the Edge agent running on a device and IoT Hub. The desired properties are set when applying a deployment manifest on a specific device as part of a single-device or at-scale deployment. 

| Property | Description | Required |
| -------- | ----------- | -------- |
| schemaVersion | Has to be "1.0" | Yes |
| runtime.type | Has to be "docker" | Yes |
| runtime.settings.minDockerVersion | Set to the minimum Docker version required by this deployment manifest | Yes |
| runtime.settings.loggingOptions | A stringified JSON containing the logging options for the Edge agent container. [Docker logging options][lnk-docker-logging-options] | No |
| runtime.settings.registryCredentials<br>.{registryId}.username | The username of the container registry. For Azure Container Registry, the username is usually the registry name.<br><br> Registry credentials are necessary for any module images that are not public. | No |
| runtime.settings.registryCredentials<br>.{registryId}.password | The password for the container registry. | No |
| runtime.settings.registryCredentials<br>.{registryId}.address | The address of the container registry. For Azure Container Registry, the address is usually *{registryname}.azurecr.io*. | No |  
| systemModules.edgeAgent.type | Has to be "docker" | Yes |
| systemModules.edgeAgent.settings.image | The URI of the image of the Edge agent. Currently, the Edge agent is not able to update itself. | Yes |
| systemModules.edgeAgent.settings<br>.createOptions | A stringified JSON containing the options for the creation of the Edge agent container. [Docker create options][lnk-docker-create-options] | No |
| systemModules.edgeAgent.configuration.id | The ID of the deployment that deployed this module. | This property is set by IoT Hub when this manifest is applied using a deployment. Not part of a deployment manifest. |
| systemModules.edgeHub.type | Has to be "docker" | Yes |
| systemModules.edgeHub.status | Has to be "running" | Yes |
| systemModules.edgeHub.restartPolicy | Has to be "always" | Yes |
| systemModules.edgeHub.settings.image | The URI of the image of the Edge hub. | Yes |
| systemModules.edgeHub.settings<br>.createOptions | A stringified JSON containing the options for the creation of the Edge hub container. [Docker create options][lnk-docker-create-options] | No |
| systemModules.edgeHub.configuration.id | The ID of the deployment that deployed this module. | This property is set by IoT Hub when this manifest is applied using a deployment. Not part of a deployment manifest. |
| modules.{moduleId}.version | A user-defined string representing the version of this module. | Yes |
| modules.{moduleId}.type | Has to be "docker" | Yes |
| modules.{moduleId}.status | {"running" \| "stopped"} | Yes |
| modules.{moduleId}.restartPolicy | {"never" \| "on-failed" \| "on-unhealthy" \| "always"} | Yes |
| modules.{moduleId}.settings.image | The URI to the module image. | Yes |
| modules.{moduleId}.settings.createOptions | A stringified JSON containing the options for the creation of the module container. [Docker create options][lnk-docker-create-options] | No |
| modules.{moduleId}.configuration.id | The ID of the deployment that deployed this module. | This property is set by IoT Hub when this manifest is applied using a deployment. Not part of a deployment manifest. |

## EdgeAgent reported properties

The Edge agent reported properties include three main pieces of information:

1. The status of the application of the last-seen desired properties;
2. The status of the modules currently running on the device, as reported by the Edge agent; and
3. A copy of the desired properties currently running on the device.

This last piece of information is useful in case the latest desired properties are not applied successfully by the runtime, and the device is still running a previous deployment manifest.

> [!NOTE]
> The reported properties of the Edge agent are useful as they can be queried with the [IoT Hub query language][lnk-iothub-query] to investigate the status of deployments at scale. For more information on how to use the Edge agent properties for status, see [Understand IoT Edge deployments for single devices or at scale][lnk-deploy].

The following table does not include the information that is copied from the desired properties.

| Property | Description |
| -------- | ----------- |
| lastDesiredVersion | This integer refers to the last version of the desired properties processed by the Edge agent. |
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

## EdgeHub desired properties

The module twin for the Edge hub is called `$edgeHub` and coordinates the communications between the Edge hub running on a device and IoT Hub. The desired properties are set when applying a deployment manifest on a specific device as part of a single-device or at-scale deployment. 

| Property | Description | Required in the deployment manifest |
| -------- | ----------- | -------- |
| schemaVersion | Has to be "1.0" | Yes |
| routes.{routeName} | A string representing an Edge hub route. | The `routes` element can be present but empty. |
| storeAndForwardConfiguration.timeToLiveSecs | The time in seconds that Edge hub keeps messages in case of disconnected routing endpoints, for example, disconnected from IoT Hub, or local module | Yes |

## EdgeHub reported properties

| Property | Description |
| -------- | ----------- |
| lastDesiredVersion | This integer refers to the last version of the desired properties processed by the Edge hub. |
| lastDesiredStatus.code | This is the status code referring to last desired properties seen by the Edge hub. Allowed values: `200` Success, `400` Invalid configuration, `500` Failed |
| lastDesiredStatus.description | Text description of the status |
| clients.{device or moduleId}.status | The connectivity status of this device or module. Possible values {"connected" \| "disconnected"}. Only module identities can be in disconnected state. Downstream devices connecting to Edge hub appear only when connected. |
| clients.{device or moduleId}.lastConnectTime | Last time the device or module connected |
| clients.{device or moduleId}.lastDisconnectTime | Last time the device or module disconnected |

## Next steps

To learn how to use these properties to build out deployment manifests, see [Understand how IoT Edge modules can be used, configured, and reused](module-composition.md).

<!--links -->
[lnk-deploy]: module-deployment-monitoring.md
[lnk-docker-create-options]: https://docs.docker.com/engine/api/v1.32/#operation/ContainerCreate
[lnk-docker-logging-options]: https://docs.docker.com/engine/admin/logging/overview/
[lnk-iothub-query]: ../iot-hub/iot-hub-devguide-query-language.md
