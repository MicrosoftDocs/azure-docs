---
title: Deploy modules at scale using Azure CLI - Azure IoT Edge
description: Use the IoT extension for Azure CLI to create automatic deployments for groups of IoT Edge devices
keywords: 
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 11/20/2019
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Deploy and monitor IoT Edge modules at scale using the Azure CLI

Create an **IoT Edge automatic deployment** using the Azure command-line interface to manage ongoing deployments for many devices at once. Automatic deployments for IoT Edge are part of the [automatic device management](/azure/iot-hub/iot-hub-automatic-device-management) feature of IoT Hub. Deployments are dynamic processes that enable you to deploy multiple modules to multiple devices, track the status and health of the modules, and make changes when necessary.

For more information, see [Understand IoT Edge automatic deployments for single devices or at scale](module-deployment-monitoring.md).

In this article, you set up Azure CLI and the IoT extension. You then learn how to deploy modules to a set of IoT Edge devices and monitor the progress using the available CLI commands.

## CLI Prerequisites

* An [IoT hub](../iot-hub/iot-hub-create-using-cli.md) in your Azure subscription.
* [IoT Edge devices](how-to-register-device.md#prerequisites-for-the-azure-cli) with the IoT Edge runtime installed.
* [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) in your environment. At a minimum, your Azure CLI version must be 2.0.24 or above. Use `az --version` to validate. This version supports az extension commands and introduces the Knack command framework.
* The [IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension).

## Configure a deployment manifest

A deployment manifest is a JSON document that describes which modules to deploy, how data flows between the modules, and desired properties of the module twins. For more information, see [Learn how to deploy modules and establish routes in IoT Edge](module-composition.md).

To deploy modules using Azure CLI, save the deployment manifest locally as a .txt file. You use the file path in the next section when you run the command to apply the configuration to your device.

Here's a basic deployment manifest with one module as an example:

```json
{
  "content": {
    "modulesContent": {
      "$edgeAgent": {
        "properties.desired": {
          "schemaVersion": "1.0",
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
                "image": "mcr.microsoft.com/azureiotedge-agent:1.0",
                "createOptions": "{}"
              }
            },
            "edgeHub": {
              "type": "docker",
              "status": "running",
              "restartPolicy": "always",
              "settings": {
                "image": "mcr.microsoft.com/azureiotedge-hub:1.0",
                "createOptions": "{\"HostConfig\":{\"PortBindings\":{\"5671/tcp\":[{\"HostPort\":\"5671\"}],\"8883/tcp\":[{\"HostPort\":\"8883\"}],\"443/tcp\":[{\"HostPort\":\"443\"}]}}}"
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

## Layered deployment

Layered deployments are a type of automatic deployment that can be stacked on top of each other. For more information about layered deployments, see [Understand IoT Edge automatic deployments for single devices or at scale](module-deployment-monitoring.md).

Layered deployments can be created and managed with the Azure CLI like any automatic deployment, with just a few differences. Once a layered deployment is created, same Azure CLI work for layered deployments the same as any deployment. To create a layered deployment, add the `--layered` flag to the create command.

The second difference is in the construction of the deployment manifest. While standard automatic deployment must contain the system runtime modules in addition to any user modules, layered deployments can only contain user modules. Instead, layered deployments need a standard automatic deployment be on a device as well, to supply the required components of every IoT Edge device, like the system runtime modules.

Here's a basic layered deployment manifest with one module as an example:

```json
{
  "content": {
    "modulesContent": {
      "$edgeAgent": {
        "properties.desired.modules.SimulatedTemperatureSensor": {
          "settings": {
            "image": "mcr.microsoft.com/azureiotedge-simulated-temperature-sensor:1.0",
              "createOptions": ""
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

The previous example showed a layered deployment setting the `properties.desired` for a module. If this layered deployment targeted a device where the same module was already applied, it would overwrite any existing desired properties. In order to update, instead of overwrite, desired properties, you can define a new subsection. For example:

```json
"SimulatedTEmperatureSensor": {
  "properties.desired.layeredProperties": {
    "SendData": true,
    "SendInterval": 5
  }
}
```

For more information about configuring module twins in layered deployments, see [Layered deployment](module-deployment-monitoring.md#layered-deployment)

## Identify devices using tags

Before you can create a deployment, you have to be able to specify which devices you want to affect. Azure IoT Edge identifies devices using **tags** in the device twin. Each device can have multiple tags that you define in any way that makes sense for your solution. For example, if you manage a campus of smart buildings, you might add the following tags to a device:

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

You deploy modules to your target devices by creating a deployment that consists of the deployment manifest as well as other parameters.

Use the [az iot edge deployment create](https://docs.microsoft.com/cli/azure/ext/azure-cli-iot-ext/iot/edge/deployment?view=azure-cli-latest#ext-azure-cli-iot-ext-az-iot-edge-deployment-create) command to create a deployment:

```cli
az iot edge deployment create --deployment-id [deployment id] --hub-name [hub name] --content [file path] --labels "[labels]" --target-condition "[target query]" --priority [int]
```

Use the same command with the `--layered` flag to create a layered deploymet.

The deployment create command takes the following parameters:

* **--layered** - An optional flag to identify the deployment as a layered deployment.
* **--deployment-id** - The name of the deployment that will be created in the IoT hub. Give your deployment a unique name that is up to 128 lowercase letters. Avoid spaces and the following invalid characters: `& ^ [ ] { } \ | " < > /`. Required parameter.
* **--content** - Filepath to the deployment manifest JSON. Required parameter.
* **--hub-name** - Name of the IoT hub in which the deployment will be created. The hub must be in the current subscription. Change your current subscription with the `az account set -s [subscription name]` command.
* **--labels** - Add labels to help track your deployments. Labels are Name, Value pairs that describe your deployment. Labels take JSON formatting for the names and values. For example, `{"HostPlatform":"Linux", "Version:"3.0.1"}`
* **--target-condition** - Enter a target condition to determine which devices will be targeted with this deployment. The condition is based on device twin tags or device twin reported properties and should match the expression format. For example, `tags.environment='test' and properties.reported.devicemodel='4000x'`.
* **--priority** - A positive integer. In the event that two or more deployments are targeted at the same device, the deployment with the highest numerical value for Priority will apply.
* **--metrics** - Create metrics that query the edgeHub reported properties to track the status of a deployment. Metrics take JSON input or a filepath. For example, `'{"queries": {"mymetric": "SELECT deviceId FROM devices WHERE properties.reported.lastDesiredStatus.code = 200"}}'`.

## Monitor a deployment

Use the [az iot edge deployment show](https://docs.microsoft.com/cli/azure/ext/azure-cli-iot-ext/iot/edge/deployment?view=azure-cli-latest#ext-azure-cli-iot-ext-az-iot-edge-deployment-show) command to display the details of a single deployment:

```cli
az iot edge deployment show --deployment-id [deployment id] --hub-name [hub name]
```

The deployment show command takes the following parameters:

* **--deployment-id** - The name of the deployment that exists in the IoT hub. Required parameter.
* **--hub-name** - Name of the IoT hub in which the deployment exists. The hub must be in the current subscription. Switch to the desired subscription with the command `az account set -s [subscription name]`

Inspect the deployment in the command window. The **metrics** property lists a count for each metric that is evaluated by each hub:

* **targetedCount** - A system metric that specifies the number of device twins in IoT Hub that match the targeting condition.
* **appliedCount** - A system metric specifies the number of devices that have had the deployment content applied to their module twins in IoT Hub.
* **reportedSuccessfulCount** - A device metric that specifies the number of IoT Edge devices in the deployment reporting success from the IoT Edge client runtime.
* **reportedFailedCount** - A device metric that specifies the number of IoT Edge devices in the deployment reporting failure from the IoT Edge client runtime.

You can show a list of device IDs or objects for each of the metrics by using the [az iot edge deployment show-metric](https://docs.microsoft.com/cli/azure/ext/azure-cli-iot-ext/iot/edge/deployment?view=azure-cli-latest#ext-azure-cli-iot-ext-az-iot-edge-deployment-show-metric) command:

```cli
az iot edge deployment show-metric --deployment-id [deployment id] --metric-id [metric id] --hub-name [hub name]
```

The deployment show-metric command takes the following parameters:

* **--deployment-id** - The name of the deployment that exists in the IoT hub.
* **--metric-id** - The name of the metric for which you want to see the list of device IDs, for example `reportedFailedCount`.
* **--hub-name** - Name of the IoT hub in which the deployment exists. The hub must be in the current subscription. Switch to the desired subscription with the command `az account set -s [subscription name]`.

## Modify a deployment

When you modify a deployment, the changes immediately replicate to all targeted devices.

If you update the target condition, the following updates occur:

* If a device didn't meet the old target condition, but meets the new target condition and this deployment is the highest priority for that device, then this deployment is applied to the device.
* If a device currently running this deployment no longer meets the target condition, it uninstalls this deployment and takes on the next highest priority deployment.
* If a device currently running this deployment no longer meets the target condition and doesn't meet the target condition of any other deployments, then no change occurs on the device. The device continues running its current modules in their current state, but is not managed as part of this deployment anymore. Once it meets the target condition of any other deployment, it uninstalls this deployment and takes on the new one.

You cannot update the content of a deployment, which includes the modules and routes defined in the deployment manifest. If you want to update the content of a deployment, you do so by creating a new deployment that targets the same devices with a higher priority. You can modify certain properties of an existing module, including the target condition, labels, metrics, and priority.

Use the [az iot edge deployment update](https://docs.microsoft.com/cli/azure/ext/azure-cli-iot-ext/iot/edge/deployment?view=azure-cli-latest#ext-azure-cli-iot-ext-az-iot-edge-deployment-update) command to update a deployment:

```cli
az iot edge deployment update --deployment-id [deployment id] --hub-name [hub name] --set [property1.property2='value']
```

The deployment update command takes the following parameters:

* **--deployment-id** - The name of the deployment that exists in the IoT hub.
* **--hub-name** - Name of the IoT hub in which the deployment exists. The hub must be in the current subscription. Switch to the desired subscription with the command `az account set -s [subscription name]`
* **--set** - Update a property in the deployment. You can update the following properties:
  * targetCondition - for example `targetCondition=tags.location.state='Oregon'`
  * labels
  * priority
* **--add** - Add a new property to the deployment, including target conditions or labels.
* **--remove** - Remove an existing property, including target conditions or labels.

## Delete a deployment

When you delete a deployment, any devices take on their next highest priority deployment. If your devices don't meet the target condition of any other deployment, then the modules are not removed when the deployment is deleted.

Use the [az iot edge deployment delete](https://docs.microsoft.com/cli/azure/ext/azure-cli-iot-ext/iot/edge/deployment?view=azure-cli-latest#ext-azure-cli-iot-ext-az-iot-edge-deployment-delete) command to delete a deployment:

```cli
az iot edge deployment delete --deployment-id [deployment id] --hub-name [hub name]
```

The deployment delete command takes the following parameters:

* **--deployment-id** - The name of the deployment that exists in the IoT hub.
* **--hub-name** - Name of the IoT hub in which the deployment exists. The hub must be in the current subscription. Switch to the desired subscription with the command `az account set -s [subscription name]`

## Next steps

Learn more about [Deploying modules to IoT Edge devices](module-deployment-monitoring.md).
