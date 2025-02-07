---
title: Use jobs to schedule tasks for groups of devices (CLI)
titleSuffix: Azure IoT Hub
description: Use the Azure CLI to schedule jobs that invoke a direct method and update device twin properties of a simulated device.
author: kgremban

ms.author: kgremban
ms.service: azure-iot-hub
ms.devlang: azurecli
ms.topic: how-to
ms.date: 01/10/2025
ms.custom: mqtt, devx-track-azurecli
---

# Schedule and broadcast jobs with Azure CLI

Use the Azure CLI to schedule and track jobs that update millions of devices. Use jobs to:

* Update desired properties
* Update tags
* Invoke direct methods

Conceptually, a job wraps one of these actions and tracks the progress of execution against a set of devices. A device twin query defines the set of devices with which a job interacts. For example, a back-end app can use a job to invoke a reboot method on 10,000 devices, specified by a device twin query and scheduled at a future time. That application can then track progress as each of those devices receives and executes the reboot method.

To learn more about how jobs help to manage bulk device management operations, see [Schedule jobs on multiple devices](./iot-hub-devguide-jobs.md).

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-whole.md)]

## Prerequisites

* Azure CLI. You can also run the commands in this article using the [Azure Cloud Shell](../cloud-shell/overview.md), an interactive CLI shell that runs in your browser or in an app such as Windows Terminal. If you use the Cloud Shell, you don't need to install anything. If you prefer to use the CLI locally, this article requires Azure CLI version 2.36 or later. To find the installed version, run `az --version`. To locally install or upgrade Azure CLI, see [Install Azure CLI](/cli/azure/install-azure-cli).

* An IoT hub in your Azure subscription. If you don't have a hub yet, you can follow the steps in [Create an IoT hub](create-hub.md).

## Schedule a job to invoke a direct method

You can use jobs to invoke a [direct method](./iot-hub-devguide-direct-methods.md) on one or more devices.

Use the [az iot hub job create](/cli/azure/iot/hub/job#az-iot-hub-job-create) command, replacing the following placeholders with their corresponding values. The command schedules a job that calls a method name on the target devices.

```azurecli
az iot hub job create --hub-name {HubName} --job-id {JobName} \
                      --job-type scheduleDeviceMethod \
                      --method-name {MethodName} --method-payload {MethodPayload} \
                      --query-condition "{DeviceQuery}"
```

| Placeholder | Value |
| ----------- | ----- |
| `{HubName}` | The name of your IoT hub. |
| `{JobName}` | The name of your scheduled job. Job names are unique, so choose a different job name each time you run this command. |
| `{MethodName}` | The name of your direct method. |
| `{MethodPayload}` | Any payload to be provided to the direct method. If no payload is required, use `null`. |
| `{DeviceQuery}` | A query that defines the device or devices to target with the job. For example, a single device job could use the following query condition: `deviceId = 'myExampleDevice'`. |

> [!TIP]
> When scheduling a job [az iot hub job create](/cli/azure/iot/hub/job#az-iot-hub-job-create) command that invokes a direct method, you must specify values for both the `--method-name` and `--method-payload` optional parameters. For direct methods that don't accept a payload, specify `null` for the `--method-payload` parameter.

## Schedule a job to update a device twin properties

You can use jobs to update a [device twin](./iot-hub-devguide-device-twins.md) desired property.

Use the [az iot hub job create](/cli/azure/iot/hub/job#az-iot-hub-job-create) command, replacing the following placeholders with their corresponding values. In this example, we're scheduling a job to set the value of the desired twin property `BuildingNo` to 45 for our simulated device.

```azurecli
az iot hub job create --hub-name {HubName} --job-id {JobName} \
                      --job-type scheduleUpdateTwin \
                      --twin-patch '{JSONTwinPatch}' \
                      --query-condition "{DeviceQuery}"
```

| Placeholder | Value |
| ----------- | ----- |
| `{HubName}` | The name of your IoT hub. |
| `{JobName}` | The name of your scheduled job. Job names are unique, so choose a different job name each time you run this command. |
| `{JSONTwinPatch}` | The JSON snippet that you want to use to update the device twin's desired properties. For example, `{"properties":{"desired": {"BuildingNo": 45}}}`. |
| `{DeviceQuery}` | A query that defines the device or devices to target with the job. For example, a single device job could use the following query condition: `deviceId = 'myExampleDevice'`. |

## Related content

Learn how to implement jobs programmatically using the Azure IoT SDKs: [Schedule and broadcast jobs](./schedule-jobs-dotnet.md).