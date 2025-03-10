---
title: Properties of the agent and hub module twins - Azure IoT Edge
description: Review the specific properties and their values for the edgeAgent and edgeHub module twins
author: PatAltimore

ms.author: patricka
ms.date: 04/16/2021
ms.topic: conceptual
ms.service: azure-iot-edge
services: iot-edge
---

# Properties of the IoT Edge agent and IoT Edge hub module twins

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

The IoT Edge agent and IoT Edge hub are two modules that make up the IoT Edge runtime. For more information about the responsibilities of each runtime module, see [Understand the Azure IoT Edge runtime and its architecture](iot-edge-runtime.md).

This article provides the desired properties and reported properties of the runtime module twins. For more information on how to deploy modules on IoT Edge devices, see [Learn how to deploy modules and establish routes in IoT Edge](module-composition.md).

A module twin includes:

* **Desired properties**. The solution backend can set desired properties, and the module can read them. The module can also receive notifications of changes in the desired properties. Desired properties are used along with reported properties to synchronize module configuration or conditions.

* **Reported properties**. The module can set reported properties, and the solution backend can read and query them. Reported properties are used along with desired properties to synchronize module configuration or conditions.

## EdgeAgent desired properties

The module twin for the IoT Edge agent is called `$edgeAgent` and coordinates the communications between the IoT Edge agent running on a device and IoT Hub. The desired properties are set when applying a deployment manifest on a specific device as part of a single-device or at-scale deployment.

| Property | Description | Required |
| -------- | ----------- | -------- |
| imagePullPolicy | When to pull the image in either *OnCreate* or *Never* (*Never* can be used if the image is already on the device) | Yes |
| restartPolicy | When the module should be restarted. Possible values are: *Never*: don't restart module if not running, *Always*: always restart module if not running, *On-Unhealthy*: restart module if unhealthy. Unhealthy is what Docker reports based on a health check, for example "Unhealthy - the container is not working correctly", *On-Failed*: restart if Failed. | Yes |
| runtime.type | Has to be *docker*. | Yes |
| runtime.settings.minDockerVersion | Set to the minimum Docker version required by this deployment manifest. | Yes |
| runtime.settings.loggingOptions | A stringified JSON containing the logging options for the IoT Edge agent container. [Docker logging options](https://docs.docker.com/engine/admin/logging/overview/) | No |
| runtime.settings.registryCredentials.{registryId}.username | The username of the container registry. For Azure Container Registry, the username is usually the registry name. Registry credentials are necessary for any private module images. | No |
| runtime.settings.registryCredentials.{registryId}.password | The password for the container registry. | No |
| runtime.settings.registryCredentials.{registryId}.address | The address of the container registry. For Azure Container Registry, the address is usually *{registry name}.azurecr.io*. | No | 
| schemaVersion | Either *1.0* or *1.1*. Version 1.1 was introduced with IoT Edge version 1.0.10, and is recommended. | Yes | 
| status | Desired status of the module: *Running* or *Stopped*. | Required |
| systemModules.edgeAgent.type | Has to be *docker*. | Yes |
| systemModules.edgeAgent.startupOrder | An integer value for the location a module has in the startup order. A *0* is first and *max integer* (4294967295) is last. If a value isn't provided, the default is *max integer*.  | No |
| systemModules.edgeAgent.settings.image | The URI of the image of the IoT Edge agent. Currently, the IoT Edge agent isn't able to update itself. | Yes |
| systemModules.edgeAgent.settings.createOptions | A stringified JSON containing the options for the creation of the IoT Edge agent container. [Docker create options](https://docs.docker.com/engine/api/v1.32/#operation/ContainerCreate) | No |
| systemModules.edgeAgent.configuration.id | The ID of the deployment that deployed this module. | IoT Hub sets this property when the manifest is applied using a deployment. Not part of a deployment manifest. |
| systemModules.edgeHub.type | Has to be *docker*. | Yes |
| systemModules.edgeHub.status | Has to be *running*. | Yes |
| systemModules.edgeHub.restartPolicy | Has to be *always*. | Yes |
| systemModules.edgeHub.startupOrder | An integer value for which spot a module has in the startup order. A *0* is first and *max integer* (4294967295) is last. If a value isn't provided, the default is *max integer*.  | No |
| systemModules.edgeHub.settings.image | The URI of the image of the IoT Edge hub. | Yes |
| systemModules.edgeHub.settings.createOptions | A stringified JSON containing the options for the creation of the IoT Edge hub container. [Docker create options](https://docs.docker.com/engine/api/v1.32/#operation/ContainerCreate) | No |
| systemModules.edgeHub.configuration.id | The ID of the deployment that deployed this module. | IoT Hub sets this property when the manifest is applied using a deployment. Not part of a deployment manifest. |
| modules.{moduleId}.version | A user-defined string representing the version of this module. | Yes |
| modules.{moduleId}.type | Has to be *docker*. | Yes |
| modules.{moduleId}.status | {*running* \| *stopped*} | Yes |
| modules.{moduleId}.restartPolicy | {*never* \| *always*} | Yes |
| modules.{moduleId}.startupOrder | An integer value for the location a module has in the startup order. A *0* is first and *max integer* (4294967295) is last. If a value isn't provided, the default is *max integer*.  | No |
| modules.{moduleId}.imagePullPolicy | {*on-create* \| *never*} | No |
| modules.{moduleId}.env | A list of environment variables to pass to the module. Takes the format `"<name>": {"value": "<value>"}`. | No |
| modules.{moduleId}.settings.image | The URI to the module image. | Yes |
| modules.{moduleId}.settings.createOptions | A stringified JSON containing the options for the creation of the module container. [Docker create options](https://docs.docker.com/engine/api/v1.32/#operation/ContainerCreate) | No |
| modules.{moduleId}.configuration.id | The ID of the deployment that deployed this module. | IoT Hub sets this property when the manifest is applied using a deployment. Not part of a deployment manifest. |
| version | The current iteration that has version, commit, and build. | No |

## EdgeAgent reported properties

The IoT Edge agent reported properties include three main pieces of information:

1. The status of the application of the last-seen desired properties;
2. The status of the modules currently running on the device, as reported by the IoT Edge agent; and
3. A copy of the desired properties currently running on the device.

The copy of the current desired properties is useful to tell whether the device has applied the latest deployment or is still running a previous deployment manifest.

> [!NOTE]
> The reported properties of the IoT Edge agent are useful as they can be queried with the [IoT Hub query language](../iot-hub/iot-hub-devguide-query-language.md) to investigate the status of deployments at scale. For more information on how to use the IoT Edge agent properties for status, see [Understand IoT Edge deployments for single devices or at scale](module-deployment-monitoring.md).

The following table does not include the information that is copied from the desired properties.

| Property | Description |
| -------- | ----------- |
| lastDesiredStatus.code | This status code refers to the last desired properties seen by the IoT Edge agent. Allowed values: `200` Success, `400` Invalid configuration, `412` Invalid schema version, `417` Desired properties are empty, `500` Failed.|
| lastDesiredStatus.description | Text description of the status. |
| lastDesiredVersion | This integer refers to the last version of the desired properties processed by the IoT Edge agent. |
| runtime.platform.OS | Reporting the OS running on the device. |
| runtime.platform.architecture | Reporting the architecture of the CPU on the device. |
| schemaVersion | Schema version of reported properties. |
| systemModules.edgeAgent.runtimeStatus | The reported status of IoT Edge agent: {*running* \| *unhealthy*}. |
| systemModules.edgeAgent.statusDescription | Text description of the reported status of the IoT Edge agent. |
| systemModules.edgeAgent.exitCode | The exit code reported by the IoT Edge agent container if the container exits. |
| systemModules.edgeAgent.lastStartTimeUtc | Time when IoT Edge agent was last started. |
| systemModules.edgeAgent.lastExitTimeUtc | Time when IoT Edge agent last exited. |
| systemModules.edgeHub.runtimeStatus | Status of IoT Edge hub: { *running* \| *stopped* \| *failed* \| *backoff* \| *unhealthy* }. |
| systemModules.edgeHub.statusDescription | Text description of the status of IoT Edge hub, if unhealthy. |
| systemModules.edgeHub.exitCode | Exit code reported by the IoT Edge hub container, if the container exits. |
| systemModules.edgeHub.lastStartTimeUtc | Time when IoT Edge hub was last started. |
| systemModules.edgeHub.lastExitTimeUtc | Time when IoT Edge hub was last exited. |
| systemModules.edgeHub.lastRestartTimeUtc | Time when IoT Edge hub was last restarted. |
| systemModules.edgeHub.restartCount | Number of times this module was restarted as part of the restart policy. |
| modules.{moduleId}.runtimeStatus | Status of the module: { *running* \| *stopped* \| *failed* \| *backoff* \| *unhealthy* }. |
| modules.{moduleId}.statusDescription | Text description of the status of the module, if unhealthy. |
| modules.{moduleId}.exitCode | The exit code reported by the module container, if the container exits. |
| modules.{moduleId}.lastStartTimeUtc | Time when the module was last started. |
| modules.{moduleId}.lastExitTimeUtc | Time when the module was last exited. |
| modules.{moduleId}.lastRestartTimeUtc | Time when the module was last restarted. |
| modules.{moduleId}.restartCount | Number of times this module was restarted as part of the restart policy. |
| version | Version of the image. Example: "version": { "version": "1.2.7", "build": "50979330", "commit": "d3ec971caa0af0fc39d2c1f91aef21e95bd0c03c" }. | 

## EdgeHub desired properties

The module twin for the IoT Edge hub is called `$edgeHub` and coordinates the communications between the IoT Edge hub running on a device and IoT Hub. The desired properties are set when applying a deployment manifest on a specific device as part of a single-device or at-scale deployment.

| Property | Description | Required in the deployment manifest |
| -------- | ----------- | -------- |
| schemaVersion | Either 1.0 or 1.1. Version 1.1 was introduced with IoT Edge version 1.0.10, and is recommended. | Yes |
| routes.{routeName} | A string representing an IoT Edge hub route. For more information, see [Declare routes](module-composition.md#declare-routes). | The `routes` element can be present but empty. |
| storeAndForwardConfiguration.timeToLiveSecs | The device time in seconds that IoT Edge hub keeps messages if disconnected from routing endpoints, whether IoT Hub or a local module. This time persists over any power offs or restarts. For more information, see [Offline capabilities](offline-capabilities.md#time-to-live). | Yes |

## EdgeHub reported properties

| Property | Description |
| -------- | ----------- |
| lastDesiredVersion | This integer refers to the last version of the desired properties processed by the IoT Edge hub. |
| lastDesiredStatus.code | The status code referring to last desired properties seen by the IoT Edge hub. Allowed values: `200` Success, `400` Invalid configuration, `500` Failed |
| lastDesiredStatus.description | Text description of the status. |
| clients | All clients connected to edgeHub with the status and last connected time. Example: "clients": { "device2/SimulatedTemperatureSensor": { "status": "Connected", "lastConnectedTimeUtc": "2022-11-17T21:49:16.4781564Z" } }. |
| clients.{device or moduleId}.status | The connectivity status of this device or module. Possible values {*connected* \| *disconnected*}. Only module identities can be in disconnected state. Downstream devices connecting to IoT Edge hub appear only when connected. |
| clients.{device or moduleId}.lastConnectTime | Last time the device or module connected. |
| clients.{device or moduleId}.lastDisconnectTime | Last time the device or module disconnected. |
| schemaVersion | Schema version of reported properties. |
| version | Version of the image. Example: "version": { "version": "1.2.7", "build": "50979330", "commit": "d3ec971caa0af0fc39d2c1f91aef21e95bd0c03c" }. | 

## Next steps

To learn how to use these properties to build out deployment manifests, see [Understand how IoT Edge modules can be used, configured, and reused](module-composition.md).
