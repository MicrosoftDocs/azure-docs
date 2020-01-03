---
title: Deploy modules at scale using Visual Studio Code - Azure IoT Edge
description: Use the IoT extension for Visual Studio Code to create automatic deployments for groups of IoT Edge devices
keywords: 
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 1/3/2020
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Deploy and monitor IoT Edge modules at scale using Visual Studio Code

Create an **IoT Edge automatic deployment** using Visual Studio Code to manage ongoing deployments for many devices at once. Automatic deployments for IoT Edge are part of the [automatic device management](/azure/iot-hub/iot-hub-automatic-device-management) feature of IoT Hub. Deployments are dynamic processes that enable you to deploy multiple modules to multiple devices, track the status and health of the modules, and make changes when necessary.

For more information, see [Understand IoT Edge automatic deployments for single devices or at scale](module-deployment-monitoring.md).

In this article, you set up Visual Studio Code and the IoT extension. You then learn how to deploy modules to a set of IoT Edge devices and monitor the progress using Visual Studio Code.

## Prerequisites

* An [IoT hub](../iot-hub/iot-hub-create-through-portal.md) in your Azure subscription.
* An [IoT Edge device](how-to-register-device.md#register-with-visual-studio-code) with the IoT Edge runtime installed.
* [Visual Studio Code](https://code.visualstudio.com/).
* [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools#overview) for Visual Studio Code.

## Sign in to access your IoT hub

You can use the Azure IoT extensions for Visual Studio Code to perform operations with your IoT hub. For these operations to work, you need to sign in to your Azure account and select the IoT hub that you are working on.

1. In Visual Studio Code, open the **Explorer** view.

1. At the bottom of the Explorer, expand the **Azure IoT Hub** section.

1. Click on the **...** in the **Azure IoT Hub** section header. If you don't see the ellipsis, hover over the header.

1. Choose **Select IoT Hub**.

1. If you are not signed in to your Azure account, follow the prompts to do so.

1. Select your Azure subscription.

1. Select your IoT hub.

## Configure a deployment manifest

A deployment manifest is a JSON document that describes which modules to deploy, how data flows between the modules, and desired properties of the module twins. For more information, see [Learn how to deploy modules and establish routes in IoT Edge](module-composition.md).

To deploy modules using Visual Studio Code, save the deployment manifest locally as a .JSON file. You use the file path in the next section when you run the command to apply the configuration to your device.

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

## Create deployment at Scale

You deploy modules to your target devices by creating a deployment that consists of the deployment manifest and by providing inputs for a few parameters.

1. In the Visual Studio Code explorer view, expand the Azure IoT Hub Devices section.

1. Right-click on the IoT Edge device that you want to configure with the deployment manifest.

    > [!TIP]
    > To confirm that the device you've chosen is an IoT Edge device, select it to expand the list of modules and verify the presence of **$edgeHub** and **$edgeAgent**. Every IoT Edge device includes these two modules.

1. From the **View** menu, select **Command Palette**.

1. Navigate to the deployment manifest JSON file that you want to use, and click **Select Edge Deployment Manifest**.

1. Search for and select the **Azure IoT Edge: Create Deployment at Scale** command. You will be asked for a few parameter values, starting with the **deployment id**.

   ![Specify a deployment id](./media/how-to-deploy-monitor-vscode/create-deployment-at-scale.png)

   Specify values for these parameters:

  | Parameter | Description |
  | --- | --- |
  | Deployment id | The name of the deployment that will be created in the IoT hub. Give your deployment a unique name that is up to 128 lowercase letters. Avoid spaces and the following invalid characters: `& ^ [ ] { } \ | " < > /`. |
  | Target condition | Enter a target condition to determine which devices will be targeted with this deployment. The condition is based on device twin tags or device twin reported properties and should match the expression format. For example, `tags.environment='test' and properties.reported.devicemodel='4000x'`. |
  | Priority |  A positive integer. In the event that two or more deployments are targeted at the same device, the deployment with the highest numerical value for Priority will apply. |

  After specifying the priority, the terminal should display output similar to the following:

   ```cmd
   [Edge] Start deployment with deployment id [{specified-value}] and target condition [{specified-value}]
   [Edge] Deployment with deployment id [{specified-value}] succeeded.
   ```

## View modules on your device

Once you've deployed modules to your device, you can view all of them in the **Azure IoT Hub** section. Select the arrow next to your IoT Edge device to expand it. All the currently running modules are displayed.

If you recently deployed new modules to a device, hover over the **Azure IoT Hub Devices** section header and select the refresh icon to update the view.

Right-click the name of a module to view and edit the module twin.

## Next steps

Learn more about [Deploying modules to IoT Edge devices](module-deployment-monitoring.md).
