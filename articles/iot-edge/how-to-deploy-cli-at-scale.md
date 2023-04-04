---
title: Deploy modules at scale using Azure CLI - Azure IoT Edge
description: Use the IoT extension for the Azure CLI to create automatic deployments for groups of IoT Edge devices.
keywords: 
author: PatAltimore

ms.author: patricka
ms.date: 10/13/2020
ms.topic: conceptual
ms.service: iot-edge 
ms.custom: devx-track-azurecli
services: iot-edge
---
# Deploy and monitor IoT Edge modules at scale by using the Azure CLI

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

Create an [Azure IoT Edge automatic deployment](module-deployment-monitoring.md) by using the Azure CLI to manage ongoing deployments for many devices at once. Automatic deployments for IoT Edge are part of the [device management](../iot-hub/iot-hub-automatic-device-management.md) feature of Azure IoT Hub. Deployments are dynamic processes that enable you to deploy multiple modules to multiple devices, track the status and health of the modules, and make changes when necessary.

In this article, you set up the Azure CLI and the IoT extension. You then learn how to deploy modules to a set of IoT Edge devices and monitor the progress by using the available CLI commands.

## Prerequisites

* An [IoT hub](../iot-hub/iot-hub-create-using-cli.md) in your Azure subscription.
* One or more IoT Edge devices.

  If you don't have an IoT Edge device set up, you can create one in an Azure virtual machine. Follow the steps in one of these quickstart articles: [Create a virtual Linux device](quickstart-linux.md) or [Create a virtual Windows device](quickstart.md).

* The [Azure CLI](/cli/azure/install-azure-cli) in your environment. Your Azure CLI version must be 2.0.70 or later. Use `az --version` to validate. This version supports az extension commands and introduces the Knack command framework.
* The [IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension).

## Configure a deployment manifest

A deployment manifest is a JSON document that describes which modules to deploy, how data flows between the modules, and desired properties of the module twins. For more information, see [Learn how to deploy modules and establish routes in IoT Edge](module-composition.md).

To deploy modules by using the Azure CLI, save the deployment manifest locally as a .txt file. You use the file path in the next section when you run the command to apply the configuration to your device.

Here's a basic deployment manifest with one module as an example:

```json
{
  "content": {
    "modulesContent": {
      "$edgeAgent": {
        "properties.desired": {
          "schemaVersion": "1.1",
          "runtime": {
            "type": "docker",
            "settings": {
              "minDockerVersion": "v1.25",
              "loggingOptions": "",
              "registryCredentials": {}
            }
          },
          "systemModules": {
            "edgeAgent": {
              "type": "docker",
              "settings": {
                "image": "mcr.microsoft.com/azureiotedge-agent:1.1",
                "createOptions": "{}"
              }
            },
            "edgeHub": {
              "type": "docker",
              "status": "running",
              "restartPolicy": "always",
              "settings": {
                "image": "mcr.microsoft.com/azureiotedge-hub:1.1",
                "createOptions": "{\"HostConfig\":{\"PortBindings\":{\"5671/tcp\":[{\"HostPort\":\"5671\"}],\"8883/tcp\":[{\"HostPort\":\"8883\"}],\"443/tcp\":[{\"HostPort\":\"443\"}]}}}"
              }
            }
          },
          "modules": {
            "SimulatedTemperatureSensor": {
              "version": "1.1",
              "type": "docker",
              "status": "running",
              "restartPolicy": "always",
              "settings": {
                "image": "mcr.microsoft.com/azureiotedge-simulated-temperature-sensor:1.0",
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
            "upstream": "FROM /messages/* INTO $upstream"
          },
          "storeAndForwardConfiguration": {
            "timeToLiveSecs": 7200
          }
        }
      },
      "SimulatedTemperatureSensor": {
        "properties.desired": {
          "SendData": true,
          "SendInterval": 5
        }
      }
    }
  }
}
```

>[!NOTE]
>This sample deployment manifest uses schema version 1.1 for the IoT Edge agent and hub. Schema version 1.1 was released along with IoT Edge version 1.0.10. It enables features like module startup order and route prioritization.

## Layered deployment

Layered deployments are a type of automatic deployment that can be stacked on top of each other. For more information about layered deployments, see [Understand IoT Edge automatic deployments for single devices or at scale](module-deployment-monitoring.md).

Layered deployments can be created and managed with the Azure CLI like any automatic deployment, with just a few differences. After a layered deployment is created, the Azure CLI works for layered deployments the same as it does for any deployment. To create a layered deployment, add the `--layered` flag to the create command.

The second difference is in the construction of the deployment manifest. Whereas standard automatic deployment must contain the system runtime modules in addition to any user modules, layered deployments can contain only user modules. Layered deployments also need a standard automatic deployment on a device to supply the required components of every IoT Edge device, like the system runtime modules.

Here's a basic layered deployment manifest with one module as an example:

```json
{
  "content": {
    "modulesContent": {
      "$edgeAgent": {
        "properties.desired.modules.SimulatedTemperatureSensor": {
          "settings": {
            "image": "mcr.microsoft.com/azureiotedge-simulated-temperature-sensor:1.0",
              "createOptions": "{}"
          },
          "type": "docker",
          "status": "running",
          "restartPolicy": "always",
          "version": "1.0"
        }
      },
      "$edgeHub": {
        "properties.desired.routes.upstream": "FROM /messages/* INTO $upstream"
      },
      "SimulatedTemperatureSensor": {
        "properties.desired": {
          "SendData": true,
          "SendInterval": 5
        }
      }
    }
  }
}
```
>[!NOTE]
> This layered deployment manifest has a slightly different format from a standard deployment manifest. The desired properties of the runtime modules are collapsed and use dot notation. This formatting is required for the Azure portal to recognize a layered deployment. For example:
>
> - `properties.desired.modules.<module_name>`
> - `properties.desired.routes.<route_name>`

The previous example showed the layered deployment setting `properties.desired` for a module. If this layered deployment targeted a device where the same module was already applied, it would overwrite any existing desired properties. To update desired properties instead of overwriting them, you can define a new subsection. For example:

```json
"SimulatedTemperatureSensor": {
  "properties.desired.layeredProperties": {
    "SendData": true,
    "SendInterval": 5
  }
}
```

The same can also be expressed with:

```json
"SimulatedTemperatureSensor": {
  "properties.desired.layeredProperties.SendData" : true,
  "properties.desired.layeredProperties.SendInterval": 5
}
```

>[!NOTE]
>Currently, all layered deployments must include an `edgeAgent` object to be considered valid. Even if a layered deployment only updates module properties, include an empty object. For example: `"$edgeAgent":{}`. A layered deployment with an empty `edgeAgent` object will be shown as **targeted** in the `edgeAgent` module twin, not **applied**.

In summary, to create a layered deployment:

- Add the `--layered` flag to the Azure CLI create command.
- Don't include system modules.
- Use full dot notation under `$edgeAgent` and `$edgeHub`.

For more information about configuring module twins in layered deployments, see [Layered deployment](module-deployment-monitoring.md#layered-deployment).

## Identify devices by using tags

Before you can create a deployment, you have to be able to specify which devices you want to affect. Azure IoT Edge identifies devices by using *tags* in the device twin. 

Each device can have multiple tags that you define in any way that makes sense for your solution. For example, if you manage a campus of smart buildings, you might add the following tags to a device:

```json
"tags":{
  "location":{
    "building": "20",
    "floor": "2"
  },
  "roomtype": "conference",
  "environment": "prod"
}
```

For more information about device twins and tags, see [Understand and use device twins in IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md).

## Create a deployment

You deploy modules to your target devices by creating a deployment that consists of the deployment manifest and other parameters.

Use the [az iot edge deployment create](/cli/azure/iot/edge/deployment) command to create a deployment:

```azurecli
az iot edge deployment create --deployment-id [deployment id] --hub-name [hub name] --content [file path] --labels "[labels]" --target-condition "[target query]" --priority [int]
```

Use the same command with the `--layered` flag to create a layered deployment.

The create command for deployment takes the following parameters:

* **--layered**. An optional flag to identify the deployment as a layered deployment.
* **--deployment-id**. The name of the deployment that will be created in the IoT hub. Give your deployment a unique name that's up to 128 lowercase letters. Avoid spaces and the following invalid characters: `& ^ [ ] { } \ | " < > /`. This parameter is required.
* **--content**. File path to the deployment manifest JSON. This parameter is required.
* **--hub-name**. Name of the IoT hub in which the deployment will be created. The hub must be in the current subscription. Change your current subscription by using the `az account set -s [subscription name]` command.
* **--labels**. Name/value pairs that describe and help you track your deployments. Labels take JSON formatting for the names and values. For example: `{"HostPlatform":"Linux", "Version:"3.0.1"}`.
* **--target-condition**. The condition that determines which devices will be targeted with this deployment. The condition is based on device twin tags or device twin reported properties, and it should match the expression format. For example: `tags.environment='test' and properties.reported.devicemodel='4000x'`. If the target condition is not specified, then the deployment is not applied to any devices.
* **--priority**. A positive integer. If two or more deployments are targeted at the same device, the deployment with the highest numerical value for priority will apply.
* **--metrics**. Metrics that query the `edgeHub` reported properties to track the status of a deployment. Metrics take JSON input or a file path. For example: `'{"queries": {"mymetric": "SELECT deviceId FROM devices WHERE properties.reported.lastDesiredStatus.code = 200"}}'`.

To monitor a deployment by using the Azure CLI, see [Monitor IoT Edge deployments](how-to-monitor-iot-edge-deployments.md#monitor-a-deployment-with-azure-cli).

> [!NOTE]
> When a new IoT Edge deployment is created, sometimes it can take up to 5 minutes for the IoT Hub to process the new configuration and propagate the new desired properties to the targeted devices.

## Modify a deployment

When you modify a deployment, the changes immediately replicate to all targeted devices.

If you update the target condition, the following updates occur:

* If a device didn't meet the old target condition but meets the new target condition, and this deployment is the highest priority for that device, then this deployment is applied to the device.
* If a device currently running this deployment no longer meets the target condition, it uninstalls this deployment and takes on the next-highest-priority deployment.
* If a device currently running this deployment no longer meets the target condition and doesn't meet the target condition of any other deployments, then no change occurs on the device. The device continues running its current modules in their current state but is not managed as part of this deployment anymore. After the device meets the target condition of any other deployment, it uninstalls this deployment and takes on the new one.

You can't update the content of a deployment, which includes the modules and routes defined in the deployment manifest. If you want to update the content of a deployment, create a new deployment that targets the same devices with a higher priority. You can modify certain properties of an existing module, including the target condition, labels, metrics, and priority.

Use the [az iot edge deployment update](/cli/azure/iot/edge/deployment) command to update a deployment:

```azurecli
az iot edge deployment update --deployment-id [deployment id] --hub-name [hub name] --set [property1.property2='value']
```

The deployment update command takes the following parameters:

* **--deployment-id**. The name of the deployment that exists in the IoT hub.
* **--hub-name**. The name of the IoT hub in which the deployment exists. The hub must be in the current subscription. Switch to the desired subscription by using the command `az account set -s [subscription name]`.
* **--set**. Update a property in the deployment. You can update the following properties:
  * `targetCondition` (for example, `targetCondition=tags.location.state='Oregon'`)
  * `labels`
  * `priority`
* **--add**. Add a new property to the deployment, including target conditions or labels.
* **--remove**. Remove an existing property, including target conditions or labels.

## Delete a deployment

When you delete a deployment, any devices take on their next-highest-priority deployment. If your devices don't meet the target condition of any other deployment, the modules are not removed when the deployment is deleted.

Use the [az iot edge deployment delete](/cli/azure/iot/edge/deployment) command to delete a deployment:

```azurecli
az iot edge deployment delete --deployment-id [deployment id] --hub-name [hub name]
```

The `deployment delete` command takes the following parameters:

* **--deployment-id**. The name of the deployment that exists in the IoT hub.
* **--hub-name**. The name of the IoT hub in which the deployment exists. The hub must be in the current subscription. Switch to the desired subscription by using the command `az account set -s [subscription name]`.

## Next steps

Learn more about [deploying modules to IoT Edge devices](module-deployment-monitoring.md).
